import { z } from "zod";

export const generateReportSchema = z.object({
  type: z.enum(["GOAL_SUMMARY", "ANALYTICS", "AUDIT", "ESCALATION"]),
  format: z.enum(["EXCEL", "PDF"]),
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;
