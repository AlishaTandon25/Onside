import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/users/team - Get team members (for managers)
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    if (userRole === "MANAGER") {
      // Get team members for this manager
      const teamMembers = await prisma.user.findMany({
        where: { managerId: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          ownedGoals: {
            select: {
              id: true,
              title: true,
              status: true,
              progress: true,
            },
          },
        },
      });

      return NextResponse.json({ teamMembers });
    } else if (userRole === "ADMIN") {
      // Get all users for admin
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
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
          ownedGoals: {
            select: {
              id: true,
              title: true,
              status: true,
              progress: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });

      return NextResponse.json({ users: allUsers });
    }

    return NextResponse.json(
      { error: "Only managers and admins can view team members" },
      { status: 403 }
    );
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members", details: error.message },
      { status: 500 }
    );
  }
}
