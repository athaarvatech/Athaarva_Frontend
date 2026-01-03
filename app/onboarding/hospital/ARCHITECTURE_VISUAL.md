# Hospital Onboarding System - Architecture Diagram

## 📁 File Structure & Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                     HOSPITAL ONBOARDING SYSTEM                      │
│                      (12-Step Comprehensive Wizard)                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         📂 CORE INFRASTRUCTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  /contexts/HospitalOnboardingContextV2.tsx (721 lines)             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ✓ 12-step data model                                        │   │
│  │ ✓ Autosave (1s throttle)                                    │   │
│  │ ✓ Activity log tracking                                     │   │
│  │ ✓ Collaborator management                                   │   │
│  │ ✓ LocalStorage persistence                                  │   │
│  │ ✓ Validation logic (isStepValid)                            │   │
│  │ ✓ Payload builder (buildSubmissionPayload)                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  /lib/onboarding-utils.ts (487 lines)                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ WCAG: getContrastRatio, meetsWCAGAA, calculateScore        │   │
│  │ Upload: uploadBrandingAsset (XHR progress)                  │   │
│  │ Validation: GST, PAN, Pincode, Email, File                  │   │
│  │ Geocoding: geocodeAddress (mock)                            │   │
│  │ Utilities: countWords, formatFileSize, formatDateTime      │   │
│  │ Helpers: throttle, debounce                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  /lib/api-config.ts                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ SUPER_ADMIN.VALIDATE_TOKEN                                  │   │
│  │ UPLOADS.BRANDING                                            │   │
│  │ HOSPITALS.ONBOARDING                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

                                   ↓ ↓ ↓
                          (All components import from core)

┌─────────────────────────────────────────────────────────────────────┐
│                        📂 REUSABLE WIDGETS (7)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  /app/onboarding/hospital/widgets/                                  │
│                                                                     │
│  ┌────────────────────┐  ┌────────────────────┐                    │
│  │ TemplateGallery    │  │ FileUploadZone     │                    │
│  │ (264 lines)        │  │ (169 lines)        │                    │
│  │ ─────────────────  │  │ ─────────────────  │                    │
│  │ • Preview modal    │  │ • Drag & drop      │                    │
│  │ • Device switcher  │  │ • Progress bar     │                    │
│  │ • 5 templates      │  │ • Image preview    │                    │
│  └────────────────────┘  └────────────────────┘                    │
│                                                                     │
│  ┌────────────────────┐  ┌────────────────────┐                    │
│  │ ContrastChecker    │  │ HelpPopover        │                    │
│  │ (139 lines)        │  │ (51 lines)         │                    │
│  │ ─────────────────  │  │ ─────────────────  │                    │
│  │ • WCAG calculation │  │ • Contextual help  │                    │
│  │ • AA/AAA badges    │  │ • Popover UI       │                    │
│  └────────────────────┘  └────────────────────┘                    │
│                                                                     │
│  ┌────────────────────┐  ┌────────────────────┐                    │
│  │ DocumentChecklist  │  │ ActivityLog        │                    │
│  │ (204 lines)        │  │ (143 lines)        │                    │
│  │ ─────────────────  │  │ ─────────────────  │                    │
│  │ • Upload tracking  │  │ • Action timeline  │                    │
│  │ • Status badges    │  │ • Actor + step     │                    │
│  └────────────────────┘  └────────────────────┘                    │
│                                                                     │
│  ┌────────────────────┐                                             │
│  │ PhasedPublish      │                                             │
│  │ Selector (143)     │                                             │
│  │ ─────────────────  │                                             │
│  │ • Publish plans    │                                             │
│  │ • Date picker      │                                             │
│  └────────────────────┘                                             │
└─────────────────────────────────────────────────────────────────────┘

                                   ↓ ↓ ↓
                        (Widgets imported by step components)

┌─────────────────────────────────────────────────────────────────────┐
│                      📂 STEP COMPONENTS (12)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  /app/onboarding/hospital/steps/                                    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ✅ Step 0: InvitationTemplateStep (147 lines)               │  │
│  │    • Invitation recap (email, expiry, hospital name)        │  │
│  │    • Uses: TemplateGallery widget                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ✅ Step 1: OrganizationProfileStep (234 lines)              │  │
│  │    • Legal info, GST/PAN validation, timezone               │  │
│  │    • 3 sections: Legal, Tax, Regional                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ✅ Step 2: LocationsContactsStep (286 lines)                │  │
│  │    • Multiple locations, geocoding, headquarters            │  │
│  │    • LocationCard component (expand/collapse)               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ✅ Step 3: BrandingStudioStep (341 lines)                   │  │
│  │    • Colors (w/ presets), Typography, Assets                │  │
│  │    • Uses: ContrastChecker, FileUploadZone                  │  │
│  │    • Live accessibility score (0-100)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 🚧 Step 4: SiteContentStep (187 lines)                      │  │
│  │    • Hero section ✅ (headline, subheadline, CTAs)          │  │
│  │    • TODO: Services, Testimonials, FAQ, Blog               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 🚧 Steps 5-10: PlaceholderSteps.tsx                         │  │
│  │    • ServicesPricingStep (departments, fees)                │  │
│  │    • LeadershipTeamStep (cards, staffing plan)              │  │
│  │    • OperationalPoliciesStep (hours, cancellation)          │  │
│  │    • ComplianceDocumentationStep (uploads, DPO)             │  │
│  │    • IntegrationsPreferencesStep (messaging, analytics)     │  │
│  │    • AdminStaffInvitationsStep (multi-invite, roles)        │  │
│  │    ⚠️ Shows placeholder UI with specifications             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ✅ Step 11: ReviewSubmissionStep (324 lines)                │  │
│  │    • Completion percentage, status grid                     │  │
│  │    • Acknowledgement checkboxes (ToS, Privacy, DPA, AI)     │  │
│  │    • Media gallery, document summary                        │  │
│  │    • Uses: PhasedPublishSelector widget                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

                                   ↓ ↓ ↓
                        (Steps orchestrated by main page)

