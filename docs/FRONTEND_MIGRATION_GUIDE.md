# 🔄 Frontend Migration Guide - UUID Multi-Tenant Architecture

**Date:** October 29, 2025  
**Status:** In Progress  
**Backend Migration:** ✅ Complete (95%)  
**Frontend Migration:** 🔄 Starting

---

## Executive Summary

This guide covers the complete frontend migration to align with the new UUID-based multi-tenant backend architecture. All ID types, field names, and API integrations need to be updated.

---

## Breaking Changes Overview

### 1. **ID Type Changes** (CRITICAL)

**OLD:** All IDs were `number` (integer)  
**NEW:** All IDs are `string` (UUID format)

```typescript
// ❌ OLD
interface Patient {
  patient_id: number;
  hospital_id: number;
}

// ✅ NEW
interface Patient {
  id: string; // UUID: "660e8400-e29b-41d4-a716-446655440001"
  tenant_id: string; // UUID
}
```

### 2. **Field Name Changes** (CRITICAL)

```typescript
// Field Renames
hospital_id → tenant_id
hospital_code → subdomain
patient_id → id
doctor_id → id
is_active → status ('active' | 'suspended' | 'deactivated')
is_verified → verification_status ('pending' | 'approved' | 'rejected')
```

### 3. **JWT Token Structure** (CRITICAL)

```typescript
// ❌ OLD
interface JWTPayload {
  user_id: number;
  hospital_id: number;
  hospital_code: string;
  is_verified: boolean;
}

// ✅ NEW
interface JWTPayload {
  id: string; // UUID (not user_id)
  tenant_id: string; // UUID (not hospital_id)
  subdomain: string; // (not hospital_code)
  user_type: string;
  full_name: string;
  email: string;
  exp: number;
}
```

---

## Migration Checklist

### Phase 1: Core Type Definitions (Priority: CRITICAL)

- [ ] Update `contexts/AuthContext.tsx` - User interface
- [ ] Update `lib/api-service.ts` - All interfaces
- [ ] Update `lib/admin-api.ts` - Admin interfaces
- [ ] Create UUID validation utilities
- [ ] Update all type definition files

### Phase 2: API Integration (Priority: HIGH)

- [ ] Update API service base methods
- [ ] Add UUID validation to all API calls
- [ ] Update request/response mappers
- [ ] Fix all endpoint paths
- [ ] Add tenant context to headers

### Phase 3: Component Updates (Priority: HIGH)

- [ ] Update all form components
- [ ] Fix ID-based navigation
- [ ] Update data display components
- [ ] Fix filtering/search components

### Phase 4: Storage Updates (Priority: MEDIUM)

- [ ] Update localStorage keys
- [ ] Update sessionStorage usage
- [ ] Fix cookie handling
- [ ] Update JWT token parsing

### Phase 5: Testing (Priority: HIGH)

- [ ] Test authentication flow
- [ ] Test patient registration
- [ ] Test doctor onboarding
- [ ] Test appointment booking
- [ ] Test admin functions

---

## File-by-File Migration Plan

### 1. Type Definitions

#### `contexts/AuthContext.tsx`

**Changes:**

- `id: number` → `id: string`
- Remove `is_verified`, `is_active`
- Add `status`, `verification_status`
- Update JWT parsing

#### `lib/api-service.ts`

**Changes:**

- All ID parameters: `number` → `string`
- Update User interface
- Add UUID validation
- Update response mappers

#### `lib/admin-api.ts`

**Changes:**

- Doctor/Patient interfaces: IDs to string
- Update field names
- Add UUID validation

### 2. Context Files

#### `contexts/AppointmentContext.tsx`

- Appointment IDs: `number` → `string`
- `patient_id`, `doctor_id`, `hospital_id` → UUIDs
- Add UUID validation

#### `contexts/MedicalRecordsContext.tsx`

- Record IDs: `number` → `string`
- `patient_id` → `id` (UUID)

#### `contexts/HospitalOnboardingContext.tsx`

- `hospital_id` → `tenant_id` (UUID)
- `hospital_code` → `subdomain`

### 3. Page Components

#### Patient Pages

- `app/patient/**/*.tsx` - Update all patient IDs to UUID
- Remove `is_active`, add `status`
- Update localStorage usage

#### Doctor Pages

- `app/doctor/**/*.tsx` - Update all doctor IDs to UUID
- Update patient references to UUID
- Fix appointment IDs

#### Admin Pages

- `app/Admin/**/*.tsx` - Update all entity IDs
- Fix doctor/staff listings
- Update status handling

### 4. Utility Files

#### `lib/utils.ts`

Add UUID utilities:

```typescript
export function isValidUUID(uuid: string): boolean {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export function formatUUID(uuid: string): string {
  return uuid; // UUIDs don't need formatting
}
```

---

## Critical Changes by Feature

### Authentication

**Files:** `contexts/AuthContext.tsx`, `app/auth/**/*.tsx`

**Changes:**

1. JWT token parsing - use `id` not `user_id`
2. Add `tenant_id` and `subdomain` to auth state
3. Remove `is_verified` checks, use `verification_status`
4. Update localStorage keys

### Appointments

**Files:** `contexts/AppointmentContext.tsx`, `app/patient/appointments/**/*.tsx`

**Changes:**

1. All appointment IDs to UUID
2. `patient_id`, `doctor_id`, `hospital_id` → UUIDs
3. Add UUID validation before API calls
4. Update filtering logic

### Doctor Onboarding

**Files:** `app/onboarding/doctor/**/*.tsx`

**Changes:**

