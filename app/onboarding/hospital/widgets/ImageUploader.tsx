"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Camera, Trash2, RefreshCw, ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageToolbox, type ImageCategory } from "@/components/onboarding/ImageToolbox";

export interface UploadedImage {
  file: File | null;
  previewUrl: string;
  originalUrl?: string;
  source?: "upload" | "stock" | "ai" | "recent";
}

export interface ImageUploaderProps {
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  aspectRatio?: "square" | "landscape" | "portrait" | "banner" | "logo";
  maxSizeMB?: number;
  acceptedTypes?: string[];
  placeholder?: string;
  className?: string;
  variant?: "default" | "compact" | "circle" | "hero";
  showOverlay?: boolean;
  disabled?: boolean;
  /** Enable the ImageToolbox for stock images, AI generation, etc. */
  enableToolbox?: boolean;
  /** Category for ImageToolbox filtering */
  toolboxCategory?: ImageCategory;
}

const aspectRatioClasses = {
  square: "aspect-square",
  landscape: "aspect-video",
  portrait: "aspect-[3/4]",
  banner: "aspect-[21/9]",
  logo: "aspect-[3/1]",
};

/**
 * ImageUploader - A component for uploading and previewing images in the canvas editor.
 * Supports drag-and-drop, click to upload, and preview with remove functionality.
 * Now also supports ImageToolbox integration for stock images, AI generation, etc.
 */
export function ImageUploader({
  value,
  onChange,
  aspectRatio = "landscape",
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  placeholder = "Click or drag to upload",
  className,
  variant = "default",
  showOverlay = true,
  disabled = false,
  enableToolbox = false,
  toolboxCategory = "general",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler for ImageToolbox selection
  const handleToolboxSelect = useCallback((url: string, metadata?: { source: "ai" | "stock" | "upload" | "recent" }) => {
    setError(null);
    onChange({
      file: null,
      previewUrl: url,
      originalUrl: value?.originalUrl,
      source: metadata?.source || "stock",
    });
  }, [onChange, value?.originalUrl]);

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null);

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        setError("Invalid file type. Please upload an image.");
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      onChange({
        file,
        previewUrl,
        originalUrl: value?.originalUrl,
        source: "upload",
      });
    },
    [acceptedTypes, maxSizeMB, onChange, value?.originalUrl]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value?.previewUrl && value.file) {
      URL.revokeObjectURL(value.previewUrl);
    }
    onChange(null);
    setError(null);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value?.originalUrl) {
      onChange({
        file: null,
        previewUrl: value.originalUrl,
        originalUrl: value.originalUrl,
      });
    }
    setError(null);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const hasImage = value?.previewUrl;
  const hasCustomImage = value?.file !== null;

  return (
    <div className={cn("relative group", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-200",
          aspectRatioClasses[aspectRatio],
          variant === "circle" && "rounded-full aspect-square",
          variant === "hero" && "rounded-3xl",
          variant === "compact" && "rounded-lg",
          variant === "default" && "rounded-xl",
          isDragging && "ring-4 ring-healthcare-primary ring-offset-2",
          !hasImage &&
            "border-2 border-dashed border-gray-300 hover:border-healthcare-primary bg-gray-50 hover:bg-gray-100",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-400 bg-red-50"
        )}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
      >
        {/* Image Preview */}
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.previewUrl}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />

            {/* Overlay with actions */}
            {showOverlay && !disabled && (
              <div
                className={cn(
                  "absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200",
                  "flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
                )}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClick}
                  className="bg-white/90 hover:bg-white"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Change
                </Button>
                {hasCustomImage && value?.originalUrl && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    className="bg-white/90 hover:bg-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={handleRemove}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Custom badge */}
            {hasCustomImage && (
              <div className="absolute top-2 right-2 bg-healthcare-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                Custom
              </div>
            )}
          </>
        ) : (
          /* Upload placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div
              className={cn(
                "p-3 rounded-full mb-3 transition-colors",
                isDragging
                  ? "bg-healthcare-primary/20"
                  : "bg-gray-100 group-hover:bg-healthcare-primary/10"
              )}
            >
              {variant === "circle" ? (
                <Camera
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isDragging
                      ? "text-healthcare-primary"
                      : "text-gray-400 group-hover:text-healthcare-primary"
                  )}
                />
              ) : (
                <Upload
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isDragging
                      ? "text-healthcare-primary"
                      : "text-gray-400 group-hover:text-healthcare-primary"
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                "text-sm font-medium transition-colors",
                isDragging ? "text-healthcare-primary" : "text-gray-600"
              )}
            >
              {isDragging ? "Drop image here" : placeholder}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, WebP up to {maxSizeMB}MB
            </p>
            
            {/* ImageToolbox Integration */}
            {enableToolbox && !disabled && (
              <div className="mt-3 flex gap-2">
                <ImageToolbox
                  onImageSelect={handleToolboxSelect}
                  category={toolboxCategory}
                  currentImage={value?.previewUrl}
                  title="Choose Image"
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ImageIcon className="w-3 h-3 mr-1" />
                      Stock
                    </Button>
                  }
                />
                <ImageToolbox
                  onImageSelect={handleToolboxSelect}
                  category={toolboxCategory}
                  currentImage={value?.previewUrl}
                  title="AI Image Generator"
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generate
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-600 mt-2 flex items-center"
          >
            <X className="w-3 h-3 mr-1" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * LogoUploader - Specialized uploader for hospital logos
 */
export function LogoUploader(
  props: Omit<ImageUploaderProps, "aspectRatio" | "variant">
) {
  return (
    <ImageUploader
      {...props}
      aspectRatio="logo"
      variant="default"
      placeholder="Upload hospital logo"
    />
  );
}

/**
 * AvatarUploader - Specialized uploader for doctor/staff photos
 */
export function AvatarUploader(
  props: Omit<ImageUploaderProps, "aspectRatio" | "variant">
) {
  return (
    <ImageUploader
      {...props}
      aspectRatio="square"
      variant="circle"
      placeholder="Upload photo"
    />
  );
}

/**
 * HeroImageUploader - Specialized uploader for hero section images
 * Includes ImageToolbox integration for stock images and AI generation
 */
export function HeroImageUploader(
  props: Omit<ImageUploaderProps, "aspectRatio" | "variant" | "enableToolbox" | "toolboxCategory">
) {
  return (
    <ImageUploader
      {...props}
      aspectRatio="landscape"
      variant="hero"
      placeholder="Upload hero image or video thumbnail"
      enableToolbox={true}
      toolboxCategory="banner"
    />
  );
}

/**
 * FacilityImageUploader - Specialized uploader for facility photos
 * Includes ImageToolbox integration for stock images
 */
export function FacilityImageUploader(
  props: Omit<ImageUploaderProps, "aspectRatio" | "variant" | "enableToolbox" | "toolboxCategory">
) {
  return (
    <ImageUploader
      {...props}
      aspectRatio="landscape"
      variant="default"
      placeholder="Upload facility photo"
      enableToolbox={true}
      toolboxCategory="general"
    />
  );
}

export default ImageUploader;
