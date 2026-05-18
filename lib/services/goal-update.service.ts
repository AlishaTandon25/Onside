import { GoalStatus, GoalUpdateCadence, Prisma, Role, ProgressStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import { createAuditLog } from "@/lib/repositories/goal.repository";
import type {
  CreateGoalUpdateInput,
  UpdateGoalUpdateInput,
} from "@/lib/validations/goal-update";
import { calculateProgressScore } from "./progress-calculation.service";

const lockedStatuses: GoalStatus[] = [
  GoalStatus.LOCKED,
  GoalStatus.APPROVED,
];

const updateInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  goal: {
    select: {
      id: true,
      title: true,
      ownerId: true,
      targetValue: true,
      currentValue: true,
      startValue: true,
      status: true,
      isLocked: true,
      locked: true,
      primaryGoalId: true,
      calculationType: true,
      unitOfMeasurement: true,
      startDate: true,
      endDate: true,
      owner: {
        select: {
          id: true,
          managerId: true,
        },
      },
    },
  },
} satisfies Prisma.GoalUpdateInclude;

type GoalUpdateWithRelations = Prisma.GoalUpdateGetPayload<{
  include: typeof updateInclude;
}>;

function roleOf(user: AuthenticatedUser): Role {
  return user.role as Role;
}

function assertCanViewGoalUpdates(
  user: AuthenticatedUser,
  goal: GoalUpdateWithRelations["goal"],
) {
  const role = roleOf(user);
  if (role === Role.ADMIN) return;
  if (goal.ownerId === user.id) return;
  if (role === Role.MANAGER && goal.owner.managerId === user.id) return;

  throw new AuthError(403, "You do not have access to this goal's updates");
}

function assertCanWriteGoalUpdate(
  user: AuthenticatedUser,
  goal: GoalUpdateWithRelations["goal"],
) {
  if (goal.ownerId !== user.id) {
    throw new AuthError(403, "Users can update only their own goals");
  }

  if (goal.primaryGoalId) {
    throw new AuthError(
      403,
      "Progress for shared linked copies is synchronized from the primary goal",
    );
  }

  if (
    goal.isLocked ||
    goal.locked ||
    lockedStatuses.includes(goal.status)
  ) {
    throw new AuthError(403, "Locked or approved goals cannot be updated");
  }
}

async function findGoalForUpdates(goalId: string) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    select: {
      id: true,
      title: true,
      ownerId: true,
      targetValue: true,
      currentValue: true,
      startValue: true,
      status: true,
      isLocked: true,
      locked: true,
      primaryGoalId: true,
      calculationType: true,
      unitOfMeasurement: true,
      startDate: true,
      endDate: true,
      owner: {
        select: {
          id: true,
          managerId: true,
        },
      },
    },
  });

  if (!goal) {
    throw new AuthError(404, "Goal not found");
  }

  return goal;
}

async function syncGoalCurrentValue(goalId: string, currentValue: number, actualAchievement: number, progress: number) {
  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      currentValue,
      achievement: actualAchievement,
      progress,
    },
    select: {
      id: true,
      primaryGoalId: true,
    },
  });

  if (!goal.primaryGoalId) {
    await prisma.goal.updateMany({
      where: { primaryGoalId: goalId },
      data: {
        currentValue,
        achievement: actualAchievement,
        progress,
      },
    });
  }
}

async function getLatestUpdateValues(goalId: string) {
  const latestUpdate = await prisma.goalUpdate.findFirst({
    where: { goalId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { newValue: true, actualAchievement: true, computedProgress: true },
  });

  if (latestUpdate) return latestUpdate;

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    select: { startValue: true, achievement: true, progress: true },
  });

  return {
    newValue: goal?.startValue ?? 0,
    actualAchievement: goal?.achievement ?? 0,
    computedProgress: goal?.progress ?? 0,
  };
}

