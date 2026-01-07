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
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Maximize2,
  ChevronRight,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useHospitalOnboarding,
  type TemplateData,
  type CustomizedTemplateData,
} from "@/contexts/HospitalOnboardingContextV2";
import {
  TEMPLATE_BLUEPRINTS,
  type TemplateBlueprint,
} from "./templateBlueprints";
import { EditableTemplatePreviewRenderer } from "./EditableTemplatePreviewRenderer";
import { ThemeCustomizer } from "./ThemeCustomizer";
import {
  AhtarvaProfessionalTemplate,
  AhtarvaMedicalCenterTemplate,
  AhtarvaHealthcareTemplate,
} from "./templates";
import { TemplateGuidedTour } from "./TemplateTour";

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
    id: "ahtarva-professional",
    name: "Ahtarva Professional",
    version: "1.0",
    preview_snapshot_url: "/templates/ahtarva-professional.jpg",
    thumbnail_url: "/templates/ahtarva-professional-thumb.jpg",
    description:
      "Modern, clean hospital template with professional blue design. Features floating cards, smooth animations, and comprehensive sections for specialties, doctors, facilities, and patient testimonials.",
    supported_modules: [
      "Appointments",
      "Departments",
      "Doctors",
      "Facilities",
      "Testimonials",
      "Contact",
    ],
    recommended_for: [
      "Multi-specialty Hospitals",
      "Medical Centers",
      "Healthcare Networks",
    ],
  },
  {
    id: "ahtarva-medical-center",
    name: "Ahtarva Medical Center",
    version: "1.0",
    preview_snapshot_url: "/templates/ahtarva-medical-center.jpg",
    thumbnail_url: "/templates/ahtarva-medical-center-thumb.jpg",
    description:
      "Elegant, modern hospital template with teal accents and Merriweather serif typography. Features full-screen hero, stats strip, specialties grid, doctor profiles, and appointment booking form.",
    supported_modules: [
      "Appointments",
      "Departments",
      "Doctors",
      "About",
      "Contact",
    ],
    recommended_for: [
      "Medical Centers",
      "Specialty Clinics",
      "Healthcare Facilities",
    ],
  },
  {
    id: "ahtarva-healthcare",
    name: "Ahtarva Healthcare",
    version: "1.0",
    preview_snapshot_url: "/templates/ahtarva-healthcare.jpg",
    thumbnail_url: "/templates/ahtarva-healthcare-thumb.jpg",
    description:
      "Professional healthcare landing page with teal color scheme, smooth animations, and modern design. Complete with hero section, stats, trust badges, specialties, doctors showcase, facilities, appointment booking, testimonials, and footer.",
    supported_modules: [
      "Appointments",
      "Departments",
      "Doctors",
      "Facilities",
      "Testimonials",
      "About",
      "Contact",
    ],
    recommended_for: [
      "Medical Centers",
      "Multi-specialty Hospitals",
      "Healthcare Networks",
      "Specialty Clinics",
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
  const [showTour, setShowTour] = useState(true);

  const handleRestartTour = () => {
    localStorage.removeItem("template-tour-completed");
    sessionStorage.removeItem("template-tour-skipped");
    setShowTour(false);
    setTimeout(() => setShowTour(true), 100);
  };

  // Demo actions for the guided tour to control UI
  const tourDemoActions = {
    openPreview: (templateId: string) => {
      const template = templates.find((t: TemplateData) => t.id === templateId);
      if (template) {
        setPreviewTemplate(template);
      }
    },
    toggleEditMode: (enabled: boolean) => {
      window.dispatchEvent(
        new CustomEvent("tour-demo-action", {
          detail: { action: "toggleEditMode", value: enabled },
        })
      );
    },
    openColorPicker: () => {
      window.dispatchEvent(
        new CustomEvent("tour-demo-action", {
          detail: { action: "openColorPicker" },
        })
      );
    },
    changeColor: (colorIndex: number) => {
      window.dispatchEvent(
        new CustomEvent("tour-demo-action", {
          detail: { action: "changeColor", value: colorIndex },
        })
      );
    },
    openFontPicker: () => {
      window.dispatchEvent(
        new CustomEvent("tour-demo-action", {
          detail: { action: "openFontPicker" },
        })
      );
    },
    changeFont: (fontIndex: number) => {
      window.dispatchEvent(
        new CustomEvent("tour-demo-action", {
          detail: { action: "changeFont", value: fontIndex },
        })
      );
    },
    toggleFullscreen: (enabled: boolean) => {
      window.dispatchEvent(
        new CustomEvent("tour-demo-action", {
          detail: { action: "toggleFullscreen", value: enabled },
        })
      );
    },
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Guided Tour */}
      {showTour && (
        <TemplateGuidedTour
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
          autoStart={true}
          enableAutoPlay={true}
          demoActions={tourDemoActions}
        />
      )}

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
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestartTour}
            className="text-teal-600 border-teal-200 hover:bg-teal-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Show Tour
          </Button>
          <Badge
            variant="secondary"
            className="bg-healthcare-primary/10 text-healthcare-primary"
          >
            {templates.length} Templates
          </Badge>
        </div>
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
                {selectedTemplate.id === "ahtarva-professional" ? (
                  <AhtarvaProfessionalTemplate
                    blueprint={selectedTemplate.customizedBlueprint}
                    device="desktop"
                    onBlueprintChange={() => {}}
                    isEditMode={false}
                  />
                ) : selectedTemplate.id === "ahtarva-medical-center" ? (
                  <AhtarvaMedicalCenterTemplate
                    blueprint={selectedTemplate.customizedBlueprint}
                    device="desktop"
                    onBlueprintChange={() => {}}
                    isEditMode={false}
                  />
                ) : selectedTemplate.id === "ahtarva-healthcare" ? (
                  <AhtarvaHealthcareTemplate
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
      data-tour="template-card"
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
            data-tour="preview-button"
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
      case "ahtarva-professional":
        return {
          gradient: "from-blue-500 via-sky-500 to-blue-600",
          accent: "bg-blue-500",
          style: "professional",
          icon: Building2,
          iconColor: "text-blue-600",
        };
      case "ahtarva-medical-center":
        return {
          gradient: "from-teal-600 via-teal-500 to-emerald-600",
          accent: "bg-teal-600",
          style: "medical-center",
          icon: Building2,
          iconColor: "text-teal-600",
        };
      case "ahtarva-healthcare":
        return {
          gradient: "from-teal-500 via-cyan-500 to-teal-600",
          accent: "bg-teal-500",
          style: "healthcare",
          icon: Building2,
          iconColor: "text-teal-500",
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
  const { data } = useHospitalOnboarding();
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [isEditMode, setIsEditMode] = useState(true);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Listen for tour demo actions
  useEffect(() => {
    const handleTourAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { action, value } = customEvent.detail;

      switch (action) {
        case "toggleEditMode":
          setIsEditMode(value);
          break;
        case "openColorPicker":
          setShowThemePanel(true);
          break;
        case "changeColor":
          // Will be handled by ThemeCustomizer
          break;
        case "openFontPicker":
          setShowThemePanel(true);
          break;
        case "changeFont":
          // Will be handled by ThemeCustomizer
          break;
        case "toggleFullscreen":
          setIsFullScreen(value);
          break;
      }
    };

    window.addEventListener("tour-demo-action", handleTourAction);
    return () => {
      window.removeEventListener("tour-demo-action", handleTourAction);
    };
  }, []);
  // Get licenses from context and convert to template format
  const contextLicenses = useMemo(() => {
    return (data.licenses || []).map((license) => ({
      id: license.id,
      name: license.name,
      certificateUrl: license.certificate_file instanceof File 
        ? URL.createObjectURL(license.certificate_file) 
        : license.certificate_file || "",
    }));
  }, [data.licenses]);

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
      originalBlueprint ? { ...originalBlueprint, licenses: contextLicenses } : null
    );

  // Update licenses when context changes
  useEffect(() => {
    if (editedBlueprint) {
      setEditedBlueprint(prev => prev ? { ...prev, licenses: contextLicenses } : null);
    }
  }, [contextLicenses]);

  // Reset handler
  const handleReset = () => {
    if (originalBlueprint) {
      setEditedBlueprint({ ...originalBlueprint, licenses: contextLicenses });
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
          licenses: editedBlueprint.licenses || [],
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
        {/* Unified Top Navbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          {/* Left: Template Name & Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-healthcare-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-healthcare-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {template.name}
                {isEditMode && (
                  <Badge className="bg-healthcare-primary/20 text-healthcare-primary border-0 text-xs">
                    Canvas Mode
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-gray-500">
                {isEditMode
                  ? "Click on any text to customize"
                  : "Preview your template"}
              </p>
            </div>
          </div>

          {/* Right: All Controls */}
          <div className="flex items-center gap-2">
            {/* View Dropdown */}
            <div className="relative group">
              <Button variant="outline" size="sm" className="gap-2">
                {device === "desktop" && <Monitor className="w-4 h-4" />}
                {device === "tablet" && <Tablet className="w-4 h-4" />}
                {device === "mobile" && <Smartphone className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {device.charAt(0).toUpperCase() + device.slice(1)}
                </span>
                <ChevronRight className="w-3 h-3 rotate-90" />
              </Button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {(["desktop", "tablet", "mobile"] as const).map((d) => {
                  const Icon =
                    d === "desktop"
                      ? Monitor
                      : d === "tablet"
                      ? Tablet
                      : Smartphone;
                  return (
                    <button
                      key={d}
                      onClick={() => setDevice(d)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                        device === d &&
                          "bg-healthcare-primary/5 text-healthcare-primary font-medium"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                      {device === d && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Scheme Picker (only in edit mode) */}
            {isEditMode && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 hover:border-healthcare-primary hover:text-healthcare-primary"
                      data-tour="color-picker"
                    >
                      <Palette className="w-4 h-4" />
                      <span className="hidden sm:inline">Colors</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" side="bottom" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Color Schemes</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editedBlueprint && originalBlueprint) {
                              setEditedBlueprint({
                                ...editedBlueprint,
                                palette: originalBlueprint.palette,
                              });
                            }
                          }}
                          className="text-xs h-7"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Choose a color scheme for your template
                      </p>
                      <div className="grid gap-2">
                        {[
                          {
                            name: "Healthcare Teal",
                            accent: "#0E9F9F",
                            accentMuted: "#ccfbf1",
                            background: "#f0fdfa",
                            gradient:
                              "linear-gradient(135deg, #0E9F9F, #2563EB)",
                          },
                          {
                            name: "Medical Blue",
                            accent: "#2563EB",
                            accentMuted: "#dbeafe",
                            background: "#eff6ff",
                            gradient:
                              "linear-gradient(135deg, #2563EB, #3B82F6)",
                          },
                          {
                            name: "Wellness Green",
                            accent: "#059669",
                            accentMuted: "#d1fae5",
                            background: "#ecfdf5",
                            gradient:
                              "linear-gradient(135deg, #059669, #10B981)",
                          },
                          {
                            name: "Caring Purple",
                            accent: "#7C3AED",
                            accentMuted: "#ede9fe",
                            background: "#f5f3ff",
                            gradient:
                              "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                          },
                          {
                            name: "Warm Coral",
                            accent: "#F97316",
                            accentMuted: "#ffedd5",
                            background: "#fff7ed",
                            gradient:
                              "linear-gradient(135deg, #F97316, #FB923C)",
                          },
                          {
                            name: "Trust Navy",
                            accent: "#1E3A8A",
                            accentMuted: "#dbeafe",
                            background: "#eff6ff",
                            gradient:
                              "linear-gradient(135deg, #1E3A8A, #3B82F6)",
                          },
                        ].map((scheme) => {
                          const isActive =
                            editedBlueprint?.palette?.accent === scheme.accent;
                          return (
                            <button
                              key={scheme.name}
                              onClick={() => {
                                if (editedBlueprint) {
                                  setEditedBlueprint({
                                    ...editedBlueprint,
                                    palette: {
                                      ...editedBlueprint.palette,
                                      accent: scheme.accent,
                                      accentMuted: scheme.accentMuted,
                                      background: scheme.background,
                                      gradient: scheme.gradient,
                                    },
                                  });
                                }
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all hover:border-gray-300",
                                isActive
                                  ? "border-healthcare-primary bg-healthcare-primary/5"
                                  : "border-gray-200"
                              )}
                            >
                              <div className="flex gap-1">
                                <div
                                  className="w-6 h-6 rounded shadow-sm"
                                  style={{ backgroundColor: scheme.accent }}
                                />
                                <div
                                  className="w-6 h-6 rounded shadow-sm"
                                  style={{
                                    backgroundColor: scheme.accentMuted,
                                  }}
                                />
                                <div
                                  className="w-6 h-6 rounded shadow-sm"
                                  style={{ background: scheme.gradient }}
                                />
                              </div>
                              <span className="text-sm font-medium flex-1 text-left">
                                {scheme.name}
                              </span>
                              {isActive && (
                                <Check className="w-4 h-4 text-healthcare-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Typography Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 hover:border-healthcare-primary hover:text-healthcare-primary"
                      data-tour="font-picker"
                    >
                      <Type className="w-4 h-4" />
                      <span className="hidden sm:inline">Fonts</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" side="bottom" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Typography</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editedBlueprint && originalBlueprint) {
                              setEditedBlueprint({
                                ...editedBlueprint,
                                typography: originalBlueprint.typography,
                              });
                            }
                          }}
                          className="text-xs h-7"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Choose a font combination for your template
                      </p>
                      <div className="grid gap-2">
                        {[
                          {
                            name: "Modern Sans",
                            heading: '"Inter", system-ui, sans-serif',
                            body: '"Inter", system-ui, sans-serif',
                            preview: "Inter",
                          },
                          {
                            name: "Classic Serif",
                            heading: '"Playfair Display", Georgia, serif',
                            body: '"Source Sans Pro", system-ui, sans-serif',
                            preview: "Playfair",
                          },
                          {
                            name: "Tech Forward",
                            heading: '"Sora", "Inter", sans-serif',
                            body: '"Inter", system-ui, sans-serif',
                            preview: "Sora",
                          },
                          {
                            name: "Friendly Rounded",
                            heading: '"Nunito", "Poppins", sans-serif',
                            body: '"Open Sans", system-ui, sans-serif',
                            preview: "Nunito",
                          },
                          {
                            name: "Professional",
                            heading: '"Montserrat", "Roboto", sans-serif',
                            body: '"Roboto", system-ui, sans-serif',
                            preview: "Montserrat",
                          },
                          {
                            name: "Elegant",
                            heading: '"Cormorant Garamond", Georgia, serif',
                            body: '"Lato", system-ui, sans-serif',
                            preview: "Cormorant",
                          },
                        ].map((font) => {
                          const isActive =
                            editedBlueprint?.typography?.heading ===
                            font.heading;
                          return (
                            <button
                              key={font.name}
                              onClick={() => {
                                if (editedBlueprint) {
                                  setEditedBlueprint({
                                    ...editedBlueprint,
                                    typography: {
                                      heading: font.heading,
                                      body: font.body,
                                    },
                                  });
                                }
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all hover:border-gray-300",
                                isActive
                                  ? "border-healthcare-primary bg-healthcare-primary/5"
                                  : "border-gray-200"
                              )}
                            >
                              <div
                                className="text-xl font-bold text-gray-700 w-16"
                                style={{ fontFamily: font.heading }}
                              >
                                Aa
                              </div>
                              <div className="flex-1 text-left">
                                <span className="text-sm font-medium block">
                                  {font.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {font.preview}
                                </span>
                              </div>
                              {isActive && (
                                <Check className="w-4 h-4 text-healthcare-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-600 hover:text-red-600 hover:border-red-300"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Reset All</span>
                </Button>
              </>
            )}

            {/* Full Screen */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(true)}
              className="text-gray-600 hover:text-healthcare-primary hover:border-healthcare-primary"
              data-tour="fullscreen-button"
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Full Screen</span>
            </Button>

            {/* Preview/Edit Toggle */}
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                isEditMode &&
                  "bg-healthcare-primary hover:bg-healthcare-primary/90"
              )}
              data-tour="edit-toggle"
            >
              {isEditMode ? (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Preview</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              )}
            </Button>

            {/* Close Button */}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
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
              className="fixed top-4 right-4 z-[110] flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200"
            >
              <span className="text-sm font-semibold text-gray-700">
                {template.name}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                {device === "desktop"
                  ? "Desktop"
                  : device === "tablet"
                  ? "Tablet (768px)"
                  : "Mobile (375px)"}
              </span>
            </motion.div>

            {/* Full Screen Template Content */}
            <div className="w-full h-full overflow-y-auto bg-gray-100 flex justify-center py-4">
              <div
                className={cn(
                  "bg-white min-h-screen transition-all duration-300",
                  device === "desktop" && "w-full shadow-none",
                  device === "tablet" && "w-[768px] shadow-2xl rounded-lg mx-4",
                  device === "mobile" && "w-[375px] shadow-2xl rounded-lg mx-4"
                )}
                style={{
                  // Use CSS container query so child elements can respond to container width
                  containerType: "inline-size",
                }}
              >
                {template.id === "ahtarva-professional" ? (
                  <AhtarvaProfessionalTemplate
                    blueprint={editedBlueprint}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={false}
                    showBanner={false}
                    device={device}
                    useResponsive={true}
                  />
                ) : template.id === "ahtarva-medical-center" ? (
                  <AhtarvaMedicalCenterTemplate
                    blueprint={editedBlueprint}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={false}
                    showBanner={false}
                    device={device}
                    useResponsive={true}
                  />
                ) : template.id === "ahtarva-healthcare" ? (
                  <AhtarvaHealthcareTemplate
                    blueprint={editedBlueprint}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={false}
                    showBanner={false}
                    device={device}
                    useResponsive={true}
                  />
                ) : (
                  <EditableTemplatePreviewRenderer
                    blueprint={editedBlueprint}
                    device={device}
                    onBlueprintChange={setEditedBlueprint}
                    isEditMode={false}
                  />
                )}
              </div>
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
          <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 flex flex-col items-center">
            {/* Device Label */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {device === "desktop"
                  ? "Desktop Preview"
                  : device === "tablet"
                  ? "iPad Preview"
                  : "iPhone Preview"}
              </span>
              <span className="text-xs text-slate-400">
                {device === "desktop"
                  ? "1200px"
                  : device === "tablet"
                  ? "768px"
                  : "375px"}
              </span>
            </div>

            {/* Device Frame Container */}
            <div
              className={cn(
                "relative shadow-2xl transition-all duration-500",
                device === "desktop" && "bg-gray-900 p-2 rounded-xl",
                device === "tablet" && "bg-slate-800 p-4 pt-8 rounded-[2.5rem]",
                device === "mobile" && "bg-slate-800 p-3 pt-10 rounded-[3rem]"
              )}
              style={{
                width:
                  device === "desktop"
                    ? "100%"
                    : device === "tablet"
                    ? "440px"
                    : "240px",
                maxWidth: device === "desktop" ? "1200px" : "100%",
              }}
            >
              {/* Device Notch/Camera for mobile/tablet */}
              {device === "mobile" && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full z-10" />
              )}
              {device === "tablet" && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-600 rounded-full z-10" />
              )}

              {/* Home Indicator for mobile */}
              {device === "mobile" && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-600 rounded-full z-10" />
              )}

              {/* Screen Container */}
              <div
                className={cn(
                  "bg-white overflow-hidden",
                  device === "desktop" && "rounded-lg",
                  device === "tablet" && "rounded-2xl",
                  device === "mobile" && "rounded-[2rem]"
                )}
                style={{
                  height:
                    device === "desktop"
                      ? "600px"
                      : device === "tablet"
                      ? "580px"
                      : "480px",
                  overflow: "hidden",
                }}
              >
                {/* Scaled Content Container */}
                <div
                  style={{
                    width: "1200px",
                    height:
                      device === "desktop"
                        ? "600px"
                        : device === "tablet"
                        ? `${580 / 0.36}px`
                        : `${480 / 0.195}px`,
                    transform:
                      device === "desktop"
                        ? "scale(1)"
                        : device === "tablet"
                        ? "scale(0.36)"
                        : "scale(0.195)",
                    transformOrigin: "top left",
                    overflow: "auto",
                  }}
                >
                  {editedBlueprint ? (
                    // Render custom templates based on template ID
                    template.id === "ahtarva-professional" ? (
                      <AhtarvaProfessionalTemplate
                        blueprint={editedBlueprint}
                        onBlueprintChange={setEditedBlueprint}
                        isEditMode={isEditMode}
                        device={device}
                      />
                    ) : template.id === "ahtarva-medical-center" ? (
                      <AhtarvaMedicalCenterTemplate
                        blueprint={editedBlueprint}
                        onBlueprintChange={setEditedBlueprint}
                        isEditMode={isEditMode}
                        device={device}
                      />
                    ) : template.id === "ahtarva-healthcare" ? (
                      <AhtarvaHealthcareTemplate
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
              data-tour="select-button"
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
