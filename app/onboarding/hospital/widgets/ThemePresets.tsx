"use client";

/**
 * =============================================================================
 * THEME PRESETS - ONE-CLICK THEME SYSTEM
 * =============================================================================
 * 
 * Simplified theme selection with curated presets that apply:
 * - Color palette (primary, accent, background, text)
 * - Typography pairing (heading + body fonts)
 * - Gradient styles
 * 
 * Advanced customization hidden under toggle for power users.
 * 
 * =============================================================================
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Settings2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TemplateBlueprint } from "./templateBlueprints";

// ============================================================================
// THEME PRESETS DATA
// ============================================================================

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: "Professional" | "Warm" | "Modern" | "Classic";
  palette: TemplateBlueprint["palette"];
  typography: TemplateBlueprint["typography"];
  preview: {
    gradient: string;
    accent: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "oceanic",
    name: "Oceanic",
    description: "Calm, trustworthy teal tones",
    category: "Professional",
    palette: {
      background: "#FFFFFF",
      surface: "#F0FDFA",
      accent: "#0E9F9F",
      accentMuted: "#5EEAD4",
      text: "#0F172A",
      textMuted: "#475569",
      gradient: "linear-gradient(135deg, #0E9F9F 0%, #2563EB 100%)",
    },
    typography: {
      heading: '"Space Grotesk", Inter, sans-serif',
      body: 'Inter, "Noto Sans", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-teal-500 to-blue-600",
      accent: "#0E9F9F",
    },
  },
  {
    id: "clinical-blue",
    name: "Clinical Blue",
    description: "Classic medical professionalism",
    category: "Professional",
    palette: {
      background: "#FFFFFF",
      surface: "#EFF6FF",
      accent: "#2563EB",
      accentMuted: "#93C5FD",
      text: "#1E293B",
      textMuted: "#64748B",
      gradient: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
    },
    typography: {
      heading: '"Montserrat", "Roboto", sans-serif',
      body: '"Roboto", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-blue-600 to-cyan-500",
      accent: "#2563EB",
    },
  },
  {
    id: "wellness-green",
    name: "Wellness Green",
    description: "Fresh, healthy, nature-inspired",
    category: "Modern",
    palette: {
      background: "#FFFFFF",
      surface: "#ECFDF5",
      accent: "#059669",
      accentMuted: "#6EE7B7",
      text: "#0F172A",
      textMuted: "#475569",
      gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    },
    typography: {
      heading: '"Nunito", "Poppins", sans-serif',
      body: '"Open Sans", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-emerald-600 to-green-500",
      accent: "#059669",
    },
  },
  {
    id: "caring-purple",
    name: "Caring Purple",
    description: "Compassionate and innovative",
    category: "Modern",
    palette: {
      background: "#FFFFFF",
      surface: "#FAF5FF",
      accent: "#7C3AED",
      accentMuted: "#C4B5FD",
      text: "#1E1B4B",
      textMuted: "#6B7280",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
    },
    typography: {
      heading: '"Sora", "Inter", sans-serif',
      body: 'Inter, "IBM Plex Sans", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-violet-600 to-purple-500",
      accent: "#7C3AED",
    },
  },
  {
    id: "warmth",
    name: "Warmth",
    description: "Friendly, welcoming, approachable",
    category: "Warm",
    palette: {
      background: "#FFFBEB",
      surface: "#FEF3C7",
      accent: "#F97316",
      accentMuted: "#FDBA74",
      text: "#1C1917",
      textMuted: "#57534E",
      gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
    },
    typography: {
      heading: '"Nunito", "Poppins", sans-serif',
      body: '"Lato", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-orange-500 to-amber-400",
      accent: "#F97316",
    },
  },
  {
    id: "heritage-amber",
    name: "Heritage Amber",
    description: "Traditional, established, trustworthy",
    category: "Classic",
    palette: {
      background: "#FFFBF5",
      surface: "#FEF3E2",
      accent: "#B45309",
      accentMuted: "#FCD34D",
      text: "#1C1917",
      textMuted: "#78716C",
      gradient: "linear-gradient(135deg, #B45309 0%, #92400E 100%)",
    },
    typography: {
      heading: '"Playfair Display", "IBM Plex Serif", serif',
      body: '"Source Sans Pro", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-amber-700 to-amber-900",
      accent: "#B45309",
    },
  },
  {
    id: "trust-navy",
    name: "Trust Navy",
    description: "Authoritative, premium, executive",
    category: "Classic",
    palette: {
      background: "#FFFFFF",
      surface: "#F1F5F9",
      accent: "#1E3A8A",
      accentMuted: "#60A5FA",
      text: "#0F172A",
      textMuted: "#64748B",
      gradient: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
    },
    typography: {
      heading: '"Cormorant Garamond", "Georgia", serif',
      body: '"Lato", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-blue-900 to-blue-600",
      accent: "#1E3A8A",
    },
  },
  {
    id: "calm-sage",
    name: "Calm Sage",
    description: "Serene, balanced, holistic",
    category: "Warm",
    palette: {
      background: "#FAFDF7",
      surface: "#ECFCCB",
      accent: "#4D7C0F",
      accentMuted: "#BEF264",
      text: "#1A2E05",
      textMuted: "#65A30D",
      gradient: "linear-gradient(135deg, #4D7C0F 0%, #84CC16 100%)",
    },
    typography: {
      heading: '"Libre Baskerville", Georgia, serif',
      body: '"Source Sans Pro", system-ui, sans-serif',
    },
    preview: {
      gradient: "from-lime-700 to-lime-500",
      accent: "#4D7C0F",
    },
  },
];

// ============================================================================
// TYPES
// ============================================================================

export interface ThemePresetsProps {
  currentPalette: TemplateBlueprint["palette"];
  currentTypography: TemplateBlueprint["typography"];
  onApplyPreset: (preset: ThemePreset) => void;
  onPaletteChange: (palette: TemplateBlueprint["palette"]) => void;
  onTypographyChange: (typography: TemplateBlueprint["typography"]) => void;
  originalPalette?: TemplateBlueprint["palette"];
  originalTypography?: TemplateBlueprint["typography"];
}

// ============================================================================
// PRESET CARD COMPONENT
// ============================================================================

interface PresetCardProps {
  preset: ThemePreset;
  isSelected: boolean;
  onSelect: () => void;
}

function PresetCard({ preset, isSelected, onSelect }: PresetCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative w-full p-4 rounded-xl border-2 transition-all text-left",
        isSelected
          ? "border-gray-900 ring-2 ring-gray-900/20 bg-white shadow-lg"
          : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Preview gradient bar */}
      <div
        className={cn(
          "h-12 rounded-lg mb-3 bg-gradient-to-r",
          preset.preview.gradient
        )}
      />

      {/* Preset info */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">{preset.name}</h4>
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {preset.category}
          </span>
        </div>
        <p className="text-xs text-gray-500">{preset.description}</p>
      </div>

      {/* Color swatches */}
      <div className="flex items-center gap-1 mt-3">
        <div
          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: preset.palette.accent }}
          title="Accent"
        />
        <div
          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: preset.palette.surface }}
          title="Surface"
        />
        <div
          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: preset.palette.text }}
          title="Text"
        />
        <div className="flex-1" />
        <span
          className="text-[10px] text-gray-400 truncate max-w-[80px]"
          style={{ fontFamily: preset.typography.heading }}
        >
          Aa
        </span>
      </div>
    </motion.button>
  );
}

