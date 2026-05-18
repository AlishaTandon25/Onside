import { z } from "zod";

import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { approveGoalSheet } from "@/lib/services/approval.service";
import { approvalDecisionSchema } from "@/lib/validations/approval";

export const dynamic = "force-dynamic";

type GoalDecisionContext = {
  params: Promise<{ id: string }>;
};

async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AuthError(
      400,
      parsed.error.issues[0]?.message ?? "Validation failed",
    );
  }

  return parsed.data;
}

export async function POST(
  request: Request,
  { params }: GoalDecisionContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const input = await parseJson(request, approvalDecisionSchema);
    const result = await approveGoalSheet(user, id, input);
    return success(result);
  } catch (error) {
    return handleApiError(error);
  }
}
