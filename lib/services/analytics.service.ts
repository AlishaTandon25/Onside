import { prisma } from "@/lib/prisma";

export async function getDashboardAnalytics() {
  const [totalGoals, activeUsers, completedGoals] = await Promise.all([
    prisma.goal.count({ where: { status: { not: "DRAFT" } } }),
    prisma.user.count({ where: { goalUpdates: { some: {} } } }),
    prisma.goal.count({ where: { status: "COMPLETED" } }),
  ]);

  const goalsByStatus = await prisma.goal.groupBy({
    by: ['status'],
    _count: true,
  });

  return {
    overview: {
      totalGoals,
      activeUsers,
      completedGoals,
      completionRate: totalGoals > 0 ? Number(((completedGoals / totalGoals) * 100).toFixed(2)) : 0,
    },
    goalsByStatus: goalsByStatus.map(g => ({ status: g.status, count: g._count })),
  };
}

export async function getDepartmentAnalytics() {
  const goals = await prisma.goal.findMany({
    where: { status: { not: "DRAFT" } },
    select: {
      progress: true,
      owner: { select: { department: { select: { id: true, name: true } } } }
    }
  });

  const deptMap: Record<string, { name: string, total: number, progress: number }> = {};
  goals.forEach(g => {
    const dId = g.owner.department?.id || "unassigned";
    const dName = g.owner.department?.name || "Unassigned";
    if (!deptMap[dId]) deptMap[dId] = { name: dName, total: 0, progress: 0 };
    deptMap[dId].total += 1;
    deptMap[dId].progress += g.progress;
  });

  return Object.entries(deptMap).map(([id, data]) => ({
    departmentId: id,
    departmentName: data.name,
    totalGoals: data.total,
    averageProgress: Number((data.progress / data.total).toFixed(2)),
  }));
}

export async function getTrends() {
  const goals = await prisma.goal.findMany({
    select: { createdAt: true },
    where: { status: { not: "DRAFT" } }
  });

  const trendsMap: Record<string, number> = {};
  goals.forEach(g => {
    const month = g.createdAt.toISOString().slice(0, 7); // YYYY-MM
    trendsMap[month] = (trendsMap[month] || 0) + 1;
  });

  return Object.entries(trendsMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, newGoals: count }));
}

export async function getHeatmap() {
  const goals = await prisma.goal.findMany({
    where: { status: { not: "DRAFT" } },
    select: { priority: true, status: true },
  });

  const heatmapMap: Record<string, Record<string, number>> = {};
  goals.forEach(g => {
    if (!heatmapMap[g.priority]) heatmapMap[g.priority] = {};
    heatmapMap[g.priority][g.status] = (heatmapMap[g.priority][g.status] || 0) + 1;
  });

  return Object.entries(heatmapMap).map(([priority, statusCounts]) => ({
    priority,
    statuses: statusCounts
  }));
}
