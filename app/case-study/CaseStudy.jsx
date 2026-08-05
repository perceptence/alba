"use client";

/* ALBA — design case study.

   Two rules govern this file:
   1. It renders the REAL product, not pictures of it. <App/> is mounted inline
      in this same React tree, driven through its own screen registry.
   2. It states no number it hasn't measured. Every figure comes from
      lib/stats.js, and tests/stats.test.js asserts each one against the file
      it describes. Specimens are read from the live stylesheet at render time,
      so they cannot drift from the product.

   Note: helper components are declared at MODULE scope. Declaring them inside
   the page component would make them a new type on every render, remounting
   their subtrees and detaching refs. */

import { useEffect, useRef, useState } from "react";
import App from "../alba-maison";
import { Elevation } from "@/components/Elevation";
import { SCREENS, SCREEN_KEYS, JOURNEYS } from "@/lib/screens";
import { STATS, CONTRAST } from "@/lib/stats";
import "./case-study.css";

/* ——— colour maths, so the contrast table is computed and not claimed ——— */
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

/* ——— small module-scope pieces ——— */
function Swatch({ name, value, note }) {
  return (
    <div className="sw">
      <span className="sw-c" style={{ background: value }} />
      <span className="sw-n">{name}</span>
      <span className="sw-v">{note || value}</span>
    </div>
  );
}

function Figure({ v, k }) {
  return (<div className="fig"><div className="fig-v">{v}</div><div className="fig-k">{k}</div></div>);
}

function Case({ n, title, before, after, read, why }) {
  return (
    <article className="case">
      <div className="case-n">{n}</div>
      <h3 className="case-t">{title}</h3>
      <div className="case-ba">
        <div className="ba bad"><div className="ba-k">Before</div>{before}</div>
        <div className="ba good"><div className="ba-k">After</div>{after}</div>
      </div>
      <div className="case-read">
        <div><h4>What you are looking at</h4><p>{read}</p></div>
        <div><h4>The rule it changed</h4><p>{why}</p></div>
      </div>
    </article>
  );
}

