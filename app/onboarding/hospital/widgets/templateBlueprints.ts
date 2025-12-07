import type { TemplateData } from "@/contexts/HospitalOnboardingContextV2";

/**
 * =============================================================================
 * TEMPLATE BLUEPRINTS - COMPREHENSIVE HOSPITAL WEBSITE CONFIGURATION
 * =============================================================================
 * 
 * This module defines the complete data structure for hospital website templates.
 * It integrates four core modules:
 * 
 * 1. BRANDING STUDIO - Colors, logos, fonts, theme settings
 * 2. SITE CONTENT - Hero sections, about us, footer content
 * 3. SERVICES & PRICING - Medical services and pricing tables
 * 4. COMPLIANCE & DOCUMENTATION - Certifications, policies, legal docs
 * 
 * HOW TO EDIT:
 * - Each section has inline editing support in the template preview
 * - Click on any text element to edit directly
 * - Hover over images to upload new ones
 * - Use the sidebar panels for structured data entry
 * - Changes auto-save to the context state
 * 
 * DATA FLOW:
 * templateBlueprints.ts → HospitalOnboardingContextV2 → EditableTemplatePreviewRenderer
 * =============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Image data type for uploaded images */
export interface UploadedImageData {
  file: File | null;
  previewUrl: string;
  originalUrl?: string;
}

/** Social media link configuration */
export interface SocialLink {
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "whatsapp";
  url: string;
  enabled: boolean;
}

/**
 * BRANDING STUDIO TYPES
 * Controls visual identity across the template
 */
export interface BrandingConfig {
  /** Hospital/organization name */
  name: string;
  /** Short tagline or slogan */
  tagline: string;
  /** Detailed description for SEO and about sections */
  description: string;
  /** Logo configurations */
  logos: {
    primary?: UploadedImageData;
    secondary?: UploadedImageData;  // For dark backgrounds
    favicon?: UploadedImageData;
  };
  /** Social media links */
  socialLinks: SocialLink[];
  /** Contact information */
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    emergencyHotline?: string;
    whatsapp?: string;
  };
  /** Business hours */
  businessHours: {
    weekdays: string;
    weekends: string;
    emergencyNote: string;
  };
}

/**
 * SERVICES & PRICING TYPES
 * Structures medical services and pricing information
 */
export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  /** Starting price or price range */
  priceRange?: {
    min: number;
    max?: number;
    currency: string;
    unit: "per consultation" | "per procedure" | "per package" | "per day";
  };
  /** Key features/inclusions */
  features: string[];
  /** Is this a featured/popular service? */
  featured: boolean;
  /** Duration if applicable */
  duration?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: "one-time" | "monthly" | "yearly";
  features: string[];
  recommended: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export interface ServicesAndPricing {
  /** Section header content */
  sectionTitle: string;
  sectionSubtitle: string;
  /** List of medical services */
  services: ServiceItem[];
  /** Health packages/bundles */
  packages: PricingPackage[];
  /** Insurance partners */
  insurancePartners: {
    name: string;
    logo?: UploadedImageData;
  }[];
  /** Payment methods accepted */
  paymentMethods: string[];
  /** Price disclaimer text */
  priceDisclaimer: string;
}

/**
 * COMPLIANCE & DOCUMENTATION TYPES
 * Legal, certifications, and regulatory information
 */
export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  certificationNumber?: string;
  validFrom?: string;
  validUntil?: string;
  logo?: UploadedImageData;
  verificationUrl?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  type: "privacy-policy" | "terms-of-service" | "refund-policy" | "disclaimer" | "consent-form" | "other";
  /** URL to the document or inline content */
  url?: string;
  content?: string;
  lastUpdated: string;
  required: boolean;
}

export interface ComplianceAndDocs {
  /** Accreditations and certifications */
  certifications: Certification[];
  /** Legal documents */
  legalDocuments: LegalDocument[];
  /** Regulatory registrations */
  registrations: {
    type: string;
    number: string;
    authority: string;
  }[];
  /** Data protection & privacy settings */
  dataProtection: {
    gdprCompliant: boolean;
    hipaaCompliant: boolean;
    dataRetentionPolicy: string;
    cookiePolicy: string;
  };
  /** Emergency protocols display */
  emergencyProtocols: {
    enabled: boolean;
    content: string;
  };
}

