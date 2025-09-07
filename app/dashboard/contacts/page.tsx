"use client";
import { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
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

import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  Columns3Icon,
  ListFilterIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Contacts = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  created_at: string;
};

const multiColumnFilterFn: FilterFn<Contacts> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent = `${row.original.name}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export default function Component() {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "status", desc: false },
  ]);

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
        console.log("🚀 ~ fetchContacts ~ token:", token);

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
    if (editContact) {
      setStatus(editContact.status);
    }
  }, [editContact]);

  type StatusType = "new" | "in_progress" | "resolved";

  const handleSave = async () => {
    if (!editContact) return;

    const validStatuses: StatusType[] = ["new", "in_progress", "resolved"];
    if (!validStatuses.includes(status)) {
      console.error("Invalid status:", status);
      return;
    }

    try {
      const token = await getAccessToken();

      console.log("Sending status update:", {
        id: editContact.id,
        status,
      });

      const response = await axios.patch<Contacts>(
        `${API_BASE_URL}/api/v1/contacts`,
        {
          id: editContact.id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData((prev) =>
        prev.map((contact) =>
          contact.id === editContact.id
            ? { ...contact, status: response.data.status }
            : contact
        )
      );

      setEditContact(null);
      setStatus("new");
      setIsDialogOpen(false);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error details:", {
          status: err.response?.status,
          data: err.response?.data,
        });
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  const columns: ColumnDef<Contacts>[] = [
    { header: "Name", accessorKey: "name", size: 100 },
    { header: "Email", accessorKey: "email", size: 100 },
    { header: "Status", accessorKey: "status", size: 50 },
    { header: "Message", accessorKey: "message", size: 150 },
    {
      header: "Date",
      accessorKey: "created_at",
      size: 100,
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString(),
    },
    {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditContact(row.original);
            setIsDialogOpen(true);
          }}
        >
          Edit
        </Button>
      ),
      size: 50,
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
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, pagination, columnFilters, columnVisibility },
  });

  if (loading) return <p className="text-center">Loading Contacts...</p>;
  if (error) return <p className="text-center">{error}</p>;
  if (data.length === 0)
    return <p className="text-center">No Contacts found.</p>;

  return (
    <div className="space-y-4 xl:px-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn("peer min-w-60 ps-9")}
              value={
                (table.getColumn("name")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by name..."
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
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-background overflow-hidden border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
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
              onValueChange={(value) => setStatus(value as Contacts["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In_Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
