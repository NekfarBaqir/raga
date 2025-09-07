import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentTableProps {
  title: string;
  items: Array<Record<string, any>>;
  columns: string[];
}

export function RecentTable({ title, items, columns }: RecentTableProps) {
  if (!items.length) return <p>No recent items.</p>;
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>{item[col] ?? "N/A"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
