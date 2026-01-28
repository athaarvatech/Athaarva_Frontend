"use client";

/**
 * LoginPagePreview - Standalone preview component for login page customization
 * 
 * Renders a live preview of the login page based on configuration.
 * Can be used in onboarding flow or as a standalone preview.
 */

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Lock,
  Mail,
  Building2,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  User,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LoginPageConfig,
  DEFAULT_LOGIN_CONFIG,
} from "@/lib/login-templates";

interface LoginPagePreviewProps {
  config: LoginPageConfig;
  hospitalName?: string;
  logoUrl?: string;
  scale?: number;
  showInteractive?: boolean;
  className?: string;
}

// Pattern SVGs for background
const PatternSVG: Record<string, React.ReactNode> = {
  "medical-crosses": (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <pattern id="medical-crosses" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M25 15h10v10h10v10H35v10H25V35H15V25h10z" fill="currentColor" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#medical-crosses)" />
    </svg>
  ),
  dots: (
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="2" fill="currentColor" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  ),
  grid: (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0v40" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  ),
};

export function LoginPagePreview({
  config,
  hospitalName = "Hospital",
  logoUrl,
  scale = 1,
  showInteractive = false,
  className,
}: LoginPagePreviewProps) {
  const { background, logo, welcomeText, formStyle, layout } = config;

  // Determine background style
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background.type) {
      case "solid":
        return { backgroundColor: background.value };
      case "gradient":
        return { background: background.value };
      case "image":
        return {
          backgroundImage: `url('${background.value}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      case "pattern":
        return { backgroundColor: background.overlay || "#f8fafc" };
      default:
        return { backgroundColor: "#f8fafc" };
    }
  };

  // Determine if background is dark for text contrast
  const isDarkBackground = (): boolean => {
    const value = background.value.toLowerCase();
    if (background.type === "solid") {
      // Check if hex color is dark
      const hex = value.replace("#", "");
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
      }
    }
    return (
      value.includes("#0") ||
      value.includes("#1") ||
      value.includes("#2") ||
      value.includes("dark") ||
      (background.type === "image" && !!background.overlay)
    );
  };

  const textColor = isDarkBackground() ? "text-white" : "text-gray-900";
  const mutedColor = isDarkBackground() ? "text-gray-300" : "text-gray-600";

  const logoSizeClasses = {
    small: "w-10 h-10",
    medium: "w-14 h-14",
    large: "w-20 h-20",
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case "centered":
        return "items-center justify-center";
      case "left":
        return "items-center justify-start pl-8 lg:pl-16";
      case "right":
        return "items-center justify-end pr-8 lg:pr-16";
      case "split":
        return "items-stretch";
      default:
        return "items-center justify-center";
    }
  };

  const getCardClasses = () => {
    const baseClasses = "relative z-10 p-6 lg:p-8";
    
    if (layout === "split") {
      return cn(baseClasses, "w-full lg:w-1/2");
    }
    
    return cn(baseClasses, "w-full max-w-md");
  };

  // Trust badges for split layout
  const trustBadges = [
    { icon: Shield, label: "HIPAA Compliant" },
    { icon: CheckCircle, label: "256-bit Encryption" },
    { icon: Lock, label: "Secure Login" },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
    >
      <div
        className={cn(
          "min-h-[500px] lg:min-h-[600px] flex relative",
          getLayoutClasses()
        )}
        style={getBackgroundStyle()}
      >
        {/* Pattern Background */}
        {background.type === "pattern" && PatternSVG[background.value]}

        {/* Image Overlay */}
        {background.type === "image" && background.overlay && (
          <div
            className="absolute inset-0 z-[1]"
            style={{ backgroundColor: background.overlay }}
          />
        )}

        {/* Split Layout - Left Panel */}
        {layout === "split" && (
          <div className="hidden lg:flex w-1/2 relative items-center justify-center p-8 lg:p-12">
            <div className={cn("text-center max-w-md relative z-10", textColor)}>
              {/* Logo in side panel */}
              {logo.position === "top" && (
                <div className="mb-6">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={hospitalName}
                      className={cn("mx-auto", logoSizeClasses[logo.size])}
                    />
                  ) : (
                    <div className={cn(
                      "mx-auto bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center",
                      logoSizeClasses[logo.size]
                    )}>
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                  )}
                  {logo.showHospitalName && (
                    <h2 className="mt-3 text-xl font-bold">{hospitalName}</h2>
                  )}
                </div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl lg:text-4xl font-bold mb-4"
              >
                {welcomeText.heading}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cn("text-lg", mutedColor)}
              >
                {welcomeText.subheading}
              </motion.p>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 space-y-3"
              >
                {trustBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-3 text-sm"
                  >
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <badge.icon className="w-4 h-4" />
                    </div>
                    <span className={mutedColor}>{badge.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className={getCardClasses()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto"
            style={{
              backgroundColor: formStyle.cardBackground,
              borderRadius: formStyle.cardBorderRadius,
              boxShadow: formStyle.cardShadow,
            }}
          >
            <div className="p-6 lg:p-8">
              {/* Logo (non-split layouts) */}
              {logo.position !== "hidden" && layout !== "split" && (
                <div className="text-center mb-6">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={hospitalName}
                      className={cn("mx-auto", logoSizeClasses[logo.size])}
                    />
                  ) : (
                    <div className={cn(
                      "mx-auto bg-gray-100 rounded-xl flex items-center justify-center",
                      logoSizeClasses[logo.size]
                    )}>
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {logo.showHospitalName && (
                    <h2 className="mt-3 text-lg font-semibold text-gray-900">
                      {hospitalName}
                    </h2>
                  )}
                </div>
              )}

              {/* Welcome Text (non-split or mobile) */}
              {layout !== "split" && (
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {welcomeText.heading}
                  </h1>
                  <p className="text-gray-600 mt-1">{welcomeText.subheading}</p>
                </div>
              )}

              {/* Form Preview */}
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div
                    className={cn(
                      "relative",
                      formStyle.inputStyle === "filled" && "bg-gray-100 rounded-lg",
                      formStyle.inputStyle === "underlined" && "border-b-2 border-gray-300"
                    )}
                  >
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      disabled={!showInteractive}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 text-sm outline-none",
                        formStyle.inputStyle === "outlined" && "border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-primary/20 focus:border-healthcare-primary",
                        formStyle.inputStyle === "filled" && "bg-transparent",
                        formStyle.inputStyle === "underlined" && "bg-transparent border-none"
                      )}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div
                    className={cn(
                      "relative",
                      formStyle.inputStyle === "filled" && "bg-gray-100 rounded-lg",
                      formStyle.inputStyle === "underlined" && "border-b-2 border-gray-300"
                    )}
                  >
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      disabled={!showInteractive}
                      className={cn(
                        "w-full pl-10 pr-10 py-3 text-sm outline-none",
                        formStyle.inputStyle === "outlined" && "border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-primary/20 focus:border-healthcare-primary",
                        formStyle.inputStyle === "filled" && "bg-transparent",
                        formStyle.inputStyle === "underlined" && "bg-transparent border-none"
                      )}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      disabled={!showInteractive}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      disabled={!showInteractive}
                      className="rounded border-gray-300"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-healthcare-primary hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="button"
                  disabled={!showInteractive}
                  className={cn(
                    "w-full py-3 font-semibold text-white transition-all flex items-center justify-center gap-2",
                    formStyle.buttonStyle === "solid" && "rounded-lg hover:opacity-90",
                    formStyle.buttonStyle === "gradient" && "rounded-lg bg-gradient-to-r from-healthcare-primary to-healthcare-secondary hover:opacity-90",
                    formStyle.buttonStyle === "outlined" && "rounded-lg border-2 bg-transparent hover:bg-gray-50"
                  )}
                  style={{
                    backgroundColor: formStyle.buttonStyle === "solid" 
                      ? (formStyle.buttonColor || "#007C7C") 
                      : formStyle.buttonStyle === "gradient" 
                        ? undefined 
                        : "transparent",
                    borderColor: formStyle.buttonStyle === "outlined" 
                      ? (formStyle.buttonColor || "#007C7C") 
                      : undefined,
                    color: formStyle.buttonStyle === "outlined" 
                      ? (formStyle.buttonColor || "#007C7C") 
                      : "white",
                  }}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>

                {/* Create Account */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                      href="#"
                      className="font-semibold text-healthcare-primary hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Create one now
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginPagePreview;
