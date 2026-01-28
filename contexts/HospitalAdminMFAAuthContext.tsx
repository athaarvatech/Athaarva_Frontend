"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, useParams } from "next/navigation";
import { API_CONFIG } from "@/lib/api-config";

// =============================================================================
// Types & Interfaces
// =============================================================================

interface HospitalAdminUser {
  id: string;
  email: string;
  full_name: string;
  user_type: "hospital_admin" | "staff";
  tenant_id: string;
  tenant_code: string;
  tenant_name: string;
  mfa_enabled: boolean;
  email_verified: boolean;
}

interface MFAStatus {
  mfa_enabled: boolean;
  mfa_method: string;
  totp_verified: boolean;
  backup_codes_remaining: number;
  backup_codes_used: number;
  setup_completed_at: string | null;
}

interface LoginStep {
  step: "credentials" | "mfa" | "email_verification" | "mfa_setup" | "complete";
  userId?: string;
  tenantId?: string;
  tenantCode?: string;
  mfaMethod?: string;
  otpSent?: boolean;
}

interface HospitalAdminAuthContextType {
  // User state
  user: HospitalAdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // MFA state
  loginStep: LoginStep;
  mfaStatus: MFAStatus | null;
  
  // Auth methods
  initiateLogin: (email: string, password: string, deviceFingerprint?: string) => Promise<LoginStep>;
  verifyMFA: (code: string, trustDevice?: boolean, deviceName?: string) => Promise<void>;
  sendOTP: (purpose?: string) => Promise<void>;
  verifyOTP: (code: string, purpose?: string) => Promise<{ success: boolean; remaining: number }>;
  
  // MFA setup methods
  setupTOTP: () => Promise<{ secret: string; qrUri: string; backupCodes: string[] }>;
  verifyTOTPSetup: (code: string) => Promise<void>;
  getMFAStatus: () => Promise<MFAStatus>;
  regenerateBackupCodes: () => Promise<string[]>;
  
  // Email verification
  sendEmailVerification: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  
  // Session methods
  logout: (allDevices?: boolean) => Promise<void>;
  validateSession: () => Promise<boolean>;
  
  // State helpers
  resetLoginFlow: () => void;
  setError: (error: string | null) => void;
  error: string | null;
}

const HospitalAdminMFAAuthContext = createContext<HospitalAdminAuthContextType | undefined>(undefined);

// =============================================================================
// API Helpers
// =============================================================================

const API_BASE = API_CONFIG.BASE_URL;

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const sessionToken = localStorage.getItem("ha_session_token");
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }
  
  return data;
}

// =============================================================================
// Provider Component
// =============================================================================

export function HospitalAdminMFAAuthProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const subdomain = params?.subdomain as string;
  
  // State
  const [user, setUser] = useState<HospitalAdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginStep, setLoginStep] = useState<LoginStep>({ step: "credentials" });
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  
  // ==========================================================================
  // Authentication Flow
  // ==========================================================================
  
  const initiateLogin = useCallback(async (
    email: string,
    password: string,
    deviceFingerprint?: string
  ): Promise<LoginStep> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall<{
        success: boolean;
        message: string;
        user_id?: string;
        tenant_id?: string;
        tenant_code?: string;
        requires_mfa?: boolean;
        mfa_method?: string;
        requires_email_verification?: boolean;
        otp_sent?: boolean;
        access_token?: string;
        session_token?: string;
      }>("/api/v1/hospital-admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          tenant_code: subdomain,
          device_fingerprint: deviceFingerprint,
        }),
      });
      
      if (response.requires_email_verification) {
        const step: LoginStep = {
          step: "email_verification",
          userId: response.user_id,
          tenantId: response.tenant_id,
          tenantCode: response.tenant_code,
        };
        setLoginStep(step);
        return step;
      }
      
      if (response.requires_mfa) {
        const step: LoginStep = {
          step: "mfa",
          userId: response.user_id,
          tenantId: response.tenant_id,
          tenantCode: response.tenant_code,
          mfaMethod: response.mfa_method,
          otpSent: response.otp_sent,
        };
        setLoginStep(step);
        return step;
      }
      
      // Login complete - save tokens
      if (response.access_token) {
        localStorage.setItem("ha_access_token", response.access_token);
      }
      if (response.session_token) {
        localStorage.setItem("ha_session_token", response.session_token);
      }
      
      // Fetch user details
      await validateSession();
      
      const step: LoginStep = { step: "complete" };
      setLoginStep(step);
      return step;
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [subdomain]);
  
  const verifyMFA = useCallback(async (
    code: string,
    trustDevice = false,
    deviceName?: string
  ) => {
    if (!loginStep.userId) throw new Error("No active login session");
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall<{
        success: boolean;
        message: string;
        method_used?: string;
        access_token?: string;
        session_token?: string;
        remaining_attempts?: number;
      }>("/api/v1/hospital-admin/auth/verify-mfa", {
        method: "POST",
        body: JSON.stringify({
          user_id: loginStep.userId,
          code,
          trust_device: trustDevice,
          device_fingerprint: getDeviceFingerprint(),
          device_name: deviceName,
        }),
      });
      
      if (!response.success) {
        throw new Error(response.message || "MFA verification failed");
      }
      
      // Save tokens
      if (response.access_token) {
        localStorage.setItem("ha_access_token", response.access_token);
      }
      if (response.session_token) {
        localStorage.setItem("ha_session_token", response.session_token);
      }
      
      // Fetch user details
      await validateSession();
      
      setLoginStep({ step: "complete" });
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loginStep.userId]);
  
  const sendOTP = useCallback(async (purpose = "login") => {
    if (!loginStep.userId) throw new Error("No active login session");
    
    setLoading(true);
    try {
      await apiCall("/api/v1/hospital-admin/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({
          user_id: loginStep.userId,
          purpose,
        }),
      });
    } finally {
      setLoading(false);
    }
  }, [loginStep.userId]);
  
  const verifyOTP = useCallback(async (
    code: string,
    purpose = "login"
  ): Promise<{ success: boolean; remaining: number }> => {
    if (!loginStep.userId) throw new Error("No active login session");
    
    const response = await apiCall<{
      success: boolean;
      message: string;
      remaining_attempts: number;
    }>("/api/v1/hospital-admin/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        user_id: loginStep.userId,
        otp_code: code,
        purpose,
      }),
    });
    
    return { success: response.success, remaining: response.remaining_attempts };
  }, [loginStep.userId]);
  
  // ==========================================================================
  // MFA Setup
  // ==========================================================================
  
  const setupTOTP = useCallback(async (): Promise<{
    secret: string;
    qrUri: string;
    backupCodes: string[];
  }> => {
    const userId = loginStep.userId || user?.id;
    if (!userId) throw new Error("No user ID available");
    
    const response = await apiCall<{
      success: boolean;
      secret: string;
      qr_code_uri: string;
      backup_codes: string[];
    }>("/api/v1/hospital-admin/auth/mfa/setup", {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
    
    return {
      secret: response.secret,
      qrUri: response.qr_code_uri,
      backupCodes: response.backup_codes,
    };
  }, [loginStep.userId, user?.id]);
  
  const verifyTOTPSetup = useCallback(async (code: string) => {
    const userId = loginStep.userId || user?.id;
    if (!userId) throw new Error("No user ID available");
    
    setLoading(true);
    try {
      const response = await apiCall<{ success: boolean; message: string }>(
        "/api/v1/hospital-admin/auth/mfa/verify-setup",
        {
          method: "POST",
          body: JSON.stringify({ user_id: userId, code }),
        }
      );
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Refresh MFA status
      await getMFAStatus();
      
    } finally {
      setLoading(false);
    }
  }, [loginStep.userId, user?.id]);
  
  const getMFAStatus = useCallback(async (): Promise<MFAStatus> => {
    const userId = loginStep.userId || user?.id;
    if (!userId) throw new Error("No user ID available");
    
    const response = await apiCall<MFAStatus>(
      `/api/v1/hospital-admin/auth/mfa/status/${userId}`
    );
    
    setMfaStatus(response);
    return response;
  }, [loginStep.userId, user?.id]);
  
  const regenerateBackupCodes = useCallback(async (): Promise<string[]> => {
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");
    
    const response = await apiCall<{
      success: boolean;
      backup_codes: string[];
    }>("/api/v1/hospital-admin/auth/mfa/regenerate-backup-codes", {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
    
    return response.backup_codes;
  }, [user?.id]);
  
  // ==========================================================================
  // Email Verification
  // ==========================================================================
  
  const sendEmailVerification = useCallback(async () => {
    const userId = loginStep.userId || user?.id;
    if (!userId) throw new Error("No user ID available");
    
    await apiCall("/api/v1/hospital-admin/auth/email/send-verification", {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  }, [loginStep.userId, user?.id]);
  
  const verifyEmail = useCallback(async (token: string) => {
    const response = await apiCall<{
      success: boolean;
      message: string;
      user_id?: string;
    }>("/api/v1/hospital-admin/auth/email/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Update login step
    setLoginStep(prev => ({
      ...prev,
      step: "credentials",
    }));
  }, []);
  
  // ==========================================================================
  // Session Management
  // ==========================================================================
  
  const validateSession = useCallback(async (): Promise<boolean> => {
    const sessionToken = localStorage.getItem("ha_session_token");
    if (!sessionToken) return false;
    
    try {
      const response = await apiCall<{
        valid: boolean;
        user_id?: string;
        tenant_id?: string;
        email?: string;
        full_name?: string;
        user_type?: string;
        mfa_verified?: boolean;
      }>("/api/v1/hospital-admin/auth/session/validate");
      
      if (response.valid && response.user_id) {
        setUser({
          id: response.user_id,
          email: response.email || "",
          full_name: response.full_name || "",
          user_type: response.user_type as "hospital_admin" | "staff",
          tenant_id: response.tenant_id || "",
          tenant_code: subdomain || "",
          tenant_name: "",
          mfa_enabled: response.mfa_verified || false,
          email_verified: true,
        });
        return true;
      }
      
      return false;
    } catch {
      localStorage.removeItem("ha_access_token");
      localStorage.removeItem("ha_session_token");
      setUser(null);
      return false;
    }
  }, [subdomain]);
  
  const logout = useCallback(async (allDevices = false) => {
    try {
      await apiCall(`/api/v1/hospital-admin/auth/logout?all_devices=${allDevices}`, {
        method: "POST",
      });
    } catch {
      // Ignore errors on logout
    }
    
    localStorage.removeItem("ha_access_token");
    localStorage.removeItem("ha_session_token");
    setUser(null);
    setLoginStep({ step: "credentials" });
    
    router.push(`/hospital/${subdomain}/auth/login`);
  }, [router, subdomain]);
  
  // ==========================================================================
  // Helpers
  // ==========================================================================
  
  const resetLoginFlow = useCallback(() => {
    setLoginStep({ step: "credentials" });
    setError(null);
  }, []);
  
  // ==========================================================================
  // Context Value
  // ==========================================================================
  
  const value: HospitalAdminAuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    loginStep,
    mfaStatus,
    initiateLogin,
    verifyMFA,
    sendOTP,
    verifyOTP,
    setupTOTP,
    verifyTOTPSetup,
    getMFAStatus,
    regenerateBackupCodes,
    sendEmailVerification,
    verifyEmail,
    logout,
    validateSession,
    resetLoginFlow,
    setError,
    error,
  };
  
  return (
    <HospitalAdminMFAAuthContext.Provider value={value}>
      {children}
    </HospitalAdminMFAAuthContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useHospitalAdminMFAAuth() {
  const context = useContext(HospitalAdminMFAAuthContext);
  if (context === undefined) {
    throw new Error("useHospitalAdminMFAAuth must be used within HospitalAdminMFAAuthProvider");
  }
  return context;
}

// =============================================================================
// Utility Functions
// =============================================================================

function getDeviceFingerprint(): string {
  // Simple device fingerprint (in production, use a proper fingerprinting library)
  const nav = typeof window !== "undefined" ? window.navigator : null;
  if (!nav) return "";
  
  const components = [
    nav.userAgent,
    nav.language,
    new Date().getTimezoneOffset().toString(),
    window.screen?.width || 0,
    window.screen?.height || 0,
    window.screen?.colorDepth || 0,
  ].join("|");
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

export { getDeviceFingerprint };
