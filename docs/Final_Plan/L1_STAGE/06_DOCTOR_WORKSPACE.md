# 06. Doctor Workspace

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** 🔄 Partial

---

## 🎯 Overview

The doctor workspace provides clinical tools for:
- Personal dashboard with daily overview
- Appointment calendar management
- Patient records access
- Consultation notes & documentation
- Prescription management
- Profile & availability settings

---

## 🔗 URL Structure

| URL | Page | Description |
|-----|------|-------------|
| `/doctor` | Dashboard | Today's overview |
| `/doctor/calendar` | Calendar | Full appointment calendar |
| `/doctor/patients` | My Patients | Patient list |
| `/doctor/patients/[id]` | Patient Detail | Full patient view |
| `/doctor/appointments` | Appointments | Appointment list |
| `/doctor/consultation/[id]` | Live Consultation | Active consultation room |
| `/doctor/consultations` | Notes | Consultation history |
| `/doctor/prescriptions` | Prescriptions | Prescription management |
| `/doctor/schedule` | My Schedule | Manage availability |
| `/doctor/profile` | Profile | Personal settings |

---

## 📐 Layout Structure

### Sidebar Navigation

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ┌────────────┐  ┌───────────────────────────────────────────────────┐   │
│  │            │  │  Header                    [🔔] [Dr. Sharma ▼]    │   │
│  │  SIDEBAR   │  ├───────────────────────────────────────────────────┤   │
│  │            │  │                                                    │   │
│  │  [Photo]   │  │                                                    │   │
│  │  Dr. Name  │  │                    MAIN CONTENT                    │   │
│  │  Specialty │  │                                                    │   │
│  │            │  │                                                    │   │
│  │  ─────────  │  │                                                    │   │
│  │            │  │                                                    │   │
│  │  Dashboard │  │                                                    │   │
│  │  Calendar  │  │                                                    │   │
│  │  Patients  │  │                                                    │   │
│  │  Consults  │  │                                                    │   │
│  │  Rx        │  │                                                    │   │
│  │            │  │                                                    │   │
│  │  ─────────  │  │                                                    │   │
│  │            │  │                                                    │   │
│  │  Profile   │  │                                                    │   │
│  │  Logout    │  │                                                    │   │
│  │            │  │                                                    │   │
│  └────────────┘  └───────────────────────────────────────────────────┘   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Page Specifications

### 1. Doctor Dashboard (`/doctor`)

**Status:** 🔄 Partial

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Good Morning, Dr. Sharma!                        Wednesday, Dec 4      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │  Today's Appts │ │ Patients Seen  │ │   Pending      │               │
│  │      12        │ │      5         │ │   Notes: 3     │               │
│  │  2 Telehealth  │ │  7 remaining   │ │   Rx: 2        │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                          │
│  ┌────────────────────────────────┐ ┌──────────────────────────────┐    │
│  │  TODAY'S SCHEDULE              │ │  QUICK ACTIONS                │    │
│  │                                │ │                               │    │
│  │  ┌───────────────────────────┐│ │  [Start Video Call]           │    │
│  │  │ 9:00  Rajesh Kumar        ││ │  [Write Prescription]         │    │
│  │  │       In-person • Room 5  ││ │  [View Lab Results]           │    │
│  │  │       [Start] [View]      ││ │  [Block Time Off]             │    │
│  │  └───────────────────────────┘│ │                               │    │
│  │  ┌───────────────────────────┐│ └──────────────────────────────┘    │
│  │  │ 9:30  Priya Sharma        ││                                      │
│  │  │       Video • Telehealth  ││ ┌──────────────────────────────┐    │
│  │  │       [Join] [View]       ││ │  NOTIFICATIONS                │    │
│  │  └───────────────────────────┘│ │                               │    │
│  │  ┌───────────────────────────┐│ │  • Lab results ready for      │    │
│  │  │ 10:00 Amit Singh          ││ │    patient Rajesh Kumar       │    │
│  │  │       In-person • Room 5  ││ │                               │    │
│  │  │       [Start] [View]      ││ │  • New appointment request    │    │
│  │  └───────────────────────────┘│ │    for tomorrow               │    │
│  │                                │ │                               │    │
│  │  [View Full Calendar →]       │ └──────────────────────────────┘    │
│  └────────────────────────────────┘                                      │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  RECENT PATIENTS                                                 │    │
│  │                                                                  │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │    │
│  │  │[Photo] │ │[Photo] │ │[Photo] │ │[Photo] │ │[Photo] │        │    │
│  │  │ Rajesh │ │ Priya  │ │ Amit   │ │ Neha   │ │ Vikram │        │    │
│  │  │ Kumar  │ │ Sharma │ │ Singh  │ │ Reddy  │ │ Gupta  │        │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Calendar (`/doctor/calendar`)

**Status:** 🔄 Partial

