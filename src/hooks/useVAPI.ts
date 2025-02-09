import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

interface VAPIConfig {
  assistantConfig: {
    firstMessage: string;
    voice: {
      provider: string;
      voiceId: string;
    };
  };
}

export function useVAPI({ assistantConfig }: VAPIConfig) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const vapi =
    typeof window !== "undefined"
      ? new Vapi(
          process.env.NEXT_PUBLIC_VAPI_KEY ||
            "9eff40b0-e1ac-4e52-a48e-6e4723c38043"
        )
      : null;

  useEffect(() => {
    if (!vapi || typeof window === "undefined") return;

    const onCallStart = () => {
      setConnecting(false);
      setConnected(true);
    };

    const onCallEnd = () => {
      setConnecting(false);
      setConnected(false);
    };

    const onSpeechStart = () => setAssistantIsSpeaking(true);
    const onSpeechEnd = () => setAssistantIsSpeaking(false);
    const onVolumeLevel = (level: number) => setVolumeLevel(level);
    const onError = (error: any) => {
      console.error("VAPI error:", error);
      setConnecting(false);
    };

    // Register event listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("error", onError);

    // Cleanup function
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);
      vapi.off("error", onError);
    };
  }, [vapi]);

  const startCall = async () => {
    try {
      if (!vapi) throw new Error("VAPI not initialized");

      const callId = `inspection-${Date.now()}`;
      setConnecting(true);

      await vapi.start({
        name: "Home-Inspector-AI",
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          systemPrompt: `You are a professional home inspector AI assistant. Help users schedule home inspections by gathering property details and scheduling appointments. Guide them through the process and answer any questions about the inspection service.`,
          functions: [
            {
              name: "getAvailableSlots",
              async: true,
              description:
                "Gets available inspection time slots for a given date range",
              parameters: {
                type: "object",
                properties: {
                  startDate: {
                    type: "string",
                    description: "Start date for availability search",
                  },
                  endDate: {
                    type: "string",
                    description: "End date for availability search",
                  },
                  propertyAddress: {
                    type: "string",
                    description: "Address of the property to be inspected",
                  },
                },
              },
            },
            {
              name: "scheduleInspection",
              async: true,
              description: "Books a home inspection appointment",
              parameters: {
                type: "object",
                properties: {
                  datetime: {
                    type: "string",
                    description: "Date and time for the inspection",
                  },
                  propertyAddress: {
                    type: "string",
                    description: "Address of the property to be inspected",
                  },
                  contactName: {
                    type: "string",
                    description: "Name of the person booking the inspection",
                  },
                  contactEmail: {
                    type: "string",
                    description: "Email address for booking confirmation",
                  },
                  contactPhone: {
                    type: "string",
                    description: "Phone number for the inspection contact",
                  },
                  propertyType: {
                    type: "string",
                    description:
                      "Type of property (e.g., single-family, condo, etc.)",
                  },
                  specialInstructions: {
                    type: "string",
                    description:
                      "Any special instructions or notes for the inspector",
                  },
                },
                required: [
                  "datetime",
                  "propertyAddress",
                  "contactName",
                  "contactEmail",
                ],
              },
            },
          ],
        },
        voice: assistantConfig.voice,
        firstMessage: assistantConfig.firstMessage,
        serverUrl: process.env.NEXT_PUBLIC_API_URL || "/api/webhook",
      });

      setIsCallActive(true);
    } catch (error) {
      console.error("Failed to start VAPI call:", error);
      setConnecting(false);
    }
  };

  const endCall = () => {
    if (!vapi) return;
    vapi.stop();
    setIsCallActive(false);
    setConnected(false);
  };

  useEffect(() => {
    return () => {
      if (isCallActive) {
        endCall();
      }
    };
  }, [isCallActive]);

  return {
    startCall,
    endCall,
    isCallActive,
    connecting,
    connected,
    assistantIsSpeaking,
    volumeLevel,
    vapi,
  };
}
