# Frontend-Backend Integration Checklist

## 🎯 Quick Reference for Phase 2 Completion

---

## ✅ What's Done (30%)

### Core Infrastructure ✅

- [x] **types/backend-types.ts** - Complete UUID type definitions
- [x] **lib/utils.ts** - UUID validation and migration utilities
- [x] **lib/api-service.ts** - Main API client with UUID support
- [x] **contexts/AppointmentContext.tsx** - State management migrated
- [x] **lib/admin-api.ts** - Partially updated (method signatures)

---

## 🔄 What's Next (70%)

### Immediate Fixes Needed

#### 1. Fix TypeScript Errors (HIGH PRIORITY)

**File:** `modules/doctor-pages/dashboard/CalendarWidget.tsx`

**Errors to fix:**

```typescript
// ❌ Current
const [hoursA, minutesA] = a.time.split(":").map(Number);
appointment.method; // can be undefined

// ✅ Should be
const [hoursA, minutesA] = (a.time || "00:00").split(":").map(Number);
appointment.method || "in-person";
```

**Quick Fix Commands:**

1. Add null coalescing: `appointment.time || '00:00'`
2. Add defaults: `appointment.method || 'in-person'`
3. Use optional chaining: `appointment.time?.split(':')`

---

### 2. Update Page Components (HIGH PRIORITY)

#### Patient Pages

📁 `app/patient/appointments/`

**Files to update:**

1. **schedule/page.tsx**

   ```typescript
   // Update appointment creation
   const appointment = {
     patient_id: currentUserId, // UUID string
     doctor_id: selectedDoctorId, // UUID string
     tenant_id: currentTenantId, // UUID string
     // ... rest of fields
   };
   ```

2. **details/[id]/page.tsx**

   ```typescript
   // Route param is already string (UUID)
   const { id } = params; // This is UUID string

   // Fetch appointment
   const appointment = await fetch(`/api/appointments/${id}`);
   ```

3. **AppointmentsPageClient.tsx**

   ```typescript
   // ❌ Old
   interface Appointment {
     id: number | string;
   }

   // ✅ New
   interface Appointment {
     id: string; // UUID only
     patient_id: string;
     doctor_id: string;
     tenant_id: string;
   }
   ```

#### Doctor Pages

📁 `app/doctor/`

**Files to update:**

1. **patients/page.tsx**

   ```typescript
   // Update patient list interface
   interface Patient {
     id: string; // UUID
     tenant_id: string; // UUID
     status: "active" | "suspended" | "deactivated";
   }
   ```

2. **dashboard/page.tsx**
   - Use AppointmentContext (already migrated)
   - Ensure API calls use UUID parameters

#### Onboarding Pages

📁 `app/onboarding/`

**Files to update:**

1. **doctor/page.tsx**

   ```typescript
   // ❌ Old field names
   hospital_id: hospitalId,
   is_verified: false,

   // ✅ New field names
   tenant_id: tenantId, // UUID string
   verification_status: 'pending',
   status: 'active',
   ```

2. **patient/page.tsx**
   - Same field name updates

---

### 3. Update Component Widgets

#### High Impact Components

