import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bookingData = {
      eventTypeId: 1519210,
      start: body.startTime,
      attendee: {
        name: body.name,
        email: body.email,
        timeZone: "America/New_York",
        language: "en",
      },
      // lengthInMinutes: 30,
      location: body.address,
      bookingFieldsResponses: {
        notes: body.notes,
        address: body.address,
      },
      metadata: {
        source: "home-inspector-app",
      },
    };

    console.log("Sending booking data:", bookingData);

    const response = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer cal_live_6d0a26a823038e293c46a72df16a03aa`,
        "Content-Type": "application/json",
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify(bookingData),
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
