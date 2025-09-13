"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon, MessageSquareIcon } from "lucide-react";
import axios from "axios";

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
  const [input, setInput] = useState("");
  const currentUser: User = { id: "1", name: "You" };
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get<Message[]>("/api/chat/history", {
        params: { userId: currentUser.id },
      });
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

  const handleSendMessage = async (content: string) => {
    if (!content) return;

    try {
      const res = await axios.post<Message>("/api/chat/send", {
        senderId: currentUser.id,
        receiverId: "2",
        content,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return date.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Admin</h1>
        <p className="text-muted-foreground">
          Get in touch with our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Message History */}
        <Card className="flex flex-col">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-primary" />
              Message History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 max-h-[600px] overflow-y-auto p-4">
            {loading ? (
              <p className="text-muted-foreground text-sm">
                Loading messages...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No messages yet. Start the conversation on the right.
              </p>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-150 hover:bg-primary/5 ${
                      msg.senderId === currentUser.id
                        ? "bg-primary/10 ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {msg.senderId === currentUser.id ? "U" : "A"}
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

        {/* Send Message */}
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
                  setInput("");
                }
              }}
            />
            <Button
              className="self-end px-4 py-3"
              variant={"outline"}
              disabled={!input.trim()}
              onClick={() => {
                handleSendMessage(input.trim());
                setInput("");
              }}
            >
              <SendIcon className="w-4 h-4 mr-2" /> Send
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
