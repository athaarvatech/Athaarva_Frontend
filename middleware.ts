import { NextRequest, NextResponse } from 'next/server';

// Extract subdomain from host header
function getSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host');
  if (!host) return null;

  // Remove port if present (for local development)
  const hostname = host.split(':')[0];
  
  // Check if it's a subdomain pattern
  const parts = hostname.split('.');
  
  // For development: t.localhost, demo.localhost, etc.
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const secondLastPart = parts[parts.length - 2];
    
    // Handle localhost subdomains: t.localhost, demo.localhost
    if (lastPart === 'localhost' && parts.length === 2) {
      return parts[0];
    }
    
    // Handle athaarva.com subdomains: hospital.athaarva.com  
    if (parts.length === 3 && secondLastPart === 'athaarva' && lastPart === 'com') {
      return parts[0];
    }
  }
  
  return null;
}

// Validate subdomain against database
async function validateSubdomain(subdomain: string): Promise<boolean> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://athaarva-backend.onrender.com";
    const response = await fetch(`${apiUrl}/hospitals/${subdomain}/validate`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Subdomain validation error:', error);
    // For development, allow test subdomains when API is not available
    return ['cityhospital', 'greenvalley', 't', 'demo', 'test'].includes(subdomain);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = getSubdomain(request);
  
  // Skip middleware for:
  // - API routes
  // - Static files (_next, favicon, etc.)
  // - Image optimization
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Case 1: Main domain (athaarva.com) - global auth
  if (!subdomain) {
    // If accessing /auth on main domain, show hospital selector
    if (pathname === '/auth') {
      return NextResponse.rewrite(new URL('/auth/selector', request.url));
    }
    
    // Allow all other routes on main domain
    return NextResponse.next();
  }

  // Case 2: Subdomain detected (hospital.athaarva.com)
  const isValidSubdomain = await validateSubdomain(subdomain);
  
  if (!isValidSubdomain) {
    // Invalid subdomain - redirect to main domain with error message
    const mainDomainUrl = new URL('/auth?reason=invalid_subdomain&attempted_hospital=' + subdomain, 'https://athaarva.com');
    return NextResponse.redirect(mainDomainUrl);
  }

  // Valid subdomain - handle hospital-specific routing
  if (pathname === '/auth' || pathname === '/auth/') {
    // Rewrite to hospital-branded auth page with subdomain context
    const url = new URL(`/auth/hospital/${subdomain}`, request.url);
    return NextResponse.rewrite(url);
  }

  // For other routes on valid subdomains, inject subdomain context
  const response = NextResponse.next();
  
  // Add hospital context to headers for components to access
  response.headers.set('x-hospital-code', subdomain);
  
  // Set hospital_code cookie (host-only for security)
  response.cookies.set('hospital_code', subdomain, {
    httpOnly: false, // Allow frontend access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Don't set domain to make it host-only (subdomain isolation)
  });
  
  return response;
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
