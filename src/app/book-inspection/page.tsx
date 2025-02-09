"use client";

import { useState, useEffect } from "react";
import { useVAPI } from "@/hooks/useVAPI";

export default function BookInspection() {
  const [address, setAddress] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const { startCall, endCall, vapi } = useVAPI({
    assistantConfig: {
      firstMessage: "Hello! I'm your virtual home inspector. Please tell me about the property you'd like to inspect.",
      voice: {
        provider: "cartesia",
        voiceId: "565510e8-6b45-45de-8758-13588fbaec73",
      },
    },
  });

  useEffect(() => {
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
      console.error("VAPI error:", error);
      setConnecting(false);
    });
  }, [vapi]);

  const handleStartCall = async () => {
    try {
      setConnecting(true);
      await startCall();
      setIsCallActive(true);
    } catch (error) {
      console.error("Failed to start call:", error);
      setConnecting(false);
    }
  };

  const handleEndCall = () => {
    endCall();
    setIsCallActive(false);
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Virtual Home Inspection</h1>
        <div className="space-y-8">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter property address"
            className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />

          <div className="bg-background/50 rounded-lg border border-black/[.08] dark:border-white/[.145] overflow-hidden p-6">
            {!isCallActive ? (
              <button
                onClick={handleStartCall}
                className="w-full py-4 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Start Virtual Inspection
              </button>
            ) : (
              <div className="space-y-4">
                <div
                  id="vapi-call-container"
                  className="w-full aspect-video rounded-lg bg-black/10"
                />
                <button
                  onClick={handleEndCall}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  End Inspection
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
