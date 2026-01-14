# 📸 Pharmacy Reports - Visual Guide

## 🎨 Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Reports & Analytics                    [Live Badge]            │
│  Comprehensive insights into your pharmacy inventory            │
│  • Updated 2m ago                                              │
│                                                                 │
│  [Timer: 1 minute ▼]  [Calendar: This Month ▼]                 │
│  [Auto Button]  [Refresh Button]                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│  📈 Monthly  │  💰 Monthly  │  📊 Profit   │  🏢 Active   │
│  Purchases   │  Sales       │  Margin      │  Vendors     │
│              │              │              │              │
│  ₹4,56,200   │  ₹6,12,800   │  25.6%       │  18          │
│  ↗ Live      │  ↗ Live      │  Turnover:   │  Avg Order:  │
│  updates     │  updates     │  3.2x        │  ₹1,250      │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [Overview] [Expiry Alerts (18)] [Low Stock (23)] [Vendors]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Stock Summary                                      [Export ⬇] │
│  Current inventory status and distribution                     │
│                                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┐                │
│  │ 📦 Total │ 💵 Total │ ⚠ Low    │ ⏰ Expiring│                │
│  │ Items    │ Value    │ Stock    │ Soon      │                │
│  │ 1,248    │ ₹8.9L    │ 23       │ 18        │                │
│  └──────────┴──────────┴──────────┴──────────┘                │
│                                                                 │
│  Category-wise Distribution                                     │
│                                                                 │
│  Antibiotics         245 items  ₹1,56,000  17.5%               │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░                      │
│                                                                 │
│  Pain Relief         189 items  ₹98,000   11.0%                │
│  ███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                      │
│                                                                 │
│  Cardiovascular      156 items  ₹2,34,000  26.2%               │
│  ██████████████████████████░░░░░░░░░░░░░░                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Animation Sequences

### 1. Page Load Animation
```
Time: 0.0s → Skeleton loaders appear
Time: 0.5s → API fetch begins
Time: 1.0s → First stat card fades in ✨
Time: 1.1s → Second stat card fades in ✨
Time: 1.2s → Third stat card fades in ✨
Time: 1.3s → Fourth stat card fades in ✨
Time: 1.5s → Tables populate with stagger effect
```

### 2. Auto-Refresh Animation
```
[Live Badge] → Pulses with green glow 💚
[Refresh Icon] → Spins 360° during fetch 🔄
[Last Updated] → Updates from "2m ago" → "0s ago"
[Stat Cards] → Smooth number transition
```

### 3. Manual Refresh
```
Click [Refresh] → Button text changes to "Refreshing..."
                → Icon spins
                → Cards fade out slightly
                → New data fades in
                → Button returns to "Refresh"
```

---

## 🎨 Color Scheme

### Stat Cards Gradients
```css
/* Purchases Card */
background: linear-gradient(to-br, #f0fdf4, #dcfce7);
border: #86efac;
text: #166534;

/* Sales Card */
background: linear-gradient(to-br, #eff6ff, #dbeafe);
border: #60a5fa;
text: #1e40af;

/* Profit Card */
background: linear-gradient(to-br, #faf5ff, #f3e8ff);
border: #c084fc;
text: #6b21a8;

/* Vendors Card */
background: linear-gradient(to-br, #fff7ed, #ffedd5);
border: #fb923c;
text: #c2410c;
```

### Status Badges
```css
/* Expired - Red */
bg: #fee2e2; text: #991b1b; border: #fecaca;

/* Critical - Orange */
bg: #ffedd5; text: #c2410c; border: #fed7aa;

/* Warning - Amber */
bg: #fef3c7; text: #92400e; border: #fde68a;

/* Caution - Yellow */
bg: #fef9c3; text: #854d0e; border: #fef08a;
```

---

## 📱 Responsive Layout

