"use client";

import React from "react";
import Link from "next/link";
import { Pill, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { PharmacyCommandPalette } from "@/components/pharmacy/command-palette";
import { SmartAlertHub } from "@/components/pharmacy/smart-alert-hub";
import { PharmacyAlertProvider } from "@/contexts/PharmacyAlertContext";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PharmacyAlertProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Global Sonner Toaster */}
        <Toaster richColors closeButton />

        {/* Command Palette - Global Search */}
        <PharmacyCommandPalette />

      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/pharmacy"
                className="flex items-center gap-2 text-gray-600 hover:text-healthcare-primary transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-healthcare-primary rounded-lg flex items-center justify-center">
                  <Pill className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Pharmacy</h1>
                  <p className="text-xs text-gray-500">Inventory Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Smart Alert Hub - Bell Icon */}
              <SmartAlertHub />

              {/* Search Command Palette Trigger */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={() => {
                  // Trigger command palette
                  const event = new KeyboardEvent("keydown", {
                    key: "k",
                    metaKey: true,
                    bubbles: true,
                  });
                  document.dispatchEvent(event);
                }}
              >
                <Search className="h-4 w-4" />
                Search
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
              <Link href="/pharmacy">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>© 2026 Athaarva Healthcare. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </PharmacyAlertProvider>
  );
}
