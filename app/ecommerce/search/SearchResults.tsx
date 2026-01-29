"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Grid, List, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import { ProductService } from "../lib/products";
import type { ShopifyProduct } from "../lib/shopify";
import Link from "next/link";
import Image from "next/image";

interface SearchResultsState {
  products: ShopifyProduct[];
  loading: boolean;
  error: string | null;
  query: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [state, setState] = useState<SearchResultsState>({
    products: [],
    loading: false,
    error: null,
    query: initialQuery,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (initialQuery) {
      searchProducts(initialQuery);
    }
  }, [initialQuery]);

  const searchProducts = async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await ProductService.searchProducts({ 
        query: query.trim(),
        first: 50 
      });
      setState(prev => ({
        ...prev,
        products: response.products,
        loading: false,
      }));
    } catch (error) {
      console.error("Search error:", error);
      setState(prev => ({
        ...prev,
        error: "Failed to search products. Please try again.",
        loading: false,
      }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.query.trim()) {
      searchProducts(state.query);
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set("q", state.query);
      window.history.pushState({}, "", url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button and search header */}
        <div className="mb-6">
          <Link
            href="/ecommerce"
            className="inline-flex items-center text-[#1E3E72] hover:text-[#0f2954] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Results
            {initialQuery && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                for &ldquo;{initialQuery}&rdquo;
              </span>
            )}
          </h1>

          {/* Search form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={state.query}
                onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                className="pl-12 pr-4 py-3 text-lg border-gray-300 focus:border-[#1E3E72] focus:ring-[#1E3E72]"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1E3E72] hover:bg-[#0f2954]"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Results header with filters */}
        {!state.loading && !state.error && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <p className="text-gray-600">
              {state.products.length} {state.products.length === 1 ? "result" : "results"} found
            </p>

            <div className="flex items-center space-x-4">
              {/* Sort options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#1E3E72] focus:ring-[#1E3E72]"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View mode toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none border-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none border-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {state.loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3E72] mx-auto mb-4"></div>
              <p className="text-gray-600">Searching products...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Search className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Search Error</h3>
            <p className="text-red-600 mb-4">{state.error}</p>
            <Button
              onClick={() => searchProducts(state.query)}
              className="bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No results */}
        {!state.loading && !state.error && state.products.length === 0 && initialQuery && (
          <div className="text-center py-12">
            <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any products matching &ldquo;{initialQuery}&rdquo;
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Checking your spelling</li>
                <li>Using different keywords</li>
                <li>Using more general terms</li>
                <li>Browsing our categories</li>
              </ul>
            </div>
            <Link href="/ecommerce">
              <Button className="mt-6 bg-[#1E3E72] hover:bg-[#0f2954]">
                Browse All Products
              </Button>
            </Link>
          </div>
        )}

        {/* Results grid/list */}
        {!state.loading && !state.error && state.products.length > 0 && (
          <div 
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {state.products.map((product) => {
              const productUrl = `/ecommerce/p/${product.handle}`;
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                  <Link href={productUrl}>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.productType}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#1E3E72]">
                        ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                      </span>
                      <Button 
                        size="sm"
                        className="bg-[#F37336] hover:bg-[#e5642a] text-white"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <CartSidebar />
    </div>
  );
}
