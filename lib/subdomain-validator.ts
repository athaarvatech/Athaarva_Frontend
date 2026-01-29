/**
 * Subdomain Validator - Phase 6: Admin Setup & Domain Configuration
 * 
 * Utilities for validating hospital subdomains against the database
 * and managing reserved subdomains.
 */

import { API_CONFIG } from "./api-config";

// ============================================================================
// RESERVED SUBDOMAINS
// ============================================================================

/**
 * Reserved subdomains that cannot be used by hospitals
 * These are blocked from registration during onboarding
 */
export const RESERVED_SUBDOMAINS = [
  // System routes
  "www",
  "api",
  "admin",
  "app",
  "dashboard",
  "portal",
  "auth",
  "login",
  "signup",
  "register",
  
  // Email/networking
  "mail",
  "smtp",
  "imap",
  "pop",
  "ftp",
  "sftp",
  "dns",
  "ns1",
  "ns2",
  
  // Development/testing
  "test",
  "testing",
  "demo",
  "staging",
  "dev",
  "development",
  "localhost",
  "local",
  "sandbox",
  "preview",
  
  // Security
  "super-admin",
  "superadmin",
  "platform",
  "platform-ctrl-9x7k2m",
  "security",
  "secure",
  "ssl",
  
  // Common service names
  "cdn",
  "static",
  "assets",
  "media",
  "images",
  "files",
  "docs",
  "help",
  "support",
  "blog",
  "news",
  "status",
  
  // Marketing/legal
  "about",
  "contact",
  "privacy",
  "terms",
  "careers",
  "jobs",
  
  // Generic terms
  "hospital",
  "clinic",
  "medical",
  "health",
  "healthcare",
  "athaarva",
] as const;

export type ReservedSubdomain = typeof RESERVED_SUBDOMAINS[number];

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if a subdomain is reserved (system use only)
 */
export function isReservedSubdomain(subdomain: string): boolean {
  const normalized = subdomain.toLowerCase().trim();
  return RESERVED_SUBDOMAINS.includes(normalized as ReservedSubdomain);
}

/**
 * Validate subdomain format (alphanumeric with hyphens)
 * Rules:
 * - 3-63 characters
 * - Only lowercase letters, numbers, and hyphens
 * - Cannot start or end with hyphen
 * - Cannot have consecutive hyphens
 */
export function isValidSubdomainFormat(subdomain: string): {
  valid: boolean;
  error?: string;
} {
  const normalized = subdomain.toLowerCase().trim();
  
  // Length check
  if (normalized.length < 3) {
    return { valid: false, error: "Subdomain must be at least 3 characters long" };
  }
  if (normalized.length > 63) {
    return { valid: false, error: "Subdomain must be 63 characters or less" };
  }
  
  // Character check (a-z, 0-9, -)
  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return { valid: false, error: "Subdomain can only contain lowercase letters, numbers, and hyphens" };
  }
  
  // Cannot start or end with hyphen
  if (normalized.startsWith("-") || normalized.endsWith("-")) {
    return { valid: false, error: "Subdomain cannot start or end with a hyphen" };
  }
  
  // Cannot have consecutive hyphens
  if (normalized.includes("--")) {
    return { valid: false, error: "Subdomain cannot contain consecutive hyphens" };
  }
  
  return { valid: true };
}

/**
 * Comprehensive subdomain validation
 * Checks format and reserved status
 */
export function validateSubdomainLocal(subdomain: string): {
  valid: boolean;
  error?: string;
  suggestions?: string[];
} {
  const normalized = subdomain.toLowerCase().trim();
  
  // Check format first
  const formatResult = isValidSubdomainFormat(normalized);
  if (!formatResult.valid) {
    return formatResult;
  }
  
  // Check if reserved
  if (isReservedSubdomain(normalized)) {
    return {
      valid: false,
      error: "This subdomain is reserved and cannot be used",
      suggestions: generateSubdomainSuggestions(normalized),
    };
  }
  
  return { valid: true };
}

/**
 * Generate alternative subdomain suggestions when a subdomain is taken or reserved
 */
