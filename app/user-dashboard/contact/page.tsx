"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { Loader2, RefreshCwIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Message {
  id: number;
  contact_id: number;
  sender: string;
  receiver: string;
  message: string;
  is_read: boolean;
  created_at: string;
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

interface Contact {
  id: number;
  email: string;
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const fetchMessages = async (contactId: number) => {
    try {
      const accessToken = await getAccessToken();

      const res = await axios.get<BackendMessage[]>(
        `${API_BASE_URL}/api/v1/contacts/${contactId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const mapped: Message[] = res.data.map((m) => ({
        id: m.id,
        contact_id: m.contact_id,
        sender: m.sender,
        receiver: m.receiver,
        message: m.message,
        is_read: m.is_read,
        created_at: m.created_at,
      }));

      setMessages(mapped);
     
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContact = async () => {
    try {
      const token = await getAccessToken();

      const res = await axios.get<Message[]>(
        `${API_BASE_URL}/api/v1/contacts/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

  
      fetchMessages(res.data[0].id);
      if (!contact && res.data.length > 0) {
        
        setContact({
          id: res.data[0].id,
          email:
            res.data[0].sender !== "ragaentop@gmail.com"
              ? res.data[0].sender
              : res.data[0].receiver,
        });
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchContact();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !contact) return;
    setSending(true);

    try {
      const token = await getAccessToken();

      const res = await axios.post<Message>(
        `${API_BASE_URL}/api/v1/contacts/${contact.id}/messages`,
        {
          contact_id: contact.id,
          sender: contact.email,
          receiver: "ragaentop@gmail.com",
          message: newMessage,
          is_read: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Message failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 h-[80vh]">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Contact Admin
        </h1>
        <p className="text-muted-foreground">
          Get in touch with our support team.
        </p>
      </div>

      <div className="w-full max-w-6xl h-full">
        <Card className="rounded-xl h-full flex flex-col relative">
          <button onClick={fetchContact} className="absolute cursor-pointer top-2 right-2">
            <RefreshCwIcon className="w-5 h-5" />
          </button>
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto  px-6 py-4 bg-muted/20 space-y-3 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-muted-foreground italic text-sm text-center mt-10">
                No messages yet.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-end ${
                    m.sender?.includes("raga")
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div className="flex flex-col">
                    {m.sender?.includes("raga") && (
                      <span className="text-xs text-muted-foreground mb-1">
                        Admin
                      </span>
                    )}
                    <div
                      className={`px-4 py-2 text-sm max-w-[70%] min-w-[100px] break-words rounded-2xl ${
                        m.sender?.includes("raga")
                          ? "bg-gray-200 text-foreground rounded-br-none"
                        : "bg-primary/10 text-foreground rounded-bl-none"
                      }`}
                    >
                      {m.message}
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {formatTimestamp(m.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
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
              disabled={sending || !contact}
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
