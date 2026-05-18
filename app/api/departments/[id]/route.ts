import {
  departmentSelect,
  isUniqueConstraintError,
  parseJson,
  requireAdminUser,
  updateDepartmentSchema,
} from "@/lib/api/admin";
import {
  conflict,
  handleApiError,
  notFound,
  success,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type DepartmentRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: DepartmentRouteContext,
) {
  try {
    await requireAdminUser();

    const { id } = await params;
    const department = await prisma.department.findUnique({
      where: { id },
      select: departmentSelect,
    });

    if (!department) {
      return notFound("Department not found");
    }

    return success(department);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: DepartmentRouteContext,
) {
  try {
    await requireAdminUser();

    const { id } = await params;
    const input = await parseJson(request, updateDepartmentSchema);

    const exists = await prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return notFound("Department not found");
    }

    const department = await prisma.department.update({
      where: { id },
      data: input,
      select: departmentSelect,
    });

    return success(department);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A department with this name already exists");
    }

    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: DepartmentRouteContext,
) {
  try {
    await requireAdminUser();

    const { id } = await params;
    const exists = await prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return notFound("Department not found");
    }

    await prisma.department.delete({ where: { id } });

    return success({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
