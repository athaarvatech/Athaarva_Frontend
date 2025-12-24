"use client";

import React from "react";
import VitalsTrackingDashboard from "@/modules/patient-pages/vitals/VitalsTrackingDashboard";

export default function VitalsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <VitalsTrackingDashboard />
      </div>
    </div>
  );
}
