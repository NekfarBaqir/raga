"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Question {
  id: string;
  text: string;
  type: string;
  importance: number;
  options: [];
  display_order: number;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<Question[]>(
          `${API_BASE_URL}/api/v1/questions`
        );
        setQuestions(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [API_BASE_URL]);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;
  if (questions.length === 0) return <p>No questions found.</p>;

  return (
    <div className="space-y-4 p-4">
      {questions.map((q) => (
        <div key={q.id} className="border p-4 rounded">
          <h3 className="font-bold">{q.text}</h3>
          <p>{q.type}</p>
        </div>
      ))}
    </div>
  );
}
