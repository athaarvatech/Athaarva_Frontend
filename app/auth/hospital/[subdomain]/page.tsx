"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/lib/api-config";

interface HospitalBranding {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  hero_text?: string;
  welcome_message?: string;
}

interface Hospital {
  id: number;
  hospital_name: string;
  subdomain: string;
  status: string;
  branding?: HospitalBranding;
}

export default function HospitalAuthPage() {
  const params = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subdomain = params?.subdomain as string;

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}/hospitals/by-subdomain/${subdomain}`);
        
        if (response.ok) {
          const data = await response.json();
          setHospital(data.hospital);
        } else if (response.status === 404) {
          setError("Hospital not found");
        } else {
          setError("Failed to load hospital information");
        }
      } catch (err) {
        console.error('Error fetching hospital:', err);
        // Use mock data when server is not available
        if (subdomain === "t" || subdomain === "demo") {
          setHospital({
            id: subdomain === "t" ? 1 : 2,
            hospital_name: subdomain === "t" ? "Test Hospital" : "Demo Medical Center",
            subdomain: subdomain,
            status: "ACTIVE",
            branding: {
              logo_url: "",
              primary_color: subdomain === "t" ? "#007C7C" : "#0369a1",
              secondary_color: subdomain === "t" ? "#20B2AA" : "#0284c7",
              hero_text: `Welcome to ${subdomain === "t" ? "Test Hospital" : "Demo Medical Center"}`,
              welcome_message: `Access your healthcare portal for ${subdomain === "t" ? "Test Hospital" : "Demo Medical Center"}. Sign in to manage appointments, view medical records, and connect with your healthcare team.`
            }
          });
        } else {
          setError("Hospital not found");
        }
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchHospitalData();
    }
  }, [subdomain]);

  const handleBackToSelector = () => {
    window.location.href = "https://athaarva.com/auth/selector";
  };

  const getBrandedStyles = () => {
    if (!hospital?.branding) return {};
    
    return {
      '--primary-color': hospital.branding.primary_color || '#0369a1',
      '--secondary-color': hospital.branding.secondary_color || '#0284c7',
    } as React.CSSProperties;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading hospital information...</span>
        </div>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Hospital Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {error || "The requested hospital could not be found."}
            </p>
            <Button onClick={handleBackToSelector} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hospital Selector
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white"
      style={getBrandedStyles()}
    >
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                {hospital.hospital_name}
              </h1>
            </div>
            
            <Button 
              onClick={handleBackToSelector} 
              variant="ghost" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Hospital
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding/Welcome */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left space-y-6"
          >
            {hospital.branding?.logo_url && (
              <div className="flex justify-center lg:justify-start">
                <Image
                  src={hospital.branding.logo_url}
                  alt={`${hospital.hospital_name} logo`}
                  width={120}
                  height={120}
                  className="rounded-2xl object-cover shadow-lg"
                />
              </div>
            )}
            
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {hospital.branding?.hero_text || `Welcome to ${hospital.hospital_name}`}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {hospital.branding?.welcome_message || 
                 `Access your healthcare portal for ${hospital.hospital_name}. Sign in to manage appointments, view medical records, and connect with your healthcare team.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="bg-white/80 backdrop-blur rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-600">Secure Access</span>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-600">24/7 Available</span>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-600">HIPAA Compliant</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Get Started
                </CardTitle>
                <p className="text-gray-600">
                  Choose how you&apos;d like to access your account
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  className="w-full h-12 text-base"
                  style={{ 
                    backgroundColor: hospital.branding?.primary_color || '#0369a1',
                    borderColor: hospital.branding?.primary_color || '#0369a1'
                  }}
                  onClick={() => router.push('/auth/login')}
                >
                  Sign In to Your Account
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base"
                  style={{ 
                    borderColor: hospital.branding?.primary_color || '#0369a1',
                    color: hospital.branding?.primary_color || '#0369a1'
                  }}
                  onClick={() => router.push('/auth/register')}
                >
                  Create New Account
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">For Healthcare Providers</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => router.push('/auth/provider-login')}
                >
                  Provider Portal Access
                </Button>
              </CardContent>
            </Card>
            
            {/* Contact Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact {hospital.hospital_name} support
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
