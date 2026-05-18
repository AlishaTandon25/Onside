import { redirect } from "next/navigation";

export default function LegacyAdminIntegrationSettingsPage() {
  redirect("/settings/integrations");
}
