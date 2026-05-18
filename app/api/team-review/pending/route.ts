import { NextRequest } from "next/server";

import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { getTeamReviewGoals } from "@/lib/services/team-review.service";
import { teamReviewQuerySchema } from "@/lib/validations/approval";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const query = teamReviewQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const goals = await getTeamReviewGoals(user, query, true);
    return success(goals);
  } catch (error) {
    return handleApiError(error);
  }
}
