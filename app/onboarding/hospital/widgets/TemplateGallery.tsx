"use client";

import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  TemplateData,
  CustomizedTemplateData,
  LocationData,
} from "@/contexts/HospitalOnboardingContextV2";
import {
  TEMPLATE_BLUEPRINTS,
  type TemplateBlueprint,
} from "./templateBlueprints";
import { EditableTemplatePreviewRenderer } from "./EditableTemplatePreviewRenderer";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { useGlobalContactSync } from "./GlobalContactSync";

// Re-export for convenience
export type { CustomizedTemplateData } from "@/contexts/HospitalOnboardingContextV2";

interface TemplateGalleryProps {
  templates?: TemplateData[];
  selectedTemplate: CustomizedTemplateData | null;
  onSelectTemplate: (template: CustomizedTemplateData) => void;
  /** Location data for Global Contact Sync (optional) */
  locations?: LocationData[];
  className?: string;
}

const MOCK_TEMPLATES: TemplateData[] = [
  {
    id: "modern-healthcare",
    name: "Modern Clinical Flagship",
    version: "3.2",
    preview_snapshot_url: "/templates/modern-clinical.jpg",
    thumbnail_url: "/templates/modern-clinical-thumb.jpg",
    description:
      "Glass-and-steel campus aesthetic with immersive hero, data-driven stats, specialty grid, and premium doctor storytelling.",
    supported_modules: [
      "Appointments",
      "Patient Concierge",
      "Tele-ICU",
      "Precision Oncology",
      "Virtual Tour",
    ],
    recommended_for: [
      "Multi-specialty Hospitals",
      "International Patient Programs",
      "Enterprise Health Systems",
    ],
  },
  {
    id: "telehealth-first",
    name: "Telehealth First Mesh",
    version: "2.6",
    preview_snapshot_url: "/templates/telehealth-first.jpg",
    thumbnail_url: "/templates/telehealth-first-thumb.jpg",
    description:
      "Cloud-native virtual hospital layout inspired by leading hybrid-care networks with strong CTA coverage for remote visits.",
    supported_modules: [
      "Virtual Waiting Room",
      "Remote Monitoring",
      "At-home Infusion",
      "Behavioral Health Studio",
    ],
    recommended_for: [
      "Digital-first Hospitals",
      "Chronic Care Networks",
      "Employer Health Programs",
    ],
  },
  {
    id: "heritage",
    name: "Heritage Academic",
    version: "1.8",
    preview_snapshot_url: "/templates/heritage.jpg",
    thumbnail_url: "/templates/heritage-thumb.jpg",
    description:
      "Classic serif typography, heritage imagery, and donor storytelling tuned for legacy hospitals balancing tradition with science.",
    supported_modules: [
      "Pastoral Care",
      "Academic Programs",
      "Transplant Outcomes",
      "Heritage Timeline",
    ],
    recommended_for: [
      "Teaching Hospitals",
      "Mission Hospitals",
      "Faith-driven Health Systems",
    ],
  },
  {
    id: 'yashoda-inspired',
    name: 'Super Specialty Medicity',
    version: '4.0',
    preview_snapshot_url: '/templates/yashoda-medicity.jpg',
    thumbnail_url: '/templates/yashoda-medicity-thumb.jpg',
    description:
      'Premium multi-super specialty design inspired by leading hospital chains. Features stats strip, centers of excellence, doctor profiles with booking, international patient services, and breakthrough cases.',
    supported_modules: ['Centers of Excellence', 'International Patients', 'Robotic Surgery', 'Health Checkups', 'Emergency Services'],
    recommended_for: ['Super Specialty Hospitals', 'Medical Tourism', 'Corporate Hospitals', 'Multi-chain Networks'],
  },
];

export function TemplateGallery({
  templates = MOCK_TEMPLATES,
  selectedTemplate,
  onSelectTemplate,
  locations = [],
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
          locations={locations}
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
                <EditableTemplatePreviewRenderer
                  blueprint={selectedTemplate.customizedBlueprint}
                  onBlueprintChange={() => {}} // Read-only
                  isEditMode={false}
                />
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
      case "modern-healthcare":
        return {
          gradient: "from-teal-500 to-blue-600",
          accent: "bg-teal-500",
          style: "modern",
        };
      case "telehealth-first":
        return {
          gradient: "from-blue-500 to-cyan-500",
          accent: "bg-blue-500",
          style: "digital",
        };
      case "heritage":
        return {
          gradient: "from-amber-600 to-amber-800",
          accent: "bg-amber-600",
          style: "classic",
        };
      default:
        return {
          gradient: "from-gray-500 to-gray-700",
          accent: "bg-gray-500",
          style: "default",
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
        {templateId === "modern-healthcare" && (
          <div className="bg-white/90 backdrop-blur rounded-full p-1 shadow-sm">
            <Building2 className="w-3 h-3 text-teal-600" />
          </div>
        )}
        {templateId === "telehealth-first" && (
          <div className="bg-white/90 backdrop-blur rounded-full p-1 shadow-sm">
            <Video className="w-3 h-3 text-blue-600" />
          </div>
        )}
        {templateId === "heritage" && (
          <div className="bg-white/90 backdrop-blur rounded-full p-1 shadow-sm">
            <Heart className="w-3 h-3 text-amber-600" />
          </div>
        )}
      </div>
    </div>
  );
}

interface TemplatePreviewModalProps {
  template: TemplateData;
  onClose: () => void;
  onSelect: (customizedData: CustomizedTemplateData) => void;
  isSelected: boolean;
  /** Location data for Global Contact Sync */
  locations?: LocationData[];
}

function TemplatePreviewModal({
  template,
  onClose,
  onSelect,
  isSelected,
  locations = [],
}: TemplatePreviewModalProps) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local blueprint state from the template
  const originalBlueprint = useMemo(
    () => TEMPLATE_BLUEPRINTS[template.id],
    [template.id]
  );
  const [editedBlueprint, setEditedBlueprint] =
    useState<TemplateBlueprint | null>(
      originalBlueprint ? { ...originalBlueprint } : null
    );

  // Global Contact Sync - syncs wizard locations to footer
  useGlobalContactSync(
    locations,
    editedBlueprint,
    (updates) => {
      if (editedBlueprint) {
        setEditedBlueprint({ ...editedBlueprint, ...updates });
      }
    },
    { preserveCustomized: false }
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
    const customizedData: CustomizedTemplateData = {
      ...template,
      customizedBlueprint: editedBlueprint || undefined,
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
          {/* Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Use the toolbar at the bottom to switch devices</span>
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
                  Colors & Fonts
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
          </div>
        </div>

        {/* Preview Area - Full width with optional Theme Panel */}
        <div className="flex-1 overflow-hidden flex">
          {/* Theme Customizer Panel (Colors & Fonts only) */}
          {isEditMode && showThemePanel && editedBlueprint && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full overflow-y-auto border-r border-gray-200 bg-white flex-shrink-0"
            >
              <div className="p-4">
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
              </div>
            </motion.div>
          )}

          {/* Preview Area */}
          <div className="flex-1 overflow-hidden bg-gray-100">
            <div className="h-full w-full">
              {editedBlueprint ? (
                <EditableTemplatePreviewRenderer
                  blueprint={editedBlueprint}

                  onBlueprintChange={(newBlueprint) => {
                    setEditedBlueprint(newBlueprint);
                    setHasChanges(true);
                  }}
                  isEditMode={isEditMode}
                  onToggleEditMode={() => setIsEditMode(!isEditMode)}
                  onResetAll={handleReset}
                  hasChanges={hasChanges}
                />
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
