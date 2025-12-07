"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Search,
  Filter,
  ChevronRight,
  Users,
  Calendar,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Loader2,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { superAdminAPI, type TenantResponse } from "@/lib/api";
import { useRouter } from "next/navigation";

// Status badge styles
const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  active: { 
    label: "Active", 
    className: "bg-emerald-500/20 text-emerald-200 border-emerald-500/20",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />
  },
  pending: { 
    label: "Pending", 
    className: "bg-yellow-500/20 text-yellow-200 border-yellow-500/20",
    icon: <Clock className="h-3.5 w-3.5" />
  },
  suspended: { 
    label: "Suspended", 
    className: "bg-red-500/20 text-red-200 border-red-500/20",
    icon: <AlertTriangle className="h-3.5 w-3.5" />
  },
  inactive: { 
    label: "Inactive", 
    className: "bg-slate-500/20 text-slate-200 border-slate-500/20",
    icon: <XCircle className="h-3.5 w-3.5" />
  },
};

export default function TenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<TenantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTenant, setSelectedTenant] = useState<TenantResponse | null>(null);
  const [actionDialog, setActionDialog] = useState<{ type: "suspend" | "activate" | "archive" | null; tenant: TenantResponse | null }>({
    type: null,
    tenant: null,
  });

  // Fetch tenants
  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const params: { status?: string; limit?: number } = { limit: 100 };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const data = await superAdminAPI.listTenants(params);
      setTenants(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tenants:", err);
      setError("Failed to load tenants. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // Filter tenants based on search
  const filteredTenants = tenants.filter((tenant) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tenant.display_name.toLowerCase().includes(searchLower) ||
      tenant.code.toLowerCase().includes(searchLower) ||
      tenant.contact_email.toLowerCase().includes(searchLower) ||
      (tenant.contact_name?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  // Handle tenant actions
  const handleAction = async (action: "suspend" | "activate" | "archive", tenant: TenantResponse) => {
    try {
      if (action === "archive") {
        await superAdminAPI.archiveTenant(tenant.id);
      } else if (action === "suspend") {
        await superAdminAPI.updateTenant(tenant.id, { status: "suspended" });
      } else if (action === "activate") {
        await superAdminAPI.updateTenant(tenant.id, { status: "active" });
      }
      fetchTenants();
      setActionDialog({ type: null, tenant: null });
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  // Stats summary
  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    pending: tenants.filter((t) => t.status === "pending").length,
    suspended: tenants.filter((t) => t.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tenant Management</h1>
          <p className="text-white/60 mt-1">
            Manage hospitals and healthcare organizations on the platform
          </p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          New Invitation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Tenants</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active</p>
                <p className="text-2xl font-semibold text-emerald-300">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-300/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pending</p>
                <p className="text-2xl font-semibold text-yellow-300">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-300/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Suspended</p>
                <p className="text-2xl font-semibold text-red-300">{stats.suspended}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-300/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search by name, code, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={fetchTenants}
              className="border-white/20"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="bg-white/5 border-white/10 p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            <p className="text-white/60">Loading tenants...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-red-500/10 border-red-500/20 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <div>
              <h3 className="font-semibold text-red-200">{error}</h3>
              <Button variant="outline" size="sm" onClick={fetchTenants} className="mt-2">
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTenants.length === 0 && (
        <Card className="bg-white/5 border-white/10 p-12">
          <div className="text-center space-y-4">
            <Building2 className="h-12 w-12 text-white/40 mx-auto" />
            <h3 className="text-lg font-semibold">No Tenants Found</h3>
            <p className="text-white/60">
              {searchTerm ? "Try adjusting your search criteria" : "Send an invitation to onboard your first hospital"}
            </p>
          </div>
        </Card>
      )}

      {/* Tenants Table */}
      {!loading && !error && filteredTenants.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Organization</TableHead>
                <TableHead className="text-white/60">Contact</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Onboarding</TableHead>
                <TableHead className="text-white/60">Created</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow 
                  key={tenant.id} 
                  className="border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => router.push(`/super-admin/tenants/${tenant.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white/70" />
                      </div>
                      <div>
                        <p className="font-medium">{tenant.display_name}</p>
                        <p className="text-sm text-white/50">{tenant.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{tenant.contact_name || "—"}</p>
                      <p className="text-sm text-white/50">{tenant.contact_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("gap-1.5", statusConfig[tenant.status]?.className)}>
                      {statusConfig[tenant.status]?.icon}
                      {statusConfig[tenant.status]?.label || tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      {tenant.onboarding_stage || "Not Started"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/60">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/super-admin/tenants/${tenant.id}`);
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/super-admin/tenants/${tenant.id}/settings`);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {tenant.status === "active" && (
                          <DropdownMenuItem 
                            className="text-yellow-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionDialog({ type: "suspend", tenant });
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Suspend Tenant
                          </DropdownMenuItem>
                        )}
                        {tenant.status === "suspended" && (
                          <DropdownMenuItem 
                            className="text-emerald-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionDialog({ type: "activate", tenant });
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Reactivate Tenant
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionDialog({ type: "archive", tenant });
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Archive Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialog.type} onOpenChange={(open) => !open && setActionDialog({ type: null, tenant: null })}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "suspend" && "Suspend Tenant"}
              {actionDialog.type === "activate" && "Reactivate Tenant"}
              {actionDialog.type === "archive" && "Archive Tenant"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {actionDialog.type === "suspend" && 
                `Are you sure you want to suspend ${actionDialog.tenant?.display_name}? Users will not be able to access the platform.`}
              {actionDialog.type === "activate" && 
                `Are you sure you want to reactivate ${actionDialog.tenant?.display_name}? Users will regain access to the platform.`}
              {actionDialog.type === "archive" && 
                `Are you sure you want to archive ${actionDialog.tenant?.display_name}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialog({ type: null, tenant: null })}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button
              className={cn(
                actionDialog.type === "archive" && "bg-red-600 hover:bg-red-700",
                actionDialog.type === "suspend" && "bg-yellow-600 hover:bg-yellow-700",
                actionDialog.type === "activate" && "bg-emerald-600 hover:bg-emerald-700"
              )}
              onClick={() => actionDialog.tenant && actionDialog.type && handleAction(actionDialog.type, actionDialog.tenant)}
            >
              {actionDialog.type === "suspend" && "Suspend"}
              {actionDialog.type === "activate" && "Reactivate"}
              {actionDialog.type === "archive" && "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
