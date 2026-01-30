"use client";

import dynamic from "next/dynamic";

const HospitalHomeClient = dynamic(() => import("./HospitalHomeClient"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
});

export default function HospitalHomePage() {
  return <HospitalHomeClient />;
}
