/**
 * Job: generate-ai-insights
 * Schedule: Nightly at 2:00 AM (0 2 * * *)
 *
 * Iterates through all active users, generates AI-powered insights
 * based on their role (employee/manager/admin), and persists them.
 * Old insights are cleaned up to avoid unbounded growth.
 *
 * Usage: npx tsx jobs/generate-ai-insights.ts
 */

import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateInsightsFromAI, type ParsedInsight } from "@/lib/ai/openai";

// ─── Config ──────────────────────────────────────────────────────────
const INSIGHTS_RETENTION_DAYS = 30;
const CONCURRENCY = 5;
const MAX_INSIGHTS_PER_USER = 20;

// ─── Helpers ─────────────────────────────────────────────────────────
function elapsed(start: number): string {
  return `${((Date.now() - start) / 1000).toFixed(2)}s`;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Context builders per role ───────────────────────────────────────
async function buildEmployeeContext(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { ownerId: userId },
    include: {
      updates: { orderBy: { createdAt: "desc" }, take: 3 },
    },
    take: 15,
  });

  const overdueCount = goals.filter(
    (g) => g.dueDate && g.dueDate < new Date() && g.status !== "COMPLETED"
  ).length;

  const avgProgress =
    goals.length > 0
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
      : 0;

  return {
    totalGoals: goals.length,
    overdueCount,
    avgProgress: Math.round(avgProgress),
    goals: goals.map((g) => ({
      title: g.title,
      status: g.status,
      progress: g.progress,
      dueDate: g.dueDate,
      priority: g.priority,
      recentUpdates: g.updates.map((u) => ({
        status: u.status,
        progressPercentage: u.progressPercentage,
        createdAt: u.createdAt,
      })),
    })),
  };
}

async function buildManagerContext(userId: string) {
  const teamGoals = await prisma.goal.findMany({
    where: { owner: { managerId: userId } },
    include: {
      owner: { select: { id: true, name: true } },
      updates: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    take: 30,
  });

  const atRiskCount = teamGoals.filter((g) =>
    g.updates.some((u) => u.status === "AT_RISK")
  ).length;

  const completedCount = teamGoals.filter(
    (g) => g.status === "COMPLETED"
  ).length;

  const openEscalations = await prisma.escalation.count({
    where: {
      assignedToId: userId,
      status: { in: ["OPEN", "IN_PROGRESS"] },
    },
  });

  return {
    teamSize: new Set(teamGoals.map((g) => g.ownerId)).size,
    totalGoals: teamGoals.length,
    atRiskCount,
    completedCount,
    openEscalations,
    teamGoals: teamGoals.map((g) => ({
      title: g.title,
      owner: g.owner.name,
      status: g.status,
      progress: g.progress,
      priority: g.priority,
      lastUpdate: g.updates[0]?.status,
    })),
  };
}

async function buildAdminContext() {
  const statusBreakdown = await prisma.goal.groupBy({
    by: ["status"],
    _count: true,
    _avg: { progress: true },
  });

  const departmentStats = await prisma.goal.groupBy({
    by: ["ownerId"],
    _count: true,
    _avg: { progress: true },
  });

  const openEscalations = await prisma.escalation.count({
    where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
  });

  const totalUsers = await prisma.user.count();

  return {
    totalUsers,
    openEscalations,
    statusBreakdown: statusBreakdown.map((s) => ({
      status: s.status,
      count: s._count,
      avgProgress: Math.round(s._avg.progress ?? 0),
    })),
    uniqueGoalOwners: departmentStats.length,
  };
}

// ─── Per-user generation ─────────────────────────────────────────────
async function generateForUser(userId: string, role: Role): Promise<number> {
  let context: any;

  switch (role) {
    case Role.EMPLOYEE:
      context = await buildEmployeeContext(userId);
      break;
    case Role.MANAGER:
      context = await buildManagerContext(userId);
      break;
    case Role.ADMIN:
      context = await buildAdminContext();
      break;
  }

  const insights: ParsedInsight[] = await generateInsightsFromAI(role, context);

  if (insights.length === 0) return 0;

  await prisma.aIInsight.createMany({
    data: insights.map((i) => ({
      type: i.type,
      content: i.content,
      userId,
    })),
  });

  return insights.length;
}

// ─── Cleanup old insights ────────────────────────────────────────────
async function cleanupOldInsights(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - INSIGHTS_RETENTION_DAYS);

  const { count } = await prisma.aIInsight.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return count;
}

// ─── Trim to cap per user ────────────────────────────────────────────
async function trimExcessInsights(): Promise<number> {
  // Get users who have more than MAX_INSIGHTS_PER_USER insights
  const users = await prisma.aIInsight.groupBy({
    by: ["userId"],
    _count: true,
    having: {
      userId: { _count: { gt: MAX_INSIGHTS_PER_USER } },
    },
  });

  let trimmed = 0;

  for (const group of users) {
    if (!group.userId) continue;

    // Find the oldest insights beyond the cap
    const toKeep = await prisma.aIInsight.findMany({
      where: { userId: group.userId },
      orderBy: { createdAt: "desc" },
      take: MAX_INSIGHTS_PER_USER,
      select: { id: true },
    });

    const keepIds = toKeep.map((i) => i.id);

    const { count } = await prisma.aIInsight.deleteMany({
      where: {
        userId: group.userId,
        id: { notIn: keepIds },
      },
    });

    trimmed += count;
  }

  return trimmed;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const start = Date.now();
  console.log(`[generate-ai-insights] Starting at ${new Date().toISOString()}`);

  // 1. Cleanup old insights first
  const cleaned = await cleanupOldInsights();
  console.log(`  Cleaned up ${cleaned} insights older than ${INSIGHTS_RETENTION_DAYS} days`);

  // 2. Fetch all active users
  const users = await prisma.user.findMany({
    select: { id: true, role: true },
  });
  console.log(`  Processing ${users.length} users (concurrency: ${CONCURRENCY})`);

  // 3. Process in batches for controlled concurrency
  let totalGenerated = 0;
  let errors = 0;

  for (let i = 0; i < users.length; i += CONCURRENCY) {
    const batch = users.slice(i, i + CONCURRENCY);

    const results = await Promise.allSettled(
      batch.map(async (user) => {
        try {
          const count = await generateForUser(user.id, user.role as Role);
          return count;
        } catch (err) {
          console.error(`  Failed for user ${user.id}:`, err instanceof Error ? err.message : err);
          throw err;
        }
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        totalGenerated += result.value;
      } else {
        errors++;
      }
    }

    // Rate-limit: wait between batches to avoid overwhelming OpenAI
    if (i + CONCURRENCY < users.length) {
      await sleep(1000);
    }
  }

  // 4. Trim excess per user
  const trimmed = await trimExcessInsights();
  if (trimmed > 0) console.log(`  Trimmed ${trimmed} excess insights`);

  console.log(`[generate-ai-insights] Done in ${elapsed(start)}`);
  console.log(`  Total insights generated: ${totalGenerated}`);
  console.log(`  Errors: ${errors}`);

  if (errors > 0 && errors === users.length) {
    throw new Error("All insight generations failed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[generate-ai-insights] Fatal error:", err);
    process.exit(1);
  });
