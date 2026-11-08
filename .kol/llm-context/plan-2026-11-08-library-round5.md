# Plan — Library round 5: inputs, Sets layout, hub homes, the catalog system

**Raised:** 2026-11-08, his review: Textarea *"not a single thing … is an input"*; ToggleCheckbox media *"why not use IMAGE"*; Sets *"too spread"*; *"dont you owe home hubs?"*; *"a whole [catalog] system … make a components system for it … thats how it is in the code right?"*
**Status:** DRAFT — 2026-11-08.
**Shape:** W › phase › list.
**Laws carried:** Figma follows code (fix code first); nesting = code imports, checked by key; ↳ Atoms template; one Figma writer.
**How a phase closes:** acceptance numbers; gates; I look at every touched frame at readable zoom vs code/live before he sees it.

## W1 — Fields share one base (code first)
### 1.1 — Textarea on Input's field
- Code: Textarea imports nothing but Icon — it draws its own field. Give Input and Textarea one field base (shared field classes/tokens, the way ProgressBar now shares Slider's track); Textarea = the field base, multi-line. Publish. Figma: Textarea nests the same field part as Input.
- Acceptance: one field look in code (grep: Textarea uses the shared field classes); Figma Textarea contains the field part instance (key check); rest/disabled/float match live.
### 1.2 — ToggleCheckbox media uses Image
- The `media` variant's grey box becomes an Image instance (code: check what it renders — follow it).
- Acceptance: 0 drawn picture boxes in ToggleCheckbox.
### 1.3 — Every header says who uses it
- All "Consumers: N in repo · M outside" lines on Atoms/Molecules → "Used by: <apps/packages> · outside: <repos or none>".
- Acceptance: 0 "Consumers:" lines in the file.

## W2 — Sets read as a grid
- 23 sets wrap into rows (6 per row, 200 apart, top-aligned), grouped by kind (app sets · site sets · reference sets), not one 45,000 px strip.
- Acceptance: page ≤ ~13,000 wide; 0 overlaps.

## W3 — Hub homes
- Every app that renders AppHub (growth, hub, identity, media-hub, note-hub, presentation-hub, print, rails, resume, shell — from the call sites) gets its Home screen (desktop + phone) as AppHub › HubHome instances, measured from the live app, on the Apps chapter.
- Acceptance: one Home pair per AppHub app; 0 loose layers; each beside its live capture.

## W4 — The catalog system (as the code segments it)
- Code: CatalogPage = PageShell › PageHeader › ContentFilters › CatalogGrid (ContentCard / ContentRow) › VariantsControl / SizeOrDownload / ActionButton. Figma mirrors that: CatalogGrid set (grid · list · shelf × card kinds), CatalogPage set (view × state default · filters open · search · saved · variants open × desktop · phone) nesting those parts; the 12 catalog screens become CatalogPage variants/instances, no screen-specific drawing.
- Acceptance: CatalogPage's layers are only part instances (key check); the 12 screens = 12 CatalogPage instances; each matches its live capture.
