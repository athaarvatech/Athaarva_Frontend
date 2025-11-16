# Frontend Migration Progress - UUID Backend Integration

**Last Updated:** $(date)
**Status:** IN PROGRESS - Phase 1 Core Type Definitions
**Overall Progress:** 15%

---

## Migration Overview

This document tracks the migration of the entire Athaarva frontend from integer-based IDs to UUID-based architecture to match the new backend.

### Key Changes Required

1. **ID Types:** All `number` IDs → `string` UUIDs
2. **Field Renames:**
   - `hospital_id` → `tenant_id`
   - `hospital_code` → `subdomain`
   - `is_active` → `status` (ENUM)
   - `is_verified` → `verification_status` (ENUM)
3. **JWT Structure:** Complete restructure of token payload
4. **API Calls:** All endpoints need UUID parameters
5. **State Management:** All contexts need UUID support
6. **localStorage/Cookies:** Field name updates

---

## Phase 1: Core Type Definitions ✅ COMPLETED (100%)

### 1.1 Utility Functions ✅

**File:** `lib/utils.ts`
**Status:** COMPLETE
**Changes:**

- ✅ Added `isValidUUID()` - UUID v4 validation
- ✅ Added `areValidUUIDs()` - Multiple UUID validation
- ✅ Added `formatUUIDForDisplay()` - Shorten UUIDs for UI
- ✅ Added `generateUUID()` - Client-side UUID generation
- ✅ Added `isNumericId()` - Detect old numeric IDs
- ✅ Added `migrateLocalStorage()` - Clean up old data
- ✅ Added status type converters:
  - `UserStatus` type: 'active' | 'suspended' | 'deactivated'
  - `VerificationStatus` type: 'pending' | 'approved' | 'rejected'
  - `AppointmentStatus` type: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  - `isActiveStatus()` - Boolean check
  - `isVerified()` - Boolean check
  - `booleanToStatus()` - Convert old booleans
  - `booleanToVerification()` - Convert old booleans

### 1.2 Backend Type Definitions ✅

**File:** `types/backend-types.ts` (NEW)
**Status:** COMPLETE
**Changes:**

- ✅ Created comprehensive type definitions:
  - `Tenant` - Hospital/tenant entity
  - `Patient` - Patient entity with UUID fields
  - `Doctor` - Doctor entity with UUID fields
  - `Appointment` - Appointment with UUID relationships
  - `MedicalRecord` - Medical record with UUID fields
  - `UserEntity` - Core user authentication entity
- ✅ API Request/Response types:
  - `PatientRegistrationRequest`
  - `DoctorRegistrationRequest`
  - `LoginRequest` / `LoginResponse`
  - `JWTPayload` - Decoded token structure
  - `AppointmentCreateRequest` / `AppointmentUpdateRequest`
  - `MedicalRecordCreateRequest`
- ✅ API Response wrappers:
  - `ApiSuccessResponse<T>`
  - `ApiErrorResponse`
  - `PaginatedResponse<T>`
- ✅ Utility types:
  - `CreateType<T>` - Omit system fields
  - `UpdateType<T>` - Partial updates
  - `FilterParams` - Query parameters

### 1.3 API Service Types ✅

**File:** `lib/api-service.ts`
**Status:** COMPLETE
**Changes:**

- ✅ Updated `AuthTokens` interface:
  - `user_id?: string` (UUID, changed from number)
- ✅ Updated `User` interface:
  - `id: string` (UUID)
  - `verification_status: VerificationStatus`
  - `status: UserStatus`
  - `tenant_id: string` (UUID)
  - `subdomain?: string`
- ✅ Updated `UserProfile` interface:
  - `id: string` (UUID)
  - `status: UserStatus`
  - `verification_status: VerificationStatus`
  - `tenant_id: string` (UUID)
  - `subdomain?: string`
  - Backward compatibility fields
- ✅ Updated `DoctorProfile` interface:
  - `id: string` (UUID)
  - `tenant_id: string` (UUID)
  - `status: UserStatus`
  - `verification_status: VerificationStatus`
