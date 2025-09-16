"use client";

import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Loader2,
  User,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { SubmissionDetail } from "@/types";



export default function SubmissionDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editingStatus, setEditingStatus] =
    useState<SubmissionDetail["status"]>("pending");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const {
    data: submission,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
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
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (submission) {
      setEditingStatus(submission.status);
    }
  }, [submission]);

  const updateStatusMutation = useMutation({
    mutationFn: async (status: SubmissionDetail["status"]) => {
      if (!submission) throw new Error("No submission data");
      const token = await getAccessToken();
      const body = {
        status: status,
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
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", id] });
      if (data.status) {
        setEditingStatus(data.status);
      }
      setEditing(false);
      toast.success("Your status has been updated successfully!", {
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
    },
    onError: (error) => {
      console.error("Failed to update submission:", error);
      toast.error("Whoops! Something went wrong while updating status.", {
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
    },
  });


  const handleSave = async () => {
    if (!submission) return;
    updateStatusMutation.mutate(editingStatus);
  };


  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        <span className="ml-2">Loading submission details...</span>
      </div>
    );

  if (error) return <p>Error loading submission: {error.message}</p>;
  if (!submission) return <p>No submission found.</p>;

  return (
    <section className="">
      <Toaster position="top-center" />
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <h1 className="max-w-2xl text-xl font-bold md:text-2xl">
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
              className="flex items-center cursor-pointer gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <User className="h-4 w-4" /> Details
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="flex items-center cursor-pointer gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <Brain className="h-4 w-4" /> AI Evaluation
            </TabsTrigger>

          </TabsList>

          <TabsContent
            value="details"
            className="mt-10 grid place-items-center"
          >
            <Card className="max-w-5xl w-full border rounded-2xl shadow-sm bg-background relative">
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
                          {submission.status.charAt(0).toUpperCase() +
                            submission.status.slice(1)}
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
                      disabled={updateStatusMutation.isPending}
                      variant={"outline"}
                    >
                      {updateStatusMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
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
            <Card className="w-full max-w-5xl shadow-xl border  rounded-2xl bg-backround">
              <CardContent className="p-6 md:p-8 space-y-6">
                <h2 className="text-3xl font-bold text-foreground text-center">
                  AI Evaluation Report
                </h2>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Score :
                  </h3>
                  <p className="text-muted-foreground bg-popover p-3 rounded-lg border ">
                    {submission.score ?? "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Feedback :
                  </h3>
                  <p className="text-muted-foreground bg-popover p-4 rounded-lg border ">
                    {submission.feedback || "No feedback provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      Strengths :
                    </h3>
                    <p className="text-muted-foreground bg-popover p-3 rounded-lg border">
                      {submission.strengths || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      Weaknesses :
                    </h3>
                    <p className="text-muted-foreground bg-popover p-3 rounded-lg border">
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
