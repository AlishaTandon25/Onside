import { GoalStatus, NotificationType, Prisma, Priority, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import { createAuditLog, sumActiveWeightage } from "@/lib/repositories/goal.repository";
import type {
  ApprovalDecisionInput,
  InlineGoalEditInput,
  RejectGoalInput,
  ReturnForReworkInput,
} from "@/lib/validations/approval";

type Decision = "APPROVED" | "RETURNED_FOR_REWORK" | "REJECTED";

const decisionNotification: Record<Decision, string> = {
  APPROVED: "Your goal sheet has been approved.",
  RETURNED_FOR_REWORK: "Your goal sheet has been returned for rework.",
  REJECTED: "Your goal sheet has been rejected.",
};

function toDate(value: string | null | undefined) {
  return value ? new Date(value) : undefined;
}

function assertReviewer(user: AuthenticatedUser) {
  if (user.role !== Role.MANAGER && user.role !== Role.ADMIN) {
    throw new AuthError(403, "Only managers and admins can review goals");
  }
}

function inlineEditData(input: InlineGoalEditInput): Prisma.GoalUncheckedUpdateInput {
  const data: Prisma.GoalUncheckedUpdateInput = {};

  if (input.targetValue !== undefined) {
    data.targetValue = input.targetValue;
    data.target = input.targetValue;
  }

  if (input.weightage !== undefined) {
    data.weightage = input.weightage;
  }

  if (input.dueDate !== undefined) {
    data.dueDate = toDate(input.dueDate);
    data.endDate = toDate(input.dueDate);
  }

  if (input.priority !== undefined) {
    data.priority = input.priority as Priority;
  }

  return data;
}

async function getReviewAnchorGoal(goalId: string) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
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

function assertCanReviewGoal(user: AuthenticatedUser, goal: Awaited<ReturnType<typeof getReviewAnchorGoal>>) {
  assertReviewer(user);

  if (user.role === Role.ADMIN) return;

  if (goal.owner.managerId !== user.id) {
    throw new AuthError(403, "Managers can only review direct reports");
  }
}

async function validateSheetBeforeDecision(ownerId: string, cycleId: string) {
  const goals = await prisma.goal.findMany({
    where: {
      ownerId,
      cycleId,
      status: GoalStatus.SUBMITTED,
    },
    select: { id: true, weightage: true },
  });

  if (goals.length === 0) {
    throw new AuthError(400, "No submitted goals are awaiting review");
  }

  if (goals.length > 8) {
    throw new AuthError(400, "A goal sheet cannot contain more than 8 goals");
  }

  if (goals.some((goal) => goal.weightage < 10)) {
    throw new AuthError(400, "Minimum weightage per goal is 10%");
  }

  const totalWeightage = await sumActiveWeightage(ownerId, cycleId);

  if (totalWeightage !== 100) {
    throw new AuthError(400, "Total submitted goal weightage must equal 100%");
  }

  return goals;
}

async function notifyEmployee(input: {
  userId: string;
  message: string;
}) {
  await prisma.notification.create({
    data: {
      userId: input.userId,
      type: NotificationType.APPROVAL_REQUIRED,
      message: input.message,
    },
  });
}

async function writeGoalApproval(input: {
  goalId: string;
  managerId: string;
  status: GoalStatus;
  comment?: string;
}) {
  await prisma.goalApproval.create({
    data: {
      goalId: input.goalId,
      managerId: input.managerId,
      status: input.status,
      comment: input.comment,
    },
  });
}

async function applyInlineEdits(goalId: string, user: AuthenticatedUser, edits: InlineGoalEditInput) {
  const data = inlineEditData(edits);

  if (Object.keys(data).length === 0) return;

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    select: { ownerId: true, cycleId: true, status: true },
  });

  if (!goal) throw new AuthError(404, "Goal not found");

  if (goal.status !== GoalStatus.SUBMITTED) {
    throw new AuthError(400, "Inline edits are allowed only before approval");
  }

  await prisma.goal.update({ where: { id: goalId }, data });

  await createAuditLog({
    action: "MANAGER_INLINE_EDIT",
    resourceId: goalId,
    userId: user.id,
    details: { fields: Object.keys(edits) },
  });
}

async function decideGoalSheet(
  user: AuthenticatedUser,
  goalId: string,
  decision: Decision,
  input: ApprovalDecisionInput | ReturnForReworkInput | RejectGoalInput,
) {
  const anchorGoal = await getReviewAnchorGoal(goalId);
  assertCanReviewGoal(user, anchorGoal);

  if (anchorGoal.status !== GoalStatus.SUBMITTED) {
    throw new AuthError(400, "Only submitted goals can be reviewed");
  }

  await applyInlineEdits(goalId, user, input.edits);
  const sheetGoals = await validateSheetBeforeDecision(
    anchorGoal.ownerId,
    anchorGoal.cycleId,
  );

  const status =
    decision === "APPROVED"
      ? GoalStatus.APPROVED
      : decision === "RETURNED_FOR_REWORK"
        ? GoalStatus.RETURNED_FOR_REWORK
        : GoalStatus.REJECTED;

  await prisma.$transaction(async (tx) => {
    await tx.goal.updateMany({
      where: { id: { in: sheetGoals.map((goal) => goal.id) } },
      data:
        decision === "APPROVED"
          ? { status, isLocked: true, locked: true }
          : { status, isLocked: false, locked: false },
    });

    for (const goal of sheetGoals) {
      await tx.goalApproval.create({
        data: {
          goalId: goal.id,
          managerId: user.id,
          status,
          comment: input.comment,
        },
      });

      await tx.auditLog.create({
        data: {
          action:
            decision === "APPROVED"
              ? "GOAL_APPROVED"
              : decision === "RETURNED_FOR_REWORK"
                ? "GOAL_RETURNED"
                : "GOAL_REJECTED",
          resource: "GOAL",
          resourceId: goal.id,
          userId: user.id,
          details: JSON.stringify({
            ownerId: anchorGoal.ownerId,
            cycleId: anchorGoal.cycleId,
            comment: input.comment,
          }),
        },
      });
    }

    await tx.notification.create({
      data: {
        userId: anchorGoal.ownerId,
        type: NotificationType.APPROVAL_REQUIRED,
        message: decisionNotification[decision],
      },
    });
  });

  return {
    decision,
    ownerId: anchorGoal.ownerId,
    cycleId: anchorGoal.cycleId,
    goalIds: sheetGoals.map((goal) => goal.id),
  };
}

export function approveGoalSheet(
  user: AuthenticatedUser,
  goalId: string,
  input: ApprovalDecisionInput,
) {
  return decideGoalSheet(user, goalId, "APPROVED", input);
}

export function returnGoalSheetForRework(
  user: AuthenticatedUser,
  goalId: string,
  input: ReturnForReworkInput,
) {
  return decideGoalSheet(user, goalId, "RETURNED_FOR_REWORK", input);
}

export function rejectGoalSheet(
  user: AuthenticatedUser,
  goalId: string,
  input: RejectGoalInput,
) {
  return decideGoalSheet(user, goalId, "REJECTED", input);
}
