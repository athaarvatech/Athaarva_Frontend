"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { API_CONFIG } from "@/lib/api-config";
import { HospitalCardData } from "./HospitalCard";

interface HospitalSearchProps {
  onSearch: (hospitals: HospitalCardData[]) => void;
  onSearching: (isSearching: boolean) => void;
  onClear?: () => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  autoFocus?: boolean;
}

export function HospitalSearch({
  onSearch,
  onSearching,
  onClear,
  placeholder = "Search by hospital name, city, or specialty...",
  debounceMs = 300,
  className,
  autoFocus = false,
}: HospitalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Popular search suggestions
  const defaultSuggestions = [
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Multi-Specialty",
    "Emergency Care",
  ];

  const searchHospitals = useCallback(async (query: string) => {
    if (!query.trim()) {
      onSearch([]);
      onSearching(false);
      return;
    }

    setIsSearching(true);
    onSearching(true);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/hospitals/search?q=${encodeURIComponent(query)}&status=ACTIVE&per_page=20`
      );

      if (response.ok) {
        const data = await response.json();
        onSearch(data.hospitals || []);
      } else {
        // Fallback to simple filter endpoint
        const fallbackResponse = await fetch(
          `${API_CONFIG.BASE_URL}/hospitals?status=ACTIVE&per_page=100`
        );

        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          const filtered = (data.hospitals || []).filter(
            (h: HospitalCardData) =>
              h.hospital_name.toLowerCase().includes(query.toLowerCase()) ||
              h.city?.toLowerCase().includes(query.toLowerCase()) ||
              h.subdomain.toLowerCase().includes(query.toLowerCase()) ||
              h.specialties?.some((s) =>
                s.toLowerCase().includes(query.toLowerCase())
              )
          );
          onSearch(filtered);
        } else {
          onSearch([]);
        }
      }
    } catch (error) {
      console.error("Error searching hospitals:", error);
      // Use mock data for development
      const mockHospitals: HospitalCardData[] = [
        {
          id: "1",
          hospital_name: "Test Hospital",
          subdomain: "t",
          status: "ACTIVE",
          city: "Mumbai",
          state: "Maharashtra",
          specialties: ["General Medicine", "Cardiology"],
          branding: { primary_color: "#7c3aed" },
        },
        {
          id: "2",
          hospital_name: "Demo Medical Center",
          subdomain: "demo",
          status: "ACTIVE",
          city: "Delhi",
          state: "Delhi",
          specialties: ["Multi-Specialty", "Emergency Care"],
          branding: { primary_color: "#0369a1" },
        },
      ].filter(
        (h) =>
          h.hospital_name.toLowerCase().includes(query.toLowerCase()) ||
          h.city?.toLowerCase().includes(query.toLowerCase()) ||
          h.specialties?.some((s) =>
            s.toLowerCase().includes(query.toLowerCase())
          )
      );
      onSearch(mockHospitals);
    } finally {
      setIsSearching(false);
      onSearching(false);
    }
  }, [onSearch, onSearching]);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        searchHospitals(searchTerm);
      }, debounceMs);
    } else {
      onSearch([]);
      onSearching(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, debounceMs, searchHospitals, onSearch, onSearching]);

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch([]);
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (!searchTerm) {
      setSuggestions(defaultSuggestions);
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isSearching ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "pl-12 pr-10 py-6 text-base rounded-xl border-2 border-gray-200",
            "focus:border-healthcare-primary focus:ring-healthcare-primary/20",
            "placeholder:text-gray-400"
          )}
        />

        {/* Clear button */}
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Popular Searches
              </span>
            </div>
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search hint */}
      {!searchTerm && !showSuggestions && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Try searching by hospital name, city, or specialty
        </p>
      )}
    </div>
  );
}

export default HospitalSearch;
