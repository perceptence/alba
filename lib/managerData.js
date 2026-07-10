import { useState, useEffect } from "react";

/* The estate manager's side of ALBA — Rosa's operator data. Where the resident
   app is one household, Rosa oversees a portfolio of estates, each with its own
   residents (an estate can have more than one), documents, lease and a stream of
   requests. Estates and residents are first-class, linked records so nothing is
   lost from the manager's view; requests reference them by id and are enriched
   with display fields so the queue reads without extra lookups. */

export const ROSA_DESK = { name: "Rosa Ibáñez", first: "Rosa", role: "Estate manager" };
export const PRI = { Urgent: "urgent", Soon: "soon", Routine: "routine" };

const docs = (signed) => [
  { t: "Residence agreement", tag: `Legal · Signed ${signed}` },
  { t: "House guide", tag: "Systems, access & care" },
  { t: "Insurance certificate", tag: "Owner policy · Liability $5M" },
  { t: "Move-in inventory", tag: "Signed condition report" },
];

// The portfolio — full detail per estate, so Rosa has a reference point for
// whatever a resident means by "the Verde Bungalow".
export const ESTATES = [
  { id:"verde",    name:"The Verde Bungalow", short:"Verde Bungalow", area:"Bel-Air",
    address:"1200 Stone Canyon Road, Bel-Air", kind:"Detached bungalow", beds:4, baths:3, size:420,
    about:"A single-storey modernist bungalow behind mature olives — full-height glazing opens the living wing to a west terrace and saltwater pool.",
    amenities:["Saltwater pool","Olive garden","Wine cellar","EV charging"],
    lease:{ term:"Aug 2023 – Mar 2027", rent:18500, deposit:37000, note:"On term · renewal window opens Dec 2026" },
    docs: docs("Aug 2023") },
  { id:"stone",    name:"Stone Canyon Villa", short:"Stone Canyon", area:"Bel-Air",
    address:"1450 Bellagio Road, Bel-Air", kind:"Mediterranean villa", beds:6, baths:6, size:560,
    about:"A gated Mediterranean villa with a colonnaded loggia, tennis lawn and a chef's kitchen off a four-car motor court.",
    amenities:["Tennis lawn","Chef's kitchen","Motor court","Guest wing"],
    lease:{ term:"Feb 2024 – Feb 2027", rent:32000, deposit:64000, note:"On term" },
    docs: docs("Feb 2024") },
  { id:"palisade", name:"The Palisade House", short:"Palisade House", area:"Pacific Palisades",
    address:"270 Chautauqua Boulevard, Pacific Palisades", kind:"Cliffside contemporary", beds:5, baths:5, size:500,
    about:"A cliffside contemporary with ocean views, an infinity pool and a glass-walled great room over the bluff.",
    amenities:["Infinity pool","Ocean terrace","Home cinema"],
    lease:{ term:"May 2024 – May 2026", rent:26000, deposit:52000, note:"On term" },
    docs: docs("May 2024") },
  { id:"cypress",  name:"The Cypress House", short:"Cypress House", area:"Brentwood",
    address:"525 N Cliffwood Avenue, Brentwood", kind:"Brick traditional", beds:4, baths:4, size:380,
    about:"A brick traditional under old cypress, with a walled rose garden, a panelled library and a guest cottage.",
    amenities:["Rose garden","Library","Guest cottage"],
    lease:{ term:"Sep 2023 – Aug 2026", rent:21000, deposit:42000, note:"On term" },
    docs: docs("Sep 2023") },
  { id:"canyon",   name:"Canyon Rise", short:"Canyon Rise", area:"Bel-Air",
    address:"980 Linda Flora Drive, Bel-Air", kind:"Hillside modern", beds:4, baths:4, size:440,
    about:"A hillside modern of glass and board-formed concrete, cantilevered over the canyon with a cold plunge on the deck.",
    amenities:["Canyon deck","Cold plunge","EV charging"],
    lease:{ term:"Jan 2025 – Dec 2026", rent:24000, deposit:48000, note:"On term" },
    docs: docs("Jan 2025") },
  { id:"olive",    name:"The Olive Court", short:"Olive Court", area:"Holmby Hills",
    address:"355 S Mapleton Drive, Holmby Hills", kind:"Courtyard estate", beds:7, baths:8, size:720,
    about:"A courtyard estate wrapped around a central olive garden, with a ballroom, staff quarters and a climate-set cellar.",
    amenities:["Olive courtyard","Ballroom","Wine cellar","Staff quarters"],
    lease:{ term:"Nov 2023 – Oct 2026", rent:48000, deposit:96000, note:"On term" },
    docs: docs("Nov 2023") },
  { id:"laurel",   name:"The Laurel", short:"The Laurel", area:"Brentwood",
    address:"150 S Bristol Avenue, Brentwood", kind:"Garden house", beds:3, baths:3, size:300,
    about:"A compact garden house behind mature laurel hedging, with a lap pool, a garden studio and an outdoor kitchen.",
    amenities:["Lap pool","Garden studio","Outdoor kitchen"],
    lease:{ term:"Mar 2025 – Feb 2027", rent:16500, deposit:33000, note:"On term" },
    docs: docs("Mar 2025") },
];

