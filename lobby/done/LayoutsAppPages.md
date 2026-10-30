# LayoutsAppPages — apps/layouts: every page as a person would use it (points 5–18)

**Staged:** 2026-10-29 · from kol-website. These are points 5–16, appended to OneVariantsControl while it sat in the inbox. That ticket's resolution covered points 1–4 only, the control and the pill. Points 17 and 18 are new.
**Files:** `lobby/_assets/LayoutsAppPages/` — the user's screenshots, one per point

The user walked apps/layouts page by page on 5212. Every point below is something a person sees in the first seconds of opening the page. **Walk each page the same way before closing: open it, scroll it, read it, at 1440 and 390.**

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
17. **`/site/ResumeTreatment` is a mess** (`resumetreatment.png`). User: *"again what in the world is this?"*
   - The sheet opens scrolled past its top: the header row is cut off at the viewport edge.
   - The kit's own "Download PDF" and "Options" buttons float top-right on top of the `VariantsControl` button. They overlap, and "Options" reads as "ons".
   - The sheet sits right of centre on a grey backdrop, and a black band runs along the bottom.

   The treatment opens at its top, centred in the plane, with its toolbar placed so nothing overlaps the variants control (the same corner rule as AppShell). Same check for `KitPreview` and `ResumeSource`.
18. **`/site/Decks`: the filmstrip covers the side rail** (`decks-filmstrip-over-rail.png`). User: *"why does the bottom rail go over the siderail?"* `Decks` pins its filmstrip to the viewport and offsets it with `railLeft`. Brand passes `railLeft="var(--kol-sidenav-w)"` (as brand-hub's DecksTool does); apps/layouts passes nothing, so the strip starts at 0, over the rail.
   - Pass it in every frame with that frame's rail width.
   - Better: `Decks` reads the frame's rail width itself, so no host can get it wrong.
   - The deck opens on an "OLINA PRODUCTIONS / Credentials" slide, which comes from another client's app. The fixture deck is VOYAGER's.

19. **`VariantsControl` should be draggable** (`variants-button-in-the-way.png`). User: *"action button should be draggable if it's in the way of something."* On MediaLibrary it lands on the bucket picker's delete button. The corner rule can't know every page's controls, so the user moves it: the button drags anywhere within the viewport, the place is remembered per app (local storage), and a double-click puts it back in its corner. A drag never opens the panel; a click still does. This is kol-component's `VariantsControl`, so catalog, shell, rails and layouts all get it.

## Definition of done
- [ ] every point above fixed and walked by hand at 1440 and 390, page by page
- [ ] CategoryPage on the content column · PageHero without Back when there is no parent
- [ ] every page carries its info (name · package · purpose · where it runs · other layouts); no empty placeholder boxes
- [ ] fixture marks on `currentColor`; `Brand` listed once
- [ ] AssetTable runs the content column, Path on one line, no clipped column
- [ ] each layout's nav shown as used: categories, sub-pages, foldernote overview, section rows
- [ ] every page scrolls its full length
- [ ] A4Pages one sheet at a time on the existing paging, centred
- [ ] PrintStudio placed where a tool belongs, with a real fixture document
- [ ] kol-resume's controls on DS parts; ResumeTreatment opens at its top, centred, no overlapping buttons
- [ ] Decks' filmstrip clears the rail in every frame; a VOYAGER deck
- [ ] VariantsControl draggable (remembered, double-click resets, drag never opens it)
- [ ] published


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-component 0.313.0 · kol-framework 0.62.4 · kol-styleguide 0.15.0 · kol-resume 0.2.0 · kol-deck 0.2.2** (and kol-print 0.1.1, a description). apps/layouts walked page by page at 1440 and 390.
- **5:** CategoryPage's hero was a flex item with auto margins, so it shrank to its text and centred. It now stretches, and the title, lede and cards share one left edge (312 = 312).
- **6:** PageHero renders as a page reached from the rail: no Back, on VOYAGER. Every page whose preview was a specimen renders as its app uses it instead: SiteHero, PageSection, CategoryPage, MarkdownPage, A4Pages, PrintStudio, Brand, BrandGuide, the chess apparatus, DocumentationReader and ResumeTreatment.
- **7:** the variants control is the chooser. It has a Layout row, one row per group of the layout's pages (Home · Brand · Pages · Documents · Resume · Tools in SiteLayout), and the layouts' navs list them too.
- **8:** the panel says what the page is: name and package, what it is for, where it runs, the other layouts it fits (placements.js `PAGE_INFO`; `validate-placements` requires it). PageSection holds three VOYAGER routes as cards, not a dashed box.
- **9:** VOYAGER's seven mark files are on `currentColor`, and the fixture's self-test refuses a fixed black.
- **10:** Brand is listed once. BrandBook and BrandAssets are its two pages (NOT_A_PAGE with that reason).
- **11:** AssetTable runs the column. Path is on one line, and Format, Dimensions and Color take their content's width. Name wraps at its words, the preview scales, and Download no longer clips. At 1440 it fills the brand book's 950px column with no scroll. At 1280 that column is 790px against a 945px minimum for the seven columns, so it scrolls sideways inside the column; no cell is clipped and no path wraps.
- **12:** SiteLayout shows Home as a link, Brand as a foldernote whose chapters are section rows under group labels (lit by scroll), Documents as a foldernote opening its CategoryPage overview, and the rest as categories. AppShell shows a section row per group. ShellLayout shows the groups as spaces with the sidebar tree and the TOC rail. WebsiteLayout's takeover links name the groups.
- **13:** every page scrolls its full length (MarkdownPage, BrandGuide, Brand, KitPreview, ResumeSource checked) and opens at its top.
- **14:** `A4Pages paged` shows one sheet in view, centred, with QuickLookFrame's ‹ › and `1 / 2`. Print still prints every sheet.
- **15:** PrintStudio is placed under AppShell only, as apps/print runs it, on a real VOYAGER document: `voyager-fixture/documents/field-manual-brief.md`, a project brief with a key-value table, a schedule table, notes and marks. MarkdownPage, A4Pages and DocumentationReader read the same brief.
- **16:** kol-resume's controls are DS parts: `ToggleCheckbox`, `Input`, `Button`, `PopoverPanel`, `SectionText`, `LabeledControlSection`, and `ContentCard` with icon actions. The files wall shows only where the host serves `/api/out`, which `kitExportPlugin` now does (record's endpoint, carried).
- **17:** a treatment opens at its top with its controls in a sticky toolbar, clear of the variants control. The backdrop band is gone (`flow-root`), and on a phone the sheet scrolls in its own box.
- **18:** the filmstrip measures where the editor starts: 264 against the site rail, 48 against the app rail. The seed deck's words are VOYAGER's; it had carried another client's name, a real person and real brands.
- **19:** VariantsControl drags. The spot is remembered and survives a reload, a double-click resets it, a drag never opens the panel and a click does. On a phone its long rows scroll sideways in their cells.
