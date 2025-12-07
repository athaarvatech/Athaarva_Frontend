# 🏥 Athaarva Healthcare Platform - Master Documentation

> **Version:** 1.0  
> **Last Updated:** December 4, 2025  
> **Stage:** L1 (Core Platform)

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [System Architecture](#system-architecture)
3. [URL Structure & Routing](#url-structure--routing)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Complete User Flows](#complete-user-flows)
6. [Frontend Structure](#frontend-structure)
7. [Backend Structure](#backend-structure)
8. [Database Schema Overview](#database-schema-overview)
9. [Implementation Status](#implementation-status)
10. [Documentation Index](#documentation-index)

---

## 🌐 Platform Overview

Athaarva is a **multi-tenant hospital management SaaS platform** where:
- Each hospital gets its own **branded subdomain** (e.g., `cityhospital.athaarva.com`)
- Hospitals have complete control over their branding, staff, and operations
- Patients can register and interact with multiple hospitals
- Super admins manage the entire platform from a central dashboard

### Core Principles
1. **Multi-Tenancy**: Complete data isolation between hospitals
2. **White-Label Branding**: Each hospital gets customized appearance
3. **Role-Based Access**: Different dashboards for admin, doctor, staff, patient
4. **Self-Service**: Patients register themselves; staff invited by admin

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ATHAARVA PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    MAIN DOMAIN (athaarva.com)                    │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │   Landing   │  │    Auth     │  │     Super Admin         │  │    │
│  │  │    Page     │  │  Selector   │  │      Dashboard          │  │    │
│  │  │             │  │ (Hospital   │  │   (Platform Mgmt)       │  │    │
│  │  │  Services   │  │   Picker)   │  │                         │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                    │                                     │
│                                    ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │              HOSPITAL SUBDOMAINS (*.athaarva.com)                │    │
│  │                                                                   │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │              hospital1.athaarva.com                      │    │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐│    │    │
│  │  │  │ Public  │ │  Auth   │ │  Admin  │ │  Doctor/Staff   ││    │    │
│  │  │  │ Landing │ │  Login  │ │Dashboard│ │   Dashboards    ││    │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘│    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                   │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │              hospital2.athaarva.com                      │    │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐│    │    │
│  │  │  │ Public  │ │  Auth   │ │  Admin  │ │  Doctor/Staff   ││    │    │
│  │  │  │ Landing │ │  Login  │ │Dashboard│ │   Dashboards    ││    │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘│    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      SHARED BACKEND API                          │    │
│  │         FastAPI + PostgreSQL (Multi-Schema Architecture)         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 URL Structure & Routing

### Main Domain Routes (`athaarva.com`)

| URL | Page | Description |
|-----|------|-------------|
| `/` | Landing Page | Platform services, features, pricing |
| `/auth` | Hospital Selector | Search & select hospital to login |
| `/auth/hospital/[subdomain]` | Redirect | Redirects to `subdomain.athaarva.com/auth` |
| `/super-admin` | Super Admin Dashboard | Platform management (protected) |
| `/super-admin/tenants` | Tenant Management | Manage all hospitals |
| `/super-admin/plans` | Plan Management | Pricing plans |
| `/super-admin/invitations` | Invitations | Send hospital onboarding invites |
| `/onboarding/hospital` | Hospital Onboarding | 12-step form (invite required) |
| `/ecommerce` | Medical Equipment Store | Shopify-integrated store |

### Hospital Subdomain Routes (`[hospital].athaarva.com`)

#### Public Routes (No Auth Required)
| URL | Page | Description |
|-----|------|-------------|
| `/` | Hospital Landing | Branded public website |
| `/auth` | Login Page | Hospital-branded login |
| `/auth/register` | Patient Registration | New patient signup (patients only) |
| `/auth/forgot-password` | Password Reset | Request password reset |
| `/auth/verify-email` | Email Verification | Verify email address |
| `/doctors` | Doctor Directory | Public list of doctors |
| `/services` | Services Page | Hospital services |
| `/contact` | Contact Page | Contact information |

#### Protected Routes (Auth Required)

**Admin Dashboard** (`/admin/*`)
| URL | Description |
|-----|-------------|
| `/admin` | Admin Dashboard Home |
| `/admin/team` | Team Management |
| `/admin/team/invite` | Invite Staff/Doctors |
| `/admin/team/pending` | Pending Invitations |
| `/admin/doctors` | Doctor Management |
| `/admin/patients` | Patient Records |
| `/admin/appointments` | All Appointments |
| `/admin/billing` | Billing & Payments |
| `/admin/settings` | Hospital Settings |
| `/admin/reports` | Reports & Analytics |

**Doctor Dashboard** (`/doctor/*`)
| URL | Description |
|-----|-------------|
| `/doctor` | Doctor Dashboard Home |
| `/doctor/calendar` | Appointment Calendar |
| `/doctor/patients` | My Patients |
| `/doctor/appointments` | My Appointments |
| `/doctor/consultations` | Consultation Notes |
| `/doctor/prescriptions` | Prescriptions |
| `/doctor/profile` | Profile Settings |

**Staff Dashboard** (`/staff/*`)
| URL | Description |
|-----|-------------|
| `/staff` | Staff Dashboard Home |
| `/staff/appointments` | Manage Appointments |
| `/staff/patients` | Patient Check-in |
| `/staff/billing` | Billing Desk |
| `/staff/queue` | Queue Management |

**Patient Portal** (`/patient/*`)
| URL | Description |
|-----|-------------|
| `/patient` | Patient Dashboard |
| `/patient/appointments` | My Appointments |
| `/patient/appointments/book` | Book Appointment |
| `/patient/records` | Medical Records |
| `/patient/prescriptions` | My Prescriptions |
| `/patient/billing` | Bills & Payments |
| `/patient/profile` | Profile Settings |

### Local Development URL Mapping

For local development without subdomain support:

| Production URL | Local Development URL |
|----------------|----------------------|
| `hospital.athaarva.com/` | `localhost:3000/hospital/[subdomain]/` |
| `hospital.athaarva.com/auth` | `localhost:3000/hospital/[subdomain]/auth` |
| `hospital.athaarva.com/admin` | `localhost:3000/hospital/[subdomain]/admin` |
| `hospital.athaarva.com/doctor` | `localhost:3000/hospital/[subdomain]/doctor` |

---

## 👥 User Roles & Permissions

### Role Hierarchy

```
┌──────────────────────────────────────────────────────┐
│                    SUPER ADMIN                        │
│        (Platform Owner - Athaarva Team)               │
│  • Manage all tenants/hospitals                       │
│  • Send onboarding invitations                        │
│  • Platform-wide settings & analytics                 │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                  HOSPITAL ADMIN                       │
│          (Per Hospital - Full Control)                │
│  • Hospital settings & branding                       │
│  • Invite/manage doctors & staff                      │
│  • View all hospital data                             │
│  • Billing & reports                                  │
└───────────────────────┬──────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   DOCTOR     │ │    STAFF     │ │   PATIENT    │
│              │ │              │ │              │
│ • Calendar   │ │ • Booking    │ │ • Book appt  │
│ • Patients   │ │ • Check-in   │ │ • View records│
│ • Consults   │ │ • Queue mgmt │ │ • Pay bills  │
│ • Prescribe  │ │ • Basic admin│ │ • Message    │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Role Definitions

| Role | Scope | Description |
|------|-------|-------------|
| `super_admin` | Platform | Manages entire platform |
| `hospital_admin` | Tenant | Full control of one hospital |
| `doctor` | Tenant | Clinical operations |
| `receptionist` | Tenant | Front desk operations |
| `nurse` | Tenant | Clinical support |
| `billing_staff` | Tenant | Financial operations |
| `patient` | Multi-tenant | Can access multiple hospitals |

### Authentication Rules

1. **Login Flow**:
   - User enters email & password
   - Backend determines role automatically (NO role selection in frontend)
   - Redirects to appropriate dashboard based on role

2. **Registration**:
   - **Patients**: Self-registration allowed (email verification required)
   - **Staff/Doctors**: Invitation-only (admin invites → onboarding form)
   - **Hospital Admins**: Invitation-only (super admin invites)

3. **Multi-Hospital Access**:
   - Patients can register with multiple hospitals
   - Staff/Doctors are tied to one hospital (unless explicitly added to multiple)

---

## 🔄 Complete User Flows

### Flow 1: Platform Setup (Super Admin → Hospital Onboarding)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HOSPITAL ONBOARDING FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

Super Admin                     Hospital Admin                   System
    │                                │                              │
    │  1. Create Invitation          │                              │
    │─────────────────────────────────────────────────────────────►│
    │                                │                              │
    │                                │◄──────────────────────────────│
    │                                │  2. Send Invitation Email    │
    │                                │     (with token & link)      │
    │                                │                              │
    │                                │  3. Click Link               │
    │                                │────────────────────────────►│
    │                                │                              │
    │                                │  4. Complete 12-Step Form    │
    │                                │  ┌────────────────────────┐  │
    │                                │  │ Step 1: Organization   │  │
    │                                │  │ Step 2: Location       │  │
    │                                │  │ Step 3: Branding       │  │
    │                                │  │ Step 4: Services       │  │
    │                                │  │ Step 5: Leadership     │  │
    │                                │  │ Step 6: Policies       │  │
    │                                │  │ Step 7: Compliance     │  │
    │                                │  │ Step 8: Integrations   │  │
    │                                │  │ Step 9: Admin Account  │  │
    │                                │  │ Step 10: Review        │  │
    │                                │  │ Step 11: Payment       │  │
    │                                │  │ Step 12: Confirmation  │  │
    │                                │  └────────────────────────┘  │
    │                                │                              │
    │                                │  5. Submit Form              │
    │                                │────────────────────────────►│
    │                                │                              │
    │  6. Review Submission          │                              │
    │◄─────────────────────────────────────────────────────────────│
    │                                │                              │
    │  7. Approve Tenant             │                              │
    │─────────────────────────────────────────────────────────────►│
    │                                │                              │
    │                                │◄──────────────────────────────│
    │                                │  8. Tenant Activated         │
    │                                │     - Subdomain provisioned  │
    │                                │     - Admin account created  │
    │                                │     - Email sent             │
    │                                │                              │
    │                                │  9. Login to Admin Dashboard │
    │                                │────────────────────────────►│
    │                                │                              │
```

### Flow 2: Staff/Doctor Onboarding

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STAFF/DOCTOR ONBOARDING FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

Hospital Admin                    Invitee                         System
    │                                │                              │
    │  1. Send Invitation            │                              │
    │  (email, role, department)     │                              │
    │─────────────────────────────────────────────────────────────►│
    │                                │                              │
    │                                │◄──────────────────────────────│
    │                                │  2. Receive Email            │
    │                                │     (onboarding link)        │
    │                                │                              │
    │                                │  3. Click Link               │
    │                                │────────────────────────────►│
    │                                │                              │
    │                                │  4. Complete Onboarding      │
    │                                │  ┌────────────────────────┐  │
    │                                │  │ FOR DOCTORS:           │  │
    │                                │  │ - Personal Info        │  │
    │                                │  │ - Credentials          │  │
    │                                │  │ - Specializations      │  │
    │                                │  │ - Schedule Setup       │  │
    │                                │  │ - Profile Photo        │  │
    │                                │  ├────────────────────────┤  │
    │                                │  │ FOR STAFF:             │  │
    │                                │  │ - Personal Info        │  │
    │                                │  │ - Department           │  │
    │                                │  │ - Emergency Contact    │  │
    │                                │  │ - Documents            │  │
    │                                │  └────────────────────────┘  │
    │                                │                              │
    │                                │  5. Set Password             │
    │                                │────────────────────────────►│
    │                                │                              │
    │                                │◄──────────────────────────────│
    │                                │  6. Account Created          │
    │                                │     - Verification email     │
    │                                │     - Access granted         │
    │                                │                              │
    │  7. View in Team List          │                              │
    │◄─────────────────────────────────────────────────────────────│
    │                                │                              │
    │                                │  8. Login to Dashboard       │
    │                                │────────────────────────────►│
```

### Flow 3: Patient Registration & Booking

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PATIENT REGISTRATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

Patient                          Hospital Site                    System
    │                                │                              │
    │  1. Visit hospital.athaarva.com│                              │
    │────────────────────────────────►                              │
    │                                │                              │
    │  2. Click "Register"           │                              │
    │────────────────────────────────►                              │
    │                                │                              │
    │  3. Fill Registration Form     │                              │
    │  - Email                       │                              │
    │  - Password                    │                              │
    │  - Name                        │                              │
    │  - Phone                       │                              │
    │  - DOB                         │                              │
    │────────────────────────────────────────────────────────────►│
    │                                │                              │
    │◄──────────────────────────────────────────────────────────────│
    │  4. Verification Email Sent    │                              │
    │                                │                              │
    │  5. Click Verification Link    │                              │
    │────────────────────────────────────────────────────────────►│
    │                                │                              │
    │◄──────────────────────────────────────────────────────────────│
    │  6. Email Verified             │                              │
    │                                │                              │
    │  7. Complete Health Profile    │                              │
    │  (Optional but encouraged)     │                              │
    │  - Blood Group                 │                              │
    │  - Allergies                   │                              │
    │  - Medical History             │                              │
    │────────────────────────────────────────────────────────────►│
    │                                │                              │
    │  8. Book First Appointment     │                              │
    │────────────────────────────────►                              │
```

### Flow 4: Authentication & Role Detection

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LOGIN & ROLE DETECTION FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

User                             Frontend                         Backend
    │                                │                              │
    │  1. Visit athaarva.com/auth    │                              │
    │────────────────────────────────►                              │
    │                                │                              │
    │  2. Select Hospital            │                              │
    │────────────────────────────────►                              │
    │                                │                              │
    │◄────────────────────────────────                              │
    │  3. Redirect to                │                              │
    │     hospital.athaarva.com/auth │                              │
    │                                │                              │
    │  4. Enter Email & Password     │                              │
    │────────────────────────────────►                              │
    │                                │                              │
    │                                │  5. POST /auth/login         │
    │                                │────────────────────────────►│
    │                                │                              │
    │                                │  6. Validate Credentials     │
    │                                │     Determine Role           │
    │                                │     Generate JWT             │
    │                                │                              │
    │                                │◄──────────────────────────────│
    │                                │  7. Return Token + User Info │
    │                                │     {                        │
    │                                │       token: "...",          │
    │                                │       user: {                │
    │                                │         role: "doctor",      │
    │                                │         tenant_id: "..."     │
    │                                │       }                      │
    │                                │     }                        │
    │                                │                              │
    │◄────────────────────────────────                              │
    │  8. Redirect Based on Role:    │                              │
    │     - hospital_admin → /admin  │                              │
    │     - doctor → /doctor         │                              │
    │     - staff → /staff           │                              │
    │     - patient → /patient       │                              │
```

---

## 📁 Frontend Structure

```
app/
├── (main-domain)/              # athaarva.com routes
│   ├── page.tsx                # Landing page
│   ├── auth/
│   │   └── page.tsx            # Hospital selector
│   ├── super-admin/
│   │   ├── page.tsx            # Super admin dashboard
│   │   ├── tenants/
│   │   └── invitations/
│   └── onboarding/
│       └── hospital/
│           └── page.tsx        # Hospital onboarding form
│
├── hospital/[subdomain]/       # Hospital subdomain routes (dev)
│   ├── page.tsx                # Hospital landing page
│   ├── auth/
│   │   ├── page.tsx            # Login
│   │   └── register/
│   │       └── page.tsx        # Patient registration
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Dashboard
│   │   ├── team/
│   │   ├── doctors/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── billing/
│   │   └── settings/
│   ├── doctor/
│   │   ├── layout.tsx          # Doctor layout
│   │   ├── page.tsx            # Dashboard
│   │   ├── calendar/
│   │   ├── patients/
│   │   └── consultations/
│   ├── staff/
│   │   ├── layout.tsx          # Staff layout
│   │   └── page.tsx            # Dashboard
│   └── patient/
│       ├── layout.tsx          # Patient layout
│       ├── page.tsx            # Dashboard
│       ├── appointments/
│       └── records/
│
├── ecommerce/                  # Medical equipment store
│
└── onboarding/                 # Onboarding flows
    ├── staff/
    │   └── page.tsx
    └── doctor/
        └── page.tsx
```

---

## ⚙️ Backend Structure

```
app/
├── main.py                     # FastAPI app entry
├── db.py                       # Database connection
│
├── core/
│   ├── config.py               # Environment config
│   ├── dependencies.py         # Dependency injection
│   └── security.py             # JWT, password hashing
│
├── models/                     # Pydantic schemas
│   ├── auth.py
│   ├── tenant.py
│   ├── team/
│   ├── doctor.py
│   ├── patient.py
│   └── appointments.py
│
├── routes/                     # API endpoints
│   ├── auth.py                 # /auth/*
│   ├── tenant.py               # /tenants/*
│   ├── team.py                 # /team/*
│   ├── doctor.py               # /doctors/*
│   ├── patient.py              # /patients/*
│   └── appointments.py         # /appointments/*
│
├── services/                   # Business logic
│   ├── auth_service.py
│   ├── tenant_service.py
│   ├── team_service.py
│   ├── invitation_service.py
│   └── email_service.py
│
├── repositories/               # Data access
│   ├── user_repository.py
│   ├── tenant_repository.py
│   └── appointment_repository.py
│
└── utils/
    ├── email.py                # SMTP email sending
    └── storage.py              # File storage
```

---

## 🗄️ Database Schema Overview

### Core Schemas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMAS                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  tenant_mgmt                    iam                                      │
│  ├── tenants                    ├── users                                │
│  ├── tenant_domains             ├── roles                                │
│  ├── plan_catalog               ├── permissions                          │
│  ├── template_catalog           ├── user_roles                           │
│  └── onboarding_sessions        └── invitations                          │
│                                                                          │
│  hospital                       patient                                  │
│  ├── doctor_profiles            ├── patient_accounts                     │
│  ├── staff_profiles             ├── patient_profiles                     │
│  ├── departments                ├── insurance_info                       │
│  ├── services                   └── health_profiles                      │
│  └── locations                                                           │
│                                                                          │
│  clinical                       billing                                  │
│  ├── appointments               ├── invoices                             │
│  ├── consultations              ├── payments                             │
│  ├── prescriptions              └── claims                               │
│  └── medical_records                                                     │
│                                                                          │
│  ops                            file_storage                             │
│  ├── audit_logs                 ├── blob_assets                          │
│  ├── notifications              └── upload_sessions                      │
│  └── tasks                                                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Tables (UUID-based)

| Table | Primary Key | Tenant-Scoped |
|-------|-------------|---------------|
| `tenants` | `id` (UUID) | No |
| `users` | `id` (UUID) | Yes |
| `doctor_profiles` | `id` (UUID) | Yes |
| `patient_profiles` | `id` (UUID) | Yes |
| `appointments` | `id` (UUID) | Yes |
| `invitations` | `id` (UUID) | Yes |

---

## 📊 Implementation Status

### L1 Stage - Core Platform

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| **Platform Landing Page** | ✅ | N/A | Done |
| **Hospital Selector (Auth)** | ✅ | ✅ | Done |
| **Super Admin Dashboard** | 🔄 | 🔄 | Partial |
| **Hospital Onboarding** | ✅ | ✅ | Done |
| **Hospital Landing Page** | ❌ | N/A | Not Started |
| **Hospital Login** | ✅ | ✅ | Done |
| **Patient Registration** | 🔄 | 🔄 | Partial |
| **Admin Dashboard** | ✅ | ✅ | Done |
| **Admin Team Management** | ✅ | ✅ | Done |
| **Admin Appointments** | ✅ | 🔄 | Partial |
| **Admin Patients** | ✅ | 🔄 | Partial |
| **Admin Billing** | ✅ | ❌ | Frontend Only |
| **Admin Settings** | ✅ | ❌ | Frontend Only |
| **Doctor Dashboard** | 🔄 | 🔄 | Partial |
| **Doctor Calendar** | 🔄 | 🔄 | Partial |
| **Staff Dashboard** | ❌ | ❌ | Not Started |
| **Patient Portal** | 🔄 | 🔄 | Partial |
| **E-Commerce Store** | ✅ | ✅ | Done (Shopify) |

**Legend:** ✅ Done | 🔄 Partial | ❌ Not Started

---

## 📚 Documentation Index

### L1 Stage Documentation (Current)

| Document | Description |
|----------|-------------|
| `L1_STAGE/01_PLATFORM_OVERVIEW.md` | Main platform & landing page specs |
| `L1_STAGE/02_AUTHENTICATION.md` | Auth flows, JWT, role detection |
| `L1_STAGE/03_HOSPITAL_ONBOARDING.md` | 12-step onboarding process |
| `L1_STAGE/04_HOSPITAL_PUBLIC_SITE.md` | Hospital landing page & branding |
| `L1_STAGE/05_ADMIN_DASHBOARD.md` | Hospital admin features |
| `L1_STAGE/06_DOCTOR_WORKSPACE.md` | Doctor dashboard & clinical tools |
| `L1_STAGE/07_STAFF_WORKSPACE.md` | Staff roles & features |
| `L1_STAGE/08_PATIENT_PORTAL.md` | Patient-facing features |
| `L1_STAGE/09_BACKEND_API.md` | API endpoints specification |
| `L1_STAGE/10_DATABASE_SCHEMA.md` | Database design |
| `L1_STAGE/11_IMPLEMENTATION_STATUS.md` | What's built vs pending |

### L2 Stage Documentation (Future)

| Document | Description |
|----------|-------------|
| `L2_STAGE/01_AI_FEATURES.md` | AI-powered features |
| `L2_STAGE/02_TELEHEALTH.md` | Video consultations |
| `L2_STAGE/03_ANALYTICS.md` | Advanced analytics & reporting |
| `L2_STAGE/04_MOBILE_APP.md` | Mobile application |
| `L2_STAGE/05_INTEGRATIONS.md` | Third-party integrations |

---

## 🚀 Quick Start for Development

### Running Locally

```bash
# Frontend (Next.js)
cd Athaarva_Frontend
npm install
npm run dev
# → http://localhost:3000

# Backend (FastAPI)
cd Athaarva_Backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
```

### Testing Hospital Subdomain Locally

Since subdomains don't work locally, use path-based routing:
- Hospital Landing: `http://localhost:3000/hospital/cityhospital`
- Hospital Auth: `http://localhost:3000/hospital/cityhospital/auth`
- Admin Dashboard: `http://localhost:3000/hospital/cityhospital/admin`

### Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/athaarva
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 📞 Contact & Support

- **Repository**: github.com/athaarvatech/Athaarva_Frontend
- **Branch**: Feature-Mannan
- **Documentation Location**: `/docs/Final_Plan/`

---

> **Next Steps**: Review the L1 Stage documentation files for detailed specifications of each feature area.
