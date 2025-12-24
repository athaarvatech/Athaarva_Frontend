"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import { ProductService } from "../../lib/products";
import type { ShopifyProduct } from "../../lib/shopify";

interface ProductDetailClientProps {
  product: ShopifyProduct;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const variants = ProductService.getProductVariants(product);
  const images = ProductService.getProductImages(product);
  const currentVariant = variants[selectedVariant];

  const handleAddToCart = async () => {
    if (!currentVariant || !currentVariant.availableForSale) return;

    try {
      setIsAddingToCart(true);
      await addToCart(currentVariant.id, quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900 truncate">
                {product.title}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg relative"
            >
              {images.length > 0 ? (
                <Image
                  src={
                    images[selectedImageIndex]?.url ||
                    product.featuredImage?.url ||
                    ""
                  }
                  alt={images[selectedImageIndex]?.altText || product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all relative ${
                      selectedImageIndex === index
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {product.productType || "Medical Equipment"}
                </Badge>
                {currentVariant?.availableForSale && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    In Stock
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  {ProductService.formatPrice(
                    currentVariant?.price ||
                      product.priceRange.minVariantPrice.amount,
                    currentVariant?.currencyCode ||
                      product.priceRange.minVariantPrice.currencyCode
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    (4.8) • 24 reviews
                  </span>
                </div>
              </div>

              {product.description && (
                <div className="prose prose-sm text-gray-600 mb-8">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Select Variant</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(index)}
                        disabled={!variant.availableForSale}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedVariant === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${
                          !variant.availableForSale
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{variant.title}</p>
                            <p className="text-sm text-gray-600">
                              {variant.selectedOptions
                                .map(
                                  (option) => `${option.name}: ${option.value}`
                                )
                                .join(", ")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {ProductService.formatPrice(
                                variant.price,
                                variant.currencyCode
                              )}
                            </p>
                            {!variant.availableForSale && (
                              <p className="text-sm text-red-600">
                                Out of Stock
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity and Add to Cart */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium text-lg">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      !currentVariant?.availableForSale || isAddingToCart
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isAddingToCart
                      ? "Adding to Cart..."
                      : !currentVariant?.availableForSale
                      ? "Out of Stock"
                      : `Add to Cart • ${ProductService.formatPrice(
                          (currentVariant?.price ||
                            parseFloat(
                              product.priceRange.minVariantPrice.amount
                            )) * quantity,
                          currentVariant?.currencyCode ||
                            product.priceRange.minVariantPrice.currencyCode
                        )}`}
                  </Button>

                  {/* Product Tags */}
                  {product.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.slice(0, 6).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Features & Benefits</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    High-quality medical grade materials
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    FDA approved and certified
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Fast and secure shipping
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    30-day return policy
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
