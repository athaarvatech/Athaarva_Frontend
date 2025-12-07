# 01. Platform Overview - Main Domain (athaarva.com)

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** Partial

---

## 🎯 Purpose

The main domain `athaarva.com` serves as the central hub for:
1. Marketing landing page showcasing platform services
2. Global authentication selector (hospital picker)
3. Super admin management dashboard
4. Hospital onboarding flow

---

## 📄 Pages Specification

### 1. Landing Page (`athaarva.com/`)

**Route:** `app/page.tsx`  
**Status:** ✅ Implemented

#### Content Sections

| Section | Description | Priority |
|---------|-------------|----------|
| Hero | Main value proposition, CTA buttons | HIGH |
| Features | Platform feature highlights | HIGH |
| Services | List of services (HMS, E-Commerce, Telehealth) | HIGH |
| Testimonials | Customer success stories | MEDIUM |
| Pricing | Plan comparison | MEDIUM |
| FAQ | Common questions | LOW |
| Footer | Links, contact, social | HIGH |

#### Hero Section Content
```
Headline: "Transform Healthcare Management"
Subheadline: "Complete hospital management platform with branded 
              websites, patient portals, and seamless operations"

CTA Buttons:
- "Get Started" → /onboarding/hospital (requires invite)
- "Login" → /auth (hospital selector)
- "Learn More" → scroll to features
```

#### Features to Highlight
1. **Multi-Tenant Architecture** - Each hospital gets own subdomain
2. **White-Label Branding** - Full customization
3. **Patient Portal** - Self-service booking
4. **Doctor Dashboard** - Clinical workflows
5. **E-Commerce** - Medical equipment store
6. **Analytics** - Reports & insights

---

### 2. Global Auth Selector (`athaarva.com/auth`)

**Route:** `app/auth/page.tsx`  
**Status:** ✅ Implemented (as `/auth/selector`)

#### Purpose
Allow users to find and select their hospital before being redirected to hospital-specific login.

#### UI Components

```
┌─────────────────────────────────────────────────┐
│                  ATHAARVA                        │
│            Find Your Hospital                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ 🔍 Search hospitals...                    │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  Popular Hospitals:                             │
│  ┌───────────────────────────────────────────┐  │
│  │ 🏥 City General Hospital                  │  │
│  │    cityhospital.athaarva.com              │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ 🏥 Prashanth Hospital                     │  │
│  │    prashanthospital.athaarva.com          │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ─────────────────────────────────────────────  │
│                                                  │
│  Don't see your hospital?                        │
│  [Contact Support]                               │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### Functionality
1. **Search** - Fuzzy search by hospital name, subdomain, location
2. **Recent** - Show recently accessed hospitals (localStorage)
3. **Popular** - Display most active hospitals
4. **Selection** - On click, redirect to `[subdomain].athaarva.com/auth`

#### API Requirements
```typescript
// GET /api/v1/tenants/public
// Returns list of active hospitals for selector

