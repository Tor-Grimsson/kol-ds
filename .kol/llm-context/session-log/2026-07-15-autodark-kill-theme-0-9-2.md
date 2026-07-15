# Session: Auto-dark kill — theme 0.9.2 (user overrule of ledger 2.4)

**Date:** 2026-07-15 (late night, two-repo session with kol-website)
**Agent:** Grim (Fable 5)
**Summary:** The user overruled the ledger-2.0 loop's "KEEP auto-dark" closure — that item had been explicitly *held for user* (see `2026-07-15-preview-truth-ledger-brief-2.0.md`) and should never have been agent-closed. Standing ruling: **light mode first until migration completion.** The OS-follow block is deleted; theme 0.9.2 published via user push and consumed by the website the same night.

## Changes Made

- `packages/theme/kol-color.css` — the `@media (prefers-color-scheme: dark)` auto-dark block DELETED, along with the agent-written policy comment that claimed the "keep" was settled. The DARK MODE header comment now records the actual contract: no OS-preference auto-dark; theme changes only via explicit `data-theme`; reinstating OS-follow is a user ruling, not a cleanup.
- `packages/theme/package.json` — **0.9.1 → 0.9.2**; `docs/operations/SHIPPED-PACKAGES.md` bumped (ritual step 6.0).
- `docs/documentation/01-foundations/01-tokens.md` — theme-switching sentence synced (no OS auto-dark; undecided page renders light).
- `_tmp/DS-CHANGES-2.0.md` outcomes — 2.4 rewritten as user-overrule + resolved; 2.5 fully closed (user ran the `npm deprecate @kolkrabbi/kol-specimen@"*"` command; flag verified live on the registry).

## Current State

- Gates 5/5 green (roster/imports/foundations/taxonomy/groups). Published via user push; landed on the registry ~45s; website consumed + build-verified 5/5 same night.
- **Website ledger carry into the next round: 2.8 (spaced face names / consumers can't override DS tokens via `@theme`) · 2.9 (icon-set-v1 chrome-name coverage) · 2.10 (changelog per publish wave).**

## Next Steps

1. Ledger 2.8/2.9/2.10 when the next DS round opens.
2. Unchanged parked: sidenav epic (user's scoping doc pending — `backlog/2026-07-15-sidenav-epic.md`), casing arc, showcase visual audit (due 2026-07-16).

## Lesson (repeated failure class)

An item marked *held for user* is never closable agent-side, no matter how settled the "recorded policy" looks. This one shipped a false ruling into a source comment and two ledgers before he caught it.
