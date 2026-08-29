---
title: Type classes
type: reference
status: active
created: 2026-07-31
updated: 2026-08-27
description: The two families, and when to use which
aliases:
  - type-classes
sources:
  - packages/theme/kol-type-mono-classes.css
  - packages/theme/kol-typography.css
tags:
  - domain/typography
  - audience/consumer
related:
  - "[[04-layout-breakpoints|layout & breakpoints]]"
  - "[[../03-components/02-placement|component placement]]"
---

# Type classes — the two families and when to use which

Every piece of text in a KOL component uses a `kol-*` type class — never freestyle Tailwind sizing (`text-sm`, `text-[13px]`). The inventory splits on one fault line: **does the class carry a line-height?**

## Fault line

| Family | Line-height | Use for |
|---|---|---|
| **Helper scale** `kol-helper-*` | `1` (none) | **Single-line chrome only**: menu rows, labels, chips, badges, value readouts, chevrons/affordance glyphs, label/value pairs. Text that wraps in a `line-height: 1` class sets solid — never give a helper class to anything that *can* wrap. |
| **Line-height-bearing sets** `kol-mono-*`, `kol-sans-body-*`, `kol-sans-heading-*`, `kol-sans-display-*` | 12–26px / 100–160% | Anything that can run to more than one line: paragraphs, descriptions, notes, multi-word labels in narrow containers — and all headings/display type. |

The quick test: *can this string ever wrap?* Yes → line-height set. No (structurally single-line) → helper.

## Inventory

### Role sets — `kol-doc-*` + `kol-card-*` (2026-07-28, `kol-type-roles.css`)

Opt-in role families over the scales below — see [[07-doc-card-sets|the doc+card sets plan]].
**Doc set** (11): `kol-doc-{eyebrow,heading,section-title,lede,body,code,code-inline,table,figure,caption,footer}` — doc-chrome ramp; the content-furniture roles (code/table/figure/caption/footer) are twin-selectored with `.kol-prose` bare tags (one rule, two entry points; prose code rules moved there, prose gains table/figure styling).
**Card set** (6): `kol-card-{title,kicker,meta,excerpt,value,tag}` — the shared card text ramp (mono voice, compact titles, clamp knob `--kol-card-excerpt-lines`).
Head roles are deliberately NOT twinned with prose — the editorial `.kol-prose-*` head family stays its own scale.


### Helper scale — mono, weight 500, `line-height: 1`, letter-spaced

| Class | Size | Letter-spacing |
|---|---|---|
| `kol-helper-8` | 8px | 0.10em |
| `kol-helper-10` | 10px | 0.10em |
| `kol-helper-12` | 12px | 0.06em |
| `kol-helper-14` | 14px | 0.06em |
| `kol-helper-16` | 16px | 0.06em |
| `kol-helper-20` | 20px | 0.06em |

Beyond the missing leading, helpers differ from mono in **weight (500 vs 400)** and **letter-spacing** — they're labels, not copy.

**A CHIP TAKES THE LEADING AND REFUSES THE TRACKING (user finding 2026-08-01).** `Tag` and `Pill` were moved onto this ramp for its `line-height: 1` — a `sm` chip was inheriting the body's ~1.5 and standing twice its own height beside the rail rows — and they inherited `0.10em` with it. That tracking exists for **uppercase labels** at the smallest two stops; a tag renders an authored string (`#domain/design-system`) and at that tracking it reads as a spaced-out caption. `.kol-tag` and `.pill-{sm,md,lg}` now declare `letter-spacing: normal`.

**The general rule this makes explicit:** adopting a ramp for ONE of its properties adopts all of them. If only the leading is wanted, the component's own rule says so — at the component, not by forking the ramp.

### The mono family is VARIABLE (2026-08-01)

JetBrains Mono ships as **two** `@font-face` rules — roman and italic, each `font-weight: 100 800` — not seven static cuts. Any weight is a number, not a new file.

| | Before | After |
|---|---|---|
| Files | 7 static woff2 | 2 variable woff2 |
| Payload | 1024 kb | **151 kb** |
| Weights | 300 · 400 · 500 · 600 | every value 100–800 |

**Why it changed.** The rail needed a Page weight lighter than its Chapter, and the lightest cut in the folder was 300. Measured on the H stem at the 14 stop: 400→500 is 1.26→1.39 device px, 300→500 is 1.11→1.39 — a **0.28** difference, applied and correct in the cascade and completely invisible. Reaching a weight that reads meant shipping another static, and the next question would have meant another one. The axis removes the question.

**The pair that reads** (user ruling, after five attempts): `100` = 0.70 against `700` = 1.75 — **150%**, both ends of the usable axis. Everything narrower failed: 400/500, 300/500 and 200/500 all applied correctly and none of them looked like hierarchy.

### Mono scale — mono, weight 400, with leading

