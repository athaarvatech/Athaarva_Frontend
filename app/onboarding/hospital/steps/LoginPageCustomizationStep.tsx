"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Layout, Sparkles } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LOGIN_TEMPLATES,
  DEFAULT_LOGIN_CONFIG,
  LoginPageConfig,
} from "@/lib/login-templates";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function LoginPageCustomizationStep() {
  const { data, updateData } = useHospitalOnboarding();
  const selectedId = data.loginPageConfig?.templateId || DEFAULT_LOGIN_CONFIG.id;
  const selectedTemplate =
    LOGIN_TEMPLATES.find((template) => template.id === selectedId) ||
    DEFAULT_LOGIN_CONFIG;

  const handleSelectTemplate = (template: LoginPageConfig) => {
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
        template.formStyle.buttonColor ||
        data.branding?.colors?.primary ||
        "#007C7C",
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-healthcare-primary/20 bg-gradient-to-br from-healthcare-primary/5 via-white to-healthcare-emerald/10 p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-healthcare-primary/10">
            <Layout className="h-6 w-6 text-healthcare-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Visual Login Page Editor
            </h3>
            <p className="text-sm text-gray-600">
              Pick a design that matches your brand. No form inputs here—just
              visual selection.
            </p>
          </div>
        </div>
      </motion.div>

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
                "text-left rounded-xl border-2 p-4 transition-all shadow-sm",
                isSelected
                  ? "border-healthcare-primary bg-healthcare-primary/5"
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
                  <CheckCircle className="h-5 w-5 text-healthcare-primary" />
                )}
              </div>
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                <div
                  className="h-20 w-full rounded-md"
                  style={{
                    background:
                      template.background.type === "gradient"
                        ? template.background.value
                        : template.background.type === "solid"
                        ? template.background.value
                        : "#f1f5f9",
                  }}
                />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                  <div className="h-2 w-3/4 rounded bg-gray-100" />
                  <div className="h-8 w-full rounded bg-gray-100" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span>Visual template</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-semibold text-gray-900">Preview</h4>
            <p className="text-sm text-gray-600">
              Selected design: <span className="font-medium">{selectedTemplate.name}</span>
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSelectTemplate(selectedTemplate)}
          >
            Use this design
          </Button>
        </div>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div
            className="rounded-xl p-6"
            style={{
              background:
                selectedTemplate.background.type === "gradient"
                  ? selectedTemplate.background.value
                  : selectedTemplate.background.type === "solid"
                  ? selectedTemplate.background.value
                  : "#f8fafc",
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/80" />
              <div className="h-4 w-1/2 rounded bg-white/70" />
              <div className="h-3 w-2/3 rounded bg-white/50" />
              <div className="h-10 w-full max-w-sm rounded-lg bg-white/80" />
              <div className="h-10 w-full max-w-sm rounded-lg bg-white/90" />
              <div className="h-10 w-full max-w-sm rounded-lg bg-healthcare-primary/90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
