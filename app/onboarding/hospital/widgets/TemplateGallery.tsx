"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Eye,
  Sparkles,
  Info,
  Building2,
  Video,
  Heart,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  TemplateData,
  CustomizedTemplateData,
} from "@/contexts/HospitalOnboardingContextV2";
import {
  TEMPLATE_BLUEPRINTS,
  type TemplateBlueprint,
} from "./templateBlueprints";
import { EditableTemplatePreviewRenderer } from "./EditableTemplatePreviewRenderer";
import { ThemeCustomizer } from "./ThemeCustomizer";
import {
  AhtarvaModernTemplate,
  PremiumMedicalTemplate,
  ModernHealthTechTemplate,
  HealthcareSaaSTemplate,
} from "./templates";

// Re-export for convenience
export type { CustomizedTemplateData } from "@/contexts/HospitalOnboardingContextV2";

interface TemplateGalleryProps {
  templates?: TemplateData[];
  selectedTemplate: CustomizedTemplateData | null;
  onSelectTemplate: (template: CustomizedTemplateData) => void;
  className?: string;
}

const MOCK_TEMPLATES: TemplateData[] = [
  {
    id: "ahtarva-modern",
    name: "Ahtarva Modern",
    version: "1.0",
    preview_snapshot_url: "/templates/ahtarva-modern.jpg",
    thumbnail_url: "/templates/ahtarva-modern-thumb.jpg",
    description:
      "Premium emerald green design with stunning glassmorphism effects, animated gradients, and modern healthcare aesthetics.",
    supported_modules: [
      "Appointments",
      "Doctor Profiles",
      "Departments",
      "Testimonials",
      "Statistics",
    ],
    recommended_for: [
      "Modern Hospitals",
      "Multi-specialty Clinics",
      "Premium Healthcare",
    ],
  },
  {
    id: "premium-medical",
    name: "Premium Medical",
    version: "1.0",
    preview_snapshot_url: "/templates/premium-medical.jpg",
    thumbnail_url: "/templates/premium-medical-thumb.jpg",
    description:
      "Soft-tech design with pastel accents, generous spacing, and elegant animations for a calming patient experience.",
    supported_modules: [
      "Patient Portal",
      "Wellness Programs",
      "Virtual Tours",
      "Health Checkups",
      "Telemedicine",
    ],
    recommended_for: [
      "Women's Health Centers",
      "Wellness Clinics",
      "Family Care",
    ],
  },
  {
    id: "modern-health-tech",
    name: "Modern Health Tech",
    version: "1.0",
    preview_snapshot_url: "/templates/modern-health-tech.jpg",
    thumbnail_url: "/templates/modern-health-tech-thumb.jpg",
    description:
      "Futuristic electric blue design with bento grid layouts, neon accents, and cutting-edge tech hospital aesthetics.",
    supported_modules: [
      "AI Diagnostics",
      "Robotic Surgery",
      "Remote Monitoring",
      "Digital Records",
      "Smart ICU",
    ],
    recommended_for: [
      "Tech-forward Hospitals",
      "Research Institutions",
      "Digital Health Systems",
    ],
  },
  {
    id: "healthcare-saas",
    name: "Healthcare SaaS",
    version: "1.0",
    preview_snapshot_url: "/templates/healthcare-saas.jpg",
    thumbnail_url: "/templates/healthcare-saas-thumb.jpg",
    description:
      "Corporate Google Green design with clean SaaS aesthetics, perfect for B2B healthcare platforms and enterprise solutions.",
    supported_modules: [
      "Enterprise Dashboard",
      "Multi-tenant Admin",
      "Analytics Suite",
      "API Integration",
      "White-label Options",
    ],
    recommended_for: [
      "Healthcare Enterprises",
      "Hospital Networks",
      "B2B Platforms",
    ],
  },
];

