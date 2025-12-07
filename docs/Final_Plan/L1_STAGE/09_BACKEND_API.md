# 09. Backend API Specification

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** 🔄 Partial

---

## 🎯 Overview

This document specifies all backend API endpoints required for the L1 stage of the Athaarva platform.

**Base URL:** `http://localhost:8000/api/v1` (Development)  
**Production:** `https://api.athaarva.com/api/v1`

---

## 🔐 Authentication

### Headers Required

```
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_uuid>  (for tenant-scoped requests)
Content-Type: application/json
```

### JWT Token Structure

```json
{
  "sub": "user_uuid",
  "email": "user@email.com",
  "role": "doctor",
  "tenant_id": "tenant_uuid",
  "permissions": ["read:patients", "write:appointments"],
  "iat": 1701676800,
  "exp": 1701680400
}
```

---

## 📡 API Endpoints

### 1. Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | Patient registration | No |
| POST | `/auth/logout` | Logout | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| GET | `/auth/verify-email` | Verify email | No |
| POST | `/auth/refresh` | Refresh token | Yes |

#### POST `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "subdomain": "cityhospital"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2g...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Dr. Anil Sharma",
    "role": "doctor",
    "tenant_id": "550e8400-e29b-41d4-a716-446655440001",
    "tenant_name": "City Hospital",
    "avatar_url": "https://..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

#### POST `/auth/register`

**Request:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91 98765 43210",
  "date_of_birth": "1980-03-15",
  "password": "SecurePass123!",
  "subdomain": "cityhospital"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "requires_verification": true
}
```

---

### 2. Tenants (`/tenants`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tenants/public` | List public hospitals | No |
| GET | `/tenants/{subdomain}/validate` | Validate subdomain | No |
| GET | `/tenants/{subdomain}/branding` | Get branding | No |
| GET | `/tenants/{subdomain}/public` | Hospital public info | No |

#### GET `/tenants/public`

**Response:**
```json
{
  "tenants": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "City General Hospital",
      "subdomain": "cityhospital",
      "logo_url": "https://...",
      "location": "Chennai, Tamil Nadu",
      "status": "active"
    }
  ]
}
```

#### GET `/tenants/{subdomain}/branding`

**Response:**
```json
{
  "logo_url": "https://...",
  "favicon_url": "https://...",
  "primary_color": "#2563eb",
  "secondary_color": "#10b981",
  "accent_color": "#f59e0b",
  "font_family": "Inter"
}
```

---

### 3. Team Management (`/team`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/team/members` | List team members | Yes | Admin |
| GET | `/team/members/{id}` | Get member details | Yes | Admin |
| PATCH | `/team/members/{id}` | Update member | Yes | Admin |
| DELETE | `/team/members/{id}` | Remove member | Yes | Admin |
| POST | `/team/members/{id}/suspend` | Suspend member | Yes | Admin |
| POST | `/team/members/{id}/activate` | Activate member | Yes | Admin |
| POST | `/team/invitations` | Send invitation | Yes | Admin |
| POST | `/team/invitations/bulk` | Bulk invite | Yes | Admin |
| GET | `/team/invitations` | List pending | Yes | Admin |
| POST | `/team/invitations/{id}/resend` | Resend invite | Yes | Admin |
| DELETE | `/team/invitations/{id}` | Cancel invite | Yes | Admin |
| POST | `/team/invitations/validate` | Validate token | No | - |
| POST | `/team/staff/onboarding` | Staff onboarding | No | - |
| POST | `/team/doctor/onboarding` | Doctor onboarding | No | - |
| GET | `/team/stats` | Team statistics | Yes | Admin |

#### POST `/team/invitations`

**Request:**
```json
{
  "email": "doctor@example.com",
  "name": "Dr. New Doctor",
  "role": "doctor",
  "department": "Cardiology",
  "message": "Welcome to our team!"
}
```

**Response:**
```json
{
  "success": true,
  "invitation": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "email": "doctor@example.com",
    "role": "doctor",
    "status": "pending",
    "expires_at": "2025-12-11T00:00:00Z"
  }
}
```

---

