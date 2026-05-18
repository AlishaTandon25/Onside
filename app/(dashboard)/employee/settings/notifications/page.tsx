import { redirect } from "next/navigation";

export default function LegacyEmployeeNotificationSettingsPage() {
  redirect("/settings/notifications");
}
