"use client";

/**
 * Role Management Component
 * =========================
 * Admin UI for managing user roles within a hospital/tenant.
 *
 * Phase 4: Role-Based Access Control
 *
 * Features:
 * - View available roles
 * - Assign/revoke roles for users
 * - View role permissions
 * - User access summary
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Key,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Loader2,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  Search,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/api-config";

// =============================================================================
// Types
// =============================================================================

interface Role {
  id: string;
  tenant_id: string | null;
  code: string;
  display_name: string;
  description: string | null;
  is_system: boolean;
  created_at: string | null;
  permission_count: number;
}

interface Permission {
  id: string;
  domain: string;
  action: string;
  description: string | null;
  category: string | null;
  is_system: boolean;
  grant_scope?: Record<string, unknown>;
  granted_at?: string;
}

interface UserRole {
  id: string;
  code: string;
  display_name: string;
  description: string | null;
  is_system: boolean;
  assigned_at: string | null;
  assigned_by: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface StaffMember {
  id: string;
  email: string;
  full_name: string;
  status: string;
  roles: UserRole[];
}

// =============================================================================
// Role Management Component
// =============================================================================

interface RoleManagementProps {
  tenantId: string;
  token: string;
  onRoleChange?: () => void;
}

export function RoleManagement({
  tenantId,
  token,
  onRoleChange: _onRoleChange,
}: RoleManagementProps) {
  // State
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch available roles
  const fetchRoles = useCallback(async () => {
    setIsLoadingRoles(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/roles/available?tenant_id=${tenantId}&include_system=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();
      setAvailableRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setIsLoadingRoles(false);
    }
  }, [tenantId, token]);

  // Fetch permissions for a role
  const fetchRolePermissions = useCallback(
    async (roleId: string) => {
      setIsLoadingPermissions(true);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/auth/roles/${roleId}/permissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await response.json();
        setRolePermissions(data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to load permissions");
      } finally {
        setIsLoadingPermissions(false);
      }
    },
    [token]
  );

  // Initial load
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Load permissions when role selected
  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole.id);
    } else {
      setRolePermissions([]);
    }
  }, [selectedRole, fetchRolePermissions]);

  // Group permissions by category
  const permissionsByCategory = React.useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    rolePermissions.forEach((perm) => {
      const category = perm.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(perm);
    });
    return grouped;
  }, [rolePermissions]);

  // Filter roles by search
  const filteredRoles = React.useMemo(() => {
    if (!searchQuery) return availableRoles;
    const query = searchQuery.toLowerCase();
    return availableRoles.filter(
      (role) =>
        role.display_name.toLowerCase().includes(query) ||
        role.code.toLowerCase().includes(query) ||
        role.description?.toLowerCase().includes(query)
    );
  }, [availableRoles, searchQuery]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-gray-600">
            View and manage roles for your organization
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchRoles}
          disabled={isLoadingRoles}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoadingRoles ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-healthcare-primary" />
              Available Roles
            </CardTitle>
            <CardDescription>
              Select a role to view its permissions
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingRoles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
              </div>
            ) : filteredRoles.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No roles found</p>
            ) : (
              <div className="space-y-2">
                {filteredRoles.map((role) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedRole?.id === role.id
                        ? "border-healthcare-primary bg-healthcare-primary/5"
                        : "border-gray-200 hover:border-healthcare-primary/50"
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {role.display_name}
                          </h3>
                          {role.is_system && (
                            <Badge variant="secondary" className="text-xs">
                              System
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {role.description || `Role code: ${role.code}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {role.permission_count} permissions
                        </p>
                      </div>
                      {selectedRole?.id === role.id && (
                        <Check className="h-5 w-5 text-healthcare-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-healthcare-secondary" />
              Role Permissions
            </CardTitle>
            <CardDescription>
              {selectedRole
                ? `Permissions for ${selectedRole.display_name}`
                : "Select a role to view permissions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Shield className="h-12 w-12 mb-4" />
                <p>Select a role to view its permissions</p>
              </div>
            ) : isLoadingPermissions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
              </div>
            ) : rolePermissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <AlertTriangle className="h-12 w-12 mb-4" />
                <p>No permissions assigned to this role</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(permissionsByCategory).map(
                  ([category, perms]) => (
                    <Collapsible
                      key={category}
                      open={expandedCategories.has(category)}
                      onOpenChange={() => toggleCategory(category)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          {expandedCategories.has(category) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium text-gray-700">
                            {category}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {perms.length}
                          </Badge>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 ml-6 space-y-1">
                          {perms.map((perm) => (
                            <TooltipProvider key={perm.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-gray-700">
                                      {perm.domain}:{perm.action}
                                    </span>
                                    {perm.description && (
                                      <Info className="h-3 w-3 text-gray-400" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                {perm.description && (
                                  <TooltipContent>
                                    <p>{perm.description}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// =============================================================================
// User Role Assignment Component
// =============================================================================

interface UserRoleAssignmentProps {
  userId: string;
  userName: string;
  tenantId: string;
  token: string;
  currentRoles?: UserRole[];
  onRolesChanged?: () => void;
}

export function UserRoleAssignment({
  userId,
  userName,
  tenantId,
  token,
  currentRoles = [],
  onRolesChanged,
}: UserRoleAssignmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>(currentRoles);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch available roles
  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/roles/available?tenant_id=${tenantId}&include_system=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableRoles(data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, token]);

  // Fetch user's current roles
  const fetchUserRoles = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/users/${userId}/roles?tenant_id=${tenantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserRoles(data);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  }, [userId, tenantId, token]);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchUserRoles();
    }
  }, [isOpen, fetchRoles, fetchUserRoles]);

  // Assign role
  const assignRole = async (roleId: string) => {
    setIsAssigning(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/roles/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          role_id: roleId,
          tenant_id: tenantId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to assign role");
      }

      toast.success("Role assigned successfully");
      fetchUserRoles();
      onRolesChanged?.();
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to assign role"
      );
    } finally {
      setIsAssigning(false);
    }
  };

  // Revoke role
  const revokeRole = async (roleId: string) => {
    setIsAssigning(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/roles/revoke?user_id=${userId}&role_id=${roleId}&tenant_id=${tenantId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to revoke role");
      }

      toast.success("Role revoked successfully");
      fetchUserRoles();
      onRolesChanged?.();
    } catch (error) {
      console.error("Error revoking role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to revoke role"
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const userRoleIds = new Set(userRoles.map((r) => r.id));

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Shield className="h-4 w-4 mr-2" />
        Manage Roles
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Roles for {userName}
            </DialogTitle>
            <DialogDescription>
              Assign or revoke roles to control what this user can access.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Current Roles */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Current Roles</h4>
              {userRoles.length === 0 ? (
                <p className="text-sm text-gray-500">No roles assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userRoles.map((role) => (
                    <Badge
                      key={role.id}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {role.display_name}
                      <button
                        onClick={() => revokeRole(role.id)}
                        disabled={isAssigning}
                        className="ml-1 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Available Roles */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                Available Roles
              </h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableRoles
                    .filter((role) => !userRoleIds.has(role.id))
                    .map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {role.display_name}
                            </span>
                            {role.is_system && (
                              <Badge variant="outline" className="text-xs">
                                System
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {role.description || `${role.permission_count} permissions`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => assignRole(role.id)}
                          disabled={isAssigning}
                        >
                          {isAssigning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// =============================================================================
// Exports
// =============================================================================

export default RoleManagement;
