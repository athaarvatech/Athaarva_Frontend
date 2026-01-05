# 12. Super Admin - Complete Specification

> **Stage:** L1 (Core) + L2 (Extended)  
> **Priority:** HIGH  
> **Status:** 🟡 ~15% Implemented  
> **Last Updated:** December 30, 2025

---

## 🎯 Overview

The Super Admin dashboard provides **complete platform control** for the Athaarva team:
- Multi-tenant hospital management
- Database administration
- Content management (website & social media)
- Subscription & plan management
- User oversight & security
- System monitoring & AI governance

---

## 📊 Implementation Status

| Module | Backend | Frontend | Priority | Status |
|--------|---------|----------|----------|--------|
| Dashboard | ✅ | ✅ | P1 | 🟡 Partial |
| Tenants | ✅ | ✅ | P1 | 🟡 Partial |
| Invitations | ✅ | ✅ | P1 | ✅ Complete |
| Onboarding Review | ✅ | ⚠️ | P1 | 🟡 Buttons not wired |
| Tenant Users Tab | ❌ | ❌ | P1 | ❌ Not Started |
| Database GUI | ❌ | ❌ | P2 | ❌ Not Started |
| Plan Catalog | ❌ | ❌ | P2 | ❌ Not Started |
| Global Users | ❌ | ❌ | P2 | ❌ Not Started |
| Audit Logs | ❌ | ❌ | P2 | ❌ Not Started |
| Website CMS | ❌ | ❌ | P3 | ❌ Not Started |
| Social Media Hub | ❌ | ❌ | P3 | ❌ Not Started |
| Template Catalog | ❌ | ❌ | P3 | ❌ Not Started |
| Impersonation | ❌ | ❌ | P4 | ❌ Not Started |
| Background Jobs | ❌ | ❌ | P4 | ❌ Not Started |
| AI Telemetry | ❌ | ❌ | P4 | ❌ Not Started |
| Platform Settings | ❌ | ❌ | P4 | ❌ Not Started |

---

## 🔗 URL Structure

| URL | Page | Description | Status |
|-----|------|-------------|--------|
| `/super-admin` | Dashboard | Platform overview & KPIs | ✅ |
| `/super-admin/login` | Login | Super admin authentication | ✅ |
| `/super-admin/tenants` | Tenants | All hospitals management | ✅ |
| `/super-admin/tenants/[id]` | Tenant Detail | Individual tenant view | ✅ |
| `/super-admin/invites` | Invitations | Send & manage invitations | ✅ |
| `/super-admin/database` | Database GUI | Visual database management | ❌ |
| `/super-admin/plans` | Plan Catalog | Pricing & subscription plans | ❌ |
| `/super-admin/users` | Global Users | Cross-tenant user management | ❌ |
| `/super-admin/audit` | Audit Logs | Activity logging & compliance | ❌ |
| `/super-admin/website` | Website CMS | athaarva.com content editor | ❌ |
| `/super-admin/social` | Social Media | Multi-platform publishing | ❌ |
| `/super-admin/templates` | Templates | Hospital website templates | ❌ |
| `/super-admin/impersonate` | Impersonation | Login as any user | ❌ |
| `/super-admin/jobs` | Background Jobs | Queue monitoring | ❌ |
| `/super-admin/ai` | AI Telemetry | AI usage & governance | ❌ |
| `/super-admin/settings` | Settings | Platform configuration | ❌ |

---

## 📐 Layout Structure

### Sidebar Navigation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌───────────────────────────────────────────────────┐   │
│  │   SIDEBAR    │  │  Header                        [🔔] [Admin ▼]    │   │
│  │              │  ├───────────────────────────────────────────────────┤   │
│  │  [Athaarva]  │  │                                                   │   │
│  │  Super Admin │  │                                                   │   │
│  │              │  │                                                   │   │
│  │  ───────────  │  │                  MAIN CONTENT                    │   │
│  │  Dashboard   │  │                                                   │   │
│  │  Tenants     │  │                                                   │   │
│  │  Invitations │  │                                                   │   │
│  │              │  │                                                   │   │
│  │  ───────────  │  │                                                   │   │
│  │  Database    │  │                                                   │   │
│  │  Plans       │  │                                                   │   │
│  │  Users       │  │                                                   │   │
│  │  Audit Logs  │  │                                                   │   │
│  │              │  │                                                   │   │
│  │  ───────────  │  │                                                   │   │
│  │  Website CMS │  │                                                   │   │
│  │  Social      │  │                                                   │   │
│  │  Templates   │  │                                                   │   │
│  │              │  │                                                   │   │
│  │  ───────────  │  │                                                   │   │
│  │  Jobs        │  │                                                   │   │
│  │  AI          │  │                                                   │   │
│  │  Settings    │  │                                                   │   │
│  │              │  │                                                   │   │
│  └──────────────┘  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Module Specifications

