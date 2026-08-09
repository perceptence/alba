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

/* ——— contrast maths (WCAG 2.1 relative luminance) ———

   Alpha matters here. Half the product's tinted surfaces are washes —
   rgba(158,82,54,.1) and the like — and a wash read as its opaque source is a
   completely different colour. So parse the alpha and composite over the
   surface underneath before measuring anything. */
export const toRgba = (v) => {
  const s = String(v).trim();
  if (s.startsWith("#")) {
    /* #RGB, #RGBA, #RRGGBB and #RRGGBBAA all reach here — the 8-digit form is
       what getComputedStyle returns for rgba(), so the alpha must survive */
    const h = s.slice(1);
    const f = h.length <= 4 ? h.split("").map((c) => c + c).join("") : h;
    const a = f.length === 8 ? parseInt(f.slice(6, 8), 16) / 255 : 1;
    return [...[0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)), a];
  }
  /* the alternation matters: CSS writes alpha as `.1`, and a pattern that
     demands a digit before the dot silently reads that as 1 — fully opaque */
  const m = s.match(/-?(?:\d+\.?\d*|\.\d+)/g);
  if (!m) return [0, 0, 0, 1];
  const [r, g, b, a] = m.map(Number);
  return [r, g, b, a === undefined ? 1 : a];
};

/** Composite a possibly-translucent colour over an opaque base. */
export const flatten = (v, base) => {
  const [r, g, b, a] = toRgba(v);
  if (a >= 1) return [r, g, b];
  const [br, bg, bb] = toRgba(base);
  return [r, g, b].map((c, i) => c * a + [br, bg, bb][i] * (1 - a));
};

const lin = (c) => { const x = c / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);

/** Contrast of fg on bg. `base` is what bg sits on when bg is translucent. */
export const ratio = (fg, bg, base = "#FFFFFF") => {
  const surface = flatten(bg, base);
  const a = lum(flatten(fg, surface)), b = lum(surface);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** px value of a token, as a number. */
export const px = (name) => {
  const v = token(name);
  const m = v.match(/(-?\d+\.?\d*)px/);
  if (!m) throw new Error(`token ${name} ("${v}") is not a px value`);
  return Number(m[1]);
};
