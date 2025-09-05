"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface SubmissionDetail {
  id: number;
  team_name: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  score: number;
  feedback: string;
  strengths: string;
  weaknesses: string;
  keywords: string;
  risk_level: string;
  created_at: string;
}

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get<SubmissionDetail>(
          `${API_BASE_URL}/api/v1/submissions/${id}`
        );
        setSubmission(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load submission details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubmission();
  }, [API_BASE_URL, id]);

  if (loading) return <p>Loading submission details...</p>;
  if (error) return <p>{error}</p>;
  if (!submission) return <p>No submission found.</p>;

  return (
    <div className="p-6 border rounded-lg shadow space-y-2">
      <h2 className="text-xl font-bold">{submission.team_name}</h2>
      <p>
        <span className="font-semibold">Applicant:</span> {submission.name}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {submission.email}
      </p>
      <p>
        <span className="font-semibold">Phone:</span> {submission.phone}
      </p>
      <p>
        <span className="font-semibold">Notes:</span> {submission.notes}
      </p>
      <p>
        <span className="font-semibold">Status:</span> {submission.status}
      </p>
      <p>
        <span className="font-semibold">Score:</span> {submission.score}
      </p>
      <p>
        <span className="font-semibold">Feedback:</span> {submission.feedback}
      </p>
      <p>
        <span className="font-semibold">Strengths:</span> {submission.strengths}
      </p>
      <p>
        <span className="font-semibold">Weaknesses:</span>{" "}
        {submission.weaknesses}
      </p>
      <p>
        <span className="font-semibold">Keywords:</span> {submission.keywords}
      </p>
      <p>
        <span className="font-semibold">Risk Level:</span>{" "}
        {submission.risk_level}
      </p>
      <p className="text-sm text-gray-500">
        Submitted: {new Date(submission.created_at).toLocaleString()}
      </p>
    </div>
  );
}