#### Calendar Views

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Calendar                           [Today] [Day] [Week] [Month]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ◄  December 2025  ►                                                    │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Mon    │  Tue    │  Wed    │  Thu    │  Fri    │  Sat    │ Sun  │  │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼──────│  │
│  │    1    │    2    │    3    │    4    │    5    │    6    │   7  │  │
│  │ ███     │ ███     │ ████    │ ██████  │ ███     │ ██      │      │  │
│  │  3 appt │  4 appt │  5 appt │ 12 appt │  3 appt │  2 appt │      │  │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼──────│  │
│  │    8    │    9    │   10    │   11    │   12    │   13    │  14  │  │
│  │ ███     │ ████    │ ███     │ ████    │ ███     │         │      │  │
│  │  4 appt │  6 appt │  4 appt │  5 appt │  3 appt │ Off     │      │  │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴──────┘  │
│                                                                          │
│  Legend: █ In-person  █ Video  █ Blocked                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Day View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Wednesday, December 4, 2025                              [+ Block Time]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   8:00  │                                                               │
│  ───────┼───────────────────────────────────────────────────────────   │
│   9:00  │ ┌─────────────────────────────────────────────────────────┐  │
│         │ │  Rajesh Kumar • Follow-up                               │  │
│         │ │  In-person • Room 5                                     │  │
│  ───────┤ │  ⏱ 30 min                         [Start Consultation]  │  │
│   9:30  │ └─────────────────────────────────────────────────────────┘  │
│         │ ┌─────────────────────────────────────────────────────────┐  │
│         │ │  Priya Sharma • New Patient                             │  │
│  ───────┤ │  Video Call • Telehealth                                │  │
│  10:00  │ │  ⏱ 30 min                                  [Join Call]  │  │
│         │ └─────────────────────────────────────────────────────────┘  │
│         │ ┌─────────────────────────────────────────────────────────┐  │
│         │ │  Amit Singh • Chest Pain                                │  │
│  ───────┤ │  In-person • Room 5                                     │  │
│  10:30  │ │  ⏱ 30 min                         [Start Consultation]  │  │
│         │ └─────────────────────────────────────────────────────────┘  │
│  ───────┤                                                               │
│  11:00  │ ┌─────────────────────────────────────────────────────────┐  │
│         │ │  🚫 Blocked - Lunch Break                               │  │
│  ───────┤ │                                           [Unblock]     │  │
│  11:30  │ └─────────────────────────────────────────────────────────┘  │
│  ───────┤                                                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3. My Patients (`/doctor/patients`)

**Status:** 🔄 Partial

#### Patient List

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Patients                                              [Filter] [🔍] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Filters: [All Time ▼] [All Conditions ▼]                              │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Rajesh Kumar                                      │  │ │
│  │  │           45 years • Male                                   │  │ │
│  │  │           Conditions: Hypertension, Diabetes                │  │ │
│  │  │           Last Visit: Dec 1, 2025                           │  │ │
│  │  │           Next Appt: Dec 15, 2025                           │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Records]  [Book Appointment]  [Send Message]         │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Photo]  Priya Sharma                                      │  │ │
│  │  │           32 years • Female                                 │  │ │
│  │  │           Conditions: Pregnancy (28 weeks)                  │  │ │
│  │  │           Last Visit: Nov 28, 2025                          │  │ │
│  │  │           Next Appt: Dec 5, 2025                            │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Records]  [Book Appointment]  [Send Message]         │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Patient Detail (`/doctor/patients/[id]`)

**Status:** ❌ Not Started

#### Patient Full View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to Patients                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐ ┌─────────────────────────────────────────┐   │
│  │                      │ │  Rajesh Kumar                            │   │
│  │      [Photo]         │ │  Patient ID: P-001                       │   │
│  │                      │ │                                          │   │
│  │                      │ │  📧 rajesh@email.com                     │   │
│  └──────────────────────┘ │  📱 +91 98765 43210                      │   │
│                           │  🎂 45 years (March 15, 1980)            │   │
│                           │  🩸 Blood Group: O+                       │   │
│                           └─────────────────────────────────────────┘   │
│                                                                          │
│  [Overview] [Medical History] [Vitals] [Lab Results] [Prescriptions]    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                          │
│  MEDICAL HISTORY                                                         │
│                                                                          │
│  Active Conditions:                                                      │
│  • Hypertension (Diagnosed: 2018)                                       │
│  • Type 2 Diabetes (Diagnosed: 2020)                                    │
│                                                                          │
│  Allergies:                                                              │
│  • Penicillin (Severe)                                                  │
│  • Peanuts (Moderate)                                                   │
│                                                                          │
│  Current Medications:                                                    │
│  • Metformin 500mg - Twice daily                                        │
│  • Amlodipine 5mg - Once daily                                          │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  RECENT VISITS                                                           │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Dec 1, 2025 - Follow-up                                          │ │
│  │  Chief Complaint: Routine diabetes check                          │ │
│  │  Notes: Blood sugar levels stable. Continue current medication.   │ │
│  │  [View Full Note]                                                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Active Consultation (`/doctor/consultation/[id]`)

**Status:** ❌ Not Started

#### 🆕 Consultation Simulation - Complete Doctor-Patient Interaction

This is a **virtual simulation** of a real consultation, designed to track time, guide workflow, and ensure quality care.

