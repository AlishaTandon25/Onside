import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/rbac/roles";
import {
  getDefaultDashboard,
  getLegacyRedirect,
  isRouteAllowed,
  toAppRole,
} from "@/lib/route-access";

const AUTH_PUBLIC_PATHS = ["/api/auth"];
const PUBLIC_PAGE_PATHS = ["/"];

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle demo session parameter
  const demoParam = searchParams.get("demo");
  if (demoParam) {
    try {
      const userData = JSON.parse(Buffer.from(demoParam, "base64").toString());
      console.log("[Proxy] Setting demo session cookie for:", userData.email);
      
      const response = NextResponse.next();
      response.cookies.set("demo-session", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      
      // Redirect to clean URL
      const cleanUrl = new URL(pathname, request.url);
      return NextResponse.redirect(cleanUrl, { headers: response.headers });
    } catch (e) {
      console.error("[Proxy] Error parsing demo param:", e);
    }
  }

  // Check for demo session cookie
  const demoSessionCookie = request.cookies.get("demo-session");
  if (demoSessionCookie) {
    try {
      const demoUser = JSON.parse(demoSessionCookie.value);
      console.log("[Proxy] Demo session active for:", demoUser.email);
      // Allow access for demo users
      return NextResponse.next();
    } catch (e) {
      console.error("[Proxy] Error parsing demo session cookie:", e);
    }
  }

  if (AUTH_PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (PUBLIC_PAGE_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const legacyRedirect = getLegacyRedirect(pathname);

  if (legacyRedirect) {
    const redirectUrl = new URL(legacyRedirect, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return redirectToLogin(request);
  }

  const userRole = token.role as Role | undefined;
  const appRole = userRole ? toAppRole(userRole) : null;

  if (!appRole) {
    return redirectToLogin(request);
  }

  if (!isRouteAllowed(appRole, pathname)) {
    return NextResponse.redirect(
      new URL(getDefaultDashboard(appRole), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