/**
 * MAIN TEMPLATE BLUEPRINT TYPE
 * Complete structure for a hospital website template
 */
export type TemplateBlueprint = {
  id: TemplateData["id"];
  
  // =========================================================================
  // MODULE 1: BRANDING STUDIO
  // =========================================================================
  /** 
   * BRANDING STUDIO
   * Click the logo area to upload, use Theme Customizer panel for colors/fonts
   */
  branding: BrandingConfig;
  
  /** Uploaded images for various sections */
  images?: {
    logo?: UploadedImageData;
    heroImage?: UploadedImageData;
    heroVideo?: UploadedImageData;
    doctorAvatars?: UploadedImageData[];
    facilityImages?: UploadedImageData[];
  };
  
  /** Color palette - Edit via Theme Customizer panel */
  palette: {
    background: string;
    surface: string;
    accent: string;
    accentMuted: string;
    text: string;
    textMuted: string;
    gradient: string;
  };
  
  /** Typography settings - Edit via Theme Customizer panel */
  typography: {
    heading: string;
    body: string;
  };
  
  // =========================================================================
  // MODULE 2: SITE CONTENT
  // =========================================================================
  /**
   * HERO SECTION
   * Click any text to edit inline. Upload hero image by hovering the media area.
   */
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: Array<{ label: string; value: string }>;
    heroImageAlt: string;
  };
  
  /**
   * ABOUT SECTION
   * Click to edit hospital description, mission, and highlights.
   */
  about?: {
    title: string;
    subtitle: string;
    description: string;
    mission?: string;
    vision?: string;
    highlights: Array<{ label: string; value: string }>;
  };
  
  /** Specialty departments - Click + to add, hover to remove */
  specialties: Array<{ name?: string; icon: string; title?: string; description: string }>;
  
  /** Key differentiators - What makes this hospital unique */
  differentiators: Array<{ title: string; description: string; icon?: string }>;
  
  /** Doctor profiles - Upload photos, edit credentials inline */
  doctors: Array<{
    name: string;
    title?: string;
    specialty: string;
    description: string;
    mediaLabel: string;
    photo?: UploadedImageData;
    qualifications?: string[];
    experience?: string;
  }>;
  
  /** Patient testimonials - Click to edit quotes and details */
  testimonials: Array<{
    name?: string;
    quote: string;
    rating?: number;
    location?: string;
    patient?: string;
    procedure?: string;
  }>;
  
  /** Facility highlights with images */
  facilityHighlights: Array<{
    title: string;
    copy: string;
    image?: UploadedImageData;
  }>;
  
  /** Healthcare programs and pathways */
  programs: Array<{ title: string; meta: string; description: string }>;
  
  /** Infrastructure cards */
  infrastructureCards?: Array<{ title: string; description: string; icon: string }>;
  
  /** Centers of excellence */
  centersOfExcellence?: Array<{ name: string; icon: string; description: string }>;
  
  /** International patients section */
  internationalPatients?: {
    title: string;
    description: string;
    features: Array<string>;
  };
  
  /** News and updates */
  news?: Array<{ title: string; date: string; excerpt: string; image: string }>;
  
  /** Breakthrough cases/success stories */
  breakthroughCases?: Array<{ title: string; description: string; doctor: string; outcome: string }>;
  
  /** FAQs */
  faqs?: Array<{ question: string; answer: string }>;
  
  /** Footer content - Edit contact info, links, and copyright */
  footer: {
    contact: {
      phone: string;
      email: string;
      location: string;
    };
    quickLinks: string[];
    tagline?: string;
    copyright?: string;
    links?: Array<{ label: string; href: string }>;
  };
  
  // =========================================================================
  // MODULE 3: SERVICES & PRICING
  // =========================================================================
  /**
   * SERVICES & PRICING
   * Use the Services panel in sidebar to add/edit services and packages.
   */
  servicesAndPricing?: ServicesAndPricing;
  
  /** Legacy services array for backwards compatibility */
  services?: Array<{ name: string; icon: string; description: string }>;
  
  // =========================================================================
  // MODULE 4: COMPLIANCE & DOCUMENTATION
  // =========================================================================
  /**
   * COMPLIANCE & DOCUMENTATION
   * Upload certifications, configure legal documents via Compliance panel.
   */
  compliance?: ComplianceAndDocs;
};

