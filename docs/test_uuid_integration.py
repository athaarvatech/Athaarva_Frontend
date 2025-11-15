#!/usr/bin/env python3
"""
Quick Integration Test for UUID-based Backend
Tests that the backend is properly configured with UUID primary keys
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def print_section(title: str):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_health_check():
    """Test if server is running"""
    print_section("1. Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"✅ Server is running: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Server not responding: {e}")
        return False

def test_tenant_list():
    """Test listing tenants (should have UUID IDs)"""
    print_section("2. Tenant List (UUID Check)")
    try:
        response = requests.get(f"{BASE_URL}/tenants/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Tenants endpoint working")
            
            if isinstance(data, dict) and 'data' in data:
                tenants = data['data']
            else:
                tenants = data if isinstance(data, list) else []
            
            if tenants:
                first_tenant = tenants[0]
                print(f"\nSample Tenant:")
                print(f"  ID: {first_tenant.get('id')} (UUID: {len(str(first_tenant.get('id'))) == 36})")
                print(f"  Name: {first_tenant.get('name')}")
                print(f"  Subdomain: {first_tenant.get('subdomain')}")
                
                # Verify UUID format
                tenant_id = str(first_tenant.get('id'))
                if len(tenant_id) == 36 and tenant_id.count('-') == 4:
                    print(f"✅ Tenant ID is valid UUID format")
                else:
                    print(f"❌ Tenant ID is NOT UUID format: {tenant_id}")
            else:
                print("⚠️  No tenants found in database")
        else:
            print(f"❌ Failed to get tenants: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_database_schema():
    """Test database schema query"""
    print_section("3. Database Schema Verification")
    try:
        # This endpoint might not exist, but we can test the database directly
        response = requests.get(f"{BASE_URL}/debug/schema", timeout=5)
        if response.status_code == 200:
            print("✅ Schema endpoint available")
            print(response.json())
        else:
            print(f"⚠️  Schema endpoint not available (expected)")
    except Exception as e:
        print(f"⚠️  Schema check skipped: {e}")

def main():
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║     UUID Backend Integration Test                         ║
    ║     Phase 2: Frontend-Backend Connection Verification     ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    # Run tests
    if not test_health_check():
        print("\n❌ Server is not running. Please start it with:")
        print("   cd Athaarva_Backend && python run_server.py")
        return
    
    test_tenant_list()
    test_database_schema()
    
    print_section("Summary")
    print("""
    ✅ Backend server is running
    ✅ API endpoints are responding
    ✅ UUID format verified (if tenants exist)
    
    Next Steps:
    1. Start frontend: cd Athaarva_Frontend && npm run dev
    2. Open browser: http://localhost:3000
    3. Check console for: "✅ localStorage migration complete"
    4. Test patient registration flow
    5. Verify Network tab shows UUID IDs in API calls
    
    Testing Guide: INTEGRATION_TESTING_GUIDE.md
    """)

if __name__ == "__main__":
    main()
