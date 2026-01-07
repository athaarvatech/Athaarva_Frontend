"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type {
  TemplateBlueprint,
  UploadedImageData,
} from "../templateBlueprints";
import { EditableText } from "../EditableText";
import {
  HeroImageUploader,
  AvatarUploader,
  FacilityImageUploader,
} from "../ImageUploader";
import {
  Phone,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Menu,
  X,
  Droplet,
  Cpu,
  Users,
  Heart,
  Building,
  Brain,
  Bone,
  Ribbon,
  Baby,
  Flower2,
  MapPin,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Play,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  ChevronLeft,
  Quote,
  Award,
  ChevronDown,
  FileText,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AhtarvaProfessionalTemplateProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (updatedBlueprint: TemplateBlueprint) => void;
  isEditMode?: boolean;
  showBanner?: boolean;
  useResponsive?: boolean; // When true, uses actual responsive CSS instead of scaling
}

interface ColorScheme {
  primary: string; // #246AFE - Professional Blue
  secondary: string; // #1a5ad4 - Hover Blue
  accent: string; // #EBF0FE - Light Blue Background
  textPrimary: string; // #0B0A0A - Near Black
  textSecondary: string; // #4B5563 - Gray
  lightBg: string; // #FFFFFF
  border: string; // #E5E7EB
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AhtarvaProfessionalTemplate - Modern, clean hospital template
 * Based on React landing page with floating cards, smooth animations, and blue accents
 * Features: Droplet logo, gradient hero, stats strip, specialty grid, doctor profiles
 */
export function AhtarvaProfessionalTemplate({
  blueprint,
  device,
  onBlueprintChange,
  isEditMode = false,
  showBanner = true,
  useResponsive = false,
}: AhtarvaProfessionalTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Color scheme - Use blueprint palette with fallback to Professional Blue
  const colors: ColorScheme = {
    primary: blueprint.palette?.accent || "#246AFE",
    secondary: blueprint.palette?.accentMuted || "#1a5ad4",
    accent: blueprint.palette?.surface || "#EBF0FE",
    textPrimary: blueprint.palette?.text || "#0B0A0A",
    textSecondary: blueprint.palette?.textMuted || "#4B5563",
    lightBg: blueprint.palette?.background || "#FFFFFF",
    border: "#E5E7EB",
  };

  // Device scaling - only apply when not using responsive mode
  const scale = useResponsive
    ? 1
    : device === "desktop"
    ? 1
    : device === "tablet"
    ? 0.92
    : 0.7;

  // Responsive breakpoint classes
  const isMobile = useResponsive && device === "mobile";
  const isTablet = useResponsive && device === "tablet";

  // Helper functions
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

  // Typography from blueprint
  const typography = {
    heading: blueprint.typography?.heading || '"Inter", system-ui, sans-serif',
    body: blueprint.typography?.body || '"Inter", system-ui, sans-serif',
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-white overflow-hidden",
        useResponsive && isMobile && "force-mobile-layout",
        useResponsive && isTablet && "force-tablet-layout"
      )}
      style={{
        transform: useResponsive ? "none" : `scale(${scale})`,
        transformOrigin: "top center",
        fontFamily: typography.body,
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=Sora:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600&family=Open+Sans:wght@400;600&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Note: Responsive overrides removed due to styled-jsx nesting limitations */}
      {false && useResponsive && isMobile && (
        <style>{`
          /* Force mobile layouts */
          .force-mobile-layout .hidden.md\\:flex,
          .force-mobile-layout .hidden.lg\\:flex,
          .force-mobile-layout .hidden.md\\:block,
          .force-mobile-layout .hidden.lg\\:block,
          .force-mobile-layout .hidden.md\\:grid,
          .force-mobile-layout .hidden.lg\\:grid {
            display: none !important;
          }
          .force-mobile-layout .md\\:hidden,
          .force-mobile-layout .lg\\:hidden {
            display: block !important;
          }
          .force-mobile-layout .lg\\:grid-cols-2,
          .force-mobile-layout .lg\\:grid-cols-3,
          .force-mobile-layout .md\\:grid-cols-2,
          .force-mobile-layout .md\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
          .force-mobile-layout .lg\\:text-6xl,
          .force-mobile-layout .lg\\:text-5xl {
            font-size: 2.25rem !important;
            line-height: 2.5rem !important;
          }
          .force-mobile-layout .lg\\:text-4xl {
            font-size: 1.875rem !important;
          }
          .force-mobile-layout .lg\\:py-20,
          .force-mobile-layout .lg\\:py-24 {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }
          .force-mobile-layout .lg\\:px-8 {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .force-mobile-layout .lg\\:gap-8,
          .force-mobile-layout .lg\\:gap-12 {
            gap: 2rem !important;
          }
          .force-mobile-layout .lg\\:flex-row {
            flex-direction: column !important;
          }
          .force-mobile-layout .lg\\:w-1\\/2,
          .force-mobile-layout .lg\\:w-1\\/3 {
            width: 100% !important;
          }
        `}</style>
      )}
      {false && useResponsive && isTablet && (
        <style>{`
          /* Tablet styles */
          .force-tablet-layout .hidden.lg\\:flex,
          .force-tablet-layout .hidden.lg\\:block,
          .force-tablet-layout .hidden.lg\\:grid {
            display: none !important;
          }
          .force-tablet-layout .lg\\:hidden {
            display: block !important;
          }
          .force-tablet-layout .lg\\:grid-cols-3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .force-tablet-layout .lg\\:text-6xl {
            font-size: 3rem !important;
          }
        `}</style>
      )}

      {/* Header */}
      <ProfessionalHeader
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onImageUpdate={updateImages}
      />

      {/* Hero Section */}
      <ProfessionalHero
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={updateHero}
        onImageUpdate={updateImages}
      />

      {/* Stats Strip */}
      <ProfessionalStats
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(stats) => updateHero({ stats })}
      />

