"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getNavigationForRole } from "@/lib/navigation";
import type { AppRole } from "@/lib/route-access";

interface AppSidebarProps {
  role: AppRole;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();
  const items = getNavigationForRole(role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="px-7 py-6 border-b border-[#e5e9f2] dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#2563eb] dark:bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-lg font-bold">▶</span>
          </div>

          <div>
            <div className="text-[20px] font-bold text-[#1d4ed8] dark:text-blue-400 leading-none">
              Onside
            </div>
            <div className="text-[14px] text-[#475569] dark:text-slate-400 mt-1">
              Goal Management
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 flex flex-col gap-1">
        {items.map((item) => {
          const href = item.href;

          const active =
            pathname === href ||
            pathname.startsWith(href + "/");

          const isSettings = item.label === "Settings";

          return (
            <Link
              key={`${item.label}-${href}`}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-5 py-1.5 rounded-xl text-[16px] font-medium transition-all ${
                active
                  ? "bg-[#eef4ff] dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400 border-r-4 border-[#2563eb] dark:border-blue-400"
                  : "text-[#334155] dark:text-slate-300 hover:bg-[#f8fafc] dark:hover:bg-slate-700"
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
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        ) : (
          <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[275px] bg-white dark:bg-slate-800 border-r border-[#d9dee7] dark:border-slate-700 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-[275px] bg-white dark:bg-slate-800 border-r border-[#d9dee7] dark:border-slate-700 shrink-0 sticky top-0 h-screen overflow-y-auto z-50 transition-colors">
        <SidebarContent />
      </aside>
    </>
  );
}
