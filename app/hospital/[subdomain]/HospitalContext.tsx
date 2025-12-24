"use client";

import { createContext, useContext } from "react";
import { HospitalProfile } from "@/lib/hospital-service";

export interface HospitalContextType {
  hospital: HospitalProfile | null;
  loading: boolean;
  error: string | null;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export const HospitalContext = createContext<HospitalContextType>({
  hospital: null,
  loading: true,
  error: null,
  theme: {
    primaryColor: "#007C7C",
    secondaryColor: "#20B2AA",
  },
});

export const useHospital = () => useContext(HospitalContext);
