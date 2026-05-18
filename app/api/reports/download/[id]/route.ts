import { handleApiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/rbac";
import { downloadReport } from "@/lib/services/report.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const { buffer, name, format } = await downloadReport(user, id);

    const mimeType = format === "EXCEL" 
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";
      
    const extension = format === "EXCEL" ? "xlsx" : "pdf";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${name}.${extension}"`,
      },
    });
  } catch (error) { return handleApiError(error); }
}
