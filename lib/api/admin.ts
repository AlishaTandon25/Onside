import bcrypt from "bcryptjs";
import { Prisma, Role } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { AuthError, requireAdmin, requireAuth } from "@/lib/rbac";

export const userSelect = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  role: true,
  departmentId: true,
  managerId: true,
  createdAt: true,
  updatedAt: true,
  department: {
    select: {
      id: true,
      name: true,
    },
  },
  manager: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.UserSelect;

export const departmentSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      users: true,
    },
  },
} satisfies Prisma.DepartmentSelect;

export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128),
  role: z.enum(Role).default(Role.EMPLOYEE),
  departmentId: z.string().trim().min(1).nullable().optional(),
  managerId: z.string().trim().min(1).nullable().optional(),
  image: z.url().nullable().optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120).nullable().optional(),
    email: z.email().transform((email) => email.toLowerCase()).optional(),
    password: z.string().min(8).max(128).optional(),
    role: z.enum(Role).optional(),
    departmentId: z.string().trim().min(1).nullable().optional(),
    managerId: z.string().trim().min(1).nullable().optional(),
    image: z.url().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    image: z.url().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const securityUpdateSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const notificationSettingsSchema = z
  .object({
    email: z.boolean().optional(),
    inApp: z.boolean().optional(),
    goalUpdates: z.boolean().optional(),
    approvals: z.boolean().optional(),
    escalations: z.boolean().optional(),
    reports: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one setting is required",
  });

export const integrationSettingsSchema = z
  .object({
    microsoft: z.boolean().optional(),
    slack: z.boolean().optional(),
    googleCalendar: z.boolean().optional(),
    webhookUrl: z.url().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one setting is required",
  });

type NotificationPreferences = z.infer<typeof notificationSettingsSchema>;

type IntegrationPreferences = Omit<
  z.infer<typeof integrationSettingsSchema>,
  "webhookUrl"
> & {
  webhookUrl: string | null;
};

export const defaultNotificationPreferences: Required<NotificationPreferences> =
  {
  email: true,
  inApp: true,
  goalUpdates: true,
  approvals: true,
  escalations: true,
  reports: false,
};

export const defaultIntegrationPreferences: Required<IntegrationPreferences> = {
  microsoft: false,
  slack: false,
  googleCalendar: false,
  webhookUrl: null,
};

export async function parseJson<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new AuthError(400, "Request body must be valid JSON");
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new AuthError(400, "Validation failed");
  }

  return parsed.data;
}

export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function validateUserRelations(input: {
  departmentId?: string | null;
  managerId?: string | null;
  userId?: string;
}) {
  if (input.departmentId) {
    const department = await prisma.department.findUnique({
      where: { id: input.departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new AuthError(400, "Department does not exist");
    }
  }

  if (input.managerId) {
    if (input.managerId === input.userId) {
      throw new AuthError(400, "A user cannot be their own manager");
    }

    const manager = await prisma.user.findUnique({
      where: { id: input.managerId },
      select: { id: true, role: true },
    });

    if (!manager) {
      throw new AuthError(400, "Manager does not exist");
    }

    if (manager.role === Role.EMPLOYEE) {
      throw new AuthError(400, "Manager must have MANAGER or ADMIN role");
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function getOrCreateSettings(userId: string) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      notificationPreferences: defaultNotificationPreferences,
      integrationPreferences: defaultIntegrationPreferences,
      securityPreferences: {},
    },
  });
}

export function mergeObjectSettings<T extends Record<string, unknown>>(
  defaults: T,
  existing: Prisma.JsonValue,
  patch: Partial<T>,
): T {
  const existingObject =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? existing
      : {};

  return {
    ...defaults,
    ...existingObject,
    ...patch,
  } as T;
}

export async function getCurrentUserOrThrow() {
  const currentUser = await requireAuth();
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: userSelect,
  });

  if (!user) {
    throw new AuthError(401, "Authentication required");
  }

  return user;
}

export async function requireAdminUser() {
  await requireAdmin();
}