// ============================================================================
// DEFAULT VALUES FOR NEW TEMPLATES
// ============================================================================

/** Default branding configuration */
export const DEFAULT_BRANDING: BrandingConfig = {
  name: "Your Hospital Name",
  tagline: "Quality Healthcare, Compassionate Care",
  description: "A leading healthcare institution committed to providing world-class medical services.",
  logos: {},
  socialLinks: [
    { platform: "facebook", url: "", enabled: true },
    { platform: "twitter", url: "", enabled: true },
    { platform: "instagram", url: "", enabled: true },
    { platform: "linkedin", url: "", enabled: true },
    { platform: "youtube", url: "", enabled: false },
    { platform: "whatsapp", url: "", enabled: true },
  ],
  contactInfo: {
    primaryPhone: "+1 (800) 123-4567",
    email: "info@yourhospital.com",
    emergencyHotline: "+1 (800) 911-HELP",
  },
  businessHours: {
    weekdays: "Mon-Fri: 8:00 AM - 8:00 PM",
    weekends: "Sat-Sun: 9:00 AM - 5:00 PM",
    emergencyNote: "Emergency services available 24/7",
  },
};

/** Default services and pricing configuration */
export const DEFAULT_SERVICES_PRICING: ServicesAndPricing = {
  sectionTitle: "Our Services",
  sectionSubtitle: "Comprehensive healthcare solutions tailored to your needs",
  services: [
    {
      id: "srv-1",
      name: "General Consultation",
      category: "Primary Care",
      description: "Comprehensive health assessment with our experienced physicians.",
      icon: "🩺",
      priceRange: { min: 50, max: 150, currency: "USD", unit: "per consultation" },
      features: ["Physical examination", "Health assessment", "Prescription if needed"],
      featured: true,
      duration: "30-45 minutes",
    },
    {
      id: "srv-2",
      name: "Specialist Consultation",
      category: "Specialty Care",
      description: "Expert consultation with our board-certified specialists.",
      icon: "👨‍⚕️",
      priceRange: { min: 100, max: 300, currency: "USD", unit: "per consultation" },
      features: ["Expert diagnosis", "Treatment planning", "Follow-up coordination"],
      featured: true,
      duration: "45-60 minutes",
    },
    {
      id: "srv-3",
      name: "Diagnostic Imaging",
      category: "Diagnostics",
      description: "State-of-the-art imaging services including X-ray, CT, MRI.",
      icon: "🔬",
      priceRange: { min: 75, max: 500, currency: "USD", unit: "per procedure" },
      features: ["Same-day results", "Expert radiologists", "Digital reports"],
      featured: false,
    },
  ],
  packages: [
    {
      id: "pkg-1",
      name: "Basic Health Check",
      description: "Essential screening for overall health assessment",
      price: 199,
      currency: "USD",
      billingCycle: "one-time",
      features: [
        "Complete blood count",
        "Lipid profile",
        "Blood sugar test",
        "Physical examination",
        "Doctor consultation",
      ],
      recommended: false,
      ctaLabel: "Book Now",
      ctaHref: "/book/basic-health-check",
    },
    {
      id: "pkg-2",
      name: "Executive Health Package",
      description: "Comprehensive screening for busy professionals",
      price: 499,
      currency: "USD",
      billingCycle: "one-time",
      features: [
        "All Basic Health Check tests",
        "Cardiac screening (ECG, Echo)",
        "Liver & kidney function",
        "Thyroid profile",
        "Chest X-ray",
        "Executive consultation",
      ],
      recommended: true,
      ctaLabel: "Book Now",
      ctaHref: "/book/executive-health",
    },
  ],
  insurancePartners: [],
  paymentMethods: ["Cash", "Credit/Debit Cards", "Insurance", "EMI Options"],
  priceDisclaimer: "Prices are indicative and may vary based on individual requirements. Please contact us for accurate pricing.",
};

