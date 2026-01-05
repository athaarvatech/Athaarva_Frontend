"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { Building2, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function PatientSignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hospitalSlug = searchParams.get("hospital") || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      // const response = await fetch("/api/auth/patient/signin", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...formData, hospitalSlug }),
      // });
      
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate successful signin
      console.log("Patient signin:", { ...formData, hospitalSlug });
      
      // Redirect to patient dashboard
      router.push(`/patient/dashboard?hospital=${hospitalSlug}`);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Signin error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth flow
      console.log("Google signin for hospital:", hospitalSlug);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/patient/dashboard?hospital=${hospitalSlug}`);
    } catch (err) {
      setError("Google sign in failed. Please try again.");
      console.error("Google signin error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <LogIn className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Patient Sign In
          </CardTitle>
          <CardDescription className="text-base">
            Access your appointments and health records
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

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium"
            onClick={handleGoogleSignin}
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
                Or continue with email
              </span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
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
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium underline-offset-4 hover:underline"
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

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-teal-600 hover:bg-teal-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/patient/signup${hospitalSlug ? `?hospital=${hospitalSlug}` : ""}`}
              className="text-teal-600 hover:text-teal-700 font-medium underline-offset-4 hover:underline"
            >
              Sign up
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
