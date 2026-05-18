// ─────────────────────────────────────────────────────────
//  Onside RBAC — Barrel Export
// ─────────────────────────────────────────────────────────

// Re-export everything so consumers can do:
//   import { Role, authorize, getAuthenticatedUser } from "@/lib/rbac";

export {
  Role,
  Resource,
  Action,
  Scope,
  PERMISSIONS,
  ROUTE_ROLE_MAP,
  ROLE_DASHBOARD,
  scopeIsAtLeast,
} from "./roles";

export type { Permission, PermissionsMap } from "./roles";

export {
  requireAuth,
  getAuthenticatedUser,
  authorize,
  authorizeOrThrow,
  getAccessScope,
  getPermission,
  buildOwnershipFilter,
  requireRole,
  requireAdmin,
  requireManager,
  requireEmployee,
  requirePermission,
  canAccessUser,
  canAccessGoal,
  AuthError,
} from "./helpers";

export type { AuthenticatedUser, OwnershipFilter } from "./helpers";
