import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { auth } from "@/lib/auth";
import { toAppRole } from "@/lib/route-access";

export default async function DashboardRouteGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role ? toAppRole(session.user.role) : null;

  if (!role) {
    redirect("/login");
  }

  return (
    <DashboardLayout
      role={role}
      title="Dashboard"
      subtitle={`Welcome to your ${role} workspace.`}
    >
      {children}
    </DashboardLayout>
  );
}
