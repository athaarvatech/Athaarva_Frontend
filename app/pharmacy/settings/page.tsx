"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  DollarSign,
  Package,
  Shield,
  Save,
  RefreshCw,
  AlertTriangle,
  Clock,
  Mail,
  FileText,
  Calculator,
  Building2,
  Check,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  PharmacySettings,
  DEFAULT_PHARMACY_SETTINGS,
  GSTRate,
  GST_OPTIONS,
} from "../types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<PharmacySettings>(
    DEFAULT_PHARMACY_SETTINGS
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_PHARMACY_SETTINGS);
  };

  const updateSetting = <K extends keyof PharmacySettings>(
    key: K,
    value: PharmacySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pharmacy Settings
          </h1>
          <p className="text-gray-600">
            Configure inventory management preferences
          </p>
        </div>
        <div className="flex gap-2">
          {savedMessage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg"
            >
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Settings saved!</span>
            </motion.div>
          )}
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 bg-healthcare-primary hover:bg-teal-700"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Shield className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-healthcare-primary" />
                Inventory Defaults
              </CardTitle>
              <CardDescription>
                Configure default values for inventory management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "lowStockThreshold",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="max-w-[120px]"
                    />
                    <span className="text-sm text-gray-500">units</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Alert when stock falls below this level
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryAlertDays">Expiry Alert Days</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="expiryAlertDays"
                      type="number"
                      value={settings.expiryAlertDays}
                      onChange={(e) =>
                        updateSetting(
                          "expiryAlertDays",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="max-w-[120px]"
                    />
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Alert before medicine expires
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultGst">Default GST Rate</Label>
                  <Select
                    value={settings.defaultGstRate.toString()}
                    onValueChange={(val) =>
                      updateSetting("defaultGstRate", parseInt(val) as GSTRate)
                    }
                  >
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GST_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value.toString()}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Default GST rate for new entries
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Default Payment Terms</Label>
                  <Select
                    value={settings.defaultPaymentTerms}
                    onValueChange={(val) =>
                      updateSetting("defaultPaymentTerms", val)
                    }
                  >
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="Net 7">Net 7 Days</SelectItem>
                      <SelectItem value="Net 15">Net 15 Days</SelectItem>
                      <SelectItem value="Net 30">Net 30 Days</SelectItem>
                      <SelectItem value="Net 45">Net 45 Days</SelectItem>
                      <SelectItem value="Net 60">Net 60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Default payment terms for vendors
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Feature Toggles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Batch Tracking</Label>
                      <p className="text-sm text-gray-500">
                        Enable batch-wise inventory tracking
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableBatchTracking}
                      onCheckedChange={(val) =>
                        updateSetting("enableBatchTracking", val)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Expiry Tracking</Label>
                      <p className="text-sm text-gray-500">
                        Track and alert expiry dates
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableExpiryAlerts}
                      onCheckedChange={(val) =>
                        updateSetting("enableExpiryAlerts", val)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Settings */}
        <TabsContent value="alerts" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-healthcare-primary" />
                Alert Preferences
              </CardTitle>
              <CardDescription>
                Configure when and how you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="space-y-0.5">
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when items fall below reorder level
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableLowStockAlerts}
                    onCheckedChange={(val) =>
                      updateSetting("enableLowStockAlerts", val)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="space-y-0.5">
                      <Label>Expiry Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified about medicines nearing expiry
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableExpiryAlerts}
                    onCheckedChange={(val) =>
                      updateSetting("enableExpiryAlerts", val)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Send reorder alerts via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.reorderEmailEnabled}
                    onCheckedChange={(val) =>
                      updateSetting("reorderEmailEnabled", val)
                    }
                  />
                </div>
              </div>

              {settings.reorderEmailEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label>Email Recipients</Label>
                  <Input
                    placeholder="Enter email addresses separated by commas"
                    value={settings.reorderEmailRecipients.join(", ")}
                    onChange={(e) =>
                      updateSetting(
                        "reorderEmailRecipients",
                        e.target.value.split(",").map((email) => email.trim())
                      )
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Multiple emails can be separated by commas
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-healthcare-primary" />
                Invoice Settings
              </CardTitle>
              <CardDescription>
                Configure invoice numbering and format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={settings.invoicePrefix}
                    onChange={(e) =>
                      updateSetting("invoicePrefix", e.target.value)
                    }
                    placeholder="INV-"
                    className="max-w-[200px]"
                  />
                  <p className="text-xs text-gray-500">
                    Prefix for invoice numbers (e.g., INV-, PO-)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceStart">Starting Number</Label>
                  <Input
                    id="invoiceStart"
                    type="number"
                    value={settings.invoiceStartNumber}
                    onChange={(e) =>
                      updateSetting(
                        "invoiceStartNumber",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="max-w-[200px]"
                  />
                  <p className="text-xs text-gray-500">
                    Starting number for new invoices
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Preview: </span>
                  <span className="font-mono text-healthcare-primary">
                    {settings.invoicePrefix}
                    {settings.invoiceStartNumber}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-healthcare-primary" />
                Tax & Calculation
              </CardTitle>
              <CardDescription>
                Configure tax calculation methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tax Calculation Method</Label>
                  <Select
                    value={settings.taxCalculationMethod}
                    onValueChange={(val: "inclusive" | "exclusive") =>
                      updateSetting("taxCalculationMethod", val)
                    }
                  >
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                      <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {settings.taxCalculationMethod === "exclusive"
                      ? "Tax will be added on top of the price"
                      : "Tax is included in the price"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Rounding Method</Label>
                  <Select
                    value={settings.roundingMethod}
                    onValueChange={(val: "nearest" | "up" | "down") =>
                      updateSetting("roundingMethod", val)
                    }
                  >
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nearest">Round to Nearest</SelectItem>
                      <SelectItem value="up">Round Up</SelectItem>
                      <SelectItem value="down">Round Down</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    How to round calculated amounts
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(val) => updateSetting("currency", val)}
                  >
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                      <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-healthcare-primary" />
                Vendor Settings
              </CardTitle>
              <CardDescription>
                Configure vendor management preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Payment Terms</Label>
                  <Select
                    value={settings.defaultPaymentTerms}
                    onValueChange={(val) =>
                      updateSetting("defaultPaymentTerms", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">
                        Immediate Payment
                      </SelectItem>
                      <SelectItem value="Net 7">Net 7 Days</SelectItem>
                      <SelectItem value="Net 15">Net 15 Days</SelectItem>
                      <SelectItem value="Net 30">Net 30 Days</SelectItem>
                      <SelectItem value="Net 45">Net 45 Days</SelectItem>
                      <SelectItem value="Net 60">Net 60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-healthcare-primary" />
                Data & Security
              </CardTitle>
              <CardDescription>
                Manage data and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export All Data</p>
                    <p className="text-sm text-gray-500">
                      Download all inventory data as Excel file
                    </p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Settings</p>
                    <p className="text-sm text-gray-500">Last backup: Never</p>
                  </div>
                  <Button variant="outline">Create Backup</Button>
                </div>
              </div>

              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Clear All Data</p>
                    <p className="text-sm text-red-600">
                      This action cannot be undone
                    </p>
                  </div>
                  <Button variant="destructive">Clear Data</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Configuration Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Low Stock Alert</p>
                  <p className="font-medium">
                    {settings.lowStockThreshold} units
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Expiry Alert</p>
                  <p className="font-medium">{settings.expiryAlertDays} days</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Default GST</p>
                  <p className="font-medium">{settings.defaultGstRate}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Tax Method</p>
                  <p className="font-medium capitalize">
                    {settings.taxCalculationMethod}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={settings.enableBatchTracking ? "default" : "outline"}
                >
                  Batch Tracking: {settings.enableBatchTracking ? "On" : "Off"}
                </Badge>
                <Badge
                  variant={settings.enableExpiryAlerts ? "default" : "outline"}
                >
                  Expiry Alerts: {settings.enableExpiryAlerts ? "On" : "Off"}
                </Badge>
                <Badge
                  variant={
                    settings.enableLowStockAlerts ? "default" : "outline"
                  }
                >
                  Low Stock Alerts:{" "}
                  {settings.enableLowStockAlerts ? "On" : "Off"}
                </Badge>
                <Badge
                  variant={settings.reorderEmailEnabled ? "default" : "outline"}
                >
                  Email Notifications:{" "}
                  {settings.reorderEmailEnabled ? "On" : "Off"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
