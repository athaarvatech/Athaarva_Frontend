"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useHospital } from "../HospitalContext";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { hospital: _hospital, theme, loading } = useHospital();

  useEffect(() => {
    // Check if user is authenticated as patient
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      router.push("/auth");
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.user_type !== "patient") {
        router.push("/auth");
      }
    } catch {
      router.push("/auth");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading patient portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        "--hospital-primary": theme.primaryColor,
        "--hospital-secondary": theme.secondaryColor,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
