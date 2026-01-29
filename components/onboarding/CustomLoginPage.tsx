"use client";

/**
 * CustomLoginPage - Phase 4: Custom Login Page Renderer
 * 
 * Renders the hospital login page based on custom configuration.
 * Falls back to default login when no custom config is set.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  LoginPageConfig,
  DEFAULT_LOGIN_CONFIG,
  generateLoginCSS,
} from "@/lib/login-templates";

interface CustomLoginPageProps {
  config?: LoginPageConfig;
  hospitalName: string;
  logoUrl?: string;
  primaryColor?: string;
  isSubmitting?: boolean;
  error?: string | null;
  onLogin: (email: string, password: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function CustomLoginPage({
  config = DEFAULT_LOGIN_CONFIG,
  hospitalName,
  logoUrl,
  primaryColor = "#007C7C",
  isSubmitting = false,
  error,
  onLogin,
  onBack,
  showBackButton = true,
}: CustomLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { background, logo, welcomeText, formStyle, layout } = config;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

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
      default:
        return { backgroundColor: "#f8fafc" };
    }
  };

  const isDarkBackground = () => {
    const value = background.value.toLowerCase();
    return (
      value.includes("#0") ||
      value.includes("#1") ||
      value.includes("#2") ||
      value.includes("dark") ||
      (background.type === "image" && background.overlay)
    );
  };

  const textColor = isDarkBackground() ? "text-white" : "text-gray-900";
  const mutedColor = isDarkBackground() ? "text-gray-300" : "text-gray-600";

  const logoSizeClass = 
    logo.size === "small" ? "w-12 h-12" : 
    logo.size === "large" ? "w-20 h-20" : 
    "w-16 h-16";

  const getInputClassName = () => {
    switch (formStyle.inputStyle) {
      case "outlined":
        return "border border-gray-300 rounded-lg bg-white";
      case "filled":
        return "bg-gray-100 rounded-lg border-0";
      case "underlined":
        return "bg-transparent border-0 border-b-2 border-gray-300 rounded-none";
      default:
        return "border border-gray-300 rounded-lg";
    }
  };

  const getButtonStyle = (): React.CSSProperties => {
    const buttonColor = formStyle.buttonColor || primaryColor;
    
    switch (formStyle.buttonStyle) {
      case "gradient":
        return {
          background: `linear-gradient(135deg, ${buttonColor}, ${adjustColor(buttonColor, -30)})`,
          border: "none",
          color: "white",
        };
      case "outlined":
        return {
          backgroundColor: "transparent",
          border: `2px solid ${buttonColor}`,
          color: buttonColor,
        };
      default: // solid
        return {
          backgroundColor: buttonColor,
          border: "none",
          color: "white",
        };
    }
  };

  // Helper to adjust color brightness
  function adjustColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const showWelcomeText = !isMobile || welcomeText.showOnMobile;

  return (
    <div
      className={cn(
        "min-h-screen flex relative",
        layout === "centered" && "items-center justify-center",
        layout === "left" && "items-center justify-start",
        layout === "right" && "items-center justify-end",
        layout === "split" && "items-stretch"
      )}
      style={getBackgroundStyle()}
    >
      {/* Custom CSS injection */}
      <style dangerouslySetInnerHTML={{ __html: generateLoginCSS(config) }} />

      {/* Overlay for images */}
      {background.type === "image" && background.overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: background.overlay }}
        />
      )}

      {/* Back button */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className={cn(
            "absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
            isDarkBackground()
              ? "text-white/80 hover:text-white hover:bg-white/10"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Change Hospital</span>
        </button>
      )}

      {/* Split layout - welcome side */}
      {layout === "split" && !isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/2 relative flex items-center justify-center p-8"
        >
          <div className={cn("text-center max-w-md relative z-10", textColor)}>
            {logo.position === "top" && (
              <div className="mb-6">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={hospitalName}
                    width={80}
                    height={80}
                    className={cn("mx-auto rounded-lg", logoSizeClass)}
                  />
                ) : (
                  <div className={cn(
                    "mx-auto rounded-lg flex items-center justify-center",
                    logoSizeClass,
                    isDarkBackground() ? "bg-white/20" : "bg-gray-100"
                  )}>
                    <Building2 className={cn("w-8 h-8", isDarkBackground() ? "text-white" : "text-gray-500")} />
                  </div>
                )}
              </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{welcomeText.heading}</h1>
            <p className={cn("text-lg", mutedColor)}>{welcomeText.subheading}</p>
          </div>
        </motion.div>
      )}

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "relative z-10",
          layout === "split" ? (isMobile ? "w-full p-4" : "w-1/2 flex items-center justify-center") : "w-full max-w-md mx-auto px-4",
          layout === "left" && "ml-12 lg:ml-24",
          layout === "right" && "mr-12 lg:mr-24"
        )}
      >
        <div
          className={cn("p-8 w-full", layout === "split" && "max-w-md")}
          style={{
            backgroundColor: formStyle.cardBackground,
            borderRadius: formStyle.cardBorderRadius,
            boxShadow: formStyle.cardShadow,
          }}
        >
          {/* Logo (non-split layouts) */}
          {logo.position !== "hidden" && layout !== "split" && (
            <div className="text-center mb-6">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={hospitalName}
                  width={logo.size === "large" ? 80 : logo.size === "small" ? 48 : 64}
                  height={logo.size === "large" ? 80 : logo.size === "small" ? 48 : 64}
                  className={cn("mx-auto rounded-lg", logoSizeClass)}
                />
              ) : (
                <div className={cn("mx-auto bg-gray-100 rounded-lg flex items-center justify-center", logoSizeClass)}>
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              )}
              {logo.showHospitalName && (
                <h2 className="mt-3 text-lg font-semibold text-gray-900">{hospitalName}</h2>
              )}
            </div>
          )}

          {/* Welcome Text (non-split, or mobile) */}
          {(layout !== "split" || isMobile) && showWelcomeText && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{welcomeText.heading}</h1>
              <p className="text-gray-600 mt-1">{welcomeText.subheading}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <div className={cn("mt-1 relative", getInputClassName())}>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={cn(
                    "w-full pl-10 pr-4 py-3 text-sm focus:outline-none",
                    formStyle.inputStyle === "outlined" && "bg-transparent",
                    formStyle.inputStyle === "filled" && "bg-transparent",
                    formStyle.inputStyle === "underlined" && "bg-transparent"
                  )}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <div className={cn("mt-1 relative", getInputClassName())}>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={cn(
                    "w-full pl-10 pr-10 py-3 text-sm focus:outline-none",
                    formStyle.inputStyle === "outlined" && "bg-transparent",
                    formStyle.inputStyle === "filled" && "bg-transparent",
                    formStyle.inputStyle === "underlined" && "bg-transparent"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-3 font-semibold transition-all",
                formStyle.buttonStyle !== "outlined" && "text-white"
              )}
              style={{
                ...getButtonStyle(),
                borderRadius: formStyle.cardBorderRadius,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <a
                href="#"
                className="text-sm hover:underline"
                style={{ color: formStyle.buttonColor || primaryColor }}
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default CustomLoginPage;
