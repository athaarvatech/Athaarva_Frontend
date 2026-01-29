"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  AlertCircle, 
  ArrowLeft, 
  Mail, 
  Home,
  Clock,
  ShieldAlert,
  WifiOff,
  Link2Off,
  CheckCircle2,
  RefreshCw,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function InvalidTokenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const reason = searchParams?.get("reason") || "invalid";
  const email = searchParams?.get("email");
  const message = searchParams?.get("message");

  const getErrorMessage = () => {
    switch (reason) {
      case "missing":
        return {
          title: "No Invitation Token",
          description: "You're trying to access the hospital onboarding page without a valid invitation link. Please check your email for the invitation from Athaarva.",
          icon: Link2Off,
          color: "amber",
          showRequestNew: true,
        };
      case "malformed":
        return {
          title: "Invalid Link Format",
          description: "The invitation link appears to be incomplete or corrupted. Please copy the complete link from your email and try again.",
          icon: Link2Off,
          color: "red",
          showRequestNew: true,
        };
      case "expired":
        return {
          title: "Invitation Expired",
          description: "Your hospital onboarding invitation has expired. Invitation links are valid for 7 days from the date they were sent.",
          icon: Clock,
          color: "amber",
          showRequestNew: true,
        };
      case "revoked":
        return {
          title: "Invitation Revoked",
          description: "This invitation has been revoked by the platform administrator. Please contact support for assistance.",
          icon: ShieldAlert,
          color: "red",
          showRequestNew: false,
        };
      case "accepted":
        return {
          title: "Invitation Already Used",
          description: "This invitation has already been accepted and the onboarding process has been completed. If you're the hospital administrator, please log in to access your dashboard.",
          icon: CheckCircle2,
          color: "blue",
          showLogin: true,
          showRequestNew: false,
        };
      case "network_error":
        return {
          title: "Connection Error",
          description: message 
            ? `We couldn't verify your invitation: ${decodeURIComponent(message)}` 
            : "We couldn't connect to our servers to verify your invitation. Please check your internet connection and try again.",
          icon: WifiOff,
          color: "amber",
          showRetry: true,
          showRequestNew: false,
        };
      case "validation_failed":
        return {
          title: "Verification Failed",
          description: "We encountered an error while verifying your invitation. Please try again or contact support if the issue persists.",
          icon: AlertCircle,
          color: "red",
          showRetry: true,
          showRequestNew: true,
        };
      default:
        return {
          title: "Invalid Invitation",
          description: "The onboarding link you followed is invalid or has been tampered with. Please check your email for the correct invitation link.",
          icon: AlertCircle,
          color: "red",
          showRequestNew: true,
        };
    }
  };

  const error = getErrorMessage();
  const IconComponent = error.icon;

  const getIconColors = () => {
    switch (error.color) {
      case "amber":
        return "bg-amber-100 text-amber-600";
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "green":
        return "bg-green-100 text-green-600";
      default:
        return "bg-red-100 text-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-healthcare-emerald/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-2 overflow-hidden">
          {/* Colored top bar based on error type */}
          <div className={`h-2 ${
            error.color === "amber" ? "bg-amber-500" :
            error.color === "blue" ? "bg-blue-500" :
            error.color === "green" ? "bg-green-500" :
            "bg-red-500"
          }`} />
          
          <CardContent className="p-8 md:p-12">
            {/* Error Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="flex justify-center mb-6"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getIconColors()}`}>
                <IconComponent className="w-10 h-10" />
              </div>
            </motion.div>

            {/* Error Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 text-center mb-4"
            >
              {error.title}
            </motion.h1>

            {/* Error Description */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-gray-600 text-center mb-8 leading-relaxed"
            >
              {error.description}
            </motion.p>

            {/* Email Display (if available) */}
            {email && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Invitation sent to: <strong>{email}</strong>
                  </span>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              {/* Show retry button for network errors */}
              {error.showRetry && (
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              )}

              {/* Show login button if invitation was already accepted */}
              {error.showLogin && (
                <Button
                  onClick={() => router.push("/auth/selector")}
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Hospital Login
                </Button>
              )}

              {/* Request new invitation */}
              {error.showRequestNew && (
                <Button
                  onClick={() => window.location.href = "mailto:support@athaarva.com?subject=New Hospital Onboarding Invitation Request"}
                  variant={error.showRetry || error.showLogin ? "outline" : "default"}
                  className={error.showRetry || error.showLogin ? "w-full" : "w-full bg-healthcare-primary hover:bg-healthcare-primary/90"}
                  size="lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request New Invitation
                </Button>
              )}

              {/* Back to home - always shown */}
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </motion.div>

            {/* Contact Support */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 pt-8 border-t border-gray-200"
            >
              <h3 className="text-sm font-semibold text-gray-900 text-center mb-3">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Our support team is here to help you get started with Athaarva.
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
                  className="text-healthcare-primary hover:text-healthcare-primary/80 font-medium flex items-center"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  +91 1800 123 456
                </a>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Athaarva Healthcare Platform • Secure Hospital Onboarding
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function InvalidTokenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-healthcare-emerald/5 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4" />
          <div className="w-48 h-6 bg-gray-200 rounded mb-2" />
          <div className="w-64 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <InvalidTokenContent />
    </Suspense>
  );
}