### 4. Doctors (`/doctors`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/doctors` | List doctors | Yes | Any |
| GET | `/doctors/public` | Public doctor list | No | - |
| GET | `/doctors/{id}` | Doctor details | Yes | Any |
| GET | `/doctors/{id}/public` | Public doctor profile | No | - |
| GET | `/doctors/{id}/schedule` | Doctor schedule | Yes | Any |
| GET | `/doctors/{id}/availability` | Available slots | Yes | Any |
| PATCH | `/doctors/{id}` | Update doctor | Yes | Admin/Self |

#### GET `/doctors/public`

**Query Params:**
- `specialty` - Filter by specialty
- `search` - Search by name
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "doctors": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "name": "Dr. Anil Sharma",
      "photo_url": "https://...",
      "specialty": "Cardiology",
      "experience_years": 15,
      "rating": 4.8,
      "review_count": 124,
      "languages": ["English", "Hindi", "Tamil"],
      "consultation_fee": 800,
      "available_for_booking": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

---

### 5. Patients (`/patients`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/patients` | List patients | Yes | Admin/Doctor |
| GET | `/patients/{id}` | Patient details | Yes | Admin/Doctor/Self |
| GET | `/patients/{id}/history` | Medical history | Yes | Doctor/Self |
| GET | `/patients/{id}/appointments` | Patient appointments | Yes | Admin/Doctor/Self |
| PATCH | `/patients/{id}` | Update patient | Yes | Admin/Self |

#### GET `/patients/{id}`

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440030",
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91 98765 43210",
  "date_of_birth": "1980-03-15",
  "gender": "male",
  "blood_group": "O+",
  "address": {
    "street": "123 Main Street",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "postal_code": "600001"
  },
  "emergency_contact": {
    "name": "Priya Kumar",
    "relationship": "Wife",
    "phone": "+91 98765 12345"
  },
  "health_profile": {
    "allergies": ["Penicillin", "Peanuts"],
    "conditions": ["Hypertension", "Type 2 Diabetes"],
    "medications": ["Metformin 500mg", "Amlodipine 5mg"]
  },
  "insurance": {
    "provider": "Star Health",
    "policy_number": "POL123456",
    "valid_till": "2026-03-31"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "status": "active"
}
```

---

### 6. Appointments (`/appointments`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/appointments` | List appointments | Yes | Any |
| GET | `/appointments/{id}` | Appointment details | Yes | Any |
| POST | `/appointments` | Create appointment | Yes | Any |
| PATCH | `/appointments/{id}` | Update appointment | Yes | Any |
| DELETE | `/appointments/{id}` | Cancel appointment | Yes | Any |
| POST | `/appointments/{id}/checkin` | Check in patient | Yes | Staff |
| POST | `/appointments/{id}/start` | Start consultation | Yes | Doctor |
| POST | `/appointments/{id}/complete` | Complete appointment | Yes | Doctor |

#### POST `/appointments`

**Request:**
```json
{
  "doctor_id": "550e8400-e29b-41d4-a716-446655440020",
  "patient_id": "550e8400-e29b-41d4-a716-446655440030",
  "date": "2025-12-15",
  "time": "10:30",
  "duration": 30,
  "type": "video",
  "reason": "Follow-up for blood pressure"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440040",
  "doctor": {
    "id": "...",
    "name": "Dr. Anil Sharma",
    "specialty": "Cardiology"
  },
  "patient": {
    "id": "...",
    "name": "Rajesh Kumar"
  },
  "date": "2025-12-15",
  "time": "10:30",
  "duration": 30,
  "type": "video",
  "status": "scheduled",
  "reason": "Follow-up for blood pressure",
  "created_at": "2025-12-04T10:00:00Z"
}
```

#### GET `/appointments`

**Query Params:**
- `doctor_id` - Filter by doctor
- `patient_id` - Filter by patient
- `status` - Filter by status (scheduled, completed, cancelled)
- `date_from` - Start date
- `date_to` - End date
- `type` - in-person, video

---

### 7. Consultations (`/consultations`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/consultations` | List consultations | Yes | Doctor |
| GET | `/consultations/{id}` | Consultation details | Yes | Doctor/Patient |
| POST | `/consultations` | Create consultation | Yes | Doctor |
| PATCH | `/consultations/{id}` | Update consultation | Yes | Doctor |

