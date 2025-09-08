"use client";

import { useEffect, useState } from "react";

interface AIEvaluationProps {
  submission: any;
}

function Typewriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const lines = displayed.split("\n");

  return (
    <div className="space-y-4 font-sans text-gray-700 dark:text-gray-200">
      {lines.map((line, idx) => {
        const [label, ...rest] = line.split(":");
        const value = rest.join(":").trim();

        return (
          <p key={idx} className="text-lg leading-relaxed">
            <span className="font-bold">{label}:</span> <span>{value}</span>
            {idx === lines.length - 1 && !done && (
              <span className="animate-pulse text-indigo-600">|</span>
            )}
          </p>
        );
      })}
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
