# Phase 2: Frontend-Backend Integration Testing Guide

**Date:** October 29, 2025  
**Purpose:** Comprehensive testing guide for UUID-based multi-tenant architecture  
**Status:** Ready for Testing

---

## 🎯 Testing Overview

This guide will help you verify that your frontend is properly integrated with the UUID-based backend.

### What We're Testing

1. ✅ UUID ID types throughout the application
2. ✅ Field name alignment (tenant_id vs hospital_id)
3. ✅ ENUM status fields (not booleans)
4. ✅ API integration with UUID parameters
5. ✅ localStorage migration
6. ✅ Multi-tenant isolation

---

## 🚀 Quick Start Testing

### Prerequisites

```bash
# Backend should be running on http://localhost:8000
cd Athaarva_Backend
python run_server.py

# Frontend should be running on http://localhost:3000
cd Athaarva_Frontend
npm run dev
```

### Initial Setup Check

1. Open browser DevTools (F12)
2. Navigate to http://localhost:3000
3. Check Console - should see:

   ```
   ✅ localStorage migration complete - old numeric IDs removed, field names updated
   ```

4. Check Application > Local Storage:
   - ❌ Should NOT have: `hospital_id`, `hospital_code` with numeric values
   - ✅ Should have (if logged in): `tenant_id`, `subdomain` with UUIDs

---

## 📋 Test Cases

### Test Suite 1: localStorage Migration (AUTO)

**Test 1.1: Old Data Cleanup**

```javascript
// In browser console, BEFORE loading app:
localStorage.setItem("user_id", "123");
localStorage.setItem("hospital_id", "456");
localStorage.setItem("hospital_code", "test-hospital");

// Refresh page, then check:
localStorage.getItem("user_id"); // Should be null (numeric ID removed)
localStorage.getItem("hospital_id"); // Should be null
localStorage.getItem("subdomain"); // Should be 'test-hospital' (renamed)
```

**Expected Result:** ✅ All old numeric IDs removed, field names updated

---

### Test Suite 2: Patient Registration & Onboarding

**Test 2.1: Patient Registration**

**Steps:**

1. Navigate to `/auth/register` or `/auth/hospital/{subdomain}`
2. Fill in registration form:
   - Email: `test-patient@example.com`
   - Password: `Test123!`
   - Full Name: `Test Patient`
3. Submit form

**Check Network Tab:**

```json
// POST /auth/register or /patients/register
{
  "email": "test-patient@example.com",
  "password": "Test123!",
  "full_name": "Test Patient",
  "subdomain": "your-hospital-subdomain", // ✅ Not hospital_code
  "tenant_id": "uuid-here" // ✅ UUID string
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000", // ✅ UUID
    "email": "test-patient@example.com",
    "user_type": "patient",
    "tenant_id": "660e8400-e29b-41d4-a716-446655440001", // ✅ UUID
    "status": "active", // ✅ ENUM not boolean
    "verification_status": "pending" // ✅ ENUM not boolean
  }
}
```

**Expected Result:** ✅ Registration succeeds with UUID IDs

---

**Test 2.2: Patient Onboarding**

**Steps:**

1. After registration, should redirect to `/onboarding/patient`
2. Check page header shows tenant name (not "undefined")
3. Fill in onboarding steps:
   - Basic Information
   - Medical History
   - Insurance (optional)
4. Submit final step

**Check Network Tab:**

```json
// POST /patients/onboarding
{
  "subdomain": "your-hospital-subdomain", // ✅ Not hospital_code
  "tenant_id": "660e8400-...", // ✅ UUID
  "basic_info": {
    "first_name": "Test",
    "last_name": "Patient"
    // ...
  },
  "medical_history": {
    // ...
  }
}
```

**Check Browser:**

- Header shows: "Registering at {Tenant Name}" ✅
- Back button works ✅
- No console errors ✅

**Expected Result:** ✅ Onboarding completes, redirects to login

---

### Test Suite 3: Doctor Dashboard

**Test 3.1: Doctor Login & Dashboard Load**

**Steps:**

1. Login as a doctor
2. Should redirect to `/doctor/dashboard`
3. Check calendar widget loads

**Check localStorage:**

```javascript
localStorage.getItem("user_id"); // UUID string ✅
localStorage.getItem("tenant_id"); // UUID string ✅
localStorage.getItem("user_type"); // 'doctor' ✅
```

**Check Network Tab:**

```
GET /appointments/doctor/{doctorId}
// doctorId should be UUID (36 chars with dashes)
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002", // ✅ UUID
      "patient_id": "880e8400-e29b-41d4-a716-446655440003", // ✅ UUID
      "doctor_id": "990e8400-e29b-41d4-a716-446655440004", // ✅ UUID
      "tenant_id": "660e8400-e29b-41d4-a716-446655440001", // ✅ UUID
      "appointment_date": "2025-10-30",
      "appointment_time": "10:00",
      "status": "scheduled", // ✅ ENUM
      "duration_minutes": 30
    }
  ]
}
```

