# OneVariantsControl — stop inventing controls: the layout switcher is catalog's variants panel

**Staged:** 2026-10-29 · from kol-website (user, on the LayoutsAppUnusable fix: *"why are they reinventing the wheel? we already have a component for this … stop being so stupid"*)
**Files:** `lobby/_assets/OneVariantsControl/` — `layouts-invented-switcher.png` (what apps/layouts shipped), `catalog-variants-panel.png` (what already exists)

---

## The problem
LayoutsAppUnusable asked for a layout switcher outside the layouts. apps/layouts invented a new control for it: a pill of four segments pinned bottom-centre. The system already has this control, and the user has used it for weeks: catalog's variants button. It's a round `slider-01` button pinned top-right that opens a `PopoverPanel` of labelled `SegmentedToggle` rows (Preset · Card · Row · List · Columns · Width · Media · Zoom). Every option is visible and one click away, and nothing floats over the page.

That control is still hand-built inside `apps/catalog/src/App.jsx` (`VariantsButton`), not shipped. That is why a second app could invent its own instead of importing it. **This is the habit to stop: before building any control, look for the one the system already has. If it lives inside an app, ship it, don't copy or reinvent it.** The same rule broke three other things this week: the ASCII cursor's lost fix, the PDF tools and the article renderer.

## The fix
1. **Ship it:** catalog's `VariantsButton` becomes a kol-component export (name yours, e.g. `VariantsControl`): the button, the popover, and `axes = [{ key, label, values | options }]` → labelled segmented rows, `value` / `onChange` per axis. The position (pinned top-right at the shell's page pad) and the shadow are carried as they are.
2. **catalog** uses the export, with `VariantsButton` removed from its App.
3. **apps/layouts uses it.** Its axes are `Layout` (SiteLayout · AppShell · ShellLayout · WebsiteLayout) and `Page` (the pages that fit that layout) — see point 7. The invented bottom pill goes. The keep-the-page-when-switching behaviour stays.
4. **Sweep:** grep the apps for other hand-built copies of this pattern (a pinned button opening segmented rows) and move them onto the export.

## Also, from the user on 5212 (same pass)
5. **`/site/CategoryPage`: wrong indent** (`categorypage-indent.png`). The header ("Research" and its lede) starts about 330px to the right of the card grid below it. The title, the lede and the cards share one left edge, the content column's, as they do on brand's and record's category pages.
6. **`/site/PageHero` shows a "← Back"** (`pagehero-back.png`). On its own page the hero has nothing to go back to. Back belongs to a page reached from a parent, so it shows only when the page has one, or the fixture passes none. Check that every page in apps/layouts shows only what a real page of that kind shows.

7. **Fundamentally: the pages don't belong in the rails.** User: *"the pages dont have to be in the siderail, they just have to be in the action menu selector."* The variants control is the whole chooser: one `Layout` row and one `Page` row listing the pages that fit the chosen layout. The user then added *"or both"*. The control is required and is the one place layout and page are always chosen. A layout's rail may also list the pages, but nothing depends on it. Without the control, the rail alone is not enough, which is how a layout came to have no way out.

8. **A page says what it is** (`pagesection-no-context.png`). User: *"there is no way to understand what you are looking at, pages need some text, some information."* `/site/PageSection` is a title, a lede and an empty dashed box, and nothing says that this is `PageSection`, what it is for, or what goes in the box. Every page needs its information in one consistent place, for example the variants control's panel or a small info strip that never sits inside the page itself:
   - the component name and package
   - one line on what it is for
   - where it runs today (brand, record, kolkrabbi.io, studio-hub…)
   - the other layouts it fits

   The page itself is filled the way it is used. An empty placeholder box is not a demonstration, so put real fixture content in it.

9. **The test logos don't flip with the theme** (`brandassets-black-marks.png`). On `/site/BrandAssets` in dark mode, VOYAGER's logomark and wordmark draw black on black. `AssetTable` inlines the SVG and passes the ink through `currentColor`, but `voyager-fixture/src/assets/marks/*.svg` hard-code `fill="black"` (logomark-01/02, lockup-horizontal/vertical-01/02, …). The fixture's marks become `fill="currentColor"`, as the KOL icon rule requires, and every fixture asset that renders a mark is checked the same way.
10. **The list double-counts.** `Brand` (the tool) is listed beside `BrandBook` and `BrandAssets`, which are its two pages, so the same page appears with and without its wrapper. List the page a real site runs (`Brand`) and show its parts inside it.

11. **`AssetTable` doesn't use its width** (`assettable-width.png`, `assettable-path-wraps.png`). This is the component, so brand's `/assets` gets it too. The table stops at about 1140px with empty space to its right, and its last column is clipped ("Co…", with the download chips cut off), so it neither fills the content column nor scrolls cleanly. Inside it, Path is the narrowest text column and wraps every path at the slash (`marks/` ⏎ `logomark-01.svg`). The fix: the table runs the content column (`Table width="column"`, which exists for data tables); Path never wraps and gets the width it needs, taken from Preview, which has more than it uses; and nothing clips. Check at 1440 and 1280.

