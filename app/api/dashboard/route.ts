import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { getDashboardData } from "@/lib/services/dashboard.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();
    const data = await getDashboardData(user);
    return success(data);
  } catch (error) {
    return handleApiError(error);
  }
}
