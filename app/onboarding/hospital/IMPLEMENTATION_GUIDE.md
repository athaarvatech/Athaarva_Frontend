# Hospital Onboarding System - Implementation Guide

## ✅ Completed Components

### Core Infrastructure
1. **HospitalOnboardingContextV2.tsx** - Enhanced context with:
   - 12-step data model (Steps 0-11)
   - Activity log tracking
   - Collaborator management
   - Autosave with throttling (1s debounce)
   - Comprehensive validation per step
   - Payload builder for submission
   - LocalStorage persistence (namespaced by invitation ID)

2. **onboarding-utils.ts** - Utility functions:
   - WCAG contrast ratio calculation & accessibility scoring
   - File upload with progress tracking
   - Geocoding helpers (mock implementation)
   - Form validation (email, phone, GST, PAN, pincode, URLs)
   - Subdomain normalization & availability checking
   - Date/time formatting & expiry checks
   - Text utilities (word count, truncate)
   - Throttle & debounce functions

### Widgets (`app/onboarding/hospital/widgets/`)
1. **TemplateGallery.tsx** - Template selection with:
   - Grid of template cards with thumbnails
   - Preview modal with device switcher (desktop/tablet/mobile)
   - Module badges and recommended use cases
   - Mock template data (5 templates)

2. **FileUploadZone.tsx** - File uploads with:
   - Drag & drop support
   - Upload progress tracking
   - File validation (size, type)
   - Image preview
   - Remove functionality

3. **ContrastChecker.tsx** - Accessibility validation:
   - Live contrast ratio calculation
   - WCAG AA/AAA compliance indicators
   - Color preview with sample text
   - Visual feedback

4. **HelpPopover.tsx** - Contextual help:
   - Popover with title, content, examples, tips
   - Positioned contextually near form fields

5. **DocumentChecklist.tsx** - Document tracking:
   - Progress bar showing completion
   - Document list with status badges
   - Upload/remove controls
   - Expiry date warnings
   - File size/upload date display

6. **ActivityLog.tsx** - Activity tracking:
   - Chronological list of actions
   - Actor and timestamp
   - Action categorization with icons
   - Scrollable with max entries

7. **PhasedPublishSelector.tsx** - Launch options:
   - Immediate launch
   - Scheduled launch (with date/time picker)
   - Site-only (staged rollout)
   - Visual radio group with descriptions

### Step Components (`app/onboarding/hospital/steps/`)

1. **InvitationTemplateStep.tsx** (Step 0):
   - Invitation details recap (email, ID, expiry, status)
   - Expiry warnings
   - Template gallery integration
   - Version lock banner
   - Next steps preview

2. **OrganizationProfileStep.tsx** (Step 1):
   - Legal name, parent entity
   - Registration number, established date
   - GST number, PAN number (with format validation)
   - Ownership model selector
   - Timezone and locale selectors
   - Contextual help popovers

3. **LocationsContactsStep.tsx** (Step 2):
   - Add/remove multiple locations
   - Headquarters designation
   - Full address fields (street, city, state, pincode)
   - Geocoding integration with lat/lng display
   - Contact phone/email per location
   - Emergency hotline (optional)
   - Empty state with add prompt

4. **BrandingStudioStep.tsx** (Step 3):
   - Tabbed interface (Colors, Typography, Assets)
   - Color palette editor with presets
   - Live accessibility score
   - Contrast checkers for primary/secondary colors
   - Typography font selectors (heading, body)
   - Live typography preview
   - Logo, hero background, favicon uploads
   - WCAG compliance badge

## 🚧 Remaining Steps to Implement

### Step 4: Site Content
**File**: `SiteContentStep.tsx`

**Fields**:
- Hero section: headline, subtext, CTA text/URL
- Services highlights (array of strings, min 3)
- Specialty blurbs (array of {specialty, description})
- Testimonials (array with patient name, content, rating, consent file)
- FAQ entries (array of {question, answer})
- Blog teasers (array of {title, excerpt, url})

**Features**:
- Word counters for text fields
- AI-assisted "suggest content" buttons (placeholder)
- Drag-to-reorder for arrays
- File upload for testimonial consent forms
- Inline validation (min word counts, required fields)

**Widgets needed**:
- WordCounter component
- ReorderableList component
- TestimonialCard component

---

### Step 5: Clinical Services & Pricing
**File**: `ServicesPricingStep.tsx`

**Fields**:
- Departments (tag input)
- Procedures (tag input)
- Consultation types (multi-select: in-person, telehealth, home)
- Services array with:
  - Name, department, description
  - Consultation types
  - Fee range (min, max, currency)
  - Linked location IDs
  - Linked specialty IDs
- Insurance partnerships (tag input)

**Features**:
- Add/edit/remove service cards
- Dropdown to link services to locations/specialties
- Fee range validation (min <= max)
- Cross-field validation (services reference existing departments)

---

### Step 6: Leadership & Team
**File**: `LeadershipTeamStep.tsx`

