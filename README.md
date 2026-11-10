# ALBA

**A resident app for residences where "submit a ticket" would be an insult.**

Rent in the $10k–$18k+/month range buys a named estate manager, not a helpdesk
queue. ALBA is the resident side of that relationship — concierge requests to
Rosa Ibáñez, who replies personally, with rent, notices and the residence
itself presented at private-client register.

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # 57 tests across 6 files
```

| Route | What it is |
|---|---|
| `/` | The resident app — Home, Rent, Concierge, Notices, Residence, Account |
| `/case-study` | How it was designed, including the direction that got killed |
| `/design-system` | Tokens and components, rendered |

---

## What it is not

The brief spends as much room on exclusions as on features, because this is a
category where the defaults are all wrong:

- **Not a property-management tool.** No Buildium / Yardi / AppFolio dashboard
  energy, no Bootstrap or Material conventions. If it reads as an admin panel
  it has failed — *"no one will install it."*
- **Not ticket or helpdesk language.** A resident does not "report an issue."
  They make a request, to a person, who answers.
- **Not a coloured wireframe.** Flat and static counts as failure. It has to
  feel alive.
- **Not the vendor or field-tech side.** Deliberately dropped; the property
  company handles that off-app.

## How it is built

**One owner per gap.** Vertical rhythm is a standard, not a habit — see
[SPACING.md](SPACING.md). No gap is ever the accidental sum of one element's
padding, another's margin and a line-height. Hand-tuned legacy totals were not
preserved with compensating margins; everything re-bases onto the tokens.

**Motion is a deliverable, not a garnish** — but the register is restrained,
not cinematic. Staggered entrances, card-to-detail morphs, skeleton-to-reveal,
spring toasts, all expressed quietly. Every one of them gates on
`prefers-reduced-motion`.

```
app/           routes
screens/       the resident surfaces
components/    shared UI
lib/           data model and helpers
tests/         vitest
docs/          the brief the UI is answerable to
```

## Docs

- [docs/ALBA-brief.md](docs/ALBA-brief.md) — what ALBA is, what it is not, and
  the locked visual direction
- [SPACING.md](SPACING.md) — the vertical spacing standard
- [AGENTS.md](AGENTS.md) — working standards

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Vitest
