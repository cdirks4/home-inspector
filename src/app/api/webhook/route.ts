import { NextResponse } from "next/server";

interface WebhookMessage {
  timestamp: number;
  type: string;
  status: string;
  role: string;
  artifact?: {
    messages: any[];
    messagesOpenAIFormatted: any[];
  };
  call: {
    id: string;
    orgId: string;
    createdAt: string;
    updatedAt: string;
    type: string;
    status: string;
    assistant: any;
  };
  structuredData?: any;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: WebhookMessage = body.message;

    console.log(`[Webhook] Event Type: ${message.type}`);
    console.log(`[Webhook] Status: ${message.status}`);
    console.log(`[Webhook] Call ID: ${message.call.id}`);

    switch (message.type) {
      case "speech-update":
        console.log("[Speech]", {
          role: message.role,
          status: message.status,
          messages: message.artifact?.messages,
        });
        break;

      case "call.completed":
        console.log("[Call Completed]", {
          callId: message.call.id,
          duration: Date.now() - message.timestamp,
          structuredData: message.structuredData,
        });

        if (message.structuredData) {
          const bookingPayload = {
            startTime: message.structuredData.appointmentDate,
            name: message.structuredData.customerName,
            email: message.structuredData.customerEmail,
            notes: `Property Type: ${message.structuredData.propertyType}, Square Footage: ${message.structuredData.squareFootage}`,
            address: message.structuredData.address,
          };

          const bookingResponse = await fetch("/api/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingPayload),
          });

          console.log("[Booking Created]", await bookingResponse.json());
        }
        break;

      case "structured-data":
        console.log("[Structured Data]", message.structuredData);
        break;

      default:
        console.log("[Other Event]", message);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
