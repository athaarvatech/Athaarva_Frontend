"use client";

/**
 * WelcomeModal - Phase 3: Onboarding UX Redesign
 * 
 * A welcoming modal that greets hospital administrators when they start the onboarding process.
 * Features:
 * - Personalized greeting with hospital name and admin name
 * - Animated entrance with Framer Motion
 * - Centered popup with strong blur background
 * - Brief explanation of the onboarding process
 * - "Let's Get Started" CTA button that triggers walkthrough
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
  X,
  Palette,
  FileText,
  Globe,
} from "lucide-react";

interface WelcomeModalProps {
  hospitalName?: string;
  ownerName?: string;
  ownerEmail?: string;
  isOpen: boolean;
  onStart: () => void;
  logoUrl?: string;
}

const ONBOARDING_STEPS = [
  {
    icon: Palette,
    title: "Design Your Website",
    description: "Choose a template and customize your hospital's online presence",
  },
  {
    icon: FileText,
    title: "Configure Documents",
    description: "Set up prescriptions, invoices, and medical certificates",
  },
  {
    icon: Globe,
    title: "Set Up Your Domain",
    description: "Get your custom hospital.athaarva.com address",
  },
  {
    icon: Shield,
    title: "Secure & Launch",
    description: "Review everything and go live with your hospital platform",
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
  const firstName = ownerName?.split(" ")[0] || "Administrator";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Strong blur backdrop - centered overlay */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/70"
          />

          {/* Modal Content - Centered with max width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 350,
              delay: 0.1 
            }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onStart}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close welcome modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Decorative Header Gradient */}
            <div className="h-2 bg-gradient-to-r from-healthcare-primary via-healthcare-teal to-healthcare-emerald" />

            <div className="p-6 sm:p-8">
              {/* Logo Section */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center mb-6"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={hospitalName}
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-healthcare-primary to-healthcare-teal rounded-2xl flex items-center justify-center shadow-xl shadow-healthcare-primary/30">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                )}
              </motion.div>

              {/* Welcome Text */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Welcome, {firstName}! 👋
                  </h1>
                  <p className="text-gray-600 text-base">
                    You're setting up{" "}
                    <span className="font-semibold text-healthcare-primary">
                      {hospitalName}
                    </span>{" "}
                    on Athaarva.
                  </p>
                  {ownerEmail && (
                    <p className="text-sm text-gray-500 mt-1">
                      Invitation sent to <span className="font-medium">{ownerEmail}</span>
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Progress Overview */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-6"
              >
                <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-healthcare-primary" />
                  What you'll do today:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ONBOARDING_STEPS.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-healthcare-primary/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-4 h-4 text-healthcare-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-tight mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Time Estimate */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 p-4 rounded-xl bg-healthcare-primary/5 border border-healthcare-primary/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-healthcare-primary" />
                    <span className="font-medium text-gray-900">Estimated time:</span>
                  </div>
                  <span className="text-healthcare-primary font-semibold">~30 minutes</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Don't worry - your progress is auto-saved, so you can pause and continue anytime.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={onStart}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-healthcare-primary to-healthcare-teal hover:from-healthcare-teal hover:to-healthcare-primary transition-all duration-300 shadow-lg shadow-healthcare-primary/25 hover:shadow-healthcare-primary/40 hover:scale-[1.02]"
                >
                  Let's Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Press Enter or click anywhere outside to begin
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
