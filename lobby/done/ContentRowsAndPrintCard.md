---
component: ContentRowsAndPrintCard
source: kol-website/apps/web/src/routes/prints/PrintsGrid.jsx#L1-L70 + routes/Stack.jsx#L78-L110 + apps/web/src/styles/ui.css (tail)
staged: 2026-08-27
status: draft
deps: [ContentRow, ContentCard, ContentMedia, ContentText, SectionText, kol-theme]
---

# ContentRowsAndPrintCard — the row thumb is a fixed square, no thumb zoom, the print card carries its flip + rect seam, and the eyebrow has ONE name

Tuned locally on kol-website `/stack` and `/prints` (user's order: get it right
here first, then file). Four asks, one ticket.

## 1. Row thumb = a fixed square placeholder the image fits into

`ContentRow` (`article`, non-`thumbSquare` variants) sets the thumb
`self-stretch` with `ratio={null}` → `ContentMedia h-full`, so the thumb's
height comes from the row — and when the text is short (a print: name +
category), the image's intrinsic height wins and the row grows to the image
(prints list rendered 190px rows, Stack's varied per article). User: *"the
image should not control height, image should fit the row image
placeholder."* Local rule, verbatim:

```css
.kol-row .kol-row-thumb { width: var(--kol-row-thumb, 120px); aspect-ratio: 1 / 1; align-self: flex-start; }
.kol-row .kol-row-thumb > * { height: 100%; width: 100%; }
```

Ask: the row thumb is always a fixed box (`--kol-row-thumb` wide, square),
media object-covers into it, row height = max(thumb, text). `thumbSquare`
stops being a per-variant exception.

## 2. No thumb zoom on row hover

`article` / `work` rows hardcode `thumbZoom: true` with no seam. User: rows
don't zoom. Local rule:

```css
.kol-row.group:hover .kol-media-zoom > img,
.kol-row.group:hover .kol-media-zoom > video { transform: none; }
```

Ask: `thumbZoom` off on rows (cards keep their zoom).

## 3. `ContentCard variant="print"` carries what `PrintGridCard` had

The migration table (06-content-card-system.md § print · card) lists them as
dropped: the 3D flip on `isFlipped` (`selected`), the `onCardClick(rect,
slug)` FLIP-transition seam the detail overlay animates from, the image
fade-in + `loading="lazy"`, and `role="button"` + Enter/Space. kol-website
`/prints` is on `ContentCard print` now with `selected` + `onClick` reading
`event.currentTarget.getBoundingClientRect()` — the overlay works, the flip
and keyboard are missing. Ask: `selected` renders the flip; `onClick` keeps
the rect reachable (it does); `role="button"`/keyboard on interactive cards;
lazy + fade on the media.

## 4. The eyebrow has one name

The same slot is `kol-card-kicker` (kol-type-roles.css:273 — mono 12 · 500 ·
0.06em · uppercase · fg-64), `kicker` on `ContentText`, `label` on
`SectionText`, and "eyebrow" in the docs and `ContentFilters`. User: *"you
have a class for eyebrow that's not called eyebrow but kicker? you think
that's good practice?"* Ask: **`eyebrow`** — the theme role
(`kol-eyebrow`), the `ContentText` slot and the `SectionText` slot; `kicker` /
`label` / `kol-card-kicker` become aliases on the retirements ledger.

## Consumer state (kol-website)

- `/stack` list rows and `/prints` list rows are the same `ContentRow
  variant="article"` with the same slots (`kicker` `kol-card-kicker` · title
  `display-03 uppercase truncate` · body clamp 2).
- `/prints`: `ContentFilters` (Category `stack: true` · Year, LIST/GRID),
  `ContentCollection cols={{ md: 2, lg: 4 }}`, `ContentCard print` (image
  only) / `ContentRow article`.
- The two `ui.css` rules above come out on return; `/prints` is then fully
  on the set.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.63.0 · kol-component 0.94.0

(1) Every ContentRow thumb is a fixed square box by rule — .kol-row > .kol-row-thumb is --kol-row-thumb wide, aspect 1/1, align-self flex-start, its child fills it; measured article 120×120 at the top of a 120 row, work 64×64. (2) Rows never zoom — thumbZoom gone; measured transform none on hover. (3) ContentCard print carries PrintGridCard: selected turns the card (0.4s ease-out, preserve-3d — measured matrix3d rotateY 180), the media fades in with loading=lazy (ContentMedia fade), onClick's event.currentTarget is the rect, role=button + tabindex 0 + Enter/Space on an onClick card. (4) The eyebrow has one name: kol-eyebrow is the theme role (measured mono 12 uppercase 0.06em fg-64), kol-card-kicker its alias on the ledger; eyebrow/eyebrowClass on ContentText (kicker/kickerClass alias) and SectionText + every section (label/labelClass/slot key label alias) — both aliases measured rendering. Prop aliases are documented on the components; the gate cannot see props, so only the class rides the ledger.

**Remainder here:** none — kol-website bump kol-theme 0.63.0 + kol-component 0.94.0; delete the two ui.css rules; rename kicker → eyebrow, kickerClass → eyebrowClass, label → eyebrow on the sections, kol-card-kicker → kol-eyebrow at your pace (all alias for now).

