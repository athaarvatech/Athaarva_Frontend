"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowRight,
  Plus,
  Trash2,
  Heart,
  Brain,
  Bone,
  Baby,
  Activity,
  Users,
  Clock,
  Shield,
  Stethoscope,
  Award,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "../EditableText";
import type {
  TemplateBlueprint,
  UploadedImageData,
} from "../templateBlueprints";
import { Button } from "@/components/ui/button";
import {
  LogoUploader,
  HeroImageUploader,
  AvatarUploader,
} from "../ImageUploader";

export interface AhtarvaModernTemplateProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (updatedBlueprint: TemplateBlueprint) => void;
  isEditMode?: boolean;
  showBanner?: boolean;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// Color palette type
type ColorPalette = {
  primary: string;
  secondary: string;
  darkBg: string;
  darkSurface: string;
  light: string;
};

/**
 * AhtarvaModernTemplate - A premium, modern hospital landing page template
 * Features glassmorphism, emerald green branding, and full editability
 */
export function AhtarvaModernTemplate({
  blueprint,
  device,
  onBlueprintChange,
  isEditMode = true,
  showBanner = true,
}: AhtarvaModernTemplateProps) {
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

  // Ahtarva color palette
  const colors = {
    primary: "#11d473", // Emerald Green
    secondary: "#0c4a6e", // Deep Navy/Slate
    darkBg: "#102219", // Deep Forest Green
    darkSurface: "#1a2e24", // Surface Dark
    light: "#f8fafb",
  };

  return (
    <div
      className={cn(
        "h-full w-full overflow-y-auto overflow-x-hidden bg-white",
        device === "tablet" && "scale-[0.92] origin-top",
        device === "mobile" && "scale-[0.7] origin-top"
      )}
      style={{
        fontFamily: '"Manrope", "Inter", sans-serif',
        backgroundColor: colors.light,
      }}
    >
      {/* Google Fonts Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Edit Mode Banner - Hidden in full screen mode
      {isEditMode && showBanner && (
        <div
          className="sticky top-0 z-[100] text-white px-4 py-2 text-center text-sm backdrop-blur"
          style={{ backgroundColor: `${colors.primary}ee` }}
        >
          <span className="font-semibold">🎨 Ahtarva Canvas Mode</span> — Click
          any text to edit, hover on images to upload. Changes save
          automatically.
        </div>
      )} */}

      <main className="min-h-full">
        {/* Header/Navbar */}
        <AhtarvaHeader
          blueprint={blueprint}
          colors={colors}
          isEditMode={isEditMode}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onImageUpdate={updateImages}
        />

        {/* Hero Section */}
        <AhtarvaHeroSection
          blueprint={blueprint}
          colors={colors}
          onUpdate={updateHero}
          onImageUpdate={updateImages}
          isEditMode={isEditMode}
        />

        {/* Stats Strip */}
        <AhtarvaStatsStrip
          blueprint={blueprint}
          colors={colors}
          onUpdate={(stats) => updateHero({ stats })}
          isEditMode={isEditMode}
        />

        {/* Innovation/About Section (Zig-Zag) */}
        <AhtarvaInnovationSection
          blueprint={blueprint}
          colors={colors}
          onUpdate={(about) => updateBlueprint("about", about)}
          isEditMode={isEditMode}
        />

        {/* Specialties Grid (Centers of Excellence) */}
        <AhtarvaSpecialtiesGrid
          blueprint={blueprint}
          colors={colors}
          onUpdate={(specialties) =>
            updateBlueprint("specialties", specialties)
          }
          isEditMode={isEditMode}
        />

        {/* Why Choose Us (Values) */}
        <AhtarvaWhyChooseUs
          blueprint={blueprint}
          colors={colors}
          onUpdate={(differentiators) =>
            updateBlueprint("differentiators", differentiators)
          }
          onImageUpdate={updateImages}
          isEditMode={isEditMode}
        />

        {/* Doctors Section */}
        <AhtarvaDoctorsSection
          blueprint={blueprint}
          colors={colors}
          onUpdate={(doctors) => updateBlueprint("doctors", doctors)}
          onImageUpdate={updateImages}
          isEditMode={isEditMode}
        />

        {/* Testimonials */}
        <AhtarvaTestimonials
          blueprint={blueprint}
          colors={colors}
          onUpdate={(testimonials) =>
            updateBlueprint("testimonials", testimonials)
          }
          isEditMode={isEditMode}
        />

        {/* Appointment Booking Section */}
        <AhtarvaAppointmentSection
          blueprint={blueprint}
          colors={colors}
          isEditMode={isEditMode}
        />

        {/* Footer */}
        <AhtarvaFooter
          blueprint={blueprint}
          colors={colors}
          onUpdate={(footer) => updateBlueprint("footer", footer)}
          isEditMode={isEditMode}
        />
      </main>
    </div>
  );
}

