import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import {
  createDepartmentSchema,
  departmentSelect,
  isUniqueConstraintError,
  parseJson,
  requireAdminUser,
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
    const pagination = parsePagination(searchParams);

    const where: Prisma.DepartmentWhereInput = search
      ? {
          OR: [
            { name: containsInsensitive(search) },
            { description: containsInsensitive(search) },
          ],
        }
      : {};

    const [departments, total] = await prisma.$transaction([
      prisma.department.findMany({
        where,
        select: departmentSelect,
        orderBy: { name: "asc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.department.count({ where }),
    ]);

    return success({
      data: departments,
      pagination: paginationMeta(pagination, total),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const input = await parseJson(request, createDepartmentSchema);
    const department = await prisma.department.create({
      data: input,
      select: departmentSelect,
    });

    return created(department);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A department with this name already exists");
    }

    return handleApiError(error);
  }
}
