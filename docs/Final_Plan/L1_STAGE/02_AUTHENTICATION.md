# 02. Authentication System

> **Stage:** L1 (Core)  
> **Priority:** HIGH  
> **Status:** Partial

---

## 🎯 Overview

The authentication system handles:
1. User login across all roles
2. Patient self-registration (patients only)
3. Email verification
4. Password reset
5. Role-based redirects
6. Multi-tenant session management

---

## 🔐 Authentication Principles

### Key Rules

1. **NO Role Selection in Frontend**
   - Backend determines role from email/credentials
   - Frontend redirects based on response

2. **Patient Self-Registration Only**
   - Patients can create accounts themselves
   - Staff/Doctors MUST be invited by admin

3. **Email Verification Required**
   - All new accounts must verify email
   - Verification link expires in 24 hours

4. **Tenant-Scoped Authentication**
   - Login happens at hospital subdomain
   - JWT contains `tenant_id`

---

## 🔄 Authentication Flows

### Flow 1: User Login (All Roles)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                                       │
└─────────────────────────────────────────────────────────────────────────┘

User                             Frontend                         Backend
  │                                 │                                │
  │  1. Navigate to                 │                                │
  │     hospital.athaarva.com/auth  │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │  2. Enter email & password      │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │                                 │  3. POST /api/v1/auth/login   │
  │                                 │     {                          │
  │                                 │       email: "...",            │
  │                                 │       password: "...",         │
  │                                 │       subdomain: "hospital1"   │
  │                                 │     }                          │
  │                                 │────────────────────────────────►
  │                                 │                                │
  │                                 │  4. Backend validates:         │
  │                                 │     - Email exists             │
  │                                 │     - Password correct         │
  │                                 │     - User belongs to tenant   │
  │                                 │     - Account is active        │
  │                                 │     - Email is verified        │
  │                                 │                                │
  │                                 │◄────────────────────────────────
  │                                 │  5. Response:                  │
  │                                 │     {                          │
  │                                 │       success: true,           │
  │                                 │       token: "jwt...",         │
  │                                 │       user: {                  │
  │                                 │         id: "uuid",            │
  │                                 │         email: "...",          │
  │                                 │         name: "...",           │
  │                                 │         role: "doctor",        │
  │                                 │         tenant_id: "uuid"      │
  │                                 │       }                        │
  │                                 │     }                          │
  │                                 │                                │
  │◄─────────────────────────────────                                │
  │  6. Redirect based on role:     │                                │
  │     - hospital_admin → /admin   │                                │
  │     - doctor → /doctor          │                                │
  │     - nurse → /staff            │                                │
  │     - receptionist → /staff     │                                │
  │     - patient → /patient        │                                │
  │                                 │                                │
```

### Flow 2: Patient Registration (Patients Only)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PATIENT REGISTRATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

Patient                          Frontend                         Backend
  │                                 │                                │
  │  1. Navigate to                 │                                │
  │     hospital.athaarva.com/auth  │                                │
  │     Click "Create Account"      │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │  2. Redirect to /auth/register  │                                │
  │◄─────────────────────────────────                                │
  │                                 │                                │
  │  3. Fill registration form:     │                                │
  │     - Full Name                 │                                │
  │     - Email                     │                                │
  │     - Phone                     │                                │
  │     - Date of Birth             │                                │
  │     - Password                  │                                │
  │     - Confirm Password          │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │                                 │  4. POST /api/v1/auth/register │
  │                                 │     {                          │
  │                                 │       name: "...",             │
  │                                 │       email: "...",            │
  │                                 │       phone: "...",            │
  │                                 │       dob: "...",              │
  │                                 │       password: "...",         │
  │                                 │       subdomain: "hospital1"   │
  │                                 │     }                          │
  │                                 │────────────────────────────────►
  │                                 │                                │
  │                                 │  5. Backend:                   │
  │                                 │     - Check email not exists   │
  │                                 │     - Create user (unverified) │
  │                                 │     - Link to tenant           │
  │                                 │     - Send verification email  │
  │                                 │                                │
  │                                 │◄────────────────────────────────
  │                                 │  6. Response:                  │
  │                                 │     {                          │
  │                                 │       success: true,           │
  │                                 │       message: "Check email"   │
  │                                 │     }                          │
  │                                 │                                │
  │◄─────────────────────────────────                                │
  │  7. Show "Check your email"     │                                │
  │                                 │                                │
  │  8. Click verification link     │                                │
  │     (in email)                  │                                │
  │─────────────────────────────────────────────────────────────────►│
  │                                 │                                │
  │                                 │  9. GET /api/v1/auth/verify    │
  │                                 │     ?token=xxx                 │
  │                                 │────────────────────────────────►
  │                                 │                                │
  │                                 │◄────────────────────────────────
  │                                 │  10. Mark email verified       │
  │                                 │                                │
  │◄─────────────────────────────────                                │
  │  11. Redirect to /auth          │                                │
  │      Show "Email verified"      │                                │
  │                                 │                                │
```

