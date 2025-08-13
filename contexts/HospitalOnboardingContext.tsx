"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface HospitalOnboardingData {
  hospitalBasics: {
    hospitalName: string;
    legalName: string;
    sameAsHospitalName: boolean;
    type: 'clinic' | 'nursing_home' | 'hospital_4_16' | 'multi_specialty' | '';
    bedCapacity: number;
    primaryContact: string;
    officialEmail: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  branding: {
    logoUrl: string;
    logoFile: File | null;
    faviconUrl: string;
    faviconFile: File | null;
    backgroundImageUrl: string;
    backgroundImageFile: File | null;
    primaryColor: string;
    secondaryColor: string;
    buttonStyle: 'filled' | 'outline';
    accentStyle: 'subtle' | 'strong';
    typography: 'Inter' | 'Sora' | 'Manrope';
  };
  loginPage: {
    subdomain: string;
    customDomain: string;
    heading: string;
    welcomeText: string;
    supportEmail: string;
    supportPhone: string;
    termsUrl: string;
    privacyUrl: string;
  };
  adminSetup: {
    fullName: string;
    workEmail: string;
    phone: string;
    password: string;
    confirmPassword: string;
    twoFaPreference: 'email' | 'sms';
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
    hospitalName: '',
    legalName: '',
    sameAsHospitalName: true,
    type: '',
    bedCapacity: 16,
    primaryContact: '',
    officialEmail: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  },
  branding: {
    logoUrl: '',
    logoFile: null,
    faviconUrl: '',
    faviconFile: null,
    backgroundImageUrl: '',
    backgroundImageFile: null,
    primaryColor: '#007C7C',
    secondaryColor: '#20B2AA',
    buttonStyle: 'filled',
    accentStyle: 'subtle',
    typography: 'Inter',
  },
  loginPage: {
    subdomain: '',
    customDomain: '',
    heading: '',
    welcomeText: '',
    supportEmail: '',
    supportPhone: '',
    termsUrl: '',
    privacyUrl: '',
  },
  adminSetup: {
    fullName: '',
    workEmail: '',
    phone: '',
    password: '',
    confirmPassword: '',
    twoFaPreference: 'email',
  },
};

const HospitalOnboardingContext = createContext<HospitalOnboardingContextType | undefined>(undefined);

export const useHospitalOnboarding = () => {
  const context = useContext(HospitalOnboardingContext);
  if (!context) {
    throw new Error('useHospitalOnboarding must be used within a HospitalOnboardingProvider');
  }
  return context;
};

interface HospitalOnboardingProviderProps {
  children: ReactNode;
}

export const HospitalOnboardingProvider: React.FC<HospitalOnboardingProviderProps> = ({ children }) => {
  const [data, setData] = useState<HospitalOnboardingData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = <T extends keyof HospitalOnboardingData>(
    section: T,
    updates: Partial<HospitalOnboardingData[T]>
  ) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Hospital Basics
        const basics = data.hospitalBasics;
        return !!(
          basics.hospitalName &&
          (basics.sameAsHospitalName || basics.legalName) &&
          basics.type &&
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
          branding.buttonStyle &&
          branding.accentStyle &&
          branding.typography &&
          login.subdomain
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
  };

  const nextStep = () => {
    if (currentStep < 3 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('hospital-onboarding-data', JSON.stringify(data));
      localStorage.setItem('hospital-onboarding-step', currentStep.toString());
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('hospital-onboarding-data');
      const savedStep = localStorage.getItem('hospital-onboarding-step');
      
      if (savedData) {
        setData(JSON.parse(savedData));
      }
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    }
  };

  const resetData = () => {
    setData(initialData);
    setCurrentStep(1);
    localStorage.removeItem('hospital-onboarding-data');
    localStorage.removeItem('hospital-onboarding-step');
  };

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentStep]);

  // Load data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Auto-update login page heading when hospital name changes
  useEffect(() => {
    if (data.hospitalBasics.hospitalName && !data.loginPage.heading) {
      updateData('loginPage', {
        heading: `Welcome to ${data.hospitalBasics.hospitalName}`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.hospitalBasics.hospitalName]);

  // Auto-generate subdomain from hospital name
  useEffect(() => {
    if (data.hospitalBasics.hospitalName && !data.loginPage.subdomain) {
      const subdomain = data.hospitalBasics.hospitalName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      updateData('loginPage', { subdomain });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.hospitalBasics.hospitalName]);

  const value: HospitalOnboardingContextType = {
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
  };

  return (
    <HospitalOnboardingContext.Provider value={value}>
      {children}
    </HospitalOnboardingContext.Provider>
  );
};
