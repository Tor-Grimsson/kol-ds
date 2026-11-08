# Plan — Studio, Catalog and Hubs: finish, then out of the library

**Raised:** 2026-11-08, his review of the library's Apps chapter: *"studio studio hub? home hub?"*, *"Catalog should be a component"*, *"you put a single 'HUB' in a page for 'hubs'"*, *"just make a plan AND FINISH THE PLAN"*.
**Status:** W1 ✅ · W2 ✅ (one open difference) · W3 waits for his publish — 2026-11-08.
**Shape:** W › phase › list.
**Laws carried:** kol-figma skill (masters on tier pages only, screens = layout instances with slots, no wrapper frames, measured from live code, dark first); `docs/operations/10-figma/01-file-setup.md` (screens live in family files, not the library).
**How a phase closes:** measurable acceptance first; audit / invalid-assets / nesting-check clean; side-by-side against the live route.

## W1 — Studio is drawn whole ✅

### 1.1 — StudioCreate and StudioDetail masters ✅
- Built: StudioCreate set 1828:17090 (desktop 1684:8873 · phone 1828:16991), StudioDetail set 1828:17150 (desktop 1684:9224 · phone variant), on ↳ Modules › Hub pages. Nesting 0 fakes, invalid assets 0/0.
- Build both from `packages/shell` (the AppStudio family) as masters on ↳ Modules, measured live.
- Acceptance: both masters exist; nesting-check 0 fakes; 0 wrapper frames beyond the code's elements.

### 1.2 — studio-hub screens ✅
- Section 315:700, 18 screens: desktop Home, Sign in, Settings, Shortcuts, Create 1685:2619, Detail 1685:2879, Library 1827:19780, Studio 1827:22142, Chrome 1827:22346; phone Home, Sign in, Settings, Shortcuts, Create 1828:19894, Detail 1828:20029, Library 1828:20410, Studio 1828:20150, Chrome 1828:20342. Rail on Create/Detail/new screens = live (5 + 3 items).
- Every apps/studio-hub route (desktop + phone) as an AppStudio / AppHub instance with the new masters in its slots, real content. apps/studio (the rack) keeps its three screens.
- Acceptance: one screen per studio-hub route; 0 loose screen layers; each within ±4px of the live route on key boxes.

## W2 — Catalog and Hubs checked against live ✅

### 2.1 — Side-by-side ✅
- Catalog 01–12 (1710:27176 … 1710:31208) measured box for box against apps/catalog live, every state driven through its Variants control: header, filters, first cover, card count, page height all equal (05 = 2602, 06 = 1683). One difference found and fixed on the master: 09 search sat 12px high (ContentFilters search=open 1681:14298 had both spacers hidden) — now 69 = live, cover at y280.
- Hub pair 1712:28108 / 1712:28554 vs apps/hub: header, filters, grid, FAB all equal. One difference left: the phone pill sits at y778, live 762. The pill is an override inside AppHub phone 1470:5798 and Figma refuses to move it there; moving it on AppShell phone 385:21253 would lift the bar nav too.
- Fixed on masters: ActionButton 1265:5297 gains `chrome` inline · media (media = oq/12 chip, r4); ContentCard app 729:22760 uses media, download glyph, no mark; ContentRow app 729:22898 fill surface/secondary (live kol-row); AppStudio phone 385:22474 floatNav = AppFloatNav mobile pill at 35,762 with Home, Library, Create, Studio icons; HubHome signed-in FAB at live position (desktop 1288,64; phone variant gains the FAB at 334,24).
- Home signed-in drawn: desktop 1833:5142, phone 1833:7601 (studio-hub section now 20 screens). Live home renders it after sign-in.
- Covers stay grey: the live covers are generated images and the plugin cannot create image fills; nothing can be uploaded from here.
- Invalid assets whole file: 1508 components, 0 unused, 0 corrupt. studio-hub section: 0 unlinked, 0 overlaps, 0 loose.

## W3 — The screens leave the library

### 3.1 — Rebuilt in `layout--kol-ds-ui` (EMdyp9gS3UiMT9tYMZHF5T) — ✅ moved by hand 2026-11-08 (frames copied after his publish)
- After his library publish: Studio, Catalog and Hubs screens re-placed there as linked library instances, one page each, sections per app.
- Acceptance: same screen count as the library pages; 0 unlinked instances; 0 local components in the layout file.

### 3.2 — Library pages retired
- The three Apps pages leave the library (moved to `_trash` with `_` names, or removed on his word); masters stay on their tier pages.
- Acceptance: library has no screen pages under ➤ Apps; invalid-assets 0/0.

## His clicks
1. Publish the library after W1–W2 (before 3.1).
2. Publish again after 3.2.
