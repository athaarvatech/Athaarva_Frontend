"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Calendar,
  Briefcase,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// =============================================================================
// Types
// =============================================================================

interface InvitationData {
  email: string;
  role: string;
  hospital_name: string;
  hospital_logo?: string;
  primary_color: string;
  secondary_color: string;
  invited_by: string;
  department?: string;
}

interface StaffOnboardingData {
  // Step 1: Account Setup
  full_name: string;
  phone: string;
  password: string;
  confirm_password: string;

  // Step 2: Professional Details
  department: string;
  designation: string;
  employee_id?: string;
  date_of_joining: string;

  // Step 3: Contact & Address
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;

  // Step 4: Agreements
  terms_accepted: boolean;
  privacy_accepted: boolean;
  code_of_conduct_accepted: boolean;
}

// =============================================================================
// Step 1: Account Setup
// =============================================================================

interface AccountSetupStepProps {
  data: StaffOnboardingData;
  invitationData: InvitationData;
  onChange: (updates: Partial<StaffOnboardingData>) => void;
}

function AccountSetupStep({
  data,
  invitationData,
  onChange,
}: AccountSetupStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = React.useMemo(() => {
    const password = data.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  }, [data.password]);

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-600">Invitation sent to</p>
          <p className="font-medium text-gray-900">{invitationData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="full_name"
              placeholder="Enter your full name"
              value={data.full_name}
              onChange={(e) => onChange({ full_name: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phone"
              placeholder="+91 9876543210"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Create Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {data.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index < passwordStrength
                      ? strengthColors[passwordStrength - 1]
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Password strength:{" "}
              {strengthLabels[Math.max(0, passwordStrength - 1)] || "Very Weak"}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={data.confirm_password}
            onChange={(e) => onChange({ confirm_password: e.target.value })}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {data.confirm_password && data.password !== data.confirm_password && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Passwords do not match
          </p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Step 2: Professional Details
// =============================================================================

interface ProfessionalDetailsStepProps {
  data: StaffOnboardingData;
  onChange: (updates: Partial<StaffOnboardingData>) => void;
}

function ProfessionalDetailsStep({
  data,
  onChange,
}: ProfessionalDetailsStepProps) {
  const departments = [
    "Administration",
    "Front Desk",
    "Billing",
    "Medical Records",
    "Nursing",
    "Pharmacy",
    "Laboratory",
    "Radiology",
    "Emergency",
    "Other",
  ];

  const designations = [
    "Receptionist",
    "Administrative Assistant",
    "Billing Executive",
    "Medical Records Clerk",
    "Nurse",
    "Lab Technician",
    "Pharmacist",
    "Ward Boy",
    "Security",
    "Housekeeping",
    "Other",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={data.department}
            onValueChange={(value) => onChange({ department: value })}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Select
            value={data.designation}
            onValueChange={(value) => onChange({ designation: value })}
          >
            <SelectTrigger id="designation">
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              {designations.map((designation) => (
                <SelectItem key={designation} value={designation.toLowerCase()}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employee_id">Employee ID (if provided)</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="employee_id"
              placeholder="EMP001"
              value={data.employee_id}
              onChange={(e) => onChange({ employee_id: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_joining">Date of Joining *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="date_of_joining"
              type="date"
              value={data.date_of_joining}
              onChange={(e) => onChange({ date_of_joining: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Step 3: Contact & Address
// =============================================================================

interface ContactAddressStepProps {
  data: StaffOnboardingData;
  onChange: (updates: Partial<StaffOnboardingData>) => void;
}

function ContactAddressStep({ data, onChange }: ContactAddressStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Current Address</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address"
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="City"
                value={data.city}
                onChange={(e) => onChange({ city: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="State"
                value={data.state}
                onChange={(e) => onChange({ state: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                placeholder="000000"
                value={data.pincode}
                onChange={(e) => onChange({ pincode: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_name">Contact Name *</Label>
            <Input
              id="emergency_contact_name"
              placeholder="Emergency contact name"
              value={data.emergency_contact_name}
              onChange={(e) =>
                onChange({ emergency_contact_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact_phone">Contact Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="emergency_contact_phone"
                placeholder="+91 9876543210"
                value={data.emergency_contact_phone}
                onChange={(e) =>
                  onChange({ emergency_contact_phone: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Step 4: Agreements
// =============================================================================

interface AgreementsStepProps {
  data: StaffOnboardingData;
  onChange: (updates: Partial<StaffOnboardingData>) => void;
  hospitalName: string;
}

function AgreementsStep({ data, onChange, hospitalName }: AgreementsStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          Please review and accept the following agreements to complete your
          onboarding at <strong>{hospitalName}</strong>.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-xl p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={data.terms_accepted}
              onCheckedChange={(checked) =>
                onChange({ terms_accepted: checked as boolean })
              }
            />
            <div className="flex-1">
              <Label htmlFor="terms" className="cursor-pointer font-medium">
                Terms of Service *
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                I agree to the terms of service and employment conditions of{" "}
                {hospitalName}.
              </p>
              <Button variant="link" className="p-0 h-auto text-sm mt-1">
                Read Terms of Service
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-start gap-3">
            <Checkbox
              id="privacy"
              checked={data.privacy_accepted}
              onCheckedChange={(checked) =>
                onChange({ privacy_accepted: checked as boolean })
              }
            />
            <div className="flex-1">
              <Label htmlFor="privacy" className="cursor-pointer font-medium">
                Privacy Policy *
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                I have read and understood the privacy policy regarding the
                collection and use of my personal information.
              </p>
              <Button variant="link" className="p-0 h-auto text-sm mt-1">
                Read Privacy Policy
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-start gap-3">
            <Checkbox
              id="code_of_conduct"
              checked={data.code_of_conduct_accepted}
              onCheckedChange={(checked) =>
                onChange({ code_of_conduct_accepted: checked as boolean })
              }
            />
            <div className="flex-1">
              <Label
                htmlFor="code_of_conduct"
                className="cursor-pointer font-medium"
              >
                Code of Conduct *
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                I agree to adhere to the professional code of conduct and
                maintain patient confidentiality as per HIPAA guidelines.
              </p>
              <Button variant="link" className="p-0 h-auto text-sm mt-1">
                Read Code of Conduct
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Staff Onboarding Page
// =============================================================================

export default function StaffOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [invitationData, setInvitationData] = useState<InvitationData>({
    email: "",
    role: "staff",
    hospital_name: "",
    primary_color: "#007C7C",
    secondary_color: "#20B2AA",
    invited_by: "",
  });

  const [formData, setFormData] = useState<StaffOnboardingData>({
    full_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    department: "",
    designation: "",
    employee_id: "",
    date_of_joining: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    terms_accepted: false,
    privacy_accepted: false,
    code_of_conduct_accepted: false,
  });

  const steps = [
    { title: "Account Setup", description: "Create your account" },
    { title: "Professional Details", description: "Your role information" },
    { title: "Contact Info", description: "Address and emergency contact" },
    { title: "Agreements", description: "Review and accept terms" },
  ];

  const primaryColor = invitationData.primary_color;

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("No invitation token provided");
        setValidating(false);
        setLoading(false);
        return;
      }

      try {
        // Validate token and get invitation data
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(
          `${API_BASE}/api/v1/team/invitations/validate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          throw new Error("Invalid or expired invitation");
        }

        const data = await response.json();
        setInvitationData({
          email: data.email,
          role: data.role,
          hospital_name: data.hospital_name,
          hospital_logo: data.hospital_logo,
          primary_color: data.primary_color || "#007C7C",
          secondary_color: data.secondary_color || "#20B2AA",
          invited_by: data.invited_by,
          department: data.department,
        });
        setFormData((prev) => ({
          ...prev,
          department: data.department || "",
        }));
      } catch {
        // For development, use mock data
        setInvitationData({
          email: "staff@example.com",
          role: "staff",
          hospital_name: "City Hospital",
          primary_color: "#007C7C",
          secondary_color: "#20B2AA",
          invited_by: "Admin",
          department: "administration",
        });
      } finally {
        setValidating(false);
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (updates: Partial<StaffOnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return (
          formData.full_name.length > 0 &&
          formData.phone.length >= 10 &&
          formData.password.length >= 8 &&
          formData.password === formData.confirm_password
        );
      case 1:
        return (
          formData.department.length > 0 && formData.designation.length > 0
        );
      case 2:
        return (
          formData.address.length > 0 &&
          formData.city.length > 0 &&
          formData.state.length > 0 &&
          formData.pincode.length > 0 &&
          formData.emergency_contact_name.length > 0 &&
          formData.emergency_contact_phone.length >= 10
        );
      case 3:
        return (
          formData.terms_accepted &&
          formData.privacy_accepted &&
          formData.code_of_conduct_accepted
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/v1/team/staff/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(
          `/auth/hospital/${invitationData.hospital_name
            .toLowerCase()
            .replace(/\s+/g, "-")}`
        );
      }, 3000);
    } catch {
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || validating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="w-8 h-8 animate-spin mx-auto mb-4"
            style={{ color: primaryColor }}
          />
          <p className="text-gray-600">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitationData.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardContent className="p-8 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <CheckCircle
                  className="w-10 h-10"
                  style={{ color: primaryColor }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Aboard!
              </h2>
              <p className="text-gray-600 mb-4">
                Your account has been created successfully. You can now log in
                to the {invitationData.hospital_name} portal.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}08 0%, ${primaryColor}15 100%)`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {invitationData.hospital_logo ? (
            <Image
              src={invitationData.hospital_logo}
              alt={invitationData.hospital_name}
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: primaryColor }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            Join {invitationData.hospital_name}
          </h1>
          <p className="text-gray-600 mt-1">Complete your staff onboarding</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? "text-white"
                      : index === currentStep
                      ? "text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  style={
                    index <= currentStep
                      ? { backgroundColor: primaryColor }
                      : {}
                  }
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-1 rounded-full ${
                      index < currentStep ? "" : "bg-gray-200"
                    }`}
                    style={
                      index < currentStep
                        ? { backgroundColor: primaryColor }
                        : {}
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">
              {steps[currentStep].title}
            </p>
            <p className="text-sm text-gray-500">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 0 && (
                  <AccountSetupStep
                    data={formData}
                    invitationData={invitationData}
                    onChange={handleChange}
                  />
                )}
                {currentStep === 1 && (
                  <ProfessionalDetailsStep
                    data={formData}
                    onChange={handleChange}
                  />
                )}
                {currentStep === 2 && (
                  <ContactAddressStep data={formData} onChange={handleChange} />
                )}
                {currentStep === 3 && (
                  <AgreementsStep
                    data={formData}
                    onChange={handleChange}
                    hospitalName={invitationData.hospital_name}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
              }}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!validateStep(currentStep) || submitting}
              className="text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
