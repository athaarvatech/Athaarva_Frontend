"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Linkedin,
  Twitter,
  Mail,
  Send,
  HeartPulse,
  ArrowRight,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinks {
  product: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
}

const Footer = () => {
  const links: FooterLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#" },
      { label: "Documentation", href: "#" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "HIPAA Compliance", href: "#" },
    ],
  };

  return (
    <>
      {/* Book a Call CTA Section */}
      <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
        {/* Light gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white" />

        {/* Animated orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Let&apos;s talk</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Book a 30-Minute{" "}
                <span className="text-blue-600">Discovery Call</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                Let&apos;s shape the future of healthcare together. See how
                Athaarva can transform your hospital operations.
              </p>
              <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg group">
                Schedule Call
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg"
            >
              <h3 className="text-slate-900 font-semibold mb-4">
                What to expect:
              </h3>
              <ul className="space-y-3">
                {[
                  "Personalized demo of Athaarva platform",
                  "Discussion of your hospital's specific needs",
                  "ROI calculation and implementation timeline",
                  "Q&A with our healthcare tech experts",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-xs">✓</span>
                    </div>
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="relative bg-slate-50 pt-16 pb-8 overflow-hidden border-t border-slate-200">
        {/* Large Faded ATHAARVA Text */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[100px] md:text-[140px] lg:text-[180px] font-display font-extrabold text-slate-200/50 tracking-tight select-none whitespace-nowrap">
            ATHAARVA
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          {/* Top Section */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <HeartPulse className="h-6 w-6 text-blue-600" />
                <span className="font-display text-xl font-bold text-slate-900">
                  ATHAARVA
                </span>
              </Link>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                AI-powered hospital management platform built for modern
                healthcare. Faster care. Fewer errors. Better outcomes.
              </p>

              {/* Newsletter */}
              <div className="mb-6">
                <p className="text-xs text-slate-500 mb-2">
                  Join our newsletter
                </p>
                <form className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pr-12 py-2 pl-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {[
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Mail, label: "Email" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">
                Product
              </h4>
              <ul className="space-y-3">
                {links.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">
                Company
              </h4>
              <ul className="space-y-3">
                {links.company.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">
                Legal
              </h4>
              <ul className="space-y-3">
                {links.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-2">
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-sm text-slate-600">
                    Greater Noida, India
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-sm text-slate-600">
                    +91 (placeholder)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-sm text-slate-600">
                    hello@athaarva.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Athaarva Intelligence. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Made with ❤️ for healthcare professionals
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
