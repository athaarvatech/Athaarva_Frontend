"use client";

/**
 * =============================================================================
 * EDITABLE SERVICES & PRICING SECTION
 * =============================================================================
 * 
 * On-canvas editable component for the Services & Pricing section.
 * Features inline editing for service cards, pricing packages, and payment info.
 * 
 * =============================================================================
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Star,
  DollarSign,
  Clock,
  Check,
  Sparkles,
  GripVertical,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditableText } from "./EditableText";
import { EditableSection, EditableField } from "./OnCanvasToolbar";
import type {
  ServicesAndPricing,
  ServiceItem,
  PricingPackage,
} from "./templateBlueprints";
import { DEFAULT_SERVICES_PRICING } from "./templateBlueprints";

// ============================================================================
// TYPES
// ============================================================================

export interface EditableServicesSectionProps {
  servicesAndPricing: ServicesAndPricing | undefined;
  onUpdate: (data: ServicesAndPricing) => void;
  isEditMode?: boolean;
  accentColor?: string;
  typography?: {
    heading: string;
    body: string;
  };
}

// ============================================================================
// EDITABLE SERVICE CARD
// ============================================================================

interface EditableServiceCardProps {
  service: ServiceItem;
  index: number;
  onUpdate: (updates: Partial<ServiceItem>) => void;
  onDelete: () => void;
  isEditMode: boolean;
  accentColor: string;
}

function EditableServiceCard({
  service,
  index,
  onUpdate,
  onDelete,
  isEditMode,
  accentColor,
}: EditableServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative rounded-2xl border bg-white p-6 shadow-sm transition-all",
        service.featured
          ? "border-2 ring-2 ring-offset-2"
          : "border-gray-200 hover:border-gray-300",
        isEditMode && "group cursor-pointer"
      )}
      style={{
        borderColor: service.featured ? accentColor : undefined,
        ["--tw-ring-color" as string]: service.featured ? `${accentColor}40` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {service.featured && (
        <div
          className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: accentColor }}
        >
          <Star className="w-3 h-3 inline mr-1" />
          Featured
        </div>
      )}

      {/* Delete Button */}
      {isEditMode && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
          title="Remove service"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Service Content */}
      <div className="space-y-4">
        {/* Icon & Name */}
        <div className="flex items-start gap-3">
          {isEditMode ? (
            <EditableField label="Icon" showLabel={isHovered}>
              <EditableText
                value={service.icon}
                onChange={(val) => onUpdate({ icon: val })}
                className="text-3xl"
                placeholder="🩺"
                editIndicator="none"
              />
            </EditableField>
          ) : (
            <span className="text-3xl">{service.icon}</span>
          )}

          <div className="flex-1">
            {isEditMode ? (
              <>
                <EditableText
                  value={service.name}
                  onChange={(val) => onUpdate({ name: val })}
                  as="h3"
                  className="text-lg font-semibold text-gray-900"
                  placeholder="Service Name"
                  editIndicator="border"
                />
                <EditableText
                  value={service.category}
                  onChange={(val) => onUpdate({ category: val })}
                  as="span"
                  className="text-xs uppercase tracking-wider text-gray-500"
                  placeholder="Category"
                  editIndicator="none"
                />
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900">
                  {service.name}
                </h3>
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  {service.category}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {isEditMode ? (
          <EditableText
            value={service.description}
            onChange={(val) => onUpdate({ description: val })}
            as="p"
            className="text-sm text-gray-600"
            placeholder="Service description..."
            multiline
            editIndicator="none"
          />
        ) : (
          <p className="text-sm text-gray-600">{service.description}</p>
        )}

        {/* Price Range */}
        {service.priceRange && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="font-medium" style={{ color: accentColor }}>
              {service.priceRange.currency} {service.priceRange.min} -{" "}
              {service.priceRange.max}
            </span>
            <span className="text-gray-400">{service.priceRange.unit}</span>
          </div>
        )}

        {/* Duration */}
        {service.duration && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{service.duration}</span>
          </div>
        )}

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-1">
            {service.features.slice(0, 3).map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Check
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: accentColor }}
                />
                {isEditMode ? (
                  <EditableText
                    value={feature}
                    onChange={(val) => {
                      const newFeatures = [...service.features];
                      newFeatures[i] = val;
                      onUpdate({ features: newFeatures });
                    }}
                    className="text-gray-600"
                    placeholder="Feature"
                    editIndicator="none"
                  />
                ) : (
                  feature
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Toggle Featured (Edit Mode) */}
        {isEditMode && (
          <button
            onClick={() => onUpdate({ featured: !service.featured })}
            className={cn(
              "text-xs flex items-center gap-1 px-2 py-1 rounded-full transition-colors",
              service.featured
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            <Star className="w-3 h-3" />
            {service.featured ? "Featured" : "Mark as featured"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// EDITABLE PRICING CARD
// ============================================================================

interface EditablePricingCardProps {
  pkg: PricingPackage;
  index: number;
  onUpdate: (updates: Partial<PricingPackage>) => void;
  onDelete: () => void;
  isEditMode: boolean;
  accentColor: string;
}

function EditablePricingCard({
  pkg,
  index,
  onUpdate,
  onDelete,
  isEditMode,
  accentColor,
}: EditablePricingCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative rounded-2xl border bg-white p-6 shadow-lg transition-all",
        pkg.recommended
          ? "border-2 scale-105"
          : "border-gray-200 hover:border-gray-300",
        isEditMode && "group"
      )}
      style={{
        borderColor: pkg.recommended ? accentColor : undefined,
      }}
    >
      {/* Recommended Badge */}
      {pkg.recommended && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: accentColor }}
        >
          <Sparkles className="w-3 h-3 inline mr-1" />
          RECOMMENDED
        </div>
      )}

      {/* Delete Button */}
      {isEditMode && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
          title="Remove package"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      <div className="space-y-4 text-center">
        {/* Package Name */}
        {isEditMode ? (
          <EditableText
            value={pkg.name}
            onChange={(val) => onUpdate({ name: val })}
            as="h3"
            className="text-xl font-bold text-gray-900"
            placeholder="Package Name"
            editIndicator="border"
          />
        ) : (
          <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
        )}

        {/* Price */}
        <div className="py-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg text-gray-500">{pkg.currency}</span>
            {isEditMode ? (
              <EditableText
                value={String(pkg.price)}
                onChange={(val) => onUpdate({ price: parseFloat(val) || 0 })}
                as="span"
                className="text-4xl font-bold"
                style={{ color: accentColor }}
                placeholder="0"
                editIndicator="none"
              />
            ) : (
              <span
                className="text-4xl font-bold"
                style={{ color: accentColor }}
              >
                {pkg.price}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {pkg.billingCycle === "one-time"
              ? "One-time"
              : `per ${pkg.billingCycle}`}
          </span>
        </div>

        {/* Description */}
        {isEditMode ? (
          <EditableText
            value={pkg.description}
            onChange={(val) => onUpdate({ description: val })}
            as="p"
            className="text-sm text-gray-600"
            placeholder="Package description..."
            multiline
            editIndicator="none"
          />
        ) : (
          <p className="text-sm text-gray-600">{pkg.description}</p>
        )}

        {/* Features */}
        <ul className="space-y-2 text-left">
          {pkg.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <Check
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: accentColor }}
              />
              {isEditMode ? (
                <EditableText
                  value={feature}
                  onChange={(val) => {
                    const newFeatures = [...pkg.features];
                    newFeatures[i] = val;
                    onUpdate({ features: newFeatures });
                  }}
                  className="text-gray-600"
                  placeholder="Feature"
                  editIndicator="none"
                />
              ) : (
                feature
              )}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          {isEditMode ? (
            <EditableText
              value={pkg.ctaLabel}
              onChange={(val) => onUpdate({ ctaLabel: val })}
              className="text-white"
              placeholder="Book Now"
              editIndicator="none"
            />
          ) : (
            pkg.ctaLabel
          )}
        </button>

        {/* Toggle Recommended (Edit Mode) */}
        {isEditMode && (
          <button
            onClick={() => onUpdate({ recommended: !pkg.recommended })}
            className={cn(
              "text-xs flex items-center justify-center gap-1 w-full py-2 rounded-lg transition-colors",
              pkg.recommended
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            <Sparkles className="w-3 h-3" />
            {pkg.recommended ? "Recommended" : "Mark as recommended"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EditableServicesSection({
  servicesAndPricing,
  onUpdate,
  isEditMode = true,
  accentColor = "#0E9F9F",
  typography,
}: EditableServicesSectionProps) {
  const data = servicesAndPricing || DEFAULT_SERVICES_PRICING;

  // Update helpers
  const updateData = useCallback(
    (updates: Partial<ServicesAndPricing>) => {
      onUpdate({ ...data, ...updates });
    },
    [data, onUpdate]
  );

  const updateService = useCallback(
    (index: number, updates: Partial<ServiceItem>) => {
      const newServices = [...data.services];
      newServices[index] = { ...newServices[index], ...updates };
      updateData({ services: newServices });
    },
    [data.services, updateData]
  );

  const addService = useCallback(() => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: "New Service",
      category: "General",
      description: "Click to edit service description...",
      icon: "🩺",
      features: ["Feature 1", "Feature 2"],
      featured: false,
    };
    updateData({ services: [...data.services, newService] });
  }, [data.services, updateData]);

  const removeService = useCallback(
    (index: number) => {
      const newServices = data.services.filter((_, i) => i !== index);
      updateData({ services: newServices });
    },
    [data.services, updateData]
  );

  const updatePackage = useCallback(
    (index: number, updates: Partial<PricingPackage>) => {
      const newPackages = [...data.packages];
      newPackages[index] = { ...newPackages[index], ...updates };
      updateData({ packages: newPackages });
    },
    [data.packages, updateData]
  );

  const addPackage = useCallback(() => {
    const newPackage: PricingPackage = {
      id: `pkg-${Date.now()}`,
      name: "New Package",
      description: "Click to edit description...",
      price: 199,
      currency: "USD",
      billingCycle: "one-time",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      recommended: false,
      ctaLabel: "Book Now",
      ctaHref: "/book",
    };
    updateData({ packages: [...data.packages, newPackage] });
  }, [data.packages, updateData]);

  const removePackage = useCallback(
    (index: number) => {
      const newPackages = data.packages.filter((_, i) => i !== index);
      updateData({ packages: newPackages });
    },
    [data.packages, updateData]
  );

  const handleReset = useCallback(() => {
    onUpdate(DEFAULT_SERVICES_PRICING);
  }, [onUpdate]);

  return (
    <EditableSection
      sectionId="services-pricing"
      sectionTitle="Services & Pricing"
      onReset={handleReset}
      isEditMode={isEditMode}
      accentColor={accentColor}
      description="Showcase your medical services and health packages"
    >
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            {isEditMode ? (
              <>
                <EditableText
                  value={data.sectionTitle}
                  onChange={(val) => updateData({ sectionTitle: val })}
                  as="h2"
                  className="text-3xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: typography?.heading }}
                  placeholder="Our Services"
                  editIndicator="border"
                />
                <EditableText
                  value={data.sectionSubtitle}
                  onChange={(val) => updateData({ sectionSubtitle: val })}
                  as="p"
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                  style={{ fontFamily: typography?.body }}
                  placeholder="Comprehensive healthcare solutions"
                  editIndicator="none"
                />
              </>
            ) : (
              <>
                <h2
                  className="text-3xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: typography?.heading }}
                >
                  {data.sectionTitle}
                </h2>
                <p
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                  style={{ fontFamily: typography?.body }}
                >
                  {data.sectionSubtitle}
                </p>
              </>
            )}
          </div>

          {/* Services Grid */}
          {data.services.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Medical Services
                </h3>
                {isEditMode && (
                  <Button variant="outline" size="sm" onClick={addService}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Service
                  </Button>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {data.services.map((service, index) => (
                    <EditableServiceCard
                      key={service.id}
                      service={service}
                      index={index}
                      onUpdate={(updates) => updateService(index, updates)}
                      onDelete={() => removeService(index)}
                      isEditMode={isEditMode}
                      accentColor={accentColor}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Pricing Packages */}
          {data.packages.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Health Packages
                </h3>
                {isEditMode && (
                  <Button variant="outline" size="sm" onClick={addPackage}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Package
                  </Button>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {data.packages.map((pkg, index) => (
                    <EditablePricingCard
                      key={pkg.id}
                      pkg={pkg}
                      index={index}
                      onUpdate={(updates) => updatePackage(index, updates)}
                      onDelete={() => removePackage(index)}
                      isEditMode={isEditMode}
                      accentColor={accentColor}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Payment Methods & Insurance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Payment Methods */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" style={{ color: accentColor }} />
                  Payment Options
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.paymentMethods.map((method, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              {data.insurancePartners && data.insurancePartners.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: accentColor }} />
                    Insurance Partners
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.insurancePartners.map((partner, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {typeof partner === 'string' ? partner : partner.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            {data.priceDisclaimer && (
              <p className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                {isEditMode ? (
                  <EditableText
                    value={data.priceDisclaimer}
                    onChange={(val) => updateData({ priceDisclaimer: val })}
                    className="text-gray-500"
                    placeholder="Price disclaimer..."
                    multiline
                    editIndicator="none"
                  />
                ) : (
                  data.priceDisclaimer
                )}
              </p>
            )}
          </div>

          {/* Empty State */}
          {data.services.length === 0 && data.packages.length === 0 && isEditMode && (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
              <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No services or packages yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start adding your medical services and health packages
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={addService}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Service
                </Button>
                <Button variant="outline" onClick={addPackage}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Package
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </EditableSection>
  );
}

export default EditableServicesSection;
