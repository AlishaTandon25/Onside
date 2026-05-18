import { Role } from "@/lib/rbac/roles";

export type AppRole = "employee" | "manager" | "admin";

export const allowedRoutesByRole: Record<AppRole, string[]> = {
  employee: [
    "/employee/dashboard",
    "/my-goals",
    "/goal-creation",
    "/quarterly-updates",
    "/shared-goals",
    "/notifications",
    "/ai-insights",
    "/settings",
  ],
  manager: [
    "/manager/dashboard",
    "/my-goals",
    "/goal-creation",
    "/quarterly-updates",
    "/shared-goals",
    "/team-review",
    "/analytics",
    "/reports",
    "/notifications",
    "/ai-insights",
    "/escalations",
    "/settings",
  ],
  admin: [
    "/admin/dashboard",
    "/analytics",
    "/reports",
    "/audit-trail",
    "/notifications",
    "/ai-insights",
    "/escalations",
    "/settings",
  ],
};

export const sharedRouteMatchers = [
  "/my-goals",
  "/goal-creation",
  "/quarterly-updates",
  "/shared-goals",
  "/team-review",
  "/analytics",
  "/reports",
  "/audit-trail",
  "/notifications",
  "/ai-insights",
  "/escalations",
  "/settings",
];

export const legacyRouteRedirects: Record<string, string> = {
  "/employee/goals/new": "/goal-creation",
  "/employee/goals": "/my-goals",
  "/employee/updates": "/quarterly-updates",
  "/employee/shared-goals": "/shared-goals",
  "/employee/notifications": "/notifications",
  "/employee/ai-insights": "/ai-insights",
  "/employee/escalations": "/escalations",
  "/employee/settings": "/settings",
  "/manager/review": "/team-review",
  "/manager/analytics": "/analytics",
  "/manager/reports": "/reports",
  "/manager/notifications": "/notifications",
  "/manager/ai-insights": "/ai-insights",
  "/manager/escalations": "/escalations",
  "/manager/settings": "/settings",
  "/admin/analytics": "/analytics",
  "/admin/reports": "/reports",
  "/admin/audit": "/audit-trail",
  "/admin/notifications": "/notifications",
  "/admin/ai-insights": "/ai-insights",
  "/admin/escalations": "/escalations",
  "/admin/settings": "/settings",
};

export function toAppRole(role: Role | string): AppRole | null {
  switch (role) {
    case Role.EMPLOYEE:
    case "employee":
      return "employee";
    case Role.MANAGER:
    case "manager":
      return "manager";
    case Role.ADMIN:
    case "admin":
      return "admin";
    default:
      return null;
  }
}

export function getDefaultDashboard(role: AppRole | Role | string): string {
  const appRole = toAppRole(role);

  switch (appRole) {
    case "employee":
      return "/employee/dashboard";
    case "manager":
      return "/manager/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

export function isRouteAllowed(
  role: AppRole | Role | string,
  pathname: string,
): boolean {
  const appRole = toAppRole(role);
  if (!appRole) return false;

  return allowedRoutesByRole[appRole].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function getLegacyRedirect(pathname: string): string | null {
  const match = Object.entries(legacyRouteRedirects)
    .sort(([a], [b]) => b.length - a.length)
    .find(([legacyPath]) => pathname === legacyPath || pathname.startsWith(`${legacyPath}/`));

  if (!match) return null;

  const [legacyPath, targetPath] = match;
  return `${targetPath}${pathname.slice(legacyPath.length)}`;
}
