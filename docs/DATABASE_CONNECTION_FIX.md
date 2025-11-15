# 🔧 Database Connection Issue - Fix Guide

**Date:** October 30, 2025  
**Issue:** Cannot connect to Supabase database  
**Error:** `could not translate host name "db.weeyegigbqdcfyvqlxzj.supabase.co" to address`

---

## 🔍 Problem Diagnosis

### Current Status

- ❌ DNS cannot resolve: `db.weeyegigbqdcfyvqlxzj.supabase.co`
- ✅ Internet connection is working
- ✅ Can reach Supabase main site (supabase.com)
- ❌ Cannot reach specific database host

### Possible Causes

1. **Supabase project is paused** (most likely)
2. Supabase project was deleted
3. Incorrect database hostname
4. Network/firewall blocking the connection
5. DNS propagation issue

---

## ✅ Solution Options

### Option 1: Check Supabase Project Status (RECOMMENDED)

**Steps:**

1. **Login to Supabase Dashboard**

   - Go to: https://app.supabase.com
   - Login with your account

2. **Check Project Status**

   - Look for your project: `weeyegigbqdcfyvqlxzj`
   - Check if it shows "PAUSED" or "INACTIVE"

3. **Restore/Resume Project**

   - If paused: Click "Restore" or "Resume"
   - Wait 2-3 minutes for DNS to propagate
   - Try connecting again

4. **Get Connection String**
   - Go to: Project Settings > Database
   - Copy the connection string
   - Update your `.env` file with the correct details

---

### Option 2: Use Local PostgreSQL (Development)

If you want to develop without Supabase, set up a local database:

**Install PostgreSQL:**

```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Or use Postgres.app
# Download from: https://postgresapp.com/
```

**Create Local Database:**

```bash
# Create database
createdb athaarva_dev

# Run migrations
cd Athaarva_Backend
psql athaarva_dev < migrations/athaarva.sql
```

**Update `.env` file:**

```bash
# Local PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres  # or your username
DB_PASSWORD=      # leave empty for local development
DB_NAME=athaarva_dev
DB_SSLMODE=disable  # ← Important for local!

# Rest of config stays the same...
```

---

### Option 3: Create New Supabase Project

If the project is deleted or you want a fresh start:

**Steps:**

1. **Go to Supabase Dashboard**

   - https://app.supabase.com

2. **Create New Project**

   - Click "New Project"
   - Choose organization
   - Name: `athaarva-healthcare` (or your choice)
   - Database Password: Create a strong password
   - Region: Choose closest to you
   - Click "Create new project"

3. **Wait for Setup** (2-3 minutes)

4. **Get Connection Details**

   - Go to: Project Settings > Database
   - Connection String section
   - Copy the details

5. **Update `.env` File**

```bash
# New Supabase Configuration
DB_HOST=db.xxxxxxxxxxxxx.supabase.co  # ← Your new host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-new-password  # ← Password you created
DB_NAME=postgres
DB_SSLMODE=require
```

6. **Run Database Migrations**

```bash
# Install psql (PostgreSQL client)
brew install postgresql@15

# Run migrations
cd Athaarva_Backend
psql "postgresql://postgres:your-password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres" < migrations/athaarva.sql

# Or use the migration script
python migrate_to_supabase.py
```

---

### Option 4: Use SQLite (Quick Test)

For quick testing without PostgreSQL setup:

**Create SQLite adapter** (app/db_sqlite.py):

```python
import sqlite3
from typing import Optional

db_connection: Optional[sqlite3.Connection] = None

def init_db_pool():
    global db_connection
    db_connection = sqlite3.connect('athaarva.db', check_same_thread=False)
    print("✅ SQLite database initialized")

def get_db_connection():
    return db_connection

def close_db_pool():
    if db_connection:
        db_connection.close()
```

**Update app/main.py:**

```python
# Change import
# from app.db import init_db_pool, close_db_pool
from app.db_sqlite import init_db_pool, close_db_pool
```

**Note:** SQLite is ONLY for quick testing. Use PostgreSQL for production!

---

## 🔧 Quick Fixes to Try

### Fix 1: Flush DNS Cache

```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Try connecting again
ping db.weeyegigbqdcfyvqlxzj.supabase.co
```

