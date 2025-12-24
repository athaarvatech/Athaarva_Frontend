"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
  useMemo,
} from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TemplateData {
  id: string;
  name: string;
  version: string;
  preview_snapshot_url: string;
  thumbnail_url: string;
  description: string;
  supported_modules: string[];
  recommended_for: string[];
  locked?: boolean;
}

// Extended interface to include customized blueprint data from the Canvas editor
export interface CustomizedTemplateData extends TemplateData {
  customizedBlueprint?: {
    id: string;
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      primaryCta: { label: string; href: string };
      secondaryCta: { label: string; href: string };
      stats: Array<{ label: string; value: string }>;
      heroImageAlt: string;
    };
    palette: {
      background: string;
      surface: string;
      accent: string;
      accentMuted: string;
      text: string;
      textMuted: string;
      gradient: string;
    };
    typography: {
      heading: string;
      body: string;
    };
    specialties: Array<{ icon: string; title: string; description: string }>;
    differentiators: Array<{ title: string; description: string }>;
    doctors: Array<{
      name: string;
      specialty: string;
      description: string;
      mediaLabel: string;
    }>;
    testimonials: Array<{
      quote: string;
      patient: string;
      procedure: string;
    }>;
    facilityHighlights: Array<{ title: string; copy: string }>;
    programs: Array<{ title: string; meta: string; description: string }>;
    footer: {
      contact: {
        phone: string;
        email: string;
        location: string;
      };
      quickLinks: string[];
    };
  };
}

export interface LocationData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  geo: { lat: number; lng: number } | null;
  contact_phone: string;
  contact_email: string;
  services: string[];
  is_headquarters: boolean;
  emergency_hotline?: string;
}

export interface ServiceData {
  id: string;
  name: string;
  department: string;
  description: string;
  consultation_types: ("in-person" | "telehealth" | "home")[];
  fee_range: { min: number; max: number; currency: string };
  location_ids: string[];
  specialty_ids: string[];
}

export interface LeadershipCardData {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  credentials: string;
  profile_photo_url: string;
  profile_photo_file: File | null;
  linkedin_url?: string;
}

export interface TeamMemberData {
  id: string;
  full_name: string;
  role: string;
  email: string;
  phone: string;
  status: "pending" | "invited" | "active";
  scope_hint?: string;
  notes?: string;
}

export interface DocumentData {
  id: string;
  type: string;
  url: string;
  filename: string;
  size: number;
  expires_at?: string;
  status: "uploaded" | "pending" | "expired";
  uploaded_at: string;
  file?: File;
}

export interface TestimonialData {
  id: string;
  patient_name: string;
  content: string;
  rating: number;
  consent_file_url: string;
  consent_file?: File;
  date: string;
}

export interface ActivityLogEntry {
  id: string;
  step_id: string;
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export interface CollaboratorData {
  id: string;
  email: string;
  name: string;
  granted_steps: number[];
  status: "pending" | "active";
}

export interface HospitalOnboardingData {
  // Step 0: Template Selection & Invitation Recap
  invitation: {
    token: string;
    email: string;
    expires_at: string;
    invitation_id?: number;
  };
  template: {
    selected_template: CustomizedTemplateData | null;
    version_locked: boolean;
  };

  // Step 1: Organization Profile
  organizationProfile: {
    legal_name: string;
    parent_entity: string;
    registration_number: string;
    gst_number: string;
    pan_number: string;
    established_date: string;
    ownership_model: string;
    timezone: string;
    locale: string;
  };

  // Step 2: Locations & Contacts
  locations: LocationData[];

  // Step 3: Branding & Theme Studio
  branding: {
    logo_url: string;
    logo_file: File | null;
    hero_asset_url: string;
    hero_asset_file: File | null;
    favicon_url: string;
    favicon_file: File | null;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
    };
    typography: {
      heading_font: string;
      body_font: string;
    };
    accessibility_score: number;
  };

  // Step 4: Site Content
  siteContent: {
    hero: {
      headline: string;
      subtext: string;
      cta_text: string;
      cta_url: string;
    };
    services_highlights: {
      id: string;
      icon: string;
      title: string;
      description: string;
    }[];
    specialty_blurbs: { id: string; specialty: string; description: string }[];
    testimonials: {
      id: string;
      patient_name: string;
      testimonial: string;
      rating: number;
      date: string;
    }[];
    faq: { id: string; question: string; answer: string }[];
    blog_teasers: {
      id: string;
      title: string;
      excerpt: string;
      publish_date: string;
      author: string;
    }[];
  };

