import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/goals - Get all goals for the current user
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const includeShared = searchParams.get("includeShared") === "true";

    // Build query based on user role
    const userId = session.user.id;
    const userRole = session.user.role;

    let goals;

    if (userRole === "ADMIN") {
      // Admin can see all goals
      goals = await prisma.goal.findMany({
        where: status ? { status: status as GoalStatus } : undefined,
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
            take: 1,
          },
          approvals: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              updates: true,
              participants: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    } else if (userRole === "MANAGER") {
      // Manager can see their own goals and their team's goals
      const teamMembers = await prisma.user.findMany({
        where: { managerId: userId },
        select: { id: true },
      });

      const teamMemberIds = teamMembers.map((m) => m.id);

      goals = await prisma.goal.findMany({
        where: {
          AND: [
            status ? { status: status as GoalStatus } : {},
            {
              OR: [
                { ownerId: userId },
                { ownerId: { in: teamMemberIds } },
                includeShared
                  ? {
                      participants: {
                        some: { userId },
                      },
                    }
                  : {},
              ],
            },
          ],
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
          updates: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          approvals: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              updates: true,
              participants: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    } else {
      // Employee can see their own goals and shared goals
      goals = await prisma.goal.findMany({
        where: {
          AND: [
            status ? { status: status as GoalStatus } : {},
            {
              OR: [
                { ownerId: userId },
                includeShared
                  ? {
                      participants: {
                        some: { userId },
                      },
                    }
                  : {},
              ],
            },
          ],
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
          updates: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          approvals: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              updates: true,
              participants: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }

    // Calculate progress for each goal
    const goalsWithProgress = goals.map((goal) => ({
      ...goal,
      progress: goal.targetValue > 0 
        ? Math.min(100, (goal.currentValue / goal.targetValue) * 100)
        : 0,
    }));

    return NextResponse.json({ goals: goalsWithProgress });
  } catch (error: any) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      targetValue,
      weightage,
      priority,
      quarter,
      thrustArea,
      startDate,
      endDate,
      unitOfMeasurement,
    } = body;

    // Validate required fields
    if (!title || !targetValue) {
      return NextResponse.json(
        { error: "Title and target value are required" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        targetValue: parseFloat(targetValue),
        currentValue: 0,
        weightage: weightage || 10,
        priority: priority || "MEDIUM",
        quarter: quarter || "Q1",
        thrustArea: thrustArea || "General",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        unitOfMeasurement: unitOfMeasurement || "NUMERIC",
        status: "DRAFT",
        ownerId: session.user.id,
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
        action: "CREATED",
        resource: "GOAL",
        resourceId: goal.id,
        userId: session.user.id,
        details: `Created goal: ${title}`,
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal", details: error.message },
      { status: 500 }
    );
  }
}
