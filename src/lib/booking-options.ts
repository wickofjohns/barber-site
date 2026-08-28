export type Barber = {
  id: "dylan" | "mitch";
  name: string;
};

export type Service = {
  id: "haircut" | "lineup" | "hair-and-beard";
  name: string;
  price: number;
  durationMinutes: number;
};

export const BARBERS: Barber[] = [
  { id: "dylan", name: "Dylan" },
  { id: "mitch", name: "Mitch" },
];

export const SERVICES: Service[] = [
  { id: "haircut", name: "Haircut", price: 25, durationMinutes: 25 },
  { id: "lineup", name: "Lineup", price: 15, durationMinutes: 20 },
  {
    id: "hair-and-beard",
    name: "Hair and Beard",
    price: 30,
    durationMinutes: 35,
  },
];

/**
 * Generates fixed time slots between business hours in 24h "HH:MM" form.
 * `endHour` is exclusive of the step that would start exactly at closing —
 * e.g. (9, 17, 30) stops at "16:30" so a slot always starts before close.
 */
function generateTimeSlots(
  startHour: number,
  endHour: number,
  stepMinutes: number,
): string[] {
  const slots: string[] = [];
  for (
    let minutes = startHour * 60;
    minutes < endHour * 60;
    minutes += stepMinutes
  ) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
  }
  return slots;
}

// Business hours: 9am-5pm, 30-minute slots.
export const TIME_SLOTS = generateTimeSlots(9, 17, 30);

export function formatTimeSlot(time: string): string {
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

export function findBarber(id: string): Barber | undefined {
  return BARBERS.find((barber) => barber.id === id);
}

export function findService(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id);
}
