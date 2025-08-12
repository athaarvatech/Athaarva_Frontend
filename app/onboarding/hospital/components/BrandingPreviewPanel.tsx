"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X,
  Sun,
  Moon,
  Eye,
  Building2,
  Lock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";

interface BrandingPreviewPanelProps {
  onClose: () => void;
  currentStep: number;
}

function LoginPagePreview({ 
  isDark = false 
}: { 
  isDark?: boolean;
}) {
  const { data } = useHospitalOnboarding();
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPassword, setDemoPassword] = useState('');

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-white';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';

  return (
    <div className={cn("min-h-full p-6 flex items-center justify-center", bgColor)}>
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          {data.branding.logoUrl ? (
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={data.branding.logoUrl} 
                alt="Hospital Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <h1 className={cn("text-2xl font-bold mb-2", textColor)}>
            {data.loginPage.heading || `Welcome to ${data.hospitalBasics.hospitalName || 'Your Hospital'}`}
          </h1>
          
          {data.loginPage.welcomeText && (
            <p className={cn("text-sm", mutedColor)}>
              {data.loginPage.welcomeText}
            </p>
          )}
        </div>

        {/* Login Form */}
        <Card className={cn("shadow-lg", cardBg)}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="demo-email" className={cn("text-sm font-medium", textColor)}>
                  Email
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={cn("mt-1", inputBg)}
                />
              </div>

              <div>
                <Label htmlFor="demo-password" className={cn("text-sm font-medium", textColor)}>
                  Password
                </Label>
                <Input
                  id="demo-password"
                  type="password"
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={cn("mt-1", inputBg)}
                />
              </div>

              <Button
                className={cn(
                  "w-full",
                  data.branding.buttonStyle === 'filled' 
                    ? `bg-[${data.branding.primaryColor}] hover:bg-[${data.branding.primaryColor}]/90 text-white`
                    : `border-[${data.branding.primaryColor}] text-[${data.branding.primaryColor}] hover:bg-[${data.branding.primaryColor}] hover:text-white`
                )}
                style={{
                  backgroundColor: data.branding.buttonStyle === 'filled' ? data.branding.primaryColor : 'transparent',
                  borderColor: data.branding.primaryColor,
                  color: data.branding.buttonStyle === 'filled' ? 'white' : data.branding.primaryColor,
                }}
                disabled
              >
                <Lock className="h-4 w-4 mr-2" />
                Sign In
              </Button>

              <div className="text-center space-y-2">
                <button 
                  className={cn("text-sm hover:underline", mutedColor)}
                  style={{ color: data.branding.secondaryColor }}
                >
                  Forgot your password?
                </button>
                <div className={cn("text-xs", mutedColor)}>
                  Don&apos;t have an account?{' '}
                  <button 
                    className="hover:underline"
                    style={{ color: data.branding.primaryColor }}
                  >
                    Create one
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          {(data.loginPage.supportEmail || data.loginPage.supportPhone) && (
            <div className={cn("text-xs", mutedColor)}>
              Need help?{' '}
              {data.loginPage.supportEmail && (
                <a href={`mailto:${data.loginPage.supportEmail}`} className="hover:underline">
                  Email Support
                </a>
              )}
              {data.loginPage.supportEmail && data.loginPage.supportPhone && ' • '}
              {data.loginPage.supportPhone && (
                <a href={`tel:${data.loginPage.supportPhone}`} className="hover:underline">
                  Call Support
                </a>
              )}
            </div>
          )}
          
          <div className={cn("text-xs", mutedColor)}>
            {data.loginPage.termsUrl && (
              <a href={data.loginPage.termsUrl} className="hover:underline mr-4">
                Terms of Service
              </a>
            )}
            {data.loginPage.privacyUrl && (
              <a href={data.loginPage.privacyUrl} className="hover:underline">
                Privacy Policy
              </a>
            )}
            {!data.loginPage.termsUrl && !data.loginPage.privacyUrl && (
              <span>Powered by Atharva</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandingPreview() {
  const { data } = useHospitalOnboarding();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Brand Elements</h3>
        <p className="text-sm text-gray-600">
          Preview of your hospital&apos;s visual identity
        </p>
      </div>

      {/* Logo Preview */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Logo</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border rounded-lg p-4 text-center">
            {data.branding.logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={data.branding.logoUrl} 
                  alt="Logo on light" 
                  className="w-12 h-12 mx-auto object-contain"
                />
              </>
            ) : (
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">Light Background</div>
          </div>
          <div className="bg-gray-800 border rounded-lg p-4 text-center">
            {data.branding.logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={data.branding.logoUrl} 
                  alt="Logo on dark" 
                  className="w-12 h-12 mx-auto object-contain"
                />
              </>
            ) : (
              <div className="w-12 h-12 mx-auto bg-gray-700 rounded flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">Dark Background</div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Color Palette</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto rounded-lg border shadow-sm"
              style={{ backgroundColor: data.branding.primaryColor }}
            />
            <div className="text-xs font-medium mt-2">Primary</div>
            <div className="text-xs text-gray-500 font-mono">{data.branding.primaryColor}</div>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto rounded-lg border shadow-sm"
              style={{ backgroundColor: data.branding.secondaryColor }}
            />
            <div className="text-xs font-medium mt-2">Secondary</div>
            <div className="text-xs text-gray-500 font-mono">{data.branding.secondaryColor}</div>
          </div>
        </div>
      </div>

      {/* Button Styles */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Button Styles</h4>
        <div className="space-y-2">
          <Button
            size="sm"
            className={cn(
              "w-full",
              data.branding.buttonStyle === 'filled' 
                ? 'text-white'
                : 'bg-transparent'
            )}
            style={{
              backgroundColor: data.branding.buttonStyle === 'filled' ? data.branding.primaryColor : 'transparent',
              borderColor: data.branding.primaryColor,
              color: data.branding.buttonStyle === 'filled' ? 'white' : data.branding.primaryColor,
            }}
            disabled
          >
            Primary Button
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            style={{
              borderColor: data.branding.secondaryColor,
              color: data.branding.secondaryColor,
            }}
            disabled
          >
            Secondary Button
          </Button>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Typography</h4>
        <div className="space-y-2">
          <div 
            className="text-lg font-semibold"
            style={{ fontFamily: data.branding.typography }}
          >
            {data.hospitalBasics.hospitalName || 'Hospital Name'}
          </div>
          <div 
            className="text-sm text-gray-600"
            style={{ fontFamily: data.branding.typography }}
          >
            Sample body text in {data.branding.typography} font
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrandingPreviewPanel({ onClose, currentStep }: BrandingPreviewPanelProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data } = useHospitalOnboarding();

  const showLoginPreview = currentStep === 3;

  return (
    <div className="h-full bg-white border-l border-gray-200 shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-healthcare-primary" />
          <h3 className="font-semibold text-gray-900">
            Live Preview
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {showLoginPreview && (
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={!isDarkMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsDarkMode(false)}
                className="h-6 px-2"
              >
                <Sun className="h-3 w-3" />
              </Button>
              <Button
                variant={isDarkMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsDarkMode(true)}
                className="h-6 px-2"
              >
                <Moon className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {showLoginPreview ? (
          <Tabs value={isDarkMode ? "dark" : "light"} className="h-full">
            <TabsList className="hidden">
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
            </TabsList>
            
            <TabsContent value="light" className="h-full m-0">
              <div className="bg-gray-50 h-full">
                <LoginPagePreview isDark={false} />
              </div>
            </TabsContent>
            
            <TabsContent value="dark" className="h-full m-0">
              <div className="bg-gray-900 h-full">
                <LoginPagePreview isDark={true} />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <BrandingPreview />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">
            {showLoginPreview ? 'Login Page Preview' : 'Brand Identity Preview'}
          </div>
          {showLoginPreview && data.loginPage.subdomain && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              disabled
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit {data.loginPage.subdomain}.atharva.com
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
