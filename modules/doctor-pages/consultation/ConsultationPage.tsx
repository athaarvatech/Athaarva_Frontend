"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";

// Import components
import { EncounterHeader } from "./components/EncounterHeader";
import { SmartDocumentationPanel } from "./components/SmartDocumentationPanel";
import { EHRIntegrationPanel } from "./components/EHRIntegrationPanel";
import { EPrescriptionPanel } from "./components/EPrescriptionPanel";

// Import context provider
import { ConsultationProvider } from "./context/ConsultationContext";

// Define the ConsultationPage component
export function ConsultationPage() {
  // Use media queries for different screen sizes
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeTab, setActiveTab] = useState<string>("documentation");

  return (
    <ConsultationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Container */}
        <div className="w-full max-w-[1400px] mx-auto">
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 shadow-sm top-0 z-10">
            <div className="px-4 md:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Clinical Consultation
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Patient care management system
                  </p>
                </div>

                {/* Mobile Navigation Tabs */}
                {!isDesktop && (
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full sm:w-auto"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                      <TabsTrigger
                        value="documentation"
                        className="text-xs sm:text-sm py-2"
                      >
                        📝 Notes
                      </TabsTrigger>
                      <TabsTrigger
                        value="prescription"
                        className="text-xs sm:text-sm py-2"
                      >
                        💊 Rx
                      </TabsTrigger>
                      <TabsTrigger
                        value="ehr"
                        className="text-xs sm:text-sm py-2"
                      >
                        📋 Records
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
            </div>
          </div>

          {/* Encounter Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 md:px-6 py-4">
              <EncounterHeader />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4 md:p-6">
            {isDesktop ? (
              /* Desktop Layout - Simple Vertical Stack */
              <div className="space-y-6">
                {/* Clinical Documentation */}
                <Card className="shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h3 className="text-lg font-semibold text-[#006D77] flex items-center gap-2">
                      📝 Clinical Documentation
                    </h3>
                  </div>
                  <div className="p-6">
                    <SmartDocumentationPanel />
                  </div>
                </Card>

                {/* E-Prescription */}
                <Card className="shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                    <h3 className="text-lg font-semibold text-[#006D77] flex items-center gap-2">
                      💊 E-Prescription
                    </h3>
                  </div>
                  <div className="p-6">
                    <EPrescriptionPanel />
                  </div>
                </Card>

                {/* Patient Records */}
                <Card className="shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                    <h3 className="text-lg font-semibold text-[#006D77] flex items-center gap-2">
                      📋 Patient Records
                    </h3>
                  </div>
                  <div className="p-6">
                    <EHRIntegrationPanel />
                  </div>
                </Card>
              </div>
            ) : (
              /* Mobile/Tablet Layout - Tabbed Interface */
              <div className="space-y-4">
                {activeTab === "documentation" && (
                  <Card className="shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                      <h3 className="font-semibold text-[#006D77] flex items-center gap-2">
                        📝 Clinical Documentation
                      </h3>
                    </div>
                    <div className="p-4">
                      <SmartDocumentationPanel />
                    </div>
                  </Card>
                )}

                {activeTab === "prescription" && (
                  <Card className="shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                      <h3 className="font-semibold text-[#006D77] flex items-center gap-2">
                        💊 E-Prescription
                      </h3>
                    </div>
                    <div className="p-4">
                      <EPrescriptionPanel />
                    </div>
                  </Card>
                )}

                {activeTab === "ehr" && (
                  <Card className="shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                      <h3 className="font-semibold text-[#006D77] flex items-center gap-2">
                        📋 Patient Records
                      </h3>
                    </div>
                    <div className="p-4">
                      <EHRIntegrationPanel />
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ConsultationProvider>
  );
}
