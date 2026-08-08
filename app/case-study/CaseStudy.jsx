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
import { Avatar } from "@/components/Avatar";
import { AV } from "@/lib/data";
import { SCREENS, SCREEN_KEYS, JOURNEYS, JOURNEY_GROUPS } from "@/lib/screens";
import { STATS } from "@/lib/stats";
import { useTokens, SystemSpecimens } from "@/components/SystemSpecimens";
import "./case-study.css";

/* ——— small module-scope pieces ——— */
function Figure({ v, k }) {
  return (<div className="fig"><div className="fig-v">{v}</div><div className="fig-k">{k}</div></div>);
}

function Decision({ n, title, lk, rk, left, right, what, why, size }) {
  return (
    <article className={"case" + (size ? " " + size : "")}>
      <div className="case-n">{n}</div>
      <h3 className="case-t">{title}</h3>
      <div className="case-ba">
        <div className="ba bad"><div className="ba-k">{lk}</div>{left}</div>
        <div className="ba good"><div className="ba-k">{rk}</div>{right}</div>
      </div>
      <div className="case-read">
        <div><h4>What you are looking at</h4><p>{what}</p></div>
        <div><h4>What it makes true</h4><p>{why}</p></div>
      </div>
    </article>
  );
}

/* ——— decision visuals, all built from the product's own tokens ——— */
const AMENITIES = [["Saltwater pool", "West terrace"], ["Olive garden", "Mature"], ["Wine cellar", "Climate-set"]];

const CardsDemo = () => (
  <div className="d-cards">
    {AMENITIES.map(([a, b]) => (
      <div className="d-card" key={a}><span className="d-k">{a}</span><span className="d-v">{b}</span></div>
    ))}
  </div>
);
const RowsDemo = () => (
  <div>
    {AMENITIES.map(([a, b]) => (
      <div className="row-demo" key={a}><span className="k">{a}</span><span className="v">{b}</span></div>
    ))}
  </div>
);

const PhotoDemo = () => (<div className="d-photo"><span className="demo-lbl">stock photograph</span></div>);
const DrawingDemo = () => (<div className="d-draw"><Elevation h={120} variant="stone" /></div>);

const FlatRowDemo = () => (
  <div className="d-flat">
    <span className="d-flat-t">Pool heater</span>
    <span className="d-flat-s">Open</span>
  </div>
);
const StatusRowDemo = () => (
  <div>
    <div className="demo-lbl">Maintenance · Grounds</div>
    <div className="d-flat-t" style={{ marginTop: 4 }}>Pool heater cycling off</div>
    <div className="d-sub"><span className="d-sub-a">Rosa replied</span> · Technician on site</div>
    <div className="d-track"><span className="d-fill" /><span className="d-now" /></div>
    <div className="demo-lbl" style={{ marginTop: 8 }}>In progress · today, 9:15</div>
  </div>
);

const LoudDemo = () => (
  <div>
    <div className="d-loud"><span className="d-chip cl">Urgent</span><span className="d-chip sg">Paid</span><span className="d-chip gd">Pending</span><span className="d-chip cl">New</span></div>
    <div className="d-flat-t" style={{ marginTop: 12, color: "var(--clay)" }}>$19,950</div>
    <div className="demo-lbl" style={{ marginTop: 6, color: "var(--sage)" }}>Everything asks at once</div>
  </div>
);
const QuietDemo = () => (
  <div>
    <div className="demo-lbl">Rent &amp; charges</div>
    <div className="d-flat-t" style={{ marginTop: 6 }}>$19,950</div>
    <div className="d-sub" style={{ marginTop: 6 }}>$18,500 rent · <span className="d-sub-a">$1,450 in charges</span></div>
    <div className="demo-lbl" style={{ marginTop: 10 }}>One clay mark. It is the thing that needs you.</div>
  </div>
);

