"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useSecureSuperAdminAuth } from "@/contexts/SecureSuperAdminAuthContext";
import { SUPER_ADMIN_CONFIG } from "@/lib/super-admin-config";

/**
 * Secure Super Admin Login Page
 * 
 * Step 1 of 2-factor authentication:
 * - Checks IP whitelist
 * - Accepts email + password
 * - Sends OTP to registered email
 */
export default function SecureSuperAdminLoginPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    loading: authLoading,
    ipWhitelisted,
    clientIP,
    pendingOTP,
    checkIPWhitelist,
    initiateLogin,
  } = useSecureSuperAdminAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [ipChecking, setIpChecking] = useState(true);

  // Check IP whitelist on mount
  useEffect(() => {
    const checkIP = async () => {
      setIpChecking(true);
      await checkIPWhitelist();
      setIpChecking(false);
    };
    checkIP();
  }, [checkIPWhitelist]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/invites`);
    }
  }, [authLoading, isAuthenticated, router]);

  // Redirect if pending OTP
  useEffect(() => {
    if (!authLoading && pendingOTP) {
      router.replace(`${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}/verify`);
    }
  }, [authLoading, pendingOTP, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await initiateLogin(formData.email, formData.password);
      // Will automatically redirect to verify page via context
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  // Show loading while checking IP
  if (ipChecking || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          <div className="w-8 h-8 border-3 border-red-500/50 border-t-red-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/70">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if IP not whitelisted
  if (ipWhitelisted === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-red-950/50 border-red-500/30">
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 border-2 border-red-500/50 rounded-full mx-auto">
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
              <p className="text-red-200/80">
                Your IP address is not authorized to access this area.
              </p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4 text-sm">
              <p className="text-slate-400 mb-2">Your IP Address:</p>
              <code className="text-red-300 font-mono">{clientIP || "Unknown"}</code>
            </div>
            
            <p className="text-sm text-slate-400">
              If you believe this is an error, please contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-xl shadow-red-600/20">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Control</h1>
          <p className="text-slate-400">Secure administrative access</p>
        </div>

        {/* IP Status Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">IP Verified: {clientIP}</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-white text-center">
              Step 1: Authenticate
            </CardTitle>
            <p className="text-sm text-slate-400 text-center">
              Enter your credentials to receive a verification code
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <Alert className="bg-red-500/10 border-red-500/30 text-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@athaarva.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending verification code...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span>Continue to Verification</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-400">
                  <p className="font-medium text-slate-300 mb-1">Two-Factor Authentication</p>
                  <p>
                    After verifying your password, a one-time code will be sent to your 
                    registered email address.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-xs">
            🔒 This is a secure administrative portal. All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
