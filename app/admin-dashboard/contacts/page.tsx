"use client";
import { getAccessToken } from "@auth0/nextjs-auth0";
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
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useId, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

import {
  AlertCircle,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  Inbox,
  ListFilterIcon,
  Loader,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useRouter } from "next/navigation";

type Contacts = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  created_at: string;
  has_new_message: boolean;
  id_message: number;
};

const multiColumnFilterFn: FilterFn<Contacts> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent = `
    ${row.original.name}
    ${row.original.email}
    ${row.original.message}
    ${new Date(row.original.created_at).toLocaleString()}
  `.toLowerCase();

  return searchableRowContent.includes(filterValue.toLowerCase());
};

export default function Component() {
  const router = useRouter();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [data, setData] = useState<Contacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contacts | null>(null);
  const [status, setStatus] = useState<Contacts["status"]>("new");

  useEffect(() => {
    async function fetchContacts() {
      try {
        const token = await getAccessToken();
        const response = await axios.get<Contacts[]>(
          `${API_BASE_URL}/api/v1/contacts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (editContact) setStatus(editContact.status);
  }, [editContact]);
  const handleSave = async () => {
    if (!editContact) return;

    const validStatuses: Contacts["status"][] = [
      "new",
      "in_progress",
      "resolved",
    ];
    if (!validStatuses.includes(status)) return;
    const toastId = toast("Updating the status...", {
      icon: <Loader className="animate-spin h-5 w-5" />,
      duration: Infinity,
    });
    try {
      const token = await getAccessToken();
      const response = await axios.patch<Contacts>(
        `${API_BASE_URL}/api/v1/contacts`,
        { id: editContact.id, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData((prev) =>
        prev.map((c) =>
          c.id === editContact.id ? { ...c, status: response.data.status } : c
        )
      );

      setEditContact(null);
      setStatus("new");
      setIsDialogOpen(false);

      toast.success("🎉 Your status has been updated successfully!", {
        id: toastId,
        duration: 1000,
        style: {
          borderRadius: "10px",
          background: "#006400",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } catch (err: any) {
      console.error("Error updating contact:", err);
      toast.error("Whoops! Something went wrong while updating status.", {
        id: toastId,
        duration: 2000,
        icon: <AlertCircle className="h-5 w-5" />,
        style: {
          borderRadius: "10px",
          background: "#8B0000",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }
  };

  const columns: ColumnDef<Contacts>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <button
          onClick={() =>
            router.push(`/admin-dashboard/contacts/${row.original.id}`)
          }
          className="text-left hover:underline cursor-pointer"
        >
          {row.getValue("name")}
        </button>
      ),
      size: 150,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => (
        <button
          onClick={() =>
            router.push(`/admin-dashboard/contacts/${row.original.id}`)
          }
          className="text-left hover:underline cursor-pointer"
        >
          {row.getValue("email")}
        </button>
      ),
      size: 200,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        let statusColor = "bg-gray-200 text-gray-800";
        if (status === "resolved") statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-white";
        else if (status === "in_progress")
          statusColor = "dark:bg-yellow-600 dark:text-white bg-yellow-400/20 text-yellow-600";
        else if (status === "new")
          statusColor = "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-white";

        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {status}
          </span>
        );
      },
      size: 100,
    },
    {
      header: "Message",
      accessorKey: "message",
      size: 250,
      cell: ({ row }) => {
        const [expanded, setExpanded] = useState(false);
        const message = row.original.message;
        const isLong = message.length > 100;

        return (
          <div className="text-sm">
            <p className="whitespace-pre-wrap break-words">
              {expanded ? message : message.slice(0, 40)}
              {!expanded && isLong ? "..." : ""}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="text-primary hover:underline text-xs"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "created_at",
      size: 150,
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString(),
    },
    {
      id: "has_new_message",
      accessorKey: "has_new_message",
      header: "",
      size: 0,
      enableSorting: true,
      enableHiding: true,
      cell: () => null,
    },
    {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          onClick={(e) => {
            setEditContact(row.original);
            e.stopPropagation();
            setIsDialogOpen(true);
          }}
        >
          Edit
        </Button>
      ),
      size: 80,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      pagination,
      globalFilter,
      columnVisibility,
    },
    globalFilterFn: multiColumnFilterFn,
  });

  if (loading)
    return <TableSkeleton columnWidths={[250, 100, 100, 120, 60]} rows={8} />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center text-center text-red-600 space-y-2 mt-10">
        <AlertCircle className="h-8 w-8" />
        <p>{error}</p>
      </div>
    );

  if (data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-center text-indigo-700 space-y-2 mt-10">
        <Inbox className="h-8 w-8" />
        <p>No contacts found.</p>
      </div>
    );

  return (
    <div className="space-y-4 xl:px-5 overflow-y-auto">
      <Toaster position="top-center" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn("peer min-w-60 ps-9")}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by name, email, message, or date..."
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
              <ListFilterIcon size={16} />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon className="-ms-1 opacity-60" size={16} />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide() && col.id !== "has_new_message")
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(val) => col.toggleVisibility(!!val)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table className="table-fixed min-w-[600px] text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px`, minWidth: "80px" }}
                    className="border-b px-2 py-1 md:px-4 md:py-2"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const isNewMessage = row.original.has_new_message;
              const messageId = row.original.id_message;
              return (
                <TableRow
                  key={row.id}
                  className={`border-b cursor-pointer`}  // Remove font-semibold from here
                  onClick={async () => {
                    if (isNewMessage && messageId) {
                    }
                    router.push(`/admin-dashboard/contacts/${row.original.id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-2 py-1 md:px-4 md:py-2 break-words text-xs sm:text-sm",
                        isNewMessage && "font-semibold"  // Add font-semibold directly to cells
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p aria-live="polite">
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                table.getState().pagination.pageSize,
                table.getRowCount()
              )}
            </span>{" "}
            of <span className="text-foreground">{table.getRowCount()}</span>
          </p>
        </div>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronFirstIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronLastIcon size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as Contacts["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} className="cursor-pointer">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
                      className={`h-4 rounded-md ${((rowIndex + colIndex) % 4 === 0 && "w-3/4") ||
                        ((rowIndex + colIndex) % 4 === 1 && "w-2/4") ||
                        ((rowIndex + colIndex) % 4 === 2 && "w-1/4") ||
                        "w-full"
                        }`}
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