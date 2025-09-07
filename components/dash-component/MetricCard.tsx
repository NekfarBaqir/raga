import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: number | string | null;
  description?: string;
  color?: string;
}

export function MetricCard({
  title,
  value,
  description,
  color = "text-black",
}: MetricCardProps) {
  const displayValue = value ?? "N/A";
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tooltip>
          <TooltipTrigger>
            <div className={`text-2xl font-bold ${color}`}>{displayValue}</div>
          </TooltipTrigger>
          {description && <TooltipContent>{description}</TooltipContent>}
        </Tooltip>
      </CardContent>
    </Card>
  );
}