**modules/patient-pages/appointments/**

- `AppointmentsPageClient.tsx` - Main appointment list
- `AppointmentsWidget.tsx` - Dashboard widget

**modules/doctor-pages/patients/**

- `patient.ts` - Patient interface (already has UUID)
- Patient list components - Verify UUID usage

**modules/doctor-pages/dashboard/**

- `CalendarWidget.tsx` - Fix optional fields (IN PROGRESS)
- `PatientOverviewWidget.tsx` - Update patient ID type

---

### 4. Mock Data Migration (MEDIUM PRIORITY)

**Strategy:** Replace with real API calls OR update to UUID format

**Files with mock data:**

```
modules/doctor-pages/calendar/mockData/appointments.ts ✅ (already UUID)
modules/patient-pages/medication/MedicationDashboardNew.tsx ❌
modules/patient-pages/family-health/ components ❌
```

**Action:**

- Search for `id: 1`, `id: 2`, etc.
- Replace with `id: 'uuid-here'` or API calls
- Generate UUIDs: `crypto.randomUUID()`

---

### 5. localStorage Migration (HIGH PRIORITY)

**Add to app initialization:**

```typescript
// app/layout.tsx or app/providers.tsx
"use client";

import { useEffect } from "react";
import { migrateLocalStorage } from "@/lib/utils";

export function AppInitializer() {
  useEffect(() => {
    // Run migration once on app load
    migrateLocalStorage();
  }, []);

  return null;
}
```

**What it does:**

- Removes old numeric IDs: `user_id`, `patient_id`, `doctor_id`
- Renames `hospital_code` → `subdomain`
- Renames `hospital_id` → `tenant_id`
- Cleans up stale data

---

### 6. API Endpoint Testing

**Checklist:**

#### Authentication

- [ ] `POST /auth/login` - Returns UUID in JWT
- [ ] `POST /auth/register` - Accepts UUID tenant_id
- [ ] `GET /auth/me` - Returns user with UUID fields

#### Patients

- [ ] `POST /patients/register` - UUID tenant_id
- [ ] `GET /patients/profile` - Returns UUID fields
- [ ] `PUT /patients/profile` - Updates with UUID

#### Doctors

- [ ] `POST /doctors/register` - UUID tenant_id
- [ ] `GET /doctors/profile` - Returns UUID fields
- [ ] `GET /doctors/list` - Returns doctors with UUID

#### Appointments

- [ ] `POST /appointments/create` - UUIDs for patient, doctor, tenant
- [ ] `GET /appointments/{id}` - UUID parameter
- [ ] `PUT /appointments/{id}` - UUID parameter
- [ ] `DELETE /appointments/{id}` - UUID parameter
- [ ] `GET /patients/appointments` - Returns UUID appointments
- [ ] `GET /doctors/appointments` - Returns UUID appointments

#### Admin

- [ ] `GET /admin/doctors` - Returns UUID doctors
- [ ] `PUT /admin/doctors/{id}/status` - UUID parameter
- [ ] `GET /admin/patients` - Returns UUID patients

---

## 🔧 Quick Fix Patterns

### Pattern 1: Update Interface

```typescript
// ❌ Before
interface Entity {
  id: number;
  hospital_id: number;
  is_active: boolean;
}

// ✅ After
interface Entity {
  id: string; // UUID
  tenant_id: string; // UUID
  status: "active" | "suspended" | "deactivated";
}
```

### Pattern 2: Update API Call

```typescript
// ❌ Before
const response = await fetch(`/api/entity/${numericId}`);

// ✅ After
const response = await fetch(`/api/entity/${uuidString}`);
```

### Pattern 3: Update State Management

```typescript
// ❌ Before
const [selectedId, setSelectedId] = useState<number | null>(null);

// ✅ After
const [selectedId, setSelectedId] = useState<string | null>(null);
```

### Pattern 4: Handle Optional Fields

```typescript
// ❌ Before
appointment.time
  .split(":")
  (
    // ✅ After
    appointment.time || "00:00"
  )
  .split(":");
// or
appointment.time?.split(":") || [];
```

---

## 📝 Field Mapping Quick Reference

```typescript
// Old → New
id: number → id: string (UUID)
hospital_id: number → tenant_id: string (UUID)
patient_id: number → patient_id: string (UUID)
doctor_id: number → doctor_id: string (UUID)
user_id: number → user_id: string (UUID)

is_active: boolean → status: 'active' | 'suspended' | 'deactivated'
is_verified: boolean → verification_status: 'pending' | 'approved' | 'rejected'
hospital_code: string → subdomain: string
```

---

## 🧪 Testing Checklist

### Manual Testing

- [ ] Patient registration flow
- [ ] Patient onboarding
- [ ] Patient dashboard loads
- [ ] Patient can book appointment
- [ ] Doctor registration flow
- [ ] Doctor onboarding
- [ ] Doctor dashboard loads
- [ ] Doctor can view appointments
- [ ] Admin can manage users
- [ ] Multi-tenant isolation works

### API Testing

- [ ] All endpoints return UUID fields
- [ ] JWT contains UUID user_id and tenant_id
- [ ] No numeric IDs in responses
- [ ] Status fields use ENUMs not booleans

### Data Testing

- [ ] localStorage has UUIDs only
- [ ] No old field names in localStorage
- [ ] sessionStorage cleaned up
- [ ] Cookies don't contain numeric IDs

---

## 🚨 Common Pitfalls

1. **Mixing number and string IDs**

   ```typescript
   // ❌ Bad
   id: number | string;

   // ✅ Good
   id: string; // Always UUID
   ```

2. **Using old field names**

   ```typescript
   // ❌ Bad
   {
     hospital_id, is_active;
   }

   // ✅ Good
   {
     tenant_id, status;
   }
   ```

3. **Not validating UUIDs**

   ```typescript
   // ❌ Bad
   const id = localStorage.getItem("user_id");
   fetch(`/api/user/${id}`); // Could be old numeric ID!

   // ✅ Good
   const id = localStorage.getItem("user_id");
   if (!isValidUUID(id)) {
     // Handle error or migrate
   }
   fetch(`/api/user/${id}`);
   ```

4. **Forgetting optional chaining**

   ```typescript
   // ❌ Bad
   appointment.time.split(":");

   // ✅ Good
   appointment.time?.split(":") || [];
   ```

---

## 📊 Progress Tracking

**Update this as you complete tasks:**

### Layer 1: Types & Utils ✅ (100%)

- [x] backend-types.ts
- [x] utils.ts
- [x] API service types

### Layer 2: API Services ✅ (90%)

- [x] api-service.ts
- [x] admin-api.ts (partial)
- [ ] hospital-service.ts (if exists)

### Layer 3: Context Providers ✅ (100%)

- [x] AppointmentContext.tsx
- [ ] Other contexts (if any)

### Layer 4: Components 🔄 (20%)

- [x] CalendarWidget.tsx (interface done, errors remain)
- [ ] AppointmentsPageClient.tsx
- [ ] Patient widgets
- [ ] Doctor widgets

### Layer 5: Pages 🔄 (10%)

- [ ] app/patient/appointments/
- [ ] app/doctor/
- [ ] app/onboarding/
- [ ] app/admin/

### Layer 6: Testing ⏳ (0%)

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

## 🎯 Today's Goal

**Complete:** Layer 4 (Components) - 6-8 hours

**Priority order:**

1. Fix CalendarWidget.tsx errors (30 min)
2. Update AppointmentsPageClient.tsx (1 hour)
3. Update appointment pages (2 hours)
4. Update doctor pages (1 hour)
5. Update onboarding pages (1 hour)
6. Run localStorage migration (30 min)
7. Basic integration testing (2 hours)

**Expected outcome:**

- All TypeScript errors resolved
- Core user flows working (register → onboard → use app)
- Frontend fully connected to UUID backend

---

**Status:** 30% Complete  
**Last Updated:** Just now  
**Next Update:** After CalendarWidget fixes
