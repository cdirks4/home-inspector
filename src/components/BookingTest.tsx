"use client";

import { useState } from "react";

export function BookingTest() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/book-inspection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime: "2024-04-01T10:00:00Z",
          endTime: "2024-04-01T11:00:00Z",
          name: "Test User",
          email: "test@example.com",
          address: "123 Test St, Test City",
          notes: "Test booking",
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={testBooking}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Booking"}
      </button>

      {result && (
        <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
          {result}
        </pre>
      )}
    </div>
  );
}
