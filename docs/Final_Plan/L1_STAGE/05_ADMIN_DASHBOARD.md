# 05. Hospital Admin Dashboard

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** ✅ Mostly Implemented

---

## 🎯 Overview

The hospital admin dashboard provides complete control over hospital operations:
- Team management (invite/manage doctors & staff)
- Patient records
- Appointments overview
- Billing & payments
- Hospital settings & branding
- Reports & analytics

---

## 🔗 URL Structure

| URL | Page | Description |
|-----|------|-------------|
| `/admin` | Dashboard Home | Overview & KPIs |
| `/admin/team` | Team Management | All staff list |
| `/admin/team/invite` | Invite Members | Send invitations |
| `/admin/team/pending` | Pending Invites | Track invitations |
| `/admin/doctors` | Doctors | Doctor management |
| `/admin/patients` | Patients | Patient records |
| `/admin/appointments` | Appointments | All appointments |
| `/admin/billing` | Billing | Invoices & payments |
| `/admin/hr` | HR Management | Hiring, firing, campaigns |
| `/admin/hr/campaigns` | Hiring Campaigns | Job postings |
| `/admin/hr/employees` | Employee Records | All employment docs |
| `/admin/documents` | Document Templates | Branded templates |
| `/admin/branding` | Branding | Colors, logo, theme |
| `/admin/settings` | Settings | Hospital configuration |
| `/admin/reports` | Reports | Analytics & reports |

---

## 📐 Layout Structure

### Sidebar Navigation

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ┌────────────┐  ┌───────────────────────────────────────────────────┐   │
│  │            │  │  Header                          [🔔] [Admin ▼]   │   │
│  │  SIDEBAR   │  ├───────────────────────────────────────────────────┤   │
│  │            │  │                                                    │   │
│  │  [Logo]    │  │                                                    │   │
│  │  Hospital  │  │                                                    │   │
│  │  Name      │  │                    MAIN CONTENT                    │   │
│  │            │  │                                                    │   │
│  │  ─────────  │  │                                                    │   │
│  │            │  │                                                    │   │
│  │  Dashboard │  │                                                    │   │
│  │  Team      │  │                                                    │   │
│  │  Doctors   │  │                                                    │   │
│  │  Patients  │  │                                                    │   │
│  │  Appts     │  │                                                    │   │
│  │  Billing   │  │                                                    │   │
│  │  Reports   │  │                                                    │   │
│  │            │  │                                                    │   │
│  │  ─────────  │  │                                                    │   │
│  │            │  │                                                    │   │
│  │  Settings  │  │                                                    │   │
│  │  Logout    │  │                                                    │   │
│  │            │  │                                                    │   │
│  └────────────┘  └───────────────────────────────────────────────────┘   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Navigation Items

```typescript
const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Team Management',
    href: '/admin/team',
    icon: 'Users',
    children: [
      { title: 'All Members', href: '/admin/team' },
      { title: 'Invite', href: '/admin/team/invite' },
      { title: 'Pending', href: '/admin/team/pending' },
    ],
  },
  {
    title: 'Doctors',
    href: '/admin/doctors',
    icon: 'Stethoscope',
  },
  {
    title: 'Patients',
    href: '/admin/patients',
    icon: 'UserHeart',
  },
  {
    title: 'Appointments',
    href: '/admin/appointments',
    icon: 'Calendar',
  },
  {
    title: 'Billing',
    href: '/admin/billing',
    icon: 'CreditCard',
  },
  {
    title: 'HR Management',
    href: '/admin/hr',
    icon: 'Briefcase',
    children: [
      { title: 'Overview', href: '/admin/hr' },
      { title: 'Hiring Campaigns', href: '/admin/hr/campaigns' },
      { title: 'Employee Records', href: '/admin/hr/employees' },
    ],
  },
  {
    title: 'Documents',
    href: '/admin/documents',
    icon: 'FileText',
  },
  {
    title: 'Branding',
    href: '/admin/branding',
    icon: 'Palette',
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: 'BarChart',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: 'Settings',
  },
];
```

---

## 📄 Page Specifications

### 1. Dashboard Home (`/admin`)

**Status:** ✅ Implemented

#### KPI Cards

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│  Total Staff   │ │ Today's Appts  │ │ Active Patients│ │ Monthly Revenue│
│     45         │ │     128        │ │    12,543      │ │   ₹15.2L      │
│  ↑ 3 this week │ │ ↓ 5% vs avg    │ │ ↑ 12% growth   │ │ ↑ 8% vs last  │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

#### Quick Actions
- Invite Team Member
- View Today's Schedule
- Generate Report
- Update Settings

#### Recent Activity Feed
- New appointments
- Patient registrations
- Staff updates
- System notifications

---

### 2. Team Management (`/admin/team`)

**Status:** ✅ Implemented

