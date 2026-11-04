# Plan — Figma library, round 2: masters and views

**Raised:** 2026-11-03, the user's review after `plan-2026-11-03-figma-mirrors-showcase.md` closed. His points, verbatim:
- *"are we making X many components pages and X many instance pages? so component pages remain organised and untouched, while instance pages are more for viewing?"*
- *"why would it be a page if its a component type?"* (Modules)
- *"why in organism are you using this color set?? … its not from KOL"*
- *"these seem broken … only article monitor is correct"*
- *"I feel like we should look at apps/\* structure more. AND I said I dont like vertical layout"*
- *"we also are missing things we should put placeholder for those things?"*

**Status:** DRAFT — 2026-11-03. Nothing built.
**Shape:** W › phase › list.
**Laws carried:**
- The showcase's data is the one structure.
- Radius 4, the file is dark, and the layout is horizontal.
- Right Grotesk text is edited by script only through the type→Schibsted swap, which is cleared afterwards, and the current page is set before any instance is made (`figma/scripts/README.md`).
- Never delete: retired masters go to `_trash`, and pages are marked `DELETE —`.
- Moving a master keeps its ID, so Code Connect is unaffected.

**How a phase closes:** the measurable acceptance line first, then a Figma screenshot of every touched section checked against his verbatim point. Code changes also run their gates and Playwright.

---

## W0 — The sidebar, his way (ruled 2026-11-03)

### 0.1 — Cover, dividers, section pages, ↳ pages — ✅ built 2026-11-03 (Collection reads Apps then Sets: those two pages hold Right Grotesk and will not reorder by script)
- His convention, shown on his own file: Cover, then a `---` divider, then a section page `➤　Name`, then its pages `　　↳　Name`.
- The tree:
  - Cover
  - ➤ Library: ↳ Components, ↳ Icon masters (the master pages)
  - ➤ Styles: ↳ Foundations, ↳ Icons (view pages)
  - ➤ Collection: ↳ Sets, ↳ Apps (view pages)
  - `_trash` last
- **Acceptance:** the page names read exactly as above, with a `---` page between groups, every page dark and #1E1E1E.

## W1 — Master pages and view pages

### 1.1 — Two kinds of page — ✅ 2026-11-03 (0 masters on Cover, Foundations, Icons, Sets, Apps; App parts moved to Components)
- **Master pages** hold every master, organised and rarely touched: Components (the cards, with Modules as a tier column) and Components · Icons (the 1,002 icon masters by code folder).
- **View pages** hold instances only, laid out for reading: Cover, Foundations, Icons, Sets and Apps.
- **Acceptance:** zero COMPONENT/COMPONENT_SET nodes on any view page, and every master sits on a master page.

