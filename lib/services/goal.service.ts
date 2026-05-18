import {
  GoalStatus,
  Prisma,
  Priority,
  Role,
  UnitOfMeasurement,
} from "@prisma/client";

import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import {
  countActiveGoals,
  createAuditLog,
  findGoalById,
  getDirectReportIds,
  listGoals,
  sumActiveWeightage,
  type GoalActor,
  type GoalWithRelations,
} from "@/lib/repositories/goal.repository";
import type {
  GoalCreateInput,
  GoalQueryInput,
  GoalSubmitInput,
  GoalUpdateInput,
  ShareGoalInput,
} from "@/lib/validations/goal";

const editableEmployeeStatuses: GoalStatus[] = [
  GoalStatus.DRAFT,
  GoalStatus.RETURNED_FOR_REWORK,
  GoalStatus.REWORK,
];

const sharedReadOnlyFields = [
  "thrustArea",
  "title",
  "description",
  "unitOfMeasurement",
  "targetValue",
  "startValue",
] as const;

function toActor(user: AuthenticatedUser): GoalActor {
  return {
    id: user.id,
    role: user.role as Role,
    departmentId: user.departmentId,
    managerId: user.managerId,
  };
}

function toDate(value: string | null | undefined): Date | undefined {
  return value ? new Date(value) : undefined;
}

function createGoalData(
  input: GoalCreateInput,
  ownerId: string,
): Prisma.GoalUncheckedCreateInput {
  return {
    thrustArea: input.thrustArea,
    title: input.title,
    description: input.description,
    unitOfMeasurement: input.unitOfMeasurement as UnitOfMeasurement,
    startValue: input.startValue,
    targetValue: input.targetValue,
    currentValue: input.currentValue ?? input.startValue ?? 0,
    target: input.targetValue,
    achievement: input.currentValue ?? input.startValue ?? 0,
    weightage: input.weightage,
    priority: input.priority as Priority,
    dueDate: toDate(input.dueDate),
    endDate: toDate(input.dueDate),
    cycleId: input.cycleId,
    ownerId,
  };
}

function updateGoalData(
  input: GoalUpdateInput,
): Prisma.GoalUncheckedUpdateInput {
  const data: Prisma.GoalUncheckedUpdateInput = {};

  if (input.thrustArea !== undefined) data.thrustArea = input.thrustArea;
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.unitOfMeasurement !== undefined) {
    data.unitOfMeasurement = input.unitOfMeasurement as UnitOfMeasurement;
  }
  if (input.startValue !== undefined) data.startValue = input.startValue;
  if (input.targetValue !== undefined) {
    data.targetValue = input.targetValue;
    data.target = input.targetValue;
  }
  if (input.currentValue !== undefined) {
    data.currentValue = input.currentValue;
    data.achievement = input.currentValue;
  }
  if (input.weightage !== undefined) data.weightage = input.weightage;
  if (input.priority !== undefined) data.priority = input.priority as Priority;
  if (input.dueDate !== undefined) {
    data.dueDate = toDate(input.dueDate);
    data.endDate = toDate(input.dueDate);
  }
  if (input.cycleId !== undefined) data.cycleId = input.cycleId;

  return data;
}

function canViewGoal(actor: GoalActor, goal: GoalWithRelations) {
  if (actor.role === Role.ADMIN) return true;
  if (goal.ownerId === actor.id) return true;
  if (actor.role === Role.MANAGER) {
    return goal.owner.managerId === actor.id;
  }

  return goal.participants.some((participant) => participant.userId === actor.id);
}

function assertCanViewGoal(actor: GoalActor, goal: GoalWithRelations) {
  if (!canViewGoal(actor, goal)) {
    throw new AuthError(403, "You do not have access to this goal");
  }
}

