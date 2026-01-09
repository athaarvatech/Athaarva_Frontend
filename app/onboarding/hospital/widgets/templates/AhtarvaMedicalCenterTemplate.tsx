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
import { EditableText } from "../EditableText";
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
  Play,
  Clock,
  Check,
  ArrowRight,
  Heart,
  Brain,
  Bone,
  Microscope,
  Baby,
  Sparkles,
  Send,
  Award,
  ChevronDown,
  FileText,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AhtarvaMedicalCenterTemplateProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (updatedBlueprint: TemplateBlueprint) => void;
  isEditMode?: boolean;
  showBanner?: boolean;
  useResponsive?: boolean; // When true, uses actual responsive CSS instead of scaling
}

interface ColorScheme {
  primary: string; // Teal #0d9488
  primaryDark: string; // Slate #0F172A
  textPrimary: string; // #0f172a
  textSecondary: string; // #64748b
  lightBg: string; // #F8FAFC
  white: string; // #FFFFFF
  border: string; // #E2E8F0
  accent: string; // #f0fdfa (teal-50)
}

// ============================================================================
// MOCK DATA (Inline for template use)
// ============================================================================

const defaultNavLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Doctors", href: "#doctors" },
  { name: "Contact", href: "#contact" },
];

const defaultStats = [
  { value: "25+", label: "Years Experience" },
  { value: "150+", label: "Expert Doctors" },
  { value: "1M+", label: "Patients Served" },
  { value: "40+", label: "Departments" },
];

const defaultFeatures = [
  {
    title: "Cutting-Edge Technology",
    description: "State-of-the-art medical equipment and diagnostic facilities",
  },
  {
    title: "World-Class Experts",
    description: "Board-certified specialists with international experience",
  },
  {
    title: "Compassionate Care",
    description: "Patient-centered approach with personalized treatment plans",
  },
];

const defaultSpecialties = [
  {
    id: 1,
    title: "Cardiology",
    description:
      "Comprehensive heart care with advanced cardiac interventions and surgeries.",
    icon: "Heart",
  },
  {
    id: 2,
    title: "Neurology",
    description:
      "Expert care for brain and nervous system disorders using latest technologies.",
    icon: "Brain",
  },
  {
    id: 3,
    title: "Orthopedics",
    description:
      "Joint replacements, sports medicine, and spine care by skilled surgeons.",
    icon: "Bone",
  },
  {
    id: 4,
    title: "Oncology",
    description:
      "Multidisciplinary cancer treatment with cutting-edge therapies.",
    icon: "Microscope",
  },
  {
    id: 5,
    title: "Pediatrics",
    description:
      "Dedicated child healthcare from newborn care to adolescent medicine.",
    icon: "Baby",
  },
  {
    id: 6,
    title: "Dermatology",
    description: "Complete skin care solutions including cosmetic dermatology.",
    icon: "Sparkles",
  },
];

const defaultDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    specialty: "CARDIOLOGIST",
    experience: "18 years experience",
    // image: "", // Removed hardcoded image - users will upload their own
  },
  {
    id: 2,
    name: "Dr. James Chen",
    specialty: "NEUROLOGIST",
    experience: "15 years experience",
    // image: "", // Removed hardcoded image - users will upload their own
  },
  {
    id: 3,
    name: "Dr. Emily Parker",
    specialty: "ONCOLOGIST",
    experience: "12 years experience",
    // image: "", // Removed hardcoded image - users will upload their own
  },
  {
    id: 4,
    name: "Dr. Michael Roberts",
    specialty: "ORTHOPEDIC SURGEON",
    experience: "20 years experience",
    // image: "", // Removed hardcoded image - users will upload their own
  },
];

const defaultContactInfo = {
  phone: "+1 (555) 123-4567",
  email: "appointments@ahtarva.com",
  address: "123 Healthcare Boulevard, Medical District, NY 10001",
};

