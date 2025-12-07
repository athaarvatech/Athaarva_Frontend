# 04. Hospital Public Website

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** ❌ Not Started

---

## 🎯 Overview

Each hospital gets a branded public website at their subdomain (e.g., `cityhospital.athaarva.com`). This page is visible to everyone and serves as the hospital's online presence.

---

## 🌐 URL Structure

| URL | Page | Auth |
|-----|------|------|
| `/` | Hospital Landing Page | No |
| `/doctors` | Doctor Directory | No |
| `/services` | Services List | No |
| `/contact` | Contact Page | No |
| `/about` | About Hospital | No |
| `/auth` | Login Page | No |
| `/auth/register` | Patient Registration | No |

---

## 📄 Page Specifications

### 1. Hospital Landing Page (`/`)

**Route:** `app/hospital/[subdomain]/page.tsx`  
**Status:** ❌ Not Started

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Hospital Name                    [Doctors] [Services] [Login]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         HERO SECTION                             │    │
│  │                                                                  │    │
│  │           "Your Health, Our Priority"                           │    │
│  │           Expert care with compassion and dedication            │    │
│  │                                                                  │    │
│  │           [Book Appointment]    [Emergency: 1800-XXX]           │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                       QUICK STATS                                │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │    │
│  │  │  25+    │  │  50k+   │  │  100+   │  │  24/7   │            │    │
│  │  │ Doctors │  │ Patients│  │  Beds   │  │Emergency│            │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     OUR SPECIALTIES                              │    │
│  │                                                                  │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │    │
│  │  │Cardiology│  │Pediatrics│ │Orthopedic│ │Neurology│            │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │    │
│  │                                                                  │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │    │
│  │  │Gynecology│ │Dermatology││   ENT   │  │ Dental │            │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │    │
│  │                                                                  │    │
│  │                     [View All Services →]                       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    FEATURED DOCTORS                              │    │
│  │                                                                  │    │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │    │
│  │  │    [Photo]    │  │    [Photo]    │  │    [Photo]    │       │    │
│  │  │   Dr. Smith   │  │   Dr. Patel   │  │   Dr. Kumar   │       │    │
│  │  │  Cardiologist │  │  Pediatrician │  │   Orthopedic  │       │    │
│  │  │ [Book Appt]   │  │ [Book Appt]   │  │ [Book Appt]   │       │    │
│  │  └───────────────┘  └───────────────┘  └───────────────┘       │    │
│  │                                                                  │    │
│  │                     [View All Doctors →]                        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                       ABOUT US                                   │    │
│  │                                                                  │    │
│  │  [Hospital Image]                                               │    │
│  │                                                                  │    │
│  │  City General Hospital has been serving the community for      │    │
│  │  over 25 years. Our state-of-the-art facilities and dedicated  │    │
│  │  team of medical professionals ensure the highest quality of   │    │
│  │  care for all our patients...                                   │    │
│  │                                                                  │    │
│  │                     [Read More →]                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    PATIENT TESTIMONIALS                          │    │
│  │                                                                  │    │
│  │  ┌───────────────────────────────────────────────────────┐     │    │
│  │  │  "Excellent care and friendly staff. The doctors      │     │    │
│  │  │   were very attentive and explained everything        │     │    │
│  │  │   clearly. Highly recommended!"                       │     │    │
│  │  │                                                        │     │    │
│  │  │   - Rajesh Kumar, Patient                             │     │    │
│  │  └───────────────────────────────────────────────────────┘     │    │
│  │                                                                  │    │
│  │              ○ ● ○                                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     CONTACT US                                   │    │
│  │                                                                  │    │
│  │  📍 123 Medical Street, Chennai, TN 600001                      │    │
│  │  📞 +91 44 2345 6789                                            │    │
│  │  📧 info@cityhospital.com                                       │    │
│  │                                                                  │    │
│  │  [Google Map Embed]                                             │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Quick Links  │  │  Services    │  │  Contact     │  │  Follow Us   ││
│  │ • Home       │  │ • Emergency  │  │ • Address    │  │ • Facebook   ││
│  │ • Doctors    │  │ • OPD        │  │ • Phone      │  │ • Twitter    ││
│  │ • Services   │  │ • Pharmacy   │  │ • Email      │  │ • Instagram  ││
│  │ • Contact    │  │ • Lab        │  │ • Hours      │  │ • LinkedIn   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                                          │
│  © 2025 City General Hospital. Powered by Athaarva.                     │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Dynamic Data Requirements

