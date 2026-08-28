import { createClient } from "./client";
import { findBarber, findService } from "@/lib/booking-options";

export type BookingInput = {
  barberId: string;
  serviceId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM", 24h
  name: string;
  phone: string;
};

/**
 * Inserts a confirmed booking into Supabase. Returns a human-readable error
 * string on failure (e.g. the `bookings` table doesn't exist yet because the
 * migration in supabase/migrations hasn't been run), or `null` on success.
 */
export async function submitBooking(
  input: BookingInput,
): Promise<{ error: string | null }> {
  const barber = findBarber(input.barberId);
  const service = findService(input.serviceId);

  if (!barber || !service) {
    return { error: "Something went wrong with your selection. Please start over." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("bookings").insert({
    barber_id: barber.id,
    service_id: service.id,
    service_name: service.name,
    service_price: service.price,
    service_duration_minutes: service.durationMinutes,
    booking_date: input.date,
    booking_time: input.time,
    customer_name: input.name,
    customer_phone: input.phone,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
