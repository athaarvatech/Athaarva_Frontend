# 08. Patient Portal

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** 🔄 Partial

---

## 🎯 Overview

The patient portal is a **multi-tenant patient experience** allowing patients to:
- Register and access **multiple hospitals** from a single account
- View and book appointments across connected providers
- Access consolidated medical records from all providers
- View prescriptions with adherence tracking
- Track health vitals and wellness goals
- Manage billing and payments with flexible options
- Communicate securely with care teams
- Manage dependents (family members)

---

## 🏥 Multi-Tenant Patient Access

### Patient-Hospital Relationship Model

```
PATIENT MULTI-TENANT ACCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Patient registers once → Can connect to multiple hospitals

                    ┌─────────────────────────┐
                    │      PATIENT ACCOUNT     │
                    │       (Global ID)        │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  City Hospital  │    │  Heart Center   │    │  Clinic Plus    │
│  (Tenant A)     │    │  (Tenant B)     │    │  (Tenant C)     │
│                 │    │                 │    │                 │
│ • 5 visits      │    │ • 2 visits      │    │ • 1 visit       │
│ • Cardiologist  │    │ • Cardiac care  │    │ • General       │
│ • Records: 12   │    │ • Records: 4    │    │ • Records: 2    │
└─────────────────┘    └─────────────────┘    └─────────────────┘

UNIFIED EXPERIENCE:
├── Single sign-in for all connected hospitals
├── Consolidated appointment calendar
├── Merged medical timeline (with source attribution)
├── Unified prescription list
└── Combined billing overview
```

### Hospital Switcher

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Connected Hospitals                           [+ Find New Hospital] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [●] City General Hospital                      ← ACTIVE CONTEXT  │ │
│  │      Last visit: Dec 1, 2025                                      │ │
│  │      Primary Care, Cardiology                                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [ ] Heart Specialty Center                                       │ │
│  │      Last visit: Nov 15, 2025                                     │ │
│  │      Cardiac Care                                                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [ ] Wellness Clinic                                              │ │
│  │      Last visit: Oct 5, 2025                                      │ │
│  │      General Medicine, Diagnostics                                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  📊 Viewing: All Hospitals │ [Switch to City General Only]              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Hospital Discovery (Tenant Directory)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Find a Hospital                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔍 Search hospitals, clinics, or specialties...                        │
│                                                                          │
│  Filters:                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Location: [Mumbai ▼]  Distance: [< 10 km ▼]                     │   │
│  │ Specialty: [Cardiology ▼]  Rating: [4+ ★ ▼]                     │   │
│  │ Insurance: [All ▼]  Type: [Hospital ○] [Clinic ○] [Both ●]      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Results (12 found):                                                     │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [Logo] City General Hospital                    ⭐ 4.6 (2,340)   │ │
│  │         Multi-Specialty Hospital • Est. 1985                      │ │
│  │         📍 Andheri West, Mumbai • 3.2 km away                    │ │
│  │                                                                    │ │
│  │  Specialties: Cardiology, Orthopedics, Neurology, +8 more        │ │
│  │  Accepts: United India, Star Health, Max Bupa                     │ │
│  │                                                                    │ │
│  │  [View Details]  [Book Appointment]  [Connect to My Account]     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [Logo] Heart Care Specialty Center              ⭐ 4.8 (890)     │ │
│  │         Cardiac Specialty Hospital • Est. 2010                    │ │
│  │         📍 Bandra East, Mumbai • 5.8 km away                     │ │
│  │                                                                    │ │
│  │  Specialties: Cardiology, Cardiac Surgery                        │ │
│  │  Accepts: Star Health, HDFC Ergo                                 │ │
│  │                                                                    │ │
│  │  [View Details]  [Book Appointment]  [Connect to My Account]     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 👤 Patient Onboarding Lifecycle

### Registration Flow

```
PATIENT ONBOARDING JOURNEY:
━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1          Step 2           Step 3           Step 4           Step 5
┌─────────┐    ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Account │ ─▶ │ Phone   │ ─▶   │ Basic   │ ─▶   │ Health  │ ─▶   │ Hospital│
│ Create  │    │ Verify  │      │ Profile │      │ Profile │      │ Connect │
└─────────┘    └─────────┘      └─────────┘      └─────────┘      └─────────┘
  Email/        OTP              Name, DOB,       Blood group,     Find &
  Password      SMS/WhatsApp     Gender, etc.     Allergies,       register
                                                  Conditions        hospital
```

