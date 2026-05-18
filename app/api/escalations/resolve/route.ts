import { z } from "zod";
import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { resolveEscalation } from "@/lib/services/escalation.service";
import { resolveEscalationSchema } from "@/lib/validations/escalation";

export const dynamic = "force-dynamic";

async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;
  try { body = await request.json(); } catch { throw new AuthError(400, "Request body must be valid JSON"); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new AuthError(400, parsed.error.issues[0]?.message ?? "Validation failed");
  return parsed.data;
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const input = await parseJson(request, resolveEscalationSchema);
    const data = await resolveEscalation(user, input);
    return success(data);
  } catch (error) { return handleApiError(error); }
}