// ============================================================================
// ADVANCED COLOR PICKER
// ============================================================================

interface AdvancedColorPickerProps {
  palette: TemplateBlueprint["palette"];
  typography: TemplateBlueprint["typography"];
  onPaletteChange: (palette: TemplateBlueprint["palette"]) => void;
  onTypographyChange: (typography: TemplateBlueprint["typography"]) => void;
}

function AdvancedColorPicker({
  palette,
  typography,
  onPaletteChange,
  onTypographyChange,
}: AdvancedColorPickerProps) {
  const colorFields: { key: keyof typeof palette; label: string }[] = [
    { key: "accent", label: "Primary Accent" },
    { key: "accentMuted", label: "Accent Light" },
    { key: "background", label: "Background" },
    { key: "surface", label: "Surface" },
    { key: "text", label: "Text Color" },
    { key: "textMuted", label: "Muted Text" },
  ];

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Settings2 className="w-4 h-4" />
        Advanced Customization
      </h4>

      {/* Color Grid */}
      <div className="grid grid-cols-2 gap-3">
        {colorFields.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <label className="text-xs text-gray-500">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={palette[key]}
                onChange={(e) =>
                  onPaletteChange({ ...palette, [key]: e.target.value })
                }
                className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={palette[key]}
                onChange={(e) =>
                  onPaletteChange({ ...palette, [key]: e.target.value })
                }
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Gradient */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Hero Gradient</label>
        <div
          className="h-8 rounded-lg mb-1"
          style={{ background: palette.gradient }}
        />
        <input
          type="text"
          value={palette.gradient}
          onChange={(e) =>
            onPaletteChange({ ...palette, gradient: e.target.value })
          }
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded font-mono"
          placeholder="linear-gradient(...)"
        />
      </div>

      {/* Typography */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Heading Font</label>
          <input
            type="text"
            value={typography.heading}
            onChange={(e) =>
              onTypographyChange({ ...typography, heading: e.target.value })
            }
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Body Font</label>
          <input
            type="text"
            value={typography.body}
            onChange={(e) =>
              onTypographyChange({ ...typography, body: e.target.value })
            }
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ThemePresets({
  currentPalette,
  currentTypography,
  onApplyPreset,
  onPaletteChange,
  onTypographyChange,
  originalPalette,
  originalTypography,
}: ThemePresetsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Find currently selected preset
  const selectedPreset = THEME_PRESETS.find(
    (p) => p.palette.accent === currentPalette.accent
  );

  const handleReset = useCallback(() => {
    if (originalPalette) onPaletteChange(originalPalette);
    if (originalTypography) onTypographyChange(originalTypography);
  }, [originalPalette, originalTypography, onPaletteChange, onTypographyChange]);

  // Filter presets by category
  const categories = ["Professional", "Modern", "Warm", "Classic"] as const;
  const filteredPresets = selectedCategory
    ? THEME_PRESETS.filter((p) => p.category === selectedCategory)
    : THEME_PRESETS;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Palette className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Theme</h3>
            <p className="text-xs text-gray-500">One-click styling</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-full transition-colors",
            !selectedCategory
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-colors",
              selectedCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {filteredPresets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isSelected={selectedPreset?.id === preset.id}
            onSelect={() => onApplyPreset(preset)}
          />
        ))}
      </div>

      {/* Current Selection Indicator */}
      {selectedPreset && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Sparkles className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Using <strong>{selectedPreset.name}</strong> theme
          </span>
        </div>
      )}

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Advanced customization
        </span>
        {showAdvanced ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Advanced Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <AdvancedColorPicker
              palette={currentPalette}
              typography={currentTypography}
              onPaletteChange={onPaletteChange}
              onTypographyChange={onTypographyChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemePresets;