#### Consultation Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│              CONSULTATION WORKFLOW SIMULATION                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. START           2. HISTORY         3. EXAMINATION     4. DIAGNOSIS  │
│  ┌─────────┐       ┌─────────┐        ┌─────────┐        ┌─────────┐   │
│  │ Patient │  ──▶  │ Take    │  ──▶   │ Physical│  ──▶   │ AI-Assist│  │
│  │ Check-in│       │ History │        │ Exam    │        │ Diagnosis│   │
│  └─────────┘       └─────────┘        └─────────┘        └─────────┘   │
│       │                                                       │          │
│       │                                                       ▼          │
│       │            5. PRESCRIPTION    6. TREATMENT      7. COMPLETE     │
│       │            ┌─────────┐        ┌─────────┐        ┌─────────┐   │
│       └──────────▶ │ Write Rx│  ──▶   │ Plan &  │  ──▶   │ End &   │   │
│                    │         │        │ Follow-up│       │ Send Rx │   │
│                    └─────────┘        └─────────┘        └─────────┘   │
│                                                                          │
│  ⏱ Total Time Tracked  │  📊 Quality Metrics  │  📝 Auto-Documentation │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Full Consultation Interface

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔴 LIVE CONSULTATION                        ⏱ 00:12:34  [End Session]  │
│  Patient: Rajesh Kumar                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────┐    │
│  │  PATIENT INFORMATION            │ │  WORKFLOW PROGRESS          │    │
│  │                                 │ │                             │    │
│  │  [Photo] Rajesh Kumar           │ │  ✅ Check-in Complete       │    │
│  │  45 yrs • Male • O+             │ │  ✅ History Taken           │    │
│  │                                 │ │  🔵 Examination (Current)   │    │
│  │  ⚠️ ALLERGIES:                  │ │  ⬜ Diagnosis               │    │
│  │  • Penicillin (Severe!)         │ │  ⬜ Prescription            │    │
│  │  • Sulfa drugs                  │ │  ⬜ Treatment Plan          │    │
│  │                                 │ │  ⬜ Complete                 │    │
│  │  CONDITIONS:                    │ │                             │    │
│  │  • Type 2 Diabetes (2020)       │ │  Est. Remaining: ~8 min     │    │
│  │  • Hypertension (2018)          │ │                             │    │
│  │                                 │ └─────────────────────────────┘    │
│  │  CURRENT MEDICATIONS:           │                                     │
│  │  • Metformin 500mg BD           │ ┌─────────────────────────────┐    │
│  │  • Amlodipine 5mg OD            │ │  📋 UPLOADED REPORTS        │    │
│  │  • Aspirin 75mg OD              │ │                             │    │
│  │                                 │ │  📄 Blood Test - Dec 1      │    │
│  │  LAST VISIT: Nov 15, 2025       │ │     [View PDF]              │    │
│  │  Reason: Diabetes follow-up     │ │                             │    │
│  │                                 │ │  📄 ECG Report - Nov 28     │    │
│  │  [View Full History]            │ │     [View PDF]              │    │
│  │                                 │ │                             │    │
│  └─────────────────────────────────┘ │  📄 X-Ray - Nov 20          │    │
│                                      │     [View Image]            │    │
│                                      │                             │    │
│                                      │  ❌ No physical reports     │    │
│                                      │  [Note: Patient to bring]   │    │
│                                      │                             │    │
│                                      └─────────────────────────────┘    │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  📝 CONSULTATION NOTES (Auto-saved)                                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  [Chief Complaint]  [History]  [Examination]  [Diagnosis]  [Plan] │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │                                                                    │  │
│  │  Chief Complaint:                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ Patient complains of chest discomfort since 2 days,         │  │  │
│  │  │ radiating to left arm, associated with shortness of breath. │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │  History of Present Illness:                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ • Onset: 2 days ago, gradual                                │  │  │
│  │  │ • Character: Pressure-like, heaviness                       │  │  │
│  │  │ • Location: Central chest, radiating to left arm            │  │  │
│  │  │ • Aggravating: Exertion, climbing stairs                    │  │  │
│  │  │ • Relieving: Rest                                           │  │  │
│  │  │ • Associated: Mild breathlessness, no sweating              │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  VITALS (Recorded Today)                      [Update Vitals]     │  │
│  │                                                                    │  │
│  │  BP: 150/95 mmHg ⚠️   HR: 88 bpm     Temp: 98.4°F                │  │
│  │  SpO2: 97%            Weight: 82 kg   BMI: 28.4 (Overweight)      │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  🤖 AI ASSISTANT (L2 Feature - Placeholder)                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  💡 Based on symptoms and history, consider:                      │  │
│  │                                                                    │  │
│  │  Possible Diagnoses:                                               │  │
│  │  • Unstable Angina (High probability)                             │  │
│  │  • Stable Angina                                                   │  │
│  │  • GERD (Low probability)                                         │  │
│  │                                                                    │  │
│  │  Recommended Tests:                                                │  │
│  │  • ECG                                                             │  │
│  │  • Cardiac enzymes (Troponin)                                     │  │
│  │  • Lipid profile                                                   │  │
│  │                                                                    │  │
│  │  ⚠️ Red Flags: Chest pain + SOB + Diabetes = High cardiac risk   │  │
│  │                                                                    │  │
│  │  [Accept Suggestion]  [Modify]  [Dismiss]                         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  🎯 ACTIONS                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  [📝 Write Prescription]  [🔬 Order Lab Tests]  [📸 Add Notes]    │  │
│  │                                                                    │  │
│  │  [📅 Schedule Follow-up]  [📤 Refer to Specialist]  [🏥 Admit]    │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │                [Save Progress]        [Complete Consultation]      │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Time Tracking Features

```
Consultation Time Tracking
├── Session timer starts on "Start Consultation"
├── Per-section time tracking:
│   ├── Check-in: 2 min (avg)
│   ├── History: 5 min (avg)
│   ├── Examination: 8 min (avg)
│   ├── Documentation: 3 min (avg)
│   └── Prescription: 2 min (avg)
├── Alerts for:
│   ├── Session exceeding scheduled time
│   └── Next patient waiting reminder
├── Analytics:
│   ├── Average consultation time per doctor
│   ├── Time per condition type
│   └── Comparison with hospital average
└── Reports generated for admin review
```

#### Report Review (Physical vs Digital)

```
Report Handling
├── Digital Reports (Uploaded by patient/lab):
│   ├── Auto-attached to consultation
│   ├── Thumbnail preview in sidebar
│   ├── Full view in modal/new tab
│   ├── AI analysis (L2 feature)
│   └── Highlight abnormal values
│
└── Physical Reports:
    ├── Doctor marks "Physical report reviewed"
    ├── Option to take photo and upload
    ├── Notes field for observations
    └── Flag for "Patient to bring next visit"
```

#### Consultation Completion

```
On "Complete Consultation":
├── Validate all required sections filled
├── Final review screen shows:
│   ├── Diagnosis summary
│   ├── Prescription summary
│   ├── Lab orders
│   ├── Follow-up date
│   └── Treatment plan
├── Doctor confirms and signs
├── Automatic actions:
│   ├── Prescription sent to patient profile
│   ├── Patient notified via app/SMS
│   ├── Lab orders sent to lab system
│   ├── Follow-up auto-scheduled
│   ├── Consultation note saved
│   └── Time analytics recorded
└── Next patient auto-loaded
```

