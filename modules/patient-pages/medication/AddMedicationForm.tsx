"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pill,
  Camera,
  Search,
  Clock,
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  Plus,
  Mic,
} from "lucide-react";

const AddMedicationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timeSlots: [],
    condition: "",
    doctorName: "",
    startDate: "",
    endDate: "",
    instructions: "",
    pillColor: "",
    pillShape: "",
    withFood: false,
    reminderEnabled: true,
  });

  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);

  const frequencyOptions = [
    "Once daily (Morning)",
    "Once daily (Evening)",
    "Twice daily (Morning & Evening)",
    "Three times daily",
    "Four times daily",
    "As needed",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
  ];

  const pillShapes = ["Round", "Oval", "Square", "Capsule", "Diamond"];
  const pillColors = [
    "White",
    "Blue",
    "Red",
    "Yellow",
    "Green",
    "Pink",
    "Orange",
    "Purple",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Here you would typically save to backend
    console.log("Medication data:", formData);
    router.push("/patient/medications");
  };

  const startPillScan = () => {
    setIsScanning(true);
    // Mock scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setFormData((prev) => ({
        ...prev,
        name: "Metformin",
        dosage: "500mg",
        pillColor: "White",
        pillShape: "Round",
      }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#007C7C]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#007C7C] to-[#20B2AA] flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#007C7C]">
              Add New Medicine
            </h1>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-2 ${
                  step >= 1 ? "text-[#007C7C]" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-[#007C7C] text-white" : "bg-gray-200"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Medicine Info</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  step >= 2 ? "text-[#007C7C]" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-[#007C7C] text-white" : "bg-gray-200"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Schedule</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  step >= 3 ? "text-[#007C7C]" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-[#007C7C] text-white" : "bg-gray-200"
                  }`}
                >
                  3
                </div>
                <span className="text-sm font-medium">Confirm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pill Scanner Option */}
        <Card className="border-2 border-dashed border-[#007C7C]">
          <CardContent className="p-6 text-center">
            <Camera className="h-12 w-12 text-[#007C7C] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#007C7C] mb-2">
              📱 Scan Your Pill
            </h3>
            <p className="text-gray-600 mb-4">
              Take a photo and we'll help identify your medication
            </p>
            <Button
              onClick={startPillScan}
              disabled={isScanning}
              className="bg-[#007C7C] hover:bg-[#006666]"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Step 1: Medicine Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-[#007C7C]" />
                Medicine Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="e.g., Metformin, Lisinopril..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-lg border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg, 10mg..."
                    value={formData.dosage}
                    onChange={(e) =>
                      handleInputChange("dosage", e.target.value)
                    }
                    className="border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">For Condition</Label>
                  <Input
                    id="condition"
                    placeholder="e.g., Diabetes, Blood Pressure..."
                    value={formData.condition}
                    onChange={(e) =>
                      handleInputChange("condition", e.target.value)
                    }
                    className="border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Prescribed by Doctor</Label>
                <Input
                  id="doctor"
                  placeholder="Dr. Smith, Dr. Patel..."
                  value={formData.doctorName}
                  onChange={(e) =>
                    handleInputChange("doctorName", e.target.value)
                  }
                  className="border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pill-shape">Pill Shape</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("pillShape", value)
                    }
                  >
                    <SelectTrigger className="border-2 border-[#E8F3F4] focus:border-[#007C7C]">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      {pillShapes.map((shape) => (
                        <SelectItem key={shape} value={shape}>
                          {shape}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pill-color">Pill Color</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("pillColor", value)
                    }
                  >
                    <SelectTrigger className="border-2 border-[#E8F3F4] focus:border-[#007C7C]">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {pillColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="e.g., Take with food, avoid alcohol..."
                  value={formData.instructions}
                  onChange={(e) =>
                    handleInputChange("instructions", e.target.value)
                  }
                  className="border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                  rows={3}
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-[#007C7C] hover:bg-[#006666]"
                disabled={!formData.name || !formData.dosage}
              >
                Next: Set Schedule
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#007C7C]" />
                Medicine Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">How often? *</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("frequency", value)
                  }
                >
                  <SelectTrigger className="border-2 border-[#E8F3F4] focus:border-[#007C7C]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className="border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date (Optional)</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    className="border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                  />
                </div>
              </div>

              <div className="bg-[#F0F9FA] p-4 rounded-lg">
                <h4 className="font-semibold text-[#007C7C] mb-3">
                  Reminder Settings
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Enable reminders</span>
                    <input
                      type="checkbox"
                      checked={formData.reminderEnabled}
                      onChange={(e) =>
                        handleInputChange("reminderEnabled", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Take with food</span>
                    <input
                      type="checkbox"
                      checked={formData.withFood}
                      onChange={(e) =>
                        handleInputChange("withFood", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#007C7C] hover:bg-[#006666]"
                  disabled={!formData.frequency || !formData.startDate}
                >
                  Review & Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#007C7C]" />
                Confirm Medicine Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#F0F9FA] p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Medicine:</span>
                  <span>
                    {formData.name} {formData.dosage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">For:</span>
                  <span>{formData.condition || "General health"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Frequency:</span>
                  <span>{formData.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Start Date:</span>
                  <span>
                    {new Date(formData.startDate).toLocaleDateString()}
                  </span>
                </div>
                {formData.endDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">End Date:</span>
                    <span>
                      {new Date(formData.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Reminders:</span>
                  <span>
                    {formData.reminderEnabled ? "✅ Enabled" : "❌ Disabled"}
                  </span>
                </div>
                {formData.withFood && (
                  <div className="flex justify-between">
                    <span className="font-medium">Special Note:</span>
                    <span>🍽️ Take with food</span>
                  </div>
                )}
              </div>

              {formData.instructions && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    Special Instructions:
                  </h4>
                  <p className="text-sm text-purple-700">
                    {formData.instructions}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#007C7C] hover:bg-[#006666]"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Add Medicine
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddMedicationForm;
