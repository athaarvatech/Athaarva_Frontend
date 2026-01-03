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
import { superAdminAPI, type CurrentUser } from "@/lib/api";

/**
 * Super Admin User interface
 */
interface SuperAdminUser {
  id: string;
  email: string;
  user_type: "super_admin";
  full_name?: string;
  tenant_id: string | null;
}

interface SuperAdminAuthContextType {
  user: SuperAdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextType | undefined>(undefined);

export function SuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if authenticated
      if (!superAdminAPI.isAuthenticated()) {
        setUser(null);
        return;
      }

      // Get current user from API
      const currentUser = await superAdminAPI.getCurrentUser();
      
      // Verify user is a super admin
      if (currentUser.user_type !== "super_admin") {
        console.error("User is not a super admin:", currentUser.user_type);
        superAdminAPI.logout();
        setUser(null);
        return;
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        user_type: "super_admin",
        tenant_id: currentUser.tenant_id,
      });
    } catch (error) {
      console.error("Super admin auth check failed:", error);
      superAdminAPI.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Call login API
      const response = await superAdminAPI.login(email, password);
      
      // Get user info after login
      const currentUser = await superAdminAPI.getCurrentUser();
      
      // Verify user is a super admin
      if (currentUser.user_type !== "super_admin") {
        throw new Error("Access denied: Not a super admin account");
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        user_type: "super_admin",
        tenant_id: currentUser.tenant_id,
      });
      
    } catch (error) {
      superAdminAPI.logout();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    superAdminAPI.logout();
    setUser(null);
    router.push("/super-admin/login");
  }, [router]);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return (
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
}

/**
 * Hook to access super admin auth context
 */
export function useSuperAdminAuth() {
  const context = useContext(SuperAdminAuthContext);
  if (context === undefined) {
    throw new Error("useSuperAdminAuth must be used within a SuperAdminAuthProvider");
  }
  return context;
}

/**
 * HOC for protecting super admin routes
 */
export function withSuperAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, loading } = useSuperAdminAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace("/super-admin/login");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-white/50 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-white/80">Verifying access...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
