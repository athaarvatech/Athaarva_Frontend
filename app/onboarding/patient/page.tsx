"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Heart,
  Shield,
  FileText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import step components
import BasicInformationStep from "./components/BasicInformationStep";
import MedicalHistoryStep from "./components/MedicalHistoryStep";
import FinalReviewStep from "./components/FinalReviewStep";
import InsuranceSetupStep from "./components/InsuranceSetupStep";

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{
    data: PatientOnboardingData;
    updateData: <T extends keyof PatientOnboardingData>(
      section: T,
      data: Partial<PatientOnboardingData[T]>
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
    title: "Basic Information",
    description: "Tell us about yourself and your contact details",
    icon: User,
    component: BasicInformationStep,
  },
  {
    id: 2,
    title: "Medical History",
    description: "Share your medical background and current conditions",
    icon: Heart,
    component: MedicalHistoryStep,
  },
  {
    id: 3,
    title: "Insurance Setup",
    description: "Add your insurance information for billing",
    icon: Shield,
    component: InsuranceSetupStep,
  },
  {
    id: 4,
    title: "Final Review & Consent",
    description: "Review your information and accept terms",
    icon: FileText,
    component: FinalReviewStep,
  },
];

export interface PatientOnboardingData {
  basicInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    abhaId: string;
    phone: string;
    email: string;
    emergencyContact: {
      name: string;
      relation: string;
      phone: string;
    };
    address: string;
  };
  medicalHistory: {
    allergies: string[];
    chronicIllnesses: string[];
    pastSurgeries: string;
    currentMedications: string[];
    vaccinations: Array<{
      vaccine: string;
      date: string;
    }>;
    noMedicalHistory: boolean;
  };
  insurance: {
    hasInsurance: boolean;
    provider: string;
    policyNumber: string;
    coverageType: string;
    validTill: string;
    coverageAmount: string;
    nomineeName: string;
    nomineeRelation: string;
    uploadedDocuments: File[];
  };
  consent: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    healthRiskSurvey: {
      smoking: string;
      alcohol: string;
      exercise: string;
    };
  };
}

function PatientOnboardingPage() {
  const router = useRouter();
  const { updateOnboardingStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize onboarding data
  const [onboardingData, setOnboardingData] = useState<PatientOnboardingData>({
    basicInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      abhaId: "",
      phone: "",
      email: "",
      emergencyContact: {
        name: "",
        relation: "",
        phone: "",
      },
      address: "",
    },
    medicalHistory: {
      allergies: [],
      chronicIllnesses: [],
      pastSurgeries: "",
      currentMedications: [],
      vaccinations: [],
      noMedicalHistory: false,
    },
    insurance: {
      hasInsurance: false,
      provider: "",
      policyNumber: "",
      coverageType: "",
      validTill: "",
      coverageAmount: "",
      nomineeName: "",
      nomineeRelation: "",
      uploadedDocuments: [],
    },
    consent: {
      termsAccepted: false,
      privacyAccepted: false,
      healthRiskSurvey: {
        smoking: "",
        alcohol: "",
        exercise: "",
      },
    },
  });

  // Calculate progress
  const totalSteps = steps.length;
  const progress = (completedSteps.length / totalSteps) * 100;

  // Update data handler
  const updateOnboardingData = <T extends keyof PatientOnboardingData>(
    section: T,
    data: Partial<PatientOnboardingData[T]>
  ) => {
    setOnboardingData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitOnboarding();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleSubmitOnboarding = async () => {
    setIsSubmitting(true);

    try {
      // Get the access token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Transform frontend data to backend format
      const onboardingPayload = {
        basic_info: {
          first_name: onboardingData.basicInfo.firstName,
          last_name: onboardingData.basicInfo.lastName,
          date_of_birth: onboardingData.basicInfo.dateOfBirth,
          gender: onboardingData.basicInfo.gender.toLowerCase(),
          abha_id: onboardingData.basicInfo.abhaId || null,
          address: onboardingData.basicInfo.address || null,
          emergency_contact_name: onboardingData.basicInfo.emergencyContact.name || null,
          emergency_contact_relation: onboardingData.basicInfo.emergencyContact.relation || null,
          emergency_contact_phone: onboardingData.basicInfo.emergencyContact.phone || null,
        },
        medical_history: {
          allergies: onboardingData.medicalHistory.allergies || [],
          chronic_illnesses: onboardingData.medicalHistory.chronicIllnesses || [],
          past_surgeries: onboardingData.medicalHistory.pastSurgeries || null,
          current_medications: onboardingData.medicalHistory.currentMedications || [],
          no_medical_history: onboardingData.medicalHistory.noMedicalHistory || false,
        },
        vaccinations: onboardingData.medicalHistory.vaccinations?.map(v => ({
          vaccine_name: v.vaccine,
          vaccination_date: v.date,
        })) || [],
        insurance: {
          provider: onboardingData.insurance.hasInsurance ? onboardingData.insurance.provider : null,
          policy_number: onboardingData.insurance.hasInsurance ? onboardingData.insurance.policyNumber : null,
          valid_till: onboardingData.insurance.hasInsurance ? onboardingData.insurance.validTill : null,
          nominee_name: onboardingData.insurance.hasInsurance ? onboardingData.insurance.nomineeName : null,
          nominee_relation: onboardingData.insurance.hasInsurance ? onboardingData.insurance.nomineeRelation : null,
        },
        health_risk_survey: {
          smoking_status: onboardingData.consent.healthRiskSurvey.smoking || "never",
          alcohol_consumption: onboardingData.consent.healthRiskSurvey.alcohol || "never",
          exercise_frequency: onboardingData.consent.healthRiskSurvey.exercise || "never",
        },
        consent: {
          terms_accepted: onboardingData.consent.termsAccepted,
          privacy_accepted: onboardingData.consent.privacyAccepted,
          terms_version: "1.0",
          privacy_version: "1.0",
          ip_address: null,
          user_agent: navigator.userAgent,
        },
      };

      // Submit to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/patients/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(onboardingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to complete onboarding');
      }

      // Show success message and redirect
      await updateOnboardingStatus(true);
      setTimeout(() => {
        router.push("/patient/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Onboarding submission failed:", error);
      // You might want to show an error notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepConfig = steps.find((step) => step.id === currentStep);
  const CurrentStepComponent = currentStepConfig?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-blue-50">
      <div className="h-screen flex flex-col">
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-healthcare-primary to-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Patient Registration
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
                    Registration Progress
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
                                ? "border-blue-500 bg-blue-500 text-white"
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
                                  ? "text-blue-500"
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
                              <div className="flex items-center mt-2 text-xs text-blue-500">
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
                              completedSteps.includes(step.id)
                                ? "bg-blue-500/30"
                                : "bg-gray-200"
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

                    {/* Security Note */}
                    <div className="bg-blue-50 rounded-lg p-2 mt-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        <div className="text-xs text-blue-600">
                          HIPAA Secure
                        </div>
                      </div>
                    </div>

                    {/* Next Step */}
                    {currentStep < totalSteps && (
                      <div className="bg-gray-50 rounded-lg p-2 mt-2">
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
                            onStepComplete={() => markStepComplete(currentStep)}
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
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={goToNextStep}
                      disabled={isSubmitting || !completedSteps.includes(currentStep)}
                      className="flex items-center gap-2 bg-gradient-to-r from-healthcare-primary to-blue-500 hover:from-blue-500 hover:to-healthcare-primary"
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

export default PatientOnboardingPage;
