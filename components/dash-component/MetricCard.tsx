"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AreaChart, Area } from "recharts";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: number | string | null;
  description?: string;
  sparklineData?: number[];
  trend?: "up" | "down";
}

export function MetricCard({
  title,
  value,
  description,
  sparklineData,
  trend,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState<number>(
    typeof value === "number" ? 0 : 0
  );

  useEffect(() => {
    if (typeof value === "number") {
      let start = 0;
      const increment = Math.max(value / 50, 1);
      const interval = setInterval(() => {
        start += increment;
        if (start >= value) {
          start = value;
          clearInterval(interval);
        }
        setDisplayValue(Math.round(start));
      }, 20);
      return () => clearInterval(interval);
    }
  }, [value]);

  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-600"
      : "text-foreground";

  return (
    <Card className="w-full border shadow-sm hover:shadow-md transition">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger>
            <div className={`text-2xl sm:text-3xl font-bold ${trendColor}`}>
              {typeof value === "number" ? displayValue : value ?? "N/A"}
            </div>
          </TooltipTrigger>
          {description && <TooltipContent>{description}</TooltipContent>}
        </Tooltip>

        {sparklineData && sparklineData.length > 0 && (
          <div className="w-full h-16">
            <AreaChart
              width={300}
              height={60}
              data={sparklineData.map((val, i) => ({ value: val, idx: i }))}
            >
              <defs>
                <linearGradient id="sparkline" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--shadcn-primary)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--shadcn-primary)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--shadcn-primary)"
                fill="url(#sparkline)"
                strokeWidth={2}
              />
            </AreaChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
