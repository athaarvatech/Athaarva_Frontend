"use client";

/**
 * =============================================================================
 * ON-CANVAS TOOLBAR SYSTEM
 * =============================================================================
 * 
 * A floating toolbar system for inline editing on the template canvas.
 * 
 * ARCHITECTURE:
 * - FloatingToolbar: Anchors to any element, repositions on scroll/resize
 * - SectionToolbar: Quick actions for entire sections (reset, delete, duplicate)
 * - ColorPickerPopover: Inline color picker with presets
 * - QuickActionsDock: Global edit mode controls
 * 
 * HOW TO ADD A NEW EDITABLE SECTION:
 * 1. Wrap your section in <EditableSection>
 * 2. Pass sectionId, title, and onReset callback
 * 3. Use <EditableField> for individual editable elements
 * 4. The toolbar auto-appears on hover/focus
 * 
 * =============================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  RotateCcw,
  Trash2,
  Copy,
  GripVertical,
  Settings2,
  Check,
  X,
  Type,
  Image,
  Link2,
  ChevronDown,
  Move,
  Eye,
  EyeOff,
  Sparkles,
  Wand2,
  Info,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AccessibilityChecker } from "./AccessibilityChecker";
import type { TemplateBlueprint } from "./templateBlueprints";

// ============================================================================
// TYPES
// ============================================================================

export interface FloatingToolbarProps {
  children: React.ReactNode;
  isVisible: boolean;
  position?: "top" | "bottom" | "left" | "right";
  offset?: number;
  anchorRef?: React.RefObject<HTMLElement>;
}

export interface SectionToolbarProps {
  sectionId: string;
  sectionTitle: string;
  isHovered: boolean;
  onReset?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  children?: React.ReactNode;
}

export interface EditableSectionProps {
  sectionId: string;
  sectionTitle: string;
  children: React.ReactNode;
  onReset?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  className?: string;
  accentColor?: string;
  description?: string;
}

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  label?: string;
}

export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface QuickActionsDockProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onResetAll?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
  deviceMode?: DeviceMode;
  onDeviceModeChange?: (mode: DeviceMode) => void;
  /** Color palette for accessibility checker */
  palette?: TemplateBlueprint["palette"];
}

// ============================================================================
// COLOR PRESETS
// ============================================================================

const HEALTHCARE_COLOR_PRESETS = [
  "#0E9F9F", // Healthcare Teal
  "#2563EB", // Medical Blue
  "#059669", // Wellness Green
  "#7C3AED", // Caring Purple
  "#DC2626", // Emergency Red
  "#F97316", // Warm Orange
  "#1E3A8A", // Trust Navy
  "#065F46", // Forest Green
  "#B45309", // Heritage Amber
  "#6D28D9", // Royal Purple
];

const NEUTRAL_PRESETS = [
  "#FFFFFF",
  "#F8FAFC",
  "#F1F5F9",
  "#E2E8F0",
  "#94A3B8",
  "#64748B",
  "#475569",
  "#334155",
  "#1E293B",
  "#0F172A",
];

// ============================================================================
// FLOATING TOOLBAR
// ============================================================================

export function FloatingToolbar({
  children,
  isVisible,
  position = "top",
  offset = 8,
}: FloatingToolbarProps) {
  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: offset };
      case "bottom":
        return { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: offset };
      case "left":
        return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: offset };
      case "right":
        return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: offset };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : -4 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 pointer-events-auto"
          style={getPositionStyles()}
        >
          <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// SECTION TOOLBAR
// ============================================================================

export function SectionToolbar({
  sectionId,
  sectionTitle,
  isHovered,
  onReset,
  onDuplicate,
  onDelete,
  onToggleVisibility,
  isVisible = true,
  children,
}: SectionToolbarProps) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute -top-12 left-4 right-4 z-40 flex items-center justify-between"
        >
          {/* Section Label */}
          <div className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-lg">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            <span className="text-sm font-medium">{sectionTitle}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            {children}
            
            <TooltipProvider>
              {onToggleVisibility && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleVisibility}
                      className="h-8 w-8 p-0"
                    >
                      {isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isVisible ? "Hide section" : "Show section"}
                  </TooltipContent>
                </Tooltip>
              )}

              {onReset && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onReset}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset to default</TooltipContent>
                </Tooltip>
              )}

              {onDuplicate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDuplicate}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate section</TooltipContent>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete section</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// EDITABLE SECTION WRAPPER
// ============================================================================

