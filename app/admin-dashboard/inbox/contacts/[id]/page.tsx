"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon, MessageSquareIcon } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export default function ContactDetailPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "user",
      content: "Hello, I have a login issue.",
      timestamp: "2025-09-13T10:30:00",
    },
    {
      id: "2",
      senderId: "admin",
      content: "Hi! Can you explain the problem?",
      timestamp: "2025-09-13T11:00:00",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = "admin";

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = (content: string) => {
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        senderId: currentUserId,
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");
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
      <h1 className="text-3xl font-bold tracking-tight">Contact Message</h1>

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
                        {msg.senderId === currentUserId ? "A" : "U"}
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
