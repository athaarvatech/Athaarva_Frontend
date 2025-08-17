"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  Phone,
  Shield,
  CheckCircle,
  Lock,
  User,
  Stethoscope,
  Calendar,
  Users,
  Award,
  Star,
} from "lucide-react";
import { HospitalProfile } from "@/lib/hospital-service";

interface HospitalLandingPageProps {
  hospital: HospitalProfile;
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

const services = [
  {
    icon: Calendar,
    title: "Book Appointments",
    description: "Schedule consultations with our expert doctors",
  },
  {
    icon: Stethoscope,
    title: "Telemedicine",
    description: "Connect with doctors from the comfort of your home",
  },
  {
    icon: Users,
    title: "Patient Portal",
    description: "Access your medical records and test results",
  },
  {
    icon: Star,
    title: "Quality Care",
    description: "Evidence-based treatment with compassionate care",
  },
];

export default function HospitalLandingPage({
  hospital,
}: HospitalLandingPageProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword] = useState(false);

  const theme = {
    primaryColor: hospital.primary_color || "#007C7C",
    secondaryColor: hospital.secondary_color || "#20B2AA",
  };

  return (
    <div
      className="min-h-screen overflow-hidden flex flex-col"
      style={{
        background: hospital.background_image_url
          ? `url(${hospital.background_image_url})`
          : "linear-gradient(to bottom right, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced Overlay with Gradient and Blur */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {hospital.logo_url ? (
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-1">
                  <Image
                    src={hospital.logo_url}
                    alt={`${hospital.hospital_name} Logo`}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-xl shadow-lg border border-white/30 flex items-center justify-center"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-lg">
                  {hospital.hospital_name}
                </h1>
                <p className="text-sm text-white/80 drop-shadow-md">
                  Healthcare Excellence Since Inception
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#services"
                className="text-white/90 hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-white/90 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-white/90 hover:text-white transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hospital Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl font-bold text-white leading-tight drop-shadow-lg mb-4"
                >
                  Welcome to
                  <br />
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r drop-shadow-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    }}
                  >
                    {hospital.hospital_name}
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-white/90 leading-relaxed drop-shadow-md"
                >
                  Your trusted healthcare partner providing comprehensive
                  medical services with cutting-edge technology and
                  compassionate care.
                </motion.p>

                {/* Hospital Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-white/80" />
                    <div>
                      <p className="text-sm text-white/60">Location</p>
                      <p className="text-white font-medium text-sm">
                        {hospital.city}, {hospital.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-white/80" />
                    <div>
                      <p className="text-sm text-white/60">Capacity</p>
                      <p className="text-white font-medium text-sm">
                        {hospital.bed_capacity} Beds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-white/80" />
                    <div>
                      <p className="text-sm text-white/60">Phone</p>
                      <p className="text-white font-medium text-sm">
                        {hospital.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-white/80" />
                    <div>
                      <p className="text-sm text-white/60">License</p>
                      <p className="text-white font-medium text-sm">
                        {hospital.license_number}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Services Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center"
                  >
                    <service.icon className="w-8 h-8 text-white mx-auto mb-2" />
                    <h3 className="text-white font-medium text-sm mb-1">
                      {service.title}
                    </h3>
                    <p className="text-white/70 text-xs">
                      {service.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Trust Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex justify-center gap-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
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

            {/* Right Side - Authentication Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
            >
              <Card className="shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20">
                <CardHeader className="text-center pb-4 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-sm">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Access Your Health Portal
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Sign in to manage your healthcare journey
                  </p>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
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
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4 mt-0">
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password
                          </Label>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="mt-1"
                          />
                        </div>
                        <Button
                          className="w-full text-white"
                          style={{
                            backgroundColor: theme.primaryColor,
                            borderColor: theme.primaryColor,
                          }}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4 mt-0">
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="fullname"
                            className="text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </Label>
                          <Input
                            id="fullname"
                            type="text"
                            placeholder="Your full name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="signup-email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email
                          </Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your@email.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="signup-password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password
                          </Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            className="mt-1"
                          />
                        </div>
                        <Button
                          className="w-full text-white"
                          style={{
                            backgroundColor: theme.primaryColor,
                            borderColor: theme.primaryColor,
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Create Account
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="text-center space-y-2">
                    <button
                      className="text-sm hover:underline"
                      style={{ color: theme.secondaryColor }}
                    >
                      Forgot your password?
                    </button>
                    <div className="text-xs text-gray-500">
                      Need help? Contact{" "}
                      <button
                        className="hover:underline"
                        style={{ color: theme.primaryColor }}
                      >
                        support
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm">
                © 2024 {hospital.hospital_name}. All rights reserved.
              </p>
              <p className="text-white/60 text-xs">
                Powered by Athaarva Healthcare Platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-white/80 text-xs">Emergency</p>
                <p className="text-white font-medium text-sm">
                  {hospital.phone}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-xs">Email</p>
                <p className="text-white font-medium text-sm">
                  {hospital.official_email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