interface PublicTenant {
  id: string;
  name: string;
  subdomain: string;
  logo_url: string | null;
  location: string | null;
  status: 'active';
}
```

---

### 3. Super Admin Dashboard (`athaarva.com/super-admin`)

**Route:** `app/super-admin/`  
**Status:** 🔄 Partial

#### Access Control
- **Authentication**: Super admin credentials only
- **Protection**: Server-side auth check
- **Session**: JWT with `role: 'super_admin'`

#### Dashboard Sections

| Section | Route | Description |
|---------|-------|-------------|
| Overview | `/super-admin` | KPIs, stats, alerts |
| Tenants | `/super-admin/tenants` | Hospital management |
| Database | `/super-admin/database` | Visual database GUI |
| Invitations | `/super-admin/invitations` | Send onboarding invites |
| Website | `/super-admin/website` | Main website content management |
| Social Media | `/super-admin/social` | Social media posting & management |
| Plans | `/super-admin/plans` | Pricing plans |
| Users | `/super-admin/users` | Platform users overview |
| Settings | `/super-admin/settings` | Platform config |

#### Overview Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  SUPER ADMIN DASHBOARD                          [Admin Name ▼]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐│
│  │   TENANTS    │ │    USERS     │ │ APPOINTMENTS │ │  REVENUE ││
│  │     45       │ │   12,543     │ │   8,234      │ │  ₹45.2L  ││
│  │   Active     │ │   Total      │ │   This Month │ │  MRR     ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘│
│                                                                  │
│  Recent Activity                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ • New tenant onboarding: City Hospital        2 hours ago  │ │
│  │ • Plan upgrade: Prashanth Hospital           5 hours ago  │ │
│  │ • Tenant suspended: Demo Clinic              1 day ago    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Pending Actions                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 3 pending onboarding reviews                    [Review →] │ │
│  │ 2 support tickets awaiting response             [View →]   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Tenant Management (`/super-admin/tenants`)

| Feature | Description |
|---------|-------------|
| List View | All tenants with filters (status, plan, date) |
| Detail View | Individual tenant details, usage, billing |
| Actions | Activate, Suspend, Delete tenant |
| Search | By name, subdomain, admin email |

#### Invitations (`/super-admin/invitations`)

| Feature | Description |
|---------|-------------|
| Send Invite | Email, plan selection, template preference |
| Pending List | Invitations awaiting completion |
| Resend | Resend expired invitations |
| Cancel | Revoke pending invitations |

---

### 🆕 Database GUI (`/super-admin/database`)

**Purpose**: Visual interface to view, edit, and manage all hospital databases

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Database Management                                    [Select Schema ▼]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Schema: hospital_citygeneral                                           │
│                                                                          │
│  Tables:                                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [users]  [doctors]  [patients]  [appointments]  [bills]  [...]   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Table: patients (12,543 rows)                          [+ Add Row]     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  id    │ name          │ email           │ phone      │ Actions   │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  uuid  │ Rajesh Kumar  │ r@email.com     │ 9876543210 │ ✏️ 🗑️    │ │
│  │  uuid  │ Priya Sharma  │ p@email.com     │ 9123456789 │ ✏️ 🗑️    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Export CSV]  [Run SQL Query]  [Backup Schema]                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Capabilities

| Feature | Description |
|---------|-------------|
| Schema Browser | View all hospital schemas |
| Table Explorer | Browse all tables in a schema |
| Data Grid | View/edit records in tabular format |
| CRUD Operations | Add, Edit, Delete records |
| SQL Console | Run custom SQL queries |
| Export/Import | CSV/JSON export and import |
| Backup/Restore | Schema-level backup |
| Audit Log | Track all database modifications |

#### Security
- All actions logged with super admin ID
- Confirmation required for destructive operations
- Soft delete preferred over hard delete
- Cannot modify audit logs

---

### 🆕 Website Management (`/super-admin/website`)

**Purpose**: Manage the main athaarva.com website content

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Website Content Management                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Home Page]  [Features]  [Pricing]  [About]  [Contact]  [Footer]       │
│                                                                          │
│  HOME PAGE                                                               │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Hero Section                                              [Edit] │ │
│  │  ├── Headline: "Transform Healthcare Management"                  │ │
│  │  ├── Subheadline: "Complete hospital management platform..."      │ │
│  │  ├── CTA Button 1: "Get Started" → /onboarding                    │ │
│  │  └── CTA Button 2: "Login" → /auth                                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Features Section                                          [Edit] │ │
│  │  ├── Feature 1: Multi-Tenant Architecture                         │ │
│  │  ├── Feature 2: White-Label Branding                              │ │
│  │  └── [+ Add Feature]                                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Testimonials                                              [Edit] │ │
│  │  ├── Testimonial 1: "Amazing platform..." - Dr. Sharma            │ │
│  │  └── [+ Add Testimonial]                                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Preview Changes]  [Publish]                                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Editable Sections

| Section | Content |
|---------|---------|
| Hero | Headlines, CTAs, background image |
| Features | Feature cards with icons |
| Services | Service descriptions |
| Testimonials | Customer quotes |
| Pricing | Plan cards, pricing tables |
| FAQ | Question/answer pairs |
| Footer | Links, contact info, social links |
| SEO | Meta titles, descriptions, OG images |

---

### 🆕 Social Media Management (`/super-admin/social`)

**Purpose**: Create and publish content to all social platforms + website

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Social Media Hub                                        [+ New Post]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Connected Accounts:                                                     │
│  [✓ Instagram]  [✓ LinkedIn]  [✓ Twitter/X]  [✓ Facebook]              │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  CREATE POST                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Post Content:                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ 🚀 We're Hiring! Join our team as a Senior Developer...     │  │ │
│  │  │                                                              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Media: [📷 Add Image] [🎥 Add Video]                             │ │
│  │                                                                    │ │
│  │  Publish To:                                                       │ │
│  │  ☑️ Instagram  ☑️ LinkedIn  ☑️ Twitter  ☑️ Facebook               │ │
│  │  ☑️ Website Social Page                                           │ │
│  │                                                                    │ │
│  │  Schedule: [Now ▼] or [Pick Date/Time]                            │ │
│  │                                                                    │ │
│  │                              [Preview]  [Schedule]  [Post Now]    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  RECENT POSTS                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  "We're Hiring!" - Dec 4, 2025                                    │ │
│  │  📸 IG: 234 likes  🔗 LI: 56 reactions  🐦 X: 89 views           │ │
│  │  Website: Featured on /social page                                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Social Media Page on Website (`athaarva.com/social`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ATHAARVA - Social Feed                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Latest Updates                                    [Instagram] [All ▼]  │
│                                                                          │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐  │
│  │  🚀 We're Hiring!  │ │  📰 New Feature    │ │  🎉 Customer Win   │  │
│  │  [Image]           │ │  [Image]           │ │  [Image]           │  │
│  │                    │ │                    │ │                    │  │
│  │  Join our team...  │ │  Introducing AI... │ │  Congrats to...    │  │
│  │                    │ │                    │ │                    │  │
│  │  Dec 4, 2025       │ │  Dec 1, 2025       │ │  Nov 28, 2025      │  │
│  │  [View on IG]      │ │  [View on LI]      │ │  [View on X]       │  │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘  │
│                                                                          │
│  [Load More]                                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Workflow Automation (Future)

```
Automated Posting Flow:
1. Super Admin creates post in dashboard
2. Post saved to database
3. Webhook triggers to:
   - Instagram Graph API
   - LinkedIn API
   - Twitter/X API
   - Facebook API
