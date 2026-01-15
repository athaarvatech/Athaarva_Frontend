"use client";

/**
 * DocumentTemplateBuilder - Phase 5: Clinical Document Branding
 * 
 * A visual editor for customizing document templates including:
 * - Header configuration (logo, hospital info placement)
 * - Footer configuration (QR code, disclaimer, signatures)
 * - Style settings (colors, fonts, paper size)
 * - Live preview with different document types
 */

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Settings,
  Palette,
  Layout,
  Type,
  Eye,
  Save,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Receipt,
  ClipboardList,
  TestTube,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  DocumentType,
  DocumentTemplateConfig,
  DocumentHeaderConfig,
  DocumentFooterConfig,
  DocumentStyleConfig,
  HospitalBranding,
  DEFAULT_HEADER_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_DOCUMENT_STYLE,
} from "./types";

// ============================================================================
// TYPES
// ============================================================================

interface DocumentTemplateBuilderProps {
  initialConfig?: Partial<DocumentTemplateConfig>;
  hospitalBranding: HospitalBranding;
  onSave?: (config: DocumentTemplateConfig) => Promise<void>;
  onChange?: (config: DocumentTemplateConfig) => void;
  className?: string;
}

type DevicePreview = "desktop" | "tablet" | "mobile";

// ============================================================================
// DEFAULT TEMPLATE CONFIGS
// ============================================================================

const DEFAULT_TEMPLATES: Record<DocumentType, Partial<DocumentTemplateConfig>> = {
  prescription: {
    name: "Prescription Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "left", logoSize: "medium" },
    footer: { ...DEFAULT_FOOTER_CONFIG, showSignatureLine: true },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A4" },
  },
  medical_certificate: {
    name: "Medical Certificate Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "center", logoSize: "large" },
    footer: { ...DEFAULT_FOOTER_CONFIG, showSignatureLine: true, showQRCode: true },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A4" },
  },
  fitness_certificate: {
    name: "Fitness Certificate Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "center", logoSize: "large" },
    footer: { ...DEFAULT_FOOTER_CONFIG, showSignatureLine: true },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A4" },
  },
  invoice: {
    name: "Invoice Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "left", showRegistration: true },
    footer: { ...DEFAULT_FOOTER_CONFIG, showSignatureLine: false, showQRCode: true },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A4" },
  },
  discharge_summary: {
    name: "Discharge Summary Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "left", logoSize: "small" },
    footer: { ...DEFAULT_FOOTER_CONFIG, showPageNumber: true },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A4" },
  },
  lab_report: {
    name: "Lab Report Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "left", headerHeight: 80 },
    footer: { ...DEFAULT_FOOTER_CONFIG, showQRCode: true },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A4" },
  },
  appointment_card: {
    name: "Appointment Card Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "center", logoSize: "small" },
    footer: { ...DEFAULT_FOOTER_CONFIG, showQRCode: true, showSignatureLine: false },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A5" },
  },
  referral_letter: {
    name: "Referral Letter Template",
    header: { ...DEFAULT_HEADER_CONFIG, logoPosition: "left" },
    footer: { ...DEFAULT_FOOTER_CONFIG, showSignatureLine: true },
    style: { ...DEFAULT_DOCUMENT_STYLE, paperSize: "A4" },
  },
};

const DOCUMENT_TYPE_INFO: Record<DocumentType, { label: string; icon: React.ElementType; description: string }> = {
  prescription: { label: "Prescription", icon: FileText, description: "Medicine orders and treatment plans" },
  medical_certificate: { label: "Medical Certificate", icon: FileCheck, description: "Medical leave and sick certificates" },
  fitness_certificate: { label: "Fitness Certificate", icon: CheckCircle, description: "Fitness for duty certificates" },
  invoice: { label: "Invoice / Bill", icon: Receipt, description: "Patient billing and invoices" },
  discharge_summary: { label: "Discharge Summary", icon: ClipboardList, description: "Post-hospitalization summaries" },
  lab_report: { label: "Lab Report", icon: TestTube, description: "Laboratory test reports" },
  appointment_card: { label: "Appointment Card", icon: Calendar, description: "Appointment confirmations" },
  referral_letter: { label: "Referral Letter", icon: FileText, description: "Referral to other specialists" },
};

