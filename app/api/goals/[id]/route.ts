import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/goals/[id] - Get a specific goal
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        updates: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        approvals: {
          orderBy: { createdAt: "desc" },
          include: {
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Check access permissions
    const userId = session.user.id;
    const userRole = session.user.role;

    const isOwner = goal.ownerId === userId;
    const isParticipant = goal.participants.some((p) => p.userId === userId);
    const isAdmin = userRole === "ADMIN";

    let isManager = false;
    if (userRole === "MANAGER") {
      const teamMembers = await prisma.user.findMany({
        where: { managerId: userId },
        select: { id: true },
      });
      isManager = teamMembers.some((m) => m.id === goal.ownerId);
    }

    if (!isOwner && !isParticipant && !isManager && !isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ goal });
  } catch (error: any) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { error: "Failed to fetch goal", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/goals/[id] - Update a goal
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if goal exists and user has permission
    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    // Only owner can update (unless admin)
    if (existingGoal.ownerId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Prevent updates to locked goals
    if (existingGoal.isLocked && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Cannot update locked goal" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      targetValue,
      currentValue,
      weightage,
      priority,
      quarter,
      thrustArea,
      startDate,
      endDate,
      status,
    } = body;

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(targetValue !== undefined && { targetValue: parseFloat(targetValue) }),
        ...(currentValue !== undefined && { currentValue: parseFloat(currentValue) }),
        ...(weightage !== undefined && { weightage }),
        ...(priority && { priority }),
        ...(quarter && { quarter }),
        ...(thrustArea && { thrustArea }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATED",
        resource: "GOAL",
        resourceId: goal.id,
        userId: session.user.id,
        details: `Updated goal: ${goal.title}`,
      },
    });

    return NextResponse.json({ goal });
  } catch (error: any) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Failed to update goal", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    // Only owner or admin can delete
    if (existingGoal.ownerId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Prevent deletion of locked goals
    if (existingGoal.isLocked && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Cannot delete locked goal" },
        { status: 400 }
      );
    }

    await prisma.goal.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "DELETED",
        resource: "GOAL",
        resourceId: id,
        userId: session.user.id,
        details: `Deleted goal: ${existingGoal.title}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { error: "Failed to delete goal", details: error.message },
      { status: 500 }
    );
  }
}
