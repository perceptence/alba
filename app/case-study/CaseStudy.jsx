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
import { I } from "@/components/icons";
import { SCREENS, SCREEN_KEYS, JOURNEYS, JOURNEY_GROUPS } from "@/lib/screens";
import { STATS } from "@/lib/stats";
import { useTokens, SystemSpecimens } from "@/components/SystemSpecimens";
import "./case-study.css";

/* ——— small module-scope pieces ——— */
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
/* who decides the layout: the window, or the box you are actually in */
const ScopeDemo = ({ asksWindow, label }) => (
  <div>
    <div style={{ border: "1px solid var(--grey-2)", height: 84, display: "flex", padding: 7, gap: 7, background: "var(--paper)" }}>
      <div style={{ flex: 1, border: "1px dashed var(--line)" }} />
      <div style={{ width: 48, border: "1px solid var(--ink)", display: "flex", flexDirection: asksWindow ? "row" : "column" }}>
        {asksWindow ? (<>
          <span style={{ width: "38%", background: "var(--paper-3)" }} />
          <span style={{ flex: 1, background: "var(--paper-2)" }} />
        </>) : (<>
          <span style={{ flex: 1, background: "var(--paper-2)" }} />
          <span style={{ height: 10, background: "var(--paper-3)" }} />
        </>)}
      </div>
    </div>
    <div className="demo-lbl" style={{ marginTop: 10 }}>{label}</div>
  </div>
);
/* artwork that restarted its own draw-in every render */
const DrawDemo = ({ broken, label }) => (
  <div>
    <svg viewBox="0 0 130 62" width="100%" height="62" fill="none" stroke="var(--ink)" strokeWidth="1.1" strokeLinecap="round">
      <g strokeDasharray={broken ? "3 8" : undefined} opacity={broken ? 0.4 : 1}>
        <path d="M14 52 L14 26 L65 11 L116 26 L116 52" />
        <rect x="52" y="34" width="20" height="18" />
        <line x1="6" y1="52" x2="124" y2="52" />
      </g>
    </svg>
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

/* the screens belonging to one journey, in registry order */
const keysFor = (journey) => SCREEN_KEYS.filter((k) => SCREENS[k].journey === journey);

export default function CaseStudy() {
  const [screen, setScreen] = useState("home");
  const [group, setGroup] = useState(JOURNEY_GROUPS[0].journey);
  const [stuck, setStuck] = useState(false);
  const heroRef = useRef(null);

  const tok = useTokens();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = SCREENS[screen];
  const activeGroup = JOURNEY_GROUPS.find((g) => g.journey === group);
  /* switching tab moves the live app too — the tab is a claim about who is
     holding the phone, so the phone should agree with it */
  const pickGroup = (j) => { setGroup(j); setScreen(keysFor(j)[0]); };

  return (
    <div className="cs">
      <header className={"top" + (stuck ? " stuck" : "")}>
        <div className="wrap">
          <span className="top-id">
            {/* the product's own mark: the doorway arch with the clay sun rising in it */}
            <svg className="top-mark" viewBox="0 0 40 40" aria-hidden="true">
              <path d="M 9 34 L 9 19 A 11 9 0 0 1 31 19 L 31 34" />
              <path className="top-sun" d="M 14 34 A 6 6 0 0 1 26 34 Z" />
              <line x1="4" y1="34" x2="36" y2="34" />
            </svg>
            <span className="top-words">
              <span className="top-word">ALBA</span>
              <span className="top-desc">Maison</span>
            </span>
          </span>
          <a
            className="top-link"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the app in a new tab"
          >
            Open the app<span className="top-arrow" aria-hidden="true">→</span>
          </a>
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
          <h2>Have a look around</h2>
          <p className="sec-lede">
            This is the app itself, not pictures of it — everything here works. Follow
            Adrien through an ordinary week at home, arrive as a new resident being
            invited in, or take Rosa&rsquo;s seat and run seven houses from one desk.
          </p>
          <div className="sec-body live">
            <div className="live-list">
              <div className="jtabs" role="tablist" aria-label="Who is using the app">
                {JOURNEY_GROUPS.map((g) => (
                  <button
                    key={g.journey}
                    role="tab"
                    aria-selected={g.journey === group}
                    className={"jtab" + (g.journey === group ? " on" : "")}
                    onClick={() => pickGroup(g.journey)}
                  >
                    {g.label}
                    <span className="jtab-n">{keysFor(g.journey).length}</span>
                  </button>
                ))}
              </div>
              <div className="jwho">{JOURNEYS[group]}</div>
              <div style={{ marginTop: "var(--gap-rail)" }}>
                {keysFor(group).map((k) => (
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
            </div>
            <div className="live-stageWrap">
              <div className="live-badge">● Live — {active?.label}</div>
              <div className="live-stage">
                {/* key remounts per screen so each one lands deterministically */}
                <App key={screen} embedded screen={screen} />
              </div>
            </div>
          </div>
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
          <div className="sec-body">
            <SystemSpecimens tok={tok} />
            <a className="spec-link" href="/design-system" target="_blank" rel="noopener noreferrer">
              Open the design system<span className="top-arrow" aria-hidden="true">→</span>
            </a>
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
              n="01 · Architecture"
              title="The app could only ever be the whole window"
              before={<ScopeDemo asksWindow label="narrow column, desktop layout" />}
              after={<ScopeDemo asksWindow={false} label="narrow column, phone layout" />}
              read="A narrow column inside a wide page. On the left the app inside it draws a desktop sidebar, because it asked the window how much room it had and the window said 1680px. On the right it asks the column, and gets it right."
              why="A component decides from its container, never the viewport. Every one of the twelve breakpoints was a window query, which meant the app could never be embedded, previewed beside anything, or composed into a larger surface — a limit nobody had noticed because it had always been alone on the page. Converting them to container queries is what makes the live embed further up this page possible at all: it is the real app at phone width inside a desktop document."
            />
            <Case
              n="02 · React"
              title="The drawing that erased itself"
              before={<DrawDemo broken label="strokes never finish" />}
              after={<DrawDemo label="drawn, and stays drawn" />}
              read="The estate line-art, which is animated by drawing each stroke in from nothing. On the left the strokes are stuck partway — visible as gaps, or not visible at all."
              why="Never declare a component inside another component. The drawing's helpers (ground, sun, trees) were defined inside the parent's render, so every parent re-render produced a brand-new component type — React unmounted the old artwork and mounted fresh copies, restarting each stroke's draw-in from zero. It presented as a flaky animation, so it was chased as a timing problem for a while; the cause was identity, not timing. The helpers moved to module scope and the symptom vanished. The same rule protects any ref-based measurement, which silently never runs when its node is swapped underneath it."
            />
            <Case
              n="03 · System"
              title="Why tuning the spacing never converged"
              before={<GapDemo gap={48} />}
              after={<GapDemo gap={32} />}
              read="One boundary between two sections. It measured 48px when the system intended 32 — but the important thing is not the number, it is that nobody could say which rule produced it."
              why="Every gap must have exactly one owner. For weeks each spacing fix moved the problem somewhere else, because a gap was never a value — it was a sum of a row's padding, a section's margin, and the leading of whatever text sat inside. Changing any one of the three fixed the instance and broke a neighbour, so the work never converged. The fix was not a number but a doctrine: one owner per gap, written down as SPACING.md, with the deliberate decision not to preserve any existing hand-tuned total. Re-basing everything on tokens broke things loudly for an afternoon, and then spacing stopped being a topic."
            />
            <Case
              n="04 · Regression"
              title="A fix for the phone shrank the desktop"
              before={<LayoutDemo full={false} label="whole app collapsed to 1127px" />}
              after={<LayoutDemo full label="app fills the window again" />}
              read="The desktop application at the same window size, before and after. Nothing about the desktop layout was edited between these two states."
              why="A wrapper introduced for one breakpoint must be inert at the others. A shell was added around the app so the phone mockup could carry hardware buttons — which is invisible at phone size and catastrophic at desktop: the shell shrink-wrapped to its contents inside a centring grid, taking the entire application down to 1127px of a 1680px window. It was found by measuring rather than looking, because it reads as a design choice rather than a bug. It now resolves to display:contents above 900px, so it leaves the layout entirely."
            />
            <Case
              n="05 · Principle"
              title="When the house style failed the audit"
              before={<ContrastDemo colour="#9A9184" r="2.71" label="the old muted grey" />}
              after={<ContrastDemo colour="#736A5C" r="4.64" label="the new muted grey" />}
              read="The single colour behind every eyebrow, timestamp and count in the product. Both are muted; one of them is 2.71:1 against the page, which is below the 4.5:1 that AA asks of body text."
              why="Restraint has to be measured, not judged by eye. This was the uncomfortable one: quietness is the whole design language, so the failing colour was not a mistake, it was the point. Darkening the text would have broken the voice; the honest fix was to accept that the swatch itself was wrong and move three brand colours until they measured. The rule that came out of it is that no colour ships on taste alone — a test now recomputes every text-and-surface pair from the tokens on every run, which is how the tinted-panel near-miss on this very page was caught later."
            />
            <Case
              n="06 · Dependency"
              title="The product looked different on a slow network"
              before={<FontDemo family="Georgia, serif" weight={700} label="fallback face" />}
              after={<FontDemo family="var(--serif)" weight={600} label="Fraunces, self-hosted" />}
              read="The same word in the fallback face and the intended one. The fallback is heavier and more compact — which is why the app was reported as looking 'bolder and darker' when not one colour had changed."
              why="Anything that decides how the product looks has to ship with it. The typefaces were requested from a third party at runtime, so the identity of the product depended on someone else's uptime and the user's connection: the same build rendered differently for different people, and the symptom arrived as a colour complaint rather than a font one. Moving them to self-hosted files removed the network from the design entirely — and, incidentally, the tracking request that came with it."
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
