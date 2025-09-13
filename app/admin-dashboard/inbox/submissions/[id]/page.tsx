"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon, MessageSquareIcon } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { getAccessToken } from "@auth0/nextjs-auth0";

interface APIMessage {
  id: number;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface LocalMessage {
  id: string | number;
  senderId: string;
  content: string;
  timestamp: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SubmissionDetailPage() {
  const { submissionId } = useParams();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = "admin"; // because admin is logged in

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await getAccessToken();
        const res = await axios.get<APIMessage[]>(
          `${API_BASE_URL}/api/v1/submissions/${submissionId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mapped: LocalMessage[] = res.data.map((msg) => ({
          id: msg.id,
          senderId: msg.sender === "admin@example.com" ? "admin" : "user",
          content: msg.message,
          timestamp: msg.created_at,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        toast.error("Could not load messages.");
      }
    };

    if (submissionId) fetchMessages();
  }, [submissionId]);

  // ✅ Send message as admin
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const tempId = Date.now();
    const tempMsg: LocalMessage = {
      id: tempId,
      senderId: currentUserId,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInput("");
    scrollToBottom();

    try {
      const token = await getAccessToken();
      const body = {
        message: content,
        submission_id: submissionId,
        receiver: "user@example.com", // 👉 replace with actual user email
      };

      const res = await axios.post<APIMessage>(
        `${API_BASE_URL}/api/v1/submissions/${submissionId}/messages`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const created = res.data;
      const mapped: LocalMessage = {
        id: created.id,
        senderId: "admin",
        content: created.message,
        timestamp: created.created_at,
      };

      setMessages((prev) => prev.map((m) => (m.id === tempId ? mapped : m)));

      toast.success("Message sent!");
    } catch (err) {
      console.error("Send message failed:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      toast.error("Failed to send message.");
    }
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Submission #{submissionId}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-primary" /> Message
              History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 max-h-[600px] overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-sm">No messages yet.</p>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-150 hover:bg-primary/5 ${
                      msg.senderId === currentUserId
                        ? "bg-primary/10 ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {msg.senderId === "admin" ? "A" : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="bg-gray-50">
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              placeholder="Type your message..."
              className="resize-none min-h-[120px] max-h-[250px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(input.trim());
                }
              }}
            />
            <Button
              className="self-end px-4 py-3"
              variant="outline"
              disabled={!input.trim()}
              onClick={() => handleSendMessage(input.trim())}
            >
              <SendIcon className="w-4 h-4 mr-2" /> Send
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
