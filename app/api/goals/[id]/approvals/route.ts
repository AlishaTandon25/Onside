import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// POST /api/goals/[id]/approvals - Approve or reject a goal
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    // Only managers and admins can approve
    if (userRole !== "MANAGER" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only managers and admins can approve goals" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, comment } = body;

    // Validate status
    if (!["APPROVED", "REJECTED", "RETURNED_FOR_REWORK"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if goal exists
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            managerId: true,
          },
        },
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Check if user is the goal owner's manager or admin
    const isManager = goal.owner.managerId === session.user.id;
    const isAdmin = userRole === "ADMIN";

    if (!isManager && !isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to approve this goal" },
        { status: 403 }
      );
    }

    // Create approval record
    const approval = await prisma.goalApproval.create({
      data: {
        goalId: id,
        managerId: session.user.id,
        status: status as GoalStatus,
        comment,
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update goal status
    await prisma.goal.update({
      where: { id },
      data: {
        status: status as GoalStatus,
        ...(status === "APPROVED" && { isLocked: true }),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: status,
        resource: "GOAL",
        resourceId: id,
        userId: session.user.id,
        details: `${status} goal: ${goal.title}`,
      },
    });

    // Create notification for goal owner
    await prisma.notification.create({
      data: {
        type: "APPROVAL_REQUIRED",
        message: `Your goal "${goal.title}" has been ${status.toLowerCase()}`,
        userId: goal.ownerId,
      },
    });

    return NextResponse.json({ approval }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating approval:", error);
    return NextResponse.json(
      { error: "Failed to create approval", details: error.message },
      { status: 500 }
    );
  }
}
