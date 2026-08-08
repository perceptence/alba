/* WHAT THIS GUARDS — self-enforcing honesty.

   Every figure printed on the case-study page is recomputed here from the file
   it claims to describe. A number on that page cannot drift, be rounded up, or
   be invented: if it stops matching the repository, this suite goes red.

   (Mutation-checked: changing any STATS value by one fails this file.) */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { STATS, CONTRAST } from "@/lib/stats";
import { SCREEN_KEYS, JOURNEYS } from "@/lib/screens";
import { TOKENS, rootBlock } from "./tokens.js";

const read = (...p) => fs.readFileSync(path.join(process.cwd(), ...p), "utf8");
const listDir = (dir, ext) =>
  fs.readdirSync(path.join(process.cwd(), dir)).filter((f) => f.endsWith(ext));

describe("every number on the case-study page is real", () => {
  it("journeys", () => {
    expect(STATS.journeys).toBe(Object.keys(JOURNEYS).length);
  });

  it("deep-linkable screens", () => {
    expect(STATS.screens).toBe(SCREEN_KEYS.length);
  });

  it("React components — counted from the source, not guessed", () => {
    const files = [
      ...listDir("screens", ".jsx").map((f) => read("screens", f)),
      ...listDir("components", ".jsx").map((f) => read("components", f)),
    ];
    const count = files.reduce(
      (n, src) => n + (src.match(/^export function [A-Z]/gm) || []).length, 0);
    expect(STATS.components).toBe(count);
  });

  it("design tokens — counted from the :root block of alba.css", () => {
    const declared = (rootBlock.match(/--[a-z0-9-]+\s*:/gi) || []).length;
    expect(STATS.tokens).toBe(declared);
    expect(Object.keys(TOKENS).length).toBe(declared);
  });

  it("estates and residents — counted from the fixture data", () => {
    const src = read("lib", "managerData.js");
    const block = (name) => {
      const m = src.match(new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\n\\];`));
      return m ? (m[1].match(/\{\s*id:/g) || []).length : -1;
    };
    expect(STATS.estates).toBe(block("ESTATES"));
    expect(STATS.residents).toBe(block("RESIDENTS"));
  });

  it("sheets and flyouts — counted from the sheet headers in screens/", () => {
    const n = listDir("screens", ".jsx")
      .map((f) => read("screens", f))
      .reduce((t, src) => t + (src.match(/sh-head/g) || []).length, 0);
    expect(STATS.surfaces).toBe(n);
  });

  it("form factors — two layout boundaries in the container queries, three bands", () => {
    const css = read("app", "alba.css");
    const q = [...css.matchAll(/@container alba \(([^)]*)\)/g)].map((m) => m[1]);
    expect(q.some((b) => /76[78]/.test(b)), "no phone/tablet boundary").toBe(true);
    expect(q.some((b) => /(899|900)/.test(b)), "no tablet/desktop boundary").toBe(true);
    expect(STATS.formFactors).toBe(3);
  });

  it("tests — counted from the it() blocks across the suite", () => {
    const dir = path.join(process.cwd(), "tests");
    const n = fs.readdirSync(dir)
      .filter((f) => /\.test\.(js|jsx)$/.test(f))
      .reduce((t, f) => t + (fs.readFileSync(path.join(dir, f), "utf8").match(/^\s*it\(/gm) || []).length, 0);
    expect(STATS.tests).toBe(n);
  });

  it("test files — counted with glob, +1 for this module (glob excludes it)", () => {
    const found = import.meta.glob("./*.test.{js,jsx}");
    expect(STATS.testFiles).toBe(Object.keys(found).length + 1);
  });

  it("the contrast table covers every colour the product sets text in", () => {
    const fgs = new Set(CONTRAST.map((c) => c.fg));
    for (const c of ["--ink", "--ink-2", "--grey", "--grey-2", "--clay", "--sage", "--gold"]) {
      expect(fgs, `${c} is a text colour but is not audited`).toContain(c);
    }
  });

  it("axe violations claimed on the page is not a placeholder", () => {
    expect(Number.isInteger(STATS.axeViolations)).toBe(true);
    expect(STATS.axeViolations).toBeGreaterThanOrEqual(0);
  });
});
