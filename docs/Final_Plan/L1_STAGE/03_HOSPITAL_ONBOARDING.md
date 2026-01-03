# 03. Hospital Onboarding Process

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** ✅ Implemented

---

## 🎯 Overview

Hospital onboarding is the process where a new hospital joins the platform:
1. Super admin sends invitation
2. Hospital admin receives email with link
3. Hospital admin completes 12-step form
4. Super admin reviews and approves
5. Hospital tenant is created and activated

---

## 🔄 Complete Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HOSPITAL ONBOARDING LIFECYCLE                         │
└─────────────────────────────────────────────────────────────────────────┘

   Super Admin                  Hospital Admin                    System
       │                             │                               │
   ┌───┴───┐                         │                               │
   │ PHASE │                         │                               │
   │   1   │  Send Invitation        │                               │
   │ INVITE│  (email, plan, expiry)  │                               │
   └───┬───┘  ───────────────────────────────────────────────────────►
       │                             │                               │
       │                             │◄───────────────────────────────
       │                             │   Receive Email               │
       │                             │   [Start Onboarding →]        │
       │                             │                               │
       │                         ┌───┴───┐                           │
       │                         │ PHASE │                           │
       │                         │   2   │  Click Link               │
       │                         │ FORM  │  ───────────────────────►│
       │                         └───┬───┘                           │
       │                             │                               │
       │                             │   Validate Token              │
       │                             │◄───────────────────────────────
       │                             │                               │
       │                             │   Complete 12-Step Form       │
       │                             │   (autosave enabled)          │
       │                             │                               │
       │                             │   Step 1-12...                │
       │                             │   ───────────────────────────►│
       │                             │                               │
       │                         ┌───┴───┐                           │
       │                         │ PHASE │                           │
       │                         │   3   │  Submit for Review        │
       │                         │SUBMIT │  ───────────────────────►│
       │                         └───┬───┘                           │
       │                             │                               │
       │◄─────────────────────────────────────────────────────────────
       │   Notification: Review Ready│                               │
       │                             │                               │
   ┌───┴───┐                         │                               │
   │ PHASE │                         │                               │
   │   4   │  Review Submission      │                               │
   │REVIEW │  ───────────────────────────────────────────────────────►
   └───┬───┘                         │                               │
       │                             │                               │
       │   Decision:                 │                               │
       │   ┌─────────────────────────┼───────────────────────────────┐
       │   │ APPROVE                 │                               │
       │   │ ─────────────────────────────────────────────────────────►
       │   │                         │                               │
       │   │                         │   • Create tenant             │
       │   │                         │   • Setup subdomain           │
       │   │                         │   • Create admin account      │
       │   │                         │   • Send welcome email        │
       │   │                         │                               │
       │   │                         │◄───────────────────────────────
       │   │                         │   Activation Complete         │
       │   │                         │                               │
       │   ├─────────────────────────┼───────────────────────────────┤
       │   │ REQUEST CHANGES         │                               │
       │   │ ─────────────────────────────────────────────────────────►
       │   │                         │                               │
       │   │                         │◄───────────────────────────────
       │   │                         │   Email with feedback         │
       │   │                         │                               │
       │   │                         │   Fix & Resubmit              │
       │   │                         │   ───────────────────────────►│
       │   │                         │                               │
       │   └─────────────────────────┼───────────────────────────────┘
       │                             │                               │
   ┌───┴───┐                     ┌───┴───┐                           │
   │ PHASE │                     │ PHASE │                           │
   │   5   │                     │   5   │                           │
   │ACTIVE │                     │ LOGIN │                           │
   └───────┘                     └───────┘                           │
       │                             │                               │
       │   Monitor tenant            │   Login to Admin Dashboard    │
       │                             │   ───────────────────────────►│
       │                             │                               │