- ✅ Updated `PatientProfile` interface:
  - `id: string` (UUID)
  - `tenant_id: string` (UUID)
  - `status: UserStatus`
- ✅ Updated `MedicalHistory` interface:
  - `id: string` (UUID)
  - `patient_id: string` (UUID)

### 1.4 Admin API Types ✅

**File:** `lib/admin-api.ts`
**Status:** COMPLETE
**Changes:**

- ✅ Updated `RecentActivity` interface:
  - `id: string` (UUID)
- ✅ Updated `PendingAction` interface:
  - `id: string` (UUID)
- ✅ Updated `Doctor` interface:
  - `doctor_id: string` (UUID)
  - `verification_status: VerificationStatus`
  - `status: UserStatus`
  - `tenant_id: string` (UUID)
  - Backward compatibility fields
- ✅ Updated `Staff` interface:
  - `user_id: string` (UUID)
  - `verification_status: VerificationStatus`
  - `status: UserStatus`
  - `tenant_id: string` (UUID)
  - Backward compatibility fields

### 1.5 Auth Context ✅

**File:** `contexts/AuthContext.tsx`
**Status:** COMPLETE
**Changes:**

- ✅ Updated `User` interface:
  - `id: string` (UUID)
  - `verification_status: VerificationStatus`
  - `status: UserStatus`
  - `tenant_id: string` (UUID)
  - `subdomain?: string`
  - Backward compatibility fields
- ✅ Updated `login()` function:
  - Parameter: `userId: string` (UUID)
  - Added UUID validation
  - Updated localStorage handling
- ✅ Updated `checkAuth()` function:
  - Added `migrateLocalStorage()` call
  - UUID validation for user data
  - Map new fields (verification_status, status)
  - Set backward compatibility fields
  - Store tenant_id and subdomain
- ✅ Updated `logout()` function:
  - Clear tenant_id and subdomain from localStorage

---

## Phase 2: API Integration ⏳ IN PROGRESS (0%)

### 2.1 API Service Methods ❌ NOT STARTED

**File:** `lib/api-service.ts`
**Required Changes:**

- ❌ Update all method signatures to accept UUID strings
- ❌ Add UUID validation to all API calls
- ❌ Update request/response mappers
- ❌ Add tenant context headers
- ❌ Methods to update:
  - `getCurrentUser()` - Return UUID user
  - `login()` - Handle UUID response
  - `register()` - Handle UUID response
  - `getPatientProfile()` - UUID parameter
  - `getDoctorProfile()` - UUID parameter
  - `updateProfile()` - UUID parameter
  - All other methods with ID parameters

### 2.2 Admin API Methods ❌ NOT STARTED

**File:** `lib/admin-api.ts`
**Required Changes:**

- ❌ Update `getDashboardStats()` - Handle UUID data
- ❌ Update `getRecentActivities()` - Handle UUID data
- ❌ Update `getPendingActions()` - Handle UUID data
- ❌ Update `getDoctors()` - Handle UUID data
- ❌ Update `getStaff()` - Handle UUID data
- ❌ Update `approveDoctor()` - UUID parameter
- ❌ Update `deactivateUser()` - UUID parameter
- ❌ Update `activateUser()` - UUID parameter

### 2.3 Appointment API ❌ NOT STARTED

**File:** `lib/appointment-api.ts` (if exists)
**Required Changes:**

- ❌ Update all appointment methods for UUID
- ❌ UUID validation for patient_id, doctor_id
- ❌ Status ENUM handling
- ❌ Tenant context headers

### 2.4 Medical Records API ❌ NOT STARTED

**File:** `lib/medical-records-api.ts` (if exists)
**Required Changes:**

- ❌ Update all medical record methods for UUID
- ❌ UUID validation for patient_id, doctor_id
- ❌ Tenant context headers

---

## Phase 3: Context Updates ⏳ NEXT (0%)

