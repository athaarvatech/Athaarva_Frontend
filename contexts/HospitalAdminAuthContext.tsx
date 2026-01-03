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
}

interface HospitalAdminAuthContextType {
  user: HospitalAdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  tenantId: string | null;
  subdomain: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const HospitalAdminAuthContext = createContext<HospitalAdminAuthContextType | undefined>(undefined);

export function HospitalAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<HospitalAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }

      // Get current user from API
      const currentUser = await apiService.getCurrentUser();
      
      // Verify user is a hospital admin
      if (currentUser.user_type !== "hospital_admin" && currentUser.user_type !== "hospital") {
        console.error("User is not a hospital admin:", currentUser.user_type);
        localStorage.removeItem('access_token');
        setUser(null);
        return;
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.full_name,
        user_type: "hospital_admin",
        tenant_id: currentUser.tenant_id,
        subdomain: currentUser.subdomain,
      });
    } catch (error) {
      console.error("Hospital admin auth check failed:", error);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Call login API
      const response = await apiService.login(email, password);
      
      // Token is set by apiService.login automatically
      // But we need to verify the user type
      const currentUser = await apiService.getCurrentUser();
      if (currentUser.user_type !== "hospital_admin" && currentUser.user_type !== "hospital") {
        localStorage.removeItem('access_token');
        apiService.clearAuth();
        throw new Error("Access denied: Not a hospital admin account");
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.full_name,
        user_type: "hospital_admin",
        tenant_id: currentUser.tenant_id,
        subdomain: currentUser.subdomain,
      });
      
    } catch (error) {
      localStorage.removeItem('access_token');
      apiService.clearAuth();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('tenant_id');
    apiService.clearAuth();
    setUser(null);
    router.push("/auth");
  }, [router]);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    tenantId: user?.tenant_id || null,
    subdomain: user?.subdomain || null,
    login,
    logout,
    checkAuth,
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
