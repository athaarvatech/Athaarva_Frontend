"use client";

// New modern landing page design with animations
import LandingPageV2 from "@/modules/landing-page-v2/LandingPageV2";

export default function LandingPage() {
  return <LandingPageV2 />;
}

// Keep the old landing page code commented for reference
/*
import React, { useState } from "react";
import HeroSection from "@/modules/landing-page/HeroSection";
import SocialProofSection from "@/modules/landing-page/SocialProofSection";
import FeatureHighlights from "@/modules/landing-page/FeatureHighlights";
import DemoRequestForm from "@/modules/landing-page/DemoRequestForm";
import PricingSection from "@/modules/landing-page/PricingSection";
import FAQSection from "@/modules/landing-page/FAQSection";
import Footer from "@/modules/landing-page/Footer";

function OldLandingPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {showDemoForm && (
        <DemoRequestForm onClose={() => setShowDemoForm(false)} />
      )}
      <HeroSection onDemoClick={() => setShowDemoForm(true)} />
      <SocialProofSection />
      <FeatureHighlights />
      <PricingSection onDemoClick={() => setShowDemoForm(true)} />
      <FAQSection />
      <Footer />
    </div>
  );
}
*/