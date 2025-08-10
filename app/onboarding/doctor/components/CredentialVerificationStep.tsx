"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Shield,
  Video,
  Building2,
  Award,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "../page";

interface CredentialVerificationStepProps {
  data: OnboardingData;
  updateData: <T extends keyof OnboardingData>(
    section: T,
    data: Partial<OnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

// const degreeTypes = [
//   "MBBS",
//   "MD - General Medicine",
//   "MD - Pediatrics",
//   "MD - Dermatology",
//   "MD - Psychiatry",
//   "MS - General Surgery",
//   "MS - Orthopedics",
//   "MS - ENT",
//   "DM - Cardiology",
//   "DM - Neurology",
//   "DM - Gastroenterology",
//   "MCh - Cardiac Surgery",
//   "MCh - Neurosurgery",
//   "Fellowship - Critical Care",
//   "Fellowship - Emergency Medicine",
//   "Diploma in Child Health",
//   "Diploma in Orthopedics",
//   "Other"
// ];

const hospitalDepartments = [
  "General Medicine",
  "Surgery",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Psychiatry",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Anesthesiology",
  "Emergency Medicine",
  "Radiology",
  "Pathology",
  "ICU/Critical Care",
  "Oncology"
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Puducherry", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu",
  "Lakshadweep", "Ladakh", "Jammu and Kashmir"
];

interface License {
  id: string;
  number: string;
  state: string;
  verified: boolean;
  verificationStatus: "pending" | "verified" | "failed";
}

function CredentialVerificationStep({ data, updateData, onStepComplete }: CredentialVerificationStepProps) {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [newLicense, setNewLicense] = useState({ number: "", state: "" });
  const [isVerifyingKYC, setIsVerifyingKYC] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const credentials = data.credentials;

  // Initialize licenses from data
  useEffect(() => {
    if (credentials?.licenses && Array.isArray(credentials.licenses) && credentials.licenses.length > 0) {
      setLicenses(credentials.licenses.map((license, index) => ({
        ...license,
        id: `license-${index}`,
        verificationStatus: license.verified ? "verified" : "pending"
      })));
    }
  }, [credentials?.licenses]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    updateData("credentials", { 
      degrees: [...(credentials?.degrees || []), ...validFiles] 
    });
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    updateData("credentials", { degrees: newFiles });
  };

  // Add license with immediate auto-verification
  const addLicense = () => {
    if (newLicense.number && newLicense.state) {
      const cleanNumber = newLicense.number.toUpperCase().trim();
      const isValid = validateMedicalLicense(cleanNumber, newLicense.state);
      
      const license: License = {
        id: `license-${Date.now()}`,
        number: cleanNumber,
        state: newLicense.state,
        verified: isValid,
        verificationStatus: isValid ? "verified" : "pending"
      };

      const updatedLicenses = [...licenses, license];
      setLicenses(updatedLicenses);
      
      // Update data
      updateData("credentials", {
        licenses: updatedLicenses.map(l => ({
          number: l.number,
          state: l.state,
          verified: l.verified
        }))
      });

      setNewLicense({ number: "", state: "" });

      // If not initially valid, try verification after a short delay
      if (!isValid) {
        setTimeout(() => {
          verifyLicense(license.id);
        }, 1000);
      }
    }
  };

  // Enhanced license validation patterns for Indian medical councils
  const validateMedicalLicense = (licenseNumber: string, state: string): boolean => {
    if (!licenseNumber || !state) return false;

    const cleanNumber = licenseNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Common patterns for Indian medical registration numbers
    const patterns = {
      // Medical Council of India (MCI) pattern
      MCI: /^MCI[A-Z0-9]{4,8}$/,
      // State Medical Council patterns
      MUMBAI: /^(MMC|MAHARASHTRA)[0-9]{4,8}$/,
      DELHI: /^(DMC|DELHI)[0-9]{4,8}$/,
      KARNATAKA: /^(KMC|KARNATAKA)[0-9]{4,8}$/,
      TAMIL_NADU: /^(TNMC|TN)[0-9]{4,8}$/,
      UTTAR_PRADESH: /^(UPMC|UP)[0-9]{4,8}$/,
      WEST_BENGAL: /^(WBMC|WB)[0-9]{4,8}$/,
      GUJARAT: /^(GMC|GUJARAT)[0-9]{4,8}$/,
      RAJASTHAN: /^(RMC|RAJASTHAN)[0-9]{4,8}$/,
      PUNJAB: /^(PMC|PUNJAB)[0-9]{4,8}$/,
      HARYANA: /^(HMC|HARYANA)[0-9]{4,8}$/,
      BIHAR: /^(BMC|BIHAR)[0-9]{4,8}$/,
      ODISHA: /^(OMC|ODISHA)[0-9]{4,8}$/,
      ANDHRA_PRADESH: /^(APMC|AP)[0-9]{4,8}$/,
      TELANGANA: /^(TMC|TELANGANA)[0-9]{4,8}$/,
      KERALA: /^(KMC|KERALA)[0-9]{4,8}$/,
      MADHYA_PRADESH: /^(MPMC|MP)[0-9]{4,8}$/,
      ASSAM: /^(AMC|ASSAM)[0-9]{4,8}$/,
      JHARKHAND: /^(JMC|JHARKHAND)[0-9]{4,8}$/,
      CHHATTISGARH: /^(CMC|CG)[0-9]{4,8}$/,
      HIMACHAL_PRADESH: /^(HPMC|HP)[0-9]{4,8}$/,
      UTTARAKHAND: /^(UMC|UK)[0-9]{4,8}$/,
      GOA: /^(GMC|GOA)[0-9]{4,8}$/,
      MANIPUR: /^(MMC|MANIPUR)[0-9]{4,8}$/,
      MEGHALAYA: /^(MMC|MEGHALAYA)[0-9]{4,8}$/,
      MIZORAM: /^(MMC|MIZORAM)[0-9]{4,8}$/,
      NAGALAND: /^(NMC|NAGALAND)[0-9]{4,8}$/,
      SIKKIM: /^(SMC|SIKKIM)[0-9]{4,8}$/,
      TRIPURA: /^(TMC|TRIPURA)[0-9]{4,8}$/,
      ARUNACHAL_PRADESH: /^(APMC|ARUNACHAL)[0-9]{4,8}$/,
      // Generic patterns for numeric-only registrations (common format)
      NUMERIC_LONG: /^[0-9]{8,12}$/,
      NUMERIC_SHORT: /^[0-9]{4,7}$/,
      // AIIMS pattern
      AIIMS: /^AIIMS[0-9]{4,8}$/,
      // PGI pattern  
      PGI: /^PGI[0-9]{4,8}$/,
      // JIPMER pattern
      JIPMER: /^JIPMER[0-9]{4,8}$/,
    };

    // Check MCI pattern first (national registration)
    if (patterns.MCI.test(cleanNumber)) return true;

    // Check AIIMS, PGI, JIPMER patterns
    if (patterns.AIIMS.test(cleanNumber) || patterns.PGI.test(cleanNumber) || patterns.JIPMER.test(cleanNumber)) return true;

    // State-specific pattern matching
    const stateKey = state.toUpperCase().replace(/\s+/g, '_');
    if (patterns[stateKey as keyof typeof patterns]?.test(cleanNumber)) return true;

    // Check generic numeric patterns
    if (patterns.NUMERIC_LONG.test(cleanNumber) || patterns.NUMERIC_SHORT.test(cleanNumber)) return true;

    // Additional validation: minimum length check for any format
    return cleanNumber.length >= 4 && cleanNumber.length <= 15;
  };

  // Verify license with enhanced validation
  const verifyLicense = (licenseId: string) => {
    setLicenses(prev => prev.map(license => {
      if (license.id === licenseId) {
        const isValid = validateMedicalLicense(license.number, license.state);
        return {
          ...license,
          verified: isValid,
          verificationStatus: isValid ? "verified" : "failed"
        };
      }
      return license;
    }));

    // Update main data
    setTimeout(() => {
      const updatedLicenses = licenses.map(license => {
        if (license.id === licenseId) {
          const isValid = validateMedicalLicense(license.number, license.state);
          return { ...license, verified: isValid };
        }
        return license;
      });

      updateData("credentials", {
        licenses: updatedLicenses.map(l => ({
          number: l.number,
          state: l.state,
          verified: l.verified
        }))
      });
    }, 100);
  };

  // Remove license
  const removeLicense = (licenseId: string) => {
    const updatedLicenses = licenses.filter(l => l.id !== licenseId);
    setLicenses(updatedLicenses);
    
    updateData("credentials", {
      licenses: updatedLicenses.map(l => ({
        number: l.number,
        state: l.state,
        verified: l.verified
      }))
    });
  };

  // Handle KYC verification
  const handleKYCVerification = async () => {
    setIsVerifyingKYC(true);
    
    // Simulate KYC process
    setTimeout(() => {
      updateData("credentials", { kycStatus: "verified" });
      setIsVerifyingKYC(false);
    }, 3000);
  };

  // Handle department selection
  const toggleDepartment = (department: string) => {
    let updatedDepartments;
    if (selectedDepartments.includes(department)) {
      updatedDepartments = selectedDepartments.filter(d => d !== department);
    } else {
      updatedDepartments = [...selectedDepartments, department];
    }
    
    setSelectedDepartments(updatedDepartments);
    updateData("credentials", { hospitalPrivileges: updatedDepartments });
  };

  // Check step completion
  const isStepComplete = useCallback(() => {
    return (
      Array.isArray(uploadedFiles) && uploadedFiles.length > 0 &&
      Array.isArray(licenses) && licenses.length > 0 &&
      licenses.every(license => license.verified) &&
      credentials?.kycStatus === "verified" &&
      Array.isArray(selectedDepartments) && selectedDepartments.length > 0
    );
  }, [uploadedFiles, licenses, credentials?.kycStatus, selectedDepartments]);

  // Auto-complete step when all requirements are met
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete();
    }
  }, [isStepComplete, onStepComplete]);

  return (
    <div className="space-y-8">
      {/* Degree Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-healthcare-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Medical Degrees & Certifications</h3>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-healthcare-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="degree-upload"
              />
              <label
                htmlFor="degree-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <div className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-healthcare-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Upload Your Medical Degrees
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Drag and drop or click to browse (PDF, JPG, PNG up to 5MB each)
                  </p>
                </div>
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Uploaded Documents ({uploadedFiles.length})
                </Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-healthcare-primary" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* License Verification Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-healthcare-emerald/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-healthcare-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">License Verification</h3>
            </div>

            {/* Add License */}
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  placeholder="MCI123456789"
                  value={newLicense.number}
                  onChange={(e) => setNewLicense(prev => ({ ...prev, number: e.target.value.toUpperCase() }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  State/Council
                </Label>
                <Select 
                  value={newLicense.state} 
                  onValueChange={(value) => setNewLicense(prev => ({ ...prev, state: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={addLicense}
                disabled={!newLicense.number || !newLicense.state}
                className="bg-healthcare-primary hover:bg-healthcare-teal"
              >
                Add License
              </Button>
            </div>

            {/* License List */}
            {licenses.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Your Licenses ({licenses.length})
                </Label>
                <div className="space-y-2">
                  {licenses.map((license) => (
                    <div
                      key={license.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-colors",
                        license.verificationStatus === "verified"
                          ? "bg-green-50 border-green-200"
                          : license.verificationStatus === "failed"
                          ? "bg-red-50 border-red-200"
                          : "bg-yellow-50 border-yellow-200"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          license.verificationStatus === "verified"
                            ? "bg-green-100"
                            : license.verificationStatus === "failed"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                        )}>
                          {license.verificationStatus === "pending" ? (
                            <div className="w-4 h-4 border-2 border-yellow-600/30 border-t-yellow-600 rounded-full animate-spin" />
                          ) : license.verificationStatus === "verified" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{license.number}</p>
                          <p className="text-sm text-gray-600">{license.state}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            license.verificationStatus === "verified"
                              ? "default"
                              : license.verificationStatus === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                          className={cn(
                            license.verificationStatus === "verified" && "bg-green-100 text-green-800",
                            license.verificationStatus === "pending" && "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {license.verificationStatus === "verified"
                            ? "Verified"
                            : license.verificationStatus === "failed"
                            ? "Failed"
                            : "Verifying..."
                          }
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLicense(license.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Video KYC Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-healthcare-teal/10 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-healthcare-teal" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Video KYC Verification</h3>
            </div>

            <div className="text-center space-y-4">
              {credentials.kycStatus === "pending" ? (
                <>
                  <div className="w-32 h-24 bg-gray-100 rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Complete Video KYC
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete a quick video verification to validate your identity
                    </p>
                    <Button
                      onClick={handleKYCVerification}
                      disabled={isVerifyingKYC}
                      className="bg-healthcare-teal hover:bg-healthcare-primary"
                    >
                      {isVerifyingKYC ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Start Video KYC
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Video KYC completed successfully!
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hospital Privileges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-healthcare-indigo/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-healthcare-indigo" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hospital Privileges</h3>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Select departments where you have hospital privileges:
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hospitalDepartments.map((department) => (
                  <label
                    key={department}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedDepartments.includes(department)
                        ? "border-healthcare-primary bg-healthcare-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={selectedDepartments.includes(department)}
                      onCheckedChange={() => toggleDepartment(department)}
                    />
                    <span className="text-sm">{department}</span>
                  </label>
                ))}
              </div>
              {selectedDepartments.length > 0 && (
                <p className="text-sm text-healthcare-primary">
                  Selected {selectedDepartments.length} department(s)
                </p>
              )}
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
              Credential verification completed successfully!
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Please complete all verification requirements to proceed
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default CredentialVerificationStep;
