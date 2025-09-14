"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { Loader2, RefreshCwIcon, SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

        const receiverEmail = messages?.[0]?.receiverId
      const res = await axios.post<BackendMessage>(
        `${API_BASE_URL}/api/v1/contacts/${contactId}/messages`,
        {
          contact_id: contactId,
          receiver: receiverEmail,
          message: newMessage,
    
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
    return () => {
      clearInterval(interval);
    
    };
  }, [contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading)
    return (
      <p className="text-center mt-10 text-muted-foreground">Loading chat...</p>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-5 overflow-hidden h-[90vh]">
      <Card className="rounded-xl h-full flex flex-col overflow-hidden relative">
        <button onClick={fetchMessages} className="absolute cursor-pointer top-2 right-2">
          <RefreshCwIcon className="w-5 h-5" />
        </button>
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">Chat</h3>
        </div>

        <div className="flex-1 overflow-hidden w-full">
          <div className="h-full overflow-y-auto px-4 py-3 space-y-3 bg-muted/20 scrollbar-thin scrollbar-thumb-neutral-400  scrollbar-track-neutral-200">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground mt-10 h-full flex justify-center items-center">
                No messages yet.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-end ${
                    m.senderId?.includes("raga")? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 max-w-[70%] text-sm break-words rounded-2xl ${
                      m.senderId?.includes("raga")
                        ? "bg-gray-200 text-foreground rounded-br-none"
                        : "bg-primary/10 text-foreground rounded-bl-none"
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
        </div>

        <div className="flex items-center px-4 py-3 gap-3 border rounded-2xl border-accent bg-background m-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-transparent !border-0 focus:!border-0 focus:!outline-0 focus:!ring-0 outline-none ring-0 "
          />
          <Button
            onClick={handleSendMessage}
            variant="default"
            disabled={sending}
            className="p-3 cursor-pointer rounded-full bg-primary text-white aspect-square flex justify-center items-center min-w-5 min-h-5" 
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
