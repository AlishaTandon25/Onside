import { z } from "zod";

import { created, handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import {
  createGoalUpdate,
  listGoalUpdates,
} from "@/lib/services/goal-update.service";
import { createGoalUpdateSchema } from "@/lib/validations/goal-update";

export const dynamic = "force-dynamic";

type GoalUpdatesRouteContext = {
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

export async function GET(
  _request: Request,
  { params }: GoalUpdatesRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const updates = await listGoalUpdates(user, id);
    return success({ data: updates });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: GoalUpdatesRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const input = await parseJson(request, createGoalUpdateSchema);
    const update = await createGoalUpdate(user, id, input);
    return created(update);
  } catch (error) {
    return handleApiError(error);
  }
}
