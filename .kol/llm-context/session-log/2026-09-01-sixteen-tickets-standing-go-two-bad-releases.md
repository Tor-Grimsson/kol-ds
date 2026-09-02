# Session: Sixteen tickets on arrival, the standing go, and two releases pulled back

**Date:** 2026-09-01
**Agent:** kol-ds-ui (iMac)
**Summary:** Sixteen tickets from three consumers closed the day they landed — the nine-ticket morning wave, then rolling arrivals from kol-website, kol-chess and kol-monitor — with `lobby-close` on every one. Two releases shipped broken and were deprecated same-hour (a move that kept a stale relative import; a class name minted over a live one). The user ruled tickets carry a standing go: work them on arrival, never hold the queue to ask.

## Changes Made

### The nine-ticket wave (kol-website ×8, kol-monitor ×1)
- **`ContentTextTagsSlotRendersRawArray`** — an array-valued slot never renders as concatenated text: `tags` strings become tertiary `Tag` chips, other arrays (meta) get one span per item on a flex seam. Root cause: CSS folds adjacent text nodes into ONE anonymous flex item.
- **`OverlayScrimTapDismiss`** — the scrim is a `<button>`: iOS Safari does not bubble tap-clicks from non-interactive elements. Fixed in ShellSearchOverlay AND ShellDrawer (same line), later a third time in AppShell's drawer scrim.
- **`OverlaySearchFieldZoomsIOS`** — `.kol-control--bare` marker (zero chrome) on SearchInput's bare plan; the coarse 16px floor keys on it. Sweep found QuadrantSync's two number inputs outside both shells — left, noted.
- **`ContentFiltersMobileGaps`** — `gap-3 md:gap-6` + `pr-2 md:pr-4` (same frame-air balance, half the spend) and `gap-8 md:gap-16` on the facet rows.
- **`ContentRowShowcaseImageDrivenHeight`** — `heightSm: 168` + `.kol-row--fixed-sm`: fixed below the md container, floor above; tags single-row below md so the cut lands on chips.
- **`SectionNewsletterMobileFoot`** — `py-16 md:py-24`, the family's own rung (Faq/Split carry it).
- **`SectionSplitVisualHeightRemainder`** — the bounded-frame height is `min-[901px]:` only; stacked = w-full + ratio. The 117px was the calc itself (rung 40 at 700 tall), not a grid remainder.
- **`OverlayScrimBlur`** — blur dropped, tint stays (user's call).
- **`ComponentUseGrabEdgeSubpath`** — `useGrabEdge` moved to `src/hooks/` where the wildcard resolves `.js`.

### The rolling arrivals
- **`ShellPagePadFixedOnMobile`** (kol-chess) — `--kol-shell-page-pad: clamp(20px, 5vw, 48px)`.
- **`WorkshopSearchCloseUndoneBySetText`** (kol-website) — one `closeSearch` helper; provided path is `closeTagMode()` alone (`setText` force-opens, and the trailing clear was undoing the close in its own batch). `onSelect`'s destination branch carried the same pair.
- **`ChessHeadingFontVarUndefined`** (kol-chess) — the 10 chess rules speak `--kol-font-family-sans-narrow` by name; the phantom `--kol-font-family-heading` was real but framework-tier (`kol-brand-color.css`), which app-shell consumers never import.
- **`LogomarkInlineStyleLeak`** (kol-chess) — Logomark sanitizes fetched SVG (`<style>`/`<script>`/`on*`) at cache time; an inlined SVG `<style>` is document-global. Only fetched-SVG inliner in the estate (swept).
- **`CatalogPageMobileColumns`** (kol-monitor) — the ceiling idiom in place of inline `repeat(6, 1fr)` (floors 160 grid / 240 list); third home of the cols-as-command defect.
- **`SettingsShortcutsComboOverflow`** (kol-monitor) — `LabeledControl labelWidth="auto"`: label flexes and truncates, control hugs. Real geometry: the fixed 160 label in ~176px columns left the combo 4px; every combo had painted into the 48px column gap since the block shipped.
- **`DashDetailWrapsWithoutLeading`** (kol-chess) — `.dash-lede` minted (dash-detail's ramp, line-height 1.5) for the wrapping card subtitle; footers keep `.dash-detail`.
- **`FullscreenOverlayCloseIdiom`** (kol-chess) — one close idiom: the bare `nav` glyph (user's pick); `.kol-overlay-close` at `right: 0` on the sheet's content edge.
- **`ShellDrawerOnRight`** (kol-chess) — drawer mirrored right: rail `right-0 border-l` in drawer mode, off-canvas +100%, trigger fixed top-right both states, the 08-31 travel rule retired.

### Shipped
theme 0.116.0 → **0.120.1** · component 0.149.0 → **0.152.0** · workshop → **0.26.0** · shell 0.31.0 → **0.34.0** · dashboards → **0.4.1**

### Deprecated on the registry
- **component 0.150.0** — the `useGrabEdge` move kept its relative `./motion.js` import; every barrel consumer's build broke. Caught by kol-monitor within minutes; 0.150.1 same hour.
- **theme 0.120.0 + dashboards 0.4.0** — `.dash-subtitle` minted over a LIVE class (the 16→22 sub-heading on three call sites), downgrading them to 10px. Caught by kol-chess verifying the receipt against shipped CSS; 0.120.1/0.4.1 rename to `.dash-lede`.

## Current State

### Working
- 25 gates clean, inbox and queue at zero, every receipt delivered and most already squared 🟢 by their filers with screen measurements (monitor: slivers gone at 390, combo edge exact at 1440; website: scrim tap 3/3, /studio card unclipped).
- `touch="drawer"` rendered in a real browser for the first time (kol-monitor) — works as shipped; that closes the "only a consumer can verify the drawer" gap from the last log. Then mirrored to the right the same evening by kol-chess's ruling.
- `lobby-close` used on every close — zero hand-closes, zero missing receipts, the monitor watch caught every delivery.

### Known Issues
- ⚠️ **Two broken releases in one evening, both from skipped verification of my own change.** The move that kept its relative import; the class name minted without grepping for the name first. Both caught by consumers inside the hour — the estate's receipt-verification is now the real gate. Before minting ANY class: grep the name.
- ⚠️ **The gates resolve no relative imports** — a broken intra-package import rides through all 25 green. A resolve gate would have caught 0.150.0.
- ⚠️ **`lobby-close` flips glyphs but never decrements the Queue header** — the count drifted three times tonight and was hand-squared each time.
- ⚠️ Closed 🟢 rows accumulate in the Queue table (lobby-close leaves them in place); rows from 08-31 sit there too. Squaring rows into Closed is the user's call, not done.
- 📌 On-device re-checks riding consumer deploys: chess (/insights lede leading, /settings gutter, right-drawer + long-title-under-X frame, hero metrics in RG Narrow), website (Sanity routes on production).

## Next Steps
1. A `resolve` gate: import every package barrel in a node/esbuild pass so a moved file's stale relative import fails before publish.
2. The user's ruling stands as procedure: tickets run on arrival (memory: `lobby-tickets-standing-go`).
3. Queue-header arithmetic belongs in `lobby-close` — a dotfiles ticket if it recurs.
