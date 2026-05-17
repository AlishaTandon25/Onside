"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "employee" | "manager" | "admin";

interface AppSidebarProps {
  role: Role;
}

type NavItem = {
  label: string;
  icon: string;
  href: (role: Role) => string;
};

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();

  const items: NavItem[] = [
    {
      label: "Dashboard",
      icon: "dashboard",
      href: (role) => `/${role}/dashboard`,
    },
    {
      label: "My Goals",
      icon: "track_changes",
      href: () => "/employee/goals",
    },
    {
      label: "Goal Creation",
      icon: "add_circle",
      href: () => "/employee/goals/new",
    },
    {
      label: "Quarterly Updates",
      icon: "event_repeat",
      href: () => "/employee/updates",
    },
    {
      label: "Team Review",
      icon: "groups",
      href: () => "/manager/review",
    },
    {
      label: "Shared Goals",
      icon: "share_reviews",
      href: () => "/employee/shared-goals",
    },
    {
      label: "Analytics",
      icon: "insert_chart",
      href: (role) =>
        role === "admin"
          ? "/admin/analytics"
          : "/manager/analytics",
    },
    {
      label: "Reports",
      icon: "description",
      href: (role) =>
        role === "admin"
          ? "/admin/reports"
          : "/manager/reports",
    },
    {
      label: "Audit Trail",
      icon: "history",
      href: () => "/admin/audit",
    },
    {
      label: "Notifications",
      icon: "notifications",
      href: (role) => `/${role}/notifications`,
    },
    {
      label: "AI Insights",
      icon: "psychology",
      href: (role) => `/${role}/ai-insights`,
    },
    {
      label: "Escalations",
      icon: "priority_high",
      href: (role) => `/${role}/escalations`,
    },
    {
      label: "Settings",
      icon: "settings",
      href: (role) => `/${role}/settings`,
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-[275px] bg-white border-r border-[#d9dee7] shrink-0 sticky top-0 h-screen overflow-y-auto z-50">
      {/* Logo Section */}
      <div className="px-7 py-6 border-b border-[#e5e9f2]">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-lg font-bold">▶</span>
          </div>

          <div>
            <div className="text-[20px] font-bold text-[#1d4ed8] leading-none">
              Onside
            </div>
            <div className="text-[14px] text-[#475569] mt-1">
              Goal Management
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 flex flex-col gap-1">
        {items.map((item) => {
          const href = item.href(role);

          const active =
            pathname === href ||
            pathname.startsWith(href + "/");

          const isSettings = item.label === "Settings";

          return (
            <Link
              key={`${item.label}-${href}`}
              href={href}
              className={`flex items-center gap-4 px-5 py-1.5 rounded-xl text-[16px] font-medium transition-all ${
                active
                  ? "bg-[#eef4ff] text-[#2563eb] border-r-4 border-[#2563eb]"
                  : "text-[#334155] hover:bg-[#f8fafc]"
              } ${isSettings ? "mt-auto" : ""}`}
            >
              <span className="material-symbols-outlined text-[24px] shrink-0">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}