---
title: Tokens
type: reference
status: active
created: 2026-07-29
updated: 2026-11-22
description: The token foundation under every KOL component
aliases:
  - foundations
  - tokens
sources:
  - packages/theme/kol-opacity.css
  - packages/theme/kol-color.css
  - packages/theme/kol-design-tokens.css
  - showcase/src/lib/tokens.js
tags:
  - domain/tokens
  - domain/color
related:
  - "[[02-color|color]]"
  - "[[03-typography|typography]]"
  - "[[04-layout-breakpoints|layout & breakpoints]]"
  - "[[08-motion|motion]]"
---

# Foundations — the token system

KOL's foundation is **translucent ink over surfaces**, not flat fg/bg pairs. Everything below renders live on the showcase's `/foundations/tokens` page — that page reads the installed theme at runtime and is always the truth; this doc is the portable summary.

## Ink ladders

Moved to [[10-opacity|opacity — the lookup]] (2026-09-03): the twelve `fg-*` /
`oq-*` families, their stops, which flips which way, and the eight semantic ink
roles. They were the most-looked-up thing on this page and sat between the
content widths and the z-index scale; hue lives in [[02-color|color]], ink
weight lives there, and this page keeps the rest.

### Semantic surfaces sit on top

`--kol-surface-*` names *where* a color is used; the ladders name *what it is mixed from*. Reach for the surface token in a component rule; reach for a ladder when defining a new surface.

`--kol-surface-sunken` is the well, and it is **two declarations, deliberately** (user ruling 2026-08-30: *"I really only wanted that extreme for light"*):

| | token | value |
|---|---|---|
| light | `--kol-oq-ab-100` | `#ffffff` — the pole itself |
| dark | `--kol-oq-ab-96` | 10, under an 18 page |

Light takes the **pole** because a page wash moves the page 250 → 245 and the 96 rung is *also* 245 — the well and a washed page collided. At the pole no wash rung can reach it. Dark stays at 96: pure `#000` was a 23-level step, too deep, and dark never had the collision because its wash is a white film moving the page *away* from the well.

> ### In light, `sunken` is not sunken
>
> `#ffffff` (255) on a `#fafafa` (250) page is **five levels ABOVE it**. The
> token is raised in light and lowered in dark, and only the dark side means
> what the name says. Recorded, not hidden: the light value was chosen to dodge
> the wash collision, not because it reads as a well.
>
> **The cause is the base, not the token (user, 2026-09-03):** *"we have much
> more headroom in the darks than we do in the lights, or the perceived light.
> the base should have been much greyer."* The light page sits 5 levels off the
> ceiling, so there is nothing above it, and the steps below it are
> perceptually mushy near white — a near-black step of the same size reads,
> which is why dark's 18 → 10 works. A light base nearer `#f0f0f0`–`#ebebeb`
> would give both directions somewhere to go.
>
> Parked, not scheduled — it moves every surface in the system.

**Opaque neutrals (`--kol-oq-*`)** are the married solid mirror of the same 15 stops (`kol-opaque.css`) — ink mixed into the surface instead of into transparent, plus an `oq-inverse-*` twin. Since 2026-07-08 the rule is: **interactive fills (button/tag/switch states, anything that can sit over media) use `oq`; decoration that always sits on a panel (dividers, table washes) keeps `fg`.** `--kol-accent-primary-strong` is likewise an opaque accent mix now, not a transparency.

## Surface tiers

| Token | Dark | Light |
|---|---|---|
| `--kol-surface-primary` | `#121215` | `#FAFAFA` |
| `--kol-surface-secondary` | `#19191D` | — |
| `--kol-surface-tertiary` | `#0E0E11` | — |
| `--kol-surface-inverse` | `#FCFBF8` | `#0E0E11` |

**Every surface reads a base (theme ≥0.202.0).** The tiers hold no hex of their own: each points at one of the poles (`--kol-color-ab-white` · `-ab-black` · `--kol-color-white` · `-black`) or at the **neutral ramp**, the twelve greys the surfaces use, defined once in `kol-base-tokens.css` and named by HSL lightness ×10 — `--kol-neutral-980` (`#fafafa`) · `973` · `949` · `933` · `878` · `839` · `259` · `137` · `129` · `106` · `076` (`#121215`) · `045`. Theme-invariant; a theme picks which base a tier reads. The Figma library's `primitives` collection mirrors it, so its surfaces are aliases.

