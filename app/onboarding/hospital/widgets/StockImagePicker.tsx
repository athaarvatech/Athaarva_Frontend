"use client";

/**
 * =============================================================================
 * STOCK IMAGE PICKER
 * =============================================================================
 * 
 * A beautiful image picker that provides instant access to high-quality
 * healthcare stock photos. Users can quickly populate their templates
 * without needing their own professional photography.
 * 
 * Features:
 * - Categorized healthcare images
 * - Search by category (doctors, facilities, equipment)
 * - Upload tab for custom images
 * - Smooth hover previews
 * 
 * NOTE: Uses Unsplash source URLs. For production, integrate with
 * Unsplash/Pexels API for more variety and proper attribution.
 * 
 * =============================================================================
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Check,
  X,
  Loader2,
  Stethoscope,
  Building2,
  Users,
  HeartPulse,
  Microscope,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ============================================================================
// TYPES
// ============================================================================

export type ImageCategory = 
  | "doctors" 
  | "hospital" 
  | "medical" 
  | "patients" 
  | "equipment" 
  | "wellness";

export interface StockImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  category: ImageCategory;
  photographer?: string;
}

export interface StockImagePickerProps {
  onSelect: (image: StockImage) => void;
  onUpload?: (file: File) => void;
  currentImage?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
  className?: string;
  triggerClassName?: string;
  /** Trigger variant: 'button' (default), 'icon', or 'link' */
  triggerVariant?: "button" | "icon" | "link";
  children?: React.ReactNode;
}

// ============================================================================
// STOCK IMAGES DATA (Mocked with Unsplash)
// ============================================================================

const STOCK_IMAGES: StockImage[] = [
  // Doctors
  {
    id: "doc-1",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    alt: "Female doctor with stethoscope smiling",
    category: "doctors",
    photographer: "Online Marketing",
  },
  {
    id: "doc-2",
    url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    alt: "Male doctor in white coat",
    category: "doctors",
    photographer: "Usman Yousaf",
  },
  {
    id: "doc-3",
    url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
    alt: "Medical team in discussion",
    category: "doctors",
    photographer: "National Cancer Institute",
  },
  // Hospital
  {
    id: "hosp-1",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    alt: "Modern hospital building exterior",
    category: "hospital",
    photographer: "Hush Naidoo",
  },
  {
    id: "hosp-2",
    url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
    alt: "Hospital corridor with natural light",
    category: "hospital",
    photographer: "Adhy Savala",
  },
  {
    id: "hosp-3",
    url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80",
    alt: "Hospital reception area",
    category: "hospital",
    photographer: "Martha Dominguez",
  },
  // Medical/Equipment
  {
    id: "med-1",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
    alt: "MRI machine in modern facility",
    category: "equipment",
    photographer: "National Cancer Institute",
  },
  {
    id: "med-2",
    url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80",
    alt: "Medical equipment and monitors",
    category: "equipment",
    photographer: "Piron Guillaume",
  },
  // Patients
  {
    id: "pat-1",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    alt: "Doctor consulting with patient",
    category: "patients",
    photographer: "National Cancer Institute",
  },
  {
    id: "pat-2",
    url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&q=80",
    alt: "Happy senior patient with nurse",
    category: "patients",
    photographer: "Towfiqu barbhuiya",
  },
  // Wellness
  {
    id: "well-1",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    alt: "Yoga and wellness class",
    category: "wellness",
    photographer: "Anupam Mahapatra",
  },
  {
    id: "well-2",
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    alt: "Meditation and mindfulness",
    category: "wellness",
    photographer: "Jared Rice",
  },
];

// ============================================================================
// CATEGORY CONFIG
// ============================================================================

const CATEGORIES: { id: ImageCategory; label: string; icon: React.ReactNode }[] = [
  { id: "doctors", label: "Doctors", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "hospital", label: "Facilities", icon: <Building2 className="w-4 h-4" /> },
  { id: "patients", label: "Patients", icon: <Users className="w-4 h-4" /> },
  { id: "equipment", label: "Equipment", icon: <Microscope className="w-4 h-4" /> },
  { id: "wellness", label: "Wellness", icon: <HeartPulse className="w-4 h-4" /> },
];

// ============================================================================
// IMAGE CARD COMPONENT
// ============================================================================

interface ImageCardProps {
  image: StockImage;
  isSelected: boolean;
  onSelect: () => void;
}

function ImageCard({ image, isSelected, onSelect }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
        isSelected
          ? "border-violet-500 ring-2 ring-violet-500/30"
          : "border-transparent hover:border-gray-300"
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}
      <img
        src={image.thumbnailUrl}
        alt={image.alt}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoading(false)}
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
        <div className="text-white text-center p-2">
          <p className="text-xs font-medium line-clamp-2">{image.alt}</p>
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function StockImagePicker({
  onSelect,
  onUpload,
  currentImage,
  aspectRatio = "landscape",
  className,
  triggerClassName,
  triggerVariant = "button",
  children,
}: StockImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);

  // Filter images
  const filteredImages = STOCK_IMAGES.filter((img) => {
    const matchesCategory = selectedCategory === "all" || img.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = useCallback((image: StockImage) => {
    setSelectedImage(image.url);
    onSelect(image);
    setIsOpen(false);
  }, [onSelect]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
      setIsOpen(false);
    }
  }, [onUpload]);

  // Render trigger based on variant
  const renderTrigger = () => {
    if (children) return children;

    switch (triggerVariant) {
      case "icon":
        return (
          <Button variant="ghost" size="icon" className={cn("rounded-full", triggerClassName)}>
            <ImageIcon className="w-4 h-4" />
          </Button>
        );
      case "link":
        return (
          <button
            className={cn(
              "text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1.5",
              triggerClassName
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Browse stock photos
          </button>
        );
      default:
        return (
          <Button variant="secondary" size="sm" className={cn("gap-2 bg-white/90 hover:bg-white", triggerClassName)}>
            <ImageIcon className="w-4 h-4" />
            Stock Photos
          </Button>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {renderTrigger()}
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-violet-500" />
            Choose an Image
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="stock" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="stock" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Stock Photos
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="flex-1 overflow-hidden flex flex-col mt-4">
            {/* Search & Filters */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  selectedCategory === "all"
                    ? "bg-violet-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                    selectedCategory === cat.id
                      ? "bg-violet-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                {filteredImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    isSelected={selectedImage === image.url}
                    onSelect={() => handleSelect(image)}
                  />
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">No images found</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search or category</p>
                </div>
              )}
            </div>

            {/* Attribution Notice */}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <p className="text-[10px] text-gray-400 text-center">
                Images provided by Unsplash. Free to use under the Unsplash License.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1">
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-8">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Upload your own image</h4>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Drag and drop or click to browse<br />
                PNG, JPG, WebP up to 5MB
              </p>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </span>
                </Button>
              </label>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default StockImagePicker;
