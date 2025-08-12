"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  Palette,
  Globe,
  UserPlus,
  X,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHospitalOnboarding, HospitalOnboardingProvider } from "@/contexts/HospitalOnboardingContext";

// Import step components
import HospitalBasicsStep from "./components/HospitalBasicsStep";
import BrandingStep from "./components/BrandingStep";
import LoginPageStep from "./components/LoginPageStep";
import AdminSetupStep from "./components/AdminSetupStep";
import PreviewModal from "./components/PreviewModal";

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  showPreview?: boolean;
}

const steps: StepConfig[] = [
  {
    id: 1,
    title: "Hospital Basics",
    description: "Essential information about your organization",
    icon: Building2,
    component: HospitalBasicsStep,
  },
  {
    id: 2,
    title: "Branding",
    description: "Upload logos and customize your visual identity",
    icon: Palette,
    component: BrandingStep,
    showPreview: true,
  },
  {
    id: 3,
    title: "Login Page & Subdomain",
    description: "Set up your branded login page and URL",
    icon: Globe,
    component: LoginPageStep,
    showPreview: true,
  },
  {
    id: 4,
    title: "Admin Setup & Review",
    description: "Create admin account and finalize setup",
    icon: UserPlus,
    component: AdminSetupStep,
  },
];

function HospitalOnboardingContent() {
  const router = useRouter();
  const {
    data,
    currentStep,
    isStepValid,
    nextStep,
    previousStep,
    resetData,
  } = useHospitalOnboarding();

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const currentStepConfig = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepConfig?.component;

  // Check for unsaved changes
  const hasUnsavedChanges = () => {
    return Object.values(data).some(section => 
      Object.values(section).some(value => 
        value !== "" && value !== null && value !== undefined && 
        (Array.isArray(value) ? value.length > 0 : true)
      )
    );
  };

  // Handle browser back/forward and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = () => {
      if (hasUnsavedChanges()) {
        setShowExitDialog(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (currentStep === 4) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear localStorage after successful submission
      localStorage.removeItem('hospital-onboarding-data');
      localStorage.removeItem('hospital-onboarding-step');
      
      // Redirect to hospital admin dashboard
      router.push('/hospital/dashboard');
    } catch (error) {
      console.error('Failed to create hospital:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (hasUnsavedChanges()) {
      setShowExitDialog(true);
    } else {
      router.push('/');
    }
  };

  const confirmExit = () => {
    resetData();
    router.push('/');
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      <div className="h-screen flex flex-col">
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="text-gray-600 hover:text-gray-800 mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="w-7 h-7 bg-gradient-to-r from-healthcare-primary to-healthcare-emerald rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Hospital Onboarding
                </h1>
                <p className="text-xs text-gray-600">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentStepConfig?.showPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
              )}
              <div className="text-right">
                <div className="text-xs font-medium text-healthcare-primary mb-1">
                  {Math.round(progressPercentage)}% Complete
                </div>
                <Progress value={progressPercentage} className="h-1.5 w-24" />
              </div>
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
                                : currentStep > step.id
                                ? "border-healthcare-emerald bg-healthcare-emerald text-white"
                                : "border-gray-300 bg-white text-gray-400"
                            )}
                          >
                            {currentStep > step.id ? (
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
                                  : currentStep > step.id
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
                            {currentStep > step.id && (
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
                              currentStep > step.id ? "bg-healthcare-emerald/30" : "bg-gray-200"
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
                        {currentStep - 1}/{steps.length}
                      </span>
                    </div>

                    {/* Next Step */}
                    {currentStep < steps.length && (
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

            {/* Main Content Area */}
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
                        {CurrentStepComponent && <CurrentStepComponent />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="border-t border-gray-100 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={previousStep}
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
                              : currentStep > step.id
                              ? "bg-healthcare-emerald"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid(currentStep) || isSubmitting}
                      className="flex items-center gap-2 bg-gradient-to-r from-healthcare-primary to-healthcare-teal hover:from-healthcare-teal hover:to-healthcare-primary"
                      size="default"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="hidden sm:inline">
                            Creating...
                          </span>
                        </>
                      ) : currentStep === 4 ? (
                        <>
                          <span className="hidden sm:inline">Create Hospital</span>
                          <CheckCircle className="w-4 h-4" />
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

            {/* Preview Panel - Remove this entire section */}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      {/* Exit Confirmation Dialog */}
      <AnimatePresence>
        {showExitDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Exit Hospital Setup?
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExitDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">
                You have unsaved changes. Are you sure you want to exit? Your progress will be lost.
              </p>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowExitDialog(false)}
                  className="flex-1"
                >
                  Continue Setup
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmExit}
                  className="flex-1"
                >
                  Exit & Lose Progress
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HospitalOnboardingPage() {
  return (
    <HospitalOnboardingProvider>
      <HospitalOnboardingContent />
    </HospitalOnboardingProvider>
  );
}
