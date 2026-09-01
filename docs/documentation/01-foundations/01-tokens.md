---
title: Tokens
type: reference
status: active
created: 2026-07-29
updated: 2026-08-27
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

## Opacity scale

A translucent foreground scale — `--kol-fg-01 … --kol-fg-96` — ink at increasing opacity over whatever surface it sits on. Both themes contrast-flip automatically because every consumer of `fg-*` derives from the surface ink — and since theme 0.52.0 that holds on a **subtree** too: the ramp, the roles, the `oq` scale and the border tokens are declared on `:root, :is([data-theme="light"], .light), :is([data-theme="dark"], .dark)`, so a `data-theme` / `.light` / `.dark` stamped on any element re-resolves them on that element (nested-theme-scope, 2026-08-26). A var() resolves where the property is declared; a `:root`-only ramp bakes the root's ink for every descendant.

```text
01 02 04 08 12 16 24 32 40 48 64 72 80 88 96
```

**15 stops, every family** — `01 02 04 08 12 16 24 32 40 48 64 72 80 88 96`. The `72` step began as a `--kol-fg-*` exception for the `lede` role and was widened to all ladders 2026-08-29.

### The six ladder families — cheat sheet

Two questions decide which one you want: **does it flip with the theme**, and **which poles does it mix between**.

| Family | Flips? | Mixes between | 96 stop · dark → light | Reach for it when |
|---|---|---|---|---|
| `fg-*` | **yes** → ink | surface ink → transparent | `250 a.96` → `18 a.96` | ink, borders, dividers, washes on a panel |
| `fg-inverse-*` | **yes** → ink | the other side's ink → transparent | `14 a.96` → `252 a.96` | ink on an inverted plate |
| `oq-*` | **yes** → ink | surface ink → surface | `241` → `27` | interactive fills — anything over media |
| `oq-inverse-*` | **yes** → ground | inverted ink → inverted surface | `24` → `242` | fills on an inverted plate |
| `ab-*` | **yes** → **ground** | **pure** `#000` / `#fff` | `10` → `245` | a step **past** the theme's own ink — wells, scrims |
| `ab-inverse-*` | **yes** → ink | the opposite pure pole | `245` → `10` | the contrasting pure pole |
| `absolute-*` | **no, frozen** | **the theme's** `#0e0e11` / `#fcfbf8` | `24` both | chrome that must match a surface without following the theme |
| `absolute-inverse-*` | **no, frozen** | the theme's opposite pole | `242` both | its inverted twin |

`ab` and `absolute` each exist in an `fg-` (translucent) and an `oq-` (opaque) form: `fg-ab-16`, `oq-ab-16`, `fg-absolute-16`, `oq-absolute-16`, and every `-inverse` twin.

**Two flip directions, and that is the thing to hold on to.** `fg-*` and `oq-*` flip toward the **ink** — light ink on a dark page. `ab-*` flips toward the **ground** — in dark it is black, in light it is white. That is what makes `oq-ab-96` a well in both themes without a per-theme alias: 10 under an 18 page, 245 under a 250 page. A well needs a pole **outside** the theme's range, because a percentage of the page mixed into the page cannot darken it (user, 2026-08-30: *"applying any percentage of primary on top of primary won't make it darker, but applying a percentage of 000000 will"*).

**`absolute` is the frozen family, and that is its whole job** — the theme's own two ends, identical in both themes. From 2026-08-28 to 2026-08-30 one name covered both jobs and the `sunken` tone picked the wrong one.

**`-inverse` means two things.** On an ink-flipping family it is *the other theme's side*. On `ab-*` it is *the opposite pole*. Check the Flips column before reading a name.

Utilities exist for every family and stop: `text-*`, `bg-*`, `border-*` (e.g. `border-fg-08`, `bg-oq-ab-96`, `text-fg-absolute-inverse-64`).

### Semantic surfaces sit on top

`--kol-surface-*` names *where* a colour is used; the ladders name *what it is mixed from*. `--kol-surface-sunken` is the well, and it is **one line** — `var(--kol-oq-ab-96)` — because `ab` flips toward the ground. It resolves 10 in dark and 245 in light, below the page on both sides. The per-theme alias it briefly carried was the tell that the ladder underneath was still frozen. Reach for the surface token in a component rule; reach for a ladder when defining a new surface.

**Opaque neutrals (`--kol-oq-*`)** are the married solid mirror of the same 15 stops (`kol-opaque.css`) — ink mixed into the surface instead of into transparent, plus an `oq-inverse-*` twin. Since 2026-07-08 the rule is: **interactive fills (button/tag/switch states, anything that can sit over media) use `oq`; decoration that always sits on a panel (dividers, table washes) keeps `fg`.** `--kol-accent-primary-strong` is likewise an opaque accent mix now, not a transparency.

