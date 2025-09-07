"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskPieChartProps {
  distribution: { [key: string]: number };
}

export function RiskPieChart({ distribution }: RiskPieChartProps) {
  const labels = Object.keys(distribution);
  const dataValues = Object.values(distribution);

  const chartData = {
    labels: labels.map(
      (label) => label.charAt(0).toUpperCase() + label.slice(1)
    ), 
    datasets: [
      {
        data: dataValues,
        backgroundColor: ["#ef4444", "#facc15", "#22c55e"],
        borderColor: ["#fff"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80 md:h-96">
          {dataValues.every((val) => val === 0) ? (
            <p className="text-center text-gray-500">No risk data available</p>
          ) : (
            <Pie data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
