"use client";

/**
 * InvoiceTemplate - Phase 5: Clinical Document Branding
 * 
 * A comprehensive invoice template for healthcare billing including:
 * - Itemized services and charges
 * - Tax calculations (GST)
 * - Payment information
 * - Insurance details
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  BaseDocumentTemplate,
  SectionTitle,
} from "./BaseDocumentTemplate";
import {
  InvoiceData,
  DocumentHeaderConfig,
  DocumentFooterConfig,
  DocumentStyleConfig,
} from "./types";
import {
  Receipt,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
} from "lucide-react";

interface InvoiceTemplateProps {
  data: InvoiceData;
  headerConfig?: Partial<DocumentHeaderConfig>;
  footerConfig?: Partial<DocumentFooterConfig>;
  styleConfig?: Partial<DocumentStyleConfig>;
  className?: string;
  printMode?: boolean;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

type PaymentStatus = "paid" | "pending" | "partial" | "overdue" | "cancelled";

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config = {
    paid: {
      icon: CheckCircle,
      text: "PAID",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-300",
    },
    pending: {
      icon: Clock,
      text: "PENDING",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-300",
    },
    partial: {
      icon: AlertCircle,
      text: "PARTIALLY PAID",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
    },
    overdue: {
      icon: AlertCircle,
      text: "OVERDUE",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-300",
    },
    cancelled: {
      icon: AlertCircle,
      text: "CANCELLED",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
    },
  };

  const statusConfig = config[status];
  const Icon = statusConfig.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border",
        statusConfig.bgColor,
        statusConfig.textColor,
        statusConfig.borderColor
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-bold">{statusConfig.text}</span>
    </div>
  );
};

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  (
    {
      data,
      headerConfig,
      footerConfig,
      styleConfig,
      className,
      printMode = false,
    },
    ref
  ) => {
    const { hospital, patient, metadata, items, payments, insurance } = data;
    const primaryColor = styleConfig?.primaryColor || hospital.primaryColor || "#007C7C";
    const latestPayment = payments?.[0];

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    // Calculate totals
    const subtotal = data.subtotal;
    const totalTax = data.totalTax;
    const totalDiscount = data.totalDiscount;
    const insuranceCovered = insurance?.approvedAmount || 0;
    const grandTotal = data.grandTotal;
    const isOverdue = !!data.dueDate && data.amountDue > 0 && data.dueDate < new Date();
    const paymentStatus: PaymentStatus =
      data.amountDue <= 0
        ? "paid"
        : isOverdue
          ? "overdue"
          : data.amountPaid > 0
            ? "partial"
            : "pending";

    return (
      <BaseDocumentTemplate
        ref={ref}
        hospital={hospital}
        headerConfig={{
          ...headerConfig,
          showRegistration: true,
        }}
        footerConfig={{
          ...footerConfig,
          disclaimerText: "This is a computer-generated invoice. Please retain for your records.",
        }}
        styleConfig={styleConfig}
        documentId={metadata.documentId}
        documentType="invoice"
        className={className}
        printMode={printMode}
      >
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-6 h-6" style={{ color: primaryColor }} />
              <h2 className="text-xl font-bold" style={{ color: primaryColor }}>
                TAX INVOICE
              </h2>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Invoice No:</span> {data.invoiceNumber}
              </p>
              <p>
                <span className="font-medium">Date:</span> {formatDate(data.invoiceDate)}
              </p>
              {data.dueDate && (
                <p>
                  <span className="font-medium">Due Date:</span> {formatDate(data.dueDate)}
                </p>
              )}
            </div>
          </div>
          <PaymentStatusBadge status={paymentStatus} />
        </div>

        {/* Patient & Billing Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Bill To */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Bill To
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{patient.name}</p>
              <p>Patient ID: {patient.patientId}</p>
              {patient.phone && <p>Phone: {patient.phone}</p>}
              {patient.address && <p>{patient.address}</p>}
            </div>
          </div>

        </div>

        {/* Invoice Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: `${primaryColor}15` }}>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  S.No
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  Description
                </th>
                <th
                  className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  HSN/SAC
                </th>
                <th
                  className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  Qty
                </th>
                <th
                  className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  Rate
                </th>
                <th
                  className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  Tax
                </th>
                <th
                  className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                    {item.category && (
                      <p className="text-xs text-gray-500">{item.category}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {item.hsnCode || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600">
                    {item.tax ? formatCurrency(item.tax) : "-"}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.total + (item.tax || 0) - (item.discount || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-6">
          <div className="w-80">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {totalTax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST):</span>
                  <span className="font-medium">{formatCurrency(totalTax)}</span>
                </div>
              )}
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span className="font-medium">-{formatCurrency(totalDiscount)}</span>
                </div>
              )}
              {insuranceCovered > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Insurance Covered:</span>
                  <span className="font-medium">-{formatCurrency(insuranceCovered)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold" style={{ color: primaryColor }}>
                    Grand Total:
                  </span>
                  <span className="text-lg font-bold" style={{ color: primaryColor }}>
                    {formatCurrency(grandTotal > 0 ? grandTotal : 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Information */}
        {insurance && (
          <div className="mb-6">
            <SectionTitle icon={<Building2 className="w-4 h-4" />}>
              Insurance Information
            </SectionTitle>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Provider:</span>{" "}
                  <span className="font-medium">{insurance.provider}</span>
                </div>
                <div>
                  <span className="text-gray-600">Policy No:</span>{" "}
                  <span className="font-medium">{insurance.policyNumber}</span>
                </div>
                {insurance.claimNumber && (
                  <div>
                    <span className="text-gray-600">Claim No:</span>{" "}
                    <span className="font-medium">{insurance.claimNumber}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-gray-600">Approved Amount:</span>{" "}
                  <span className="font-bold text-blue-700">
                    {formatCurrency(insurance.approvedAmount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        {latestPayment && (
          <div className="mb-6">
            <SectionTitle icon={<CreditCard className="w-4 h-4" />}>
              Payment Information
            </SectionTitle>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Payment Method:</span>{" "}
                  <span className="font-medium capitalize">{latestPayment.method}</span>
                </div>
                {latestPayment.transactionId && (
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>{" "}
                    <span className="font-medium">{latestPayment.transactionId}</span>
                  </div>
                )}
                {latestPayment.paidAt && (
                  <div>
                    <span className="text-gray-600">Payment Date:</span>{" "}
                    <span className="font-medium">{formatDate(latestPayment.paidAt)}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Amount Paid:</span>{" "}
                  <span className="font-bold text-green-700">
                    {formatCurrency(latestPayment.paidAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Notes */}
        {data.notes && (
          <div className="mb-4">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Notes:</span> {data.notes}
            </p>
          </div>
        )}

        {/* Bank Details for pending payments */}
        {paymentStatus === "pending" && data.bankDetails && (
          <div className="bg-gray-100 rounded-lg p-4 text-sm">
            <p className="font-medium text-gray-700 mb-2">Bank Details for Payment:</p>
            <div className="grid grid-cols-2 gap-2 text-gray-600">
              <p>Bank: {data.bankDetails.bankName}</p>
              <p>Account No: {data.bankDetails.accountNumber}</p>
              <p>IFSC: {data.bankDetails.ifscCode}</p>
              <p>Account Name: {data.bankDetails.accountHolder}</p>
              {data.bankDetails.upiId && <p>UPI: {data.bankDetails.upiId}</p>}
            </div>
          </div>
        )}
      </BaseDocumentTemplate>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";

export default InvoiceTemplate;