┌─────────────────────────────────────────────────────────────────────┐
│                    📂 MAIN ORCHESTRATOR                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  /app/onboarding/hospital/page_v2.tsx (850+ lines)                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Token Validation Flow                                       │   │
│  │ ├─ Loading screen (spinner)                                 │   │
│  │ ├─ Invalid token → Error screen                             │   │
│  │ └─ Valid token → Main content                               │   │
│  │                                                              │   │
│  │ Main Content Layout (3-column)                              │   │
│  │ ┌────────────┬──────────────────────────┬────────────────┐ │   │
│  │ │ Left       │ Center                   │ Right          │ │   │
│  │ │ Sidebar    │ Step Component           │ Activity Log   │ │   │
│  │ │ (Progress) │ (Current Step)           │ (Collapsible)  │ │   │
│  │ │            │                          │                │ │   │
│  │ │ • 12 steps │ • Step 0-11 components   │ • Action list  │ │   │
│  │ │ • Category │ • Animations (Framer)    │ • Actor + time │ │   │
│  │ │   breakdown│ • Validation feedback    │ • Step badges  │ │   │
│  │ │ • Jump nav │ • Next/Previous buttons  │                │ │   │
│  │ └────────────┴──────────────────────────┴────────────────┘ │   │
│  │                                                              │   │
│  │ Features                                                     │   │
│  │ ✓ Autosave indicator (last saved time)                      │   │
│  │ ✓ Progress bar (0-100%)                                     │   │
│  │ ✓ Exit confirmation dialog                                  │   │
│  │ ✓ Mobile responsive (375px, 768px, 1024px)                  │   │
│  │ ✓ Final submission handler (API call + redirect)            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  To Activate:                                                       │
│  $ mv page.tsx page_legacy.tsx                                      │
│  $ mv page_v2.tsx page.tsx                                          │
│  $ npm run dev                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      📂 DOCUMENTATION                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  README.md (800+ lines)                                             │
│  ├─ Architecture overview                                           │
│  ├─ Activation instructions                                         │
│  ├─ Progress breakdown (75% complete)                               │
│  ├─ UI/UX patterns                                                  │
│  ├─ API integration guide                                           │
│  ├─ Testing checklist                                               │
│  ├─ Deployment checklist                                            │
│  └─ Common issues & solutions                                       │
│                                                                     │
│  IMPLEMENTATION_GUIDE.md (513 lines)                                │
│  ├─ Completed components reference                                  │
│  ├─ Steps 5-10 specifications (detailed field lists)                │
│  ├─ Widget usage guidelines                                         │
│  ├─ Code examples for each pending step                             │
│  ├─ Testing strategies                                              │
│  └─ API endpoint documentation                                      │
│                                                                     │
│  COMPLETION_SUMMARY.md (400+ lines)                                 │
│  ├─ Mission accomplished overview                                   │
│  ├─ Code metrics (17 files, 5000+ lines)                            │
│  ├─ Deliverables checklist                                          │
│  ├─ Next steps for team (Priority 1-4)                              │
│  ├─ Success metrics                                                 │
│  └─ Tips for implementation                                         │
│                                                                     │
│  ARCHITECTURE_VISUAL.md (this file)                                 │
│  └─ Visual file structure & dependencies                            │
└─────────────────────────────────────────────────────────────────────┘

```

---

## 🔄 Data Flow

```
┌──────────────────┐
│   User Action    │
│ (Input change)   │
└────────┬─────────┘
         │
         ↓
┌────────────────────────────────┐
│    updateData(section, data)   │ ← Step Component
│ (Context method from hook)     │
└────────┬───────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│  HospitalOnboardingContextV2   │
│  ├─ Update state                │
│  ├─ Add activity log entry      │
│  ├─ Trigger autosave (1s)       │
│  └─ Validate step               │
└────────┬───────────────────────┘
         │
         ├──────────────────┐
         │                  │
         ↓                  ↓
