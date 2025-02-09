import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        "Content-Type": "application/json",
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify({
        start: "2024-04-01T10:00:00Z",
        lengthInMinutes: 30,
        eventTypeId: process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_ID,
        attendee: {
          name: "Test User",
          email: "test@example.com",
          timeZone: "America/New_York",
        },
        metadata: {
          type: "home-inspection",
          address: "123 Test St, Test City",
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Booking test error:", error);
    return NextResponse.json(
      { error: "Failed to test booking API" },
      { status: 500 }
    );
  }
}
