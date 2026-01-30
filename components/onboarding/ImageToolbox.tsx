"use client";

/**
 * ImageToolbox - Phase 3: Onboarding UX Redesign
 * 
 * A comprehensive image selection component with multiple sources:
 * - AI Generation (Azure DALL-E integration)
 * - Stock Photos (curated healthcare images)
 * - Upload (direct file upload)
 * - Recent (previously used images)
 * 
 * Features:
 * - Tabbed interface
 * - Image preview
 * - Category filtering
 * - Responsive grid layout
 */

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Image as ImageIcon,
  Upload,
  Clock,
  Search,
  Loader2,
  X,
  Check,
  Wand2,
  Building2,
  Stethoscope,
  Heart,
  Users,
  FlaskConical,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ImageCategory = "logo" | "banner" | "background" | "general";

interface ImageToolboxProps {
  onImageSelect: (url: string, metadata?: ImageMetadata) => void;
  category?: ImageCategory;
  currentImage?: string;
  trigger?: React.ReactNode;
  title?: string;
}

interface ImageMetadata {
  source: "ai" | "stock" | "upload" | "recent";
  prompt?: string;
  originalName?: string;
  category?: string;
}

interface StockImage {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  category: string;
  tags: string[];
}

// Curated healthcare stock images (placeholders - would connect to actual stock service)
const STOCK_IMAGES: StockImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200",
    title: "Modern Hospital Building",
    category: "building",
    tags: ["hospital", "building", "modern", "exterior"],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
    thumbnail: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200",
    title: "Hospital Reception",
    category: "interior",
    tags: ["reception", "lobby", "interior", "waiting"],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800",
    thumbnail: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=200",
    title: "Medical Team",
    category: "team",
    tags: ["doctors", "team", "staff", "healthcare"],
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800",
    thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200",
    title: "Laboratory",
    category: "lab",
    tags: ["lab", "research", "science", "medical"],
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800",
    thumbnail: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=200",
    title: "Stethoscope",
    category: "equipment",
    tags: ["stethoscope", "equipment", "medical", "doctor"],
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
    thumbnail: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=200",
    title: "Pharmacy",
    category: "pharmacy",
    tags: ["pharmacy", "medicine", "pills", "healthcare"],
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800",
    thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200",
    title: "Surgery Room",
    category: "surgery",
    tags: ["surgery", "operation", "medical", "hospital"],
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800",
    thumbnail: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=200",
    title: "Patient Care",
    category: "care",
    tags: ["patient", "care", "nurse", "healthcare"],
  },
];

const STOCK_CATEGORIES = [
  { id: "all", label: "All", icon: ImageIcon },
  { id: "building", label: "Buildings", icon: Building2 },
  { id: "team", label: "Team", icon: Users },
  { id: "equipment", label: "Equipment", icon: Stethoscope },
  { id: "lab", label: "Laboratory", icon: FlaskConical },
  { id: "pharmacy", label: "Pharmacy", icon: Pill },
  { id: "care", label: "Patient Care", icon: Heart },
];

const AI_PROMPT_SUGGESTIONS = [
  "Modern hospital building with glass facade",
  "Friendly medical team in a bright clinic",
  "Clean and welcoming hospital reception",
  "Medical equipment in a modern setting",
  "Peaceful healthcare environment",
  "Professional doctors consultation",
];

