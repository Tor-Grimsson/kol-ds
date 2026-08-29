# ContentMediaFocusBinding — the media anchor is the fit's, not the consumer's

**Staged:** 2026-08-27 · from **kol-monitor** (user ruling, seen on the catalog cards after `CatalogPageMonitorParity` landed)
**Change:** kol-component `ContentMedia` + kol-theme `.kol-media-zoom` — read one consumer-bindable token for the image anchor

## The problem, in one case

The anchor of a card's image — where it is pinned for the fit, and from where
the hover zoom grows — is hardcoded in two places, with no consumer seam:

- `ContentMedia.jsx` `FIT.natural` / `FIT.compact` carry `[&>img]:origin-top-left`
  (utilities layer → `transform-origin: 0 0`).
- `kol-components-molecules.css` `.kol-media-zoom > img { transform-origin: center }`
  (components layer — the utility beats it, so a `natural` / `compact` card zooms
  from the top-left; a `cover` card zooms from the centre).

The fit (the `scale` property) and the zoom (`transform: scale(1.06)`) share
`transform-origin`, so the anchor is ONE value per image — and today the fit
decides it. Monitor's rack previews are pinned top-left only because `natural`
/ `compact` happen to say so. The user's ruling (2026-08-27): **the focus is a
per-repo setting** — bound in the consumer's overrides the way
`--kol-accent-primary` is, not a value the fit dictates:

> "just make it so that the focus can be set per repo, bc it need to be like we
> set it here"

A consumer can brute-force it today with an unlayered `.kol-card img {
transform-origin: … }` — that is a hack against the DS, not a binding.

## The fix

One token, `--kol-media-focus`, read wherever `transform-origin` is set on the
media child:

- `ContentMedia` fits: `transform-origin: var(--kol-media-focus, top left)` for
  `natural` / `compact` (Tailwind `[&>img]:origin-[var(--kol-media-focus,top_left)]`
  or a theme rule — the DS's call).
- `.kol-media-zoom > img` / `> video`: `transform-origin: var(--kol-media-focus, center)`.

Unset, everything renders exactly as today (top-left fits, centred cover zoom).
Bound once on a consumer's `:root`, every card's image pins there and zooms from
there. Monitor binds `top left` in `monitor-overrides.css`.

## Rejected alternative

A `focus` prop on `ContentMedia` / `ContentCard`, threaded through `toCard` —
per card, not per repo. The user asked for the repo-level binding; a per-card
prop can come later if one catalog ever mixes anchors, and it would default to
the token.

## Definition of done

- kol-component + kol-theme published; `--kol-media-focus` unset → no visual
  change anywhere (the defaults are today's values).
- The token documented beside the other consumer bindings.
- Remainder for kol-monitor: bump, bind `--kol-media-focus: top left` on `:root`
  in `monitor-overrides.css`. No carry to delete.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.111.0 · kol-theme 0.73.0

One token, `--kol-media-focus`: `ContentMedia`'s `natural` / `compact` fits read `transform-origin: var(--kol-media-focus, top left)`, `.kol-media-zoom > img / > video` reads `var(--kol-media-focus, center)` — bound once on a `:root`, the fit and the zoom pin there. Unset = today's anchors. Documented in `01-tokens.md § Media focus` beside the other consumer bindings. 21 gates clean; verified in source only (no server run, by your rule).

**Remainder here:** none — kol-monitor: bump kol-component 0.111.0 · kol-theme 0.73.0; bind `--kol-media-focus: top left` on `:root` in `monitor-overrides.css`. No carry to delete.
