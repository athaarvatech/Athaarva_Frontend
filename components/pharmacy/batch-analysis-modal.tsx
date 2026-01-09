"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  DollarSign, 
  TrendingDown, 
  Mail, 
  Tag, 
  FileDown, 
  Trash2,
  RefreshCcw,
  Percent,
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  PackageX,
  AlertTriangle,
  TrendingUp,
  Package,
  Zap,
  Star,
  ThumbsDown,
  Gift,
  Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PharmacyStats } from "@/hooks/usePharmacyStats";
import { toast } from "sonner";

interface BatchAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: PharmacyStats;
}

export function BatchAnalysisModal({ open, onOpenChange, stats }: BatchAnalysisModalProps) {
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [processingAction, setProcessingAction] = useState(false);
  const [discountSliders, setDiscountSliders] = useState<Record<string, number>>({});

  const criticalBatches = stats.batchesNeedingAction.filter(b => b.urgency === "critical");
  const urgentBatches = stats.batchesNeedingAction.filter(b => b.urgency === "urgent" || b.urgency === "high");
  const warningBatches = stats.batchesNeedingAction.filter(b => b.urgency === "warning" || b.urgency === "medium");

  // Mock supplier data (in real app, this would come from API)
  const supplierData: Record<string, { name: string; rating: string; issues: number; reliability: number }> = {
    default: { name: "MedSupply Co.", rating: "B", issues: 2, reliability: 75 },
  };

  // Calculate financial impact
  const calculateFinancialImpact = () => {
    const criticalLoss = criticalBatches.length * 15000;
    const urgentLoss = urgentBatches.length * 8000;
    const warningLoss = warningBatches.length * 3000;
    return criticalLoss + urgentLoss + warningLoss;
  };

  const totalLoss = calculateFinancialImpact();

  // Calculate days until expiry (mock)
  const getDaysUntilExpiry = (batch: typeof stats.batchesNeedingAction[0]) => {
    if (batch.urgency === "critical") return Math.floor(Math.random() * 15) + 1;
    if (batch.urgency === "urgent" || batch.urgency === "high") return Math.floor(Math.random() * 60) + 15;
    return Math.floor(Math.random() * 90) + 60;
  };

  // AI Pricing calculation
  const calculateClearanceTime = (batchNo: string, discount: number) => {
    const baseVelocity = 5; // units per day
    const velocityMultiplier = 1 + (discount / 20); // 20% discount = 2x velocity
    const adjustedVelocity = baseVelocity * velocityMultiplier;
    const estimatedDays = Math.ceil(50 / adjustedVelocity); // assuming 50 units in batch
    return estimatedDays;
  };

  // Smart bundling suggestions
  const getBundleSuggestions = (medicineName: string) => {
    const bundles: Record<string, string[]> = {
      "Vitamin C": ["Paracetamol 500mg", "Zinc Tablets"],
      "Amoxicillin": ["Probiotic Capsules", "Vitamin B Complex"],
      "Omeprazole": ["Antacid Tablets", "Digestive Enzymes"],
    };
    return bundles[medicineName] || ["Paracetamol 500mg", "Multivitamin"];
  };

  const toggleBatchSelection = (batchNo: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchNo) ? prev.filter(b => b !== batchNo) : [...prev, batchNo]
    );
  };

  const selectAllByType = (urgency: string) => {
    const batches = stats.batchesNeedingAction
      .filter(b => b.urgency === urgency)
      .map(b => b.batchNo);
    setSelectedBatches(prev => [...new Set([...prev, ...batches])]);
  };

  const clearSelection = () => setSelectedBatches([]);

  const handleBulkAction = async (action: string) => {
    if (selectedBatches.length === 0) {
      toast.error("No batches selected", {
        description: "Please select at least one batch to perform this action."
      });
      return;
    }

    setProcessingAction(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const actionLabels: Record<string, string> = {
      discount: "Discount Applied",
      return: "Return Initiated",
      remove: "Marked for Removal"
    };
    
    toast.success(actionLabels[action] || "Action Completed", {
      description: `${selectedBatches.length} batch(es) processed successfully.`,
      action: {
        label: "View Inventory",
        onClick: () => window.location.href = "/pharmacy/stock-entry"
      }
    });
    
    setSelectedBatches([]);
    setProcessingAction(false);
  };

  const generateEmailTemplate = (batch: typeof stats.batchesNeedingAction[0]) => {
    const supplier = supplierData.default;
    const template = `Subject: Batch Return Request - ${batch.batchNo}

Dear ${supplier.name} Team,

We need to initiate a return for the following batch:

Medicine: ${batch.medicineName}
Batch Number: ${batch.batchNo}
Reason: ${batch.reason}
Urgency: ${batch.urgency.toUpperCase()}

Supplier Performance Note: This is issue #${supplier.issues + 1} this quarter.

Please confirm the return procedure and provide an RMA number at your earliest convenience.

Best regards,
Athaarva Healthcare Pharmacy Team
Phone: +91-XXXXXXXXXX
Email: pharmacy@athaarva.com`;

    navigator.clipboard.writeText(template);
    toast.success("Email template copied!", {
      description: "Paste into your email client and send to supplier",
      icon: <Copy className="h-4 w-4" />
    });
  };

  const generateDiscountCampaign = (batch: typeof stats.batchesNeedingAction[0]) => {
    const discount = discountSliders[batch.batchNo] || 30;
    const campaign = {
      medicineName: batch.medicineName,
      batchNo: batch.batchNo,
      discount: `${discount}% OFF`,
      promoCode: `CLEAR${batch.batchNo.slice(-4)}`,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    const campaignText = `🏷️ CLEARANCE SALE

${campaign.medicineName}
${campaign.discount} - Code: ${campaign.promoCode}
Valid Until: ${campaign.validUntil}

Limited Stock - First Come First Served!`;

    navigator.clipboard.writeText(campaignText);
    
    toast.success("Campaign created!", {
      description: `${campaign.discount} discount - Code: ${campaign.promoCode}`,
      action: {
        label: "Copy Campaign",
        onClick: () => navigator.clipboard.writeText(campaignText)
      }
    });
  };

  const createBundle = (batch: typeof stats.batchesNeedingAction[0]) => {
    const suggestions = getBundleSuggestions(batch.medicineName);
    toast.success("Bundle suggestion created!", {
      description: `Pair ${batch.medicineName} with ${suggestions[0]}`,
      action: {
        label: "Create Bundle",
        onClick: () => toast.info("Bundle creation feature coming soon!")
      }
    });
  };

  const exportBatchReport = () => {
    const csvHeader = "Batch No,Medicine Name,Action,Urgency,Reason,Days Until Expiry,Estimated Loss\n";
    const csvRows = stats.batchesNeedingAction.map(b => {
      const days = getDaysUntilExpiry(b);
      const loss = b.urgency === "critical" ? 15000 : b.urgency === "high" ? 8000 : 3000;
      return `${b.batchNo},${b.medicineName},${b.action},${b.urgency},${b.reason},${days},₹${loss}`;
    }).join('\n');
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Report exported!", {
      description: `${stats.batchesNeedingAction.length} batches exported to CSV`,
      icon: <FileDown className="h-4 w-4" />
    });
  };

  const BatchCard = ({ batch }: { batch: typeof stats.batchesNeedingAction[0] }) => {
    const isSelected = selectedBatches.includes(batch.batchNo);
    const daysUntilExpiry = getDaysUntilExpiry(batch);
    const discount = discountSliders[batch.batchNo] || 20;
    const clearanceTime = calculateClearanceTime(batch.batchNo, discount);
    const supplier = supplierData.default;
    const bundleSuggestions = getBundleSuggestions(batch.medicineName);
    
    const urgencyConfig = {
      critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-800", timeline: "bg-red-500" },
      high: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-800", timeline: "bg-orange-500" },
      urgent: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-800", timeline: "bg-orange-500" },
      warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-800", timeline: "bg-amber-500" },
      medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-800", timeline: "bg-amber-500" },
    };
    const config = urgencyConfig[batch.urgency as keyof typeof urgencyConfig] || urgencyConfig.warning;
    
    const timelineProgress = Math.max(0, 100 - (daysUntilExpiry / 180 * 100));

    return (
      <div className={cn(
        "relative bg-white rounded-2xl border-2 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden",
        isSelected && "ring-2 ring-healthcare-primary ring-offset-2 shadow-lg",
        config.border
      )}>
        {/* Gradient overlay based on urgency */}
        <div className={cn("absolute inset-0 opacity-30", config.bg)} />
        
        <div className="relative p-5 space-y-5">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleBatchSelection(batch.batchNo)}
              className="mt-1 h-5 w-5"
            />
            <div className="flex-1 min-w-0 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-lg font-semibold text-gray-900 truncate">{batch.medicineName}</h4>
                <Badge className={cn("text-xs px-3 py-1 font-semibold rounded-full", config.badge)}>
                  {batch.urgency.toUpperCase()}
                </Badge>
              </div>

              {/* Visual Timeline */}
              <div className="space-y-2 bg-gray-50/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Expiry Timeline</span>
                  <span className={cn("font-bold", config.text)}>
                    {daysUntilExpiry} days left
                  </span>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn("absolute left-0 top-0 h-full rounded-full transition-all", config.timeline)}
                    style={{ width: `${timelineProgress}%` }}
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gray-900" title="Today" />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Received</span>
                  <span>Today</span>
                  <span>Expiry</span>
                </div>
              </div>

              {/* Batch Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-gray-500 text-xs font-medium">Batch:</span>
                  <p className="text-base font-semibold text-gray-900">{batch.batchNo}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-gray-500 text-xs font-medium">Action:</span>
                  <p className="text-base font-semibold text-gray-900 capitalize">{batch.action}</p>
                </div>
              </div>

              {/* Alert Reason */}
              <div className={cn("text-sm p-3 rounded-xl flex items-center gap-2", config.bg, config.border, "border")}>
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {batch.reason}
              </div>

              {/* Supplier Scorecard */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Supplier: {supplier.name}</span>
                  <Badge variant="outline" className={cn(
                    "text-[10px]",
                    supplier.rating === "A" ? "bg-green-50 text-green-700 border-green-200" :
                    supplier.rating === "B" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-red-50 text-red-700 border-red-200"
                  )}>
                    Rating: {supplier.rating}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="h-3 w-3" />
                    {supplier.issues} issues
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {supplier.reliability}% reliable
                  </span>
                </div>
              </div>

              {/* AI Dynamic Pricing (for discount action) */}
              {batch.action === "discount" && (
                <div className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/50 rounded-2xl p-4 space-y-3 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-purple-800">AI Pricing Engine</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Discount:</span>
                      <span className="text-xl font-bold text-purple-700">{discount}%</span>
                    </div>
                    <Slider
                      value={[discount]}
                      onValueChange={(value) => setDiscountSliders({...discountSliders, [batch.batchNo]: value[0]})}
                      min={5}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-sm text-gray-600">Estimated clearance:</span>
                    <span className={cn(
                      "text-base font-bold flex items-center gap-1.5",
                      clearanceTime <= daysUntilExpiry ? "text-green-600" : "text-red-600"
                    )}>
                      {clearanceTime} days
                      {clearanceTime <= daysUntilExpiry ? 
                        <CheckCircle2 className="h-4 w-4" /> : 
                        <AlertTriangle className="h-4 w-4" />
                      }
                    </span>
                  </div>
                  {clearanceTime > daysUntilExpiry && (
                    <p className="text-xs text-amber-600 font-medium">
                      ⚠️ Increase discount to clear before expiry
                    </p>
                  )}
                </div>
              )}

              {/* Bundle Suggestions */}
              {batch.action === "discount" && (
                <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200/50 rounded-2xl p-4 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-green-800">Smart Bundle Builder</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Pair with fast-moving items to clear 3x faster:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bundleSuggestions.slice(0, 2).map((suggestion, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-sm bg-white border-green-200 text-green-700 px-3 py-1"
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-green-500 hover:bg-green-600 text-white shadow-sm h-10"
                    onClick={() => createBundle(batch)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Create Bundle
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-gray-100">
                {batch.action === "discount" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-11 text-sm font-medium border-2 hover:bg-gray-50"
                    onClick={() => generateDiscountCampaign(batch)}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                )}
                {batch.action === "return" && (
                  <Button
                    size="sm"
                    className="flex-1 h-11 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => generateEmailTemplate(batch)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Supplier
                  </Button>
                )}
                {batch.action === "remove" && (
                  <Button
                    size="sm"
                    className="flex-1 h-11 text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Mark for Disposal
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-0">
        {/* Decorative blur orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-healthcare-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-healthcare-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-healthcare-primary/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Batch Intelligence Analysis
              </DialogTitle>
              <DialogDescription className="text-gray-500 mt-0.5">
                Comprehensive insights and actions for {stats.batchesNeedingAction.length} batches requiring attention
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="relative px-6 py-5 flex-1 overflow-hidden flex flex-col">

        {/* Financial Impact Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="group relative bg-white rounded-2xl border border-red-200/50 p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/30 opacity-60" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-sm font-medium text-red-600">Critical</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{criticalBatches.length}</p>
            </div>
          </div>
          <div className="group relative bg-white rounded-2xl border border-orange-200/50 p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100/30 opacity-60" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-orange-600">Urgent</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{urgentBatches.length}</p>
            </div>
          </div>
          <div className="group relative bg-white rounded-2xl border border-amber-200/50 p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/30 opacity-60" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-amber-600">Warning</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{warningBatches.length}</p>
            </div>
          </div>
          <div className="group relative rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-rose-600">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium text-white/90">Est. Loss</p>
              </div>
              <p className="text-3xl font-bold text-white">₹{(totalLoss / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {selectedBatches.length > 0 && (
          <div className="bg-gradient-to-r from-healthcare-primary/10 via-emerald-50/50 to-healthcare-primary/10 border border-healthcare-primary/20 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-healthcare-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-healthcare-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBatches.length} batch(es) selected
                  </p>
                  <p className="text-xs text-gray-500">Choose an action to apply</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSelection}
                  disabled={processingAction}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("discount")}
                  disabled={processingAction}
                  className="bg-green-500 hover:bg-green-600 text-white shadow-sm"
                >
                  <Percent className="h-4 w-4 mr-1.5" />
                  Apply Discount
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("return")}
                  disabled={processingAction}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                >
                  <RefreshCcw className="h-4 w-4 mr-1.5" />
                  Initiate Return
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("remove")}
                  disabled={processingAction}
                  className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs for Batch Organization */}
        <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 p-1 rounded-xl h-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5 text-sm font-medium transition-all">
              All Batches ({stats.batchesNeedingAction.length})
            </TabsTrigger>
            <TabsTrigger value="critical" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 rounded-lg py-2.5 text-sm font-medium transition-all">
              Critical ({criticalBatches.length})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 rounded-lg py-2.5 text-sm font-medium transition-all">
              Urgent ({urgentBatches.length})
            </TabsTrigger>
            <TabsTrigger value="warning" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600 rounded-lg py-2.5 text-sm font-medium transition-all">
              Warning ({warningBatches.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-5 pr-2">
            <TabsContent value="all" className="mt-0 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 font-medium">
                  Showing all {stats.batchesNeedingAction.length} batches
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={exportBatchReport}
                  className="border-gray-200 hover:bg-gray-50 shadow-sm"
                >
                  <FileDown className="h-4 w-4 mr-1.5" />
                  Export Report
                </Button>
              </div>
              {stats.batchesNeedingAction.map(batch => (
                <BatchCard key={batch.batchNo} batch={batch} />
              ))}
            </TabsContent>

            <TabsContent value="critical" className="mt-0 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">
                  {criticalBatches.length} critical batches - Immediate action required
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => selectAllByType("critical")}
                >
                  Select All Critical
                </Button>
              </div>
              {criticalBatches.length > 0 ? (
                criticalBatches.map(batch => (
                  <BatchCard key={batch.batchNo} batch={batch} />
                ))
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-700">No critical batches</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="urgent" className="mt-0 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">
                  {urgentBatches.length} urgent batches - Action needed within 7 days
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => selectAllByType("urgent")}
                >
                  Select All Urgent
                </Button>
              </div>
              {urgentBatches.map(batch => (
                <BatchCard key={batch.batchNo} batch={batch} />
              ))}
            </TabsContent>

            <TabsContent value="warning" className="mt-0 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">
                  {warningBatches.length} warning batches - Monitor closely
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => selectAllByType("warning")}
                >
                  Select All Warnings
                </Button>
              </div>
              {warningBatches.map(batch => (
                <BatchCard key={batch.batchNo} batch={batch} />
              ))}
            </TabsContent>
          </div>
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
