import { z } from "zod";

import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { checkInGoalUpdate } from "@/lib/services/check-in.service";
import { checkInUpdateSchema } from "@/lib/validations/goal-update";

export const dynamic = "force-dynamic";

type CheckInRouteContext = {
  params: Promise<{ id: string }>;
};

async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new AuthError(400, "Request body must be valid JSON");
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
  { params }: CheckInRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const input = await parseJson(request, checkInUpdateSchema);
    const checkedIn = await checkInGoalUpdate(user, id, input);
    return success(checkedIn);
  } catch (error) {
    return handleApiError(error);
  }
}
