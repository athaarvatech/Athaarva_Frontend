"use client";

import React from "react";
import { motion } from "framer-motion";
import { Palette, FileText, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { FileUploadZone } from "../widgets/FileUploadZone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const COLOR_PRESETS = [
  { name: "Healthcare Teal", primary: "#007C7C", secondary: "#20B2AA" },
  { name: "Medical Blue", primary: "#1E40AF", secondary: "#3B82F6" },
  { name: "Wellness Green", primary: "#059669", secondary: "#10B981" },
  { name: "Premium Purple", primary: "#7C3AED", secondary: "#8B5CF6" },
];

const DEFAULT_COLORS = { primary: "#007C7C", secondary: "#20B2AA" };

export default function BrandingStudioStep() {
  const { data, updateData } = useHospitalOnboarding();
  const branding = data.branding;

  const applyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    updateData("branding", {
      colors: {
        primary: preset.primary,
        secondary: preset.secondary,
      },
    });
  };

  const resetColors = () => {
    updateData("branding", {
      colors: DEFAULT_COLORS,
    });
  };

  const updateReportHeader = (field: string, value: boolean | string) => {
    updateData("branding", {
      report_header: {
        ...(branding?.report_header || {}),
        [field]: value,
      },
    });
  };

  const updateReportFooter = (field: string, value: boolean | string) => {
    updateData("branding", {
      report_footer: {
        ...(branding?.report_footer || {}),
        [field]: value,
      },
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
          <Palette className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Branding & Report Configuration
          </h2>
          <p className="text-gray-600">
            Configure your hospital logo, colors, and document headers for
            invoices and prescriptions
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 1: Logo & Brand Colors
      ═══════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Logo & Brand Colors
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Logo Upload */}
          <div className="md:col-span-2">
            <FileUploadZone
              label="Hospital Logo"
              description="Upload your hospital logo for invoices, prescriptions, and reports (PNG, JPG, or SVG, max 2MB)"
              currentFile={branding?.logo_file}
              currentUrl={branding?.logo_url}
              onFileSelect={(file) =>
                updateData("branding", { logo_file: file })
              }
              onFileRemove={() =>
                updateData("branding", { logo_file: null, logo_url: "" })
              }
              onUploadComplete={(url) =>
                updateData("branding", { logo_url: url })
              }
              accept="image/*"
              maxSizeMB={2}
              preview
            />
          </div>

          {/* Logo Size on Documents */}
          <div className="space-y-2">
            <Label>Logo Size on Documents</Label>
            <Select
              value={branding?.logo_size || "medium"}
              onValueChange={(value: "small" | "medium" | "large") =>
                updateData("branding", { logo_size: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (40px height)</SelectItem>
                <SelectItem value="medium">Medium (60px height)</SelectItem>
                <SelectItem value="large">Large (80px height)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Favicon (Optional) */}
          <div className="space-y-2">
            <FileUploadZone
              label="Favicon (Optional)"
              description="Small icon for browser tabs"
              currentFile={branding?.favicon_file}
              currentUrl={branding?.favicon_url}
              onFileSelect={(file) =>
                updateData("branding", { favicon_file: file })
              }
              onFileRemove={() =>
                updateData("branding", { favicon_file: null, favicon_url: "" })
              }
              onUploadComplete={(url) =>
                updateData("branding", { favicon_url: url })
              }
              accept="image/png,image/x-icon"
              maxSizeMB={1}
              preview={false}
            />
          </div>
        </div>

        {/* Color Selection */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-700">
              Brand Colors
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={resetColors}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          {/* Color Preview Card */}
          <div className="mb-6 rounded-lg border-2 border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white">
            <p className="text-xs font-medium text-gray-600 mb-3">Color Preview</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-2">
                <div
                  className="h-16 rounded-lg shadow-sm transition-colors duration-200"
                  style={{ backgroundColor: branding?.colors?.primary || DEFAULT_COLORS.primary }}
                />
                <p className="text-xs text-center font-medium text-gray-700">Primary</p>
              </div>
              <div className="flex-1 space-y-2">
                <div
                  className="h-16 rounded-lg shadow-sm transition-colors duration-200"
                  style={{ backgroundColor: branding?.colors?.secondary || DEFAULT_COLORS.secondary }}
                />
                <p className="text-xs text-center font-medium text-gray-700">Secondary</p>
              </div>
              <div className="flex-1 space-y-2">
                <div
                  className="h-16 rounded-lg shadow-sm flex items-center justify-center text-white font-semibold transition-colors duration-200"
                  style={{ backgroundColor: branding?.colors?.primary || DEFAULT_COLORS.primary }}
                >
                  Button
                </div>
                <p className="text-xs text-center font-medium text-gray-700">On Primary</p>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-all"
              >
                <div className="flex space-x-1 mb-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: preset.secondary }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding?.colors?.primary || DEFAULT_COLORS.primary}
                  onChange={(e) =>
                    updateData("branding", {
                      colors: { ...(branding?.colors || {}), primary: e.target.value },
                    })
                  }
                  className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={branding?.colors?.primary || DEFAULT_COLORS.primary}
                  onChange={(e) =>
                    updateData("branding", {
                      colors: { ...(branding?.colors || {}), primary: e.target.value },
                    })
                  }
                  placeholder="#007C7C"
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding?.colors?.secondary || DEFAULT_COLORS.secondary}
                  onChange={(e) =>
                    updateData("branding", {
                      colors: { ...(branding?.colors || {}), secondary: e.target.value },
                    })
                  }
                  className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={branding?.colors?.secondary || DEFAULT_COLORS.secondary}
                  onChange={(e) =>
                    updateData("branding", {
                      colors: { ...(branding?.colors || {}), secondary: e.target.value },
                    })
                  }
                  placeholder="#20B2AA"
                  className="flex-1 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 2: Report Header Configuration
      ═══════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Report Header Configuration
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Configure what appears in the header of invoices, prescriptions, and
          medical reports
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Header Elements */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">
              Header Elements
            </h4>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <Label>Show Logo</Label>
                <p className="text-xs text-gray-500">
                  Display hospital logo in header
                </p>
              </div>
              <Switch
                checked={branding?.report_header?.show_logo ?? false}
                onCheckedChange={(checked) =>
                  updateReportHeader("show_logo", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <Label>Show Address</Label>
                <p className="text-xs text-gray-500">
                  Display hospital address
                </p>
              </div>
              <Switch
                checked={branding?.report_header?.show_address ?? false}
                onCheckedChange={(checked) =>
                  updateReportHeader("show_address", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <Label>Show Phone Number</Label>
                <p className="text-xs text-gray-500">Display contact numbers</p>
              </div>
              <Switch
                checked={branding?.report_header?.show_phone ?? false}
                onCheckedChange={(checked) =>
                  updateReportHeader("show_phone", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <Label>Show Registration Numbers</Label>
                <p className="text-xs text-gray-500">
                  Display registration/GSTIN
                </p>
              </div>
              <Switch
                checked={branding?.report_header?.show_registration ?? false}
                onCheckedChange={(checked) =>
                  updateReportHeader("show_registration", checked)
                }
              />
            </div>
          </div>

          {/* Tagline & Document Formats */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hospital Tagline (Optional)</Label>
              <Input
                value={branding?.report_header?.tagline || ""}
                onChange={(e) => updateReportHeader("tagline", e.target.value)}
                placeholder="e.g., Caring for you, always"
              />
              <p className="text-xs text-gray-500">
                Appears below the hospital name in document headers
              </p>
            </div>

            <div className="space-y-2">
              <Label>Prescription Header Format</Label>
              <Select
                value={branding?.prescription_header_format || "standard"}
                onValueChange={(value: "standard" | "compact" | "detailed") =>
                  updateData("branding", { prescription_header_format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="compact">Compact (Less space)</SelectItem>
                  <SelectItem value="detailed">Detailed (Full info)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Invoice Header Format</Label>
              <Select
                value={branding?.invoice_header_format || "standard"}
                onValueChange={(value: "standard" | "detailed") =>
                  updateData("branding", { invoice_header_format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="detailed">
                    Detailed (with GST breakdown)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Document Watermark (Optional)</Label>
              <Input
                value={branding?.watermark_text || ""}
                onChange={(e) =>
                  updateData("branding", { watermark_text: e.target.value })
                }
                placeholder="e.g., CONFIDENTIAL"
              />
              <p className="text-xs text-gray-500">
                Light watermark text on printed documents
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 3: Report Footer Configuration
      ═══════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Report Footer Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Footer Disclaimer Text (Optional)</Label>
            <Textarea
              value={branding?.report_footer?.disclaimer_text || ""}
              onChange={(e) =>
                updateReportFooter("disclaimer_text", e.target.value)
              }
              placeholder="e.g., This document is computer generated and does not require a signature. For any queries, please contact the hospital administration."
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Legal disclaimer that appears at the bottom of printed documents
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 h-fit">
            <div>
              <Label>Show Signatory Line</Label>
              <p className="text-xs text-gray-500">
                Add a signature line for authorized personnel
              </p>
            </div>
            <Switch
              checked={branding?.report_footer?.signatory_line ?? false}
              onCheckedChange={(checked) =>
                updateReportFooter("signatory_line", checked)
              }
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