### Step 1: Account Creation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CREATE YOUR ATHAARVA ACCOUNT                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                              [Athaarva Logo]                             │
│                                                                          │
│  Your health, connected everywhere.                                      │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Mobile Number *                                                  │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ +91 │ Enter 10-digit mobile number                          │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │ Email Address (optional)                                        │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ email@example.com                                           │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │ Password *                                                       │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ ••••••••                                           [👁]     │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  │ ✓ At least 8 characters  ✓ One uppercase  ✓ One number        │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ☑ I agree to the Terms of Service and Privacy Policy                  │
│                                                                          │
│                      [Create Account →]                                  │
│                                                                          │
│  Already have an account? [Sign In]                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 2: Phone Verification

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VERIFY YOUR PHONE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  We sent a verification code to +91 98765 43210                         │
│                                                                          │
│  Enter OTP:                                                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                             │
│  │  5 │ │  7 │ │  2 │ │  _ │ │  _ │ │  _ │                             │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                             │
│                                                                          │
│  Didn't receive? [Resend OTP] (00:45)                                   │
│  [Try WhatsApp instead]                                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Basic Profile

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE YOUR PROFILE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 1 of 3: Basic Information                                         │
│  ━━━━━━━━━━━━━━━━━●───────────○───────────○                             │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Full Name *                                                      │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ Rajesh Kumar                                                │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │ Date of Birth *                                                  │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ 15/03/1980                                           [📅]   │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │ Gender *                                                         │   │
│  │ [● Male]  [○ Female]  [○ Other]  [○ Prefer not to say]          │   │
│  │                                                                  │   │
│  │ Address                                                          │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ 42, Green Valley Apartments, Andheri West                   │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │ City *                        State *                            │   │
│  │ ┌────────────────────┐       ┌────────────────────┐             │   │
│  │ │ Mumbai        ▼   │       │ Maharashtra    ▼   │             │   │
│  │ └────────────────────┘       └────────────────────┘             │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│                                              [Skip for Now]  [Next →]   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 4: Health Profile Initialization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      HEALTH PROFILE SETUP                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 2 of 3: Health Information                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●───────────○                            │
│                                                                          │
│  This helps doctors provide better care.                                │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  BASIC HEALTH INFO                                                 │ │
│  │                                                                    │ │
│  │  Blood Group *                                                     │ │
│  │  [O+ ▼]  [Don't know]                                             │ │
│  │                                                                    │ │
│  │  Height          Weight                                            │ │
│  │  [175] cm        [78] kg                                          │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  KNOWN CONDITIONS (select all that apply)                         │ │
│  │                                                                    │ │
│  │  ☑ Hypertension        ☐ Heart Disease       ☐ Asthma            │ │
│  │  ☑ Diabetes            ☐ Thyroid             ☐ COPD              │ │
│  │  ☐ Kidney Disease      ☐ Liver Disease       ☐ Cancer            │ │
│  │  ☐ Stroke              ☐ Mental Health       ☐ None              │ │
│  │                                                                    │ │
│  │  Other: [________________________________]                        │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ALLERGIES                                                         │ │
│  │                                                                    │ │
│  │  ⚠️ Drug Allergies:                                               │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ Penicillin                                         [x]      │  │ │
│  │  │ [+ Add another drug allergy]                                │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  🍽️ Food Allergies:                                              │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ Peanuts                                            [x]      │  │ │
│  │  │ [+ Add another food allergy]                                │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ☐ No known allergies                                             │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  CURRENT MEDICATIONS                                               │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ Medication      │ Dosage    │ Frequency         │ Since     │  │ │
│  │  │─────────────────│───────────│───────────────────│───────────│  │ │
│  │  │ Metformin       │ 500mg     │ Twice daily       │ 2020      │  │ │
│  │  │ Amlodipine      │ 5mg       │ Once daily        │ 2018      │  │ │
│  │  │ [+ Add medication]                                          │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ☐ Not currently taking any medications                           │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                            [← Back]  [Skip]  [Next →]   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 5: Connect to Hospital

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CONNECT TO A HOSPITAL                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 3 of 3: Find Your Hospital                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●                            │
│                                                                          │
│  🔍 Search by hospital name or location...                              │
│                                                                          │
│  📍 Hospitals near you (based on your location):                        │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [Logo] City General Hospital                                     │ │
│  │         Andheri West, Mumbai • 2.1 km                             │ │
│  │         Multi-Specialty • ⭐ 4.6                                  │ │
│  │                                                [Connect →]        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [Logo] Wellness Clinic                                           │ │
│  │         Bandra, Mumbai • 4.5 km                                   │ │
│  │         General Practice • ⭐ 4.4                                 │ │
│  │                                                [Connect →]        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Have a registration code from a hospital?                        │ │
│  │                                                                    │ │
│  │  Enter Code: [________________________]  [Connect]                │ │
│  │                                                                    │ │
│  │  💡 Hospitals may give you a code to link your existing records   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                            [Skip & Go to Dashboard →]   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 URL Structure

| URL | Page | Description |
|-----|------|-------------|
| `/patient` | Dashboard | Patient home (all hospitals view) |
| `/patient/hospitals` | My Hospitals | Connected hospitals list |
| `/patient/hospitals/discover` | Find Hospital | Hospital directory search |
| `/patient/appointments` | Appointments | My appointments (all hospitals) |
| `/patient/appointments/book` | Book | Book new appointment |
| `/patient/appointments/{id}` | Details | Appointment details |
| `/patient/doctors` | Doctors | Browse doctors |
| `/patient/records` | Records | Medical records timeline |
| `/patient/records/{id}` | Record Detail | View record/document |
| `/patient/prescriptions` | Prescriptions | My prescriptions |
| `/patient/medications` | Medications | Active meds & schedule |
| `/patient/medications/adherence` | Adherence | Adherence report |
| `/patient/care-plans` | Care Plans | My care plans |
| `/patient/care-plans/{id}` | Plan Detail | Care plan details |
| `/patient/family` | Family | Family members list |
| `/patient/family/{id}` | Member Profile | Family member details |
| `/patient/billing` | Billing | Bills & payments |
| `/patient/billing/invoices/{id}` | Invoice | Invoice details |
| `/patient/billing/payment-plan` | Payment Plan | Create/manage plan |
| `/patient/billing/claims` | Claims | Insurance claims |
| `/patient/messages` | Messages | All conversations |
| `/patient/messages/{id}` | Thread | Message thread |
| `/patient/profile` | Profile | My profile |
| `/patient/profile/health` | Health Profile | Health info |
| `/patient/profile/insurance` | Insurance | Insurance details |
| `/patient/settings` | Settings | App settings |
| `/patient/notifications` | Notifications | All notifications |

---

## 📄 Page Specifications

### 1. Patient Dashboard (`/patient`)

**Status:** 🔄 Partial

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Welcome back, Rajesh!                              Wednesday, Dec 4    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  NEXT APPOINTMENT                                                │    │
│  │                                                                  │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │  Dr. Anil Sharma • Cardiologist                         │    │    │
│  │  │  📅 Dec 15, 2025 at 10:30 AM                            │    │    │
│  │  │  📍 City General Hospital, Room 5                       │    │    │
│  │  │                                                          │    │    │
│  │  │  [View Details]  [Reschedule]  [Cancel]                 │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                  │    │
│  │  No upcoming appointments? [Book Appointment →]                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────┐ ┌────────────────────────────────────┐  │
│  │  QUICK ACTIONS             │ │  RECENT ACTIVITY                   │  │
│  │                            │ │                                    │  │
│  │  [📅 Book Appointment]     │ │  • Prescription from Dr. Sharma   │  │
│  │  [📋 View Records]         │ │    Dec 1, 2025                    │  │
│  │  [💊 My Prescriptions]     │ │                                    │  │
│  │  [💳 Pay Bills]            │ │  • Lab Results - Blood Test       │  │
│  │                            │ │    Nov 28, 2025                   │  │
│  │                            │ │                                    │  │
│  │                            │ │  • Consultation with Dr. Sharma   │  │
│  │                            │ │    Nov 25, 2025                   │  │
│  └────────────────────────────┘ └────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  HEALTH REMINDERS                                                │    │
│  │                                                                  │    │
│  │  💊 Medicine Reminder: Metformin 500mg - Due at 8:00 PM         │    │
│  │  📋 Action Required: Upload lab results from Nov visit          │    │
│  │  📅 Annual Checkup: Overdue - Last checkup was 13 months ago    │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  OUTSTANDING BALANCE                                             │    │
│  │                                                                  │    │
│  │  ₹2,500 pending                                      [Pay Now]  │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Appointments (`/patient/appointments`)

**Status:** 🔄 Partial

#### Appointments List

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Appointments                                    [+ Book Appointment]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Upcoming]  [Past]  [Cancelled]                                        │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  UPCOMING APPOINTMENTS                                             │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Dec 15, 2025 • 10:30 AM                                    │  │ │
│  │  │                                                              │  │ │
│  │  │  Dr. Anil Sharma                                            │  │ │
│  │  │  Cardiologist                                               │  │ │
│  │  │  📍 Room 5 • In-Person                                      │  │ │
│  │  │                                                              │  │ │
│  │  │  Reason: Follow-up for blood pressure                       │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Details]  [Reschedule]  [Cancel]                     │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Dec 20, 2025 • 2:00 PM                                     │  │ │
│  │  │                                                              │  │ │
│  │  │  Dr. Priya Patel                                            │  │ │
│  │  │  General Physician                                          │  │ │
│  │  │  📱 Video Call • Telehealth                                 │  │ │
│  │  │                                                              │  │ │
│  │  │  Reason: Routine checkup                                    │  │ │
│  │  │                                                              │  │ │
│  │  │  [Join Call]  [View Details]  [Reschedule]  [Cancel]        │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Book Appointment (`/patient/appointments/book`)

