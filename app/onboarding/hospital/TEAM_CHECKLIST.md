# ✅ Implementation Checklist for Team

## 🎯 Mission: Complete the Hospital Onboarding Rebuild

**Current Status**: 75% Complete (Foundation + 6/12 Steps)  
**Remaining Work**: 25% (Steps 5-10 + Testing)  
**Estimated Time**: 3-5 days for experienced React developers

---

## 📋 Phase 1: Quick Activation (30 minutes)

### Step 1: File Reorganization
- [ ] Navigate to `/app/onboarding/hospital/`
- [ ] Backup legacy implementation: `mv page.tsx page_legacy.tsx`
- [ ] Activate new wizard: `mv page_v2.tsx page.tsx`
- [ ] Verify imports are correct (should use `HospitalOnboardingContextV2`)

### Step 2: Environment Setup
- [ ] Ensure API_CONFIG points to correct backend URL
- [ ] Test token validation endpoint: `POST /api/super-admin/validate-token`
- [ ] Test asset upload endpoint: `POST /api/uploads/branding`
- [ ] Test onboarding submission endpoint: `POST /api/hospitals/onboarding`

### Step 3: Smoke Test
- [ ] Start dev server: `npm run dev`
- [ ] Visit: `http://localhost:3000/onboarding/hospital?token=TEST_TOKEN`
- [ ] Verify Step 0 loads (Invitation & Template Selection)
- [ ] Navigate through Steps 0-3 (should work fully)
- [ ] Check Step 4 (hero section should work, rest shows TODOs)
- [ ] Check Steps 5-10 (placeholder screens with specs)
- [ ] Jump to Step 11 (review dashboard should work)

### Step 4: Documentation Review
- [ ] Read `README.md` (main overview)
- [ ] Read `IMPLEMENTATION_GUIDE.md` (Steps 5-10 specs)
- [ ] Skim `COMPLETION_SUMMARY.md` (project status)
- [ ] Review `ARCHITECTURE_VISUAL.md` (file structure)

**✅ Phase 1 Complete**: New wizard is active and testable

---

## 📋 Phase 2: Complete Step 4 (1 day)

**File**: `/app/onboarding/hospital/steps/SiteContentStep.tsx`

### Services Highlights Section (2 hours)
- [ ] Create `ServiceHighlightCard` component
  - Fields: icon (dropdown), title, description (150 words max)
- [ ] Implement array management (add/edit/remove)
- [ ] Add icon picker (Lucide React icons: Heart, Shield, Clock, etc.)
- [ ] Update context data path: `data.siteContent.services_highlights`
- [ ] Add validation: minimum 3 cards required

### Testimonials Section (2 hours)
- [ ] Create `TestimonialCard` component
  - Fields: patient_name, rating (1-5 stars), testimonial (200 words), date
- [ ] Implement array management
- [ ] Add star rating selector (RadioGroup or custom component)
- [ ] Update context data path: `data.siteContent.testimonials`
- [ ] Add validation: minimum 2 testimonials

### FAQ Section (2 hours)
- [ ] Create `FAQItem` component with expand/collapse
  - Fields: question, answer (300 words max)
- [ ] Implement array management
- [ ] Add expand/collapse animation (Framer Motion)
- [ ] Update context data path: `data.siteContent.faq`
- [ ] Add validation: minimum 5 FAQ items

### Blog/News Teasers Section (2 hours)
- [ ] Create `BlogTeaserCard` component
  - Fields: title, excerpt (100 words), publish_date, author
- [ ] Implement array management
- [ ] Add date picker (shadcn Calendar component)
- [ ] Update context data path: `data.siteContent.blog_teasers`
- [ ] Add validation: exactly 3 teasers

### Final Step 4 Tasks
- [ ] Update `isStepValid()` in context to check all 4 sections
- [ ] Test form persistence (refresh page, check LocalStorage)
- [ ] Test step validation (try to proceed with incomplete data)
- [ ] Remove all TODO comments from file

**✅ Phase 2 Complete**: Step 4 fully functional

---

## 📋 Phase 3: Implement Steps 5-10 (2-3 days)

### Step 5: ServicesPricingStep (6 hours)

**File**: Create `/app/onboarding/hospital/steps/ServicesPricingStep.tsx`

**Reference**: `IMPLEMENTATION_GUIDE.md` lines 140-167

