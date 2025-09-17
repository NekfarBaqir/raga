"use client";

import { getAccessToken } from "@auth0/nextjs-auth0";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubmissionDetail } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Brain, Loader2, User } from "lucide-react";
import { Toaster } from "sonner";


export default function SubmissionDetailPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const {
    data: submission,
    isLoading: submissionLoading,
    error: submissionError,
  } = useQuery<SubmissionDetail, Error>({
    queryKey: ["submission", "user"],
    queryFn: async () => {
      const token = await getAccessToken();
      const response = await axios.get<SubmissionDetail>(
        `${API_BASE_URL}/api/v1/submissions/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    retry: 1,
  });


  const is404 = isAxiosError(submissionError) && submissionError.response?.status === 404;


  if (submissionLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        <span className="ml-2">Loading submission details...</span>
      </div>
    );

  if (submissionError && !is404) return <p className="text-center text-red-500">{submissionError.message}</p>;
  if (!submission || is404) {
    return (
      <div className="flex flex-col items-center self-stretch justify-center h-[80vh] text-center space-y-4">
        <p className="text-lg text-muted-foreground">
          You have not submitted an application yet.
        </p>
        <Button
          variant="default"
          className="cursor-pointer"
          onClick={() => (window.location.href = "/apply")}
        >
          Go to Apply Page
        </Button>
      </div>
    );
  }

  return (
    <section className="mt-4">
      <Toaster position="top-center" />
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <h1 className="max-w-2xl text-xl font-bold md:text-2xl">
            Your Submissions Details
          </h1>
          <p className="text-muted-foreground max-w-lg text-xs  ">
            Review the applicant information and AI-powered evaluation
          </p>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="flex flex-col sm:flex-row justify-center gap-4">
            <TabsTrigger
              value="details"
              className="flex items-center cursor-pointer  gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <User className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="flex items-center cursor-pointer gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
            >
              <Brain className="h-4 w-4" />
              AI Evaluation
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="details"
            className="mt-10 grid place-items-center"
          >
            <Card className="max-w-6xl w-full border rounded-2xl  bg-background">

              <CardContent className="p-8 space-y-8">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Team Name
                    </dt>
                    <dd className="mt-1">
                      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-base font-semibold text-foreground">
                        {submission.team_name}
                      </div>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-base text-foreground">
                        {submission.email}
                      </div>
                    </dd>
                  </div>
                </dl>

                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(submission.created_at).toLocaleString()}
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Answers
                  </h3>
                  {submission.answers && submission.answers.length > 0 ? (
                    <div className="space-y-4">
                      {submission.answers.map((ans, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-border bg-muted/40 p-5 hover:bg-muted/60 transition-colors"
                        >
                          <p className="font-medium text-foreground">
                            {idx + 1}. {ans.question_text}
                          </p>
                          <p className="mt-2 text-muted-foreground">
                            {ans.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No answers provided.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="evaluation"
            className="mt-10 grid place-items-center px-4"
          >
            <Card className="w-full max-w-6xl  border  rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <h2 className="text-3xl font-bold text-foreground text-center">
                  AI Evaluation Report
                </h2>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Score :
                  </h3>
                  <p className="text-muted-foreground bg-popover p-3 rounded-lg border ">
                    {submission.score ?? "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Feedback :
                  </h3>
                  <p className="text-muted-foreground bg-popover p-4 rounded-lg border">
                    {submission.feedback || "No feedback provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      Strengths :
                    </h3>
                    <p className="text-muted-foreground bg-popover p-3 rounded-lg border ">
                      {submission.strengths || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      Weaknesses :
                    </h3>
                    <p className="text-muted-foreground bg-popover p-3 rounded-lg border ">
                      {submission.weaknesses || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
