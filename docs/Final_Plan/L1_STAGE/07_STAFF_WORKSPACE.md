# 07. Staff Workspace

> **Stage:** L1 (Core)  
> **Priority:** MEDIUM  
> **Status:** ❌ Not Started

---

## 🎯 Overview

Staff roles include:
- **Front Desk / Reception** - Patient check-in, appointment scheduling, queue management
- **Nursing & Care Coordinators** - Vitals, patient prep, care plan support
- **Billing & Finance Staff** - Invoices, payments, insurance claims
- **HR & Compliance Staff** - Onboarding, records, training, compliance
- **Operations & Facility Managers** - Resource allocation, maintenance, KPIs
- **Support / Contact Center Agents** - Patient inquiries, tickets, outreach

---

## 🔗 URL Structure

| URL | Page | Description |
|-----|------|-------------|
| `/staff` | Dashboard | Role-based dashboard |
| `/staff/appointments` | Appointments | Manage appointments |
| `/staff/queue` | Queue | Patient queue management |
| `/staff/tasks` | Tasks | Task board with SLA |
| `/staff/patients` | Patients | Patient check-in & intake |
| `/staff/billing` | Billing | Payment desk & claims |
| `/staff/hr` | HR Center | Employment records |
| `/staff/operations` | Operations | Resource & incident mgmt |
| `/staff/profile` | Profile | Personal settings |

---

## 👥 Staff Personas & Responsibilities

### 1. Front Desk / Reception

```
Responsibilities:
├── Appointment scheduling
├── Patient check-in/out
├── Manage waitlists and walk-ins
├── Real-time queue updates
├── Collect preliminary patient info
├── Verify insurance documents
└── Communicate delays to patients/doctors
```

### 2. Nursing & Care Coordinators

```
Responsibilities:
├── Prepare rooms
├── Manage vitals intake
├── Update patient charts
├── Coordinate care plans
├── Monitor follow-up tasks
├── Manage care escalations
└── Assist with telehealth logistics
```

### 3. Billing & Finance Staff

```
Responsibilities:
├── Generate invoices
├── Process payments (card, cash, digital)
├── Manage refunds
├── Handle insurance claims
├── Track claim statuses
├── Monitor patient balances
└── Set up payment plans
```

### 4. HR & Compliance Staff

```
Responsibilities:
├── Onboard new hires
├── Manage employment records
├── Run background checks
├── Track certifications & training
├── Policy acknowledgement tracking
├── Performance reviews
└── Termination workflows
```

### 5. Operations & Facility Managers

```
Responsibilities:
├── Resource allocation (rooms, equipment)
├── Maintenance requests
├── Monitor operational KPIs
├── Escalate issues to admins
├── Coordinate schedule adjustments
└── Inventory snapshots
```

### 6. Support / Contact Center Agents

```
Responsibilities:
├── Handle patient inquiries
├── Route tickets appropriately
├── Manage outreach campaigns
├── Telephonic/email/chat support
└── Follow-up on bookings
```

---

## 🆕 Staff Onboarding Lifecycle

### Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│              STAFF ONBOARDING LIFECYCLE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. INVITATION        2. ACCOUNT         3. ROLE CONFIG                 │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐                   │
│  │ Admin   │  ──▶    │ Staff   │  ──▶    │ Assign  │                   │
│  │ Invites │         │ Signs Up│         │ Perms   │                   │
│  └─────────┘         └─────────┘         └─────────┘                   │
│                                               │                          │
│                                               ▼                          │
│  6. ACTIVATION       5. TRAINING         4. DOCUMENTS                   │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐                   │
│  │ Go Live │  ◀──    │ Complete│  ◀──    │ Upload  │                   │
│  │ Active  │         │ Training│         │ ID/Certs│                   │
│  └─────────┘         └─────────┘         └─────────┘                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Invitation & Account Creation

```
Invitation Details:
├── Role selection: Front desk, nurse, billing, etc.
├── Department assignment
├── Employment type: Full-time, part-time, contract
├── Start date
├── Email/SMS invite via Supabase Auth

Account Setup:
├── Email/Password or Google SSO
├── MFA setup (optional/required per policy)
├── Accept terms, privacy policy, work policies
```

