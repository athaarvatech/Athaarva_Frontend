# 🏥 Athaarva Hospital Onboarding Flow - Task Breakdown

> **Created:** January 15, 2026  
> **Purpose:** Comprehensive task prompts for implementing secure hospital onboarding flow  
> **Priority:** High - Production Critical  

---

## 📋 Table of Contents

1. [Super Admin Security & Accessibility](#task-1-super-admin-security--accessibility)
2. [Hospital Invitation Flow Security](#task-2-hospital-invitation-flow-security)
3. [Welcome Modal & Walkthrough UX](#task-3-welcome-modal--walkthrough-ux)
4. [Template Preview & CSS Fixes](#task-4-template-preview--css-fixes)
5. [Image Toolbox Enhancement](#task-5-image-toolbox-enhancement)
6. [Auto-Save Branding Details](#task-6-auto-save-branding-details)
7. [Custom Hospital Login Page Builder](#task-7-custom-hospital-login-page-builder)
8. [Authentication System with 2FA](#task-8-authentication-system-with-2fa)
9. [Patient Signup Flow](#task-9-patient-signup-flow)
10. [Document Template Design System](#task-10-document-template-design-system)
11. [Admin Setup & Domain Configuration](#task-11-admin-setup--domain-configuration)
12. [Post-Onboarding Redirect Flow](#task-12-post-onboarding-redirect-flow)
13. [Hospital Selector Page Revamp](#task-13-hospital-selector-page-revamp)

---

## Task 1: Super Admin Security & Accessibility

### Current State
- ✅ Super admin has password protection
- ✅ Route obfuscation exists (`/platform-ctrl-9x7k2m`)
- ❌ Still discoverable if someone guesses the path

### Requirements
Make the super admin panel extremely secure and hidden from public access.

### Detailed Implementation Prompt

```
TASK: Enhance Super Admin Security Layer

CONTEXT:
- Current path: /platform-ctrl-9x7k2m (obfuscated from /super-admin)
- Has password protection via HospitalAdminMFAAuthContext
- IP whitelist partially implemented in backend

IMPLEMENT THE FOLLOWING SECURITY MEASURES:

1. **IP Whitelist Enforcement (Backend)**
   - File: `app/routes/super_admin_security.py`
   - Create middleware that checks IP against whitelist
   - Whitelist should be stored in database (iam.ip_whitelist table)
   - Allow VPN IPs to be added dynamically by existing super admins
   - Return 404 (not 403) for non-whitelisted IPs to hide existence

2. **Honeypot Decoy Routes**
   - Create `/admin`, `/super-admin`, `/dashboard/admin` routes
   - These should log IP + user-agent + timestamp to security audit table
   - Return fake "Page Not Found" after delay (to waste attacker time)
   - Auto-block IPs that hit these routes 3+ times

3. **Time-Based Access Windows**
   - Add `allowed_hours_start` and `allowed_hours_end` to super_admin config
   - Reject access outside business hours (configurable per timezone)
   - Send alert to primary admin if access attempted outside hours

4. **Secret URL Token**
   - Instead of just obfuscated path, require a rotating secret token
   - URL format: `/platform-ctrl-9x7k2m?key=ROTATING_SECRET`
   - Secret rotates every 24 hours, sent via secure channel (SMS/Authenticator)
   - Without valid key, return 404

5. **Browser Fingerprinting**
   - Store browser fingerprint on first successful login
   - If new fingerprint detected, require additional verification
   - Use libraries like FingerprintJS or custom implementation

6. **Audit Everything**
   - Log all access attempts (successful and failed) with:
     - IP address, User-Agent, Timestamp
     - Geolocation (via IP lookup)
     - Action performed
   - Send real-time alerts for suspicious activity

7. **Self-Destruct Mode**
   - If 5 failed login attempts, lock account for 1 hour
   - If 10 failed attempts, require manual unlock by another super admin
   - If anomaly detected (impossible travel, etc.), auto-lock all sessions

FILES TO MODIFY:
- Backend: app/routes/super_admin_security.py (create new)
- Backend: app/core/security_middleware.py (create new)
- Frontend: app/platform-ctrl-9x7k2m/layout.tsx
- Frontend: middleware.ts (add security checks)
- Database: migrations/phase5_super_admin_hardening.sql

SECURITY ARCHITECTURE:
Request → IP Check → Time Window Check → Token Validation → 
Browser Fingerprint → MFA → Session Creation → Audit Log
```

---

## Task 2: Hospital Invitation Flow Security

### Current State
- ✅ Token validation exists in middleware
- ✅ Invalid token page exists
- ❌ Token validation is fail-open in development

### Requirements
Make the `/onboarding/hospital` route completely inaccessible without a valid token.

### Detailed Implementation Prompt

```
TASK: Secure Hospital Onboarding Token-Gated Access

CONTEXT:
- Route: /onboarding/hospital
- Currently validates token in middleware.ts (lines 91-138)
- Backend endpoint: /api/v1/onboarding/validate-token
- Invalid token redirects to /onboarding/hospital/invalid-token

IMPLEMENT THE FOLLOWING:

1. **Strict Token Validation (Backend)**
   File: app/routes/onboarding.py
   
   - Token structure: JWT with claims:
     - invitation_id, hospital_name, email, created_at, expires_at
     - Signature with server secret
   - Validation checks:
     - Token not expired (7 days default)
     - Token not already used (status != 'accepted')
     - Token not revoked
     - One-time use flag (optional)
   
   API Response:
   {
     "valid": boolean,
     "invitation_id": uuid,
     "email": string,
     "hospital_name": string,
     "owner_name": string,
     "expires_at": datetime,
     "remaining_uses": number (if multi-use),
     "message": string
   }

2. **Token Acceptance Flow**
   - When user lands on onboarding page with valid token:
     a. POST /api/v1/onboarding/accept-token with the token
     b. Backend marks invitation as "in_progress"
     c. Creates an onboarding_session with session_token
     d. Returns session_token for subsequent API calls
   - If user leaves and returns:
     a. Token still valid → resume from saved progress
     b. Token expired → show expired message with contact support

3. **Session Management**
   - Create onboarding session cookie (httpOnly, secure)
   - Session expires after 24 hours of inactivity
   - Session persists across browser closes
   - Store progress in session, not just localStorage

4. **Rate Limiting**
   - Max 5 token validation attempts per IP per hour
   - Max 3 onboarding sessions per invitation
   - Block suspicious patterns (rapid page loads, etc.)

5. **Audit Trail**
   - Log all token validation attempts
   - Log onboarding step completions
   - Log submission events

6. **Remove Development Bypass**
   File: app/onboarding/hospital/page.tsx (lines 152-171)
   
   - Remove or comment out the development bypass code
   - Use environment variable to enable test mode only in local dev
   - In test mode, require special test tokens that are clearly marked

MIDDLEWARE UPDATES (middleware.ts):

```typescript
// Hospital Onboarding: Validate invitation token
if (pathname.startsWith('/onboarding/hospital') && 
    pathname !== '/onboarding/hospital/invalid-token') {
  
  const token = request.nextUrl.searchParams.get('token');
  
  // No token = immediate redirect (no exceptions)
  if (!token) {
    return NextResponse.redirect(
      new URL('/onboarding/hospital/invalid-token?reason=missing', request.url)
    );
  }

  // Validate token format before API call (basic sanity check)
  if (token.length < 32 || token.length > 512) {
    return NextResponse.redirect(
      new URL('/onboarding/hospital/invalid-token?reason=malformed', request.url)
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/onboarding/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    // API error = fail closed (redirect to error page)
    if (!response.ok) {
      return NextResponse.redirect(
        new URL('/onboarding/hospital/invalid-token?reason=validation_failed', request.url)
      );
    }

    const data = await response.json();
    
    if (!data.valid) {
      // Specific error handling
      const reason = data.status || 'invalid';
      return NextResponse.redirect(
        new URL(`/onboarding/hospital/invalid-token?reason=${reason}`, request.url)
      );
    }

    // Valid token - proceed with headers
    const nextResponse = NextResponse.next();
    nextResponse.headers.set('x-invitation-token', token);
    nextResponse.headers.set('x-invitation-email', data.email || '');
    nextResponse.headers.set('x-hospital-name', encodeURIComponent(data.hospital_name || ''));
    nextResponse.headers.set('x-owner-name', encodeURIComponent(data.owner_name || ''));
    return nextResponse;

  } catch (error) {
    // Network error = fail closed in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(
        new URL('/onboarding/hospital/invalid-token?reason=network_error', request.url)
      );
    }
    // Only allow through in development with explicit flag
    if (process.env.ALLOW_ONBOARDING_BYPASS !== 'true') {
      return NextResponse.redirect(
        new URL('/onboarding/hospital/invalid-token?reason=network_error', request.url)
      );
    }
    return NextResponse.next();
  }
}
```

FILES TO CREATE/MODIFY:
- Backend: app/routes/onboarding.py (enhance validation)
- Backend: app/models/onboarding/schemas.py (add session schema)
- Frontend: middleware.ts (strict validation)
- Frontend: app/onboarding/hospital/page.tsx (remove dev bypass)
- Database: Add onboarding_sessions table
```

---

## Task 3: Welcome Modal & Walkthrough UX

### Current State
- ✅ WelcomeModal.tsx exists with personalized greeting
- ✅ WalkthroughOverlay.tsx exists
- ❌ Not integrated into main onboarding flow
- ❌ Modal doesn't have centered popup with blurred background styling

### Requirements
- Show centered welcome popup with blurred background on first visit
- After closing, trigger walkthrough that guides user through template tool

### Detailed Implementation Prompt

```
TASK: Integrate Welcome Modal & Walkthrough into Onboarding Flow

CONTEXT:
- WelcomeModal: components/onboarding/WelcomeModal.tsx
- WalkthroughOverlay: components/onboarding/WalkthroughOverlay.tsx
- Main page: app/onboarding/hospital/page.tsx
- First step: InvitationTemplateStep.tsx

IMPLEMENT THE FOLLOWING:

1. **Welcome Modal Integration**
   File: app/onboarding/hospital/page.tsx
   
   Add state management for modal visibility:
   ```tsx
   const [showWelcomeModal, setShowWelcomeModal] = useState(true);
   const [showWalkthrough, setShowWalkthrough] = useState(false);
   const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
     if (typeof window !== 'undefined') {
       return localStorage.getItem(`onboarding-welcome-${token}`) === 'true';
     }
     return false;
   });
   
   // Show welcome modal only on first visit
   useEffect(() => {
     if (!hasSeenWelcome && validationData?.valid) {
       setShowWelcomeModal(true);
     }
   }, [hasSeenWelcome, validationData]);
   
   const handleWelcomeStart = () => {
     setShowWelcomeModal(false);
     localStorage.setItem(`onboarding-welcome-${token}`, 'true');
     setHasSeenWelcome(true);
     // Trigger walkthrough after modal closes
     setTimeout(() => setShowWalkthrough(true), 500);
   };
   ```

2. **Update Welcome Modal Styling**
   File: components/onboarding/WelcomeModal.tsx
   
   Current backdrop is correct (bg-black/40 backdrop-blur-sm), but enhance:
   - Increase blur: `backdrop-blur-md`
   - Add subtle animation to background
   - Center the modal more prominently
   
   ```tsx
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 z-[100] flex items-center justify-center p-4"
   >
     {/* Enhanced backdrop */}
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
       onClick={onStart}
     />
     
     {/* Modal content with enhanced entrance */}
     <motion.div
       initial={{ opacity: 0, scale: 0.8, y: 40 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       exit={{ opacity: 0, scale: 0.9, y: 20 }}
       transition={{ type: "spring", damping: 20, stiffness: 300 }}
       className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
     >
   ```

3. **Populate Modal with Invitation Data**
   Pass validated data to modal:
   ```tsx
   <WelcomeModal
     hospitalName={validationData?.hospital_name}
     ownerName={validationData?.owner_name}
     ownerEmail={validationData?.email}
     isOpen={showWelcomeModal}
     onStart={handleWelcomeStart}
   />
   ```

4. **Walkthrough Integration**
   File: app/onboarding/hospital/page.tsx
   
   After welcome modal closes, show walkthrough:
   ```tsx
   {showWalkthrough && (
     <WalkthroughOverlay
       steps={[
         {
           target: '[data-walkthrough="template-gallery"]',
           title: "Choose Your Template",
           description: "Select a template that best represents your hospital's brand. You can customize colors and content in the next steps.",
         },
         {
           target: '[data-walkthrough="template-preview"]',
           title: "Preview Your Selection",
           description: "Click 'Preview' to see how your website will look on different devices.",
         },
         {
           target: '[data-walkthrough="next-button"]',
           title: "Continue When Ready",
           description: "Once you've selected a template, click 'Next' to proceed with your hospital profile.",
         },
       ]}
       onComplete={() => setShowWalkthrough(false)}
     />
   )}
   ```

5. **Add Data Attributes for Walkthrough Targets**
   File: app/onboarding/hospital/widgets/TemplateGallery.tsx
   
   Add targeting attributes:
   ```tsx
   <div data-walkthrough="template-gallery" className="...">
     {/* Gallery content */}
   </div>
   
   <Button data-walkthrough="template-preview">
     Preview
   </Button>
   ```

6. **Step Rename: "Invitation & Template" → "Website Template"**
   File: app/onboarding/hospital/page.tsx (STEP_CONFIGS)
   
   ```tsx
   {
     id: 0,
     title: "Website Template",  // Changed from "Invitation & Template"
     description: "Select and customize your hospital website template",
     icon: Sparkles,
     component: InvitationTemplateStep,
     category: "Setup",
     estimatedMinutes: 3,
   },
   ```

FILES TO MODIFY:
- app/onboarding/hospital/page.tsx (main orchestrator)
- components/onboarding/WelcomeModal.tsx (styling enhancements)
- components/onboarding/WalkthroughOverlay.tsx (ensure it works with targets)
- app/onboarding/hospital/widgets/TemplateGallery.tsx (add data attributes)
- app/onboarding/hospital/steps/InvitationTemplateStep.tsx (add data attributes)
```

---

## Task 4: Template Preview & CSS Fixes

### Current State
- ❌ Preview button has visibility/CSS issues
- ❌ Section previews show only half of the actual space

### Requirements
- Fix preview button styling to be properly visible
- Make section previews show complete/full space

### Detailed Implementation Prompt

```
TASK: Fix Template Preview Button & Section Preview Styling

CONTEXT:
- TemplateGallery widget: app/onboarding/hospital/widgets/TemplateGallery.tsx
- TemplatePreview component: components/onboarding/TemplatePreview.tsx
- Issue 1: Preview button not properly visible
- Issue 2: Section previews truncated

IMPLEMENT THE FOLLOWING:

1. **Fix Preview Button Styling**
   File: app/onboarding/hospital/widgets/TemplateGallery.tsx
   
   Current issue: Button may be hidden behind overlays or have wrong z-index
   
   ```tsx
   {/* Preview Button - Fixed Styling */}
   <Button
     variant="outline"
     size="sm"
     onClick={(e) => {
       e.stopPropagation(); // Prevent card selection
       handlePreview(template);
     }}
     className={cn(
       "absolute top-3 right-3 z-20",
       "bg-white/95 backdrop-blur-sm",
       "border-2 border-healthcare-primary/30",
       "text-healthcare-primary font-medium",
       "hover:bg-healthcare-primary hover:text-white",
       "hover:border-healthcare-primary",
       "shadow-lg shadow-black/10",
       "transition-all duration-200",
       "px-4 py-2",
       // Ensure visibility on different backgrounds
       "ring-1 ring-white"
     )}
   >
     <Eye className="w-4 h-4 mr-1.5" />
     Preview
   </Button>
   ```

2. **Fix Section Preview Container**
   File: components/onboarding/TemplatePreview.tsx
   
   Issue: Preview container has constrained height/width
   
   ```tsx
   {/* Full-width preview container */}
   <div className="w-full h-full min-h-[600px] relative">
     {/* Desktop Preview */}
     {previewMode === 'desktop' && (
       <div className="w-full h-full bg-white rounded-lg shadow-inner overflow-hidden">
         <iframe
           src={previewUrl}
           className="w-full h-full min-h-[600px] border-0"
           title="Template Preview"
         />
       </div>
     )}
     
     {/* Tablet Preview */}
     {previewMode === 'tablet' && (
       <div className="mx-auto w-[768px] max-w-full h-full">
         <div className="bg-gray-900 rounded-[2rem] p-3 h-full">
           <div className="bg-white rounded-xl overflow-hidden h-full min-h-[500px]">
             <iframe src={previewUrl} className="w-full h-full" />
           </div>
         </div>
       </div>
     )}
     
     {/* Mobile Preview */}
     {previewMode === 'mobile' && (
       <div className="mx-auto w-[375px] h-full">
         <div className="bg-gray-900 rounded-[2.5rem] p-3 h-full">
           <div className="bg-white rounded-[2rem] overflow-hidden h-full min-h-[667px]">
             <iframe src={previewUrl} className="w-full h-full" />
           </div>
         </div>
       </div>
     )}
   </div>
   ```

3. **Preview Modal Full-Screen Option**
   Add ability to view preview in full screen:
   
   ```tsx
   const [isFullScreen, setIsFullScreen] = useState(false);
   
   <Dialog open={showPreview} onOpenChange={setShowPreview}>
     <DialogContent 
       className={cn(
         "transition-all duration-300",
         isFullScreen 
           ? "max-w-[100vw] w-screen h-screen max-h-screen m-0 rounded-none"
           : "max-w-5xl w-[95vw] max-h-[90vh]"
       )}
     >
       <DialogHeader className="flex-row items-center justify-between">
         <DialogTitle>{selectedTemplate?.name} Preview</DialogTitle>
         <div className="flex items-center gap-2">
           <Button
             variant="ghost"
             size="sm"
             onClick={() => setIsFullScreen(!isFullScreen)}
           >
             {isFullScreen ? <Minimize2 /> : <Maximize2 />}
           </Button>
         </div>
       </DialogHeader>
       
       {/* Preview content with proper sizing */}
       <div className={cn(
         "flex-1 overflow-hidden",
         isFullScreen ? "h-[calc(100vh-80px)]" : "h-[70vh]"
       )}>
         {/* Preview iframe/content */}
       </div>
     </DialogContent>
   </Dialog>
   ```

4. **Template Card Preview Section**
   File: app/onboarding/hospital/widgets/TemplateGallery.tsx
   
   ```tsx
   {/* Template Card with Full Preview Area */}
   <div 
     className={cn(
       "group relative rounded-xl overflow-hidden cursor-pointer",
       "border-2 transition-all duration-300",
       "aspect-[16/10]", // Proper aspect ratio for preview
       isSelected 
         ? "border-healthcare-primary ring-4 ring-healthcare-primary/20" 
         : "border-gray-200 hover:border-healthcare-primary/50"
     )}
   >
     {/* Template Preview Image - Full Coverage */}
     <div className="absolute inset-0">
       <img
         src={template.previewImage}
         alt={template.name}
         className="w-full h-full object-cover object-top"
       />
       
       {/* Gradient overlay for text readability */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
     </div>
     
     {/* Preview button - always visible */}
     <Button
       variant="secondary"
       size="sm"
       onClick={(e) => {
         e.stopPropagation();
         handlePreview(template);
       }}
       className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
     >
       <Eye className="w-4 h-4 mr-1" />
       Preview
     </Button>
     
     {/* Template info at bottom */}
     <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
       <h4 className="font-semibold text-white text-lg">{template.name}</h4>
       <p className="text-white/80 text-sm">{template.description}</p>
     </div>
   </div>
   ```

FILES TO MODIFY:
- app/onboarding/hospital/widgets/TemplateGallery.tsx
- components/onboarding/TemplatePreview.tsx
- app/onboarding/hospital/page.tsx (if preview modal is there)
```

---

## Task 5: Image Toolbox Enhancement

### Current State
- ✅ ImageToolbox.tsx exists with AI, Stock, Upload, Recent tabs
- ❌ Not integrated into template sections
- ❌ No way to insert images into specific template areas

### Requirements
- Add image toolbox button in each template section
- Allow selecting images for specific areas (hero, services, testimonials, etc.)
- Support AI generation, stock photos, upload, and recent images

### Detailed Implementation Prompt

```
TASK: Integrate Image Toolbox into Template Sections

CONTEXT:
- ImageToolbox component: components/onboarding/ImageToolbox.tsx
- Already has: AI generation, stock photos, upload, recent images
- Need to integrate into: SiteContentStep.tsx and BrandingStudioStep.tsx

IMPLEMENT THE FOLLOWING:

1. **Create Section-Aware Image Selection**
   File: app/onboarding/hospital/steps/SiteContentStep.tsx
   
   ```tsx
   import { ImageToolbox } from '@/components/onboarding/ImageToolbox';
   
   // Define image sections
   const IMAGE_SECTIONS = {
     hero_background: {
       label: "Hero Background",
       description: "Main banner image for your homepage",
       recommended: "1920x1080px, landscape orientation",
       category: "banner" as const,
     },
     hero_foreground: {
       label: "Hero Foreground",
       description: "Featured image on hero section",
       recommended: "800x600px",
       category: "general" as const,
     },
     services_icons: {
       label: "Service Images",
       description: "Images for each service card",
       recommended: "400x400px, square",
       category: "general" as const,
     },
     testimonial_photos: {
       label: "Testimonial Photos",
       description: "Patient photos (with consent)",
       recommended: "200x200px, square",
       category: "general" as const,
     },
     about_section: {
       label: "About Section",
       description: "Hospital/facility images",
       recommended: "1200x800px",
       category: "general" as const,
     },
     gallery: {
       label: "Image Gallery",
       description: "Additional hospital images",
       recommended: "Various sizes",
       category: "general" as const,
     },
   };
   
   // State for section images
   const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
   
   // Handle image selection for a section
   const handleImageSelect = (section: string, url: string, metadata?: any) => {
     setSectionImages(prev => ({
       ...prev,
       [section]: url,
     }));
     
     // Update context with image
     updateData('branding', {
       ...data.branding,
       images: {
         ...data.branding.images,
         [section]: url,
       },
     });
   };
   ```

2. **Image Section Component**
   Create reusable image section component:
   
   ```tsx
   interface ImageSectionProps {
     sectionKey: string;
     config: typeof IMAGE_SECTIONS[keyof typeof IMAGE_SECTIONS];
     currentImage?: string;
     onImageSelect: (url: string, metadata?: any) => void;
   }
   
   function ImageSection({ sectionKey, config, currentImage, onImageSelect }: ImageSectionProps) {
     return (
       <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-healthcare-primary/50 transition-colors">
         <div className="flex items-start justify-between mb-3">
           <div>
             <h4 className="font-medium text-gray-900">{config.label}</h4>
             <p className="text-sm text-gray-500">{config.description}</p>
             <p className="text-xs text-gray-400 mt-1">
               Recommended: {config.recommended}
             </p>
           </div>
           
           <ImageToolbox
             onImageSelect={(url, meta) => onImageSelect(url, meta)}
             category={config.category}
             currentImage={currentImage}
             title={`Select ${config.label}`}
             trigger={
               <Button variant="outline" size="sm" className="gap-2">
                 <Image className="w-4 h-4" />
                 {currentImage ? 'Change' : 'Add Image'}
               </Button>
             }
           />
         </div>
         
         {/* Preview */}
         {currentImage ? (
           <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
             <img
               src={currentImage}
               alt={config.label}
               className="w-full h-full object-cover"
             />
             <Button
               variant="destructive"
               size="sm"
               className="absolute top-2 right-2"
               onClick={() => onImageSelect('')}
             >
               <X className="w-4 h-4" />
             </Button>
           </div>
         ) : (
           <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
             <div className="text-center">
               <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
               <p className="text-sm text-gray-400">No image selected</p>
             </div>
           </div>
         )}
       </div>
     );
   }
   ```

3. **Integrate into Hero Section**
   File: app/onboarding/hospital/steps/SiteContentStep.tsx
   
   ```tsx
   {/* Hero Section */}
   <FormSection title="Hero Section" icon={Star}>
     {/* Existing fields */}
     <FormField label="Headline" required>
       <Input ... />
     </FormField>
     
     {/* NEW: Hero Images */}
     <div className="grid md:grid-cols-2 gap-4 mt-4">
       <ImageSection
         sectionKey="hero_background"
         config={IMAGE_SECTIONS.hero_background}
         currentImage={sectionImages.hero_background}
         onImageSelect={(url, meta) => handleImageSelect('hero_background', url, meta)}
       />
       <ImageSection
         sectionKey="hero_foreground"
         config={IMAGE_SECTIONS.hero_foreground}
         currentImage={sectionImages.hero_foreground}
         onImageSelect={(url, meta) => handleImageSelect('hero_foreground', url, meta)}
       />
     </div>
   </FormSection>
   ```

4. **Enhance ImageToolbox with Healthcare-Specific Stock Images**
   File: components/onboarding/ImageToolbox.tsx
   
   Add more healthcare-specific categories:
   ```tsx
   const HEALTHCARE_STOCK_CATEGORIES = [
     { id: 'hospital_exterior', label: 'Hospital Buildings', count: 25 },
     { id: 'hospital_interior', label: 'Hospital Interiors', count: 30 },
     { id: 'medical_staff', label: 'Medical Staff', count: 40 },
     { id: 'patient_care', label: 'Patient Care', count: 35 },
     { id: 'medical_equipment', label: 'Medical Equipment', count: 20 },
     { id: 'laboratory', label: 'Laboratory', count: 15 },
     { id: 'pharmacy', label: 'Pharmacy', count: 12 },
     { id: 'emergency', label: 'Emergency Care', count: 18 },
     { id: 'surgery', label: 'Surgery & OR', count: 22 },
     { id: 'pediatrics', label: 'Pediatrics', count: 15 },
     { id: 'maternity', label: 'Maternity', count: 12 },
     { id: 'rehabilitation', label: 'Rehabilitation', count: 10 },
   ];
   ```

5. **AI Image Generation Prompts for Healthcare**
   ```tsx
   const HEALTHCARE_AI_PROMPTS = [
     "Modern hospital building with glass facade and greenery",
     "Friendly medical team of doctors and nurses smiling",
     "Clean and bright hospital reception area",
     "State-of-the-art medical equipment in a modern setting",
     "Peaceful hospital room with natural lighting",
     "Doctor consulting with patient in a comfortable setting",
     "Medical laboratory with modern equipment",
     "Hospital pharmacy with organized medicine shelves",
     "Emergency room with professional medical staff",
     "Pediatric ward with colorful decorations",
   ];
   ```

FILES TO MODIFY:
- components/onboarding/ImageToolbox.tsx (enhance)
- app/onboarding/hospital/steps/SiteContentStep.tsx (integrate)
- app/onboarding/hospital/steps/BrandingStudioStep.tsx (integrate for logo)
- contexts/HospitalOnboardingContextV2.tsx (add images to state)
```

---

## Task 6: Auto-Save Branding Details

### Current State
- ✅ Autosave exists (1-second throttled, localStorage)
- ❌ "Update" button may still be present
- ❌ "Continue to Profile" floating button present

### Requirements
- Remove manual "Update" button - use only autosave
- Remove "Continue to Profile" floating button
- Ensure branding changes sync to backend automatically

### Detailed Implementation Prompt

```
TASK: Implement Seamless Auto-Save for Branding

CONTEXT:
- Auto-save infrastructure exists in HospitalOnboardingContextV2
- Currently saves to localStorage
- Need to also sync to backend

IMPLEMENT THE FOLLOWING:

1. **Remove Manual Update Button**
   File: app/onboarding/hospital/steps/BrandingStudioStep.tsx
   
   Search for and remove any "Update", "Save Changes", or similar buttons:
   ```tsx
   // REMOVE this type of code:
   <Button onClick={handleSaveChanges}>
     Update Branding
   </Button>
   ```

2. **Remove Floating "Continue to Profile" Button**
   File: app/onboarding/hospital/page.tsx
   
   The current floating button implementation (lines 580-610) should be removed
   or made less intrusive:
   ```tsx
   // REMOVE or modify this:
   {isStepValid(currentStep) && currentStep < STEP_CONFIGS.length - 1 && (
     <motion.div className="fixed bottom-8 ...">
       <Button>Continue to {STEP_CONFIGS[currentStep + 1]?.title}</Button>
     </motion.div>
   )}
   ```
   
   Instead, rely on the standard navigation footer.

3. **Enhanced Auto-Save with Backend Sync**
   File: contexts/HospitalOnboardingContextV2.tsx
   
   ```tsx
   // Add backend sync to autosave
   const autoSave = useCallback(
     debounce(async (newData: OnboardingData) => {
       setIsSaving(true);
       
       // 1. Save to localStorage (fast, reliable)
       const storageKey = `hospital-onboarding-${invitationId}`;
       localStorage.setItem(storageKey, JSON.stringify({
         data: newData,
         timestamp: new Date().toISOString(),
         version: 2,
       }));
       
       // 2. Sync to backend (async, non-blocking)
       try {
         const sessionToken = localStorage.getItem('onboarding_session_token');
         if (sessionToken) {
           await fetch('/api/v1/onboarding/save-progress', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${sessionToken}`,
             },
             body: JSON.stringify({
               step: currentStep,
               data: newData,
               timestamp: new Date().toISOString(),
             }),
           });
         }
       } catch (error) {
         // Don't block on backend errors - localStorage is backup
         console.warn('Backend sync failed, data saved locally:', error);
       }
       
       setLastSaved(new Date());
       setIsSaving(false);
     }, 1000),
     [invitationId, currentStep]
   );
   ```

4. **Visual Auto-Save Indicator**
   Keep the existing save indicator but make it more subtle:
   ```tsx
   {/* Auto-save indicator - subtle version */}
   <AnimatePresence>
     {isSaving && (
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100 flex items-center gap-2 text-xs text-gray-600"
       >
         <div className="w-1.5 h-1.5 bg-healthcare-primary rounded-full animate-pulse" />
         Saving...
       </motion.div>
     )}
   </AnimatePresence>
   
   {/* Last saved indicator */}
   {lastSaved && !isSaving && (
     <div className="text-xs text-gray-400">
       Auto-saved {formatTimeAgo(lastSaved)}
     </div>
   )}
   ```

5. **Branding-Specific Auto-Save Fields**
   Ensure these fields trigger auto-save:
   - Primary color
   - Secondary color
   - Logo upload
   - Favicon upload
   - Font selections
   - Theme preferences
   
   ```tsx
   // In BrandingStudioStep.tsx
   const handleColorChange = (field: string, value: string) => {
     updateData('branding', {
       ...data.branding,
       [field]: value,
     });
     // Auto-save is triggered automatically by context
   };
   ```

FILES TO MODIFY:
- contexts/HospitalOnboardingContextV2.tsx (enhance autosave)
- app/onboarding/hospital/page.tsx (remove floating button)
- app/onboarding/hospital/steps/BrandingStudioStep.tsx (remove update button)
```

---

## Task 7: Custom Hospital Login Page Builder

### Current State
- ✅ LoginPageBuilder.tsx exists in components/onboarding
- ✅ CustomLoginPage.tsx exists
- ❌ Not integrated into onboarding flow
- ❌ Needs hospital branding integration

### Requirements
- Add login page customization step in onboarding
- Allow custom background (blur effect on hospital image)
- Login form with matching template colors
- "Powered by Athaarva" branding
- Email/phone + password fields

### Detailed Implementation Prompt

```
TASK: Create Hospital Login Page Customization Step

CONTEXT:
- LoginPageBuilder: components/onboarding/LoginPageBuilder.tsx
- CustomLoginPage: components/onboarding/CustomLoginPage.tsx
- Should follow hospital's selected template branding
- Need to create new step in onboarding flow

IMPLEMENT THE FOLLOWING:

1. **Create New Step: LoginPageCustomizationStep.tsx**
   File: app/onboarding/hospital/steps/LoginPageCustomizationStep.tsx
   
   ```tsx
   "use client";
   
   import React, { useState } from "react";
   import { motion } from "framer-motion";
   import { Lock, Image, Palette, Eye, Smartphone, Monitor } from "lucide-react";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Slider } from "@/components/ui/slider";
   import { Switch } from "@/components/ui/switch";
   import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
   import { ImageToolbox } from "@/components/onboarding/ImageToolbox";
   import { cn } from "@/lib/utils";
   
   interface LoginPageConfig {
     backgroundImage: string;
     backgroundBlur: number; // 0-20
     backgroundColor: string;
     useGradientOverlay: boolean;
     gradientDirection: 'to-r' | 'to-b' | 'to-br';
     formPosition: 'center' | 'left' | 'right';
     formStyle: 'card' | 'transparent' | 'floating';
     showHospitalLogo: boolean;
     showAthaarvabranding: boolean;
     athaarvaPosition: 'footer' | 'form-bottom';
     customWelcomeText: string;
     customSubtext: string;
   }
   
   export default function LoginPageCustomizationStep() {
     const { data, updateData } = useHospitalOnboarding();
     const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
     const [config, setConfig] = useState<LoginPageConfig>({
       backgroundImage: '',
       backgroundBlur: 8,
       backgroundColor: data.branding.primary_color || '#007C7C',
       useGradientOverlay: true,
       gradientDirection: 'to-br',
       formPosition: 'center',
       formStyle: 'card',
       showHospitalLogo: true,
       showAthaarvabranding: true,
       athaarvaPosition: 'footer',
       customWelcomeText: `Welcome to ${data.organizationProfile.legal_name || 'Your Hospital'}`,
       customSubtext: 'Sign in to access your health portal',
     });
   
     const updateConfig = (updates: Partial<LoginPageConfig>) => {
       const newConfig = { ...config, ...updates };
       setConfig(newConfig);
       updateData('loginPage', newConfig);
     };
   
     return (
       <div className="space-y-8">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-gradient-to-r from-healthcare-primary/10 to-healthcare-emerald/10 rounded-xl p-6"
         >
           <div className="flex items-start gap-4">
             <div className="w-12 h-12 bg-healthcare-primary rounded-lg flex items-center justify-center">
               <Lock className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-gray-900">
                 Customize Your Login Page
               </h3>
               <p className="text-gray-600 mt-1">
                 Create a branded login experience that matches your hospital's identity.
                 This is the first thing patients and staff will see.
               </p>
             </div>
           </div>
         </motion.div>
   
         <div className="grid lg:grid-cols-2 gap-8">
           {/* Configuration Panel */}
           <div className="space-y-6">
             {/* Background Settings */}
             <div className="bg-white rounded-lg border p-6 space-y-4">
               <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                 <Image className="w-5 h-5 text-healthcare-primary" />
                 Background Settings
               </h4>
               
               {/* Background Image */}
               <div>
                 <Label>Background Image</Label>
                 <div className="mt-2">
                   <ImageToolbox
                     onImageSelect={(url) => updateConfig({ backgroundImage: url })}
                     category="background"
                     currentImage={config.backgroundImage}
                     title="Select Login Background"
                     trigger={
                       <Button variant="outline" className="w-full justify-start gap-2">
                         <Image className="w-4 h-4" />
                         {config.backgroundImage ? 'Change Background' : 'Select Background Image'}
                       </Button>
                     }
                   />
                 </div>
               </div>
               
               {/* Blur Amount */}
               <div>
                 <Label>Background Blur: {config.backgroundBlur}px</Label>
                 <Slider
                   value={[config.backgroundBlur]}
                   onValueChange={([value]) => updateConfig({ backgroundBlur: value })}
                   min={0}
                   max={20}
                   step={1}
                   className="mt-2"
                 />
               </div>
               
               {/* Gradient Overlay */}
               <div className="flex items-center justify-between">
                 <Label>Add Gradient Overlay</Label>
                 <Switch
                   checked={config.useGradientOverlay}
                   onCheckedChange={(checked) => updateConfig({ useGradientOverlay: checked })}
                 />
               </div>
             </div>
   
             {/* Form Settings */}
             <div className="bg-white rounded-lg border p-6 space-y-4">
               <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                 <Palette className="w-5 h-5 text-healthcare-primary" />
                 Login Form Settings
               </h4>
               
               {/* Form Position */}
               <div>
                 <Label>Form Position</Label>
                 <div className="flex gap-2 mt-2">
                   {(['left', 'center', 'right'] as const).map((pos) => (
                     <Button
                       key={pos}
                       variant={config.formPosition === pos ? 'default' : 'outline'}
                       size="sm"
                       onClick={() => updateConfig({ formPosition: pos })}
                       className="flex-1 capitalize"
                     >
                       {pos}
                     </Button>
                   ))}
                 </div>
               </div>
               
               {/* Form Style */}
               <div>
                 <Label>Form Style</Label>
                 <div className="flex gap-2 mt-2">
                   {(['card', 'transparent', 'floating'] as const).map((style) => (
                     <Button
                       key={style}
                       variant={config.formStyle === style ? 'default' : 'outline'}
                       size="sm"
                       onClick={() => updateConfig({ formStyle: style })}
                       className="flex-1 capitalize"
                     >
                       {style}
                     </Button>
                   ))}
                 </div>
               </div>
               
               {/* Welcome Text */}
               <div>
                 <Label>Welcome Text</Label>
                 <Input
                   value={config.customWelcomeText}
                   onChange={(e) => updateConfig({ customWelcomeText: e.target.value })}
                   placeholder="Welcome to Your Hospital"
                   className="mt-2"
                 />
               </div>
               
               {/* Subtext */}
               <div>
                 <Label>Subtext</Label>
                 <Input
                   value={config.customSubtext}
                   onChange={(e) => updateConfig({ customSubtext: e.target.value })}
                   placeholder="Sign in to access your health portal"
                   className="mt-2"
                 />
               </div>
             </div>
   
             {/* Branding Options */}
             <div className="bg-white rounded-lg border p-6 space-y-4">
               <h4 className="font-semibold text-gray-900">Branding Options</h4>
               
               <div className="flex items-center justify-between">
                 <div>
                   <Label>Show Hospital Logo</Label>
                   <p className="text-xs text-gray-500">Display your logo above the form</p>
                 </div>
                 <Switch
                   checked={config.showHospitalLogo}
                   onCheckedChange={(checked) => updateConfig({ showHospitalLogo: checked })}
                 />
               </div>
               
               <div className="flex items-center justify-between">
                 <div>
                   <Label>Powered by Athaarva</Label>
                   <p className="text-xs text-gray-500">Show platform branding</p>
                 </div>
                 <Switch
                   checked={config.showAthaarvabranding}
                   onCheckedChange={(checked) => updateConfig({ showAthaarvabranding: checked })}
                 />
               </div>
             </div>
           </div>
   
           {/* Live Preview */}
           <div className="sticky top-6">
             <div className="bg-white rounded-lg border overflow-hidden">
               {/* Preview Header */}
               <div className="bg-gray-50 border-b px-4 py-3 flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-700">Live Preview</span>
                 <div className="flex items-center gap-2">
                   <Button
                     variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                     size="sm"
                     onClick={() => setPreviewMode('desktop')}
                   >
                     <Monitor className="w-4 h-4" />
                   </Button>
                   <Button
                     variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                     size="sm"
                     onClick={() => setPreviewMode('mobile')}
                   >
                     <Smartphone className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
               
               {/* Preview Content */}
               <div className={cn(
                 "relative bg-gray-100 transition-all duration-300",
                 previewMode === 'desktop' ? 'h-[500px]' : 'h-[600px] max-w-[375px] mx-auto'
               )}>
                 <LoginPagePreview config={config} hospitalData={data} />
               </div>
             </div>
           </div>
         </div>
       </div>
     );
   }
   
   // Preview Component
   function LoginPagePreview({ config, hospitalData }: { config: LoginPageConfig; hospitalData: any }) {
     return (
       <div
         className="w-full h-full relative overflow-hidden"
         style={{
           backgroundColor: config.backgroundColor,
         }}
       >
         {/* Background Image with Blur */}
         {config.backgroundImage && (
           <div
             className="absolute inset-0 bg-cover bg-center"
             style={{
               backgroundImage: `url(${config.backgroundImage})`,
               filter: `blur(${config.backgroundBlur}px)`,
               transform: 'scale(1.1)', // Prevent blur edge bleeding
             }}
           />
         )}
         
         {/* Gradient Overlay */}
         {config.useGradientOverlay && (
           <div
             className={cn(
               "absolute inset-0 bg-gradient-to-br",
               "from-healthcare-primary/60 to-transparent"
             )}
           />
         )}
         
         {/* Login Form */}
         <div className={cn(
           "absolute inset-0 flex items-center p-8",
           config.formPosition === 'left' && 'justify-start',
           config.formPosition === 'center' && 'justify-center',
           config.formPosition === 'right' && 'justify-end'
         )}>
           <div className={cn(
             "w-full max-w-sm p-6 rounded-xl",
             config.formStyle === 'card' && 'bg-white shadow-2xl',
             config.formStyle === 'transparent' && 'bg-white/10 backdrop-blur-sm border border-white/20',
             config.formStyle === 'floating' && 'bg-white/95 shadow-2xl shadow-black/20'
           )}>
             {/* Logo */}
             {config.showHospitalLogo && (
               <div className="flex justify-center mb-6">
                 {hospitalData.branding?.logo_url ? (
                   <img src={hospitalData.branding.logo_url} alt="Logo" className="h-12" />
                 ) : (
                   <div className="w-16 h-16 bg-healthcare-primary/10 rounded-xl flex items-center justify-center">
                     <span className="text-2xl font-bold text-healthcare-primary">
                       {hospitalData.organizationProfile?.legal_name?.charAt(0) || 'H'}
                     </span>
                   </div>
                 )}
               </div>
             )}
             
             {/* Welcome Text */}
             <h2 className={cn(
               "text-xl font-bold text-center mb-1",
               config.formStyle === 'transparent' ? 'text-white' : 'text-gray-900'
             )}>
               {config.customWelcomeText}
             </h2>
             <p className={cn(
               "text-sm text-center mb-6",
               config.formStyle === 'transparent' ? 'text-white/80' : 'text-gray-500'
             )}>
               {config.customSubtext}
             </p>
             
             {/* Form Fields (Mock) */}
             <div className="space-y-4">
               <div>
                 <div className="h-10 bg-gray-100 rounded-lg" />
               </div>
               <div>
                 <div className="h-10 bg-gray-100 rounded-lg" />
               </div>
               <div 
                 className="h-10 rounded-lg"
                 style={{ backgroundColor: hospitalData.branding?.primary_color || '#007C7C' }}
               />
             </div>
             
             {/* Powered by Athaarva */}
             {config.showAthaarvabranding && config.athaarvaPosition === 'form-bottom' && (
               <div className="mt-6 text-center">
                 <span className={cn(
                   "text-xs",
                   config.formStyle === 'transparent' ? 'text-white/60' : 'text-gray-400'
                 )}>
                   Powered by <span className="font-semibold">Athaarva</span>
                 </span>
               </div>
             )}
           </div>
         </div>
         
         {/* Footer Branding */}
         {config.showAthaarvabranding && config.athaarvaPosition === 'footer' && (
           <div className="absolute bottom-4 left-0 right-0 text-center">
             <span className="text-xs text-white/60">
               Powered by <span className="font-semibold">Athaarva Healthcare Platform</span>
             </span>
           </div>
         )}
       </div>
     );
   }
   ```

2. **Add to Step Configuration**
   File: app/onboarding/hospital/page.tsx
   
   ```tsx
   import LoginPageCustomizationStep from './steps/LoginPageCustomizationStep';
   
   // Add to STEP_CONFIGS after BrandingStudioStep or SiteContentStep
   {
     id: X, // Assign appropriate number
     title: "Login Page",
     description: "Design your hospital's login experience",
     icon: Lock,
     component: LoginPageCustomizationStep,
     category: "Branding",
     estimatedMinutes: 5,
   },
   ```

3. **Update Context for Login Page Config**
   File: contexts/HospitalOnboardingContextV2.tsx
   
   ```tsx
   interface OnboardingData {
     // ... existing fields
     loginPage: {
       backgroundImage: string;
       backgroundBlur: number;
       backgroundColor: string;
       useGradientOverlay: boolean;
       gradientDirection: string;
       formPosition: 'center' | 'left' | 'right';
       formStyle: 'card' | 'transparent' | 'floating';
       showHospitalLogo: boolean;
       showAthaarvabranding: boolean;
       athaarvaPosition: 'footer' | 'form-bottom';
       customWelcomeText: string;
       customSubtext: string;
     };
   }
   ```

FILES TO CREATE/MODIFY:
- app/onboarding/hospital/steps/LoginPageCustomizationStep.tsx (create)
- app/onboarding/hospital/page.tsx (add step)
- contexts/HospitalOnboardingContextV2.tsx (add loginPage to state)
- components/onboarding/LoginPageBuilder.tsx (enhance if needed)
```

---

## Task 8: Authentication System with 2FA

### Current State
- ✅ Hospital admin login with MFA exists
- ✅ HospitalAdminMFAAuthContext implemented
- ❌ Per-hospital branded login page not implemented
- ❌ Need email/phone + password login with 2FA

### Requirements
- Login with email OR phone number + password
- 2-factor authentication (OTP via SMS/Email or Authenticator app)
- Role-based redirect after login
- Only patients can sign up; staff/doctors receive credentials

### Detailed Implementation Prompt

```
TASK: Implement Complete Authentication System with 2FA

CONTEXT:
- Existing MFA context: contexts/HospitalAdminMFAAuthContext.tsx
- Hospital login page: app/hospital/[subdomain]/auth/login/page.tsx
- Need to support: email/phone login, 2FA, role-based routing

IMPLEMENT THE FOLLOWING:

1. **Backend: Enhanced Auth Routes**
   File: app/routes/auth.py
   
   ```python
   from fastapi import APIRouter, HTTPException, Depends
   from pydantic import BaseModel, EmailStr, validator
   import pyotp
   import secrets
   
   router = APIRouter(prefix="/auth", tags=["authentication"])
   
   class LoginRequest(BaseModel):
       identifier: str  # Email or phone number
       password: str
       tenant_id: str
       
       @validator('identifier')
       def validate_identifier(cls, v):
           # Check if email or phone
           if '@' in v:
               # Email validation
               return v.lower().strip()
           else:
               # Phone validation - normalize to +91XXXXXXXXXX
               phone = ''.join(filter(str.isdigit, v))
               if len(phone) == 10:
                   return f"+91{phone}"
               return phone
   
   class MFAVerifyRequest(BaseModel):
       session_token: str
       code: str
       trust_device: bool = False
   
   @router.post("/login")
   async def login(request: LoginRequest, db=Depends(get_db)):
       """
       Step 1: Validate credentials
       Returns: session_token for MFA step OR complete auth if MFA disabled
       """
       # Find user by email or phone
       user = await find_user_by_identifier(
           db, request.identifier, request.tenant_id
       )
       
       if not user:
           # Generic error to prevent enumeration
           raise HTTPException(401, "Invalid credentials")
       
       # Verify password
       if not verify_password(request.password, user.password_hash):
           # Log failed attempt
           await log_auth_attempt(db, user.id, success=False)
           raise HTTPException(401, "Invalid credentials")
       
       # Check if MFA is required
       if user.mfa_enabled:
           # Create MFA session
           session_token = secrets.token_urlsafe(32)
           await create_mfa_session(db, user.id, session_token)
           
           # Send OTP if using SMS/Email MFA
           if user.mfa_method in ['sms', 'email']:
               otp = generate_otp()
               await send_otp(user, otp, user.mfa_method)
           
           return {
               "step": "mfa",
               "session_token": session_token,
               "mfa_method": user.mfa_method,
               "masked_contact": mask_contact(user.mfa_method, user),
           }
       
       # No MFA - complete login
       tokens = await create_auth_tokens(user)
       return {
           "step": "complete",
           **tokens,
           "user": user.to_dict(),
       }
   
   @router.post("/verify-mfa")
   async def verify_mfa(request: MFAVerifyRequest, db=Depends(get_db)):
       """
       Step 2: Verify MFA code
       """
       session = await get_mfa_session(db, request.session_token)
       if not session:
           raise HTTPException(401, "Invalid or expired session")
       
       user = await get_user(db, session.user_id)
       
       # Verify code based on MFA method
       if user.mfa_method == 'totp':
           # TOTP (Authenticator app)
           totp = pyotp.TOTP(user.totp_secret)
           if not totp.verify(request.code):
               await increment_mfa_attempts(db, session.id)
               raise HTTPException(401, "Invalid code")
       else:
           # SMS/Email OTP
           if not await verify_otp(db, session.user_id, request.code):
               await increment_mfa_attempts(db, session.id)
               raise HTTPException(401, "Invalid code")
       
       # MFA successful
       tokens = await create_auth_tokens(user)
       
       # Trust device if requested
       if request.trust_device:
           device_token = await create_trusted_device(
               db, user.id, request  # Contains device fingerprint
           )
           tokens['device_token'] = device_token
       
       return {
           "step": "complete",
           **tokens,
           "user": user.to_dict(),
       }
   
   @router.post("/send-otp")
   async def send_otp_route(
       identifier: str,
       purpose: str,  # 'login', 'signup', 'reset'
       tenant_id: str,
       db=Depends(get_db)
   ):
       """Send OTP for various purposes"""
       user = await find_user_by_identifier(db,// filepath: f:\Education\COLLEGE\PROGRAMING\Athaarva\Frontend\Dev\Athaarva_Frontend\docs\ONBOARDING_FLOW_TASKS.md
# 🏥 Athaarva Hospital Onboarding Flow - Task Breakdown

> **Created:** January 15, 2026  
> **Purpose:** Comprehensive task prompts for implementing secure hospital onboarding flow  
> **Priority:** High - Production Critical  

---

## 📋 Table of Contents

1. [Super Admin Security & Accessibility](#task-1-super-admin-security--accessibility)
2. [Hospital Invitation Flow Security](#task-2-hospital-invitation-flow-security)
3. [Welcome Modal & Walkthrough UX](#task-3-welcome-modal--walkthrough-ux)
4. [Template Preview & CSS Fixes](#task-4-template-preview--css-fixes)
5. [Image Toolbox Enhancement](#task-5-image-toolbox-enhancement)
6. [Auto-Save Branding Details](#task-6-auto-save-branding-details)
7. [Custom Hospital Login Page Builder](#task-7-custom-hospital-login-page-builder)
8. [Authentication System with 2FA](#task-8-authentication-system-with-2fa)
9. [Patient Signup Flow](#task-9-patient-signup-flow)
10. [Document Template Design System](#task-10-document-template-design-system)
11. [Admin Setup & Domain Configuration](#task-11-admin-setup--domain-configuration)
12. [Post-Onboarding Redirect Flow](#task-12-post-onboarding-redirect-flow)
13. [Hospital Selector Page Revamp](#task-13-hospital-selector-page-revamp)

---

## Task 1: Super Admin Security & Accessibility

### Current State
- ✅ Super admin has password protection
- ✅ Route obfuscation exists (`/platform-ctrl-9x7k2m`)
- ❌ Still discoverable if someone guesses the path

### Requirements
Make the super admin panel extremely secure and hidden from public access.

### Detailed Implementation Prompt

```
TASK: Enhance Super Admin Security Layer

CONTEXT:
- Current path: /platform-ctrl-9x7k2m (obfuscated from /super-admin)
- Has password protection via HospitalAdminMFAAuthContext
- IP whitelist partially implemented in backend

IMPLEMENT THE FOLLOWING SECURITY MEASURES:

1. **IP Whitelist Enforcement (Backend)**
   - File: `app/routes/super_admin_security.py`
   - Create middleware that checks IP against whitelist
   - Whitelist should be stored in database (iam.ip_whitelist table)
   - Allow VPN IPs to be added dynamically by existing super admins
   - Return 404 (not 403) for non-whitelisted IPs to hide existence

2. **Honeypot Decoy Routes**
   - Create `/admin`, `/super-admin`, `/dashboard/admin` routes
   - These should log IP + user-agent + timestamp to security audit table
   - Return fake "Page Not Found" after delay (to waste attacker time)
   - Auto-block IPs that hit these routes 3+ times

3. **Time-Based Access Windows**
   - Add `allowed_hours_start` and `allowed_hours_end` to super_admin config
   - Reject access outside business hours (configurable per timezone)
   - Send alert to primary admin if access attempted outside hours

4. **Secret URL Token**
   - Instead of just obfuscated path, require a rotating secret token
   - URL format: `/platform-ctrl-9x7k2m?key=ROTATING_SECRET`
   - Secret rotates every 24 hours, sent via secure channel (SMS/Authenticator)
   - Without valid key, return 404

5. **Browser Fingerprinting**
   - Store browser fingerprint on first successful login
   - If new fingerprint detected, require additional verification
   - Use libraries like FingerprintJS or custom implementation

6. **Audit Everything**
   - Log all access attempts (successful and failed) with:
     - IP address, User-Agent, Timestamp
     - Geolocation (via IP lookup)
     - Action performed
   - Send real-time alerts for suspicious activity

7. **Self-Destruct Mode**
   - If 5 failed login attempts, lock account for 1 hour
   - If 10 failed attempts, require manual unlock by another super admin
   - If anomaly detected (impossible travel, etc.), auto-lock all sessions

FILES TO MODIFY:
- Backend: app/routes/super_admin_security.py (create new)
- Backend: app/core/security_middleware.py (create new)
- Frontend: app/platform-ctrl-9x7k2m/layout.tsx
- Frontend: middleware.ts (add security checks)
- Database: migrations/phase5_super_admin_hardening.sql

SECURITY ARCHITECTURE:
Request → IP Check → Time Window Check → Token Validation → 
Browser Fingerprint → MFA → Session Creation → Audit Log
```

---

## Task 2: Hospital Invitation Flow Security

### Current State
- ✅ Token validation exists in middleware
- ✅ Invalid token page exists
- ❌ Token validation is fail-open in development

### Requirements
Make the `/onboarding/hospital` route completely inaccessible without a valid token.

### Detailed Implementation Prompt

```
TASK: Secure Hospital Onboarding Token-Gated Access

CONTEXT:
- Route: /onboarding/hospital
- Currently validates token in middleware.ts (lines 91-138)
- Backend endpoint: /api/v1/onboarding/validate-token
- Invalid token redirects to /onboarding/hospital/invalid-token

IMPLEMENT THE FOLLOWING:

1. **Strict Token Validation (Backend)**
   File: app/routes/onboarding.py
   
   - Token structure: JWT with claims:
     - invitation_id, hospital_name, email, created_at, expires_at
     - Signature with server secret
   - Validation checks:
     - Token not expired (7 days default)
     - Token not already used (status != 'accepted')
     - Token not revoked
     - One-time use flag (optional)
   
   API Response:
   {
     "valid": boolean,
     "invitation_id": uuid,
     "email": string,
     "hospital_name": string,
     "owner_name": string,
     "expires_at": datetime,
     "remaining_uses": number (if multi-use),
     "message": string
   }

2. **Token Acceptance Flow**
   - When user lands on onboarding page with valid token:
     a. POST /api/v1/onboarding/accept-token with the token
     b. Backend marks invitation as "in_progress"
     c. Creates an onboarding_session with session_token
     d. Returns session_token for subsequent API calls
   - If user leaves and returns:
     a. Token still valid → resume from saved progress
     b. Token expired → show expired message with contact support

3. **Session Management**
   - Create onboarding session cookie (httpOnly, secure)
   - Session expires after 24 hours of inactivity
   - Session persists across browser closes
   - Store progress in session, not just localStorage

4. **Rate Limiting**
   - Max 5 token validation attempts per IP per hour
   - Max 3 onboarding sessions per invitation
   - Block suspicious patterns (rapid page loads, etc.)

5. **Audit Trail**
   - Log all token validation attempts
   - Log onboarding step completions
   - Log submission events

6. **Remove Development Bypass**
   File: app/onboarding/hospital/page.tsx (lines 152-171)
   
   - Remove or comment out the development bypass code
   - Use environment variable to enable test mode only in local dev
   - In test mode, require special test tokens that are clearly marked

MIDDLEWARE UPDATES (middleware.ts):

```typescript
// Hospital Onboarding: Validate invitation token
if (pathname.startsWith('/onboarding/hospital') && 
    pathname !== '/onboarding/hospital/invalid-token') {
  
  const token = request.nextUrl.searchParams.get('token');
  
  // No token = immediate redirect (no exceptions)
  if (!token) {
    return NextResponse.redirect(
      new URL('/onboarding/hospital/invalid-token?reason=missing', request.url)
    );
  }

  // Validate token format before API call (basic sanity check)
  if (token.length < 32 || token.length > 512) {
    return NextResponse.redirect(
      new URL('/onboarding/hospital/invalid-token?reason=malformed', request.url)
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/onboarding/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    // API error = fail closed (redirect to error page)
    if (!response.ok) {
      return NextResponse.redirect(
        new URL('/onboarding/hospital/invalid-token?reason=validation_failed', request.url)
      );
    }

    const data = await response.json();
    
    if (!data.valid) {
      // Specific error handling
      const reason = data.status || 'invalid';
      return NextResponse.redirect(
        new URL(`/onboarding/hospital/invalid-token?reason=${reason}`, request.url)
      );
    }

    // Valid token - proceed with headers
    const nextResponse = NextResponse.next();
    nextResponse.headers.set('x-invitation-token', token);
    nextResponse.headers.set('x-invitation-email', data.email || '');
    nextResponse.headers.set('x-hospital-name', encodeURIComponent(data.hospital_name || ''));
    nextResponse.headers.set('x-owner-name', encodeURIComponent(data.owner_name || ''));
    return nextResponse;

  } catch (error) {
    // Network error = fail closed in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(
        new URL('/onboarding/hospital/invalid-token?reason=network_error', request.url)
      );
    }
    // Only allow through in development with explicit flag
    if (process.env.ALLOW_ONBOARDING_BYPASS !== 'true') {
      return NextResponse.redirect(
        new URL('/onboarding/hospital/invalid-token?reason=network_error', request.url)
      );
    }
    return NextResponse.next();
  }
}
```

FILES TO CREATE/MODIFY:
- Backend: app/routes/onboarding.py (enhance validation)
- Backend: app/models/onboarding/schemas.py (add session schema)
- Frontend: middleware.ts (strict validation)
- Frontend: app/onboarding/hospital/page.tsx (remove dev bypass)
- Database: Add onboarding_sessions table
```

---

## Task 3: Welcome Modal & Walkthrough UX

### Current State
- ✅ WelcomeModal.tsx exists with personalized greeting
- ✅ WalkthroughOverlay.tsx exists
- ❌ Not integrated into main onboarding flow
- ❌ Modal doesn't have centered popup with blurred background styling

### Requirements
- Show centered welcome popup with blurred background on first visit
- After closing, trigger walkthrough that guides user through template tool

### Detailed Implementation Prompt

```
TASK: Integrate Welcome Modal & Walkthrough into Onboarding Flow

CONTEXT:
- WelcomeModal: components/onboarding/WelcomeModal.tsx
- WalkthroughOverlay: components/onboarding/WalkthroughOverlay.tsx
- Main page: app/onboarding/hospital/page.tsx
- First step: InvitationTemplateStep.tsx

IMPLEMENT THE FOLLOWING:

1. **Welcome Modal Integration**
   File: app/onboarding/hospital/page.tsx
   
   Add state management for modal visibility:
   ```tsx
   const [showWelcomeModal, setShowWelcomeModal] = useState(true);
   const [showWalkthrough, setShowWalkthrough] = useState(false);
   const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
     if (typeof window !== 'undefined') {
       return localStorage.getItem(`onboarding-welcome-${token}`) === 'true';
     }
     return false;
   });
   
   // Show welcome modal only on first visit
   useEffect(() => {
     if (!hasSeenWelcome && validationData?.valid) {
       setShowWelcomeModal(true);
     }
   }, [hasSeenWelcome, validationData]);
   
   const handleWelcomeStart = () => {
     setShowWelcomeModal(false);
     localStorage.setItem(`onboarding-welcome-${token}`, 'true');
     setHasSeenWelcome(true);
     // Trigger walkthrough after modal closes
     setTimeout(() => setShowWalkthrough(true), 500);
   };
   ```

2. **Update Welcome Modal Styling**
   File: components/onboarding/WelcomeModal.tsx
   
   Current backdrop is correct (bg-black/40 backdrop-blur-sm), but enhance:
   - Increase blur: `backdrop-blur-md`
   - Add subtle animation to background
   - Center the modal more prominently
   
   ```tsx
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 z-[100] flex items-center justify-center p-4"
   >
     {/* Enhanced backdrop */}
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
       onClick={onStart}
     />
     
     {/* Modal content with enhanced entrance */}
     <motion.div
       initial={{ opacity: 0, scale: 0.8, y: 40 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       exit={{ opacity: 0, scale: 0.9, y: 20 }}
       transition={{ type: "spring", damping: 20, stiffness: 300 }}
       className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
     >
   ```

3. **Populate Modal with Invitation Data**
   Pass validated data to modal:
   ```tsx
   <WelcomeModal
     hospitalName={validationData?.hospital_name}
     ownerName={validationData?.owner_name}
     ownerEmail={validationData?.email}
     isOpen={showWelcomeModal}
     onStart={handleWelcomeStart}
   />
   ```

4. **Walkthrough Integration**
   File: app/onboarding/hospital/page.tsx
   
   After welcome modal closes, show walkthrough:
   ```tsx
   {showWalkthrough && (
     <WalkthroughOverlay
       steps={[
         {
           target: '[data-walkthrough="template-gallery"]',
           title: "Choose Your Template",
           description: "Select a template that best represents your hospital's brand. You can customize colors and content in the next steps.",
         },
         {
           target: '[data-walkthrough="template-preview"]',
           title: "Preview Your Selection",
           description: "Click 'Preview' to see how your website will look on different devices.",
         },
         {
           target: '[data-walkthrough="next-button"]',
           title: "Continue When Ready",
           description: "Once you've selected a template, click 'Next' to proceed with your hospital profile.",
         },
       ]}
       onComplete={() => setShowWalkthrough(false)}
     />
   )}
   ```

5. **Add Data Attributes for Walkthrough Targets**
   File: app/onboarding/hospital/widgets/TemplateGallery.tsx
   
   Add targeting attributes:
   ```tsx
   <div data-walkthrough="template-gallery" className="...">
     {/* Gallery content */}
   </div>
   
   <Button data-walkthrough="template-preview">
     Preview
   </Button>
   ```

6. **Step Rename: "Invitation & Template" → "Website Template"**
   File: app/onboarding/hospital/page.tsx (STEP_CONFIGS)
   
   ```tsx
   {
     id: 0,
     title: "Website Template",  // Changed from "Invitation & Template"
     description: "Select and customize your hospital website template",
     icon: Sparkles,
     component: InvitationTemplateStep,
     category: "Setup",
     estimatedMinutes: 3,
   },
   ```

FILES TO MODIFY:
- app/onboarding/hospital/page.tsx (main orchestrator)
- components/onboarding/WelcomeModal.tsx (styling enhancements)
- components/onboarding/WalkthroughOverlay.tsx (ensure it works with targets)
- app/onboarding/hospital/widgets/TemplateGallery.tsx (add data attributes)
- app/onboarding/hospital/steps/InvitationTemplateStep.tsx (add data attributes)
```

---

## Task 4: Template Preview & CSS Fixes

### Current State
- ❌ Preview button has visibility/CSS issues
- ❌ Section previews show only half of the actual space

### Requirements
- Fix preview button styling to be properly visible
- Make section previews show complete/full space

### Detailed Implementation Prompt

```
TASK: Fix Template Preview Button & Section Preview Styling

CONTEXT:
- TemplateGallery widget: app/onboarding/hospital/widgets/TemplateGallery.tsx
- TemplatePreview component: components/onboarding/TemplatePreview.tsx
- Issue 1: Preview button not properly visible
- Issue 2: Section previews truncated

IMPLEMENT THE FOLLOWING:

1. **Fix Preview Button Styling**
   File: app/onboarding/hospital/widgets/TemplateGallery.tsx
   
   Current issue: Button may be hidden behind overlays or have wrong z-index
   
   ```tsx
   {/* Preview Button - Fixed Styling */}
   <Button
     variant="outline"
     size="sm"
     onClick={(e) => {
       e.stopPropagation(); // Prevent card selection
       handlePreview(template);
     }}
     className={cn(
       "absolute top-3 right-3 z-20",
       "bg-white/95 backdrop-blur-sm",
       "border-2 border-healthcare-primary/30",
       "text-healthcare-primary font-medium",
       "hover:bg-healthcare-primary hover:text-white",
       "hover:border-healthcare-primary",
       "shadow-lg shadow-black/10",
       "transition-all duration-200",
       "px-4 py-2",
       // Ensure visibility on different backgrounds
       "ring-1 ring-white"
     )}
   >
     <Eye className="w-4 h-4 mr-1.5" />
     Preview
   </Button>
   ```

2. **Fix Section Preview Container**
   File: components/onboarding/TemplatePreview.tsx
   
   Issue: Preview container has constrained height/width
   
   ```tsx
   {/* Full-width preview container */}
   <div className="w-full h-full min-h-[600px] relative">
     {/* Desktop Preview */}
     {previewMode === 'desktop' && (
       <div className="w-full h-full bg-white rounded-lg shadow-inner overflow-hidden">
         <iframe
           src={previewUrl}
           className="w-full h-full min-h-[600px] border-0"
           title="Template Preview"
         />
       </div>
     )}
     
     {/* Tablet Preview */}
     {previewMode === 'tablet' && (
       <div className="mx-auto w-[768px] max-w-full h-full">
         <div className="bg-gray-900 rounded-[2rem] p-3 h-full">
           <div className="bg-white rounded-xl overflow-hidden h-full min-h-[500px]">
             <iframe src={previewUrl} className="w-full h-full" />
           </div>
         </div>
       </div>
     )}
     
     {/* Mobile Preview */}
     {previewMode === 'mobile' && (
       <div className="mx-auto w-[375px] h-full">
         <div className="bg-gray-900 rounded-[2.5rem] p-3 h-full">
           <div className="bg-white rounded-[2rem] overflow-hidden h-full min-h-[667px]">
             <iframe src={previewUrl} className="w-full h-full" />
           </div>
         </div>
       </div>
     )}
   </div>
   ```

3. **Preview Modal Full-Screen Option**
   Add ability to view preview in full screen:
   
   ```tsx
   const [isFullScreen, setIsFullScreen] = useState(false);
   
   <Dialog open={showPreview} onOpenChange={setShowPreview}>
     <DialogContent 
       className={cn(
         "transition-all duration-300",
         isFullScreen 
           ? "max-w-[100vw] w-screen h-screen max-h-screen m-0 rounded-none"
           : "max-w-5xl w-[95vw] max-h-[90vh]"
       )}
     >
       <DialogHeader className="flex-row items-center justify-between">
         <DialogTitle>{selectedTemplate?.name} Preview</DialogTitle>
         <div className="flex items-center gap-2">
           <Button
             variant="ghost"
             size="sm"
             onClick={() => setIsFullScreen(!isFullScreen)}
           >
             {isFullScreen ? <Minimize2 /> : <Maximize2 />}
           </Button>
         </div>
       </DialogHeader>
       
       {/* Preview content with proper sizing */}
       <div className={cn(
         "flex-1 overflow-hidden",
         isFullScreen ? "h-[calc(100vh-80px)]" : "h-[70vh]"
       )}>
         {/* Preview iframe/content */}
       </div>
     </DialogContent>
   </Dialog>
   ```

4. **Template Card Preview Section**
   File: app/onboarding/hospital/widgets/TemplateGallery.tsx
   
   ```tsx
   {/* Template Card with Full Preview Area */}
   <div 
     className={cn(
       "group relative rounded-xl overflow-hidden cursor-pointer",
       "border-2 transition-all duration-300",
       "aspect-[16/10]", // Proper aspect ratio for preview
       isSelected 
         ? "border-healthcare-primary ring-4 ring-healthcare-primary/20" 
         : "border-gray-200 hover:border-healthcare-primary/50"
     )}
   >
     {/* Template Preview Image - Full Coverage */}
     <div className="absolute inset-0">
       <img
         src={template.previewImage}
         alt={template.name}
         className="w-full h-full object-cover object-top"
       />
       
       {/* Gradient overlay for text readability */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
     </div>
     
     {/* Preview button - always visible */}
     <Button
       variant="secondary"
       size="sm"
       onClick={(e) => {
         e.stopPropagation();
         handlePreview(template);
       }}
       className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
     >
       <Eye className="w-4 h-4 mr-1" />
       Preview
     </Button>
     
     {/* Template info at bottom */}
     <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
       <h4 className="font-semibold text-white text-lg">{template.name}</h4>
       <p className="text-white/80 text-sm">{template.description}</p>
     </div>
   </div>
   ```

FILES TO MODIFY:
- app/onboarding/hospital/widgets/TemplateGallery.tsx
- components/onboarding/TemplatePreview.tsx
- app/onboarding/hospital/page.tsx (if preview modal is there)
```

---

## Task 5: Image Toolbox Enhancement

### Current State
- ✅ ImageToolbox.tsx exists with AI, Stock, Upload, Recent tabs
- ❌ Not integrated into template sections
- ❌ No way to insert images into specific template areas

### Requirements
- Add image toolbox button in each template section
- Allow selecting images for specific areas (hero, services, testimonials, etc.)
- Support AI generation, stock photos, upload, and recent images

### Detailed Implementation Prompt

```
TASK: Integrate Image Toolbox into Template Sections

CONTEXT:
- ImageToolbox component: components/onboarding/ImageToolbox.tsx
- Already has: AI generation, stock photos, upload, recent images
- Need to integrate into: SiteContentStep.tsx and BrandingStudioStep.tsx

IMPLEMENT THE FOLLOWING:

1. **Create Section-Aware Image Selection**
   File: app/onboarding/hospital/steps/SiteContentStep.tsx
   
   ```tsx
   import { ImageToolbox } from '@/components/onboarding/ImageToolbox';
   
   // Define image sections
   const IMAGE_SECTIONS = {
     hero_background: {
       label: "Hero Background",
       description: "Main banner image for your homepage",
       recommended: "1920x1080px, landscape orientation",
       category: "banner" as const,
     },
     hero_foreground: {
       label: "Hero Foreground",
       description: "Featured image on hero section",
       recommended: "800x600px",
       category: "general" as const,
     },
     services_icons: {
       label: "Service Images",
       description: "Images for each service card",
       recommended: "400x400px, square",
       category: "general" as const,
     },
     testimonial_photos: {
       label: "Testimonial Photos",
       description: "Patient photos (with consent)",
       recommended: "200x200px, square",
       category: "general" as const,
     },
     about_section: {
       label: "About Section",
       description: "Hospital/facility images",
       recommended: "1200x800px",
       category: "general" as const,
     },
     gallery: {
       label: "Image Gallery",
       description: "Additional hospital images",
       recommended: "Various sizes",
       category: "general" as const,
     },
   };
   
   // State for section images
   const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
   
   // Handle image selection for a section
   const handleImageSelect = (section: string, url: string, metadata?: any) => {
     setSectionImages(prev => ({
       ...prev,
       [section]: url,
     }));
     
     // Update context with image
     updateData('branding', {
       ...data.branding,
       images: {
         ...data.branding.images,
         [section]: url,
       },
     });
   };
   ```

2. **Image Section Component**
   Create reusable image section component:
   
   ```tsx
   interface ImageSectionProps {
     sectionKey: string;
     config: typeof IMAGE_SECTIONS[keyof typeof IMAGE_SECTIONS];
     currentImage?: string;
     onImageSelect: (url: string, metadata?: any) => void;
   }
   
   function ImageSection({ sectionKey, config, currentImage, onImageSelect }: ImageSectionProps) {
     return (
       <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-healthcare-primary/50 transition-colors">
         <div className="flex items-start justify-between mb-3">
           <div>
             <h4 className="font-medium text-gray-900">{config.label}</h4>
             <p className="text-sm text-gray-500">{config.description}</p>
             <p className="text-xs text-gray-400 mt-1">
               Recommended: {config.recommended}
             </p>
           </div>
           
           <ImageToolbox
             onImageSelect={(url, meta) => onImageSelect(url, meta)}
             category={config.category}
             currentImage={currentImage}
             title={`Select ${config.label}`}
             trigger={
               <Button variant="outline" size="sm" className="gap-2">
                 <Image className="w-4 h-4" />
                 {currentImage ? 'Change' : 'Add Image'}
               </Button>
             }
           />
         </div>
         
         {/* Preview */}
         {currentImage ? (
           <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
             <img
               src={currentImage}
               alt={config.label}
               className="w-full h-full object-cover"
             />
             <Button
               variant="destructive"
               size="sm"
               className="absolute top-2 right-2"
               onClick={() => onImageSelect('')}
             >
               <X className="w-4 h-4" />
             </Button>
           </div>
         ) : (
           <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
             <div className="text-center">
               <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
               <p className="text-sm text-gray-400">No image selected</p>
             </div>
           </div>
         )}
       </div>
     );
   }
   ```

3. **Integrate into Hero Section**
   File: app/onboarding/hospital/steps/SiteContentStep.tsx
   
   ```tsx
   {/* Hero Section */}
   <FormSection title="Hero Section" icon={Star}>
     {/* Existing fields */}
     <FormField label="Headline" required>
       <Input ... />
     </FormField>
     
     {/* NEW: Hero Images */}
     <div className="grid md:grid-cols-2 gap-4 mt-4">
       <ImageSection
         sectionKey="hero_background"
         config={IMAGE_SECTIONS.hero_background}
         currentImage={sectionImages.hero_background}
         onImageSelect={(url, meta) => handleImageSelect('hero_background', url, meta)}
       />
       <ImageSection
         sectionKey="hero_foreground"
         config={IMAGE_SECTIONS.hero_foreground}
         currentImage={sectionImages.hero_foreground}
         onImageSelect={(url, meta) => handleImageSelect('hero_foreground', url, meta)}
       />
     </div>
   </FormSection>
   ```

4. **Enhance ImageToolbox with Healthcare-Specific Stock Images**
   File: components/onboarding/ImageToolbox.tsx
   
   Add more healthcare-specific categories:
   ```tsx
   const HEALTHCARE_STOCK_CATEGORIES = [
     { id: 'hospital_exterior', label: 'Hospital Buildings', count: 25 },
     { id: 'hospital_interior', label: 'Hospital Interiors', count: 30 },
     { id: 'medical_staff', label: 'Medical Staff', count: 40 },
     { id: 'patient_care', label: 'Patient Care', count: 35 },
     { id: 'medical_equipment', label: 'Medical Equipment', count: 20 },
     { id: 'laboratory', label: 'Laboratory', count: 15 },
     { id: 'pharmacy', label: 'Pharmacy', count: 12 },
     { id: 'emergency', label: 'Emergency Care', count: 18 },
     { id: 'surgery', label: 'Surgery & OR', count: 22 },
     { id: 'pediatrics', label: 'Pediatrics', count: 15 },
     { id: 'maternity', label: 'Maternity', count: 12 },
     { id: 'rehabilitation', label: 'Rehabilitation', count: 10 },
   ];
   ```

5. **AI Image Generation Prompts for Healthcare**
   ```tsx
   const HEALTHCARE_AI_PROMPTS = [
     "Modern hospital building with glass facade and greenery",
     "Friendly medical team of doctors and nurses smiling",
     "Clean and bright hospital reception area",
     "State-of-the-art medical equipment in a modern setting",
     "Peaceful hospital room with natural lighting",
     "Doctor consulting with patient in a comfortable setting",
     "Medical laboratory with modern equipment",
     "Hospital pharmacy with organized medicine shelves",
     "Emergency room with professional medical staff",
     "Pediatric ward with colorful decorations",
   ];
   ```

FILES TO MODIFY:
- components/onboarding/ImageToolbox.tsx (enhance)
- app/onboarding/hospital/steps/SiteContentStep.tsx (integrate)
- app/onboarding/hospital/steps/BrandingStudioStep.tsx (integrate for logo)
- contexts/HospitalOnboardingContextV2.tsx (add images to state)
```

---

## Task 6: Auto-Save Branding Details

### Current State
- ✅ Autosave exists (1-second throttled, localStorage)
- ❌ "Update" button may still be present
- ❌ "Continue to Profile" floating button present

### Requirements
- Remove manual "Update" button - use only autosave
- Remove "Continue to Profile" floating button
- Ensure branding changes sync to backend automatically

### Detailed Implementation Prompt

```
TASK: Implement Seamless Auto-Save for Branding

CONTEXT:
- Auto-save infrastructure exists in HospitalOnboardingContextV2
- Currently saves to localStorage
- Need to also sync to backend

IMPLEMENT THE FOLLOWING:

1. **Remove Manual Update Button**
   File: app/onboarding/hospital/steps/BrandingStudioStep.tsx
   
   Search for and remove any "Update", "Save Changes", or similar buttons:
   ```tsx
   // REMOVE this type of code:
   <Button onClick={handleSaveChanges}>
     Update Branding
   </Button>
   ```

2. **Remove Floating "Continue to Profile" Button**
   File: app/onboarding/hospital/page.tsx
   
   The current floating button implementation (lines 580-610) should be removed
   or made less intrusive:
   ```tsx
   // REMOVE or modify this:
   {isStepValid(currentStep) && currentStep < STEP_CONFIGS.length - 1 && (
     <motion.div className="fixed bottom-8 ...">
       <Button>Continue to {STEP_CONFIGS[currentStep + 1]?.title}</Button>
     </motion.div>
   )}
   ```
   
   Instead, rely on the standard navigation footer.

3. **Enhanced Auto-Save with Backend Sync**
   File: contexts/HospitalOnboardingContextV2.tsx
   
   ```tsx
   // Add backend sync to autosave
   const autoSave = useCallback(
     debounce(async (newData: OnboardingData) => {
       setIsSaving(true);
       
       // 1. Save to localStorage (fast, reliable)
       const storageKey = `hospital-onboarding-${invitationId}`;
       localStorage.setItem(storageKey, JSON.stringify({
         data: newData,
         timestamp: new Date().toISOString(),
         version: 2,
       }));
       
       // 2. Sync to backend (async, non-blocking)
       try {
         const sessionToken = localStorage.getItem('onboarding_session_token');
         if (sessionToken) {
           await fetch('/api/v1/onboarding/save-progress', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${sessionToken}`,
             },
             body: JSON.stringify({
               step: currentStep,
               data: newData,
               timestamp: new Date().toISOString(),
             }),
           });
         }
       } catch (error) {
         // Don't block on backend errors - localStorage is backup
         console.warn('Backend sync failed, data saved locally:', error);
       }
       
       setLastSaved(new Date());
       setIsSaving(false);
     }, 1000),
     [invitationId, currentStep]
   );
   ```

4. **Visual Auto-Save Indicator**
   Keep the existing save indicator but make it more subtle:
   ```tsx
   {/* Auto-save indicator - subtle version */}
   <AnimatePresence>
     {isSaving && (
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100 flex items-center gap-2 text-xs text-gray-600"
       >
         <div className="w-1.5 h-1.5 bg-healthcare-primary rounded-full animate-pulse" />
         Saving...
       </motion.div>
     )}
   </AnimatePresence>
   
   {/* Last saved indicator */}
   {lastSaved && !isSaving && (
     <div className="text-xs text-gray-400">
       Auto-saved {formatTimeAgo(lastSaved)}
     </div>
   )}
   ```

5. **Branding-Specific Auto-Save Fields**
   Ensure these fields trigger auto-save:
   - Primary color
   - Secondary color
   - Logo upload
   - Favicon upload
   - Font selections
   - Theme preferences
   
   ```tsx
   // In BrandingStudioStep.tsx
   const handleColorChange = (field: string, value: string) => {
     updateData('branding', {
       ...data.branding,
       [field]: value,
     });
     // Auto-save is triggered automatically by context
   };
   ```

FILES TO MODIFY:
- contexts/HospitalOnboardingContextV2.tsx (enhance autosave)
- app/onboarding/hospital/page.tsx (remove floating button)
- app/onboarding/hospital/steps/BrandingStudioStep.tsx (remove update button)
```

---

## Task 7: Custom Hospital Login Page Builder

### Current State
- ✅ LoginPageBuilder.tsx exists in components/onboarding
- ✅ CustomLoginPage.tsx exists
- ❌ Not integrated into onboarding flow
- ❌ Needs hospital branding integration

### Requirements
- Add login page customization step in onboarding
- Allow custom background (blur effect on hospital image)
- Login form with matching template colors
- "Powered by Athaarva" branding
- Email/phone + password fields

### Detailed Implementation Prompt

```
TASK: Create Hospital Login Page Customization Step

CONTEXT:
- LoginPageBuilder: components/onboarding/LoginPageBuilder.tsx
- CustomLoginPage: components/onboarding/CustomLoginPage.tsx
- Should follow hospital's selected template branding
- Need to create new step in onboarding flow

IMPLEMENT THE FOLLOWING:

1. **Create New Step: LoginPageCustomizationStep.tsx**
   File: app/onboarding/hospital/steps/LoginPageCustomizationStep.tsx
   
   ```tsx
   "use client";
   
   import React, { useState } from "react";
   import { motion } from "framer-motion";
   import { Lock, Image, Palette, Eye, Smartphone, Monitor } from "lucide-react";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Slider } from "@/components/ui/slider";
   import { Switch } from "@/components/ui/switch";
   import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
   import { ImageToolbox } from "@/components/onboarding/ImageToolbox";
   import { cn } from "@/lib/utils";
   
   interface LoginPageConfig {
     backgroundImage: string;
     backgroundBlur: number; // 0-20
     backgroundColor: string;
     useGradientOverlay: boolean;
     gradientDirection: 'to-r' | 'to-b' | 'to-br';
     formPosition: 'center' | 'left' | 'right';
     formStyle: 'card' | 'transparent' | 'floating';
     showHospitalLogo: boolean;
     showAthaarvabranding: boolean;
     athaarvaPosition: 'footer' | 'form-bottom';
     customWelcomeText: string;
     customSubtext: string;
   }
   
   export default function LoginPageCustomizationStep() {
     const { data, updateData } = useHospitalOnboarding();
     const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
     const [config, setConfig] = useState<LoginPageConfig>({
       backgroundImage: '',
       backgroundBlur: 8,
       backgroundColor: data.branding.primary_color || '#007C7C',
       useGradientOverlay: true,
       gradientDirection: 'to-br',
       formPosition: 'center',
       formStyle: 'card',
       showHospitalLogo: true,
       showAthaarvabranding: true,
       athaarvaPosition: 'footer',
       customWelcomeText: `Welcome to ${data.organizationProfile.legal_name || 'Your Hospital'}`,
       customSubtext: 'Sign in to access your health portal',
     });
   
     const updateConfig = (updates: Partial<LoginPageConfig>) => {
       const newConfig = { ...config, ...updates };
       setConfig(newConfig);
       updateData('loginPage', newConfig);
     };
   
     return (
       <div className="space-y-8">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-gradient-to-r from-healthcare-primary/10 to-healthcare-emerald/10 rounded-xl p-6"
         >
           <div className="flex items-start gap-4">
             <div className="w-12 h-12 bg-healthcare-primary rounded-lg flex items-center justify-center">
               <Lock className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-gray-900">
                 Customize Your Login Page
               </h3>
               <p className="text-gray-600 mt-1">
                 Create a branded login experience that matches your hospital's identity.
                 This is the first thing patients and staff will see.
               </p>
             </div>
           </div>
         </motion.div>
   
         <div className="grid lg:grid-cols-2 gap-8">
           {/* Configuration Panel */}
           <div className="space-y-6">
             {/* Background Settings */}
             <div className="bg-white rounded-lg border p-6 space-y-4">
               <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                 <Image className="w-5 h-5 text-healthcare-primary" />
                 Background Settings
               </h4>
               
               {/* Background Image */}
               <div>
                 <Label>Background Image</Label>
                 <div className="mt-2">
                   <ImageToolbox
                     onImageSelect={(url) => updateConfig({ backgroundImage: url })}
                     category="background"
                     currentImage={config.backgroundImage}
                     title="Select Login Background"
                     trigger={
                       <Button variant="outline" className="w-full justify-start gap-2">
                         <Image className="w-4 h-4" />
                         {config.backgroundImage ? 'Change Background' : 'Select Background Image'}
                       </Button>
                     }
                   />
                 </div>
               </div>
               
               {/* Blur Amount */}
               <div>
                 <Label>Background Blur: {config.backgroundBlur}px</Label>
                 <Slider
                   value={[config.backgroundBlur]}
                   onValueChange={([value]) => updateConfig({ backgroundBlur: value })}
                   min={0}
                   max={20}
                   step={1}
                   className="mt-2"
                 />
               </div>
               
               {/* Gradient Overlay */}
               <div className="flex items-center justify-between">
                 <Label>Add Gradient Overlay</Label>
                 <Switch
                   checked={config.useGradientOverlay}
                   onCheckedChange={(checked) => updateConfig({ useGradientOverlay: checked })}
                 />
               </div>
             </div>
   
             {/* Form Settings */}
             <div className="bg-white rounded-lg border p-6 space-y-4">
               <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                 <Palette className="w-5 h-5 text-healthcare-primary" />
                 Login Form Settings
               </h4>
               
               {/* Form Position */}
               <div>
                 <Label>Form Position</Label>
                 <div className="flex gap-2 mt-2">
                   {(['left', 'center', 'right'] as const).map((pos) => (
                     <Button
                       key={pos}
                       variant={config.formPosition === pos ? 'default' : 'outline'}
                       size="sm"
                       onClick={() => updateConfig({ formPosition: pos })}
                       className="flex-1 capitalize"
                     >
                       {pos}
                     </Button>
                   ))}
                 </div>
               </div>
               
               {/* Form Style */}
               <div>
                 <Label>Form Style</Label>
                 <div className="flex gap-2 mt-2">
                   {(['card', 'transparent', 'floating'] as const).map((style) => (
                     <Button
                       key={style}
                       variant={config.formStyle === style ? 'default' : 'outline'}
                       size="sm"
                       onClick={() => updateConfig({ formStyle: style })}
                       className="flex-1 capitalize"
                     >
                       {style}
                     </Button>
                   ))}
                 </div>
               </div>
               
               {/* Welcome Text */}
               <div>
                 <Label>Welcome Text</Label>
                 <Input
                   value={config.customWelcomeText}
                   onChange={(e) => updateConfig({ customWelcomeText: e.target.value })}
                   placeholder="Welcome to Your Hospital"
                   className="mt-2"
                 />
               </div>
               
               {/* Subtext */}
               <div>
                 <Label>Subtext</Label>
                 <Input
                   value={config.customSubtext}
                   onChange={(e) => updateConfig({ customSubtext: e.target.value })}
                   placeholder="Sign in to access your health portal"
                   className="mt-2"
                 />
               </div>
             </div>
   
             {/* Branding Options */}
             <div className="bg-white rounded-lg border p-6 space-y-4">
               <h4 className="font-semibold text-gray-900">Branding Options</h4>
               
               <div className="flex items-center justify-between">
                 <div>
                   <Label>Show Hospital Logo</Label>
                   <p className="text-xs text-gray-500">Display your logo above the form</p>
                 </div>
                 <Switch
                   checked={config.showHospitalLogo}
                   onCheckedChange={(checked) => updateConfig({ showHospitalLogo: checked })}
                 />
               </div>
               
               <div className="flex items-center justify-between">
                 <div>
                   <Label>Powered by Athaarva</Label>
                   <p className="text-xs text-gray-500">Show platform branding</p>
                 </div>
                 <Switch
                   checked={config.showAthaarvabranding}
                   onCheckedChange={(checked) => updateConfig({ showAthaarvabranding: checked })}
                 />
               </div>
             </div>
           </div>
   
           {/* Live Preview */}
           <div className="sticky top-6">
             <div className="bg-white rounded-lg border overflow-hidden">
               {/* Preview Header */}
      …