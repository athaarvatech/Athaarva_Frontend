"use client";

/**
 * =============================================================================
 * TEMPLATE EDITOR SIDEBAR
 * =============================================================================
 * 
 * A comprehensive sidebar component for editing hospital website templates.
 * Organized into four main modules:
 * 
 * 1. BRANDING STUDIO - Visual identity (colors, logos, fonts)
 * 2. SITE CONTENT - Text content, sections, and structure
 * 3. SERVICES & PRICING - Medical services and pricing packages
 * 4. COMPLIANCE & DOCS - Certifications, legal documents, policies
 * 
 * HOW TO USE:
 * - Each section can be expanded/collapsed
 * - Changes are reflected in real-time on the preview canvas
 * - Tooltips provide guidance on each field
 * - Auto-save is handled by the parent component
 * 
 * =============================================================================
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  FileText,
  Shield,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Info,
  Upload,
  Globe,
  Phone,
  Mail,
  Clock,
  Award,
  FileCheck,
  Lock,
  ExternalLink,
  HelpCircle,
  Building2,
  Users,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TemplateBlueprint,
  BrandingConfig,
  ServicesAndPricing,
  ComplianceAndDocs,
  ServiceItem,
  PricingPackage,
  Certification,
  LegalDocument,
} from "./templateBlueprints";
import { ThemeCustomizer } from "./ThemeCustomizer";

// ============================================================================
// TYPES
// ============================================================================

export interface TemplateEditorSidebarProps {
  blueprint: TemplateBlueprint;
  onBlueprintChange: (blueprint: TemplateBlueprint) => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

type SidebarSection = "branding" | "content" | "services" | "compliance";

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  badge?: string;
}

function SectionHeader({
  icon,
  title,
  description,
  isExpanded,
  onToggle,
  badge,
}: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-healthcare-primary/10 rounded-lg text-healthcare-primary">
          {icon}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {badge && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-healthcare-primary/10 text-healthcare-primary rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );
}

interface FieldWithTooltipProps {
  label: string;
  tooltip: string;
  children: React.ReactNode;
  required?: boolean;
}

function FieldWithTooltip({
  label,
  tooltip,
  children,
  required,
}: FieldWithTooltipProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );
}

// ============================================================================
// BRANDING STUDIO PANEL
// ============================================================================

interface BrandingPanelProps {
  branding: BrandingConfig;
  palette: TemplateBlueprint["palette"];
  typography: TemplateBlueprint["typography"];
  onBrandingChange: (branding: BrandingConfig) => void;
  onPaletteChange: (palette: TemplateBlueprint["palette"]) => void;
  onTypographyChange: (typography: TemplateBlueprint["typography"]) => void;
}

function BrandingPanel({
  branding,
  palette,
  typography,
  onBrandingChange,
  onPaletteChange,
  onTypographyChange,
}: BrandingPanelProps) {
  const updateBranding = useCallback(
    <K extends keyof BrandingConfig>(key: K, value: BrandingConfig[K]) => {
      onBrandingChange({ ...branding, [key]: value });
    },
    [branding, onBrandingChange]
  );

  const updateContactInfo = useCallback(
    (field: keyof BrandingConfig["contactInfo"], value: string) => {
      onBrandingChange({
        ...branding,
        contactInfo: { ...branding.contactInfo, [field]: value },
      });
    },
    [branding, onBrandingChange]
  );

  const updateBusinessHours = useCallback(
    (field: keyof BrandingConfig["businessHours"], value: string) => {
      onBrandingChange({
        ...branding,
        businessHours: { ...branding.businessHours, [field]: value },
      });
    },
    [branding, onBrandingChange]
  );

  return (
    <div className="space-y-6 p-4">
      {/* Basic Info */}
      <div className="space-y-4">
        <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Basic Information
        </h5>
        
        <FieldWithTooltip
          label="Hospital Name"
          tooltip="Your official hospital or clinic name as it will appear on the website"
          required
        >
          <Input
            value={branding.name}
            onChange={(e) => updateBranding("name", e.target.value)}
            placeholder="Enter hospital name"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Tagline"
          tooltip="A short, memorable phrase that captures your brand essence"
        >
          <Input
            value={branding.tagline}
            onChange={(e) => updateBranding("tagline", e.target.value)}
            placeholder="e.g., Excellence in Healthcare"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Description"
          tooltip="A detailed description for SEO and about sections (2-3 sentences)"
        >
          <Textarea
            value={branding.description}
            onChange={(e) => updateBranding("description", e.target.value)}
            placeholder="Describe your hospital's mission and specialties..."
            rows={3}
          />
        </FieldWithTooltip>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contact Information
        </h5>

        <FieldWithTooltip
          label="Primary Phone"
          tooltip="Main contact number for patient inquiries"
          required
        >
          <Input
            value={branding.contactInfo.primaryPhone}
            onChange={(e) => updateContactInfo("primaryPhone", e.target.value)}
            placeholder="+1 (800) 123-4567"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Email"
          tooltip="General inquiry email address"
          required
        >
          <Input
            type="email"
            value={branding.contactInfo.email}
            onChange={(e) => updateContactInfo("email", e.target.value)}
            placeholder="info@hospital.com"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Emergency Hotline"
          tooltip="24/7 emergency contact number (if available)"
        >
          <Input
            value={branding.contactInfo.emergencyHotline || ""}
            onChange={(e) => updateContactInfo("emergencyHotline", e.target.value)}
            placeholder="+1 (800) 911-HELP"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="WhatsApp"
          tooltip="WhatsApp number for patient communication"
        >
          <Input
            value={branding.contactInfo.whatsapp || ""}
            onChange={(e) => updateContactInfo("whatsapp", e.target.value)}
            placeholder="+1 (800) 123-4567"
          />
        </FieldWithTooltip>
      </div>

      {/* Business Hours */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Business Hours
        </h5>

        <FieldWithTooltip
          label="Weekdays"
          tooltip="Operating hours Monday through Friday"
        >
          <Input
            value={branding.businessHours.weekdays}
            onChange={(e) => updateBusinessHours("weekdays", e.target.value)}
            placeholder="Mon-Fri: 8:00 AM - 8:00 PM"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Weekends"
          tooltip="Operating hours Saturday and Sunday"
        >
          <Input
            value={branding.businessHours.weekends}
            onChange={(e) => updateBusinessHours("weekends", e.target.value)}
            placeholder="Sat-Sun: 9:00 AM - 5:00 PM"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Emergency Note"
          tooltip="Special note about emergency services availability"
        >
          <Input
            value={branding.businessHours.emergencyNote}
            onChange={(e) => updateBusinessHours("emergencyNote", e.target.value)}
            placeholder="Emergency services available 24/7"
          />
        </FieldWithTooltip>
      </div>

      {/* Social Links */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Social Media Links
        </h5>

        {branding.socialLinks.map((link, index) => (
          <div key={link.platform} className="flex items-center gap-3">
            <Switch
              checked={link.enabled}
              onCheckedChange={(checked) => {
                const newLinks = [...branding.socialLinks];
                newLinks[index] = { ...link, enabled: checked };
                updateBranding("socialLinks", newLinks);
              }}
            />
            <div className="flex-1">
              <Input
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...branding.socialLinks];
                  newLinks[index] = { ...link, url: e.target.value };
                  updateBranding("socialLinks", newLinks);
                }}
                placeholder={`${link.platform} URL`}
                disabled={!link.enabled}
                className="text-sm"
              />
            </div>
            <span className="text-xs text-gray-500 capitalize w-20">
              {link.platform}
            </span>
          </div>
        ))}
      </div>

      {/* Theme Customizer */}
      <div className="pt-4 border-t border-gray-100">
        <ThemeCustomizer
          palette={palette}
          typography={typography}
          onPaletteChange={onPaletteChange}
          onTypographyChange={onTypographyChange}
        />
      </div>
    </div>
  );
}

