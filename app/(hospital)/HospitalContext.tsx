"use client";

import { createContext, useContext } from "react";
import { HospitalProfile } from "@/lib/hospital-service";

interface HospitalContextType {
  hospital: HospitalProfile | null;
  subdomain: string | null;
  loading: boolean;
  error: string | null;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export const HospitalContext = createContext<HospitalContextType>({
  hospital: null,
  subdomain: null,
  loading: true,
  error: null,
  theme: {
    primaryColor: "#007C7C",
    secondaryColor: "#20B2AA",
    accentColor: "#0ea5e9",
  },
});

export const useHospital = () => useContext(HospitalContext);
