# Plan — apps review (media · media-shell · the tier around them)

**Raised:** 2026-09-29, the user's review of ui.kolkrabbi.io/apps (media, media-shell, notes, presentation, search, the /apps page; 6 screenshots). Local session, after the cloud run of 2026-09-28.
**Status:** decisions ruled (§4) — nothing built yet; waiting on the user's go.
**Held for after this plan:** the workshop + showcase review (*"I keep getting the same issues and saying the same things, and I'd tackle them together after this"*). Editor #12 · #14 · #15 stay parked on his rulings.

---

## 0. The one sentence

Half of this review is the same complaint the user keeps making — the DS's own apps don't use the DS (a hand-styled input, a control of the wrong height, an inverted button, two mastheads in one app, buttons overlapping) — and it keeps coming back because **a rule said in chat binds nobody; only a gate does.** So W1 turns every repeated complaint into a gate, and W2–W7 are built under those gates.

## 1. Tags

- **DEFECT** — a law or a plain expectation is broken. Fix without asking.
- **DECISION** — needs the user. Each one carries my proposal; he says yes or overrules.
- **Where** — `package` (ships to consumers) · `app` (apps/* only) · `gate` (scripts/) · `showcase`.

## 2. Vocabulary (so we talk the same language)

From `docs/documentation/04-compositions/16-app-anatomy.md`, plus the engine tier (ARCHITECTURE §3):

| Layer | What it is | Package today |
|---|---|---|
| **Engine** | plain JS, no UI — parse, index, rank | `kol-markdown` · `kol-search` · `kol-hardware/signal` |
| **Shell** | the frame: rail, layout root, nav keys — and the phone nav | `kol-shell` `AppShell` + `NavRail` |
| **Catalog** | the ContentFilters **page**: masthead, filter + search, view toggle, LIST · GRID, cards | `kol-shell` `CatalogPage` |
| **Hub** | the standard pages around the work: Home (a Catalog), Settings, `S` sheet, walkthrough | `kol-shell` `AppHub` |
| **Tool** | the work itself: media browser, note editor, deck editor, brand book, rack | its own package |
| **Fixture** | fake mutable data + the wiring hooks the apps share | `apps/media-fixture` · `apps/workshop-fixture` |

**An app is Shell + (Hub) + Tool.** The Hub is opt-in; the Shell is not.

**markdown vs notes** (the user's question): `kol-markdown` is an **engine** — `apps/markdown` exists only to prove it, it is not a tool. `kol-notes` is a **tool** that should consume the engine. Today it does not declare it (its deps are component · icons · shell · theme; frontmatter reaches it second-hand through kol-component). Neither is a Hub. → W4 makes notes depend on kol-markdown directly.

---

## 3. Workstreams

Order: **W1 → W2 → W3 → (W4 · W5 · W6) → W7.** W1 first because every later stream is checked by it.

### W1 — Trust: every repeated complaint becomes a gate  `gate`

The user: *"its stressful not being able to trust your own site … how come we cant set up a system where i dont have to do that, or say the same things all the time."*

**The solution:** five new checks in the validate suite (below). Two read the source; three open every app in a headless browser at desktop and 390px and measure what actually rendered. A failing check blocks the publish, so a wrong height, an inverted button or an overlap can't ship. He stops being the check. Alongside that, one working rule: **a complaint he makes twice gets a check in the same session, not only a fix.**

(Why it happened: the 29 checks only enforce what was written down. His chat rulings — same height in a row, primary is the default, no overlap — never became checks, so each new app repeated them.)

| # | Gate | Catches | Kind |
|---|---|---|---|
| G1 | **variants** (extend `validate:variants`) | `variant="secondary"` / `inverse` (= inverted fill) outside an allowlist; a `Button` with no `variant`; an unknown variant | static |
| G2 | **type-in-controls** | inline type utilities (`text-*`, `font-*`, `leading-*`) on `input`/`button`/`select` in package + app source — type belongs in the component's rule (ARCHITECTURE §5) | static |
| G3 | **row-height** | controls sharing a flex row with different rendered heights (22 · 26 · 32 · 40 ladder, `09-sizes`) | headless, every app route, desktop + 390 phone |
| G4 | **overlap** | interactive elements whose boxes intersect (the hamburger over the masthead, buttons on buttons) | headless, same run as G3 |
| G5 | **tone siblings** | controls in one settings section rendering different fills (the `SettingsMulti` case) | headless, same run as G3 |

Root causes found while reading, fixed with the gates:

- **`Button` falls back to inverted.** `Button.jsx:85` — an unknown variant renders `kol-btn-secondary` (the text colour as fill), and no variant renders no variant class. → default is `primary`; unknown = dev warning + primary. **DEFECT.**
- 14 `variant="secondary"` sites + 1 `inverse` (Modal cancel, DocumentEditor save, DeckEditor save, MediaLibrary copy, ErrorBoundary, PrintBuyButton, …) → each onto `primary`, or allowlisted with a reason. **DEFECT.**
- **The kinds control** (`8 of 15 kinds`, the wrong-tone one in Settings) is `SettingsMulti` (`SettingsPanel.jsx:200`), a thin wrapper on `Dropdown`. It **hard-codes `variant="primary"`**, while its sibling `SettingsChoice` passes `variant` through and inherits the page's `kol-tone-sunken`. → take `variant` like `SettingsChoice`; one line. It *is* in the showcase — inside the SettingsPanel demo (`showcase/src/demos/SettingsPanel.jsx:31`), classified `input`, with a usage page — just not its own page. **DEFECT.**
- An earlier draft proposed an "exported = shown" check on the claim that `SettingsMulti` had no showcase page. The claim was wrong, so the check is dropped: the gap was tone, not presence.

G3 + G4 need a headless browser run (Playwright, task-scoped port, killed after). **DECISION D1:** run on `pnpm validate` (slower) or its own `pnpm validate:render`. *Proposal: its own command, required before every publish.*

### W2 — media (the tool)  `package` + `app`

| # | Item | Proposal | Tag |
|---|---|---|---|
| 2.1 | `S` overlay clips at small widths | `.kol-shortcuts-panel` gets a phone layout (one column, full-height sheet) — in `ShortcutsOverlay`, so every app gets it | DEFECT |
| 2.2 | search | MediaLibrary's four hand-rolled `.includes(q)` (`MediaLibraryPages.jsx:1825 · 2209 · 2233`, `MediaLibrary.jsx:348`) onto `kol-search` — same query language as everywhere | DEFECT |
| 2.3 | phone tabs (Browse · Files · Kinds) | **kept, not deleted**: `phoneTabs` on `MediaLibraryExplorer` stays a prop, **off by default** in the fixture. It renders `MobileTabBar` (kol-component, own showcase page), which stays too. Formats move into `…` beside view + sort (the Files pattern). The prop's use case gets written in its JSDoc | agreed |
| 2.4 | count line (`7 folders · 1 file · …`) | a display setting: on by default, off on phone and touch | agreed |
| 2.5 | search field text too big for its height | onto the `SearchInput`/`Input` atom at the row's size — no inline type (G2 catches the rest) | DEFECT |
| 2.6 | save to home screen | a PWA manifest (`display: standalone`) + Apple meta + icons per tool app (media, media-hub, notes, presentation, brand). Not a problem — it's a few static files. Each app's home page (W7) lists *"to install as an app, a repo sets …"* so consumers see the requirement | agreed |

### W3 — Shell, Hub and naming  `package` + `app`

| # | Item | Proposal | Tag |
|---|---|---|---|
| 3.1 | naming lies | **DECISION D2** — *proposal:* `apps/<tool>` = tool alone · `apps/<tool>-hub` = Shell + Hub + tool (`media-shell` → `media-hub`) · `apps/shell` = the Shell alone with a placeholder · `apps/hub` = Shell + Hub with a placeholder (today's `apps/shell` is actually this, so it's a rename + a new bare shell app) | DECISION |
| 3.2 | media-hub rail | Browse + Settings only. Library (the Hub Home), Notes, Decks, Brand out. `home` becomes opt-in on `AppHub`; without it the mark goes to the tool. Creating/editing text files is developed in notes and comes back as an opt-in | agreed |
| 3.3 | three settings | `AppHub` stops pinning Settings (`SETTINGS_ROW`) — opt-in like `AppShell`'s `bottomItems`. When a tool sits in a Hub, the tool's own gear and drawer hand over to the Hub's; alone (`apps/media`) it keeps its gear. One settings object either way | DEFECT |
| 3.4 | phone nav | **the Shell ships it, no app fixes it.** Under the phone breakpoint the rail becomes a bottom bar: first 4 items + **More** (a sheet holding the rest + Settings). 10 pages = 4 + More. An option on `AppShell` (`phoneNav="bar"`), replacing `touch="drawer"`'s hamburger where chosen. Built on the existing `MobileTabBar` (kol-component, has a showcase page) — not a new bar. **Home: `apps/shell`**, with a fixture of 10 placeholder pages so the More overflow is always exercised | DEFECT |
| 3.5 | two mastheads in one app | media-hub shows MEDIA (display) on Browse and the mono title + description on Library/Settings. **One app, one masthead.** Set once on the **Shell** — `AppShell masthead="display" \| "mono"` puts it in context, and every page inside reads it: `PageHeader`, the Hub's pages, `CatalogPage`, the tool. A Catalog used **without** a Shell takes the same value as its own prop (no shared parent to read from). A page can still override, but the check in W1 flags it. **DECISION D3:** the default — *proposal: `display`, no description (tool-frame rules 3 and 5)*; `mono` stays for apps that want it | DECISION |
| 3.6 | rail swap | tools enter a Hub through `items` and their own routes; nothing app-specific in the Shell. media-hub and a future brand-hub are just different `items` | agreed |

### W4 — notes and presentation as shelled apps  `package` + `app`

- The user: *"you shouldnt have to click to create or click a file to get to the editor … you open it and start writing, then you decide what you want to do with it."*
- `apps/notes` and `apps/presentation` **open on a blank editor**; save asks for a name and a place. The list/Catalog is a page you go to, not the landing.
- `apps/notes-hub`, `apps/presentation-hub` (per D2): Shell + Hub + the tool, with the editor, the list and the templates as rail pages.
- **Reference:** `~/dev/projects/kol-olina/apps/brand/src/pages/` (a read-only clone on the MBP) — `Landing` · `Library` · `LibraryBrowse` · `Notes` · `NoteEdit` · `SlideDeckManager` · `SlideDeckEdit` · `SlideDeckView` · `SlideDeckTemplates` · `Registry`. Not fully developed there. Read for which pages exist, how they link, and the conventions (open-on-editor, templates, view vs edit); not ported. Where olina and our conventions disagree, ours win and the difference is noted for the iMac.
- kol-notes declares `kol-markdown` and reads frontmatter from it (the engine, not kol-component's copy).

### W5 — `apps/catalog`  `package` + `app`

- The Catalog layer finally gets its reference app (talked about before, never built): `CatalogPage` over the fixture.
- `masthead: 'mono' | 'display'` — the same option as 3.5, so a consumer picks the header voice.
- Search inside is `kol-search`; `ContentFilters` moves onto it at the same time, so every consumer of the pattern gets one engine with its scopes, not its own substring match.

### W6 — `apps/search`: every search surface in one place  `app` + `package`

The point of these apps (the user): they show every feature at every breakpoint so the design can be iterated before it ships, and they are the live source of truth.

- ⌘K overlay (`ShellSearchOverlay`) **and** the results page **and** `/` focus — all in the same app.
- The suggestion row (`EXAMPLES`, plain buttons) → `Tag`.
- **The tag graph joins search.** Today it's `TagGraph` (d3) in `kol-workshop/src/tags`. The graph is a view of the same index. **DECISION D4** — *proposal:* the graph's data (tags → nodes, co-occurrence → edges) moves into `kol-search` as plain JS; the d3 component stays UI in kol-workshop for now; `apps/search` shows it as a view.

### W7 — the /apps page and one home per app  `showcase`

- /apps grouped by layer — **Engine · Shell · Hub · Catalog · Tool · Fixture** — with the §2 table at the top.
- **Engine apps are labs, not tools.** `apps/markdown` and `apps/search` exist because ARCHITECTURE §3 says an engine is proved in its own app before a consumer switches: type input, see output. On /apps they sit under Engine, so nobody reads them as products.
- `apps/search`'s home lists what it proves: the **search engine** (kol-search — query language, ranking, facets), the **tag system**, and the **node graph**.
- **Docs follow the rename (D2) in the same pass**: `16-app-anatomy.md` (layers + apps tier table), `docs/operations/07-apps-tier/` (tier rules, candidate apps), the shipped-packages table, and each app's home. The home page and the doc say the same thing, so neither drifts.
- Every app gets a home: a spec card listing its layers, the packages it consumes, and its opt-ins (search engine · Shell · Hub · PWA · fixture), its port, and what a consumer repo must set.
- The non-visual apps (`media-fixture`, `workshop-fixture`) get a reference home too: what they seed, what their wiring hooks return.

---

## 4. Decisions — all ruled 2026-09-29

| # | Question | Ruling |
|---|---|---|
| D1 | where the render checks (G3 · G4 · G5) run | `pnpm validate:render`, required before every publish — agent's call (the user: a check proposal is mine to decide) |
| D2 | app naming | `<tool>` · `<tool>-hub` · `shell` · `hub` — user |
| D3 | the masthead | `display`, no description, or `mono` — set per app, **no default** (revised by the user 2026-09-29: fxr · mirror · monitor stay mono) — user |
| D4 | where the tag graph lives | data in kol-search, d3 view stays in kol-workshop, shown in apps/search — user |
| D5 | **RULED (a), built 2026-09-29 — the touch type floor.** On a touch device every text input renders 16px (theme, `@media (pointer: coarse)` — OverlaySearchFieldZoomsIOS 2026-09-01: iOS zooms the page into any field under 16px). In a `sm` box (26px, 12px type) that is the user's "text bigger than its height" (#5). Measured: the media search at 390 touch = 16px text in a 16px line in a 26px box. Two ways out, both a design ruling: **(a) a touch rung** — on coarse pointers the whole control ladder takes 16px type and every box grows with it, so rows stay one height; **(b)** keep the floor and scale the glyphs back down visually (`transform`, iOS-only trick, can't be verified without a device). | *proposal: (a)* — it's what the platform expects (HIG body 17pt) and it's one rule in the theme, not a trick |

## 5. Not in this plan

- Workshop + showcase review — next, together. Carried into it (user, 2026-09-29): **the control preview pattern.** Button's preview has a variant dropdown and shows every size; `SettingsMulti` has neither. Every control page (Button, Dropdown, Input, SegmentedToggle, IconToggle, SettingsMulti, …) gets the same preview bar: **tone** dropdown + **variant** dropdown + **size** dropdown (all · lg · md · sm · xs). Written as a showcase pattern, not per page.
- Editor #12 (asset thumbnails) · #14 (glyph drawings) · #15 (primary hover stop) — his rulings.
- ~~**The `brand.<domain>` sites**~~ — answered by §6c-8 (2026-09-29): `apps/brand-hub` is what the DS ships for them — a client's home on `AppHub` around kol-styleguide's `Brand`, tools as opt-ins.
- Publishing — each stream's packages are bumped + changelogged, published when he says.

## 6. Proposed next — for the user's review (2026-09-29)

**Masthead: no default** (user, revising D3) — `AppShell` / `AppHub` unset = every page as its props say; media-hub sets `display`. Built.

**`AppStudio` + `apps/studio`** — the workstation fxr · mirror · monitor each hand-build (monitor.kolkrabbi.io is the reference): the Hub plus a FIXED page set, mono by default.
1. Home — the landing Catalog (RECENT · SAVED, New ‹thing›, Walkthrough); the mark goes here
2. Library — a Catalog of the content (monitor: patches, modules)
3. Create — a Catalog-headed editor page (monitor: CASE · MODULES)
4. Use — the tool, full-bleed (rack · mixer · editor)
5. opt-in pages — whatever else the app needs (monitor: Stage)
6. Settings
The app passes `app`, `home`, `library`, `create`, `use`, `pages`, `settings`; the order, keys, masthead and phone bar come with it. notes · presentation · brand can ride it too.

**Brand** — `apps/brand` stays the brand tool alone (Styleguide · Assets); the kit specimens (swatches, ramps, type ramps) stay on the showcase's component/set pages. `apps/brand-hub` = Shell + Hub + brand, pages on the rail:
Home (identity, contact, latest) · Styleguide · Assets · Profile (bio, timeline by kind — press · awards · films · profiles — companies, collaborations, social) · Operations (vendors, stack, site map, marketing playbook, open questions) · opt-in Decks · Notes · Library · Settings.
Data: kol-system (kol-client) and kol-acyr-website each hand-carry the same business-data shape (BRAND_INFO, BIO, TIMELINE, COMPANIES, COLLABORATIONS, SOCIAL, VENDORS, STACK, LIVE_SITE_MAP, MARKETING_PLAYBOOK, OPEN_QUESTIONS); kol-brand-template's manifest already has presence · press · timeline. Proposal: that shape joins the manifest schema once, kol-scrape + kol-press-research fill it, brand-hub renders it.

### 6b. Revised after the user's review (2026-09-29)

- **`apps/studio` — approved.**
- **`apps/panels`** (name open) — the layout of parameter panels: categories → sub-categories → tabs, folded sections, labeled controls, modulation, and the phone form — the pattern labs · generator · the editor inspector · the settings drawer all use. Dataset: the design editor's OWN schemas (`packages/design-editor/src/filters/*`, the generators, `AutoControls`) — already in this repo, so the bugs are fixed here with no npm round trip.
- **Brand, corrected.** `apps/brand` becomes the CATALOGUE of brand building blocks — colour options, ramps, swatches, typography, clearspace, logo displays, business card, stationery, the assets download table, the business-data table — in a shell with a sidebar. What `apps/brand` shows today (a client's brand walked through) moves to **`apps/brand-hub`**: the client's home, with notes · presentation · media as opt-in tools. notes and presentation are create tools (studio-shaped); brand-hub is a home.
- ~~`apps/brand-fixture`~~ → `apps/voyager-fixture` (see 6c).
- acyr and hrafn-dop carry brand pages too — not needed as reference.

### 6c. After the user's second review (2026-09-29) — the build list

1. **Editor chromes reachable.** `apps/editor` routes `/` (editor) · `/labs` · `/randomiser` · `/core`. **Randomiser** is the collection of two tools: **Generator** and **Effects**. Effects has its own prerequisite — the input media: you pick it first, and it is kept while you browse effects (today it often falls back to empty). Desktop and phone alike. The /apps home lists them.
2. **Gate:** every top-level view a package exports is reachable from an app or a showcase page. (Also without an app today: kol-dashboards · kol-chess · kol-content · kol-foundry · kol-store — for the showcase review.)
3. `11-shell-system.md` — the phone bar, the masthead, Hub pages opt-in.
4. **`apps/studio`** — Home · Library · Create · Use · opt-in pages · Settings, mono.
5. **`apps/panels`** — parameter panels (categories, sub-categories, tabs, folded sections, labeled controls, modulation, the phone form), on the editor's own parameter data.
6. **`apps/voyager-fixture`** — the fake client VOYAGER, from `_tmp/kol-client`: marks (7), stationery (7), deck (7), diagrams (10), graphics (41), the logo set in `public/brand/voyager` (16), its fonts (Playfair + Right Grotesk). Business data and whatever else is missing, generated in the same shape the client sites use.
6b. **`apps/fixtures`** — one page for all the fixtures, a dropdown between them (media · workshop · voyager): what each holds, shown as data — the way `apps/markdown` shows an engine.
7. **`apps/brand`** — the catalogue of brand building blocks (colour, ramps, swatches, type, clearspace, logo displays, business card, stationery, assets table, business-data table), shell + sidebar, on VOYAGER.
8. **`apps/brand-hub`** — the client's home on VOYAGER (what apps/brand shows today), with tools (notes · presentation · media) and apps (the editor) as opt-ins.

Every step ships its docs and its /apps home in the same pass.

**§6c — BUILT 2026-09-29** (one /kol-goal run; the decisions are in the session's report and the playbook): `apps/editor` routes every chrome · `validate:views` (V1) + 11-shell-system § App tier · `AppStudio` + `apps/studio` · `apps/panels` · `apps/voyager-fixture` + `apps/fixtures` · `apps/brand` (catalogue) + `apps/brand-hub`. Bumped + changelogged, not published: design-editor 0.17.0 · kol-shell 0.59.0 (AppStudio, NavRail chevron).

**Not in this plan:** the modulation button that can't be reached, and the other editor bugs → the editor review. The 3D editor → the showcase review.
