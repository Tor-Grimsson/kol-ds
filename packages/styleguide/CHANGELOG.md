# @kolkrabbi/kol-styleguide

## 0.18.4 — 2026-10-30

- **The Wheel tab wears `color-wheel`** (kol-icons 0.53.5), not `clr-mono` borrowed.
- **The lab window's tabs are TabsRow `type="mono-light"`** (JetBrains Mono at 300, kol-component 0.317.4), on his word 2026-10-30; `sans` stays in the component.
- **The Color Lab's contrast rail is on `SettingsSections` rows** like the other labs (the user: *"if you need to scroll in this siderail then you are doing something wrong"*, *"we always have used mono sections and labels"*): Pair (ratio, Foreground, Lightness, Background, Lightness, Swap), WCAG (the three categories as `AA pass, AAA pass` values) and Text levels (each grade with the stops it holds, three rows for the eleven-step ladder); Suggestions is one Use row, Set a ratio one slider row with the section's note. Nothing in the rail scrolls at 1100 tall. The Image tab's lines are `kol-mono-12`; the stage's specimen stays sans.

## 0.18.3 — 2026-10-30

- The Image tab's "Try one of ours" caption stays on one line at the narrowest rail (320) — it truncates instead of wrapping.
- **Randomise** is `tone="inverted"`, set on the button so no wrapper's ground repaints it (review 8: *"WRONG FUCKING BUTTON TONE"*; the plate he saw was a wrapper painting the nav rung). The review-8 plan: `.kol/llm-context/plan-2026-10-29-lab-window-review-8.md`.

## 0.18.2 — 2026-10-29

- **Review 8:** the Wheel tab rendered a code comment as text under Harmony (a comment left inside the markup in 0.18.1) — gone. The eyebrow is the rail's label again, everywhere (*"IT WAS PERFECT … why is it only used here"*): Harmony, Base, the contrast checker's labels, the simulator's. The Image tab's file line is smaller and never breaks. The contrast preview is the palette's own forms beside the text — no image — with the DS Button in the pair.

## 0.18.1 — 2026-10-29

- **Review 7 (the user: *"UNIFY"*):** the rail has one text style — `kol-sans-body-02`, emphasis for a label and meta for its value — on every tab and view: the Base panel's label row, the Harmony row (no eyebrow), the Image tab's lines and link, the contrast checker's labels. Upload your image is `tone="inverted"`. `LabWindow`'s tabs are TabsRow `type="sans"` (was `size="md"`, 2026-10-30).

## 0.18.0 — 2026-10-29

