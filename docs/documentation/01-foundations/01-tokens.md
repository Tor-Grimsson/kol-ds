---
title: Tokens
type: reference
status: active
created: 2026-07-29
updated: 2026-09-03
description: The token foundation under every KOL component
aliases:
  - foundations
  - tokens
sources:
  - packages/theme/kol-opacity.css
  - packages/theme/kol-color.css
  - showcase/src/lib/tokens.js
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[02-color|color]]"
  - "[[03-typography|typography]]"
  - "[[04-layout-breakpoints|layout & breakpoints]]"
  - "[[08-motion|motion]]"
---

# Foundations — the token system

KOL's foundation is **translucent ink over surfaces**, not flat fg/bg pairs. Everything below renders live on the showcase's `/foundations` page — that page reads the installed theme at runtime and is always the truth; this doc is the portable summary.

## Ink ladders

Moved to [[10-opacity|opacity — the lookup]] (2026-09-03): the twelve `fg-*` /
`oq-*` families, their stops, which flips which way, and the eight semantic ink
roles. They were the most-looked-up thing on this page and sat between the
content widths and the z-index scale; hue lives in [[02-color|color]], ink
weight lives there, and this page keeps the rest.

### Semantic surfaces sit on top

`--kol-surface-*` names *where* a colour is used; the ladders name *what it is mixed from*. Reach for the surface token in a component rule; reach for a ladder when defining a new surface.

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

Each tier pairs with an `--kol-surface-on-*` ink. Theme switching is `data-theme` on `<html>` under the standing law **explicit choice > system/auto > light** (corrected 2026-07-28): a stamped `data-theme` or saved toggle choice wins; an un-stamped page follows `prefers-color-scheme` live via the `:root:not([data-theme])` mirror blocks in `kol-base-tokens.css`/`kol-theme.css`; light is the last-resort fallback. The same stamp on any **element** themes that subtree (theme ≥0.52.0): surfaces, fg ramp, roles, `oq` and borders all re-resolve on the stamped element; the **accent family deliberately does not** — `kol-brand-color.css` rebinds it at `:root`, so a nested pane keeps the app's accent. The showcase boots un-stamped (system-follow) unless a saved choice exists; ThemeToggle (framework ≥0.6.0) cycles light → dark → system.

## Content widths

`--kol-content-{shell,column,measure}` — 1800/768/65ch: ONE frame per page, two
inner caps, width is never a page identity. Detail: [[04-layout-breakpoints|layout]].

## Radius & shadows

- Radii: `--kol-radius-{none,sm,md,lg,xl,2xl,full}` — components reference these, never hardcoded corners.
- Shadows: `--kol-shadow-{sm,md,lg,xl,inner}`.

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
