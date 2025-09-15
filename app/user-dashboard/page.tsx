"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { getAccessToken } from "@auth0/nextjs-auth0";

interface Submission {
  status: "pending" | "approved" | "rejected";
  feedback: string;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchSubmission(): Promise<Submission | null> {
  const token = await getAccessToken();
  const { data } = await axios.get(`${API_BASE_URL}/api/v1/submissions/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

const UserDashboard = () => {
  const {
    data: submission,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["submission"],
    queryFn: fetchSubmission,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-chart-2" />
        <p className="text-lg text-muted-foreground">
          Loading submission status...
        </p>
      </div>
    );

  if (isError || !submission)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-lg text-red-600">
          {isError ? "Failed to load submission." : "No submission found."}
        </p>
      </div>
    );

  const statusColor =
    submission.status === "approved"
      ? "green"
      : submission.status === "rejected"
      ? "red"
      : "orange";

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome to the Dashboard
      </h1>

      <Card className="shadow-lg border">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span>
            <Badge className={`bg-${statusColor}-100 text-${statusColor}-800`}>
              {submission.status.toUpperCase()}
            </Badge>
          </div>

          <div>
            <span className="font-semibold">Feedback:</span>
            <p className="mt-1 text-muted-foreground">{submission.feedback}</p>
          </div>

          <div>
            <span className="font-semibold">Submitted on:</span>
            <p className="mt-1 text-muted-foreground">
              {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
