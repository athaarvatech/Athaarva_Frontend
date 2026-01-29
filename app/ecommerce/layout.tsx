"use client";

import React from "react";
import { SearchProvider } from "./contexts/SearchContext";

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-white">
        {/* Full screen layout for ecommerce pages - no sidebar, no topbar */}
        <main className="w-full min-h-screen">{children}</main>
      </div>
    </SearchProvider>
  );
}