function assertCanMutateGoal(actor: GoalActor, goal: GoalWithRelations) {
  if (actor.role === Role.ADMIN) return;

  if (goal.isLocked || goal.locked || goal.status === GoalStatus.LOCKED) {
    throw new AuthError(403, "Approved goals are locked");
  }

  if (actor.role === Role.MANAGER) {
    if (goal.ownerId === actor.id) return;
    if (goal.owner.managerId === actor.id) return;
  }

  if (actor.role === Role.EMPLOYEE && goal.ownerId === actor.id) {
    if (!editableEmployeeStatuses.includes(goal.status)) {
      throw new AuthError(
        403,
        "Submitted goal sheets cannot be modified by employees",
      );
    }
    return;
  }

  throw new AuthError(403, "You cannot modify this goal");
}

async function validateOwnerCapacity(input: {
  ownerId: string;
  cycleId: string;
  weightage: number;
  excludeGoalId?: string;
}) {
  const activeCount = await countActiveGoals(input.ownerId, input.cycleId);

  if (!input.excludeGoalId && activeCount >= 8) {
    throw new AuthError(400, "An employee may create up to 8 goals per cycle");
  }

  const existingWeightage = await sumActiveWeightage(
    input.ownerId,
    input.cycleId,
    input.excludeGoalId,
  );

  if (existingWeightage + input.weightage > 100) {
    throw new AuthError(
      400,
      "Total active goal weightage cannot exceed 100% in a cycle",
    );
  }
}

function assertSharedCopyPatchAllowed(
  goal: GoalWithRelations,
  input: GoalUpdateInput,
) {
  if (!goal.primaryGoalId) return;

  const attemptedReadOnlyChange = sharedReadOnlyFields.some(
    (field) => input[field] !== undefined,
  );

  if (attemptedReadOnlyChange) {
    throw new AuthError(
      403,
      "Shared goal recipients may only modify weightage",
    );
  }
}

async function syncLinkedCopies(
  primaryGoalId: string,
  data: Prisma.GoalUncheckedUpdateInput,
) {
  const syncData: Prisma.GoalUncheckedUpdateInput = {};

  for (const field of sharedReadOnlyFields) {
    if (data[field] !== undefined) {
      syncData[field] = data[field] as never;
    }
  }

  if (data.currentValue !== undefined) syncData.currentValue = data.currentValue;
  if (data.achievement !== undefined) syncData.achievement = data.achievement;
  if (data.status !== undefined) syncData.status = data.status;
  if (data.isLocked !== undefined) syncData.isLocked = data.isLocked;
  if (data.locked !== undefined) syncData.locked = data.locked;
  if (data.dueDate !== undefined) syncData.dueDate = data.dueDate;
  if (data.endDate !== undefined) syncData.endDate = data.endDate;
  if (data.priority !== undefined) syncData.priority = data.priority;

  if (Object.keys(syncData).length === 0) return;

  await prisma.goal.updateMany({
    where: { primaryGoalId },
    data: syncData,
  });
}

export async function getGoals(
  user: AuthenticatedUser,
  query: GoalQueryInput,
) {
  return listGoals(toActor(user), query);
}

export async function getGoal(user: AuthenticatedUser, id: string) {
  const actor = toActor(user);
  const goal = await findGoalById(id);

  if (!goal) {
    throw new AuthError(404, "Goal not found");
  }

  assertCanViewGoal(actor, goal);
  return goal;
}

export async function createGoal(
  user: AuthenticatedUser,
  input: GoalCreateInput,
) {
  const actor = toActor(user);

  if (actor.role === Role.ADMIN) {
    throw new AuthError(403, "Admins cannot create personal goals");
  }

  await validateOwnerCapacity({
    ownerId: actor.id,
    cycleId: input.cycleId,
    weightage: input.weightage,
  });

  const goal = await prisma.goal.create({
    data: createGoalData(input, actor.id),
  });

  await createAuditLog({
    action: "GOAL_CREATED",
    resourceId: goal.id,
    userId: actor.id,
    details: { cycleId: goal.cycleId, weightage: goal.weightage },
  });

  return getGoal(user, goal.id);
}