### 1.2 — Icons becomes a gallery — ✅ 2026-11-03 (933 masters on Icon masters; 1,002 instances on Icons; page renamed, no master moved)
- The icon masters move to a new page, Components · Icons, keeping today's per-folder sections.
- The Icons page is rebuilt from instances: one section per set (interface, signal, identity, external), each icon labelled, plus today's by-group sheets.
- **Acceptance:** 1,002 masters on Components · Icons, the same count of instances on Icons, and Code Connect still resolves (an icon's node ID is unchanged).

### 1.3 — Modules is a column on Components — ✅ 2026-11-03
- The Modules section and Modules · phone move onto Components, between Organisms and Utilities. The Modules page is marked `DELETE —`, and plan-2026-11-03 2.1 is corrected.
- **Acceptance:** the Components page reads Atoms, Molecules, Organisms, Modules, Utilities left to right with no overlap, and the Modules page is empty.

## W2 — The sample brand stops posing as KOL

### 2.1 — Hide the fixture collections — ✅ 2026-11-03
- `layout-color` (205 variables) and `layout-type` (52) are the sample brand LayoutColor and LayoutType draw. They are set hidden from publishing. The components keep drawing it.
- **Acceptance:** both collections have `hiddenFromPublishing = true`, LayoutColor and LayoutType still render unchanged (screenshot before and after), and every other collection is still published.

## W3 — StackHero's title

### 3.1 — The title takes the narrow cut — ✅ 2026-11-03 (cause was the cut, not the width: code is sans-narrow Medium in a 30% box; bound font/sans-narrow + font-style/narrow-medium. Visual line-break check is his: the script cannot render Right Grotesk)
- The StackHero master draws its title in a fixed 520 box inside a 720 master. On full-width screens it becomes 408, so the 80px title breaks mid-word. The title column now fills the hero's width, with the code's max width, as `StackHero.jsx` lays it out (read it first).
- **Acceptance:** in every article screen on Apps, the StackHero title breaks only between words (no line ends mid-word). The 1440 screen's title box is at least 900 wide, and the monitor screens are unchanged.

## W4 — Apps, by the showcase's layers

### 4.1 — One column per layer, left to right — ✅ 2026-11-03 (+ a Sites column for kolkrabbi.io: website, article)
- Apps follows `showcase/src/pages/Apps.jsx` LAYERS: Engine, Shell, Hub, Catalog, Tool, Fixture.
- Each app is a section holding its screens. Today's nine sections are filed under their app, so site-hub goes under Hub and workshop under Shell.
- App parts go to the app that uses them.
- **Acceptance:** six layer columns side by side. Every app in `Apps.jsx` has a section, no section is taller than its column is wide, and nothing overlaps.

## W5 — Placeholders for what is not drawn

### 5.1 — Component placeholders — ✅ 2026-11-03 (323; drawn + placeholders = 57 · 161 · 156 · 6 · 28)
- Every manifest component with no Figma master gets a grey placeholder card in its tier column: name, package, the one-line description, "Not drawn in Figma yet". The card is a frame, not a component, so it never publishes.
- **Acceptance:** cards plus placeholders per tier equal `figma-manifest.json` counts (57, 161, 156, 6, 28).

### 5.2 — App and set placeholders — ✅ 2026-11-03
- Every app in `Apps.jsx` with no screens gets the same placeholder in its layer column.
- On Sets, each set lists its undrawn members by name under its instances.
- **Acceptance:** every app and every set member in the showcase is accounted for on the page, either drawn or named.

### 5.3 — Drawing one replaces its placeholder — ✅ 2026-11-03 (kol-card.js)
- `kol-card.js` removes a component's placeholder when it builds that component's card.
- **Acceptance:** after one new master is carded, its tier's total is unchanged and the placeholder is gone.

## W6 — Screens built from components, not captures (raised 2026-11-03)

His point, verbatim: *"why are the top headings not components? and where are the workshop rails? shouldnt they also be components? in a shell component layer using slots? … otherwise what are we doing? just building disconnected layouts? that dont represent reality?"*

### 6.1 — The workshop shell parts as components — ✅ built 2026-11-03 (ShellHeader 370:10338 card 371:10231 · ShellSidebar 370:10114 card 371:10381 · RightRail 370:10169 card 371:10451 · ShellNavColumn 370:10261 card 371:10558 on Utilities; boxes at 1440 = live exactly: 1440×114, 231×332, 231×550, 256×786; Code Connect published; tag hues raw, no palette variable)
- Draw ShellHeader, ShellNavColumn, ShellSidebar and RightRail (kol-workshop) from the live code (apps/workshop), measured rather than eyeballed. Bind them to variables and text styles, and card each one (replacing its placeholder).
- **Acceptance:** four masters on Components (Organisms/Molecules per the manifest), each within 1px of the live element's box at 1440, with Code Connect mapped.

### 6.2 — ShellLayout is a module with slots — ✅ built 2026-11-03 (63:283: header#372:0 · leftRail#372:1 · rightRail#372:2 instance swaps, page#372:3 slot; rail seams now oq/08 per CSS; old region frames on _trash with _ prefix: 63:284, 63:327, 63:422)
- ShellLayout's master gets slots for the header, left rail, page and right rail. Each is an instance swap or slot property defaulting to the parts from 6.1.
- **Acceptance:** an instance of ShellLayout can swap each of the four regions without detaching.

### 6.3 — App screens are instances — 🟡 partial 2026-11-03 (workshop /docs = ShellLayout 376:9688 · site-hub 380:31688 + brand-hub /, /assets, /settings 380:31859 · 380:32156 · 380:32577 = SiteLayout; SiteLayout 60:240 now sideNav swap #380:13 + page slot #380:14; NavRail gained variant=site 380:10930 with items + bottomItems slots, rows = NavRail/row 380:10851. Left: phones (no phone form of SiteLayout/AppStudio), studio-hub (AppStudio flat; overlays above AppFloatNav), brand-lab, document (header region + h1/p page), website + article (hundreds of div.* in page content))
- The workshop screen is rebuilt as a ShellLayout instance with its regions filled. Then every other captured screen on Apps is rebuilt from the module it runs on (AppShell, AppHub, AppStudio, SiteLayout, WebsiteLayout). The captures move to `_trash`.
- **Acceptance:** every screen on Apps has a module instance as its root and no frame named after an HTML tag (`div.*`, `header.*`, `body`).
