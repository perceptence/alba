import { useState, useEffect } from "react";
import { RES } from "./data";

/* Lease renewal domain. The current term ends 30 September 2026 and a
   renewal offer is already on the table — the resident reviews it and
   accepts or declines. */

export const RENEWAL = {
  offeredOn: "Jul 2, 2026",
  respondBy: "Aug 31, 2026",
  currentEnd: "Sep 30, 2026",
  newStart: "Oct 1, 2026",
  newEnd: "Sep 30, 2027",
  dates: "Oct 1, 2026 – Sep 30, 2027",
  termLength: "12 months",
  currentRent: RES.rent,
  proposedRent: 19300,
  deposit: "Unchanged · held in escrow",
};

// The renewal timeline. The first step is done; the second is where the
// resident is now.
export const RENEWAL_STEPS = [
  { label: "Offer prepared", when: "Jul 2, 2026", d: "Rosa has sent your renewal terms.", state: "done" },
  { label: "Your decision", when: "By Aug 31, 2026", d: "Accept the offer, or let the term conclude.", state: "now" },
  { label: "New term begins", when: "Oct 1, 2026", d: "A fresh 12-month term, seamlessly.", state: "future" },
];

export const renewalStore = (() => {
  let status = "review"; // review | accepted | declined
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
