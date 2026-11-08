# Plan: markdown documents, MarkdownTable retired, Used by everywhere

**Raised:** 2026-11-08, his words: *"delete ugly ass table"*; *"brand book just uses PageHero and PageSection, it does not make Brand Cards, which we kind of need … markdown-page/document/site, … /research and … /article — 3 different markdown render styles."* Site ground ruling: the `fg-02` wash, one wash inside SiteLayout. PageCover master added on the coordinator's brief.
**Status:** GO 2026-11-08 (user-approved via the coordinator). Built by kol-figma-agent. Nothing published: kol-framework waits on his publish, the library on his click.
**Shape:** W › phase › list.
**How a phase closes:** acceptance numbers, then gates, then a look at every touched frame at readable zoom against the live render.

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

## PARKED
- The old `MarkdownPage` set 261:527 (variant=numbered · plain, his MarkdownPage doc frame 1365:11604) is still beside the new set. Retiring it is his call.
