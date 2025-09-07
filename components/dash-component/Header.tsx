"use client";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-background px-6 py-3 flex items-center justify-between h-16">
      <div className="flex items-center gap-4 ml-auto">
        <button className="p-2 rounded-full hover:ring-2 hover:ring-ring">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
