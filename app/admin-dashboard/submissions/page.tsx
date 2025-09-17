"use client";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  AlertCircle,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleXIcon,
  Columns3Icon,
  Eye,
  Inbox,
  ListFilterIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
type Submissions = {
  id: number;
  team_name: string;
  email: string;
  status: string;
  score: number;
  created_at: number;
};

const multiColumnFilterFn: FilterFn<Submissions> = (row, filterValue) => {
  const searchableRowContent = `${row.original.team_name}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const fetchSubmissions = async (): Promise<Submissions[]> => {
  const token = await getAccessToken();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await axios.get<Submissions[]>(
    `${API_BASE_URL}/api/v1/submissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.sort((a, b) => b.id - a.id);
};



export default function SubmissionsPage() {
  const router = useRouter();
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "id",
      desc: true,
    },
  ]);
  const [viewedSubmissions, setViewedSubmissions] = useState<Set<number>>(new Set());

  const { data, isLoading, error } = useQuery<Submissions[], Error>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  const markAsViewed = (submissionId: number) => {
    setViewedSubmissions(prev => new Set([...prev, submissionId]));
  };
  const columns: ColumnDef<Submissions>[] = [
    {
      header: "ID",
      accessorKey: "id",
      size: undefined,
      minSize: 100,
      enableHiding: true,
    },
    {
      header: "Team Name",
      accessorKey: "team_name",
      size: undefined,
      minSize: 180,
    },
    {
      header: "Email",
      accessorKey: "email",
      size: undefined,
      minSize: 220,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: undefined,
      minSize: 100,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        let statusColor = "bg-gray-200 text-gray-800";
        if (status === "approved") statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-white";
        else if (status === "pending")
          statusColor = "bg-yellow-400/20 text-yellow-700 dark:bg-yellow-600 dark:text-white";
        else if (status === "rejected") statusColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-white";

        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Score",
      accessorKey: "score",
      size: undefined,
      minSize: 20,
    },
    {
      header: "Date",
      accessorKey: "created_at",
      size: 100,
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return date.toISOString().split("T")[0];
      }

    },
  ];
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  if (isLoading)
    return <TableSkeleton columnWidths={[250, 100, 100, 120, 60]} rows={8} />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center text-center text-red-600 space-y-2 py-8">
        <AlertCircle className="h-8 w-8" />
        <p className="font-semibold">{error.message}</p>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 space-y-2 py-8">
        <Inbox className="h-8 w-8" />
        <p className="font-medium">No Submissions found.</p>
      </div>
    );

  return (
    <div className="space-y-4 xl:px-5 overflow-y-auto mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getColumn("team_name")?.getFilterValue()) &&
                "pe-9"
              )}
              value={
                (table.getColumn("team_name")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("team_name")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by Team Name..."
              type="text"
              aria-label="Filter by Team Name "
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("team_name")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center  transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("team_name")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <div className="">
          <Button variant={"outline"} className=" py-6 cursor-pointer" onClick={() => {
            router.push(`/admin-dashboard/submissions/announcement`)
          }}>
            Announcement
          </Button>
        </div> */}
      </div>

      <div className="bg-background overflow-hidden rounded-lg border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                            "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      router.push(`/admin-dashboard/submissions/${row.original.id}`)
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({ row, onMarkAsViewed }: { row: Row<Submissions>; onMarkAsViewed: (id: number) => void }) {
  const router = useRouter();
  const handleViewClick = () => {
    const id = row.original.id;
    onMarkAsViewed(id);
    router.push(`/admin-dashboard/submissions/${id}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none cursor-pointer"
            aria-label="Edit item"
            onClick={handleViewClick}
          >
            <Eye size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}

function TableSkeleton({
  rows = 8,
  columnWidths = [250, 100, 100, 120, 60],
}: {
  rows?: number;
  columnWidths?: number[];
}) {
  return (
    <div className="bg-background overflow-x-auto border rounded-xl w-full animate-pulse">
      <div className="min-w-[600px]">
        <Table className="min-w-full w-full">
          <TableHeader>
            <TableRow>
              {columnWidths.map((width, i) => (
                <TableHead
                  key={i}
                  style={{ minWidth: width }}
                  className="px-4 py-3"
                >
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-muted/20 transition-colors duration-200"
              >
                {columnWidths.map((width, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={{ minWidth: width }}
                    className="px-4 py-3"
                  >
                    <Skeleton
                      className={`h-4 rounded-md w-${3 + (rowIndex + colIndex) % 4}/4`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
