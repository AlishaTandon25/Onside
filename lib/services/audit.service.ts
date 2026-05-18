import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import {
  containsInsensitive,
  paginationMeta,
  parsePagination,
} from "@/lib/api-query";
import { generateExcelReport } from "@/lib/reports/excel-generator";
import { generatePdfReport } from "@/lib/reports/pdf-generator";

export async function getAuditLogs(user: AuthenticatedUser, query: Record<string, string>) {
  if (user.role !== Role.ADMIN) {
    throw new AuthError(403, "Only admins can view audit logs");
  }

  const { userId, action, resource, startDate, endDate, page, limit } = query;
  const pagination = parsePagination({ page, limit }, { defaultPageSize: 50, maxPageSize: 1000 });

  const where: Prisma.AuditLogWhereInput = {};
  if (userId) where.userId = userId;
  if (action) where.action = containsInsensitive(action);
  if (resource) where.resource = containsInsensitive(resource);
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
      include: { user: { select: { name: true, email: true } } }
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, pagination: paginationMeta(pagination, total) };
}

export async function exportAuditLogs(user: AuthenticatedUser, query: Record<string, string>, format: "EXCEL" | "PDF") {
  if (user.role !== Role.ADMIN) {
    throw new AuthError(403, "Only admins can export audit logs");
  }

  const queryWithoutPagination = { ...query, page: "1", limit: "1000" };
  const { logs } = await getAuditLogs(user, queryWithoutPagination);

  const data = logs.map(l => ({
    Timestamp: l.createdAt.toISOString(),
    Action: l.action,
    Resource: l.resource,
    ResourceId: l.resourceId || "N/A",
    User: l.user ? `${l.user.name} (${l.user.email})` : "System",
    Details: l.details || ""
  }));

  const reportName = `Audit_Export_${new Date().toISOString().split('T')[0]}_${format}`;
  
  if (format === "EXCEL") {
    return { buffer: await generateExcelReport(reportName, data), name: reportName };
  } else {
    return { buffer: await generatePdfReport(reportName, data), name: reportName };
  }
}
