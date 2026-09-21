---
title: Opacity
type: reference
status: canonical
created: 2026-09-03
updated: 2026-09-03
verified: 2026-09-03
description: Every ink ladder, and which to use
aliases:
  - opacity
  - opaque
  - ladders
  - fg
  - oq
  - opacity-lookup
covers:
  - the twelve ladder families and their stops
  - fg versus oq, and which flips which way
  - the eight semantic ink roles
  - the one scrim tint
sources:
  - packages/theme/kol-opacity.css
  - packages/theme/kol-opaque.css
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[01-tokens|tokens]]"
  - "[[02-color|color]]"
  - "[[09-sizes|sizes]]"
---

# Opacity — the lookup

> **Values live in [[10-opacity-lookup|the lookup]]** — every family, stop and role, generated from the CSS by
> `pnpm lookups`. This page is the reasoning.

**Colour is hue; this page is ink weight.** [[02-color|Color]] holds the brand
ramps — the yellows, reds, blues. Everything here is neutral: the theme's own
ink at some strength, over something. The two are separate systems and are
looked up separately, which is why they are separate pages.

## Ink roles

The eight names. Each is an alias onto one numeric stop — a role is a *position
on the ladder*, never a colour.

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

## Ladder families

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

Utilities exist for every family and stop: `text-*`, `bg-*`, `border-*` (e.g. `border-fg-08`, `bg-oq-ab-96`, `text-fg-absolute-inverse-64`) — the one exception is the `100` pole, which ships `bg-` only.

## Scrims

One tint, and both classes carry it — `--kol-color-ab-black` at **48 %** (user
ruling 2026-09-03: *"makes sense to me they are the same no?"*).

| What opens | Class | Where |
|---|---|---|
| mobile nav drawer | `.kol-overlay-scrim` | kol-framework `PageLayout` |
| ⌘K search | `.kol-overlay-scrim` | `ShellSearchOverlay` |
| `ShellDrawer`, generic | `.kol-overlay-scrim` | kol-component |
| `Modal` (prompt / confirm) | `.kol-overlay-scrim` | kol-component (was a raw `rgba(0,0,0,0.5)` until 2026-09-03) |
| shortcuts sheet · touch notice | `.kol-overlay-scrim` | kol-shell `ShortcutsOverlay` · `TouchDeviceOverlay` (were an 8 % inverse wash + blur until 2026-09-03) |
| workshop shortcuts sheet | `.kol-overlay-scrim` | kol-workshop `ShellLayout` (was `bg-fg-48`) |
| rail-as-drawer | `.kol-shell-drawer-scrim` | kol-shell `AppShell` |

`.kol-overlay-scrim` was a raw `#000` at 60 % until 2026-09-03 — a literal in a
token system, and 60 is not a ladder stop — so the same gesture dimmed to 60 in
the site shell and 48 in the app shell. **No blur:** the `blur(1px)` was cut
2026-09-01 (a compositing layer on every overlay open, on a phone, for
separation the tint already gives).

Two things are deliberately *not* scrims. `.kol-overlay` is a flat
`surface-primary` — the backdrop IS the surface, ruled 2026-08-27, so a lightbox
has no wash at all. And `SettingsPanel` passes `backdrop={false}`: you are
tuning the surface behind it, and a scrim hides the thing you are tuning.

---

## Mechanics

### Stops, and how the ramp resolves

A translucent foreground scale — `--kol-fg-01 … --kol-fg-96` — ink at increasing opacity over whatever surface it sits on. Both themes contrast-flip automatically because every consumer of `fg-*` derives from the surface ink — and since theme 0.52.0 that holds on a **subtree** too: the ramp, the roles, the `oq` scale and the border tokens are declared on `:root, :is([data-theme="light"], .light), :is([data-theme="dark"], .dark)`, so a `data-theme` / `.light` / `.dark` stamped on any element re-resolves them on that element (nested-theme-scope, 2026-08-26). A var() resolves where the property is declared; a `:root`-only ramp bakes the root's ink for every descendant.

```text
01 02 04 08 12 16 24 32 40 48 64 72 80 88 96
```

**15 stops** — `01 02 04 08 12 16 24 32 40 48 64 72 80 88 96` — on every family but two. The `72` step began as a `--kol-fg-*` exception for the `lede` role and was widened to all ladders 2026-08-29. **`oq-ab-*` and `oq-ab-inverse-*` carry a 16th, `100`**: the pure pole itself, `#fff` and `#000` with nothing mixed in. It exists because `--kol-surface-sunken` needs it in light (below), and it is the one stop with no `text-`/`border-` utility — only `.bg-oq-ab-100`.

### Naming

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

## History

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
