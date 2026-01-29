"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type {
  TemplateBlueprint,
  UploadedImageData,
} from "../templateBlueprints";
import { EditableText, EditModeProvider } from "../EditableText";
import {
  HeroImageUploader,
  AvatarUploader,
  FacilityImageUploader,
} from "../ImageUploader";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Calendar,
  Users,
  Heart,
  Building,
  Cpu,
  Award,
  HeartHandshake,
  Brain,
  Bone,
  Ribbon,
  Baby,
  PersonStanding,
  CheckCircle2,
  Star,
  Quote,
  Stethoscope,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Clock,
  User,
  ArrowRight,
  ChevronDown,
  FileText,
  Sparkles,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AhtarvaHealthcareTemplateProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (updatedBlueprint: TemplateBlueprint) => void;
  isEditMode?: boolean;
  showBanner?: boolean;
  useResponsive?: boolean; // When true, uses actual responsive CSS instead of scaling
}

interface ColorScheme {
  primary: string; // Teal #14b8a6
  primaryDark: string; // Teal dark #0d9488
  textPrimary: string; // Slate #0f172a
  textSecondary: string; // Slate #64748b
  lightBg: string; // Teal light #f0fdfa
  white: string; // #FFFFFF
  border: string; // Slate #e2e8f0
  accent: string; // Teal #14b8a6
}

// ============================================================================
// MOCK DATA (Inline for template use)
// ============================================================================

const defaultSiteInfo = {
  name: "Ahtarva Medical Center",
  tagline: "Excellence in Healthcare, Compassion in Care.",
  address:
    "123, Healthcare Avenue, Medical District, Mumbai, Maharashtra, 400001",
  phone: "+91 98765 43210",
  email: "info@ahtarvamedical.com",
};

const defaultNavLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Doctors", href: "#doctors" },
  { name: "Contact", href: "#contact" },
];

const defaultHeroContent = {
  badge: "WELCOME TO AHTARVA MEDICAL CENTER",
  headline: "Exceptional Care for a Healthier Community",
  subtitle:
    "Experience world-class healthcare with our team of 150+ specialists across 40 departments. We combine cutting-edge technology with personalized care.",
  primaryCta: "Book Appointment",
  secondaryCta: "Explore Services",
  floatingCard1: {
    title: "Expert Doctors",
    subtitle: "Advanced Technology",
  },
  floatingCard2: "24/7 Support",
  // heroImage: "", // Removed hardcoded image - users will upload their own
};

const defaultStats = [
  { icon: "Calendar", value: "25+", label: "Years of Excellence" },
  { icon: "Users", value: "150+", label: "Expert Physicians" },
  { icon: "Heart", value: "1M+", label: "Happy Patients" },
  { icon: "Building", value: "40+", label: "Medical Departments" },
];

const defaultTrustReasons = [
  {
    title: "Cutting-Edge Technology",
    description:
      "State-of-the-art diagnostic and treatment equipment including AI-powered imaging.",
    icon: "Cpu",
  },
  {
    title: "World-Class Experts",
    description:
      "Physicians trained at leading global institutions bringing decades of experience.",
    icon: "Award",
  },
  {
    title: "Patient-Centric Care",
    description:
      "Personalized attention with dedicated care coordinators ensuring seamless journeys.",
    icon: "HeartHandshake",
  },
];

const defaultSpecialties = [
  { name: "Cardiology", icon: "Heart" },
  { name: "Neurology", icon: "Brain" },
  { name: "Orthopedics", icon: "Bone" },
  { name: "Oncology", icon: "Ribbon" },
  { name: "Pediatrics", icon: "Baby" },
  { name: "Gynecology", icon: "PersonStanding" },
];

const defaultDoctors = [
  {
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    qualification: "MBBS, DM Cardiology",
    // image: "", // Removed hardcoded image - users will upload their own
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Neurology",
    qualification: "MBBS, MD",
    // image: "", // Removed hardcoded image - users will upload their own
  },
  {
    name: "Dr. Amit Patel",
    specialty: "Orthopedics",
    qualification: "MBBS, MS Ortho",
    // image: "", // Removed hardcoded image - users will upload their own
  },
  {
    name: "Dr. Sunita Reddy",
    specialty: "Oncology",
    qualification: "MBBS, MD",
    // image: "", // Removed hardcoded image - users will upload their own
  },
];

const defaultFacilities = [
  {
    title: "Advanced ICU",
    description:
      "50-bed intensive care unit with 24/7 critical care specialists monitoring patients round the clock.",
    // image: "", // Removed hardcoded image - users will upload their own
  },
  {
    title: "Modular Operation Theaters",
    description:
      "Equipped with robotic surgery systems and state-of-the-art medical equipment for precise procedures.",
    // image: "", // Removed hardcoded image - users will upload their own
  },
];

const defaultDepartments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Oncology",
  "Pediatrics",
  "Gynecology",
  "General Medicine",
  "Emergency Care",
];

const defaultTestimonials = [
  {
    quote:
      "The cardiac team saved my life. Dr. Kumar explained every step of my treatment with patience and care.",
    author: "Ramesh K.",
    rating: 5,
  },
  {
    quote:
      "The pediatric department took excellent care of my daughter. The staff was incredibly supportive and kind.",
    author: "Priya M.",
    rating: 5,
  },
  {
    quote:
      "Minimally invasive hip replacement had me walking in days. I'm grateful for the orthopedic team's expertise.",
    author: "Lakshmi S.",
    rating: 5,
  },
];

const defaultFooterLinks = {
  quickLinks: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Doctors", href: "#doctors" },
  ],
};