**The lab window and one colour engine** (BrandLabToolWindow, kol-atlas — the user's review of two proposals; nothing published before his review).
- **`LabWindow`** puts all four labs in one window: kol-component's QuickLookFrame, resizable and never taller than the viewport, with one padding throughout. Its left rail holds text tabs, `LabeledControl`s in one tone and the status line, and there is no footer. The stage sits beside the rail, and **`LabOutput`** (a table, then the CSS) sits under the window. `useLabValue` gives undo and redo.
- **One colour engine** (`colorLab.js`, kol-fxr's): OKLCH, base is colour 1, 2–8 colours, jobs given by look, a seeded roll keeping locked colours, and contrast on the ground. **ColorLab** adds per-colour lock, edit tint, edit, copy and delete, plus undo, redo and roll; it owns the palette output. The 0.17.0 slots, ten hues and 60/30/10 picks are gone, and `COLOR_SLOTS`, `COLOR_MIX` and `neutralRamp` are no longer exported. **BREAKING** for anyone on them.
- **ComboLab** combines Color Lab's palette (`color` prop) and generates nothing of its own. Its parts can be reassigned, it is unbranded (the mark slot is a plain shape), the mark slot works in every layout, and each part is checked on light and dark. `generatePalette` is deprecated in favour of `generateColors`.
- **LockupLab** is rebuilt from the branded-house sheets: the parts, the five lockup types, company and sub-category ratios, clip to baseline, the part grid, logo shapes and presets. Size steps and the horizontal, hero and wordmark presets are gone. **`BrandLockup`** draws the stage and every type in the output.
- **TypeLab** in the window: Scale · Steps · Roles. Samples are one line, truncated.
- **Review 1** (his Adobe Color captures): Color Lab's column is now Adobe's.
  - Flush columns, with plain glyphs top right: lock, edit tint, drag, delete.
  - The hex is the Edit color button, and copy sits beside it.
  - Drag or arrow keys reorder the columns.
  - Each colour's job and contrast moved to a Check tab.
  - apps/brand-lab and apps/document switch pages with text tabs.
- **Review 2:**
  - The rail's tabs are Base color (the picker inline), Image (upload or drop; the palette is extracted, `paletteFromPixels`) and Wheel (at the rail's width). Harmony tiles and the colour count sit under each.
  - The rail resizes (`useDragResize`, token `kol-lab-rail`, 240 to 480).
  - Tints are 7 steps, the colour 4th and outlined, each with its tooltip. A + on the seams inserts the OKLCH midpoint (`midColor`).
  - Drag shows grab, a dimmed source, a landing bar and a ring.
  - The header has Contrast checker (grades on the columns, the check and the full Text ladder in the rail, `TEXT_STOPS`) and Color blindness simulator (`simulateCvd`, `CVD_TYPES`).
  - The roll is the labelled Generate random button, and a palette strip sits under the columns.
- **Review 3:**
  - The Base tab's picker has modes: HEX, RGB, HSB and Lab.
  - The harmonies use the DS's `clr-*` glyphs as tab buttons, with the mode named ("Harmony: Custom" after a hand edit).
  - Contrast checker and Color blindness simulator are their own views of the window:
    - the contrast checker has foreground and background with lightness, swap, the ratio, the AA/AAA Summary, the text ladder and a preview;
    - the simulator shows a row per vision with conflict warnings.
  - Generate random and Copy CSS sit at the rail's foot, which `LabWindow` now takes as a `foot` slot.
  - The palette has 4px outer corners.
  - The colour count and the status line are gone.
- **Review 4 (the settings rail is the reference):**
  - `LabWindow`'s rail takes Rail's ground (`bg-surface-primary`) and padding with no tone wrapper, at the rail law's 380 (320 to 560 by drag).
  - Every lab's controls are `SettingsSections` rows: label left, control right, eyebrow sections with dividers, typed choice, switch and slider rows.
- **Review 5:**
  - Nine harmonies: Compound and Shades join (`COLOR_RELATIONS`, `generateColors`). The tiles fill the rail's width with 28px glyphs in opaque ink and no chip.
  - Generate random and Copy CSS sit under the palette, at the right.
  - `LabWindow`: a Maximize button at the header's far right puts the window over the page (Escape restores); the rail's tabs are TabsRow underline with icons.
  - The view buttons take the tab state, not nav's inverted fill.
- **Review 6 (Adobe's Image tab, contrast checker and simulator; the window's rule):**
  - `LabWindow` opens every rail on a TabsRow, one section or many; the title wears the settings rail's uppercase heading; Maximize is the `expand` glyph; no status line in any lab.
  - Color Lab's Image tab is Adobe's: the dashed drop zone with Upload your image and its two lines, the checker under the pointer; then `samples` ("Don't have an image? Try one of ours") with each image's palette, and the `library` link (brand-lab: the bucket's photos through `/media`, "Media: R2B2"). The harmonies sit under the Wheel only.
  - Contrast checker in the same window: the rail's tabs Summary · Contrast suggestions · Set a contrast ratio over the pair (foreground and background with their lightness, swap, the ratio above); the stage Adobe's preview, the image beside the pair; the palette small under every view's stage.
  - Color blindness simulator: the conflicts named and the palette plotted on the wheel in the rail; the vision rows on the stage.
  - Randomise (the `shuffle` glyph) under the palette; Copy CSS in the header like every lab. Every bare icon in opaque ink.

