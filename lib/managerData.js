import { useState, useEffect } from "react";

/* The estate manager's side of ALBA — Rosa's operator view. Where the resident
   app is one household, Rosa oversees several estates at once, so this data is
   a queue of incoming requests across residents. Statuses, categories and
   priorities reuse the resident concierge model (lib/conciergeStore) so the
   two sides speak the same language — Adrien's own requests surface here too. */

export const ROSA_DESK = { name: "Rosa Ibáñez", first: "Rosa", role: "Estate manager" };

// priority → the one clay accent, weighted: urgent solid, soon soft, routine hairline
export const PRI = { Urgent: "urgent", Soon: "soon", Routine: "routine" };

// Seed requests across estates. `new` = just in, not yet acknowledged (needs Rosa);
// otherwise she's already actioned it. Ordered newest / most-urgent first.
const SEED = [
  { id:"mq-1", who:"Marcus Reïd",      init:"MR", estate:"Stone Canyon Villa", area:"Bel-Air",
    category:"maintenance", title:"AC servicing before Friday's guests", priority:"Urgent", status:"submitted", time:"22m",
    note:"Guests arrive Friday evening and the upstairs units aren't cooling. Can we get someone out before then?" },
  { id:"mq-2", who:"Priya Menon",      init:"PM", estate:"The Palisade House", area:"Pacific Palisades",
    category:"access", title:"Gate code for weekend guests", priority:"Soon", status:"submitted", time:"8m",
    note:"Two guests staying Sat–Sun. Could you set them up with gate and door access?" },
  { id:"mq-3", who:"Camille Fournier", init:"CF", estate:"The Cypress House", area:"Brentwood",
    category:"housekeeping", title:"Move housekeeping to Thursday", priority:"Routine", status:"submitted", time:"40m",
    note:"Away Wednesday — could we shift this week's housekeeping to Thursday morning?" },
  { id:"mq-4", who:"Théo Lambert",     init:"TL", estate:"Canyon Rise", area:"Bel-Air",
    category:"maintenance", title:"Leak under the kitchen sink", priority:"Urgent", status:"in_progress", time:"1h",
    note:"Slow leak in the cabinet under the sink — towels down for now.", eta:"Plumber on site · ETA 30 min" },
  { id:"mq-5", who:"Adrien Léon",      init:"AL", estate:"The Verde Bungalow", area:"Bel-Air",
    category:"maintenance", title:"Pool heater cycling off", priority:"Soon", status:"in_progress", time:"3h",
    note:"The pool heater keeps cycling off after a few minutes.", eta:"Technician booked · Thu AM" },
  { id:"mq-6", who:"Élise Moreau",     init:"ÉM", estate:"The Olive Court", area:"Holmby Hills",
    category:"delivery", title:"Accept a wine delivery while away", priority:"Routine", status:"acknowledged", time:"Yesterday",
    note:"A case is arriving Thursday. Could someone receive it and store it in the cellar?" },
  { id:"mq-7", who:"Sofia Marchetti",  init:"SM", estate:"The Laurel", area:"Brentwood",
    category:"housekeeping", title:"Weekly linens — standing order", priority:"Routine", status:"scheduled", time:"Yesterday",
    note:"Set up a standing weekly linen refresh.", eta:"Housekeeping · Fridays AM" },
  { id:"mq-8", who:"Adrien Léon",      init:"AL", estate:"The Verde Bungalow", area:"Bel-Air",
    category:"access", title:"Spare gate remote", priority:"Routine", status:"resolved", time:"Mon",
    note:"Could I get a spare gate remote?" },
  { id:"mq-9", who:"Marcus Reïd",      init:"MR", estate:"Stone Canyon Villa", area:"Bel-Air",
    category:"question", title:"Recommendation for a private chef?", priority:"Routine", status:"resolved", time:"Mon",
    note:"Hosting a dinner next month — any chef you'd recommend?" },
];

const NEW = (r) => r.status === "submitted";
const RESOLVED = (r) => r.status === "resolved";
const OPEN = (r) => !RESOLVED(r);

export const TABS = [
  { key:"needs", label:"Needs you",   match:NEW },
  { key:"prog",  label:"In progress", match:(r)=>OPEN(r) && !NEW(r) },
  { key:"done",  label:"Resolved",    match:RESOLVED },
];

// A tiny subscribe-able store so operator actions (acknowledge / resolve)
// update the queue live, mirroring the resident-side store pattern.
export const deskStore = (() => {
  let reqs = SEED.map((r) => ({ ...r }));
  const subs = new Set(), emit = () => subs.forEach((f) => f());
  const set = (id, patch) => { reqs = reqs.map((r) => r.id === id ? { ...r, ...patch } : r); emit(); };
  return {
    all: () => reqs,
    get: (id) => reqs.find((r) => r.id === id),
    counts: () => ({ needs: reqs.filter(NEW).length, open: reqs.filter(OPEN).length, done: reqs.filter(RESOLVED).length }),
    acknowledge: (id) => set(id, { status:"acknowledged" }),
    resolve: (id) => set(id, { status:"resolved" }),
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
  };
})();

export function useDesk() { const [, f] = useState(0); useEffect(() => deskStore.subscribe(() => f((n) => n + 1)), []); return deskStore; }
