import { handleApiError, success } from "@/lib/api-response";
import { requireAuth, AuthError } from "@/lib/rbac";
import { getHeatmap } from "@/lib/services/analytics.service";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
      throw new AuthError(403, "You do not have permission to view analytics");
    }
    const data = await getHeatmap();
    return success(data);
  } catch (error) {
    return handleApiError(error);
  }
}
