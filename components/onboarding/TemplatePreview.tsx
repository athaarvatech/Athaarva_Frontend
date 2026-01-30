"use client";

/**
 * TemplatePreview - Phase 3: Onboarding UX Redesign
 * 
 * Full-width responsive preview component with:
 * - Device toggles (mobile, tablet, desktop)
 * - Zoom controls
 * - Real-time updates
 * - Multiple view modes (website, login, documents)
 */

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Tablet,
  Monitor,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Eye,
  FileText,
  Lock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceType = "mobile" | "tablet" | "desktop";
type ViewMode = "website" | "login" | "documents";

interface TemplatePreviewProps {
  children: React.ReactNode;
  className?: string;
  defaultDevice?: DeviceType;
  defaultViewMode?: ViewMode;
  showDeviceControls?: boolean;
  showZoomControls?: boolean;
  showViewModeToggle?: boolean;
  onDeviceChange?: (device: DeviceType) => void;
  onViewModeChange?: (mode: ViewMode) => void;
}

interface PreviewPanelProps extends TemplatePreviewProps {
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

const DEVICE_SIZES: Record<DeviceType, { width: number; height: number; label: string }> = {
  mobile: { width: 375, height: 667, label: "Mobile" },
  tablet: { width: 768, height: 1024, label: "Tablet" },
  desktop: { width: 1280, height: 800, label: "Desktop" },
};

const VIEW_MODES: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "website", label: "Website", icon: Globe },
  { id: "login", label: "Login Page", icon: Lock },
  { id: "documents", label: "Documents", icon: FileText },
];

export function TemplatePreview({
  children,
  className,
  defaultDevice = "desktop",
  defaultViewMode = "website",
  showDeviceControls = true,
  showZoomControls = true,
  showViewModeToggle = true,
  onDeviceChange,
  onViewModeChange,
}: TemplatePreviewProps) {
  const [device, setDevice] = useState<DeviceType>(defaultDevice);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDeviceChange = (newDevice: DeviceType) => {
    setDevice(newDevice);
    onDeviceChange?.(newDevice);
    // Auto-adjust zoom based on device
    if (newDevice === "desktop") setZoom(75);
    else if (newDevice === "tablet") setZoom(85);
    else setZoom(100);
  };

  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);
    onViewModeChange?.(newMode);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoom(100);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const deviceSize = DEVICE_SIZES[device];

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        {/* View Mode Toggle */}
        {showViewModeToggle && (
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {VIEW_MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleViewModeChange(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  viewMode === id
                    ? "bg-white text-healthcare-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Device & Zoom Controls */}
        <div className="flex items-center gap-4">
          {/* Device Toggle */}
          {showDeviceControls && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleDeviceChange("mobile")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  device === "mobile"
                    ? "bg-white text-healthcare-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
                title="Mobile (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeviceChange("tablet")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  device === "tablet"
                    ? "bg-white text-healthcare-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
                title="Tablet (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeviceChange("desktop")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  device === "desktop"
                    ? "bg-white text-healthcare-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
                title="Desktop (1280px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Zoom Controls */}
          {showZoomControls && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomReset}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md min-w-[50px] text-center transition-colors"
                title="Reset Zoom"
              >
                {zoom}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
        <motion.div
          key={device}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative"
          style={{
            width: deviceSize.width,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* Device Frame */}
          <div
            className={cn(
              "bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200",
              device === "mobile" && "rounded-[32px] border-[8px] border-gray-800",
              device === "tablet" && "rounded-[16px] border-[6px] border-gray-700"
            )}
          >
            {/* Browser Chrome (for desktop) */}
            {device === "desktop" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-white rounded-md text-xs text-gray-500">
                  <Lock className="w-3 h-3 text-green-600" />
                  <span>hospital.athaarva.com</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            )}

            {/* Notch for mobile */}
            {device === "mobile" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-xl z-10" />
            )}

            {/* Preview Content */}
            <div
              className={cn(
                "overflow-y-auto overflow-x-hidden",
                device === "mobile" && "pt-6"
              )}
              style={{
                height: device === "desktop" ? deviceSize.height - 40 : deviceSize.height,
                minHeight: 400,
              }}
            >
              {children}
            </div>

            {/* Home Indicator for mobile */}
            {device === "mobile" && (
              <div className="flex justify-center py-2 bg-white">
                <div className="w-32 h-1 bg-gray-300 rounded-full" />
              </div>
            )}
          </div>

          {/* Device Label */}
          <div className="text-center mt-4">
            <span className="text-xs text-gray-500">
              {deviceSize.label} ({deviceSize.width}×{deviceSize.height})
            </span>
          </div>
        </motion.div>
      </div>

      {/* Status Bar (optional) */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Eye className="w-3 h-3" />
          <span>Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCw className="w-3 h-3" />
          <span>Auto-updating</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Standalone preview panel that can be used as a sidebar or modal
 */
export function PreviewPanel({
  children,
  className,
  isFullscreen,
  onFullscreenToggle,
  ...props
}: PreviewPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white border-l border-gray-200",
        isFullscreen && "fixed inset-0 z-50 border-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Eye className="w-4 h-4 text-healthcare-primary" />
          Live Preview
        </h3>
        {onFullscreenToggle && (
          <Button variant="ghost" size="sm" onClick={onFullscreenToggle}>
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        <TemplatePreview {...props}>{children}</TemplatePreview>
      </div>
    </div>
  );
}

export default TemplatePreview;