// ============================================================================
// HEADER/NAVBAR COMPONENT
// ============================================================================

interface AhtarvaHeaderProps {
  blueprint: TemplateBlueprint;
  colors: any;
  isEditMode: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function AhtarvaHeader({
  blueprint,
  colors,
  isEditMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  onImageUpdate,
}: AhtarvaHeaderProps) {
  const logoImage = blueprint.images?.logo;
  const navLinks = ["Home", "About", "Services", "Doctors", "Contact"];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-lg border-b"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderBottomColor: "rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <div className="flex items-center gap-3">
                <LogoUploader
                  value={logoImage || null}
                  onChange={(img) => onImageUpdate({ logo: img || undefined })}
                  className="w-12 h-12"
                />
                <div>
                  <EditableText
                    value={blueprint.hero.title}
                    onChange={(val) => {}}
                    as="span"
                    className="text-xl font-bold"
                    style={{ color: colors.secondary }}
                    placeholder="Hospital Name"
                    editIndicator="none"
                  />
                </div>
              </div>
            ) : (
              <>
                {logoImage?.previewUrl ? (
                  <img
                    src={logoImage.previewUrl}
                    alt="Logo"
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.primary }}
                  >
                    A
                  </div>
                )}
                <span
                  className="text-xl font-bold"
                  style={{ color: colors.secondary }}
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
                style={{ color: colors.secondary }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: colors.primary }}
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
              <X className="w-6 h-6" style={{ color: colors.secondary }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: colors.secondary }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
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
                    style={{ color: colors.secondary }}
                  >
                    {link}
                  </a>
                ))}
                <button
                  className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  Book Appointment
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

