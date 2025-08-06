"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  Microscope,
  Heart,
  Bed,
  Shield,
  Activity,
  Stethoscope,
  Syringe,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategorySection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  productCount: number;
  image: string;
}

export default function ProductCatalog() {
  const categories: CategorySection[] = [
    {
      id: "surgical",
      name: "Surgical Instruments",
      icon: Scissors,
      description:
        "Premium surgical tools and equipment for precise operations",
      productCount: 850,
      image: "/api/placeholder/300/200",
    },
    {
      id: "diagnostics",
      name: "Diagnostic Equipment",
      icon: Microscope,
      description:
        "Advanced diagnostic devices for accurate patient assessment",
      productCount: 650,
      image: "/api/placeholder/300/200",
    },
    {
      id: "emergency",
      name: "Emergency Care",
      icon: Heart,
      description: "Critical care equipment for emergency medical situations",
      productCount: 420,
      image: "/api/placeholder/300/200",
    },
    {
      id: "furniture",
      name: "Hospital Furniture",
      icon: Bed,
      description:
        "Comfortable and durable furniture for healthcare facilities",
      productCount: 380,
      image: "/api/placeholder/300/200",
    },
    {
      id: "disposables",
      name: "Disposables & Consumables",
      icon: Shield,
      description: "Single-use medical supplies and consumable products",
      productCount: 1200,
      image: "/api/placeholder/300/200",
    },
    {
      id: "anesthesia",
      name: "Anesthesia Equipment",
      icon: Activity,
      description: "Anesthesia machines and monitoring devices",
      productCount: 280,
      image: "/api/placeholder/300/200",
    },
    {
      id: "cardiology",
      name: "Cardiology",
      icon: Stethoscope,
      description: "Cardiac monitoring and treatment equipment",
      productCount: 340,
      image: "/api/placeholder/300/200",
    },
    {
      id: "injection",
      name: "Injection & Infusion",
      icon: Syringe,
      description: "Syringes, IV equipment, and infusion systems",
      productCount: 560,
      image: "/api/placeholder/300/200",
    },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Roboto']">
            Explore our comprehensive range of medical equipment and supplies,
            carefully curated for healthcare professionals across India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#1E3E72]/20 cursor-pointer">
                  <CardContent className="p-0">
                    {/* Category Image */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-gradient-to-br from-[#f1f9ff] to-[#e8f4f8] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-16 h-16 text-[#1E3E72] opacity-60" />
                      </div>

                      {/* Product Count Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-[#1E3E72]">
                        {category.productCount}+ items
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#1E3E72]/10 rounded-lg flex items-center justify-center group-hover:bg-[#1E3E72] transition-colors duration-300">
                          <Icon className="w-5 h-5 text-[#1E3E72] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 font-['Montserrat']">
                          {category.name}
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {category.description}
                      </p>

                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:bg-[#1E3E72] group-hover:text-white transition-colors duration-300"
                        onClick={() => scrollToSection(`#${category.id}`)}
                      >
                        <span>Browse Products</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#f1f9ff] to-[#f0f9f7] rounded-2xl p-8 md:p-12 border border-gray-100">
            <h3 className="text-3xl font-bold text-[#1E3E72] mb-4 font-['Montserrat']">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our procurement specialists are here to help you find the exact
              equipment your facility needs. Get personalized recommendations
              and bulk pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection("#contact")}
                className="bg-[#F37336] hover:bg-[#e5642a] text-white px-8 py-3 text-lg font-semibold"
              >
                Request Custom Quote
              </Button>
              <Button
                variant="outline"
                className="border-[#1E3E72] text-[#1E3E72] hover:bg-[#1E3E72] hover:text-white px-8 py-3 text-lg font-semibold border-2"
              >
                Talk to Specialist
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
