import { handleApiError } from "@/lib/api-response";
import { requireAuth, AuthError } from "@/lib/rbac";
import { exportAuditLogs } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    
    const format = query.format === "EXCEL" ? "EXCEL" : query.format === "PDF" ? "PDF" : null;
    if (!format) throw new AuthError(400, "Invalid export format, must be EXCEL or PDF");

    const { buffer, name } = await exportAuditLogs(user, query, format);

    const mimeType = format === "EXCEL" 
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";
      
    const extension = format === "EXCEL" ? "xlsx" : "pdf";

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${name}.${extension}"`,
      },
    });
  } catch (error) { return handleApiError(error); }
}
