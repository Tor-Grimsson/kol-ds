---
title: Type classes
type: reference
status: active
created: 2026-07-31
updated: 2026-11-22
description: The two families, and when to use which
aliases:
  - type-classes
sources:
  - packages/theme/kol-type-mono-classes.css
  - packages/theme/kol-typography.css
tags:
  - domain/typography
  - domain/tokens
related:
  - "[[04-layout-breakpoints|layout & breakpoints]]"
  - "[[../03-components/02-placement|component placement]]"
  - "[[../04-compositions/26-kolbox-system|kolbox system]]"
---

# Type classes — the two families and when to use which

Every piece of text in a KOL component uses a `kol-*` type class — never freestyle Tailwind sizing (`text-sm`, `text-[13px]`). The inventory splits on one fault line: **does the class carry a line-height?**

## Fault line

| Family | Line-height | Use for |
|---|---|---|
| **Helper scale** `kol-helper-*` | `1` (none) | **Single-line chrome only**: menu rows, labels, chips, badges, value readouts, chevrons/affordance glyphs, label/value pairs. Text that wraps in a `line-height: 1` class sets solid — never give a helper class to anything that *can* wrap. |
| **Line-height-bearing sets** `kol-mono-*`, `kol-sans-body-*`, `kol-sans-heading-*`, `kol-sans-display-*` | 12–26px / 100–160% | Anything that can run to more than one line: paragraphs, descriptions, notes, multi-word labels in narrow containers — and all headings/display type. |

The quick test: *can this string ever wrap?* Yes → line-height set. No (structurally single-line) → helper.

The gate: `pnpm validate:helper-text` (in `pnpm validate`, 2026-10-23) fails on an element whose literal `className` carries `kol-helper-*` and whose own literal text has five or more words, holds a `. ` or ends with a period (H1), or a helper beside `whitespace-normal`, `line-clamp-*` or `text-wrap` (H2). A `SettingsRow` label never wraps by construction (`whitespace-nowrap truncate`).

## Inventory

### Role sets — `kol-doc-*` + `kol-card-*` (2026-07-28, `kol-type-roles.css`)

Opt-in role families over the scales below — see [[07-doc-card-sets|the doc+card sets plan]].
**Doc set** (11): `kol-doc-{eyebrow,heading,section-title,lede,body,code,code-inline,table,figure,caption,footer}` — doc-chrome ramp; the content-furniture roles (code/table/figure/caption/footer) are twin-selectored with `.kol-prose` bare tags (one rule, two entry points; prose code rules moved there, prose gains table/figure styling). Since 2026-11-14 the twins split on size and line height only: the `.kol-prose` half reads the [[15-type-ramp|type ramp]] per [[17-type-sets|type sets]] (code block 14/20, inline code 12, table 14/20, table head 10/10, caption 12/16, footer 10/13), the `.kol-doc-*` half keeps its own values.
**Card set** (6): `kol-card-{title,kicker,meta,excerpt,value,tag}` — the shared card text ramp (mono voice, compact titles, clamp knob `--kol-card-excerpt-lines`).
Head roles are deliberately NOT twinned with prose — the editorial `.kol-prose-*` head family stays its own scale.
**Prose on the ramp** (2026-11-14): every `.kol-prose` and `.kol-prose-*` size and line height is a `--kol-ramp-*` token, the step per role from [[17-type-sets|type sets]] on the [[15-type-ramp|type ramp]]. Body and list 16/24, lede 24/34, label 12/16, tagline 14/18, quote 24/32, cite 12/16; h2 32/36, h3 24/32, h4 20/30, h5 and h6 16/24. Responsive at 768: display 56/56 then 80/76, display-md 48/50 then 64/64, title 48/50 then 56/56. `h1` keeps heading-01's breakpoints: 48/50, 56/56 from 768, 64/64 from 1280. The `--kol-text-*` tokens are unchanged; the prose rules no longer read them.
**Sheet** — `.kol-sheet` (2026-10-24, `kol-typography.css`): the DOCUMENT voice beside the editorial prose — kol-atlas's Research-Spec carried class for class: 16/24 body on a 724 edge, h1 36/40, h2 24/32 and h3 18/24 with hairlines (every size and line height a ramp token since 2026-11-14, per [[17-type-sets|type sets]]; the half-pixel sizes moved to their steps) and the `why` aside, `when` / `dw` meta lines with a `k` key, `note`, `tb` item text, footnotes, `term`s, the `media` figure grid, `tablewrap` plain and `kv`, `totalbar`, the `ol` outline and `proj`, the numbered margin. Its four tokens map onto KOL's (ink · fg-64 · fg-12 · fg-04 · accent-primary · ui-error), the sub-class names stay the spec's so an atlas document renders unchanged. Shown on itself at `apps/site-hub` › Research › Sheet.


