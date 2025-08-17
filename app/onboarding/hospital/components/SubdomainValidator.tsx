"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SubdomainService,
  SubdomainValidationResponse,
} from "@/lib/subdomain-service";

interface SubdomainValidatorProps {
  value: string;
  onChange: (value: string) => void;
  hospitalName: string;
}

export default function SubdomainValidator({
  value,
  onChange,
  hospitalName,
}: SubdomainValidatorProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [validationResult, setValidationResult] =
    useState<SubdomainValidationResponse | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced validation function
  const validateSubdomain = useCallback(
    async (subdomain: string) => {
      if (!subdomain || subdomain.length < 3) {
        setValidationResult(null);
        return;
      }

      setIsChecking(true);
      try {
        const result = await SubdomainService.checkSubdomainAvailability(
          subdomain
        );
        setValidationResult(result);

        // If subdomain is taken, generate suggestions
        if (!result.available && hospitalName) {
          const newSuggestions =
            SubdomainService.generateSubdomainSuggestions(hospitalName);
          setSuggestions(newSuggestions.slice(0, 5)); // Show only first 5 suggestions
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error validating subdomain:", error);
        setValidationResult({
          available: false,
          message: "Unable to validate subdomain",
        });
      } finally {
        setIsChecking(false);
      }
    },
    [hospitalName]
  );

  // Debounce the validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) {
        validateSubdomain(value);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, validateSubdomain]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = SubdomainService.formatSubdomain(e.target.value);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const generateNewSuggestions = () => {
    if (hospitalName) {
      const newSuggestions =
        SubdomainService.generateSubdomainSuggestions(hospitalName);
      setSuggestions(newSuggestions.slice(0, 5));
      setShowSuggestions(true);
    }
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }

    if (!validationResult) {
      return null;
    }

    return validationResult.available ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusColor = () => {
    if (isChecking) return "border-blue-300";
    if (!validationResult) return "border-gray-300";
    return validationResult.available ? "border-green-300" : "border-red-300";
  };

  const previewUrl = `https://${value || "your-hospital"}.athaarva.com`;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="subdomain"
          className="text-sm font-medium text-gray-700"
        >
          Hospital Subdomain *
        </Label>

        <div className="relative">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              https://
            </span>
            <Input
              id="subdomain"
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="your-hospital"
              className={cn(
                "rounded-l-none border-l-0 rounded-r-none pr-10",
                getStatusColor()
              )}
              maxLength={30}
            />
            <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              .athaarva.com
            </span>
          </div>

          {/* Status Icon */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>

        {/* Validation Message */}
        {validationResult && (
          <div
            className={cn(
              "text-sm flex items-center space-x-2",
              validationResult.available ? "text-green-600" : "text-red-600"
            )}
          >
            {getStatusIcon()}
            <span>{validationResult.message}</span>
          </div>
        )}

        {/* Preview URL */}
        {value && validationResult?.available && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
            <ExternalLink className="w-4 h-4" />
            <span>Your hospital will be accessible at:</span>
            <code className="bg-white px-2 py-1 rounded text-green-700 font-mono">
              {previewUrl}
            </code>
          </div>
        )}

        {/* Character count */}
        <div className="text-xs text-gray-500 text-right">
          {value.length}/30 characters
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-medium text-amber-800">
                Suggested Available Subdomains
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateNewSuggestions}
              className="h-6 px-2 text-amber-700 hover:text-amber-800"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              More
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-amber-100 border-amber-300 text-amber-700"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}.athaarva.com
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Subdomain must be 3-30 characters long</p>
        <p>• Only lowercase letters, numbers, and hyphens are allowed</p>
        <p>• Cannot start or end with a hyphen</p>
        <p>• Once set, subdomain cannot be changed</p>
      </div>
    </div>
  );
}
