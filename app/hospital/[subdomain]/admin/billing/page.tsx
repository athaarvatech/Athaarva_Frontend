"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Search,
  Plus,
  MoreVertical,
  DollarSign,
  CreditCard,
  Download,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Receipt,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Types
interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  patientId: string;
  services: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: "paid" | "pending" | "overdue" | "cancelled" | "partial";
  dueDate: string;
  createdAt: string;
  paymentMethod?: string;
  insuranceClaim?: {
    provider: string;
    claimId: string;
    status: "submitted" | "approved" | "rejected" | "pending";
    amount: number;
  };
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2025-0001",
    patientName: "John Smith",
    patientId: "pat-1",
    services: [
      {
        name: "Consultation - Cardiology",
        quantity: 1,
        unitPrice: 150,
        total: 150,
      },
      { name: "ECG Test", quantity: 1, unitPrice: 75, total: 75 },
      {
        name: "Blood Test - Lipid Panel",
        quantity: 1,
        unitPrice: 50,
        total: 50,
      },
    ],
    subtotal: 275,
    tax: 27.5,
    discount: 0,
    total: 302.5,
    amountPaid: 302.5,
    balance: 0,
    status: "paid",
    dueDate: "2025-12-15",
    createdAt: "2025-12-01",
    paymentMethod: "Credit Card",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2025-0002",
    patientName: "Emily Davis",
    patientId: "pat-2",
    services: [
      {
        name: "Consultation - Dermatology",
        quantity: 1,
        unitPrice: 120,
        total: 120,
      },
      { name: "Skin Biopsy", quantity: 1, unitPrice: 200, total: 200 },
    ],
    subtotal: 320,
    tax: 32,
    discount: 20,
    total: 332,
    amountPaid: 0,
    balance: 332,
    status: "pending",
    dueDate: "2025-12-20",
    createdAt: "2025-12-02",
    insuranceClaim: {
      provider: "Aetna",
      claimId: "CLM-67890",
      status: "submitted",
      amount: 280,
    },
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2025-0003",
    patientName: "Robert Wilson",
    patientId: "pat-3",
    services: [
      { name: "Follow-up Visit", quantity: 1, unitPrice: 80, total: 80 },
      { name: "X-Ray - Chest", quantity: 1, unitPrice: 150, total: 150 },
    ],
    subtotal: 230,
    tax: 23,
    discount: 0,
    total: 253,
    amountPaid: 100,
    balance: 153,
    status: "partial",
    dueDate: "2025-12-10",
    createdAt: "2025-11-25",
    paymentMethod: "Cash",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2025-0004",
    patientName: "Maria Garcia",
    patientId: "pat-4",
    services: [
      {
        name: "Pediatric Consultation",
        quantity: 1,
        unitPrice: 100,
        total: 100,
      },
      { name: "Vaccination - MMR", quantity: 1, unitPrice: 45, total: 45 },
    ],
    subtotal: 145,
    tax: 14.5,
    discount: 0,
    total: 159.5,
    amountPaid: 0,
    balance: 159.5,
    status: "overdue",
    dueDate: "2025-11-30",
    createdAt: "2025-11-15",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2025-0005",
    patientName: "James Brown",
    patientId: "pat-5",
    services: [
      { name: "Emergency Room Visit", quantity: 1, unitPrice: 500, total: 500 },
    ],
    subtotal: 500,
    tax: 50,
    discount: 0,
    total: 550,
    amountPaid: 0,
    balance: 550,
    status: "cancelled",
    dueDate: "2025-12-01",
    createdAt: "2025-11-20",
  },
];

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-blue-100 text-blue-800 border-blue-200",
  partial: "bg-amber-100 text-amber-800 border-amber-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  paid: CheckCircle,
  pending: Clock,
  partial: AlertCircle,
  overdue: XCircle,
  cancelled: XCircle,
};