#### Team List View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Team Management                                  [+ Invite Member]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Filters: [All Roles ▼] [All Status ▼] [Department ▼]  🔍 Search...    │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [Select] │ Name         │ Role    │ Department │ Status │ Actions││
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │    ☐     │ Dr. Sharma    │ Doctor  │ Cardiology │ Active │  ⋮    ││
│  │    ☐     │ Nurse Priya   │ Nurse   │ General    │ Active │  ⋮    ││
│  │    ☐     │ Raj Kumar     │ Recept. │ Front Desk │ Active │  ⋮    ││
│  │    ☐     │ Dr. Patel     │ Doctor  │ Pediatrics │Suspended│  ⋮    ││
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Showing 1-10 of 45 members                      [← Prev] [1] [2] [→]  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Actions Menu (⋮)
- View Profile
- Edit Details
- Suspend Account
- Activate Account
- Remove from Team

---

### 3. Invite Members (`/admin/team/invite`)

**Status:** ✅ Implemented

#### Single Invite Form

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Invite Team Member                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Single Invite]  [Bulk Invite]                                         │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Email Address *                                                   │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │ doctor@example.com                                        │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  Full Name *                                                       │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │ Dr. New Doctor                                            │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  Role *                                                            │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │ Doctor                                               [▼]  │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  Department                                                        │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │ Cardiology                                           [▼]  │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  Personal Message (optional)                                       │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │ Welcome to our team! We're excited to have you...         │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │                                     [Cancel]  [Send Invitation]   │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Role Options
- Doctor
- Nurse
- Receptionist
- Billing Staff
- Lab Technician
- Pharmacist

---

### 4. Pending Invitations (`/admin/team/pending`)

**Status:** ✅ Implemented

#### Pending List

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Pending Invitations                                   [+ New Invite]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Email             │ Role    │ Sent       │ Expires   │ Actions   ││
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  dr.new@email.com  │ Doctor  │ 2 days ago │ In 5 days │ Resend ✕  ││
│  │  nurse@email.com   │ Nurse   │ 1 week ago │ Expired   │ Resend ✕  ││
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Doctor Management (`/admin/doctors`)

**Status:** 🔄 Partial

#### Doctor-Specific Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Doctor Management                                    [+ Invite Doctor] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Dr. Anil Sharma                                   │  │ │
│  │  │           Cardiologist                                      │  │ │
│  │  │           Status: Active  •  Verified ✓                     │  │ │
│  │  │                                                              │  │ │
│  │  │  Stats:                                                      │  │ │
│  │  │  • 45 appointments this month                                │  │ │
│  │  │  • 4.8 rating (124 reviews)                                  │  │ │
│  │  │  • ₹36,000 revenue this month                                │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Schedule]  [View Patients]  [Edit Profile]  [⋮]      │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Doctor Actions
- View full profile
- Manage schedule
- View credentials
- Verify credentials
- Manage availability
- View performance stats

---

### 6. Patient Management (`/admin/patients`)

**Status:** ✅ Implemented

#### Patient List

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Patient Records                                     [Export] [Filter]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔍 Search patients...                                                  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ID      │ Name          │ Phone       │ Last Visit │ Actions     ││
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  P-001   │ Rajesh Kumar  │ 98765...    │ Dec 1, 2025│ View ⋮     ││
│  │  P-002   │ Priya Sharma  │ 91234...    │ Nov 28     │ View ⋮     ││
│  │  P-003   │ Amit Patel    │ 97654...    │ Nov 25     │ View ⋮     ││
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Patient Detail Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Patient Details                                               [✕]      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Overview]  [Appointments]  [Medical]  [Billing]                       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                  │    │
│  │  Rajesh Kumar                                                    │    │
│  │  Patient ID: P-001                                               │    │
│  │                                                                  │    │
│  │  📧 rajesh@email.com                                             │    │
│  │  📱 +91 98765 43210                                              │    │
│  │  🎂 March 15, 1985 (39 years)                                    │    │
│  │  🩸 Blood Group: O+                                              │    │
│  │                                                                  │    │
│  │  Registered: Jan 15, 2024                                        │    │
│  │  Total Visits: 12                                                │    │
│  │  Outstanding Balance: ₹0                                         │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 7. Appointments (`/admin/appointments`)

**Status:** ✅ Implemented

#### Views Available
1. **List View** - Table of all appointments
2. **Calendar View** - Calendar grid with appointments
3. **Grid View** - Cards grouped by status

#### Appointment Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Appointments                              [List] [Calendar] [Grid]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Filters: [Today ▼] [All Doctors ▼] [All Status ▼]     🔍 Search...    │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Time    │ Patient       │ Doctor      │ Type     │ Status       ││
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  9:00 AM │ Rajesh Kumar  │ Dr. Sharma  │ In-person│ ● Scheduled  ││
│  │  9:30 AM │ Priya Patel   │ Dr. Sharma  │ Video    │ ● In Progress││
│  │  10:00AM │ Amit Singh    │ Dr. Gupta   │ In-person│ ● Completed  ││
│  │  10:30AM │ Neha Reddy    │ Dr. Sharma  │ In-person│ ● No Show    ││
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 8. Billing (`/admin/billing`)

