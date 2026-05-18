import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { generateInsights } from "@/lib/services/insight.service";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireAuth();
    const data = await generateInsights(user);
    return success(data);
  } catch (error) {
    return handleApiError(error);
  }
}
