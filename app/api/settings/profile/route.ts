import {
  getCurrentUserOrThrow,
  parseJson,
  profileUpdateSchema,
  userSelect,
} from "@/lib/api/admin";
import { handleApiError, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUserOrThrow();
    return success(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireAuth();
    const input = await parseJson(request, profileUpdateSchema);

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: input,
      select: userSelect,
    });

    return success(user);
  } catch (error) {
    return handleApiError(error);
  }
}
