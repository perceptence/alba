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
  moveIn: "August 2023",
  leaseEnd: "March 2027",
  monthsLeft: 8,
  termMonths: 43,
  elapsed: 35,
};

export const ROSA = { name: "Rosa Ibáñez", role: "Estate manager" };

export const DOCS = [
  {
    t: "Residence agreement",
    d: "Fixed term August 2023 – March 2027 · Monthly rent $18,500 · Deposit $37,000 held in escrow · Renewal window opens December 2026.",
  },
  {
    t: "House guide",
    d: "Systems, finishes and care: saltwater pool cycle, HVAC zones, wine-cellar climate, smart-access codes and the garden schedule.",
  },
  {
    t: "Insurance certificate",
    d: "Owner policy via Chubb · Liability $5M · Valid through February 2027. Contents cover remains the resident's responsibility.",
  },
  {
    t: "Move-in inventory",
    d: "Signed condition report · 84 photographs · Joint walkthrough August 12, 2023. No open items.",
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
        paid: `1 ${Ms[mi]} ${y}`,
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
