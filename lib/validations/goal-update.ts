import { z } from "zod";

export const goalUpdateCadenceValues = ["WEEKLY", "QUARTERLY"] as const;
export const progressStatusValues = ["NOT_STARTED", "ON_TRACK", "AT_RISK", "COMPLETED"] as const;

const textList = z
  .array(z.string().trim().min(1).max(500))
  .max(20)
  .default([]);

export const createGoalUpdateSchema = z.object({
  cadence: z.enum(goalUpdateCadenceValues).default("WEEKLY"),
  currentValue: z.number(),
  actualAchievement: z.number().optional(),
  status: z.enum(progressStatusValues),
  accomplishments: textList,
  blockers: textList,
  nextSteps: textList,
  comment: z.string().trim().max(2000).nullable().optional(),
});

export const updateGoalUpdateSchema = createGoalUpdateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const checkInUpdateSchema = z.object({
  managerComment: z.string().trim().min(1).max(2000),
});

export type CreateGoalUpdateInput = z.infer<typeof createGoalUpdateSchema>;
export type UpdateGoalUpdateInput = z.infer<typeof updateGoalUpdateSchema>;
export type CheckInUpdateInput = z.infer<typeof checkInUpdateSchema>;
