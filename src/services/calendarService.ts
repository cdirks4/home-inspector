import { CalAPIError } from "@calcom/api-client";

interface BookingDetails {
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  notes?: string;
  address?: string;
}

export class CalendarService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.cal.com/v1";
  }

  async getAvailableSlots(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/availability`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime: startDate,
          endTime: endDate,
          // Add any additional parameters required by your Cal.com setup
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching available slots:", error);
      throw error;
    }
  }

  async createBooking(details: BookingDetails): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: details.startTime,
          end: details.endTime,
          eventTypeId: process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_ID, // Add this to your env
          name: details.name,
          email: details.email,
          notes: details.notes,
          location: details.address,
          // Add any additional booking parameters required
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new CalAPIError("Booking creation failed", error);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }
}

// Create a singleton instance
export const calendarService = new CalendarService(
  process.env.CAL_API_KEY || ""
);
