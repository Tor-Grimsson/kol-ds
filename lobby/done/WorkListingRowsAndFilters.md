---
component: WorkListingRowsAndFilters
source: kol-website/apps/web/src/routes/Work.jsx#L86-L110 (the tuned DS row) + styles/ui.css (`.work-row*`, `.work-filters*` rules) — screenshots in `_assets/2026-08-27-work-listing/`
staged: 2026-08-27
status: draft
deps: [ContentRow, ContentCollection, ContentFilters, ContentMedia, Tag, kol-theme]
---

# WorkListingRowsAndFilters — the work row's ruled values, and five defects the /work swap surfaced in the family

Ruled on screen on kol-website `/work` (2026-08-27) with a DS `ContentRow work`
beside the local `WorkListItem`. Every value below is tuned and approved
locally first; the local rules are quoted so the DS can lift them verbatim.
Seven asks.

## 1. `ContentRow work` — the ruled values

| | shipped (0.97) | ruled |
|---|---|---|
| title | `kol-mono-12 text-body uppercase truncate` | **`kol-mono-14 uppercase text-emphasis truncate`** — the typeface row's title |
| meta (type) | `kol-mono-12 text-body` | **`kol-mono-14 text-emphasis`** — the typeface row's classification ("Serif") |
| date (year) | `kol-mono-12 text-meta` | **`kol-mono-12 text-fg-64`** — the typeface row's year |
| body (description) | `kol-sans-heading-03 …` | unchanged voice/ink; the site passes its face as `bodyClass` (`work-display-preview`) — that stays consumer |
| min-height | 96 / 160 at md | **168** (`.work-row.kol-row { min-height: 168px }`) — "div 8" |
| padding | 16 / 24 at md | **16 stays at this breakpoint** (user: "16px padding, that's fine") |
| thumb | 64 / 112 at md, `thumbBorder: true` | **fills the content height — 136 in a 168 row at 16 pad**, image object-covers in the square, **no hairline** (`.work-row .kol-row-thumb > * { border-color: transparent }`) |
| frame | transparent → `fg-16` on hover | transparent → **`fg-08`** on hover (`.work-row.kol-row:hover { border-color: var(--kol-fg-08) }`) — "0 → 16 is a big jump" |

`thumbBorder` needs a seam or the ruled default; the row has none today.

## 2. The row's `md` step is dead everywhere — nothing declares a container

`.kol-row`'s step (pad · gap · min-h · thumb) is `@container (min-width:
768px)` in kol-theme — but **no ancestor in the DS declares
`container-type`**: not `ContentCollection`, not `ContentFilters`' panel. So
every row on `/stack`, `/prints`, the typeface library and `/work` renders its
base values on a 1600px screen. Ask: `ContentCollection` (and the filters
panel) declare `container-type: inline-size`. Then re-check every row's md
values against what pages have actually been approved on — they were approved
at base.

## 3. `ContentFilters` — the fluid group runs to the panel edge

`filters-tags-group-to-the-edge.png`: the Tags group (`min-w-0 flex-1`) ends
flush at the panel's right edge, 1472px wide. Ask: room on the fluid group's
right — ruled locally at `padding-right: var(--kol-spacing-12)` (48) on the
wrap (`.work-filters .flex-1 > .flex-wrap`) — and a class seam per group so a
page can adjust without a selector on Tailwind class names.

## 4. `ContentFilters` — a short group is narrow by default

Every page passes `stack: true` on its Type/Kind/Category group by hand
(`/stack`, `/prints`, typefaces, `/work`) and the user has had to ask for it
each time ("why do I have to say it every time? why do you default to
50/50?"). Ask: a group with few values (≤ ~6) stacks by default; `stack:
false` opts out.

## 5. `Tag` — the size carries its own type

`Tag` emits `kol-tag kol-tag--sm kol-helper-10`: `.kol-tag--sm/md/lg` carry
padding only (2/10 · 4/16 · 6/20) and the type rides a second helper class
paired in the atom (`sm → helper-10 · md → 12 · lg → 14`). Ask: the theme's
`.kol-tag--{size}` carries its type; the atom stops appending the helper.

## 6. `ContentRow` — `fillHeight` thumb for rows

The user's ask on `/work` was "image fill height, maintain aspect ratio" —
today the only path is a hand-computed `thumb={136}` against the row's own
height. Ask: `thumb="fill"` (or `fillHeight`) on `ContentRow` = the square is
the row's content height, whatever the row's rung.

## 7. `SectionText` on a page header — balanced lines

`/work`'s h1 runs `text-balance` via `slotClass` so no line orphans one word
(user: "don't leave one word, it's tacky"). Ask: `SectionText` headlines
balance by default.

## Recreation notes

- kol-component + kol-theme; peers unchanged.
- Bar for 🟢: versions where `/work`'s DS row renders 1 with **nothing**
  passed but content + `bodyClass`, the local `.work-row*` / `.work-filters*`
  rules deleted; a `ContentRow` inside `ContentCollection` measurably steps at
  768; the Type group stacks with no `stack` prop; `Tag sm` has no
  `kol-helper-10` in its class list.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.100.0 · kol-theme 0.69.0

(1) ContentRow work as ruled: title + type kol-mono-14 full ink, year kol-mono-12 fg-64, min-height 168, 16 padding at every width, thumb fills the content height (136×136 measured in a 168 row) with no hairline (thumbBorder false), frame transparent → fg-08 on hover (measured). (2) ContentCollection and ContentFilters' items panel declare container-type: inline-size (measured inline-size on the filters set); the work row's md step is gone — the rows were approved at base, so the container change moves nothing today. (3) the fluid group keeps 48px on its right (pr-12) and every group takes className / wrapClassName. (4) a group with ≤ 6 values stacks by default, stack: false opts out (measured: Kind with 5 values stacks with no prop). (5) .kol-tag--sm/md/lg carry their type; Tag sm's class list is kol-tag kol-tag--primary kol-tag--sm, 10px / 0.10em (measured). (6) thumb="fill" on any row — the square is the rung minus the vertical padding (the ruled 136), a definite number rather than a stretch (a min-height row has no definite cross size). (7) SectionText headlines wear kol-section-text-headline and balance (measured text-wrap: balance).

**Remainder here:** none — kol-website bump kol-component 0.100.0 + kol-theme 0.69.0; delete .work-row* / .work-filters* from ui.css; /work passes content + bodyClass only; drop stack: true and the text-balance slotClass.

