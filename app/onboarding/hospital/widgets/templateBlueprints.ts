import type { TemplateData } from '@/contexts/HospitalOnboardingContextV2';

export type TemplateBlueprint = {
  id: TemplateData['id'];
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

export const TEMPLATE_BLUEPRINTS: Record<string, TemplateBlueprint> = {
  'modern-healthcare': {
    id: 'modern-healthcare',
    hero: {
      eyebrow: 'Flagship Smart Hospital',
      title: 'InspireCare Medical City',
      subtitle:
        'Hybrid hospital campus combining advanced robotics, precision oncology, and 24/7 connected care across four continents.',
      primaryCta: { label: 'Book an Appointment', href: '/appointments' },
      secondaryCta: { label: 'Explore Departments', href: '/departments' },
      stats: [
        { label: 'Centres of Excellence', value: '12' },
        { label: 'Doctors', value: '380+' },
        { label: 'Countries Served', value: '22' },
      ],
      heroImageAlt: 'Cutting-edge hybrid operating room',
    },
    palette: {
      background: '#f7fafc',
      surface: '#ffffff',
      accent: '#0E9F9F',
      accentMuted: '#9AE6B4',
      text: '#0f172a',
      textMuted: '#475569',
      gradient: 'linear-gradient(135deg, #0E9F9F, #2563EB)',
    },
    typography: {
      heading: '"Space Grotesk", Inter, sans-serif',
      body: 'Inter, "Noto Sans", system-ui, sans-serif',
    },
    specialties: [
      { icon: '🫀', title: 'Cardiac Sciences', description: 'Structural heart program with 45-minute door-to-balloon KPI.' },
      { icon: '🧠', title: 'Neuro & Spine', description: 'Deep brain stimulation, intra-op MRI, and 360º rehab labs.' },
      { icon: '🧬', title: 'Precision Oncology', description: 'Molecular Tumor Board + on-site genomic sequencing.' },
      { icon: '🤖', title: 'Robotics Institute', description: 'Da Vinci Xi + VELYS suite with immersive patient education.' },
    ],
    differentiators: [
      { title: 'Remote ICU Command', description: 'Tele-ICU pods monitor 120 beds with AI escalation playbooks.' },
      { title: 'Global Second Opinion', description: '48-hour consult promise backed by specialist roster in 8 regions.' },
      { title: 'Sustainable Campus', description: 'LEED Platinum campus powered by onsite trigeneration and rain harvesting.' },
    ],
    doctors: [
      {
        name: 'Dr. Mira Thakur',
        specialty: 'Chief of Interventional Cardiology',
        description: 'Pioneer of zero-contrast PCI program with >2,400 structural interventions.',
        mediaLabel: 'Watch Cath Lab Walkthrough',
      },
      {
        name: 'Dr. Emiliano Costa',
        specialty: 'Director, Adaptive Oncology',
        description: 'Leads CAR-T program & tumor response lab for rare cancers.',
        mediaLabel: 'Explore Oncology Precision Suite',
      },
    ],
    testimonials: [
      {
        quote: '“Three countries turned us away. InspireCare rebuilt my son’s spine in 9 hours flat.”',
        patient: 'Priyanka & Aarav',
        procedure: 'Pediatric scoliosis reconstruction',
      },
      {
        quote: '“Remote ICU kept dad stable until we could fly in. The handoff was seamless.”',
        patient: 'Anjali Verma',
        procedure: 'Tele-ICU stabilization + cardiac bypass',
      },
    ],
    facilityHighlights: [
      { title: 'Hybrid OR Complex', copy: 'Four ORs with ceiling-mounted angiography & intra-op CT.' },
      { title: 'Regenerative Med Lab', copy: 'cGMP suites for cell therapies & autologous implants.' },
      { title: 'Family Recovery Suites', copy: 'Biophilic design, circadian lighting, private concierge.' },
    ],
    programs: [
      { title: 'Global Exec Health', meta: '5-day concierge program', description: 'Metabolic, cardiac, neuro-cog, genomic panel + lifestyle labs.' },
      { title: 'Onco Navigation Hub', meta: 'Personalized pathway', description: 'Tumor board in 72 hrs, travel concierge, visa desk, lodging.' },
      { title: 'Heritage Mother & Child', meta: 'Level IV NICU', description: 'Neuroprotective neonatal suites & integrative lactation studio.' },
    ],
    footer: {
      contact: {
        phone: '+91 22 4000 1414',
        email: 'navigator@inspirecare.health',
        location: 'BKC, Mumbai · Dubai · Singapore · Nairobi',
      },
      quickLinks: ['Centres of Excellence', 'International Patients', 'Clinical Trials', 'Virtual Tour'],
    },
  },
  'telehealth-first': {
    id: 'telehealth-first',
    hero: {
      eyebrow: 'Cloud Native Hospital',
      title: 'PulseConnect Virtual Hospital',
      subtitle:
        'Nationwide mesh of teleclinics, diagnostics drones, and same-day infusion lounges built for chronic care at home.',
      primaryCta: { label: 'Start a Virtual Visit', href: '/virtual-care' },
      secondaryCta: { label: 'Find a Micro-Clinic', href: '/locations' },
      stats: [
        { label: 'Teleclinics', value: '63' },
        { label: 'Home Care Cities', value: '28' },
        { label: 'Avg. Wait', value: '06 min' },
      ],
      heroImageAlt: 'Nurse monitoring virtual care wall',
    },
    palette: {
      background: '#f0f9ff',
      surface: '#ffffff',
      accent: '#2563EB',
      accentMuted: '#DBEAFE',
      text: '#0f172a',
      textMuted: '#475569',
      gradient: 'linear-gradient(135deg, #2563EB, #06B6D4)',
    },
    typography: {
      heading: '"Sora", "Inter", sans-serif',
      body: 'Inter, "IBM Plex Sans", system-ui, sans-serif',
    },
    specialties: [
      { icon: '💓', title: 'Cardio-Metabolic Pods', description: 'Bluetooth vitals + AI arrhythmia triage.' },
      { icon: '🩺', title: 'Women’s OmniCare', description: 'Hybrid OB, fertility, lactation & pelvic rehab pods.' },
      { icon: '🫁', title: 'Respiratory Network', description: 'At-home COPD program with portable FeNO labs.' },
      { icon: '🧠', title: 'Behavioral Studio', description: 'Group CBT, adolescent telepsychiatry, VR mindfulness.' },
    ],
    differentiators: [
      { title: '6-Minute Intake', description: 'Identity, insurance, history synced from payer APIs & wearables.' },
      { title: 'Field Infusion Vans', description: 'Nurse-led biologic therapy at patient homes with cold-chain assurance.' },
      { title: 'Data Trust Layer', description: 'FHIR native vault + consent orchestration for multi-tenant sharing.' },
    ],
    doctors: [
      {
        name: 'Dr. Laila Nadar',
        specialty: 'Chief Virtualist',
        description: 'Builds asynchronous-first care models for diabetes and heart failure.',
        mediaLabel: 'See Remote Monitoring Stack',
      },
      {
        name: 'Dr. Kenji Iwata',
        specialty: 'Mental Health Design Lead',
        description: 'Runs multilingual therapy pods with AI-assisted triage & escalation.',
        mediaLabel: 'Tour Behavioral Studio',
      },
    ],
    testimonials: [
      {
        quote: '“Weekly infusion at home means zero missed PT sessions. Nurses feel like family.”',
        patient: 'Rafael Torres',
        procedure: 'Biologic therapy + remote physio',
      },
      {
        quote: '“My mom’s heart failure plan is all on the app. Alerts go to me and the care coach.”',
        patient: 'Meera Joseph',
        procedure: 'Cardio-metabolic at-home bundle',
      },
    ],
    facilityHighlights: [
      { title: 'Telemetry Command', copy: '96-screen situational wall triages AI alerts + human escalation.' },
      { title: 'Drop-in Lounges', copy: 'Micro-clinics with IV suites, labs, imaging pods, respite nooks.' },
      { title: 'Mobility Fleet', copy: 'EV vans for pharmacy, respiratory therapy, and ultrasound-on-wheels.' },
    ],
    programs: [
      { title: 'Chronic Heart Hub', meta: 'Remote + in-person', description: 'Loop recorders, titration clinics, caregiver academies.' },
      { title: 'Post-Op Anywhere', meta: 'Day 0 to Day 45', description: 'Vitals kits, scar imaging, virtual rounds + priority transfers.' },
      { title: 'Neuro Balance', meta: 'Falls prevention', description: 'Smart mats, Tai Chi telecoaching, OT drop-ins.' },
    ],
    footer: {
      contact: {
        phone: '+1 (415) 555-0146',
        email: 'hello@pulseconnect.health',
        location: 'HQ: Austin · Pods across US, MX, SG',
      },
      quickLinks: ['Virtual Care App', 'Insurance Partners', 'For Employers', 'Clinical Research'],
    },
  },
  heritage: {
    id: 'heritage',
    hero: {
      eyebrow: '125 Years of Trust',
      title: 'St. Raphael Heritage Medical Centre',
      subtitle: 'Faith-rooted academic hospital blending classical hospitality with cutting-edge transplant science.',
      primaryCta: { label: 'Plan Your Visit', href: '/visit' },
      secondaryCta: { label: 'Meet Our Physicians', href: '/physicians' },
      stats: [
        { label: 'Founded', value: '1898' },
        { label: 'Transplant Survival', value: '96%' },
        { label: 'Teaching Chairs', value: '42' },
      ],
      heroImageAlt: 'Historic hospital courtyard with cloisters',
    },
    palette: {
      background: '#fefcf5',
      surface: '#ffffff',
      accent: '#B45309',
      accentMuted: '#FDE68A',
      text: '#1f2937',
      textMuted: '#6b7280',
      gradient: 'linear-gradient(135deg, #B45309, #92400E)',
    },
    typography: {
      heading: '"Playfair Display", "IBM Plex Serif", serif',
      body: '"Source Sans Pro", system-ui, sans-serif',
    },
    specialties: [
      { icon: '🫁', title: 'Pulmonology', description: 'Heritage lung institute with ECMO retrieval teams.' },
      { icon: '🫀', title: 'Transplant Sciences', description: 'Heart, liver, and pancreas programs with family apartments.' },
      { icon: '👶', title: 'Neonatal & Fetal Care', description: 'Level IV NICU & fetal surgery fellowship.' },
      { icon: '🧎', title: 'Palliative & Pastoral', description: 'Interfaith chaplaincy + pain innovation lab.' },
    ],
    differentiators: [
      { title: 'Heritage Hospitality', description: 'Concierge nuns + heritage bakery comforting families.' },
      { title: 'Scholar Clinics', description: 'Physicians double as professors with bedside rounds for students.' },
      { title: 'Art & Healing', description: 'Music therapy, stained glass tours, clinical humanities museum.' },
    ],
    doctors: [
      {
        name: 'Dr. Aileen Rosario',
        specialty: 'Cardiothoracic Surgeon',
        description: 'Heads heritage transplant lab with donor stewardship team.',
        mediaLabel: 'Watch Heart Team Documentary',
      },
      {
        name: 'Dr. Thomas Bellamy',
        specialty: 'Neonatologist-in-Chief',
        description: 'Runs Golden Hour protocol & developmental care mentoring.',
        mediaLabel: 'See NICU Family Suites',
      },
    ],
    testimonials: [
      {
        quote: '“The chaplain held our hands through transplant waitlists and beyond.”',
        patient: 'Javier & Lucia Serrano',
        procedure: 'Dual organ transplant',
      },
      {
        quote: '“Nurses sang lullabies in three languages. We never felt alone.”',
        patient: 'The Bennett Family',
        procedure: 'NICU stay · 102 days',
      },
    ],
    facilityHighlights: [
      { title: 'Cloister Gardens', copy: 'Heritage courtyards for respite, ecotherapy, and pastoral care.' },
      { title: 'Heritage Library', copy: 'Rare medical archives + collaborative learning studios.' },
      { title: 'Guest Residences', copy: '41 family suites with shared kitchens + telechapel.' },
    ],
    programs: [
      { title: 'Sacred Heart Program', meta: 'Transplant readiness', description: 'Family counseling, donor liaison, prayer circles.' },
      { title: 'Lumina Birth Collective', meta: 'Mother-baby continuum', description: 'Doula pods, pelvic floor studio, NICU transition coaching.' },
      { title: 'Scholars-in-Service', meta: 'Academic immersion', description: 'Clinical electives + heritage leadership seminars.' },
    ],
    footer: {
      contact: {
        phone: '+44 20 7123 4750',
        email: 'welcome@straphael.org',
        location: 'Chelsea, London · Dublin · Kochi',
      },
      quickLinks: ['Heritage Timeline', 'Support the Mission', 'Pastoral Care', 'Residency Programs'],
    },
  },
};
