"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Save,
  X,
  Check,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Types
interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  setting_type: "string" | "number" | "boolean" | "json";
  description: string | null;
  is_public: boolean;
  updated_by: string | null;
  updated_at: string;
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

async function fetchSettings(params: { is_public?: boolean; search?: string }): Promise<SystemSetting[]> {
  const searchParams = new URLSearchParams();
  if (params.is_public !== undefined) searchParams.append("is_public", String(params.is_public));
  if (params.search) searchParams.append("search", params.search);
  
  const response = await fetch(`${BASE_URL}/settings?${searchParams}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Settings fetch error:", response.status, errorText);
    throw new Error(`Failed to fetch settings: ${response.status}`);
  }
  return response.json();
}

async function createSetting(data: {
  setting_key: string;
  setting_value: unknown;
  setting_type: string;
  description?: string;
  is_public: boolean;
}): Promise<SystemSetting> {
  const response = await fetch(`${BASE_URL}/settings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to create setting");
  }
  return response.json();
}

async function updateSetting(key: string, data: {
  setting_value?: unknown;
  setting_type?: string;
  description?: string;
  is_public?: boolean;
}): Promise<SystemSetting> {
  const response = await fetch(`${BASE_URL}/settings/${encodeURIComponent(key)}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to update setting");
  }
  return response.json();
}

async function deleteSetting(key: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/settings/${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete setting");
}

// Formatting helpers
const formatValue = (value: unknown, type: string): string => {
  if (type === "json" || typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

const parseValue = (value: string, type: string): unknown => {
  switch (type) {
    case "number":
      return Number(value);
    case "boolean":
      return value.toLowerCase() === "true";
    case "json":
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null);
  
  // Form state
  const [formKey, setFormKey] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formType, setFormType] = useState<string>("string");
  const [formDescription, setFormDescription] = useState("");
  const [formIsPublic, setFormIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load data
  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchSettings({ search: search || undefined });
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Handle search
  const handleSearch = () => {
    loadSettings();
  };

  // Open create dialog
  const openCreateDialog = () => {
    setFormKey("");
    setFormValue("");
    setFormType("string");
    setFormDescription("");
    setFormIsPublic(false);
    setCreateDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (setting: SystemSetting) => {
    setSelectedSetting(setting);
    setFormValue(formatValue(setting.setting_value, setting.setting_type));
    setFormType(setting.setting_type);
    setFormDescription(setting.description || "");
    setFormIsPublic(setting.is_public);
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (setting: SystemSetting) => {
    setSelectedSetting(setting);
    setDeleteDialogOpen(true);
  };

  // Handle create
  const handleCreate = async () => {
    if (!formKey.trim()) return;
    
    setSaving(true);
    try {
      await createSetting({
        setting_key: formKey,
        setting_value: parseValue(formValue, formType),
        setting_type: formType,
        description: formDescription || undefined,
        is_public: formIsPublic,
      });
      setCreateDialogOpen(false);
      loadSettings();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create setting");
    } finally {
      setSaving(false);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!selectedSetting) return;
    
    setSaving(true);
    try {
      await updateSetting(selectedSetting.setting_key, {
        setting_value: parseValue(formValue, formType),
        setting_type: formType,
        description: formDescription || undefined,
        is_public: formIsPublic,
      });
      setEditDialogOpen(false);
      loadSettings();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update setting");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedSetting) return;
    
    setSaving(true);
    try {
      await deleteSetting(selectedSetting.setting_key);
      setDeleteDialogOpen(false);
      loadSettings();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete setting");
    } finally {
      setSaving(false);
    }
  };

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "string":
        return "bg-blue-500/20 text-blue-300 border-blue-500/20";
      case "number":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/20";
      case "boolean":
        return "bg-purple-500/20 text-purple-300 border-purple-500/20";
      case "json":
        return "bg-orange-500/20 text-orange-300 border-orange-500/20";
      default:
        return "bg-white/10 text-white/70";
    }
  };

  if (loading && settings.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto" />
          <p className="text-white/60">Loading settings...</p>
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
            <Settings className="h-7 w-7 text-emerald-400" />
            Platform Settings
          </h1>
          <p className="text-white/60 mt-1">
            Manage global platform configuration and settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={loadSettings}
            disabled={loading}
            className="border-white/20"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Setting
          </Button>
        </div>
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

      {/* Search */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search by key or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            System Settings ({settings.length})
          </CardTitle>
          <CardDescription className="text-white/50">
            Configure platform-wide settings and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {settings.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No settings found</p>
              <p className="text-white/40 text-sm mt-1">Create your first setting to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/70">Key</TableHead>
                  <TableHead className="text-white/70">Value</TableHead>
                  <TableHead className="text-white/70">Type</TableHead>
                  <TableHead className="text-white/70">Visibility</TableHead>
                  <TableHead className="text-white/70">Updated</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">{setting.setting_key}</p>
                        {setting.description && (
                          <p className="text-xs text-white/50 mt-0.5 truncate max-w-[200px]">
                            {setting.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-white/5 px-2 py-1 rounded truncate max-w-[200px] inline-block">
                        {typeof setting.setting_value === "object"
                          ? JSON.stringify(setting.setting_value)
                          : String(setting.setting_value)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadgeColor(setting.setting_type)}>
                        {setting.setting_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {setting.is_public ? (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/20">
                          <Eye className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge className="bg-white/10 text-white/70">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-white/70">
                          {new Date(setting.updated_at).toLocaleDateString()}
                        </p>
                        {setting.updated_by && (
                          <p className="text-xs text-white/50 truncate max-w-[120px]">
                            by {setting.updated_by}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(setting)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(setting)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle>Create Setting</DialogTitle>
            <DialogDescription className="text-white/60">
              Add a new platform setting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Setting Key</Label>
              <Input
                value={formKey}
                onChange={(e) => setFormKey(e.target.value)}
                placeholder="e.g., platform.max_tenants"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              {formType === "json" ? (
                <Textarea
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="bg-white/5 border-white/10 font-mono text-sm"
                  rows={4}
                />
              ) : formType === "boolean" ? (
                <Select value={formValue} onValueChange={setFormValue}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={formType === "number" ? "number" : "text"}
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder={formType === "number" ? "0" : "Enter value"}
                  className="bg-white/5 border-white/10"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe what this setting does..."
                className="bg-white/5 border-white/10"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formIsPublic}
                onCheckedChange={setFormIsPublic}
              />
              <Label>Make setting public (visible to clients)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-white/20">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formKey.trim() || saving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription className="text-white/60">
              Update <code className="text-emerald-400">{selectedSetting?.setting_key}</code>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              {formType === "json" ? (
                <Textarea
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="bg-white/5 border-white/10 font-mono text-sm"
                  rows={6}
                />
              ) : formType === "boolean" ? (
                <Select value={formValue} onValueChange={setFormValue}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={formType === "number" ? "number" : "text"}
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="bg-white/5 border-white/10"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formIsPublic}
                onCheckedChange={setFormIsPublic}
              />
              <Label>Make setting public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-white/20">
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Setting</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete <code className="text-red-400">{selectedSetting?.setting_key}</code>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
