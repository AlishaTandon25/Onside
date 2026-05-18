import { redirect } from "next/navigation";

export default function LegacyAdminNotificationSettingsPage() {
  redirect("/settings/notifications");
}
