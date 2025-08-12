"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Globe,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Info,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";

export default function LoginPageStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [subdomainValidation, setSubdomainValidation] = useState<{
    isChecking: boolean;
    isValid: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isValid: null,
    message: '',
  });

  // Debounced subdomain validation
  useEffect(() => {
    if (!data.loginPage.subdomain || data.loginPage.subdomain.length < 2) {
      setSubdomainValidation({
        isChecking: false,
        isValid: null,
        message: '',
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      checkSubdomainAvailability(data.loginPage.subdomain);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [data.loginPage.subdomain]);

  const sanitizeSubdomain = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const checkSubdomainAvailability = async (subdomain: string) => {
    setSubdomainValidation({
      isChecking: true,
      isValid: null,
      message: 'Checking availability...',
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation logic
      const isAvailable = !['admin', 'api', 'www', 'mail', 'test', 'dev'].includes(subdomain);
      
      setSubdomainValidation({
        isChecking: false,
        isValid: isAvailable,
        message: isAvailable 
          ? `${subdomain}.atharva.com is available!` 
          : `${subdomain}.atharva.com is not available. Try another name.`,
      });
    } catch {
      setSubdomainValidation({
        isChecking: false,
        isValid: false,
        message: 'Error checking availability. Please try again.',
      });
    }
  };

  const handleSubdomainChange = (value: string) => {
    const sanitized = sanitizeSubdomain(value);
    updateData('loginPage', { subdomain: sanitized });
  };

  const handleFieldChange = (field: string, value: string) => {
    updateData('loginPage', { [field]: value });
  };

  const generatePreviewUrl = () => {
    return data.loginPage.subdomain 
      ? `${data.loginPage.subdomain}.atharva.com/login`
      : 'your-hospital.atharva.com/login';
  };

  return (
    <div className="space-y-4">
      {/* Subdomain & URL Setup */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Globe className="h-5 w-5 text-blue-600" />
            Subdomain & URL Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subdomain Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700">
                Preferred Subdomain <span className="text-red-500">*</span>
              </Label>
              <div className="flex">
                <Input
                  id="subdomain"
                  value={data.loginPage.subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  placeholder="sunrise"
                  className={cn(
                    "h-9 rounded-r-none border-r-0",
                    subdomainValidation.isValid === false && "border-red-300 focus:border-red-500",
                    subdomainValidation.isValid === true && "border-green-300 focus:border-green-500"
                  )}
                />
                <div className="px-3 py-2 bg-gray-50 border border-l-0 rounded-r-md text-sm text-gray-600 whitespace-nowrap flex items-center">
                  .atharva.com
                </div>
              </div>
              
              {subdomainValidation.isChecking && (
                <div className="flex items-center gap-1 text-blue-600 text-xs">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>{subdomainValidation.message}</span>
                </div>
              )}
              
              {!subdomainValidation.isChecking && subdomainValidation.isValid === true && (
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  <span>{subdomainValidation.message}</span>
                </div>
              )}
              
              {!subdomainValidation.isChecking && subdomainValidation.isValid === false && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{subdomainValidation.message}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customDomain" className="text-sm font-medium text-gray-700">
                Custom Domain (Optional)
              </Label>
              <Input
                id="customDomain"
                value={data.loginPage.customDomain}
                onChange={(e) => handleFieldChange('customDomain', e.target.value)}
                placeholder="login.yourhospital.com"
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500">
                Use your own domain (future feature)
              </div>
            </div>
          </div>

          {/* Preview URL */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-900">Your Login URL</div>
                <div className="text-sm text-blue-700 font-mono">
                  {generatePreviewUrl()}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-blue-700 border-blue-300 hover:bg-blue-100"
                disabled={!data.loginPage.subdomain}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Page Content */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Info className="h-5 w-5 text-purple-600" />
            Login Page Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Heading and Welcome Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="heading" className="text-sm font-medium text-gray-700">
                Page Heading <span className="text-red-500">*</span>
              </Label>
              <Input
                id="heading"
                value={data.loginPage.heading}
                onChange={(e) => handleFieldChange('heading', e.target.value)}
                placeholder={`Welcome to ${data.hospitalBasics.hospitalName || 'Your Hospital'}`}
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="welcomeText" className="text-sm font-medium text-gray-700">
                Welcome Text (Optional)
              </Label>
              <Textarea
                id="welcomeText"
                value={data.loginPage.welcomeText}
                onChange={(e) => handleFieldChange('welcomeText', e.target.value)}
                placeholder="Book appointments and manage your healthcare"
                className="min-h-[36px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={1}
                maxLength={140}
              />
              <div className="text-xs text-gray-500">
                {data.loginPage.welcomeText.length}/140 characters
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="supportEmail" className="text-sm font-medium text-gray-700">
                Support Email (Optional)
              </Label>
              <Input
                id="supportEmail"
                type="email"
                value={data.loginPage.supportEmail}
                onChange={(e) => handleFieldChange('supportEmail', e.target.value)}
                placeholder="help@yourhospital.com"
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="supportPhone" className="text-sm font-medium text-gray-700">
                Support Phone (Optional)
              </Label>
              <Input
                id="supportPhone"
                value={data.loginPage.supportPhone}
                onChange={(e) => handleFieldChange('supportPhone', e.target.value)}
                placeholder="9876543210"
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Legal Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t">
            <div className="space-y-1.5">
              <Label htmlFor="termsUrl" className="text-sm font-medium text-gray-700">
                Terms of Service URL (Optional)
              </Label>
              <Input
                id="termsUrl"
                type="url"
                value={data.loginPage.termsUrl}
                onChange={(e) => handleFieldChange('termsUrl', e.target.value)}
                placeholder="https://yourhospital.com/terms"
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="privacyUrl" className="text-sm font-medium text-gray-700">
                Privacy Policy URL (Optional)
              </Label>
              <Input
                id="privacyUrl"
                type="url"
                value={data.loginPage.privacyUrl}
                onChange={(e) => handleFieldChange('privacyUrl', e.target.value)}
                placeholder="https://yourhospital.com/privacy"
                className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600" />
              <div className="text-xs text-amber-800">
                <span className="font-medium">Note:</span> If no custom policies are provided, default Atharva policies will be used.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
