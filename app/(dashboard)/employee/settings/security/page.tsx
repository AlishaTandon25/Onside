import { redirect } from "next/navigation";

export default function LegacyEmployeeSecuritySettingsPage() {
  redirect("/settings/security");
}
