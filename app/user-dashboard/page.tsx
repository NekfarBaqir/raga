"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { getAccessToken } from "@auth0/nextjs-auth0";

interface Submission {
  status: "pending" | "approved" | "rejected";
  feedback: string;
  created_at: string;
}

const UserDashboard = () => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/submissions/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubmission(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load submission details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [API_BASE_URL]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        <p className="text-lg text-muted-foreground">
          Loading submission status...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  if (!submission)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-10 h-10 text-gray-400" />
        <p className="text-lg text-gray-500">No submission found.</p>
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

      <Card className="shadow-lg border border-gray-200">
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
