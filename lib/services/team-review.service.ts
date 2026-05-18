import { GoalStatus, Prisma, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import type { TeamReviewQueryInput } from "@/lib/validations/approval";

const teamReviewInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      managerId: true,
      departmentId: true,
    },
  },
} satisfies Prisma.GoalInclude;

function assertReviewer(user: AuthenticatedUser) {
  if (user.role !== Role.MANAGER && user.role !== Role.ADMIN) {
    throw new AuthError(403, "Only managers and admins can review goals");
  }
}

function reviewerWhere(
  user: AuthenticatedUser,
  query: TeamReviewQueryInput,
  pendingOnly = false,
): Prisma.GoalWhereInput {
  const filters: Prisma.GoalWhereInput[] = [];

  if (user.role === Role.MANAGER) {
    filters.push({ owner: { managerId: user.id } });
  }

  if (query.employeeId) {
    filters.push({ ownerId: query.employeeId });
  }

  if (pendingOnly) {
    filters.push({ status: GoalStatus.SUBMITTED });
  } else if (query.status) {
    filters.push({ status: query.status as GoalStatus });
  }

  if (query.cycle) {
    filters.push({ cycleId: query.cycle });
  }

  if (query.search) {
    filters.push({
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { thrustArea: { contains: query.search, mode: "insensitive" } },
        { owner: { name: { contains: query.search, mode: "insensitive" } } },
        { owner: { email: { contains: query.search, mode: "insensitive" } } },
      ],
    });
  }

  return filters.length === 0 ? {} : { AND: filters };
}

export async function getTeamReviewGoals(
  user: AuthenticatedUser,
  query: TeamReviewQueryInput,
  pendingOnly = false,
) {
  assertReviewer(user);

  const where = reviewerWhere(user, query, pendingOnly);
  const [goals, total] = await prisma.$transaction([
    prisma.goal.findMany({
      where,
      include: teamReviewInclude,
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
