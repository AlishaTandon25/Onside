import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { auth } from "@/lib/auth";
import { toAppRole } from "@/lib/route-access";
import { getDemoSession } from "@/lib/demo-auth";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardRouteGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  console.log("[Dashboard Layout] Checking authentication...");
  
  // Check for demo session first
  const demoSession = await getDemoSession();
  
  if (demoSession) {
    console.log("[Dashboard Layout] Demo session found:", demoSession.email);
    const role = toAppRole(demoSession.role);
    
    if (!role) {
      console.log("[Dashboard Layout] Invalid demo role, redirecting to login");
      redirect("/login");
    }
    
    return (
      <DashboardLayout
        role={role}
        title="Dashboard"
        subtitle={`Welcome to your ${role} workspace (Demo Mode).`}
      >
        {children}
      </DashboardLayout>
    );
  }

  console.log("[Dashboard Layout] No demo session, checking regular auth...");

  // Fall back to regular authentication
  const session = await auth();
  const role = session?.user?.role ? toAppRole(session.user.role) : null;

  if (!role) {
    console.log("[Dashboard Layout] No auth session, redirecting to login");
    redirect("/login");
  }

  console.log("[Dashboard Layout] Regular auth session found:", session?.user?.email);

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
