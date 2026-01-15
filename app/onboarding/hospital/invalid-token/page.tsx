"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  AlertCircle, 
  ArrowLeft, 
  Mail, 
  Home,
  Clock,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InvalidTokenPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const reason = searchParams?.get("reason") || "invalid";
  const email = searchParams?.get("email");

  const getErrorMessage = () => {
    switch (reason) {
      case "expired":
        return {
          title: "Invitation Expired",
          description: "Your hospital onboarding invitation has expired. Invitation links are valid for 7 days from the date they were sent.",
          icon: Clock,
          color: "amber",
        };
      case "revoked":
        return {
          title: "Invitation Revoked",
          description: "This invitation has been revoked by the platform administrator. Please contact support for assistance.",
          icon: ShieldAlert,
          color: "red",
        };
      case "accepted":
        return {
          title: "Invitation Already Used",
          description: "This invitation has already been accepted. If you're the hospital administrator, please log in to continue.",
          icon: ShieldAlert,
          color: "blue",
        };
      default:
        return {
          title: "Invalid Invitation Token",
          description: "The onboarding link you followed is invalid or has been tampered with. Please check your email for the correct link.",
          icon: AlertCircle,
          color: "red",
        };
    }
  };

  const error = getErrorMessage();
  const IconComponent = error.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-healthcare-emerald/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-2">
          <CardContent className="p-8 md:p-12">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  error.color === "amber"
                    ? "bg-amber-100 text-amber-600"
                    : error.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <IconComponent className="w-10 h-10" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              {error.title}
            </h1>

            {/* Error Description */}
            <p className="text-base text-gray-600 text-center mb-8 leading-relaxed">
              {error.description}
            </p>

            {/* Email Display (if available) */}
            {email && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Invitation sent to: <strong>{email}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {reason === "accepted" && (
                <Button
                  onClick={() => router.push("/auth")}
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Login
                </Button>
              )}

              <Button
                onClick={() => router.push("/")}
                variant={reason === "accepted" ? "outline" : "default"}
                className={
                  reason === "accepted"
                    ? "w-full"
                    : "w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                }
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>

            {/* Contact Support */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 text-center mb-3">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                If you believe this is an error or need a new invitation, please contact our support team:
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                <a
                  href="mailto:support@athaarva.com"
                  className="text-healthcare-primary hover:text-healthcare-primary/80 font-medium flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  support@athaarva.com
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a
                  href="tel:+911800123456"
                  className="text-healthcare-primary hover:text-healthcare-primary/80 font-medium"
                >
                  +91 1800 123 456
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Athaarva Healthcare Platform • Secure Hospital Onboarding
          </p>
        </div>
      </motion.div>
    </div>
  );
}
