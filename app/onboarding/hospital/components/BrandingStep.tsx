"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload,
  Palette,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Globe,
  ExternalLink,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";

const colorPresets = [
  { name: 'Healthcare Teal', primary: '#007C7C', secondary: '#20B2AA' },
  { name: 'Medical Blue', primary: '#0066CC', secondary: '#4A90E2' },
  { name: 'Wellness Green', primary: '#2E8B57', secondary: '#66CDAA' },
  { name: 'Trust Purple', primary: '#6B46C1', secondary: '#9F7AEA' },
  { name: 'Warm Orange', primary: '#EA580C', secondary: '#FB923C' },
  { name: 'Professional Gray', primary: '#374151', secondary: '#6B7280' },
];

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File) => void;
  currentFile: File | null;
  currentUrl: string;
  title: string;
  description: string;
  maxSize: string;
  recommendedSize?: string;
}

function FileUploader({ 
  accept, 
  onFileSelect, 
  currentFile, 
  currentUrl, 
  title, 
  description, 
  maxSize,
  recommendedSize 
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setError('');
    
    // Validate file type
    const validTypes = accept.split(',').map(type => type.trim());
    const isValidType = validTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      return file.type === type;
    });
    
    if (!isValidType) {
      setError('Invalid file type. Please select a valid image file.');
      return;
    }

    // Validate file size (1MB = 1048576 bytes)
    const maxSizeBytes = 1048576;
    if (file.size > maxSizeBytes) {
      setError('File size too large. Please select a file under 1MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{title}</Label>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer",
          dragOver ? "border-healthcare-primary bg-blue-50" : "border-gray-300 hover:border-gray-400",
          error && "border-red-300"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />
        
        {currentFile || currentUrl ? (
          <div className="space-y-1.5">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs font-medium text-green-700">
              {currentFile ? currentFile.name : 'Current file'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                if (fileInputRef.current) fileInputRef.current.click();
              }}
            >
              Replace
            </Button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">
                Drop files or click to upload
              </p>
              <p className="text-xs text-gray-500">{description} (Max: {maxSize})</p>
              {recommendedSize && (
                <p className="text-xs text-gray-500">Recommended: {recommendedSize}</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function ColorPicker({ 
  label, 
  value, 
  onChange, 
  presets 
}: { 
  label: string; 
  value: string; 
  onChange: (color: string) => void;
  presets?: { name: string; primary: string; secondary: string }[];
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      
      {presets && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onChange(preset.primary)}
              className={cn(
                "p-2 rounded-lg border text-xs transition-all hover:shadow-md",
                value === preset.primary 
                  ? "border-healthcare-primary shadow-sm" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex space-x-1 mb-1">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: preset.primary }}
                />
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: preset.secondary }}
                />
              </div>
              <div className="text-gray-600">{preset.name}</div>
            </button>
          ))}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#007C7C"
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

export default function BrandingStep() {
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
    if (!data.loginPage.subdomain || data.loginPage.subdomain.length < 3) {
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

  const subdomainError = !data.loginPage.subdomain
    ? 'Please choose a subdomain to continue.'
    : data.loginPage.subdomain.length < 3
      ? 'Subdomain must be at least 3 characters.'
      : null;

  const generatePreviewUrl = () => {
    return data.loginPage.subdomain 
      ? `${data.loginPage.subdomain}.atharva.com/login`
      : 'your-hospital.atharva.com/login';
  };

  const handleLogoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    updateData('branding', { 
      logoFile: file,
      logoUrl: url
    });
  };

  const handleBackgroundImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    updateData('branding', { 
      backgroundImageFile: file,
      backgroundImageUrl: url
    });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateData('branding', {
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
    });
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
            
            {subdomainError ? (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>{subdomainError}</span>
              </div>
            ) : (
              <>
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
              </>
            )}
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

      {/* Logo & Assets */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            Logo & Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploader
              title="Hospital Logo *"
              description="PNG or SVG format, max 1MB"
              accept="image/png,image/svg+xml,image/jpeg"
              maxSize="1MB"
              recommendedSize="200x200px"
              currentFile={data.branding.logoFile}
              currentUrl={data.branding.logoUrl}
              onFileSelect={handleLogoUpload}
            />

            <FileUploader
              title="Background Image (Optional)"
              description="Background for login page"
              accept="image/png,image/jpeg,image/webp"
              maxSize="1MB"
              recommendedSize="1920x1080px"
              currentFile={data.branding.backgroundImageFile}
              currentUrl={data.branding.backgroundImageUrl}
              onFileSelect={handleBackgroundImageUpload}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <div className="text-xs text-amber-800">
                <span className="font-medium">Tip:</span> Use SVG for crisp scaling or high-res PNG for best results
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme & Style */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Palette className="h-5 w-5 text-purple-600" />
            Colors & Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Color Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Primary Color *"
              value={data.branding.primaryColor}
              onChange={(color) => updateData('branding', { primaryColor: color })}
            />

            <ColorPicker
              label="Secondary Color *"
              value={data.branding.secondaryColor}
              onChange={(color) => updateData('branding', { secondaryColor: color })}
            />
          </div>

          {/* Quick Presets */}
          <div className="pt-3 border-t">
            <Label className="text-sm font-medium mb-2 block">Quick Apply Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {colorPresets.slice(0, 6).map((preset) => (
                <Button
                  key={preset.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyColorPreset(preset)}
                  className="justify-start gap-2 h-8 text-xs"
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span>{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}