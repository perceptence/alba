import { cxStore } from "./conciergeStore";
import { guestStore } from "./guestStore";
import { renewalStore } from "./renewalStore";
import { LEASE } from "./data";

/* The household schedule: one agenda that gathers what's otherwise scattered
   — the estate's recurring service days, scheduled concierge requests,
   service bookings, and guest arrivals — into a week view. Lease milestones
   sit in a "later" list. Everything reads live from the domain stores. */

const DOW = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const SCHED_TODAY = "Tuesday"; // the prototype's anchor day
const orderFrom = (start) => { const s = DOW.indexOf(start); return DOW.map((_, i) => DOW[(s + i) % 7]); };

const findDow = (s = "") => DOW.find((d) => s.includes(d)) || null;
const winOf = (s = "") => /morning|\bAM\b/i.test(s) ? "Morning" : /afternoon|\bPM\b/i.test(s) ? "Afternoon" : /evening/i.test(s) ? "Evening" : null;
const winRank = { Morning: 0, Afternoon: 1, Evening: 2 };

// Estate services that recur every week, drawn from the House guide.
const RECURRING = [
  { dow: "Monday", title: "Pool service", sub: "Weekly clean & balance", icon: "leaf", type: "estate" },
  { dow: "Tuesday", title: "Trash & recycling", sub: "Bins out the night before", icon: "box", type: "estate" },
  { dow: "Thursday", title: "Gardener", sub: "Grounds & olive care", window: "Morning", icon: "leaf", type: "estate" },
];

// All entries for the current week, unsorted.
function weekEntries() {
  const out = RECURRING.map((r) => ({ ...r }));

  cxStore.all()
    .filter((r) => (r.status === "scheduled" || r.status === "in_progress") && r.scheduledFor)
    .forEach((r) => {
      const dow = findDow(r.scheduledFor);
      if (dow) out.push({ dow, window: winOf(r.scheduledFor), title: r.title, sub: "Concierge", icon: "wrench", type: "request", to: { type: "request", id: r.id } });
    });

  guestStore.live().forEach((g) => {
    if (g.arriveDow) out.push({ dow: g.arriveDow, window: null, title: g.name + " arrives", sub: "Guest pass", icon: "users", type: "guest" });
  });

  return out;
}

// Grouped by day, in week order from today; today is always shown.
export function weekAgenda() {
  const entries = weekEntries();
  return orderFrom(SCHED_TODAY)
    .map((dow, i) => ({
      dow,
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dow,
      isToday: i === 0,
      entries: entries
        .filter((e) => e.dow === dow)
        .sort((a, b) => (winRank[a.window] ?? 3) - (winRank[b.window] ?? 3)),
    }))
    .filter((d) => d.isToday || d.entries.length > 0);
}

// A short preview for the Home module: the next few entries, with day labels.
export function weekPreview(n = 3) {
  return weekAgenda().flatMap((d) => d.entries.map((e) => ({ ...e, day: d.label }))).slice(0, n);
}

// Lease milestones, beyond the current week. The renewal line reflects
// whether the resident has registered interest.
export function laterItems() {
  const rs = renewalStore.status();
  const renewalSub = rs === "accepted" ? "Renewal accepted" : rs === "declined" ? "Not renewing" : "Offer ready to review";
  return [
    { title: "Renewal offer", sub: renewalSub, when: "By 31 Aug", icon: "renew" },
    { title: "Current term ends", sub: "Unless renewed", when: LEASE.termEnd, icon: "doc" },
  ];
}
