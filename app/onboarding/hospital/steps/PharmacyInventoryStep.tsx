"use client";

import { motion } from "framer-motion";
import {
  Pill,
  Store,
  Package,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import type {
  StoreLocationData,
  InventoryCategoryData,
  StoreType,
} from "@/contexts/HospitalOnboardingContextV2";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const STORE_TYPES: { value: StoreType; label: string }[] = [
  { value: "main_store", label: "Main Store" },
  { value: "sub_store", label: "Sub Store" },
  { value: "opd_pharmacy", label: "OPD Pharmacy" },
  { value: "ipd_pharmacy", label: "IPD Pharmacy" },
  { value: "emergency_pharmacy", label: "Emergency Pharmacy" },
  { value: "night_pharmacy", label: "Night Pharmacy" },
  { value: "consignment_store", label: "Consignment Store" },
  { value: "return_store", label: "Return Store" },
];

export default function PharmacyInventoryStep() {
  const { data, updateData } = useHospitalOnboarding();
  const pharmacy = data.pharmacy;

  // ─────────────────────────────────────────────────────────────────────────────
  // License Handlers (using actual PharmacyLicense type properties)
  // ─────────────────────────────────────────────────────────────────────────────

  const updateLicense = (field: string, value: string) => {
    updateData("pharmacy", {
      ...pharmacy,
      license: {
        ...pharmacy.license,
        [field]: value,
      },
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Store Location Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const addStore = () => {
    const newStore: StoreLocationData = {
      id: `store_${Date.now()}`,
      name: "",
      code: "",
      type: "main_store",
      location_id: "",
      is_dispensing_point: true,
      is_billing_enabled: true,
      min_stock_days: 7,
      max_stock_days: 30,
      reorder_point_percentage: 20,
      auto_indent_enabled: false,
      fifo_mandatory: true,
    };
    updateData("pharmacy", {
      ...pharmacy,
      stores: [...pharmacy.stores, newStore],
    });
  };

  const updateStore = (
    storeId: string,
    field: keyof StoreLocationData,
    value: unknown
  ) => {
    updateData("pharmacy", {
      ...pharmacy,
      stores: pharmacy.stores.map((store: StoreLocationData) =>
        store.id === storeId ? { ...store, [field]: value } : store
      ),
    });
  };

  const removeStore = (storeId: string) => {
    updateData("pharmacy", {
      ...pharmacy,
      stores: pharmacy.stores.filter(
        (store: StoreLocationData) => store.id !== storeId
      ),
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Inventory Category Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const addCategory = () => {
    const newCategory: InventoryCategoryData = {
      id: `cat_${Date.now()}`,
      category_code: "",
      category_name: "",
      is_drug: true,
      is_consumable: false,
      is_surgical: false,
      is_implant: false,
      requires_batch_tracking: true,
      requires_expiry_tracking: true,
      requires_cold_chain: false,
      default_gst_rate: 12,
    };
    updateData("pharmacy", {
      ...pharmacy,
      inventory_categories: [...pharmacy.inventory_categories, newCategory],
    });
  };

  const updateCategory = (
    categoryId: string,
    field: keyof InventoryCategoryData,
    value: unknown
  ) => {
    updateData("pharmacy", {
      ...pharmacy,
      inventory_categories: pharmacy.inventory_categories.map(
        (cat: InventoryCategoryData) =>
          cat.id === categoryId ? { ...cat, [field]: value } : cat
      ),
    });
  };

  const removeCategory = (categoryId: string) => {
    updateData("pharmacy", {
      ...pharmacy,
      inventory_categories: pharmacy.inventory_categories.filter(
        (cat: InventoryCategoryData) => cat.id !== categoryId
      ),
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
          <Pill className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pharmacy & Inventory Configuration
          </h2>
          <p className="text-gray-600">
            Configure drug licensing, pharmacy stores, and inventory categories
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 1: Pharmacy License (using actual type properties)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Pharmacy License Details
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Drug License Number (Retail) */}
          <div className="space-y-2">
            <Label htmlFor="drug_license_number_retail">
              Drug License Number (Retail) *
            </Label>
            <Input
              id="drug_license_number_retail"
              value={pharmacy.license.drug_license_number_retail}
              onChange={(e) =>
                updateLicense("drug_license_number_retail", e.target.value)
              }
              placeholder="e.g., DL-20B-123456"
            />
            <p className="text-xs text-gray-500">
              Retail drug license number as per Drugs & Cosmetics Act
            </p>
          </div>

          {/* Drug License Number (Wholesale) */}
          <div className="space-y-2">
            <Label htmlFor="drug_license_number_wholesale">
              Drug License Number (Wholesale)
            </Label>
            <Input
              id="drug_license_number_wholesale"
              value={pharmacy.license.drug_license_number_wholesale || ""}
              onChange={(e) =>
                updateLicense("drug_license_number_wholesale", e.target.value)
              }
              placeholder="e.g., DL-21B-789012"
            />
            <p className="text-xs text-gray-500">
              Optional - Required only if you sell to other pharmacies
            </p>
          </div>

          {/* License Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="drug_license_expiry">
              Drug License Expiry Date *
            </Label>
            <Input
              id="drug_license_expiry"
              type="date"
              value={pharmacy.license.drug_license_expiry}
              onChange={(e) =>
                updateLicense("drug_license_expiry", e.target.value)
              }
            />
          </div>

          {/* Pharmacist Registration */}
          <div className="space-y-2">
            <Label htmlFor="pharmacist_registration_number">
              Pharmacist Registration Number *
            </Label>
            <Input
              id="pharmacist_registration_number"
              value={pharmacy.license.pharmacist_registration_number}
              onChange={(e) =>
                updateLicense("pharmacist_registration_number", e.target.value)
              }
              placeholder="State Pharmacy Council Registration"
            />
          </div>

          {/* Pharmacist Name */}
          <div className="space-y-2">
            <Label htmlFor="pharmacist_name">
              Registered Pharmacist Name *
            </Label>
            <Input
              id="pharmacist_name"
              value={pharmacy.license.pharmacist_name}
              onChange={(e) => updateLicense("pharmacist_name", e.target.value)}
              placeholder="Full name as per registration"
            />
          </div>

          {/* Narcotic License Number */}
          <div className="space-y-2">
            <Label htmlFor="narcotic_license_number">
              Narcotic License Number
            </Label>
            <Input
              id="narcotic_license_number"
              value={pharmacy.license.narcotic_license_number || ""}
              onChange={(e) =>
                updateLicense("narcotic_license_number", e.target.value)
              }
              placeholder="Required for controlled substances"
            />
          </div>

          {/* Narcotic License Expiry */}
          <div className="space-y-2">
            <Label htmlFor="narcotic_license_expiry">
              Narcotic License Expiry
            </Label>
            <Input
              id="narcotic_license_expiry"
              type="date"
              value={pharmacy.license.narcotic_license_expiry || ""}
              onChange={(e) =>
                updateLicense("narcotic_license_expiry", e.target.value)
              }
            />
          </div>

          {/* FSSAI License */}
          <div className="space-y-2">
            <Label htmlFor="fssai_license_number">FSSAI License Number</Label>
            <Input
              id="fssai_license_number"
              value={pharmacy.license.fssai_license_number || ""}
              onChange={(e) =>
                updateLicense("fssai_license_number", e.target.value)
              }
              placeholder="For food supplements & nutraceuticals"
            />
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 2: Pharmacy Store Locations
      ═══════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Pharmacy Store Locations
            </h3>
          </div>
          <Button
            onClick={addStore}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Store
          </Button>
        </div>

        {pharmacy.stores.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              No pharmacy stores configured yet.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add at least one store location to manage pharmacy operations.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pharmacy.stores.map((store: StoreLocationData, index: number) => (
              <div
                key={store.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-gray-700">
                      Store {index + 1}
                      {store.name && `: ${store.name}`}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStore(store.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Store Name */}
                  <div className="space-y-2">
                    <Label>Store Name *</Label>
                    <Input
                      value={store.name}
                      onChange={(e) =>
                        updateStore(store.id, "name", e.target.value)
                      }
                      placeholder="e.g., Main Pharmacy, OPD Pharmacy"
                    />
                  </div>

                  {/* Store Code */}
                  <div className="space-y-2">
                    <Label>Store Code *</Label>
                    <Input
                      value={store.code}
                      onChange={(e) =>
                        updateStore(
                          store.id,
                          "code",
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="e.g., MAIN, OPD"
                      maxLength={10}
                    />
                  </div>

                  {/* Store Type */}
                  <div className="space-y-2">
                    <Label>Store Type *</Label>
                    <Select
                      value={store.type}
                      onValueChange={(value) =>
                        updateStore(store.id, "type", value as StoreType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STORE_TYPES.map((st) => (
                          <SelectItem key={st.value} value={st.value}>
                            {st.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location ID */}
                  <div className="space-y-2">
                    <Label>Location ID</Label>
                    <Input
                      value={store.location_id}
                      onChange={(e) =>
                        updateStore(store.id, "location_id", e.target.value)
                      }
                      placeholder="Link to hospital location"
                    />
                  </div>

                  {/* Min Stock Days */}
                  <div className="space-y-2">
                    <Label>Min Stock Days</Label>
                    <Input
                      type="number"
                      min={1}
                      value={store.min_stock_days}
                      onChange={(e) =>
                        updateStore(
                          store.id,
                          "min_stock_days",
                          parseInt(e.target.value) || 7
                        )
                      }
                    />
                  </div>

                  {/* Max Stock Days */}
                  <div className="space-y-2">
                    <Label>Max Stock Days</Label>
                    <Input
                      type="number"
                      min={1}
                      value={store.max_stock_days}
                      onChange={(e) =>
                        updateStore(
                          store.id,
                          "max_stock_days",
                          parseInt(e.target.value) || 30
                        )
                      }
                    />
                  </div>

                  {/* Reorder Point Percentage */}
                  <div className="space-y-2">
                    <Label>Reorder Point (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={store.reorder_point_percentage}
                      onChange={(e) =>
                        updateStore(
                          store.id,
                          "reorder_point_percentage",
                          parseInt(e.target.value) || 20
                        )
                      }
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={store.is_dispensing_point}
                        onCheckedChange={(checked) =>
                          updateStore(store.id, "is_dispensing_point", checked)
                        }
                      />
                      <Label className="text-sm">Dispensing Point</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={store.is_billing_enabled}
                        onCheckedChange={(checked) =>
                          updateStore(store.id, "is_billing_enabled", checked)
                        }
                      />
                      <Label className="text-sm">Billing Enabled</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={store.auto_indent_enabled}
                        onCheckedChange={(checked) =>
                          updateStore(store.id, "auto_indent_enabled", checked)
                        }
                      />
                      <Label className="text-sm">Auto Indent</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={store.fifo_mandatory}
                        onCheckedChange={(checked) =>
                          updateStore(store.id, "fifo_mandatory", checked)
                        }
                      />
                      <Label className="text-sm">FIFO Mandatory</Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 3: Inventory Categories
      ═══════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory Categories
            </h3>
          </div>
          <Button
            onClick={addCategory}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 p-4">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              Configure inventory categories to organize your pharmacy stock.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Common categories: Drugs, Consumables, Surgical Items, Implants,
              etc.
            </p>
          </div>
        </div>

        {pharmacy.inventory_categories.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              No inventory categories configured yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pharmacy.inventory_categories.map(
              (category: InventoryCategoryData, index: number) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Category {index + 1}
                      {category.category_name && `: ${category.category_name}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(category.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Category Name */}
                    <div className="space-y-2">
                      <Label>Category Name *</Label>
                      <Input
                        value={category.category_name}
                        onChange={(e) =>
                          updateCategory(
                            category.id,
                            "category_name",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Tablets, Injectables"
                      />
                    </div>

                    {/* Category Code */}
                    <div className="space-y-2">
                      <Label>Category Code *</Label>
                      <Input
                        value={category.category_code}
                        onChange={(e) =>
                          updateCategory(
                            category.id,
                            "category_code",
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="e.g., TAB, INJ"
                        maxLength={10}
                      />
                    </div>

                    {/* Default GST Rate */}
                    <div className="space-y-2">
                      <Label>Default GST Rate (%)</Label>
                      <Select
                        value={String(category.default_gst_rate)}
                        onValueChange={(value) =>
                          updateCategory(
                            category.id,
                            "default_gst_rate",
                            parseFloat(value)
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% (Exempt)</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="12">12%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                          <SelectItem value="28">28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Margin Percentage */}
                    <div className="space-y-2">
                      <Label>Margin Percentage</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={category.margin_percentage || ""}
                        onChange={(e) =>
                          updateCategory(
                            category.id,
                            "margin_percentage",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        placeholder="e.g., 15"
                      />
                    </div>

                    {/* Category Type Toggles */}
                    <div className="flex flex-wrap items-center gap-4 md:col-span-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_drug}
                          onCheckedChange={(checked) =>
                            updateCategory(category.id, "is_drug", checked)
                          }
                        />
                        <Label className="text-sm">Drug</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_consumable}
                          onCheckedChange={(checked) =>
                            updateCategory(
                              category.id,
                              "is_consumable",
                              checked
                            )
                          }
                        />
                        <Label className="text-sm">Consumable</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_surgical}
                          onCheckedChange={(checked) =>
                            updateCategory(category.id, "is_surgical", checked)
                          }
                        />
                        <Label className="text-sm">Surgical</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_implant}
                          onCheckedChange={(checked) =>
                            updateCategory(category.id, "is_implant", checked)
                          }
                        />
                        <Label className="text-sm">Implant</Label>
                      </div>
                    </div>

                    {/* Tracking Requirements */}
                    <div className="flex flex-wrap items-center gap-4 md:col-span-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.requires_batch_tracking}
                          onCheckedChange={(checked) =>
                            updateCategory(
                              category.id,
                              "requires_batch_tracking",
                              checked
                            )
                          }
                        />
                        <Label className="text-sm">Batch Tracking</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.requires_expiry_tracking}
                          onCheckedChange={(checked) =>
                            updateCategory(
                              category.id,
                              "requires_expiry_tracking",
                              checked
                            )
                          }
                        />
                        <Label className="text-sm">Expiry Tracking</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.requires_cold_chain}
                          onCheckedChange={(checked) =>
                            updateCategory(
                              category.id,
                              "requires_cold_chain",
                              checked
                            )
                          }
                        />
                        <Label className="text-sm">Cold Chain</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
