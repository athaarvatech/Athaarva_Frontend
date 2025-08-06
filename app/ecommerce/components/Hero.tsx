"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const partnerLogos = [
  //   { name: "AIIMS", width: "w-16" },
  //   { name: "Fortis", width: "w-20" },
  //   { name: "Apollo", width: "w-18" },
  //   { name: "Max Healthcare", width: "w-22" },
  //   { name: "Medanta", width: "w-19" },
  // ];

  return (
    <section className="relative bg-gradient-to-br from-[#f1f9ff] via-white to-[#f1f9ff] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#14967f]/5 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#1E3E72]/5 rounded-full"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#F37336]/5 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E3E72] mb-6 font-['Montserrat'] leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Unified{" "}
              <span className="text-[#14967f]">Procurement Platform</span> for
              Indian Healthcare
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl font-['Roboto'] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Procure certified medical equipment and supplies faster, smarter,
              and more cost-effectively. Built for hospitals, clinics, and
              diagnostic centers across India.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={() => scrollToSection("#products")}
                className="bg-[#F37336] hover:bg-[#e5642a] text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Shop Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() => scrollToSection("#b2b-features")}
                className="border-[#1E3E72] text-[#1E3E72] hover:bg-[#1E3E72] hover:text-white px-8 py-3 text-lg font-semibold rounded-lg border-2 transition-all duration-300"
              >
                For Enterprises
              </Button>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-12 h-12 bg-[#14967f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#14967f]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Certified Quality
                  </h3>
                  <p className="text-sm text-gray-600">ISO, CE, FDA approved</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-12 h-12 bg-[#1E3E72]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-[#1E3E72]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">Pan-India logistics</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-12 h-12 bg-[#F37336]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#F37336]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Expert Support
                  </h3>
                  <p className="text-sm text-gray-600">24/7 assistance</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                {/* Mock Dashboard Preview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1E3E72] rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm"></div>
                    </div>
                    <span className="font-semibold text-lg text-gray-900">
                      Dashboard Preview
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Current Orders
                      </span>
                      <span className="text-2xl font-bold text-[#1E3E72]">
                        247
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#14967f] h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f1f9ff] rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-[#1E3E72]">
                        ₹2.4L
                      </div>
                      <div className="text-xs text-gray-600">This Month</div>
                    </div>
                    <div className="bg-[#f0f9f7] rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-[#14967f]">
                        95%
                      </div>
                      <div className="text-xs text-gray-600">On Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Proof Bar */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-gray-600 mb-8 font-medium">
            Trusted by India&apos;s Leading Healthcare Institutions
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 opacity-60 hover:opacity-80 transition-opacity">
            {partnerLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className={`${logo.width} h-12 bg-gray-300 rounded-lg flex items-center justify-center`}
              >
                <span className="text-xs font-medium text-gray-600">
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
