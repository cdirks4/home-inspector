import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Use environment variable for API key
    const apiKey = process.env.CAL_API_KEY;
    if (!apiKey) {
      throw new Error("CAL_API_KEY environment variable is not set");
    }

    const response = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer cal_live_6d0a26a823038e293c46a72df16a03aa`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventTypeId: "connor-dirks-kexqrk/30min",
        start: body.startTime,
        lengthInMinutes: 30,
        attendee: {
          name: body.name,
          email: body.email,
          timeZone: "America/New_York",
          notes: body.notes,
        },
        metadata: {
          address: body.address,
          source: "home-inspector-app",
        },
      }),
    });

    const data = await response.json();
    console.log("Cal.com API Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || "Booking failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
