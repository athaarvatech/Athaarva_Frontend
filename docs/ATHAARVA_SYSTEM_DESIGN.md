# Athaarva Healthcare Platform - Complete System Design Document

> **Version:** 1.0.0  
> **Last Updated:** January 3, 2026  
> **Platform:** Athaarva Healthcare Management System  
> **Framework:** Next.js 14+ with TypeScript, Tailwind CSS, Shadcn/UI

---

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Color System](#color-system)
4. [Typography System](#typography-system)
5. [Spacing & Layout System](#spacing--layout-system)
6. [Shadow System](#shadow-system)
7. [Border Radius System](#border-radius-system)
8. [Z-Index System](#z-index-system)
9. [Animation System](#animation-system)
10. [Component Library](#component-library)
11. [Template System](#template-system)
12. [Page Layouts](#page-layouts)
13. [Icon Library](#icon-library)
14. [Responsive Design](#responsive-design)
15. [Accessibility Guidelines](#accessibility-guidelines)
16. [AI Chatbot Design Generation Guidelines](#ai-chatbot-design-generation-guidelines)

---

## Overview

The Athaarva Healthcare Platform is a comprehensive multi-tenant healthcare management system featuring:

- **Hospital Onboarding System** - Template-based website generation for healthcare providers
- **Doctor Dashboard** - Complete physician management interface
- **Patient Portal** - Patient-facing healthcare management
- **Admin Panels** - Hospital and super admin management interfaces

The design system is built on **Tailwind CSS** with **Shadcn/UI** components following the **New York** style variant.

---

## Design Philosophy

### Core Principles

1. **Healthcare-First Design** - Clean, trustworthy, and professional aesthetics
2. **Accessibility** - WCAG 2.1 AA compliant components
3. **Consistency** - Unified design language across all modules
4. **Performance** - Optimized components with minimal re-renders
5. **Scalability** - Multi-tenant architecture with customizable themes

### Design Language

- **Modern & Clean** - Minimal visual noise, clear hierarchy
- **Trustworthy** - Professional colors (teals, blues) that convey trust
- **Warm & Approachable** - Rounded corners, soft shadows
- **Responsive** - Mobile-first approach with adaptive layouts

---

## Color System

### Primary Healthcare Colors

```css
:root {
  /* Primary Healthcare Brand Colors */
  --healthcare-primary: #007c7c; /* Emerald Green - Main brand */
  --healthcare-secondary: #20b2aa; /* Light Sea Green - Secondary */
  --healthcare-teal: #008080; /* Teal - Accent */
  --healthcare-emerald: #50c878; /* Emerald - Success states */
  --healthcare-indigo: #4f46e5; /* Indigo - Accent/Links */

  /* Neutral Colors */
  --healthcare-cool-white: #fafafa; /* Background */
  --healthcare-soft-grey: #f3f4f6; /* Surface */
  --healthcare-dark: #1f2937; /* Text primary */
}
```

### Zendenta Legacy Colors

```css
:root {
  --color-primary: #06b6d4; /* Cyan/Teal - Primary actions */
  --color-primary-light: #ecfeff; /* Light cyan - Hover states */
  --color-secondary: #4a6572; /* Slate - Secondary text */
  --color-accent: #f9a826; /* Orange/Amber - Highlights */
  --color-positive: #34d399; /* Emerald - Success */
  --color-danger: #f87171; /* Red - Error/Danger */
  --color-warning: #fbbf24; /* Amber - Warning */
  --color-background: #ffffff; /* White - Background */
  --color-surface: #f9fafb; /* Gray 50 - Surface */
}
```

### Template-Specific Color Schemes

#### Professional Template (Blue Theme)

```typescript
const professionalColors = {
  primary: "#246AFE", // Professional Blue
  secondary: "#1a5ad4", // Hover Blue
  accent: "#EBF0FE", // Light Blue Background
  textPrimary: "#0B0A0A", // Near Black
  textSecondary: "#4B5563", // Gray
  lightBg: "#FFFFFF", // White
  border: "#E5E7EB", // Light Gray
};
```

#### Healthcare Template (Teal Theme)

```typescript
const healthcareColors = {
  primary: "#14b8a6", // Teal
  primaryDark: "#0d9488", // Teal Dark
  textPrimary: "#0f172a", // Slate 900
  textSecondary: "#64748b", // Slate 500
  lightBg: "#f0fdfa", // Teal 50
  white: "#FFFFFF", // White
  border: "#e2e8f0", // Slate 200
  accent: "#14b8a6", // Teal
};
```

#### Patient Portal Colors

```typescript
const patientPortalColors = {
  primary: "#006D77", // Deep Teal
  secondary: "#2A9D8F", // Sea Green
  accent: "#E8F3F4", // Light Teal
  success: "#10B981", // Emerald
  warning: "#F59E0B", // Amber
  error: "#EF4444", // Red
  background: "#F9FAFB", // Gray 50
};
```

### Semantic Colors

| Purpose   | Light Mode            | Usage                                 |
| --------- | --------------------- | ------------------------------------- |
| Primary   | `#007c7c`             | Primary buttons, links, focus states  |
| Secondary | `#20b2aa`             | Secondary actions, hover states       |
| Success   | `#34d399` / `#10b981` | Success messages, positive indicators |
| Warning   | `#fbbf24` / `#f59e0b` | Warning states, pending actions       |
| Error     | `#f87171` / `#ef4444` | Error messages, destructive actions   |
| Info      | `#06b6d4`             | Informational states                  |
| Neutral   | `#6b7280`             | Disabled states, subtle text          |

### Status Colors (Medical Context)

```typescript
const statusColors = {
  stable: "bg-emerald-100 text-emerald-800 border-emerald-200",
  needsAttention: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-rose-100 text-rose-800 border-rose-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  noShow: "bg-orange-100 text-orange-800 border-orange-200",
};
```

---

## Typography System

### Font Families

```css
:root {
  /* Primary Fonts */
  --font-sans: "Inter", "Poppins", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Inter", "Satoshi", "Poppins", sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
}
```

### Font Imports

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap");
```

### Type Scale

| Element | Size                     | Weight  | Line Height | Letter Spacing |
| ------- | ------------------------ | ------- | ----------- | -------------- |
| H1      | `text-4xl` to `text-6xl` | 700-800 | 1.2         | `-0.025em`     |
| H2      | `text-3xl` to `text-4xl` | 700     | 1.2         | `-0.025em`     |
| H3      | `text-2xl` to `text-3xl` | 600-700 | 1.3         | `-0.02em`      |
| H4      | `text-xl` to `text-2xl`  | 600     | 1.4         | `-0.015em`     |
| H5      | `text-lg`                | 600     | 1.4         | normal         |
| H6      | `text-base`              | 600     | 1.5         | normal         |
| Body    | `text-base` (16px)       | 400-500 | 1.6         | normal         |
| Small   | `text-sm` (14px)         | 400-500 | 1.5         | normal         |
| XS      | `text-xs` (12px)         | 400-500 | 1.4         | normal         |

### Typography Utilities

```css
/* Heading styles */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Inter", "Poppins", sans-serif;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

/* Body text */
body {
  font-family: "Inter", "Poppins", sans-serif;
  color: #1f2937;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Spacing & Layout System

### Spacing Scale (Tailwind Default)

| Token | Value | Usage            |
| ----- | ----- | ---------------- |
| `0`   | 0px   | Reset            |
| `1`   | 4px   | Minimal spacing  |
| `2`   | 8px   | Tight spacing    |
| `3`   | 12px  | Compact spacing  |
| `4`   | 16px  | Default spacing  |
| `5`   | 20px  | Comfortable      |
| `6`   | 24px  | Standard section |
| `8`   | 32px  | Large section    |
| `10`  | 40px  | Section gaps     |
| `12`  | 48px  | Major sections   |
| `16`  | 64px  | Page sections    |
| `20`  | 80px  | Hero sections    |
| `24`  | 96px  | Major breaks     |

### Container Widths

```css
.responsive-container {
  @apply w-full px-4 mx-auto;
  @apply sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px];
}
```

### Grid System

```typescript
// Common grid patterns
const gridPatterns = {
  twoColumn: "grid grid-cols-1 md:grid-cols-2 gap-6",
  threeColumn: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  fourColumn: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
  dashboard: "grid grid-cols-1 lg:grid-cols-3 gap-6",
  sidebar: "grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6",
};
```

---

## Shadow System

### CSS Variables

```css
:root {
  --healthcare-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --healthcare-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --healthcare-shadow-md: 0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 5px -1px
      rgba(0, 0, 0, 0.06);
  --healthcare-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px
      rgba(0, 0, 0, 0.05);
  --healthcare-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px
      rgba(0, 0, 0, 0.04);
}
```

### Tailwind Extensions

```typescript
// tailwind.config.ts
boxShadow: {
  'zendenta': '0 4px 12px rgba(0, 0, 0, 0.05)',
  'zendenta-lg': '0 10px 25px rgba(0, 0, 0, 0.1)',
  'healthcare-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
  'healthcare': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'healthcare-md': '0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 5px -1px rgba(0, 0, 0, 0.06)',
  'healthcare-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
}
```

### Shadow Usage Guidelines

| Shadow      | Use Case                           |
| ----------- | ---------------------------------- |
| `shadow-sm` | Subtle elevation for cards at rest |
| `shadow`    | Default cards, buttons             |
| `shadow-md` | Elevated cards, dropdowns          |
| `shadow-lg` | Modals, floating elements          |
| `shadow-xl` | Overlays, prominent CTAs           |

---

## Border Radius System

### CSS Variables

```css
:root {
  --healthcare-radius-sm: 0.375rem; /* 6px */
  --healthcare-radius: 0.5rem; /* 8px */
  --healthcare-radius-md: 0.75rem; /* 12px */
  --healthcare-radius-lg: 1rem; /* 16px */
  --healthcare-radius-xl: 1.5rem; /* 24px */
  --healthcare-radius-2xl: 2rem; /* 32px */
  --healthcare-radius-3xl: 3rem; /* 48px */
}
```

### Tailwind Extensions

```typescript
borderRadius: {
  'zendenta': '10px',
  'healthcare-sm': '0.375rem',
  'healthcare': '0.5rem',
  'healthcare-md': '0.75rem',
  'healthcare-lg': '1rem',
  'healthcare-xl': '1.5rem',
}
```

### Radius Usage Guidelines

| Radius               | Use Case         |
| -------------------- | ---------------- |
| `rounded-sm` (2px)   | Minimal rounding |
| `rounded` (4px)      | Buttons, inputs  |
| `rounded-md` (6px)   | Cards, panels    |
| `rounded-lg` (8px)   | Modal content    |
| `rounded-xl` (12px)  | Large cards      |
| `rounded-2xl` (16px) | Hero sections    |
| `rounded-full`       | Avatars, pills   |

---

## Z-Index System

### CSS Variables

```css
:root {
  --healthcare-z-sticky: 30;
  --healthcare-z-dropdown: 50;
  --healthcare-z-tooltip: 60;
  --healthcare-z-modal: 100;
}
```

### Z-Index Scale

| Layer          | Z-Index | Usage                    |
| -------------- | ------- | ------------------------ |
| Base           | `0`     | Default stacking         |
| Elevated       | `10`    | Slightly raised elements |
| Sticky         | `30`    | Sticky headers           |
| Dropdown       | `50`    | Dropdown menus, popovers |
| Tooltip        | `60`    | Tooltips                 |
| Modal Backdrop | `100`   | Modal overlays           |
| Modal Content  | `110`   | Modal content            |
| Toast          | `150`   | Toast notifications      |

---

## Animation System

### Keyframe Animations

```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide In Left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Float */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Pulse Glow */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(0, 124, 124, 0.1);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 124, 124, 0.3);
  }
}

/* Fade In Down */
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Animation Utility Classes

```css
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out;
}
.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out;
}
.animate-scale-in {
  animation: scaleIn 0.6s ease-out;
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
.animate-fade-in-down {
  animation: fadeInDown 0.5s ease-out;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-slide-in {
  animation: slideInRight 0.3s ease-out;
}
```

### Transition Durations

```typescript
transitionDuration: {
  '400': '400ms',
}
```

---

## Component Library

### Core UI Components (Shadcn/UI)

All components are built with Radix UI primitives and styled with Tailwind CSS.

#### Button Component

```typescript
// Variants
const buttonVariants = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

// Sizes
const buttonSizes = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
};
```

#### Card Component

```typescript
// Card structure
Card: "rounded-xl border bg-card text-card-foreground shadow";
CardHeader: "flex flex-col space-y-1.5 p-6";
CardTitle: "font-semibold leading-none tracking-tight";
CardDescription: "text-sm text-muted-foreground";
CardContent: "p-6 pt-0";
CardFooter: "flex items-center p-6 pt-0";
```

#### Input Component

```typescript
// Input styling
Input: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
```

#### Badge Component

```typescript
// Badge variants
const badgeVariants = {
  default:
    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  outline: "text-foreground",
};
```

#### Dialog/Modal Component

```typescript
// Dialog styling
DialogOverlay: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm";
DialogContent: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg rounded-xl";
```

#### Select Component

```typescript
// Select styling
SelectTrigger: "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm";
SelectContent: "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white text-slate-800 shadow-md";
```

#### Tabs Component

```typescript
// Tabs styling
TabsList: "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground";
TabsTrigger: "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium";
TabsContent: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2";
```

#### Avatar Component

```typescript
// Avatar styling
Avatar: "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full";
AvatarImage: "aspect-square h-full w-full";
AvatarFallback: "flex h-full w-full items-center justify-center rounded-full bg-muted";
```

#### Progress Component

```typescript
// Progress styling
Progress: "relative h-2 w-full overflow-hidden rounded-full bg-primary/20";
ProgressIndicator: "h-full w-full flex-1 bg-primary transition-all";
```

#### Switch Component

```typescript
// Switch styling
Switch: "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input";
```

#### Toast Component

```typescript
// Toast variants
const toastVariants = {
  default: "border bg-background text-foreground",
  destructive:
    "destructive group border-destructive bg-destructive text-destructive-foreground",
};
```

### Healthcare-Specific Components

#### Patient Card

```typescript
// Standard patient card styling
const patientCardStyle = `
  hover:shadow-lg transition-shadow 
  border border-gray-200 
  rounded-lg
`;
```

#### Appointment Type Colors

```typescript
const appointmentTypeColors = {
  consultation: "bg-blue-100 text-blue-800 border-blue-200",
  checkUp: "bg-emerald-100 text-emerald-800 border-emerald-200",
  followUp: "bg-teal-100 text-teal-800 border-teal-200",
  emergency: "bg-red-100 text-red-800 border-red-200",
};
```

#### Health Status Badges

```typescript
const healthStatusColors = {
  stable: "bg-emerald-100 text-emerald-800",
  needsAttention: "bg-amber-100 text-amber-800",
  critical: "bg-rose-100 text-rose-800",
};
```

---

## Template System

### Template Blueprint Structure

```typescript
interface TemplateBlueprint {
  id: string;

  // Branding images
  images?: {
    logo?: UploadedImageData;
    heroImage?: UploadedImageData;
    heroVideo?: UploadedImageData;
    doctorAvatars?: UploadedImageData[];
    facilityImages?: UploadedImageData[];
  };

  // Hero section
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: Array<{ label: string; value: string }>;
    heroImageAlt: string;
  };

  // Color palette
  palette: {
    background: string;
    surface: string;
    accent: string;
    accentMuted: string;
    text: string;
    textMuted: string;
    gradient: string;
  };

  // Typography
  typography: {
    heading: string;
    body: string;
  };

  // Content sections
  specialties: Array<{
    icon: string;
    title?: string;
    name?: string;
    description: string;
  }>;
  differentiators: Array<{ title: string; description: string; icon?: string }>;
  doctors: Array<{
    name: string;
    specialty: string;
    description: string;
    mediaLabel: string;
    photo?: UploadedImageData;
  }>;
  testimonials: Array<{
    quote: string;
    patient?: string;
    name?: string;
    procedure?: string;
    rating?: number;
  }>;
  facilityHighlights: Array<{
    title: string;
    copy: string;
    image?: UploadedImageData;
  }>;
  programs: Array<{ title: string; meta: string; description: string }>;

  // Footer
  footer: {
    tagline?: string;
    copyright?: string;
    links?: Array<{ label: string; href: string }>;
    contact?: { phone: string; email: string; location: string };
    quickLinks?: string[];
  };

  // Optional sections
  about?: {
    title: string;
    subtitle: string;
    description: string;
    highlights: Array<{ label: string; value: string }>;
  };
  services?: Array<{ name: string; icon: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}
```

### Available Templates

#### 1. Modern Healthcare Template

- **ID:** `modern-healthcare`
- **Theme:** Teal gradient (#0E9F9F to #2563EB)
- **Typography:** Space Grotesk + Inter
- **Best for:** High-tech hospitals, research centers

#### 2. Telehealth First Template

- **ID:** `telehealth-first`
- **Theme:** Blue gradient (#2563EB to #06B6D4)
- **Typography:** Sora + Inter
- **Best for:** Virtual care, telemedicine platforms

#### 3. Heritage Template

- **ID:** `heritage`
- **Theme:** Warm amber (#B45309)
- **Typography:** Playfair Display + Source Sans Pro
- **Best for:** Traditional hospitals, faith-based institutions

#### 4. Ahtarva Professional Template

- **ID:** `ahtarva-professional`
- **Theme:** Professional Blue (#246AFE)
- **Typography:** Manrope + Inter
- **Best for:** Multi-specialty hospitals, premium healthcare

#### 5. Ahtarva Healthcare Template

- **ID:** `ahtarva-healthcare`
- **Theme:** Teal (#14b8a6)
- **Typography:** Inter + system fonts
- **Best for:** General hospitals, clinics

---

## Page Layouts

### Dashboard Layout (Doctor/Patient)

```typescript
// Grid structure
const dashboardLayout = {
  container: "container mx-auto p-4 md:p-6",
  welcomeBanner:
    "bg-gradient-to-r from-[#006D77] to-[#2A9D8F] rounded-xl p-6 mb-6 text-white shadow-lg",
  mainGrid: "grid grid-cols-1 lg:grid-cols-3 gap-6",
  leftColumn: "lg:col-span-2 space-y-6",
  rightColumn: "space-y-6",
};
```

### Onboarding Layout

```typescript
// Template preview structure
const onboardingLayout = {
  canvas: "min-h-screen bg-white overflow-hidden",
  header: "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
  section: "relative min-h-screen pt-20 overflow-hidden",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
};
```

### Widget Layout Structure

```typescript
// Dashboard widgets
const widgetConfig = {
  sizes: {
    small: "col-span-1",
    medium: "col-span-1 lg:col-span-2",
    large: "col-span-1 lg:col-span-3",
  },
  card: "border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow",
  header: "pb-2 flex flex-row items-center justify-between",
  title: "text-lg font-semibold flex items-center text-[#006D77]",
};
```

---

## Icon Library

### Primary Icon Set: Lucide React

All icons are imported from `lucide-react`.

### Common Healthcare Icons

```typescript
// Medical icons
import {
  Stethoscope,
  Heart,
  HeartPulse,
  Activity,
  Brain,
  Bone,
  Baby,
  Ribbon,
  Pill,
  Syringe,
  Thermometer,
  Ambulance,
  Hospital,
  Building,
} from "lucide-react";

// Navigation icons
import {
  Calendar,
  Clock,
  Bell,
  MessageCircle,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// Action icons
import {
  Plus,
  Edit,
  Trash,
  Download,
  Upload,
  Share,
  Copy,
  Check,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";

// User icons
import {
  User,
  Users,
  UserPlus,
  UserCheck,
  Settings,
  LogOut,
} from "lucide-react";

// Communication icons
import { Phone, Mail, MapPin, Video, Mic } from "lucide-react";

// Social icons
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
```

### Icon Sizing Standards

| Context       | Size Class                 | Pixel Size |
| ------------- | -------------------------- | ---------- |
| Inline text   | `h-4 w-4`                  | 16px       |
| Buttons       | `h-4 w-4` to `h-5 w-5`     | 16-20px    |
| Cards         | `h-5 w-5` to `h-6 w-6`     | 20-24px    |
| Headers       | `h-6 w-6` to `h-8 w-8`     | 24-32px    |
| Hero sections | `h-8 w-8` to `h-12 w-12`   | 32-48px    |
| Feature icons | `h-10 w-10` to `h-16 w-16` | 40-64px    |

---

## Responsive Design

### Breakpoints (Tailwind Default)

| Breakpoint | Min Width | Common Usage     |
| ---------- | --------- | ---------------- |
| `sm`       | 640px     | Mobile landscape |
| `md`       | 768px     | Tablets          |
| `lg`       | 1024px    | Small laptops    |
| `xl`       | 1280px    | Desktops         |
| `2xl`      | 1536px    | Large screens    |

### Device Scaling (Templates)

```typescript
const deviceScale = {
  desktop: 1,
  tablet: 0.92,
  mobile: 0.7,
};
```

### Responsive Patterns

```typescript
// Common responsive patterns
const responsivePatterns = {
  // Stack on mobile, side-by-side on desktop
  stackToRow: "flex flex-col md:flex-row",

  // Single column to multi-column
  gridResponsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",

  // Hide on mobile
  hideOnMobile: "hidden md:block",

  // Show only on mobile
  showOnMobile: "md:hidden",

  // Text scaling
  responsiveText: "text-2xl md:text-3xl lg:text-4xl",

  // Padding scaling
  responsivePadding: "p-4 md:p-6 lg:p-8",
};
```

---

## Accessibility Guidelines

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Color Contrast

- Text on backgrounds: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus indicators

### ARIA Patterns

```typescript
// Dialog accessibility
<DialogPrimitive.Close className="absolute right-4 top-4">
  <X className="h-4 w-4" />
  <span className="sr-only">Close</span>
</DialogPrimitive.Close>

// Button loading state
<Button disabled={isLoading}>
  {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
</Button>
```

### Keyboard Navigation

- All interactive elements are focusable
- Tab order follows visual flow
- Escape closes modals/dropdowns
- Enter/Space activates buttons

---

## AI Chatbot Design Generation Guidelines

When generating designs for the Athaarva platform, follow these principles:

### Color Selection

```typescript
// Use established color palettes
const recommendedPalettes = {
  // For medical/healthcare emphasis
  healthcare: {
    primary: "#007c7c",
    secondary: "#20b2aa",
    accent: "#50c878",
  },

  // For professional/corporate
  professional: {
    primary: "#246AFE",
    secondary: "#1a5ad4",
    accent: "#EBF0FE",
  },

  // For warm/traditional
  heritage: {
    primary: "#B45309",
    secondary: "#92400E",
    accent: "#FDE68A",
  },
};
```

### Component Selection Rules

1. **Cards**: Always use `rounded-xl border shadow` for cards
2. **Buttons**: Primary actions use `bg-primary text-white`, secondary use `border border-input`
3. **Inputs**: Use standard `Input` component with `rounded-md border`
4. **Status indicators**: Use semantic badge colors (emerald=success, amber=warning, rose=error)

### Layout Rules

1. **Container max-width**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
2. **Section spacing**: `py-12 lg:py-20` for major sections
3. **Card gaps**: `gap-4` for tight, `gap-6` for standard, `gap-8` for loose
4. **Grid columns**: 1 on mobile → 2 on tablet → 3-4 on desktop

### Typography Rules

1. **Headlines**: Bold (700-800), tight letter-spacing, line-height 1.2
2. **Body text**: Regular (400-500), relaxed line-height 1.6
3. **Captions/Labels**: Small text, medium weight (500)

### Animation Rules

1. **Entry animations**: Use `fadeInUp` or `scaleIn` with 0.6-0.8s duration
2. **Hover effects**: `transition-all duration-300`
3. **Interactive feedback**: Scale up slightly (`hover:scale-105`)
4. **Loading states**: Use `animate-spin` for loaders

### Healthcare-Specific Design Patterns

```typescript
// Dashboard welcome banner
const welcomeBanner =
  "bg-gradient-to-r from-[#006D77] to-[#2A9D8F] rounded-xl p-6 text-white shadow-lg";

// Health status card
const healthCard = "border rounded-lg p-3 hover:bg-gray-50 transition-colors";

// Doctor card
const doctorCard =
  "hover:shadow-lg transition-shadow border border-gray-200 rounded-lg";

// Appointment card
const appointmentCard =
  "border-l-4 rounded-lg p-4 hover:shadow-md transition-shadow";

// Stats display
const statsCard = "text-center p-6 rounded-xl bg-white shadow-sm";
```

### Template Section Structure

```typescript
// Standard section template
const sectionTemplate = {
  wrapper: "py-16 lg:py-24",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  header: "text-center mb-12",
  title: "text-3xl md:text-4xl font-bold mb-4",
  subtitle: "text-lg text-gray-600 max-w-2xl mx-auto",
  content: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
};
```

---

## Quick Reference

### Essential Tailwind Classes

```typescript
// Common class combinations
const essentialClasses = {
  // Card base
  card: "rounded-xl border bg-white shadow-sm",

  // Primary button
  btnPrimary:
    "bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors",

  // Secondary button
  btnSecondary:
    "border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors",

  // Input field
  input:
    "w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary",

  // Badge
  badge:
    "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",

  // Avatar
  avatar: "h-10 w-10 rounded-full overflow-hidden",

  // Icon button
  iconBtn: "p-2 rounded-md hover:bg-gray-100 transition-colors",

  // Link
  link: "text-primary hover:underline",

  // Muted text
  muted: "text-sm text-gray-500",

  // Section title
  sectionTitle: "text-2xl font-bold text-gray-900",

  // Container
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
};
```

### Import Statements

```typescript
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";

// Icons
import { Icon } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";
```

---

## Version History

| Version | Date            | Changes                             |
| ------- | --------------- | ----------------------------------- |
| 1.0.0   | January 3, 2026 | Initial system design documentation |

---

_This document serves as the authoritative reference for the Athaarva Healthcare Platform design system. All new components and features should adhere to these guidelines for consistency and maintainability._