// Icon mapping
const iconMap: Record<
  string,
  React.FC<{ size?: number; className?: string; strokeWidth?: number }>
> = {
  Calendar,
  Users,
  Heart,
  Building,
  Cpu,
  Award,
  HeartHandshake,
  Brain,
  Bone,
  Ribbon,
  Baby,
  PersonStanding,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AhtarvaHealthcareTemplate - Modern, elegant hospital landing page template
 * Inspired by Athh-Frontend with teal accents, smooth animations, and professional design
 * Features: Full-screen hero, stats, trust section, specialties, doctors, facilities, appointments, testimonials, footer
 */
export function AhtarvaHealthcareTemplate({
  blueprint,
  device,
  onBlueprintChange,
  isEditMode = false,
  showBanner = true,
  useResponsive = false,
}: AhtarvaHealthcareTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Color scheme - Use blueprint palette with fallback to Teal
  const colors: ColorScheme = {
    primary: blueprint.palette?.accent || "#14b8a6",
    primaryDark: blueprint.palette?.text || "#0d9488",
    textPrimary: blueprint.palette?.text || "#0f172a",
    textSecondary: blueprint.palette?.textMuted || "#64748b",
    lightBg: blueprint.palette?.accentMuted || "#f0fdfa",
    white: "#FFFFFF",
    border: "#e2e8f0",
    accent: blueprint.palette?.accent || "#14b8a6",
  };

  // Typography from blueprint
  const typography = {
    heading: blueprint.typography?.heading || '"Inter", system-ui, sans-serif',
    body: blueprint.typography?.body || '"Inter", system-ui, sans-serif',
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

  return (
    <EditModeProvider isEditMode={isEditMode}>
    <div
      className={cn(
        "min-h-screen bg-white overflow-hidden antialiased",
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

      {/* Global Styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        ::selection {
          background-color: #14b8a6;
          color: white;
        }
      `}</style>

      {/* Note: Responsive overrides removed due to styled-jsx nesting limitations */}
      {false && useResponsive && isMobile && (
        <style>{`
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
            display: flex !important;
          }
          .force-mobile-layout .lg\\:grid-cols-2,
          .force-mobile-layout .lg\\:grid-cols-3,
          .force-mobile-layout .lg\\:grid-cols-4,
          .force-mobile-layout .md\\:grid-cols-2,
          .force-mobile-layout .md\\:grid-cols-3,
          .force-mobile-layout .md\\:grid-cols-4 {
            grid-template-columns: 1fr !important;
          }
          .force-mobile-layout .lg\\:text-6xl,
          .force-mobile-layout .lg\\:text-5xl,
          .force-mobile-layout .md\\:text-5xl {
            font-size: 2rem !important;
            line-height: 2.25rem !important;
          }
          .force-mobile-layout .lg\\:text-4xl,
          .force-mobile-layout .md\\:text-4xl {
            font-size: 1.75rem !important;
          }
          .force-mobile-layout .lg\\:text-3xl,
          .force-mobile-layout .md\\:text-3xl {
            font-size: 1.5rem !important;
          }
          .force-mobile-layout .lg\\:py-20,
          .force-mobile-layout .lg\\:py-24,
          .force-mobile-layout .md\\:py-16,
          .force-mobile-layout .md\\:py-20 {
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
          .force-mobile-layout .lg\\:px-8,
          .force-mobile-layout .md\\:px-6 {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .force-mobile-layout .lg\\:gap-8,
          .force-mobile-layout .lg\\:gap-12,
          .force-mobile-layout .md\\:gap-8 {
            gap: 1.5rem !important;
          }
          .force-mobile-layout .lg\\:flex-row,
          .force-mobile-layout .md\\:flex-row {
            flex-direction: column !important;
          }
          .force-mobile-layout .lg\\:w-1\\/2,
          .force-mobile-layout .lg\\:w-1\\/3,
          .force-mobile-layout .md\\:w-1\\/2 {
            width: 100% !important;
          }
          .force-mobile-layout .lg\\:h-\\[600px\\],
          .force-mobile-layout .md\\:h-\\[500px\\] {
            height: auto !important;
            min-height: 300px !important;
          }
        `}</style>
      )}
      {false && useResponsive && isTablet && (
        <style>{`
          .force-tablet-layout .hidden.lg\\:flex,
          .force-tablet-layout .hidden.lg\\:block,
          .force-tablet-layout .hidden.lg\\:grid {
            display: none !important;
          }
          .force-tablet-layout .lg\\:hidden {
            display: flex !important;
          }
          .force-tablet-layout .lg\\:grid-cols-3,
          .force-tablet-layout .lg\\:grid-cols-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .force-tablet-layout .lg\\:text-6xl {
            font-size: 2.75rem !important;
          }
          .force-tablet-layout .lg\\:text-5xl {
            font-size: 2.5rem !important;
          }
        `}</style>
      )}

      {/* Header */}
      <HeaderSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Hero Section */}
      <HeroSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={updateHero}
        onImageUpdate={updateImages}
      />

      {/* Stats Section */}
      <StatsSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Trust Section */}
      <TrustSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Specialties Section */}
      <SpecialtiesSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Doctors Section */}
      <DoctorsSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Facilities Section */}
      <FacilitiesSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onImageUpdate={updateImages}
      />

      {/* Appointment Section */}
      <AppointmentSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Blog/Social Media Section */}
      <BlogSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(blogPosts) => updateBlueprint("blogPosts", blogPosts)}
      />

      {/* Footer Section */}
      <FooterSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />
    </div>
    </EditModeProvider>
  );
}

