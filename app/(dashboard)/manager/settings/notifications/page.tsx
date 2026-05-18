import { redirect } from "next/navigation";

export default function LegacyManagerNotificationSettingsPage() {
  redirect("/settings/notifications");
}