┌─────────────────┐  ┌─────────────────┐
│  LocalStorage   │  │  Activity Log   │
│  (persistence)  │  │  (audit trail)  │
└─────────────────┘  └─────────────────┘
```

---

## 🎯 Component Dependencies

### Step 0 (InvitationTemplateStep)
```
InvitationTemplateStep
├─ useHospitalOnboarding() [context]
├─ TemplateGallery [widget]
│  └─ Dialog, Badge, Button [shadcn]
└─ InfoCard [local component]
```

### Step 3 (BrandingStudioStep)
```
BrandingStudioStep
├─ useHospitalOnboarding() [context]
├─ Tabs, TabsContent [shadcn]
├─ ContrastChecker [widget]
│  ├─ getContrastRatio() [utils]
│  └─ meetsWCAGAA() [utils]
├─ FileUploadZone [widget]
│  ├─ uploadBrandingAsset() [utils]
│  ├─ validateFile() [utils]
│  └─ formatFileSize() [utils]
└─ calculateAccessibilityScore() [utils]
```

### Step 11 (ReviewSubmissionStep)
```
ReviewSubmissionStep
├─ useHospitalOnboarding() [context]
├─ PhasedPublishSelector [widget]
│  └─ RadioGroup, Calendar [shadcn]
├─ Checkbox [shadcn]
├─ Progress [shadcn]
└─ buildSubmissionPayload() [context method]
```

---

## 🗂️ File Size Summary

| Category | Files | Total Lines | Status |
|----------|-------|-------------|--------|
| **Core Infrastructure** | 3 | ~1,700 | ✅ Complete |
| **Widgets** | 7 | ~1,200 | ✅ Complete |
| **Steps (Complete)** | 5 | ~1,500 | ✅ Complete |
| **Steps (Pending)** | 6 | ~1,000 (est.) | 🚧 Specs Ready |
| **Main Orchestrator** | 1 | ~850 | ✅ Complete |
| **Documentation** | 4 | ~2,200 | ✅ Complete |
| **TOTAL** | **20** | **~8,450** | **75% Complete** |

---

## 🚀 Quick Navigation

| Want to... | Go to... |
|------------|----------|
| **Activate the new wizard** | `README.md` → "Activation Instructions" |
| **Implement Steps 5-10** | `IMPLEMENTATION_GUIDE.md` → Lines 140-330 |
| **Understand context API** | `/contexts/HospitalOnboardingContextV2.tsx` |
| **Use utility functions** | `/lib/onboarding-utils.ts` |
| **See code patterns** | `COMPLETION_SUMMARY.md` → "Design Patterns" |
| **Test the system** | `README.md` → "Testing Checklist" |
| **Deploy to production** | `README.md` → "Deployment Checklist" |
| **Fix common errors** | `README.md` → "Common Issues" |

---

## 📊 Completion Status by Category

### Setup (Steps 0-2) - 100% ✅
- [x] Step 0: Invitation & Template
- [x] Step 1: Organization Profile  
- [x] Step 2: Locations & Contacts

### Branding (Steps 3-4) - 75% 🚧
- [x] Step 3: Branding Studio
- [~] Step 4: Site Content (hero done, needs 4 sections)

### Operations (Steps 5-10) - 0% 🚧
- [ ] Step 5: Services & Pricing
- [ ] Step 6: Leadership & Team
- [ ] Step 7: Operational Policies
- [ ] Step 8: Compliance & Documentation
- [ ] Step 9: Integrations & Preferences
- [ ] Step 10: Admin & Staff Invitations

### Review (Step 11) - 100% ✅
- [x] Step 11: Review & Submission

---

## 💻 Tech Stack

```
┌─────────────────────────────────────────────────┐
│              Frontend Stack                     │
├─────────────────────────────────────────────────┤
│ React 18            │ Next.js App Router        │
│ TypeScript          │ Tailwind CSS              │
│ Framer Motion       │ shadcn/ui                 │
│ React Context API   │ LocalStorage API          │
│ XHR (File Upload)   │ Fetch API                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              Backend Integration                │
├─────────────────────────────────────────────────┤
│ REST API            │ JWT Token Auth            │
│ FormData Upload     │ JSON Payloads             │
│ Token Validation    │ Invitation System         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              Accessibility                      │
├─────────────────────────────────────────────────┤
│ WCAG 2.0 AA/AAA     │ Contrast Ratio 4.5:1+     │
│ Keyboard Navigation │ Screen Reader Support     │
│ ARIA Labels         │ Focus Management          │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette Reference

```
Healthcare Primary:   #2E7D32  (Green)
Healthcare Emerald:   #10B981  (Success)
Healthcare Teal:      #0097A7  (Accent)
Healthcare Cool:      #F8F9FA  (Background)
Red (Error):          #DC2626
Amber (Warning):      #F59E0B
Gray (Text):          #212121
```

---

## 📞 Support & Resources

- **README.md** - Complete setup guide
- **IMPLEMENTATION_GUIDE.md** - Step specifications
- **COMPLETION_SUMMARY.md** - Project overview
- **Inline JSDoc** - Component documentation

**Ready to build? Start with Step 5!** 🚀

```bash
cd /app/onboarding/hospital/steps
# Copy pattern from OrganizationProfileStep.tsx
# Reference spec in IMPLEMENTATION_GUIDE.md lines 140-167
```
