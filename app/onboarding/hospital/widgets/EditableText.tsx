"use client";

import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// EDIT MODE CONTEXT
// ============================================================================
// This context allows templates to set isEditMode once at the top level,
// and all EditableText components will automatically respect it.
// This eliminates the need to pass disabled={!isEditMode} to every EditableText.

interface EditModeContextType {
  isEditMode: boolean;
}

const EditModeContext = createContext<EditModeContextType>({ isEditMode: true });

/**
 * EditModeProvider - Wrap templates with this to control edit mode for all EditableText components
 * 
 * @example
 * <EditModeProvider isEditMode={false}>
 *   <MyTemplate />  // All EditableText components inside will be disabled
 * </EditModeProvider>
 */
export function EditModeProvider({ 
  children, 
  isEditMode 
}: { 
  children: React.ReactNode; 
  isEditMode: boolean;
}) {
  return (
    <EditModeContext.Provider value={{ isEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

/**
 * Hook to get the current edit mode state from context
 */
export function useEditMode() {
  return useContext(EditModeContext);
}

export interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  editIndicator?: "icon" | "border" | "both" | "none";
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * EditableText - A component that renders clean text but becomes editable on click.
 * Designed for the website builder/canvas experience.
 *
 * Features:
 * - Clean read-only appearance by default
 * - Subtle hover indicator showing it's editable (only when NOT disabled)
 * - Click to edit inline
 * - Auto-resize for textareas
 * - Escape to cancel, Enter to save (for single-line)
 * - When disabled=true, renders as pure static text with NO interactive behaviors
 */
export function EditableText({
  value,
  onChange,
  as: Component = "span",
  className,
  placeholder = "Click to edit...",
  multiline = false,
  maxLength,
  editIndicator = "both",
  disabled: propDisabled = false,
  style,
}: EditableTextProps) {
  // Get edit mode from context - if context says not editing, component is disabled
  const { isEditMode } = useEditMode();
  
  // Component is disabled if prop says disabled OR if context says not in edit mode
  const disabled = propDisabled || !isEditMode;
  
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local value when prop changes
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = useCallback(() => {
    if (disabled) return;
    setLocalValue(value);
    setIsEditing(true);
  }, [disabled, value]);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  }, [localValue, value, onChange]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setLocalValue(value);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      } else if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        handleSave();
      }
    },
    [handleCancel, handleSave, multiline]
  );

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (inputRef.current && multiline) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [multiline]);

  useEffect(() => {
    if (isEditing && multiline) {
      adjustTextareaHeight();
    }
  }, [isEditing, localValue, multiline, adjustTextareaHeight]);

  // =========================================================================
  // DISABLED MODE: Render as pure static text with NO interactive behaviors
  // This is used for deployed/production hospital websites
  // =========================================================================
  if (disabled) {
    return (
      <Component
        className={cn(className, !value && "text-gray-400 italic")}
        style={style}
      >
        {value || placeholder}
      </Component>
    );
  }

  // =========================================================================
  // EDIT MODE: Show input/textarea for editing
  // =========================================================================
  if (isEditing) {
    const inputClassName = cn(
      "w-full bg-transparent border-2 border-healthcare-primary rounded-md px-2 py-1",
      "focus:outline-none focus:ring-2 focus:ring-healthcare-primary/30",
      "transition-all duration-200",
      className
    );

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={(e) => {
            const newVal = maxLength
              ? e.target.value.slice(0, maxLength)
              : e.target.value;
            setLocalValue(newVal);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            inputClassName,
            "resize-none overflow-hidden min-h-[2em]"
          )}
          style={style}
          placeholder={placeholder}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => {
          const newVal = maxLength
            ? e.target.value.slice(0, maxLength)
            : e.target.value;
          setLocalValue(newVal);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={inputClassName}
        style={style}
        placeholder={placeholder}
      />
    );
  }

  // =========================================================================
  // VIEW MODE (EDITABLE): Show text with hover effects and edit indicators
  // Only shown when NOT disabled and NOT editing
  // =========================================================================
  const showBorder = editIndicator === "border" || editIndicator === "both";
  const showIcon = editIndicator === "icon" || editIndicator === "both";

  // Use span wrapper when component is inline (span, p) to avoid hydration errors
  // from having div inside p
  const isInlineComponent = Component === "span" || Component === "p";
  const WrapperComponent = isInlineComponent ? motion.span : motion.div;

  return (
    <WrapperComponent
      ref={containerRef}
      onClick={handleStartEdit}
      className={cn(
        "group relative inline-block cursor-pointer rounded-md transition-all duration-200",
        showBorder && "hover:ring-2 hover:ring-healthcare-primary/40 hover:ring-offset-2",
        "hover:bg-black/5"
      )}
      whileHover={{ scale: 1.005 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStartEdit();
        }
      }}
      aria-label={`Edit: ${value || placeholder}`}
    >
      <Component
        className={cn(className, !value && "text-gray-400 italic")}
        style={style}
      >
        {value || placeholder}
      </Component>

      {/* Edit indicator icon - only shown in edit mode */}
      {showIcon && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "absolute -right-2 -top-2 p-1 rounded-full",
            "bg-healthcare-primary text-white shadow-md",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "pointer-events-none"
          )}
        >
          <Pencil className="w-3 h-3" />
        </motion.span>
      )}

      {/* Tooltip on hover - only shown in edit mode */}
      <span
        className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs",
          "bg-gray-900 text-white whitespace-nowrap",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "pointer-events-none z-10"
        )}
      >
        Click to edit
      </span>
    </WrapperComponent>
  );
}

