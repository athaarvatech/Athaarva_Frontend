"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Heart,
  Users,
  Award,
  Stethoscope,
  Calendar,
  ArrowRight,
  Shield,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useHospital } from "./HospitalContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  AhtarvaHealthcareTemplate,
  AhtarvaMedicalCenterTemplate,
  AhtarvaProfessionalTemplate,
} from "@/app/onboarding/hospital/widgets/templates";
import type { TemplateBlueprint } from "@/app/onboarding/hospital/widgets/templateBlueprints";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Template ID mapping - maps template IDs to their components
const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<{
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (bp: TemplateBlueprint) => void;
  isEditMode?: boolean;
  showBanner?: boolean;
  useResponsive?: boolean;
}>> = {
  // Exact matches for template IDs from TemplateGallery
  "ahtarva-professional": AhtarvaProfessionalTemplate,
  "ahtarva-medical-center": AhtarvaMedicalCenterTemplate,
  "ahtarva-healthcare": AhtarvaHealthcareTemplate,
  // From TEMPLATE_BLUEPRINTS
  "modern-healthcare": AhtarvaHealthcareTemplate,
  // Fallbacks for different naming conventions
  "healthcare": AhtarvaHealthcareTemplate,
  "medical-center": AhtarvaMedicalCenterTemplate,
  "professional": AhtarvaProfessionalTemplate,
};

// Extract template config from hospital branding (from API)
function getTemplateFromBranding(branding?: Record<string, unknown>): { id: string; name: string; customizedBlueprint?: TemplateBlueprint } | null {
  if (!branding) return null;

  const isValidBlueprint = (bp: unknown): bp is TemplateBlueprint => {
    if (!bp || typeof bp !== "object") return false;
    const obj = bp as Record<string, unknown>;
    // Minimal shape checks to avoid treating `{}` (the DB default) as a usable blueprint.
    return (
      typeof obj.id === "string" &&
      typeof obj.hero === "object" &&
      typeof obj.palette === "object"
    );
  };
  
  // New schema: template_id and template_content are stored directly
  const templateId = branding.template_id as string | undefined;
  const templateContent = branding.template_content as TemplateBlueprint | undefined;
  
  if (templateId) {
    return {
      id: templateId,
      name: templateId,
      customizedBlueprint: isValidBlueprint(templateContent) ? templateContent : undefined,
    };
  }

  // Backward/partial-data safety:
  // If template_id is missing but template_content exists, try to infer the template id from the blueprint.
  // Our blueprints include an `id` field (e.g., "ahtarva-medical-center").
  if (templateContent && typeof templateContent === "object") {
    const inferredId =
      (templateContent as unknown as { id?: unknown; templateId?: unknown }).id ??
      (templateContent as unknown as { templateId?: unknown }).templateId;

    if (typeof inferredId === "string" && inferredId.trim().length > 0) {
      return {
        id: inferredId,
        name: inferredId,
        customizedBlueprint: isValidBlueprint(templateContent) ? templateContent : undefined,
      };
    }
  }
  
  return null;
}

// Create default blueprint from hospital data
function createDefaultBlueprint(hospitalName: string, branding?: { colors?: { primary?: string; secondary?: string }; logo_url?: string }): TemplateBlueprint {
  return {
    id: "default",
    hero: {
      eyebrow: "QUALITY HEALTHCARE",
      title: `Welcome to ${hospitalName}`,
      subtitle: "Providing comprehensive healthcare services with compassion and excellence.",
      primaryCta: { label: "Book Appointment", href: "/auth?mode=signup" },
      secondaryCta: { label: "Our Services", href: "#services" },
      stats: [
        { label: "Patients Served", value: "10,000+" },
        { label: "Specialists", value: "50+" },
        { label: "Years Experience", value: "15+" },
      ],
      heroImageAlt: hospitalName,
    },
    palette: {
      background: "#ffffff",
      surface: "#f8fafc",
      accent: branding?.colors?.primary || "#007C7C",
      accentMuted: branding?.colors?.secondary || "#20B2AA",
      text: "#0f172a",
      textMuted: "#64748b",
      gradient: `linear-gradient(135deg, ${branding?.colors?.primary || "#007C7C"} 0%, ${branding?.colors?.secondary || "#20B2AA"} 100%)`,
    },
    typography: {
      heading: "Inter",
      body: "Inter",
    },
    specialties: [
      { icon: "Heart", title: "Cardiology", description: "Expert heart care and treatment" },
      { icon: "Brain", title: "Neurology", description: "Advanced neurological services" },
      { icon: "Bone", title: "Orthopedics", description: "Bone and joint specialists" },
      { icon: "Baby", title: "Pediatrics", description: "Complete child healthcare" },
      { icon: "Stethoscope", title: "General Medicine", description: "Primary healthcare services" },
      { icon: "Shield", title: "Emergency Care", description: "24/7 emergency services" },
    ],
    differentiators: [
      { title: "NABH Accredited", description: "Quality assured healthcare" },
      { title: "24/7 Emergency", description: "Round the clock care" },
      { title: "Expert Specialists", description: "Top medical professionals" },
    ],
    doctors: [],
    testimonials: [],
    facilityHighlights: [],
    programs: [],
    footer: {
      contact: {
        phone: "+91 98765 43210",
        email: "info@hospital.com",
        location: "Healthcare Avenue, City",
      },
      quickLinks: ["Services", "Doctors", "About", "Contact"],
    },
  };
}

