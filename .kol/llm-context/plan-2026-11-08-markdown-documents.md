# Plan: markdown documents, MarkdownTable retired, Used by everywhere

**Raised:** 2026-11-08, his words: *"delete ugly ass table"*; *"brand book just uses PageHero and PageSection, it does not make Brand Cards, which we kind of need … markdown-page/document/site, … /research and … /article — 3 different markdown render styles."* Site ground ruling: the `fg-02` wash, one wash inside SiteLayout. PageCover master added on the coordinator's brief.
**Status:** W1–W4 built 2026-11-08 (kol-framework 0.71.0 published). Open: W5 — DRAFT, his review 2026-11-08 (round 2, below).
**Shape:** W › phase › list.
**Laws carried:** Figma follows code (fix code first); nesting = code imports, checked by key; no component in a vacuum — every part is built from the parts it composes and serves every style it applies to; family-prefix naming; `variant` is the only word.
**How a phase closes:** measurable acceptance line first, gates green, then Playwright against his own words; every touched frame looked at, at readable zoom, against the live render.

## W1: MarkdownTable leaves the library
### 1.1: Retire the master
- The `MarkdownTable` set (918:24994) and its `MarkdownTable/row` part (922:24865) have no component in code. A markdown table is the Table atom `variant="simple"` (MarkdownPage `TableBlock`); the kv table becomes the `markdown-page/kv` part (W3).
- Acceptance: 0 MarkdownTable instances outside `_trash`; both sets `_`-prefixed on `_trash`; Site parts section re-flowed with no gap.
- ✅ built 2026-11-08: both doc frames moved to `_trash` (1297:11316, 1571:9369), sets renamed `_MarkdownTable` and `_MarkdownTable/row`. All 15 instances are inside `_MarkdownTable` on `_trash`, none outside. Site parts 1104:28151 re-stacked (PageControls, IndexCard, DocumentIndex/group, CategoryPageToc).

## W2: Every header says who uses it
### 2.1: Consumers → Used by, file-wide
- "Consumers: N in repo · M outside" → "Used by: apps … · packages … · outside: <repos or none>", from real import sites (apps/ + packages/; outside = other ~/dev/projects repos importing from @kolkrabbi).
- Acceptance: a file-wide text search finds 0 nodes with "Consumers:".
- ✅ built 2026-11-08: 154 Molecules headers and 12 `_trash` headers rewritten (`_Header` property `Consumers`). Every other page had 0. File-wide count: 0. A part with no import site reads "Used by: none · outside: none". The script is the session scratchpad's `usedby.mjs`.

