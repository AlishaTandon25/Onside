import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Action,
  PERMISSIONS,
  Resource,
  Role,
  Scope,
  type Permission,
} from "./roles";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
  departmentId?: string | null;
  managerId?: string | null;
}

export interface OwnershipFilter {
  ownerId?: string;
  owner?: {
    managerId?: string;
    departmentId?: string;
  };
  OR?: OwnershipFilter[];
}

export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    throw new AuthError(401, "Authentication required");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    departmentId: session.user.departmentId,
    managerId: session.user.managerId,
  };
}

export const getAuthenticatedUser = requireAuth;

export async function requireRole(
  ...roles: Role[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    throw new AuthError(403, "Insufficient permissions");
  }

  return user;
}

export function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole(Role.ADMIN);
}

export function requireManager(): Promise<AuthenticatedUser> {
  return requireRole(Role.MANAGER);
}

export function requireEmployee(): Promise<AuthenticatedUser> {
  return requireRole(Role.EMPLOYEE);
}

export function authorize(
  role: Role,
  resource: Resource,
  action: Action,
): boolean {
  const permission = PERMISSIONS[role]?.[resource];
  if (!permission) return false;
  return permission.actions.includes(action);
}

export function authorizeOrThrow(
  role: Role,
  resource: Resource,
  action: Action,
): void {
  if (!authorize(role, resource, action)) {
    throw new AuthError(
      403,
      `Forbidden: role "${role}" cannot "${action}" on "${resource}"`,
    );
  }
}

export async function requirePermission(
  resource: Resource,
  action: Action,
): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  authorizeOrThrow(user.role, resource, action);
  return user;
}

export function getAccessScope(
  role: Role,
  resource: Resource,
): Scope | null {
  const permission = PERMISSIONS[role]?.[resource];
  return permission?.scope ?? null;
}

export function getPermission(
  role: Role,
  resource: Resource,
): Permission | null {
  return PERMISSIONS[role]?.[resource] ?? null;
}

export async function buildOwnershipFilter(
  userId: string,
  role: Role,
  resource: Resource,
): Promise<OwnershipFilter> {
  const scope = getAccessScope(role, resource);

  switch (scope) {
    case Scope.ORGANIZATION:
      return {};

    case Scope.DEPARTMENT: {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true },
      });

      if (!user?.departmentId) {
        return { ownerId: userId };
      }

      return { owner: { departmentId: user.departmentId } };
    }

    case Scope.TEAM: {
      const directReports = await prisma.user.findMany({
        where: { managerId: userId },
        select: { id: true },
      });
      const teamIds = [userId, ...directReports.map((user) => user.id)];

      return {
        OR: teamIds.map((id) => ({ ownerId: id })),
      };
    }

    case Scope.OWN:
    default:
      return { ownerId: userId };
  }
}

export async function canAccessUser(
  targetUserId: string,
): Promise<boolean> {
  const user = await requireAuth();

  if (user.role === Role.ADMIN || user.id === targetUserId) {
    return true;
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      managerId: true,
    },
  });

  if (!targetUser) {
    return false;
  }

  if (user.role === Role.MANAGER) {
    return targetUser.managerId === user.id;
  }

  return false;
}

export async function canAccessGoal(goalId: string): Promise<boolean> {
  const user = await requireAuth();

  if (user.role === Role.ADMIN) {
    return true;
  }

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    select: {
      ownerId: true,
      owner: {
        select: {
          managerId: true,
        },
      },
      participants: {
        where: { userId: user.id },
        select: { userId: true },
      },
    },
  });

  if (!goal) {
    return false;
  }

  if (goal.ownerId === user.id || goal.participants.length > 0) {
    return true;
  }

  if (user.role === Role.MANAGER) {
    return goal.owner.managerId === user.id;
  }

  return false;
}
