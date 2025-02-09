import { calendarService } from "@/services/calendarService";

async function testCalendarBooking() {
  try {
    // 1. First test getting available slots
    console.log("Testing getAvailableSlots...");
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Look for slots in the next 7 days

    const availableSlots = await calendarService.getAvailableSlots(
      startDate.toISOString(),
      endDate.toISOString()
    );
    console.log("Available slots:", availableSlots);

    // 2. Test creating a booking
    console.log("\nTesting createBooking...");
    const booking = await calendarService.createBooking({
      startTime: "2024-04-01T10:00:00Z", // Use an available slot from the previous call
      endTime: "2024-04-01T11:00:00Z",
      name: "Test User",
      email: "test@example.com",
      address: "123 Test St, Test City",
      notes: "This is a test booking",
    });
    console.log("Booking created:", booking);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testCalendarBooking();
