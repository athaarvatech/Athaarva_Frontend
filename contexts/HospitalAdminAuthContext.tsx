"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiService from "@/lib/api-service";
import { API_CONFIG } from "@/lib/api-config";

/**
 * Hospital Admin User interface
 */
interface HospitalAdminUser {
  id: string;
  email: string;
  full_name: string;
  user_type: "hospital_admin";
  tenant_id: string;
  subdomain?: string;
  mfa_verified?: boolean;
  mfa_enabled?: boolean;
}

interface TenantInfo {
  tenant_id: string;
  subdomain: string;
  name: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  requires_mfa: boolean;
  mfa_method?: string;
  user_id?: string;
  email?: string;
  tenants?: TenantInfo[];
}

interface MFAVerifyResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  session_token?: string;
}

type AuthState = "idle" | "password_verified" | "mfa_required" | "authenticated";

interface HospitalAdminAuthContextType {
  user: HospitalAdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  authState: AuthState;
  tenantId: string | null;
  subdomain: string | null;
  availableTenants: TenantInfo[];
  mfaMethod: string | null;
  pendingUserId: string | null;
  login: (email: string, password: string, subdomain?: string, deviceFingerprint?: string) => Promise<LoginResponse>;
  selectTenant: (tenantId: string, deviceFingerprint?: string) => Promise<LoginResponse>;
  verifyMFA: (code: string, method?: string, trustDevice?: boolean, deviceFingerprint?: string) => Promise<void>;
  sendEmailOTP: () => Promise<void>;
  logout: (logoutAll?: boolean) => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const HospitalAdminAuthContext = createContext<HospitalAdminAuthContextType | undefined>(undefined);

export function HospitalAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<HospitalAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [availableTenants, setAvailableTenants] = useState<TenantInfo[]>([]);
  const [mfaMethod, setMfaMethod] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('access_token');
      const sessionToken = localStorage.getItem('session_token');
      
      if (!token || !sessionToken) {
        setUser(null);
        setAuthState("idle");
        return;
      }

