// ─────────────────────────────────────────────────────────
//  Onside RBAC — Role Definitions & Permissions Matrix
//  Single source of truth for all authorization decisions.
// ─────────────────────────────────────────────────────────

/** Application roles — mirrors the Prisma `Role` enum. */
export enum Role {
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

/** Every resource / module in the platform. */
export enum Resource {
  DASHBOARD = "dashboard",
  GOALS = "goals",
  GOAL_CREATION = "goal_creation",
  QUARTERLY_UPDATES = "quarterly_updates",
  TEAM_REVIEW = "team_review",
  SHARED_GOALS = "shared_goals",
  ANALYTICS = "analytics",
  REPORTS = "reports",
  AUDIT_TRAIL = "audit_trail",
  NOTIFICATIONS = "notifications",
  AI_INSIGHTS = "ai_insights",
  ESCALATIONS = "escalations",
  SETTINGS = "settings",
  USERS = "users",
  DEPARTMENTS = "departments",
}

/** Allowed actions on a resource. */
export enum Action {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  APPROVE = "approve",
  EXPORT = "export",
}

/**
 * Scope controls the *data boundary* a role can see for a given resource.
 *
 *  OWN          → only the authenticated user's records
 *  TEAM         → own records + direct reports' records
 *  DEPARTMENT   → all records within the user's department
 *  ORGANIZATION → unrestricted, all records
 */
export enum Scope {
  OWN = "own",
  TEAM = "team",
  DEPARTMENT = "department",
  ORGANIZATION = "organization",
}

// ─────────────────────────────────────────────────────────
//  Permission Entry
// ─────────────────────────────────────────────────────────

export interface Permission {
  actions: Action[];
  scope: Scope;
}

export type PermissionsMap = Record<
  Role,
  Partial<Record<Resource, Permission>>
>;

// ─────────────────────────────────────────────────────────
//  The Matrix
// ─────────────────────────────────────────────────────────

export const PERMISSIONS: PermissionsMap = {
  // ───── EMPLOYEE ─────
  [Role.EMPLOYEE]: {
    [Resource.DASHBOARD]: {
      actions: [Action.READ],
      scope: Scope.OWN,
    },
    [Resource.GOALS]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE],
      scope: Scope.OWN,
    },
    [Resource.GOAL_CREATION]: {
      actions: [Action.READ, Action.CREATE],
      scope: Scope.OWN,
    },
    [Resource.QUARTERLY_UPDATES]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE],
      scope: Scope.OWN,
    },
    [Resource.SHARED_GOALS]: {
      actions: [Action.READ, Action.UPDATE], // view & contribute
      scope: Scope.TEAM,
    },
    [Resource.NOTIFICATIONS]: {
      actions: [Action.READ, Action.UPDATE],
      scope: Scope.OWN,
    },
    [Resource.AI_INSIGHTS]: {
      actions: [Action.READ],
      scope: Scope.OWN, // personal insights only
    },
    [Resource.ESCALATIONS]: {
      actions: [Action.READ],
      scope: Scope.OWN, // view own escalations only
    },
  },

  // ───── MANAGER ─────
  [Role.MANAGER]: {
    [Resource.DASHBOARD]: {
      actions: [Action.READ],
      scope: Scope.TEAM,
    },
    [Resource.GOALS]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.APPROVE],
      scope: Scope.TEAM,
    },
    [Resource.GOAL_CREATION]: {
      actions: [Action.READ, Action.CREATE],
      scope: Scope.TEAM,
    },
    [Resource.QUARTERLY_UPDATES]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE],
      scope: Scope.TEAM,
    },
    [Resource.TEAM_REVIEW]: {
      actions: [Action.READ, Action.UPDATE],
      scope: Scope.TEAM,
    },
    [Resource.SHARED_GOALS]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE],
      scope: Scope.TEAM,
    },
    [Resource.ANALYTICS]: {
      actions: [Action.READ, Action.EXPORT],
      scope: Scope.DEPARTMENT, // team/department level
    },
    [Resource.REPORTS]: {
      actions: [Action.READ, Action.CREATE, Action.EXPORT],
      scope: Scope.TEAM, // team reports
    },
    [Resource.NOTIFICATIONS]: {
      actions: [Action.READ, Action.UPDATE],
      scope: Scope.OWN,
    },
    [Resource.AI_INSIGHTS]: {
      actions: [Action.READ],
      scope: Scope.TEAM, // team insights
    },
    [Resource.ESCALATIONS]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE],
      scope: Scope.TEAM, // create, view, resolve for team
    },
  },

  // ───── ADMIN ─────
  [Role.ADMIN]: {
    [Resource.DASHBOARD]: {
      actions: [Action.READ],
      scope: Scope.ORGANIZATION,
    },
    [Resource.GOALS]: {
      actions: [Action.READ, Action.UPDATE, Action.DELETE],
      scope: Scope.ORGANIZATION,
    },
    [Resource.ANALYTICS]: {
      actions: [Action.READ, Action.EXPORT],
      scope: Scope.ORGANIZATION, // organization-wide
    },
    [Resource.REPORTS]: {
      actions: [Action.READ, Action.CREATE, Action.EXPORT, Action.DELETE],
      scope: Scope.ORGANIZATION, // all reports
    },
    [Resource.AUDIT_TRAIL]: {
      actions: [Action.READ, Action.EXPORT],
      scope: Scope.ORGANIZATION,
    },
    [Resource.NOTIFICATIONS]: {
      actions: [Action.READ, Action.UPDATE, Action.CREATE],
      scope: Scope.ORGANIZATION,
    },
    [Resource.AI_INSIGHTS]: {
      actions: [Action.READ],
      scope: Scope.ORGANIZATION, // organization-wide
    },
    [Resource.ESCALATIONS]: {
      actions: [Action.READ, Action.UPDATE, Action.DELETE],
      scope: Scope.ORGANIZATION, // global oversight
    },
    [Resource.SETTINGS]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
      scope: Scope.ORGANIZATION,
    },
    [Resource.USERS]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
      scope: Scope.ORGANIZATION,
    },
    [Resource.DEPARTMENTS]: {
      actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
      scope: Scope.ORGANIZATION,
    },
  },
};

