/* WHAT THIS GUARDS
   The spacing scale. SPACING.md is the project's law after a stretch where
   every gap had several owners (a row's padding + a section's margin + line
   height) and tuning never converged. These pin the scale itself: on the 4px
   grid, declared where the doc says, and ordered the way the doc claims. */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { TOKENS, px } from "./tokens.js";

const SCALE = ["--gap-tight", "--gap-group", "--gap-rail", "--gap-page", "--gap-section"];
const SPACING_MD = fs.readFileSync(path.join(process.cwd(), "SPACING.md"), "utf8");

describe("spacing system", () => {
  it("every spacing token is a multiple of 4", () => {
    const spacing = Object.keys(TOKENS).filter((n) => /^--(sp-\d|gap-|pad-)/.test(n));
    expect(spacing.length).toBeGreaterThan(0);
    for (const n of spacing) {
      expect(px(n) % 4, `${n} is ${px(n)}px — off the 4px grid`).toBe(0);
    }
  });

  it("the semantic scale only ever grows", () => {
    const vals = SCALE.map(px);
    for (let i = 1; i < vals.length; i++) {
      expect(vals[i], `${SCALE[i]} must be >= ${SCALE[i - 1]}`).toBeGreaterThanOrEqual(vals[i - 1]);
    }
  });

  it("line items carry the only vertical padding, at 16", () => {
    expect(px("--pad-row")).toBe(16);
    expect(px("--pad-sub")).toBe(8);
  });

  it("every token SPACING.md documents actually exists", () => {
    const named = [...SPACING_MD.matchAll(/`(--[a-z0-9-]+)`/g)].map((m) => m[1]);
    expect(named.length).toBeGreaterThan(4);
    for (const n of new Set(named)) {
      expect(TOKENS[n], `SPACING.md documents ${n}, which is not declared on :root`).toBeTruthy();
    }
  });
});
