/* WHAT THIS GUARDS
   Every colour the product sets text in, against every surface that text sits
   on. This pins a real bug: --grey-2 (all eyebrows, timestamps and counts)
   shipped at 2.71:1 — below the 4.5:1 that WCAG 2.1 AA requires for body text
   — because "quiet" was being judged by eye instead of measured. */

import { describe, it, expect } from "vitest";
import { token, ratio, TOKENS } from "./tokens.js";
import { CONTRAST } from "@/lib/stats";

const AA_NORMAL = 4.5;

describe("colour contrast (WCAG 2.1 AA)", () => {
  it("no text colour drops below AA on the surface it is used on", () => {
    for (const { fg, bg, role } of CONTRAST) {
      const r = ratio(token(fg), token(bg));
      expect(r, `${role} — ${fg} on ${bg} is ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });

  it("the muted grey specifically clears AA (it did not, once)", () => {
    const r = ratio(token("--grey-2"), token("--paper"));
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("filled buttons are legible in reverse", () => {
    expect(ratio(token("--paper"), token("--ink"))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("every surface token is a colour the contrast helper can read", () => {
    for (const s of ["--paper", "--paper-2", "--paper-3", "--ink"]) {
      expect(TOKENS[s], `${s} declared`).toBeTruthy();
      expect(Number.isFinite(ratio(TOKENS[s], "#ffffff"))).toBe(true);
    }
  });
});