4. Post appears on athaarva.com/social
5. Analytics collected from all platforms
```

---

### 🆕 Impersonation Sessions (`/super-admin/impersonate`)

**Purpose**: Allow super admins to login as any user for support/debugging

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  User Impersonation                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ⚠️ WARNING: All actions during impersonation are logged               │
│                                                                          │
│  Search User:                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 🔍 Search by email, name, or user ID...                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Or Select Hospital:                                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  City General Hospital                                     [▼]   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Users in Hospital:                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Dr. Rajesh Kumar     │ Doctor      │ [Impersonate]              │ │
│  │  Priya Sharma         │ Admin       │ [Impersonate]              │ │
│  │  Reception Staff      │ Front Desk  │ [Impersonate]              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Reason for Impersonation: (Required)                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Customer support ticket #12345 - User cannot access schedule      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                            [Cancel]  [Start Session]    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Security & Audit
- **Reason Required**: Must provide reason before impersonation
- **Full Audit Trail**: Logs user, tenant, timestamps, IP, reason
- **Visual Indicator**: Banner shown during impersonation "You are viewing as [User]"
- **Session Timeout**: Auto-expire after 30 minutes
- **Quick Exit**: One-click return to super admin view
- **Action Logging**: Every action during impersonation tagged in audit log

---

### 🆕 Plan & Pricing Control (`/super-admin/plans`)

**Purpose**: Manage subscription plans, pricing, and promotional offers

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Plan & Pricing Management                                [+ New Plan]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ACTIVE PLANS                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Plan         │ Price    │ Billing │ Tenants │ ARR     │ Actions │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Starter      │ ₹5,000   │ Monthly │ 15      │ ₹9L     │ ✏️ 📋   │ │
│  │  Professional │ ₹15,000  │ Monthly │ 28      │ ₹50.4L  │ ✏️ 📋   │ │
│  │  Enterprise   │ Custom   │ Annual  │ 5       │ ₹25L    │ ✏️ 📋   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  PLAN EDITOR                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Plan Name: [Professional]                                        │ │
│  │  Base Price: [₹15,000]  Billing: [Monthly ▼]                     │ │
│  │                                                                    │ │
│  │  Features:                                                         │ │
│  │  ☑️ Unlimited staff  ☑️ Telehealth  ☑️ AI Assistant              │ │
│  │  ☑️ Custom branding  ☑️ Analytics   ☐ Multi-location             │ │
│  │                                                                    │ │
│  │  Limits:                                                           │ │
│  │  Max Doctors: [25]  Max Patients: [Unlimited]  Storage: [50GB]   │ │
│  │                                                                    │ │
│  │  Add-Ons:                                                          │ │
│  │  [+ E-commerce Module] [+ Extra Storage] [+ Premium Support]      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  PROMOTIONS & DISCOUNTS                                   [+ New Promo] │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Code          │ Type    │ Value │ Valid Until  │ Uses │ Status  │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  LAUNCH50      │ %       │ 50%   │ Dec 31, 2025 │ 23   │ Active  │ │
│  │  WELCOME25     │ %       │ 25%   │ Jan 31, 2026 │ 0    │ Active  │ │
│  │  CUSTOM-CITY   │ Fixed   │ ₹2000 │ Never        │ 1    │ Active  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Plan Management Capabilities

| Feature | Description |
|---------|-------------|
| Create Plan | Name, price, billing cycle, features |
| Duplicate Plan | Copy existing plan as template |
| Retire Plan | Soft-delete, existing tenants grandfathered |
| Schedule Changes | Plan updates effective from future date |
| Version History | Track all plan changes |
| Feature Bundles | Group features into add-ons |

#### Promotional Codes

| Feature | Description |
|---------|-------------|
| Percentage Discount | 10%, 25%, 50% off |
| Fixed Discount | ₹X off total |
| Free Trial Extension | Extra trial days |
| Custom Enterprise | Special pricing per tenant |
| Usage Limits | Max redemptions, valid dates |

---

### 🆕 Template & Content Governance (`/super-admin/templates`)

**Purpose**: Manage hospital website templates available for tenants

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Template Catalog                                       [+ New Template]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  AVAILABLE TEMPLATES                                                     │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐  │
│  │  Modern Medical    │ │  Classic Care      │ │  Premium Health    │  │
│  │  [Preview Image]   │ │  [Preview Image]   │ │  [Preview Image]   │  │
│  │                    │ │                    │ │                    │  │
│  │  Used by: 25       │ │  Used by: 18       │ │  Used by: 8        │  │
│  │  Version: 2.1.0    │ │  Version: 1.5.0    │ │  Version: 3.0.0    │  │
│  │  [Edit] [Preview]  │ │  [Edit] [Preview]  │ │  [Edit] [Preview]  │  │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘  │
│                                                                          │
│  TEMPLATE EDITOR                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Template: Modern Medical v2.1.0                                   │ │
│  │                                                                    │ │
│  │  Components:                                                        │ │
│  │  ├── Header (navbar, logo placement, menu style)                   │ │
│  │  ├── Hero (layout options, animation style)                        │ │
│  │  ├── Services (grid vs carousel, card style)                       │ │
│  │  ├── Doctors (profile cards, layout)                               │ │
│  │  ├── Testimonials (slider, static)                                 │ │
│  │  ├── Contact (form fields, map integration)                        │ │
│  │  └── Footer (columns, social links)                                │ │
│  │                                                                    │ │
│  │  Localization:                                                      │ │
│  │  [English] [Hindi] [Tamil] [+ Add Language]                        │ │
│  │                                                                    │ │
│  │  Compliance:                                                        │ │
│  │  ☑️ WCAG AA Accessibility  ☑️ GDPR Cookie Banner                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Save Draft]  [Publish New Version]  [Rollback to Previous]            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Template Features

| Feature | Description |
|---------|-------------|
| Version Control | Track all template releases |
| Component Library | Reusable UI components |
| Localization | Multi-language support |
| Compliance | Accessibility, privacy built-in |
| Preview Mode | Test templates with sample data |
| Rollback | Revert to previous versions |

---

### 🆕 Global User Oversight (`/super-admin/users`)

**Purpose**: Cross-tenant user management and security monitoring

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Global User Directory                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [All Tenants ▼]  [All Roles ▼]  [Status: All ▼]  🔍 Search...         │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  User           │ Hospital        │ Role     │ Last Login │ Status│ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Dr. Rajesh K.  │ City General    │ Doctor   │ 2h ago     │ Active│ │
│  │  Priya S.       │ Prashanth       │ Admin    │ 1d ago     │ Active│ │
│  │  Patient User   │ City General    │ Patient  │ Never      │ Pend. │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  SECURITY ALERTS                                           [View All]   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ ⚠️ 3 failed MFA attempts - user@email.com (City General)         │ │
│  │ ⚠️ Suspicious login from new IP - admin@prashanth.com            │ │
│  │ ⚠️ Expired credentials - dr.sharma (needs password reset)        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  QUICK ACTIONS                                                           │
│  [Force Password Reset]  [Revoke Sessions]  [Quarantine Account]        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Capabilities

| Feature | Description |
|---------|-------------|
| Cross-Tenant View | See all users across all hospitals |
| Role Filter | Filter by doctor, admin, staff, patient |
| Security Alerts | Failed logins, suspicious activity |
| Bulk Actions | Force resets, session revocation |
| Credential Management | Reset passwords, MFA bypass (emergency) |
| Quarantine | Disable account pending investigation |

---

### 🆕 Background Job Monitoring (`/super-admin/jobs`)

**Purpose**: Monitor and manage background processing queues

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Background Jobs                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  QUEUE STATUS                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   EMAILS     │ │    SMS       │ │   REPORTS    │ │   BACKUPS    │   │
│  │   Pending: 5 │ │   Pending: 0 │ │   Running: 2 │ │   Pending: 0 │   │
│  │   Rate: 50/m │ │   Rate: 20/m │ │   Rate: 1/hr │ │   Next: 2AM  │   │
│  │   ✅ Healthy │ │   ✅ Healthy │ │   ⚠️ Slow    │ │   ✅ Healthy │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                          │
│  RECENT JOBS                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Job ID       │ Type        │ Tenant        │ Status   │ Time     │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  job_abc123   │ Email       │ City General  │ ✅ Done  │ 2s       │ │
│  │  job_def456   │ Report      │ Platform      │ 🔄 Run   │ 45s      │ │
│  │  job_ghi789   │ Email       │ Prashanth     │ ❌ Fail  │ --       │ │
│  │               │             │               │ [Retry]  │          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ACTIONS                                                                 │
│  [Pause Emails]  [Clear Failed]  [Trigger Backup Now]                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Job Types

| Queue | Purpose | SLA |
|-------|---------|-----|
| Emails | Transactional emails | < 5 min |
| SMS | OTP, notifications | < 1 min |
| Reports | Analytics generation | < 1 hour |
| Backups | Database backups | Daily 2AM |
| Sync | External integrations | Near real-time |

---

### 🆕 AI Telemetry Dashboard (`/super-admin/ai`)

**Purpose**: Monitor AI usage, costs, and governance across all tenants

#### Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  AI Usage Analytics                                    [This Month ▼]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PLATFORM-WIDE METRICS                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   REQUESTS   │ │   TOKENS     │ │    COST      │ │  AVG LATENCY │   │
│  │   125,432    │ │   45.2M      │ │   $1,234     │ │   850ms      │   │
│  │   +15% ↑     │ │   +22% ↑     │ │   +18% ↑     │ │   -5% ↓      │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                          │
│  USAGE BY FEATURE                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Clinical Notes AI    ████████████████████  45%                   │ │
│  │  Symptom Checker      ██████████            25%                   │ │
│  │  Document Summary     ██████                15%                   │ │
│  │  Chatbot              ████                  10%                   │ │
│  │  Other                ██                    5%                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  TOP TENANTS BY USAGE                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  City General Hospital     │  25,432 requests  │  $312            │ │
│  │  Prashanth Hospital        │  18,234 requests  │  $245            │ │
│  │  Apollo Clinic             │  12,100 requests  │  $156            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  AI GOVERNANCE                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Model Provider: [OpenAI ▼]  Model: [GPT-4 ▼]                     │ │
│  │  Rate Limits: [1000 req/min]  Max Tokens: [4096]                  │ │
│  │  Guardrails: ☑️ Medical content filter  ☑️ PII redaction         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### AI Telemetry Data

| Field | Description |
|-------|-------------|
| persona_type | doctor, patient, staff, admin |
| initiator_user_id | Who made the request |
| related_entity | Appointment, patient, etc. |
| model | GPT-4, Claude, etc. |
| input_tokens | Request size |
| output_tokens | Response size |
| disposition | accepted, rejected, edited |
| latency_ms | Response time |

---

### 4. Hospital Onboarding (`athaarva.com/onboarding/hospital`)

**Route:** `app/onboarding/hospital/page.tsx`  
**Status:** ✅ Implemented

#### Prerequisites
- Valid invitation token (from super admin invite email)
- Token passed via URL query param: `?token=xxx`

#### 12-Step Form Structure

| Step | Title | Fields |
|------|-------|--------|
| 1 | Organization Info | Legal name, registration number, tax IDs |
| 2 | Location & Contact | Address, phone, email, emergency contacts |
| 3 | Branding | Logo, colors, typography |
| 4 | Website Content | Hero text, about, services description |
| 5 | Services | Departments, specialties, procedures |
| 6 | Leadership | Admin bio, key personnel |
| 7 | Policies | Operating hours, cancellation, telehealth |
| 8 | Compliance | Licenses, certifications, insurance |
| 9 | Integrations | Messaging, analytics preferences |
| 10 | Admin Account | Admin email, password setup |
| 11 | Review | Summary of all entered data |
| 12 | Confirmation | Submit for approval |

#### Data Model
```typescript
interface HospitalOnboardingData {
  // Step 1: Organization
  legal_name: string;
  display_name: string;
  registration_number: string;
  gst_number?: string;
  pan_number?: string;
  established_date?: string;
  
