import { z } from "zod";

export const notificationTypeValues = [
  "GOAL_ASSIGNED",
  "GOAL_UPDATED",
  "APPROVAL_REQUIRED",
  "ESCALATION",
  "SYSTEM",
] as const;

export const sendNotificationSchema = z.object({
  userIds: z.array(z.string()).optional().default([]), // If empty, it's a broadcast
  message: z.string().trim().min(1).max(2000),
  type: z.enum(notificationTypeValues).default("SYSTEM"),
  sendEmail: z.boolean().optional().default(false),
});

export const updateNotificationSchema = z.object({
  read: z.boolean(),
});

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