#### Tasks:
- [ ] Create department tag input (shadcn Badge + Input)
  - Predefined suggestions: Cardiology, Orthopedics, Neurology, etc.
- [ ] Create procedures tag input
  - Predefined suggestions: MRI, CT Scan, X-Ray, etc.
- [ ] Create consultation types multi-checkbox
  - Options: In-Person, Telehealth, Home Visit
- [ ] Create services array with `ServiceCard` component
  - Fields: name, department (dropdown from tags), description, fee_min, fee_max, locations (multi-select), insurance_accepted (boolean)
  - Add/edit/remove functionality
  - Fee range validation (min <= max)
- [ ] Create insurance partnerships tag input
- [ ] Update context: `data.servicesPricing`
- [ ] Add validation logic in `isStepValid()` (case 5)
- [ ] Test cross-field validation (services reference existing departments)

---

### Step 6: LeadershipTeamStep (4 hours)

**File**: Create `/app/onboarding/hospital/steps/LeadershipTeamStep.tsx`

**Reference**: `IMPLEMENTATION_GUIDE.md` lines 169-189

#### Tasks:
- [ ] Create `LeadershipCard` component
  - Fields: name, role, bio (300 words), photo (FileUploadZone), linkedin_url
  - Add/edit/remove functionality
- [ ] Create staffing plan table
  - Columns: role (dropdown), count (number), status (dropdown: Filled/Hiring/Planned)
  - Editable rows (inline editing or modal)
- [ ] Update context: `data.leadershipTeam`
- [ ] Add validation logic in `isStepValid()` (case 6)
- [ ] Test photo upload with FileUploadZone widget
- [ ] Test LinkedIn URL validation (regex: `^https://www.linkedin.com/.*$`)

---

### Step 7: OperationalPoliciesStep (5 hours)

**File**: Create `/app/onboarding/hospital/steps/OperationalPoliciesStep.tsx`

**Reference**: `IMPLEMENTATION_GUIDE.md` lines 191-216

#### Tasks:
- [ ] Create operating hours selector per location
  - Day checkboxes (Mon-Sun)
  - Time range pickers (start/end)
  - Repeat per location from Step 2
- [ ] Create appointment lead time input (hours, minimum 4)
- [ ] Create cancellation policy textarea (500 words max)
- [ ] Create no-show policy textarea (500 words max)
- [ ] Create telehealth SOP textarea (800 words max)
- [ ] Create patient onboarding steps array
  - Fields: step_number (auto), title, description (150 words)
  - Add/edit/remove/reorder functionality
- [ ] Update context: `data.operationalPolicies`
- [ ] Add validation logic in `isStepValid()` (case 7)
- [ ] Test word count warnings (use `countWords()` from utils)

---

### Step 8: ComplianceDocumentationStep (4 hours)

**File**: Create `/app/onboarding/hospital/steps/ComplianceDocumentationStep.tsx`

**Reference**: `IMPLEMENTATION_GUIDE.md` lines 218-243

#### Tasks:
- [ ] Integrate `DocumentChecklist` widget from `/widgets/`
- [ ] Create documents array
  - Fields: type (dropdown: Accreditation, License, Insurance, Fire Safety, etc.), file (FileUploadZone), expiry_date (Calendar), status (auto: Not Uploaded, Pending, Verified)
  - Add/edit/remove functionality
- [ ] Create DPO contact form
  - Fields: name, email, phone
  - Validation: email format, phone 10 digits
- [ ] Create consent templates array
  - Fields: type (dropdown: Treatment, Data Sharing, etc.), file (FileUploadZone)
  - Add/edit/remove functionality
- [ ] Update context: `data.compliance`
- [ ] Add validation logic in `isStepValid()` (case 8)
- [ ] Test expiry date warnings (< 30 days, expired)

---

### Step 9: IntegrationsPreferencesStep (3 hours)

**File**: Create `/app/onboarding/hospital/steps/IntegrationsPreferencesStep.tsx`

**Reference**: `IMPLEMENTATION_GUIDE.md` lines 245-272

#### Tasks:
- [ ] Create messaging channels multi-checkbox
  - Options: SMS, Email, WhatsApp, Push Notifications
- [ ] Create analytics tags array
  - Fields: platform (dropdown: Google Analytics, Mixpanel, etc.), tag_id (input)
  - Add/edit/remove functionality