---

### 6. Prescription Management (`/doctor/prescriptions`)

**Status:** ❌ Not Started

#### Write Prescription

```
┌─────────────────────────────────────────────────────────────────────────┐
│  New Prescription                                   [Save] [Print/Send] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Patient: Rajesh Kumar (P-001)                    Date: Dec 4, 2025     │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  MEDICATIONS                                       [+ Add Medicine]│ │
│  │                                                                    │ │
│  │  1. ┌────────────────────────────────────────────────────────────┐│ │
│  │     │ Medication: Atorvastatin                              [✕] ││ │
│  │     │ Dosage: 10mg                                              ││ │
│  │     │ Frequency: Once daily at night                            ││ │
│  │     │ Duration: 30 days                                         ││ │
│  │     │ Instructions: Take after dinner                           ││ │
│  │     └────────────────────────────────────────────────────────────┘│ │
│  │                                                                    │ │
│  │  2. ┌────────────────────────────────────────────────────────────┐│ │
│  │     │ Medication: Aspirin                                   [✕] ││ │
│  │     │ Dosage: 75mg                                              ││ │
│  │     │ Frequency: Once daily                                     ││ │
│  │     │ Duration: 30 days                                         ││ │
│  │     │ Instructions: Take in the morning after food              ││ │
│  │     └────────────────────────────────────────────────────────────┘│ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ADDITIONAL INSTRUCTIONS                                           │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ - Avoid fatty foods                                         │  │ │
│  │  │ - Exercise 30 minutes daily                                 │  │ │
│  │  │ - Follow up in 2 weeks                                      │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  DIAGNOSIS                                                         │ │
│  │  Hyperlipidemia                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 7. Profile & Settings (`/doctor/profile`)

**Status:** ❌ Not Started

#### Profile Settings

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Profile                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Personal] [Credentials] [Schedule] [Preferences]                      │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Personal Information                                              │ │
│  │                                                                    │ │
│  │  ┌────────┐  Full Name: Dr. Anil Sharma                           │ │
│  │  │ Photo  │  Specialty: Cardiologist                              │ │
│  │  │ [Edit] │  Experience: 15 years                                 │ │
│  │  └────────┘  Languages: English, Hindi, Tamil                     │ │
│  │                                                                    │ │
│  │  Bio:                                                              │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ Dr. Sharma is a renowned cardiologist with over 15 years   │  │ │
│  │  │ of experience in interventional cardiology...               │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Consultation Fee: ₹ 800                                          │ │
│  │                                                                    │ │
│  │                                                   [Save Changes]  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 🆕 8. Schedule Management (`/doctor/schedule`)

**Status:** ❌ Not Started

#### Weekly Schedule Setup

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Schedule & Availability                           [Save Schedule]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Weekly Schedule]  [Leaves & Time Off]  [Slot Settings]                │
│                                                                          │
│  WEEKLY SCHEDULE                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Day        │ Morning         │ Afternoon       │ Evening          │ │
│  │  ──────────────────────────────────────────────────────────────── │ │
│  │  Monday     │ 9:00 - 1:00 PM  │ 3:00 - 5:00 PM │ Off              │ │
│  │             │ [Edit]          │ [Edit]          │ [+ Add]          │ │
│  │  ──────────────────────────────────────────────────────────────── │ │
│  │  Tuesday    │ 9:00 - 1:00 PM  │ 3:00 - 5:00 PM │ 6:00 - 8:00 PM  │ │
│  │             │ [Edit]          │ [Edit]          │ [Edit]          │ │
│  │  ──────────────────────────────────────────────────────────────── │ │
│  │  Wednesday  │ 9:00 - 1:00 PM  │ Off             │ Off              │ │
│  │             │ [Edit]          │ [+ Add]         │ [+ Add]          │ │
│  │  ──────────────────────────────────────────────────────────────── │ │
│  │  Thursday   │ 9:00 - 1:00 PM  │ 3:00 - 5:00 PM │ Off              │ │
│  │  Friday     │ 9:00 - 1:00 PM  │ 3:00 - 5:00 PM │ Off              │ │
│  │  Saturday   │ 10:00 - 1:00 PM │ Off             │ Off              │ │
│  │  Sunday     │ Off             │ Off             │ Off              │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Slot Configuration

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Slot Settings                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Default Consultation Duration                                           │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [15 min ▼]  [20 min]  [30 min]  [Custom: ___ min]               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Buffer Time Between Appointments                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  [0 min]  [5 min ▼]  [10 min]  [15 min]                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Max Appointments Per Day: [20 ▼]                                       │
│                                                                          │
│  Appointment Types Allowed:                                              │
│  ☑️ In-person consultations                                             │
│  ☑️ Video consultations (Telehealth)                                    │
│  ☐ Home visits                                                          │
│                                                                          │
│  Break Time (Auto-blocked):                                              │
│  ☑️ Lunch: 1:00 PM - 2:00 PM                                            │
│  ☐ Tea Break: [_____] to [_____]                                        │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  Advanced Settings:                                                      │
│  • Minimum booking notice: [2 hours ▼]                                  │
│  • How far in advance can patients book: [30 days ▼]                    │
│  • Allow same-day appointments: [Yes ▼]                                 │
│  • Auto-confirm appointments: [No - Require approval ▼]                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Leave & Time Off Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Leaves & Time Off                                    [+ Request Leave] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  UPCOMING LEAVES                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  🗓️ Dec 25-26, 2025 - Christmas Holiday                          │ │
│  │     Status: ✅ Approved                                           │ │
│  │     Affected appointments: 8 (Rescheduled)                        │ │
│  │                                                                    │ │
│  │  🗓️ Jan 1, 2026 - New Year                                       │ │
│  │     Status: ✅ Approved                                           │ │
│  │     Affected appointments: 4 (Rescheduled)                        │ │
│  │                                                                    │ │
│  │  🗓️ Jan 15-20, 2026 - Annual Leave                               │ │
│  │     Status: ⏳ Pending Admin Approval                             │ │
│  │     Affected appointments: 24 (Will be rescheduled on approval)   │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  QUICK BLOCK                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Block specific time:                                              │ │
│  │  Date: [___________]  From: [___:___]  To: [___:___]              │ │
│  │  Reason: [Personal ▼]                                             │ │
│  │                                                 [Block Time]       │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Leave Request Form

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Request Leave                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Leave Type: [Annual Leave ▼]                                           │
│                                                                          │
│  • Annual Leave                                                          │
│  • Sick Leave                                                            │
│  • Conference/Training                                                   │
│  • Personal Emergency                                                    │
│  • Other                                                                 │
│                                                                          │
│  From Date: [___________]                                               │
│  To Date:   [___________]                                               │
│                                                                          │
│  ☐ Half Day: [First Half / Second Half]                                 │
│                                                                          │
│  Reason/Notes:                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ⚠️ Impact Analysis:                                                    │
│  • 12 appointments will be affected                                      │
│  • Patients will be notified to reschedule                              │
│  • Alternative doctor: [Dr. Patel (Cardiology) ▼]                       │
│                                                                          │
│                                    [Cancel]  [Submit Leave Request]     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Live Appointment Updates

```
Real-time Appointment Sync
├── When patient books appointment:
│   ├── Doctor dashboard shows notification
│   ├── Calendar updates in real-time
│   ├── Badge count updates
│   └── Optional: Sound/push notification
│
├── When appointment is cancelled:
│   ├── Slot immediately available
│   ├── Doctor notified
│   └── Time freed on calendar
│
├── When doctor updates schedule:
│   ├── All future slots recalculated
│   ├── Conflicting appointments flagged
│   └── Patients notified of changes
│
└── Technology:
    ├── WebSocket for real-time updates
    ├── Optimistic UI updates
    └── Conflict resolution on server
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/doctor/dashboard` | Dashboard data |
| GET | `/api/v1/doctor/appointments` | My appointments |
| GET | `/api/v1/doctor/appointments/today` | Today's appointments |
| GET | `/api/v1/doctor/patients` | My patients |
| GET | `/api/v1/doctor/patients/{id}` | Patient details |
| POST | `/api/v1/doctor/consultations` | Create consultation note |
| GET | `/api/v1/doctor/consultations` | My consultation notes |
| POST | `/api/v1/doctor/prescriptions` | Create prescription |
| GET | `/api/v1/doctor/profile` | My profile |
| PATCH | `/api/v1/doctor/profile` | Update profile |
| GET | `/api/v1/doctor/schedule` | My schedule |
| PATCH | `/api/v1/doctor/schedule` | Update schedule |

---

## 📋 Implementation Checklist

### Dashboard
- [x] Daily overview stats
- [x] Today's schedule list
- [x] Quick actions
- [ ] Notifications feed
- [ ] Recent patients

### Calendar
- [x] Month view
- [ ] Week view
- [ ] Day view
- [ ] Drag-drop rescheduling
- [ ] Block time functionality

### Patients
- [x] Patient list
- [ ] Patient detail page
- [ ] Medical history view
- [ ] Lab results tab
- [ ] Prescription history

### Consultation
- [ ] Consultation workspace
- [ ] SOAP note editor
- [ ] Vitals recording
- [ ] Quick actions panel

### Prescriptions
- [ ] Prescription form
- [ ] Medication search
- [ ] Print/PDF generation
- [ ] Send to patient

### Profile
- [ ] Personal info editing
- [ ] Credential management
- [ ] Schedule preferences
- [ ] Notification settings

---

## 🆕 Doctor Onboarding Lifecycle

### Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│              DOCTOR ONBOARDING LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. INVITATION        2. ACCOUNT         3. CREDENTIALS                 │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐                   │
│  │ Admin   │  ──▶    │ Doctor  │  ──▶    │ Upload  │                   │
│  │ Invites │         │ Signs Up│         │ License │                   │
│  └─────────┘         └─────────┘         └─────────┘                   │
│                                               │                          │
│                                               ▼                          │
│  6. ACTIVATION       5. APPROVAL         4. VERIFICATION               │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐                   │
│  │ Go Live │  ◀──    │ Admin   │  ◀──    │ Hospital│                   │
│  │ Active  │         │ Reviews │         │ Verifies│                   │
│  └─────────┘         └─────────┘         └─────────┘                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Invitation & Account Setup

```
Invitation Details Captured:
├── Role: Doctor
├── Department: [Cardiology, Neurology, etc.]
├── Employment Type: [Full-time, Part-time, Visiting, Consultant]
├── Start Date
├── Mentor Assignment (optional)
├── Telehealth Status (enabled/disabled)
├── Default Location

