"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface BackendMessage {
  id: number;
  contact_id: number;
  sender: string;
  receiver: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Page() {
  const params = useParams();
  const contactId = Number(params.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await axios.get<BackendMessage[]>(
        `${API_BASE_URL}/api/v1/contacts/${contactId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const mapped = res.data.map((m) => ({
        id: String(m.id),
        senderId: m.sender,
        receiverId: m.receiver,
        content: m.message,
        timestamp: m.created_at,
        read: m.is_read,
      }));

      setMessages(mapped);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const accessToken = await getAccessToken();

      const senderEmail =
        messages.find((m) => m.senderId !== "admin@example.com")?.senderId ||
        "user@example.com";

      const receiverEmail = "admin@example.com";

      const res = await axios.post<BackendMessage>(
        `${API_BASE_URL}/api/v1/contacts/${contactId}/messages`,
        {
          contact_id: contactId,
          sender: senderEmail,
          receiver: receiverEmail,
          message: newMessage,
          is_read: false,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const newMsg: Message = {
        id: String(res.data.id),
        senderId: res.data.sender,
        receiverId: res.data.receiver,
        content: res.data.message,
        timestamp: res.data.created_at,
        read: res.data.is_read,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Message failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading)
    return (
      <p className="text-center mt-10 text-muted-foreground">Loading chat...</p>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-5">
      <h1 className="text-2xl font-bold"></h1>

      <Card className="rounded-xl h-[600px] flex flex-col">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">Chat</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-muted/20 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground mt-10">
              No messages yet.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end ${
                  m.senderId === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 max-w-[70%] text-sm break-words rounded-2xl ${
                    m.senderId === "admin@example.com"
                      ? "bg-background text-foreground rounded-br-none"
                      : "bg-primary text-primary-foreground rounded-bl-none"
                  }`}
                >
                  {m.content}
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center px-4 py-3 gap-3 border-t">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-2xl border px-4 py-2"
          />
          <Button
            onClick={handleSendMessage}
            variant="outline"
            disabled={sending}
            className="p-3 cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          >
            {sending ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