  // Step 5: Clinical Services & Pricing
  servicesPricing: {
    departments: string[];
    procedures: string[];
    consultation_types: ("in-person" | "telehealth" | "home")[];
    services: ServiceData[];
    insurance_partnerships: string[];
  };

  // Step 6: Leadership & Team
  leadershipTeam: {
    leadership_cards: LeadershipCardData[];
    staffing_plan: {
      id: string;
      role: string;
      count: number;
      status: string;
    }[];
  };

  // Step 7: Operational Policies
  operationalPolicies: {
    operating_hours: {
      location_id: string;
      hours: {
        id: string;
        day: string;
        open: string;
        close: string;
        is_closed?: boolean;
      }[];
    }[];
    appointment_lead_time_hours: number;
    cancellation_policy: string;
    no_show_policy: string;
    telehealth_sop: string;
    patient_onboarding_steps: string[];
  };

  // Step 8: Compliance & Documentation
  compliance: {
    documents: DocumentData[];
    dpo_contact: { name: string; email: string; phone: string };
    consent_templates: { id: string; type: string; url: string; file?: File }[];
  };

  // Step 9: Integrations & Preferences
  integrations: {
    messaging_channels: ("sms" | "email" | "whatsapp")[];
    analytics_tags: { id: string; platform: string; tag_id: string }[];
    llm_opt_in: boolean;
    telehealth_provider: string;
    patient_portal_modules: string[];
  };

  // Step 10: Admin & Staff Invitations
  adminTeam: TeamMemberData[];

  // Step 11: Review & Submission
  review: {
    completion_status: { [step: string]: boolean };
    publication_plan: {
      launch_mode: "immediate" | "scheduled" | "site_only";
      scheduled_at?: string;
    };
    acknowledgements: {
      terms: boolean;
      privacy: boolean;
      dpa: boolean;
      ai_usage: boolean;
    };
  };

  // Metadata
  metadata: {
    autosave_version: number;
    collaboration_notes: string;
    last_saved_at?: string;
  };
}