Account Setup:
├── Email/Password or Google SSO via Supabase Auth
├── MFA Setup (optional/required based on hospital policy)
├── Accept Terms, Privacy Policy, Telehealth/AI usage policies
├── Basic Profile: Name, Contact, Preferred Language, Time Zone
```

### Step 2: Credential & Documentation Intake

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Credential Verification                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  REQUIRED CREDENTIALS                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  📄 Medical License                               [✅ Verified]   │ │
│  │     License #: MCI-12345  │  Valid until: Dec 2026               │ │
│  │     Uploaded: license.pdf                                         │ │
│  │                                                                    │ │
│  │  📄 Medical Degree Certificate                    [✅ Verified]   │ │
│  │     MBBS from ABC Medical College, 2010                          │ │
│  │     Uploaded: degree.pdf                                          │ │
│  │                                                                    │ │
│  │  📄 Specialization Certificate                    [⏳ Pending]    │ │
│  │     MD Cardiology from XYZ Institute, 2015                       │ │
│  │     Uploaded: md_cert.pdf                                         │ │
│  │     Status: Under hospital credentialing review                   │ │
│  │                                                                    │ │
│  │  📄 Professional Registration                     [❌ Required]   │ │
│  │     State Medical Council registration                           │ │
│  │     [Upload Document]                                             │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  COMPLIANCE CHECKLIST                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ☑️ Background check completed                                    │ │
│  │  ☑️ Malpractice insurance verified (Policy #: INS-789)           │ │
│  │  ☐ Mandatory training: HIPAA compliance (Due: Dec 15)            │ │
│  │  ☐ Mandatory training: Telehealth etiquette (Due: Dec 15)        │ │
│  │  ☐ AI usage guidelines acknowledgement                            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  EXPIRATION TRACKING                                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ⚠️ Medical License expires in 60 days - Renewal reminder sent   │ │
│  │  ⚠️ Malpractice insurance expires in 90 days                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Professional Profile Configuration

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Professional Profile                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PUBLIC PROFILE CONTENT                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Biography:                                                        │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ Dr. Sharma is a leading cardiologist with 15+ years...      │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Specializations:                                                  │ │
│  │  [Cardiology ✕] [Interventional ✕] [+ Add Specialty]              │ │
│  │  Primary: ○ Cardiology  ○ Interventional                          │ │
│  │                                                                    │ │
│  │  Languages: [English ✕] [Hindi ✕] [Tamil ✕] [+ Add]               │ │
│  │                                                                    │ │
│  │  Consultation Approach:                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ Patient-centered care focusing on preventive measures...    │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Awards & Recognitions:                                            │ │
│  │  • Best Cardiologist Award 2023 - Indian Medical Association      │ │
│  │  • [+ Add Award]                                                   │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  MEDIA ASSETS                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Professional Photo        Gallery Images        Intro Video       │ │
│  │  ┌─────────────┐          ┌─────────────┐       ┌─────────────┐   │ │
│  │  │   [Photo]   │          │ [Gallery]   │       │   [Video]   │   │ │
│  │  │   [Upload]  │          │ [+ Add]     │       │   [Upload]  │   │ │
│  │  └─────────────┘          └─────────────┘       └─────────────┘   │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  DISPLAY SETTINGS                                                        │
│  ☑️ Show profile on hospital website                                    │
│  ☑️ Allow patient bookings                                              │
│  ☑️ Show reviews and ratings                                            │
│  ☐ Available for mentorship                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 4: Compliance Training

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Compliance Training                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  REQUIRED TRAINING MODULES                                               │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  📚 HIPAA Compliance Training                    [✅ Completed]   │ │
│  │     Duration: 45 min  │  Score: 92%  │  Completed: Dec 1, 2025    │ │
│  │                                                                    │ │
│  │  📚 Telehealth Etiquette & Best Practices        [🔵 In Progress] │ │
│  │     Duration: 30 min  │  Progress: 60%  │  Due: Dec 15, 2025      │ │
│  │     [Continue Training]                                           │ │
│  │                                                                    │ │
│  │  📚 AI Usage Guidelines & Ethics                 [⬜ Not Started] │ │
│  │     Duration: 20 min  │  Due: Dec 15, 2025                        │ │
│  │     [Start Training]                                              │ │
│  │                                                                    │ │
│  │  📚 Platform System Walkthrough                  [⬜ Not Started] │ │
│  │     Duration: 15 min  │  Due: Dec 10, 2025                        │ │
│  │     Interactive tutorial of doctor workspace                      │ │
│  │     [Start Training]                                              │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  SANDBOX MODE (Practice Environment)                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Practice with simulated patients before going live               │ │
│  │  • 5 simulated patient cases available                            │ │
│  │  • Practice consultations, prescriptions, documentation           │ │
│  │  • No impact on real patient data                                 │ │
│  │                                                                    │ │
│  │  [Enter Sandbox Mode]                                              │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Prescription & Medication Management

### Full Prescription System

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Prescription Management                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  MEDICATION ORDER ENTRY                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Search Medication:                                                │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ 🔍 Atorvastatin...                                          │  │ │
│  │  │                                                              │  │ │
│  │  │ Results:                                                     │  │ │
│  │  │ ├── Atorvastatin 10mg (Generic) - ₹12/strip                 │  │ │
│  │  │ ├── Atorvastatin 20mg (Generic) - ₹18/strip                 │  │ │
│  │  │ ├── Lipitor 10mg (Brand) - ₹85/strip                        │  │ │
│  │  │ └── Atorlip 10mg (Brand) - ₹45/strip                        │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  Selected: Atorvastatin 10mg                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Dosage: [10mg ▼]                                           │  │ │
│  │  │  Frequency: [Once daily ▼] [Night ▼]                        │  │ │
│  │  │  Duration: [30] [days ▼]                                    │  │ │
│  │  │  Qty: 30 tablets (auto-calculated)                          │  │ │
│  │  │  Instructions: [Take after dinner ▼]                        │  │ │
│  │  │  ☐ As needed (PRN)                                          │  │ │
│  │  │                                                              │  │ │
│  │  │  💰 Insurance Coverage: ✅ Covered (Patient pays ₹0)        │  │ │
│  │  │                                                              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ⚠️ ALERTS:                                                       │ │
│  │  • Patient allergic to Sulfa drugs - No conflict                 │ │
│  │  • Interaction check with Metformin - Low risk                   │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Refill Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Refill Requests                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PENDING REFILL REQUESTS                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  📋 Rajesh Kumar - Metformin 500mg                                │ │
│  │     Original Rx: Nov 1, 2025  │  Last refill: Dec 1               │ │
│  │     Refills remaining: 2 of 3                                     │ │
│  │     [Approve Refill]  [Deny - Schedule Visit]  [Contact Patient]  │ │
│  │                                                                    │ │
│  │  📋 Priya Sharma - Levothyroxine 50mcg                            │ │
│  │     Original Rx: Oct 15, 2025  │  Last refill: Nov 15             │ │
│  │     Refills remaining: 0 - NEW PRESCRIPTION NEEDED                │ │
│  │     [Schedule Appointment]  [Issue New Rx]                         │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Pharmacy Integration

```
Pharmacy Workflow:
├── e-Prescription sent directly to pharmacy
├── Real-time status tracking:
│   ├── Sent → Received → Processing → Ready → Dispensed
├── Patient notification at each step
├── Delivery tracking (if applicable)
└── Auto-medication education sent to patient
```

---

## 🆕 Mentorship Dashboard

### Mentor View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Mentorship Dashboard                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  MY MENTEES                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Dr. Amit Patel (Junior Cardiologist)                              │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  Status: Active Mentee  │  Since: Nov 1, 2025                │  │ │
│  │  │                                                              │  │ │
│  │  │  📊 This Week:                                               │  │ │
│  │  │  • Consultations: 25                                         │  │ │
│  │  │  • Notes pending review: 3                                   │  │ │
│  │  │  • Average consultation time: 18 min                         │  │ │
│  │  │                                                              │  │ │
│  │  │  📝 Notes Requiring Approval:                                │  │ │
│  │  │  • Patient R. Kumar - Chest pain evaluation [Review]         │  │ │
│  │  │  • Patient S. Singh - ECG interpretation [Review]            │  │ │
│  │  │                                                              │  │ │
│  │  │  [View Schedule]  [Review Notes]  [Send Feedback]            │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  CASE CONFERENCES                                             [+ New]   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Dec 10, 2025 - Complex Case Discussion                           │ │
│  │  Participants: Dr. Patel, Dr. Sharma (Mentor)                     │ │
│  │  Case: Atypical chest pain in diabetic patient                    │ │
│  │  [View Details] [Join Meeting]                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Clinical Documentation AI

### AI-Assisted Note Generation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  AI Documentation Assistant                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  💡 AI Generated Draft (Based on consultation)                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  SUBJECTIVE:                                                       │ │
│  │  45-year-old male presents with chest discomfort for 2 days,      │ │
│  │  radiating to left arm. Associated with shortness of breath       │ │
│  │  on exertion. No fever, no cough. History of diabetes and HTN.    │ │
│  │                                                                    │ │
│  │  OBJECTIVE:                                                        │ │
│  │  BP: 150/95 mmHg, HR: 88 bpm, SpO2: 97%                          │ │
│  │  Cardiac exam: S1S2 normal, no murmurs                            │ │
│  │  Lungs: Clear to auscultation bilaterally                         │ │
│  │                                                                    │ │
│  │  ASSESSMENT:                                                       │ │
│  │  1. Suspected unstable angina (high probability given risk)       │ │
│  │  2. Uncontrolled hypertension                                     │ │
│  │  3. Type 2 Diabetes Mellitus - stable                             │ │
│  │                                                                    │ │
│  │  PLAN:                                                             │ │
│  │  1. Stat ECG, Troponin levels                                     │ │
│  │  2. Start Aspirin 325mg stat                                      │ │
│  │  3. Admit for observation if troponin positive                    │ │
│  │  4. Cardiology consult                                            │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Accept as Draft]  [Edit & Accept]  [Regenerate]  [Write from Scratch] │
│                                                                          │
│  AI GOVERNANCE:                                                          │
│  • AI suggestions are reviewed and approved by physician                 │
│  • All AI-generated content is logged with model metadata               │
│  • Doctor must sign off before finalizing                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Version History & Addenda

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Note History - Patient: Rajesh Kumar                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  VERSION HISTORY                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  v3 (Current) - Dec 4, 2025 2:30 PM                               │ │
│  │  Signed by: Dr. Sharma                                            │ │
│  │  Changes: Added lab results interpretation                        │ │
│  │                                                                    │ │
│  │  v2 - Dec 4, 2025 11:00 AM                                        │ │
│  │  Signed by: Dr. Sharma                                            │ │
│  │  Changes: Updated diagnosis after ECG review                      │ │
│  │                                                                    │ │
│  │  v1 (Initial) - Dec 4, 2025 10:30 AM                              │ │
│  │  Created by: Dr. Sharma (AI-assisted)                             │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ADDENDA                                                     [+ Add]    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Dec 4, 2025 4:00 PM - Dr. Sharma                                 │ │
│  │  "Troponin came back elevated. Patient admitted to CCU."          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 Telehealth Controls

### Video Consultation Interface

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🎥 TELEHEALTH SESSION                              [End Call] [⚙️]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                                                                      ││
│  │                                                                      ││
│  │                     [PATIENT VIDEO FEED]                             ││
│  │                                                                      ││
│  │                                                                      ││
│  │  ┌──────────┐                                                       ││
│  │  │  [Dr.]   │                                                       ││
│  │  │  You     │                                                       ││
│  │  └──────────┘                                                       ││
│  │                                                                      ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  CONTROLS                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  [🎤 Mute]  [📷 Video]  [🖥️ Share Screen]  [💬 Chat]  [📁 Files] │ │
│  │                                                                    │ │
│  │  Connection Quality: ████████░░ Good (720p)                       │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  🚨 EMERGENCY PROTOCOL                                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  If patient shows signs of emergency:                              │ │
│  │  [🚑 Trigger Emergency Protocol]                                   │ │
│  │                                                                    │ │
│  │  This will:                                                        │ │
│  │  • Alert hospital emergency team                                   │ │
│  │  • Capture patient location (if shared)                           │ │
│  │  • Send ambulance dispatch request                                │ │
│  │  • Record session for medical records                             │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Telehealth Features

```
Telehealth Capabilities:
├── Video Call Controls
│   ├── HD Video with adaptive quality
│   ├── Screen sharing for reports/images
│   ├── In-call chat for links/instructions
│   └── File sharing (patient can send images)
│
├── Session Quality Monitoring
│   ├── Connection quality indicator
│   ├── Auto-quality adjustment
│   ├── Reconnection handling
│   └── Session recording (with consent)
│
├── Clinical Integration
│   ├── Patient info sidebar during call
│   ├── Quick access to medical history
│   ├── Live note-taking
│   └── Prescription writing during/after call
│
└── Emergency Protocol
    ├── One-click emergency alert
    ├── Patient location capture
    ├── Hospital emergency team notification
    └── Ambulance dispatch integration
