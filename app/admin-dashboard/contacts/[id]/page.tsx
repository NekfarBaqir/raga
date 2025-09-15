"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { Loader2, SendHorizonalIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageAdmin, BackendMessageAdmin } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Contact = {
  id: number;
  name: string;
};

export default function Page() {
  const params = useParams();
  const contactId = Number(params.id);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<MessageAdmin[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function fetchContacts() {
      try {
        const token = await getAccessToken();
        const response = await axios.get<Contact[]>(
          `${API_BASE_URL}/api/v1/contacts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setContacts(response.data);
      } catch (err: any) {
        console.error(err);
      }
    }
    fetchContacts();
  }, [API_BASE_URL]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (): Promise<MessageAdmin[]> => {
    const accessToken = await getAccessToken();
    const res = await axios.get<BackendMessageAdmin[]>(
      `${API_BASE_URL}/api/v1/contacts/${contactId}/messages`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return res.data.map((m) => ({
      id: String(m.id),
      senderId: m.sender,
      receiverId: m.receiver,
      content: m.message,
      timestamp: m.created_at,
      read: m.is_read,
    }));
  };

  const { data: messagesData, isLoading } = useQuery<MessageAdmin[], Error>({
    queryKey: ["messages", contactId],
    queryFn: fetchMessages,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (messagesData) setMessages(messagesData);
  }, [messagesData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const accessToken = await getAccessToken();
      const receiverEmail =
        messages[messages.length - 1]?.receiverId || contactId;

      const res = await axios.post<BackendMessageAdmin>(
        `${API_BASE_URL}/api/v1/contacts/${contactId}/messages`,
        {
          contact_id: contactId,
          receiver: receiverEmail,
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const newMsg: MessageAdmin = {
        id: String(res.data.id),
        receiverId: res.data.receiver,
        senderId: res.data.sender,
        content: res.data.message,
        timestamp: res.data.created_at,
        read: res.data.is_read,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", contactId] });
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Message failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const contact = contacts.find((c) => c.id === contactId);

  if (isLoading)
    return (
      <p className="text-center mt-10 text-muted-foreground">Loading chat...</p>
    );

  return (
    <div className="flex flex-col w-full px-4">
      <div className="mx-auto space-y-6 mt-5 w-full overflow-hidden h-[90vh]">
        <Card className="rounded-xl h-full w-full flex flex-col overflow-hidden relative">
          <div className="px-6 py-4">
            {contact ? (
              <h3 className="text-lg font-semibold text-foreground">
                {contact.name}
              </h3>
            ) : (
              <p className="text-sm text-muted-foreground">
                Contact not found
              </p>
            )}
          </div>

          <div className="flex-1 overflow-hidden w-full">
            <div className="h-full overflow-y-auto px-4 py-3 space-y-3 bg-muted/20 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground mt-10 h-full flex justify-center items-center">
                  No messages yet.
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-end ${m.senderId?.includes("jafari")
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[70%] text-sm break-words rounded-2xl ${m.senderId?.includes("jafari")
                        ? "bg-muted text-foreground rounded-br-none"
                        : "bg-secondary/10 text-foreground rounded-bl-none"
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

          <div className="flex items-center px-4 py-3 gap-3 rounded-2xl m-3">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-transparent relative h-20 !border-0 focus:!border-0 focus:!outline-0 focus:!ring-0 outline-none ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              variant="default"
              disabled={sending}
              className="cursor-pointer rounded-full bg-primary absolute right-14 text-white h-12 w-12 flex justify-center items-center"
            >
              {sending ? (
                <Loader2 className="animate-spin h-8 w-8" />
              ) : (
                <SendHorizonalIcon className="h-8 w-8" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}