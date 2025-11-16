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
  AlertCircle,
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
  id: string; // Changed from number to string (UUID)
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
  const [activeRole, setActiveRole] = useState<"patient" | "doctor" | "admin">(
    "admin"
  );
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    hospital_code: "",
    role: "admin",
  });

  const subdomain = params?.subdomain as string;

  useEffect(() => {
    setCredentials((prev) => ({
      ...prev,
      hospital_code: subdomain,
      role: activeRole,
    }));
  }, [subdomain, activeRole]);

  const resolveAssetUrl = (url?: string | null) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${API_CONFIG.BASE_URL}${url}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/hospitals/by-subdomain/${subdomain}`
        );

        if (response.ok) {
          const data = await response.json();
          setHospital(data);
        } else if (response.status === 404) {
          setError("Hospital not found");
        } else {
          setError("Failed to load hospital information");
        }
      } catch (err) {
        console.error("Error fetching hospital:", err);
        // Use mock data when server is not available
        if (subdomain === "t" || subdomain === "demo") {
          setHospital({
            id: subdomain === "t" ? "1" : "2",
            hospital_name:
              subdomain === "t" ? "Test Hospital" : "Demo Medical Center",
            subdomain: subdomain,
            status: "ACTIVE",
            branding: {
              logo_url: "",
              primary_color: subdomain === "t" ? "#7c3aed" : "#0369a1",
              secondary_color: subdomain === "t" ? "#6d28d9" : "#0284c7",
              copy: {
                welcome_title: `Welcome to ${
                  subdomain === "t" ? "Test Hospital" : "Demo Medical Center"
                }`,
                welcome_subtitle:
                  subdomain === "t"
                    ? "Development & Testing Environment"
                    : "Quality Healthcare Services",
                login_title: "Sign in to your account",
                signup_title: "Create your account",
              },
            },
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
      // Use unified login endpoint - auto-detects user type
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/auth/unified-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const result = await response.json();
      const data = result.data;

      // Verify user belongs to this hospital
      if (
        data.user.hospital_code !== subdomain &&
        data.user.user_type !== "super_admin"
      ) {
        throw new Error("You don't have access to this hospital");
      }

      // Store auth token and user info
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("hospital_code", data.user.hospital_code || "");
      localStorage.setItem("hospital_name", data.user.hospital_name || "");
      localStorage.setItem("user_name", data.user.full_name || data.user.email);

      // Sync with auth context if it exists
      if (authLogin) {
        authLogin(data.access_token, data.user.user_type, data.user.id);
      }

      // Redirect to appropriate dashboard
      router.push(data.redirect_to);
    } catch (err) {
      setError((err as Error).message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatientSignup = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!hospital) {
      setError("Hospital information not available");
      return;
    }

    try {
      console.log("Starting patient registration flow...", {
        hospital_id: hospital.id,
        hospital_code: subdomain,
        hospital_name: hospital.hospital_name,
      });

      // IMPORTANT: Clear any existing auth data to prevent auto-redirects
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
      localStorage.removeItem("hospital_id");
      localStorage.removeItem("hospital_code");

      // Store hospital context in sessionStorage for onboarding
      sessionStorage.setItem("onboarding_hospital_id", hospital.id.toString());
      sessionStorage.setItem("onboarding_hospital_code", subdomain);
      sessionStorage.setItem(
        "onboarding_hospital_name",
        hospital.hospital_name
      );

      console.log("Cleared auth data, stored onboarding context");

      // Redirect to patient onboarding
      const targetUrl = `/onboarding/patient?hospital=${subdomain}`;
      console.log("Redirecting to:", targetUrl);

      // Use window.location for hard navigation to ensure clean state
      window.location.href = targetUrl;
    } catch (error) {
      console.error("Navigation error:", error);
      setError("Failed to navigate to registration. Please try again.");
    }
  };

  const handleBackToSelector = () => {
    window.location.href = "https://athaarva.com/auth";
  };

  const getBrandedStyles = () => {
    if (!hospital?.branding) return {};

    return {
      "--primary-color": hospital.branding.primary_color || "#0369a1",
      "--secondary-color": hospital.branding.secondary_color || "#0284c7",
    } as React.CSSProperties;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Hospital Not Found
            </h2>
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
          style={{
            backgroundImage: `url(${resolveAssetUrl(
              hospital.branding.background_image
            )})`,
          }}
        />
      )}

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {hospital?.branding?.logo_url ? (
              <Image
                src={resolveAssetUrl(hospital.branding.logo_url)}
                alt={hospital.hospital_name}
                width={80}
                height={80}
                className="rounded-lg"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-lg flex items-center justify-center text-white"
                style={{
                  backgroundColor:
                    hospital?.branding?.primary_color || "#0369a1",
                }}
              >
                <Building2 className="h-10 w-10" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hospital?.branding?.copy?.welcome_title ||
              `Welcome to ${hospital?.hospital_name}`}
          </h1>
          <p className="text-lg text-gray-600">
            {hospital?.branding?.copy?.welcome_subtitle ||
              "Access your healthcare portal"}
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
              <Tabs
                value={activeRole}
                onValueChange={(value) =>
                  setActiveRole(value as typeof activeRole)
                }
              >
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

                {/* Sign In/Sign Up Toggle for Patients */}
                {activeRole === "patient" && (
                  <div className="mt-4 flex justify-center">
                    <div className="inline-flex rounded-lg border border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode("signin")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          authMode === "signin"
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          authMode === "signup"
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}

                {/* Sign In Form (for all roles) */}
                {authMode === "signin" && (
                  <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={credentials.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        placeholder={
                          activeRole === "patient"
                            ? "patient@example.com"
                            : activeRole === "doctor"
                            ? `doctor@${subdomain}.com`
                            : `admin@${subdomain}.com`
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
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
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
                        backgroundColor:
                          hospital?.branding?.primary_color || "#0369a1",
                        borderColor:
                          hospital?.branding?.primary_color || "#0369a1",
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Signing In...
                        </>
                      ) : (
                        `Sign In as ${
                          activeRole.charAt(0).toUpperCase() +
                          activeRole.slice(1)
                        }`
                      )}
                    </Button>
                  </form>
                )}

                {/* Sign Up Message for Patients */}
                {authMode === "signup" && activeRole === "patient" && (
                  <div className="mt-6 space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        New Patient Registration
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Complete a quick onboarding process to register as a
                        patient at {hospital?.hospital_name}. You'll be able to
                        book appointments, access medical records, and more.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-center">
                          <span className="mr-2">✓</span>
                          Personal information & emergency contacts
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">✓</span>
                          Medical history & current medications
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">✓</span>
                          Insurance information (optional)
                        </li>
                      </ul>
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePatientSignup(e);
                        }}
                        className="w-full"
                        style={{
                          backgroundColor:
                            hospital?.branding?.primary_color || "#0369a1",
                          borderColor:
                            hospital?.branding?.primary_color || "#0369a1",
                        }}
                      >
                        Continue to Registration
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sign Up Not Available for Doctor/Admin */}
                {authMode === "signup" && activeRole !== "patient" && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      {activeRole === "doctor" &&
                        "Doctor accounts are created by hospital administrators. Please contact your hospital admin to get access."}
                      {activeRole === "admin" &&
                        "Admin accounts are created during hospital onboarding. Please contact support for assistance."}
                    </p>
                  </div>
                )}

                {/* Role-specific information (only for sign in) */}
                {authMode === "signin" && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {activeRole === "patient" && "Patient Access"}
                      {activeRole === "doctor" && "Doctor Portal"}
                      {activeRole === "admin" && "Hospital Administration"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {activeRole === "patient" &&
                        "Access your medical records, appointments, and healthcare services."}
                      {activeRole === "doctor" &&
                        "Manage patient consultations, schedules, and medical records."}
                      {activeRole === "admin" &&
                        "Hospital management, staff coordination, and administrative functions."}
                    </p>
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
