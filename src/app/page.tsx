"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Vapi from "@vapi-ai/web";
import Image from "next/image";
import Link from "next/link";
import { getDeFiAssistant } from "@/services/defiAssistant";

const vapi = typeof window !== "undefined" 
  ? new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY || "") 
  : null;

export default function Home() {
  const { authenticated, user } = usePrivy();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    // Voice API event listeners
    vapi?.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
    });

    vapi?.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
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
    });
  }, [authenticated]);

  const startCallInline = async () => {
    if (!authenticated) {
      alert("Please sign in first");
      return;
    }

    setConnecting(true);
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const assistant = await getDeFiAssistant(user.id);
      vapi?.start(assistant);
    } catch (error) {
      console.error("Failed to start call:", error);
      setConnecting(false);
    }
  };

  const endCall = () => {
    vapi?.stop();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {!connected && (
            <button
              onClick={startCallInline}
              disabled={connecting}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              {connecting ? "Connecting..." : "Start Inspection Call"}
            </button>
          )}
          
          {connected && (
            <button
              onClick={endCall}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-red-600 text-white gap-2 hover:bg-red-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              End Call
            </button>
          )}
          
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/book-inspection"
          >
            Book an Inspection
          </Link>
        </div>

        {assistantIsSpeaking && (
          <div className="text-sm text-gray-600">
            Assistant is speaking... (Volume: {volumeLevel.toFixed(2)})
          </div>
        )}
      </main>
    </div>
  );
}
