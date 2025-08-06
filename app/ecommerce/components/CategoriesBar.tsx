"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Scissors,
  Activity,
  Bed,
  Shield,
  Microscope,
  Heart,
  Syringe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

export default function CategoriesBar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const categories: Category[] = [
    { id: "surgical", name: "Surgical", icon: Scissors, href: "#surgical" },
    {
      id: "diagnostics",
      name: "Diagnostics",
      icon: Microscope,
      href: "#diagnostics",
    },
    { id: "emergency", name: "Emergency", icon: Heart, href: "#emergency" },
    { id: "furniture", name: "Furniture", icon: Bed, href: "#furniture" },
    {
      id: "disposables",
      name: "Disposables",
      icon: Shield,
      href: "#disposables",
    },
    {
      id: "anesthesia",
      name: "Anesthesia",
      icon: Activity,
      href: "#anesthesia",
    },
    {
      id: "cardiology",
      name: "Cardiology",
      icon: Stethoscope,
      href: "#cardiology",
    },
    { id: "injection", name: "Injection", icon: Syringe, href: "#injection" },
  ];

  const scrollToCategory = (href: string, categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("categories-container");
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = document.getElementById("categories-container");
    const checkScroll = () => {
      if (container) {
        setShowScrollButtons(container.scrollWidth > container.clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <section className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center py-4">
          {/* Left Scroll Button */}
          {showScrollButtons && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollContainer("left")}
              className="absolute left-0 z-10 bg-white shadow-md hover:bg-gray-50 rounded-full p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}

          {/* Categories Container */}
          <div
            id="categories-container"
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-8 lg:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => scrollToCategory(category.href, category.id)}
                  className={`
                    flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-[#1E3E72] text-white border-[#1E3E72] shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#1E3E72] hover:text-[#1E3E72] hover:bg-[#f1f9ff]"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-[#1E3E72]"
                    }`}
                  />
                  <span className="font-medium text-sm whitespace-nowrap">
                    {category.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          {showScrollButtons && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollContainer("right")}
              className="absolute right-0 z-10 bg-white shadow-md hover:bg-gray-50 rounded-full p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Active Category Indicator */}
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="h-1 bg-[#F37336] rounded-full mb-2"
            style={{ width: "60px" }}
          />
        )}
      </div>
    </section>
  );
}