### Step 2: Role Configuration & Training

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Role Configuration                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PERMISSIONS (Based on Role Template)                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Role: Front Desk Receptionist                                     │ │
│  │                                                                    │ │
│  │  Inherited Permissions:                                            │ │
│  │  ☑️ View appointments                                              │ │
│  │  ☑️ Book appointments                                              │ │
│  │  ☑️ Patient check-in                                               │ │
│  │  ☑️ Queue management                                               │ │
│  │  ☑️ Basic patient info                                             │ │
│  │  ☐ Medical records (Override: Admin can enable)                   │ │
│  │  ☑️ Billing (View Only)                                            │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ONBOARDING CHECKLIST                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ☐ Watch: System overview video (15 min)                          │ │
│  │  ☐ Complete: Front desk training module (30 min)                  │ │
│  │  ☐ Read: Patient privacy guidelines                               │ │
│  │  ☐ Acknowledge: Hospital policies                                 │ │
│  │  ☐ Schedule: In-person orientation (if required)                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Workspace Personalization

```
Staff Preferences:
├── Preferred language
├── Notification channels (email, SMS, push)
├── Working locations (multi-location support)
├── Shift availability
├── Quick access shortcuts configuration
└── Delegate/back-up contacts for shift coverage
```

### Step 4: Employment Lifecycle

```
Employment Status Transitions:
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Pending  │ ──▶ │  Active  │ ──▶ │ On Leave │ ──▶ │Terminated│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                 │
                      └────────◀────────┘

Offboarding Workflow:
├── Revoke system access
├── Document handover
├── Exit interview notes
├── Final payroll adjustments
└── Archive employee records
```

---

## 📄 Page Specifications