### Desktop (> 1024px)
```
┌────────────────────────────────────────────────────┐
│  Header                                            │
│  [4 Stat Cards in a row]                           │
│  [Full-width Tabs]                                 │
│  [Full-width Tables]                               │
└────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌─────────────────────────────────┐
│  Header                         │
│  [2x2 Stat Cards Grid]          │
│  [Full-width Tabs]              │
│  [Scrollable Tables]            │
└─────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│  Header          │
│  Controls Stack  │
│  [Stat Card 1]   │
│  [Stat Card 2]   │
│  [Stat Card 3]   │
│  [Stat Card 4]   │
│  [Tab Buttons]   │
│  [Table Scroll]  │
└──────────────────┘
```

---

## 🎯 Interactive Elements

### Refresh Interval Selector
```
┌─────────────────────┐
│ ⏱ 1 minute      ▼  │ ← Dropdown trigger
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ ⚡ 30 seconds       │ ← Fast refresh
│   1 minute          │ ← Default (selected)
│   5 minutes         │ ← Slow refresh
│   Manual            │ ← No auto-refresh
└─────────────────────┘
```

### Auto-Refresh Toggle
```
[Auto Button] ← Active (green, filled)
[Manual Button] ← Inactive (gray, outline)

Click to toggle:
[Manual Button] ← Now active
[Auto Button] ← Now inactive
```

### Date Range Selector
```
┌─────────────────────┐
│ 📅 This Month   ▼  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Today               │
│ This Week           │
│ This Month      ✓   │ ← Selected
│ Last Month          │
│ This Quarter        │
│ This Year           │
└─────────────────────┘
```

---

## 📊 Data Visualization Examples

### Category Progress Bars
```
Antibiotics (20.7%)
████████████████████░░░░░░░░░░░░░░░░░░░░  245 items  ₹5,89,600

Analgesics (16.0%)
████████████████░░░░░░░░░░░░░░░░░░░░░░░░  198 items  ₹4,56,200

Antidiabetics (14.0%)
██████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  156 items  ₹3,98,500
```

### Stock Movement Chart
```
Sep  In: ████████████░░░░░░░░  ₹1.25L
     Out: ██████████████░░░░░░  ₹1.45L  ↘ -₹20K

Oct  In: █████████████░░░░░░░  ₹1.45L
     Out: ███████████████░░░░░  ₹1.58L  ↘ -₹13K

Nov  In: ███████████████░░░░░  ₹1.68L
     Out: ████████████████░░░░  ₹1.72L  ↘ -₹4K

Dec  In: ████████████████░░░░  ₹1.89L
     Out: ████████████████░░░░  ₹1.95L  ↘ -₹6K

Jan  In: █████████████████░░░  ₹2.15L
     Out: ███████████████░░░░░  ₹1.98L  ↗ +₹17K

Feb  In: ██████████████░░░░░░  ₹1.78L
     Out: ████████████░░░░░░░░  ₹1.56L  ↗ +₹22K
```

---

## 🎭 State Transitions

### Loading State
```
Initial Load:
┌─────────────────┐
│ ▓▓▓▓▓░░░░░░░░░ │ ← Animated shimmer
│ ▓▓▓▓▓░░░░░░░░░ │
│ ▓▓▓▓░░░░░░░░░░ │
└─────────────────┘

Transitions to:
┌─────────────────┐
│ Monthly Sales   │
│ ₹6,12,800       │
│ ↗ Live updates  │
└─────────────────┘
```

### Error State
```
┌─────────────────────────────────────────┐
│ ⚠ Failed to load reports                │
│ Network error: Connection timeout       │
│                              [Retry] ← │
└─────────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────────┐
│                                         │
│           📦                            │
│                                         │
│     No expiry alerts at the moment      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Table Styling

### Expiry Alerts Table
```
┌─────────────┬─────────┬───────────┬──────────┬──────┬──────┬────────┐
│ Medicine    │ Batch   │ Expiry    │ Days     │ Qty  │ Value│ Status │
├─────────────┼─────────┼───────────┼──────────┼──────┼──────┼────────┤
│ Azithro...  │ AZI567  │ Dec-25    │ -10 days │  25  │ ₹2.4K│ 🔴 Exp │
│ Omeprazole  │ OMP456  │ Feb-26    │ 22 days  │ 120  │ ₹5.4K│ 🟠 Crit│
│ Amoxicillin │ AMX789  │ Mar-26    │ 51 days  │  45  │ ₹3.8K│ 🟡 Warn│
└─────────────┴─────────┴───────────┴──────────┴──────┴──────┴────────┘