// Residents — an estate can hold more than one (see Stone Canyon).
export const RESIDENTS = [
  { id:"adrien",  name:"Adrien Léon",      init:"AL", estate:"verde",    role:"Resident",    since:"Aug 2023", phone:"+1 (310) 555 0148", email:"adrien.leon@mail.com" },
  { id:"marcus",  name:"Marcus Reïd",      init:"MR", estate:"stone",    role:"Resident",    since:"Feb 2024", phone:"+1 (310) 555 0192", email:"m.reid@mail.com" },
  { id:"noah",    name:"Noah Reïd",        init:"NR", estate:"stone",    role:"Co-resident", since:"Feb 2024", phone:"+1 (310) 555 0193", email:"noah.reid@mail.com" },
  { id:"priya",   name:"Priya Menon",      init:"PM", estate:"palisade", role:"Resident",    since:"May 2024", phone:"+1 (424) 555 0110", email:"priya.menon@mail.com" },
  { id:"camille", name:"Camille Fournier", init:"CF", estate:"cypress",  role:"Resident",    since:"Sep 2023", phone:"+1 (310) 555 0176", email:"c.fournier@mail.com" },
  { id:"theo",    name:"Théo Lambert",     init:"TL", estate:"canyon",   role:"Resident",    since:"Jan 2025", phone:"+1 (310) 555 0134", email:"theo.lambert@mail.com" },
  { id:"elise",   name:"Élise Moreau",     init:"ÉM", estate:"olive",    role:"Resident",    since:"Nov 2023", phone:"+1 (310) 555 0155", email:"elise.moreau@mail.com" },
  { id:"sofia",   name:"Sofia Marchetti",  init:"SM", estate:"laurel",   role:"Resident",    since:"Mar 2025", phone:"+1 (424) 555 0188", email:"s.marchetti@mail.com" },
];

export const byEst = (id) => ESTATES.find((e) => e.id === id);
export const byRes = (id) => RESIDENTS.find((r) => r.id === id);
export const estateResidents = (estId) => RESIDENTS.filter((r) => r.estate === estId);

