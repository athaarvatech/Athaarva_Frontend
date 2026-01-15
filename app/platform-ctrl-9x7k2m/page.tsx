"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SUPER_ADMIN_CONFIG } from "@/lib/super-admin-config";
import { useSecureSuperAdminAuth } from "@/contexts/SecureSuperAdminAuthContext";

/**
 * Secure Super Admin Index Page
 * 
 * Redirects to appropriate page based on auth state
 */
export default function SecureSuperAdminIndexPage() {
  const router = useRouter();
  const { isAuthenticated, loading, pendingOTP } = useSecureSuperAdminAuth();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/invites`);
    } else if (pendingOTP) {
      router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/verify`);
    } else {
      router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/login`);
    }
  }, [isAuthenticated, loading, pendingOTP, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-red-500/50 border-t-red-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white/80">Initializing secure access...</p>
      </div>
    </div>
  );
}