export function TemplateGallery({
  templates = MOCK_TEMPLATES,
  selectedTemplate,
  onSelectTemplate,
  className,
}: TemplateGalleryProps) {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateData | null>(
    null
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Choose Your Template
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Select a design that best represents your hospital&apos;s identity
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-healthcare-primary/10 text-healthcare-primary"
        >
          {templates.length} Templates
        </Badge>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => onSelectTemplate(template)}
            onPreview={() => setPreviewTemplate(template)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={(customizedData: CustomizedTemplateData) => {
            onSelectTemplate(customizedData);
            setPreviewTemplate(null);
          }}
          isSelected={selectedTemplate?.id === previewTemplate.id}
        />
      )}

      {/* Saved Customized Template Preview */}
      {selectedTemplate && selectedTemplate.customizedBlueprint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 border-t border-gray-200 pt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Check className="w-5 h-5 text-healthcare-primary" />
                Your Customized Website Preview
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Here&apos;s how your hospital website will look with your
                customizations
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const baseTemplate = templates.find(
                  (t) => t.id === selectedTemplate.id
                );
                if (baseTemplate) setPreviewTemplate(baseTemplate);
              }}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Edit Customizations
            </Button>
          </div>

          {/* Mini Preview */}
          <div className="bg-gray-100 rounded-2xl p-6 overflow-hidden">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-auto max-w-4xl">
              <div className="transform scale-[0.5] origin-top h-[400px] overflow-hidden">
                {selectedTemplate.id === "ahtarva-modern" ? (
                  <AhtarvaModernTemplate
                    blueprint={selectedTemplate.customizedBlueprint}
                    device="desktop"
                    onBlueprintChange={() => {}}
                    isEditMode={false}
                  />
                ) : selectedTemplate.id === "premium-medical" ? (
                  <PremiumMedicalTemplate
                    blueprint={selectedTemplate.customizedBlueprint}
                    device="desktop"
                    onBlueprintChange={() => {}}
                    isEditMode={false}
                  />
                ) : selectedTemplate.id === "modern-health-tech" ? (
                  <ModernHealthTechTemplate
                    blueprint={selectedTemplate.customizedBlueprint}
                    device="desktop"
                    onBlueprintChange={() => {}}
                    isEditMode={false}
                  />
                ) : selectedTemplate.id === "healthcare-saas" ? (
                  <HealthcareSaaSTemplate
                    blueprint={selectedTemplate.customizedBlueprint}
                    device="desktop"
                    onBlueprintChange={() => {}}
                    isEditMode={false}
                  />
                ) : (
                  <EditableTemplatePreviewRenderer
                    blueprint={selectedTemplate.customizedBlueprint}
                    device="desktop"
                    onBlueprintChange={() => {}}
                    isEditMode={false}
                  />
                )}
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Preview is scaled to 50%. Click &quot;Edit Customizations&quot; to
              see full size.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateData;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
}: TemplateCardProps) {
  const blueprint = TEMPLATE_BLUEPRINTS[template.id];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group relative bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer",
        isSelected
          ? "border-healthcare-primary shadow-lg ring-2 ring-healthcare-primary/20"
          : "border-gray-200 hover:border-healthcare-primary/50 hover:shadow-md"
      )}
      onClick={onSelect}
    >
      {/* Thumbnail - Mini Preview */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {blueprint ? (
          <MiniTemplatePreview blueprint={blueprint} templateId={template.id} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <Sparkles className="w-12 h-12" />
          </div>
        )}

        {template.locked && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-amber-500 text-white">
              <Check className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {template.name}
            </h4>
            <p className="text-xs text-gray-500">Version {template.version}</p>
          </div>
          {isSelected && (
            <div className="flex-shrink-0 w-6 h-6 bg-healthcare-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {template.description}
        </p>

        {/* Modules */}
        <div className="flex flex-wrap gap-1">
          {template.supported_modules.slice(0, 3).map((module) => (
            <Badge key={module} variant="outline" className="text-xs">
              {module}
            </Badge>
          ))}
          {template.supported_modules.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.supported_modules.length - 3}
            </Badge>
          )}
        </div>

        {/* Recommended For */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Best for:</p>
          <p className="text-xs text-gray-700 line-clamp-1">
            {template.recommended_for[0]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Mini Template Preview Component - Shows a visual representation in the card
function MiniTemplatePreview({
  blueprint,
  templateId,
}: {
  blueprint: TemplateBlueprint;
  templateId: string;
}) {
  const getTemplateStyle = () => {
    switch (templateId) {
      case "ahtarva-modern":
        return {
          gradient: "from-emerald-500 to-emerald-600",
          accent: "bg-emerald-500",
          style: "modern",
          icon: Building2,
          iconColor: "text-emerald-600",
        };
      case "premium-medical":
        return {
          gradient: "from-emerald-400 to-teal-500",
          accent: "bg-emerald-400",
          style: "premium",
          icon: Heart,
          iconColor: "text-emerald-500",
        };
      case "modern-health-tech":
        return {
          gradient: "from-blue-500 to-blue-600",
          accent: "bg-blue-500",
          style: "tech",
          icon: Video,
          iconColor: "text-blue-600",
        };
      case "healthcare-saas":
        return {
          gradient: "from-green-500 to-green-600",
          accent: "bg-green-500",
          style: "saas",
          icon: Building2,
          iconColor: "text-green-600",
        };
      default:
        return {
          gradient: "from-gray-500 to-gray-700",
          accent: "bg-gray-500",
          style: "default",
          icon: Sparkles,
          iconColor: "text-gray-600",
        };
    }
  };

  const style = getTemplateStyle();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Hero Section Mini */}
      <div
        className={cn(
          "h-[45%] bg-gradient-to-br",
          style.gradient,
          "p-3 relative"
        )}
      >
        {/* Navigation dots */}
        <div className="flex gap-1 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>

        {/* Hero content */}
        <div className="space-y-1">
          <div className="w-12 h-1 bg-white/40 rounded" />
          <div className="w-20 h-2 bg-white/90 rounded" />
          <div className="w-16 h-1.5 bg-white/70 rounded" />
        </div>

        {/* CTA buttons */}
        <div className="flex gap-1 mt-2">
          <div className="w-10 h-2 bg-white rounded-full" />
          <div className="w-8 h-2 border border-white/50 rounded-full" />
        </div>

        {/* Stats mini */}
        <div className="absolute bottom-2 left-3 right-3 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 bg-white/20 rounded p-1">
              <div className="w-4 h-1.5 bg-white/80 rounded mx-auto" />
              <div className="w-6 h-0.5 bg-white/50 rounded mx-auto mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section Mini */}
      <div className="h-[55%] bg-white p-3 space-y-2">
        {/* Section header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="w-8 h-0.5 bg-gray-300 rounded mb-1" />
            <div className="w-16 h-1.5 bg-gray-800 rounded" />
          </div>
          <div className="w-6 h-1.5 bg-gray-200 rounded" />
        </div>

        {/* Specialty cards grid */}
        <div className="grid grid-cols-2 gap-1">
          {blueprint.specialties
            ?.slice(0, 4)
            .map((spec: TemplateBlueprint["specialties"][0], i: number) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded p-1.5"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[8px]">{spec.icon}</span>
                  <div className="w-8 h-1 bg-gray-300 rounded" />
                </div>
                <div className="w-full h-0.5 bg-gray-200 rounded mt-1" />
              </div>
            ))}
        </div>

        {/* Doctor section mini */}
        <div className="flex gap-1 pt-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 bg-gray-50 rounded p-1 flex items-center gap-1"
            >
              <div className="w-4 h-4 rounded bg-gray-200" />
              <div className="flex-1">
                <div className="w-6 h-1 bg-gray-300 rounded" />
                <div className="w-8 h-0.5 bg-gray-200 rounded mt-0.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer mini */}
        <div
          className={cn("h-3 rounded mt-auto", style.accent, "opacity-80")}
        />
      </div>

      {/* Template style indicator */}
      <div className="absolute top-2 left-2">
        <div className="bg-white/90 backdrop-blur rounded-full p-1 shadow-sm">
          <style.icon className={cn("w-3 h-3", style.iconColor)} />
        </div>
      </div>
    </div>
  );
}

interface TemplatePreviewModalProps {
  template: TemplateData;
  onClose: () => void;
  onSelect: (customizedData: CustomizedTemplateData) => void;
  isSelected: boolean;
}

function TemplatePreviewModal({
  template,
  onClose,
  onSelect,
  isSelected,
}: TemplatePreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [isEditMode, setIsEditMode] = useState(true);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Keyboard handler for ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when fullscreen is active
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullScreen]);

  // Initialize local blueprint state from the template
  const originalBlueprint = useMemo(
    () => TEMPLATE_BLUEPRINTS[template.id],
    [template.id]
  );
  const [editedBlueprint, setEditedBlueprint] =
    useState<TemplateBlueprint | null>(
      originalBlueprint ? { ...originalBlueprint } : null
    );

  // Reset handler
  const handleReset = () => {
    if (originalBlueprint) {
      setEditedBlueprint({ ...originalBlueprint });
    }
  };

  // Theme update handler
  const handleThemeUpdate = (updates: {
    palette?: Partial<TemplateBlueprint["palette"]>;
    typography?: Partial<TemplateBlueprint["typography"]>;
  }) => {
    if (!editedBlueprint) return;
    setEditedBlueprint({
      ...editedBlueprint,
      palette: updates.palette
        ? { ...editedBlueprint.palette, ...updates.palette }
        : editedBlueprint.palette,
      typography: updates.typography
        ? { ...editedBlueprint.typography, ...updates.typography }
        : editedBlueprint.typography,
    });
  };

  // Select handler - passes the customized data up
  const handleSelect = () => {
    // Normalize the blueprint to ensure all fields match CustomizedTemplateData requirements
    const normalizedBlueprint = editedBlueprint
      ? {
          id: editedBlueprint.id,
          hero: editedBlueprint.hero,
          palette: editedBlueprint.palette,
          typography: editedBlueprint.typography,
          specialties: editedBlueprint.specialties.map((s) => ({
            icon: s.icon,
            title: s.title || s.name || "",
            description: s.description,
          })),
          differentiators: editedBlueprint.differentiators,
          doctors: editedBlueprint.doctors,
          testimonials: editedBlueprint.testimonials.map((t) => ({
            quote: t.quote,
            patient: t.patient || t.name || "",
            procedure: t.procedure || "",
          })),
          facilityHighlights: editedBlueprint.facilityHighlights,
          programs: editedBlueprint.programs,
          footer: {
            contact: editedBlueprint.footer.contact || {
              phone: "",
              email: "",
              location: "",
            },
            quickLinks: editedBlueprint.footer.quickLinks || [],
          },
        }
      : undefined;

    const customizedData: CustomizedTemplateData = {
      ...template,
      customizedBlueprint: normalizedBlueprint,
    };
    onSelect(customizedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Canvas Mode Banner */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-healthcare-primary/5 to-transparent">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-healthcare-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-healthcare-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {template.name}
                  {isEditMode && (
                    <Badge className="bg-healthcare-primary/20 text-healthcare-primary border-0">
                      Canvas Mode
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {isEditMode
                    ? "Click on any text to customize your website content"
                    : template.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Edit Mode Toggle */}
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                isEditMode &&
                  "bg-healthcare-primary hover:bg-healthcare-primary/90"
              )}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Edit
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
          {/* Device Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">View:</span>
            {(["desktop", "tablet", "mobile"] as const).map((d) => {
              const Icon =
                d === "desktop"
                  ? Monitor
                  : d === "tablet"
                  ? Tablet
                  : Smartphone;
              return (
                <Button
                  key={d}
                  variant={device === d ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDevice(d)}
                  className={cn(
                    "gap-1",
                    device === d &&
                      "bg-healthcare-primary hover:bg-healthcare-primary/90"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isEditMode && (
              <>
                <Button
                  variant={showThemePanel ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className={cn(
                    showThemePanel &&
                      "bg-healthcare-primary hover:bg-healthcare-primary/90"
                  )}
                >
                  <Palette className="w-4 h-4 mr-1" />
                  Theme
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-600"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </>
            )}
            {/* Full Screen Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(true)}
              className="text-gray-600 hover:text-healthcare-primary hover:border-healthcare-primary"
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              Full Screen
            </Button>
          </div>
        </div>

        {/* Full Screen Preview Modal */}
        {isFullScreen && editedBlueprint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Escape Button - Top Left Corner */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setIsFullScreen(false)}
              className="fixed top-4 left-4 z-[110] flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-black text-white rounded-full shadow-2xl backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Exit Full Screen</span>
            </motion.button>

            {/* Template Name Badge - Top Right */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="fixed top-4 right-4 z-[110] px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200"
            >
              <span className="text-sm font-semibold text-gray-700">
                {template.name}
              </span>
            </motion.div>

            {/* Full Screen Template Content */}
            <div className="w-full h-full overflow-y-auto">
              {template.id === "ahtarva-modern" ? (
                <AhtarvaModernTemplate
                  blueprint={editedBlueprint}
                  onBlueprintChange={setEditedBlueprint}
                  isEditMode={false}
                  showBanner={false}
                  device="desktop"
                />
              ) : template.id === "premium-medical" ? (
                <PremiumMedicalTemplate
                  blueprint={editedBlueprint}
                  onBlueprintChange={setEditedBlueprint}
                  isEditMode={false}
                  showBanner={false}
                  device="desktop"
                />
              ) : template.id === "modern-health-tech" ? (
                <ModernHealthTechTemplate
                  blueprint={editedBlueprint}
                  onBlueprintChange={setEditedBlueprint}
                  isEditMode={false}
                  showBanner={false}
                  device="desktop"
                />
              ) : template.id === "healthcare-saas" ? (
                <HealthcareSaaSTemplate
                  blueprint={editedBlueprint}
                  onBlueprintChange={setEditedBlueprint}
                  isEditMode={false}
                  showBanner={false}
                  device="desktop"
                />
              ) : (
                <EditableTemplatePreviewRenderer
                  blueprint={editedBlueprint}
                  device="desktop"
                  onBlueprintChange={setEditedBlueprint}
                  isEditMode={false}
                />
              )}
            </div>

            {/* Keyboard Hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 bg-black/60 text-white/80 rounded-full text-xs backdrop-blur-sm"
            >
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-white/20 rounded mx-1">ESC</kbd>{" "}
              or click the button to exit
            </motion.div>
          </motion.div>
        )}

        {/* Preview Area - Scrollable with optional Theme Panel */}
        <div className="flex-1 overflow-hidden flex">
          {/* Theme Customizer Sidebar */}
          {isEditMode && showThemePanel && editedBlueprint && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full overflow-y-auto border-r border-gray-200 bg-white"
            >
              <ThemeCustomizer
                palette={editedBlueprint.palette}
                typography={editedBlueprint.typography}
                onPaletteChange={(palette) => handleThemeUpdate({ palette })}
                onTypographyChange={(typography) =>
                  handleThemeUpdate({ typography })
                }
                originalPalette={originalBlueprint?.palette}
                originalTypography={originalBlueprint?.typography}
              />
            </motion.div>
          )}

          {/* Preview Area */}
          <div className="flex-1 overflow-auto p-6 bg-gray-100">
            <div
              className={cn(
                "mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200/70 transition-all duration-300",
                device === "desktop" && "w-full max-w-5xl",
                device === "tablet" && "w-[768px] max-w-full",
                device === "mobile" && "w-[375px] max-w-full"
              )}
              style={{
                minHeight:
                  device === "desktop"
                    ? "600px"
                    : device === "tablet"
                    ? "1024px"
                    : "667px",
              }}
            >
              {editedBlueprint ? (
                // Render custom templates based on template ID
                template.id === "ahtarva-modern" ? (
                  <AhtarvaModernTemplate
                    blueprint={editedBlueprint}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={isEditMode}
                    device={device}
                  />
                ) : template.id === "premium-medical" ? (
                  <PremiumMedicalTemplate
                    blueprint={editedBlueprint}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={isEditMode}
                    device={device}
                  />
                ) : template.id === "modern-health-tech" ? (
                  <ModernHealthTechTemplate
                    blueprint={editedBlueprint}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={isEditMode}
                    device={device}
                  />
                ) : template.id === "healthcare-saas" ? (
                  <HealthcareSaaSTemplate
                    blueprint={editedBlueprint}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={isEditMode}
                    device={device}
                  />
                ) : (
                  // Fallback to generic renderer
                  <EditableTemplatePreviewRenderer
                    blueprint={editedBlueprint}
                    device={device}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={isEditMode}
                  />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 min-h-[400px]">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Preview not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center text-sm text-gray-600">
            <Info className="w-4 h-4 mr-2" />
            {isEditMode
              ? "Your customizations will be saved when you select this template"
              : "Switch to Canvas mode to customize your website"}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSelect}
              className="bg-healthcare-primary hover:bg-healthcare-primary/90"
              size="lg"
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Update Selection
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Select &amp; Continue
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
