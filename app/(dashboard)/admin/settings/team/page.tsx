import { redirect } from "next/navigation";

export default function LegacyAdminTeamSettingsPage() {
  redirect("/settings/team");
}
