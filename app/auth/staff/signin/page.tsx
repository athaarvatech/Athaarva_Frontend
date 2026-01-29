"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope, Mail, Lock, Eye, EyeOff, Info, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import EmailOTP2FA from "@/components/auth/EmailOTP2FA";

type AuthStep = "credentials" | "2fa";

export default function StaffSignInPage() {
  const router = useRouter();

  // Auth step state
  const [authStep, setAuthStep] = useState<AuthStep>("credentials");
  
  // Credentials state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 2FA state
  const [sessionToken, setSessionToken] = useState("");
  const [userId, setUserId] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/auth/staff/signin", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock response - simulate 2FA requirement
      const mockResponse = {
        success: true,
        requires_2fa: true, // Set to true to test 2FA flow
        session_token: `session-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        user_email: formData.email,
        user_role: formData.email.includes("admin") ? "admin" : "doctor",
      };

      if (mockResponse.requires_2fa) {
        // User has 2FA enabled, proceed to 2FA verification
        setSessionToken(mockResponse.session_token);
        setUserId(mockResponse.user_id);
        setRequires2FA(true);
        setAuthStep("2fa");
        toast.info("Please verify your identity with 2FA");
      } else {
        // No 2FA required, proceed directly
        handleAuthSuccess(mockResponse.session_token, mockResponse.user_role);
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Signin error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful authentication (after 2FA if required)
  const handleAuthSuccess = (token: string, role?: string) => {
    // Store token
    localStorage.setItem("access_token", token);
    
    toast.success("Sign in successful!");
    
    // Redirect based on role
    const userRole = role || (formData.email.includes("admin") ? "admin" : "doctor");
    
    if (userRole === "admin") {
      router.push("/Admin/dashboard");
    } else if (userRole === "doctor") {
      router.push("/doctor/dashboard");
    } else {
      router.push("/hospital/dashboard");
    }
  };

  // Handle 2FA success
  const handle2FASuccess = (finalToken: string, rememberDevice: boolean) => {
    if (rememberDevice) {
      // Store device fingerprint for 30 days
      localStorage.setItem("2fa_device_token", `device-${Date.now()}`);
      localStorage.setItem("2fa_device_expiry", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
    }
    
    handleAuthSuccess(finalToken);
  };

  // Handle 2FA cancel
  const handle2FACancel = () => {
    setAuthStep("credentials");
    setSessionToken("");
    setUserId("");
    setRequires2FA(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {authStep === "credentials" ? (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-2xl">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Staff Sign In
                </CardTitle>
                <CardDescription className="text-base">
                  For doctors, nurses, and hospital administrators
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Staff Access Only</p>
                    <p className="text-blue-700">
                      Use the credentials provided by your hospital administrator.
                    </p>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Sign In Form */}
                <form onSubmit={handleSignin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* 2FA Info */}
                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Protected with Two-Factor Authentication</span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <span className="text-foreground font-medium">
                    Contact your hospital administrator
                  </span>
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  Are you a patient?{" "}
                  <Link
                    href="/auth/patient/signin"
                    className="text-teal-600 hover:text-teal-700 font-medium underline-offset-4 hover:underline"
                  >
                    Patient sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="2fa"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <EmailOTP2FA
              email={formData.email}
              userId={userId}
              sessionToken={sessionToken}
              onSuccess={handle2FASuccess}
              onCancel={handle2FACancel}
              allowRememberDevice={true}
              maxAttempts={5}
              otpExpirySeconds={300}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
