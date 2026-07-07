/* Static demo data for the ALBA — Maison prototype. */

export const RES = {
  name: "The Verde Bungalow",
  short: "Verde Bungalow",
  city: "Bel-Air",
  kind: "Detached bungalow",
  rent: 18500,
  deposit: 37000,
  beds: 4,
  baths: 3,
  area: 420,
  amenities: [
    ["Saltwater pool", "West terrace"],
    ["Olive garden", "Mature"],
    ["Wine cellar", "Climate-set"],
    ["EV charging", "2 bays"],
    ["Outdoor kitchen", "Covered"],
    ["Smart access", "Keyless"],
  ],
  about:
    "A single-storey modernist bungalow set behind mature olives at the crest of Stone Canyon. Full-height glazing opens the living wing to a west-facing terrace and saltwater pool; interiors in travertine, oiled walnut and lime-washed plaster.",
};

export const ADRIEN = {
  first: "Adrien",
  name: "Adrien Léon",
  moveIn: "Aug 2023", // resident since — the estate spans several renewals
  leaseEnd: "Sep 2026",
  monthsLeft: 3,
  elapsed: 35, // total months in residence since move-in (Aug 2023 → now)
};

// The current 12-month lease term. Nine months in, three to run — with a
// renewal offer already on the table.
export const LEASE = {
  termStart: "Oct 2025",
  termEnd: "Sep 2026",
  now: "Jul 2026",
  endYear: 2026,
  months: 12,
  elapsed: 9,
  remaining: 3,
  progress: 75,
};

export const ROSA = { name: "Rosa Ibáñez", role: "Estate manager" };

export const DOCS = [
  {
    id: "agreement",
    t: "Residence agreement",
    tag: "Legal · Signed 12 August 2023",
    file: "/documents/residence-agreement.pdf",
    summary: "Fixed term Aug 2023 – Mar 2027 · $18,500/month · $37,000 deposit in escrow · Renewal window opens December 2026.",
    sections: [
      { h: "Term", kv: [["Start", "12 August 2023"], ["End", "31 March 2027"], ["Renewal window", "Opens December 2026"]] },
      { h: "Rent", kv: [["Amount", "$18,500 / month"], ["Due", "1st of each month"], ["Method", "Autopay · City National ···· 4291"], ["Late fee", "$500 after a 5-day grace period"]] },
      { h: "Security deposit", kv: [["Amount", "$37,000"], ["Held by", "City National Trust, in escrow"], ["Return window", "Within 21 days of move-out, less deductions"]] },
      { h: "Maintenance", p: "The estate is responsible for structural repairs, building systems, and the pool and grounds. You're responsible for day-to-day care of the interior and for reporting issues promptly through Concierge." },
      { h: "Entry notice", p: "The estate will give at least 24 hours' written notice before entering, except in a genuine emergency." },
      { h: "Occupancy & guests", p: "Only the named residents may occupy the home. Guests staying beyond 14 consecutive nights require written notice to the estate." },
    ],
  },
  {
    id: "houseguide",
    t: "House guide",
    tag: "Reference · Updated 3 June 2026",
    file: "/documents/house-guide.pdf",
    summary: "Access, systems and care — Wi-Fi, pool, HVAC, cellar, service days and emergency contacts.",
    sections: [
      { h: "Access", kv: [["Wi-Fi network", "Verde-5G"], ["Wi-Fi password", "Ask Rosa to reveal"], ["Gate code", "Rotates monthly — current code in Concierge"], ["Smart locks", "Front door and pool gate, app-controlled"]] },
      { h: "Pool & spa", p: "The saltwater system cycles automatically 10am–4pm and again 8–10pm. Spa heat can be requested a day ahead through Concierge." },
      { h: "Climate", p: "Three zones — living wing, primary suite, guest wing — each with its own thermostat. Filters are changed by the estate every quarter." },
      { h: "Wine cellar", p: "Held at 14°C and 65% humidity year-round. Let Rosa know before any delivery so the cellar can be opened." },
      { h: "Service days", kv: [["Trash", "Tuesdays"], ["Recycling", "Alternate Tuesdays"], ["Gardener", "Thursdays, AM"], ["Pool service", "Mondays"]] },
      { h: "Emergency contacts", kv: [["Estate manager (Rosa)", "Via Concierge · replies within the hour"], ["After-hours line", "Answered 24/7 for urgent issues"], ["Gas / utility emergency", "Call the utility directly, then notify Rosa"]] },
    ],
  },
  {
    id: "insurance",
    t: "Insurance certificate",
    tag: "Legal · Valid through February 2027",
    file: "/documents/insurance-certificate.pdf",
    summary: "Owner policy via Chubb · Liability $5M · Covers the building, not your belongings.",
    sections: [
      { h: "Policy", kv: [["Insurer", "Chubb"], ["Policy holder", "The estate owner"], ["Liability", "$5,000,000"], ["Valid through", "February 2027"]] },
      { h: "What's covered", p: "This policy covers the building itself, its fixtures, and estate-owned appliances, plus the owner's liability for the property." },
      { h: "What's not covered", callout: true, p: "Your personal belongings and personal liability aren't covered by this policy — that needs a renters' policy of your own.",
        act: { label: "Ask Rosa about renters' insurance", preset: "question", note: "Could you point me to a renters' insurance provider you'd recommend?" } },
    ],
  },
  {
    id: "inventory",
    t: "Move-in inventory",
    tag: "Record · 12 August 2023",
    file: "/documents/move-in-inventory.pdf",
    summary: "Signed condition report · 84 photographs · Joint walkthrough · No open items.",
    sections: [
      { h: "Walkthrough", kv: [["Date", "12 August 2023"], ["Attended by", "Adrien Léon and Rosa Ibáñez"], ["Outcome", "No open items"]] },
    ],
    rooms: [
      { name: "Living wing", photos: 14 },
      { name: "Kitchen", photos: 18 },
      { name: "Primary bath", photos: 9 },
      { name: "Bedrooms", photos: 16 },
      { name: "Grounds & pool", photos: 20 },
      { name: "Utility & garage", photos: 7 },
    ],
  },
];

export const PAYMENTS = (() => {
  const M = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const Ms = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const spans = [
    [2026, 0, 6],
    [2025, 0, 11],
    [2024, 0, 11],
    [2023, 7, 11],
  ];
  const out = [];
  spans.forEach(([y, a, b]) => {
    for (let mi = b; mi >= a; mi--) {
      out.push({
        id: `p-${y}-${mi + 1}`,
        year: y,
        month: `${M[mi]} ${y}`,
        paid: `${Ms[mi]} 1, ${y}`,
        amount: RES.rent,
        method: "City National ···· 4291",
        via: "Autopay",
        status: "Paid",
        conf: `ALB·${y}·${String(mi + 1).padStart(2, "0")}`,
      });
    }
  });
  return out;
})();

// Avatar generation configs (used by the <Avatar/> component).
export const AV = {
  adrien: {
    skin: "#E3B586",
    hair: "#2A2018",
    stubble: true,
    top: "#5A5147",
    bg: ["#DCD3C4", "#C8BEAC"],
  },
  rosa: {
    skin: "#DCB085",
    hair: "#3D2A1C",
    long: true,
    top: "#4A443C",
    bg: ["#DED5C6", "#CABFAD"],
  },
};
