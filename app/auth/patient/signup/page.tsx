"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { Building2, UserPlus, Mail, Phone, MapPin, CreditCard } from "lucide-react";

function PatientSignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hospitalSlug = searchParams.get("hospital") || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    aadharCard: "",
    email: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error("OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.phone || !formData.address) {
      setError("Please fill in all required fields");
      return;
    }

    if (!otpSent || !otp) {
      setError("Please verify your phone number with OTP");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/auth/patient/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...formData, otp, hospitalSlug }),
      // });

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful signup
      console.log("Patient signup:", { ...formData, otp, hospitalSlug });
      
      // Redirect to patient dashboard
      router.push(`/patient/dashboard?hospital=${hospitalSlug}`);
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth flow
      console.log("Google signup for hospital:", hospitalSlug);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/patient/dashboard?hospital=${hospitalSlug}`);
    } catch (err) {
      setError("Google sign up failed. Please try again.");
      console.error("Google signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <UserPlus className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create Patient Account
          </CardTitle>
          <CardDescription className="text-base">
            Sign up to book appointments and manage your health records
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
                Or sign up with phone
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading || otpSent}
                    className="pl-10 h-11"
                    maxLength={15}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || otpSent || !formData.phone}
                  className="h-11"
                  variant={otpSent ? "outline" : "default"}
                >
                  {otpSent ? "OTP Sent ✓" : "Send OTP"}
                </Button>
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP *</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500">
                  OTP sent to {formData.phone}
                </p>
              </div>
            )}

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
                  maxLength={12}
                />
              </div>
              <p className="text-xs text-gray-500">
                12-digit Aadhar number for identity verification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
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
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-teal-600 hover:bg-teal-700"
              disabled={isLoading || !otpSent}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
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
