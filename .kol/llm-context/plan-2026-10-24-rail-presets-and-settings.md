# Plan — the rail's presets, settings on the rail, FXR's files and Labs

**Raised:** 2026-10-24, his review of the hubs after plan-2026-10-23-hubs-parity. Points verbatim: *"the rail, do you make a preset for this? like catalog has preset?"* · *"In studio what kind of settings tier is there? ITS A RAIL"* · *"I proposed a rail with tabs like labs, not page with tabs"* · *"we really should call things the same thing"* · *"fxr never had anything in home about type palettes or patterns … Editor File, Labs File, Randomised File, Morph file"* · *"EFFECTS in LABS is supposed to COLLAPSE, thats the last step … in the style we made in apps/studio-hub"* · *"ITS ENTER / EXIT and EXPAND / COLLAPSE"* · *"how can a rail be appstudio default shell? rail is a rail"* · *"app = studio, site = brand, workshop"* · *"settings should have a home in showcase … how would an agent use it without the apphub?"*
**Status:** built 2026-10-24, every phase — parity green on studio-hub 30/30, FXR 29/29, Mirror 30/30, Monitor 31/31; Labs and Settings pairs looked at. Open: nothing.
**Shape:** W › phase › list.
**Laws carried:** the rail's words are ENTER / EXIT and EXPAND / COLLAPSE, nothing else; studio-hub is the template for every Studio surface, settings included; FXR, Mirror, Monitor by name; one CatalogPage, one card; removed code goes to `_tmp/<date>-<what>/`.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words, and the screenshot pair looked at beside studio-hub's before anything is reported.

## W1 — The rail has presets

### 1.1 — `NavRail preset`: app · site · workshop (P1) — ✅ built 2026-10-24
- NavRail gets `preset`, a named row in one table the rail owns: `app` is the studio rail (the 48px icon rail that grabs open, sections enter and expand, the pill on the phone, Media · Sign in · Settings at the foot); `site` is the brand rail, brand.kolkrabbi.io, today's `variant="site"`; `workshop` is the workshop rail, ui.kolkrabbi.io, today kol-workshop's own `WorkshopSidebar`.
- AppShell passes `preset` down and reads the preset's phone shape from the same table; AppHub and AppStudio pass `preset="app"` and no other rail prop. The three props AppStudio sets today (`touch`, `railSections`, `barHiddenOn`) move into the `app` row; `barHiddenOn` stays computed from Use and `bar: false` pages.
- `workshop` is a different component today (kol-workshop's `WorkshopSidebar`). It merges under NavRail as `preset="workshop"`: NavRail renders it, kol-workshop imports it back from there, its drawing and CSS unchanged — one name, one page, no redraw. `variant="site"` keeps working as an alias of `preset="site"` for one release.
- **Acceptance:** `NavRail preset="app" | "site" | "workshop"` renders the three rails; studio-hub, the hubs, the showcase and brand-hub pass a preset name and nothing else about the rail; gates green.

### 1.2 — One page for the rail (P1) — ✅ built 2026-10-24
- The component inventory row for NavRail names the three presets and what each is for; the shell-system doc's "The rail" section points there and loses its own prose on sections. A NavRail page in the showcase shows the three presets side by side, with the words enter / exit / expand / collapse used throughout.
- **Acceptance:** searching the docs for "rail" lands on one page that names the three presets; no doc still says fold, unfold or drill.

### 1.3 — Enter and expand, one rule (P1) — ✅ built 2026-10-24
- A section enters when its rows hold sections of their own; a section whose rows are leaves expands and collapses in place. Chrome enters, Labs enters, Effects expands — studio-hub's Chrome dummy and FXR's Labs both read that way. Nothing enters past Labs.
- The expanded rows are studio-hub's: full rows, the same glyph and type, one label column in; the chevron points down expanded, right collapsed. Exit is the Back row, one level.
- The code and its comments use the four words; `fold` leaves NavRail, AppShell, TabsRow and the docs.
- **Acceptance:** on FXR at /labs after a pick, Chrome enters → Labs enters → Effects expands to Halftone, Scanline, CRT, Refraction, FX rack, Dither as full rows; Generative, Vector, Composition, Modulation expand the same way; Back exits one level.

## W2 — Settings on the rail

### 2.1 — Every hub on the rail tier, Monitor's content as tabs in the rail (P1) — ✅ built 2026-10-24
- studio-hub's tier is the rail, so FXR, Mirror and Monitor go back to it: no `page`, no `filters`, no page masthead picker. Monitor's Display · Performance · Patches, its keymap, About and Repo become tabs inside the rail, like the labs rail's levels; Mirror's Memory and Performance the same; FXR's sections stay rows.
- The Hub's rail tier draws `content` and `tabs` (a text TabsRow under the rail's header) — today it draws `sections` only.
- **Acceptance:** the Settings row on each hub opens the rail, never a page; Monitor's rail shows its tabs and each tab's content; the pass row `settings` reads "rail".

### 2.2 — Settings gets a home (P2) — ✅ built 2026-10-24
- Unparked: 2.1 changes what the rail tier draws, so the page lands with it. A composition doc and a showcase page, "Settings", naming the three tiers and how each is built without the Hub: the rail is SettingsPanel rail over SettingsSections (with `content` and `tabs` after 2.1); the page is HubSettings or SettingsScaffold; the filtered page is the same with its filter bar. AppHub's `settings` prop points there.
- **Acceptance:** searching the showcase for "settings" lands on the page; an agent can build the rail tier from it without AppHub.

## W3 — FXR's files

### 3.1 — The chrome on the card (P1) — ✅ built 2026-10-24
- A file is saved as the chrome it was made with: an Editor file, a Labs file, a Randomiser file (a simplified Labs file), a Morph file (a transition between files). They show together; the chrome is a MARK on the file card, not a filter — an IconFrame with the chrome's glyph in the cover's other corner, the same box the download wears. A color per chrome is a visual call: specimens on the open-questions page, ruled there, never decided here.
- The HubHome contract carries it as `kind: { icon, label }` on a file; the card draws the mark, the file rail lists it under details. The seed carries the four chromes; a saved preset reads its own.
- Type, Palettes, Patterns leaves the checklist doc; it was never FXR's Home.
- **Acceptance:** every FXR file card shows its chrome's mark; the four chromes appear across the seed; the rail reads Chrome: Editor; no filter group for it.

## W4 — Names and the checklist

### 4.1 — FXR, Mirror, Monitor (P1) — ✅ built 2026-10-24
- Every doc, comment, playbook line and reply says FXR, Mirror, Monitor for the three hubs; the app folders keep their names.
- The Studio parity checklist is corrected: Settings = the rail (tabs in the rail when the content is big), the rail = `NavRail preset="app"`, the FXR column per 3.1. `parity.mjs` follows the corrected rows.
- **Acceptance:** `parity.mjs` green on studio-hub, FXR, Mirror, Monitor at 1440 and 390; the Settings and Labs pairs compared beside studio-hub before the report.

## Not in this plan
- A redraw of the workshop rail under NavRail (1.1 names it only).
- The siblings adopting any of it — after his sign-off and the publish.
