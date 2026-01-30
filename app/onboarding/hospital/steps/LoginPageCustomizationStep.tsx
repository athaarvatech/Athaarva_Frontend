"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Layout,
  Sparkles,
  Monitor,
  Smartphone,
  Palette,
  Eye,
  Settings2,
  Maximize2,
  X,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  LOGIN_TEMPLATES,
  DEFAULT_LOGIN_CONFIG,
  LoginPageConfig as LibLoginPageConfig,
} from "@/lib/login-templates";
import { LoginPageBuilder } from "@/components/onboarding/LoginPageBuilder";
import { LoginPagePreview } from "@/components/onboarding/LoginPagePreview";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

type ViewMode = "templates" | "customize";
type PreviewDevice = "desktop" | "mobile";

export default function LoginPageCustomizationStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [viewMode, setViewMode] = useState<ViewMode>("templates");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  const selectedId = data.loginPageConfig?.templateId || DEFAULT_LOGIN_CONFIG.id;
  const selectedTemplate =
    LOGIN_TEMPLATES.find((template) => template.id === selectedId) ||
    DEFAULT_LOGIN_CONFIG;

  // Get hospital info for preview
  const hospitalName =
    data.organizationProfile?.trade_name ||
    data.organizationProfile?.legal_name ||
    "Hospital Name";
  const logoUrl = data.branding?.logo_url || "";
  const primaryColor = data.branding?.colors?.primary || "#007C7C";

  const handleSelectTemplate = useCallback(
    (template: LibLoginPageConfig) => {
      const mappedLayout =
        template.layout === "split"
          ? "split-left"
          : template.layout === "right"
          ? "full-right"
          : "centered";

      updateData("loginPageConfig", {
        templateId: template.id,
        templateName: template.name,
        templatePreview: template.previewImage || "",
        layoutTemplate: mappedLayout,
        primaryColor:
          template.formStyle.buttonColor || primaryColor,
        customWelcomeText: template.welcomeText.heading,
        customSubtext: template.welcomeText.subheading,
        customHeadline: template.welcomeText.heading,
        customTagline: template.welcomeText.subheading,
        formStyle: template.formStyle.buttonStyle === "gradient" ? "floating" : "card",
        backgroundImage: template.background.type === "image" ? template.background.value : "",
        backgroundColor: template.background.type === "solid" ? template.background.value : "",
        useGradientOverlay: template.background.type === "gradient",
      });
    },
    [updateData, primaryColor]
  );

  const handleConfigChange = useCallback(
    (newConfig: LibLoginPageConfig) => {
      const mappedLayout =
        newConfig.layout === "split"
          ? "split-left"
          : newConfig.layout === "right"
          ? "full-right"
          : "centered";

      updateData("loginPageConfig", {
        templateId: newConfig.id,
        templateName: newConfig.name,
        templatePreview: newConfig.previewImage || "",
        layoutTemplate: mappedLayout,
        primaryColor: newConfig.formStyle.buttonColor || primaryColor,
        customWelcomeText: newConfig.welcomeText.heading,
        customSubtext: newConfig.welcomeText.subheading,
        customHeadline: newConfig.welcomeText.heading,
        customTagline: newConfig.welcomeText.subheading,
        formStyle: newConfig.formStyle.buttonStyle === "gradient" ? "floating" : "card",
        backgroundImage: newConfig.background.type === "image" ? newConfig.background.value : "",
        backgroundColor: newConfig.background.type === "solid" ? newConfig.background.value : "",
        useGradientOverlay: newConfig.background.type === "gradient",
      });
    },
    [updateData, primaryColor]
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-healthcare-primary/20 bg-gradient-to-br from-healthcare-primary/5 via-white to-healthcare-emerald/10 p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-healthcare-primary/10">
              <Layout className="h-6 w-6 text-healthcare-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Login Page Designer
              </h3>
              <p className="text-sm text-gray-600">
                Customize your hospital&apos;s patient login experience with visual
                templates or advanced customization options.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "templates" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("templates")}
              className={cn(
                viewMode === "templates" &&
                  "bg-healthcare-primary hover:bg-healthcare-primary/90"
              )}
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              Templates
            </Button>
            <Button
              variant={viewMode === "customize" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("customize")}
              className={cn(
                viewMode === "customize" &&
                  "bg-healthcare-primary hover:bg-healthcare-primary/90"
              )}
            >
              <Settings2 className="h-4 w-4 mr-1.5" />
              Customize
            </Button>
          </div>
        </div>
      </motion.div>

      {/* View Mode Content */}
      <AnimatePresence mode="wait">
        {viewMode === "templates" ? (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Template Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LOGIN_TEMPLATES.map((template, index) => {
                const isSelected = template.id === selectedId;
                return (
                  <motion.button
                    key={template.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelectTemplate(template)}
                    className={cn(
                      "text-left rounded-xl border-2 p-4 transition-all shadow-sm hover:shadow-md",
                      isSelected
                        ? "border-healthcare-primary bg-healthcare-primary/5 ring-2 ring-healthcare-primary/20"
                        : "border-gray-200 hover:border-healthcare-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-healthcare-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 overflow-hidden">
                      <div
                        className="h-24 w-full rounded-md relative"
                        style={{
                          background:
                            template.background.type === "gradient"
                              ? template.background.value
                              : template.background.type === "solid"
                              ? template.background.value
                              : "#f1f5f9",
                        }}
                      >
                        {/* Mini preview visualization */}
                        <div
                          className={cn(
                            "absolute inset-2 flex items-center gap-2",
                            template.layout === "split" && "justify-between",
                            template.layout === "centered" && "justify-center",
                            template.layout === "left" && "justify-start",
                            template.layout === "right" && "justify-end"
                          )}
                        >
                          {template.layout === "split" && (
                            <div className="w-1/2 h-full flex items-center justify-center">
                              <div className="w-8 h-8 bg-white/40 rounded-lg" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "bg-white/90 rounded-lg p-2 shadow-sm",
                              template.layout === "split" ? "w-1/2 h-full" : "w-24 h-16"
                            )}
                          >
                            <div className="space-y-1">
                              <div className="h-1.5 w-8 bg-gray-200 rounded" />
                              <div className="h-1 w-12 bg-gray-100 rounded" />
                              <div className="h-2 w-full bg-gray-100 rounded" />
                              <div
                                className="h-2 w-full rounded"
                                style={{
                                  backgroundColor:
                                    template.formStyle.buttonColor || "#007C7C",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span className="capitalize">{template.layout} layout</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Selected Template Preview */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-gray-500" />
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      Live Preview
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedTemplate.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        previewDevice === "desktop"
                          ? "bg-white text-healthcare-primary shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        previewDevice === "mobile"
                          ? "bg-white text-healthcare-primary shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFullscreenPreview(true)}
                  >
                    <Maximize2 className="h-4 w-4 mr-1.5" />
                    Fullscreen
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setViewMode("customize")}
                    className="bg-healthcare-primary hover:bg-healthcare-primary/90"
                  >
                    <Palette className="h-4 w-4 mr-1.5" />
                    Customize
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 flex justify-center">
                <div
                  className={cn(
                    "bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300",
                    previewDevice === "mobile" ? "w-[375px]" : "w-full max-w-4xl"
                  )}
                >
                  <LoginPagePreview
                    config={selectedTemplate}
                    hospitalName={hospitalName}
                    logoUrl={logoUrl}
                    className={cn(
                      previewDevice === "mobile" ? "min-h-[600px]" : "min-h-[500px]"
                    )}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="customize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            <div className="h-[700px]">
              <LoginPageBuilder
                initialConfig={selectedTemplate}
                hospitalName={hospitalName}
                logoUrl={logoUrl}
                primaryColor={primaryColor}
                onConfigChange={handleConfigChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Preview Dialog */}
      <Dialog open={fullscreenPreview} onOpenChange={setFullscreenPreview}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <DialogHeader className="absolute top-4 left-4 right-4 z-10 flex flex-row items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <DialogTitle className="text-lg font-semibold">
              Login Page Preview - {selectedTemplate.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    previewDevice === "desktop"
                      ? "bg-white text-healthcare-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    previewDevice === "mobile"
                      ? "bg-white text-healthcare-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFullscreenPreview(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="h-full pt-16 bg-gray-100 flex items-center justify-center overflow-auto p-6">
            <div
              className={cn(
                "bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300",
                previewDevice === "mobile" ? "w-[375px]" : "w-full max-w-5xl"
              )}
            >
              <LoginPagePreview
                config={selectedTemplate}
                hospitalName={hospitalName}
                logoUrl={logoUrl}
                className="min-h-[600px]"
                showInteractive
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
