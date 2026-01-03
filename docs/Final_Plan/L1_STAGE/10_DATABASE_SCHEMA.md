# 🗄️ L1: Database Schema

> **Status**: 🟡 Partially Implemented  
> **Backend**: PostgreSQL with Multi-tenant architecture  
> **ORM**: SQLAlchemy

---

## 📋 Overview

Multi-tenant database schema supporting hospital isolation with shared infrastructure.

---

## 🏗️ Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              MULTI-TENANT DATABASE DESIGN                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Strategy: Schema-based Isolation                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  public schema (shared)                                   │  │
│  │  ├── tenants (hospital registry)                         │  │
│  │  ├── super_admins                                         │  │
│  │  └── global_settings                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │hospital_abc  │  │hospital_xyz  │  │hospital_123  │         │
│  │  ├── users   │  │  ├── users   │  │  ├── users   │         │
│  │  ├── doctors │  │  ├── doctors │  │  ├── doctors │         │
│  │  ├── patients│  │  ├── patients│  │  ├── patients│         │
│  │  └── ...     │  │  └── ...     │  │  └── ...     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Core Tables

### Public Schema (Shared)

#### tenants
```sql
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    schema_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',  -- pending, active, suspended
    
    -- Hospital Basic Info
    hospital_name VARCHAR(255),
    hospital_type VARCHAR(100),
    registration_number VARCHAR(100),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20),
    
    -- Settings (JSONB for flexibility)
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    activated_at TIMESTAMP,
    
    -- Audit
    created_by UUID,
    invitation_id UUID
);
```

#### super_admins
```sql
CREATE TABLE public.super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'super_admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### hospital_invitations
```sql
CREATE TABLE public.hospital_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    hospital_name VARCHAR(255),
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',  -- pending, accepted, expired
    invited_by UUID REFERENCES super_admins(id),
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### Tenant Schema (Per Hospital)

#### users (Authentication)
```sql
CREATE TABLE {schema}.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    
    -- Role Management
    role VARCHAR(50) NOT NULL,  -- hospital_admin, doctor, receptionist, nurse, patient
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    
    -- Linked Profile
    profile_id UUID,  -- References doctor/staff/patient table based on role
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);
```

