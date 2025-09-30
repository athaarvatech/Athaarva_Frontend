"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowLeft, 
  Loader2, 
  User, 
  UserCheck, 
  Shield,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_CONFIG } from "@/lib/api-config";
import { useAuth } from "@/contexts/AuthContext";

interface HospitalBranding {
  logo_url?: string;
  background_image?: string;
  primary_color?: string;
  secondary_color?: string;
  copy?: {
    welcome_title?: string;
    welcome_subtitle?: string;
    login_title?: string;
    signup_title?: string;
  };
}

interface Hospital {
  id: number;
  hospital_name: string;
  subdomain: string;
  status: string;
  branding?: HospitalBranding;
  official_email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  hospital_code: string;
  role: "patient" | "doctor" | "admin";
}

export default function HospitalAuthPage() {
  const params = useParams();
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<"patient" | "doctor" | "admin">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    hospital_code: "",
    role: "admin"
  });

  const subdomain = params?.subdomain as string;

  useEffect(() => {
    setCredentials(prev => ({
      ...prev,
      hospital_code: subdomain,
      role: activeRole
    }));
  }, [subdomain, activeRole]);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}/hospitals/by-subdomain/${subdomain}`);
        
        if (response.ok) {
          const data = await response.json();
          setHospital(data);
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
              primary_color: subdomain === "t" ? "#7c3aed" : "#0369a1",
              secondary_color: subdomain === "t" ? "#6d28d9" : "#0284c7",
              copy: {
                welcome_title: `Welcome to ${subdomain === "t" ? "Test Hospital" : "Demo Medical Center"}`,
                welcome_subtitle: subdomain === "t" ? "Development & Testing Environment" : "Quality Healthcare Services",
                login_title: "Sign in to your account",
                signup_title: "Create your account"
              }
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.HOSPITAL_LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

  const data = await response.json();

  // Sync auth state and persist hospital metadata
  const resolvedUserId = data.user_id ?? data.hospital_id ?? 0;
  authLogin(data.access_token, data.user_type, resolvedUserId);
  localStorage.setItem("hospital_id", data.hospital_id?.toString() || "");
  localStorage.setItem("hospital_code", data.hospital_code || "");

      // Redirect based on user type
      switch (data.user_type) {
        case "patient":
          router.push("/patient/dashboard");
          break;
        case "doctor":
          router.push("/doctor/dashboard");
          break;
        case "hospital_admin":
          router.push("/Admin");
          break;
        default:
          router.push("/dashboard");
      }
      
    } catch (err) {
      setError((err as Error).message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSelector = () => {
    window.location.href = "https://athaarva.com/auth";
  };

  const getBrandedStyles = () => {
    if (!hospital?.branding) return {};
    
    return {
      '--primary-color': hospital.branding.primary_color || '#0369a1',
      '--secondary-color': hospital.branding.secondary_color || '#0284c7',
    } as React.CSSProperties;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
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

  if (error && !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hospital Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleBackToSelector} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
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
      {/* Background Image */}
      {hospital?.branding?.background_image && (
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${hospital.branding.background_image})` }}
        />
      )}
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {hospital?.branding?.logo_url ? (
              <Image
                src={hospital.branding.logo_url}
                alt={hospital.hospital_name}
                width={80}
                height={80}
                className="rounded-lg"
              />
            ) : (
              <div 
                className="w-20 h-20 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: hospital?.branding?.primary_color || '#0369a1' }}
              >
                <Building2 className="h-10 w-10" />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hospital?.branding?.copy?.welcome_title || `Welcome to ${hospital?.hospital_name}`}
          </h1>
          <p className="text-lg text-gray-600">
            {hospital?.branding?.copy?.welcome_subtitle || "Access your healthcare portal"}
          </p>
          
          <Button 
            onClick={handleBackToSelector} 
            variant="ghost" 
            size="sm"
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Change Hospital
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {hospital?.branding?.copy?.login_title || "Sign In"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as typeof activeRole)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="patient" className="text-xs">
                    <User className="h-4 w-4 mr-1" />
                    Patient
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="text-xs">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Doctor
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleLogin} className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={credentials.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder={
                        activeRole === "patient" ? "patient@example.com" :
                        activeRole === "doctor" ? `doctor@${subdomain}.com` :
                        `admin@${subdomain}.com`
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    style={{ 
                      backgroundColor: hospital?.branding?.primary_color || '#0369a1',
                      borderColor: hospital?.branding?.primary_color || '#0369a1'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      `Sign In as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`
                    )}
                  </Button>
                </form>

                  {/* Role-specific information */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {activeRole === "patient" && "Patient Access"}
                      {activeRole === "doctor" && "Doctor Portal"}
                      {activeRole === "admin" && "Hospital Administration"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {activeRole === "patient" && "Access your medical records, appointments, and healthcare services."}
                      {activeRole === "doctor" && "Manage patient consultations, schedules, and medical records."}
                      {activeRole === "admin" && "Hospital management, staff coordination, and administrative functions."}
                    </p>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }