import axios from "axios";
import { API_CONFIG, DEFAULT_HEADERS, REQUEST_TIMEOUT } from "../api-config";
import type { StockEntryItem } from "@/app/pharmacy/types";

// API Response Types
export interface StockSummary {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  expiredItems: number;
  expiringSoonItems: number;
  categoriesCount: number;
  avgStockLevel: number;
  reorderPoint: number;
}

export interface MonthlyStats {
  purchases: number;
  sales: number;
  returns: number;
  expired: number;
  profitMargin: number;
  turnoverRate: number;
  avgOrderValue: number;
  vendorsActive: number;
}

export interface CategoryStock {
  name: string;
  items: number;
  value: number;
  percentage: number;
}

export interface ExpiryAlert {
  id: string;
  medicineName: string;
  batchNo: string;
  expiryDate: string;
  qty: number;
  value: number;
  daysUntilExpiry: number;
  status: "expired" | "critical" | "warning";
}

export interface LowStockAlert {
  id: string;
  medicineName: string;
  currentQty: number;
  reorderLevel: number;
  status: "critical" | "low" | "warning";
  lastPurchaseDate: string;
  avgDailySales: number;
  daysUntilStockout: number;
}

export interface VendorPurchase {
  id: string;
  vendorName: string;
  totalPurchases: number;
  itemsSupplied: number;
  lastPurchase: string;
  creditBalance: number;
  paymentTerms: string;
  reliability: number; // 0-100%
}

export interface StockMovement {
  month: string;
  inward: number;
  outward: number;
  netMovement: number;
}

