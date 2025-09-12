"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Check, CheckCheckIcon } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
  seen?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I have a question about my account.",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    seen: true,
  },
  {
    id: 2,
    text: "Hi! Sure, what’s your question?",
    sender: "admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    seen: true,
  },
];

export default function ContactPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAdminTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      seen: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsAdminTyping(true);
    setTimeout(() => {
      const adminMessage: Message = {
        id: Date.now() + 1,
        text: "Admin reply: " + userMessage.text,
        sender: "admin",
        timestamp: new Date(),
        seen: true,
      };
      setMessages((prev) => [...prev, adminMessage]);
      setIsAdminTyping(false);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === "user" ? { ...msg, seen: true } : msg
        )
      );
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center justify-between bg-green-500 text-white px-4 py-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 font-bold">
            A
          </div>
          <div>
            <h1 className="font-semibold">Admin</h1>
            <p className="text-xs text-green-200">
              {isAdminTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            No previous messages. Start a conversation!
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "admin" && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white mr-2">
                A
              </div>
            )}
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow relative transition-all duration-300
                ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
            >
              <p>{msg.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-xs text-gray-400">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.sender === "user" && (
                  <span className="text-green-200">
                    {msg.seen ? (
                      <CheckCheckIcon size={14} />
                    ) : (
                      <Check size={14} />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isAdminTyping && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
              A
            </div>
            <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow animate-pulse">
              Admin is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex items-center p-3 bg-white shadow-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-green-500"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