### Fix 2: Use Google DNS

```bash
# Add to /etc/hosts (temporary)
sudo sh -c 'echo "# Google DNS" >> /etc/hosts'

# Or change DNS settings:
# System Settings > Network > Wi-Fi > Details > DNS
# Add: 8.8.8.8, 8.8.4.4
```

### Fix 3: Test Direct IP (if you know it)

```bash
# Find Supabase IP (if available)
nslookup supabase.co

# Update .env to use IP instead of hostname
DB_HOST=xxx.xxx.xxx.xxx  # Direct IP
```

### Fix 4: Check Firewall

```bash
# Check if firewall is blocking
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Temporarily disable (test only!)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

---

## 🎯 Recommended Action Plan

### Immediate Steps (Next 10 minutes)

1. **Check Supabase Dashboard**

   - Login: https://app.supabase.com
   - Find project: `weeyegigbqdcfyvqlxzj`
   - Check status (Paused/Active/Deleted)

2. **If Paused:**

   - Resume the project
   - Wait 2-3 minutes
   - Test connection: `ping db.weeyegigbqdcfyvqlxzj.supabase.co`
   - Start backend: `uvicorn app.main:app --reload`

3. **If Deleted/Missing:**
   - Create new Supabase project
   - Run migrations to new database
   - Update `.env` with new credentials

### Development Setup (Next 30 minutes)

**For Local Development:**

```bash
# 1. Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# 2. Create database
createdb athaarva_dev

# 3. Run migrations
cd Athaarva_Backend
psql athaarva_dev < migrations/athaarva.sql

# 4. Update .env
# DB_HOST=localhost
# DB_SSLMODE=disable

# 5. Start backend
uvicorn app.main:app --reload
```

**For Supabase:**

```bash
# 1. Check/create Supabase project
# 2. Get connection details
# 3. Update .env
# 4. Run migrations
python migrate_to_supabase.py

# 5. Start backend
uvicorn app.main:app --reload
```

---

## 📊 Verification Steps

### Test 1: DNS Resolution

```bash
nslookup db.weeyegigbqdcfyvqlxzj.supabase.co

# Should return IP address
# If "No answer" → Project is paused/deleted
```

### Test 2: Network Connectivity

```bash
ping db.weeyegigbqdcfyvqlxzj.supabase.co

# Should get response
# If "Unknown host" → DNS issue
```

### Test 3: Database Connection

```bash
# Using psql
psql "postgresql://postgres:password@db.weeyegigbqdcfyvqlxzj.supabase.co:5432/postgres"

# Should connect successfully
# If fails → Check credentials
```

### Test 4: Backend Health

```bash
# Start backend
uvicorn app.main:app --reload

# In another terminal
curl http://localhost:8000/health

# Should return: {"status":"healthy","database":"connected"}
```

---

## 🆘 Still Not Working?

### Contact Information

- **Supabase Support:** https://supabase.com/support
- **Check Status:** https://status.supabase.com

### Alternative Database Options

1. **Supabase** (Recommended for production)
2. **Local PostgreSQL** (Good for development)
3. **Railway** (https://railway.app)
4. **Neon** (https://neon.tech)
5. **Amazon RDS** (AWS)

### Temporary Mock Server

If you need to test frontend without database:

```bash
cd Athaarva_Backend
python mock_api.py  # Simple mock server on port 8000
```

---

## 📝 Summary

**Most Likely Issue:** Supabase project is paused

**Quick Fix:**

1. Login to Supabase dashboard
2. Resume your project
3. Wait 2-3 minutes
4. Start backend server

**Alternative:**

- Set up local PostgreSQL for development
- Create new Supabase project

**Next Steps:**

- Check Supabase dashboard NOW
- Choose development setup (local or cloud)
- Update this document with your solution

---

## ✅ Once Fixed

After resolving the database connection:

1. **Test backend:**

   ```bash
   uvicorn app.main:app --reload
   curl http://localhost:8000/health
   ```

2. **Start frontend:**

   ```bash
   cd ../Athaarva_Frontend
   npm run dev
   ```

3. **Continue testing:**
   - Follow START_HERE_TESTING.md
   - Test UUID integration
   - Verify API endpoints

**Good luck! 🚀**
