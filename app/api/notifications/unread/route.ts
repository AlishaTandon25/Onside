import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { getUnreadNotifications } from "@/lib/services/notification.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();
    const data = await getUnreadNotifications(user);
    return success(data);
  } catch (error) {
    return handleApiError(error);
  }
}
