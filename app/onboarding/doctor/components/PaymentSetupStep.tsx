"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Smartphone,
  Wallet,
  Building,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "../page";

interface PaymentSetupStepProps {
  data: OnboardingData;
  updateData: <T extends keyof OnboardingData>(
    section: T,
    data: Partial<OnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const paymentMethodOptions = [
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: Building,
    description: "Direct bank account transfer",
    popular: true,
  },
  {
    id: "upi",
    name: "UPI",
    icon: Smartphone,
    description: "Unified Payments Interface",
    popular: true,
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: Wallet,
    description: "PayTM, PhonePe, Google Pay",
    popular: false,
  },
];

const specializationFees = {
  "General Medicine": { min: 300, max: 800, suggested: 500 },
  Cardiology: { min: 800, max: 2000, suggested: 1200 },
  Dermatology: { min: 500, max: 1200, suggested: 800 },
  Neurology: { min: 1000, max: 2500, suggested: 1500 },
  Oncology: { min: 1200, max: 3000, suggested: 1800 },
  Pediatrics: { min: 400, max: 1000, suggested: 600 },
  Psychiatry: { min: 600, max: 1500, suggested: 900 },
  "Surgery - General": { min: 1000, max: 2500, suggested: 1500 },
  "Surgery - Cardiac": { min: 2000, max: 5000, suggested: 3000 },
  Orthopedics: { min: 800, max: 2000, suggested: 1200 },
};

function PaymentSetupStep({
  data,
  updateData,
  onStepComplete,
}: PaymentSetupStepProps) {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    string[]
  >([]);
  const [bankDetailsValid, setBankDetailsValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const payment = data.payment;
  const personalInfo = data.personalInfo;

  // Initialize payment methods from data
  useEffect(() => {
    if (payment.paymentMethods.length > 0) {
      setSelectedPaymentMethods(payment.paymentMethods);
    }
  }, [payment.paymentMethods]);

  // Get suggested fees based on specialization
  const getSuggestedFees = useCallback(() => {
    if (personalInfo.specializations.length > 0) {
      const primarySpecialization = personalInfo.specializations[0];
      return (
        specializationFees[
          primarySpecialization as keyof typeof specializationFees
        ] || {
          min: 300,
          max: 1000,
          suggested: 500,
        }
      );
    }
    return { min: 300, max: 1000, suggested: 500 };
  }, [personalInfo.specializations]);

  // Validation functions
  const validateConsultationFee = (fee: number) => {
    if (fee < 100) {
      setErrors((prev) => ({
        ...prev,
        consultationFee: "Minimum fee should be ₹100",
      }));
      return false;
    }
    if (fee > 10000) {
      setErrors((prev) => ({
        ...prev,
        consultationFee: "Maximum fee should be ₹10,000",
      }));
      return false;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.consultationFee;
      return newErrors;
    });
    return true;
  };

  const validateBankDetails = useCallback(() => {
    const { accountHolder, accountNumber, ifscCode, bankName } =
      payment.bankDetails;
    const newErrors: Record<string, string> = {};

    if (!accountHolder.trim()) {
      newErrors.accountHolder = "Account holder name is required";
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (accountNumber.length < 9 || accountNumber.length > 18) {
      newErrors.accountNumber = "Account number should be 9-18 digits";
    }

    if (!ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
      newErrors.ifscCode = "Invalid IFSC code format";
    }

    if (!bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
      // Clear previous bank-related errors
      accountHolder: newErrors.accountHolder,
      accountNumber: newErrors.accountNumber,
      ifscCode: newErrors.ifscCode,
      bankName: newErrors.bankName,
    }));

    const isValid = Object.keys(newErrors).length === 0;
    setBankDetailsValid(isValid);
    return isValid;
  }, [payment.bankDetails]);

