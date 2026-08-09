"use client";

/* ALBA — the design system, as specimens.

   Shared by the case study's "system" section and the standalone /design-system
   page, so the two can never disagree. Nothing here is transcribed: useTokens()
   reads the live stylesheet at render, so a token changed in app/alba.css
   changes these specimens with it.

   Helper components are at module scope on purpose — declared inside a render
   they would be a new type each pass, remounting their subtrees. */

import { useEffect, useRef, useState } from "react";
import { Elevation } from "@/components/Elevation";
import { I } from "@/components/icons";
import { STATS, CONTRAST } from "@/lib/stats";

/* ——— colour maths, so contrast is computed and not claimed ———
   Mirrors tests/tokens.js: translucent surfaces are composited over what they
   sit on before measuring, because a wash is not its opaque source colour. */
const toRgba = (v) => {
  const s = String(v).trim();
  if (s.startsWith("#")) {
    /* getComputedStyle normalises rgba() to 8-digit hex, so the alpha arrives
       as #RRGGBBAA — drop it and every wash reads as fully opaque */
    const h = s.slice(1);
    const f = h.length <= 4 ? h.split("").map((c) => c + c).join("") : h;
    const a = f.length === 8 ? parseInt(f.slice(6, 8), 16) / 255 : 1;
    return [...[0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)), a];
  }
  /* `.1` must parse as 0.1 — a digit-first pattern reads it as 1 (opaque) */
  const m = s.match(/-?(?:\d+\.?\d*|\.\d+)/g);
  if (!m) return [0, 0, 0, 1];
  const [r, g, b, a] = m.map(Number);
  return [r, g, b, a === undefined ? 1 : a];
};
const flatten = (v, base) => {
  const [r, g, b, a] = toRgba(v);
  if (a >= 1) return [r, g, b];
  const [br, bg, bb] = toRgba(base);
  return [r, g, b].map((c, i) => c * a + [br, bg, bb][i] * (1 - a));
};
const lin = (c) => { const x = c / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
export const ratio = (fg, bg, base = "#FFFFFF") => {
  const surface = flatten(bg, base);
  const a = lum(flatten(fg, surface)), b = lum(surface);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const TYPE_SPECS = [
  ["Display", "var(--serif)", 300, "40px", "-.02em", "Good evening"],
  ["Title", "var(--serif)", 400, "22px", "-.01em", "The Verde Bungalow"],
  ["Body", "var(--sans)", 450, "15px", "0", "Rent, autopay and charges."],
  ["Eyebrow", "var(--sans)", 600, "12px", "var(--tk-label)", "AT A GLANCE"],
];
const SPACE_SPECS = [
  ["--gap-section", "section → section"],
  ["--gap-page", "title → first element"],
  ["--gap-rail", "tab rail → content"],
  ["--gap-group", "group rhythm"],
  ["--gap-tight", "label → its field"],
  ["--pad-row", "line-item padding"],
];
const ELEV_VARIANTS = ["verde", "stone", "palisade", "cypress", "canyon", "olive", "laurel"];

/** Read the product's tokens out of the running stylesheet. */
export function useTokens() {
  const [tok, setTok] = useState(null);
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim();
    setTok({
      colour: [
        ["Ink", g("--ink")], ["Ink 2", g("--ink-2")], ["Grey", g("--grey")], ["Grey 2", g("--grey-2")],
        ["Clay", g("--clay")], ["Sage", g("--sage")], ["Gold", g("--gold")], ["Paper", g("--paper")],
      ],
      space: SPACE_SPECS.map(([n, use]) => [n, g(n), use]),
      ease: g("--e"),
      serif: g("--serif"), sans: g("--sans"),
      /* `over` names the surface a translucent bg is composited onto */
      contrast: CONTRAST.map((c) => ({
        ...c,
        fgv: g(c.fg),
        bgv: g(c.bg),
        r: ratio(g(c.fg), g(c.bg), c.over ? g(c.over) : "#FFFFFF"),
      })),
    });
  }, []);
  return tok;
}

/* Click a swatch to copy its value — the specimen is the control. */
function Swatch({ name, value }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  };
  return (
    <button className="sw" onClick={copy} title={`Copy ${value}`}>
      <span className="sw-c" style={{ background: value }} />
      <span className="sw-n">{name}</span>
      <span className={"sw-v" + (done ? " sw-copied" : "")}>{done ? "Copied" : value}</span>
    </button>
  );
}

/* The seven estates, drawn by the product's own component. */
function ElevationPicker() {
  const [v, setV] = useState("verde");
  return (
    <div>
      <div className="elev-pick">
        {ELEV_VARIANTS.map((n) => (
          <button key={n} className={n === v ? "on" : ""} onClick={() => setV(n)} aria-pressed={n === v}>
            {n}
          </button>
        ))}
      </div>
      <div className="elev-hold">
        {/* key remounts so the draw-in animation replays for each house */}
        <Elevation key={v} h={120} variant={v} />
      </div>
    </div>
  );
}

/* The one easing curve — raced against linear, because a dot moving on its own
   tells you nothing. Side by side you can see the curve leave quickly and
   settle, while linear arrives at a constant, mechanical pace. */