// ============================================================================
// HEADER SECTION
// ============================================================================

interface HeaderSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function HeaderSection({
  blueprint,
  colors,
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderSectionProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [licenseDropdownOpen, setLicenseDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const licenses = blueprint.licenses || [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
              }}
            >
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? "text-slate-800" : "text-slate-800"
              }`}
            >
              <EditableText
                value={blueprint.hero.title || defaultSiteInfo.name}
                onChange={(val) => {}}
                as="span"
                placeholder="Hospital Name"
                editIndicator="icon"
              />
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {defaultNavLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-teal-600 ${
                  isScrolled ? "text-slate-600" : "text-slate-700"
                }`}
              >
                {link.name}
              </a>
            ))}
            
            {/* License Dropdown - beside Contact */}
            {licenses.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setLicenseDropdownOpen(!licenseDropdownOpen)}
                  onBlur={() => setTimeout(() => setLicenseDropdownOpen(false), 150)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:text-teal-600 ${
                    isScrolled ? "text-slate-600" : "text-slate-700"
                  }`}
                >
                  <Award size={16} />
                  License
                  <ChevronDown size={14} className={`transition-transform ${licenseDropdownOpen ? "rotate-180" : ""}`} />
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
                        <FileText size={18} className="text-teal-600" />
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

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              className="rounded-full px-6 py-2 font-medium shadow-lg transition-all duration-300 text-white"
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 10px 25px -5px ${colors.primary}40`,
              }}
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {defaultNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-slate-600 hover:text-teal-600 font-medium py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile License Links */}
            {licenses.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Award size={14} /> Licenses & Certifications
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
                    className="flex items-center gap-2 text-slate-600 py-2 hover:text-teal-600"
                  >
                    <FileText size={16} />
                    <span className="text-sm">{license.name}</span>
                  </a>
                ))}
              </div>
            )}
            
            <button
              className="w-full rounded-full py-3 font-medium mt-4 text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

interface HeroSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (updates: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function HeroSection({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
  onImageUpdate,
}: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen pt-20 overflow-hidden">
      {/* Background with organic shapes */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, ${colors.lightBg}, white, ${colors.lightBg}30)`,
        }}
      >
        {/* Organic blob shapes */}
        <div
          className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full blur-3xl transform translate-x-1/4 opacity-40"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}40, ${colors.primary}30)`,
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-2xl opacity-50"
          style={{
            background: `linear-gradient(to top left, ${colors.primary}30, ${colors.primary}40)`,
          }}
        />
        <div
          className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full blur-2xl opacity-30"
          style={{
            background: `linear-gradient(to right, ${colors.primary}30, transparent)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div>
              <span
                className="inline-block text-xs font-semibold tracking-wider px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${colors.primary}1A`,
                  color: colors.primaryDark,
                }}
              >
                <EditableText
                  value={blueprint.hero.eyebrow || defaultHeroContent.badge}
                  onChange={(val) => onUpdate({ eyebrow: val })}
                  as="span"
                  placeholder="Badge Text"
                  editIndicator="icon"
                />
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              <EditableText
                value={blueprint.hero.title || defaultHeroContent.headline}
                onChange={(val) => onUpdate({ title: val })}
                as="span"
                placeholder="Main Headline"
                editIndicator="icon"
              />
            </h1>

            {/* Subtitle */}
            <div className="text-lg text-slate-600 max-w-lg leading-relaxed">
              <EditableText
                value={blueprint.hero.subtitle || defaultHeroContent.subtitle}
                onChange={(val) => onUpdate({ subtitle: val })}
                as="p"
                placeholder="Subtitle Description"
                editIndicator="icon"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-6 text-base font-semibold rounded-full shadow-xl transition-all duration-300 hover:scale-105 text-white"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 25px 50px -12px ${colors.primary}40`,
                }}
              >
                <EditableText
                  value={
                    blueprint.hero.primaryCta?.label ||
                    defaultHeroContent.primaryCta
                  }
                  onChange={(val) => {
                    const currentCta = blueprint.hero.primaryCta || {
                      label: "",
                      href: "#",
                    };
                    onUpdate({ primaryCta: { ...currentCta, label: val } });
                  }}
                  as="span"
                  placeholder="Primary Button Text"
                  editIndicator="icon"
                />
              </button>
              <button
                className="border-2 text-slate-700 hover:text-teal-600 rounded-full px-8 py-6 text-base font-semibold hover:scale-105 transition-all duration-300 bg-white/50"
                style={{
                  borderColor: colors.border,
                }}
              >
                <EditableText
                  value={
                    blueprint.hero.secondaryCta?.label ||
                    defaultHeroContent.secondaryCta
                  }
                  onChange={(val) => {
                    const currentCta = blueprint.hero.secondaryCta || {
                      label: "",
                      href: "#",
                    };
                    onUpdate({ secondaryCta: { ...currentCta, label: val } });
                  }}
                  as="span"
                  placeholder="Secondary Button Text"
                  editIndicator="icon"
                />
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-lg">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}1A` }}
                >
                  <User className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Senior Healthcare Professionals
                  </p>
                  <p className="text-xs text-slate-500">Trusted by millions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image with floating elements */}
          <div className="relative">
            {/* Main curved background */}
            <div
              className="absolute top-10 right-0 w-full h-[500px] lg:h-[600px] rounded-[3rem] rounded-br-[10rem] transform rotate-3 opacity-90"
              style={{
                background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
              }}
            />

            {/* Doctor Image */}
            <div className="relative z-10">
              {isEditMode ? (
                <HeroImageUploader
                  value={blueprint.images?.heroImage || null}
                  onChange={(uploadedData) => {
                    if (uploadedData) {
                      onImageUpdate({ heroImage: uploadedData });
                    }
                  }}
                  placeholder="Upload hero image"
                  className="relative z-10 w-full max-w-md mx-auto lg:max-w-lg h-[450px] lg:h-[550px] rounded-3xl"
                />
              ) : blueprint.images?.heroImage?.previewUrl ? (
                <img
                  src={blueprint.images.heroImage.previewUrl}
                  alt="Professional Doctor"
                  className="relative z-10 w-full max-w-md mx-auto lg:max-w-lg h-[450px] lg:h-[550px] object-cover object-top rounded-3xl"
                />
              ) : (
                <div className="relative z-10 w-full max-w-md mx-auto lg:max-w-lg h-[450px] lg:h-[550px] rounded-3xl bg-slate-100 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <span className="text-7xl">👨‍⚕️</span>
                    <p className="mt-3 text-sm">No hero image uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Card 1 - Expert Doctors */}
            <div className="absolute left-0 lg:-left-8 bottom-32 z-20">
              <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {defaultHeroContent.floatingCard1.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {defaultHeroContent.floatingCard1.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - 24/7 Support */}
            <div className="absolute right-4 lg:right-8 top-24 z-20">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}1A` }}
                >
                  <Clock
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                </div>
                <p className="font-semibold text-slate-800">
                  {defaultHeroContent.floatingCard2}
                </p>
              </div>
            </div>

            {/* Floating Card 3 - Advanced Technology */}
            <div className="absolute right-0 lg:right-4 bottom-12 z-20">
              <div
                className="rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`,
                }}
              >
                <Cpu className="w-5 h-5 text-white" />
                <p className="font-semibold text-white text-sm">
                  Expert Doctors, Advanced Technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================