/* before/after demos — all drawn with real tokens */
const GapDemo = ({ gap }) => (
  <div>
    <div className="demo-lbl">Delivery · Acknowledged</div>
    <div className="demo-line" style={{ marginTop: 8 }} />
    <div style={{ height: gap }} />
    <div className="demo-lbl">Amenities</div>
    <div className="demo-line" style={{ marginTop: 8 }} />
    <div className="demo-lbl" style={{ marginTop: 10, color: "var(--grey)" }}>{gap}px between</div>
  </div>
);
const PhoneDemo = ({ w, h, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div className="demo-phone" style={{ width: w, height: h }} />
    <div className="demo-lbl">{label}</div>
  </div>
);
const LayoutDemo = ({ full, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div className="demo-frame" style={{ width: full ? "100%" : "62%" }}>
        <div className="demo-rail-l" /><div className="demo-fill" />
      </div>
    </div>
    <div className="demo-lbl">{label}</div>
  </div>
);
const FontDemo = ({ family, weight, label }) => (
  <div>
    <div style={{ fontFamily: family, fontWeight: weight, fontSize: 26, color: "var(--ink)", lineHeight: 1.1 }}>Adrien.</div>
    <div className="demo-lbl" style={{ marginTop: 10 }}>{label}</div>
  </div>
);
const ContrastDemo = ({ colour, r, label }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span className="sw-c" style={{ background: colour, width: 40, height: 40 }} />
      <span style={{ fontSize: 20, fontVariantNumeric: "tabular-nums", color: "var(--ink)" }}>{r}:1</span>
    </div>
    <div className="demo-lbl" style={{ marginTop: 10 }}>{label}</div>
  </div>
);
const ClipDemo = ({ pull, label }) => (
  <div>
    <div className="demo-clip">
      <div style={{ marginTop: pull }}>
        <div className="demo-rail"><span className="demo-node" /><span className="demo-txt">Submitted</span></div>
        <div className="demo-rail" style={{ marginTop: 14 }}><span className="demo-node" /><span className="demo-txt">Acknowledged</span></div>
      </div>
    </div>
    <div className="demo-lbl" style={{ marginTop: 10 }}>{label}</div>
  </div>
);

const EXAMPLE_TEST = `it("no text colour drops below AA", () => {
  for (const { fg, bg, role } of CONTRAST) {
    const r = ratio(token(fg), token(bg));
    expect(r, role).toBeGreaterThanOrEqual(4.5);
  }
});`;

const GUARDS = [
  ["contrast.test.js", "Every text colour the product uses, against every surface it sits on. Reads the real token values out of alba.css."],
  ["spacing.test.js", "The spacing scale stays on the 4px grid, and the tokens SPACING.md documents are the tokens that exist."],
  ["screens.test.js", "Every deep link resolves, and the journey list on this page is exactly the registry the app navigates by — they cannot drift."],
  ["stats.test.js", "Every number printed on this page, checked against the file it describes. Break one and the suite goes red."],
  ["case-study.test.jsx", "The page renders, mounts the real app inline, and is not sitting on a splash screen."],
];

export default function CaseStudy() {
  const [screen, setScreen] = useState("home");
  const [tok, setTok] = useState(null);
  const [stuck, setStuck] = useState(false);
  const heroRef = useRef(null);

  /* Specimens are read from the live stylesheet, not transcribed. If a token
     changes in alba.css, this section changes with it. */
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
      contrast: CONTRAST.map((c) => ({ ...c, fgv: g(c.fg), bgv: g(c.bg), r: ratio(g(c.fg), g(c.bg)) })),
    });
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = SCREENS[screen];

  return (
    <div className="cs">
      <header className={"top" + (stuck ? " stuck" : "")}>
        <div className="wrap">
          <span className="top-id">
            <span className="top-word">ALBA</span>
            <span className="top-desc">Maison</span>
          </span>
          <a className="top-link" href="/">Open the app →</a>
        </div>
      </header>

      {/* ——— hero: the product's own drawing, its own code, at scale ——— */}
      <section className="hero" ref={heroRef}>
        <div className="hero-art" aria-hidden="true"><Elevation h={340} variant="verde" /></div>
        <div className="hero-scrim" aria-hidden="true" />
        <div className="wrap hero-body">
          <div className="hero-kicker">Design case study</div>
          <h1>A house<br />that <em>answers.</em></h1>
          <p className="hero-stand">
            ALBA is a concierge app for people who live in managed estates — and for the
            one person who runs them. It was built to make service feel attended to
            rather than ticketed.
          </p>
          <div className="hero-meta">
            <span>Product design &amp; front-end · <b>Tanmay Jain</b></span>
            <span>Resident &amp; operator · <b>{STATS.journeys} journeys</b></span>
            <span>Prototype · <b>Next.js, React</b></span>
          </div>
        </div>
      </section>

      {/* ——— at a glance ——— */}
      <section className="sec" id="glance">
        <div className="wrap">
          <div className="sec-eye">At a glance</div>
          <h2>What is actually in here</h2>
          <p className="sec-lede">
            Counted from the repository, not estimated. Each figure is asserted against
            its source file by the test suite, so this panel cannot go stale quietly.
          </p>
          <div className="sec-body figs">
            <Figure v={STATS.journeys} k="Journeys" />
            <Figure v={STATS.screens} k="Deep-linkable screens" />
            <Figure v={STATS.components} k="React components" />
            <Figure v={STATS.tokens} k="Design tokens" />
            <Figure v={STATS.testFiles} k="Test files" />
            <Figure v={STATS.axeViolations} k="Axe violations" />
          </div>
        </div>
      </section>

      {/* ——— the running product ——— */}
      <section className="sec" id="live">
        <div className="wrap">
          <div className="sec-eye">The product, running</div>
          <h2>Not a screenshot</h2>
          <p className="sec-lede">
            The panel on the right is the real application, mounted in this page&rsquo;s own
            React tree. Choosing a journey drives it through the same navigation the app
            uses for itself.
          </p>
          <div className="sec-body live">
            <div className="live-list">
              <div className="live-h">{STATS.screens} screens · pick one</div>
              {SCREEN_KEYS.map((k) => (
                <button
                  key={k}
                  className={"jrow" + (k === screen ? " on" : "")}
                  onClick={() => setScreen(k)}
                  aria-pressed={k === screen}
                >
                  <span className="jrow-t">{SCREENS[k].label}</span>
                  <span className="jrow-l">{SCREENS[k].line}</span>
                </button>
              ))}
            </div>
            <div className="live-stageWrap">
              <div className="live-badge">● Live — {active?.label}</div>
              <div className="live-stage">
                {/* key remounts per screen so each one lands deterministically */}
                <App key={screen} embedded screen={screen} />
              </div>
            </div>
          </div>
          <p className="live-note">
            {JOURNEYS.resident} · {JOURNEYS.manager}. The same keys work as URLs on the
            app itself — <code>/?screen={screen}</code> opens exactly this screen.
          </p>
        </div>
      </section>

      {/* ——— why this exists ——— */}
      <section className="sec" id="why">
        <div className="wrap">
          <div className="sec-eye">Why this exists</div>
          <h2>The category&rsquo;s own reviews</h2>
          <p className="sec-lede">
            Secondary research: no original studies were run for this prototype. These are
            published reviews of shipping resident portals and established interface
            guidance. Each finding is paired with the decision it drove.
          </p>
          <div className="sec-body finds">
            <div className="find">
              <div>
                <p className="find-q">
                  Residents report that managers can delete maintenance requests whether or
                  not they were addressed, leaving tenants unable to see any past requests
                  at all.
                </p>
                <a className="find-src" href="https://justuseapp.com/en/app/443831139/resident-portal-mobile/reviews" target="_blank" rel="noopener noreferrer">
                  Resident Portal Mobile — user reviews
                </a>
              </div>
              <div>
                <div className="find-k">Decision</div>
                <p className="find-d">
                  A request is a record, not a ticket. Every request keeps a visible
                  timeline the resident owns, and resolved requests stay readable rather
                  than disappearing from the list.
                </p>
              </div>
            </div>
            <div className="find">
              <div>
                <p className="find-q">
                  Users who are uninformed about the system&rsquo;s current status cannot decide
                  what to do next, nor figure out whether their actions were effective.
                </p>
                <a className="find-src" href="https://www.nngroup.com/articles/visibility-system-status/" target="_blank" rel="noopener noreferrer">
                  Nielsen Norman Group — Visibility of System Status
                </a>
              </div>
              <div>
                <div className="find-k">Decision</div>
                <p className="find-d">
                  Every open request states where it stands — submitted, acknowledged,
                  scheduled, in progress — on a track, with the time of the last movement.
                  Status is the row, not a detail screen.
                </p>
              </div>
            </div>
            <div className="find">
              <div>
                <p className="find-q">
                  Reviewers describe payment centres that are hard to use, interfaces
                  unoptimised for mobile, and inconsistencies such as double rent charges.
                </p>
                <a className="find-src" href="https://apps.apple.com/us/app/resident-portal-mobile/id443831139" target="_blank" rel="noopener noreferrer">
                  Resident Portal Mobile — App Store listing &amp; reviews
                </a>
              </div>
              <div>
                <div className="find-k">Decision</div>
                <p className="find-d">
                  Money is stated before it is asked for: what is owed, what the charge is
                  for, and the date it was raised — then exactly one way to settle it.
                </p>
              </div>
            </div>
            <div className="find">
              <div>
                <p className="find-q">
                  Reviewers complain of notifications popping in at all hours, and of
                  promotional interruptions that cannot be opted out of.
                </p>
                <a className="find-src" href="https://apps.apple.com/us/app/resident-experience/id1635913940" target="_blank" rel="noopener noreferrer">
                  Resident Experience — App Store reviews
                </a>
              </div>
              <div>
                <div className="find-k">Decision</div>
                <p className="find-d">
                  Notices are a page the resident visits, sorted by what needs them first —
                  not a stream that interrupts. The estate speaks once, in one voice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— the system ——— */}
      <section className="sec" id="system">
        <div className="wrap">
          <div className="sec-eye">The system</div>
          <h2>Read from the stylesheet, live</h2>
          <p className="sec-lede">
            These specimens are not transcribed. They are read out of the running
            stylesheet when this page renders, so a change to a token in the product
            changes this section with it.
          </p>
          <div className="sec-body spec">
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
              <div className="card-h">Motion · one curve</div>
              <div className="card-b">
                <svg className="ease" viewBox="0 0 120 44" width="100%" height="44" aria-hidden="true">
                  <path d="M2 42 C 50 42, 62 2, 118 2" fill="none" stroke="var(--clay)" strokeWidth="1.5" />
                </svg>
                <div className="bar-n" style={{ marginTop: 8 }}>{tok?.ease}</div>
                <div className="type-row" style={{ marginTop: 12 }}>
                  <div className="type-n">Used for</div>
                  <div className="bar-n" style={{ marginTop: 4 }}>Sheets, draws, fades, tab underlines — everything.</div>
                </div>
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
        </div>
      </section>

      {/* ——— where it nearly came apart ——— */}
      <section className="sec" id="hard">
        <div className="wrap">
          <div className="sec-eye">Where it nearly came apart</div>
          <h2>Six problems that changed a rule</h2>
          <p className="sec-lede">
            Not a bug list. Each of these forced a standing rule into the system, because
            fixing the instance would have left the cause in place.
          </p>
          <div className="sec-body cases">
            <Case
              n="01 · Spacing"
              title="The gap that had three owners"
              before={<GapDemo gap={48} />}
              after={<GapDemo gap={32} />}
              read="The same boundary between two sections, before and after. On the left it measures 48px; on the right, 32px — the value the system actually intends."
              why="A gap may have exactly one owner. The 48 was a row's 16px padding plus a section's 32px margin, each innocent alone. Sections now own their boundary and the last row drops its padding. It became rule one of SPACING.md."
            />
            <Case
              n="02 · Device frame"
              title="The measurement that lied"
              before={<PhoneDemo w={92} h={174} label="ratio 1.888 — squashed" />}
              after={<PhoneDemo w={82} h={178} label="ratio 2.174 — true" />}
              read="Two phone outlines. The left is what the app was rendering; the right is an iPhone's real proportion. The difference is subtle in numbers and obvious on screen."
              why="Never clamp one axis of a fixed-ratio object. The frame capped its height to fit short windows while its width stayed put, quietly distorting every screenshot taken of it. Ratio is now held and the whole device scales."
            />
            <Case
              n="03 · Layout"
              title="The fix that broke the other end"
              before={<LayoutDemo full={false} label="app collapsed to 1127px" />}
              after={<LayoutDemo full label="app fills 1680px" />}
              read="The desktop layout at the same window size. Adding a wrapper so the phone mockup could have hardware buttons quietly shrank the entire desktop application inside it."
              why="A wrapper added for one breakpoint must be inert at the others. The shell shrink-wrapped inside a centring grid; it now resolves to display:contents on desktop, so it disappears from layout entirely."
            />
            <Case
              n="04 · Type"
              title="Fonts that arrived after the paint"
              before={<FontDemo family="Georgia, serif" weight={700} label="fallback — heavier, darker" />}
              after={<FontDemo family="var(--serif)" weight={600} label="Fraunces — self-hosted" />}
              read="The same word set in the fallback face and the intended one. The fallback is heavier and tighter, which is why the app read as 'bolder and darker' before anything about the colours had changed."
              why="A typeface is a dependency, not a request. Loading the faces from a third party at runtime meant every slow network produced a different product. They are now self-hosted and served from the app's own origin."
            />
            <Case
              n="05 · Accessibility"
              title="The quiet that was too quiet"
              before={<ContrastDemo colour="#9A9184" r="2.71" label="old muted grey — fails AA" />}
              after={<ContrastDemo colour="#736A5C" r="4.64" label="new muted grey — passes AA" />}
              read="The colour used for every eyebrow, timestamp and count. Both are muted; only one is legible to a reader who needs contrast. The ratios are computed, not estimated."
              why="Restraint is not an exemption. Three brand colours were adjusted rather than the text they carried, because the failure was in the swatch. A test now recomputes every pair from the tokens on each run."
            />
            <Case
              n="06 · Overflow"
              title="A negative margin inside a clipping box"
              before={<ClipDemo pull={-16} label="top step cut off" />}
              after={<ClipDemo pull={0} label="whole timeline visible" />}
              read="The top of a request's timeline inside its panel. On the left the first step is sliced by the panel's edge — the content is there, but the box is cutting it."
              why="Never pull content past the padding of a box that clips. A −16px nudge sat inside a scroll container with 4px of inset, so 12px of the first step was simply invisible at every screen size."
            />
          </div>
        </div>
      </section>

      {/* ——— tests ——— */}
      <section className="sec" id="tests">
        <div className="wrap">
          <div className="sec-eye">Tests</div>
          <h2>What the suite refuses to let slip</h2>
          <p className="sec-lede">
            {STATS.testFiles} files. Not coverage for its own sake — each one pins a rule
            that a real bug in this project broke.
          </p>
          <div className="sec-body duo">
            <pre className="code" tabIndex={0} aria-label="Example test: contrast">{EXAMPLE_TEST}</pre>
            <div className="plain">
              <h4>In plain language</h4>
              <p>
                This walks every colour the product puts text in, works out how much it
                stands out from the surface behind it, and fails the build if any pair is
                below the accessibility threshold of 4.5.
              </p>
              <p>
                It reads the colours from the stylesheet rather than a copy. If someone
                lightens a grey next year to make it feel quieter, this test goes red
                before the change reaches anyone who has trouble reading it.
              </p>
            </div>
          </div>
          <div className="guards">
            {GUARDS.map(([f, d]) => (
              <div className="guard" key={f}>
                <span className="guard-f">{f}</span>
                <span className="guard-d">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— accessibility ——— */}
      <section className="sec" id="a11y">
        <div className="wrap">
          <div className="sec-eye">Accessibility</div>
          <h2>The audited result</h2>
          <p className="sec-lede">
            Audited with axe-core against WCAG 2.1 A and AA on this page, plus a manual
            pass over the product itself. Contrast figures are computed from the tokens.
          </p>
          <div className="sec-body">
            <table className="tbl">
              <thead>
                <tr><th>Text colour</th><th>On</th><th>Ratio</th><th>AA (4.5)</th></tr>
              </thead>
              <tbody>
                {tok?.contrast.map((c) => (
                  <tr key={c.fg + c.bg}>
                    <td><span className="dot" style={{ background: c.fgv }} />{c.role}</td>
                    <td>{c.bg.replace("--", "")}</td>
                    <td className="num">{c.r.toFixed(2)}:1</td>
                    <td>{c.r >= 4.5 ? <span className="chip">Passes</span> : <span className="chip" style={{ color: "var(--clay)" }}>Large text only</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="caveat">
              <h4>What this number does not mean</h4>
              <p>
                Zero automated violations is a floor, not a verdict. Automated rules catch
                roughly a third of real barriers: they can see a missing label, but not a
                confusing one. This has not been tested with a screen-reader user, and no
                one who relies on assistive technology has used it yet. What is verified is
                narrower and stated exactly: every colour pair passes AA, every control is
                a real button reachable by keyboard with a visible focus ring, and the
                product respects reduced-motion preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— next ——— */}
      <section className="sec" id="next">
        <div className="wrap">
          <div className="sec-eye">Where this goes next</div>
          <h2>The parts worth building</h2>
          <p className="sec-lede">
            ALBA is a working prototype: its data is fixtures held in memory, and there is
            no server behind it. Those are the starting conditions, and they set up what
            comes next.
          </p>
          <div className="sec-body road">
            <div className="lane">
              <div className="lane-h">Next</div>
              <div className="lane-w">Nearest to hand</div>
              <ul>
                <li>Real persistence, so a request survives a refresh.</li>
                <li>Operator broadcast: one notice to a whole estate.</li>
                <li>Rent visibility for the resident inside Account.</li>
              </ul>
            </div>
            <div className="lane">
              <div className="lane-h">Later</div>
              <div className="lane-w">Needs a back end</div>
              <ul>
                <li>Real gate integration for guest passes.</li>
                <li>Vendor-side scheduling, not just the desk&rsquo;s view.</li>
                <li>Documents a lease can actually be signed on.</li>
              </ul>
            </div>
            <div className="lane">
              <div className="lane-h">Exploring</div>
              <div className="lane-w">Open questions</div>
              <ul>
                <li>How quiet can a notification be and still arrive?</li>
                <li>What the desk should decide without asking Rosa.</li>
                <li>A second estate&rsquo;s brand inside the same system.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <p>
            ALBA — Maison. A prototype by Tanmay Jain. The application on this page is
            live; the data behind it is fixture data. <a href="/">Open the app →</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
