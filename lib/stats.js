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
  tokens: 33,
  /* entries in ESTATES / RESIDENTS in lib/managerData.js */
  estates: 7,
  residents: 8,
  /* *.test.js(x) under tests/ */
  testFiles: 5,
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
];