interface StatsSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function StatsSection({ blueprint, colors, isEditMode }: StatsSectionProps) {
  const stats =
    blueprint.hero.stats ||
    defaultStats.map((s) => ({ value: s.value, label: s.label }));

  return (
    <section className="relative z-10 -mt-16 mb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.slice(0, 4).map((stat, index) => {
              const defaultStat = defaultStats[index];
              const Icon = iconMap[defaultStat?.icon || "Heart"];
              return (
                <div key={index} className="text-center group">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(to bottom right, ${colors.lightBg}, ${colors.primary}1A)`,
                    }}
                  >
                    <div style={{ color: colors.primary }}>
                      <Icon className="w-7 h-7" strokeWidth={2} />
                    </div>
                  </div>
                  <h3
                    className="text-3xl lg:text-4xl font-bold mb-1"
                    style={{ color: colors.primary }}
                  >
                    {isEditMode ? (
                      <EditableText
                        value={stat.value}
                        onChange={(val) => {
                          const updatedStats = [...stats];
                          updatedStats[index] = {
                            ...updatedStats[index],
                            value: val,
                          };
                          blueprint.hero.stats = updatedStats;
                        }}
                        as="span"
                        placeholder="Value"
                        editIndicator="icon"
                      />
                    ) : (
                      stat.value
                    )}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {isEditMode ? (
                      <EditableText
                        value={stat.label}
                        onChange={(val) => {
                          const updatedStats = [...stats];
                          updatedStats[index] = {
                            ...updatedStats[index],
                            label: val,
                          };
                          blueprint.hero.stats = updatedStats;
                        }}
                        as="span"
                        placeholder="Label"
                        editIndicator="icon"
                      />
                    ) : (
                      stat.label
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TRUST SECTION
// ============================================================================

interface TrustSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function TrustSection({ blueprint, colors, isEditMode }: TrustSectionProps) {
  const differentiators =
    blueprint.differentiators ||
    defaultTrustReasons.map((r) => ({
      title: r.title,
      description: r.description,
      icon: r.icon,
    }));

  return (
    <section
      id="about"
      className="py-20"
      style={{
        background: `linear-gradient(to bottom, white, ${colors.lightBg}30)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            <EditableText
              value={blueprint.about?.title || "Why Patients Trust Us"}
              onChange={(val) => {
                const currentAbout = blueprint.about || {
                  title: "",
                  subtitle: "",
                  description: "",
                  highlights: [],
                };
                blueprint.about = { ...currentAbout, title: val };
              }}
              as="span"
              placeholder="Section Title"
              editIndicator="icon"
            />
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            <EditableText
              value={
                blueprint.about?.description ||
                "We combine expertise, technology, and compassion to deliver exceptional healthcare experiences."
              }
              onChange={(val) => {
                const currentAbout = blueprint.about || {
                  title: "",
                  subtitle: "",
                  description: "",
                  highlights: [],
                };
                blueprint.about = { ...currentAbout, description: val };
              }}
              as="span"
              placeholder="Section Description"
              editIndicator="icon"
            />
          </p>
        </div>

        {/* Trust Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {differentiators.slice(0, 3).map((reason, index) => {
            const defaultReason = defaultTrustReasons[index];
            const Icon = iconMap[defaultReason?.icon || "Heart"];
            return (
              <div key={index} className="group">
                <div
                  className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300 h-full border border-slate-100"
                  style={{
                    borderColor: colors.border,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
                      boxShadow: `0 10px 25px -5px ${colors.primary}40`,
                    }}
                  >
                    <div style={{ color: "white" }}>
                      <Icon className="w-8 h-8" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {isEditMode ? (
                      <EditableText
                        value={reason.title}
                        onChange={(val) => {
                          const updated = [...differentiators];
                          updated[index] = { ...updated[index], title: val };
                          blueprint.differentiators = updated;
                        }}
                        as="span"
                        placeholder="Feature Title"
                        editIndicator="icon"
                      />
                    ) : (
                      reason.title
                    )}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {isEditMode ? (
                      <EditableText
                        value={reason.description}
                        onChange={(val) => {
                          const updated = [...differentiators];
                          updated[index] = {
                            ...updated[index],
                            description: val,
                          };
                          blueprint.differentiators = updated;
                        }}
                        as="span"
                        placeholder="Feature Description"
                        editIndicator="icon"
                      />
                    ) : (
                      reason.description
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SPECIALTIES SECTION
// ============================================================================

interface SpecialtiesSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function SpecialtiesSection({
  blueprint,
  colors,
  isEditMode,
}: SpecialtiesSectionProps) {
  const specialties =
    blueprint.specialties ||
    defaultSpecialties.map((s) => ({
      title: s.name,
      description: "",
      icon: s.icon,
    }));

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Comprehensive Medical Specialties
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Expert care across all major medical disciplines with advanced
            treatment options.
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {specialties.slice(0, 6).map((specialty, index) => {
            const defaultSpec = defaultSpecialties[index];
            const Icon = iconMap[defaultSpec?.icon || "Heart"];
            return (
              <div key={index} className="group cursor-pointer">
                <div
                  className="bg-white rounded-3xl p-8 border-2 transition-all duration-300 text-center shadow-sm hover:shadow-xl"
                  style={{
                    borderColor: colors.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px ${colors.primary}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
                    style={{
                      background: `linear-gradient(to bottom right, ${colors.lightBg}, ${colors.primary}1A)`,
                    }}
                  >
                    <div
                      className="transition-colors duration-300"
                      style={{ color: colors.primary }}
                    >
                      <Icon className="w-8 h-8" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 transition-colors duration-300">
                    {isEditMode ? (
                      <EditableText
                        value={specialty.title || "Specialty"}
                        onChange={(val) => {
                          const updated = [...specialties];
                          updated[index] = { ...updated[index], title: val };
                          blueprint.specialties = updated;
                        }}
                        as="span"
                        placeholder="Specialty Name"
                        editIndicator="icon"
                      />
                    ) : (
                      specialty.title
                    )}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DOCTORS SECTION
// ============================================================================

interface DoctorsSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function DoctorsSection({
  blueprint,
  colors,
  isEditMode,
}: DoctorsSectionProps) {
  const doctors =
    blueprint.doctors ||
    defaultDoctors.map((d) => ({
      name: d.name,
      specialty: d.specialty,
      description: d.qualification,
      photo: null,
    }));

  return (
    <section
      id="doctors"
      className="py-20"
      style={{
        background: `linear-gradient(to bottom, ${colors.lightBg}30, white)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="font-semibold text-sm tracking-wider uppercase mb-3 block"
            style={{ color: colors.primary }}
          >
            Meet Our Medical Specialists
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Trusted Doctors at Your Service
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Our team of experienced physicians is dedicated to providing
            exceptional care.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.slice(0, 4).map((doctor, index) => {
            const defaultDoc = defaultDoctors[index];
            return (
              <div key={index} className="group">
                <div
                  className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300 border border-slate-100"
                  style={{
                    borderColor: colors.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${colors.primary}33`;
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px ${colors.primary}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    {isEditMode ? (
                      <AvatarUploader
                        value={doctor.photo || null}
                        onChange={(uploadedData) => {
                          if (uploadedData) {
                            const updated = [...doctors];
                            updated[index] = {
                              ...updated[index],
                              photo: uploadedData,
                            };
                            blueprint.doctors = updated;
                          }
                        }}
                        placeholder="Upload doctor photo"
                        className="w-full h-64"
                      />
                    ) : doctor.photo?.previewUrl ? (
                      <>
                        <img
                          src={doctor.photo.previewUrl}
                          alt={doctor.name}
                          className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-64 bg-slate-100 flex items-center justify-center">
                        <div className="text-center text-slate-400">
                          <span className="text-5xl">👨‍⚕️</span>
                          <p className="mt-2 text-xs">No photo uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {isEditMode ? (
                        <EditableText
                          value={doctor.name}
                          onChange={(val) => {
                            const updated = [...doctors];
                            updated[index] = { ...updated[index], name: val };
                            blueprint.doctors = updated;
                          }}
                          as="span"
                          placeholder="Doctor Name"
                          editIndicator="icon"
                        />
                      ) : (
                        doctor.name
                      )}
                    </h3>
                    <p
                      className="font-medium text-sm mb-1"
                      style={{ color: colors.primary }}
                    >
                      {isEditMode ? (
                        <EditableText
                          value={doctor.specialty}
                          onChange={(val) => {
                            const updated = [...doctors];
                            updated[index] = {
                              ...updated[index],
                              specialty: val,
                            };
                            blueprint.doctors = updated;
                          }}
                          as="span"
                          placeholder="Specialty"
                          editIndicator="icon"
                        />
                      ) : (
                        doctor.specialty
                      )}
                    </p>
                    <p className="text-slate-400 text-sm mb-4">
                      {isEditMode ? (
                        <EditableText
                          value={doctor.description || ""}
                          onChange={(val) => {
                            const updated = [...doctors];
                            updated[index] = {
                              ...updated[index],
                              description: val,
                            };
                            blueprint.doctors = updated;
                          }}
                          as="span"
                          placeholder="Qualification"
                          editIndicator="icon"
                        />
                      ) : (
                        doctor.description
                      )}
                    </p>
                    <button
                      className="w-full text-sm py-2 rounded-xl font-medium transition-all duration-300"
                      style={{
                        backgroundColor: `${colors.primary}0D`,
                        color: colors.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary;
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.primary}0D`;
                        e.currentTarget.style.color = colors.primary;
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FACILITIES SECTION
// ============================================================================

interface FacilitiesSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function FacilitiesSection({
  blueprint,
  colors,
  isEditMode,
  onImageUpdate,
}: FacilitiesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            State-of-the-Art Infrastructure
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            World-class facilities designed for your comfort and optimal medical
            outcomes.
          </p>
        </div>

        {/* Facilities */}
        <div className="space-y-20">
          {defaultFacilities.map((facility, index) => (
            <div
              key={facility.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative group">
                  <div
                    className="absolute inset-0 rounded-3xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
                    }}
                  />
                  {isEditMode ? (
                    <div className="relative rounded-3xl overflow-hidden shadow-xl">
                      <FacilityImageUploader
                        value={
                          blueprint.images?.facilityImages?.[index] || null
                        }
                        onChange={(img) => {
                          const facilityImages =
                            blueprint.images?.facilityImages || [];
                          if (img) {
                            facilityImages[index] = img;
                          } else {
                            facilityImages[index] =
                              undefined as unknown as UploadedImageData;
                          }
                          onImageUpdate({
                            facilityImages: facilityImages.filter(Boolean),
                          });
                        }}
                        className="w-full h-[350px]"
                      />
                    </div>
                  ) : blueprint.images?.facilityImages?.[index]?.previewUrl ? (
                    <img
                      src={blueprint.images.facilityImages[index].previewUrl}
                      alt={facility.title}
                      className="relative rounded-3xl w-full h-[350px] object-cover shadow-xl"
                    />
                  ) : (
                    <div className="relative rounded-3xl w-full h-[350px] bg-slate-100 shadow-xl flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <span className="text-6xl">🏥</span>
                        <p className="mt-3 text-sm">No facility image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-800">
                    Trusted Care During Admission
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Our dedicated care teams ensure seamless admission processes
                    with comprehensive support.
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-800">
                      Expert Monitoring
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-slate-600">
                          Safe, clean, and caring hospital premises
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-slate-600">
                          Professional treatment with full-time medical support
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-slate-600">
                          Continuous care by experienced doctors and nurses
                        </span>
                      </li>
                    </ul>
                  </div>

                  <button
                    className="px-8 py-3 font-medium rounded-xl shadow-lg transition-all duration-300 text-white"
                    style={{
                      backgroundColor: colors.primary,
                      boxShadow: `0 10px 25px -5px ${colors.primary}40`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 20px 25px -5px ${colors.primary}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 10px 25px -5px ${colors.primary}40`;
                    }}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// APPOINTMENT SECTION
// ============================================================================

interface AppointmentSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function AppointmentSection({ blueprint, colors }: AppointmentSectionProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    department: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment request:", formData);
    // Reset form
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      department: "",
      date: "",
    });
    alert("Thank you! We will contact you within 24 hours.");
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Schedule a Consultation
            </h2>
            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: `${colors.lightBg}` }}
            >
              Our team will contact you within 24 hours to confirm your
              appointment and answer any questions.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className="w-6 h-6"
                  style={{ color: `${colors.lightBg}CC` }}
                />
                <span style={{ color: `${colors.lightBg}F0` }}>
                  Free initial consultation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className="w-6 h-6"
                  style={{ color: `${colors.lightBg}CC` }}
                />
                <span style={{ color: `${colors.lightBg}F0` }}>
                  Expert medical advice
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className="w-6 h-6"
                  style={{ color: `${colors.lightBg}CC` }}
                />
                <span style={{ color: `${colors.lightBg}F0` }}>
                  Flexible scheduling options
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">
                Book Your Appointment
              </h3>
              <p className="text-sm" style={{ color: `${colors.lightBg}` }}>
                Fill out the form and our care coordinator will reach out to
                schedule your visit at a convenient time.
              </p>
            </div>
          </div>

          {/* Right - Form Card */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                      required
                      style={{
                        borderColor: colors.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                      required
                      style={{
                        borderColor: colors.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                      style={{
                        borderColor: colors.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                      style={{
                        borderColor: colors.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    >
                      <option value="">Select department</option>
                      {defaultDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                    style={{
                      borderColor: colors.border,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-6 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 text-white"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 10px 25px -5px ${colors.primary}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 20px 25px -5px ${colors.primary}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 10px 25px -5px ${colors.primary}40`;
                  }}
                >
                  Request Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

interface TestimonialsSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function TestimonialsSection({
  blueprint,
  colors,
  isEditMode,
}: TestimonialsSectionProps) {
  const testimonials =
    blueprint.testimonials ||
    defaultTestimonials.map((t) => ({
      quote: t.quote,
      patient: t.author,
      procedure: "",
      rating: t.rating,
    }));

  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(to bottom, white, ${colors.lightBg}30)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Real stories from patients who experienced our care firsthand.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="group">
              <div
                className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300 h-full border border-slate-100 relative"
                style={{
                  borderColor: colors.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary}33`;
                  e.currentTarget.style.boxShadow = `0 25px 50px -12px ${colors.primary}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 right-8">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
                      boxShadow: `0 10px 25px -5px ${colors.primary}50`,
                    }}
                  >
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="text-slate-600 leading-relaxed mb-6 text-lg">
                  &ldquo;
                  {isEditMode ? (
                    <EditableText
                      value={testimonial.quote}
                      onChange={(val) => {
                        const updated = [...testimonials];
                        updated[index] = { ...updated[index], quote: val };
                        blueprint.testimonials = updated;
                      }}
                      as="span"
                      placeholder="Testimonial Quote"
                      editIndicator="icon"
                      multiline
                    />
                  ) : (
                    testimonial.quote
                  )}
                  &rdquo;
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to bottom right, ${colors.lightBg}, ${colors.primary}33)`,
                    }}
                  >
                    <span
                      className="font-bold text-lg"
                      style={{ color: colors.primaryDark }}
                    >
                      {testimonial.patient?.charAt(0) || "P"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {isEditMode ? (
                        <EditableText
                          value={testimonial.patient || "Patient Name"}
                          onChange={(val) => {
                            const updated = [...testimonials];
                            updated[index] = {
                              ...updated[index],
                              patient: val,
                            };
                            blueprint.testimonials = updated;
                          }}
                          as="span"
                          placeholder="Patient Name"
                          editIndicator="icon"
                        />
                      ) : (
                        testimonial.patient
                      )}
                    </p>
                    <p className="text-sm text-slate-500">Verified Patient</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BLOG/SOCIAL MEDIA SECTION
// ============================================================================

interface BlogSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (blogPosts: TemplateBlueprint["blogPosts"]) => void;
}

function BlogSection({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: BlogSectionProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState<{
    [key: string]: number;
  }>({});

  const blogPosts = blueprint.blogPosts || [
    {
      id: "blog-1",
      title: "Community Health Initiatives 2024",
      excerpt:
        "Our commitment to community wellness through free health camps and awareness programs.",
      date: "2024-01-18",
      author: "Dr. Priya Sharma",
      category: "Community Health",
      images: [],
      featured: true,
    },
    {
      id: "blog-2",
      title: "Managing Diabetes Effectively",
      excerpt:
        "Expert endocrinologists share tips for blood sugar management and lifestyle modifications.",
      date: "2024-01-14",
      author: "Dr. Rajesh Kumar",
      category: "Diabetes Care",
      images: [],
      featured: false,
    },
    {
      id: "blog-3",
      title: "Women's Health: Breaking Barriers",
      excerpt:
        "Comprehensive women's health services and the importance of regular screenings.",
      date: "2024-01-06",
      author: "Dr. Meera Patel",
      category: "Women's Health",
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
    <section
      className="py-16 lg:py-20"
      style={{ backgroundColor: colors.white }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: colors.lightBg,
              color: colors.primary,
            }}
          >
            Blog & Updates
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Health <span style={{ color: colors.primary }}>Insights</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Expert health tips, medical news, and wellness advice from our
            specialists.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, postIndex) => {
            const currentImageIndex = currentCarouselIndex[post.id] || 0;
            const validImages = (post.images || []).filter(
              (img) => img.previewUrl
            );

            return (
              <article
                key={post.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                }}
              >
                {/* Image Carousel */}
                <div className="relative h-48 bg-gradient-to-br from-teal-50 to-emerald-50 overflow-hidden">
                  {validImages.length > 0 ? (
                    <>
                      <img
                        src={
                          validImages[currentImageIndex % validImages.length]
                            ?.previewUrl
                        }
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {validImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              prevImage(post.id, validImages.length)
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() =>
                              nextImage(post.id, validImages.length)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ›
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {validImages.map((_, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  setCurrentCarouselIndex((prev) => ({
                                    ...prev,
                                    [post.id]: i,
                                  }))
                                }
                                className={cn(
                                  "w-2 h-2 rounded-full transition-all",
                                  i === currentImageIndex % validImages.length
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
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}15` }}
                      >
                        <Sparkles
                          className="w-8 h-8"
                          style={{ color: colors.primary }}
                        />
                      </div>
                    </div>
                  )}
                  {post.featured && (
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Featured
                    </span>
                  )}
                  <span
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
                  </span>
                </div>

                {/* Edit Mode: Image Controls */}
                {isEditMode && (
                  <div
                    className="px-4 py-2.5 border-b flex flex-wrap gap-2 items-center"
                    style={{ borderColor: colors.border }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      Images ({(post.images || []).length}/5):
                    </span>
                    {(post.images || []).map((img, imgIndex) => (
                      <div key={imgIndex} className="relative group/thumb">
                        {img.previewUrl ? (
                          <div
                            className="w-9 h-9 rounded-lg overflow-hidden border-2"
                            style={{ borderColor: colors.border }}
                          >
                            <img
                              src={img.previewUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(post.id, imgIndex)}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label
                            className="w-9 h-9 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                            style={{ borderColor: colors.border }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file)
                                  handleImageUpload(post.id, imgIndex, file);
                              }}
                            />
                            <span className="text-gray-400 text-lg">+</span>
                          </label>
                        )}
                      </div>
                    ))}
                    {(post.images || []).length < 5 && (
                      <button
                        onClick={() => addNewImageSlot(post.id)}
                        className="w-9 h-9 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors"
                        style={{
                          borderColor: colors.primary,
                          color: colors.primary,
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <div
                    className="flex items-center gap-2 text-sm mb-3"
                    style={{ color: colors.textSecondary }}
                  >
                    <Clock className="w-4 h-4" />
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
                      placeholder="Author"
                      editIndicator="none"
                    />
                  </div>
                  <h3
                    className="font-bold text-lg mb-2 line-clamp-2"
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
                  <p
                    className="text-sm line-clamp-2 mb-4"
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
                      placeholder="Brief description"
                      editIndicator="none"
                    />
                  </p>
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

        {/* Add Post Button (Edit Mode) */}
        {isEditMode && blogPosts.length < 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                const newPost = {
                  id: `blog-${Date.now()}`,
                  title: "New Blog Post",
                  excerpt: "Add a description for your blog post here...",
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
        <div className="mt-10 text-center">
          <button
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
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
// FOOTER SECTION
// ============================================================================

interface FooterSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function FooterSection({ blueprint, colors, isEditMode }: FooterSectionProps) {
  const footerData = blueprint.footer || {
    tagline: defaultSiteInfo.tagline,
    copyright: `© ${new Date().getFullYear()} ${
      defaultSiteInfo.name
    }. All Rights Reserved.`,
    contact: {
      phone: defaultSiteInfo.phone,
      email: defaultSiteInfo.email,
      location: defaultSiteInfo.address,
    },
  };

  return (
    <footer className="text-white" style={{ backgroundColor: "#264653" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
                }}
              >
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">{defaultSiteInfo.name}</span>
            </div>
            <div className="text-slate-300 leading-relaxed mb-6">
              {isEditMode ? (
                <EditableText
                  value={footerData.tagline || "Excellence in Healthcare"}
                  onChange={(val) => {
                    const currentFooter = blueprint.footer || {
                      tagline: "",
                      copyright: "",
                      contact: { phone: "", email: "", location: "" },
                    };
                    blueprint.footer = { ...currentFooter, tagline: val };
                  }}
                  as="span"
                  placeholder="Footer Tagline"
                  editIndicator="icon"
                />
              ) : (
                footerData.tagline
              )}
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-teal-500 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-teal-500 transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-teal-500 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-teal-500 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {defaultFooterLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-teal-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <span className="text-slate-300">
                  {isEditMode ? (
                    <EditableText
                      value={
                        typeof footerData.contact === "object" &&
                        "location" in footerData.contact
                          ? footerData.contact.location
                          : defaultSiteInfo.address
                      }
                      onChange={(val) => {
                        const currentFooter = blueprint.footer || {
                          tagline: "",
                          copyright: "",
                          contact: { phone: "", email: "", location: "" },
                        };
                        const currentContact =
                          typeof currentFooter.contact === "object"
                            ? currentFooter.contact
                            : { phone: "", email: "", location: "" };
                        blueprint.footer = {
                          ...currentFooter,
                          contact: { ...currentContact, location: val },
                        };
                      }}
                      as="span"
                      placeholder="Address"
                      editIndicator="icon"
                      multiline
                    />
                  ) : typeof footerData.contact === "object" &&
                    "location" in footerData.contact ? (
                    footerData.contact.location
                  ) : (
                    defaultSiteInfo.address
                  )}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <a
                  href={`tel:${
                    typeof footerData.contact === "object" &&
                    "phone" in footerData.contact
                      ? footerData.contact.phone
                      : defaultSiteInfo.phone
                  }`}
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  {isEditMode ? (
                    <EditableText
                      value={
                        typeof footerData.contact === "object" &&
                        "phone" in footerData.contact
                          ? footerData.contact.phone
                          : defaultSiteInfo.phone
                      }
                      onChange={(val) => {
                        const currentFooter = blueprint.footer || {
                          tagline: "",
                          copyright: "",
                          contact: { phone: "", email: "", location: "" },
                        };
                        const currentContact =
                          typeof currentFooter.contact === "object"
                            ? currentFooter.contact
                            : { phone: "", email: "", location: "" };
                        blueprint.footer = {
                          ...currentFooter,
                          contact: { ...currentContact, phone: val },
                        };
                      }}
                      as="span"
                      placeholder="Phone"
                      editIndicator="icon"
                    />
                  ) : typeof footerData.contact === "object" &&
                    "phone" in footerData.contact ? (
                    footerData.contact.phone
                  ) : (
                    defaultSiteInfo.phone
                  )}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <a
                  href={`mailto:${
                    typeof footerData.contact === "object" &&
                    "email" in footerData.contact
                      ? footerData.contact.email
                      : defaultSiteInfo.email
                  }`}
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  {isEditMode ? (
                    <EditableText
                      value={
                        typeof footerData.contact === "object" &&
                        "email" in footerData.contact
                          ? footerData.contact.email
                          : defaultSiteInfo.email
                      }
                      onChange={(val) => {
                        const currentFooter = blueprint.footer || {
                          tagline: "",
                          copyright: "",
                          contact: { phone: "", email: "", location: "" },
                        };
                        const currentContact =
                          typeof currentFooter.contact === "object"
                            ? currentFooter.contact
                            : { phone: "", email: "", location: "" };
                        blueprint.footer = {
                          ...currentFooter,
                          contact: { ...currentContact, email: val },
                        };
                      }}
                      as="span"
                      placeholder="Email"
                      editIndicator="icon"
                    />
                  ) : typeof footerData.contact === "object" &&
                    "email" in footerData.contact ? (
                    footerData.contact.email
                  ) : (
                    defaultSiteInfo.email
                  )}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay In Touch</h3>
            <p className="text-slate-300 mb-4 text-sm">
              Subscribe to our newsletter for health tips and updates.
            </p>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing!");
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-xl px-4 py-3 focus:border-teal-400 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full rounded-xl font-medium transition-all duration-300 py-3 text-white"
                style={{
                  backgroundColor: colors.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 {defaultSiteInfo.name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
