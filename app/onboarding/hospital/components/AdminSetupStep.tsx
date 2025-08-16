"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  Edit,
  Building2,
  Globe,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";

const passwordRequirements = [
  { id: 'length', text: 'At least 8 characters', check: (pwd: string) => pwd.length >= 8 },
  { id: 'uppercase', text: 'One uppercase letter', check: (pwd: string) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', text: 'One lowercase letter', check: (pwd: string) => /[a-z]/.test(pwd) },
  { id: 'number', text: 'One number', check: (pwd: string) => /\d/.test(pwd) },
  { id: 'special', text: 'One special character', check: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) },
];

function PasswordStrengthIndicator({ password }: { password: string }) {
  const metRequirements = passwordRequirements.filter(req => req.check(password));
  const strength = metRequirements.length;
  const strengthPercentage = (strength / passwordRequirements.length) * 100;
  
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Password Strength</span>
        <span className={cn(
          "text-xs font-medium",
          strength <= 1 ? "text-red-600" :
          strength <= 2 ? "text-orange-600" :
          strength <= 3 ? "text-yellow-600" :
          strength <= 4 ? "text-green-600" : "text-emerald-600"
        )}>
          {strengthLabels[strength - 1] || 'Very Weak'}
        </span>
      </div>
      
      <Progress 
        value={strengthPercentage} 
        className={cn(
          "h-2",
          strength <= 1 ? "[&>div]:bg-red-500" :
          strength <= 2 ? "[&>div]:bg-orange-500" :
          strength <= 3 ? "[&>div]:bg-yellow-500" :
          strength <= 4 ? "[&>div]:bg-green-500" : "[&>div]:bg-emerald-500"
        )}
      />
      
      <div className="space-y-1">
        {passwordRequirements.map((req) => (
          <div key={req.id} className="flex items-center space-x-2">
            {req.check(password) ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <div className="h-3 w-3 rounded-full border border-gray-300" />
            )}
            <span className={cn(
              "text-xs",
              req.check(password) ? "text-green-600" : "text-gray-500"
            )}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSetupStep() {
  const { data, updateData, setCurrentStep } = useHospitalOnboarding();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationState, setValidationState] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleInputChange = (field: string, value: string) => {
    updateData('adminSetup', { [field]: value });

    // Real-time validation
    let isValid = true;
    if (field === 'workEmail') {
      isValid = validateEmail(value);
    } else if (field === 'phone') {
      isValid = validatePhone(value);
    } else if (field === 'confirmPassword') {
      isValid = value === data.adminSetup.password;
    }

    setValidationState(prev => ({ ...prev, [field]: isValid }));
  };

  const isPasswordValid = passwordRequirements.every(req => req.check(data.adminSetup.password));
  const passwordsMatch = data.adminSetup.password === data.adminSetup.confirmPassword;

  return (
    <div className="space-y-4">
      {/* Admin Account Creation */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Create Admin Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={data.adminSetup.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="e.g., Dr. Asha Verma"
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminPhone" className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="adminPhone"
                value={data.adminSetup.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="9876543210"
                className={cn(
                  "h-9",
                  validationState.phone === false 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                )}
              />
              {validationState.phone === false && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>Enter valid 10-digit phone number</span>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="workEmail" className="text-sm font-medium text-gray-700">
              Work Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="workEmail"
              type="email"
              value={data.adminSetup.workEmail}
              onChange={(e) => handleInputChange('workEmail', e.target.value)}
              placeholder="admin@sunrisehospital.com"
              className={cn(
                "h-9",
                validationState.workEmail === false 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              )}
            />
            {validationState.workEmail === false && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>Enter valid email address</span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Used for admin login and notifications
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={data.adminSetup.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create strong password"
                  className={cn(
                    "h-9 pr-9",
                    !isPasswordValid && data.adminSetup.password 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 w-9 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={data.adminSetup.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className={cn(
                    "h-9 pr-9",
                    data.adminSetup.confirmPassword && !passwordsMatch 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 w-9 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {data.adminSetup.confirmPassword && !passwordsMatch && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>Passwords do not match</span>
                </div>
              )}
              {data.adminSetup.confirmPassword && passwordsMatch && (
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>
          </div>

          {/* Password Strength */}
          {data.adminSetup.password && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <PasswordStrengthIndicator password={data.adminSetup.password} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Review */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Shield className="h-5 w-5 text-green-600" />
            Setup Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Hospital Basics Review */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Hospital Basics</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="h-6 px-2 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div><span className="font-medium">Name:</span> {data.hospitalBasics.hospitalName}</div>
                <div><span className="font-medium">License:</span> {data.hospitalBasics.licenseNumber}</div>
                <div><span className="font-medium">Location:</span> {data.hospitalBasics.city}, {data.hospitalBasics.state}</div>
              </div>
            </div>

            {/* Branding Review */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Branding</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="h-6 px-2 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Colors:</span>
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded border" 
                      style={{ backgroundColor: data.branding.primaryColor }}
                    />
                    <div 
                      className="w-3 h-3 rounded border" 
                      style={{ backgroundColor: data.branding.secondaryColor }}
                    />
                  </div>
                </div>
                {data.branding.logoUrl && (
                  <div className="text-green-600">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Logo uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Login Page Review */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Login Page</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} className="h-6 px-2 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div>
                  <span className="font-medium">URL:</span> 
                  <div className="font-mono text-blue-600 text-xs">
                    {data.loginPage.subdomain}.atharva.com
                  </div>
                </div>
              </div>
            </div>

            {/* Ready Status */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Ready to Launch</span>
              </div>
              <p className="text-xs text-green-700">
                All required information provided. Click &quot;Create Hospital&quot; to finish setup.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
