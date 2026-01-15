"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Sparkles } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TEMPLATE_STYLES = [
  {
    id: "classic",
    title: "Classic Clinical",
    description: "Traditional layout with clear header and footer lines.",
    accent: "#007C7C",
    header: "Standard header",
  },
  {
    id: "modern",
    title: "Modern Minimal",
    description: "Clean spacing with bold accent line and QR-ready footer.",
    accent: "#1E40AF",
    header: "Compact header",
  },
  {
    id: "minimal",
    title: "Minimal Ink",
    description: "Ultra clean documents with focus on readability.",
    accent: "#475569",
    header: "Minimal header",
  },
] as const;

export default function DocumentTemplatesStep() {
  const { data, updateData } = useHospitalOnboarding();
  const branding = data.branding;
  const selectedStyle = branding?.document_template_style || "classic";

  const applyStyle = (styleId: (typeof TEMPLATE_STYLES)[number]["id"]) => {
    if (!branding) return;

    const base = {
      ...branding,
      document_template_style: styleId,
    };

    if (styleId === "classic") {
      updateData("branding", {
        ...base,
        prescription_header_format: "standard",
        invoice_header_format: "standard",
        report_header: {
          ...branding.report_header,
          show_logo: true,
          show_address: true,
          show_phone: true,
          show_registration: true,
        },
        report_footer: {
          ...branding.report_footer,
          signatory_line: true,
        },
        watermark_text: "",
      });
      return;
    }

    if (styleId === "modern") {
      updateData("branding", {
        ...base,
        prescription_header_format: "compact",
        invoice_header_format: "detailed",
        report_header: {
          ...branding.report_header,
          show_logo: true,
          show_address: false,
          show_phone: true,
          show_registration: true,
        },
        report_footer: {
          ...branding.report_footer,
          signatory_line: false,
        },
        watermark_text: "DIGITAL COPY",
      });
      return;
    }

    updateData("branding", {
      ...base,
      prescription_header_format: "compact",
      invoice_header_format: "standard",
      report_header: {
        ...branding.report_header,
        show_logo: false,
        show_address: false,
        show_phone: false,
        show_registration: false,
      },
      report_footer: {
        ...branding.report_footer,
        signatory_line: false,
      },
      watermark_text: "",
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
            <FileText className="h-6 w-6 text-healthcare-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Visual Document Templates
            </h3>
            <p className="text-sm text-gray-600">
              Choose a document style visually—no text fields required.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_STYLES.map((style, index) => {
          const isSelected = selectedStyle === style.id;
          return (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => applyStyle(style.id)}
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
                    {style.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {style.description}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-healthcare-primary" />
                )}
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                <div
                  className="h-2 w-full rounded-full"
                  style={{ backgroundColor: style.accent }}
                />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-2 w-3/4 rounded bg-gray-100" />
                  <div className="h-20 w-full rounded bg-gray-50 border border-gray-100" />
                  <div className="h-2 w-1/2 rounded bg-gray-100" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span>{style.header}</span>
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
              Selected style: <span className="font-medium">{selectedStyle}</span>
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => applyStyle(selectedStyle)}>
            Apply style
          </Button>
        </div>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="h-2 w-full rounded-full bg-healthcare-primary" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-1/3 rounded bg-gray-200" />
              <div className="h-2 w-1/2 rounded bg-gray-100" />
            </div>
            <div className="mt-4 h-24 rounded bg-gray-50 border border-gray-100" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-2 w-1/3 rounded bg-gray-100" />
              <div className="h-6 w-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