// ============================================================================
// SERVICES & PRICING PANEL
// ============================================================================

interface ServicesPricingPanelProps {
  servicesAndPricing: ServicesAndPricing | undefined;
  onServicesChange: (services: ServicesAndPricing) => void;
}

function ServicesPricingPanel({
  servicesAndPricing,
  onServicesChange,
}: ServicesPricingPanelProps) {
  const services = servicesAndPricing || {
    sectionTitle: "Our Services",
    sectionSubtitle: "Comprehensive healthcare solutions",
    services: [],
    packages: [],
    insurancePartners: [],
    paymentMethods: [],
    priceDisclaimer: "",
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: "New Service",
      category: "General",
      description: "Service description...",
      icon: "🩺",
      features: [],
      featured: false,
    };
    onServicesChange({
      ...services,
      services: [...services.services, newService],
    });
  };

  const updateService = (index: number, updates: Partial<ServiceItem>) => {
    const newServices = [...services.services];
    newServices[index] = { ...newServices[index], ...updates };
    onServicesChange({ ...services, services: newServices });
  };

  const removeService = (index: number) => {
    const newServices = services.services.filter((_, i) => i !== index);
    onServicesChange({ ...services, services: newServices });
  };

  const addPackage = () => {
    const newPackage: PricingPackage = {
      id: `pkg-${Date.now()}`,
      name: "New Package",
      description: "Package description...",
      price: 0,
      currency: "USD",
      billingCycle: "one-time",
      features: [],
      recommended: false,
      ctaLabel: "Book Now",
      ctaHref: "/book",
    };
    onServicesChange({
      ...services,
      packages: [...services.packages, newPackage],
    });
  };

  const updatePackage = (index: number, updates: Partial<PricingPackage>) => {
    const newPackages = [...services.packages];
    newPackages[index] = { ...newPackages[index], ...updates };
    onServicesChange({ ...services, packages: newPackages });
  };

  const removePackage = (index: number) => {
    const newPackages = services.packages.filter((_, i) => i !== index);
    onServicesChange({ ...services, packages: newPackages });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Section Header */}
      <div className="space-y-4">
        <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          Section Settings
        </h5>
        
        <FieldWithTooltip
          label="Section Title"
          tooltip="Title displayed above the services section"
        >
          <Input
            value={services.sectionTitle}
            onChange={(e) =>
              onServicesChange({ ...services, sectionTitle: e.target.value })
            }
            placeholder="Our Services"
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Section Subtitle"
          tooltip="Brief description below the title"
        >
          <Input
            value={services.sectionSubtitle}
            onChange={(e) =>
              onServicesChange({ ...services, sectionSubtitle: e.target.value })
            }
            placeholder="Comprehensive healthcare solutions"
          />
        </FieldWithTooltip>
      </div>

      {/* Services List */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-gray-800">Medical Services</h5>
          <Button variant="outline" size="sm" onClick={addService}>
            <Plus className="w-4 h-4 mr-1" />
            Add Service
          </Button>
        </div>

        {services.services.map((service, index) => (
          <div
            key={service.id}
            className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  value={service.icon}
                  onChange={(e) => updateService(index, { icon: e.target.value })}
                  className="w-12 text-center text-lg"
                />
                <Input
                  value={service.name}
                  onChange={(e) => updateService(index, { name: e.target.value })}
                  placeholder="Service name"
                  className="font-medium"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeService(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Input
              value={service.category}
              onChange={(e) => updateService(index, { category: e.target.value })}
              placeholder="Category"
              className="text-sm"
            />

            <Textarea
              value={service.description}
              onChange={(e) =>
                updateService(index, { description: e.target.value })
              }
              placeholder="Service description..."
              rows={2}
              className="text-sm"
            />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={service.featured}
                  onCheckedChange={(checked) =>
                    updateService(index, { featured: checked })
                  }
                />
                <Label className="text-sm">Featured</Label>
              </div>
            </div>
          </div>
        ))}

        {services.services.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No services added yet. Click "Add Service" to get started.
          </div>
        )}
      </div>

      {/* Pricing Packages */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-gray-800">Health Packages</h5>
          <Button variant="outline" size="sm" onClick={addPackage}>
            <Plus className="w-4 h-4 mr-1" />
            Add Package
          </Button>
        </div>

        {services.packages.map((pkg, index) => (
          <div
            key={pkg.id}
            className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <Input
                value={pkg.name}
                onChange={(e) => updatePackage(index, { name: e.target.value })}
                placeholder="Package name"
                className="font-medium flex-1 mr-2"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePackage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Textarea
              value={pkg.description}
              onChange={(e) =>
                updatePackage(index, { description: e.target.value })
              }
              placeholder="Package description..."
              rows={2}
              className="text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Price</Label>
                <Input
                  type="number"
                  value={pkg.price}
                  onChange={(e) =>
                    updatePackage(index, { price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="text-xs">Currency</Label>
                <Select
                  value={pkg.currency}
                  onValueChange={(value) =>
                    updatePackage(index, { currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={pkg.recommended}
                  onCheckedChange={(checked) =>
                    updatePackage(index, { recommended: checked })
                  }
                />
                <Label className="text-sm">Recommended</Label>
              </div>
            </div>
          </div>
        ))}

        {services.packages.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No packages added yet. Click "Add Package" to get started.
          </div>
        )}
      </div>

      {/* Price Disclaimer */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <FieldWithTooltip
          label="Price Disclaimer"
          tooltip="Legal disclaimer shown below pricing information"
        >
          <Textarea
            value={services.priceDisclaimer}
            onChange={(e) =>
              onServicesChange({ ...services, priceDisclaimer: e.target.value })
            }
            placeholder="Prices are indicative and may vary..."
            rows={2}
            className="text-sm"
          />
        </FieldWithTooltip>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLIANCE & DOCUMENTATION PANEL
// ============================================================================

interface CompliancePanelProps {
  compliance: ComplianceAndDocs | undefined;
  onComplianceChange: (compliance: ComplianceAndDocs) => void;
}

function CompliancePanel({
  compliance,
  onComplianceChange,
}: CompliancePanelProps) {
  const complianceData = compliance || {
    certifications: [],
    legalDocuments: [],
    registrations: [],
    dataProtection: {
      gdprCompliant: false,
      hipaaCompliant: false,
      dataRetentionPolicy: "",
      cookiePolicy: "",
    },
    emergencyProtocols: {
      enabled: false,
      content: "",
    },
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: "New Certification",
      issuingBody: "Issuing Authority",
    };
    onComplianceChange({
      ...complianceData,
      certifications: [...complianceData.certifications, newCert],
    });
  };

  const updateCertification = (index: number, updates: Partial<Certification>) => {
    const newCerts = [...complianceData.certifications];
    newCerts[index] = { ...newCerts[index], ...updates };
    onComplianceChange({ ...complianceData, certifications: newCerts });
  };

  const removeCertification = (index: number) => {
    const newCerts = complianceData.certifications.filter((_, i) => i !== index);
    onComplianceChange({ ...complianceData, certifications: newCerts });
  };

  const addLegalDocument = () => {
    const newDoc: LegalDocument = {
      id: `doc-${Date.now()}`,
      title: "New Document",
      type: "other",
      lastUpdated: new Date().toISOString().split("T")[0],
      required: false,
    };
    onComplianceChange({
      ...complianceData,
      legalDocuments: [...complianceData.legalDocuments, newDoc],
    });
  };

  const updateLegalDocument = (index: number, updates: Partial<LegalDocument>) => {
    const newDocs = [...complianceData.legalDocuments];
    newDocs[index] = { ...newDocs[index], ...updates };
    onComplianceChange({ ...complianceData, legalDocuments: newDocs });
  };

  const removeLegalDocument = (index: number) => {
    const newDocs = complianceData.legalDocuments.filter((_, i) => i !== index);
    onComplianceChange({ ...complianceData, legalDocuments: newDocs });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Accreditations & Certifications
          </h5>
          <Button variant="outline" size="sm" onClick={addCertification}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {complianceData.certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <Input
                value={cert.name}
                onChange={(e) =>
                  updateCertification(index, { name: e.target.value })
                }
                placeholder="Certification name"
                className="font-medium flex-1 mr-2"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Input
              value={cert.issuingBody}
              onChange={(e) =>
                updateCertification(index, { issuingBody: e.target.value })
              }
              placeholder="Issuing authority"
              className="text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Valid From</Label>
                <Input
                  type="date"
                  value={cert.validFrom || ""}
                  onChange={(e) =>
                    updateCertification(index, { validFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Valid Until</Label>
                <Input
                  type="date"
                  value={cert.validUntil || ""}
                  onChange={(e) =>
                    updateCertification(index, { validUntil: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {complianceData.certifications.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
            No certifications added. Click "Add" to showcase your accreditations.
          </div>
        )}
      </div>

      {/* Legal Documents */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Legal Documents
          </h5>
          <Button variant="outline" size="sm" onClick={addLegalDocument}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {complianceData.legalDocuments.map((doc, index) => (
          <div
            key={doc.id}
            className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <Input
                value={doc.title}
                onChange={(e) =>
                  updateLegalDocument(index, { title: e.target.value })
                }
                placeholder="Document title"
                className="font-medium flex-1 mr-2"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLegalDocument(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={doc.type}
                  onValueChange={(value: LegalDocument["type"]) =>
                    updateLegalDocument(index, { type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="privacy-policy">Privacy Policy</SelectItem>
                    <SelectItem value="terms-of-service">Terms of Service</SelectItem>
                    <SelectItem value="refund-policy">Refund Policy</SelectItem>
                    <SelectItem value="disclaimer">Disclaimer</SelectItem>
                    <SelectItem value="consent-form">Consent Form</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Last Updated</Label>
                <Input
                  type="date"
                  value={doc.lastUpdated}
                  onChange={(e) =>
                    updateLegalDocument(index, { lastUpdated: e.target.value })
                  }
                />
              </div>
            </div>

            <Input
              value={doc.url || ""}
              onChange={(e) =>
                updateLegalDocument(index, { url: e.target.value })
              }
              placeholder="Document URL"
              className="text-sm"
            />

            <div className="flex items-center gap-2">
              <Switch
                checked={doc.required}
                onCheckedChange={(checked) =>
                  updateLegalDocument(index, { required: checked })
                }
              />
              <Label className="text-sm">Required for registration</Label>
            </div>
          </div>
        ))}
      </div>

      {/* Data Protection */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Data Protection & Privacy
        </h5>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">GDPR Compliant</Label>
              <p className="text-xs text-gray-500">EU data protection compliance</p>
            </div>
            <Switch
              checked={complianceData.dataProtection.gdprCompliant}
              onCheckedChange={(checked) =>
                onComplianceChange({
                  ...complianceData,
                  dataProtection: {
                    ...complianceData.dataProtection,
                    gdprCompliant: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">HIPAA Compliant</Label>
              <p className="text-xs text-gray-500">US healthcare data protection</p>
            </div>
            <Switch
              checked={complianceData.dataProtection.hipaaCompliant}
              onCheckedChange={(checked) =>
                onComplianceChange({
                  ...complianceData,
                  dataProtection: {
                    ...complianceData.dataProtection,
                    hipaaCompliant: checked,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Emergency Protocols */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-gray-800">Emergency Protocols</h5>
          <Switch
            checked={complianceData.emergencyProtocols.enabled}
            onCheckedChange={(checked) =>
              onComplianceChange({
                ...complianceData,
                emergencyProtocols: {
                  ...complianceData.emergencyProtocols,
                  enabled: checked,
                },
              })
            }
          />
        </div>

        {complianceData.emergencyProtocols.enabled && (
          <Textarea
            value={complianceData.emergencyProtocols.content}
            onChange={(e) =>
              onComplianceChange({
                ...complianceData,
                emergencyProtocols: {
                  ...complianceData.emergencyProtocols,
                  content: e.target.value,
                },
              })
            }
            placeholder="Emergency contact information and procedures..."
            rows={3}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TemplateEditorSidebar({
  blueprint,
  onBlueprintChange,
  activeSection: externalActiveSection,
  onSectionChange,
}: TemplateEditorSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<SidebarSection | null>(
    (externalActiveSection as SidebarSection) || "branding"
  );

  const toggleSection = (section: SidebarSection) => {
    const newSection = expandedSection === section ? null : section;
    setExpandedSection(newSection);
    onSectionChange?.(newSection || "");
  };

  const updateBranding = useCallback(
    (branding: BrandingConfig) => {
      onBlueprintChange({ ...blueprint, branding });
    },
    [blueprint, onBlueprintChange]
  );

  const updatePalette = useCallback(
    (palette: TemplateBlueprint["palette"]) => {
      onBlueprintChange({ ...blueprint, palette });
    },
    [blueprint, onBlueprintChange]
  );

  const updateTypography = useCallback(
    (typography: TemplateBlueprint["typography"]) => {
      onBlueprintChange({ ...blueprint, typography });
    },
    [blueprint, onBlueprintChange]
  );

  const updateServicesAndPricing = useCallback(
    (servicesAndPricing: ServicesAndPricing) => {
      onBlueprintChange({ ...blueprint, servicesAndPricing });
    },
    [blueprint, onBlueprintChange]
  );

  const updateCompliance = useCallback(
    (compliance: ComplianceAndDocs) => {
      onBlueprintChange({ ...blueprint, compliance });
    },
    [blueprint, onBlueprintChange]
  );

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900">Template Editor</h3>
        <p className="text-xs text-gray-500 mt-1">
          Customize your hospital website
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Branding Studio */}
        <div>
          <SectionHeader
            icon={<Palette className="w-5 h-5" />}
            title="Branding Studio"
            description="Colors, logos, and visual identity"
            isExpanded={expandedSection === "branding"}
            onToggle={() => toggleSection("branding")}
          />
          <AnimatePresence>
            {expandedSection === "branding" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <BrandingPanel
                  branding={blueprint.branding}
                  palette={blueprint.palette}
                  typography={blueprint.typography}
                  onBrandingChange={updateBranding}
                  onPaletteChange={updatePalette}
                  onTypographyChange={updateTypography}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Site Content */}
        <div>
          <SectionHeader
            icon={<FileText className="w-5 h-5" />}
            title="Site Content"
            description="Edit text and sections inline"
            isExpanded={expandedSection === "content"}
            onToggle={() => toggleSection("content")}
            badge="Canvas"
          />
          <AnimatePresence>
            {expandedSection === "content" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">
                          Click-to-Edit Mode
                        </h5>
                        <p className="text-sm text-blue-700 mt-1">
                          Content editing is done directly on the canvas preview.
                          Click any text element to edit it inline. Hover over
                          images to upload new ones.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">
                      Available Sections
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Hero Section (Title, Tagline, CTA)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Statistics Strip
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Specialties & Departments
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Doctor Profiles
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Testimonials
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Facility Highlights
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Programs & Pathways
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Footer & Contact
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Services & Pricing */}
        <div>
          <SectionHeader
            icon={<DollarSign className="w-5 h-5" />}
            title="Services & Pricing"
            description="Medical services and packages"
            isExpanded={expandedSection === "services"}
            onToggle={() => toggleSection("services")}
          />
          <AnimatePresence>
            {expandedSection === "services" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ServicesPricingPanel
                  servicesAndPricing={blueprint.servicesAndPricing}
                  onServicesChange={updateServicesAndPricing}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compliance & Documentation */}
        <div>
          <SectionHeader
            icon={<Shield className="w-5 h-5" />}
            title="Compliance & Docs"
            description="Certifications and legal documents"
            isExpanded={expandedSection === "compliance"}
            onToggle={() => toggleSection("compliance")}
          />
          <AnimatePresence>
            {expandedSection === "compliance" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <CompliancePanel
                  compliance={blueprint.compliance}
                  onComplianceChange={updateCompliance}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default TemplateEditorSidebar;
