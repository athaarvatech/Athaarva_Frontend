"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LandingPageV3 from "@/modules/landing-page-v3/LandingPageV3";
import { Loader2 } from "lucide-react";

// Dynamically import hospital layout and page to avoid SSR issues
const HospitalLayout = dynamic(() => import("./(hospital)/layout"), {
  ssr: false,
});
const HospitalHomePage = dynamic(() => import("./(hospital)/page"), {
  ssr: false,
});

// Loading component
function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-healthcare-primary animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Check if we're on a hospital subdomain
function getSubdomain(): string | null {
  if (typeof window === "undefined") return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  
  // Handle localhost subdomains: mannan.localhost
  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0];
  }
  
  // Handle production subdomains: hospital.athaarva.com
  if (parts.length === 3 && parts[1] === "athaarva" && parts[2] === "com") {
    return parts[0];
  }
  
  return null;
}

export default function LandingPage() {
  const [isHospitalSubdomain, setIsHospitalSubdomain] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const subdomain = getSubdomain();
    
    // Also check for hospital_code cookie as fallback
    const cookies = document.cookie.split(";");
    const hospitalCookie = cookies.find((c) => c.trim().startsWith("hospital_code="));
    const hospitalCode = hospitalCookie?.split("=")[1];
    
    setIsHospitalSubdomain(!!(subdomain || hospitalCode));
  }, []);

  // Show loading while determining route
  if (!mounted || isHospitalSubdomain === null) {
    return <LoadingScreen />;
  }

  // If on hospital subdomain, render hospital page WITH its layout (provides HospitalContext)
  if (isHospitalSubdomain) {
    return (
      <HospitalLayout>
        <HospitalHomePage />
      </HospitalLayout>
    );
  }

  // Main domain - render Athaarva landing page
  return <LandingPageV3 />;
}

// Keep the old landing page code commented for reference
/*
import LandingPageV2 from "@/modules/landing-page-v2/LandingPageV2";

function OldLandingPage() {
  return <LandingPageV2 />;
}

import React, { useState } from "react";
import HeroSection from "@/modules/landing-page/HeroSection";
import SocialProofSection from "@/modules/landing-page/SocialProofSection";
import FeatureHighlights from "@/modules/landing-page/FeatureHighlights";
import DemoRequestForm from "@/modules/landing-page/DemoRequestForm";
import PricingSection from "@/modules/landing-page/PricingSection";
import FAQSection from "@/modules/landing-page/FAQSection";
import Footer from "@/modules/landing-page/Footer";

function OlderLandingPage() {
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
