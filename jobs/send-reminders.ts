/**
 * Job: send-reminders
 * Schedule: Daily at 8:00 AM (0 8 * * *)
 *
 * Sends reminder notifications + emails for:
 * 1. Goals due within 3 days
 * 2. Goals due today
 * 3. Pending approvals (nudge managers)
 * 4. Unread escalations older than 24h
 *
 * Usage: npx tsx jobs/send-reminders.ts
 */

import { GoalStatus, NotificationType, EscalationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/resend";

// ─── Config ──────────────────────────────────────────────────────────
const DUE_SOON_DAYS = 3;
const BATCH_SIZE = 50;

// ─── Helpers ─────────────────────────────────────────────────────────
function elapsed(start: number): string {
  return `${((Date.now() - start) / 1000).toFixed(2)}s`;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function hoursAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}

// ─── Email helpers ───────────────────────────────────────────────────
async function notifyAndEmail(
  userId: string,
  email: string | null,
  type: NotificationType,
  message: string,
  emailSubject: string
) {
  // Always create in-app notification
  await prisma.notification.create({
    data: { userId, type, message },
  });

  // Attempt email delivery (non-blocking; failures are logged)
  if (email) {
    await sendEmail({
      to: email,
      subject: emailSubject,
      text: message,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">Onside Notification</h2>
          </div>
          <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0;">${message}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">This is an automated reminder from Onside. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    }).catch((err) =>
      console.warn(`  Email delivery failed for ${email}:`, err instanceof Error ? err.message : err)
    );
  }
}

// ─── Step 1: Goals due soon (within 3 days) ──────────────────────────
async function remindDueSoonGoals(): Promise<number> {
  const soon = daysFromNow(DUE_SOON_DAYS);
  const now = new Date();
  let sent = 0;

  const goals = await prisma.goal.findMany({
    where: {
      dueDate: { gte: now, lte: soon },
      status: {
        notIn: [GoalStatus.COMPLETED, GoalStatus.LOCKED, GoalStatus.DRAFT],
      },
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  for (const goal of goals) {
    const daysLeft = Math.ceil(
      (goal.dueDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const urgency = daysLeft <= 1 ? "⚠️ " : "";

    await notifyAndEmail(
      goal.ownerId,
      goal.owner.email,
      NotificationType.SYSTEM,
      `${urgency}Your goal "${goal.title}" is due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Current progress: ${Math.round(goal.progress)}%.`,
      `${urgency}Goal Due Soon: ${goal.title}`
    );

    sent++;
  }

  return sent;
}

// ─── Step 2: Goals due today ─────────────────────────────────────────
async function remindDueTodayGoals(): Promise<number> {
  let sent = 0;

  const goals = await prisma.goal.findMany({
    where: {
      dueDate: { gte: startOfToday(), lte: endOfToday() },
      status: {
        notIn: [GoalStatus.COMPLETED, GoalStatus.LOCKED, GoalStatus.DRAFT],
      },
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  for (const goal of goals) {
    await notifyAndEmail(
      goal.ownerId,
      goal.owner.email,
      NotificationType.SYSTEM,
      `🔴 Your goal "${goal.title}" is due TODAY. Please submit your final update.`,
      `🔴 Goal Due Today: ${goal.title}`
    );

    sent++;
  }

  return sent;
}

// ─── Step 3: Pending approval reminders for managers ─────────────────
async function remindPendingApprovals(): Promise<number> {
  let sent = 0;

  const pendingGoals = await prisma.goal.findMany({
    where: { status: GoalStatus.SUBMITTED },
    include: {
      owner: { select: { id: true, name: true, email: true, managerId: true, manager: { select: { id: true, email: true, name: true } } } },
    },
  });

  // Group by manager to send a single consolidated reminder
  const byManager = new Map<
    string,
    { managerId: string; managerEmail: string | null; managerName: string | null; goals: string[] }
  >();

  for (const goal of pendingGoals) {
    const manager = goal.owner.manager;
    if (!manager) continue;

    if (!byManager.has(manager.id)) {
      byManager.set(manager.id, {
        managerId: manager.id,
        managerEmail: manager.email,
        managerName: manager.name,
        goals: [],
      });
    }
    byManager.get(manager.id)!.goals.push(goal.title);
  }

  for (const [, data] of byManager) {
    const goalList = data.goals.map((t) => `• ${t}`).join("\n");
    const message = `You have ${data.goals.length} goal${data.goals.length !== 1 ? "s" : ""} awaiting your approval:\n${goalList}`;

    await notifyAndEmail(
      data.managerId,
      data.managerEmail,
      NotificationType.APPROVAL_REQUIRED,
      message,
      `${data.goals.length} Goal${data.goals.length !== 1 ? "s" : ""} Awaiting Your Approval`
    );

    sent++;
  }

  return sent;
}

// ─── Step 4: Unactioned escalation reminders ─────────────────────────
async function remindUnactionedEscalations(): Promise<number> {
  let sent = 0;
  const cutoff = hoursAgo(24);

  const escalations = await prisma.escalation.findMany({
    where: {
      status: EscalationStatus.OPEN,
      createdAt: { lt: cutoff },
      assignedToId: { not: null },
    },
    include: {
      assignedTo: { select: { id: true, email: true, name: true } },
    },
  });

  for (const esc of escalations) {
    if (!esc.assignedTo) continue;

    await notifyAndEmail(
      esc.assignedTo.id,
      esc.assignedTo.email,
      NotificationType.ESCALATION,
      `Escalation "${esc.title}" has been open for over 24 hours and requires your attention.`,
      `Action Required: Escalation "${esc.title}"`
    );

    sent++;
  }

  return sent;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const start = Date.now();
  console.log(`[send-reminders] Starting at ${new Date().toISOString()}`);

  const [dueSoon, dueToday, approvals, escalations] = await Promise.all([
    remindDueSoonGoals(),
    remindDueTodayGoals(),
    remindPendingApprovals(),
    remindUnactionedEscalations(),
  ]);

  console.log(`[send-reminders] Done in ${elapsed(start)}`);
  console.log(`  Due-soon reminders:       ${dueSoon}`);
  console.log(`  Due-today reminders:       ${dueToday}`);
  console.log(`  Approval nudges (mgrs):    ${approvals}`);
  console.log(`  Escalation reminders:      ${escalations}`);
  console.log(`  Total sent:                ${dueSoon + dueToday + approvals + escalations}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[send-reminders] Fatal error:", err);
    process.exit(1);
  });
