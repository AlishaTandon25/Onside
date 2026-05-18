import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import type { CheckInUpdateInput } from "@/lib/validations/goal-update";

export async function checkInGoalUpdate(
  user: AuthenticatedUser,
  updateId: string,
  input: CheckInUpdateInput,
) {
  const update = await prisma.goalUpdate.findUnique({
    where: { id: updateId },
    include: {
      goal: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!update) {
    throw new AuthError(404, "Goal update not found");
  }

  const role = user.role as Role;
  const isManager = role === Role.MANAGER && update.goal.owner.managerId === user.id;
  const isAdmin = role === Role.ADMIN;

  if (!isManager && !isAdmin) {
    throw new AuthError(403, "Only the manager or an admin can perform a check-in");
  }

  const checkedIn = await prisma.$transaction(async (tx) => {
    const updated = await tx.goalUpdate.update({
      where: { id: updateId },
      data: {
        managerComment: input.managerComment,
        checkedInAt: new Date(),
        checkedInById: user.id,
      },
    });

    await tx.auditLog.create({
      data: {
        action: "GOAL_UPDATE_CHECKIN",
        resource: "GOAL_UPDATE",
        resourceId: updateId,
        userId: user.id,
        details: JSON.stringify({ goalId: update.goalId }),
      },
    });

    await tx.notification.create({
      data: {
        type: "SYSTEM", // "GOAL_UPDATED" could also be used depending on what enums exist
        message: `Your manager checked in on your quarterly update for goal "${update.goal.title}"`,
        userId: update.userId,
      },
    });

    return updated;
  });

  return checkedIn;
}
