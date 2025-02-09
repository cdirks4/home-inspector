"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Vapi from "@vapi-ai/web";
import { getDeFiAssistant } from "@/services/defiAssistant";

const vapi = typeof window !== "undefined" 
  ? new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY || "") 
  : null;

export default function TestAgentCall() {
  const { authenticated, user } = usePrivy();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [response, setResponse] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    // Voice API event listeners
    vapi?.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
      setResponse((prev) => prev + "\n[Call Started]");
    });

    vapi?.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
      setResponse((prev) => prev + "\n[Call Ended]");
    });

    vapi?.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi?.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi?.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi?.on("error", (error) => {
      console.error("Vapi error:", error);
      setConnecting(false);
      setResponse((prev) => prev + "\n[Error: " + error.message + "]");
    });
  }, []);

  const startTest = async () => {
    if (!authenticated) {
      setResponse("Please sign in first");
      return;
    }

    setConnecting(true);
    if (!user) {
      setResponse("User not authenticated");
      setConnecting(false);
      return;
    }

    try {
      const assistant = await getDeFiAssistant(user.id);
      const result = await assistant.processUserInput(testMessage);
      setResponse("Processing message: " + testMessage + "\nResponse: " + result.content);
      
      // Start voice call if message processing was successful
      vapi?.start(assistant);
    } catch (error) {
      console.error("Test failed:", error);
      setResponse("Error: " + (error instanceof Error ? error.message : "Unknown error occurred"));
      setConnecting(false);
    }
  };

  const endTest = () => {
    vapi?.stop();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-8">Test Agent Call</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="testMessage" className="block text-sm font-medium">
              Test Message
            </label>
            <textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full p-3 border rounded-md bg-background text-foreground"
              rows={4}
              placeholder="Enter your test message here..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={startTest}
              disabled={connecting || connected}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {connecting ? "Starting Test..." : "Start Test"}
            </button>
            
            <button
              onClick={endTest}
              disabled={!connected}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              End Test
            </button>
          </div>

          {response && (
            <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
              <h2 className="text-lg font-semibold mb-2">Response:</h2>
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}

          {assistantIsSpeaking && (
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Assistant is speaking... (Volume: {volumeLevel.toFixed(2)})
            </div>
          )}

          <div className="text-sm">
            Status: {connecting ? "Connecting" : connected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>
    </div>
  );
}
