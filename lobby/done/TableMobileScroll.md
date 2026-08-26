---
component: TableMobileScroll
source: kol-theme .kol-table (kol-components-*.css) · kol-component Table
staged: 2026-08-25
status: draft
deps: [Table]
---

# TableMobileScroll — `.kol-table` has no scroll wrapper, right columns vanish on phones

## The defect (kol-website mobile audit 2026-08-25, #4)

A `kol-table` lays out at its content width and nothing around it scrolls. At 393px on
brand's `/assets` the four tables measure 668–753px, on `/reference` 24 tables up to
937px; the page itself does not scroll sideways, so Path / Color / Download / Note
columns are simply gone. Any consumer table with more than ~3 columns does this — and it is not only phones: at **768** the same tables run to 874–1106px, at **1024** `/reference` still overflows by up to 160px (six tables 1049–1187px).

## Ask

The component owns its overflow: an `overflow-x: auto` wrapper (with
`-webkit-overflow-scrolling: touch` and a `min-width` on the table so columns keep
their measure) as part of `Table` / `.kol-table`, not something every call site has
to remember. Optional: a right-edge fade while scrollable.

## ✅ RESOLUTION — 2026-08-26 · kol-theme@0.50.2

Already built — the ticket premise did not hold. `Table` renders `.kol-table-wrapper { overflow-x: auto }` around every `.kol-table` and has since the component first shipped. Measured on brand production `/assets` at 393: four wrappers, each 351 wide with 668–753 of content, `overflow-x: auto`, `scrollLeft` moves on all four, no ancestor wider than the viewport. The audit could not see it because the wrapper hides its scrollbar (`scrollbar-width: none`, the reference table chrome) and headless Chromium cannot drag — the same limit the audit downgraded its own #2 (embla dragFree) for. Nothing to build. Not done, deliberately: the optional right-edge fade — the 2026-07-28 ruling bans scroll-edge paint, and the wrapper cover gradients were deleted for it on 2026-08-09. Whether a hidden-scrollbar scroll container should carry any affordance on touch is a design call, put to the user beside the MobileTouchFloor ruling — not a lobby item.

**Remainder here:** none — kol-website none — nothing local to remove; the affordance question is a ruling, not a bump.

**Ruled 2026-08-26 (user):** no affordance. The wrapper keeps its hidden scrollbar; the cut-off columns are the affordance, as they are everywhere else in the estate. Nothing to build, nothing to bump.

