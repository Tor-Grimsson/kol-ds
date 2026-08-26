# ShellHeaderFilterRefinements — three kol-shell 0.1.0 corrections from monitor's adoption QA

**Staged:** 2026-08-15 · from **kol-monitor**
**Package:** `@kolkrabbi/kol-shell` 0.1.0 — all three live in shell files;
consumers have no seam to fix any of them.

## 1. PageHeader — h1/subtitle gap lost on recreation

Monitor's retired local PageHeader carried `marginBottom: 8` on the h1;
kol-shell's `PageHeader.jsx` dropped it and replaced it with nothing — title
and subtitle now touch. Restore **on the h1 element** (inline, beside the
subtitle's existing `marginBottom: 40`), NOT in `kol-heading-sm` — margin in a
shared type class leaks estate-wide. (The subtitle's `kol-mono-14` voice is
the documented mirror-cut ruling and is not this ticket's ask.)

## 2. ContentFilters — tag chips are md, should be sm

`ContentFilters.jsx` hardcodes `<Tag size="md">` (4px 16px) in the filter
groups. Filter chips are dense chrome — `sm` (2px 10px, helper-10). Hardcode
sm, or expose a size prop defaulting sm; user's call was simply "they should
be small".

## 3. ContentFilters — layout contract for the filter region

The LIST/GRID layout toggle (TabStrip) renders AFTER the collapsible filter
block, so expanded groups push it down the page. The ruled layout:

- **Toggle at the divider level, right-aligned** — not below the groups.
- **Filter groups (Type, Tags, …) below the divider, left-aligned columns** —
  where they already render; this pins it as the contract.

Loose reference (user: "not super important, just showing something"):
kolkrabbi.io/work — sm uppercase chips, groups in left columns under the
divider row.

## Resolution — 2026-08-15 · shipped in kol-shell 0.1.1 (registry-verified)

All three landed as asked, bumped to **kol-shell 0.1.1** with a changelog entry.
20 gates clean.

1. `PageHeader.jsx` — `style={{ marginBottom: 8 }}` on the h1 element, with a
   comment naming why it is not in `kol-heading-sm`.
2. `ContentFilters.jsx` — filter-group `<Tag>` hardcoded `size="sm"`. No size
   prop exposed: the user's call was "they should be small", and a prop for a
   value with one correct setting is speculative.
3. `ContentFilters.jsx` — the layout `TabStrip` moved into the header row's
   right-aligned `flex items-center gap-8` group (beside the count + viewMode
   strip), dropping `justify-end`/`mt-4`. Filter groups untouched below the
   `<Divider>` in left columns — now pinned by the changelog as the contract.

**Shipped:** `@kolkrabbi/kol-shell@0.1.1` published and verified on the registry
2026-08-15. kol-monitor can bump. Remainder here: none.

## Correction — 2026-08-15 · shipped in kol-shell 0.1.2 (registry-verified)

**Reopened by kol-monitor on the user's verdict.** Item 3 shipped wrong in 0.1.1.
The ticket said "at the divider level"; 0.1.1 read that as the header row *above*
the divider, and the ruled layout is the row *below* it. The ambiguity was in the
ticket, the wrong read was ours — the reference build was available and not
checked against.

User's words, verbatim: *"what the fuck is list grids doing above the divider?! it
was clearly labeled below — same line as TAGS and TAGS should be same style as LIST
and GRID."*

The ruled layout, now shipped:

    All Presets  [filter] [search]         RECENT SAVED    <- header row, above divider
    ──────────────────────────────────────────────────────  <- divider
    Tags  TAG-A  TAG-B ... (only when open)    LIST GRID    <- ONE row below divider
    [cards]

1. `ContentFilters.jsx` — the layout `TabStrip` renders in one row **below** the
   divider, right-aligned, **always visible**. Filter groups share that row on the
   left and appear only while the filter toggle is open, so expanding a group no
   longer moves the strip. It is never in the header row.
2. `ContentFilters.jsx` — filter values wear the LIST/GRID strip idiom
   (`kol-helper-12`, 1px tracking, `text-fg-96` active / `text-fg-32` rest), group
   label inline on the same line. **Supersedes 0.1.1's `size="sm"` chip fix** —
   there are no chips here now; the `Tag` import is gone.
3. `TabStrip.jsx` — `value` accepts a `Set` for multi-select alongside the scalar
   single-select form. Filter values need per-value active state, and a second copy
   of the active/rest classes is the exact drift this package exists to end.

**One stated deviation.** The ruling asked for values styled like `LIST`/`GRID`;
those render uppercase because the consumer *authors* them uppercase. No
`text-transform` was added — the no-auto-casing law stands, and a consumer wanting
uppercase values authors them so.

The 0.1.1 `PageHeader` h1 gap fix stands, untouched.

**Shipped:** `@kolkrabbi/kol-shell@0.1.2`, registry-verified 2026-08-15. 20 gates
clean. **Remainder here:** none — kol-monitor bumps.

## ✅ RESOLUTION — 2026-08-15 · kol-shell@0.1.3

Second QA round, three rulings. A filter group is a COLUMN — label on top, values beneath — not label-left/values-right on one line. The group label wears the full strip idiom (`kol-helper-12`, 1px tracking). And the filter line carries exactly TWO ink states, the strip's own: active `text-fg-96`, rest `text-fg-32` (hover `text-fg-48`) — the label joins the rest ink instead of its old `text-fg-48`, and `Clear all` drops to the same recipe, so nothing on that line holds a third opacity. The block is `items-start`, pinning the always-visible LIST/GRID strip to the label row with values hanging beneath. 20 gates clean.

**Remainder here:** none — kol-monitor bump kol-shell 0.1.2 → 0.1.3.


## ✅ RESOLUTION — 2026-08-15 · kol-shell@0.2.0

The ping-pong ended with seams, not a fourth opinion. Three publishes went into re-deciding how a filter value and a group label render — chips, bare strip items, outlined pills — none of which is a design-system question. `ContentFilters` gained `renderFilterValue(value, isActive, toggle)` and `labelClassName`; the label seam REPLACES rather than stacks, per the 2026-07-30 equal-specificity law and `ListingCard`'s `titleClassName` precedent. Defaults reproduce 0.1.3 exactly so kol-mirror does not move. Minor bump — new public API.

**Remainder here:** none — kol-monitor bump kol-shell 0.1.3 → 0.2.0, author the outlined pills consumer-side through renderFilterValue.

