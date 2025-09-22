"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAccessToken, useUser } from "@auth0/nextjs-auth0";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckCircle, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import * as z from "zod";

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
        .max(700, `${q.text} must be 700 characters or less`);
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

  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [dialogError, setDialogError] = useState<{ open: boolean; message?: string | any }>({
    open: false,
    message: "",
  });
  const { user, isLoading } = useUser();

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

  useEffect(() => {
    if (isLoading) return;
    if (!isLoading && !user) {
      router?.push("/auth/login?returnTo=/apply")
    }
  }, [isLoading, user]);

  const onSubmit = async (data: any) => {
    const token = await getAccessToken();
    setDialogSubmitting(true);

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
        email: user?.email,
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

      setDialogSubmitting(false);

      if (res.data.status === "duplicate" || res.status === 409) {
        setDialogError({
          open: true,
          message: (
            <div>
              <p>You have already applied with this email address.</p>
              <p>Please wait for updates on your current application.</p>
            </div>
          ),
        });
        return;
      }

      if (res.data.status === "rejected") {
        const score = res.data.score ?? "not available";
        setDialogError({
          open: true,
          message: (
            <div>
              <p>Unfortunately, your submission was not accepted for this program.</p>
              <p>
                You received a score of <strong>{score}</strong> out of 100, which did
                not meet the minimum requirement.
              </p>
              <p>We encourage you to refine your submission and try again in the future.</p>
            </div>
          ),
        });
      } else {
        setDialogSuccess(true);
      }
    } catch (err: any) {
      setDialogSubmitting(false);
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "It looks like we hit a temporary snag while processing your request. Please try again in a few moments.";

      setDialogError({ open: true, message: msg });
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
      <section className="w-full md:mt-30 mt-20">
        <Toaster position="top-center" />
        <h1 className="md:text-4xl text-2xl text-center mb-10 font-bold">
          Application Form
        </h1>
        <div className="flex justify-center items-center min-h-screen px-3 md:px-10 xl:4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-3xl px-2 sm:px-0 space-y-10"
          >
            <div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="team_name"
                    className="font-medium text-sm md:text-base"
                  >
                    What is your team or project name?
                  </label>
                  <Input
                    id="team_name"
                    {...register("team_name")}
                    placeholder="Enter team name..."
                    className={`p-3 py-7 text-xs ${errors.team_name ? "border-red-500" : "border"
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
                    <label className="font-medium text-xs md:text-base  text-foreground">
                      <span className="text-foreground mr-1">{idx + 1}.</span>{" "}
                      {q.text}
                    </label>

                    {q.type === "text" && (
                      <Textarea
                        {...register(q.id.toString())}
                        placeholder="Enter your answer..."
                        className={`border p-2 rounded resize-y md:h-36 h-24 text-xs md:text-sm ${(errors as any)[q.id.toString()]
                          ? "border-red-500"
                          : "border"
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
                          className={`border p-3 rounded ${(errors as any)[q.id.toString()]
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

            <div className="flex items-start space-x-4 p-4 border rounded-md  transition-shadow cursor-pointer bg-popover">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                className="cursor-pointe"
              />
              <label
                htmlFor="terms"
                className="text-xs md:text-sm text-foreground"
              >
                I confirm that the information I’ve provided is accurate, and I
                agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline transition-colors"
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
                className={`w-52 py-7 cursor-pointer ${!isValid
                  ? " cursor-not-allowed"
                  : "bg-primary dark:bg-primary dark:hover:bg-primary dark:text-foreground text-muted hover:bg-primary hover:text-muted cursor-pointer"
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
      <Dialog modal={true} open={dialogSubmitting} onOpenChange={setDialogSubmitting}>
        <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} className="max-w-md rounded-lg shadow-lg p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Submitting Your Application
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 text-center">
              We're securely processing your application.
              This should only take a few moments.
              Please don’t close or refresh this window.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 pt-2">
            <Loader className="animate-spin text-primary w-8 h-8" />
            <p className="text-sm text-gray-500">Validating your information...</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogSuccess} onOpenChange={setDialogSuccess}>
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
              <p>Your Application sent successfully !</p>
              <p className="text-muted-foreground leading-relaxed">
                We’ve received your application. If we need any further details, we’ll reach out to you.
                We appreciate your interest and look forward to connecting soon!
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

      <Dialog
        open={dialogError.open}
        onOpenChange={(o) => setDialogError({ open: o, message: dialogError.message })}
      >
        <DialogContent className="max-w-sm rounded-xl p-6 shadow-lg border bg-white dark:bg-gray-800">
          <div className="flex flex-col items-center gap-4">
            <DialogDescription className="text-center text-sm text-gray-600 dark:text-gray-300">
              {dialogError.message ||
                "We couldn't complete your request. Please try again or contact support if the issue persists."}
            </DialogDescription>
            <button
              onClick={() => setDialogError({ open: false })}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary 
                       text-white px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
