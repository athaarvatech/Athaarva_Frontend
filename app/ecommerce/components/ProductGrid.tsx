"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../contexts/CartContext";
import { ProductService } from "../lib/products";
import type { ShopifyProduct } from "../lib/shopify";
import Link from "next/link";
import Image from "next/image";

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  sortBy?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'BEST_SELLING' | 'RELEVANCE';
  reverse?: boolean;
  searchQuery?: string;
}

export default function ProductGrid({
  title = "Featured Products",
  subtitle = "Discover our latest medical equipment and supplies",
  limit = 12,
  sortBy = 'BEST_SELLING',
  reverse = false,
  searchQuery,
}: ProductGridProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (searchQuery) {
          response = await ProductService.searchProducts({
            query: searchQuery,
            first: limit,
          });
        } else {
          response = await ProductService.getProducts({
            first: limit,
            sortKey: sortBy,
            reverse,
          });
        }

        setProducts(response.products);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [limit, sortBy, reverse, searchQuery]);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.variants.edges[0]?.node;
    if (!variant || !variant.availableForSale) return;

    try {
      await addToCart(variant.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount);
    const symbol = currencyCode === 'INR' ? '₹' : currencyCode;
    return `${symbol}${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
              {title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Roboto']">
              {subtitle}
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: limit }, (_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-full">
                  <CardContent className="p-0">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
              {title}
            </h2>
            <p className="text-xl text-red-600 max-w-3xl mx-auto">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Roboto']">
            {subtitle}
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => {
              const variant = product.variants.edges[0]?.node;
              const price = variant?.price || product.priceRange.minVariantPrice;
              const isAvailable = variant?.availableForSale ?? true;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#1E3E72]/20 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        <Link href={`/ecommerce/p/${product.handle}`}>
                          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            {product.featuredImage ? (
                              <Image
                                src={product.featuredImage.url}
                                alt={product.featuredImage.altText || product.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="text-gray-400 text-sm">No Image</div>
                            )}
                          </div>
                        </Link>

                        {/* Product Tags */}
                        {product.tags.length > 0 && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-[#1E3E72] hover:bg-[#1E3E72] text-white text-xs">
                              {product.tags[0]}
                            </Badge>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Link href={`/ecommerce/p/${product.handle}`}>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>

                        {/* Availability Badge */}
                        {!isAvailable && (
                          <div className="absolute bottom-3 left-3">
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs text-[#1E3E72] border-[#1E3E72]">
                            {product.productType || 'Medical Equipment'}
                          </Badge>
                        </div>

                        <Link href={`/ecommerce/p/${product.handle}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#1E3E72] transition-colors">
                            {product.title}
                          </h3>
                        </Link>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Rating - Static for now */}
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-bold text-[#1E3E72]">
                              {formatPrice(price.amount, price.currencyCode)}
                            </span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={!isAvailable}
                          className="w-full bg-[#F37336] hover:bg-[#e5642a] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {isAvailable ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Button - could be enhanced with pagination */}
        {products.length >= limit && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-[#1E3E72] text-[#1E3E72] hover:bg-[#1E3E72] hover:text-white px-8 py-3 text-lg font-semibold border-2"
            >
              View All Products
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
