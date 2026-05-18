import { NextResponse } from "next/server";
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

    console.log("[Demo Login] Received role:", role);

    if (!role || !DEMO_USERS[role as keyof typeof DEMO_USERS]) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const user = DEMO_USERS[role as keyof typeof DEMO_USERS];

    console.log("[Demo Login] Creating demo session for:", user.email);

    // Encode user data as base64 for URL
    const userData = Buffer.from(JSON.stringify(user)).toString("base64");

    const response = NextResponse.json({
      success: true,
      user,
      // Pass demo session in URL to ensure it's available immediately
      redirectUrl: `/${role.toLowerCase()}/dashboard?demo=${userData}`,
    });

    // Also set cookie for subsequent requests
    response.cookies.set("demo-session", JSON.stringify(user), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create demo session" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const demoSession = cookieStore.get("demo-session");

    if (!demoSession) {
      return NextResponse.json({ session: null });
    }

    const user = JSON.parse(demoSession.value);
    return NextResponse.json({ session: user });
  } catch (error) {
    return NextResponse.json({ session: null });
  }
}
