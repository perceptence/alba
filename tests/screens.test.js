/* WHAT THIS GUARDS
   The deep-link registry. The case-study page lists the journeys by mapping
   over this same module, and the app resolves ?screen= through it — so the
   documented list and the navigable list are the same object by construction.
   These tests pin that they stay that way, and that every key really resolves. */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SCREENS, SCREEN_KEYS, JOURNEYS, resolveScreen } from "@/lib/screens";

const JOURNEY_NAMES = Object.keys(JOURNEYS);
const CASE_STUDY = fs.readFileSync(
  path.join(process.cwd(), "app", "case-study", "CaseStudy.jsx"), "utf8");

describe("screen registry", () => {
  it("every screen resolves to a real journey and a state object", () => {
    for (const k of SCREEN_KEYS) {
      const r = resolveScreen(k);
      expect(r, `${k} does not resolve`).toBeTruthy();
      expect(JOURNEY_NAMES, `${k} points at an unknown journey`).toContain(r.journey);
      expect(typeof r.state).toBe("object");
    }
  });

  it("unknown keys resolve to null rather than a default screen", () => {
    expect(resolveScreen("not-a-screen")).toBeNull();
    expect(resolveScreen("")).toBeNull();
  });

  it("every screen is presentable — it has a label and one line of description", () => {
    for (const k of SCREEN_KEYS) {
      expect(SCREENS[k].label, `${k} has no label`).toBeTruthy();
      expect(SCREENS[k].line, `${k} has no description`).toBeTruthy();
      // one line means one sentence, not a paragraph
      expect(SCREENS[k].line.length, `${k}'s line is too long`).toBeLessThan(110);
    }
  });

  it("all three journeys are actually reachable", () => {
    const covered = new Set(SCREEN_KEYS.map((k) => SCREENS[k].journey));
    for (const j of JOURNEY_NAMES) {
      expect(covered, `no screen reaches the ${j} journey`).toContain(j);
    }
  });

  it("the case study renders the registry rather than its own copy of the list", () => {
    // If someone hand-writes a journey list on the page, these drift apart.
    expect(CASE_STUDY).toContain("SCREEN_KEYS.map");
    expect(CASE_STUDY).toContain("SCREENS[k].line");
  });
});