export function ImageToolbox({
  onImageSelect,
  category: _category = "general",
  currentImage: _currentImage,
  trigger,
  title = "Select Image",
}: ImageToolboxProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "stock" | "upload" | "recent">("stock");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<ImageMetadata | null>(null);

  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Stock state
  const [stockFilter, setStockFilter] = useState("all");
  const [stockSearch, setStockSearch] = useState("");

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Recent images (from localStorage)
  const [recentImages, setRecentImages] = useState<Array<{ url: string; metadata: ImageMetadata }>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("athaarva-recent-images");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // AI Image Generation
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      // This would call Azure DALL-E API via our backend
      // For now, using placeholder with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Placeholder: In production, this would be the generated image URL
      const mockGeneratedUrl = `https://via.placeholder.com/800x600/007C7C/ffffff?text=${encodeURIComponent(aiPrompt.slice(0, 20))}`;
      setGeneratedImages((prev) => [mockGeneratedUrl, ...prev.slice(0, 5)]);
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // File Upload
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = async () => {
    if (!uploadPreview) return;

    setIsUploading(true);
    try {
      // This would upload to Vercel Blob or similar
      // For now, just using the data URL
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSelectedImage(uploadPreview);
      setSelectedMetadata({
        source: "upload",
        originalName: fileInputRef.current?.files?.[0]?.name,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Select image handler
  const handleSelect = (url: string, metadata: ImageMetadata) => {
    setSelectedImage(url);
    setSelectedMetadata(metadata);
  };

  // Confirm selection
  const handleConfirm = () => {
    if (selectedImage && selectedMetadata) {
      // Save to recent
      const newRecent = [
        { url: selectedImage, metadata: selectedMetadata },
        ...recentImages.filter((r) => r.url !== selectedImage).slice(0, 9),
      ];
      setRecentImages(newRecent);
      if (typeof window !== "undefined") {
        localStorage.setItem("athaarva-recent-images", JSON.stringify(newRecent));
      }

      onImageSelect(selectedImage, selectedMetadata);
      setOpen(false);
      setSelectedImage(null);
      setSelectedMetadata(null);
    }
  };

  // Filter stock images
  const filteredStockImages = STOCK_IMAGES.filter((img) => {
    const matchesCategory = stockFilter === "all" || img.category === stockFilter;
    const matchesSearch =
      !stockSearch ||
      img.title.toLowerCase().includes(stockSearch.toLowerCase()) ||
      img.tags.some((tag) => tag.toLowerCase().includes(stockSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            {title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-healthcare-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Generate</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Stock</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Recent</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Generation Tab */}
          <TabsContent value="ai" className="flex-1 overflow-auto">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the image you want..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateAI()}
                  className="flex-1"
                />
                <Button
                  onClick={handleGenerateAI}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="bg-healthcare-primary hover:bg-healthcare-primary/90"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Prompt suggestions */}
              <div className="flex flex-wrap gap-2">
                {AI_PROMPT_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setAiPrompt(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Generated images */}
              {isGenerating && (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-healthcare-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Generating your image...</p>
                  </div>
                </div>
              )}

              {generatedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {generatedImages.map((url, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleSelect(url, { source: "ai", prompt: aiPrompt })
                      }
                      className={cn(
                        "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                        selectedImage === url
                          ? "border-healthcare-primary ring-2 ring-healthcare-primary/20"
                          : "border-transparent hover:border-gray-200"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === url && (
                        <div className="absolute inset-0 bg-healthcare-primary/10 flex items-center justify-center">
                          <Check className="w-6 h-6 text-healthcare-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!isGenerating && generatedImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Enter a prompt to generate AI images</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Stock Photos Tab */}
          <TabsContent value="stock" className="flex-1 overflow-auto">
            <div className="space-y-4">
              {/* Search and filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search images..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                {STOCK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setStockFilter(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      stockFilter === cat.id
                        ? "bg-healthcare-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Image grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredStockImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() =>
                      handleSelect(img.url, {
                        source: "stock",
                        category: img.category,
                      })
                    }
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border-2 transition-all group",
                      selectedImage === img.url
                        ? "border-healthcare-primary ring-2 ring-healthcare-primary/20"
                        : "border-transparent hover:border-gray-200"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.thumbnail}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">
                          {img.title}
                        </p>
                      </div>
                    </div>
                    {selectedImage === img.url && (
                      <div className="absolute inset-0 bg-healthcare-primary/10 flex items-center justify-center">
                        <Check className="w-6 h-6 text-healthcare-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {filteredStockImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No images match your search</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 overflow-auto">
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!uploadPreview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-healthcare-primary/50 flex flex-col items-center justify-center gap-3 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-healthcare-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-healthcare-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-700">
                      Click to upload image
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadPreview}
                      alt="Upload preview"
                      className="w-full h-full object-contain bg-gray-100"
                    />
                    <button
                      onClick={() => {
                        setUploadPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </Button>
                    <Button
                      className="flex-1 bg-healthcare-primary hover:bg-healthcare-primary/90"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Use This Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="flex-1 overflow-auto">
            {recentImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recentImages.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(item.url, item.metadata)}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === item.url
                        ? "border-healthcare-primary ring-2 ring-healthcare-primary/20"
                        : "border-transparent hover:border-gray-200"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={`Recent ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs">
                      {item.metadata.source}
                    </div>
                    {selectedImage === item.url && (
                      <div className="absolute inset-0 bg-healthcare-primary/10 flex items-center justify-center">
                        <Check className="w-6 h-6 text-healthcare-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No recent images</p>
                <p className="text-sm">Images you use will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer with selection preview and confirm */}
        <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedImage && (
              <>
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Image selected</p>
                  <p className="text-gray-500 capitalize">
                    Source: {selectedMetadata?.source}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedImage}
              className="bg-healthcare-primary hover:bg-healthcare-primary/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Use Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageToolbox;
