import { z } from "zod";

export const goalStatusValues = [
  "DRAFT",
  "SUBMITTED",
  "RETURNED_FOR_REWORK",
  "APPROVED",
  "REJECTED",
  "REWORK",
  "LOCKED",
  "COMPLETED",
] as const;

export const unitOfMeasurementValues = [
  "NUMERIC",
  "PERCENTAGE",
  "TIMELINE",
  "ZERO_BASED",
] as const;

export const priorityValues = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

const optionalDate = z
  .string()
  .datetime()
  .or(z.string().date())
  .optional()
  .nullable();

export const goalCreateSchema = z.object({
  thrustArea: z.string().trim().min(1, "Thrust Area is required").max(120),
  title: z.string().trim().min(1, "Goal title is required").max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  unitOfMeasurement: z.enum(unitOfMeasurementValues),
  startValue: z.number().nullable().optional(),
  targetValue: z.number(),
  currentValue: z.number().optional(),
  weightage: z.number().int().min(10).max(100),
  priority: z.enum(priorityValues).default("MEDIUM"),
  dueDate: optionalDate,
  cycleId: z.string().trim().min(1).max(80).default("2026"),
});

export const goalUpdateSchema = goalCreateSchema
  .extend({
    status: z.enum(goalStatusValues).optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const goalSubmitSchema = z.object({
  cycleId: z.string().trim().min(1).max(80).default("2026"),
});

export const goalQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(goalStatusValues).optional(),
  thrustArea: z.string().trim().optional(),
  ownerId: z.string().trim().optional(),
  cycle: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const shareGoalSchema = z.object({
  thrustArea: z.string().trim().min(1, "Thrust Area is required").max(120),
  title: z.string().trim().min(1, "Goal title is required").max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  unitOfMeasurement: z.enum(unitOfMeasurementValues),
  startValue: z.number().nullable().optional(),
  targetValue: z.number(),
  currentValue: z.number().optional(),
  weightage: z.number().int().min(10).max(100),
  priority: z.enum(priorityValues).default("MEDIUM"),
  dueDate: optionalDate,
  cycleId: z.string().trim().min(1).max(80).default("2026"),
  recipientIds: z.array(z.string().trim().min(1)).min(1),
});

export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>;
export type GoalQueryInput = z.infer<typeof goalQuerySchema>;
export type GoalSubmitInput = z.infer<typeof goalSubmitSchema>;
export type ShareGoalInput = z.infer<typeof shareGoalSchema>;