**Status:** ✅ Implemented

#### Billing Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Billing & Payments                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  This Month    │ │   Pending      │ │   Overdue      │               │
│  │  ₹15.2L        │ │   ₹2.4L        │ │   ₹45,000      │               │
│  │  Revenue       │ │   To Collect   │ │   Amount       │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  [Invoices]  [Payments]  [Insurance Claims]                             │
│                                                                          │
│  Recent Invoices                                     [+ Create Invoice] │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Invoice # │ Patient    │ Amount  │ Date      │ Status   │ Action ││
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  INV-001   │ R. Kumar   │ ₹2,500  │ Dec 1     │ Paid     │  👁    ││
│  │  INV-002   │ P. Sharma  │ ₹3,800  │ Dec 1     │ Pending  │  👁    ││
│  │  INV-003   │ A. Patel   │ ₹1,200  │ Nov 30    │ Overdue  │  👁    ││
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 9. Settings (`/admin/settings`)

**Status:** ✅ Implemented

#### Settings Tabs

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Hospital Settings                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [General]  [Branding]  [Notifications]  [Security]                     │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  General Settings                                                  │ │
│  │                                                                    │ │
│  │  Hospital Name                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ City General Hospital                                       │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Contact Email                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ info@cityhospital.com                                       │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Contact Phone                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ +91 44 2345 6789                                            │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Timezone                                                          │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ Asia/Kolkata (IST)                                    [▼]   │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │                                                  [Save Changes]    │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Settings Categories

| Tab | Settings |
|-----|----------|
| General | Name, contact, timezone, language |
| Branding | Logo, colors, fonts |
| Notifications | Email templates, SMS settings |
| Security | Password policy, MFA, session timeout |

---

### 🆕 10. HR Management (`/admin/hr`)

**Status:** ❌ Not Started

#### HR Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HR Management                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Total Staff   │ │ Active Hiring  │ │   Pending      │               │
│  │     45         │ │   Campaigns: 3 │ │   Actions: 5   │               │
│  │   Employees    │ │   12 applicants│ │   Terminations │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  [Employee Records]  [Hiring Campaigns]  [Terminations]                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Hiring Campaigns (`/admin/hr/campaigns`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Hiring Campaigns                                    [+ New Campaign]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Active Campaigns                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Senior Cardiologist                              [Active]  │  │ │
│  │  │  Posted: Dec 1, 2025  •  Expires: Jan 1, 2026               │  │ │
│  │  │  Applications: 8  •  Shortlisted: 3  •  Interviewed: 1      │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Applications]  [Edit]  [Close Campaign]              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Receptionist                                     [Active]  │  │ │
│  │  │  Posted: Nov 28, 2025  •  Expires: Dec 28, 2025             │  │ │
│  │  │  Applications: 24  •  Shortlisted: 5  •  Interviewed: 2     │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Applications]  [Edit]  [Close Campaign]              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Create Hiring Campaign