### 3.1 Appointment Context ❌

**File:** `contexts/AppointmentContext.tsx`
**Required Changes:**

- ❌ Update state interfaces for UUID
- ❌ Update all appointment methods
- ❌ UUID validation
- ❌ Status ENUM handling

### 3.2 Medical Records Context ❌

**File:** `contexts/MedicalRecordsContext.tsx`
**Required Changes:**

- ❌ Update state interfaces for UUID
- ❌ Update all record methods
- ❌ UUID validation

### 3.3 Hospital Onboarding Context ❌

**File:** `contexts/HospitalOnboardingContext.tsx`
**Required Changes:**

- ❌ Update tenant/hospital interfaces
- ❌ Rename hospital_id → tenant_id
- ❌ Rename hospital_code → subdomain
- ❌ UUID validation

### 3.4 Other Contexts ❌

**Files:** All other context files
**Required Changes:**

- ❌ Scan and update any ID references
- ❌ Update localStorage usage
- ❌ UUID validation

---

## Phase 4: Component Updates ⏳ PENDING (0%)

### 4.1 Patient Components ❌

**Estimated Files:** ~20
**Required Changes:**

- ❌ Patient dashboard
- ❌ Patient registration forms
- ❌ Patient profile pages
- ❌ Appointment booking
- ❌ Medical records view
- ❌ Update all ID displays
- ❌ Update all API calls
- ❌ UUID validation in forms

### 4.2 Doctor Components ❌

**Estimated Files:** ~15
**Required Changes:**

- ❌ Doctor dashboard
- ❌ Doctor registration forms
- ❌ Doctor profile pages
- ❌ Patient management
- ❌ Appointment management
- ❌ Update all ID displays
- ❌ Update all API calls
- ❌ UUID validation in forms

### 4.3 Admin Components ❌

**Estimated Files:** ~10
**Required Changes:**

- ❌ Admin dashboard
- ❌ User management pages
- ❌ Doctor approval pages
- ❌ Staff management
- ❌ Analytics pages
- ❌ Update all ID displays
- ❌ Update all API calls
- ❌ Status ENUM displays

### 4.4 Onboarding Components ❌

**Estimated Files:** ~15
**Required Changes:**

- ❌ Hospital onboarding flow
- ❌ Patient onboarding
- ❌ Doctor onboarding
- ❌ Tenant/subdomain handling
- ❌ UUID validation

### 4.5 Shared Components ❌

**Estimated Files:** ~20
**Required Changes:**

- ❌ Navigation components
- ❌ User profile displays
- ❌ ID formatters
- ❌ Status badges
- ❌ Search/filter components
- ❌ Data tables

---

## Phase 5: Storage & Authentication ⏳ PENDING (0%)

### 5.1 localStorage Migration ❌

**Required Changes:**

- ❌ Migrate all existing user data
- ❌ Rename fields:
  - `hospital_id` → `tenant_id`
  - `hospital_code` → `subdomain`
- ❌ Add migration script to run on app load
- ❌ Clear old numeric IDs

### 5.2 Cookie/Session Management ❌

**Required Changes:**

- ❌ Update JWT parsing
- ❌ Handle new token structure
- ❌ Validate UUIDs in tokens
- ❌ Store tenant context

### 5.3 Route Guards ❌

**Files:** `middleware.ts`, route guards
**Required Changes:**

- ❌ Update JWT validation
- ❌ UUID validation in routes
- ❌ Tenant context validation
- ❌ Status checking (ENUM instead of boolean)

---

## Phase 6: Testing ⏳ PENDING (0%)

### 6.1 Authentication Flow ❌

- ❌ Test patient login with UUID
- ❌ Test doctor login with UUID
- ❌ Test admin login
- ❌ Test JWT token handling
- ❌ Test session persistence

### 6.2 Registration Flow ❌

- ❌ Test patient registration
- ❌ Test doctor registration
- ❌ Test hospital onboarding
- ❌ Test UUID generation
- ❌ Test tenant assignment

