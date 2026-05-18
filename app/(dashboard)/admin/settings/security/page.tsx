import { redirect } from "next/navigation";

export default function LegacyAdminSecuritySettingsPage() {
  redirect("/settings/security");
}
