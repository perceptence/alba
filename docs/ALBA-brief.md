# ALBA — Product Brief

*Source of truth for what ALBA is and isn't. Distilled from the product
design conversation. Read before designing or changing UI.*

**One line:** A quiet-luxury **resident app** for ultra-high-end residences —
a resident makes white-glove **concierge** requests to their estate management
team, and everything (rent, notices, the residence itself) is presented with
private-client calm.

---

## What ALBA IS

- **Luxury real estate.** The market is multimillion-dollar residences with rent
  in the **$10k–$18k+/month** range. Every choice should belong to that world.
- **Concierge, not tickets.** Residents don't "report an issue" — they make a
  service request to a *named* estate manager (Rosa Ibáñez) who replies
  personally. White-glove, private-client desk.
- **A resident ↔ estate-management relationship.** Current surfaces: Home, Rent,
  Concierge (requests), Notices, Residence detail, Profile/Account.
- **Ambient AI, not a chatbot.** Free-text requests get quietly triaged,
  classified, and drafted (the "concierge scan"); the human approves. AI turns
  inbound chaos into structured objects.
- **Funding-ready.** Being taken to an investor road show. Bar = staff/principal
  designer, pitch-grade polish.

## What ALBA is NOT

- **Not** a generic property-management / operations tool. No Buildium / Yardi /
  AppFolio enterprise-dashboard energy; no Bootstrap or Material conventions. If
  it looks like an admin panel, it's wrong — *"no one will install it."*
- **Not** ticket / helpdesk language or UI.
- **Not** a colored wireframe. Flat + static = failure. It must feel alive.
- **Not** the field-tech / vendor / in-app-assignment side — **dropped for now**,
  handled manually/externally by the property company. (May return later.)
- **Not** overlapping with prior projects (e.g. Veriqo / Verdure). Clean-room.
- **Not** the generic AI **"cream + serif + terracotta"** template — that look is
  now an AI-default tell. ALBA's warm-paper palette must read as deliberate and
  distinctive, never templated.
- **No** gauges, gradients, or neon.

## Users / lenses

- **Resident** (e.g. Adrien Léon · The Verde Bungalow · Bel-Air) — the app we're
  building now.
- **Estate management / owner** — receives requests. Management console is
  future/adjacent scope; the resident app is the current build.
- **Estate manager (Rosa Ibáñez)** — the human concierge relationship.

## Visual system — "quiet luxury"

Encoded in the app's CSS (`app/alba.css`); summary:

- **Ground:** alabaster / warm paper. **Ink:** warm near-black. **Accent:** a
  single **clay** terracotta, used sparingly. **Positive:** sage.
- **Type:** Fraunces (light) for display + numbers; Inter for body; tabular nums
  for money & IDs.
- **Editorial hairlines, not cards.** Architectural line-art (the residence
  elevation) as the signature image.
- **4px grid**, rhythm tokens (`--sp-1..7`), two tracking tiers (`--tk-page`
  .2em eyebrows, `--tk-label` .16em labels).
- **Inline status** (colored words), never dots or pills.
- Progressive disclosure; context-aware actions.

## Motion philosophy

- Motion is a **deliverable, not a garnish** — but ALBA's register is
  **restrained and unhurried**, not cinematic or flashy. Alive, calm, editorial.
- Craft touchstones (expressed quietly for ALBA): staggered entrances, shared-
  element card→detail morphs, streaming AI scan, skeleton→reveal, spring toasts.
- **Always** gate on `prefers-reduced-motion`.

## Working standards

- Verify before sharing: clean build + every screen renders without runtime
  crashes.
- Systematic design system over per-screen values — change once at the token.

## Lineage (context, do not reuse the earlier looks)

**Estate** (operational, rejected as a wireframe) → **Maison** (obsidian +
champagne-gold dark glass) → **ALBA** (light quiet-luxury: alabaster + clay +
Fraunces). Keep the concierge / luxury thesis; the current aesthetic is the
**light editorial** system in the code — *not* the dark Maison palette.
