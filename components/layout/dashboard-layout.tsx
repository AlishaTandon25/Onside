import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "employee" | "manager" | "admin";
  title: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  role,
  title,
  subtitle,
}: DashboardLayoutProps) {
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