Each tier pairs with an `--kol-surface-on-*` ink. Theme switching is `data-theme` on `<html>` under the standing law **explicit choice > system/auto > light** (corrected 2026-07-28): a stamped `data-theme` or saved toggle choice wins; an un-stamped page follows `prefers-color-scheme` live via the `:root:not([data-theme])` mirror blocks in `kol-base-tokens.css`/`kol-theme.css`; light is the last-resort fallback. The same stamp on any **element** themes that subtree (theme ≥0.52.0): surfaces, fg ramp, roles, `oq` and borders all re-resolve on the stamped element; the **accent family deliberately does not** — `kol-brand-color.css` rebinds it at `:root`, so a nested pane keeps the app's accent. The showcase boots un-stamped (system-follow) unless a saved choice exists; ThemeToggle (framework ≥0.6.0) cycles light → dark → system.

## Theme variants

A theme variant re-points the color **bases** and the two font families and leaves every derived step to KOL's own formulas, so it is a mode of the color and type collections, not a second system. Four ship (plan-2026-11-18-kolbox-system W6, phase 8.2 and W15): `kolcore`, `kolbox`, `minimal` and `folio`. `kolcore` is KOL's default look under a name. Each is equal value for value to the library `theme` and `type` modes of the same name (`_tmp/2026-11-18-kolbox-system/themes.json`).

