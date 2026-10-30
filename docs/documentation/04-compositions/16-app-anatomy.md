---
title: App anatomy
type: reference
status: draft
created: 2026-09-26
updated: 2026-10-29
description: An app's six layers, engine to fixture
aliases:
  - app anatomy
  - shell catalog hub tool
  - hub
sources:
  - packages/shell/src/index.js
  - packages/shell/src/AppHub.jsx
  - packages/shell/src/HubHome.jsx
  - packages/shell/src/HubSettings.jsx
  - apps/hub/src/App.jsx
  - packages/shell/src/CatalogPage.jsx
  - packages/shell/src/SettingsScaffold.jsx
  - apps/media-hub/src/App.jsx
  - packages/shell/src/PageShell.jsx
  - apps/curves/src/App.jsx
  - showcase/src/nav/placements.js
tags:
  - domain/compositions
  - domain/architecture
related:
  - "[[../00-overview/05-names|names]]"
  - "[[11-shell-system|shell system]]"
  - "[[../../operations/07-apps-tier/INDEX|apps tier]]"
  - "[[23-website-frame|Website frame]]"
  - "[[17-rail-and-overlay|rail and overlay]]"
---

# App anatomy

The vocabulary for talking about a KOL app (user ruling 2026-09-26). Four layers, each inside the one above it. **Status: draft** — the table was refined against the monitor, mirror and fxr code on 2026-09-26 and the Hub shipped as `AppHub`; it stays draft until `apps/hub` is reviewed.

