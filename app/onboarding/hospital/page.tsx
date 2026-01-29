"use client";

/**
 * Hospital Onboarding Page v2 - 11-Step Comprehensive Wizard
 *
 * This is the refactored version integrating HospitalOnboardingContextV2
 * with all 11 steps (removed Integrations & Preferences).
 *
 * Features:
 * - Token-gated invitation validation
 * - 11-step comprehensive wizard
 * - Autosave with localStorage persistence
 * - Activity log sidebar
 * - Contextual help panels
 * - Progress tracking across all steps
 * - WCAG compliance checking
 * - Draft saving and resumption
 */

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  X,
  Loader2,
  Clock,
  ChevronRight,
  AlertCircle,
  Sparkles,
  ListChecks,
  Globe,
  DollarSign,
  Users,
  Settings,
  Info,
  Shield,
  Menu,
  RefreshCw,
  Palette,
  UserCog,
  FileText,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  useHospitalOnboarding,
  HospitalOnboardingProvider,
} from "@/contexts/HospitalOnboardingContextV2";

// Import step components
import InvitationTemplateStep from "./steps/InvitationTemplateStep";
import LoginPageCustomizationStep from "./steps/LoginPageCustomizationStep";
import OrganizationProfileStep from "./steps/OrganizationProfileStep";
import LocationsContactsStep from "./steps/LocationsContactsStep";
import DepartmentsStaffStep from "./steps/DepartmentsStaffStep";
import BillingFinancialStep from "./steps/BillingFinancialStep";
import DocumentTemplatesStep from "./steps/DocumentTemplatesStep";
import LicensingCertificationStep from "./steps/LicensingCertificationStep";
import AdminControlStep from "./steps/AdminControlStep";
import ReviewSubmissionStep from "./steps/ReviewSubmissionStep";

// Import widgets
import { ActivityLog } from "./widgets/ActivityLog";
import { OnboardingSkeleton } from "@/components/loading/OnboardingSkeleton";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { toast } from "@/lib/toast";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { CommandMenu } from "@/components/ui/command-menu";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AnimatedProgressBar } from "@/components/ui/progress-bar-animated";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

// Import the real API client
import { onboardingAPI } from "@/lib/api";

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  category: "Setup" | "Branding" | "Operations" | "Review";
  estimatedMinutes: number;
}