**Status:** 🔄 Partial

#### 🆕 Real-Time Appointment Booking with Live Doctor Sync

When patient books an appointment, it **immediately reflects** on the doctor's dashboard and calendar.

#### Booking Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│              APPOINTMENT BOOKING FLOW                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 1           Step 2           Step 3           Step 4              │
│  ┌─────────┐     ┌─────────┐      ┌─────────┐      ┌─────────┐         │
│  │ Select  │ ──▶ │ Select  │ ──▶  │ Pick    │ ──▶  │ Confirm │         │
│  │ Dept    │     │ Doctor  │      │ Slot    │      │ & Pay   │         │
│  └─────────┘     └─────────┘      └─────────┘      └─────────┘         │
│                                                                          │
│              ⚡ REAL-TIME SLOT AVAILABILITY                             │
│              Slots update live as other patients book                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 1: Select Department/Specialty

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Book Appointment                                      Step 1 of 4      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  What do you need help with?                                            │
│                                                                          │
│  🔍 Search symptoms or specialties...                                   │
│                                                                          │
│  Popular Specialties:                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │ │
│  │  │ 🫀 Cardiology │ │ 🦴 Orthopedics│ │ 👶 Pediatrics│              │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘              │ │
│  │                                                                    │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │ │
│  │  │ 🩺 General   │ │ 🧠 Neurology │ │ 👁 Ophthalmology│             │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘              │ │
│  │                                                                    │ │
│  │  [View All Specialties →]                                         │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 2: Select Doctor

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Select Doctor                                         Step 2 of 4      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Cardiology Doctors                           [Filter ▼] [Sort by ▼]   │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Dr. Anil Sharma                                   │  │ │
│  │  │           Senior Cardiologist • 15 years exp                │  │ │
│  │  │           ⭐ 4.8 (234 reviews)                              │  │ │
│  │  │           💰 Consultation: ₹800                             │  │ │
│  │  │                                                              │  │ │
│  │  │  🟢 Next Available: Today, 4:30 PM                          │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Profile]              [Select Doctor →]              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Dr. Meera Gupta                                   │  │ │
│  │  │           Cardiologist • 8 years exp                        │  │ │
│  │  │           ⭐ 4.6 (156 reviews)                              │  │ │
│  │  │           💰 Consultation: ₹600                             │  │ │
│  │  │                                                              │  │ │
│  │  │  🟡 Next Available: Dec 6, 10:00 AM                         │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Profile]              [Select Doctor →]              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 3: Pick Time Slot (REAL-TIME)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Pick a Time Slot                                      Step 3 of 4      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Dr. Anil Sharma - Cardiologist                                         │
│                                                                          │
│  ⚡ Live availability - Slots update in real-time                       │
│                                                                          │
│  Select Date:                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ◄  December 2025  ►                                              │ │
│  │                                                                    │ │
│  │  Mon   Tue   Wed   Thu   Fri   Sat   Sun                          │ │
│  │   1     2     3    [4]    5     6     7                           │ │
│  │   ●     ●     ●     ●     ●     ●     -                           │ │
│  │   8     9    10    11    12    13    14                           │ │
│  │   ●     ●     -     ●     ●     ●     -                           │ │
│  │                                                                    │ │
│  │  ● Available  - Unavailable  [4] Selected                         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Available Slots for Dec 4, 2025:                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Morning:                                                          │ │
│  │  [❌ 9:00 AM]  [❌ 9:30 AM]  [✅ 10:00 AM]  [✅ 10:30 AM]          │ │
│  │   Booked       Booked        Available      Available              │ │
│  │                                                                    │ │
│  │  Afternoon:                                                        │ │
│  │  [🔒 1:00 PM]  [✅ 3:00 PM]  [✅ 3:30 PM]  [⚡ 4:00 PM]           │ │
│  │   Lunch        Available     Available     Just booked!            │ │
│  │                                                                    │ │
│  │  Evening:                                                          │ │
│  │  [✅ 6:00 PM]  [✅ 6:30 PM]                                       │ │
│  │   Available    Available                                           │ │
│  │                                                                    │ │
│  │  🔴 Slot "4:00 PM" was just booked by another patient             │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Consultation Type:                                                      │
│  [● In-Person]  [○ Video Call]                                         │
│                                                                          │
│                                                    [← Back]  [Next →]   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 4: Confirm & Pay

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Confirm Appointment                                   Step 4 of 4      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  APPOINTMENT SUMMARY                                               │ │
│  │                                                                    │ │
│  │  👨‍⚕️ Doctor: Dr. Anil Sharma                                      │ │
│  │  🏥 Specialty: Cardiologist                                       │ │
│  │  📅 Date: December 4, 2025                                        │ │
│  │  ⏰ Time: 10:00 AM                                                │ │
│  │  📍 Type: In-Person (Room 5)                                      │ │
│  │  💰 Consultation Fee: ₹800                                        │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Reason for Visit:                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Follow-up for blood pressure monitoring                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Symptoms (optional):                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Occasional chest discomfort, mild headaches                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Upload Reports (optional):                                              │
│  [📎 Upload previous lab reports, scans, etc.]                          │
│                                                                          │
│  Payment:                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [● Pay Now (₹800)]  [○ Pay at Hospital]                          │ │
│  │                                                                    │ │
│  │  Payment Methods:                                                  │ │
│  │  [💳 Card]  [📱 UPI]  [🏦 Net Banking]                            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ⏳ This slot is held for 10:00 minutes. Complete booking to confirm.  │
│                                                                          │
│                                   [← Back]  [Confirm & Pay ₹800 →]      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Real-Time Sync to Doctor Dashboard

```
WHAT HAPPENS WHEN PATIENT BOOKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Patient clicks "Confirm & Pay"
   ↓
2. Slot immediately locked (prevents double-booking)
   ↓
3. Payment processed (if online)
   ↓
4. Appointment created in database
   ↓
5. WebSocket notification to Doctor Dashboard
   ↓
   ┌───────────────────────────────────────┐
   │  🔔 NEW APPOINTMENT                   │
   │                                        │
   │  Patient: Rajesh Kumar                 │
   │  Time: Today, 10:00 AM                │
   │  Reason: BP follow-up                 │
   │                                        │
   │  [View]  [Dismiss]                    │
   └───────────────────────────────────────┘
   ↓
6. Doctor's calendar updated instantly
   ↓
7. Patient receives confirmation (Email + SMS + App)
   ↓
8. Reminder scheduled (24hr before, 1hr before)
```

#### Conflict Prevention

