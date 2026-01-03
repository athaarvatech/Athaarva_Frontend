"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef, useMemo } from 'react';

export interface HospitalOnboardingData {
  hospitalBasics: {
    hospitalName: string;
    licenseNumber: string;
    bedCapacity: number;
    primaryContact: string;
    officialEmail: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  branding: {
    logoUrl: string;
    logoFile: File | null;
    backgroundImageUrl: string;
    backgroundImageFile: File | null;
    primaryColor: string;
    secondaryColor: string;
  };
  loginPage: {
    subdomain: string;
  };
  adminSetup: {
    fullName: string;
    workEmail: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
}

export interface HospitalOnboardingContextType {
  data: HospitalOnboardingData;
  currentStep: number;
  isStepValid: (step: number) => boolean;
  updateData: <T extends keyof HospitalOnboardingData>(
    section: T,
    updates: Partial<HospitalOnboardingData[T]>
  ) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetData: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const initialData: HospitalOnboardingData = {
  hospitalBasics: {
    hospitalName: "",
    licenseNumber: "",
    bedCapacity: 16,
    primaryContact: "",
    officialEmail: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  },
  branding: {
    logoUrl: "",
    logoFile: null,
    backgroundImageUrl: "",
    backgroundImageFile: null,
    primaryColor: "#007C7C",
    secondaryColor: "#20B2AA",
  },
  loginPage: {
    subdomain: "",
  },
  adminSetup: {
    fullName: "",
    workEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  },
};

const TOTAL_STEPS = 3;
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const normalizeColor = (value: unknown, fallback: string): string => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return HEX_COLOR_REGEX.test(trimmed) ? trimmed : fallback;
};

const normalizeSubdomain = (raw: unknown): string => {
  if (typeof raw !== "string") {
    return "";
  }

  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63);
};

const cloneInitialData = (): HospitalOnboardingData => ({
  hospitalBasics: { ...initialData.hospitalBasics },
  branding: { ...initialData.branding },
  loginPage: { ...initialData.loginPage },
  adminSetup: { ...initialData.adminSetup },
});

const normalizeOnboardingData = (
  saved?: Partial<HospitalOnboardingData>
): HospitalOnboardingData => {
  if (!saved) {
    return cloneInitialData();
  }

  const hospitalBasics = {
    ...initialData.hospitalBasics,
    ...(saved.hospitalBasics ?? {}),
  };

  if (saved?.hospitalBasics?.bedCapacity != null) {
    const parsedCapacity = Number(saved.hospitalBasics.bedCapacity);
    hospitalBasics.bedCapacity = Number.isFinite(parsedCapacity) && parsedCapacity > 0
      ? parsedCapacity
      : initialData.hospitalBasics.bedCapacity;
  }

  const branding = {
    ...initialData.branding,
    ...(saved.branding ?? {}),
  };

  branding.primaryColor = normalizeColor(
    saved?.branding?.primaryColor ?? branding.primaryColor,
    initialData.branding.primaryColor
  );
  branding.secondaryColor = normalizeColor(
    saved?.branding?.secondaryColor ?? branding.secondaryColor,
    initialData.branding.secondaryColor
  );
  branding.logoFile = null;
  branding.backgroundImageFile = null;

  const loginPage = {
    ...initialData.loginPage,
    ...(saved.loginPage ?? {}),
  };

  loginPage.subdomain = normalizeSubdomain(loginPage.subdomain);

  const adminSetup = {
    ...initialData.adminSetup,
    ...(saved.adminSetup ?? {}),
  };

  return {
    hospitalBasics,
    branding,
    loginPage,
    adminSetup,
  };
};

const serializeOnboardingData = (
  data: HospitalOnboardingData
): HospitalOnboardingData => {
  const {
    logoFile: _logoFile,
    backgroundImageFile: _backgroundImageFile,
    primaryColor,
    secondaryColor,
    ...brandingRest
  } = data.branding;

  return {
    hospitalBasics: { ...data.hospitalBasics },
    branding: {
      ...brandingRest,
      primaryColor: normalizeColor(primaryColor, initialData.branding.primaryColor),
      secondaryColor: normalizeColor(secondaryColor, initialData.branding.secondaryColor),
      logoFile: null,
      backgroundImageFile: null,
    },
    loginPage: {
      ...data.loginPage,
      subdomain: normalizeSubdomain(data.loginPage.subdomain),
    },
    adminSetup: { ...data.adminSetup },
  };
};

const HospitalOnboardingContext = createContext<
  HospitalOnboardingContextType | undefined
>(undefined);

export const useHospitalOnboarding = () => {
  const context = useContext(HospitalOnboardingContext);
  if (!context) {
    throw new Error(
      "useHospitalOnboarding must be used within a HospitalOnboardingProvider"
    );
  }
  return context;
};

interface HospitalOnboardingProviderProps {
  children: ReactNode;
}

export const HospitalOnboardingProvider: React.FC<
  HospitalOnboardingProviderProps
> = ({ children }) => {
  const [data, setData] = useState<HospitalOnboardingData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const subdomainGeneratedRef = useRef(false);

  const updateData = useCallback(<T extends keyof HospitalOnboardingData>(
    section: T,
    updates: Partial<HospitalOnboardingData[T]>
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  }, []);

  const isStepValid = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // Hospital Basics
        const basics = data.hospitalBasics;
        return !!(
          basics.hospitalName &&
          basics.licenseNumber &&
          basics.bedCapacity > 0 &&
          basics.primaryContact &&
          basics.officialEmail &&
          basics.phone &&
          basics.address &&
          basics.city &&
          basics.state &&
          basics.pincode
        );
      case 2: // Branding & Subdomain
        const branding = data.branding;
        const login = data.loginPage;
        return !!(
          branding.primaryColor &&
          branding.secondaryColor &&
          login.subdomain &&
          login.subdomain.length >= 3
        );
      case 3: // Admin Setup
        const admin = data.adminSetup;
        return !!(
          admin.fullName &&
          admin.workEmail &&
          admin.phone &&
          admin.password &&
          admin.confirmPassword &&
          admin.password === admin.confirmPassword
        );
      default:
        return false;
    }
  }, [data]);

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isStepValid]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const saveToLocalStorage = useCallback(() => {
    try {
      const serialized = serializeOnboardingData(data);
      localStorage.setItem("hospital-onboarding-data", JSON.stringify(serialized));
      localStorage.setItem("hospital-onboarding-step", currentStep.toString());
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
  }, [data, currentStep]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem("hospital-onboarding-data");
      const savedStep = localStorage.getItem("hospital-onboarding-step");

      if (savedData) {
        const parsed = JSON.parse(savedData) as Partial<HospitalOnboardingData>;
        setData(normalizeOnboardingData(parsed));
      }
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (!Number.isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS) {
          setCurrentStep(parsedStep);
        }
      }
    } catch (error) {
      console.error("Failed to load onboarding data:", error);
    }
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
    setCurrentStep(1);
    subdomainGeneratedRef.current = false;
    localStorage.removeItem('hospital-onboarding-data');
    localStorage.removeItem('hospital-onboarding-step');
  }, []);

  // Auto-save to localStorage whenever data changes (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [data, currentStep, saveToLocalStorage]);

  // Load data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Auto-generate subdomain from hospital name (only once)
  useEffect(() => {
    if (data.hospitalBasics.hospitalName && !data.loginPage.subdomain && !subdomainGeneratedRef.current) {
      const subdomain = data.hospitalBasics.hospitalName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      updateData('loginPage', { subdomain });
      subdomainGeneratedRef.current = true;
    }
  }, [data.hospitalBasics.hospitalName, data.loginPage.subdomain, updateData]);

  const value: HospitalOnboardingContextType = useMemo(() => ({
    data,
    currentStep,
    isStepValid,
    updateData,
    setCurrentStep,
    nextStep,
    previousStep,
    resetData,
    saveToLocalStorage,
    loadFromLocalStorage,
  }), [
    data,
    currentStep,
    isStepValid,
    updateData,
    nextStep,
    previousStep,
    resetData,
    saveToLocalStorage,
    loadFromLocalStorage,
  ]);

  return (
    <HospitalOnboardingContext.Provider value={value}>
      {children}
    </HospitalOnboardingContext.Provider>
  );
};
