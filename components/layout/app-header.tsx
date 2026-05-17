"use client";

interface AppHeaderProps {
  role: "employee" | "manager" | "admin";
  title?: string;
  subtitle?: string;
}

export function AppHeader({
  role,
  title,
  subtitle,
}: AppHeaderProps) {
  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-white border-b border-[#d9dee7] shadow-sm">
      <div className="flex justify-between items-center px-6 w-full h-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button className="md:hidden text-[#64748b]">
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search goals, people..."
              className="w-72 pl-10 pr-4 py-2.5 rounded-xl border border-[#d9dee7] bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* AI Insights Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-medium shadow-sm hover:bg-[#1d4ed8] transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              psychology
            </span>
            AI Insights
          </button>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-[#d9dee7] mx-1"></div>

          {/* Role Switcher */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#d9dee7] bg-white text-sm font-medium text-[#334155] hover:bg-[#f8fafc] transition-colors">
            <span>Role Switcher</span>
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-full text-[#334155] hover:bg-[#f8fafc] transition-colors">
            <span className="material-symbols-outlined">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dark Mode */}
          <button className="p-2.5 rounded-full text-[#334155] hover:bg-[#f8fafc] transition-colors">
            <span className="material-symbols-outlined">
              dark_mode
            </span>
          </button>

          {/* Avatar */}
          <div className="ml-1 w-9 h-9 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-sm font-bold shadow-sm cursor-pointer">
            U
          </div>
        </div>
      </div>
    </header>
  );
}