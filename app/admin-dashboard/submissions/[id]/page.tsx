"use client";

import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Loader2,
  MessageSquare,
  RefreshCwIcon,
  Send,
  User,
} from "lucide-react";
import { toast, Toaster } from "sonner";

interface SubmissionDetail {
  id: number;
  team_name: string;
  name: string;
  email: string;
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

interface APIMessage {
  id: number;
  sender: string;
  receiver?: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

type LocalMessage = {
  id: number;
  sender: "user" | "admin";
  message: string;
  is_read?: boolean;
  created_at?: string;
  temporary?: boolean;
};

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingStatus, setEditingStatus] =
    useState<SubmissionDetail["status"]>("pending");
  const [saving, setSaving] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const scrollToBottom = () => {
    setTimeout(() => {
      const el = messagesContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  };

  const mapApiToLocal = (
    m: APIMessage,
    submissionEmail?: string
  ): LocalMessage => {
    const isUser = submissionEmail ? m.sender === submissionEmail : false;
    return {
      id: m.id,
      sender: isUser ? "user" : "admin",
      message: m.message,
      is_read: !!m.is_read,
      created_at: m.created_at,
    };
  };

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
      const sub = response.data;
      setSubmission(sub);
      setEditingStatus(sub.status);

      // Fetch messages
      const messagesRes = await axios.get<APIMessage[]>(
        `${API_BASE_URL}/api/v1/submissions/${sub.id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const mapped = messagesRes.data.map((m) => mapApiToLocal(m, sub.email));
      setMessages(mapped);
      scrollToBottom();
    } catch (err: any) {
      console.error(err);
      setError("Failed to load submission details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !submission) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    const tempId = Date.now();
    const tempMsg: LocalMessage = {
      id: tempId,
      sender: "admin",
      message: messageText,
      temporary: true,
      created_at: new Date().toISOString(),
      is_read: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();

    setSending(true);
    try {
      const token = await getAccessToken();
      const body = {
        message: messageText,
        receiver: submission.email,
        submission_id: submission.id,
      };
      const res = await axios.post<APIMessage>(
        `${API_BASE_URL}/api/v1/submissions/${submission.id}/messages`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const mapped = mapApiToLocal(res.data, submission.email);
      setMessages((prev) => prev.map((m) => (m.id === tempId ? mapped : m)));
      scrollToBottom();
      toast.success("Message sent!");
    } catch (err) {
      console.error("Send message failed:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
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
            <TabsTrigger
              value="chat"
              className="flex items-center cursor-pointer gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <MessageSquare className="h-4 w-4" /> Chat
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
                          {editingStatus.charAt(0).toUpperCase() +
                            editingStatus.slice(1)}
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

          <TabsContent
            value="chat"
            className="mt-10 grid place-items-center px-4"
          >
            <div className="w-full max-w-6xl">
              <Card className="rounded-xl h-[600px] flex flex-col relative">
                <button onClick={fetchSubmission} className="absolute cursor-pointer top-2 right-2">
                  <RefreshCwIcon className="w-5 h-5" />
                </button>
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Chat
                  </h3>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-6 py-4 bg-muted/20 space-y-3 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200"
                >
                  {messages.length > 0 ? (
                    messages.map((m, i) => (
                      <div
                        key={m.id + "-" + i}
                        className={`flex items-end ${
                          m.sender === "admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 text-sm max-w-[70%] break-words ${
                            m.sender === "admin"
                              ? "bg-background text-foreground rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none"
                              : "bg-accent text-foreground rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none"
                          }`}
                        >
                          {m.message}
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {m.created_at
                              ? new Date(m.created_at).toLocaleTimeString()
                              : ""}
                            {m.temporary ? " (sending...)" : ""}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center mt-10">
                      No messages yet.
                    </p>
                  )}
                </div>

                <div className="px-6 py-2 border-t border-border flex gap-2 items-center">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 resize-none h-12"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    variant={"outline"}
                    disabled={sending || !newMessage.trim()}
                    className="p-5 cursor-pointer"
                  >
                    <Send className="h-7 w-7" />
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