interface AhtarvaHeroSectionProps {
  blueprint: TemplateBlueprint;
  colors: any;
  onUpdate: (updates: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function AhtarvaHeroSection({
  blueprint,
  colors,
  onUpdate,
  onImageUpdate,
  isEditMode,
}: AhtarvaHeroSectionProps) {
  const heroImage = blueprint.images?.heroImage;

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: `radial-gradient(circle at 30% 50%, ${colors.primary}15, transparent 70%)`,
      }}
    >
      {/* Dot Pattern Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(${colors.primary}40 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Top Rated Badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm bg-white"
              style={{ borderColor: `${colors.primary}40` }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              {isEditMode ? (
                <EditableText
                  value={blueprint.hero.eyebrow || "Top Rated"}
                  onChange={(val) => onUpdate({ eyebrow: val })}
                  as="span"
                  className="text-sm font-semibold"
                  style={{ color: colors.secondary }}
                  placeholder="Badge Text"
                  editIndicator="none"
                />
              ) : (
                <span
                  className="text-sm font-semibold"
                  style={{ color: colors.secondary }}
                >
                  {blueprint.hero.eyebrow || "Top Rated"}
                </span>
              )}
            </motion.div>

            {/* Heading */}
            {isEditMode ? (
              <EditableText
                value={blueprint.hero.title}
                onChange={(val) => onUpdate({ title: val })}
                as="h1"
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: colors.secondary }}
                placeholder="Exceptional Care for You"
                editIndicator="border"
              />
            ) : (
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: colors.secondary }}
              >
                {blueprint.hero.title}
              </h1>
            )}

            {/* Subtitle */}
            {isEditMode ? (
              <EditableText
                value={blueprint.hero.subtitle}
                onChange={(val) => onUpdate({ subtitle: val })}
                as="p"
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
                placeholder="Your trusted healthcare partner..."
                multiline
                editIndicator="border"
              />
            ) : (
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {blueprint.hero.subtitle}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {isEditMode ? (
                <>
                  <button
                    className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
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
                    className="px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 bg-white"
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
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
                      style={{ color: colors.primary }}
                      placeholder="Secondary CTA"
                      editIndicator="none"
                    />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {blueprint.hero.primaryCta.label}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    className="px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 bg-white"
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    {blueprint.hero.secondaryCta.label}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Content - Image with Floating Card */}
          <div className="relative">
            <div className="relative">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                {isEditMode ? (
                  <HeroImageUploader
                    value={heroImage || null}
                    onChange={(img) =>
                      onImageUpdate({ heroImage: img || undefined })
                    }
                    className="w-full h-[500px]"
                  />
                ) : heroImage?.previewUrl ? (
                  <img
                    src={heroImage.previewUrl}
                    alt={blueprint.hero.heroImageAlt}
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-[500px] flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Heart
                      className="w-24 h-24 opacity-30"
                      style={{ color: colors.primary }}
                    />
                  </div>
                )}
              </div>

              {/* Floating Patient Satisfaction Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border"
                style={{ borderColor: `${colors.primary}20` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Star
                      className="w-6 h-6"
                      style={{ color: colors.primary }}
                      fill={colors.primary}
                    />
                  </div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          style={{ color: "#FFA500" }}
                          fill="#FFA500"
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      Patient Satisfaction
                    </p>
                    <p className="text-xs text-gray-500">4,890+ reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS STRIP COMPONENT
// ============================================================================

interface AhtarvaStatsStripProps {
  blueprint: TemplateBlueprint;
  colors: any;
  onUpdate: (stats: TemplateBlueprint["hero"]["stats"]) => void;
  isEditMode: boolean;
}

function AhtarvaStatsStrip({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: AhtarvaStatsStripProps) {
  const iconColors = ["#3B82F6", colors.primary, "#A855F7", "#F59E0B"]; // Blue, Green, Purple, Yellow

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
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {blueprint.hero.stats.map((stat, index) => {
            const iconColor = iconColors[index % iconColors.length];
            const StatIcon = [Users, Activity, Award, Heart][index % 4];

            return (
              <motion.div
                key={index}
                {...sectionAnimation}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative bg-white rounded-2xl shadow-lg p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1",
                  isEditMode && "group"
                )}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeStat(index)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    title="Remove stat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Icon Circle */}
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <StatIcon className="w-8 h-8" style={{ color: iconColor }} />
                </div>

                {/* Stat Value */}
                {isEditMode ? (
                  <EditableText
                    value={stat.value}
                    onChange={(val) => updateStat(index, "value", val)}
                    as="h3"
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: colors.secondary }}
                    placeholder="Value"
                    editIndicator="border"
                  />
                ) : (
                  <h3
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: colors.secondary }}
                  >
                    {stat.value}
                  </h3>
                )}

                {/* Stat Label */}
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
              className="rounded-2xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
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
// INNOVATION/ABOUT SECTION (ZIG-ZAG LAYOUT)
// ============================================================================

interface AhtarvaInnovationSectionProps {
  blueprint: TemplateBlueprint;
  colors: any;
  onUpdate: (about: TemplateBlueprint["about"]) => void;
  isEditMode: boolean;
}

