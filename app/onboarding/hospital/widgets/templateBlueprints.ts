import type { TemplateData } from "@/contexts/HospitalOnboardingContextV2";

// Image data type for uploaded images
export interface UploadedImageData {
  file: File | null;
  previewUrl: string;
  originalUrl?: string;
}

export type TemplateBlueprint = {
  id: TemplateData["id"];
  // Branding images
  images?: {
    logo?: UploadedImageData;
    heroImage?: UploadedImageData;
    heroVideo?: UploadedImageData;
    doctorAvatars?: UploadedImageData[];
    facilityImages?: UploadedImageData[];
  };
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
  // Allow both 'name' and 'title' for backwards compatibility
  specialties: Array<{
    icon: string;
    title?: string;
    name?: string;
    description: string;
  }>;
  differentiators: Array<{ title: string; description: string; icon?: string }>;
  doctors: Array<{
    name: string;
    title?: string;
    specialty: string;
    description: string;
    mediaLabel: string;
    photo?: UploadedImageData;
  }>;
  testimonials: Array<{
    quote: string;
    // Allow both 'patient' and 'name' for backwards compatibility
    patient?: string;
    name?: string;
    procedure?: string;
    rating?: number;
    location?: string;
  }>;
  facilityHighlights: Array<{
    title: string;
    copy: string;
    image?: UploadedImageData;
  }>;
  programs: Array<{ title: string; meta: string; description: string }>;
  footer: {
    tagline?: string;
    copyright?: string;
    links?: Array<{ label: string; href: string }>;
    // Legacy format support
    contact?: {
      phone: string;
      email: string;
      location: string;
    };
    quickLinks?: string[];
  };
  about?: {
    title: string;
    subtitle: string;
    description: string;
    highlights: Array<{ label: string; value: string }>;
  };
  infrastructureCards?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  centersOfExcellence?: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
  services?: Array<{ name: string; icon: string; description: string }>;
  internationalPatients?: {
    title: string;
    description: string;
    features: Array<string>;
  };
  news?: Array<{ title: string; date: string; excerpt: string; image: string }>;
  breakthroughCases?: Array<{
    title: string;
    description: string;
    doctor: string;
    outcome: string;
  }>;
  faqs?: Array<{ question: string; answer: string }>;
};

