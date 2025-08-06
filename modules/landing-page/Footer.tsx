"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import MedicalLogo from "@/components/ui/MedicalLogo";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  ArrowUp
} from "lucide-react";

function FooterFixed() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-healthcare-dark to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-healthcare-primary rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-healthcare-teal rounded-full translate-x-36 translate-y-36"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1">
                    <MedicalLogo width={32} height={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Atharva</h3>
                    <p className="text-sm text-gray-400">Holistic Healthcare, Delivered.</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Empowering small hospitals and clinics with AI-driven healthcare management 
                  solutions that improve patient care and operational efficiency.
                </p>
                
                {/* Social Links */}
                <div className="flex space-x-4">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 rounded-lg hover:text-blue-400 transition-all duration-300 hover:bg-gray-700"
                  >
                    <Facebook className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 rounded-lg hover:text-sky-400 transition-all duration-300 hover:bg-gray-700"
                  >
                    <Twitter className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 rounded-lg hover:text-blue-500 transition-all duration-300 hover:bg-gray-700"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 rounded-lg hover:text-red-500 transition-all duration-300 hover:bg-gray-700"
                  >
                    <Youtube className="w-5 h-5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Product Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      API Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Mobile Apps
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Security
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Updates
                    </a>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Company Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Case Studies
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Partners
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Press Kit
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-healthcare-primary transition-colors duration-300">
                      Contact
                    </a>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Newsletter & Contact */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h4 className="font-bold text-lg mb-6 text-white">Stay Updated</h4>
                <p className="text-gray-400 mb-6">
                  Get the latest healthcare technology insights and product updates.
                </p>
                
                {/* Newsletter Form */}
                <form onSubmit={handleNewsletterSubmit} className="mb-8">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:border-healthcare-primary transition-colors duration-300"
                      required
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-healthcare-primary to-healthcare-teal rounded-r-xl hover:shadow-lg hover:shadow-healthcare-primary/25 transition-all duration-300"
                    >
                      {isSubmitted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </form>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="w-5 h-5 text-healthcare-primary" />
                    <span>hello@healthcare.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Phone className="w-5 h-5 text-healthcare-primary" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-healthcare-primary" />
                    <span>Mumbai, India</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center md:justify-start space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  HIPAA Compliance
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Cookie Policy
                </a>
              </div>

              {/* Copyright */}
              <div className="flex items-center space-x-4">
                <p className="text-gray-400 text-sm">
                  © 2025 Atharva. All rights reserved.
                </p>
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-healthcare-primary rounded-lg hover:bg-healthcare-teal transition-colors duration-300"
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            ✅ Thank you for subscribing!
          </motion.div>
        )}
      </div>
    </footer>
  );
}

export default FooterFixed;
