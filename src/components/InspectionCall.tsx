"use client";

import { useState } from "react";

export function InspectionCall() {
  const [isCallActive, setIsCallActive] = useState(false);

  const startDemoCall = async () => {
    try {
      const response = await fetch('/api/start-inspection-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'demo',
          inspectionType: 'general',
        }),
      });

      if (response.ok) {
        setIsCallActive(true);
        // Initialize VAPI call here
        const data = await response.json();
        window.VAPI?.startCall({
          callId: data.callId,
          mode: 'demo',
          config: {
            audio: true,
            video: true,
            assistant: {
              voice: {
                provider: "cartesia",
                voiceId: "565510e8-6b45-45de-8758-13588fbaec73",
              },
              firstMessage: "Hello! I'm your virtual home inspector. I'll guide you through the inspection process. Please show me around the property.",
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to start inspection call:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!isCallActive ? (
        <button
          onClick={startDemoCall}
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Start Virtual Inspection
        </button>
      ) : (
        <div id="vapi-call-container" className="w-full aspect-video rounded-lg overflow-hidden bg-black/10" />
      )}
    </div>
  );
}