- **`DocumentLibrary` draws its files and languages as icons and chips, as props** (OverviewTocAndLibraryIcons, kol-website 2026-10-29 — user: *"file type and language, can use icons? the table is deadboring like this"*). `assetsView`: `label` (default, today's text buttons) · `icon` (kol-icons' file-type glyph per original, extension and language in the tooltip and aria-label, a PDF EN/IS pair told apart by a language subscript) · `icon-label`. `langView`: `text` (default) · `chips` (a borderless `Tag` per language) · `icon` (globe and codes). `fileIcon(file)` overrides the glyph (a name or a node); `kindIcon` is the default map by extension (pdf · doc/docx · image · svg · video · audio · zip · md · txt · else `file`), exported. `DocumentView` and `DocumentFiles` take the same `assetsView`. Nothing changes for a caller that passes none. Needs kol-icons ≥0.53.0 for the glyphs (CANDIDATES for review).

## 0.17.0 — 2026-10-29

**The lab: four generators, one name system, one subpath** (BrandLabToolGaps, kol-atlas — the user: *"the group of those tools that generate should ship together with combolab and logo lockup generator, and have unified name system"*). `@kolkrabbi/kol-styleguide/lab` ships `TypeLab` · `ColorLab` · `ComboLab` · `LockupLab`, each with `<x>Lab(value)` · `<x>LabCss(…)` · `DEFAULT_<X>_LAB`; the main barrel exports the same names. The old names are aliases on the retirement ledger: `TypeScaleLab`, `typeScale`, `typeScaleCss`, `DEFAULT_TYPE_SCALE`, `deriveColorLab`, `DEFAULT_PALETTE`, `LockupBuilder`.
- **TypeLab** sets a brand's whole type. Sixteen roles (`TYPE_ROLES`) sit on the eight steps, each with a face (display · heading · text · **mono**), weight, tracking, case and ink, overridable per role (`value.roles`) in a roles table. Each step's line-height factor is tunable (`value.leading`). `typeLabCss` emits the faces, the steps, the roles' variables and a `.type-<role>` class each.
- **ColorLab** gives a colour definition:
  - every swatch's WCAG contrast against the brand's own ink, with ratio and grade (`contrastRatio` · `contrastGrade` · `inkOn`);
  - the brand's ink levels, emphasis · strong · lede · body · meta, on its light and dark grounds, measured at their opacity (`INK_LEVELS`);
  - the dark theme: the slots swapped, and each role moved along its blend ramp until it passes AA on the dark ground.
  
  `colorLabCss` emits the ink, then the dark block under `[data-theme="dark"]`.
- **ComboLab** takes `onChange(palette)`. `comboLab({ pool, mode, current, locks, base })` makes a palette, and `comboLabCss` emits `--brand-combo-*`.
- **LockupLab** is LockupBuilder under the family's name, with the same props.

## 0.16.0 — 2026-10-29

- **`DocumentLibrary`** · **`DocumentView`** (DocumentLibraryAndBoardParts, kol-website): a `documentLibrary` drawn as a sortable table per folder — Title · Kind · Date · Language · Assets · Markdown, `columns` editable, `view="cards"` for the contents cards; the originals open in `FileQuickLook`, the markdown downloads; `DocumentView` puts the same buttons and an `actions` slot above `MarkdownPage`. `DocumentFiles`, `DocumentMarkdown`, `useFileQuickLook` exported. `DocumentIndex`'s Quick Look is `FileQuickLook` now, so it gains a download. Needs kol-component ≥0.315.0, kol-framework ≥0.64.0.

## 0.15.0 — 2026-10-29

- **`AssetTable` runs the content column** (LayoutsAppPages): `Table width="column"`, not the prose panel. Path never wraps. Format, Dimensions and Color take their content's width instead of 160px each. Name wraps at its words. The preview scales down to the column before the table runs out, and Download no longer clips at a fixed 96px. At 1440 the table fills the brand book's 950px column; narrower, it scrolls sideways in its column with no cell clipped.
- **`A4Pages paged`**: one sheet in view, centred, paged with `QuickLookFrame`'s `nav` (‹ › and `n / N`), as MediaLibrary and DocumentIndex page a PDF. Print still prints every sheet.