### 1. Receptionist Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Front Desk Dashboard                               Wednesday, Dec 4    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Today's Appts │ │ Checked In     │ │  In Queue      │               │
│  │      45        │ │     23         │ │     12         │               │
│  │  8 walk-ins    │ │  22 remaining  │ │  Avg: 15 min   │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  QUICK ACTIONS                                                   │    │
│  │  [+ Book Appointment] [Check-in Patient] [View Queue] [Walk-in] │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────┐ ┌──────────────────────────────┐    │
│  │  UPCOMING APPOINTMENTS         │ │  WAITING QUEUE                │    │
│  │                                │ │                               │    │
│  │  9:30  Priya Sharma            │ │  1. Rajesh K. - Dr. Sharma   │    │
│  │        Dr. Sharma • Room 5     │ │     Waiting: 5 min           │    │
│  │        [Check In]              │ │     [Call] [Room 5]          │    │
│  │                                │ │                               │    │
│  │  9:45  Amit Singh (Walk-in)    │ │  2. Amit S. - Dr. Gupta      │    │
│  │        Dr. Gupta • Pending     │ │     Waiting: 12 min          │    │
│  │        [Assign Room]           │ │     [Call] [Room 3]          │    │
│  │                                │ │                               │    │
│  │  10:00 Neha Reddy              │ │  3. Priya P. - Dr. Patel     │    │
│  │        Dr. Patel • Room 3      │ │     Waiting: 8 min           │    │
│  │        [Check In]              │ │     [Call] [Room 7]          │    │
│  │                                │ │                               │    │
│  └────────────────────────────────┘ └──────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  MY TASKS                                              [View All]│    │
│  │  ⚠️ 2 tasks at risk of SLA breach                               │    │
│  │  • Call patient for appointment confirmation (Due: 30 min)      │    │
│  │  • Process insurance verification (Due: 1 hour)                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Patient Check-in Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Patient Check-in                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Search Patient: [🔍 Enter patient name, phone, or ID...]               │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Search Results                                                    │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Rajesh Kumar                                                │  │ │
│  │  │  P-001 • +91 98765 43210                                    │  │ │
│  │  │  Appointment: 9:30 AM with Dr. Sharma                        │  │ │
│  │  │                                                              │  │ │
│  │  │  [Check In]                                                  │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  Quick Check-in via Appointment:                                         │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Upcoming Appointments                                             │ │
│  │                                                                    │ │
│  │  9:30 AM  Rajesh Kumar      Dr. Sharma   [✓ Check In]             │ │
│  │  9:45 AM  Priya Sharma      Dr. Sharma   [✓ Check In]             │ │
│  │  10:00 AM Amit Singh        Dr. Gupta    [✓ Check In]             │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Queue Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Queue Management                                    [Refresh] [Filter] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Doctor Filter: [All Doctors ▼]                                         │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  DR. ANIL SHARMA - CARDIOLOGY                          Room 5    │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │  🟢 Currently: Rajesh Kumar (Since 9:35 AM)                       │ │
│  │                                                                    │ │
│  │  Queue (3 waiting):                                                │ │
│  │  1. Priya Sharma    9:30 AM    Waiting: 15 min    [Call Next]     │ │
│  │  2. Amit Singh      10:00 AM   Waiting: 5 min                     │ │
│  │  3. Neha Reddy      10:30 AM   Not arrived                        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  DR. PRIYA PATEL - PEDIATRICS                          Room 3    │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │  🟡 On Break (Returns at 10:00 AM)                                │ │
│  │                                                                    │ │
│  │  Queue (2 waiting):                                                │ │
│  │  1. Vikram Gupta    10:00 AM   Waiting: 0 min                     │ │
│  │  2. Meera Krishnan  10:30 AM   Not arrived                        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Nurse Dashboard - Vitals Recording

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Nurse Station                                      Wednesday, Dec 4    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Need Vitals   │ │  Vitals Done   │ │  With Doctor   │               │
│  │      8         │ │     15         │ │     5          │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  PATIENTS AWAITING VITALS                                        │    │
│  │                                                                  │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │  Rajesh Kumar • P-001                                   │    │    │
│  │  │  Age: 45 • Male • Dr. Sharma                            │    │    │
│  │  │  Conditions: Hypertension, Diabetes                     │    │    │
│  │  │  Checked in: 9:25 AM                                    │    │    │
│  │  │                                             [Record Vitals]  │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Vitals Recording Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Record Vitals - Rajesh Kumar                                    [✕]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Blood Pressure:                                                         │
│  ┌──────────────┐  /  ┌──────────────┐  mmHg                            │
│  │     140      │     │      90      │                                   │
│  └──────────────┘     └──────────────┘                                   │
│                                                                          │
│  Heart Rate:              Temperature:           SpO2:                   │
│  ┌──────────────┐        ┌──────────────┐       ┌──────────────┐        │
│  │      82      │ bpm    │    98.6      │ °F    │      98      │ %      │
│  └──────────────┘        └──────────────┘       └──────────────┘        │
│                                                                          │
│  Weight:                  Height:                                        │
│  ┌──────────────┐        ┌──────────────┐                               │
│  │      78      │ kg     │     175      │ cm                            │
│  └──────────────┘        └──────────────┘                               │
│                                                                          │
│  Notes:                                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Patient complaining of chest pain                                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                          [Cancel]  [Save & Send to Dr]  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Billing Staff Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Billing Desk                                       Wednesday, Dec 4    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Today's       │ │  Collected     │ │   Pending      │               │
│  │  Invoices: 45  │ │  ₹85,000       │ │  ₹12,000       │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  [+ New Invoice]  [Pending Payments]  [Insurance Claims]                │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  PATIENTS READY FOR BILLING                                        │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Rajesh Kumar • Consultation Complete                       │  │ │
│  │  │  Dr. Sharma • Cardiology                                    │  │ │
│  │  │  Services: Consultation (₹800) + ECG (₹500)                 │  │ │
│  │  │  Total: ₹1,300                                              │  │ │
│  │  │                                           [Generate Invoice] │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Priya Sharma • Consultation Complete                       │  │ │
│  │  │  Dr. Patel • Pediatrics                                     │  │ │
│  │  │  Services: Consultation (₹600)                              │  │ │
│  │  │  Total: ₹600                                                │  │ │
│  │  │  Insurance: Star Health (Covered)                           │  │ │
│  │  │                                       [Process via Insurance]│  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/staff/dashboard` | Role-based dashboard |
| GET | `/api/v1/staff/appointments` | Today's appointments |
| POST | `/api/v1/staff/checkin/{id}` | Check in patient |
| GET | `/api/v1/staff/queue` | Current queue |
| POST | `/api/v1/staff/queue/call/{id}` | Call next patient |
| POST | `/api/v1/staff/vitals` | Record vitals |
| GET | `/api/v1/staff/billing/pending` | Pending bills |
| POST | `/api/v1/staff/billing/invoice` | Create invoice |

---

## 📋 Implementation Checklist

### Receptionist
- [ ] Front desk dashboard
- [ ] Patient check-in flow
- [ ] Walk-in appointment booking
- [ ] Queue management

### Nurse
- [ ] Nurse station dashboard
- [ ] Vitals recording form
- [ ] Patient prep checklist
- [ ] Integration with doctor view

### Billing
- [ ] Billing dashboard
- [ ] Invoice generation
- [ ] Payment collection
- [ ] Insurance claim processing

### Common
- [ ] Staff layout with sidebar
- [ ] Role-based navigation
- [ ] Notifications
- [ ] Profile settings

---

## 🔗 Related Documentation

- [05_ADMIN_DASHBOARD.md](./05_ADMIN_DASHBOARD.md) - Admin features
- [06_DOCTOR_WORKSPACE.md](./06_DOCTOR_WORKSPACE.md) - Doctor features
- [08_PATIENT_PORTAL.md](./08_PATIENT_PORTAL.md) - Patient features

---

## 🆕 Task & Queue Management System

### Unified Task Board

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Task Management                                        [+ Create Task] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [My Tasks]  [Team Tasks]  [All Queues]                                 │
│                                                                          │
│  Filters: [Status ▼] [Priority ▼] [Due Date ▼] [Assignee ▼]            │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  TO DO (5)       │  IN PROGRESS (3) │  REVIEW (2)  │  DONE (15)   │ │
│  ├──────────────────┼──────────────────┼──────────────┼──────────────┤ │
│  │ ┌──────────────┐ │ ┌──────────────┐ │              │              │ │
│  │ │ Verify ins.  │ │ │ Call patient │ │              │              │ │
│  │ │ for P-123    │ │ │ for followup │ │              │              │ │
│  │ │ 🔴 High      │ │ │ 🟡 Medium    │ │              │              │ │
│  │ │ Due: 30 min  │ │ │ Due: 2 hours │ │              │              │ │
│  │ │ ⚠️ At Risk   │ │ │              │ │              │              │ │
│  │ └──────────────┘ │ └──────────────┘ │              │              │ │
│  │ ┌──────────────┐ │                  │              │              │ │
│  │ │ Process lab  │ │                  │              │              │ │
│  │ │ requisition  │ │                  │              │              │ │
│  │ │ 🟢 Low       │ │                  │              │              │ │
│  │ │ Due: 4 hours │ │                  │              │              │ │
│  │ └──────────────┘ │                  │              │              │ │
│  └──────────────────┴──────────────────┴──────────────┴──────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Task Data Model

```
Task Fields:
├── id: UUID
├── tenant_id: UUID
├── source_entity: { type: 'appointment' | 'patient' | 'claim', id: UUID }
├── owner_role: 'front_desk' | 'nurse' | 'billing' | etc.
├── assignee_user_id: UUID
├── status: 'todo' | 'in_progress' | 'review' | 'done'
├── priority: 'high' | 'medium' | 'low'
├── due_at: timestamp
├── sla_due_at: timestamp
├── completed_at: timestamp
└── metadata: JSONB (channel-specific data)

