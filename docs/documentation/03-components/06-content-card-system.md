---
title: The ContentCard system
type: reference
status: draft
created: 2026-08-15
updated: 2026-08-27
description: One card family; wrapper owns the switch
aliases:
  - content-card
  - card-system
  - card-family
tags:
  - domain/components
  - audience/consumer
sources:
  - packages/component/src/molecules/MediaCard.jsx
  - packages/component/src/molecules/MediaRow.jsx
  - packages/shell/src/GridCard.jsx
  - packages/content/src/ListingCard.jsx
  - packages/content/src/WorkCard.jsx
  - packages/store/src/PrintGridCard.jsx
  - packages/foundry/src/TypefaceLibraryItem.jsx
related:
  - "[[01-inventory|component inventory]]"
  - "[[02-placement|placement rules]]"
  - "[[../01-foundations/01-tokens|tokens]]"
  - "[[../../visual-reference/INDEX|visual reference]]"
---

# The ContentCard system

**Status: built 2026-08-15** — `kol-component` 0.46.0 + `kol-theme` 0.43.0,
unpublished. The open rulings below still stand.

Every listing surface in the estate — a media library, a module catalog, a blog
index, a portfolio, a print store, a typeface library — renders the same two
shapes: a **card** and a **row**. Today that is nine components across five
packages, each with its own geometry, its own padding, its own corner radius and
its own copy of the grid-versus-list switch.

This page is the plan to make it one family. It is the reference the work is held
to; rulings live here rather than in a conversation.

**How it was found.** Two exhaustive sweeps on 2026-08-15 — every card-like
component in the fifteen packages, and every call site across this repo and the
consumer repos — gathered into
[[../../../lobby/inbox/ListGridCards|the ListGridCards collection]].

## The components

Six names. Nothing else gets minted.

| Name | What it is |
|---|---|
| `ContentCard` | the card form — preview on top, text below |
| `ContentRow` | the row form — thumb left, text flows right, meta right-aligned |
| `ContentItem` | joins the pair — takes `form="card" \| "row"`, renders the right one |
| `ContentCollection` | the layout — owns the grid⇄list switch, container geometry, animation |
| `ContentMedia` | the image/preview slot, shared by card and row |
| `ContentText` | the text block, shared by card and row |

**Why card and row are separate components, not one with a variant.** A row is
horizontal and a card is vertical — they share slot *names*, never slot *layout*.
The estate already voted: 4 of the 5 live pairs are split, and the one that is not
(`GridCard`) opens with `if (variant === 'list') return <entirely different JSX>`,
which is two components sharing a filename.

**Why the wrapper is the real product.** The duplication is not the cards, it is
the **switch**. `layout === 'list' ? rowJSX : cardJSX` plus two container grids is
hand-written in monitor ×4, MediaLibrary, kol-website Work, both foundry grids and
`StackLatest`. `ContentCollection` owns it once.