```
┌─────────────────────────────────────────────────────────────────────────┐
│  New Hiring Campaign                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Job Title *                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Senior Cardiologist                                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Department *                          Role Type *                       │
│  ┌─────────────────────────┐          ┌─────────────────────────┐       │
│  │ Cardiology         [▼]  │          │ Doctor             [▼]  │       │
│  └─────────────────────────┘          └─────────────────────────┘       │
│                                                                          │
│  Job Description *                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ We are looking for an experienced cardiologist...               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Requirements                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • MD in Cardiology                                              │   │
│  │ • 5+ years experience                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Salary Range: ₹ [________] to ₹ [________] per month                   │
│                                                                          │
│  Campaign Duration: [30 days ▼]                                         │
│                                                                          │
│  ☑️ Post to hospital website careers page                               │
│  ☐ Share on hospital social media                                       │
│                                                                          │
│                                    [Save Draft]  [Publish Campaign]     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Employee Management (Hire/Fire)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Employee Records                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Active]  [On Notice]  [Terminated]                    🔍 Search...    │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Name        │ Role      │ Joined     │ Status   │ Actions        │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Dr. Sharma  │ Doctor    │ Jan 2020   │ Active   │ [⋮]            │ │
│  │  Priya K     │ Nurse     │ Mar 2022   │ Active   │ [⋮]            │ │
│  │  Raj Kumar   │ Reception │ Jun 2023   │ On Notice│ [⋮]            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Actions Menu:                                                           │
│  • View Profile                                                          │
│  • View Documents                                                        │
│  • Generate Offer Letter                                                 │
│  • Issue Notice / Warning                                                │
│  • Initiate Termination                                                  │
│  • Generate Experience Letter                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Termination Process

```
Termination Workflow:
1. Admin initiates termination
2. Select reason (resignation, termination, contract end)
3. Set last working date
4. System calculates final settlement
5. Generate relieving letter
6. Deactivate user account on last day
7. Archive employee records
```

---

### 🆕 11. Document Templates (`/admin/documents`)

**Status:** ❌ Not Started

#### Document Template Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Document Templates                                   [+ New Template]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [HR Documents]  [Medical]  [Billing]  [Letters]                        │
│                                                                          │
│  HR DOCUMENTS                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  📄 Offer Letter Template                         [Edit] [Preview]│ │
│  │     Used for: New employee offers                                 │ │
│  │     Variables: {name}, {position}, {salary}, {joining_date}       │ │
│  │                                                                    │ │
│  │  📄 Appointment Letter Template                   [Edit] [Preview]│ │
│  │     Used for: Post-joining confirmation                           │ │
│  │     Variables: {name}, {emp_id}, {department}                     │ │
│  │                                                                    │ │
│  │  📄 Experience/Relieving Letter                   [Edit] [Preview]│ │
│  │     Used for: Employee exits                                      │ │
│  │     Variables: {name}, {duration}, {last_position}                │ │
│  │                                                                    │ │
│  │  📄 Warning Letter Template                       [Edit] [Preview]│ │
│  │     Used for: Disciplinary actions                                │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  MEDICAL DOCUMENTS                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  📄 Prescription Template                         [Edit] [Preview]│ │
│  │  📄 Medical Certificate                           [Edit] [Preview]│ │
│  │  📄 Discharge Summary                             [Edit] [Preview]│ │
│  │  📄 Lab Report Header                             [Edit] [Preview]│ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Template Editor

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Edit Template: Offer Letter                           [Preview] [Save] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │         [Hospital Logo - Auto Applied]                      │  │ │
│  │  │         {hospital_name}                                     │  │ │
│  │  │         {hospital_address}                                  │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Date: {current_date}                                             │ │
│  │                                                                    │ │
│  │  To,                                                               │ │
│  │  {candidate_name}                                                 │ │
│  │  {candidate_address}                                              │ │
│  │                                                                    │ │
│  │  Subject: Offer of Employment - {position}                        │ │
│  │                                                                    │ │
│  │  Dear {candidate_name},                                           │ │
│  │                                                                    │ │
│  │  We are pleased to offer you the position of {position} at        │ │
│  │  {hospital_name}. Your joining date will be {joining_date}.       │ │
│  │                                                                    │ │
│  │  Compensation: ₹{salary} per month                                │ │
│  │                                                                    │ │
│  │  ...                                                               │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │         {hospital_footer} - Auto Applied                    │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Available Variables:                                                    │
│  [hospital_name] [hospital_logo] [hospital_address] [candidate_name]    │
│  [position] [salary] [joining_date] [department] [current_date]         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Template Features

| Feature | Description |
|---------|-------------|
| Hospital Branding | Auto-applies logo, colors, footer from settings |
| Variable Placeholders | Dynamic content insertion |
| Multiple Formats | Generate PDF, DOCX, Print |
| Version Control | Track template changes |
| Preview | See output before generating |
| Digital Signature | Optional e-sign support |

#### Generated Document Types

| Category | Templates |
|----------|-----------|
| HR | Offer Letter, Appointment Letter, Experience Letter, Relieving Letter, Warning Letter, Salary Slip |
| Medical | Prescription, Medical Certificate, Discharge Summary, Referral Letter |
| Billing | Invoice, Receipt, Estimate, Insurance Claim Form |
| Patient | Admission Form, Consent Forms, Patient ID Card |

---

### 🆕 12. Branding Management (`/admin/branding`)

**Status:** ❌ Not Started

#### Branding Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Hospital Branding                                      [Save] [Reset]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Colors]  [Logo & Images]  [Typography]  [Preview]                     │
│                                                                          │
│  COLORS                                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Primary Color          Secondary Color       Accent Color         │ │
│  │  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐      │ │
│  │  │   [🎨]      │       │   [🎨]      │       │   [🎨]      │      │ │
│  │  │  #1E40AF   │       │  #3B82F6   │       │  #10B981   │      │ │
│  │  └─────────────┘       └─────────────┘       └─────────────┘      │ │
│  │                                                                    │ │
│  │  Background            Text Primary          Text Secondary        │ │
│  │  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐      │ │
│  │  │   [🎨]      │       │   [🎨]      │       │   [🎨]      │      │ │
│  │  │  #FFFFFF   │       │  #111827   │       │  #6B7280   │      │ │
│  │  └─────────────┘       └─────────────┘       └─────────────┘      │ │
│  │                                                                    │ │
│  │  [Apply Default Medical Theme]  [Apply Custom Theme]               │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  LOGO & IMAGES                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Primary Logo              Favicon                Dark Logo        │ │
│  │  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐      │ │
│  │  │   [Logo]    │       │   [Icon]    │       │   [Logo]    │      │ │
│  │  │   [Upload]  │       │   [Upload]  │       │   [Upload]  │      │ │
│  │  └─────────────┘       └─────────────┘       └─────────────┘      │ │
│  │                                                                    │ │
│  │  Document Header                       Document Footer             │ │
│  │  ┌──────────────────────────┐         ┌────────────────────────┐  │ │
│  │  │   [Header Preview]       │         │   [Footer Preview]     │  │ │
│  │  │   [Edit Header]          │         │   [Edit Footer]        │  │ │
│  │  └──────────────────────────┘         └────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Branding Application

```
Where Branding is Applied:
├── Hospital Public Website
│   ├── Header/Footer colors
│   ├── Button styles
│   └── Text colors
├── Login Page
│   └── Hospital logo and colors
├── Admin Dashboard
│   └── Sidebar and accent colors
├── Doctor/Staff Dashboards
│   └── Theme colors
├── Patient Portal
│   └── Full theme application
├── All Document Templates
│   ├── Logo in header
│   ├── Colors in design
│   └── Footer with contact
├── Email Templates
│   └── Branded headers/footers
└── PDF Exports
    └── Hospital branding throughout
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Dashboard stats |
| GET | `/api/v1/team/members` | List team members |
| POST | `/api/v1/team/invitations` | Send invitation |
| GET | `/api/v1/admin/doctors` | List doctors |
| GET | `/api/v1/admin/patients` | List patients |
| GET | `/api/v1/admin/appointments` | List appointments |
| GET | `/api/v1/admin/billing/invoices` | List invoices |
| GET | `/api/v1/admin/settings` | Get settings |
| PATCH | `/api/v1/admin/settings` | Update settings |

