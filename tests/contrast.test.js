/* WHAT THIS GUARDS
   Every colour the product sets text in, against every surface that text sits
   on. This pins a real bug: --grey-2 (all eyebrows, timestamps and counts)
   shipped at 2.71:1 — below the 4.5:1 that WCAG 2.1 AA requires for body text
   — because "quiet" was being judged by eye instead of measured. */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { token, ratio, flatten, toRgba, TOKENS, css } from "./tokens.js";
import { CONTRAST } from "@/lib/stats";

const AA_NORMAL = 4.5;
const csCss = fs.readFileSync(
  path.join(process.cwd(), "app", "case-study", "case-study.css"), "utf8");

describe("colour contrast (WCAG 2.1 AA)", () => {
  it("no text colour drops below AA on the surface it is used on", () => {
    for (const { fg, bg, over, role } of CONTRAST) {
      const r = ratio(token(fg), token(bg), over ? token(over) : "#FFFFFF");
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

  /* A wash is not its source colour. Read rgba(158,82,54,.1) as opaque clay
     and you measure clay against clay — the mistake that let three status
     pills ship under AA while the table above said everything passed. */
  it("translucent surfaces are composited, not read as their opaque source", () => {
    const wash = token("--clay-soft");
    expect(toRgba(wash)[3], "--clay-soft must carry an alpha").toBeLessThan(1);
    const flat = flatten(wash, token("--paper"));
    const raw = toRgba(wash).slice(0, 3);
    // compositing a 10% wash over pale paper lands far from the source colour
    expect(flat.every((c, i) => Math.abs(c - raw[i]) > 50)).toBe(true);
    // and the pill's real ratio is the composited one, not the opaque fiction
    expect(ratio(token("--clay-deep"), wash, token("--paper"))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  /* The stylesheet writes rgba(); getComputedStyle hands the page #RRGGBBAA.
     The helper must read both to the same colour, or the suite passes while
     the rendered page prints 1.16:1 — which is exactly what happened. */
  it("reads rgba() and 8-digit hex as the same colour", () => {
    const asRgba = toRgba("rgba(158,82,54,.1)");
    const asHex = toRgba("#9e52361a"); // .1 alpha → 0x1a
    expect(asRgba[3]).toBeCloseTo(0.1, 2);
    expect(asHex[3]).toBeCloseTo(0.1, 2);
    const paper = token("--paper");
    expect(ratio(token("--clay-deep"), "rgba(158,82,54,.1)", paper))
      .toBeCloseTo(ratio(token("--clay-deep"), "#9e52361a", paper), 1);
    // and the short forms still work
    expect(toRgba("#abc")).toEqual([170, 187, 204, 1]);
    expect(toRgba("#abcd")[3]).toBeCloseTo(0.867, 2);
  });

  it("the deepened variants exist because the plain ones fail on their own wash", () => {
    const paper = token("--paper");
    for (const [plain, deep, surface] of [
      ["--clay", "--clay-deep", "--clay-soft"],
      ["--sage", "--sage-deep", "--sage-soft"],
      ["--grey-2", "--grey-deep", "--paper-3"],
    ]) {
      const before = ratio(token(plain), token(surface), paper);
      const after = ratio(token(deep), token(surface), paper);
      expect(before, `${plain} on ${surface} should be the failing case`).toBeLessThan(AA_NORMAL);
      expect(after, `${deep} on ${surface} is ${after.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });

  /* The rule that would have caught this class of bug on day one. */
  it("no pill sets text in the plain hue of the wash it sits on", () => {
    const pills = css.match(/^\.gpill-[a-z]\{[^}]*\}/gm) || [];
    expect(pills.length, "the status pills were not found").toBe(3);
    for (const rule of pills) {
      expect(rule, `${rule} uses a plain hue on a tinted surface`)
        .not.toMatch(/color:var\(--(clay|sage|grey-2)\)/);
    }
  });

  /* The table above is hand-maintained, so it can only audit pairs someone
     remembered to add. This sweeps the stylesheet instead: every rule that
     sets BOTH a text colour and a background gets measured, whether or not
     anyone listed it. It is how .est-av-n (grey on paper-3, 4.40) surfaced. */
  it("every rule that sets text on its own background clears AA", () => {
    const rules = css.match(/[^{}]+\{[^}]*\}/g) || [];
    const paper = token("--paper");
    const failures = [];
    let checked = 0;
    for (const rule of rules) {
      const [sel, body] = [rule.split("{")[0].trim(), rule.split("{")[1]];
      const fg = body.match(/(?:^|[;\s])color:\s*var\((--[a-z0-9-]+)\)/);
      const bg = body.match(/background(?:-color)?:\s*var\((--[a-z0-9-]+)\)/);
      if (!fg || !bg || !TOKENS[fg[1]] || !TOKENS[bg[1]]) continue;
      checked++;
      const r = ratio(TOKENS[fg[1]], TOKENS[bg[1]], paper);
      if (r < AA_NORMAL) failures.push(`${sel} — ${fg[1]} on ${bg[1]} is ${r.toFixed(2)}:1`);
    }
    expect(checked, "the sweep matched no rules — the pattern has drifted").toBeGreaterThan(5);
    expect(failures, `sub-AA text:\n  ${failures.join("\n  ")}`).toEqual([]);
  });

  /* The page is paper throughout except its hero, which inverts onto --clay.
     Clay is dark enough that every grey and every ink in the system fails on
     it — the light end of the scale has to carry the words instead. These pin
     that inversion, including for the header, which crosses both grounds. */
  describe("the case study's clay hero", () => {
    it("the page itself stays paper, rails and all", () => {
      expect(csCss).toMatch(/body:has\(\.cs\)\s*\{\s*background:\s*var\(--paper\)/);
      expect(csCss).toMatch(/\.cs\s*\{[^}]*background:\s*var\(--paper\)/);
      expect(csCss, "a hand-typed colour would drift from app/alba.css's own value")
        .not.toMatch(/background:\s*#[0-9a-f]{3,8}/i);
    });

    it("carries its words in paper, because nothing darker survives on clay", () => {
      const clay = token("--clay");
      expect(ratio(token("--paper"), clay), "hero words").toBeGreaterThanOrEqual(AA_NORMAL);
      expect(ratio(token("--paper-2"), clay), "hero labels").toBeGreaterThanOrEqual(AA_NORMAL);
      // the whole dark end of the system is unusable here — this is why the
      // hero cannot simply inherit the page's colours
      for (const g of ["--grey", "--grey-2", "--grey-deep", "--ink", "--ink-2"]) {
        expect(ratio(token(g), clay), `${g} must not be used on the clay hero`).toBeLessThan(AA_NORMAL);
      }
      expect(csCss).toMatch(/\.cs \.hero\s*\{[^}]*background:\s*var\(--clay\)/);
    });

    it("turns the drawing's hard-coded ink stroke over to paper", () => {
      // Elevation ships stroke="#2A241E", which is invisible on clay; a CSS
      // stroke beats the SVG presentation attribute without touching the component
      expect(csCss).toMatch(/\.cs \.hero-art svg[^{]*\{\s*stroke:\s*var\(--paper\)/);
    });

    it("the fixed header is legible on both grounds it crosses", () => {
      // at rest it floats over the clay hero
      expect(csCss).toMatch(/\.cs \.top \.top-nav-a\s*\{\s*color:\s*var\(--paper-2\)/);
      expect(ratio(token("--paper-2"), token("--clay"))).toBeGreaterThanOrEqual(AA_NORMAL);
      // stuck, it is the paper page lightly veiled
      expect(csCss).toMatch(/\.cs \.top\.stuck \.top-nav-a\s*\{\s*color:\s*var\(--grey\)/);
      const m = csCss.match(/\.cs \.top\.stuck\s*\{[^}]*background:\s*(rgba\([^)]+\))/);
      expect(m, "the stuck-nav background rule was not found").toBeTruthy();
      const stuck = ratio(token("--grey"), m[1], token("--paper"));
      expect(stuck, `grey on the stuck nav is ${stuck.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });
});
