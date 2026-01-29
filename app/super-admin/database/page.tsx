"use client";

import { useEffect, useState } from "react";
import {
  Database,
  Table2,
  Search,
  Play,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Columns,
  Loader2,
  AlertTriangle,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Types
interface TableInfo {
  table_name: string;
  schema_name: string;
  row_count: number;
  size_pretty: string;
}

interface ColumnInfo {
  name: string;
  type: string;
  max_length: number | null;
  nullable: boolean;
  default: string | null;
  position: number;
}

interface TableDataResponse {
  columns: { name: string; type: string }[];
  rows: Record<string, unknown>[];
  total_count: number;
  page: number;
  page_size: number;
}

interface QueryResult {
  columns: string[];
  rows: unknown[][];
  row_count: number;
  execution_time_ms: number;
  truncated: boolean;
}

// API functions
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("super_admin_token")
      : null;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v2/super-admin";

async function fetchTables(schemaName = "public"): Promise<TableInfo[]> {
  const response = await fetch(
    `${BASE_URL}/database/tables?schema_name=${schemaName}`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch tables");
  return response.json();
}

async function fetchTableColumns(
  tableName: string,
  schemaName = "public"
): Promise<ColumnInfo[]> {
  const response = await fetch(
    `${BASE_URL}/database/tables/${tableName}/columns?schema_name=${schemaName}`,
    { headers: getAuthHeaders() }
  );
  if (!response.ok) throw new Error("Failed to fetch columns");
  return response.json();
}

async function fetchTableData(
  tableName: string,
  page = 1,
  pageSize = 50,
  schemaName = "public",
  sortBy?: string,
  sortOrder = "asc"
): Promise<TableDataResponse> {
  const params = new URLSearchParams({
    schema_name: schemaName,
    page: String(page),
    page_size: String(pageSize),
  });
  if (sortBy) {
    params.append("sort_by", sortBy);
    params.append("sort_order", sortOrder);
  }
  const response = await fetch(
    `${BASE_URL}/database/tables/${tableName}/data?${params}`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch table data");
  return response.json();
}

async function executeQuery(query: string, limit = 100): Promise<QueryResult> {
  const response = await fetch(`${BASE_URL}/database/query`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ query, limit }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Query execution failed");
  }
  return response.json();
}

export default function DatabaseGUIPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [tableData, setTableData] = useState<TableDataResponse | null>(null);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [tableColumns, setTableColumns] = useState<
    Record<string, ColumnInfo[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Query mode
  const [queryMode, setQueryMode] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM users LIMIT 10");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Fetch tables on mount
  useEffect(() => {
    const loadTables = async () => {
      setLoading(true);
      try {
        const data = await fetchTables();
        setTables(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load tables:", err);
        setError(
          "Failed to load database tables. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };
    loadTables();
  }, []);

  // Load table columns when expanded
  const toggleTableExpanded = async (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
      // Load columns if not already loaded
      if (!tableColumns[tableName]) {
        try {
          const cols = await fetchTableColumns(tableName);
          setTableColumns((prev) => ({ ...prev, [tableName]: cols }));
        } catch (err) {
          console.error("Failed to load columns:", err);
        }
      }
    }
    setExpandedTables(newExpanded);
  };

  // Select table and load data
  const selectTable = async (tableName: string) => {
    setSelectedTable(tableName);
    setQueryMode(false);
    setDataLoading(true);
    setPage(1);
    setSortBy(undefined);
    try {
      const [cols, data] = await Promise.all([
        fetchTableColumns(tableName),
        fetchTableData(tableName, 1, pageSize),
      ]);
      setColumns(cols);
      setTableData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load table data:", err);
      setError("Failed to load table data");
    } finally {
      setDataLoading(false);
    }
  };

  // Pagination
  const loadPage = async (newPage: number) => {
    if (!selectedTable) return;
    setDataLoading(true);
    try {
      const data = await fetchTableData(
        selectedTable,
        newPage,
        pageSize,
        "public",
        sortBy,
        sortOrder
      );
      setTableData(data);
      setPage(newPage);
    } catch (err) {
      console.error("Failed to load page:", err);
    } finally {
      setDataLoading(false);
    }
  };

  // Sorting
  const handleSort = async (column: string) => {
    if (!selectedTable) return;
    const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newOrder);
    setDataLoading(true);
    try {
      const data = await fetchTableData(
        selectedTable,
        1,
        pageSize,
        "public",
        column,
        newOrder
      );
      setTableData(data);
      setPage(1);
    } catch (err) {
      console.error("Failed to sort:", err);
    } finally {
      setDataLoading(false);
    }
  };

  // Execute SQL query
  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) return;
    setQueryLoading(true);
    setQueryError(null);
    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);
    } catch (err: unknown) {
      console.error("Query failed:", err);
      setQueryError(
        err instanceof Error ? err.message : "Query execution failed"
      );
    } finally {
      setQueryLoading(false);
    }
  };

  // Copy value to clipboard
  const copyToClipboard = (value: unknown) => {
    navigator.clipboard.writeText(String(value));
  };

  // Export as CSV
  const exportCSV = () => {
    if (queryMode && queryResult) {
      const csv = [
        queryResult.columns.join(","),
        ...queryResult.rows.map((row) =>
          row.map((v) => `"${String(v ?? "")}"`).join(",")
        ),
      ].join("\n");
      downloadCSV(csv, "query_result.csv");
    } else if (tableData) {
      const csv = [
        tableData.columns.map((c) => c.name).join(","),
        ...tableData.rows.map((row) =>
          tableData.columns
            .map((c) => `"${String(row[c.name] ?? "")}"`)
            .join(",")
        ),
      ].join("\n");
      downloadCSV(csv, `${selectedTable}.csv`);
    }
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter tables
  const filteredTables = tables.filter((t) =>
    t.table_name.toLowerCase().includes(tableSearch.toLowerCase())
  );

  // Total pages
  const totalPages = tableData
    ? Math.ceil(tableData.total_count / pageSize)
    : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto" />
          <p className="text-white/60">Loading database schema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-3">
            <Database className="h-7 w-7 text-emerald-400" />
            Database Explorer
          </h1>
          <p className="text-white/60 mt-1">
            Browse tables, view data, and execute read-only queries
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={queryMode ? "default" : "outline"}
            onClick={() => setQueryMode(!queryMode)}
            className={cn(
              queryMode
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "border-white/20"
            )}
          >
            <Play className="h-4 w-4 mr-2" />
            SQL Query
          </Button>
          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={(!queryResult && !tableData) || dataLoading}
            className="border-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Table List */}
        <div className="col-span-3">
          <Card className="bg-white/5 border-white/10 h-[calc(100vh-240px)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Table2 className="h-4 w-4" />
                Tables ({tables.length})
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search tables..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 h-8 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="px-2 space-y-0.5">
                  {filteredTables.map((table) => (
                    <div key={table.table_name}>
                      <div
                        className={cn(
                          "group rounded-md hover:bg-white/5 transition-colors",
                          selectedTable === table.table_name &&
                            "bg-emerald-500/10"
                        )}
                      >
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              toggleTableExpanded(table.table_name)
                            }
                            className="p-1.5 hover:bg-white/10 rounded"
                          >
                            {expandedTables.has(table.table_name) ? (
                              <ChevronDown className="h-4 w-4 text-white/50" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-white/50" />
                            )}
                          </button>
                          <button
                            onClick={() => selectTable(table.table_name)}
                            className="flex-1 flex items-center gap-2 py-1.5 pr-2 text-left"
                          >
                            <Table2 className="h-4 w-4 text-white/50" />
                            <span className="text-sm truncate">
                              {table.table_name}
                            </span>
                          </button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 border-white/20 mr-2"
                                >
                                  {table.row_count.toLocaleString()}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{table.size_pretty}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      {expandedTables.has(table.table_name) && (
                        <div className="ml-6 pl-4 border-l border-white/10 py-1 space-y-0.5">
                          {tableColumns[table.table_name]?.map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center gap-2 py-0.5 text-xs text-white/60"
                            >
                              <Columns className="h-3 w-3" />
                              <span className="truncate">{col.name}</span>
                              <span className="text-white/40">{col.type}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {queryMode ? (
            /* SQL Query Mode */
            <div className="space-y-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    SQL Query Editor
                  </CardTitle>
                  <CardDescription className="text-white/50">
                    Execute read-only SELECT queries against the database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="SELECT * FROM table_name LIMIT 10"
                    className="font-mono text-sm bg-slate-900 border-white/10 min-h-[120px]"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/40">
                      Only SELECT queries are allowed. Results limited to 1000
                      rows.
                    </p>
                    <Button
                      onClick={handleExecuteQuery}
                      disabled={queryLoading || !sqlQuery.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {queryLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Execute Query
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {queryError && (
                <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="py-4">
                    <p className="text-red-200 font-mono text-sm">
                      {queryError}
                    </p>
                  </CardContent>
                </Card>
              )}

              {queryResult && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Query Results
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{queryResult.row_count} rows</span>
                        <span>{queryResult.execution_time_ms}ms</span>
                        {queryResult.truncated && (
                          <Badge
                            variant="outline"
                            className="text-yellow-400 border-yellow-500/50"
                          >
                            Truncated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-auto max-h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10 hover:bg-transparent">
                            {queryResult.columns.map((col) => (
                              <TableHead
                                key={col}
                                className="text-white/70 font-medium"
                              >
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.rows.map((row, idx) => (
                            <TableRow
                              key={idx}
                              className="border-white/10 hover:bg-white/5"
                            >
                              {row.map((val, colIdx) => (
                                <TableCell
                                  key={colIdx}
                                  className="font-mono text-xs max-w-[200px] truncate"
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className="cursor-pointer hover:text-emerald-400"
                                          onClick={() => copyToClipboard(val)}
                                        >
                                          {String(val ?? "null")}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-[300px] break-all">
                                          {String(val ?? "null")}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : selectedTable ? (
            /* Table Data View */
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Table2 className="h-5 w-5 text-emerald-400" />
                      {selectedTable}
                    </CardTitle>
                    <CardDescription className="text-white/50 mt-1">
                      {tableData?.total_count.toLocaleString()} total rows •{" "}
                      {columns.length} columns
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={String(pageSize)}
                      onValueChange={(v) => {
                        setPageSize(Number(v));
                        loadPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[100px] bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="25">25 rows</SelectItem>
                        <SelectItem value="50">50 rows</SelectItem>
                        <SelectItem value="100">100 rows</SelectItem>
                        <SelectItem value="200">200 rows</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectTable(selectedTable)}
                      className="border-white/20"
                      disabled={dataLoading}
                    >
                      <RefreshCw
                        className={cn("h-4 w-4", dataLoading && "animate-spin")}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                  </div>
                ) : tableData && tableData.rows.length > 0 ? (
                  <>
                    <div className="overflow-auto max-h-[calc(100vh-420px)]">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10 hover:bg-transparent">
                            {tableData.columns.map((col) => (
                              <TableHead
                                key={col.name}
                                className="text-white/70 font-medium cursor-pointer hover:text-white"
                                onClick={() => handleSort(col.name)}
                              >
                                <div className="flex items-center gap-1">
                                  {col.name}
                                  {sortBy === col.name && (
                                    <span className="text-emerald-400">
                                      {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-white/40 font-normal">
                                  {col.type}
                                </span>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.rows.map((row, idx) => (
                            <TableRow
                              key={idx}
                              className="border-white/10 hover:bg-white/5"
                            >
                              {tableData.columns.map((col) => (
                                <TableCell
                                  key={col.name}
                                  className="font-mono text-xs max-w-[200px] truncate"
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className="cursor-pointer hover:text-emerald-400"
                                          onClick={() =>
                                            copyToClipboard(row[col.name])
                                          }
                                        >
                                          {row[col.name] === null ? (
                                            <span className="text-white/30">
                                              null
                                            </span>
                                          ) : (
                                            String(row[col.name])
                                          )}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent side="bottom">
                                        <p className="max-w-[300px] break-all">
                                          {String(row[col.name] ?? "null")}
                                        </p>
                                        <p className="text-white/50 text-xs mt-1">
                                          Click to copy
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                      <p className="text-sm text-white/60">
                        Showing {(page - 1) * pageSize + 1} -{" "}
                        {Math.min(page * pageSize, tableData.total_count)} of{" "}
                        {tableData.total_count.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPage(page - 1)}
                          disabled={page <= 1 || dataLoading}
                          className="border-white/20"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-white/60 px-2">
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPage(page + 1)}
                          disabled={page >= totalPages || dataLoading}
                          className="border-white/20"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <Table2 className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No data in this table</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* No Table Selected */
            <Card className="bg-white/5 border-white/10 h-[calc(100vh-240px)] flex items-center justify-center">
              <div className="text-center">
                <Database className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/80">
                  Select a Table
                </h3>
                <p className="text-white/50 mt-2 max-w-sm">
                  Choose a table from the sidebar to view its data, or use the
                  SQL Query mode to run custom queries.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
