"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Clock,
  FileText,
  Settings,
  Award,
  Truck,
  PhoneCall,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function B2BValueBlock() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Users,
      title: "Bulk Pricing & Volume Discounts",
      description:
        "Special pricing tiers for hospitals and large clinics with tiered volume discounts.",
      benefit: "Save up to 30% on large orders",
    },
    {
      icon: FileText,
      title: "Request for Quotation (RFQ)",
      description:
        "Submit custom requirements and receive competitive quotes from verified suppliers.",
      benefit: "Custom pricing for specific needs",
    },
    {
      icon: Clock,
      title: "Real-time Order Tracking",
      description:
        "Track your orders from procurement to delivery with live status updates.",
      benefit: "Complete visibility & control",
    },
    {
      icon: Settings,
      title: "Multi-user Account Management",
      description:
        "Create team accounts with role-based permissions for different departments.",
      benefit: "Streamlined procurement workflow",
    },
  ];

  const certifications = [
    { name: "ISO 13485", description: "Medical Device Quality" },
    { name: "CE Marking", description: "European Conformity" },
    { name: "FDA Approved", description: "US Food & Drug Admin" },
    { name: "BIS Certified", description: "Bureau of Indian Standards" },
    { name: "WHO-GMP", description: "Good Manufacturing Practice" },
  ];

  const stats = [
    { number: "500+", label: "Healthcare Institutions", icon: Users },
    { number: "20,000+", label: "Medical Products", icon: Settings },
    { number: "95%", label: "On-time Delivery", icon: Truck },
    { number: "24/7", label: "Expert Support", icon: PhoneCall },
  ];

  return (
    <section id="b2b-features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
            Why Choose Atharva?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Roboto']">
            Built specifically for healthcare procurement teams, our platform
            combines enterprise-grade features with the simplicity your team
            needs to get work done efficiently.
          </p>
        </motion.div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-gray-200 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#1E3E72]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E3E72] transition-colors duration-300">
                        <Icon className="w-7 h-7 text-[#1E3E72] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 font-['Montserrat']">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {feature.description}
                        </p>
                        <Badge className="bg-[#14967f]/10 text-[#14967f] hover:bg-[#14967f]/10">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {feature.benefit}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#1E3E72] to-[#14967f] rounded-2xl p-8 md:p-12 mb-16 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat']">
              Trusted by Healthcare Leaders
            </h3>
            <p className="text-xl opacity-90">
              Numbers that speak to our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 font-['Montserrat']">
                    {stat.number}
                  </div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold text-[#1E3E72] mb-8 font-['Montserrat']">
            Certified Quality & Compliance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-[#1E3E72]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-[#1E3E72]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {cert.name}
                </h4>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-[#f1f9ff] to-[#f0f9f7] rounded-2xl p-8 md:p-12 border border-gray-100"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
            Ready to Transform Your Procurement?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join hundreds of healthcare institutions already saving time and
            money with Atharva. Get started with a personalized demo or speak
            with our procurement specialists.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="bg-[#F37336] hover:bg-[#e5642a] text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("#contact")}
              className="border-[#1E3E72] text-[#1E3E72] hover:bg-[#1E3E72] hover:text-white px-8 py-4 text-lg font-semibold border-2"
            >
              Talk to Specialist
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#14967f]" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#14967f]" />
              <span>Quick Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#14967f]" />
              <span>Dedicated Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
