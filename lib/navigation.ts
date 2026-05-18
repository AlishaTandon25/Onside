import type { AppRole } from "@/lib/route-access";

export type NavigationItem = {
  label: string;
  icon: string;
  href: string;
};

export const employeeNavigation: NavigationItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/employee/dashboard" },
  { label: "My Goals", icon: "track_changes", href: "/my-goals" },
  { label: "Goal Creation", icon: "add_circle", href: "/goal-creation" },
  {
    label: "Quarterly Updates",
    icon: "event_repeat",
    href: "/quarterly-updates",
  },
  { label: "Shared Goals", icon: "share_reviews", href: "/shared-goals" },
  { label: "Notifications", icon: "notifications", href: "/notifications" },
  { label: "AI Insights", icon: "psychology", href: "/ai-insights" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

export const managerNavigation: NavigationItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/manager/dashboard" },
  { label: "My Goals", icon: "track_changes", href: "/my-goals" },
  { label: "Goal Creation", icon: "add_circle", href: "/goal-creation" },
  {
    label: "Quarterly Updates",
    icon: "event_repeat",
    href: "/quarterly-updates",
  },
  { label: "Team Review", icon: "groups", href: "/team-review" },
  { label: "Shared Goals", icon: "share_reviews", href: "/shared-goals" },
  { label: "Analytics", icon: "insert_chart", href: "/analytics" },
  { label: "Reports", icon: "description", href: "/reports" },
  { label: "Notifications", icon: "notifications", href: "/notifications" },
  { label: "AI Insights", icon: "psychology", href: "/ai-insights" },
  { label: "Escalations", icon: "priority_high", href: "/escalations" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

export const adminNavigation: NavigationItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
  { label: "Analytics", icon: "insert_chart", href: "/analytics" },
  { label: "Reports", icon: "description", href: "/reports" },
  { label: "Audit Trail", icon: "history", href: "/audit-trail" },
  { label: "Notifications", icon: "notifications", href: "/notifications" },
  { label: "AI Insights", icon: "psychology", href: "/ai-insights" },
  { label: "Escalations", icon: "priority_high", href: "/escalations" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

export function getNavigationForRole(role: AppRole): NavigationItem[] {
  switch (role) {
    case "employee":
      return employeeNavigation;
    case "manager":
      return managerNavigation;
    case "admin":
      return adminNavigation;
  }
}
