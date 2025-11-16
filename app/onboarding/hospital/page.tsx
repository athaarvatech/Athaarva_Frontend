"use client";

/**
 * Hospital Onboarding Page v2 - 12-Step Comprehensive Wizard
 * 
 * This is the refactored version integrating HospitalOnboardingContextV2
 * with all 12 steps. Rename this file to page.tsx to activate.
 * 
 * Features:
 * - Token-gated invitation validation
 * - 12-step comprehensive wizard
 * - Autosave with localStorage persistence
 * - Activity log sidebar
 * - Contextual help panels
 * - Progress tracking across all steps
 * - WCAG compliance checking
 * - Draft saving and resumption
 */

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  X,
  Loader2,
  Clock,
  FileText,
  ChevronRight,
  AlertCircle,
  Sparkles,
  ListChecks,
  Palette,
  Globe,
  DollarSign,
  Users,
  Settings,
  Shield,
  Zap,
  UserPlus,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useHospitalOnboarding,
  HospitalOnboardingProvider,
} from "@/contexts/HospitalOnboardingContextV2";
import { API_CONFIG } from "@/lib/api-config";

// Import step components
import InvitationTemplateStep from "./steps/InvitationTemplateStep";
import OrganizationProfileStep from "./steps/OrganizationProfileStep";
import LocationsContactsStep from "./steps/LocationsContactsStep";
import BrandingStudioStep from "./steps/BrandingStudioStep";
import SiteContentStep from "./steps/SiteContentStep";
import ServicesPricingStep from "./steps/ServicesPricingStep";
import LeadershipTeamStep from "./steps/LeadershipTeamStep";
import OperationalPoliciesStep from "./steps/OperationalPoliciesStep";
import ComplianceDocumentationStep from "./steps/ComplianceDocumentationStep";
import IntegrationsPreferencesStep from "./steps/IntegrationsPreferencesStep";
import AdminStaffInvitationsStep from "./steps/AdminStaffInvitationsStep";
import ReviewSubmissionStep from "./steps/ReviewSubmissionStep";

// Import widgets for contextual panels
import { ActivityLog } from "./widgets/ActivityLog";
import { HelpPopover } from "./widgets/HelpPopover";

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  category: "Setup" | "Branding" | "Operations" | "Review";
  estimatedMinutes: number;
}

const STEP_CONFIGS: StepConfig[] = [
  {
    id: 0,
    title: "Invitation & Template",
    description: "Verify invitation and select hospital template",
    icon: Sparkles,
    component: InvitationTemplateStep,
    category: "Setup",
    estimatedMinutes: 3,
  },
  {
    id: 1,
    title: "Organization Profile",
    description: "Legal info, GST/PAN, timezone",
    icon: Building2,
    component: OrganizationProfileStep,
    category: "Setup",
    estimatedMinutes: 8,
  },
  {
    id: 2,
    title: "Locations & Contacts",
    description: "Multiple locations with geocoding",
    icon: Globe,
    component: LocationsContactsStep,
    category: "Setup",
    estimatedMinutes: 10,
  },
  {
    id: 3,
    title: "Branding Studio",
    description: "Colors, typography, assets with WCAG",
    icon: Palette,
    component: BrandingStudioStep,
    category: "Branding",
    estimatedMinutes: 12,
  },
  {
    id: 4,
    title: "Site Content",
    description: "Hero, services, testimonials, FAQ",
    icon: FileText,
    component: SiteContentStep,
    category: "Branding",
    estimatedMinutes: 15,
  },
  {
    id: 5,
    title: "Services & Pricing",
    description: "Departments, procedures, consultation types",
    icon: DollarSign,
    component: ServicesPricingStep,
    category: "Operations",
    estimatedMinutes: 12,
  },
  {
    id: 6,
    title: "Leadership & Team",
    description: "Leadership cards, staffing plan",
    icon: Users,
    component: LeadershipTeamStep,
    category: "Operations",
    estimatedMinutes: 10,
  },
  {
    id: 7,
    title: "Operational Policies",
    description: "Hours, buffers, cancellation policies",
    icon: Settings,
    component: OperationalPoliciesStep,
    category: "Operations",
    estimatedMinutes: 8,
  },
  {
    id: 8,
    title: "Compliance & Documentation",
    description: "Accreditation uploads, DPO contact",
    icon: Shield,
    component: ComplianceDocumentationStep,
    category: "Operations",
    estimatedMinutes: 10,
  },
  {
    id: 9,
    title: "Integrations & Preferences",
    description: "Messaging, analytics, LLM opt-in",
    icon: Zap,
    component: IntegrationsPreferencesStep,
    category: "Operations",
    estimatedMinutes: 7,
  },
  {
    id: 10,
    title: "Admin & Staff Invitations",
    description: "Invite team members with roles",
    icon: UserPlus,
    component: AdminStaffInvitationsStep,
    category: "Operations",
    estimatedMinutes: 8,
  },
  {
    id: 11,
    title: "Review & Submission",
    description: "Final review, acknowledgements, publish plan",
    icon: ListChecks,
    component: ReviewSubmissionStep,
    category: "Review",
    estimatedMinutes: 5,
  },
];