12. **No page uses sections or sub-pages.** User: *"no pages use section headings? or sub pages to sections"*. The site rail in apps/layouts is one flat list of component names, so none of what `SiteLayout`'s tree supports is shown:
   - a category with pages
   - a foldernote with sub-pages and its `CategoryPage` overview
   - a group label
   - section rows (`/page#section`, lit by scroll, as brand's `/brand#about` and the book's chapters are)

   Each layout shows its nav the way a real app of that kind uses it. For SiteLayout that means at least one category with sub-pages, one foldernote opening its overview, and one long page whose sections are rail rows. The other layouts show their equivalents (AppShell's grouped rail, ShellLayout's sidebar tree and TOC rail, WebsiteLayout's takeover links).

13. **`/site/MarkdownPage` is cut off three-quarters down** (`markdownpage-clipped.png`). The document stops mid-line (the "1.1 Kickoff" heading is sliced through) at about 940px, and the rest of the page is empty. The page is clipped by a fixed-height or `overflow: hidden` box instead of scrolling. In record and brand the same `MarkdownPage` scrolls the whole document, so this is apps/layouts' page wrapper. Every page scrolls its full length in its layout, as it does in a real app. Check the long ones: MarkdownPage, BrandGuide, Brand, KitPreview, ResumeSource.

14. **`/site/A4Pages` stacks every sheet down one long scroll** (`a4pages-stacked.png`). User: *"one in view at a time, then next … we are not reinventing anything, just LOOK AROUND."* Sheets are viewed one at a time with previous/next and `n / N`, the paging the system already has. That is `QuickLookFrame`'s `nav` (`index · total · onPrev · onNext`, used by MediaLibrary, DocumentIndex and record's Documents to page through PDFs one sheet at a time), with deck's `SlideStage` filmstrip as the other existing one-at-a-time pattern. Use one of those. Do not build a new pager. The sheet is also pinned to the right edge with a dead band on its left: centre it in the plane.
15. **`/site/PrintStudio` is a tool crammed into a site** (`printstudio-in-sitelayout.png`). User: *"what in the world is this bullshit?"* Inside SiteLayout it opens a second dark side panel next to the site rail (two rails side by side), then a light-grey canvas with the sheet floating in it, and the variants button sits on top of the sheet. Its content is a parser probe (`# Probe`, `Lead.`, `> A quote.`, `const a = 1`, `b()`), which isn't a document anyone would print.
   - **Where it belongs:** PrintStudio is a tool, so it belongs under AppShell (as apps/print runs it), not on a site page. Either place it under AppShell only, or show it in SiteLayout the way a site actually embeds it.
   - **Content:** the fixture document is a real VOYAGER document: a brief, a proposal or a contract, with headings, a table and notes.

16. **The resume kit's controls are hand-built, with nothing from the DS** (`resumelibrary-inline.png`). User: *"nothing here is DS, all inline."* kol-resume carried record's code verbatim, as ResumeKit asked, and record had hand-built its controls:
   - `KitOptions.jsx`: raw `<input type="checkbox">` inside `<label>`, raw `<input>` for Role and Company, a hand-built `LangToggle`, and a bordered `<div>` as the panel
   - `ExportButtons.jsx`: raw `<button>` with a class string
   - `ResumeLibrary`: treatment cards as bordered `<div>`s

   The kit's logic stays, and its controls move onto the system's parts:
   - the options panel → `SettingsSections`, or the variants control from point 1
   - Language → `SegmentedToggle`
   - Pages in PDF → `ToggleCheckbox` rows
   - Role and Company → the DS text input
   - Open / Download PDF / SVG → `Button`
   - the treatment cards → the DS card the catalog uses (`ContentCollection` / `CatalogPage`)

   Then sweep the rest of kol-resume (Source, Treatment, KitPreview's toolbar) the same way. Record runs this package, so it gets the fix by bumping.

## Definition of done
- [ ] the variants control is a shipped component, and catalog runs on it
- [ ] apps/layouts switches layouts through it; the bottom pill is gone
- [ ] other copies swept
- [ ] layout and page always choosable in the variants control (a rail listing them is optional)
- [ ] every page carries its info (name · package · purpose · where it runs · other layouts); no empty placeholder boxes
- [ ] fixture marks on `currentColor`; `Brand` listed once, not beside its own pages
- [ ] AssetTable runs the content column, Path on one line, no clipped column
- [ ] each layout's nav shown as used: categories, sub-pages, foldernote overview, section rows
- [ ] every page scrolls its full length, nothing clipped
- [ ] A4Pages one sheet at a time on the existing paging (QuickLookFrame nav or SlideStage), centred
- [ ] PrintStudio placed where a tool belongs, with a real fixture document
- [ ] kol-resume's controls on DS parts (no raw input/button/label, no hand-built toggle or card)
- [ ] CategoryPage header on the content column; PageHero without Back when there is no parent
- [ ] published


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-component 0.312.0**, with `VariantsControl` (molecules).
- **Shipped as it was:** catalog's `VariantsButton`, carried line for line. The `slider-01` button pinned top-right at the shell's page pad with its shadow, the `PopoverPanel` of labelled `SegmentedToggle` rows, `axes = [{ key, label, values | options }]`, `value`, `onChange(key, v)`. One addition, `style`, lets a host whose own chrome holds that corner move it.
- **catalog** runs on it, and its `VariantsButton` is gone.
- **Swept:** apps/shell and apps/rails had the same hand-built copy, and both run on the export now.
- **apps/layouts** switches through it with one `Layout` axis (SiteLayout · AppShell · ShellLayout · WebsiteLayout), and the bottom pill is gone. It keeps the page when switching. In AppShell, ShellLayout and WebsiteLayout the frame's chrome holds the top-right corner (the Hub's actions, the shell header's icons, the website's menu button), so the button drops just below it there.
- **Walked:** catalog (eight axes, a pick registers), shell and rails (Rail → Site swaps the rail), and layouts (switched through all four and back, the page kept). Classified and previewed.