// ─────────────────────────────────────────────────────────
//  Hierarchy helper — used to compare scope levels
// ─────────────────────────────────────────────────────────

const SCOPE_HIERARCHY: Record<Scope, number> = {
  [Scope.OWN]: 0,
  [Scope.TEAM]: 1,
  [Scope.DEPARTMENT]: 2,
  [Scope.ORGANIZATION]: 3,
};

/** Returns true if `a` is at least as broad as `b`. */
export function scopeIsAtLeast(a: Scope, b: Scope): boolean {
  return SCOPE_HIERARCHY[a] >= SCOPE_HIERARCHY[b];
}

// ─────────────────────────────────────────────────────────
//  Route → Role mapping for middleware protection
// ─────────────────────────────────────────────────────────

/**
 * Maps URL path prefixes to the minimum roles allowed.
 * More specific routes are checked first (order matters).
 */
export const ROUTE_ROLE_MAP: { pattern: string; roles: Role[] }[] = [
  { pattern: "/admin", roles: [Role.ADMIN] },
  { pattern: "/manager", roles: [Role.MANAGER, Role.ADMIN] },
  { pattern: "/employee", roles: [Role.EMPLOYEE, Role.MANAGER, Role.ADMIN] },
];

/** Default redirect targets per role. */
export const ROLE_DASHBOARD: Record<Role, string> = {
  [Role.EMPLOYEE]: "/employee/dashboard",
  [Role.MANAGER]: "/manager/dashboard",
  [Role.ADMIN]: "/admin/dashboard",
};
