# AppShell: paint the content surface `surface-tertiary`, rail stays `surface-primary` — the split BrandLayout ships and the package fork dropped

**Staged:** 2026-08-26 · from a kol-studio session
**Change:** kol-framework — `src/AppShell.jsx`, one className on the layout (or the content column); no CSS, no tokens

---

## The problem, in one case

kol-studio on `@kolkrabbi/kol-framework` 0.24.0 renders the whole viewport `surface-primary`: the rail (`SideNav` paints `bg-surface-primary` itself) and the page behind it are the same colour, so the rail reads as a slab with a hairline, not as a rail against a page. The user's ruling, pointing at brand.kolkrabbi.io: **sidenav primary, site tertiary, like brand.**

Brand gets it from its own shell — `kol-website/apps/brand/src/components/framework/BrandLayout.jsx` L72:

```jsx
<div className="kol-brand-layout bg-surface-tertiary min-h-dvh" …>
```

with the comment at L65 calling tertiary "the MAIN surface". The package `AppShell` is that component's fork (folded 2026-08-09) and renders `<div className="kol-brand-layout">` with no surface at all — the page falls through to `kol-framework.css` `html, body { background: var(--kol-surface-primary) }`. So every AppShell consumer gets the flat look, and brand — the reference — is the one app that doesn't use AppShell.

kol-studio carries `html, body { background: var(--kol-surface-tertiary) }` in its own `index.css` until this lands.

## The fix

`AppShell.jsx`: `className="kol-brand-layout bg-surface-tertiary min-h-dvh"` — the BrandLayout line, verbatim. The rail keeps painting its own `bg-surface-primary` (SideNav, unchanged), the hamburger already does. Nothing else moves: the TOC rail and the content column inherit the layout's surface.

If a consumer needs the flat look back, that is a prop (`surface="primary"`) — but no consumer has asked; don't build it speculatively.

## Rejected alternative

- **Leave it to the consumer** (`body { background: tertiary }` in each app) — every AppShell app re-discovers the brand split one at a time, and `kol-framework.css`'s `html, body { primary }` keeps saying the opposite of what the reference app does.
- **Change `kol-framework.css` html/body to tertiary** — paints outside the shell too (kiosk routes, standalone pages) and is a theme-level change for a shell-level fact; the layout element is where BrandLayout puts it.

## Definition of done

- [ ] `<AppShell>` renders `.kol-brand-layout` with `bg-surface-tertiary min-h-dvh`; rail still `bg-surface-primary`
- [ ] Showcase: computed background of `.kol-brand-layout` = `--kol-surface-tertiary`, of `.kol-sidenav` = `--kol-surface-primary`, both themes
- [ ] kol-framework version cited; kol-studio bumps and deletes its `html, body` rule (📌 remainder there)

## ✅ RESOLUTION — 2026-08-26 · kol-framework@0.27.0

`AppShell` renders `.kol-brand-layout` with `bg-surface-tertiary min-h-dvh` — BrandLayout's own line, verbatim — and the rail keeps its `bg-surface-primary`. Measured on the workbench AppShell story, both themes: light → layout `#ffffff` (= `--kol-surface-tertiary`), rail `#fafafa` (= `--kol-surface-primary`); dark → layout `#0e0e11`, rail `#121215`. Default flip flagged BREAKING; no prop for the flat look — nobody asked.

**Remainder here:** none — kol-studio bump kol-framework 0.27.0 and delete the `html, body { background: var(--kol-surface-tertiary) }` rule in index.css.

