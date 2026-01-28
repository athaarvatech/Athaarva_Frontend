"use client";

import { SecureSuperAdminAuthProvider } from "@/contexts/SecureSuperAdminAuthContext";

/**
 * Secure Super Admin Layout
 * 
 * This layout wraps all pages under the obfuscated super-admin path
 * with the secure authentication provider that requires:
 * 1. IP whitelist verification
 * 2. Email + Password authentication
 * 3. Email OTP verification
 */
export default function SecureSuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SecureSuperAdminAuthProvider>
      {children}
    </SecureSuperAdminAuthProvider>
  );
}
