"use client";

import React, { useState } from "react";
import HeroSection from "@/modules/landing-page/HeroSection";
import SocialProofSection from "@/modules/landing-page/SocialProofSection";
import FeatureHighlights from "@/modules/landing-page/FeatureHighlights";
import DemoRequestForm from "@/modules/landing-page/DemoRequestForm";
//import ProductDemoSection from "@/modules/landing-page/ProductDemoSection";
//import CostCalculatorSection from "@/modules/landing-page/CostCalculatorSection";
import PricingSection from "@/modules/landing-page/PricingSection";
//import MobileShowcaseSection from "@/modules/landing-page/MobileShowcaseSection";
import FAQSection from "@/modules/landing-page/FAQSection";
import Footer from "@/modules/landing-page/Footer";

function LandingPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Demo Request Modal */}
      {showDemoForm && (
        <DemoRequestForm onClose={() => setShowDemoForm(false)} />
      )}

      {/* Main Landing Page Content */}
      <HeroSection
        onDemoClick={() => setShowDemoForm(true)}
      />
      <SocialProofSection />
      <FeatureHighlights />
      {/* <ProductDemoSection onDemoClick={() => setShowDemoForm(true)} /> */}
      {/* <CostCalculatorSection onDemoClick={() => setShowDemoForm(true)} /> */}
      <PricingSection onDemoClick={() => setShowDemoForm(true)} />
      {/* <MobileShowcaseSection /> */}
      <FAQSection />
      <Footer />
    </div>
  );
}

export default LandingPage;