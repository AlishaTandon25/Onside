import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import type { Role as AppRole } from "@/lib/rbac/roles";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

function normalizeAuthEnvironment() {
  if (process.env.VERCEL !== "1") {
    return;
  }

  process.env.AUTH_TRUST_HOST = process.env.AUTH_TRUST_HOST ?? "true";

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  if (!vercelHost) {
    return;
  }

  const vercelUrl = `https://${vercelHost}`;
  const configuredUrl =
    process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
  const isLocalhostUrl =
    configuredUrl.includes("localhost") ||
    configuredUrl.includes("127.0.0.1");

  if (!configuredUrl || isLocalhostUrl) {
    process.env.AUTH_URL = vercelUrl;
    process.env.NEXTAUTH_URL = vercelUrl;
  }
}

normalizeAuthEnvironment();

const config = {
  trustHost: true,

  session: {
    strategy: "jwt" as const,
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as AppRole,
          departmentId: user.departmentId,
          managerId: user.managerId,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.departmentId = user.departmentId;
        token.managerId = user.managerId;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id ?? token.sub;
        session.user.role = token.role;
        session.user.departmentId = token.departmentId;
        session.user.managerId = token.managerId;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }: { user: User }) {
      if (user?.id) {
        try {
          await prisma.auditLog.create({
            data: {
              action: "USER_LOGIN",
              resource: "SESSION",
              userId: user.id,
            }
          });
        } catch (error) {
          console.error("[Auth Event] Failed to write login audit log", error);
        }
      }
    }
  }
} satisfies NextAuthConfig;

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(config);
