# 🚀 Frontend Migration Plan - Phase 2

**Date:** October 29, 2025  
**Status:** IN PROGRESS  
**Goal:** Connect Frontend to UUID-based Multi-Tenant Backend

---

## Migration Strategy

### Phase 2.1: Core Type System (30 min)

- ✅ Update `types/backend-types.ts` (already partially done)
- ⏳ Update `lib/utils.ts` with UUID helpers
- ⏳ Update `lib/api-config.ts`
- ⏳ Update `lib/api-service.ts` (partially done, needs completion)

### Phase 2.2: Authentication & Context (45 min)

- ⏳ Update JWT token handling
- ⏳ Update auth context
- ⏳ Update localStorage keys
- ⏳ Fix login/register flows

### Phase 2.3: API Integrations (1-2 hours)

- ⏳ Patient APIs
- ⏳ Doctor APIs
- ⏳ Appointment APIs
- ⏳ Admin APIs

### Phase 2.4: Component Updates (2-3 hours)

- ⏳ Patient dashboard & widgets
- ⏳ Doctor dashboard & calendar
- ⏳ Appointment components
- ⏳ Profile pages
- ⏳ Admin pages

### Phase 2.5: Testing & Validation (1 hour)

- ⏳ Test all user flows
- ⏳ Verify UUID handling
- ⏳ Check tenant isolation
- ⏳ Performance testing

---

## Current Issues Found

### 1. Mixed ID Types

**Problem:** Some files still use `number` for IDs
**Files Affected:**

- `modules/doctor-pages/dashboard/CalendarWidget.tsx` (line 7-19)
- `modules/doctor-pages/dashboard/PatientOverviewWidget.tsx` (line 6-18)
- `contexts/AppointmentContext.tsx` (line 12-35)
- Mock data files in `modules/doctor-pages/calendar/mockData/`

**Solution:** Update all ID types to `string` (UUID)

### 2. API Calls Using Integer IDs

**Problem:** API endpoints using `parseInt(userId)`
**Files Affected:**

- `modules/doctor-pages/dashboard/CalendarWidget.tsx` (line 36)

**Solution:** Remove parseInt, use string UUIDs directly

### 3. Field Name Mismatches

**Problem:** Using old field names

- `patient_id`, `doctor_id`, `hospital_id` → should be `id`, `tenant_id`
- `is_active`, `is_verified` → should be `status`, `verification_status`

**Solution:** Update all field references

---

## Implementation Steps

### Step 1: Update Core Utilities ✅

- [x] Review `types/backend-types.ts`
- [ ] Complete `lib/utils.ts` UUID helpers
- [ ] Update `lib/api-service.ts`

### Step 2: Fix Authentication

- [ ] Update JWT token parsing
- [ ] Fix localStorage keys
- [ ] Update auth context

### Step 3: Update API Calls

- [ ] Patient endpoints
- [ ] Doctor endpoints
- [ ] Appointment endpoints

### Step 4: Fix Components

- [ ] Dashboards
- [ ] Calendars
- [ ] Appointment pages
- [ ] Profile pages

### Step 5: Test Integration

- [ ] Test patient flow
- [ ] Test doctor flow
- [ ] Test appointments
- [ ] Verify UUIDs

---

## Backend Changes Reference

From backend migration:

```typescript
// OLD Backend (Integer IDs)
interface Patient {
  patient_id: number;
  hospital_id: number;
  is_active: boolean;
  is_verified: boolean;
}

// NEW Backend (UUID Multi-Tenant)
interface Patient {
  id: string; // UUID
  user_id: string; // UUID
  tenant_id: string; // UUID
  full_name: string;
  email: string;
  phone: string;
  status: "active" | "suspended" | "deactivated";
  verification_status: "pending" | "approved" | "rejected";
  personal_details: Record<string, any>;
}

// JWT Token Payload
interface JWTPayload {
  id: string; // UUID (not user_id)
  tenant_id: string; // UUID (not hospital_id)
  subdomain: string; // (not hospital_code)
  user_type: "patient" | "doctor" | "hospital_admin" | "super_admin";
  full_name: string;
  email: string;
  exp: number;
}
```

---

## Files to Update (Priority Order)

### High Priority (Core)

1. `lib/utils.ts` - Add UUID validation
2. `lib/api-service.ts` - Complete UUID updates
3. `lib/api-config.ts` - Verify endpoints
4. `contexts/AuthContext.tsx` - JWT + localStorage
5. `contexts/AppointmentContext.tsx` - UUID types

### Medium Priority (Components)

6. `modules/doctor-pages/dashboard/CalendarWidget.tsx`
7. `modules/doctor-pages/dashboard/PatientOverviewWidget.tsx`
8. `modules/patient-pages/dashboard/AppointmentsWidget.tsx`
9. `app/patient/appointments/schedule/page.tsx`
10. `app/doctor/patients/page.tsx`

### Low Priority (Mock Data - Optional)

11. `modules/doctor-pages/calendar/mockData/patients.ts`
12. `modules/doctor-pages/calendar/mockData/appointments.ts`

---

## Testing Checklist

- [ ] Patient registration with UUID
- [ ] Patient login
- [ ] Doctor registration with UUID
- [ ] Doctor login
- [ ] Appointment booking (UUID references)
- [ ] Appointment viewing
- [ ] Profile updates
- [ ] Admin operations
- [ ] Multi-tenant isolation
- [ ] UUID validation

---

**Next Action:** Begin Step 1 - Update Core Utilities
