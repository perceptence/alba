/* WHAT THIS GUARDS
   That the page renders, that it mounts the REAL product inline rather than a
   picture of it, and — the thing most easily broken — that the embed is not
   sitting on a splash screen on a cold load. */

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import CaseStudy from "@/app/case-study/CaseStudy";
import { SCREENS, SCREEN_KEYS, JOURNEY_GROUPS } from "@/lib/screens";
import { STATS } from "@/lib/stats";

afterEach(cleanup);

describe("the case-study page", () => {
  it("renders its hero", () => {
    const { container } = render(<CaseStudy />);
    expect(container.querySelector(".cs")).toBeTruthy();
    expect(container.querySelector(".hero h1")?.textContent).toMatch(/A house/);
  });

  it("mounts the real application inline — same React tree, not an iframe", () => {
    const { container } = render(<CaseStudy />);
    expect(container.querySelector("iframe")).toBeNull();
    const stage = container.querySelector(".live-stage");
    expect(stage, "no live stage").toBeTruthy();
    // .am is the application root; .phone is its device frame
    expect(stage.querySelector(".am"), "the app is not mounted").toBeTruthy();
    expect(stage.querySelector(".phone"), "the app shell is missing").toBeTruthy();
  });

  it("is NOT stuck on a splash or empty state on a cold load", () => {
    const { container } = render(<CaseStudy />);
    const stage = container.querySelector(".live-stage");
    expect(stage.querySelector(".splash"), "the embed is showing the launch splash").toBeNull();
    // real content from the resident's home screen is present
    expect(stage.textContent).toMatch(/Adrien/);
  });

  it("drops the prototype-only chrome inside the embed", () => {
    const { container } = render(<CaseStudy />);
    const stage = container.querySelector(".live-stage");
    expect(stage.querySelector(".demopanel"), "journey switcher leaked into the embed").toBeNull();
  });

  it("opens on the first journey tab and lists exactly that group's screens", () => {
    const { container } = render(<CaseStudy />);
    const first = JOURNEY_GROUPS[0];
    const expected = SCREEN_KEYS.filter((k) => SCREENS[k].journey === first.journey);
    expect(container.querySelectorAll(".jrow").length).toBe(expected.length);
    for (const k of expected) {
      expect(screen.getAllByText(SCREENS[k].line).length).toBeGreaterThan(0);
    }
  });

  it("has one tab per journey group, with its screen count", () => {
    const { container } = render(<CaseStudy />);
    const tabs = [...container.querySelectorAll(".jtab")];
    expect(tabs.length).toBe(JOURNEY_GROUPS.length);
    tabs.forEach((t, i) => {
      const g = JOURNEY_GROUPS[i];
      const n = SCREEN_KEYS.filter((k) => SCREENS[k].journey === g.journey).length;
      expect(t.textContent).toContain(g.label);
      expect(t.textContent).toContain(String(n));
    });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
  });

  it("switching tab swaps the list and moves the live app with it", async () => {
    const { container } = render(<CaseStudy />);
    const last = JOURNEY_GROUPS[JOURNEY_GROUPS.length - 1];
    const tab = [...container.querySelectorAll(".jtab")].find((t) => t.textContent.includes(last.label));
    await act(async () => { tab.click(); });
    const expected = SCREEN_KEYS.filter((k) => SCREENS[k].journey === last.journey);
    expect(container.querySelectorAll(".jrow").length).toBe(expected.length);
    expect(tab.getAttribute("aria-selected")).toBe("true");
    // the embedded app followed the tab to that group's first screen
    expect(container.querySelector(".live-badge").textContent).toContain(SCREENS[expected[0]].label);
  });

  it("every screen is reachable across the tabs — none is stranded", () => {
    const reachable = JOURNEY_GROUPS.flatMap((g) =>
      SCREEN_KEYS.filter((k) => SCREENS[k].journey === g.journey));
    expect(new Set(reachable).size).toBe(SCREEN_KEYS.length);
  });

  it("prints the figures from the stats module, not literals", () => {
    const { container } = render(<CaseStudy />);
    const figs = [...container.querySelectorAll(".fig-v")].map((n) => n.textContent);
    for (const v of [STATS.journeys, STATS.screens, STATS.surfaces, STATS.components, STATS.formFactors, STATS.tests]) {
      expect(figs).toContain(String(v));
    }
  });

  it("the figures describe the product, not the fixture data", () => {
    const { container } = render(<CaseStudy />);
    const keys = [...container.querySelectorAll("#glance .fig-k")].map((n) => n.textContent).join(" ");
    // estates and residents are demo content — they measure the seed data, not the work
    expect(keys, "fixture counts are not product scope").not.toMatch(/estate|resident/i);
  });

  it("states the prototype's scope in the hero — earlier than any lede, and once", () => {
    const { container } = render(<CaseStudy />);
    expect(container.querySelector(".hero-meta").textContent, "scope belongs up front")
      .toMatch(/prototype/i);
    // and the colophon carries the data caveat, so it is stated without being repeated
    expect(container.querySelector(".foot").textContent).toMatch(/fixture data/i);
  });

  it("credits the collaboration once, in the colophon — not repeatedly", () => {
    const { container } = render(<CaseStudy />);
    expect(container.querySelector(".foot").textContent).toMatch(/with Claude/);
    // solo authorship is implicit in a portfolio piece; saying it repeatedly is noise
    const body = container.textContent;
    expect((body.match(/\bsolo\b/gi) || []).length, "'solo' should not be repeated").toBeLessThanOrEqual(1);
  });

  it("every stop in the header route points at a section that exists", () => {
    const { container } = render(<CaseStudy />);
    const links = [...container.querySelectorAll(".top-nav-a")];
    expect(links.length, "no route in the header").toBeGreaterThanOrEqual(4);
    for (const a of links) {
      const id = a.getAttribute("href").slice(1);
      expect(container.querySelector(`#${id}`), `route points at #${id}, which is not on the page`).toBeTruthy();
    }
  });

  it("the guard list names every test file the page claims to have", () => {
    const { container } = render(<CaseStudy />);
    const rows = container.querySelectorAll(".guard");
    expect(rows.length, "the listed guards and STATS.testFiles have drifted apart").toBe(STATS.testFiles);
  });

  it("states the research honestly without claiming studies that were not run", () => {
    const { container } = render(<CaseStudy />);
    const body = container.textContent;
    expect(container.querySelector("#why .sec-lede").textContent, "the method must be named")
      .toMatch(/reviews/i);
    // the honesty is in never claiming these, not in disclaiming them
    expect(body, "must not claim interviews").not.toMatch(/\b(I|we) interviewed\b/i);
    expect(body, "must not claim usability testing").not.toMatch(/usability test|user testing|moderated/i);
    expect(body, "must not claim a team").not.toMatch(/\bmy team\b|\bour team\b/i);
  });

  it("introduces both people the product is designed around", () => {
    const { container } = render(<CaseStudy />);
    const cards = container.querySelectorAll("#why .who-c");
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toMatch(/Adrien/);
    expect(cards[1].textContent).toMatch(/Rosa/);
  });

  it("does not hedge its own scope in the section ledes", () => {
    const { container } = render(<CaseStudy />);
    const ledes = [...container.querySelectorAll(".sec-lede")].map((n) => n.textContent).join(" ");
    for (const hedge of [/weakest part/i, /paper over/i, /nobody was interviewed/i, /no original studies/i]) {
      expect(ledes, `hedging phrase in a lede: ${hedge}`).not.toMatch(hedge);
    }
  });

  it("keeps every journey control a real button (keyboard reachable)", () => {
    const { container } = render(<CaseStudy />);
    for (const el of container.querySelectorAll(".jrow")) {
      expect(el.tagName).toBe("BUTTON");
    }
  });

  it("gives the scrollable code block a tab stop", () => {
    const { container } = render(<CaseStudy />);
    for (const pre of container.querySelectorAll("pre.code")) {
      expect(pre.getAttribute("tabindex")).toBe("0");
    }
  });
});

/* The design system lives on its own page too. Both pages render the SAME
   specimen module, so they cannot document different systems. */
describe("the design-system page", () => {
  it("renders the shared specimens, not its own copy", async () => {
    const { default: DesignSystem } = await import("@/app/design-system/DesignSystem");
    const { container } = render(<DesignSystem />);
    expect(container.querySelector(".spec"), "no specimen grid").toBeTruthy();
    expect(container.querySelectorAll(".spec .card").length).toBeGreaterThanOrEqual(9);
  });

  it("the case study links out to it", () => {
    const { container } = render(<CaseStudy />);
    const link = container.querySelector(".spec-link");
    expect(link, "no link to the design system").toBeTruthy();
    expect(link.getAttribute("href")).toBe("/design-system");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});
