"use client";

/* The design system on its own page — the same specimens the case study shows,
   from the same module, so the two can never disagree. */

import { useTokens, SystemSpecimens } from "@/components/SystemSpecimens";
import { STATS } from "@/lib/stats";
/* The tokens live in the app's stylesheet. The case study gets it for free by
   mounting <App/>; this page doesn't, so it must ask for it — without this
   every custom property is undefined and the whole page loses its colour. */
import "../alba.css";
import "../case-study/case-study.css";

export default function DesignSystem() {
  const tok = useTokens();
  return (
    <div className="cs">
      <header className="top stuck">
        <div className="wrap">
          <span className="top-id">
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
          <a className="top-link" href="/case-study">
            Back to the case study
          </a>
        </div>
      </header>

      <section className="sec" style={{ borderTop: "none", paddingTop: 132 }}>
        <div className="wrap">
          <div className="sec-eye">The system</div>
          <h2>Read from the stylesheet, live</h2>
          <p className="sec-lede">
            Every specimen below is read out of the running stylesheet as this page
            renders — none of it is transcribed. Change a token in the product and this
            page changes with it. Click a colour to copy its value.
          </p>
          <div className="sec-body">
            <SystemSpecimens tok={tok} />
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <p>
            {STATS.tokens} tokens · {STATS.components} components ·{" "}
            <a href="/case-study">the case study</a> · <a href="/">the app</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