---

## 📋 Implementation Checklist

### Layout & Navigation
- [x] Admin layout with sidebar
- [x] Header with user menu
- [x] Responsive sidebar
- [x] Navigation highlighting

### Dashboard
- [x] KPI cards
- [x] Quick actions
- [x] Recent activity
- [ ] Charts & graphs

### Team Management
- [x] Team list with filters
- [x] Single invite form
- [x] Bulk invite form
- [x] Pending invitations
- [x] Member actions (suspend/activate)

### Doctors
- [ ] Doctor list with details
- [ ] Schedule management
- [ ] Credential verification
- [ ] Performance stats

### Patients
- [x] Patient list
- [x] Patient detail modal
- [ ] Medical history tab
- [ ] Export functionality

### Appointments
- [x] List view
- [x] Calendar view
- [x] Grid view
- [x] Filters

### Billing
- [x] Overview stats
- [x] Invoice list
- [ ] Create invoice
- [ ] Payment recording

### Settings
- [x] General settings
- [x] Branding settings
- [x] Notification settings
- [x] Security settings

---

### 🆕 13. Site & Brand Studio (`/admin/site`)

**Status:** ❌ Not Started

#### Site Content Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Site & Brand Studio                                   [Preview Site]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Pages]  [Templates]  [Media]  [Settings]                              │
│                                                                          │
│  PAGE MANAGEMENT                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Page         │ Template   │ Status    │ Last Edit  │ Actions     │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Home         │ Hero v2    │ Published │ Dec 3      │ [Edit] [⋮]  │ │
│  │  About Us     │ Standard   │ Draft     │ Dec 1      │ [Edit] [⋮]  │ │
│  │  Services     │ Grid       │ Published │ Nov 28     │ [Edit] [⋮]  │ │
│  │  Doctors      │ Profile    │ Published │ Nov 25     │ [Edit] [⋮]  │ │
│  │  Contact      │ Contact    │ Published │ Nov 20     │ [Edit] [⋮]  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  TEMPLATE SWITCHER                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Current: Modern Medical v2.1                                      │ │
│  │                                                                    │ │
│  │  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐         │ │
│  │  │ Modern Medical │ │ Classic Care   │ │ Premium Health │         │ │
│  │  │ [✓ Active]     │ │ [Switch]       │ │ [Switch]       │         │ │
│  │  └────────────────┘ └────────────────┘ └────────────────┘         │ │
│  │                                                                    │ │
│  │  ⚠️ Switching templates will require content review                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### WYSIWYG Content Editor

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Edit Page: Home                             [Discard] [Save] [Publish] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ [B] [I] [U] [Link] [Image] [H1] [H2] [•] [1.] [Code] [Quote]       ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                                                                      ││
│  │  HERO SECTION                                              [⚙️]     ││
│  │  ┌─────────────────────────────────────────────────────────────┐   ││
│  │  │  Headline: [Transform Healthcare with Us]                   │   ││
│  │  │  Subheadline: [Comprehensive care for every patient...]     │   ││
│  │  │  CTA 1: [Book Appointment] → /patient/appointments/new      │   ││
│  │  │  CTA 2: [Contact Us] → /contact                             │   ││
│  │  │  Background: [Upload Image]                                  │   ││
│  │  └─────────────────────────────────────────────────────────────┘   ││
│  │                                                                      ││
│  │  SERVICES SECTION                                          [⚙️]     ││
│  │  ┌─────────────────────────────────────────────────────────────┐   ││
│  │  │  [+ Add Service Card]                                        │   ││
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │   ││
│  │  │  │ Cardio   │ │ Neuro    │ │ Ortho    │                     │   ││
│  │  │  │ [Edit]   │ │ [Edit]   │ │ [Edit]   │                     │   ││
│  │  │  └──────────┘ └──────────┘ └──────────┘                     │   ││
│  │  └─────────────────────────────────────────────────────────────┘   ││
│  │                                                                      ││
│  │  DOCTORS SECTION                                           [⚙️]     ││
│  │  ┌─────────────────────────────────────────────────────────────┐   ││
│  │  │  Display: [Featured Doctors ▼]  Layout: [Carousel ▼]        │   ││
│  │  │  Auto-populated from doctor profiles                         │   ││
│  │  └─────────────────────────────────────────────────────────────┘   ││
│  │                                                                      ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  VERSION HISTORY                                    [View All Versions] │
│  v3.2 (Current) - Dec 3, 2025 by Admin                                  │
│  v3.1 - Dec 1, 2025 by Admin                                            │
│  v3.0 - Nov 28, 2025 by Admin                       [Rollback to v3.0] │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Media Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Media Library                                           [+ Upload]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [All] [Images] [Videos] [Documents]           🔍 Search media...       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  ││
│  │ │ [img]  │ │ [img]  │ │ [img]  │ │ [vid]  │ │ [doc]  │ │ [img]  │  ││
│  │ │ hero   │ │ doctor │ │ room   │ │ intro  │ │ guide  │ │ logo   │  ││
│  │ │ 1.2MB  │ │ 450KB  │ │ 800KB  │ │ 15MB   │ │ 2MB    │ │ 50KB   │  ││
│  │ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  STORAGE USAGE                                                           │
│  Used: 125MB / 5GB (2.5%)  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░            │
│                                                                          │
│  CDN STATS (This Month)                                                  │
│  Requests: 45,234  │  Bandwidth: 2.3GB  │  Avg Load: 450ms              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Publication Workflow

