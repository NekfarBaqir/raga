"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { MetricCard } from "@/components/dash-component/MetricCard";
import { TrendChart } from "@/components/dash-component/TrendChart";
import { DashboardSections } from "@/components/dash-component/DashboardSections";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AdminAnalytics, DashboardOverview } from "@/types/analytics";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const accessToken = await getAccessToken();
        const [overviewResponse, analyticsResponse] = await Promise.all([
          axios.get<DashboardOverview>(
            `${API_BASE_URL}/api/v1/analytics/dashboard`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          ),
          axios.get<AdminAnalytics>(`${API_BASE_URL}/api/v1/analytics`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setOverview(overviewResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (err: any) {
        console.error("API fetch error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getAccessToken]);

  if (error)
    return (
      <div className="text-red-500 text-center pt-20 md:pt-4 md:ml-64 px-4 lg:px-6">
        Failed to load data. Please try again.
      </div>
    );

  if (loading) {
    return (
      <div className="container mx-auto pt-20 md:pt-4  px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    <div className="container mx-auto pt-20 md:pt-4   lg:px-6 space-y-8 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Button onClick={() => window.location.reload()} variant={"outline"}>
          Refresh
        </Button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Submissions"
          value={overview!.total_submissions}
          description="All requests submitted"
        />
        <MetricCard
          title="Pending Review"
          value={overview!.pending_review}
          color="text-yellow-500"
        />
        <MetricCard title="Avg Score" value={overview!.avg_score} />
        <MetricCard
          title="High Risk Count"
          value={overview!.high_risk_count}
          color="text-red-500"
        />
        <MetricCard
          title="Unresolved Contacts"
          value={overview!.unresolved_contacts}
          color="text-orange-500"
        />
        <MetricCard
          title="Submissions Today"
          value={overview!.submissions_today}
          color="text-green-500"
        />
      </section>

      <h1 className="text-2xl font-bold">Detailed Analytics</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Activity Trend (Last 30 Days)
        </h2>
        <TrendChart data={analytics!.activity_trend} />
      </section>
      <DashboardSections data={analytics!} />
    </div>
  );
}
