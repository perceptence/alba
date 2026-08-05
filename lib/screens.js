/* ALBA — the deterministic screen registry.

   One source of truth for "how do I reach a given screen". The app reads it to
   resolve ?screen= (and the `screen` prop, used by the inline embed on the
   case-study page); the case study reads it to build its journey list. Because
   both sides read THIS module, the deep-link API and the documented list can
   never drift apart — there's a test that pins exactly that.

   `state` is the App state a screen corresponds to. Anything omitted falls back
   to the resident journey's defaults (tab "home", every overlay closed). */

export const SCREENS = {
  /* — the resident's day to day — */
  home: {
    journey: "resident", label: "Home",
    line: "The residence at a glance — what is settled, and what needs them.",
    state: { tab: "home" },
  },
  residence: {
    journey: "resident", label: "The residence",
    line: "The house itself: amenities, lease, documents, the people who keep it.",
    state: { resView: true },
  },
  payments: {
    journey: "resident", label: "Payments",
    line: "Rent and charges, with one clear way to settle them.",
    state: { tab: "rent" },
  },
  charges: {
    journey: "resident", label: "Charges",
    line: "What a charge is for, before being asked to pay it.",
    state: { chargesView: true },
  },
  concierge: {
    journey: "resident", label: "Concierge",
    line: "Ask for anything; watch it move through the estate's hands.",
    state: { tab: "concierge" },
  },
  notices: {
    journey: "resident", label: "Notices",
    line: "Word from the desk, grouped by what needs the resident first.",
    state: { noticesView: true },
  },
  schedule: {
    journey: "resident", label: "Schedule",
    line: "Who is coming to the house this week, and when.",
    state: { scheduleView: true },
  },
  guests: {
    journey: "resident", label: "Guest access",
    line: "A pass for the gate, issued and revoked by the resident.",
    state: { guestView: true },
  },
  renewal: {
    journey: "resident", label: "Lease renewal",
    line: "An offer on the table, with the terms and the clock made plain.",
    state: { renewalView: true },
  },
  account: {
    journey: "resident", label: "Account",
    line: "Who they are to the estate, and how to reach it.",
    state: { tab: "profile" },
  },

  /* — arriving: the first-run invitation — */
  invite: {
    journey: "onboarding", label: "The invitation",
    line: "A resident is invited by name, not signed up by a form.",
    state: {},
  },

  /* — the estate desk (the operator's side) — */
  "desk-requests": {
    journey: "manager", label: "Requests",
    line: "Rosa's queue, ordered by what needs her rather than what is newest.",
    state: { section: "requests" },
  },
  "desk-estates": {
    journey: "manager", label: "Estates",
    line: "Seven houses and the residents in them, under one lens.",
    state: { section: "estates" },
  },
  "desk-schedule": {
    journey: "manager", label: "Schedule",
    line: "The week's visits across every estate, tick-off by tick-off.",
    state: { section: "schedule" },
  },
  "desk-account": {
    journey: "manager", label: "Rent & notices",
    line: "Rent collected against rent owed, and notices to broadcast.",
    state: { section: "account" },
  },
};

export const SCREEN_KEYS = Object.keys(SCREENS);

export const JOURNEYS = {
  resident: "Adrien — living in the house day to day",
  onboarding: "A new resident, arriving by invitation",
  manager: "Rosa — running seven estates from one desk",
};

/* How the journeys are grouped for a reader: by who is holding the phone.
   Order matters — this is the order the case study lists them in. */
export const JOURNEY_GROUPS = [
  { journey: "resident", label: "Existing residents", who: "Adrien, at home" },
  { journey: "onboarding", label: "New residents", who: "Invited, not signed up" },
  { journey: "manager", label: "Estate managers", who: "Rosa, at the desk" },
];

/** Resolve a screen key to { journey, state }. Unknown keys → null. */
export function resolveScreen(key) {
  const s = SCREENS[key];
  return s ? { journey: s.journey, state: s.state } : null;
}