### Helper scale — mono, weight 500, `line-height: 1`, letter-spaced

| Class | Size | Letter-spacing |
|---|---|---|
| `kol-helper-8` | 8px | 0.10em |
| `kol-helper-10` | 10px | 0.10em |
| `kol-helper-12` | 12px | 0.06em |
| `kol-helper-14` | 14px | 0.06em |
| `kol-helper-16` | 16px | 0.06em |
| `kol-helper-20` | 20px | 0.06em |

Since 2026-11-15 each helper reads its [[15-type-ramp|type ramp]] Utility step (8 U10, 10 U8, 12 U6, 14 U5, 16 U4, 20 U2), each mono class its step (8 T10, 10 L8, 12 L6, 14 L5, 16 L4, 20 L2), and the table cells `.kol-table-cell-title` and `-text` read L6 12/16.

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
| `kol-mono-10` | 10 / 13px |
| `kol-mono-12` | 12 / 16px |
| `kol-mono-14` | 14 / 18px |
| `kol-mono-16` | 16 / 21px |
| `kol-mono-20` | 20 / 26px |
| `kol-mono-heading-03` · `kol-mono-display-03` · `kol-mono-display-02` | 32 / 110% · display-03 · display-02 tokens / 100% — **weight 500**, the app tier's masthead voice (was `PageHeader voice="mono"`, 2026-08-27 — retired 2026-10-18, PageHeader is one sans header) |

### Sans sets — tokens, with leading

| Class | Size (desktop base) | LH | Family / weight |
|---|---|---|---|
| `kol-sans-display-01/02/03/04` | 56 / 44 / 36 / 32px | 100% | sans-tight 500 |
| `kol-sans-heading-01/02` | 48 / 40px | 110/110% | sans-narrow 500 |
| `kol-sans-heading-03/04/05` | 32 / 24 / 20px | 120/120/125% | sans-compact 500 |
| `kol-sans-body-01/02/03` | 16 / 14 / 12px | 160/160/150% | sans 400 |

(`heading-06` token exists; class deferred until a consumer needs it. Sizes step up at the responsive breakpoints — see `kol-typography.css`.)

### Float roles — Inter + mono, fixed sizes (float-everything W0.6, 2026-11-04, `kol-type-float-classes.css`)

The float style's twelve voices, carried from the exploration (kol-float--style, W2.0 row 2). Inter is `--kol-font-family-float`, self-hosted at `/fonts/inter/`. Sizes are fixed — a float role is a control-sized voice, not a fluid one. Every `variant="float"` control sets Inter 500 at its size (12 · 13 · 14). Figma: text styles `float/<role>`, bound to `font/float`.

| Class | Size / weight / LH · tracking | Use |
|---|---|---|
| `kol-float-display` | 116 / 400 / 110 · −7 | the scene title on the canvas |
| `kol-float-editorial` | 76 / 300 / 84 · −4.8 | the scene subtitle |
| `kol-float-sheet` | 38 / 500 / 44 · −1.2 | a sheet's display line |
| `kol-float-section` | 24 / 500 / 32 | a section heading |
| `kol-float-window` | 18 / 500 / 24 | a window's title line |
| `kol-float-body-lg` | 16 / 400 / 24 | artwork body |
| `kol-float-body` | 14 / 400 / 22 | description |
| `kol-float-panel` | 13 / 500 / 18 | panel titles, control labels |
| `kol-float-hint` | 12 / 400 / 18 | hints, tooltips |
| `kol-float-label` | 11 / 400 / 16 | supporting labels |
| `kol-float-timecode` | 12 / 400 / 18 · mono | timecode, technical readouts |
| `kol-float-ruler` | 10 / 400 / 14 · mono | metadata, rulers |

### Kolbox roles — the theme's families, fixed sizes (plan-2026-11-18-kolbox-system W31.2, 2026-11-18, `kol-type-kolbox-classes.css`)