## 0.14.1 — 2026-10-28

- **Relative imports name their file** (WebsiteFrameDuplicateModules, kol-website): every `./x` import now carries its extension. Vite serves raw source by the URL it was imported with, so `./Ctx` and `./Ctx.jsx` were two modules in dev and a provider and its hook held two contexts. `validate-relative-imports` keeps it from coming back. No behaviour change.

## 0.14.0 — 2026-10-28

- **`PrintStudio`** (PdfToolsFromStudio — user: *"we have a bunch of stationery, we would like to connect those together with the package"*): markdown to print in the page — a layout picker (Document, then the app's `templates`: finished A4 boards printed as they are), the project fields, the markdown, the A4 sheets on a desk, and PDF (the browser's print of the sheets), DOCX and MD. On `@kolkrabbi/kol-print` (a new peer), the same cut the CLI makes: the same document and studio give identical pages and DOCX body. The studio's details are props.
- **`A4Pages`** — kol-website apps/record's `A4Page`, carried verbatim: any React content flowed across A4 sheets (794 × 1123, 48 margins), breaks snapped between elements; one sheet per A4 page in print. Its box is kol-theme's `.kol-a4-*` (0.196.0).

## 0.13.0 — 2026-10-28

- **`DocumentIndex` opens a folder's files in Quick Look** (DocumentIndexFilesAndIcons049, kol-website 2026-10-28 — the MarkdownPage ticket's point 0.12.0 missed). A row with `file` (from kol-framework's `documentFiles(glob)`) is a card in its part with its kind on the small line — PDF, Image — and opens in the DS Quick Look window (`QuickLookFrame` over the dimmed page, `KindPreview fit="sheet"` as the body: a PDF page by page with its thumbnail rail, an image at its size), ‹ › paging through the folder's files. `Contents` lets a row bring its own `href` and `onClick` for it; page rows are untouched.
## 0.12.0 — 2026-10-28

- **`DocumentIndex`** (plan-2026-10-28-document W5.2): a folder's pages as the brand book's contents cards — `Contents` routed, under a compact `PageHeader` when the index is a page of its own. Born in `apps/document`; it lives here rather than in kol-framework because kol-styleguide peers on kol-framework and the cards are `BrandGuide`'s.
## 0.11.0 — 2026-10-28

- **One brand renderer** (user 2026-10-28: the brand book's Chapters page and the guide's looked like two things). `BrandBook` and `BrandAssets` now render through `BrandGuide`'s chapters (`GuideChapters` over `BOOK_SECTIONS` · `ASSET_SECTIONS`), on the one chapter model (`guideBook.js` — `brandSections` · `brandToc` read it). What changes on screen: the Brand page's Chapters index is the numbered, grouped cards (Brand overview · Logos · Foundations, the site rail's own groups), the Color chapter is the compact ramp strips (and the manifest's approved pairs, if any) instead of the Swatch grid, the Typography chapter is the brand's families instead of KOL's type system, the stationery cards carry captions, and the Assets index is the same cards. Same ids, same rail entries, same props. The book's own renderer (`typeSpecimen.js` with it) is retired to `_tmp/2026-10-28-brand-book-one-renderer/`.

## 0.10.0 — 2026-10-27

- **`BrandAssets` takes drawn social mocks and the second letterhead** (BrandAssetsSocialMocksAndLetterheadB, kol-website 2026-10-27). A `brand.social.templates` row may carry `mock` instead of `src`: `'PostPhoto' | 'PostEditorial' | 'StoryPhoto'` (the kol-styleguide mocks, wearing the brand's logomark) or a node; `ratio` boxes a mock that does not size itself, and no wordmark overlay is drawn. `brand.stationery.letterheadB: true` adds the "Letterhead, A4 [B]" card (`LetterheadB`) in its own row under the stationery grid. Photo templates are unchanged.

## 0.9.0 — 2026-10-27

- **`BrandAssets` carries Graphics and Patterns** (BrandAssetsGraphicsAndPatterns, kol-website 2026-10-27) — kol-website's Assets page, so it adopts `BrandAssets` with no section lost. A manifest's `graphics: { abstract: [...], patterns: [...] }` (names from kol-component's `GRAPHICS`) turns on `#graphics` and `#patterns` between Logos and Branded, each an `AssetTable` with the ink toggle and recoloured download, plus `#graphics-patterns` (the cards, off the rail) under Patterns. No `graphics` → nothing changes. Ledes are the manifest's to set (`book.graphics` · `book.patterns` · `book.graphicsPatterns`), as Logos' is.

## 0.8.0 — 2026-10-27

- **`BrandGuide`** (BrandGuideOutlineTwoVersions, kol-hq 2026-10-27) — kol-branding's guide renderer, carried: one scrolling page, one chapter per row of the `sections` it is handed, every chapter the same anatomy, the specimen by `kind` (contents · logo · lockups · color · typography · logos-table · branded · stationery · social · profile), the chapters on the rail. With `guideSections` · `guideToc`. The outline is kol-brand-template 0.4.0's `GUIDE_SECTIONS`. kol-branding's research line under each chapter stays in kol-branding.

## 0.7.0 — 2026-10-24

- **`./src/*` is open in `exports`** (StyleguideSrcExports, kol-branding 2026-10-24) — the kol-framework pattern, so a forked brand-book composition deep-imports `BrandMark.jsx`, `typeSpecimen.js`, `SocialMocks.jsx` and `StationeryMocks.jsx` by path instead of aliasing `node_modules` in Vite. The raw-JSX contract is unchanged.

- **No `kol-helper-*` on a sentence** (kol-ds-ui `validate:helper-text`, 2026-10-23 — the helper scale is single-line chrome, 01-foundations/03-typography.md:29). Empty states and notes that are sentences wear `kol-mono-*` at the same size; labels are untouched.

## 0.6.0 — 2026-10-02

- **Renamed: `ProfileAvatar` → `BrandAvatar`** — it is the brand's mark in a profile frame, not a second `Avatar`. `ProfileAvatar` is the alias.

## 0.5.3 — 2026-09-30

- Comments and README only: one spelling, `color`.

## 0.5.2 — 2026-09-27

- `AssetTable` — the icon-only link / button ink on `oq-64` (the icon-ink gate's I3).


> Started 2026-08-14 at 0.1.1 — earlier versions shipped without entries (that history
> lives in the repo's session logs). From here every publish adds an entry, and
> breaking or global-surface changes are flagged **BREAKING**.

## 0.5.0

### Minor Changes

- **The brand tool** (brand as a tool, 2026-09-27): `Brand` renders a whole brand book from one brand manifest — BRAND (hero, chapter index, About · Tone · Look · Logo · Lockups · Color · Typography) and ASSETS (Logos table with ink toggle, zoom and recoloured download · Branded · Stationery · Social · Profile), a view switch, and the page's sections on the `DocsToc` rail. `BrandBook` and `BrandAssets` render the pages alone. kol-olina's apps/brand, carried class-for-class; its client copy now comes from the manifest's `book` field (kol-brand-template 0.3.0), and sections with nothing to show are left out. Marks come from a `Logo` component or `logoSources` (id → raw SVG). Helpers: `brandSections`, `brandToc`, `brandInfo`, `BRAND_VIEWS`, `BOOK_SECTIONS`, `ASSET_SECTIONS`.
- New peer: `@kolkrabbi/kol-framework` ≥0.39.0 (`PageHero`, `PageSection`, `.kol-grid`). The `kol-component` peer floor rises to ≥0.188.0 (`DocsToc variant="rail"`).
- One deviation from the port: the chapter-index arrow is inked `text-oq-48`, not `text-meta` (icon-ink law).

## 0.5.1

### Patch Changes

- The brand tool's Logos and Branded sections ship without a default lede. Both were kol-olina's, and named files in that repo (`src/brand/logos/svg/`, `src/components/styleguide/StationeryMocks.jsx`) — wrong for any other brand, and the unbroken path pushed the Assets page past a phone's width. A manifest sets them with `book.logos.lede` / `book.branded.lede`.
