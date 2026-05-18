import { NextRequest } from "next/server";
import { z } from "zod";

import { created, handleApiError, success } from "@/lib/api-response";
import { requireAuth, AuthError } from "@/lib/rbac";
import { createGoal, getGoals } from "@/lib/services/goal.service";
import {
  goalCreateSchema,
  goalQuerySchema,
} from "@/lib/validations/goal";

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

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const query = goalQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const goals = await getGoals(user, query);
    return success(goals);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const input = await parseJson(request, goalCreateSchema);
    const goal = await createGoal(user, input);
    return created(goal);
  } catch (error) {
    return handleApiError(error);
  }
}