| Class | Size / LH |
|---|---|
| `kol-mono-8` | 8 / 12px |
| `kol-mono-10` | 10 / 14px |
| `kol-mono-12` | 12 / 16px |
| `kol-mono-14` | 14 / 18px |
| `kol-mono-16` | 16 / 22px |
| `kol-mono-20` | 20 / 26px |
| `kol-mono-heading-03` · `kol-mono-display-03` · `kol-mono-display-02` | 32 / 110% · display-03 · display-02 tokens / 100% — **weight 500**, the app tier's masthead voice (`PageHeader voice="mono"`, 2026-08-27) |

### Sans sets — tokens, with leading

| Class | Size (desktop base) | LH | Family / weight |
|---|---|---|---|
| `kol-sans-display-01/02/03/04` | 56 / 44 / 36 / 32px | 100% | sans-tight 500 |
| `kol-sans-heading-01/02` | 48 / 40px | 110/110% | sans-narrow 500 |
| `kol-sans-heading-03/04/05` | 32 / 24 / 20px | 120/120/125% | sans-compact 500 |
| `kol-sans-body-01/02/03` | 16 / 14 / 12px | 160/160/150% | sans 400 |

(`heading-06` token exists; class deferred until a consumer needs it. Sizes step up at the responsive breakpoints — see `kol-typography.css`.)

### Display — one face, since theme 0.59.0

The display ramp is **Right Grotesk Tight, weight 500, no tracking**, 01 → 04 (DisplayTightRamp, user ruling 2026-08-27: *"the lg is correct, MORE correct than the numbered ramp … make 01 and 02 tight 500, replace the lg and retire lg … so we only have one system"*). Before 0.59.0 the ramp was Narrow and the Tight cut lived in a second, size-named system lobbied from the website's elder type. Case is a role — `uppercase` at the call site, `headlineCase="upper"` on `SectionText` — not a transform on the class.

**Retired — the elder display voice.** Four aliases, each on the retirement clock ([[../../operations/01-release/04-retirements|retirements]]); they keep the uppercase their contract baked in, the swap adds `uppercase`:

| Elder class | Swap to |
|---|---|
| `kol-display-lg` | `kol-sans-display-01 uppercase` |
| `kol-display-section` | `kol-sans-display-02 uppercase` |
| `kol-display-section-sm` | `kol-sans-display-03 uppercase` |
| `kol-display-subsection` | `kol-sans-display-03 uppercase` |

`--kol-text-display-tight-01/02/03` and `--kol-font-family-sans-tight` stay as tokens. No `-xs/-sm/-md/-lg/-xl` type class is left in the theme.

## Casing

**Casing is a property of the ROLE, not a law about strings (user ruling 2026-08-26 — the fourth time it was said).** Eyebrows, kickers and section labels are **uppercase by contract**: `SectionText` stamps `.kol-section-text-eyebrow` (`text-transform: uppercase`, theme ≥0.55.0) on every label it renders, whatever voice class rides beside it. Body copy, headlines, buttons, tags and chips render **as authored** — no transform, the call site writes the string in the case it should read.

The earlier line — "no `text-transform`, ever" — was one call about button and tag strings written up as a law for every string, then quoted back at every eyebrow that should have been caps. It is retired. The older component comments that still cite it are true of body strings and nothing else.

## Worked examples

| Component | Was | Now | Call |
|---|---|---|---|
| Avatar initials | `text-xs/sm/base/3xl` | `kol-helper-12/14/16/20` | Single glyph = single-line → helper. **`xl` dropped 30→20px** (largest helper stop). |
| ToggleCheckbox / ToggleSwitch hint | `text-[10px]` | `kol-helper-10` | Inline single-line hint; keeps its `tracking-normal` de-emphasis override. |
| Accordion chevron | `font-mono text-[18px]` | `kol-helper-16` | Affordance glyph; 18px sits between stops, took the tighter one. |
| SideNav collapse button | `text-[14px] leading-none` | `kol-helper-14` | `leading-none` was hand-rolling what helper already is. |
| AssetPlaceholder note | `text-[12px]` | `kol-helper-12` | "missing" — structurally single-line. |
| AssetPlaceholder label | `text-[12px]` | `kol-mono-12` | `category · name` **can wrap** in a narrow tile → the wrapping side of the fault line. |

## Enforcement

`pnpm extract:docs` reports any component source using freestyle Tailwind type utilities (`text-xs…xl`, `text-[Npx]`, `font-sans/serif`) — currently clean. Each component page also lists its type classes in the **Type styles** row, mined from source.

## Prose color

`.kol-prose` maps onto the kol-opacity **text roles**, not raw `fg-*` stops — body copy at `--kol-fg-default` (64), `em` climbs to `--kol-fg-strong` (80, italic), `strong` and all headings land on `--kol-fg-emphasis` (full ink); captions/cites sit at `--kol-fg-meta` (48). Edit the role token, every prose consumer follows. Raw stops remain only where a role has no business meaning (blockquote border `fg-32`, code wash `fg-04`).
