"use client";

import React, { useEffect, useState } from "react";
import { AppointmentProvider } from "../../contexts/AppointmentContext";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mount check to avoid hydration errors
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen"></div>; // Render a placeholder instead of children
  }

  return (
    <AppointmentProvider>
      <div className="flex h-screen bg-gray-50">
        {/* <PatientSidebar /> */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AppointmentProvider>
  );
}
