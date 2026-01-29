"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Clock,
  Users,
  Settings,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Edit,
  ExternalLink,
  Copy,
  FileText,
  CreditCard,
  Activity,
  Shield,
  User,
  Stethoscope,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import {
  superAdminAPI,
  type TenantResponse,
  type OnboardingWizardState,
  type TenantUserResponse,
} from "@/lib/api";

// Status badge styles
const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  active: {
    label: "Active",
    className: "bg-emerald-500/20 text-emerald-200 border-emerald-500/20",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-500/20 text-yellow-200 border-yellow-500/20",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-500/20 text-red-200 border-red-500/20",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  inactive: {
    label: "Inactive",
    className: "bg-slate-500/20 text-slate-200 border-slate-500/20",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<TenantResponse | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingWizardState | null>(
    null
  );
  const [users, setUsers] = useState<TenantUserResponse[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    brand_tagline: "",
  });

  // Fetch tenant details
  const fetchTenant = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const [tenantData, onboardingData] = await Promise.all([
        superAdminAPI.getTenant(tenantId),
        superAdminAPI.getOnboardingByTenant(tenantId).catch(() => null),
      ]);
      setTenant(tenantData);
      setOnboarding(onboardingData);
      setEditForm({
        display_name: tenantData.display_name,
        contact_name: tenantData.contact_name || "",
        contact_email: tenantData.contact_email,
        contact_phone: tenantData.contact_phone || "",
        brand_tagline: tenantData.brand_tagline || "",
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tenant:", err);
      setError("Failed to load tenant details.");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  // Fetch tenant users
  const fetchUsers = useCallback(async () => {
    if (!tenantId) return;
    setUsersLoading(true);
    try {
      const params: { user_type?: string; status?: string } = {};
      if (userTypeFilter !== "all") params.user_type = userTypeFilter;
      if (userStatusFilter !== "all") params.status = userStatusFilter;
      
      const usersData = await superAdminAPI.listTenantUsers(tenantId, params);
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, [tenantId, userTypeFilter, userStatusFilter]);

  useEffect(() => {
    fetchTenant();
  }, [fetchTenant]);

  useEffect(() => {
    if (tenantId) {
      fetchUsers();
    }
  }, [tenantId, fetchUsers]);

  // Handle approve onboarding
  const handleApproveOnboarding = async () => {
    if (!onboarding?.session?.id) return;
    setActionLoading(true);
    try {
      await superAdminAPI.approveOnboarding(onboarding.session.id);
      await fetchTenant();
    } catch (err) {
      console.error("Failed to approve onboarding:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject onboarding
  const handleRejectOnboarding = async () => {
    if (!onboarding?.session?.id) return;
    setActionLoading(true);
    try {
      await superAdminAPI.rejectOnboarding(onboarding.session.id, rejectReason);
      setRejectDialogOpen(false);
      setRejectReason("");
      await fetchTenant();
    } catch (err) {
      console.error("Failed to reject onboarding:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!tenant) return;
    try {
      await superAdminAPI.updateTenant(tenant.id, editForm);
      fetchTenant();
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto" />
          <p className="text-white/60">Loading tenant details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tenant) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 p-6 max-w-md">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
            <h3 className="font-semibold text-red-200">
              {error || "Tenant not found"}
            </h3>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={fetchTenant}>Try Again</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Calculate onboarding progress
  const onboardingProgress = onboarding?.checklist
    ? Object.values(onboarding.checklist).filter(Boolean).length
    : 0;
  const totalOnboardingSteps = 11;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/super-admin/tenants")}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
      </div>

      {/* Tenant Overview */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold">
                    {tenant.display_name}
                  </h1>
                  <Badge
                    className={cn(
                      "gap-1.5",
                      statusConfig[tenant.status]?.className
                    )}
                  >
                    {statusConfig[tenant.status]?.icon}
                    {statusConfig[tenant.status]?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    {tenant.code}
                  </span>
                  {tenant.contact_email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {tenant.contact_email}
                    </span>
                  )}
                  {tenant.contact_phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {tenant.contact_phone}
                    </span>
                  )}
                </div>
                {tenant.brand_tagline && (
                  <p className="text-white/50 mt-2">{tenant.brand_tagline}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-white/20">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle>Edit Tenant</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Update tenant information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Display Name</Label>
                      <Input
                        value={editForm.display_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            display_name: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Name</Label>
                      <Input
                        value={editForm.contact_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contact_name: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input
                        value={editForm.contact_email}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contact_email: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input
                        value={editForm.contact_phone}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contact_phone: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand Tagline</Label>
                      <Textarea
                        value={editForm.brand_tagline}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            brand_tagline: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10"
                        rows={2}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditDialogOpen(false)}
                      className="border-white/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="border-white/20">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white/10"
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="onboarding"
            className="data-[state=active]:bg-white/10"
          >
            <FileText className="h-4 w-4 mr-2" />
            Onboarding
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-white/10"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-white/10"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-white/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tenant Details */}
            <Card className="bg-white/5 border-white/10 lg:col-span-2">
              <CardHeader>
                <CardTitle>Tenant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/50">Tenant ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{tenant.id}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(tenant.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Tenant Code</p>
                    <p className="font-mono text-sm">{tenant.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Type</p>
                    <p>{tenant.tenant_kind || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Plan</p>
                    <p>{tenant.plan_id || "No plan assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Timezone</p>
                    <p>{tenant.timezone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Locale</p>
                    <p>{tenant.locale}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Created</p>
                    <p>{new Date(tenant.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Last Updated</p>
                    <p>{new Date(tenant.updated_at).toLocaleDateString()}</p>
                  </div>
                  {tenant.go_live_at && (
                    <div>
                      <p className="text-sm text-white/50">Go-Live Date</p>
                      <p>{new Date(tenant.go_live_at).toLocaleDateString()}</p>
                    </div>
                  )}
                  {tenant.legal_name && (
                    <div>
                      <p className="text-sm text-white/50">Legal Name</p>
                      <p>{tenant.legal_name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white/60">
                    Onboarding Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-semibold">
                      {Math.round(
                        (onboardingProgress / totalOnboardingSteps) * 100
                      )}
                      %
                    </span>
                    <span className="text-white/50">
                      {onboardingProgress}/{totalOnboardingSteps} steps
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${
                          (onboardingProgress / totalOnboardingSteps) * 100
                        }%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white/60">
                    Feature Flags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(tenant.feature_flags || {})
                    .slice(0, 5)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-white/70">
                          {key.replace(/_/g, " ")}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            value
                              ? "border-emerald-500/50 text-emerald-300"
                              : "border-white/20 text-white/50"
                          )}
                        >
                          {value ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  {Object.keys(tenant.feature_flags || {}).length === 0 && (
                    <p className="text-white/50 text-sm">
                      No feature flags configured
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white/60">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tenant.contact_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-white/50" />
                      <span>{tenant.contact_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-white/50" />
                    <span>{tenant.contact_email}</span>
                  </div>
                  {tenant.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-white/50" />
                      <span>{tenant.contact_phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onboarding Tab */}
        <TabsContent value="onboarding" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription className="text-white/60">
                Track the hospital&apos;s setup and configuration progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {onboarding ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Current Step</p>
                      <p className="font-semibold">
                        {onboarding.session.current_step}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Status</p>
                      <Badge variant="outline">
                        {onboarding.session.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Can Submit</p>
                      <Badge
                        className={
                          onboarding.can_submit
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-white/10"
                        }
                      >
                        {onboarding.can_submit ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(onboarding.checklist).map(
                      ([step, complete], idx) => (
                        <div
                          key={step}
                          className={cn(
                            "p-3 rounded-lg border",
                            complete
                              ? "bg-emerald-500/10 border-emerald-500/30"
                              : "bg-white/5 border-white/10"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {complete ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-white/30" />
                            )}
                            <span className="text-sm">Step {idx}</span>
                          </div>
                          <p className="text-xs text-white/50 mt-1">
                            {step.replace(/_/g, " ")}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {onboarding.session.status === "submitted" && (
                    <div className="flex gap-3 pt-4">
                      <Button 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleApproveOnboarding}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        )}
                        Approve Onboarding
                      </Button>
                      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            disabled={actionLoading}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-white/10">
                          <DialogHeader>
                            <DialogTitle>Reject Onboarding</DialogTitle>
                            <DialogDescription className="text-white/60">
                              Provide a reason for rejecting this onboarding application
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Label>Rejection Reason</Label>
                            <Textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Enter the reason for rejection..."
                              className="mt-2 bg-white/5 border-white/10"
                              rows={4}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setRejectDialogOpen(false)}
                              className="border-white/20"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleRejectOnboarding}
                              disabled={actionLoading}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {actionLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Confirm Rejection
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">
                    No onboarding session found for this tenant
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Tenant Users</CardTitle>
                  <CardDescription className="text-white/60">
                    Users associated with this tenant ({users.length} total)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hospital_admin">Hospital Admin</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                    <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
                    className="border-white/20"
                    disabled={usersLoading}
                  >
                    {usersLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Refresh"
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No users found for this tenant</p>
                  <p className="text-white/40 text-sm mt-1">
                    Users will appear here once they are created
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/70">User</TableHead>
                        <TableHead className="text-white/70">Type</TableHead>
                        <TableHead className="text-white/70">Status</TableHead>
                        <TableHead className="text-white/70">Created</TableHead>
                        <TableHead className="text-white/70">Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-9 w-9 rounded-full flex items-center justify-center",
                                user.user_type === "doctor" ? "bg-blue-500/20" :
                                user.user_type === "patient" ? "bg-green-500/20" :
                                user.user_type === "hospital_admin" ? "bg-purple-500/20" :
                                "bg-white/10"
                              )}>
                                {user.user_type === "doctor" ? (
                                  <Stethoscope className="h-4 w-4 text-blue-400" />
                                ) : user.user_type === "patient" ? (
                                  <User className="h-4 w-4 text-green-400" />
                                ) : user.user_type === "hospital_admin" ? (
                                  <Shield className="h-4 w-4 text-purple-400" />
                                ) : (
                                  <UserCheck className="h-4 w-4 text-white/70" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{user.display_name || "—"}</p>
                                <p className="text-sm text-white/50">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-white/20 capitalize">
                              {user.user_type?.replace(/_/g, " ") || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "gap-1.5",
                              user.status === "active" ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/20" :
                              user.status === "inactive" ? "bg-slate-500/20 text-slate-200 border-slate-500/20" :
                              user.status === "suspended" ? "bg-red-500/20 text-red-200 border-red-500/20" :
                              "bg-white/10"
                            )}>
                              {user.status === "active" && <CheckCircle2 className="h-3 w-3" />}
                              {user.status === "inactive" && <XCircle className="h-3 w-3" />}
                              {user.status === "suspended" && <AlertTriangle className="h-3 w-3" />}
                              {user.status || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/60">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell className="text-white/60">
                            {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Never"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription className="text-white/60">
                Subscription and payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-white/50 mb-2">Plan</p>
                  <p className="font-semibold">
                    {tenant.plan_id || "No plan assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-2">Billing Contact</p>
                  <pre className="text-sm bg-white/5 p-3 rounded-lg overflow-auto">
                    {JSON.stringify(tenant.billing_contact || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Tenant Settings</CardTitle>
              <CardDescription className="text-white/60">
                Configuration and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-white/50 mb-2">Metadata</p>
                <pre className="text-sm bg-white/5 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(tenant.metadata || {}, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-sm text-white/50 mb-2">Feature Flags</p>
                <pre className="text-sm bg-white/5 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(tenant.feature_flags || {}, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
