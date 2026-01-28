"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubdomainService } from "@/lib/subdomain-service";
import {
  CheckCircle,
  Building2,
  Globe,
  ArrowRight,
  Mail,
  Clock,
  Shield,
  Sparkles,
  Home,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subdomain = searchParams.get("subdomain");
  const status = searchParams.get("status"); // "approved" or null (pending)
  const [tenantUrl, setTenantUrl] = useState<string | null>(null);
  const [hospitalName, setHospitalName] = useState<string | null>(null);
  const [estimatedTime] = useState("24-48 hours");

  const isApproved = status === "approved";

  useEffect(() => {
    // Get hospital name from localStorage
    const storedName = localStorage.getItem("pending_hospital_name");
    if (storedName) {
      setHospitalName(storedName);
    }
  }, []);

  useEffect(() => {
    if (subdomain) {
      setTenantUrl(SubdomainService.getSubdomainUrl(subdomain));
    } else {
      setTenantUrl(null);
    }
  }, [subdomain]);

  const handleGoToPortal = () => {
    if (subdomain) {
      // Redirect to the hospital's login page (honors localhost/custom domains)
      window.location.href = SubdomainService.getSubdomainUrl(
        subdomain,
        "/auth"
      );
    } else {
      router.push("/");
    }
  };

  const nextSteps = [
    {
      icon: Mail,
      title: "Check Your Email",
      description:
        "You will receive your login credentials via email once your hospital is approved.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Clock,
      title: "Review Process",
      description: `Our team will review your submission within ${estimatedTime}. We may contact you for additional information.`,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: Shield,
      title: "Admin Access",
      description:
        "Once approved, you and your team members will receive separate emails with login credentials.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  // Approved state - can access the portal
  if (isApproved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardContent className="p-8 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-10 w-10 text-green-600" />
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Hospital Setup Complete!
                </h1>
                <p className="text-gray-600 mb-6">
                  Your hospital has been successfully onboarded to the Athaarva
                  platform.
                </p>
              </motion.div>

              {/* Hospital Details */}
              {tenantUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-healthcare-primary/5 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Building2 className="h-5 w-5 text-healthcare-primary" />
                    <span className="font-medium text-healthcare-primary">
                      Your Hospital Portal
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {tenantUrl.replace(/^https?:\/\//, "")}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <Button
                  onClick={handleGoToPortal}
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90 text-white"
                  size="lg"
                >
                  Access Your Hospital Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-gray-500">
                  Use the admin credentials you received via email to log in
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Pending state - waiting for approval
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full"
      >
        {/* Success Icon */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-amber-400" />
            </motion.div>
          </div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            Submission Successful!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-600">
            Your hospital onboarding has been submitted for review.
          </motion.p>
        </motion.div>

        {/* Hospital Info Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-100 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-healthcare-primary to-teal-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {hospitalName || "Your Hospital"}
                  </h2>
                  {subdomain && (
                    <p className="text-sm text-gray-500 font-mono">
                      {subdomain}.athaarva.com
                    </p>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">Pending Review</p>
                    <p className="text-sm text-amber-700">
                      Expected review time: {estimatedTime}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What's Next Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            What Happens Next?
          </h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div
                  className={`w-10 h-10 ${step.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-healthcare-primary to-teal-500 hover:from-healthcare-primary/90 hover:to-teal-500/90 gap-2"
            onClick={() => {
              window.open(
                "mailto:support@athaarva.com?subject=Hospital Onboarding Query",
                "_blank"
              );
            }}
          >
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Need help? Contact us at{" "}
          <a
            href="mailto:support@athaarva.com"
            className="text-healthcare-primary hover:underline"
          >
            support@athaarva.com
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
