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
  Quote,
  Plus,
  Trash2,
  User,
  CheckCircle2,
  Zap,
  Building2,
  Microscope,
  Ambulance,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Hospital,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "../EditableText";
import type {
  TemplateBlueprint,
  UploadedImageData,
} from "../templateBlueprints";
import { HeroImageUploader, AvatarUploader } from "../ImageUploader";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ModernHealthTechTemplateProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (updated: TemplateBlueprint) => void;
  isEditMode?: boolean;
  showBanner?: boolean;
}

type ColorScheme = {
  primary: string; // Electric Blue
  lightBg: string; // Light grayish-white
  cardBg: string; // Pure White
  darkBg: string; // Dark Navy
  darkCard: string; // Slightly lighter dark
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 },
};

/**
 * ModernHealthTechTemplate - A futuristic, trustworthy, and high-tech medical landing page
 * Features: Electric Blue accents, glassmorphism, aggressive rounding, Bento grid layouts
 */
export function ModernHealthTechTemplate({
  blueprint,
  device,
  onBlueprintChange,
  isEditMode = true,
  showBanner = true,
}: ModernHealthTechTemplateProps) {
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

  // Electric Blue color scheme
  const colors: ColorScheme = {
    primary: "#137fec", // Electric Blue
    lightBg: "#f6f7f8", // Light grayish-white
    cardBg: "#ffffff", // Pure White
    darkBg: "#101922", // Dark Navy
    darkCard: "#1a2831", // Slightly lighter dark
  };

  return (
    <div
      className={cn(
        "h-full w-full overflow-y-auto overflow-x-hidden",
        device === "tablet" && "scale-[0.92] origin-top",
        device === "mobile" && "scale-[0.7] origin-top"
      )}
      style={{
        fontFamily: '"Manrope", sans-serif',
        backgroundColor: colors.lightBg,
      }}
    >
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");

        /* Custom animations */
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        /* Shadow utilities */
        .shadow-glow {
          box-shadow: 0 0 20px rgba(19, 127, 236, 0.3),
            0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .shadow-soft {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {/* Edit Mode Banner */}
      {/* {isEditMode && showBanner && (
        <div
          className="sticky top-0 z-[100] text-white px-4 py-2 text-center text-sm backdrop-blur-lg"
          style={{ backgroundColor: `${colors.primary}ee` }}
        >
          <span className="font-bold">⚡ Modern Health Tech Canvas</span> —
          Click to edit text, hover images to upload. Auto-save enabled.
        </div>
      )} */}

      {/* Glassmorphism Header */}
      <ModernHealthHeader
        blueprint={blueprint}
        colors={colors}
        onUpdate={updateHero}
        onImageUpdate={updateImages}
        isEditMode={isEditMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Abstract Layered Hero Section */}
      <ModernHealthHero
        blueprint={blueprint}
        colors={colors}
        onUpdate={updateHero}
        onImageUpdate={updateImages}
        isEditMode={isEditMode}
      />

      {/* Stats Strip (Overlap) */}
      <ModernHealthStats
        blueprint={blueprint}
        colors={colors}
        onUpdate={(stats) => updateHero({ stats })}
        isEditMode={isEditMode}
      />

      {/* Facilities (Asymmetric Grid) */}
      <ModernHealthFacilities
        blueprint={blueprint}
        colors={colors}
        onUpdate={(facilities) =>
          updateBlueprint("facilityHighlights", facilities)
        }
        isEditMode={isEditMode}
      />

      {/* Services (Bento Grid) */}
      <ModernHealthServices
        blueprint={blueprint}
        colors={colors}
        onUpdate={(specialties) => updateBlueprint("specialties", specialties)}
        isEditMode={isEditMode}
      />

      {/* Doctors (Portrait Cards) */}
      <ModernHealthDoctors
        blueprint={blueprint}
        colors={colors}
        onUpdate={(doctors) => updateBlueprint("doctors", doctors)}
        isEditMode={isEditMode}
      />

      {/* Testimonials (Mixed Cards) */}
      <ModernHealthTestimonials
        blueprint={blueprint}
        colors={colors}
        onUpdate={(testimonials) =>
          updateBlueprint("testimonials", testimonials)
        }
        isEditMode={isEditMode}
      />

      {/* Contact Section (Split Panel) */}
      <ModernHealthContact colors={colors} />

      {/* Footer */}
      <ModernHealthFooter blueprint={blueprint} colors={colors} />
    </div>
  );
}

// ============================================================================
// GLASSMORPHISM HEADER
// ============================================================================

interface ModernHealthHeaderProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (updates: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function ModernHealthHeader({
  blueprint,
  colors,
  onImageUpdate,
  mobileMenuOpen,
  setMobileMenuOpen,
}: ModernHealthHeaderProps) {
  const navLinks = ["Services", "Doctors", "About", "Contact"];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: colors.primary }}
            >
              {blueprint.images?.logo?.previewUrl ? (
                <img
                  src={blueprint.images.logo.previewUrl}
                  alt="Logo"
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <Heart className="w-6 h-6 text-white" />
              )}
            </div>
            <span
              className="text-xl font-extrabold"
              style={{ color: colors.darkBg }}
            >
              {blueprint.hero.title.split(" ").slice(0, 2).join(" ") ||
                "Ahtarva Health"}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={`#${link.toLowerCase()}`}
                className="text-gray-700 hover:text-gray-900 font-semibold transition-colors"
              >
                {link}
              </a>
            ))}

            {/* Book Appointment Button */}
            <button
              className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 shadow-glow"
              style={{ backgroundColor: colors.primary }}
            >
              Book Appointment
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
            {...fadeInUp}
            className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-700 hover:text-gray-900 font-semibold transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <button
                className="px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105 shadow-glow"
                style={{ backgroundColor: colors.primary }}
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// ABSTRACT LAYERED HERO SECTION
// ============================================================================