```typescript
interface HospitalPublicData {
  // Basic Info
  name: string;
  subdomain: string;
  
  // Branding
  branding: {
    logo_url: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  
  // Content
  content: {
    hero_headline: string;
    hero_subheadline: string;
    about_text: string;
    mission: string;
  };
  
  // Contact
  contact: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    emergency_phone: string;
    email: string;
    google_maps_url: string;
  };
  
  // Stats
  stats: {
    doctors_count: number;
    patients_served: number;
    beds_count: number;
    is_24x7: boolean;
  };
  
  // Services
  departments: Department[];
  specialties: string[];
  
  // Featured Doctors
  featured_doctors: DoctorPublic[];
  
  // Testimonials
  testimonials: Testimonial[];
}

interface DoctorPublic {
  id: string;
  name: string;
  photo_url: string;
  specialty: string;
  experience_years: number;
  available_for_booking: boolean;
}

interface Testimonial {
  id: string;
  patient_name: string;
  content: string;
  rating: number;
  date: string;
}
```

---

### 2. Doctor Directory (`/doctors`)

**Route:** `app/hospital/[subdomain]/doctors/page.tsx`

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Hospital Name                    [Home] [Services] [Login]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Our Doctors                                                            │
│  Find the right specialist for your needs                               │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  🔍 Search doctors...              [Specialty ▼] [Experience ▼] │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────┐     │
│  │                                                                │     │
│  │  ┌─────────────────────────────────────────────────────────┐  │     │
│  │  │  [Photo]  Dr. Anil Sharma                               │  │     │
│  │  │           Cardiologist • 15 years experience            │  │     │
│  │  │           ⭐ 4.8 (124 reviews)                          │  │     │
│  │  │           Languages: English, Hindi, Tamil              │  │     │
│  │  │                                                          │  │     │
│  │  │  Available: Mon, Wed, Fri 10:00 AM - 4:00 PM           │  │     │
│  │  │                                                          │  │     │
│  │  │  [View Profile]  [Book Appointment]                     │  │     │
│  │  └─────────────────────────────────────────────────────────┘  │     │
│  │                                                                │     │
│  │  ┌─────────────────────────────────────────────────────────┐  │     │
│  │  │  [Photo]  Dr. Priya Patel                               │  │     │
│  │  │           Pediatrician • 10 years experience            │  │     │
│  │  │           ⭐ 4.9 (89 reviews)                           │  │     │
│  │  │           Languages: English, Gujarati                  │  │     │
│  │  │                                                          │  │     │
│  │  │  Available: Tue, Thu, Sat 9:00 AM - 1:00 PM            │  │     │
│  │  │                                                          │  │     │
│  │  │  [View Profile]  [Book Appointment]                     │  │     │
│  │  └─────────────────────────────────────────────────────────┘  │     │
│  │                                                                │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  Showing 1-10 of 45 doctors                    [← Prev] [1] [2] [→]    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Filtering Options
- Search by name
- Filter by specialty
- Filter by experience level
- Filter by language
- Filter by availability

---

### 3. Doctor Profile (`/doctors/[id]`)

**Route:** `app/hospital/[subdomain]/doctors/[id]/page.tsx`

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Hospital Name                    [Home] [Services] [Login]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ← Back to Doctors                                                      │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                  │    │
│  │  ┌────────┐   Dr. Anil Sharma                                   │    │
│  │  │ Photo  │   Senior Cardiologist                               │    │
│  │  │        │   MBBS, MD (Cardiology), FACC                       │    │
│  │  │        │                                                      │    │
│  │  └────────┘   ⭐ 4.8 (124 reviews)                              │    │
│  │                                                                  │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │                 [Book Appointment]                       │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  [About]  [Education]  [Experience]  [Reviews]                  │    │
│  ├────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  About Dr. Anil Sharma                                          │    │
│  │                                                                  │    │
│  │  Dr. Sharma is a renowned cardiologist with over 15 years of   │    │
│  │  experience in interventional cardiology. He has performed      │    │
│  │  over 5000 successful angioplasties and is known for his       │    │
│  │  patient-centric approach...                                    │    │
│  │                                                                  │    │
│  │  Specializations:                                               │    │
│  │  • Interventional Cardiology                                    │    │
│  │  • Heart Failure Management                                     │    │
│  │  • Preventive Cardiology                                        │    │
│  │                                                                  │    │
│  │  Languages: English, Hindi, Tamil                               │    │
│  │                                                                  │    │
│  │  Consultation Fee: ₹800                                         │    │
│  │                                                                  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Availability                                                    │    │
│  ├────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  Monday      10:00 AM - 4:00 PM                                 │    │
│  │  Wednesday   10:00 AM - 4:00 PM                                 │    │
│  │  Friday      10:00 AM - 4:00 PM                                 │    │
│  │                                                                  │    │
│  │  Next Available: Monday, Dec 9 at 10:30 AM                     │    │
│  │                                                                  │    │
│  │  [Book Appointment]                                             │    │
│  │                                                                  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Services Page (`/services`)

