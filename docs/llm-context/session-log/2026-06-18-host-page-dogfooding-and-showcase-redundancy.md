# Session: Host-page dogfooding + the showcase-redundancy question

**Date:** 2026-06-18
**Agent:** Grim (Opus 4.8)
**Summary:** Fixed the showcase's broken Tailwind/fonts/layout by making the host pages consume KOL classes + the framework's page primitives — which surfaced that the hand-built showcase is redundant with the brand app's gallery. Ended on an unresolved architecture call, not a clean win.

## Changes Made

### Files Modified
- `showcase/src/index.css` — added three `@source` directives pointing at `../node_modules/@kolkrabbi/kol-{framework,component,loader}/src`. Root cause of the broken sidebar: Tailwind v4 auto-detection **skips node_modules**, so every utility class used only inside the workspace packages' JSX (the entire SideNav layout) was never generated. Chose the node_modules path over `../../packages/...` because it's the recipe a real consumer must copy (§6). Also added a showcase-local `body { font-family: var(--kol-font-family-sans) }` safety net, and fixed a CSS comment containing `*/` that terminated early and broke the Tailwind build.
- `showcase/src/pages/Components.jsx` — rewrote onto `<PageSection>` (framework primitive → inherits `.kol-page` container: brand width/alignment/responsive padding + `kol-prose` header). Deleted the bespoke `max-w-5xl mx-auto px-6 py-10` wrapper. Generic Tailwind type/radius → KOL classes (`kol-sans-*`, `kol-helper-*`, `kol-mono-*`, `rounded-[var(--kol-radius-sm)]`).
- `showcase/src/pages/ComponentDoc.jsx` — same KOL-class pass; root moved from bespoke `max-w-3xl px-6 py-10` to the `.kol-page` system container.
- `showcase/src/lib/ComponentPreview.jsx` — KOL mono/radius classes; removed dead `--kol-font-mono` inline style.

### Features Added/Removed
- Host pages now dogfood the design system (type scale, radius token, page container) instead of hand-rolled Tailwind. Killed the dead `--kol-font-mono` token (never existed → mono text was rendering in system Courier) across the three rewritten files.

## Current State

### Working
- Tailwind now generates the framework/component utilities → sidebar chrome renders with correct layout/padding (was bare text jammed to the edge).
- The three rewritten files use KOL type/radius/page primitives, matching the brand app's class vocabulary.

### Known Issues
- **The layout work is contested and may be moot.** User repeatedly flagged the host pages as "still wrong" through ~5 passes and rejected the whole approach. The final visual state was NOT validated by me (no screenshot of the PageSection version).
- **OPEN ARCHITECTURE CALL (the real outcome of this session):** the hand-built showcase keeps drifting off-brand because it's a parallel re-implementation of a gallery the brand app already has. `kol-monorepo/apps/brand` is already the on-brand component gallery (PageSection / ContentFilters / `/components` + `/demo`). Recommendation: this repo should do its ONE non-redundant job — publish `@kolkrabbi/kol-*` — and let the brand app be the showcase; kill or thin the hand-built showcase here. **This contradicts ARCHITECTURE §6 and is unresolved — awaiting the user's decision.**
- `ComponentDoc` now fills the full `.kol-page` width (was a 768px reading column) — unresolved design call (wide docs vs constrained measure).
- `Home.jsx` still bespoke (`<main className="p-8 md:p-12 max-w-3xl">`) — same anti-pattern, not yet on a page primitive.
- The dead `--kol-font-mono` pattern likely still exists in other showcase files (e.g. `demos.jsx`) — only the 3 rewritten files were cleaned.

## Next Steps
1. **DECIDE the showcase question before any more page work** — consolidate onto the brand app (recommended) vs. keep + thin this showcase (registry-driven, `ContentFilters` over the registry) vs. keep hand-building (not recommended). Everything below is wasted effort if the answer is "consolidate."
2. If keeping the showcase: swap the filter `<input>` for `ContentFilters` over the registry (wire once, zero per-item cost); put `Home` on a page primitive; decide `ComponentDoc` reading width.
3. Re-validate live: the `@source` Tailwind fix and the body-font safety net.
