"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  UserPlus,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Mail,
  Phone,
  User,
  Building2,
  Key,
  AlertCircle,
} from "lucide-react";

interface StaffFormData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  loginId: string;
  password: string;
  employeeId: string;
  shift: string;
  notes: string;
}

const AddStaffPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    loginId: "",
    password: "",
    employeeId: "",
    shift: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<StaffFormData>>({});

  const roles = [
    "Nurse",
    "Registered Nurse",
    "Nurse Practitioner",
    "Receptionist",
    "Lab Technician",
    "Pharmacist",
    "Radiologist Technician",
    "Physical Therapist",
    "Medical Assistant",
    "Administrative Assistant",
    "Security Officer",
    "Cleaner",
    "IT Support",
    "Medical Records Clerk",
    "Billing Specialist",
  ];

  const departments = [
    "Emergency Department",
    "Intensive Care Unit",
    "Operating Theater",
    "Outpatient Department",
    "Pediatric Ward",
    "Maternity Ward",
    "Cardiology Department",
    "Oncology Department",
    "Radiology Department",
    "Laboratory",
    "Pharmacy",
    "Physical Therapy",
    "Administration",
    "Human Resources",
    "IT Department",
    "Security",
    "Maintenance",
  ];

  const shifts = [
    "Day Shift (6 AM - 6 PM)",
    "Night Shift (6 PM - 6 AM)",
    "Morning Shift (8 AM - 4 PM)",
    "Evening Shift (4 PM - 12 AM)",
    "Rotating Shift",
    "On-Call",
    "Part-Time",
    "Full-Time Regular",
  ];

  // Generate login ID based on name
  const generateLoginId = (name: string) => {
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();
    const nameParts = cleanName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0]}.${nameParts[nameParts.length - 1]}`;
    }
    return cleanName.replace(/\s+/g, ".");
  };

  // Generate random password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Generate employee ID
  const generateEmployeeId = () => {
    const prefix = "EMP";
    const number = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${number}`;
  };

  const handleInputChange = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate login ID when name changes
    if (field === "fullName" && value) {
      const loginId = generateLoginId(value);
      setFormData((prev) => ({
        ...prev,
        loginId,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StaffFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.loginId.trim()) {
      newErrors.loginId = "Login ID is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success toast with credentials
      toast.success(
        `Staff account created successfully! Login credentials will be sent to ${formData.email}`,
        {
          duration: 5000,
        }
      );

      // Reset form
      resetForm();
    } catch {
      toast.error("Failed to create staff account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      loginId: "",
      password: "",
      employeeId: "",
      shift: "",
      notes: "",
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#20B2AA] text-white">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Staff</h1>
          <p className="text-gray-600">
            Create a new staff account and send login credentials
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#20B2AA]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Jane Smith"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="jane.smith@example.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) =>
                      handleInputChange("employeeId", e.target.value)
                    }
                    placeholder="EMP12345"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleInputChange("employeeId", generateEmployeeId())
                    }
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#50C878]" />
                Work Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger
                    className={errors.role ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger
                    className={errors.department ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="shift">Work Shift</Label>
                <Select
                  value={formData.shift}
                  onValueChange={(value) => handleInputChange("shift", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map((shift) => (
                      <SelectItem key={shift} value={shift}>
                        {shift}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Access */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-[#4F46E5]" />
              System Access Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="loginId">System Login ID *</Label>
                <Input
                  id="loginId"
                  value={formData.loginId}
                  onChange={(e) => handleInputChange("loginId", e.target.value)}
                  placeholder="jane.smith"
                  className={errors.loginId ? "border-red-500" : ""}
                />
                {errors.loginId && (
                  <p className="text-sm text-red-500 mt-1">{errors.loginId}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from name, but can be edited
                </p>
              </div>

              <div>
                <Label htmlFor="password">Temporary Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Generated password"
                    className={`pr-16 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <div className="absolute right-1 top-1 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8 p-0"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleInputChange("password", generatePassword())
                      }
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Click refresh icon to generate new password
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information about the staff member..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Credentials will be sent to the staff member&apos;s email
                  address
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Form
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#20B2AA] hover:bg-[#1a9a91]"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save & Send Credentials
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddStaffPage;