  // Handle input changes
  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    if (field === "consultationFee" || field === "telehealthFee") {
      const numValue =
        typeof value === "string"
          ? parseInt(value) || 0
          : typeof value === "number"
          ? value
          : 0;
      updateData("payment", { [field]: numValue });

      if (field === "consultationFee") {
        validateConsultationFee(numValue);
        // Auto-set telehealth fee to 80% of consultation fee
        updateData("payment", { telehealthFee: Math.round(numValue * 0.8) });
      }
    } else if (field.startsWith("bankDetails.")) {
      const bankField = field.split(".")[1];
      const currentBankDetails = { ...payment.bankDetails };
      currentBankDetails[bankField as keyof typeof currentBankDetails] =
        String(value);
      updateData("payment", { bankDetails: currentBankDetails });
    } else {
      updateData("payment", { [field]: value });
    }
  };

  // Handle payment method toggle
  const togglePaymentMethod = (methodId: string) => {
    let updatedMethods;
    if (selectedPaymentMethods.includes(methodId)) {
      updatedMethods = selectedPaymentMethods.filter((id) => id !== methodId);
    } else {
      updatedMethods = [...selectedPaymentMethods, methodId];
    }

    setSelectedPaymentMethods(updatedMethods);
    updateData("payment", { paymentMethods: updatedMethods });
  };

  // Apply suggested fee
  const applySuggestedFee = () => {
    const suggestedFees = getSuggestedFees();
    handleInputChange("consultationFee", suggestedFees.suggested);
  };

  // Check step completion
  const isStepComplete = useCallback(() => {
    return (
      payment.consultationFee > 0 &&
      payment.telehealthFee > 0 &&
      selectedPaymentMethods.length > 0 &&
      (selectedPaymentMethods.includes("bank_transfer")
        ? bankDetailsValid
        : true) &&
      Object.keys(errors).length === 0
    );
  }, [
    payment.consultationFee,
    payment.telehealthFee,
    selectedPaymentMethods,
    bankDetailsValid,
    errors,
  ]);

  // Auto-complete step when all requirements are met
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete();
    }
  }, [isStepComplete, onStepComplete]);

  // Validate bank details when they change
  useEffect(() => {
    if (selectedPaymentMethods.includes("bank_transfer")) {
      validateBankDetails();
    }
  }, [selectedPaymentMethods, validateBankDetails]);

  const suggestedFees = getSuggestedFees();

  return (
    <div className="space-y-8">
      {/* Consultation Fees Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-healthcare-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Consultation Fees
              </h3>
            </div>

            {/* Fee Suggestions */}
            {personalInfo.specializations.length > 0 && (
              <div className="bg-healthcare-cool-white p-4 rounded-lg border border-healthcare-primary/10">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-healthcare-primary mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Suggested fees for {personalInfo.specializations[0]}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Min: ₹{suggestedFees.min}</span>
                      <span>•</span>
                      <span>Max: ₹{suggestedFees.max}</span>
                      <span>•</span>
                      <span className="font-medium text-healthcare-primary">
                        Suggested: ₹{suggestedFees.suggested}
                      </span>
                    </div>
                    <Button
                      onClick={applySuggestedFee}
                      size="sm"
                      variant="outline"
                      className="text-healthcare-primary border-healthcare-primary hover:bg-healthcare-primary/10"
                    >
                      Use Suggested Fee
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* In-Person Consultation Fee */}
              <div className="space-y-2">
                <Label
                  htmlFor="consultationFee"
                  className="text-sm font-medium text-gray-700"
                >
                  In-Person Consultation Fee *
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="consultationFee"
                    type="number"
                    placeholder="500"
                    value={payment.consultationFee || ""}
                    onChange={(e) =>
                      handleInputChange("consultationFee", e.target.value)
                    }
                    className={cn(
                      "pl-10 transition-colors",
                      errors.consultationFee
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    )}
                    min="100"
                    max="10000"
                  />
                </div>
                {errors.consultationFee && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.consultationFee}
                  </p>
                )}
              </div>

              {/* Telehealth Consultation Fee */}
              <div className="space-y-2">
                <Label
                  htmlFor="telehealthFee"
                  className="text-sm font-medium text-gray-700"
                >
                  Telehealth Consultation Fee *
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="telehealthFee"
                    type="number"
                    placeholder="400"
                    value={payment.telehealthFee || ""}
                    onChange={(e) =>
                      handleInputChange("telehealthFee", e.target.value)
                    }
                    className="pl-10"
                    min="100"
                    max="10000"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Typically 20% less than in-person consultation
                </p>
              </div>
            </div>

            {/* Fee Comparison */}
            {payment.consultationFee > 0 && payment.telehealthFee > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Fee Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">In-Person:</span>
                    <span className="ml-2 font-medium">
                      ₹{payment.consultationFee}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Telehealth:</span>
                    <span className="ml-2 font-medium">
                      ₹{payment.telehealthFee}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Methods Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-healthcare-emerald/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-healthcare-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Methods
              </h3>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Select your preferred payment methods:
              </Label>

              <div className="grid gap-4">
                {paymentMethodOptions.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                      selectedPaymentMethods.includes(method.id)
                        ? "border-healthcare-emerald bg-healthcare-emerald/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={selectedPaymentMethods.includes(method.id)}
                      onCheckedChange={() => togglePaymentMethod(method.id)}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          selectedPaymentMethods.includes(method.id)
                            ? "bg-healthcare-emerald/10"
                            : "bg-gray-100"
                        )}
                      >
                        <method.icon
                          className={cn(
                            "w-5 h-5",
                            selectedPaymentMethods.includes(method.id)
                              ? "text-healthcare-emerald"
                              : "text-gray-400"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {method.name}
                          </span>
                          {method.popular && (
                            <Badge
                              variant="secondary"
                              className="bg-healthcare-primary/10 text-healthcare-primary"
                            >
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bank Details Section */}
      {selectedPaymentMethods.includes("bank_transfer") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border border-gray-100">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-healthcare-teal/10 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-healthcare-teal" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Bank Account Details
                </h3>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Secure Information</p>
                    <p>
                      Your bank details are encrypted and stored securely. We
                      use industry-standard security measures to protect your
                      financial information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Account Holder Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="accountHolder"
                    className="text-sm font-medium text-gray-700"
                  >
                    Account Holder Name *
                  </Label>
                  <Input
                    id="accountHolder"
                    placeholder="As per bank records"
                    value={payment.bankDetails.accountHolder}
                    onChange={(e) =>
                      handleInputChange(
                        "bankDetails.accountHolder",
                        e.target.value
                      )
                    }
                    className={cn(
                      "transition-colors",
                      errors.accountHolder
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    )}
                  />
                  {errors.accountHolder && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.accountHolder}
                    </p>
                  )}
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="accountNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Account Number *
                  </Label>
                  <div className="relative">
                    <Input
                      id="accountNumber"
                      type={showAccountNumber ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={payment.bankDetails.accountNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "bankDetails.accountNumber",
                          e.target.value
                        )
                      }
                      className={cn(
                        "pr-10 transition-colors",
                        errors.accountNumber
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showAccountNumber ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.accountNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                {/* IFSC Code */}
                <div className="space-y-2">
                  <Label
                    htmlFor="ifscCode"
                    className="text-sm font-medium text-gray-700"
                  >
                    IFSC Code *
                  </Label>
                  <Input
                    id="ifscCode"
                    placeholder="SBIN0000123"
                    value={payment.bankDetails.ifscCode}
                    onChange={(e) =>
                      handleInputChange(
                        "bankDetails.ifscCode",
                        e.target.value.toUpperCase()
                      )
                    }
                    className={cn(
                      "transition-colors uppercase",
                      errors.ifscCode
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    )}
                  />
                  {errors.ifscCode && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.ifscCode}
                    </p>
                  )}
                </div>

                {/* Bank Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="bankName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Bank Name *
                  </Label>
                  <Input
                    id="bankName"
                    placeholder="State Bank of India"
                    value={payment.bankDetails.bankName}
                    onChange={(e) =>
                      handleInputChange("bankDetails.bankName", e.target.value)
                    }
                    className={cn(
                      "transition-colors",
                      errors.bankName
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    )}
                  />
                  {errors.bankName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.bankName}
                    </p>
                  )}
                </div>
              </div>

              {/* Bank Details Validation Status */}
              {selectedPaymentMethods.includes("bank_transfer") && (
                <div
                  className={cn(
                    "flex items-center justify-center p-3 rounded-lg border",
                    bankDetailsValid
                      ? "border-green-200 bg-green-50"
                      : "border-yellow-200 bg-yellow-50"
                  )}
                >
                  {bankDetailsValid ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">
                        Bank details are valid
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800">
                        Please complete all bank details
                      </span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border border-gray-100 bg-gradient-to-br from-healthcare-cool-white to-white">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Payment Setup Summary
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">
                  Consultation Fees
                </p>
                <p className="text-gray-600">
                  In-Person: ₹{payment.consultationFee || 0}
                  <br />
                  Telehealth: ₹{payment.telehealthFee || 0}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">
                  Payment Methods
                </p>
                <p className="text-gray-600">
                  {selectedPaymentMethods.length} method(s) selected
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Bank Account</p>
                <p className="text-gray-600">
                  {selectedPaymentMethods.includes("bank_transfer")
                    ? bankDetailsValid
                      ? "Configured"
                      : "Pending"
                    : "Not required"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {isStepComplete() ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Payment setup completed successfully!
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Please complete all payment configuration to proceed
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default PaymentSetupStep;