```
Real-Time Slot Management
├── Slot states:
│   ├── Available (green)
│   ├── Held (yellow) - Someone is booking
│   ├── Booked (red)
│   └── Blocked (gray) - Doctor unavailable
│
├── Race condition handling:
│   ├── Optimistic locking on slot selection
│   ├── 10-minute hold on slot during checkout
│   ├── Auto-release if payment fails/times out
│   └── Real-time UI update via WebSocket
│
└── Notifications:
    ├── "This slot was just booked" warning
    ├── "Similar slots available" suggestion
    └── Auto-suggest next available slot
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Book Appointment                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 1 of 4: Select Specialty                                          │
│  ━━━━━━━━━━○───────○───────○                                            │
│                                                                          │
│  What type of consultation do you need?                                 │
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  🫀 Cardiology │ │  👶 Pediatrics │ │  🦴 Orthopedic │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  🧠 Neurology  │ │  👁 Ophthalmology│ │  🦷 Dental    │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  👩 Gynecology │ │  🩺 General Med │ │  👄 ENT       │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Step 2: Select Doctor
┌─────────────────────────────────────────────────────────────────────────┐
│  Book Appointment                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 2 of 4: Select Doctor                                             │
│  ━━━━━━━━━━━━━━━━━━○───────○                                            │
│                                                                          │
│  Cardiologists Available:                                               │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [Photo]  Dr. Anil Sharma                                         │ │
│  │           ⭐ 4.8 (124 reviews) • 15 years exp                     │ │
│  │           Next Available: Dec 15, 10:30 AM                        │ │
│  │           Consultation: ₹800                                      │ │
│  │                                                         [Select]  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [Photo]  Dr. Meera Krishnan                                      │ │
│  │           ⭐ 4.6 (89 reviews) • 10 years exp                      │ │
│  │           Next Available: Dec 12, 3:00 PM                         │ │
│  │           Consultation: ₹700                                      │ │
│  │                                                         [Select]  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Step 3: Select Date & Time
┌─────────────────────────────────────────────────────────────────────────┐
│  Book Appointment                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 3 of 4: Select Date & Time                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━○                                           │
│                                                                          │
│  Dr. Anil Sharma • Cardiology                                           │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  December 2025                                      ◄    ►        │ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │ │
│  │  │ 12 │ │ 13 │ │ 14 │ │ 15 │ │ 16 │ │ 17 │ │ 18 │               │ │
│  │  │ Thu│ │ Fri│ │ Sat│ │ Sun│ │ Mon│ │ Tue│ │ Wed│               │ │
│  │  │    │ │ ✓  │ │    │ │    │ │ ✓  │ │    │ │ ✓  │               │ │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Available Slots for Dec 15:                                            │
│                                                                          │
│  Morning:                                                                │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                           │
│  │ 9:00 AM│ │ 9:30 AM│ │10:00 AM│ │10:30 AM│ ← Selected               │
│  └────────┘ └────────┘ └────────┘ └────────┘                           │
│                                                                          │
│  Afternoon:                                                              │
│  ┌────────┐ ┌────────┐ ┌────────┐                                       │
│  │ 2:00 PM│ │ 2:30 PM│ │ 3:00 PM│                                       │
│  └────────┘ └────────┘ └────────┘                                       │
│                                                                          │
│  Consultation Type:                                                      │
│  ○ In-Person (₹800)    ● Video Call (₹600)                             │
│                                                                          │
│                                               [← Back]  [Continue →]    │
└─────────────────────────────────────────────────────────────────────────┘

Step 4: Confirm & Pay
┌─────────────────────────────────────────────────────────────────────────┐
│  Book Appointment                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 4 of 4: Confirm Booking                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                       │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  APPOINTMENT SUMMARY                                               │ │
│  │                                                                    │ │
│  │  Doctor: Dr. Anil Sharma                                          │ │
│  │  Specialty: Cardiology                                            │ │
│  │  Date: December 15, 2025                                          │ │
│  │  Time: 10:30 AM                                                   │ │
│  │  Type: Video Call                                                 │ │
│  │                                                                    │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │                                                                    │ │
│  │  Consultation Fee:                          ₹600                  │ │
│  │  Platform Fee:                              ₹50                   │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │  Total:                                     ₹650                  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Reason for Visit:                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Follow-up for blood pressure monitoring                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ☑ I agree to the cancellation policy                                   │
│                                                                          │
│                                     [← Back]  [Confirm & Pay ₹650 →]    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Medical Records (`/patient/records`)

**Status:** ❌ Not Started

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Medical Records                                   [Upload] [Filter] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [All] [Consultations] [Lab Reports] [Prescriptions] [Documents]        │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  HEALTH TIMELINE                                                   │ │
│  │                                                                    │ │
│  │  December 2025                                                     │ │
│  │  │                                                                 │ │
│  │  ├─ Dec 1 ─────────────────────────────────────────────────────   │ │
│  │  │  📋 Consultation with Dr. Sharma                               │ │
│  │  │     Cardiology Follow-up                                       │ │
│  │  │     [View Note] [Download]                                     │ │
│  │  │                                                                 │ │
│  │  │  💊 Prescription                                               │ │
│  │  │     Atorvastatin, Aspirin                                      │ │
│  │  │     [View] [Download]                                          │ │
│  │  │                                                                 │ │
│  │  November 2025                                                     │ │
│  │  │                                                                 │ │
│  │  ├─ Nov 28 ────────────────────────────────────────────────────   │ │
│  │  │  🔬 Lab Report - Blood Test                                    │ │
│  │  │     Complete Blood Count, Lipid Profile                        │ │
│  │  │     [View Report] [Download]                                   │ │
│  │  │                                                                 │ │
│  │  ├─ Nov 25 ────────────────────────────────────────────────────   │ │
│  │  │  📋 Consultation with Dr. Sharma                               │ │
│  │  │     Routine Checkup                                            │ │
│  │  │     [View Note] [Download]                                     │ │
│  │  │                                                                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5. My Prescriptions (`/patient/prescriptions`)

**Status:** ❌ Not Started

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Prescriptions                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Active] [Past] [All]                                                  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ACTIVE MEDICATIONS                                                │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  💊 Metformin 500mg                                         │  │ │
│  │  │     Twice daily - Morning & Night                           │  │ │
│  │  │     With food                                               │  │ │
│  │  │     Prescribed: Dec 1, 2025 • Dr. Sharma                    │  │ │
│  │  │     Remaining: 25 days                                      │  │ │
│  │  │                                        [Set Reminder] [Refill]│  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  💊 Atorvastatin 10mg                                       │  │ │
│  │  │     Once daily - Night                                      │  │ │
│  │  │     After dinner                                            │  │ │
│  │  │     Prescribed: Dec 1, 2025 • Dr. Sharma                    │  │ │
│  │  │     Remaining: 25 days                                      │  │ │
│  │  │                                        [Set Reminder] [Refill]│  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  PRESCRIPTION HISTORY                                              │ │
│  │                                                                    │ │
│  │  Dec 1, 2025 • Dr. Anil Sharma                                    │ │
│  │  2 medications prescribed                     [View] [Download]   │ │
│  │                                                                    │ │
│  │  Oct 15, 2025 • Dr. Priya Patel                                   │ │
│  │  1 medication prescribed                      [View] [Download]   │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 6. Profile & Health Info (`/patient/profile`)

**Status:** 🔄 Partial

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Profile                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Personal Info] [Health Profile] [Insurance] [Dependents] [Settings]   │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  HEALTH PROFILE                                                    │ │
│  │                                                                    │ │
│  │  Blood Group: O+                                                   │ │
│  │  Height: 175 cm                                                    │ │
│  │  Weight: 78 kg                                                     │ │
│  │                                                                    │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │                                                                    │ │
│  │  KNOWN CONDITIONS                                                  │ │
│  │  • Hypertension (Since 2018)                                      │ │
│  │  • Type 2 Diabetes (Since 2020)                                   │ │
│  │                                    [+ Add Condition]              │ │
│  │                                                                    │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │                                                                    │ │
│  │  ALLERGIES                                                         │ │
│  │  ⚠️ Penicillin - Severe                                           │ │
│  │  ⚠️ Peanuts - Moderate                                            │ │
│  │                                    [+ Add Allergy]                │ │
│  │                                                                    │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │                                                                    │ │
│  │  EMERGENCY CONTACTS                                                │ │
│  │  Priya Kumar (Wife) - +91 98765 12345                             │ │
│  │                                    [+ Add Contact]                │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 7. Family Members / Dependents (`/patient/family`)

**Status:** ❌ Not Started

#### Dependent Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Family Members                                  [+ Add Family Member]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Book and manage appointments for your family members.                  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  FAMILY MEMBERS                                                    │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Priya Kumar                                       │  │ │
│  │  │           Wife • Age: 42                                    │  │ │
│  │  │           Blood Group: A+                                   │  │ │
│  │  │                                                              │  │ │
│  │  │           📅 Last visit: Nov 20, 2025                       │  │ │
│  │  │           💊 Active medications: 2                          │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Profile] [Book Appointment] [View Records]           │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Arjun Kumar                                       │  │ │
│  │  │           Son • Age: 14                                     │  │ │
│  │  │           Blood Group: O+                                   │  │ │
│  │  │                                                              │  │ │
│  │  │           📅 Last visit: Dec 1, 2025                        │  │ │
│  │  │           💊 Active medications: 0                          │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Profile] [Book Appointment] [View Records]           │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Ananya Kumar                                      │  │ │
│  │  │           Daughter • Age: 10                                │  │ │
│  │  │           Blood Group: A+                                   │  │ │
│  │  │                                                              │  │ │
│  │  │           📅 Last visit: Oct 5, 2025                        │  │ │
│  │  │           💊 Active medications: 0                          │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Profile] [Book Appointment] [View Records]           │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Add Family Member

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Add Family Member                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Full Name *                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │                                                             │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Relationship *                                                    │ │
│  │  [Spouse ▼]                                                       │ │
│  │  Options: Spouse, Child, Parent, Sibling, Other                   │ │
│  │                                                                    │ │
│  │  Date of Birth *                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ DD/MM/YYYY                                           [📅]   │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Gender *                                                          │ │
│  │  [● Male]  [○ Female]  [○ Other]                                  │ │
│  │                                                                    │ │
│  │  Blood Group                                                       │ │
│  │  [Select ▼]  [Don't know]                                         │ │
│  │                                                                    │ │
│  │  Allergies (optional)                                              │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ [+ Add allergy]                                             │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Known Conditions (optional)                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ [+ Add condition]                                           │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ☑ I confirm this person is my family member and I have permission     │
│    to manage their healthcare records                                   │
│                                                                          │
│                                            [Cancel]  [Add Family Member]│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Book for Dependent

```
When booking appointment:

