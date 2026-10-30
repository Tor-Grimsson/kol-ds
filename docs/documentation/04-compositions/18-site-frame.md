---
title: Site frame
type: reference
status: active
created: 2026-10-24
updated: 2026-10-29
description: The frame a site stands in
aliases:
  - site frame
  - SiteLayout
  - site rail
sources:
  - packages/framework/src/SiteLayout.jsx
  - packages/framework/src/SideNav.jsx
  - packages/component/src/organisms/NavRailSite.jsx
  - packages/framework/src/CategoryPage.jsx
  - packages/framework/src/MarkdownPage.jsx
  - packages/framework/src/LinkPreview.jsx
  - packages/framework/src/documentTabs.js
  - packages/framework/src/documentFiles.js
  - packages/styleguide/src/DocumentIndex.jsx
  - packages/framework/src/documentLibrary.js
  - packages/styleguide/src/DocumentLibrary.jsx
  - packages/component/src/molecules/PageControls.jsx
  - packages/theme/kol-typography.css
  - apps/site-hub/src/App.jsx
  - showcase/src/nav/placements.js
tags:
  - domain/compositions
  - audience/agency-internal
related:
  - "[[INDEX|Compositions]]"
  - "[[11-shell-system|Shell system]]"
  - "[[16-app-anatomy|App anatomy]]"
  - "[[../../operations/07-apps-tier/08-site-adoption|Site adoption]]"
  - "[[23-website-frame|Website frame]]"
  - "[[20-document|Document page]]"
---

# Site frame

A site is `SiteLayout` plus a nav tree and routes. That is the whole contract: the frame draws the rail, the plane, the phone drawer, the TOC rail and the width rungs; the tree says what the rail holds; the pages are composed from the parts below. `apps/site-hub` is the reference, as `apps/studio-hub` is for the Studio.

## The parts

| Part | Package | What it is |
|---|---|---|
| `SiteLayout` | kol-framework | the frame: the `.kol-brand-layout` grid, the site rail in the first track, the plane with its `pageWash`, the TOC rail, the phone drawer. Aliases `PageLayout` and `AppShell` (its earlier names) |
| `SideNav` = `NavRail variant="site"` | kol-framework over kol-component | the grouped rail: categories, pages, groups, the foldernote; the router read and the theme row are kol-framework's |
| the theme row | kol-framework `ThemeToggle variant="row"` | the rail's last row — the roll in the icon column, the target's words in the rows' voice; no credit box |
| `CategoryPage` | kol-framework | the foldernote's page: the category's label and lede over its pages as the article card, read from the tree; `view="toc"` lists every page in the rail's order (groups as sub-headings), `list` as a table, `head` `hero` · `section` · `none` · a node (0.65.0; site-hub's Mission log `/log`) |
| `PageControls` | kol-component | a page's own controls in one sticky strip — toggles, views, count, jump, legend |
| `.kol-sheet` | kol-theme | the document voice (kol-atlas's Research-Spec), beside `.kol-prose` the article voice |
| `MarkdownPage` · `LinkPreview` · `documentTabs` · `documentFiles` | kol-framework | a markdown file as `.kol-sheet`, the hover card for its links, a folder's markdown as page rows and its PDFs and images as file rows — [[20-document\|Document page]] |
| `DocumentIndex` | kol-styleguide | a folder's pages as the brand book's contents cards |
| `documentLibrary` · `DocumentLibrary` · `DocumentView` | kol-framework · kol-styleguide | a library of documents — a table per folder with kind, date, language, the originals in Quick Look and the markdown — and the open document with the same buttons — [[20-document\|Document page]] |
| `SiteHero` | kol-framework | a site's landing — image, wash, mark, name, tagline, actions (0.61.0) |
| `PageHero` · `PageHeader` | kol-framework · kol-component | the brand book's opening band (`size="compact"` drops the band's height for an ordinary page head, 0.65.0); the page header at the top of every other page |
| `BrandBook` · `BrandAssets` | kol-styleguide | the brand pages, chapters on the rail |

## Pages

<!-- placements: site -->
Every page that fits SiteLayout, from `showcase/src/nav/placements.js` (the list apps/layouts and `validate-placements` read).

| Page | Placement |
|---|---|
| `SiteHero` | runs here today |
| `Brand` | runs here today |
| `BrandGuide` | runs here today |
| `PageHero` | fits, placed for review |
| `SectionText` | runs here today |
| `PageSection` | runs here today |
| `CategoryPage` | runs here today |
| `MarkdownPage` | fits, placed for review |
| `DocumentIndex` | runs here today |
| `DocumentLibrary` | fits, placed for review |
| `A4Pages` | fits, placed for review |
| `ResumeLibrary` | runs here today |
| `ResumeSource` | runs here today |
| `ResumeTreatment` | runs here today |
| `KitPreview` | fits, placed for review |
| `Decks` | runs here today |
| `Notes` | runs here today |
| `MediaLibrary` | runs here today |
| `TimeSet` | fits, placed for review |
<!-- /placements: site -->

