"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

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
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Invalid phone number"),
});

export default function ApplyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<z.ZodObject<any> | null>(null);

  // modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalScore, setModalScore] = useState<number | null>(null);

  const CombinedSchema = schema
    ? ApplicantSchema.merge(schema)
    : ApplicantSchema;

  const form = useForm({
    resolver: zodResolver(CombinedSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      team_name: "",
      email: "",
      phone: "",
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
      } catch {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const onSubmit = async (data: any) => {
    setModalOpen(true);
    setModalStatus("loading");
    setModalMessage("Submitting your application...");
    setModalScore(null);

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
        email: data.email,
        phone: data.phone,
      };
      console.log("🚀 ~ onSubmit ~ payload:", payload);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/submissions`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("🚀 ~ onSubmit ~ res:", res);
      console.log("🚀 ~ onSubmit ~ API_BASE_URL:", API_BASE_URL);

      if (res.data.status === "rejected") {
        setModalStatus("error");
        setModalMessage(
          " Unfortunately, you are not eligible for this program at this time."
        );
        setModalScore(res.data.score);
      } else {
        setModalStatus("success");
        setModalMessage(
          "Congratulations! You’ve been accepted into the program. Our team will contact you shortly."
        );
        setModalScore(res.data.score);
        reset();
      }
    } catch (err) {
      console.error(err);
      setModalStatus("error");
      setModalMessage(
        " Whoops… looks like we hit a snag. Please try again later."
      );
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
    <section className="w-full py-16">
      {" "}
      <h1 className="text-4xl text-center mb-10">Application Form </h1>
      <div className="flex justify-center items-center min-h-screen px-1 md:px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl space-y-8"
        >
          <div className="grid grid-cols-1  gap-6">
            <Card className="p-6 shadow-sm">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-base md:text-lg font-medium">
                  Team Name
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Input
                  id="team_name"
                  {...register("team_name")}
                  placeholder="Enter team name..."
                  className={`border-0 border-b focus-visible:ring-0 rounded-none ${
                    errors.team_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.team_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.team_name.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="p-6 shadow-sm">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-base md:text-lg font-medium">
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="Enter your email..."
                  className={`border-0 border-b focus-visible:ring-0 rounded-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="p-6 shadow-sm">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-base md:text-lg font-medium">
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Enter your phone number..."
                  className={`border-0 border-b focus-visible:ring-0 rounded-none ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {questions.map((q, idx) => (
              <Card key={q.id} className="p-6 shadow-sm">
                <CardHeader className="p-0 mb-3">
                  <CardTitle className=" text-sm md:text-lg font-normal md:font-medium">
                    {idx + 1}. {q.text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {q.type === "text" && (
                    <Textarea
                      {...register(q.id.toString())}
                      placeholder="Enter your answer..."
                      className={`border-0 border-b focus-visible:ring-0 bg-transparent rounded-none resize-none ${
                        (errors as any)[q.id.toString()]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  )}

                  {q.type === "yes_no" && (
                    <RadioGroup
                      onValueChange={(v) => setValue(q.id.toString(), v)}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value="yes"
                          id={`yes-${q.id}`}
                          className="border-gray-400"
                        />
                        <Label
                          htmlFor={`yes-${q.id}`}
                          className="cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value="no"
                          id={`no-${q.id}`}
                          className="border-gray-400"
                        />
                        <Label
                          htmlFor={`no-${q.id}`}
                          className="cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  )}

                  {q.type === "dropdown" && q.options && (
                    <Select
                      onValueChange={(v) => setValue(q.id.toString(), v)}
                      defaultValue=""
                    >
                      <SelectTrigger
                        className={`border-0 border-b focus-visible:ring-0 rounded-none ${
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mb-20">
            <Button
              variant="outline"
              type="submit"
              disabled={isSubmitting}
              className={`w-44 py-6 ${
                !isValid
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-primary text-muted hover:bg-primary hover:text-muted cursor-pointer"
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
          </div>
        </form>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalStatus === "loading" && "Processing Submission"}
              {modalStatus === "success" && "Application Accepted"}
              {modalStatus === "error" && "Application Update"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 text-center">
            {modalStatus === "loading" && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p>{modalMessage}</p>
              </div>
            )}

            {modalStatus !== "loading" && (
              <div className="space-y-4">
                <p>{modalMessage}</p>
                {modalScore !== null && (
                  <p className="font-medium">
                    Your score:{" "}
                    <span className="text-primary font-bold">{modalScore}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            {modalStatus !== "loading" && (
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
