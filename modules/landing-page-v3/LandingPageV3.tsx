"use client";

import React from "react";
import {
  Header,
  Hero,
  ProblemStatement,
  Features,
  Testimonials,
  Pricing,
  Footer,
} from "@/components/landing";

export default function LandingPageV3() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <Header />

      {/* Hero Section with Dashboard Mockup */}
      <Hero />

      {/* Problem Statement with Scroll Carousel */}
      <ProblemStatement />

      {/* Features Bento Grid */}
      <Features />

      {/* Testimonials Marquee */}
      <Testimonials />

      {/* Pricing Section */}
      <Pricing />

      {/* CTA + Footer */}
      <Footer />
    </div>
  );
}
