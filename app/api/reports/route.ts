import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { listReports } from "@/lib/services/report.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();
    const data = await listReports(user);
    return success(data);
  } catch (error) { return handleApiError(error); }
}