```
Publication States:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   [Draft] ─────► [In Review] ─────► [Scheduled] ─────► [Published]      │
│      │               │                   │                 │            │
│      └──────────────►└───────────────────┴─────────────────┘            │
│                           (Reject returns to Draft)                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Workflow Features:
• Draft - Work in progress, not visible
• In Review - Pending approval from senior admin
• Scheduled - Approved, will publish at set date/time
• Published - Live on hospital website
• Rollback - Revert to any previous version
```

---

### 🆕 14. Task Management System (`/admin/tasks`)

**Status:** ❌ Not Started

#### Task Board

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Task Management                                        [+ Create Task] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Board View]  [List View]  [Calendar View]                             │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  TO DO (5)      │  IN PROGRESS (3)  │  REVIEW (2)   │  DONE (12)   ││
│  ├─────────────────┼───────────────────┼───────────────┼──────────────┤│
│  │ ┌─────────────┐ │ ┌─────────────┐   │ ┌───────────┐ │              ││
│  │ │ Review new  │ │ │ Process     │   │ │ Approve   │ │              ││
│  │ │ doctor apps │ │ │ insurance   │   │ │ budget    │ │              ││
│  │ │             │ │ │ claims      │   │ │ report    │ │              ││
│  │ │ 🔴 High     │ │ │             │   │ │           │ │              ││
│  │ │ Due: Today  │ │ │ 🟡 Medium   │   │ │ 🟢 Low    │ │              ││
│  │ │ @Dr. Admin  │ │ │ Due: Dec 5  │   │ │ Due: Dec 6│ │              ││
│  │ └─────────────┘ │ │ @Billing    │   │ └───────────┘ │              ││
│  │ ┌─────────────┐ │ └─────────────┘   │               │              ││
│  │ │ Call patient│ │                   │               │              ││
│  │ │ followups   │ │                   │               │              ││
│  │ │ 🟡 Medium   │ │                   │               │              ││
│  │ └─────────────┘ │                   │               │              ││
│  └─────────────────┴───────────────────┴───────────────┴──────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### SLA Tracking

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SLA Dashboard                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Tasks on Time │ │  At Risk       │ │   Breached     │               │
│  │     85%        │ │     12%        │ │      3%        │               │
│  │   (42 tasks)   │ │   (6 tasks)    │ │   (2 tasks)    │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  SLA RULES                                                   [+ Add Rule]│
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Task Type           │ SLA Time  │ Escalate To    │ Status         │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Patient Complaint   │ 4 hours   │ Hospital Admin │ Active         │ │
│  │  Insurance Claim     │ 48 hours  │ Billing Head   │ Active         │ │
│  │  Doctor Onboarding   │ 7 days    │ HR Manager     │ Active         │ │
│  │  Equipment Request   │ 24 hours  │ Operations     │ Active         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 🆕 15. Incident Management (`/admin/incidents`)

