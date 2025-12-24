"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Shield, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";
import MedicalLogo from "@/components/ui/MedicalLogo";
import Image from "next/image";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//type UserType = "patient" | "doctor" | "hospital";

// const userTypes = [
//   {
//     id: "patient" as UserType,
//     title: "Patient",
//     subtitle: "Access your health records",
//     icon: User,
//     gradient: "from-blue-500 to-blue-600"
//   },
//   {
//     id: "doctor" as UserType,
//     title: "Doctor",
//     subtitle: "Manage your practice",
//     icon: Stethoscope,
//     gradient: "from-emerald-500 to-emerald-600"
//   },
//   {
//     id: "hospital" as UserType,
//     title: "Hospital",
//     subtitle: "Complete system access",
//     icon: Building2,
//     gradient: "from-purple-500 to-purple-600"
//   }
// ];

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

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { data } = useHospitalOnboarding();

  // Authentication mode and UI state
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedUserType, setSelectedUserType] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  // Handle tab change and reset password visibility
  const handleTabChange = (value: string) => {
    setAuthMode(value as "signin" | "signup");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden flex items-center justify-center fixed inset-0 z-50"
      style={{
        background: data.branding.backgroundImageUrl
          ? `url(${data.branding.backgroundImageUrl})`
          : "linear-gradient(to bottom right, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced Overlay with Gradient and Blur */}
      <div className="absolute inset-0">
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40" />
        {/* Additional blur overlay for smoother background blend */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        {/* Subtle color overlay to match branding */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${
              data.branding.primaryColor || "#007C7C"
            } 0%, ${data.branding.secondaryColor || "#20B2AA"} 100%)`,
          }}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-all backdrop-blur-md border border-white/20 shadow-lg"
      >
        <X className="w-5 h-5 text-gray-800" />
      </button>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-32 -right-32 w-64 h-64 bg-healthcare-primary/5 rounded-full blur-3xl"
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
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-healthcare-emerald/5 rounded-full blur-3xl"
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
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 h-full flex items-center z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-6"
          >
            {/* Content Container with Better Background */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    className="w-18 h-18 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: data.branding.logoUrl
                        ? "white"
                        : data.branding.primaryColor || "#007C7C",
                    }}
                  >
                    {data.branding.logoUrl ? (
                      <Image
                        src={data.branding.logoUrl}
                        alt="Hospital Logo"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <MedicalLogo
                        width={50}
                        height={50}
                        className="text-white"
                      />
                    )}
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    {data.hospitalBasics.hospitalName || "Atharva"}
                  </h1>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl font-bold text-white leading-tight drop-shadow-lg"
                >
                  Your Health,
                  <br />
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r drop-shadow-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${
                        data.branding.primaryColor || "#007C7C"
                      }, ${data.branding.secondaryColor || "#20B2AA"})`,
                    }}
                  >
                    Simplified & Secure
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-white/90 leading-relaxed max-w-md drop-shadow-md"
                >
                  Join thousands of healthcare providers and patients who trust
                  us for comprehensive healthcare management with holistic care
                  approach.
                </motion.p>
              </div>

              {/* Trust Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-3 mt-6"
              >
                {trustFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 group cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="text-white font-medium group-hover:text-opacity-80 transition-colors duration-200 drop-shadow-md">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20 mt-6"
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
                    <motion.div className="text-3xl font-bold text-white drop-shadow-lg">
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-white/80 font-medium">
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
                <CardHeader className="text-center pb-4 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">
                      Welcome to {data.hospitalBasics.hospitalName || "Atharva"}
                    </CardTitle>
                    <p className="text-gray-700">
                      Secure access to your healthcare services
                    </p>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Tabs
                    value={authMode}
                    onValueChange={handleTabChange}
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
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4 mt-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key="signin"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-4"
                        >
                          {/* User Type Selection */}
                          {/* <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">
                              Select your role
                            </Label>
                            <RadioGroup
                              value={selectedUserType}
                              onValueChange={(value) => setSelectedUserType(value as UserType)}
                              className="grid grid-cols-3 gap-3"
                            >
                              {userTypes.map((type) => (
                                <motion.div
                                  key={type.id}
                                  initial={{ scale: 1 }}
                                  animate={selectedUserType === type.id ? { scale: 1.05 } : { scale: 1 }}
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                  className="relative"
                                >
                                  <Label
                                    htmlFor={type.id}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer h-full min-h-[100px] space-y-2 transition-all duration-200"
                                  >
                                    <RadioGroupItem
                                      value={type.id}
                                      id={type.id}
                                      className="sr-only"
                                    />
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${type.gradient} flex items-center justify-center`}>
                                      <type.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-gray-900 text-sm">{type.title}</div>
                                      <div className="text-xs text-gray-500 mt-1">{type.subtitle}</div>
                                    </div>
                                  </Label>
                                </motion.div>
                              ))}
                            </RadioGroup>
                          </div> */}

                          {/* Sign In Form */}
                          <div className="space-y-4">
                            <motion.div>
                              <Label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                              >
                                Email Address
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="mt-1"
                                disabled
                              />
                            </motion.div>

                            <motion.div>
                              <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                              >
                                Password
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="pr-10"
                                  disabled
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
                            </motion.div>

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
                                className="text-sm font-medium hover:underline"
                                style={{
                                  color:
                                    data.branding.primaryColor || "#007C7C",
                                }}
                              >
                                Forgot password?
                              </button>
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                className="w-full h-11 text-white font-medium"
                                style={{
                                  backgroundColor:
                                    data.branding.primaryColor || "#007C7C",
                                }}
                                disabled
                              >
                                {/* <LogIn className="w-4 h-4 mr-2" />
                                Sign In as {userTypes.find(t => t.id === selectedUserType)?.title} */}
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4 mt-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key="signup"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-4"
                        >
                          {selectedUserType !== "patient" && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start space-x-2">
                                <div className="text-blue-600">ℹ️</div>
                                <div>
                                  <h4 className="font-medium text-blue-900 text-sm">
                                    Registration Notice
                                  </h4>
                                  <p className="text-xs text-blue-700 mt-1">
                                    {selectedUserType === "doctor"
                                      ? "Doctor registration requires administrator approval. Please contact your hospital administrator."
                                      : "Hospital registration requires verification. Please contact our support team."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Sign Up Form */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor="firstName"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  First Name
                                </Label>
                                <Input
                                  id="firstName"
                                  type="text"
                                  placeholder="John"
                                  className="mt-1"
                                  disabled
                                />
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
                                  type="text"
                                  placeholder="Doe"
                                  className="mt-1"
                                  disabled
                                />
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="signupEmail"
                                className="text-sm font-medium text-gray-700"
                              >
                                Email Address
                              </Label>
                              <Input
                                id="signupEmail"
                                type="email"
                                placeholder="john.doe@example.com"
                                className="mt-1"
                                disabled
                              />
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
                                placeholder="+1 (555) 000-0000"
                                className="mt-1"
                                disabled
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="signupPassword"
                                className="text-sm font-medium text-gray-700"
                              >
                                Password
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  id="signupPassword"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  className="pr-10"
                                  disabled
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
                            </div>

                            <div>
                              <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-gray-700"
                              >
                                Confirm Password
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  id="confirmPassword"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Confirm your password"
                                  className="pr-10"
                                  disabled
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2">
                              <Checkbox id="terms" className="mt-1" />
                              <Label
                                htmlFor="terms"
                                className="text-sm text-gray-600"
                              >
                                I agree to the Terms of Service and Privacy
                                Policy
                              </Label>
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                className="w-full h-11 text-white font-medium"
                                style={{
                                  backgroundColor:
                                    data.branding.primaryColor || "#007C7C",
                                }}
                                disabled
                              >
                                {/* <UserPlus className="w-4 h-4 mr-2" />
                                Create {userTypes.find(t => t.id === selectedUserType)?.title} Account */}
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </TabsContent>
                  </Tabs>

                  {/* Preview Notice */}
                  <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-2">
                      <div className="text-amber-600">⚠️</div>
                      <div>
                        <h4 className="font-medium text-amber-900 text-sm">
                          Preview Mode
                        </h4>
                        <p className="text-xs text-amber-700 mt-1">
                          This is a live preview of your authentication page.
                          All forms are disabled for demonstration purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mobile Trust Features */}
            <motion.div
              className="lg:hidden mt-6 flex justify-center gap-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-5 h-5 text-white drop-shadow-lg" />
                  <span className="text-xs text-white font-medium text-center drop-shadow-md">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
