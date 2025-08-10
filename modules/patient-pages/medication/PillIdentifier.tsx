"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  Upload,
  Search,
  Zap,
  CheckCircle,
  AlertTriangle,
  Eye,
  Pill,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";

const mockPillResults = [
  {
    id: 1,
    name: "Metformin",
    strength: "500mg",
    manufacturer: "Sun Pharma",
    shape: "Round",
    color: "White",
    imprint: "M 500",
    confidence: 95,
    uses: "Type 2 Diabetes",
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset"],
    warnings: ["Take with food", "Monitor kidney function"],
  },
  {
    id: 2,
    name: "Lisinopril",
    strength: "10mg",
    manufacturer: "Lupin",
    shape: "Round",
    color: "Pink",
    imprint: "L 10",
    confidence: 88,
    uses: "High Blood Pressure",
    sideEffects: ["Dry cough", "Dizziness", "Headache"],
    warnings: ["Avoid potassium supplements", "Monitor blood pressure"],
  },
];

const PillIdentifier = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [manualSearch, setManualSearch] = useState({
    shape: "",
    color: "",
    imprint: "",
    size: "",
  });

  const shapes = ["Round", "Oval", "Square", "Diamond", "Capsule", "Triangle"];
  const colors = [
    "White",
    "Blue",
    "Red",
    "Yellow",
    "Green",
    "Pink",
    "Orange",
    "Purple",
    "Brown",
    "Gray",
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        startIdentification();
      };
      reader.readAsDataURL(file);
    }
  };

  const startCameraCapture = () => {
    // In a real app, this would access the camera
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setUploadedImage("/mock-pill-image.jpg");
      startIdentification();
    }, 2000);
  };

  const startIdentification = () => {
    setIsScanning(true);
    // Mock AI identification process
    setTimeout(() => {
      setScanResult(mockPillResults[0]);
      setIsScanning(false);
    }, 3000);
  };

  const performManualSearch = () => {
    if (manualSearch.shape || manualSearch.color || manualSearch.imprint) {
      setIsScanning(true);
      setTimeout(() => {
        setScanResult(mockPillResults[1]);
        setIsScanning(false);
      }, 1500);
    }
  };

  const addToMyMedications = () => {
    // Here you would save to the user's medication list
    router.push("/patient/medications/add");
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
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#007C7C]">
              Identify Your Pill
            </h1>
          </div>
        </div>

        {/* AI-Powered Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                🤖 AI-Powered Identification
              </h3>
            </div>
            <p className="text-blue-700 mb-4">
              Our advanced AI can identify pills from photos with 95%+ accuracy
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-blue-600">
              <span>✅ Safe & Secure</span>
              <span>✅ Instant Results</span>
              <span>✅ Detailed Information</span>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload Options */}
        {!uploadedImage && !scanResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-dashed border-[#007C7C] hover:bg-[#F0F9FA] transition-colors cursor-pointer">
              <CardContent
                className="p-6 text-center"
                onClick={startCameraCapture}
              >
                <Camera className="h-12 w-12 text-[#007C7C] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#007C7C] mb-2">
                  📷 Take Photo
                </h3>
                <p className="text-gray-600">
                  Use your camera to capture the pill
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-[#007C7C] hover:bg-[#F0F9FA] transition-colors cursor-pointer">
              <CardContent
                className="p-6 text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-[#007C7C] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#007C7C] mb-2">
                  📁 Upload Photo
                </h3>
                <p className="text-gray-600">Choose from your gallery</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#007C7C] border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-[#007C7C] mb-2">
                🔍 Analyzing Your Pill...
              </h3>
              <p className="text-gray-600">
                Our AI is identifying your medication
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p>✓ Processing image...</p>
                <p>✓ Matching against database...</p>
                <p>⏳ Verifying results...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploaded Image Preview */}
        {uploadedImage && !isScanning && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#007C7C] mb-4">
                📸 Uploaded Image
              </h3>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Pill className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Image uploaded successfully
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Identification Results */}
        {scanResult && !isScanning && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Identification Results
                <Badge className="bg-green-100 text-green-800 ml-2">
                  {scanResult.confidence}% Match
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#F0F9FA] p-4 rounded-lg">
                <h4 className="text-xl font-bold text-[#007C7C] mb-2">
                  {scanResult.name}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Strength:</span>
                    <span className="ml-2">{scanResult.strength}</span>
                  </div>
                  <div>
                    <span className="font-medium">Manufacturer:</span>
                    <span className="ml-2">{scanResult.manufacturer}</span>
                  </div>
                  <div>
                    <span className="font-medium">Shape:</span>
                    <span className="ml-2">{scanResult.shape}</span>
                  </div>
                  <div>
                    <span className="font-medium">Color:</span>
                    <span className="ml-2">{scanResult.color}</span>
                  </div>
                  <div>
                    <span className="font-medium">Imprint:</span>
                    <span className="ml-2">{scanResult.imprint}</span>
                  </div>
                  <div>
                    <span className="font-medium">Used for:</span>
                    <span className="ml-2">{scanResult.uses}</span>
                  </div>
                </div>
              </div>

              {/* Side Effects */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Common Side Effects
                </h5>
                <div className="flex flex-wrap gap-2">
                  {scanResult.sideEffects.map((effect: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Important Warnings
                </h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {scanResult.warnings.map((warning: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={addToMyMedications}
                  className="flex-1 bg-[#007C7C] hover:bg-[#006666]"
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Add to My Medicines
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setScanResult(null);
                    setUploadedImage(null);
                  }}
                  className="flex-1"
                >
                  Scan Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Search Option */}
        {!uploadedImage && !scanResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-[#007C7C]" />
                Manual Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Can't take a photo? Describe your pill manually
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shape</label>
                  <select
                    value={manualSearch.shape}
                    onChange={(e) =>
                      setManualSearch((prev) => ({
                        ...prev,
                        shape: e.target.value,
                      }))
                    }
                    className="w-full p-2 border-2 border-[#E8F3F4] rounded-md focus:border-[#007C7C]"
                  >
                    <option value="">Select shape</option>
                    {shapes.map((shape) => (
                      <option key={shape} value={shape}>
                        {shape}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <select
                    value={manualSearch.color}
                    onChange={(e) =>
                      setManualSearch((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-full p-2 border-2 border-[#E8F3F4] rounded-md focus:border-[#007C7C]"
                  >
                    <option value="">Select color</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Imprint/Text on Pill
                </label>
                <input
                  type="text"
                  placeholder="e.g., M 500, L 10..."
                  value={manualSearch.imprint}
                  onChange={(e) =>
                    setManualSearch((prev) => ({
                      ...prev,
                      imprint: e.target.value,
                    }))
                  }
                  className="w-full p-2 border-2 border-[#E8F3F4] rounded-md focus:border-[#007C7C]"
                />
              </div>

              <Button
                onClick={performManualSearch}
                disabled={
                  !manualSearch.shape &&
                  !manualSearch.color &&
                  !manualSearch.imprint
                }
                className="w-full bg-[#007C7C] hover:bg-[#006666]"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Database
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Safety Disclaimer */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">
                  ⚠️ Important Safety Notice
                </h4>
                <p className="text-sm text-amber-700">
                  This tool is for identification purposes only. Always consult
                  your doctor or pharmacist before taking any medication. Never
                  take unidentified pills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PillIdentifier;