// Help text for each step
const STEP_HELP_TEXT: Record<number, string> = {
  0: "Select a template that best represents your hospital's brand and services. This will be the foundation of your digital presence.",
  1: "Choose a visual login page style for your hospital. No form fields—just pick the design that matches your brand.",
  2: "Provide your hospital's legal information including registration numbers and official documents.",
  3: "Add your hospital's physical locations, contact details, and emergency numbers.",
  4: "Set up medical departments and specialties. Define how your hospital is organized operationally.",
  5: "Configure billing settings, payment methods, bank details, and invoice preferences.",
  6: "Pick a visual document style for prescriptions, invoices, and certificates. No form inputs required.",
  7: "Upload your hospital's licenses and certifications to build trust.",
  8: "Configure admin credentials and your hospital's subdomain for access.",
  9: "Review all the information you've entered and submit your application.",
};

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const STEP_CONFIGS: StepConfig[] = [
  {
    id: 0,
    title: "Website Template",
    description: "Select and customize your hospital website template",
    icon: Sparkles,
    component: InvitationTemplateStep,
    category: "Setup",
    estimatedMinutes: 3,
  },
  {
    id: 1,
    title: "Login Page",
    description: "Design your hospital's custom login experience",
    icon: Palette,
    component: LoginPageCustomizationStep,
    category: "Setup",
    estimatedMinutes: 5,
  },
  {
    id: 2,
    title: "Organization Profile",
    description: "Legal info, GST/PAN, timezone, registrations",
    icon: Building2,
    component: OrganizationProfileStep,
    category: "Setup",
    estimatedMinutes: 8,
  },
  {
    id: 3,
    title: "Locations & Contacts",
    description: "Hospital addresses, contacts, geocoding",
    icon: Globe,
    component: LocationsContactsStep,
    category: "Setup",
    estimatedMinutes: 10,
  },
  {
    id: 4,
    title: "Departments",
    description: "Clinical departments, specializations, accounting",
    icon: Users,
    component: DepartmentsStaffStep,
    category: "Operations",
    estimatedMinutes: 12,
  },
  {
    id: 5,
    title: "Billing & Financial",
    description: "Tax config, payments, TPA panels, banking",
    icon: DollarSign,
    component: BillingFinancialStep,
    category: "Operations",
    estimatedMinutes: 15,
  },
  {
    id: 6,
    title: "Document Templates",
    description: "Design prescriptions, invoices, certificates",
    icon: FileText,
    component: DocumentTemplatesStep,
    category: "Operations",
    estimatedMinutes: 8,
  },
  {
    id: 7,
    title: "Licensing & Certification",
    description: "Upload licenses, certifications, accreditations",
    icon: Shield,
    component: LicensingCertificationStep,
    category: "Operations",
    estimatedMinutes: 8,
  },
  {
    id: 8,
    title: "Admin Setup & Domain",
    description: "Configure admin credentials and hospital subdomain",
    icon: UserCog,
    component: AdminControlStep,
    category: "Setup",
    estimatedMinutes: 5,
  },
  {
    id: 9,
    title: "Review & Submission",
    description: "Final review, acknowledgements, publish",
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
  owner_name?: string;
  message: string;
}

function HospitalOnboardingWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  // SECURITY: Always start with loading state - no bypass allowed
  const [validationState, setValidationState] = useState<{
    loading: boolean;
    valid: boolean;
    data?: TokenValidationResponse;
    error?: string;
  }>({
    loading: true,
    valid: false,
  });

  useEffect(() => {
    const validateToken = async () => {
      // SECURITY: No token = redirect to invalid page (middleware should catch this, but double-check)
      if (!token) {
        router.replace("/onboarding/hospital/invalid-token?reason=missing");
        return;
      }

      try {
        // Add 8 second timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout. Please check your connection and try again.")), 8000)
        );
        
        const response = await Promise.race([
          onboardingAPI.validateToken(token),
          timeoutPromise
        ]) as any;

        if (response.valid) {
          setValidationState({
            loading: false,
            valid: true,
            data: {
              valid: true,
              invitation_id: response.invitation_id || undefined,
              email: response.email || undefined,
              expires_at: response.expires_at || undefined,
              hospital_name: response.hospital_name || "",
              owner_name: response.owner_name || "",
              message: response.message,
            },
          });
        } else {
          // Redirect to invalid token page with specific reason
          const reason = response.status || "invalid";
          router.replace(`/onboarding/hospital/invalid-token?reason=${reason}`);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // SECURITY: On any error, redirect to invalid token page
        const errorMessage = error instanceof Error ? error.message : "validation_failed";
        router.replace(`/onboarding/hospital/invalid-token?reason=network_error&message=${encodeURIComponent(errorMessage)}`);
      }
    };

    validateToken();
  }, [token, router]);

  // Show loading state while validating
  if (validationState.loading) {
    return <OnboardingSkeleton />;
  }

  // If validation failed, this component shouldn't render (middleware redirects)
  // But as a safety net, show the error UI
  if (!validationState.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-red-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <X className="h-10 w-10 text-red-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Invitation Error
            </h2>
            <p className="text-gray-600 mb-2 text-lg">{validationState.error || "Invalid invitation"}</p>
            <p className="text-sm text-gray-500 mb-8">If you believe this is a mistake, please contact your hospital administrator.</p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Valid token - render the onboarding content
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
    getStepCompletion,
    activityLog,
    updateData,
    buildSubmissionPayload,
    lastSaved,
    isSaving,
  } = useHospitalOnboarding();

  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submittedHospitalInfo, setSubmittedHospitalInfo] = useState<{
    subdomain: string;
    name: string;
    adminEmail: string;
  } | null>(null);
  const invitationPrefilled = useRef(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Welcome modal state - show on first visit
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (typeof window !== 'undefined' && token) {
      return localStorage.getItem(`onboarding-welcome-seen-${token}`) !== 'true';
    }
    return true;
  });

  const handleWelcomeStart = () => {
    setShowWelcomeModal(false);
    if (token) {
      localStorage.setItem(`onboarding-welcome-seen-${token}`, 'true');
    }
  };

  const currentStepConfig = STEP_CONFIGS[currentStep];
  const CurrentStepComponent = currentStepConfig?.component;

  // Pre-fill invitation data (only once)
  useEffect(() => {
    if (validationData && !invitationPrefilled.current && token) {
      // Prefill invitation data into context so:
      // - localStorage keys are per invitation (prevents cross-tenant data leakage)
      // - invitation email/name show correctly throughout the wizard
      updateData("invitation", {
        ...data.invitation,
        token,
        invitation_id: validationData.invitation_id || data.invitation.invitation_id,
        email: validationData.email || data.invitation.email,
        expires_at: validationData.expires_at || data.invitation.expires_at,
        hospital_name_preview:
          validationData.hospital_name || data.invitation.hospital_name_preview,
      });

      invitationPrefilled.current = true;
    }
  }, [validationData, token, updateData, data.invitation]);

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

  // Show auto-save indicator when data changes
  useEffect(() => {
    if (lastSaved) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);

  const handleNext = () => {
    // Validation check - enable when field validation is fully implemented
    // Currently allowing progression for testing purposes
    // Uncomment below when ready:
    // if (!isStepValid(currentStep)) {
    //   toast.warning({
    //     title: "Incomplete step",
    //     description: "Please fill in all required fields before continuing",
    //   });
    //   return;
    // }
    
    // Submit only on the final step (step 9 - Review & Submission)
    if (currentStep === STEP_CONFIGS.length - 1) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
      // Visual feedback is provided by sidebar "✓ Done" badge and progress bar
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

    // Note: Session validation will be added when backend endpoint is ready
    // For now, proceeding with submission using invitation token

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Build payload for submission
      const payload = buildSubmissionPayload();
      console.log("Submitting onboarding payload:", payload);

      // Get the hospital subdomain from admin control or generate from name
      const hospitalSubdomain =
        data.adminControl?.domain?.subdomain ||
        data.organizationProfile.legal_name
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .substring(0, 32) || "hospital";

      // STEP 1: Accept invitation to create tenant, user, hospital_profile
      // This is critical - without this, the hospital won't exist in the database
      console.log("[Onboarding] Calling acceptInvitation to create tenant...");
      try {
        const acceptResult = await onboardingAPI.acceptInvitation({
          token,
          full_name: data.adminControl?.admin?.full_name,
          phone: data.adminControl?.admin?.phone,
          // Password is optional - will be auto-generated and sent via email after approval
          hospital_code: hospitalSubdomain,
          hospital_name: data.organizationProfile.legal_name || validationData?.hospital_name || "Hospital",
        });
        
        console.log("[Onboarding] Invitation accepted:", acceptResult);
        
        // Store the tenant_id and session info from acceptInvitation
        if (acceptResult.tenant_id) {
          localStorage.setItem("hospital_admin_tenant_id", acceptResult.tenant_id);
          if (acceptResult.access_token) {
            localStorage.setItem("onboarding_token", acceptResult.access_token);
            localStorage.setItem("hospital_admin_token", acceptResult.access_token);
          }
        }

        // STEP 1.5: Persist website template + login page config to DB (tenant_branding)
        // IMPORTANT: The backend persists tenant_branding only when step_3 is saved.
        // This MUST succeed, otherwise the hospital subdomain will render the default template.
        {
          const selectedTemplate = (data as any)?.template?.selected_template;
          const customizedBlueprint =
            selectedTemplate?.customizedBlueprint ??
            selectedTemplate?.customized_blueprint ??
            selectedTemplate?.blueprint;

          const persistBrandingPayload: Record<string, unknown> = {
            ...(((payload?.branding ?? {}) as unknown) as Record<string, unknown>),
            template_id: selectedTemplate?.id,
            template_content: customizedBlueprint,
            login_page_config: (data as any)?.loginPageConfig,
          };

          await onboardingAPI.saveStep(3, persistBrandingPayload, false);
          console.log("[Onboarding] Persisted branding/template via backend step_3", {
            template_id: persistBrandingPayload.template_id,
          });

          if (!persistBrandingPayload.template_id) {
            // Defensive: we allow the save call to run (it can still persist branding colors),
            // but fail submission because template selection is required for correct rendering.
            throw new Error(
              "Template selection is missing. Please select a website template before submitting."
            );
          }
        }
      } catch (acceptError: any) {
        // If tenant already exists, we can continue (idempotent check)
        if (acceptError.message?.includes("already accepted")) {
          console.log("[Onboarding] Invitation already accepted, continuing...");
        } else {
          throw acceptError;
        }
      }

      // STEP 2: Submit for review
      const shouldSkipBackendSubmit =
        !onboardingAPI.hasActiveSession() &&
        process.env.NODE_ENV === "development";

      if (!shouldSkipBackendSubmit) {
        await onboardingAPI.submitForReview();
      } else {
        console.warn(
          "[Onboarding] No active session; skipping backend submit in development."
        );
        toast.warning({
          title: "Submitted locally (dev mode)",
          description:
            "Backend session not found. Proceeding with local redirect in development.",
        });
      }
      
      toast.success({ title: "Onboarding submitted successfully!" });

      // Clear localStorage after successful submission
      if (validationData?.invitation_id) {
        localStorage.removeItem(
          `hospital-onboarding-${validationData.invitation_id}`
        );
      }

      // Store hospital info for the admin dashboard
      if (typeof window !== "undefined") {
        const sessionInfo = onboardingAPI.getStoredSessionInfo();
        if (sessionInfo.tenantId) {
          localStorage.setItem(
            `hospital-${sessionInfo.tenantId}`,
            JSON.stringify({
              subdomain: hospitalSubdomain,
              name: data.organizationProfile.legal_name,
              adminEmail: data.adminControl?.admin?.email,
            })
          );
          localStorage.setItem("hospital_admin_tenant_id", sessionInfo.tenantId);
        }
        localStorage.setItem("hospital_subdomain", hospitalSubdomain);
      }

      // Migrate onboarding token to admin token for seamless transition
      const onboardingToken = localStorage.getItem("onboarding_token");
      if (onboardingToken) {
        localStorage.setItem("hospital_admin_token", onboardingToken);
      }

      // Store the submitted hospital info for later access
      localStorage.setItem("pending_hospital_subdomain", hospitalSubdomain);
      localStorage.setItem("pending_hospital_name", data.organizationProfile.legal_name || validationData?.hospital_name || "Hospital");
      
      // Store template selection for the hospital landing page
      if (data.template?.selected_template) {
        localStorage.setItem("pending_hospital_template", JSON.stringify({
          id: data.template.selected_template.id,
          name: data.template.selected_template.name,
          customizedBlueprint: data.template.selected_template.customizedBlueprint,
        }));
      }
      
      // Store branding info
      if (data.branding) {
        localStorage.setItem("pending_hospital_branding", JSON.stringify({
          colors: data.branding.colors,
          logo_url: data.branding.logo_url,
        }));
      }
      
      // Show success message and set state to show submission complete page
      toast.success({
        title: "🎉 Congratulations! Your hospital onboarding has been submitted for review.",
        description: "You'll receive login credentials via email once your application is approved.",
      });

      // Set state to show submission success instead of redirecting
      // The hospital subdomain won't work until admin approves (status='active')
      setSubmissionComplete(true);
      setSubmittedHospitalInfo({
        subdomain: hospitalSubdomain,
        name: data.organizationProfile.legal_name || validationData?.hospital_name || "Hospital",
        adminEmail: data.adminControl?.admin?.email || validationData?.email || "",
      });
    } catch (error) {
      console.error("Failed to submit onboarding:", error);
      const errorMessage = (error as Error)?.message || "Failed to submit onboarding";

      // In development, allow redirect even if backend submission fails
      const isAuthError = errorMessage.toLowerCase().includes("session expired") ||
        errorMessage.toLowerCase().includes("authentication") ||
        errorMessage.toLowerCase().includes("401") ||
        errorMessage.toLowerCase().includes("unauthorized");

      if (process.env.NODE_ENV === "development" && isAuthError) {
        toast.warning({
          title: "Session missing (dev mode)",
          description:
            "Backend session may be invalid. Showing submission success page.",
        });
        const fallbackSubdomain =
          data.adminControl?.domain?.subdomain ||
          data.organizationProfile.legal_name
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .substring(0, 32) || "hospital";
        
        // Show success page instead of redirecting
        setSubmissionComplete(true);
        setSubmittedHospitalInfo({
          subdomain: fallbackSubdomain,
          name: data.organizationProfile.legal_name || validationData?.hospital_name || "Hospital",
          adminEmail: data.adminControl?.admin?.email || validationData?.email || "",
        });
      } else {
        setSubmitError(errorMessage);
      }
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

  // Calculate progress based on completed steps
  const calculateProgress = (): number => {
    const stepCompletion = getStepCompletion();
    const completedCount = Object.values(stepCompletion).filter(Boolean).length;
    const totalSteps = STEP_CONFIGS.length;
    return Math.round((completedCount / totalSteps) * 100);
  };

  const progressPercentage = calculateProgress();
  const completedSteps = Object.values(getStepCompletion()).filter(Boolean).length;
  const totalMinutes = STEP_CONFIGS.reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );
  const completedMinutes = STEP_CONFIGS.slice(0, currentStep + 1).reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );

  // Show submission success page
  if (submissionComplete && submittedHospitalInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full"
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Submission Complete!
              </h1>
              <p className="text-emerald-100">
                Your hospital onboarding application has been submitted
              </p>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  What happens next?
                </h3>
                <ul className="text-sm text-emerald-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">1.</span>
                    Our team will review your application (typically 1-2 business days)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">2.</span>
                    Once approved, you&apos;ll receive login credentials via email
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">3.</span>
                    Your hospital portal will be activated at{" "}
                    <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-xs">
                      {submittedHospitalInfo.subdomain}.athaarva.com
                    </code>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-700 mb-3">Submission Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Hospital Name</dt>
                    <dd className="font-medium text-slate-700">{submittedHospitalInfo.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Subdomain</dt>
                    <dd className="font-mono text-slate-700">{submittedHospitalInfo.subdomain}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Admin Email</dt>
                    <dd className="font-medium text-slate-700">{submittedHospitalInfo.adminEmail}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  Credentials will be sent to <strong>{submittedHospitalInfo.adminEmail}</strong> upon approval
                </p>
              </div>

              <Button
                onClick={() => window.location.href = "/"}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      {/* Welcome Modal - Shows on first visit */}
      <WelcomeModal
        hospitalName={validationData?.hospital_name || data.organizationProfile?.legal_name}
        ownerName={validationData?.email?.split('@')[0] || "Administrator"}
        ownerEmail={validationData?.email}
        isOpen={showWelcomeModal}
        onStart={handleWelcomeStart}
      />
      
      <OfflineIndicator />
      
      {/* Auto-save Indicator */}
      <AnimatePresence>
        {showSaveIndicator && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white/90 backdrop-blur-md border border-emerald-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-700">
                Progress saved
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-screen flex flex-col">
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden text-gray-600 hover:text-gray-800 mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="hidden lg:flex text-gray-600 hover:text-gray-800 mr-2"
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
                <div className="hidden sm:block">
                  <Breadcrumbs
                    items={[
                      { label: "Onboarding" },
                      { label: `Step ${currentStep + 1}`, href: "#" },
                      { label: STEP_CONFIGS[currentStep]?.title || "Unknown" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Command Menu */}
              <CommandMenu 
                currentStep={currentStep} 
                onStepChange={setCurrentStep} 
              />

              {/* Autosave Indicator */}
              <div className="hidden sm:flex items-center text-xs">
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin text-healthcare-primary" />
                    <span className="text-healthcare-primary font-medium">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                    <span className="text-gray-500">
                      Saved {formatTimeAgo(lastSaved)}
                    </span>
                  </>
                ) : null}
              </div>

              {/* Progress Indicator */}
              <div className="text-right">
                <div className="text-xs font-medium text-healthcare-primary mb-1">
                  {Math.round(progressPercentage)}% Complete
                </div>
                <AnimatedProgressBar 
                  value={progressPercentage} 
                  className="h-1.5 w-24" 
                />
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
                    {STEP_CONFIGS.map((step) => {
                      const stepCompletion = getStepCompletion();
                      const isCompleted = stepCompletion[step.id] === true;
                      const isCurrent = currentStep === step.id;
                      const isClickable = step.id <= currentStep || isCompleted;

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
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative",
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
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", damping: 15 }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </motion.div>
                              ) : (
                                <step.icon className="w-4 h-4" />
                              )}
                              {isCompleted && (
                                <motion.div
                                  className="absolute inset-0 bg-healthcare-emerald/30 rounded-lg -z-10"
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className={cn(
                                    "text-sm font-medium line-clamp-1 flex-1",
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
                                {isCompleted && isCurrent && (
                                  <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Done
                                  </motion.span>
                                )}
                                {isClickable && !isCurrent && (
                                  <ChevronRight
                                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                  />
                                )}
                                {isCurrent && !isCompleted && (
                                  <ChevronRight
                                    className="w-4 h-4 opacity-100 flex-shrink-0"
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-gray-400 hover:text-healthcare-primary transition-colors rounded-full hover:bg-healthcare-primary/10 p-1.5">
                          <Info className="w-5 h-5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="left" className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-healthcare-primary">
                            About This Step
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {STEP_HELP_TEXT[currentStep]}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6 pb-32">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {CurrentStepComponent && <CurrentStepComponent />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Floating Action Bar - Removed for cleaner UX */}
                {/* Navigation is handled by the footer buttons */}

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
                      className="flex items-center gap-2 bg-gradient-to-r from-healthcare-primary to-healthcare-teal hover:from-healthcare-teal hover:to-healthcare-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      size="default"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden sm:inline">
                            Submitting...
                          </span>
                        </>
                      ) : currentStep === STEP_CONFIGS.length - 1 ? (
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

                  {/* Validation Feedback - Temporarily hidden for testing */}
                  {false && !isStepValid(currentStep) && (
                    <div className="mt-3 text-sm text-amber-600 flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Please complete all required fields to continue
                      </span>
                    </div>
                  )}

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
          <>
            {isMobile ? (
              <Drawer open={showExitDialog} onOpenChange={setShowExitDialog}>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Exit Hospital Setup?</DrawerTitle>
                    <DrawerDescription>
                      Your progress has been saved and you can resume later using the
                      same invitation link. Are you sure you want to exit?
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className="flex flex-col gap-2 pb-8">
                    <Button
                      variant="outline"
                      onClick={() => setShowExitDialog(false)}
                      className="w-full"
                    >
                      Continue Setup
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmExit}
                      className="w-full"
                    >
                      Exit
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
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
          </>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Sheet */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-healthcare-primary to-healthcare-emerald rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              Setup Progress
            </SheetTitle>
            <p className="text-sm text-gray-500 mt-2">
              {completedSteps} of {STEP_CONFIGS.length} steps completed
            </p>
          </SheetHeader>
          
          <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {STEP_CONFIGS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = getStepCompletion()[index];
              const isCurrent = currentStep === index;
              
              return (
                <Button
                  key={step.id}
                  variant={isCurrent ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto py-3 px-4",
                    isCurrent && "bg-teal-600 hover:bg-teal-700"
                  )}
                  onClick={() => {
                    setCurrentStep(index);
                    setShowMobileMenu(false);
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={cn(
                      "p-2 rounded-lg flex-shrink-0",
                      isCurrent 
                        ? "bg-white/20" 
                        : isCompleted 
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className={cn(
                        "text-xs mt-0.5",
                        isCurrent ? "text-white/80" : "text-gray-500"
                      )}>
                        Step {index + 1} • {step.estimatedMinutes} min
                      </div>
                    </div>
                    {isCompleted && !isCurrent && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium text-healthcare-primary">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <AnimatedProgressBar value={progressPercentage} className="h-2" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Loading fallback for Suspense
function HospitalOnboardingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading hospital onboarding...</p>
      </div>
    </div>
  );
}

export default function HospitalOnboardingPage() {
  return (
    <Suspense fallback={<HospitalOnboardingLoading />}>
      <HospitalOnboardingProvider>
        <HospitalOnboardingWrapper />
      </HospitalOnboardingProvider>
    </Suspense>
  );
}
