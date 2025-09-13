"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, Brain, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

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
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<
    { sender: "user" | "admin"; text: string }[]
  >([
    { sender: "admin", text: "Welcome! You can ask your questions here." },
    { sender: "user", text: "Thanks, I will." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const token = await getAccessToken();

        const response = await axios.get<SubmissionDetail>(
          `${API_BASE_URL}/api/v1/submissions/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        9;
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: newMessage }]);
    setNewMessage("");
    toast.success("Message sent!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        <span className="ml-2">Loading submission details...</span>
      </div>
    );

  if (error) return <p>{error}</p>;
  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <p className="text-lg text-muted-foreground">
          You have not submitted an application yet.
        </p>
        <Button
          variant="default"
          onClick={() => (window.location.href = "/apply")}
        >
          Go to Apply Page
        </Button>
      </div>
    );
  }

  return (
    <section className="py-16">
      <Toaster position="top-center" />
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <Badge variant="outline" className="px-6 rounded-md py-3 text-lg">
            Team : {submission.team_name}
          </Badge>
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
              className="flex items-center cursor-pointer  gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <User className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="flex items-center cursor-pointer gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <Brain className="h-4 w-4" />
              AI Evaluation
            </TabsTrigger>

            <TabsTrigger
              value="questions"
              className="flex items-center cursor-pointer gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <MessageSquare className="h-4 w-4" />
              Ask Question
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="mt-10 grid place-items-center"
          >
            <Card className="max-w-6xl w-full border rounded-2xl  bg-background">
              <CardContent className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Applicant Information
                  </h2>
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

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Notes
                    </dt>
                    <dd className="mt-2">
                      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-base text-foreground">
                        {submission.notes || "No notes added."}
                      </div>
                    </dd>
                  </div>
                </dl>

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
            <Card className="w-full max-w-6xl  border border-gray-200 rounded-2xl bg-white">
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

          <TabsContent
            value="questions"
            className="mt-10 grid place-items-center px-4"
          >
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-md">
                <CardContent className="p-0 h-[480px] flex flex-col">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-foreground">
                      Message History
                    </h3>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4 bg-muted/20">
                    {messages.length > 0 ? (
                      messages.map((m, i) => (
                        <div
                          key={i}
                          className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                            m.sender === "user"
                              ? "ml-auto bg-neutral-200 text-foreground rounded-br-none"
                              : "mr-auto bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          {m.text}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic text-sm">
                        No messages yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="p-0 h-[480px] flex flex-col">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-foreground">
                      Send a Message
                    </h3>
                  </div>
                  <div className="flex-1 flex flex-col px-6 py-4">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 resize-none"
                    />
                  </div>
                  <div className="px-6 py-4 border-t">
                    <Button
                      onClick={handleSendMessage}
                      className="w-full cursor-pointer py-6"
                      variant={"outline"}
                    >
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
