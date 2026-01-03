"use client";

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Full screen layout for auth pages */}
      <main className="w-full h-screen">
        {children}
      </main>
    </div>
  );
}
