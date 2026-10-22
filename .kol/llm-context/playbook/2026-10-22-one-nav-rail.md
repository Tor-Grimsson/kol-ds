# Playbook — One nav rail

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** build `plan-2026-10-22-one-nav-rail.md`, ticket kol-website, update docs and apps/*, then /log-work.

**Standing rules (non-negotiable):**
- Site variant ports SideNav class-for-class; brand's padding does not move.
- Every behaviour change is opt-in; a consumer passing nothing renders as before.
- No publish without the user's yes.

[19:08] · start · plan-2026-10-22-one-nav-rail.md
  what → goal set, T1–T7

[19:17] · W2 · packages/shell/src/NavRail.jsx
  what → folder note: a section with `to` opens its page from icon + label; chevron folds/enters
  what → label-only sub rows start on L1's label column (pl-11, was 18px)
  verify → preview: label x 52 = sub x 52 · label → /docs · chevron folds ✓

[19:17] · W3.1 · packages/theme/kol-components-shell.css
  what → `--kol-shell-rail-open` 264 · 320 from 1536; NavRail + rack-hub fork read it
  before → --kol-sidenav-w (kol-framework.css only)   after → --kol-shell-rail-open
  verify → open width 320 at 1600 wide ✓

[19:17] · W3.2 · packages/theme/kol-components-atoms.css
  what → active hop icon var(--kol-sidenav-active-icon, surface-on-primary)
  before → accent-primary   after → ink

[19:17] · tickets · kol-website lobby
  what → brand-sidenav-drop-overrides filed + outbox + both ledgers

[19:17] · W1 · —
  note → host package needs a ruling: every host contradicts ARCHITECTURE §3

[19:32] · W1 · packages/component/src/organisms/NavRail.jsx · NavRailSite.jsx
  what → NavRail + Logomark + railSlot moved to kol-component; site variant = SideNav class-for-class; SideNav is the alias
  verify → apps/brand routes without reload, ink active icon; NavRail · SideNav · AppHub previews ✓

──────────── MILESTONE: one nav rail ──────────── [19:32]
  published: theme 0.179.0 · component 0.283.0 · shell 0.73.0 · framework 0.52.0
  log: session-log/2026-10-22-one-nav-rail.md
