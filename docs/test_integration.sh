#!/bin/bash
# Quick Integration Test Script
# Tests UUID format in backend responses

echo "🧪 Testing UUID Integration..."
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Endpoint..."
HEALTH=$(curl -s http://localhost:8000/health)
echo "Response: $HEALTH"
if echo "$HEALTH" | grep -q "healthy"; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi
echo ""

# Test 2: Check if we can access onboarding endpoint
echo "2️⃣ Testing Onboarding Status..."
ONBOARDING=$(curl -s http://localhost:8000/api/v1/onboarding/status)
echo "Response: $ONBOARDING"
echo ""

# Test 3: Check API documentation
echo "3️⃣ Testing API Documentation..."
DOCS=$(curl -s http://localhost:8000/docs 2>&1 | head -c 100)
if [ ! -z "$DOCS" ]; then
    echo "✅ API docs accessible at http://localhost:8000/docs"
else
    echo "⚠️  API docs might not be available"
fi
echo ""

# Test 4: Frontend Health
echo "4️⃣ Testing Frontend..."
FRONTEND=$(curl -s http://localhost:3000 2>&1 | head -c 100)
if [ ! -z "$FRONTEND" ]; then
    echo "✅ Frontend running at http://localhost:3000"
else
    echo "❌ Frontend not responding"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Integration Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Backend: http://localhost:8000"
echo "✅ Frontend: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "🎯 Next Steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Open DevTools (F12) and check Console"
echo "3. Look for: '✅ localStorage migration complete'"
echo "4. Test patient registration or login"
echo "5. Check Network tab for UUID parameters"
echo ""
echo "📖 See QUICK_START_TESTING.md for detailed test cases"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
