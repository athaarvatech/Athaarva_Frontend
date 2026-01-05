"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Shield,
  Stethoscope,
  User,
  Building2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MoreVertical,
  ExternalLink,
  UserX,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Types
interface GlobalUser {
  id: string;
  email: string;
  display_name: string | null;
  user_type: string;
  status: string;
  tenant_id: string | null;
  tenant_code: string | null;
  tenant_name: string | null;
  created_at: string;
  last_login_at: string | null;
  email_verified: boolean;
}

interface UserStats {
  total_users: number;
  active_users: number;
  super_admins: number;
  hospital_admins: number;
  doctors: number;
  patients: number;
  staff: number;
}

// API helpers
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("super_admin_token") : null;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v2/super-admin";

async function fetchUsers(params: {
  user_type?: string;
  status?: string;
  tenant_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<GlobalUser[]> {
  const searchParams = new URLSearchParams();
  if (params.user_type) searchParams.append("user_type", params.user_type);
  if (params.status) searchParams.append("status", params.status);
  if (params.tenant_id) searchParams.append("tenant_id", params.tenant_id);
  if (params.search) searchParams.append("search", params.search);
  if (params.limit) searchParams.append("limit", String(params.limit));
  if (params.offset) searchParams.append("offset", String(params.offset));
  
  const response = await fetch(`${BASE_URL}/users?${searchParams}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

async function fetchUserStats(): Promise<UserStats> {
  const response = await fetch(`${BASE_URL}/users/stats`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch user stats");
  return response.json();
}

async function updateUserStatus(userId: string, newStatus: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/users/${userId}/status?new_status=${newStatus}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update user status");
  }
}

// User type configs
const userTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  super_admin: {
    label: "Super Admin",
    icon: <Shield className="h-4 w-4" />,
    color: "text-red-400 bg-red-500/20",
  },
  hospital_admin: {
    label: "Hospital Admin",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-purple-400 bg-purple-500/20",
  },
  doctor: {
    label: "Doctor",
    icon: <Stethoscope className="h-4 w-4" />,
    color: "text-blue-400 bg-blue-500/20",
  },
  patient: {
    label: "Patient",
    icon: <User className="h-4 w-4" />,
    color: "text-green-400 bg-green-500/20",
  },
  staff: {
    label: "Staff",
    icon: <Users className="h-4 w-4" />,
    color: "text-yellow-400 bg-yellow-500/20",
  },
};

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  active: {
    label: "Active",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "bg-emerald-500/20 text-emerald-200 border-emerald-500/20",
  },
  inactive: {
    label: "Inactive",
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: "bg-slate-500/20 text-slate-200 border-slate-500/20",
  },
  suspended: {
    label: "Suspended",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color: "bg-red-500/20 text-red-200 border-red-500/20",
  },
  invited: {
    label: "Invited",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "bg-yellow-500/20 text-yellow-200 border-yellow-500/20",
  },
};

export default function GlobalUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // Action states
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };
      if (userTypeFilter !== "all") params.user_type = userTypeFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search;

      const [usersData, statsData] = await Promise.all([
        fetchUsers(params),
        page === 1 ? fetchUserStats() : Promise.resolve(stats),
      ]);
      setUsers(usersData);
      if (statsData) setStats(statsData);
      setError(null);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, userTypeFilter, statusFilter]);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedUser || !actionType) return;
    setActionLoading(true);
    try {
      const newStatus = actionType === "suspend" ? "suspended" : "active";
      await updateUserStatus(selectedUser.id, newStatus);
      setActionDialogOpen(false);
      setSelectedUser(null);
      setActionType(null);
      loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  // Open action dialog
  const openActionDialog = (user: GlobalUser, type: "suspend" | "activate") => {
    setSelectedUser(user);
    setActionType(type);
    setActionDialogOpen(true);
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto" />
          <p className="text-white/60">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-3">
          <Users className="h-7 w-7 text-emerald-400" />
          Global Users
        </h1>
        <p className="text-white/60 mt-1">
          Manage all users across the platform
        </p>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-200">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto text-red-300"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-4">
              <p className="text-sm text-white/60">Total Users</p>
              <p className="text-2xl font-bold">{stats.total_users.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-emerald-300/80">Active</p>
              <p className="text-2xl font-bold text-emerald-300">{stats.active_users.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-red-300/80">Super Admins</p>
              <p className="text-2xl font-bold text-red-300">{stats.super_admins}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-purple-300/80">Hospital Admins</p>
              <p className="text-2xl font-bold text-purple-300">{stats.hospital_admins}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-blue-300/80">Doctors</p>
              <p className="text-2xl font-bold text-blue-300">{stats.doctors.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-green-300/80">Patients</p>
              <p className="text-2xl font-bold text-green-300">{stats.patients.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-yellow-300/80">Staff</p>
              <p className="text-2xl font-bold text-yellow-300">{stats.staff}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
            <Select value={userTypeFilter} onValueChange={(v) => { setUserTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="hospital_admin">Hospital Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No users found</p>
              <p className="text-white/40 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/70">User</TableHead>
                    <TableHead className="text-white/70">Type</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Tenant</TableHead>
                    <TableHead className="text-white/70">Created</TableHead>
                    <TableHead className="text-white/70">Last Login</TableHead>
                    <TableHead className="text-white/70 w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const typeConfig = userTypeConfig[user.user_type] || userTypeConfig.staff;
                    const statusCfg = statusConfig[user.status] || statusConfig.inactive;
                    
                    return (
                      <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn("h-9 w-9 rounded-full flex items-center justify-center", typeConfig.color)}>
                              {typeConfig.icon}
                            </div>
                            <div>
                              <p className="font-medium">{user.display_name || "—"}</p>
                              <div className="flex items-center gap-1.5 text-sm text-white/50">
                                <Mail className="h-3 w-3" />
                                {user.email}
                                {user.email_verified && (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-400" title="Verified" />
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("border-transparent", typeConfig.color)}>
                            {typeConfig.icon}
                            <span className="ml-1">{typeConfig.label}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1", statusCfg.color)}>
                            {statusCfg.icon}
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.tenant_code ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-emerald-400 hover:text-emerald-300"
                              onClick={() => router.push(`/super-admin/tenants/${user.tenant_id}`)}
                            >
                              {user.tenant_name || user.tenant_code}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          ) : (
                            <span className="text-white/40">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-white/60">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-white/60">
                          {user.last_login_at
                            ? new Date(user.last_login_at).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                              {user.tenant_id && (
                                <DropdownMenuItem
                                  onClick={() => router.push(`/super-admin/tenants/${user.tenant_id}`)}
                                >
                                  <Building2 className="h-4 w-4 mr-2" />
                                  View Tenant
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-white/10" />
                              {user.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() => openActionDialog(user, "suspend")}
                                  className="text-red-400"
                                  disabled={user.user_type === "super_admin"}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => openActionDialog(user, "activate")}
                                  className="text-emerald-400"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <p className="text-sm text-white/60">
                Page {page} • Showing {users.length} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="border-white/20"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={users.length < pageSize || loading}
                  className="border-white/20"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className={actionType === "suspend" ? "text-red-400" : "text-emerald-400"}>
              {actionType === "suspend" ? "Suspend User" : "Activate User"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {actionType === "suspend" ? (
                <>
                  Are you sure you want to suspend <strong>{selectedUser?.email}</strong>?
                  <span className="block mt-2 text-white/50">
                    This user will not be able to log in until reactivated.
                  </span>
                </>
              ) : (
                <>
                  Are you sure you want to activate <strong>{selectedUser?.email}</strong>?
                  <span className="block mt-2 text-white/50">
                    This user will be able to log in again.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false);
                setSelectedUser(null);
                setActionType(null);
              }}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={actionLoading}
              className={actionType === "suspend" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : actionType === "suspend" ? (
                <UserX className="h-4 w-4 mr-2" />
              ) : (
                <UserCheck className="h-4 w-4 mr-2" />
              )}
              {actionType === "suspend" ? "Suspend" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
