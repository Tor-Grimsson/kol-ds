---
component: MediaCard
source: kol-media-admin/src/MediaCard.jsx#L1-L72
date: 2026-07-03
status: recreated
deps: [Icon, SelectCheckbox (→ DS ToggleCheckbox)]
---

# MediaCard

## Purpose
Grid tile for one media object (image / video / file): a square thumbnail with a top-right download overlay — or a top-left select checkbox in multi-select mode — then name / meta / actions stacked below. The grid-view counterpart to `MediaRow`. Used in the kol-media-admin file grid.

## Anatomy
- `<li>` card — flex column, bordered, rounded, clipped
  - thumbnail box (`aspect-square`, relative)
    - thumb slot (fills the box)
    - corner overlay:
      - select mode → checkbox chip (top-left)
      - else → download button (top-right)
  - body (`p-3`, flex column, gap)
    - name slot
    - meta line (one line of secondary text)
    - actions slot (hidden in select mode)

## Variants
- **Default** — download overlay top-right, actions shown.
- **Select mode** — download replaced by a checkbox chip top-left; the whole card is a click target; actions hidden.
- **Selected** (within select mode) — stronger card border.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| thumb | node | — | square thumbnail content |
| name | node | — | name cell (text or inline editor) |
| meta | string | — | one-line secondary text, e.g. `"1.2 MB · 2026-06-19"` |
| actions | node | — | action-button row (hidden in select mode) |
| downloadHref | string | — | download overlay href; omit to hide the overlay |
| selectMode | bool | false | swaps download→checkbox, makes the card clickable |
| selected | bool | false | stronger border + checked box |
| onSelect | fn(event) | — | card click in select mode; event carries `shiftKey` for range select |

## Styling
- Card `<li>`: `flex flex-col rounded overflow-hidden border bg-fg-02`; border color set inline — `var(--kol-fg-12)` default, `var(--kol-fg-64)` when selected.
- Thumb box: `aspect-square relative`.
- Checkbox chip (select mode): `absolute top-3 left-3 rounded p-1`; bg `var(--kol-fg-absolute-12, rgba(0,0,0,0.4))`; `backdrop-filter: blur(4px)`.
- Download button: `absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded text-fg-default hover:bg-fg-absolute-24 transition-colors`; same translucent bg + blur; `stopPropagation` on click. `Icon name="download"` @16.
- Body: `p-3 flex flex-col gap-2`.
- Meta line: `kol-mono-12 text-fg-48`.

## States & interactions
- **hover** (download button): `hover:bg-fg-absolute-24`.
- **selected**: border `--kol-fg-64` + checked box.
- **click**: default → the thumbnail's own onClick (parent-supplied, e.g. open a lightbox); select mode → `onSelect` toggles from anywhere on the card, while the download button `stopPropagation`s.

## Dependencies
- `Icon` (download glyph) → DS `Icon`.
- `SelectCheckbox` — a 16px square check indicator. **The DS already ships `ToggleCheckbox`** (`packages/component/src/atoms`); map the checkbox to that rather than recreating a new one.

## Recreation notes
- Tier: **molecule** (composes Icon + a checkbox atom; otherwise pure slot layout).
- Keep it **presentational** — `thumb` / `name` / `actions` are slots the consumer fills; don't bake in media loading, fetch, or rename logic.
- Grid track sizing (`minmax(260px,1fr)`) lives in the **parent list**, not the card — leave it out; the card just fills its cell.
- The translucent overlay bg uses `--kol-fg-absolute-12` (theme-invariant black) so it reads on any thumbnail — keep it as a token; the `rgba(0,0,0,0.4)` is only a fallback.
- Decide `downloadHref` (an `<a href>`) vs. an `onDownload` callback slot — the consumer points at a proxy endpoint; the DS may prefer a callback.
