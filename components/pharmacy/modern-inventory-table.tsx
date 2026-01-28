"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  Info,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export type InventoryItem = {
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
  pack: string;
  currentStock: number;
  reorderLevel: number;
  purchaseRate: number;
  mrp: number;
  gstPercent: number;
  vendorName?: string;
  location?: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon" | "expired";
  notes?: string;
};

function getStatusBadge(status: InventoryItem["status"]) {
  const styles = {
    "in-stock": "bg-green-100 text-green-700 border-green-200",
    "low-stock": "bg-amber-100 text-amber-700 border-amber-200",
    "out-of-stock": "bg-red-100 text-red-700 border-red-200",
    "expiring-soon": "bg-orange-100 text-orange-700 border-orange-200",
    expired: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const labels = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
    "expiring-soon": "Expiring Soon",
    expired: "Expired",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full", styles[status])}>
      {labels[status]}
    </Badge>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

interface ModernInventoryTableProps {
  data: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: string) => void;
  onView?: (item: InventoryItem) => void;
}

export function ModernInventoryTable({
  data,
  onEdit,
  onDelete,
  onView,
}: ModernInventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    hsn: false,
    pack: false,
    purchaseRate: false,
    gstPercent: false,
    location: false,
  });
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<InventoryItem>[] = [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <Button
            className="size-7 shadow-none text-muted-foreground"
            onClick={row.getToggleExpandedHandler()}
            aria-expanded={row.getIsExpanded()}
            aria-label={
              row.getIsExpanded()
                ? `Collapse details for ${row.original.medicineName}`
                : `Expand details for ${row.original.medicineName}`
            }
            size="icon"
            variant="ghost"
          >
            {row.getIsExpanded() ? (
              <ChevronUp className="opacity-60" size={16} strokeWidth={2} />
            ) : (
              <ChevronDown className="opacity-60" size={16} strokeWidth={2} />
            )}
          </Button>
        ) : undefined;
      },
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "medicineName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 h-auto font-medium"
          >
            Medicine
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="font-medium text-gray-900">{row.getValue("medicineName")}</div>
          {row.original.genericName && (
            <div className="text-xs text-gray-500">{row.original.genericName}</div>
          )}
          {row.original.manufacturer && (
            <div className="text-xs text-gray-400">{row.original.manufacturer}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "batchNo",
      header: "Batch",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("batchNo")}</div>,
    },
    {
      accessorKey: "expiry",
      header: "Expiry",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={cn(
              "text-sm",
              status === "expired"
                ? "text-red-600 font-medium"
                : status === "expiring-soon"
                ? "text-orange-600 font-medium"
                : "text-gray-700"
            )}
          >
            {row.getValue("expiry")}
          </span>
        );
      },
    },
    {
      accessorKey: "pack",
      header: "Pack",
      cell: ({ row }) => <div className="text-sm">{row.getValue("pack")}</div>,
    },
    {
      accessorKey: "currentStock",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 h-auto font-medium ml-auto"
          >
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const stock = row.getValue("currentStock") as number;
        const reorder = row.original.reorderLevel;
        return (
          <div className="text-right">
            <span
              className={cn(
                "font-medium",
                stock <= reorder ? "text-red-600" : "text-gray-900"
              )}
            >
              {stock}
            </span>
            {stock <= reorder && (
              <div className="text-xs text-red-500">Reorder: {reorder}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "purchaseRate",
      header: () => <div className="text-right">Rate</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("purchaseRate"));
        return <div className="text-right text-sm">{formatCurrency(amount)}</div>;
      },
    },
    {
      accessorKey: "mrp",
      header: () => <div className="text-right">MRP</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("mrp"));
        return (
          <div className="text-right font-medium text-sm">{formatCurrency(amount)}</div>
        );
      },
    },
    {
      accessorKey: "hsn",
      header: "HSN",
      cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("hsn")}</div>,
    },
    {
      accessorKey: "gstPercent",
      header: "GST%",
      cell: ({ row }) => <div className="text-sm">{row.getValue("gstPercent")}%</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("location")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView?.(item)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(item.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: (row) => Boolean(row.original.notes),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Filter medicines..."
          value={(table.getColumn("medicineName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("medicineName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent bg-gray-50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(idx % 2 === 0 ? "bg-white" : "bg-gray-50/50")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="flex items-start py-4 px-2 text-primary/80 bg-blue-50/50 rounded-md">
                          <span
                            className="me-3 mt-0.5 flex w-7 shrink-0 justify-center"
                            aria-hidden="true"
                          >
                            <Info className="opacity-60" size={16} strokeWidth={2} />
                          </span>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Additional Information</p>
                            <p className="text-sm">{row.original.notes}</p>
                            <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                              <div>
                                <span className="text-gray-500">Vendor:</span>{" "}
                                <span className="font-medium">{row.original.vendorName}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Last Updated:</span>{" "}
                                <span className="font-medium">{row.original.lastUpdated}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Stock Value:</span>{" "}
                                <span className="font-medium">
                                  {formatCurrency(
                                    row.original.currentStock * row.original.purchaseRate
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Package className="h-8 w-8 mb-2 opacity-50" />
                    <p>No results.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="text-xs">
          Total Stock Value:{" "}
          <span className="font-semibold">
            {formatCurrency(
              data.reduce((sum, item) => sum + item.currentStock * item.purchaseRate, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
