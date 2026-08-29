---
component: ControlToneInverse
source: kol-website/apps/brand/src/pages/IconsGallery.jsx (trailingActions) + the ContentFilters search field
staged: 2026-08-27
status: draft
deps: [ViewToggle, Dropdown, Input, kol-theme]
---

# ControlToneInverse — `tone="inverse"` on ViewToggle (icon) · Dropdown · Input

Brand's `/icons` page (the app-tier catalog pattern) sits on a `pageWash` of
`fg-04` over `surface-primary` — the same wash model as `AppShell`. On that
plane the icon `ViewToggle`'s default well (`bg-surface-secondary`, active chip
`bg-fg-absolute-24`) reads as a second grey plate sitting on a grey plane. The
user's ask, verbatim: *"can we make a flipped version of this color scheme?
where the darker is background and grey is the active? it would fit better on
the light grey"* — and then: *"that would also need to be a variant for the
dropdown and the input."*

## The ask

One `tone` prop across the three controls that share a header row:

| control | default | `tone="inverse"` |
|---|---|---|
| `ViewToggle variant="icon"` — the well | `bg-surface-secondary` | `bg-fg-absolute-24` |
| — the active chip | `bg-fg-absolute-24` | `bg-surface-tertiary` — one rung lighter than the well was (user: "the active grey can be lighter") |
| — inactive hover | `hover:bg-fg-absolute-08` | the DS's call (a darker well wants a lighter hover) |
| `Dropdown` — trigger + the fused panel | `kol-btn-primary` fill | the same dark chip; the panel continues it, hairline divider as today |
| `Input` (and `ContentFilters`' search field) | as shipped | the same dark chip as its field |

The two ViewToggle values are literally swapped — that is the whole flip, and
it is what brand carries locally today. Dropdown and Input have no local
carry: a fork of a fused trigger/panel or of a field inside `ContentFilters` is
exactly what a ticket exists to avoid, so those two wait for the bump.

## Where it is carried meanwhile

`apps/brand/src/styles/icons-toggle-inverse.css` — two rules under an
`.icons-toggle-inverse` wrapper around the two wells. Deleted on the bump.

## Definition of done

- [ ] `tone="inverse"` on `ViewToggle` (icon variant), `Dropdown`, `Input`; default `tone` unchanged everywhere
- [ ] `ContentFilters` forwards a `tone` to its search field (or takes `inputProps`) so a page can set the row in one place
- [ ] rendered side by side with the default on a `fg-04` wash in the showcase

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.117.0 · kol-theme 0.78.0

`tone="inverse"` on `ViewToggle` (icon) · `Dropdown` · `Input` · `SearchInput`, and `ContentFilters tone` forwarded to its search field: the control takes the dark chip (`fg-absolute-24`), the active chip the lighter grey (`surface-tertiary` — your "the active grey can be lighter"), the inactive hover an absolute-white wash, the Dropdown panel continuing its trigger. Rules in kol-theme (`.kol-tone-inverse`), defaults unchanged everywhere; shown beside the default on an fg-04 wash in the showcase ViewToggle demo. 21 gates clean; verified in source only.

**Remainder here:** none — kol-website: bump kol-component 0.117.0 · kol-theme 0.78.0; `tone="inverse"` on the `/icons` ViewToggle, Dropdown and Input (or `tone` on the ContentFilters row); delete `apps/brand/src/styles/icons-toggle-inverse.css` and the `icons-toggle-inverse` wrapper.

**Addendum — 2026-08-27 · kol-theme 0.78.1:** the active chip is `--kol-fg-16`, not `surface-tertiary` — the user's ruling on the live page ("just use bg-fg-16"). Theme patch only; kol-website's one local rule dies on the bump.