## Semantic foregrounds

**Eight stops** (2026-08-01, up from five), **named by role, never by hue** — that
is what makes the set readable as a ladder. Each is an alias onto the numeric
`--kol-fg-*` ramp, which stays the single source of truth.

| Token | Stop | Role |
|---|---|---|
| `--kol-fg-emphasis` | 100% | Highest-contrast text (headings, active states) |
| `--kol-fg-scream` | 96% | The loudest thing that is not full ink |
| `--kol-fg-shout` | 88% | Chrome that has to cut through |
| `--kol-fg-strong` | 80% | Strong values, filled text, **section eyebrows** |
| `--kol-fg-lede` | 72% | The step between resting ink and strong |
| `--kol-fg-body` | 64% | The resting ink — running text and links |
| `--kol-fg-meta` | 48% | Secondary/metadata text, captions |
| `--kol-fg-subtle` | 24% | Least-emphasis text, dividers, disabled hints |

**The naming shifts register at 88.** `subtle … strong` are document roles;
`shout` and `scream` are volume. Deliberate — the top two exist for chrome that
must cut through, not for text.

**`emphasis` did NOT move.** An earlier draft of this ramp put it at 88 with
`full` at 100; 83 files reach for `emphasis` as max ink, and redefining it would
have dimmed every heading in the estate silently, with nothing failing. Three of
the eight are new names over stops that already existed; only `lede` needed a new
stop.

**Eyebrows moved `meta` → `strong` (2026-08-01 user ruling).** An eyebrow is a
section *header*, not a caption: at the `meta` stop it carried the same ink as
the captions and disabled hints it is meant to outrank, so a rail of them read
as one flat field. Uppercase mono at the smallest step with wide tracking is
already a quiet treatment — the ink does not also need to whisper.

### `body` ⇄ `default` — renamed, then reversed, both the same day

Recorded in full because the second ruling overturns the first and the reasoning
for both still stands on its own terms.

**Morning — `body` → `default`.** *"I will never associate it with color."* The
stop is a colour, and every other name in the ladder describes ink weight;
`body` described a **kind of text**, so it read as a type role sitting in a
colour set — the same class of confusion as the `.text-fg-*` / `--kol-fg-*`
split. `default` says what it is: the resting ink, the stop the other four
deviate from. The utility, the token and all 78 call sites moved together.

**Evening — `default` → `body`, reversed by the same user** while designing the
eight-role ramp: *"lets make 72 and add body back in as 64"*. The morning's
argument was answered by the ramp's own shape, not dismissed. `default` names a
stop by its **relationship to the others** — it is the one they deviate from —
which stops being meaningful in a ladder of eight where four stops sit above it.
`body` names the stop by **what it is for**, exactly as `meta`, `lede` and
`subtle` do; against seven siblings it reads as one rung, not as a type role.

The concern that produced the morning ruling is real and is now carried by the
ladder instead of the name: these are ink roles, they only ever appear as
`text-*`, and none of them sets a font.

`default` **survives as a deprecated alias** of `body` so a consumer mid-sweep
cannot render colourless. All 25 in-repo call sites are already on `text-body`.

Not `base`: Tailwind already ships `.text-base` as a **font-size** utility, so
that name would have re-created the collision one word over.

`lede` also returns — it was the name for 80% until 2026-04-30, when it became
`strong` and `mute` (32%) was retired at zero consumers. It now names 72%, a
stop that did not exist before tonight, so no call site inherits the old meaning.

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

**One mechanism: `FullscreenOverlay`** — Escape, backdrop dismiss (the backdrop only, so portalled dropdowns survive), the DS Button close, scroll lock, focus trap, stacking at `modal`. The lightbox is **`MediaViewer`** on it — full-bleed media, prev/next `fixed` at the viewport edges, slides inside 10rem gutters. There is no third archetype (user ruling 2026-08-27): a modal-shaped overlay is `FullscreenOverlay`, a paged media view is `MediaViewer`. **Two scrims, no token:** `.kol-overlay` is a flat `surface-primary` (the backdrop is the surface — ruled 2026-08-27); `.kol-overlay-scrim` is `#000 60 %` + blur(1px), worn by `ShellDrawer`, `ShellSearchOverlay` and the framework's mobile nav backdrop. A consumer's `rgba(0,0,0,.6)` is `.kol-overlay-scrim`; a heavier lightbox wash is not a rung — the lightbox takes `MediaViewer`'s flat scrim.
