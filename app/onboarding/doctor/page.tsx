"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  UserCheck,
  Clock,
  Sparkles,
  DollarSign,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Import step components
import PersonalInformationStep from "./components/PersonalInformationStep";
import CredentialVerificationStep from "./components/CredentialVerificationStep";
import WorkScheduleStep from "./components/WorkScheduleStep";
import CompletionStep from "./components/CompletionStep";
import MentorshipStep from "./components/MentorshipStep";
import PaymentSetupStep from "./components/PaymentSetupStep";

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{
    data: OnboardingData;
    updateData: <T extends keyof OnboardingData>(
      section: T,
      data: Partial<OnboardingData[T]>
    ) => void;
    onStepComplete: () => void;
    onNext: () => void;
    onPrevious: () => void;
  }>;
  isOptional?: boolean;
}

const steps: StepConfig[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself and your medical credentials",
    icon: UserCheck,
    component: PersonalInformationStep,
  },
  // {
  //   id: 2,
  //   title: "Credential Verification",
  //   description: "Upload and verify your medical licenses and degrees",
  //   icon: Stethoscope,
  //   component: CredentialVerificationStep,
  // },
  {
    id: 2,
    title: "Work Schedule",
    description: "Set your availability and working preferences",
    icon: Clock,
    component: WorkScheduleStep,
  },
  {
    id: 3,
    title: "Mentorship Preferences",
    description: "Set your mentorship interests and availability",
    icon: Users,
    component: MentorshipStep,
    isOptional: true,
  },
  {
    id: 4,
    title: "Payment Setup",
    description: "Configure your payment methods and preferences",
    icon: DollarSign,
    component: PaymentSetupStep,
  },
  {
    id: 5,
    title: "Complete Setup",
    description: "Review and finalize your profile",
    icon: Sparkles,
    component: CompletionStep,
  },
];

export interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    specialization: string[];
    specializations: string[];
    registrationNumber: string;
    yearsOfExperience: number;
    phone: string;
    email: string;
    profileImage?: File | null;
  };
  credentials: {
    medicalLicense: string;
    licenseState: string;
    licenseVerified: boolean;
    degree: string;
    degrees: File[];
    degreeFile?: File | null;
    hospitalPrivileges: string[];
    kycStatus: "pending" | "in-progress" | "verified" | "failed";
    kycDocuments?: File[];
    licenses: Array<{
      number: string;
      state: string;
      verified: boolean;
    }>;
  };
  workSchedule: {
    workingDays: string[];
    timeSlots: { start: string; end: string }[];
    blockedDates: string[];
    leavePolicy: string;
  };
  schedule: {
    workingHours: { start: string; end: string }[];
    availableDays: string[];
    blockedDates: Date[];
    leavePreferences: Array<{
      date: Date;
      reason: string;
    }>;
  };
  mentorship: {
    willingToMentor: boolean;
    mentorSlots: number;
    experience: string;
    expertiseAreas: string[];
  };
  payment: {
    consultationFee: number;
    telehealthFee: number;
    paymentMethods: string[];
    bankDetails: {
      accountHolder: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
    accountType: string;
    bankName?: string;
    upiId?: string;
    preferredPaymentMethod: string;
    taxInformation: {
      panCard: string;
      gstNumber?: string;
    };
  };
}

