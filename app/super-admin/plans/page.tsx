"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  Loader2,
  AlertTriangle,
  IndianRupee,
  Calendar,
  Search,
  MoreVertical,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Types
interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  billing_cycle: string;
  base_price: number;
  currency: string;
  feature_set: Record<string, boolean | number | string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tenant_count: number;
}

interface PlanFormData {
  code: string;
  name: string;
  description: string;
  billing_cycle: string;
  base_price: number;
  currency: string;
  is_active: boolean;
  feature_set: Record<string, boolean | number | string>;
}

// API helpers
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("super_admin_token")
      : null;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v2/super-admin";

async function fetchPlans(isActive?: boolean): Promise<Plan[]> {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append("is_active", String(isActive));
  const response = await fetch(`${BASE_URL}/plans?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch plans");
  return response.json();
}

async function createPlan(data: PlanFormData): Promise<Plan> {
  const response = await fetch(`${BASE_URL}/plans`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create plan");
  }
  return response.json();
}

async function updatePlan(
  planId: string,
  data: Partial<PlanFormData>
): Promise<Plan> {
  const response = await fetch(`${BASE_URL}/plans/${planId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update plan");
  }
  return response.json();
}

async function archivePlan(planId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/plans/${planId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to archive plan");
  }
}

// Default feature set template
const DEFAULT_FEATURES = {
  max_doctors: 10,
  max_patients: 1000,
  max_storage_gb: 10,
  telehealth: true,
  appointments: true,
  prescriptions: true,
  medical_records: true,
  billing: true,
  analytics: false,
  api_access: false,
  white_label: false,
  priority_support: false,
};

const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined
  );

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<PlanFormData>({
    code: "",
    name: "",
    description: "",
    billing_cycle: "monthly",
    base_price: 0,
    currency: "INR",
    is_active: true,
    feature_set: { ...DEFAULT_FEATURES },
  });

  // Load plans
  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await fetchPlans(filterActive);
      setPlans(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load plans:", err);
      setError("Failed to load plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterActive]);

  // Handle create
  const handleCreate = async () => {
    setSaving(true);
    try {
      await createPlan(formData);
      setCreateDialogOpen(false);
      resetForm();
      loadPlans();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create plan");
    } finally {
      setSaving(false);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!selectedPlan) return;
    setSaving(true);
    try {
      await updatePlan(selectedPlan.id, formData);
      setEditDialogOpen(false);
      setSelectedPlan(null);
      resetForm();
      loadPlans();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update plan");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPlan) return;
    setSaving(true);
    try {
      await archivePlan(selectedPlan.id);
      setDeleteDialogOpen(false);
      setSelectedPlan(null);
      loadPlans();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to archive plan");
    } finally {
      setSaving(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({
      code: plan.code,
      name: plan.name,
      description: plan.description || "",
      billing_cycle: plan.billing_cycle,
      base_price: plan.base_price,
      currency: plan.currency,
      is_active: plan.is_active,
      feature_set: { ...DEFAULT_FEATURES, ...plan.feature_set },
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      billing_cycle: "monthly",
      base_price: 0,
      currency: "INR",
      is_active: true,
      feature_set: { ...DEFAULT_FEATURES },
    });
  };

  // Update feature
  const updateFeature = (key: string, value: boolean | number | string) => {
    setFormData((prev) => ({
      ...prev,
      feature_set: { ...prev.feature_set, [key]: value },
    }));
  };

  // Filter plans
  const filteredPlans = plans.filter((plan) => {
    if (search) {
      const query = search.toLowerCase();
      return (
        plan.name.toLowerCase().includes(query) ||
        plan.code.toLowerCase().includes(query) ||
        (plan.description?.toLowerCase().includes(query) ?? false)
      );
    }
    return true;
  });

  // Format price
  const formatPrice = (price: number, currency: string, cycle: string) => {
    const symbol = currency === "INR" ? "₹" : "$";
    const suffix =
      cycle === "monthly" ? "/mo" : cycle === "quarterly" ? "/qtr" : "/yr";
    return `${symbol}${price.toLocaleString()}${suffix}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto" />
          <p className="text-white/60">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-3">
            <CreditCard className="h-7 w-7 text-emerald-400" />
            Plan Catalog
          </h1>
          <p className="text-white/60 mt-1">
            Manage subscription plans and pricing for tenants
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
              <DialogDescription className="text-white/60">
                Define a new subscription plan with features and pricing
              </DialogDescription>
            </DialogHeader>
            <PlanForm
              formData={formData}
              setFormData={setFormData}
              updateFeature={updateFeature}
              isEdit={false}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
                className="border-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={saving || !formData.code || !formData.name}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
            <Select
              value={filterActive === undefined ? "all" : String(filterActive)}
              onValueChange={(v) =>
                setFilterActive(v === "all" ? undefined : v === "true")
              }
            >
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="true">Active Only</SelectItem>
                <SelectItem value="false">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "bg-white/5 border-white/10 hover:border-white/20 transition-colors",
              !plan.is_active && "opacity-60"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mb-2",
                      plan.is_active
                        ? "border-emerald-500/50 text-emerald-300"
                        : "border-white/20 text-white/50"
                    )}
                  >
                    {plan.is_active ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {plan.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-white/50 text-xs font-mono">
                    {plan.code}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-slate-900 border-white/10"
                  >
                    <DropdownMenuItem onClick={() => openEditDialog(plan)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(plan)}
                      className="text-red-400"
                      disabled={plan.tenant_count > 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {formatPrice(
                    plan.base_price,
                    plan.currency,
                    plan.billing_cycle
                  )}
                </span>
              </div>
              {plan.description && (
                <p className="text-sm text-white/60 line-clamp-2">
                  {plan.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {plan.tenant_count} tenant{plan.tenant_count !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {plan.billing_cycle}
                </span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/50 mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(plan.feature_set)
                    .filter(([, v]) => v === true)
                    .slice(0, 4)
                    .map(([key]) => (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="text-[10px] bg-white/10"
                      >
                        {key.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  {Object.entries(plan.feature_set).filter(
                    ([, v]) => v === true
                  ).length > 4 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-white/10"
                    >
                      +
                      {Object.entries(plan.feature_set).filter(
                        ([, v]) => v === true
                      ).length - 4}{" "}
                      more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPlans.length === 0 && (
          <Card className="bg-white/5 border-white/10 col-span-full py-12">
            <CardContent className="text-center">
              <CreditCard className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No plans found</p>
              <p className="text-white/40 text-sm mt-1">
                {search
                  ? "Try a different search term"
                  : "Create your first plan to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription className="text-white/60">
              Update plan details and features
            </DialogDescription>
          </DialogHeader>
          <PlanForm
            formData={formData}
            setFormData={setFormData}
            updateFeature={updateFeature}
            isEdit={true}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedPlan(null);
                resetForm();
              }}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              Update Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-red-400">Archive Plan</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to archive &quot;{selectedPlan?.name}&quot;?
              {selectedPlan?.tenant_count ? (
                <span className="block mt-2 text-red-400">
                  ⚠️ This plan has {selectedPlan.tenant_count} active tenant(s)
                  and cannot be archived.
                </span>
              ) : (
                " This action can be undone by a database administrator."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedPlan(null);
              }}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={saving || (selectedPlan?.tenant_count ?? 0) > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Archive Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Plan Form Component
function PlanForm({
  formData,
  setFormData,
  updateFeature,
  isEdit,
}: {
  formData: PlanFormData;
  setFormData: React.Dispatch<React.SetStateAction<PlanFormData>>;
  updateFeature: (key: string, value: boolean | number | string) => void;
  isEdit: boolean;
}) {
  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Plan Code</Label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="e.g., professional"
            className="bg-white/5 border-white/10 font-mono"
            disabled={isEdit}
          />
        </div>
        <div className="space-y-2">
          <Label>Plan Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Professional"
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Plan description..."
          className="bg-white/5 border-white/10"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Base Price</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="number"
              value={formData.base_price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  base_price: Number(e.target.value),
                }))
              }
              className="pl-9 bg-white/5 border-white/10"
              min={0}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(v) =>
              setFormData((prev) => ({ ...prev, currency: v }))
            }
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Billing Cycle</Label>
          <Select
            value={formData.billing_cycle}
            onValueChange={(v) =>
              setFormData((prev) => ({ ...prev, billing_cycle: v }))
            }
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {BILLING_CYCLES.map((cycle) => (
                <SelectItem key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <div>
          <Label>Active</Label>
          <p className="text-xs text-white/50">
            Plan is available for new subscriptions
          </p>
        </div>
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, is_active: checked }))
          }
        />
      </div>

      <div className="space-y-3">
        <Label>Features & Limits</Label>
        <div className="grid grid-cols-2 gap-3">
          {/* Numeric limits */}
          <div className="space-y-2 p-3 bg-white/5 rounded-lg">
            <Label className="text-xs">Max Doctors</Label>
            <Input
              type="number"
              value={(formData.feature_set.max_doctors as number) || 0}
              onChange={(e) =>
                updateFeature("max_doctors", Number(e.target.value))
              }
              className="bg-white/5 border-white/10 h-8"
              min={0}
            />
          </div>
          <div className="space-y-2 p-3 bg-white/5 rounded-lg">
            <Label className="text-xs">Max Patients</Label>
            <Input
              type="number"
              value={(formData.feature_set.max_patients as number) || 0}
              onChange={(e) =>
                updateFeature("max_patients", Number(e.target.value))
              }
              className="bg-white/5 border-white/10 h-8"
              min={0}
            />
          </div>
          <div className="space-y-2 p-3 bg-white/5 rounded-lg">
            <Label className="text-xs">Storage (GB)</Label>
            <Input
              type="number"
              value={(formData.feature_set.max_storage_gb as number) || 0}
              onChange={(e) =>
                updateFeature("max_storage_gb", Number(e.target.value))
              }
              className="bg-white/5 border-white/10 h-8"
              min={0}
            />
          </div>
        </div>

        {/* Boolean features */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "telehealth", label: "Telehealth" },
            { key: "appointments", label: "Appointments" },
            { key: "prescriptions", label: "Prescriptions" },
            { key: "medical_records", label: "Medical Records" },
            { key: "billing", label: "Billing" },
            { key: "analytics", label: "Analytics" },
            { key: "api_access", label: "API Access" },
            { key: "white_label", label: "White Label" },
            { key: "priority_support", label: "Priority Support" },
          ].map((feature) => (
            <div
              key={feature.key}
              className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
            >
              <span className="text-sm">{feature.label}</span>
              <Switch
                checked={formData.feature_set[feature.key] === true}
                onCheckedChange={(checked) =>
                  updateFeature(feature.key, checked)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
