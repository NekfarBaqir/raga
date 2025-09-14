"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { getAccessToken } from "@auth0/nextjs-auth0";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const currentUser: User = { id: "1", name: "You" };
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const token = await getAccessToken();
      const res = await axios.get<Message[]>(
        `${API_BASE_URL}/api/v1/contacts/${currentUser.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);

    try {
      const token = await getAccessToken();
      const res = await axios.post<Message>(
        `${API_BASE_URL}/api/v1/contacts/${currentUser.id}/messages`,
        {
          senderId: currentUser.id,
          receiverId: "2",
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl md:2xl font-bold tracking-tight">
          Contact Admin
        </h1>
        <p className="text-muted-foreground">
          Get in touch with our support team.
        </p>
      </div>

      <div className="w-full max-w-6xl">
        <Card className="rounded-xl h-[600px] flex flex-col">
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-muted/20 space-y-3 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200">
            {messages.length > 0 ? (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-end ${
                    m.senderId === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 text-sm max-w-[70%] break-words ${
                      m.senderId === currentUser.id
                        ? "bg-background text-foreground rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none"
                        : "bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none"
                    }`}
                  >
                    {m.content}
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {formatTimestamp(m.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground italic text-sm text-center mt-10">
                No messages yet.
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 flex gap-3 items-center border-t">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 resize-none rounded-2xl border px-4 py-1"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="p-3 rounded-full disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <SendIcon className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
