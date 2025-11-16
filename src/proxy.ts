import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get("memento-auth-storage");
  const pathname = request.nextUrl.pathname;

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Parse auth token from cookie
  let hasValidToken = false;
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie.value);
      hasValidToken = !!authData?.state?.access_token;
    } catch (e) {
      // Invalid cookie, treat as not authenticated
      hasValidToken = false;
    }
  }

  // Redirect logic
  if (!hasValidToken && !isPublicRoute) {
    // No token and trying to access protected route -> redirect to login
    return NextResponse.redirect(new URL("/logout", request.url));
  }

  if (hasValidToken && isPublicRoute) {
    // Has token and trying to access public route -> redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