| `data-theme-variant` | Modes | Sets |
|---|---|---|
| `kolcore` | kolcore light, kolcore dark | nothing: every color and family is KOL's default, the same as no variant |
| `kolbox` | kolbox light, kolbox dark | the bases, status, palette, six pinned oq steps (08, 16, 24, 32, 48, 64) |
| `minimal` | minimal light, minimal dark | the bases, six pinned oq steps (08, 16, 24, 32, 48, 64) and status; light is the plain inverse of dark, with status darkened to the least that holds 4.5:1 on its white ground |
| `folio` | folio light, folio dark | the bases, `--kol-accent-tint` (folio's mint), two pinned oq steps (16, 64); status and palette stay KOL's |

| Stamp on `<html>` | Result |
|---|---|
| `data-theme-variant="<name>"` | its light, or its dark when the OS is dark |
| `data-theme-variant="<name>" data-theme="light"` | its light |
| `data-theme-variant="<name>" data-theme="dark"` | its dark |

**What a variant may set:** colors and the two families, `--kol-font-family-sans` and `--kol-font-family-mono` (`kol-typography.css`, `kol-typography-mono.css`), nothing else. No radius, spacing, size or layout: those are one value in every theme. A value equal to KOL's default is not set. Where a variant needs a step its bases cannot derive (a pinned oq step, a solid accent tint), it sets that variable directly. The float style's family, `--kol-font-family-float`, is not one of the two.

**A user theme** is a CSS file loaded after `kol-theme.css` that sets the same variables under its own `data-theme-variant` value, in the same three blocks as `kol-color.css`:

```css
[data-theme-variant="mine"]:is(:root, [data-theme="light"], .light) {
  --kol-surface-primary: #ffffff;  --kol-surface-on-primary: #111111;
  --kol-surface-secondary: #f4f4f4; --kol-surface-on-secondary: #111111;
  --kol-surface-inverse: #111111;  --kol-surface-on-inverse: #ffffff;
  --kol-accent-primary: #0055ff;   --kol-accent-on-primary: #ffffff;
}
[data-theme-variant="mine"]:is([data-theme="dark"], .dark) { /* the dark values */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme])[data-theme-variant="mine"] { /* the same dark values */ }
}
```

The two-attribute selectors outrank KOL's light and dark blocks, and the system mirror follows the OS only when no `data-theme` is stamped: explicit choice beats system beats light.

**Kolbox in detail.** It sets `--kol-surface-primary`, `-on-primary`, `-secondary`, `-on-secondary`, `-inverse`, `-on-inverse`, `--kol-accent-primary`, `-on-primary`, the four `--ui-*` and the seven `--kol-palette-*` (`kol-color.css`), and pins six oq steps (08, 16, 24, 32, 48, 64) to the exact Gruvbox grounds in both modes (the other oq steps stay derived; `kol-opaque.css` is untouched, the kolbox selector's higher specificity wins). fg, the other oq steps, border, focus, accent-strong and the accent tints follow from those; absolutes, glass, the float well, sunken and tertiary stay the DS's dark and light. The same law as the themes: explicit choice beats system beats light. Stamp it on `<html>` or on an element that also carries `data-theme`, since the ramps re-resolve only on the theme selectors. Kolbox light keeps the Gruvbox light inks, accent, status and palette; its grounds are near-neutral warm whites (W17, 2026-11-18, decided for his review): each Gruvbox light ground mixed 24% toward white, then cut to 30% of its chroma in Oklab at the same lightness, so surface primary `#f7f6f0`, secondary `#f6f4ea`, oq 08 `#eeebe2`, 16 `#e8e4db`, 24 `#d7d3cb`, 32 `#c6c2bc` (oq 48 and 64 are inks and stay `#a89984` and `#7c6f64`). Kolbox dark is unchanged. What a theme cannot carry (heights, paddings, type, structure) is the look `variant="kolbox"` on the components; its type is the eleven `kol-kolbox-*` roles in `kol-type-kolbox-classes.css`, see [[03-typography|typography § Kolbox roles]]. Its floating parts share one surface, `.kol-kolbox-surface` (`kol-components-atoms.css`: the file's `shadow/dock`, the float well as its second drop, and the oq-24 line where a part keeps a border), and two widths, `--kol-kolbox-popover-w` 240 and `--kol-kolbox-modal-w` 480 (`kol-design-tokens.css`, see [[09-sizes|sizes § Kolbox widths]]) (W31.2 batch 4, 2026-11-18).

**Folio's own tokens** (Folio migration batch 0, 2026-11-22). Apart from the `folio` variant above, which re-points KOL's bases, Folio's look reads its own seven colors, moved value for value out of apps/folio into `kol-color.css`: `--kol-folio-paper`, `-ink`, `-muted`, `-rule`, `-surface`, `-mint` and `-green`, with Folio's day set at `:root`. Folio's switches are attributes on its frame, nearest wins: `data-folio-theme="light|dark"` (Folio's day or night set, and `--kol-folio-page`, `--kol-folio-page-ink` for a Text document's page), `data-folio-palette="kol"` (paper and ink from the KOL neutrals the frame passes as `--kol-folio-kol-light`, `--kol-folio-kol-dark` and optionally `--kol-folio-kol-surface`; muted, rule and surface mixed from those two) and `data-folio-accent="green|teal|blue|orange|red|purple"` (`--kol-folio-accent` and `--kol-folio-accent-soft`, which become green and mint; on dark the ink lifts toward white and the ground sinks into the paper). A Tailwind host registers them `@theme inline` (`--color-folio-paper: var(--kol-folio-paper)` and so on), so a utility resolves at its own element and every switch reaches it. Its type is the `kol-folio-*` roles, see [[03-typography|typography § Folio roles]].

## Spacing

`--kol-spacing-*` in `kol-design-tokens.css`, named px ÷ 4 with a dash for a decimal.

| Token | px |
|---|---|
| `--kol-spacing-0-25` | 1 |
| `--kol-spacing-0-5` | 2 |
| `--kol-spacing-1` | 4 |
| `--kol-spacing-1-5` | 6 |
| `--kol-spacing-2` | 8 |
| `--kol-spacing-2-5` | 10 |
| `--kol-spacing-3` | 12 |
| `--kol-spacing-3-5` | 14 |
| `--kol-spacing-4` | 16 |
| `--kol-spacing-5` | 20 |
| `--kol-spacing-6` | 24 |
| `--kol-spacing-8` | 32 |
| `--kol-spacing-10` | 40 |
| `--kol-spacing-12` | 48 |
| `--kol-spacing-16` | 64 |
| `--kol-spacing-20` | 80 |
| `--kol-spacing-24` | 96 |

1, 6, 10 and 14 were added 2026-11-18 (plan-2026-11-18-kolbox-system W1.1); no other stop moved. Tailwind reads them through `@theme`: `p-4` is `--kol-spacing-4`, and `gap-px`, `p-1.5`, `p-2.5` and `p-3.5` the new stops.

## Content widths

`--kol-content-{shell,column,measure}` — 1800/768/65ch: ONE frame per page, two
inner caps, width is never a page identity. Detail: [[04-layout-breakpoints|layout]].

## Radius & shadows

- Radii: `--kol-radius-{0,2,4,6,8,12,13,16,full}`, named by the number (plan-2026-11-18-kolbox-system W1.2) — components reference these, never hardcoded corners. One value in every theme. **4 is the container** (ruling 2026-08-09: "change 8px radius to 4px in containers. everywhere."); 2 is the hairline rung; 6, 8, 12 and 16 are there for tool UIs, not a re-widening. 13 is Figma's file card and toolbar corner, measured (plan-2026-11-23-editor-measured-against-figma W7), read only by kolbox's `ContentCard` and tool rail. The old names `none`, `xs`, `sm`, `md`, `lg`, `xl` and `2xl` are aliases on the [[../../operations/01-release/04-retirements|retirement ledger]], each the px it was: none 0, xs 2, the rest 4.
- Shadows: `--kol-shadow-{sm,md,lg,xl,inner}`; `--kol-shadow-float` lifts a float (the solid surface; the float motion and state tokens `--kol-float-hover-opacity` · `-press-scale` · `-enter-scale` · `-enter-shift` · `-duration` · `-duration-rail` · `-ease` sit beside the float sizes, see [[08-motion|motion]]); `--kol-shadow-rail-up` lifts a Rail rising from the bottom edge (no top rule with it, kol-theme 0.207.0).
- Glass (W16, round 3 — 2026-10-31): `--kol-glass-dark-*` · `--kol-glass-light-*` — `fill`, `blur-s` · `blur-m`, `rim`, `shadow-s` · `shadow-m`; worn through `.kol-float-glass-dark` · `.kol-float-glass-light` (`.kol-float-m` for a menu or a box), never inline. glass-dark: rgb 26 at 62%, blur 6 / 16 with saturate 1.8; glass-light: rgb 236 236 232 at 10%, blur 6 / 6. Reduced transparency → solid.
- Float sizes: `--kol-float-h-{sm,md,lg}` 28 · 36 · 44 (touch 36 · 44 · 52), `--kol-float-t-{sm,md,lg}` 12 · 13 · 14 (13 · 15 · 16), `--kol-float-ic` 18 (20), `--kol-float-row` 40 (48), `--kol-float-inset` 6, `--kol-float-tip-h` · `-tip-t` 24 · 11 (28 · 12), `--kol-float-well` (the field's well, per theme). Touch = `pointer: coarse`.
- Float radii (float-everything W0.1, 2026-11-04, the exploration's own scale): `--kol-float-list-r` 8 (10) a bare list · `--kol-float-menu-r` 20 (24) a sheet or panel — was 26 (30) in round 3 · `--kol-float-window-r` 28 (32) a window · a control is a pill. Float focus: `--kol-float-focus` = `0 0 0 2px` of the ink on every float control's `:focus-visible` (W0.2). Float selection is `--kol-fg-16`, never `--kol-oq-16`, so glass shows through (W0.3). Float type: `--kol-font-family-float` = Inter (self-hosted, `kol-typography.css`), the twelve `kol-float-*` roles in `kol-type-float-classes.css` — see [[03-typography|typography § Float roles]].

## State colors

`--ui-error` / `--ui-warning` / `--ui-info` / `--ui-success` — theme-tuned pairs (dark and light values differ; see `kol-color.css`).

## Palette tokens

`--kol-palette-{blue,teal,green,yellow,red,orange,purple}` + `-light` muted variants — the shared categorical palette for tags, charts, and data viz, lifted verbatim from the monorepo theme. The dashboards and chess component CSS were already referencing these; the definitions had never migrated (found dangling by the first real kol-dashboards consumer, the kol-chess stats page). Defined once in `:root` — deliberately not theme-tuned.

## Hyperlinks

`--kol-link` / `--kol-link-hover` — a **per-repo hook, not a shipped color** (user law 2026-07-29; theme ≥0.12.0). Defaults to `currentColor`, so links render as surrounding ink everywhere until a consumer binds the token at its root — e.g. `:root { --kol-link: var(--kol-color-yellow-300) }` against the brand ramps. Consumers of the hook: `.kol-link` (call-site opt-in) and `.kol-table a` (underline always, color only when bound). History: the global `a {}` rule died in 0.11.3; the old blue-600/400 defaults (raw Tailwind, never brand-bound) died in 0.12.0 after a consumer's DS-Table flush exposed them.

## Media focus

`--kol-media-focus` — **a per-repo binding, not a shipped value** (user ruling 2026-08-27, ContentMediaFocusBinding from kol-monitor: *"make it so that the focus can be set per repo"*; theme ≥0.73.0 · component ≥0.111.0). The anchor of a card's image — where the `natural` / `compact` fit pins it and from where the hover zoom grows — is ONE `transform-origin` per image, and both readers take this token: `ContentMedia`'s fits default it to `top left`, `.kol-media-zoom` to `center`. Unset, everything renders as before. Bound once on a consumer's `:root` (`:root { --kol-media-focus: top left }` — monitor's), every card's image pins there and zooms from there. Per-card focus is not a prop today; if one catalog ever mixes anchors it becomes one, defaulting to this token.

## Stacking

`--kol-z-base 1 · --kol-z-dropdown 10 · --kol-z-sticky 20 · --kol-z-overlay 50 · --kol-z-modal 100 · --kol-z-toast 200 · --kol-z-tooltip 300 · --kol-z-nav 1000` (kol-theme.css). **The ladder is the z-contract** (user ruling 2026-08-27, EditorOverlaysOnFullscreenOverlay from kol-fxr — six hand-rolled editor overlays at `z-[1000]` / `z-[1100]` above every DS layer): DS chrome sits on it — `.kol-overlay` and `ShellSearchOverlay` at `modal`, a `ShellDrawer` sheet at 200 over its scrim at 100, `.kol-popover-float` at 210 (above the sheet), `.kol-popover` / `.kol-tooltip` at `tooltip` (they sat at 1000, the nav tier, until theme 0.76.0) — and a consumer's chrome never rises above `--kol-z-nav`, nor a consumer's overlay above `--kol-z-modal`. A hand-typed `z-[1000]` in an app is either a nav or a mistake.

## Overlays

**One mechanism: `FullscreenOverlay`** — Escape, backdrop dismiss (the backdrop only, so portalled dropdowns survive), the DS Button close, scroll lock, focus trap, stacking at `modal`. The lightbox is **`MediaViewer`** on it — full-bleed media, prev/next `fixed` at the viewport edges, slides inside 10rem gutters. There is no third archetype (user ruling 2026-08-27): a modal-shaped overlay is `FullscreenOverlay`, a paged media view is `MediaViewer`. **Two scrims, no token:** `.kol-overlay` is a flat `surface-primary` (the backdrop is the surface — ruled 2026-08-27); `.kol-overlay-scrim` is a flat `--kol-color-ab-black` at **48 %** — the one scrim tint, shared with `.kol-shell-drawer-scrim` since 2026-09-03 (it was a raw `#000` at an off-ladder 60, so the same gesture dimmed differently in the site shell and the app shell); the `blur(1px)` it carried was cut 2026-09-01 (`OverlayScrimBlur`: a compositing layer on every overlay open, on a phone, for separation the tint already gives) — worn by `ShellDrawer`, `ShellSearchOverlay` and the framework's mobile nav backdrop. A consumer's `rgba(0,0,0,.6)` is `.kol-overlay-scrim`; a heavier lightbox wash is not a rung — the lightbox takes `MediaViewer`'s flat scrim.