**Check UI:**

- Calendar widget displays appointments ✅
- No TypeScript errors in console ✅
- Today's Schedule shows appointments ✅

**Expected Result:** ✅ Dashboard loads with appointments

---

**Test 3.2: Patient Overview Widget**

**Steps:**

1. On doctor dashboard, check "Patients Overview" widget
2. Should display list of patients

**Check Network Tab:**

```
GET /appointments/doctor/{doctorId}
// Used to extract unique patients
```

**Check Console:**

- No errors about `parseInt` or number conversion ✅
- No "undefined" patient names ✅

**Expected Result:** ✅ Patient list displays correctly

---

### Test Suite 4: Patient Appointments

**Test 4.1: View Appointments**

**Steps:**

1. Login as patient
2. Navigate to `/patient/appointments`
3. Should see appointment list

**Check Context:**

```javascript
// In React DevTools > Components > AppointmentContext
appointments: [
  {
    id: "string", // ✅ UUID not number
    patient_id: "string", // ✅ UUID
    doctor_id: "string", // ✅ UUID
    tenant_id: "string", // ✅ UUID
  },
];
```

**Expected Result:** ✅ Appointments display with UUID IDs

---

**Test 4.2: Book Appointment**

**Steps:**

1. Click "Schedule New Appointment"
2. Select doctor
3. Select date and time
4. Fill in reason
5. Submit

**Check Network Tab:**

```json
// POST /appointments/create
{
  "patient_id": "880e8400-e29b-41d4-a716-446655440003", // ✅ UUID
  "doctor_id": "990e8400-e29b-41d4-a716-446655440004", // ✅ UUID
  "tenant_id": "660e8400-e29b-41d4-a716-446655440001", // ✅ UUID
  "appointment_date": "2025-10-31",
  "appointment_time": "14:00",
  "duration_minutes": 30,
  "reason": "Regular checkup",
  "notes": "First visit"
}
```

**Expected Result:** ✅ Appointment created with UUID IDs

---

**Test 4.3: View Appointment Details**

**Steps:**

1. Click on an appointment
2. Should navigate to `/patient/appointments/details/{id}`
3. {id} should be a UUID

**Check URL:**

```
http://localhost:3000/patient/appointments/details/770e8400-e29b-41d4-a716-446655440002
                                                    ^^^^^^ UUID format ✅
```

**Check Network Tab:**

```
GET /appointments/770e8400-e29b-41d4-a716-446655440002
// UUID parameter ✅
```

**Expected Result:** ✅ Appointment details load

---

**Test 4.4: Cancel Appointment**

**Steps:**

1. In appointment details, click "Cancel"
2. Confirm cancellation

**Check Network Tab:**

```json
// PUT /appointments/{id}
// OR DELETE /appointments/{id}
{
  "status": "cancelled" // ✅ ENUM not boolean
}
```

**Check Context:**

```javascript
// AppointmentContext should update
appointment.status === "cancelled"; // ✅ ENUM value
```

**Expected Result:** ✅ Appointment status updated to cancelled

---

### Test Suite 5: Admin Operations

**Test 5.1: View Doctors List**

**Steps:**

1. Login as admin
2. Navigate to `/admin/doctors`

**Check Network Tab:**

```
GET /admin/doctors
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004", // ✅ UUID
      "user_id": "aa0e8400-e29b-41d4-a716-446655440005", // ✅ UUID
      "tenant_id": "660e8400-e29b-41d4-a716-446655440001", // ✅ UUID
      "full_name": "Dr. John Doe",
      "specialization": "Cardiology",
      "status": "active", // ✅ ENUM
      "verification_status": "approved" // ✅ ENUM
    }
  ]
}
```

**Expected Result:** ✅ Doctors list loads with UUID IDs

---

**Test 5.2: Update Doctor Status**

**Steps:**

1. Click on a doctor
2. Change status (e.g., suspend, verify)
3. Save changes

**Check Network Tab:**

```json
// PUT /admin/doctors/{doctorId}/status
{
  "status": "suspended", // ✅ ENUM not is_active: false
  "verification_status": "approved" // ✅ ENUM not is_verified: true
}
```

**Expected Result:** ✅ Doctor status updated

---

### Test Suite 6: Multi-Tenant Isolation

**Test 6.1: Cross-Tenant Data Access**

**Setup:**

1. Create two test tenants (hospitals)
2. Create a patient in each tenant
3. Create a doctor in each tenant

**Test:**

1. Login as doctor from Tenant A
2. Try to access patient from Tenant B

