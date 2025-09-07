"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrendChartProps {
  data: Array<{ activity_date: string; submissions: number; contacts: number }>;
}

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "var(--chart-1)",
  },
  contacts: {
    label: "Contacts",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TrendChart({ data }: TrendChartProps) {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  const chartData = useMemo(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return data
      .filter((d) => new Date(d.activity_date) >= cutoff)
      .map((d) => ({
        date: new Date(d.activity_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        submissions: d.submissions,
        contacts: d.contacts,
      }));
  }, [data, range]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0].submissions + chartData[0].contacts;
    const last =
      chartData[chartData.length - 1].submissions +
      chartData[chartData.length - 1].contacts;

    if (first === 0) return null;
    const percent = ((last - first) / first) * 100;
    return percent;
  }, [chartData]);

  return (
    <div className="w-full">
      <Card className="w-full rounded-none border-x-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Activity Trend</CardTitle>
            <CardDescription>
              Submissions and Contacts over time
            </CardDescription>
          </div>
          <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-[150px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-64">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 8, right: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="submissions"
                type="natural"
                fill="var(--color-submissions)"
                fillOpacity={0.4}
                stroke="var(--color-submissions)"
                stackId="a"
              />
              <Area
                dataKey="contacts"
                type="natural"
                fill="var(--color-contacts)"
                fillOpacity={0.4}
                stroke="var(--color-contacts)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              {trend !== null ? (
                <div className="flex items-center gap-2 leading-none font-medium">
                  {trend > 0 ? (
                    <>
                      Trending up by {trend.toFixed(1)}%{" "}
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      Trending down by {Math.abs(trend).toFixed(1)}%{" "}
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Not enough data to calculate trend
                </div>
              )}
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                Showing last {range.replace("d", " days")}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
