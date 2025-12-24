"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Type, Image, CheckCircle2 } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { FileUploadZone } from "../widgets/FileUploadZone";
import { ContrastChecker } from "../widgets/ContrastChecker";
import { HelpPopover } from "../widgets/HelpPopover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { calculateAccessibilityScore } from "@/lib/onboarding-utils";

const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Source Sans Pro",
];

const COLOR_PRESETS = [
  {
    name: "Healthcare Teal",
    primary: "#007C7C",
    secondary: "#20B2AA",
    accent: "#10B981",
    neutral: "#6B7280",
  },
  {
    name: "Medical Blue",
    primary: "#1E40AF",
    secondary: "#3B82F6",
    accent: "#60A5FA",
    neutral: "#6B7280",
  },
  {
    name: "Wellness Green",
    primary: "#059669",
    secondary: "#10B981",
    accent: "#34D399",
    neutral: "#6B7280",
  },
  {
    name: "Premium Purple",
    primary: "#7C3AED",
    secondary: "#8B5CF6",
    accent: "#A78BFA",
    neutral: "#6B7280",
  },
];

export default function BrandingStudioStep() {
  const { data, updateData } = useHospitalOnboarding();
  const branding = data.branding;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

  // Calculate accessibility score whenever colors change
  useEffect(() => {
    const score = calculateAccessibilityScore(
      branding.colors.primary,
      branding.colors.secondary,
      branding.colors.accent
    );
    if (score !== branding.accessibility_score) {
      updateData("branding", { accessibility_score: score });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    branding.colors.primary,
    branding.colors.secondary,
    branding.colors.accent,
  ]);

  const applyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    updateData("branding", {
      colors: {
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent,
        neutral: preset.neutral,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs for different branding sections */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="w-4 h-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="assets">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="w-4 h-4 mr-2" />
            Assets
          </TabsTrigger>
        </TabsList>

        {/* COLORS TAB */}
        <TabsContent value="colors" className="space-y-6 mt-6">
          {/* Color Presets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Color Palette
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose colors that represent your brand
                </p>
              </div>
              <Badge className="bg-healthcare-emerald">
                Score: {branding.accessibility_score.toFixed(1)}
              </Badge>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-healthcare-primary transition-all"
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
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: preset.accent }}
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
              <ColorPicker
                label="Primary Color"
                value={branding.colors.primary}
                onChange={(color) =>
                  updateData("branding", {
                    colors: { ...branding.colors, primary: color },
                  })
                }
                help={{
                  title: "Primary Color",
                  content:
                    "Your main brand color. Used for headers, buttons, and key UI elements.",
                  tips: [
                    "Choose a color that represents your brand identity",
                    "Ensure good contrast with white backgrounds",
                  ],
                }}
              />

              <ColorPicker
                label="Secondary Color"
                value={branding.colors.secondary}
                onChange={(color) =>
                  updateData("branding", {
                    colors: { ...branding.colors, secondary: color },
                  })
                }
                help={{
                  title: "Secondary Color",
                  content:
                    "Supporting color for accents, links, and secondary actions.",
                }}
              />

              <ColorPicker
                label="Accent Color"
                value={branding.colors.accent}
                onChange={(color) =>
                  updateData("branding", {
                    colors: { ...branding.colors, accent: color },
                  })
                }
                help={{
                  title: "Accent Color",
                  content:
                    "Used for highlights, success states, and call-to-action elements.",
                }}
              />

              <ColorPicker
                label="Neutral Color"
                value={branding.colors.neutral}
                onChange={(color) =>
                  updateData("branding", {
                    colors: { ...branding.colors, neutral: color },
                  })
                }
                help={{
                  title: "Neutral Color",
                  content: "Used for text, borders, and subtle backgrounds.",
                }}
              />
            </div>
          </motion.div>

          {/* Contrast Checkers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <ContrastChecker
              foreground={branding.colors.primary}
              background="#FFFFFF"
              label="Primary on White"
            />
            <ContrastChecker
              foreground={branding.colors.secondary}
              background="#FFFFFF"
              label="Secondary on White"
            />
          </motion.div>
        </TabsContent>

        {/* TYPOGRAPHY TAB */}
        <TabsContent value="typography" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Typography Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Heading Font"
                help={{
                  title: "Heading Font",
                  content: "Font used for headings, titles, and important text",
                  tips: [
                    "Choose a bold, readable font",
                    "Sans-serif fonts work well for healthcare",
                  ],
                }}
              >
                <Select
                  value={branding.typography.heading_font}
                  onValueChange={(value) =>
                    updateData("branding", {
                      typography: {
                        ...branding.typography,
                        heading_font: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Body Font"
                help={{
                  title: "Body Font",
                  content:
                    "Font used for body text, paragraphs, and descriptions",
                  tips: [
                    "Choose a highly readable font",
                    "Can be the same as heading font for consistency",
                  ],
                }}
              >
                <Select
                  value={branding.typography.body_font}
                  onValueChange={(value) =>
                    updateData("branding", {
                      typography: { ...branding.typography, body_font: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Typography Preview */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Preview
              </h4>
              <div style={{ fontFamily: branding.typography.heading_font }}>
                <h1
                  className="text-3xl font-bold mb-2"
                  style={{ color: branding.colors.primary }}
                >
                  Welcome to Our Hospital
                </h1>
                <h2
                  className="text-2xl font-semibold mb-2"
                  style={{ color: branding.colors.secondary }}
                >
                  Quality Healthcare for Everyone
                </h2>
              </div>
              <div
                style={{ fontFamily: branding.typography.body_font }}
                className="mt-4"
              >
                <p className="text-base text-gray-700 leading-relaxed">
                  Our mission is to provide exceptional healthcare services with
                  compassion and expertise. We combine cutting-edge medical
                  technology with personalized care to ensure the best possible
                  outcomes for our patients.
                </p>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* ASSETS TAB */}
        <TabsContent value="assets" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Brand Assets
            </h3>

            <div className="space-y-6">
              {/* Logo */}
              <FileUploadZone
                label="Hospital Logo"
                description="Upload your hospital logo (PNG, JPG, or SVG)"
                currentFile={branding.logo_file}
                currentUrl={branding.logo_url}
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

              {/* Hero/Background */}
              <FileUploadZone
                label="Hero Background Image"
                description="Large background image for your homepage hero section"
                currentFile={branding.hero_asset_file}
                currentUrl={branding.hero_asset_url}
                onFileSelect={(file) =>
                  updateData("branding", { hero_asset_file: file })
                }
                onFileRemove={() =>
                  updateData("branding", {
                    hero_asset_file: null,
                    hero_asset_url: "",
                  })
                }
                onUploadComplete={(url) =>
                  updateData("branding", { hero_asset_url: url })
                }
                accept="image/*"
                maxSizeMB={5}
                preview
              />

              {/* Favicon */}
              <FileUploadZone
                label="Favicon"
                description="Small icon for browser tabs (PNG, ICO)"
                currentFile={branding.favicon_file}
                currentUrl={branding.favicon_url}
                onFileSelect={(file) =>
                  updateData("branding", { favicon_file: file })
                }
                onFileRemove={() =>
                  updateData("branding", {
                    favicon_file: null,
                    favicon_url: "",
                  })
                }
                onUploadComplete={(url) =>
                  updateData("branding", { favicon_url: url })
                }
                accept="image/png,image/x-icon"
                maxSizeMB={1}
                preview={false}
              />
            </div>
          </motion.div>

          {/* Accessibility Summary */}
          {branding.accessibility_score >= 4.5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-healthcare-emerald/10 border border-healthcare-emerald/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-healthcare-emerald" />
                <div>
                  <h4 className="text-sm font-semibold text-healthcare-emerald">
                    Excellent Accessibility!
                  </h4>
                  <p className="text-xs text-gray-700 mt-1">
                    Your color palette meets WCAG AA standards for contrast and
                    accessibility.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  help?: {
    title: string;
    content: string;
    tips?: string[];
  };
}

function ColorPicker({ label, value, onChange, help }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {help && <HelpPopover {...help} />}
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#007C7C"
          className="flex-1 font-mono"
        />
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  help?: {
    title: string;
    content: string;
    tips?: string[];
  };
  children: React.ReactNode;
}

function FormField({ label, help, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {help && <HelpPopover {...help} />}
      </div>
      {children}
    </div>
  );
}