export async function updateGoal(
  user: AuthenticatedUser,
  id: string,
  input: GoalUpdateInput & { status?: GoalStatus },
) {
  const actor = toActor(user);
  const goal = await getGoal(user, id);
  assertCanMutateGoal(actor, goal);
  assertSharedCopyPatchAllowed(goal, input);

  const nextCycleId = input.cycleId ?? goal.cycleId;
  const nextWeightage = input.weightage ?? goal.weightage;

  if (input.weightage !== undefined || input.cycleId !== undefined) {
    await validateOwnerCapacity({
      ownerId: goal.ownerId,
      cycleId: nextCycleId,
      weightage: nextWeightage,
      excludeGoalId: id,
    });
  }

  const data = updateGoalData(input);

  if (input.status !== undefined) {
    if (actor.role === Role.EMPLOYEE) {
      throw new AuthError(403, "Employees cannot review goal sheets");
    }

    if (
      actor.role === Role.MANAGER &&
      goal.owner.managerId !== actor.id &&
      goal.ownerId !== actor.id
    ) {
      throw new AuthError(403, "Managers can only review their team goals");
    }

    if (input.status === GoalStatus.APPROVED) {
      data.status = GoalStatus.LOCKED;
      data.isLocked = true;
      data.locked = true;
    } else {
      data.status = input.status;
      data.isLocked = false;
      data.locked = false;
    }
  }

  const updated = await prisma.goal.update({
    where: { id },
    data,
  });

  if (!goal.primaryGoalId) {
    await syncLinkedCopies(id, data);
  }

  await createAuditLog({
    action: "GOAL_UPDATED",
    resourceId: id,
    userId: actor.id,
    details: { fields: Object.keys(input), status: updated.status },
  });

  return getGoal(user, id);
}

export async function deleteGoal(user: AuthenticatedUser, id: string) {
  const actor = toActor(user);
  const goal = await getGoal(user, id);
  assertCanMutateGoal(actor, goal);

  if (!editableEmployeeStatuses.includes(goal.status) && actor.role !== Role.ADMIN) {
    throw new AuthError(403, "Only draft or returned goals can be deleted");
  }

  await prisma.goal.delete({ where: { id } });
  await createAuditLog({
    action: "GOAL_DELETED",
    resourceId: id,
    userId: actor.id,
  });

  return { deleted: true };
}

export async function submitGoalSheet(
  user: AuthenticatedUser,
  input: GoalSubmitInput,
) {
  const actor = toActor(user);

  if (actor.role === Role.ADMIN) {
    throw new AuthError(403, "Admins cannot submit personal goal sheets");
  }

  const goals = await prisma.goal.findMany({
    where: {
      ownerId: actor.id,
      cycleId: input.cycleId,
      status: {
        in: [
          GoalStatus.DRAFT,
          GoalStatus.RETURNED_FOR_REWORK,
          GoalStatus.REWORK,
        ],
      },
      isLocked: false,
      locked: false,
    },
  });

  if (goals.length === 0) {
    throw new AuthError(400, "No editable goals found for this cycle");
  }

  if (goals.length > 8) {
    throw new AuthError(400, "An employee may submit up to 8 goals per cycle");
  }

  const activeWeightage = await sumActiveWeightage(actor.id, input.cycleId);

  if (activeWeightage !== 100) {
    throw new AuthError(
      400,
      "Total weightage across active goals in a cycle must equal 100%",
    );
  }

  await prisma.goal.updateMany({
    where: { id: { in: goals.map((goal) => goal.id) } },
    data: { status: GoalStatus.SUBMITTED },
  });

  await createAuditLog({
    action: "GOAL_SUBMITTED",
    resourceId: input.cycleId,
    userId: actor.id,
    details: { goalIds: goals.map((goal) => goal.id) },
  });

  return { submitted: true, goalCount: goals.length };
}

