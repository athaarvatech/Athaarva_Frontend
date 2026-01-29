# 🚀 L1: Deployment & Infrastructure

> **Status**: ❌ Not Started  
> **Environment**: Production readiness planning  
> **Target**: Cloud deployment (AWS/DigitalOcean)

---

## 📋 Overview

Infrastructure setup and deployment strategy for the multi-tenant healthcare platform.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              PRODUCTION ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                         Internet                                │
│                            │                                    │
│                            ▼                                    │
│                    ┌───────────────┐                           │
│                    │   Cloudflare  │                           │
│                    │   (CDN + DNS) │                           │
│                    └───────┬───────┘                           │
│                            │                                    │
│              ┌─────────────┴─────────────┐                     │
│              ▼                           ▼                     │
│    ┌─────────────────┐        ┌─────────────────┐             │
│    │  athaarva.com   │        │ *.athaarva.com  │             │
│    │  (Main Domain)  │        │  (Subdomains)   │             │
│    └────────┬────────┘        └────────┬────────┘             │
│             │                          │                       │
│             └──────────┬───────────────┘                       │
│                        ▼                                        │
│              ┌─────────────────┐                               │
│              │  Load Balancer  │                               │
│              │    (nginx)      │                               │
│              └────────┬────────┘                               │
│                       │                                         │
│         ┌─────────────┼─────────────┐                          │
│         ▼             ▼             ▼                          │
│   ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│   │ Frontend  │ │ Frontend  │ │ Frontend  │                   │
│   │  (Next.js)│ │  (Next.js)│ │  (Next.js)│                   │
│   └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                   │
│         └─────────────┼─────────────┘                          │
│                       ▼                                         │
│              ┌─────────────────┐                               │
│              │  API Gateway    │                               │
│              │   (FastAPI)     │                               │
│              └────────┬────────┘                               │
│                       │                                         │
│         ┌─────────────┼─────────────┐                          │
│         ▼             ▼             ▼                          │
│   ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│   │ PostgreSQL│ │   Redis   │ │    S3     │                   │
│   │  Database │ │   Cache   │ │  Storage  │                   │
│   └───────────┘ └───────────┘ └───────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Domain & DNS Configuration

### DNS Setup

```
DNS Records (Cloudflare)
├── athaarva.com
│   ├── A Record → Load Balancer IP
│   └── CNAME www → athaarva.com
│
├── Wildcard Subdomain (for hospitals)
│   └── *.athaarva.com → A Record → Load Balancer IP
│
├── API Subdomain
│   └── api.athaarva.com → A Record → API Server IP
│
└── SSL/TLS
    └── Full (Strict) mode with Cloudflare certificates
```

### Subdomain Routing

```
Request Flow
├── User visits hospital1.athaarva.com
├── Cloudflare routes to Load Balancer
├── nginx reads Host header
├── Routes to Next.js with subdomain info
├── Next.js middleware extracts subdomain
├── API calls include tenant context
└── Database queries scoped to tenant schema
```

---

## 🖥️ Server Configuration

### Frontend Servers (Next.js)

```yaml
# docker-compose.frontend.yml
version: '3.8'
services:
  frontend:
    image: athaarva-frontend:latest
    build:
      context: ./Athaarva_Frontend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.athaarva.com
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### Backend Servers (FastAPI)

```yaml
# docker-compose.backend.yml
version: '3.8'
services:
  backend:
    image: athaarva-backend:latest
    build:
      context: ./Dev
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/athaarva
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY}
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=athaarva
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=athaarva
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 🔐 Security Configuration

### SSL/TLS

```
SSL Setup
├── Cloudflare Origin Certificates
├── Full (Strict) SSL mode
├── HSTS enabled
├── TLS 1.2+ only
└── Automatic HTTPS redirect
```

### Firewall Rules

```
Firewall Configuration
├── Port 80 (HTTP) → Redirect to 443
├── Port 443 (HTTPS) → Open
├── Port 22 (SSH) → IP whitelist only
├── Port 5432 (PostgreSQL) → Internal only
├── Port 6379 (Redis) → Internal only
└── All other ports → Blocked
```

### Environment Variables

