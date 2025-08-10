"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Calendar,
  User,
  GraduationCap,
  Clock,
  CreditCard,
  Users,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  Award,
  Shield,
  Clock4,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "../page";

interface CompletionStepProps {
  data: OnboardingData;
  updateData: <T extends keyof OnboardingData>(
    section: T,
    data: Partial<OnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const nextSteps = [
  {
    icon: FileText,
    title: "Complete Profile Review",
    description: "Our team will review your credentials within 24-48 hours",
    timeframe: "1-2 business days",
    status: "pending",
  },
  {
    icon: Shield,
    title: "Background Verification",
    description: "Complete background check and credential verification",
    timeframe: "2-3 business days",
    status: "pending",
  },
  {
    icon: CalendarCheck,
    title: "Schedule Setup",
    description: "Your availability will be synced with the booking system",
    timeframe: "Immediate",
    status: "ready",
  },
  {
    icon: Star,
    title: "Profile Goes Live",
    description: "Start receiving patient appointments and consultations",
    timeframe: "3-5 business days",
    status: "pending",
  },
];

const quickActions = [
  {
    icon: Calendar,
    title: "View Schedule",
    description: "Manage your availability and appointments",
    action: "schedule",
    color: "healthcare-primary"
  },
  {
    icon: User,
    title: "Complete Profile",
    description: "Add bio, photos, and additional details",
    action: "profile",
    color: "healthcare-emerald"
  },
  {
    icon: Download,
    title: "Download App",
    description: "Get the mobile app for better experience",
    action: "download",
    color: "healthcare-teal"
  },
  {
    icon: ExternalLink,
    title: "Practice Dashboard",
    description: "Access your doctor dashboard",
    action: "dashboard",
    color: "healthcare-indigo"
  }
];

function CompletionStep({ data, onStepComplete }: CompletionStepProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const personalInfo = data.personalInfo;
  const credentials = data.credentials;
  const workSchedule = data.workSchedule;
  const payment = data.payment;
  const mentorship = data.mentorship;

  // Auto-complete this step when component loads
  useEffect(() => {
    const timer = setTimeout(() => {
      onStepComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onStepComplete]);

  // Calculate profile completion percentage
  const calculateCompletion = useCallback(() => {
    let completed = 0;
    let total = 3; // Reduced from 5 to 3 since we removed payment and mentorship

    // Personal Info (required)
    if (personalInfo.firstName && personalInfo.lastName && personalInfo.email) {
      completed++;
    }

    // Credentials (required)
    if (credentials.medicalLicense && credentials.degree) {
      completed++;
    }

    // Work Schedule (required)
    if (
      workSchedule.workingDays.length > 0 &&
      workSchedule.timeSlots.length > 0
    ) {
      completed++;
    }

    return Math.round((completed / total) * 100);
  }, [personalInfo, credentials, workSchedule]);

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    setIsCompleting(true);

    // Simulate navigation/action
    setTimeout(() => {
      switch (action) {
        case "schedule":
          console.log("Navigating to schedule...");
          break;
        case "profile":
          console.log("Navigating to profile...");
          break;
        case "download":
          console.log("Opening app download...");
          break;
        case "dashboard":
          console.log("Navigating to dashboard...");
          break;
        default:
          break;
      }
      setIsCompleting(false);
    }, 1000);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900"
          >
            Welcome to HealthCare!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mt-2"
          >
            Your onboarding is complete. You&apos;re ready to start your journey
            with us.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center space-x-4"
        >
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Profile {completionPercentage}% Complete
          </Badge>
          <Badge variant="outline" className="border-healthcare-primary text-healthcare-primary">
            <Clock4 className="w-3 h-3 mr-1" />
            Ready for Review
          </Badge>
        </motion.div>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border border-gray-100 bg-gradient-to-br from-healthcare-cool-white to-white">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-healthcare-primary" />
              Profile Summary
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <div className="w-2 h-2 bg-healthcare-primary rounded-full mr-2" />
                  Personal Information
                </h4>
                <div className="text-sm text-gray-600 space-y-1 pl-4">
                  <div>
                    Dr. {personalInfo.firstName} {personalInfo.lastName}
                  </div>
                  <div>{personalInfo.specialization.join(", ")}</div>
                  <div>{personalInfo.yearsOfExperience} years experience</div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                    Registration: {personalInfo.registrationNumber}
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <div className="w-2 h-2 bg-healthcare-emerald rounded-full mr-2" />
                  Credentials
                </h4>
                <div className="text-sm text-gray-600 space-y-1 pl-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                    Medical License Verified
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                    Degree Certificate Uploaded
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                    KYC Documents Submitted
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <div className="w-2 h-2 bg-healthcare-teal rounded-full mr-2" />
                  Availability
                </h4>
                <div className="text-sm text-gray-600 space-y-1 pl-4">
                  <div>{workSchedule.workingDays.length} working days</div>
                  <div>
                    {workSchedule.timeSlots.length} time slots configured
                  </div>
                  {workSchedule.blockedDates.length > 0 && (
                    <div>{workSchedule.blockedDates.length} blocked dates</div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <div className="w-2 h-2 bg-healthcare-indigo rounded-full mr-2" />
                  Payment Setup
                </h4>
                <div className="text-sm text-gray-600 space-y-1 pl-4">
                  <div>₹{payment.consultationFee} consultation fee</div>
                  <div>{payment.paymentMethods.length} payment method(s)</div>
                  {payment.bankDetails?.accountNumber && (
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                      Bank details verified
                    </div>
                  )}
                </div>
              </div>
            </div>

            {mentorship.willingToMentor && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-healthcare-primary" />
                    Mentorship Program
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1 pl-6">
                    <div>Available for {mentorship.mentorSlots} mentee(s)</div>
                    <div>{mentorship.expertiseAreas.length} expertise areas</div>
                    <Badge variant="secondary" className="bg-healthcare-primary/10 text-healthcare-primary">
                      Mentor Badge
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="border border-gray-100">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-healthcare-primary" />
              What Happens Next?
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      step.status === "ready" ? "bg-green-100" : "bg-gray-200"
                    )}
                  >
                    <step.icon
                      className={cn(
                        "w-5 h-5",
                        step.status === "ready"
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {step.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          step.status === "ready"
                            ? "border-green-200 text-green-700 bg-green-50"
                            : "border-gray-200 text-gray-600"
                        )}
                      >
                        {step.timeframe}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="border border-gray-100">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-600">
              Get started with these common tasks
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction(action.action)}
                    disabled={isCompleting}
                    className={cn(
                      "w-full h-auto p-4 justify-start hover:border-healthcare-primary hover:bg-healthcare-primary/5 transition-all duration-200",
                      isCompleting && "opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mr-4",
                        `bg-${action.color}/10`
                      )}
                    >
                      <action.icon
                        className={cn("w-5 h-5", `text-${action.color}`)}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {action.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="text-center p-6 bg-gradient-to-br from-healthcare-primary/5 to-healthcare-teal/5 rounded-lg border border-healthcare-primary/10"
      >
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Need Help?</h4>
          <p className="text-sm text-gray-600">
            Our support team is here to help you get started. Reach out anytime!
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="mailto:support@healthcare.com" className="text-healthcare-primary hover:text-healthcare-teal transition-colors">
              support@healthcare.com
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-healthcare-primary">+1 (555) 123-4567</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CompletionStep;
