/* WHAT THIS GUARDS
   Class-name collisions between the case-study pages and the product.

   Both stylesheets are global and load together. A bare `.dot{position:absolute}`
   in app/alba.css beat the case study's `.cs .dot` on every property the case
   study did not itself declare — so ten colour swatches were flung to
   position:absolute in the document's top-right corner and stacked into a
   single grey square, visible on the page for days.

   Scoping with `.cs` raises specificity; it does NOT stop inheritance of
   properties you never set. The only safe rule is: don't reuse a name. */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const read = (...p) => fs.readFileSync(path.join(process.cwd(), ...p), "utf8");
const APP = read("app", "alba.css");
const CS = read("app", "case-study", "case-study.css");

/** class selectors the app styles with no other qualifier — the dangerous ones */
const appBareClasses = () => {
  const out = new Set();
  const re = /(?:^|[},])\s*((?:\.[a-zA-Z][\w-]*\s*,\s*)*\.[a-zA-Z][\w-]*)\s*\{/g;
  for (const m of APP.matchAll(re)) {
    for (const sel of m[1].split(",")) {
      const s = sel.trim();
      if (/^\.[a-zA-Z][\w-]*$/.test(s)) out.add(s.slice(1));
    }
  }
  return out;
};

/** classes the case study styles under its own root */
const caseStudyClasses = () =>
  new Set([...CS.matchAll(/\.cs\s+\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));

describe("stylesheet collisions", () => {
  it("no case-study class shares a name with a bare class in the product", () => {
    const app = appBareClasses();
    const mine = caseStudyClasses();
    expect(app.size, "parsed no app classes — the regex broke").toBeGreaterThan(50);
    expect(mine.size, "parsed no case-study classes").toBeGreaterThan(50);
    const clashes = [...mine].filter((c) => app.has(c)).sort();
    expect(clashes, `these names exist in both stylesheets: ${clashes.join(", ")}`).toEqual([]);
  });

  it("the swatch that caused it is renamed and no longer collides", () => {
    expect(CS).not.toMatch(/\.cs\s+\.dot\s*\{/);
    expect(CS).toMatch(/\.cs\s+\.a11y-dot\s*\{/);
  });
});
