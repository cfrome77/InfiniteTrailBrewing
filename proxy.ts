import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

const LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = await verifySessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  // The login page stays reachable so an operator can authenticate, but a
  // signed-in visitor is sent straight through to the Studio.
  if (pathname === LOGIN_PATH) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin/studio", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // /admin/login is included so the "already signed in" redirect below can
  // actually run; without it this branch was unreachable.
  matcher: ["/admin", "/admin/login", "/admin/studio", "/admin/studio/:path*"],
};