export async function unlockGoal(user: AuthenticatedUser, id: string) {
  const actor = toActor(user);

  if (actor.role !== Role.ADMIN) {
    throw new AuthError(403, "Only Admin can unlock approved goals");
  }

  const goal = await findGoalById(id);
  if (!goal) throw new AuthError(404, "Goal not found");

  if (!goal.isLocked && !goal.locked && goal.status !== GoalStatus.LOCKED) {
    throw new AuthError(400, "Goal is not locked");
  }

  await prisma.goal.update({
    where: { id },
    data: {
      isLocked: false,
      locked: false,
      status: GoalStatus.APPROVED,
    },
  });

  await syncLinkedCopies(id, {
    isLocked: false,
    locked: false,
    status: GoalStatus.APPROVED,
  });

  await createAuditLog({
    action: "GOAL_UNLOCKED",
    resourceId: id,
    userId: actor.id,
  });

  return getGoal(user, id);
}

export async function listSharedGoals(user: AuthenticatedUser) {
  const actor = toActor(user);
  const where: Prisma.GoalWhereInput = {
    isShared: true,
    ...(actor.role === Role.ADMIN
      ? {}
      : actor.role === Role.MANAGER
        ? {
            OR: [
              { ownerId: actor.id },
              { owner: { managerId: actor.id } },
              { participants: { some: { userId: actor.id } } },
            ],
          }
        : {
            OR: [
              { ownerId: actor.id },
              { participants: { some: { userId: actor.id } } },
            ],
          }),
  };

  return prisma.goal.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      primaryGoal: { select: { id: true, title: true } },
      linkedGoals: { select: { id: true, ownerId: true, weightage: true } },
      participants: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          linkedGoal: { select: { id: true, ownerId: true, weightage: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function shareGoal(
  user: AuthenticatedUser,
  input: ShareGoalInput,
) {
  const actor = toActor(user);

  if (actor.role === Role.EMPLOYEE) {
    throw new AuthError(403, "Only Managers and Admins can share goals");
  }

  const uniqueRecipientIds = [...new Set(input.recipientIds)].filter(
    (recipientId) => recipientId !== actor.id,
  );

  if (uniqueRecipientIds.length === 0) {
    throw new AuthError(400, "At least one recipient is required");
  }

  if (actor.role === Role.MANAGER) {
    const directReportIds = new Set(await getDirectReportIds(actor.id));
    const invalidRecipient = uniqueRecipientIds.find(
      (recipientId) => !directReportIds.has(recipientId),
    );

    if (invalidRecipient) {
      throw new AuthError(
        403,
        "Managers can only share goals with direct reports",
      );
    }
  }

  const recipients = await prisma.user.findMany({
    where: { id: { in: uniqueRecipientIds } },
    select: { id: true },
  });

  if (recipients.length !== uniqueRecipientIds.length) {
    throw new AuthError(400, "One or more recipients do not exist");
  }

  await Promise.all(
    uniqueRecipientIds.map((recipientId) =>
      validateOwnerCapacity({
        ownerId: recipientId,
        cycleId: input.cycleId,
        weightage: input.weightage,
      }),
    ),
  );

  const result = await prisma.$transaction(async (tx) => {
    const masterGoal = await tx.goal.create({
      data: {
        ...createGoalData(input, actor.id),
        isShared: true,
      },
    });

    const linkedGoals = [];

    for (const recipientId of uniqueRecipientIds) {
      const linkedGoal = await tx.goal.create({
        data: {
          ...createGoalData(input, recipientId),
          isShared: true,
          primaryGoalId: masterGoal.id,
        },
      });

      await tx.sharedGoalParticipant.create({
        data: {
          goalId: masterGoal.id,
          userId: recipientId,
          linkedGoalId: linkedGoal.id,
          canEdit: true,
        },
      });

      linkedGoals.push(linkedGoal);
    }

    await tx.auditLog.create({
      data: {
        action: "SHARED_GOAL_DISTRIBUTED",
        resource: "GOAL",
        resourceId: masterGoal.id,
        userId: actor.id,
        details: JSON.stringify({
          recipientIds: uniqueRecipientIds,
          linkedGoalIds: linkedGoals.map((goal) => goal.id),
        }),
      },
    });

    return { masterGoal, linkedGoals };
  });

  return {
    masterGoal: await getGoal(user, result.masterGoal.id),
    linkedGoalIds: result.linkedGoals.map((goal) => goal.id),
  };
}
