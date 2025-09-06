"use client";

import { useEffect, useState } from "react";

interface AIEvaluationProps {
  submission: any;
}

function Typewriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const lines = displayed.split("\n");

  return (
    <div className="space-y-4 font-sans text-gray-700">
      {lines.map((line, idx) => {
        const [label, ...rest] = line.split(":");
        const value = rest.join(":").trim();

        return (
          <p
            key={idx}
            className="text-lg"
            style={{
              opacity: displayed.length === 0 ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <span className="font-bold dark:text-white">{label}:</span>{" "}
            <span className="dark:text-white light:text-black">{value}</span>
          </p>
        );
      })}
      <span className="animate-pulse text-indigo-600">|</span>
    </div>
  );
}

export default function AIEvaluation({ submission }: AIEvaluationProps) {
  const fullText = `
Score: ${submission.score}
Feedback: ${submission.feedback}
Strengths: ${submission.strengths}
Weaknesses: ${submission.weaknesses}
Keywords: ${submission.keywords}
Risk Level: ${submission.risk_level}
  `.trim();

  return <Typewriter text={fullText} speed={5} />;
}
