"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Heart,
  Stethoscope,
  Activity,
  Users,
  Award,
  Brain,
  Bone,
  Baby,
  Menu,
  X,
  Check,
  Quote,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "../EditableText";
import type {
  TemplateBlueprint,
  UploadedImageData,
} from "../templateBlueprints";
import {
  LogoUploader,
  HeroImageUploader,
  AvatarUploader,
} from "../ImageUploader";

export interface PremiumMedicalTemplateProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (updatedBlueprint: TemplateBlueprint) => void;
  isEditMode?: boolean;
  showBanner?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// Color palette type
type ColorScheme = {
  primary: string;
  lightBg: string;
  cardBg: string;
  darkBg: string;
  darkCard: string;
};

/**
 * PremiumMedicalTemplate - A premium, high-trust landing page template
 * Features soft-tech design, generous rounding, and floating elements
 */
export function PremiumMedicalTemplate({
  blueprint,
  device,
  onBlueprintChange,
  isEditMode = true,
  showBanner = true,
}: PremiumMedicalTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to update nested properties immutably
  const updateBlueprint = <K extends keyof TemplateBlueprint>(
    key: K,
    value: TemplateBlueprint[K]
  ) => {
    onBlueprintChange({ ...blueprint, [key]: value });
  };

  const updateHero = (updates: Partial<TemplateBlueprint["hero"]>) => {
    updateBlueprint("hero", { ...blueprint.hero, ...updates });
  };

  const updateImages = (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => {
    updateBlueprint("images", { ...blueprint.images, ...updates });
  };

  // Premium color scheme
  const colors: ColorScheme = {
    primary: "#11d473", // Emerald Green
    lightBg: "#f6f8f7", // Soft Off-White
    cardBg: "#ffffff", // Pure White
    darkBg: "#102219", // Deep Jungle
    darkCard: "#1a2e24", // Dark Slate
  };

  return (
    <div
      className={cn(
        "h-full w-full overflow-y-auto overflow-x-hidden",
        device === "tablet" && "scale-[0.92] origin-top",
        device === "mobile" && "scale-[0.7] origin-top"
      )}
      style={{
        fontFamily: '"Manrope", "Inter", sans-serif',
        backgroundColor: colors.lightBg,
      }}
    >
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");
      `}</style>

      {/* Edit Mode Banner */}
      {isEditMode && showBanner && (
        <div
          className="sticky top-0 z-[100] text-white px-4 py-2 text-center text-sm backdrop-blur-lg"
          style={{ backgroundColor: `${colors.primary}ee` }}
        >
          <span className="font-bold">✨ Premium Canvas Mode</span> — Click to
          edit text, hover images to upload. Auto-save enabled.
        </div>
      )}

      <main className="min-h-full">
        {/* Header */}
        <PremiumHeader
          blueprint={blueprint}
          colors={colors}
          isEditMode={isEditMode}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onImageUpdate={updateImages}
        />

        {/* Hero Section */}
        <PremiumHeroSection
          blueprint={blueprint}
          colors={colors}
          onUpdate={updateHero}
          onImageUpdate={updateImages}
          isEditMode={isEditMode}
        />

        {/* Stats Strip (Overlap) */}
        <PremiumStatsStrip
          blueprint={blueprint}
          colors={colors}
          onUpdate={(stats) => updateHero({ stats })}
          isEditMode={isEditMode}
        />

        {/* About Section (Organic Shapes) */}
        <PremiumAboutSection
          blueprint={blueprint}
          colors={colors}
          onUpdate={(about) => updateBlueprint("about", about)}
          isEditMode={isEditMode}
        />

        {/* Services Grid */}
        <PremiumServicesGrid
          blueprint={blueprint}
          colors={colors}
          onUpdate={(specialties) =>
            updateBlueprint("specialties", specialties)
          }
          isEditMode={isEditMode}
        />

        {/* Doctors Team Grid */}
        <PremiumDoctorsGrid
          blueprint={blueprint}
          colors={colors}
          onUpdate={(doctors) => updateBlueprint("doctors", doctors)}
          isEditMode={isEditMode}
        />

        {/* Testimonials */}
        <PremiumTestimonials
          blueprint={blueprint}
          colors={colors}
          onUpdate={(testimonials) =>
            updateBlueprint("testimonials", testimonials)
          }
          isEditMode={isEditMode}
        />

        {/* Contact Section */}
        <PremiumContactSection colors={colors} />

        {/* Footer */}
        <PremiumFooter
          blueprint={blueprint}
          colors={colors}
          onUpdate={(footer) => updateBlueprint("footer", footer)}
        />
      </main>
    </div>
  );
}

// ============================================================================
// HEADER (STICKY & GLASS)
// ============================================================================

interface PremiumHeaderProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function PremiumHeader({
  blueprint,
  colors,
  isEditMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  onImageUpdate,
}: PremiumHeaderProps) {
  const logoImage = blueprint.images?.logo;
  const navLinks = ["Home", "About", "Services", "Doctors", "Contact"];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-lg transition-all duration-300"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <LogoUploader
                    value={logoImage || null}
                    onChange={(img) =>
                      onImageUpdate({ logo: img || undefined })
                    }
                    className="w-8 h-8"
                  />
                </div>
                <EditableText
                  value={blueprint.hero.title}
                  onChange={() => {}}
                  as="span"
                  className="text-xl font-extrabold"
                  style={{ color: colors.darkBg }}
                  placeholder="Hospital Name"
                  editIndicator="none"
                />
              </div>
            ) : (
              <>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  {logoImage?.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoImage.previewUrl}
                      alt="Logo"
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Heart
                      className="w-6 h-6"
                      style={{ color: colors.primary }}
                    />
                  )}
                </div>
                <span
                  className="text-xl font-extrabold"
                  style={{ color: colors.darkBg }}
                >
                  {blueprint.hero.title}
                </span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: colors.darkBg }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              className="px-6 py-2.5 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: colors.primary,
                boxShadow: "0 4px 14px rgba(17, 212, 115, 0.3)",
              }}
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: colors.darkBg }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: colors.darkBg }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t pt-4"
            style={{ borderTopColor: "rgba(0, 0, 0, 0.05)" }}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm font-medium"
                  style={{ color: colors.darkBg }}
                >
                  {link}
                </a>
              ))}
              <button
                className="px-6 py-2.5 rounded-full font-semibold text-white text-sm"
                style={{ backgroundColor: colors.primary }}
              >
                Book Appointment
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// HERO SECTION (SPLIT LAYOUT)
// ============================================================================

interface PremiumHeroSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (updates: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function PremiumHeroSection({
  blueprint,
  colors,
  onUpdate,
  onImageUpdate,
  isEditMode,
}: PremiumHeroSectionProps) {
  const heroImage = blueprint.images?.heroImage;

  const trustIndicators = [
    "24/7 Emergency Services",
    "Expert Medical Team",
    "Advanced Technology",
    "Patient-Centered Care",
  ];

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}08 0%, transparent 50%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div {...fadeInUp} className="space-y-6">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white shadow-sm">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              {isEditMode ? (
                <EditableText
                  value={blueprint.hero.eyebrow || "Welcome to Excellence"}
                  onChange={(val) => onUpdate({ eyebrow: val })}
                  as="span"
                  className="text-sm font-medium"
                  style={{ color: colors.darkBg }}
                  placeholder="Welcome message"
                  editIndicator="none"
                />
              ) : (
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.darkBg }}
                >
                  {blueprint.hero.eyebrow || "Welcome to Excellence"}
                </span>
              )}
            </div>

            {/* Heading */}
            <div>
              {isEditMode ? (
                <EditableText
                  value={blueprint.hero.title}
                  onChange={(val) => onUpdate({ title: val })}
                  as="h1"
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
                  style={{ color: colors.darkBg }}
                  placeholder="Your Trusted Healthcare Partner"
                  editIndicator="border"
                />
              ) : (
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
                  style={{ color: colors.darkBg }}
                >
                  {blueprint.hero.title.split(" ").map((word, idx) =>
                    word.toLowerCase().includes("health") ||
                    word.toLowerCase().includes("community") ? (
                      <span key={idx} style={{ color: colors.primary }}>
                        {word}{" "}
                      </span>
                    ) : (
                      <span key={idx}>{word} </span>
                    )
                  )}
                </h1>
              )}
            </div>

            {/* Subtitle */}
            {isEditMode ? (
              <EditableText
                value={blueprint.hero.subtitle}
                onChange={(val) => onUpdate({ subtitle: val })}
                as="p"
                className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium"
                placeholder="Delivering exceptional healthcare services..."
                multiline
                editIndicator="border"
              />
            ) : (
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                {blueprint.hero.subtitle}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {isEditMode ? (
                <>
                  <button
                    className="px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <EditableText
                      value={blueprint.hero.primaryCta.label}
                      onChange={(val) =>
                        onUpdate({
                          primaryCta: {
                            ...blueprint.hero.primaryCta,
                            label: val,
                          },
                        })
                      }
                      className="text-white"
                      placeholder="Primary CTA"
                      editIndicator="none"
                    />
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    className="px-8 py-4 rounded-xl font-bold border-2 bg-white transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2"
                    style={{
                      borderColor: colors.primary,
                      color: colors.darkBg,
                    }}
                  >
                    <EditableText
                      value={blueprint.hero.secondaryCta.label}
                      onChange={(val) =>
                        onUpdate({
                          secondaryCta: {
                            ...blueprint.hero.secondaryCta,
                            label: val,
                          },
                        })
                      }
                      style={{ color: colors.darkBg }}
                      placeholder="Secondary CTA"
                      editIndicator="none"
                    />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {blueprint.hero.primaryCta.label}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    className="px-8 py-4 rounded-xl font-bold border-2 bg-white transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2"
                    style={{
                      borderColor: colors.primary,
                      color: colors.darkBg,
                    }}
                  >
                    {blueprint.hero.secondaryCta.label}
                  </button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3 pt-4">
              {trustIndicators.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Check
                      className="w-3 h-3"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <span className="text-gray-700 font-medium">{indicator}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glowing Blur Blob */}
              <div
                className="absolute inset-0 blur-2xl opacity-30 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
                  transform: "translate(10%, 10%)",
                }}
              />

              {/* Main Image with Border */}
              <div className="relative aspect-square rounded-3xl border-4 border-white overflow-hidden shadow-2xl">
                {isEditMode ? (
                  <HeroImageUploader
                    value={heroImage || null}
                    onChange={(img) =>
                      onImageUpdate({ heroImage: img || undefined })
                    }
                    className="w-full h-full"
                  />
                ) : heroImage?.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImage.previewUrl}
                    alt={blueprint.hero.heroImageAlt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <Heart
                      className="w-32 h-32 opacity-20"
                      style={{ color: colors.primary }}
                    />
                  </div>
                )}
              </div>

              {/* Floating Emergency Service Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-2xl p-5 backdrop-blur-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#EF4444" }}
                  >
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      24/7 Emergency
                    </p>
                    <p className="text-xs text-gray-600">Always Available</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS STRIP (OVERLAP EFFECT)
// ============================================================================

interface PremiumStatsStripProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (stats: TemplateBlueprint["hero"]["stats"]) => void;
  isEditMode: boolean;
}

function PremiumStatsStrip({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: PremiumStatsStripProps) {
  const iconColors = ["#3B82F6", colors.primary, "#A855F7", "#F59E0B"]; // Blue, Green, Purple, Orange
  const statsIcons = [Users, Activity, Award, Heart];

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
    onUpdate([...blueprint.hero.stats, { label: "New Metric", value: "0" }]);
  };

  const removeStat = (index: number) => {
    const newStats = blueprint.hero.stats.filter((_, i) => i !== index);
    onUpdate(newStats);
  };

  return (
    <section className="relative -mt-10 z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {blueprint.hero.stats.map((stat, index) => {
            const iconColor = iconColors[index % iconColors.length];
            const StatIcon = statsIcons[index % statsIcons.length];

            return (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative bg-white rounded-3xl p-6 text-center transition-all hover:-translate-y-2 cursor-pointer",
                  isEditMode && "group"
                )}
                style={{
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                }}
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

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <StatIcon className="w-7 h-7" style={{ color: iconColor }} />
                </div>

                {/* Value */}
                {isEditMode ? (
                  <EditableText
                    value={stat.value}
                    onChange={(val) => updateStat(index, "value", val)}
                    as="h3"
                    className="text-3xl md:text-4xl font-extrabold mb-2"
                    style={{ color: colors.darkBg }}
                    placeholder="25+"
                    editIndicator="border"
                  />
                ) : (
                  <h3
                    className="text-3xl md:text-4xl font-extrabold mb-2"
                    style={{ color: colors.darkBg }}
                  >
                    {stat.value}
                  </h3>
                )}

                {/* Label */}
                {isEditMode ? (
                  <EditableText
                    value={stat.label}
                    onChange={(val) => updateStat(index, "label", val)}
                    as="p"
                    className="text-sm text-gray-600 font-medium"
                    placeholder="Label"
                    editIndicator="none"
                  />
                ) : (
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </p>
                )}
              </motion.div>
            );
          })}

          {/* Add Stat Button */}
          {isEditMode && blueprint.hero.stats.length < 6 && (
            <button
              onClick={addStat}
              className="rounded-3xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Add Stat</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ABOUT SECTION (ORGANIC SHAPES)
// ============================================================================

interface PremiumAboutSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (about: TemplateBlueprint["about"]) => void;
  isEditMode: boolean;
}

function PremiumAboutSection({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: PremiumAboutSectionProps) {
  const about = blueprint.about || {
    title: "World-Class Healthcare Services",
    subtitle: "About Us",
    description:
      "Providing compassionate, cutting-edge medical care to our community",
    highlights: [
      { label: "Patient Satisfaction", value: "98%" },
      { label: "Expert Doctors", value: "50+" },
    ],
  };

  const updateAbout = (field: keyof typeof about, value: string) => {
    onUpdate({ ...about, [field]: value });
  };

  const features = [
    {
      icon: Shield,
      title: "Advanced Technology",
      desc: "State-of-the-art medical equipment",
    },
    {
      icon: Heart,
      title: "Patient-Centric Care",
      desc: "Your health is our top priority",
    },
  ];

  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: colors.cardBg }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image with Decorative Blobs */}
          <motion.div {...fadeInUp} className="relative">
            <div className="relative">
              {/* Decorative Blur Blobs */}
              <div
                className="absolute -top-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-40"
                style={{ backgroundColor: colors.primary }}
              />
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-40"
                style={{ backgroundColor: colors.primary }}
              />

              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Stethoscope
                    className="w-32 h-32 opacity-20"
                    style={{ color: colors.primary }}
                  />
                </div>
              </div>

              {/* Floating ISO Certified Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 backdrop-blur-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Award
                      className="w-6 h-6"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-900">ISO</p>
                  <p className="text-xs text-gray-600">Certified</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              {isEditMode ? (
                <>
                  <EditableText
                    value={about.subtitle}
                    onChange={(val) => updateAbout("subtitle", val)}
                    as="p"
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ color: colors.primary }}
                    placeholder="Section Label"
                    editIndicator="border"
                  />
                  <EditableText
                    value={about.title}
                    onChange={(val) => updateAbout("title", val)}
                    as="h2"
                    className="text-3xl md:text-4xl font-extrabold leading-tight"
                    style={{ color: colors.darkBg }}
                    placeholder="World-Class Healthcare Services"
                    editIndicator="border"
                  />
                </>
              ) : (
                <>
                  <p
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ color: colors.primary }}
                  >
                    {about.subtitle}
                  </p>
                  <h2
                    className="text-3xl md:text-4xl font-extrabold leading-tight"
                    style={{ color: colors.darkBg }}
                  >
                    {about.title}
                  </h2>
                </>
              )}
            </div>

            {isEditMode ? (
              <EditableText
                value={about.description}
                onChange={(val) => updateAbout("description", val)}
                as="p"
                className="text-lg text-gray-600 leading-relaxed font-medium"
                placeholder="Describe your healthcare services..."
                multiline
                editIndicator="border"
              />
            ) : (
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {about.description}
              </p>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-6 rounded-3xl border transition-all hover:shadow-lg"
                    style={{ borderColor: `${colors.primary}20` }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <Icon
                        className="w-8 h-8"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <h4
                      className="font-bold text-lg mb-2"
                      style={{ color: colors.darkBg }}
                    >
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SERVICES GRID
// ============================================================================

interface PremiumServicesGridProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (specialties: TemplateBlueprint["specialties"]) => void;
  isEditMode: boolean;
}

function PremiumServicesGrid({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: PremiumServicesGridProps) {
  const serviceColors = [
    "#EF4444", // Red
    "#3B82F6", // Blue
    "#F59E0B", // Yellow
    "#A855F7", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
  ];

  const serviceIcons = [Heart, Brain, Bone, Baby, Activity, Stethoscope];

  const updateSpecialty = (
    index: number,
    field: keyof TemplateBlueprint["specialties"][0],
    value: string
  ) => {
    const newSpecialties = [...blueprint.specialties];
    newSpecialties[index] = { ...newSpecialties[index], [field]: value };
    onUpdate(newSpecialties);
  };

  const addSpecialty = () => {
    onUpdate([
      ...blueprint.specialties,
      {
        icon: "🏥",
        title: "New Service",
        description: "Add description here...",
      },
    ]);
  };

  const removeSpecialty = (index: number) => {
    const newSpecialties = blueprint.specialties.filter((_, i) => i !== index);
    onUpdate(newSpecialties);
  };

  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Our Services
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: colors.darkBg }}
          >
            Comprehensive Medical Care
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Expert healthcare services across all major specialties
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprint.specialties.slice(0, 6).map((specialty, index) => {
            const serviceColor = serviceColors[index % serviceColors.length];
            const ServiceIcon = serviceIcons[index % serviceIcons.length];

            return (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative bg-white rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer",
                  isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
                )}
                style={{
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                }}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeSpecialty(index)}
                    className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                    title="Remove service"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${serviceColor}20` }}
                >
                  <ServiceIcon
                    className="w-8 h-8"
                    style={{ color: serviceColor }}
                  />
                </div>

                {/* Title */}
                {isEditMode ? (
                  <EditableText
                    value={specialty.title || ""}
                    onChange={(val) => updateSpecialty(index, "title", val)}
                    as="h3"
                    className="text-xl font-bold mb-3"
                    style={{ color: colors.darkBg }}
                    placeholder="Service Name"
                    editIndicator="border"
                  />
                ) : (
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: colors.darkBg }}
                  >
                    {specialty.title}
                  </h3>
                )}

                {/* Description */}
                {isEditMode ? (
                  <EditableText
                    value={specialty.description}
                    onChange={(val) =>
                      updateSpecialty(index, "description", val)
                    }
                    as="p"
                    className="text-gray-600 leading-relaxed font-medium"
                    placeholder="Service description..."
                    multiline
                    editIndicator="none"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {specialty.description}
                  </p>
                )}
              </motion.div>
            );
          })}

          {/* Add Service Button */}
          {isEditMode && blueprint.specialties.length < 9 && (
            <button
              onClick={addSpecialty}
              className="rounded-3xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors min-h-[250px]"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Service</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DOCTORS TEAM GRID
// ============================================================================

interface PremiumDoctorsGridProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (doctors: TemplateBlueprint["doctors"]) => void;
  isEditMode: boolean;
}

function PremiumDoctorsGrid({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: PremiumDoctorsGridProps) {
  const updateDoctor = (
    index: number,
    field: keyof TemplateBlueprint["doctors"][0],
    value: unknown
  ) => {
    const newDoctors = [...blueprint.doctors];
    newDoctors[index] = {
      ...newDoctors[index],
      [field]: value,
    } as TemplateBlueprint["doctors"][0];
    onUpdate(newDoctors);
  };

  const addDoctor = () => {
    onUpdate([
      ...blueprint.doctors,
      {
        name: "Dr. New Doctor",
        specialty: "Specialty",
        description: "MBBS, MD - Expert physician",
        mediaLabel: "Doctor Photo",
      },
    ]);
  };

  const removeDoctor = (index: number) => {
    const newDoctors = blueprint.doctors.filter((_, i) => i !== index);
    onUpdate(newDoctors);
  };

  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: colors.cardBg }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Our Team
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: colors.darkBg }}
          >
            Expert Medical Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Meet our dedicated team of specialists committed to your well-being
          </p>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blueprint.doctors.map((doctor, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative rounded-3xl overflow-hidden bg-white transition-all hover:-translate-y-2 hover:shadow-2xl",
                isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
              )}
              style={{
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
              }}
            >
              {isEditMode && (
                <button
                  onClick={() => removeDoctor(index)}
                  className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-20"
                  title="Remove doctor"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              {/* Doctor Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {isEditMode ? (
                  <AvatarUploader
                    value={doctor.photo || null}
                    onChange={(imageData) => {
                      if (imageData) {
                        updateDoctor(
                          index,
                          "photo",
                          imageData as unknown as UploadedImageData
                        );
                      }
                    }}
                    placeholder={`Doctor ${index + 1} Photo`}
                  />
                ) : doctor.photo?.previewUrl ? (
                  <img
                    src={doctor.photo.previewUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}10` }}
                  >
                    <User
                      className="w-24 h-24 opacity-30"
                      style={{ color: colors.primary }}
                    />
                  </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(to top, ${colors.primary}dd 0%, transparent 50%)`,
                  }}
                />

                {/* Social Icons (visible on hover) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button
                    className="p-3 bg-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                  </button>
                  <button
                    className="p-3 bg-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                  </button>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6 text-center">
                {isEditMode ? (
                  <>
                    <EditableText
                      value={doctor.name}
                      onChange={(val) => updateDoctor(index, "name", val)}
                      as="h3"
                      className="text-xl font-bold mb-2"
                      style={{ color: colors.darkBg }}
                      placeholder="Dr. Name"
                      editIndicator="border"
                    />
                    <EditableText
                      value={doctor.specialty}
                      onChange={(val) => updateDoctor(index, "specialty", val)}
                      as="p"
                      className="text-sm font-semibold mb-2"
                      style={{ color: colors.primary }}
                      placeholder="Specialty"
                      editIndicator="none"
                    />
                  </>
                ) : (
                  <>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: colors.darkBg }}
                    >
                      {doctor.name}
                    </h3>
                    <p
                      className="text-sm font-semibold mb-2"
                      style={{ color: colors.primary }}
                    >
                      {doctor.specialty}
                    </p>
                  </>
                )}

                {isEditMode ? (
                  <EditableText
                    value={doctor.description}
                    onChange={(val) => updateDoctor(index, "description", val)}
                    as="p"
                    className="text-sm text-gray-600"
                    placeholder="MBBS, MD"
                    editIndicator="none"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{doctor.description}</p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Add Doctor Button */}
          {isEditMode && blueprint.doctors.length < 9 && (
            <button
              onClick={addDoctor}
              className="rounded-3xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors min-h-[400px]"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Doctor</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS (QUOTE BACKGROUND)
// ============================================================================

interface PremiumTestimonialsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (testimonials: TemplateBlueprint["testimonials"]) => void;
  isEditMode: boolean;
}

function PremiumTestimonials({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: PremiumTestimonialsProps) {
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
        quote: "Share your experience here...",
        name: "Patient Name",
        procedure: "Treatment Type",
        rating: 5,
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
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Giant Quote Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Quote
          className="w-[600px] h-[600px] opacity-5"
          style={{ color: colors.primary }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Testimonials
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: colors.darkBg }}
          >
            What Our Patients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Real stories from real people who trust us with their health
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {blueprint.testimonials.slice(0, 4).map((testimonial, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative bg-white rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl",
                isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
              )}
              style={{
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
              }}
            >
              {isEditMode && (
                <button
                  onClick={() => removeTestimonial(index)}
                  className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                  title="Remove testimonial"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    fill={i < (testimonial.rating || 5) ? "#F59E0B" : "none"}
                    style={{
                      color:
                        i < (testimonial.rating || 5) ? "#F59E0B" : "#D1D5DB",
                    }}
                  />
                ))}
              </div>

              {/* Text */}
              {isEditMode ? (
                <EditableText
                  value={testimonial.quote}
                  onChange={(val) => updateTestimonial(index, "quote", val)}
                  as="p"
                  className="text-gray-700 leading-relaxed mb-6 font-medium"
                  placeholder="Testimonial text..."
                  multiline
                  editIndicator="border"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                  {testimonial.quote}
                </p>
              )}

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                  {/* No image in blueprint, show placeholder */}
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <User
                      className="w-6 h-6 opacity-50"
                      style={{ color: colors.primary }}
                    />
                  </div>
                </div>
                <div>
                  {isEditMode ? (
                    <>
                      <EditableText
                        value={testimonial.name || testimonial.patient || ""}
                        onChange={(val) =>
                          updateTestimonial(index, "name", val)
                        }
                        as="p"
                        className="font-bold"
                        style={{ color: colors.darkBg }}
                        placeholder="Patient Name"
                        editIndicator="none"
                      />
                      <EditableText
                        value={testimonial.procedure || "General Treatment"}
                        onChange={(val) =>
                          updateTestimonial(index, "procedure", val)
                        }
                        as="p"
                        className="text-sm text-gray-600"
                        placeholder="Treatment Type"
                        editIndicator="none"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-bold" style={{ color: colors.darkBg }}>
                        {testimonial.name || testimonial.patient || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.procedure || "General Treatment"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Testimonial Button */}
          {isEditMode && blueprint.testimonials.length < 6 && (
            <button
              onClick={addTestimonial}
              className="rounded-3xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors min-h-[280px]"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Testimonial</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CONTACT SECTION (SPLIT FORM)
// ============================================================================

interface PremiumContactSectionProps {
  colors: ColorScheme;
}

function PremiumContactSection({ colors }: PremiumContactSectionProps) {
  const contactDetails = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      color: "#3B82F6",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@hospital.com",
      color: colors.primary,
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Medical St, City",
      color: "#F59E0B",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "24/7 Emergency Care",
      color: "#A855F7",
    },
  ];

  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: colors.cardBg }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Get In Touch
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: colors.darkBg }}
          >
            Contact Us Today
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            We&apos;re here to answer your questions and provide the care you
            need
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Form */}
          <motion.div
            {...fadeInUp}
            className="bg-white rounded-3xl p-8 md:p-10"
            style={{
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
            }}
          >
            <form className="space-y-6">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-opacity-50 focus:outline-none transition-colors font-medium"
                  style={{
                    borderColor: `${colors.primary}30`,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${colors.primary}30`;
                  }}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-opacity-50 focus:outline-none transition-colors font-medium"
                  style={{
                    borderColor: `${colors.primary}30`,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${colors.primary}30`;
                  }}
                />
              </div>

              {/* Subject */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-opacity-50 focus:outline-none transition-colors font-medium"
                  style={{
                    borderColor: `${colors.primary}30`,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${colors.primary}30`;
                  }}
                />
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-opacity-50 focus:outline-none transition-colors resize-none font-medium"
                  style={{
                    borderColor: `${colors.primary}30`,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${colors.primary}30`;
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: colors.primary }}
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Right: Map & Contact Details */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Map Placeholder */}
            <div className="relative h-[300px] rounded-3xl overflow-hidden bg-gray-100">
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                <MapPin
                  className="w-16 h-16 opacity-30"
                  style={{ color: colors.primary }}
                />
              </div>

              {/* Floating Location Card */}
              <div
                className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 backdrop-blur-lg shadow-2xl"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <MapPin
                      className="w-6 h-6"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: colors.darkBg }}
                    >
                      Visit Us
                    </p>
                    <p className="text-xs text-gray-600">
                      123 Medical Street, Healthcare City
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactDetails.map((detail, idx) => {
                const Icon = detail.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${detail.color}20` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: detail.color }}
                      />
                    </div>
                    <h4
                      className="font-bold text-sm mb-1"
                      style={{ color: colors.darkBg }}
                    >
                      {detail.label}
                    </h4>
                    <p className="text-xs text-gray-600">{detail.value}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

interface PremiumFooterProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (footer: TemplateBlueprint["footer"]) => void;
}

function PremiumFooter({ blueprint, colors }: PremiumFooterProps) {
  const footer = blueprint.footer || {
    tagline: "Leading healthcare provider",
    copyright: `© ${new Date().getFullYear()} All rights reserved`,
    quickLinks: ["About", "Services", "Doctors", "Contact"],
  };

  const socialIcons: Record<string, typeof Facebook> = {
    Facebook: Facebook,
    Twitter: Twitter,
    Instagram: Instagram,
    LinkedIn: Linkedin,
  };

  const socialPlatforms = ["Facebook", "Twitter", "Instagram", "LinkedIn"];

  return (
    <footer
      className="py-16 border-t"
      style={{
        backgroundColor: colors.darkBg,
        borderColor: `${colors.primary}20`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                {blueprint.images?.logo?.previewUrl ? (
                  <img
                    src={blueprint.images.logo.previewUrl}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <Heart
                    className="w-6 h-6"
                    style={{ color: colors.primary }}
                  />
                )}
              </div>
              <span className="text-xl font-bold text-white">
                {blueprint.hero.title.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed max-w-md">
              {footer.tagline || "Leading healthcare provider"}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {socialPlatforms.map((platform, idx) => {
                const Icon = socialIcons[platform];
                return Icon ? (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {(Array.isArray(footer.quickLinks) ? footer.quickLinks : []).map(
                (link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-2 group"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full transition-all group-hover:w-3"
                        style={{ backgroundColor: colors.primary }}
                      />
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <Phone
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: colors.primary }}
                />
                <span className="font-medium">
                  {footer.contact?.phone || "+1 (555) 123-4567"}
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: colors.primary }}
                />
                <span className="font-medium">
                  {footer.contact?.email || "info@hospital.com"}
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: colors.primary }}
                />
                <span className="font-medium">
                  {footer.contact?.location || "123 Medical St, City"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t text-center"
          style={{ borderColor: `${colors.primary}20` }}
        >
          <p className="text-gray-400 text-sm font-medium">
            {footer.copyright ||
              `© ${new Date().getFullYear()} All rights reserved`}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PremiumMedicalTemplate;