- [ ] Create LLM opt-in toggle with explanation
  - Label: "Allow AI-assisted features (anonymized data)"
  - Help text explaining usage
- [ ] Create telehealth provider dropdown
  - Options: Zoom, Microsoft Teams, Google Meet, Custom
- [ ] Create patient portal modules multi-checkbox
  - Options: Appointments, Medical Records, Billing, Prescriptions, Lab Reports, Telemedicine
- [ ] Update context: `data.integrations`
- [ ] Add validation logic in `isStepValid()` (case 9)
- [ ] Test conditional fields (if Custom telehealth, show URL input)

---

### Step 10: AdminStaffInvitationsStep (4 hours)

**File**: Create `/app/onboarding/hospital/steps/AdminStaffInvitationsStep.tsx`

**Reference**: `IMPLEMENTATION_GUIDE.md` lines 274-300

#### Tasks:
- [ ] Create admin team invitation table
  - Columns: name, role (preset dropdown), email, phone, status (Pending/Sent/Accepted), actions
  - Add/edit/remove functionality
  - Inline editing or modal
- [ ] Create role presets dropdown
  - Options: Hospital Admin, HR Manager, Doctor Lead, Nurse Lead, Receptionist, IT Admin
  - Each preset has predefined permissions (display in tooltip)
- [ ] Create scope hints checkboxes
  - Options: Full Access, Department-Specific, Location-Specific
- [ ] Create notes field per invitation
- [ ] Add bulk invite option (CSV upload)
  - CSV format: name,email,role,phone
  - Parse and validate CSV data
- [ ] Add resend invitation button (per row)
- [ ] Update context: `data.adminTeam`
- [ ] Add validation logic in `isStepValid()` (case 10)
- [ ] Test email validation (no duplicates)

---

## 📋 Phase 4: Update Validation Logic (1 hour)

**File**: `/contexts/HospitalOnboardingContextV2.tsx`

### Update `isStepValid()` function

Add cases for Steps 5-10:

```typescript
case 5: // ServicesPricingStep
  return (
    data.servicesPricing.departments.length > 0 &&
    data.servicesPricing.procedures.length > 0 &&
    data.servicesPricing.consultation_types.length > 0 &&
    data.servicesPricing.services.length > 0 &&
    data.servicesPricing.services.every(s => 
      s.name && s.department && s.fee_min && s.fee_max && s.fee_min <= s.fee_max
    )
  );

case 6: // LeadershipTeamStep
  return (
    data.leadershipTeam.leadership.length >= 1 &&
    data.leadershipTeam.leadership.every(l => l.name && l.role && l.bio) &&
    data.leadershipTeam.staffing_plan.length > 0
  );

case 7: // OperationalPoliciesStep
  return (
    data.operationalPolicies.operating_hours.length > 0 &&
    data.operationalPolicies.appointment_lead_time >= 4 &&
    data.operationalPolicies.cancellation_policy &&
    data.operationalPolicies.no_show_policy
  );

case 8: // ComplianceDocumentationStep
  return (
    data.compliance.documents.length >= 3 &&
    data.compliance.documents.every(d => d.type && d.file) &&
    data.compliance.dpo_contact.name &&
    data.compliance.dpo_contact.email &&
    data.compliance.dpo_contact.phone
  );

case 9: // IntegrationsPreferencesStep
  return (
    data.integrations.messaging_channels.length > 0 &&
    data.integrations.patient_portal_modules.length > 0
  );

case 10: // AdminStaffInvitationsStep
  return (
    data.adminTeam.invitations.length >= 1 &&
    data.adminTeam.invitations.every(i => i.name && i.email && i.role)
  );
```

- [ ] Add all 6 validation cases
- [ ] Test each step (try proceeding with incomplete data)
- [ ] Update tests if validation logic changes

---

## 📋 Phase 5: Update Payload Builder (1 hour)

**File**: `/contexts/HospitalOnboardingContextV2.tsx`

### Update `buildSubmissionPayload()` function

Ensure all 12 steps are included:

