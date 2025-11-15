# 🚨 DATABASE CONNECTION ISSUE - QUICK FIX

**Problem:** Can't connect to Supabase → `db.weeyegigbqdcfyvqlxzj.supabase.co` not reachable

**Most Likely Cause:** Your Supabase project is **PAUSED** 🛑

---

## ✅ TEMPORARY SOLUTION (Working NOW)

**Mock UUID Server:** ✅ Running on http://localhost:8000

You can test your frontend right now!

```bash
# Start frontend (in a new terminal)
cd /Users/vanshmehta/Documents/Projects_2025/Athaarva\ New/Athaarva_Frontend
npm run dev

# Open browser
open http://localhost:3000
```

---

## 🎯 PERMANENT FIX (Do This Now)

### Step 1: Check Supabase Dashboard

**Go to:** https://app.supabase.com

**Look for:** Project `weeyegigbqdcfyvqlxzj`

**Is it PAUSED?**

- ✅ Yes → Click "Resume" → Wait 3 minutes → Continue to Step 2
- ❌ No / Deleted → See "Option B" below

### Step 2: Test & Restart

```bash
# Test DNS (wait 3 min after resuming)
ping db.weeyegigbqdcfyvqlxzj.supabase.co

# If ping works:
# Stop mock server
lsof -ti:8000 | xargs kill -9

# Start real backend
cd /Users/vanshmehta/Documents/Projects_2025/Athaarva\ New/Athaarva_Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Test (should show "connected" not "mock")
curl http://localhost:8000/health
```

---

## 📋 If Project Was Deleted

### Option A: Quick Local Setup (No Supabase)

```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb athaarva_dev

# Update .env
cd Athaarva_Backend
# Change: DB_HOST=localhost, DB_SSLMODE=disable, DB_NAME=athaarva_dev

# Run migrations
psql athaarva_dev < migrations/athaarva.sql

# Start backend
uvicorn app.main:app --reload
```

### Option B: Create New Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Name: `athaarva-healthcare`
4. Create strong password (save it!)
5. Wait 2-3 minutes
6. Get connection details from Settings > Database
7. Update `.env` with new DB_HOST and DB_PASSWORD
8. Run migrations: `psql "connection-string" < migrations/athaarva.sql`

---

## 📚 Full Documentation

**Read these for details:**

- **ACTION_PLAN_DATABASE_FIX.md** ← Full guide
- **DATABASE_CONNECTION_FIX.md** ← Troubleshooting
- **START_HERE_TESTING.md** ← After database fixed

---

## ✅ What's Working Right Now

- ✅ Mock UUID API server (port 8000)
- ✅ Frontend can be tested
- ✅ UUID format validated
- ✅ CORS enabled

**Just test frontend with mock while you fix Supabase!** 🚀

---

## 🆘 Quick Help

**Check Supabase:** https://app.supabase.com  
**Test Mock API:** `curl http://localhost:8000/health`  
**Start Frontend:** `cd Athaarva_Frontend && npm run dev`

**After fixing database:**

1. Stop mock: `lsof -ti:8000 | xargs kill -9`
2. Start real backend: `uvicorn app.main:app --reload`
3. Continue Phase 2 testing!