### 1. Dashboard (`/super-admin`)
**Status:** 🟡 Partial

#### KPI Cards
| Metric | Description | Source |
|--------|-------------|--------|
| Active Tenants | Currently active hospitals | `tenant_mgmt.tenants` |
| Pending Tenants | Awaiting approval | `tenant_mgmt.tenants` |
| Total Users | Platform-wide user count | `iam.users` |
| Monthly Revenue | MRR from subscriptions | `billing.subscriptions` |
| Pending Invitations | Awaiting acceptance | `iam.invitations` |
| Active Appointments | Today's appointments | `clinical.appointments` |

#### Dashboard Sections
- **Onboarding Funnel** - Invited → In Review → Ready → Live
- **Invitation Pulse** - Pending, Expiring, Used, Revoked counts
- **Alerts Panel** - Critical issues requiring attention
- **Operational Queue** - Tasks requiring super admin action
- **Plan Catalog Status** - Plan health and usage
- **Template Readiness** - Template QA status

---

### 2. Database GUI (`/super-admin/database`)
**Status:** ❌ Not Started

#### Features Required
| Feature | Description | Priority |
|---------|-------------|----------|
| Schema Browser | List all schemas (tenant_mgmt, iam, hospital, etc.) | P1 |
| Table Explorer | Browse tables within a schema | P1 |
| Data Grid | View records in tabular format with pagination | P1 |
| Column Info | Show data types, constraints, indexes | P1 |
| Search/Filter | Filter records by column values | P1 |
| CRUD Operations | Add, Edit, Delete records via UI | P2 |
| SQL Console | Run custom SQL queries (SELECT only for safety) | P2 |
| Export | CSV, JSON export of query results | P2 |
| Import | CSV import with validation | P3 |
| Backup/Restore | Schema-level backup/restore | P3 |

#### Security Controls
- All operations logged with super admin ID
- Confirmation modal for destructive operations (DELETE)
- Read-only mode toggle (prevents accidental changes)
- Cannot modify `ops.audit_logs` table
- Query timeout limits (30 seconds max)

