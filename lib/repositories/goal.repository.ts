import { GoalStatus, Prisma, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { GoalQueryInput } from "@/lib/validations/goal";

export const goalInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      managerId: true,
      departmentId: true,
    },
  },
  primaryGoal: {
    select: {
      id: true,
      title: true,
      ownerId: true,
    },
  },
  linkedGoals: {
    select: {
      id: true,
      ownerId: true,
      weightage: true,
      currentValue: true,
      status: true,
      isLocked: true,
    },
  },
  participants: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          managerId: true,
        },
      },
      linkedGoal: {
        select: {
          id: true,
          ownerId: true,
          weightage: true,
          status: true,
        },
      },
    },
  },
} satisfies Prisma.GoalInclude;

export type GoalWithRelations = Prisma.GoalGetPayload<{
  include: typeof goalInclude;
}>;

export type GoalActor = {
  id: string;
  role: Role;
  departmentId?: string | null;
  managerId?: string | null;
};

const activeGoalStatuses: GoalStatus[] = [
  GoalStatus.DRAFT,
  GoalStatus.SUBMITTED,
  GoalStatus.RETURNED_FOR_REWORK,
  GoalStatus.APPROVED,
  GoalStatus.REWORK,
  GoalStatus.LOCKED,
  GoalStatus.COMPLETED,
];

function accessWhere(actor: GoalActor): Prisma.GoalWhereInput {
  if (actor.role === Role.ADMIN) {
    return {};
  }

  if (actor.role === Role.MANAGER) {
    return {
      OR: [
        { ownerId: actor.id },
        { owner: { managerId: actor.id } },
      ],
    };
  }

  return {
    OR: [
      { ownerId: actor.id },
      { participants: { some: { userId: actor.id } } },
    ],
  };
}

export function buildGoalWhere(
  actor: GoalActor,
  query: GoalQueryInput,
): Prisma.GoalWhereInput {
  const filters: Prisma.GoalWhereInput[] = [accessWhere(actor)];

  if (query.search) {
    filters.push({
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { thrustArea: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }

  if (query.status) filters.push({ status: query.status });
  if (query.thrustArea) filters.push({ thrustArea: query.thrustArea });
  if (query.ownerId) filters.push({ ownerId: query.ownerId });
  if (query.cycle) filters.push({ cycleId: query.cycle });

  return filters.length === 1 ? filters[0] : { AND: filters };
}

export async function listGoals(actor: GoalActor, query: GoalQueryInput) {
  const where = buildGoalWhere(actor, query);

  const [goals, total] = await prisma.$transaction([
    prisma.goal.findMany({
      where,
      include: goalInclude,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.goal.count({ where }),
  ]);

  return {
    data: goals,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      pageCount: Math.ceil(total / query.pageSize),
    },
  };
}

export async function findGoalById(id: string) {
  return prisma.goal.findUnique({
    where: { id },
    include: goalInclude,
  });
}

export async function countActiveGoals(ownerId: string, cycleId: string) {
  return prisma.goal.count({
    where: {
      ownerId,
      cycleId,
      status: { in: activeGoalStatuses },
    },
  });
}

export async function sumActiveWeightage(
  ownerId: string,
  cycleId: string,
  excludeGoalId?: string,
) {
  const aggregate = await prisma.goal.aggregate({
    where: {
      ownerId,
      cycleId,
      status: { in: activeGoalStatuses },
      ...(excludeGoalId ? { id: { not: excludeGoalId } } : {}),
    },
    _sum: { weightage: true },
  });

  return aggregate._sum.weightage ?? 0;
}

export async function getDirectReportIds(managerId: string) {
  const users = await prisma.user.findMany({
    where: { managerId },
    select: { id: true },
  });

  return users.map((user) => user.id);
}

export async function createAuditLog(input: {
  action: string;
  resource?: string;
  resourceId?: string;
  userId?: string;
  details?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      action: input.action,
      resource: input.resource ?? "GOAL",
      resourceId: input.resourceId,
      userId: input.userId,
      details:
        input.details === undefined
          ? undefined
          : JSON.stringify(input.details),
    },
  });
}
