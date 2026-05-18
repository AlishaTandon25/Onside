import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_EMAILS = [
  "admin@onside.ai",
  "manager@onside.ai",
  "employee@onside.ai",
];

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Count total users
    const userCount = await prisma.user.count();

    // Check if demo users exist
    const demoUsers = await prisma.user.findMany({
      where: {
        email: {
          in: DEMO_EMAILS,
        },
      },
      select: {
        email: true,
      },
    });

    const demoUsersPresent = demoUsers.length === DEMO_EMAILS.length;

    return NextResponse.json({
      database: "connected",
      userCount,
      demoUsersPresent,
      demoUsersFound: demoUsers.map((u) => u.email),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        database: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