**Route:** `app/hospital/[subdomain]/services/page.tsx`

#### Content
- List all departments
- List all specialties
- List available services
- Emergency services info
- Operating hours
- Insurance accepted

---

### 5. Contact Page (`/contact`)

**Route:** `app/hospital/[subdomain]/contact/page.tsx`

#### Content
- Full address with map
- Phone numbers
- Email addresses
- Operating hours
- Emergency contacts
- Contact form

---

## 🎨 Branding Integration

### CSS Variables from Hospital Data

```css
:root {
  /* These are set dynamically based on hospital branding */
  --hospital-primary: #2563eb;
  --hospital-secondary: #10b981;
  --hospital-accent: #f59e0b;
  --hospital-background: #ffffff;
  --hospital-text: #111827;
}
```

### Component Example

```typescript
'use client';

import { useHospitalBranding } from '@/hooks/useHospitalBranding';

export function HeroSection() {
  const { branding, content } = useHospitalBranding();
  
  return (
    <section 
      className="hero"
      style={{ 
        '--primary': branding.primary_color 
      } as React.CSSProperties}
    >
      <h1>{content.hero_headline}</h1>
      <p>{content.hero_subheadline}</p>
      <button 
        style={{ backgroundColor: branding.primary_color }}
      >
        Book Appointment
      </button>
    </section>
  );
}
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tenants/{subdomain}/public` | Hospital public data |
| GET | `/api/v1/tenants/{subdomain}/branding` | Branding only |
| GET | `/api/v1/tenants/{subdomain}/doctors` | Public doctor list |
| GET | `/api/v1/tenants/{subdomain}/doctors/{id}` | Doctor profile |
| GET | `/api/v1/tenants/{subdomain}/services` | Services list |
| GET | `/api/v1/tenants/{subdomain}/testimonials` | Testimonials |

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, hamburger menu |
| Tablet | 640-1024px | Two columns, condensed nav |
| Desktop | > 1024px | Full layout |

### Mobile Navigation

```
┌─────────────────────────────────┐
│  [Logo]              [☰ Menu]   │
├─────────────────────────────────┤
│                                 │
│  (Mobile menu when opened)      │
│  ┌───────────────────────────┐  │
│  │  Home                     │  │
│  │  Doctors                  │  │
│  │  Services                 │  │
│  │  Contact                  │  │
│  │  ─────────────────────    │  │
│  │  Login                    │  │
│  │  Register                 │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

---

## 📋 Implementation Checklist

### Hospital Landing Page
- [ ] Header with navigation
- [ ] Hero section with CTA
- [ ] Stats section
- [ ] Specialties grid
- [ ] Featured doctors carousel
- [ ] About section
- [ ] Testimonials slider
- [ ] Contact section with map
- [ ] Footer

### Doctor Directory
- [ ] Doctor list with pagination
- [ ] Search functionality
- [ ] Filters (specialty, experience)
- [ ] Doctor cards

### Doctor Profile
- [ ] Full profile page
- [ ] Tabs (About, Education, Reviews)
- [ ] Availability display
- [ ] Book appointment CTA

### Services Page
- [ ] Department list
- [ ] Services grid
- [ ] Emergency info

### Contact Page
- [ ] Contact form
- [ ] Map integration
- [ ] Contact details

### General
- [ ] Responsive design
- [ ] Dynamic branding
- [ ] SEO meta tags
- [ ] Loading states
- [ ] Error handling

---

## 🔗 Related Documentation

- [02_AUTHENTICATION.md](./02_AUTHENTICATION.md) - Login/Register pages
- [03_HOSPITAL_ONBOARDING.md](./03_HOSPITAL_ONBOARDING.md) - Content setup
- [05_ADMIN_DASHBOARD.md](./05_ADMIN_DASHBOARD.md) - Admin content management
