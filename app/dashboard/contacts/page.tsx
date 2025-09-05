"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>(
          `${API_BASE_URL}/api/v1/contacts`
        );
        setContacts(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [API_BASE_URL]);

  if (loading) return <p>Loading contacts...</p>;
  if (error) return <p>{error}</p>;
  if (contacts.length === 0) return <p>No contacts found.</p>;

  return (
    <div className="space-y-6 p-4">
      {contacts.map((c) => (
        <div key={c.id} className="border p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold">{c.name}</h3>
          <p>
            <span className="font-semibold">Email:</span> {c.email}
          </p>
          <p>
            <span className="font-semibold">Message:</span> {c.message}
          </p>
          <p className="text-sm text-gray-500">
            Submitted: {new Date(c.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
