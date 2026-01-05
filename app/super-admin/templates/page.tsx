"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LayoutTemplate,
  Plus,
  Edit,
  Trash2,
  Building2,
  Code,
  CheckCircle,
  Eye,
  Palette,
  Layers,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Template {
  id: string;
  code: string;
  name: string;
  description?: string;
  version_tag: string;
  capabilities: Record<string, any>;
  is_active: boolean;
  tenant_count: number;
  created_at: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  const fetchTemplates = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/templates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      } else {
        setError("Failed to fetch templates");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const createTemplate = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/templates`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          description: formData.description || null,
          capabilities: {},
        }),
      });

      if (res.ok) {
        setShowCreateDialog(false);
        setFormData({ code: "", name: "", description: "" });
        fetchTemplates();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to create template");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const archiveTemplate = async (id: string) => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    if (!confirm("Are you sure you want to archive this template?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/templates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok || res.status === 204) {
        fetchTemplates();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to archive template");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const activeTemplates = templates.filter((t) => t.is_active);
  const totalTenants = templates.reduce((sum, t) => sum + t.tenant_count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <LayoutTemplate className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Template Catalog</h1>
            <p className="text-gray-500">Hospital website templates and themes</p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>
                Add a new hospital website template to the catalog
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Template Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., modern-clinic"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500">
                  Unique identifier (lowercase, no spaces)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Modern Clinic Theme"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the template..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createTemplate}
                disabled={!formData.code || !formData.name || creating}
              >
                {creating ? "Creating..." : "Create Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Templates</p>
                <p className="text-3xl font-bold">{templates.length}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-full">
                <Layers className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Templates</p>
                <p className="text-3xl font-bold text-green-600">
                  {activeTemplates.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Deployments</p>
                <p className="text-3xl font-bold">{totalTenants}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg per Template</p>
                <p className="text-3xl font-bold">
                  {templates.length > 0
                    ? Math.round(totalTenants / templates.length)
                    : 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {template.code}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      v{template.version_tag}
                    </Badge>
                  </div>
                </div>
                <Badge variant={template.is_active ? "default" : "secondary"}>
                  {template.is_active ? "Active" : "Archived"}
                </Badge>
              </div>
              {template.description && (
                <CardDescription className="mt-2">
                  {template.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Preview placeholder */}
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <LayoutTemplate className="h-12 w-12 text-gray-400" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {template.tenant_count}
                    </p>
                    <p className="text-xs text-gray-500">Active Sites</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold">
                      {Object.keys(template.capabilities).length}
                    </p>
                    <p className="text-xs text-gray-500">Features</p>
                  </div>
                </div>

                {/* Capabilities */}
                {Object.keys(template.capabilities).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(template.capabilities).slice(0, 4).map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {Object.keys(template.capabilities).length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(template.capabilities).length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {template.tenant_count === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => archiveTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {templates.length === 0 && !loading && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <LayoutTemplate className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Templates Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first hospital website template to get started.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Templates Table (alternative view) */}
      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deployments</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        {template.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {template.code}
                      </Badge>
                    </TableCell>
                    <TableCell>v{template.version_tag}</TableCell>
                    <TableCell>
                      <Badge
                        variant={template.is_active ? "default" : "secondary"}
                      >
                        {template.is_active ? "Active" : "Archived"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {template.tenant_count}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(template.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