Hover Effect:
Row background changes to light gray (#f9fafb)
```

### Low Stock Alerts Table
```
┌─────────────┬────────┬─────────┬───────────┬────────────┬─────────┬────────┐
│ Medicine    │ Stock  │ Reorder │ Stockout  │ Last Order │ Daily   │ Status │
├─────────────┼────────┼─────────┼───────────┼────────────┼─────────┼────────┤
│ Insulin...  │   8    │   50    │  2 days   │ 15-Jan-26  │  3.2    │ 🔴 Crit│
│ Salbutamol  │  15    │   40    │  7 days   │ 01-Feb-26  │  2.1    │ 🔴 Crit│
│ Clopidogrel │  28    │   60    │ 15 days   │ 28-Jan-26  │  1.8    │ 🟠 Low │
└─────────────┴────────┴─────────┴───────────┴────────────┴─────────┴────────┘
```

---

## 🎪 Live Features Visualization

### Live Badge
```
┌──────────────────────────────┐
│  Reports & Analytics  [Live] │ ← Pulsing green badge
│                         ●    │ ← Animated dot
└──────────────────────────────┘

Animation:
● → ◉ → ● → ◉ (0.5s interval)
```

### Refresh Icon States
```
Idle:      ↻        (Static)
Refreshing: ↻ → ↺ → ↻ (360° spin, 1s)
Complete:   ↻ ✓     (Checkmark briefly)
```

### Last Updated Text
```
Just updated:    "Updated 0s ago"
After 30 sec:    "Updated 30s ago"
After 2 min:     "Updated 2m ago"
After 1 hour:    "Updated 1h ago"
After 1 day:     "10:30 AM"
```

---

## 🎁 Export Preview

### Excel Export Button
```
┌─────────────────────┐
│  Stock Summary      │
│  ━━━━━━━━━━━━━━━━  │
│              [Export]│ ← Click triggers download
└─────────────────────┘

Generated File:
📄 Stock_Summary_2024-03-02.xlsx
   └─ Sheet: stock-summary
      ├─ Category | Items | Value | Percentage
      ├─ Antibiotics | 245 | ₹5,89,600 | 20.7%
      └─ ...
```

---

## 🎯 Focus States

### Keyboard Navigation
```
Tab Order:
1. Refresh Interval Selector
2. Date Range Selector
3. Auto-Refresh Toggle
4. Manual Refresh Button
5. Tab Navigation (Overview, Expiry, etc.)
6. Table rows (focusable)
7. Export buttons

Focus Indicator:
Blue outline (2px solid #3b82f6)
```

---

## 🌈 Dark Mode Ready (Future)

```css
/* Light Mode (Current) */
Background: #ffffff
Text: #111827
Cards: #f9fafb

/* Dark Mode (Future) */
Background: #111827
Text: #f9fafb
Cards: #1f2937
```

---

## 📐 Measurements

### Spacing
```
Card padding: 16px (p-4)
Card gap: 16px (gap-4)
Section spacing: 24px (space-y-6)
```

### Typography
```
Page Title: 24px (text-2xl), bold
Card Title: 16px (text-base), semibold
Card Value: 24px (text-2xl), bold
Body Text: 14px (text-sm), regular
```

### Icons
```
Large Icons: 40px (h-10 w-10)
Medium Icons: 16px (h-4 w-4)
Small Icons: 12px (h-3 w-3)
```

---

**Last Updated:** March 2, 2024  
**Design System:** Tailwind CSS + shadcn/ui  
**Animation Library:** Framer Motion
