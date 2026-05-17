"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "person", label: "General", slug: "" },
  { icon: "shield_person", label: "Security", slug: "/security" },
  { icon: "notifications_active", label: "Notifications", slug: "/notifications" },
  { icon: "extension", label: "Integrations", slug: "/integrations" },
  { icon: "group", label: "Team Management", slug: "/team" },
];

export function SettingsNav({ basePath }: { basePath: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-2 lg:w-64">
      {navItems.map((item) => {
        const href = `${basePath}${item.slug}`;
        const active =
          item.slug === ""
            ? pathname === basePath || pathname === basePath + "/"
            : pathname.startsWith(href);

        return (
          <Link
            key={item.label}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "border border-blue-600 bg-white text-blue-600 shadow-sm"
                : "border border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
            {active && (
              <span className="material-symbols-outlined ml-auto text-[18px]">
                chevron_right
              </span>
            )}
          </Link>
        );
      })}
    </aside>
  );
}
