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
  ChevronDownIcon,
  ChevronUpIcon,
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

const multiColumnFilterFn: FilterFn<Question> = (
  row,
  columnId,
  filterValue
) => {
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
        <div className="font-medium">{row.getValue("text")}</div>
      ),
      size: 300,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    { header: "Type", accessorKey: "type", size: 100 },
    { header: "Importance", accessorKey: "importance", size: 100 },
    { header: "Display Order", accessorKey: "display_order", size: 100 },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} setData={setData} />,
      size: 60,
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
      const payload: any = { ...newQuestion };
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
      setError(err.response?.data?.detail || "Failed to save question.");
    }
  };

  if (loading) return <p className="text-center">Loading Questions...</p>;
  if (error) return <p className="text-center">{error}</p>;
  if (data.length === 0)
    return <p className="text-center">No Questions found.</p>;

  return (
    <div className="space-y-4 px-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
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
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
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
              <Button variant="outline">
                <Columns3Icon size={16} /> View
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
              <PlusIcon size={16} /> Add question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>
                Fill out the details to add a new question.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label>Question Text</Label>
                <Textarea
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  placeholder="Enter question text (1-500 chars)"
                  className={errors.text ? "border-red-500" : ""}
                />
                {errors.text && (
                  <p className="text-red-500 text-sm">{errors.text}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
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
              <div className="grid grid-cols-1 gap-2">
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
                <div className="grid grid-cols-1 gap-2">
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
            <DialogFooter>
              <Button onClick={handleOnsubmit} variant={"outline"}>
                Add Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="text-center"
                >
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label htmlFor={id}>Rows per page</Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={id} className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.firstPage()}
            variant={"outline"}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirstIcon />
          </Button>
          <Button
            onClick={() => table.previousPage()}
            variant={"outline"}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            onClick={() => table.nextPage()}
            variant={"outline"}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            onClick={() => table.lastPage()}
            variant={"outline"}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLastIcon />
          </Button>
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

  const handleDelete = async () => {
    try {
      const token = await getAccessToken();
      await axios.delete(
        `${API_BASE_URL}/api/v1/questions/${row.original.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((q) => q.id !== row.original.id));
      setIsDeleteDialogOpen(false);
    } catch (err) {
      alert("Failed to delete question.");
    }
  };

  const handleEditSave = async () => {
    try {
      const token = await getAccessToken();
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/questions/${row.original.id}`,
        editQuestion,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) =>
        prev.map((q) => (q.id === row.original.id ? response.data : q))
      );
      setIsEditDialogOpen(false);
    } catch (err) {
      alert("Failed to update question.");
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
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-foreground text-white" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Text</Label>
            <Textarea
              value={editQuestion.text}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, text: e.target.value })
              }
            />
            <Label>Type</Label>
            <Select
              value={editQuestion.type}
              onValueChange={(val) =>
                setEditQuestion({ ...editQuestion, type: val as any })
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
            {(editQuestion.type === "dropdown" ||
              editQuestion.type === "yes_no") && (
              <>
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
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave} variant={"outline"}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
