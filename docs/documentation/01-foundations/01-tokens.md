---
title: Tokens
type: reference
status: active
created: 2026-07-29
updated: 2026-08-01
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
---

# Foundations — the token system

KOL's foundation is **translucent ink over surfaces**, not flat fg/bg pairs. Everything below renders live on the showcase's `/foundations` page — that page reads the installed theme at runtime and is always the truth; this doc is the portable summary.

## Opacity scale

A translucent foreground scale — `--kol-fg-01 … --kol-fg-96` — ink at increasing opacity over whatever surface it sits on. Both themes contrast-flip automatically because every consumer of `fg-*` derives from the surface ink.

```text
01 02 04 08 12 16 24 32 40 48 64 72 80 88 96
```

**15 stops in the standard tier, 14 everywhere else** (2026-08-01). `72` exists only on `--kol-fg-*` — it was added for the `lede` text role, and text chains exclusively through that tier. The `fg-absolute-*`, `fg-inverse-*`, `oq-*` and `oq-inverse-*` families stay at 14: they carry fills and theme-independent chrome, and no role asks them for this step. A fill that ever needs 72 is the signal to add it across all five families rather than widen the exception.

Used everywhere: borders (`border-fg-08`), dividers, washes, dimmed text. Utilities: `text-fg-*`, `bg-fg-*`, `border-fg-*`. The `fg-absolute-*` variants are theme-invariant black — for overlays that must read on any thumbnail.

**Opaque neutrals (`--kol-oq-*`)** are the married solid mirror of the same 14 stops (`kol-opaque.css`) — ink mixed into the surface instead of into transparent, plus an `oq-inverse-*` twin. Since 2026-07-08 the rule is: **interactive fills (button/tag/switch states, anything that can sit over media) use `oq`; decoration that always sits on a panel (dividers, table washes) keeps `fg`.** `--kol-accent-primary-strong` is likewise an opaque accent mix now, not a transparency.

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

Each tier pairs with an `--kol-surface-on-*` ink. Theme switching is `data-theme` on `<html>` under the standing law **explicit choice > system/auto > light** (corrected 2026-07-28): a stamped `data-theme` or saved toggle choice wins; an un-stamped page follows `prefers-color-scheme` live via the `:root:not([data-theme])` mirror blocks in `kol-base-tokens.css`/`kol-theme.css`; light is the last-resort fallback. The showcase boots un-stamped (system-follow) unless a saved choice exists; ThemeToggle (framework ≥0.6.0) cycles light → dark → system.

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
