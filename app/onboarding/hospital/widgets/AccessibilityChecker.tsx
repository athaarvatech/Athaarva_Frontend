"use client";

/**
 * =============================================================================
 * ACCESSIBILITY (A11Y) CHECKER
 * =============================================================================
 * 
 * A real-time accessibility validator that checks color contrast ratios
 * and other WCAG compliance factors. Essential for healthcare websites
 * which must be accessible to all users.
 * 
 * Features:
 * - WCAG 2.1 AA/AAA contrast ratio calculations
 * - Real-time analysis of theme colors
 * - Actionable suggestions for improvements
 * - Visual pass/fail indicators
 * 
 * =============================================================================
 */

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  Check,
  X,
  AlertTriangle,
  Info,
  Eye,
  Type,
  Contrast,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TemplateBlueprint } from "./templateBlueprints";

// ============================================================================
// TYPES
// ============================================================================

export interface AccessibilityCheckerProps {
  palette: TemplateBlueprint["palette"];
  className?: string;
}

interface ContrastResult {
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
  foreground: string;
  background: string;
  label: string;
}

interface AccessibilityScore {
  overall: "pass" | "warning" | "fail";
  score: number;
  checks: ContrastResult[];
  suggestions: string[];
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 */
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Format contrast ratio for display
 */
function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

// ============================================================================
// ANALYSIS FUNCTION
// ============================================================================

function analyzeAccessibility(palette: TemplateBlueprint["palette"]): AccessibilityScore {
  const checks: ContrastResult[] = [];
  const suggestions: string[] = [];

  // Check 1: Main text on background
  const textOnBg = getContrastRatio(palette.text, palette.background);
  checks.push({
    ratio: textOnBg,
    passAA: textOnBg >= 4.5,
    passAAA: textOnBg >= 7,
    foreground: palette.text,
    background: palette.background,
    label: "Body Text",
  });
  if (textOnBg < 4.5) {
    suggestions.push("Increase contrast between body text and background. Try a darker text color.");
  }

  // Check 2: Muted text on background
  const mutedOnBg = getContrastRatio(palette.textMuted, palette.background);
  checks.push({
    ratio: mutedOnBg,
    passAA: mutedOnBg >= 4.5,
    passAAA: mutedOnBg >= 7,
    foreground: palette.textMuted,
    background: palette.background,
    label: "Muted Text",
  });
  if (mutedOnBg < 4.5) {
    suggestions.push("Muted text may be hard to read. Consider a slightly darker shade.");
  }

  // Check 3: Accent on background
  const accentOnBg = getContrastRatio(palette.accent, palette.background);
  checks.push({
    ratio: accentOnBg,
    passAA: accentOnBg >= 3,
    passAAA: accentOnBg >= 4.5,
    foreground: palette.accent,
    background: palette.background,
    label: "Accent Color",
  });
  if (accentOnBg < 3) {
    suggestions.push("Accent color may not be visible enough against the background.");
  }

  // Check 4: White text on accent (for buttons)
  const whiteOnAccent = getContrastRatio("#FFFFFF", palette.accent);
  checks.push({
    ratio: whiteOnAccent,
    passAA: whiteOnAccent >= 4.5,
    passAAA: whiteOnAccent >= 7,
    foreground: "#FFFFFF",
    background: palette.accent,
    label: "Button Text",
  });
  if (whiteOnAccent < 4.5) {
    suggestions.push("White text on accent buttons may be hard to read. Try a darker accent color.");
  }

  // Check 5: Text on surface
  const textOnSurface = getContrastRatio(palette.text, palette.surface);
  checks.push({
    ratio: textOnSurface,
    passAA: textOnSurface >= 4.5,
    passAAA: textOnSurface >= 7,
    foreground: palette.text,
    background: palette.surface,
    label: "Text on Cards",
  });
  if (textOnSurface < 4.5) {
    suggestions.push("Text may be hard to read on card surfaces. Adjust surface or text color.");
  }

  // Calculate overall score
  const passCount = checks.filter((c) => c.passAA).length;
  const totalChecks = checks.length;
  const score = Math.round((passCount / totalChecks) * 100);

  let overall: "pass" | "warning" | "fail";
  if (score >= 80) {
    overall = "pass";
  } else if (score >= 60) {
    overall = "warning";
  } else {
    overall = "fail";
  }

  return { overall, score, checks, suggestions };
}

// ============================================================================
// CONTRAST BADGE COMPONENT
// ============================================================================

interface ContrastBadgeProps {
  result: ContrastResult;
}

function ContrastBadge({ result }: ContrastBadgeProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {/* Color Preview */}
        <div className="flex items-center">
          <div
            className="w-6 h-6 rounded-l border border-gray-200"
            style={{ backgroundColor: result.background }}
            title={`Background: ${result.background}`}
          />
          <div
            className="w-6 h-6 rounded-r border border-gray-200 border-l-0 flex items-center justify-center"
            style={{ backgroundColor: result.foreground }}
            title={`Foreground: ${result.foreground}`}
          >
            <Type className="w-3 h-3" style={{ color: result.background }} />
          </div>
        </div>

        {/* Label */}
        <div>
          <p className="text-sm font-medium text-gray-900">{result.label}</p>
          <p className="text-xs text-gray-500">{formatRatio(result.ratio)}</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  result.passAA
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                AA {result.passAA ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              WCAG 2.1 Level AA requires {">"}4.5:1 for normal text
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  result.passAAA
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                AAA {result.passAAA ? <Check className="w-3 h-3 inline" /> : <AlertTriangle className="w-3 h-3 inline" />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              WCAG 2.1 Level AAA requires {">"}7:1 for normal text
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AccessibilityChecker({
  palette,
  className,
}: AccessibilityCheckerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const analysis = useMemo(() => analyzeAccessibility(palette), [palette]);

  const statusColors = {
    pass: "bg-green-500",
    warning: "bg-yellow-500",
    fail: "bg-red-500",
  };

  const statusLabels = {
    pass: "Accessible",
    warning: "Needs Review",
    fail: "Issues Found",
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  "text-gray-400 hover:text-white hover:bg-gray-700",
                  className
                )}
              >
                <Accessibility className="w-4 h-4" />
                {/* Status Dot */}
                <span
                  className={cn(
                    "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-900",
                    statusColors[analysis.overall]
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Accessibility: {analysis.score}% ({statusLabels[analysis.overall]})
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end" side="top" sideOffset={8}>
        {/* Header */}
        <div
          className={cn(
            "px-4 py-3 text-white",
            analysis.overall === "pass" && "bg-green-500",
            analysis.overall === "warning" && "bg-yellow-500",
            analysis.overall === "fail" && "bg-red-500"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              <div>
                <h4 className="font-semibold text-sm">Accessibility Score</h4>
                <p className="text-xs opacity-90">{statusLabels[analysis.overall]}</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{analysis.score}%</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Suggestions
              </h5>
              <ul className="space-y-1">
                {analysis.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length === 0 && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <Check className="w-5 h-5" />
              <p className="text-sm font-medium">All contrast checks passed!</p>
            </div>
          )}

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 py-2"
          >
            <span className="flex items-center gap-1">
              <Contrast className="w-4 h-4" />
              Contrast Details
            </span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Contrast Checks */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {analysis.checks.map((check, i) => (
                  <ContrastBadge key={i} result={check} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            Based on WCAG 2.1 accessibility guidelines
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AccessibilityChecker;
