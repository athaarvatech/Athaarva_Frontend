// contexts/SearchContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ProductService } from "../lib/products";
import type { ShopifyProduct } from "../lib/shopify";

// Legacy product type for backward compatibility
interface LegacyProduct {
  id: string;
  name: string;
  image: string;
  specs: string[];
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  inStock: boolean;
  minOrderQty?: number;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: LegacyProduct[];
  isSearching: boolean;
  searchError: string | null;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LegacyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await ProductService.searchProducts({ query });
      const legacyProducts = response.products.map((product: ShopifyProduct) =>
        ProductService.convertToLegacyProduct(product)
      );
      setSearchResults(legacyProducts);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to search products. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        searchError,
        performSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