/** Default compliance configuration */
export const DEFAULT_COMPLIANCE: ComplianceAndDocs = {
  certifications: [
    {
      id: "cert-1",
      name: "NABH Accreditation",
      issuingBody: "National Accreditation Board for Hospitals",
      validFrom: "2024-01-01",
      validUntil: "2027-01-01",
    },
  ],
  legalDocuments: [
    {
      id: "doc-1",
      title: "Privacy Policy",
      type: "privacy-policy",
      url: "/legal/privacy-policy",
      lastUpdated: "2024-01-01",
      required: true,
    },
    {
      id: "doc-2",
      title: "Terms of Service",
      type: "terms-of-service",
      url: "/legal/terms-of-service",
      lastUpdated: "2024-01-01",
      required: true,
    },
    {
      id: "doc-3",
      title: "Refund Policy",
      type: "refund-policy",
      url: "/legal/refund-policy",
      lastUpdated: "2024-01-01",
      required: false,
    },
  ],
  registrations: [],
  dataProtection: {
    gdprCompliant: false,
    hipaaCompliant: false,
    dataRetentionPolicy: "",
    cookiePolicy: "",
  },
  emergencyProtocols: {
    enabled: false,
    content: "",
  },
};

export const TEMPLATE_BLUEPRINTS: Record<string, TemplateBlueprint> = {
  "modern-healthcare": {
    id: "modern-healthcare",
    
    // BRANDING STUDIO
    branding: {
      name: "InspireCare Medical City",
      tagline: "Flagship Smart Hospital",
      description: "Hybrid hospital campus combining advanced robotics, precision oncology, and 24/7 connected care across four continents.",
      logos: {},
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com/inspirecare", enabled: true },
        { platform: "twitter", url: "https://twitter.com/inspirecare", enabled: true },
        { platform: "instagram", url: "https://instagram.com/inspirecare", enabled: true },
        { platform: "linkedin", url: "https://linkedin.com/company/inspirecare", enabled: true },
        { platform: "youtube", url: "https://youtube.com/inspirecare", enabled: true },
        { platform: "whatsapp", url: "+912240001414", enabled: true },
      ],
      contactInfo: {
        primaryPhone: "+91 22 4000 1414",
        secondaryPhone: "+91 22 4000 1415",
        email: "navigator@inspirecare.health",
        emergencyHotline: "+91 22 4000 9999",
        whatsapp: "+91 98765 43210",
      },
      businessHours: {
        weekdays: "Mon-Fri: 7:00 AM - 10:00 PM",
        weekends: "Sat-Sun: 8:00 AM - 8:00 PM",
        emergencyNote: "24/7 Emergency & Trauma Center",
      },
    },
    
    hero: {
      eyebrow: "Flagship Smart Hospital",
      title: "InspireCare Medical City",
      subtitle:
        "Hybrid hospital campus combining advanced robotics, precision oncology, and 24/7 connected care across four continents.",
      primaryCta: { label: "Book an Appointment", href: "/appointments" },
      secondaryCta: { label: "Explore Departments", href: "/departments" },
      stats: [
        { label: "Centres of Excellence", value: "12" },
        { label: "Doctors", value: "380+" },
        { label: "Countries Served", value: "22" },
      ],
      heroImageAlt: "Cutting-edge hybrid operating room",
    },
    palette: {
      background: "#f7fafc",
      surface: "#ffffff",
      accent: "#0E9F9F",
      accentMuted: "#9AE6B4",
      text: "#0f172a",
      textMuted: "#475569",
      gradient: "linear-gradient(135deg, #0E9F9F, #2563EB)",
    },
    typography: { heading: 'font-sans font-bold', body: 'font-sans' },
    specialties: [
      {
        icon: "🫀",
        title: "Cardiac Sciences",
        description:
          "Structural heart program with 45-minute door-to-balloon KPI.",
      },
      {
        icon: "🧠",
        title: "Neuro & Spine",
        description:
          "Deep brain stimulation, intra-op MRI, and 360º rehab labs.",
      },
      {
        icon: "🧬",
        title: "Precision Oncology",
        description: "Molecular Tumor Board + on-site genomic sequencing.",
      },
      {
        icon: "🤖",
        title: "Robotics Institute",
        description:
          "Da Vinci Xi + VELYS suite with immersive patient education.",
      },
    ],
    differentiators: [
      {
        title: "Remote ICU Command",
        description:
          "Tele-ICU pods monitor 120 beds with AI escalation playbooks.",
      },
      {
        title: "Global Second Opinion",
        description:
          "48-hour consult promise backed by specialist roster in 8 regions.",
      },
      {
        title: "Sustainable Campus",
        description:
          "LEED Platinum campus powered by onsite trigeneration and rain harvesting.",
      },
    ],
    doctors: [
      {
        name: "Dr. Mira Thakur",
        specialty: "Chief of Interventional Cardiology",
        description:
          "Pioneer of zero-contrast PCI program with >2,400 structural interventions.",
        mediaLabel: "Watch Cath Lab Walkthrough",
      },
      {
        name: "Dr. Emiliano Costa",
        specialty: "Director, Adaptive Oncology",
        description:
          "Leads CAR-T program & tumor response lab for rare cancers.",
        mediaLabel: "Explore Oncology Precision Suite",
      },
    ],
    testimonials: [
      {
        quote:
          "“Three countries turned us away. InspireCare rebuilt my son’s spine in 9 hours flat.”",
        patient: "Priyanka & Aarav",
        procedure: "Pediatric scoliosis reconstruction",
      },
      {
        quote:
          "“Remote ICU kept dad stable until we could fly in. The handoff was seamless.”",
        patient: "Anjali Verma",
        procedure: "Tele-ICU stabilization + cardiac bypass",
      },
    ],
    facilityHighlights: [
      {
        title: "Hybrid OR Complex",
        copy: "Four ORs with ceiling-mounted angiography & intra-op CT.",
      },
      {
        title: "Regenerative Med Lab",
        copy: "cGMP suites for cell therapies & autologous implants.",
      },
      {
        title: "Family Recovery Suites",
        copy: "Biophilic design, circadian lighting, private concierge.",
      },
    ],
    programs: [
      {
        title: "Global Exec Health",
        meta: "5-day concierge program",
        description:
          "Metabolic, cardiac, neuro-cog, genomic panel + lifestyle labs.",
      },
      {
        title: "Onco Navigation Hub",
        meta: "Personalized pathway",
        description:
          "Tumor board in 72 hrs, travel concierge, visa desk, lodging.",
      },
      {
        title: "Heritage Mother & Child",
        meta: "Level IV NICU",
        description:
          "Neuroprotective neonatal suites & integrative lactation studio.",
      },
    ],
    footer: {
      contact: {
        phone: "+91 22 4000 1414",
        email: "navigator@inspirecare.health",
        location: "BKC, Mumbai · Dubai · Singapore · Nairobi",
      },
      quickLinks: [
        "Centres of Excellence",
        "International Patients",
        "Clinical Trials",
        "Virtual Tour",
      ],
    },
    
    // SERVICES & PRICING
    servicesAndPricing: {
      sectionTitle: "World-Class Medical Services",
      sectionSubtitle: "Comprehensive care with transparent pricing",
      services: [
        {
          id: "srv-cardiac",
          name: "Cardiac Sciences",
          category: "Heart Care",
          description: "Complete cardiac care from diagnostics to complex interventions",
          icon: "🫀",
          priceRange: { min: 500, max: 50000, currency: "USD", unit: "per procedure" },
          features: ["24/7 Cath Lab", "Structural Heart Program", "Cardiac Rehab"],
          featured: true,
          duration: "Varies by procedure",
        },
        {
          id: "srv-onco",
          name: "Precision Oncology",
          category: "Cancer Care",
          description: "Personalized cancer treatment with genomic profiling",
          icon: "🧬",
          priceRange: { min: 1000, max: 100000, currency: "USD", unit: "per package" },
          features: ["Molecular Tumor Board", "CAR-T Therapy", "Clinical Trials Access"],
          featured: true,
        },
      ],
      packages: [
        {
          id: "pkg-exec",
          name: "Global Executive Health",
          description: "5-day comprehensive health assessment for executives",
          price: 4999,
          currency: "USD",
          billingCycle: "one-time",
          features: ["Metabolic profiling", "Cardiac stress testing", "Genomic panel", "Lifestyle consultation"],
          recommended: true,
          ctaLabel: "Book Assessment",
          ctaHref: "/book/executive-health",
        },
      ],
      insurancePartners: [{ name: "Blue Cross" }, { name: "United Healthcare" }, { name: "Aetna" }],
      paymentMethods: ["International Cards", "Wire Transfer", "Insurance", "Payment Plans"],
      priceDisclaimer: "Prices shown are estimates. Final costs depend on individual case complexity.",
    },
    
    // COMPLIANCE & DOCUMENTATION
    compliance: {
      certifications: [
        { id: "cert-jci", name: "JCI Accreditation", issuingBody: "Joint Commission International", validFrom: "2023-06-01", validUntil: "2026-06-01" },
        { id: "cert-nabh", name: "NABH Accreditation", issuingBody: "NABH India", validFrom: "2024-01-01", validUntil: "2027-01-01" },
      ],
      legalDocuments: [
        { id: "doc-privacy", title: "Privacy Policy", type: "privacy-policy", url: "/legal/privacy", lastUpdated: "2024-01-15", required: true },
        { id: "doc-terms", title: "Terms of Service", type: "terms-of-service", url: "/legal/terms", lastUpdated: "2024-01-15", required: true },
      ],
      registrations: [{ type: "Hospital Registration", number: "HRN-MH-2020-1234", authority: "Maharashtra Medical Council" }],
      dataProtection: { gdprCompliant: true, hipaaCompliant: true, dataRetentionPolicy: "10 years", cookiePolicy: "Essential cookies only" },
      emergencyProtocols: { enabled: true, content: "In case of emergency, call our 24/7 hotline." },
    },
  },
  "telehealth-first": {
    id: "telehealth-first",
    
    // BRANDING STUDIO
    branding: {
      name: "PulseConnect Virtual Hospital",
      tagline: "Cloud Native Hospital",
      description: "Nationwide mesh of teleclinics, diagnostics drones, and same-day infusion lounges built for chronic care at home.",
      logos: {},
      socialLinks: [
        { platform: "facebook", url: "", enabled: true },
        { platform: "twitter", url: "", enabled: true },
        { platform: "instagram", url: "", enabled: true },
        { platform: "linkedin", url: "", enabled: true },
        { platform: "youtube", url: "", enabled: false },
        { platform: "whatsapp", url: "", enabled: true },
      ],
      contactInfo: {
        primaryPhone: "+1 (415) 555-0146",
        email: "hello@pulseconnect.health",
      },
      businessHours: {
        weekdays: "24/7 Virtual Care",
        weekends: "24/7 Virtual Care",
        emergencyNote: "Connect instantly with our virtual care team",
      },
    },
    
    hero: {
      eyebrow: "Cloud Native Hospital",
      title: "PulseConnect Virtual Hospital",
      subtitle:
        "Nationwide mesh of teleclinics, diagnostics drones, and same-day infusion lounges built for chronic care at home.",
      primaryCta: { label: "Start a Virtual Visit", href: "/virtual-care" },
      secondaryCta: { label: "Find a Micro-Clinic", href: "/locations" },
      stats: [
        { label: "Teleclinics", value: "63" },
        { label: "Home Care Cities", value: "28" },
        { label: "Avg. Wait", value: "06 min" },
      ],
      heroImageAlt: "Nurse monitoring virtual care wall",
    },
    palette: {
      background: "#f0f9ff",
      surface: "#ffffff",
      accent: "#2563EB",
      accentMuted: "#DBEAFE",
      text: "#0f172a",
      textMuted: "#475569",
      gradient: "linear-gradient(135deg, #2563EB, #06B6D4)",
    },
    typography: { heading: 'font-sans font-bold', body: 'font-sans' },
    specialties: [
      {
        icon: "💓",
        title: "Cardio-Metabolic Pods",
        description: "Bluetooth vitals + AI arrhythmia triage.",
      },
      {
        icon: "🩺",
        title: "Women’s OmniCare",
        description: "Hybrid OB, fertility, lactation & pelvic rehab pods.",
      },
      {
        icon: "🫁",
        title: "Respiratory Network",
        description: "At-home COPD program with portable FeNO labs.",
      },
      {
        icon: "🧠",
        title: "Behavioral Studio",
        description: "Group CBT, adolescent telepsychiatry, VR mindfulness.",
      },
    ],
    differentiators: [
      {
        title: "6-Minute Intake",
        description:
          "Identity, insurance, history synced from payer APIs & wearables.",
      },
      {
        title: "Field Infusion Vans",
        description:
          "Nurse-led biologic therapy at patient homes with cold-chain assurance.",
      },
      {
        title: "Data Trust Layer",
        description:
          "FHIR native vault + consent orchestration for multi-tenant sharing.",
      },
    ],
    doctors: [
      {
        name: "Dr. Laila Nadar",
        specialty: "Chief Virtualist",
        description:
          "Builds asynchronous-first care models for diabetes and heart failure.",
        mediaLabel: "See Remote Monitoring Stack",
      },
      {
        name: "Dr. Kenji Iwata",
        specialty: "Mental Health Design Lead",
        description:
          "Runs multilingual therapy pods with AI-assisted triage & escalation.",
        mediaLabel: "Tour Behavioral Studio",
      },
    ],
    testimonials: [
      {
        quote:
          "“Weekly infusion at home means zero missed PT sessions. Nurses feel like family.”",
        patient: "Rafael Torres",
        procedure: "Biologic therapy + remote physio",
      },
      {
        quote:
          "“My mom’s heart failure plan is all on the app. Alerts go to me and the care coach.”",
        patient: "Meera Joseph",
        procedure: "Cardio-metabolic at-home bundle",
      },
    ],
    facilityHighlights: [
      {
        title: "Telemetry Command",
        copy: "96-screen situational wall triages AI alerts + human escalation.",
      },
      {
        title: "Drop-in Lounges",
        copy: "Micro-clinics with IV suites, labs, imaging pods, respite nooks.",
      },
      {
        title: "Mobility Fleet",
        copy: "EV vans for pharmacy, respiratory therapy, and ultrasound-on-wheels.",
      },
    ],
    programs: [
      {
        title: "Chronic Heart Hub",
        meta: "Remote + in-person",
        description: "Loop recorders, titration clinics, caregiver academies.",
      },
      {
        title: "Post-Op Anywhere",
        meta: "Day 0 to Day 45",
        description:
          "Vitals kits, scar imaging, virtual rounds + priority transfers.",
      },
      {
        title: "Neuro Balance",
        meta: "Falls prevention",
        description: "Smart mats, Tai Chi telecoaching, OT drop-ins.",
      },
    ],
    footer: {
      contact: {
        phone: "+1 (415) 555-0146",
        email: "hello@pulseconnect.health",
        location: "HQ: Austin · Pods across US, MX, SG",
      },
      quickLinks: [
        "Virtual Care App",
        "Insurance Partners",
        "For Employers",
        "Clinical Research",
      ],
    },
    
    // SERVICES & PRICING for Telehealth
    servicesAndPricing: DEFAULT_SERVICES_PRICING,
    compliance: DEFAULT_COMPLIANCE,
  },
  heritage: {
    id: "heritage",
    
    // BRANDING STUDIO
    branding: {
      name: "St. Raphael Heritage Medical Centre",
      tagline: "125 Years of Trust",
      description: "Faith-rooted academic hospital blending classical hospitality with cutting-edge transplant science.",
      logos: {},
      socialLinks: [
        { platform: "facebook", url: "", enabled: true },
        { platform: "twitter", url: "", enabled: true },
        { platform: "instagram", url: "", enabled: true },
        { platform: "linkedin", url: "", enabled: true },
        { platform: "youtube", url: "", enabled: false },
        { platform: "whatsapp", url: "", enabled: true },
      ],
      contactInfo: {
        primaryPhone: "+44 20 7123 4750",
        email: "welcome@straphael.org",
      },
      businessHours: {
        weekdays: "Mon-Fri: 7:00 AM - 9:00 PM",
        weekends: "Sat-Sun: 8:00 AM - 6:00 PM",
        emergencyNote: "24/7 Emergency Department",
      },
    },
    
    hero: {
      eyebrow: "125 Years of Trust",
      title: "St. Raphael Heritage Medical Centre",
      subtitle:
        "Faith-rooted academic hospital blending classical hospitality with cutting-edge transplant science.",
      primaryCta: { label: "Plan Your Visit", href: "/visit" },
      secondaryCta: { label: "Meet Our Physicians", href: "/physicians" },
      stats: [
        { label: "Founded", value: "1898" },
        { label: "Transplant Survival", value: "96%" },
        { label: "Teaching Chairs", value: "42" },
      ],
      heroImageAlt: "Historic hospital courtyard with cloisters",
    },
    palette: {
      background: "#fefcf5",
      surface: "#ffffff",
      accent: "#B45309",
      accentMuted: "#FDE68A",
      text: "#1f2937",
      textMuted: "#6b7280",
      gradient: "linear-gradient(135deg, #B45309, #92400E)",
    },
    typography: { heading: 'font-serif font-bold', body: 'font-sans' },
    specialties: [
      {
        icon: "🫁",
        title: "Pulmonology",
        description: "Heritage lung institute with ECMO retrieval teams.",
      },
      {
        icon: "🫀",
        title: "Transplant Sciences",
        description:
          "Heart, liver, and pancreas programs with family apartments.",
      },
      {
        icon: "👶",
        title: "Neonatal & Fetal Care",
        description: "Level IV NICU & fetal surgery fellowship.",
      },
      {
        icon: "🧎",
        title: "Palliative & Pastoral",
        description: "Interfaith chaplaincy + pain innovation lab.",
      },
    ],
    differentiators: [
      {
        title: "Heritage Hospitality",
        description: "Concierge nuns + heritage bakery comforting families.",
      },
      {
        title: "Scholar Clinics",
        description:
          "Physicians double as professors with bedside rounds for students.",
      },
      {
        title: "Art & Healing",
        description:
          "Music therapy, stained glass tours, clinical humanities museum.",
      },
    ],
    doctors: [
      {
        name: "Dr. Aileen Rosario",
        specialty: "Cardiothoracic Surgeon",
        description:
          "Heads heritage transplant lab with donor stewardship team.",
        mediaLabel: "Watch Heart Team Documentary",
      },
      {
        name: "Dr. Thomas Bellamy",
        specialty: "Neonatologist-in-Chief",
        description:
          "Runs Golden Hour protocol & developmental care mentoring.",
        mediaLabel: "See NICU Family Suites",
      },
    ],
    testimonials: [
      {
        quote:
          "“The chaplain held our hands through transplant waitlists and beyond.”",
        patient: "Javier & Lucia Serrano",
        procedure: "Dual organ transplant",
      },
      {
        quote:
          "“Nurses sang lullabies in three languages. We never felt alone.”",
        patient: "The Bennett Family",
        procedure: "NICU stay · 102 days",
      },
    ],
    facilityHighlights: [
      {
        title: "Cloister Gardens",
        copy: "Heritage courtyards for respite, ecotherapy, and pastoral care.",
      },
      {
        title: "Heritage Library",
        copy: "Rare medical archives + collaborative learning studios.",
      },
      {
        title: "Guest Residences",
        copy: "41 family suites with shared kitchens + telechapel.",
      },
    ],
    programs: [
      {
        title: "Sacred Heart Program",
        meta: "Transplant readiness",
        description: "Family counseling, donor liaison, prayer circles.",
      },
      {
        title: "Lumina Birth Collective",
        meta: "Mother-baby continuum",
        description:
          "Doula pods, pelvic floor studio, NICU transition coaching.",
      },
      {
        title: "Scholars-in-Service",
        meta: "Academic immersion",
        description: "Clinical electives + heritage leadership seminars.",
      },
    ],
    footer: {
      contact: {
        phone: "+44 20 7123 4750",
        email: "welcome@straphael.org",
        location: "Chelsea, London · Dublin · Kochi",
      },
      quickLinks: [
        "Heritage Timeline",
        "Support the Mission",
        "Pastoral Care",
        "Residency Programs",
      ],
    },
    
    // SERVICES & PRICING for Heritage
    servicesAndPricing: DEFAULT_SERVICES_PRICING,
    compliance: DEFAULT_COMPLIANCE,
  },
};

