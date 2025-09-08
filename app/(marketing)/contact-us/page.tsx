"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Lamp, Lightbulb, Mail, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        message: data.message,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/contacts`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Contact submitted:", response.data);
      reset();
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to submit contact.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-6">
      <div className="flex flex-col md:flex-row gap-16 max-w-7xl w-full">
        <div className="flex-1">
          <button
            className="flex items-center cursor-pointer mb-10 gap-2 px-4 py-2 rounded-full border
                             border-gray-400 bg-transparent text-backgroun hover:border-border transition"
          >
            <Lightbulb className="w-5 h-5" />
            Contact us
          </button>
          <h2 className="text-6xl font-bold mb-12 font-poppins">
            24<span className="text-[56px]">/</span> 7 Available
          </h2>
          <p className="mb-10 text-foreground text-xl leading-relaxed">
            You can contact us via email, phone, or by filling out the form on
            this page. We strive to respond promptly and look forward to
            connecting with you soon!
          </p>

          <div className="space-y-3 text-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-200 text-black p-2 rounded-full">
                <Mail className="w-5 h-5" />
              </div>
              <span>example@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-200 text-black p-2 rounded-full">
                <Phone className="w-5 h-5" />
              </div>
              <span>+1-555-44-456</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 bg-card rounded-4xl shadow-2xl max-w-xl ">
          <h2 className="text-3xl font-bold mb-4 font-poppins">Write us</h2>
          <p className="mb-6 text-muted-foreground text-base">
            We'd love to hear from you!
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="firstName" className="text-sm mb-1 block">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...register("firstName")}
                  className="w-full  border bg-transparent border-ring text-foreground px-4 py-6 text-xs rounded-lg"
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Label htmlFor="lastName" className="text-sm mb-1 block">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  {...register("lastName")}
                  className="w-full bg-transparent border border-ring text-foreground px-4 py-6 text-xs rounded-lg"
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm mb-1 block">
                Email
              </Label>
              <Input
                id="email"
                placeholder="example@gmail.com"
                {...register("email")}
                className="w-full bg-transparent border border-ring text-foreground px-4 py-6 text-xs rounded-lg"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="message" className="text-sm mb-1 block">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Your message"
                {...register("message")}
                className="w-full bg-transparent border border-ring text-foreground px-4 py-6 text-xs rounded-lg h-32"
              />
              {errors.message && (
                <p className="text-destructive text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button
              type="submit"
              variant={"outline"}
              className="w-full bg-background text-foreground cursor-pointer px-6 py-7 text-lg rounded-full font-semibold"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
