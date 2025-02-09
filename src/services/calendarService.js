class CalendarService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.cal.com/v2";
    this.username = "connor-dirks-kexqrk";
  }

  async getAvailableSlots(startDate, endDate) {
    try {
      const response = await fetch(
        `${this.baseUrl}/slots/${this.username}/30min`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateFrom: startDate,
            dateTo: endDate,
            timeZone: "America/New_York",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching available slots:", error);
      throw error;
    }
  }

  async createBooking(details) {
    try {
      const response = await fetch(`${this.baseUrl}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventTypeId: "30min",
          start: details.startTime,
          end: details.endTime,
          name: details.name,
          email: details.email,
          notes: details.notes,
          location: details.address,
          timeZone: "America/New_York",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Booking creation failed: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }
}

module.exports = { CalendarService };
