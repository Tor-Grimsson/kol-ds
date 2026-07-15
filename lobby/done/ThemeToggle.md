---
component: ThemeToggle
source: kol-monorepo/apps/web/src/workshop-system/shell/ThemeToggle.jsx#L1-L102
date: 2026-07-10
status: draft
deps: [Icon]
---

# ThemeToggle

## Purpose
Self-contained light/dark theme toggle. An icon-swap button whose animation slides a pair of
`mode-toggle-01` / `mode-toggle-02` icons horizontally to produce a visible light↔dark flip. Used in
the top nav (icon variant) and sidenav rows (hop variants).

## Anatomy
```
button (aria-label "Switch to <next> mode")
└─ iconSwap span            — position:relative, overflow:hidden, fixed W/H = size
   └─ slider span           — width = size*2, translateX flips on state, transition 500ms
      ├─ <Icon name="mode-toggle-01" size />   — state A
      └─ <Icon name="mode-toggle-02" size />   — state B
hop / hop-bare variants add a trailing label span (kol-sidenav-hop-label): "Dark mode" / "Light mode"
```

## Variants
- **icon** (default) — minimal 32×32 icon-only button, no container chrome; inline size 18. For top-bar.
- **hop** — full-width labeled sidenav row styled as `kol-btn kol-btn-primary`; inline size 16.
- **hop-bare** — same shape/padding as hop but fully transparent (no rest/hover bg); plain text+icon.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| variant | `'icon' \| 'hop' \| 'hop-bare'` | `'icon'` | chrome + layout |
| className | string | `''` | extra classes on the button |

## Styling
- **icon:** `inline-flex items-center justify-center w-8 h-8 p-0 bg-transparent border-0 cursor-pointer text-emphasis hover:opacity-80 transition-opacity duration-300`
- **hop:** `kol-btn kol-btn-primary kol-btn-md kol-mono-14 w-full justify-start gap-2`
- **hop-bare:** `w-full inline-flex items-center justify-start gap-2 py-1.5 px-6 kol-mono-14 bg-transparent text-emphasis transition-colors`
- **label:** `kol-sidenav-hop-label flex-1 min-w-0 text-left`
- **slider:** inline `width: size*2`, `transform: isDark ? translateX(0) : translateX(-size)`, `transition-transform duration-500 ease-in-out`
- **Icons:** `mode-toggle-01` + `mode-toggle-02` from `@kolkrabbi/kol-icons` (V1 set, `kol-icon-set-v1/tools/`, currentColor).
- **DROP on recreation:** the localStorage read/write (`theme` key), the `document.documentElement` `data-theme` + `.dark` writes, and `getInitialTheme()` — all app-coupling. The `.dark` class write is a monorepo-specific concession (its remap is `:is([data-theme=dark], .dark)`); the DS should drive `data-theme` only.

## States & interactions
- **rest / hover:** icon variant fades to `opacity-80` on hover; hop uses the button's own hover.
- **toggle:** on click, `setTheme(next)` → slider `translateX` animates the icon swap (500ms).
- **focus:** inherits button focus; DS recreation should add a visible focus ring.

## Dependencies
- `Icon` (from the DS icon loader) — the only DS dependency.
- Consumer-only to replace: theme persistence + `<html>` attribute writes (app concern).

## Recreation notes
- Tier: **molecule**.
- **Reconcile with `ShellHeader`'s `ThemeToggleButton`** (the INDEX flags ShellHeader "compose ThemeToggleButton") — this is likely that button; converge, don't double-build.
- Decide controlled vs self-contained: expose `theme` + `onToggle` props (controlled) so the app owns
  persistence, OR keep an optional self-contained mode. Prefer controlled for the DS.
- `size` should be a prop (currently 18 for icon, 16 for hop).
- Labels ("Dark mode"/"Light mode") authored at the call site — no auto text-transform.
- Icons passed by name; keep the two-icon slide as the signature animation.
