# ⚡ Pharmacy Reports - Quick Reference Guide

## 🎯 Quick Start

### Enable Auto-Refresh
```tsx
// Default 1-minute refresh
const reports = usePharmacyReports({
  autoRefresh: true,
  refreshInterval: 60000
});
```

### Toggle Auto-Refresh
```tsx
<Button onClick={reports.toggleAutoRefresh}>
  {reports.autoRefresh ? "Auto" : "Manual"}
</Button>
```

### Manual Refresh
```tsx
<Button onClick={reports.refresh} disabled={reports.isRefreshing}>
  Refresh
</Button>
```

---

## 🔧 Refresh Intervals

| Interval | Value | Use Case |
|----------|-------|----------|
| **30 seconds** | `30000` | Critical monitoring, high-traffic periods |
| **1 minute** | `60000` | Default balanced refresh |
| **5 minutes** | `300000` | Background monitoring |
| **Manual** | `null` | User-controlled refresh only |

---

## 📊 Available Data

### From `usePharmacyReports()`:

```typescript
const {
  // Data
  data,                    // All reports data
  inventoryItems,          // Raw inventory items
  liveStats,              // Live calculated stats
  
  // State
  isLoading,              // Initial load
  isRefreshing,           // Background refresh
  error,                  // Error object
  lastUpdated,            // Timestamp
  
  // Actions
  refresh,                // Manual refresh function
  setDateRange,           // Update date filter
  setRefreshInterval,     // Change interval
  toggleAutoRefresh,      // Toggle on/off
  
  // Config
  refreshInterval,        // Current interval
  autoRefresh,           // Is auto-refresh on?
} = usePharmacyReports();
```

---

## 🎨 Visual Components

### Loading Skeleton
```tsx
{isLoading ? (
  <StatCardSkeleton />
) : (
  <Card>{data}</Card>
)}
```

### Error Handling
```tsx
{error && (
  <Card className="border-red-200 bg-red-50">
    <AlertTriangle />
    <p>{error.message}</p>
    <Button onClick={refresh}>Retry</Button>
  </Card>
)}
```

### Live Badge
```tsx
{autoRefresh && (
  <Badge className="bg-green-50">
    <Activity className="animate-pulse" />
    Live
  </Badge>
)}
```

---

## 📡 API Endpoints

```
GET /pharmacy/reports                 → All reports data
GET /pharmacy/stock/summary          → Stock summary
GET /pharmacy/stats/monthly          → Monthly stats
GET /pharmacy/stock/categories       → Categories
GET /pharmacy/alerts/expiry          → Expiry alerts
GET /pharmacy/alerts/low-stock       → Low stock
GET /pharmacy/vendors/purchases      → Vendor data
GET /pharmacy/stock/movement         → Stock trends
GET /pharmacy/inventory/items        → All items
```

---

## 🔍 Data Structures

### Stock Summary
```typescript
{
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  expiredItems: number;
  expiringSoonItems: number;
  categoriesCount: number;
  avgStockLevel: number;
  reorderPoint: number;
}
```

### Monthly Stats
```typescript
{
  purchases: number;
  sales: number;
  returns: number;
  expired: number;
  profitMargin: number;
  turnoverRate: number;
  avgOrderValue: number;
  vendorsActive: number;
}
```

### Expiry Alert
```typescript
{
  id: string;
  medicineName: string;
  batchNo: string;
  expiryDate: string;
  qty: number;
  value: number;
  daysUntilExpiry: number;
  status: "expired" | "critical" | "warning";
}
```

### Low Stock Alert
```typescript
{
  id: string;
  medicineName: string;
  currentQty: number;
  reorderLevel: number;
  status: "critical" | "low" | "warning";
  lastPurchaseDate: string;
  avgDailySales: number;
  daysUntilStockout: number;
}
```

---

## 🎨 Status Colors

### Expiry Status
- `expired` → 🔴 Red
- `critical` → 🟠 Orange (< 30 days)
- `warning` → 🟡 Amber (30-90 days)
- `caution` → 🟢 Yellow (> 90 days)

### Low Stock Status
- `critical` → 🔴 Red (< 7 days stock)
- `low` → 🟠 Orange (< 14 days)
- `warning` → 🟡 Yellow (< 30 days)

---

## 🧪 Testing Commands

### Check Network Calls
```javascript
// Browser Console
performance.getEntriesByType("resource")
  .filter(r => r.name.includes("/pharmacy/"))
```

### Monitor Memory
```javascript
// Chrome DevTools → Performance Monitor
// Watch: JS heap size over time
```

### Verify Auto-Refresh
```javascript
// Should see new request every interval
setInterval(() => {
  console.log("Auto-refresh check:", new Date().toISOString());
}, 5000);
```

---

## 🚨 Common Issues

### Data Not Updating
**Check:** Browser console for 404/500 errors
**Fix:** Verify backend endpoints are running

### Auto-Refresh Stopped
**Check:** `autoRefresh` state in React DevTools
**Fix:** Click toggle button to re-enable

### Slow Performance
**Check:** Network tab for slow API calls
**Fix:** Increase refresh interval or optimize backend

### Memory Leak
**Check:** Chrome Performance Monitor
**Fix:** Ensure proper cleanup in useEffect hooks

---

## 📦 Export Functionality

### Export Report
```tsx
const handleExport = (type: string) => {
  // Types: "stock-summary", "expiry-alerts", 
  //        "low-stock", "vendor-purchases"
  handleExportReport(type);
};
```

### Excel File Format
```
Filename: {ReportType}_{YYYY-MM-DD}.xlsx
Sheet Name: Report type
Columns: Dynamic based on report type
```

---

## 🔐 Authentication

### Token Required
```typescript
// PharmacyService automatically adds:
Authorization: Bearer ${accessToken}

// Token stored in:
localStorage.getItem("accessToken")
```

---

## 🎯 Performance Tips

1. **Optimize Refresh Interval**
   - Use 1-minute for general monitoring
   - Use 30-second only for critical alerts
   - Use 5-minute for dashboard displays

2. **Reduce API Calls**
   - Use comprehensive endpoint `/pharmacy/reports`
   - Avoid calling individual endpoints simultaneously

3. **Lazy Load Tabs**
   - Only fetch data for active tab
   - Cache previous tab data

4. **Debounce User Actions**
   - Debounce manual refresh clicks
   - Throttle date range changes

---

## 🏁 Checklist

### Before Deployment
- [ ] Test auto-refresh with all intervals
- [ ] Verify error handling with offline mode
- [ ] Check loading states on slow 3G
- [ ] Test Excel exports for all report types
- [ ] Verify live badge animations
- [ ] Test manual refresh during auto-refresh
- [ ] Check memory usage after 10 minutes
- [ ] Verify TypeScript compilation
- [ ] Test on mobile responsive view
- [ ] Check accessibility with screen reader

### After Deployment
- [ ] Monitor API error rates
- [ ] Check average response times
- [ ] Verify auto-refresh doesn't cause server overload
- [ ] Monitor user engagement with reports
- [ ] Collect feedback on refresh intervals

---

## 📞 Support

### Files to Check
1. `lib/services/PharmacyService.ts` - API layer
2. `hooks/usePharmacyReports.ts` - Data hook
3. `app/pharmacy/reports/page.tsx` - UI component

### Debug Mode
```typescript
// Enable console logs in PharmacyService
console.log("Fetching pharmacy reports:", dateRange);
console.error("Error fetching pharmacy reports:", error);
```

### React DevTools
- Check `usePharmacyReports` state
- Verify `useEffect` dependencies
- Monitor component re-renders

---

**Last Updated:** March 2, 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