## W3: Three markdown render styles
### 3.1: Code: MarkdownPage `variant`
- `variant: 'research' | 'article' | 'site'`, a VARIANTS map of block → the theme's existing classes (the ProsePreview COLLECTIONS pattern). `research` is today's `.kol-sheet` page and stays the default. `article` is `.kol-prose`. `site` is PageHero, a Chapters PageSection of IndexCards, then one PageSection per `##` with its blocks in `.kol-prose`, on the fg-02 ground (`bg-[color:var(--kol-shell-page-wash,var(--kol-fg-02))]`: inside SiteLayout the variable is `transparent`, so there is one wash).
- The brand chapter card already existed as the private `IndexCard` in DocumentIndex.jsx. It is now its own export (`packages/framework/src/IndexCard.jsx`, molecule/navigation). The brand book's Chapters (`Contents`) draws it.
- Acceptance: roster, imports and foundations gates clean; brand-hub, brand-lab, document and site-hub build; Playwright shows a bare `variant="site"` on one fg-02 layer and the same page inside `SiteLayout pageWash="var(--kol-fg-02)"` on one layer, in light and dark.
- ✅ built 2026-11-08: gates clean (691 exports). The 4 apps build. `layouts` fails on showcase `.mdx` parse errors that are not part of this change. Playwright wash check: 1 layer bare and 1 layer in SiteLayout, both themes. Docs: 20-document.md prop row, 01-inventory.md IndexCard row, kol-framework CHANGELOG Unreleased.
### 3.2: Figma: block parts
- Parts mirror their code elements, `variant` research · article (site uses article's prose): heading (h1–h3), paragraph, link, list (dotted · numbered), quote, figure (container + caption), kv, sources (article/site; research draws Notes), chapters (Contents of IndexCards). IndexCard master upgraded to label · title · meta · arrow.
- Acceptance: each part in its own doc frame in his section 1716:55663; audit errors 0; nesting fakes 0; invalid assets 0.
- ✅ built 2026-11-08: sets 1727:14527 heading, 1727:14532 paragraph, 1727:14537 link, 1727:14574 list, 1727:14581 quote, 1727:14589 figure, 1727:14612 kv; components 1727:14613 sources and 1727:14626 chapters; doc frames 1727:14658–14849. IndexCard 922:25881 (props label, meta, hasLabel, hasMeta).
### 3.3: Figma: `markdown-page/document`
- One set, `variant` research · article · site, measured from the live render at 1176 wide (showcase probe, task-scoped Vite). Its layers are only part instances (+ Table, Notes, PageHero, PageSection), with block spacing as instance padding.
- Acceptance: the key check passes (every variant's children and slot children are instances); heights within the live render (research 1181 vs 1175; article 1206 vs 1193; site is shorter because the PageHero master is drawn at the 900 viewport).
- ✅ built 2026-11-08: set 1728:15144 in doc frame 1728:15145. Organisms nesting 107/107, 0 fakes. Audit 0 errors.

## W4: PageCover master
### 4.1: Page family on Organisms
- Full-bleed Image instance, 56% absolute-black scrim, kolkrabbi-logomark instance (220) over the title in `prose/display-upper`; props `title`, `mark` (swap), `hasMark`, `scrim`.
- Acceptance: it sits beside PageHero/PageSection in Shell 1104:144306; audit clean.
- ✅ built 2026-11-08, then retired the same day (his approval: SiteHero stays the one home cover; code moved to _tmp/2026-11-08-pagecover/). Master renamed `_PageCover` (1731:15014) and its doc frame 1731:15021 moved to `_trash`; 0 instances anywhere; Shell section re-flowed to its original stack. His site screen 1714:55331 is unchanged.

## W5 — One block set, three styles (his review, round 2)

Raised: his words, verbatim — *"is this supposed to explain the research styles? Its fully disconnected?? … its just disrespectful to think you can create components in a vacuum in MY KOL DS where everything is interconnected and relies on each other"* (SheetArticle); *"this works for all, but one style? — makes no sense??"* (PortableTextRenderer); *"documentview with extra container for language and download — not a component, and only usable by one style??"*; *"why are we making assets for ONE layout style but not ALL?!!"*

Cause (one, so one W): the block parts were copied from what the research render draws, instead of being ONE block set that each style restyles. Code already works the second way (MarkdownPage maps block → class per variant); Figma and the block-array renderer do not.

### 5.1 — Code: one style map for both renderers
- Lift MarkdownPage's per-variant block → class map into one shared module in kol-framework (site · research · article); MarkdownPage reads it unchanged.
- PortableTextRenderer (kol-content) takes the same `variant` (default `article` = today's `.kol-prose`, so no consumer moves) and reads the same map. Both renderers draw the same blocks the same way per style.
- Acceptance: one map module, imported by both (grep: 2 import sites, 0 other block→class tables); PortableTextRenderer with no `variant` renders byte-identical classes to today; gates green (roster · imports · foundations · taxonomy) and every app importing either renderer builds.
- ✅ built 2026-11-08: `packages/framework/src/markdownVariants.js` (kol-framework 0.72.0). kol-content cannot reach it through a cycle (nothing depends on kol-content), so it takes kol-framework as a peer (≥0.72.0) and imports the module by its `src/` path; kol-content 0.16.0. Grep: 2 import sites, 0 other tables. The showcase preview's SSR render with no `variant` is byte-identical before/after (29 class attributes). Gates clean (691 exports); brand-hub, brand-lab, brand-sections, document, float, folio, print, site-hub and showcase build; `layouts` still fails only on the showcase `.mdx` parse errors.

### 5.2 — Code: the files row is two components on any style
- `DocumentFiles` (one Quick Look link per language, `PDF EN · PDF IS`) and `DocumentMarkdown` (the `.md` download) are already exports in packages/styleguide DocumentLibrary.jsx. Confirm they render outside DocumentLibrary; DocumentView (or the document header) places them above a MarkdownPage of any `variant`.
- Acceptance: a MarkdownPage in each of the 3 variants renders the files row via those 2 components (Playwright: 3/3); 0 hand-built PDF/download rows left in code.
- ✅ built 2026-11-08: `DocumentView` already rendered both above `MarkdownPage` and passes `variant` through; apps/document `/library/<id>` now takes `?variant=research|article|site`. Playwright on press-2027-03-12-launch: 3/3 show PDF EN, PDF IS and the markdown download (research `.kol-sheet`, article `.kol-prose`, site on the one fg-02 wash). Hand-built document file rows in code: 0. No kol-styleguide change.

### 5.3 — Figma: the block parts get the style axis
- Every block part (heading, paragraph, link, list numbered · dotted, quote, table — the Table atom — kv, figure + caption, sources, chapters / IndexCard) gets ONE property `variant` = site · research · article, each value measured from the live render of that variant.
- Acceptance: each part has exactly those 3 values; key check: 0 drawn copies, every part's inner layers are atom instances; each value within 2px of its live capture.
- ✅ built 2026-11-08: 10 parts carry `variant` research · article · site — heading 1727:14527, paragraph 1727:14532, link 1727:14537, list 1727:14574 (+ optional `item 3`), quote 1727:14581, figure 1727:14589, kv 1727:14612, new table 1744:15202 (the Table atom in `.tablewrap`, doc frame 1744:14957), sources 1744:15237, chapters 1744:15253. Live probe (probe-md53.js, document dev server) at 1176: site blocks are article's classes at the 720 column; site h1/h2 are SectionText page/section instances (what PageHero/PageSection draw), h3 prose. kv article key 394 → 389 (live 389/591), site 286/434; article/site table header moved to the prose th (doc/table-th, 10 pad): 115 vs live 114; research table 125 vs 123. Nesting check Organisms 917/917, 0 fakes; invalid assets 0. Follow-up (coordinator, same day): the 56/80 heads are PageSection/PageHero passing `kol-prose-title`/`kol-prose-display`/`kol-prose-label`/`kol-prose-lede` to SectionText (SectionText's own section = display-03, correct as drawn), so those overrides went on the SectionText instances in the PageHero 456:11766 and PageSection 456:11774 masters and in the site heading/chapters parts: section header 116 = live; hero stack 156 vs 164 (the 24 under the title is drawn as the 16 gap).

### 5.4 — Figma: the document set is the parts with the style switched
- `markdown-page/document` site · research · article = the same part instances with `variant` set; PortableTextRenderer's doc frame shows the same set (it is the same blocks). `DocumentFiles` and `DocumentMarkdown` become components, placed on the set's header in all 3 values; the loose "files + markdown" frame retires.
- Acceptance: the set's 3 variants hold the same part instances (count equal across the 3), differing only in `variant`; 0 loose files frames; key check 0 fakes.
- ✅ built 2026-11-08: set 1728:15144 — each variant is a files row + the same 14 part instances in the same order (16 instances each); site was rebuilt flat from article's instances with `variant` switched and the live gaps as instance padding (breakpoint Tablet). Chapters is hidden in research and article (they draw none). Heights (live + the 90 files row): research 1297 vs 1288, article 1286 vs 1283, site 3078 vs 3091; the site eyebrow reads Site. `DocumentFiles` 1746:15815 and `DocumentMarkdown` 1746:15816 are components (Button nav sm instances, doc frames 1746:15767 · 1746:15791 beside DocumentView) on all 3 values; the loose "files + markdown" frame is `_files + markdown` on `_trash`. PortableTextRenderer's slot now holds the part instances (article) and its doc frame 1365:10780 shows the set in all 3 styles. Audit 0 errors; 0 fakes; invalid assets 0.

### 5.5 — Trash what was built in a vacuum
- SheetArticle (no component of that name in code) → `_trash`, `_` prefix; any doc frame that explained the research styles with it shows the research variant of the set instead.
- Acceptance: 0 SheetArticle instances outside `_trash`; file-wide search for master names with no matching code export returns only `_`-prefixed nodes.
- ✅ built 2026-11-08: `_SheetArticle` (917:24843) and its doc frame on `_trash`, 0 instances anywhere (no doc frame used it). Sweep of every master page against the packages' index exports (830 names): 24 masters with no export, none trashed — the one in the document family, `Contents/row` 456:11759: its 30 instances swapped to IndexCard (label and title kept), then `_Contents/row` + doc frame to `_trash`, 0 instances. `Modal` is listed because Modal.jsx exports ModalProvider, useModal and Dialog — no `Modal` name. The rest, his list: IconLoader · MoreSheet, ShellNavRow, ShellNavSection, List, Prose, Modal, ModalShell, ProgressLine, CardTab, StatTile, RankedListRow, Favicon, CategoryPageToc, AppItemRail/row, SplitButton, CalendarHead, CalendarEvent · CommandOverlayRow, TableRow, TableCell, AppItemRail · SiteLayoutTocSlot.

### Order
5.1 → 5.2 (code, one publish of kol-framework + kol-content + kol-styleguide as touched) → 5.3 → 5.4 → 5.5. One Figma writer.

## PARKED
- The old `MarkdownPage` set 261:527 (variant=numbered · plain, his MarkdownPage doc frame 1365:11604) is still beside the new set. Retiring it is his call.
