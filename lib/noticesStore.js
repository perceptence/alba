import { useState, useEffect } from "react";
import { money } from "@/lib/util";
import { RES, ADRIEN } from "@/lib/data";

/* Notices domain: the estate's word to the resident.
   Each notice carries a category (for filtering), a weight ("act" needs
   the resident, "fyi" is for the record), an optional thread key so
   updates on one matter stack, an optional deep link the app resolves,
   and an optional `bq` clause the desk's brief is composed from. */

export const NT_CATS = {
  concierge: { label: "Concierge" },
  estate: { label: "The estate" },
  money: { label: "Money" },
};

/* day: 0 = today, 1 = yesterday, … (drives time grouping; list order is
   already newest-first). */
const ITEMS = [
  {id:"n-9",cat:"concierge",ic:"wrench",thread:"rq-1",day:0,w:"Today, 9:15 AM",weight:"act",unread:true,
   t:"Technician on site",d:"The pool heater specialist has arrived and is at work on the grounds.",
   bq:"the pool technician is on site this morning",
   act:{label:"Follow along",to:{type:"request",id:"rq-1"}}},
  {id:"n-8",cat:"estate",ic:"box",day:0,w:"Today, 8:02 AM",weight:"act",unread:true,
   t:"A parcel at the gatehouse",d:"A delivery from Hermès is held for you. We can bring it up at your word.",
   bq:"a parcel from Hermès waits at the gatehouse",
   act:{label:"Have it sent up",to:{type:"compose",preset:"delivery",note:"Please send up the parcel held at the gatehouse."}}},
  {id:"n-7",cat:"concierge",ic:"towel",thread:"rq-2",day:1,w:"Yesterday, 4:00 PM",weight:"fyi",unread:true,
   t:"Linen refresh scheduled",d:"Housekeeping visits Friday morning for the weekly refresh.",
   bq:"housekeeping follows Friday morning for linens",
   act:{label:"View request",to:{type:"request",id:"rq-2"}}},
  {id:"n-6",cat:"concierge",ic:"wrench",thread:"rq-1",day:1,w:"Yesterday, 11:05 AM",weight:"fyi",unread:false,
   t:"Pool technician confirmed",d:"Heater service booked for Thursday morning. Entry approved."},
  {id:"n-5",cat:"estate",ic:"leaf",day:2,w:"2 days ago",weight:"fyi",unread:false,
   t:"Grounds care Thursday",d:"Landscaping tends the gardens Thursday morning. No indoor access needed."},
  {id:"n-4",cat:"money",ic:"seal",day:3,w:"3 days ago",weight:"fyi",unread:false,
   t:"July rent settled",d:"Autopay processed "+money(RES.rent)+" on 1 July. Thank you.",
   act:{label:"View payment",to:{type:"payment",id:"p-2026-7"}}},
  {id:"n-3",cat:"money",ic:"renew",day:4,w:"This week",weight:"act",unread:false,
   t:"Lease renewal ahead",d:"Your term concludes "+ADRIEN.leaseEnd+". Rosa will share renewal terms this autumn.",
   act:{label:"Review lease",to:{type:"rent"}}},
  {id:"n-2",cat:"estate",ic:"sun",day:9,w:"Last week",weight:"fyi",unread:false,
   t:"Summer pool hours",d:"The estate pool keeps evening hours through August — open until 9 PM."},
  {id:"n-1",cat:"estate",ic:"doc",day:12,w:"Last week",weight:"fyi",unread:false,
   t:"Irrigation audit complete",d:"Annual grounds irrigation audit finished with no faults found."},
];

export const ntStore = (() => {
  const items = ITEMS;
  const subs = new Set(), emit = () => subs.forEach(f => f());
  const unread = new Set(items.filter(i => i.unread).map(i => i.id));
  return {
    all: () => items,
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
    isUnread: (id) => unread.has(id),
    unreadCount: () => unread.size,
    markRead: (id) => { if (unread.delete(id)) emit(); },
    markAllRead: () => { if (unread.size) { unread.clear(); emit(); } },
  };
})();

export function useNotices() {
  const [, f] = useState(0);
  useEffect(() => ntStore.subscribe(() => f(n => n + 1)), []);
  return ntStore;
}

/* The desk's brief — composed from the unread clauses, newest first.
   Reads as one unhurried sentence or two, never a list. */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const ntBrief = (items, max = 3) => {
  const cl = items.filter(i => ntStore.isUnread(i.id) && i.bq).slice(0, max).map(i => i.bq);
  if (cl.length === 0) return "All caught up — nothing needs your attention this evening.";
  if (cl.length === 1) return cap(cl[0]) + ".";
  if (cl.length === 2) return cap(cl[0]) + ", and " + cl[1] + ".";
  return cap(cl[0]) + ". " + cap(cl[1]) + ", and " + cl[2] + ".";
};