export const TEMPLATE_BLUEPRINTS: Record<string, TemplateBlueprint> = {
  "modern-healthcare": {
    id: "modern-healthcare",
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
    typography: {
      heading: '"Space Grotesk", Inter, sans-serif',
      body: 'Inter, "Noto Sans", system-ui, sans-serif',
    },
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
  },
  "telehealth-first": {
    id: "telehealth-first",
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
    typography: {
      heading: '"Sora", "Inter", sans-serif',
      body: 'Inter, "IBM Plex Sans", system-ui, sans-serif',
    },
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
  },
  heritage: {
    id: "heritage",
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
    typography: {
      heading: '"Playfair Display", "IBM Plex Serif", serif',
      body: '"Source Sans Pro", system-ui, sans-serif',
    },
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
  },
  // ============================================================================
  // NEW TEMPLATES - Custom Designed Templates
  // ============================================================================
  "ahtarva-modern": {
    id: "ahtarva-modern",
    hero: {
      eyebrow: "Premium Healthcare Experience",
      title: "Ahtarva Medical Center",
      subtitle:
        "Where cutting-edge technology meets compassionate care. Experience world-class healthcare with a personal touch.",
      primaryCta: { label: "Book Appointment", href: "/appointments" },
      secondaryCta: { label: "Virtual Tour", href: "/tour" },
      stats: [
        { label: "Years of Excellence", value: "25+" },
        { label: "Expert Doctors", value: "150+" },
        { label: "Happy Patients", value: "50K+" },
        { label: "Specialties", value: "40+" },
      ],
      heroImageAlt: "Modern hospital building with glass facade",
    },
    palette: {
      background: "#f8fafb",
      surface: "#ffffff",
      accent: "#11d473",
      accentMuted: "#d1fae5",
      text: "#102219",
      textMuted: "#475569",
      gradient: "linear-gradient(135deg, #11d473, #0c4a6e)",
    },
    typography: {
      heading: '"Manrope", "Inter", sans-serif',
      body: '"Inter", system-ui, sans-serif',
    },
    specialties: [
      {
        icon: "🫀",
        title: "Cardiology",
        description:
          "Advanced cardiac care with state-of-the-art cath labs and heart failure management.",
      },
      {
        icon: "🧠",
        title: "Neurosciences",
        description:
          "Comprehensive brain and spine care with advanced neuroimaging and neurosurgery.",
      },
      {
        icon: "🦴",
        title: "Orthopedics",
        description:
          "Joint replacement, sports medicine, and spine surgery with robotic precision.",
      },
      {
        icon: "👶",
        title: "Pediatrics",
        description:
          "Complete child healthcare from newborn care to adolescent medicine.",
      },
    ],
    differentiators: [
      {
        title: "24/7 Emergency Care",
        description:
          "Round-the-clock emergency services with trauma specialists on-site.",
        icon: "🚑",
      },
      {
        title: "Advanced Diagnostics",
        description:
          "Latest imaging technology including 3T MRI, PET-CT, and digital pathology.",
        icon: "🔬",
      },
      {
        title: "Patient-Centric Approach",
        description:
          "Personalized care plans with dedicated patient coordinators.",
        icon: "💚",
      },
    ],
    doctors: [
      {
        name: "Dr. Priya Sharma",
        specialty: "Chief Cardiologist",
        description:
          "Pioneer in minimally invasive cardiac procedures with 20+ years experience.",
        mediaLabel: "Watch Introduction",
      },
      {
        name: "Dr. Rajesh Kumar",
        specialty: "Head of Neurosciences",
        description: "Expert in complex brain surgeries and stroke management.",
        mediaLabel: "View Profile",
      },
      {
        name: "Dr. Anita Desai",
        specialty: "Director of Pediatrics",
        description:
          "Specialized in pediatric critical care and developmental disorders.",
        mediaLabel: "Book Consultation",
      },
    ],
    testimonials: [
      {
        quote:
          "The care I received was exceptional. The doctors and staff made me feel like family throughout my treatment.",
        patient: "Ramesh Patel",
        procedure: "Cardiac Bypass Surgery",
        rating: 5,
      },
      {
        quote:
          "From diagnosis to recovery, every step was handled with utmost professionalism and care.",
        patient: "Sunita Mehta",
        procedure: "Knee Replacement",
        rating: 5,
      },
    ],
    facilityHighlights: [
      {
        title: "Modern ICU Complex",
        copy: "State-of-the-art intensive care units with advanced monitoring systems.",
      },
      {
        title: "Healing Environment",
        copy: "Thoughtfully designed spaces that promote comfort and recovery.",
      },
      {
        title: "Technology Integration",
        copy: "Seamless digital experience from booking to post-care follow-ups.",
      },
    ],
    programs: [
      {
        title: "Executive Health Checkup",
        meta: "Comprehensive Screening",
        description:
          "Complete health assessment packages tailored for busy professionals.",
      },
      {
        title: "Wellness Programs",
        meta: "Preventive Care",
        description:
          "Lifestyle modification and chronic disease management programs.",
      },
    ],
    footer: {
      contact: {
        phone: "+91 98765 43210",
        email: "info@ahtarvamedical.com",
        location: "Mumbai, Maharashtra, India",
      },
      quickLinks: [
        "Find a Doctor",
        "Book Appointment",
        "Health Packages",
        "Contact Us",
      ],
    },
  },
  "premium-medical": {
    id: "premium-medical",
    hero: {
      eyebrow: "Trusted Healthcare Partner",
      title: "Premium Medical Institute",
      subtitle:
        "Experience healthcare reimagined. Our expert team combines advanced medicine with genuine compassion.",
      primaryCta: { label: "Schedule Visit", href: "/schedule" },
      secondaryCta: { label: "Explore Services", href: "/services" },
      stats: [
        { label: "Board Certified Doctors", value: "200+" },
        { label: "Patient Satisfaction", value: "98%" },
        { label: "Awards Won", value: "50+" },
        { label: "Beds Available", value: "500+" },
      ],
      heroImageAlt: "Premium hospital lobby with natural lighting",
    },
    palette: {
      background: "#f9fafb",
      surface: "#ffffff",
      accent: "#11d473",
      accentMuted: "#ecfdf5",
      text: "#111827",
      textMuted: "#6b7280",
      gradient: "linear-gradient(135deg, #11d473, #10b981)",
    },
    typography: {
      heading: '"Plus Jakarta Sans", "Inter", sans-serif',
      body: '"Inter", system-ui, sans-serif',
    },
    specialties: [
      {
        icon: "❤️",
        title: "Heart Care",
        description:
          "Comprehensive cardiac services from prevention to intervention.",
      },
      {
        icon: "🧬",
        title: "Oncology",
        description:
          "Advanced cancer treatment with personalized therapy protocols.",
      },
      {
        icon: "🏃",
        title: "Sports Medicine",
        description: "Specialized care for athletes and active individuals.",
      },
      {
        icon: "👩‍⚕️",
        title: "Women's Health",
        description: "Complete women's healthcare across all life stages.",
      },
    ],
    differentiators: [
      {
        title: "Personalized Care Plans",
        description: "Every patient receives a customized treatment pathway.",
        icon: "📋",
      },
      {
        title: "Holistic Wellness",
        description: "Integrating mental, physical, and emotional health.",
        icon: "🌿",
      },
      {
        title: "Family-Centered Approach",
        description: "Involving families in the healing journey.",
        icon: "👨‍👩‍👧‍👦",
      },
    ],
    doctors: [
      {
        name: "Dr. Sarah Johnson",
        specialty: "Chief Medical Officer",
        description:
          "Leading healthcare innovation with 25 years of clinical excellence.",
        mediaLabel: "Meet Dr. Johnson",
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Head of Oncology",
        description:
          "Pioneer in precision medicine and targeted cancer therapies.",
        mediaLabel: "View Credentials",
      },
    ],
    testimonials: [
      {
        quote:
          "The warmth and professionalism of the entire team made a difficult time so much easier.",
        patient: "Jennifer Williams",
        procedure: "Cancer Treatment",
        rating: 5,
      },
      {
        quote:
          "Outstanding care from start to finish. I couldn't have asked for better treatment.",
        patient: "David Thompson",
        procedure: "Cardiac Surgery",
        rating: 5,
      },
    ],
    facilityHighlights: [
      {
        title: "Healing Gardens",
        copy: "Therapeutic outdoor spaces designed for patient wellbeing and recovery.",
      },
      {
        title: "Private Suites",
        copy: "Comfortable, hotel-like accommodations for patients and families.",
      },
      {
        title: "Wellness Center",
        copy: "Comprehensive rehabilitation and wellness facilities.",
      },
    ],
    programs: [
      {
        title: "Concierge Medicine",
        meta: "Premium Service",
        description:
          "Exclusive healthcare experience with dedicated physician access.",
      },
      {
        title: "Preventive Health",
        meta: "Stay Ahead",
        description: "Comprehensive screening and early detection programs.",
      },
    ],
    footer: {
      contact: {
        phone: "+1 (555) 123-4567",
        email: "care@premiummedical.com",
        location: "San Francisco, California, USA",
      },
      quickLinks: ["Our Doctors", "Services", "Patient Portal", "Insurance"],
    },
  },
  "modern-health-tech": {
    id: "modern-health-tech",
    hero: {
      eyebrow: "The Future of Healthcare",
      title: "HealthTech Medical Center",
      subtitle:
        "Where innovation meets healing. Experience next-generation healthcare powered by AI and cutting-edge technology.",
      primaryCta: { label: "Get Started", href: "/start" },
      secondaryCta: { label: "Learn More", href: "/about" },
      stats: [
        { label: "AI Diagnoses", value: "100K+" },
        { label: "Digital First", value: "24/7" },
        { label: "Tech Patents", value: "30+" },
        { label: "Connected Devices", value: "1M+" },
      ],
      heroImageAlt: "Futuristic hospital with advanced technology",
    },
    palette: {
      background: "#f0f4f8",
      surface: "#ffffff",
      accent: "#137fec",
      accentMuted: "#dbeafe",
      text: "#0f172a",
      textMuted: "#64748b",
      gradient: "linear-gradient(135deg, #137fec, #06b6d4)",
    },
    typography: {
      heading: '"Space Grotesk", "Inter", sans-serif',
      body: '"Inter", system-ui, sans-serif',
    },
    specialties: [
      {
        icon: "🤖",
        title: "AI Diagnostics",
        description: "Machine learning powered diagnostic accuracy and speed.",
      },
      {
        icon: "🔬",
        title: "Genomic Medicine",
        description: "Personalized treatments based on your genetic profile.",
      },
      {
        icon: "📱",
        title: "Digital Therapeutics",
        description: "App-based treatment programs with real-time monitoring.",
      },
      {
        icon: "🦾",
        title: "Robotic Surgery",
        description:
          "Precision surgery with minimal invasion and faster recovery.",
      },
    ],
    differentiators: [
      {
        title: "AI-First Approach",
        description: "Every diagnosis enhanced by machine learning algorithms.",
        icon: "🧠",
      },
      {
        title: "Remote Monitoring",
        description:
          "Continuous health tracking with smart wearables integration.",
        icon: "📊",
      },
      {
        title: "Instant Results",
        description:
          "Real-time test results and immediate care recommendations.",
        icon: "⚡",
      },
    ],
    doctors: [
      {
        name: "Dr. Alex Rivera",
        specialty: "Chief Innovation Officer",
        description:
          "Leading the integration of AI in clinical decision making.",
        mediaLabel: "Watch Tech Talk",
      },
      {
        name: "Dr. Lisa Park",
        specialty: "Director of Digital Health",
        description: "Pioneering remote care and digital therapeutic programs.",
        mediaLabel: "See Digital Platform",
      },
    ],
    testimonials: [
      {
        quote:
          "The AI-assisted diagnosis was incredibly accurate. The whole experience felt like healthcare from the future.",
        patient: "Kevin Zhang",
        procedure: "AI-Assisted Diagnosis",
        rating: 5,
      },
      {
        quote:
          "Remote monitoring helped me manage my condition without constant hospital visits.",
        patient: "Maria Santos",
        procedure: "Digital Therapeutics",
        rating: 5,
      },
    ],
    facilityHighlights: [
      {
        title: "Innovation Lab",
        copy: "Research facility where new medical technologies are developed and tested.",
      },
      {
        title: "Smart Rooms",
        copy: "IoT-enabled patient rooms with voice-controlled systems.",
      },
      {
        title: "Data Center",
        copy: "Secure, HIPAA-compliant infrastructure powering all digital services.",
      },
    ],
    programs: [
      {
        title: "Virtual Care Hub",
        meta: "Always Available",
        description: "24/7 telehealth with instant specialist connections.",
      },
      {
        title: "Health Analytics",
        meta: "Data-Driven",
        description: "Predictive health insights from continuous monitoring.",
      },
    ],
    footer: {
      contact: {
        phone: "+1 (800) HEALTH-1",
        email: "connect@healthtechmed.com",
        location: "Boston, Massachusetts, USA",
      },
      quickLinks: ["Digital Health App", "AI Services", "Research", "Careers"],
    },
  },
  "healthcare-saas": {
    id: "healthcare-saas",
    hero: {
      eyebrow: "Enterprise Healthcare Platform",
      title: "Transform Your Hospital Operations",
      subtitle:
        "The complete SaaS solution for modern healthcare institutions. Streamline operations, enhance patient care, and drive growth.",
      primaryCta: { label: "Start Free Trial", href: "/trial" },
      secondaryCta: { label: "Watch Demo", href: "/demo" },
      stats: [
        { label: "Hospitals Served", value: "500+" },
        { label: "Countries", value: "30+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Support", value: "24/7" },
      ],
      heroImageAlt: "Healthcare dashboard on modern devices",
    },
    palette: {
      background: "#ffffff",
      surface: "#f9fafb",
      accent: "#34A853",
      accentMuted: "#dcfce7",
      text: "#111827",
      textMuted: "#6b7280",
      gradient: "linear-gradient(135deg, #34A853, #22c55e)",
    },
    typography: {
      heading: '"Inter", system-ui, sans-serif',
      body: '"Inter", system-ui, sans-serif',
    },
    specialties: [
      {
        icon: "📅",
        title: "Smart Scheduling",
        description:
          "AI-powered appointment management that maximizes efficiency.",
      },
      {
        icon: "📦",
        title: "Inventory Management",
        description: "Real-time tracking and automated reordering systems.",
      },
      {
        icon: "💳",
        title: "Billing & Revenue",
        description: "Streamlined billing with insurance integration.",
      },
      {
        icon: "📊",
        title: "Analytics Dashboard",
        description: "Comprehensive insights for data-driven decisions.",
      },
    ],
    differentiators: [
      {
        title: "Enterprise Ready",
        description:
          "Scalable infrastructure designed for large healthcare networks.",
        icon: "🏢",
      },
      {
        title: "Compliance First",
        description: "HIPAA, GDPR, and SOC 2 compliant by design.",
        icon: "🔒",
      },
      {
        title: "Seamless Integration",
        description: "Connect with existing EHR, EMR, and third-party systems.",
        icon: "🔗",
      },
    ],
    doctors: [
      {
        name: "John Smith",
        specialty: "CEO, Metro Health Network",
        description:
          "Transformed our 50-hospital network operations with remarkable results.",
        mediaLabel: "Read Case Study",
      },
      {
        name: "Dr. Amanda Foster",
        specialty: "CMO, Regional Medical",
        description:
          "Reduced administrative overhead by 40% in the first year.",
        mediaLabel: "View Results",
      },
    ],
    testimonials: [
      {
        quote:
          "This platform revolutionized how we manage our hospital operations. The ROI was visible within months.",
        patient: "James Wilson",
        procedure: "CEO, HealthFirst Group",
        rating: 5,
      },
      {
        quote:
          "Finally, a healthcare SaaS that understands enterprise needs. The support team is exceptional.",
        patient: "Dr. Rebecca Liu",
        procedure: "Director, City Medical",
        rating: 5,
      },
    ],
    facilityHighlights: [
      {
        title: "Cloud Infrastructure",
        copy: "Enterprise-grade cloud hosting with global availability.",
      },
      {
        title: "API First",
        copy: "Comprehensive APIs for custom integrations and workflows.",
      },
      {
        title: "White Label Ready",
        copy: "Fully customizable branding for your organization.",
      },
    ],
    programs: [
      {
        title: "Enterprise Plan",
        meta: "Full Platform",
        description: "Complete solution for large healthcare networks.",
      },
      {
        title: "Growth Plan",
        meta: "Scale Up",
        description: "Perfect for growing hospitals and clinics.",
      },
    ],
    footer: {
      contact: {
        phone: "+1 (888) 555-0123",
        email: "enterprise@healthcaresaas.com",
        location: "Headquarters: New York, NY",
      },
      quickLinks: ["Features", "Pricing", "Case Studies", "API Docs"],
    },
  },
};