interface ModernHealthHeroProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (updates: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function ModernHealthHero({
  blueprint,
  colors,
  onUpdate,
  onImageUpdate,
  isEditMode,
}: ModernHealthHeroProps) {
  const hero = blueprint.hero;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Abstract Gradient Blobs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
        style={{
          background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div {...fadeInUp} className="space-y-8">
            {/* "Now Accepting" Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-soft">
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: colors.primary }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: colors.primary }}
                />
              </span>
              {isEditMode ? (
                <EditableText
                  value={hero.eyebrow}
                  onChange={(val) => onUpdate({ eyebrow: val })}
                  as="span"
                  className="text-sm font-bold"
                  style={{ color: colors.darkBg }}
                  placeholder="Now Accepting New Patients"
                  editIndicator="none"
                />
              ) : (
                <span
                  className="text-sm font-bold"
                  style={{ color: colors.darkBg }}
                >
                  {hero.eyebrow}
                </span>
              )}
            </div>

            {/* Massive Headline */}
            <div>
              {isEditMode ? (
                <EditableText
                  value={hero.title}
                  onChange={(val) => onUpdate({ title: val })}
                  as="h1"
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6"
                  style={{ color: colors.darkBg }}
                  placeholder="Innovating Health"
                  editIndicator="border"
                  multiline
                />
              ) : (
                <h1
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6"
                  style={{ color: colors.darkBg }}
                >
                  {hero.title}
                </h1>
              )}

              {isEditMode ? (
                <EditableText
                  value={hero.subtitle}
                  onChange={(val) => onUpdate({ subtitle: val })}
                  as="p"
                  className="text-xl text-gray-600 font-medium leading-relaxed"
                  placeholder="Experience the future of healthcare"
                  editIndicator="border"
                  multiline
                />
              ) : (
                <p className="text-xl text-gray-600 font-medium leading-relaxed">
                  {hero.subtitle}
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-4 rounded-full font-bold text-white transition-all hover:scale-105 shadow-glow flex items-center gap-2"
                style={{ backgroundColor: colors.primary }}
              >
                {hero.primaryCta.label}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 rounded-full font-bold bg-white text-gray-900 border-2 border-gray-200 transition-all hover:scale-105 shadow-soft">
                {hero.secondaryCta.label}
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              {/* Avatar Stack */}
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}${i * 20}` }}
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>
                ))}
              </div>

              {/* Star Rating */}
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      fill="#F59E0B"
                      style={{ color: "#F59E0B" }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 font-semibold">
                  <span className="font-bold" style={{ color: colors.darkBg }}>
                    5,000+
                  </span>{" "}
                  Happy Patients
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            {...scaleIn}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image Container */}
              <div
                className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 transform transition-transform hover:rotate-0 duration-500"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.lightBg} 100%)`,
                }}
              >
                {isEditMode ? (
                  <HeroImageUploader
                    value={blueprint.images?.heroImage || null}
                    onChange={(imageData) => {
                      if (imageData) {
                        onImageUpdate({
                          heroImage: imageData as UploadedImageData,
                        });
                      }
                    }}
                    placeholder="Upload Hero Image"
                  />
                ) : blueprint.images?.heroImage?.previewUrl ? (
                  <img
                    src={blueprint.images.heroImage.previewUrl}
                    alt="Healthcare"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Stethoscope
                      className="w-32 h-32 opacity-20"
                      style={{ color: colors.primary }}
                    />
                  </div>
                )}
              </div>

              {/* Floating "Success Rate" Card - Bottom Left */}
              <motion.div
                className="absolute bottom-8 -left-8 bg-white rounded-3xl p-6 shadow-2xl animate-bounce-slow"
                style={{
                  backdropFilter: "blur(12px)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <CheckCircle2
                      className="w-8 h-8"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-3xl font-extrabold"
                      style={{ color: colors.darkBg }}
                    >
                      98%
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">
                      Success Rate
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating "24/7 Care" Card - Top Right */}
              <motion.div
                className="absolute -top-6 -right-6 rounded-3xl p-6 shadow-glow"
                style={{
                  backgroundColor: colors.primary,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-9 h-9 text-white" />
                  </div>
                  <p className="text-2xl font-extrabold text-white mb-1">
                    24/7
                  </p>
                  <p className="text-sm text-white/90 font-semibold">
                    Emergency Care
                  </p>
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

interface ModernHealthStatsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (stats: TemplateBlueprint["hero"]["stats"]) => void;
  isEditMode: boolean;
}

function ModernHealthStats({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: ModernHealthStatsProps) {
  const iconColors = [colors.primary, "#10B981", "#8B5CF6", "#F59E0B"]; // Blue, Green, Purple, Orange
  const statsIcons = [Users, Activity, Award, Zap];

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
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl p-8 shadow-soft"
          style={{ backgroundColor: colors.cardBg }}
        >
          {blueprint.hero.stats.map((stat, index) => {
            const iconColor = iconColors[index % iconColors.length];
            const StatIcon = statsIcons[index % statsIcons.length];

            return (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative text-center transition-all hover:-translate-y-1 cursor-pointer",
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

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <StatIcon className="w-9 h-9" style={{ color: iconColor }} />
                </div>

                {/* Value */}
                {isEditMode ? (
                  <EditableText
                    value={stat.value}
                    onChange={(val) => updateStat(index, "value", val)}
                    as="h3"
                    className="text-4xl font-extrabold mb-2"
                    style={{ color: colors.darkBg }}
                    placeholder="100+"
                    editIndicator="border"
                  />
                ) : (
                  <h3
                    className="text-4xl font-extrabold mb-2"
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
                    className="text-sm text-gray-600 font-semibold"
                    placeholder="Label"
                    editIndicator="none"
                  />
                ) : (
                  <p className="text-sm text-gray-600 font-semibold">
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
              <span className="text-sm font-semibold">Add Stat</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ASYMMETRIC FACILITIES GRID
// ============================================================================

interface ModernHealthFacilitiesProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (facilities: TemplateBlueprint["facilityHighlights"]) => void;
  isEditMode: boolean;
}

function ModernHealthFacilities({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: ModernHealthFacilitiesProps) {
  const facilities = blueprint.facilityHighlights || [
    {
      title: "Advanced Equipment",
      copy: "State-of-the-art medical technology",
    },
    { title: "Expert Team", copy: "Highly qualified healthcare professionals" },
    { title: "24/7 Service", copy: "Round-the-clock emergency care" },
  ];

  const facilityIcons = [Microscope, Users, Clock];
  const facilityColors = [colors.primary, "#10B981", "#8B5CF6"];

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
      { title: "New Facility", copy: "Description here..." },
    ]);
  };

  const removeFacility = (index: number) => {
    const newFacilities = facilities.filter((_, i) => i !== index);
    onUpdate(newFacilities);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Sticky Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div {...fadeInUp}>
              <p
                className="text-sm font-bold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Our Facilities
              </p>
              <h2
                className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
                style={{ color: colors.darkBg }}
              >
                Advanced Medical Facilities
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Experience healthcare at its finest with cutting-edge technology
                and expert care
              </p>
            </motion.div>
          </div>

          {/* Right: Vertical Stack of Cards */}
          <div className="lg:col-span-2 space-y-6">
            {facilities.map((facility, index) => {
              const FacilityIcon = facilityIcons[index % facilityIcons.length];
              const facilityColor =
                facilityColors[index % facilityColors.length];

              return (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.15 }}
                  className={cn(
                    "group relative bg-white rounded-3xl p-6 md:p-8 shadow-soft transition-all hover:-translate-y-1 cursor-pointer",
                    isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
                  )}
                >
                  {isEditMode && (
                    <button
                      onClick={() => removeFacility(index)}
                      className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                      title="Remove facility"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Icon Square */}
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${facilityColor}20` }}
                    >
                      <FacilityIcon
                        className="w-10 h-10"
                        style={{ color: facilityColor }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {isEditMode ? (
                        <>
                          <EditableText
                            value={facility.title}
                            onChange={(val) =>
                              updateFacility(index, "title", val)
                            }
                            as="h3"
                            className="text-2xl font-bold mb-3"
                            style={{ color: colors.darkBg }}
                            placeholder="Facility Name"
                            editIndicator="border"
                          />
                          <EditableText
                            value={facility.copy}
                            onChange={(val) =>
                              updateFacility(index, "copy", val)
                            }
                            as="p"
                            className="text-gray-600 leading-relaxed font-medium"
                            placeholder="Facility description..."
                            multiline
                            editIndicator="none"
                          />
                        </>
                      ) : (
                        <>
                          <h3
                            className="text-2xl font-bold mb-3"
                            style={{ color: colors.darkBg }}
                          >
                            {facility.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed font-medium">
                            {facility.copy}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Image Placeholder */}
                    <div
                      className="w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${facilityColor}10` }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2
                          className="w-16 h-16 opacity-20"
                          style={{ color: facilityColor }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Add Facility Button */}
            {isEditMode && facilities.length < 6 && (
              <button
                onClick={addFacility}
                className="w-full rounded-3xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm font-semibold">Add Facility</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BENTO GRID SERVICES SECTION
// ============================================================================

interface ModernHealthServicesProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (specialties: TemplateBlueprint["specialties"]) => void;
  isEditMode: boolean;
}

function ModernHealthServices({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: ModernHealthServicesProps) {
  const serviceIcons = [Heart, Brain, Bone, Baby, Stethoscope, Activity];
  const serviceColors = [
    colors.primary,
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
  ];

  const updateService = (
    index: number,
    field: keyof TemplateBlueprint["specialties"][0],
    value: string
  ) => {
    const newServices = [...blueprint.specialties];
    newServices[index] = { ...newServices[index], [field]: value };
    onUpdate(newServices);
  };

  const addService = () => {
    onUpdate([
      ...blueprint.specialties,
      {
        icon: "🏥",
        title: "New Service",
        description: "Service description...",
      },
    ]);
  };

  const removeService = (index: number) => {
    const newServices = blueprint.specialties.filter((_, i) => i !== index);
    onUpdate(newServices);
  };

  // Bento Grid: Hero Card (0), Emergency Card (1), then standard cards
  const getBentoClass = (index: number) => {
    if (index === 0) return "md:col-span-2 md:row-span-2"; // Hero Card
    if (index === 1) return "md:row-span-2"; // Emergency Card (tall)
    return ""; // Standard card
  };

  const isHeroCard = (index: number) => index === 0;
  const isEmergencyCard = (index: number) => index === 1;

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
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: colors.darkBg }}
          >
            Comprehensive Care Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            From emergency care to specialized treatments, we&apos;ve got you
            covered
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-6 auto-rows-[200px]">
          {blueprint.specialties.slice(0, 7).map((service, index) => {
            const ServiceIcon = serviceIcons[index % serviceIcons.length];
            const serviceColor = serviceColors[index % serviceColors.length];
            const isHero = isHeroCard(index);
            const isEmergency = isEmergencyCard(index);

            return (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-3xl p-8 transition-all hover:-translate-y-1 cursor-pointer",
                  getBentoClass(index),
                  isHero && "shadow-glow",
                  !isHero && "shadow-soft",
                  isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
                )}
                style={{
                  backgroundColor: isEmergency
                    ? "#111418"
                    : isHero
                    ? `${colors.primary}15`
                    : colors.cardBg,
                }}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeService(index)}
                    className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                    title="Remove service"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Watermark Icon for Hero Card */}
                {isHero && (
                  <div className="absolute bottom-4 right-4 opacity-10">
                    <ServiceIcon
                      className="w-48 h-48"
                      style={{ color: colors.primary }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  {!isHero && (
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                        isEmergency ? "bg-white/10" : ""
                      )}
                      style={{
                        backgroundColor: !isEmergency
                          ? `${serviceColor}20`
                          : undefined,
                      }}
                    >
                      <ServiceIcon
                        className="w-8 h-8"
                        style={{
                          color: isEmergency ? "#EF4444" : serviceColor,
                        }}
                      />
                    </div>
                  )}

                  {/* Title */}
                  {isEditMode ? (
                    <EditableText
                      value={service.title || ""}
                      onChange={(val) => updateService(index, "title", val)}
                      as="h3"
                      className={cn(
                        "font-bold mb-3",
                        isHero ? "text-3xl" : "text-xl"
                      )}
                      style={{
                        color: isEmergency
                          ? "#ffffff"
                          : isHero
                          ? colors.primary
                          : colors.darkBg,
                      }}
                      placeholder="Service Name"
                      editIndicator="border"
                    />
                  ) : (
                    <h3
                      className={cn(
                        "font-bold mb-3",
                        isHero ? "text-3xl" : "text-xl"
                      )}
                      style={{
                        color: isEmergency
                          ? "#ffffff"
                          : isHero
                          ? colors.primary
                          : colors.darkBg,
                      }}
                    >
                      {service.title}
                    </h3>
                  )}

                  {/* Description */}
                  {isEditMode ? (
                    <EditableText
                      value={service.description}
                      onChange={(val) =>
                        updateService(index, "description", val)
                      }
                      as="p"
                      className={cn(
                        "leading-relaxed font-medium flex-1",
                        isEmergency ? "text-gray-300" : "text-gray-600"
                      )}
                      placeholder="Service description..."
                      multiline
                      editIndicator="none"
                    />
                  ) : (
                    <p
                      className={cn(
                        "leading-relaxed font-medium flex-1",
                        isEmergency ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {service.description}
                    </p>
                  )}

                  {/* Emergency Badge */}
                  {isEmergency && (
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-bold">
                        <Ambulance className="w-4 h-4" />
                        24/7 Available
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Add Service Button */}
          {isEditMode && blueprint.specialties.length < 10 && (
            <button
              onClick={addService}
              className="rounded-3xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-semibold">Add Service</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PORTRAIT DOCTORS SECTION
// ============================================================================

interface ModernHealthDoctorsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (doctors: TemplateBlueprint["doctors"]) => void;
  isEditMode: boolean;
}

function ModernHealthDoctors({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: ModernHealthDoctorsProps) {
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
        title: "Dr.",
        specialty: "Specialist",
        description: "Expert healthcare provider with years of experience",
        mediaLabel: "Profile Photo",
        photo: undefined,
      },
    ]);
  };

  const removeDoctor = (index: number) => {
    const newDoctors = blueprint.doctors.filter((_, i) => i !== index);
    onUpdate(newDoctors);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Our Experts
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: colors.darkBg }}
          >
            Meet Our Doctors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            World-class healthcare professionals dedicated to your wellness
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
                "group relative bg-white rounded-3xl overflow-hidden shadow-soft transition-all hover:-translate-y-1 cursor-pointer",
                isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
              )}
            >
              {isEditMode && (
                <button
                  onClick={() => removeDoctor(index)}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-20"
                  title="Remove doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Doctor Photo */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 transition-all grayscale group-hover:grayscale-0">
                {isEditMode ? (
                  <AvatarUploader
                    value={doctor.photo || null}
                    onChange={(imageData) =>
                      updateDoctor(index, "photo", imageData)
                    }
                    className="w-full h-full object-cover"
                  />
                ) : doctor.photo?.previewUrl ? (
                  <img
                    src={doctor.photo.previewUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <User className="w-32 h-32 text-gray-400" />
                  </div>
                )}

                {/* Floating Plus Button */}
                <div
                  className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Plus className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                {/* Name */}
                {isEditMode ? (
                  <EditableText
                    value={doctor.name}
                    onChange={(val) => updateDoctor(index, "name", val)}
                    as="h3"
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.darkBg }}
                    placeholder="Dr. Full Name"
                    editIndicator="border"
                  />
                ) : (
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.darkBg }}
                  >
                    {doctor.name}
                  </h3>
                )}

                {/* Specialty */}
                {isEditMode ? (
                  <EditableText
                    value={doctor.specialty}
                    onChange={(val) => updateDoctor(index, "specialty", val)}
                    as="p"
                    className="text-sm font-bold mb-3"
                    style={{ color: colors.primary }}
                    placeholder="Specialty"
                    editIndicator="none"
                  />
                ) : (
                  <p
                    className="text-sm font-bold mb-3"
                    style={{ color: colors.primary }}
                  >
                    {doctor.specialty}
                  </p>
                )}

                {/* Description */}
                {isEditMode ? (
                  <EditableText
                    value={doctor.description}
                    onChange={(val) => updateDoctor(index, "description", val)}
                    as="p"
                    className="text-gray-600 text-sm leading-relaxed font-medium"
                    placeholder="Doctor description..."
                    multiline
                    editIndicator="none"
                  />
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {doctor.description}
                  </p>
                )}

                {/* Title Badge */}
                {doctor.title && (
                  <div className="mt-4 flex items-center gap-2">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary,
                      }}
                    >
                      {doctor.title}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Add Doctor Button */}
          {isEditMode && blueprint.doctors.length < 12 && (
            <button
              onClick={addDoctor}
              className="rounded-3xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors min-h-[400px]"
            >
              <Plus className="w-10 h-10" />
              <span className="text-sm font-semibold">Add Doctor</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MIXED TESTIMONIALS SECTION
// ============================================================================

interface ModernHealthTestimonialsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  onUpdate: (testimonials: TemplateBlueprint["testimonials"]) => void;
  isEditMode: boolean;
}

function ModernHealthTestimonials({
  blueprint,
  colors,
  onUpdate,
  isEditMode,
}: ModernHealthTestimonialsProps) {
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
        quote: "Amazing service and care!",
        patient: "New Patient",
        procedure: "General Checkup",
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
            Patient Stories
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: colors.darkBg }}
          >
            What Our Patients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Real experiences from people who trust us with their health
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {blueprint.testimonials.map((testimonial, index) => {
            const isBlueCard = index % 2 === 0;

            return (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-3xl p-8 md:p-10 shadow-soft transition-all hover:-translate-y-1 cursor-pointer",
                  isEditMode && "ring-2 ring-transparent hover:ring-gray-200"
                )}
                style={{
                  backgroundColor: isBlueCard ? colors.primary : "#f6f7f8",
                }}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeTestimonial(index)}
                    className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                    title="Remove testimonial"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote
                    className="w-20 h-20"
                    style={{ color: isBlueCard ? "#ffffff" : colors.darkBg }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-current"
                        style={{
                          color: isBlueCard ? "#FCD34D" : "#F59E0B",
                        }}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  {isEditMode ? (
                    <EditableText
                      value={testimonial.quote}
                      onChange={(val) => updateTestimonial(index, "quote", val)}
                      as="p"
                      className="text-lg leading-relaxed mb-6 font-medium"
                      style={{
                        color: isBlueCard ? "#ffffff" : colors.darkBg,
                      }}
                      placeholder="Patient testimonial..."
                      multiline
                      editIndicator="border"
                    />
                  ) : (
                    <p
                      className="text-lg leading-relaxed mb-6 font-medium"
                      style={{
                        color: isBlueCard ? "#ffffff" : colors.darkBg,
                      }}
                    >
                      &quot;{testimonial.quote}&quot;
                    </p>
                  )}

                  {/* Patient Info */}
                  <div
                    className="pt-4 border-t"
                    style={{
                      borderColor: isBlueCard
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  >
                    {isEditMode ? (
                      <>
                        <EditableText
                          value={testimonial.patient || testimonial.name || ""}
                          onChange={(val) =>
                            updateTestimonial(index, "patient", val)
                          }
                          as="p"
                          className="font-bold text-base mb-1"
                          style={{
                            color: isBlueCard ? "#ffffff" : colors.darkBg,
                          }}
                          placeholder="Patient Name"
                          editIndicator="none"
                        />
                        <EditableText
                          value={testimonial.procedure || ""}
                          onChange={(val) =>
                            updateTestimonial(index, "procedure", val)
                          }
                          as="p"
                          className="text-sm font-medium"
                          style={{
                            color: isBlueCard
                              ? "rgba(255,255,255,0.8)"
                              : "#6b7280",
                          }}
                          placeholder="Procedure"
                          editIndicator="none"
                        />
                      </>
                    ) : (
                      <>
                        <p
                          className="font-bold text-base mb-1"
                          style={{
                            color: isBlueCard ? "#ffffff" : colors.darkBg,
                          }}
                        >
                          {testimonial.patient || testimonial.name}
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: isBlueCard
                              ? "rgba(255,255,255,0.8)"
                              : "#6b7280",
                          }}
                        >
                          {testimonial.procedure || ""}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add Testimonial Button */}
          {isEditMode && blueprint.testimonials.length < 8 && (
            <button
              onClick={addTestimonial}
              className="rounded-3xl border-2 border-dashed border-gray-300 p-10 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-semibold">Add Testimonial</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SPLIT PANEL CONTACT SECTION
// ============================================================================

interface ModernHealthContactProps {
  colors: ColorScheme;
}

function ModernHealthContact({ colors }: ModernHealthContactProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-[2.5rem] shadow-glow"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Left: Form */}
            <div className="p-8 md:p-12 bg-white">
              <motion.div {...fadeInUp}>
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
                  Book An Appointment
                </h2>
                <p className="text-gray-600 mb-8 font-medium">
                  Fill out the form and our team will get back to you within 24
                  hours
                </p>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium"
                  />

                  <select className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium">
                    <option>Select Department</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Pediatrics</option>
                    <option>Orthopedics</option>
                  </select>

                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium resize-none"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full px-8 py-5 rounded-2xl text-white font-bold shadow-glow transition-all hover:scale-105"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Submit Request
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Right: Dark Panel */}
            <div
              className="p-8 md:p-12"
              style={{ backgroundColor: colors.darkBg }}
            >
              <motion.div
                {...fadeInUp}
                transition={{ delay: 0.2 }}
                className="h-full flex flex-col justify-between"
              >
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Contact Information
                    </h3>
                    <p className="text-gray-400 font-medium">
                      We&apos;re here to help you 24/7. Reach out to us through
                      any of these channels.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}30` }}
                      >
                        <Phone
                          className="w-6 h-6"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold mb-1">
                          Call Us
                        </p>
                        <p className="text-white font-bold">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}30` }}
                      >
                        <Mail
                          className="w-6 h-6"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold mb-1">
                          Email Us
                        </p>
                        <p className="text-white font-bold">
                          contact@hospital.com
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}30` }}
                      >
                        <MapPin
                          className="w-6 h-6"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold mb-1">
                          Visit Us
                        </p>
                        <p className="text-white font-bold">
                          123 Medical Ave, City, State 12345
                        </p>
                      </div>
                    </div>

                    {/* Clock */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}30` }}
                      >
                        <Clock
                          className="w-6 h-6"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold mb-1">
                          Hours
                        </p>
                        <p className="text-white font-bold">
                          24/7 Emergency Services
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div
                  className="mt-8 h-64 rounded-2xl overflow-hidden"
                  style={{ backgroundColor: colors.darkCard }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-gray-600" />
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
// FOOTER SECTION
// ============================================================================

interface ModernHealthFooterProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
}

function ModernHealthFooter({ blueprint, colors }: ModernHealthFooterProps) {
  const socialIcons = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="pt-16 pb-8" style={{ backgroundColor: colors.darkBg }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {blueprint.images?.logo?.previewUrl ? (
                <img
                  src={blueprint.images.logo.previewUrl}
                  alt="Logo"
                  className="w-12 h-12 rounded-2xl object-cover"
                  style={{ backgroundColor: colors.primary }}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Hospital className="w-7 h-7 text-white" />
                </div>
              )}
              <span className="text-xl font-extrabold text-white">
                {blueprint.hero.title}
              </span>
            </div>
            <p className="text-gray-400 mb-6 font-medium leading-relaxed">
              {blueprint.footer.tagline}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: `${colors.primary}30` }}
                >
                  <social.icon
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {(blueprint.footer.quickLinks || []).map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-0.5 group-hover:w-3 transition-all"
                      style={{ backgroundColor: colors.primary }}
                    ></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-3">
              {blueprint.specialties.slice(0, 5).map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-0.5 group-hover:w-3 transition-all"
                      style={{ backgroundColor: colors.primary }}
                    ></span>
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 font-medium">
                  {blueprint.footer.contact?.phone || "+1 (555) 123-4567"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 font-medium">
                  {blueprint.footer.contact?.email || "contact@hospital.com"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 font-medium">
                  {blueprint.footer.contact?.location ||
                    "123 Medical Ave, City"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t text-center"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="text-gray-500 text-sm font-medium">
            {blueprint.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ModernHealthTechTemplate;
