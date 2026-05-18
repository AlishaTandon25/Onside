import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { listSharedGoals } from "@/lib/services/goal.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();
    const goals = await listSharedGoals(user);
    return success({ data: goals });
  } catch (error) {
    return handleApiError(error);
  }
}
