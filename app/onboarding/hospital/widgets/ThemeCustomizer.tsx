"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TemplateBlueprint } from "./templateBlueprints";

export interface ThemeCustomizerProps {
  palette: TemplateBlueprint["palette"];
  typography: TemplateBlueprint["typography"];
  onPaletteChange: (palette: TemplateBlueprint["palette"]) => void;
  onTypographyChange: (typography: TemplateBlueprint["typography"]) => void;
  originalPalette?: TemplateBlueprint["palette"];
  originalTypography?: TemplateBlueprint["typography"];
}

// Predefined color presets
const COLOR_PRESETS = [
  {
    name: "Healthcare Teal",
    accent: "#0E9F9F",
    gradient: "linear-gradient(135deg, #0E9F9F, #2563EB)",
  },
  {
    name: "Medical Blue",
    accent: "#2563EB",
    gradient: "linear-gradient(135deg, #2563EB, #06B6D4)",
  },
  {
    name: "Wellness Green",
    accent: "#059669",
    gradient: "linear-gradient(135deg, #059669, #10B981)",
  },
  {
    name: "Caring Purple",
    accent: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED, #A855F7)",
  },
  {
    name: "Warm Coral",
    accent: "#F97316",
    gradient: "linear-gradient(135deg, #F97316, #FB923C)",
  },
  {
    name: "Heritage Amber",
    accent: "#B45309",
    gradient: "linear-gradient(135deg, #B45309, #92400E)",
  },
  {
    name: "Trust Navy",
    accent: "#1E3A8A",
    gradient: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
  },
  {
    name: "Calm Sage",
    accent: "#4D7C0F",
    gradient: "linear-gradient(135deg, #4D7C0F, #84CC16)",
  },
];

// Predefined font presets
const FONT_PRESETS = [
  {
    name: "Modern Sans",
    heading: '"Space Grotesk", Inter, sans-serif',
    body: 'Inter, "Noto Sans", system-ui, sans-serif',
  },
  {
    name: "Classic Serif",
    heading: '"Playfair Display", "IBM Plex Serif", serif',
    body: '"Source Sans Pro", system-ui, sans-serif',
  },
  {
    name: "Tech Forward",
    heading: '"Sora", "Inter", sans-serif',
    body: 'Inter, "IBM Plex Sans", system-ui, sans-serif',
  },
  {
    name: "Friendly Rounded",
    heading: '"Nunito", "Poppins", sans-serif',
    body: '"Open Sans", system-ui, sans-serif',
  },
  {
    name: "Professional",
    heading: '"Montserrat", "Roboto", sans-serif',
    body: '"Roboto", system-ui, sans-serif',
  },
  {
    name: "Elegant",
    heading: '"Cormorant Garamond", "Georgia", serif',
    body: '"Lato", system-ui, sans-serif',
  },
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
}