```

---

## 📝 12-Step Form Specification

### Step 1: Organization Information

**Purpose:** Capture legal and registration details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Legal Name | text | ✅ | Official registered name |
| Display Name | text | ✅ | Name shown on website |
| Registration Number | text | ✅ | Hospital registration ID |
| GST Number | text | ❌ | Tax registration (if applicable) |
| PAN Number | text | ❌ | PAN card number |
| Established Date | date | ❌ | When hospital was founded |
| Hospital Type | select | ✅ | Multi-specialty, Clinic, etc. |
| Bed Count | number | ❌ | Total beds available |

**Validation:**
- Legal name: 3-200 characters
- Registration number: Format varies by region

---

### Step 2: Location & Contact

**Purpose:** Physical and communication details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Street Address | text | ✅ | Building, street |
| City | text | ✅ | City name |
| State | select | ✅ | State/Province |
| Postal Code | text | ✅ | ZIP/PIN code |
| Country | select | ✅ | Country |
| Phone (Primary) | tel | ✅ | Main contact number |
| Phone (Emergency) | tel | ✅ | Emergency line |
| Email | email | ✅ | Official email |
| Website | url | ❌ | Existing website (if any) |
| Google Maps URL | url | ❌ | Location link |

**Features:**
- Auto-complete address using Google Places API
- Map preview of location

---

### Step 3: Branding & Visual Identity

**Purpose:** Customization for white-label experience

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Logo | file | ✅ | Hospital logo (PNG/SVG) |
| Favicon | file | ❌ | Browser tab icon |
| Primary Color | color | ✅ | Main brand color |
| Secondary Color | color | ✅ | Accent color |
| Background Color | color | ❌ | Light/dark preference |
| Font Family | select | ❌ | Typography choice |

**Validation:**
- Logo: PNG/SVG, max 2MB, min 200x200px
- Colors: Valid hex codes
- Contrast check for accessibility

**Preview:**
```
┌───────────────────────────────────────────────┐
│  [Logo]  Hospital Name                        │
│  ─────────────────────────────────────────────│
│                                               │
│  Preview of how your branding will look:      │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  ████████████  Primary Color            │ │
│  │  ████████████  Secondary Color          │ │
│  │                                         │ │
│  │  [Sample Button]  [Sample Link]         │ │
│  │                                         │ │
│  │  Sample heading text                    │ │
│  │  Sample body text in your font          │ │
│  └─────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

---

### Step 4: Website Content

**Purpose:** Content for public hospital landing page

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Hero Headline | text | ✅ | Main heading (max 60 chars) |
| Hero Subheadline | text | ✅ | Supporting text (max 160 chars) |
| About Us | textarea | ✅ | Hospital description |
| Mission Statement | textarea | ❌ | Mission/vision |
| Achievements | list | ❌ | Awards, recognitions |
| Gallery Images | file[] | ❌ | Hospital photos |

**Tips shown to user:**
- Headline: "Your Health, Our Priority"
- Keep about section under 500 words
- High-quality images recommended

---

### Step 5: Services & Specialties

**Purpose:** Define medical offerings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Departments | multi-select | ✅ | Medical departments |
| Specialties | multi-select | ✅ | Doctor specializations |
| Services | list | ✅ | Available services |
| Emergency Services | boolean | ✅ | 24/7 emergency availability |
| Telehealth | boolean | ❌ | Video consultation available |
| Home Visit | boolean | ❌ | Home visit services |

**Department Options:**
- General Medicine
- Pediatrics
- Gynecology
- Cardiology
- Orthopedics
- Dermatology
- ENT
- Ophthalmology
- Dentistry
- Neurology
- Oncology
- Emergency
- Radiology
- Pathology
- Pharmacy
- (Custom option)

---

### Step 6: Leadership & Team

**Purpose:** Key personnel information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Admin Name | text | ✅ | Primary admin name |
| Admin Email | email | ✅ | Admin login email |
| Admin Phone | tel | ✅ | Admin contact |
| Medical Director | text | ❌ | Head of medical staff |
| CEO/Director | text | ❌ | Hospital head |
| Leadership Bios | list | ❌ | Team descriptions |
| Team Size | number | ❌ | Total staff count |

---

### Step 7: Operational Policies

**Purpose:** Scheduling and operational rules

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Operating Hours | schedule | ✅ | Weekly schedule |
| Appointment Duration | select | ✅ | Default slot length |
| Booking Lead Time | select | ✅ | How far in advance |
| Cancellation Policy | textarea | ✅ | Cancellation rules |
| No-Show Policy | textarea | ❌ | No-show handling |
| Payment Terms | textarea | ❌ | Payment expectations |

**Schedule Builder:**
```
┌─────────────────────────────────────────────────┐
│  Operating Hours                                │
├─────────────────────────────────────────────────┤
│  Monday      ☑  [09:00] to [18:00]             │
│  Tuesday     ☑  [09:00] to [18:00]             │
│  Wednesday   ☑  [09:00] to [18:00]             │
│  Thursday    ☑  [09:00] to [18:00]             │
│  Friday      ☑  [09:00] to [18:00]             │
│  Saturday    ☑  [09:00] to [14:00]             │
│  Sunday      ☐  Closed                          │
├─────────────────────────────────────────────────┤
│  ☑ 24/7 Emergency Available                     │
└─────────────────────────────────────────────────┘
```

---

### Step 8: Compliance & Documentation

**Purpose:** Legal and regulatory documents

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Hospital License | file | ✅ | Registration certificate |
| Tax Certificate | file | ❌ | GST/Tax registration |
| Insurance Certificate | file | ❌ | Liability insurance |
| Accreditation | file | ❌ | NABH/JCI certification |
| Privacy Policy | file | ❌ | Custom privacy policy |
| Terms of Service | file | ❌ | Custom terms |

