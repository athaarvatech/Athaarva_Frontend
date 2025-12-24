"use client";

import React, { useState, useEffect, useCallback } from "react";
import BillingDashboard from "@/modules/patient-pages/billing/BillingDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  ReceiptText,
  FileText,
  Download,
  CheckCircle,
  Calendar,
  Plus,
  FileDown,
  HelpCircle,
  Circle,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ClaimSubmissionFlow from "@/components/ClaimSubmissionFlow";
import PatientBillingService, {
  Payment,
  Invoice,
  InsuranceClaim,
  InsurancePolicy,
  BillingSummary,
} from "@/lib/services/PatientBillingService";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [showClaimSubmission, setShowClaimSubmission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<Invoice[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [insurancePlans, setInsurancePlans] = useState<InsurancePolicy[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(
    null
  );

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");

  // Get patient ID from localStorage
  const getPatientId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_id") || "";
    }
    return "";
  };

  // Filter items based on search term
  const filterItems = <
    T extends {
      id?: string;
      payment_number?: string;
      claim_number?: string;
      invoice_number?: string;
    }
  >(
    items: T[]
  ): T[] => {
    if (!searchTerm) return items;
    return items.filter((item) => {
      const searchString = searchTerm.toLowerCase();
      return (
        item.id?.toLowerCase().includes(searchString) ||
        item.payment_number?.toLowerCase().includes(searchString) ||
        item.claim_number?.toLowerCase().includes(searchString) ||
        item.invoice_number?.toLowerCase().includes(searchString)
      );
    });
  };

  // Fetch all billing data
  const fetchBillingData = useCallback(async () => {
    const patientId = getPatientId();
    if (!patientId) {
      setError("Please log in to view billing information");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        summaryResult,
        paymentsResult,
        upcomingResult,
        claimsResult,
        policiesResult,
      ] = await Promise.allSettled([
        PatientBillingService.getBillingSummary(patientId),
        PatientBillingService.getPayments(patientId, { limit: 50 }),
        PatientBillingService.getUpcomingBills(patientId),
        PatientBillingService.getClaims(patientId, { limit: 50 }),
        PatientBillingService.getInsurancePolicies(patientId),
      ]);

      if (summaryResult.status === "fulfilled") {
        setBillingSummary(summaryResult.value);
      }

      if (paymentsResult.status === "fulfilled") {
        setPayments(paymentsResult.value.payments || []);
      }

      if (upcomingResult.status === "fulfilled") {
        setUpcomingBills(upcomingResult.value || []);
      }

      if (claimsResult.status === "fulfilled") {
        setClaims(claimsResult.value.claims || []);
      }

      if (policiesResult.status === "fulfilled") {
        setInsurancePlans(policiesResult.value || []);
      }
    } catch (err) {
      console.error("Error fetching billing data:", err);
      setError("Failed to load billing data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  // Handle receipt download
  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      await PatientBillingService.downloadReceipt(paymentId);
    } catch (err) {
      console.error("Error downloading receipt:", err);
    }
  };

  // Handle invoice download
  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      await PatientBillingService.downloadInvoicePDF(invoiceId);
    } catch (err) {
      console.error("Error downloading invoice:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#006D77]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchBillingData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Calculate display values from summary or fallback to 0
  const totalUnpaid = billingSummary?.total_pending || 0;
  const yearToDateTotal = billingSummary?.year_to_date?.total_billed || 0;
  const insuranceCovered = billingSummary?.year_to_date?.insurance_covered || 0;
  const outOfPocket = billingSummary?.year_to_date?.out_of_pocket || 0;

  // Get primary insurance for deductible display
  const primaryInsurance =
    insurancePlans.find((p) => p.is_primary) || insurancePlans[0];
  const deductibleMet = primaryInsurance?.deductible_met || 0;
  const deductibleTotal = primaryInsurance?.deductible || 1500;
  const deductiblePercent = Math.round((deductibleMet / deductibleTotal) * 100);

  return (
    <div>
      <BillingDashboard />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search by ID, invoice number, or claim number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">Total Unpaid</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalUnpaid)}
                </p>
              </div>
              <CreditCard className="h-10 w-10 text-amber-500 p-2 bg-amber-100 rounded-full" />
            </div>
            <Button className="w-full mt-2 bg-[#006D77] hover:bg-[#00585F]">
              Pay Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">Year-to-Date</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(yearToDateTotal)}
                </p>
              </div>
              <ReceiptText className="h-10 w-10 text-purple-500 p-2 bg-purple-100 rounded-full" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Insurance Covered:</span>
                <span className="font-medium">
                  {formatCurrency(insuranceCovered)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Out-of-Pocket:</span>
                <span className="font-medium">
                  {formatCurrency(outOfPocket)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">Deductible Progress</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(deductibleMet)}/
                  {formatCurrency(deductibleTotal)}
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-500 p-2 bg-blue-100 rounded-full" />
            </div>
            <div className="mt-3">
              <Progress value={deductiblePercent} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">
                {deductiblePercent}% of deductible met
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Plans</TabsTrigger>
        </TabsList>

        {/* Payments History Tab */}
        <TabsContent value="payments" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {filterItems(payments).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Payment #</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Method</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterItems(payments).map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {new Date(
                                payment.payment_date
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {payment.payment_number}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {payment.payment_method.replace("_", " ")}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : payment.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => handleDownloadReceipt(payment.id)}
                            >
                              <Download size={16} className="mr-1" />
                              Receipt
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ReceiptText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No payment history found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "Payments will appear here once made"}
                  </p>
                </div>
              )}

              {/* Upcoming Bills Section */}
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Upcoming Bills</h3>

                {upcomingBills.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBills.map((bill) => (
                      <div
                        key={bill.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">
                              {bill.invoice_number}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {bill.hospital?.name || "Unknown Provider"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(bill.balance_due)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Total: {formatCurrency(bill.total_amount)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-sm mt-2">
                          <Calendar size={14} className="text-gray-400 mr-1" />
                          <span className="text-gray-600">
                            Due: {new Date(bill.due_date).toLocaleDateString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              bill.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : bill.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : bill.status === "sent"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {bill.status}
                          </span>
                        </div>

                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(bill.id)}
                          >
                            <FileDown size={16} className="mr-1" />
                            View Invoice
                          </Button>
                          <Button
                            className="bg-[#006D77] hover:bg-[#00585F]"
                            size="sm"
                          >
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">
                      No upcoming bills
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      You&apos;re all caught up!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Claims Tab */}
        <TabsContent value="claims" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Insurance Claims</CardTitle>
                <Button
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={() => setShowClaimSubmission(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Submit New Claim
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filterItems(claims).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Claim #</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Approved</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterItems(claims).map((claim) => (
                        <tr
                          key={claim.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {claim.submission_date
                                ? new Date(
                                    claim.submission_date
                                  ).toLocaleDateString()
                                : "Not submitted"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {claim.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">{claim.claim_number}</td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(claim.claim_amount)}
                          </td>
                          <td className="px-4 py-3">
                            {claim.approved_amount !== undefined
                              ? formatCurrency(claim.approved_amount)
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                claim.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : claim.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : claim.status === "under_review"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : claim.status === "submitted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {claim.status.replace("_", " ")}
                            </span>
                            {claim.status === "rejected" &&
                              claim.rejection_reason && (
                                <div className="text-xs text-red-600 mt-1">
                                  {claim.rejection_reason}
                                </div>
                              )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm" className="h-8">
                              <FileDown size={16} className="mr-1" />
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No claims found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "Submit a claim to get started"}
                  </p>
                  <Button
                    className="mt-4 bg-[#006D77] hover:bg-[#00585F]"
                    onClick={() => setShowClaimSubmission(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Submit New Claim
                  </Button>
                </div>
              )}

              {/* Claim Filing Tips */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  Claim Filing Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <Circle
                      size={6}
                      className="mr-2 mt-1.5"
                      fill="currentColor"
                    />
                    Submit claims within 90 days of service for faster
                    processing
                  </li>
                  <li className="flex items-start">
                    <Circle
                      size={6}
                      className="mr-2 mt-1.5"
                      fill="currentColor"
                    />
                    Include all relevant documentation like receipts and
                    referrals
                  </li>
                  <li className="flex items-start">
                    <Circle
                      size={6}
                      className="mr-2 mt-1.5"
                      fill="currentColor"
                    />
                    Double-check all information before submitting to avoid
                    delays
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Plans Tab */}
        <TabsContent value="insurance" className="mt-0">
          <div className="space-y-6">
            {insurancePlans.length > 0 ? (
              insurancePlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">
                          {plan.provider_name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {plan.plan_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.is_primary && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Primary
                          </span>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Member ID:</span>
                            <span className="font-medium">
                              {plan.member_id}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Policy Number:
                            </span>
                            <span className="font-medium">
                              {plan.policy_number}
                            </span>
                          </div>
                          {plan.group_number && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Group Number:
                              </span>
                              <span className="font-medium">
                                {plan.group_number}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Coverage Start:
                            </span>
                            <span className="font-medium">
                              {new Date(
                                plan.coverage_start_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Annual Deductible
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(plan.deductible_met)} /{" "}
                              {formatCurrency(plan.deductible)}
                            </span>
                          </div>
                          <Progress
                            value={
                              (plan.deductible_met / plan.deductible) * 100
                            }
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(
                              (plan.deductible_met / plan.deductible) * 100
                            )}
                            % of deductible met
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Out-of-Pocket Maximum
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(plan.out_of_pocket_met)} /{" "}
                              {formatCurrency(plan.out_of_pocket_max)}
                            </span>
                          </div>
                          <Progress
                            value={
                              (plan.out_of_pocket_met /
                                plan.out_of_pocket_max) *
                              100
                            }
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(
                              (plan.out_of_pocket_met /
                                plan.out_of_pocket_max) *
                                100
                            )}
                            % of maximum met
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No insurance plans found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add an insurance plan to track your benefits
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="text-[#006D77] border-[#006D77]"
              >
                <Plus size={16} className="mr-2" />
                Add Insurance Plan
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Claim Submission Modal */}
      {showClaimSubmission && (
        <ClaimSubmissionFlow onClose={() => setShowClaimSubmission(false)} />
      )}
    </div>
  );
}
