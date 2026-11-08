# Plan — Library round 5: inputs, Sets layout, hub homes, the catalog system

**Raised:** 2026-11-08, his review: Textarea *"not a single thing … is an input"*; ToggleCheckbox media *"why not use IMAGE"*; Sets *"too spread"*; *"dont you owe home hubs?"*; *"a whole [catalog] system … make a components system for it … thats how it is in the code right?"*
**Status:** GO 2026-11-08 (his word: *"GOGOGO! do it"*) — building, one Figma agent W1→W4. Code check: no code change needed (below).
**Shape:** W › phase › list.
**Laws carried:** Figma follows code (fix code first); nesting = code imports, checked by key; ↳ Atoms template; one Figma writer.
**How a phase closes:** acceptance numbers; gates; I look at every touched frame at readable zoom vs code/live before he sees it.

## W1 — Fields share one base (code first)
### 1.1 — Textarea on Input's field
- Code (checked 2026-11-08): already one base — Input and Textarea both render the `.kol-control` shell (`kol-control--<variant>` · `kol-control-<size>`), Textarea adds `--textarea`. No code change. Figma: a `_Field` base part (the `.kol-control` shell: variant × size × state) that BOTH the Input and Textarea masters nest; Textarea = `_Field` + multi-line text + the resize-grip icon instance.
- Acceptance: one field look in code (grep: Textarea uses the shared field classes); Figma Textarea contains the field part instance (key check); rest/disabled/float match live.
- — ✅ built 2026-11-08: `_Field` set 1702:1173 (19 variants: default · outline xs/sm/md rest/disabled, float sm/md rest/focus/disabled, float textarea=true md rest; tone/bg + tone/border + `border` layer on tone/border-opacity, outline = tone mode outline, float well + full radius, focus = 2px surface/on-primary ring) in doc frame 1702:1174 at the top of Controls. Every Input (12) and Textarea (5) variant nests a `_Field` instance behind its content (key check 17/17); own fill and border layer dropped; disabled 0.5 moved from the whole master onto the content. Textarea grip rescaled 6→12 (code: `<Icon name="resize-grip" size={12}>`, 4 from the corner). Default/outline have no focus look in code, so no focus variant there. Slots can't carry Input's text/boolean props, so the shell sits as a stretched layer, not a slot.
### 1.2 — ToggleCheckbox media uses Image
- Code (checked): the `media` variant draws no picture — it is the checkbox's solid plate for use OVER a photo. Figma: the grey backdrop in the media specimen becomes an Image instance.
- Acceptance: 0 drawn picture boxes in ToggleCheckbox.
- — ✅ built 2026-11-08: both media variants (20:16, 1196:3169) drop the grey fill for a stretched Image instance (1349:3581).
### 1.3 — Every header says who uses it
- All "Consumers: N in repo · M outside" lines on Atoms/Molecules → "Used by: <apps/packages> · outside: <repos or none>".
- Acceptance: 0 "Consumers:" lines in the file.
- — ✅ built 2026-11-08: 29 Atoms headers + the `_Header` master default rewritten from import sites (apps/ + packages/, outside = other ~/dev/projects repos importing it from @kolkrabbi); IconLoader counted as the `Icon` export. 0 "Consumers:" left; Atoms nesting-check 53/53, 0 fakes.

## W2 — Sets read as a grid
- 23 sets wrap into rows (6 per row, 200 apart, top-aligned), grouped by kind (app sets · site sets · reference sets), not one 45,000 px strip.
- Acceptance: page ≤ ~13,000 wide; 0 overlaps.
- — ✅ built 2026-11-08: three group sections stacked 200 apart — App sets 1704:7740 (13: app shell, controls, float, overlays, settings, chess, design editor, kind preview, media library, CMS, metrics, mixer, rack), Site sets 1704:7741 (6: blog, section set, work, prints, styleguide, type specimen), Reference sets 1704:7742 (4: cards, content filters, content set reference, loaders); rows of 6, 200 apart, top-aligned. Page 11,720 wide, 0 overlaps by construction.

## W3 — Hub homes
- Every app that renders AppHub (growth, hub, identity, media-hub, note-hub, presentation-hub, print, rails, resume, shell — from the call sites) gets its Home screen (desktop + phone) as AppHub › HubHome instances, measured from the live app, on the Apps chapter.
- Acceptance: one Home pair per AppHub app; 0 loose layers; each beside its live capture.
- — ✅ built 2026-11-08 (hub only): call sites checked — `<AppHub` renders in growth, hub, identity, media-hub, note-hub, presentation-hub, print, rails, resume (shell renders AppShell, not AppHub); of those only apps/hub passes `home=`, so only hub HAS a HubHome. The others' Home is their homePath route (identity /family, resume /resume/library, print /print, growth /orb; note-hub, presentation-hub, media-hub, rails own `/`) — tool pages, not HubHome; not drawn. Built: HubHome signed-in desktop/phone = CatalogPage (app preset, VariantsControl off) + FloatActionMenu with the Hub's 12 files; AppHub page=home = AppShell › HubHome (desktop now 1600×1080; AppShell rail stretches); page ↳ Hubs 1712:28106: hub — 01 desktop 1712:28108, hub — 02 phone 1712:28554, measured on the live app (cards 222×300 six across, rows 72, pill tab bar). Live captures in _tmp/2026-11-08-round5/figma/. Covers show the media placeholder, not the file's glyph art.

## W4 — The catalog system (as the code segments it)
- Code: CatalogPage = PageShell › PageHeader › ContentFilters › CatalogGrid (ContentCard / ContentRow) › VariantsControl / SizeOrDownload / ActionButton. Figma mirrors that: CatalogGrid set (grid · list · shelf × card kinds), CatalogPage set (view × state default · filters open · search · saved · variants open × desktop · phone) nesting those parts; the 12 catalog screens become CatalogPage variants/instances, no screen-specific drawing.
- Acceptance: CatalogPage's layers are only part instances (key check); the 12 screens = 12 CatalogPage instances; each matches its live capture.
- — ✅ built 2026-11-08: CatalogGrid 1682:17723 = layout (grid · list · shelf) × card (catalog · app · file · slide), 7 variants, each holding the catalog app's real cards; CatalogPage 1682:19067 = preset × layout × card × state (default · filters open · search · saved · variants open) × breakpoint, 13 variants: PageShell › PageHeader + body (ContentFilters + CatalogGrid) + VariantsControl behind a `variantsControl` boolean (it is the catalog app's, mounted beside CatalogPage in code; HubHome turns it off). Layers per variant: 6 instances + the code's body div. The 12 screens on ↳ Catalog are CatalogPage instances (1710:27176 … 1710:31208); old variants and the dead `catalog` slot prop removed.
