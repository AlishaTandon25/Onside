import { Role, EscalationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import type { CreateEscalationInput, UpdateEscalationInput, ResolveEscalationInput } from "@/lib/validations/escalation";

export async function listEscalations(user: AuthenticatedUser) {
  const role = user.role as Role;

  if (role === Role.ADMIN) {
    return prisma.escalation.findMany({
      include: { reporter: true, assignedTo: true, goal: true },
      orderBy: { createdAt: "desc" },
    });
  }

  if (role === Role.MANAGER) {
    return prisma.escalation.findMany({
      where: {
        OR: [
          { reporterId: user.id },
          { reporter: { managerId: user.id } },
          { assignedToId: user.id },
          { goal: { owner: { managerId: user.id } } },
        ]
      },
      include: { reporter: true, assignedTo: true, goal: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Employee
  return prisma.escalation.findMany({
    where: {
      OR: [
        { reporterId: user.id },
        { assignedToId: user.id },
        { goal: { ownerId: user.id } },
      ]
    },
    include: { reporter: true, assignedTo: true, goal: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEscalationById(user: AuthenticatedUser, id: string) {
  const escalation = await prisma.escalation.findUnique({
    where: { id },
    include: { reporter: true, assignedTo: true, goal: { include: { owner: true } } },
  });

  if (!escalation) throw new AuthError(404, "Escalation not found");

  const role = user.role as Role;
  if (role === Role.ADMIN) return escalation;

  const isReporter = escalation.reporterId === user.id;
  const isAssignee = escalation.assignedToId === user.id;
  const isGoalOwner = escalation.goal?.ownerId === user.id;
  const isManagerOfReporter = escalation.reporter?.managerId === user.id;
  const isManagerOfGoalOwner = escalation.goal?.owner?.managerId === user.id;

  if (!isReporter && !isAssignee && !isGoalOwner && !isManagerOfReporter && !isManagerOfGoalOwner) {
    throw new AuthError(403, "Not authorized to view this escalation");
  }

  return escalation;
}

export async function createEscalation(user: AuthenticatedUser, input: CreateEscalationInput) {
  if (user.role === Role.EMPLOYEE) {
    throw new AuthError(403, "Employees cannot create escalations manually");
  }

  const escalation = await prisma.escalation.create({
    data: {
      title: input.title,
      description: input.description,
      goalId: input.goalId,
      assignedToId: input.assignedToId,
      reporterId: user.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "ESCALATION_CREATED",
      resource: "ESCALATION",
      resourceId: escalation.id,
      userId: user.id,
    }
  });

  return escalation;
}

export async function updateEscalation(user: AuthenticatedUser, id: string, input: UpdateEscalationInput) {
  const escalation = await getEscalationById(user, id);

  if (user.role === Role.EMPLOYEE) {
    throw new AuthError(403, "Employees cannot update escalations");
  }

  const updated = await prisma.escalation.update({
    where: { id },
    data: {
      status: input.status as EscalationStatus | undefined,
      assignedToId: input.assignedToId,
    },
  });

  return updated;
}

export async function resolveEscalation(user: AuthenticatedUser, input: ResolveEscalationInput) {
  const escalation = await getEscalationById(user, input.escalationId);

  if (user.role === Role.EMPLOYEE) {
    throw new AuthError(403, "Employees cannot resolve escalations");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const res = await tx.escalation.update({
      where: { id: input.escalationId },
      data: { status: "RESOLVED" },
    });

    await tx.auditLog.create({
      data: {
        action: "ESCALATION_RESOLVED",
        resource: "ESCALATION",
        resourceId: res.id,
        userId: user.id,
        details: input.resolutionNotes ? JSON.stringify({ notes: input.resolutionNotes }) : null,
      }
    });

    if (escalation.reporterId !== user.id) {
      await tx.notification.create({
        data: {
          type: "ESCALATION",
          message: `Your escalation "${escalation.title}" was resolved.`,
          userId: escalation.reporterId,
        }
      });
    }

    return res;
  });

  return updated;
}

export async function triggerAutomatedEscalations() {
  const atRiskUpdates = await prisma.goalUpdate.findMany({
    where: { status: "AT_RISK" },
    include: { goal: { include: { owner: true } } }
  });

  let createdCount = 0;

  for (const update of atRiskUpdates) {
    const existing = await prisma.escalation.findFirst({
      where: { goalId: update.goalId, status: { in: ["OPEN", "IN_PROGRESS"] } }
    });

    if (!existing && update.goal.owner.managerId) {
      await prisma.escalation.create({
        data: {
          title: `Automated Escalation: Goal At Risk`,
          description: `Goal "${update.goal.title}" was marked as AT_RISK.`,
          goalId: update.goalId,
          reporterId: update.goal.ownerId,
          assignedToId: update.goal.owner.managerId,
        }
      });
      createdCount++;
    }
  }

  const pendingApprovals = await prisma.goal.findMany({
    where: { status: "SUBMITTED" },
    include: { owner: true }
  });

  for (const goal of pendingApprovals) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    if (goal.updatedAt < weekAgo) {
      const existing = await prisma.escalation.findFirst({
        where: { goalId: goal.id, title: { contains: "Approval Delay" }, status: { in: ["OPEN", "IN_PROGRESS"] } }
      });

      if (!existing && goal.owner.managerId) {
        await prisma.escalation.create({
          data: {
            title: `Automated Escalation: Approval Delay`,
            description: `Goal "${goal.title}" has been pending approval for over 7 days.`,
            goalId: goal.id,
            reporterId: goal.ownerId,
            assignedToId: goal.owner.managerId,
          }
        });
        createdCount++;
      }
    }
  }

  return { triggered: createdCount };
}
