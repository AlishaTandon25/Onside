import { z } from "zod";

export const auditQuerySchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("50"),
});

export const auditExportSchema = auditQuerySchema.extend({
  format: z.enum(["EXCEL", "PDF"]),
});