function MotionSpec({ ease }) {
  const linRef = useRef(null);   // NB: `lin` at module scope is the luminance helper
  const albaRef = useRef(null);
  const [played, setPlayed] = useState(false);

  /* Driven from JS rather than a CSS keyframe: the travel is measured from the
     track at the moment you press play, so it is right at any column width —
     a percentage in a keyframe was resolving against the 18px dot, not the
     track, and moved a fixed distance regardless. */
  const play = () => {
    const curve = ease || "cubic-bezier(.4,0,.2,1)";
    for (const [ref, easing] of [[linRef, "linear"], [albaRef, curve]]) {
      const el = ref.current;
      if (!el || !el.parentElement) continue;
      const travel = el.parentElement.clientWidth - el.offsetWidth;
      if (travel <= 0) continue;
      el.getAnimations().forEach((a) => a.cancel());
      el.animate(
        [{ transform: "translateX(0px)" }, { transform: `translateX(${travel}px)` }],
        { duration: 1100, easing, fill: "forwards" }
      );
    }
    setPlayed(true);
  };

  return (
    <div>
      <svg className="ease" viewBox="0 0 120 44" width="100%" height="44" aria-hidden="true">
        <path d="M2 42 C 50 42, 62 2, 118 2" fill="none" stroke="var(--clay)" strokeWidth="1.5" />
      </svg>
      <div className="bar-n" style={{ marginTop: 8 }}>{ease}</div>

      <div className="mo-row">
        <span className="mo-lbl">Linear</span>
        <span className="mo-track"><span ref={linRef} className="mo-dot lin" /></span>
      </div>
      <div className="mo-row">
        <span className="mo-lbl">ALBA</span>
        <span className="mo-track"><span ref={albaRef} className="mo-dot alba" /></span>
      </div>

      <button className="spec-act" onClick={play}>{played ? "Play again" : "Play both"}</button>
    </div>
  );
}

/** The nine specimen cards. Pass the value from useTokens(). */
export function SystemSpecimens({ tok }) {
  return (
    <div className="spec">
      <div className="card">
        <div className="card-h">Colour · {STATS.tokens} tokens total</div>
        <div className="card-b">
          {tok?.colour.map(([n, v]) => <Swatch key={n} name={n} value={v} />)}
        </div>
      </div>

      <div className="card">
        <div className="card-h">Type · Fraunces &amp; Inter, self-hosted</div>
        <div className="card-b">
          {TYPE_SPECS.map(([n, fam, w, size, ls, sample]) => (
            <div className="type-row" key={n}>
              <div className="type-n">{n} · {w} · {size}</div>
              <div className="type-s" style={{ fontFamily: fam, fontWeight: w, fontSize: size, letterSpacing: ls }}>{sample}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-h">Spacing · one owner per gap</div>
        <div className="card-b">
          {tok?.space.map(([n, v, use]) => (
            <div className="bar-row" key={n}>
              <span className="bar" style={{ width: v }} />
              <span className="bar-n">{v}</span>
              <span className="bar-n" style={{ color: "var(--grey-2)" }}>{use}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-h">Radius, line &amp; elevation</div>
        <div className="card-b">
          <div className="rad-row"><span className="rad" style={{ borderRadius: 0 }} /><span className="bar-n">0 · rows, rules</span></div>
          <div className="rad-row"><span className="rad" style={{ borderRadius: 6 }} /><span className="bar-n">6px · swatches</span></div>
          <div className="rad-row"><span className="rad" style={{ borderRadius: 999 }} /><span className="bar-n">999px · pills, buttons</span></div>
          <div className="rad-row" style={{ marginTop: 10 }}>
            <span className="rad" style={{ border: "none", boxShadow: "0 2px 4px rgba(0,0,0,.2), 0 40px 80px -24px rgba(38,30,22,.4)", background: "var(--paper)" }} />
            <span className="bar-n">the only shadow: the device</span>
          </div>
          <div className="rad-row"><span className="rad" style={{ border: "none", borderTop: "1px solid var(--line)", height: 1 }} /><span className="bar-n">hairlines, never cards</span></div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">Motion · one curve, everywhere</div>
        <div className="card-b">{tok && <MotionSpec ease={tok.ease} />}</div>
      </div>

      <div className="card">
        <div className="card-h">Buttons · three tiers, never two filled</div>
        {/* .am, because the product scopes its button styles to the app root —
            these are the real buttons, not lookalikes */}
        <div className="card-b btn-demo am">
          <button className="cta" type="button">Settle the charge</button>
          <button className="cta ghost" type="button">Not now</button>
          <button className="a-act" type="button">View details<I.arrow /></button>
        </div>
        <div className="bar-n" style={{ marginTop: 12, color: "var(--grey-2)" }}>
          Filled commits · ghost undoes · text-link goes elsewhere.
        </div>
      </div>

      <div className="card">
        <div className="card-h">Rows · hairlines, not cards</div>
        <div className="card-b">
          <div className="row-demo"><span className="k">Saltwater pool</span><span className="v">West terrace</span></div>
          <div className="row-demo"><span className="k">Olive garden</span><span className="v">Mature</span></div>
          <div className="row-demo"><span className="k">Wine cellar</span><span className="v">Climate-set</span></div>
          <div className="bar-n" style={{ marginTop: 12, color: "var(--grey-2)" }}>
            16px padding, one rule above. No card, no shadow.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">The drawing · one per estate, {STATS.estates} in all</div>
        <div className="card-b"><ElevationPicker /></div>
        <div className="bar-n" style={{ marginTop: 12, color: "var(--grey-2)" }}>
          The same hand every time: ink line on paper, a thin sun, the ground carried
          through. Each draws itself in — the product&rsquo;s component, not a picture of it.
        </div>
      </div>

      <div className="card">
        <div className="card-h">Contrast · measured, not assumed</div>
        <div className="card-b">
          {tok?.contrast.map((c) => (
            <div className="sw" key={c.fg + c.bg}>
              <span className="sw-c" style={{ background: c.bgv, color: c.fgv, display: "grid", placeItems: "center", fontSize: 15, fontFamily: "var(--serif)" }}>Aa</span>
              <span className="sw-n">{c.role}</span>
              <span className="sw-v">{c.r.toFixed(2)}:1</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