**ContentFilters — the filter-group law (user ruling 2026-08-27, "for the 10th time"; its width re-ruled the same day — ContentFiltersFirstGroupFixedWidth, kol-monitor: "nope not hug, fix a size … if columns, maybe just use one?"):** the FIRST filter group is **ONE CATALOG COLUMN wide** — the `1fr` of `repeat(6, 1fr)` gap 24, `(row − 120px) / 6`, a fraction of the row (measured as a container, so the count/strip beside the groups never narrows it), never a px — so it sits over the first card; every group after it FLOWS across the rest of the row, starting over the second. By position, never by chip count. A page without a 6-column catalog (`/work`, a list) gets the same fraction of its own row. Not a hug (0.104.3 — 78px on one surface, 92 on the next), not equal columns (0.104.1, a misread), not "short groups stack" (0.101, one page's ruling). `group.stack` stays the explicit override; `group.className` still wins on width (the rule is `.kol-filters-first`, kol-theme ≥0.73.0, components layer). The category label is the eyebrow role (`kol-eyebrow text-fg-96`).

**Why the slots are their own components.** Card and row differ in arrangement,
not in contents. Putting the media and the text in shared components is what makes
a new variant cheap — a variant is a `ContentText` composition plus a
`ContentMedia` ratio, not a new card.

## The variants

Six, and `default` is declared.

`default` · `catalog` · `print` · `article` · `work` · `typeface`

| variant | content shape | absorbed from |
|---|---|---|
| `default` | thumb · title · meta — the plain one; file size/date is just what you pass to meta | `MediaCard` / `MediaRow` |
| `catalog` | preview image · title · detail, expandable to 2×2 | `GridCard` (monitor modules, presets, patches; mirror memory, variants) |
| `print` | A4 artwork · title · detail | `PrintGridCard` (+`PrintGridCardGsap`) |
| `article` | kicker · title · summary · tags · date | `ListingCard` — **kol-website Stack** |
| `work` | title · client · type · year | `WorkCard` / `WorkListItem` |
| `typeface` | live specimen · name · styles · classification · year | `TypefaceLibraryItem` |

**Catalog frame (user ruling 2026-08-28, CatalogCardFrameAndZoom):** no frame at rest, `fg-04` on hover — the old rest value is the hover; a 212-tile grid of `fg-04` frames read as a grid of boxes. `plateRule={false}` switches the plate's top hairline off without a consumer `!important`. The zoom (`.kol-media-zoom`) scales the wrapper's child whatever element it is, not only `img`/`video`.

**`default` is declared explicitly — never "whichever is first".** Paid for on
2026-08-15: `ContentFilters` was passed `variant="default"`, which was not a
declared variant, so `VARIANTS[v] ?? primary` silently rendered the wrong chip and
nobody saw it for two weeks. A fallthrough that happens to look right is a defect.

**There is no tier 2, and no exemptions.** An earlier cut of this plan split the
family into "absorb" and "keep separate". That was wrong under the split
architecture. `article`, `work` and `typeface` have domain-specific *bodies* — a
live font, a tilt, a Pill meta row — which is an implementation difference, not a
licence to skip the standards below. Everything renders through
`ContentCollection` and obeys the standards.

## The standards

Every variant, both forms.

Written because the sweep found each of these eyeballed per component.

| Concern | The rule | What was found |
|---|---|---|
| **Radius** | the token, never a literal. Every token from `sm` up is 4px (`xs` 2px and `full` are the only others); `01-tokens.md:127` already says components reference these | `GridCard` writes `borderRadius: 4`, `WorkListItem` writes `rounded-[2px]` — right values, wrong spelling |
| **Padding** | one scale, stepped by `size` | `p-3` · plate `12px 16px` · `p-4 md:p-6` · `p-6` — four answers |
| **Row Y padding** | a prop | hardcoded `py-2` in `MediaRow` |
| **Type** | ONE title/meta ramp, stepped by form and `size` | `helper-14`/`helper-8` (card) · `helper-12`/`helper-10` (row) · `mono-12`/`mono-12` (MediaCard) — three answers for two slots |
| **Media slot** | `ContentMedia` wraps `AssetPlaceholder` (`packages/component/src/utilities/AssetPlaceholder.jsx`) — it already exists and already takes `aspectRatio` | every card hand-rolls its own empty state |
| **Ratio** | a prop `[open]` — see the ratio question below | `1 / 1.41421` hardcoded in two packages |
| **Both forms, always** | every variant ships a card AND a row, even where a consumer shows only one; unused slots switch off by prop | `print` has no row and no text at all — an exception, and exceptions are what this removes |

### Ruled 2026-08-15 — text per variant (live review, user's rulings)

The laws, distilled from the review of all six variants:

- **Title is the ONLY slot that steps between card and row** — and the step is
  **size only**: one family per variant, same ink, same tracking.
- **Body and meta are identical in both forms.**
- **`helper-*` is OUT of this family entirely (ruled 2026-08-15, later pass).**
  The earlier rule was "`helper-*` only where a single line is guaranteed"; the
  user's ruling on the live surface was blunter — *"are you using helper?
  specifically dont"*. `kol-helper-*` is not `kol-mono-*` with `line-height: 1`;
  it also carries **weight 500 and 0.06em tracking**, so a `helper` field beside
  a `mono` one on the same line reads as a different voice, which is exactly
  what the `default` card's date/size pair did. Every slot in the family is
  `mono-*` or a `sans-*` heading. Where line-height 1 is genuinely wanted, it is
  `leading-none` on the mono class, not a family swap.
- **Ink is three roles only:** `emphasis` (title) · `body` · `meta`.
- **Meta copy is domain-true** — read-time belongs to `article` alone; `typeface`
  meta is the date. The demo string set stays shared; the slots differ.
- **Structure is never re-derived** — each form keeps its shipped shape; only the
  field-to-slot assignment gets corrected (see `work`).

| variant | title card / row | body | meta |
|---|---|---|---|
| `default` | `sans-heading-04` / `sans-heading-05` (truncated) | — | date + size, **`mono-12`** both, ink `meta`; card groups them 24px apart |
| `catalog` | `mono-14` / `mono-12` | detail `mono-10` both | — |
| `print` | `mono-14` / `mono-10`, ink `body` | detail `mono-10` both | — |
| `article` | `sans-heading-03` / `sans-heading-05` | kicker **`mono-12`** · body `mono-14 · body` both | `default`'s group verbatim |
| `work` | `sans-display-02` / `sans-display-03`¹ | `mono-14 · body` both | `mono-12` both. Row structure unchanged: line 2 stays the big line and carries the **title** (fields were crossed) |
| `typeface` | `mono-20` / `mono-14` | `mono-14 · body` both | date only, `mono-12`. Row = `header.between` (title left, date right) + body below |

¹ `kol-sans-display-03` ships — `kol-typography.css:820`, 36 / 42 / 48px at
line-height 100%. It needs the row's **160px** floor, not the 96 the new side
first pinned: 48px in a 160px row leaves 112px after the 24px pad, and does not
fit 96 at all. `work`'s row steps 96 → 160 at `md` for exactly this reason.

### Ruled 2026-08-15, later pass — `default` closed, the other five built

`default` was ruled live, row by row, on `/sets/content-card-comparison`. The
rest were built against the review table's `suggested` column under a standing
"decide it yourself" grant. Both are recorded here because a rejection is a
ruling too.

**`default` — the user's calls, in order.**

| Slot | Ruling |
|---|---|
| Card title | `sans-heading-04` — the row keeps `heading-05` |
| `size` | off `helper-12` onto `mono-12`, matching `date` |
| `size` rest ink | `oq-80` — **the same as its hover**, so hovering changes nothing but the swap |
| Row layout | date moves **below** the title; the row stops being a table line |
| Row title↔meta | 12px → 8px |
| Row meta columns | the fixed 96/80px right-aligned columns are **gone** — fields hug their content on the 24px group gap |

The last one has a cost and it is not paid: those widths were what aligned meta
into columns down a list. `dateWidth` / `sizeWidth` remain unexposed.

**Inline icon controls — one rest, two hovers (ruled 2026-08-15).**
`.kol-inline-control` rests at **`oq-64`** for every control. They part on
hover: a neutral control lifts to `oq-96`, and **yellow is the accent's alone**
— the star's hover and its on-state, nothing else. Spending the accent on every
hover left the on-state with nothing of its own to say. The accent is opt-in via
`.kol-inline-control--accent`.

`star.svg` gained `fill="currentColor"` beside its stroke. The theme comment had
claimed for months that it "ships fill AND stroke", which was false against the
file — so the `--on` rule had nothing to fill and the star never went solid.
**Consequence, unresolved:** every `star` in the DS now renders filled, because
nothing unfills it at rest, and `star-solid.svg` is redundant against it.

**The house curve is no longer expo (ruled 2026-08-15).**
`--kol-ease-house` was `cubic-bezier(0.16, 1, 0.3, 1)` — easeOutExpo, which
spends ~90% of its distance in the first fifth of the duration. Every motion in
the family read as instant no matter what duration it carried. It is now
`cubic-bezier(0.4, 0, 0.2, 1)`, balanced. Seven sites that hardcoded the raw
bezier were pointed at the token; `ActionButton`'s gsap array is the one
hand-synced numeric twin, because gsap cannot read a CSS variable.

**Built for the other five.** Family-level: a `tags` slot, a `clamp` prop on the
body, `ContentMedia`'s `fit` / `frame` / `ring`, a per-variant hover step driven
by `--kol-content-hover-bg`, and a responsive row step published as
`--kol-row-*-md` custom properties. Per variant: catalog renders **at** 36 with
no Y padding on `surface-tertiary`; print's overlay ring is restored with its
radius; **every row thumb is a fixed square box** (`--kol-row-thumb` wide, at the top of the row, the media object-covers into it; row height = max(thumb, text); rows never zoom — ContentRowsAndPrintCard, user 2026-08-27: *"the image should not control height"*), article's card media bare by default
(`frame` opts the hairline in — user 2026-08-27: *"I hate border"*), its body
clamped 3/2; work steps 16→24 pad, 64→112 thumb, 96→160 height, thumb on `radius-xs`
with an `fg-08` frame, border transparent→`fg-16` on hover, meta split into two
slots; typeface's row takes a media slot, a 160 floor, a transparent surface,
the color-mix wash, and a **stacked** right column. **Ruled on screen 2026-08-27 (TypefaceCardAndRow):** the row's name and classification are full ink and the year steps to 64; the card's title is the row's title string (`kol-mono-14 uppercase`, full ink); and the card takes `reveal` — on hover the plate and the glyph fade out and the reveal node (the pangram in the face) fades in, 300ms on the house curve, the shipped `TypefaceLibraryItem` hover carried.

That last one made `ContentText`'s renderer **recursive** — an entry inside a
line may now itself be an entry, so `['stack', 'detail', 'date']` sits inside a
`between`. A flat slot list could not express a two-line trailing column, which
is why typeface had been collapsing `classification` and `year` into one slot
and losing a value.

**THE ROOT FOLLOWS THE AFFORDANCE (family-wide).** `href` renders a real `<a>`,
with `onNavigate` as the SPA seam; `onClick` alone still renders the semantic
element but gains `role="button"`, `tabIndex={0}` and Enter/Space. Every shipped
variant was a click handler on a div — un-focusable, invisible to a screen
reader's link list, and dead to middle-click. This was the largest regression on
the board.

**Rejected, with reasons.**

| Proposal | Why not |
|---|---|
| `loading="lazy"` + fade-on-load inside `ContentMedia` | The media is consumer-**injected**. Lazy is one attribute on their own `<img>`; owning it means `cloneElement`-ing a node the family does not own to attach an `onLoad` that never fires for a cached image. |
| article's `group-hover:opacity-70` title dim | [[05-control-chrome\|the control-chrome state model]] rules interactive state as an `oq-*` **fill**, never a translucent wash. article has no surface of its own to step, so it takes **no** hover rather than a dim the law forbids. |
| `work`'s hover-revealed text drawer over the image | It hides the title until you point at it — dead on touch, invisible to a scan. That is `WorkCard` chrome, not a family layout. |

### Ruled 2026-08-15, third pass — the five variants built from the SOURCE

The second pass built these from the review table. That was the wrong input and
it showed: the table said `work`'s row had its title and description "crossed",
so I inverted a working design. The rule this pass establishes:

> **The user's instruction beats the screenshot. The screenshot beats the diff
> table.** When a shipped component and the table disagree, open the component.
> When he has said something twice, it is ruled — do not re-derive it from a
> reference and quietly reverse him.

Both halves were violated in one session. Reading the live `/work` page
overturned two of my own rulings, and reading his instruction overturned a
third of mine that had overturned him.

**Corrected by the source.**

| I had | The source says | Where |
|---|---|---|
| `work`'s fields are crossed; uncross them | small title → tags → BIG description is the design | live `/work` listing |
| the hover drawer hides the title; reject it | the shelf is a wall of images and the caption IS the reveal | `WorkCard.jsx:81` |
| one `frame` prop for every media edge | three treatments — tint+border, border-only, tint-only — plus the ring | `ListingCard.jsx:133,169` · `WorkListItem.jsx:64` |
| article's card title is `mono-20` | `kol-sans-heading-03` — it already matched the new side | `ListingCard.jsx:148` |
| `display-03` overflows a 160px row | it fits 160 and does NOT fit the 96 the new side pinned | `kol-typography.css:820` |

**Two CSS defects that made whole features invisible**, both the same cause —
an inline style outranks any class:

1. **No card or row hover had ever fired.** `background` and `borderColor` were
   set inline, so `.kol-content-hover:hover` could not win. Rest colours are now
   custom properties (`--kol-row-bg`, `--kol-card-border`) and the hover rules
   own the declarations.
2. **A clipped icon never opened.** `style={{ width: 0 }}` beat
   `group-hover:w-[20px]`. The rest value moved to a class.

**The exit-snap, root-caused.** A `delay` on the BASE class is inherited by the
exit, so a glyph finished retracting 200ms after the fade had already hidden it
— it vanished at full extension and never appeared to slide back. An entry-only
delay belongs on the `group-hover:` variant.

**The star is TWO GLYPHS.** `star` stays stroke-only; `star-solid` is its filled
twin; a control with an on-state names both. Filling the shared `star.svg` and
unfilling it in CSS was tried and reverted — a glyph that ships filled renders
filled in every consumer that never asked for a state, and the DS cannot see
those. *(The theme comment claiming `star.svg` "ships fill AND stroke" had been
false since it was written; that is what stopped the on-state working.)*

**Built.** Family: `tags` slot · body `clamp` · `ContentMedia` `fit`/`frame`/
`border`/`bg`/`ring` · per-variant hover steps · responsive row and plate steps
at the ruled `md` rung · **the root follows the affordance** (`href` → real
`<a>` + `onNavigate`; `onClick` → `role`/`tabIndex`/Enter+Space, which every
shipped variant lacked). Per variant: catalog renders **at** 36 on
`surface-tertiary` with a 4px title↔detail gap; print's overlay ring is back
with its radius and its row **is** catalog's; article's row thumb is square,
framed, clamped 3/2, meta in one Pill; work has the drawer, steps 16→24 /
64→112 / 96→160, and its text column is `self-stretch justify-between` so the
big line sits level with the thumb; typeface is a fixed 500px specimen board
with a stacked right column, which made `ContentText`'s renderer recursive.

**`self-stretch`, never `h-full`** — a row carries `min-height`, never `height`,
so `height: 100%` resolves against an indefinite parent and shrink-wraps.

Shipped: kol-theme **0.44.0** · kol-component **0.47.1** · kol-content
**0.7.1** · kol-shell **0.4.1**. kol-icons was bumped and reverted — the star
change was undone, leaving it byte-identical to 0.17.0.

### Text seams — every text slot is a prop (ruled 2026-08-15)

Many consumers run TG fonts, so the type classes above are **defaults, not
hardcodes**: every text slot (`title` · `body` · `meta` · `kicker` · `detail`)
exposes its type class as a prop, defaulting to the ruled table. A consumer on
its own faces swaps the class; passing nothing renders the ruled values. Same
pattern as `ContentFilters`' 13 look seams (defaults = shipped values).
*This deliberately reverses the SectionSplit "per-site type classes do not
thread" ruling for the card family — user ruling, 2026-08-15.*

## The diff

Logged 2026-08-15 from source on both sides, rendered side by side at
`showcase/src/sets/content-card-comparison.jsx`. **Nothing here is ruled** — it
is the difference list the rulings get made against. `=` means same value,
different spelling.

### default · card — `MediaCard` → `ContentCard`

| Concern | Shipped | New |
|---|---|---|
| **Media radius** | thumb unrounded; `<li>` clips it — ONE radius | card clips **and** `ContentMedia` re-rounds — **double rounding** |
| Radius spelling | `rounded` (Tailwind literal, 4px) | `var(--kol-radius-sm)` = 4px `=` |
| **Media containment** | `aspect-square` box but the thumb is **not sized** — a raw `<img>` keeps natural height and overruns | `[&>img]:h-full w-full object-cover` inside `1 / 1` |
| **Title type** | **no class** — raw slot; falls through to the page body font | `kol-helper-12 text-emphasis truncate` |
| Title truncation | none | `truncate` |
| Meta structure | one joined string, one `<p>`, consumer joins with `·` | two slots `date`+`size`, flex group, 16px gap, no separator |
| Meta ink | `text-fg-48` — raw opacity, one ink | `text-meta` + `text-body` — two roles |
| Meta type | `kol-mono-12` | `kol-helper-12` |
| Plate padding | `p-3` = 12px | `--kol-pad-card-sm` = 12px `=` |
| Title↔meta gap | `gap-2` = 8px | `--kol-spacing-3` = 12px |
| Root element | `<li>` — needs a `<ul>` | `<article>` |
| Border / selected | `fg-12` → `fg-64` | identical |
| Background | `fg-02` | identical |
| **Dropped** | download overlay, select-mode checkbox, `actions` slot | none of the three exist |
| Click | fires only in `selectMode` | `onClick` always |

### default · row — `MediaRow` → `ContentRow`

| Concern | Shipped | New |
|---|---|---|
| Thumb | `w-12 h-12` = 48px, rounded, **thumb not sized** | 48px, `1 / 1`, cover forced |
| Y padding | `py-2` = 8px | `--kol-spacing-2` = 8px `=` |
| Gap | `gap-3` = 12px | `--kol-spacing-3` = 12px `=` |
| Divider | `border-b` `fg-08` | identical |
| Name/title | **no class**, flex-1 | `kol-helper-12 text-emphasis truncate` |
| Date | `kol-mono-12 text-fg-32` | `kol-helper-12 text-meta` |
| Size | `kol-mono-12 text-fg-48` | `kol-helper-12 text-body` |
| **Column widths** | `w-24`/`w-20`, **consumer-tunable** via `dateWidth`/`sizeWidth` | hardcoded `[96, 80]` px — **tunability lost** |
| Selected | `bg-fg-08` | `bg` → `fg-04` — **different value** |
| Root element | `<li>` | `<div>` |
| **Dropped** | `actions` slot, select checkbox | — |

### catalog · card — `GridCard` → `ContentCard`

| Concern | Shipped | New |
|---|---|---|
| Radius | `borderRadius: 4` — a raw **number** | `var(--kol-radius-sm)` `=` |
| Ratio | `1 / 1.41421` | identical |
| Frame | `bg-fg-04` + `border-fg-04` | identical |
| Plate | `bg-surface-primary border-t border-fg-04`, `12px 16px` | identical, spelled in `--kol-pad-card-{sm,md}` `=` |
| **Title type** | `kol-helper-14` | `kol-mono-14` — **different family** |
| Title ink | `text-fg-96` | `text-emphasis` |
| **Detail type** | `kol-helper-8` — **8px** | `kol-mono-10` — **different family and size** |
| Detail ink | `text-fg-32` | `text-meta` |
| Title↔detail gap | `marginBottom: 4` | `--kol-spacing-2` = 8px |
| Hover | `hover:bg-surface-tertiary` | **none** |
| Transition | `all 300ms cubic-bezier(0.16,1,0.3,1)` — the untokenised house curve | none on the card |
| **Kept (2026-08-26)** | `expanded` 2×2 mode + `expandedContent` + grid spans; `previewFit` (`natural`/`compact`/`cover`) | `expanded` + `expandedContent` on the card — span 2×2, no ratio, media right at 50%, content left on `pad-card-lg`; `previewFit` = `fit` — and since component 0.108.0 `natural` / `compact` ARE GridCard's rules (50 % / 30 % top-left, clipped), not contain (CatalogPageMonitorParity) |
| Media radius | preview fills, card clips — ONE radius | **double rounding**, as `default` |

### catalog · row — `GridCard variant="list"` → `ContentRow`

| Concern | Shipped | New |
|---|---|---|
| **Background** | `bg-surface-tertiary` | `--kol-surface-secondary` — **different token** |
| **Box** | fixed `height: 36` | `minHeight: 36` + `8px 12px` padding — **can grow** |
| Padding | `px-3`, no vertical | `--kol-spacing-2 --kol-spacing-3` = 8/12 |
| Title | `kol-helper-12 text-fg-64` | `kol-mono-12 text-emphasis` — family **and** ink |
| Detail | `kol-helper-10 text-fg-32` | `kol-mono-10 text-meta` — family **and** ink |
| Hover | `hover:bg-fg-04` | **none** |
| **Dropped** | `action` slot (replaces detail when set) | no equivalent |

### print · card — `PrintGridCard` → `ContentCard`

| Concern | Shipped | New |
|---|---|---|
| **Text** | **none at all** — the card is image-only | **adds** a title + detail plate |
| Border | absolute `inset-0` ring `border-fg-08` **over** the image | `border: null` — no card border; only the plate's `border-t fg-04`. **Ring lost** |
| Background | `bg-surface-secondary` | identical |
| Ratio | `aspect-[1/1.41421]` | identical |
| Radius | `rounded` ×2 (box + ring) | token `=` |
| Flip | 3D flip (`isFlipped`, `rotateY`, perspective 1000px) | **carried 2026-08-27** — `selected` turns the card (0.4s ease-out, preserve-3d) |
| Fade | image fade-in 500ms + `loading="lazy"` | **carried** — `ContentMedia fade` (print by default): the `<img>` child gets `loading="lazy"` and `.kol-media-fade` → `is-loaded` |
| Rect seam | `onCardClick(rect, slug)` FLIP-transition seam | `onClick(event)` — `event.currentTarget.getBoundingClientRect()` is the rect |
| **A11y** | `role="button"`, `tabIndex={0}`, Enter/Space handler | identical on an `onClick` card; an `href` card is a real `<a>` |
| Dead class | fallback uses `kol-mono-sm` — a retired t-shirt stop | — |
| Row | **none shipped** | new adds a framed between-header row |

### article · hero — `ListingCard size="hero"` → `ContentCard variant="article" hero` (2026-08-27)

The featured card riding a page's fold (Stack) — `ListingCard size="hero"` as Stack rendered it, carried through verbatim (user 2026-08-27). `hero` adds a header row above the media — `label` left (`kol-helper-14 text-fg-64`), `meta` chips right (`kol-helper-12 text-fg-48`) — puts the media on the zoom's hero rung (1.02, `is-hero`) and the text on ContentText's `hero` form: kicker `kol-card-kicker tracking-wide text-fg-64`, title **display-03 uppercase**, clamp 2, dim on hover; body `kol-mono-14 text-fg-48` clamp 2; date · size. Tags are `data-tags` on the root, not chips. Same `frame` (off by default). The row form has no hero.

### article · card — `ListingCard size="default"` → `ContentCard`

| Concern | Shipped | New |
|---|---|---|
| **Title type** | `kol-mono-20` | `kol-sans-heading-03` — the new card is modelled on ListingCard **hero**, not **default** |
| Media frame | `bg-fg-04 border border-fg-08 rounded` around the image | **no border, no bg** — bare media |
| Ratio | `16/9`, `3/4` via `aspect` prop | `16 / 9`, free `ratio` |
| Media gap | `mb-4` = 16px | `--kol-spacing-4` = 16px `=` |
| Kicker | **hero-only** — absent at this size | present |
| **Tags** | `Pill variant="inverse" size="sm"` chips, wrap, `gap-2` | **no tags slot** |
| **Meta** | ONE `Pill variant="subtle"` chip, `date • readingTime` | two bare text slots in a flex group — **chip vs text** |
| Body | `kol-mono-14 text-fg-64 line-clamp-3` | `kol-mono-14 text-body`, **no clamp** |
| Hover | title `group-hover:opacity-70`, 200ms | **none** |
| **Link** | `CardLink` — `<a>`, external/internal split, `onNavigate` seam | `<article onClick>` — **no anchor** |

### article · row — `ListingCard size="mini"` → `ContentRow`

| Concern | Shipped | New |
|---|---|---|
| **Thumb ratio** | `120×120` — **square** | 120 wide × `16 / 9` ≈ 68 tall — **different geometry** |
| Thumb fallback | `bg-fg-12` box | `AssetPlaceholder` |
| Outer gap | `gap-6` = 24px | `--kol-spacing-6` = 24px `=` |
| Inner gap | `gap-2.5` = 10px | `'10px'` raw literal `=` — the scale has no rung here |
| **Title type** | `kol-mono-14` | `kol-sans-heading-05` — **different family** |
| Title clamp | `line-clamp-2` | **none** |
| Body | `kol-mono-14 text-fg-64 line-clamp-2` | `kol-mono-14 text-body`, **no clamp** |
| Meta | one joined string, `kol-helper-12 text-fg-80` | two slots, `text-meta` + `text-body` |
| Kicker | absent | present |
| Hover | `hover:opacity-80` | **none** |
| **Link** | `CardLink` + `onNavigate` | **no anchor** |

### work · card — `WorkCard` → `ContentCard`

| Concern | Shipped | New |
|---|---|---|
| **Text position** | hover-revealed **drawer over the image**, `bg-surface-inverse` | text **below** the image, always visible — **a different card** |
| Size | fixed `w-[280px] md:w-[400px]` + ragged heights by `index % 3` | fluid width, `3 / 4` ratio — **ragged skyline dropped** |
| **Dropped** | `TiltCard` pointer tilt + `perspective` | no equivalent |
| Entrance | per-index `rotateX`/`translateY`, `0.07s` stagger, house curve hardcoded | `ContentCollection` generic 40ms stagger, `--kol-ease-house` |
| Title | `kol-sans-display-02 text-fg-inverse leading-tight` | `kol-sans-display-02 text-emphasis` — same family, ink follows the lost drawer |
| Meta | `kol-mono-12 text-fg-inverse opacity-60 tracking-widest` | `kol-mono-12 text-body` — **tracking dropped** |
| Meta composition | internal `client \|\| TYPE_LABELS[type] \|\| type · year` | consumer passes one joined string — **`TYPE_LABELS` mapping lost** |
| Body | **none** | adds `kol-mono-14` body |
| Radius | `rounded-[4px]` arbitrary | token `=` |
| **Link** | `<a href>` + `onNavigate` | **no anchor** |

### work · row — `WorkListItem` → `ContentRow`

| Concern | Shipped | New |
|---|---|---|
| **Field assignment** | title small (`kol-mono-14`) line 1; description big (`kol-sans-heading-03`) line 3 | order `body · title · meta`; **title is the big line** — the ruled uncrossing |
| **Big-line type** | `kol-sans-heading-03` | `kol-sans-display-03` — **different family, 36/42/48px** |
| Thumb | `w-16 h-16 md:w-28 md:h-28` — **64→112 responsive** | fixed 64 — **step dropped** |
| Thumb radius | `rounded-[2px]` | `--kol-radius-sm` = 4px — **value change** |
| Thumb border | `border-fg-08` | **none** |
| Padding | `p-4 md:p-6` — 16→24 | fixed 16 — **step dropped** |
| Gap | `gap-4 md:gap-6` — 16→24 | fixed 16 — **step dropped** |
| Min height | `min-h-24 md:min-h-40` — 96→160 | fixed 96 — **step dropped** |
| Border | `transparent` → `fg-16` on hover/active | always `fg-08`, **no hover** — resting border now visible |
| Bottom margin | `mb-4 md:mb-6` — row owns its own | none — collection owns the gap (correct) |
| **Tags** | `Tag variant="secondary" hash={false}` chips + `tagsSeparator` | **no tags slot** |
| Right column | TWO stacked values — `type` (`mono-12 md:mono-14`) over `year` (`mono-12 text-fg-64`) | ONE `meta` slot — **two fields collapsed** |
| Description | `whitespace-nowrap` + ellipsis — hard one line | wraps, no clamp |
| **Link** | `<a href>` + `onNavigate` + `onMouseEnter`/`active` | **no anchor** |

### typeface · card — `TypefaceLibraryItem variant="card"` → `ContentCard`

| Concern | Shipped | New |
|---|---|---|
| **The specimen** | live `Ðð` at `140px lg:160px`, font resolved from `typeface.name`, swaps to a pangram on hover | **no font logic** — the glyph becomes consumer `media` |
| Height | fixed `h-[500px]` | A4 ratio, fluid |
| Name type | `kol-helper-16` | `kol-mono-20` — family and size |
| Styles type | `kol-helper-14 text-fg-64` | `kol-mono-14 text-body` |
| Year | **not shown** on the card | `date` slot added |
| Classification | **not shown** on the card | no slot — consumer must fold it into `body` |
| Padding | `p-6` = 24px | `--kol-pad-card-lg` = 24px `=` |
| Hover | whole card → `surface-inverse`, details fade out, pangram in | **all dropped** |
| `isActive` | pins the hover treatment | only `selected`, which changes the border colour |

### typeface · row — `TypefaceLibraryItem variant="list"` → `ContentRow`

| Concern | Shipped | New |
|---|---|---|
| **Casing** | name is `kol-mono-14 uppercase` — **violates the no-`text-transform` law** | dropped (correct) |
| **The specimen** | width-clipped alphabet, 48px / `leading-[52px]`, binary-search clipping via `ResizeObserver` | **dropped** — no media slot at this variant |
| Background | `transparent` | `--kol-surface-primary` |
| Hover/active | `color-mix` 1% wash + 24% border | **none** |
| Left column | fixed `w-64` | `flex-1` |
| Name type | `kol-mono-14` | `kol-mono-14` — same |
| Styles | `kol-mono-12 text-fg-64` | body `kol-mono-14 text-body` — size and ink |
| Right column | TWO values — `classification` (`helper-14`) + `year` (`helper-12`) | ONE `date` slot — classification has nowhere to go |
| Min height | `min-h-40` = 160px | none |
| Padding / gap | `p-6` / `gap-6` | `--kol-spacing-6` = 24px `=` |

### What repeats across all six

1. **Double rounding** — `ContentMedia` re-rounds inside an already-clipped card. Every framed variant.
2. **No anchor** — 4 of 6 shipped cards are `<a href>` with an `onNavigate` seam. The new family renders `<article>`/`<div>` with `onClick`. Routing and a11y regression across the board.
3. **No keyboard** — `PrintGridCard` has `role="button"` + `tabIndex` + Enter/Space. Nothing in the new family does.
4. **Hover dropped** in 5 of 6 variants.
5. **Chips dropped** — `ListingCard`'s Pills, `WorkListItem`'s Tags. No slot exists anywhere.
6. **Responsive steps flattened** — `WorkListItem`'s whole `md:` ladder, `WorkCard`'s 280→400, the specimen's 140→160. All fixed to one value.
7. **Clamps dropped** — `line-clamp-2`/`-3` on both `ListingCard` sizes, `whitespace-nowrap` ellipsis on `WorkListItem`.
8. **Action/overlay slots dropped** — MediaCard/MediaRow `actions` + download + select; GridCard `action`.
9. **Two fields → one `meta` slot** in `work` row and `typeface` row, where the shipped components give each its own column.
10. **Live behaviour dropped** — the tilt, the flip, the font mapping, the alphabet clipping, the expand-to-2×2.
11. **4px written five ways** on the shipped side — `rounded`, `borderRadius: 4`, `rounded-[4px]`, `rounded-[2px]`, and the token. 12px as `p-3` vs `--kol-pad-card-sm`.
12. **Raw `fg-*` inks throughout the shipped side** — `fg-96`, `fg-80`, `fg-64`, `fg-48`, `fg-32`, `fg-24` — against the three roles.

## Ratio `[open]`

Two ratio systems exist and A4 is in neither.

- `/export-specs` standard set: `9:16` · `3:5` · `4:5` · `1:1` · `5:4` · `5:3` · `16:9` (+ `2:3`/`3:2`)
- Cards in the wild: `1 / 1.41421` (A4 — `GridCard`, `PrintGridCard`), `16/9`, `3/4`, `aspect-square`, `h-[500px]`

**Ruling needed:** A4 joins the standard set, or `ratio` stays a free prop on the
card. Until then nothing hardcodes a ratio.

## Naming `[open]`

The `ListingCard` name collision.

`ListingCard` was renamed from `ArticleCard` on **2026-08-15**, on kol-website's own
`ListingCardSpec`, to mean *the* generic listing card. Under this plan `ContentCard`
is that, and the editorial one is the `article` variant. That reverses a day-old
ruling with the repo that filed it. **User's call, with kol-website in the loop.**

## Animation

It lives in the wrapper — the only place it can. Today the switch is a hard branch that unmounts everything,
so list⇄grid can never tween — `Work.jsx` is the single place anyone reached for
`AnimatePresence`, and `WorkCard` / `ScrollDriftGallery` / `ParallaxShelf` each
hand-roll their own entrance. `ContentCollection` owns enter-stagger, the FLIP
between forms, hover, selected, exit.

## Hard constraint

This does NOT go inside `ContentFilters`.

Only **8 of 26** `renderItem` call sites render a card at all; the rest are tables,
icon tiles and rack viewports. `renderItem` is a generic body slot, not a card seam.
`ContentCollection` is a thing a consumer passes *to* `renderItem`, never something
`ContentFilters` builds in.

## Not decided

- Which package owns the family (`kol-component` is the only tier every other
  package already depends on, but that is an argument, not a ruling).
- Migration order and what happens to the four forked `ContentFilters` copies in
  client repos.
- Whether `catalog`'s expand-to-2×2 generalises or stays a `catalog`-only prop.

## Visual reference

`docs/visual-reference/content-card-unification.html` — being rebuilt to: one pane
with a dark toggle (not two panes), `AssetPlaceholder` in every slot, both forms for
all six variants, and a row exposing the padding / radius / type inconsistencies
rather than describing them.

## Retirement

On the user's go, the eight absorbed components carry `@deprecated` in source and in each package's changelog, pointing at the variant that replaces them: `MediaCard` / `MediaRow` → `default` · kol-shell `GridCard` → `catalog` · `PrintGridCard` → `print` · `ListingCard` (+ `ArticleCard`) → `article` · `WorkCard` / `WorkListItem` → `work` · `TypefaceLibraryItem` → `typeface`. Nothing renders differently; every export stays until the next major. **Step 2 is each consumer's:** bump, swap, on its own cadence. Step 3 — dropping the exports — waits for every consumer to have moved. Not deprecated: kol-dashboards' `GridCard` (an unrelated grid-span wrapper) and `BentoCard` — no variant absorbs it; ruled 2026-08-27 into the Tilt family as `TiltBento` (`TiltCard` · `TiltBento` · `useTilt`), `BentoCard` its alias on the ledger.
