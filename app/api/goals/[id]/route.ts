import { z } from "zod";

import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import {
  deleteGoal,
  getGoal,
  updateGoal,
} from "@/lib/services/goal.service";
import { goalUpdateSchema } from "@/lib/validations/goal";

export const dynamic = "force-dynamic";

type GoalRouteContext = {
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
    throw new AuthError(400, parsed.error.issues[0]?.message ?? "Validation failed");
  }

  return parsed.data;
}

export async function GET(
  _request: Request,
  { params }: GoalRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const goal = await getGoal(user, id);
    return success(goal);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: GoalRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const input = await parseJson(request, goalUpdateSchema);
    const goal = await updateGoal(user, id, input);
    return success(goal);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: GoalRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const result = await deleteGoal(user, id);
    return success(result);
  } catch (error) {
    return handleApiError(error);
  }
}
