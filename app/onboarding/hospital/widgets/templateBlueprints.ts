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
  specialties: Array<{ name: string; icon: string; description: string }>;
  differentiators: Array<{ title: string; description: string; icon: string }>;
  doctors: Array<{
    name: string;
    title: string;
    specialty: string;
    image: string;
    experience: string;
  }>;
  testimonials: Array<{
    name: string;
    quote: string;
    rating: number;
    location: string;
  }>;
  facilityHighlights: Array<{ title: string; description: string; image: string }>;
  programs: Array<{ name: string; description: string; icon: string }>;
  footer: {
    tagline: string;
    copyright: string;
    links: Array<{ label: string; href: string }>;
  };
  about?: {
    title: string;
    subtitle: string;
    description: string;
    highlights: Array<{ label: string; value: string }>;
  };
  infrastructureCards?: Array<{ title: string; description: string; icon: string }>;
  centersOfExcellence?: Array<{ name: string; icon: string; description: string }>;
  services?: Array<{ name: string; icon: string; description: string }>;
  internationalPatients?: {
    title: string;
    description: string;
    features: Array<string>;
  };
  news?: Array<{ title: string; date: string; excerpt: string; image: string }>;
  breakthroughCases?: Array<{ title: string; description: string; doctor: string; outcome: string }>;
  faqs?: Array<{ question: string; answer: string }>;
};

