"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Contact, Message } from "@/types";
import { getAccessToken, useUser } from "@auth0/nextjs-auth0";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export default function ContactAdmin() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<
    Contact[],
    Error
  >({
    queryKey: ["contacts"],
    queryFn: async () => {
      const token = await getAccessToken();
      const res = await axios.get<Contact[]>(
        `${API_BASE_URL}/api/v1/contacts/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    retry: 1,
  });

  const contact = contacts[0];

  const { data: messages = [], isLoading: messagesLoading } = useQuery<
    Message[],
    Error
  >({
    queryKey: ["messages", contact?.id],
    queryFn: async () => {
      if (!contact) return [];
      const token = await getAccessToken();
      const res = await axios.get<Message[]>(
        `${API_BASE_URL}/api/v1/contacts/${contact.id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    enabled: !!contact,
    refetchInterval: 1000,
    retry: 1,
  });

  const sendMessageMutation = useMutation<Message, Error, string>({
    mutationFn: async (messageText: string) => {
      let currentContact = contact;
      const token = await getAccessToken();

      if (!currentContact) {
        const contactRes = await axios.post<Contact>(
          `${API_BASE_URL}/api/v1/contacts`,
          {
            email: user?.email,
            message: messageText,
            name: user?.name || user?.email?.split("@")[0] || "User",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        currentContact = contactRes.data;
        queryClient.setQueryData(["contacts"], [currentContact]);

        return {
          contact_id: currentContact.id,
          receiver: ADMIN_EMAIL,
          message: messageText,
          is_read: false,
        } as Message;
      }

      const res = await axios.post<Message>(
        `${API_BASE_URL}/api/v1/contacts/${currentContact.id}/messages`,
        {
          contact_id: currentContact.id,
          receiver: ADMIN_EMAIL,
          message: messageText,
          is_read: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["messages", contact?.id],
        (old: Message[] = []) => [...old, data]
      );
      setNewMessage("");
    },
  });

  const isSending = sendMessageMutation.status === "pending";

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  };

  return (
    <div className="flex flex-col h-[90vh] w-full md:px-6 px-2">
      <Card className="rounded-xl flex flex-col h-full relative">
        <div className="px-6 py-2 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">
            Chat with Admin
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-muted/20 space-y-3 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200">
          {contactsLoading || messagesLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p className="italic text-sm mb-2">No messages yet.</p>
              <p className="text-xs">
                Send a message to start a conversation with admin.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isAdmin =
                m.sender === ADMIN_EMAIL || m.sender.includes("entop");
              return (
                <div
                  key={m.id}
                  className={`flex ${
                    isAdmin ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="flex flex-col max-w-[85%]">
                    {isAdmin && (
                      <span className="text-xs text-muted-foreground mb-1 ml-2">
                        Admin
                      </span>
                    )}
                    <div
                      className={`px-4 py-2 text-xs md:text-sm break-words rounded-2xl ${
                        isAdmin
                          ? "bg-muted-foreground/10 text-foreground rounded-bl-none text-left"
                          : "bg-primary/10 text-foreground rounded-br-none text-right"
                      }`}
                    >
                      <div className={isAdmin ? "text-left" : "text-right"}>
                        {m.message}
                      </div>
                      <div
                        className={`text-xs text-muted-foreground mt-1 ${
                          isAdmin ? "text-left" : "text-right"
                        }`}
                      >
                        {formatTimestamp(m.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-4 flex gap-3 items-center border-t border-accent">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-2xl border h-20 w-full px-4 py-4 focus-visible:ring-0 relative !focus:outline-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim()}
            className="p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer absolute right-8 bg-primary hover:bg-primary/90 transition-colors"
          >
            {isSending ? (
              <Loader2 className="animate-spin h-5 w-5 text-background" />
            ) : (
              <SendHorizontal className="h-6 w-6 text-background" />
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}
