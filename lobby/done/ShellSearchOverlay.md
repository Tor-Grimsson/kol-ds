---
component: ShellSearchOverlay
source: kol-monorepo/apps/web/src/components/shell/ShellSearchOverlay.jsx#L1-L118
date: 2026-07-03
status: draft
deps: [SearchInput]
---

# ShellSearchOverlay

## Purpose
The Cmd/Ctrl-K command palette: a centered card floating over a blurred backdrop, with a bare search input and a live, highlighted result list filtered across item labels/tags/headings/keywords. Selecting a result navigates and closes. Opened by `ShellLayout`'s key handler. Distinct from the DS `Modal` (which is prompt/confirm only) — this is a search/command primitive.

## Anatomy
```
<div fixed inset-0 z-300 flex items-start justify-center pt-[20vh]>
  <div absolute inset-0 bg:rgba(0,0,0,0.6) backdropFilter:blur(1px) onClick={onClose}/>  ← backdrop
  <div class="bg-surface-primary border border-fg-08"
       (relative, w-full, maxWidth 32rem, mx-4, borderRadius 22px, boxShadow, overflow hidden)>
    <SearchInput bare value={query} onChange autoFocus onKeyDown={handleKeyDown} placeholder="Search…"/>
    {results.length > 0 &&
      <ul class="border-t border-fg-08" (maxHeight 320px, overflowY auto, py 4px)>
        {results.map(item →
          <li><button class="shell-nav-item" (w-full, flex, gap 8) onClick={handleSelect(item.path)}>
            <span (flex-col, minWidth 0)>
              <HighlightMatch label={item.label} query={query}/>       ← match slice underlined
              {matchedHeading && <span>§ {matchedHeading}</span>}?
              {matchedKeyword && <span>⤷ {matchedKeyword}</span>}?
            <span (ml-auto, opacity .48, 11px)>{item.sectionLabel}</span>
```
`HighlightMatch` (L5-L17) slices the label around the first case-insensitive match and underlines it (`--kol-surface-on-primary`, 2px underline).

## Variants
- **Result source** — uses `items` prop directly if given, else flattens `routes` into `{ ...child, sectionLabel: section.label }` (L24-L29).
- **Empty query / no matches** — the `<ul>` isn't rendered; only the input shows.
- **Secondary match rows** — a result optionally shows `§ heading` (matched heading) and/or `⤷ keyword` (keyword matched when label+heading didn't) beneath the label.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| isOpen | bool | — | mount/unmount the overlay |
| onClose | fn | — | backdrop click, Escape, and post-select |
| routes | array | `[]` | fallback source, flattened into items when `items` absent |
| basePath | string | `'/'` | prefix for navigation (`${basePath}/${path}`) |
| items | array | — | pre-built search index: `{ id, label, path, tags?, headings?, keywords?, sectionLabel? }` |

## States & interactions
- **Query state** local (`useState('')`); reset to `''` whenever `isOpen` flips false (L32-L34).
- **Filtering** (L36-L48): case-insensitive `includes` across `label` / `tags[]` / `headings[]` / `keywords[]`; computes `matchedHeading` and a `matchedKeyword` (only when label+heading missed). Empty query → no results.
- **Keyboard** (`handleKeyDown` on the input): **Escape** → `onClose`; **Enter** → select the first result (`results[0].path`). No up/down arrow navigation or roving highlight today (flag).
- **Select:** `navigate(`${basePath}/${path}`)` then `onClose`.
- **Focus:** input `autoFocus` on open; no focus-trap around the card (flag).
- Cmd/Ctrl-K itself is wired in `ShellLayout`, not here — this component only reacts to `isOpen`.

## Styling
- Mostly inline styles (positioning, card radius `22px`, backdrop blur, shadows) + a few Tailwind/KOL tokens: `bg-surface-primary`, `border-fg-08`, and the `shell-nav-item` row hook. Highlight color `--kol-surface-on-primary`. Card `maxWidth: 32rem`, offset `pt-[20vh]`, `z-index 300` (above the drawer's `200`).
- Uses DS `SearchInput` in **`bare`** mode (borderless inline field) — keep.
- **App-specific bits to DROP / convert:**
  - **KOL item shape is assumed** (`label`/`path`/`tags`/`headings`/`keywords`/`sectionLabel`) and rows are hardcoded to it. Generalize: take an **`onSelect(item)`** callback instead of navigating internally, and a **render-prop** (`renderResult(item, { query })`) for the row so the palette is content-agnostic. Keep the current KOL row + `HighlightMatch` as the default renderer.
  - **react-router `useNavigate` + `basePath` join** (L2, L21, L50-L53) — replace with `onSelect(item)`; the consumer decides how to navigate.
  - The fuzzy-match fields (`tags`/`headings`/`keywords`) are KOL-doc-specific — keep as the default matcher but allow a `filterFn`/`getSearchText(item)` override so non-doc apps can search their own fields.
  - Inline styles could move to Tailwind/DS tokens on recreation (card radius, backdrop) but are functionally fine.

## Dependencies
- **@kol/ui:** `SearchInput` (bare mode).
- **react-router-dom:** `useNavigate` — to be replaced by `onSelect`.
- React `useEffect` / `useState`.

## Recreation notes
- Tier: **molecule** (overlay/command-palette primitive). New DS primitive — do not fold into `Modal`.
- Prop seams to keep: `isOpen`/`onClose`, `items`. Add **`onSelect(item)`** (drop internal `navigate`/`basePath`) and **`renderResult`** + optional **`filterFn`/`getSearchText`** so the list is generic. Keep `routes`/`basePath` only as an optional convenience adapter, if at all.
- Compose **SearchInput** `bare` (already used) — don't re-roll the field.
- Add the palette hygiene the DS will expect: **arrow-key result navigation with a highlighted/active row, focus-trap, and Escape** (Escape already present). Keep `HighlightMatch` as the default row highlighter.
- Keep the "select first result on Enter" behavior as the default even after adding arrow navigation.