interface TokenValidationResponse {
  valid: boolean;
  invitation_id?: string;
  email?: string;
  expires_at?: string;
  hospital_name?: string;
  message: string;
}

function HospitalOnboardingWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [validationState, setValidationState] = useState<{
    loading: boolean;
    valid: boolean;
    data?: TokenValidationResponse;
    error?: string;
  }>({
    loading: true,
    valid: false,
  });

  const token = searchParams.get("token");

  useEffect(() => {
    const validateToken = async () => {
      // 🔥 DEVELOPMENT BYPASS: Skip token validation in development mode
      const isDevelopment = process.env.NODE_ENV === 'development' || 
                            window.location.hostname === 'localhost';
      
      if (isDevelopment) {
        console.log('🚀 Development mode: Token validation bypassed');
        setValidationState({
          loading: false,
          valid: true,
          data: {
            valid: true,
            invitation_id: 'dev-bypass-invitation',
            email: 'dev@hospital.com',
            hospital_name: 'Development Hospital',
            message: 'Development mode - Token validation bypassed',
          },
        });
        return;
      }

      // Production token validation
      if (!token) {
        setValidationState({
          loading: false,
          valid: false,
          error: "No invitation token provided",
        });
        return;
      }

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.VALIDATE_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (data.valid) {
          setValidationState({
            loading: false,
            valid: true,
            data,
          });
        } else {
          setValidationState({
            loading: false,
            valid: false,
            error: data.message || "Invalid invitation token",
          });
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setValidationState({
          loading: false,
          valid: false,
          error: "Failed to validate invitation token",
        });
      }
    };

    validateToken();
  }, [token]);

  if (validationState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-healthcare-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Validating Invitation
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your invitation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!validationState.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-red-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-6">{validationState.error}</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-healthcare-primary hover:bg-healthcare-primary/90"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HospitalOnboardingContent
      token={token}
      validationData={validationState.data}
    />
  );
}