**Document Requirements:**
- PDF format preferred
- Max 10MB per file
- Expiry dates tracked

---

### Step 9: Integrations & Preferences

**Purpose:** Third-party service configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| SMS Provider | select | ❌ | Notification SMS |
| Email Provider | select | ❌ | Custom email |
| Analytics | boolean | ❌ | Enable analytics |
| AI Features | boolean | ❌ | Enable AI assistance |
| Language | select | ✅ | Primary language |
| Timezone | select | ✅ | Operating timezone |

---

### Step 10: Admin Account Setup

**Purpose:** Create primary admin credentials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Admin Email | email | ✅ | (Pre-filled from Step 6) |
| Password | password | ✅ | Strong password |
| Confirm Password | password | ✅ | Must match |
| Enable MFA | boolean | ✅ | Two-factor auth |

**Password Requirements:**
- Minimum 12 characters
- Uppercase and lowercase
- Numbers and special characters

---

### Step 11: Review & Preview

**Purpose:** Final review before submission

**Features:**
- Summary of all entered data
- Preview of hospital landing page
- Preview of login page
- Checklist of required items
- Ability to edit any section

```
┌─────────────────────────────────────────────────────────────────┐
│  Review Your Information                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Organization Information                         [Edit]     │
│     Legal Name: City General Hospital                           │
│     Registration: HSP/2020/12345                                │
│                                                                  │
│  ✅ Location & Contact                               [Edit]     │
│     123 Medical Street, Chennai, Tamil Nadu                     │
│     +91 98765 43210                                             │
│                                                                  │
│  ✅ Branding                                         [Edit]     │
│     [Logo Preview] Primary: #2563eb Secondary: #10b981          │
│                                                                  │
│  ... (all sections) ...                                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Preview Your Website                                      │ │
│  │  [Open Preview →]                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 12: Confirmation & Submit

**Purpose:** Final agreements and submission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Terms Agreement | checkbox | ✅ | Accept platform terms |
| Privacy Agreement | checkbox | ✅ | Accept privacy policy |
| Data Processing | checkbox | ✅ | Accept DPA |
| Preferred Subdomain | text | ✅ | Desired URL |

**Subdomain Selection:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Choose Your Hospital URL                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Your hospital will be available at:                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ cityhospital                        .athaarva.com       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ✅ Available                                                    │
│                                                                  │
│  Guidelines:                                                     │
│  • 3-20 characters                                              │
│  • Letters, numbers, hyphens only                               │
│  • No special characters or spaces                              │
│  • Cannot change after approval                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Model

```typescript
interface OnboardingSession {
  id: string;                    // UUID
  invitation_id: string;         // UUID
  status: OnboardingStatus;
  current_step: number;          // 1-12
  
  // Step data (JSONB)
  organization: OrganizationData;
  location: LocationData;
  branding: BrandingData;
  content: ContentData;
  services: ServicesData;
  leadership: LeadershipData;
  policies: PoliciesData;
  compliance: ComplianceData;
  integrations: IntegrationsData;
  admin: AdminData;
  subdomain: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
}

type OnboardingStatus = 
  | 'draft'           // In progress
  | 'submitted'       // Awaiting review
  | 'changes_requested' // Needs updates
  | 'approved'        // Approved, provisioning
  | 'activated'       // Tenant live
  | 'rejected';       // Application rejected
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/onboarding/hospital/validate-token` | Validate invite token |
| GET | `/api/v1/onboarding/hospital/session` | Get current session |
| POST | `/api/v1/onboarding/hospital/session` | Create new session |
| PATCH | `/api/v1/onboarding/hospital/session` | Update session (autosave) |
| POST | `/api/v1/onboarding/hospital/submit` | Submit for review |
| GET | `/api/v1/onboarding/hospital/subdomain/check` | Check subdomain availability |

---

## 📋 Implementation Checklist

- [x] Token validation flow
- [x] 12-step wizard UI
- [x] Form validation per step
- [x] Auto-save functionality
- [x] Branding preview
- [x] Step navigation
- [x] Final review page
- [x] Submission flow
- [ ] Super admin review interface
- [ ] Approval workflow
- [ ] Tenant provisioning automation
- [ ] Welcome email template

---

## 🔗 Related Documentation

- [01_PLATFORM_OVERVIEW.md](./01_PLATFORM_OVERVIEW.md) - Platform structure
- [05_ADMIN_DASHBOARD.md](./05_ADMIN_DASHBOARD.md) - Post-onboarding admin
- [09_BACKEND_API.md](./09_BACKEND_API.md) - API specifications