1. User ID to UUID
2. Specialization IDs stay as integers
3. Update profile data structure
4. Fix JSONB field handling

### Patient Onboarding

**Files:** `app/onboarding/patient/**/*.tsx`

**Changes:**

1. User ID to UUID
2. Insurance handling with UUID
3. Medical history with UUID
4. Fix personal_details JSONB

### Admin Dashboard

**Files:** `app/Admin/**/*.tsx`, `hooks/useAdminDashboard.ts`

**Changes:**

1. All doctor/staff IDs to UUID
2. Update status field from boolean to enum
3. Fix verification status handling
4. Update table displays

---

## API Endpoint Changes

### Updated Endpoints

```typescript
// Patient endpoints
GET / api / v1 / patients / { uuid }; // was: /patients/{id}
PUT / api / v1 / patients / { uuid } / profile;
GET / api / v1 / patients / { uuid } / appointments;

// Doctor endpoints
GET / api / v1 / doctors / { uuid };
PUT / api / v1 / doctors / { uuid } / profile;
GET / api / v1 / doctors / { uuid } / schedule;

// Appointment endpoints
POST / api / v1 / appointments;
GET / api / v1 / appointments / { uuid };
PUT / api / v1 / appointments / { uuid };
DELETE / api / v1 / appointments / { uuid };
```

### New Query Parameters

- `tenant_id` - UUID for filtering by tenant
- All ID filters now expect UUID strings

---

## localStorage/sessionStorage Updates

### Keys to Update

```typescript
// OLD Keys (remove)
"user_id"; // was number
"hospital_id"; // was number
"hospital_code"; // rename to subdomain
"patient_id"; // was number
"doctor_id"; // was number

// NEW Keys (use)
"user_id"; // now UUID string
"tenant_id"; // UUID string
"subdomain"; // string
"patient_id"; // UUID string
"doctor_id"; // UUID string
```

### Migration Function

```typescript
function migrateLocalStorage() {
  // Clear old numeric IDs
  const keysToRemove = ["user_id", "hospital_id", "patient_id", "doctor_id"];
  keysToRemove.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value && !isNaN(Number(value))) {
      localStorage.removeItem(key);
    }
  });

  // Rename hospital_code to subdomain
  const hospitalCode = localStorage.getItem("hospital_code");
  if (hospitalCode) {
    localStorage.setItem("subdomain", hospitalCode);
    localStorage.removeItem("hospital_code");
  }
}
```

---

## Common Patterns to Fix

### Pattern 1: ID Comparisons

```typescript
// ❌ OLD
if (appointment.patient_id === patientId) {
}

// ✅ NEW
if (appointment.patient_id === patientId) {
  // Both are UUIDs now
  // Validate UUID first
  if (!isValidUUID(patientId)) {
    throw new Error("Invalid patient ID format");
  }
}
```

### Pattern 2: API Calls with IDs

```typescript
// ❌ OLD
const response = await fetch(`/api/patients/${patientId}`);

// ✅ NEW
if (!isValidUUID(patientId)) {
  throw new Error("Invalid patient ID");
}
const response = await fetch(`/api/v1/patients/${patientId}`);
```

### Pattern 3: Status Checks

```typescript
// ❌ OLD
if (user.is_active && user.is_verified) {
}

// ✅ NEW
if (user.status === "active" && user.verification_status === "approved") {
}
```

### Pattern 4: Hospital/Tenant Context

```typescript
// ❌ OLD
headers: {
  'X-Hospital-Id': hospitalId,  // number
  'X-Hospital-Code': hospitalCode
}

// ✅ NEW
headers: {
  'X-Tenant-Id': tenantId,  // UUID
  'X-Subdomain': subdomain
}
```

---

## Testing Strategy

### 1. Unit Tests

- UUID validation functions
- Type conversions
- Data mappers

### 2. Integration Tests

- Authentication flow
- Patient registration
- Doctor onboarding
- Appointment booking
- Admin operations

### 3. E2E Tests

- Complete user journeys
- Cross-tenant isolation
- UUID handling

---

## Rollout Plan

### Phase 1: Core Updates (Week 1)

1. Update type definitions
2. Create UUID utilities
3. Update API service
4. Update AuthContext

### Phase 2: Feature Updates (Week 2)

5. Update patient features
6. Update doctor features
7. Update appointment system
8. Update admin panel

### Phase 3: Testing (Week 3)

9. Unit testing
10. Integration testing
11. Bug fixes
12. Performance optimization

### Phase 4: Deployment (Week 4)

13. Staging deployment
14. UAT testing
15. Production deployment
16. Monitoring

---

## Risk Mitigation

### High Risk Areas

1. **Authentication** - JWT token changes could break login
2. **Data Loss** - UUID migration could lose user sessions
3. **Performance** - UUID string comparisons vs integer

### Mitigation Strategies

1. **Gradual Rollout** - Deploy to staging first
2. **Backward Compatibility** - Support both ID formats temporarily
3. **Data Migration** - Clear localStorage on first load
4. **Monitoring** - Track errors closely after deployment

---

## Next Steps

1. **Read this guide completely**
2. **Review backend changes** (BACKEND_MIGRATION_FINAL_SUMMARY.md)
3. **Start with Phase 1** (Core type definitions)
4. **Test incrementally** after each change
5. **Document issues** encountered

---

**Estimated Total Time:** 2-3 weeks  
**Lines of Code to Change:** ~5,000-8,000  
**Files to Update:** ~100+  
**Priority:** CRITICAL (Backend ready, frontend blocking)

---

_Migration Guide Version: 1.0_  
_Last Updated: October 29, 2025_
