import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { getInsightById } from "@/lib/services/insight.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const data = await getInsightById(user, id);
    if (!data) throw new AuthError(404, "Insight not found");
    return success(data);
  } catch (error) {
    return handleApiError(error);
  }
}
