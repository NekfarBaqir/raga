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
import { CheckCircle, Loader2, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const ADMIN_EMAIL = "jafarimahdi850@gmail.com";

function AdminResponseDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-8" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="sr-only">Message Sent Successfully</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="relative bg-primary rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-white dark:text-black" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl text-foreground font-bold animate-fade-in">
              Congratulations!
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-foreground">
              Message Sent Successfully!
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your message has been delivered to our admin team.
              <br />
              Please wait for their response before sending another message.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => (window.location.href = "/user-dashboard")}
              className="cursor-pointer py"
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContactAdmin() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [hasAdminReplied, setHasAdminReplied] = useState(true);
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
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (messages.length === 0) {
      setHasAdminReplied(true);
    } else {
      const reversedMessages = [...messages].reverse();
      const lastUserMessageIndex = reversedMessages.findIndex(
        (m) => m.sender !== ADMIN_EMAIL && !m.sender.includes("admin")
      );

      const hasAdminRepliedToLatest =
        lastUserMessageIndex === -1
          ? true
          : reversedMessages
            .slice(0, lastUserMessageIndex)
            .some(
              (m) => m.sender === ADMIN_EMAIL || m.sender.includes("admin")
            );

      setHasAdminReplied(hasAdminRepliedToLatest);
    }
  }, [messages]);

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
            name: user?.name || user?.email?.split('@')[0] || 'User'
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
      setHasAdminReplied(false);
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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[90vh] w-full md:px-6 px-2" >

      <Card className="rounded-xl flex flex-col h-full relative">
        <div className="px-6 py-2 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">Chat with Admin</h3>
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
                m.sender === ADMIN_EMAIL || m.sender.includes("admin");
              return (
                <div
                  key={m.id}
                  className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
                >
                  <div className="flex flex-col max-w-[85%]">
                    {isAdmin && (
                      <span className="text-xs text-muted-foreground mb-1 ml-2">
                        Admin
                      </span>
                    )}
                    <div
                      className={`px-4 py-2 text-xs md:text-sm break-words rounded-2xl ${isAdmin
                        ? "bg-muted-foreground/10 text-foreground rounded-bl-none text-left"
                        : "bg-primary/10 text-foreground rounded-br-none text-right"
                        }`}
                    >
                      <div className={isAdmin ? "text-left" : "text-right"}>
                        {m.message}
                      </div>
                      <div
                        className={`text-xs text-muted-foreground mt-1 ${isAdmin ? "text-left" : "text-right"
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
            disabled={!hasAdminReplied && messages.length > 0}
          />
          <button
            onClick={handleSendMessage}
            disabled={
              isSending ||
              !newMessage.trim() ||
              (!hasAdminReplied && messages.length > 0)
            }
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

      <AdminResponseDialog
        open={!hasAdminReplied && messages.length > 0}
        onOpenChange={setHasAdminReplied}
      />
    </div>
  );
}