export interface HospitalOnboardingContextType {
  data: HospitalOnboardingData;
  currentStep: number;
  activityLog: ActivityLogEntry[];
  collaborators: CollaboratorData[];
  isStepValid: (step: number) => boolean;
  getStepCompletion: () => { [step: number]: boolean };
  updateData: <T extends keyof HospitalOnboardingData>(
    section: T,
    updates:
      | Partial<HospitalOnboardingData[T]>
      | ((
          prev: HospitalOnboardingData[T]
        ) => Partial<HospitalOnboardingData[T]>)
  ) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetData: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  addActivityLog: (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => void;
  addCollaborator: (collaborator: Omit<CollaboratorData, "id">) => void;
  removeCollaborator: (id: string) => void;
  buildSubmissionPayload: () => any;
}

// ============================================================================
// INITIAL DATA
// ============================================================================

const initialData: HospitalOnboardingData = {
  invitation: {
    token: "",
    email: "",
    expires_at: "",
  },
  template: {
    selected_template: null,
    version_locked: false,
  },
  organizationProfile: {
    legal_name: "",
    parent_entity: "",
    registration_number: "",
    gst_number: "",
    pan_number: "",
    established_date: "",
    ownership_model: "",
    timezone: "Asia/Kolkata",
    locale: "en-IN",
  },
  locations: [],
  branding: {
    logo_url: "",
    logo_file: null,
    hero_asset_url: "",
    hero_asset_file: null,
    favicon_url: "",
    favicon_file: null,
    colors: {
      primary: "#007C7C",
      secondary: "#20B2AA",
      accent: "#10B981",
      neutral: "#6B7280",
    },
    typography: {
      heading_font: "Inter",
      body_font: "Inter",
    },
    accessibility_score: 0,
  },
  siteContent: {
    hero: {
      headline: "",
      subtext: "",
      cta_text: "Book Appointment",
      cta_url: "/appointments",
    },
    services_highlights: [],
    specialty_blurbs: [],
    testimonials: [],
    faq: [],
    blog_teasers: [],
  },
  servicesPricing: {
    departments: [],
    procedures: [],
    consultation_types: [],
    services: [],
    insurance_partnerships: [],
  },
  leadershipTeam: {
    leadership_cards: [],
    staffing_plan: [],
  },
  operationalPolicies: {
    operating_hours: [],
    appointment_lead_time_hours: 24,
    cancellation_policy: "",
    no_show_policy: "",
    telehealth_sop: "",
    patient_onboarding_steps: [],
  },
  compliance: {
    documents: [],
    dpo_contact: { name: "", email: "", phone: "" },
    consent_templates: [],
  },
  integrations: {
    messaging_channels: [],
    analytics_tags: [],
    llm_opt_in: false,
    telehealth_provider: "",
    patient_portal_modules: [],
  },
  adminTeam: [],
  review: {
    completion_status: {},
    publication_plan: {
      launch_mode: "immediate",
    },
    acknowledgements: {
      terms: false,
      privacy: false,
      dpa: false,
      ai_usage: false,
    },
  },
  metadata: {
    autosave_version: 0,
    collaboration_notes: "",
  },
};

const TOTAL_STEPS = 12; // 0-11

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string): boolean => {
  return /^\+?[\d\s-()]{10,}$/.test(phone);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

// ============================================================================
// CONTEXT
// ============================================================================

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
  const [currentStep, setCurrentStep] = useState(0);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorData[]>([]);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // UPDATE DATA
  // ============================================================================

  const updateData = useCallback(
    <T extends keyof HospitalOnboardingData>(
      section: T,
      updates:
        | Partial<HospitalOnboardingData[T]>
        | ((
            prev: HospitalOnboardingData[T]
          ) => Partial<HospitalOnboardingData[T]>)
    ) => {
      setData((prev) => {
        const updatedSection =
          typeof updates === "function"
            ? { ...prev[section], ...updates(prev[section]) }
            : { ...prev[section], ...updates };

        return {
          ...prev,
          [section]: updatedSection,
          metadata: {
            ...prev.metadata,
            autosave_version: prev.metadata.autosave_version + 1,
            last_saved_at: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  // ============================================================================
  // STEP VALIDATION
  // ============================================================================

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 0: // Template Selection
          return !!data.template.selected_template;

        case 1: // Organization Profile
          const org = data.organizationProfile;
          return !!(
            org.legal_name &&
            org.registration_number &&
            org.gst_number &&
            org.pan_number &&
            org.established_date &&
            org.ownership_model &&
            org.timezone &&
            org.locale
          );

        case 2: // Locations & Contacts
          return (
            data.locations.length > 0 &&
            data.locations.every(
              (loc) =>
                loc.name &&
                loc.address &&
                loc.city &&
                loc.state &&
                loc.pincode &&
                isValidPhone(loc.contact_phone) &&
                isValidEmail(loc.contact_email)
            )
          );

        case 3: // Branding & Theme Studio
          const branding = data.branding;
          return !!(
            (branding.logo_url || branding.logo_file) &&
            isValidHexColor(branding.colors.primary) &&
            isValidHexColor(branding.colors.secondary) &&
            isValidHexColor(branding.colors.accent) &&
            isValidHexColor(branding.colors.neutral) &&
            branding.typography.heading_font &&
            branding.typography.body_font &&
            branding.accessibility_score >= 4.5
          );

        case 4: // Site Content
          const content = data.siteContent;
          return !!(
            content.hero.headline &&
            content.hero.subtext &&
            content.hero.cta_text &&
            content.services_highlights.length >= 3 &&
            content.specialty_blurbs.length >= 2
          );

        case 5: // Services & Pricing
          const services = data.servicesPricing;
          return !!(
            services.departments.length > 0 &&
            services.consultation_types.length > 0 &&
            services.services.length > 0
          );

        case 6: // Leadership & Team
          return data.leadershipTeam.leadership_cards.length >= 1;

        case 7: // Operational Policies
          const policies = data.operationalPolicies;
          return !!(
            policies.operating_hours.length > 0 &&
            policies.appointment_lead_time_hours > 0 &&
            policies.cancellation_policy &&
            policies.patient_onboarding_steps.length > 0
          );

        case 8: // Compliance & Documentation
          const compliance = data.compliance;
          return !!(
            compliance.documents.length > 0 &&
            compliance.dpo_contact.name &&
            isValidEmail(compliance.dpo_contact.email) &&
            isValidPhone(compliance.dpo_contact.phone)
          );

        case 9: // Integrations & Preferences
          return data.integrations.messaging_channels.length > 0;

        case 10: // Admin Team
          return (
            data.adminTeam.length > 0 &&
            data.adminTeam.every(
              (member) =>
                member.full_name &&
                isValidEmail(member.email) &&
                isValidPhone(member.phone)
            )
          );

        case 11: // Review & Submission
          const review = data.review;
          return !!(
            review.acknowledgements.terms &&
            review.acknowledgements.privacy &&
            review.acknowledgements.dpa &&
            review.publication_plan.launch_mode
          );

        default:
          return false;
      }
    },
    [data]
  );

  // ============================================================================
  // COMPLETION STATUS
  // ============================================================================

  const getStepCompletion = useCallback((): { [step: number]: boolean } => {
    const completion: { [step: number]: boolean } = {};
    for (let i = 0; i <= TOTAL_STEPS - 1; i++) {
      completion[i] = isStepValid(i);
    }
    return completion;
  }, [isStepValid]);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1 && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isStepValid]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // ============================================================================
  // ACTIVITY LOG
  // ============================================================================

  const addActivityLog = useCallback(
    (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => {
      const newEntry: ActivityLogEntry = {
        ...entry,
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };
      setActivityLog((prev) => [newEntry, ...prev]);
    },
    []
  );

  // ============================================================================
  // COLLABORATORS
  // ============================================================================

  const addCollaborator = useCallback(
    (collaborator: Omit<CollaboratorData, "id">) => {
      const newCollaborator: CollaboratorData = {
        ...collaborator,
        id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      setCollaborators((prev) => [...prev, newCollaborator]);
    },
    []
  );

  const removeCollaborator = useCallback((id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  const saveToLocalStorage = useCallback(() => {
    try {
      const invitationId = data.invitation.invitation_id || "default";
      const storageKey = `hospital-onboarding-${invitationId}`;

      // Clone and remove files before serialization
      const dataToSave = JSON.parse(
        JSON.stringify(data, (key, value) => {
          // Skip File objects
          if (value instanceof File) return null;
          return value;
        })
      );

      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      localStorage.setItem(`${storageKey}-step`, currentStep.toString());
      localStorage.setItem(
        `${storageKey}-activity`,
        JSON.stringify(activityLog.slice(0, 50))
      ); // Keep last 50 entries
      localStorage.setItem(
        `${storageKey}-collaborators`,
        JSON.stringify(collaborators)
      );
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
  }, [data, currentStep, activityLog, collaborators]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      // Try to load based on token or use default
      const invitationId = data.invitation.invitation_id || "default";
      const storageKey = `hospital-onboarding-${invitationId}`;

      const savedData = localStorage.getItem(storageKey);
      const savedStep = localStorage.getItem(`${storageKey}-step`);
      const savedActivity = localStorage.getItem(`${storageKey}-activity`);
      const savedCollaborators = localStorage.getItem(
        `${storageKey}-collaborators`
      );

      if (savedData) {
        const parsed = JSON.parse(savedData) as HospitalOnboardingData;
        // Ensure arrays are properly initialized (for backward compatibility with old localStorage data)
        setData({
          ...initialData,
          ...parsed,
          locations: Array.isArray(parsed.locations) ? parsed.locations : [],
          siteContent: {
            ...initialData.siteContent,
            ...parsed.siteContent,
            testimonials: Array.isArray(parsed.siteContent?.testimonials)
              ? parsed.siteContent.testimonials
              : [],
          },
          leadershipTeam: {
            ...initialData.leadershipTeam,
            ...parsed.leadershipTeam,
            leadership_cards: Array.isArray(
              parsed.leadershipTeam?.leadership_cards
            )
              ? parsed.leadershipTeam.leadership_cards
              : [],
          },
          compliance: {
            ...initialData.compliance,
            ...parsed.compliance,
            documents: Array.isArray(parsed.compliance?.documents)
              ? parsed.compliance.documents
              : [],
            consent_templates: Array.isArray(
              parsed.compliance?.consent_templates
            )
              ? parsed.compliance.consent_templates
              : [],
          },
        });
      }
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (
          !Number.isNaN(parsedStep) &&
          parsedStep >= 0 &&
          parsedStep < TOTAL_STEPS
        ) {
          setCurrentStep(parsedStep);
        }
      }
      if (savedActivity) {
        setActivityLog(JSON.parse(savedActivity));
      }
      if (savedCollaborators) {
        setCollaborators(JSON.parse(savedCollaborators));
      }
    } catch (error) {
      console.error("Failed to load onboarding data:", error);
    }
  }, [data.invitation.invitation_id]);

  const resetData = useCallback(() => {
    setData(initialData);
    setCurrentStep(0);
    setActivityLog([]);
    setCollaborators([]);

    const invitationId = data.invitation.invitation_id || "default";
    const storageKey = `hospital-onboarding-${invitationId}`;
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}-step`);
    localStorage.removeItem(`${storageKey}-activity`);
    localStorage.removeItem(`${storageKey}-collaborators`);
  }, [data.invitation.invitation_id]);

  // ============================================================================
  // SUBMISSION PAYLOAD
  // ============================================================================

  const buildSubmissionPayload = useCallback(() => {
    // Ensure arrays are safely accessed
    const locations = Array.isArray(data.locations) ? data.locations : [];
    const testimonials = Array.isArray(data.siteContent?.testimonials)
      ? data.siteContent.testimonials
      : [];
    const leadershipCards = Array.isArray(data.leadershipTeam?.leadership_cards)
      ? data.leadershipTeam.leadership_cards
      : [];
    const complianceDocs = Array.isArray(data.compliance?.documents)
      ? data.compliance.documents
      : [];
    const consentTemplates = Array.isArray(data.compliance?.consent_templates)
      ? data.compliance.consent_templates
      : [];

    return {
      invitation_token: data.invitation.token,
      template: {
        id: data.template.selected_template?.id,
        version: data.template.selected_template?.version,
        preview_snapshot_url:
          data.template.selected_template?.preview_snapshot_url,
      },
      organization_profile: data.organizationProfile,
      locations: data.locations.map((loc) => ({
        ...loc,
        profile_photo_file: undefined, // Remove file objects
      })),
      branding: {
        logo_url: data.branding.logo_url,
        hero_asset_url: data.branding.hero_asset_url,
        favicon_url: data.branding.favicon_url,
        colors: data.branding.colors,
        typography: data.branding.typography,
        accessibility_score: data.branding.accessibility_score,
      },
      site_content: {
        ...data.siteContent,
        testimonials: data.siteContent.testimonials.map((t) => ({
          ...t,
          consent_file: undefined,
        })),
      },
      services_pricing: data.servicesPricing,
      leadership_team: {
        leadership_cards: data.leadershipTeam.leadership_cards.map((card) => ({
          ...card,
          profile_photo_file: undefined,
        })),
        staffing_plan: data.leadershipTeam.staffing_plan,
      },
      operational_policies: data.operationalPolicies,
      compliance: {
        ...data.compliance,
        documents: data.compliance.documents.map((doc) => ({
          ...doc,
          file: undefined,
        })),
        consent_templates: data.compliance.consent_templates.map((t) => ({
          ...t,
          file: undefined,
        })),
      },
      integrations: data.integrations,
      admin_team: data.adminTeam,
      publication_plan: data.review.publication_plan,
      acknowledgements: data.review.acknowledgements,
      metadata: {
        autosave_version: data.metadata.autosave_version,
        collaboration_notes: data.metadata.collaboration_notes,
      },
    };
  }, [data]);

  // ============================================================================
  // AUTOSAVE
  // ============================================================================

  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, 1000); // Debounce for 1 second

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [data, currentStep, saveToLocalStorage]);

  // ============================================================================
  // LOAD ON MOUNT
  // ============================================================================

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: HospitalOnboardingContextType = useMemo(
    () => ({
      data,
      currentStep,
      activityLog,
      collaborators,
      isStepValid,
      getStepCompletion,
      updateData,
      setCurrentStep,
      nextStep,
      previousStep,
      resetData,
      saveToLocalStorage,
      loadFromLocalStorage,
      addActivityLog,
      addCollaborator,
      removeCollaborator,
      buildSubmissionPayload,
    }),
    [
      data,
      currentStep,
      activityLog,
      collaborators,
      isStepValid,
      getStepCompletion,
      updateData,
      nextStep,
      previousStep,
      resetData,
      saveToLocalStorage,
      loadFromLocalStorage,
      addActivityLog,
      addCollaborator,
      removeCollaborator,
      buildSubmissionPayload,
    ]
  );

  return (
    <HospitalOnboardingContext.Provider value={value}>
      {children}
    </HospitalOnboardingContext.Provider>
  );
};