┌─────────────────────────────────────────────────────────────────────────┐
│  Who is this appointment for?                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [● Myself (Rajesh Kumar)]                                              │
│                                                                          │
│  [○ Priya Kumar (Wife)]                                                 │
│                                                                          │
│  [○ Arjun Kumar (Son)]                                                  │
│                                                                          │
│  [○ Ananya Kumar (Daughter)]                                            │
│                                                                          │
│  [+ Add new family member]                                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 8. Medication Adherence & Reminders (`/patient/medications`)

**Status:** ❌ Not Started

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Medications                                      [Adherence Report] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  TODAY'S SCHEDULE                          December 4, 2025       │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  ☀️ MORNING (8:00 AM)                              [Done ✓] │  │ │
│  │  │                                                              │  │ │
│  │  │  ✓ Metformin 500mg - With breakfast                        │  │ │
│  │  │  ✓ Amlodipine 5mg - Empty stomach                          │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  🌤️ AFTERNOON (2:00 PM)                           [Pending] │  │ │
│  │  │                                                              │  │ │
│  │  │  ☐ Vitamin D3 60K - With lunch                              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  🌙 NIGHT (9:00 PM)                               [Upcoming] │  │ │
│  │  │                                                              │  │ │
│  │  │  ☐ Metformin 500mg - With dinner                            │  │ │
│  │  │  ☐ Atorvastatin 10mg - After dinner                         │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ADHERENCE THIS WEEK                                              │ │
│  │                                                                    │ │
│  │  Mon   Tue   Wed   Thu   Fri   Sat   Sun                          │ │
│  │   ✓     ✓     ✓    ●     ○     ○     ○                           │ │
│  │  100%  100%  100% Today  --    --    --                           │ │
│  │                                                                    │ │
│  │  Weekly Score: 92%  [View Detailed Report]                        │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  REFILL ALERTS                                                    │ │
│  │                                                                    │ │
│  │  ⚠️ Metformin 500mg - 5 days supply remaining                    │ │
│  │     [Request Refill]                                              │ │
│  │                                                                    │ │
│  │  ✓ Amlodipine 5mg - 22 days supply remaining                     │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  REMINDER SETTINGS                              [Configure →]     │ │
│  │                                                                    │ │
│  │  ✓ Push notifications: Enabled                                    │ │
│  │  ✓ SMS reminders: Enabled (5 min before)                         │ │
│  │  ✓ WhatsApp: Enabled                                              │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Refill Request Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Request Medication Refill                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Medication: Metformin 500mg                                            │
│  Last prescribed by: Dr. Anil Sharma on Dec 1, 2025                     │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  REFILL OPTIONS                                                    │ │
│  │                                                                    │ │
│  │  [● Request from same doctor (Dr. Sharma)]                        │ │
│  │      Doctor will review and send to pharmacy                      │ │
│  │                                                                    │ │
│  │  [○ Request from hospital pharmacy]                               │ │
│  │      If prescription is still valid                               │ │
│  │                                                                    │ │
│  │  [○ Book follow-up consultation]                                  │ │
│  │      If prescription expired (over 30 days)                       │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Preferred Pharmacy (optional):                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Apollo Pharmacy, Andheri West               ▼                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ☑ Notify me when prescription is ready                                 │
│                                                                          │
│                                          [Cancel]  [Submit Request →]   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 9. Care Plans (`/patient/care-plans`)

