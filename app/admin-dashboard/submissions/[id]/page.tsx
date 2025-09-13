"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAccessToken } from "@auth0/nextjs-auth0";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, Brain, CheckCircle, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface SubmissionDetail {
  id: number;
  team_name: string;
  name: string;
  email: string;
  notes: string;
  status: "approved" | "pending" | "rejected";
  score: number;
  feedback: string;
  strengths: string;
  weaknesses: string;
  keywords: string;
  risk_level: string;
  created_at: string;
  answers: {
    question_text: string;
    answer: string;
  }[];
}

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingStatus, setEditingStatus] =
    useState<SubmissionDetail["status"]>("pending");
  const [editingNotes, setEditingNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const token = await getAccessToken();

        const response = await axios.get<SubmissionDetail>(
          `${API_BASE_URL}/api/v1/submissions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setSubmission(response.data);
        setEditingStatus(response.data.status);
        setEditingNotes(response.data.notes);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load submission details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubmission();
  }, [API_BASE_URL, id]);

  const handleSave = async () => {
    if (!submission) return;

    setSaving(true);

    const statusMap: Record<string, SubmissionDetail["status"]> = {
      Approved: "approved",
      Pending: "pending",
      Rejected: "rejected",
    };
    const toastId = toast.loading("⏳ Updating the status...");

    try {
      const token = await getAccessToken();
      const body = {
        status: statusMap[editingStatus] || editingStatus,
        notes: editingNotes,
        submission_id: submission.id,
      };
      const response = await axios.patch<SubmissionDetail>(
        `${API_BASE_URL}/api/v1/submissions/${submission.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response", response);
      setSubmission((prev) => prev && { ...prev, ...response.data });
      setEditing(false);
      toast.success("Your status has been updated successfully!", {
        id: toastId,
        duration: 4000,
        icon: <CheckCircle className="h-5 w-5" />,
        style: {
          borderRadius: "10px",
          background: "#006400",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
        },
      });
    } catch (err: any) {
      console.error("Failed to update submission:", err);
      toast.error("Whoops! Something went wrong while updating status.", {
        id: toastId,
        duration: 4000,
        icon: <AlertCircle className="h-5 w-5" />,
        style: {
          borderRadius: "10px",
          background: "#8B0000",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        <span className="ml-2">Loading submission details...</span>
      </div>
    );

  if (error) return <p>{error}</p>;
  if (!submission) return <p>No submission found.</p>;

  return (
    <section className="py-16">
      <Toaster position="top-center" />
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <Badge variant="outline" className="px-4 py-1 text-sm">
            Team: {submission.team_name}
          </Badge>
          <h1 className="max-w-2xl text-3xl font-bold md:text-4xl">
            Submission Details & AI Evaluation
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Review the applicant information and AI-powered evaluation
          </p>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="flex flex-col sm:flex-row justify-center gap-4">
            <TabsTrigger
              value="details"
              className="flex items-center cursor-pointer  gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <User className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="flex items-center cursor-pointer gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <Brain className="h-4 w-4" />
              AI Evaluation
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="mt-10 grid place-items-center"
          >
            <Card className="max-w-5xl w-full border rounded-2xl shadow-sm bg-background">
              <CardContent className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Applicant Information
                  </h2>
                  <Button
                    variant={editing ? "outline" : "secondary"}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setEditing((prev) => !prev)}
                  >
                    {editing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Team Name
                    </dt>
                    <dd className="mt-1">
                      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-base font-semibold text-foreground">
                        {submission.team_name}
                      </div>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-base text-foreground">
                        {submission.email}
                      </div>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Status
                    </dt>
                    <dd className="mt-1">
                      {editing ? (
                        <Select
                          value={editingStatus}
                          onValueChange={(v) =>
                            setEditingStatus(v as SubmissionDetail["status"])
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-base font-medium text-foreground">
                          {editingStatus.charAt(0).toUpperCase() +
                            editingStatus.slice(1)}
                        </div>
                      )}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Notes
                    </dt>
                    <dd className="mt-2">
                      {editing ? (
                        <Textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          placeholder="Enter notes..."
                        />
                      ) : (
                        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-base text-foreground">
                          {editingNotes || "No notes added."}
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>

                {editing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="cursor-pointer"
                      disabled={saving}
                      variant={"outline"}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(submission.created_at).toLocaleString()}
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Answers
                  </h3>
                  {submission.answers && submission.answers.length > 0 ? (
                    <div className="space-y-4">
                      {submission.answers.map((ans, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-border bg-muted/40 p-5 hover:bg-muted/60 transition-colors"
                        >
                          <p className="font-medium text-foreground">
                            {idx + 1}. {ans.question_text}
                          </p>
                          <p className="mt-2 text-muted-foreground">
                            {ans.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No answers provided.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="evaluation"
            className="mt-10 grid place-items-center px-4"
          >
            <Card className="w-full max-w-5xl shadow-xl border border-gray-200 rounded-2xl bg-white">
              <CardContent className="p-6 md:p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center">
                  AI Evaluation Report
                </h2>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Score :
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {submission.score ?? "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Feedback :
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {submission.feedback || "No feedback provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Strengths :
                    </h3>
                    <p className="text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                      {submission.strengths || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Weaknesses :
                    </h3>
                    <p className="text-gray-600 bg-red-50 p-3 rounded-lg border border-red-100">
                      {submission.weaknesses || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