function DoctorOnboardingPage() {
  const router = useRouter();
  const { updateOnboardingStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Initialize onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      specialization: [],
      specializations: [],
      registrationNumber: "",
      yearsOfExperience: 0,
      phone: "",
      email: "",
      profileImage: null,
    },
    credentials: {
      medicalLicense: "",
      licenseState: "",
      licenseVerified: false,
      degree: "",
      degrees: [],
      degreeFile: null,
      hospitalPrivileges: [],
      kycStatus: "pending",
      kycDocuments: [],
      licenses: [],
    },
    workSchedule: {
      workingDays: [],
      timeSlots: [],
      blockedDates: [],
      leavePolicy: "",
    },
    schedule: {
      workingHours: [],
      availableDays: [],
      blockedDates: [],
      leavePreferences: [],
    },
    mentorship: {
      willingToMentor: false,
      mentorSlots: 2,
      experience: "",
      expertiseAreas: [],
    },
    payment: {
      consultationFee: 0,
      telehealthFee: 0,
      paymentMethods: [],
      bankDetails: {
        accountHolder: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
      },
      accountType: "",
      bankName: "",
      upiId: "",
      preferredPaymentMethod: "",
      taxInformation: {
        panCard: "",
        gstNumber: "",
      },
    },
  });

  // Calculate progress
  const totalSteps = steps.length;
  const progress = (completedSteps.length / totalSteps) * 100;

  // Update data handler
  const updateOnboardingData = useCallback(
    <T extends keyof OnboardingData>(
      section: T,
      data: Partial<OnboardingData[T]>
    ) => {
      setOnboardingData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));
    },
    []
  );

  const handleSubmitOnboarding = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Get the access token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Transform frontend data to backend format
      const onboardingPayload = {
        personal_info: {
          first_name: onboardingData.personalInfo.firstName || "John",
          last_name: onboardingData.personalInfo.lastName || "Doe",
          registration_number: onboardingData.credentials.medicalLicense || "REG123456",
          years_of_experience: onboardingData.personalInfo.yearsOfExperience || 0,
          consultation_fee: onboardingData.payment?.consultationFee || 0,
          telehealth_fee: onboardingData.payment?.telehealthFee || 0,
        },
        specializations: Array.isArray(onboardingData.personalInfo.specializations) && onboardingData.personalInfo.specializations.length > 0 
          ? onboardingData.personalInfo.specializations 
          : [1], // Default to General Medicine if none selected
        credentials: onboardingData.credentials.licenses?.length > 0 
          ? onboardingData.credentials.licenses.map(license => ({
              license_number: license.number,
              license_state: license.state,
              license_type: "medical",
              expiry_date: null,
              issuing_authority: null,
              document_url: null,
            })) 
          : [{
              license_number: onboardingData.credentials.medicalLicense || "LIC123456",
              license_state: onboardingData.credentials.licenseState || "CA",
              license_type: "medical",
              expiry_date: null,
              issuing_authority: null,
              document_url: null,
            }],
        degrees: [{
          degree_name: onboardingData.credentials.degree || "MBBS",
          institution: "Medical College",
          year_obtained: null,
          document_url: null,
        }],
        hospital_privileges: Array.isArray(onboardingData.credentials.hospitalPrivileges) 
          ? onboardingData.credentials.hospitalPrivileges.map(privilege => ({
              hospital_name: privilege,
              department: null,
              privilege_type: null,
              start_date: null,
              end_date: null,
            })) 
          : [],
        banking_details: {
          account_holder_name: onboardingData.payment?.bankDetails?.accountHolder || null,
          account_number: onboardingData.payment?.bankDetails?.accountNumber || null,
          ifsc_code: onboardingData.payment?.bankDetails?.ifscCode || null,
          bank_name: onboardingData.payment?.bankDetails?.bankName || null,
        },
        mentorship: {
          willing_to_mentor: onboardingData.mentorship?.willingToMentor || false,
          mentor_slots: onboardingData.mentorship?.mentorSlots || 0,
          mentorship_experience: onboardingData.mentorship?.experience || null,
        },
        availability: onboardingData.schedule?.workingHours?.filter(hours => hours.start && hours.end).map(hours => ({
          day_of_week: "monday", // Map actual days from the schedule
          start_time: `${hours.start}:00`, // Ensure format is HH:MM:SS
          end_time: `${hours.end}:00`, // Ensure format is HH:MM:SS
          is_available: true,
        })) || [
          // Default availability if none provided
          {
            day_of_week: "monday",
            start_time: "09:00:00",
            end_time: "17:00:00",
            is_available: true,
          },
          {
            day_of_week: "tuesday",
            start_time: "09:00:00",
            end_time: "17:00:00",
            is_available: true,
          },
        ],
      };

      // Submit to backend
      console.log('Submitting doctor onboarding payload:', JSON.stringify(onboardingPayload, null, 2));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/doctors/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(onboardingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend validation error:', errorData);
        throw new Error(JSON.stringify(errorData) || 'Failed to complete onboarding');
      }

      setShowCompletion(true);
      
      // Update onboarding status in auth context
      updateOnboardingStatus(true);

      // Redirect after showing completion
      setTimeout(() => {
        router.push("/doctor/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Onboarding submission failed:", error);
      // You might want to show an error notification here
    } finally {
      setIsSubmitting(false);
    }
  }, [router, onboardingData, updateOnboardingStatus]);

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitOnboarding();
    }
  }, [currentStep, totalSteps, handleSubmitOnboarding]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const markStepComplete = useCallback((stepId: number) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  }, []);

  const onStepComplete = useCallback(() => {
    markStepComplete(currentStep);
  }, [markStepComplete, currentStep]);

  const currentStepConfig = steps.find((step) => step.id === currentStep);
  const CurrentStepComponent = currentStepConfig?.component;

  if (showCompletion) {
    return (
      <CompletionStep
        data={onboardingData}
        updateData={updateOnboardingData}
        onStepComplete={() => {}}
        onNext={() => router.push("/dashboard/doctor")}
        onPrevious={goToPreviousStep}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      <div className="h-screen flex flex-col">
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-healthcare-primary to-healthcare-emerald rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Doctor Onboarding
                </h1>
                <p className="text-xs text-gray-600">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-healthcare-primary mb-1">
                {Math.round(progress)}% Complete
              </div>
              <Progress value={progress} className="h-1.5 w-24" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full flex gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Left Sidebar - Progress */}
            <div className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full flex flex-col">
                {/* Progress Header */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Progress Overview
                  </h3>
                </div>

                {/* Steps - Scrollable */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={step.id} className="relative">
                        <div className="flex items-start space-x-3">
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 text-xs font-medium",
                              currentStep === step.id
                                ? "border-healthcare-primary bg-healthcare-primary text-white"
                                : completedSteps.includes(step.id)
                                ? "border-healthcare-emerald bg-healthcare-emerald text-white"
                                : "border-gray-300 bg-white text-gray-400"
                            )}
                          >
                            {completedSteps.includes(step.id) ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              step.id
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pb-2">
                            <div
                              className={cn(
                                "text-sm font-medium mb-1 line-clamp-2",
                                currentStep === step.id
                                  ? "text-healthcare-primary"
                                  : completedSteps.includes(step.id)
                                  ? "text-healthcare-emerald"
                                  : "text-gray-500"
                              )}
                            >
                              {step.title}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {step.description}
                            </p>

                            {/* Status Indicator */}
                            {currentStep === step.id && (
                              <div className="flex items-center mt-2 text-xs text-healthcare-primary">
                                <div className="w-1.5 h-1.5 bg-healthcare-primary rounded-full animate-pulse mr-2" />
                                In Progress
                              </div>
                            )}
                            {completedSteps.includes(step.id) && (
                              <div className="flex items-center mt-2 text-xs text-healthcare-emerald">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Done
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Connecting Line */}
                        {index < steps.length - 1 && (
                          <div
                            className={cn(
                              "absolute left-3.5 top-7 w-0.5 h-6 transition-colors duration-200",
                              completedSteps.includes(step.id) ? "bg-healthcare-emerald/30" : "bg-gray-200"
                            )} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="border-t border-gray-100 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Completed</span>
                      <span className="text-healthcare-primary font-medium">
                        {completedSteps.length}/{totalSteps}
                      </span>
                    </div>

                    {/* Next Step */}
                    {currentStep < totalSteps && (
                      <div className="bg-gray-50 rounded-lg p-2 mt-3">
                        <div className="text-xs text-gray-500">Next:</div>
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {steps.find((s) => s.id === currentStep + 1)?.title}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                {/* Step Header */}
                <div className="border-b border-gray-100 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-start space-x-3">
                    {currentStepConfig && (
                      <>
                        <div className="w-8 h-8 bg-healthcare-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <currentStepConfig.icon className="w-4 h-4 text-healthcare-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-semibold text-gray-900 mb-1">
                            {currentStepConfig.title}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {currentStepConfig.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {CurrentStepComponent && (
                          <CurrentStepComponent
                            data={onboardingData}
                            updateData={updateOnboardingData}
                            onStepComplete={onStepComplete}
                            onNext={goToNextStep}
                            onPrevious={goToPreviousStep}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="border-t border-gray-100 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                      size="default"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    {/* Mobile Progress Dots */}
                    <div className="flex md:hidden items-center space-x-1">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-200",
                            currentStep === step.id
                              ? "bg-healthcare-primary w-6"
                              : completedSteps.includes(step.id)
                              ? "bg-healthcare-emerald"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={goToNextStep}
                      disabled={isSubmitting || !completedSteps.includes(currentStep)}
                      className="flex items-center gap-2 bg-gradient-to-r from-healthcare-primary to-healthcare-teal hover:from-healthcare-teal hover:to-healthcare-primary"
                      size="default"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="hidden sm:inline">
                            Submitting...
                          </span>
                        </>
                      ) : currentStep === totalSteps ? (
                        <>
                          <span className="hidden sm:inline">Complete</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorOnboardingPage;
