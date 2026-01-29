"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  UserPlus,
  Mail,
  User,
  ShieldCheck,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { API_CONFIG } from "@/lib/api-config";

interface InviteFormData {
  fullName: string;
  email: string;
}

interface InviteErrors {
  fullName?: string;
  email?: string;
  token?: string;
}

interface InviteResult {
  message: string;
  email: string;
  temporary_password: string;
  doctor_id: number;
}

const AddDoctorPage = () => {
  const [formData, setFormData] = useState<InviteFormData>({
    fullName: "",
    email: "",
  });
  const [errors, setErrors] = useState<InviteErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<InviteResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof InviteFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const resetForm = () => {
    setFormData({ fullName: "", email: "" });
    setErrors({});
    setCopied(false);
  };

  const validate = () => {
    const nextErrors: InviteErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Doctor email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (formData.fullName && formData.fullName.trim().length < 2) {
      nextErrors.fullName = "Name should be at least 2 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInviteResult(null);

    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      setErrors({ token: "Session expired. Please log in again." });
      toast.error("Session expired. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS.INVITE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            full_name: formData.fullName.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.message || "Failed to invite doctor"
        );
      }

      const data: InviteResult = await response.json();
      setInviteResult(data);
      toast.success(data.message || "Doctor invited successfully");
      resetForm();
    } catch (error) {
      const message = (error as Error).message || "Failed to invite doctor";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteResult?.temporary_password) return;

    try {
      await navigator.clipboard.writeText(inviteResult.temporary_password);
      setCopied(true);
      toast.success("Temporary password copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy password. Please copy manually.");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#007C7C] text-white shadow-md">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Invite a Doctor
          </h1>
          <p className="text-gray-600">
            Enter the doctor&apos;s email and we&apos;ll email their temporary
            credentials instantly.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-[#0F766E]" />
            Secure Invitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Doctor Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="dr.jane@hospital.com"
                  value={formData.email}
                  onChange={(event) =>
                    handleInputChange("email", event.target.value)
                  }
                  className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Doctor Name (optional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  placeholder="Dr. Jane Cooper"
                  value={formData.fullName}
                  onChange={(event) =>
                    handleInputChange("fullName", event.target.value)
                  }
                  className={`pl-9 ${errors.fullName ? "border-red-500" : ""}`}
                />
              </div>
              <p className="text-sm text-gray-500">
                We&apos;ll personalise the invite using this name if provided.
              </p>
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {errors.token && (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {errors.token}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="bg-[#007C7C] hover:bg-[#066666]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending invite...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Send Invitation
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {inviteResult && (
        <Card className="border-emerald-200 bg-emerald-50 shadow-inner">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
              Invitation sent to {inviteResult.email}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-900">
            <p>{inviteResult.message}</p>
            <div className="rounded-lg border border-emerald-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-emerald-500">
                Temporary Password
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <code className="rounded-md bg-emerald-100 px-3 py-1 font-mono text-base text-emerald-700">
                  {inviteResult.temporary_password}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-4 w-4" /> Copy password
                    </span>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-emerald-600">
                Share this password securely if needed. The doctor will be
                asked to change it after first login.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddDoctorPage;
