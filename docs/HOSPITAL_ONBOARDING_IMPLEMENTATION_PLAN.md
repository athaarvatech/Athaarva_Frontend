# Hospital Onboarding & Authentication Flow - Implementation Plan

> **Project**: Athaarva Healthcare Platform
> **Created**: January 11, 2026
> **Last Updated**: Phase 7 Implementation Complete
> **Status**: Phase 7 Complete - All Frontend Phases Done

---

## Implementation Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | ✅ Complete | Super-Admin MFA with OTP |
| Phase 2 | ✅ Complete | Token-based onboarding |
| Phase 3 | ✅ Complete | Onboarding UX components |
| Phase 4 | ✅ Complete | Login page builder |
| Phase 5 | ✅ Complete | Clinical document branding |
| Phase 6 | ✅ Complete | Admin setup & domain config |
| Phase 7 | ✅ Complete | Hospital selector & login flow |

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [User Decisions & Configurations](#user-decisions--configurations)
3. [Current State Analysis](#current-state-analysis)
4. [Phase 1: Super-Admin Security Hardening](#phase-1-super-admin-security-hardening)
5. [Phase 2: Secure Token-Based Onboarding](#phase-2-secure-token-based-onboarding)
6. [Phase 3: Onboarding UX Redesign](#phase-3-onboarding-ux-redesign)
7. [Phase 4: Custom Login Page Builder](#phase-4-custom-login-page-builder)
8. [Phase 5: Clinical Document Branding](#phase-5-clinical-document-branding)
9. [Phase 6: Admin Setup & Domain Configuration](#phase-6-admin-setup--domain-configuration)
10. [Phase 7: Hospital Selector & Login Flow](#phase-7-hospital-selector--login-flow)
11. [Database Schema Requirements](#database-schema-requirements)
12. [API Endpoints Summary](#api-endpoints-summary)
13. [File Structure](#file-structure)
14. [Implementation Priority & Dependencies](#implementation-priority--dependencies)

---

## Executive Summary

This document outlines the complete implementation plan for the hospital onboarding and authentication flow in the Athaarva Healthcare Platform. The goal is to create a secure, user-friendly, and fully branded experience from invitation to hospital operation.

### Key Objectives

- **Security**: Hidden super-admin, token-enforced onboarding, Email OTP-based 2FA
- **UX**: Welcome popup, guided walkthrough, AI-powered content suggestions
- **Branding**: Complete customization with templates, AI image/text generation
- **Multi-tenancy**: Subdomain-based routing with wildcard DNS validation
- **Documents**: Branded prescriptions, certificates, invoices

---

## User Decisions & Configurations

| Decision Point | User Choice | Implementation Notes |
|----------------|-------------|---------------------|
| **2FA Method** | Email OTP | Use existing OTP infrastructure, 6-digit codes, 15-min expiry |
| **AI Integration** | Azure GPT APIs | Image generation + text content suggestions for templates |
| **Super-Admin Security** | Best practices | Hidden route + IP whitelist + Email OTP |
| **DNS Configuration** | `*.athaarva.com` wildcard | Validate subdomains against `tenant_mgmt.tenants` table |
| **Hospital Selector** | Best practices | Card-based grid with search, recent hospitals, branded logos |

---

## Current State Analysis

### What's Working ✅

| Component | Status | Location |
|-----------|--------|----------|
| Super Admin Dashboard | Functional | `app/super-admin/` |
| Invitation Creation | Working | `app/super-admin/leads/` |
| Tenant CRUD Operations | Working | Backend `super_admin.py` |
| Hospital Selector UI | Basic | `app/auth/selector/` |
| Per-Hospital Login Page | Basic | `app/auth/hospital/[subdomain]/` |
| 8-Step Onboarding Wizard | UI Complete | `app/onboarding/hospital/` |
| Template Gallery | Visual Only | `widgets/TemplateGallery.tsx` |

### What Needs Fixing ❌

| Issue | Current State | Required State |
|-------|---------------|----------------|
| Token Validation | **BYPASSED** in dev mode | Strict enforcement always |
| Super-Admin Access | Public route with password | Hidden + IP whitelist + OTP |
| Template Preview | CSS issues, not fully visible | Full-width responsive preview |
| Branding Persistence | Partial, lost on refresh | Auto-save to backend |
| Welcome Experience | None | Popup + walkthrough |
| Image Toolbox | None | AI generation + stock + upload |
| Custom Login Builder | None | Full visual editor |
| Domain Validation | None | Subdomain must exist in DB |
| Post-Onboarding Flow | Broken redirect | Smooth transition to admin setup |

---

## Phase 1: Super-Admin Security Hardening

### Objective
Make the super-admin interface completely inaccessible to unauthorized users.

### Implementation Details

#### 1.1 Hidden Route with Obfuscated Path

**Current**: `/super-admin`
**New**: `/platform-ctrl-9x7k2m` (randomized, non-guessable)

```
Files to Modify:
├── app/platform-ctrl-9x7k2m/          # Renamed from super-admin
│   ├── layout.tsx                      # Add IP check + OTP verification
│   ├── page.tsx
│   └── [...all existing pages]
├── middleware.ts                       # Add route protection
└── contexts/SuperAdminAuthContext.tsx  # Add OTP verification state
```

#### 1.2 IP Whitelist Implementation

```typescript
// lib/super-admin-config.ts
export const SUPER_ADMIN_CONFIG = {
  allowedIPs: [
    '127.0.0.1',           // Localhost
    '::1',                 // IPv6 localhost
    // Add production IPs here
  ],
  obfuscatedPath: '/platform-ctrl-9x7k2m',
  otpExpiryMinutes: 15,
  maxOtpAttempts: 3,
};
```

#### 1.3 Email OTP for Super-Admin Login

**Flow**:
1. User navigates to hidden route
2. Middleware checks IP whitelist
3. If IP valid → Show email input
4. Send OTP to registered super-admin email
5. Verify OTP → Grant access
6. Store verification in session (expires in 4 hours)

**Backend Endpoint**:
```
POST /api/v1/super-admin/request-otp
POST /api/v1/super-admin/verify-otp
```

#### 1.4 Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `lib/super-admin-config.ts` | Create | Configuration for security settings |
| `middleware.ts` | Modify | Add super-admin route protection |
| `app/platform-ctrl-9x7k2m/` | Rename | Move from `super-admin/` |
| `app/platform-ctrl-9x7k2m/verify/page.tsx` | Create | OTP verification page |
| `contexts/SuperAdminAuthContext.tsx` | Modify | Add OTP verification state |
| `Backend: routes/super_admin.py` | Modify | Add OTP endpoints |
| `Backend: data_ops/super_admin.py` | Modify | Add OTP storage/verification |

---

## Phase 2: Secure Token-Based Onboarding

### Objective
Ensure the hospital onboarding route is completely inaccessible without a valid invitation token.

### Implementation Details

#### 2.1 Token Validation Flow

```
User clicks invitation link
        ↓
/onboarding/hospital?token=xxx
        ↓
Middleware intercepts request
        ↓
    ┌─────────────────────┐
    │ Validate token via  │
    │ backend API call    │
    └─────────────────────┘
        ↓           ↓
   Valid          Invalid
     ↓               ↓
 Allow access    Redirect to
 Pre-fill data   /onboarding/invalid
```

#### 2.2 Middleware Implementation

```typescript
// middleware.ts - Add this logic
if (pathname.startsWith('/onboarding/hospital')) {
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/onboarding/invalid', request.url));
  }
  
  // Validate token via API
  const validation = await fetch(`${API_URL}/api/v1/onboarding/hospital/validate?token=${token}`);
  
  if (!validation.ok) {
    return NextResponse.redirect(new URL('/onboarding/invalid', request.url));
  }
}
```

#### 2.3 Backend Token Validation

**Endpoint**: `GET /api/v1/onboarding/hospital/validate`

**Checks**:
- Token exists in `iam.invitation_tokens`
- Token not expired (`expires_at > NOW()`)
- Token not already used (`used_at IS NULL`)
- Token type is `hospital_onboarding`

**Response**:
```json
{
  "valid": true,
  "invitation": {
    "hospital_name": "City Hospital",
    "owner_name": "Dr. John Smith",
    "owner_email": "john@cityhospital.com",
    "template_id": "uuid-of-suggested-template"
  }
}
```

#### 2.4 Invalid Token Page

Create: `app/onboarding/invalid/page.tsx`

```tsx
// Friendly error page with:
// - Clear message: "This invitation link is invalid or has expired"
// - Contact support option
// - Request new invitation link
```

#### 2.5 Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `middleware.ts` | Modify | Add token validation for onboarding routes |
| `app/onboarding/invalid/page.tsx` | Create | Invalid token error page |
| `app/onboarding/hospital/page.tsx` | Modify | Remove dev bypass, add pre-fill logic |
| `Backend: routes/onboarding.py` | Create | Token validation endpoint |
| `Backend: data_ops/onboarding.py` | Create | Token validation queries |

---

## Phase 3: Onboarding UX Redesign

### Objective
Create a delightful first-time experience with guided walkthrough and AI-powered customization.

### ✅ Implementation Status: COMPLETE

#### Files Created

| File | Purpose | Status |
|------|---------|--------|
| `components/onboarding/WelcomeModal.tsx` | Welcome popup for first-time users | ✅ Complete |
| `components/onboarding/WalkthroughOverlay.tsx` | Guided tour overlay with spotlight | ✅ Complete |
| `components/onboarding/ImageToolbox.tsx` | AI/Stock/Upload image selector | ✅ Complete |
| `components/onboarding/ContentSuggester.tsx` | AI-powered content suggestions | ✅ Complete |
| `components/onboarding/TemplatePreview.tsx` | Device-responsive preview | ✅ Complete |
| `hooks/useWalkthrough.ts` | Walkthrough state management | ✅ Complete |
| `hooks/useAutoSave.ts` | Debounced auto-save with indicator | ✅ Complete |
| `lib/azure-ai.ts` | Azure OpenAI integration | ✅ Complete |
| `components/onboarding/index.ts` | Barrel export file | ✅ Complete |
| `app/onboarding/hospital/useOnboardingEnhancements.ts` | Integration hooks | ✅ Complete |

#### Key Features Implemented

1. **WelcomeModal**
   - Personalized greeting with hospital name
   - Feature highlights list
   - Animated entrance with Framer Motion
   - "Let's Get Started" CTA

2. **WalkthroughOverlay**
   - SVG spotlight mask with animated cutout
   - Tooltip positioning (top/bottom/left/right)
   - Progress indicator dots
   - Skip and navigation buttons
   - Step callbacks for custom actions

3. **ImageToolbox**
   - 4 tabs: AI Generate, Stock Photos, Upload, Recent
   - 8 curated healthcare stock images
   - Category filtering
   - Upload to Vercel Blob (placeholder)
   - Recent images from localStorage

4. **ContentSuggester**
   - Section-specific suggestions (tagline, about, services, welcome, contact)
   - Edit before applying
   - Copy to clipboard
   - Loading states

5. **TemplatePreview**
   - Device toggles (mobile 375px, tablet 768px, desktop 1280px)
   - Zoom controls (50-150%)
   - Fullscreen mode
   - View mode toggle (website/login/documents)
   - Device frame styling

6. **useAutoSave Hook**
   - Configurable debounce (default 1000ms)
   - Status tracking (idle/saving/saved/error)
   - AutoSaveIndicator component
   - formatTimeSince utility

7. **Azure AI Integration (lib/azure-ai.ts)**
   - `generateImage()` - Azure DALL-E integration
   - `suggestContent()` - GPT content suggestions
   - `suggestBrandingPackage()` - Complete branding suggestions
   - `enhanceText()` - Text improvement
   - Fallback suggestions when API unavailable

### Implementation Details

#### 3.1 Welcome Popup Modal

**Design**:
- Centered modal with slight blur backdrop
- Hospital logo (from invitation) or Athaarva logo
- Personalized greeting: "Welcome, Dr. {name}!"
- Brief explanation of what's coming
- "Let's Get Started" button

```tsx
// components/onboarding/WelcomeModal.tsx
interface WelcomeModalProps {
  hospitalName: string;
  ownerName: string;
  onStart: () => void;
}
```

#### 3.2 Guided Walkthrough

**Using**: Custom overlay system (not react-joyride for better control)

**Steps**:
1. **Template Selection** - "Choose a design that matches your brand"
2. **Branding Colors** - "Customize colors to match your identity"
3. **Logo Upload** - "Add your hospital logo"
4. **Content Preview** - "See how your hospital will look"
5. **AI Suggestions** - "Let AI help you create content"

```tsx
// components/onboarding/WalkthroughOverlay.tsx
// components/onboarding/WalkthroughStep.tsx
// hooks/useWalkthrough.ts
```

#### 3.3 Template Preview Fix

**Current Issue**: Template preview not fully visible, CSS clipping

**Solution**:
- Full-width preview panel (right side of screen)
- Responsive iframe or component preview
- Real-time updates as user changes settings

```tsx
// components/onboarding/TemplatePreview.tsx
// - Full-height sidebar preview
// - Mobile/tablet/desktop view toggles
// - Zoom controls
```

#### 3.4 Image Toolbox Component

**Features**:
- **AI Generation** (Azure DALL-E): Generate custom images from prompts
- **Stock Photos**: Curated healthcare stock images
- **Upload**: Direct upload to Vercel Blob
- **Recent**: Previously used images

```tsx
// components/onboarding/ImageToolbox.tsx
interface ImageToolboxProps {
  onImageSelect: (url: string) => void;
  category?: 'logo' | 'banner' | 'background' | 'general';
}

// Tabs: [AI Generate] [Stock Photos] [Upload] [Recent]
```

**Azure Integration**:
```typescript
// lib/azure-ai.ts
export async function generateImage(prompt: string): Promise<string> {
  // Call Azure DALL-E API
  // Return generated image URL
}

export async function suggestContent(context: {
  hospitalName: string;
  specialties: string[];
  section: 'tagline' | 'about' | 'services';
}): Promise<string[]> {
  // Call Azure GPT API
  // Return array of content suggestions
}
```

#### 3.5 AI Content Suggestions

**Sections to suggest**:
- Hospital tagline/slogan
- About us paragraph
- Services descriptions
- Welcome message
- Contact section text

**UI**:
- "✨ Get AI Suggestions" button next to text fields
- Dropdown with 3-5 suggestions
- Click to apply, edit as needed

#### 3.6 Auto-Save Branding

**Implementation**:
- Debounced save (500ms after last change)
- Visual indicator: "Saving..." → "Saved ✓"
- No "Update" button needed
- Persist to `tenant_mgmt.tenant_branding` table

```typescript
// hooks/useAutoSave.ts
export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  debounceMs: number = 500
) {
  // Debounce and auto-save logic
  // Return { isSaving, lastSaved, error }
}
```

#### 3.7 Remove Floating "Continue to Profile" Button

**Current**: Ugly floating button
**New**: Integrated step navigation at bottom of each step

#### 3.8 Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `components/onboarding/WelcomeModal.tsx` | Create | Welcome popup component |
| `components/onboarding/WalkthroughOverlay.tsx` | Create | Walkthrough system |
| `components/onboarding/WalkthroughStep.tsx` | Create | Individual step highlight |
| `components/onboarding/TemplatePreview.tsx` | Create | Full-width preview panel |
| `components/onboarding/ImageToolbox.tsx` | Create | AI + Stock + Upload images |
| `components/onboarding/ContentSuggester.tsx` | Create | AI content suggestions |
| `lib/azure-ai.ts` | Create | Azure GPT/DALL-E integration |
| `hooks/useWalkthrough.ts` | Create | Walkthrough state management |
| `hooks/useAutoSave.ts` | Create | Debounced auto-save hook |
| `app/onboarding/hospital/page.tsx` | Modify | Integrate new components |
| `app/onboarding/hospital/widgets/TemplateGallery.tsx` | Modify | Fix preview CSS |

---

## Phase 4: Custom Login Page Builder

### Objective
Allow hospitals to create fully customized, branded login pages.

### ✅ Implementation Status: COMPLETE

#### Files Created

| File | Purpose | Status |
|------|---------|--------|
| `lib/login-templates.ts` | 6 pre-built login page templates | ✅ Complete |
| `components/onboarding/LoginPageBuilder.tsx` | Visual login page editor | ✅ Complete |
| `components/onboarding/CustomLoginPage.tsx` | Login page renderer | ✅ Complete |
| `migrations/phase4_login_page.sql` | Backend schema for login_page | ✅ Complete |

#### Key Features Implemented

1. **Login Templates (lib/login-templates.ts)**
   - 6 pre-built templates:
     - Modern Centered
     - Professional Left
     - Split Screen
     - Minimal Dark
     - Healthcare Teal
     - Medical Pattern
   - TypeScript interfaces for all config options
   - Helper functions: `getLoginTemplate()`, `generateLoginCSS()`, `createLoginConfig()`

2. **LoginPageBuilder**
   - 4 configuration tabs: Layout, Background, Text, Style
   - Layout options: centered, left, right, split-screen
   - Background options: solid color, gradient, image
   - Logo settings: position, size, show hospital name
   - Welcome text customization
   - Form styling: card background, border radius, input style, button style
   - Live preview with device toggles (mobile/desktop)
   - Template quick-apply buttons

3. **CustomLoginPage Renderer**
   - Applies saved LoginPageConfig to hospital login page
   - Responsive layout support
   - Dark/light background detection
   - All input styles (outlined, filled, underlined)
   - All button styles (solid, gradient, outlined)
   - Form handling with show/hide password

4. **Backend Schema (phase4_login_page.sql)**
   - Adds `login_page` JSONB column to `tenant_mgmt.tenant_branding`
   - Default configuration included
   - GIN index for queries
   - Documentation comment

#### TypeScript Interfaces

```typescript
interface LoginPageConfig {
  id: string;
  name: string;
  layout: "centered" | "left" | "right" | "split";
  background: LoginPageBackground;
  logo: LoginPageLogo;
  welcomeText: LoginPageWelcomeText;
  formStyle: LoginPageFormStyle;
  customCSS?: string;
}
```

### Implementation Details

#### 4.1 Login Page Builder UI

**Location**: Step in onboarding wizard OR separate admin section

**Customizable Elements**:
- Background image/gradient
- Logo position and size
- Welcome text
- Color scheme (inherits from branding)
- Layout (centered, left-aligned, split-screen)
- Custom CSS (advanced)

```tsx
// components/onboarding/LoginPageBuilder.tsx
interface LoginPageConfig {
  layout: 'centered' | 'left' | 'right' | 'split';
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string; // color, gradient CSS, or image URL
  };
  logo: {
    url: string;
    position: 'top' | 'inline';
    size: 'small' | 'medium' | 'large';
  };
  welcomeText: {
    heading: string;
    subheading: string;
  };
  formStyle: {
    cardBackground: string;
    inputStyle: 'outlined' | 'filled' | 'underlined';
    buttonStyle: 'solid' | 'gradient' | 'outlined';
  };
}
```

#### 4.2 Live Preview

- Side-by-side builder and preview
- Real-time updates
- Device preview (mobile, tablet, desktop)

#### 4.3 Template Matching

- Auto-suggest login design based on selected template
- "Match to Template" button for quick setup

#### 4.4 Storage

Store in `tenant_mgmt.tenant_branding` JSONB column:
```json
{
  "login_page": {
    "layout": "split",
    "background": {...},
    "logo": {...},
    ...
  }
}
```

#### 4.5 Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `components/onboarding/LoginPageBuilder.tsx` | Create | Visual login page editor |
| `components/onboarding/LoginPagePreview.tsx` | Create | Live preview component |
| `app/auth/hospital/[subdomain]/page.tsx` | Modify | Apply custom login config |
| `lib/login-templates.ts` | Create | Pre-built login templates |

---

## Phase 5: Clinical Document Branding

### Objective
Create branded templates for prescriptions, certificates, invoices, and other clinical documents.

### ✅ Implementation Status: COMPLETE

#### Files Created

| File | Purpose | Status |
|------|---------|--------|
| `components/documents/types.ts` | TypeScript interfaces for all clinical documents | ✅ Complete |
| `components/documents/BaseDocumentTemplate.tsx` | Reusable base template with header/footer | ✅ Complete |
| `components/documents/PrescriptionTemplate.tsx` | Prescription/Rx document layout | ✅ Complete |
| `components/documents/MedicalCertificateTemplate.tsx` | Medical/fitness certificate layout | ✅ Complete |
| `components/documents/InvoiceTemplate.tsx` | Patient billing/invoice layout | ✅ Complete |
| `components/documents/DischargeTemplate.tsx` | Discharge summary layout | ✅ Complete |
| `components/documents/LabReportTemplate.tsx` | Lab test results layout | ✅ Complete |
| `components/documents/DocumentTemplateBuilder.tsx` | Visual template editor | ✅ Complete |
| `components/documents/index.ts` | Barrel export file | ✅ Complete |
| `lib/document-generator.ts` | PDF generation utilities | ✅ Complete |
| `app/hospital/[subdomain]/admin/documents/page.tsx` | Document settings admin page | ✅ Complete |
| `migrations/phase5_document_templates.sql` | Database schema for templates | ✅ Complete |

#### Key Features Implemented

1. **Document Types (components/documents/types.ts)**
   - `HospitalBranding` - Hospital branding info (logo, colors, contact)
   - `DoctorInfo` - Doctor details with signature support
   - `PatientInfo` - Patient demographic data
   - `DocumentMetadata` - Document ID, type, timestamps
   - `PrescriptionData` - Complete prescription with medicines
   - `MedicalCertificateData` - Leave/fitness certificates
   - `InvoiceData` - Itemized billing with taxes, payments
   - `DischargeSummaryData` - Full discharge summary
   - `LabReportData` - Lab tests with results/status
   - `AppointmentCardData` - Appointment confirmation
   - `DocumentHeaderConfig`, `DocumentFooterConfig`, `DocumentStyleConfig` - Template configs

2. **BaseDocumentTemplate**
   - Configurable header (logo, hospital name, address, contact, registration)
   - Configurable footer (page numbers, QR code, disclaimer, signature line)
   - Paper size support (A4, A5, Letter, Legal)
   - Portrait/landscape orientation
   - Custom margins and styling
   - QR code for document verification
   - Reusable sections: `PatientInfoSection`, `DoctorInfoSection`, `SectionTitle`

3. **PrescriptionTemplate**
   - Vital signs display
   - Allergies warning section
   - Chief complaints and diagnosis
   - Medicines table with dosage, frequency, duration, instructions
   - Investigations advised
   - Advice/instructions section
   - Follow-up date
   - Doctor signature

4. **MedicalCertificateTemplate**
   - Multiple certificate types (medical_leave, fitness, disability, etc.)
   - Leave period with automatic day calculation
   - Fitness certification with validity period
   - Official formatting with stamps
   - Doctor attestation section

5. **InvoiceTemplate**
   - Invoice header with number, date, due date
   - Patient and doctor info
   - Admission/discharge dates for IPD
   - Itemized charges table with HSN/SAC codes
   - Tax breakdown (GST/CGST+SGST/IGST)
   - Subtotal, discounts, taxes, grand total
   - Payment history
   - Insurance info section
   - Amount due highlighting
   - Bank details for payment
   - Terms and conditions

6. **DischargeTemplate**
   - Admission/discharge details with length of stay
   - Attending physicians list
   - Chief complaints and history
   - Clinical findings and diagnosis (with ICD codes)
   - Investigations table
   - Treatment given and procedures performed
   - Condition at discharge
   - Discharge medications table
   - Diet and activity advice
   - Follow-up instructions with date
   - Emergency instructions
   - Referrals section
   - Discharge type badge (Normal/LAMA/Absconded/Transfer/Expired)

7. **LabReportTemplate**
   - Sample collection and report dates
   - Lab number and sample type
   - Test results table with:
     - Test name and code
     - Result value
     - Normal range
     - Unit
     - Status indicator (normal/high/low/critical)
   - Interpretation section
   - Pathologist signature

8. **DocumentTemplateBuilder**
   - 4 configuration tabs: Header, Footer, Style, Advanced
   - Header options: logo visibility, position, size, hospital info toggles
   - Footer options: page numbers, QR code, disclaimer, signature line
   - Style options: colors, fonts, paper size, orientation, margins
   - Live preview with device toggles (mobile/tablet/desktop)
   - Document type selector (8 document types)
   - Save/reset functionality

9. **Document Generator (lib/document-generator.ts)**
   - `generateDocumentId()` - Unique document ID generation
   - `formatDocumentDate()` - Date formatting utilities
   - `formatDocumentCurrency()` - INR currency formatting
   - `generateQRCodeData()` - QR code data for verification
   - `printDocument()` - Browser print API integration
   - `downloadDocumentAsPDF()` - PDF download via print
   - Sample data generators for testing
   - Template config helpers

10. **Admin Documents Page**
    - Template grid with CRUD operations
    - Quick stats cards (active templates, last update, document types)
    - Search and filter by document type
    - Template preview dialog
    - Template editor dialog with DocumentTemplateBuilder
    - localStorage persistence (API integration ready)

11. **Database Schema (phase5_document_templates.sql)**
    - `tenant_mgmt.document_templates` table with JSONB config
    - Indexes for tenant, document type, default template
    - GIN index for JSONB queries
    - Helper function: `get_default_document_template()`
    - Adds `document_header_config`, `document_footer_config` to `tenant_branding`

### Implementation Details

#### 5.1 Document Types

| Document | Purpose | Key Elements |
|----------|---------|--------------|
| **Prescription** | Medicine orders | Hospital header, doctor info, Rx format |
| **Medical Certificate** | Fitness/sick certificates | Official letterhead, signatures |
| **Invoice/Bill** | Patient billing | Itemized charges, payment info |
| **Discharge Summary** | Post-hospitalization | Clinical summary, follow-up |
| **Lab Report Header** | Lab test results | Hospital branding, report format |
| **Appointment Card** | Appointment confirmation | Date, time, doctor info |

#### 5.2 Template Builder

**Components**:
- Header section (logo, hospital name, address, contact)
- Body section (document-specific content)
- Footer section (signatures, stamps, disclaimers)
- QR code for verification

```tsx
// components/documents/DocumentTemplateBuilder.tsx
// components/documents/PrescriptionTemplate.tsx
// components/documents/CertificateTemplate.tsx
// components/documents/InvoiceTemplate.tsx
```

#### 5.3 PDF Generation

**Using**: `@react-pdf/renderer` or `puppeteer` for server-side

```typescript
// lib/document-generator.ts
export async function generatePrescriptionPDF(
  prescription: PrescriptionData,
  branding: TenantBranding
): Promise<Buffer> {
  // Generate branded PDF
}
```

#### 5.4 Database Schema

```sql
-- Add to tenant_mgmt schema
CREATE TABLE tenant_mgmt.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenant_mgmt.tenants(id),
  document_type VARCHAR(50) NOT NULL, -- 'prescription', 'certificate', 'invoice'
  template_name VARCHAR(100) NOT NULL,
  template_config JSONB NOT NULL, -- Header, body, footer config
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5.5 Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `components/documents/DocumentTemplateBuilder.tsx` | Create | Visual template editor |
| `components/documents/PrescriptionTemplate.tsx` | Create | Prescription layout |
| `components/documents/CertificateTemplate.tsx` | Create | Certificate layout |
| `components/documents/InvoiceTemplate.tsx` | Create | Invoice layout |
| `lib/document-generator.ts` | Create | PDF generation utilities |
| `app/hospital/[subdomain]/admin/documents/page.tsx` | Create | Document settings page |

---

## Phase 6: Admin Setup & Domain Configuration

### Objective
Complete the post-onboarding flow with admin account setup and domain configuration.

### ✅ Implementation Status: COMPLETE

#### Files Created

| File | Purpose | Status |
|------|---------|--------|
| `lib/subdomain-validator.ts` | Subdomain validation utilities & reserved list | ✅ Complete |
| `app/onboarding/hospital/admin-setup/page.tsx` | Admin password & 2FA setup wizard | ✅ Complete |
| `app/onboarding/hospital/domain-setup/page.tsx` | Subdomain & custom domain configuration | ✅ Complete |
| `app/hospital-not-found/page.tsx` | Invalid subdomain error page | ✅ Complete |
| `migrations/phase6_admin_domain_setup.sql` | Database schema for domain management | ✅ Complete |

#### Files Modified

| File | Changes | Status |
|------|---------|--------|
| `middleware.ts` | Enhanced subdomain validation with format checks & reserved list | ✅ Complete |

#### Key Features Implemented

1. **Subdomain Validator (lib/subdomain-validator.ts)**
   - `RESERVED_SUBDOMAINS` - 60+ reserved system subdomains
   - `isReservedSubdomain()` - Check if subdomain is reserved
   - `isValidSubdomainFormat()` - Format validation (3-63 chars, alphanumeric+hyphen)
   - `validateSubdomainLocal()` - Combined local validation
   - `validateSubdomainWithAPI()` - Backend availability check
   - `checkSubdomainExists()` - Check if subdomain is active
   - `generateSubdomainSuggestions()` - Alternative suggestions when taken
   - `generateCNAMEInstructions()` - DNS setup instructions for custom domains
   - `verifyCustomDomain()` - DNS verification
   - `hospitalNameToSubdomain()` - Convert hospital name to valid subdomain

2. **Admin Setup Page (admin-setup/page.tsx)**
   - 3-step wizard: Password → 2FA → Recovery
   - Password strength meter with 5 requirements
   - Real-time validation and visual feedback
   - Email OTP verification for 2FA
   - Resend cooldown timer (60 seconds)
   - Recovery email and phone configuration
   - Account summary before completion
   - Framer Motion animations

3. **Domain Setup Page (domain-setup/page.tsx)**
   - 3-step wizard: Subdomain → Custom Domain → Initial Settings
   - Subdomain verification with live preview
   - Optional custom domain configuration
   - CNAME record instructions with copy buttons
   - DNS verification check
   - Initial hospital settings:
     - Working hours (start/end time)
     - Default appointment duration
     - Maximum advance booking days
   - Launch summary with all configuration

4. **Hospital Not Found Page (hospital-not-found/page.tsx)**
   - Error messages based on reason (not_found, suspended, inactive)
   - Attempted subdomain display
   - Hospital search functionality
   - Quick action buttons (Browse All, Go Home)
   - Help sections for patients and staff
   - Similar subdomain suggestions
   - Contact support links

5. **Enhanced Middleware (middleware.ts)**
   - Local format validation before API call
   - Reserved subdomain blocking
   - Detailed error reasons for redirects
   - Redirect to `/hospital-not-found` with reason parameter
   - Support for suspended/inactive status

6. **Database Schema (phase6_admin_domain_setup.sql)**
   - Custom domain columns on tenants table
   - Initial settings columns (working_hours, appointment_duration, etc.)
   - `admin_setup_progress` table for tracking setup completion
   - `domain_verification_logs` table for audit trail
   - `is_subdomain_available()` function
   - `complete_admin_setup()` function
   - `get_tenant_by_domain()` function for lookups
   - Indexes for performance

### Implementation Details

#### 6.1 Post-Onboarding Flow

```
Onboarding Complete
        ↓
Admin Account Setup
  - Set admin password
  - Configure 2FA (Email OTP)
  - Set security questions
        ↓
Domain Configuration
  - Verify subdomain
  - Configure custom domain (optional)
  - SSL certificate status
        ↓
Initial Settings
  - Working hours
  - Appointment slots
  - Department setup
        ↓
Dashboard Access
```

#### 6.2 Subdomain Validation with Wildcard DNS

**Current Setup**: `*.athaarva.com` points to the application

**Validation Logic**:
```typescript
// middleware.ts
async function validateSubdomain(subdomain: string): Promise<boolean> {
  // Check if subdomain exists in tenant_mgmt.tenants
  const response = await fetch(
    `${API_URL}/api/v1/tenants/validate-subdomain/${subdomain}`
  );
  return response.ok;
}

// For requests to *.athaarva.com:
// 1. Extract subdomain from host
// 2. Validate against database
// 3. If invalid → Redirect to 404 or "Hospital not found" page
// 4. If valid → Continue to requested page
```

**Reserved Subdomains** (block from registration):
```typescript
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'app', 'mail', 'smtp', 'ftp',
  'test', 'demo', 'staging', 'dev', 'localhost',
  'super-admin', 'platform', 'dashboard', 'auth',
];
```

#### 6.3 Custom Domain Support (Future)

**Flow**:
1. Hospital enters custom domain (e.g., `portal.cityhospital.com`)
2. We provide CNAME record instructions
3. They configure their DNS
4. We verify DNS propagation
5. Provision SSL certificate (Let's Encrypt)
6. Enable custom domain

**Database**:
```sql
ALTER TABLE tenant_mgmt.tenants ADD COLUMN custom_domain VARCHAR(255);
ALTER TABLE tenant_mgmt.tenants ADD COLUMN custom_domain_verified BOOLEAN DEFAULT false;
ALTER TABLE tenant_mgmt.tenants ADD COLUMN custom_domain_ssl_status VARCHAR(50);
```

#### 6.4 Admin Account Setup Page

```tsx
// app/onboarding/hospital/admin-setup/page.tsx
// - Password creation (with strength meter)
// - Email OTP setup verification
// - Recovery email configuration
// - Security questions (optional)
```

#### 6.5 Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `app/onboarding/hospital/admin-setup/page.tsx` | Create | Admin account setup |
| `app/onboarding/hospital/domain-setup/page.tsx` | Create | Domain configuration |
| `app/hospital-not-found/page.tsx` | Create | Invalid subdomain page |
| `middleware.ts` | Modify | Add subdomain validation |
| `lib/subdomain-validator.ts` | Create | Subdomain validation utilities |
| `Backend: routes/tenants.py` | Modify | Add subdomain validation endpoint |

---

## Phase 7: Hospital Selector & Login Flow

### Objective
Create an intuitive hospital selection and login experience.

### Implementation Details

#### 7.1 Hospital Selector Redesign

**Design**: Card-based grid with search

**Features**:
- Search by hospital name or city
- Recent hospitals (stored in localStorage)
- Hospital cards with:
  - Logo
  - Hospital name
  - City/location
  - Specialty tags
- "Can't find your hospital?" help option

```tsx
// app/auth/selector/page.tsx - Redesigned
// components/auth/HospitalCard.tsx
// components/auth/HospitalSearch.tsx
// components/auth/RecentHospitals.tsx
```

#### 7.2 Per-Hospital Login Page

**Apply custom branding from Phase 4**:
- Load `tenant_branding.login_page` config
- Apply custom background, colors, layout
- Show hospital logo and welcome text
- Three role tabs: Patient | Staff | Doctor

#### 7.3 Role-Based Redirects

| Role | After Login Redirect |
|------|---------------------|
| Patient | `/hospital/{subdomain}/patient/dashboard` |
| Staff | `/hospital/{subdomain}/admin/dashboard` |
| Doctor | `/hospital/{subdomain}/doctor/dashboard` |
| Hospital Admin | `/hospital/{subdomain}/admin/dashboard` |

#### 7.4 Remember Hospital

- Checkbox: "Remember this hospital"
- Store in localStorage
- Auto-redirect on next visit (with option to change)

#### 7.5 Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `app/auth/selector/page.tsx` | Modify | Redesigned hospital selector |
| `components/auth/HospitalCard.tsx` | Create | Hospital selection card |
| `components/auth/HospitalSearch.tsx` | Create | Search component |
| `components/auth/RecentHospitals.tsx` | Create | Recent selections |
| `app/auth/hospital/[subdomain]/page.tsx` | Modify | Apply custom login config |

### Phase 7 Implementation Complete ✅

**Completed: January 2025**

#### Files Created:

1. **`components/auth/HospitalCard.tsx`**
   - Three variants: `default`, `compact`, `featured`
   - Hospital logo, name, city/state display
   - Specialty tags with Badge component
   - Rating display with star icon
   - Framer Motion animations
   - Click handling for navigation

2. **`components/auth/HospitalSearch.tsx`**
   - Debounced search (300ms default)
   - API integration with fallback to filtering
   - Popular search suggestions dropdown
   - Loading spinner and clear button
   - Mock data support for development

3. **`components/auth/RecentHospitals.tsx`**
   - localStorage persistence with `athaarva_recent_hospitals` key
   - Max 5 recent hospitals stored
   - Relative time display (e.g., "2h ago")
   - Remove individual items
   - Clear all functionality
   - Exported `recentHospitalsStorage` utility functions

4. **`components/auth/index.ts`**
   - Barrel export for clean imports
   - Type exports for HospitalCardData, RecentHospital

#### Files Modified:

1. **`app/auth/selector/page.tsx`** - Complete Redesign
   - Card-based grid layout (2 columns on desktop)
   - Three-column layout with help section
   - HospitalSearch integration
   - RecentHospitals section (hidden during search)
   - Featured hospitals grid with HospitalCard (featured variant)
   - "Can't find your hospital?" help card
   - "Are you a hospital administrator?" CTA
   - FAQ accordion
   - Live chat button
   - Footer with links

2. **`app/auth/hospital/[subdomain]/page.tsx`** - Enhanced Login
   - New interfaces: `LoginPageConfig`, enhanced `HospitalBranding`
   - Two-column layout on desktop (hospital info + login form)
   - Hospital info panel with:
     - Logo and welcome message
     - Specialty badges
     - Contact information (address, phone, email)
     - Working hours display
   - Enhanced login form:
     - Role tabs (Patient, Staff, Doctor) based on `enabled_roles` config
     - Sign In/Sign Up toggle for patients
     - "Remember this hospital" checkbox with localStorage
     - Forgot password link
     - Custom footer text support
   - Role-based redirects after login
   - Integration with `recentHospitalsStorage.add()` for tracking
   - Mobile-responsive header

#### Key Features:

- **Hospital Cards**: Multiple display variants for different contexts
- **Search**: Real-time search with debounce and suggestions
- **Recent Hospitals**: Persistent tracking with localStorage
- **Login Page Config**: Respects `login_page` branding config:
  - `enabled_roles`: Control which role tabs appear
  - `allow_patient_signup`: Enable/disable patient registration
  - `show_hospital_info`: Toggle hospital info panel
  - `show_working_hours`: Toggle working hours display
  - `custom_footer_text`: Custom footer message
- **Remember Hospital**: Checkbox to save hospital preference
- **Role-Based Redirects**: Proper dashboard routing per user type

---

## Database Schema Requirements

### New Tables Required

```sql
-- 1. Super Admin OTP tokens
CREATE TABLE platform.super_admin_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES platform.super_admins(id),
  otp_code VARCHAR(6) NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT DEFAULT 0,
  verified_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Document templates
CREATE TABLE tenant_mgmt.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenant_mgmt.tenants(id),
  document_type VARCHAR(50) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  template_config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI content suggestions cache
CREATE TABLE tenant_mgmt.ai_content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenant_mgmt.tenants(id),
  content_type VARCHAR(50) NOT NULL, -- 'tagline', 'about', 'services'
  prompt_hash VARCHAR(64) NOT NULL,
  suggestions JSONB NOT NULL, -- Array of suggested content
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- 4. Add columns to existing tables
ALTER TABLE tenant_mgmt.tenant_branding 
  ADD COLUMN IF NOT EXISTS login_page_config JSONB,
  ADD COLUMN IF NOT EXISTS document_header_config JSONB;

ALTER TABLE tenant_mgmt.tenants
  ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255),
  ADD COLUMN IF NOT EXISTS custom_domain_verified BOOLEAN DEFAULT false;
```

---

## API Endpoints Summary

### Phase 1: Super-Admin Security

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/super-admin/request-otp` | Request OTP for super-admin login |
| POST | `/api/v1/super-admin/verify-otp` | Verify OTP and get session |

### Phase 2: Token Validation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/onboarding/hospital/validate` | Validate invitation token |
| POST | `/api/v1/onboarding/hospital/mark-used` | Mark token as used |

### Phase 3: AI Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/generate-image` | Generate image via Azure DALL-E |
| POST | `/api/v1/ai/suggest-content` | Get AI content suggestions |
| GET | `/api/v1/stock-images` | Get healthcare stock images |

### Phase 4: Login Page

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tenants/{subdomain}/login-config` | Get login page configuration |
| PUT | `/api/v1/tenants/{id}/login-config` | Update login page configuration |

### Phase 5: Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tenants/{id}/document-templates` | List document templates |
| POST | `/api/v1/tenants/{id}/document-templates` | Create document template |
| PUT | `/api/v1/tenants/{id}/document-templates/{docId}` | Update document template |

### Phase 6: Domain

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tenants/validate-subdomain/{subdomain}` | Validate subdomain exists |
| POST | `/api/v1/tenants/{id}/custom-domain` | Configure custom domain |

---

## File Structure

### New Files to Create

```
Athaarva_Frontend/
├── app/
│   ├── platform-ctrl-9x7k2m/          # Renamed super-admin (hidden)
│   │   └── verify/page.tsx            # OTP verification
│   ├── onboarding/
│   │   ├── invalid/page.tsx           # Invalid token page
│   │   └── hospital/
│   │       ├── admin-setup/page.tsx   # Admin account setup
│   │       └── domain-setup/page.tsx  # Domain configuration
│   └── hospital-not-found/page.tsx    # Invalid subdomain page
├── components/
│   ├── onboarding/
│   │   ├── WelcomeModal.tsx
│   │   ├── WalkthroughOverlay.tsx
│   │   ├── WalkthroughStep.tsx
│   │   ├── TemplatePreview.tsx
│   │   ├── ImageToolbox.tsx
│   │   ├── ContentSuggester.tsx
│   │   └── LoginPageBuilder.tsx
│   ├── auth/
│   │   ├── HospitalCard.tsx
│   │   ├── HospitalSearch.tsx
│   │   └── RecentHospitals.tsx
│   └── documents/
│       ├── DocumentTemplateBuilder.tsx
│       ├── PrescriptionTemplate.tsx
│       ├── CertificateTemplate.tsx
│       └── InvoiceTemplate.tsx
├── lib/
│   ├── super-admin-config.ts
│   ├── azure-ai.ts
│   ├── subdomain-validator.ts
│   ├── login-templates.ts
│   └── document-generator.ts
└── hooks/
    ├── useWalkthrough.ts
    └── useAutoSave.ts

Dev/ (Backend)
├── app/
│   ├── routes/
│   │   ├── onboarding.py              # New: Onboarding endpoints
│   │   └── ai.py                      # New: AI integration endpoints
│   └── data_ops/
│       ├── onboarding.py              # New: Onboarding DB operations
│       └── ai.py                      # New: AI caching operations
```

---

## Implementation Priority & Dependencies

### Recommended Implementation Order

```
Phase 2 (Token Validation)     ← CRITICAL BLOCKER
        ↓
Phase 1 (Super-Admin Security) ← Security requirement
        ↓
Phase 3 (Onboarding UX)        ← Core experience
        ↓
Phase 6 (Domain Setup)         ← Required for go-live
        ↓
Phase 7 (Hospital Selector)    ← User-facing flow
        ↓
Phase 4 (Login Builder)        ← Enhancement
        ↓
Phase 5 (Document Branding)    ← Enhancement
```

### Phase Dependencies

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | None |
| Phase 2 | None | Phase 3, 6, 7 |
| Phase 3 | Phase 2 | Phase 4 |
| Phase 4 | Phase 3 | None |
| Phase 5 | Phase 3 | None |
| Phase 6 | Phase 2 | Phase 7 |
| Phase 7 | Phase 6 | None |

### Estimated Effort

| Phase | Complexity | Estimated Time |
|-------|------------|----------------|
| Phase 1 | Medium | 4-6 hours |
| Phase 2 | Medium | 3-4 hours |
| Phase 3 | High | 8-12 hours |
| Phase 4 | Medium | 4-6 hours |
| Phase 5 | High | 6-8 hours |
| Phase 6 | Medium | 4-6 hours |
| Phase 7 | Low | 2-4 hours |
| **Total** | | **31-46 hours** |

---

## Azure API Configuration

### Required Environment Variables

```env
# Azure OpenAI for text generation
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Azure DALL-E for image generation
AZURE_DALLE_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_DALLE_API_KEY=your-api-key
AZURE_DALLE_DEPLOYMENT_NAME=dall-e-3
```

### Usage Examples

```typescript
// Text content suggestion
const suggestions = await suggestContent({
  hospitalName: "City Hospital",
  specialties: ["Cardiology", "Orthopedics"],
  section: "tagline"
});
// Returns: ["Your Health, Our Priority", "Excellence in Care", ...]

// Image generation
const imageUrl = await generateImage(
  "Professional medical clinic reception area, modern, clean, healthcare"
);
// Returns: URL to generated image
```

---

## Next Steps

1. **Confirm this plan** with stakeholder
2. **Start Phase 2** - Token validation (critical blocker)
3. **Set up Azure API keys** for AI features
4. **Apply database migrations** from schema requirements
5. **Implement phases** in recommended order

---

## Appendix: Current File Locations

### Frontend Key Files
- Super Admin: `app/super-admin/`
- Hospital Onboarding: `app/onboarding/hospital/`
- Auth Selector: `app/auth/selector/page.tsx`
- Per-Hospital Login: `app/auth/hospital/[subdomain]/page.tsx`
- Middleware: `middleware.ts`
- Auth Contexts: `contexts/SuperAdminAuthContext.tsx`, `contexts/AuthContext.tsx`

### Backend Key Files
- Auth Routes: `app/routes/auth.py`
- Super Admin Routes: `app/routes/super_admin.py`
- IAM Invitations: `app/routes/iam_invitations.py`
- Tenant Operations: `app/data_ops/tenant.py`
- Super Admin Operations: `app/data_ops/super_admin.py`

---

*Document generated by GitHub Copilot | Last updated: January 11, 2026*
