"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Lock,
  Building2,
  ArrowRight,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { API_CONFIG } from "@/lib/api-config";
import { cn } from "@/lib/utils";

interface LoginPageConfig {
  logo_url?: string;
  background_type?: 'image' | 'gradient' | 'solid';
  background_image?: string;
  background_gradient?: string;
  background_color?: string;
  primary_color?: string;
  secondary_color?: string;
  welcome_text?: string;
  tagline?: string;
}

interface HospitalBranding {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  hero_text?: string;
  welcome_message?: string;
  background_image_url?: string;
  // NEW: Login page specific configuration
  login_page_config?: LoginPageConfig;
}

interface Hospital {
  id: string; // Changed from number to string (UUID)
  hospital_name: string;
  subdomain: string;
  status: string;
  branding?: HospitalBranding;
}

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const trustFeatures = [
  {
    icon: Shield,
    text: "HIPAA Compliant",
  },
  {
    icon: CheckCircle,
    text: "End-to-End Encryption",
  },
  {
    icon: Lock,
    text: "Secure Authentication",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get subdomain from URL
  const getSubdomain = () => {
    if (typeof window === "undefined") return null;
    const host = window.location.host;
    const parts = host.split(".");

    // For localhost development: t.localhost:3000
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1].split(":")[0]; // Remove port
      const secondLastPart = parts[parts.length - 2];

      if (lastPart === "localhost" && parts.length === 2) {
        return parts[0];
      }

      if (
        parts.length === 3 &&
        secondLastPart === "athaarva" &&
        lastPart === "com"
      ) {
        return parts[0];
      }
    }

    return null;
  };

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchHospitalData = async () => {
      const subdomain = getSubdomain();

      if (!subdomain) {
        // No subdomain - redirect to hospital selector
        router.replace("/auth/selector");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/hospitals/by-subdomain/${subdomain}`
        );

        if (response.ok) {
          const data = await response.json();
          setHospital(data.hospital);
        } else {
          console.error("Hospital not found for subdomain:", subdomain);
          // Show error but don't redirect - let user see the branded page
          setHospital({
            id: "0",
            hospital_name: "Hospital Not Found",
            subdomain: subdomain,
            status: "inactive",
            branding: {
              primary_color: "#007C7C",
              secondary_color: "#20B2AA",
              hero_text: "Healthcare Management System",
              welcome_message:
                "Please contact support if you believe this is an error.",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching hospital data:", error);
        // Fallback hospital data for development
        setHospital({
          id: "0",
          hospital_name: "Athaarva Health",
          subdomain: subdomain || "demo",
          status: "active",
          branding: {
            primary_color: "#007C7C",
            secondary_color: "#20B2AA",
            hero_text: "Your Health, Simplified & Secure",
            welcome_message: "Welcome to our healthcare platform",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [router]);

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (authMode === "signup") {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (authMode === "signin") {
        // Handle unified sign in - auto-detects user type
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/v1/auth/unified-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          setErrors({ email: error.detail || "Invalid email or password" });
          return;
        }

        const data = await response.json();

        // Store auth token and user info
        localStorage.setItem("access_token", data.data.access_token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Redirect to appropriate dashboard based on user type
        router.push(data.data.redirect_to);
      } else {
        // Handle patient registration
        console.log("Patient registration:", formData);
        // TODO: Implement actual registration logic
        router.push("/onboarding/patient");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ email: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const primaryColor = hospital?.branding?.primary_color || "#007C7C";
  const secondaryColor = hospital?.branding?.secondary_color || "#20B2AA";
  const hospitalName = hospital?.hospital_name || "Athaarva Health";
  const heroText =
    hospital?.branding?.hero_text || "Your Health, Simplified & Secure";

  // Get login page config with fallbacks to branding
  const loginConfig = hospital?.branding?.login_page_config;
  const loginPrimaryColor = loginConfig?.primary_color || primaryColor;
  const loginSecondaryColor = loginConfig?.secondary_color || secondaryColor;
  const loginWelcomeText = loginConfig?.welcome_text || heroText;
  const loginTagline = loginConfig?.tagline || hospital?.branding?.welcome_message || "Join thousands of patients who trust us for comprehensive healthcare management with holistic care approach.";
  const loginLogoUrl = loginConfig?.logo_url || hospital?.branding?.logo_url;
  
  // Determine background style based on login_page_config
  const getBackgroundStyle = () => {
    if (loginConfig?.background_type === 'image' && loginConfig?.background_image) {
      return { type: 'image', url: loginConfig.background_image };
    }
    if (loginConfig?.background_type === 'solid' && loginConfig?.background_color) {
      return { type: 'solid', color: loginConfig.background_color };
    }
    if (loginConfig?.background_type === 'gradient' && loginConfig?.background_gradient) {
      return { type: 'gradient', gradient: loginConfig.background_gradient };
    }
    // Fallback to legacy branding
    if (hospital?.branding?.background_image_url) {
      return { type: 'image', url: hospital.branding.background_image_url };
    }
    // Default gradient
    return { 
      type: 'gradient', 
      gradient: `linear-gradient(135deg, ${loginPrimaryColor} 0%, ${loginSecondaryColor} 100%)` 
    };
  };
  
  const backgroundStyle = getBackgroundStyle();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background with Hospital Branding */}
      {backgroundStyle.type === 'image' ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundStyle.url!}
            alt="Hospital Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-80"
            style={{
              background: `linear-gradient(135deg, ${loginPrimaryColor} 0%, ${loginSecondaryColor} 100%)`,
            }}
          />
        </div>
      ) : backgroundStyle.type === 'solid' ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: backgroundStyle.color,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-90"
          style={{
            background: backgroundStyle.gradient,
          }}
        />
      )}

      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [180, 270, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-6xl mx-auto px-4 min-h-screen flex items-center z-10 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side - Hospital Branding & Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    className="w-20 h-20 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-2"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {loginLogoUrl ? (
                      <Image
                        src={loginLogoUrl}
                        alt="Hospital Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-600" />
                    )}
                  </motion.div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                    {hospitalName}
                  </h1>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-5xl font-bold text-white leading-tight drop-shadow-lg"
                >
                  {loginWelcomeText}
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-white/90 leading-relaxed max-w-md drop-shadow-md"
                >
                  {loginTagline}
                </motion.p>
              </div>

              {/* Trust Features */}
              <motion.div variants={itemVariants} className="space-y-4 mt-8">
                {trustFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-3 group cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-white font-medium text-lg group-hover:text-opacity-80 transition-colors duration-200 drop-shadow-md">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20 mt-8"
              >
                {[
                  { value: "10K+", label: "Doctors" },
                  { value: "50K+", label: "Patients" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div className="text-4xl font-bold text-white drop-shadow-lg">
                      {stat.value}
                    </motion.div>
                    <div className="text-base text-white/80 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-2xl bg-white/95 backdrop-blur-xl overflow-hidden border border-white/20">
                <CardHeader className="text-center pb-6 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-4 flex justify-center">
                      <motion.div
                        className="w-16 h-16 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-2"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {hospital?.branding?.logo_url ? (
                          <Image
                            src={hospital.branding.logo_url}
                            alt="Hospital Logo"
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Stethoscope className="w-10 h-10 text-gray-600" />
                        )}
                      </motion.div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">
                      Welcome to {hospitalName}
                    </CardTitle>
                    <p className="text-gray-700 text-base">
                      Patient access to your healthcare services
                    </p>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit}>
                    <Tabs
                      value={authMode}
                      onValueChange={(value) =>
                        setAuthMode(value as "signin" | "signup")
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger
                          value="signin"
                          className="text-sm font-medium"
                        >
                          Sign In
                        </TabsTrigger>
                        <TabsTrigger
                          value="signup"
                          className="text-sm font-medium"
                        >
                          Register
                        </TabsTrigger>
                      </TabsList>

                      {/* Sign In Tab */}
                      <TabsContent value="signin" className="space-y-4 mt-0">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key="signin"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            <div>
                              <Label
                                htmlFor="signin-email"
                                className="text-sm font-medium text-gray-700"
                              >
                                Email Address
                              </Label>
                              <Input
                                id="signin-email"
                                type="email"
                                placeholder="Enter your email"
                                className={cn(
                                  "mt-1",
                                  errors.email && "border-red-300"
                                )}
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                              />
                              {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.email}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label
                                htmlFor="signin-password"
                                className="text-sm font-medium text-gray-700"
                              >
                                Password
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  id="signin-password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className={cn(
                                    "pr-10",
                                    errors.password && "border-red-300"
                                  )}
                                  value={formData.password}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "password",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                              {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.password}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <Label
                                  htmlFor="remember"
                                  className="text-sm text-gray-600"
                                >
                                  Remember me
                                </Label>
                              </div>
                              <button
                                type="button"
                                className="text-sm font-medium hover:underline"
                                style={{ color: primaryColor }}
                              >
                                Forgot password?
                              </button>
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                type="submit"
                                className="w-full h-11 text-white font-medium"
                                style={{ backgroundColor: primaryColor }}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <User className="w-4 h-4 mr-2" />
                                )}
                                {isSubmitting ? "Signing In..." : "Sign In"}
                              </Button>
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      </TabsContent>

                      {/* Sign Up Tab */}
                      <TabsContent value="signup" className="space-y-4 mt-0">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key="signup"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label
                                  htmlFor="firstName"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  First Name
                                </Label>
                                <Input
                                  id="firstName"
                                  placeholder="John"
                                  className={cn(
                                    "mt-1",
                                    errors.firstName && "border-red-300"
                                  )}
                                  value={formData.firstName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "firstName",
                                      e.target.value
                                    )
                                  }
                                />
                                {errors.firstName && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.firstName}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label
                                  htmlFor="lastName"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  Last Name
                                </Label>
                                <Input
                                  id="lastName"
                                  placeholder="Doe"
                                  className={cn(
                                    "mt-1",
                                    errors.lastName && "border-red-300"
                                  )}
                                  value={formData.lastName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "lastName",
                                      e.target.value
                                    )
                                  }
                                />
                                {errors.lastName && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.lastName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="signup-email"
                                className="text-sm font-medium text-gray-700"
                              >
                                Email Address
                              </Label>
                              <Input
                                id="signup-email"
                                type="email"
                                placeholder="john.doe@example.com"
                                className={cn(
                                  "mt-1",
                                  errors.email && "border-red-300"
                                )}
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                              />
                              {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.email}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label
                                htmlFor="phone"
                                className="text-sm font-medium text-gray-700"
                              >
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className={cn(
                                  "mt-1",
                                  errors.phone && "border-red-300"
                                )}
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                              />
                              {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.phone}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label
                                  htmlFor="dateOfBirth"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  Date of Birth
                                </Label>
                                <Input
                                  id="dateOfBirth"
                                  type="date"
                                  className={cn(
                                    "mt-1",
                                    errors.dateOfBirth && "border-red-300"
                                  )}
                                  value={formData.dateOfBirth}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "dateOfBirth",
                                      e.target.value
                                    )
                                  }
                                />
                                {errors.dateOfBirth && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.dateOfBirth}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label
                                  htmlFor="gender"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  Gender
                                </Label>
                                <Select
                                  value={formData.gender}
                                  onValueChange={(value) =>
                                    handleInputChange("gender", value)
                                  }
                                >
                                  <SelectTrigger
                                    className={cn(
                                      "mt-1",
                                      errors.gender && "border-red-300"
                                    )}
                                  >
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                      Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="prefer-not-to-say">
                                      Prefer not to say
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.gender && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.gender}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="signup-password"
                                className="text-sm font-medium text-gray-700"
                              >
                                Password
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  id="signup-password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  className={cn(
                                    "pr-10",
                                    errors.password && "border-red-300"
                                  )}
                                  value={formData.password}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "password",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                              {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.password}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-gray-700"
                              >
                                Confirm Password
                              </Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                className={cn(
                                  "mt-1",
                                  errors.confirmPassword && "border-red-300"
                                )}
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                  handleInputChange(
                                    "confirmPassword",
                                    e.target.value
                                  )
                                }
                              />
                              {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.confirmPassword}
                                </p>
                              )}
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                type="submit"
                                className="w-full h-11 text-white font-medium"
                                style={{ backgroundColor: primaryColor }}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                )}
                                {isSubmitting
                                  ? "Creating Account..."
                                  : "Create Patient Account"}
                              </Button>
                            </motion.div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                              By creating an account, you agree to our Terms of
                              Service and Privacy Policy
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </TabsContent>
                    </Tabs>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mobile Trust Features */}
            <motion.div
              className="lg:hidden mt-8 flex justify-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-white font-medium text-center drop-shadow-md">
                    {feature.text.split(" ")[0]}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