**Status:** ❌ Not Started

#### Incident Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Incident Management                                 [+ Report Incident]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Active]  [Resolved]  [All Incidents]                                  │
│                                                                          │
│  ACTIVE INCIDENTS                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  🔴 INC-001: Lab Equipment Malfunction              [CRITICAL]    │ │
│  │     Opened: Dec 4, 10:30 AM  |  Owner: Dr. Admin                  │ │
│  │     Impact: Lab services delayed by 2 hours                       │ │
│  │     Status: Technician dispatched                                 │ │
│  │     [Update Status] [Escalate] [Resolve]                          │ │
│  │                                                                    │ │
│  │  🟡 INC-002: AC not working in Ward B               [MEDIUM]      │ │
│  │     Opened: Dec 4, 9:00 AM  |  Owner: Facilities                  │ │
│  │     Impact: Patient discomfort                                    │ │
│  │     Status: Maintenance scheduled for 2 PM                        │ │
│  │     [Update Status] [Escalate] [Resolve]                          │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  INCIDENT TIMELINE (INC-001)                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  10:30 AM │ Incident reported by Lab Staff                        │ │
│  │  10:35 AM │ Assigned to Facilities team                           │ │
│  │  10:45 AM │ Escalated to Critical                                 │ │
│  │  11:00 AM │ Technician dispatched                                 │ │
│  │  ...      │ [Pending resolution]                                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 🆕 16. Insurance Claims Pipeline (`/admin/insurance`)

**Status:** ❌ Not Started

#### Claims Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Insurance Claims                                       [+ New Claim]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Pending       │ │  In Process    │ │   Approved     │               │
│  │   ₹8.5L        │ │   ₹12.3L       │ │   ₹45.2L       │               │
│  │   23 claims    │ │   15 claims    │ │   89 claims    │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  CLAIMS PIPELINE                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Claim #    │ Patient    │ Insurer     │ Amount │ Status │ Action │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  CLM-001    │ R. Kumar   │ Star Health │ ₹25K   │ Pending│ [View] │ │
│  │  CLM-002    │ P. Sharma  │ ICICI Lomb. │ ₹45K   │ Process│ [View] │ │
│  │  CLM-003    │ A. Patel   │ Max Bupa    │ ₹12K   │ Approved│[View] │ │
│  │  CLM-004    │ N. Reddy   │ Star Health │ ₹8K    │ Rejected│[View] │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  CLAIM WORKFLOW                                                          │
│  [Submit] → [TPA Review] → [Pre-Auth] → [Treatment] → [Final Claim]    │
│                            → [Approved/Rejected]                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 🆕 17. Dual Approval System

**Status:** ❌ Not Started

#### High-Risk Actions Requiring Dual Approval

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Pending Approvals                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ACTIONS REQUIRING YOUR APPROVAL                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ⚠️ Billing Reversal: ₹45,000                                     │ │
│  │     Requested by: Billing Staff  |  Dec 4, 11:00 AM               │ │
│  │     Reason: Duplicate charge for patient P-002                    │ │
│  │     [Approve] [Reject] [Request More Info]                        │ │
│  │                                                                    │ │
│  │  ⚠️ Patient Data Export                                           │ │
│  │     Requested by: Dr. Admin  |  Dec 4, 10:30 AM                   │ │
│  │     Reason: Legal request for records                             │ │
│  │     Records: 150 patients                                         │ │
│  │     [Approve] [Reject] [Request More Info]                        │ │
│  │                                                                    │ │
│  │  ⚠️ Staff Termination: Raj Kumar (Receptionist)                   │ │
│  │     Requested by: HR Manager  |  Dec 3, 4:00 PM                   │ │
│  │     Reason: Policy violation                                      │ │
│  │     [Approve] [Reject] [Request More Info]                        │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Actions Requiring Dual Approval

| Action | First Approver | Second Approver |
|--------|----------------|-----------------|
| Billing Reversal > ₹10,000 | Billing Head | Hospital Admin |
| Patient Data Export | Doctor/Admin | Hospital Admin |
| Staff Termination | HR Manager | Hospital Admin |
| Access Revocation (Doctor) | HR | Hospital Admin |
| Plan Upgrade/Downgrade | Admin | Super Admin |
| Delete Patient Records | Doctor | Hospital Admin |

---

### 🆕 18. Patient Engagement Suite (`/admin/engagement`)

**Status:** ❌ Not Started