| Layer | What it is | Lives in today |
|---|---|---|
| **Engine** | plain JS, no UI — parse, index, rank (ARCHITECTURE §3's engine tier). Its app is a lab, not a tool | `kol-markdown` · `kol-search` |
| **Shell** | the frame — the rail, the layout root, the navigation keys, **the phone bar**, **the app's one masthead** | `kol-shell` · `AppShell` + `NavRail` + `PhoneNav` |
| **Catalog** | the ContentFilters **page** — title row, filter and search (the kol-search engine), the view toggle (RECENT · SAVED), LIST · GRID, the cards, the action row under them. The whole page layout, not only the filters | `kol-shell` · `CatalogPage` |
| **Hub** | the standard pages around the work — Home (a Catalog), Settings, the shortcuts sheet, the walkthrough — and the keys that reach them. **Every page opt-in** | `kol-shell` · `AppHub` (parts: `HubHome` · `HubSettings`) |
| **Tool** | the work area itself — the rack, the editor, the media browser, the styleguide | each app's own; shared ones graduate to packages |
| **Fixture** | fake, mutable data and the wiring the apps share — no page of its own | `apps/media-fixture` · `apps/workshop-fixture` |

**An app is Shell + (Hub) + Tool, and a Hub's Home is a Catalog.** The Shell is not optional; the Hub is, page by page (2026-09-29: `home` and `settings` are opt-in on `AppHub` — no prop, no page, no rail row, no key). monitor is Shell + Hub + the rack; media-hub is Shell + Settings + the media tool, with no Home. `AppHub` is Shell + Hub in one call: the app describes itself and passes its tool as children.

**One app, one masthead (ruling D3, 2026-09-29).** `AppShell masthead` — **no default** (user, 2026-09-29: unset, every page keeps its own props, so a consumer's bump moves nothing) — `display` (the display voice, uppercase as a role, no description — MEDIA, CURVES) or `mono` (the mono title with its description) — is read by every page inside: `PageHeader`, the Hub's pages, `CatalogPage` and a tool's own title (`utilities/masthead.js` in kol-component). A Catalog with no Shell sets `header.masthead` itself. Before this, media-hub wore both voices, one per page. **Superseded for `PageHeader` 2026-10-18** (kol-component 0.276.0): it is one header (Round 11) and ignores the masthead — app pages take its `app` level (kol-shell 0.72.0); only a tool's own title (media's library header) still reads it.

**The phone bar (2026-09-29).** `AppShell touch="bar"` — `AppHub`'s default — takes the rail off below 768 and puts it in a bottom bar (kol-component's `MobileTabBar`): up to five destinations, else four + **More**, a sheet with the rest and Settings. The content column pads by `--kol-shell-bar-h` and `PageShell` subtracts it, so a full-height page ends above the bar. `touch="drawer"` (the hamburger) still exists; its fixed trigger sat over the masthead's controls, which is why the Hub left it. Both ship (2026-10-23): `shell.touch` picks, and `barHiddenOn` lets the bar step aside on a tool's paths. A phone gets the catalog as rows with no LIST / GRID strip; `home.touch.doors` puts quick links above them — `touch.label` as the eyebrow, then one full-width button per door, the icon on both ends (fxr's chromes, its original chooser, 2026-10-28; monitor and mirror pass none). More lists the whole nav, then the page's actions; `PhoneNav variant` sets the pill's look (`AppShell navVariant`, default `nav`).

## The Hub

Read off monitor, mirror and fxr (2026-09-26) — each assembled the same Hub by hand:

| Part | What all three did | The Hub's rule |
|---|---|---|
| Frame | the same `AppShell` props: Settings pinned bottom, kol-brand mark, `\`, `,`, `touch="drawer"`, `pageWash fg-02` | `AppHub`'s defaults (since 2026-09-29: `touch="bar"`, no `masthead` default, Settings only when `settings` is passed); anything else through `shell` |
| ⌥-digits | a local handler ×3 — `navKeys` missed the bottom rows | `navKeys` walks mark → items → bottom rows; on by default |
| Home | `CatalogPage` + mono masthead + RECENT · SAVED + a Walkthrough toggle + a Get-started step — and, until 2026-10-23, each still wrote its own `toCard`, preset, row, list and filter label through `HubHome`'s passthrough, so the three Homes drifted on every one | `HubHome` is a **data contract** (HubHomeContract, 2026-10-23): the consumer hands `files` `[{ id, name, updatedAt, bytes?, cover?, tags?, details? }]`, `onOpen`, `onDownload`, `onRename`, `onDuplicate`, `onRemove`, `onTags`, `onNote`, `filterGroups` (opt-in, `exclusive` per group) and `action` `{ label, onClick }` — and the Hub draws every card on `preset="app"`: RECENT = the twelve newest, SAVED = every file, "All Files" everywhere, grid by default, the list = the app row three across (his 2026-10-22 ruling). **Files only** (2026-10-23): no blank-start card — New is the action button. The card is title, date and size; the cog opens the file's rail — the settings drawer, `SettingsPanel variant="rail"` (name, tags, details, the verbs as icon buttons in its footer). When files carry `tags` and no group claims the key, the Hub derives a Tags group from them. Views RECENT · SAVED (labels renamable, values the Hub's), walkthrough opt-in with its X inside the card. No `toCard`, no passthrough — a consumer with no knob cannot drift; the Hub warns in dev on a retired prop. **Every verb, on Library too** (2026-10-24): a hub passes every handler over its own state, and its Library draws the same card — one mapping — over what the app ships (Home's files are the user's saves, never the Library's list — corrected the same day). The rail opens Details with the card's own Date and Size, and in edit mode a Cover row — Upload image through `onCover(file, src)` (kol-component 0.297.0 · kol-shell 0.78.0). **Files (FileRailImages, kol-monitor 2026-10-24):** a file's `images` `[{ id, src, label? }]` sit in the rail as thumbnails between the fields and Details — click opens quicklook (`MediaInspector`); in edit mode × removes one and an Upload tile adds one, both writing the whole list back (`onImages(file, next)`), and Cover and Back are *picked* from them (`onCover(file, src)` · `onBack(file, src)`, the picked image's src, `null` when that image is removed) — Upload image as the only cover path goes. The pencil sits in the foot row with download, duplicate and delete; the header keeps the ×. No `images` on the file = the rail as before. **The walkthrough is data** (2026-10-24): a step's `cover` is a src the Hub draws, its Get started `actions` are `[{ label, onClick }]` drawn as the DS Button (Mirror and Monitor had drawn their own); `app.about` is a string or paragraphs. Reference: `apps/studio-hub` |
| Settings | `SettingsScaffold` with SETTINGS · ABOUT · REPO, the same subtitles and theme toggle, About = prose + colophon, Repo = links, shortcuts at the foot | `HubSettings`: fxr's page as the reference, every feature opt-in — `sections` (rows as data, searched) · `drawer` (the gear opens the same sections) · `picker` · `splitShortcuts` (OPTIONS / SHORTCUTS) · `content` · extra `tabs`; ABOUT · REPO below the rule. **Three tiers on `AppHub settings`, opt-in (2026-10-23):** the rail by default — the Settings row and `,` open `SettingsPanel` over `sections` as TYPED rows (`choice` · `switch` · a text value · a section note; the Hub draws every control and string; the tab row is exactly Settings · Shortcuts · About · Repo on every app, no app tab; no JSX reaches the rail, 2026-10-24), the theme toggle (kol-framework's, drawn by the Hub) and a live reset (the theme back to the system, then the app's) in its footer, no route; `page: true` — the page at `settingsPath`, two columns from `lg` (sections left, the shortcuts, About and Repo right), no filter bar, its gear opening the drawer; `filters: true` — the page keeps its filter bar, tabs and search |
| Shortcuts sheet | `S` in monitor and mirror, `?` in media-hub (now `S`) | `S` toggles it, Esc closes, off with `shortcutsKey={null}`; `⇧S` toggles the same keymap as the right rail (`ShortcutsOverlay variant="rail"`), off with `shortcutsRailKey={null}`; the ⌘K modal (`CommandOverlay mode="shortcuts"`) with no field — this page's sections as categories under "Shortcuts", every one open on arrival and Collapse all folding them (2026-10-23), ← / Backspace back, no Run; a section with `routes` shows only on its pages; every mode is on apps/hub's Dev → Overlays — bind its keys with `shortcutInScope` |
| Search | each app's ⌘K was its own, or absent | ⌘K / Ctrl+K opens the one `CommandOverlay` in search mode from any Hub page, over Files (Home's `files`, Enter opens through `home.onOpen`), Pages (the rail as drawn, mark first) and Shortcuts (the keymap as folds, read-only); Esc closes (2026-10-23) |
| Media, Sign in | fxr, mirror and monitor each hand-wired both through `shell.bottomItems` | `media` (`{ client, accept?, onSelect? }`) and `signIn` (`{ signedIn, onPress }`) on `AppHub` and `AppStudio`: Media opens the picker over the app's client (`MediaLibrary variant="picker"`, mirror's), Sign in shows a person while out and a cloud while in and asks in the DS dialog — the password, then `onPress(password)`; the sign-out confirm, then `onPress(null)`; pinned Media, Sign in, Settings, sentinels never routes (2026-10-23). `signIn.page` (a path or a function, 2026-10-29) sends every Sign in the Hub draws — the rail's foot row, the signed-out +, the phone's More — to the app's own page instead of the dialog; `AppStudio` forwards `phoneNav` |
| Dev | a hand-built `/dev` page apiece, gated differently (monitor localhost-only with `code`, mirror always with `component`) | `HubDev` from `dev={{ tabs }}`: a dev server only, the `code` row after the app's own rows, `/dev`; chip tabs (`TabsRow variant="chip"`), then the content full width; a comparison is a `CompareGrid` tab |
| Account | fxr kept the account in a second rail of its own (`AccountRail`), reached only from the rail's foot | `signIn.user` draws the account row (the picture, or the outline `user` glyph); signed in, Home's menu and the phone's More end on it (HomeMenuAccountRow). `signIn.account: { sections, content?, footer? }` is an **Account** tab, first in the settings rail: typed rows, a node for what rows cannot say (the picture, Upload), and `footer: { label, onPress }` (Sign out — frame D2's full-width md Button in the rail's foot on that tab, where the toggle and reset sit on the others, 2026-10-29). Without `onProfile` the account row opens the rail on that tab (SettingsAccountTab, 2026-10-29). Reference: `apps/studio-hub` |
| Rows | every new row in a Hub menu was a DS round trip | **The app owns its rows** (HubAppOwnsItsRows, 2026-10-29): `home.menu` (the masthead's button), `home.signedOutActions` (the + signed out), `shell.foot` (the rail's pinned foot) and `phoneNav.more` (the phone's More sheet) each take `(defaults) => rows` — keep the Hub's rows and edit, or replace them. Rows are `{ icon, label, onPress \| path, avatar? }`; the Hub draws them |

**Routes.** `/` is Home, `/settings` is Settings when the app asks for the page tier, any other path is the tool. Router-agnostic, like `AppShell`.

## Pages

<!-- placements: app -->
Every page that fits AppShell, from `showcase/src/nav/placements.js` (the list apps/layouts and `validate-placements` read).

| Page | Placement |
|---|---|
| `HubHome` | runs here today |
| `HubSettings` | runs here today |
| `HubDev` | runs here today |
| `StudioCreate` | runs here today |
| `StudioDetail` | runs here today |
| `CatalogPage` | runs here today |
| `SettingsScaffold` | fits, placed for review |
| `EditorShell` | fits, placed for review |
| `MediaLibrary` | runs here today |
| `Decks` | runs here today |
| `DeckEditor` | runs here today |
| `Notes` | runs here today |
| `PrintStudio` | runs here today |
| `MetricsDashboard` | runs here today |
| `ChessAnalysisLayout` | fits, placed for review |
| `TimeSet` | fits, placed for review |
| `ResumeLibrary` | runs here today |
| `ResumeSource` | runs here today |
| `ResumeTreatment` | runs here today |
| `KitPreview` | fits, placed for review |
<!-- /placements: app -->

## Dev favicon

A dev tab must read apart from production at a glance (2026-10-17). Every app's `vite.config` runs
`devFavicon({ label, ground })` from `@kolkrabbi/kol-framework/vite`: on the dev server the favicon becomes a
solid tile with the app's ONE letter; a build keeps the real one. It replaces the icon link (a second link loses
in Firefox) and never runs in the browser.

| App | Label | Ground |
|---|---|---|
| kol-ds-ui showcase (ui.kolkrabbi.io) | K | `#7C5CFF` (the default) |
| kol-ds-ui `apps/*` | the app's first letter (`M` media, `E` editor, `R` rack …) | `#7C5CFF` |
| kol-monitor | M | `#CE4646` |
| kol-mirror | W | `#49A0A2` |
| kol-fxr | X | `#F2D24B` |

A new app picks a letter and a ground no other app uses, and adds its row here.

## The Studio

**The Studio is the Hub plus the workstation's page set** (apps review §6c, 2026-09-29) — what fxr ·
mirror · monitor each hand-build, monitor.kolkrabbi.io the reference. `AppStudio` in kol-shell:

| page | path | prop | what |
|---|---|---|---|
| Home | `/` | `home` | the landing Catalog — RECENT · SAVED, New ‹thing›, Walkthrough; the mark goes here |
| Library | `/library` | `library` | a `CatalogPage` of **what the app ships** — system saves: the shipped presets, the modules (monitor: patches, modules; mirror: presets and the registry's patches, modules; fxr: every labs and randomiser preset, the morph and editor files, by chrome). **Home is the user's saves, Library is what ships** (user 2026-10-24: *"home now would only show USER saved patches, which are different from LIBRARY saves, which are more like system saves. what app ships with"*). **Every card is the same card** — title · date · size · cover with download · cog · trash, a module and a shipped preset like a save, no part card (*"EVERY CARD HAS THE SAME FIELDS AND ICONS … NON NEGOTIABLE"*); the verbs write the device's library, the app's data is untouched. A patch's cover is its rendered OUTPUT, never the tool's UI |
| Detail | `/library/module/<id>` · `/library/patch/<id>` | `library.children` | the thing a card opens, on `StudioDetail` (shell ≥0.78.0): the text `‹ Back`, the app masthead, prose, the preview, the actions as data — a patch card opens its page and Load lives there, it never loads on click (2026-10-24) |
| Create | `/create` | `create` | a Catalog-headed editor page: `header` over the editor — or, since 2026-10-23, `StudioCreate` as its children (`shell: false`): a catalog of parts beside the case on the studio canvas, monitor's page made once (CASE ⇄ PARTS, the parts' groups, an editable masthead, the zoom readout; the case model, Add row and Set HP, the parts and the workbench stay the consumer's — plan-2026-10-23 § 3.4) |
| Use | `/use` | `use` | the tool, full-bleed — no page padding, no wash (monitor: the rack) |
| — | `pages[].path` | `pages` | opt-in pages (monitor: Stage); a page with `sub` is a section — its rows enter under a Back row when they hold sections, expand in place when they are leaves — Chrome enters, Labs enters, Effects expands — the Chrome section proposed for fxr (2026-10-23) |
| Media | a sentinel | `media` | the DS modal library over the app's client, a pinned row at the foot (2026-10-23) |
| Sign in | a sentinel | `signIn` | the user row, a person while out and a cloud while in; the press is the app's (2026-10-23). With `signIn.user` (2026-10-28) it is an account: Email and Password in the DS dialog (`modal.form`), `onPress({ email, password })`; signed in, the avatar and the name, opening `onProfile()` |
| Dev | `/dev` | `dev` | `HubDev`, a dev server only — the `code` row after the app's own rows |
| Settings | `/settings` | `settings` | `HubSettings`, pinned at the rail's foot |

The **order** is the Studio's; each slot renames with `{ path, label, icon }` (monitor's Use is
"Rack" at `/rack`), and an omitted slot is not there. **The rail is `NavRail preset="app"`** (2026-10-24): the pill below `md`, collapsing into its × beside the More sheet; sections that enter and expand; the bar away on Use and on any page with `bar: false`; Media, Sign in, Settings at the foot — an app passes nothing about the rail, and `shell` overrides only on purpose. The parity checklist every Studio app is read against is `docs/operations/07-apps-tier/05-studio-parity.md` — a pass that diffs each hub against studio-hub directly (2026-10-24). **Mono by default** — fxr · mirror · monitor
are mono by ruling; `masthead="display"` overrides. Everything else is `AppHub`'s: keys, the bar,
the sheet. Notes, presentation and brand are create tools and can ride it too. brand-hub is a
site, not an app: it runs `SiteLayout` and the site rail since 2026-10-27, as every brand.<client> site does.

## Apps tier

Named by what they hold (ruling D2, 2026-09-29 — `-shell` apps were Shell + Hub, so the name lied):

| App | Layers | Job |
|---|---|---|
| `apps/shell` | the Shell alone + ten placeholder pages | the reference for the Shell — the rail and the phone bar's More overflow |
| `apps/hub` | Shell + Hub + a placeholder tool | the reference for the Hub — judged on its own |
| `apps/studio` | Shell + Hub + the Studio pages, placeholders | the reference for the Studio — the workstation shape |
| `apps/catalog` | the Catalog alone | the reference for the Catalog — the masthead option, the engine in its search |
| `apps/<tool>` | the tool alone | the tool judged without chrome |
| `apps/<tool>-hub` | Shell + Hub + the tool | the app as it ships — `media-hub`, `notes-hub`, `presentation-hub` |
| `apps/<engine>` | the engine, as a lab | `markdown`, `search` — input in, what the engine reads out |

The showcase's `/apps` groups them by layer; each has a home at `/app/<name>` with its spec (layers, packages, opt-ins, port, what a consumer repo sets).

## Tool frame

The page a tool gets (user ruling 2026-09-27, `plan-2026-09-27-app-frame-and-curves`). Every `apps/<tool>` app had invented its own; this is the one frame, read off what already existed.

| # | Rule | Source |
|---|---|---|
| 1 | **Frame** — the tool mounts in `<PageShell mode="fixed">`: `width="bleed"` (the app tier), padding `--kol-shell-page-pad` (= `--kol-pad-section-x`, 20 → 48px), 100vh, overflow hidden; the body flexes to fill (`flex-1 min-h-0`) | kol-shell `PageShell` · `.kol-shell-page--fixed` |
| 2 | **One geometry** — the page a tool gets in `apps/<tool>` is the page it gets inside `apps/<tool>-shell` | *the tool in the shell is the same tool* |
| 3 | **Masthead** — the tool's own title only, display voice (`kol-sans-display-03`: MEDIA, CURVES), its controls on the right on the same line. No eyebrow, no subtitle, no description | apps/media |
| 4 | **Viewport** — the tool fits the window; nothing sits below the fold. A secondary surface (a reference, a sheet) opens from the masthead instead of stacking down the page | apps/media · mirror `/expressions` |
| 5 | **Text** — no explanatory copy on the page. Usage goes in the `S` sheet (`ShortcutsOverlay`) or a tooltip. A label only where a control is ambiguous without one | user, repeated (editor findings #10 · #13) |
| 6 | **Rhythm** — `gap-10` between units, none inside them; one control height per row | apps/media's `gap-10` (2026-08-27) · `09-sizes` |

**A reference page is not a tool.** `apps/controls` shows specimens rather than doing work, so it keeps rules 1–3 and 5–6 but scrolls (`mode="scroll"`) — its content is a list, and a list below the fold is still reachable.

**Where each app stands** (2026-09-27):

| App | Frame |
|---|---|
| curves | the reference — `PageShell` fixed, CURVES + mode + reference shape |
| media | `PageShell` fixed (was the site tier's `--kol-container-max` + `breakpoint-padding`) |
| controls | `PageShell` scroll — a reference page; CONTROLS + the page switch |
| notes · presentation | the lists are title-only (NOTES · DECKS, through `media-fixture/wiring`); the note editor was already fixed; the deck editor is fixed · bleed (was `capped`) |
| brand | unchanged — a book, it scrolls; its Home is still open (below) |
| editor | unchanged — `DesignEditor` draws its own full-window chrome |

**In code**, rule 1 plus rule 3 is:

```jsx
<PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
  <PageHeader title="CURVES" actions={controls} />
  <div className="flex min-h-0 flex-1 …">{/* the tool */}</div>
</PageShell>
```

`apps/media-hub` runs on `AppHub`: the tool loads at `/`, and since 2026-09-29 the rail is Browse + Settings and nothing else — the Library Home, Notes, Decks and Brand left (notes, decks and brand are their own apps, and come back as opt-ins when they are ready to). Settings is the Hub's and the ONE settings place: it carries media's display rows (`mediaSettingsSections`, one settings object), the tool's gear hands over to it (`MediaLibrary onOpenSettings`), and the page has no drawer of its own. Smart folders are gone (user ruling). A tool's features ship in the DS and show in `apps/<tool>`; the `-hub` app adds only the Shell and the Hub around it.

**Notes and presentation open on a blank editor (2026-09-29).** *"you open it and start writing, then you decide what you want to do with it"* — `Notes open={NEW_NOTE}` and `Decks open={NEW_DECK}` are a document not saved yet; the first Save names and files it. The list is a page you go to, not the landing.

## The tools

An app that ships to kolkrabbi.io takes a subdomain that is one word, singular, naming the thing, the same word as its folder and hosting project (user ruling 2026-10-28; the law is kol-website `docs/operations/02-infrastructure/01-hosting-dns.md` § Subdomain law).


Known tools that ride this anatomy — the roster to be sorted next session:

- **media** — the media browser (`apps/media`)
- **brand** — on VOYAGER (`apps/voyager-fixture`): `apps/brand` is the HOME over the catalogue and `apps/brand-lab` (2026-10-27); `apps/brand-sections` (apps/brand until then) is the CATALOGUE of brand building blocks (kol-styleguide's blocks in kol-framework's `PageLayout`), and `apps/brand-hub` is a client's HOME — kol-styleguide's `Brand` (BRAND and ASSETS over one manifest) and `BrandGuide` (the guide outline, blank and filled) on kol-framework's `SiteLayout` and the site rail (2026-10-27; it was `AppHub`), with notes · decks · media as opt-in tools and the editor as an opt-in app. That home is what the DS offers the `brand.<domain>` sites (brand.kolkrabbi.io, brand.olina-productions.xyz)
- **presentation editor** — the deck editor (`apps/presentation`, `apps/presentation-hub`)
- **note editor** — notes (kol-olina's brand notes page; `DocumentEditor` is its file-shaped sibling; `apps/notes`, `apps/notes-hub`)
- **the fxr editor** — `@kolkrabbi/design-editor`
- **labs** and **generator** — alternate chromes on the editor
- the monitor rack, the mirror tool, and more

## Open

- monitor's tap-⌥-then-digit form is not in `navKeys` yet — monitor keeps it local until it is.
- Whether a tool can itself contain a Catalog (media's own file wall is catalog-shaped).
- The Home variant for a document-shaped tool (brand) — brand-hub opens on the book itself, with no Catalog Home (2026-09-29).