      {/* About/Features Section */}
      <ProfessionalAbout
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(about) => updateBlueprint("about", about)}
        onImageUpdate={updateImages}
      />

      {/* Specialties Grid */}
      <ProfessionalSpecialties
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(specialties) => updateBlueprint("specialties", specialties)}
      />

      {/* Doctors Section */}
      <ProfessionalDoctors
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(doctors) => updateBlueprint("doctors", doctors)}
      />

      {/* Facilities Section */}
      <ProfessionalFacilities
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(facilities) =>
          updateBlueprint("facilityHighlights", facilities)
        }
      />

      {/* Testimonials */}
      <ProfessionalTestimonials
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(testimonials) =>
          updateBlueprint("testimonials", testimonials)
        }
      />

      {/* Blog/Social Media Section */}
      <ProfessionalBlog
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(blogPosts) => updateBlueprint("blogPosts", blogPosts)}
      />

      {/* Appointment Section */}
      <ProfessionalAppointment
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Footer */}
      <ProfessionalFooter
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(footer) => updateBlueprint("footer", footer)}
      />
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

interface ProfessionalHeaderProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function ProfessionalHeader({
  blueprint,
  colors,
  isEditMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  onImageUpdate,
}: ProfessionalHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [licenseDropdownOpen, setLicenseDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Doctors", href: "#doctors" },
    { label: "Contact", href: "#contact" },
  ];

  const licenses = blueprint.licenses || [];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        boxShadow: isScrolled ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ backgroundColor: colors.primary }}
            >
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              Ahtarva <span style={{ color: colors.primary }}>Medical</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                className="font-medium transition-colors relative group"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.primary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.textSecondary)
                }
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: colors.primary }}
                />
              </button>
            ))}
            
            {/* License Dropdown - beside Contact */}
            {licenses.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setLicenseDropdownOpen(!licenseDropdownOpen)}
                  onBlur={() => setTimeout(() => setLicenseDropdownOpen(false), 150)}
                  className="flex items-center gap-1 font-medium transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
                >
                  <Award className="w-4 h-4" />
                  License
                  <ChevronDown className={`w-3 h-3 transition-transform ${licenseDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {licenseDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    {licenses.map((license, idx) => (
                      <a
                        key={license.id || idx}
                        href={license.certificate_file instanceof File 
                          ? URL.createObjectURL(license.certificate_file) 
                          : typeof license.certificate_file === 'string' 
                            ? license.certificate_file 
                            : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="w-4 h-4" style={{ color: colors.primary }} />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{license.name}</p>
                          <p className="text-xs text-slate-500">View Certificate</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 transition-colors"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = colors.primary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = colors.textSecondary)
              }
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">
                {blueprint.footer?.contact?.phone || "+1 (234) 567-8900"}
              </span>
            </a>
            <button
              className="rounded-full px-6 py-2.5 font-medium transition-all hover:shadow-lg"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightBg,
                boxShadow: "0 4px 12px rgba(36, 106, 254, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary;
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(36, 106, 254, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(36, 106, 254, 0.15)";
              }}
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: mobileMenuOpen ? colors.accent : "transparent",
            }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: colors.textPrimary }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: colors.textPrimary }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{
              backgroundColor: colors.lightBg,
              borderColor: colors.accent,
            }}
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  className="font-medium py-3 px-4 rounded-xl text-left transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.primary;
                    e.currentTarget.style.backgroundColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                </button>
              ))}
              
              {/* Mobile License Links */}
              {licenses.length > 0 && (
                <div className="border-t mt-2 pt-3" style={{ borderColor: colors.accent }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-4 flex items-center gap-2" style={{ color: colors.textSecondary }}>
                    <Award className="w-3 h-3" /> Licenses
                  </p>
                  {licenses.map((license, idx) => (
                    <a
                      key={license.id || idx}
                      href={license.certificate_file instanceof File 
                        ? URL.createObjectURL(license.certificate_file) 
                        : typeof license.certificate_file === 'string' 
                          ? license.certificate_file 
                          : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-4 transition-colors"
                      style={{ color: colors.textSecondary }}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{license.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

interface ProfessionalHeroProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (updates: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function ProfessionalHero({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
  onImageUpdate,
}: ProfessionalHeroProps) {
  const heroImage = blueprint.images?.heroImage;

  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.lightBg} 50%, ${colors.accent} 100%)`,
      }}
    >
      {/* Background Decorations */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}0d` }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}0d` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm mb-6"
              style={{
                backgroundColor: colors.lightBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#10b981" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: colors.textSecondary }}
              >
                <EditableText
                  value={blueprint.hero.eyebrow || "Trusted by 1M+ Patients"}
                  onChange={(eyebrow) => onUpdate({ eyebrow })}
                  as="span"
                  placeholder="Text"
                  editIndicator="icon"
                />
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: colors.textPrimary }}
            >
              <EditableText
                value={
                  blueprint.hero.title.split("Healthier")[0] ||
                  "Exceptional Care for a "
                }
                onChange={(val) =>
                  onUpdate({
                    title: `${val}Healthier ${
                      blueprint.hero.title.split("Healthier")[1] || "Community"
                    }`,
                  })
                }
                as="span"
                placeholder="Text"
                editIndicator="icon"
                className="inline"
              />
              <span className="relative" style={{ color: colors.primary }}>
                <EditableText
                  value="Healthier"
                  onChange={() => {}}
                  as="span"
                  placeholder=""
                  editIndicator="none"
                />
                {/* Underline SVG */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M1 5.5C47.6667 2.16667 152.4 -2.2 199 5.5"
                    stroke={colors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              <EditableText
                value={
                  blueprint.hero.title.split("Healthier")[1]?.trim() ||
                  "Community"
                }
                onChange={(val) =>
                  onUpdate({
                    title: `${
                      blueprint.hero.title.split("Healthier")[0]
                    }Healthier ${val}`,
                  })
                }
                as="span"
                placeholder="Text"
                editIndicator="icon"
                className="inline"
              />
            </h1>

            {/* Subtitle */}
            <div
              className="text-lg leading-relaxed mb-8 max-w-xl"
              style={{ color: colors.textSecondary }}
            >
              <EditableText
                value={
                  blueprint.hero.subtitle ||
                  "Experience world-class healthcare with our team of 150+ specialists across 40+ departments. Your health, our priority – available 24/7."
                }
                onChange={(subtitle) => onUpdate({ subtitle })}
                as="span"
                placeholder="Text"
                editIndicator="icon"
                multiline
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button
                className="flex items-center gap-2 rounded-full px-8 py-6 text-lg font-medium transition-all group"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.lightBg,
                  boxShadow: `0 8px 16px ${colors.primary}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.secondary;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 12px 24px ${colors.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 8px 16px ${colors.primary}40`;
                }}
              >
                Book Appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="rounded-full px-8 py-6 text-lg font-medium transition-all"
                style={{
                  backgroundColor: colors.lightBg,
                  color: colors.textPrimary,
                  border: `2px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.backgroundColor = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = colors.lightBg;
                }}
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {["RK", "PS", "AM", "SR"].map((initials, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        borderColor: colors.lightBg,
                        background: `linear-gradient(135deg, ${colors.primary} 0%, #6B8CFF 100%)`,
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="ml-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    4.9/5 from 2K+ reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image with Floating Cards */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {isEditMode ? (
                  <HeroImageUploader
                    value={heroImage || null}
                    onChange={(img) =>
                      onImageUpdate({ heroImage: img || undefined })
                    }
                    className="w-full h-[500px] lg:h-[600px]"
                  />
                ) : heroImage?.previewUrl ? (
                  <img
                    src={heroImage.previewUrl}
                    alt="Expert Doctor"
                    className="w-full h-[500px] lg:h-[600px] object-cover object-center"
                  />
                ) : (
                  <div
                    className="w-full h-[500px] lg:h-[600px] flex items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <span style={{ color: colors.textSecondary }}>
                      Upload Hero Image
                    </span>
                  </div>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Play Button Overlay */}
                {!isEditMode && (
                  <button
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Play
                      className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform"
                      style={{ color: colors.primary }}
                    />
                  </button>
                )}
              </div>

              {/* Floating Card - Reviews */}
              <div
                className="absolute -left-4 lg:-left-8 top-1/4 rounded-2xl shadow-xl p-4 animate-float"
                style={{ backgroundColor: colors.lightBg }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}1a` }}
                  >
                    <Star
                      className="w-6 h-6"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      4.8/5
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      Patient Reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card - 24/7 Support */}
              <div
                className="absolute -right-4 lg:-right-8 top-1/3 rounded-2xl shadow-xl p-4 animate-float"
                style={{
                  backgroundColor: colors.lightBg,
                  animationDelay: "0.5s",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p
                      className="text-lg font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      24/7
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      Emergency Care
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card - Success Rate */}
              <div
                className="absolute left-1/4 -bottom-6 rounded-2xl shadow-xl p-4 animate-float"
                style={{
                  backgroundColor: colors.lightBg,
                  animationDelay: "1s",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p
                      className="text-lg font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      98%
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      Success Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// STATS STRIP
// ============================================================================

interface ProfessionalStatsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (stats: Array<{ value: string; label: string }>) => void;
}

function ProfessionalStats({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: ProfessionalStatsProps) {
  const stats = blueprint.hero.stats || [
    { value: "25+", label: "Years of Excellence" },
    { value: "150+", label: "Expert Physicians" },
    { value: "1M+", label: "Happy Patients" },
    { value: "40+", label: "Medical Departments" },
  ];

  return (
    <section
      className="relative -mt-8 z-20"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="rounded-3xl shadow-xl p-8 border"
          style={{
            backgroundColor: colors.lightBg,
            borderColor: colors.accent,
            boxShadow: `0 4px 20px ${colors.primary}0d`,
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block">
                  <span
                    className="text-4xl sm:text-5xl font-bold group-hover:scale-110 transition-transform inline-block"
                    style={{ color: colors.primary }}
                  >
                    <EditableText
                      value={stat.value}
                      onChange={(value) => {
                        const updated = [...stats];
                        updated[index] = { ...stat, value };
                        onUpdate(updated);
                      }}
                      as="span"
                      placeholder="Text"
                      editIndicator="icon"
                    />
                  </span>
                </div>
                <div
                  className="font-medium mt-2"
                  style={{ color: colors.textSecondary }}
                >
                  <EditableText
                    value={stat.label}
                    onChange={(label) => {
                      const updated = [...stats];
                      updated[index] = { ...stat, label };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Text"
                    editIndicator="icon"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ABOUT/FEATURES SECTION
// ============================================================================

interface ProfessionalAboutProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (about: TemplateBlueprint["about"]) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function ProfessionalAbout({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
  onImageUpdate,
}: ProfessionalAboutProps) {
  const iconMap: Record<string, any> = {
    cpu: Cpu,
    users: Users,
    heart: Heart,
    building: Building,
  };

  const features = [
    {
      icon: "cpu",
      title: "Cutting-Edge Tech",
      description: "State-of-the-art medical equipment and diagnostic tools",
    },
    {
      icon: "users",
      title: "Expert Team",
      description: "Highly qualified specialists with years of experience",
    },
    {
      icon: "heart",
      title: "Patient-Centric",
      description: "Personalized care focused on your well-being",
    },
    {
      icon: "building",
      title: "Modern Facilities",
      description: "Contemporary infrastructure for optimal care delivery",
    },
  ];

  return (
    <section
      id="about"
      className="py-20"
      style={{ backgroundColor: colors.accent }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-semibold px-4 py-2 rounded-full text-sm mb-4"
            style={{
              backgroundColor: `${colors.primary}1a`,
              color: colors.primary,
            }}
          >
            <EditableText
              value="About Us"
              onChange={() => {}}
              as="span"
              placeholder="Badge Text"
              editIndicator="icon"
            />
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            <EditableText
              value="Pioneering Healthcare "
              onChange={() => {}}
              as="span"
              placeholder="Text"
              editIndicator="icon"
            />
            <span style={{ color: colors.primary }}>Excellence</span>
          </h2>
          <div
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            <EditableText
              value="Experience the perfect blend of advanced medical technology and compassionate care at Ahtarva Medical Center."
              onChange={(description) =>
                onUpdate({ ...blueprint.about, description } as any)
              }
              as="span"
              placeholder="Description"
              editIndicator="icon"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Video/Image with Play Button */}
          <div className="relative group">
            {isEditMode ? (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]">
                <FacilityImageUploader
                  value={blueprint.images?.facilityImages?.[0] || null}
                  onChange={(img) => {
                    const facilityImages =
                      blueprint.images?.facilityImages || [];
                    if (img) {
                      facilityImages[0] = img;
                    } else {
                      facilityImages[0] =
                        undefined as unknown as UploadedImageData;
                    }
                    onImageUpdate({
                      facilityImages: facilityImages.filter(Boolean),
                    });
                  }}
                  className="h-full"
                />
              </div>
            ) : blueprint.images?.facilityImages?.[0]?.previewUrl ? (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={blueprint.images.facilityImages[0].previewUrl}
                  alt="Take a look inside Ahtarva Medical Center"
                  className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#0B0A0A]/30 group-hover:bg-[#0B0A0A]/20 transition-colors" />

                {/* Text Overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-[#0B0A0A] mb-2">
                      Take a look inside
                    </h3>
                    <p style={{ color: colors.textSecondary }}>
                      Discover our state-of-the-art facilities designed for your
                      comfort and care.
                    </p>
                  </div>
                </div>

                {/* Play Button - Only show when image is uploaded */}
                <button
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group/play"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 8px 24px ${colors.primary}80`,
                  }}
                >
                  <Play className="w-10 h-10 text-white ml-1 group-hover/play:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-100 flex items-center justify-center h-[400px] lg:h-[500px]">
                <div className="text-center text-slate-400">
                  <span className="text-7xl">🏥</span>
                  <p className="mt-3 text-sm">No image uploaded yet</p>
                </div>
              </div>
            )}

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-6 py-3">
              <p
                className="font-bold text-lg"
                style={{ color: colors.primary }}
              >
                25+ Years
              </p>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                of Excellence
              </p>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: colors.textPrimary }}
              >
                <EditableText
                  value={
                    blueprint.about?.title || "Advanced Medical Technology"
                  }
                  onChange={(title) =>
                    onUpdate({ ...blueprint.about, title } as any)
                  }
                  as="span"
                  placeholder="Title"
                  editIndicator="icon"
                />
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                At Ahtarva Medical Center, we combine cutting-edge medical
                technology with compassionate care to deliver exceptional
                healthcare services. Our commitment to innovation ensures
                accurate diagnostics and effective treatments for all our
                patients.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow group cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#246AFE] transition-colors"
                      style={{ backgroundColor: `${colors.primary}1a` }}
                    >
                      <Icon
                        className="w-6 h-6 group-hover:text-white transition-colors"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <div>
                      <h4
                        className="font-bold mb-1"
                        style={{ color: colors.textPrimary }}
                      >
                        {feature.title}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Points */}
            <div className="flex flex-wrap gap-4">
              {["NABH Accredited", "ISO Certified", "JCI Standards"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2"
                    style={{ color: colors.textSecondary }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{item}</span>
                  </div>
                )
              )}
            </div>

            <button
              className="flex items-center gap-2 rounded-full px-8 py-6 text-lg font-medium transition-all group hover:shadow-xl"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightBg,
                boxShadow: `0 4px 12px ${colors.primary}40`,
              }}
            >
              Explore Our Facilities
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SPECIALTIES GRID
// ============================================================================

interface ProfessionalSpecialtiesProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (specialties: TemplateBlueprint["specialties"]) => void;
}

function ProfessionalSpecialties({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: ProfessionalSpecialtiesProps) {
  const iconMap: Record<string, any> = {
    heart: Heart,
    brain: Brain,
    bone: Bone,
    ribbon: Ribbon,
    baby: Baby,
    flower: Flower2,
  };

  const specialties = blueprint.specialties?.slice(0, 6) || [
    {
      title: "Cardiology",
      description:
        "Comprehensive heart care including diagnostics, treatment, and rehabilitation",
      icon: "heart",
    },
    {
      title: "Neurology",
      description:
        "Expert diagnosis and treatment of brain, spinal cord, and nervous system disorders",
      icon: "brain",
    },
    {
      title: "Orthopedics",
      description:
        "Specialized care for bones, joints, ligaments with advanced surgical options",
      icon: "bone",
    },
    {
      title: "Oncology",
      description:
        "Comprehensive cancer care with cutting-edge treatments and support",
      icon: "ribbon",
    },
    {
      title: "Pediatrics",
      description:
        "Dedicated healthcare for infants, children, and adolescents",
      icon: "baby",
    },
    {
      title: "Gynecology",
      description:
        "Complete women's health services including obstetrics and preventive care",
      icon: "flower",
    },
  ];

  return (
    <section
      id="services"
      className="py-20"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-semibold px-4 py-2 rounded-full text-sm mb-4"
            style={{
              backgroundColor: `${colors.primary}1a`,
              color: colors.primary,
            }}
          >
            Our Services
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Comprehensive Medical{" "}
            <span style={{ color: colors.primary }}>Specialties</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Expert care across a wide range of medical disciplines
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty, index) => {
            const Icon = iconMap[specialty.icon || "heart"] || Heart;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                style={{
                  backgroundColor: colors.lightBg,
                  borderColor: colors.accent,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary}33`;
                  e.currentTarget.style.boxShadow = `0 12px 24px ${colors.primary}0d`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.accent;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  <EditableText
                    value={specialty.title || "Specialty"}
                    onChange={(title) => {
                      const updated = [...specialties];
                      updated[index] = { ...specialty, title };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Specialty"
                    editIndicator="icon"
                  />
                </h3>
                <div
                  className="leading-relaxed mb-6"
                  style={{ color: colors.textSecondary }}
                >
                  <EditableText
                    value={specialty.description}
                    onChange={(description) => {
                      const updated = [...specialties];
                      updated[index] = { ...specialty, description };
                      onUpdate(updated);
                    }}
                    as="p"
                    placeholder="Description"
                    editIndicator="icon"
                  />
                </div>

                {/* Learn More Link */}
                <button
                  className="flex items-center gap-2 font-semibold group/link"
                  style={{ color: colors.primary }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all duration-300 group"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.lightBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent;
              e.currentTarget.style.color = colors.primary;
            }}
          >
            View All Specialties
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DOCTORS SECTION
// ============================================================================

interface ProfessionalDoctorsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (doctors: TemplateBlueprint["doctors"]) => void;
}

function ProfessionalDoctors({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: ProfessionalDoctorsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const doctors = blueprint.doctors?.slice(0, 4) || [
    {
      name: "Dr. Rajesh Kumar",
      role: "Cardiology",
      experience: "15+ Years",
      avatar: null,
    },
    {
      name: "Dr. Priya Sharma",
      role: "Neurology",
      experience: "12+ Years",
      avatar: null,
    },
    {
      name: "Dr. Amit Patel",
      role: "Orthopedics",
      experience: "18+ Years",
      avatar: null,
    },
    {
      name: "Dr. Sneha Reddy",
      role: "Pediatrics",
      experience: "10+ Years",
      avatar: null,
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % doctors.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  return (
    <section
      id="doctors"
      className="py-20"
      style={{ backgroundColor: colors.accent }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <span
              className="inline-block font-semibold px-4 py-2 rounded-full text-sm mb-4"
              style={{
                backgroundColor: `${colors.primary}1a`,
                color: colors.primary,
              }}
            >
              Our Doctors
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              Meet the People{" "}
              <span style={{ color: colors.primary }}>Who Care</span>
            </h2>
            <p
              className="text-lg max-w-xl"
              style={{ color: colors.textSecondary }}
            >
              Our team brings together expertise, empathy, and a deep passion
              for helping others.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3 mt-6 lg:mt-0">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all group"
              style={{
                borderColor: `${colors.textPrimary}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${colors.textPrimary}33`;
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowLeft
                className="w-5 h-5 transition-colors group-hover:text-white"
                style={{ color: colors.textPrimary }}
              />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: colors.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="rounded-3xl overflow-hidden transition-all duration-300 group hover:-translate-y-2 cursor-pointer"
              style={{
                backgroundColor: colors.lightBg,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 32px ${colors.primary}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              {/* Doctor Image with Experience Badge */}
              <div className="relative h-72 overflow-hidden">
                {isEditMode ? (
                  <AvatarUploader
                    value={doctor.photo || null}
                    onChange={(photo) => {
                      const updated = [...doctors];
                      updated[index] = { ...doctor, photo: photo || undefined };
                      onUpdate(updated);
                    }}
                    className="w-full h-full"
                  />
                ) : doctor.photo?.previewUrl ? (
                  <img
                    src={doctor.photo.previewUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary} 0%, #6B8CFF 100%)`,
                    }}
                  >
                    <Users className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                {/* Experience Badge */}
                <div
                  className="absolute top-4 right-4 rounded-full px-3 py-1"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: colors.primary }}
                  >
                    <EditableText
                      value={doctor.description || "15+ Years"}
                      onChange={(description) => {
                        const updated = [...doctors];
                        updated[index] = { ...doctor, description };
                        onUpdate(updated);
                      }}
                      as="span"
                      placeholder="Experience"
                      editIndicator="icon"
                    />
                  </span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      <EditableText
                        value={doctor.name}
                        onChange={(name) => {
                          const updated = [...doctors];
                          updated[index] = { ...doctor, name };
                          onUpdate(updated);
                        }}
                        as="span"
                        placeholder="Doctor Name"
                        editIndicator="icon"
                      />
                    </h3>
                    <p
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      <EditableText
                        value={doctor.specialty}
                        onChange={(specialty) => {
                          const updated = [...doctors];
                          updated[index] = { ...doctor, specialty };
                          onUpdate(updated);
                        }}
                        as="span"
                        placeholder="Specialty"
                        editIndicator="icon"
                      />
                    </p>
                  </div>
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group/btn"
                    style={{ backgroundColor: colors.accent }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                    }}
                  >
                    <ChevronRight
                      className="w-5 h-5 transition-colors group-hover/btn:text-white"
                      style={{ color: colors.primary }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all duration-300 shadow-sm group"
            style={{
              backgroundColor: colors.lightBg,
              color: colors.textPrimary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.lightBg;
              e.currentTarget.style.boxShadow = `0 8px 20px ${colors.primary}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.lightBg;
              e.currentTarget.style.color = colors.textPrimary;
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
            }}
          >
            View All Doctors
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FACILITIES SECTION
// ============================================================================

interface ProfessionalFacilitiesProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (facilities: TemplateBlueprint["facilityHighlights"]) => void;
}

function ProfessionalFacilities({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: ProfessionalFacilitiesProps) {
  const facilities = blueprint.facilityHighlights?.slice(0, 4) || [
    {
      title: "Intensive Care Unit",
      description: "24/7 critical care with advanced monitoring systems",
      image: null,
    },
    {
      title: "Operation Theaters",
      description: "Modular OTs with latest surgical equipment",
      image: null,
    },
    {
      title: "Diagnostic Center",
      description: "Advanced imaging and laboratory services",
      image: null,
    },
    {
      title: "Emergency Department",
      description: "Round-the-clock emergency and trauma care",
      image: null,
    },
  ];

  return (
    <section className="py-20" style={{ backgroundColor: colors.lightBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-semibold px-4 py-2 rounded-full text-sm mb-4"
            style={{
              backgroundColor: `${colors.primary}1a`,
              color: colors.primary,
            }}
          >
            Our Facilities
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            State-of-the-Art{" "}
            <span style={{ color: colors.primary }}>Infrastructure</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Modern medical facilities equipped with the latest technology for
            comprehensive patient care.
          </p>
        </div>

        {/* Facilities Grid - Masonry Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer ${
                index === 0 || index === 3
                  ? "md:row-span-2 h-[400px] md:h-full"
                  : "h-[300px]"
              }`}
            >
              {/* Facility Image */}
              {isEditMode ? (
                <HeroImageUploader
                  value={facility.image || null}
                  onChange={(image) => {
                    const updated = [...facilities];
                    updated[index] = {
                      ...facility,
                      image: image || undefined,
                    };
                    onUpdate(updated);
                  }}
                  className="w-full h-full"
                />
              ) : facility.image?.previewUrl ? (
                <img
                  src={facility.image.previewUrl}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary}20 100%)`,
                  }}
                >
                  <Building
                    className="w-16 h-16"
                    style={{ color: colors.primary, opacity: 0.5 }}
                  />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A0A]/80 via-[#0B0A0A]/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  <EditableText
                    value={facility.title}
                    onChange={(title) => {
                      const updated = [...facilities];
                      updated[index] = { ...facility, title };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Facility Name"
                    editIndicator="icon"
                  />
                </h3>
                <p className="text-white/80 mb-4">
                  <EditableText
                    value={facility.copy}
                    onChange={(copy) => {
                      const updated = [...facilities];
                      updated[index] = { ...facility, copy };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Description"
                    editIndicator="icon"
                  />
                </p>
                <button className="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Corner Badge */}
              <div
                className="absolute top-6 right-6 rounded-full px-4 py-2"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span
                  className="font-semibold text-sm"
                  style={{ color: colors.primary }}
                >
                  24/7 Available
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

interface ProfessionalTestimonialsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (testimonials: TemplateBlueprint["testimonials"]) => void;
}

function ProfessionalTestimonials({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: ProfessionalTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = blueprint.testimonials?.slice(0, 3) || [
    {
      name: "Ramesh K.",
      procedure: "Cardiac Bypass Surgery",
      content:
        "The cardiac team saved my life. From the moment I arrived with chest pain, every staff member showed incredible professionalism and compassion.",
    },
    {
      name: "Meera S.",
      procedure: "Knee Replacement",
      content:
        "From my first consultation to post-surgery recovery, every step was handled with utmost professionalism. The nursing staff was incredibly supportive.",
    },
    {
      name: "Vikram P.",
      procedure: "Pediatric Care",
      content:
        "Bringing my child here was the best decision. The pediatric team made my son feel comfortable and at ease.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20" style={{ backgroundColor: colors.accent }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-semibold px-4 py-2 rounded-full text-sm mb-4"
            style={{
              backgroundColor: `${colors.primary}1a`,
              color: colors.primary,
            }}
          >
            Testimonials
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            What Our Patients <span style={{ color: colors.primary }}>Say</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Real stories from real patients who experienced our exceptional
            care.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div
            className="rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden"
            style={{ backgroundColor: colors.lightBg }}
          >
            {/* Quote Icon Background */}
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="w-24 h-24" style={{ color: colors.primary }} />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < 5 ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote
              className="text-xl md:text-2xl leading-relaxed mb-8 font-medium"
              style={{ color: colors.textPrimary }}
            >
              &quot;
              <EditableText
                value={testimonials[currentIndex].quote}
                onChange={(quote) => {
                  const updated = [...testimonials];
                  updated[currentIndex] = {
                    ...testimonials[currentIndex],
                    quote,
                  };
                  onUpdate(updated);
                }}
                as="span"
                placeholder="Testimonial"
                editIndicator="icon"
              />
              &quot;
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-bold text-lg"
                  style={{ color: colors.textPrimary }}
                >
                  <EditableText
                    value={testimonials[currentIndex].name || "Anonymous"}
                    onChange={(name) => {
                      const updated = [...testimonials];
                      updated[currentIndex] = {
                        ...testimonials[currentIndex],
                        name,
                      };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Patient Name"
                    editIndicator="icon"
                  />
                </p>
                <p className="font-medium" style={{ color: colors.primary }}>
                  <EditableText
                    value={
                      testimonials[currentIndex].procedure || "General Care"
                    }
                    onChange={(procedure) => {
                      const updated = [...testimonials];
                      updated[currentIndex] = {
                        ...testimonials[currentIndex],
                        procedure,
                      };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Procedure"
                    editIndicator="icon"
                  />
                </p>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all group"
                  style={{
                    borderColor: colors.accent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.accent;
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <ChevronLeft
                    className="w-5 h-5 transition-colors group-hover:text-white"
                    style={{ color: colors.textSecondary }}
                  />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex ? "w-8" : "w-3 hover:opacity-70"
                }`}
                style={{
                  backgroundColor:
                    index === currentIndex
                      ? colors.primary
                      : `${colors.primary}30`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
          {["Google Reviews", "Practo", "Justdial", "Facebook"].map(
            (platform) => (
              <div
                key={platform}
                className="flex items-center gap-2 rounded-full px-6 py-3 shadow-sm"
                style={{ backgroundColor: colors.lightBg }}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span
                  className="font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  {platform}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BLOG/SOCIAL MEDIA SECTION
// ============================================================================

interface ProfessionalBlogProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (blogPosts: TemplateBlueprint["blogPosts"]) => void;
}

function ProfessionalBlog({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: ProfessionalBlogProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState<{
    [key: string]: number;
  }>({});

  const blogPosts = blueprint.blogPosts || [
    {
      id: "blog-1",
      title: "The Future of Personalized Medicine",
      excerpt:
        "Discover how genetic testing and AI are revolutionizing treatment plans for individual patients.",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      category: "Medical Innovation",
      images: [],
      featured: true,
    },
    {
      id: "blog-2",
      title: "Healthy Heart Tips for 2024",
      excerpt:
        "Expert cardiologists share essential lifestyle changes for better cardiovascular health.",
      date: "2024-01-10",
      author: "Dr. Michael Chen",
      category: "Heart Health",
      images: [],
      featured: false,
    },
    {
      id: "blog-3",
      title: "Understanding Mental Wellness",
      excerpt:
        "Breaking the stigma around mental health and exploring modern therapeutic approaches.",
      date: "2024-01-05",
      author: "Dr. Emily Parker",
      category: "Mental Health",
      images: [],
      featured: false,
    },
  ];

  const handleImageUpload = (
    postId: string,
    imageIndex: number,
    file: File
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = blogPosts.map((post) => {
        if (post.id === postId) {
          const newImages = [...(post.images || [])];
          newImages[imageIndex] = {
            file: file,
            previewUrl: reader.result as string,
          };
          return { ...post, images: newImages };
        }
        return post;
      });
      onUpdate(updated);
    };
    reader.readAsDataURL(file);
  };

  const addNewImageSlot = (postId: string) => {
    const updated = blogPosts.map((post) => {
      if (post.id === postId) {
        const newImages = [
          ...(post.images || []),
          { file: null, previewUrl: "" },
        ];
        return { ...post, images: newImages };
      }
      return post;
    });
    onUpdate(updated);
  };

  const removeImage = (postId: string, imageIndex: number) => {
    const updated = blogPosts.map((post) => {
      if (post.id === postId) {
        const newImages = (post.images || []).filter(
          (_, i) => i !== imageIndex
        );
        return { ...post, images: newImages };
      }
      return post;
    });
    onUpdate(updated);
  };

  const nextImage = (postId: string, totalImages: number) => {
    setCurrentCarouselIndex((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (postId: string, totalImages: number) => {
    setCurrentCarouselIndex((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-20" style={{ backgroundColor: colors.lightBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-semibold px-4 py-2 rounded-full text-sm mb-4"
            style={{
              backgroundColor: `${colors.primary}1a`,
              color: colors.primary,
            }}
          >
            Blog & Updates
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Latest Health{" "}
            <span style={{ color: colors.primary }}>Insights</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Stay informed with our latest medical news, health tips, and expert
            advice from our specialists.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, postIndex) => {
            const currentImageIndex = currentCarouselIndex[post.id] || 0;
            const validImages = (post.images || []).filter(
              (img) => img.previewUrl
            );

            return (
              <article
                key={post.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                style={{ backgroundColor: colors.accent }}
              >
                {/* Image Carousel Section */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {validImages.length > 0 ? (
                    <>
                      {/* Current Image */}
                      <img
                        src={
                          validImages[currentImageIndex % validImages.length]
                            ?.previewUrl
                        }
                        alt={`${post.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Carousel Controls - Show if multiple images */}
                      {validImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              prevImage(post.id, validImages.length)
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
                          <button
                            onClick={() =>
                              nextImage(post.id, validImages.length)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                          </button>

                          {/* Dots Indicator */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {validImages.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={() =>
                                  setCurrentCarouselIndex((prev) => ({
                                    ...prev,
                                    [post.id]: imgIndex,
                                  }))
                                }
                                className={cn(
                                  "w-2 h-2 rounded-full transition-all",
                                  imgIndex ===
                                    currentImageIndex % validImages.length
                                    ? "bg-white w-4"
                                    : "bg-white/50 hover:bg-white/70"
                                )}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* Placeholder when no images */
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${colors.primary}20` }}
                        >
                          <Instagram
                            className="w-8 h-8"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        {isEditMode && (
                          <span
                            className="text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            Add images below
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {post.featured && (
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Featured
                    </div>
                  )}

                  {/* Category Badge */}
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: colors.textPrimary,
                    }}
                  >
                    <EditableText
                      value={post.category}
                      onChange={(category) => {
                        const updated = [...blogPosts];
                        updated[postIndex] = { ...post, category };
                        onUpdate(updated);
                      }}
                      as="span"
                      placeholder="Category"
                      editIndicator="none"
                    />
                  </div>
                </div>

                {/* Edit Mode: Image Upload Controls */}
                {isEditMode && (
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span
                        className="text-xs font-medium"
                        style={{ color: colors.textSecondary }}
                      >
                        Images ({(post.images || []).length}/5):
                      </span>

                      {/* Existing Image Thumbnails */}
                      {(post.images || []).map((img, imgIndex) => (
                        <div key={imgIndex} className="relative group/img">
                          {img.previewUrl ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={img.previewUrl}
                                alt={`Thumbnail ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => removeImage(post.id, imgIndex)}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <label className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(post.id, imgIndex, file);
                                  }
                                }}
                              />
                              <span className="text-gray-400 text-lg">+</span>
                            </label>
                          )}
                        </div>
                      ))}

                      {/* Add New Image Button */}
                      {(post.images || []).length < 5 && (
                        <button
                          onClick={() => addNewImageSlot(post.id)}
                          className="w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors"
                          style={{
                            borderColor: colors.primary,
                            color: colors.primary,
                          }}
                        >
                          <span className="text-lg">+</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Date & Author */}
                  <div
                    className="flex items-center gap-3 text-sm mb-3"
                    style={{ color: colors.textSecondary }}
                  >
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <EditableText
                      value={post.author}
                      onChange={(author) => {
                        const updated = [...blogPosts];
                        updated[postIndex] = { ...post, author };
                        onUpdate(updated);
                      }}
                      as="span"
                      placeholder="Author name"
                      editIndicator="none"
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-2 line-clamp-2 group-hover:underline"
                    style={{ color: colors.textPrimary }}
                  >
                    <EditableText
                      value={post.title}
                      onChange={(title) => {
                        const updated = [...blogPosts];
                        updated[postIndex] = { ...post, title };
                        onUpdate(updated);
                      }}
                      as="span"
                      placeholder="Post title"
                      editIndicator="icon"
                    />
                  </h3>

                  {/* Excerpt */}
                  <p
                    className="text-sm line-clamp-3 mb-4"
                    style={{ color: colors.textSecondary }}
                  >
                    <EditableText
                      value={post.excerpt}
                      onChange={(excerpt) => {
                        const updated = [...blogPosts];
                        updated[postIndex] = { ...post, excerpt };
                        onUpdate(updated);
                      }}
                      as="span"
                      placeholder="Brief description..."
                      editIndicator="none"
                    />
                  </p>

                  {/* Read More Link */}
                  <div
                    className="flex items-center gap-2 text-sm font-semibold cursor-pointer group/link"
                    style={{ color: colors.primary }}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Add New Post Button (Edit Mode) */}
        {isEditMode && blogPosts.length < 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                const newPost = {
                  id: `blog-${Date.now()}`,
                  title: "New Blog Post",
                  excerpt: "Add a brief description for your blog post here...",
                  date: new Date().toISOString().split("T")[0],
                  author: "Author Name",
                  category: "Health",
                  images: [],
                  featured: false,
                };
                onUpdate([...blogPosts, newPost]);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{
                backgroundColor: `${colors.primary}10`,
                color: colors.primary,
                border: `2px dashed ${colors.primary}`,
              }}
            >
              <span className="text-xl">+</span>
              Add Blog Post
            </button>
          </div>
        )}

        {/* View All Link */}
        <div className="mt-12 text-center">
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: colors.primary }}
          >
            View All Articles
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// APPOINTMENT SECTION
// ============================================================================

interface ProfessionalAppointmentProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function ProfessionalAppointment({
  blueprint,
  colors,
  isEditMode,
}: ProfessionalAppointmentProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    date: "",
    message: "",
  });

  const departments = [
    "General Medicine",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Oncology",
    "Pediatrics",
    "Gynecology",
    "Gastroenterology",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        date: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = {
    phone: "+91 98765 43210",
    email: "care@ahtarvamedical.com",
    address: "123 Healthcare Avenue, Medical District, City - 400001",
    hours: "Open 24/7 for Emergencies",
  };

  return (
    <section
      id="contact"
      className="py-20"
      style={{ backgroundColor: colors.accent }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-semibold px-4 py-2 rounded-full text-sm mb-4"
            style={{
              backgroundColor: `${colors.primary}1a`,
              color: colors.primary,
            }}
          >
            Book Appointment
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Request Your{" "}
            <span style={{ color: colors.primary }}>Appointment</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Fill out the form below and our team will get back to you within 24
            hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div
              className="rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              style={{ backgroundColor: colors.lightBg }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.primary}1a` }}
              >
                <Phone className="w-7 h-7" style={{ color: colors.primary }} />
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: colors.textPrimary }}
              >
                Call Us
              </h3>
              <p className="mb-3" style={{ color: colors.textSecondary }}>
                Available 24/7 for emergencies
              </p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                {contactInfo.phone}
              </a>
            </div>

            <div
              className="rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              style={{ backgroundColor: colors.lightBg }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.primary}1a` }}
              >
                <Mail className="w-7 h-7" style={{ color: colors.primary }} />
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: colors.textPrimary }}
              >
                Email Us
              </h3>
              <p className="mb-3" style={{ color: colors.textSecondary }}>
                We&apos;ll respond within 24 hours
              </p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                {contactInfo.email}
              </a>
            </div>

            <div
              className="rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              style={{ backgroundColor: colors.lightBg }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.primary}1a` }}
              >
                <MapPin className="w-7 h-7" style={{ color: colors.primary }} />
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: colors.textPrimary }}
              >
                Visit Us
              </h3>
              <p className="mb-3" style={{ color: colors.textSecondary }}>
                {contactInfo.hours}
              </p>
              <p className="font-semibold" style={{ color: colors.primary }}>
                {contactInfo.address}
              </p>
            </div>
          </div>

          {/* Appointment Form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-3xl p-8 shadow-lg"
              style={{ backgroundColor: colors.lightBg }}
            >
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Request Submitted!
                  </h3>
                  <p
                    className="text-center"
                    style={{ color: colors.textSecondary }}
                  >
                    Thank you for your appointment request. Our team will
                    contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full rounded-xl h-12 px-4 border-0 focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.accent,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full rounded-xl h-12 px-4 border-0 focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.accent,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone"
                        className="w-full rounded-xl h-12 px-4 border-0 focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.accent,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full rounded-xl h-12 px-4 border-0 focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.accent,
                          color: colors.textSecondary,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-xl h-12 px-4 border-0 focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.accent,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        Additional Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your concern..."
                        rows={4}
                        className="w-full rounded-xl p-4 border-0 focus:ring-2 resize-none transition-all"
                        style={{
                          backgroundColor: colors.accent,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full py-6 text-lg font-semibold transition-all group flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.lightBg,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.secondary;
                      e.currentTarget.style.boxShadow = `0 8px 20px ${colors.primary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Request Appointment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

interface ProfessionalFooterProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (footer: TemplateBlueprint["footer"]) => void;
}

function ProfessionalFooter({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: ProfessionalFooterProps) {
  const footerData = blueprint.footer || {
    contact: {
      address: "123 Healthcare Avenue, Medical District, City - 400001",
      phone: "+91 98765 43210",
      email: "care@ahtarvamedical.com",
    },
    quickLinks: [
      { label: "Home", url: "#home" },
      { label: "About Us", url: "#about" },
      { label: "Services", url: "#services" },
      { label: "Blog", url: "#" },
    ],
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#",
      youtube: "#",
    },
  };

  return (
    <footer style={{ backgroundColor: colors.textPrimary }}>
      {/* CTA Banner */}
      <div style={{ backgroundColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                Ready to Experience World-Class Healthcare?
              </h3>
              <p className="text-white/80">
                Book your appointment today and take the first step towards
                better health.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white rounded-full px-8 py-4 font-semibold transition-all group whitespace-nowrap"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Book Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Ahtarva <span style={{ color: colors.primary }}>Medical</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Excellence in Healthcare, Compassion in Care. Trusted by millions
              for over 25 years.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: "#ffffff1a" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff1a";
                }}
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: "#ffffff1a" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff1a";
                }}
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: "#ffffff1a" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff1a";
                }}
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: "#ffffff1a" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff1a";
                }}
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: "#ffffff1a" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff1a";
                }}
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {(footerData.quickLinks || []).map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cardiology
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Neurology
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Radiology
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Urology
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  <EditableText
                    value={
                      footerData.contact?.location || "123 Healthcare Avenue"
                    }
                    onChange={(location) =>
                      onUpdate({
                        ...footerData,
                        contact: {
                          phone: footerData.contact?.phone || "",
                          email: footerData.contact?.email || "",
                          location,
                        },
                      })
                    }
                    as="span"
                    placeholder="Address"
                    editIndicator="icon"
                    className="text-gray-400"
                  />
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">
                  <EditableText
                    value={footerData.contact?.phone || "+91 98765 43210"}
                    onChange={(phone) =>
                      onUpdate({
                        ...footerData,
                        contact: { ...footerData.contact, phone },
                      } as any)
                    }
                    as="span"
                    placeholder="Phone"
                    editIndicator="icon"
                    className="text-gray-400"
                  />
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">
                  <EditableText
                    value={
                      footerData.contact?.email || "care@ahtarvamedical.com"
                    }
                    onChange={(email) =>
                      onUpdate({
                        ...footerData,
                        contact: { ...footerData.contact, email },
                      } as any)
                    }
                    as="span"
                    placeholder="Email"
                    editIndicator="icon"
                    className="text-gray-400"
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t text-center"
          style={{ borderColor: "#ffffff1a" }}
        >
          <p className="text-gray-400">
            © 2024 Ahtarva Medical Center. All Rights Reserved. |{" "}
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