```

---

## 🆕 Delegate Access

### Allow Staff to Manage Calendar

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Calendar Delegation                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  CURRENT DELEGATES                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Receptionist Priya                              [Edit] [Remove]  │ │
│  │  Permissions:                                                      │ │
│  │  ☑️ View my calendar                                              │ │
│  │  ☑️ Book appointments on my behalf                                │ │
│  │  ☑️ Reschedule appointments                                       │ │
│  │  ☐ Cancel appointments                                            │ │
│  │  ☐ Block time slots                                               │ │
│  │                                                                    │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │                                                                    │ │
│  │  Nurse Meera                                     [Edit] [Remove]  │ │
│  │  Permissions:                                                      │ │
│  │  ☑️ View my calendar                                              │ │
│  │  ☐ Book appointments on my behalf                                 │ │
│  │  ☐ Reschedule appointments                                        │ │
│  │  ☐ Cancel appointments                                            │ │
│  │  ☐ Block time slots                                               │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [+ Add Delegate]                                                        │
│                                                                          │
│  AUDIT LOG                                                               │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Dec 4, 11:00 AM - Priya booked appt for patient R. Kumar         │ │
│  │  Dec 4, 10:30 AM - Priya rescheduled appt for patient P. Sharma   │ │
│  │  Dec 3, 4:00 PM - Meera viewed calendar                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints (Extended)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/doctor/dashboard` | Dashboard data |
| GET | `/api/v1/doctor/appointments` | My appointments |
| GET | `/api/v1/doctor/appointments/today` | Today's appointments |
| GET | `/api/v1/doctor/patients` | My patients |
| GET | `/api/v1/doctor/patients/{id}` | Patient details |
| POST | `/api/v1/doctor/consultations` | Create consultation note |
| GET | `/api/v1/doctor/consultations` | My consultation notes |
| POST | `/api/v1/doctor/prescriptions` | Create prescription |
| GET | `/api/v1/doctor/prescriptions/refills` | Pending refill requests |
| POST | `/api/v1/doctor/prescriptions/{id}/refill` | Approve refill |
| GET | `/api/v1/doctor/profile` | My profile |
| PATCH | `/api/v1/doctor/profile` | Update profile |
| GET | `/api/v1/doctor/schedule` | My schedule |
| PATCH | `/api/v1/doctor/schedule` | Update schedule |
| POST | `/api/v1/doctor/leaves` | Request leave |
| GET | `/api/v1/doctor/credentials` | My credentials |
| POST | `/api/v1/doctor/credentials` | Upload credential |
| GET | `/api/v1/doctor/mentees` | My mentees (if mentor) |
| GET | `/api/v1/doctor/delegates` | Calendar delegates |
| POST | `/api/v1/doctor/delegates` | Add delegate |
| POST | `/api/v1/doctor/ai/generate-note` | AI note generation |
| POST | `/api/v1/telehealth/start` | Start telehealth session |
| POST | `/api/v1/telehealth/emergency` | Trigger emergency protocol |

