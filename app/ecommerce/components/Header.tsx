"use client";

import React, { useState } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "../contexts/CartContext";
import SearchDropdown from "./SearchDropdown";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();

  const navigationItems = [
    { label: "Products", href: "#products" },
    { label: "Solutions", href: "#solutions" },
    { label: "Brands", href: "#brands" },
    { label: "Resources", href: "#resources" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-[#1E3E72] rounded-lg flex items-center justify-center mr-3">
                <div className="w-5 h-5 bg-white rounded-sm"></div>
              </div>
              <span className="text-2xl font-bold text-[#1E3E72] font-['Montserrat']">
                Atharva
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-[#1E3E72] px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection("#contact")}
                className="bg-[#F37336] hover:bg-[#e5642a] text-white px-6 py-2 rounded-lg font-medium"
              >
                Request Quote
              </Button>
            </div>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:block">
              <SearchDropdown 
                placeholder="Search by product, brand, or SKU..."
                className="w-80"
              />
            </div>

            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCart}
              className="relative border-gray-300 hover:border-[#1E3E72] hover:text-[#1E3E72]"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#F37336] hover:bg-[#F37336] text-white text-xs px-1 min-w-[20px] h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Account Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-[#1E3E72] hover:text-[#1E3E72]"
                >
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Sign In</DropdownMenuItem>
                <DropdownMenuItem>Create Account</DropdownMenuItem>
                <DropdownMenuItem>My Orders</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden border-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="mb-3">
                <SearchDropdown 
                  placeholder="Search products..."
                  className="w-full"
                  onSelect={() => setIsMobileMenuOpen(false)}
                />
              </div>

              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-[#1E3E72] hover:bg-gray-50"
                >
                  {item.label}
                </button>
              ))}

              <Button
                onClick={() => scrollToSection("#contact")}
                className="w-full mt-3 bg-[#F37336] hover:bg-[#e5642a] text-white"
              >
                Request Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
