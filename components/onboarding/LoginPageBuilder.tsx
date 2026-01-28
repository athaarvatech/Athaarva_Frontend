"use client";

/**
 * LoginPageBuilder - Phase 4: Custom Login Page Builder
 * 
 * A visual editor for customizing hospital login pages.
 * Features:
 * - Layout selection (centered, left, right, split)
 * - Background customization (solid, gradient, image)
 * - Logo position and size
 * - Welcome text editing
 * - Form style options
 * - Live preview
 * - Template matching
 */

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Layout,
  Palette,
  Image as ImageIcon,
  Type,
  Settings2,
  Eye,
  Wand2,
  Check,
  RotateCw,
  Smartphone,
  Monitor,
  Lock,
  Building2,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LoginPageConfig,
  LOGIN_TEMPLATES,
  DEFAULT_LOGIN_CONFIG,
  LoginLayout,
  BackgroundType,
  InputStyle,
  ButtonStyle,
  LogoPosition,
  LogoSize,
} from "@/lib/login-templates";
import { ImageToolbox } from "./ImageToolbox";

interface LoginPageBuilderProps {
  initialConfig?: LoginPageConfig;
  hospitalName?: string;
  logoUrl?: string;
  primaryColor?: string;
  onConfigChange: (config: LoginPageConfig) => void;
  className?: string;
}

const LAYOUT_OPTIONS: { value: LoginLayout; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "centered", label: "Centered", icon: AlignCenter },
  { value: "left", label: "Left", icon: AlignLeft },
  { value: "right", label: "Right", icon: AlignRight },
  { value: "split", label: "Split Screen", icon: Layout },
];

