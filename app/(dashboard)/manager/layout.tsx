import { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ManagerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout
      role="manager"
      title="Dashboard"
      subtitle="Overview of your team's goal progress and pending actions."
    >
      {children}
    </DashboardLayout>
  );
}