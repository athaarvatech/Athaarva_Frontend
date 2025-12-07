"use client";

/**
 * =============================================================================
 * CANVAS THEME PANEL - Floating Theme Selection
 * =============================================================================
 * 
 * A floating, collapsible panel that appears on the canvas during edit mode,
 * allowing users to quickly apply theme presets or customize colors/fonts.
 * 
 * Features:
 * - Minimized state: Small floating button with current theme indicator
 * - Expanded state: Full ThemePresets panel in a floating card
 * - Smooth animations with Framer Motion
 * - Position: Fixed bottom-left (opposite to QuickActionsDock)
 * 
 * =============================================================================
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemePresets, THEME_PRESETS, type ThemePreset } from "./ThemePresets";
import type { TemplateBlueprint } from "./templateBlueprints";

// ============================================================================
// TYPES
// ============================================================================

export interface CanvasThemePanelProps {
  isEditMode: boolean;
  currentPalette: TemplateBlueprint["palette"];
  currentTypography: TemplateBlueprint["typography"];
  onApplyPreset: (preset: ThemePreset) => void;
  onPaletteChange: (palette: TemplateBlueprint["palette"]) => void;
  onTypographyChange: (typography: TemplateBlueprint["typography"]) => void;
  originalPalette?: TemplateBlueprint["palette"];
  originalTypography?: TemplateBlueprint["typography"];
}

// ============================================================================
// MINIMIZED BUTTON COMPONENT
// ============================================================================

interface MinimizedButtonProps {
  currentAccent: string;
  onClick: () => void;
}

function MinimizedButton({ currentAccent, onClick }: MinimizedButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-full shadow-lg",
        "bg-white border border-gray-200",
        "hover:shadow-xl transition-shadow",
        "group"
      )}
    >
      {/* Color indicator */}
      <div
        className="w-6 h-6 rounded-full border-2 border-white shadow-inner"
        style={{ backgroundColor: currentAccent }}
      />
      <span className="text-sm font-medium text-gray-700">Theme</span>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </motion.button>
  );
}

// ============================================================================
// EXPANDED PANEL COMPONENT
// ============================================================================

interface ExpandedPanelProps {
  currentPalette: TemplateBlueprint["palette"];
  currentTypography: TemplateBlueprint["typography"];
  onApplyPreset: (preset: ThemePreset) => void;
  onPaletteChange: (palette: TemplateBlueprint["palette"]) => void;
  onTypographyChange: (typography: TemplateBlueprint["typography"]) => void;
  originalPalette?: TemplateBlueprint["palette"];
  originalTypography?: TemplateBlueprint["typography"];
  onCollapse: () => void;
}

function ExpandedPanel({
  currentPalette,
  currentTypography,
  onApplyPreset,
  onPaletteChange,
  onTypographyChange,
  originalPalette,
  originalTypography,
  onCollapse,
}: ExpandedPanelProps) {
  return (
    <motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "w-[340px] max-h-[calc(100vh-200px)] overflow-hidden",
        "bg-white rounded-2xl shadow-2xl border border-gray-200",
        "flex flex-col"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Theme Studio</h3>
            <p className="text-xs text-gray-500">One-click styling</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="w-8 h-8 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <ThemePresets
          currentPalette={currentPalette}
          currentTypography={currentTypography}
          onApplyPreset={onApplyPreset}
          onPaletteChange={onPaletteChange}
          onTypographyChange={onTypographyChange}
          originalPalette={originalPalette}
          originalTypography={originalTypography}
        />
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CanvasThemePanel({
  isEditMode,
  currentPalette,
  currentTypography,
  onApplyPreset,
  onPaletteChange,
  onTypographyChange,
  originalPalette,
  originalTypography,
}: CanvasThemePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if not in edit mode
  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <ExpandedPanel
            key="expanded"
            currentPalette={currentPalette}
            currentTypography={currentTypography}
            onApplyPreset={onApplyPreset}
            onPaletteChange={onPaletteChange}
            onTypographyChange={onTypographyChange}
            originalPalette={originalPalette}
            originalTypography={originalTypography}
            onCollapse={() => setIsExpanded(false)}
          />
        ) : (
          <MinimizedButton
            key="minimized"
            currentAccent={currentPalette.accent}
            onClick={() => setIsExpanded(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CanvasThemePanel;
