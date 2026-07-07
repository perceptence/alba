import { useState, useEffect } from "react";

/* Guest access domain: time-boxed passes to the estate. Each pass carries
   a name, a visiting relationship, arrival/stay, the areas it opens, and a
   generated gate code. The estate (Rosa) is notified of every pass — the
   app already knows the gate code rotates and the locks are app-controlled,
   so this is the resident acting on that. */

// Areas a pass can open. Mirrors the House guide: gate, pool gate, and the
// app-controlled front door.
export const GUEST_SCOPES = {
  gate: { label: "Front gate", d: "Drive-in at the main gate" },
  pool: { label: "Pool gate", d: "Side entrance to pool & grounds" },
  door: { label: "Front door", d: "Smart-lock entry to the residence" },
};

export const GUEST_KIN = ["Family", "Friend", "Guest", "Service / vendor"];

// Arrival options offered on invite, mapped to a weekday the schedule reads.
export const GUEST_WHEN = {
  Today: "Tuesday",
  Tomorrow: "Wednesday",
  "This weekend": "Saturday",
  "Next week": null,
};
export const GUEST_STAY = ["The day", "Overnight", "The weekend", "A week"];

// A quiet 4-digit code, avoiding a leading zero so it reads cleanly.
const genCode = () => String(Math.floor(1000 + Math.random() * 9000));

export const guestStore = (() => {
  let passes = [
    {
      id: "g-2", name: "Dr. Anaïs Roy", kin: "Service / vendor",
      when: "Today", arriveDow: "Tuesday", stay: "The day",
      arrive: "Today", depart: "Today, by evening",
      gateCode: "9037", scopes: ["gate", "door"], status: "active",
      note: "Afternoon house call — please show her to the primary suite.",
    },
    {
      id: "g-1", name: "Camille Léon", kin: "Family",
      when: "This weekend", arriveDow: "Saturday", stay: "The weekend",
      arrive: "Saturday", depart: "Sunday evening",
      gateCode: "4821", scopes: ["gate", "pool"], status: "upcoming",
      note: "Staying in the guest suite for the weekend.",
    },
  ];
  const subs = new Set(), emit = () => subs.forEach((f) => f());
  return {
    all: () => passes,
    live: () => passes.filter((p) => p.status === "active" || p.status === "upcoming"),
    get: (id) => passes.find((p) => p.id === id),
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
    invite: (d) => {
      const id = "g-" + Date.now();
      const status = d.when === "Today" ? "active" : "upcoming";
      const arriveDow = GUEST_WHEN[d.when] || null;
      passes = [{ id, gateCode: genCode(), status, arriveDow, ...d }, ...passes];
      emit();
      return id;
    },
    revoke: (id) => {
      passes = passes.map((p) => (p.id === id ? { ...p, status: "revoked" } : p));
      emit();
    },
  };
})();

export function useGuests() {
  const [, f] = useState(0);
  useEffect(() => guestStore.subscribe(() => f((n) => n + 1)), []);
  return guestStore;
}
