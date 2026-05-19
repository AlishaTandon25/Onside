import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/dashboard/stats - Get dashboard statistics based on user role
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    if (userRole === "EMPLOYEE") {
      // Employee stats
      const goals = await prisma.goal.findMany({
        where: { ownerId: userId },
        include: {
          updates: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      const totalGoals = goals.length;
      const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
      const approvedGoals = goals.filter((g) => g.status === "APPROVED").length;
      const draftGoals = goals.filter((g) => g.status === "DRAFT").length;
      const atRiskGoals = goals.filter((g) => 
        g.updates[0]?.status === "AT_RISK"
      ).length;

      const avgProgress = totalGoals > 0
        ? goals.reduce((sum, g) => sum + (g.progress || 0), 0) / totalGoals
        : 0;

      // Count goals needing updates (no update in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const goalsNeedingUpdate = goals.filter((g) => {
        const lastUpdate = g.updates[0];
        return !lastUpdate || lastUpdate.createdAt < sevenDaysAgo;
      }).length;

      return NextResponse.json({
        totalGoals,
        completedGoals,
        approvedGoals,
        draftGoals,
        atRiskGoals,
        avgProgress: Math.round(avgProgress),
        goalsNeedingUpdate,
        goals: goals.map((g) => ({
          id: g.id,
          title: g.title,
          thrustArea: g.thrustArea,
          weightage: g.weightage,
          progress: g.progress || 0,
          status: g.status,
          lastUpdate: g.updates[0]?.createdAt || null,
        })),
      });
    } else if (userRole === "MANAGER") {
      // Manager stats - own goals + team goals
      const teamMembers = await prisma.user.findMany({
        where: { managerId: userId },
        select: { id: true, name: true, email: true },
      });

      const teamMemberIds = teamMembers.map((m) => m.id);

      const allGoals = await prisma.goal.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { ownerId: { in: teamMemberIds } },
          ],
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
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
        },
      });

      const teamGoals = allGoals.filter((g) => teamMemberIds.includes(g.ownerId));

      const pendingApprovals = teamGoals.filter(
        (g) => g.status === "SUBMITTED"
      ).length;

      const atRiskGoals = teamGoals.filter((g) => 
        g.updates[0]?.status === "AT_RISK"
      ).length;

      const teamAvgCompletion = teamGoals.length > 0
        ? teamGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / teamGoals.length
        : 0;

      // Team performance by member
      const teamPerformance = teamMembers.map((member) => {
        const memberGoals = allGoals.filter((g) => g.ownerId === member.id);
        const avgProgress = memberGoals.length > 0
          ? memberGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / memberGoals.length
          : 0;

        return {
          userId: member.id,
          name: member.name,
          email: member.email,
          totalGoals: memberGoals.length,
          avgProgress: Math.round(avgProgress),
          atRisk: memberGoals.filter((g) => g.updates[0]?.status === "AT_RISK").length,
        };
      });

      return NextResponse.json({
        totalTeamMembers: teamMembers.length,
        totalGoals: allGoals.length,
        teamGoals: teamGoals.length,
        pendingApprovals,
        atRiskGoals,
        teamAvgCompletion: Math.round(teamAvgCompletion),
        teamPerformance,
        goalsForApproval: teamGoals
          .filter((g) => g.status === "SUBMITTED")
          .map((g) => ({
            id: g.id,
            title: g.title,
            owner: g.owner,
            submittedAt: g.updatedAt,
          })),
      });
    } else if (userRole === "ADMIN") {
      // Admin stats - organization-wide
      const totalUsers = await prisma.user.count();
      const totalGoals = await prisma.goal.count();

      const goals = await prisma.goal.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          updates: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      const submittedGoals = goals.filter((g) => 
        ["SUBMITTED", "APPROVED", "COMPLETED"].includes(g.status)
      ).length;

      const approvedGoals = goals.filter((g) => g.status === "APPROVED").length;

      const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;

      const avgCompletion = goals.length > 0
        ? goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length
        : 0;

      const escalations = await prisma.escalation.count({
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      });

      // Department performance
      const departments = await prisma.department.findMany({
        include: {
          users: {
            include: {
              ownedGoals: true,
            },
          },
        },
      });

      const departmentPerformance = departments.map((dept) => {
        const deptGoals = dept.users.flatMap((u) => u.ownedGoals);
        const avgProgress = deptGoals.length > 0
          ? deptGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / deptGoals.length
          : 0;

        return {
          id: dept.id,
          name: dept.name,
          totalUsers: dept.users.length,
          totalGoals: deptGoals.length,
          avgProgress: Math.round(avgProgress),
        };
      });

      // Recent audit logs
      const recentAudits = await prisma.auditLog.findMany({
        take: 10,
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
      });

      return NextResponse.json({
        totalUsers,
        totalGoals,
        submittedGoals,
        submissionRate: totalGoals > 0 ? Math.round((submittedGoals / totalGoals) * 100) : 0,
        approvalRate: submittedGoals > 0 ? Math.round((approvedGoals / submittedGoals) * 100) : 0,
        avgCompletion: Math.round(avgCompletion),
        activeEscalations: escalations,
        departmentPerformance,
        recentAudits: recentAudits.map((audit) => ({
          id: audit.id,
          timestamp: audit.createdAt,
          user: audit.user?.name || "System",
          action: audit.action,
          resource: audit.resource,
          resourceId: audit.resourceId,
          details: audit.details,
        })),
      });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    );
  }
}
