"use client";

import React from 'react';

export default function HospitalOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      {/* Hospital onboarding specific layout */}
      <div className="w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
