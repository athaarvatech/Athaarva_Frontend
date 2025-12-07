# 🚀 Quick Reference - Development Setup

> Consolidated reference from legacy docs before cleanup

---

## 🔧 Development Setup

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔐 Test Credentials

### Super Admin
| Email | Password |
|-------|----------|
| `super.admin@athaarva.com` | `supersecure` |

---

## 📧 SMTP Email Configuration

Add to `.env.local`:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=discordsmurf245@gmail.com
SMTP_PASSWORD=azqbiucrcvfxrknd
SMTP_FROM_EMAIL=discordsmurf245@gmail.com
SMTP_FROM_NAME=Athaarva Healthcare
```

> ⚠️ These credentials are for local testing only. Do not push real secrets to public repos.

---

## 🛒 Shopify E-Commerce Setup

Add to `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_STOREFRONT_TOKEN=your-storefront-access-token
```

### Getting Shopify Credentials

1. Go to Shopify admin
2. Navigate to Apps > Manage private apps (or create a custom app)
3. Enable Storefront API access
4. Copy the generated Storefront access token

### Features
- Product Catalog with real-time listing
- Product Details with images, variants, options
- Live Search with debouncing
- Cart Management (add, update, remove)
- Checkout redirect to Shopify

---

## 🌐 Multi-Tenant URL Structure

### Production
- Main: `athaarva.com`
- Hospitals: `prashanthospital.athaarva.com`, `cityhospital.athaarva.com`

### Local Development
- Main: `localhost:3000`
- Path-based (easier testing):
  - `/hospital/prashanthospital` - Hospital landing
  - `/hospital/prashanthospital/admin` - Admin dashboard
  - `/auth/hospital/prashanthospital` - Hospital login

For subdomain testing locally, add to hosts file:
```
127.0.0.1 prashanthospital.localhost
127.0.0.1 cityhospital.localhost
```

---

## 🔌 Backend API

Backend runs on: `http://localhost:8000`

```bash
# Start backend
cd ../Dev
uvicorn app.main:app --reload
```

Health check: `GET http://localhost:8000/health`

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/api-service.ts` | Main API client |
| `contexts/AuthContext.tsx` | Authentication state |
| `middleware.ts` | Subdomain routing |
| `types/backend-types.ts` | TypeScript definitions |

---

*See `/docs/Final_Plan/` for complete documentation*