  // Step 2: Location
  primary_address: Address;
  phone_numbers: string[];
  email: string;
  emergency_contact: string;
  
  // Step 3: Branding
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  
  // Step 4: Content
  hero_headline: string;
  hero_subheadline: string;
  about_text: string;
  
  // Step 5: Services
  departments: Department[];
  specialties: string[];
  
  // Step 6-12: Additional fields...
}
```

#### Post-Submission Flow
1. Data saved to `tenant_mgmt.onboarding_sessions`
2. Super admin notified for review
3. Upon approval:
   - Tenant created in `tenant_mgmt.tenants`
   - Subdomain provisioned
   - Admin user created
   - Welcome email sent
4. Admin can login to their dashboard

---

## 🔌 API Endpoints Required

### Public Endpoints (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tenants/public` | List active hospitals for selector |
| GET | `/api/v1/tenants/{subdomain}/validate` | Validate subdomain exists |
| POST | `/api/v1/onboarding/hospital/validate-token` | Validate invite token |
| POST | `/api/v1/onboarding/hospital/submit` | Submit onboarding form |

### Super Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/super-admin/dashboard` | Dashboard stats |
| GET | `/api/v1/super-admin/tenants` | List all tenants |
| GET | `/api/v1/super-admin/tenants/{id}` | Tenant details |
| PATCH | `/api/v1/super-admin/tenants/{id}` | Update tenant |
| POST | `/api/v1/super-admin/tenants/{id}/activate` | Activate tenant |
| POST | `/api/v1/super-admin/tenants/{id}/suspend` | Suspend tenant |
| DELETE | `/api/v1/super-admin/tenants/{id}` | Delete tenant |
| GET | `/api/v1/super-admin/invitations` | List invitations |
| POST | `/api/v1/super-admin/invitations` | Send invitation |
| DELETE | `/api/v1/super-admin/invitations/{id}` | Cancel invitation |

---

## 🎨 Design Guidelines

### Landing Page
- **Style**: Modern, professional, healthcare-focused
- **Colors**: Blue/green medical palette
- **Typography**: Clean, readable
- **Animations**: Subtle, performant (Framer Motion)

### Auth Selector
- **Style**: Clean, focused on search
- **UX**: Fast hospital lookup, keyboard navigable
- **Mobile**: Responsive, touch-friendly

### Super Admin
- **Style**: Dashboard with sidebar navigation
- **Data**: Tables with pagination, filtering
- **Actions**: Confirmation dialogs for destructive actions

---

## 📋 Implementation Checklist

### Landing Page
- [x] Hero section with animations
- [x] Features section
- [x] Services overview
- [ ] Testimonials section
- [ ] Pricing section
- [ ] FAQ section
- [x] Footer

### Auth Selector
- [x] Basic hospital list
- [x] Search functionality
- [ ] Recent hospitals (localStorage)
- [ ] Popular hospitals sorting
- [x] Redirect to subdomain

### Super Admin Dashboard
- [x] Basic layout with sidebar
- [ ] Dashboard overview with stats
- [ ] Tenant management CRUD
- [ ] Invitation management
- [ ] Plan management
- [ ] Settings page

### Hospital Onboarding
- [x] 12-step wizard
- [x] Form validation
- [x] Data persistence
- [x] Token validation
- [x] Submit flow
- [ ] Review/approval workflow

---

## 🔗 Related Documentation

- [02_AUTHENTICATION.md](./02_AUTHENTICATION.md) - Auth flows
- [03_HOSPITAL_ONBOARDING.md](./03_HOSPITAL_ONBOARDING.md) - Detailed onboarding
- [09_BACKEND_API.md](./09_BACKEND_API.md) - API specifications