// Incoming requests, referencing resident + estate by id. `new` = just in,
// not yet acknowledged (needs Rosa); otherwise she's already actioned it.
const SEED = [
  { id:"mq-1", resId:"marcus",  estId:"stone",    category:"maintenance", title:"AC servicing before Friday's guests", priority:"Urgent", status:"submitted", time:"22m",
    note:"Guests arrive Friday evening and the upstairs units aren't cooling. Can we get someone out before then?" },
  { id:"mq-2", resId:"priya",   estId:"palisade", category:"access", title:"Gate code for weekend guests", priority:"Soon", status:"submitted", time:"8m",
    note:"Two guests staying Sat–Sun. Could you set them up with gate and door access?" },
  { id:"mq-3", resId:"camille", estId:"cypress",  category:"housekeeping", title:"Move housekeeping to Thursday", priority:"Routine", status:"submitted", time:"40m",
    note:"Away Wednesday — could we shift this week's housekeeping to Thursday morning?" },
  { id:"mq-4", resId:"theo",    estId:"canyon",   category:"maintenance", title:"Leak under the kitchen sink", priority:"Urgent", status:"in_progress", time:"1h",
    note:"Slow leak in the cabinet under the sink — towels down for now.", reply:"On it — a plumber's on the way, about 30 minutes out.", eta:"Plumber on site · ETA 30 min" },
  { id:"mq-5", resId:"adrien",  estId:"verde",    category:"maintenance", title:"Pool heater cycling off", priority:"Soon", status:"in_progress", time:"3h",
    note:"The pool heater keeps cycling off after a few minutes.", reply:"Booked a technician for Thursday morning — I'll confirm the window.", eta:"Technician booked · Thu AM" },
  { id:"mq-6", resId:"elise",   estId:"olive",    category:"delivery", title:"Accept a wine delivery while away", priority:"Routine", status:"acknowledged", time:"Yesterday",
    note:"A case is arriving Thursday. Could someone receive it and store it in the cellar?", reply:"Of course — I'll have it received and stored in the cellar." },
  { id:"mq-7", resId:"sofia",   estId:"laurel",   category:"housekeeping", title:"Weekly linens — standing order", priority:"Routine", status:"scheduled", time:"Yesterday",
    note:"Set up a standing weekly linen refresh.", reply:"All set — housekeeping will refresh the linens every Friday morning.", eta:"Housekeeping · Fridays AM" },
  { id:"mq-8", resId:"adrien",  estId:"verde",    category:"access", title:"Spare gate remote", priority:"Routine", status:"resolved", time:"Mon",
    note:"Could I get a spare gate remote?", reply:"Left a spare remote at the gate for you — all set." },
  { id:"mq-9", resId:"marcus",  estId:"stone",    category:"question", title:"Recommendation for a private chef?", priority:"Routine", status:"resolved", time:"Mon",
    note:"Hosting a dinner next month — any chef you'd recommend?", reply:"Happy to — I'd suggest Chef Laurent; I'll make an introduction." },
];

// enrich a raw request with the display fields the queue expects
const enrich = (r) => {
  const p = byRes(r.resId), e = byEst(r.estId);
  return { ...r, who: p.name, init: p.init, estate: e.name, estateShort: e.short, area: e.area };
};

const NEW = (r) => r.status === "submitted";
const RESOLVED = (r) => r.status === "resolved";
const OPEN = (r) => !RESOLVED(r);

export const TABS = [
  { key:"needs", label:"Needs you",   match:NEW },
  { key:"prog",  label:"In progress", match:(r)=>OPEN(r) && !NEW(r) },
  { key:"done",  label:"Resolved",    match:RESOLVED },
];

export const deskStore = (() => {
  // Each request carries a thread: the resident's opening message (their note),
  // then Rosa's replies. f:"r" = resident, f:"m" = manager (Rosa).
  let reqs = SEED.map((r) => ({ ...r, thread: [
    { f:"r", t:r.note, at:r.time },
    ...(r.reply ? [{ f:"m", t:r.reply, at:r.time }] : []),
  ] }));
  const subs = new Set(), emit = () => subs.forEach((f) => f());
  const set = (id, patch) => { reqs = reqs.map((r) => r.id === id ? { ...r, ...patch } : r); emit(); };
  return {
    all: () => reqs.map(enrich),
    get: (id) => { const r = reqs.find((x) => x.id === id); return r && enrich(r); },
    forEstate: (estId) => reqs.filter((r) => r.estId === estId).map(enrich),
    forResident: (resId) => reqs.filter((r) => r.resId === resId).map(enrich),
    openCountEstate: (estId) => reqs.filter((r) => r.estId === estId && OPEN(r)).length,
    openCountResident: (resId) => reqs.filter((r) => r.resId === resId && OPEN(r)).length,
    urgentCountEstate: (estId) => reqs.filter((r) => r.estId === estId && OPEN(r) && r.priority === "Urgent").length,
    urgentCountResident: (resId) => reqs.filter((r) => r.resId === resId && OPEN(r) && r.priority === "Urgent").length,
    counts: () => ({ needs: reqs.filter(NEW).length, open: reqs.filter(OPEN).length, done: reqs.filter(RESOLVED).length }),
    acknowledge: (id) => set(id, { status:"acknowledged" }),
    resolve: (id) => set(id, { status:"resolved" }),
    // Rosa replies: log it to the thread and, if the request was still new,
    // move it to acknowledged (she's responded).
    reply: (id, text) => { reqs = reqs.map((r) => r.id === id
      ? { ...r, status: r.status === "submitted" ? "acknowledged" : r.status, thread: [...r.thread, { f:"m", t:text, at:"Just now" }] }
      : r); emit(); },
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
  };
})();

