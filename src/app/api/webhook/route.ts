import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Webhook received:", data);

    // Check if this is a completion event with structured data
    if (data.type === "call.completed" && data.structuredData) {
      const bookingPayload = {
        startTime: data.structuredData.appointmentDate,
        name: data.structuredData.customerName,
        email: data.structuredData.customerEmail,
        notes: `Property Type: ${data.structuredData.propertyType}, Square Footage: ${data.structuredData.squareFootage}`,
        address: data.structuredData.address,
      };

      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      const bookingResult = await bookingResponse.json();
      console.log("Booking created:", bookingResult);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