**Status:** ❌ Not Started

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Care Plans                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Active Plans (2)] [Completed (3)] [All]                               │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ACTIVE CARE PLANS                                                 │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  🫀 Cardiac Health Management                               │  │ │
│  │  │     Assigned by: Dr. Anil Sharma                            │  │ │
│  │  │     Started: Nov 25, 2025 • Duration: 3 months              │  │ │
│  │  │                                                              │  │ │
│  │  │     Progress: ████████░░░░░░░░ 45%                          │  │ │
│  │  │                                                              │  │ │
│  │  │     GOALS:                                                   │  │ │
│  │  │     ✓ Reduce BP to 130/85 (Current: 138/88)                 │  │ │
│  │  │     ○ Walk 30 min daily (This week: 4/7 days)               │  │ │
│  │  │     ○ Reduce sodium intake                                  │  │ │
│  │  │                                                              │  │ │
│  │  │     UPCOMING:                                                │  │ │
│  │  │     📅 Follow-up: Dec 15, 2025                              │  │ │
│  │  │     🔬 Blood test due: Dec 10, 2025                         │  │ │
│  │  │                                                              │  │ │
│  │  │     [View Full Plan] [Log Progress]                         │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  💊 Diabetes Management                                     │  │ │
│  │  │     Assigned by: Dr. Priya Patel                            │  │ │
│  │  │     Started: Oct 1, 2025 • Duration: 6 months               │  │ │
│  │  │                                                              │  │ │
│  │  │     Progress: ████████████░░░░ 60%                          │  │ │
│  │  │                                                              │  │ │
│  │  │     GOALS:                                                   │  │ │
│  │  │     ✓ HbA1c below 7% (Current: 6.8%)                        │  │ │
│  │  │     ✓ Maintain medication adherence >90%                    │  │ │
│  │  │     ○ Monitor fasting glucose weekly                        │  │ │
│  │  │                                                              │  │ │
│  │  │     [View Full Plan] [Log Progress]                         │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Care Plan Detail

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Cardiac Health Management                        [📤 Share with Doctor]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Assigned by: Dr. Anil Sharma, Cardiologist                             │
│  Duration: Nov 25, 2025 - Feb 25, 2026 (3 months)                       │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  HEALTH GOALS                                                      │ │
│  │                                                                    │ │
│  │  1. Blood Pressure Control                                        │ │
│  │     Target: 130/85 mmHg or below                                  │ │
│  │     Current: 138/88 mmHg                                          │ │
│  │     Status: 🟡 In Progress                                        │ │
│  │                                                                    │ │
│  │  2. Daily Exercise                                                 │ │
│  │     Target: 30 minutes walking, 7 days/week                       │ │
│  │     This week: 4 days completed                                   │ │
│  │     Status: 🟡 In Progress                                        │ │
│  │                                                                    │ │
│  │  3. Dietary Changes                                                │ │
│  │     Target: Sodium < 2300mg/day                                   │ │
│  │     Status: 🟢 On Track                                           │ │
│  │                                                                    │ │
│  │  4. Weight Management                                              │ │
│  │     Target: Reduce 3kg in 3 months                                │ │
│  │     Current: Lost 0.5kg                                           │ │
│  │     Status: 🟡 In Progress                                        │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  CARE INSTRUCTIONS                                                 │ │
│  │                                                                    │ │
│  │  💊 Medications:                                                   │ │
│  │  • Amlodipine 5mg - Once daily (morning)                          │ │
│  │  • Atorvastatin 10mg - Once daily (night)                         │ │
│  │  • Aspirin 75mg - Once daily (after lunch)                        │ │
│  │                                                                    │ │
│  │  🍽️ Diet Guidelines:                                              │ │
│  │  • Reduce salt in cooking                                         │ │
│  │  • Avoid processed foods                                          │ │
│  │  • Include fruits and vegetables                                  │ │
│  │  • Limit red meat to 2x/week                                      │ │
│  │                                                                    │ │
│  │  🏃 Exercise:                                                      │ │
│  │  • Brisk walking 30 min/day                                       │ │
│  │  • Avoid strenuous activity                                       │ │
│  │  • Stop if chest pain or breathlessness                           │ │
│  │                                                                    │ │
│  │  ⚠️ Warning Signs (Contact doctor immediately):                   │ │
│  │  • Chest pain or discomfort                                       │ │
│  │  • Severe headache                                                │ │
│  │  • Breathlessness at rest                                         │ │
│  │  • Swelling in legs                                               │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  LOG TODAY'S PROGRESS                                              │ │
│  │                                                                    │ │
│  │  Blood Pressure: [___]/[___] mmHg  [Log]                          │ │
│  │  Weight: [___] kg                  [Log]                          │ │
│  │  Exercise: [__] minutes            [Log]                          │ │
│  │  Notes: [_______________________]  [Add]                          │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 10. Billing & Payments (`/patient/billing`)

**Status:** ❌ Not Started

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Billing & Payments                                    [Payment History]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  OUTSTANDING BALANCE                                               │ │
│  │                                                                    │ │
│  │  Total Due: ₹12,500                                   [Pay All →] │ │
│  │                                                                    │ │
│  │  From 3 hospitals:                                                 │ │
│  │  • City General Hospital: ₹8,000                                  │ │
│  │  • Heart Specialty Center: ₹3,500                                 │ │
│  │  • Wellness Clinic: ₹1,000                                        │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  PENDING INVOICES                                                  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  INV-2025-1234 • City General Hospital                      │  │ │
│  │  │  Consultation + Lab Tests                                   │  │ │
│  │  │  Date: Dec 1, 2025                                          │  │ │
│  │  │                                                              │  │ │
│  │  │  Amount: ₹5,000                                              │  │ │
│  │  │  Insurance Covered: ₹3,000                                   │  │ │
│  │  │  ─────────────────────────────────────────────────────────  │  │ │
│  │  │  You Pay: ₹2,000                         [View] [Pay Now]   │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  INV-2025-1198 • City General Hospital                      │  │ │
│  │  │  Surgery + Hospital Stay (3 days)                           │  │ │
│  │  │  Date: Nov 15-18, 2025                                      │  │ │
│  │  │                                                              │  │ │
│  │  │  Amount: ₹45,000                                             │  │ │
│  │  │  Insurance Covered: ₹39,000                                  │  │ │
│  │  │  ─────────────────────────────────────────────────────────  │  │ │
│  │  │  You Pay: ₹6,000                                             │  │ │
│  │  │                                                              │  │ │
│  │  │  💳 Payment Plan Active: ₹2,000/month                       │  │ │
│  │  │  Paid: ₹0 / ₹6,000 (0%)                                     │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Details] [Modify Plan] [Pay Full Amount]             │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  SAVED PAYMENT METHODS                         [+ Add New Method] │ │
│  │                                                                    │ │
│  │  💳 HDFC Credit Card ****4532 (Default)          [Edit] [Remove] │ │
│  │  📱 UPI: rajesh@okaxis                           [Edit] [Remove] │ │
│  │  🏦 ICICI Net Banking                            [Edit] [Remove] │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Payment Plan Setup

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Set Up Payment Plan                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Invoice: INV-2025-1198                                                 │
│  Total Amount: ₹6,000                                                   │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  SELECT PAYMENT PLAN                                               │ │
│  │                                                                    │ │
│  │  [○ 2 months] ₹3,000/month • No interest                          │ │
│  │                                                                    │ │
│  │  [● 3 months] ₹2,000/month • No interest                          │ │
│  │                                                                    │ │
│  │  [○ 6 months] ₹1,050/month • 5% interest                          │ │
│  │                                                                    │ │
│  │  [○ Custom] Set your own monthly amount                           │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Payment Schedule:                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  #   │ Due Date      │ Amount    │ Status                         │ │
│  │  ────┼───────────────┼───────────┼─────────────────────────────── │ │
│  │  1   │ Dec 15, 2025  │ ₹2,000    │ Upcoming (Auto-debit)          │ │
│  │  2   │ Jan 15, 2026  │ ₹2,000    │ Scheduled                      │ │
│  │  3   │ Feb 15, 2026  │ ₹2,000    │ Scheduled                      │ │
│  │  ────┼───────────────┼───────────┼─────────────────────────────── │ │
│  │      │ Total         │ ₹6,000    │                                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Auto-debit from: [HDFC Credit Card ****4532 ▼]                         │
│                                                                          │
│  ☑ Send me reminders 3 days before due date                             │
│                                                                          │
│                                 [Cancel]  [Confirm Payment Plan →]      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Insurance Claims Tracking

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Insurance Claims                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  My Insurance: Star Health • Policy #SH-2025-78432                      │
│  Coverage: ₹5,00,000 • Utilized: ₹42,000                                │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  RECENT CLAIMS                                                     │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Claim #CLM-2025-8901                                       │  │ │
│  │  │  City General Hospital • Surgery                            │  │ │
│  │  │  Claim Amount: ₹45,000                                      │  │ │
│  │  │                                                              │  │ │
│  │  │  Status: 🟢 Approved                                        │  │ │
│  │  │  Approved: ₹39,000 • Deductible: ₹6,000                     │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Details] [Download Settlement Letter]                │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Claim #CLM-2025-9012                                       │  │ │
│  │  │  Heart Specialty Center • Consultation                      │  │ │
│  │  │  Claim Amount: ₹3,500                                       │  │ │
│  │  │                                                              │  │ │
│  │  │  Status: 🟡 Under Review                                    │  │ │
│  │  │  Submitted: Dec 2, 2025                                     │  │ │
│  │  │  Expected Decision: Dec 9, 2025                             │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Details] [Track Progress]                            │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 11. Messages & Communication (`/patient/messages`)

