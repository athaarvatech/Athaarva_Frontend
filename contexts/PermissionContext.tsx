"use client";

/**
 * Permission Context
 * ==================
 * React context for managing user permissions and role-based access control.
 *
 * Phase 4: Role-Based Access Control
 *
 * Features:
 * - Automatic permission fetching on auth
 * - Permission and role checking utilities
 * - Conditional rendering components
 * - Permission caching
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { API_CONFIG } from "@/lib/api-config";

// =============================================================================
// Types
// =============================================================================

export interface Permission {
  domain: string;
  action: string;
  permission_key: string;
}

export interface Role {
  id: string;
  code: string;
  display_name: string;
  description?: string;
  is_system: boolean;
  assigned_at?: string;
  assigned_by?: string;
}

export interface AccessSummary {
  user_id: string;
  tenant_id: string;
  roles: Array<{
    role_id: string;
    role_code: string;
    role_name: string;
    permissions: Array<{
      domain: string;
      action: string;
      category?: string;
    }>;
  }>;
  permissions: string[];
  permission_count: number;
}

export interface PermissionContextType {
  // State
  permissions: Set<string>;
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;

  // Permission Checking
  hasPermission: (domain: string, action: string) => boolean;
  hasAnyPermission: (permissions: Array<[string, string]>) => boolean;
  hasAllPermissions: (permissions: Array<[string, string]>) => boolean;

  // Role Checking
  hasRole: (roleCode: string) => boolean;
  hasAnyRole: (roleCodes: string[]) => boolean;

  // Actions
  refreshPermissions: () => Promise<void>;
  clearPermissions: () => void;

  // Access Summary
  accessSummary: AccessSummary | null;
}

// =============================================================================
// Permission Constants
// =============================================================================

/**
 * Common permission constants for type-safe usage.
 * Matches backend Permissions class.
 */
export const Permissions = {
  // Dashboard
  DASHBOARD_VIEW: ["dashboard", "view"] as const,
  DASHBOARD_ANALYTICS: ["dashboard", "view_analytics"] as const,

  // Staff Management
  STAFF_VIEW: ["staff", "view"] as const,
  STAFF_CREATE: ["staff", "create"] as const,
  STAFF_UPDATE: ["staff", "update"] as const,
  STAFF_DELETE: ["staff", "delete"] as const,
  STAFF_MANAGE_ROLES: ["staff", "manage_roles"] as const,

  // Patient Management
  PATIENTS_VIEW: ["patients", "view"] as const,
  PATIENTS_CREATE: ["patients", "create"] as const,
  PATIENTS_UPDATE: ["patients", "update"] as const,
  PATIENTS_VIEW_RECORDS: ["patients", "view_medical_records"] as const,
  PATIENTS_EDIT_RECORDS: ["patients", "edit_medical_records"] as const,

  // Appointments
  APPOINTMENTS_VIEW: ["appointments", "view"] as const,
  APPOINTMENTS_CREATE: ["appointments", "create"] as const,
  APPOINTMENTS_UPDATE: ["appointments", "update"] as const,
  APPOINTMENTS_CANCEL: ["appointments", "cancel"] as const,
  APPOINTMENTS_VIEW_ALL: ["appointments", "view_all"] as const,

  // Prescriptions
  PRESCRIPTIONS_VIEW: ["prescriptions", "view"] as const,
  PRESCRIPTIONS_CREATE: ["prescriptions", "create"] as const,
  PRESCRIPTIONS_UPDATE: ["prescriptions", "update"] as const,

  // Lab
  LAB_VIEW_ORDERS: ["lab", "view_orders"] as const,
  LAB_CREATE_ORDERS: ["lab", "create_orders"] as const,
  LAB_UPLOAD_RESULTS: ["lab", "upload_results"] as const,
  LAB_VERIFY_RESULTS: ["lab", "verify_results"] as const,

  // Pharmacy
  PHARMACY_VIEW_INVENTORY: ["pharmacy", "view_inventory"] as const,
  PHARMACY_MANAGE_INVENTORY: ["pharmacy", "manage_inventory"] as const,
  PHARMACY_DISPENSE: ["pharmacy", "dispense"] as const,
  PHARMACY_VIEW_ORDERS: ["pharmacy", "view_orders"] as const,

  // Billing
  BILLING_VIEW: ["billing", "view"] as const,
  BILLING_CREATE_INVOICES: ["billing", "create_invoices"] as const,
  BILLING_PROCESS_PAYMENTS: ["billing", "process_payments"] as const,
  BILLING_MANAGE_INSURANCE: ["billing", "manage_insurance"] as const,
  BILLING_REFUNDS: ["billing", "refunds"] as const,

  // Reports
  REPORTS_VIEW: ["reports", "view"] as const,
  REPORTS_EXPORT: ["reports", "export"] as const,
  REPORTS_FINANCIAL: ["reports", "financial"] as const,
  REPORTS_CLINICAL: ["reports", "clinical"] as const,

  // Settings
  SETTINGS_VIEW: ["settings", "view"] as const,
  SETTINGS_UPDATE: ["settings", "update"] as const,
  SETTINGS_BRANDING: ["settings", "branding"] as const,
  SETTINGS_INTEGRATIONS: ["settings", "integrations"] as const,

  // Audit & Security
  AUDIT_VIEW_LOGS: ["audit", "view_logs"] as const,
  AUDIT_EXPORT_LOGS: ["audit", "export_logs"] as const,
  SECURITY_MANAGE_MFA: ["security", "manage_mfa"] as const,
  SECURITY_MANAGE_SESSIONS: ["security", "manage_sessions"] as const,
} as const;

