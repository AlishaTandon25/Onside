import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const DEMO_USERS = {
  EMPLOYEE: {
    id: "demo-employee-id",
    name: "Demo Employee",
    email: "employee@onside.ai",
    role: "EMPLOYEE",
    departmentId: "demo-dept-1",
    managerId: "demo-manager-id",
  },
  MANAGER: {
    id: "demo-manager-id",
    name: "Demo Manager",
    email: "manager@onside.ai",
    role: "MANAGER",
    departmentId: "demo-dept-1",
    managerId: null,
  },
  ADMIN: {
    id: "demo-admin-id",
    name: "Demo Admin",
    email: "admin@onside.ai",
    role: "ADMIN",
    departmentId: "demo-dept-1",
    managerId: null,
  },
};

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    if (!role || !DEMO_USERS[role as keyof typeof DEMO_USERS]) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const user = DEMO_USERS[role as keyof typeof DEMO_USERS];

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    );

    const token = await new SignJWT({
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      managerId: user.managerId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Set session cookie
    const cookieStore = await cookies();
    
    // NextAuth v5 uses different cookie names based on environment
    const cookieName = process.env.NODE_ENV === "production" 
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user,
      redirectUrl: `/${role.toLowerCase()}/dashboard`,
    });
  } catch (error: any) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create demo session" },
      { status: 500 }
    );
  }
}
