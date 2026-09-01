# RowVariantNamesAndSpecs — the variants are page names, the rows have no field slot, and the showcase is stale

**Staged:** 2026-08-29 · from **kol-website** (`/prints` list)
**Nature:** three asks, one root — the content-card system is named after the pages it was born on, and nobody can currently see what it actually contains.

## 1. Variants are page names, not shapes

`ContentRow` / `ContentCard` ship `default · catalog · print · article · work ·
typeface`. Every one is a page. After a month of adoption the names no longer
predict anything:

- **`print` and `catalog` are byte-identical** (`ContentRow.jsx:32-33` — same
  thumb, ratio, pad, gap, frame, bg, minH, align, hover). Two names, one box.
- **`/prints` renders `work`**, because the 168-row with a filling thumb is the
  shape that page needed. Its own variant was the wrong one.
- `/stack` renders `article`; `/icons` renders `catalog`. The mapping from page
  to variant is now arbitrary, so the name teaches a reader nothing.

**Ask:** name the variants by the SHAPE — thumb size / row height / frame —
and keep the page names as aliases so no consumer moves. `print` folds into
`catalog`.

User, 2026-08-29: *"since we made the original variants case and row pair (times
6 I think) since we started implementing they havent always made sense in
praxis. So maybe it doesnt make sense to name them by the page names they were
designed for."*

## 2. Rows need a `specs` slot

`/prints` wants year · material · edition on the row. Today the only way to add
fields is a new variant — which would make a seventh page-named box for what is
a content difference, not a geometry one. `meta` and `date` are single values
and the right column holds nothing else.

**Ask:** `specs` — `[{ label, value }]` rendered in the row's right column,
independent of variant. `/work` would use it for type · year.

> **Correction, 2026-08-29 (same day, before anyone builds this):** size, edition
> and material do **not** vary per print — they are catalog-wide (3 limited sizes
> + 1 open edition; three paper stocks). Rendered per row they would repeat
> identically 24 times, which is noise, so **kol-website will not be the consumer
> that proves this slot**. The ask stands on `/work`'s behalf (type · year DO
> vary) — but build it for a row whose values differ, and do not size the API
> around prints. Ask #1 and #3 are unaffected.

## 3. The development / showcase page is stale

It advertises features that were never implemented and misses what shipped, so
neither repo can answer "what does the system contain and what is each thing
called" without reading source. That is also why #1 went unnoticed for a month.

**Ask:** an accurate overview of the components and their names — **either as a
report back, or rebuilt into the preview page** (user's call, he'll take
either). If the page is going to keep drifting, the report is worth more.

## Definition of done

- [ ] variants named by shape, page names aliased, `print` folded into `catalog`
      — 🔴 **held: the names are yours.** #1's claim is CONFIRMED in source:
      `ContentRow.jsx` `BOX.catalog` and `BOX.print` are identical in all nine
      values (thumb 0 · ratio 1/1 · pad `0 S3` · gap S3 · frame fg-04 · bg
      surface-tertiary · minH 36 · items-center · hover oq-04)
- [x] **`specs` on `ContentRow` — built 2026-08-29, unpublished.** `specs`
      `[{label, value}]` renders as a `<dl>` on the trailing edge, before
      `actions`, on every horizontal variant; `.kol-row-specs` in
      `kol-components-molecules.css` declares its own type per ARCHITECTURE §5.
      Not added to `ContentCard` — the card has no trailing column, and the
      ticket only asked "if it reads naturally". 23 gates clean.
      ⚠️ **Source-and-build verified only, not screen-verified.**
- [ ] a current component + name overview exists, in the showcase or as a report
      — blocked behind #1: an overview written now names things you are about
      to rename. Doing it as a **report** (your "either" — the page has drifted
      a month unnoticed, so the page is not the trustworthy home)

## Remainder in kol-website once it ships

bump; `/prints` and `/work` move to the shape names and pass `specs`. Nothing
breaks meanwhile — the aliases hold, and `ratio="1 / 1.41421"` is already set
locally on the prints row (every print, its photo and its certificate are
A-series).

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-theme 0.96.0** + **kol-component 0.131.0**.

### 1. Variants renamed — six page names → four content kinds

The ask said "name them by SHAPE". Measuring killed that: one variant name
drives BOTH `ContentCard` and `ContentRow`, and their shapes diverge by design
(`catalog` is a 36px framed strip as a row and an A4 plated tile as a card), so
no shape word can be true of both forms. The user re-ruled it the same day —
**name by what the content IS, never by the page that first needed it**:

| was | now | why |
|---|---|---|
| `default` | `file` | named for being the fallback — its position in the map, not its content |
| `print` | `catalog` | `/prints` renders `work` rows and a plateless catalog card |
| `work` | `showcase` | `/work` is a location; a work is a piece being shown |
| `typeface` | `showcase layout="canvas"` | same card, full overlay instead of a drawer |

`print` folded away entirely rather than aliasing to a box of its own: its ROW
had zero consumers, and its card was catalog plus a surface, a missing frame and
a 3D turn. **`flip` and `fade` became props** — a turn and an image fade-in are
things a card DOES, not kinds of content it holds.

`layout` is the discriminator inside `showcase` (`canvas` on the card, `column`
on the row) because `reveal` was already taken by the consumer's overlay node.

**All four old names alias**, verified rendering on the live ContentCard page —
`work`, `typeface` and `print` demos, zero console errors. ⚠️ These are PROP
VALUES, so the retirements gate cannot see them: it only watches barrel exports.
Nothing will chase them at 30 days; they come out when a human decides.

### 2. `specs` — built

`specs={[{ label, value }]}` renders a `<dl>` on the row's trailing edge before
`actions`, on every horizontal kind. `.kol-row-specs` in
`kol-components-molecules.css` declares its own type per ARCHITECTURE §5.
Not added to `ContentCard` — it has no trailing column, and the ask said "if it
reads naturally". Per the same-day correction, `/work`'s type · year is the
proving consumer, not prints.

### 3. Overview — rebuilt as a page, not a report

`showcase/src/sets/content-set-reference.jsx` → `/sets/content-set-reference`.
Replaces the stale `content-card-comparison` set, whose question (diffing against
the eight now-retired cards) closed when they retired. Carries the rename table,
every kind in both forms rendered from the real package, the box values
transcribed from source, and **where each kind actually renders** — scanned, and
including the indirect consumers a grep misses (kol-r2b2 renders `file` through
`MediaLibrary`; monitor/mirror/fxr render `catalog` through kol-shell's
`CatalogPage`, neither ever typing the name).

Three defects the page caught while being built, all fixed: `print`'s card was
drawn with a text plate no consumer has ever rendered; the specimens carried no
`actions`/`control`, so `file` looked like a stale copy of itself; and every
specimen was inert, because both components gate hover behind `href || onClick`.

### Also ruled this session

- **The print card's `ring` removed** — `MEDIA.print` drew a `border-fg-08`
  hairline over the artwork. Its reason was written for the light theme. `ring`
  stays an opt-in prop on `ContentMedia`.
- **The `file` row's hover wash removed** — a full-width grey band under a bare
  ruled line is heavier than the line. Scoped to `file`; `catalog` still carries
  `oq-04`, unruled.

### Remainder here

**None.** Two carried out of scope, both recorded elsewhere: the showcase's
stale `content-card-comparison` set still imports the eight retired cards (it is
part of what blocks `ContentSetRetirement` step 3), and the four prop-value
aliases have no gate watching them.
