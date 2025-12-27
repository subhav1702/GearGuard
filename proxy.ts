import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const session = request.cookies.get("gearguard_session");
  const { pathname } = request.nextUrl;

  // Define public paths
  const isAuthPage = pathname.startsWith("/auth");

  // 1. If no session and trying to access a protected route (non-auth), redirect to login
  if (!session && !isAuthPage) {
    const url = new URL("/auth/login", request.url);
    // Persist the attempted URL to redirect back after login
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. If session exists and trying to access auth pages, redirect to dashboard
  if (session && isAuthPage) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // 3. Prevent any other unauthorized navigation when on auth paths
  // (e.g. if a user manually tries to hit /auth/login while logged in)
  // This is handled by rule #2, but we ensure it's robust.

  return NextResponse.next();
}

// Next.js convention for mandatory function name is 'middleware'
// but we keep the file named proxy.ts if that's what user wants,
// though Next.js looks for middleware.ts by default.
// USER requested to keep it in proxy file.

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, logo.png, apple-icon.png, apple-touch-icon.png, manifest.json, .png, .jpg, .jpeg
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|logo.png|apple-icon.png|apple-touch-icon.png|manifest.json|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
  ],
};
