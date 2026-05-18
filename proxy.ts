import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Better Auth handles its own session management via cookies automatically
  // in Next.js middleware if configured, or via its own API routes.
  // For now, we just pass through.
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