const defaultFooterLinks = {
  quickLinks: [
    { name: "About Us", href: "#about" },
    { name: "Our Doctors", href: "#doctors" },
    { name: "Careers", href: "#" },
    { name: "News & Updates", href: "#" },
  ],
  services: [
    { name: "Emergency Care", href: "#" },
    { name: "Health Checkup", href: "#" },
    { name: "Lab Services", href: "#" },
    { name: "Pharmacy", href: "#" },
  ],
  contact: [
    { name: "Contact Us", href: "#contact" },
    { name: "Patient Portal", href: "#" },
    { name: "Insurance", href: "#" },
    { name: "FAQs", href: "#" },
  ],
};

// ============================================================================
// ICON MAP
// ============================================================================

const iconMap: Record<
  string,
  React.FC<{ size?: number; className?: string; strokeWidth?: number }>
> = {
  Heart: Heart,
  Brain: Brain,
  Bone: Bone,
  Microscope: Microscope,
  Baby: Baby,
  Sparkles: Sparkles,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AhtarvaMedicalCenterTemplate - Elegant, modern hospital template
 * Based on Athh-Frontend with Merriweather serif headings, teal accents, and smooth animations
 * Features: Full-screen hero, stats strip, about section, specialties grid, doctors, appointment form, footer
 */
export function AhtarvaMedicalCenterTemplate({
  blueprint,
  device,
  onBlueprintChange,
  isEditMode = false,
  showBanner = true,
  useResponsive = false,
}: AhtarvaMedicalCenterTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Color scheme - Use blueprint palette with fallback to Teal
  const colors: ColorScheme = {
    primary: blueprint.palette?.accent || "#0d9488",
    primaryDark: blueprint.palette?.text || "#0F172A",
    textPrimary: blueprint.palette?.text || "#0f172a",
    textSecondary: blueprint.palette?.textMuted || "#64748b",
    lightBg: blueprint.palette?.background || "#F8FAFC",
    white: "#FFFFFF",
    border: "#E2E8F0",
    accent: blueprint.palette?.accentMuted || "#f0fdfa",
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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=Sora:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600&family=Open+Sans:wght@400;600&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Global Styles */}
      <style jsx global>{`
        .font-serif {
          font-family: "Merriweather", Georgia, "Times New Roman", serif;
        }
        html {
          scroll-behavior: smooth;
        }
        ::selection {
          background-color: #0d9488;
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

      {/* Navbar */}
      <NavbarSection
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

      {/* Stats Strip */}
      <StatsStripSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(stats) => updateHero({ stats })}
      />

      {/* About Section */}
      <AboutSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(about) => updateBlueprint("about", about)}
        onImageUpdate={updateImages}
      />

      {/* Specialties Section */}
      <SpecialtiesSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(specialties) => updateBlueprint("specialties", specialties)}
      />

      {/* Doctors Section */}
      <DoctorsSection
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={(doctors) => updateBlueprint("doctors", doctors)}
      />

      {/* Appointment Section */}
      <AppointmentSection
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
        onUpdate={(footer) => updateBlueprint("footer", footer)}
      />
    </div>
  );
}

// ============================================================================
// NAVBAR SECTION
// ============================================================================

interface NavbarSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function NavbarSection({
  blueprint,
  // colors and isEditMode kept for future use
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarSectionProps) {
  const [scrolled, setScrolled] = useState(false);
  const [licenseDropdownOpen, setLicenseDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const licenses = blueprint.licenses || [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <span
              className={`font-serif text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              <EditableText
                value={blueprint.hero.title?.split(" ")[0] || "Ahtarva"}
                onChange={() => {}}
                as="span"
                placeholder="Hospital Name"
                editIndicator="icon"
              />{" "}
              Medical Center
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {defaultNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:opacity-70 ${
                  scrolled ? "text-slate-700" : "text-white/90"
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
                  className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 hover:opacity-70 ${
                    scrolled ? "text-slate-700" : "text-white/90"
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
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="#contact"
              className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                scrolled
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-white text-slate-900 hover:bg-white/90"
              }`}
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg rounded-b-2xl mx-4 p-6">
          <div className="flex flex-col gap-4">
            {defaultNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 font-medium py-2 hover:text-slate-900"
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile License Links */}
            {licenses.length > 0 && (
              <div className="border-t border-slate-100 pt-4 mt-2">
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
            
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-slate-900 text-white text-center py-3 rounded-xl font-medium mt-2"
            >
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </nav>
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
  const heroImage = blueprint.images?.heroImage;
  // const defaultHeroImage = ""; // Removed hardcoded image - users will upload their own

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {isEditMode ? (
          <HeroImageUploader
            value={heroImage || null}
            onChange={(img) => onImageUpdate({ heroImage: img || undefined })}
            className="w-full h-full"
          />
        ) : heroImage?.previewUrl ? (
          <img
            src={heroImage.previewUrl}
            alt="Doctor consulting with patient"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <span className="text-6xl">🏥</span>
              <p className="mt-2 text-sm">Upload Hero Image</p>
            </div>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 min-h-screen flex items-end pb-40">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-white/80 uppercase mb-6">
            <EditableText
              value={blueprint.hero.eyebrow || "Welcome to Ahtarva"}
              onChange={(eyebrow) => onUpdate({ eyebrow })}
              as="span"
              placeholder="Tagline"
              editIndicator="icon"
            />
          </span>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            <EditableText
              value={
                blueprint.hero.title ||
                "Exceptional Care for a Healthier Community"
              }
              onChange={(title) => onUpdate({ title })}
              as="span"
              placeholder="Headline"
              editIndicator="icon"
              multiline
            />
          </h1>

          <div className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
            <EditableText
              value={
                blueprint.hero.subtitle ||
                "Experience world-class healthcare with our team of 150+ specialists dedicated to your well-being and recovery."
              }
              onChange={(subtitle) => onUpdate({ subtitle })}
              as="span"
              placeholder="Subtitle"
              editIndicator="icon"
              multiline
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#doctors"
              className="px-8 py-4 bg-white text-slate-900 font-medium rounded-xl hover:bg-white/90 transition-all duration-300 shadow-xl shadow-black/10"
            >
              Find a Doctor
            </a>
            <button className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <span className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                <Play size={16} fill="white" className="text-white ml-0.5" />
              </span>
              Watch Video
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS STRIP SECTION
// ============================================================================

interface StatsStripSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (stats: Array<{ value: string; label: string }>) => void;
}

function StatsStripSection({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: StatsStripSectionProps) {
  const stats = blueprint.hero.stats || defaultStats;

  return (
    <div className="relative z-20 -mt-20 mx-4 lg:mx-auto max-w-6xl">
      <div className="bg-white rounded-t-2xl shadow-2xl shadow-slate-900/10">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-8 lg:p-10 text-center ${
                index < stats.length - 1 ? "border-r border-slate-100" : ""
              } ${index < 2 ? "border-b lg:border-b-0 border-slate-100" : ""}`}
            >
              <div className="font-serif text-3xl lg:text-4xl text-slate-900 mb-2">
                <EditableText
                  value={stat.value}
                  onChange={(value) => {
                    const updated = [...stats];
                    updated[index] = { ...stat, value };
                    onUpdate(updated);
                  }}
                  as="span"
                  placeholder="Value"
                  editIndicator="icon"
                />
              </div>
              <div className="text-sm text-slate-500 tracking-wide">
                <EditableText
                  value={stat.label}
                  onChange={(label) => {
                    const updated = [...stats];
                    updated[index] = { ...stat, label };
                    onUpdate(updated);
                  }}
                  as="span"
                  placeholder="Label"
                  editIndicator="icon"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ABOUT SECTION
// ============================================================================

interface AboutSectionProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (about: TemplateBlueprint["about"]) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
}

function AboutSection({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
  onImageUpdate,
}: AboutSectionProps) {
  const features = defaultFeatures;

  return (
    <section
      id="about"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Image */}
          <div className="relative">
            {isEditMode ? (
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-slate-900/5 h-[500px] lg:h-[600px]">
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
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-slate-900/5">
                <img
                  src={blueprint.images.facilityImages[0].previewUrl}
                  alt="Medical team"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-slate-900/5 bg-slate-100 flex items-center justify-center h-[500px] lg:h-[600px]">
                <div className="text-center text-slate-400">
                  <span className="text-7xl">🏥</span>
                  <p className="mt-3 text-sm">No image uploaded yet</p>
                </div>
              </div>
            )}

            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-4 lg:right-8 bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center gap-4">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-xl"
                style={{ backgroundColor: colors.accent }}
              >
                <Clock style={{ color: colors.primary }} size={24} />
              </div>
              <div>
                <div className="font-serif text-lg text-slate-900">
                  24/7 Emergency
                </div>
                <div className="text-sm text-slate-500">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: colors.primary }}
            >
              Why Choose Us
            </span>

            <h2 className="font-serif text-3xl lg:text-4xl text-slate-900 mt-4 mb-6 leading-tight">
              <EditableText
                value={
                  blueprint.about?.title || "Pioneering Healthcare Excellence"
                }
                onChange={(title) => {
                  const currentAbout = blueprint.about || {
                    title: "",
                    subtitle: "",
                    description: "",
                    highlights: [],
                  };
                  onUpdate({ ...currentAbout, title });
                }}
                as="span"
                placeholder="Section Title"
                editIndicator="icon"
              />
            </h2>

            <div className="text-slate-600 leading-loose mb-8">
              <EditableText
                value={
                  blueprint.about?.description ||
                  "At Ahtarva Medical Center, we combine cutting-edge medical technology with compassionate care. Our multidisciplinary team of specialists works together to provide comprehensive, personalized treatment plans that address each patient's unique needs."
                }
                onChange={(description) => {
                  const currentAbout = blueprint.about || {
                    title: "",
                    subtitle: "",
                    description: "",
                    highlights: [],
                  };
                  onUpdate({ ...currentAbout, description });
                }}
                as="span"
                placeholder="Description"
                editIndicator="icon"
                multiline
              />
            </div>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Check size={14} style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
  onUpdate: (specialties: TemplateBlueprint["specialties"]) => void;
}

function SpecialtiesSection({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: SpecialtiesSectionProps) {
  const specialties = blueprint.specialties?.slice(0, 6) || defaultSpecialties;

  return (
    <section id="services" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase"
            style={{ color: colors.primary }}
          >
            Our Services
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-slate-900 mt-4">
            Centers of Excellence
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty, index) => {
            const IconComponent = iconMap[specialty.icon || "Heart"];
            return (
              <div
                key={index}
                className="group p-8 bg-white border border-slate-100 rounded-xl transition-all duration-300 hover:border-teal-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors duration-300"
                  style={{ backgroundColor: colors.accent }}
                >
                  {IconComponent && (
                    <IconComponent
                      size={24}
                      className="text-teal-600"
                      strokeWidth={1.5}
                    />
                  )}
                </div>

                <h3 className="font-serif text-xl text-slate-900 mb-3">
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

                <div className="text-sm text-slate-500 leading-relaxed">
                  <EditableText
                    value={specialty.description}
                    onChange={(description) => {
                      const updated = [...specialties];
                      updated[index] = { ...specialty, description };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Description"
                    editIndicator="icon"
                  />
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
  onUpdate: (doctors: TemplateBlueprint["doctors"]) => void;
}

function DoctorsSection({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: DoctorsSectionProps) {
  const doctors =
    blueprint.doctors?.slice(0, 4) ||
    defaultDoctors.map((d) => ({
      name: d.name,
      specialty: d.specialty,
      description: d.experience,
      photo: undefined, // No default image - users will upload their own
    }));

  return (
    <section
      id="doctors"
      className="py-24 lg:py-32"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase"
            style={{ color: colors.primary }}
          >
            Our Team
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-slate-900 mt-4">
            Trusted Medical Professionals
          </h2>
        </div>

        {/* Doctors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-2xl mb-5">
                {isEditMode ? (
                  <AvatarUploader
                    value={doctor.photo || null}
                    onChange={(photo) => {
                      const updated = [...doctors];
                      updated[index] = { ...doctor, photo: photo || undefined };
                      onUpdate(updated);
                    }}
                    className="w-full h-[320px]"
                  />
                ) : doctor.photo?.previewUrl ? (
                  <img
                    src={doctor.photo.previewUrl}
                    alt={doctor.name}
                    className="w-full h-[320px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-[320px] bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-400">Upload Photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-serif text-lg text-slate-900 mb-1">
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
                <div
                  className="text-xs font-medium tracking-wider uppercase mb-1"
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
                </div>
                <div className="text-xs text-slate-400">
                  <EditableText
                    value={doctor.description || "Experience"}
                    onChange={(description) => {
                      const updated = [...doctors];
                      updated[index] = { ...doctor, description };
                      onUpdate(updated);
                    }}
                    as="span"
                    placeholder="Experience"
                    editIndicator="icon"
                  />
                </div>

                {/* View Profile Link */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group/link">
                    View Profile
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </span>
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

function AppointmentSection({
  blueprint,
  colors,
  isEditMode,
}: AppointmentSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your appointment request has been submitted.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      message: "",
    });
  };

  const contactInfo = blueprint.footer?.contact || defaultContactInfo;

  return (
    <section id="contact" className="py-24 lg:py-32 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: colors.primary }}
            >
              Get in Touch
            </span>

            <h2 className="font-serif text-3xl lg:text-4xl text-slate-900 mt-4 mb-6">
              Schedule Your Visit
            </h2>

            <p className="text-slate-600 leading-relaxed mb-10">
              Our dedicated team is here to help you. Book an appointment today
              or reach out with any questions.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm">
                  <Phone
                    size={20}
                    style={{ color: colors.primary }}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Phone
                  </div>
                  <div className="text-slate-900 font-medium">
                    {typeof contactInfo === "object" && "phone" in contactInfo
                      ? contactInfo.phone
                      : defaultContactInfo.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm">
                  <Mail
                    size={20}
                    style={{ color: colors.primary }}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <div className="text-slate-900 font-medium">
                    {typeof contactInfo === "object" && "email" in contactInfo
                      ? contactInfo.email
                      : defaultContactInfo.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm">
                  <MapPin
                    size={20}
                    style={{ color: colors.primary }}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Location
                  </div>
                  <div className="text-slate-900 font-medium max-w-xs">
                    {typeof contactInfo === "object" &&
                    "location" in contactInfo
                      ? contactInfo.location
                      : defaultContactInfo.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl shadow-slate-900/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="oncology">Oncology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="dermatology">Dermatology</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your condition or any specific requirements..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors duration-300"
                >
                  Book Appointment
                  <Send size={18} />
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
      title: "Advancements in Robotic Surgery",
      excerpt:
        "How our state-of-the-art robotic surgery systems are improving patient outcomes.",
      date: "2024-01-20",
      author: "Dr. Robert Williams",
      category: "Surgical Innovation",
      images: [],
      featured: true,
    },
    {
      id: "blog-2",
      title: "Nutrition and Healing",
      excerpt:
        "The critical role of proper nutrition in post-surgical recovery.",
      date: "2024-01-12",
      author: "Dr. Amanda Foster",
      category: "Nutrition",
      images: [],
      featured: false,
    },
    {
      id: "blog-3",
      title: "Preventive Care: Your First Defense",
      excerpt:
        "Regular health checkups can detect issues early. Learn about our screening programs.",
      date: "2024-01-08",
      author: "Dr. James Wilson",
      category: "Preventive Care",
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
      style={{ backgroundColor: colors.lightBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
            }}
          >
            Blog & Updates
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Latest Health Insights
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Stay informed with our latest medical news and expert health tips.
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
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                style={{ backgroundColor: colors.white }}
              >
                {/* Image Carousel */}
                <div className="relative h-44 bg-gradient-to-br from-teal-50 to-teal-100 overflow-hidden">
                  {validImages.length > 0 ? (
                    <>
                      <img
                        src={
                          validImages[currentImageIndex % validImages.length]
                            ?.previewUrl
                        }
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {validImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              prevImage(post.id, validImages.length)
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() =>
                              nextImage(post.id, validImages.length)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ›
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
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
                                  "w-1.5 h-1.5 rounded-full transition-all",
                                  i === currentImageIndex % validImages.length
                                    ? "bg-white w-3"
                                    : "bg-white/50"
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
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}20` }}
                      >
                        <Sparkles
                          className="w-7 h-7"
                          style={{ color: colors.primary }}
                        />
                      </div>
                    </div>
                  )}
                  {post.featured && (
                    <span
                      className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                {/* Edit Mode: Image Controls */}
                {isEditMode && (
                  <div
                    className="px-3 py-2 border-b flex flex-wrap gap-1.5 items-center"
                    style={{ borderColor: colors.border }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Images:
                    </span>
                    {(post.images || []).map((img, imgIndex) => (
                      <div key={imgIndex} className="relative group/thumb">
                        {img.previewUrl ? (
                          <div
                            className="w-8 h-8 rounded overflow-hidden border"
                            style={{ borderColor: colors.border }}
                          >
                            <img
                              src={img.previewUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(post.id, imgIndex)}
                              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover/thumb:opacity-100"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label
                            className="w-8 h-8 rounded border-2 border-dashed flex items-center justify-center cursor-pointer"
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
                            <span className="text-gray-400">+</span>
                          </label>
                        )}
                      </div>
                    ))}
                    {(post.images || []).length < 5 && (
                      <button
                        onClick={() => addNewImageSlot(post.id)}
                        className="w-8 h-8 rounded border-2 border-dashed flex items-center justify-center"
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
                <div className="p-4">
                  <div
                    className="flex items-center gap-2 text-xs mb-2"
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
                      placeholder="Author"
                      editIndicator="none"
                    />
                  </div>
                  <h3
                    className="font-bold text-lg mb-2"
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
                    className="text-sm line-clamp-2 mb-3"
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
                    className="flex items-center gap-1 text-sm font-semibold cursor-pointer"
                    style={{ color: colors.primary }}
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Add Post Button (Edit Mode) */}
        {isEditMode && blogPosts.length < 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const newPost = {
                  id: `blog-${Date.now()}`,
                  title: "New Blog Post",
                  excerpt: "Add a description here...",
                  date: new Date().toISOString().split("T")[0],
                  author: "Author Name",
                  category: "Health",
                  images: [],
                  featured: false,
                };
                onUpdate([...blogPosts, newPost]);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: `${colors.primary}10`,
                color: colors.primary,
                border: `2px dashed ${colors.primary}`,
              }}
            >
              + Add Blog Post
            </button>
          </div>
        )}
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
  onUpdate: (footer: TemplateBlueprint["footer"]) => void;
}

function FooterSection({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: FooterSectionProps) {
  const footerData = blueprint.footer || {
    contact: defaultContactInfo,
    quickLinks: defaultFooterLinks.quickLinks.map((l) => l.name),
  };

  const contactInfo =
    typeof footerData.contact === "object"
      ? footerData.contact
      : defaultContactInfo;

  // Type guard for contact info with location
  const getContactLocation = (): string => {
    if (
      contactInfo &&
      typeof contactInfo === "object" &&
      "location" in contactInfo
    ) {
      return (contactInfo as { location: string }).location;
    }
    return defaultContactInfo.address;
  };

  return (
    <footer
      style={{ backgroundColor: colors.primaryDark }}
      className="text-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl text-white mb-4">
              <EditableText
                value={blueprint.hero.title?.split(" ")[0] || "Ahtarva"}
                onChange={() => {}}
                as="span"
                placeholder="Hospital Name"
                editIndicator="icon"
              />{" "}
              Medical Center
            </h3>
            <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
              Compassion in Care. Dedicated to providing exceptional healthcare
              services with a human touch since 1999.
            </p>
            <div className="text-sm text-slate-500">
              <EditableText
                value={getContactLocation()}
                onChange={() => {
                  // Footer updates are handled through the parent component
                }}
                as="span"
                placeholder="Address"
                editIndicator="icon"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {defaultFooterLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-medium text-white mb-6">Services</h4>
            <ul className="space-y-4">
              {defaultFooterLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-white mb-6">For Patients</h4>
            <ul className="space-y-4">
              {defaultFooterLinks.contact.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Ahtarva Medical Center. All rights
              reserved.
            </p>
            <p className="flex items-center gap-2 text-slate-500 text-sm">
              Made with
              <Heart size={14} className="text-red-400" fill="currentColor" />
              Care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
