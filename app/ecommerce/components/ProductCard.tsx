"use client";

import React from "react";
import { Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart, Product } from "../contexts/CartContext";
import { ProductService } from "../lib/products";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
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
  };
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    // Convert to cart item format (Product + quantity)
    const cartItem: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      brand: product.brand || "Unknown",
      specs: product.specs,
      inStock: product.inStock,
      minOrderQty: product.minOrderQty,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const productUrl = `/ecommerce/p/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  if (viewMode === "list") {
    return (
      <Card className="w-full hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-[#1E3E72]/20">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Product Image */}
            <Link href={productUrl} className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Product Image
                  </div>
                )}
              </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {product.brand && (
                    <span className="text-sm text-[#1E3E72] font-medium">
                      {product.brand}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                {product.originalPrice && (
                  <Badge className="bg-red-500 hover:bg-red-500 text-white">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              <Link href={productUrl}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-[#1E3E72] transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              {/* Specs */}
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                {product.specs.slice(0, 3).map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#14967f] rounded-full flex-shrink-0"></div>
                    {spec}
                  </li>
                ))}
              </ul>

              {/* Pricing and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#1E3E72]">
                    {ProductService.formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {ProductService.formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(-1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Add to Cart */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="bg-[#F37336] hover:bg-[#e5642a] text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Minimum Order Info */}
              {product.minOrderQty && (
                <p className="text-xs text-gray-500 mt-2">
                  Minimum order: {product.minOrderQty} units
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group h-full hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#1E3E72]/20 bg-white">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={productUrl}>
            <div className="w-full h-48 bg-gray-100 group-hover:scale-105 transition-transform duration-300">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Product Image
                </div>
              )}
            </div>
          </Link>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.originalPrice && (
              <Badge className="bg-red-500 hover:bg-red-500 text-white">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
            {product.inStock && (
              <Badge className="bg-green-500 hover:bg-green-500 text-white">
                In Stock
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Brand and Category */}
          <div className="flex items-center justify-between mb-2">
            {product.brand && (
              <span className="text-sm text-[#1E3E72] font-medium">
                {product.brand}
              </span>
            )}
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <Link href={productUrl}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-[#1E3E72] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Specs */}
          <ul className="text-sm text-gray-600 mb-4 space-y-1">
            {product.specs.slice(0, 3).map((spec, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#14967f] rounded-full flex-shrink-0"></div>
                {spec}
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-[#1E3E72]">
              {ProductService.formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {ProductService.formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-[#F37336] hover:bg-[#e5642a] text-white font-medium py-2.5 group"
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Add to Cart
          </Button>

          {/* Minimum Order Info */}
          {product.minOrderQty && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Minimum order: {product.minOrderQty} units
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
