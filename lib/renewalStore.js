import { useState, useEffect } from "react";
import { RES } from "./data";

/* Lease renewal domain. The window opens December 2026 — ahead of it, the
   resident can register interest so Rosa prepares terms early. Terms shown
   now are indicative and confirmed when the window opens. */

export const RENEWAL = {
  windowOpens: "December 2026",
  currentEnd: "31 March 2027",
  newStart: "1 April 2027",
  newEnd: "31 March 2028",
  termLength: "12 months",
  currentRent: RES.rent,
  proposedRent: 19300,
  deposit: "Unchanged · held in escrow",
};

export const RENEWAL_STEPS = [
  { label: "Window opens", when: "December 2026", d: "Rosa shares your final renewal terms." },
  { label: "Your decision", when: "By February 2027", d: "Confirm and sign, or let the term conclude." },
  { label: "New term begins", when: "April 2027", d: "A fresh 12-month term, seamlessly." },
];

export const renewalStore = (() => {
  let status = "none"; // none | interested | declined
  const subs = new Set(), emit = () => subs.forEach((f) => f());
  return {
    status: () => status,
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
    set: (s) => { status = s; emit(); },
  };
})();

export function useRenewal() {
  const [, f] = useState(0);
  useEffect(() => renewalStore.subscribe(() => f((n) => n + 1)), []);
  return renewalStore;
}