**Status:** ❌ Not Started

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Messages                                               [+ New Message] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [All] [Doctors (2)] [Hospitals (3)] [Support]                          │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  CONVERSATIONS                                                     │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo] Dr. Anil Sharma                        🔵 Unread   │  │ │
│  │  │  Cardiologist • City General Hospital                       │  │ │
│  │  │                                                              │  │ │
│  │  │  "Your blood pressure readings look good. Keep up..."       │  │ │
│  │  │  Today, 10:30 AM                                            │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo] Dr. Priya Patel                                    │  │ │
│  │  │  General Physician • Wellness Clinic                        │  │ │
│  │  │                                                              │  │ │
│  │  │  "Please upload your latest HbA1c report when..."           │  │ │
│  │  │  Dec 2, 2025                                                │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Logo] City General Hospital                               │  │ │
│  │  │  Billing Department                                         │  │ │
│  │  │                                                              │  │ │
│  │  │  "Your insurance claim has been approved..."                │  │ │
│  │  │  Nov 28, 2025                                               │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Message Thread

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Dr. Anil Sharma                               [📞 Call] [📹 Video]  │
│     Cardiologist • City General Hospital                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │                               Dec 3, 2025                         │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────┐                      │ │
│  │  │ Doctor, I've been feeling some          │ 9:15 AM              │ │
│  │  │ discomfort after taking the new         │                      │ │
│  │  │ medication. Is this normal?             │                      │ │
│  │  └─────────────────────────────────────────┘                      │ │
│  │                                                                    │ │
│  │        ┌─────────────────────────────────────────┐                │ │
│  │ 10:30 AM│ Hi Rajesh, mild discomfort can occur   │                │ │
│  │        │ in the first week. However, if you     │                │ │
│  │        │ experience severe pain or              │                │ │
│  │        │ breathlessness, please visit           │                │ │
│  │        │ emergency immediately.                  │                │ │
│  │        │                                         │                │ │
│  │        │ Meanwhile, please share your BP        │                │ │
│  │        │ readings from the past 3 days.         │                │ │
│  │        └─────────────────────────────────────────┘                │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────┐                      │ │
│  │  │ Here are my BP readings:                │ 11:00 AM             │ │
│  │  │ Dec 1: 140/90                           │                      │ │
│  │  │ Dec 2: 138/88                           │                      │ │
│  │  │ Dec 3: 135/85                           │                      │ │
│  │  └─────────────────────────────────────────┘                      │ │
│  │                                                                    │ │
│  │        ┌─────────────────────────────────────────┐                │ │
│  │ 11:15 AM│ Your blood pressure readings look      │                │ │
│  │        │ good. Keep up the good work with       │                │ │
│  │        │ the medication. The discomfort         │                │ │
│  │        │ should subside in 2-3 days.            │                │ │
│  │        └─────────────────────────────────────────┘                │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Type a message...                          [📎] [📷] [Send →]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ⚠️ For emergencies, call 108 or visit the nearest hospital            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Authentication & Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/patient/register` | Create patient account |
| POST | `/api/v1/patient/verify-phone` | Verify phone OTP |
| POST | `/api/v1/patient/login` | Patient login |
| GET | `/api/v1/patient/profile` | Get my profile |
| PATCH | `/api/v1/patient/profile` | Update profile |
| POST | `/api/v1/patient/profile/health` | Initialize health profile |
| PATCH | `/api/v1/patient/profile/health` | Update health profile |

### Multi-Tenant Access

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/hospitals` | List connected hospitals |
| POST | `/api/v1/patient/hospitals/connect` | Connect to a hospital |
| DELETE | `/api/v1/patient/hospitals/{id}` | Disconnect from hospital |
| GET | `/api/v1/patient/hospitals/discover` | Search hospital directory |
| POST | `/api/v1/patient/hospitals/connect-code` | Connect via registration code |
| PATCH | `/api/v1/patient/hospitals/{id}/set-active` | Set active hospital context |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/dashboard` | Dashboard data (all hospitals) |
| GET | `/api/v1/patient/dashboard/{hospitalId}` | Dashboard for specific hospital |
| GET | `/api/v1/patient/activity` | Recent activity feed |
| GET | `/api/v1/patient/reminders` | Health reminders |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/appointments` | My appointments |
| GET | `/api/v1/patient/appointments/{id}` | Appointment details |
| POST | `/api/v1/patient/appointments` | Book appointment |
| PATCH | `/api/v1/patient/appointments/{id}/reschedule` | Reschedule appointment |
| DELETE | `/api/v1/patient/appointments/{id}` | Cancel appointment |
| GET | `/api/v1/patient/appointments/slots` | Get available slots |
| POST | `/api/v1/patient/appointments/hold-slot` | Hold slot during booking |
| POST | `/api/v1/patient/appointments/{id}/join` | Join telehealth session |

