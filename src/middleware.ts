import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which paths require authentication
const protectedPaths = [
  "/dashboard",
  "/dashboard/leads",
  "/dashboard/settings",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const path = request.nextUrl.pathname;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

  // If the path requires authentication and there's no token
  if (isProtectedPath && !token) {
    // Get the current URL
    const url = request.nextUrl.clone();
    // Set the pathname to the login page
    url.pathname = "/login";
    // Add the current path as a redirect parameter
    url.searchParams.set("redirect", path);
    // Redirect to the login page
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Define which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (in the public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
