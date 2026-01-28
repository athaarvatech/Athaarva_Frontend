"use client";

import React, { useState, Suspense, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import {
  Building2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  Check,
  ArrowRight,
  ArrowLeft,
  Shield,
  User,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Step indicator for the signup flow
type SignupStep = "info" | "verify-phone" | "verify-email" | "complete";

const STEPS: { id: SignupStep; title: string; icon: React.ElementType }[] = [
  { id: "info", title: "Your Info", icon: User },
  { id: "verify-phone", title: "Verify Phone", icon: Phone },
  { id: "verify-email", title: "Verify Email", icon: Mail },
  { id: "complete", title: "Complete", icon: CheckCircle2 },
];

// OTP Input Component
function OTPInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 1) {
      const newOtp = value.split("");
      newOtp[index] = val;
      onChange(newOtp.join(""));
      // Auto-focus next input
      if (val && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pastedData);
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 transition-all",
            "focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none",
            disabled ? "bg-gray-100 text-gray-400" : "bg-white text-gray-900",
            value[index] ? "border-teal-500 bg-teal-50" : "border-gray-300"
          )}
        />
      ))}
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer({
  seconds,
  onComplete,
}: {
  seconds: number;
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="font-mono text-sm">
      {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}

function PatientSignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hospitalSlug = searchParams.get("hospital") || "";

  // Multi-step state
  const [currentStep, setCurrentStep] = useState<SignupStep>("info");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    aadharCard: "",
    email: "",
  });

  // Phone verification state
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [canResendPhoneOtp, setCanResendPhoneOtp] = useState(false);
  
  // Email verification state
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [canResendEmailOtp, setCanResendEmailOtp] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Step navigation
  const goToStep = (step: SignupStep) => {
    setError("");
    setCurrentStep(step);
  };

  // Phone OTP handlers
  const handleSendPhoneOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPhoneOtpSent(true);
      setCanResendPhoneOtp(false);
      toast.success("OTP sent to your phone number!");
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock verification (accept any 6-digit code for demo)
      setPhoneVerified(true);
      toast.success("Phone number verified!");
      
      // Move to next step based on email presence
      if (formData.email) {
        goToStep("verify-email");
      } else {
        goToStep("complete");
      }
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Email OTP handlers
  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      // If no email, skip to complete
      goToStep("complete");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailOtpSent(true);
      setCanResendEmailOtp(false);
      toast.success("Verification code sent to your email!");
    } catch {
      setError("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setEmailVerified(true);
      toast.success("Email verified!");
      goToStep("complete");
    } catch {
      setError("Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Complete registration
  const handleCompleteSignup = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Account created successfully!");
      router.push(`/patient/dashboard?hospital=${hospitalSlug}`);
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google signup handler
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth flow
      console.log("Google signup for hospital:", hospitalSlug);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/patient/dashboard?hospital=${hospitalSlug}`);
    } catch {
      setError("Google sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Basic Info Form
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    goToStep("verify-phone");
  };

  // Get current step index
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // Memoized timer complete handlers
  const handlePhoneTimerComplete = useCallback(() => setCanResendPhoneOtp(true), []);
  const handleEmailTimerComplete = useCallback(() => setCanResendEmailOtp(true), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Step Indicator */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = currentStepIndex === index;
              const isCompleted = currentStepIndex > index;
              const StepIcon = step.icon;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        isActive && "bg-white text-teal-600 shadow-lg",
                        isCompleted && "bg-teal-300 text-teal-800",
                        !isActive && !isCompleted && "bg-teal-400/50 text-white/70"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-1 font-medium hidden sm:block",
                        isActive ? "text-white" : "text-teal-200"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2",
                        isCompleted ? "bg-teal-300" : "bg-teal-400/30"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <CardHeader className="space-y-1 text-center pt-6">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <UserPlus className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {currentStep === "info" && "Create Patient Account"}
            {currentStep === "verify-phone" && "Verify Phone Number"}
            {currentStep === "verify-email" && "Verify Email Address"}
            {currentStep === "complete" && "Almost Done!"}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStep === "info" && "Enter your details to get started"}
            {currentStep === "verify-phone" && "We sent a verification code to your phone"}
            {currentStep === "verify-email" && "We sent a verification code to your email"}
            {currentStep === "complete" && "Review your information and create your account"}
          </CardDescription>
          {hospitalSlug && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{hospitalSlug}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Google Sign Up Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <FcGoogle className="mr-3 h-5 w-5" />
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or fill in your details
                    </span>
                  </div>
                </div>

                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-11"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="123 Main St, City, State, ZIP"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional - for notifications)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="pl-10 h-11"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Add email to receive appointment reminders and health updates
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharCard">Aadhar Card (Optional)</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="aadharCard"
                        name="aadharCard"
                        type="text"
                        placeholder="1234 5678 9012"
                        value={formData.aadharCard}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="pl-10 h-11"
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-teal-600 hover:bg-teal-700"
                    disabled={isLoading}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Phone Verification */}
            {currentStep === "verify-phone" && (
              <motion.div
                key="verify-phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                    <Phone className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-gray-600">
                    {phoneOtpSent
                      ? `Enter the 6-digit code sent to ${formData.phone}`
                      : `We'll send a verification code to ${formData.phone}`}
                  </p>
                </div>

                {!phoneOtpSent ? (
                  <Button
                    onClick={handleSendPhoneOtp}
                    className="w-full h-12 bg-teal-600 hover:bg-teal-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <OTPInput
                      value={phoneOtp}
                      onChange={setPhoneOtp}
                      disabled={isLoading || phoneVerified}
                    />

                    <div className="flex items-center justify-center gap-2 text-sm">
                      {!canResendPhoneOtp ? (
                        <span className="text-gray-500">
                          Resend code in{" "}
                          <CountdownTimer
                            seconds={60}
                            onComplete={handlePhoneTimerComplete}
                          />
                        </span>
                      ) : (
                        <Button
                          variant="link"
                          className="text-teal-600 p-0 h-auto"
                          onClick={handleSendPhoneOtp}
                          disabled={isLoading}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Resend Code
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyPhoneOtp}
                      className="w-full h-12 bg-teal-600 hover:bg-teal-700"
                      disabled={isLoading || phoneOtp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Verify Phone Number
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => goToStep("info")}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Details
                </Button>
              </motion.div>
            )}

            {/* Step 3: Email Verification */}
            {currentStep === "verify-email" && (
              <motion.div
                key="verify-email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    {emailOtpSent
                      ? `Enter the 6-digit code sent to ${formData.email}`
                      : `We'll send a verification code to ${formData.email}`}
                  </p>
                </div>

                {!emailOtpSent ? (
                  <div className="space-y-3">
                    <Button
                      onClick={handleSendEmailOtp}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Verification Code
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-gray-500"
                      onClick={() => goToStep("complete")}
                    >
                      Skip for now
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <OTPInput
                      value={emailOtp}
                      onChange={setEmailOtp}
                      disabled={isLoading || emailVerified}
                    />

                    <div className="flex items-center justify-center gap-2 text-sm">
                      {!canResendEmailOtp ? (
                        <span className="text-gray-500">
                          Resend code in{" "}
                          <CountdownTimer
                            seconds={60}
                            onComplete={handleEmailTimerComplete}
                          />
                        </span>
                      ) : (
                        <Button
                          variant="link"
                          className="text-blue-600 p-0 h-auto"
                          onClick={handleSendEmailOtp}
                          disabled={isLoading}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Resend Code
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyEmailOtp}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading || emailOtp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Verify Email
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full text-gray-500"
                      onClick={() => goToStep("complete")}
                    >
                      Skip for now
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Complete */}
            {currentStep === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Review Your Information
                  </h3>
                </div>

                {/* Summary Card */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <User className="w-4 h-4" /> Name
                    </span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone
                    </span>
                    <span className="font-medium flex items-center gap-2">
                      {formData.phone}
                      {phoneVerified && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </span>
                  </div>
                  {formData.email && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </span>
                      <span className="font-medium flex items-center gap-2">
                        {formData.email}
                        {emailVerified && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Address
                    </span>
                    <span className="font-medium text-right max-w-[200px] truncate">
                      {formData.address}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCompleteSignup}
                  className="w-full h-12 text-base font-medium bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create My Account
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => goToStep("info")}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/auth/patient/signin${
                hospitalSlug ? `?hospital=${hospitalSlug}` : ""
              }`}
              className="text-teal-600 hover:text-teal-700 font-medium underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Are you a healthcare provider?{" "}
            <Link
              href="/auth/staff/signin"
              className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline"
            >
              Staff sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PatientSignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <PatientSignUpContent />
    </Suspense>
  );
}
