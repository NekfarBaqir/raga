"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { MessageSquare, FileText } from "lucide-react";
import Link from "next/link";

const contactMessages = [
  {
    id: 1,
    title: "Login issue",
    preview: "Can't log in...",
    date: "2025-09-13",
  },
  {
    id: 2,
    title: "Billing help",
    preview: "Invoice question...",
    date: "2025-09-10",
  },
];

const submissionMessages = [
  {
    id: 101,
    title: "Form A Application",
    preview: "Submitted for approval...",
    date: "2025-09-11",
  },
  {
    id: 102,
    title: "Form B Application",
    preview: "Awaiting review...",
    date: "2025-09-09",
  },
];

export default function InboxPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl font-bold text-foreground">Inbox</h1>
          <p className="text-muted-foreground">
            Manage your contact messages and submissions
          </p>
        </div>

        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="flex flex-col sm:flex-row justify-center gap-4">
            <TabsTrigger
              value="contact"
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground cursor-pointer data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <MessageSquare className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground cursor-pointer data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <FileText className="h-4 w-4" />
              Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="mt-8">
            <div className="overflow-x-auto w-full max-w-5xl mx-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Preview</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium">{msg.title}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {msg.preview}
                      </td>
                      <td className="px-4 py-2">{msg.date}</td>
                      <td className="px-4 py-2 text-right">
                        <Link
                          href={`/admin-dashboard/inbox/contacts/${msg.id}`}
                        >
                          <button className="text-sm font-semibold text-primary hover:underline">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-8">
            <div className="overflow-x-auto w-full max-w-5xl mx-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Preview</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissionMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium">{msg.title}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {msg.preview}
                      </td>
                      <td className="px-4 py-2">{msg.date}</td>
                      <td className="px-4 py-2 text-right">
                        <Link
                          href={`/admin-dashboard/inbox/submissions/${msg.id}`}
                        >
                          <button className="text-sm font-semibold text-primary hover:underline">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
