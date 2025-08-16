"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  Save,
  RotateCcw,
  Palette,
  ImageIcon,
  Eye,
  Monitor,
  Smartphone,
  Download,
  Settings,
  AlertCircle,
  Trash2,
} from "lucide-react";

interface BrandingData {
  hospitalName: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  backgroundImageUrl: string;
  website: string;
  address: string;
  phone: string;
  email: string;
}

const HospitalBrandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [formData, setFormData] = useState<BrandingData>({
    hospitalName: "Atharva Healthcare",
    tagline: "Your Health, Our Priority",
    description: "Leading healthcare provider committed to excellence in patient care, innovation, and community health.",
    primaryColor: "#007C7C",
    secondaryColor: "#20B2AA",
    accentColor: "#50C878",
    logoUrl: "",
    backgroundImageUrl: "",
    website: "https://atharvahealthcare.com",
    address: "123 Healthcare Avenue, Medical District, City 12345",
    phone: "(555) 123-CARE",
    email: "info@atharvahealthcare.com",
  });

  const predefinedColors = [
    { name: "Teal", primary: "#007C7C", secondary: "#20B2AA", accent: "#50C878" },
    { name: "Blue Medical", primary: "#0056B3", secondary: "#4A90E2", accent: "#7CB9E8" },
    { name: "Green Health", primary: "#2E8B57", secondary: "#3CB371", accent: "#90EE90" },
    { name: "Purple Care", primary: "#6A5ACD", secondary: "#9370DB", accent: "#DDA0DD" },
    { name: "Orange Vitality", primary: "#FF6B35", secondary: "#FF8C69", accent: "#FFA07A" },
  ];

  const handleInputChange = (field: keyof BrandingData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorSchemeSelect = (colorScheme: typeof predefinedColors[0]) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: colorScheme.primary,
      secondaryColor: colorScheme.secondary,
      accentColor: colorScheme.accent,
    }));
    toast.success(`${colorScheme.name} color scheme applied`);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Logo file size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          logoUrl: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
      toast.success("Logo uploaded successfully");
    }
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Background image file size must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          backgroundImageUrl: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
      toast.success("Background image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Hospital branding updated successfully!");
    } catch {
      toast.error("Failed to update branding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hospitalName: "Atharva Healthcare",
      tagline: "Your Health, Our Priority",
      description: "Leading healthcare provider committed to excellence in patient care, innovation, and community health.",
      primaryColor: "#007C7C",
      secondaryColor: "#20B2AA",
      accentColor: "#50C878",
      logoUrl: "",
      backgroundImageUrl: "",
      website: "https://atharvahealthcare.com",
      address: "123 Healthcare Avenue, Medical District, City 12345",
      phone: "(555) 123-CARE",
      email: "info@atharvahealthcare.com",
    });
  };

  const exportBrandingGuide = () => {
    const data = {
      ...formData,
      exportDate: new Date().toISOString(),
      colors: {
        primary: formData.primaryColor,
        secondary: formData.secondaryColor,
        accent: formData.accentColor,
      },
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hospital-branding-guide.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Branding guide exported successfully");
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#50C878] text-white">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight">Hospital Branding</h1>
            <p className="text-[#6B7280] text-lg">Customize your hospital&apos;s visual identity and brand assets</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportBrandingGuide}>
            <Download className="mr-2 h-4 w-4" />
            Export Guide
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(previewMode === "desktop" ? "mobile" : "desktop")}
          >
            {previewMode === "desktop" ? <Smartphone className="mr-2 h-4 w-4" /> : <Monitor className="mr-2 h-4 w-4" />}
            {previewMode === "desktop" ? "Mobile" : "Desktop"} Preview
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Configuration */}
          <div className="space-y-8">
            {/* Hospital Information */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-[#007C7C]/10 rounded-lg">
                    <Settings className="h-5 w-5 text-[#007C7C]" />
                  </div>
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="hospitalName" className="text-sm font-medium text-slate-700">Hospital Name *</Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                    placeholder="Enter hospital name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-sm font-medium text-slate-700">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    placeholder="Enter hospital tagline"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of your hospital"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="website" className="text-sm font-medium text-slate-700">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@hospital.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-slate-700">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Hospital address"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo & Images */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-[#20B2AA]/10 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-[#20B2AA]" />
                  </div>
                  Logo & Images
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Hospital Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {formData.logoUrl ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={formData.logoUrl}
                          alt="Hospital Logo"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-contain border rounded-lg p-2"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, logoUrl: "" }));
                          }}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB. Recommended: 200x200px</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Login Background Image (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {formData.backgroundImageUrl ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={formData.backgroundImageUrl}
                          alt="Background"
                          width={64}
                          height={40}
                          className="w-16 h-10 object-cover border rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, backgroundImageUrl: "" }));
                          }}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-10 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        className="hidden"
                        id="background-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("background-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Background
                      </Button>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB. Recommended: 1920x1080px</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-[#50C878]/10 rounded-lg">
                    <Palette className="h-5 w-5 text-[#50C878]" />
                  </div>
                  Color Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-3 block">Predefined Themes</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {predefinedColors.map((scheme) => (
                      <Button
                        key={scheme.name}
                        type="button"
                        variant="outline"
                        className="h-auto p-3 justify-start"
                        onClick={() => handleColorSchemeSelect(scheme)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: scheme.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: scheme.secondary }}
                            />
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: scheme.accent }}
                            />
                          </div>
                          <span className="text-sm font-medium">{scheme.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="primaryColor" className="text-sm font-medium text-slate-700">Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        id="primaryColor"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        className="w-12 h-9 p-1 border rounded"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        placeholder="#007C7C"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondaryColor" className="text-sm font-medium text-slate-700">Secondary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        id="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        className="w-12 h-9 p-1 border rounded"
                      />
                      <Input
                        value={formData.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        placeholder="#20B2AA"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accentColor" className="text-sm font-medium text-slate-700">Accent Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        id="accentColor"
                        value={formData.accentColor}
                        onChange={(e) => handleInputChange("accentColor", e.target.value)}
                        className="w-12 h-9 p-1 border rounded"
                      />
                      <Input
                        value={formData.accentColor}
                        onChange={(e) => handleInputChange("accentColor", e.target.value)}
                        placeholder="#50C878"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-8">
            <Card className="shadow-lg border-0 bg-white sticky top-4">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  Live Preview
                  <Badge variant="outline" className="ml-auto">
                    {previewMode === "desktop" ? "Desktop" : "Mobile"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className={`mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-lg ${
                    previewMode === "desktop" ? "w-full max-w-md" : "w-48"
                  }`}
                  style={{
                    background: formData.backgroundImageUrl 
                      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${formData.backgroundImageUrl})`
                      : `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})`
                  }}
                >
                  <div className="p-8 text-center text-white">
                    {formData.logoUrl && (
                      <div className="mb-4 flex justify-center">
                        <Image
                          src={formData.logoUrl}
                          alt="Hospital Logo"
                          width={previewMode === "desktop" ? 64 : 48}
                          height={previewMode === "desktop" ? 64 : 48}
                          className={`object-contain ${previewMode === "desktop" ? "h-16" : "h-12"}`}
                        />
                      </div>
                    )}
                    
                    <h1 className={`font-bold mb-2 ${previewMode === "desktop" ? "text-2xl" : "text-lg"}`}>
                      {formData.hospitalName}
                    </h1>
                    
                    {formData.tagline && (
                      <p className={`mb-4 opacity-90 ${previewMode === "desktop" ? "text-sm" : "text-xs"}`}>
                        {formData.tagline}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div 
                        className={`bg-white/20 backdrop-blur-sm rounded-lg p-3 ${
                          previewMode === "desktop" ? "text-sm" : "text-xs"
                        }`}
                      >
                        <p>Login Form Preview</p>
                      </div>
                      
                      <button 
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          previewMode === "desktop" ? "text-sm" : "text-xs"
                        }`}
                        style={{ 
                          backgroundColor: formData.accentColor,
                          color: "white"
                        }}
                      >
                        Sign In
                      </button>
                    </div>

                    <div className={`mt-6 space-y-1 text-white/80 ${previewMode === "desktop" ? "text-xs" : "text-[10px]"}`}>
                      <p>{formData.phone}</p>
                      <p>{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-slate-700">Color Palette</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div 
                        className="w-full h-10 rounded-lg border shadow-sm"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <p className="text-xs text-slate-600 mt-1">Primary</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full h-10 rounded-lg border shadow-sm"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <p className="text-xs text-slate-600 mt-1">Secondary</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full h-10 rounded-lg border shadow-sm"
                        style={{ backgroundColor: formData.accentColor }}
                      />
                      <p className="text-xs text-slate-600 mt-1">Accent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <AlertCircle className="h-4 w-4" />
                <span>Changes will be applied to all user interfaces</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#007C7C] to-[#20B2AA] hover:from-[#006666] hover:to-[#1a9999] text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save & Apply Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default HospitalBrandingPage;