/**
 * Common role constants.
 */
export const Roles = {
  HOSPITAL_ADMIN: "hospital_admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTIONIST: "receptionist",
  LAB_TECHNICIAN: "lab_technician",
  PHARMACIST: "pharmacist",
  BILLING_STAFF: "billing_staff",
  DEPARTMENT_HEAD: "department_head",
} as const;

// =============================================================================
// Context
// =============================================================================

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

// =============================================================================
// Provider
// =============================================================================

interface PermissionProviderProps {
  children: ReactNode;
  tenantId: string | null;
  token: string | null;
  userId?: string | null;
}

export function PermissionProvider({
  children,
  tenantId,
  token,
  userId,
}: PermissionProviderProps) {
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [roles, setRoles] = useState<Role[]>([]);
  const [accessSummary, setAccessSummary] = useState<AccessSummary | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  /**
   * Fetch permissions and roles from the API.
   */
  const fetchPermissions = useCallback(async () => {
    if (!token || !tenantId) {
      setPermissions(new Set());
      setRoles([]);
      setAccessSummary(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/my-access-summary?tenant_id=${tenantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch permissions: ${response.statusText}`);
      }

      const data: AccessSummary = await response.json();

      // Extract permissions as Set
      const permSet = new Set<string>(data.permissions);
      setPermissions(permSet);

      // Extract roles
      const roleList: Role[] = data.roles.map((r) => ({
        id: r.role_id,
        code: r.role_code,
        display_name: r.role_name,
        is_system: true, // Will be updated with full role data if needed
      }));
      setRoles(roleList);

      setAccessSummary(data);
      setLastFetched(new Date());
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [token, tenantId]);

  /**
   * Refresh permissions on mount and when dependencies change.
   */
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  /**
   * Check if user has a specific permission.
   */
  const hasPermission = useCallback(
    (domain: string, action: string): boolean => {
      return permissions.has(`${domain}:${action}`);
    },
    [permissions]
  );

  /**
   * Check if user has ANY of the specified permissions.
   */
  const hasAnyPermission = useCallback(
    (permList: Array<[string, string]>): boolean => {
      return permList.some(([domain, action]) =>
        permissions.has(`${domain}:${action}`)
      );
    },
    [permissions]
  );

  /**
   * Check if user has ALL of the specified permissions.
   */
  const hasAllPermissions = useCallback(
    (permList: Array<[string, string]>): boolean => {
      return permList.every(([domain, action]) =>
        permissions.has(`${domain}:${action}`)
      );
    },
    [permissions]
  );

  /**
   * Check if user has a specific role.
   */
  const hasRole = useCallback(
    (roleCode: string): boolean => {
      return roles.some((r) => r.code === roleCode);
    },
    [roles]
  );

  /**
   * Check if user has ANY of the specified roles.
   */
  const hasAnyRole = useCallback(
    (roleCodes: string[]): boolean => {
      return roleCodes.some((code) => roles.some((r) => r.code === code));
    },
    [roles]
  );

  /**
   * Clear all permissions (on logout).
   */
  const clearPermissions = useCallback(() => {
    setPermissions(new Set());
    setRoles([]);
    setAccessSummary(null);
    setLastFetched(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      permissions,
      roles,
      isLoading,
      error,
      lastFetched,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      hasAnyRole,
      refreshPermissions: fetchPermissions,
      clearPermissions,
      accessSummary,
    }),
    [
      permissions,
      roles,
      isLoading,
      error,
      lastFetched,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      hasAnyRole,
      fetchPermissions,
      clearPermissions,
      accessSummary,
    ]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function usePermissions(): PermissionContextType {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
}

// =============================================================================
// Utility Components
// =============================================================================

interface RequirePermissionProps {
  domain: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on permission.
 *
 * @example
 * <RequirePermission domain="staff" action="create">
 *   <Button>Add Staff</Button>
 * </RequirePermission>
 */
export function RequirePermission({
  domain,
  action,
  children,
  fallback = null,
}: RequirePermissionProps) {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  if (!hasPermission(domain, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireAnyPermissionProps {
  permissions: Array<[string, string]>;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children if user has ANY of the permissions.
 */
export function RequireAnyPermission({
  permissions: permList,
  children,
  fallback = null,
}: RequireAnyPermissionProps) {
  const { hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  if (!hasAnyPermission(permList)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireAllPermissionsProps {
  permissions: Array<[string, string]>;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children if user has ALL of the permissions.
 */
export function RequireAllPermissions({
  permissions: permList,
  children,
  fallback = null,
}: RequireAllPermissionsProps) {
  const { hasAllPermissions, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  if (!hasAllPermissions(permList)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireRoleProps {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on role.
 *
 * @example
 * <RequireRole role="hospital_admin">
 *   <AdminPanel />
 * </RequireRole>
 */
export function RequireRole({
  role,
  children,
  fallback = null,
}: RequireRoleProps) {
  const { hasRole, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  if (!hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireAnyRoleProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children if user has ANY of the roles.
 */
export function RequireAnyRole({
  roles: roleList,
  children,
  fallback = null,
}: RequireAnyRoleProps) {
  const { hasAnyRole, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  if (!hasAnyRole(roleList)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// =============================================================================
// Higher-Order Component
// =============================================================================

interface WithPermissionOptions {
  domain: string;
  action: string;
  fallback?: React.ComponentType;
  loadingComponent?: React.ComponentType;
}

/**
 * HOC to wrap a component with permission checking.
 *
 * @example
 * const ProtectedComponent = withPermission(MyComponent, {
 *   domain: "staff",
 *   action: "manage_roles",
 *   fallback: AccessDenied,
 * });
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  options: WithPermissionOptions
): React.ComponentType<P> {
  const { domain, action, fallback: Fallback, loadingComponent: Loading } = options;

  return function WrappedComponent(props: P) {
    const { hasPermission, isLoading } = usePermissions();

    if (isLoading && Loading) {
      return <Loading />;
    }

    if (!hasPermission(domain, action)) {
      return Fallback ? <Fallback /> : null;
    }

    return <Component {...props} />;
  };
}

// =============================================================================
// Exports
// =============================================================================

export default PermissionContext;