Audit Trail:
├── Status transitions logged
├── Reassignment events captured
├── SLA breaches recorded
└── Timestamps and actor IDs stored
```

### SLA Configuration

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SLA Rules (Configured by Admin)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Task Type              │ SLA Time │ Escalate To    │ Status      │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Insurance Verification │ 2 hours  │ Billing Head   │ Active      │ │
│  │  Patient Complaint      │ 4 hours  │ Hospital Admin │ Active      │ │
│  │  Appointment Confirm    │ 1 hour   │ Front Desk Lead│ Active      │ │
│  │  Lab Requisition        │ 4 hours  │ Lab Manager    │ Active      │ │
│  │  Refund Request         │ 24 hours │ Finance Head   │ Active      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Escalation Actions:                                                     │
│  • Notification sent to escalation contact                              │
│  • Task highlighted in red on dashboard                                 │
│  • Logged in SLA breach report                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Patient Intake & Support

### Intake Forms

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Patient Intake - Rajesh Kumar                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Demographics]  [Insurance]  [Medical History]  [Consent Forms]        │
│                                                                          │
│  DEMOGRAPHICS                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Full Name: [Rajesh Kumar                                      ]  │ │
│  │  DOB: [15/03/1980]  Age: [45]  Gender: [Male ▼]                   │ │
│  │  Phone: [+91 98765 43210]  Email: [rajesh@email.com           ]  │ │
│  │  Address: [123 Main Street, Chennai - 600001                   ]  │ │
│  │  Emergency Contact: [Priya Kumar] [+91 87654 32109] [Wife]        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  INSURANCE VERIFICATION                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Provider: [Star Health ▼]                                        │ │
│  │  Policy #: [SH-123456789                                      ]  │ │
│  │  Member ID: [MEM-987654                                       ]  │ │
│  │  Valid Until: [31/12/2026]                                        │ │
│  │                                                                    │ │
│  │  ☐ ID Card Photo Uploaded                                         │ │
│  │  [Upload Front] [Upload Back]                                     │ │
│  │                                                                    │ │
│  │  Verification Status: ⏳ Pending                                  │ │
│  │  [Verify Now]                                                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Document Upload Assistance

```
Document Support:
├── Staff helps patients upload documents
├── Take photo via webcam/phone
├── Scan physical documents
├── e-Signature capture (future)
└── Store in patient's file_storage
```

### Support Ticketing

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Support Tickets                                        [+ New Ticket]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Open]  [In Progress]  [Resolved]  [All]                               │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  #TKT-001 - Billing Query                            [Open]       │ │
│  │  Patient: Rajesh Kumar  │  Via: Phone  │  1 hour ago              │ │
│  │  "Query about insurance claim status for Nov visit"               │ │
│  │  Assigned to: Billing Team                                        │ │
│  │  [View] [Assign to Me] [Escalate]                                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  #TKT-002 - Appointment Request                   [In Progress]   │ │
│  │  Patient: Priya Sharma  │  Via: Email  │  3 hours ago             │ │
│  │  "Need urgent appointment with cardiologist"                      │ │
│  │  Assigned to: You                                                 │ │
│  │  [View] [Reply] [Resolve]                                         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Clinical Support Tools (Nursing)

### Nurse Station Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Nurse Station                                      Wednesday, Dec 4    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Need Vitals   │ │  Vitals Done   │ │  With Doctor   │               │
│  │      8         │ │     15         │ │     5          │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  PATIENTS AWAITING VITALS                                                │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Rajesh Kumar • P-001                          Priority: 🔴 │  │ │
│  │  │  Age: 45 • Male • Dr. Sharma (Cardiology)                   │  │ │
│  │  │  Conditions: ⚠️ Hypertension, Diabetes                      │  │ │
│  │  │  Checked in: 9:25 AM  •  Waiting: 10 min                    │  │ │
│  │  │                                                              │  │ │
│  │  │  [Record Vitals]  [View History]  [Flag Urgent]             │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Priya Sharma • P-002                          Priority: 🟢 │  │ │
│  │  │  Age: 28 • Female • Dr. Patel (General)                     │  │ │
│  │  │  Conditions: None                                           │  │ │
│  │  │  Checked in: 9:35 AM  •  Waiting: 5 min                     │  │ │
│  │  │                                                              │  │ │
│  │  │  [Record Vitals]  [View History]                            │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Vitals Recording

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Record Vitals - Rajesh Kumar                                    [✕]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ⚠️ Patient Alerts: Hypertension - Monitor BP closely                   │
│                                                                          │
│  Blood Pressure:                                                         │
│  ┌──────────────┐  /  ┌──────────────┐  mmHg                            │
│  │     150      │     │      95      │       ⚠️ High                    │
│  └──────────────┘     └──────────────┘                                   │
│                                                                          │
│  Heart Rate:              Temperature:           SpO2:                   │
│  ┌──────────────┐        ┌──────────────┐       ┌──────────────┐        │
│  │      88      │ bpm    │    98.6      │ °F    │      97      │ %      │
│  └──────────────┘        └──────────────┘       └──────────────┘        │
│                                                                          │
│  Weight:                  Height:                BMI: 28.4 (Auto)        │
│  ┌──────────────┐        ┌──────────────┐       (Overweight)            │
│  │      82      │ kg     │     170      │ cm                            │
│  └──────────────┘        └──────────────┘                               │
│                                                                          │
│  Blood Sugar (if diabetic):    Respiratory Rate:                         │
│  ┌──────────────┐             ┌──────────────┐                          │
│  │     145      │ mg/dL       │      18      │ /min                     │
│  └──────────────┘             └──────────────┘                          │
│                                                                          │
│  Chief Complaint (from patient):                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Chest discomfort for 2 days, radiating to left arm                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Nurse Notes:                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ BP elevated, patient appears anxious. Recommend urgent review.    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ☑️ Flag as Urgent (notify doctor immediately)                          │
│                                                                          │
│                              [Cancel]  [Save & Send to Doctor]          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Care Plan Task Board

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Care Plan Tasks                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Patient: Rajesh Kumar (Post-surgery Day 2)                             │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  TODAY'S CARE TASKS                                                │ │
│  │                                                                    │ │
│  │  ☑️ 8:00 AM - Vitals check (Completed by Nurse Meera)             │ │
│  │  ☑️ 9:00 AM - Medication: Aspirin 75mg (Given)                    │ │
│  │  ☐ 10:00 AM - Wound dressing change (Due in 30 min)               │ │
│  │  ☐ 12:00 PM - Vitals check                                        │ │
│  │  ☐ 1:00 PM - Medication: Metformin 500mg                          │ │
│  │  ☐ 4:00 PM - Vitals check                                         │ │
│  │  ☐ 6:00 PM - Doctor round (Dr. Sharma)                            │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ESCALATIONS                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ⚠️ Patient reported pain level 7/10 at 9:30 AM                   │ │
│  │  Action: Notified Dr. Sharma, awaiting response                   │ │
│  │  [Update Status]                                                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Billing & Finance Console

### Billing Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Billing Desk                                       Wednesday, Dec 4    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Today's       │ │  Collected     │ │   Pending      │               │
│  │  Invoices: 45  │ │  ₹85,000       │ │  ₹12,000       │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  [+ New Invoice]  [Pending Payments]  [Insurance Claims]  [Reports]     │
│                                                                          │
│  PATIENTS READY FOR BILLING                                              │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Rajesh Kumar • Consultation Complete • 5 min ago                 │ │
│  │  Dr. Sharma • Cardiology                                          │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Services:                                                   │  │ │
│  │  │  • Consultation Fee          ₹800                           │  │ │
│  │  │  • ECG                       ₹500                           │  │ │
│  │  │  • Blood Tests               ₹1,200                         │  │ │
│  │  │  ─────────────────────────────────                          │  │ │
│  │  │  Subtotal:                   ₹2,500                         │  │ │
│  │  │  Insurance Coverage (80%):   -₹2,000                        │  │ │
│  │  │  ─────────────────────────────────                          │  │ │
│  │  │  Patient Pays:               ₹500                           │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  [Generate Invoice]  [Process via Insurance]  [Apply Discount]    │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Payment Collection

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Collect Payment - Invoice #INV-2025-001                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Patient: Rajesh Kumar                                                   │
│  Amount Due: ₹500                                                        │
│                                                                          │
│  PAYMENT METHOD                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ○ Cash          ○ Card          ○ UPI          ○ Net Banking     │ │
│  │                                                                    │ │
│  │  For Card/UPI:                                                     │ │
│  │  [Show QR Code]  [Send Payment Link]                               │ │
│  │                                                                    │ │
│  │  For Cash:                                                         │ │
│  │  Amount Received: ₹ [________]                                     │ │
│  │  Change to Return: ₹ 0                                             │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ☐ Email receipt to patient                                             │
│  ☐ Print receipt                                                        │
│  ☐ SMS receipt                                                          │
│                                                                          │
│                              [Cancel]  [Confirm Payment]                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Insurance Claims Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Insurance Claims                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Pending Submission]  [In Process]  [Approved]  [Rejected]             │
│                                                                          │
│  CLAIMS PIPELINE                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  #CLM-001 • Rajesh Kumar • Star Health                            │ │
│  │  Amount: ₹2,000  │  Status: 🟡 In Process                         │ │
│  │  Submitted: Dec 3  │  Expected: Dec 10                            │ │
│  │  [View Details] [Follow Up]                                       │ │
│  │                                                                    │ │
│  │  #CLM-002 • Priya Sharma • ICICI Lombard                          │ │
│  │  Amount: ₹5,500  │  Status: ⏳ Pending Submission                 │ │
│  │  Documents: ☑️ All uploaded                                        │ │
│  │  [Submit Claim] [View Details]                                    │ │
│  │                                                                    │ │
│  │  #CLM-003 • Amit Patel • Max Bupa                                 │ │
│  │  Amount: ₹3,200  │  Status: ✅ Approved                           │ │
│  │  Payment Expected: Dec 15                                         │ │
│  │  [Record Payment] [View Details]                                  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  FINANCIAL SUMMARY                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Today's Collections: ₹85,000                                     │ │
│  │  Outstanding Balances: ₹45,000                                    │ │
│  │  Pending Insurance: ₹1,25,000                                     │ │
│  │  Write-offs (MTD): ₹5,000                                         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 HR & Compliance Center

### Employee Records

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HR Center                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Employee Directory]  [Documents]  [Compliance]  [Reviews]             │
│                                                                          │
│  EMPLOYEE DIRECTORY                                      [+ Add Employee]│
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Name         │ Role       │ Department │ Joined    │ Status      │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Priya K.     │ Nurse      │ General    │ Mar 2022  │ ● Active    │ │
│  │  Raj Kumar    │ Reception  │ Front Desk │ Jun 2023  │ ● Active    │ │
│  │  Meera S.     │ Billing    │ Finance    │ Jan 2024  │ ● Active    │ │
│  │  Amit P.      │ Nurse      │ ICU        │ Sep 2023  │ ○ On Leave  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Document Repository

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Employee Documents - Priya K.                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  UPLOADED DOCUMENTS                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  📄 Nursing License                     Valid until: Dec 2026 ✅  │ │
│  │  📄 ID Proof (Aadhaar)                  Verified ✅               │ │
│  │  📄 Offer Letter                        Signed ✅                  │ │
│  │  📄 Emergency Contact Form              Completed ✅               │ │
│  │  📄 Bank Details Form                   Verified ✅                │ │
│  │  📄 BLS Certification                   ⚠️ Expires in 30 days     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  EXPIRATION ALERTS                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ⚠️ BLS Certification expires Jan 3, 2026                         │ │
│  │  Action: Employee notified, renewal scheduled                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Compliance Tracking

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Compliance Dashboard                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TRAINING COMPLIANCE                                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Training Module        │ Required │ Completed │ Compliance      │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  HIPAA Basics           │ 45       │ 42        │ 93% ✅          │ │
│  │  Fire Safety            │ 45       │ 45        │ 100% ✅         │ │
│  │  Infection Control      │ 30       │ 25        │ 83% ⚠️          │ │
│  │  Patient Privacy        │ 45       │ 38        │ 84% ⚠️          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  POLICY ACKNOWLEDGEMENTS                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  • Hospital Policies 2025: 43/45 acknowledged                     │ │
│  │  • Code of Conduct: 45/45 acknowledged ✅                         │ │
│  │  • Data Privacy Policy: 40/45 acknowledged                        │ │
│  │                                                                    │ │
│  │  [Send Reminders to Pending]                                      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Operations Hub

### Resource Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Operations Hub                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Room Allocation]  [Equipment]  [Maintenance]  [Incidents]             │
│                                                                          │
│  ROOM STATUS                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Room     │ Status      │ Current Use       │ Next Available      │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  Room 1   │ 🔴 Occupied │ Dr. Sharma (10:00)│ 10:30 AM           │ │
│  │  Room 2   │ 🟢 Available│ -                 │ Now                 │ │
│  │  Room 3   │ 🔴 Occupied │ Dr. Patel (9:45)  │ 10:15 AM           │ │
│  │  Room 4   │ 🟡 Cleaning │ Maintenance       │ 10:00 AM           │ │
│  │  Room 5   │ 🟢 Available│ -                 │ Now                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  EQUIPMENT AVAILABILITY                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ECG Machine #1      │ ✅ Available │ Room 1                      │ │
│  │  ECG Machine #2      │ 🔄 In Use    │ Room 3 (until 10:15)       │ │
│  │  Ultrasound #1       │ 🔧 Maintenance │ Expected: Dec 5          │ │
│  │  Wheelchair #1-5     │ ✅ 4 Available │ 1 in use                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Incident Reporting

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Incident Management                                 [+ Report Incident]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ACTIVE INCIDENTS                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  🔴 INC-023: AC Failure in Ward B                   [CRITICAL]    │ │
│  │     Reported: Today 9:00 AM by Nurse Priya                        │ │
│  │     Impact: Patient comfort affected (12 patients)                │ │
│  │     Status: Technician on-site                                    │ │
│  │     Owner: Facilities Team                                        │ │
│  │     [Update] [Escalate] [Resolve]                                 │ │
│  │                                                                    │ │
│  │  🟡 INC-022: Printer not working (Front Desk)       [MEDIUM]      │ │
│  │     Reported: Today 8:30 AM by Raj Kumar                          │ │
│  │     Impact: Prescription printing delayed                         │ │
│  │     Status: IT support assigned                                   │ │
│  │     Owner: IT Team                                                │ │
│  │     [Update] [Resolve]                                            │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  INCIDENT STATS (This Month)                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Total: 45  │  Resolved: 40  │  Avg Resolution: 4.2 hours         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Communication & Collaboration

### Shift Handoff Notes

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Shift Handoff                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Outgoing: Morning Shift (Nurse Priya)  →  Incoming: Afternoon Shift    │
│                                                                          │
│  HANDOFF SUMMARY                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  CRITICAL PATIENTS:                                                │ │
│  │  • Room 5: Rajesh Kumar - Post-angioplasty Day 1                  │ │
│  │    - Vitals stable, BP slightly elevated (140/90)                 │ │
│  │    - Next vitals check: 2:00 PM                                   │ │
│  │    - Dr. Sharma to visit at 4:00 PM                               │ │
│  │                                                                    │ │
│  │  PENDING TASKS:                                                    │ │
│  │  • Room 3: Dressing change due at 3:00 PM                         │ │
│  │  • Lab results expected for P-045 (notify Dr. Gupta)              │ │
│  │                                                                    │ │
│  │  EQUIPMENT NOTES:                                                  │ │
│  │  • ECG Machine #2 returned to station                             │ │
│  │  • Wheelchair #3 needs wheel repair (reported)                    │ │
│  │                                                                    │ │
│  │  OTHER NOTES:                                                      │ │
│  │  • Patient in Room 7 requested extra blanket                      │ │
│  │  • Family of P-023 asking for update - direct to Dr. Patel        │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ☐ I acknowledge receiving this handoff                                 │
│                                                                          │
│                              [Save as Draft]  [Complete Handoff]        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Internal Messaging

```
Communication Features:
├── Direct messaging between staff
├── Department channels
├── @mentions in tasks/records
├── Announcement board for hospital updates
├── Emergency alerts broadcast
└── All messages scoped by role permissions
```

---

## 🔌 API Endpoints (Extended)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/staff/dashboard` | Role-based dashboard |
| GET | `/api/v1/staff/appointments` | Today's appointments |
| POST | `/api/v1/staff/checkin/{id}` | Check in patient |
| GET | `/api/v1/staff/queue` | Current queue |
| POST | `/api/v1/staff/queue/call/{id}` | Call next patient |
| POST | `/api/v1/staff/vitals` | Record vitals |
| GET | `/api/v1/staff/tasks` | Get tasks |
| POST | `/api/v1/staff/tasks` | Create task |
| PATCH | `/api/v1/staff/tasks/{id}` | Update task |
| GET | `/api/v1/staff/billing/pending` | Pending bills |
| POST | `/api/v1/staff/billing/invoice` | Create invoice |
| POST | `/api/v1/staff/billing/payment` | Record payment |
| GET | `/api/v1/staff/claims` | Insurance claims |
| POST | `/api/v1/staff/claims` | Submit claim |
| GET | `/api/v1/staff/incidents` | List incidents |
| POST | `/api/v1/staff/incidents` | Report incident |
| GET | `/api/v1/staff/handoff` | Get handoff template |
| POST | `/api/v1/staff/handoff` | Submit handoff |
| GET | `/api/v1/staff/hr/employees` | Employee list |
| GET | `/api/v1/staff/hr/compliance` | Compliance status |

