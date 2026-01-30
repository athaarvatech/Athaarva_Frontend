"use client";

/**
 * ContentSuggester - Phase 3: Onboarding UX Redesign
 * 
 * AI-powered content suggestion component that provides contextual
 * text suggestions for various sections of hospital branding.
 * 
 * Features:
 * - Multiple suggestion options
 * - Click to apply
 * - Regenerate suggestions
 * - Edit suggestions before applying
 */

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { suggestContent, ContentSuggestionRequest } from "@/lib/azure-ai";

type SuggestionSection = "tagline" | "about" | "services" | "welcome" | "contact";

interface ContentSuggesterProps {
  section: SuggestionSection;
  hospitalName: string;
  specialties?: string[];
  currentValue?: string;
  onApply: (content: string) => void;
  buttonText?: string;
  tone?: "professional" | "friendly" | "warm" | "modern";
  maxLength?: number;
  className?: string;
}

const SECTION_LABELS: Record<SuggestionSection, string> = {
  tagline: "Hospital Tagline",
  about: "About Us",
  services: "Services Description",
  welcome: "Welcome Message",
  contact: "Contact Section",
};

const SECTION_TIPS: Record<SuggestionSection, string> = {
  tagline: "A short, memorable phrase that captures your hospital's essence",
  about: "Tell patients about your hospital's mission and values",
  services: "Highlight your key services and specialties",
  welcome: "A warm greeting for your website visitors",
  contact: "Encourage patients to reach out",
};

export function ContentSuggester({
  section,
  hospitalName,
  specialties = [],
  currentValue: _currentValue = "",
  onApply,
  buttonText = "✨ Get AI Suggestions",
  tone = "professional",
  maxLength,
  className,
}: ContentSuggesterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch suggestions from AI
  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const request: ContentSuggestionRequest = {
        hospitalName,
        specialties,
        section,
        tone,
      };

      const response = await suggestContent(request);

      if (response.success && response.suggestions) {
        setSuggestions(response.suggestions);
        setSelectedIndex(null);
        setIsEditing(false);
      } else {
        setError(response.error || "Failed to generate suggestions");
      }
    } catch (_err) {
      setError("An error occurred while generating suggestions");
    } finally {
      setIsLoading(false);
    }
  }, [hospitalName, specialties, section, tone]);

  // Handle opening the popover
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open && suggestions.length === 0) {
        fetchSuggestions();
      }
    },
    [suggestions.length, fetchSuggestions]
  );

  // Apply selected suggestion
  const handleApply = useCallback(() => {
    const contentToApply = isEditing
      ? editedContent
      : selectedIndex !== null
      ? suggestions[selectedIndex]
      : null;

    if (contentToApply) {
      onApply(contentToApply);
      setIsOpen(false);
      // Reset state
      setSelectedIndex(null);
      setIsEditing(false);
      setEditedContent("");
    }
  }, [isEditing, editedContent, selectedIndex, suggestions, onApply]);

  // Start editing a suggestion
  const handleEdit = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      setEditedContent(suggestions[index]);
      setIsEditing(true);
    },
    [suggestions]
  );

  // Copy to clipboard
  const handleCopy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
    },
    []
  );

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 text-sm text-healthcare-primary hover:text-healthcare-primary/80 font-medium transition-colors",
            className
          )}
        >
          <Sparkles className="w-4 h-4" />
          {buttonText}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900">
              {SECTION_LABELS[section]}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSuggestions}
              disabled={isLoading}
              className="h-7 text-xs"
            >
              <RefreshCw
                className={cn("w-3 h-3 mr-1", isLoading && "animate-spin")}
              />
              Regenerate
            </Button>
          </div>
          <p className="text-xs text-gray-500">{SECTION_TIPS[section]}</p>
        </div>

        <div className="p-4 max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-healthcare-primary mb-2" />
              <p className="text-sm text-gray-500">Generating suggestions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-500 mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSuggestions}
              >
                Try Again
              </Button>
            </div>
          ) : isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Edit the suggestion..."
                className="min-h-[100px] text-sm"
                maxLength={maxLength}
              />
              {maxLength && (
                <p className="text-xs text-gray-500 text-right">
                  {editedContent.length}/{maxLength}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent("");
                    setSelectedIndex(null);
                  }}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-healthcare-primary hover:bg-healthcare-primary/90"
                  onClick={handleApply}
                  disabled={!editedContent.trim()}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all cursor-pointer group",
                    selectedIndex === index
                      ? "border-healthcare-primary bg-healthcare-primary/5"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedIndex(index)}
                >
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                    {suggestion}
                  </p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(index);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(suggestion);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !error && !isEditing && suggestions.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-healthcare-primary hover:bg-healthcare-primary/90"
              onClick={handleApply}
              disabled={selectedIndex === null}
            >
              <Check className="w-3 h-3 mr-1" />
              Apply Selected
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default ContentSuggester;