#### POST `/consultations`

**Request:**
```json
{
  "appointment_id": "550e8400-e29b-41d4-a716-446655440040",
  "chief_complaint": "Chest pain since yesterday",
  "history": "Patient reports intermittent chest pain...",
  "examination": "BP: 140/90, HR: 82, SpO2: 98%",
  "assessment": "Stable angina, well controlled",
  "plan": "Continue current medications, lifestyle modifications",
  "vitals": {
    "blood_pressure": "140/90",
    "heart_rate": 82,
    "temperature": 98.6,
    "spo2": 98,
    "weight": 78
  }
}
```

---

### 8. Prescriptions (`/prescriptions`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/prescriptions` | List prescriptions | Yes | Doctor/Patient |
| GET | `/prescriptions/{id}` | Prescription details | Yes | Doctor/Patient |
| POST | `/prescriptions` | Create prescription | Yes | Doctor |
| GET | `/prescriptions/{id}/pdf` | Download PDF | Yes | Doctor/Patient |

#### POST `/prescriptions`

**Request:**
```json
{
  "appointment_id": "550e8400-e29b-41d4-a716-446655440040",
  "patient_id": "550e8400-e29b-41d4-a716-446655440030",
  "diagnosis": "Hyperlipidemia",
  "medications": [
    {
      "name": "Atorvastatin",
      "dosage": "10mg",
      "frequency": "Once daily at night",
      "duration": "30 days",
      "instructions": "Take after dinner"
    },
    {
      "name": "Aspirin",
      "dosage": "75mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take in the morning after food"
    }
  ],
  "additional_instructions": "Avoid fatty foods, exercise daily"
}
```

---

### 9. Billing (`/billing`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/billing/invoices` | List invoices | Yes | Admin/Patient |
| GET | `/billing/invoices/{id}` | Invoice details | Yes | Admin/Patient |
| POST | `/billing/invoices` | Create invoice | Yes | Admin/Staff |
| POST | `/billing/invoices/{id}/pay` | Record payment | Yes | Admin/Staff |
| GET | `/billing/invoices/{id}/pdf` | Download PDF | Yes | Any |

---

### 10. Hospital Onboarding (`/onboarding/hospital`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/onboarding/hospital/validate-token` | Validate invite | No |
| GET | `/onboarding/hospital/session` | Get session | No |
| POST | `/onboarding/hospital/session` | Create session | No |
| PATCH | `/onboarding/hospital/session` | Update session | No |
| POST | `/onboarding/hospital/submit` | Submit form | No |
| GET | `/onboarding/hospital/subdomain/check` | Check availability | No |

---

### 11. Super Admin (`/super-admin`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/super-admin/dashboard` | Dashboard stats | Yes | SuperAdmin |
| GET | `/super-admin/tenants` | List tenants | Yes | SuperAdmin |
| GET | `/super-admin/tenants/{id}` | Tenant details | Yes | SuperAdmin |
| PATCH | `/super-admin/tenants/{id}` | Update tenant | Yes | SuperAdmin |
| POST | `/super-admin/tenants/{id}/activate` | Activate tenant | Yes | SuperAdmin |
| POST | `/super-admin/tenants/{id}/suspend` | Suspend tenant | Yes | SuperAdmin |
| DELETE | `/super-admin/tenants/{id}` | Delete tenant | Yes | SuperAdmin |
| GET | `/super-admin/invitations` | List invitations | Yes | SuperAdmin |
| POST | `/super-admin/invitations` | Send invitation | Yes | SuperAdmin |
| DELETE | `/super-admin/invitations/{id}` | Cancel invitation | Yes | SuperAdmin |

---

## 📊 Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### Pagination

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 🚨 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `UNAUTHORIZED` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input |
| `DUPLICATE_ENTRY` | 409 | Already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 🔗 Related Documentation

- [02_AUTHENTICATION.md](./02_AUTHENTICATION.md) - Auth flows
- [10_DATABASE_SCHEMA.md](./10_DATABASE_SCHEMA.md) - Database design
- [11_IMPLEMENTATION_STATUS.md](./11_IMPLEMENTATION_STATUS.md) - Current status