export function generateSubdomainSuggestions(base: string): string[] {
  const suggestions: string[] = [];
  const normalized = base.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Add common suffixes
  const suffixes = ["care", "health", "med", "clinic", "plus", "hub"];
  for (const suffix of suffixes) {
    const suggestion = `${normalized}-${suffix}`;
    if (suggestion.length <= 63 && !isReservedSubdomain(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  
  // Add city/location prefix pattern
  const prefixes = ["city", "metro", "prime"];
  for (const prefix of prefixes) {
    const suggestion = `${prefix}-${normalized}`;
    if (suggestion.length <= 63 && !isReservedSubdomain(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  
  // Add year suffix
  const year = new Date().getFullYear();
  const yearSuggestion = `${normalized}-${year}`;
  if (!isReservedSubdomain(yearSuggestion)) {
    suggestions.push(yearSuggestion);
  }
  
  return suggestions.slice(0, 5); // Return max 5 suggestions
}

// ============================================================================
// API VALIDATION FUNCTIONS
// ============================================================================

export interface SubdomainValidationResult {
  valid: boolean;
  available: boolean;
  tenant?: {
    id: string;
    name: string;
    status: "active" | "inactive" | "suspended" | "pending";
  };
  error?: string;
  suggestions?: string[];
}

/**
 * Validate subdomain against the backend database
 * Checks both format and availability
 */
export async function validateSubdomainWithAPI(
  subdomain: string
): Promise<SubdomainValidationResult> {
  // First, do local validation
  const localResult = validateSubdomainLocal(subdomain);
  if (!localResult.valid) {
    return {
      valid: false,
      available: false,
      error: localResult.error,
      suggestions: localResult.suggestions,
    };
  }
  
  // Then check with API
  try {
    const apiUrl = API_CONFIG.BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${apiUrl}/api/v1/tenants/validate-subdomain/${subdomain}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        // Subdomain not found = available for registration
        return { valid: true, available: true };
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Subdomain exists
    return {
      valid: true,
      available: false,
      tenant: data.tenant,
      error: "This subdomain is already registered",
      suggestions: generateSubdomainSuggestions(subdomain),
    };
  } catch (error) {
    console.error("Subdomain validation API error:", error);
    
    // Fallback to local validation only on API error
    return {
      valid: localResult.valid,
      available: true, // Assume available if API fails (fail-open for dev)
      error: "Unable to verify subdomain availability. Please try again.",
    };
  }
}

/**
 * Check if a subdomain exists and is active (for authentication flow)
 */
export async function checkSubdomainExists(
  subdomain: string
): Promise<{
  exists: boolean;
  tenant?: {
    id: string;
    name: string;
    logoUrl?: string;
    status: string;
  };
}> {
  // Do local format check first
  const formatResult = isValidSubdomainFormat(subdomain);
  if (!formatResult.valid) {
    return { exists: false };
  }
  
  try {
    const apiUrl = API_CONFIG.BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${apiUrl}/hospitals/${subdomain}/validate`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
    
    if (!response.ok) {
      return { exists: false };
    }
    
    const data = await response.json();
    return {
      exists: true,
      tenant: {
        id: data.id,
        name: data.name || data.hospital_name,
        logoUrl: data.logo_url,
        status: data.status || "active",
      },
    };
  } catch (error) {
    console.error("Subdomain check error:", error);
    
    // For development, allow test subdomains
    const devSubdomains = ["cityhospital", "greenvalley", "t", "demo", "test"];
    if (devSubdomains.includes(subdomain.toLowerCase())) {
      return {
        exists: true,
        tenant: {
          id: `dev-${subdomain}`,
          name: `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} Hospital`,
          status: "active",
        },
      };
    }
    
    return { exists: false };
  }
}

// ============================================================================
// CUSTOM DOMAIN UTILITIES
// ============================================================================

export interface CustomDomainConfig {
  domain: string;
  verified: boolean;
  sslStatus: "pending" | "provisioning" | "active" | "failed";
  cnameTarget: string;
  lastVerifiedAt?: Date;
}

/**
 * Generate CNAME record instructions for custom domain setup
 */
export function generateCNAMEInstructions(subdomain: string): {
  recordType: "CNAME";
  host: string;
  target: string;
  instructions: string[];
} {
  return {
    recordType: "CNAME",
    host: "@", // or "portal", "patients", etc.
    target: `${subdomain}.athaarva.com`,
    instructions: [
      "Log in to your domain registrar's DNS management panel",
      "Create a new CNAME record",
      "Set the Host/Name to '@' (or your preferred subdomain like 'portal')",
      `Set the Target/Points to: ${subdomain}.athaarva.com`,
      "Save the changes and wait for DNS propagation (up to 48 hours)",
      "Return here to verify your domain once DNS has propagated",
    ],
  };
}

/**
 * Verify custom domain DNS configuration
 * In production, this would check actual DNS records
 */
export async function verifyCustomDomain(
  customDomain: string,
  expectedTarget: string
): Promise<{
  verified: boolean;
  error?: string;
}> {
  try {
    const apiUrl = API_CONFIG.BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${apiUrl}/api/v1/tenants/verify-custom-domain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: customDomain,
          expected_target: expectedTarget,
        }),
      }
    );
    
    if (!response.ok) {
      const data = await response.json();
      return {
        verified: false,
        error: data.detail || "DNS verification failed",
      };
    }
    
    return { verified: true };
  } catch (error) {
    console.error("Custom domain verification error:", error);
    return {
      verified: false,
      error: "Unable to verify domain. Please try again later.",
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert hospital name to a valid subdomain suggestion
 */
export function hospitalNameToSubdomain(hospitalName: string): string {
  return hospitalName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .slice(0, 63); // Limit to max length
}

/**
 * Extract subdomain from a full URL or hostname
 */
export function extractSubdomainFromHost(host: string): string | null {
  // Remove protocol if present
  const hostname = host.replace(/^https?:\/\//, "").split(":")[0];
  
  const parts = hostname.split(".");
  
  // Handle localhost subdomains: t.localhost
  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0];
  }
  
  // Handle athaarva.com subdomains: hospital.athaarva.com
  if (parts.length === 3 && parts[1] === "athaarva" && parts[2] === "com") {
    return parts[0];
  }
  
  return null;
}