## The tree

The tree is `SideNav`'s; the shape is the opt-in, there is no mode prop.

| Node | Written as | Renders as |
|---|---|---|
| category | `{ id, label, icon, pages }` | a disclosure row with a caret; its pages open under it |
| foldernote | `{ id, label, icon, to, pages }` | the category IS a page: its title opens `to`, the caret alone expands and collapses (`discloseOnTitle` lets the title expand too); lit by its route or any page beneath |
| link category | `{ id, label, icon, to }` | a plain link row (Home) |
| page | `{ to, label }` | a route row; `to` may be `/page#section` for a section of one page, lit by scroll |
| group | `{ label, children }` among a category's pages | an uppercase label over its rows, one ink, never lit; used whole or not at all within a category |
| card | `{ to, label, card: { eyebrow, body, media, meta } }` | puts the page on its foldernote's overview |
| lede | `lede` on a category | the overview's standfirst |

### Row props

Every row is overridable (kol-component 0.317.0). With none passed, the rail renders as before. Set them on `sideNav` for the rail, on a node for that row.

| Prop | Where | Default | Does |
|---|---|---|---|
| `case` | rail | — | the label case on every level: `as-written`, `upper`, `lower`, `title`, `sentence` |
| `caseCategory` / `caseGroup` / `casePage` | rail | `upper` / `upper` / `as-written` | the case per level; CSS only, so the label stays the authored string |
| `case` | node | — | that row's case; wins over the level |
| `icon` | node, any depth | — | a glyph on a page, group label, action row or nested child, through `iconComponent` |
| `iconSize` | rail `{ category, group, page }` or node (a number) | 16 / 12 / 12 | the glyph size; the node's wins |
| `alignIcons` | rail | `true` | a level where any row has an icon reserves the icon column for all its rows |
| `collapsedIcons` | rail | `'category'` | `'all'`: collapsed, an open category's icon pages show under it |
| `trailing` | node | — | a count, badge or node at the row's right end |
| `className` / `title` | node | — | a class on the row; a tooltip when the label truncates |
| `external` | node with `to` | — | the external-link glyph, opens a new tab |

`apps/site-hub`'s Mission log category is the reference: an `upper` page beside pages as written, icon rows beside plain ones on one column, a group label with an icon, trailing counts.

## The frame's behaviour

| | |
|---|---|
| widths | collapsed below 1024 · 264 to 1535 · 320 from 1536 — the app rail's ladder |
| collapse | the grab edge: a press toggles, a drag resizes; a press from collapsed lands on the rung for the viewport, not a remembered drag width |
| the toggle | one motion: the narrow row is the wide row with its gutter eased and its label faded on the grid's 180ms clock; nothing remounts |
| a press when collapsed | does its job and the rail stays collapsed (`expandOnSelect` is off by default) |
| opening on load | nothing opens: `defaultOpen` (category ids) opens some on first render, `openOnRoute` opens the route's category on every arrival |
| the fade | the tree fades where it clips — the head once scrolled, the foot while more lies below; kol-theme's `.kol-scroll-fade` with `useScrollFade`, the one rule the app and workshop rails wear too (2026-10-29) |
| the footer | none: the Kolkrabbi credit is opt-in, `sideNav={{ footer: 'credit' }}` (kol-component 0.307.0); a node renders that node |
| the phone | below 768 the rail is the app rail's drawer: off-canvas, a 32px nav Button top-right (hamburger, ×), a scrim that closes on tap, closed by a destination or Escape |
| the TOC rail | a page registers it through `ShellTocContext`; `DocsToc` draws it from the page's headings |
| the wash | `pageWash` paints the plane; the strip and a nested `PageShell` read it, never paint it twice |

## Building a site

1. Install kol-theme, kol-component, kol-framework (and kol-styleguide for a brand site); the cascade order and the `@source` lines are the consumer contract.
2. Write the tree and mount `<SiteLayout navTree={tree}>` as the route element, the pages as its child routes; `apps/site-hub/src/App.jsx` is the shape to copy.
3. Compose pages from the parts: a foldernote's overview is `CategoryPage`, a controls page carries `PageControls`, a document wears `.kol-sheet`, the brand pages are kol-styleguide's.

## Why one frame

Every site on the site rail used to carry its own copy of this frame (`BrandLayout.jsx` in kol-website, kol-branding, kol-acyr-website, kol-olina, and a forked `SideNav.jsx`), and the copies drifted the way the app shells drifted before kol-shell. The frame is the package's now, named for the rail variant it frames, and the sites adopt rather than copy — [[../../operations/07-apps-tier/08-site-adoption|Site adoption]] is the playbook.
