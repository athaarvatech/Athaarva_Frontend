"use client";

/**
 * =============================================================================
 * DEVICE FRAME WRAPPER
 * =============================================================================
 * 
 * A responsive wrapper component that simulates different device viewports
 * for the canvas editor. Enables users to preview their hospital website
 * on Desktop, Tablet, and Mobile devices.
 * 
 * Features:
 * - Realistic device bezels with notch (mobile) and rounded corners
 * - Smooth CSS transitions between device modes
 * - Independent scrolling within device frame
 * - Dimmed background to focus attention on device
 * 
 * =============================================================================
 */

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface DeviceFrameWrapperProps {
  deviceMode: DeviceMode;
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// DEVICE CONFIGURATIONS
// ============================================================================

const DEVICE_CONFIGS: Record<DeviceMode, {
  width: string;
  maxWidth: string;
  height: string;
  scale: number;
  bezel: boolean;
  notch: boolean;
  borderRadius: string;
  label: string;
}> = {
  desktop: {
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    scale: 1,
    bezel: false,
    notch: false,
    borderRadius: "0",
    label: "Desktop",
  },
  tablet: {
    width: "768px",
    maxWidth: "768px",
    height: "1024px",
    scale: 0.85,
    bezel: true,
    notch: false,
    borderRadius: "32px",
    label: "iPad",
  },
  mobile: {
    width: "375px",
    maxWidth: "375px",
    height: "812px",
    scale: 0.9,
    bezel: true,
    notch: true,
    borderRadius: "44px",
    label: "iPhone",
  },
};

// ============================================================================
// PHONE NOTCH COMPONENT
// ============================================================================

function PhoneNotch() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
      {/* Dynamic Island style notch */}
      <div className="relative">
        <div 
          className="bg-black rounded-full"
          style={{
            width: "126px",
            height: "37px",
            marginTop: "11px",
          }}
        >
          {/* Camera dot */}
          <div 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-800 border border-gray-700"
            style={{ boxShadow: "inset 0 0 2px rgba(255,255,255,0.1)" }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEVICE BEZEL COMPONENT
// ============================================================================

interface DeviceBezelProps {
  config: typeof DEVICE_CONFIGS.mobile;
  children: React.ReactNode;
}

function DeviceBezel({ config, children }: DeviceBezelProps) {
  return (
    <div
      className="relative bg-gray-900 shadow-2xl"
      style={{
        borderRadius: config.borderRadius,
        padding: config.notch ? "0" : "12px",
      }}
    >
      {/* Outer bezel glow */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-50"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      
      {/* Side buttons (for mobile) */}
      {config.notch && (
        <>
          {/* Power button */}
          <div 
            className="absolute -right-[3px] top-28 w-[3px] h-12 bg-gray-700 rounded-r"
          />
          {/* Volume buttons */}
          <div 
            className="absolute -left-[3px] top-24 w-[3px] h-8 bg-gray-700 rounded-l"
          />
          <div 
            className="absolute -left-[3px] top-36 w-[3px] h-8 bg-gray-700 rounded-l"
          />
        </>
      )}

      {/* Screen area */}
      <div
        className="relative bg-white overflow-hidden"
        style={{
          borderRadius: `calc(${config.borderRadius} - ${config.notch ? "0px" : "8px"})`,
        }}
      >
        {/* Notch for mobile */}
        {config.notch && <PhoneNotch />}
        
        {/* Content */}
        {children}
      </div>

      {/* Home indicator (for mobile) */}
      {config.notch && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DeviceFrameWrapper({
  deviceMode,
  children,
  className,
}: DeviceFrameWrapperProps) {
  const config = DEVICE_CONFIGS[deviceMode];
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop mode - no frame, full width
  if (deviceMode === "desktop") {
    return (
      <div className={cn("w-full h-full", className)}>
        {children}
      </div>
    );
  }

  // Tablet/Mobile mode - with device frame
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full flex items-start justify-center overflow-auto",
        "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300",
        className
      )}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Device container with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: config.scale,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
        }}
        className="relative my-8 origin-top"
        style={{
          width: config.width,
          maxWidth: config.maxWidth,
        }}
      >
        {/* Device label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded-full shadow-lg"
        >
          {config.label} Preview
        </motion.div>

        {/* Device bezel */}
        <DeviceBezel config={config}>
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{
              width: config.width,
              maxWidth: config.maxWidth,
              height: config.height,
              maxHeight: `calc(100vh - 200px)`,
            }}
          >
            {children}
          </div>
        </DeviceBezel>

        {/* Shadow beneath device */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 rounded-full blur-xl"
        />
      </motion.div>
    </div>
  );
}

// ============================================================================
// DEVICE MODE SELECTOR (for external use)
// ============================================================================

export interface DeviceModeSelectorProps {
  value: DeviceMode;
  onChange: (mode: DeviceMode) => void;
  className?: string;
}

export function DeviceModeSelector({
  value,
  onChange,
  className,
}: DeviceModeSelectorProps) {
  const modes: { mode: DeviceMode; icon: string; label: string }[] = [
    { mode: "desktop", icon: "🖥️", label: "Desktop" },
    { mode: "tablet", icon: "📱", label: "Tablet" },
    { mode: "mobile", icon: "📲", label: "Mobile" },
  ];

  return (
    <div className={cn("flex items-center gap-1 p-1 bg-gray-100 rounded-lg", className)}>
      {modes.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            value === mode
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
          title={label}
        >
          <span>{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default DeviceFrameWrapper;