**Fields**:
- Leadership cards array:
  - Full name, role, bio
  - Credentials, LinkedIn URL
  - Profile photo upload
- Staffing plan array:
  - Role, count, status

**Features**:
- Card-based layout for leaders
- Photo upload with preview
- Rich text editor for bio (optional)
- LinkedIn URL validation
- Staffing plan table

---

### Step 7: Operational Policies
**File**: `OperationalPoliciesStep.tsx`

**Fields**:
- Operating hours per location (array of {location_id, hours: {day, open, close}})
- Appointment lead time (hours)
- Cancellation policy (textarea)
- No-show policy (textarea)
- Telehealth SOP (textarea)
- Patient onboarding steps (array of strings)

**Features**:
- Time picker for operating hours
- Day-of-week selector
- Copy hours to multiple locations
- Minimum lead time validation
- Character count for policies

---

### Step 8: Compliance & Documentation
**File**: `ComplianceDocumentationStep.tsx`

**Fields**:
- Documents array (accreditation, insurance, etc.)
- DPO contact (name, email, phone)
- Consent templates (array of {type, file})

**Features**:
- DocumentChecklist widget integration
- Document type dropdown (accreditation, license, insurance, etc.)
- Expiry date picker
- Status badges (uploaded, pending, expired)
- DPO contact form

---

### Step 9: Integrations & Preferences
**File**: `IntegrationsPreferencesStep.tsx`

**Fields**:
- Messaging channels (multi-checkbox: SMS, email, WhatsApp)
- Analytics tags (array of {platform, tag_id})
- LLM opt-in (boolean with disclaimer)
- Telehealth provider (dropdown)
- Patient portal modules (multi-checkbox)

**Features**:
- Toggle switches for opt-ins
- Provider selection with logos
- Module cards with descriptions
- Analytics tag input with platform selector

---

### Step 10: Admin & Staff Invitations
**File**: `AdminStaffInvitationsStep.tsx`

**Fields**:
- Admin team array:
  - Full name, role, email, phone
  - Status (pending, invited, active)
  - Scope hint, notes

**Features**:
- Table with add/edit/remove rows
- Role presets (Hospital Admin, HR Manager, Doctor Lead, Finance, etc.)
- Bulk invite option
- Resend invitation controls
- Status indicators
- Email validation on blur

---

### Step 11: Review & Submission
**File**: `ReviewSubmissionStep.tsx`

**Fields**:
- Completion status per step (computed)
- Publication plan (PhasedPublishSelector)
- Acknowledgements:
  - Terms & conditions
  - Privacy policy
  - Data processing agreement
  - AI usage policy

**Features**:
- Step completion dashboard (visual indicators)
- Outstanding validation summary
- Media gallery (all uploaded assets)
- Document checklist summary
- Checkbox for each acknowledgement
- Final submit button (disabled until all acks checked)
- Preview button to see final site

**Layout**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div>
    {/* Completion Dashboard */}
    {/* Validation Summary */}
    {/* Acknowledgements */}
  </div>
  <div>
    {/* Media Gallery */}
    {/* Document Checklist */}
    {/* Publication Plan */}
  </div>
</div>
```

---

## 📄 Main Page Updates

### Current State
- 3-step wizard with old context
- Simple progress sidebar
- Basic navigation

### Required Changes (`app/onboarding/hospital/page.tsx`)

1. **Import new context**:
```tsx
import { useHospitalOnboarding, HospitalOnboardingProvider } from '@/contexts/HospitalOnboardingContextV2';
```

2. **Update step configuration**:
```tsx
const steps: StepConfig[] = [
  { id: 0, title: 'Invitation & Template', icon: Mail, component: InvitationTemplateStep },
  { id: 1, title: 'Organization Profile', icon: Building2, component: OrganizationProfileStep },
  { id: 2, title: 'Locations & Contacts', icon: MapPin, component: LocationsContactsStep },
  { id: 3, title: 'Branding Studio', icon: Palette, component: BrandingStudioStep },
  { id: 4, title: 'Site Content', icon: FileText, component: SiteContentStep },
  { id: 5, title: 'Services & Pricing', icon: DollarSign, component: ServicesPricingStep },
  { id: 6, title: 'Leadership & Team', icon: Users, component: LeadershipTeamStep },
  { id: 7, title: 'Operational Policies', icon: ClipboardList, component: OperationalPoliciesStep },
  { id: 8, title: 'Compliance & Docs', icon: Shield, component: ComplianceDocumentationStep },
  { id: 9, title: 'Integrations', icon: Plug, component: IntegrationsPreferencesStep },
  { id: 10, title: 'Admin Invitations', icon: UserPlus, component: AdminStaffInvitationsStep },
  { id: 11, title: 'Review & Submit', icon: CheckCircle, component: ReviewSubmissionStep },
];
```

3. **Add contextual right panel**:
```tsx
<div className="hidden xl:flex xl:w-80 flex-shrink-0">
  <ContextualPanel currentStep={currentStep} />
