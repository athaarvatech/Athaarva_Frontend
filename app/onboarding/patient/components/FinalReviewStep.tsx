"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  Heart,
  ExternalLink,
  Eye,
} from "lucide-react";
import { PatientOnboardingData } from "../page";

interface FinalReviewStepProps {
  data: PatientOnboardingData;
  updateData: <T extends keyof PatientOnboardingData>(
    section: T,
    data: Partial<PatientOnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
}

const FinalReviewStep: React.FC<FinalReviewStepProps> = ({
  data,
  updateData,
  onStepComplete,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Validation
  const validateForm = useCallback(() => {
    const { consent } = data;
    const valid = consent.termsAccepted && consent.privacyAccepted;
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

  const handleConsentChange = (
    field: keyof typeof data.consent,
    value: boolean
  ) => {
    updateData("consent", { [field]: value });
  };

  const handleHealthRiskChange = (
    field: keyof typeof data.consent.healthRiskSurvey,
    value: string
  ) => {
    updateData("consent", {
      healthRiskSurvey: {
        ...data.consent.healthRiskSurvey,
        [field]: value,
      },
    });
  };

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Review Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-healthcare-primary" />
              Registration Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information Summary */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                <User className="w-4 h-4" />
                Personal Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">
                      {data.basicInfo.firstName} {data.basicInfo.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Age:</span>
                    <span className="ml-2 font-medium">
                      {calculateAge(data.basicInfo.dateOfBirth)} years
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Gender:</span>
                    <span className="ml-2 font-medium capitalize">
                      {data.basicInfo.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">
                      {data.basicInfo.phone}
                    </span>
                  </div>
                  {data.basicInfo.email && (
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">
                        {data.basicInfo.email}
                      </span>
                    </div>
                  )}
                  {data.basicInfo.abhaId && (
                    <div>
                      <span className="text-sm text-gray-600">ABHA ID:</span>
                      <span className="ml-2 font-medium font-mono">
                        {data.basicInfo.abhaId}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Emergency Contact:
                  </span>
                  <span className="ml-2 font-medium">
                    {data.basicInfo.emergencyContact.name} (
                    {data.basicInfo.emergencyContact.relation}) -{" "}
                    {data.basicInfo.emergencyContact.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical History Summary */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                <Heart className="w-4 h-4" />
                Medical History
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {data.medicalHistory.noMedicalHistory ? (
                  <p className="text-gray-600 text-sm">
                    No significant medical history reported
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.medicalHistory.allergies.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">
                          Allergies:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {data.medicalHistory.allergies.map((allergy) => (
                            <Badge
                              key={allergy}
                              variant="secondary"
                              className="bg-red-100 text-red-700"
                            >
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {data.medicalHistory.chronicIllnesses.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">
                          Chronic Conditions:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {data.medicalHistory.chronicIllnesses.map(
                            (condition) => (
                              <Badge
                                key={condition}
                                variant="secondary"
                                className="bg-orange-100 text-orange-700"
                              >
                                {condition}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {data.medicalHistory.currentMedications.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">
                          Current Medications:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {data.medicalHistory.currentMedications.map(
                            (medication) => (
                              <Badge
                                key={medication}
                                variant="secondary"
                                className="bg-blue-100 text-blue-700"
                              >
                                {medication}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {data.medicalHistory.pastSurgeries && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">
                          Past Surgeries:
                        </span>
                        <p className="text-sm text-gray-800">
                          {data.medicalHistory.pastSurgeries}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Risk Survey */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Health Risk Assessment (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Smoking Status</label>
                <Select
                  value={data.consent.healthRiskSurvey.smoking}
                  onValueChange={(value) =>
                    handleHealthRiskChange("smoking", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never smoked</SelectItem>
                    <SelectItem value="former">Former smoker</SelectItem>
                    <SelectItem value="current">Current smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Alcohol Consumption
                </label>
                <Select
                  value={data.consent.healthRiskSurvey.alcohol}
                  onValueChange={(value) =>
                    handleHealthRiskChange("alcohol", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Exercise Frequency
                </label>
                <Select
                  value={data.consent.healthRiskSurvey.exercise}
                  onValueChange={(value) =>
                    handleHealthRiskChange("exercise", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">
                      Light (1-2 times/week)
                    </SelectItem>
                    <SelectItem value="moderate">
                      Moderate (3-4 times/week)
                    </SelectItem>
                    <SelectItem value="active">
                      Very Active (5+ times/week)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Consent */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-healthcare-primary" />
              Terms & Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={data.consent.termsAccepted}
                  onCheckedChange={(checked) =>
                    handleConsentChange("termsAccepted", !!checked)
                  }
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the Terms and Conditions *
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => setShowTerms(!showTerms)}
                      className="p-0 h-auto text-xs text-healthcare-primary"
                    >
                      Read Terms & Conditions{" "}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>

              {showTerms && (
                <div className="ml-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 max-h-40 overflow-y-auto">
                  <h4 className="font-semibold mb-2">Terms and Conditions</h4>
                  <p className="mb-2">By using WellSphere services, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Provide accurate and complete information</li>
                    <li>Use the platform for legitimate healthcare purposes</li>
                    <li>Respect the privacy and confidentiality of others</li>
                    <li>Follow all applicable laws and regulations</li>
                    <li>Pay for services as agreed upon</li>
                  </ul>
                  <p className="mt-2">WellSphere reserves the right to modify these terms at any time.</p>
                </div>
              )}
            </div>

            {/* Privacy Policy */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={data.consent.privacyAccepted}
                  onCheckedChange={(checked) =>
                    handleConsentChange("privacyAccepted", !!checked)
                  }
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the Privacy Policy and Data Processing Agreement *
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => setShowPrivacy(!showPrivacy)}
                      className="p-0 h-auto text-xs text-healthcare-primary"
                    >
                      Read Privacy Policy{" "}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>

              {showPrivacy && (
                <div className="ml-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 max-h-40 overflow-y-auto">
                  <h4 className="font-semibold mb-2">Privacy Policy</h4>
                  <p className="mb-2">
                    We are committed to protecting your privacy:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your medical data is encrypted and stored securely</li>
                    <li>We only share information with your consent</li>
                    <li>You can access, modify, or delete your data anytime</li>
                    <li>
                      We comply with HIPAA and other healthcare privacy laws
                    </li>
                    <li>We use your data only for healthcare purposes</li>
                  </ul>
                  <p className="mt-2">
                    For detailed information, visit our full privacy policy.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validation Summary */}
        {isValid ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Ready to complete registration! Click &ldquo;Complete
              Registration&rdquo; to finish.
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Please accept the Terms & Conditions and Privacy Policy to proceed
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FinalReviewStep;
