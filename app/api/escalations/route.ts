import { z } from "zod";
import { handleApiError, success, created } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { listEscalations, createEscalation } from "@/lib/services/escalation.service";
import { createEscalationSchema } from "@/lib/validations/escalation";

export const dynamic = "force-dynamic";

async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;
  try { body = await request.json(); } catch { throw new AuthError(400, "Request body must be valid JSON"); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new AuthError(400, parsed.error.issues[0]?.message ?? "Validation failed");
  return parsed.data;
}

export async function GET() {
  try {
    const user = await requireAuth();
    const data = await listEscalations(user);
    return success(data);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const input = await parseJson(request, createEscalationSchema);
    const data = await createEscalation(user, input);
    return created(data);
  } catch (error) { return handleApiError(error); }
}
