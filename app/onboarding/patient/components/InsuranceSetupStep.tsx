"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PatientOnboardingData } from "../page";

interface InsuranceSetupStepProps {
  data: PatientOnboardingData;
  updateData: <T extends keyof PatientOnboardingData>(
    section: T,
    data: Partial<PatientOnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
}

const insuranceProviders = [
  "Star Health Insurance",
  "Bajaj Allianz Health Insurance",
  "HDFC ERGO Health Insurance",
  "ICICI Lombard Health Insurance",
  "Aditya Birla Health Insurance",
  "Max Bupa Health Insurance",
  "Religare Health Insurance",
  "New India Assurance",
  "Oriental Insurance",
  "United India Insurance",
  "National Insurance",
  "Government Employee Insurance Scheme (GEIS)",
  "Employees' State Insurance Corporation (ESIC)",
  "Central Government Health Scheme (CGHS)",
  "Ayushman Bharat",
  "Other"
];

const relations = [
  "Self",
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Other"
];

const InsuranceSetupStep: React.FC<InsuranceSetupStepProps> = ({
  data,
  updateData,
  onStepComplete,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "failed">("pending");

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const { insurance } = data;

    if (!insurance.provider.trim()) {
      newErrors.provider = "Insurance provider is required";
    }

    if (!insurance.policyNumber.trim()) {
      newErrors.policyNumber = "Policy number is required";
    } else if (insurance.policyNumber.length < 8) {
      newErrors.policyNumber = "Policy number must be at least 8 characters";
    }

    if (!insurance.validTill) {
      newErrors.validTill = "Policy validity date is required";
    } else {
      const validTillDate = new Date(insurance.validTill);
      const today = new Date();
      if (validTillDate <= today) {
        newErrors.validTill = "Policy must be valid for future dates";
      }
    }

    if (!insurance.nomineeName.trim()) {
      newErrors.nomineeName = "Nominee name is required";
    }

    if (!insurance.nomineeRelation.trim()) {
      newErrors.nomineeRelation = "Nominee relation is required";
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    
    if (valid) {
      onStepComplete();
    }
    
    return valid;
  }, [data, onStepComplete]);

  // Auto-validate on data change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleInputChange = (field: keyof typeof data.insurance, value: string) => {
    updateData("insurance", { [field]: value });
  };

  const formatPolicyNumber = (value: string) => {
    // Remove non-alphanumeric characters and format
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (cleaned.length <= 3) {
      return cleaned;
    }
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 9)}`;
  };

  const handlePolicyNumberChange = (value: string) => {
    const formatted = formatPolicyNumber(value);
    handleInputChange("policyNumber", formatted);
  };

  const simulateInsuranceVerification = async () => {
    setIsVerifying(true);
    setVerificationStatus("pending");
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate random success/failure for demo
      const success = Math.random() > 0.3; // 70% success rate
      setVerificationStatus(success ? "success" : "failed");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // Trigger verification when policy number and provider are filled
    if (data.insurance.provider && data.insurance.policyNumber.length >= 8) {
      simulateInsuranceVerification();
    }
  }, [data.insurance.provider, data.insurance.policyNumber]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-healthcare-primary" />
              Insurance Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-sm font-medium">
                Insurance Provider *
              </Label>
              <Select value={data.insurance.provider} onValueChange={(value) => handleInputChange("provider", value)}>
                <SelectTrigger className={cn(errors.provider && "border-red-500")}>
                  <SelectValue placeholder="Select your insurance provider" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provider && (
                <p className="text-red-500 text-sm">{errors.provider}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyNumber" className="text-sm font-medium">
                Policy Number *
              </Label>
              <div className="relative">
                <Input
                  id="policyNumber"
                  value={data.insurance.policyNumber}
                  onChange={(e) => handlePolicyNumberChange(e.target.value)}
                  placeholder="ABC-123456"
                  className={cn(errors.policyNumber && "border-red-500")}
                />
                {isVerifying && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-healthcare-primary/30 border-t-healthcare-primary rounded-full animate-spin" />
                  </div>
                )}
                {!isVerifying && verificationStatus === "success" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
                {!isVerifying && verificationStatus === "failed" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                )}
              </div>
              {errors.policyNumber && (
                <p className="text-red-500 text-sm">{errors.policyNumber}</p>
              )}
              {verificationStatus === "success" && (
                <p className="text-green-600 text-sm">✓ Policy verified successfully</p>
              )}
              {verificationStatus === "failed" && (
                <p className="text-red-600 text-sm">⚠ Policy verification failed. Please check your details.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="validTill" className="text-sm font-medium">
                Policy Valid Till *
              </Label>
              <Input
                id="validTill"
                type="date"
                value={data.insurance.validTill}
                onChange={(e) => handleInputChange("validTill", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={cn(errors.validTill && "border-red-500")}
              />
              {errors.validTill && (
                <p className="text-red-500 text-sm">{errors.validTill}</p>
              )}
            </div>

            {/* Insurance Card Preview */}
            {data.insurance.provider && data.insurance.policyNumber && (
              <div className="mt-6">
                <Label className="text-sm font-medium mb-2 block">Insurance Card Preview</Label>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{data.insurance.provider}</h3>
                      <p className="text-blue-100 text-sm">Health Insurance</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-white/80" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-blue-100 text-xs">Policy Number</p>
                      <p className="font-mono text-sm">{data.insurance.policyNumber}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-blue-100 text-xs">Member</p>
                        <p className="text-sm">{data.basicInfo.firstName} {data.basicInfo.lastName}</p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-xs">Valid Till</p>
                        <p className="text-sm">{data.insurance.validTill ? new Date(data.insurance.validTill).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nominee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-healthcare-primary" />
              Nominee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomineeName" className="text-sm font-medium">
                  Nominee Name *
                </Label>
                <Input
                  id="nomineeName"
                  value={data.insurance.nomineeName}
                  onChange={(e) => handleInputChange("nomineeName", e.target.value)}
                  placeholder="Enter nominee name"
                  className={cn(errors.nomineeName && "border-red-500")}
                />
                {errors.nomineeName && (
                  <p className="text-red-500 text-sm">{errors.nomineeName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomineeRelation" className="text-sm font-medium">
                  Relation to You *
                </Label>
                <Select value={data.insurance.nomineeRelation} onValueChange={(value) => handleInputChange("nomineeRelation", value)}>
                  <SelectTrigger className={cn(errors.nomineeRelation && "border-red-500")}>
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
                {errors.nomineeRelation && (
                  <p className="text-red-500 text-sm">{errors.nomineeRelation}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Summary */}
        {isValid && verificationStatus === "success" ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Insurance setup completed successfully!
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              {verificationStatus === "failed" 
                ? "Please verify your insurance details to proceed"
                : "Please complete all insurance information to proceed"
              }
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InsuranceSetupStep;
