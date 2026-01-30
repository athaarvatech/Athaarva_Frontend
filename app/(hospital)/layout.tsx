"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const HospitalLayoutClient = dynamic(() => import("./HospitalLayoutClient"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
});

export default function HospitalSubdomainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <HospitalLayoutClient>{children}</HospitalLayoutClient>;
}