### Flow 3: Forgot Password

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FORGOT PASSWORD FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

User                             Frontend                         Backend
  │                                 │                                │
  │  1. Click "Forgot Password"     │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │  2. Navigate to                 │                                │
  │     /auth/forgot-password       │                                │
  │                                 │                                │
  │  3. Enter email                 │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │                                 │  4. POST /api/v1/auth/         │
  │                                 │     forgot-password            │
  │                                 │     { email: "..." }           │
  │                                 │────────────────────────────────►
  │                                 │                                │
  │                                 │  5. Send reset email           │
  │                                 │     (if email exists)          │
  │                                 │                                │
  │◄─────────────────────────────────                                │
  │  6. "If email exists, check     │                                │
  │      your inbox"                │                                │
  │                                 │                                │
  │  7. Click reset link in email   │                                │
  │     /auth/reset-password?token= │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │  8. Enter new password          │                                │
  │─────────────────────────────────►                                │
  │                                 │                                │
  │                                 │  9. POST /api/v1/auth/         │
  │                                 │     reset-password             │
  │                                 │     { token, password }        │
  │                                 │────────────────────────────────►
  │                                 │                                │
  │◄─────────────────────────────────                                │
  │  10. "Password reset. Login"    │                                │
  │                                 │                                │
```

---

## 🖥️ Frontend Pages

### Login Page (`/auth`)

**Route:** `app/hospital/[subdomain]/auth/page.tsx`

#### UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│              [Hospital Logo]                                     │
│              Hospital Name                                       │
│                                                                  │
│         ┌─────────────────────────────────────┐                 │
│         │  📧 Email                           │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  🔒 Password                        │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  [Forgot Password?]                 │                 │
│         │                                     │                 │
│         │  ┌─────────────────────────────┐   │                 │
│         │  │         LOGIN              │   │                 │
│         │  └─────────────────────────────┘   │                 │
│         │                                     │                 │
│         │  ──────────── or ────────────       │                 │
│         │                                     │                 │
│         │  New patient?                       │                 │
│         │  [Create Account]                   │                 │
│         │                                     │                 │
│         └─────────────────────────────────────┘                 │
│                                                                  │
│         Powered by Athaarva                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Branding Integration
```typescript
interface HospitalBranding {
  logo_url: string;
  name: string;
  primary_color: string;
  secondary_color: string;
}

// Fetch branding on page load
const branding = await fetch(`/api/v1/tenants/${subdomain}/branding`);
```

### Registration Page (`/auth/register`)

**Route:** `app/hospital/[subdomain]/auth/register/page.tsx`

#### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | ✅ | Min 2 chars |
| Email | email | ✅ | Valid email format |
| Phone | tel | ✅ | Valid phone number |
| Date of Birth | date | ✅ | Must be past date, age > 0 |
| Password | password | ✅ | Min 8 chars, mixed case, number |
| Confirm Password | password | ✅ | Must match password |
| Terms & Conditions | checkbox | ✅ | Must be checked |

#### UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│              [Hospital Logo]                                     │
│              Create Patient Account                              │
│                                                                  │
│         ┌─────────────────────────────────────┐                 │
│         │  Full Name                          │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  Email                              │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  Phone Number                       │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  Date of Birth                      │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  Password                           │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  Confirm Password                   │                 │
│         │  _________________________________  │                 │
│         │                                     │                 │
│         │  ☑ I agree to Terms & Conditions   │                 │
│         │                                     │                 │
│         │  ┌─────────────────────────────┐   │                 │
│         │  │     CREATE ACCOUNT          │   │                 │
│         │  └─────────────────────────────┘   │                 │
│         │                                     │                 │
│         │  Already have an account? [Login]   │                 │
│         │                                     │                 │
│         └─────────────────────────────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/login` | User login | No |
| POST | `/api/v1/auth/register` | Patient registration | No |
| POST | `/api/v1/auth/logout` | Logout (invalidate session) | Yes |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password with token | No |
| GET | `/api/v1/auth/verify-email` | Verify email with token | No |
| POST | `/api/v1/auth/resend-verification` | Resend verification email | No |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | Yes |

### Request/Response Schemas

#### Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
  subdomain: string;  // From URL
}
```

#### Login Response
```typescript
interface LoginResponse {
  success: boolean;
  token: string;  // JWT
  refresh_token: string;
  user: {
    id: string;  // UUID
    email: string;
    name: string;
    role: UserRole;
    tenant_id: string;  // UUID
    tenant_name: string;
    avatar_url?: string;
  };
}

type UserRole = 
  | 'super_admin'
  | 'hospital_admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'billing_staff'
  | 'patient';
```

#### Register Request
```typescript
interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;  // ISO date
  password: string;
  subdomain: string;  // From URL
}
```

#### Register Response
```typescript
interface RegisterResponse {
  success: boolean;
  message: string;
  requires_verification: boolean;
}
```

---

## 🔑 JWT Token Structure

```typescript
interface JWTPayload {
  // Standard claims
  sub: string;      // User ID (UUID)
  iat: number;      // Issued at
  exp: number;      // Expiration
  
  // Custom claims
  email: string;
  role: UserRole;
  tenant_id: string;
  permissions: string[];  // e.g., ['read:patients', 'write:appointments']
}
```

### Token Handling

```typescript
// Frontend: Store token
localStorage.setItem('access_token', token);
localStorage.setItem('refresh_token', refreshToken);
localStorage.setItem('user', JSON.stringify(user));

// Frontend: Include in requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'X-Tenant-ID': user.tenant_id
};

// Frontend: Role-based redirect
function redirectBasedOnRole(role: UserRole, subdomain: string) {
  const basePath = `/hospital/${subdomain}`;
  switch (role) {
    case 'hospital_admin':
      return `${basePath}/admin`;
    case 'doctor':
      return `${basePath}/doctor`;
    case 'nurse':
    case 'receptionist':
    case 'billing_staff':
      return `${basePath}/staff`;
    case 'patient':
      return `${basePath}/patient`;
    default:
      return `${basePath}/auth`;
  }
}
```

---

## 📧 Email Templates

### Verification Email

```html
Subject: Verify your email - [Hospital Name]

<html>
<body>
  <h1>Welcome to [Hospital Name]!</h1>
  <p>Please verify your email address by clicking the button below:</p>
  
  <a href="[verification_url]" style="...">
    Verify Email
  </a>
  
  <p>This link expires in 24 hours.</p>
  
  <p>If you didn't create this account, ignore this email.</p>
  
  <footer>
    Powered by Athaarva Healthcare Platform
  </footer>
</body>
</html>
```

### Password Reset Email

```html
Subject: Reset your password - [Hospital Name]

<html>
<body>
  <h1>Password Reset Request</h1>
  <p>Click the button below to reset your password:</p>
  
  <a href="[reset_url]" style="...">
    Reset Password
  </a>
  
  <p>This link expires in 1 hour.</p>
  
  <p>If you didn't request this, ignore this email.</p>
  
  <footer>
    Powered by Athaarva Healthcare Platform
  </footer>
</body>
</html>
```

---

## 🛡️ Security Considerations

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- No common passwords (dictionary check)

### Rate Limiting
| Endpoint | Limit |
|----------|-------|
| `/auth/login` | 5 attempts per 15 minutes |
| `/auth/register` | 3 registrations per hour per IP |
| `/auth/forgot-password` | 3 requests per hour per email |

### Session Management
- JWT expires in 1 hour
- Refresh token expires in 7 days
- Logout invalidates refresh token
- Multiple device sessions allowed

---

## 📋 Implementation Checklist

### Login Page
- [x] Basic login form
- [x] Hospital branding integration
- [x] Form validation
- [ ] Error messages (invalid credentials)
- [ ] Loading states
- [ ] "Remember me" option
- [x] Redirect based on role

### Registration Page
- [x] Basic registration form
- [ ] Form validation (all rules)
- [ ] Terms & conditions checkbox
- [ ] Password strength indicator
- [ ] Email verification flow
- [ ] Success/error states

### Password Reset
- [ ] Forgot password page
- [ ] Reset password page
- [ ] Token validation
- [ ] Email templates

### Backend
- [x] Login endpoint
- [x] Register endpoint
- [ ] Email verification endpoint
- [ ] Password reset endpoints
- [ ] Rate limiting
- [ ] Email sending integration

---

## 🔗 Related Documentation

- [01_PLATFORM_OVERVIEW.md](./01_PLATFORM_OVERVIEW.md) - Platform structure
- [05_ADMIN_DASHBOARD.md](./05_ADMIN_DASHBOARD.md) - Admin features
- [09_BACKEND_API.md](./09_BACKEND_API.md) - API specifications
