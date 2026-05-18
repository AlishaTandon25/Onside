import { NextRequest } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { requireAuth } from "@/lib/rbac";

import {
  createUserSchema,
  defaultIntegrationPreferences,
  defaultNotificationPreferences,
  hashPassword,
  isUniqueConstraintError,
  parseJson,
  requireAdminUser,
  userSelect,
  validateUserRelations,
} from "@/lib/api/admin";
import {
  badRequest,
  conflict,
  created,
  handleApiError,
  success,
} from "@/lib/api-response";
import {
  containsInsensitive,
  getSearch,
  paginationMeta,
  parsePagination,
} from "@/lib/api-query";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();

    const { searchParams } = request.nextUrl;
    const search = getSearch(searchParams);
    const role = searchParams.get("role")?.trim();
    const departmentId = searchParams.get("departmentId")?.trim();
    const pagination = parsePagination(searchParams);

    if (role && !Object.values(Role).includes(role as Role)) {
      return badRequest("role must be EMPLOYEE, MANAGER, or ADMIN");
    }

    const where: Prisma.UserWhereInput = {
      ...(role ? { role: role as Role } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(search
        ? {
            OR: [
              { name: containsInsensitive(search) },
              { email: containsInsensitive(search) },
            ],
          }
        : {}),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.user.count({ where }),
    ]);

    return success({
      data: users,
      pagination: paginationMeta(pagination, total),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const input = await parseJson(request, createUserSchema);
    await validateUserRelations(input);

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        departmentId: input.departmentId ?? null,
        managerId: input.managerId ?? null,
        image: input.image ?? null,
        emailVerified: new Date(),
        settings: {
          create: {
            notificationPreferences: defaultNotificationPreferences,
            integrationPreferences: defaultIntegrationPreferences,
            securityPreferences: {},
          },
        },
      },
      select: userSelect,
    });

    const currentUser = await requireAuth();
    await prisma.auditLog.create({
      data: {
        action: "USER_CREATED",
        resource: "USER",
        resourceId: user.id,
        userId: currentUser.id,
      }
    });

    return created(user);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A user with this email already exists");
    }

    return handleApiError(error);
  }
}
