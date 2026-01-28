"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  CheckCircle, 
  Sparkles, 
  Receipt, 
  FileBadge, 
  FlaskConical,
  ClipboardCheck,
  ChevronRight,
  Eye,
  Palette,
  Check,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Template visual styles based on professional prescription designs
type TemplateVisualStyle = "classic" | "modern" | "minimal";

interface TemplateStyleConfig {
  id: TemplateVisualStyle;
  name: string;
  description: string;
  features: string[];
}

const TEMPLATE_STYLES: TemplateStyleConfig[] = [
  {
    id: "classic",
    name: "Classic Clinical",
    description: "Professional design with dotted pattern accent and green sidebar. Traditional healthcare aesthetic.",
    features: ["Dotted pattern decoration", "Vertical sidebar accent", "Left-aligned footer", "Clean professional look"],
  },
  {
    id: "modern",
    name: "Modern Watermark",
    description: "Contemporary design with subtle logo watermark and curved corner accents. Elegant and memorable.",
    features: ["Large watermark logo", "Curved corner accent", "Centered footer", "Elegant modern feel"],
  },
  {
    id: "minimal",
    name: "Minimal Geometric",
    description: "Clean minimalist design with diagonal corner shapes. Modern corporate healthcare style.",
    features: ["Diagonal corner shapes", "Ultra-clean layout", "Right-aligned footer", "Corporate modern style"],
  },
];

// Document types to enable
interface DocumentTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  { id: "prescription", name: "Prescription", description: "Medicine orders and treatment plans", icon: <FileText className="w-5 h-5" />, required: true },
  { id: "invoice", name: "Invoice / Bill", description: "Patient billing and invoices", icon: <Receipt className="w-5 h-5" />, required: true },
  { id: "medical_certificate", name: "Medical Certificate", description: "Fitness and sick leave certificates", icon: <FileBadge className="w-5 h-5" />, required: false },
  { id: "lab_report", name: "Lab Report", description: "Laboratory test results and reports", icon: <FlaskConical className="w-5 h-5" />, required: false },
  { id: "discharge_summary", name: "Discharge Summary", description: "Post-hospitalization summaries", icon: <ClipboardCheck className="w-5 h-5" />, required: false },
];

// Decorative preview components for each style
const ClassicPreview = ({ primaryColor }: { primaryColor: string }) => (
  <div className="relative h-40 rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm">
    {/* Right sidebar */}
    <div className="absolute right-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: primaryColor }} />
    {/* Dotted pattern */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex gap-1">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="w-1 h-1 rounded-sm" style={{ backgroundColor: primaryColor }} />
          ))}
        </div>
      ))}
    </div>
    {/* Content preview */}
    <div className="p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }} />
        <div className="h-2 w-16 rounded bg-gray-300" />
      </div>
      <div className="h-1 w-3/4 rounded bg-gray-200 mb-1" />
      <div className="h-1 w-1/2 rounded bg-gray-200" />
      <div className="mt-3 h-16 rounded bg-gray-50 border border-gray-100" />
    </div>
  </div>
);

const ModernPreview = ({ primaryColor, logoUrl }: { primaryColor: string; logoUrl?: string }) => (
  <div className="relative h-40 rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm">
    {/* Watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {logoUrl ? (
        <img src={logoUrl} alt="" className="w-20 h-20 object-contain opacity-[0.05]" />
      ) : (
        <div className="text-5xl font-bold opacity-[0.04]" style={{ color: primaryColor }}>⚕</div>
      )}
    </div>
    {/* Curved corner */}
    <div 
      className="absolute bottom-0 left-0 w-12 h-6" 
      style={{ backgroundColor: primaryColor, borderTopRightRadius: "100%" }} 
    />
    {/* Content preview */}
    <div className="relative p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }} />
        <div className="h-2 w-16 rounded bg-gray-300" />
      </div>
      <div className="h-1 w-3/4 rounded bg-gray-200 mb-1" />
      <div className="h-1 w-1/2 rounded bg-gray-200" />
      <div className="mt-3 h-16 rounded bg-gray-50 border border-gray-100" />
    </div>
  </div>
);

const MinimalPreview = ({ primaryColor }: { primaryColor: string }) => (
  <div className="relative h-40 rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm">
    {/* Top-right diagonal */}
    <div
      className="absolute top-0 right-0"
      style={{
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: "0 30px 30px 0",
        borderColor: `transparent ${primaryColor} transparent transparent`,
      }}
    />
    {/* Bottom-left diagonal */}
    <div
      className="absolute bottom-0 left-0"
      style={{
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: "30px 0 0 30px",
        borderColor: `transparent transparent transparent ${primaryColor}`,
      }}
    />
    {/* Content preview */}
    <div className="relative p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }} />
        <div className="h-2 w-16 rounded bg-gray-300" />
      </div>
      <div className="h-1 w-3/4 rounded bg-gray-200 mb-1" />
      <div className="h-1 w-1/2 rounded bg-gray-200" />
      <div className="mt-3 h-16 rounded bg-gray-50 border border-gray-100" />
    </div>
  </div>
);

