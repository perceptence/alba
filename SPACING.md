# ALBA — Vertical Spacing Standard

Status: **DRAFT — Rule 1 approved (16px), Rules 2–4 pending approval.**
Goal: every vertical gap has exactly **one owner**. No gap is ever the sum of
one element's padding + another's margin + line-height leading.

---

## Rule 1 — Padding (APPROVED: 16px)

Vertical padding exists **only** on bordered/tappable line items — because
padding is what makes the full row tappable and holds the hairline away from
the text. Everywhere else, vertical padding is 0.

| Token | Value | Applies to |
|---|---|---|
| `--pad-row` | **16px 0** | Every primary line item: `.arow .rrow .grow .estrow .rres .payrow .lrow .dqrow .doc .brief .reqmini .est-res .ap-card .gpass .chg .kv .urow .sentry .rstep .toggle-line .ob-orow .am-r .pastlink .calm .sday-empty .drow-head` |
| `--pad-subitem` | **8px 0** | Nested sub-items inside an expanded row: `.nt-si`, `.drow-opt` |
| — | **0** | Everything else: titles, headers, eyebrows, tabs, labels, sections, figures. Their gaps come from the container (Rule 2). |

**Deviants to migrate to 16** (currently off-standard):
`.grow` 20 · `.rrow` 20 · `.arow` 20 · `.urow` 14 · `.sentry` 14 · `.rstep` 14 ·
`.sday-tail` 24/8 · `.dr-search` 10 · `.nt-si` 10→8

**Knock-on effects to re-balance in the same pass** (gaps that were tuned
assuming a 20px row pad — each owning margin gains +4 to keep the approved
visual total):
- Schedule between-days total 40 = row pad 20 + `.sday` margin 20 → becomes **16 + 24**
- Desk “View notice → Sign out” 40 = pad 20 + margin 20 → becomes **16 + 24**
- Any “tab rail → first row” relationship measured visually at rail + pad.

No exceptions without a note here. If a row needs to *look* airier, the extra
space comes from its container gap, never from fattening its padding.

---

## Rule 2 — Container-owned gaps (PENDING)

Elements carry **no vertical margins**. The parent declares the rhythm once:

```css
.stack-page    > * + * { margin-top: var(--gap-page) }
.stack-section > * + * { margin-top: var(--gap-section) }
```

One owner per gap → changing a rhythm is one edit, and it applies everywhere
that relationship exists. Kills all `.x + .y{margin-top:…}` one-offs.

## Rule 3 — Semantic scale (PENDING)

| Token | Value | Relationship |
|---|---|---|
| `--gap-page` | 40 | page title block → first content |
| `--gap-section` | 32 | section → section |
| `--gap-rail` | 20 | tab rail / count bar → next element (standardized 2026-07-10) |
| `--gap-group` | 20 | group label rhythm |
| `--gap-tight` | 12 | label → its field; count bar → list |
| `--gap-micro` | 4–8 | icon↔label (4), title↔subline (4), meta rows (8) |

All values are 4px-grid. No raw pixel margins outside these tokens.

## Rule 4 — No display leading (PENDING)

Serif display text (page titles, day labels, row titles ≥16px) gets
`line-height: 1` (or 1.15 for multiline), so the measured box gap **is** the
visual gap. Body/description text keeps its reading line-height (~1.5).

---

## Migration plan (when approved)

1. Land tokens + this doc (no visual change).
2. Convert **Schedule** first as the proof, run the audit, get sign-off.
3. Sweep remaining screens one at a time, audit after each.

## Audit

A dev-only script walks each screen and prints actual vs. standard for every
rail→content, section→section, label→row gap. Run after any spacing change;
review the diff instead of eyeballing screenshots.