export const templateBlueprints: Record<TemplateData['id'], TemplateBlueprint> = {
  'modern-healthcare': {
    id: 'modern-healthcare',
    hero: {
      eyebrow: 'Welcome to Excellence',
      title: 'Your Health, Our Priority',
      subtitle: 'Experience world-class healthcare with cutting-edge technology and compassionate care.',
      primaryCta: { label: 'Book Appointment', href: '/appointments' },
      secondaryCta: { label: 'Our Services', href: '/services' },
      stats: [
        { label: 'Expert Doctors', value: '200+' },
        { label: 'Hospital Beds', value: '500+' },
        { label: 'Happy Patients', value: '50K+' },
        { label: 'Specialities', value: '40+' },
      ],
      heroImageAlt: 'Modern hospital facility',
    },
    palette: {
      background: '#ffffff',
      surface: '#f8fafc',
      accent: '#0ea5e9',
      accentMuted: '#e0f2fe',
      text: '#0f172a',
      textMuted: '#64748b',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    },
    typography: { heading: 'font-sans font-bold', body: 'font-sans' },
    specialties: [
      { name: 'Cardiology', icon: 'Heart', description: 'Comprehensive heart care with advanced diagnostics' },
      { name: 'Neurology', icon: 'Brain', description: 'Expert neurological treatments and surgery' },
      { name: 'Orthopedics', icon: 'Bone', description: 'Joint replacement and sports medicine' },
      { name: 'Oncology', icon: 'Ribbon', description: 'Cancer treatment with latest therapies' },
      { name: 'Gastroenterology', icon: 'Activity', description: 'Digestive health and liver care' },
      { name: 'Pediatrics', icon: 'Baby', description: 'Specialized care for children' },
    ],
    differentiators: [
      { title: 'Advanced Technology', description: 'State-of-the-art medical equipment', icon: 'Cpu' },
      { title: '24/7 Emergency', description: 'Round-the-clock emergency services', icon: 'Clock' },
      { title: 'Expert Team', description: 'Internationally trained specialists', icon: 'Users' },
      { title: 'Patient First', description: 'Personalized care approach', icon: 'Heart' },
    ],
    doctors: [
      { name: 'Dr. Rajesh Kumar', title: 'Chief Cardiologist', specialty: 'Cardiology', image: '/doctors/1.jpg', experience: '25+ years' },
      { name: 'Dr. Priya Sharma', title: 'Senior Neurologist', specialty: 'Neurology', image: '/doctors/2.jpg', experience: '20+ years' },
      { name: 'Dr. Amit Patel', title: 'Orthopedic Surgeon', specialty: 'Orthopedics', image: '/doctors/3.jpg', experience: '18+ years' },
    ],
    testimonials: [
      { name: 'Rahul Verma', quote: 'Exceptional care and treatment. The staff was incredibly supportive.', rating: 5, location: 'Delhi' },
      { name: 'Sunita Devi', quote: 'World-class facilities and compassionate doctors. Highly recommend.', rating: 5, location: 'Noida' },
      { name: 'Arun Mehta', quote: 'The emergency care team saved my life. Forever grateful.', rating: 5, location: 'Gurgaon' },
    ],
    facilityHighlights: [
      { title: 'ICU & Critical Care', description: 'Advanced multi-specialty ICU', image: '/facilities/icu.jpg' },
      { title: 'Operation Theaters', description: 'Modular OTs with laminar flow', image: '/facilities/ot.jpg' },
      { title: 'Diagnostic Center', description: 'Complete diagnostic services', image: '/facilities/diagnostic.jpg' },
    ],
    programs: [
      { name: 'Health Checkup', description: 'Comprehensive health packages', icon: 'ClipboardCheck' },
      { name: 'Second Opinion', description: 'Expert medical consultations', icon: 'MessageSquare' },
      { name: 'Home Care', description: 'Quality care at your doorstep', icon: 'Home' },
    ],
    footer: {
      tagline: 'Committed to Excellence in Healthcare',
      copyright: '2024 Hospital. All rights reserved.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
  },
  'telehealth-first': {
    id: 'telehealth-first',
    hero: {
      eyebrow: 'Healthcare at Your Fingertips',
      title: 'Virtual Care, Real Results',
      subtitle: 'Connect with top doctors from the comfort of your home.',
      primaryCta: { label: 'Start Consultation', href: '/teleconsult' },
      secondaryCta: { label: 'Download App', href: '/app' },
      stats: [
        { label: 'Online Doctors', value: '500+' },
        { label: 'Consultations', value: '100K+' },
        { label: 'App Downloads', value: '1M+' },
        { label: 'Cities Covered', value: '200+' },
      ],
      heroImageAlt: 'Doctor on video call',
    },
    palette: {
      background: '#f0fdf4',
      surface: '#ffffff',
      accent: '#22c55e',
      accentMuted: '#dcfce7',
      text: '#14532d',
      textMuted: '#4d7c0f',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    },
    typography: { heading: 'font-sans font-bold', body: 'font-sans' },
    specialties: [
      { name: 'General Medicine', icon: 'Stethoscope', description: 'Primary care consultations' },
      { name: 'Mental Health', icon: 'Brain', description: 'Therapy and counseling' },
      { name: 'Dermatology', icon: 'User', description: 'Skin care consultations' },
      { name: 'Pediatrics', icon: 'Baby', description: 'Child healthcare' },
      { name: 'Gynecology', icon: 'Heart', description: 'Womens health services' },
      { name: 'Nutrition', icon: 'Apple', description: 'Diet and wellness' },
    ],
    differentiators: [
      { title: 'Instant Access', description: 'Connect with doctors in minutes', icon: 'Zap' },
      { title: 'Affordable Care', description: 'Consultations starting Rs199', icon: 'IndianRupee' },
      { title: 'Digital Records', description: 'All prescriptions stored securely', icon: 'FileText' },
      { title: 'Follow-up Free', description: '7-day free follow-up included', icon: 'RefreshCw' },
    ],
    doctors: [
      { name: 'Dr. Neha Gupta', title: 'General Physician', specialty: 'General Medicine', image: '/doctors/4.jpg', experience: '15+ years' },
      { name: 'Dr. Vikram Singh', title: 'Psychiatrist', specialty: 'Mental Health', image: '/doctors/5.jpg', experience: '12+ years' },
      { name: 'Dr. Anjali Rao', title: 'Dermatologist', specialty: 'Dermatology', image: '/doctors/6.jpg', experience: '10+ years' },
    ],
    testimonials: [
      { name: 'Pooja Kapoor', quote: 'Got my prescription within 15 minutes. So convenient!', rating: 5, location: 'Mumbai' },
      { name: 'Karan Malhotra', quote: 'The mental health support helped me through a tough time.', rating: 5, location: 'Bangalore' },
      { name: 'Meera Nair', quote: 'Perfect for busy professionals. Quality care without the wait.', rating: 5, location: 'Chennai' },
    ],
    facilityHighlights: [
      { title: 'HD Video Calls', description: 'Crystal clear consultations', image: '/facilities/video.jpg' },
      { title: 'E-Prescriptions', description: 'Digital prescriptions instantly', image: '/facilities/rx.jpg' },
      { title: 'Lab Integration', description: 'Book tests from the app', image: '/facilities/lab.jpg' },
    ],
    programs: [
      { name: 'Corporate Wellness', description: 'Employee health programs', icon: 'Building' },
      { name: 'Chronic Care', description: 'Long-term condition management', icon: 'Activity' },
      { name: 'Mental Wellness', description: 'Therapy and counseling packages', icon: 'Heart' },
    ],
    footer: {
      tagline: 'Healthcare Without Boundaries',
      copyright: '2024 TeleHealth. All rights reserved.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Help Center', href: '/help' },
      ],
    },
  },
  'heritage': {
    id: 'heritage',
    hero: {
      eyebrow: 'Trusted Since 1965',
      title: 'A Legacy of Healing',
      subtitle: 'Three generations of medical excellence serving our community.',
      primaryCta: { label: 'Book Appointment', href: '/appointments' },
      secondaryCta: { label: 'Our History', href: '/about' },
      stats: [
        { label: 'Years of Service', value: '59+' },
        { label: 'Families Served', value: '100K+' },
        { label: 'Expert Doctors', value: '150+' },
        { label: 'Specialties', value: '35+' },
      ],
      heroImageAlt: 'Heritage hospital building',
    },
    palette: {
      background: '#fefce8',
      surface: '#ffffff',
      accent: '#ca8a04',
      accentMuted: '#fef3c7',
      text: '#422006',
      textMuted: '#854d0e',
      gradient: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
    },
    typography: { heading: 'font-serif font-bold', body: 'font-sans' },
    specialties: [
      { name: 'General Surgery', icon: 'Scissors', description: 'Traditional and modern surgical care' },
      { name: 'Internal Medicine', icon: 'Stethoscope', description: 'Comprehensive internal medicine' },
      { name: 'Obstetrics', icon: 'Baby', description: 'Maternity and childbirth care' },
      { name: 'Ophthalmology', icon: 'Eye', description: 'Complete eye care services' },
      { name: 'ENT', icon: 'Ear', description: 'Ear, nose, and throat care' },
      { name: 'Ayurveda', icon: 'Leaf', description: 'Traditional healing practices' },
    ],
    differentiators: [
      { title: 'Time-Tested Care', description: 'Proven treatment protocols', icon: 'Clock' },
      { title: 'Community Trust', description: 'Generations of families trust us', icon: 'Users' },
      { title: 'Holistic Approach', description: 'Modern and traditional medicine', icon: 'Sparkles' },
      { title: 'Personal Touch', description: 'We know our patients by name', icon: 'Heart' },
    ],
    doctors: [
      { name: 'Dr. Ramesh Sharma', title: 'Chief Medical Officer', specialty: 'Internal Medicine', image: '/doctors/7.jpg', experience: '40+ years' },
      { name: 'Dr. Lakshmi Iyer', title: 'Senior Surgeon', specialty: 'General Surgery', image: '/doctors/8.jpg', experience: '35+ years' },
      { name: 'Dr. Suresh Menon', title: 'Obstetrician', specialty: 'Obstetrics', image: '/doctors/9.jpg', experience: '30+ years' },
    ],
    testimonials: [
      { name: 'Venkatesh Rao', quote: 'My family has been coming here for three generations.', rating: 5, location: 'Hyderabad' },
      { name: 'Kamala Devi', quote: 'The doctors here truly care. They treated me like family.', rating: 5, location: 'Vijayawada' },
      { name: 'Ravi Kumar', quote: 'Traditional values with modern medicine. Best of both worlds.', rating: 5, location: 'Guntur' },
    ],
    facilityHighlights: [
      { title: 'Heritage Building', description: 'Iconic architecture since 1965', image: '/facilities/heritage.jpg' },
      { title: 'Ayurveda Center', description: 'Traditional healing therapies', image: '/facilities/ayurveda.jpg' },
      { title: 'Modern Wing', description: 'Latest medical technology', image: '/facilities/modern.jpg' },
    ],
    programs: [
      { name: 'Senior Care', description: 'Geriatric health programs', icon: 'Heart' },
      { name: 'Wellness Retreats', description: 'Ayurvedic rejuvenation', icon: 'Leaf' },
      { name: 'Community Health', description: 'Free health camps', icon: 'Users' },
    ],
    footer: {
      tagline: 'Where Tradition Meets Modern Medicine',
      copyright: '2024 Heritage Hospital. All rights reserved.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Our Legacy', href: '/legacy' },
      ],
    },
  },
  'yashoda-inspired': {
    id: 'yashoda-inspired',
    hero: {
      eyebrow: 'Centre of Excellence',
      title: 'World-Class Healthcare, Compassionate Care',
      subtitle: 'A leading multi-super specialty hospital providing comprehensive healthcare services with state-of-the-art infrastructure.',
      primaryCta: { label: 'Book Appointment', href: '/appointments' },
      secondaryCta: { label: 'Emergency: 1800-XXX-XXXX', href: 'tel:1800XXXXXXX' },
      stats: [
        { label: 'Expert Doctors', value: '200+' },
        { label: 'Hospital Beds', value: '800+' },
        { label: 'Dedicated Staff', value: '500+' },
        { label: 'Specialities', value: '65+' },
      ],
      heroImageAlt: 'Modern super-specialty hospital building',
    },
    palette: {
      background: '#ffffff',
      surface: '#f1f5f9',
      accent: '#0d9488',
      accentMuted: '#ccfbf1',
      text: '#0f172a',
      textMuted: '#475569',
      gradient: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
    },
    typography: { heading: 'font-sans font-bold', body: 'font-sans' },
    about: {
      title: 'About Us',
      subtitle: 'Medicity - Where Healthcare Meets Excellence',
      description: 'Our hospital is a beacon of medical excellence, offering comprehensive healthcare services across 65+ specialties with world-class infrastructure and internationally trained doctors.',
      highlights: [
        { label: 'Beds Capacity', value: '800+' },
        { label: 'Expert Doctors', value: '200+' },
        { label: 'Specialties', value: '65+' },
        { label: 'Years of Excellence', value: '20+' },
      ],
    },
    infrastructureCards: [
      { title: 'Robotic Surgery Centre', description: 'Advanced Da Vinci Xi surgical system for minimally invasive procedures', icon: 'Bot' },
      { title: 'Advanced Imaging Suite', description: '3T MRI, PET-CT, and 256-slice CT scanner for precise diagnostics', icon: 'Scan' },
      { title: 'Hybrid Cath Labs', description: 'State-of-the-art cardiac catheterization laboratories', icon: 'Heart' },
      { title: 'Modular Operation Theatres', description: '20+ modular OTs with HEPA filtration and laminar airflow', icon: 'Scissors' },
    ],
    centersOfExcellence: [
      { name: 'Cancer Institute', icon: 'Ribbon', description: 'Comprehensive oncology care with latest treatment modalities' },
      { name: 'Cardiac Sciences', icon: 'Heart', description: 'Complete heart care from diagnostics to transplants' },
      { name: 'Gastroenterology & Liver', icon: 'Activity', description: 'Advanced GI and liver disease management' },
      { name: 'Pediatrics & Neonatology', icon: 'Baby', description: 'Specialized care for newborns and children' },
      { name: 'Orthopedics & Joint Replacement', icon: 'Bone', description: 'Joint replacement and sports medicine center' },
      { name: 'Neurosciences', icon: 'Brain', description: 'Brain and spine care with neuro-navigation' },
      { name: 'Robotic Surgery', icon: 'Bot', description: 'Precision surgery with robotic assistance' },
      { name: 'Renal Sciences', icon: 'Droplet', description: 'Kidney care and transplant services' },
    ],
    specialties: [
      { name: 'Cancer Institute', icon: 'Ribbon', description: 'Comprehensive oncology care' },
      { name: 'Cardiac Sciences', icon: 'Heart', description: 'Complete heart care' },
      { name: 'Gastroenterology', icon: 'Activity', description: 'GI and liver care' },
      { name: 'Pediatrics', icon: 'Baby', description: 'Child healthcare' },
      { name: 'Orthopedics', icon: 'Bone', description: 'Joint and bone care' },
      { name: 'Neurosciences', icon: 'Brain', description: 'Brain and spine' },
    ],
    doctors: [
      { name: 'Dr. Suresh Reddy', title: 'Director - Cardiac Sciences', specialty: 'Interventional Cardiology', image: '/doctors/y1.jpg', experience: '30+ years' },
      { name: 'Dr. Anita Sharma', title: 'HOD - Oncology', specialty: 'Medical Oncology', image: '/doctors/y2.jpg', experience: '25+ years' },
      { name: 'Dr. Rajiv Gupta', title: 'Chief - Neurosurgery', specialty: 'Neurosurgery', image: '/doctors/y3.jpg', experience: '28+ years' },
      { name: 'Dr. Priya Nair', title: 'Director - Pediatrics', specialty: 'Pediatric Intensive Care', image: '/doctors/y4.jpg', experience: '22+ years' },
    ],
    services: [
      { name: 'Blood Centre', icon: 'Droplet', description: '24/7 blood bank with rare blood groups' },
      { name: 'Ambulance Services', icon: 'Truck', description: 'Fleet of advanced life support ambulances' },
      { name: '24x7 Pharmacy', icon: 'Pill', description: 'Round-the-clock pharmacy services' },
      { name: 'Diagnostic Lab', icon: 'FlaskConical', description: 'NABL accredited pathology lab' },
      { name: 'Radiology', icon: 'Scan', description: 'Advanced imaging services' },
      { name: 'Health Checkup', icon: 'ClipboardCheck', description: 'Comprehensive health packages' },
    ],
    internationalPatients: {
      title: 'International Patient Services',
      description: 'We welcome patients from across the globe and provide comprehensive assistance for international patients seeking world-class healthcare in India.',
      features: [
        'Visa Assistance & Documentation',
        'Airport Pickup & Drop',
        'Dedicated International Patient Coordinators',
        'Language Interpretation Services',
        'Accommodation Arrangements',
        'Currency Exchange & Travel Desk',
        'Telemedicine Follow-up',
        'Medical Tourism Packages',
      ],
    },
    news: [
      { title: 'Hospital Achieves NABH Accreditation', date: '2024-01-15', excerpt: 'Our commitment to quality healthcare recognized with prestigious accreditation.', image: '/news/nabh.jpg' },
      { title: 'New Robotic Surgery Centre Inaugurated', date: '2024-02-20', excerpt: 'State-of-the-art Da Vinci Xi system now operational for complex surgeries.', image: '/news/robotic.jpg' },
      { title: '1000th Successful Heart Transplant', date: '2024-03-10', excerpt: 'Cardiac team achieves milestone with record success rate.', image: '/news/heart.jpg' },
    ],
    breakthroughCases: [
      { title: 'Complex Pediatric Heart Surgery', description: 'Successfully performed rare pediatric cardiac procedure on 6-month-old', doctor: 'Dr. Suresh Reddy', outcome: 'Full recovery, child now healthy' },
      { title: 'Robotic Cancer Surgery', description: 'Minimally invasive robotic surgery for complex pancreatic cancer', doctor: 'Dr. Anita Sharma', outcome: 'Cancer-free, minimal recovery time' },
      { title: 'Brain Tumor Removal', description: 'Successful removal of deep-seated brain tumor using neuro-navigation', doctor: 'Dr. Rajiv Gupta', outcome: 'Complete tumor removal, no deficits' },
    ],
    testimonials: [
      { name: 'Mohan Kumar', quote: 'The cardiac team saved my life. From diagnosis to surgery, the care was exceptional.', rating: 5, location: 'Dubai, UAE' },
      { name: 'Sarah Thompson', quote: 'Traveled from UK for treatment. The international patient services made everything seamless.', rating: 5, location: 'London, UK' },
      { name: 'Pradeep Singh', quote: 'My mother received the best cancer treatment here. The oncology team was compassionate and skilled.', rating: 5, location: 'Delhi, India' },
      { name: 'Fatima Ahmed', quote: 'The robotic surgery center is truly state-of-the-art. Minimal pain and quick recovery.', rating: 5, location: 'Muscat, Oman' },
    ],
    faqs: [
      { question: 'How do I book an appointment?', answer: 'You can book an appointment online through our website, call our helpline at 1800-XXX-XXXX, or visit our reception desk. Online booking is available 24/7.' },
      { question: 'What insurance plans do you accept?', answer: 'We accept all major insurance providers including government schemes like Ayushman Bharat. Our TPA desk assists with cashless claims.' },
      { question: 'Is emergency care available 24/7?', answer: 'Yes, our emergency department operates round-the-clock with trauma care, critical care, and advanced life support services.' },
      { question: 'Do you provide international patient services?', answer: 'Yes, we have a dedicated international patient wing with visa assistance, airport transfers, language interpretation, and accommodation arrangements.' },
      { question: 'What are your visiting hours?', answer: 'General visiting hours are 11 AM - 1 PM and 5 PM - 7 PM. ICU visiting is limited to immediate family during specific hours.' },
    ],
    differentiators: [
      { title: 'World-Class Technology', description: 'Latest medical equipment and robotic surgery systems', icon: 'Cpu' },
      { title: '24/7 Emergency Care', description: 'Round-the-clock trauma and critical care', icon: 'Clock' },
      { title: 'Expert Medical Team', description: '200+ doctors with international training', icon: 'Users' },
      { title: 'Patient-Centric Care', description: 'Personalized treatment plans for every patient', icon: 'Heart' },
      { title: 'NABH Accredited', description: 'Recognized for quality and safety standards', icon: 'Award' },
      { title: 'International Standards', description: 'JCI quality protocols and infection control', icon: 'Globe' },
    ],
    facilityHighlights: [
      { title: 'Multi-Specialty ICU', description: '100+ bed ICU with advanced monitoring', image: '/facilities/icu.jpg' },
      { title: 'Modular OT Complex', description: '20+ operation theatres with laminar flow', image: '/facilities/ot.jpg' },
      { title: 'Diagnostic Centre', description: 'One-stop diagnostic services', image: '/facilities/diagnostic.jpg' },
      { title: 'Rehabilitation Center', description: 'Comprehensive physiotherapy services', image: '/facilities/rehab.jpg' },
    ],
    programs: [
      { name: 'Executive Health Checkup', description: 'Comprehensive corporate health packages', icon: 'ClipboardCheck' },
      { name: 'Second Opinion', description: 'Expert consultation for complex cases', icon: 'MessageSquare' },
      { name: 'Home Healthcare', description: 'Quality medical care at your doorstep', icon: 'Home' },
      { name: 'Preventive Health', description: 'Wellness and disease prevention programs', icon: 'Shield' },
    ],
    footer: {
      tagline: 'Excellence in Healthcare, Compassion in Care',
      copyright: '2024 Hospital. All rights reserved.',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  },
};

// Alias export for backwards compatibility
export const TEMPLATE_BLUEPRINTS = templateBlueprints;
