"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiService from "@/lib/api-service";
import {
  isValidUUID,
  migrateLocalStorage,
  UserStatus,
  VerificationStatus,
  isActiveStatus,
  isVerified,
} from "@/lib/utils";

/**
 * User interface - Updated for UUID-based backend
 */
interface User {
  id: string; // UUID (changed from number)
  email: string;
  full_name: string;
  user_type: "patient" | "doctor" | "hospital" | "hospital_admin";
  verification_status: VerificationStatus; // 'pending' | 'approved' | 'rejected' (changed from is_verified)
  status: UserStatus; // 'active' | 'suspended' | 'deactivated' (changed from is_active)
  tenant_id: string; // UUID - hospital/tenant ID (changed from number)
  subdomain?: string; // Tenant subdomain for multi-tenant support

  // Computed properties for backward compatibility
  is_verified?: boolean;
  is_active?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  login: (token: string, userType: string, userId: string) => void; // userId is now UUID string
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateOnboardingStatus: (completed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        setUser(null);
        return;
      }

      // Migrate old localStorage data if needed
      migrateLocalStorage();

      // Get user data from API
      const userData = await apiService.getCurrentUser();

      // Validate UUIDs
      if (
        !isValidUUID(userData.id) ||
        (userData.tenant_id && !isValidUUID(userData.tenant_id))
      ) {
        console.error("Invalid UUID in user data:", userData);
        throw new Error("Invalid user data format");
      }

      // Create user object with new fields
      setUser({
        id: userData.id, // UUID string
        email: userData.email,
        full_name: userData.full_name,
        user_type: userData.user_type,
        verification_status: userData.verification_status || "pending",
        status: userData.status || "active",
        tenant_id: userData.tenant_id,
        subdomain: userData.subdomain,
        // Backward compatibility
        is_verified: isVerified(userData.verification_status || "pending"),
        is_active: isActiveStatus(userData.status || "active"),
      });

      try {
        const onboardingStatus = await apiService.getOnboardingStatus();
        setIsOnboardingCompleted(onboardingStatus.onboarding_completed);
      } catch (statusError) {
        console.warn("Failed to fetch onboarding status:", statusError);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Token is invalid, clear storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
      localStorage.removeItem("tenant_id");
      localStorage.removeItem("subdomain");
      apiService.clearAuth();
      setUser(null);
      setIsOnboardingCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, userType: string, userId: string) => {
    // Validate UUID
    if (!isValidUUID(userId)) {
      console.error("Invalid user ID format:", userId);
      throw new Error("Invalid user ID - must be UUID");
    }

    localStorage.setItem("access_token", token);
    localStorage.setItem("user_type", userType);
    localStorage.setItem("user_id", userId); // Already a string UUID
    apiService.setToken(token);

    // Set loading to true briefly to show transition
    setLoading(true);

    // Quick user data update instead of full checkAuth
    const userData: User = {
      id: userId, // UUID string
      email: "", // Will be populated by checkAuth
      full_name: "",
      user_type: userType as
        | "patient"
        | "doctor"
        | "hospital"
        | "hospital_admin",
      verification_status: "approved", // Will be updated by checkAuth
      status: "active", // Will be updated by checkAuth
      tenant_id: "", // Will be populated by checkAuth
      // Backward compatibility
      is_verified: true,
      is_active: true,
    };
    setUser(userData);

    // Async fetch complete data without blocking
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("tenant_id");
    localStorage.removeItem("subdomain");
    apiService.clearAuth();
    setUser(null);
    setIsOnboardingCompleted(false);
    router.push("/auth");
  };

  const updateOnboardingStatus = (completed: boolean) => {
    setIsOnboardingCompleted(completed);
  };

  // Optimize initial auth check
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        apiService.setToken(token);
        await checkAuth();
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isOnboardingCompleted,
    login,
    logout,
    checkAuth,
    updateOnboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
