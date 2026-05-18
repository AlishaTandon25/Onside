import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check database connection and users
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    const dbUrl = process.env.DATABASE_URL || "";
    const dbHost = dbUrl.match(/@([^:]+)/)?.[1] || "unknown";

    return NextResponse.json({
      success: true,
      environment: process.env.VERCEL_ENV || "local",
      databaseHost: dbHost,
      userCount: users.length,
      users: users.map(u => ({
        email: u.email,
        role: u.role,
        hasPassword: !!u.passwordHash,
        passwordHashPrefix: u.passwordHash?.substring(0, 10) || "none",
      })),
      authConfig: {
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL || "not set",
        authUrl: process.env.AUTH_URL || "not set",
        trustHost: process.env.AUTH_TRUST_HOST || "not set",
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
