import { calendarService } from "../services/calendarService";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testCalendarBooking() {
  try {
    // 1. First test getting available slots
    console.log("Testing getAvailableSlots...");
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const availableSlots = await calendarService.getAvailableSlots(
      startDate.toISOString(),
      endDate.toISOString()
    );
    console.log("Available slots:", availableSlots);

    // 2. Test creating a booking
    console.log("\nTesting createBooking...");
    const booking = await calendarService.createBooking({
      startTime: "2024-04-01T10:00:00Z",
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

testCalendarBooking()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err));