export default function DocumentTemplatesStep() {
  const { data, updateData } = useHospitalOnboarding();
  const branding = data.branding;
  const organizationProfile = data.organizationProfile;
  
  // Local state
  const [selectedStyle, setSelectedStyle] = useState<TemplateVisualStyle>(
    (branding?.document_template_style as TemplateVisualStyle) || "classic"
  );
  const [enabledDocuments, setEnabledDocuments] = useState<string[]>(
    ["prescription", "invoice"] // Default enabled documents
  );
  const [activeTab, setActiveTab] = useState<"style" | "documents" | "preview">("style");

  const primaryColor = branding?.colors?.primary || "#007C7C";
  const hospitalName = organizationProfile?.trade_name || organizationProfile?.legal_name || "City General Hospital";

  // Handle style selection
  const handleStyleSelect = useCallback((style: TemplateVisualStyle) => {
    setSelectedStyle(style);
    
    if (!branding) return;

    const base = {
      ...branding,
      document_template_style: style,
    };

    if (style === "classic") {
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
    } else if (style === "modern") {
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
    } else {
      updateData("branding", {
        ...base,
        prescription_header_format: "compact",
        invoice_header_format: "standard",
        report_header: {
          ...branding.report_header,
          show_logo: true,
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
    }
  }, [branding, updateData]);

  // Handle document toggle
  const handleDocumentToggle = useCallback((docId: string) => {
    const doc = DOCUMENT_TYPES.find(d => d.id === docId);
    if (doc?.required) return; // Can't disable required docs
    
    setEnabledDocuments(prev => {
      const newDocs = prev.includes(docId)
        ? prev.filter(d => d !== docId)
        : [...prev, docId];
      
      return newDocs;
    });
  }, []);

  // Render style preview based on selected style
  const renderStylePreview = (style: TemplateVisualStyle) => {
    switch (style) {
      case "classic":
        return <ClassicPreview primaryColor={primaryColor} />;
      case "modern":
        return <ModernPreview primaryColor={primaryColor} logoUrl={branding?.logo_url} />;
      case "minimal":
        return <MinimalPreview primaryColor={primaryColor} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              Document Template Builder
            </h3>
            <p className="text-sm text-gray-600">
              Choose a visual style for your hospital documents including prescriptions, invoices, and certificates.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Template Style
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Document Types
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Style Selection Tab */}
        <TabsContent value="style">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-healthcare-primary" />
                Choose Your Template Style
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                Select a design style that will be applied to all your hospital documents.
                Each style has unique decorative elements.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {TEMPLATE_STYLES.map((style, index) => (
                  <motion.button
                    key={style.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleStyleSelect(style.id)}
                    className={cn(
                      "relative text-left rounded-xl border-2 p-4 transition-all duration-300",
                      selectedStyle === style.id
                        ? "border-healthcare-primary bg-healthcare-primary/5 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    )}
                  >
                    {/* Selection indicator */}
                    {selectedStyle === style.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-healthcare-primary flex items-center justify-center z-10"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}

                    {/* Preview */}
                    <div className="mb-4">
                      {renderStylePreview(style.id)}
                    </div>

                    {/* Info */}
                    <h4 className="font-semibold text-gray-900">{style.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{style.description}</p>

                    {/* Features */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {style.features.slice(0, 2).map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color customization */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Document Colors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Primary Color (from branding)</Label>
                    <div className="flex gap-2 mt-1">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input 
                        value={primaryColor}
                        readOnly
                        className="flex-1 font-mono text-sm bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Inherited from your hospital branding
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("documents")} className="gap-2">
                Next: Select Documents
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Documents Selection Tab */}
        <TabsContent value="documents">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-healthcare-primary" />
                Select Document Types
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                Choose which document types your hospital will use. Prescription and Invoice are required.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {DOCUMENT_TYPES.map((doc) => {
                  const isEnabled = enabledDocuments.includes(doc.id);
                  return (
                    <motion.button
                      key={doc.id}
                      onClick={() => handleDocumentToggle(doc.id)}
                      disabled={doc.required}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                        isEnabled
                          ? "border-healthcare-primary bg-healthcare-primary/5"
                          : "border-gray-200 hover:border-gray-300 bg-white",
                        doc.required && "cursor-default"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          isEnabled ? "text-white" : "bg-gray-100 text-gray-600"
                        )}
                        style={{
                          backgroundColor: isEnabled ? primaryColor : undefined,
                        }}
                      >
                        {doc.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{doc.name}</p>
                          {doc.required && (
                            <Badge variant="outline" className="text-[10px]">Required</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{doc.description}</p>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          isEnabled
                            ? "border-healthcare-primary bg-healthcare-primary"
                            : "border-gray-300"
                        )}
                      >
                        {isEnabled && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> You can enable additional document types later from your hospital dashboard settings.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("style")}>
                Back to Style
              </Button>
              <Button onClick={() => setActiveTab("preview")} className="gap-2">
                Preview Documents
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-healthcare-primary" />
                Preview Your Documents
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                See how your documents will look with the selected style.
              </p>
            </div>

            {/* Full preview */}
            <div className="flex justify-center bg-gray-100 rounded-xl p-8">
              <div 
                className="relative bg-white shadow-xl rounded-lg overflow-hidden"
                style={{ width: "400px", height: "566px" }}
              >
                {/* Decorations based on style */}
                {selectedStyle === "classic" && (
                  <>
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-2" 
                      style={{ backgroundColor: primaryColor }} 
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex gap-1.5">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="w-2 h-2 rounded-sm" style={{ backgroundColor: primaryColor }} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {selectedStyle === "modern" && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {branding?.logo_url ? (
                        <img src={branding.logo_url} alt="" className="w-48 h-48 object-contain opacity-[0.04]" />
                      ) : (
                        <div className="text-[150px] font-bold opacity-[0.03]" style={{ color: primaryColor }}>⚕</div>
                      )}
                    </div>
                    <div 
                      className="absolute bottom-0 left-0 w-32 h-16" 
                      style={{ backgroundColor: primaryColor, borderTopRightRadius: "100%" }} 
                    />
                  </>
                )}
                {selectedStyle === "minimal" && (
                  <>
                    <div
                      className="absolute top-0 right-0"
                      style={{
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 80px 80px 0",
                        borderColor: `transparent ${primaryColor} transparent transparent`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0"
                      style={{
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "80px 0 0 80px",
                        borderColor: `transparent transparent transparent ${primaryColor}`,
                      }}
                    />
                  </>
                )}

                {/* Content */}
                <div 
                  className={cn(
                    "relative z-10 p-6",
                    selectedStyle === "classic" && "pr-16"
                  )}
                >
                  {/* Header */}
                  <div className="border-b-2 pb-3 mb-4" style={{ borderColor: primaryColor }}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {hospitalName.charAt(0) || "H"}
                      </div>
                      <div>
                        <h1 className="text-lg font-bold" style={{ color: primaryColor }}>
                          {hospitalName}
                        </h1>
                        <p className="text-xs text-gray-500">Healthcare Excellence</p>
                      </div>
                    </div>
                  </div>

                  {/* Sample prescription content */}
                  <div className="mb-4">
                    <Badge variant="outline" style={{ borderColor: primaryColor, color: primaryColor }}>
                      PRESCRIPTION
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="p-2 rounded" style={{ backgroundColor: `${primaryColor}10` }}>
                      <p><strong>Patient:</strong> Sample Patient</p>
                      <p><strong>ID:</strong> PID-2024-0001</p>
                    </div>

                    <div className="text-2xl font-bold" style={{ color: primaryColor }}>℞</div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs p-2 bg-gray-50 rounded">
                        <span><strong style={{ color: primaryColor }}>TAB</strong> Demo Medicine 1</span>
                        <span>1-0-1</span>
                      </div>
                      <div className="flex justify-between text-xs p-2 bg-gray-50 rounded">
                        <span><strong style={{ color: primaryColor }}>CAP</strong> Demo Medicine 2</span>
                        <span>1-1-1</span>
                      </div>
                    </div>

                    <div className="text-xs">
                      <p className="font-semibold" style={{ color: primaryColor }}>Advice:</p>
                      <p className="text-gray-600">Avoid oily and spicy food</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div 
                    className={cn(
                      "absolute bottom-4 left-6 right-6 text-xs text-gray-500 border-t pt-2",
                      selectedStyle === "classic" && "text-left right-16",
                      selectedStyle === "modern" && "text-center bottom-20",
                      selectedStyle === "minimal" && "text-right left-16"
                    )}
                    style={{ borderColor: `${primaryColor}33` }}
                  >
                    <p style={{ color: primaryColor }}>{hospitalName}</p>
                    <p>Address line, City - 400001</p>
                  </div>
                </div>

                {/* Preview watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-5xl font-bold text-gray-200 rotate-[-30deg]">PREVIEW</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Template Style:</span>
                  <span className="font-medium">
                    {TEMPLATE_STYLES.find(s => s.id === selectedStyle)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary Color:</span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: primaryColor }} />
                    <span className="font-mono">{primaryColor}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents Enabled:</span>
                  <span className="font-medium">{enabledDocuments.length}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("documents")}>
                Back to Documents
              </Button>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Configuration saved automatically
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
