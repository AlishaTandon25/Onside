import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { unlockGoal } from "@/lib/services/goal.service";

export const dynamic = "force-dynamic";

type GoalUnlockRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  { params }: GoalUnlockRouteContext,
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const goal = await unlockGoal(user, id);
    return success(goal);
  } catch (error) {
    return handleApiError(error);
  }
}
