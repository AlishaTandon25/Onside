import { handleApiError, success } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { getAuditLogs } from "@/lib/services/audit.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    
    const data = await getAuditLogs(user, query);
    return success(data);
  } catch (error) { return handleApiError(error); }
}
