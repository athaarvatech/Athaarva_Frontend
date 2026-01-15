import { NextRequest, NextResponse } from 'next/server';

// Super Admin Security Configuration
const SUPER_ADMIN_CONFIG = {
  OBFUSCATED_PATH: '/platform-ctrl-9x7k2m',
  LEGACY_PATH: '/super-admin',
};

// Reserved subdomains that cannot be used by hospitals
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'app', 'dashboard', 'portal', 'auth', 'login',
  'mail', 'smtp', 'imap', 'pop', 'ftp', 'sftp', 'dns', 'ns1', 'ns2',
  'test', 'testing', 'demo', 'staging', 'dev', 'development', 'localhost', 'local',
  'super-admin', 'superadmin', 'platform', 'platform-ctrl-9x7k2m', 'security',
  'cdn', 'static', 'assets', 'media', 'images', 'files', 'docs', 'help', 'support',
  'about', 'contact', 'privacy', 'terms', 'careers',
  'hospital', 'clinic', 'medical', 'health', 'healthcare', 'athaarva',
];

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

// Validate subdomain format locally (no API call)
function isValidSubdomainFormat(subdomain: string): boolean {
  // Length check (3-63 characters)
  if (subdomain.length < 3 || subdomain.length > 63) return false;
  // Character check (a-z, 0-9, -)
  if (!/^[a-z0-9-]+$/.test(subdomain)) return false;
  // Cannot start or end with hyphen
  if (subdomain.startsWith('-') || subdomain.endsWith('-')) return false;
  // Cannot have consecutive hyphens
  if (subdomain.includes('--')) return false;
  return true;
}

// Check if subdomain is reserved
function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
}

// Validate subdomain against database
async function validateSubdomain(subdomain: string): Promise<{
  valid: boolean;
  reason?: 'not_found' | 'suspended' | 'inactive' | 'invalid_format' | 'reserved';
}> {
  // First check format
  if (!isValidSubdomainFormat(subdomain)) {
    return { valid: false, reason: 'invalid_format' };
  }
  
  // Check if reserved
  if (isReservedSubdomain(subdomain)) {
    return { valid: false, reason: 'reserved' };
  }
  
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://athaarva-backend.onrender.com";
    const response = await fetch(`${apiUrl}/hospitals/${subdomain}/validate`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      return { valid: false, reason: 'not_found' };
    }
    
    const data = await response.json();
    
    // Check tenant status
    if (data.status === 'suspended') {
      return { valid: false, reason: 'suspended' };
    }
    if (data.status === 'inactive') {
      return { valid: false, reason: 'inactive' };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Subdomain validation error:', error);
    // For development, allow test subdomains when API is not available
    // Also allow any subdomain in development when backend is unreachable
    const devSubdomains = ['cityhospital', 'greenvalley', 't', 'demo', 'test', 'mannan'];
    // NODE_ENV might not be available in Edge Runtime, so also check if we're hitting localhost
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';
    
    if (devSubdomains.includes(subdomain)) {
      console.warn(`[Middleware] Allowing dev subdomain '${subdomain}'`);
      return { valid: true };
    }
    
    // In development, allow any well-formed subdomain when backend is down
    // This enables testing redirects without requiring the backend
    if (isDev && isValidSubdomainFormat(subdomain)) {
      console.warn(`[Middleware] Allowing subdomain '${subdomain}' in dev mode (backend unreachable)`);
      return { valid: true };
    }
    
    return { valid: false, reason: 'not_found' };
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

  // ==========================================================================
  // Hospital Subdomain Routing (hospital1.localhost:3000 or hospital1.athaarva.com)
  // This takes priority - subdomains get their own hospital-branded experience
  // ==========================================================================
  if (subdomain) {
    const validationResult = await validateSubdomain(subdomain);
    
    if (!validationResult.valid) {
      // Invalid subdomain - redirect to hospital-not-found page on main domain
      const notFoundUrl = new URL('/hospital-not-found', request.url);
      // Remove subdomain by redirecting to main domain
      notFoundUrl.host = notFoundUrl.host.replace(`${subdomain}.`, '');
      notFoundUrl.searchParams.set('subdomain', subdomain);
      notFoundUrl.searchParams.set('reason', validationResult.reason || 'not_found');
      return NextResponse.redirect(notFoundUrl);
    }

    // Valid subdomain - the (hospital) route group handles all paths
    // Just inject the subdomain context and let Next.js route to (hospital)/*
    const response = NextResponse.next();
    
    // Add hospital context to headers for components to access
    response.headers.set('x-hospital-code', subdomain);
    
    // Set hospital_code cookie (host-only for security)
    response.cookies.set('hospital_code', subdomain, {
      httpOnly: false, // Allow frontend access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    return response;
  }

  // ==========================================================================
  // Main Domain Routes (athaarva.com without subdomain)
  // ==========================================================================
  
  // Super Admin Security: Redirect legacy path to obfuscated path
  if (pathname.startsWith(SUPER_ADMIN_CONFIG.LEGACY_PATH)) {
    const newPath = pathname.replace(
      SUPER_ADMIN_CONFIG.LEGACY_PATH,
      SUPER_ADMIN_CONFIG.OBFUSCATED_PATH
    );
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Super Admin Routes: Allow access (IP check happens in the page)
  if (pathname.startsWith(SUPER_ADMIN_CONFIG.OBFUSCATED_PATH)) {
    return NextResponse.next();
  }

  // Hospital Onboarding: Validate invitation token
  if (pathname.startsWith('/onboarding/hospital') && pathname !== '/onboarding/hospital/invalid-token') {
    const token = request.nextUrl.searchParams.get('token');
    
    // Development bypass - allow access without token validation
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 DEV MODE: Bypassing token validation in middleware');
      return NextResponse.next();
    }
    
    // If no token provided, redirect to invalid-token page
    if (!token) {
      const redirectUrl = new URL('/onboarding/hospital/invalid-token?reason=invalid', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Validate token with backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://athaarva-backend.onrender.com';
      const response = await fetch(`${apiUrl}/api/v1/onboarding/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const redirectUrl = new URL('/onboarding/hospital/invalid-token?reason=invalid', request.url);
        return NextResponse.redirect(redirectUrl);
      }

      const data = await response.json();
      
      if (!data.valid) {
        let reason = 'invalid';
        if (data.invitation?.status === 'expired') reason = 'expired';
        if (data.invitation?.status === 'revoked') reason = 'revoked';
        if (data.invitation?.status === 'accepted') reason = 'accepted';
        
        const redirectUrl = new URL(`/onboarding/hospital/invalid-token?reason=${reason}`, request.url);
        if (data.email) {
          redirectUrl.searchParams.set('email', data.email);
        }
        return NextResponse.redirect(redirectUrl);
      }

      const nextResponse = NextResponse.next();
      nextResponse.headers.set('x-invitation-token', token);
      if (data.email) {
        nextResponse.headers.set('x-invitation-email', data.email);
      }
      if (data.hospital_name) {
        nextResponse.headers.set('x-hospital-name', data.hospital_name);
      }
      return nextResponse;
      
    } catch (error) {
      console.error('Token validation error:', error);
      const redirectUrl = new URL('/onboarding/hospital/invalid-token?reason=network_error', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Main domain /auth redirects to hospital selector
  if (pathname === '/auth') {
    return NextResponse.rewrite(new URL('/auth/selector', request.url));
  }
  
  // Allow all other routes on main domain
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
