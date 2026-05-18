import { Role, NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthError, type AuthenticatedUser } from "@/lib/rbac";
import { sendEmail } from "@/lib/email/resend";
import type { SendNotificationInput, UpdateNotificationInput } from "@/lib/validations/notification";

export async function getUserNotifications(user: AuthenticatedUser) {
  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getUnreadNotifications(user: AuthenticatedUser) {
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id, read: false },
    orderBy: { createdAt: "desc" },
  });

  return {
    count: notifications.length,
    notifications,
  };
}

export async function markNotification(
  user: AuthenticatedUser,
  notificationId: string,
  input: UpdateNotificationInput
) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new AuthError(404, "Notification not found");
  }

  if (notification.userId !== user.id) {
    throw new AuthError(403, "You can only update your own notifications");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: input.read },
  });
}

export async function deleteNotification(user: AuthenticatedUser, notificationId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new AuthError(404, "Notification not found");
  }

  if (notification.userId !== user.id) {
    throw new AuthError(403, "You can only delete your own notifications");
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return { deleted: true };
}

export async function sendNotification(
  user: AuthenticatedUser,
  input: SendNotificationInput
) {
  if (user.role !== Role.ADMIN) {
    throw new AuthError(403, "Only admins can send or broadcast notifications");
  }

  let targetUserIds = input.userIds;

  // If no userIds provided, treat as broadcast
  if (!targetUserIds || targetUserIds.length === 0) {
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    targetUserIds = allUsers.map((u) => u.id);
  }

  if (targetUserIds.length === 0) {
     return { success: true, count: 0 };
  }

  // Create notifications in DB
  const notificationsData = targetUserIds.map((userId) => ({
    userId,
    message: input.message,
    type: input.type as NotificationType,
  }));

  await prisma.notification.createMany({
    data: notificationsData,
  });

  // Send emails if requested
  if (input.sendEmail) {
    const usersToEmail = await prisma.user.findMany({
      where: { id: { in: targetUserIds }, email: { not: null } },
      select: { email: true },
    });

    const emails = usersToEmail.map((u) => u.email).filter(Boolean) as string[];
    
    if (emails.length > 0) {
      // Send emails individually asynchronously to preserve privacy and not block response
      Promise.all(
        emails.map((email) =>
          sendEmail({
            to: email,
            subject: `New Notification: ${input.type}`,
            text: input.message,
          })
        )
      ).catch((err) => console.error("Error sending batch emails:", err));
    }
  }

  return { success: true, count: targetUserIds.length };
}
