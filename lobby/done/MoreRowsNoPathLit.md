---
component: MoreRowsNoPathLit
source: kol-shell/src/MoreSheet.jsx#L66 (kol-shell 0.99.0), seen in kol-atlas/apps/workspace/src/components/Home.jsx
staged: 2026-11-01
status: draft
deps: [MoreRows, AppFloatNav, HubHome]
---

# MoreRowsNoPathLit

## Purpose
Bug: in a More menu, every row without a `path` renders as the current page (lit fill), so all rows look selected.

## Anatomy
`MoreRows` → `Button variant="nav"` per item, `aria-current={i.path === active ? 'page' : undefined}`. `active` comes from `activePath(items, currentPath)`, which is `undefined` when no item matches.

## Variants
None.

## Props
No change.

## Styling
None — the lit look is the nav Button's `aria-current` style.

## States & interactions
Repro: HubHome `chromes` / `dockMore` rows as `{ icon, label, onPress }` (no `path`) → open the dock's ··· → all rows lit. `undefined === undefined` is true.

## Dependencies
kol-shell MoreSheet (MoreRows), AppFloatNav.

## Recreation notes
Guard the match: `i.path != null && i.path === active`. kol-atlas works around it by passing each row its path.

**Return to:** kol-atlas `lobby/outbox/MoreRowsNoPathLit.md`.

## ✅ RESOLUTION — 2026-11-01

Shipped in **@kolkrabbi/kol-shell 0.99.1**. `MoreRows` (MoreSheet.jsx:66) and AppFloatNav's More-lit check (AppFloatNav.jsx:150) now require `i.path != null` before matching `active`. HubHome routes through MoreRows, so it is covered. kol-atlas can drop its per-row path workaround after bumping.