export interface PharmacyReportsData {
  stockSummary: StockSummary;
  monthlyStats: MonthlyStats;
  categoryWiseStock: CategoryStock[];
  expiryAlerts: ExpiryAlert[];
  lowStockAlerts: LowStockAlert[];
  vendorPurchases: VendorPurchase[];
  stockMovement: StockMovement[];
  lastUpdated: string;
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

/**
 * Pharmacy Service - Handles all pharmacy-related API calls
 */
class PharmacyServiceClass {
  private baseURL: string;
  
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Fetch comprehensive pharmacy reports data
   */
  async getReportsData(dateRange?: DateRangeFilter): Promise<PharmacyReportsData> {
    try {
      const params = dateRange ? {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
      } : {};

      const response = await axios.get<PharmacyReportsData>(`${this.baseURL}/pharmacy/reports`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
        params,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching pharmacy reports:", error);
      // Return mock data as fallback for development
      return this.getMockReportsData();
    }
  }

  /**
   * Fetch stock summary
   */
  async getStockSummary(): Promise<StockSummary> {
    try {
      const response = await axios.get<StockSummary>(`${this.baseURL}/pharmacy/stock/summary`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stock summary:", error);
      return this.getMockStockSummary();
    }
  }

  /**
   * Fetch monthly statistics
   */
  async getMonthlyStats(month?: string): Promise<MonthlyStats> {
    try {
      const params = month ? { month } : {};
      const response = await axios.get<MonthlyStats>(`${this.baseURL}/pharmacy/stats/monthly`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      return this.getMockMonthlyStats();
    }
  }

  /**
   * Fetch category-wise stock distribution
   */
  async getCategoryStock(): Promise<CategoryStock[]> {
    try {
      const response = await axios.get<CategoryStock[]>(`${this.baseURL}/pharmacy/stock/categories`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching category stock:", error);
      return this.getMockCategoryStock();
    }
  }

  /**
   * Fetch expiry alerts
   */
  async getExpiryAlerts(daysThreshold: number = 90): Promise<ExpiryAlert[]> {
    try {
      const response = await axios.get<ExpiryAlert[]>(`${this.baseURL}/pharmacy/alerts/expiry`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
        params: { days_threshold: daysThreshold },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching expiry alerts:", error);
      return this.getMockExpiryAlerts();
    }
  }

  /**
   * Fetch low stock alerts
   */
  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    try {
      const response = await axios.get<LowStockAlert[]>(`${this.baseURL}/pharmacy/alerts/low-stock`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
      return this.getMockLowStockAlerts();
    }
  }

  /**
   * Fetch vendor purchases data
   */
  async getVendorPurchases(dateRange?: DateRangeFilter): Promise<VendorPurchase[]> {
    try {
      const params = dateRange ? {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
      } : {};
      
      const response = await axios.get<VendorPurchase[]>(`${this.baseURL}/pharmacy/vendors/purchases`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching vendor purchases:", error);
      return this.getMockVendorPurchases();
    }
  }

  /**
   * Fetch stock movement data
   */
  async getStockMovement(months: number = 6): Promise<StockMovement[]> {
    try {
      const response = await axios.get<StockMovement[]>(`${this.baseURL}/pharmacy/stock/movement`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
        params: { months },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stock movement:", error);
      return this.getMockStockMovement();
    }
  }

  /**
   * Fetch all inventory items (for live stats calculation)
   */
  async getInventoryItems(): Promise<StockEntryItem[]> {
    try {
      const response = await axios.get<StockEntryItem[]>(`${this.baseURL}/pharmacy/inventory/items`, {
        headers: this.getAuthHeaders(),
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      return [];
    }
  }

  // ==================== MOCK DATA METHODS (for development) ====================

  private getMockReportsData(): PharmacyReportsData {
    return {
      stockSummary: this.getMockStockSummary(),
      monthlyStats: this.getMockMonthlyStats(),
      categoryWiseStock: this.getMockCategoryStock(),
      expiryAlerts: this.getMockExpiryAlerts(),
      lowStockAlerts: this.getMockLowStockAlerts(),
      vendorPurchases: this.getMockVendorPurchases(),
      stockMovement: this.getMockStockMovement(),
      lastUpdated: new Date().toISOString(),
    };
  }

  private getMockStockSummary(): StockSummary {
    return {
      totalItems: 1248,
      totalValue: 892450,
      lowStockItems: 23,
      expiredItems: 5,
      expiringSoonItems: 18,
      categoriesCount: 8,
      avgStockLevel: 156,
      reorderPoint: 50,
    };
  }

  private getMockMonthlyStats(): MonthlyStats {
    return {
      purchases: 245000,
      sales: 318000,
      returns: 12500,
      expired: 8200,
      profitMargin: 22.4,
      turnoverRate: 3.2,
      avgOrderValue: 1250,
      vendorsActive: 18,
    };
  }

  private getMockCategoryStock(): CategoryStock[] {
    return [
      { name: "Antibiotics", items: 245, value: 156000, percentage: 17.5 },
      { name: "Pain Relief", items: 189, value: 98000, percentage: 11.0 },
      { name: "Cardiovascular", items: 156, value: 234000, percentage: 26.2 },
      { name: "Diabetes Care", items: 134, value: 145000, percentage: 16.2 },
      { name: "Respiratory", items: 112, value: 87000, percentage: 9.8 },
      { name: "Vitamins", items: 198, value: 67000, percentage: 7.5 },
      { name: "Dermatology", items: 98, value: 56000, percentage: 6.3 },
      { name: "Others", items: 116, value: 49450, percentage: 5.5 },
    ];
  }

  private getMockExpiryAlerts(): ExpiryAlert[] {
    return [
      {
        id: "1",
        medicineName: "Amoxicillin 500mg",
        batchNo: "BX2401",
        expiryDate: "2024-02-15",
        qty: 48,
        value: 2400,
        daysUntilExpiry: -15,
        status: "expired",
      },
      {
        id: "2",
        medicineName: "Paracetamol 650mg",
        batchNo: "PC2402",
        expiryDate: "2024-03-20",
        qty: 120,
        value: 1200,
        daysUntilExpiry: 18,
        status: "critical",
      },
      {
        id: "3",
        medicineName: "Metformin 500mg",
        batchNo: "MT2403",
        expiryDate: "2024-04-10",
        qty: 89,
        value: 4450,
        daysUntilExpiry: 39,
        status: "warning",
      },
      {
        id: "4",
        medicineName: "Atorvastatin 10mg",
        batchNo: "AT2404",
        expiryDate: "2024-04-25",
        qty: 64,
        value: 6400,
        daysUntilExpiry: 54,
        status: "warning",
      },
      {
        id: "5",
        medicineName: "Omeprazole 20mg",
        batchNo: "OM2405",
        expiryDate: "2024-05-05",
        qty: 95,
        value: 2850,
        daysUntilExpiry: 64,
        status: "warning",
      },
    ];
  }

  private getMockLowStockAlerts(): LowStockAlert[] {
    return [
      {
        id: "1",
        medicineName: "Insulin Glargine 100IU",
        currentQty: 8,
        reorderLevel: 50,
        status: "critical",
        lastPurchaseDate: "2024-01-15",
        avgDailySales: 3.2,
        daysUntilStockout: 2,
      },
      {
        id: "2",
        medicineName: "Salbutamol Inhaler",
        currentQty: 15,
        reorderLevel: 40,
        status: "critical",
        lastPurchaseDate: "2024-02-01",
        avgDailySales: 2.1,
        daysUntilStockout: 7,
      },
      {
        id: "3",
        medicineName: "Clopidogrel 75mg",
        currentQty: 28,
        reorderLevel: 60,
        status: "low",
        lastPurchaseDate: "2024-01-28",
        avgDailySales: 1.8,
        daysUntilStockout: 15,
      },
      {
        id: "4",
        medicineName: "Levothyroxine 50mcg",
        currentQty: 35,
        reorderLevel: 50,
        status: "warning",
        lastPurchaseDate: "2024-02-05",
        avgDailySales: 1.5,
        daysUntilStockout: 23,
      },
      {
        id: "5",
        medicineName: "Amlodipine 5mg",
        currentQty: 42,
        reorderLevel: 60,
        status: "warning",
        lastPurchaseDate: "2024-02-10",
        avgDailySales: 1.2,
        daysUntilStockout: 35,
      },
    ];
  }

  private getMockVendorPurchases(): VendorPurchase[] {
    return [
      {
        id: "1",
        vendorName: "MedSupply India Pvt Ltd",
        totalPurchases: 145000,
        itemsSupplied: 45,
        lastPurchase: "2024-03-01",
        creditBalance: 25000,
        paymentTerms: "Net 30",
        reliability: 95,
      },
      {
        id: "2",
        vendorName: "PharmaTrade Solutions",
        totalPurchases: 98000,
        itemsSupplied: 32,
        lastPurchase: "2024-02-28",
        creditBalance: 15000,
        paymentTerms: "Net 45",
        reliability: 92,
      },
      {
        id: "3",
        vendorName: "Global Pharma Distributors",
        totalPurchases: 87500,
        itemsSupplied: 28,
        lastPurchase: "2024-02-25",
        creditBalance: 0,
        paymentTerms: "Immediate",
        reliability: 88,
      },
      {
        id: "4",
        vendorName: "HealthCare Suppliers Co",
        totalPurchases: 72000,
        itemsSupplied: 24,
        lastPurchase: "2024-02-20",
        creditBalance: 12000,
        paymentTerms: "Net 30",
        reliability: 85,
      },
      {
        id: "5",
        vendorName: "Medical Imports Ltd",
        totalPurchases: 56000,
        itemsSupplied: 18,
        lastPurchase: "2024-02-15",
        creditBalance: 8000,
        paymentTerms: "Net 60",
        reliability: 78,
      },
    ];
  }

  private getMockStockMovement(): StockMovement[] {
    return [
      { month: "Sep", inward: 245000, outward: 198000, netMovement: 47000 },
      { month: "Oct", inward: 268000, outward: 215000, netMovement: 53000 },
      { month: "Nov", inward: 234000, outward: 245000, netMovement: -11000 },
      { month: "Dec", inward: 289000, outward: 267000, netMovement: 22000 },
      { month: "Jan", inward: 256000, outward: 234000, netMovement: 22000 },
      { month: "Feb", inward: 278000, outward: 256000, netMovement: 22000 },
    ];
  }
}

// Export singleton instance
export const PharmacyService = new PharmacyServiceClass();