function HospitalOnboardingContent({
  token,
  validationData,
}: {
  token?: string | null;
  validationData?: TokenValidationResponse;
}) {
  const router = useRouter();
  const {
    data,
    currentStep,
    setCurrentStep,
    isStepValid,
    activityLog,
    buildSubmissionPayload,
  } = useHospitalOnboarding();

  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const invitationPrefilled = useRef(false);

  const currentStepConfig = STEP_CONFIGS[currentStep];
  const CurrentStepComponent = currentStepConfig?.component;

  // Pre-fill invitation data (only once)
  useEffect(() => {
    if (validationData && !invitationPrefilled.current && token) {
      // Update invitation section with validated data
      const invitationData: any = {
        token,
        email: validationData.email || "",
        expires_at: validationData.expires_at || "",
        hospital_name_preview: validationData.hospital_name || "",
      };

      // Use the context's updateData method
      // The actual implementation depends on HospitalOnboardingContextV2
      // This is a placeholder - adjust based on actual context API

      invitationPrefilled.current = true;
    }
  }, [validationData, token]);

  // Handle browser back/forward and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (data.metadata.last_saved_at) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [data.metadata.last_saved_at]);

  const handleNext = () => {
    if (currentStep === 11) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      setSubmitError("No invitation token available");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildSubmissionPayload();

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOSPITALS.ONBOARDING}?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create hospital");
      }

      // Clear localStorage after successful submission
      if (validationData?.invitation_id) {
        localStorage.removeItem(
          `hospital-onboarding-${validationData.invitation_id}`
        );
      }

      // Redirect to success page
      router.push(
        `/onboarding/success?subdomain=${encodeURIComponent(data.organizationProfile.legal_name || "hospital")}`
      );
    } catch (error) {
      console.error("Failed to submit onboarding:", error);
      setSubmitError((error as Error)?.message || "Failed to submit onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (data.metadata.last_saved_at) {
      setShowExitDialog(true);
    } else {
      router.push("/");
    }
  };

  const confirmExit = () => {
    if (validationData?.invitation_id) {
      localStorage.removeItem(
        `hospital-onboarding-${validationData.invitation_id}`
      );
    }
    router.push("/");
  };

  const progressPercentage = ((currentStep) / (STEP_CONFIGS.length - 1)) * 100;
  const completedSteps = currentStep;
  const totalMinutes = STEP_CONFIGS.reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );
  const completedMinutes = STEP_CONFIGS.slice(0, currentStep + 1).reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      <div className="h-screen flex flex-col">
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
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
                  Step {currentStep + 1} of {STEP_CONFIGS.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Autosave Indicator */}
              {data.metadata.last_saved_at && (
                <div className="hidden sm:flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Saved{" "}
                  {new Date(data.metadata.last_saved_at).toLocaleTimeString()}
                </div>
              )}

              {/* Activity Log Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
                {activityLog.length > 0 && (
                  <span className="bg-healthcare-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activityLog.length}
                  </span>
                )}
              </Button>

              {/* Progress Indicator */}
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
          <div className="max-w-[1600px] mx-auto h-full flex gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Left Sidebar - Progress */}
            <div className="hidden lg:flex lg:w-80 xl:w-96 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full flex flex-col">
                {/* Progress Header */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    Progress Overview
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      {completedSteps}/{STEP_CONFIGS.length} steps
                    </span>
                    <span>
                      ~{totalMinutes - completedMinutes} min remaining
                    </span>
                  </div>
                </div>

                {/* Steps - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-1">
                    {STEP_CONFIGS.map((step, index) => {
                      const isCompleted = currentStep > step.id;
                      const isCurrent = currentStep === step.id;
                      const isClickable = isCompleted || isCurrent;

                      return (
                        <button
                          key={step.id}
                          onClick={() => isClickable && setCurrentStep(step.id)}
                          disabled={!isClickable}
                          className={cn(
                            "w-full text-left p-3 rounded-lg transition-all duration-200 group",
                            isCurrent &&
                              "bg-healthcare-primary/5 border-2 border-healthcare-primary",
                            isCompleted &&
                              !isCurrent &&
                              "bg-gray-50 hover:bg-gray-100 cursor-pointer",
                            !isCompleted &&
                              !isCurrent &&
                              "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                                isCurrent &&
                                  "bg-healthcare-primary text-white shadow-lg shadow-healthcare-primary/30",
                                isCompleted &&
                                  !isCurrent &&
                                  "bg-healthcare-emerald text-white",
                                !isCompleted &&
                                  !isCurrent &&
                                  "bg-gray-200 text-gray-400"
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <step.icon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <div
                                  className={cn(
                                    "text-sm font-medium line-clamp-1",
                                    isCurrent && "text-healthcare-primary",
                                    isCompleted &&
                                      !isCurrent &&
                                      "text-gray-700",
                                    !isCompleted &&
                                      !isCurrent &&
                                      "text-gray-400"
                                  )}
                                >
                                  {step.title}
                                </div>
                                {isClickable && (
                                  <ChevronRight
                                    className={cn(
                                      "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                                      isCurrent && "opacity-100"
                                    )}
                                  />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {step.description}
                              </p>
                              {!isCompleted && (
                                <div className="text-xs text-gray-400 mt-1">
                                  ~{step.estimatedMinutes} min
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="border-t border-gray-100 p-4">
                  <div className="space-y-3">
                    {/* Category Breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-700">
                        By Category
                      </div>
                      {["Setup", "Branding", "Operations", "Review"].map(
                        (category) => {
                          const categorySteps = STEP_CONFIGS.filter(
                            (s) => s.category === category
                          );
                          const completedInCategory = categorySteps.filter(
                            (s) => currentStep > s.id
                          ).length;
                          return (
                            <div
                              key={category}
                              className="flex justify-between items-center text-xs"
                            >
                              <span className="text-gray-600">{category}</span>
                              <span className="text-gray-500">
                                {completedInCategory}/{categorySteps.length}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                {/* Step Header */}
                <div className="border-b border-gray-100 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {currentStepConfig && (
                        <>
                          <div className="w-10 h-10 bg-healthcare-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <currentStepConfig.icon className="w-5 h-5 text-healthcare-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h2 className="text-lg font-semibold text-gray-900">
                                {currentStepConfig.title}
                              </h2>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {currentStepConfig.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {currentStepConfig.description}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Contextual Help */}
                    <div className="text-gray-400 hover:text-gray-600 transition-colors">
                      <AlertCircle className="w-4 h-4" />
                    </div>
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
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2"
                      size="default"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    {/* Mobile Progress Dots */}
                    <div className="flex lg:hidden items-center space-x-1">
                      {STEP_CONFIGS.slice(0, 6).map((step) => (
                        <div
                          key={step.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-200",
                            currentStep === step.id
                              ? "bg-healthcare-primary w-4"
                              : currentStep > step.id
                              ? "bg-healthcare-emerald"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                      {STEP_CONFIGS.length > 6 && (
                        <span className="text-xs text-gray-400 mx-1">...</span>
                      )}
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-gradient-to-r from-healthcare-primary to-healthcare-teal hover:from-healthcare-teal hover:to-healthcare-primary"
                      size="default"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden sm:inline">Submitting...</span>
                        </>
                      ) : currentStep === 11 ? (
                        <>
                          <span className="hidden sm:inline">Submit</span>
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

                  {/* Validation Feedback - Disabled for testing */}
                  {/* {!isStepValid(currentStep) && (
                    <div className="mt-3 text-sm text-amber-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Please complete all required fields to continue
                    </div>
                  )} */}

                  {submitError && (
                    <div className="mt-3 text-sm text-red-600 flex items-center">
                      <X className="w-4 h-4 mr-2" />
                      {submitError}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Activity Log (Collapsible) */}
            <AnimatePresence>
              {showActivityLog && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden xl:block flex-shrink-0 overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        Activity Log
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowActivityLog(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <ActivityLog entries={activityLog} maxEntries={20} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

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
                Your progress has been saved and you can resume later using the
                same invitation link. Are you sure you want to exit?
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
                  Exit
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
      <HospitalOnboardingWrapper />
    </HospitalOnboardingProvider>
  );
}
