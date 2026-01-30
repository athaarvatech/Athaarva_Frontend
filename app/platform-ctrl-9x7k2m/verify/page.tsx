"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Loader2,
  Mail,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useSecureSuperAdminAuth } from "@/contexts/SecureSuperAdminAuthContext";
import { SUPER_ADMIN_CONFIG } from "@/lib/super-admin-config";

/**
 * OTP Verification Page
 * 
 * Step 2 of 2-factor authentication:
 * - Enter 6-digit OTP sent to email
 * - Resend OTP option
 * - Auto-focus and auto-submit
 */
export default function SecureSuperAdminVerifyPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    loading: authLoading,
    pendingOTP,
    verifyOTP,
    resendOTP,
    cancelOTP,
  } = useSecureSuperAdminAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/invites`);
    }
  }, [authLoading, isAuthenticated, router]);

  // Redirect if no pending OTP
  useEffect(() => {
    if (!authLoading && !pendingOTP && !isAuthenticated) {
      router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/login`);
    }
  }, [authLoading, pendingOTP, isAuthenticated, router]);

  // Calculate remaining time
  useEffect(() => {
    if (!pendingOTP) return;

    const updateTime = () => {
      const remaining = Math.max(0, Math.floor((pendingOTP.expires_at - Date.now()) / 1000));
      setRemainingTime(remaining);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [pendingOTP]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === 5 && newOtp.every((digit) => digit)) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        if (digits.length === 6) {
          const newOtp = digits.split("");
          setOtp(newOtp);
          inputRefs.current[5]?.focus();
          handleSubmit(digits);
        }
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleSubmit(digits);
    }
  };

  const handleSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verifyOTP(code);
      // Redirect happens in context
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError("");

    try {
      await resendOTP();
      setResendCooldown(60); // 60 second cooldown
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    cancelOTP();
    router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/login`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mx-auto" />
          <p className="text-sm text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pendingOTP) {
    return null; // Will redirect
  }

  const isExpired = remainingTime <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(220,38,38,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute -top-12 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-xl shadow-red-600/20">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-slate-400">
            We sent a verification code to{" "}
            <span className="text-white font-medium">{pendingOTP.email}</span>
          </p>
        </div>

        {/* Verification Card */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-white text-center">
              Step 2: Enter Verification Code
            </CardTitle>
            
            {/* Timer */}
            <div className="flex justify-center">
              {isExpired ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-300">Code expired</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
                  <span className="text-sm text-slate-400">Expires in:</span>
                  <span className="text-sm font-mono text-white">{formatTime(remainingTime)}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Error Message */}
            {error && (
              <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* OTP Input */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading || isExpired}
                  className={`
                    w-12 h-14 text-center text-2xl font-bold
                    bg-slate-800/50 border-slate-700 text-white
                    focus:border-red-500 focus:ring-red-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${digit ? "border-red-500/50" : ""}
                  `}
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              onClick={() => handleSubmit()}
              disabled={otp.some((d) => !d) || isLoading || isExpired}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Verify & Sign In</span>
                </div>
              )}
            </Button>

            {/* Resend Button */}
            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Resend code in {resendCooldown}s</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Resend verification code</span>
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-400">
              <p>
                Didn&apos;t receive the code? Check your spam folder or request a new code.
                For security, codes expire after 15 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-xs">
            🔒 This verification step adds an extra layer of security to protect your account.
          </p>
        </div>
      </div>
    </div>
  );
}
