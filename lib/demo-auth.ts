import { cookies } from "next/headers";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string | null;
  managerId: string | null;
};

export async function getDemoSession(): Promise<DemoUser | null> {
  try {
    const cookieStore = await cookies();
    const demoSession = cookieStore.get("demo-session");

    console.log("[Demo Auth] Checking for demo session cookie:", !!demoSession);
    console.log("[Demo Auth] All cookies:", cookieStore.getAll().map(c => c.name));

    if (!demoSession) {
      console.log("[Demo Auth] No demo session cookie found");
      return null;
    }

    const user = JSON.parse(demoSession.value);
    console.log("[Demo Auth] Found demo user:", user.email, "Role:", user.role);
    
    return user;
  } catch (error) {
    console.error("[Demo Auth] Error reading demo session:", error);
    return null;
  }
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete("demo-session");
}

// Client-side helper to check demo session from localStorage
export function getClientDemoSession(): DemoUser | null {
  if (typeof window === "undefined") return null;
  
  try {
    const session = localStorage.getItem("demo-session");
    if (!session) return null;
    return JSON.parse(session);
  } catch {
    return null;
  }
}
