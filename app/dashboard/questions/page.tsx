"use client";

import { SetStateAction, useEffect, useId, useRef, useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Textarea } from "@/components/ui/textarea";
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
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListFilterIcon,
  PlusIcon,
  EllipsisIcon,
  CircleXIcon,
  Columns3Icon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import axios from "axios";

type Question = {
  id: number;
  text: string;
  type: "text" | "yes_no" | "dropdown";
  importance: number | null;
  options: string[] | null;
  display_order: number;
};

const multiColumnFilterFn: FilterFn<Question> = (row, filterValue) => {
  const searchableRowContent = `${row.original.text}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export default function QuestionsTable() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "display_order", desc: false },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    text: "",
    type: "text",
    importance: 1,
    options: null,
    display_order: 1,
  });
  const [errors, setErrors] = useState({
    text: "",
    importance: "",
    options: "",
    display_order: "",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnVisibility({
          type: false,
          importance: false,
          display_order: false,
        });
      } else if (window.innerWidth < 1024) {
        setColumnVisibility({
          importance: false,
        });
      } else {
        setColumnVisibility({});
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get<Question[]>(
          `${API_BASE_URL}/api/v1/questions`
        );
        setData(response.data);
      } catch (err: any) {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [API_BASE_URL]);

  const columns: ColumnDef<Question>[] = [
    {
      header: "Question",
      accessorKey: "text",
      cell: ({ row }) => (
        <div className="font-medium truncate">{row.getValue("text")}</div>
      ),
      size: undefined,
      minSize: 200,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    { header: "Type", accessorKey: "type", size: undefined, minSize: 80 },
    {
      header: "Importance",
      accessorKey: "importance",
      size: undefined,
      minSize: 100,
    },
    {
      header: "Display Order",
      accessorKey: "display_order",
      size: undefined,
      minSize: 120,
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} setData={setData} />,
      size: 60,
      minSize: 60,
      enableHiding: false,
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
    enableSortingRemoval: false,
  });

  const handleOnsubmit = async () => {
    const token = await getAccessToken();

    const newErrors = {
      text: "",
      importance: "",
      options: "",
      display_order: "",
    };
    let hasError = false;

    if (!newQuestion.text || newQuestion.text.length > 500) {
      newErrors.text =
        "Question text is required and must be 1-500 characters.";
      hasError = true;
    }
    if (
      newQuestion.importance !== null &&
      (newQuestion.importance < 1 || newQuestion.importance > 5)
    ) {
      newErrors.importance = "Importance must be between 1 and 5.";
      hasError = true;
    }
    if (
      (newQuestion.type === "dropdown" || newQuestion.type === "yes_no") &&
      (!newQuestion.options || newQuestion.options.length === 0)
    ) {
      newErrors.options =
        "Options are required for dropdown or yes/no questions.";
      hasError = true;
    }
    if (newQuestion.display_order < 0) {
      newErrors.display_order = "Display order must be 0 or greater.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      const payload: any = {
        text: newQuestion.text,
        type: newQuestion.type,
        importance: newQuestion.importance ?? 1,
        display_order: newQuestion.display_order ?? data.length + 1,
      };

      if (newQuestion.type === "dropdown") {
        payload.options = newQuestion.options ?? [];
      }

      const response = await axios.post<Question>(
        `${API_BASE_URL}/api/v1/questions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData((prev) => [response.data, ...prev]);
      setNewQuestion({
        id: 0,
        text: "",
        type: "text",
        importance: 1,
        options: null,
        display_order: data.length + 1,
      });
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save question.");
    }
  };

  if (loading) return <p className="text-center py-4">Loading Questions...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;
  if (data.length === 0)
    return <p className="text-center py-4">No Questions found.</p>;

  return (
    <div className="space-y-4 w-full overflow-x-hidden px-2 sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-10">
        <div className="flex items-center justify-between gap-10 w-full">
          <div className="relative w-full sm:w-60">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer w-full ps-9",
                Boolean(table.getColumn("text")?.getFilterValue()) && "pe-9"
              )}
              value={
                (table.getColumn("text")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("text")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by question..."
              aria-label="Filter by question"
            />
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("text")?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("text")?.setFilterValue("");
                  inputRef.current?.focus();
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Columns3Icon size={16} className="mr-2" /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusIcon size={16} className="mr-2" /> Add question
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:max-w-md lg:max-w-xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>
                Fill out the details to add a new question.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Question Text</Label>
                <Textarea
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  placeholder="Enter question text (1-500 chars)"
                  className={cn(
                    errors.text ? "border-red-500" : "",
                    "min-h-[100px]"
                  )}
                />
                {errors.text && (
                  <p className="text-red-500 text-sm">{errors.text}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  value={newQuestion.type}
                  onValueChange={(value) =>
                    setNewQuestion({
                      ...newQuestion,
                      type: value as any,
                      options: null,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="yes_no">Yes / No</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Importance</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={newQuestion.importance ?? ""}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      importance:
                        e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </div>
              {(newQuestion.type === "dropdown" ||
                newQuestion.type === "yes_no") && (
                <div className="grid gap-2">
                  <Label>Options</Label>
                  <Input
                    value={newQuestion.options?.join(", ") ?? ""}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        options: e.target.value.split(",").map((o) => o.trim()),
                      })
                    }
                    placeholder="Option1, Option2, Option3"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button onClick={handleOnsubmit} variant={"outline"}>
                Add Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        het
      </div>

      <div className="bg-background overflow-x-auto border rounded-md w-full">
        <div className="min-w-[600px]">
          <Table className="min-w-full w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium"
                      style={{
                        minWidth: `${header.column.columnDef.minSize ?? 0}px`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 text-sm truncate max-w-[120px] sm:max-w-[200px] md:max-w-none"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="text-center py-4"
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-8 ">
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

function RowActions({
  row,
  setData,
}: {
  row: Row<Question>;
  setData: React.Dispatch<SetStateAction<Question[]>>;
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question>(row.original);
  const [loading, setLoading] = useState({ edit: false, delete: false });

  const validateQuestion = (question: Question) => {
    if (!question.text || question.text.length > 500) {
      alert("Question text is required and must be 1-500 characters.");
      return false;
    }
    if (
      question.importance !== null &&
      (question.importance < 1 || question.importance > 5)
    ) {
      alert("Importance must be between 1 and 5.");
      return false;
    }
    if (
      (question.type === "dropdown" || question.type === "yes_no") &&
      (!question.options || question.options.length === 0)
    ) {
      alert("Options are required for dropdown or yes/no questions.");
      return false;
    }
    return true;
  };

  const handleDelete = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      const questionId = row?.original?.id;
      if (!questionId) {
        throw new Error("Missing question id (row.original.id is falsy).");
      }
      const token = await getAccessToken();

      const url = `${API_BASE_URL}/api/v1/questions/${questionId}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { question_id: questionId },
      });

      setData((prev) => prev.filter((q) => q.id !== questionId));
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      console.error("Failed to delete question:", err);
      if (err?.response) {
        console.error("Status:", err.response.status);
        console.error("Response body:", err.response.data);
      } else {
        console.error("Message:", err.message);
      }
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleEditSave = async () => {
    if (!validateQuestion(editQuestion)) return;

    let options: string[] | null = null;
    if (editQuestion.type === "yes_no") {
      options = ["Yes", "No"];
    } else if (editQuestion.type === "dropdown") {
      options = editQuestion.options ?? [];
    }

    const payload = {
      id: row.original.id,
      text: editQuestion.text || null,
      type: editQuestion.type || null,
      importance: editQuestion.importance ?? null,
      display_order: editQuestion.display_order ?? null,
      options,
    };

    setLoading((prev) => ({ ...prev, edit: true }));

    try {
      const token = await getAccessToken();

      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/questions`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) =>
        prev.map((q) => (q.id === row.original.id ? response.data : q))
      );

      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Failed to update question:", err);
    } finally {
      setLoading((prev) => ({ ...prev, edit: false }));
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <EllipsisIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={loading.delete}
            >
              Cancel
            </Button>
            <Button
              className="bg-foreground text-white"
              onClick={handleDelete}
              disabled={loading.delete}
            >
              {loading.delete ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Text</Label>
              <Textarea
                value={editQuestion.text}
                onChange={(e) =>
                  setEditQuestion({ ...editQuestion, text: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select
                value={editQuestion.type}
                onValueChange={(val) =>
                  setEditQuestion({
                    ...editQuestion,
                    type: val as any,
                    options:
                      val === "yes_no" ? ["Yes", "No"] : editQuestion.options,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="yes_no">Yes/No</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Importance</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={editQuestion.importance ?? ""}
                onChange={(e) =>
                  setEditQuestion({
                    ...editQuestion,
                    importance: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                min={0}
                value={editQuestion.display_order ?? ""}
                onChange={(e) =>
                  setEditQuestion({
                    ...editQuestion,
                    display_order: Number(e.target.value),
                  })
                }
              />
            </div>
            {(editQuestion.type === "dropdown" ||
              editQuestion.type === "yes_no") && (
              <div className="grid gap-2">
                <Label>Options</Label>
                <Input
                  value={editQuestion.options?.join(", ") ?? ""}
                  onChange={(e) =>
                    setEditQuestion({
                      ...editQuestion,
                      options: e.target.value.split(",").map((o) => o.trim()),
                    })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={loading.edit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              variant={"outline"}
              disabled={loading.edit}
            >
              {loading.edit ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
