"use client";

import React from 'react';

export default function PatientOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      {/* Clean full-screen layout for onboarding */}
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
}
