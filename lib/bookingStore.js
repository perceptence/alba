import { useState, useEffect } from "react";

/* Service booking domain: a curated menu of things the estate does on a
   schedule, and the resident's bookings against it. Turns the freeform
   Concierge ask into a front desk — each service offers concrete slots,
   and a booking lands on the household schedule. */

// The bookable menu. Slots are [day, window] the schedule can read; several
// are drawn from the House guide (spa a day ahead, pool service, cellar).
export const SERVICES = [
  { id: "housekeeping", label: "Housekeeping", d: "A full clean and linen refresh", icon: "towel",
    slots: [["Wednesday", "Morning"], ["Friday", "Morning"], ["Saturday", "Morning"]] },
  { id: "spa", label: "Spa heating", d: "Warm the spa for the evening", icon: "sun", lead: "Best requested a day ahead",
    slots: [["Today", "Evening"], ["Tomorrow", "Evening"]] },
  { id: "pool", label: "Extra pool service", d: "An added clean and chemical balance", icon: "leaf",
    slots: [["Monday", "Morning"], ["Thursday", "Morning"]] },
  { id: "cellar", label: "Cellar opening", d: "For a delivery or a selection", icon: "key", lead: "Let Rosa know before any delivery",
    slots: [["Tomorrow", "Morning"], ["Thursday", "Afternoon"]] },
  { id: "windows", label: "Window cleaning", d: "Interior and exterior glazing", icon: "towel",
    slots: [["Wednesday", "Afternoon"], ["Friday", "Morning"]] },
  { id: "car", label: "Vehicle detailing", d: "At the garage bay", icon: "box",
    slots: [["Wednesday", "Afternoon"], ["Saturday", "Morning"]] },
];

export const svcOf = (id) => SERVICES.find((s) => s.id === id);

export const BOOK_STATUS = {
  requested: { label: "Requested", tone: "a" },
  confirmed: { label: "Confirmed", tone: "g" },
  cancelled: { label: "Cancelled", tone: "n" },
};

export const bookingStore = (() => {
  let bookings = [
    { id: "bk-1", service: "windows", label: "Window cleaning", day: "Wednesday", window: "Afternoon", note: "", status: "confirmed" },
  ];
  const subs = new Set(), emit = () => subs.forEach((f) => f());
  return {
    all: () => bookings,
    live: () => bookings.filter((b) => b.status !== "cancelled"),
    get: (id) => bookings.find((b) => b.id === id),
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
    book: (d) => {
      const id = "bk-" + Date.now();
      bookings = [{ id, status: "requested", ...d }, ...bookings];
      emit();
      // Rosa confirms shortly, as she does with requests.
      setTimeout(() => {
        bookings = bookings.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b));
        emit();
      }, 1800);
      return id;
    },
    cancel: (id) => {
      bookings = bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b));
      emit();
    },
  };
})();

export function useBookings() {
  const [, f] = useState(0);
  useEffect(() => bookingStore.subscribe(() => f((n) => n + 1)), []);
  return bookingStore;
}
