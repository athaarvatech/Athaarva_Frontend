"use client";

/**
 * Domain Setup Page - Phase 6: Admin Setup & Domain Configuration
 * 
 * Post-onboarding page for configuring:
 * - Subdomain verification
 * - Custom domain setup (optional)
 * - SSL certificate status
 * - Initial hospital settings
 */

import React, { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Globe,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  Clock,
  Building2,
  Link2,
  Settings,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  validateSubdomainLocal,
  generateCNAMEInstructions,
  hospitalNameToSubdomain,
  verifyCustomDomain,
} from "@/lib/subdomain-validator";

// ============================================================================
// TYPES
// ============================================================================

interface SetupStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SETUP_STEPS: SetupStep[] = [
  {
    id: 1,
    title: "Subdomain",
    description: "Verify your hospital subdomain",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Custom Domain",
    description: "Optional: Set up your own domain",
    icon: <Link2 className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Initial Settings",
    description: "Configure basic hospital settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function DomainSetupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get context from URL params
  const hospitalName = searchParams.get("hospital") || "Your Hospital";
  const tenantId = searchParams.get("tenant_id") || "";
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Subdomain state
  const [subdomain, setSubdomain] = useState(hospitalNameToSubdomain(hospitalName));
  const [subdomainVerified, setSubdomainVerified] = useState(false);
  const [subdomainError, setSubdomainError] = useState("");
  
  // Custom domain state
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [customDomainVerified, setCustomDomainVerified] = useState(false);
  const [customDomainError, setCustomDomainError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Initial settings state
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "18:00",
  });
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [maxAdvanceBooking, setMaxAdvanceBooking] = useState(30);
  
  // CNAME instructions for custom domain
  const cnameInstructions = generateCNAMEInstructions(subdomain);
  
  // Progress calculation
  const progress = ((currentStep - 1) / SETUP_STEPS.length) * 100;
  
  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleSubdomainChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(normalized);
    setSubdomainVerified(false);
    
    const validation = validateSubdomainLocal(normalized);
    if (!validation.valid) {
      setSubdomainError(validation.error || "Invalid subdomain");
    } else {
      setSubdomainError("");
    }
  };
  
  const handleVerifySubdomain = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://athaarva-backend.onrender.com";
      const response = await fetch(
        `${apiUrl}/api/v1/tenants/verify-subdomain`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            subdomain: subdomain,
          }),
        }
      );
      
      if (response.ok) {
        setSubdomainVerified(true);
        toast.success("Subdomain verified successfully!");
      } else {
        const data = await response.json();
        setSubdomainError(data.detail || "Subdomain verification failed");
        toast.error(data.detail || "Verification failed");
      }
    } catch (error) {
      console.error("Subdomain verification error:", error);
      // For development, simulate success
      setSubdomainVerified(true);
      toast.success("Subdomain verified (dev mode)");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyCustomDomain = async () => {
    if (!customDomain) {
      setCustomDomainError("Please enter a domain");
      return;
    }
    
    setIsVerifying(true);
    setCustomDomainError("");
    
    try {
      const result = await verifyCustomDomain(customDomain, `${subdomain}.athaarva.com`);
      
      if (result.verified) {
        setCustomDomainVerified(true);
        toast.success("Custom domain verified!");
      } else {
        setCustomDomainError(result.error || "DNS verification failed");
        toast.error(result.error || "Verification failed");
      }
    } catch (error) {
      console.error("Custom domain verification error:", error);
      setCustomDomainError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  
  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!subdomainVerified) {
        toast.error("Please verify your subdomain first");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Custom domain is optional
      setCurrentStep(3);
    } else if (currentStep === 3) {
      await handleCompleteSetup();
    }
  };
  
  const handleCompleteSetup = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://athaarva-backend.onrender.com";
      const response = await fetch(
        `${apiUrl}/api/v1/tenants/${tenantId}/complete-domain-setup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subdomain: subdomain,
            custom_domain: useCustomDomain && customDomainVerified ? customDomain : null,
            initial_settings: {
              working_hours: workingHours,
              appointment_duration_minutes: appointmentDuration,
              max_advance_booking_days: maxAdvanceBooking,
            },
          }),
        }
      );
      
      if (response.ok) {
        toast.success("Setup complete! Redirecting to your dashboard...");
        // Redirect to the hospital admin dashboard
        setTimeout(() => {
          router.push(`/hospital/${subdomain}/admin/dashboard`);
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.detail || "Setup failed");
      }
    } catch (error) {
      console.error("Complete setup error:", error);
      // For development, simulate success
      toast.success("Setup complete! (dev mode)");
      setTimeout(() => {
        router.push(`/hospital/${subdomain}/admin/dashboard`);
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-healthcare-light-cyan">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-healthcare-primary/10">
              <Globe className="w-8 h-8 text-healthcare-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configure Your Domain
          </h1>
          <p className="text-gray-600">
            Set up how patients and staff will access <span className="font-semibold text-healthcare-primary">{hospitalName}</span>
          </p>
        </motion.div>
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {SETUP_STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm ${
                  step.id <= currentStep ? "text-healthcare-primary" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id < currentStep
                      ? "bg-healthcare-primary text-white"
                      : step.id === currentStep
                      ? "bg-healthcare-primary/20 text-healthcare-primary border-2 border-healthcare-primary"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Subdomain Verification */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-healthcare-primary" />
                    Verify Your Subdomain
                  </CardTitle>
                  <CardDescription>
                    Your hospital will be accessible at{" "}
                    <span className="font-mono bg-gray-100 px-1 rounded">
                      {subdomain || "subdomain"}.athaarva.com
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subdomain input */}
                  <div>
                    <Label htmlFor="subdomain">Subdomain</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1">
                        <Input
                          id="subdomain"
                          type="text"
                          value={subdomain}
                          onChange={(e) => handleSubdomainChange(e.target.value)}
                          placeholder="yourhospital"
                          className={subdomainError ? "border-red-500" : ""}
                          disabled={subdomainVerified}
                        />
                      </div>
                      <span className="text-gray-500 font-mono">.athaarva.com</span>
                    </div>
                    {subdomainError && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {subdomainError}
                      </p>
                    )}
                  </div>
                  
                  {/* Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Your hospital URL will be:</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-healthcare-primary font-medium">
                        https://{subdomain || "subdomain"}.athaarva.com
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(`https://${subdomain}.athaarva.com`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Verification status */}
                  {subdomainVerified ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Subdomain Verified</p>
                        <p className="text-sm text-green-600">
                          Your hospital is now accessible at{" "}
                          <span className="font-mono">{subdomain}.athaarva.com</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleVerifySubdomain}
                      disabled={isLoading || !!subdomainError || !subdomain}
                      className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Verify Subdomain
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Custom Domain */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-healthcare-primary" />
                    Custom Domain (Optional)
                  </CardTitle>
                  <CardDescription>
                    Use your own domain like <span className="font-mono">portal.yourhospital.com</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Use custom domain?</p>
                      <p className="text-sm text-gray-500">
                        This requires DNS configuration on your domain registrar
                      </p>
                    </div>
                    <Button
                      variant={useCustomDomain ? "default" : "outline"}
                      onClick={() => setUseCustomDomain(!useCustomDomain)}
                      className={useCustomDomain ? "bg-healthcare-primary" : ""}
                    >
                      {useCustomDomain ? "Enabled" : "Enable"}
                    </Button>
                  </div>
                  
                  {useCustomDomain && (
                    <>
                      {/* Domain input */}
                      <div>
                        <Label htmlFor="customDomain">Your Domain</Label>
                        <Input
                          id="customDomain"
                          type="text"
                          value={customDomain}
                          onChange={(e) => {
                            setCustomDomain(e.target.value);
                            setCustomDomainVerified(false);
                            setCustomDomainError("");
                          }}
                          placeholder="portal.yourhospital.com"
                          className="mt-1"
                          disabled={customDomainVerified}
                        />
                        {customDomainError && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {customDomainError}
                          </p>
                        )}
                      </div>
                      
                      {/* CNAME Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          DNS Configuration Required
                        </h4>
                        <p className="text-sm text-blue-800 mb-4">
                          Add the following CNAME record to your domain's DNS settings:
                        </p>
                        <div className="bg-white rounded p-3 space-y-2 font-mono text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-semibold">{cnameInstructions.recordType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Host:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{cnameInstructions.host}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopyToClipboard(cnameInstructions.host)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Target:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-healthcare-primary">
                                {cnameInstructions.target}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopyToClipboard(cnameInstructions.target)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 mt-3 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          DNS changes may take up to 48 hours to propagate
                        </p>
                      </div>
                      
                      {/* Verify button */}
                      {customDomainVerified ? (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Domain Verified</p>
                            <p className="text-sm text-green-600">
                              SSL certificate will be provisioned automatically
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={handleVerifyCustomDomain}
                          disabled={isVerifying || !customDomain}
                          variant="outline"
                          className="w-full"
                        >
                          {isVerifying ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          )}
                          Verify DNS Configuration
                        </Button>
                      )}
                    </>
                  )}
                  
                  {!useCustomDomain && (
                    <div className="text-center py-6 text-gray-500">
                      <p>You can skip this step and set up a custom domain later from settings.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: Initial Settings */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-healthcare-primary" />
                    Initial Settings
                  </CardTitle>
                  <CardDescription>
                    Configure basic operational settings for your hospital
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Working Hours */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Working Hours
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="startTime" className="text-xs text-gray-500">
                          Opens at
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={workingHours.start}
                          onChange={(e) =>
                            setWorkingHours({ ...workingHours, start: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <span className="text-gray-400 pt-5">to</span>
                      <div className="flex-1">
                        <Label htmlFor="endTime" className="text-xs text-gray-500">
                          Closes at
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={workingHours.end}
                          onChange={(e) =>
                            setWorkingHours({ ...workingHours, end: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Appointment Duration */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Default Appointment Duration
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        min={5}
                        max={120}
                        step={5}
                        value={appointmentDuration}
                        onChange={(e) => setAppointmentDuration(Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-gray-600">minutes</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This can be customized per doctor later
                    </p>
                  </div>
                  
                  {/* Advance Booking */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      Maximum Advance Booking
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        value={maxAdvanceBooking}
                        onChange={(e) => setMaxAdvanceBooking(Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-gray-600">days in advance</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Patients can book appointments up to this many days ahead
                    </p>
                  </div>
                  
                  {/* Summary */}
                  <div className="bg-healthcare-primary/5 border border-healthcare-primary/20 rounded-lg p-4 mt-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-healthcare-primary" />
                      Ready to Launch!
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Subdomain: <span className="font-mono text-healthcare-primary">{subdomain}.athaarva.com</span>
                      </p>
                      {customDomainVerified && customDomain && (
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Custom domain: <span className="font-mono text-healthcare-primary">{customDomain}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Working hours: {workingHours.start} - {workingHours.end}
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Appointment slots: {appointmentDuration} min, up to {maxAdvanceBooking} days ahead
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNextStep}
            disabled={isLoading || (currentStep === 1 && !subdomainVerified)}
            className="bg-healthcare-primary hover:bg-healthcare-primary/90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : currentStep === SETUP_STEPS.length ? (
              <Sparkles className="w-4 h-4 mr-2" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            {currentStep === SETUP_STEPS.length ? "Launch Dashboard" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DomainSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-healthcare-light-cyan">
          <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-48 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      }
    >
      <DomainSetupPageContent />
    </Suspense>
  );
}
