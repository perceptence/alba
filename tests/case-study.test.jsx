/* WHAT THIS GUARDS
   That the page renders, that it mounts the REAL product inline rather than a
   picture of it, and — the thing most easily broken — that the embed is not
   sitting on a splash screen on a cold load. */

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import CaseStudy from "@/app/case-study/CaseStudy";
import { SCREENS, SCREEN_KEYS } from "@/lib/screens";
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

  it("lists every screen in the registry, with its one line", () => {
    const { container } = render(<CaseStudy />);
    const rows = container.querySelectorAll(".jrow");
    expect(rows.length).toBe(SCREEN_KEYS.length);
    for (const k of SCREEN_KEYS) {
      expect(screen.getAllByText(SCREENS[k].line).length).toBeGreaterThan(0);
    }
  });

  it("prints the figures from the stats module, not literals", () => {
    const { container } = render(<CaseStudy />);
    const figs = [...container.querySelectorAll(".fig-v")].map((n) => n.textContent);
    expect(figs).toContain(String(STATS.components));
    expect(figs).toContain(String(STATS.tokens));
    expect(figs).toContain(String(STATS.screens));
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