const FONT_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Arial, sans-serif", label: "Arial" },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function DocumentTemplateBuilder({
  initialConfig,
  hospitalBranding,
  onSave,
  onChange,
  className,
}: DocumentTemplateBuilderProps) {
  // State
  const [documentType, setDocumentType] = useState<DocumentType>(
    initialConfig?.documentType || "prescription"
  );
  const [headerConfig, setHeaderConfig] = useState<DocumentHeaderConfig>({
    ...DEFAULT_HEADER_CONFIG,
    ...initialConfig?.header,
  });
  const [footerConfig, setFooterConfig] = useState<DocumentFooterConfig>({
    ...DEFAULT_FOOTER_CONFIG,
    ...initialConfig?.footer,
  });
  const [styleConfig, setStyleConfig] = useState<DocumentStyleConfig>({
    ...DEFAULT_DOCUMENT_STYLE,
    primaryColor: hospitalBranding.primaryColor,
    secondaryColor: hospitalBranding.secondaryColor,
    ...initialConfig?.style,
  });
  const [templateName, setTemplateName] = useState(
    initialConfig?.name || DEFAULT_TEMPLATES[documentType]?.name || "Custom Template"
  );
  const [isDefault, setIsDefault] = useState(initialConfig?.isDefault || false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");
  const [activeTab, setActiveTab] = useState("header");

  // Build full config
  const fullConfig = useMemo<DocumentTemplateConfig>(() => ({
    id: initialConfig?.id || `template-${Date.now()}`,
    name: templateName,
    documentType,
    isDefault,
    header: headerConfig,
    footer: footerConfig,
    style: styleConfig,
    createdAt: initialConfig?.createdAt || new Date(),
    updatedAt: new Date(),
  }), [initialConfig?.id, templateName, documentType, isDefault, headerConfig, footerConfig, styleConfig, initialConfig?.createdAt]);

  // Notify parent of changes
  React.useEffect(() => {
    onChange?.(fullConfig);
  }, [fullConfig, onChange]);

  // Handle document type change
  const handleDocumentTypeChange = useCallback((type: DocumentType) => {
    setDocumentType(type);
    const defaultTemplate = DEFAULT_TEMPLATES[type];
    if (defaultTemplate) {
      setTemplateName(defaultTemplate.name || `${DOCUMENT_TYPE_INFO[type].label} Template`);
      if (defaultTemplate.header) {
        setHeaderConfig((prev) => ({ ...prev, ...defaultTemplate.header }));
      }
      if (defaultTemplate.footer) {
        setFooterConfig((prev) => ({ ...prev, ...defaultTemplate.footer }));
      }
      if (defaultTemplate.style) {
        setStyleConfig((prev) => ({ ...prev, ...defaultTemplate.style }));
      }
    }
  }, []);

  // Handle save
  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    setSaveStatus("idle");
    
    try {
      await onSave(fullConfig);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save template:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = useCallback(() => {
    const defaultTemplate = DEFAULT_TEMPLATES[documentType];
    setHeaderConfig({ ...DEFAULT_HEADER_CONFIG, ...defaultTemplate?.header });
    setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...defaultTemplate?.footer });
    setStyleConfig({ 
      ...DEFAULT_DOCUMENT_STYLE, 
      primaryColor: hospitalBranding.primaryColor,
      secondaryColor: hospitalBranding.secondaryColor,
      ...defaultTemplate?.style 
    });
    setTemplateName(defaultTemplate?.name || "Custom Template");
    setIsDefault(false);
  }, [documentType, hospitalBranding]);

  // Preview dimensions
  const previewDimensions = {
    desktop: { width: 595, height: 842, scale: 0.7 }, // A4 at 72dpi
    tablet: { width: 595, height: 842, scale: 0.5 },
    mobile: { width: 595, height: 842, scale: 0.35 },
  };

  const currentPreview = previewDimensions[devicePreview];

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      {/* Left Panel - Settings */}
      <div className="flex-1 space-y-6">
        {/* Document Type Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              Document Type
            </CardTitle>
            <CardDescription>
              Select the type of document template to configure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(DOCUMENT_TYPE_INFO) as DocumentType[]).map((type) => {
                const info = DOCUMENT_TYPE_INFO[type];
                const Icon = info.icon;
                return (
                  <button
                    key={type}
                    onClick={() => handleDocumentTypeChange(type)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                      "hover:border-healthcare-primary/50 hover:bg-healthcare-primary/5",
                      documentType === type
                        ? "border-healthcare-primary bg-healthcare-primary/10"
                        : "border-gray-200"
                    )}
                  >
                    <Icon className={cn(
                      "w-6 h-6",
                      documentType === type ? "text-healthcare-primary" : "text-gray-500"
                    )} />
                    <span className={cn(
                      "text-xs font-medium text-center",
                      documentType === type ? "text-healthcare-primary" : "text-gray-600"
                    )}>
                      {info.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Template Name */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Template Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Set as Default</Label>
                <p className="text-sm text-gray-500">
                  Use this template by default for {DOCUMENT_TYPE_INFO[documentType].label}
                </p>
              </div>
              <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            </div>
          </CardContent>
        </Card>

        {/* Configuration Tabs */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="header" className="text-xs">
                  <Layout className="w-4 h-4 mr-1" />
                  Header
                </TabsTrigger>
                <TabsTrigger value="footer" className="text-xs">
                  <Settings className="w-4 h-4 mr-1" />
                  Footer
                </TabsTrigger>
                <TabsTrigger value="style" className="text-xs">
                  <Palette className="w-4 h-4 mr-1" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">
                  <Type className="w-4 h-4 mr-1" />
                  Advanced
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Header Configuration */}
              <TabsContent value="header" className="space-y-4 mt-0">
                <div className="space-y-4">
                  {/* Logo Settings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Logo Settings
                    </h4>
                    <div className="grid gap-4 pl-6">
                      <div className="flex items-center justify-between">
                        <Label>Show Logo</Label>
                        <Switch
                          checked={headerConfig.showLogo}
                          onCheckedChange={(checked) =>
                            setHeaderConfig((prev) => ({ ...prev, showLogo: checked }))
                          }
                        />
                      </div>
                      {headerConfig.showLogo && (
                        <>
                          <div className="space-y-2">
                            <Label>Logo Position</Label>
                            <Select
                              value={headerConfig.logoPosition}
                              onValueChange={(value: "left" | "center" | "right") =>
                                setHeaderConfig((prev) => ({ ...prev, logoPosition: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Logo Size</Label>
                            <Select
                              value={headerConfig.logoSize}
                              onValueChange={(value: "small" | "medium" | "large") =>
                                setHeaderConfig((prev) => ({ ...prev, logoSize: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small (40px)</SelectItem>
                                <SelectItem value="medium">Medium (60px)</SelectItem>
                                <SelectItem value="large">Large (80px)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Hospital Info Settings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Hospital Information
                    </h4>
                    <div className="grid gap-3 pl-6">
                      <div className="flex items-center justify-between">
                        <Label>Show Hospital Name</Label>
                        <Switch
                          checked={headerConfig.showHospitalName}
                          onCheckedChange={(checked) =>
                            setHeaderConfig((prev) => ({ ...prev, showHospitalName: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Address</Label>
                        <Switch
                          checked={headerConfig.showAddress}
                          onCheckedChange={(checked) =>
                            setHeaderConfig((prev) => ({ ...prev, showAddress: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Contact Info</Label>
                        <Switch
                          checked={headerConfig.showContact}
                          onCheckedChange={(checked) =>
                            setHeaderConfig((prev) => ({ ...prev, showContact: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Registration Number</Label>
                        <Switch
                          checked={headerConfig.showRegistration}
                          onCheckedChange={(checked) =>
                            setHeaderConfig((prev) => ({ ...prev, showRegistration: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Header Height */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Header Height
                    </h4>
                    <div className="pl-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Height</span>
                          <span className="text-gray-500">{headerConfig.headerHeight || 100}px</span>
                        </div>
                        <Slider
                          value={[headerConfig.headerHeight || 100]}
                          onValueChange={([value]) =>
                            setHeaderConfig((prev) => ({ ...prev, headerHeight: value }))
                          }
                          min={60}
                          max={150}
                          step={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Footer Configuration */}
              <TabsContent value="footer" className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show QR Code</Label>
                        <p className="text-xs text-gray-500">Document verification QR</p>
                      </div>
                      <Switch
                        checked={footerConfig.showQRCode}
                        onCheckedChange={(checked) =>
                          setFooterConfig((prev) => ({ ...prev, showQRCode: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Page Numbers</Label>
                        <p className="text-xs text-gray-500">For multi-page documents</p>
                      </div>
                      <Switch
                        checked={footerConfig.showPageNumber}
                        onCheckedChange={(checked) =>
                          setFooterConfig((prev) => ({ ...prev, showPageNumber: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Generated Date</Label>
                        <p className="text-xs text-gray-500">Timestamp of document creation</p>
                      </div>
                      <Switch
                        checked={footerConfig.showGeneratedDate}
                        onCheckedChange={(checked) =>
                          setFooterConfig((prev) => ({ ...prev, showGeneratedDate: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Signature Line</Label>
                        <p className="text-xs text-gray-500">Space for authorized signature</p>
                      </div>
                      <Switch
                        checked={footerConfig.showSignatureLine}
                        onCheckedChange={(checked) =>
                          setFooterConfig((prev) => ({ ...prev, showSignatureLine: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Disclaimer</Label>
                        <p className="text-xs text-gray-500">Legal disclaimer text</p>
                      </div>
                      <Switch
                        checked={footerConfig.showDisclaimer}
                        onCheckedChange={(checked) =>
                          setFooterConfig((prev) => ({ ...prev, showDisclaimer: checked }))
                        }
                      />
                    </div>
                  </div>

                  {footerConfig.showDisclaimer && (
                    <div className="space-y-2">
                      <Label>Disclaimer Text</Label>
                      <Textarea
                        value={footerConfig.disclaimerText || ""}
                        onChange={(e) =>
                          setFooterConfig((prev) => ({ ...prev, disclaimerText: e.target.value }))
                        }
                        placeholder="Enter disclaimer text..."
                        className="min-h-[80px] text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label>Footer Height</Label>
                      <span className="text-gray-500">{footerConfig.footerHeight || 60}px</span>
                    </div>
                    <Slider
                      value={[footerConfig.footerHeight || 60]}
                      onValueChange={([value]) =>
                        setFooterConfig((prev) => ({ ...prev, footerHeight: value }))
                      }
                      min={40}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Style Configuration */}
              <TabsContent value="style" className="space-y-4 mt-0">
                <div className="space-y-4">
                  {/* Colors */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Colors</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={styleConfig.primaryColor}
                            onChange={(e) =>
                              setStyleConfig((prev) => ({ ...prev, primaryColor: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border"
                          />
                          <Input
                            value={styleConfig.primaryColor}
                            onChange={(e) =>
                              setStyleConfig((prev) => ({ ...prev, primaryColor: e.target.value }))
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={styleConfig.secondaryColor}
                            onChange={(e) =>
                              setStyleConfig((prev) => ({ ...prev, secondaryColor: e.target.value }))
                            }
                            className="w-10 h-10 rounded cursor-pointer border"
                          />
                          <Input
                            value={styleConfig.secondaryColor}
                            onChange={(e) =>
                              setStyleConfig((prev) => ({ ...prev, secondaryColor: e.target.value }))
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Typography */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Typography</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                          value={styleConfig.fontFamily}
                          onValueChange={(value) =>
                            setStyleConfig((prev) => ({ ...prev, fontFamily: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_OPTIONS.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <span style={{ fontFamily: font.value }}>{font.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <Label>Font Size</Label>
                          <span className="text-gray-500">{styleConfig.fontSize}pt</span>
                        </div>
                        <Slider
                          value={[styleConfig.fontSize]}
                          onValueChange={([value]) =>
                            setStyleConfig((prev) => ({ ...prev, fontSize: value }))
                          }
                          min={8}
                          max={16}
                          step={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <Label>Line Height</Label>
                          <span className="text-gray-500">{styleConfig.lineHeight}</span>
                        </div>
                        <Slider
                          value={[(styleConfig.lineHeight || 1.5) * 10]}
                          onValueChange={([value]) =>
                            setStyleConfig((prev) => ({ ...prev, lineHeight: value / 10 }))
                          }
                          min={10}
                          max={25}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Paper Settings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Paper Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Paper Size</Label>
                        <Select
                          value={styleConfig.paperSize}
                          onValueChange={(value: "A4" | "A5" | "Letter" | "Legal") =>
                            setStyleConfig((prev) => ({ ...prev, paperSize: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A4">A4 (210×297mm)</SelectItem>
                            <SelectItem value="A5">A5 (148×210mm)</SelectItem>
                            <SelectItem value="Letter">Letter (8.5×11in)</SelectItem>
                            <SelectItem value="Legal">Legal (8.5×14in)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Orientation</Label>
                        <Select
                          value={styleConfig.orientation}
                          onValueChange={(value: "portrait" | "landscape") =>
                            setStyleConfig((prev) => ({ ...prev, orientation: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portrait">Portrait</SelectItem>
                            <SelectItem value="landscape">Landscape</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Configuration */}
              <TabsContent value="advanced" className="space-y-4 mt-0">
                <div className="space-y-4">
                  {/* Margins */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Margins (mm)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Top</Label>
                        <Input
                          type="number"
                          value={styleConfig.margins.top}
                          onChange={(e) =>
                            setStyleConfig((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, top: parseInt(e.target.value) || 0 },
                            }))
                          }
                          min={0}
                          max={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Right</Label>
                        <Input
                          type="number"
                          value={styleConfig.margins.right}
                          onChange={(e) =>
                            setStyleConfig((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, right: parseInt(e.target.value) || 0 },
                            }))
                          }
                          min={0}
                          max={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Bottom</Label>
                        <Input
                          type="number"
                          value={styleConfig.margins.bottom}
                          onChange={(e) =>
                            setStyleConfig((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, bottom: parseInt(e.target.value) || 0 },
                            }))
                          }
                          min={0}
                          max={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Left</Label>
                        <Input
                          type="number"
                          value={styleConfig.margins.left}
                          onChange={(e) =>
                            setStyleConfig((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, left: parseInt(e.target.value) || 0 },
                            }))
                          }
                          min={0}
                          max={50}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Header Background */}
                  <div className="space-y-2">
                    <Label>Header Background Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={headerConfig.headerBackground || "#ffffff"}
                        onChange={(e) =>
                          setHeaderConfig((prev) => ({
                            ...prev,
                            headerBackground: e.target.value === "#ffffff" ? undefined : e.target.value,
                          }))
                        }
                        className="w-10 h-10 rounded cursor-pointer border"
                      />
                      <Input
                        value={headerConfig.headerBackground || ""}
                        onChange={(e) =>
                          setHeaderConfig((prev) => ({
                            ...prev,
                            headerBackground: e.target.value || undefined,
                          }))
                        }
                        placeholder="Transparent"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Footer Background */}
                  <div className="space-y-2">
                    <Label>Footer Background Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={footerConfig.footerBackground || "#ffffff"}
                        onChange={(e) =>
                          setFooterConfig((prev) => ({
                            ...prev,
                            footerBackground: e.target.value === "#ffffff" ? undefined : e.target.value,
                          }))
                        }
                        className="w-10 h-10 rounded cursor-pointer border"
                      />
                      <Input
                        value={footerConfig.footerBackground || ""}
                        onChange={(e) =>
                          setFooterConfig((prev) => ({
                            ...prev,
                            footerBackground: e.target.value || undefined,
                          }))
                        }
                        placeholder="Transparent"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !onSave}
            className="flex-1 bg-healthcare-primary hover:bg-healthcare-primary/90"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saveStatus === "saved" ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : saveStatus === "error" ? (
              <AlertCircle className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Template"}
          </Button>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="lg:w-[450px] space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="w-5 h-5" />
                Preview
              </CardTitle>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDevicePreview("mobile")}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    devicePreview === "mobile"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  title="Mobile view"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevicePreview("tablet")}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    devicePreview === "tablet"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  title="Tablet view"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevicePreview("desktop")}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    devicePreview === "desktop"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  title="Desktop view"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
            <CardDescription>
              {DOCUMENT_TYPE_INFO[documentType].label} - {styleConfig.paperSize} {styleConfig.orientation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Preview Container */}
            <div
              className="bg-gray-200 rounded-lg p-4 flex items-center justify-center overflow-hidden"
              style={{ minHeight: "500px" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={devicePreview}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white shadow-xl"
                  style={{
                    width: `${currentPreview.width * currentPreview.scale}px`,
                    minHeight: `${currentPreview.height * currentPreview.scale}px`,
                    transform: `scale(${currentPreview.scale})`,
                    transformOrigin: "top center",
                    fontFamily: styleConfig.fontFamily,
                    fontSize: `${styleConfig.fontSize * currentPreview.scale}pt`,
                    padding: `${styleConfig.margins.top}mm ${styleConfig.margins.right}mm ${styleConfig.margins.bottom}mm ${styleConfig.margins.left}mm`,
                  }}
                >
                  {/* Preview Header */}
                  <div
                    className="border-b-2 pb-3 mb-3"
                    style={{
                      borderColor: styleConfig.primaryColor,
                      backgroundColor: headerConfig.headerBackground,
                    }}
                  >
                    <div
                      className={cn(
                        "flex items-start gap-3",
                        headerConfig.logoPosition === "center" && "flex-col items-center text-center",
                        headerConfig.logoPosition === "right" && "flex-row-reverse"
                      )}
                    >
                      {headerConfig.showLogo && hospitalBranding.logoUrl && (
                        <div
                          className="bg-gray-100 rounded flex items-center justify-center"
                          style={{
                            width: headerConfig.logoSize === "small" ? "30px" : headerConfig.logoSize === "medium" ? "45px" : "60px",
                            height: headerConfig.logoSize === "small" ? "30px" : headerConfig.logoSize === "medium" ? "45px" : "60px",
                          }}
                        >
                          <img
                            src={hospitalBranding.logoUrl}
                            alt="Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      {headerConfig.showLogo && !hospitalBranding.logoUrl && (
                        <div
                          className="bg-gray-200 rounded flex items-center justify-center text-gray-400"
                          style={{
                            width: headerConfig.logoSize === "small" ? "30px" : headerConfig.logoSize === "medium" ? "45px" : "60px",
                            height: headerConfig.logoSize === "small" ? "30px" : headerConfig.logoSize === "medium" ? "45px" : "60px",
                            fontSize: "8px",
                          }}
                        >
                          Logo
                        </div>
                      )}
                      <div className={cn("flex-1", headerConfig.logoPosition === "center" && "text-center")}>
                        {headerConfig.showHospitalName && (
                          <h1
                            className="font-bold"
                            style={{
                              color: styleConfig.primaryColor,
                              fontSize: `${14 * currentPreview.scale}px`,
                            }}
                          >
                            {hospitalBranding.hospitalName}
                          </h1>
                        )}
                        {hospitalBranding.tagline && (
                          <p className="text-gray-500 italic" style={{ fontSize: `${8 * currentPreview.scale}px` }}>
                            {hospitalBranding.tagline}
                          </p>
                        )}
                        {headerConfig.showAddress && (
                          <p className="text-gray-600" style={{ fontSize: `${7 * currentPreview.scale}px` }}>
                            {hospitalBranding.address}, {hospitalBranding.city}
                          </p>
                        )}
                        {headerConfig.showContact && (
                          <p className="text-gray-500" style={{ fontSize: `${6 * currentPreview.scale}px` }}>
                            Ph: {hospitalBranding.phone} | {hospitalBranding.email}
                          </p>
                        )}
                        {headerConfig.showRegistration && hospitalBranding.registrationNumber && (
                          <p className="text-gray-400" style={{ fontSize: `${5 * currentPreview.scale}px` }}>
                            Reg: {hospitalBranding.registrationNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="text-center mb-3">
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: styleConfig.primaryColor,
                        color: styleConfig.primaryColor,
                        fontSize: `${9 * currentPreview.scale}px`,
                      }}
                    >
                      {DOCUMENT_TYPE_INFO[documentType].label.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Sample Content */}
                  <div className="space-y-2" style={{ fontSize: `${7 * currentPreview.scale}px` }}>
                    <div className="bg-gray-50 rounded p-2">
                      <p><span className="text-gray-500">Patient:</span> <span className="font-medium">Sample Patient</span></p>
                      <p><span className="text-gray-500">ID:</span> PID-2024-0001</p>
                    </div>
                    <div className="border-t pt-2 mt-2" style={{ borderColor: `${styleConfig.primaryColor}30` }}>
                      <p className="text-gray-400 text-center italic">Document content area</p>
                    </div>
                  </div>

                  {/* Preview Footer */}
                  <div
                    className="border-t pt-2 mt-4"
                    style={{
                      borderColor: styleConfig.primaryColor,
                      backgroundColor: footerConfig.footerBackground,
                    }}
                  >
                    <div className="flex justify-between items-end" style={{ fontSize: `${5 * currentPreview.scale}px` }}>
                      {footerConfig.showQRCode && (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-400" style={{ fontSize: "6px" }}>
                          QR
                        </div>
                      )}
                      <div className="text-center flex-1 px-2">
                        {footerConfig.showDisclaimer && (
                          <p className="text-gray-400 italic truncate">{footerConfig.disclaimerText?.substring(0, 50)}...</p>
                        )}
                        {footerConfig.showGeneratedDate && (
                          <p className="text-gray-300">Generated: {new Date().toLocaleDateString()}</p>
                        )}
                      </div>
                      {footerConfig.showSignatureLine && (
                        <div className="text-right">
                          <div className="w-12 border-b border-gray-300 mb-0.5"></div>
                          <p className="text-gray-400">Signature</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DocumentTemplateBuilder;
