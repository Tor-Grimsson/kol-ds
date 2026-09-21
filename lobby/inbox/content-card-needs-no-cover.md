# content-card-needs-no-cover — a text document has no cover, and the card insists on one

**Filed:** 2026-09-04 → **kol-ds-ui**
**Entry:** `~/dev/projects/kol-ds-ui/lobby/inbox/content-card-needs-no-cover.md`
**Ledger:** `~/dev/projects/kol-ds-ui/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` · synced 2026-09-04

## Why it went there

`apps/brand` has a new `/notes` page: markdown documents in D1, listed on
`CatalogPage preset="shelf"` with `cardVariant="article"`. Every row and every
card draws a dashed **MISSING** plate, because a note has no cover image and
never will.

Nothing is misconfigured. The card family treats an absent cover as a missing
asset rather than as a document that simply has none — the placeholder is doing
exactly what it was written to do, for a case that is not this one.

## The two asks

**1. A card with no cover should render without a plate.**
Not a placeholder, not a dashed frame — no media slot at all, with the text
taking the width. This one alone unblocks us. Today the only escape is to
invent a cover for something that has no picture.

**2. `cover` should accept a NODE, not only a URL.**
Then a consumer hands the card its own rendered preview instead of an image
address. That is the good version: a note's thumbnail is its first lines, a deck's
is its first slide, a CSV's is its first rows.

## ⚠ Check with kol-r2b2 first — it wrote the original previews

**The user's instruction, and it matters for ask 2.** `KindPreview` was promoted
into kol-component from kol-r2b2 on 2026-08-27, and it already does the hard
half: markdown → prose, json/yaml/text/code → `CodeBlock`, video/audio/HLS →
their tiles, everything else → `AssetPlaceholder`. It previews CONTENT, which is
precisely what ask 2 wants a card to be able to show.

The one thing that stops us reusing it as-is: **`KindPreview` fetches from a
URL** (`urlOf(o)`), and a note is a database row with no file behind it. So the
question for r2b2 is whether the preview can take content directly as well as a
URL — and if that shape already exists in their column browser, it should drive
this rather than a second design.

Do not design ask 2 without them. They have solved the same problem for a
different source, and two answers to "preview a document" in one estate is the
thing this lobby exists to prevent.

## What stays here

`/notes` renders with the placeholder until this ships. No local override, no
invented cover — a wrong picture is worse than an honest empty frame, and
faking one would hide the gap.

`defaultLayout="list"` is set on the page: with a placeholder on every card the
grid was a wall of empty frames, and a list of documents is the better default
regardless. That stays either way.

**Remainder here:** none until it ships. Then drop the placeholder workaround
and pass a rendered preview as `cover`.

## Detail

- Consumer: `apps/brand/src/pages/Notes.jsx`, kol-shell `CatalogPage`, kol-component `ContentCard` / `ContentRow` at `article`.
- Versions: kol-component 0.203.0 · kol-shell 0.51.0 · kol-theme 0.145.0.
- The text slots are `title · body · eyebrow · detail · date · size · meta · tags`. Worth noting separately: an unknown prop is dropped SILENTLY — we passed `summary` and every card rendered empty with no warning anywhere. A dev-mode warning on an unrecognised text slot would have saved an hour.
