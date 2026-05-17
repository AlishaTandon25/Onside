import { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout
      role="admin"
      title="Dashboard"
      subtitle="Manage users, departments, and platform analytics."
    >
      {children}
    </DashboardLayout>
  );
}