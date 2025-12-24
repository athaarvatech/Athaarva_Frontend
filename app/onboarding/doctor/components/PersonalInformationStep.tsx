"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Stethoscope,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  FileText,
  Building2,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "../page";

interface PersonalInformationStepProps {
  data: OnboardingData;
  updateData: <T extends keyof OnboardingData>(
    section: T,
    data: Partial<OnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const specializations = [
  "General Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Psychiatry",
  "Obstetrics & Gynecology",
  "Surgery",
  "Anesthesiology",
  "Radiology",
  "Pathology",
  "Emergency Medicine",
  "Family Medicine",
  "Endocrinology",
  "Gastroenterology",
  "Nephrology",
  "Pulmonology",
  "Rheumatology",
  "Oncology",
  "Ophthalmology",
  "ENT (Otolaryngology)",
  "Urology",
  "Plastic Surgery",
];

const PersonalInformationStep: React.FC<PersonalInformationStepProps> = ({
  data,
  updateData,
  onStepComplete,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >(data.personalInfo.specialization || []);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const { personalInfo, credentials } = data;

    if (!personalInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!personalInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!personalInfo.registrationNumber.trim()) {
      newErrors.registrationNumber = "Medical registration number is required";
    } else if (personalInfo.registrationNumber.length < 8) {
      newErrors.registrationNumber =
        "Registration number must be at least 8 characters";
    }

    if (selectedSpecializations.length === 0) {
      newErrors.specialization = "At least one specialization is required";
    }

    if (!personalInfo.yearsOfExperience || personalInfo.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = "Years of experience must be 0 or greater";
    }

    if (!personalInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(personalInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!personalInfo.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Medical credentials validation
    if (!credentials.medicalLicense.trim()) {
      newErrors.medicalLicense = "Medical license number is required";
    }

    if (!credentials.licenseState.trim()) {
      newErrors.licenseState = "License issuing state is required";
    }

    if (credentials.degrees.length === 0) {
      newErrors.degrees = "At least one degree certificate is required";
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);

    return valid;
  }, [data, selectedSpecializations]);

  // Auto-validate on data change and trigger completion
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const isValid = validateForm();
      if (isValid) {
        onStepComplete();
      }
    }, 100); // Debounce validation

    return () => clearTimeout(timeoutId);
  }, [
    data.personalInfo,
    data.credentials,
    selectedSpecializations,
    validateForm,
    onStepComplete,
  ]);

  // Update specialization in parent data when selectedSpecializations changes
  useEffect(() => {
    updateData("personalInfo", { specialization: selectedSpecializations });
  }, [selectedSpecializations, updateData]);

  const handleInputChange = (
    field: keyof typeof data.personalInfo,
    value: string | number
  ) => {
    updateData("personalInfo", { [field]: value });
  };

  const handleSpecializationToggle = (specialization: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specialization)
        ? prev.filter((s) => s !== specialization)
        : [...prev, specialization]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Image size must be less than 5MB",
        }));
        return;
      }

      updateData("personalInfo", { profileImage: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profileImage;
        return newErrors;
      });
    }
  };

  const removeProfileImage = () => {
    updateData("personalInfo", { profileImage: null });
    setProfileImagePreview(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Profile Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-healthcare-primary" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {profileImagePreview ||
                  (data.personalInfo.profileImage && profileImagePreview) ? (
                    <Image
                      src={
                        profileImagePreview ||
                        (data.personalInfo.profileImage
                          ? URL.createObjectURL(data.personalInfo.profileImage)
                          : "")
                      }
                      alt="Profile preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {(profileImagePreview || data.personalInfo.profileImage) && (
                  <button
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="profile-image"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-teal transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG up to 5MB (Optional)
                </p>
                {errors.profileImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profileImage}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-healthcare-primary" />
              Basic Information
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
                  value={data.personalInfo.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className={cn(errors.firstName && "border-red-500")}
                  suppressHydrationWarning
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
                  value={data.personalInfo.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className={cn(errors.lastName && "border-red-500")}
                  suppressHydrationWarning
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="registrationNumber"
                className="text-sm font-medium"
              >
                Medical Registration Number *
              </Label>
              <Input
                id="registrationNumber"
                value={data.personalInfo.registrationNumber}
                onChange={(e) =>
                  handleInputChange(
                    "registrationNumber",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="e.g., MH12345678"
                className={cn(errors.registrationNumber && "border-red-500")}
                suppressHydrationWarning
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">
                  {errors.registrationNumber}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Enter your medical council registration number
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="yearsOfExperience"
                className="text-sm font-medium"
              >
                Years of Experience *
              </Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={data.personalInfo.yearsOfExperience || ""}
                onChange={(e) =>
                  handleInputChange(
                    "yearsOfExperience",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="0"
                className={cn(errors.yearsOfExperience && "border-red-500")}
                suppressHydrationWarning
              />
              {errors.yearsOfExperience && (
                <p className="text-red-500 text-sm">
                  {errors.yearsOfExperience}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Specialization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-healthcare-primary" />
              Medical Specializations *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Select all specializations that apply to your practice
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {specializations.map((specialization) => (
                  <label
                    key={specialization}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpecializations.includes(specialization)}
                      onChange={() =>
                        handleSpecializationToggle(specialization)
                      }
                      className="w-4 h-4 text-healthcare-primary border-gray-300 rounded focus:ring-healthcare-primary"
                      suppressHydrationWarning
                    />
                    <span className="text-sm text-gray-700">
                      {specialization}
                    </span>
                  </label>
                ))}
              </div>

              {errors.specialization && (
                <p className="text-red-500 text-sm">{errors.specialization}</p>
              )}

              {/* Selected specializations display */}
              {selectedSpecializations.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Specializations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecializations.map((specialization) => (
                      <Badge
                        key={specialization}
                        variant="secondary"
                        className="bg-healthcare-primary/10 text-healthcare-primary hover:bg-healthcare-primary/20"
                      >
                        {specialization}
                        <button
                          onClick={() =>
                            handleSpecializationToggle(specialization)
                          }
                          className="ml-2 text-healthcare-primary hover:text-healthcare-teal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-healthcare-primary" />
              Medical Degrees & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="registration-number"
                className="text-sm font-medium"
              >
                Medical Registration Number *
              </Label>
              <Input
                id="registration-number"
                value={data.personalInfo.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                placeholder="Enter your medical registration number"
                className={cn(errors.registrationNumber && "border-red-500")}
                suppressHydrationWarning
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">
                  {errors.registrationNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-license" className="text-sm font-medium">
                Medical License Number *
              </Label>
              <Input
                id="medical-license"
                value={data.credentials.medicalLicense}
                onChange={(e) =>
                  updateData("credentials", { medicalLicense: e.target.value })
                }
                placeholder="Enter your medical license number"
                className={cn(errors.medicalLicense && "border-red-500")}
                suppressHydrationWarning
              />
              {errors.medicalLicense && (
                <p className="text-red-500 text-sm">{errors.medicalLicense}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="license-state" className="text-sm font-medium">
                License Issuing State *
              </Label>
              <Select
                value={data.credentials.licenseState}
                onValueChange={(value) =>
                  updateData("credentials", { licenseState: value })
                }
              >
                <SelectTrigger
                  className={cn(errors.licenseState && "border-red-500")}
                >
                  <SelectValue placeholder="Select your license state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="arunachal-pradesh">
                    Arunachal Pradesh
                  </SelectItem>
                  <SelectItem value="assam">Assam</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                  <SelectItem value="goa">Goa</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="himachal-pradesh">
                    Himachal Pradesh
                  </SelectItem>
                  <SelectItem value="jharkhand">Jharkhand</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="manipur">Manipur</SelectItem>
                  <SelectItem value="meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="mizoram">Mizoram</SelectItem>
                  <SelectItem value="nagaland">Nagaland</SelectItem>
                  <SelectItem value="odisha">Odisha</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="sikkim">Sikkim</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="tripura">Tripura</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                </SelectContent>
              </Select>
              {errors.licenseState && (
                <p className="text-red-500 text-sm">{errors.licenseState}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree-upload" className="text-sm font-medium">
                Upload Medical Degree(s) *
              </Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center hover:border-healthcare-primary transition-colors",
                  errors.degrees
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                )}
              >
                <input
                  id="degree-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      updateData("credentials", {
                        degrees: [...data.credentials.degrees, ...files],
                      });
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="degree-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload degree certificates
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </label>
              </div>
              {errors.degrees && (
                <p className="text-red-500 text-sm">{errors.degrees}</p>
              )}

              {data.credentials.degrees.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Files:</Label>
                  <div className="space-y-2">
                    {data.credentials.degrees.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-healthcare-primary" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newFiles = [...data.credentials.degrees];
                            newFiles.splice(index, 1);
                            updateData("credentials", { degrees: newFiles });
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Hospital Privileges (Optional)
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="Enter hospital name where you have privileges"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        updateData("credentials", {
                          hospitalPrivileges: [
                            ...data.credentials.hospitalPrivileges,
                            input.value.trim(),
                          ],
                        });
                        input.value = "";
                      }
                    }
                  }}
                />
                {data.credentials.hospitalPrivileges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.credentials.hospitalPrivileges.map(
                      (hospital, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Building2 className="w-3 h-3 mr-1" />
                          {hospital}
                          <button
                            onClick={() => {
                              const newHospitals = [
                                ...data.credentials.hospitalPrivileges,
                              ];
                              newHospitals.splice(index, 1);
                              updateData("credentials", {
                                hospitalPrivileges: newHospitals,
                              });
                            }}
                            className="ml-2 text-healthcare-primary hover:text-healthcare-teal"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )
                    )}
                  </div>
                )}
              </div>
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
              <Input
                id="phone"
                type="tel"
                value={data.personalInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 12345 67890"
                className={cn(errors.phone && "border-red-500")}
                suppressHydrationWarning
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="doctor@example.com"
                className={cn(errors.email && "border-red-500")}
                suppressHydrationWarning
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validation Summary */}
        {isValid ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Personal information completed successfully!
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

export default PersonalInformationStep;