### Medical Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/records` | Medical records timeline |
| GET | `/api/v1/patient/records/{id}` | Record details |
| POST | `/api/v1/patient/records/upload` | Upload document |
| GET | `/api/v1/patient/records/{id}/download` | Download record |
| POST | `/api/v1/patient/records/{id}/share` | Share record with provider |
| GET | `/api/v1/patient/records/consolidated` | Records from all hospitals |

### Prescriptions & Medications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/prescriptions` | My prescriptions |
| GET | `/api/v1/patient/prescriptions/{id}` | Prescription details |
| GET | `/api/v1/patient/medications` | Active medications list |
| POST | `/api/v1/patient/medications/{id}/refill` | Request refill |
| GET | `/api/v1/patient/medications/schedule` | Today's medication schedule |
| POST | `/api/v1/patient/medications/{id}/log` | Log medication taken |
| GET | `/api/v1/patient/medications/adherence` | Adherence report |
| PATCH | `/api/v1/patient/medications/reminders` | Configure reminders |

### Care Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/care-plans` | My care plans |
| GET | `/api/v1/patient/care-plans/{id}` | Care plan details |
| POST | `/api/v1/patient/care-plans/{id}/progress` | Log progress |
| GET | `/api/v1/patient/care-plans/{id}/history` | Progress history |

### Family Members / Dependents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/family` | List family members |
| POST | `/api/v1/patient/family` | Add family member |
| GET | `/api/v1/patient/family/{id}` | Family member details |
| PATCH | `/api/v1/patient/family/{id}` | Update family member |
| DELETE | `/api/v1/patient/family/{id}` | Remove family member |
| GET | `/api/v1/patient/family/{id}/records` | Family member records |
| GET | `/api/v1/patient/family/{id}/appointments` | Family member appointments |

### Billing & Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/billing` | Billing overview |
| GET | `/api/v1/patient/billing/invoices` | All invoices |
| GET | `/api/v1/patient/billing/invoices/{id}` | Invoice details |
| POST | `/api/v1/patient/billing/invoices/{id}/pay` | Pay invoice |
| POST | `/api/v1/patient/billing/payment-plan` | Create payment plan |
| PATCH | `/api/v1/patient/billing/payment-plan/{id}` | Modify payment plan |
| GET | `/api/v1/patient/billing/payment-methods` | Saved payment methods |
| POST | `/api/v1/patient/billing/payment-methods` | Add payment method |
| DELETE | `/api/v1/patient/billing/payment-methods/{id}` | Remove payment method |
| GET | `/api/v1/patient/billing/insurance-claims` | Insurance claims |
| GET | `/api/v1/patient/billing/insurance-claims/{id}` | Claim details |

### Messages & Communication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/messages` | All conversations |
| GET | `/api/v1/patient/messages/{threadId}` | Message thread |
| POST | `/api/v1/patient/messages` | Start new conversation |
| POST | `/api/v1/patient/messages/{threadId}` | Send message |
| POST | `/api/v1/patient/messages/{threadId}/attachment` | Send attachment |
| PATCH | `/api/v1/patient/messages/{threadId}/read` | Mark as read |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/patient/notifications` | All notifications |
| PATCH | `/api/v1/patient/notifications/{id}/read` | Mark as read |
| PATCH | `/api/v1/patient/notifications/read-all` | Mark all as read |
| GET | `/api/v1/patient/notifications/preferences` | Notification settings |
| PATCH | `/api/v1/patient/notifications/preferences` | Update preferences |

---

## 📋 Implementation Checklist

### Multi-Tenant Access
- [ ] Hospital switcher component
- [ ] Hospital discovery/search
- [ ] Connect to hospital flow
- [ ] Registration code connection
- [ ] Consolidated view across hospitals
- [ ] Active context indicator

### Patient Onboarding
- [ ] Account creation form
- [ ] Phone verification (OTP)
- [ ] Email verification (optional)
- [ ] Basic profile setup
- [ ] Health profile initialization
- [ ] Allergies & conditions entry
- [ ] Current medications entry
- [ ] Hospital connection flow

### Dashboard
- [x] Welcome message
- [x] Next appointment card
- [x] Quick actions
- [ ] Recent activity (all hospitals)
- [ ] Health reminders
- [ ] Outstanding balance (all hospitals)
- [ ] Hospital switcher

### Appointments
- [x] Appointments list
- [x] Upcoming/Past tabs
- [x] Appointment details
- [x] Booking flow (step 1-2)
- [x] Booking flow (step 3-4) - Real-time slots
- [ ] Book for dependent
- [ ] Reschedule functionality
- [ ] Cancel functionality
- [ ] Telehealth join button
- [ ] Pre-appointment checklist

### Medical Records
- [ ] Health timeline (chronological)
- [ ] Records by type filter
- [ ] Records by hospital filter
- [ ] Document viewer
- [ ] Upload functionality
- [ ] Download functionality
- [ ] Share with provider
- [ ] Consolidated view

### Prescriptions & Medications
- [ ] Active medications list
- [ ] Prescription history
- [ ] Medication schedule (daily view)
- [ ] Adherence tracking
- [ ] Take medication logging
- [ ] Refill request flow
- [ ] Reminder configuration
- [ ] Refill alerts

### Care Plans
- [ ] Active care plans list
- [ ] Care plan detail view
- [ ] Progress logging
- [ ] Goal tracking
- [ ] Care instructions display
- [ ] Progress history chart

### Family Members
- [ ] Family members list
- [ ] Add family member form
- [ ] Edit family member
- [ ] Book for family member
- [ ] View family member records
- [ ] Switch patient context

### Profile & Settings
- [x] Personal info
- [ ] Health profile management
- [ ] Insurance info
- [ ] Emergency contacts
- [ ] Notification preferences
- [ ] Privacy settings
- [ ] Connected hospitals list

### Billing & Payments
- [ ] Outstanding balance card
- [ ] Invoices list
- [ ] Invoice detail view
- [ ] Online payment flow
- [ ] Payment plan setup
- [ ] Saved payment methods
- [ ] Insurance claims tracking
- [ ] Payment history

### Messages
- [ ] Conversations list
- [ ] Message thread view
- [ ] Send message
- [ ] Attach files/images
- [ ] Unread indicators
- [ ] Quick call/video buttons

### Notifications
- [ ] Notification bell
- [ ] Notification dropdown
- [ ] Notification settings
- [ ] Push notification support
- [ ] SMS notification support
- [ ] WhatsApp notification support

---

## 🔗 Related Documentation

- [02_AUTHENTICATION.md](./02_AUTHENTICATION.md) - Registration
- [04_HOSPITAL_PUBLIC_SITE.md](./04_HOSPITAL_PUBLIC_SITE.md) - Doctor browsing
- [06_DOCTOR_WORKSPACE.md](./06_DOCTOR_WORKSPACE.md) - Doctor side
- [07_STAFF_WORKSPACE.md](./07_STAFF_WORKSPACE.md) - Staff patient management
