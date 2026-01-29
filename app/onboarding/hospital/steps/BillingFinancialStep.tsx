"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Building2,
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Banknote,
  Receipt,
  Shield,
  Briefcase,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  TPAPanelData,
  CorporatePanelData,
} from "@/contexts/HospitalOnboardingContextV2";

function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card (Credit/Debit)" },
  { value: "upi", label: "UPI" },
  { value: "neft", label: "NEFT/RTGS" },
  { value: "cheque", label: "Cheque" },
  { value: "wallet", label: "Digital Wallet" },
];

const TPA_PANEL_TYPES = [
  { value: "tpa", label: "TPA (Third Party Administrator)" },
  { value: "insurance_direct", label: "Direct Insurance" },
  { value: "psu", label: "PSU / Government" },
  { value: "corporate", label: "Corporate Panel" },
  { value: "esi", label: "ESI" },
  { value: "cghs", label: "CGHS" },
  { value: "echs", label: "ECHS" },
];

const TARIFF_TYPES = [
  { value: "nabh", label: "NABH Tariff" },
  { value: "non_nabh", label: "Non-NABH Tariff" },
  { value: "custom", label: "Custom Tariff" },
];

export default function BillingFinancialStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [expandedTPA, setExpandedTPA] = useState<Set<string>>(new Set());
  const [expandedCorporate, setExpandedCorporate] = useState<Set<string>>(
    new Set()
  );

  const billing = data.billing;
  const tpaPanels = billing?.tpa_panels || [];
  const corporatePanels = billing?.corporate_panels || [];

  // Update billing config
  const updateBilling = (
    section: keyof typeof billing,
    updates: Record<string, unknown>
  ) => {
    const currentSection = billing?.[section];
    updateData("billing", {
      ...billing,
      [section]: {
        ...(typeof currentSection === "object" && currentSection !== null
          ? currentSection
          : {}),
        ...updates,
      },
    });
  };

  // TPA Panel operations
  const addTPAPanel = () => {
    const newPanel: TPAPanelData = {
      id: generateId(),
      panel_type: "tpa",
      name: "",
      code: "",
      contact_email: "",
      contact_phone: "",
      empanelment_date: "",
      discount_percentage: 0,
      credit_period_days: 30,
      tariff_type: "nabh",
      pre_auth_required: true,
      claim_submission_mode: "portal",
    };
    updateData("billing", {
      ...billing,
      tpa_panels: [...tpaPanels, newPanel],
    });
    setExpandedTPA((prev) => new Set(prev).add(newPanel.id));
  };

  const updateTPAPanel = (panelId: string, updates: Partial<TPAPanelData>) => {
    updateData("billing", {
      ...billing,
      tpa_panels: tpaPanels.map((p) =>
        p.id === panelId ? { ...p, ...updates } : p
      ),
    });
  };

  const removeTPAPanel = (panelId: string) => {
    updateData("billing", {
      ...billing,
      tpa_panels: tpaPanels.filter((p) => p.id !== panelId),
    });
  };

  // Corporate Panel operations
  const addCorporatePanel = () => {
    const newPanel: CorporatePanelData = {
      id: generateId(),
      company_name: "",
      billing_address: "",
      hr_contact_name: "",
      hr_contact_email: "",
      hr_contact_phone: "",
      discount_percentage: 0,
      credit_period_days: 30,
      services_covered: [],
      employee_verification_mode: "id_card",
    };
    updateData("billing", {
      ...billing,
      corporate_panels: [...corporatePanels, newPanel],
    });
    setExpandedCorporate((prev) => new Set(prev).add(newPanel.id));
  };

  const updateCorporatePanel = (
    panelId: string,
    updates: Partial<CorporatePanelData>
  ) => {
    updateData("billing", {
      ...billing,
      corporate_panels: corporatePanels.map((p) =>
        p.id === panelId ? { ...p, ...updates } : p
      ),
    });
  };

  const removeCorporatePanel = (panelId: string) => {
    updateData("billing", {
      ...billing,
      corporate_panels: corporatePanels.filter((p) => p.id !== panelId),
    });
  };

  const togglePaymentMode = (mode: string) => {
    const currentModes = billing?.payment_config?.accepted_payment_modes || [];
    const newModes = currentModes.includes(mode as never)
      ? currentModes.filter((m) => m !== mode)
      : [...currentModes, mode];
    updateBilling("payment_config", { accepted_payment_modes: newModes });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500/10 to-teal-100 border border-emerald-200 rounded-lg p-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Billing & Financial Configuration
            </h3>
            <p className="text-sm text-gray-600">
              Configure tax settings, payment modes, bank details, and insurance
              panels
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="tax" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tax">Tax & GST</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="panels">TPA & Corporate (Optional)</TabsTrigger>
        </TabsList>

        {/* Tax Configuration Tab */}
        <TabsContent value="tax" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h4 className="font-medium text-gray-900">GST Configuration</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">GST Registration Type *</Label>
                <Select
                  value={
                    billing?.tax_config?.gst_registration_type || "regular"
                  }
                  onValueChange={(v) =>
                    updateBilling("tax_config", { gst_registration_type: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="composition">
                      Composition Scheme
                    </SelectItem>
                    <SelectItem value="exempt">Exempt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Default GST Rate (%)</Label>
                <Input
                  type="number"
                  value={billing?.tax_config?.default_gst_rate || 18}
                  onChange={(e) =>
                    updateBilling("tax_config", {
                      default_gst_rate: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={0}
                  max={28}
                  step={0.5}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">TDS Applicable</Label>
                  <p className="text-xs text-gray-500">
                    Enable TDS deduction on payments
                  </p>
                </div>
                <Switch
                  checked={billing?.tax_config?.tds_applicable || false}
                  onCheckedChange={(v) =>
                    updateBilling("tax_config", { tds_applicable: v })
                  }
                />
              </div>

              {billing?.tax_config?.tds_applicable && (
                <div>
                  <Label className="text-sm">TDS Rate (%)</Label>
                  <Input
                    type="number"
                    value={billing?.tax_config?.tds_rate || 2}
                    onChange={(e) =>
                      updateBilling("tax_config", {
                        tds_rate: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1"
                    min={0}
                    max={20}
                    step={0.1}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Invoice Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Invoice Numbering</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">Invoice Prefix</Label>
                <Input
                  value={billing?.invoice_config?.invoice_prefix || ""}
                  onChange={(e) =>
                    updateBilling("invoice_config", {
                      invoice_prefix: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., INV"
                  className="mt-1"
                  maxLength={10}
                />
              </div>

              <div>
                <Label className="text-sm">Starting Number</Label>
                <Input
                  type="number"
                  value={billing?.invoice_config?.invoice_start_number || 1}
                  onChange={(e) =>
                    updateBilling("invoice_config", {
                      invoice_start_number: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={1}
                />
              </div>

              <div>
                <Label className="text-sm">Receipt Prefix</Label>
                <Input
                  value={billing?.invoice_config?.receipt_prefix || ""}
                  onChange={(e) =>
                    updateBilling("invoice_config", {
                      receipt_prefix: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., REC"
                  className="mt-1"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <Label className="text-xs">Auto Reset on FY</Label>
                <Switch
                  checked={billing?.invoice_config?.auto_reset_on_fy ?? true}
                  onCheckedChange={(v) =>
                    updateBilling("invoice_config", { auto_reset_on_fy: v })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <Label className="text-xs">QR on Invoice</Label>
                <Switch
                  checked={billing?.invoice_config?.qr_code_on_invoice ?? true}
                  onCheckedChange={(v) =>
                    updateBilling("invoice_config", { qr_code_on_invoice: v })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <Label className="text-xs">E-Invoice</Label>
                <Switch
                  checked={billing?.invoice_config?.e_invoice_enabled ?? false}
                  onCheckedChange={(v) =>
                    updateBilling("invoice_config", { e_invoice_enabled: v })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <Label className="text-xs">Digital Sign</Label>
                <Switch
                  checked={
                    billing?.invoice_config?.digital_signature_enabled ?? false
                  }
                  onCheckedChange={(v) =>
                    updateBilling("invoice_config", {
                      digital_signature_enabled: v,
                    })
                  }
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Payment Configuration Tab */}
        <TabsContent value="payment" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Banknote className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">
                Accepted Payment Modes
              </h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PAYMENT_MODES.map((mode) => (
                <div
                  key={mode.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    (
                      billing?.payment_config?.accepted_payment_modes || []
                    ).includes(mode.value as never)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-200"
                  }`}
                  onClick={() => togglePaymentMode(mode.value)}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(
                        billing?.payment_config?.accepted_payment_modes || []
                      ).includes(mode.value as never)}
                      onChange={() => togglePaymentMode(mode.value)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <Label className="text-sm">UPI ID (if applicable)</Label>
                <Input
                  value={billing?.payment_config?.upi_id || ""}
                  onChange={(e) =>
                    updateBilling("payment_config", { upi_id: e.target.value })
                  }
                  placeholder="e.g., hospital@upi"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">Payment Gateway</Label>
                <Select
                  value={billing?.payment_config?.payment_gateway || ""}
                  onValueChange={(v) =>
                    updateBilling("payment_config", { payment_gateway: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="paytm">Paytm</SelectItem>
                    <SelectItem value="phonepe">PhonePe</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">
                    Advance Payment Required
                  </Label>
                  <p className="text-xs text-gray-500">
                    Require deposit before admission
                  </p>
                </div>
                <Switch
                  checked={
                    billing?.payment_config?.advance_payment_required ?? false
                  }
                  onCheckedChange={(v) =>
                    updateBilling("payment_config", {
                      advance_payment_required: v,
                    })
                  }
                />
              </div>

              {billing?.payment_config?.advance_payment_required && (
                <div>
                  <Label className="text-sm">Advance Percentage (%)</Label>
                  <Input
                    type="number"
                    value={billing?.payment_config?.advance_percentage || 25}
                    onChange={(e) =>
                      updateBilling("payment_config", {
                        advance_percentage: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1"
                    min={0}
                    max={100}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Bank Details Tab */}
        <TabsContent value="bank" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">
                Primary Bank Account
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Bank Name *</Label>
                <Input
                  value={billing?.bank_details?.bank_name || ""}
                  onChange={(e) =>
                    updateBilling("bank_details", { bank_name: e.target.value })
                  }
                  placeholder="e.g., HDFC Bank"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">Branch Name *</Label>
                <Input
                  value={billing?.bank_details?.branch_name || ""}
                  onChange={(e) =>
                    updateBilling("bank_details", {
                      branch_name: e.target.value,
                    })
                  }
                  placeholder="e.g., Connaught Place Branch"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">Account Number *</Label>
                <Input
                  value={billing?.bank_details?.account_number || ""}
                  onChange={(e) =>
                    updateBilling("bank_details", {
                      account_number: e.target.value,
                    })
                  }
                  placeholder="Enter account number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">IFSC Code *</Label>
                <Input
                  value={billing?.bank_details?.ifsc_code || ""}
                  onChange={(e) =>
                    updateBilling("bank_details", {
                      ifsc_code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., HDFC0001234"
                  className="mt-1"
                  maxLength={11}
                />
              </div>

              <div>
                <Label className="text-sm">Beneficiary Name *</Label>
                <Input
                  value={billing?.bank_details?.beneficiary_name || ""}
                  onChange={(e) =>
                    updateBilling("bank_details", {
                      beneficiary_name: e.target.value,
                    })
                  }
                  placeholder="Account holder name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">Account Type *</Label>
                <Select
                  value={billing?.bank_details?.account_type || "current"}
                  onValueChange={(v) =>
                    updateBilling("bank_details", { account_type: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mt-4">
              <div>
                <Label className="text-sm font-medium">UPI Linked</Label>
                <p className="text-xs text-gray-500">
                  Is this account linked to UPI?
                </p>
              </div>
              <Switch
                checked={billing?.bank_details?.upi_linked ?? false}
                onCheckedChange={(v) =>
                  updateBilling("bank_details", { upi_linked: v })
                }
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* TPA & Corporate Panels Tab */}
        <TabsContent value="panels" className="space-y-4">
          {/* TPA Panels Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    TPA & Insurance Panels (Optional)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Configure empaneled TPAs and insurers - Skip if not applicable
                  </p>
                </div>
              </div>
              <Badge variant="outline">{tpaPanels.length} panels</Badge>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {tpaPanels.map((panel) => (
                  <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-3 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => {
                        setExpandedTPA((prev) => {
                          const next = new Set(prev);
                          if (next.has(panel.id)) {
                            next.delete(panel.id);
                          } else {
                            next.add(panel.id);
                          }
                          return next;
                        });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {expandedTPA.has(panel.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {panel.name || "New TPA Panel"}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {
                            TPA_PANEL_TYPES.find(
                              (t) => t.value === panel.panel_type
                            )?.label
                          }
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTPAPanel(panel.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <AnimatePresence>
                      {expandedTPA.has(panel.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-white border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs">Panel Type *</Label>
                              <Select
                                value={panel.panel_type}
                                onValueChange={(v) =>
                                  updateTPAPanel(panel.id, {
                                    panel_type: v as TPAPanelData["panel_type"],
                                  })
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TPA_PANEL_TYPES.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs">Panel Name *</Label>
                              <Input
                                value={panel.name}
                                onChange={(e) =>
                                  updateTPAPanel(panel.id, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., ICICI Lombard"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Panel Code *</Label>
                              <Input
                                value={panel.code}
                                onChange={(e) =>
                                  updateTPAPanel(panel.id, {
                                    code: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="e.g., ICICI"
                                className="mt-1"
                                maxLength={10}
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Contact Email</Label>
                              <Input
                                type="email"
                                value={panel.contact_email}
                                onChange={(e) =>
                                  updateTPAPanel(panel.id, {
                                    contact_email: e.target.value,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Contact Phone</Label>
                              <Input
                                value={panel.contact_phone}
                                onChange={(e) =>
                                  updateTPAPanel(panel.id, {
                                    contact_phone: e.target.value,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">
                                Empanelment Date
                              </Label>
                              <Input
                                type="date"
                                value={panel.empanelment_date}
                                onChange={(e) =>
                                  updateTPAPanel(panel.id, {
                                    empanelment_date: e.target.value,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Discount (%)</Label>
                              <Input
                                type="number"
                                value={panel.discount_percentage}
                                onChange={(e) =>
                                  updateTPAPanel(panel.id, {
                                    discount_percentage: parseFloat(
                                      e.target.value
                                    ),
                                  })
                                }
                                className="mt-1"
                                min={0}
                                max={100}
                              />
                            </div>

                            <div>
                              <Label className="text-xs">
                                Credit Period (Days)
                              </Label>
                              <Input
                                type="number"
                                value={panel.credit_period_days}
                                onChange={(e) =>
                                  updateTPAPanel(panel.id, {
                                    credit_period_days: parseInt(
                                      e.target.value
                                    ),
                                  })
                                }
                                className="mt-1"
                                min={0}
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Tariff Type</Label>
                              <Select
                                value={panel.tariff_type}
                                onValueChange={(v) =>
                                  updateTPAPanel(panel.id, {
                                    tariff_type:
                                      v as TPAPanelData["tariff_type"],
                                  })
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TARIFF_TYPES.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={panel.pre_auth_required}
                                onCheckedChange={(v) =>
                                  updateTPAPanel(panel.id, {
                                    pre_auth_required: v,
                                  })
                                }
                              />
                              <Label className="text-xs">
                                Pre-auth Required
                              </Label>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={addTPAPanel}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add TPA / Insurance Panel
              </Button>
            </div>
          </motion.div>

          {/* Corporate Panels Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Corporate Panels (Optional)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Configure corporate tie-ups - Skip if not applicable
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                {corporatePanels.length} corporates
              </Badge>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {corporatePanels.map((panel) => (
                  <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-3 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => {
                        setExpandedCorporate((prev) => {
                          const next = new Set(prev);
                          if (next.has(panel.id)) {
                            next.delete(panel.id);
                          } else {
                            next.add(panel.id);
                          }
                          return next;
                        });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {expandedCorporate.has(panel.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {panel.company_name || "New Corporate Panel"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCorporatePanel(panel.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <AnimatePresence>
                      {expandedCorporate.has(panel.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-white border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs">Company Name *</Label>
                              <Input
                                value={panel.company_name}
                                onChange={(e) =>
                                  updateCorporatePanel(panel.id, {
                                    company_name: e.target.value,
                                  })
                                }
                                placeholder="e.g., TCS"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Company GSTIN</Label>
                              <Input
                                value={panel.company_gstin || ""}
                                onChange={(e) =>
                                  updateCorporatePanel(panel.id, {
                                    company_gstin: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="e.g., 27AAACT2727Q1ZW"
                                className="mt-1"
                                maxLength={15}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Label className="text-xs">Billing Address</Label>
                              <Input
                                value={panel.billing_address}
                                onChange={(e) =>
                                  updateCorporatePanel(panel.id, {
                                    billing_address: e.target.value,
                                  })
                                }
                                placeholder="Complete billing address"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">HR Contact Name</Label>
                              <Input
                                value={panel.hr_contact_name}
                                onChange={(e) =>
                                  updateCorporatePanel(panel.id, {
                                    hr_contact_name: e.target.value,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">
                                HR Contact Email
                              </Label>
                              <Input
                                type="email"
                                value={panel.hr_contact_email}
                                onChange={(e) =>
                                  updateCorporatePanel(panel.id, {
                                    hr_contact_email: e.target.value,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Discount (%)</Label>
                              <Input
                                type="number"
                                value={panel.discount_percentage}
                                onChange={(e) =>
                                  updateCorporatePanel(panel.id, {
                                    discount_percentage: parseFloat(
                                      e.target.value
                                    ),
                                  })
                                }
                                className="mt-1"
                                min={0}
                                max={100}
                              />
                            </div>

                            <div>
                              <Label className="text-xs">
                                Credit Period (Days)
                              </Label>
                              <Input
                                type="number"
                                value={panel.credit_period_days}
                                onChange={(e) =>
                                  updateCorporatePanel(panel.id, {
                                    credit_period_days: parseInt(
                                      e.target.value
                                    ),
                                  })
                                }
                                className="mt-1"
                                min={0}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={addCorporatePanel}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Corporate Panel
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
