"use client";

import React, { useState } from "react";
import HeroSectionV2 from "@/modules/landing-page-v2/HeroSectionV2";
import TrustedPartnersSection from "@/modules/landing-page-v2/TrustedPartnersSection";
import AIDifferenceSection from "@/modules/landing-page-v2/AIDifferenceSection";
import ServicesSection from "@/modules/landing-page-v2/ServicesSection";
import ProductShowcase from "@/modules/landing-page-v2/ProductShowcase";
import TestimonialSection from "@/modules/landing-page-v2/TestimonialSection";
import CTASection from "@/modules/landing-page-v2/CTASection";
import FooterV2 from "@/modules/landing-page-v2/FooterV2";
import DemoRequestForm from "@/modules/landing-page/DemoRequestForm";

export default function LandingPageV2() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Request Modal */}
      {showDemoForm && (
        <DemoRequestForm onClose={() => setShowDemoForm(false)} />
      )}

      {/* Hero Section */}
      <HeroSectionV2 onDemoClick={() => setShowDemoForm(true)} />

      {/* Trusted Partners */}
      <TrustedPartnersSection />

      {/* AI Difference Section */}
      <AIDifferenceSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Final CTA */}
      <CTASection onDemoClick={() => setShowDemoForm(true)} />

      {/* Footer */}
      <FooterV2 />
    </div>
  );
}