**Expected Result:** ❌ Should NOT see Tenant B's data

**Check Network Response:**

```json
{
  "success": false,
  "error": "Forbidden",
  "detail": "Cannot access resource from different tenant"
}
```

---

**Test 6.2: Tenant Context Validation**

**Steps:**

1. Login with user from Tenant A
2. Check JWT payload

**JWT Payload:**

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "user_type": "patient",
  "tenant_id": "tenant-a-uuid", // ✅ Tenant A
  "subdomain": "tenant-a",
  "exp": 1234567890
}
```

**All API calls should include:**

```
Authorization: Bearer {token}
// Backend extracts tenant_id from JWT ✅
```

**Expected Result:** ✅ All API responses contain only Tenant A data

---

## 🔍 Common Issues & Solutions

### Issue 1: "Cannot read property 'split' of undefined"

**Cause:** Appointment time is null/undefined  
**Solution:** ✅ Already fixed with `(appointment.time || '00:00').split(':')`

### Issue 2: "Invalid UUID format"

**Cause:** Passing numeric ID to UUID endpoint  
**Solution:** Check localStorage migration ran, validate UUIDs before API calls

### Issue 3: "Field 'hospital_id' does not exist"

**Cause:** Frontend using old field name  
**Solution:** ✅ Already fixed - using `tenant_id` everywhere

### Issue 4: "Expected string, got number"

**Cause:** ID type mismatch  
**Solution:** ✅ Already fixed - all IDs typed as `string`

### Issue 5: localStorage still has numeric IDs

**Cause:** Migration didn't run or browser cached old data  
**Solution:**

```javascript
// Manual cleanup:
localStorage.clear();
sessionStorage.clear();
// Refresh page
```

---

## ✅ Success Checklist

### Frontend Verification

- [ ] No TypeScript errors in build
- [ ] No console errors on page load
- [ ] localStorage migration log appears
- [ ] All IDs in localStorage are UUIDs
- [ ] Field names: tenant_id, subdomain (not hospital_id, hospital_code)

### API Integration

- [ ] All API requests use UUID parameters
- [ ] All API responses contain UUID fields
- [ ] No 400/422 errors from type mismatches
- [ ] JWT contains UUID user_id and tenant_id
- [ ] ENUM statuses used (not booleans)

### User Flows

- [ ] Patient registration → onboarding → dashboard
- [ ] Doctor registration → onboarding → dashboard
- [ ] Patient book appointment → view details → cancel
- [ ] Doctor view appointments → view patient details
- [ ] Admin manage doctors → update status

### Data Integrity

- [ ] Multi-tenant isolation working
- [ ] Cannot access other tenant's data
- [ ] All database queries use UUID
- [ ] Foreign key relationships maintained

---

## 📊 Testing Results Template

```markdown
## Testing Session: {Date}

**Tester:** {Name}
**Environment:** {Dev/Staging/Prod}

### Test Results

| Test Suite             | Test Case            | Status  | Notes                    |
| ---------------------- | -------------------- | ------- | ------------------------ |
| localStorage Migration | Old Data Cleanup     | ✅ Pass | Migration log appeared   |
| Patient Registration   | Submit Form          | ✅ Pass | UUID returned            |
| Patient Onboarding     | Complete Steps       | ✅ Pass | Redirected to login      |
| Doctor Dashboard       | Load Calendar        | ✅ Pass | Appointments displayed   |
| Patient Appointments   | Book Appointment     | ✅ Pass | UUID appointment created |
| Admin Operations       | Update Doctor Status | ✅ Pass | ENUM status used         |
| Multi-Tenant           | Cross-Tenant Access  | ✅ Pass | Access denied correctly  |

### Issues Found

1. {Description} - {Severity} - {Status}

### Overall Status

- ✅ All critical tests passing
- 🔄 Minor issues being fixed
- ❌ Blocking issues found

### Next Steps

1. {Action item}
2. {Action item}
```

---

## 🚀 Performance Testing

### Load Testing

```bash
# Test appointment creation with 100 concurrent users
ab -n 1000 -c 100 -H "Authorization: Bearer {token}" \
   -p appointment.json \
   http://localhost:8000/appointments/create
```

### Database Query Performance

```sql
-- Check UUID index usage
EXPLAIN ANALYZE
SELECT * FROM appointments
WHERE patient_id = '880e8400-e29b-41d4-a716-446655440003';

-- Should use index on patient_id ✅
```

---

## 📝 Sign-Off

**Frontend Migration:** ✅ Complete  
**Backend Integration:** ✅ Ready  
**Testing:** 🔄 In Progress

**Approved By:** ******\_\_\_******  
**Date:** ******\_\_\_******

---

**Good luck with testing! The migration is solid and ready for validation.** 🚀