```
Required Environment Variables
├── Frontend (.env.production)
│   ├── NEXT_PUBLIC_API_URL
│   ├── NEXT_PUBLIC_DOMAIN
│   └── NEXTAUTH_SECRET
│
└── Backend (.env)
    ├── DATABASE_URL
    ├── REDIS_URL
    ├── SECRET_KEY
    ├── JWT_SECRET
    ├── SMTP_HOST
    ├── SMTP_USER
    ├── SMTP_PASSWORD
    ├── AWS_ACCESS_KEY
    ├── AWS_SECRET_KEY
    └── S3_BUCKET
```

---

## 📦 Deployment Pipeline

### CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: |
          npm test
          pytest

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker Images
        run: |
          docker build -t athaarva-frontend ./Athaarva_Frontend
          docker build -t athaarva-backend ./Dev
      
      - name: Push to Registry
        run: |
          docker push registry/athaarva-frontend
          docker push registry/athaarva-backend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        run: |
          ssh deploy@server 'cd /app && docker-compose pull && docker-compose up -d'
```

---

## 📊 Monitoring & Logging

### Monitoring Stack

```
Monitoring Tools
├── Application Monitoring
│   ├── Sentry (Error tracking)
│   └── New Relic / Datadog (APM)
│
├── Infrastructure Monitoring
│   ├── Prometheus (Metrics)
│   └── Grafana (Dashboards)
│
├── Log Management
│   ├── Logstash / Fluentd
│   └── Elasticsearch
│
└── Uptime Monitoring
    └── UptimeRobot / Pingdom
```

### Key Metrics

```
Metrics to Track
├── Response time (P50, P95, P99)
├── Error rate
├── Request throughput
├── Database query time
├── Memory usage
├── CPU usage
├── Disk usage
└── Active connections
```

---

## 🔄 Backup Strategy

### Database Backups

```
Backup Configuration
├── Full backup: Daily at 2 AM
├── Incremental: Every 6 hours
├── Retention: 30 days
├── Storage: S3 (separate region)
└── Tested monthly
```

### Recovery Procedures

```
Recovery Plan
├── RTO (Recovery Time Objective): 4 hours
├── RPO (Recovery Point Objective): 6 hours
├── Failover: Manual to backup server
└── Documentation: Runbook maintained
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

```
Pre-Deployment Checklist
├── [ ] All tests passing
├── [ ] Environment variables set
├── [ ] SSL certificates valid
├── [ ] Database migrations ready
├── [ ] Backup taken
├── [ ] Rollback plan documented
└── [ ] Team notified
```

### Post-Deployment

```
Post-Deployment Checklist
├── [ ] Health checks passing
├── [ ] Error rates normal
├── [ ] Response times normal
├── [ ] Key flows tested
├── [ ] Monitoring alerts active
└── [ ] Documentation updated
```

---

## 📊 Implementation Status

| Component | Status | Priority |
|-----------|--------|----------|
| Domain Setup | ❌ Not Started | High |
| SSL Certificates | ❌ Not Started | High |
| Docker Configuration | ⏳ Partial | High |
| CI/CD Pipeline | ❌ Not Started | Medium |
| Monitoring | ❌ Not Started | Medium |
| Backup System | ❌ Not Started | High |
| Load Balancer | ❌ Not Started | Medium |

---

## 💡 Recommended Cloud Services

### Option 1: DigitalOcean (Budget)

```
DigitalOcean Setup
├── App Platform (Frontend + Backend)
├── Managed PostgreSQL
├── Managed Redis
├── Spaces (S3-compatible storage)
└── Estimated: $100-200/month
```

### Option 2: AWS (Scalable)

```
AWS Setup
├── EC2 / ECS (Compute)
├── RDS PostgreSQL
├── ElastiCache Redis
├── S3 (Storage)
├── CloudFront (CDN)
└── Estimated: $200-500/month
```

### Option 3: Hybrid

```
Hybrid Setup
├── Cloudflare (DNS + CDN)
├── Vercel (Frontend)
├── Railway / Render (Backend)
├── Managed PostgreSQL (Supabase/Neon)
└── Estimated: $50-150/month
```
