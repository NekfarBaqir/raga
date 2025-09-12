"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname } from "next/navigation";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";

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
        .string()
        .refine((val) => val === "yes" || val === "no", {
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
});

export default function ApplyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<z.ZodObject<any> | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();
  const CombinedSchema = schema
    ? ApplicantSchema.merge(schema)
    : ApplicantSchema;

  const form = useForm({
    resolver: zodResolver(CombinedSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      team_name: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
    reset,
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

        const defaults: Record<string, string> = {};
        sorted.forEach((q) => {
          defaults[q.id.toString()] = "";
        });
        reset((prev) => ({ ...prev, ...defaults }));
      } catch {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [reset]);

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      form.setFocus(firstError as any);
    }
  }, [errors, form]);

  const onSubmit = async (data: any) => {
    const token = await getAccessToken();
    const loadingToast = toast.loading("Submitting your application...", {
      icon: <Loader className="animate-spin text-gray-500" />,
      duration: Infinity,
      style: {
        borderRadius: "10px",
        background: "#f9f9f9",
        color: "#000000",
        fontWeight: "500",
      },
    });

    try {
      const answers = questions.map((q) => ({
        question_id: q.id,
        question_text: q.text,
        answer:
          q.type === "yes_no"
            ? data[q.id.toString()] === "yes"
              ? "Yes"
              : "No"
            : data[q.id.toString()],
      }));

      const payload = {
        answers,
        team_name: data.team_name,
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
        toast.error("Unfortunately, you are not eligible for this program.", {
          id: loadingToast,
          icon: <XCircle className="text-red-500" />,
          duration: 5000,
          style: {
            borderRadius: "10px",
            background: "#ffecec",
            color: "#b00020",
            fontWeight: "bold",
          },
        });
      } else {
        toast.success(
          "🎉 Congratulations! You’ve been accepted in this program.",
          {
            id: loadingToast,
            icon: <CheckCircle2 className="text-green-600" />,
            duration: 4000,
            style: {
              borderRadius: "10px",
              background: "#e6ffed",
              color: "#065f46",
              fontWeight: "bold",
            },
          }
        );

        setTimeout(() => {
          router.push("/user-dashboard");
        }, 1000);
      }
    } catch (err: any) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Whoops… looks like we hit a snag. Try again later.";

      toast.error(msg, {
        id: loadingToast,
        icon: <XCircle className="text-red-500" />,
        duration: 5000,
        style: {
          borderRadius: "10px",
          background: "#ffecec",
          color: "#b00020",
          fontWeight: "bold",
        },
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <>
      <section className="w-full py-16">
        <Toaster position="top-center" />
        <h1 className="text-4xl text-center mb-10 font-bold">
          Application Form
        </h1>
        <div className="flex justify-center items-center min-h-screen px-2 md:px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-3xl px-2 sm:px-0 space-y-10"
          >
            <div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="team_name" className="font-medium text-base">
                    What is your team or project name?
                  </label>
                  <Input
                    id="team_name"
                    {...register("team_name")}
                    placeholder="Enter team name..."
                    className={`p-3 py-7 ${
                      errors.team_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.team_name && (
                    <p className="text-red-500 text-sm">
                      {errors.team_name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-6">Questions</h2>
              <div className="grid grid-cols-1 gap-8">
                {questions.map((q, idx) => (
                  <div key={q.id} className="flex flex-col gap-2">
                    <label className="font-medium text-base">
                      <span className="text-gray-500 mr-1">{idx + 1}.</span>{" "}
                      {q.text}
                    </label>

                    {q.type === "text" && (
                      <Textarea
                        {...register(q.id.toString())}
                        placeholder="Enter your answer..."
                        className={`border p-2 rounded resize-y h-36 ${
                          (errors as any)[q.id.toString()]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    )}

                    {q.type === "yes_no" && (
                      <RadioGroup
                        onValueChange={(v) => setValue(q.id.toString(), v)}
                        className="flex gap-6 mt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="yes"
                            id={`yes-${q.id}`}
                            aria-label={`${q.text} - Yes`}
                          />
                          <label
                            htmlFor={`yes-${q.id}`}
                            className="cursor-pointer"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="no"
                            id={`no-${q.id}`}
                            aria-label={`${q.text} - No`}
                          />
                          <label
                            htmlFor={`no-${q.id}`}
                            className="cursor-pointer"
                          >
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    )}

                    {q.type === "dropdown" && q.options && (
                      <Select
                        onValueChange={(v) => setValue(q.id.toString(), v)}
                        defaultValue=""
                      >
                        <SelectTrigger
                          className={`border p-3 rounded ${
                            (errors as any)[q.id.toString()]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
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
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 border rounded-md  transition-shadow cursor-pointer bg-white">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                className="cursor-pointe"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I confirm that the information I’ve provided is accurate, and I
                agree to the{" "}
                <a
                  href="/tos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 transition-colors"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            <div className="flex justify-center mb-20">
              <Button
                variant="outline"
                type="submit"
                disabled={isSubmitting || !isValid || !acceptedTerms}
                className={`w-52 py-7 cursor-pointer ${
                  !isValid
                    ? " cursor-not-allowed"
                    : "bg-primary text-muted hover:bg-primary hover:text-muted cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
