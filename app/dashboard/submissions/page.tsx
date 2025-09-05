"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Submission {
  id: number;
  team_name: string; 
  email: string;
  name: string; 
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get<Submission[]>(
          `${API_BASE_URL}/api/v1/submissions`
        );
        setSubmissions(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [API_BASE_URL]);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p>{error}</p>;
  if (submissions.length === 0) return <p>No submissions found.</p>;

  return (
    <div className="space-y-4 p-4">
      {submissions.map((s) => (
        <div
          key={s.id}
          className="border p-4 rounded flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold">{s.team_name}</h3>
            <p>
              {s.name} — {s.email}
            </p>
          </div>
          <Link href={`/dashboard/submissions/${s.id}`}>Show Details</Link>
        </div>
      ))}
    </div>
  );
}
