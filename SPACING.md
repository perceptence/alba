# ALBA — Vertical Spacing Standard

Status: **APPROVED — all rules. 2026-07-10.**
Goal: every vertical gap has exactly **one owner**. No gap is ever the sum of
one element's padding + another's margin + line-height leading.

**Doctrine:** the guideline is the source of truth. Legacy hand-tuned totals are
NOT preserved with compensating margins — everything re-bases onto the tokens.
If a gap looks wrong afterwards, we change a token or a token assignment, never
a one-off pixel value.

---

## Rule 1 — Padding (16px)

Vertical padding exists **only** on bordered/tappable line items — padding is
what makes the full row tappable and holds the hairline away from the text.
Everywhere else, vertical padding is 0 (page-top inset belongs to the page
container `.pc`, not to titles/back rows).

| Token | Value | Applies to |
|---|---|---|
| `--pad-row` | **16px** | Every line item: arow rrow grow estrow rres payrow lrow dqrow doc brief reqmini est-res ap-card gpass chg kv urow sentry rstep toggle-line ob-orow am-r pastlink calm sday-empty sday-tail drow-head dr-search |
| `--pad-sub` | **8px** | Nested sub-items: nt-si, drow-opt |
| — | **0** | Everything else: titles, headers, eyebrows, tabs, labels, sections, figures |

### Boundary refinements (the seams a bulk sweep misses)

- **Section→section has ONE owner.** A section's last line-item drops its bottom
  padding (`.sect > .row:last-child{padding-bottom:0}`) so the 32px section
  margin is the sole owner — not row-pad 16 + margin 32 = 48.
- **Tertiary CTA placement:** one *inside* a section (its last child, e.g. a
  TextLink) uses the tight in-section gap (`--gap-group` 20); one *after* a whole
  section (a sibling, e.g. the visit flyout's "Open the estate") crosses a
  boundary → `--gap-section` (32).
- **Heading → hairline = `--gap-tight` (12)** for every heading type (sect-h,
  sday-h, nt-g, mgr-grp) — see the scale table.

## Rule 2 — Container-owned gaps

Elements carry no vertical margins of their own volition; the relationship
(container/context) declares the rhythm via a token. No `.x + .y{margin-top:…}`
one-offs outside this file's table.

## Rule 3 — Semantic scale (all 4px-grid)

| Token | Value | Relationship |
|---|---|---|
| `--gap-page` | 32 | page title → its first element — **always**, content block OR control (tabs / composer). No two-tier. (Same value as `--gap-section`; kept a separate token for its distinct meaning.) |
| `--gap-section` | 32 | section → section; end-of-page action |
| `--gap-rail` | 20 | tab rail / count bar → adjacent content (both sides) |
| `--gap-group` | 20 | group label rhythm; day blocks; label blocks (flab) |
| `--gap-tight` | 12 | label → its field/content; title → address lines; **any heading → the hairline/row beneath it** (sect-h, sday-h, nt-g, mgr-grp all share this) |
| `--gap-micro` | 4/8 | icon↔label (4), title↔subline (4), meta (8) |

Sheets: header → body content = 24 total (head's 20 pad + 4 body inset).

## Rule 4 — No display leading

Single-line display text (names, row titles, day labels, page titles) gets
`line-height:1`; wrappable titles 1.15. Body/description text keeps ~1.5.
Measured box gap = visual gap.

---

## Exclusions

(none — onboarding migrated 2026-07-11.)

Onboarding (`.ob-*`) is now on the tokens. Per-step rhythm: `--gap-section` (32)
at the top nav → hero and the section breaks (sign-off rule, residence divider);
`--gap-group` (20) hero → eyebrow, and the content blocks (pill, OTP, quote,
Rosa, orient list); the title block runs eyebrow → heading `--sp-2` (8, matches
`.phead`) → paragraph `--gap-tight` (12); heading → spec line (`facts`) `--sp-2`
(8); CTA → resend `--gap-tight` (12). Orient rows use `--pad-row` with the first
dropping its top padding. CTA stays bottom-anchored (`margin-top:auto`).

Home hero (`.respanel`): greeting → residence illustration is a deliberate
**24px**, tighter than the global title→first (`--gap-page` 32). A sanctioned
one-off for the hero's intimacy — not drift.

## Verifying

`scripts/spacing-audit.js` — paste/run in the console (or via CDP); it reports
row paddings and key rhythm gaps vs. the tokens on the current screen.