export function EditableSection({
  sectionId,
  sectionTitle,
  children,
  onReset,
  onDuplicate,
  onDelete,
  isEditMode = true,
  className,
  accentColor,
  description,
}: EditableSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div
      ref={sectionRef}
      className={cn(
        "relative group",
        isHovered && "ring-2 ring-offset-2",
        className
      )}
      style={{
        ["--section-accent" as string]: accentColor || "#0E9F9F",
        ["--tw-ring-color" as string]: accentColor || "#0E9F9F",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Toolbar */}
      <SectionToolbar
        sectionId={sectionId}
        sectionTitle={sectionTitle}
        isHovered={isHovered}
        onReset={onReset}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      {/* Hover Outline */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none border-2 rounded-lg z-30"
            style={{ borderColor: accentColor || "#0E9F9F" }}
          />
        )}
      </AnimatePresence>

      {/* Description tooltip */}
      {isHovered && description && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 z-40 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm max-w-xs shadow-lg"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{description}</span>
          </div>
        </motion.div>
      )}

      {children}
    </div>
  );
}

// ============================================================================
// COLOR PICKER POPOVER
// ============================================================================

export function ColorPickerPopover({
  value,
  onChange,
  presets = HEALTHCARE_COLOR_PRESETS,
  label = "Color",
}: ColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setLocalValue(color);
    onChange(color);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200",
            "hover:border-gray-300 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-healthcare-primary/30"
          )}
        >
          <div
            className="w-6 h-6 rounded-md border border-gray-300 shadow-inner"
            style={{ backgroundColor: localValue }}
          />
          <span className="text-sm text-gray-700">{label}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          {/* Custom Color Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">
              Custom Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localValue}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={localValue}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Healthcare Presets */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">
              Healthcare Colors
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 transition-all",
                    localValue === color
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Neutral Presets */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">
              Neutrals
            </label>
            <div className="grid grid-cols-5 gap-2">
              {NEUTRAL_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 transition-all",
                    localValue === color
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-200 hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// QUICK ACTIONS DOCK
// ============================================================================

export function QuickActionsDock({
  isEditMode,
  onToggleEditMode,
  onResetAll,
  onSave,
  isSaving = false,
  hasChanges = false,
  deviceMode = "desktop",
  onDeviceModeChange,
  palette,
}: QuickActionsDockProps) {
  const deviceModes: { mode: DeviceMode; icon: React.ReactNode; label: string }[] = [
    { mode: "desktop", icon: <Monitor className="w-4 h-4" />, label: "Desktop" },
    { mode: "tablet", icon: <Tablet className="w-4 h-4" />, label: "Tablet" },
    { mode: "mobile", icon: <Smartphone className="w-4 h-4" />, label: "Mobile" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 shadow-2xl">
        {/* Edit Mode Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleEditMode}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  isEditMode
                    ? "bg-healthcare-primary text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                {isEditMode ? (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Editing</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Preview</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isEditMode ? "Switch to preview mode" : "Switch to edit mode"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="w-px h-6 bg-gray-700" />

        {/* Device Mode Toggle */}
        {onDeviceModeChange && (
          <>
            <div className="flex items-center gap-1 bg-gray-800 rounded-full p-1">
              {deviceModes.map(({ mode, icon, label }) => (
                <TooltipProvider key={mode}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onDeviceModeChange(mode)}
                        className={cn(
                          "p-2 rounded-full transition-all",
                          deviceMode === mode
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                        )}
                      >
                        {icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{label} view</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <div className="w-px h-6 bg-gray-700" />
          </>
        )}

        {/* Reset All */}
        {onResetAll && isEditMode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onResetAll}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Reset all changes</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Accessibility Checker */}
        {palette && isEditMode && (
          <>
            <div className="w-px h-6 bg-gray-700" />
            <AccessibilityChecker palette={palette} className="text-white" />
          </>
        )}

        {/* Save Button */}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              hasChanges
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {hasChanges ? "Save" : "Saved"}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// TOOLBAR BUTTON COMPONENT
// ============================================================================

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  variant?: "default" | "danger";
}

export function ToolbarButton({
  icon,
  label,
  onClick,
  isActive = false,
  variant = "default",
}: ToolbarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "p-2 rounded-md transition-colors",
              variant === "danger"
                ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                : isActive
                ? "bg-healthcare-primary/10 text-healthcare-primary"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// EDITABLE FIELD WRAPPER
// ============================================================================

export interface EditableFieldProps {
  children: React.ReactNode;
  label: string;
  onReset?: () => void;
  className?: string;
  showLabel?: boolean;
}

export function EditableField({
  children,
  label,
  onReset,
  className,
  showLabel = false,
}: EditableFieldProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Field Label */}
      <AnimatePresence>
        {isHovered && showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -top-6 left-0 z-40"
          >
            <span className="text-[10px] font-medium bg-gray-900 text-white px-2 py-0.5 rounded">
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover outline */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-1 border-2 border-dashed border-healthcare-primary/50 rounded pointer-events-none z-30"
          />
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}

export default {
  FloatingToolbar,
  SectionToolbar,
  EditableSection,
  ColorPickerPopover,
  QuickActionsDock,
  ToolbarButton,
  EditableField,
};