const BACKGROUND_PRESETS = [
  { type: "gradient" as BackgroundType, value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", label: "Purple Gradient" },
  { type: "gradient" as BackgroundType, value: "linear-gradient(180deg, #007C7C 0%, #004d4d 100%)", label: "Teal Gradient" },
  { type: "gradient" as BackgroundType, value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", label: "Light Gray" },
  { type: "gradient" as BackgroundType, value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", label: "Dark Blue" },
  { type: "solid" as BackgroundType, value: "#ffffff", label: "White" },
  { type: "solid" as BackgroundType, value: "#f8fafc", label: "Light Gray" },
  { type: "solid" as BackgroundType, value: "#0f172a", label: "Dark Slate" },
];

export function LoginPageBuilder({
  initialConfig,
  hospitalName = "Hospital",
  logoUrl,
  primaryColor = "#007C7C",
  onConfigChange,
  className,
}: LoginPageBuilderProps) {
  const [config, setConfig] = useState<LoginPageConfig>(
    initialConfig || { ...DEFAULT_LOGIN_CONFIG, formStyle: { ...DEFAULT_LOGIN_CONFIG.formStyle, buttonColor: primaryColor } }
  );
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("desktop");
  const [activeTab, setActiveTab] = useState("layout");

  // Update config and notify parent
  const updateConfig = useCallback(
    (updates: Partial<LoginPageConfig>) => {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      onConfigChange(newConfig);
    },
    [config, onConfigChange]
  );

  // Update nested config properties
  const updateBackground = useCallback(
    (updates: Partial<LoginPageConfig["background"]>) => {
      updateConfig({ background: { ...config.background, ...updates } });
    },
    [config.background, updateConfig]
  );

  const updateLogo = useCallback(
    (updates: Partial<LoginPageConfig["logo"]>) => {
      updateConfig({ logo: { ...config.logo, ...updates } });
    },
    [config.logo, updateConfig]
  );

  const updateWelcomeText = useCallback(
    (updates: Partial<LoginPageConfig["welcomeText"]>) => {
      updateConfig({ welcomeText: { ...config.welcomeText, ...updates } });
    },
    [config.welcomeText, updateConfig]
  );

  const updateFormStyle = useCallback(
    (updates: Partial<LoginPageConfig["formStyle"]>) => {
      updateConfig({ formStyle: { ...config.formStyle, ...updates } });
    },
    [config.formStyle, updateConfig]
  );

  // Apply template
  const applyTemplate = useCallback(
    (template: LoginPageConfig) => {
      const newConfig = {
        ...template,
        logo: { ...template.logo, url: logoUrl },
        formStyle: { ...template.formStyle, buttonColor: primaryColor },
      };
      setConfig(newConfig);
      onConfigChange(newConfig);
    },
    [logoUrl, primaryColor, onConfigChange]
  );

  // Set logo URL from props
  useEffect(() => {
    if (logoUrl && config.logo.url !== logoUrl) {
      updateLogo({ url: logoUrl });
    }
  }, [logoUrl, config.logo.url, updateLogo]);

  return (
    <div className={cn("flex h-full", className)}>
      {/* Editor Panel */}
      <div className="w-[400px] border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-healthcare-primary" />
            Login Page Builder
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Customize your hospital's login page
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
            <TabsTrigger value="layout" className="text-xs">
              Layout
            </TabsTrigger>
            <TabsTrigger value="background" className="text-xs">
              Background
            </TabsTrigger>
            <TabsTrigger value="text" className="text-xs">
              Text
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              Style
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Layout Tab */}
            <TabsContent value="layout" className="mt-0 space-y-6">
              {/* Layout Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Page Layout</Label>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUT_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updateConfig({ layout: value })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        config.layout === value
                          ? "border-healthcare-primary bg-healthcare-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Icon className={cn(
                        "w-6 h-6",
                        config.layout === value ? "text-healthcare-primary" : "text-gray-500"
                      )} />
                      <span className={cn(
                        "text-xs font-medium",
                        config.layout === value ? "text-healthcare-primary" : "text-gray-700"
                      )}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Logo Settings</Label>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Position</Label>
                  <Select
                    value={config.logo.position}
                    onValueChange={(v) => updateLogo({ position: v as LogoPosition })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Above Card</SelectItem>
                      <SelectItem value="inline">Inside Card</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Size</Label>
                  <Select
                    value={config.logo.size}
                    onValueChange={(v) => updateLogo({ size: v as LogoSize })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">Show Hospital Name</Label>
                  <Switch
                    checked={config.logo.showHospitalName}
                    onCheckedChange={(v) => updateLogo({ showHospitalName: v })}
                  />
                </div>
              </div>

              {/* Templates */}
              <div>
                <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Quick Templates
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {LOGIN_TEMPLATES.slice(0, 4).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all hover:border-healthcare-primary/50",
                        config.id === template.id
                          ? "border-healthcare-primary bg-healthcare-primary/5"
                          : "border-gray-200"
                      )}
                    >
                      <span className="text-xs font-medium text-gray-700 block truncate">
                        {template.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Background Tab */}
            <TabsContent value="background" className="mt-0 space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Background Type</Label>
                <Select
                  value={config.background.type}
                  onValueChange={(v) => updateBackground({ type: v as BackgroundType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.background.type === "solid" && (
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.background.value}
                      onChange={(e) => updateBackground({ value: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={config.background.value}
                      onChange={(e) => updateBackground({ value: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              )}

              {config.background.type === "gradient" && (
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Gradient CSS</Label>
                  <Textarea
                    value={config.background.value}
                    onChange={(e) => updateBackground({ value: e.target.value })}
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    className="text-xs font-mono"
                    rows={2}
                  />
                </div>
              )}

              {config.background.type === "image" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={config.background.value}
                        onChange={(e) => updateBackground({ value: e.target.value })}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <ImageToolbox
                        category="background"
                        onImageSelect={(url) => updateBackground({ value: url })}
                        trigger={
                          <Button variant="outline" size="icon">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Overlay Color</Label>
                    <Input
                      value={config.background.overlay || ""}
                      onChange={(e) => updateBackground({ overlay: e.target.value })}
                      placeholder="rgba(0, 124, 124, 0.6)"
                    />
                  </div>
                </div>
              )}

              {/* Presets */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Presets</Label>
                <div className="grid grid-cols-4 gap-2">
                  {BACKGROUND_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => updateBackground({ type: preset.type, value: preset.value })}
                      className={cn(
                        "w-full aspect-square rounded-lg border-2 transition-all",
                        config.background.value === preset.value
                          ? "border-healthcare-primary ring-2 ring-healthcare-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      style={{
                        background: preset.type === "gradient" ? preset.value : preset.value,
                      }}
                      title={preset.label}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="mt-0 space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Heading</Label>
                <Input
                  value={config.welcomeText.heading}
                  onChange={(e) => updateWelcomeText({ heading: e.target.value })}
                  placeholder="Welcome Back"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Subheading</Label>
                <Textarea
                  value={config.welcomeText.subheading}
                  onChange={(e) => updateWelcomeText({ subheading: e.target.value })}
                  placeholder="Sign in to access your healthcare portal"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-500">Show on Mobile</Label>
                <Switch
                  checked={config.welcomeText.showOnMobile}
                  onCheckedChange={(v) => updateWelcomeText({ showOnMobile: v })}
                />
              </div>
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="mt-0 space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Card Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.formStyle.cardBackground.replace(/rgba?\([^)]+\)/, "#ffffff")}
                    onChange={(e) => updateFormStyle({ cardBackground: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={config.formStyle.cardBackground}
                    onChange={(e) => updateFormStyle({ cardBackground: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Border Radius</Label>
                <Select
                  value={config.formStyle.cardBorderRadius}
                  onValueChange={(v) => updateFormStyle({ cardBorderRadius: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0px">Square</SelectItem>
                    <SelectItem value="8px">Slightly Rounded</SelectItem>
                    <SelectItem value="16px">Rounded</SelectItem>
                    <SelectItem value="24px">Very Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Input Style</Label>
                <Select
                  value={config.formStyle.inputStyle}
                  onValueChange={(v) => updateFormStyle({ inputStyle: v as InputStyle })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outlined">Outlined</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                    <SelectItem value="underlined">Underlined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Button Style</Label>
                <Select
                  value={config.formStyle.buttonStyle}
                  onValueChange={(v) => updateFormStyle({ buttonStyle: v as ButtonStyle })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="outlined">Outlined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.formStyle.buttonColor || primaryColor}
                    onChange={(e) => updateFormStyle({ buttonColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={config.formStyle.buttonColor || primaryColor}
                    onChange={(e) => updateFormStyle({ buttonColor: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Preview Controls */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={cn(
                "p-2 rounded-md transition-all",
                previewDevice === "mobile"
                  ? "bg-white text-healthcare-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={cn(
                "p-2 rounded-md transition-all",
                previewDevice === "desktop"
                  ? "bg-white text-healthcare-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
          <motion.div
            key={previewDevice}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "bg-white rounded-lg shadow-2xl overflow-hidden",
              previewDevice === "mobile" ? "w-[375px]" : "w-full max-w-4xl"
            )}
          >
            <LoginPagePreviewContent
              config={config}
              hospitalName={hospitalName}
              logoUrl={logoUrl}
              isMobile={previewDevice === "mobile"}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Preview content component
function LoginPagePreviewContent({
  config,
  hospitalName,
  logoUrl,
  isMobile,
}: {
  config: LoginPageConfig;
  hospitalName: string;
  logoUrl?: string;
  isMobile: boolean;
}) {
  const { background, logo, welcomeText, formStyle, layout } = config;

  const getBackgroundStyle = () => {
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

  const logoSize = logo.size === "small" ? "w-12 h-12" : logo.size === "large" ? "w-20 h-20" : "w-16 h-16";

  return (
    <div
      className={cn(
        "min-h-[600px] p-6 flex relative",
        layout === "centered" && "items-center justify-center",
        layout === "left" && "items-center justify-start",
        layout === "right" && "items-center justify-end",
        layout === "split" && "items-stretch"
      )}
      style={getBackgroundStyle()}
    >
      {/* Overlay for images */}
      {background.type === "image" && background.overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: background.overlay }}
        />
      )}

      {/* Split layout image side */}
      {layout === "split" && !isMobile && (
        <div className="w-1/2 relative flex items-center justify-center p-8">
          <div className={cn("text-center max-w-md relative z-10", textColor)}>
            {logo.position === "top" && logo.url && (
              <img
                src={logoUrl || "/placeholder-logo.png"}
                alt="Logo"
                className={cn("mx-auto mb-6", logoSize)}
              />
            )}
            <h1 className="text-3xl font-bold mb-4">{welcomeText.heading}</h1>
            <p className={cn("text-lg", mutedColor)}>{welcomeText.subheading}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div
        className={cn(
          "relative z-10",
          layout === "split" ? (isMobile ? "w-full" : "w-1/2") : "w-full max-w-md"
        )}
      >
        <div
          className="p-8"
          style={{
            backgroundColor: formStyle.cardBackground,
            borderRadius: formStyle.cardBorderRadius,
            boxShadow: formStyle.cardShadow,
          }}
        >
          {/* Logo (non-split) */}
          {logo.position !== "hidden" && layout !== "split" && (
            <div className="text-center mb-6">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Hospital Logo"
                  className={cn("mx-auto", logoSize)}
                />
              ) : (
                <div className={cn("mx-auto bg-gray-100 rounded-lg flex items-center justify-center", logoSize)}>
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              )}
              {logo.showHospitalName && (
                <h2 className="mt-3 text-lg font-semibold text-gray-900">{hospitalName}</h2>
              )}
            </div>
          )}

          {/* Welcome Text (non-split, or mobile) */}
          {(layout !== "split" || isMobile) && (welcomeText.showOnMobile || !isMobile) && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{welcomeText.heading}</h1>
              <p className="text-gray-600 mt-1">{welcomeText.subheading}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <div className={cn(
                "mt-1 relative",
                formStyle.inputStyle === "filled" && "bg-gray-100 rounded-lg",
                formStyle.inputStyle === "underlined" && "border-b-2 border-gray-300"
              )}>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 text-sm",
                    formStyle.inputStyle === "outlined" && "border border-gray-300 rounded-lg",
                    formStyle.inputStyle === "filled" && "bg-transparent",
                    formStyle.inputStyle === "underlined" && "bg-transparent border-none"
                  )}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <div className={cn(
                "mt-1 relative",
                formStyle.inputStyle === "filled" && "bg-gray-100 rounded-lg",
                formStyle.inputStyle === "underlined" && "border-b-2 border-gray-300"
              )}>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 text-sm",
                    formStyle.inputStyle === "outlined" && "border border-gray-300 rounded-lg",
                    formStyle.inputStyle === "filled" && "bg-transparent",
                    formStyle.inputStyle === "underlined" && "bg-transparent border-none"
                  )}
                />
              </div>
            </div>

            <button
              className={cn(
                "w-full py-3 font-semibold text-white transition-all",
                formStyle.buttonStyle === "solid" && "rounded-lg",
                formStyle.buttonStyle === "gradient" && "rounded-lg bg-gradient-to-r from-healthcare-primary to-healthcare-teal",
                formStyle.buttonStyle === "outlined" && "rounded-lg border-2 bg-transparent"
              )}
              style={{
                backgroundColor: formStyle.buttonStyle === "solid" ? (formStyle.buttonColor || "#007C7C") : undefined,
                borderColor: formStyle.buttonStyle === "outlined" ? (formStyle.buttonColor || "#007C7C") : undefined,
                color: formStyle.buttonStyle === "outlined" ? (formStyle.buttonColor || "#007C7C") : "white",
              }}
            >
              Sign In
            </button>

            <div className="text-center">
              <a href="#" className="text-sm text-healthcare-primary hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPageBuilder;