export default function BillingPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalRevenue: mockInvoices
      .filter((i) => i.status !== "cancelled")
      .reduce((sum, i) => sum + i.amountPaid, 0),
    pending: mockInvoices
      .filter((i) => i.status === "pending" || i.status === "partial")
      .reduce((sum, i) => sum + i.balance, 0),
    overdue: mockInvoices
      .filter((i) => i.status === "overdue")
      .reduce((sum, i) => sum + i.balance, 0),
    collectionRate: Math.round(
      (mockInvoices.reduce((sum, i) => sum + i.amountPaid, 0) /
        mockInvoices
          .filter((i) => i.status !== "cancelled")
          .reduce((sum, i) => sum + i.total, 0)) *
        100
    ),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Billing & Invoices
          </h1>
          <p className="text-gray-600">
            Manage invoices, payments, and insurance claims
          </p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.pending)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    mockInvoices.filter(
                      (i) => i.status === "pending" || i.status === "partial"
                    ).length
                  }{" "}
                  invoices
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.overdue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {mockInvoices.filter((i) => i.status === "overdue").length}{" "}
                  invoices
                </p>
              </div>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Collection Rate</p>
                <p className="text-2xl font-bold text-teal-600">
                  {stats.collectionRate}%
                </p>
                <Progress value={stats.collectionRate} className="h-1.5 mt-2" />
              </div>
              <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by invoice number or patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const StatusIcon = statusIcons[invoice.status];
                return (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {invoice.invoiceNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">
                        {invoice.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {invoice.patientId}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(invoice.amountPaid)}
                    </TableCell>
                    <TableCell
                      className={
                        invoice.balance > 0 ? "text-red-600 font-medium" : ""
                      }
                    >
                      {formatCurrency(invoice.balance)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[invoice.status]}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Patient
                          </DropdownMenuItem>
                          {invoice.status !== "paid" &&
                            invoice.status !== "cancelled" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Record Payment
                                </DropdownMenuItem>
                              </>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredInvoices.length === 0 && (
            <div className="p-8 text-center">
              <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No invoices found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredInvoices.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">
                Showing {filteredInvoices.length} of {mockInvoices.length}{" "}
                invoices
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">Page 1</span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedInvoice.invoiceNumber}
                  </h3>
                  <p className="text-gray-500">
                    Created:{" "}
                    {format(
                      new Date(selectedInvoice.createdAt),
                      "MMMM d, yyyy"
                    )}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[selectedInvoice.status]}
                >
                  {selectedInvoice.status}
                </Badge>
              </div>

              {/* Patient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Bill To</p>
                <p className="font-semibold">{selectedInvoice.patientName}</p>
                <p className="text-sm text-gray-500">
                  Patient ID: {selectedInvoice.patientId}
                </p>
              </div>

              {/* Services Table */}
              <div>
                <h4 className="font-semibold mb-2">Services</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.services.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell className="text-right">
                          {service.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(service.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(service.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (10%)</span>
                  <span>{formatCurrency(selectedInvoice.tax)}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(selectedInvoice.total)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid</span>
                  <span>{formatCurrency(selectedInvoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between font-semibold text-red-600">
                  <span>Balance Due</span>
                  <span>{formatCurrency(selectedInvoice.balance)}</span>
                </div>
              </div>

              {/* Insurance Claim */}
              {selectedInvoice.insuranceClaim && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Insurance Claim
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Provider:</span>{" "}
                      <span className="font-medium">
                        {selectedInvoice.insuranceClaim.provider}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Claim ID:</span>{" "}
                      <span className="font-medium">
                        {selectedInvoice.insuranceClaim.claimId}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>{" "}
                      <span className="font-medium">
                        {formatCurrency(selectedInvoice.insuranceClaim.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>{" "}
                      <Badge variant="outline" className="ml-1 capitalize">
                        {selectedInvoice.insuranceClaim.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {selectedInvoice?.status !== "paid" &&
              selectedInvoice?.status !== "cancelled" && (
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
