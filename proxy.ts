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
  const { pathname } = request.nextUrl;

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