export async function listGoalUpdates(
  user: AuthenticatedUser,
  goalId: string,
) {
  const goal = await findGoalForUpdates(goalId);
  assertCanViewGoalUpdates(user, goal);

  return prisma.goalUpdate.findMany({
    where: { goalId },
    include: updateInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

export async function createGoalUpdate(
  user: AuthenticatedUser,
  goalId: string,
  input: CreateGoalUpdateInput,
) {
  const goal = await findGoalForUpdates(goalId);
  assertCanWriteGoalUpdate(user, goal);

  const actualAchievement = input.actualAchievement ?? input.currentValue;
  const status = input.status as ProgressStatus;

  const computedProgress = calculateProgressScore({
    actualAchievement,
    targetValue: goal.targetValue,
    calculationType: goal.calculationType,
    unitOfMeasurement: goal.unitOfMeasurement,
    startDate: goal.startDate,
    endDate: goal.endDate,
    status,
  });

  const update = await prisma.$transaction(async (tx) => {
    const created = await tx.goalUpdate.create({
      data: {
        goalId,
        userId: user.id,
        cadence: input.cadence as GoalUpdateCadence,
        previousValue: goal.currentValue,
        newValue: input.currentValue,
        actualAchievement,
        status,
        progressPercentage: computedProgress,
        computedProgress,
        accomplishments: input.accomplishments,
        blockers: input.blockers,
        nextSteps: input.nextSteps,
        comment: input.comment,
      },
      include: updateInclude,
    });

    await tx.goal.update({
      where: { id: goalId },
      data: {
        currentValue: input.currentValue,
        achievement: actualAchievement,
        progress: computedProgress,
      },
    });

    await tx.auditLog.create({
      data: {
        action: "GOAL_PROGRESS_UPDATED",
        resource: "GOAL_UPDATE",
        resourceId: created.id,
        userId: user.id,
        details: JSON.stringify({
          goalId,
          cadence: input.cadence,
          progressPercentage: computedProgress,
          status,
        }),
      },
    });

    if (goal.owner.managerId) {
      await tx.notification.create({
        data: {
          type: "GOAL_UPDATED",
          message: `A new quarterly update was submitted for goal "${goal.title}"`,
          userId: goal.owner.managerId,
        }
      });
    }

    return created;
  });

  if (!goal.primaryGoalId) {
    await prisma.goal.updateMany({
      where: { primaryGoalId: goalId },
      data: {
        currentValue: input.currentValue,
        achievement: actualAchievement,
        progress: computedProgress,
      },
    });
  }

  return update;
}

export async function updateGoalUpdate(
  user: AuthenticatedUser,
  updateId: string,
  input: UpdateGoalUpdateInput,
) {
  const existing = await prisma.goalUpdate.findUnique({
    where: { id: updateId },
    include: updateInclude,
  });

  if (!existing) {
    throw new AuthError(404, "Update not found");
  }

  assertCanWriteGoalUpdate(user, existing.goal);

  if (existing.userId !== user.id) {
    throw new AuthError(403, "You can edit only your own updates");
  }

  const nextValue = input.currentValue ?? existing.newValue;
  const nextActualAchievement = input.actualAchievement ?? existing.actualAchievement;
  const nextStatus = input.status ? (input.status as ProgressStatus) : existing.status;

  const computedProgress = calculateProgressScore({
    actualAchievement: nextActualAchievement,
    targetValue: existing.goal.targetValue,
    calculationType: existing.goal.calculationType,
    unitOfMeasurement: existing.goal.unitOfMeasurement,
    startDate: existing.goal.startDate,
    endDate: existing.goal.endDate,
    status: nextStatus,
  });

  const updated = await prisma.goalUpdate.update({
    where: { id: updateId },
    data: {
      cadence: input.cadence as GoalUpdateCadence | undefined,
      newValue: nextValue,
      actualAchievement: nextActualAchievement,
      status: nextStatus,
      progressPercentage: computedProgress,
      computedProgress,
      accomplishments: input.accomplishments,
      blockers: input.blockers,
      nextSteps: input.nextSteps,
      comment: input.comment,
    },
    include: updateInclude,
  });

  const latestVals = await getLatestUpdateValues(existing.goalId);
  await syncGoalCurrentValue(existing.goalId, latestVals.newValue, latestVals.actualAchievement, latestVals.computedProgress);

  await createAuditLog({
    action: "GOAL_UPDATE_EDITED",
    resource: "GOAL_UPDATE",
    resourceId: updateId,
    userId: user.id,
    details: JSON.stringify({ goalId: existing.goalId, progressPercentage: computedProgress }),
  });

  return updated;
}

export async function deleteGoalUpdate(
  user: AuthenticatedUser,
  updateId: string,
) {
  const existing = await prisma.goalUpdate.findUnique({
    where: { id: updateId },
    include: updateInclude,
  });

  if (!existing) {
    throw new AuthError(404, "Update not found");
  }

  assertCanWriteGoalUpdate(user, existing.goal);

  if (existing.userId !== user.id && roleOf(user) !== Role.ADMIN) {
    throw new AuthError(403, "You can delete only your own updates");
  }

  await prisma.goalUpdate.delete({ where: { id: updateId } });
  const latestVals = await getLatestUpdateValues(existing.goalId);
  await syncGoalCurrentValue(existing.goalId, latestVals.newValue, latestVals.actualAchievement, latestVals.computedProgress);

  await createAuditLog({
    action: "GOAL_UPDATE_DELETED",
    resource: "GOAL_UPDATE",
    resourceId: updateId,
    userId: user.id,
    details: JSON.stringify({ goalId: existing.goalId }),
  });

  return { deleted: true };
}
