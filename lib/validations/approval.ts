import { z } from "zod";
import { priorityValues, goalStatusValues } from "@/lib/validations/goal";

const optionalDate = z
  .string()
  .datetime()
  .or(z.string().date())
  .nullable()
  .optional();

export const inlineGoalEditSchema = z
  .object({
    targetValue: z.number().optional(),
    weightage: z.number().int().min(10).max(100).optional(),
    dueDate: optionalDate,
    priority: z.enum(priorityValues).optional(),
  })
  .default({});

export const approvalDecisionSchema = z.object({
  comment: z.string().trim().max(2000).optional(),
  edits: inlineGoalEditSchema,
});

export const returnForReworkSchema = z.object({
  comment: z.string().trim().min(1, "Manager comments are required").max(2000),
  edits: inlineGoalEditSchema,
});

export const rejectGoalSchema = z.object({
  comment: z.string().trim().min(1, "Rejection comments are required").max(2000),
  edits: inlineGoalEditSchema,
});

export const teamReviewQuerySchema = z.object({
  employeeId: z.string().trim().optional(),
  status: z.enum(goalStatusValues).optional(),
  search: z.string().trim().optional(),
  cycle: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export type ApprovalDecisionInput = z.infer<typeof approvalDecisionSchema>;
export type ReturnForReworkInput = z.infer<typeof returnForReworkSchema>;
export type RejectGoalInput = z.infer<typeof rejectGoalSchema>;
export type TeamReviewQueryInput = z.infer<typeof teamReviewQuerySchema>;
export type InlineGoalEditInput = z.infer<typeof inlineGoalEditSchema>;
