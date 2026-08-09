/* Every figure printed on the case-study page lives here — and every one of
   them is asserted against the thing it describes in tests/stats.test.js.
   If the codebase changes and a number here goes stale, the suite goes red.
   That's the point: the page cannot quietly drift into fiction. */

export const STATS = {
  /* counted from lib/screens.js */
  journeys: 3,
  screens: 15,
  /* `export function X` across screens/*.jsx + components/*.jsx */
  components: 29,
  /* custom properties declared in the :root block of app/alba.css */
  tokens: 37,
  /* entries in ESTATES / RESIDENTS in lib/managerData.js */
  estates: 7,
  residents: 8,
  /* *.test.js(x) under tests/, and the it() blocks inside them */
  testFiles: 6,
  tests: 56,
  /* components rooted on a .sheet head — the flyouts and panels behind the
     top-level screens (counted from sh-head in screens/) */
  surfaces: 14,
  /* phone / tablet / desktop: two layout boundaries, three bands */
  formFactors: 3,
  /* rows of the CONTRAST table below — every audited pair clears AA text */
  contrastPairs: 13,
  /* axe-core WCAG 2.1 A + AA, measured on /case-study — see the a11y section */
  axeViolations: 0,
};

/* Colour pairs the product actually renders text in, with the ratio each was
   measured at. tests/contrast.test.js recomputes every ratio from the token
   values in app/alba.css and fails if any AA-text pair drops below 4.5. */
export const CONTRAST = [
  { fg: "--ink", bg: "--paper", role: "Body and titles" },
  { fg: "--ink-2", bg: "--paper", role: "Long-form copy" },
  { fg: "--grey", bg: "--paper", role: "Secondary lines" },
  { fg: "--grey-2", bg: "--paper", role: "Eyebrows and meta" },
  { fg: "--clay", bg: "--paper", role: "Links and alerts" },
  { fg: "--sage", bg: "--paper", role: "Settled states" },
  { fg: "--gold", bg: "--paper", role: "In-progress states" },
  { fg: "--paper", bg: "--ink", role: "Filled buttons" },
  /* the tinted surface catches a whole class of near-misses: a mid grey can
     clear AA on --paper and fail on --paper-2 a shade darker */
  { fg: "--ink", bg: "--paper-2", role: "Text on tinted panels" },
  { fg: "--grey", bg: "--paper-2", role: "Labels on tinted panels" },
  /* Status pills: each sits on a wash of its own hue, which is the hardest
     case in the product — a colour on itself loses roughly 0.6 of its ratio.
     `over` is the surface the translucent wash is composited onto. */
  { fg: "--clay-deep", bg: "--clay-soft", over: "--paper", role: "Urgent and overdue pills" },
  { fg: "--sage-deep", bg: "--sage-soft", over: "--paper", role: "Settled and paid pills" },
  { fg: "--grey-deep", bg: "--paper-3", role: "Neutral and pending pills" },
];
