# Plan — site-hub, the site-rail shape made once

**Raised:** 2026-10-24, the user. Points verbatim: *"we now need to make a demo apps/site-hub like we did for studio-hub, but this is for repos like kol-branding kol-website apps/branding and others that use this kind of siderail"* · *"I need the same thing as we did for studio hub, but for other pages. such as brand. I want to set up the apps/ page so I can tell you how it should look, what kind of pages it should have"* · *"it should be flexible and open ended, we dont have to make every site, just supply the layout and maybe a few pages to demo"*. Screenshots: brand.kolkrabbi.io (Home hero) and brand.another-creation.xyz/styleguide (the chapter book).
**Status:** W1 built 2026-10-24 — `apps/site-hub` on `pnpm site-hub` (5205): the render gate clean (12 page views, desktop and phone), the walk 33/33 (`_tmp/2026-10-24-site-hub-walk/walk.mjs`: the rail from the package with the foot and the collapse, Home · Brand · Assets on VOYAGER, the lit category and the chapter rows following the route, the phone drawer, both themes, console clean). 2.1 built (the theme row, the credit gone); W4 built 2026-10-24 — `.kol-sheet`, `PageControls`, `CategoryPage`, the article card's zoom off, the Research category on site-hub (render gate clean, walk 32/32); 4.5 filed with kol-branding. The last pass (4.10) built. Open: the publish (kol-theme · kol-component · kol-framework); his review of the content pages (4.7) when he has time.
**Shape:** W › phase › list.
**Laws carried:** the reference app is dummy data on the shipped packages, never a fork (studio-hub's line); the site rail is `NavRail variant="site"` in kol-component, the frame is kol-framework's `PageLayout` (ARCHITECTURE §3, amended 2026-10-22); apps/* rules in `docs/operations/07-apps-tier/01-tier-rules.md`; ONE `public/` (§7); the Dev row where a rail has one; removed code to `_tmp/<date>-<what>/`; every page he names is his, nothing added he did not ask for.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — The app, on the shipped frame

### 1.1 — `apps/site-hub` scaffold (P1) — ✅ built 2026-10-24
- A new apps/* member on studio-hub's pattern: `package.json`, `vite.config.js` (own port after studio-hub's 5190, `host: true`, built to `showcase/dist/apps/site-hub`), `index.html` with the theme boot, `src/main.jsx`, `src/index.css` (the cascade and `@source` lines as studio-hub), `pnpm site-hub` at the root, and the row in the apps tier doc.
- `src/App.jsx` on kol-framework's `PageLayout` with `NavRail variant="site"` (through `SideNav`), BrowserRouter as every site repo runs, VOYAGER as the client. The rail's tree, the foot (theme toggle, the "Kolkrabbi Vinnustofa · 2026" line) and the collapse are the package's; nothing is drawn locally.
- **Acceptance:** `pnpm site-hub` opens on its port, the site rail renders from the package with the foot and the collapse, on the site's theme law (explicit > system > light — no dark default; the Studio's dark is the studio apps' ruling, corrected from this line's draft), the console clean, the apps-tier gate green.

### 1.2 — A few demo pages (P1) — ✅ built 2026-10-24 (the rail's categories load closed by the elder ruling 2026-08-06, so Brand's chapter rows show once its row is pressed; VOYAGER's marks carry their own fill, so the logomark stays black in dark — the fixture's, for W2)
- Home: the hero landing from the first screenshot — mark, name, tagline, one button — on VOYAGER's data.
- Brand: the chapter book from the second screenshot — eyebrow, title, lead, numbered sections — with the rail's sub-rows under it.
- Assets: one catalogue page of VOYAGER's files, as a third shape of page.
- The rest of the rail as rows that link out or hold a placeholder, so the tree reads whole; which rows, and in what order, is his (W2).
- **Acceptance:** three pages render from the shipped components on dummy data; the rail's active state, sub-rows and expand/collapse follow the route; Playwright walks the three and the phone drawer.

## W2 — The look and the pages, as he directs — TALK

### 2.1 — The theme row and the credit (P: *"this theme toggle is not the same kind of row item as the rest, and I dont think we need the credit below … put theme toggle without the text just the rolling icon and pair it with a text in the same as in the rows"*) — ✅ built 2026-10-24 (unpublished: kol-framework `ThemeToggle variant="row"`, `SideNav` passes it; the check 14/14 — the theme row measures as the ICONS row to the pixel, x 0 · h 36 · icon at 24 · label at 56 · helper-12 uppercase, same hover, flips expanded and collapsed, the footer gone)
- The rail's theme slot draws `ThemeToggle variant="hop-bare"` (kol-framework SideNav `themeSlot`): its own glyph and a sentence-case label, not the tree's row. It becomes a hop row: the rolling icon (`ThemeToggle variant="icon"`) in the icon column, the toggle's own words in the rows' voice beside it, the row's geometry and hover — in the package, so every site gets it.
- The credit goes: site-hub passes `footer={false}`; whether the package default follows is his.
- **Acceptance:** the theme row measures as a tree row (glyph column, label voice, pitch); the footer box is gone; the toggle still flips the theme, collapsed and expanded.
- He opens the app and says what it should look like and what pages it should have; each ruling becomes a phase here, built on the package first.
- Where a site's fork carries what the package rail lacks (acyr's chapter groups inside a section, the collapse chevron's placement), the lift into kol-component / kol-framework is its own phase, under his ruling, published before the reference uses it.

## W4 — Content shapes: a Research category on site-hub, the parts in the DS first (P: *"its all over the place … foldernotes like opt in behaviour … some pages have filtering system … very text driven … an annoying habit of using article contentcard with a stupid zoom on hover … a broken search system … I would like to use kol-atlas styles at least in part … suggest labels, sections, cards, chapters, containers, filters (not content filters)"*; his go 2026-10-24: "sure")

### 4.1 — `.kol-sheet`, the document voice (P1) — ✅ built 2026-10-24 (kol-theme `kol-typography.css`, beside `.kol-prose`; the spec on itself at /research/sheet measures h1 36 · h2 24 · h3 18 · body 15/24 · the outline 20 · the plain table head mono 12, both themes)
- The Research-Spec's sheet CSS (kol-branding `src/canvas/source/Research-Spec.dc.html`, the kol-atlas spec) carried class-for-class into kol-theme as `.kol-sheet`: the 724 edge, h1/h2/h3 with hairlines and the `why` aside, the `when` / `dw` lines with their `k` key, `note`, `tb`, footnotes (`sup.fn`, `ol.fns`), `term` and `term.missing`, the `media` figure grid, `tablewrap` plain and `kv`, `totalbar`, the `ol` outline (details/summary, `mk`, `cnt`, `meta`), the `proj` numbered margin. Its four variables map onto KOL tokens (ink, muted, line, soft, accent, note; display, body, mono) — no new values.
- **Acceptance:** the Research-Spec's own body rendered under `.kol-sheet` on site-hub measures as the spec does (edge 724, h1 36, h2 24 with a hairline, the outline's summary 20, table th 11.5 uppercase); both themes; no app CSS.

### 4.2 — The page controls strip (P1) — ✅ built 2026-10-24 (kol-component `PageControls`, wayfinding; Compare and Boards draw it, sticky, chips change the count, the legend follows the chips, jump lands)
- One strip under the page header, sticky: slots `toggles` (Tag chips), `views` (SegmentedToggle), `jump` (TabsRow chips), `legend` (dot + name), `count` (the readout, right). kol-component `PageControls`; the order is the slot order, every page the same. Compare's and Moods' strips (kol-branding) are the two specimens.
- **Acceptance:** the compare and boards pages on site-hub draw it from one component; the strip holds one row of toggles · views · count and a second of jump · legend; sticky under the header at 1440, wrapping at 390.

### 4.3 — The category overview page (P1) — ✅ built 2026-10-24 (kol-framework `CategoryPage`; site-hub's Research overview draws its three cards from the tree's `card` rows, a card opens its page) · ✅ the FOLDERNOTE 2026-10-24 (his correction: *"make a prop so you can choose if you want to make the category a clickable page"* — `to` on a category with `pages` makes its rail row the page, opening and disclosing in one press, the caret alone toggling; Research's Overview sub-row gone; Brand and Assets keep theirs until he says; the walk 38/38)
- The foldernote: kol-framework `CategoryPage` — `PageHeader` (the category's label and lede) over a `ContentCollection` of its pages as the article card, read from the nav tree: a page row carries `card: { eyebrow, body, media, meta }` beside `to` and `label`. The rail's category row opens it (`to` on a category with pages).
- **Acceptance:** site-hub's Research row opens its overview with its four pages as cards from the tree; nothing listed by hand.

### 4.4 — The article card's hover zoom goes (P1) — ✅ built 2026-10-24 (`ContentCard` MEDIA.article `zoom: false`; measured: no transform on hover)
- `ContentCard variant="article"` stops scaling its media on hover, as the app card's hover fill went (2026-10-23).
- **Acceptance:** no transform on the media on hover, measured; the card's other states unchanged.

### 4.5 — One search modal (P1) — kol-branding's — 🔵 filed 2026-10-24 as `kol-branding/lobby/inbox/one-search-modal.md` (no kol-branding session was live; receipt in `lobby/outbox/`)
- kol-branding runs the Hub's ⌘K modal and its own `CommandOverlay`: the rail's Search row opens the second with an empty query (the input alone, the scrim over everything else). The rail row and ⌘K open the Hub's modal, fed the app's index; the second overlay goes to `_tmp/`.
- **Acceptance:** pressing Search on the rail and ⌘K open the same modal with PAGES, SHORTCUTS and the app's results; one scrim.

### 4.6 — The Research category on site-hub (P1) — ✅ built 2026-10-24 (Overview · Compare · Sheet · Boards on VOYAGER and the spec's own text; the render gate clean on 20 page views; the walk 32/32 at 1440 and 390, both themes, console clean)
- A fourth category: Overview (4.3), Compare (4.2's strip with toggles, views, jump and legend over five columns, VOYAGER's ramps side by side), Sheet (the Research-Spec's body under 4.1, chapters on the TOC rail), Boards (the Moods shape: board pairs with a dot pager and 4.2's strip, VOYAGER's mood, stationery and deck boards).
- **Acceptance:** the four pages render on the shipped parts and real text (the spec's own, VOYAGER's); the render gate clean; the walk covers each page at 1440 and 390, both themes, console clean.

### 4.8 — Groups within a category (P: *"a prop where if a page is not split into sections rather then sub-pages we allow for categories within a page like another-creation … just as an option"* · *"look at uppercase sections … the system has to be used whole sale or not at all"*) — ✅ built 2026-10-24
- The rail's `{ label, children }` group node, already there (0.24.0), is the option; its header is UPPERCASE now, as the reference carries it (kol-component NavRailSite, kol-framework.css note amended), and at ONE ink — it never lights (his ruling: *"just keep them same opacity"*; the row's dot carries the active state).
- site-hub's Brand is a foldernote with every chapter in a group (Brand overview · Logos · Foundations), no loose row; the grouping helper throws on an ungrouped chapter.
- **Acceptance:** group headers uppercase; Brand's row opens the book and discloses; six chapter rows under three groups, none loose; a chapter row lands and lights.

### 4.9 — The collapse: one motion, the rung on a press (P: *"collapsed state should not show chevron … some shifting and not very smooth animation between collapsed and expanded rail"* · *"ship default width at certain breakpoints, like the app-rail does, and clicking the rail when collapsed should go to that default"*) — ✅ built 2026-10-24
- The folder's chevron carried a display utility that outranked the collapsed rule; its box lives in `.kol-sidenav-hop-caret` now and it hides like the others.
- THE CLIP MODEL: the collapsed row is the wide row with its gutter eased to the narrow column's centre and its label faded, on the grid's 180ms clock (kol-framework.css; the easing rides kol-theme's `.kol-sidenav-hop` rule, which outranks the framework's); the Tooltip wraps the row in both states; `RouteLeaf` hoisted out of the component — declared inside, every row remounted on each render, which was the flash.
- The rungs the rail ships: collapsed below 1024, 264 to 1535, 320 from 1536 (the app rail's ladder). A press from collapsed lands on the rung for the viewport and clears a dragged width (`useDragResize.toggleCollapsed`).
- **Acceptance:** sampled per frame — glyph 24 → 18 and the label 1 → 0 in step with the width 264 → 56, rows attached throughout, caret hidden collapsed; dragged to 320, press-press → 264 with the override cleared; walks green.
- Then (his review): the theme row's tooltip trigger sized itself to the hidden label and centred wide, so the toggle sat half off the narrow rail — the row's trigger is the rail's (right, block, full width, present in both states); and a press on the collapsed rail no longer expands it (`expandOnSelect` default `false`, reversing the 2026-08-09 brand ruling on his word) — a row navigates, a category discloses for later, the toggle flips the theme, the rail stays at 56.

### 4.10 — The last pass: SiteLayout, the phone drawer, the docs (P: *"why not SiteLayout instead? to at least name it with variant 'site'"* · *"in the app-rail preset they offer both phonenav type and a siderail with hamburger-menu/close … I think we should use that hamburger siderail"* · *"how do I tell agents to use this system? how is it documented?"*) — ✅ built 2026-10-24
- `PageLayout` → `SiteLayout` in kol-framework, named for the rail variant it frames; `PageLayout` and `AppShell` stay aliases; in-repo consumers, the registry, the classification and the docs renamed.
- The site frame's phone mode is the app rail's drawer: below 768 the rail is off-canvas and slides on the shell's 220ms curve, kol-theme's `.kol-shell-drawer-trigger` (32px nav Button, top-right, hamburger/×) and `.kol-shell-drawer-scrim` (a button), closed by a destination, the scrim or Escape; the round top-left hamburger and the opacity backdrop in `_tmp/2026-10-24-site-drawer/`.
- Docs: `04-compositions/18-site-frame.md` (SiteLayout as the entry, the parts, the tree contract, the frame's behaviour, how a site is built) and `07-apps-tier/08-site-adoption.md` (the playbook beside the Studio's); index rows; metadata, vault-links and frontmatter gates clean.
- **Acceptance:** at 390 the trigger sits top-right, the drawer opens and closes on a destination, the scrim and Escape; at 1440 there is no trigger; the desktop walks green (38/38, 14/14); roster and props clean.

### 4.11 — Both rails in one app (P: *"is there a apps/* for the siderails? with an action button like in catalog to see both?"*) — ✅ built 2026-10-24
- `apps/shell` carries catalog's Variants button with one axis, Rail: app (`AppShell`, the phone bar) · site (`SiteLayout` on a HashRouter, the grab edge, the phone drawer) — the same ten pages and hash routes under either, so a switch keeps the page; the choice persists per browser.
- **Acceptance:** the switch swaps the rail and keeps the page; the site rail lists the ten rows and Settings; at 390 the site branch shows the drawer trigger beside the Variants button; render gate clean (4 page views); console clean.

### 4.12 — The rail's gutter is the chrome inset (P: *"is that the padding that we document as correct for mobile?"* · *"obviously, how are you even asking if we follow DS documented rules?"*) — ✅ built 2026-10-24
- The rail carried a literal 1.5rem gutter at every width; the documented inset is `--kol-pad-chrome-x` (05-layout-systems: 20 on a phone, 24 from 768). Every x in the rail reads the token now — the row and header gutter, the group label and page row indents (inset + the icon column + the gap), the dot's left, the footer — so the phone drawer lands on 20 and the desk stays at 24. The drawer-open rows had also kept the narrow rail's zero gutter; they are the wide row.
- **Acceptance:** desk rows at 24, page rows at 56, dot at 42; the phone drawer's rows at 20, page rows at 52; walks green.

### 4.7 — His review of the content pages — PARKED: his call 2026-10-24, *"I dont have time to deal with how wrong the content pages are"*
- The empty band on Overview, Compare and Boards is `PageHero` (the brand book's 72dvh opening band); those pages take `PageHeader` at the top.
- The controls strip paints surface-primary over a washed plane and reads as a plate; PageLayout hands the strip its wash.
- `.kol-page` caps the plane's width; the plane goes full width, text keeps its own measure.
- The Sheet page shows the spec's specimen table with its notes column and gutter tint beside the TOC rail; it becomes a document in the sheet voice.
- A board sits in `AssetCard`'s plate; a board is the image at its aspect with its name under it.
- **Acceptance:** each line walked on its page at 1440 and 390; his look.

## W3 — The pass and the sites — PARKED: not asked; "we dont have to make every site"
- A `pass-sites.mjs` regenerated from the Studio pass, diffing a site repo against site-hub surface by surface.
- Which repos adopt it (kol-branding, kol-website apps/brand, kol-acyr-website apps/styleguide, kol-olina, apps/brand here) is his call, one step per message, only the repos he names.
- The earmarked "which rail a brand site wears" (AGENT-CONTEXT, 2026-10-22): site-hub beside brand-hub is the live specimen; his session.
