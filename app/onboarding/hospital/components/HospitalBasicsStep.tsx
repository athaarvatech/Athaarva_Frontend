"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  MapPin,
  User,
  AlertCircle,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function HospitalBasicsStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [validationState, setValidationState] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateLicenseNumber = (license: string): boolean => {
    // Basic validation for license number (adjust regex as per Indian medical license format)
    const licenseRegex = /^[A-Z0-9]{6,20}$/;
    return licenseRegex.test(license.replace(/\s/g, ''));
  };

  const handleInputChange = (field: string, value: string | number) => {
    updateData('hospitalBasics', { [field]: value });

    // Real-time validation
    if (field === 'hospitalName') {
      setValidationState(prev => ({
        ...prev,
        hospitalName: typeof value === 'string' && value.trim().length >= 2
      }));
    } else if (field === 'licenseNumber') {
      setValidationState(prev => ({
        ...prev,
        licenseNumber: typeof value === 'string' && validateLicenseNumber(value)
      }));
    } else if (field === 'officialEmail') {
      setValidationState(prev => ({
        ...prev,
        officialEmail: typeof value === 'string' && validateEmail(value)
      }));
    } else if (field === 'phone') {
      setValidationState(prev => ({
        ...prev,
        phone: typeof value === 'string' && validatePhone(value)
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Hospital Identity Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Building2 className="h-5 w-5 text-blue-600" />
            Hospital Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* First Row - Hospital Name & License Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hospitalName" className="text-sm font-medium text-gray-700">
                Hospital/Clinic Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hospitalName"
                placeholder="Enter your hospital/clinic name"
                value={data.hospitalBasics.hospitalName || ''}
                onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                className={cn(
                  "h-9",
                  validationState.hospitalName === false 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                )}
              />
              {validationState.hospitalName === false && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Hospital name must be at least 2 characters
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">
                Medical License Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="licenseNumber"
                placeholder="Enter medical license number"
                value={data.hospitalBasics.licenseNumber || ''}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className={cn(
                  "h-9",
                  validationState.licenseNumber === false 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                )}
              />
              {validationState.licenseNumber === false && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid license number
                </p>
              )}
              <div className="text-xs text-gray-500">
                As per medical council registration
              </div>
            </div>
          </div>

          {/* Second Row - Primary Contact & Bed Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="primaryContact" className="text-sm font-medium text-gray-700">
                Primary Contact Person <span className="text-red-500">*</span>
              </Label>
              <Input
                id="primaryContact"
                placeholder="Dr. John Doe, Chief Medical Officer"
                value={data.hospitalBasics.primaryContact || ''}
                onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bedCapacity" className="text-sm font-medium text-gray-700">
                Bed Capacity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bedCapacity"
                type="number"
                placeholder="50"
                value={data.hospitalBasics.bedCapacity || ''}
                onChange={(e) => handleInputChange('bedCapacity', parseInt(e.target.value) || 0)}
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <User className="h-5 w-5 text-green-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Second Row - Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="officialEmail" className="text-sm font-medium text-gray-700">
                Official Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="officialEmail"
                type="email"
                placeholder="admin@hospital.com"
                value={data.hospitalBasics.officialEmail || ''}
                onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                className={cn(
                  "h-9",
                  validationState.officialEmail === false 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                )}
              />
              {validationState.officialEmail === false && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="10-digit phone number"
                value={data.hospitalBasics.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn(
                  "h-9",
                  validationState.phone === false 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                )}
              />
              {validationState.phone === false && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid 10-digit phone number
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MapPin className="h-5 w-5 text-purple-600" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address Line */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Complete Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              placeholder="Enter complete address including building number, street, area"
              value={data.hospitalBasics.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="min-h-[60px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* City, State, PIN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="City name"
                value={data.hospitalBasics.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.hospitalBasics.state || ''}
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '_')}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                PIN Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pincode"
                placeholder="6-digit PIN"
                value={data.hospitalBasics.pincode || ''}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                maxLength={6}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
