import { z } from "zod";
import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { getEscalationById, updateEscalation } from "@/lib/services/escalation.service";
import { updateEscalationSchema } from "@/lib/validations/escalation";

export const dynamic = "force-dynamic";

async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;
  try { body = await request.json(); } catch { throw new AuthError(400, "Request body must be valid JSON"); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new AuthError(400, parsed.error.issues[0]?.message ?? "Validation failed");
  return parsed.data;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const data = await getEscalationById(user, id);
    return success(data);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const input = await parseJson(request, updateEscalationSchema);
    const data = await updateEscalation(user, id, input);
    return success(data);
  } catch (error) { return handleApiError(error); }
}
