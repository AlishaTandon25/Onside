import { z } from "zod";

import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import {
  deleteGoalUpdate,
  updateGoalUpdate,
} from "@/lib/services/goal-update.service";
import { updateGoalUpdateSchema } from "@/lib/validations/goal-update";

export const dynamic = "force-dynamic";

type UpdateRouteContext = {
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

export async function PATCH(
  request: Request,
  { params }: UpdateRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const input = await parseJson(request, updateGoalUpdateSchema);
    const update = await updateGoalUpdate(user, id, input);
    return success(update);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: UpdateRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const result = await deleteGoalUpdate(user, id);
    return success(result);
  } catch (error) {
    return handleApiError(error);
  }
}
