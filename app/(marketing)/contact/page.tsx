"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUser } from "@auth0/nextjs-auth0";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dynamic schema based on user authentication
const getFormSchema = (isAuthenticated: boolean) => {
  return z.object({
    firstName: isAuthenticated ? z.string().optional() : z.string().min(1, "First name is required"),
    lastName: isAuthenticated ? z.string().optional() : z.string().min(1, "Last name is required"),
    email: isAuthenticated ? z.string().email("Invalid email address").optional() : z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required"),
  });
};

type FormData = z.infer<ReturnType<typeof getFormSchema>>;

export default function Contact() {
  const { user, isLoading: userLoading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(getFormSchema(!!user)),
  });

  // Pre-fill form when user is available
  useEffect(() => {
    if (user) {
      setValue("firstName", user.given_name || "");
      setValue("lastName", user.family_name || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const payload = user
      ? {
        name: `${user.given_name} ${user.family_name}`,
        email: user.email,
        message: data.message,
      }
      : {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        message: data.message,
      };

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/v1/contacts`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        if (!user) reset();
        setError(null);
        setSuccessMessage("Your message was successfully submitted!");
        setIsModalOpen(true);
      } else {
        throw new Error("Failed to submit contact");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.response?.data?.detail || err.message || "Failed to submit contact.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground pt-32 p-6 xl:pt-20">
      <div className="flex flex-col md:flex-row gap-16 max-w-7xl w-full">
        <div className="flex-1">
          <button
            className="flex items-center cursor-pointer text-xs lg:text-sm mb-10 gap-2 px-4 py-2 rounded-full border
                              bg-transparent text-backgroun hover:border-border transition"
          >
            <Lightbulb className="w-5 h-5" />
            Contact us
          </button>
          <h2 className=" text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-12 font-poppins">
            24 <span className=" text-3xl md:text-5xl lg:text-6xl xl:text-7xl">/</span> 7 Available
          </h2>
          <p className="mb-10 text-foreground text-sm md:text-lg lg:text-xl leading-relaxed">
            You can contact us via email, phone, or by filling out the form on
            this page. We strive to respond promptly and look forward to
            connecting with you soon!
          </p>

          <div className="space-y-3 text-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-200 text-black p-2 rounded-full">
                <Mail className="w-5 h-5" />
              </div>
              <span>ceo@raga.space</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 bg-card rounded-4xl shadow-2xl max-w-xl ">
          <h2 className="text-3xl font-bold mb-4 font-poppins">Write us</h2>
          <p className="mb-6 text-muted-foreground text-base">
            We'd love to hear from you!
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {!user && (
              <>
                {/* First Name */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="firstName" className="text-sm mb-1 block">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      {...register("firstName")}
                      className="w-full border bg-transparent border-ring text-foreground px-4 py-6 text-xs rounded-lg"
                    />
                    {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="flex-1">
                    <Label htmlFor="lastName" className="text-sm mb-1 block">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      {...register("lastName")}
                      className="w-full bg-transparent border border-ring text-foreground px-4 py-6 text-xs rounded-lg"
                    />
                    {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm mb-1 block">Email</Label>
                  <Input
                    id="email"
                    placeholder="example@gmail.com"
                    {...register("email")}
                    className="w-full bg-transparent border border-ring text-foreground px-4 py-6 text-xs rounded-lg"
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
              </>
            )}

            {/* Message (always shown) */}
            <div>
              <Label htmlFor="message" className="text-sm mb-1 block">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message"
                {...register("message")}
                className="w-full bg-transparent border border-ring text-foreground px-4 py-6 text-xs rounded-lg h-32"
              />
              {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
            </div>

            <Button type="submit" variant={"outline"} disabled={isLoading} className="w-full bg-background text-foreground cursor-pointer px-6 py-7 text-base rounded-full font-semibold">
              {isLoading ? <Loader className="animate-spin mr-2 h-4 w-4" /> : null}
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>

        </div>
      </div>

      <Dialog open={isLoading} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-[425px] rounded-lg p-6 bg-white shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <Loader className="animate-spin text-primary w-12 h-12" />
            <DialogTitle className="text-sm md:text-lg font-semibold text-center">
              Sending your message...
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-center text-gray-600">
              Please wait a moment while we process your request.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen && !isLoading} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-[425px] rounded-lg p-6 bg-white shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-sm md:text-xl font-semibold text-center text-green-600">
              Success!
            </DialogTitle>
            <DialogDescription className="mt-2 text-xs md:text-sm text-center text-gray-600">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button
              className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}