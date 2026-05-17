import { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function EmployeeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout
      role="employee"
      title="Dashboard"
      subtitle="Track your goals, progress, and AI insights."
    >
      {children}
    </DashboardLayout>
  );
}