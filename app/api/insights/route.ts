import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { getInsights } from "@/lib/services/insight.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();
    const data = await getInsights(user);
    return success(data);
  } catch (error) {
    return handleApiError(error);
  }
}