export default function HospitalHomePage() {
  const { hospital, subdomain, theme } = useHospital();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [templateData, setTemplateData] = useState<{
    id: string;
    name: string;
    customizedBlueprint?: TemplateBlueprint;
  } | null>(null);
  const [branding, setBranding] = useState<{
    colors?: { primary?: string; secondary?: string };
    logo_url?: string;
  } | null>(null);

  // Get the dashboard URL based on user type
  const getDashboardUrl = () => {
    if (!user) return "/auth";
    switch (user.user_type) {
      case "patient":
        return "/patient/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "hospital_admin":
        return "/hospital/admin/dashboard";
      default:
        return "/patient/dashboard";
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // ALWAYS set branding colors from hospital data (when available)
    if (hospital?.branding) {
      const brandingData = hospital.branding as Record<string, unknown>;
      setBranding({
        colors: {
          primary: (brandingData.primary_color as string) || "#007C7C",
          secondary: (brandingData.secondary_color as string) || "#20B2AA",
        },
        logo_url: brandingData.logo_url as string,
      });
      console.log("[HospitalPage] Loaded branding from API:", {
        primary: brandingData.primary_color,
        secondary: brandingData.secondary_color,
        template_id: brandingData.template_id,
      });
    }
    
    // Check for template from API branding
    if (hospital?.branding) {
      const apiTemplate = getTemplateFromBranding(hospital.branding as Record<string, unknown>);
      if (apiTemplate) {
        console.log("[HospitalPage] Loaded template from API:", apiTemplate.id);
        setTemplateData(apiTemplate);
        return;
      }
    }
    
    // Fallback for dev mode: URL param for template override
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get("template");
    
    if (templateParam && TEMPLATE_COMPONENTS[templateParam]) {
      console.log("[HospitalPage] Using template from URL param:", templateParam);
      setTemplateData({ id: templateParam, name: templateParam });
      return;
    }
    
    // Default to professional template (uses hospital branding colors already set above)
    console.log("[HospitalPage] Using default ahtarva-professional template");
    setTemplateData({ id: "ahtarva-professional", name: "Ahtarva Professional" });
  }, [hospital]);

  // Determine which template component to use
  const TemplateComponent = useMemo(() => {
    if (!templateData?.id) return null;
    
    // Try exact match first
    if (TEMPLATE_COMPONENTS[templateData.id]) {
      return TEMPLATE_COMPONENTS[templateData.id];
    }
    
    // Try normalized ID
    const normalizedId = templateData.id.toLowerCase().replace(/[_\s]/g, "-");
    if (TEMPLATE_COMPONENTS[normalizedId]) {
      return TEMPLATE_COMPONENTS[normalizedId];
    }
    
    // Try partial match
    for (const [key, component] of Object.entries(TEMPLATE_COMPONENTS)) {
      if (normalizedId.includes(key) || key.includes(normalizedId)) {
        return component;
      }
    }
    
    console.warn(`[HospitalPage] No template found for ID: ${templateData.id}`);
    return null;
  }, [templateData?.id]);

  // Create blueprint for the template
  const blueprint = useMemo(() => {
    if (templateData?.customizedBlueprint) {
      return templateData.customizedBlueprint;
    }
    return createDefaultBlueprint(hospital?.hospital_name || "Hospital", branding || undefined);
  }, [templateData?.customizedBlueprint, hospital?.hospital_name, branding]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-healthcare-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading hospital portal...</p>
        </div>
      </div>
    );
  }

  if (!hospital) return null;

  // If we have a custom template selected, render it
  if (TemplateComponent) {
    return (
      <TemplateComponent
        blueprint={blueprint}
        device="desktop"
        onBlueprintChange={() => {}} // No-op in view mode
        isEditMode={false}
        showBanner={false}
        useResponsive={true}
      />
    );
  }

  // Default fallback template (when no custom template is selected)
  const stats = [
    { icon: Users, value: "10,000+", label: "Patients Served" },
    { icon: Stethoscope, value: "50+", label: "Specialists" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Heart, value: "98%", label: "Patient Satisfaction" },
  ];

  // Default services list - can be extended with API data later
  const services: string[] = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Neurology",
    "Emergency Care",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              {hospital.logo_url ? (
                <Image
                  src={hospital.logo_url}
                  alt={hospital.hospital_name}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Building2 className="h-5 w-5" />
                </div>
              )}
              <span className="font-bold text-gray-900 hidden sm:block">
                {hospital.hospital_name}
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="#services" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Services
              </Link>
              <Link href="#doctors" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Doctors
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link href={getDashboardUrl()}>
                  <Button
                    size="sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth?mode=login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup">
                    <Button
                      size="sm"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      Book Appointment
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(${theme.primaryColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <Badge
                  variant="secondary"
                  className="mb-4"
                  style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Trusted Healthcare Partner
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              >
                Your Health,{" "}
                <span style={{ color: theme.primaryColor }}>
                  Our Priority
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-600 max-w-lg"
              >
                {`Welcome to ${hospital.hospital_name}. We provide comprehensive healthcare services with a focus on patient-centered care and medical excellence.`}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link href={getDashboardUrl()}>
                    <Button
                      size="lg"
                      className="gap-2"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <ArrowRight className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth?mode=signup">
                      <Button
                        size="lg"
                        className="gap-2"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <Calendar className="h-4 w-4" />
                        Book Appointment
                      </Button>
                    </Link>
                    <Link href="/auth?mode=login">
                      <Button size="lg" variant="outline" className="gap-2">
                        Login
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
                <Link href="#services">
                  <Button size="lg" variant="ghost" className="gap-2">
                    View Services
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">NABH Accredited</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">24/7 Emergency</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image/Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <Card className="relative overflow-hidden border-0 shadow-2xl">
                <div
                  className="h-3"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="text-center p-4 rounded-xl bg-gray-50"
                      >
                        <div
                          className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                          style={{ backgroundColor: `${theme.primaryColor}15` }}
                        >
                          <stat.icon
                            className="h-6 w-6"
                            style={{ color: theme.primaryColor }}
                          />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Our Medical Services
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              We offer a comprehensive range of medical services to meet all your healthcare needs
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service: string, idx: number) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors group-hover:scale-110"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Stethoscope
                        className="h-6 w-6"
                        style={{ color: theme.primaryColor }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Expert care and treatment from our experienced specialists.
                    </p>
                    <div
                      className="flex items-center text-sm font-medium group-hover:gap-2 transition-all"
                      style={{ color: theme.primaryColor }}
                    >
                      Learn More
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold text-gray-900"
              >
                Get In Touch
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600">
                Have questions? We're here to help. Reach out to us through any of the following channels.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-4">
                {hospital.address && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <MapPin className="h-5 w-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Address</div>
                      <div className="text-sm text-gray-600">
                        {hospital.address}
                        {hospital.city && `, ${hospital.city}`}
                        {hospital.state && `, ${hospital.state}`}
                      </div>
                    </div>
                  </div>
                )}

                {hospital.phone && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Phone className="h-5 w-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <div className="text-sm text-gray-600">{hospital.phone}</div>
                    </div>
                  </div>
                )}

                {hospital.official_email && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Mail className="h-5 w-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-sm text-gray-600">{hospital.official_email}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${theme.primaryColor}15` }}
                  >
                    <Clock className="h-5 w-5" style={{ color: theme.primaryColor }} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Working Hours</div>
                    <div className="text-sm text-gray-600">
                      Mon - Fri: 8:00 AM - 8:00 PM<br />
                      Sat - Sun: 9:00 AM - 5:00 PM<br />
                      <Badge variant="secondary" className="mt-1">Emergency: 24/7</Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              <Card
                className="w-full border-0 shadow-xl overflow-hidden"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <CardContent className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-white/80 mb-6">
                    Join thousands of patients who trust {hospital.hospital_name} for their healthcare needs. Book your appointment today.
                  </p>
                  <div className="space-y-3">
                    <Link href="/auth?mode=signup" className="block">
                      <Button
                        size="lg"
                        className="w-full bg-white hover:bg-gray-100 gap-2"
                        style={{ color: theme.primaryColor }}
                      >
                        <Calendar className="h-4 w-4" />
                        Book Appointment
                      </Button>
                    </Link>
                    <Link href="/auth" className="block">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-white/30 text-white hover:bg-white/10"
                      >
                        Sign In to Portal
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {hospital.logo_url ? (
                <Image
                  src={hospital.logo_url}
                  alt={hospital.hospital_name}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Building2 className="h-5 w-5" />
                </div>
              )}
              <span className="font-bold">{hospital.hospital_name}</span>
            </div>
            <div className="text-sm text-gray-400">
              Powered by{" "}
              <a
                href="https://athaarva.com"
                className="text-white hover:underline"
              >
                Athaarva Healthcare
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
