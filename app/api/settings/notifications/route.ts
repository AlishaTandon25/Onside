import {
  defaultNotificationPreferences,
  getOrCreateSettings,
  mergeObjectSettings,
  notificationSettingsSchema,
  parseJson,
} from "@/lib/api/admin";
import { handleApiError, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await requireAuth();
    const settings = await getOrCreateSettings(currentUser.id);

    return success({
      notificationPreferences: mergeObjectSettings(
        defaultNotificationPreferences,
        settings.notificationPreferences,
        {},
      ),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireAuth();
    const input = await parseJson(request, notificationSettingsSchema);
    const settings = await getOrCreateSettings(currentUser.id);
    const notificationPreferences = mergeObjectSettings(
      defaultNotificationPreferences,
      settings.notificationPreferences,
      input,
    );

    const updated = await prisma.userSettings.update({
      where: { userId: currentUser.id },
      data: { notificationPreferences },
      select: { notificationPreferences: true, updatedAt: true },
    });

    return success({
      notificationPreferences: updated.notificationPreferences,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
