"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export function UserNav() {
  const router = useRouter();

  function handleLogout() {
    // Temporary logout implementation
    // Later we will call next-auth signOut()
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <User className="h-4 w-4" />
      Logout
      <LogOut className="h-4 w-4" />
    </button>
  );
}