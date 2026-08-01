# 🏁 Milestone: the content pipeline

**Date:** 2026-07-31
**Agent:** Grim (Opus 5)
**Arc:** the showcase's content wiring — seven roots, no name, no document — becomes one described, gated system.
**Delivered:** `docs/operations/04-content-pipeline/` (7 docs, one generated from the real sources) + the five-phase build behind it. `showcase/src/nav/` is the manifest. `docs/` is a human vault again: 270 markdown files → 54.

## What closed

- **The width arc** (`--kol-content-canvas`, `--kol-pad-chrome-x`) → **done.** The shell frame was capped on the wrong element, dragging both rails inward; the cap moved to `MainColumn` and onto the rung that can actually fire. Header and content frame stopped disagreeing about their inset. `--kol-sidenav-w` corrected to the rail width every grid track already used.
- **"Where does 1400 come from?"** → **resolved.** Nowhere defensible. Answered properly by reading `docs/documentation/01-foundations/` — which said a 1400 tier had been deliberately killed. `canvas` is a *content kind*, not the old `page` identity tier, and the rules table says so in writing.
- **The `07-usage` question — is that folder active?** → **closed.** Yes, and wrongly so. Both generators now emit to `showcase/src/usage/components/`; the `OFF_TREE` stopgap is deleted rather than kept.
- **"Foundations as a category" — the 2026-07-30 mislabel** → **closed.** It is chapter 01 of Documentation and always was; the folder said so. `foundations` and `icons` left `ALL_ROUTES`, the gate keys per chapter, the rail says Documentation.
- **Live pages vs markdown — which is the chapter?** → **closed by user ruling:** a page is a slot, the renderer is a property of the page. `nav/chapter-pages.js` holds the map, shared with the generator so the two cannot drift.
- **Operations had no gate key** (its chapters fell through Documentation's wildcard) → **fixed this turn.** Its own key, its own four chapters.
- **E1b missing from the conventions gate table** → **fixed this turn.**
- **Docs discovery — agents boot with history and no laws** → **parked, filed:** `~/.dotfiles/lobby/agent-init-docs-index.md`. One sentence in two `SKILL.md` files; the user owns dotfiles.
- **The colour-picker arc** → untouched, still frozen at `session-bridge/handoff-2026-07-30-1528-FROZEN-color-picker.md`.

## The arc (brief)

Started as a width complaint and became a structural one: the sidebar called a chapter a category, which made the one-at-a-time quarantine port read as wrong. Tracing that back found the real gap — `docs/` was simultaneously the user's reading material and the app's database, and nothing said so.

The method that worked, twice: **the rule already existed.** The width law was in the theme's own comment; the killed 1400 tier was in `04-layout-breakpoints.md`; the rail width was in `04-kol-ds-rules.md`. Every wrong proposal this session came from grepping source instead of reading `docs/`.

Two gates were written because of it — `validate-vault-links` (17 dead wikilinks on first run) and `validate-reachable` E1b (written in the same change that opened the hole). Both negative-tested. Twelve gates now, clean at the close of every phase, production build green throughout.

Spans: `playbook/2026-07-31-content-pipeline.md` · `session-log/2026-07-30-gates-first-recovery-and-rulings.md` · `session-bridge/handoff-2026-07-31-0112-quarantine-phase-1.md`.
