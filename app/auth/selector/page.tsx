"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Search, ArrowRight, Loader2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { API_CONFIG } from "@/lib/api-config";
import { SubdomainService } from "@/lib/subdomain-service";

interface Hospital {
  id: string; // Changed from number to string (UUID)
  hospital_name: string;
  subdomain: string;
  status: string;
  branding?: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    copy?: {
      welcome_title?: string;
      welcome_subtitle?: string;
      login_title?: string;
      signup_title?: string;
    };
  };
}

interface HospitalListResponse {
  hospitals: Hospital[];
  total: number;
  page: number;
  per_page: number;
}

export default function HospitalSelectorPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );

  // Fetch hospitals on component mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/hospitals?status=ACTIVE&per_page=100`
      );

      if (response.ok) {
        const data: HospitalListResponse = await response.json();
        setHospitals(data.hospitals);
      } else {
        console.error("Failed to fetch hospitals");
        // Use mock data for development
        setHospitals([
          {
            id: "1",
            hospital_name: "Test Hospital",
            subdomain: "t",
            status: "ACTIVE",
            branding: {
              logo_url: "",
              primary_color: "#007C7C",
              secondary_color: "#20B2AA",
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      // Use mock data when server is not available
      setHospitals([
        {
          id: "1",
          hospital_name: "Test Hospital",
          subdomain: "t",
          status: "ACTIVE",
          branding: {
            logo_url: "",
            primary_color: "#007C7C",
            secondary_color: "#20B2AA",
          },
        },
        {
          id: "2",
          hospital_name: "Demo Medical Center",
          subdomain: "demo",
          status: "ACTIVE",
          branding: {
            logo_url: "",
            primary_color: "#0369a1",
            secondary_color: "#0284c7",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter hospitals based on search term
  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    // Redirect to hospital's subdomain auth page (supports localhost & custom domains)
    window.location.href = SubdomainService.getSubdomainUrl(
      hospital.subdomain,
      "/auth"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Building2 className="h-8 w-8 text-healthcare-primary" />
            </motion.div>

            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Select Your Hospital
            </CardTitle>
            <p className="text-gray-600">
              Choose your hospital to access the Athaarva Healthcare platform
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Hospital</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by hospital name or subdomain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Hospital List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-healthcare-primary" />
                  <span className="ml-2 text-gray-600">
                    Loading hospitals...
                  </span>
                </div>
              ) : filteredHospitals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "No hospitals found matching your search."
                    : "No hospitals available."}
                </div>
              ) : (
                <AnimatePresence>
                  {filteredHospitals.map((hospital, index) => {
                    const url = SubdomainService.getSubdomainUrl(
                      hospital.subdomain
                    );
                    const displayDomain = url.replace(/^https?:\/\//, "");

                    return (
                      <motion.div
                        key={hospital.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                          selectedHospital?.id === hospital.id
                            ? "border-healthcare-primary bg-healthcare-primary/5"
                            : "border-gray-200 hover:border-healthcare-primary/50"
                        )}
                        onClick={() => handleHospitalSelect(hospital)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {hospital.branding?.logo_url ? (
                              <Image
                                src={hospital.branding.logo_url}
                                alt={`${hospital.hospital_name} logo`}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-gray-400" />
                              </div>
                            )}

                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {hospital.hospital_name}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Globe className="h-3 w-3 mr-1" />
                                {displayDomain}
                              </div>
                            </div>
                          </div>

                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Don&apos;t see your hospital? Contact support for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
