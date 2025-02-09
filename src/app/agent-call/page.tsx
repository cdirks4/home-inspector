"use client";

import { useState } from "react";
import { useVAPI } from "@/hooks/useVAPI";

export default function AgentCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const { startCall, endCall } = useVAPI({
    assistantConfig: {
      firstMessage: "Hello! I'm your virtual home inspector. How can I help you today?",
      voice: {
        provider: "cartesia",
        voiceId: "565510e8-6b45-45de-8758-13588fbaec73",
      },
    },
  });

  const handleStartCall = async () => {
    try {
      await startCall();
      setIsCallActive(true);
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Virtual Inspector Call</h1>
        
        <div className="bg-background/50 rounded-lg border border-black/[.08] dark:border-white/[.145] p-6">
          {!isCallActive ? (
            <button
              onClick={handleStartCall}
              className="w-full py-4 bg-foreground text-background rounded-lg hover:bg-foreground/90"
            >
              Start Call
            </button>
          ) : (
            <div className="space-y-4">
              <div id="vapi-call-container" className="w-full aspect-video rounded-lg bg-black/10" />
              <button
                onClick={() => {
                  endCall();
                  setIsCallActive(false);
                }}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                End Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}