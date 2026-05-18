import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuthenticatedUser } from "@/lib/rbac";

export async function getDashboardData(user: AuthenticatedUser) {
  const role = user.role as Role;

  switch (role) {
    case Role.EMPLOYEE:
      return getEmployeeDashboard(user.id);
    case Role.MANAGER:
      return getManagerDashboard(user.id);
    case Role.ADMIN:
      return getAdminDashboard();
    default:
      return getEmployeeDashboard(user.id);
  }
}

async function getEmployeeDashboard(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { ownerId: userId, status: { not: "DRAFT" } },
    select: { progress: true },
  });

  const personalGoals = goals.length;
  const completionRate = personalGoals > 0 
    ? goals.reduce((acc, goal) => acc + goal.progress, 0) / personalGoals 
    : 0;

  const pendingFeedback = await prisma.goal.count({
    where: { ownerId: userId, status: "RETURNED_FOR_REWORK" },
  });

  const aiInsights = await prisma.aIInsight.findMany({
    where: { goal: { ownerId: userId } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    role: "EMPLOYEE",
    personalGoals,
    completionRate: Number(completionRate.toFixed(2)),
    pendingFeedback,
    aiInsights,
  };
}

async function getManagerDashboard(userId: string) {
  const teamGoals = await prisma.goal.findMany({
    where: { owner: { managerId: userId }, status: { not: "DRAFT" } },
    select: { progress: true },
  });

  const totalTeamGoals = teamGoals.length;
  const teamCompletion = totalTeamGoals > 0 
    ? teamGoals.reduce((acc, goal) => acc + goal.progress, 0) / totalTeamGoals 
    : 0;

  const approvalQueue = await prisma.goal.count({
    where: { owner: { managerId: userId }, status: "SUBMITTED" },
  });

  const atRiskUpdates = await prisma.goalUpdate.findMany({
    where: {
      goal: { owner: { managerId: userId } },
      status: "AT_RISK"
    },
    select: { goalId: true },
    distinct: ['goalId']
  });
  const atRiskGoals = atRiskUpdates.length;

  const escalations = await prisma.escalation.count({
    where: {
      status: "OPEN",
      OR: [
        { reporter: { managerId: userId } },
        { assignedToId: userId }
      ]
    },
  });

  return {
    role: "MANAGER",
    teamCompletion: Number(teamCompletion.toFixed(2)),
    approvalQueue,
    atRiskGoals,
    escalations,
  };
}

async function getAdminDashboard() {
  const allGoals = await prisma.goal.findMany({
    where: { status: { not: "DRAFT" } },
    select: { progress: true, owner: { select: { departmentId: true } } },
  });

  const orgKPIs = {
    totalGoals: allGoals.length,
    globalCompletion: allGoals.length > 0 
      ? allGoals.reduce((acc, goal) => acc + goal.progress, 0) / allGoals.length 
      : 0,
  };

  const deptMap: Record<string, { total: number; progress: number }> = {};
  allGoals.forEach(g => {
    const d = g.owner.departmentId || "Unassigned";
    if (!deptMap[d]) deptMap[d] = { total: 0, progress: 0 };
    deptMap[d].total += 1;
    deptMap[d].progress += g.progress;
  });

  const departmentPerformance = Object.entries(deptMap).map(([deptId, data]) => ({
    departmentId: deptId,
    completionRate: Number((data.progress / data.total).toFixed(2)),
  }));

  const globalEscalations = await prisma.escalation.count({
    where: { status: "OPEN" },
  });

  const auditSummary = await prisma.auditLog.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });

  return {
    role: "ADMIN",
    orgKPIs: {
      ...orgKPIs,
      globalCompletion: Number(orgKPIs.globalCompletion.toFixed(2)),
    },
    departmentPerformance,
    globalEscalations,
    auditSummary,
  };
}
