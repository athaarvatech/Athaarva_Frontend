"use client";

/**
 * WelcomeModal - Phase 3: Onboarding UX Redesign
 * 
 * A welcoming modal that greets hospital administrators when they start the onboarding process.
 * Features:
 * - Personalized greeting with hospital name and admin name
 * - Animated entrance with Framer Motion
 * - Brief explanation of the onboarding process
 * - "Let's Get Started" CTA button
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Sparkles,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";

interface WelcomeModalProps {
  hospitalName?: string;
  ownerName?: string;
  ownerEmail?: string;
  isOpen: boolean;
  onStart: () => void;
  logoUrl?: string;
}

const ONBOARDING_FEATURES = [
  {
    icon: Building2,
    title: "Complete Profile Setup",
    description: "Configure your hospital's information and branding",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "All data is encrypted and HIPAA-compliant",
  },
  {
    icon: Clock,
    title: "~30 Minutes",
    description: "Complete the setup at your own pace",
  },
];

export function WelcomeModal({
  hospitalName = "Your Hospital",
  ownerName = "Administrator",
  ownerEmail,
  isOpen,
  onStart,
  logoUrl,
}: WelcomeModalProps) {
  // Extract first name from full name
  const firstName = ownerName.split(" ")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Enhanced Backdrop with stronger blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={onStart} // Allow clicking backdrop to dismiss
          />

          {/* Modal Content with enhanced entrance animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Decorative Header Gradient */}
            <div className="h-2 bg-gradient-to-r from-healthcare-primary via-healthcare-teal to-healthcare-emerald" />

            <div className="p-8">
              {/* Logo Section */}
              <div className="flex justify-center mb-6">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={hospitalName}
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-healthcare-primary to-healthcare-teal rounded-2xl flex items-center justify-center shadow-lg shadow-healthcare-primary/20">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome, {firstName}! 👋
                  </h1>
                  <p className="text-gray-600">
                    You're setting up{" "}
                    <span className="font-semibold text-healthcare-primary">
                      {hospitalName}
                    </span>{" "}
                    on the Athaarva Healthcare Platform.
                  </p>
                  {ownerEmail && (
                    <p className="text-sm text-gray-500 mt-1">
                      Invitation sent to {ownerEmail}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mb-8"
              >
                {ONBOARDING_FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-healthcare-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-healthcare-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* What You'll Need */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 p-4 rounded-lg bg-healthcare-primary/5 border border-healthcare-primary/10"
              >
                <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-healthcare-primary" />
                  What you'll need ready:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-healthcare-emerald" />
                    Hospital registration & license documents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-healthcare-emerald" />
                    Bank account details for billing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-healthcare-emerald" />
                    Hospital logo (optional - can add later)
                  </li>
                </ul>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={onStart}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-healthcare-primary to-healthcare-teal hover:from-healthcare-teal hover:to-healthcare-primary transition-all duration-300 shadow-lg shadow-healthcare-primary/20 hover:shadow-healthcare-primary/30"
                >
                  Let's Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  You can save your progress and continue later
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomeModal;