#### Wireframe
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Database Explorer                              [SQL Console] [Export]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Schemas                    Table: iam.users                            │
│  ┌───────────────┐          ┌───────────────────────────────────────┐  │
│  │ ▼ tenant_mgmt │          │ [Filter] [+ Add Record]               │  │
│  │   tenants     │          ├───────────────────────────────────────┤  │
│  │   plan_catalog│          │ id | email | status | tenant_id | ... │  │
│  │   templates   │          │─────────────────────────────────────────│  │
│  │ ▼ iam         │          │ uuid | user@example.com | active | ...│  │
│  │   users    ◀──│──────────│ uuid | admin@hospital.com | active |...│  │
│  │   roles       │          │ uuid | doctor@test.com | invited | ... │  │
│  │   permissions │          └───────────────────────────────────────┘  │
│  │   invitations │                                                      │
│  │ ▶ hospital    │          Showing 1-50 of 1,234 records              │
│  │ ▶ patient     │          [◀ Prev] [1] [2] [3] ... [Next ▶]          │
│  │ ▶ clinical    │                                                      │
│  │ ▶ billing     │                                                      │
│  │ ▶ ops         │                                                      │
│  └───────────────┘                                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### API Endpoints Required
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/super-admin/database/schemas` | List all schemas |
| GET | `/api/v1/super-admin/database/schemas/{schema}/tables` | List tables |
| GET | `/api/v1/super-admin/database/schemas/{schema}/tables/{table}` | Table info |
| GET | `/api/v1/super-admin/database/schemas/{schema}/tables/{table}/rows` | Paginated rows |
| POST | `/api/v1/super-admin/database/schemas/{schema}/tables/{table}/rows` | Insert row |
| PATCH | `/api/v1/super-admin/database/rows/{id}` | Update row |
| DELETE | `/api/v1/super-admin/database/rows/{id}` | Delete row |
| POST | `/api/v1/super-admin/database/query` | Execute SQL query |
| GET | `/api/v1/super-admin/database/export` | Export query results |

---

### 3. Plan Catalog (`/super-admin/plans`)
**Status:** ❌ Not Started

#### Features Required
| Feature | Description |
|---------|-------------|
| Plan List | View all plans with metrics (tenant count, ARR) |
| Create Plan | Name, price, billing cycle, currency |
| Edit Plan | Update features, limits, pricing |
| Duplicate Plan | Copy existing plan as template |
| Retire Plan | Soft-delete, grandfather existing tenants |
| Feature Toggles | Enable/disable features per plan |
| Limits | Max doctors, patients, storage per plan |
| Promo Codes | Create discount codes |
| Version History | Track all plan changes |

#### Plan Schema
```typescript
interface PlanCatalog {
  id: string;
  code: string;            // 'starter', 'professional', 'enterprise'
  name: string;
  description: string;
  billing_cycle: 'monthly' | 'yearly';
  base_price: number;
  currency: string;
  feature_set: {
    max_doctors: number;
    max_patients: number;
    max_storage_gb: number;
    telehealth: boolean;
    ai_features: boolean;
    custom_branding: boolean;
    api_access: boolean;
    sla_support: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### 4. Global Users (`/super-admin/users`)
**Status:** ❌ Not Started

#### Features Required
| Feature | Description |
|---------|-------------|
| Cross-Tenant List | View all users across all hospitals |
| Role Filter | Filter by doctor, admin, staff, patient |
| Status Filter | Active, Pending, Suspended |
| Tenant Filter | Filter by specific hospital |
| Search | By email, name, phone |
| Security Alerts | Failed login attempts, suspicious activity |
| Bulk Actions | Force password reset, revoke sessions |
| User Detail | View user profile and activity |
| Quarantine | Disable account pending investigation |

#### API Endpoints Required
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/super-admin/users` | List all users with filters |
| GET | `/api/v1/super-admin/users/{id}` | User details |
| POST | `/api/v1/super-admin/users/{id}/reset-password` | Force password reset |
| POST | `/api/v1/super-admin/users/{id}/revoke-sessions` | Revoke all sessions |
| POST | `/api/v1/super-admin/users/{id}/quarantine` | Quarantine user |
| GET | `/api/v1/super-admin/security-alerts` | List security alerts |

---

### 5. Audit Logs (`/super-admin/audit`)
**Status:** ❌ Not Started

#### Features Required
| Feature | Description |
|---------|-------------|
| Activity Stream | Chronological log of all super admin actions |
| Filters | By actor, action type, date range, tenant |
| Search | Full-text search in log details |
| Export | CSV export for compliance |
| Retention | 90-day retention policy |

#### Log Entry Schema
```typescript
interface AuditLog {
  id: string;
  actor_id: string;
  actor_email: string;
  action: string;           // 'tenant.create', 'user.suspend', etc.
  entity_type: string;      // 'tenant', 'user', 'invitation'
  entity_id: string;
  tenant_id: string | null;
  details: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}
```

---

### 6. Website CMS (`/super-admin/website`)
**Status:** ❌ Not Started

#### Editable Sections
| Section | Editable Fields |
|---------|-----------------|
| Hero | Headline, subheadline, CTA button, background image |
| Features | Feature cards (icon, title, description) |
| Services | Service list with descriptions |
| Testimonials | Customer quotes with name, role, company |
| Pricing | Plan cards (synced from Plan Catalog) |
| FAQ | Question/answer pairs |
| Footer | Links, contact info, social links |

#### Features Required
| Feature | Description |
|---------|-------------|
| Rich Text Editor | WYSIWYG content editing |
| Image Upload | Upload and manage media assets |
| Preview | Live preview before publishing |
| Publish/Draft | Save drafts, publish when ready |
| Version History | Revert to previous versions |
| SEO Settings | Meta title, description, OG image |

---

### 7. Social Media Hub (`/super-admin/social`)
**Status:** ❌ Not Started

#### Supported Platforms
- Instagram
- LinkedIn
- Twitter/X
- Facebook

#### Features Required
| Feature | Description |
|---------|-------------|
| Account Connect | OAuth connect to each platform |
| Post Creator | Rich text editor with media |
| Multi-Platform | Select platforms for each post |
| Scheduling | Schedule posts for future |
| Preview | Platform-specific preview |
| Analytics | Engagement metrics from each platform |
| Media Library | Uploaded images/videos |

---

### 8. User Impersonation (`/super-admin/impersonate`)
**Status:** ❌ Not Started

#### Features Required
| Feature | Description |
|---------|-------------|
| User Search | Find user by email or tenant |
| Start Session | Begin impersonation with reason |
| Visual Indicator | Banner showing "Impersonating: user@email.com" |
| Auto Timeout | Session expires after 30 minutes |
| End Session | One-click return to super admin |
| Full Audit | All actions logged with impersonation flag |

#### Security Requirements
- Reason field required before starting
- Cannot impersonate other super admins
- Cannot modify security settings while impersonating
- IP and user agent logged
- Notification sent to impersonated user (optional)

---

### 9. Background Jobs (`/super-admin/jobs`)
**Status:** ❌ Not Started

#### Queue Types
| Queue | Purpose | SLA |
|-------|---------|-----|
| emails | Transactional emails | < 5 min |
| sms | OTP, notifications | < 1 min |
| reports | Analytics generation | < 1 hour |
| backups | Database backups | Daily 2AM |
| sync | External integrations | Real-time |

#### Features Required
| Feature | Description |
|---------|-------------|
| Queue List | All queues with health status |
| Job List | Recent jobs with status |
| Retry Failed | Retry individual failed jobs |
| Clear Queue | Clear all failed jobs |
| Pause/Resume | Pause queue processing |
| Manual Trigger | Trigger backup/report now |

---

### 10. AI Telemetry (`/super-admin/ai`)
**Status:** ❌ Not Started

#### Metrics Tracked
| Metric | Description |
|--------|-------------|
| Total Requests | AI API calls platform-wide |
| Total Tokens | Input + output tokens |
| Total Cost | Estimated cost from providers |
| Avg Latency | Response time percentiles |
| By Feature | Clinical Notes, Symptom Checker, Chatbot |
| By Tenant | Usage and cost per hospital |

#### Configuration
| Setting | Description |
|---------|-------------|
| Model Selection | GPT-4, Claude, etc. |
| Rate Limits | Requests per minute |
| Token Limits | Max tokens per request |
| Guardrails | PII redaction, content filters |

---

## 🔧 API Endpoints Summary

### Existing (Working)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v2/super-admin/login` | Login |
| GET | `/api/v2/super-admin/me` | Current user |
| GET | `/api/v2/super-admin/dashboard` | Dashboard metrics |
| GET | `/api/v2/super-admin/tenants` | List tenants |
| GET | `/api/v2/super-admin/tenants/{id}` | Tenant detail |
| PATCH | `/api/v2/super-admin/tenants/{id}` | Update tenant |
| DELETE | `/api/v2/super-admin/tenants/{id}` | Archive tenant |
| GET | `/api/v2/super-admin/invitations` | List invitations |
| POST | `/api/v2/super-admin/invitations` | Create invitation |
| DELETE | `/api/v2/super-admin/invitations/{id}` | Revoke invitation |
| GET | `/api/v2/super-admin/onboarding/sessions/{id}` | Get session |
| POST | `/api/v2/super-admin/onboarding/sessions/{id}/approve` | Approve |
| POST | `/api/v2/super-admin/onboarding/sessions/{id}/reject` | Reject |

### Needed (To Build)
| Method | Endpoint | Description | Module |
|--------|----------|-------------|--------|
| GET | `/api/v2/super-admin/tenants/{id}/users` | Tenant users | Tenants |
| GET | `/api/v2/super-admin/database/schemas` | List schemas | Database |
| GET | `/api/v2/super-admin/database/tables/{schema}/{table}` | Table data | Database |
| POST | `/api/v2/super-admin/database/query` | Execute SQL | Database |
| GET | `/api/v2/super-admin/plans` | List plans | Plans |
| POST | `/api/v2/super-admin/plans` | Create plan | Plans |
| GET | `/api/v2/super-admin/users` | All users | Users |
| GET | `/api/v2/super-admin/audit-logs` | Activity logs | Audit |
| GET | `/api/v2/super-admin/website/content` | CMS content | Website |
| PUT | `/api/v2/super-admin/website/content` | Update content | Website |
| GET | `/api/v2/super-admin/jobs` | Job queues | Jobs |
| GET | `/api/v2/super-admin/ai/metrics` | AI telemetry | AI |

---

## 🚀 Implementation Priority

### Phase 1 (Week 1) - Critical
1. ✅ Wire Onboarding Approve/Reject buttons
2. ✅ Add Tenant Users Tab with real data
3. ✅ Add resend invitation functionality

### Phase 2 (Week 2) - High Priority
1. Database GUI - Schema browser & table viewer
2. Plan Catalog - CRUD for pricing plans
3. Global Users - Cross-tenant user list

### Phase 3 (Week 3) - Medium Priority
1. Audit Logs - Activity tracking
2. Platform Settings - Global configuration
3. Improved Dashboard with real metrics

### Phase 4 (Week 4+) - Lower Priority
1. Website CMS
2. Social Media Hub
3. Template Catalog
4. User Impersonation
5. Background Jobs
6. AI Telemetry

---

## 📝 Notes

- All super admin actions must be logged to `ops.audit_logs`
- Database GUI should have read-only mode by default
- Impersonation requires explicit reason and is fully audited
- AI telemetry data stored in `ai.usage_telemetry` table
- Plan changes should support effective dates for scheduling

---

*Last Updated: December 30, 2025*
