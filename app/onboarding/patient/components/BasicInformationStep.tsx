"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Phone, 
  MapPin,
  CheckCircle,
  AlertCircle,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PatientOnboardingData } from "../page";

interface BasicInformationStepProps {
  data: PatientOnboardingData;
  updateData: <T extends keyof PatientOnboardingData>(
    section: T,
    data: Partial<PatientOnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
}

const relations = [
  "Spouse",
  "Parent",
  "Child", 
  "Sibling",
  "Relative",
  "Friend",
  "Guardian",
  "Other"
];

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  data,
  updateData,
  onStepComplete,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Age calculation from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const { basicInfo } = data;

    if (!basicInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!basicInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!basicInfo.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const age = calculateAge(basicInfo.dateOfBirth);
      if (age < 0 || age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    if (!basicInfo.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!basicInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(basicInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    } else if (!otpVerified) {
      newErrors.phone = "Please verify your phone number";
    }

    if (basicInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!basicInfo.emergencyContact.name.trim()) {
      newErrors.emergencyContactName = "Emergency contact name is required";
    }

    if (!basicInfo.emergencyContact.relation.trim()) {
      newErrors.emergencyContactRelation = "Emergency contact relation is required";
    }

    if (!basicInfo.emergencyContact.phone.trim()) {
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(basicInfo.emergencyContact.phone)) {
      newErrors.emergencyContactPhone = "Please enter a valid phone number";
    }

    if (!basicInfo.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    
    if (valid) {
      onStepComplete();
    }
    
    return valid;
  }, [data, otpVerified, onStepComplete]);

  // Auto-validate on data change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // OTP countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (field: keyof typeof data.basicInfo, value: string) => {
    updateData("basicInfo", { [field]: value });
  };

  const handleEmergencyContactChange = (field: keyof typeof data.basicInfo.emergencyContact, value: string) => {
    updateData("basicInfo", { 
      emergencyContact: { 
        ...data.basicInfo.emergencyContact, 
        [field]: value 
      } 
    });
  };

  const handleSendOTP = () => {
    if (data.basicInfo.phone && !otpSent) {
      setOtpSent(true);
      setCountdown(60);
      // Simulate OTP sending
      console.log("OTP sent to", data.basicInfo.phone);
    }
  };

  const handleVerifyOTP = () => {
    // Simulate OTP verification (accept any 6-digit code for demo)
    if (otp.length === 6) {
      setOtpVerified(true);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    } else {
      setErrors(prev => ({ ...prev, otp: "Please enter a valid 6-digit OTP" }));
    }
  };

  const age = calculateAge(data.basicInfo.dateOfBirth);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-healthcare-primary" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={data.basicInfo.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  className={cn(errors.firstName && "border-red-500")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={data.basicInfo.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  className={cn(errors.lastName && "border-red-500")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={data.basicInfo.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={cn(errors.dateOfBirth && "border-red-500")}
                />
                {age > 0 && (
                  <p className="text-sm text-gray-600">Age: {age} years</p>
                )}
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender *
                </Label>
                <Select value={data.basicInfo.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className={cn(errors.gender && "border-red-500")}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="abhaId" className="text-sm font-medium">
                ABHA ID (Optional)
              </Label>
              <Input
                id="abhaId"
                value={data.basicInfo.abhaId}
                onChange={(e) => handleInputChange("abhaId", e.target.value.replace(/\D/g, '').slice(0, 14))}
                placeholder="Enter your 14-digit ABHA ID"
                maxLength={14}
              />
              <p className="text-xs text-gray-500">
                Your Ayushman Bharat Health Account ID (if available)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-healthcare-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  value={data.basicInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 12345 67890"
                  className={cn(errors.phone && "border-red-500", "flex-1")}
                  disabled={otpVerified}
                />
                {!otpVerified && (
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={!data.basicInfo.phone || otpSent}
                    variant="outline"
                  >
                    {countdown > 0 ? `${countdown}s` : "Send OTP"}
                  </Button>
                )}
                {otpVerified && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}

              {otpSent && !otpVerified && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Enter OTP
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6}
                    >
                      Verify
                    </Button>
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-sm">{errors.otp}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={data.basicInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-healthcare-primary" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="emergencyContactName"
                  value={data.basicInfo.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                  placeholder="Emergency contact name"
                  className={cn(errors.emergencyContactName && "border-red-500")}
                />
                {errors.emergencyContactName && (
                  <p className="text-red-500 text-sm">{errors.emergencyContactName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation" className="text-sm font-medium">
                  Relation *
                </Label>
                <Select 
                  value={data.basicInfo.emergencyContact.relation} 
                  onValueChange={(value) => handleEmergencyContactChange("relation", value)}
                >
                  <SelectTrigger className={cn(errors.emergencyContactRelation && "border-red-500")}>
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {relations.map((relation) => (
                      <SelectItem key={relation} value={relation.toLowerCase()}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.emergencyContactRelation && (
                  <p className="text-red-500 text-sm">{errors.emergencyContactRelation}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                value={data.basicInfo.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                placeholder="+91 12345 67890"
                className={cn(errors.emergencyContactPhone && "border-red-500")}
              />
              {errors.emergencyContactPhone && (
                <p className="text-red-500 text-sm">{errors.emergencyContactPhone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-healthcare-primary" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Permanent Address *
              </Label>
              <Input
                id="address"
                value={data.basicInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your complete address"
                className={cn(errors.address && "border-red-500")}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validation Summary */}
        {isValid ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Basic information completed successfully!
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Please fill in all required fields to proceed
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BasicInformationStep;
