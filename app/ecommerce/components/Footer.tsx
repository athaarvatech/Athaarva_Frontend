"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  MessageSquare,
  ArrowRight,
  Shield,
  Award,
  Clock,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Product Catalog", href: "#products" },
    { label: "Bulk Pricing", href: "#b2b-features" },
    { label: "Request Quote", href: "#contact" },
    { label: "Customer Support", href: "#contact" },
    { label: "Careers", href: "#careers" },
  ];

  const productCategories = [
    { label: "Surgical Instruments", href: "#surgical" },
    { label: "Diagnostic Equipment", href: "#diagnostics" },
    { label: "Emergency Care", href: "#emergency" },
    { label: "Hospital Furniture", href: "#furniture" },
    { label: "Disposables", href: "#disposables" },
    { label: "Medical Devices", href: "#devices" },
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "#terms" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Refund Policy", href: "#refunds" },
    { label: "Compliance", href: "#compliance" },
  ];

  return (
    <footer className="bg-[#1E3E72] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-['Montserrat']">
                Stay Updated with Healthcare Trends
              </h3>
              <p className="text-white/80 leading-relaxed">
                Get the latest updates on medical equipment, procurement best
                practices, and exclusive offers delivered to your inbox.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white"
              />
              <Button className="bg-[#F37336] hover:bg-[#e5642a] text-white px-6 py-2 font-medium whitespace-nowrap">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                <div className="w-6 h-6 bg-[#1E3E72] rounded-sm"></div>
              </div>
              <span className="text-2xl font-bold font-['Montserrat']">
                Atharva
              </span>
            </div>

            <p className="text-white/80 mb-6 leading-relaxed">
              India's leading B2B medical equipment and supply platform, serving
              healthcare institutions with certified products and reliable
              procurement solutions.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#14967f]" />
                <span className="text-sm text-white/80">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#14967f]" />
                <span className="text-sm text-white/80">FDA Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#14967f]" />
                <span className="text-sm text-white/80">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#14967f]" />
                <span className="text-sm text-white/80">500+ Hospitals</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white p-2"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white p-2"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white p-2"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-['Montserrat']">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-['Montserrat']">
              Product Categories
            </h4>
            <ul className="space-y-3">
              {productCategories.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(category.href)}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-['Montserrat']">
              Contact Information
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#14967f] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">
                    +91 80 4567 8900
                  </p>
                  <p className="text-white font-medium text-sm">
                    +91 80 4567 8901
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    Mon-Sat 9AM-6PM IST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#14967f] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">
                    sales@atharva.healthcare
                  </p>
                  <p className="text-white font-medium text-sm">
                    support@atharva.healthcare
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    24/7 email support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#14967f] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">
                    Electronic City, Bangalore
                  </p>
                  <p className="text-white font-medium text-sm">
                    Karnataka 560100, India
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    By appointment only
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h5 className="font-semibold text-sm mb-2 text-[#14967f]">
                Emergency Procurement Support
              </h5>
              <p className="text-white font-medium text-sm">+91 98765 43210</p>
              <p className="text-white/60 text-xs">
                Available 24/7 for urgent medical needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-white/60 text-sm">
                © 2025 Atharva Healthcare Solutions. All rights reserved.
              </p>
              <div className="flex gap-4">
                {legalLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/60 hover:text-white text-xs transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <p className="text-white/60 text-xs">
                Made in India 🇮🇳 for Healthcare Excellence
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <Separator className="my-6 bg-white/10" />
          <div className="text-center">
            <p className="text-white/50 text-xs leading-relaxed max-w-4xl mx-auto">
              All medical equipment and devices sold on this platform are
              subject to regulatory approvals. Atharva Healthcare Solutions acts
              as a marketplace connecting healthcare institutions with certified
              suppliers. Please consult with healthcare professionals before
              making any medical equipment purchases. Prices and availability
              are subject to change without notice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
