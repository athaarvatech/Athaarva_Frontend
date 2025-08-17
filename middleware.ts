/**
 * Middleware to handle subdomain-based routing
 * This is for production use when actual subdomain routing is implemented
 */

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Skip middleware for localhost and specific paths
  if (
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Extract subdomain from hostname
  const subdomain = hostname.split(".")[0];

  // If it's a subdomain (not www or main domain)
  if (subdomain && subdomain !== "www" && subdomain !== "athaarva") {
    // Rewrite to the hospital subdomain route
    url.pathname = `/hospital/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
