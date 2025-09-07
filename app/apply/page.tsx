"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAccessToken } from "@auth0/nextjs-auth0";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type QuestionType = "text" | "yes_no" | "dropdown";

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  display_order: number;
  importance: number;
  options?: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const buildQuestionSchema = (questions: Question[]) => {
  const schemaObj: { [key: string]: z.ZodTypeAny } = {};

  questions.forEach((q) => {
    if (q.type === "text") {
      schemaObj[q.id.toString()] = z
        .string()
        .min(1, `Answer is required`)
        .max(500, `${q.text} must be 500 characters or less`);
    } else if (q.type === "yes_no") {
      schemaObj[q.id.toString()] = z
        .boolean()
        .refine((val) => val === true || val === false, {
          message: `${q.text} is required`,
        });
    } else if (q.type === "dropdown") {
      schemaObj[q.id.toString()] = z
        .string()
        .min(1, `Select an option for ${q.text}`);
    }
  });

  return z.object(schemaObj);
};

const ApplicantSchema = z.object({
  team_name: z.string().min(1, "Team name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Invalid phone number"),
});

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`
      relative inline-flex h-7 w-14 items-center rounded-full transition-colors
      ${checked ? "bg-black dark:bg-black" : "bg-gray-300 dark:bg-stone-900"}
    `}
  >
    <span
      className={`
        inline-block h-5 w-5 transform rounded-full dark:bg-white bg-black shadow transition-transform
        ${checked ? "translate-x-7" : "translate-x-1"}
      `}
    />
  </button>
);

export default function ApplyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<z.ZodObject<any> | null>(null);

  const CombinedSchema = schema
    ? ApplicantSchema.merge(schema)
    : ApplicantSchema;

  const form = useForm({
    resolver: zodResolver(CombinedSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = form;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get<Question[]>(
          `${API_BASE_URL}/api/v1/questions`
        );
        const sorted = res.data.sort(
          (a, b) => a.display_order - b.display_order
        );
        setQuestions(sorted);
        setSchema(buildQuestionSchema(sorted));
      } catch {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const token = await getAccessToken();

      const answers = questions.map((q) => ({
        question_id: q.id,
        question_text: q.text,
        answer:
          q.type === "yes_no"
            ? data[q.id.toString()]
              ? "Yes"
              : "No"
            : data[q.id.toString()],
      }));

      const payload = {
        answers,
        team_name: data.team_name,
        email: data.email,
        phone: data.phone,
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/submissions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "rejected") {
        alert(`Submission rejected. Score: ${res.data.score}`);
      } else {
        alert("Application submitted successfully!");
        form.reset();
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit application. Check all fields.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-9xl">
      <Card className="shadow-lg background">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Application Form
          </CardTitle>
          <p className="text-center dark:text-white mt-4">
            Please read the question and answer them.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="team_name" className="mb-3 ml-2">
                  Team Name
                </Label>
                <Input
                  id="team_name"
                  {...register("team_name")}
                  placeholder="Team Name"
                  className={errors.team_name ? "border-red-500" : ""}
                />
                {errors.team_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.team_name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="email" className="mb-3 ml-2">
                  Email
                </Label>
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="Email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="phone" className="mb-3 ml-2">
                  Phone
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Phone"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 gap-x-16"
            >
              {questions.map((q, idx) => (
                <AccordionItem key={q.id} value={q.id.toString()}>
                  <AccordionTrigger className="text-base md:text-lg lg:text-xl">
                    {idx + 1}. {q.text}
                  </AccordionTrigger>
                  <AccordionContent className="mt-2">
                    {q.type === "text" && (
                      <Textarea
                        {...register(q.id.toString())}
                        placeholder={`Enter the your answer...`}
                        className={
                          (errors as any)[q.id.toString()]
                            ? "border-red-500"
                            : ""
                        }
                      />
                    )}
                    {q.type === "yes_no" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Label>No</Label>
                        <Toggle
                          checked={!!watch(q.id.toString())}
                          onChange={(v) => setValue(q.id.toString(), v)}
                        />
                        <Label>Yes</Label>
                      </div>
                    )}
                    {q.type === "dropdown" && q.options && (
                      <Select
                        onValueChange={(v) => setValue(q.id.toString(), v)}
                        defaultValue=""
                      >
                        <SelectTrigger
                          className={
                            (errors as any)[q.id.toString()]
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {(errors as any)[q.id.toString()] && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors as any)[q.id.toString()]?.message?.toString()}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button
              variant={"outline"}
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`flex items-center justify-center w-44 py-6 cursor-pointer mt-4 ${
                !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
