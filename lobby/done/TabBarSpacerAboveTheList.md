# TabBarSpacerAboveTheList — the room owed to the floating bar is reserved in the wrong place

**Staged:** 2026-09-04 · from kol-r2b2
**Change:** `MediaLibraryPages` — one block moved. `MobileTabBar` itself is correct.
**Measured:** Playwright, deployed `media.kolkrabbi.io`, 390 × 844, component 0.213.0.

---

## The defect

`MediaLibraryBrowse` renders the spacer and the bar together, **before** the folder view:

```jsx
{tabs?.length > 0 && (
  <>
    <div className="md:hidden" aria-hidden="true" style={{ height: TABBAR_H }} />
    <MobileTabBar … />
  </>
)}

{folderView === 'columns' ? ( … the list … )}
```

The bar is `position: fixed`, so where it sits in the tree does not matter. **The spacer is in
normal flow, so it matters entirely** — and it lands above the list rather than after it.

Measured:

```
spacer            height 56 · top 174     ← in the gap under the pinned search
gap search → back 80px of nothing
tab bar           fixed, top 788, height 56
last row bottom   887                     ← 99px BELOW the top of the bar
```

So it fails in both directions at once: an 80px hole punched under the search row, and the last
row still running under the floating bar — which is the exact thing the spacer exists to prevent.
Your own comment says it: *"or its last row sits under the bar forever."*

## The fix

Move the spacer after the list; leave `MobileTabBar` where it is, since `fixed` makes its position
in the tree irrelevant. Same in `MediaLibraryLibrary` — it has the identical pair at `:938`.

Worth a check that pins it, since this is invisible to anything that does not measure: **the last
row's bottom must be above the bar's top.** Presence of the spacer passes on the broken version;
only the relationship between those two numbers fails.

## Everything else in 0.213.0 is right

Verified at 390 before this surfaced, so it is clear what not to touch:

```
tab bar        fixed, 56px, 3 tabs, floats over the list        ✓
pinned search  its own row above the list                       ✓
···            present beside search                            ✓
header         3 controls, none overflowing 390                  ✓
```

## Definition of done

- [ ] the spacer renders after the list in both pages
- [ ] a check asserting the last row's bottom clears the bar's top, not merely that a spacer exists
- [ ] re-measured at 390 by kol-r2b2

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/kol-component@0.214.0

Mine, and the diagnosis was exact. MobileTabBar is fixed, so where the BAR sits in the tree is irrelevant — the SPACER is in normal flow, so its position is the whole thing. In MediaLibraryBrowse it rendered before the list and failed twice at once: a 56px hole punched into the gap under the pinned search, and the last row still running 99px under the bar. The comment directly above the block named the failure it was meant to prevent and the block sat in the wrong place anyway. Moved after the list. MediaLibraryLibrary's copy needed no move — it was already after its ContentFilters, which renders the list through renderItem, so only one page was wrong. The check asserts ORDER, per the ask: presence, size, pairing and the shared tabs gate all pass on the broken version; only the spacer-after-list assertion fails, and I ran it against a reconstructed broken variant to confirm it does.

**Remainder here:** none — kol-r2b2 bump and re-measure the last row's bottom against the bar's top.

