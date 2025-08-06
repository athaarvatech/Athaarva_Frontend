"use client";

import React from "react";

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Full screen layout for ecommerce pages - no sidebar, no topbar */}
      <main className="w-full min-h-screen">{children}</main>
    </div>
  );
}