const SansOnlyDemo = () => (
  <div>
    <div className="d-sans-l">RESIDENCE</div>
    <div className="d-sans-t">The Verde Bungalow</div>
    <div className="d-sans-l" style={{ marginTop: 12 }}>BALANCE DUE</div>
    <div className="d-sans-t">$19,950</div>
  </div>
);
const PairDemo = () => (
  <div>
    <div className="demo-lbl">Residence</div>
    <div className="d-serif">The Verde Bungalow</div>
    <div className="demo-lbl" style={{ marginTop: 12 }}>Balance due</div>
    <div className="d-serif">$19,950</div>
  </div>
);

const TicketDemo = () => (
  <div className="d-ticket">
    <div>TICKET #4821</div>
    <div>STATUS: OPEN</div>
    <div>ASSIGNED: —</div>
    <div>QUEUE: MAINTENANCE</div>
  </div>
);
const PersonDemo = () => (
  <div className="d-person">
    <Avatar cfg={AV.rosa} size={44} />
    <div>
      <div className="d-serif" style={{ fontSize: 19 }}>Rosa Ibáñez</div>
      <div className="d-sub" style={{ marginTop: 2 }}>Your estate manager</div>
      <div className="demo-lbl" style={{ marginTop: 6 }}>Usually replies within the hour</div>
    </div>
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
  ["collisions.test.js", "No class name on this page collides with one in the product's stylesheet — the bug that put ten swatches in the corner of the page."],
];