```typescript
const buildSubmissionPayload = () => {
  const stripFiles = (obj: any): any => {
    // ... existing logic
  };

  return {
    // Steps 0-4 (already implemented)
    invitation: stripFiles(data.invitation),
    template: stripFiles(data.template),
    organizationProfile: stripFiles(data.organizationProfile),
    locations: stripFiles(data.locations),
    branding: stripFiles(data.branding),
    siteContent: stripFiles(data.siteContent),
    
    // Steps 5-10 (add these)
    servicesPricing: stripFiles(data.servicesPricing),
    leadershipTeam: stripFiles(data.leadershipTeam),
    operationalPolicies: stripFiles(data.operationalPolicies),
    compliance: stripFiles(data.compliance),
    integrations: stripFiles(data.integrations),
    adminTeam: stripFiles(data.adminTeam),
    
    // Step 11 (already implemented)
    review: stripFiles(data.review),
    
    metadata: {
      completed_at: new Date().toISOString(),
      steps_completed: STEP_CONFIGS.length,
      invitation_id: data.metadata.invitation_id,
    }
  };
};
```

- [ ] Add all 6 new sections to payload
- [ ] Test payload structure (log to console before submission)
- [ ] Verify File objects are stripped (payload should be JSON-serializable)

---

## 📋 Phase 6: Testing (1-2 days)

### Unit Tests (React Testing Library)

**Create**: `/app/onboarding/hospital/__tests__/`

#### Context Tests
- [ ] `HospitalOnboardingContext.test.tsx`
  - Test `updateData()` updates state correctly
  - Test `isStepValid()` returns correct boolean per step
  - Test `buildSubmissionPayload()` excludes File objects
  - Test autosave throttling (use jest fake timers)
  - Test localStorage persistence

#### Utility Tests
- [ ] `onboarding-utils.test.ts`
  - Test `getContrastRatio()` calculates correctly
  - Test `meetsWCAGAA()` with various color pairs
  - Test `isValidGSTNumber()` with valid/invalid GSTs
  - Test `isValidPANNumber()` with valid/invalid PANs
  - Test `countWords()` with various strings
  - Test `formatFileSize()` with different byte sizes

#### Widget Tests
- [ ] `TemplateGallery.test.tsx`
  - Test template selection updates context
  - Test preview modal opens/closes
  - Test device switcher changes preview
- [ ] `ContrastChecker.test.tsx`
  - Test contrast ratio display
  - Test WCAG level badges (AA/AAA/Fail)
- [ ] `FileUploadZone.test.tsx`
  - Test file validation (size, type)
  - Test upload progress tracking
  - Test file removal

#### Step Tests (for each step 0-11)
- [ ] Test step renders without crashing
- [ ] Test form fields update context
- [ ] Test validation (required fields)
- [ ] Test array management (add/remove items)
- [ ] Test navigation (next/previous disabled states)

### Integration Tests
- [ ] Token validation flow (valid/invalid/expired)
- [ ] Multi-step navigation (next/previous/jump)
- [ ] Asset upload with mock FormData
- [ ] Draft saving and resumption (localStorage)
- [ ] Final submission payload structure

### E2E Tests (Playwright or Cypress)
- [ ] Complete onboarding flow (all 12 steps)
- [ ] Browser back/forward handling
- [ ] Tab close warning (unsaved changes)
- [ ] Mobile responsive (375px, 768px, 1024px)
- [ ] Keyboard navigation (tab, enter, arrow keys)
- [ ] Screen reader compatibility (ARIA labels)

