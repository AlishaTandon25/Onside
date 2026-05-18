import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { type AuthenticatedUser } from "@/lib/rbac";
import { generateInsightsFromAI } from "@/lib/ai/openai";

export async function getInsights(user: AuthenticatedUser) {
  return prisma.aIInsight.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getInsightById(user: AuthenticatedUser, insightId: string) {
  const insight = await prisma.aIInsight.findUnique({
    where: { id: insightId },
  });

  if (!insight) return null;
  if (insight.userId !== user.id && user.role !== Role.ADMIN) {
    return null; // Only allow owner or admin
  }

  return insight;
}

export async function generateInsights(user: AuthenticatedUser) {
  const role = user.role as Role;
  let contextData: any = {};

  if (role === Role.EMPLOYEE) {
    const goals = await prisma.goal.findMany({
      where: { ownerId: user.id },
      include: { updates: { orderBy: { createdAt: "desc" }, take: 2 } },
      take: 10,
    });
    contextData = { goals };
  } else if (role === Role.MANAGER) {
    const teamGoals = await prisma.goal.findMany({
      where: { owner: { managerId: user.id } },
      include: { updates: { orderBy: { createdAt: "desc" }, take: 1 } },
      take: 20,
    });
    contextData = { teamGoals };
  } else {
    // Admin
    const deptStats = await prisma.goal.groupBy({
      by: ['status'],
      _count: true,
      _avg: { progress: true },
    });
    contextData = { deptStats };
  }

  const generated = await generateInsightsFromAI(role, contextData);

  // Save to DB
  const insightsToCreate = generated.map((insight) => ({
    type: insight.type,
    content: insight.content,
    userId: user.id,
  }));

  if (insightsToCreate.length > 0) {
    await prisma.aIInsight.createMany({
      data: insightsToCreate,
    });
  }

  return getInsights(user);
}
