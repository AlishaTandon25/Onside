import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/goals/[id]/updates - Get all updates for a goal
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

    const updates = await prisma.goalUpdate.findMany({
      where: { goalId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checkedInBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ updates });
  } catch (error: any) {
    console.error("Error fetching goal updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/goals/[id]/updates - Create a new update for a goal
export async function POST(
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

    // Check if goal exists
    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const {
      newValue,
      accomplishments,
      blockers,
      nextSteps,
      comment,
      cadence,
      status,
    } = body;

    // Calculate progress
    const progressPercentage = goal.targetValue > 0 
      ? Math.min(100, (newValue / goal.targetValue) * 100)
      : 0;

    const update = await prisma.goalUpdate.create({
      data: {
        goalId: id,
        userId: session.user.id,
        previousValue: goal.currentValue,
        newValue: parseFloat(newValue),
        progressPercentage,
        accomplishments: accomplishments || [],
        blockers: blockers || [],
        nextSteps: nextSteps || [],
        comment,
        cadence: cadence || "WEEKLY",
        status: status || "ON_TRACK",
        actualAchievement: parseFloat(newValue),
        computedProgress: progressPercentage,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update goal's current value
    await prisma.goal.update({
      where: { id },
      data: {
        currentValue: parseFloat(newValue),
        progress: progressPercentage,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATED",
        resource: "GOAL_UPDATE",
        resourceId: update.id,
        userId: session.user.id,
        details: `Added update to goal: ${goal.title}`,
      },
    });

    // Create notification for manager if exists
    const owner = await prisma.user.findUnique({
      where: { id: goal.ownerId },
      select: { managerId: true },
    });

    if (owner?.managerId) {
      await prisma.notification.create({
        data: {
          type: "GOAL_UPDATED",
          message: `${session.user.name} updated progress on "${goal.title}"`,
          userId: owner.managerId,
        },
      });
    }

    return NextResponse.json({ update }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating goal update:", error);
    return NextResponse.json(
      { error: "Failed to create update", details: error.message },
      { status: 500 }
    );
  }
}
