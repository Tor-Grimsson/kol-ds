---
component: WorkListItem
source: kol-monorepo/apps/web/src/components/work/ProjectListItem.jsx#L1-L67
date: 2026-07-03
status: draft
deps: [Image, Tag]
---

# WorkListItem

## Purpose
The list/row view of a `/work` project — the counterpart to `WorkCard`'s grid tile. A horizontal card: small square thumbnail on the left, then a content column split into a header row (title + tags on the left, type + year right-aligned) above a large italic display line (the project description). Hover raises a border. Modeled on the foundry's `TypefaceLibraryItem` list variant.

## Anatomy
- Root `<div>` (row card, hover surface) — `self-stretch min-h-24 md:min-h-40 p-4 md:p-6 rounded flex items-stretch gap-4 md:gap-6 mb-4 md:mb-6 overflow-hidden cursor-pointer transition-all duration-300 bg-surface-secondary border border-transparent hover:border-fg-16`; `onMouseEnter` callback.
- **Thumbnail** (only when a thumbnail exists) — `shrink-0 w-16 h-16 md:w-28 md:h-28 rounded-[2px] overflow-hidden border border-fg-08`; `<img className="w-full h-full object-cover">`.
- **Content column** — `flex flex-col justify-between min-w-0 flex-1 gap-3 md:gap-4`:
  - **Header row** `flex justify-between items-start md:items-center gap-4`:
    - Left `flex flex-col gap-1 md:gap-2 min-w-0`:
      - Title `<div className="kol-mono-sm uppercase truncate">`
      - Tags `<div className="kol-mono-xs text-fg-64 truncate">` = `tags?.join(' · ')`
    - Right `flex flex-col items-end gap-1 md:gap-2 shrink-0`:
      - Type `<span className="kol-mono-xs md:kol-mono-sm capitalize">`
      - Year `<span className="kol-mono-xs text-fg-64">`
  - **Preview line** `<p className="text-auto text-xl md:text-5xl leading-tight whitespace-nowrap overflow-hidden text-ellipsis">`, inline `fontFamily: 'TG Malromur', fontStyle: 'italic', fontWeight: 400` = `description`.

## Variants
- **With / without thumbnail** — thumbnail block is gated on presence; content column reflows to full width when absent.
- **isActive** — a prop is declared (`isActive = false`) for "last hovered" state but is **not consumed** in the current markup. Either wire it to a visible active treatment (e.g. persist the `border-fg-16` / a surface shift) or drop it. Flagged, not faithfully reproduced.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| title | string | — | Header title (uppercased presentationally) |
| thumbnail | string | — | Thumbnail URL; block omitted when absent |
| tags | string[] | — | Joined with ` · ` under the title |
| type | string | — | Right-column label (capitalized presentationally) |
| year | string \| number | — | Right-column, below type |
| description | string | — | Large italic preview line |
| href | string | — | **Add** — row navigation target (see notes; source has none) |
| isActive | boolean | `false` | Declared but unused today — wire or drop |
| onMouseEnter | fn | — | Hover callback (parent tracks active row) |

## Styling
- Tailwind throughout; KOL tokens: `bg-surface-secondary` (row surface), `border-fg-08` (thumbnail frame), `border-fg-16` (hover border), `text-auto` (preview line), `text-fg-64` (tags + year, secondary). Typography `kol-mono-sm` / `kol-mono-xs`. Radius `rounded` (row), `rounded-[2px]` (thumbnail).
- Preview line uses inline `fontFamily: 'TG Malromur'` italic display face — map to a KOL display/italic type token, don't hardcode the family.
- **App-specific bits to DROP:**
  - Sanity `project.thumbnail?.url` shape → flat `thumbnail` URL string; likewise `project.title/tags/type/year/description` → flat props.
  - The row is not a link in source (parent list owns navigation via `onMouseEnter` tracking). As the list-view counterpart to `WorkCard`, the DS version should take an `href` and be the click target itself.
  - `uppercase` on the title and `capitalize` on the type are presentational CSS transforms — per KOL no-auto-transform rule, prefer authoring the strings in their intended case at the call site; keep the classes only if the DS deliberately enforces mono-caption casing (flag either way).

## States & interactions
- **Hover:** border transitions `border-transparent → hover:border-fg-16` (`transition-all duration-300`); fires `onMouseEnter` so a parent list can mark the active row.
- **Truncation:** title + tags `truncate`; preview line `whitespace-nowrap overflow-hidden text-ellipsis` — single-line clamp, no wrap.
- No focus/keyboard affordance today (not a real link/button) — add on recreation with `href`.

## Dependencies
- Thumbnail `<img>` → route through DS `Image` (+ `AssetPlaceholder`) for load/placeholder behavior.
- Tags render as a joined string; the DS may promote them to `Tag` chips (hence `deps: Tag`) — optional, current source is plain text.
- No router import today; add a DS link wrapper if `href` is adopted.

## Recreation notes
- **Tier:** molecule (thumbnail + two-column text row + hover border).
- **Flat props:** `{title, thumbnail, tags, type, year, description, href}` — mirror `WorkCard`'s bag so the same project object drives both grid and list views. Keep the `tags.join(' · ')` composition internal.
- **Text casing at call site:** title `uppercase` and type `capitalize` are the only casing transforms; drop them and author strings as-is, unless the DS intentionally enforces mono-caption caps (decide once, apply consistently with `WorkCard`'s meta line).
- **List pairing:** this is the row twin of `WorkCard`. A `/work` view toggles grid (WorkCards) vs list (WorkListItems) over the same project set — spec both to consume the identical flat bag so the toggle is a render swap, not a data reshape.
