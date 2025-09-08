"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { MetricCard } from "@/components/dash-component/MetricCard";
import { DashboardSections } from "@/components/dash-component/DashboardSections";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/dash-component/TrendChart";
import { AccordionItem } from "@radix-ui/react-accordion";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardPage() {
  const [overview, setOverview] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const accessToken = await getAccessToken();
        const response = await axios.get(`${API_BASE_URL}/api/v1/analytics`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOverview(response.data);
      } catch (err: any) {
        console.error("API fetch error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error)
    return (
      <div className="text-red-500 text-center pt-20 md:pt-4 md:ml-64 px-4 lg:px-6">
        {error}
      </div>
    );

  if (loading) {
    return (
      <div className="container mx-auto pt-20 md:pt-4 px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-20 md:pt-4 lg:px-6 space-y-8 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh
        </Button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Submissions"
          value={overview.submissions.total}
          description="All requests submitted"
        />
        <MetricCard
          title="Pending Review"
          value={overview.needs_action.pending_review}
          color="text-yellow-500"
        />
        <MetricCard
          title="Unresolved Contacts"
          value={overview.needs_action.unresolved_contacts}
          color="text-orange-500"
        />
        <MetricCard
          title="Submissions Today"
          value={overview.submissions.received_today}
          color="text-green-500"
        />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent className="w-full overflow-x-auto">
          <div className="h-[400px]">
            <TrendChart data={overview?.daily_activity} />
          </div>
        </CardContent>
      </Card>

      {/* <h1 className="text-2xl font-bold">Detailed Analytics</h1> */}
      {/* <DashboardSections data={overview} /> */}
    </div>
  );
}
