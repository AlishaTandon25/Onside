import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import type { GenerateReportInput } from "@/lib/validations/report";
import { generateExcelReport } from "@/lib/reports/excel-generator";
import { generatePdfReport } from "@/lib/reports/pdf-generator";

export async function listReports(user: AuthenticatedUser) {
  return prisma.report.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, type: true, format: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function downloadReport(user: AuthenticatedUser, id: string) {
  const report = await prisma.report.findUnique({ where: { id } });
  
  if (!report) throw new AuthError(404, "Report not found");
  if (report.userId !== user.id && user.role !== Role.ADMIN) {
    throw new AuthError(403, "Not authorized to download this report");
  }
  if (report.status !== "COMPLETED" || !report.fileData) {
    throw new AuthError(400, "Report file is not available");
  }

  return {
    buffer: report.fileData,
    name: report.name,
    format: report.format,
  };
}

export async function generateReport(user: AuthenticatedUser, input: GenerateReportInput) {
  const reportName = `${input.type}_${new Date().toISOString().split('T')[0]}_${input.format}`;

  const report = await prisma.report.create({
    data: {
      name: reportName,
      type: input.type,
      format: input.format,
      status: "PENDING",
      userId: user.id,
    }
  });

  (async () => {
    try {
      const data = await fetchReportData(user, input.type);
      
      let fileBuffer: Buffer;
      if (input.format === "EXCEL") {
        fileBuffer = await generateExcelReport(reportName, data);
      } else {
        fileBuffer = await generatePdfReport(reportName, data);
      }

      const res = await prisma.report.update({
        where: { id: report.id },
        data: {
          status: "COMPLETED",
          fileData: new Uint8Array(fileBuffer),
        }
      });

      await prisma.auditLog.create({
        data: {
          action: "REPORT_GENERATED",
          resource: "REPORT",
          resourceId: res.id,
          userId: user.id,
        }
      });
    } catch (error) {
      console.error("Report generation failed:", error);
      await prisma.report.update({
        where: { id: report.id },
        data: { status: "FAILED" }
      });
    }
  })();

  return { success: true, reportId: report.id, status: report.status };
}

async function fetchReportData(user: AuthenticatedUser, type: string): Promise<any[]> {
  const role = user.role as Role;
  
  if (type === "GOAL_SUMMARY") {
    let goals = [];
    if (role === Role.ADMIN) {
      goals = await prisma.goal.findMany({ include: { owner: true } });
    } else if (role === Role.MANAGER) {
      goals = await prisma.goal.findMany({ where: { owner: { managerId: user.id } }, include: { owner: true } });
    } else {
      goals = await prisma.goal.findMany({ where: { ownerId: user.id } });
    }
    return goals.map(g => ({
      Id: g.id, Title: g.title, Status: g.status, Progress: g.progress, Owner: (g as any).owner?.name || "Self"
    }));
  }

  if (type === "ESCALATION") {
    let esc = [];
    if (role === Role.ADMIN) {
      esc = await prisma.escalation.findMany({ include: { reporter: true, assignedTo: true } });
    } else if (role === Role.MANAGER) {
      esc = await prisma.escalation.findMany({ 
        where: { OR: [{ reporterId: user.id }, { assignedToId: user.id }, { reporter: { managerId: user.id } }] },
        include: { reporter: true, assignedTo: true }
      });
    } else {
      esc = await prisma.escalation.findMany({ where: { OR: [{ reporterId: user.id }, { goal: { ownerId: user.id } }] } });
    }
    return esc.map(e => ({
      Id: e.id, Title: e.title, Status: e.status, Reporter: (e as any).reporter?.name || "Self", Assignee: (e as any).assignedTo?.name || "None"
    }));
  }

  if (type === "ANALYTICS" || type === "AUDIT") {
    if (role !== Role.ADMIN) throw new Error("Only admins can generate Org Analytics or Audits");
    if (type === "AUDIT") {
      const logs = await prisma.auditLog.findMany({ take: 500, orderBy: { createdAt: "desc" }, include: { user: true } });
      return logs.map(l => ({ Action: l.action, Resource: l.resource, ResourceId: l.resourceId, User: l.user?.name || "System", Date: l.createdAt.toISOString() }));
    } else {
      const activeUsers = await prisma.user.count();
      const totalGoals = await prisma.goal.count();
      return [{ Metric: "Active Users", Value: activeUsers }, { Metric: "Total Goals", Value: totalGoals }];
    }
  }

  return [];
}
