"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

export default function ApprovalPage() {
  const adminEmail = "mahdi100th@gamil.com";
  const adminPhone = "+93 73 133 3905";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center gap-6">
      <h1 className="text-3xl font-bold">Access Pending</h1>
      <p className="text-gray-600 max-w-md">
        Your account does not have access yet. Please contact the administrator
        to request approval.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button
          variant="outline"
          onClick={() =>
            (window.location.href = `mailto:${adminEmail}?subject=Access Request`)
          }
          className="justify-center gap-2"
        >
          <Mail size={20} /> {adminEmail}
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = `tel:${adminPhone}`)}
          className="justify-center gap-2"
        >
          <Phone size={20} /> {adminPhone}
        </Button>
      </div>
    </div>
  );
}