export function useDesk() { const [, f] = useState(0); useEffect(() => deskStore.subscribe(() => f((n) => n + 1)), []); return deskStore; }

/* ——— Schedule — a week agenda across the estates, day-grouped like the
   resident household schedule. Service visits, deliveries and guest arrivals;
   some entries link to the request that prompted them (tap → its detail). ——— */
const DOW = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SCHED_TODAY = "Tuesday"; // shared anchor day with the resident app
const orderFrom = (start) => { const s = DOW.indexOf(start); return DOW.map((_, i) => DOW[(s + i) % 7]); };
const WIN_RANK = { Morning: 0, Afternoon: 1, Evening: 2 };
// imminent items (an ETA / "in N min") lead the day; then morning→evening.
const winRank = (w) => !w ? 3 : /ETA|\bmin\b|now/i.test(w) ? -1 : (WIN_RANK[w] ?? 3);

const MGR_EVENTS = [
  { dow:"Tuesday",   title:"Plumber — kitchen leak", sub:"Canyon Rise · Théo Lambert",       window:"ETA 30 min", icon:"wrench", type:"request", reqId:"mq-4" },
  { dow:"Tuesday",   title:"Pool service",           sub:"The Olive Court",                  window:"Morning",    icon:"leaf",   type:"estate" },
  { dow:"Wednesday", title:"Trash & recycling",      sub:"Stone Canyon Villa",               window:null,         icon:"box",    type:"estate" },
  { dow:"Wednesday", title:"Housekeeping",           sub:"The Palisade House · Priya Menon",  window:"Afternoon",  icon:"towel",  type:"estate" },
  { dow:"Thursday",  title:"Pool heater technician", sub:"The Verde Bungalow · Adrien Léon",  window:"Morning",    icon:"wrench", type:"request", reqId:"mq-5" },
  { dow:"Thursday",  title:"Wine delivery received", sub:"The Olive Court · Élise Moreau",    window:"Afternoon",  icon:"box",    type:"request", reqId:"mq-6" },
  { dow:"Thursday",  title:"Gardener",               sub:"Bel-Air estates",                  window:"Morning",    icon:"leaf",   type:"estate" },
  { dow:"Friday",    title:"Weekly linens",          sub:"The Laurel · Sofia Marchetti",      window:"Morning",    icon:"towel",  type:"request", reqId:"mq-7" },
  { dow:"Friday",    title:"Marcus's guests arrive", sub:"Stone Canyon Villa",               window:"Evening",    icon:"users",  type:"guest" },
  { dow:"Saturday",  title:"Priya's guests arrive",  sub:"The Palisade House",               window:null,         icon:"key",    type:"guest" },
];

export function deskAgenda() {
  return orderFrom(SCHED_TODAY)
    .map((dow, i) => ({
      dow,
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dow,
      isToday: i === 0,
      entries: MGR_EVENTS.filter((e) => e.dow === dow)
        .sort((a, b) => winRank(a.window) - winRank(b.window)),
    }))
    .filter((d) => d.isToday || d.entries.length > 0);
}
