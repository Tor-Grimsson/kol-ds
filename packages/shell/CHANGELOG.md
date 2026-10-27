# @kolkrabbi/kol-shell

## 0.83.0 — 2026-10-27

- **`PhoneNav` as the phone panel picker** (PhoneNavTopAndFold, kol-fxr 2026-10-27, frame E): `placement="top"` (the pill on top, More's sheet below it), `border`, `active="circle"`, `foldable` · `folded` · `onFoldChange` (fold to a left edge tab), `moreKeepsOpen` (More opens without collapsing the pill to the ×, lights only while open, and the open panel stays — a clear scrim). An item may carry `onPress` (a panel the app owns, a second tap its call) and `selected`.
- **New: `TransportPill`** (TransportPill, kol-fxr 2026-10-27): the phone transport as PhoneNav's pill of action slots — `items` `{ id, icon, label, onPress?, selected? }`, `sheetFor` (a slot that opens a sheet of rows centred above it, lit while open), the shadow, the circle, `foldable` to a right edge tab, `placement`. Same TabsRow, so it is the nav's size and look.
- **`MoreRows` rows take `checked`** — a pick list's 22px check, its space kept when false (the loop lengths).
- Needs kol-component ≥0.304.0 and kol-icons ≥0.47.0 (`stopwatch-solid`).

## 0.82.0 — 2026-10-24

- **`HubHome` takes `backReveal`** (HubHomeBackReveal, kol-monitor 2026-10-24): a page-level `backReveal` (`flip-image` · `flip-card` · `hover`) for every Home card, and a file's own `backReveal` wins. Home's file → card map dropped it, so Home's cards were always the default `flip-image` while the Library's turned whole. Monitor passes `home={{ …, backReveal: 'flip-card' }}`.

## 0.81.0 — 2026-10-24

- **`CatalogPage` and `HubHome` take `flipped` · `backHover`** (AppCardWholeFlip, kol-monitor 2026-10-24 — *"make the cards flip on a shortcut and disable the hover"*): a page-level `flipped` turns every card that has a `back` (the app binds a key), `backHover` opts the hover reveal in (off by default since kol-component 0.301.0); a card's own from `toCard` wins. Needs kol-component ≥0.301.0.
- **`AppHub defaultTheme`** (AppHubDefaultTheme, kol-mirror 2026-10-24 — *"make this repo dark mode default"*): `"light"` | `"dark"` (or `app.defaultTheme`) is what the rail's reset and the toggle's system choice land on, instead of the OS — the Hub stamps `data-theme-default` and kol-framework ≥0.55.0's `applyTheme('system')` reads it. A dark-first app stays dark through a reset on a light-mode Mac; omit it and nothing changes. kol-framework peer ≥0.55.0.

## 0.80.0 — 2026-10-24

- **`CatalogPage` keeps its place on Back** (CatalogPageKeepsPlaceOnBack, kol-mirror 2026-10-24 — user: *"going back from module or patch to library or some hub page, previous location is not respected"*). The page keeps a place per HISTORY ENTRY (`history.state.key`, react-router's, a hash router too) and catalog name: the chips, the search, LIST / GRID, the page's own view and the fixed region's scroll come back when Back or Forward shows the same entry again; a fresh navigation is a new entry and starts clean. Always on, nothing to pass; a consumer's `filtersProps` handlers (`onFilterChange` · `onLayoutChange` · `initialFilters`) still apply; a view the consumer controls (mirror's `?view=`) stays the consumer's. Without a router's history key the page is as before.
- **The settings rail's Docs tab; Repo folds into About** (SettingsRailDocsTab, kol-mirror 2026-10-24 — user: *"settings are so overloaded with information that its hard to navigate … we should just start a documentation tab for it"*). `app.docs: [{ label, paragraphs }]` draws a Docs tab on the rail — an app's explanatory prose as data, each entry a section in About's voice, out of the settings sections' notes; `app.links` draw under About (a Links section over the colophon), so the row is Settings · Shortcuts · About · Docs, four words on one line on every hub. No `app.docs` = no Docs tab. The page tier (`HubSettings`) keeps its own ABOUT and REPO.

## 0.79.0 — 2026-10-24

- **`HubHome` files carry `images`; `onBack` · `onImages`** (FileRailImages, kol-monitor 2026-10-24) — a file's `images` `[{ id, src, label? }]` reach the card's rail as its Files section (kol-component), and the Hub hands the picks and writes through: `onBack(file, src)` and `onCover(file, src)` are the Cover and Back picks (the picked image's src, `null` when that image is removed), `onImages(file, next)` the Upload tile and the × — the whole list back. A file without `images` keeps today's rail. Needs kol-component ≥0.299.0.
- **`HubHome` files carry `back`** (AppCardBackCover, kol-monitor 2026-10-24) — a file's second cover (src | node), mapped to the card's `back` as `cover → media` is; the Hub draws nothing else for it. Needs kol-component ≥0.299.0, kol-theme ≥0.187.0.

## 0.78.1 — 2026-10-24

- **Create's parts have the cog and the rail** — `StudioCreate` mounts `AppItemMenuProvider` around its parts grid, as `CatalogPage` does, so a part's card carries every icon the Library's does (cog · trash · download · Insert) and its right-click the one menu. The pass caught it on the reference: `create.parts.fields` read `cog: false` on studio-hub and every hub alike.

## 0.78.0 — 2026-10-24

- **`StudioDetail`** — a module's or a patch's own page, made once (plan home-library-detail-one-card 3.1; user, on three hand-written pages: *"why was this not designed for in rack-hub"* · *"what back is this"*). From data: `back` (a TEXT LINK `‹ Back` in the masthead's eyebrow — never a pill), `title` · `subtitle` (`SectionText level="app"`), `description`, `sections` of rows (`{ kind?, label, value?, hint? }` or `text`), `code` (the first lines and a full-source overlay with download), `preview` (an image with click-to-expand, or the consumer's node), `actions` `[{ label, onClick }]` as DS Buttons, `notFound`. kol-monitor's page of 2026-09-02 was the source; the twins (rack-hub, mixer-hub, studio-hub) render theirs through it at `/library/module/<id>` · `/library/patch/<id>` — a patch card opens its page, Load lives there.
- **`StudioCreate` parts are the one card**: `onPlace` becomes the card's `onInsert` (kol-component 0.297.0) when the consumer's `toCard` hands the file card (verbs, tags), so a part shows title · date · size · cover with download · cog · trash AND Insert; a card with no plate keeps the plate action as before.
- **`HubHome onCover(file, src)`** — the rail's Upload image (kol-component 0.297.0) hands the picked picture to the consumer; the Hub passes it through to every card.
- In the tree: the twins' Library is what the app ships (the shipped presets, the modules — system saves), Home the user's saves; there is no part card — every card carries the same fields and icons (user 2026-10-24, both rulings).

## 0.77.0 — 2026-10-23

- **The settings rail has one shape, on every app** (user 2026-10-24: *"is there no criteria of what information goes into settings rail?"* · *"standardise what goes in"*). The tab row is exactly Settings · Shortcuts · About · Repo — the Hub draws the three from `shortcuts`, `app.about` and `app.links`, on studio-hub as on every hub, and an app has no tab of its own (a fifth word does not fit the rail on one line, *"not 2 lines"*): its rows all go under Settings as sections. **The Hub draws kol-framework's `ThemeToggle` itself** (kol-framework is now a peer; the `themeToggle` prop is retired with a dev warning), and **reset is live on every rail**: it hands the theme back to the system, then runs the app's `drawer.onReset` when it has one. **Rows are typed data** (kol-component 0.296.0) and a row's `render` is refused on the rail with a dev warning, as `content` is. **Nothing an app writes as JSX reaches a Hub surface** (*"how many other must I catch???"*): `app.about` is a string or paragraphs (`About`, drawn on the rail and the page); a walkthrough step's Get started `actions` are `[{ label, onClick, icon? }]` and the panel draws the DS Button — Mirror and Monitor had drawn their own, one not the DS's — closing the walkthrough before each handler; a step's `cover` is a src the panel draws at 60 %; `StudioCreate caseLink` is `{ label, onClick }`. Each warns once in dev on an element (`warnJsx`). In the tree: FXR's rail is fxr.kolkrabbi.io's — Library · Editor · Labs · Randomiser · Morph, Labs entering, the Chrome section gone — with its six settings as typed rows over the editor's store and a reset; Mirror's dropdowns carry the label alone, the detail as the row's hint. Needs kol-component ≥0.296.0, kol-icons ≥0.45.0 for the glyph rule.

- **The hubs against the template** (user 2026-10-24, plan-2026-10-24-hubs-against-the-template). **The settings rail takes rows, never JSX** (*"how is that a thing we allow???"* — Mirror's `content` had worn a helper class on sentences, which the template cannot): `settings.sections` as data, and `tabs` as NAMES the Hub draws itself — `'shortcuts'` (this page's keymap as rows), `'about'` (`app.about` under the app's name, the colophon), `'repo'` (`app.links`) — or `{ value, label, sections }`; `content`, and a tab's `content`, are ignored on the rail with a dev warning (the page tier keeps them). **The Hub draws the theme toggle**: `themeToggle` is kol-framework's `ThemeToggle` COMPONENT and the Hub renders it with its own props on every rail (*"wrong themetoggle"* — two apps had written `tone="sunken"`); an element's props are replaced. **The `app` preset's grid floor is 208** (`CatalogPage`), the track the card's one-line date · size needs, so a narrower page drops a column instead of breaking the row. **`StudioCreate page` / `onPageChange`** — the view, controlled: a consumer's Insert shows the case (monitor's rule), a slot on the case opens the parts (mirror's). In the tree: FXR, Mirror and Monitor draw one `fileCard` with every verb on Home and Library over their own state, Library lands on the files view, Mirror's and Monitor's Create run on `StudioCreate` (their own pages to `_tmp/2026-10-24-create-on-studiocreate/`), FXR's Labs carries its categories statically so Chrome enters, Labs enters, Effects expands at Home, and the parity pass diffs each hub against studio-hub directly (`_tmp/2026-10-24-hubs-pass/pass.mjs`, `docs/operations/07-apps-tier/05-studio-parity.md`). Needs kol-component ≥0.296.0.

- **The rail by name** (2026-10-24): `AppShell rail` (`app` · `site` · `workshop`, NavRail's presets) and `railSections` defaulting to the preset's; AppHub passes `rail="app"` and the preset's phone shape, so a Studio app passes nothing about the rail (AppStudio's own rail props left). **Settings is the rail** (user: *"In studio what kind of settings tier is there? ITS A RAIL"*): the rail tier draws `content` and `sections`, and `tabs` `[{ value, label, content }]` put a text tab row under its header, Settings first — Monitor's Shortcuts, About, Repo; Mirror's Performance — a rail with tabs, never a page. `HubHome` files carry `mark` (`{ icon, label, of? }`) to the card's cover corner and the rail. `PhoneNav` and the sheet speak collapse and expand.

- **His phone review, round 4 (2026-10-23).** `AppShell touch="pill"` — the bar in TabsRow's pill shape, `PhoneNav shape`; it floats over the page (no bottom pad), and `--kol-shell-bar-clear` is what CatalogPage's and StudioCreate's scroll regions and Create's bottom bar clear. **The More sheet hugs its words** (220 floor) and sits BESIDE the collapsed × with their bottom edges on one line (his reference, iOS Photos' menu next to its ×), in the pill's ground and hairline with a 24px rounding, 44px rows of mono-16 and 22px glyphs; on More the bar collapses (TabsRow `collapsed`), the ×, the scrim or a pick expands it. **Home's New and Walkthrough moved into the masthead** (user 2026-10-23: *"into a component like apps/catalog"*): the catalog's inverted full-radius Button in `PageHeader`'s `actions` slot, opening the same sheet — `MoreRows` in `.kol-more-sheet`, the one list both the phone bar's More and this button draw. The foot row is gone, and `CatalogPage`'s fixed region runs to the page's edge when no foot row sits under it (the pad read as a clipped last row), with **a 32px page-wide fade from the page's ground at its top edge**, once rows have scrolled under it, so a cut row reads as folded under the edge (his Firefox example; a fade, not a shadow). With the bar the button hides below `md`. It sits on the title's row and its sheet opens to its left, top edges on one line. **`AppStudio` presets the rail** (user 2026-10-23: *"the rail, do you make a preset for this?"*): `touch: 'pill'`, `railSections: 'enter'` and `barHiddenOn` for Use and every page with `bar: false`, so a Studio app passes nothing about the rail — `shell` still overrides. `HubHome` `note` on a file and `onNote(file, text)`. `StudioCreate`: the rename pencil bare as the filter and search beside it (`IconFrame nav`), and the bottom bar (zoom, the consumer's controls) sits above the phone bar — it was under it.

- **Home's New and Walkthrough ride the phone bar's More sheet** (user 2026-10-23). With the bar (`touch="bar"`), on Home they head the More sheet and the page's foot row goes below `md`; with the drawer they stay on the page. `PhoneNav actions`, `AppShell barActions`, `CatalogPage actionsOnPhone`, and HubHome's walkthrough state is controllable (`touring` / `onTouringChange`). `StudioCreate`'s parts are rows only below `md`, no LIST GRID line.

- **The app tier holds still by default** (user 2026-10-23). `CatalogPage`'s `app` and `catalog` presets default `mode="fixed"`: the masthead and filter row stay, the catalog scrolls in its region, the action row is the foot. A `capped` (site-tier) page and the `shelf` preset still scroll; `mode` overrides. `HubHome`'s `fixed` prop leaves (it is the default). `StudioCreate` holds still on both views, and its parts are the `app` card and row with INSERT as the plate action — one card for the set.

- **`HubHome`: files only, the rail, three columns** (his review of 2026-10-23). `template` and `summary` leave the contract (the blank start rode RECENT as a card nobody could delete — *"yeah drop it"*; the summary line was 0.292.0's `meta`, reversed in kol-component 0.296.0). A file may carry `tags` and `details` `[{ label, value }]`, and `onTags(file, tags)` writes the rail's chips; when files carry tags and no `filterGroups` entry claims the key, the Hub derives a Tags group from them. The list is the `app` preset's three rows across (his 2026-10-22 ruling) — the Hub no longer stacks it one per line. Needs kol-component ≥0.296.0.

- **⌘K in the Hub** (user 2026-10-23: *"no search command k"*). `AppHub` mounts the one `CommandOverlay` in search mode on ⌘K / Ctrl+K, from any Hub page, over Files (Home's `files`, Enter opens through `home.onOpen`), Pages (the rail as drawn, mark first, Enter navigates) and Shortcuts (the keymap as folds, read-only); Esc closes. `S` keeps opening it in shortcuts mode, every section expanded. Needs kol-component ≥0.296.0.
- **New: `media` and `signIn` on `AppHub` and `AppStudio`** (user 2026-10-23: *"they all have media and sign in"*). `media={{ client, accept?, onSelect? }}` pins a Media row at the rail's foot that opens `MediaLibrary variant="modal"` over the client; `signIn={{ signedIn, onPress }}` pins the user row, a person while out and a cloud while in, whose press is the app's. Media, Sign in, Settings, as sentinels; `shell.bottomItems` still replaces the foot. fxr, mirror and monitor each hand-wired both.
- **New: `StudioCreate`** (plan-2026-10-23 § 3.4 — user: *"the create tab, which is a combination of catalog and studio"*). monitor's Create page made once: a page that is fixed on the case view and scrolls on the parts view, an editable masthead (the pencil in the filter row), `ContentFilters` with the view strip CASE ⇄ PARTS, the parts as a catalog (the consumer's groups, LIST and GRID, INSERT on every part → `onPlace`), the case on `CanvasStudio` under the whole-page dot grid, a bottom bar with the zoom readout. The case model, Add row and Set HP (`caseControls`, shown by `caseActions`), the parts and the workbench stay the consumer's; a consumer with its own viewport renders it through `canvas({ gridRef, view, onViewChange })`. `StudioCreateAction` is the bar button. Reference monitor. Needs kol-component ≥0.296.0 (`CanvasStudio`).
- **`AppStudio` pages take `sub`** — a page with `sub` rows is a rail section (folding in place or entering under a Back row by `shell.railSections`); nested paths resolve to their page. `library.key` remounts the Catalog per view.
- **`CatalogPage mode="fixed"`** (plan-2026-10-23 § 4.12, his idea): the page holds the viewport's height, the catalog scrolls in its own region, the action row sits at the foot in the same place with one item or a hundred. `scroll` (default) is the page as it was.
- **`AppHub` mounts `ModalProvider`** (studio-hub review 2, § 0.1). The file rail's Delete confirm, Rename prompt and the Sign in prompt are the DS dialog on every Hub, never the browser's with a console warning; a consumer's own provider above it keeps working (`useModal` reads the nearest).
- **New: `CatalogGrid`; Create's parts are the Catalog's** (studio-hub review 2, § 3.1 — user: *"a new set of card and row … there are 8 columns per row"*). The grid lifts out of `CatalogPage` into one piece — the measured track count (6 at most, 160 floor, `--kol-catalog-n`, reported through `onColumns`), `.kol-catalog-grid`, the list grid with `listColumns` — and `CatalogPage` renders through it with the same numbers. `StudioCreate` draws its parts on it with `ContentCard` / `ContentRow variant="catalog"`; Insert is the `actions` slot (`ActionButton chrome="inline" icon="plus"`) in the plate, the strip under the card is gone. A consumer passes `zoom: false` from `toCard` on Create and Library alike.
- **`AppStudio` passes `sub` every level deep** to the rail (it stopped at two), so Chrome → Labs → Effects → its groups reaches `NavRail`'s recursive enter (kol-component 0.296.0).
- **Media opens the picker; Sign in asks in the DS dialog** (studio-hub review 2, § 5.1 and 5.2 — *"incorrect media, did you not look at mirror"*, *"you didnt include the sign in modal"*). The Media row opens `MediaLibrary variant="picker"` (the column browser with the preview pane, Cancel and Use — mirror's), not the modal. The Sign in row runs fxr's flow verbatim: signed out, `prompt('Password for the library sync:')` (empty cancels) then `signIn.onPress(password)`; signed in, the sign-out confirm then `onPress(null)`. **Changed:** `onPress` now receives the password or `null`.
- **⌘K opens with its Shortcuts sections expanded** (studio-hub review 2, § 6.1 — *"should say collapse all and be already expanded"*): `AppHub` passes every Shortcuts fold `open: true`, as the `S` sheet does; the footer reads Collapse all on open.
- **Settings is tiered and opt-in** (studio-hub review 2, § 6.3 — *"most of the time you will only need a siderail … if you are super heavy then you might want a page, then when the page is getting heavy you might want filters"*). **Breaking default:** with `settings` alone, the Settings row and `,` open `SettingsPanel` over `sections` (theme toggle and `drawer.onReset` in its footer) — no route, no page. `settings.page: true` brings `HubSettings` back at `settingsPath`, now two columns from `lg` (sections left, `SettingsShortcuts`, About and Repo right) with no filter bar, the gear opening the drawer; `settings.filters: true` keeps the page as it was (filter bar, tabs, search). `HubSettings` and `SettingsScaffold` take `filters` (default true). `SettingsShortcuts` rows size to their content (`grid-rows-[auto_auto]`, they were two equal rows); `SettingsLinks` labels never wrap. The in-tree hubs (hub, editor-hub, mixer-hub, media-hub, brand-hub) opt into `page` + `filters`, unchanged.
- **Both phone navs ship; the bar steps aside for a tool** (studio-hub review 2, § 7.1 — *"we should ship both versions … or we have to hide show the bottom when you're in labs or randomiser or morph?"*). New `AppShell barHiddenOn` (paths): on one, the bar unmounts and `--kol-shell-bar-h` is 0, so the tool takes the full height. `touch="bar"` and `touch="drawer"` both stay. Needs kol-component ≥0.296.0 for the bar's rail type.
- **A phone gets rows; quick links are opt-in** (studio-hub review 2, § 7.2 — *"if we opt for just using row card on mobile, then we don't need to show it at all"*). `CatalogPage` below `md` draws the list with the preset's row and no LIST / GRID strip; `phoneLayout="grid"` opts back. New `CatalogPage lead` (a node between the masthead and the catalog). `HubHome touch` is now `{ doors }` only: on a coarse pointer or below `md`, a 2 × 2 of large `Button`s above the rows. **Breaking:** the separate touch page (doors, `recent` rows, All files) of 0.77.0's first cut is gone.
- **Create wears the page masthead** (studio-hub review 2, § 7.3 — *"create page … is using a different header than all other pages?"*). `StudioCreate`'s editable title and subtitle take `SECTION_TEXT_LEVELS.app`'s title and lede classes, height `1lh`, inside `PageHeader level="app"` — measured equal to Library's masthead at 1440 and 390.

## 0.76.0 — 2026-10-23

- **`HubHome` is a data contract** (HubHomeContract, kol-fxr — user: *"you 3 share THE SAME HUB it should not DIFFER, that's literally the reason I made the hub"*). The consumer hands `files` (`[{ id, name, summary?, updatedAt, bytes?, cover? }]`), a `template` (`{ name, summary?, cover?, onOpen }`), `onOpen` · `onDownload` · `onRename` · `onDuplicate` · `onRemove`, `filterGroups` (a group's `exclusive` replaces `filtersProps.mutuallyExclusiveFilters`) and `action` (`{ label, onClick }`); the Hub draws every card itself on `preset="app"` — RECENT = the template + the twelve newest, SAVED = every file, "All Files", grid by default, the `app` row stacked one per line. **Breaking:** `toCard` · `items` · `preset` · `cardVariant` · `rowVariant` · `listLayout` · `defaultLayout` · `filtersTitle` · `filtersProps` · `className` · `actions` · `minColumn` · `maxColumns` no longer reach `CatalogPage` — the Hub warns in dev when it sees one. `CatalogPage` is untouched; Library pages stay per app. Reference: `apps/hub`.

## 0.75.0 — 2026-10-23

- **`CatalogPage preset="app"`** (CatalogAppVariant, kol-fxr). An app's saved files: `cardVariant` and `rowVariant` `app`, three list columns, and the page's one Rename · Duplicate · Delete menu mounted for you — `toCard` returns `verbs` · `download` · `menuItems` · `date` ms · `size` bytes · `media` src and the page passes no `useContextMenu`. Every CatalogPage now mounts `AppItemMenuProvider`, so a `variant: 'app'` card from `toCard` gets the menu on any preset. Needs kol-component ≥0.291.0.

## 0.74.0 — 2026-10-22

- **`CatalogPage` `listColumns`** — the list grid's column ceiling, was a hard 4. Defaults to 3 for a file or slide row, 4 otherwise; tracks never go under 240.

## 0.73.0 — 2026-10-22

- **`NavRail`, `Logomark`, `RailSlotProvider` / `useRailSlot` moved to kol-component** and are re-exported here — every import from `@kolkrabbi/kol-shell` keeps working. `AppShell` renders kol-component's `NavRail`. Needs kol-component ≥0.283.0 · kol-theme ≥0.179.0.

## 0.72.0 — 2026-10-18

- **App pages wear `PageHeader level="app"`** (PageHeaderAppLevel, kol-monitor). `CatalogPage` (and so `HubHome`), `SettingsScaffold` (`HubSettings`), `HubDev` and `AppStudio`'s create page default to the app level — the old mono masthead size — instead of 0.276.0's display-01 hero. A consumer's `header.level` still wins. Needs kol-component ≥0.277.0.

## 0.67.0 — 2026-10-18

- **The Dev page's chrome** (HubDevChrome, kol-monitor — user: *"why did the dev tab move? it was fine where it was. below stage"*). The `code` row closes the app's own rows (under Stage in monitor) instead of sitting above Settings; the tabs are `TabsRow look="chip"`, the tabs ui.kolkrabbi.io's component pages use; no description line under them — a tab's `description` is no longer drawn.

## 0.66.0 — 2026-10-17

- **`S` opens the ⌘K overlay's shortcuts mode** — the whole keymap at a glance, this page's first, typing filters, Enter runs a row (CommandOverlayModes). Needs kol-component ≥0.266.0.
- **`TabStrip` is an alias** of kol-component's `TabsRow look="text"` (TabsStackedLayout, ledger) — same render. `HubDev` and `PhoneNav` use `TabsRow` directly.

## 0.65.0 — 2026-10-17

- **New: `HubDev` and the `dev` slot on `AppHub` / `AppStudio`** (CompareGridDevTab, kol-monitor — user: *"add instructions for making the dev tab to the hub … localhost only using the </> icon"*). `dev={{ tabs: [{ value, label, description, content }] }}` renders a development page at `/dev` behind a `code` rail row above Settings — on a dev server only (`import.meta.env.DEV`; `always: true` overrides), never in a production build. The page: a mono masthead with one line, the tabs on their own row with one line each, the content full width; the open tab is remembered per app. A comparison is a `CompareGrid` tab. Built for reading: monitor supplied the content, not the layout.
- **The shortcuts sheet follows the page:** `AppHub` passes `currentPath` to `ShortcutsOverlay`, so sections with `routes` sort to the page that uses them and the rest sit under ELSEWHERE. `shortcutInScope` is re-exported. Needs kol-component ≥0.265.0.

## 0.64.0 — 2026-10-15

- **New: `library.children` on `AppStudio`** (StudioLibraryChildren, kol-monitor) — renders in place of the CatalogPage, so a router can hold pages under the slot (`/library/:id`) with the Library rung still active. No `children` → the CatalogPage as before. kol-mirror's `Studio.jsx` fork existed for this line alone.
- **New: `create.shell: false`** — the Create slot renders its `children` bare, for a Create that owns its PageShell (monitor's fixed case canvas beside its scrolling modules list).
- **New: `RailSlotProvider` / `useRailSlot`** (NavRailConsumerSlot, kol-monitor) — under the provider, `NavRail`'s opened width carries a consumer slot below the rows and publishes its node; the page portals in with its own state (`createPortal(<Panel/>, useRailSlot().slot)`). Always mounted — content keeps its state across open/close — zero tall while closed, the rows shrink to content while open. `railOpen` mirrors the rail. No provider → no slot, the rail unchanged. Retires monitor's `RackRail` fork.

## 0.62.0 — 2026-10-06

- **New: `NavRail sections="enter"` / `AppShell railSections`** — a section row replaces the list with its rows under a Back row instead of unfolding in place (2026-10-06, the user on labs: "an 'enter' mode in the left sidebar instead of collapse folder"). Default `fold`, unchanged for every other rail.
- **Fixed: pressing a section row in an open rail folds and unfolds it.** `NavRail` opened a section on a press only while the rail was closed; open, the press fell through to `onNavigate` with the section's path, which no consumer dispatches. At a desk that was a dead press on the row's icon and name. On a touch drawer `AppShell` closes the drawer on every navigate, so pressing a section's name shut the nav and loaded nothing (labs on a phone, 2026-10-05 — the same on live fxr). The chevron is unchanged; a row without `sub` still navigates.

## 0.61.0 — 2026-10-02

- **New: the rail's list fades out at its foot** — `NavRail fade` (default `true`), `AppShell railFade`. The rows sit in their own scroll region between the mark and the pinned bottom rows, so a list longer than the window scrolls and runs out under the fade instead of being cut by the edge. `fade={false}` draws it plain. Needs kol-theme ≥0.165.0.

## 0.60.0 — 2026-10-02

- **`TouchDeviceOverlay` `force`** — show the note whatever the pointer and whatever was dismissed (a preview, or a "show it again"); dismissing a forced note stores nothing.

## 0.59.1 — 2026-09-30

- The settings scaffold's display tooltip is one word (`Display`). Comments: one spelling, `color`.

## 0.59.0 — 2026-09-29

- **`AppStudio`** (new, exported) — the workstation: the Hub plus a fixed page set, Home · Library · Create · Use · opt-in pages · Settings, in that order, mono by default. `library` is a CatalogPage, `create` a PageHeader over the editor, `use` the tool full-bleed with no wash; each slot renames with `{ path, label, icon }`. What fxr · mirror · monitor each hand-build. Reference app: `apps/studio`.
- **`AppShell touch="bar"` — the phone bar** (new `PhoneNav`, exported): below `drawerBelow` the rail becomes kol-component's `MobileTabBar` — up to five destinations, else four + **More** (a sheet with the rest and Settings). `barItems` overrides the list. The content pads by `--kol-shell-bar-h`.
- **`AppShell masthead`** (`display` · `mono`, **no default**) — the app's one header voice, read by every page inside (kol-component `MastheadContext`). Unset, every page renders as its own props say, so this bump moves no consumer's headers.
- **BREAKING — `AppHub`: `home` and `settings` are opt-in.** No `home` → no Home page (the mark goes to the tool); no `settings` → no Settings row, route or `,` key (it was pinned whether the app had settings or not). Default `touch` is now **`bar`** (the drawer's hamburger sat over the masthead's controls). Home is the bar's first tab.
- `CatalogPage` — `header.masthead` for a Catalog with no Shell.
- `NavRail` — a section row's fold chevron is `md`, the row's rung (it was 26 beside the 32 glyph button).
- Peer floors: kol-component >=0.229.0 · kol-theme >=0.156.0.

## 0.58.0 — 2026-09-28

- **`ShortcutsOverlay` moved to `@kolkrabbi/kol-component`** (0.228.0) so the workshop shell opens
  the same sheet on `S` as every app. Re-exported here — every `@kolkrabbi/kol-shell` import keeps
  resolving; the peer floor on kol-component is 0.228.0.

## 0.57.1 — 2026-09-27

- `ShortcutsOverlay` — the sheet is capped to the window and scrolls inside; a long keymap ran
  past both edges of the viewport.


## 0.57.0 — 2026-09-27

- **`AppHub` — NEW**, with `HubHome` and `HubSettings`: Shell + Hub in one call — Home, Settings (sections as data, a drawer, a picker, split shortcuts, tabs, `tone`), the tool as children; keys `,` · `S` · `\` · ⌥1–9. `HubHome` takes `title` / `subtitle`. Anatomy: `docs/documentation/04-compositions/16-app-anatomy.md`.
- `AppShell` — `navKeys` walks the bottom rows too.
- `WalkthroughPanel` · `CatalogPage` — `onClose` draws the X inside the card.
- `SettingsScaffold` — the masthead cluster carries the page's tone class.

## 0.51.0 — 2026-09-03

- **`ShortcutsOverlay` and `TouchDeviceOverlay` wear `.kol-overlay-scrim`**
  (overlay-scrim-outliers, kol-client-olina; user, opening the shortcuts
  sheet: *"wow where does this scrim come from? local?"*). Both drew their own
  — an 8 % inverse wash plus a 2px blur — after the 2026-09-01 no-blur ruling
  and the one-tint-48 class. `TouchDeviceOverlay`'s literal `zIndex: 100` is
  `var(--kol-z-modal)`.

## 0.50.0 — 2026-09-03

- **`CatalogPage preset="shelf"`** (slide-variant-and-shelf-preset,
  kol-client-olina; user, after building /slide-deck by hand: *"this is a
  look I DO NOT want to do this again… this is a layout SET"* · *"freeze this
  so I can use AS IS again"*). The whole page as one word: `capped`, 3 tracks
  on a 280 floor, `slide` card and row (component 0.178.0), stacked list,
  `kol-tone-secondary` on the root, the All / Recent view strip. `toCard`
  returns the deck's fields and handlers — `title date bytes count cover href
  onNavigate onDownload onFavourite onDelete favourited` — and the page
  renders the slots (the media admin's idiom: download on the image, star and
  trash on the plate, `SizeOrDownload` on the size); the consumer writes no
  JSX for actions. `catalog` is today's defaults, byte-identical. Explicit
  props win over the preset. Peer: component ≥0.178.0.

## 0.49.0 — 2026-09-03

- **`CatalogPage maxColumns`** (default 6, the ruling) — the grid's ceiling as
  a prop, read by the observer in place of the literal (kol-client-olina
  2026-09-03; user, on a three-deck shelf at five tracks: *"why are the cards
  so small? they could use 2 columns each"*). Olina had raised `minColumn` to
  force three, which is backwards — the floor is a minimum, never a count.

## 0.48.0 — 2026-09-03

- **`CatalogPage` measures its track count and publishes it as
  `--kol-catalog-n`** (with theme 0.138.0). 0.46.0 + theme 0.137.0 had the
  theme compute it with `round()` over a length ÷ length, which Firefox
  rejects: every catalog rendered ONE full-width column (user: *"is this
  supposed to be a joke? huge card"*). A ResizeObserver on the grid now
  computes `min(6, floor((W + 24) / (minColumn + 24)))` — the same number the
  old `auto-fill` resolved to — and the theme's grid and filter-row rules
  read it with a fallback of 6. Peer: theme ≥0.138.0; pair the two.

## 0.47.0 — 2026-09-03

- **`CatalogPage` forwards the whole contract of what it composes** (user
  2026-09-03: *"why wouldn't we as standard practice ALLOW VARIANT CHANGE EVERY
  TIME WE USE THOSE CONTENT CARDS?"*). Five tickets on this file in one day
  were one defect — a key missing from `toCard` because no earlier consumer
  had needed it (`ratio`, `trailingActions`, `rowVariant`, `date` / `size`,
  the list container). `toCard`'s return is now SPREAD onto `ContentCard` /
  `ContentRow`: every prop either takes is reachable per card, including the
  ones not written yet; `variant` per card beats the page's **`cardVariant`**
  (new, default `catalog`) / `rowVariant`; `fit` keeps `cover`. The `file`
  row's `date` · `size` · `meta` · `selected` arrive this way (user, on a deck
  row beside the media admin's: *"this is NOT file row"* — two of its slots
  never reached it). **`listLayout`**: `grid` (default — monitor's four-across)
  | `stack` (one row per line, the media library's shape). Default-preserving
  throughout.

## 0.46.0 — 2026-09-03

- **`CatalogPage` draws its grid with `.kol-catalog-grid`** (theme 0.137.0)
  instead of an inline `auto-fill`, and sets `--kol-catalog-min` from
  `minColumn` on the page — so `ContentFilters`' first group reads the same
  track count the grid renders (CatalogFilterFirstGroupTrackCount,
  kol-client-olina): on a capped page the group sits over the first card
  again. Same tracks at every width as before. Peer: theme ≥0.137.0.

## 0.45.0 — 2026-09-03

- **`CatalogPage rowVariant`** (kol-client-olina 2026-09-03). The list branch
  rendered `ContentRow variant="catalog"` — the 36px GridCard row, `thumb: 0` —
  so the `media` and `ratio` 0.44.0 forwarded reached a row that cannot draw
  them (user, on the bare row: *"ugly ugly ugly"*). `rowVariant` picks the row:
  `catalog` (default — every app-tier list stays exactly where
  CatalogPageMonitorParity ruled it) | `file` (the 48px thumb row), so a
  catalog whose grid shows a cover shows the same cover small in its list.
  A prop, not the literal: three apps' lists were ruled on the bare row and
  did not ask to move.

## 0.44.0 — 2026-09-03

- **`CatalogPage trailingActions` · `minColumn` · list rows with media**
  (kol-client-olina 2026-09-03, on /slide-deck — reviewed from a kol-link edit,
  shipped through the gates here). `trailingActions` fills the header's right
  slot — the one `MediaLibrary` uses for SELECT / FLAT; the page had no way to
  reach it, so every catalog rendered an empty slot beside the divider (user:
  *"that field SHOULD NEVER BE EMPTY"*). `minColumn` (default 160, today's
  number) is the grid track's floor — a shelf of three decks at 160 was three
  slivers and a void; olina passes 280; the six-track ceiling still applies.
  The list branch passes `media` and `ratio` to `ContentRow`, which already
  took both — a deck row rendered as title and detail with no thumbnail.
  Peer: theme ≥0.136.0 (the capped tier's vertical rung).

## 0.43.0 — 2026-09-03

- **`PageShell width`** (two-page-scaffolds-one-job, kol-client-olina) — `bleed`
  (default, the app tier: fills the window) | `capped` (the site tier:
  `--kol-container-max`, centred). The one real difference between a shell
  page and a `.kol-page`, and a prop now so a site adopting `CatalogPage` does
  not silently get app geometry; `CatalogPage` forwards it. The geometry is
  `.kol-shell-page` (theme 0.135.0) instead of an inline style object —
  inline is the `style` prop only — and `PageBleed` is `.kol-shell-page-bleed`.
  Gutter: `--kol-shell-page-pad` now aliases the estate's one page ladder.
  Peer: theme ≥0.135.0.

## 0.42.0 — 2026-09-03

- **`CatalogPage` forwards `ratio`** (catalogpage-card-ratio, kol-client-olina).
  `toCard` carried `fit` but not `ratio`, so every catalog in the estate was
  locked to `catalog`'s A4 with no seam at any level — a consumer with a 16:9
  deck had to leave the page and hand-roll the grid it was shipped to end.
  `ratio={c.ratio}` beside the `fit` that was already there; unset falls
  through to the variant's default, so nothing existing moves. Per card, not
  per page — `fit`'s own argument: one catalog mixes shapes.

## 0.41.0 — 2026-09-03

- **`PageHeader` is no longer exported — import it from `@kolkrabbi/kol-component`**
  (page-header-one-masthead). Same component, same props, plus the new
  `register`. Not re-exported and not aliased: `kol-shell` declares
  `@kolkrabbi/kol-component` as a peer at `>=0.127.0`, so every consumer already
  has it and the migration is one import path. `SettingsScaffold` and
  `CatalogPage` compose it across the seam and are unchanged for callers.
  Recorded in `docs/operations/01-release/04-retirements.md`.
  **Requires `@kolkrabbi/kol-component@>=0.174.0`.**

## 0.40.0 — 2026-09-02

- **A rung's tap decides the drawer, not only the route change**
  (ShellDrawerCloseOnSamePath, kol-monitor 2026-09-02). A rung whose path is
  the one already shown — Create tapped on `/create`, "new case" — changes no
  pathname, so the route effect never fired and the drawer stayed open over
  the page. The rail's `onNavigate` wrapper now sets the drawer to the tapped
  path's rule before delegating: `drawerOpenOn` rungs keep it open, every
  other rung closes it, same path or not. The route effect stays for deep
  links and the fold.

## 0.39.0 — 2026-09-02

- **The touch opener is the grab strip itself — no disc, no chevron**
  (RailGrabTapIsALine, kol-monitor 2026-09-02; user: *"it was a thicker line"*
  · *"who decided it should be a chevron?"*). 0.38.0's `.kol-rail-grab-tap`
  disc was the DS agent's shape, not the ruling; it is gone. The strip stays a
  `<button>` (`aria-expanded`, Enter/Space) and under a coarse pointer the
  theme (kol-theme 0.128.0) widens it and shows its pill thick at rest — the
  same line a fine pointer drags. A press with no travel toggles, as it always
  did. Fine pointers see nothing new.

## 0.38.0 — 2026-09-01

- **`touch="shell"` can be opened by a thumb** (ShellRailCollapsedWithTapOpen,
  kol-mirror 2026-09-01; the user's ruling read right this time — *"i means
  collapsed variant not expanded"*). `shell` is the only mode that keeps the
  48px rail visible, and its only opener was the grab strip: 8px on the line,
  visible on pointer proximity. A thumb never hovers, so on a phone the rail
  could not be opened at all. The strip is a `<button>` now — `aria-label`,
  `aria-expanded`, Enter/Space toggle — carrying `.kol-rail-grab-tap`, a 24px
  disc the theme shows ONLY under `(pointer: coarse)` (kol-theme 0.123.0); a
  press with no travel already toggled, it just had no target. Fine pointers
  see nothing new: the ruled grab stays. The snap seam takes a target now
  (`snapOpenRef.current(false)` closes). Per-route policy is the consumer's:
  `touch={isHome ? 'shell' : 'drawer'}`, as the showcase set now does.

## 0.37.1 — 2026-09-01

- **Fixes 0.37.0: the drawer trigger did nothing.** `drawerOpenOn = []` was a
  fresh array every render sitting in the route effect's deps, so the effect
  re-ran on every render and closed the drawer straight after every tap —
  every consumer taking the default lost its mobile navigation
  (ShellDrawerOpenOnUnstableDep, kol-mirror 2026-09-01; found by the user on
  his phone). The default is a module-level constant now, and the effect is
  keyed on the resolved boolean rather than the array, so a consumer's inline
  `['/']` is safe too. 0.37.0 deprecated. Swept the file: no other
  array/object default sits in a dep array (`navKeys` already keys on a joined
  string).

## 0.37.0 — 2026-09-01

- **`AppShell drawerOpenOn` — the drawer opens on entering a listed route**
  (ShellDrawerOpenOnRoute, kol-mirror 2026-09-01; user: *"the rail should load
  open on home, not everywhere"*). `drawerOpen` was internal state with no way
  in, so a consumer could not say that a home which IS navigation should arrive
  with the rail out. `drawerOpenOn={['/']}` — paths matched like the rail's
  active row (`'/'` exact, else prefix) — and the existing route effect opens
  on entry to one of them instead of closing; every other path keeps
  close-on-navigate. One effect, mount + fold + navigation alike. Above
  `drawerBelow` the list is inert. Default `[]` — nothing moves for a consumer
  that does not pass it.

## 0.36.0 — 2026-09-01

- **`SettingsShortcuts`' six columns are a ceiling, not a command.** The fourth
  home of the cols-as-command defect (SettingsShortcutsGridColumns, kol-mirror
  2026-09-01) — `grid-cols-6` computed six 18px tracks in a 350px row at 390,
  every group a column of single characters. The 0.33.0 idiom, applied once
  more: `repeat(auto-fill, minmax(min(100%, max(150px, sixth-share)), 1fr))` —
  no track under 150 (the widest label and combo in the estate), none wider
  than the container, so the count falls out of the width: two at 390, six on
  the desk, where nothing moves. Below `md` the grid flows by row — the
  column-first two-row shape stays a desk ruling, because with a fixed row
  count the extra groups would spill into implicit columns off the right
  edge. Gap `gap-x-6 md:gap-x-12` (the ContentFiltersMobileGaps rung; 48px was
  17% of the row). No consumer change.

## 0.35.0 — 2026-09-01

- **`touch="drawer"` opens from the LEFT again — 0.34.0 mirrored the panel to
  reposition a button.** The ruling behind `ShellDrawerOnRight` said *"hamburger
  menu location"*; its subject was the trigger, and the whole of drawer mode was
  mirrored to move it. NavRail pins `left-0 border-r` in both modes now (one
  className, no conditional), and the theme's off-canvas transform is `-100%`
  again. The trigger keeps 0.34.0's `top-right, both states` — that is the part
  that fixes the reported defect: it used to translate by the drawer width and
  ride the panel's trailing edge, landing the open X at x 252–284 on a 390
  screen. Pinned to the far corner it never meets a left-hand panel, so the
  2026-08-31 travel rule stays retired. Also kept from 0.34.0: the scrim is a
  button. No consumer change — `touch="drawer"` is the only prop involved.
  (ShellDrawerSideCorrection, kol-chess; pairs with kol-theme 0.121.0)

## 0.34.0 — 2026-09-01

- **`touch="drawer"` opens from the RIGHT** (user ruling: the close must not
  land mid-screen). NavRail pins right-0 with a left border in drawer mode,
  the trigger is fixed top-right in both states, and the trigger-travel rule
  is retired — it was the left side's cure. Desktop rail untouched. Needs
  kol-theme 0.120.0. (ShellDrawerOnRight, kol-chess)
- **The drawer scrim is a `<button>`, not a div** — the OverlayScrimTapDismiss
  line, third instance: iOS Safari does not bubble tap-clicks from
  non-interactive elements, and this scrim exists only on touch devices.

## 0.33.0 — 2026-09-01

- **CatalogPage's cols is a ceiling, not a command** — the third home of the
  defect ContentCollectionMinColumnWidth and ContentGridMinColumnWidth closed,
  unreachable by either because the grid was drawn inline: `repeat(6, 1fr)`
  computed six 29px slivers at 390. Same idiom as ContentCollection now — up
  to 6 (grid) / 4 (list) columns, no track under the floor (160 grid / 240
  list) and none wider than the container. Desktop's sixth-share clears the
  floor, so nothing moves there; the 2×2 expanded-card neighbour math stays a
  six-column ruling. (CatalogPageMobileColumns, kol-monitor)
- **SettingsShortcuts' label yields for real** — `labelWidth="auto"` (needs
  kol-component 0.151.0): the row's fixed 160px label in the grid's ~176px
  columns left the combo cell 4px, so EVERY combo painted into the 48px column
  gap and the first one longer than the gap (`⌥ then 1–5`) reached the
  neighbour's labels. The label truncates, the combo hugs, an over-long combo
  clips at its own column edge. (SettingsShortcutsComboOverflow, kol-monitor)

## 0.32.0 — 2026-09-01

- **Logomark sanitizes fetched SVG before inlining** — `<style>` and `<script>`
  stripped, `on*` attributes dropped (DOMParser, regex fallback for
  unparseable markup), at cache time. An SVG document may legitimately carry
  its own `<style>` — a theme-aware favicon does — but inlined, that `<style>`
  is DOCUMENT-GLOBAL: a consumer pointing `svgUrl` at its favicon put OS-keyed
  ink on every `<svg>` in the app and the symptom surfaced two packages away
  as "the theme toggle is broken". A mark that needs its own styling inlines
  it as attributes. Logomark is the estate's only fetched-SVG inliner (swept);
  the fetch → innerHTML boundary also earns the script/handler strip.
  (LogomarkInlineStyleLeak, kol-chess)

## 0.31.0 — 2026-08-31

- **`AppShell touch="drawer"`** — below `drawerBelow` (default 768) the rail goes
  off-canvas, hands its width back to the content, and a trigger brings it in
  over a scrim. Tapping a destination closes it. At 390 the 48px rail is 12.3% of
  the viewport, and `railToggleKey` could not help because it is a KEY: a phone
  has no keyboard, so on the device where the rail costs most it could not be
  dismissed at all. `bare` was the only other way to reclaim the width and it
  throws navigation away entirely.
- The breakpoint is a WIDTH, not a pointer test — an iPad is coarse and has room,
  a narrow desktop window is fine-pointered and does not.
- **The route-change effect is now mode-aware.** `setNavHidden(false)` on every
  navigation is right for `railToggleKey` and backwards for a drawer; it also made
  `navHidden` unusable as a consumer seam, since child effects run before parent
  effects and a consumer's hide was overwritten in the same commit.
- **`NavRail drawer`** — no grab strip, no drag, no `--kol-shell-rail-width`
  writes on `:root`, rows always labelled, and the rail sizes from
  `--kol-shell-drawer-width` (default 240px). That inline token was the reason a
  consumer needed two `!important`s to fold the rail themselves.
  (ShellRailNoDrawerOnMobile, kol-chess)

## 0.6.1 — 2026-08-15

- `PageHeader`'s eyebrow is **uppercase on `kol-helper-12`** — an eyebrow is
  single-line chrome, which is the whole definition of the helper ramp, and it
  carries its own tracking. Ink off `fg-48` (under half the ink, read as
  disabled) onto `oq-64`; the subtitle moves with it.

## 0.6.0 — 2026-08-15

**`PageHeader` is a real masthead.**

- **A `size` scale**, because two different things were being called a page
  header: `sm` = `kol-sans-heading-03` (app chrome, a titled panel), `md` =
  `kol-sans-display-03` (the default page masthead), `lg` =
  `kol-sans-display-02` (a landing or section opener). heading-03 alone was too
  quiet to open a page.
- **An `eyebrow` slot** — the small label above the title (kol-website's
  "USE CASES"). Self-hides when unset, so an app page passes nothing.
- `subtitle` self-hides too, and the block owns its own rhythm in one `<header>`
  instead of two loose siblings with margins.

**Breaking-ish:** the default `size` is `md`, so existing pages get a larger
title than 0.5.0 gave them. Pass `size="sm"` to keep the compact app heading.

## 0.5.0 — 2026-08-15

- **`PageHeader`'s title had no type at all.** It wore `kol-heading-sm`, a
  retired t-shirt stop with NO rule anywhere in kol-theme — so every page title
  in every shell app fell through to the browser's default `h1`. Mapped to
  `kol-sans-heading-03` (32px), the same way the dead `kol-mono-sm` and
  `kol-helper-lg` stops were mapped. **This visibly changes every page heading.**

## 0.4.1 — 2026-08-15

- `GridCard` reads `var(--kol-ease-house)` instead of hardcoding
  `cubic-bezier(0.16, 1, 0.3, 1)`. The token changed in kol-theme 0.44.0
  (expo → balanced).

## 0.4.0 — 2026-08-15

### Minor Changes

- **`ShortcutsOverlay` takes a sectioned array.** Two forms now, detected on
  shape:

  ```
  flat       [{ label, keys }]                    — unchanged, as shipped
  sectioned  [{ section, items: [{label, keys}] }] — headings between groups
  ```

  The flat form renders **exactly** as before, so no existing caller moves.

  Filed as `ShortcutsOverlaySections` from kol-fxr, whose keymap is grouped
  (Edit · Selection · Layer · Tools · View) and whose `shortcutsBySection()`
  already emits this shape. Flattening it to adopt this component would have
  dropped the grouping, so that consumer kept a 99-line local overlay — the
  exact duplication this component exists to end.

  **One grid, not nested ones.** Headings span both columns
  (`gridColumn: 1 / -1`) so every `keys` cell stays on one axis; a grid per
  section would let each group compute its own column width and the keys
  would stagger down the panel.

  `keys` remains a display string and is still never bound — this component
  shows a keymap, it does not own one.

## 0.3.0 — 2026-08-15

⚠️ **BREAKING — `ContentFilters` is removed from this package.** Import it from
`@kolkrabbi/kol-component`, where it has shipped as an organism since 2026-08-01.

This package's copy was a **recreation of a component that already existed**. The
0.1.0 lift rebuilt it from the kol-monitor/kol-mirror twins without checking the
DS for the original, and 0.1.1 → 0.2.0 — four publishes in one day — tuned the
duplicate. Every layout ruling from those rounds now lives on the real organism
(kol-component 0.44.0); nothing was lost by retiring this.

What did **not** carry over: rendering filter values through `TabStrip`. A
multi-select, handler-carrying, active/rest chip is a `Tag` — the atom whose own
header states the law ("a Tag with no handler is a Pill wearing the wrong name").
Building a second one under another name in another package is precisely the
duplication kol-shell was created to end. `renderFilterValue` goes with it: a
per-consumer value renderer is divergence as an API.

- `ContentFilters` — removed. Quarantined in `_tmp/`, not deleted.
- `renderFilterValue` / `labelClassName` — removed with it. They shipped in 0.2.0
  and lived less than an hour.
- `TabStrip` — **stays**, single-select only. `SettingsScaffold` uses it for real
  tabs; the `Set` multi-select form added in 0.1.2 is gone with the fork.

**Migration:** change the import. `ContentFilters` keeps `filterGroups`,
`renderItem`, `viewModeOptions`, `layoutOptions`, `defaultLayout`, `headerActions`,
`showCountOnlyWhenFiltering`, `searchKeys` and `iconComponent`. Consumers that
uppercased filter values by hand should stop — `.kol-tag` does the casing.

## 0.2.0 — 2026-08-15

**Two rendering seams on `ContentFilters` — additive, nothing moves on bump.**

Three publishes in one day (0.1.1 → 0.1.3) went into re-deciding how a filter value
and a group label should look: chips, then bare strip items, then outlined pills.
None of those is a design-system question — it is what a given app's filter bar
should look like, and the user's ruling ended it: _"this component should not have
problems SHIPPING props… make the fucking content filters FLEXIBLE."_

- `renderFilterValue?: (value, isActive, toggle) => node` — renders one filter
  value. Default is the 0.1.3 strip item. A consumer wanting small outlined pills
  authors them and passes them through; no publish here.
- `labelClassName?: string` — the group label's class. **REPLACES, never stacks**,
  per the 2026-07-30 law: two equal-specificity type classes on one element are
  decided by sheet order, so a stacking seam renders differently in two consumers
  with no version difference. Same contract as `ListingCard`'s `titleClassName`.

Defaults reproduce 0.1.3 exactly, so kol-mirror does not move. Minor, not patch —
this is new public API.

## 0.1.3 — 2026-08-15

Second QA round on the same ticket — two rulings from kol-monitor's live check of
0.1.2. The below-divider position and always-visible strip from 0.1.2 stand.

- `ContentFilters` — a filter group is a **column**: label on top, values beneath.
  0.1.2 put label and values inline on one row, which is not the ruled layout.
- `ContentFilters` — **the filter line carries exactly TWO ink states**, the strip's
  own: active `text-fg-96`, rest `text-fg-32` (hover `text-fg-48`). Nothing on that
  line gets a third. The group label was `text-fg-48` and untracked — it now wears
  the full strip idiom (`kol-helper-12`, 1px tracking) at the **rest** ink, and the
  `Clear all` button drops from `text-fg-48` to the same rest recipe. A selected tag
  value lights up exactly like a selected GRID.
- `ContentFilters` — the below-divider block is now `items-start`, which pins the
  layout strip to the **label row** so values hang beneath it. Values wrap.

Consumers author group labels in the case they want rendered (`TAGS`, `CATEGORY`);
no `text-transform` here, same as the strip items.

## 0.1.2 — 2026-08-15

`ShellHeaderFilterRefinements` reopened by kol-monitor on the user's verdict — 0.1.1
read the ticket's "at the divider level" as the header row _above_ the divider. It is
the row below it. The h1 gap fix from 0.1.1 stands.

- `ContentFilters` — the LIST/GRID layout strip now renders in **one row below the
  divider, right-aligned, always visible**, never in the header row. Filter groups
  share that same row on the left and appear only while the filter toggle is open,
  so an expanded group no longer moves the strip.
- `ContentFilters` — filter values wear the **LIST/GRID strip idiom** (`kol-helper-12`,
  1px tracking, `text-fg-96` active / `text-fg-32` rest) instead of `Tag` chips, with
  the group label inline on the same line. This supersedes 0.1.1's `size="sm"` chip
  fix — there are no chips here now, and the `Tag` import is gone.
- `TabStrip` — `value` accepts a **`Set`** for a multi-select strip, alongside the
  scalar single-select form. Filter values needed per-value active state; copying the
  active/rest classes into a second component is the drift that produced the two
  divergent shells this package was built to end.

**No auto-casing was added.** The ruling asked for values styled like `LIST`/`GRID`;
those render uppercase because the consumer _authors_ them uppercase. `text-transform`
stays off per the DS law — a consumer wanting uppercase tag values authors them so.

## 0.1.1 — 2026-08-15

First adoption-QA round from kol-monitor (`ShellHeaderFilterRefinements`) — three
corrections, all in shell files with no consumer seam to fix them:

- `PageHeader` — the h1's 8px gap to the subtitle, dropped when the component was
  recreated from monitor's local copy, restored **inline on the h1** rather than in
  `kol-heading-sm`: margin in a shared type class leaks estate-wide.
- `ContentFilters` — filter tag chips were hardcoded `size="md"`; they are dense
  chrome and now render `sm`.
- `ContentFilters` — the LIST/GRID layout toggle moved up to the divider row,
  right-aligned beside the count. It previously rendered after the collapsible
  filter block, so expanding a group pushed it down the page. Filter groups stay
  below the divider in left-aligned columns — that layout is now the contract.

## 0.1.0 — 2026-08-14

- Initial release — the application shell set lifted from the hand-copied twins in
  kol-monitor and kol-mirror (AppShellSet lobby brief): `AppShell` + `NavRail` +
  `useNavHidden`, `PageShell`/`PageBleed`, `PageHeader`, `ContentFilters`, `TabStrip`,
  `GridCard`, `SettingsScaffold`/`SettingsSection`/`LabelRow`, `WalkthroughPanel`,
  `ShortcutsOverlay`, `Logomark`. Router-agnostic (`currentPath` + `onNavigate`);
  icons via the `iconComponent` seam; chrome in kol-theme ≥0.41.0
  (`kol-components-shell.css`).
- Shipped drift from the source repos fixed on recreation: the shared dead `ViewToggle`
  import, the `GridCard` hardcoded white `borderTop` (light-theme bug in both apps) →
  `border-fg-04`, monitor's list-detail `text-transform: capitalize` and the strips'
  `uppercase` (no auto-casing law), the rail's raw `z-70` → `--kol-z-sticky`, and the
  2026-08-12 active-wash ruling carried natively via `aria-current="page"` so both
  consumers delete their overrides.
