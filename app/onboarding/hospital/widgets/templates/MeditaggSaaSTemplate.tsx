"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Star,
  CheckCircle2,
  Calendar,
  CreditCard,
  FileText,
  Shield,
  Globe,
  Wifi,
  Cloud,
  ChevronDown,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  ArrowUpRight,
  Users,
  TrendingUp,
  Award,
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

export interface MeditaggSaaSTemplateProps {
  blueprint: TemplateBlueprint;
  onBlueprintChange: (updated: TemplateBlueprint) => void;
  device: "desktop" | "tablet" | "mobile";
  isEditMode?: boolean;
  showBanner?: boolean;
}

type ColorScheme = {
  primary: string; // Green #33c467
  secondary: string; // Blue #2f57ef
  background: string; // White
  surface: string; // Soft Blue-Gray #f8f9fc
  darkBg: string; // Deep Slate #111827
  text: string;
  textLight: string;
};

// ============================================================================
// CUSTOM STYLES
// ============================================================================

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
  
  .shadow-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .shadow-card-hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  .shadow-green {
    box-shadow: 0 8px 25px rgba(51, 196, 103, 0.3);
  }
  
  .shadow-blue {
    box-shadow: 0 8px 25px rgba(47, 87, 239, 0.3);
  }
  
  .gradient-blob {
    background: linear-gradient(135deg, rgba(47, 87, 239, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  }
  
  .gradient-overlay {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
  }
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MeditaggSaaSTemplate({
  blueprint,
  onBlueprintChange,
  device = "desktop",
  isEditMode = false,
  showBanner = true,
}: MeditaggSaaSTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const colors: ColorScheme = {
    primary: "#33c467",
    secondary: "#2f57ef",
    background: "#ffffff",
    surface: "#f8f9fc",
    darkBg: "#111827",
    text: "#111827",
    textLight: "#6b7280",
  };

  // Device-specific scale
  const scale = device === "tablet" ? 0.75 : device === "mobile" ? 0.4 : 1;

  // Helper functions
  const updateBlueprint = <K extends keyof TemplateBlueprint>(
    key: K,
    value: TemplateBlueprint[K]
  ) => {
    onBlueprintChange({ ...blueprint, [key]: value });
  };

  const updateHero = (hero: Partial<TemplateBlueprint["hero"]>) => {
    updateBlueprint("hero", { ...blueprint.hero, ...hero });
  };

  const updateImages = (
    key: keyof TemplateBlueprint["images"],
    image: UploadedImageData | null
  ) => {
    if (image) {
      updateBlueprint("images", { ...blueprint.images, [key]: image });
    }
  };

  return (
    <div
      className="font-poppins min-h-screen bg-white"
      style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
    >
      <style>{customStyles}</style>

      {/* Edit Mode Banner */}
      {isEditMode && showBanner && (
        <div
          className="sticky top-0 z-[100] text-white px-4 py-2 text-center text-sm backdrop-blur-lg"
          style={{ backgroundColor: `${colors.primary}ee` }}
        >
          <span className="font-bold">🏥 Meditagg SaaS Canvas</span> — Click to
          edit text, hover images to upload. Auto-save enabled.
        </div>
      )}

      {/* Navigation will go here */}
      <MeditaggNavigation
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Hero Section will go here */}
      <MeditaggHero
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={updateHero}
        onImageUpdate={updateImages}
      />

      {/* Floating Sidebar will go here */}
      <FloatingSidebar colors={colors} />

      {/* Feature Highlight Section */}
      <FeatureHighlight
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
        onUpdate={updateBlueprint}
      />

      {/* Key Benefits Grid */}
      <KeyBenefits
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* Vision & Data Safety */}
      <VisionAndSafety
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* CTA Banner */}
      <CTABanner colors={colors} />

      {/* Why Choose Us - Bento Grid */}
      <WhyChooseUs colors={colors} />

      {/* Testimonials */}
      <Testimonials
        blueprint={blueprint}
        colors={colors}
        isEditMode={isEditMode}
      />

      {/* FAQ Section */}
      <FAQSection
        colors={colors}
        activeFaq={activeFaq}
        setActiveFaq={setActiveFaq}
      />

      {/* Blog Section */}
      <BlogSection colors={colors} />

      {/* Contact Section */}
      <ContactSection colors={colors} />

      {/* Footer */}
      <Footer colors={colors} />
    </div>
  );
}