function AhtarvaInnovationSection({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: AhtarvaInnovationSectionProps) {
  const about = blueprint.about || {
    title: "Advanced Medical Technology",
    subtitle: "Innovation",
    description: "State-of-the-art equipment and facilities for superior care",
    highlights: [
      { label: "Modern Equipment", value: "100%" },
      { label: "AI Diagnostics", value: "24/7" },
    ],
  };

  const updateAbout = (field: keyof typeof about, value: string) => {
    onUpdate({ ...about, [field]: value });
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Row 1: Image Left, Text Right */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Image with Glow Effect */}
          <motion.div {...sectionAnimation} className="relative">
            <div className="relative">
              {/* Glow Effect */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, #3B82F6)`,
                }}
              />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div
                  className="h-[400px] flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Activity
                    className="w-32 h-32 opacity-20"
                    style={{ color: colors.primary }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            {...sectionAnimation}
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
                    className="text-3xl md:text-4xl font-bold leading-tight"
                    style={{ color: colors.secondary }}
                    placeholder="Advanced Medical Equipment"
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
                    className="text-3xl md:text-4xl font-bold leading-tight"
                    style={{ color: colors.secondary }}
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
                className="text-lg text-gray-600 leading-relaxed"
                placeholder="Describe your advanced technology and equipment..."
                multiline
                editIndicator="border"
              />
            ) : (
              <p className="text-lg text-gray-600 leading-relaxed">
                {about.description}
              </p>
            )}

            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: "Latest Technology",
                  desc: "Cutting-edge medical equipment",
                },
                {
                  icon: Activity,
                  title: "AI-Powered Diagnostics",
                  desc: "Accurate and fast results",
                },
                {
                  icon: Award,
                  title: "Certified Excellence",
                  desc: "International accreditations",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <div>
                      <h4
                        className="font-semibold mb-1"
                        style={{ color: colors.secondary }}
                      >
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Row 2: Text Left, Image Right */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div {...sectionAnimation} className="space-y-6 md:order-1">
            <div>
              <p
                className="text-sm font-bold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Comfort & Care
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ color: colors.secondary }}
              >
                State-of-the-Art Facilities
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              Experience healthcare in an environment designed for your comfort
              and recovery. Our modern facilities combine medical excellence
              with patient-centered design.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: Heart,
                  title: "Patient-Centric Rooms",
                  desc: "Comfortable and modern spaces",
                },
                {
                  icon: Clock,
                  title: "24/7 Emergency Care",
                  desc: "Always here when you need us",
                },
                {
                  icon: Users,
                  title: "Family Support Areas",
                  desc: "Welcoming spaces for loved ones",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <div>
                      <h4
                        className="font-semibold mb-1"
                        style={{ color: colors.secondary }}
                      >
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Image with Glow Effect */}
          <motion.div
            {...sectionAnimation}
            transition={{ delay: 0.2 }}
            className="relative md:order-2"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-30"
                style={{
                  background: `linear-gradient(135deg, #A855F7, ${colors.primary})`,
                }}
              />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div
                  className="h-[400px] flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Stethoscope
                    className="w-32 h-32 opacity-20"
                    style={{ color: colors.primary }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SPECIALTIES GRID (CENTERS OF EXCELLENCE)
// ============================================================================

interface AhtarvaSpecialtiesGridProps {
  blueprint: TemplateBlueprint;
  colors: any;
  onUpdate: (specialties: TemplateBlueprint["specialties"]) => void;
  isEditMode: boolean;
}

function AhtarvaSpecialtiesGrid({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: AhtarvaSpecialtiesGridProps) {
  const specialtyIcons = [Heart, Brain, Bone, Baby, Activity, Stethoscope];

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
        title: "New Specialty",
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
      className="py-16 md:py-24"
      style={{ backgroundColor: colors.light }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div {...sectionAnimation} className="text-center mb-12">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Our Specialties
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.secondary }}
          >
            Centers of Excellence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive care across all major medical disciplines with
            world-class expertise
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprint.specialties.slice(0, 6).map((specialty, index) => {
            const SpecialtyIcon = specialtyIcons[index % specialtyIcons.length];
            const iconColor = [
              "#EF4444",
              "#3B82F6",
              "#8B5CF6",
              "#F59E0B",
              colors.primary,
              "#EC4899",
            ][index % 6];

            return (
              <motion.div
                key={index}
                {...sectionAnimation}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden",
                  isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
                )}
                style={{
                  borderLeft: `4px solid ${iconColor}`,
                }}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeSpecialty(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                    title="Remove specialty"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Background Icon (Subtle) */}
                <div className="absolute top-4 right-4 opacity-5">
                  <SpecialtyIcon className="w-32 h-32" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Circle */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${iconColor}20` }}
                  >
                    <SpecialtyIcon
                      className="w-8 h-8"
                      style={{ color: iconColor }}
                    />
                  </div>

                  {/* Title */}
                  {isEditMode ? (
                    <EditableText
                      value={specialty.title || ""}
                      onChange={(val) => updateSpecialty(index, "title", val)}
                      as="h3"
                      className="text-xl font-bold mb-3"
                      style={{ color: colors.secondary }}
                      placeholder="Specialty Name"
                      editIndicator="border"
                    />
                  ) : (
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: colors.secondary }}
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
                      className="text-gray-600 mb-4 leading-relaxed"
                      placeholder="Specialty description..."
                      multiline
                      editIndicator="none"
                    />
                  ) : (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {specialty.description}
                    </p>
                  )}

                  {/* Learn More Link */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                    style={{ color: iconColor }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add Specialty Button */}
          {isEditMode && blueprint.specialties.length < 9 && (
            <button
              onClick={addSpecialty}
              className="rounded-2xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors min-h-[250px]"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Specialty</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// WHY CHOOSE US (VALUES) SECTION
// ============================================================================

interface AhtarvaWhyChooseUsProps {
  blueprint: TemplateBlueprint;
  colors: any;
  onUpdate: (differentiators: TemplateBlueprint["differentiators"]) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function AhtarvaWhyChooseUs({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: AhtarvaWhyChooseUsProps) {
  const updateDifferentiator = (
    index: number,
    field: keyof TemplateBlueprint["differentiators"][0],
    value: string
  ) => {
    const newDifferentiators = [...blueprint.differentiators];
    newDifferentiators[index] = {
      ...newDifferentiators[index],
      [field]: value,
    };
    onUpdate(newDifferentiators);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image with Floating Badge */}
          <motion.div {...sectionAnimation} className="relative">
            <div className="relative">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <div
                  className="h-[500px] flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Users
                    className="w-32 h-32 opacity-20"
                    style={{ color: colors.primary }}
                  />
                </div>
              </div>

              {/* Floating 24/7 Emergency Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 border-4"
                style={{ borderColor: colors.primary }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p
                      className="text-lg font-bold"
                      style={{ color: colors.secondary }}
                    >
                      24/7
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Emergency Care
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Values List */}
          <motion.div
            {...sectionAnimation}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <p
                className="text-sm font-bold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Why Choose Us
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.secondary }}
              >
                Your Health, Our Priority
              </h2>
              <p className="text-lg text-gray-600">
                Experience the difference of patient-centered care backed by
                cutting-edge technology and compassionate professionals.
              </p>
            </div>

            {/* Values List */}
            <div className="space-y-6">
              {blueprint.differentiators.slice(0, 3).map((value, index) => {
                const ValueIcon = [Clock, Heart, Shield][index % 3];
                const iconColor = [colors.primary, "#EF4444", "#3B82F6"][
                  index % 3
                ];

                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${iconColor}20` }}
                    >
                      <ValueIcon
                        className="w-7 h-7"
                        style={{ color: iconColor }}
                      />
                    </div>
                    <div className="flex-1">
                      {isEditMode ? (
                        <>
                          <EditableText
                            value={value.title}
                            onChange={(val) =>
                              updateDifferentiator(index, "title", val)
                            }
                            as="h3"
                            className="text-xl font-bold mb-2"
                            style={{ color: colors.secondary }}
                            placeholder="Value Title"
                            editIndicator="border"
                          />
                          <EditableText
                            value={value.description}
                            onChange={(val) =>
                              updateDifferentiator(index, "description", val)
                            }
                            as="p"
                            className="text-gray-600 leading-relaxed"
                            placeholder="Value description..."
                            multiline
                            editIndicator="none"
                          />
                        </>
                      ) : (
                        <>
                          <h3
                            className="text-xl font-bold mb-2"
                            style={{ color: colors.secondary }}
                          >
                            {value.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {value.description}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DOCTORS SECTION
// ============================================================================

interface AhtarvaDoctorsSectionProps {
  blueprint: TemplateBlueprint;
  colors: any;
  onUpdate: (doctors: TemplateBlueprint["doctors"]) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function AhtarvaDoctorsSection({
  blueprint,
  colors,
  onUpdate,
  onImageUpdate,
  isEditMode,
}: AhtarvaDoctorsSectionProps) {
  const doctorAvatars = blueprint.images?.doctorAvatars || [];

  const updateDoctor = (
    index: number,
    field: keyof TemplateBlueprint["doctors"][0],
    value: string
  ) => {
    const newDoctors = [...blueprint.doctors];
    newDoctors[index] = { ...newDoctors[index], [field]: value };
    onUpdate(newDoctors);
  };

  const updateDoctorAvatar = (
    index: number,
    avatar: UploadedImageData | null
  ) => {
    const newAvatars = [...doctorAvatars];
    if (avatar) {
      newAvatars[index] = avatar;
    } else {
      newAvatars[index] = undefined as unknown as UploadedImageData;
    }
    onImageUpdate({ doctorAvatars: newAvatars.filter(Boolean) });
  };

  const addDoctor = () => {
    onUpdate([
      ...blueprint.doctors,
      {
        name: "Dr. New Doctor",
        specialty: "Specialty",
        description: "Add bio here...",
        mediaLabel: "View Profile",
      },
    ]);
  };

  const removeDoctor = (index: number) => {
    const newDoctors = blueprint.doctors.filter((_, i) => i !== index);
    onUpdate(newDoctors);
    const newAvatars = doctorAvatars.filter(
      (_: UploadedImageData | undefined, i: number) => i !== index
    );
    onImageUpdate({ doctorAvatars: newAvatars });
  };

  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: colors.light }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          {...sectionAnimation}
          className="text-center mb-12 flex items-center justify-between"
        >
          <div className="flex-1 text-left">
            <p
              className="text-sm font-bold uppercase tracking-wider mb-3"
              style={{ color: colors.primary }}
            >
              Expert Care Team
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: colors.secondary }}
            >
              Meet Our Doctors
            </h2>
          </div>
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={addDoctor}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Doctor
            </Button>
          )}
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprint.doctors.map((doctor, index) => (
            <motion.div
              key={index}
              {...sectionAnimation}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
                isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
              )}
            >
              {isEditMode && (
                <button
                  onClick={() => removeDoctor(index)}
                  className="absolute top-3 right-3 z-20 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  title="Remove doctor"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              {/* Doctor Image */}
              <div className="relative h-64 overflow-hidden">
                {isEditMode ? (
                  <AvatarUploader
                    value={doctorAvatars[index] || null}
                    onChange={(img) => updateDoctorAvatar(index, img)}
                    className="w-full h-full"
                  />
                ) : doctorAvatars[index]?.previewUrl ? (
                  <img
                    src={doctorAvatars[index].previewUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <Users
                      className="w-20 h-20 opacity-30"
                      style={{ color: colors.primary }}
                    />
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                {isEditMode ? (
                  <>
                    <EditableText
                      value={doctor.name}
                      onChange={(val) => updateDoctor(index, "name", val)}
                      as="h3"
                      className="text-xl font-bold mb-2"
                      style={{ color: colors.secondary }}
                      placeholder="Doctor Name"
                      editIndicator="border"
                    />
                    <EditableText
                      value={doctor.specialty}
                      onChange={(val) => updateDoctor(index, "specialty", val)}
                      as="p"
                      className="text-sm font-medium mb-3"
                      style={{ color: colors.primary }}
                      placeholder="Specialty"
                      editIndicator="none"
                    />
                    <EditableText
                      value={doctor.description}
                      onChange={(val) =>
                        updateDoctor(index, "description", val)
                      }
                      as="p"
                      className="text-gray-600 text-sm leading-relaxed"
                      placeholder="Doctor bio..."
                      multiline
                      editIndicator="none"
                    />
                  </>
                ) : (
                  <>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: colors.secondary }}
                    >
                      {doctor.name}
                    </h3>
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: colors.primary }}
                    >
                      {doctor.specialty}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {doctor.description}
                    </p>
                  </>
                )}

                {/* View Profile Button */}
                <button
                  className="mt-4 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                  style={{ color: colors.primary }}
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

interface AhtarvaTestimonialsProps {
  blueprint: TemplateBlueprint;
  colors: any;
  onUpdate: (testimonials: TemplateBlueprint["testimonials"]) => void;
  isEditMode: boolean;
}

function AhtarvaTestimonials({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: AhtarvaTestimonialsProps) {
  const updateTestimonial = (
    index: number,
    field: keyof TemplateBlueprint["testimonials"][0],
    value: string
  ) => {
    const newTestimonials = [...blueprint.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onUpdate(newTestimonials);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div {...sectionAnimation} className="text-center mb-12">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Patient Stories
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.secondary }}
          >
            What Our Patients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from real people who trust us with their health
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprint.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              {...sectionAnimation}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 border transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ borderColor: `${colors.primary}20` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    fill="#FFA500"
                    style={{ color: "#FFA500" }}
                  />
                ))}
              </div>

              {/* Quote */}
              {isEditMode ? (
                <EditableText
                  value={testimonial.quote}
                  onChange={(val) => updateTestimonial(index, "quote", val)}
                  as="p"
                  className="text-gray-700 leading-relaxed mb-6 italic"
                  placeholder="Patient testimonial..."
                  multiline
                  editIndicator="border"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              )}

              {/* Patient Info */}
              <div
                className="border-t pt-4"
                style={{ borderColor: `${colors.primary}20` }}
              >
                {isEditMode ? (
                  <>
                    <EditableText
                      value={testimonial.patient || testimonial.name || ""}
                      onChange={(val) =>
                        updateTestimonial(index, "patient", val)
                      }
                      as="p"
                      className="font-bold mb-1"
                      style={{ color: colors.secondary }}
                      placeholder="Patient Name"
                      editIndicator="border"
                    />
                    <EditableText
                      value={testimonial.procedure || ""}
                      onChange={(val) =>
                        updateTestimonial(index, "procedure", val)
                      }
                      as="p"
                      className="text-sm text-gray-600"
                      placeholder="Procedure/Treatment"
                      editIndicator="none"
                    />
                  </>
                ) : (
                  <>
                    <p
                      className="font-bold mb-1"
                      style={{ color: colors.secondary }}
                    >
                      {testimonial.patient || testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.procedure}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// APPOINTMENT BOOKING SECTION
// ============================================================================

interface AhtarvaAppointmentSectionProps {
  blueprint: TemplateBlueprint;
  colors: any;
  isEditMode: boolean;
}

function AhtarvaAppointmentSection({ colors }: AhtarvaAppointmentSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    message: "",
  });

  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Oncology",
    "Pediatrics",
    "Gynecology",
  ];

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.darkBg}, ${colors.darkSurface})`,
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(${colors.primary}80 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Overlay Image Effect */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div {...sectionAnimation} className="text-center mb-10">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Get In Touch
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Book Your Appointment
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Take the first step towards better health. Fill out the form below
            and our team will get back to you shortly.
          </p>
        </motion.div>

        {/* Appointment Form Card */}
        <motion.div
          {...sectionAnimation}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
        >
          <form className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.secondary }}
              >
                Full Name <span style={{ color: colors.primary }}>*</span>
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                style={{
                  borderColor: "#e5e7eb",
                }}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Email and Phone Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.secondary }}
                >
                  Email Address <span style={{ color: colors.primary }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e5e7eb",
                  }}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.secondary }}
                >
                  Phone Number <span style={{ color: colors.primary }}>*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e5e7eb",
                  }}
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.secondary }}
              >
                Department <span style={{ color: colors.primary }}>*</span>
              </label>
              <select
                id="department"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "#e5e7eb",
                  color: colors.secondary,
                }}
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Textarea */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.secondary }}
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  borderColor: "#e5e7eb",
                }}
                placeholder="Tell us about your health concerns..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3"
              style={{ backgroundColor: colors.primary }}
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our privacy policy and terms
              of service.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER SECTION
// ============================================================================

interface AhtarvaFooterProps {
  blueprint: TemplateBlueprint;
  colors: {
    primary: string;
    secondary: string;
    darkBg: string;
    darkSurface: string;
    light: string;
  };
  onUpdate: (footer: TemplateBlueprint["footer"]) => void;
  isEditMode: boolean;
}

function AhtarvaFooter({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: AhtarvaFooterProps) {
  const updateContact = (
    field: "phone" | "email" | "location",
    value: string
  ) => {
    const currentContact = blueprint.footer.contact || {
      phone: "",
      email: "",
      location: "",
    };
    onUpdate({
      ...blueprint.footer,
      contact: {
        phone: currentContact.phone || "",
        email: currentContact.email || "",
        location: currentContact.location || "",
        [field]: value,
      },
    });
  };

  const contact = blueprint.footer.contact || {
    phone: "+1 (555) 123-4567",
    email: "info@ahtarva.hospital",
    location: "123 Medical Plaza, Healthcare City, HC 12345",
  };

  const quickLinks = [
    "About Us",
    "Our Doctors",
    "Departments",
    "Patient Portal",
    "Careers",
    "Contact",
  ];

  const services = [
    "Emergency Care",
    "Outpatient Services",
    "Surgery",
    "Laboratory",
    "Pharmacy",
    "Radiology",
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer style={{ backgroundColor: colors.darkBg }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
                style={{ backgroundColor: colors.primary, color: "white" }}
              >
                A
              </div>
              <span className="text-xl font-bold">
                {blueprint.hero.title || "Ahtarva Hospital"}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted healthcare partner providing exceptional medical care
              with compassion and cutting-edge technology.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary,
                    }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-px group-hover:w-4 transition-all"
                      style={{ backgroundColor: colors.primary }}
                    />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href={`#${service.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-px group-hover:w-4 transition-all"
                      style={{ backgroundColor: colors.primary }}
                    />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Phone
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  {isEditMode ? (
                    <EditableText
                      value={contact.phone}
                      onChange={(val) => updateContact("phone", val)}
                      as="p"
                      className="text-sm text-gray-300"
                      placeholder="Phone number"
                      editIndicator="border"
                    />
                  ) : (
                    <p className="text-sm text-gray-300">{contact.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Mail className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  {isEditMode ? (
                    <EditableText
                      value={contact.email}
                      onChange={(val) => updateContact("email", val)}
                      as="p"
                      className="text-sm text-gray-300"
                      placeholder="Email address"
                      editIndicator="border"
                    />
                  ) : (
                    <p className="text-sm text-gray-300">{contact.email}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  {isEditMode ? (
                    <EditableText
                      value={contact.location}
                      onChange={(val) => updateContact("location", val)}
                      as="p"
                      className="text-sm text-gray-300 leading-relaxed"
                      placeholder="Hospital address"
                      multiline
                      editIndicator="border"
                    />
                  ) : (
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {contact.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: `${colors.primary}30` }}
        >
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            {blueprint.hero.title || "Ahtarva Hospital"}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AhtarvaModernTemplate;