/**
 * EditableStatValue - Specialized editable component for stat values
 */
export interface EditableStatProps {
  value: string;
  label: string;
  onValueChange: (newValue: string) => void;
  onLabelChange: (newLabel: string) => void;
  valueClassName?: string;
  labelClassName?: string;
  accentColor?: string;
  disabled?: boolean;
}

export function EditableStat({
  value,
  label,
  onValueChange,
  onLabelChange,
  valueClassName,
  labelClassName,
  accentColor,
  disabled = false,
}: EditableStatProps) {
  return (
    <div className="text-center space-y-1">
      <EditableText
        value={value}
        onChange={onValueChange}
        as="p"
        className={cn("text-3xl font-bold", valueClassName)}
        style={{ color: accentColor }}
        placeholder="00"
        editIndicator="border"
        disabled={disabled}
      />
      <EditableText
        value={label}
        onChange={onLabelChange}
        as="p"
        className={cn(
          "text-xs uppercase tracking-wide text-slate-500",
          labelClassName
        )}
        placeholder="Label"
        editIndicator="none"
        disabled={disabled}
      />
    </div>
  );
}

/**
 * EditableListItem - For editable list items (like specialties, differentiators)
 */
export interface EditableListItemProps {
  title: string;
  description: string;
  icon?: string;
  onTitleChange: (newTitle: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  onIconChange?: (newIcon: string) => void;
  className?: string;
  disabled?: boolean;
}

export function EditableListItem({
  title,
  description,
  icon,
  onTitleChange,
  onDescriptionChange,
  onIconChange,
  className,
  disabled = false,
}: EditableListItemProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3">
        {icon !== undefined && onIconChange && (
          <EditableText
            value={icon}
            onChange={onIconChange}
            className="text-3xl"
            placeholder="🏥"
            editIndicator="none"
            disabled={disabled}
          />
        )}
        <EditableText
          value={title}
          onChange={onTitleChange}
          as="h3"
          className="text-lg font-semibold text-slate-900"
          placeholder="Title"
          editIndicator="border"
          disabled={disabled}
        />
      </div>
      <EditableText
        value={description}
        onChange={onDescriptionChange}
        as="p"
        className="text-sm text-slate-600"
        placeholder="Add a description..."
        multiline
        editIndicator="none"
        disabled={disabled}
      />
    </div>
  );
}

export default EditableText;