---

## 📋 Implementation Checklist (Extended)

### Receptionist
- [ ] Front desk dashboard
- [ ] Patient check-in flow
- [ ] Walk-in appointment booking
- [ ] Queue management
- [ ] Insurance verification

### Nurse
- [ ] Nurse station dashboard
- [ ] Vitals recording form
- [ ] Patient prep checklist
- [ ] Care plan task board
- [ ] Escalation workflow

### Billing
- [ ] Billing dashboard
- [ ] Invoice generation
- [ ] Payment collection (multi-method)
- [ ] Insurance claim submission
- [ ] Claims tracking

### Task Management
- [ ] Unified task board
- [ ] SLA tracking
- [ ] Escalation rules
- [ ] Task notifications

### HR & Compliance
- [ ] Employee directory
- [ ] Document repository
- [ ] Compliance tracking
- [ ] Training assignments

### Operations
- [ ] Room allocation view
- [ ] Equipment tracking
- [ ] Incident reporting
- [ ] Maintenance requests

### Communication
- [ ] Shift handoff system
- [ ] Internal messaging
- [ ] Announcement board

### Common
- [ ] Staff layout with sidebar
- [ ] Role-based navigation
- [ ] Notifications
- [ ] Profile settings
- [ ] Onboarding flow

---

## 🔗 Related Documentation

- [05_ADMIN_DASHBOARD.md](./05_ADMIN_DASHBOARD.md) - Admin features
- [06_DOCTOR_WORKSPACE.md](./06_DOCTOR_WORKSPACE.md) - Doctor features
- [08_PATIENT_PORTAL.md](./08_PATIENT_PORTAL.md) - Patient features