/* the five stops that trace the argument, in reading order */
const ROUTE = [
  ["#why", "The problem"],
  ["#live", "The product"],
  ["#decisions", "The decisions"],
  ["#system", "The system"],
  ["#next", "What's next"],
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
          <nav className="top-nav" aria-label="Sections">
            {ROUTE.map(([href, label]) => (
              <a key={href} className="top-nav-a" href={href}>{label}</a>
            ))}
          </nav>
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
          <h2>What this took</h2>
          <p className="sec-lede">
            Two audiences, three form factors, one system holding all of it. These are
            counted out of the codebase rather than asserted — the suite fails if any of
            them drifts from what actually shipped.
          </p>
          <div className="sec-body figs">
            <Figure v={STATS.journeys} k="Journeys designed" />
            <Figure v={STATS.screens} k="Screens, each deep-linkable" />
            <Figure v={STATS.surfaces} k="Sheets and flyouts beneath them" />
            <Figure v={STATS.components} k="Reusable components" />
            <Figure v={STATS.formFactors} k="Form factors, one system" />
            <Figure v={STATS.tests} k="Tests holding the rules" />
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
            The people living with these products have already written the brief. Resident
            portals ship with years of public reviews, and the same four complaints keep
            surfacing — work that vanishes, money that arrives unexplained, status nobody
            can see, interruptions nobody asked for. I read them against established
            interface guidance and designed for the pattern underneath. Every source is
            linked; each finding names the decision it drove.
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
          <div className="who">
            <div className="who-c">
              <div className="who-n">Adrien</div>
              <div className="who-r">Lives in one house</div>
              <p className="who-d">
                Six things a year go wrong in his house, and he wants none of them to
                become his job. He is not a power user and never will be — the product
                has to be worth opening on the four days a month he needs it.
              </p>
              <div className="who-e">What he judges it by · did it get handled</div>
            </div>
            <div className="who-c">
              <div className="who-n">Rosa</div>
              <div className="who-r">Runs seven houses</div>
              <p className="who-d">
                Every one of Adrien&rsquo;s six lands on her, times seven houses, all at once
                and out of order. The resident&rsquo;s side of this product is only as good as
                the desk behind it, which is why she got a full journey rather than an
                admin panel.
              </p>
              <div className="who-e">What she judges it by · what needs her, now</div>
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
            One system carries both journeys and all three form factors. What follows is
            not a description of it — the page reads the live stylesheet as it renders, so
            these are the product&rsquo;s own values, changing the moment a token does.
            Hand-typed documentation starts lying the week it is written.
          </p>
          <div className="sec-body">
            <SystemSpecimens tok={tok} />
            <a className="spec-link" href="/design-system" target="_blank" rel="noopener noreferrer">
              Open the design system<span className="top-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ——— the decisions ——— */}
      <section className="sec" id="decisions">
        <div className="wrap">
          <div className="sec-eye">The decisions</div>
          <h2>Six choices that make it this</h2>
          <p className="sec-lede">
            The character of the thing comes from a small number of decisions, each one a
            refusal of what the category does by default. Left is the usual answer. Right
            is ALBA — rendered here with the product&rsquo;s own components and tokens.
          </p>
          <div className="sec-body cases">
            <Decision
              size="lead"
              n="01 · Surface"
              title="Hairlines, not cards"
              lk="The usual" rk="ALBA"
              left={<CardsDemo />} right={<RowsDemo />}
              what="The same three amenities. On the left each one is boxed, shadowed and floated apart; on the right they are lines of a single list, separated by a rule."
              why="Nothing is packaged. A card says here is a component; a rule says here is the next thing. The whole product carries exactly one shadow — the device frame — so the page reads as paper with ink on it rather than an interface stacked in layers."
            />
            <Decision
              n="02 · Image"
              title="A drawing, never a photograph"
              lk="The usual" rk="ALBA"
              left={<PhotoDemo />} right={<DrawingDemo />}
              what="Where a listing would put a photograph of the house, ALBA puts an architectural elevation, drawn in the same hand for all seven estates. It draws itself in on arrival."
              why="A photograph flatters, dates, and quietly promises a particular afternoon. A line drawing describes the house without selling it — and because it is drawn rather than shot, every estate can be given the same care, which is the actual promise the product is making."
            />
            <Decision
              n="03 · Status"
              title="The status is the row"
              lk="The usual" rk="ALBA"
              left={<FlatRowDemo />} right={<StatusRowDemo />}
              what="One open request in a list. On the left it says only that it exists. On the right it names what it is, who last moved it, where it stands, and when."
              why="Nobody should open something to find out whether anything happened. The category's own reviews are full of residents who cannot see their own history; here the record is the list, so the answer to 'is anyone doing anything' is visible without a tap."
            />
            <Decision
              size="tight"
              n="04 · Colour"
              title="One accent, spent once"
              lk="The usual" rk="ALBA"
              left={<LoudDemo />} right={<QuietDemo />}
              what="The same money, twice. On the left every state has a colour and they compete; on the right the page is ink and paper with a single clay mark on the one figure that wants a decision."
              why="An accent only means something if it is rare. Clay is reserved for what needs you — the unpaid charge, the unread notice, the request that has stalled. Spend it on four things at once and the resident has to work out which one is real."
            />
            <Decision
              size="tight"
              n="05 · Voice"
              title="Serif for people, sans for the machinery"
              lk="Sans throughout" rk="ALBA"
              left={<SansOnlyDemo />} right={<PairDemo />}
              what="A house name and a balance, set two ways. On the left one typeface does everything. On the right Fraunces carries the names and the figures, while Inter is left to the labels above them."
              why="Two faces divide the page into what is being said and what is doing the saying. The house, the people and the money are spoken in serif; counts, tags and eyebrows stay in sans and get out of the way. It is what keeps a rent figure from reading like a database field."
            />
            <Decision
              n="06 · Address"
              title="A person, not a queue"
              lk="The usual" rk="ALBA"
              left={<TicketDemo />} right={<PersonDemo />}
              what="Who receives a request. On the left, a reference number and a queue. On the right, Rosa — named, pictured, with how long she usually takes."
              why="Service that feels attended to has somebody's name on it. Every request in ALBA goes to a person and comes back in her voice, and the operator side is built as her desk rather than an admin panel — which is why the same design system had to serve both sides of the conversation."
            />
          </div>
          <p className="thesis">
            Every one of the six spends attention rather than adding it. That is the whole
            position: in a product about service, the design&rsquo;s job is to decide what the
            resident should not have to notice.
          </p>
        </div>
      </section>

      {/* ——— tests ——— */}
      <section className="sec" id="tests">
        <div className="wrap">
          <div className="sec-eye">Tests</div>
          <h2>What the suite refuses to let slip</h2>
          <p className="sec-lede">
            {STATS.testFiles} files. Not coverage for its own sake — each one pins a rule
            that a real bug in this project broke. This is where design intent stops being
            a preference and starts being enforced: contrast, spacing and the deep-link
            registry all fail the build before they can quietly regress.
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
                    <td><span className="a11y-dot" style={{ background: c.fgv }} />{c.role}</td>
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

      {/* ——— what it could become ——— */}
      <section className="sec" id="next">
        <div className="wrap">
          <div className="sec-eye">Where this goes</div>
          <h2>A house that answers before it is asked</h2>
          <p className="sec-lede">
            The prototype settles the manners: how a house speaks, what it refuses to
            shout, whose name is on the answer. Those manners are the hard part, and they
            scale further than a phone. What follows is the argument for what they could
            carry — none of it in here, all of it the reason to build the next thing.
          </p>
          <div className="sec-body road">
            <div className="lane">
              <div className="lane-h">The house reports itself</div>
              <div className="lane-w">Service before the complaint</div>
              <ul>
                <li>
                  <b>The pool heater raises its own request.</b>
                  <span>Plant that files a fault the week it starts drifting, so the
                  first anyone hears of it is Rosa saying it is already booked.</span>
                </li>
                <li>
                  <b>The estate has a standing rhythm.</b>
                  <span>Linens on Thursdays, guests most Fridays, the olive terrace cut
                  before August. A household has a shape; the desk should keep it without
                  being reminded.</span>
                </li>
                <li>
                  <b>Every promise is on the record.</b>
                  <span>An account of what was asked, agreed and done that neither side
                  can quietly revise — the exact thing residents say goes missing today.</span>
                </li>
              </ul>
            </div>

            <div className="lane">
              <div className="lane-h">The desk becomes a network</div>
              <div className="lane-w">One picture, many hands</div>
              <ul>
                <li>
                  <b>Vendors as participants, not phone numbers.</b>
                  <span>The gardener confirms Thursday from his own van and the resident&rsquo;s
                  timeline moves itself. No one retypes anything.</span>
                </li>
                <li>
                  <b>An estate desk that spans houses and firms.</b>
                  <span>Seven becomes seventy, across managers and trades, without the day
                  turning into a queue with people in it.</span>
                </li>
                <li>
                  <b>Rosa&rsquo;s judgement scaled, never replaced.</b>
                  <span>Let the desk settle the routine so the manager spends her attention
                  on the things that actually need a person.</span>
                </li>
              </ul>
            </div>

            <div className="lane">
              <div className="lane-h">The far edge</div>
              <div className="lane-w">Worth arguing about</div>
              <ul>
                <li>
                  <b>Ask aloud, anywhere in the house.</b>
                  <span>&ldquo;Ask for anything&rdquo; taken literally — said in passing on the way
                  out, understood, routed, and waiting as a request when you look.</span>
                </li>
                <li>
                  <b>Residency as something you carry.</b>
                  <span>Lease, payments, requests and guests as one continuous record the
                  resident owns and can take to the next house.</span>
                </li>
                <li>
                  <b>The system as a house style others can wear.</b>
                  <span>A second estate&rsquo;s name and colour inside the same manners, so
                  quiet service is something an operator can adopt rather than commission.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <p>
            ALBA — Maison. Designed and built by Tanmay Jain, with Claude. The
            application on this page is live; the data behind it is fixture data. <a href="/">Open the app →</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