The kolbox look's eleven voices, carried value for value from kolbox's own steps (`apps/kolbox/src/index.css`), as the float roles were. The families are the theme's own, `--kol-font-family-sans` and `--kol-font-family-mono`, as kolbox reads them, so a theme variant that sets its families reaches these too. Sizes are fixed. A `variant="kolbox"` control sets its type in its own rule at these values; the classes are for text that is not a control.

| Class | Size / weight / LH | Use |
|---|---|---|
| `kol-kolbox-title` | 16 / 500 / 22 | a window's or a rail's title line |
| `kol-kolbox-rail-title` | 14 / 500 / 20 | the selection's name in a rail's header |
| `kol-kolbox-body` | 14 / 400 / 20 | body text |
| `kol-kolbox-document` | 13 / 500 / 18 | the file's name (rail and top rail) |
| `kol-kolbox-brand` | 15 / 600 / 21 | the KOL mark's word |
| `kol-kolbox-section` | 12 / 500 / 17 | a section heading |
| `kol-kolbox-label` | 12 / 500 / 16 | control labels |
| `kol-kolbox-row` | 12 / 400 / 17 | list and menu rows |
| `kol-kolbox-help` | 11 / 400 / 15 | help and hints |
| `kol-kolbox-value` | 12 / 400 / 16, mono | values in fields |
| `kol-kolbox-meta` | 10 / 400 / 14, mono | metadata |

### Folio roles — the float face, fixed sizes, a sized prose (Folio migration batch 0, 2026-11-22, `kol-type-folio-classes.css`)

The folio look's fifteen voices and its reading text, carried value for value from apps/folio's own family (`src/folio/reader.css`, where they were `kol-reader-*`), as the kolbox roles were. The face is the float style's Inter, `--kol-font-family-float`; the prose's mono switch is `--kol-font-family-mono`. Sizes are fixed except the prose, which the viewer sizes with `--kol-folio-prose-size` (16 when unset) and whose inner steps are in em. A `variant="folio"` control sets its type in its own rule at these values; the classes are for text that is not a control. apps/folio and apps/style import the file a second time unlayered, as the old copy was, until the part batches drop the font utilities it outranks there.

| Class | Size / weight / LH, tracking | Use |
|---|---|---|
| `kol-folio-wordmark` | 38 / 800 / normal, -2 | the masthead's "folio" |
| `kol-folio-title` | 72 / 700 / 1, -3.4 | a page title |
| `kol-folio-figure` | 56 / 700 / 1, -2.5 | a big count |
| `kol-folio-chapter` | 56 / 700 / 1.05, -2.4 | a chapter's opening title |
| `kol-folio-section` | 28 / 700 / 1.2, -0.8 | a section heading |
| `kol-folio-book` | 25 / 700 / 1.21, -0.7 | a book's title in a card or the rail |
| `kol-folio-shelf` | 16 / 700 / 1.2, -0.3 | a title under a cover |
| `kol-folio-row` | 14 / 600 / 1.21 | a book's title in the table |
| `kol-folio-glyph` | 16 / 400 / 1 | the glyph beside a control's label |
| `kol-folio-nav` | 13 / 500 / 1.21 | masthead and rail links |
| `kol-folio-body` | 13 / 400 / 1.5 | interface body text |
| `kol-folio-control` | 12 / 600 / 1.21 | buttons and fields |
| `kol-folio-meta` | 11 / 400 / 1.21 | supporting text |
| `kol-folio-meta-sm` | 10 / 400 / 1.21 | table metadata |
| `kol-folio-label` | 10 / 600 / 1.21, +1.1, capitals | kickers and column heads |
| `kol-folio-prose` | `--kol-folio-prose-size` / 400 / 1.65 (mono 1.6 with `data-family="mono"`) | the reading text; h2 1.75em, h3 1.25em, h4 0.625em capitals, quote 1.25em, table 0.875em, th 10 capitals, pre 0.9em |

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

## Prose wrapping

`.kol-prose` and every `.kol-prose-*` class carry `overflow-wrap: anywhere` from one rule in `kol-typography.css` (`[class^="kol-prose"], [class*=" kol-prose"]`), so a new prose class inherits it. An unbroken path or URL breaks at the column's edge, inside flex and grid items too (`break-word` would not shrink their min-content width); ordinary text breaks as before.