### 6.3 Appointment System ❌

- ❌ Test appointment booking
- ❌ Test appointment updates
- ❌ Test appointment cancellation
- ❌ Test appointment status changes
- ❌ Test UUID relationships

### 6.4 Admin Functions ❌

- ❌ Test doctor approval
- ❌ Test user management
- ❌ Test status updates
- ❌ Test analytics
- ❌ Test UUID filtering

### 6.5 Edge Cases ❌

- ❌ Test invalid UUIDs
- ❌ Test migration from old data
- ❌ Test backward compatibility
- ❌ Test tenant isolation
- ❌ Test error handling

---

## Critical Issues & Blockers

### Current Blockers

None - Phase 1 complete, ready for Phase 2

### Potential Risks

1. **Breaking Changes:** All existing sessions will be invalidated
2. **Data Migration:** Need to migrate localStorage on first load
3. **API Compatibility:** Backend must be fully deployed before frontend
4. **Testing Coverage:** Need extensive testing of UUID validation
5. **Performance:** UUID string comparisons vs integer comparisons

### Mitigation Strategies

1. **Staged Rollout:** Deploy backend first, then frontend
2. **Migration Script:** Auto-migrate localStorage on app load
3. **Backward Compatibility:** Keep deprecated fields during transition
4. **Validation:** Comprehensive UUID validation everywhere
5. **Error Handling:** Graceful degradation for invalid data

---

## Progress Summary

| Phase     | Description           | Files          | Progress | Status          |
| --------- | --------------------- | -------------- | -------- | --------------- |
| 1         | Core Type Definitions | 5              | 100%     | ✅ COMPLETE     |
| 2         | API Integration       | ~10            | 0%       | ⏳ IN PROGRESS  |
| 3         | Context Updates       | ~8             | 0%       | ⏳ NEXT         |
| 4         | Component Updates     | ~80            | 0%       | ⏳ PENDING      |
| 5         | Storage & Auth        | ~5             | 0%       | ⏳ PENDING      |
| 6         | Testing               | N/A            | 0%       | ⏳ PENDING      |
| **TOTAL** |                       | **~108 files** | **15%**  | **IN PROGRESS** |

---

## Next Steps

### Immediate (Phase 2)

1. ✅ Update `lib/api-service.ts` method signatures
2. ✅ Add UUID validation to all API calls
3. ✅ Update request/response mappers
4. ✅ Add tenant context headers
5. ✅ Test API integration

### Short Term (Phase 3)

1. Update `AppointmentContext.tsx`
2. Update `MedicalRecordsContext.tsx`
3. Update `HospitalOnboardingContext.tsx`
4. Test context state management

### Medium Term (Phase 4)

1. Update patient components (~20 files)
2. Update doctor components (~15 files)
3. Update admin components (~10 files)
4. Update onboarding components (~15 files)
5. Update shared components (~20 files)

### Long Term (Phases 5-6)

1. Implement localStorage migration script
2. Update JWT/session handling
3. Update route guards
4. Comprehensive testing
5. Deploy to staging
6. Production rollout

---

## Resources

- **Migration Guide:** `FRONTEND_MIGRATION_GUIDE.md`
- **Backend Types:** `types/backend-types.ts`
- **Utilities:** `lib/utils.ts`
- **Backend Schema:** `Athaarva_Backend/database_schema.sql`
- **Backend Docs:** `Athaarva_Backend/TESTING_MIGRATION_GUIDE.md`

---

## Change Log

### 2025-01-XX - Phase 1 Complete

- ✅ Created `lib/utils.ts` with UUID utilities
- ✅ Created `types/backend-types.ts` with comprehensive types
- ✅ Updated `lib/api-service.ts` interfaces
- ✅ Updated `lib/admin-api.ts` interfaces
- ✅ Updated `contexts/AuthContext.tsx` for UUID support
- ✅ All Phase 1 files compiling without errors
- ✅ Backward compatibility maintained

---

**End of Progress Report**
