"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart, Product } from "../contexts/CartContext";
import { ProductService } from "../lib/products";
import type { ShopifyProduct } from "../lib/shopify";

export default function FeaturedProducts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, addToCart } = useCart();

  // Load Shopify featured products
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await ProductService.getFeaturedProducts();
        setShopifyProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  // Use Shopify products if available, otherwise fallback to mock data
  const mockFeaturedProducts: Product[] = [
    {
      id: "prod-1",
      name: "Surgical Gloves (Pack of 100)",
      image: "/api/placeholder/250/200",
      specs: [
        "Sterile and powder-free",
        "Latex material",
        "FDA approved",
        "Size: Medium",
      ],
      price: 299,
      originalPrice: 399,
      category: "Surgical",
      brand: "MedTech",
      inStock: true,
      minOrderQty: 10,
    },
    {
      id: "prod-2",
      name: "12-Channel ECG Machine",
      image: "/api/placeholder/250/200",
      specs: [
        "High resolution display",
        "Automated interpretation",
        "Built-in thermal printer",
        "2-year warranty",
      ],
      price: 45000,
      category: "Diagnostics",
      brand: "CardioMax",
      inStock: true,
    },
    {
      id: "prod-3",
      name: "Digital Blood Pressure Monitor",
      image: "/api/placeholder/250/200",
      specs: [
        "NIBP measurement",
        "Large LCD display",
        "Memory for 99 readings",
        "CE certified",
      ],
      price: 2499,
      originalPrice: 2999,
      category: "Diagnostics",
      brand: "VitalSign",
      inStock: true,
    },
    {
      id: "prod-4",
      name: "Hospital Bed - Electric",
      image: "/api/placeholder/250/200",
      specs: [
        "Three-function electric",
        "Side rails included",
        "Weight capacity: 150kg",
        "Mattress platform",
      ],
      price: 28500,
      category: "Furniture",
      brand: "ComfortCare",
      inStock: true,
    },
    {
      id: "prod-5",
      name: "Disposable Face Masks (Box of 50)",
      image: "/api/placeholder/250/200",
      specs: [
        "3-layer protection",
        "Non-woven material",
        "Elastic ear loops",
        "BIS certified",
      ],
      price: 149,
      originalPrice: 199,
      category: "Disposables",
      brand: "SafeGuard",
      inStock: true,
      minOrderQty: 5,
    },
    {
      id: "prod-6",
      name: "Pulse Oximeter",
      image: "/api/placeholder/250/200",
      specs: [
        "SpO2 and pulse rate",
        "OLED display",
        "Low battery indicator",
        "Auto power off",
      ],
      price: 1299,
      category: "Emergency",
      brand: "OxyCheck",
      inStock: true,
    },
  ];

  // Combine Shopify products with mock data for display
  const displayProducts = shopifyProducts.length > 0 
    ? shopifyProducts.map(product => ProductService.convertToLegacyProduct(product))
    : mockFeaturedProducts;

  const productsPerSlide = 3;
  const maxSlides = Math.ceil(displayProducts.length / productsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const getCurrentProducts = (): Product[] => {
    const start = currentSlide * productsPerSlide;
    return displayProducts.slice(start, start + productsPerSlide);
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }));
  };

  const handleAddToCart = async (product: Product) => {
    const quantity = quantities[product.id] || 1;
    
    // Check if this is a Shopify product
    const shopifyProduct = shopifyProducts.find(sp => sp.id === product.id);
    
    if (shopifyProduct && shopifyProduct.variants.edges.length > 0) {
      // Use Shopify cart for Shopify products
      const variantId = shopifyProduct.variants.edges[0].node.id;
      try {
        await addToCart(variantId, quantity);
      } catch (error) {
        console.error('Error adding Shopify product to cart:', error);
        // Fallback to legacy cart
        for (let i = 0; i < quantity; i++) {
          addItem(product);
        }
      }
    } else {
      // Use legacy cart for mock products
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#f1f9ff] via-white to-[#f0f9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Roboto']">
            Discover our most popular medical equipment and supplies, trusted by
            healthcare professionals nationwide.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 rounded-full p-3 border-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 rounded-full p-3 border-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Products Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12"
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {getCurrentProducts().map((product: Product, index: number) => (
                  <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-[#1E3E72]/20 bg-white">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <div className="text-gray-400 text-sm">
                          Product Image
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.originalPrice && (
                          <Badge className="bg-red-500 hover:bg-red-500 text-white">
                            {Math.round(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                                100
                            )}
                            % OFF
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Brand and Category */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#1E3E72] font-medium">
                          {product.brand}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 font-['Montserrat'] line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Specs */}
                      <ul className="text-sm text-gray-600 mb-4 space-y-1">
                        {product.specs.slice(0, 3).map((spec: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#14967f] rounded-full flex-shrink-0"></div>
                            {spec}
                          </li>
                        ))}
                      </ul>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-[#1E3E72]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">
                          Quantity:
                        </span>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {quantities[product.id] || 1}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(product)}
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
              </motion.div>
            ))}
          </motion.div>
              
              {/* Slide Indicators */}
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: maxSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentSlide ? "bg-[#1E3E72]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
