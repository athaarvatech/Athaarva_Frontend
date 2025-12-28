"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Play,
  ArrowRight,
  Calendar,
  Package,
  CreditCard,
  FileText,
  BarChart3,
  Pill,
  Building,
  Heart,
  Microscope,
  Quote,
  Plus,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "../EditableText";
import type {
  TemplateBlueprint,
  UploadedImageData,
} from "../templateBlueprints";
import { HeroImageUploader, AvatarUploader } from "../ImageUploader";

// ============================================================================
// CUSTOM CSS & ANIMATIONS
// ============================================================================

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  .font-inter {
    font-family: 'Inter', sans-serif;
  }
  
  .shadow-saas {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .shadow-saas-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .shadow-saas-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .bg-pattern-dots {
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  .bg-pattern-cubes {
    background-image: 
      linear-gradient(30deg, rgba(255, 255, 255, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.1) 87.5%, rgba(255, 255, 255, 0.1)),
      linear-gradient(150deg, rgba(255, 255, 255, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.1) 87.5%, rgba(255, 255, 255, 0.1)),
      linear-gradient(30deg, rgba(255, 255, 255, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.1) 87.5%, rgba(255, 255, 255, 0.1)),
      linear-gradient(150deg, rgba(255, 255, 255, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.1) 87.5%, rgba(255, 255, 255, 0.1));
    background-size: 80px 140px;
    background-position: 0 0, 0 0, 40px 70px, 40px 70px;
  }
`;

// ============================================================================
// COLOR SYSTEM
// ============================================================================

interface ColorScheme {
  primary: string; // Google Green #34A853
  lightBg: string; // White #FFFFFF
  lightSurface: string; // Light Gray #F9FAFB
  darkBg: string; // Dark Slate #111827
  darkSurface: string; // Dark Surface #1F2937
  textLight: string; // Light text
  textDark: string; // Dark text
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export interface HealthcareSaaSTemplateProps {
  blueprint: TemplateBlueprint;
  onBlueprintChange: (updated: TemplateBlueprint) => void;
  device: "desktop" | "tablet" | "mobile";
  isEditMode?: boolean;
  showBanner?: boolean;
}

export function HealthcareSaaSTemplate({
  blueprint,
  onBlueprintChange,
  device = "desktop",
  isEditMode = false,
  showBanner = true,
}: HealthcareSaaSTemplateProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const colors: ColorScheme = {
    primary: "#34A853",
    lightBg: "#FFFFFF",
    lightSurface: "#F9FAFB",
    darkBg: "#111827",
    darkSurface: "#1F2937",
    textLight: "#FFFFFF",
    textDark: "#111827",
  };

  // Scale factor for device preview
  const scale = device === "mobile" ? 0.5 : device === "tablet" ? 0.75 : 1;

  // Helper to update nested blueprint fields
  const updateBlueprint = <K extends keyof TemplateBlueprint>(
    key: K,
    value: TemplateBlueprint[K]
  ) => {
    onBlueprintChange({ ...blueprint, [key]: value });
  };

  const handleLogoUpdate = (image: UploadedImageData | null) => {
    onBlueprintChange({
      ...blueprint,
      images: {
        ...blueprint.images,
        logo: image ?? undefined,
      },
    });
  };

  const handleHeroImageUpdate = (image: UploadedImageData | null) => {
    onBlueprintChange({
      ...blueprint,
      images: {
        ...blueprint.images,
        heroImage: image ?? undefined,
      },
    });
  };

  return (
    <div
      className={cn(
        "font-inter min-h-screen transition-colors duration-300",
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      )}
      style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
    >
      <style>{customStyles}</style>

      {/* Edit Mode Banner */}
      {/* {isEditMode && showBanner && (
        <div
          className="sticky top-0 z-[100] text-white px-4 py-2 text-center text-sm backdrop-blur-lg"
          style={{ backgroundColor: `${colors.primary}ee` }}
        >
          <span className="font-bold">🚀 SaaS Canvas Mode</span> — Click to
          edit text, hover images to upload. Auto-save enabled.
        </div>
      )} */}

      {/* Navbar */}
      <HealthcareSaaSNavbar
        blueprint={blueprint}
        colors={colors}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isEditMode={isEditMode}
      />

      {/* Hero Section */}
      <HealthcareSaaSHero
        blueprint={blueprint}
        colors={colors}
        isDarkMode={isDarkMode}
        onImageUpdate={handleHeroImageUpdate}
        onUpdate={(hero) => updateBlueprint("hero", hero)}
        isEditMode={isEditMode}
      />

      {/* Showcase Grid */}
      <HealthcareSaaSShowcase
        blueprint={blueprint}
        colors={colors}
        isDarkMode={isDarkMode}
        onUpdate={(facilityHighlights) =>
          updateBlueprint("facilityHighlights", facilityHighlights)
        }
        isEditMode={isEditMode}
      />

      {/* Features Grid */}
      <HealthcareSaaSFeatures
        blueprint={blueprint}
        colors={colors}
        isDarkMode={isDarkMode}
        onUpdate={(specialties) => updateBlueprint("specialties", specialties)}
        isEditMode={isEditMode}
      />

      {/* Stats Strip */}
      <HealthcareSaaSStats
        blueprint={blueprint}
        colors={colors}
        onUpdate={(stats) =>
          updateBlueprint("hero", { ...blueprint.hero, stats })
        }
        isEditMode={isEditMode}
      />

      {/* Social Proof */}
      <HealthcareSaaSSocialProof isDarkMode={isDarkMode} />

      {/* Testimonials */}
      <HealthcareSaaSTestimonials
        blueprint={blueprint}
        colors={colors}
        isDarkMode={isDarkMode}
        onUpdate={(testimonials) =>
          updateBlueprint("testimonials", testimonials)
        }
        isEditMode={isEditMode}
      />

      {/* CTA Section */}
      <HealthcareSaaSCTA colors={colors} isDarkMode={isDarkMode} />

      {/* Footer */}
      <HealthcareSaaSFooter
        blueprint={blueprint}
        colors={colors}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

// ============================================================================
// GLASSMORPHISM NAVBAR
// ============================================================================

interface HealthcareSaaSNavbarProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isEditMode: boolean;
}

function HealthcareSaaSNavbar({
  blueprint,
  colors,
  isDarkMode,
  onToggleDarkMode,
  isEditMode,
}: HealthcareSaaSNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = ["Product", "Features", "Pricing", "About", "Contact"];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-sm",
        isDarkMode
          ? "bg-gray-900/90 border-b border-gray-800"
          : "bg-white/90 border-b border-gray-200"
      )}
      style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {blueprint.images?.logo?.previewUrl ? (
              <img
                src={blueprint.images.logo.previewUrl}
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
            )}
            <span
              className={cn(
                "text-xl font-bold transition-colors",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              {blueprint.hero.title}
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={`#${link.toLowerCase()}`}
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:scale-105",
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={cn(
                "p-2 rounded-lg transition-all duration-300 hover:scale-110",
                isDarkMode
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Request Demo Button */}
            <button
              className={cn(
                "hidden md:inline-flex px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-saas hover:shadow-saas-lg"
              )}
              style={{
                backgroundColor: colors.primary,
                color: colors.textLight,
              }}
            >
              Request a Demo
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {isMobileMenuOpen ? (
                <Trash2 className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800"
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={`#${link.toLowerCase()}`}
                className={cn(
                  "block py-3 px-4 text-sm font-semibold transition-colors",
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button
              className="w-full mt-4 px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-300"
              style={{ backgroundColor: colors.primary }}
            >
              Request a Demo
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// ============================================================================
// OVERLAY HERO SECTION
// ============================================================================

interface HealthcareSaaSHeroProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isDarkMode: boolean;
  onImageUpdate: (image: UploadedImageData | null) => void;
  onUpdate: (hero: TemplateBlueprint["hero"]) => void;
  isEditMode: boolean;
}

function HealthcareSaaSHero({
  blueprint,
  colors,
  isDarkMode,
  onImageUpdate,
  onUpdate,
  isEditMode,
}: HealthcareSaaSHeroProps) {
  const updateHeroField = (
    field: keyof TemplateBlueprint["hero"],
    value: any
  ) => {
    onUpdate({ ...blueprint.hero, [field]: value });
  };

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {isEditMode ? (
          <HeroImageUploader
            value={blueprint.images?.heroImage || null}
            onChange={onImageUpdate}
            className="w-full h-full"
          />
        ) : blueprint.images?.heroImage?.previewUrl ? (
          <img
            src={blueprint.images.heroImage.previewUrl}
            alt="Hospital Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, #1F2937 0%, #111827 100%)"
                : "linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)",
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Building
                className="w-48 h-48 opacity-10"
                style={{ color: colors.primary }}
              />
            </div>
          </div>
        )}

        {/* Gradient Overlay - 90deg (left to right) */}
        <div
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? "linear-gradient(90deg, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 30%, rgba(17, 24, 39, 0.7) 60%, transparent 100%)"
              : "linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.98) 30%, rgba(255, 255, 255, 0.7) 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-2xl">
          <motion.div {...fadeInUp}>
            {/* Headline */}
            {isEditMode ? (
              <EditableText
                value={blueprint.hero.title}
                onChange={(val) => updateHeroField("title", val)}
                as="h1"
                className={cn(
                  "text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
                placeholder="Transform Your Hospital..."
                editIndicator="border"
                multiline
              />
            ) : (
              <h1
                className={cn(
                  "text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
              >
                {blueprint.hero.title}
              </h1>
            )}

            {/* Subtext */}
            {isEditMode ? (
              <EditableText
                value={blueprint.hero.subtitle}
                onChange={(val) => updateHeroField("subtitle", val)}
                as="p"
                className={cn(
                  "text-xl md:text-2xl font-medium leading-relaxed mb-10",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}
                placeholder="Streamline operations, enhance patient care..."
                editIndicator="none"
                multiline
              />
            ) : (
              <p
                className={cn(
                  "text-xl md:text-2xl font-medium leading-relaxed mb-10",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}
              >
                {blueprint.hero.subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary CTA */}
              <button
                className="px-8 py-4 rounded-lg font-bold text-base text-white transition-all duration-300 hover:-translate-y-1 shadow-saas hover:shadow-saas-xl"
                style={{ backgroundColor: colors.primary }}
              >
                Get Started
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>

              {/* Secondary CTA */}
              <a
                href="#"
                className={cn(
                  "inline-flex items-center gap-2 text-base font-semibold transition-all duration-300 hover:gap-3",
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                <Play className="w-5 h-5" />
                Watch Video
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SHOWCASE GRID (3-COLUMN CARDS)
// ============================================================================

interface HealthcareSaaSShowcaseProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isDarkMode: boolean;
  onUpdate: (
    facilityHighlights: TemplateBlueprint["facilityHighlights"]
  ) => void;
  isEditMode: boolean;
}

function HealthcareSaaSShowcase({
  blueprint,
  colors,
  isDarkMode,
  onUpdate,
  isEditMode,
}: HealthcareSaaSShowcaseProps) {
  const facilities = blueprint.facilityHighlights || [
    {
      title: "Advanced Robotics",
      copy: "Surgical precision with AI-powered robotic systems",
    },
    {
      title: "Modern Infrastructure",
      copy: "State-of-the-art facilities designed for efficiency",
    },
    {
      title: "Diagnostic Excellence",
      copy: "Cutting-edge imaging and laboratory technology",
    },
  ];

  const showcaseIcons = [Heart, Building, Microscope];

  const updateFacility = (
    index: number,
    field: keyof (typeof facilities)[0],
    value: string
  ) => {
    const newFacilities = [...facilities];
    newFacilities[index] = { ...newFacilities[index], [field]: value };
    onUpdate(newFacilities);
  };

  const addFacility = () => {
    onUpdate([
      ...facilities,
      { title: "New Showcase", copy: "Description here..." },
    ]);
  };

  const removeFacility = (index: number) => {
    const newFacilities = facilities.filter((_, i) => i !== index);
    onUpdate(newFacilities);
  };

  return (
    <section
      className={cn(
        "py-20 md:py-28 transition-colors",
        isDarkMode ? "bg-gray-900" : "bg-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.slice(0, 6).map((facility, index) => {
            const ShowcaseIcon = showcaseIcons[index % showcaseIcons.length];

            return (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.15 }}
                className={cn(
                  "group relative rounded-3xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 cursor-pointer",
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:border-[#34A853]"
                    : "bg-white border-gray-200 hover:border-[#34A853]",
                  "shadow-saas hover:shadow-saas-xl",
                  isEditMode && "ring-2 ring-transparent hover:ring-gray-300"
                )}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeFacility(index)}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-20"
                    title="Remove showcase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Image Section (Top Half) */}
                <div
                  className={cn(
                    "h-48 overflow-hidden relative transition-transform duration-300",
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  )}
                >
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <ShowcaseIcon
                      className="w-20 h-20 opacity-30 transition-opacity group-hover:opacity-50"
                      style={{ color: colors.primary }}
                    />
                  </div>
                </div>

                {/* Text Section (Bottom Half) */}
                <div className="p-6">
                  {/* Title */}
                  {isEditMode ? (
                    <EditableText
                      value={facility.title}
                      onChange={(val) => updateFacility(index, "title", val)}
                      as="h3"
                      className={cn(
                        "text-2xl font-bold mb-3",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}
                      placeholder="Showcase Title"
                      editIndicator="border"
                    />
                  ) : (
                    <h3
                      className={cn(
                        "text-2xl font-bold mb-3",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}
                    >
                      {facility.title}
                    </h3>
                  )}

                  {/* Description */}
                  {isEditMode ? (
                    <EditableText
                      value={facility.copy}
                      onChange={(val) => updateFacility(index, "copy", val)}
                      as="p"
                      className={cn(
                        "text-base leading-relaxed",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}
                      placeholder="Showcase description..."
                      multiline
                      editIndicator="none"
                    />
                  ) : (
                    <p
                      className={cn(
                        "text-base leading-relaxed",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      {facility.copy}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Add Showcase Button */}
          {isEditMode && facilities.length < 6 && (
            <button
              onClick={addFacility}
              className={cn(
                "rounded-3xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-colors min-h-[320px]",
                isDarkMode
                  ? "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              )}
            >
              <Plus className="w-10 h-10" />
              <span className="text-sm font-semibold">Add Showcase</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURES ICON GRID (2x3)
// ============================================================================

interface HealthcareSaaSFeaturesProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isDarkMode: boolean;
  onUpdate: (specialties: TemplateBlueprint["specialties"]) => void;
  isEditMode: boolean;
}

function HealthcareSaaSFeatures({
  blueprint,
  colors,
  isDarkMode,
  onUpdate,
  isEditMode,
}: HealthcareSaaSFeaturesProps) {
  const featureIcons = [
    Calendar,
    Package,
    CreditCard,
    FileText,
    BarChart3,
    Pill,
  ];
  const featureDefaults = [
    {
      icon: "📅",
      title: "Smart Scheduling",
      description:
        "Intelligent appointment management with AI-powered optimization",
    },
    {
      icon: "📦",
      title: "Inventory Management",
      description: "Real-time tracking of medical supplies and equipment",
    },
    {
      icon: "💳",
      title: "Billing & Payments",
      description: "Automated invoicing with insurance claim processing",
    },
    {
      icon: "📄",
      title: "Electronic Health Records",
      description: "Secure, centralized patient data management",
    },
    {
      icon: "📊",
      title: "Analytics & Reports",
      description: "Comprehensive insights into hospital operations",
    },
    {
      icon: "💊",
      title: "Pharmacy Integration",
      description: "Seamless prescription and medication tracking",
    },
  ];

  const updateFeature = (
    index: number,
    field: keyof TemplateBlueprint["specialties"][0],
    value: string
  ) => {
    const newFeatures = [...blueprint.specialties];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate(newFeatures);
  };

  const addFeature = () => {
    onUpdate([
      ...blueprint.specialties,
      {
        icon: "⚡",
        title: "New Feature",
        description: "Feature description...",
      },
    ]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = blueprint.specialties.filter((_, i) => i !== index);
    onUpdate(newFeatures);
  };

  return (
    <section
      className={cn(
        "py-20 md:py-28 transition-colors",
        isDarkMode ? "bg-gray-800" : "bg-gray-50"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-black mb-4",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            Everything You Need
          </h2>
          <p
            className={cn(
              "text-xl font-medium max-w-3xl mx-auto",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}
          >
            Comprehensive hospital management tools designed to streamline
            operations and enhance patient care
          </p>
        </motion.div>

        {/* Features Grid (2x3) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blueprint.specialties.slice(0, 6).map((feature, index) => {
            const FeatureIcon = featureIcons[index % featureIcons.length];
            const defaultFeature = featureDefaults[index] || featureDefaults[0];

            return (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 cursor-pointer",
                  isDarkMode
                    ? "bg-gray-900 hover:bg-gray-850"
                    : "bg-white hover:bg-gray-50",
                  "shadow-saas hover:shadow-saas-lg",
                  isEditMode && "ring-2 ring-transparent hover:ring-gray-300"
                )}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                    title="Remove feature"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Icon Container */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: colors.primary }}
                >
                  <FeatureIcon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                {isEditMode ? (
                  <EditableText
                    value={feature.title || defaultFeature.title}
                    onChange={(val) => updateFeature(index, "title", val)}
                    as="h3"
                    className={cn(
                      "text-xl font-bold mb-3",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}
                    placeholder="Feature Name"
                    editIndicator="border"
                  />
                ) : (
                  <h3
                    className={cn(
                      "text-xl font-bold mb-3",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}
                  >
                    {feature.title || defaultFeature.title}
                  </h3>
                )}

                {/* Description */}
                {isEditMode ? (
                  <EditableText
                    value={feature.description || defaultFeature.description}
                    onChange={(val) => updateFeature(index, "description", val)}
                    as="p"
                    className={cn(
                      "text-sm leading-relaxed",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}
                    placeholder="Feature description..."
                    multiline
                    editIndicator="none"
                  />
                ) : (
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    {feature.description || defaultFeature.description}
                  </p>
                )}
              </motion.div>
            );
          })}

          {/* Add Feature Button */}
          {isEditMode && blueprint.specialties.length < 9 && (
            <button
              onClick={addFeature}
              className={cn(
                "rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-colors",
                isDarkMode
                  ? "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              )}
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-semibold">Add Feature</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS STRIP (GREEN BACKGROUND)
// ============================================================================

interface HealthcareSaaSStatsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (stats: TemplateBlueprint["hero"]["stats"]) => void;
  isEditMode: boolean;
}

function HealthcareSaaSStats({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: HealthcareSaaSStatsProps) {
  const updateStat = (
    index: number,
    field: "value" | "label",
    newVal: string
  ) => {
    const newStats = [...blueprint.hero.stats];
    newStats[index] = { ...newStats[index], [field]: newVal };
    onUpdate(newStats);
  };

  const addStat = () => {
    onUpdate([...blueprint.hero.stats, { label: "New Stat", value: "0" }]);
  };

  const removeStat = (index: number) => {
    const newStats = blueprint.hero.stats.filter((_, i) => i !== index);
    onUpdate(newStats);
  };

  return (
    <section
      className="py-16 md:py-20"
      style={{ backgroundColor: colors.primary }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {blueprint.hero.stats.map((stat, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative text-center transition-transform hover:scale-105 cursor-pointer",
                isEditMode && "group"
              )}
            >
              {isEditMode && (
                <button
                  onClick={() => removeStat(index)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                  title="Remove stat"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              {/* Value */}
              {isEditMode ? (
                <EditableText
                  value={stat.value}
                  onChange={(val) => updateStat(index, "value", val)}
                  as="h3"
                  className="text-4xl md:text-5xl font-black mb-2 text-white"
                  placeholder="500+"
                  editIndicator="border"
                />
              ) : (
                <h3 className="text-4xl md:text-5xl font-black mb-2 text-white">
                  {stat.value}
                </h3>
              )}

              {/* Label */}
              {isEditMode ? (
                <EditableText
                  value={stat.label}
                  onChange={(val) => updateStat(index, "label", val)}
                  as="p"
                  className="text-sm md:text-base font-semibold text-white/90"
                  placeholder="Label"
                  editIndicator="none"
                />
              ) : (
                <p className="text-sm md:text-base font-semibold text-white/90">
                  {stat.label}
                </p>
              )}
            </motion.div>
          ))}

          {/* Add Stat Button */}
          {isEditMode && blueprint.hero.stats.length < 6 && (
            <button
              onClick={addStat}
              className="rounded-xl border-2 border-dashed border-white/30 p-6 flex flex-col items-center justify-center gap-2 text-white/70 hover:border-white/50 hover:text-white/90 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-semibold">Add Stat</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOCIAL PROOF (LOGO ROW)
// ============================================================================

interface HealthcareSaaSSocialProofProps {
  isDarkMode: boolean;
}

function HealthcareSaaSSocialProof({
  isDarkMode,
}: HealthcareSaaSSocialProofProps) {
  const companyLogos = [
    { icon: Facebook, name: "Company A" },
    { icon: Twitter, name: "Company B" },
    { icon: Linkedin, name: "Company C" },
    { icon: Instagram, name: "Company D" },
    { icon: Github, name: "Company E" },
  ];

  return (
    <section
      className={cn(
        "py-16 md:py-20 transition-colors",
        isDarkMode ? "bg-gray-900" : "bg-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p
            className={cn(
              "text-lg font-semibold",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}
          >
            Trusted by leading healthcare institutions
          </p>
        </motion.div>

        {/* Logo Row */}
        <motion.div
          {...fadeInUp}
          className="flex flex-wrap items-center justify-center gap-12 md:gap-16"
        >
          {companyLogos.map((company, index) => (
            <div
              key={index}
              className={cn(
                "w-24 h-24 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer",
                isDarkMode
                  ? "grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
                  : "grayscale opacity-30 hover:grayscale-0 hover:opacity-100"
              )}
              style={{
                filter: "grayscale(100%)",
              }}
            >
              <company.icon
                className="w-16 h-16"
                style={{ color: isDarkMode ? "#9CA3AF" : "#6B7280" }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS (CENTERED QUOTE)
// ============================================================================

interface HealthcareSaaSTestimonialsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isDarkMode: boolean;
  onUpdate: (testimonials: TemplateBlueprint["testimonials"]) => void;
  isEditMode: boolean;
}

function HealthcareSaaSTestimonials({
  blueprint,
  colors,
  isDarkMode,
  onUpdate,
  isEditMode,
}: HealthcareSaaSTestimonialsProps) {
  const updateTestimonial = (
    index: number,
    field: keyof TemplateBlueprint["testimonials"][0],
    value: string
  ) => {
    const newTestimonials = [...blueprint.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onUpdate(newTestimonials);
  };

  const addTestimonial = () => {
    onUpdate([
      ...blueprint.testimonials,
      {
        quote: "Outstanding service and care!",
        patient: "Healthcare Professional",
        procedure: "Hospital Administrator",
      },
    ]);
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = blueprint.testimonials.filter(
      (_, i) => i !== index
    );
    onUpdate(newTestimonials);
  };

  return (
    <section
      className={cn(
        "py-20 md:py-28 transition-colors",
        isDarkMode ? "bg-gray-800" : "bg-gray-50"
      )}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {blueprint.testimonials.slice(0, 3).map((testimonial, index) => (
          <motion.div
            key={index}
            {...fadeInUp}
            transition={{ delay: index * 0.2 }}
            className={cn(
              "group relative mb-12 last:mb-0",
              isEditMode &&
                "ring-2 ring-transparent hover:ring-gray-300 rounded-3xl p-8"
            )}
          >
            {isEditMode && (
              <button
                onClick={() => removeTestimonial(index)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                title="Remove testimonial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Huge Background Quote Icon */}
            <div className="relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-5">
                <Quote
                  className="w-32 h-32"
                  style={{ color: isDarkMode ? "#FFFFFF" : colors.primary }}
                />
              </div>

              {/* Quote Text */}
              <div className="relative text-center">
                {isEditMode ? (
                  <EditableText
                    value={testimonial.quote}
                    onChange={(val) => updateTestimonial(index, "quote", val)}
                    as="p"
                    className={cn(
                      "text-2xl md:text-3xl font-bold leading-relaxed mb-8",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}
                    placeholder="Testimonial quote..."
                    multiline
                    editIndicator="border"
                  />
                ) : (
                  <blockquote
                    className={cn(
                      "text-2xl md:text-3xl font-bold leading-relaxed mb-8",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}
                  >
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                )}

                {/* Author */}
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isDarkMode
                        ? colors.darkSurface
                        : colors.lightSurface,
                    }}
                  >
                    <User
                      className="w-8 h-8"
                      style={{ color: colors.primary }}
                    />
                  </div>

                  {/* Name & Title */}
                  <div className="text-center">
                    {isEditMode ? (
                      <>
                        <EditableText
                          value={testimonial.patient || testimonial.name || ""}
                          onChange={(val) =>
                            updateTestimonial(index, "patient", val)
                          }
                          as="p"
                          className={cn(
                            "font-bold text-lg mb-1",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}
                          placeholder="Author Name"
                          editIndicator="none"
                        />
                        <EditableText
                          value={testimonial.procedure || ""}
                          onChange={(val) =>
                            updateTestimonial(index, "procedure", val)
                          }
                          as="p"
                          className={cn(
                            "text-sm font-medium",
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          )}
                          placeholder="Title/Position"
                          editIndicator="none"
                        />
                      </>
                    ) : (
                      <>
                        <p
                          className={cn(
                            "font-bold text-lg mb-1",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}
                        >
                          {testimonial.patient || testimonial.name}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          )}
                        >
                          {testimonial.procedure || ""}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Testimonial Button */}
        {isEditMode && blueprint.testimonials.length < 5 && (
          <button
            onClick={addTestimonial}
            className={cn(
              "w-full rounded-3xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 transition-colors mt-8",
              isDarkMode
                ? "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400"
                : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            )}
          >
            <Plus className="w-8 h-8" />
            <span className="text-sm font-semibold">Add Testimonial</span>
          </button>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION (BOXED WITH PATTERN)
// ============================================================================

interface HealthcareSaaSCTAProps {
  colors: ColorScheme;
  isDarkMode: boolean;
}

function HealthcareSaaSCTA({ colors, isDarkMode }: HealthcareSaaSCTAProps) {
  return (
    <section
      className={cn(
        "py-20 md:py-28 transition-colors",
        isDarkMode ? "bg-gray-900" : "bg-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          {...scaleIn}
          className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center shadow-saas-xl"
          style={{ backgroundColor: colors.primary }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-pattern-cubes opacity-100" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Ready to Modernize Your Hospital?
            </h2>
            <p className="text-xl md:text-2xl font-medium text-white/90 mb-10 max-w-3xl mx-auto">
              Join hundreds of healthcare institutions transforming patient care
              with Ahtarva HMS
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* White Filled Button */}
              <button
                className="px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 hover:-translate-y-1 shadow-saas-lg hover:shadow-saas-xl"
                style={{
                  backgroundColor: colors.lightBg,
                  color: colors.primary,
                }}
              >
                Start Free Trial
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>

              {/* Transparent Bordered Button */}
              <button className="px-8 py-4 rounded-lg font-bold text-base text-white border-2 border-white/30 transition-all duration-300 hover:border-white hover:bg-white/10 hover:-translate-y-1">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER (4-COLUMN STANDARD)
// ============================================================================

interface HealthcareSaaSFooterProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isDarkMode: boolean;
}

function HealthcareSaaSFooter({
  blueprint,
  colors,
  isDarkMode,
}: HealthcareSaaSFooterProps) {
  const socialIcons = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const productLinks = ["Features", "Pricing", "Updates", "Beta"];
  const companyLinks = ["About", "Blog", "Careers", "Press"];

  return (
    <footer
      className={cn(
        "pt-16 pb-8 transition-colors",
        isDarkMode
          ? "bg-gray-900 border-t border-gray-800"
          : "bg-gray-50 border-t border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {blueprint.images?.logo?.previewUrl ? (
                <img
                  src={blueprint.images.logo.previewUrl}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Heart className="w-5 h-5 text-white" />
                </div>
              )}
              <span
                className={cn(
                  "text-xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
              >
                {blueprint.hero.title}
              </span>
            </div>
            <p
              className={cn(
                "mb-6 font-medium leading-relaxed text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              {blueprint.footer.tagline}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110",
                    isDarkMode
                      ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4
              className={cn(
                "font-bold mb-4 text-sm uppercase tracking-wider",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={cn(
                      "text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block",
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4
              className={cn(
                "font-bold mb-4 text-sm uppercase tracking-wider",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={cn(
                      "text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block",
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4
              className={cn(
                "font-bold mb-4 text-sm uppercase tracking-wider",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone
                  className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  {blueprint.footer.contact?.phone || "+1 (555) 123-4567"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  {blueprint.footer.contact?.email || "contact@ahtarva.com"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  {blueprint.footer.contact?.location || "San Francisco, CA"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={cn(
            "pt-8 border-t text-center",
            isDarkMode ? "border-gray-800" : "border-gray-200"
          )}
        >
          <p
            className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-gray-500" : "text-gray-600"
            )}
          >
            {blueprint.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