</div>
```

4. **Add autosave indicator**:
```tsx
<div className="flex items-center space-x-2 text-xs text-gray-500">
  <Clock className="w-3 h-3" />
  <span>Last saved: {data.metadata.last_saved_at ? formatDateTime(data.metadata.last_saved_at) : 'Never'}</span>
</div>
```

5. **Update submission handler**:
```tsx
const handleSubmit = async () => {
  const payload = buildSubmissionPayload();
  
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOSPITALS.ONBOARDING}?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  
  // ... handle response
};
```

6. **Add activity log sidebar toggle**:
```tsx
{showActivityLog && (
  <ActivityLog entries={activityLog} className="fixed right-4 top-20 w-80 shadow-xl" />
)}
```

---

## 🎨 UI/UX Patterns

### Form Field Pattern
```tsx
<FormField
  label="Field Name"
  required
  help={{
    title: 'Help Title',
    content: 'Description',
    examples: ['Example 1', 'Example 2'],
    tips: ['Tip 1', 'Tip 2'],
  }}
>
  <Input ... />
</FormField>
```

### Array Management Pattern
```tsx
const addItem = () => {
  updateData('section', {
    items: [...data.section.items, newItem]
  });
};

const updateItem = (id, updates) => {
  updateData('section', {
    items: data.section.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  });
};

const removeItem = (id) => {
  updateData('section', {
    items: data.section.items.filter(item => item.id !== id)
  });
};
```

### Validation Pattern
```tsx
const [errors, setErrors] = useState<{[key: string]: string}>({});

const validate = (field: string, value: any) => {
  if (field === 'email' && !isValidEmail(value)) {
    setErrors(prev => ({ ...prev, [field]: 'Invalid email format' }));
  } else {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }
};

<Input
  value={value}
  onChange={(e) => {
    handleChange(e.target.value);
    validate('email', e.target.value);
  }}
  className={errors.email ? 'border-red-500' : ''}
/>
{errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
```

---

## 🧪 Testing Checklist

### Unit Tests (React Testing Library)
- [ ] Template selection updates context
- [ ] Color contrast validation calculates correctly
- [ ] Autosave throttles properly (1s debounce)
- [ ] Payload mapper excludes File objects
- [ ] Cross-field validation (services → departments)
- [ ] LocalStorage save/load cycle
- [ ] Step validation functions return correct boolean
- [ ] Activity log entries are added correctly

### Integration Tests
- [ ] Complete flow from Step 0 → 11
- [ ] Token validation on mount
- [ ] File uploads trigger progress updates
- [ ] Geocoding updates location coordinates
- [ ] Form prefill from invitation draft
- [ ] Unsaved changes warning on exit
- [ ] Final submission payload structure

### E2E Tests (Playwright/Cypress)
- [ ] Navigate through all 12 steps
- [ ] Fill all required fields
- [ ] Upload files successfully
- [ ] Preview template in modal
- [ ] Submit onboarding successfully
- [ ] Redirect to success page

---

## 📦 API Endpoints (Backend Requirements)

### Required Endpoints
1. `POST /api/v1/super-admin/validate-token` ✅ (exists)
2. `POST /api/v1/uploads/branding` ✅ (exists)
3. `GET /hospitals/templates` (new - template list)
4. `GET /hospitals/templates/:id/preview` (new - template preview)
5. `PATCH /hospitals/onboarding/draft` (new - save draft)
6. `POST /hospitals/onboarding` ✅ (exists - submit final)
7. `POST /hospitals/geocode` (new - address → lat/lng)
8. `GET /hospitals/subdomain/check` (new - availability)

### Expected Payload Structure
See `buildSubmissionPayload()` in HospitalOnboardingContextV2.tsx

---

## 🚀 Deployment Checklist

- [ ] All 12 step components implemented
- [ ] All widgets created
- [ ] Main page updated with new context
- [ ] API endpoints connected
- [ ] File uploads working
- [ ] Validation complete
- [ ] Error handling in place
- [ ] Loading states for async operations
- [ ] Accessibility tested (keyboard nav, screen readers)
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Browser compatibility checked
- [ ] Performance optimized (lazy loading, code splitting)
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Documentation complete

---

## 💡 Future Enhancements

1. **Real-time collaboration** - WebSocket for multi-user editing
2. **AI content suggestions** - Hook up to LLM for hero text, descriptions
3. **Template customization** - Visual editor for template tweaking
4. **Analytics dashboard** - Track onboarding funnel drop-off
5. **Mobile app** - Native iOS/Android for on-the-go setup
6. **White-label** - Multi-tenant with custom branding per tenant
7. **Audit trail** - Full history of changes with rollback
8. **Approval workflow** - Multi-stage review before go-live

---

## 📞 Support

For implementation questions or issues:
- Check console for validation errors
- Review activity log for action history
- Verify LocalStorage keys: `hospital-onboarding-{invitation_id}`
- Check network tab for API call failures
- Ensure token is valid and not expired

---

**Last Updated**: November 15, 2025  
**Version**: 2.0.0  
**Status**: 75% Complete (Steps 0-3 implemented, 4-11 pending)
