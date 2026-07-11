/* ALBA spacing audit — paste into the console (or run via CDP) on any screen.
   Reports Rule-1 row paddings and box gaps for rail/section relationships,
   per SPACING.md. */
(() => {
  const gap = (a, b) => a && b ? Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom) : null;
  const rows = [...document.querySelectorAll(".arow,.rrow,.grow,.estrow,.rres,.payrow,.lrow,.dqrow,.doc,.brief,.reqmini,.est-res,.ap-card,.gpass,.chg,.kvl .kv,.urow,.sentry,.rstep,.toggle-line,.am-r,.pastlink,.calm,.sday-empty,.sday-tail,.drow-head")];
  const offPad = [...new Set(rows.filter(r => getComputedStyle(r).paddingTop !== "16px")
    .map(r => r.className.split(" ")[0] + ":" + getComputedStyle(r).paddingTop))];
  const rails = [...document.querySelectorAll(".nt-tabs,.mgr-nt-tabs,.mgr-bar")];
  const railGaps = rails.map(r => r.nextElementSibling ? gap(r, r.nextElementSibling) : null).filter(v => v != null);
  const sectionMargins = [...new Set([...document.querySelectorAll(".sect")].map(s => getComputedStyle(s).marginTop))];
  const out = { rowCount: rows.length, offPad, railGaps_expect20: railGaps, sectionMargins_expect32: sectionMargins };
  console.log(out);
  return out;
})();