function ColorPicker({ label, value, onChange, presets }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer overflow-hidden"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-healthcare-primary/30 focus:border-healthcare-primary"
          placeholder="#000000"
        />
      </div>
      {presets && (
        <div className="flex gap-1 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all",
                value === preset
                  ? "border-gray-900 scale-110"
                  : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ThemeCustomizer({
  palette,
  typography,
  onPaletteChange,
  onTypographyChange,
  originalPalette,
  originalTypography,
}: ThemeCustomizerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"colors" | "fonts">("colors");

  const updatePaletteField = useCallback(
    (field: keyof TemplateBlueprint["palette"], value: string) => {
      onPaletteChange({ ...palette, [field]: value });
    },
    [palette, onPaletteChange]
  );

  const applyColorPreset = useCallback(
    (preset: (typeof COLOR_PRESETS)[0]) => {
      onPaletteChange({
        ...palette,
        accent: preset.accent,
        gradient: preset.gradient,
      });
    },
    [palette, onPaletteChange]
  );

  const applyFontPreset = useCallback(
    (preset: (typeof FONT_PRESETS)[0]) => {
      onTypographyChange({
        heading: preset.heading,
        body: preset.body,
      });
    },
    [onTypographyChange]
  );

  const handleReset = useCallback(() => {
    if (originalPalette) onPaletteChange(originalPalette);
    if (originalTypography) onTypographyChange(originalTypography);
  }, [
    originalPalette,
    originalTypography,
    onPaletteChange,
    onTypographyChange,
  ]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-healthcare-primary/10 rounded-lg">
            <Palette className="w-5 h-5 text-healthcare-primary" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">Theme & Colors</h4>
            <p className="text-xs text-gray-500">
              Customize colors, fonts, and branding
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Preview swatches */}
          <div className="flex -space-x-1">
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: palette.accent }}
            />
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ background: palette.gradient }}
            />
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("colors")}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                    activeTab === "colors"
                      ? "bg-healthcare-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Palette className="w-4 h-4 inline mr-1" />
                  Colors
                </button>
                <button
                  onClick={() => setActiveTab("fonts")}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                    activeTab === "fonts"
                      ? "bg-healthcare-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Type className="w-4 h-4 inline mr-1" />
                  Fonts
                </button>
              </div>

              {activeTab === "colors" && (
                <div className="space-y-4">
                  {/* Color Presets */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                      Quick Presets
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyColorPreset(preset)}
                          className={cn(
                            "relative p-2 rounded-lg border-2 transition-all hover:scale-105",
                            palette.accent === preset.accent
                              ? "border-healthcare-primary ring-2 ring-healthcare-primary/20"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div
                            className="w-full h-6 rounded-md mb-1"
                            style={{ background: preset.gradient }}
                          />
                          <p className="text-[10px] text-gray-600 truncate">
                            {preset.name}
                          </p>
                          {palette.accent === preset.accent && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-healthcare-primary rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPicker
                      label="Primary Accent"
                      value={palette.accent}
                      onChange={(val) => updatePaletteField("accent", val)}
                    />
                    <ColorPicker
                      label="Background"
                      value={palette.background}
                      onChange={(val) => updatePaletteField("background", val)}
                      presets={[
                        "#ffffff",
                        "#f7fafc",
                        "#f0f9ff",
                        "#fefcf5",
                        "#f5f3ff",
                      ]}
                    />
                    <ColorPicker
                      label="Text Color"
                      value={palette.text}
                      onChange={(val) => updatePaletteField("text", val)}
                      presets={["#0f172a", "#1f2937", "#374151", "#1e3a8a"]}
                    />
                    <ColorPicker
                      label="Muted Text"
                      value={palette.textMuted}
                      onChange={(val) => updatePaletteField("textMuted", val)}
                      presets={["#475569", "#6b7280", "#9ca3af"]}
                    />
                  </div>

                  {/* Gradient Editor */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                      Hero Gradient
                    </label>
                    <div
                      className="w-full h-12 rounded-lg mb-2"
                      style={{ background: palette.gradient }}
                    />
                    <input
                      type="text"
                      value={palette.gradient}
                      onChange={(e) =>
                        updatePaletteField("gradient", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-healthcare-primary/30 focus:border-healthcare-primary font-mono"
                      placeholder="linear-gradient(135deg, #color1, #color2)"
                    />
                  </div>
                </div>
              )}

              {activeTab === "fonts" && (
                <div className="space-y-4">
                  {/* Font Presets */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                      Font Combinations
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONT_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyFontPreset(preset)}
                          className={cn(
                            "relative p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.02]",
                            typography.heading === preset.heading
                              ? "border-healthcare-primary ring-2 ring-healthcare-primary/20"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <p
                            className="text-sm font-semibold text-gray-900 mb-0.5"
                            style={{ fontFamily: preset.heading }}
                          >
                            {preset.name}
                          </p>
                          <p
                            className="text-xs text-gray-500"
                            style={{ fontFamily: preset.body }}
                          >
                            Body text preview
                          </p>
                          {typography.heading === preset.heading && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-healthcare-primary rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Font Input */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">
                        Heading Font
                      </label>
                      <input
                        type="text"
                        value={typography.heading}
                        onChange={(e) =>
                          onTypographyChange({
                            ...typography,
                            heading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-healthcare-primary/30 focus:border-healthcare-primary"
                        placeholder='"Font Name", fallback, sans-serif'
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">
                        Body Font
                      </label>
                      <input
                        type="text"
                        value={typography.body}
                        onChange={(e) =>
                          onTypographyChange({
                            ...typography,
                            body: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-healthcare-primary/30 focus:border-healthcare-primary"
                        placeholder='"Font Name", fallback, sans-serif'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <div className="flex justify-end pt-2 border-t border-gray-100">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset to Default
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeCustomizer;
