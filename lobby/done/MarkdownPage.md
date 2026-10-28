# MarkdownPage — one layout-neutral page for markdown files, in the brand-guide voice

**Staged:** 2026-10-28 · from a kol-website session
**Change:** new component (kol-styleguide or kol-framework, the DS's pick) · possibly a font (Public Sans) in kol-theme

---

## The problem, in one case
kol-website `apps/brand` needs to render a folder of tracked `.md` files as pages — the studio's business material: `frumkvaedi-2024/` (business plan, pitch deck, two PDFs), `studio-definition.md`, `pitch/` (elevator pitch, about talk, services, pitch frameworks), `bio/` (bio, about letter). Brand runs kol-framework's `SiteLayout` and the site rail. Every reader in the estate today is wrong for it:
- kol-workshop's `DocumentationReader` / `DocsArticle` — welded to the workshop frame (its own `ShellTocContext`, `RightRail`) and its look. **The user does not want the workshop style.**
- kol-website `apps/record/src/components/MarkdownDoc.jsx` — a local react-markdown mapper.
- kol-atlas `apps/workspace/src/engine/render.js` — local, client work; reference only, it will not migrate.

## The look (user's references)
- **kol-styleguide `BrandGuide`** (apps/brand-hub `/guide/blank`): the chapter header — mono kicker `03 — VOICE AND NAMING`, Right Grotesk display title, lede in the narrow sans; the contents page's numbered chapter grid with arrows; mono tables with ruled rows; two-column lists under mono labels.
- **kol-atlas workspace** (`apps/workspace/src/index.css`, `workspace.css`): body text in **Public Sans** (`@fontsource-variable/public-sans`), **Right Grotesk only for big titles**; numbered section ladder (`M1`, `1.1`, `1.1.1` in the gutter); footnotes collected under the paragraph; `Dates:` / `Client:` label-value lines; tables with a mono header bar.

## The fix
- One component, e.g. `MarkdownPage({ source, title, kicker, toc })` over `kol-markdown` (`parseDocsMarkdown`, frontmatter): headings, paragraphs, lists, tables (KOL `Table`), code, blockquote, footnotes, images — in the brand-guide voice above.
- **Layout-neutral**: it publishes its contents to whatever frame holds it — `SiteLayout`'s TOC rail and `AppShell` alike — never its own rail.
- A folder index: a contents page from a folder of md (the `BrandGuide` contents grid), so an app only globs its files and lists them in its menu.
- Public Sans into the KOL type tokens if the DS takes it.
- **Non-markdown files in the folder** (added 2026-10-28): a folder may also hold PDFs and images (`frumkvaedi-2024/` has `business-plan.pdf` and `example-plan.pdf`). The contents index lists them beside the md pages and opens them in the DS QuickLook (`QuickLookFrame` / `KindPreview`), not as pages. Images a md file links (`_assets/media/*.png`) resolve relative to that file.

## Definition of done
- [ ] `MarkdownPage` + the contents index ship; a DS app (brand-hub) shows a md folder rendered with them
- [ ] works inside `SiteLayout` (site rail, TOC rail) and inside `AppShell`
- [ ] kol-website brand can render `src/brand/business/**` (md as pages, PDFs and images in QuickLook) with a glob and menu rows only

## ✅ RESOLUTION — 2026-10-28 · 0.58.0

kol-framework 0.58.0 ships MarkdownPage (a markdown file as .kol-sheet: source · numbered · linkNotes · toc frame|rail|false · fit cover|contain · ratio · resolveLink · assetUrl), LinkPreview (the hover card, cardFor(anchor) is the app's) and documentTabs(glob) (a folder as rows {id,title,group,file,source}); kol-styleguide 0.12.0 ships DocumentIndex (a folder's pages as the brand book's contents cards); kol-markdown 0.2.0 reads what the documents are written in; kol-theme 0.193.0 carries the sheet's accent (orange-300, yellow-300 dark), the figure fill and the note rules. Proved against kol-atlas's engine block for block; apps/document (5208) is the reference, docs/documentation/04-compositions/20-document.md the page. The app's CSS loads @kolkrabbi/kol-framework/kol-brand-color.css and an @source line per package.

**Remainder here:** none — kol-website wire brand's folder: const ROWS = documentTabs(import.meta.glob('./brand/foundation/**/*.md', { query: '?raw', import: 'default', eager: true })); ROWS into the nav tree by group; the page route <MarkdownPage source={row.source} resolveLink assetUrl />; the folder route <DocumentIndex rows={ROWS.map(r => ({ id: r.id, to: '/' + r.id, title: r.title, part: r.group }))} onNavigate={navigate} />; bump kol-framework 0.58.0, kol-styleguide 0.12.0, kol-markdown 0.2.0, kol-theme 0.193.0..

