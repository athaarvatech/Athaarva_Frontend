"use client";

/**
 * =============================================================================
 * AI CONTENT ASSISTANT ("The Magic Wand")
 * =============================================================================
 * 
 * A smart assistant that helps users write better content for their hospital
 * website. Provides tone variations and text improvements.
 * 
 * Features:
 * - Professional, Welcoming, and Shortened tone options
 * - Context-aware suggestions based on field type
 * - Smooth animations and intuitive UX
 * 
 * NOTE: Currently uses mocked responses. Replace with actual AI API calls
 * when backend is ready.
 * 
 * =============================================================================
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Briefcase,
  Heart,
  Scissors,
  Loader2,
  Check,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// ============================================================================
// TYPES
// ============================================================================

export type ContentTone = "professional" | "welcoming" | "shorten";

export interface AIContentAssistantProps {
  currentText: string;
  fieldType?: "hero-title" | "hero-subtitle" | "description" | "tagline" | "generic";
  onApply: (newText: string) => void;
  className?: string;
}

interface ToneOption {
  id: ContentTone;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// ============================================================================
// TONE OPTIONS
// ============================================================================

const TONE_OPTIONS: ToneOption[] = [
  {
    id: "professional",
    label: "Professional",
    icon: <Briefcase className="w-4 h-4" />,
    description: "Formal, authoritative tone",
  },
  {
    id: "welcoming",
    label: "Welcoming",
    icon: <Heart className="w-4 h-4" />,
    description: "Warm, friendly approach",
  },
  {
    id: "shorten",
    label: "Shorten",
    icon: <Scissors className="w-4 h-4" />,
    description: "Concise and impactful",
  },
];

// ============================================================================
// MOCK AI RESPONSES
// ============================================================================

const MOCK_RESPONSES: Record<string, Record<ContentTone, string[]>> = {
  "hero-title": {
    professional: [
      "Excellence in Healthcare, Precision in Care",
      "Advanced Medical Solutions for Modern Healthcare",
      "Where Clinical Excellence Meets Compassionate Care",
    ],
    welcoming: [
      "Your Health Journey Starts Here",
      "Caring for You Like Family",
      "Welcome to Better Health",
    ],
    shorten: [
      "World-Class Care",
      "Excellence in Health",
      "Care You Can Trust",
    ],
  },
  "hero-subtitle": {
    professional: [
      "Delivering comprehensive healthcare services with cutting-edge technology and board-certified specialists.",
      "A leading healthcare institution committed to clinical excellence and patient outcomes.",
      "Pioneering medical innovation while maintaining the highest standards of patient care.",
    ],
    welcoming: [
      "We're here to support you and your loved ones every step of the way.",
      "Join thousands of families who trust us with their healthcare needs.",
      "Experience healthcare that puts your comfort and wellbeing first.",
    ],
    shorten: [
      "Expert care when you need it most.",
      "Quality healthcare for every family.",
      "Your trusted healthcare partner.",
    ],
  },
  description: {
    professional: [
      "Our institution employs state-of-the-art diagnostic and treatment protocols.",
      "We maintain rigorous quality standards across all departments.",
      "Our team of specialists brings decades of combined expertise.",
    ],
    welcoming: [
      "We believe in treating every patient with kindness and respect.",
      "Our caring staff is dedicated to making your visit comfortable.",
      "We're committed to your health and happiness.",
    ],
    shorten: [
      "Expert care, modern facilities.",
      "Quality you can trust.",
      "Healthcare made simple.",
    ],
  },
  tagline: {
    professional: [
      "Setting the Standard in Healthcare",
      "Clinical Excellence, Proven Results",
      "Where Science Meets Compassion",
    ],
    welcoming: [
      "Care That Feels Like Home",
      "Health with Heart",
      "Together for Better Health",
    ],
    shorten: [
      "Care Beyond Compare",
      "Health First",
      "Trust. Care. Heal.",
    ],
  },
  generic: {
    professional: [
      "Our commitment to excellence drives everything we do.",
      "We adhere to the highest standards of medical practice.",
      "Experience healthcare delivered with precision and expertise.",
    ],
    welcoming: [
      "We're here to help you feel your best.",
      "Your wellbeing is our top priority.",
      "Let us take care of you.",
    ],
    shorten: [
      "Quality care, always.",
      "Here for you.",
      "Health matters.",
    ],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSuggestion(
  currentText: string,
  fieldType: string,
  tone: ContentTone
): string {
  const responses = MOCK_RESPONSES[fieldType] || MOCK_RESPONSES.generic;
  const options = responses[tone];
  
  // Pick a random suggestion (in real implementation, AI would generate contextual response)
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AIContentAssistant({
  currentText,
  fieldType = "generic",
  onApply,
  className,
}: AIContentAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<ContentTone, string> | null>(null);
  const [selectedTone, setSelectedTone] = useState<ContentTone | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setSuggestions(null);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Generate suggestions for all tones
    const newSuggestions: Record<ContentTone, string> = {
      professional: generateSuggestion(currentText, fieldType, "professional"),
      welcoming: generateSuggestion(currentText, fieldType, "welcoming"),
      shorten: generateSuggestion(currentText, fieldType, "shorten"),
    };
    
    setSuggestions(newSuggestions);
    setIsGenerating(false);
  }, [currentText, fieldType]);

  const handleApply = useCallback((tone: ContentTone) => {
    if (suggestions && suggestions[tone]) {
      onApply(suggestions[tone]);
      setSelectedTone(tone);
      
      // Close after a brief moment to show selection
      setTimeout(() => {
        setIsOpen(false);
        setSelectedTone(null);
        setSuggestions(null);
      }, 500);
    }
  }, [suggestions, onApply]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open && !suggestions) {
      handleGenerate();
    }
    if (!open) {
      setSelectedTone(null);
    }
  }, [suggestions, handleGenerate]);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            "bg-gradient-to-r from-violet-500 to-pink-500",
            "text-white shadow-lg shadow-violet-500/30",
            "hover:shadow-xl hover:shadow-violet-500/40",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/50",
            className
          )}
          title="AI Content Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </motion.button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0 overflow-hidden" 
        align="start"
        side="top"
        sideOffset={8}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            <div>
              <h4 className="font-semibold text-sm">AI Content Assistant</h4>
              <p className="text-xs text-white/80">Choose a tone for your text</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Generating suggestions...</p>
            </div>
          ) : suggestions ? (
            <AnimatePresence>
              {TONE_OPTIONS.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleApply(option.id)}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 text-left transition-all",
                    selectedTone === option.id
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      selectedTone === option.id 
                        ? "bg-violet-500 text-white" 
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {selectedTone === option.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        option.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900">
                          {option.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {option.description}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        "{suggestions[option.id]}"
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          ) : null}

          {/* Regenerate Button */}
          {suggestions && !isGenerating && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerate}
              className="w-full mt-2 text-gray-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate new suggestions
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center">
            AI suggestions are for inspiration. Always review before publishing.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AIContentAssistant;
