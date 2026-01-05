"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    { label: "Solutions", href: "/features" },
    { label: "Features", href: "/features" },
    { label: "Product", href: "/#pricing" },
    { label: "Pricing", href: "/#pricing" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string): boolean => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <div
        className={`max-w-4xl mx-auto transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/20"
            : "bg-white/80 backdrop-blur-xl"
        } rounded-full border border-slate-200/50`}
      >
        <div className="px-4 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-display font-bold text-slate-900 tracking-tight">
              Athaarva
            </span>
          </Link>

          {/* Desktop Navigation - Centered with pill background */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-slate-100/80 rounded-full px-1 py-1">
              {navLinks.map((link) =>
                link.href.startsWith("/#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full transition-all duration-200 text-sm font-medium ${
                      isActive(link.href)
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* Desktop CTA - Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="group inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800"
            >
              Request Demo
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mt-2 mx-auto max-w-4xl bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl overflow-hidden shadow-xl"
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive(link.href)
                      ? "text-slate-900 bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="h-px bg-slate-100 my-2" />
            <Link
              href="/auth/login"
              className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="mt-2 w-full rounded-full bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Request Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
