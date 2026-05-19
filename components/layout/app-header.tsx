"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import type { AppRole } from "@/lib/route-access";
import { UserNav } from "@/components/layout/user-nav";

interface AppHeaderProps {
  role: AppRole;
  title?: string;
  subtitle?: string;
}

export function AppHeader({
  role,
  title,
  subtitle,
}: AppHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAIInsightsClick = () => {
    // Navigate to shared AI Insights page
    router.push("/ai-insights");
  };

  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-[#d9dee7] dark:border-slate-700 shadow-sm transition-colors">
      <div className="flex justify-between items-center px-6 w-full h-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button className="md:hidden text-[#64748b] dark:text-slate-400">
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-500 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search goals, people..."
              className="w-72 pl-10 pr-4 py-2.5 rounded-xl border border-[#d9dee7] dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500 outline-none focus:border-[#2563eb] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#dbeafe] dark:focus:ring-blue-900/50 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* AI Insights Button */}
          <button
            onClick={handleAIInsightsClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] dark:bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-[#1d4ed8] dark:hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              psychology
            </span>
            AI Insights
          </button>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-[#d9dee7] dark:bg-slate-700 mx-1"></div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-full text-[#334155] dark:text-slate-300 hover:bg-[#f8fafc] dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full text-[#334155] dark:text-slate-300 hover:bg-[#f8fafc] dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Avatar */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
