import {
  hashPassword,
  isUniqueConstraintError,
  parseJson,
  requireAdminUser,
  updateUserSchema,
  userSelect,
  validateUserRelations,
} from "@/lib/api/admin";
import {
  conflict,
  handleApiError,
  notFound,
  success,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { AuthError, requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

type UserRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: UserRouteContext,
) {
  try {
    await requireAdminUser();

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      return notFound("User not found");
    }

    return success(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: UserRouteContext,
) {
  try {
    await requireAdminUser();

    const { id } = await params;
    const input = await parseJson(request, updateUserSchema);
    await validateUserRelations({ ...input, userId: id });

    const exists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return notFound("User not found");
    }

    const passwordHash = input.password
      ? await hashPassword(input.password)
      : undefined;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        departmentId: input.departmentId,
        managerId: input.managerId,
        image: input.image,
      },
      select: userSelect,
    });

    const currentUser = await requireAuth();
    await prisma.auditLog.create({
      data: {
        action: "USER_UPDATED",
        resource: "USER",
        resourceId: user.id,
        userId: currentUser.id,
      }
    });

    return success(user);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A user with this email already exists");
    }

    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: UserRouteContext,
) {
  try {
    await requireAdminUser();

    const currentUser = await requireAuth();
    const { id } = await params;

    if (currentUser.id === id) {
      throw new AuthError(400, "You cannot delete your own account");
    }

    const exists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return notFound("User not found");
    }

    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "USER_DELETED",
        resource: "USER",
        resourceId: id,
        userId: currentUser.id,
      }
    });

    return success({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
