"use client";

/**
 * =============================================================================
 * EMPTY STATE PLACEHOLDER
 * =============================================================================
 * 
 * A reusable component for empty sections on the canvas, providing:
 * - Visual indication that content is missing
 * - One-click action to add content
 * - Contextual icons and messaging
 * 
 * =============================================================================
 */

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Image,
  Type,
  Users,
  Stethoscope,
  Shield,
  DollarSign,
  FileText,
  MessageSquare,
  Building2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ============================================================================
// TYPES
// ============================================================================

export type PlaceholderType =
  | "doctor"
  | "service"
  | "specialty"
  | "testimonial"
  | "certification"
  | "document"
  | "facility"
  | "pricing"
  | "image"
  | "text"
  | "appointment"
  | "generic";

export interface EmptyStatePlaceholderProps {
  type: PlaceholderType;
  title?: string;
  description?: string;
  onAdd: () => void;
  isEditMode?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// ============================================================================
// CONFIG
// ============================================================================

const PLACEHOLDER_CONFIG: Record<
  PlaceholderType,
  { icon: React.ComponentType<{ className?: string }>; defaultTitle: string; defaultDesc: string }
> = {
  doctor: {
    icon: Users,
    defaultTitle: "Add a Doctor",
    defaultDesc: "Showcase your medical professionals",
  },
  service: {
    icon: Stethoscope,
    defaultTitle: "Add a Service",
    defaultDesc: "List medical services you offer",
  },
  specialty: {
    icon: Stethoscope,
    defaultTitle: "Add a Specialty",
    defaultDesc: "Highlight your areas of expertise",
  },
  testimonial: {
    icon: MessageSquare,
    defaultTitle: "Add a Testimonial",
    defaultDesc: "Share patient success stories",
  },
  certification: {
    icon: Shield,
    defaultTitle: "Add a Certification",
    defaultDesc: "Display accreditations and compliance",
  },
  document: {
    icon: FileText,
    defaultTitle: "Add a Document",
    defaultDesc: "Upload legal or policy documents",
  },
  facility: {
    icon: Building2,
    defaultTitle: "Add Facility Info",
    defaultDesc: "Showcase your facilities and equipment",
  },
  pricing: {
    icon: DollarSign,
    defaultTitle: "Add Pricing",
    defaultDesc: "Display consultation and package pricing",
  },
  image: {
    icon: Image,
    defaultTitle: "Add an Image",
    defaultDesc: "Upload a photo or graphic",
  },
  text: {
    icon: Type,
    defaultTitle: "Add Content",
    defaultDesc: "Write your text here",
  },
  appointment: {
    icon: Calendar,
    defaultTitle: "Add Appointment Type",
    defaultDesc: "Configure booking options",
  },
  generic: {
    icon: Plus,
    defaultTitle: "Add Item",
    defaultDesc: "Click to add content",
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EmptyStatePlaceholder({
  type,
  title,
  description,
  onAdd,
  isEditMode = true,
  className,
  size = "md",
}: EmptyStatePlaceholderProps) {
  const config = PLACEHOLDER_CONFIG[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayDesc = description || config.defaultDesc;

  // Don't show placeholder in preview mode
  if (!isEditMode) return null;

  const sizeClasses = {
    sm: "py-6 px-4",
    md: "py-10 px-6",
    lg: "py-16 px-8",
  };

  const iconSizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative rounded-xl border-2 border-dashed border-gray-300",
        "bg-gradient-to-br from-gray-50 to-gray-100",
        "flex flex-col items-center justify-center text-center",
        "cursor-pointer group",
        "hover:border-gray-400 hover:bg-gray-100 transition-all duration-200",
        sizeClasses[size],
        className
      )}
      onClick={onAdd}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl",
          "bg-white shadow-sm border border-gray-200",
          "group-hover:shadow-md group-hover:border-gray-300 transition-all",
          "mb-4 p-4"
        )}
      >
        <Icon
          className={cn(
            iconSizeClasses[size],
            "text-gray-400 group-hover:text-gray-600 transition-colors"
          )}
        />
      </div>

      {/* Text */}
      <h4
        className={cn(
          "font-semibold text-gray-700 group-hover:text-gray-900 transition-colors",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-lg"
        )}
      >
        {displayTitle}
      </h4>
      <p
        className={cn(
          "text-gray-500 mt-1",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base"
        )}
      >
        {displayDesc}
      </p>

      {/* Add Button - appears on hover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Button
          variant="default"
          size={size === "sm" ? "sm" : "default"}
          className="shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          {displayTitle}
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// INLINE ADD BUTTON (for adding items within a list)
// ============================================================================

export interface InlineAddButtonProps {
  type: PlaceholderType;
  label?: string;
  onAdd: () => void;
  isEditMode?: boolean;
  className?: string;
}

export function InlineAddButton({
  type,
  label,
  onAdd,
  isEditMode = true,
  className,
}: InlineAddButtonProps) {
  const config = PLACEHOLDER_CONFIG[type];
  const displayLabel = label || config.defaultTitle;

  if (!isEditMode) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-lg w-full",
        "border-2 border-dashed border-gray-300",
        "text-gray-600 hover:text-gray-900",
        "hover:border-gray-400 hover:bg-gray-50",
        "transition-all duration-200",
        className
      )}
    >
      <Plus className="w-5 h-5" />
      <span className="text-sm font-medium">{displayLabel}</span>
    </motion.button>
  );
}

export default EmptyStatePlaceholder;
