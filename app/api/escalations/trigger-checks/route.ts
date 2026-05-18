import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { triggerAutomatedEscalations } from "@/lib/services/escalation.service";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireAuth();
    if (user.role !== Role.ADMIN) {
      throw new AuthError(403, "Only admins can trigger automated escalation checks");
    }
    const data = await triggerAutomatedEscalations();
    return success(data);
  } catch (error) { return handleApiError(error); }
}
