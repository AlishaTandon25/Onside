"use client";

import { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import {
  getDefaultDashboard,
  isRouteAllowed,
  type AppRole,
} from "@/lib/route-access";

interface DashboardLayoutProps {
  children: ReactNode;
  role: AppRole;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  role,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const routeAllowed = isRouteAllowed(role, pathname);

  useEffect(() => {
    if (!routeAllowed) {
      router.replace(getDefaultDashboard(role));
    }
  }, [pathname, role, routeAllowed, router]);

  if (!routeAllowed) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar role={role} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader role={role} title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
