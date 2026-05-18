// Job: check-overdue-goals
// Schedule: Every 6 hours — cron(0 */6 * * *)
//
// Detects overdue goals and stale updates, auto-creates escalations,
// and notifies owners + managers via in-app notifications.
//
// Usage: npx tsx jobs/check-overdue-goals.ts

import { GoalStatus, EscalationStatus, NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// ─── Config ──────────────────────────────────────────────────────────
const STALE_UPDATE_DAYS = 7;
const APPROVAL_DELAY_DAYS = 7;
const BATCH_SIZE = 50;

// ─── Helpers ─────────────────────────────────────────────────────────
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function elapsed(start: number): string {
  return `${((Date.now() - start) / 1000).toFixed(2)}s`;
}

// ─── Step 1: Overdue goals → escalation ──────────────────────────────
async function escalateOverdueGoals(): Promise<number> {
  const now = new Date();
  let created = 0;
  let cursor: string | undefined;

  while (true) {
    const goals = await prisma.goal.findMany({
      where: {
        dueDate: { lt: now },
        status: {
          notIn: [GoalStatus.COMPLETED, GoalStatus.LOCKED, GoalStatus.DRAFT],
        },
      },
      include: { owner: { select: { id: true, name: true, email: true, managerId: true } } },
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
    });

    if (goals.length === 0) break;
    cursor = goals[goals.length - 1].id;

    for (const goal of goals) {
      // Skip if an open/in-progress escalation already exists
      const existing = await prisma.escalation.findFirst({
        where: {
          goalId: goal.id,
          status: { in: [EscalationStatus.OPEN, EscalationStatus.IN_PROGRESS] },
        },
      });
      if (existing) continue;

      const managerId = goal.owner.managerId;
      if (!managerId) continue; // No manager to assign to

      await prisma.$transaction(async (tx) => {
        // Create escalation
        const escalation = await tx.escalation.create({
          data: {
            title: `Overdue Goal: ${goal.title}`,
            description: `Goal "${goal.title}" owned by ${goal.owner.name || goal.owner.email || "Unknown"} was due on ${goal.dueDate!.toISOString().slice(0, 10)} and is not yet completed. Current status: ${goal.status}.`,
            status: EscalationStatus.OPEN,
            reporterId: goal.ownerId,
            assignedToId: managerId,
            goalId: goal.id,
          },
        });

        // Notify manager
        await tx.notification.create({
          data: {
            userId: managerId,
            type: NotificationType.ESCALATION,
            message: `Escalation created: Goal "${goal.title}" by ${goal.owner.name || goal.owner.email} is overdue.`,
          },
        });

        // Notify owner
        await tx.notification.create({
          data: {
            userId: goal.ownerId,
            type: NotificationType.SYSTEM,
            message: `Your goal "${goal.title}" is overdue. An escalation has been raised to your manager.`,
          },
        });

        // Audit trail
        await tx.auditLog.create({
          data: {
            action: "AUTO_ESCALATION_OVERDUE",
            resource: "ESCALATION",
            resourceId: escalation.id,
            details: JSON.stringify({ goalId: goal.id, dueDate: goal.dueDate }),
          },
        });
      });

      created++;
    }
  }

  return created;
}

// ─── Step 2: Stale updates → notification ────────────────────────────
async function flagStaleUpdates(): Promise<number> {
  const cutoff = daysAgo(STALE_UPDATE_DAYS);
  let flagged = 0;
  let cursor: string | undefined;

  while (true) {
    const goals = await prisma.goal.findMany({
      where: {
        status: {
          notIn: [GoalStatus.COMPLETED, GoalStatus.LOCKED, GoalStatus.DRAFT],
        },
        updates: {
          none: { createdAt: { gte: cutoff } },
        },
      },
      include: { owner: { select: { id: true, name: true, email: true } } },
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
    });

    if (goals.length === 0) break;
    cursor = goals[goals.length - 1].id;

    // Dedupe per-user to avoid notification spam
    const notified = new Set<string>();

    for (const goal of goals) {
      const key = `${goal.ownerId}:stale`;
      if (notified.has(key)) continue;
      notified.add(key);

      await prisma.notification.create({
        data: {
          userId: goal.ownerId,
          type: NotificationType.SYSTEM,
          message: `Reminder: Goal "${goal.title}" has had no updates in ${STALE_UPDATE_DAYS} days. Please provide a progress update.`,
        },
      });

      flagged++;
    }
  }

  return flagged;
}

// ─── Step 3: At-risk goals → escalation ──────────────────────────────
async function escalateAtRiskGoals(): Promise<number> {
  let created = 0;

  const atRiskUpdates = await prisma.goalUpdate.findMany({
    where: { status: "AT_RISK" },
    include: {
      goal: {
        include: { owner: { select: { id: true, name: true, email: true, managerId: true } } },
      },
    },
    distinct: ["goalId"],
  });

  for (const update of atRiskUpdates) {
    const { goal } = update;
    if (!goal.owner.managerId) continue;

    const existing = await prisma.escalation.findFirst({
      where: {
        goalId: goal.id,
        status: { in: [EscalationStatus.OPEN, EscalationStatus.IN_PROGRESS] },
      },
    });
    if (existing) continue;

    await prisma.$transaction(async (tx) => {
      const escalation = await tx.escalation.create({
        data: {
          title: `At-Risk Goal: ${goal.title}`,
          description: `Goal "${goal.title}" owned by ${goal.owner.name || goal.owner.email || "Unknown"} was flagged AT_RISK and requires management attention.`,
          status: EscalationStatus.OPEN,
          reporterId: goal.ownerId,
          assignedToId: goal.owner.managerId!,
          goalId: goal.id,
        },
      });

      await tx.notification.create({
        data: {
          userId: goal.owner.managerId!,
          type: NotificationType.ESCALATION,
          message: `Escalation: Goal "${goal.title}" by ${goal.owner.name || goal.owner.email} is at risk.`,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "AUTO_ESCALATION_AT_RISK",
          resource: "ESCALATION",
          resourceId: escalation.id,
          details: JSON.stringify({ goalId: goal.id }),
        },
      });
    });

    created++;
  }

  return created;
}

// ─── Step 4: Approval delays → escalation ────────────────────────────
async function escalateApprovalDelays(): Promise<number> {
  const cutoff = daysAgo(APPROVAL_DELAY_DAYS);
  let created = 0;

  const staleSubmissions = await prisma.goal.findMany({
    where: {
      status: GoalStatus.SUBMITTED,
      updatedAt: { lt: cutoff },
    },
    include: { owner: { select: { id: true, name: true, email: true, managerId: true } } },
  });

  for (const goal of staleSubmissions) {
    if (!goal.owner.managerId) continue;

    const existing = await prisma.escalation.findFirst({
      where: {
        goalId: goal.id,
        title: { contains: "Approval Delay" },
        status: { in: [EscalationStatus.OPEN, EscalationStatus.IN_PROGRESS] },
      },
    });
    if (existing) continue;

    await prisma.$transaction(async (tx) => {
      const escalation = await tx.escalation.create({
        data: {
          title: `Approval Delay: ${goal.title}`,
          description: `Goal "${goal.title}" has been pending approval for over ${APPROVAL_DELAY_DAYS} days. Submitted by ${goal.owner.name || goal.owner.email || "Unknown"}.`,
          status: EscalationStatus.OPEN,
          reporterId: goal.ownerId,
          assignedToId: goal.owner.managerId!,
          goalId: goal.id,
        },
      });

      await tx.notification.create({
        data: {
          userId: goal.owner.managerId!,
          type: NotificationType.APPROVAL_REQUIRED,
          message: `Action needed: Goal "${goal.title}" has been awaiting your approval for over ${APPROVAL_DELAY_DAYS} days.`,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "AUTO_ESCALATION_APPROVAL_DELAY",
          resource: "ESCALATION",
          resourceId: escalation.id,
          details: JSON.stringify({ goalId: goal.id, submittedAt: goal.updatedAt }),
        },
      });
    });

    created++;
  }

  return created;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const start = Date.now();
  console.log(`[check-overdue-goals] Starting at ${new Date().toISOString()}`);

  const [overdue, stale, atRisk, approvalDelay] = await Promise.all([
    escalateOverdueGoals(),
    flagStaleUpdates(),
    escalateAtRiskGoals(),
    escalateApprovalDelays(),
  ]);

  console.log(`[check-overdue-goals] Done in ${elapsed(start)}`);
  console.log(`  Overdue escalations created: ${overdue}`);
  console.log(`  Stale update notifications:  ${stale}`);
  console.log(`  At-risk escalations created: ${atRisk}`);
  console.log(`  Approval delay escalations:  ${approvalDelay}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[check-overdue-goals] Fatal error:", err);
    process.exit(1);
  });
