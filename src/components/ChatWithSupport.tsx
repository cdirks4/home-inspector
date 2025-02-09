"use client";

import { useState } from "react";
import { ErrorAlert } from "./ErrorAlert";

export function ChatWithSupport() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi! How can I help you with your home inspection booking?", isUser: false },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter a message before sending");
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    // Simulate automated response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for your message! Our team will get back to you shortly. Meanwhile, feel free to proceed with booking an appointment using the calendar above.",
          isUser: false,
        },
      ]);
    }, 1000);

    setMessage("");
  };

  return (
    <div className="bg-foreground/[0.02] p-6 rounded-2xl border border-foreground/[0.06]">
      <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <div className="space-y-4 mb-4 max-h-[200px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.isUser
                ? "bg-foreground text-background ml-8"
                : "bg-foreground/[0.05] mr-8"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 p-2 rounded-lg border border-foreground/[0.08] bg-background/50 focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
