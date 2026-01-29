import React from "react";
import { PharmacyCommandPalette } from "@/components/pharmacy/command-palette";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
