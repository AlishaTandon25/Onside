import {
  defaultIntegrationPreferences,
  getOrCreateSettings,
  integrationSettingsSchema,
  mergeObjectSettings,
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
      integrationPreferences: mergeObjectSettings(
        defaultIntegrationPreferences,
        settings.integrationPreferences,
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
    const input = await parseJson(request, integrationSettingsSchema);
    const settings = await getOrCreateSettings(currentUser.id);
    const integrationPreferences = mergeObjectSettings(
      defaultIntegrationPreferences,
      settings.integrationPreferences,
      input,
    );

    const updated = await prisma.userSettings.update({
      where: { userId: currentUser.id },
      data: { integrationPreferences },
      select: { integrationPreferences: true, updatedAt: true },
    });

    return success({
      integrationPreferences: updated.integrationPreferences,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
