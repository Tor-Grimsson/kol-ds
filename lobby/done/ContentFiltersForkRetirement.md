# ContentFiltersForkRetirement — kol-shell forked an organism that already existed

**Staged:** 2026-08-15 · from **kol-monitor**
**Severity:** this invalidates today's four kol-shell publishes (0.1.1 · 0.1.2 · 0.1.3 · 0.2.0) — every one of them tuned a duplicate.

## The defect

`ContentFilters` already ships in **kol-component** as an organism
(`src/organisms/ContentFilters.jsx`, exported at `index.js:111`), composing the
real **`Tag`** atom. kol-shell 0.1.0 shipped a **second ContentFilters** —
recreated from the monitor/mirror twins in the AppShellSet lift — and nobody
checked whether the original existed. Monitor adopted the fork.

Worse, the fork replaced the `Tag` atom with a local **`TabStrip`** for filter
values. `Tag`'s own header states the family law: *"a Tag with no handler is a
Pill wearing the wrong name"* — `Tag` IS the interactive/filterable chip.
`TabStrip` is a handler-carrying, active/rest, multi-select chip under a
different name in a different package: the exact duplication kol-shell was
created to end.

**Both of today's rulings that produced TabStrip came from this repo and were
issued against the fork.** They should not be preserved as DS law.

## The ask

1. **Retire kol-shell's `ContentFilters` + `TabStrip`.** One organism, in
   kol-component, composing `Tag`.
2. **Fold the fork's genuine additions into the kol-component organism** before
   retiring it — monitor's four call sites pass all of these and the original
   has none of them: `layoutOptions` / `defaultLayout` (the LIST/GRID strip;
   the original uses `ViewToggle`), `iconComponent`, `headerActions`,
   `showCountOnlyWhenFiltering`, `searchKeys`, `labelClassName`,
   `renderFilterValue`. Keep `renderFilterValue` only if it survives review —
   a per-consumer value renderer is divergence as an API, and it exists only
   because the fork had abandoned `Tag`.
3. **Carry over the layout rulings that ARE real** (they were about arrangement,
   not the chip): filter block below the divider · LIST/GRID always visible,
   right · groups as columns, label above values · two ink states on the line.
4. **Fix `variant="default"`** on the organism's Tag (line ~127) — not a valid
   variant, silently falls back to `primary`.
5. kol-shell re-exports the organism, or drops it and consumers import from
   kol-component.

## What stays here

- **On ship: adopt.** Swap monitor's four call sites
  (HomePage · LibraryPage ×2 · CreatePage) to the kol-component organism,
  delete the local `renderFilterPill` seam file, and revert the consumer-side
  uppercase workarounds (tag/category values + labels) that exist only because
  the fork dropped `Tag`'s uppercase transform.

## Process note

The estate-wide sweep for other repos carrying their own content-filter copies
was not completed. Before retiring anything, check which repos consume the
kol-shell fork vs the kol-component organism vs a local twin.

## ✅ RESOLUTION — 2026-08-15 · kol-component@0.44.2 + kol-shell@0.3.0

The fork is retired and the organism is canon. kol-shell 0.1.0 recreated a component that had shipped in kol-component since 2026-08-01; four publishes on 2026-08-15 tuned the duplicate. Fixed at the real organism: the filter value is a `Tag` again with its own `active` prop and `onClick` (the invalid `variant="default"` silently rendered the FILLED chip; `secondary` is the outlined one), the layout strip moved into one row below the divider — right-aligned, always visible, `items-start` pinning it to the label row — and `iconComponent` crossed over as the fork's one genuine addition. Ink read off kol-monitor's CALL SITES, not the fork's defaults, which is what I got wrong twice: category label `text-fg-96`, value rest `text-fg-48`, value selected `text-fg-96`. kol-shell's ContentFilters + the `renderFilterValue`/`labelClassName` seams are removed (BREAKING); `TabStrip` stays for SettingsScaffold's real tabs, single-select only. Quarantined in `_tmp/2026-08-15-kol-shell-contentfilters-fork/`, not deleted. 20 gates clean.

**Remainder here:** none — kol-monitor swap four call sites from @kolkrabbi/kol-shell to @kolkrabbi/kol-component, bump component >=0.44.2 and shell >=0.3.0, delete renderFilterPill.jsx and the labelClassName props, revert the consumer-side uppercase workarounds.


## ✅ RESOLUTION — 2026-08-15 · kol-component@0.45.0

Three regressions from monitor's live QA, fixed by diffing monitor's ORIGINAL (_tmp/2026-08-15-shell-adoption/) rather than reasoning from a description. Group label now uppercases IN the component (consumers pass natural case; the label is chrome with no authoring site, same justification .kol-tag already carries for values). RECENT/SAVED is the same strip as LIST/GRID — inline spans, kol-helper-14, uppercase + 1px tracking, fg-96 active / fg-32 rest — NOT ViewToggle; the original imports ViewToggle and never renders it for this, so the filled-chip reading of the 2026-07-28 ruling is replaced on this surface. Filter/search icons back to size 16. 20 gates clean.

**Remainder here:** none — kol-monitor swap four call sites to @kolkrabbi/kol-component, bump >=0.45.0, delete renderFilterPill.jsx, revert the consumer-side uppercase on group labels.