// ============================================================================
// FEATURE HIGHLIGHT COMPONENT
// ============================================================================

interface FeatureHighlightProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: <K extends keyof TemplateBlueprint>(
    key: K,
    value: TemplateBlueprint[K]
  ) => void;
}

function FeatureHighlight({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
}: FeatureHighlightProps) {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl overflow-hidden h-64 bg-gray-200"></div>
              <div className="rounded-3xl overflow-hidden h-64 bg-gray-200"></div>
            </div>
            {/* Efficiency Card */}
            <div
              className="absolute bottom-4 left-4 right-4 p-6 rounded-2xl text-white"
              style={{ backgroundColor: colors.secondary }}
            >
              <div className="text-3xl font-bold mb-2">85%</div>
              <p className="text-sm">Increase in operational efficiency</p>
              <svg
                className="absolute bottom-0 left-0 w-full"
                viewBox="0 0 400 40"
                fill="none"
              >
                <path
                  d="M0,20 Q100,0 200,20 T400,20 L400,40 L0,40 Z"
                  fill="rgba(255,255,255,0.1)"
                />
              </svg>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Clinic Management Software
            </h2>
            <p className="text-lg text-gray-600">
              Streamline your practice with our comprehensive clinic management
              solution. From appointments to billing, we&apos;ve got you
              covered.
            </p>
            <div className="flex gap-4">
              <button
                className="px-6 py-3 rounded-full text-white font-semibold shadow-blue transition-all hover:scale-105"
                style={{ backgroundColor: colors.secondary }}
              >
                Learn More
              </button>
              <button
                className="px-6 py-3 rounded-full text-white font-semibold shadow-green transition-all hover:scale-105"
                style={{ backgroundColor: colors.primary }}
              >
                Try Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// KEY BENEFITS GRID COMPONENT
// ============================================================================

interface KeyBenefitsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function KeyBenefits({ blueprint, colors, isEditMode }: KeyBenefitsProps) {
  const benefits = [
    {
      number: "1",
      icon: Calendar,
      title: "Appointment Management",
      description: "Smart scheduling with automated reminders",
      color: colors.primary,
    },
    {
      number: "2",
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Seamless payment processing and invoicing",
      color: colors.secondary,
    },
    {
      number: "3",
      icon: FileText,
      title: "Medical Records",
      description: "Secure digital health record management",
      color: colors.primary,
    },
    {
      number: "4",
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security and compliance",
      color: colors.secondary,
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Key Benefits
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to run a modern clinic
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1"
              style={{ backgroundColor: colors.surface }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: benefit.color }}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <span
                  className="text-5xl font-bold"
                  style={{ color: benefit.color, opacity: 0.2 }}
                >
                  {benefit.number}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VISION AND SAFETY COMPONENT
// ============================================================================

interface VisionAndSafetyProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function VisionAndSafety({
  blueprint,
  colors,
  isEditMode,
}: VisionAndSafetyProps) {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Data Safety Row */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Data Safety</h2>
            <p className="text-lg text-gray-600">
              Your patient data is protected with enterprise-grade encryption
              and compliance with healthcare regulations.
            </p>
            <button
              className="px-6 py-3 rounded-full text-white font-semibold shadow-green"
              style={{ backgroundColor: colors.primary }}
            >
              Learn About Security
            </button>
          </div>
          <div className="relative rounded-3xl overflow-hidden h-96 bg-gray-200">
            <div className="absolute bottom-0 left-0 right-0 p-6 gradient-overlay">
              <h3 className="text-white font-bold text-xl mb-2">
                Certified & Compliant
              </h3>
              <p className="text-white/80 text-sm mb-3">
                HIPAA, GDPR, and ISO 27001 certified
              </p>
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: colors.secondary }}
              >
                Try Free
              </button>
            </div>
          </div>
        </div>

        {/* Vision Row */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden h-96 bg-gray-200 order-2 lg:order-1">
            <div className="absolute bottom-0 left-0 right-0 p-6 gradient-overlay">
              <h3 className="text-white font-bold text-xl mb-2">Our Vision</h3>
              <p className="text-white/80 text-sm mb-3">
                Transforming healthcare one clinic at a time
              </p>
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: colors.secondary }}
              >
                Try Free
              </button>
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-lg text-gray-600">
              We envision a future where every clinic has access to world-class
              technology, enabling better patient care and outcomes.
            </p>
            <button
              className="px-6 py-3 rounded-full text-white font-semibold shadow-green"
              style={{ backgroundColor: colors.primary }}
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA BANNER COMPONENT
// ============================================================================

interface CTABannerProps {
  colors: ColorScheme;
}

function CTABanner({ colors }: CTABannerProps) {
  return (
    <section className="relative py-32 px-4 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-gray-800/50"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold text-white mb-6">
            Transforming Healthcare
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of clinics already using Meditagg
          </p>
          <button
            className="px-8 py-4 rounded-full text-white font-semibold shadow-green transition-all hover:scale-105"
            style={{ backgroundColor: colors.primary }}
          >
            Contact Us
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// WHY CHOOSE US - BENTO GRID COMPONENT
// ============================================================================

interface WhyChooseUsProps {
  colors: ColorScheme;
}

function WhyChooseUs({ colors }: WhyChooseUsProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Why Choose Meditagg?
            </h2>
            <p className="text-lg text-gray-600">
              Built for modern clinics with features that actually matter
            </p>
            <div className="flex gap-4">
              <button
                className="px-6 py-3 rounded-full text-white font-semibold shadow-blue"
                style={{ backgroundColor: colors.secondary }}
              >
                Get Started
              </button>
              <button
                className="px-6 py-3 rounded-full text-white font-semibold shadow-green"
                style={{ backgroundColor: colors.primary }}
              >
                Book Demo
              </button>
            </div>
          </div>

          {/* Right - Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 */}
            <div
              className="p-6 rounded-3xl shadow-card col-span-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Globe
                className="w-12 h-12 mb-4"
                style={{ color: colors.secondary }}
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Multilingual Support
              </h3>
              <p className="text-gray-600 text-sm">
                Available in 10+ languages
              </p>
            </div>

            {/* Card 2 - Tall */}
            <div
              className="p-6 rounded-3xl shadow-card row-span-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Wifi
                className="w-12 h-12 mb-4"
                style={{ color: colors.primary }}
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Low Bandwidth
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Works seamlessly even on 2G connections
              </p>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "90%",
                      backgroundColor: colors.primary,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">90% Optimized</span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="p-6 rounded-3xl shadow-card"
              style={{ backgroundColor: colors.surface }}
            >
              <Cloud
                className="w-12 h-12 mb-4"
                style={{ color: colors.secondary }}
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cloud Storage
              </h3>
              <p className="text-gray-600 text-sm">Unlimited secure storage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS COMPONENT
// ============================================================================

interface TestimonialsProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
}

function Testimonials({ blueprint, colors, isEditMode }: TestimonialsProps) {
  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Cardiologist",
      rating: 5,
      review:
        "Meditagg has transformed how we manage our clinic. The interface is intuitive and the support is excellent.",
    },
    {
      name: "Dr. Priya Sharma",
      role: "Pediatrician",
      rating: 5,
      review:
        "Best clinic management software I've used. Saves us hours every day and patients love the online booking.",
    },
    {
      name: "Dr. Amit Patel",
      role: "General Physician",
      rating: 5,
      review:
        "The billing and insurance features are game-changing. Highly recommend to any medical practice.",
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Doctors Say
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by healthcare professionals nationwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: colors.secondary }}
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600">{testimonial.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ SECTION COMPONENT
// ============================================================================

interface FAQSectionProps {
  colors: ColorScheme;
  activeFaq: number | null;
  setActiveFaq: (index: number | null) => void;
}

function FAQSection({ colors, activeFaq, setActiveFaq }: FAQSectionProps) {
  const faqs = [
    {
      question: "How easy is it to get started?",
      answer:
        "Getting started is simple! Sign up, complete the setup wizard, and you can start managing your clinic in under 30 minutes.",
    },
    {
      question: "Is my patient data secure?",
      answer:
        "Absolutely. We use bank-level encryption and are HIPAA compliant. Your data is backed up daily and stored securely.",
    },
    {
      question: "Can I access it on mobile?",
      answer:
        "Yes! Meditagg works seamlessly on all devices - desktop, tablet, and mobile with responsive design.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We offer 24/7 customer support via chat, email, and phone. Plus comprehensive documentation and video tutorials.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-600 transition-transform",
                      activeFaq === idx && "rotate-180"
                    )}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="rounded-3xl overflow-hidden h-96 bg-gray-200 shadow-card"></div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BLOG SECTION COMPONENT
// ============================================================================

interface BlogSectionProps {
  colors: ColorScheme;
}

function BlogSection({ colors }: BlogSectionProps) {
  const blogs = [
    {
      title: "10 Ways to Improve Patient Experience",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      tags: ["Hospital", "Patient Care"],
    },
    {
      title: "Digital Transformation in Healthcare",
      date: "Dec 10, 2024",
      readTime: "7 min read",
      tags: ["Technology", "Staff"],
    },
    {
      title: "Best Practices for Clinic Management",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      tags: ["Management", "Tips"],
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Insights
          </h2>
          <p className="text-lg text-gray-600">
            Tips and best practices for modern clinics
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.readTime}
                  </span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {blog.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                      style={{
                        backgroundColor:
                          tagIdx % 2 === 0 ? colors.primary : colors.secondary,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
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
// CONTACT SECTION COMPONENT
// ============================================================================

interface ContactSectionProps {
  colors: ColorScheme;
}

function ContactSection({ colors }: ContactSectionProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-card-hover overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-2">
            {/* Left - Form */}
            <div className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Get In Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Let&apos;s discuss how Meditagg can help your clinic
              </p>

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-opacity-50 transition-all"
                  style={{
                    backgroundColor: colors.surface,
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-opacity-50 transition-all"
                  style={{ backgroundColor: colors.surface }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-opacity-50 transition-all"
                  style={{ backgroundColor: colors.surface }}
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-opacity-50 transition-all resize-none"
                  style={{ backgroundColor: colors.surface }}
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-4 rounded-full text-white font-semibold shadow-green transition-all hover:scale-105"
                  style={{ backgroundColor: colors.primary }}
                >
                  Send Message
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Right - Image */}
            <div className="h-full min-h-[500px] bg-gray-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

interface FooterProps {
  colors: ColorScheme;
}

function Footer({ colors }: FooterProps) {
  return (
    <footer className="py-16 px-4" style={{ backgroundColor: colors.darkBg }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div
              className="inline-block px-4 py-2 rounded-lg text-white font-bold text-lg mb-4"
              style={{ backgroundColor: colors.secondary }}
            >
              Meditagg
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              India&apos;s leading clinic management software, trusted by
              thousands of healthcare professionals.
            </p>
            <button
              className="px-6 py-3 rounded-full text-white font-semibold shadow-green"
              style={{ backgroundColor: colors.primary }}
            >
              Book Demo
            </button>
          </div>

          {/* Sitemap Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Integration", "Updates"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Head Office Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Healthcare Street, Mumbai, India 400001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@meditagg.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Meditagg. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================

interface MeditaggNavigationProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function MeditaggNavigation({
  blueprint,
  colors,
  isEditMode,
  mobileMenuOpen,
  setMobileMenuOpen,
}: MeditaggNavigationProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="px-4 py-2 rounded-lg text-white font-bold text-lg"
            style={{ backgroundColor: colors.secondary }}
          >
            Meditagg
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Features
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Contact
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              className="px-6 py-2.5 rounded-full text-white font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                boxShadow: "0 8px 25px rgba(51, 196, 103, 0.3)",
              }}
            >
              Get Started
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#about"
              className="block text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </a>
            <a
              href="#features"
              className="block text-gray-700 hover:text-gray-900 font-medium"
            >
              Features
            </a>
            <a
              href="#contact"
              className="block text-gray-700 hover:text-gray-900 font-medium"
            >
              Contact
            </a>
            <button
              className="w-full px-6 py-2.5 rounded-full text-white font-semibold"
              style={{ backgroundColor: colors.primary }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

interface MeditaggHeroProps {
  blueprint: TemplateBlueprint;
  colors: ColorScheme;
  isEditMode: boolean;
  onUpdate: (hero: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    key: keyof TemplateBlueprint["images"],
    image: UploadedImageData | null
  ) => void;
}

function MeditaggHero({
  blueprint,
  colors,
  isEditMode,
  onUpdate,
  onImageUpdate,
}: MeditaggHeroProps) {
  const heroImage = blueprint.images?.heroImage;

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] gradient-blob rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: colors.textLight }}
              >
                INDIA&apos;S #1 CLINIC SOFTWARE
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {isEditMode ? (
                <EditableText
                  value={blueprint.hero.title}
                  onChange={(val) => onUpdate({ title: val })}
                  className="text-gray-900"
                />
              ) : (
                <>
                  {blueprint.hero.title.split("Practice!")[0]}
                  <span style={{ color: colors.secondary }}>Practice!</span>
                </>
              )}
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              {isEditMode ? (
                <EditableText
                  value={blueprint.hero.subtitle}
                  onChange={(val) => onUpdate({ subtitle: val })}
                />
              ) : (
                blueprint.hero.subtitle
              )}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-3.5 rounded-full text-white font-semibold shadow-blue transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: colors.secondary }}
              >
                Try For Free
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
              <button
                className="px-8 py-3.5 rounded-full text-white font-semibold shadow-green transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: colors.primary }}
              >
                Book a Demo
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-gray-200">
              {[
                { label: "60+ Cities", value: "60+" },
                { label: "10k+ Clinics", value: "10k+" },
                { label: "98% Satisfaction", value: "98%" },
                { label: "24/7 Support", value: "24/7" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center lg:text-left">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.secondary }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Doctor Image with Floating Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              {isEditMode ? (
                <HeroImageUploader
                  value={heroImage || null}
                  onChange={(img) =>
                    onImageUpdate(
                      "heroImage" as keyof TemplateBlueprint["images"],
                      img || null
                    )
                  }
                  className="w-full h-[600px]"
                />
              ) : heroImage?.previewUrl ? (
                <img
                  src={heroImage.previewUrl}
                  alt="Doctor"
                  className="w-full h-[600px] object-cover"
                />
              ) : (
                <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Hero Image</span>
                </div>
              )}
            </div>

            {/* Floating Card */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card-hover p-6 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">10k+</div>
                  <div className="text-sm text-gray-600">Clients Satisfied</div>
                </div>
              </div>
              <button
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: colors.secondary }}
              >
                Know More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FLOATING SIDEBAR COMPONENT
// ============================================================================

interface FloatingSidebarProps {
  colors: ColorScheme;
}

function FloatingSidebar({ colors }: FloatingSidebarProps) {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-2">
        {[
          { icon: ArrowUpRight, color: colors.primary, label: "Quick Action" },
          { icon: MessageCircle, color: "#25D366", label: "WhatsApp" },
          { icon: Phone, color: colors.secondary, label: "Call Us" },
        ].map((item, idx) => (
          <button
            key={idx}
            className="w-14 h-14 flex items-center justify-center text-white rounded-l-xl transition-all duration-200 hover:w-16 shadow-lg"
            style={{ backgroundColor: item.color }}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>
    </div>
  );
}
