// =============================================================================
// Pharmacy Inventory Management Types
// =============================================================================

// Pack options for medicines
export type PackType =
  | "3T"
  | "4T"
  | "10S"
  | "10T"
  | "15T"
  | "20T"
  | "30T"
  | "100ML"
  | "200ML"
  | "30ML"
  | "60ML"
  | "1*STAB"
  | "1*AMP"
  | "1*VIAL"
  | "5*VIAL"
  | "TUBE"
  | "BOTTLE"
  | "STRIP"
  | "BOX";

export const PACK_OPTIONS: PackType[] = [
  "3T",
  "4T",
  "10S",
  "10T",
  "15T",
  "20T",
  "30T",
  "100ML",
  "200ML",
  "30ML",
  "60ML",
  "1*STAB",
  "1*AMP",
  "1*VIAL",
  "5*VIAL",
  "TUBE",
  "BOTTLE",
  "STRIP",
  "BOX",
];

// GST tax rates
export type GSTRate = 0 | 5 | 12 | 18 | 28;

export const GST_OPTIONS: { value: GSTRate; label: string }[] = [
  { value: 0, label: "0% (Exempt)" },
  { value: 5, label: "5% (2.5% + 2.5%)" },
  { value: 12, label: "12% (6% + 6%)" },
  { value: 18, label: "18% (9% + 9%)" },
  { value: 28, label: "28% (14% + 14%)" },
];

// Vendor/Supplier interface
export interface Vendor {
  id: string;
  name: string;
  gstin?: string;
  phone?: string;
  email?: string;
  address?: string;
  drugLicenseNo?: string;
  createdAt: string;
}

// Medicine master data
export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  manufacturer?: string;
  category?: string;
  hsn: string;
  defaultPack: PackType;
  defaultGst: GSTRate;
  isControlled?: boolean;
  createdAt: string;
}

// Individual stock entry line item
export interface StockEntryItem {
  id: string;
  medicineId?: string;
  medicineName: string;
  hsn: string;
  batchNo: string;
  expiry: string; // Format: "MMM-YY" e.g., "Sep-26"
  expiryDate: Date; // Actual date for calculations
  pack: PackType;
  qty: number;
  freeQty: number;
  rate: number; // Purchase price per unit
  amount: number; // Auto-calculated: qty * rate
  discountPercent: number;
  gstPercent: GSTRate;
  netRate: number; // Auto-calculated: rate after discount and tax
  mrp: number;
  isExpiringSoon?: boolean; // If expiry < 6 months
  isExpired?: boolean;
}

// Invoice header data
export interface InvoiceHeader {
  vendorId: string;
  vendorName: string;
  invoiceNo: string;
  invoiceDate: Date;
  paymentTerms?: string;
  remarks?: string;
}

// Complete purchase invoice
export interface PurchaseInvoice {
  id: string;
  header: InvoiceHeader;
  items: StockEntryItem[];
  subtotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
  status: "draft" | "submitted" | "approved" | "cancelled";
  createdAt: string;
  createdBy: string;
}

// Form state for new entry
export interface StockEntryFormState {
  medicineName: string;
  medicineId?: string;
  hsn: string;
  batchNo: string;
  expiryMonth: number;
  expiryYear: number;
  pack: PackType;
  qty: number;
  freeQty: number;
  rate: number;
  discountPercent: number;
  gstPercent: GSTRate;
  mrp: number;
}

// Default form values
export const DEFAULT_FORM_STATE: StockEntryFormState = {
  medicineName: "",
  medicineId: undefined,
  hsn: "",
  batchNo: "",
  expiryMonth: new Date().getMonth() + 1,
  expiryYear: new Date().getFullYear() + 1,
  pack: "10T",
  qty: 0,
  freeQty: 0,
  rate: 0,
  discountPercent: 0,
  gstPercent: 12,
  mrp: 0,
};

// Totals breakdown
export interface InvoiceTotals {
  subtotal: number;
  totalItems: number;
  totalQty: number;
  totalDiscount: number;
  sgst: number;
  cgst: number;
  totalGst: number;
  grandTotal: number;
}

