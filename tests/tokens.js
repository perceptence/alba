/* Shared helper: read the product's design tokens straight out of app/alba.css.

   Tests parse the stylesheet rather than importing a copy of the values,
   because a copy is exactly the thing that goes stale. If someone edits a
   token, these tests see the edit. */

import fs from "node:fs";
import path from "node:path";

export const CSS_PATH = path.join(process.cwd(), "app", "alba.css");
export const css = fs.readFileSync(CSS_PATH, "utf8");

/** The :root{...} declaration block, as raw text. */
export const rootBlock = (() => {
  const m = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!m) throw new Error("no :root block found in app/alba.css");
  return m[1];
})();

/** Every custom property declared on :root, as { "--name": "value" }. */
export const TOKENS = (() => {
  const out = {};
  for (const line of rootBlock.split(/[;\n]/)) {
    const m = line.match(/(--[a-z0-9-]+)\s*:\s*([^;]+)/i);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
})();

export const token = (name) => {
  const v = TOKENS[name];
  if (v === undefined) throw new Error(`token ${name} is not declared on :root`);
  return v;
};

/* ——— contrast maths (WCAG 2.1 relative luminance) ——— */
const toRgb = (v) => {
  const s = String(v).trim();
  if (s.startsWith("#")) {
    const h = s.slice(1);
    const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
  }
  const m = s.match(/-?\d+\.?\d*/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
};
const lin = (c) => { const x = c / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);

export const ratio = (fg, bg) => {
  const a = lum(toRgb(fg)), b = lum(toRgb(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** px value of a token, as a number. */
export const px = (name) => {
  const v = token(name);
  const m = v.match(/(-?\d+\.?\d*)px/);
  if (!m) throw new Error(`token ${name} ("${v}") is not a px value`);
  return Number(m[1]);
};
