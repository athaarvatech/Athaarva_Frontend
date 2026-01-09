"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Globe,
  FileText,
  Edit,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Layout,
  Home,
  Info,
  Phone,
  Briefcase,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CMSSection {
  id: string;
  section_key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  version: number;
  is_published: boolean;
  updated_by?: string;
  updated_at: string;
}

// Predefined CMS sections for athaarva.com
const SECTION_TEMPLATES = [
  {
    key: "hero",
    name: "Hero Section",
    icon: Home,
    fields: [
      { name: "title", type: "text", label: "Main Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "cta_text", type: "text", label: "CTA Button Text" },
      { name: "cta_link", type: "text", label: "CTA Button Link" },
      { name: "background_image", type: "text", label: "Background Image URL" },
    ],
  },
  {
    key: "about",
    name: "About Section",
    icon: Info,
    fields: [
      { name: "title", type: "text", label: "Section Title" },
      { name: "description", type: "textarea", label: "Description" },
      { name: "features", type: "textarea", label: "Features (one per line)" },
    ],
  },
  {
    key: "services",
    name: "Services",
    icon: Briefcase,
    fields: [
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      {
        name: "services_json",
        type: "textarea",
        label: "Services (JSON array)",
      },
    ],
  },
  {
    key: "contact",
    name: "Contact Info",
    icon: Phone,
    fields: [
      { name: "email", type: "text", label: "Email Address" },
      { name: "phone", type: "text", label: "Phone Number" },
      { name: "address", type: "textarea", label: "Address" },
      { name: "support_hours", type: "text", label: "Support Hours" },
    ],
  },
  {
    key: "footer",
    name: "Footer",
    icon: Layout,
    fields: [
      { name: "copyright", type: "text", label: "Copyright Text" },
      { name: "tagline", type: "text", label: "Tagline" },
      { name: "social_links", type: "textarea", label: "Social Links (JSON)" },
    ],
  },
];

export default function WebsiteCMSPage() {
  const [sections, setSections] = useState<CMSSection[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Editor state
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editContent, setEditContent] = useState<Record<string, any>>({});
  const [showEditor, setShowEditor] = useState(false);
  const [publishOnSave, setPublishOnSave] = useState(false);

  const fetchSections = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/cms/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSections(data);
      }
    } catch (err) {
      console.error("Failed to fetch CMS sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditor = (sectionKey: string) => {
    const existing = sections.find((s) => s.section_key === sectionKey);
    setSelectedSection(sectionKey);
    setEditContent(existing?.content || {});
    setPublishOnSave(existing?.is_published || false);
    setShowEditor(true);
  };

  const saveSection = async () => {
    if (!selectedSection) return;

    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/v2/super-admin/cms/sections/${selectedSection}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editContent,
            publish: publishOnSave,
          }),
        }
      );

      if (res.ok) {
        setShowEditor(false);
        fetchSections();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to save section");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const getSectionData = (key: string) => {
    return sections.find((s) => s.section_key === key);
  };

  const getTemplate = (key: string) => {
    return SECTION_TEMPLATES.find((t) => t.key === key);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Globe className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Website CMS</h1>
            <p className="text-gray-500">Manage athaarva.com content</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <a
            href="https://athaarva.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Website
          </a>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sections</p>
                <p className="text-3xl font-bold">{SECTION_TEMPLATES.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Configured</p>
                <p className="text-3xl font-bold text-blue-600">
                  {sections.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {sections.filter((s) => s.is_published).length}
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
                <p className="text-sm text-gray-500">Draft</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {sections.filter((s) => !s.is_published).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTION_TEMPLATES.map((template) => {
          const data = getSectionData(template.key);
          const Icon = template.icon;

          return (
            <Card
              key={template.key}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                data
                  ? "border-l-4 border-l-green-500"
                  : "border-l-4 border-l-gray-200"
              }`}
              onClick={() => openEditor(template.key)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-500">{template.key}</p>
                    </div>
                  </div>
                  {data && (
                    <Badge
                      variant={data.is_published ? "default" : "secondary"}
                    >
                      {data.is_published ? "Published" : "Draft"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Field preview */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <p className="font-medium">{template.fields.length}</p>
                      <p className="text-xs text-gray-500">Fields</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <p className="font-medium">v{data?.version || 0}</p>
                      <p className="text-xs text-gray-500">Version</p>
                    </div>
                  </div>

                  {data && (
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(data.updated_at).toLocaleString()}
                      {data.updated_by && ` by ${data.updated_by}`}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditor(template.key);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {data ? "Edit Content" : "Configure"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {getTemplate(selectedSection || "")?.name || selectedSection}
            </DialogTitle>
            <DialogDescription>
              Update the content for this section
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {getTemplate(selectedSection || "")?.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={editContent[field.name] || ""}
                    onChange={(e) =>
                      setEditContent({
                        ...editContent,
                        [field.name]: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                ) : (
                  <Input
                    id={field.name}
                    value={editContent[field.name] || ""}
                    onChange={(e) =>
                      setEditContent({
                        ...editContent,
                        [field.name]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  id="publish"
                  checked={publishOnSave}
                  onCheckedChange={setPublishOnSave}
                />
                <Label htmlFor="publish">Publish immediately</Label>
              </div>
              <p className="text-sm text-gray-500">
                {publishOnSave
                  ? "Changes will be live on the website"
                  : "Changes will be saved as draft"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button onClick={saveSection} disabled={saving}>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Content Sections</CardTitle>
          <CardDescription>
            Overview of all website content sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Sections</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-2">
                {SECTION_TEMPLATES.map((template) => {
                  const data = getSectionData(template.key);
                  return (
                    <div
                      key={template.key}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <template.icon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {template.key}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {data ? (
                          <>
                            <Badge
                              variant={
                                data.is_published ? "default" : "secondary"
                              }
                            >
                              {data.is_published ? "Published" : "Draft"}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              v{data.version}
                            </span>
                          </>
                        ) : (
                          <Badge variant="outline">Not configured</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditor(template.key)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="published" className="mt-4">
              <div className="space-y-2">
                {sections
                  .filter((s) => s.is_published)
                  .map((section) => {
                    const template = getTemplate(section.section_key);
                    return (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {template && (
                            <template.icon className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium">
                            {template?.name || section.section_key}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-500">
                            Updated{" "}
                            {new Date(section.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {sections.filter((s) => s.is_published).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No published sections yet
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="draft" className="mt-4">
              <div className="space-y-2">
                {sections
                  .filter((s) => !s.is_published)
                  .map((section) => {
                    const template = getTemplate(section.section_key);
                    return (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {template && (
                            <template.icon className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium">
                            {template?.name || section.section_key}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditor(section.section_key)}
                          >
                            Publish
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                {sections.filter((s) => !s.is_published).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No draft sections
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
