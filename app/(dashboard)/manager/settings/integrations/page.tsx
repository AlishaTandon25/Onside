import { redirect } from "next/navigation";

export default function LegacyManagerIntegrationSettingsPage() {
  redirect("/settings/integrations");
}