---

## 📋 Implementation Checklist (Extended)

### Dashboard
- [x] Daily overview stats
- [x] Today's schedule list
- [x] Quick actions
- [ ] Notifications feed
- [ ] Recent patients

### Calendar
- [x] Month view
- [ ] Week view
- [ ] Day view
- [ ] Drag-drop rescheduling
- [ ] Block time functionality

### Patients
- [x] Patient list
- [ ] Patient detail page
- [ ] Medical history view
- [ ] Lab results tab
- [ ] Prescription history

### Consultation
- [ ] Consultation workspace
- [ ] SOAP note editor
- [ ] Vitals recording
- [ ] Quick actions panel
- [ ] Timer tracking

### Prescriptions
- [ ] Prescription form
- [ ] Medication search
- [ ] Drug interaction check
- [ ] Insurance coverage check
- [ ] Print/PDF generation
- [ ] Refill management

### Profile & Credentials
- [ ] Personal info editing
- [ ] Credential management
- [ ] Verification status
- [ ] Expiration tracking

### Schedule Management
- [ ] Weekly schedule setup
- [ ] Slot configuration
- [ ] Leave requests
- [ ] Delegate access

### Onboarding
- [ ] Credential intake
- [ ] Profile configuration
- [ ] Compliance training
- [ ] Sandbox mode

### Clinical AI
- [ ] Note generation
- [ ] Diagnosis suggestions
- [ ] Drug interaction alerts
- [ ] Version history

### Telehealth
- [ ] Video call interface
- [ ] Screen sharing
- [ ] Emergency protocol
- [ ] Session recording

### Mentorship
- [ ] Mentee dashboard
- [ ] Note review
- [ ] Case conferences

---

## 🔗 Related Documentation

- [05_ADMIN_DASHBOARD.md](./05_ADMIN_DASHBOARD.md) - Admin features
- [07_STAFF_WORKSPACE.md](./07_STAFF_WORKSPACE.md) - Staff features
- [08_PATIENT_PORTAL.md](./08_PATIENT_PORTAL.md) - Patient features
