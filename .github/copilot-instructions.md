# Athaarva Healthcare Platform - Copilot Instructions

## Architecture Overview

**Athaarva** is a multi-tenant healthcare SaaS platform with:
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: FastAPI + PostgreSQL with direct SQL queries (no ORM)
- **Multi-tenancy**: Subdomain-based routing (`hospital.athaarva.com` → `/app/hospital/[subdomain]/`)

### Key Directories
```
Athaarva_Frontend/
├── app/                    # Next.js App Router pages
│   ├── hospital/[subdomain]/  # Multi-tenant hospital routes
│   ├── pharmacy/           # Standalone pharmacy module (no auth)
│   ├── super-admin/        # Platform admin dashboard
│   ├── onboarding/         # Multi-step wizards (patient/doctor/hospital)
│   └── auth/               # Authentication flows
├── components/ui/          # shadcn/ui components (new-york style)
├── contexts/               # React contexts (auth, navigation, etc.)
├── lib/                    # API services, utilities, config
└── hooks/                  # Custom React hooks
```

## Code Conventions

### Component Patterns
- **"use client"** directive required for interactive components
- Use **Framer Motion** for animations (`motion.div`, `AnimatePresence`)
- Icons: **Lucide React** (`import { Icon } from "lucide-react"`)
- Toast notifications: **Sonner** (`import { toast } from "sonner"`)

### Styling
```tsx
// Use healthcare color palette from tailwind.config.ts
className="bg-healthcare-primary"     // #007C7C (teal)
className="text-healthcare-secondary" // #20B2AA
className="bg-healthcare-cool-white"  // #FAFAFA
```

### shadcn/ui Components
```tsx
// Import from @/components/ui/
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
```

### API Integration
```tsx
// Use lib/api-config.ts for endpoints
import { API_CONFIG } from "@/lib/api-config";

// Use lib/api-service.ts for API calls
import apiService from "@/lib/api-service";
```

### Type Definitions
- Feature-specific types go in `types.ts` within the feature folder (e.g., `/app/pharmacy/types.ts`)
- Shared types go in `/types/` directory
- Use UUIDs for all IDs (not numeric)

## Multi-Tenant Patterns

### Subdomain Routing
```tsx
// In /app/hospital/[subdomain]/ pages:
const params = useParams();
const subdomain = params.subdomain as string;

// Links within tenant context:
<Link href={`/hospital/${subdomain}/pharmacy`}>
```

### Authentication Contexts
- `AuthContext` - Patient/Doctor auth
- `HospitalAdminAuthContext` - Hospital staff auth  
- `SuperAdminAuthContext` - Platform admin auth

### Route Guards
```tsx
import { ProtectedRouteGuard, RoleBasedRouteGuard } from "@/components/guards/RouteGuards";
```

## Feature Module Pattern (e.g., Pharmacy)

Self-contained modules in `/app/<module>/`:
```
app/pharmacy/
├── types.ts              # All TypeScript types + mock data
├── layout.tsx            # Standalone layout (optional auth)
├── page.tsx              # Dashboard
├── components/           # Module-specific components
│   └── index.ts          # Barrel export
├── stock-entry/page.tsx  # Sub-pages
├── stock-out/page.tsx
└── inventory/page.tsx
```

## Development Commands

```bash
# Frontend
cd Athaarva_Frontend
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint check

# Backend  
cd Athaarva_Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Common Gotchas

1. **Pack Types**: Medicine pack types must be added to `PackType` union in types.ts before use
2. **Currency**: Use `formatCurrency()` from types.ts for INR formatting
3. **Dates**: Use `date-fns` for formatting (`format(new Date(), "yyyy-MM-dd")`)
4. **Excel Export**: xlsx package is installed, use dynamic import: `const XLSX = await import("xlsx")`
5. **Forms**: Prefer controlled inputs with `useState`, use `react-hook-form` for complex forms

## Testing Subdomains Locally

Access tenant sites via: `http://t.localhost:3000`, `http://demo.localhost:3000`

Middleware validates subdomains against backend API or allows test values: `['cityhospital', 'greenvalley', 't', 'demo', 'test']`
