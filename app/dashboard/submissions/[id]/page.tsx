"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAccessToken } from "@auth0/nextjs-auth0";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AIEvaluation from "@/components/ui/Typewriter";

interface SubmissionDetail {
  id: number;
  team_name: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: "approved" | "pending" | "rejected";
  score: number;
  feedback: string;
  strengths: string;
  weaknesses: string;
  keywords: string;
  risk_level: string;
  created_at: string;
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
    } catch (err: any) {
      console.error("Failed to update submission:", err);
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
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <User className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <Brain className="h-4 w-4" />
              AI Evaluation
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="mt-10 grid place-items-center"
          >
            <Card className="max-w-5xl w-full shadow-xl border rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Applicant Information</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing((prev) => !prev)}
                    className="flex items-center gap-2"
                  >
                    {editing ? "Cancel Edit" : "Edit"}
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse border border-gray-200">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-500 w-1/3">
                          Name
                        </td>
                        <td className="px-4 py-3">{submission.name}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-500">
                          Email
                        </td>
                        <td className="px-4 py-3">{submission.email}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-500">
                          Phone
                        </td>
                        <td className="px-4 py-3">{submission.phone}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-500">
                          Status
                        </td>
                        <td className="px-4 py-3">
                          {editing ? (
                            <Select
                              value={editingStatus}
                              onValueChange={(v) =>
                                setEditingStatus(
                                  v as SubmissionDetail["status"]
                                )
                              }
                            >
                              <SelectTrigger className="w-1/2">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="approved">
                                  Approved
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">
                                  Rejected
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-gray-700 font-medium">
                              {editingStatus}
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-500 align-top">
                          Notes
                        </td>
                        <td className="px-4 py-3">
                          {editing ? (
                            <Input
                              value={editingNotes}
                              onChange={(e) => setEditingNotes(e.target.value)}
                              className="w-full"
                            />
                          ) : (
                            <p className="text-gray-700">
                              {editingNotes || "No notes added."}
                            </p>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {editing && (
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="transition-transform hover:scale-105"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}

                <p className="text-sm text-gray-400 mt-4">
                  Submitted: {new Date(submission.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="evaluation"
            className="mt-10 grid place-items-center"
          >
            <Card className="max-w-5xl w-full shadow-xl border rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-xl font-bold mb-4">AI Evaluation</h2>
                <AIEvaluation submission={submission} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
