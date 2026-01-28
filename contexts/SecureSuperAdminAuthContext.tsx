"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SUPER_ADMIN_CONFIG,
  superAdminSecurityAPI,
  type SessionValidationResponse,
} from "@/lib/super-admin-config";

/**
 * Secure Super Admin Authentication Context
 * 
 * Uses IP whitelist verification and Email OTP for enhanced security.
 */

interface SuperAdminUser {
  id: string;
  email: string;
  full_name?: string;
}

interface PendingOTP {
  admin_id: string;
  email: string;
  expires_at: number;
}

interface SecureSuperAdminAuthContextType {
  // Auth state
  user: SuperAdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // IP whitelist
  ipWhitelisted: boolean | null;
  clientIP: string | null;
  
  // OTP flow
  pendingOTP: PendingOTP | null;
  
  // Actions
  checkIPWhitelist: () => Promise<boolean>;
  initiateLogin: (email: string, password: string) => Promise<void>;
  verifyOTP: (otpCode: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  logout: () => void;
  cancelOTP: () => void;
}

const SecureSuperAdminAuthContext = createContext<SecureSuperAdminAuthContextType | undefined>(undefined);

export function SecureSuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [ipWhitelisted, setIpWhitelisted] = useState<boolean | null>(null);
  const [clientIP, setClientIP] = useState<string | null>(null);
  const [pendingOTP, setPendingOTP] = useState<PendingOTP | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Check IP whitelist status
  const checkIPWhitelist = useCallback(async (): Promise<boolean> => {
    try {
      const response = await superAdminSecurityAPI.checkIP();
      setClientIP(response.ip_address);
      setIpWhitelisted(response.is_whitelisted);
      return response.is_whitelisted;
    } catch (error) {
      console.error("IP whitelist check failed:", error);
      setIpWhitelisted(false);
      return false;
    }
  }, []);

  // Validate existing session
  const validateSession = useCallback(async () => {
    try {
      setLoading(true);
      
      // First check IP whitelist
      const isWhitelisted = await checkIPWhitelist();
      if (!isWhitelisted) {
        setUser(null);
        return;
      }
      
      // Check for existing session
      if (!superAdminSecurityAPI.isAuthenticated()) {
        // Check for pending OTP
        const pending = superAdminSecurityAPI.getPendingOTP();
        if (pending) {
          setPendingOTP(pending);
        }
        setUser(null);
        return;
      }
      
      // Validate session with backend
      const session = await superAdminSecurityAPI.validateSession();
      
      if (session.valid && session.admin_id) {
        setUser({
          id: session.admin_id,
          email: session.email || '',
        });
      } else {
        // Invalid session, clear tokens
        await superAdminSecurityAPI.logout();
        setUser(null);
      }
    } catch (error) {
      console.error("Session validation failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [checkIPWhitelist]);

  // Step 1: Initiate login with email/password
  const initiateLogin = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await superAdminSecurityAPI.initiateLogin(email, password);
      
      if (response.success) {
        setPendingOTP({
          admin_id: response.admin_id,
          email: response.email,
          expires_at: Date.now() + response.expires_in_minutes * 60 * 1000,
        });
      } else {
        throw new Error(response.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Step 2: Verify OTP
  const verifyOTP = useCallback(async (otpCode: string) => {
    if (!pendingOTP) {
      throw new Error("No pending OTP verification");
    }
    
    setLoading(true);
    
    try {
      const response = await superAdminSecurityAPI.verifyOTP(pendingOTP.admin_id, otpCode);
      
      if (response.success) {
        setPendingOTP(null);
        setUser({
          id: pendingOTP.admin_id,
          email: pendingOTP.email,
        });
        
        // Redirect to dashboard
        router.push(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/invites`);
      } else {
        throw new Error(response.message || `Invalid OTP. ${response.remaining_attempts} attempts remaining.`);
      }
    } finally {
      setLoading(false);
    }
  }, [pendingOTP, router]);

  // Resend OTP
  const resendOTP = useCallback(async () => {
    if (!pendingOTP) {
      throw new Error("No pending OTP to resend");
    }
    
    const response = await superAdminSecurityAPI.resendOTP(pendingOTP.admin_id);
    
    if (response.success) {
      // Update expiry
      setPendingOTP({
        ...pendingOTP,
        expires_at: Date.now() + 15 * 60 * 1000,
      });
    } else {
      throw new Error(response.message || "Failed to resend OTP");
    }
  }, [pendingOTP]);

  // Cancel OTP flow
  const cancelOTP = useCallback(() => {
    setPendingOTP(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.OTP_PENDING);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await superAdminSecurityAPI.logout();
    setUser(null);
    setPendingOTP(null);
    router.push(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/login`);
  }, [router]);

  // Initialize on mount
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    ipWhitelisted,
    clientIP,
    pendingOTP,
    checkIPWhitelist,
    initiateLogin,
    verifyOTP,
    resendOTP,
    logout,
    cancelOTP,
  };

  return (
    <SecureSuperAdminAuthContext.Provider value={value}>
      {children}
    </SecureSuperAdminAuthContext.Provider>
  );
}

/**
 * Hook to access secure super admin auth context
 */
export function useSecureSuperAdminAuth() {
  const context = useContext(SecureSuperAdminAuthContext);
  if (context === undefined) {
    throw new Error("useSecureSuperAdminAuth must be used within a SecureSuperAdminAuthProvider");
  }
  return context;
}

/**
 * HOC for protecting super admin routes with OTP verification
 */
export function withSecureSuperAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, loading, ipWhitelisted, pendingOTP } = useSecureSuperAdminAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (loading) return;
      
      // If IP is not whitelisted, show access denied
      if (ipWhitelisted === false) {
        router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/access-denied`);
        return;
      }
      
      // If there's a pending OTP, go to verify page
      if (pendingOTP && !pathname.includes('/verify')) {
        router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/verify`);
        return;
      }
      
      // If not authenticated and not on login/verify page, redirect to login
      if (!isAuthenticated && !pathname.includes('/login') && !pathname.includes('/verify')) {
        router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/login`);
        return;
      }
    }, [isAuthenticated, loading, ipWhitelisted, pendingOTP, router, pathname]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-500/50 border-t-red-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-white/80">Verifying secure access...</p>
          </div>
        </div>
      );
    }

    if (ipWhitelisted === false) {
      return null; // Will redirect
    }

    return <Component {...props} />;
  };
}
