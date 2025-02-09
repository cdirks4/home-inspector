import { NextResponse } from "next/server";
import { calendarService } from "@/services/calendarService";

interface BookingRequest {
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  address: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();

    // Validate required fields
    if (
      !body.startTime ||
      !body.endTime ||
      !body.name ||
      !body.email ||
      !body.address
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the booking using the calendar service
    const booking = await calendarService.createBooking({
      startTime: body.startTime,
      endTime: body.endTime,
      name: body.name,
      email: body.email,
      address: body.address,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      booking,
      message: "Inspection booked successfully",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process booking request" },
      { status: 500 }
    );
  }
}
