import { useState, useEffect } from "react";

/* Charges & statements: money beyond rent. Incidental charges the estate
   passes through (extra housekeeping, spa evenings, a cellar delivery),
   most settled by autopay, and monthly statements that fold rent and
   incidentals together. */

export const CHARGE_STATUS = {
  due: { label: "Due", tone: "a" },
  settled: { label: "Settled", tone: "g" },
};

const AUTOPAY = "Autopay · City National ···· 4291";

export const STATEMENTS = [
  { id: "st-6", period: "June 2026", rent: 18500, paid: "1 July 2026",
    extras: [["Additional housekeeping", 240], ["Spa heating", 180], ["Grounds — rose planting", 380]] },
  { id: "st-5", period: "May 2026", rent: 18500, paid: "1 June 2026", extras: [] },
  { id: "st-4", period: "April 2026", rent: 18500, paid: "1 May 2026",
    extras: [["Vehicle detailing", 160], ["Cellar delivery handling", 180]] },
];
export const stmtTotal = (s) => s.rent + s.extras.reduce((a, [, v]) => a + v, 0);
export const stmtOf = (id) => STATEMENTS.find((s) => s.id === id);

export const chargeStore = (() => {
  let charges = [
    { id: "c-1", label: "Wine cellar restocking", detail: "Case delivery · pass-through", amount: 1450, date: "3 July 2026", status: "due" },
    { id: "c-2", label: "Additional housekeeping", detail: "Guest suite turndown", amount: 240, date: "28 June 2026", status: "settled", via: AUTOPAY },
    { id: "c-3", label: "Spa heating", detail: "Three evenings", amount: 180, date: "21 June 2026", status: "settled", via: AUTOPAY },
    { id: "c-4", label: "Grounds — rose planting", detail: "West border", amount: 380, date: "12 June 2026", status: "settled", via: AUTOPAY },
    { id: "c-5", label: "Vehicle detailing", detail: "Garage bay", amount: 160, date: "2 June 2026", status: "settled", via: AUTOPAY },
  ];
  const subs = new Set(), emit = () => subs.forEach((f) => f());
  const settleOne = (c) => ({ ...c, status: "settled", via: "Card · City National ···· 4291" });
  return {
    all: () => charges,
    due: () => charges.filter((c) => c.status === "due"),
    dueTotal: () => charges.filter((c) => c.status === "due").reduce((a, c) => a + c.amount, 0),
    get: (id) => charges.find((c) => c.id === id),
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
    settle: (id) => { charges = charges.map((c) => (c.id === id ? settleOne(c) : c)); emit(); },
    settleAll: () => { charges = charges.map((c) => (c.status === "due" ? settleOne(c) : c)); emit(); },
  };
})();

export function useCharges() {
  const [, f] = useState(0);
  useEffect(() => chargeStore.subscribe(() => f((n) => n + 1)), []);
  return chargeStore;
}
