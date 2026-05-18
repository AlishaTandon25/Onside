import { z } from "zod";

import { created, handleApiError } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { shareGoal } from "@/lib/services/goal.service";
import { shareGoalSchema } from "@/lib/validations/goal";

export const dynamic = "force-dynamic";

async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new AuthError(400, "Request body must be valid JSON");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AuthError(400, parsed.error.issues[0]?.message ?? "Validation failed");
  }

  return parsed.data;
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const input = await parseJson(request, shareGoalSchema);
    const result = await shareGoal(user, input);
    return created(result);
  } catch (error) {
    return handleApiError(error);
  }
}