#### Campaign Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Patient Engagement                                  [+ New Campaign]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Campaigns]  [Feedback]  [Announcements]                               │
│                                                                          │
│  ACTIVE CAMPAIGNS                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  📢 Annual Health Checkup Reminder                   [Active]     │ │
│  │     Target: Patients not visited in 6+ months (2,345 patients)    │ │
│  │     Channels: Email ✓  SMS ✓  WhatsApp ✓                         │ │
│  │     Sent: 2,100  |  Opened: 1,456  |  Booked: 234                 │ │
│  │     [View Details] [Pause] [Edit]                                 │ │
│  │                                                                    │ │
│  │  📢 Flu Vaccination Drive                            [Scheduled]  │ │
│  │     Target: All patients 60+ years (567 patients)                 │ │
│  │     Scheduled: Dec 10, 2025                                       │ │
│  │     [View Details] [Cancel] [Edit]                                │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  FEEDBACK SUMMARY                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Overall Rating: ⭐ 4.6/5  (based on 1,234 responses)             │ │
│  │                                                                    │ │
│  │  Doctor Care     ████████████████████ 4.8                         │ │
│  │  Wait Time       ██████████████       3.5                         │ │
│  │  Facilities      █████████████████    4.2                         │ │
│  │  Staff Behavior  ███████████████████  4.7                         │ │
│  │                                                                    │ │
│  │  [View All Feedback] [Export Report]                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints (Extended)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Dashboard stats |
| GET | `/api/v1/team/members` | List team members |
| POST | `/api/v1/team/invitations` | Send invitation |
| GET | `/api/v1/admin/doctors` | List doctors |
| GET | `/api/v1/admin/patients` | List patients |
| GET | `/api/v1/admin/appointments` | List appointments |
| GET | `/api/v1/admin/billing/invoices` | List invoices |
| GET | `/api/v1/admin/settings` | Get settings |
| PATCH | `/api/v1/admin/settings` | Update settings |
| GET | `/api/v1/admin/site/pages` | List site pages |
| PUT | `/api/v1/admin/site/pages/{id}` | Update page content |
| POST | `/api/v1/admin/site/publish` | Publish site changes |
| GET | `/api/v1/admin/tasks` | List tasks |
| POST | `/api/v1/admin/tasks` | Create task |
| GET | `/api/v1/admin/incidents` | List incidents |
| POST | `/api/v1/admin/incidents` | Report incident |
| GET | `/api/v1/admin/insurance/claims` | List claims |
| POST | `/api/v1/admin/approvals/{id}/approve` | Approve action |
| POST | `/api/v1/admin/approvals/{id}/reject` | Reject action |
| GET | `/api/v1/admin/engagement/campaigns` | List campaigns |
| POST | `/api/v1/admin/engagement/campaigns` | Create campaign |

---

## 📋 Implementation Checklist (Extended)

### Layout & Navigation
- [x] Admin layout with sidebar
- [x] Header with user menu
- [x] Responsive sidebar
- [x] Navigation highlighting

### Dashboard
- [x] KPI cards
- [x] Quick actions
- [x] Recent activity
- [ ] Charts & graphs

### Team Management
- [x] Team list with filters
- [x] Single invite form
- [x] Bulk invite form
- [x] Pending invitations
- [x] Member actions (suspend/activate)

### Doctors
- [ ] Doctor list with details
- [ ] Schedule management
- [ ] Credential verification
- [ ] Performance stats

### Patients
- [x] Patient list
- [x] Patient detail modal
- [ ] Medical history tab
- [ ] Export functionality

### Appointments
- [x] List view
- [x] Calendar view
- [x] Grid view
- [x] Filters

### Billing
- [x] Overview stats
- [x] Invoice list
- [ ] Create invoice
- [ ] Payment recording

### Settings
- [x] General settings
- [x] Branding settings
- [x] Notification settings
- [x] Security settings

### NEW: HR Management
- [ ] Employee records
- [ ] Hiring campaigns
- [ ] Termination workflow
- [ ] Document generation

### NEW: Document Templates
- [ ] Template library
- [ ] Template editor
- [ ] Variable system
- [ ] Branding integration

### NEW: Site & Brand Studio
- [ ] WYSIWYG editor
- [ ] Template switcher
- [ ] Media library
- [ ] Publication workflow
- [ ] Version history

### NEW: Task Management
- [ ] Task board
- [ ] SLA tracking
- [ ] Escalation rules
- [ ] Notifications

### NEW: Incident Management
- [ ] Incident reporting
- [ ] Status tracking
- [ ] Timeline view
- [ ] Resolution workflow

### NEW: Insurance Claims
- [ ] Claims pipeline
- [ ] Pre-authorization
- [ ] Status tracking
- [ ] Reporting

### NEW: Dual Approval
- [ ] Approval queue
- [ ] Action configuration
- [ ] Audit logging

### NEW: Patient Engagement
- [ ] Broadcast campaigns
- [ ] Feedback collection
- [ ] Analytics dashboard

---

## 🔗 Related Documentation

- [03_HOSPITAL_ONBOARDING.md](./03_HOSPITAL_ONBOARDING.md) - Initial setup
- [06_DOCTOR_WORKSPACE.md](./06_DOCTOR_WORKSPACE.md) - Doctor features
- [09_BACKEND_API.md](./09_BACKEND_API.md) - API specifications
