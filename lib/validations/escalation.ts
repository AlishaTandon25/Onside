import { z } from "zod";
import { EscalationStatus } from "@prisma/client";

export const escalationStatusValues = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;

export const createEscalationSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  goalId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const updateEscalationSchema = z.object({
  status: z.enum(escalationStatusValues).optional(),
  assignedToId: z.string().nullable().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided to update",
});

export const resolveEscalationSchema = z.object({
  escalationId: z.string().trim().min(1),
  resolutionNotes: z.string().trim().max(2000).optional(),
});

export type CreateEscalationInput = z.infer<typeof createEscalationSchema>;
export type UpdateEscalationInput = z.infer<typeof updateEscalationSchema>;
export type ResolveEscalationInput = z.infer<typeof resolveEscalationSchema>;
