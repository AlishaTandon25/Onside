import bcrypt from "bcryptjs";

import {
  hashPassword,
  parseJson,
  securityUpdateSchema,
} from "@/lib/api/admin";
import { handleApiError, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { AuthError, requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await requireAuth();
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        passwordHash: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AuthError(401, "Authentication required");
    }

    return success({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      hasPassword: Boolean(user.passwordHash),
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireAuth();
    const input = await parseJson(request, securityUpdateSchema);

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { id: true, passwordHash: true },
    });

    if (!user?.passwordHash) {
      throw new AuthError(400, "Password login is not enabled for this user");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new AuthError(400, "Current password is incorrect");
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        passwordHash: await hashPassword(input.newPassword),
      },
      select: { id: true },
    });

    return success({ updated: true });
  } catch (error) {
    return handleApiError(error);
  }
}