### Manual Testing Checklist
- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on iOS Safari (mobile)
- [ ] Test on Android Chrome (mobile)
- [ ] Test slow network (3G throttling)
- [ ] Test file upload with large files (>5MB)
- [ ] Test long text inputs (exceed word limits)
- [ ] Test invalid email formats
- [ ] Test date pickers (past dates, future dates)
- [ ] Test contrast checker with extreme colors (#000 vs #001)

**Coverage Target**: 80%+ for core logic

---

## 📋 Phase 7: Polish & Documentation (1 day)

### Code Quality
- [ ] Run linter: `npm run lint` (fix all errors)
- [ ] Run type checker: `npx tsc --noEmit` (fix all errors)
- [ ] Format code: `npm run format` (if Prettier configured)
- [ ] Remove console.logs from production code
- [ ] Remove commented-out code
- [ ] Add JSDoc comments to complex functions
- [ ] Check for TODO comments (resolve or document)

### Accessibility
- [ ] Run Lighthouse audit (target: >95 accessibility score)
- [ ] Run axe DevTools scan (fix all violations)
- [ ] Test keyboard navigation (no focus traps)
- [ ] Test screen reader (VoiceOver on Mac, NVDA on Windows)
- [ ] Check color contrast (all text ≥4.5:1)
- [ ] Check form labels (all inputs have labels)
- [ ] Check focus indicators (visible :focus states)

### Performance
- [ ] Run Lighthouse performance audit (target: >90)
- [ ] Check bundle size: `npm run build && npm run analyze`
- [ ] Optimize images (compress, use WebP)
- [ ] Lazy load off-screen components
- [ ] Code split heavy steps (if bundle >500KB)

### Documentation
- [ ] Update README.md (mark Steps 5-10 as complete)
- [ ] Update COMPLETION_SUMMARY.md (100% complete)
- [ ] Add inline comments to complex logic
- [ ] Create API integration guide for backend team
- [ ] Document environment variables (if any)
- [ ] Create troubleshooting guide (common errors)

---

## 📋 Phase 8: Deployment (1 day)

### Pre-Production Checklist
- [ ] Merge feature branch to `develop`
- [ ] Run full test suite: `npm run test`
- [ ] Build for production: `npm run build`
- [ ] Test production build locally: `npm run start`
- [ ] Check for build warnings (resolve or document)
- [ ] Update API_CONFIG for staging environment
- [ ] Deploy to staging server
- [ ] Run smoke tests on staging
- [ ] Get QA approval

### Production Checklist
- [ ] Update API_CONFIG for production environment
- [ ] Set up CDN for asset uploads (if not done)
- [ ] Configure error tracking (Sentry/Rollbar)
- [ ] Set up analytics (Mixpanel/Amplitude)
- [ ] Configure rate limiting on API endpoints
- [ ] Set up monitoring alerts (submission failures)
- [ ] Create rollback plan (keep `page_legacy.tsx`)
- [ ] Deploy to production
- [ ] Monitor error logs (first 24 hours)
- [ ] Track completion rates by step
- [ ] Get stakeholder sign-off

---

## 📋 Phase 9: Post-Launch (Ongoing)

### Week 1
- [ ] Monitor completion rates per step
- [ ] Track drop-off points
- [ ] Analyze average time per step
- [ ] Collect user feedback (surveys, support tickets)
- [ ] Fix critical bugs (P0/P1)

### Week 2-4
- [ ] Implement quick wins from feedback
- [ ] Optimize slow steps (if >5 min avg)
- [ ] Add missing help text/tooltips
- [ ] Improve validation messages
- [ ] Plan Phase 2 features (see COMPLETION_SUMMARY.md)

---

## 🎯 Success Criteria

### Completion Metrics
- [ ] **100% of steps implemented** (0-11)
- [ ] **80%+ test coverage** (unit + integration)
- [ ] **95+ Lighthouse accessibility score**
- [ ] **90+ Lighthouse performance score**
- [ ] **Zero critical bugs** in production

### User Metrics (to track post-launch)
- [ ] **<45 min average completion time** (full 12 steps)
- [ ] **<10% drop-off rate per step**
- [ ] **>60% mobile completion rate**
- [ ] **<1% API error rate**

---

## 📞 Support & Resources

### If You Get Stuck:
1. Check `IMPLEMENTATION_GUIDE.md` for detailed specs
2. Review completed steps (0-4, 11) for patterns
3. Read inline JSDoc comments in context/utils
4. Search for similar implementations (e.g., LocationsContactsStep for array management)
5. Test in isolation (create test file for component)

### Common Patterns:
- **Array Management**: See `LocationsContactsStep.tsx` lines 50-120
- **File Upload**: See `BrandingStudioStep.tsx` lines 180-220
- **Validation**: See `OrganizationProfileStep.tsx` lines 80-100
- **Animations**: See `page_v2.tsx` lines 720-740

---

## 🎉 You've Got This!

**Estimated Total Time**: 3-5 days for 2 developers

**Priority Order**:
1. Phase 1 (Activation) - 30 min
2. Phase 3 (Steps 5-10) - 2-3 days **← Start here**
3. Phase 2 (Step 4 completion) - 1 day
4. Phase 4-5 (Validation + Payload) - 2 hours
5. Phase 6 (Testing) - 1-2 days
6. Phase 7-8 (Polish + Deploy) - 2 days

**The foundation is solid. The patterns are proven. The specs are detailed.**

Let's ship this! 🚀
