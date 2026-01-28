# Athaarva Design System
## Comprehensive Design System Documentation

> **Version:** 1.0.0  
> **Last Updated:** January 16, 2026  
> **Based on:** 60 Reference Designs Analysis (Zendenta/Healthcare UI Kit)

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Layout System](#layout-system)
3. [Typography](#typography)
4. [Color System](#color-system)
5. [Spacing & Sizing](#spacing--sizing)
6. [Component Library](#component-library)
7. [Motion & Animation](#motion--animation)
8. [Accessibility](#accessibility)
9. [Responsive Design](#responsive-design)
10. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

### Core Values (Extracted from Reference Analysis)

Based on deep analysis of all 60 reference images, the following design principles emerged:

#### 1. **Calm Professionalism**
Healthcare applications must instill trust and reduce anxiety. The design prioritizes:
- Soft, muted color palettes over harsh contrasts
- Generous white space for breathing room
- Rounded corners for approachability
- **DO:** Use soft shadows, gradual transitions
- **DON'T:** Use jarring animations, aggressive red alerts

#### 2. **Information Hierarchy First**
Data-heavy dashboards require clear visual hierarchy:
- Primary actions are visually dominant
- Secondary information fades appropriately
- Critical data (appointments, alerts) is immediately visible
- **DO:** Use typography weight and color to establish hierarchy
- **DON'T:** Make everything equally prominent

#### 3. **Progressive Disclosure**
Complex workflows are broken into digestible steps:
- Multi-step wizards for onboarding
- Collapsible sections for detailed information
- Modal overlays for focused tasks
- **DO:** Show only relevant options at each step
- **DON'T:** Overwhelm users with all options at once

#### 4. **Consistency Over Creativity**
Predictable patterns reduce cognitive load:
- Same components behave identically everywhere
- Consistent placement of navigation, actions, content
- Unified interaction patterns
- **DO:** Reuse established patterns
- **DON'T:** Invent new UI for the sake of variety

#### 5. **Accessible by Default**
Healthcare serves diverse users including elderly patients:
- High contrast text on all backgrounds
- Large touch targets (minimum 44px)
- Clear focus states for keyboard navigation
- **DO:** Test with screen readers, color blindness simulators
- **DON'T:** Rely solely on color for information

#### 6. **Efficiency for Professionals**
Staff use the system repeatedly; optimize for power users:
- Keyboard shortcuts for common actions
- Dense information display options
- Quick actions and bulk operations
- **DO:** Provide shortcuts, remember preferences
- **DON'T:** Add unnecessary confirmation dialogs

#### 7. **Delightful Yet Professional**
Subtle polish that doesn't compromise seriousness:
- Micro-interactions that confirm actions
- Smooth state transitions
- Thoughtful empty states
- **DO:** Add polish that improves clarity
- **DON'T:** Add animations that slow down workflows

---

## Layout System

### Grid System

Based on the reference images, the layout uses a **12-column grid** system:

```
┌────────────────────────────────────────────────────────────────┐
│ 0        264│292                                    1412  1440 │
│             │                                              │
│  SIDEBAR    │            MAIN CONTENT AREA                 │
│  (264px)    │         (12 columns, 20px gutter)            │
│             │                                              │
│   Fixed     │              Fluid                           │
└────────────────────────────────────────────────────────────────┘
```

#### Grid Specifications
| Property | Value |
|----------|-------|
| Max Content Width | 1440px |
| Sidebar Width | 264px (collapsible to 64px) |
| Content Area | 1120px (max) |
| Column Count | 12 |
| Gutter Width | 20px |
| Margin (Desktop) | 28px |
| Margin (Mobile) | 16px |

### Layout Archetypes

#### 1. **Dashboard Layout** (Most Common)
Used for: Main dashboard, analytics, overview pages

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Sidebar Navigation                    [User Profile]│
│ ─────────────────────────────────────────────────────────── │
│ │ Dashboard    │ Page Title                    [+ Action]  │
│ │ Reservations │ ─────────────────────────────────────────│
│ │ Patients     │ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│ │ Treatments   │ │ Stat    │ │ Stat    │ │ Stat    │      │
│ │ Staff List   │ │ Card    │ │ Card    │ │ Card    │      │
│ │ ─────────── │ └─────────┘ └─────────┘ └─────────┘      │
│ │ FINANCE     │ ┌─────────────────────────────────────────┐│
│ │ Accounts    │ │                                         ││
│ │ Sales       │ │         Primary Content Area            ││
│ │ Purchases   │ │         (Charts, Tables, Cards)         ││
│ │             │ │                                         ││
│ └─────────────┘ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**When to use:** Primary workspace views, data-heavy interfaces

#### 2. **Master-Detail Layout**
Used for: Reservations, patient records, orders

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │     List View          │    Detail Panel       │
│           │ ┌─────────────────────┐│ ┌───────────────────┐ │
│           │ │ Item 1       [tag] ││ │ Detail Header     │ │
│           │ │ Item 2 ────────────││ │ ─────────────────│ │
│           │ │ Item 3 (selected)  ││ │ Tabs: Info|Bills │ │
│           │ │ Item 4             ││ │                   │ │
│           │ │ Item 5             ││ │ Content Section   │ │
│           │ └─────────────────────┘│ │                   │ │
│           │                        │ │ [Actions]         │ │
│           │                        │ └───────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** Lists with detailed information per item

#### 3. **Full-Width Content Layout**
Used for: Data tables, reports, inventory

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │                                                 │
│           │  Page Title                      [Filters] [+]  │
│           │  ───────────────────────────────────────────── │
│           │  ┌─────────────────────────────────────────────┐│
│           │  │ Name     │ Category │ Status │ Actions     ││
│           │  │──────────│──────────│────────│─────────────││
│           │  │ Row 1    │ Data     │ Active │ ⋮           ││
│           │  │ Row 2    │ Data     │ Active │ ⋮           ││
│           │  │ Row 3    │ Data     │ Pending│ ⋮           ││
│           │  └─────────────────────────────────────────────┘│
│           │                           [Pagination]          │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** Data-heavy tables, bulk management

#### 4. **Modal/Overlay Layout**
Used for: Forms, wizards, quick actions

```
┌─────────────────────────────────────────────────────────────┐
│                    (Dimmed Background)                      │
│     ┌───────────────────────────────────────────────┐      │
│     │ Modal Title                              [×]  │      │
│     │ ───────────────────────────────────────────── │      │
│     │                                               │      │
│     │  Step Indicator: ●────●────○                  │      │
│     │                                               │      │
│     │  Form Content Area                            │      │
│     │  ┌─────────────────────────────────────────┐  │      │
│     │  │ Input Field                            │  │      │
│     │  └─────────────────────────────────────────┘  │      │
│     │                                               │      │
│     │           [Cancel]        [Next →]            │      │
│     └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** Focused tasks, multi-step forms, confirmations

#### 5. **Card Grid Layout**
Used for: Accounts overview, category selection

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Section Title              [+ Add New]         │
│           │  ───────────────────────────────────────────── │
│           │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│           │  │  Icon    │ │  Icon    │ │  Icon    │        │
│           │  │  Title   │ │  Title   │ │  Title   │        │
│           │  │  $Value  │ │  $Value  │ │  $Value  │        │
│           │  │  [Menu]  │ │  [Menu]  │ │  [Menu]  │        │
│           │  └──────────┘ └──────────┘ └──────────┘        │
│           │  ┌──────────┐ ┌──────────┐                     │
│           │  │  Card 4  │ │  Card 5  │                     │
│           │  └──────────┘ └──────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** Category overviews, account management

---

## Typography

### Font Family

**Primary Font: Manrope**

Manrope was chosen for its:
- Clean, geometric letterforms
- Excellent readability at all sizes
- Modern, professional appearance
- Wide weight range (200-800)

```css
font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 48px | 700 | 1.1 | -0.02em | Hero sections only |
| H1 | 32px | 700 | 1.2 | -0.01em | Page titles |
| H2 | 24px | 600 | 1.3 | -0.01em | Section headers |
| H3 | 20px | 600 | 1.4 | 0 | Card titles, modal headers |
| H4 | 16px | 600 | 1.4 | 0 | Subsection titles |
| H5 | 14px | 600 | 1.5 | 0 | Group labels |
| Body Large | 16px | 400 | 1.6 | 0 | Primary content |
| Body | 14px | 400 | 1.5 | 0 | Default text |
| Body Small | 12px | 400 | 1.5 | 0 | Secondary info, captions |
| Caption | 11px | 500 | 1.4 | 0.02em | Labels, timestamps |
| Overline | 10px | 600 | 1.3 | 0.08em | Category labels (uppercase) |

### Typography Rules

#### Hierarchy Usage
```
Page Entry Point → H1 only (one per page)
Major Sections → H2
Card/Panel Titles → H3
Subsections → H4
Labels/Groups → H5 or Overline
```

#### Weight Usage
- **700 (Bold):** Headlines, important numbers, emphasis
- **600 (Semibold):** Subheadings, button text, labels
- **500 (Medium):** Navigation, selected states
- **400 (Regular):** Body text, descriptions

#### Do's and Don'ts

✅ **DO:**
- Use consistent heading hierarchy (H1 → H2 → H3)
- Maintain adequate line height for readability
- Use weight variation for emphasis (not underlining)

❌ **DON'T:**
- Skip heading levels (H1 → H4)
- Use more than 2 font families
- Set body text below 14px on desktop, 16px on mobile

---

## Color System

### Brand Colors

Extracted from the reference images, the color system follows a **calm, professional healthcare aesthetic**:

#### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary** | `#3B5998` | 59, 89, 152 | Primary buttons, active navigation, links |
| **Primary Light** | `#5A7FC4` | 90, 127, 196 | Hover states, backgrounds |
| **Primary Dark** | `#2D4373` | 45, 67, 115 | Pressed states, text on light |
| **Secondary** | `#20B2AA` | 32, 178, 170 | Secondary actions, accents |
| **Accent Teal** | `#06B6D4` | 6, 182, 212 | Highlights, icons |

#### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Gray 900** | `#111827` | Headings, primary text |
| **Gray 700** | `#374151` | Body text |
| **Gray 500** | `#6B7280` | Secondary text, placeholders |
| **Gray 400** | `#9CA3AF` | Disabled text, borders |
| **Gray 200** | `#E5E7EB` | Dividers, subtle borders |
| **Gray 100** | `#F3F4F6` | Background surfaces |
| **Gray 50** | `#F9FAFB` | Page background |
| **White** | `#FFFFFF` | Cards, elevated surfaces |

#### Semantic Colors

| Category | Default | Light/BG | Dark | Usage |
|----------|---------|----------|------|-------|
| **Success** | `#10B981` | `#D1FAE5` | `#047857` | Completed, positive |
| **Warning** | `#F59E0B` | `#FEF3C7` | `#D97706` | Alerts, pending |
| **Error** | `#EF4444` | `#FEE2E2` | `#DC2626` | Errors, critical |
| **Info** | `#3B82F6` | `#DBEAFE` | `#2563EB` | Information, help |

#### Status Colors (Specific to Healthcare)

| Status | Color | Background | Usage |
|--------|-------|------------|-------|
| Registered | `#3B82F6` | `#EFF6FF` | New appointments |
| Encounter | `#8B5CF6` | `#F5F3FF` | In-progress |
| Finished | `#10B981` | `#D1FAE5` | Completed |
| Cancelled | `#EF4444` | `#FEE2E2` | Cancelled |
| Unpaid | `#F59E0B` | `#FEF3C7` | Payment pending |
| Paid | `#10B981` | `#D1FAE5` | Payment complete |
| Partially Paid | `#F59E0B` | `#FEF3C7` | Partial payment |

#### Data Visualization Colors

For charts and graphs, use this ordered palette:

```
1. #3B82F6 (Blue)
2. #10B981 (Green)  
3. #F59E0B (Yellow)
4. #EF4444 (Red)
5. #8B5CF6 (Purple)
6. #EC4899 (Pink)
7. #06B6D4 (Cyan)
8. #F97316 (Orange)
```

### Color Usage Guidelines

#### Background Hierarchy
```
Page Background    → Gray 50 (#F9FAFB)
Section Background → Gray 100 (#F3F4F6)
Card Background    → White (#FFFFFF)
Elevated Surface   → White + Shadow
Active/Selected    → Primary Light (10% opacity)
```

#### Text on Backgrounds
| Background | Primary Text | Secondary Text |
|------------|--------------|----------------|
| White | Gray 900 | Gray 500 |
| Gray 50/100 | Gray 900 | Gray 500 |
| Primary | White | White (80%) |
| Dark | White | Gray 300 |

---

## Spacing & Sizing

### Spacing Scale

Based on a **4px base unit** with deliberate increments:

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0 | No spacing |
| `space-1` | 4px | Tight spacing (icon gaps) |
| `space-2` | 8px | Default gap, small padding |
| `space-3` | 12px | Input padding, list item gaps |
| `space-4` | 16px | Card padding, section gaps |
| `space-5` | 20px | Column gutters |
| `space-6` | 24px | Card internal sections |
| `space-8` | 32px | Section separators |
| `space-10` | 40px | Major sections |
| `space-12` | 48px | Page sections |
| `space-16` | 64px | Hero spacing |
| `space-20` | 80px | Full-page sections |

### Component Sizing

#### Buttons

| Size | Height | Padding H | Font Size | Icon Size |
|------|--------|-----------|-----------|-----------|
| XS | 28px | 8px | 12px | 14px |
| SM | 32px | 12px | 13px | 16px |
| MD | 40px | 16px | 14px | 18px |
| LG | 48px | 20px | 16px | 20px |
| XL | 56px | 24px | 18px | 22px |

#### Inputs

| Size | Height | Padding H | Font Size |
|------|--------|-----------|-----------|
| SM | 32px | 12px | 13px |
| MD | 40px | 14px | 14px |
| LG | 48px | 16px | 16px |

#### Icons

| Context | Size |
|---------|------|
| Inline text | 16px |
| Navigation items | 20px |
| Card icons | 24px |
| Feature icons | 32px |
| Hero icons | 48px |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0 | Hard edges (tables) |
| `radius-sm` | 4px | Inputs, small buttons |
| `radius-md` | 8px | Cards, buttons |
| `radius-lg` | 12px | Modals, large cards |
| `radius-xl` | 16px | Panels, major containers |
| `radius-2xl` | 24px | Hero sections |
| `radius-full` | 9999px | Pills, avatars |

### Shadows

| Level | Shadow | Usage |
|-------|--------|-------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift (inputs) |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Elevated cards |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Dropdowns |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Modals |
| `shadow-inner` | `inset 0 2px 4px rgba(0,0,0,0.06)` | Pressed states |

---

## Component Library

### Atoms (Base Elements)

#### Buttons

**Variants:**

| Variant | Usage | Visual |
|---------|-------|--------|
| Primary | Main actions, CTAs | Filled, primary color |
| Secondary | Supporting actions | Outlined, primary border |
| Ghost | Tertiary actions | Transparent, text only |
| Danger | Destructive actions | Filled/outlined, red |
| Success | Confirmations | Filled, green |

**States:**

```
Default → Hover → Active/Pressed → Disabled → Loading
```

| State | Visual Change |
|-------|---------------|
| Hover | 10% darker, slight shadow |
| Active | 20% darker, inset shadow |
| Disabled | 40% opacity, no interactions |
| Loading | Spinner replaces text/icon |

**Button Rules:**
- Primary: Maximum 1-2 per view
- Always have visible text (icon-only needs tooltip)
- Loading state for async actions
- Minimum width: 80px

#### Inputs

**Types:**
- Text Input
- Password (with visibility toggle)
- Search (with clear button)
- Select/Dropdown
- Textarea
- Number (with increment buttons)
- Date Picker
- File Upload

**States:**
```
Default → Focus → Filled → Error → Disabled → Read-only
```

| State | Visual |
|-------|--------|
| Default | Gray border, white background |
| Focus | Primary border, subtle glow |
| Filled | Same as default, with value |
| Error | Red border, error message below |
| Disabled | Gray background, 50% opacity |

**Input Rules:**
- Always have associated label
- Show validation inline
- Placeholders are hints, not labels
- Error messages below input, not in tooltip

#### Badges & Tags

**Types:**
| Type | Usage | Example |
|------|-------|---------|
| Status Badge | Show state | "PAID", "PENDING" |
| Count Badge | Notifications | "3", "99+" |
| Tag | Categorization | "Part-Time", "Medical" |
| Chip | Removable selection | Selected filters |

**Colors:**
- Success states: Green
- Warning/Pending: Yellow
- Error/Critical: Red
- Info/Neutral: Blue/Gray

#### Icons

Using **Lucide React** icon set for consistency:

```tsx
import { Calendar, User, Settings, Plus, Search } from "lucide-react"
```

**Icon Sizing Rules:**
- Match icon size to adjacent text
- 4px margin from text
- Use consistent stroke width (2px default)

### Molecules (Composed Elements)

#### Form Field
```
┌──────────────────────────────────────────┐
│ Label *                         [Helper] │
│ ┌──────────────────────────────────────┐ │
│ │ [Icon] Input value                   │ │
│ └──────────────────────────────────────┘ │
│ Helper text or error message             │
└──────────────────────────────────────────┘
```

#### Search Bar
```
┌──────────────────────────────────────────┐
│ [🔍] Search name or reservation ID... [×]│
└──────────────────────────────────────────┘
```

#### Card Header
```
┌──────────────────────────────────────────┐
│ [Icon] Card Title            [⋯ Actions] │
│ Optional subtitle                        │
└──────────────────────────────────────────┘
```

#### Stat Card
```
┌──────────────────────────────────────────┐
│ LABEL                                    │
│ $13,232                        [↑ 4.51%] │
│ Period: January 2022 - December 2022     │
└──────────────────────────────────────────┘
```

#### Table Row
```
┌──────────────────────────────────────────────────────────┐
│ [☐] │ [Avatar] Name │ Category │ Status │ Value │ [⋯]   │
└──────────────────────────────────────────────────────────┘
```

### Organisms (Complex Components)

#### Navigation Sidebar

```
┌───────────────────────┐
│ [Logo] Zendenta    [<]│ ← Collapse toggle
│ ───────────────────── │
│ [🏥] Avicena Clinic   │ ← Clinic selector
│     845 Euclid Ave    │
│ ───────────────────── │
│ [■] Dashboard         │ ← Active state (filled bg)
│ CLINIC                │ ← Section label
│ [□] Reservations      │
│ [□] Patients          │
│ [□] Treatments        │
│ [□] Staff List        │
│ FINANCE               │
│ [□] Accounts          │
│ [□] Sales             │
│ [□] Purchases         │
│ PHYSICAL ASSET        │
│ [□] Stocks            │
│ [□] Peripherals       │
│ ───────────────────── │
│ [□] Report            │
│ [□] Customer Support  │
└───────────────────────┘
```

**Sidebar Specifications:**
- Width: 264px (expanded), 64px (collapsed)
- Background: White
- Active item: Primary color with light background
- Section labels: Overline style, muted color
- Hover: Light gray background

#### Top Header Bar

```
┌────────────────────────────────────────────────────────────────┐
│ [<] Page Title    [🔍 Search...]  [+] [🔔] [⚙️] [👤 User ▼]   │
└────────────────────────────────────────────────────────────────┘
```

**Header Specifications:**
- Height: 64px
- Background: White
- Border-bottom: 1px Gray 200
- Search width: 280px
- Icon buttons: 40px square

#### Data Table

**Structure:**
```
┌────────────────────────────────────────────────────────────┐
│ [☐ All] │ Column 1 ↕ │ Column 2 ↕ │ Column 3 │ Actions    │
│─────────────────────────────────────────────────────────── │
│ [☐]     │ Data       │ Data       │ [Badge]  │ [⋯]       │
│ [☐]     │ Data       │ Data       │ [Badge]  │ [⋯]       │
│ [☐]     │ Data       │ Data       │ [Badge]  │ [⋯]       │
│─────────────────────────────────────────────────────────── │
│ Showing 1-10 of 120           │ [<] [1] [2] [3] ... [>]  │
└────────────────────────────────────────────────────────────┘
```

**Table Features:**
- Sortable columns (indicated by ↕)
- Bulk selection with checkboxes
- Row hover highlight
- Inline status badges
- Actions menu (three-dot)
- Pagination with info

#### Modal Dialog

```
┌─────────────────────────────────────────────────────────┐
│ Modal Title                                        [×]  │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│   Content Area                                          │
│   - Forms, information, confirmations                   │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                              [Cancel]    [Primary CTA]  │
└─────────────────────────────────────────────────────────┘
```

**Modal Specifications:**
- Width: 480px (small), 640px (medium), 800px (large)
- Max-height: 90vh
- Scrollable content area
- Sticky header and footer
- Backdrop: Black 50% opacity
- Border-radius: 16px
- Animation: Scale + fade in

#### Multi-Step Wizard

```
┌─────────────────────────────────────────────────────────┐
│ Add patient to waitlist                            [×]  │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│       [●]───────[○]───────[○]                          │
│     STEP 1     STEP 2     STEP 3                       │
│    Treatment  Basic Info  Habits                       │
│                                                         │
│   Current Step Content                                  │
│   ┌─────────────────────────────────────────────────┐  │
│   │ Form fields for this step                       │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                    [Cancel]  [Previous]  [Next →]       │
└─────────────────────────────────────────────────────────┘
```

**Step Indicator States:**
- Completed: ✓ Green fill
- Active: Primary color outline with icon
- Upcoming: Gray outline

#### Detail Panel (Slide-over)

```
┌───────────────────────────────────────────┐
│ Reservation ID #RSVA0011   [Edit] [×]     │
│ ───────────────────────────────────────── │
│ [Avatar] Patient Name                     │
│          Change Status: [Encounter ▼]     │
│ ───────────────────────────────────────── │
│ [Tabs: Info | Bills | History]            │
│ ───────────────────────────────────────── │
│                                           │
│ TREATMENT                                 │
│ Tooth Filling                             │
│                                           │
│ DATE AND TIME                             │
│ Fri, 16 May  |  02:00-03:00 PM            │
│                                           │
│ DENTIST                                   │
│ Dr. Putri Larasati                        │
│                                           │
│ ───────────────────────────────────────── │
│ General info                              │
│ Full Name: Christopher C. Smallwood       │
│ Phone: +1 (409)-832-3913                  │
│ Age: 24                                   │
│ Gender: Male                              │
│ ───────────────────────────────────────── │
│ [Edit Checkup ✓]  [Edit Record ✓]         │
│ [          Finish          ]               │
└───────────────────────────────────────────┘
```

---

## Motion & Animation

### Timing Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `instant` | 0ms | - | Immediate feedback |
| `fast` | 150ms | ease-out | Micro-interactions |
| `normal` | 200ms | ease-in-out | Standard transitions |
| `slow` | 300ms | ease-in-out | Modal open/close |
| `slower` | 400ms | ease-in-out | Page transitions |

### Easing Functions

```css
/* Quick response, smooth settle */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Smooth throughout */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

/* Energetic bounce */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Gentle deceleration */
--ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Patterns

#### Entrance Animations

| Element | Animation |
|---------|-----------|
| Modal | Scale 0.95→1 + Fade in |
| Dropdown | Translate Y -8px→0 + Fade |
| Toast | Translate X 100%→0 |
| Card | Fade up (Y 20px→0) |
| List items | Stagger fade in (50ms delay) |

#### State Transitions

| Interaction | Animation |
|-------------|-----------|
| Button hover | Background color 150ms |
| Button press | Scale 0.98, 100ms |
| Input focus | Border color 150ms |
| Toggle | Transform X + background 200ms |
| Accordion | Height auto, 200ms |

#### Loading States

| Type | Animation |
|------|-----------|
| Spinner | Rotate 360deg, 1s linear infinite |
| Skeleton | Shimmer gradient, 1.5s ease infinite |
| Progress | Width transition, 300ms |
| Pulse | Opacity 1→0.5, 1s ease-in-out infinite |

### Motion Principles

1. **Purposeful:** Animation should clarify, not decorate
2. **Quick:** Never make users wait for animations
3. **Natural:** Follow physics (ease-out for appearing, ease-in for leaving)
4. **Consistent:** Same actions = same animations everywhere
5. **Reducible:** Respect `prefers-reduced-motion`

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast Requirements

| Text Type | Minimum Ratio | Status |
|-----------|---------------|--------|
| Body text | 4.5:1 | ✅ Gray 700 on White = 8.59:1 |
| Large text (18px+) | 3:1 | ✅ Gray 500 on White = 4.65:1 |
| UI components | 3:1 | ✅ All interactive elements |
| Focus indicators | 3:1 | ✅ Primary color on white |

#### Keyboard Navigation

All interactive elements must be:
- Focusable via Tab key
- Activatable via Enter/Space
- Dismissable via Escape (modals, dropdowns)
- Navigable via Arrow keys (menus, selects)

**Focus Order:** Left→Right, Top→Bottom, logical sequence

**Focus Indicators:**
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

#### Touch Targets

- Minimum size: 44×44px
- Minimum spacing: 8px between targets
- Exception: Inline text links (underline instead)

#### Screen Reader Support

- All images: `alt` text or `aria-hidden`
- Icons: `aria-label` or accompanying text
- Form inputs: Associated `<label>`
- Error messages: `aria-live="polite"`
- Modals: `aria-modal="true"`, focus trap
- Loading states: `aria-busy="true"`

#### Component-Specific A11y

| Component | Requirements |
|-----------|--------------|
| Button | Role implicit, disabled state announced |
| Modal | Focus trap, Escape to close, restore focus |
| Dropdown | `aria-expanded`, arrow key navigation |
| Table | `scope` on headers, caption for context |
| Tab | `role="tablist"`, arrow key switching |
| Alert | `role="alert"` for important, `role="status"` for info |

---

## Responsive Design

### Breakpoints

| Name | Width | Typical Device |
|------|-------|----------------|
| `xs` | 0-479px | Small phones |
| `sm` | 480-639px | Large phones |
| `md` | 640-767px | Tablets portrait |
| `lg` | 768-1023px | Tablets landscape |
| `xl` | 1024-1279px | Small laptops |
| `2xl` | 1280-1535px | Desktops |
| `3xl` | 1536px+ | Large displays |

### Layout Adaptations

#### Sidebar Behavior
| Breakpoint | Behavior |
|------------|----------|
| < 1024px | Hidden by default, overlay on toggle |
| ≥ 1024px | Collapsible, always visible |

#### Grid Columns
| Breakpoint | Columns | Gutter |
|------------|---------|--------|
| < 640px | 4 | 16px |
| 640-1023px | 8 | 16px |
| ≥ 1024px | 12 | 20px |

#### Component Scaling

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Card grid | 3 columns | 1 column |
| Data table | Horizontal scroll | Card view |
| Modal | Centered, max 800px | Full-screen |
| Navigation | Sidebar | Bottom tab bar |
| Search | Inline in header | Expandable icon |

### Mobile-Specific Patterns

- **Bottom Navigation:** 5 max items, 56px height
- **Pull to Refresh:** For list views
- **Swipe Actions:** On list items (delete, archive)
- **Floating Action Button:** Primary action, bottom-right

---

## Implementation Guide

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#3B5998',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#3B5998',
          700: '#2D4373',
          800: '#1E3A5F',
          900: '#1E293B',
        },
        secondary: {
          DEFAULT: '#20B2AA',
          light: '#5EEAD4',
          dark: '#0D9488',
        },
        accent: {
          teal: '#06B6D4',
          cyan: '#22D3EE',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
          dark: '#2563EB',
        },
        // Neutrals
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['11px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'overline': ['10px', { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        'sidebar': '264px',
        'sidebar-collapsed': '64px',
        'header': '64px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.05)',
        'sm': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'DEFAULT': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        'md': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        'lg': '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        'xl': '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
        'inner': 'inset 0 2px 4px rgba(0,0,0,0.06)',
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 16px rgba(0,0,0,0.12)',
        'dropdown': '0 10px 40px rgba(0,0,0,0.12)',
        'modal': '0 25px 50px rgba(0,0,0,0.15)',
      },
      transitionDuration: {
        'instant': '0ms',
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '400ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-up': 'fadeUp 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-in-bottom': 'slideInBottom 300ms ease-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      zIndex: {
        'dropdown': '50',
        'sticky': '40',
        'fixed': '30',
        'modal-backdrop': '90',
        'modal': '100',
        'popover': '60',
        'tooltip': '70',
        'toast': '110',
      },
    },
  },
  plugins: [],
}

export default config
```

### CSS Custom Properties

```css
/* globals.css */
@layer base {
  :root {
    /* Colors */
    --color-primary: 59 89 152;
    --color-secondary: 32 178 170;
    --color-accent: 6 182 212;
    
    --color-success: 16 185 129;
    --color-warning: 245 158 11;
    --color-error: 239 68 68;
    --color-info: 59 130 246;
    
    --color-background: 249 250 251;
    --color-surface: 255 255 255;
    --color-border: 229 231 235;
    
    --color-text-primary: 17 24 39;
    --color-text-secondary: 107 114 128;
    --color-text-muted: 156 163 175;
    
    /* Spacing */
    --spacing-unit: 4px;
    
    /* Typography */
    --font-family-primary: 'Manrope', 'Inter', system-ui, sans-serif;
    
    /* Borders */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
    
    /* Transitions */
    --transition-fast: 150ms;
    --transition-normal: 200ms;
    --transition-slow: 300ms;
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .dark {
    --color-background: 17 24 39;
    --color-surface: 31 41 55;
    --color-border: 55 65 81;
    --color-text-primary: 249 250 251;
    --color-text-secondary: 156 163 175;
  }
}
```

### Component Examples

#### Button Component

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-fast rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        secondary: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        danger: "bg-error text-white hover:bg-error-dark active:bg-red-800",
        success: "bg-success text-white hover:bg-success-dark active:bg-green-800",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
        xl: "h-14 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export function Button({ className, variant, size, loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : children}
    </button>
  )
}
```

#### Card Component

```tsx
// components/ui/card.tsx
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white p-6",
        {
          'shadow-card': variant === 'default',
          'shadow-card-hover': variant === 'elevated',
          'border border-gray-200 shadow-none': variant === 'outlined',
        },
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between mb-4", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-h3 text-gray-900", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-body text-gray-700", className)} {...props} />
}
```

---

## Visual Identity Summary

### What This Product Feels Like

Based on the 60 reference images, the Athaarva Healthcare Platform should evoke:

- **Trustworthy:** Clean lines, professional typography, consistent patterns
- **Calm:** Soft color palette, generous white space, no visual noise
- **Efficient:** Dense information when needed, quick actions readily available
- **Modern:** Contemporary aesthetics without being trendy
- **Accessible:** Works for everyone, regardless of ability or tech-savviness

### What This Product Should Never Become

- **Cluttered:** Avoid cramming information; prioritize ruthlessly
- **Flashy:** No gratuitous animations or attention-seeking design
- **Inconsistent:** Same action must look the same everywhere
- **Inaccessible:** Never sacrifice usability for aesthetics
- **Dated:** Avoid trendy elements that will age poorly
- **Generic:** Maintain healthcare-specific considerations (calming, professional)

### Design Signature Elements

1. **Soft Shadows:** Subtle depth, not harsh drop shadows
2. **Rounded Corners:** 8-16px radius for approachability
3. **Teal Accents:** Primary brand color for trust and healthcare
4. **Manrope Typography:** Clean, modern, highly readable
5. **Status Badges:** Pill-shaped, color-coded for quick scanning
6. **Step Indicators:** Connected dots showing progress
7. **Card-Based Layout:** Information grouped in digestible chunks
8. **Generous Padding:** Content never touches edges

---

## Appendix

### Icon Reference (Lucide)

Common icons used throughout the system:

| Icon | Name | Usage |
|------|------|-------|
| 📊 | `LayoutDashboard` | Dashboard |
| 📅 | `Calendar` | Reservations, dates |
| 👥 | `Users` | Patients, staff |
| 🩺 | `Stethoscope` | Treatments |
| 💰 | `Wallet` | Accounts, payments |
| 📈 | `TrendingUp` | Sales, reports |
| 📦 | `Package` | Inventory, stocks |
| ⚙️ | `Settings` | Settings |
| 🔔 | `Bell` | Notifications |
| ➕ | `Plus` | Add actions |
| 🔍 | `Search` | Search |
| ✏️ | `Pencil` | Edit |
| 🗑️ | `Trash2` | Delete |
| ⋮ | `MoreVertical` | More actions |

### Status Badge Colors Quick Reference

```tsx
const statusColors = {
  // Appointment Status
  registered: { bg: 'bg-blue-100', text: 'text-blue-700' },
  encounter: { bg: 'bg-purple-100', text: 'text-purple-700' },
  finished: { bg: 'bg-green-100', text: 'text-green-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  
  // Payment Status
  paid: { bg: 'bg-green-100', text: 'text-green-700' },
  unpaid: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  partiallyPaid: { bg: 'bg-orange-100', text: 'text-orange-700' },
  
  // General Status
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  
  // Staff Type
  fullTime: { bg: 'bg-blue-100', text: 'text-blue-700' },
  partTime: { bg: 'bg-pink-100', text: 'text-pink-700' },
  
  // Stock Status
  inStock: { bg: 'bg-green-100', text: 'text-green-700' },
  lowStock: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  outOfStock: { bg: 'bg-red-100', text: 'text-red-700' },
}
```

---

*This design system is a living document. Update it as the product evolves.*