// Utility functions
export function calculateAmount(qty: number, rate: number): number {
  return parseFloat((qty * rate).toFixed(2));
}

export function calculateNetRate(
  rate: number,
  discountPercent: number,
  gstPercent: number
): number {
  const discountedRate = rate * (1 - discountPercent / 100);
  const netRate = discountedRate * (1 + gstPercent / 100);
  return parseFloat(netRate.toFixed(2));
}

export function calculateLineTotal(
  qty: number,
  rate: number,
  discountPercent: number,
  gstPercent: number
): {
  amount: number;
  discount: number;
  gst: number;
  netAmount: number;
} {
  const amount = qty * rate;
  const discount = amount * (discountPercent / 100);
  const taxableAmount = amount - discount;
  const gst = taxableAmount * (gstPercent / 100);
  const netAmount = taxableAmount + gst;

  return {
    amount: parseFloat(amount.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    gst: parseFloat(gst.toFixed(2)),
    netAmount: parseFloat(netAmount.toFixed(2)),
  };
}

export function formatExpiry(month: number, year: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const shortYear = year.toString().slice(-2);
  return `${months[month - 1]}-${shortYear}`;
}

export function parseExpiry(expiryStr: string): {
  month: number;
  year: number;
} {
  const months: Record<string, number> = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  const [monthStr, yearStr] = expiryStr.split("-");
  const month = months[monthStr] || 1;
  const year = 2000 + parseInt(yearStr, 10);
  return { month, year };
}

export function isExpiringSoon(
  expiryDate: Date,
  monthsThreshold: number = 6
): boolean {
  const now = new Date();
  const thresholdDate = new Date(
    now.getFullYear(),
    now.getMonth() + monthsThreshold,
    1
  );
  return expiryDate <= thresholdDate;
}

export function isExpired(expiryDate: Date): boolean {
  return expiryDate < new Date();
}

export function getExpiryDate(month: number, year: number): Date {
  // Set to last day of the month
  return new Date(year, month, 0);
}

// Currency formatter
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// Inventory Types
// =============================================================================

export interface InventoryItem {
  id: string;
  medicineId: string;
  medicineName: string;
  genericName?: string;
  manufacturer?: string;
  category?: string;
  hsn: string;
  batchNo: string;
  expiry: string;
  expiryDate: Date;
  pack: PackType;
  currentStock: number;
  reorderLevel: number;
  purchaseRate: number;
  mrp: number;
  gstPercent: GSTRate;
  vendorId?: string;
  vendorName?: string;
  location?: string;
  lastUpdated: string;
  status:
    | "in-stock"
    | "low-stock"
    | "out-of-stock"
    | "expiring-soon"
    | "expired";
}

export type InventoryFilter = {
  search: string;
  category: string;
  status: string;
  expiryRange: string;
  stockLevel: string;
};

// =============================================================================
// Returns Types
// =============================================================================

export type ReturnType = "vendor" | "expired" | "damaged" | "customer";
export type ReturnStatus = "pending" | "approved" | "completed" | "rejected";

export interface ReturnItem {
  id: string;
  medicineId: string;
  medicineName: string;
  batchNo: string;
  expiry: string;
  qty: number;
  rate: number;
  amount: number;
  reason: string;
}

export interface ReturnEntry {
  id: string;
  returnNo: string;
  returnType: ReturnType;
  returnDate: Date;
  vendorId?: string;
  vendorName?: string;
  items: ReturnItem[];
  totalAmount: number;
  status: ReturnStatus;
  remarks?: string;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
}

// =============================================================================
// Reports Types
// =============================================================================

export interface StockMovementReport {
  date: string;
  inward: number;
  outward: number;
  balance: number;
}

export interface ExpiryReport {
  medicine: string;
  batch: string;
  expiry: string;
  daysToExpiry: number;
  qty: number;
  value: number;
}

export interface VendorPurchaseReport {
  vendorId: string;
  vendorName: string;
  totalPurchases: number;
  totalAmount: number;
  lastPurchase: string;
}

export interface CategoryWiseStock {
  category: string;
  totalItems: number;
  totalValue: number;
  percentage: number;
}

// =============================================================================
// Settings Types
// =============================================================================

export interface PharmacySettings {
  lowStockThreshold: number;
  expiryAlertDays: number;
  defaultGstRate: GSTRate;
  defaultPaymentTerms: string;
  enableBatchTracking: boolean;
  enableExpiryAlerts: boolean;
  enableLowStockAlerts: boolean;
  reorderEmailEnabled: boolean;
  reorderEmailRecipients: string[];
  invoicePrefix: string;
  invoiceStartNumber: number;
  currency: string;
  taxCalculationMethod: "inclusive" | "exclusive";
  roundingMethod: "nearest" | "up" | "down";
}

export const DEFAULT_PHARMACY_SETTINGS: PharmacySettings = {
  lowStockThreshold: 50,
  expiryAlertDays: 90,
  defaultGstRate: 12,
  defaultPaymentTerms: "Net 30",
  enableBatchTracking: true,
  enableExpiryAlerts: true,
  enableLowStockAlerts: true,
  reorderEmailEnabled: false,
  reorderEmailRecipients: [],
  invoicePrefix: "INV-",
  invoiceStartNumber: 1001,
  currency: "INR",
  taxCalculationMethod: "exclusive",
  roundingMethod: "nearest",
};

// =============================================================================
// Stock Out / Dispensing Types
// =============================================================================

export type DispenseType = "patient" | "department" | "ot" | "ward" | "other";

export interface StockOutItem {
  id: string;
  medicineId: string;
  medicineName: string;
  genericName?: string;
  batchNo: string;
  expiry: string;
  expiryDate: Date;
  pack: PackType;
  availableQty: number;
  dispenseQty: number;
  rate: number; // Selling price / MRP
  amount: number;
  gstPercent: GSTRate;
  netAmount: number;
  discount?: number;
}

export interface StockOutEntry {
  id: string;
  dispenseNo: string;
  dispenseType: DispenseType;
  dispenseDate: Date;
  // For patient
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  // For department/ward
  departmentId?: string;
  departmentName?: string;
  // For doctor
  doctorId?: string;
  doctorName?: string;
  prescriptionNo?: string;
  // Items
  items: StockOutItem[];
  // Totals
  subtotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
  // Payment
  paymentMode: "cash" | "card" | "upi" | "credit" | "insurance";
  paymentStatus: "paid" | "pending" | "partial";
  amountPaid: number;
  amountDue: number;
  // Meta
  status: "draft" | "completed" | "cancelled";
  remarks?: string;
  createdAt: string;
  createdBy: string;
}

// Mock medicines with stock for dispensing
export const MOCK_MEDICINE_STOCK: Array<{
  id: string;
  medicineName: string;
  genericName: string;
  manufacturer: string;
  batchNo: string;
  expiry: string;
  expiryDate: Date;
  pack: PackType;
  availableQty: number;
  mrp: number;
  gstPercent: GSTRate;
}> = [
  {
    id: "med-001",
    medicineName: "Paracetamol 500mg",
    genericName: "Paracetamol",
    manufacturer: "Cipla Ltd",
    batchNo: "PCM2024A",
    expiry: "Dec-26",
    expiryDate: new Date(2026, 11, 31),
    pack: "10T",
    availableQty: 250,
    mrp: 25.5,
    gstPercent: 12,
  },
  {
    id: "med-002",
    medicineName: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    manufacturer: "Sun Pharma",
    batchNo: "AMX2024B",
    expiry: "Jun-26",
    expiryDate: new Date(2026, 5, 30),
    pack: "10T",
    availableQty: 180,
    mrp: 85.0,
    gstPercent: 12,
  },
  {
    id: "med-003",
    medicineName: "Omeprazole 20mg",
    genericName: "Omeprazole",
    manufacturer: "Dr. Reddy's",
    batchNo: "OMP2024C",
    expiry: "Mar-26",
    expiryDate: new Date(2026, 2, 31),
    pack: "15T",
    availableQty: 120,
    mrp: 65.0,
    gstPercent: 12,
  },
  {
    id: "med-004",
    medicineName: "Cetirizine 10mg",
    genericName: "Cetirizine",
    manufacturer: "Mankind Pharma",
    batchNo: "CTZ2024D",
    expiry: "Sep-26",
    expiryDate: new Date(2026, 8, 30),
    pack: "10T",
    availableQty: 300,
    mrp: 35.0,
    gstPercent: 12,
  },
  {
    id: "med-005",
    medicineName: "Metformin 500mg",
    genericName: "Metformin HCl",
    manufacturer: "USV Ltd",
    batchNo: "MET2024E",
    expiry: "Aug-26",
    expiryDate: new Date(2026, 7, 31),
    pack: "10T",
    availableQty: 200,
    mrp: 45.0,
    gstPercent: 5,
  },
  {
    id: "med-006",
    medicineName: "Azithromycin 500mg",
    genericName: "Azithromycin",
    manufacturer: "Zydus Cadila",
    batchNo: "AZT2024F",
    expiry: "Nov-26",
    expiryDate: new Date(2026, 10, 30),
    pack: "3T",
    availableQty: 90,
    mrp: 120.0,
    gstPercent: 12,
  },
  {
    id: "med-007",
    medicineName: "Pantoprazole 40mg",
    genericName: "Pantoprazole",
    manufacturer: "Alkem Labs",
    batchNo: "PAN2024G",
    expiry: "Jul-26",
    expiryDate: new Date(2026, 6, 31),
    pack: "10T",
    availableQty: 150,
    mrp: 95.0,
    gstPercent: 12,
  },
  {
    id: "med-008",
    medicineName: "Diclofenac Gel 30g",
    genericName: "Diclofenac",
    manufacturer: "Novartis",
    batchNo: "DCF2024H",
    expiry: "Feb-27",
    expiryDate: new Date(2027, 1, 28),
    pack: "TUBE",
    availableQty: 75,
    mrp: 85.0,
    gstPercent: 12,
  },
  {
    id: "med-009",
    medicineName: "Vitamin D3 60000IU",
    genericName: "Cholecalciferol",
    manufacturer: "Abbott",
    batchNo: "VTD2024I",
    expiry: "Apr-27",
    expiryDate: new Date(2027, 3, 30),
    pack: "4T",
    availableQty: 60,
    mrp: 150.0,
    gstPercent: 5,
  },
  {
    id: "med-010",
    medicineName: "Cough Syrup 100ml",
    genericName: "Dextromethorphan",
    manufacturer: "Pfizer",
    batchNo: "CSY2024J",
    expiry: "May-26",
    expiryDate: new Date(2026, 4, 31),
    pack: "100ML",
    availableQty: 45,
    mrp: 75.0,
    gstPercent: 12,
  },
];

// Mock departments for dispensing
export const MOCK_DEPARTMENTS = [
  { id: "dept-001", name: "Emergency Ward", code: "ER" },
  { id: "dept-002", name: "ICU", code: "ICU" },
  { id: "dept-003", name: "General Ward", code: "GW" },
  { id: "dept-004", name: "Pediatric Ward", code: "PED" },
  { id: "dept-005", name: "Operation Theatre", code: "OT" },
  { id: "dept-006", name: "Maternity Ward", code: "MAT" },
  { id: "dept-007", name: "Orthopedic Ward", code: "ORT" },
  { id: "dept-008", name: "Cardiology", code: "CAR" },
];

// Stock out form state
export interface StockOutFormState {
  dispenseType: DispenseType;
  patientName: string;
  patientPhone: string;
  departmentId: string;
  doctorName: string;
  prescriptionNo: string;
  remarks: string;
}

export const DEFAULT_STOCK_OUT_FORM: StockOutFormState = {
  dispenseType: "patient",
  patientName: "",
  patientPhone: "",
  departmentId: "",
  doctorName: "",
  prescriptionNo: "",
  remarks: "",
};
