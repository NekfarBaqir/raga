"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

interface APIMessage {
  id: number;
  sender: string;
  receiver: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminTestMessagesPage() {
  const [messages, setMessages] = useState<APIMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const SUBMISSION_ID = 19; // test submission
  const USER_EMAIL = "user@example.com"; // replace with real user email

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const token = await getAccessToken();
        console.log("🚀 ~ fetchMessages ~ token:", token);
        const res = await axios.get<APIMessage[]>(
          `${API_BASE_URL}/api/v1/submissions/${SUBMISSION_ID}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
        scrollToBottom();
      } catch (err: any) {
        console.error("Failed to fetch messages:", err);
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    const tempMessage: APIMessage = {
      id: Date.now(),
      sender: "admin",
      receiver: USER_EMAIL,
      message: newMessage.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    scrollToBottom();

    try {
      const token = await getAccessToken();
      await axios.post(
        `${API_BASE_URL}/api/v1/submissions/${SUBMISSION_ID}/messages`,
        {
          message: tempMessage.message,
          receiver: USER_EMAIL,
          submission_id: SUBMISSION_ID,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Message sent!");
    } catch (err) {
      console.error("Send message failed:", err);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold">Admin Test Messages</h1>

      <div className="border rounded-lg p-4 max-h-[500px] overflow-y-auto space-y-3">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.sender === "admin" ? "bg-blue-100 ml-auto" : "bg-gray-200"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-gray-500">
                {msg.sender} → {msg.receiver} |{" "}
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3">
        <Textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 resize-none min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={sending || !newMessage.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