#### hospital_admins
```sql
CREATE TABLE {schema}.hospital_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    phone VARCHAR(20),
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### doctors
```sql
CREATE TABLE {schema}.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    -- Personal Info
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    date_of_birth DATE,
    profile_image VARCHAR(500),
    
    -- Professional Info
    registration_number VARCHAR(100) NOT NULL,
    registration_council VARCHAR(255),
    specialization VARCHAR(255),
    qualification VARCHAR(500),
    experience_years INTEGER,
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Consultation Settings
    consultation_fee DECIMAL(10,2),
    consultation_duration INTEGER DEFAULT 15,  -- minutes
    
    -- Availability (JSONB for flexible scheduling)
    availability JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',  -- active, on_leave, inactive
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_doctors_specialization (specialization),
    INDEX idx_doctors_status (status)
);
```

#### staff
```sql
CREATE TABLE {schema}.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    -- Personal Info
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50),
    role VARCHAR(50) NOT NULL,  -- receptionist, nurse, lab_tech, pharmacist, other
    department VARCHAR(100),
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Permissions
    permissions JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_staff_role (role),
    INDEX idx_staff_department (department)
);
```

#### patients
```sql
CREATE TABLE {schema}.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    -- Registration
    patient_id VARCHAR(50) UNIQUE,  -- Hospital's patient ID (auto-generated)
    registration_date DATE DEFAULT CURRENT_DATE,
    
    -- Personal Info
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    date_of_birth DATE,
    blood_group VARCHAR(10),
    profile_image VARCHAR(500),
    
    -- Contact
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    
    -- Medical Info
    allergies JSONB DEFAULT '[]',
    chronic_conditions JSONB DEFAULT '[]',
    current_medications JSONB DEFAULT '[]',
    
    -- Insurance
    insurance_provider VARCHAR(255),
    insurance_policy_number VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_patients_phone (phone),
    INDEX idx_patients_patient_id (patient_id)
);
```

#### appointments
```sql
CREATE TABLE {schema}.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    
    -- Appointment Details
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 15,  -- minutes
    appointment_type VARCHAR(50),  -- in_person, video, follow_up
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled',
    -- scheduled, confirmed, checked_in, in_progress, completed, cancelled, no_show
    
    -- Queue Management
    token_number INTEGER,
    check_in_time TIMESTAMP,
    consultation_start TIMESTAMP,
    consultation_end TIMESTAMP,
    
    -- Notes
    reason VARCHAR(500),
    notes TEXT,
    
    -- Billing
    fee DECIMAL(10,2),
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP,
    cancellation_reason VARCHAR(500),
    
    INDEX idx_appointments_date (appointment_date),
    INDEX idx_appointments_doctor (doctor_id),
    INDEX idx_appointments_patient (patient_id),
    INDEX idx_appointments_status (status)
);
```

#### consultations
```sql
CREATE TABLE {schema}.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id),
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    
    -- Clinical Notes
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    examination_findings TEXT,
    diagnosis TEXT,
    diagnosis_codes JSONB DEFAULT '[]',  -- ICD-10 codes
    treatment_plan TEXT,
    
    -- Vitals (JSONB for flexibility)
    vitals JSONB DEFAULT '{}',
    -- { "bp_systolic": 120, "bp_diastolic": 80, "pulse": 72, "temp": 98.6, "weight": 70 }
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_notes VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_consultations_patient (patient_id),
    INDEX idx_consultations_doctor (doctor_id)
);
```

#### prescriptions
```sql
CREATE TABLE {schema}.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(id),
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    
    -- Prescription Details
    prescription_date DATE DEFAULT CURRENT_DATE,
    
    -- Medications (JSONB array)
    medications JSONB NOT NULL,
    -- [{ "name": "Paracetamol", "dosage": "500mg", "frequency": "3 times daily", "duration": "5 days", "instructions": "After food" }]
    
    -- Additional
    notes TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    dispensed BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_prescriptions_patient (patient_id)
);
```

#### lab_orders
```sql
CREATE TABLE {schema}.lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(id),
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    
    -- Order Details
    order_date DATE DEFAULT CURRENT_DATE,
    tests JSONB NOT NULL,  -- Array of test names/codes
    
    -- Status
    status VARCHAR(50) DEFAULT 'ordered',
    -- ordered, sample_collected, processing, completed, cancelled
    
    -- Results
    results JSONB,
    result_date DATE,
    result_file_url VARCHAR(500),
    
    -- Lab Info
    lab_name VARCHAR(255),
    lab_reference_number VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_lab_orders_patient (patient_id),
    INDEX idx_lab_orders_status (status)
);
```

#### bills
```sql
CREATE TABLE {schema}.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    patient_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    
    -- Bill Details
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    bill_date DATE DEFAULT CURRENT_DATE,
    
    -- Items (JSONB array)
    items JSONB NOT NULL,
    -- [{ "description": "Consultation", "amount": 500 }, { "description": "ECG", "amount": 300 }]
    
    -- Amounts
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    -- pending, partial, paid, refunded
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_mode VARCHAR(50),  -- cash, card, upi, insurance
    
    -- Insurance
    insurance_claim BOOLEAN DEFAULT false,
    insurance_amount DECIMAL(10,2),
    insurance_status VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_bills_patient (patient_id),
    INDEX idx_bills_status (payment_status)
);
```

#### messages
```sql
CREATE TABLE {schema}.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Participants
    sender_id UUID NOT NULL,
    sender_type VARCHAR(50) NOT NULL,  -- doctor, patient, staff
    recipient_id UUID NOT NULL,
    recipient_type VARCHAR(50) NOT NULL,
    
    -- Message
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_messages_recipient (recipient_id),
    INDEX idx_messages_sender (sender_id)
);
```

---

## 🔗 Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              ENTITY RELATIONSHIPS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  users ────────┬───────────────────────────────────────────┐   │
│     │          │                                            │   │
│     │    ┌─────▼─────┐   ┌─────────────┐   ┌───────────┐  │   │
│     │    │  doctors  │───│appointments │───│ patients  │  │   │
│     │    └───────────┘   └──────┬──────┘   └─────┬─────┘  │   │
│     │          │                │                │         │   │
│     │          │         ┌──────▼──────┐         │         │   │
│     │          └─────────│consultations│─────────┘         │   │
│     │                    └──────┬──────┘                   │   │
│     │                           │                          │   │
│     │    ┌───────────────┬──────┴──────┬───────────────┐  │   │
│     │    │               │             │               │  │   │
│     │    ▼               ▼             ▼               ▼  │   │
│     │ prescriptions  lab_orders     bills         messages│   │
│     │                                                      │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Implementation Status

| Table | Backend Model | API Routes | Status |
|-------|--------------|------------|--------|
| tenants | ✅ Yes | ✅ Yes | ✅ Complete |
| super_admins | ✅ Yes | ✅ Yes | ✅ Complete |
| hospital_invitations | ✅ Yes | ✅ Yes | ✅ Complete |
| users | ✅ Yes | ✅ Yes | ✅ Complete |
| hospital_admins | ✅ Yes | ⏳ Partial | 🟡 In Progress |
| doctors | ✅ Yes | ✅ Yes | ✅ Complete |
| staff | ✅ Yes | ✅ Yes | ✅ Complete |
| patients | ✅ Yes | ✅ Yes | ✅ Complete |
| appointments | ✅ Yes | ✅ Yes | ✅ Complete |
| consultations | ⏳ Partial | ⏳ Partial | 🟡 In Progress |
| prescriptions | ⏳ Partial | ⏳ Partial | 🟡 In Progress |
| lab_orders | ❌ No | ❌ No | ❌ Not Started |
| bills | ⏳ Partial | ⏳ Partial | 🟡 In Progress |
| messages | ❌ No | ❌ No | ❌ Not Started |

---

## 🔒 Security Considerations

```
Database Security
├── Row-Level Security (RLS) enabled
├── Schema-based tenant isolation
├── Encrypted sensitive fields (passwords, etc.)
├── Audit logging on sensitive tables
├── Regular backups (daily)
└── Connection pooling (per tenant limits)
```
