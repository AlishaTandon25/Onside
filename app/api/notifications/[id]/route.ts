import { z } from "zod";
import { handleApiError, success } from "@/lib/api-response";
import { AuthError, requireAuth } from "@/lib/rbac";
import { markNotification, deleteNotification } from "@/lib/services/notification.service";
import { updateNotificationSchema } from "@/lib/validations/notification";

export const dynamic = "force-dynamic";

type NotificationRouteContext = {
  params: Promise<{ id: string }>;
};

async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AuthError(400, "Request body must be valid JSON");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AuthError(400, parsed.error.issues[0]?.message ?? "Validation failed");
  }

  return parsed.data;
}

export async function PATCH(request: Request, { params }: NotificationRouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const input = await parseJson(request, updateNotificationSchema);
    const result = await markNotification(user, id, input);
    return success(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: NotificationRouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const result = await deleteNotification(user, id);
    return success(result);
  } catch (error) {
    return handleApiError(error);
  }
}