      // Validate session with backend
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/session`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Session invalid");
      }

      const session = await response.json();
      
      if (!session.valid) {
        throw new Error("Session expired");
      }

      setUser({
        id: session.user_id,
        email: session.email,
        full_name: session.full_name || session.email,
        user_type: "hospital_admin",
        tenant_id: session.tenant_id,
        subdomain: session.subdomain,
        mfa_verified: session.mfa_verified,
        mfa_enabled: true,
      });
      setAuthState("authenticated");
    } catch (error) {
      console.error("Hospital admin auth check failed:", error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('session_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setAuthState("idle");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with email and password
  const login = useCallback(async (
    email: string, 
    password: string, 
    subdomain?: string,
    deviceFingerprint?: string
  ): Promise<LoginResponse> => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            tenant_subdomain: subdomain,
            device_fingerprint: deviceFingerprint,
          }),
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      setPendingUserId(data.user_id || null);
      setAvailableTenants(data.tenants || []);
      setMfaMethod(data.mfa_method || null);

      if (data.requires_mfa) {
        setAuthState("mfa_required");
      } else if (data.tenants && data.tenants.length > 1) {
        setAuthState("password_verified");
      } else if (data.tenants && data.tenants.length === 1) {
        setSelectedTenantId(data.tenants[0].tenant_id);
        setAuthState("password_verified");
      }

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  // Select tenant (for multi-tenant users)
  const selectTenant = useCallback(async (
    tenantId: string,
    deviceFingerprint?: string
  ): Promise<LoginResponse> => {
    if (!pendingUserId) {
      throw new Error("No pending authentication");
    }

    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/select-tenant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: pendingUserId,
            tenant_id: tenantId,
            device_fingerprint: deviceFingerprint,
          }),
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to select hospital");
      }

      setSelectedTenantId(tenantId);
      setMfaMethod(data.mfa_method || null);

      if (data.requires_mfa) {
        setAuthState("mfa_required");
      } else {
        // Direct login (trusted device or no MFA)
        const tenantData = data.tenants?.[0] as TenantInfo & {
          access_token?: string;
          session_token?: string;
          refresh_token?: string;
        };

        if (tenantData?.access_token) {
          localStorage.setItem("access_token", tenantData.access_token);
          localStorage.setItem("session_token", tenantData.session_token || "");
          localStorage.setItem("refresh_token", tenantData.refresh_token || "");
          localStorage.setItem("tenant_id", tenantId);
          localStorage.setItem("subdomain", tenantData.subdomain);

          setUser({
            id: pendingUserId,
            email: data.email || "",
            full_name: data.email || "",
            user_type: "hospital_admin",
            tenant_id: tenantId,
            subdomain: tenantData.subdomain,
            mfa_verified: true,
          });
          setAuthState("authenticated");
        }
      }

      return data;
    } finally {
      setLoading(false);
    }
  }, [pendingUserId]);

  // Verify MFA code
  const verifyMFA = useCallback(async (
    code: string,
    method: string = "totp",
    trustDevice: boolean = false,
    deviceFingerprint?: string
  ): Promise<void> => {
    if (!pendingUserId || !selectedTenantId) {
      throw new Error("No pending authentication");
    }

    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/verify-mfa`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: pendingUserId,
            tenant_id: selectedTenantId,
            code,
            method,
            device_fingerprint: deviceFingerprint,
            trust_device: trustDevice,
          }),
        }
      );

      const data: MFAVerifyResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Verification failed");
      }

      // Store tokens
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("session_token", data.session_token || "");
        localStorage.setItem("refresh_token", data.refresh_token || "");
        localStorage.setItem("tenant_id", selectedTenantId);
      }

      const selectedTenant = availableTenants.find(t => t.tenant_id === selectedTenantId);
      if (selectedTenant) {
        localStorage.setItem("subdomain", selectedTenant.subdomain);
      }

      // Update user state
      setUser({
        id: pendingUserId,
        email: "",
        full_name: "",
        user_type: "hospital_admin",
        tenant_id: selectedTenantId,
        subdomain: selectedTenant?.subdomain,
        mfa_verified: true,
      });
      setAuthState("authenticated");

      // Reset pending state
      setPendingUserId(null);
      setSelectedTenantId(null);
      setMfaMethod(null);
    } finally {
      setLoading(false);
    }
  }, [pendingUserId, selectedTenantId, availableTenants]);

  // Send email OTP
  const sendEmailOTP = useCallback(async (): Promise<void> => {
    if (!pendingUserId) {
      throw new Error("No pending authentication");
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: pendingUserId,
          tenant_id: selectedTenantId,
          purpose: "login",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to send OTP");
    }

    setMfaMethod("email_otp");
  }, [pendingUserId, selectedTenantId]);

  // Logout
  const logout = useCallback(async (logoutAll: boolean = false) => {
    const sessionToken = localStorage.getItem("session_token");
    
    if (sessionToken) {
      try {
        await fetch(
          `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/logout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({
              logout_all: logoutAll,
            }),
          }
        );
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('subdomain');
    apiService.clearAuth();
    
    // Reset state
    setUser(null);
    setAuthState("idle");
    setPendingUserId(null);
    setSelectedTenantId(null);
    setAvailableTenants([]);
    setMfaMethod(null);
    
    router.push("/auth");
  }, [router]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/session/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Session refresh failed");
    }

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("session_token", data.session_token);
    localStorage.setItem("refresh_token", data.refresh_token);
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    isAuthenticated: authState === "authenticated",
    authState,
    tenantId: user?.tenant_id || selectedTenantId,
    subdomain: user?.subdomain || null,
    availableTenants,
    mfaMethod,
    pendingUserId,
    login,
    selectTenant,
    verifyMFA,
    sendEmailOTP,
    logout,
    checkAuth,
    refreshSession,
  };

  return (
    <HospitalAdminAuthContext.Provider value={value}>
      {children}
    </HospitalAdminAuthContext.Provider>
  );
}

/**
 * Hook to access hospital admin auth context
 */
export function useHospitalAdminAuth() {
  const context = useContext(HospitalAdminAuthContext);
  if (context === undefined) {
    throw new Error("useHospitalAdminAuth must be used within a HospitalAdminAuthProvider");
  }
  return context;
}
