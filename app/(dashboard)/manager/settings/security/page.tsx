import { redirect } from "next/navigation";

export default function LegacyManagerSecuritySettingsPage() {
  redirect("/settings/security");
}
