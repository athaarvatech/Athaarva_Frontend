"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "../contexts/SearchContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import Link from "next/link";
import Image from "next/image";

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
  onSelect?: () => void;
}

export default function SearchDropdown({
  placeholder = "Search products...",
  className = "",
  onSelect,
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    searchResults,
    isSearching,
    searchError,
    performSearch,
    clearSearch,
  } = useSearch();

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim()) {
        performSearch(inputValue);
        setIsOpen(true);
      } else {
        clearSearch();
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, performSearch, clearSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleClear = () => {
    setInputValue("");
    clearSearch();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleProductSelect = () => {
    setIsOpen(false);
    setInputValue("");
    clearSearch();
    onSelect?.();
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className="pl-10 pr-10 border-gray-300 focus:border-[#1E3E72] focus:ring-[#1E3E72]"
          onFocus={() => {
            if (searchResults.length > 0) {
              setIsOpen(true);
            }
          }}
        />
        
        {/* Clear button */}
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Searching...</span>
            </div>
          )}

          {searchError && (
            <div className="px-4 py-3 text-red-600 text-sm border-b border-gray-100">
              {searchError}
            </div>
          )}

          {!isSearching && !searchError && searchResults.length === 0 && inputValue.trim() && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p>No products found for &ldquo;{inputValue}&rdquo;</p>
              <p className="text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/ecommerce/p/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  onClick={handleProductSelect}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {product.category}
                    </p>
                    <p className="text-sm font-semibold text-[#1E3E72]">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>

                  {!product.inStock && (
                    <span className="ml-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </Link>
              ))}

              {searchResults.length > 8 && (
                <div className="border-t border-gray-100 px-4 py-3">
                  <Link
                    href={`/ecommerce/search?q=${encodeURIComponent(inputValue)}`}
                    onClick={handleProductSelect}
                    className="text-sm text-[#1E3E72] hover:text-[#0f2954] font-medium"
                  >
                    View all {searchResults.length} results →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
