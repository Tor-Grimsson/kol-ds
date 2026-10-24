# @kolkrabbi/kol-component

## 0.298.0 — 2026-10-24

- **The foldernote** (user 2026-10-24, site-hub: *"make a prop so you can choose if you want to make the category a clickable page. this is how its set in kol-branding"*). `NavRail variant="site"`: a category with `to` AND `pages` is a page of its own — its row opens the page and discloses the pages under it, the caret alone toggles the disclosure, lit by its route or any page beneath. No `to` = the disclosure button it was.
- **Group headers uppercase, one ink** (the another-creation reference: *"look at uppercase sections"* · *"just keep them same opacity"*): a `{ label, children }` group's label wears `uppercase` and the subtle ink and never lights; rows under a group sit 2px further in so the dot's edge lands on the label's first letter.
- **One tree in both states** — `RouteLeaf` is hoisted out of the component (declared inside, it was a new type every render and every row's DOM was rebuilt on each toggle, disclosure or route) and the Tooltip wraps a row expanded too, disabled; the collapsed chevron's box lives in the CSS, not a display utility.
- **`expandOnSelect` defaults to `false`** (user: *"dont auto expand rail when you click an icon when its collapsed"*, reversing the 2026-08-09 brand ruling): a press on the collapsed rail does its job and the rail stays collapsed.
- **The rail's x geometry is the chrome inset** — the row and header gutter, the group and page indents, the dot's left read `--kol-pad-chrome-x` (20 on a phone, 24 from 768) instead of a literal 1.5rem.
- **`useDragResize`: a press from collapsed lands on the rung** (user: *"clicking the rail when collapsed should go to that default"*) — the stylesheet's width for the viewport, never a remembered drag width; the override is cleared.
- **`PageControls`** — new molecule: a page's own controls in one sticky strip, `toggles` (Tag chips) · `views` (SegmentedToggle) · `count` · `jump` (TabsRow chips) · `legend` (dot + name), every page the same order. Not content filters.
- **`ContentCard variant="article"` no longer zooms its media on hover** (user: *"an annoying habit of using article contentcard with a stupid zoom on hover"*); `zoom` stays an opt-in prop, the hero rung is hero's own.

## 0.297.0 — 2026-10-24

- **The file rail shows Date and Size, and its pencil is the rows' size** (user 2026-10-24: *"why is date and size not included in file info?"* · *"why is edit 32px icon when others are 26px??"*). `AppItemMenuProvider`'s rail opens Details with the card's own Date and Size (the same strings the card prints); the header's pencil is `IconFrame sm` (26), the box the × beside it has.
- **Upload image — the cover is settable from the rail** (user: *"same with upload image?"*). A file that passes `onCover(src)` gets a Cover row in edit mode: Upload image opens the DS picker (`utilities/imageToDataUrl` — the longer side fitted to 640, webp) and hands the data URL to `onCover`; `ContentCard` / `ContentRow` carry `onCover` to the rail. HubHome's `onCover(file, src)` is the contract's name for it (kol-shell 0.78.0).
- **Insert on the one card** (`onInsert`): StudioCreate's parts are the same card as the Library's — every field and icon — so Insert moved off the plate: on a card it is the cover's other corner in the download's box (a part carries no mark); on a row it sits before the plate. `ContentCard` / `ContentRow` carry `onInsert` to the `app` item.

## 0.296.0 — 2026-10-23

- **Typed settings rows** (user 2026-10-24, on FXR's rail drawing its own sunken dropdown beside the reference's: *"we are literally avoiding this custom per repo shit"*). `SettingsSections` draws a row's CONTROL from data — `{ type: 'choice', options, value, onChange }` is a `SettingsChoice` filling the value column, `{ type: 'switch', on, onChange, disabled?, disabledHint? }` a `SettingsSwitch` — in the surface's tone, never the consumer's; `render` stays for a control the DS has no word for (the Hub's rail refuses it). **`SettingsFooter resetDisabled`**: the reset stays in its place, dimmed and inert, so every rail has the one footer whether or not the app has preferences yet. **The rail's expanded rows are a group** (*"should the expanded list not be a little tighter? … I dont see that its a contained group"*): `NavRail` draws them inside `.kol-rail-group`, the rows on the sm rung (26) with the same 20 glyph and type, on a 4px gap, against the top level's 32 rows on 8.

- **The hubs against the template** (user 2026-10-24, his review of FXR, Mirror and Monitor beside studio-hub). **`SettingsSections` draws a string `value` itself** — `kol-mono-12 text-body`, on the baseline — so a consumer handing rows as data never picks a text class (*"YOU ARE USING A HELPER text for paragraphs … THIS SHOULDNT BE POSSIBLE if you were using a preset"*); a section takes a **`note`** (a sentence or two under the eyebrow, mono-12 in the meta ink, before the rows), and `rows` may be empty. **The file rail's read mode right-aligns every value** — the name, the tag chips, the note — on the value column's edge (*"why is tags in the middle"*); edit mode fills as before. **The `app` card's mark wears the download's box** — `.kol-media-control`, 32 square, the 20 glyph at its rest scale, in the cover's other corner (*"why would the indicator of chrome in the cards not be the same size as the other icon frame"*; it was an IconFrame sm, 26). **The `app` card's date · size never break** (*"the layout of the card CAN NOT CHANGE on resolution available, the field can not line break"*): the group is one line at every width — the `app` grid's floor (kol-shell 0.77.0) is what makes it fit; the `file` card keeps 0.295.0's wrap.

- **The rail has presets** (user 2026-10-24: *"the rail, do you make a preset for this? like catalog has preset?"*): `NavRail preset` — `app` the studio rail (sections enter and expand, the pill on the phone, Media · Sign in · Settings at the foot), `site` the brand rail (`variant="site"` still reads as it), `workshop` the workshop rail (kol-workshop's ShellSidebar, registered through `registerRailPreset`); `RAIL_PRESETS` is the table AppShell reads the phone shape from. **One rule for sections** (*"EFFECTS in LABS is supposed to COLLAPSE, thats the last step"*): a section whose rows hold sections ENTERS and EXITS on Back; a section whose rows are leaves EXPANDS and COLLAPSES in place — Chrome enters, Labs enters, Effects expands. **The words** are those four: `sections="expand"` replaces `"fold"` (still read), and fold leaves the comments and the docs; TabsRow's phone bar `collapsed` / `onExpand` replace `fold` / `onFoldClose`. **A file's `mark`** on the `app` card — `{ icon, label, of? }` — draws it in the cover's other corner (FXR's chrome: Editor, Labs, Randomiser, Morph) and a row in the rail's details.

- **His phone review, round 4 (2026-10-23).** `TabsRow` `shape="pill"`: the phone bar rounded, centred, floated `TABBAR_PILL_INSET` (16px) off the edge, 28px glyphs, the active tab a filled pill (iOS Files beside the full-width bar); **`collapsed`** — while a sheet is open the bar collapses into one round × at its right end (the pill shrinks to a 56 circle where More was, the bar shows the × in More's slot), `onExpand` expands it; `tabbarPillWidth(count)` for whatever aligns to the pill. **`SectionText` / `PageHeader` `actionsPlacement="head"`** — the actions on the title's row whatever the body, centred on it (the Hub's masthead button). **The file rail opens in read mode** — name, tag chips, note and details as text, one row each, no section label over a lone row of the same name — and **the pencil on its header** (`SettingsPanel headerActions`, an `IconFrame nav` as Create's rename) opens edit mode; **a file carries a `note`** (`onNote(text)`, a `Textarea` in the rail; `useAppItem` passes `note` / `onNote` through). **`CanvasStudio fit`**: on open the zoom puts the content's height in the surface and ⌘0 returns to that fit (`useCanvasViewport rest`). **The picker reads as the media app**: its title in the display voice (a modal card, outside the shell's masthead) and the listing opening at the title root with the buckets as rows (`MediaLibraryBrowse startAtRoot`). **On a phone the picker has no foot:** a tap selects, the row's menu leads with **Insert** (`MediaLibraryBrowse onInsert` / `canInsert`), and the × on the title row (`onHeaderClose`) is the way out; the desktop card keeps Cancel and Use. The phone card's body scrolls — the stack hugs its rows and expects the page to scroll, and inside the clipping card nothing did, so rows past the fold were unreachable.

- **The phone tab bar is icons alone** (user 2026-10-23), 24px, the label kept as each tab's accessible name. **`MediaLibrary`'s browse surfaces default their tiles and counts:** with no `thumbnailFor` an image file shows itself (the client's URL, lazy), with no `folderMeta` a folder counts the files under it in the loaded listing — the picker on a phone reads as kol-website's media app. A consumer's own still wins.

- **`NavRail`'s sub rows are full rows** (user 2026-10-23, against fxr's labs rail of 2026-10-22). Folded, a section's rows draw at L1 size and ink (20px glyph, `kol-helper-12`, oq-96), each level shifted 38px so the child's glyph starts on the parent's label column; a folded row may fold again. Under `sections="enter"` every section enters at any depth and the entered list is full rows. The 12px-glyph, oq-64, indented L2 row is retired.

- **The settings rail's close and footer icons step their ink** — oq-80 at rest, oq-96 on hover, no wash (`.kol-ink-step`, kol-theme 0.184.0; user 2026-10-23).

- **`CloseButton` takes `hover` and `frame`** (user 2026-10-23). `hover={false}` keeps the box and padding and drops the wash; `frame={false}` is the glyph alone, no box or padding. Both default on, nothing changes; `states` is kept as `hover`'s alias. The settings rail's × (and so the file rail's) passes `hover={false}`.

- **The settings rail's footer controls are all bare.** Reset (and the file rail's download, duplicate, delete) wore a filled `IconFrame` beside the bare theme toggle every app passes; both are `nav` now (bare, full ink, as the toggle) — one look, never mixed (user 2026-10-23).

- **Fixed:** `SettingsChoice` hands its `ariaLabel` to the Dropdown (it passed `aria-label`, which Dropdown never read). The file rail's Delete confirm names the file as renamed inside the rail.

- **The canvas family — one engine, two surfaces** (plan-2026-10-23, user ruling). **New: `CanvasStudio`**, the infinite dotted surface kol-monitor's rack and kol-mirror's desk each carried a copy of: the dot grid (1px `--kol-fg-12` on a 36px cell, scaled by the zoom and offset by the pan), Space+drag, middle-drag and ⌘-drag pan, scroll pans, ⌘ wheel and pinch zoom at the pointer, ⌘0, ⌘= and ⌘− , `G` grid, `L` lock, `F` fps; two fingers pan and pinch, one finger pans empty surface. It is the background only — `children` ride the pan-zoom layer, `overlay` sits in screen space; `gridRef` paints the grid on a bigger box, `view` / `onViewChange` make the view the consumer's to persist. **New: `useCanvasViewport`** (hooks/canvasViewport.js) and **`CANVAS_KEYS`**, the one key table — the editor's `PanZoomViewport` runs on the hook now, unchanged for the editor (its real-terms clamps, rulers, guides and `kol:zoom-*` events stay). **Ruled: ⌘ is the canvas's modifier; ⌥ is the Hub's page keys** — no ⌥ on any canvas.
- **`Canvas` is `CanvasEditor`** — same component, same props; `Canvas`, `PanZoomViewport` and `PanViewport` are aliases on the retirement ledger (one default under two names; the two viewports deprecated in place — a consumer composing its own stage uses `CanvasEditor panEnabled`). `useFps` is re-exported from the hook under its old name.

- **The `app` card and row show title, date and size — nothing else** (user ruling 2026-10-23, reversing 0.292.0's `meta` line: *"that '6 layers 4:5' is ILLEGAL and layout BREAKING … I did not design for it"*). A card with the line and one without put date and size on different baselines. `app` aliases to `file` in `ContentText`; a `meta` passed to an app card is not drawn. A file's counts and dimensions are `details`, shown in the rail below.
- **New: the file's info rail** (his ruling 2026-10-23: *"a settings/info … siderail … edit tags there, along with much more metadata"*). The cog on an app card or row opens a `Rail` on the right (no scrim) holding the name (editable, through `verbs.rename`), the tags as chips (`tags`, `onTags(tags)`), a details list (`details` `[{ label, value }]`) and the verbs as buttons — Download, Duplicate, Delete (confirms). `AppItemMenuProvider` holds it beside the one menu; right-click keeps the menu. `toCard` may return `tags`, `details`, `onTags`; none reach the card's text.

- **The S sheet opens expanded** (user 2026-10-23: *"you should see the shortcuts expanded, not choose navigate or help, so expand all should be collapse all, with expanded the default"*). `CommandOverlay mode="shortcuts"` opens every section; the footer reads Collapse all and folds them in one press. Until now only the page's own sections opened.
- **The file rail is the settings drawer** (studio-hub review 2, § 2.1 — user: *"why is there border on the siderail? … rethink this entire siderail based on settings rail"*). The cog on an `app` card or row opens `SettingsPanel variant="rail" title="File"` (380, the scrim, no edge, the header row with its ×) over `SettingsSections divided` — Name (an `Input` through `verbs.rename`), Tags (chips with ×, the add-a-tag `Input`, through `onTags`), Details (one row per `{ label, value }`) — with download, duplicate and delete as icon buttons in a `SettingsFooter` foot; Delete confirms. It was a bare `Rail` with no scrim (hence the border) and its own labels and buttons. `AppItemMenuProvider` moves to `organisms/` (a molecule never imports an organism); the export name is unchanged.
- **`NavRail sections="enter"` recurses** (studio-hub review 2, § 4.1 — user: *"labs had it correct yesterday size and text, just didnt have the enter exit collapse expand correct"*). `entered` is a path stack: inside an entered level a row with `sub` whose rows carry `sub` enters (chevron-right, Back climbs one level, the mark still goes home); a row whose rows carry none folds in place as the L2 rows (RailTwoLevelSections, untouched). It entered one level only, so a second level drew as L2.
- **A `LabeledControl inline` label never wraps** (studio-hub review 2, § 6.2 — *"setting page is using helper for sentences that line break, that is illegal"*): the label span is `whitespace-nowrap truncate`, so a long label ends in an ellipsis. Every `SettingsRow` label inherits it — the helper law (01-foundations/03-typography.md:29) by construction.
- **The phone bar wears the rail's row** (studio-hub review 2, § 7.1). `TabsRow look="stacked" placement="phone"` labels are `kol-helper-12 uppercase`, oq-64 at rest and oq-96 on the route, with the 20px glyph — `RAIL_ROW` in `hooks/railRow.js`, the one constant `NavRail` reads too, so neither retypes it. An inline stacked row is unchanged.
- **No `kol-helper-*` on a sentence** (studio-hub review 2, § 7.5 — the new `validate:helper-text` gate). `CurveEditor`'s fork note and `MediaLibrary`'s empty line wear `kol-mono-*`.

## 0.295.1 — 2026-10-23

- The `app` card's no-preview placeholder inks its icon `text-oq-24`, not `text-fg-24` — icons take the opaque ladder (`validate:icon-ink`).

## 0.295.0 — 2026-10-23

- **A file's date and size never break inside a value** (AppCardDateSizeWrap, kol-mirror · kol-fxr). On the `file` and `app` card and row, `date` and `size` are `whitespace-nowrap`, and their group wraps: when the pair does not fit beside the plate, the size drops to the next line whole. At ~170px columns `2026-10-23` and `1.7 KB` read whole — they had broken as `2026-10-` / `23` and `1.7` / `KB`.

## 0.294.0 — 2026-10-23

- **The `app` card's download no longer opens the card** (AppCardDownloadClickBubbles, kol-monitor). The cover's download control stops its click, as the plate's controls do; a card that opens on click (monitor's Home → the rack) stays put. The row has no download control.

## 0.293.0 — 2026-10-23

- **A clickable `app` card or row takes no hover fill** (AppCardNoHoverFill, kol-fxr). Its default `secondary` tone had brought the tone's hover step; `app` now keeps `file`'s ruling — no background change on hover, cursor pointer stays. The rest ground is unchanged; consumers pass nothing.

## 0.292.0 — 2026-10-23

- **The `app` card and row draw `meta`** (AppCardMeta, kol-monitor). A line under the title — a module's `6HP 3U — Control`, a patch's `12 modules, 9 connections` — in `kol-mono-12 text-meta`, truncated; `date` · `size` stay on the line below. Without `meta` the card is unchanged. `file` is untouched.

## 0.291.0 — 2026-10-23

- **`variant="app"` on `ContentCard` and `ContentRow`** (CatalogAppVariant, kol-fxr). kol-fxr's approved saved-file card as a variant: the `file` card and row with the parts slotted from raw writes — `verbs` (`{ rename?, duplicate?, remove? }`), `download`, `menuItems`. Download on the cover, a cog over a trash stacked in the plate, Rename · Duplicate · Delete on the cog and on right-click; Rename prompts, Delete confirms (`useModal`). A verb not passed is not drawn. `date` takes ms (→ ISO day), `size` bytes (→ `formatSize`), `media` a src (none → the image placeholder); `tone` defaults `secondary`. `file` is untouched.
- **New: `AppItemMenuProvider`** — the one menu a page's `app` items open. kol-shell's `CatalogPage` mounts it; without one an `app` card draws download and trash only.

## 0.290.0 — 2026-10-22

- **A long title truncates left of the actions** (FileCardTitleClearsActions, kol-fxr). `ContentCard`'s plate measures its absolute actions and reserves their width (+ one pad) on the text side, so the title's ellipsis ends before the cog instead of under it. `ContentRow`'s text section takes `min-w-0`, so its title shrinks beside the actions column instead of pushing it. Showcase: a long-title file card, and the row's `long title` state.

## 0.289.0 — 2026-10-22

- **New: `MediaGalleryModes`** (kol-branding). One media set the viewer switches between carousel (`GalleryCarousel`) · grid · waterfall (`MediaTileGallery`) on a `SegmentedToggle`; any item opens the one `MediaViewer`, paged across the set. `modes` · `mode` / `defaultMode` / `onModeChange` · `cols` · `title`.
- **`MediaTileGallery layout="waterfall"`** — CSS columns, each item at its own aspect, no crop; `cols` from sm up, two below. **`onOpen`** on it and on `GalleryCarousel`: a host that owns the viewer takes the click and the gallery draws none of its own.
- **New: `TextFold`** (kol-branding). Long text clamps to `lines` (2 · 3 · 4 · 6) below md with a More / Less ghost Button, shown only when the text is cut; md and up reads whole. `moreLabel` · `lessLabel` as authored.
- **`ColorRamp` at phone width** (ColorRampNarrowCaptions, kol-branding). Below sm a long ramp wraps to five a row, and captions truncate inside their column — a 10-step ramp at 390 no longer scrolls the page sideways.

## 0.288.0 — 2026-10-22

- **Menu rows sit at 8px side padding** (MenuRowSidePadding, kol-fxr). `MenuDropdownItem` rows at `sm` · `md` · `lg` were `px-3` (12); now `px-2` — every `MenuItem` dropdown and `ContextMenu`.
- **`ContentCard` and `ContentRow` take `tone`** (ContentCardRowTone, kol-fxr). The rest ground and its hover step come from one `kol-tone-*` bundle, so they move together; `bg` still wins the rest fill. Unset → the variant's own ground. Showcase: two toned file cards, and the row's `tone` state.

## 0.287.0 — 2026-10-22

- **The file row is the file card, sideways.** `ContentRow variant="file"` is a contained tile: the card's fg-02 ground, rounded and clipped, a 72 thumb flush at the row's full height (no radius of its own), and one padded text section (12) holding the copy and the actions. The actions column spans the section's height; title on the top pad, date · size on the bottom one. Was a bare ruled line with a 48 thumb and a divider.
- **The file card has no hover fill.** `HOVER.file` was oq-04.

## 0.286.0 — 2026-10-22

- **The file card's title is heading-05 (20px)**, the row's — was heading-04 (24px).

## 0.285.0 — 2026-10-22

- **`SectionText` carries the header levels** (user: *"rename PageHeader to something that describes section text elements and ship together"*). `level` page · app · section · content fills the role defaults; explicit props still win. `media` renders above the eyebrow with a level. `SECTION_TEXT_LEVELS` exported.
- **New level `content`** (DevSectionHeader, kol-fxr): a section of a page's content — `kol-eyebrow` · h3 heading-04 · body-01 fg-64 at 64ch, 16px to its body.
- **Deprecated: `PageHeader` · `PAGE_HEADER_ROLES`** → `SectionText level` · `SECTION_TEXT_LEVELS`. Same props, same render; on the retirement ledger.
- **A float opened inside a float stacks above it.** `PopoverPanel` sets `--kol-float-depth` for its children, so a Dropdown inside a popover panel no longer opens under it (needs kol-theme ≥0.180.0; older themes render as before).

## 0.284.0 — 2026-10-22

- **A catalog card with no cover keeps its text at the foot.** `ContentCard` `variant="catalog"` with `media={false}` dropped the media box and the plate rose to the top of an empty A4 frame; the plate now sits on the frame's bottom edge. Other variants unchanged.

## 0.283.0 — 2026-10-22

- **One nav rail: `NavRail` lives here** (the one nav rail, user ruling). Moved from kol-shell with `Logomark` and `RailSlotProvider` / `useRailSlot`; kol-shell re-exports all three. `variant` app (default, the flat 48px rail) · site (the grouped site sidebar that was kol-framework's `SideNav`, carried class-for-class, router-free — `currentPath` + `onNavigate(event, to)`, `hrefFor`, `themeToggle` as a render function).
- **Folder notes.** A section item with `to` opens that page from its icon and label; the chevron alone folds or enters. Without `to`, unchanged.
- **Label-only sub rows align** with their section's label instead of sitting under the icon column.
- **The rail's open width** reads `--kol-shell-rail-open` (kol-theme ≥0.179.0), not kol-framework's `--kol-sidenav-w`.
- **The media picker has no X and no border** (2026-10-21): Escape, the backdrop and Cancel close it; `pt-5`.

## 0.282.0 — 2026-10-20

- **An expanding `SearchInput` keeps its query when you click away** (the icon catalog lost its filter on every tile click — user: "does not select it, but clears it from selection which is so annoying"). A click outside closes the field only while it is empty; with a query in it the results below are what you are clicking. Escape and the clear still close it.

## 0.281.0 — 2026-10-19

- **`prompt` masks a password** (ModalPromptPassword, kol-atlas). `prompt(title, '', { type: 'password' })` renders the field `type="password"` with `autoComplete="current-password"`; `placeholder` rides in the same options. The native no-provider fallback cannot mask.
- **OK is the bright button.** `tone="inverted"` — since tone-is-the-ground-axis `primary` is the dark ground, so OK drew like Cancel and nothing showed what Enter does. Prompt, confirm and alert.
- **The dialog owns the keyboard.** Opens focused (prompt → field, confirm/alert → OK), Tab and Shift+Tab cycle inside it, Enter on a focused button presses that button. `role="dialog"` / `"alertdialog"`, `aria-modal`, labelled by its title.

## 0.280.0 — 2026-10-19

- **`ActionButton`'s tooltip anchors to the control** (ActionButtonTooltipAnchor, kol-atlas). `Tooltip asChild`, so a positioned control — CodeBlock's copy button (`kol-frame-control`) — no longer shows its tip at the empty wrapper span ~950px away.
- **Quick Look fits SVGs to the window, and a click fills the width** (QuickLookFit, kol-atlas). `MediaInspector`'s image body keeps the 640 box only for an SVG under 640 wide (or with no size); a larger one fits like a raster. Clicking the image toggles fit ↔ fill width (the body scrolls); paging opens the next file in fit. Needs kol-theme ≥0.178.0.

## 0.279.0 — 2026-10-18

- **`PageHeader level="app"` is page's display at 46 / 60** (PageHeaderAppLevelDisplay, final — the user's numbers). Title `kol-sans-display-01 text-[46px] md:text-[60px]` instead of 0.278.0's display-02 — no new style; lede `.kol-header-lede-app` unchanged. `PAGE_HEADER_ROLES.app` follows. Needs kol-theme ≥0.177.0 and the consumer's `@source` on kol-component.

## 0.278.0 — 2026-10-18

- **`PageHeader level="app"` is display, between page and section** (PageHeaderAppLevelDisplay, kol-monitor — user: *"did I ask for mono?!?! OR DID I SAY MAKE THE TEXT SMALLER AS IN THE HEIGHT, SO THAT IT IS BETWEEN SECTION AND PAGE"*). 0.277.0 made it mono; now `kol-sans-display-02` over `.kol-header-lede-app` (19/26 Light), `PAGE_HEADER_ROLES.app` to match. Needs kol-theme ≥0.177.0.

## 0.277.0 — 2026-10-18

- **`PageHeader level="app"`** (PageHeaderAppLevel, kol-monitor — user: *"that display is fine for Section Hero like in brand but not for EVERYTHING ELSE that uses the mono"*). A third level: the retired mono masthead as a level — h1 `kol-mono-heading-03` over a `kol-mono-14` lede at oq-64. `page` (display-01) stays the hero; kol-shell 0.72.0's app pages default to `app`. **New export `PAGE_HEADER_ROLES`** — `{ page | app | section: { title, lede } }`, for a page that draws its own title (monitor's Create inputs).

## 0.276.0 — 2026-10-18

- **`PageHeader` is the one header** (Round 11 made the default — user: *"did we not update any of the apps that use it?"*). 0.267.0 shipped the approved look behind `register="site"` + `size="xl"` and kept the old defaults, so no app moved. Now `level` page | section is the only choice: page = h1 display-01 over `.kol-header-lede`, section = h2 display-03 over `.kol-header-lede-section`. `size` · `voice` · `register` · `masthead` (and an `AppShell masthead`) are accepted and ignored, so every caller — CatalogPage, the Hub's Home and Settings, AppStudio, monitor's own pages — renders it on the bump with no edit. `titleClass` stays the seam. Needs kol-theme ≥0.175.0.
- **`Divider variant="vertical" height="fill"`** (DividerHeightFill, kol-monitor). The rule stretches to the row (`self-stretch`, no fixed height) — eurorack panels' full-height group rules; `className` padding insets it. Numeric `height` (default 16, centred) unchanged.

## 0.267.0 — 2026-10-18

- **One header, two levels** (Round 11, approved 2026-10-18). `PageHeader` takes `level="page" | "section"` (a section header is an h2 one step down), `media` (a logo above the eyebrow, only when passed), `description` (the subtitle's other name) and `size="xl"` (display-01). In `register="site"` the description is `.kol-header-lede` (page) or `.kol-header-lede-section` — Light, opened tracking, 72% ink; it was body-01 Regular at 64%, which read heavy, small and tight. The app register is unchanged. Needs kol-theme ≥0.175.0.

## 0.266.0 — 2026-10-17

- **New: `CommandOverlay`** (CommandOverlayModes, kol-monitor). The ⌘K overlay with `mode` — `search` (default) · `go` · `add` · `shortcuts`. In `shortcuts` it draws the keymap: every section at once, this page's first, the rest muted under Elsewhere; typing filters, Enter runs. **Arrows:** ↑↓ rows, → or Enter opens a category, ← goes back — ← / → only while the field is empty. `ShellSearchOverlay` is now its alias (ledger).
- **New: `Rail`** (RailOverlay, kol-monitor — user ruling: *"rail and overlay"*). A surface docked to any edge — left · right · **top** · bottom; `mode="over"` (scrim, focus trap, Escape, as before) or **`mode="push"`** (in the layout, collapses to nothing); **`resizable`** from the edge facing the page (`minSize` · `maxSize` · `onResize`). `ShellDrawer` is its alias (ledger). SettingsPanel and RecordManager ride it.
- **`useDragResize` on any edge** — `side` `top` · `bottom` resize on Y into `--<token>-h`.
- **`TabsRow look`** (TabsStackedLayout, kol-monitor — user: *"wouldnt it just be mobile variant? it seems like a normal tab system"*). One tab component: `underline` (default) · `chip` · `text` · `stacked` (icon over label, usable inline anywhere), and `placement="phone"` for the bottom bar below md. `TabChips` and `MobileTabBar` are aliases (ledger); their DOM is unchanged. `TABBAR_H` now exports from TabsRow too.

## 0.265.0 — 2026-10-17

- **New: `IconPlate` + `KeylineGuide`** (CompareGridDevTab, kol-monitor). A glyph's specimen plate where the box IS the size: ground (light / dark, a specimen ground the theme never touches), the 24-unit keyline guide and the glyph in one square, so a 20 plate is 20px and the guide is the glyph's own grid. `size="fill"` takes the parent's width. The icon gallery, the open-questions rounds and `CompareGrid` all draw on it.
- **New: `CompareGrid`** (CompareGridDevTab, kol-monitor — user: *"why are we inventing the wheel for this every time … the way you diff local vs DS is very confusing, its ill labeled, hard to read"*). Two versions of many things side by side: A beside B on `IconPlate`s, each side named by the consumer, the 16px real size beside each name, the item's name and a state chip under the pair. The toolbar is controls: size 24 · 48 · 96 · 128, ground, guide, a filter by the consumer's own states with counts. A missing side is an empty plate carrying its `candidate`. A side is a node or `({ size, ground, guide }) => node`.
- **New: `ShellSearchOverlay onBack` / `backLabel`** (CommandOverlayModes, kol-monitor). A drill-in's way back: the field row leads with a back arrow (the DS tooltip names where it goes), and Backspace on an empty field calls it — instead of an "← All" row that scrolls away. Focus stays in the field.
- **New: page-aware shortcuts** (CommandOverlayModes — user: *"im in dev, how can I cable lock here?"*). A shortcut section takes `routes: ['/rack']`; `ShortcutsOverlay currentPath` shows the sections that work here first and the rest muted under ELSEWHERE. `shortcutInScope(section, path)` is the same test for binding the keys, so the sheet and the bindings come from one source.

## 0.264.0 — 2026-10-17

- **New: `ColorPickerPopover`** (ColorPickerPopover, kol-monitor — the estate's only click-a-colour-in picker was monitor's local react-colorful atom). A swatch (`size` xs 16 · sm 24) that opens a popover: saturation square, hue strip, opacity strip, hex. Every drag emits uppercase hex, 8 digits only under 100% opacity; the hex field emits at 6 or 8 digits. Right-aligned under the swatch via `usePopover`, flips up near the bottom; Esc and an outside press close it, Enter opens it from the keyboard; ⌥-click resets to `defaultValue`. None (`transparent` / empty) is the slashed swatch in `--ui-error`. A token or `currentColor` paints live and is resolved once on open — no theme observer. Built on `SpectrumControls`, no new dependency. An organism: it composes one.
- **New: `AlphaStrip`** in the `SpectrumControls` family — HueStrip's twin for opacity, the colour ramped over a checker.
- **New: `hexToHsva` · `hsvaToHex`** in the colour math — the picker's model; round-trips 6- and 8-digit hex.

## 0.263.0 — 2026-10-16

- **Fixed: the media library header row centres on the wordmark** (MediaPickerHeaderCentred, kol-monitor — supersedes 0.262.0's × fix). `LibraryHeader` was `items-baseline`, which set the controls' 12px text on the display title's baseline, so the whole control row — bucket dropdown, lock, trash, gear, × — hung below the wordmark. Now `items-center`, and the × drops its `self-end`. Measured at 1440 in the picker: wordmark cap middle 139.1, gear and × 140.5, dropdown 141. The full-page library header moves the same way.

## 0.262.0 — 2026-10-16

- **New: `ShellSearchOverlay` rows take `disabled`** (ShellSearchDisabledRow, kol-monitor — ⌘K Add module on a full rack). A disabled row is drawn at the disabled opacity with a not-allowed cursor, ↑↓ step over it, hover does not activate it, and click or Enter never reach `onSelect`. The top-row highlight starts on the first enabled row. `disabledHint` replaces the row's `hint` with the reason. Rows without it are unchanged.
- **New: `OptionRow disabled`** — the row state the overlay uses: disabled opacity, no hover fill, not-allowed. The caller keeps it out of its keyboard order.
- **Fixed: `MenuItem size="xs"` trigger wears the rung's type** (MenuItemXsTriggerType, kol-monitor). The trigger took its height from `size` but hardcoded `kol-helper-12 px-3`, so xs set 12px tracked type in a 22px box. `TRIGGER_BY_SIZE`: xs → `kol-mono-8 px-2`, the face its rows and `Button size="xs"` already wear; sm · md · lg unchanged.
- **New: `Tooltip disabled`** (HardwareNativeTitle, kol-monitor) — stays mounted, never opens. For a trigger whose tooltip must go quiet without its element remounting under the pointer (a patch jack mid-drag).
- **Fixed: the media picker's × sits on the control row** (MediaPickerCloseOnControlRow, kol-monitor — user: *"CLOSE X BUTTON IS IN THE WRONG PLACE"*). `LibraryHeader`'s row is baseline-aligned, so `self-center` centred the × on the display wordmark, 10px above the gear. `self-end`: centre 151.5 against the gear's 151 at 1440. The `modal` variant's × is the overlay's and did not move.

## 0.261.0 — 2026-10-15

- **Fixed: the media picker's × is the card's, and its title has ink** (media-picker-close-and-title, kol-mirror — user: *"you ever seen a close out button before??"*). The × left the control cluster: it sits alone at the far end of the title's row, the Display Settings drawer's shape (`MediaLibraryBrowse onHeaderClose`). The header title takes `text-fg-96` — portalled into a body with no colour it inherited black on the dark card.
- **New: `IconToggle`** (IconToggle, kol-mirror — user: *"why is everything in brackets icon AND TEXT? … we want to minimise noise"*). An icon-only toggle: the icon is the control, the state is its ink (`oq-32` off · `oq-64` off-hover · `oq-96` on · `oq-12` disabled), the name is the DS tooltip. `tone="danger"` puts the on ink on `--ui-error`; `iconOn` swaps the glyph with the state; `label` is required. Square on the size ladder, xs 22 · sm 26 · md 32 (the ticket's 24 is not a rung). The interactive twin of `IconFrame`, on its own `.kol-icon-toggle` classes. Needs kol-theme ≥0.174.0.
- **Fixed: `MediaLibrary variant="modal"` grid tiles are `picker`'s** (MediaLibraryModalTilesBroken, kol-mirror). The grid wore `ContentCard` default — a heading-04 filename and an actions column on top of the size. It now renders `MediaTile`, preview over name, as `picker`'s grid does: click opens the lightbox (Use · Copy URL), double-click or Enter uses the file. List view unchanged.

## 0.260.0 — 2026-10-14

- **Fixed: the `structure/diagram-*` clearspace graphics are Kolkrabbi's** (ClearspaceGraphicsAreAnotherCreations, kol-website — user: "Logomark, wordmark and both lockups render Another Creation"). The twelve `diagram-{grid,x,logo}-{logomark,wordmark,lockup-hori,lockup-vert}` layers carried a client's marks and its signature glyph. Now: `logo` is the mark from `@kolkrabbi/kol-brand`, verbatim; `x` is the clearspace unit — the logomark, ghosted, filling each corner square — per kol-brand's rule that clearspace equals the logomark height on all sides; `grid` is the frame, the margin lines and the four unit squares. All three layers of a variant share one viewBox, and the grid strokes are `currentColor`, not white. Names unchanged.

## 0.259.0 — 2026-10-14

- **New: `PanZoomViewport` touch** (ViewportTouchGestures, kol-fxr — user: "in mobile I still cant pinch zoom move with 2 fingers. and I think one tap should start stop transport play/pause"). Two fingers pinch-zoom at their midpoint and the midpoint's travel pans, in one gesture, inside the real clamps; while they are down the transform layer takes no pointer events, as with Space held. One finger stays the consumer's, except a tap (up within 350 ms and 12 px, no second finger) fires `onSpaceTap`. The container carries `touch-action: none`. Mouse, trackpad and keys are unchanged.

## 0.258.0 — 2026-10-13

- **New: `PanZoomViewport` view commands** (CanvasViewCommands, kol-fxr — user: "wait command 1 2 3 4 are not bound?"). Two window events beside `kol:zoom-at`: **`kol:zoom-fit`** `{ to }` — `'frame'` (default) is ⌘0's opening view, `'width'` fills the viewport with the frame's width centred vertically, `{ x, y, w, h }` in frame px fills it with that rect, 24px around it, centred; **`kol:zoom-to`** `{ scale }` — a real scale (1 = 100%) about the viewport centre.
- **Changed: zoom clamps are in real terms** — 2%–3200% of one screen px per frame px, was 0.1–8× of the fitted frame (a 1080 frame fitted at ~0.58 capped at ~464% real, so 800% was out of reach). ⌘0 / ⌘= / ⌘- and the wheel are otherwise unchanged.

## 0.257.0 — 2026-10-13

- **Fixed: `MediaLibrary` and the media pages build URLs on `storageKey`** (MediaLibraryUrlOnStorageKey, kol-website). The API lists `key` (the path) and `storageKey` (where the bytes live), and a rename or move changes only the path, so `mediaUrl(path)` 404'd for a renamed file or a new upload (`f/<id>.<ext>`). Both `mediaUrl` wrappers (the provider's and the pages') now resolve a path to its row's `storageKey`, which covers every site: thumbs, previews, posters, Copy URL, picks. The picker's Use builds on the row. `downloadUrl` stays on the path. Without `storageKey` nothing changes.

## 0.256.0 — 2026-10-13

Three asks from kol-fxr's editor head, walked against Affinity — all additive; every default renders as before except the ruler.

- **New: `MenuItem offset`** (MenuItemOffset) — the panel's gap under the trigger, default 4. Negative values overlap, so a trigger inside a taller bar can land the panel's top border on the bar's line.
- **New: `ToolPalette orientation="vertical"`** (ToolPaletteVertical) — a one-button-wide strip: `flex-col`, scrolls on y, hairline dividers across the strip, and every fold opens `right-start`. **New `SplitToolButton placement`** (default `bottom-start`) carries it.
- **Changed: `CanvasRuler` is graduated** (CanvasRulerGraduated) — no band: the bar is transparent with its inner-edge hairline, three tick ranks (major at `niceStep`, medium at half, minor at a tenth; 18 · 9 · 4px, `fg-48` / `fg-24`), sans 10 labels beside the major tick, `px` in the corner square, and a 1px `fg-64` line on each ruler that follows the container's pointer. Guides still drag off both rulers; `niceStep` / `ticksFor` keep their exports.

## 0.255.0 — 2026-10-13

- **Fixed: `SelectionOverlay`'s size label clears the rotate handle** (SelectionOverlayLabelClearsRotateHandle, kol-fxr). 0.253.0 hung the upright label under the rotated bounds, which is where the rotate handle lands when the box points down: at 180° the handle sat on the label's `×`. When the handle's centre falls in the label's column below the box, the label hangs 6px under the handle instead. Other angles are unchanged.

## 0.254.0 — 2026-10-13

- **Fixed: `BackgroundVideo` starts HLS at the rendition the player can show** (BackgroundVideoStartsAtLowestRendition, kol-website — user: "why is this video so low res? … its super long lag till you get good res?"). A bare `new Hls()` started at the manifest's first rendition (360p on every bucket master). The new exported `HLS_DEFAULTS` are `startLevel: -1`, `testBandwidth: false`, `abrEwmaDefaultEstimate: 8_000_000` and `capLevelToPlayerSize: true`. Measured on the B2 hero master: a 1280×720 element now plays 720p from the first fragment (it was 360p first), and a 446×250 tile stays at 360p. **New `hlsConfig`** is spread over the defaults; it is read when `src` attaches. `SectionHero`'s media carousel and `TiltBento` get the fix through `BackgroundVideo`.

## 0.253.0 — 2026-10-13

Two asks from kol-fxr's editor toolbar and canvas.

- **Changed: `SplitToolButton disabled` disarms the action, not the fold** (SplitToolButtonFoldAlwaysOpens — user: "even if nothing is applicable shouldn't it still show what's available"). The trigger is dimmed and its click arms nothing, but the fold still opens. New `variants[].disabled` greys a row (never hidden); its click does nothing and the fold stays open. Rows are `flex`, so the panel hugs its longest row instead of spanning the canvas (the 0.252.0 menu-row fix, applied here). ⚠️ A disabled trigger is no longer a `disabled` button: it takes focus and opens.
- **Changed: `SelectionOverlay`'s `W × H` label stays upright** (SelectionOverlayLabelUpright — user: "the size here glued to the side is so small it can't be read"). It sits outside the rotated chrome, centred 6px under the rotated box's bounds at any angle, at 12px (was 10). `showLabel`, `labelFormatter` and `accentColor` are unchanged.

## 0.252.0 — 2026-10-13

Four asks from kol-fxr's editor menu bar and Morph step picker — all additive; every default renders as before.

- **New: `MenuDropdownNest flyout`** (MenuDropdownNestFlyout) — the submenu opens beside its row, the way a desktop menu bar does: hover opens, leaving closes, a click toggles (touch), → / ← from the keyboard. The panel is a DOM child of the row, so a leaf click still closes the whole menu and an outside press still dismisses it. One measure on open keeps it on screen (lifted above the window's foot, flipped left at the right edge). Flyouts nest to any depth; `scroll` caps a leaf list at 60vh. `disabled` on both modes. The accordion stays the default.
- **Fixed: `MenuDropdownItem` and the nest row are `flex`, not `inline-flex`** (MenuDropdownItemBlockRow) — as bare children of a content-sized (`w-max`) panel, five rows measured as one line (≈795px). The panel now hugs its longest label; `w-full` still fills a fixed one.
- **New: `Dropdown ariaLabel`** (DropdownAriaLabel) — names what the dropdown chooses. The trigger reads "label, value" ("Color view, Hue"), so the value is still announced. Same name as `SegmentedToggle`'s.
- **Changed: `ShellSearchOverlay` keeps open for `action` and `keepOpen` rows** (ShellSearchOverlayActionKeepsOpen) — the row contract always said an `action` row keeps the modal open; `select()` closed after every pick. Such a row now reaches `onSelect` and `onClose` is not called; the overlay never runs the closure itself, so a shell that already runs it in `onSelect` (workshop's tag rows) does not run it twice. New `keepOpen` row flag for a drill-in. The highlight returns to the top row when the rows change, keyed on row ids, not array identity. ⚠️ A consumer whose `action` rows relied on the close now stays open — call `onClose` from `onSelect` to keep the old behaviour.

## 0.251.0 — 2026-10-10

- **Fixed: `MediaLibrary variant="picker"`'s close sits on the header row** (kol-fxr, MediaPickerCloseOnTheHeaderRow — user: "x close is in a weird place"). The overlay's corner X floated ~100px above the header; it now rides `headerTrailing` after the gear, its right edge on the footer's. A consumer's own `headerTrailing` still renders, before it.

## 0.250.0 — 2026-10-09

- **Fixed:** `MediaLibrary`'s title root drew the row-size slider on a phone, where `rowSize` reaches nothing (the phone browser is the stack). It is desk-only now; the grid's tile slider stays. kol-website, from the user's iPhone.

## 0.249.0 — 2026-10-09

- **New: `MediaLibrary variant="picker"`** — the browse surface (columns · rows · grid, bucket dropdown, search) inside the modal card, read-only, with a Use footer for the selected file. Same props as `modal` (`open` · `client` · `accept` · `onClose` · `onSelect`); its settings are held, never saved. `modal` keeps its own grid | list listing. It was apps/media's picker A — user: "why is this even a choice? it should be a variant option".

## 0.248.0 — 2026-10-09

- **New: `useModal().confirm(title, { options })`** — `options: [{ id, label, hint?, defaultValue? }]` draws `ToggleCheckbox` rows between the title and the buttons and resolves `{ ok, values }` (on cancel too, so a consumer can remember the toggles). Without `options`, confirm still resolves a boolean. The native fallback returns the defaults.

## 0.247.0 — 2026-10-09

- **Changed: `ContentRow variant="catalog"` carries a thumb** — the full 36 rung, square — when it is given `media`. A catalog row without `media` still has none (no MISSING plate). User: "catalog should change its default".

## 0.241.0 — 2026-10-08

- **New: the modal library switches buckets** (`MediaLibrary variant="modal"`, 2026-10-07). A client with `buckets()` gets a Store dropdown in the modal's header, as the browse page has; switching lists that bucket from its root. It listed the client's default bucket only, which is why design-editor kept a 301-line picker of its own with a Store dropdown — that picker is retired and the editor's three library doors (the footer, the layer inspector, labs' source card) open this modal.
- **Fixed: `MediaLibrary variant="modal"` (and `library`) threw on open** — `q is not defined` in `MediaLibraryProvider`: the kol-search swap (0.23x, 2026-09-29) removed the search string's local and left the paging key and the stats reading it. Nothing opened this variant between then and now.
- **Fixed: the modal library is an overlay, not a surface** — it painted `FullscreenOverlay`'s opaque surface over the page it was opened from (user, 2026-10-07, on labs: "its not overlay, its complete full screen"); it passes `scrim` now, the 48 % tint.
- **New: the modal library has a phone layout.** At 390 it kept its 64rem ask and ran off the right edge. Under 768 it is a full-height sheet: no overlay lane, no border, tiles two across, and the store and sort controls sit in a row above the list instead of the header, which cannot hold them beside the title, the search and GRID · LIST. The theme's `kol-components-organisms.css` carries the cut.
- **Fixed: the file context menu mounts on a read-only bucket** (`MediaLibraryBrowse` · `MediaLibraryExplorer`; kol-website's media on B2, 2026-10-08: "I cant right click to get context modal … cant download assets"). It mounted only when the bucket was writable, and Copy URL and Download sat inside it, so a read-only bucket lost two read verbs with the write verbs. Every bucket gets the menu now; the write verbs fold away when `fileActions` is absent.
- **Changed: `MediaTileGallery` collapses to two across below `sm`** — `cols` was an inline `gridTemplateColumns` at every width (four 75px tiles at 390). The count is `--kol-media-tiles-cols` on `.kol-media-tiles` now, and kol-theme's one phone rule overrides it. Decided on the recommendation, for review.
- **Fixed: `MediaViewer` showed a blank stage.** Its root was `w-full` inside FullscreenOverlay's content-hugging sheet, in an overlay grid whose track is sized by its content — nothing bounded it, embla laid every slide side by side (3888px at 1440) and the first image sat 1.6k off the left edge. The stage is the viewport minus the overlay's lane now. Found opening `apps/media/viewer`, the first route to open the viewer under a gate.
- **Fixed: `MediaViewer` reads as "an image and nothing else"** — it painted FullscreenOverlay's opaque light surface, so its inverse ink (the caption, the paging chips at md+) drew light on light. It passes `scrim` now, like the modal. On a phone, where the chips are off and a swipe pages, a `3 / 6` under the image says there is more (decided on the recommendation, for review).
- **Changed: the files wall folds its views and sort into one `···` below `md`** (`MediaLibraryLibrary`; apps/media/library at 390 stacked the FILES row, the three view icons and NAME · DATE · SIZE · KIND over the list). The browse page's fold, item 15 — the two pages fold the same way. Decided on the recommendation, for review.
- **Changed: the modal library wears the wall's row** — the view pair as icons on the row's trailing slot, the sort as the row below at `md+`, one `···` below `md`. It wore GRID · LIST as text and four sort cells in the header: one header for the family, page or modal. Decided on the recommendation, for review.
- **New: `accept` takes a function** `(object) => boolean` beside a kind or a list of kinds — a vector-only picker wants `.svg`, which is `image` by kind.

## 0.240.0 — 2026-10-06

- **Fixed: `SectionSplit ratio="auto"` media is shown whole** (section-split-content-media-and-ruled-gutter, kol-website). From 901px the frame was the rung minus the padding with `overflow-hidden`, so a content card (kolkrabbi.io `/studio`'s ProfileCard, 621px) showed as a 104px strip at 1440. Auto media takes the column's width and its own height; a ratio keeps the bounded rule (5/4 on `height="80"` at 1600×950: 630×504, as before).
- **Changed: `SectionSplit` pads inside its cap with `--kol-pad-section-x`** — `.kol-page`'s measure — instead of `px-5/8/14` outside it, so its text starts where the bands around it do: 108 at 1920, 48 at 1440 and 1024, 20 at 390. `fill` unchanged.
- **Fixed: `ColumnBrowser autoFocus` does not scroll the page** (explorer-autofocus-scrolls-the-fixed-page, kol-website): `focus({ preventScroll: true })`. Inside `PageShell mode="fixed"` the focus scrolled the page 102px and the header opened off-screen.
- **Fixed: a tooltip does not open on a tap.** `Tooltip` opens on hover, and touch has no hover — a tap read as one that never ends, so the tooltip opened and stayed over the next control (found on labs' phone sheet, 2026-10-05: "Transport" over `Save to file`, a rail row's name hanging off the nav drawer). `usePopover`'s hover is mouse-only now; `Tooltip` is its one hover consumer. A keyboard still opens it through focus, a mouse as before. **On a touch screen a tooltip no longer shows at all** — say so if a page leaned on tap-to-read.

## 0.239.1 — 2026-10-05

- **Fixed: `ContentFilters` — a chip that is not offered does not filter.** The active set outlives a change of `filterGroups`, so on a page whose views swap the groups (a Library of Variants · Effects · Expressions) a chip picked in one view kept filtering the next, where no item carries its key: an empty list under "(1) filter active" with no chip to untick. Only chips the current groups offer apply (plus `customFilterKeys`); the stored set is untouched, so the chip is still on when its view comes back. A page whose groups never change behaves as before.
- **Fixed: a catalog row is one line.** `ContentRow variant="catalog"` (and `print`) is a fixed 36px rung, but neither slot truncated: a long `detail` took its full width and the title wrapped under it, so one row stood two or three lines tall in a list of single-line rows. The title now keeps its width and the detail takes what is left and truncates (`ContentText`'s new `lead` line — a `between` the other way round). A row whose detail already fitted renders as it did.

## 0.239.0 — 2026-10-02

- **Fixed: `SectionSplit`'s frame keeps its `ratio` beside the text** (section-split-frame-ratio-holds-at-desktop, kol-website). From 901px the frame carried the column's width AND the rung's height, so `aspect-ratio` had nothing to decide — a `5/4` frame rendered 2.22 at 1600 and cropped its image. The width is `auto` again there: the rung sets the height, the ratio the width, the column caps it (the 2026-08-27 rule on the prop). **Visible:** a bounded frame beside text can stand narrower than its column — take a taller rung for bigger media. Below 901px unchanged.
- **New: `Button variant="tab"`** — the tab chip as a Button state: quiet text at rest, a soft filled chip while `pressed`. Needs kol-theme ≥0.165.0.
- **Changed: `TabChips` is on the control size ramp.** Each chip is a `Button variant="tab"`; new `size` prop (default `sm`, 26px — it was a bare 24px button beside 26px controls). Needs kol-theme ≥0.165.0: on an older theme the chips paint as plain buttons.

## 0.238.0 — 2026-10-02

- **Fixed: `Dropdown` — the open list takes the zoom of its trigger.** The list is portalled, so inside a zoomed surface (kol-monitor's rack at 80%) it kept its full-size type in a panel pinned to the trigger's shrunken width, and the names were cut off. It now measures the trigger's drawn-over-laid-out width and zooms the list to match.
- **`Dropdown` — the hairline under the trigger is drawn for every tone.** It was keyed on `variant="primary" | "grey"`, so a dropdown toned by `tone=` had none and an outline one lost its divider (the panel covers the trigger's bottom border). ⚠ visual: outline, ghost and `tone=`-only dropdowns gain the line when open.
- **`Dropdown` — the list is the trigger's, continued.** Rows wear the trigger's face at every size (they were `kol-helper-12` at sm · md · lg, wider than the trigger's, so the longest value was cut off in its own row) and sit on the trigger's text edge (they were 4px in at xs · sm · lg). `MenuDropdownItem` takes `rowClass` for it; a menu's rows are unchanged. ⚠ visual: dropdown rows at md and lg are larger type (14 · 16).
- **`Dropdown` — a row is its trigger's height.** Rows were 32px at sm · md · lg and 20 at xs; they are on the control ramp now (22 · 26 · 32 · 40, `--kol-ctl-*`). ⚠ visual: lists are tighter at sm, taller at lg, 2px a row taller at xs.
- **`Dropdown stayOpen`** — an outside click does not close the list (the trigger and Esc still do). `usePopover`'s `dismiss` takes floating-ui's options object for it.
- **`Dropdown` in a hardware panel** — a list portalled out of a `.kol-hw-panel` carries the marker, so it skips the touch rung its trigger skips (needs the kol-theme and kol-hardware of this release).
- **`Input` in a hardware panel** — the field keeps its desk height on touch (`pointer-coarse:not-[.kol-hw-panel_*]:h-[22px]`); the type still goes to 16px there, so iOS does not zoom.
- **`@kolkrabbi/kol-component/atoms/RotaryDial`** resolves again — the export map points the old subpath at `molecules/Knob.jsx` (the barrel aliased the name; a subpath has no alias unless the map carries one). Drops with the `RotaryDial` name.
- **`ShellSearchOverlay selectLabel`** — the footer's Enter line while a row is highlighted (default `Go to page`, unchanged). A search modal whose rows are not pages says what Enter does: the rack's module search passes `Add module`.

## 0.237.0 — 2026-10-02

- **New:** `MediaPlayer` (molecule) — `variant="video" | "audio"`, and `frame` to draw inside `QuickLookFrame`; absent, it plays inline. The media, `PlaybackBar` and `usePlayback` as one player.
- **Deprecated:** `VideoSheet` · `AudioSheet` · `AudioPreview` · `AudioPlayer` are aliases of `MediaPlayer` (ledger). `AudioPreview` and `AudioPlayer` now draw the `PlaybackBar` instead of their own transport and the browser's strip. `AudioTile` · `VideoTile` · `formatLength` are unchanged exports, from `PlayTile.jsx`.
- **New:** `Slider direction="vertical"` (the standard track, upright at `height`), `Slider variant="scrub"` (the media scrubber) and an `aria-label` pass-through. `PlaybackBar`'s scrubber and volume, the media pages' row-size and tile-size sliders and `QuadrantSync`'s fade take the Slider track.
- **Renamed:** `RotaryDial` is `Knob` — `variant="dial"` (default) · `"panel"`. `RotaryDial` is the alias (ledger).
- **Fixed:** `Kbd`'s icon follows the cap — 10 in `sm`, 12 in `md`.

**The question round** (2026-10-01 — the review's open calls, ruled and built). Needs kol-theme with `.bg-surface-sunken` only if you use that class.

- **New: `MultiSelect`** — several pick-one settings in one dropdown: closed it is the Dropdown's trigger reading every current value, open it is a popover with a column per setting (`groups [{ id, label, options }]`, `value { [id]: value }`, `onChange(id, value)`). First cut.
- **`Dropdown`** — an option `{ heading: 'Variant' }` draws a row that names the list; never a choice.
- **⚠ `Button` `variant`: six values deprecated** — `primary · secondary · outline · ghost · grey · control` are tones under a second name. Pass `tone` (`secondary` → `tone="inverted"`, `control` → `tone="ghost"`). They still render exactly as before and warn once in dev; `variant` keeps `accent · danger · nav`. On the retirement ledger (§ Props).
- **`Slider variant="panel"`** — the rack slider, kol-hardware's `Fader` merged in: a drawn 2px track, `direction="vertical"`, `height`, and `onHold` (a 500ms touch hold).
- **`RotaryDial variant="panel"`** — the rack knob, kol-hardware's `Knob` merged in: `size` `sm · md · lg · xl`, `labelPlacement`, `bipolar`, `labelMinWidth`, `onHold`.
- **`LabeledControl variant="panel"`** — the panel label, kol-hardware's `PanelLabel` merged in: `labelPosition` `top · bottom · left · right`, `labelClass`, `gap`.
- **`armLongPress`** exported — moved here from kol-hardware with the controls that arm it.
- **Renamed: `HlsVideo` → `BackgroundVideo`**, and it is a utility now, not an atom (it has no UI). `HlsVideo` is the alias.
- **Tier moves** (source folders only — imports from the package root are unchanged): `ActionButton`, `ColorSwatch`, `RotaryDial` atoms → molecules.

## 0.236.0 — 2026-10-01

- **New: `TabChips`** — tabs as a row of chips: the active tab a filled chip, the rest quiet text (`tabs [{ id, label }]`, `value`, `onChange`, `ariaLabel`). The tab idiom for inside a toolbar, beside `TabsRow` (underline) and `SegmentedToggle` (joined). It was the showcase's local `DocTabs`, promoted as it was.

## 0.235.0 — 2026-10-01

**Review round two** (plan-2026-10-01-showcase-review-round-2). Needs kol-theme ≥ 0.162.0 for the table and badge rules.

- **⚠ `ShellSearchOverlay`** — Enter opens the highlighted row from the first keystroke (it used to commit the query unless you had arrowed); ⌘/Ctrl+Enter still opens every hit, and the footer's results line is now a button that does the same. With no rows Enter commits as before.
- **`Table` `lastRule`** — `simple` only: the rule under the last row. **Off by default** — ⚠ visual: a simple table no longer draws a line under its last row.
- **`useDragResize` `variant: 'line'`** — the whole edge lights on hover and drag, a double-click toggles the rail and a click does nothing. `'pill'` (default) is unchanged.

## 0.234.0 — 2026-10-01

- **Deprecated: `DropdownTagFilter`** → `SettingsMulti`, the many-of-N on the standard `Dropdown`. It drew its own pill with hardcoded radii (20/22/24) and one look; nothing renders it. On the retirement ledger.

- **`Tag color`** — a palette hue (blue · teal · green · yellow · red · orange · purple, what kol-markdown's `getTagColor` returns); sets `--kol-tag-hue` and `.kol-tag--hue`, keeping hover and active. Status stays `Badge`'s. Needs kol-theme ≥ 0.161.0.

## 0.233.0 — 2026-09-30

**The browser's items read as one set** (needs kol-theme ≥ 0.160.0 for `.kol-item-name`).

- **One item type in every view** — `ColumnBrowser`'s rows, the media rows view and the grid's names all take `kol-item-name` (mono 12/16). The size slider scales the row and the glyph only. ⚠ Visual: the columns were mono-14 in 0.232.0.
- **Selected is the tone's pressed fill** — `OptionRow selected` and the media rows view paint `--kol-tone-pressed-bg/fg` (white in dark, the grid name's pair outside a tone); the glyph takes the row's ink. The folders on the way to the pick are the trail, oq-08. Hover still paints nothing in the browser (`OptionRow hover={false}`). ⚠ **Under evaluation** — the white row may become the grid's form (grey row, white pill on the name only).
- **`OptionRow`** — `hint` sits beside the label on its baseline, right-aligned (one line; the palette's paths); `type` overrides the ramp's type class; `hover`; `ROW_FILL` exported. `fill` is gone (0.232.0, one day old).
- `FieldRow` — the picked option is marked by its check only, as before 0.232.0.

## 0.232.0 — 2026-09-30

**One row, on the control ramp.**

- **New `OptionRow` molecule** — the row you move through: `size` on the control ramp (xs · sm · md · lg → 22 · 26 · 32 · 40; height, pad, type and glyph step together), `active` (tone fill, full ink) · `selected` (oq-08) · `trail` (oq-04) · `muted`, slots `icon` / `leading` / `label` / `hint` / `trailing`, `as`. Hover takes the active fill; `fill={false}` leaves the fills to the caller. `ROW_HEIGHT` / `ROW_TYPE` exported for rows with their own anatomy. `ShellSearchOverlay`'s rows, `ColumnBrowser`'s desktop rows and `FieldRow`'s options now render it.
- **`ColumnBrowser` `rowSize`** (default `md`). ⚠ Visual: desktop rows were 42px of mono-12 on the Table's padding; they are 32px of mono-14 now, matching the search field. The phone's four-zone row is unchanged.
- **`MediaLibrary` — the tree views scale.** A row-size slider beside the count line steps the columns and the rows view along the ramp (`settings.rowSize`); the grid keeps its tile slider.
- **`MediaLibrary` — the filter bar filters the whole bucket.** Opened below the root it filtered only the current folder, so the columns lost every sibling path (`logos`, `original`, `projects` at `brand/og/`) with no filter set.
- **`MediaLibrary` — a typed query is a results list.** While the filter bar holds a query the columns and rows show every hit flat, each named by its path; clearing it brings the tree back.
- **`ShellSearchOverlay` — `onOpenResults` (⌘/Ctrl+Enter) and `resultsLabel`.** Enter keeps its meaning; ⌘Enter hands the query to the consumer's results surface, and the footer says so. Media wires it to the filter bar, and says "Go to file" for Enter.
- **`MediaLibrary` — `searchSuggestions`.** The palette opens on favourites, smart folders and the bucket's top-level folders; an array replaces them, a function receives them. A row with `run` calls it.
- **`ContentFilters` — controlled search** (`searchValue` / `onSearchChange`); absent, the text stays private as before.

## 0.231.0 — 2026-09-30

**The search palette, aimed at shadcn's.**

- **`ShellSearchOverlay`** — an inset filled field on the md control's size, `kol-tone-grey` on the field and the list so the active row is the field's own grey, results under group headings, rows on the field's geometry, a fixed-height body, a footer that always says what Enter does. New `suggestions` prop: rows shown while the query is empty (Enter goes to the first). Rows take an optional `icon`.
- **New `Kbd` atom** — one key cap (`↵`, `⌘K`, `Esc`), sizes `sm` / `md`, an `icon` prop. Replaces the two hand-rolled `<kbd>` chips.
- **`SearchInput`** — `bare` now sits on the size ladder (`kol-control-{size}`) instead of a hand-set `px-4 py-3`; its glyph is `oq-48`; a leading `⌘` in `shortcutHint` draws the `command` glyph.

## 0.230.0 — 2026-09-30

**The names audit** (plan-2026-09-29-phase-log-and-showcase-review — the names audit + W3–W6).

- **Placement** — `CloseButton` → `atoms/` (a Button wearing an IconFrame), `ContextMenu` → `molecules/`, `PathNodeOverlay` · `CropOverlay` · `SelectionOverlay` · `CurveOverlay` → `utilities/` (they paint only onto a target). The barrel is unchanged — every import keeps working.
- **⚠ Behaviour: a portalled panel hides when its trigger is out of view.** `usePopover` adds floating-ui's `hide` middleware (`referenceHidden`) and returns `floatingStyles` with `visibility: hidden` while the trigger is clipped — an open menu no longer paints over a sticky header or floats at the page's foot when its trigger scrolls away. Every Dropdown, MenuItem, ContextMenu and Tooltip takes it.
- Comments: one spelling, `color`.

## 0.229.0 — 2026-09-29

- **Search is the KOL engine everywhere** (apps review). `MediaLibrary`'s four hand-rolled `.includes(q)` filters and `ContentFilters`' substring match now run on `@kolkrabbi/kol-search` (new dependency) through `utilities/mediaSearch.js` (`filterMedia` · `rankMedia`) and `utilities/searchItems.js` (`filterItems`): several words AND, `-word`, `"phrases"`, `tag:x` / `#x`, `kind:image`. A single word still finds everything the substring found.
- **One app, one masthead** — `utilities/masthead.js`: `MastheadContext`, `useMasthead`, `MASTHEADS`, `mastheadTitleClass`. Inside a Shell (`AppShell masthead`) `PageHeader` takes the app's voice over its own `voice` / `size`; `display` is the display voice, uppercase as a role, no subtitle. `PageHeader masthead` for a page with no Shell. Outside a Shell nothing changes. Media's own title reads it too.
- `Button` — an **unknown variant** stamps nothing (inherits the tone, else primary) and warns in dev; it rendered `kol-btn-secondary`, the inverted fill. `variant="secondary"` dropped at `Modal` (cancel), `ErrorBoundary`, `MediaLibrary` (Copy URL), `MediaLibraryPages` (Edit), `DocumentEditor` (Save).
- `SettingsMulti` — passes `variant` through like `SettingsChoice` (was hard-coded `primary`: the one lighter dropdown on a sunken settings page).
- `MenuItem` — `size` (xs · sm · md · lg → 22 · 26 · 32 · 40); `md` is the old fixed `h-8`.
- `SearchInput` — the expanding square is on the ladder (`{ xs: 22, sm: 26, md: 32, lg: 40 }`, was `sm: 28 · lg: 36`).
- `ShortcutsOverlay` — capped to the window's width; `LabeledControl labelWidth="auto"` stacks below `sm` (label, then the value) — a phone showed the sheet's middle third and labels as "C".
- `MediaLibrary` (explorer) — `phoneTabs` off in the apps (kept, documented); `onKinds` puts **File formats** in the phone `···` menu; **Count line** display setting (`countLine`: auto · on · off — auto = off on a phone or touch device); `onOpenSettings` hands the gear to the host instead of opening the drawer; the phone `···` trigger is `sm`.
- `DocumentEditor` — `savedAt={null}` = never saved: the status says "Not saved yet", not "Saved"; a `Textarea` of `md` + `kol-mono-12` → `sm`.
- **The touch rung** (ruling D5, with kol-theme 0.156.0): `MenuItem`'s trigger and `SearchInput`'s square read `--kol-ctl-*`; `Input` and `SearchInput` pin their field `pointer-coarse:h-[22px]` — the Tailwind height out-ranked the theme's coarse rule, so a phone got 16px text in a 16px line in a 26px box.

## 0.228.0 — 2026-09-28

- **`ShortcutsOverlay` lives here now** (moved from kol-shell, which re-exports it) — the keymap
  sheet the workshop shell and every app open on `S`, one component instead of a second `?` sheet.
- **`ShellSearchOverlay`: `enterLabel`** — when set, the panel's last line says what Enter does
  (`↵ All results for “q”`), so Enter is never a surprise. Rows may carry `highlights`
  (`[start, end]` ranges from an engine) and every hit is underlined, not just the first slice of
  the raw query; resting rows read at 80 (were 64).
- **Frontmatter comes from `@kolkrabbi/kol-markdown`** (new dependency). `parseFrontmatter`,
  `splitFrontmatter` and `joinFrontmatter` are still exported from here, same behaviour —
  `utilities/frontmatter.js` moved into the engine tier, where kol-workshop's byte-identical copy
  of `parseFrontmatter` now lives too.

## 0.227.0 — 2026-09-27

**The editor inspector rebuild** (plan-2026-09-27-editor-inspector-rebuild).

- **`InspectorSection pane`** — the Affinity panel shape: a titled header strip (`actions` on its row),
  a padded body, full-width rules between panes. Mount panes in a container with no horizontal
  padding. The default and `divided` shapes are unchanged.
- **`SegmentedToggle` names its glyph cells.** A cell whose `label` is not a string shows its
  `ariaLabel` as a KOL `Tooltip` (`asChild`, so no wrapper moves the strip); a new `tooltip` field
  overrides the text. Icon-only strips stop being mute everywhere.
- **`Input slotRight`** — an interactive trailing node inside the shell (a combo field's chevron),
  the mirror of `slotLeft`. Not aria-hidden.
- **`ToolPalette`** carries `kol-tool-palette` (kol-theme 0.154.0 draws its states); the
  `SplitToolButton` fold menu's border is `oq-08` (was `fg-08`, the stroke law).

## 0.226.0 — 2026-09-27

**Editor DS sync (the design editor back on KOL, same day):**

- `MenuItem` / `MenuDropdownItem` / `MenuDropdownNest` — the KOL focus ring (`.kol-menu-btn`), not the
  browser's blue one; dividers on `oq-08`.
- `KeyframeEditor` — `t` may be a function read at the click (a clock that runs without re-rendering).
- `InspectorSection` — `actions`, controls on the label's row.
- `CanvasFrame` / `Canvas` — no `guideColor` → theme ink (`oq-24` border, `fg-64` label) instead of a
  hard-coded light border that vanished on a light page; ruler stroke `oq-16`.
- `XYPad`, `TimelineDock` — strokes on `oq` (the stroke law).
- Icon-only wrappers inked `fg` → `oq` (FieldRow, SearchInput, Stepper, TabsRow, MediaLibraryPages,
  RecordManager) — caught by the icon-ink gate's new I3.

- `SectionText` / `PageHeader` — **inline actions with no subtitle sit on the title's row**, on the
  right edge, wrapping under the title on a narrow screen. The docstring always promised this; the
  code stacked the cluster under the headline. This is the tool frame's masthead (the title, its
  controls on the right).

## 0.225.0 — 2026-09-27

**The Hub and the media tool, one tool in two frames.**

- `MediaLibraryExplorer` — `keys` (B F R C G N, K → `onKinds`) and `phoneTabs`, so every app showing the tool answers to the same keys; `columnHeight: 'fill'` (measured); `mediaSettingsSections` exported — one settings system for the browse drawer, a Hub page and a Hub drawer.
- `Tooltip` — `asChild`, an empty label passes through, ambient tone (panel ground), border oq-08, no shadow; the native-`title` sweep (gate `validate-native-title`).
- `Dropdown` — `{ divider: true }` options.
- `SectionText` — the inline actions row stretches, so every PageHeader cluster sits on the right edge.
- `SettingsChoice` — variant unset, inherits a tone wrapper.

## 0.224.0 — 2026-09-26

**The media D1 plan, v2** — one user, drafts in the browser, the database for what must outlive a
device. The contract is at the head of `MediaLibraryPages.jsx`; every verb optional.

- **`DocumentEditor` — NEW** (organism). Write a text file: open one or make a NEW one (name + type:
  md · txt · json · yaml · csv). A markdown file's frontmatter becomes a fields form (title ·
  description · date · tags suggested, any key allowed; the name carries the title until it is
  edited), the body a `Textarea`; Write / Split / Preview through `KindPreview`; Attach inserts a
  file from an `assets` list at the caret; an SVG edits as text beside its picture. ⌘S saves,
  Revert drops the draft. The concept is kol-olina's brand notes page.
- **Drafts are browser memory** — `utilities/localDrafts` (`readDraft` · `writeDraft` ·
  `clearDraft` · `listDrafts` · `moveDrafts` · `DRAFTS_EVENT`). **BREAKING for a client that
  implemented `saveDraft` (0.223.0)**: it is no longer called, and listings no longer need
  `hasDraft` — the page reads drafts itself, restores one newer than the file, and moves it with a
  rename or move.
- **`splitFrontmatter` / `joinFrontmatter`** — the round-trip pair the fields form edits through.
- **The media page** — the editor replaces 0.223.0's textarea (Edit in the pane, the menu and Quick
  Look; New document… in the menu; 1 MB cap); **favourites** (`setFavourite`) with a star in the
  pane and the menu and a Favourites filter; **folder tags and favourites** (`folderInfo`, loaded
  beside the listing; `setTags` takes a folder path); **tag suggestions** from the bucket's own
  tags; a markdown file's frontmatter tags merge into its tags on save; **smart folders**
  (`smartFolders` · `saveSmartFolder` · `deleteSmartFolder`) as chips above the body, a chip showing
  its matches flat; an **event log** (`logEvent`: opened · edited · created) for a consumer's
  Recents; `smartFolder` prop to open on one; the bucket hook's `reload()`.

## 0.223.0 — 2026-09-25

**What a database beside the bucket adds** (the media D1 pass). Optional client verbs; a client
without one hides that feature. The contract is written at the head of `MediaLibraryPages.jsx`.

- **Tags.** Listed objects carry `tags`; `client.setTags(key, tags, bucket)` writes them. Chips with
  remove and an add field in the preview pane (every view), "Tags…" and "Add tags to N…" in the
  right-click menu, a Tags group in the filter bar, a Tags column under Fields.
- **Editing text files.** `readText` · `writeText` · `saveDraft`. Edit in the preview pane and in
  Quick Look's header (`MediaInspector` `onEdit`) for markdown · json · yaml · text · code. A pause
  writes a draft, ⌘S or Save writes the file, Revert drops the draft; the pane marks a file with
  an unsaved draft.
- **Personalisation.** An uncontrolled page whose client has `loadSettings(bucket)` /
  `saveSettings(bucket, settings | null)` loads and saves its view settings there. A `settings`
  prop still wins.
- **`ColumnBrowser`** takes `renderDetails(file)` — rows under the preview column's facts. The root
  key handler now ignores keys typed in a field inside it.

- **A file dropped onto a file no longer renames it.** `ColumnBrowser`'s rows and the media rows
  view's folder rows called `onDrop` without `canDrop`, and the enclosing column allowed the drag,
  so a drop on a file row moved the dragged file INTO the file's key. A row that cannot take a drop
  now lets it bubble: dropped on a file, it lands in that file's folder (Finder's behaviour);
  dropped on a file in its own folder, nothing happens.

## 0.222.0 — 2026-09-25

- **`ToolPalette` — NEW** (organism; kol-fxr `editor-panels-the-held-specs` A3). The editor's tool
  bar as one row of `items`: `tool` (arms, lit while `activeId`), `action` (one-shot), `split` (a
  `SplitToolButton` fold) and `divider`. A fold with `action: true` runs its variants, the trigger
  re-running the last-picked one (Boolean); an `action: true` variant inside a tool fold is a
  one-shot row (Text → Kinetic type). Armed tool, actions and disabled rules are the consumer's.
- **`SplitToolButton`** gains `onTrigger(id)` (replaces the arm: a fold of actions), `disabled`,
  `iconComponent` (Button's seam) and a per-variant `onSelect()`. Without `lastPicked` the trigger
  now remembers the last row picked from its menu (it showed `variants[0]` again). An action fold
  sets no `aria-pressed`.

## 0.221.0 — 2026-09-25

- **`ColumnBrowser` takes a controlled `picked`** (a key or an object; absent = internal, as
  before). Given, the browser opens on that file's level with its row selected, previewed and the
  keyboard cursor on it. `MediaLibraryPages` feeds it `pickedFile`, so a file picked in rows or grid
  survives the switch to columns (kol-client-olina `column-view-drops-the-picked-file`).
- **The media preview pane shows wide and tall images whole.** `ImageFrame` keeps its preset-ratio
  snap, but an SVG, or an image past the ladder's ends (wider than 16:9, taller than 9:16), is drawn
  `object-contain` instead of cropped by `object-cover`. Photos near a preset render as before
  (kol-client-olina `column-preview-crops-wide-images`).
- **BREAKING — `FoundryCTA` is gone.** It was a deprecated alias of `SectionCta variant="centered"`
  since 2026-08-26; 30 days on, nothing in the estate imports it (retirements R3). Use
  `<SectionCta variant="centered" … />`. Source quarantined to `_tmp/2026-09-25-foundry-cta/`.

## 0.216.0 — 2026-09-21

The media product, proved by use in `apps/media` before publishing (the apps tier).

- **`ContextMenu` + `useContextMenu` — NEW.** A right-click menu anchored at the pointer.
  `onContextMenu` appeared nowhere in this package before, which is why no file verb had a
  surface to be invoked from. Built on `usePopover` via `refs.setPositionReference` — a
  virtual element passed to `elements.reference` is rejected by floating-ui, because that slot
  also feeds the interaction hooks and they call `getAttribute` on it.
- **`MediaLibraryExplorer` / `variant="explorer"` — NEW.** Browse and the file wall as two
  views of ONE surface, one mounted at a time behind a switch in the header: one wordmark, one
  count, one listing. `browse` / `library` / `modal` / `page` are untouched.
- **`fileActions` on `MediaLibraryBrowse`** — `{ createFolder, createFile, rename, move, remove }`,
  each optional. Whatever is supplied becomes a context-menu entry; a read-only bucket gets no
  menu. Right-click on rows, columns and blank space; drag a row onto a folder, or into a
  whole column, to move it; ⌘/⇧-click multi-select, with the menu acting on the set.
- **Row view shows the same tree as the columns.** It rendered folders derived from file keys
  and dropped files entirely, so an empty folder was invisible and no file was ever listed.
  Both views share one level function now; rows expand inline and take the column height.
- **`ColumnBrowser`** takes `onRowContextMenu` and `dragFor`. Paths coming out of a
  multi-bucket browser are virtual (`<title>/<bucket>/…`) and are un-rooted before any verb.
  The literal "empty" label on an empty column is gone.
- **One previewer.** The wall's `renderThumb` falls through to `KindPreview`, the same call the
  column preview makes — markdown, code, json, yaml, audio and video preview in grid and list.
- **Slots:** `banner` (under the header — the upload drop zone), `headerTrailing` (after the
  icons), `onHome` (the wordmark becomes a home button).
- Header gear, read-only lock and the Flat chip use the DS `Tooltip`, not a `title` attribute.

## 0.215.0 — 2026-09-04

- **`formatDate` reaches `MediaLibraryLibrary` too** (`FormatDateSkipsTheLibraryPage`,
  kol-r2b2). It landed on `MediaLibraryBrowse` only, so a consumer passing ONE
  props object to both got `19.6.2026` on the Browse tab and `2026-06-19` on the
  Files tab — two formats for one field, one tap apart. The desktop stack always
  had the mismatch; the new tab pill just moved the halves close enough to see
  it. Both pages default it, so an unpassed prop cannot diverge either.
- **The sweep rule, widened.** This is the FOURTH defect of one shape:
  `settingsFooter` documented on `SettingsPanel` and hardcoded past by the page ·
  `thumbnailFor`/`folderMeta` shipped on `ColumnBrowser` and never forwarded ·
  now a seam on one page and not its sibling. The rule written at the signature
  covered component→page and not **page→sibling page**. These two pages are ONE
  SURFACE SPLIT IN TWO and a consumer hands the same object to both, so a prop
  naming how a SHARED FIELD renders is added to both in the same edit. Props
  about a concept only one page has stay put — `thumbnailFor`, `folderMeta` and
  `stackView` are folder and stack concepts and are correctly absent from the
  wall. A check now diffs the two signatures and names every legitimate
  one-page-only prop, so the next divergence is a decision rather than a
  surprise.

## 0.214.0 — 2026-09-04

- **The tab bar's spacer goes AFTER the list** (`TabBarSpacerAboveTheList`,
  kol-r2b2, measured at 390). `MobileTabBar` is `fixed`, so where it sits in the
  tree is irrelevant — but the SPACER is in normal flow, so its position is
  everything. Rendered before the list in `MediaLibraryBrowse` it failed twice
  at once: a 56px hole punched into the gap under the pinned search, and the
  last row still running 99px under the bar. The comment above the block named
  the exact failure it was meant to prevent and the block sat in the wrong place
  anyway. `MediaLibraryLibrary`'s copy was already correctly placed after its
  `ContentFilters`. The check asserts the ORDER, since presence passes on the
  broken version.
- **`FullscreenOverlay initialFocus`** — a ref naming where focus lands on open.
  The sheet takes it by default, which is right for a browser and wrong for a
  sheet opened to be TYPED IN: a child's `autoFocus` cannot win, because child
  effects run before the parent's and this one moves focus afterwards, so the
  field focuses and is immediately robbed with nothing in either file looking
  wrong (kol-fxr measured it — Save As routed into the files dialog correctly
  and focus sat on `.kol-overlay-sheet`). The ref may point at the control or at
  a WRAPPER around it; the first focusable descendant is taken, so a caller does
  not have to know whether a DS atom forwards a ref. An empty ref falls back to
  the sheet.

## 0.213.0 — 2026-09-04

`ColumnBrowserMobileViews` items 15 + 16 — the last two, unblocked by kol-r2b2's
390 measurement of 0.211.0. User-ruled off the wireframe 2026-09-03.

- **`MobileTabBar` — the floating bottom tab pill** (item 16). Both references
  end the same way: neither iOS Files nor Dropbox stacks two full-height
  surfaces on a phone, each floats a pill and gives every surface a tab. It is
  what answers the question `ColumnBrowserStackMode` left open — the library
  wall does NOT stay stacked under the browser. **What a tab MEANS is the
  consumer's**: the component ships the shape, the float, the states and the
  breakpoint, and takes a list. Deciding that a media library has exactly three
  surfaces called Browse, Files and Kinds is the guess that makes an organism
  un-reusable. `TABBAR_H` is published so a list does not hardcode the room it
  owes. `MediaLibraryBrowse` and `MediaLibraryLibrary` both take
  `tabs`/`activeTab`/`onTabChange`; no tabs, no bar, and both pages are exactly
  what they were. Above `md` nothing renders — the 2026-08-26 one-view ruling
  stands.
- **Pinned search and a `···` below `md`** (item 15) on `MediaLibraryBrowse`.
  Item 7 of the previous ticket hid the desktop control cluster and put nothing
  in its place, so SORT was unreachable on a phone. Search sits above the list
  rather than inside the `ContentFilters` wall, because the wall is a different
  SURFACE — a tab away — so a control living in it cannot be reached from the
  thing you are searching. It filters the KEY SPACE, so the tree still
  navigates and no flat results view had to be minted. The `···` carries the
  stack view (List / Icons) and the sort keys, and tapping the active key flips
  the direction, as both references do.
- **`sortObjects` — name is the tiebreak in every mode.** Equal sizes, or a
  bucket whose objects carry no `uploaded`, otherwise reshuffle between renders
  for no reason the user caused. The tiebreak is deliberately not reversed by
  `sortDir`: descending by size still reads A before B inside a tie.
- **`MenuItem caret`** — the trigger drew `label ▾` unconditionally, which is
  right for a named menu and wrong for an ICON trigger: a caret beside `···`
  reads as a second glyph, and neither reference draws one.

## 0.212.0 — 2026-09-04

- **`ContentFilters initialFilters`** — chips active on the first paint, as
  `["<groupKey>:<value>"]`. A consumer that opens onto one chip (the editor's new
  files dialog opens on `preset`) had no way to say so: the set started empty and
  the first paint showed everything. INITIAL, not controlled — the filters are
  the component's own state everywhere else, and a half-controlled set would be
  two sources of truth.

## 0.211.0 — 2026-09-04

`StackModeChromeAndAncestors` (kol-r2b2, measured at 390 × 844 on the deployed
build). All four items.

- **The stack list renders the CURRENT LEVEL only.** It walked from the root
  down the open path, so every ancestor rendered as a row — at a bucket root,
  two rows and 120px of an 844px viewport restating the breadcrumb sitting
  directly above them, with rows indented to 56px because depth counted from the
  root. The spec held two rules that fight ("ancestors are reached by back" and
  "capped at three levels of indent") and kol-r2b2 corrected it against their own
  wireframe. The fix is that NAVIGATING and EXPANDING had been fused into
  `prefix` and come apart: the ROW opens a folder and re-bases the list, the
  CHEVRON expands it where it stands from local state — which is what item 11
  always said the two tap targets were for. Depth now restarts at the current
  level, so rows sit at 16px.
- **No frame below `md`.** On desktop the browser is a PANE with edges sitting in
  a page; in stack mode it IS the page's content. Border and radius dropped;
  the 358 width is the consumer's page padding and is untouched.
- **The zone-2 glyph fills its box.** It sat at 20 in a 44 box while a file's
  thumbnail filled its 44, so the icon column read ragged. One `ZONE_BOX`
  constant sizes both now. Not a glyph-ladder break: SOLO pairs 12/16/20/24 with
  the CONTROL squares 22/26/32/40, and this is a media slot a glyph stands in
  for, not a control square. (The ticket reported the glyph at 12px — that
  measurement caught the disclosure chevron, which is 12. The rail was still
  ragged at 20.)
- **`LibraryHeader` gives at 390.** The title was `white-space: normal` in a box
  the fixed `w-48` dropdown had squeezed to 48px, so `KOL-R2B2` wrapped
  MID-TOKEN into two 36px lines. The dropdown's 192px was the real cost — it
  keeps that width from `md` up and shrinks below it, and the title truncates
  rather than wrapping. `headerActions` is documented as holding about ONE
  consumer icon at this width, with the swap-below-`md` pattern named.

## 0.210.0 — 2026-09-04

- **`media={false}` — no cover, as against a missing one**
  (content-card-needs-no-cover, kol-client-olina). `ContentMedia` turns absent
  children into a dashed MISSING placeholder on purpose: a card whose image
  failed must not collapse into a text blob. That is the wrong answer for a
  markdown note in a database row, which has no picture and never will — their
  `/notes` page drew a wall of dashed frames with nothing misconfigured. Only
  the consumer knows whether a cover is owed, so it is declared. `false` rather
  than a new prop: it is React's own idiom for "render nothing", and
  `media={false}` until now rendered an EMPTY framed box, a state nobody wants.
  `media={null}` and an omitted `media` keep the placeholder, so no existing
  consumer moves. On `ContentRow` it means no thumb — `thumb={0}` already did
  that, but a SIZE was answering a question about MEANING, and a consumer
  should not say the same thing two ways on the card and the row.
- **`KindPreview` takes `text` + `kind`** — content in hand, no fetch. A D1 row
  has no file behind it, so `urlOf` has nothing to pull, but the render path is
  the one this component already owns and a second previewer in the estate is
  what the lobby exists to prevent. **Shape ruled by kol-r2b2**, whose component
  this is: `text` sits BESIDE `o` (that object's shape is what `kindOf`,
  `posterFor` and the variant grouping read — prose inside it would make it mean
  two things), and `kind` ships WITH it rather than after, because
  classification reads the extension off the key and a keyless row lands on
  `other` — the right content rendered as the wrong thing, worse than the
  placeholder it replaces. A URL caller is untouched.
- **`ContentText` warns on an unknown slot** (dev only, once per prop). A typo
  in a slot name rendered an empty card silently — no build, lint or console
  signal — and cost a consumer an hour. The warning names the whole vocabulary,
  since "summary is not a slot" does not tell you `body` is.
- **`ColumnBrowser`: `thumbnailFor` / `folderMeta` receive the path VERBATIM**
  (doc only, kol-r2b2). A consumer mounting a virtual root above real storage
  gets its own prefix back and must strip it before looking anything up.

## 0.209.0 — 2026-09-04

- **`ColumnBrowser` stack mode: the children go under the PARENT** (D1,
  ColumnBrowserStackMode, kol-r2b2). Inline expand was ruled and the row list
  was built by a flat loop over the open path, which appends each level after
  the whole level above it — so an open folder's children surfaced below its
  last sibling and, in the reported tree, below an unrelated root FILE. Every
  row was present and every `depth` indent was right, so it read as an indent
  bug; the walk is now recursive and the subtree is contiguous. Lifted to
  `stackRows(objects, openPath, partition)` so the order is checkable — a
  structural assertion passes on the broken version, an adjacency one does not.
- **`formatDate` — a new seam** (D2, same ticket). Stack rows printed
  `2026-06-19T02:00:14.629Z`, the raw `uploaded` string. Defaults to ISO
  date-only and is a prop for the same reason `formatSize` is one. The preview
  column's inline date formatting now routes through it too.
- **`MediaLibraryBrowse` forwards `thumbnailFor`, `folderMeta`, `stackView` and
  `formatDate`** (ColumnBrowserMobileViews items 10 + 13). Both mobile seams
  shipped in 0.207.0 and were unreachable: the page's signature ended before
  them, so folders showed no meta and files no thumbnail on the deployed build
  while the props gate stayed green. Second time this shape bit — `SettingsPanel`
  documented a `footer` slot this file hardcoded past — so the rule is written
  at the signature: a prop added to `ColumnBrowser` is added here in the same
  edit unless the page holds a real opinion about it.

## 0.180.0 — 2026-09-03

- **`SegmentedToggle tone`** (theme 0.139.0) — the one control ControlToneSunken
  skipped. Through `toneClass` like the rest, so a `kol-tone-sunken` wrapper
  reaches it; unset inherits.

## 0.179.0 — 2026-09-03

- **`Modal` wears `.kol-overlay-scrim`** (overlay-scrim-outliers sweep). The
  docs had called it a wearer since 2026-08-01; the source drew a raw
  `rgba(0,0,0,0.5)`. Same sweep, one line each so they are not found again:
  `OverlayGlassPanel` blurs on purpose (a panel, not a scrim), `SelectionOverlay`'s
  `rgba` is a label chip on a canvas, `TiltBento`'s is a tile's hover veil.

## 0.178.0 — 2026-09-03

- **`slide` — a fifth content kind** (slide-variant-and-shelf-preset,
  kol-client-olina; user-ruled: *"why don't we make a new variant for slides,
  they are genuinely different with 16:9 layout and those exposed
  properties?"*). A deck is a 1920×1080 stage. `ContentCard variant="slide"`:
  file's stack, `16 / 9`, the plate on `surface-primary` at rest AND hover.
  `ContentRow variant="slide"`: file's row with the thumb filling the rung's
  height and taking its width from the ratio — 48 × 85, the whole frame, not
  the 48 square that cropped a deck to a sliver. Text is `title · date · size
  · meta` (the slide count). Every value read off olina's /slide-deck.
- **`formatSize` is exported** — it lived inside `MediaLibraryPages` and two
  consumers had restated it byte for byte.

## 0.177.0 — 2026-09-03

- `tone` takes `inverted` (theme 0.138.0); `secondary` now means the page
  surface. `inverse` still maps to `sunken`.

## 0.176.0 — 2026-09-03

- **`tone` has six values and `default` means inherit** (tone-is-the-ground-axis,
  kol-client-olina; theme 0.134.0 carries the bundles). `toneClass` maps
  `primary` · `secondary` · `outline` · `ghost` · `grey` · `sunken` (`inverse`
  aliased) to `kol-tone-*`; `default` stamps nothing, so a control inherits the
  nearest `kol-tone-*` wrapper's tone — a `default` that aliased `primary` on
  the element would have blocked the inheritance ask 3 exists for. **Button,
  Dropdown, Input, SearchInput and IconFrame no longer stamp a variant class
  when none is passed**: the theme's fallback renders exactly the old default
  (primary; IconFrame's secondary), and a toned wrapper now reaches them.
  `ViewToggle`'s well reads the tone instead of carrying `bg-surface-secondary`,
  and its inactive text chip is `.kol-control--plain`.
- **Dropdown copies the trigger's tone onto its portalled panel** — the panel
  renders at `body`, outside any wrapper's cascade, so on open the trigger's
  resolved `--kol-tone-*` are written to the panel as inline style. This is
  what makes an ambient outline dropdown paint the page's ground and not
  `surface-primary`.

## 0.175.0 — 2026-09-03

- **`SectionText` is a BASE, and `PageHeader` is built from it** (user ruling
  2026-09-03: *"sectionText could be seen as THE BASE and we could use it in many
  different ways, such as pageheader … much like ContentText is used in
  ContentCards, but not directly"*). 0.174.0 put the two components in one
  package; this makes them one implementation. `PageHeader` hand-rolled its own
  eyebrow / title / sub-line — the same block `SectionText` already drew for
  seven section organisms — so the duplication the move was filed against
  survived one level down. It is now a thin composition.
  **`SectionText` gains two seams** for it: `actionsPlacement="inline"` puts the
  cluster on the BODY's first baseline in one flex row (the only way to reach
  that baseline rather than the headline's), contributing no height via a
  zero-height centred box; and `style` reaches the root, which `slotStyle` could
  not, for a composition that owns its own rhythm.
  Verified in a render: the block measures **102px with and without an actions
  cluster** — the no-height ruling that made this risky is intact — with the
  margin, the title role, the eyebrow voice and both registers unchanged.

## 0.174.0 — 2026-09-03

- **`PageHeader` moves here from `kol-shell`, and gains `register`**
  (page-header-one-masthead, kol-client-olina; user: *"these are serving the same
  purpose, why aren't they the same component different variants?"*). The page
  masthead was built two ways — `PageHeader` on app pages, a hand-assembled
  `SectionText` on kolkrabbi.io's `/prints` and `/work`, the latter carrying a
  comment about reproducing the former "in its wrapper verbatim". The cause was
  the package: `kol-shell` is the app-shell tier, so a SITE with no shell could
  not take the masthead without installing the whole package for one header. The
  rest of that page's stack — `ContentFilters`, `ContentCollection`,
  `ContentCard`, `SectionText` — was already here, so this reunites it.
  **`register`** is the one prop, and the registers differ in the sub-line only:
  `app` (default, `kol-mono-14` — no existing page moves) and `site`
  (`kol-sans-body-01`, what `/prints` builds by hand). Title roles, sizes and the
  actions baseline are shared, which is what made this one component and not two.
  **Breaks ARCHITECTURE §3 deliberately, on the user's ruling** — §3 is corrected
  in place, and it also wrongly claimed `ContentFilters` for kol-shell, which has
  never been true.

## 0.173.0 — 2026-09-03

- **`SectionSplit textAlign`** (section-split-fill-text-align, kol-client-olina;
  user: *"same placement but just aligned to left … can the text align left and
  everything else kinda stays as is?"*). `align` places the block, `textAlign`
  rags the type inside it. `fill` hardcoded `align="center"` on its `SectionText`
  plus `justify-center` on the actions and meta rows, so a consumer reached in
  with `innerClassName="[&_.kol-section-text]:items-start …"`.
  **Forwarded in BOTH forms, not just `fill`** — a prop that silently does
  nothing in the default form is a seam wired to nothing. Unset, each form keeps
  exactly what it did: `fill` centres, bounded follows `align`. Verified in a
  render: `fill` with `textAlign="start"` leaves the block at 365×160 @ x138,
  byte-identical to the default, and moves only the headline (233 → 138).

## 0.172.0 — 2026-09-03

- **`SectionSplit fill` — the media fills its half** (section-split-fill-variant,
  kol-client-olina). `SectionSplitMediaBounded` (2026-08-27) binds the media
  frame to the height rung minus the padding and caps its width at the ratio —
  the right rule for a card with media, the wrong one for a half. `fill` releases
  it: the media column drops the ratio, the bounded height, the radius and the
  section padding and covers its half edge to edge, with the text centred beside
  it; below 901px the media stacks on top at `min-h-[50vh]`. `align` still picks
  the side. This is the layout `SectionHero variant="split"` draws, without the
  hero's overlay / glass panel / carousel machinery or its name — a consumer had
  hand-authored a second copy of it because putting a hero under an About section
  was not acceptable. Verified in a render: at 1200 the media is exactly half
  (600×750, flush at x=0, no ratio, no radius); at 390 it is full width, on top,
  and at least half the viewport tall. The bounded form is byte-identical.

## 0.171.0 — 2026-09-03

- **`CloseButton` — the X is a component now** (user: *"why are you making
  individual changes, this is a button component yes or no"*). It was: yes, and
  that was the fault. "Close" was four props retyped at five call sites, so they
  drifted into three sizes and two variants — `ShellDrawer` at `md` plus a
  hand-rolled `<button>` with an 18px icon for its start-side close, `TabsRow` a
  hand-rolled `<button>` with a 12px icon and its own hover, and workshop's
  `ShellLayout` still shipping `variant="outline" quiet`, the boxed treatment the
  2026-09-01 one-idiom ruling retired. The ruling was written down and then
  re-typed wrong three times. All five now render `CloseButton`.
  **`states={false}`** swaps the Button base for `IconFrame` (user: *"sometimes
  you dont want states"*) — identical drawing, no hover, no press, no focus wash,
  which is the distinction IconFrame exists for. Verified in a render: both bases
  give 22/26/32/40 boxes with 12/16/20/24 glyphs, transparent at rest.
  Lives in `utilities/` — an X alone on a canvas means nothing, and it is the one
  folder a utility, a molecule and a package shell can all import.

## 0.170.0 — 2026-09-03

- **The close X sits on the row's rung — one idiom, one size** (user, on the
  settings drawer: *"does this button follow the size ladder?"*). It did not.
  `ShellDrawer`'s close was pinned `md` (32) while every control in the panel
  under it — switches, dropdowns, the reset frame — is `sm` (26), so the one
  control that is not a setting was the largest thing on the surface.
  `ShellDrawer` takes **`closeSize`**, defaulting to `sm`; `FullscreenOverlay`'s
  close (the media lightbox X) takes `sm` too, because it took Button's `md`
  default and two sizes for one idiom is what the single-close-idiom ruling
  exists to stop. Pairs with 0.168.0, which removed the `iconSize={14}` that had
  the glyph floating in an oversized box.

## 0.169.0 — 2026-09-03

- **One bucket gets no bucket level** (one-bucket-consumer, kol-client-olina).
  `MediaLibraryBrowse`'s virtual root was unconditional: column 0 the app title,
  column 1 one row per bucket, column 2 the folders — so a single-bucket
  consumer crossed two levels that each named the only thing they could name.
  With `buckets.length <= 1` the virtual root collapses to the empty string,
  which makes every `slice(VROOT.length)` a no-op and leaves column 0 as the
  bucket's own folders; `onPrefix` skips the segment split. Verified in a real
  render: one bucket draws 1 column (`brand` · `projects`), three still draw 3.
  Multi-bucket browse is byte-identical.

## 0.168.0 — 2026-09-03

- **The settings drawer gets its scrim back** (settings-drawer-has-no-surface,
  kol-client-olina). `SettingsPanel` passed `backdrop={false}`, so the settings
  drawer was the one drawer in the system with no dimming. The panel paints
  `bg-surface-primary` — the same token as the page — so the scrim was the only
  thing separating them: with it off the drawer was invisible on a dark page and
  the controls floated in the right third of the screen. One prop removed; it now
  takes the same 48 % scrim every other drawer takes. No surface token changed.

## 0.167.0 — 2026-09-03

- **`useGrabEdge` takes an axis and its own tuning.** `axis: 'x'|'y'` says which
  way the pill travels (the proximity test is always the other one), and
  `near`/`sleep`/`travel`/`stick`/`range` are all options so a whole constant set
  spreads in with nothing silently dropped. `NavRail` is unchanged — every
  default is `GRAB`.

- **`GRAB_COLUMN`** (`utilities/motion.js`) — the ColumnBrowser handles' own
  feel, ruled in kol-r2b2 and not the rail's: a 2.8s chase on a 30px retarget
  and no bipolar band, so the pill tracks the pointer down the edge instead of
  landing and holding. `near`/`sleep` stay shared.

- **`ShellDrawer`'s close is a normal icon button** (user: *"it should just be
  like a normal button with a close icon, its not new?"*). It carried
  `iconSize={14}` — kept in 2026-08-01 to preserve the glyph size the hand-rolled
  button before it happened to have — so a 32px box sat around a glyph six under
  its size's own. No override: the size sets both.

## 0.166.0 — 2026-09-02

- **`useGrabEdge` takes an `axis`** (BrowsePageRulingsAndSeams, kol-r2b2
  2026-09-02; pairs with kol-theme 0.131.0). A rail has one vertical edge;
  `ColumnBrowser` has a vertical handle per column and a horizontal one along
  its foot, and the user ruled they wear the same gesture — so the hook grew an
  axis rather than the estate growing a second implementation. `axis` is which
  way the pill TRAVELS and the proximity test is always the other one:
  `'y'` (default, unchanged for `NavRail`) wakes on x and writes
  `--kol-rail-grab-y`; `'x'` wakes on y and writes the new `--kol-rail-grab-x`.
  `ColumnBrowser`'s `ResizeHandle` is the second consumer — note its handles are
  named for what they RESIZE, so the `x` handle passes `axis: 'y'`.

## 0.165.0 — 2026-09-02

- **`settingsFooter` — the seam that ends a MutationObserver**
  (BrowsePageRulingsAndSeams, kol-r2b2 2026-09-02). `SettingsPanel` takes a
  `footer` slot and documents it, but `MediaLibraryPages` hardcoded
  `footer={<SettingsFooter onReset />}`, so a consumer wanting one more control
  in that footer had no way in. kol-r2b2's workaround was a `MutationObserver`
  on `document.body` watching for `[aria-label="Reset to defaults"]` and a
  `createPortal` into that element's parent — a copy string in a
  `querySelector`, watching the whole document, to place one button.
  `MediaLibraryBrowse` and `MediaLibraryLibrary` now take `settingsFooter`,
  forwarded through `MediaSettings` to `SettingsFooter`'s new **`children`**
  slot: the node rides the SAME row, before reset, and reset survives. The row
  gained `gap-2` (user 2026-08-28) — `flex justify-end` with no gap is right
  for one control and wrong for two; the chip and the reset icon touched.

- **The ColumnBrowser row stops drawing its own divider** (same ticket; pairs
  with kol-theme 0.130.0). `Row` no longer emits `border-b last:border-b-0
  only:border-b` or its inline `borderColor` — the row is a rounded pill on a
  4px inset now, and a hairline under a rounded fill draws the box the pill is
  not. The shape lives in the theme with the fill rather than as utilities
  racing it (ARCHITECTURE §5). This supersedes the `only:` hairline half of
  ColumnBrowserChromeCorrections (2026-08-28), by the same repo's later ruling;
  every column still keeps its right edge, which is the half that stands.

## 0.164.0 — 2026-09-02

- **`ContentFilters trailingActions` have the narrow rung too** (found holding
  the showcase to the full-consumption law: brand's icons gallery, now THE
  showcase icons page, puts its ground + guide cluster in this slot, and at 390
  the 223px cluster scrolled `main` sideways). `trailingPlacement` — `auto`
  (default) rides the header from `md` and takes its own line under the
  divider below it — full width, wrapping; `header` / `below` pin it. The same rung
  `viewPlacement` (0.163.0) and LIST / GRID have. Desktop unchanged.
- **The open search takes the row below `md`.** `SearchInput expanding`'s
  200px pill beside the title at 390 scrolled `main` sideways; while searching
  the title and its divider step aside and the glyph group grows to the row,
  so the pill fits and the title returns on close. Desktop unchanged.

## 0.163.0 — 2026-09-02

- **`ContentFilters`' view strip has a narrow rung** (ContentFiltersViewStripOverflow,
  kol-mirror 2026-09-02). RECENT / SAVED — and mirror's five Library views — sat
  in the header row at every width with nothing that wrapped, scrolled or
  re-placed it: five views at 390 were 440px in a 390px page, two off-screen
  and unreachable. `viewPlacement` — `auto` (default) rides the header from
  `md` and takes its OWN line under the divider below it, full width and
  wrapping; `header` always the header; `below` always its own line. The same
  family and rung LIST / GRID already had. Two views at desktop render exactly
  as before.

## 0.162.0 — 2026-09-02

- **`ContentCard actions` sit bottom-right on the catalog card again**
  (ContentCardActionsInsetShorthand, kol-monitor 2026-09-02; user: *"very bad
  placement"*). The inset read the plate's pad as one value for `top` /
  `bottom` / `right`, and `catalog`'s pad is the two-value shorthand `sm md` —
  invalid for a single side, so all three dropped and the slot landed at its
  static position, under the copy at the left. The inset now splits the pad:
  block from the first value, inline from the second (or the same one). Every
  single-value variant renders exactly as before.

## 0.161.0 — 2026-09-02

- **`Stepper layout="inline"` — `‹ value ›` on one line** (StepperInlineVariant,
  kol-monitor 2026-09-02; the other half of the rack Selector's collapse onto
  Stepper — user on the A/B: *"wasn't it laid out horizontal? ‹ 00 ›"*). The
  chevrons flank the value as left/right hit targets, the value is centred in
  a 3ch floor so the row does not jitter as it steps, and there is no
  `.kol-control` field chrome — inline text on the panel. Value `fg-64`,
  chevrons `fg-40`, type from the size ladder, casing the caller's. Works for
  `options` and the number range alike; `onChange` unchanged. Default
  `stacked` renders exactly as before.

## 0.160.0 — 2026-09-01

- **`size="xs"` on the rest of the ladder** (user ruling 2026-09-01 — one
  ladder, every family): `Textarea`, `SearchInput`, `SegmentedToggle`,
  `ToggleSwitch`, `Badge`, `Tag`, `IconFrame` (glyph 12 through the SOLO
  ladder). Pairs with kol-theme 0.127.0. Defaults unchanged.
- **The dropdown list follows the trigger's rung** (DropdownXsList,
  kol-monitor 2026-09-01). At `xs` the open list kept `sm` rows —
  `kol-helper-12` in a 32px pitch — inside a panel fused to an 8px-type
  trigger, so the options truncated. `MenuDropdownItem` takes `size` and
  `Dropdown` passes its own: at xs the rows are `kol-helper-8` in a 20px pitch
  with the `INDICATOR.xs` check, and the panel's max-height reads the 20px
  row. The panel stays the trigger's exact width — the 2026-08-09 one-piece
  ruling — because with rows on the rung there is nothing left to truncate.

## 0.159.0 — 2026-09-01

- **`size="xs"` on `Input`, `Dropdown`, `Stepper`, `Button`** (ControlsXsRung,
  kol-monitor 2026-09-01) — `kol-mono-8` in the theme's 22px xs shell; the
  glyph ladders gain xs (SOLO 12 · ADJACENT 10 · INDICATOR 8), Stepper's chevron
  6, Input's height pin `h-3`. Defaults unchanged; Dropdown stays sm.
- **`Input onCommit`** — `(trimmed) => void` on blur / Enter, Escape restores:
  the field keeps a local draft seeded from `value`; `onChange` still fires
  live if given. The rack commits a module name or a scope expression, not
  every keystroke.
- **`Stepper options`** — step through a list instead of a number range: the
  field is read-only, the chevrons wrap at both ends, and `onChange` reports
  the option in the number path's event shape, `{ target: { value } }`. The
  rack's ‹ value › Selector as a variant of Stepper on the ladder (user:
  *"selector could be a variant of ours if we make it follow the size
  ladder"*).

## 0.158.0 — 2026-09-01

- **Card tags read as chips again** (CardTagsNoVisibleFill, kol-website
  2026-09-01; user, twice: *"but the tags are without background? why?"*).
  `ContentText` drew every tag as `tertiary` — surface-primary fill, no border
  — which is invisible on every card that sits on surface-primary, i.e. all of
  them; the variant was minted for the filled `/work` row and the fill was
  never the point there. `ContentText` takes `tagVariant` (default `primary`,
  the soft ink wash), and `ContentCard` / `ContentRow` derive it from the BOX:
  a solid surface fill (`--kol-surface-*`) keeps `tertiary` — the row it was
  ruled for — and everything else takes `primary`. Both expose `tagVariant` to
  override.
- **The newsletter form is on `ButtonGroup`'s gap ladder**
  (NewsletterFormGapOffLadder, kol-website 2026-09-01; user: *"the gap between
  input and button in newsletter should be the same as button group"*). Was
  `gap-4 sm:gap-3` — inverted against the group's `gap-2 sm:gap-4` in both
  directions; now the same pair. The form's `pt-6` went too: the section text
  already spaces its children by `gap-6`, so the form sat 48 under the body
  where every other section's actions sit 24.

## 0.157.0 — 2026-09-01

- **`SectionNewsletter submitVariant`** (SectionNewsletterSubmitVariant,
  kol-website 2026-09-01; user: *"subscribe below input should be white
  there"*). The submit was a hardcoded `primary` — the page's second surface —
  so on an inverse band (`/stack`'s `bg-fg-absolute-16`, dark in both themes)
  it was a dark block on a dark band and read as disabled. A prop, default
  `primary` so nothing moves; the consumer on the dark band passes
  `secondary`, the ink-on-page inversion that already exists. Landed the way
  `controlSize` did, not as a background read — the organism does not know
  which backgrounds are dark.

## 0.156.0 — 2026-09-01

- **The expanded `ContentCard`'s 50/50 split stacks below `md`**
  (ContentCardExpandedSplitStacks, kol-mirror 2026-09-01). Side by side at 390
  a 350px expanded card gave each half 174px and the prose 126, and one
  module's specs ran 1177px tall. Below `md` the halves stack — media on top at
  its own ratio (the variant's, `3/2` if it has none), `expandedContent` full
  width under it; from `md` the row is exactly as before. The 50% basis is a
  `md:flex-[0_0_50%]` class now, not an inline style — an inline flex-basis
  has no breakpoint. The unexpanded card, the `MISSING` placeholder and
  `AssetPlaceholder` are untouched. No `media={false}` — the stack is the fix
  that helps every consumer; the placeholder policy for an absent image stays
  the catalog's.

## 0.155.0 — 2026-09-01

- **`ProfileCard`'s shelf gets its seams** (user ruling 2026-09-01 — *"is it
  dark in light mode? are there light/dark or color variants on the shelf?
  variant on toggle? variant on logo? padding?"*), each on a mechanism the DS
  already has. `shelfTheme` (`inverse` · `light` · `dark`) is the section
  family's `theme` stamp on the shelf — every token inside follows, the logo's
  ink through `currentColor`, and `inverse` tracks the toggle. `shelfBackground`
  is the section `background` prop — a named surface or a raw token; with a
  theme stamped the default paint is that theme's `primary`, without one it
  stays `inverse` with inverse ink, exactly as 0.154 shipped. `controlVariant`
  passes straight to the disclosure's `IconFrame`. `pad` (`sm` · `md` · `lg`)
  is `ContentCard`'s — one step on `--kol-pad-card-*`, overriding the size
  ramp's padding. The logo stays a slot. Nothing moves for a call that passes
  none of them.

## 0.154.1 — 2026-09-01

- **`ProfileCard`'s `logo` slot sizes a wrapped svg.** The slot sized `[&>svg]`
  only, so a brand `Asset` (which wraps its svg) rendered unsized and the site
  had to re-add `[&>svg]:h-full [&>svg]:w-auto` on the node it passed. The slot
  now sizes whatever it is handed — `[&>*]:h-full [&_svg]:h-full [&_svg]:w-auto`
  — so `logo={<Asset name="kol-lockup-vert" />}` is the whole call.

## 0.154.0 — 2026-09-01

- **`ProfileCard` — the digital namecard, promoted from kol-website's `/studio`**
  (ProfileCard, kol-website 2026-09-01; carried class-for-class). A square photo
  with a disclosure on it and a `bg-surface-inverse` shelf — logo slot, name,
  mailto, a rack of socials — under it (vertical, the card grows) or beside it
  (horizontal, the card holds its square and the photo crops — the 2026-08-27
  ruling). **The shelf sizes to its content**: the source's fixed `h-*` box
  clipped every vertical size's rack on a phone (lg needed 204 inside 176, sm
  140 inside 96); the open state now animates `grid-template-rows: 0fr → 1fr`
  and the browser measures. Horizontal is `grid-template-columns: 0 → 224px`,
  one number where the source carried three. **Scale and width are separate**
  — `size` (xl · lg · md · sm) drives the ramp and caps the width, the card is
  `w-full` inside it, so a caller's `w-full` no longer fights a second width
  utility. **The disclosure is a button, not `ToggleSwitch`** — ruling applied,
  not minted: `aria-expanded` + `aria-controls`, `plus` closed / `minus` open;
  over media it is `IconFrame secondary radius="full"` (the bare `nav` glyph
  was measured invisible on the photo — page ink on a dark picture), on a
  surface the bare `nav` idiom is the same ruling with no frame. `variant="lg-h"` aliases `size="lg"
  orientation="horizontal"`; `open` / `defaultOpen` / `onOpenChange` is the
  controlled seam the source lacked. Brand content is the consumer's — `logo`
  is a slot, `name` / `email` / `socials` are props with no defaults.

## 0.153.0 — 2026-09-01

- **`ShellDrawer side="bottom"` — the phone's sheet** (ShellDrawerBottomSide,
  kol-mirror 2026-09-01; kol-monitor's mobile plan asked the same question).
  Full viewport width, slides up from `+100%` on Y, takes `height` where the
  sides take `width`, and pads its foot by `env(safe-area-inset-bottom)` so the
  last row clears the home bar. Everything the sides already do comes with it —
  portal, scrim-as-button, Escape, body-scroll lock, focus trap and return, the
  reduced-motion gate. **One detent**: open or closed. A collapsed bar that
  grows on tap is a second height the consumer owns (mirror's 56px → 68dvh) —
  the sheet does not carry it, and says so in its docstring rather than
  half-build it. No drag-to-dismiss (not asked; a tap is the proven gesture).
  Sides unchanged.

## 0.152.0 — 2026-09-01

- **FullscreenOverlay's close X is the bare `nav` glyph** — one close idiom for
  the estate (user ruling): the boxed `outline` treatment was a second design
  one tap away from the drawer trigger's bare glyph. Positioned on the sheet's
  content edge by kol-theme 0.120.0. (FullscreenOverlayCloseIdiom, kol-chess)

## 0.151.0 — 2026-09-01

- **`LabeledControl inline` takes `labelWidth="auto"`** — flips which cell
  yields: the label flexes and truncates, the control hugs its content (and
  clips at the column edge rather than painting over a neighbour). The fixed
  default serves a settings page's aligned label column; `auto` is for a row
  living in a column narrower than the label default. `SettingsRow` forwards
  it. (SettingsShortcutsComboOverflow, kol-monitor)

## 0.150.1 — 2026-09-01

- **Fixes 0.150.0, which did not build for ANY barrel consumer.** The
  `useGrabEdge` move to `src/hooks/` kept its relative `./motion.js` import
  while `motion.js` stayed in `utilities/` — the barrel re-exports the broken
  file, so every app on the barrel failed resolution at build. One line:
  `../utilities/motion.js`. 0.150.0 is deprecated on the registry. Caught by
  kol-monitor before any other consumer bumped. (ComponentUseGrabEdgeSubpath
  follow-up)

## 0.150.0 — 2026-09-01

- **An array-valued ContentText slot never renders as concatenated text.** React
  writes an array of strings as adjacent text nodes and CSS folds contiguous text
  into ONE anonymous flex item — so `tags={['vcap','plugin',…]}` rendered as
  `vcappluginchrome…` in system sans, first thing under the thumbnail. Strings in
  the `tags` slot now render as the tertiary `Tag` chip (pre-built elements pass
  through untouched); any other slot's array (`meta={[date, readingTime]}`) gets
  one span per item on a flex seam. (ContentTextTagsSlotRendersRawArray, kol-website)
- **The overlay scrim is a `<button>`, not a div** — in ShellSearchOverlay AND
  ShellDrawer, the same line in both. iOS Safari does not bubble tap-clicks from
  non-interactive elements, so the div's `onClick` never fired on a phone and the
  only way out of search was the close control the user did not find. The button
  also ends the other half: an interactive target carrying `aria-hidden`.
  (OverlayScrimTapDismiss, kol-website)
- **SearchInput's `bare` plan wears the `kol-control--bare` marker**, so the
  theme's coarse-pointer 16px floor reaches the overlay palette's field. Sweep of
  text-entry inputs outside both shells found one more site — QuadrantSync's two
  number inputs (desktop inspector, left as is, noted). (OverlaySearchFieldZoomsIOS,
  kol-website; needs kol-theme 0.117.0)
- **ContentFilters' two desktop-constant gaps get mobile rungs.** Title seam:
  `gap-3 md:gap-6` + `pr-2 md:pr-4` — same frame-air balance the
  ContentFiltersTitleGap ruling wanted (12+8 both sides), half the spend; it was
  40px of a 390px viewport on one divider. Facet columns: `gap-8 md:gap-16` on
  both rows — 64px between CATEGORY and YEAR left two columns ~160px each.
  (ContentFiltersMobileGaps, kol-website)
- **The showcase row is a FIXED 168 rung below the md container** (`heightSm`,
  `.kol-row--fixed-sm`) — the floor above it, unchanged. Content grew the row
  62px past its floor on a phone and the 136px thumb stranded at the top; the
  user's ruling is the constraint: the row's height is a function of the image,
  content fits inside it. 168 is the floor's own number, so this is a change of
  KIND, not value; tags go single-row below md so the cut lands on the chips.
  `minHeight` still overrides. (ContentRowShowcaseImageDrivenHeight, kol-website;
  needs kol-theme 0.117.0)
- **SectionNewsletter joins the family's `py-16 md:py-24` rung** — the flat
  `py-24` left 96px of empty band under the Subscribe button at 390, a fifth of
  the card; SectionFaq and SectionSplit already carried 16/24. Desktop unmoved.
  (SectionNewsletterMobileFoot, kol-website)
- **The split's bounded-frame height stops at the stack.** `rung − 2×py` is a
  two-column ruling; below 901px the text sits ABOVE the media and the same calc
  handed the frame the rung's arithmetic leftover — 117px at a 700-tall phone —
  and `overflow-hidden` clipped a 350px card to a letterbox strip, reported as a
  ProfileCard crop. Stacked: `w-full` + ratio, width decides, media never clips.
  ≥901px nothing moves. (SectionSplitVisualHeightRemainder, kol-website)
- **`useGrabEdge` moved to `src/hooks/`**, where a hook lives and where the
  `./hooks/*` wildcard already resolves `.js` — the deep path is
  `@kolkrabbi/kol-component/hooks/useGrabEdge` now. It sat in `utilities/` where
  the wildcard resolves `.jsx` only, so the documented deep import threw
  ERR_MODULE_NOT_FOUND. Barrel import unchanged; no consumer imported the old
  deep path (it never worked). (ComponentUseGrabEdgeSubpath, kol-monitor)

## 0.149.0 — 2026-09-01

- **A content grid can no longer demand a column wider than its container.**
  `min` and `listMin` emit `minmax(min(<value>, 100%), 1fr)`; a bare fixed track
  demanded its width whatever the container was, so a 352px minimum in a 302px
  column made the nearest `overflow-x` ancestor scroll sideways while the page
  itself never overflowed — which is why it was reported as a broken gutter.
  Identical above the breakpoint, collapses to the container below it.
  (ContentGridMinColumnWidth, kol-website)
- **`fullBleed` belongs to the section family now.** One literal in
  `sectionBleed.js`, used by `SectionHero` · `SectionSplit` · `SectionNewsletter`
  and added to `SectionCards` · `SectionCta` · `SectionFaq`. Any of them can be a
  filled surface, and a filled surface inside `.kol-page` has its colour clipped
  by the gutter on mobile — a filled-section problem, reported once per organism
  until the prop was shared. Viewport-relative, so unlike `.kol-full-bleed` it
  does not over-bleed in a parent with no gutter. Default `false` everywhere:
  nothing renders differently until it is passed. (SectionFamilyFullBleed,
  kol-website)
- **`useInViewAttention` — the card set's in-view attention state, shared.**
  Every card expressed attention as `:hover`, and a touch device cannot hold
  hover on an anchor that navigates on tap, so the whole hover vocabulary was
  dead on a phone. `TiltBento` solved it for one component in 0.145.0; the
  second could not have it, so a consumer was carrying the same observer to do
  the same job. Now exported, TiltBento uses it, and `SectionCardItem` stamps
  `data-attention` — added to the SAME theme rule the hover uses, so the two
  resolve to one treatment rather than parallel sets that drift.
  `coarseReveal="static"` opts out on both. Fine pointers never change.
  (CardSetInViewAttention, kol-website)

## 0.148.0 — 2026-08-31

- **`ContentCollection cols` is a CEILING now, not a command**, and takes a floor.
  It emitted `grid-cols-N` and took N columns whatever they measured, which is how
  a WIDER screen came to clip MORE text: a roster ran 1 column at 350 on a phone
  and 2 columns at 324 at 768. The rungs publish `--kol-wall-cols` and one static
  template turns it into "at most N, and never narrower than the floor" —
  `repeat(auto-fill, minmax(min(100%, max(floor, (100% - (N-1)·gap)/N)), 1fr))`.
  All CSS: no measurement, no observer, and it works inside the container query
  the wall already establishes.
- **`minCol` defaults to `min` (320px)** so the count path and the fluid path share
  one ruled minimum, and raising `min` raises both. NOT the 360 the filer's
  measurements argue for: that number is about a ROW two truncated lines tall and
  this floor governs every kind, so 360 would be a new estate-wide law made from
  one page's evidence. 320 is the width this DS already ruled and lived with. A
  wall whose content needs more says so — `minCol="360px"`.
- ⚠️ **This does change existing renders** — but only walls that were drawing
  tracks under 320px, which the DS's own `min` default already calls too narrow.
  (ContentCollectionMinColumnWidth, kol-chess)

## 0.147.0 — 2026-08-31

- **`ButtonGroup`'s gap is responsive**: `gap-2` stacked, `sm:gap-4` as a row. One
  fixed 16 was doing two different jobs — horizontal separation between two
  side-by-side buttons and vertical separation between two full-width stacked
  ones — and those do not want the same number. Nothing moves at `sm` and up.
  (ButtonGroupResponsiveGap, kol-website)
- **`SectionCardItem zoom`** (and `feature.zoom` through `SectionCards`) publishes
  `--kol-card-feature-zoom`. The hover amount belongs to the ARTWORK, not the
  component: 1.03 reads correctly on a dense photographic visual and is invisible
  on sparse line-art, and one set can hold both. 1.03 stays the default.
  (CardFeatureZoomScale, kol-website)
- **`SectionNewsletter fullBleed`** — the FILL breaks the page gutter while the
  content keeps it. The card is a filled surface inside `.kol-page`, so the gutter
  clipped its background and left strips of page down both sides of the colour;
  fill and content padding are the same box, so a consumer could not bleed one
  without dragging the other out. The breakout literal is `SectionHero`'s,
  character for character — two organisms in one family must not invent two ways
  to leave a gutter. (SectionNewsletterFullBleed, kol-website)

## 0.146.0 — 2026-08-31

- **`ContentRow variant="roster"`** — the pickable row: a filled tile
  (`surface-secondary`, hover `fg-04`), no border and no divider, 8px padding, a
  40px square `fg-04` thumb, 8px gap, and two truncated lines
  (`kol-mono-14`/`fg-96` over `kol-mono-12`/`fg-48`).
- **The row height is FIXED at 56 and the content fills it.** Every other row in
  the family follows its content, which on a grid of pick-targets reads as
  broken — the filer measured 34 → 40 → 50 → 58 across four passes, and one long
  meta line was enough to push a tile out of line with its neighbours. New
  `kol-row--fixed` + `--kol-row-h`; `minHeight` still overrides the number, what
  it cannot do is let the copy move it.
- `file` was the nearest part and a different object — a bare ruled line with a
  48px thumb, a divider and no hover by the 2026-08-29 ruling. Right for a file
  listing, wrong for things you choose between.
- Written as literals in every name-keyed map (BOX · STYLES · ORDER · FILL ·
  GAPS) rather than derived from `showcase`: a spread cannot reach those maps,
  and a derive that misses one is the trap `showcaseCanvas` fell into twice.
- Row only. No `ContentCard` counterpart — kol-chess did not want one, and a
  variant nobody asked for is a shape to keep in step for nothing.
  (ContentRowRosterVariant, kol-chess)

## 0.145.0 — 2026-08-31

- **`SectionCardItem`'s media box can no longer resolve to zero height.** It was
  `flex-1` — `flex: 1 1 0%`, basis ZERO — so with no ratio its height was donated
  entirely by the parent, and where no ancestor supplied one the card silently
  dropped to title + subtitle: no broken image, no failed request. Now
  `flex-auto` plus a `3/2` default, which is the geometry those cards already
  rendered at. (CardFeatureVisualCollapses, kol-website)
- **`SectionSplit`'s media fills its column.** `w-auto` derived the width from
  the image's aspect against whatever height the box got, so on a SHORT viewport
  it resolved narrower than the column and centred — media visibly inset while
  the copy stayed at the gutter. It is viewport HEIGHT that decides, which is why
  844-tall tests passed and real phones at 660–720 failed.
  (SectionSplitVisualWidth, kol-website)
- **`SectionNewsletter` gains `controlSize`**, forwarded to both the email Input
  and the submit Button, default `md` — the pair was hardcoded with no seam, so
  a page setting `size="lg"` everywhere else could not match it.
  (SectionNewsletterControlSize, kol-website)
- **`SectionNewsletter` gets an inset floor and a shorter default rung.** Desktop's
  80px inset is the leftover of the inner measure, so it scaled to ZERO rather
  than down and the field ran edge to edge at 390; `px-5` is a floor the band
  owns and desktop does not move. `height` defaults 60 → **40**: at rung 60 the
  band reserved 422px around 308px of content on an 844-tall phone. The family
  ladder is untouched — pass `height="60"` to keep the old air.
  (SectionNewsletterMobileMeasure, kol-website)
- **`TiltBento` reveals the CENTRED card on a coarse pointer** instead of opening
  every card at once. An IntersectionObserver on the viewport's middle band means
  one card open at a time — what hover gives a mouse — with the rest at
  title-only. `coarseReveal="static"` restores the old behaviour for a wall of
  small tiles. The fine-pointer path does not move.
  (TiltBentoCoarseRevealInView, kol-website)

## 0.144.0 — 2026-08-31

- **BREAKING — `MediaBrowser` is gone.** It was a deprecated alias of
  `MediaLibrary variant="page"`, kept since 2026-08-01 so consumers could
  switch on their own time. Thirty days passed, the retirements gate found
  nobody importing it anywhere in the estate, and the row is now deleted from
  `04-retirements.md`. Swap the import for `MediaLibrary variant="page"`;
  `MediaPicker` is untouched.

## 0.130.0 — 2026-08-29

- **`QuadrantSync` — dev chrome for agreeing on WHICH element is being
  discussed before anyone edits it.** Born from a real failure: ten messages to
  move one button, none of them wrong about CSS, all of them about different
  elements. Name a node with `data-handle` on a div that already exists, grid it
  in fractional cells, and read one sync line — `StageModuleGroup @ 1440w · e8 →
  h7` — that both sides restate before any code changes. The grid lands on the
  node the **user** named and is never redirected to a child or a parent; the
  owner is reported, never substituted, because a grab-handle that moves a whole
  group lives at group level. A cell is a fraction of the named element, so a
  coordinate survives a reflow where a pixel offset does not; divisions are set
  per axis and `square` is one-shot, since recomputing on every reflow would
  silently change what a coordinate means. Reports the owner's layout mode and
  what it makes reachable rather than implying a diff that cannot work, and
  flags `@kolkrabbi/*` ownership at selection time. Dev-only by default
  (`enabled` is false when `NODE_ENV === 'production'`).

## 0.68.1 — 2026-08-26

**CodeBlock wraps — as the code surface law always said it did.**
`06-code-surface.md` rules the Block `pre-wrap + overflow-x: auto`, and three
declarations agreed (`.kol-codeblock`, `customStyle`, `wrapLongLines`) — but
oneDark's `code[class*="language-"]` carries `whiteSpace: 'pre'`, and
react-syntax-highlighter spreads the theme's code style AFTER its own
`wrapLongLines` value, so the `<code>` computed `pre` and every long line
scrolled inside the frame instead (measured on `/stack/vcap` at 393: block
359 wide, content 465–759 — CodeBlockMobileOverflow, kol-website 2026-08-25).
The override now states `pre-wrap` where it is decided. Visible on desktop
too: a line longer than the block wraps instead of scrolling — the ruled
behaviour, not a new one. Each line is also stamped `.kol-codeblock-line` so
kol-theme 0.50.2 can reserve the copy control's lane on the first line of a
chipless block.

## 0.68.0 — 2026-08-15

**Every card and row on one ink ladder, one hover rule, one zoom rule.**

The ladder — three roles, and exactly one `emphasis` per block:

| role       | what it is                                        |
| ---------- | ------------------------------------------------- |
| `emphasis` | THE THING YOU CAME FOR — one per block, never two |
| `body`     | what identifies it — the title, the type          |
| `meta`     | metadata — the year, the count, the file size     |

Roles, never raw `fg-*` opacities or `oq-*` rungs: a role is the only thing
that survives a theme flip and a consumer's own palette.

Fixed by measuring all 12 ramps rather than reading them:

- **`print` had NO emphasis at all** — nothing in the block led. Its row also
  disagreed with `catalog` about its own type while rendering AS catalog.
- **`article` had three `body` fields competing** — the kicker and the read
  time are metadata, not a second body voice.
- **`typeface` had TWO full inks in both forms** — the specimen AND the name.
  The specimen is what you came to look at, so the name steps down.
- **The `work` drawer** stepped its own ladder on the inverse surface.

State:

- **The article ROW had no hover of any kind** — the only row in the family you
  could point at and get nothing back. It has no surface, so it takes the
  lightest step there is.
- **Rows zoom their thumbs** where the thumb IS the subject (article · work),
  never on a 48px file chip or a between-header with no media.
- `article` and `work` CARDS take no surface hover deliberately: article's
  media frame steps its border, and work's entire hover is the drawer rising.
- **Row thumbs fill the row's height**, width pinned to `--kol-row-thumb`.
  Pinning the width is what stops the runaway — an earlier cut freed it and let
  `aspect-ratio` fall back to the image's intrinsic size.

Verified in the browser across 6 rows and 18 cards: 0 without a state,
0 with more than one emphasis.

## 0.67.0 — 2026-08-15

- **`ContentMedia` gains `fillHeight`** — size from the height, width follows
  the ratio. Every ROW wants this: a thumb sized off the row's own height keeps
  the row's rhythm.
- **`ContentRow` thumbs stretch**, for every variant (user ruling 2026-08-15).
- **A trailing `stack` left-aligns.** A column reads DOWN, so its labels need
  one left edge; right-aligned, `Client` / `Collection` / `Typeface` gave the
  column a ragged edge on the side the eye scans.

## 0.66.0 — 2026-08-15

- **`Divider` vertical is CENTRED and sized to what it separates.** It
  hardcoded `self-stretch` ahead of `className`, so it always filled the flex
  line — a row whose height comes from 32px icon buttons gave a rule taller
  than the 18px type beside it, and any `self-*` a call site passed lost to the
  hardcoded one. Now `self-center` with an explicit `height` (16, overridable).
  Measured: 16px rule in a 32px row, 8/8, offset 0.
- `ContentFilters` strip rest returns to `oq-48` (hover `oq-64`) — `oq-64` read
  as too present for an unselected item. The count moves with it.
- The title is `kol-helper-14` uppercase: it is part of the header STRIP, and
  helper is the single-line ramp that strip runs on. Ramp and casing stay
  separate props so a consumer with wrapping titles can take `kol-mono-14`
  without losing the casing.

## 0.65.0 — 2026-08-15

- **`SearchInput`'s glyph waits for the collapse.** It remounted the instant
  `isOpen` flipped, putting a search icon inside a 200px pill that was still
  shrinking around it — the one frame of the animation that looks like a bug.
  It now lands at 520ms, just under the 600ms width transition, so it arrives
  with the pill rather than riding it down. Opening still hides it immediately:
  the field should take the space at once.
- **`ContentFilters`' title is `kol-mono-14`, uppercase.** Mono because the
  title is a NAME that can run long, and `kol-helper-*` is line-height-1 chrome
  carrying 500 weight and 0.06em tracking it should not inherit. Uppercase
  because it is still part of the header strip. Two knobs, set independently —
  which is why they are two props.

## 0.64.0 — 2026-08-15

- **`ContentFilters`' glyph pair is 16-in-32** — the house's quiet-control
  pairing, which `.kol-copy-btn` had already settled: an 8px pad around a `sm`
  16px glyph gives a 32 box. A 20 glyph fills a 32 square far harder, which is
  why that row read too intense. The square stays `md`; only the glyph steps
  down, via `iconSize`.

**The rule this run established:** the square and the glyph are SEPARATE
decisions. They were welded to one `size` prop, so matching any shipped surface
required a wrong number somewhere — `/work` is 36/16, the filter row is 32/16,
the media control is 32/20. None of those is a ladder rung pair, and all three
are correct.

## 0.63.0 — 2026-08-15

- **The count joins the strip it sits on** — `kol-helper-12 text-oq-48`, the
  same rung and rest ink as LIST/GRID. It wore `text-fg-64`: a translucent
  value on neither the active nor the rest rung, reading as a third state that
  means nothing. It is static information, so it takes rest.
- 24px between the count and the strip, was 16 — at 16 they read as one run of
  text rather than a label beside a control.
- **The title goes back to SENTENCE CASE**, reversing the uppercase pass. The
  strips are chrome and wear caps; the title is a NAME, and names keep their
  own casing. The difference is the point.
- `SearchInput`'s trigger hover border softens `oq-16` → `oq-08`.

## 0.62.0 — 2026-08-15

**`SearchInput` gains `iconSize` and `fieldHeight` — and both exist because the
DS could not otherwise reproduce a design it already ships.**

`/work`'s chrome (`WorkViewToggle`) is **36px boxes with 20px glyphs**
throughout: the toggle is `h-9`, the sliding pill is `h-9`, the close button is
`w-9 h-9`, every option icon is 20. That is not a rung pair the SOLO ladder can
express — `lg` is a 36 square but a **24** glyph.

- **`iconSize`** — px override for the glyph only, the square never moves with
  it. The same seam `IconFrame` has carried since the 2026-07-28 law.
- **`fieldHeight`** — the open field's height, defaulting to the square.
  `/work`'s pill is `h-9` open AND closed; 0.61.0 derived it as `square - 4`,
  which served `ContentFilters` (a field beside two bare glyphs read chunky at
  the full square) and silently made the `/work` pill 4px shorter than the
  toggle beside it. Deriving one surface's ruling into a shared default is how
  that happens.
- `ContentFilters` asks for `fieldHeight={28}` explicitly.

## 0.61.0 — 2026-08-15

**`ContentFilters` header + `SearchInput`, ruled live.**

- **The count sits BESIDE LIST/GRID**, not stacked above it — one strip of
  chrome reading left to right.
- **`SearchInput`'s open field is a rung shorter than its trigger.** The square
  is the click target and it is invisible at rest, so the pill never had to
  inherit its height; at 32 it read as a chunky input beside two bare glyphs.
- **Escape and click-away close it.** Neither was wired — a field you can only
  close by emptying it and blurring is a trap. The listeners exist only while
  it is open.

- **The title matches RECENT/SAVED** — same rung, same casing, same tracking.
  It sits at the other end of the same row; a different treatment read as two
  unrelated things rather than one strip of chrome.
- **The rest ink was TOO DARK.** `fg-32` is a third of the ink and read as
  DISABLED rather than unselected — the same complaint `IconFrame`'s `nav`
  variant already settled. Rest is the ghost rung `oq-48`, active `oq-96`, both
  on the opaque tier.
- **The filter toggle never paints a container.** It was swapping to `primary`
  while the panel was open, putting a filled box in a row that has none and
  saying the same thing the open panel already says. `nav` always.
- **`SearchInput` drops its glyph once open.** The caret is the affordance;
  the magnifier was spending the widest part of the pill restating what the
  blinking cursor says, and pushing the query off its own left edge.

## 0.60.0 — 2026-08-15

**`SearchInput` ran two type systems and two glyph systems inside one
component.** The chromed path typed on `kol-mono-*` while the expanding path
typed on `kol-helper-*`; the chromed path drew a FLAT 14px glyph at every size
(`{ sm: 14, md: 14 }` — a size table that does not size) while the expanding
path read the SOLO ladder. The same component rendered two different fields
depending on which branch you hit.

- **One type system**: the mono ramp. A search field holds a query that can
  wrap, and `kol-helper-*` is line-height-1 chrome.
- **Both glyph ladders, correctly split** — this component genuinely has both
  cases and they are the exact split `glyphLadders.js` exists for. **SOLO**
  (16/20/24) for the collapsed `expanding` trigger, a glyph alone in a pinned
  square. **ADJACENT** (14/16/18) for the leading glyph inside an open field,
  sitting in the input's line box beside the query. The old flat 14 was the
  ADJACENT sm rung frozen for both sizes — right ladder, no size.
- **The square follows `size`**: sm 28 · md 32 · lg 36. It hardcoded 36 (lg),
  so an expanding search sat beside a `kol-btn-md` filter at two different
  sizes.
- Ink moves to the opaque tier and the collapsed pill is bare — the fill
  belongs to the field, not the trigger.

Cuts in use after this: navbar (`ShellHeader`) md chromed · toolbar
(`RecordManager`) sm chromed at `w-56` · overlay (`ShellSearchOverlay`) bare ·
`ContentFilters` expanding md.

## 0.59.0 — 2026-08-15

**Header-row audit — every finding, not one at a time.**

- **Icons come off the translucent tier.** `SearchInput`'s glyph was
  `text-fg-80`; a translucent stroke stacks alpha where it self-overlaps, so
  the glyph muddied at its own joins while the opaque glyph beside it stayed
  clean. Icons take `oq-*` (user ruling 2026-08-15). Its hover border moves too.
- **The filter toggle is an `IconFrame`, not a `kol-btn` with its chrome
  cancelled inline.** It wore `kol-btn-md kol-btn-icon` and then removed the
  background, border and colour by inline style — the whole button paid for and
  thrown away, leaving the control with NO states while the search beside it
  had hover. It now rests at `nav` (oq-64) and goes `primary` while the panel
  is open, so the toggle finally shows that it is on.
- **`SearchInput`'s square follows the ladder and follows `size`.** It
  hardcoded 36 — the LG square — so an expanding search sat beside a
  `kol-btn-md` filter at two different sizes. sm 28 · md 32 · lg 36, glyph
  moving with it.
- **One vertical rhythm** for the block: 12 header→divider, 12 divider→strip,
  24 strip→content. It was four independent literals (`mb-4`, `mb-4`, `pb-4`,
  `mt-8`) that spaced the divider equally from both sides, so it read as a
  free-floating line instead of the header's own baseline.

## 0.58.0 — 2026-08-15

- **`SearchInput expanding` is BARE at rest.** The fill belongs to the field,
  not the trigger: `bg-fg-04` was unconditional, so a collapsed search rendered
  as a filled circle beside a bare filter glyph and the pair read as two
  different kinds of control. The fill now arrives with the field.
- Its glyph goes 16 → 20 — a 36px trigger is the `md` square and takes the
  solo ladder's md rung, the same correction the header glyphs got.

## 0.57.1 — 2026-08-15

- **LIST/GRID is visible again with filters closed.** 0.57.0 moved the strip
  below the divider into a row gated on `isExpanded`, so the only way to change
  the view was to open filters first — a state nobody would guess at. The row
  now renders whenever it has anything to show; the groups and the count stay
  tied to the panel, the strip does not.

## 0.57.0 — 2026-08-15

**`ContentFilters` stops hand-rolling a search field.**

- The header search is now `SearchInput expanding` — the DS component, FULLY
  ROUND, the same pill the nav shelf serves. The organism had its own
  `rounded-sm` box with its own width animation, its own `<input>`, its own
  Escape and blur handling and its own focus ref: a second search field the DS
  could not see, in a different shape from every other surface. Open state stays
  in the organism because the filter row reads it; `SearchInput` takes it
  controlled.
- **`layoutPlacement`** — the two arrangements kol-monitor and kol-website each
  settled on, made interchangeable. `'below'` (default) puts RECENT/SAVED in the
  header and LIST/GRID under the divider beside the count, which is monitor's
  shape; `'header'` rides LIST/GRID in the header row instead. "N of N" is under
  the divider in both — it reports what the filters did, so it lives with them.

## 0.56.0 — 2026-08-15

- **`ContentFilters` filter groups take `stack`.** A group either STACKS its
  values in its own narrow column or WRAPS them across the room it is given —
  both shapes are live on kol-website's `/work`, where a short closed set like
  Type reads as a column you scan down while ~45 tags must wrap or run off the
  page. One shape for both meant the short group ate a full row it did not
  need. Wrapping groups now take `flex-1`; the chip gap tightens 4 → 2.

## 0.55.0 — 2026-08-15

**`ContentFilters` header row.**

- **The count and LIST/GRID move ABOVE the divider**, into the header row.
  This reverses the earlier "one row below the divider" cut, and settles the
  defect that cut was fighting for good: a strip cannot be pushed down the page
  by an expanding filter group if it is not in the same row as one. Below the
  divider now holds the filter GROUPS and nothing else.
- **"N of N" renders only while the filter panel is open.** Unfiltered it
  always read "12 of 12", a number that has never told anyone anything; it
  earns its place the moment a filter can change it.
- **Both header glyphs go from 16px to 20px** — they were on the `sm` rung
  inside `md` 32px boxes, which is the exact hand-transcription
  `hooks/glyphLadders.js` exists to stop. They read `glyphSize('md', true)` now
  instead of a literal.

## 0.54.0 — 2026-08-15

- `ContentCollection` reads `--kol-gap-wall-grid` / `--kol-gap-wall-list`
  (kol-theme 0.47.0) instead of carrying 24 and 8 as JS literals. Passing a
  number still wins, for a consumer that genuinely differs from the house.

## 0.53.0 — 2026-08-15

- **`ContentCollection`'s track minimum is PX, not rem** (user ruling
  2026-08-15). Default `min` 20rem → **320px**. A track width is a LAYOUT
  measure, not type: rem ties it to the root font-size, so a user bumping their
  browser text size silently re-counts the columns of every wall in the estate.

## 0.52.0 — 2026-08-15

- **`ContentMedia` gains `zoom`** — hover-zoom on the artwork, on by default
  for the image-led variants (`print` · `article` · `work`) and off where the
  media is a diagram or a 48px thumb chip. `ContentRow` now carries `group` so
  a row's thumb can take it too.
- `ContentRow`'s divider moves to `.kol-row--divided` (kol-theme 0.46.0) —
  it was being overridden by the row's own border-color shorthand and
  rendering white.

## 0.51.0 — 2026-08-15

- `SearchInput` and `ContentFilters`' search box move onto kol-theme's
  `.kol-expand` / `.kol-expand-content` instead of hand-writing the same
  transition inline. No inline easing left in either.

## 0.50.0 — 2026-08-15

- **`ContentCollection`'s list form is ONE full-width column.** 0.48.0 made it a
  multi-column wall of rows on the reading that "layout always wraps in a grid";
  the grid part was right and the rest was not. A list is one entry per line —
  kol-website's `/work` listing is exactly that, and so is every listing anyone
  has built. kol-monitor's `repeat(4, 1fr)` is a dense file-browser cut, now
  opt-in via `listMin` rather than the default.

## 0.49.0 — 2026-08-15

- **`ContentCollection` gap defaults PER FORM** — grid 24, list 8, the values
  every shipped consumer re-typed as a ternary at its own call site. A single
  default meant that ternary survived the migration, which is half the
  duplication the component exists to remove. Pass `gap` only to differ.

## 0.48.0 — 2026-08-15

**`ContentCollection`: both forms are grids, and neither forces a count.**

- `list` is no longer a flex column. It is the SAME wall with wider tracks
  (`listMin`, 30rem default) — which is what every shipped consumer already
  did (`repeat(4, 1fr)` list / `repeat(6, 1fr)` grid). User call: _"layout
  always wraps the items in a grid, at least 99% of the time"_.
- `min` defaults to **20rem**, the card-wall law's minimum
  (`01-foundations/05-layout-systems.md`), up from an invented 12rem.
- The count still derives from the wall's own width via `auto-fill` +
  `minmax()`, never a fixed track count: _"the shell rails eat width that
  viewport breakpoints can't see, so a forced count compresses every card"_
  (user call 2026-08-09). The shipped `repeat(6, 1fr)` is that disease.

## 0.47.1 — 2026-08-15

- `ContentText` drops the `['line', …]` render kind. `default.row` was its only
  caller and moved to a group when the date went below the title; its fixed
  96/80px trailing columns had already been dropped in favour of hugging
  content, so the branch rendered nothing anyone asked for.

## 0.47.0 — 2026-08-15

**The five remaining card variants, ruled live and built.** `default` closed in
the previous wave; `catalog` · `print` · `article` · `work` · `typeface` were
reviewed against the SHIPPED components and the live pages they render on.

- **`ContentMedia`** — `fit` (cover | natural | compact, GridCard's previewFit
  under the family's name) and THREE separate edge treatments, because the
  shipped components use three: `frame` (tint + border, article's card media),
  `border` (border only, WorkListItem's thumb), `bg` (tint only, ListingCard's
  row thumb), plus `ring` (inset hairline OVER the artwork, print). They were
  one prop, which painted a tint on two components that never had one.
- **`ContentText`** — a `tags` slot, a `clamp` prop on the body, and a
  RECURSIVE renderer: an entry inside a line may itself be an entry, so
  `['stack', 'detail', 'date']` sits inside a `between`. typeface's row needed a
  two-line trailing column, which a flat slot list cannot express — it had been
  collapsing `classification` and `year` into one slot and losing a value.
  In a `between`, the leading part flexes and the trailing one hugs.
- **`ContentCard`** — a `drawer` layout for `work`: image-only at rest, an
  opaque inverse plate revealed on hover, absolute so it never reflows a shelf,
  and permanently visible where there is no hover. `typeface` takes a fixed
  500px height rather than a ratio — a ratio re-crops a specimen at every
  column width.
- **THE ROOT FOLLOWS THE AFFORDANCE, family-wide** — `href` renders a real
  `<a>` with `onNavigate` as the SPA seam; `onClick` alone keeps the semantic
  element but gains `role="button"`, `tabIndex` and Enter/Space. Every shipped
  variant was a click handler on a div: unfocusable, absent from a screen
  reader's link list, dead to middle-click.
- **Hover is a real state** — per-variant steps published as
  `--kol-content-hover-bg` / `--kol-content-hover-border`. Rest colours moved
  from inline styles onto custom properties, because an inline `background` or
  `borderColor` outranks any class and the hover rules could never win. No card
  or row hover had ever fired.
- **Responsive row/plate steps** via `--kol-row-*-md` / `--kol-plate-pad-md`,
  swapped by one media query at the ruled `md` rung.
- `work`'s row is `justify-between` and `self-stretch`, so its big line sits on
  the floor level with the thumb — `h-full` cannot do this against a box that
  carries only `min-height`.

## 0.46.0 — 2026-08-15

**The content-card system** — six components, built to the live-review rulings
(`docs/documentation/03-components/06-content-card-system.md` §3).

- **`ContentText`** — the ruled type ramp per variant (`default` · `catalog` ·
  `print` · `article` · `work` · `typeface`) and form (card/row). Title is the
  only slot that steps between forms, size only, one family; every slot's
  class is a prop seam (TG-font consumers swap the class, defaults render the
  ruled values).
- **`ContentMedia`** — the media slot; ratio is the only knob, no children →
  `AssetPlaceholder` at the same ratio.
- **`ContentCard` / `ContentRow`** — the two forms, one box each. Card padding
  steps by `size` via the new `--kol-pad-card-*` tokens; row Y padding is a
  prop (was hardcoded in MediaRow).
- **`ContentItem`** — the `layout === 'list' ? row : card` switch the estate
  hand-wrote nine times, as one prop.
- **`ContentCollection`** — the grid/list container; owns the enter stagger on
  the house curve. Form switch re-mounts (no FLIP yet).

Needs `kol-theme` ≥ 0.43.0 (`--kol-pad-card-*`, `--kol-ease-house`,
`.kol-sans-display-03`, `.kol-collection-item`). Not published with this entry.

**Also in this version — the kol-fxr ticket batch** (separate work riding the
same unpublished bump):

- **`Section` gains `divided`** — the between-siblings hairline every inspector
  consumer was retyping locally. The rule lives on the adjacent pair, so the
  first section in a stack never carries a stray top border and no consumer
  needs `:not(:first-child)`. Filed as `InspectorSectionRhythm`; kol-fxr's
  `.kol-params-section` hook class dies on adopt.

  The ticket's second ask, a `density` prop, was **not** built: the consumer's
  local override is `gap: 0.5rem`, which is exactly Section's shipped `gap-2` —
  a no-op, so there is no second density to name until a real one appears.

- **`usePlaceholders()` + `<EmptyState gated>`** — one app-wide switch for
  placeholder / empty-state prose, defaulting **off**. Filed as
  `GatedEmptyState`, whose ruling is that the app should not narrate itself at
  a user who already knows what a surface does.

  The suppression is CSS (`.kol-placeholder`, kol-theme ≥ 0.43.0), not a render
  branch, so it covers a consumer's **own** prose the moment they add the
  class — not only `EmptyState`. `gated` is opt-in rather than the default
  because flipping it would silently blank every surface already shipping an
  `EmptyState`.

  The DS owns the preference and its persistence; **the consumer owns the
  keybind**. A design system that grabs a global key collides with every app
  that already used it — kol-fxr's own `H` is already `toggle-visibility` in
  its editor keymap, which is exactly that collision.

## 0.45.1 — 2026-08-15

`ContentFilters` — two look corrections on the user's verdict, seen rendering.

- **Header title down a step**, `kol-helper-16` → `kol-helper-14`. It was the
  only 16 on that row and read oversized beside the count and the RECENT/SAVED
  strip; 14 puts it in the row's own family.
- **Filter values are the grey filled chip**, `variant="secondary"` →
  `"primary"`. 0.45.0's outlined chip was the wrong read — `primary` is the
  16%-wash chip the surface wants, now declared rather than fallen through to.

## 0.45.0 — 2026-08-15

`ContentFilters` — three regressions from kol-monitor's live QA, all fixed by
diffing against monitor's ORIGINAL (`_tmp/2026-08-15-shell-adoption/`) instead of
reasoning from a description. ⚠️ **BREAKING (visual default flip).**

- **Group label uppercases in the component.** Consumers pass natural case
  ('Tags', 'Category'); the component transforms. Same justification `.kol-tag`
  already carries for values — the label is chrome, not authored copy, so there
  is no call site to author the casing at. Widens the no-`text-transform` law's
  documented exception by one element.
- **RECENT / SAVED is the same strip as LIST / GRID**, not `ViewToggle`: inline
  spans, `kol-helper-14`, uppercase + 1px tracking, `text-fg-96` active /
  `text-fg-32` rest. Monitor's original imports `ViewToggle` and never renders it
  for this. This replaces the filled-chip reading of the 2026-07-28 ruling **on
  this surface** — MediaLibrary, foundry and kol-website's typeface grid change
  with it, which is the intent: one look everywhere.
- **Filter/search icons back to `size={16}`** — 0.44.x shipped 20, visibly wrong
  beside the header type.

## 0.44.2 — 2026-08-15

`ContentFilters` — the filter row's real ink, read off the RENDER instead of a
default. 0.44.0/0.44.1 both got this wrong because the retired fork's defaults
were never what anyone looked at: kol-monitor overrode them at every call site.

- Category label (TAGS, TYPES, …) → `text-fg-96`, the same full opacity a
  selected layout item wears. Shipped as `fg-48` then `fg-32`; both wrong.
- Filter value ink → rest `text-fg-48`, selected `text-fg-96`, over the outlined
  `secondary` chip.

## 0.44.1 — 2026-08-15

- `ContentFilters` — the group label (TAGS, TYPES, …) wears the layout strip's
  exact text treatment: `kol-helper-12` at 1px tracking, `text-fg-32`. 0.44.0
  shipped it untracked at `text-fg-48`, which was a relayed opinion rather than
  the user's ruling — the label and the LIST/GRID items read as one family.

## 0.44.0 — 2026-08-15

**`ContentFilters` is the one filter organism again**, and it renders the layout
four kol-shell publishes spent the day converging on. ⚠️ **BREAKING (visual
default flip)** — existing consumers get the new layout on bump; no prop opts out.

`@kolkrabbi/kol-shell` 0.1.0 recreated this component without checking that it
already existed here, and every ruling from the day's QA was applied to that
duplicate. The rulings are real; the duplicate is retired (kol-shell 0.3.0).

- **The filter value is a `Tag` again — properly.** Three defects, all working
  around the atom rather than using it: `variant="default"` is not a declared
  variant, so `VARIANTS[v] ?? primary` silently rendered the FILLED chip where an
  outlined one was wanted (now `secondary`); the active state was hand-rolled with
  `border-fg-*` classes beside the atom's own `active` prop; and the click handler
  sat on a wrapper `<div>`, so `Tag` rendered a `<span>` and the interactive chip
  was not interactive. Casing comes from `.kol-tag` — the tier's one documented
  exception to the no-`text-transform` law — so consumers must NOT uppercase
  filter values themselves.
- **One row below the divider.** Filter groups are left-aligned columns, label
  above values, visible only while the filter toggle is open; the layout strip is
  right-aligned and ALWAYS visible. `items-start` pins the strip to the label row.
  It previously rendered in its own row _after_ the filter block, so expanding a
  group pushed it down the page — the defect that started the whole ticket.
- **`iconComponent`** — icon seam, the one genuine addition the fork had that this
  did not. Defaults to the DS `Icon`; needs `filter` + `search`.

`layoutOptions`, `defaultLayout`, `headerActions`, `showCountOnlyWhenFiltering`
and `searchKeys` were already here and did not need folding in.

> **Gap:** 0.6.0 → 0.38.0 shipped without entries (that history lives in the repo's
> session logs). Resumed 2026-08-14 — from here every publish adds an entry, and
> breaking or global-surface changes (token renames, default flips, new bare-element
> rules) are flagged **BREAKING**.

## 0.43.0

### Minor Changes

- **`AudioPlayer`** — the interactive audio atom. Audio was the one media kind
  the design system had nothing for, so every consumer hand-rolled a bare
  `<audio controls>` and inherited whatever the browser painted. The MediaLibrary
  widening (0.39.0) made audio objects _arrive_ — 116 sound files in
  `kol-vault-media` alone — and left minting the component as the open taxonomy
  call. It is an **atom**, beside `HlsVideo`.

  One native `<audio>` plus an optional label; no waveform, no scrubber of our
  own, no playlist, and no `compact` variant built speculatively. Layout is the
  call site's — the consumer source's `p-8`, `w-[420px]` and centring were all
  call-site concerns and none are baked in.

  **Read the HlsVideo contrast before touching either.** Same tier, same shape,
  **inverted intent**: HlsVideo is deliberately inert (`pointer-events: none`,
  `controls={false}`, the full hardening set) because it is decorative; this one
  exists to be operated, so none of that hardening crossed over and `controls`
  is not a prop. The native strip is UA-painted and not themeable past
  `color-scheme` — a branded transport would be a separate `AudioTransport`
  molecule built on this atom, not a variant of it.

## 0.42.0

### Minor Changes

- **`FeatureSplit` grew the section anatomy — the `SectionSplit` brief, answered
  without a second component.** The brief asked for a new `SectionSplit` (media
  slot beside kicker / heading / body / actions, with a flip) and named eleven
  hand-built kol-website sections as evidence. That anatomy already shipped here
  as `FeatureSplit`, and building a twin beside it would have been exactly the
  duplication the brief exists to end. Three additions instead:

  - **`flip`** — media first, text second. Implemented with `order`, not
    `flex-row-reverse`: the grid collapses to ONE column below 901px, where DOM
    order decides the stack, so a row reversal would have flipped the wide
    layout and left the narrow one still text-first.
  - **`titleSize`** — which type ROLE the heading wears: the `pull` default, or
    any `display-01…03` / `heading-01…05` rung.
  - **`mediaAspect`** (default `4/5`) and **`mediaHover`** — the zoom, matching
    CardFeatureItem's exactly (kol-theme 0.42.0).

  **The brief's named "core design question" — how per-site type classes thread
  through the text contract — is answered: they don't.** A consumer picks a role
  and the component emits exactly one type class. Threading `kol-sans-heading-01`
  in alongside `.kol-feature-split-pull` would put two equal-specificity rules on
  one element and let sheet load order pick the winner: the failure ARCHITECTURE
  §5 records, and the 2026-07-30 law that a component's type lives in its own
  rule. The `*ClassName` seams stay, for layout.

  The text-only degenerate case (the /CONNECT band) already worked — `media` is
  optional and the column simply does not render.

## 0.41.0

### Minor Changes

- **`FeaturedCarousel` reconciled with kol-website's fork** (231L there vs 259L
  here, 458 diff lines). They were never a fork — **two different engines.** The
  fork ran framer-motion `AnimatePresence` over an index, which means it had **no
  drag at all**; this one runs embla. So the canon call went to the engine here,
  and with it the `{ media }` descriptor, `OverlayGlassPanel`, and the autoplay
  progress ring. Five capabilities crossed the other way:

  - **`children`** — a static overlay pinned over the stage that does _not_
    travel with the slides.
  - **`fullWidth`** — drop the section's own vertical padding.
  - **`rounded`** — turn the frame border and radius off.
  - **`showTitle` / `showDescription` / `showCta`** — visibility toggles, global
    with per-item override, beside the existing per-item class overrides
    (`descriptionClassName` added for symmetry).
  - **`subtitle`** — the small line between title and description.
  - **`navPosition='header'`** — prev/next in the header row beside the counter
    instead of under the viewport.

  **Deliberately not carried:** the foundry title coupling (a size ramp keyed on
  the literal strings `'Málrómur'` / `'Tröllatunga'`, plus a per-typeface inline
  `fontFamily`), `kol-label-mono-xs` (a deleted legacy family), and the hidden
  block that eagerly preloaded _every_ slide image — embla plus `loading="eager"`
  on the visible slide covers that without fetching a whole gallery up front.

- **`EmblaNav`** — THE prev/next pair, exported. Three components hand-wrote the
  same `.kol-embla-btn border border-fg-16 …` string with their own aria labels,
  and two of them used the literal text glyphs `‹` and `›` **as arrows, in a
  design system that ships a chevron icon set**. That is exactly why the
  consumer built its own `CarouselNavigation` — it wanted real icons. The markup
  is one component now, used by `Carousel` and `FeaturedCarousel`; `MediaViewer`
  keeps its own chips deliberately (absolutely positioned over an inverse-tier
  scrim — a different control). Pairs with kol-framework 0.20.1.

## 0.40.0

### Minor Changes

- **`Avatar` takes a photo.** `src` (plus `alt`) renders an image at the atom's
  own size geometry; without it, nothing changes — the initials disc as before.
  A broken `src` falls back to the initial rather than a torn-image glyph.

  Found by the ArticleHeader reconciliation: kol-website's local twin
  hand-rolled `<img className="w-12 h-12 rounded-full object-cover">` beside a
  grey-circle fallback, because the atom did initials only. Fixed in the atom
  rather than in the consumer of the week — a caller writing its own `w-`/`h-`
  pair is how a fifth avatar size gets invented. The atom still resolves no
  URLs; the consumer hands over a resolved src.

## 0.39.0

### Minor Changes

- **MediaLibrary — `accept` widens instead of gating. BREAKING (default flip).**
  `accept='all'` — the default, and what every browsing consumer passes — used to
  mean "images OR videos". Measured against the live 3443-object `kolkrabbi`
  bucket it discarded 80 HLS playlists, 135 text/data files, 1 code file and 116
  audio objects before anything downstream could see them. `'all'` now means
  everything; a single kind still filters to that kind; and `accept` additionally
  accepts an allow-list — `accept={['image','video']}` — which is what a picker
  wants. **A page that relied on the old default now lists non-media objects;
  pass `['image','video']` to keep the previous behaviour.**

  Four rules come with it, each measured on that bucket by kol-r2b2 before filing:

  - **Kind by extension, not content type.** B2 and R2 return
    `application/octet-stream` for `.json`, `.pgn`, `.m3u8` and `.woff2`, so the
    header cannot be the primary signal. Kinds: image · video · audio · text ·
    code · playlist · font · archive · system · other.
  - **Resolution sets collapse.** `name-566/-1132/-1700/-2840.jpg` is one picture
    in four widths — 604 files became 197 cards, and the tile now loads the
    smallest variant (27 KB, not 718 KB) while download and Copy URL hand over
    the largest. Guards: images only, width ≥ 100, sets of ≥2.
  - **HLS segments fold per folder.** 2012 `segment_NNN.ts` files read as 2012
    videos; the real count on that bucket is 39. Each stream is one row carrying
    its segment count and total bytes.
  - **System files are hidden with a count.** 118 `.DS_Store` / `.bzEmpty`
    objects leave the grid, and the path bar says how many — hidden, never
    silently dropped.

  Also: video tiles use a sibling `<name>.png` as the real poster where one
  exists, so `preload="none"` still paints a frame instead of fetching the video
  to show frame one; non-paintable kinds get a kind glyph rather than an `<img>`
  pointed at a `.json`; the Kind filter group is derived from what the bucket
  actually holds instead of a hard-coded image/video/folder list; and the
  lightbox pages only image/video, indexed against that list (a search that
  narrowed the grid used to open the wrong file).

### Patch Changes

- **`"sideEffects": false`** added to the manifest. Without it bundlers must
  assume every module in the barrel has import side effects and none can be
  dropped: kol-shell 0.1.0's internal barrel imports took kol-monitor's main
  chunk from 1.09 MB to 6.7 MB (vite 8 production build, measured). Verified
  truthful — no module in `src/` imports CSS or otherwise runs on import; theme
  and framework already declare the same field. kol-monitor carries this as a
  pnpm patch today and can drop it.

## 0.6.0

### Minor Changes

- 8b4c850: Chrome law: every control references the Button — two variants (primary; outline = always secondary), button size scale (26/32/40). Old variant names are aliased, nothing breaks.

  - **Dropdown** — trigger now emits `kol-btn kol-btn-{primary|outline} kol-btn-{size}` (fills/hover/active/focus come from the button rules; inline-style chrome removed per the theme-CSS rule). Open state is fused: primary panel continues the trigger fill (no border, no gap, hairline divider inside), outline panel carries the trigger's border. Big per-size radii (14/22/24) replaced by `--kol-radius-sm`; type pairing corrected to mono 12/14/16; chevron sizes aligned to button icon sizes. Variant aliases: `default`→primary, `subtle`→primary, `minimal`→outline.
  - **Input** — `ghost` folds into `outline` (alias kept): one secondary treatment. `.kol-control--ghost` CSS retained but deprecated.
  - **Textarea** — resize is real now: the `resize-grip` icon (kol-icon-set-v1) is the actual drag handle (JS corner drag, both axes, min 120×40). Native `resize` stays off — Firefox's built-in grip can't be hidden any other way, so this is the only route to one identical grip in every browser. Previously a decorative icon sat over `resize: none` — an affordance that didn't exist.
  - **Input/control** — `.kol-control--outline` border moves `fg-16` → `oq-16` (opaque), matching the button outline.
  - **ToggleSwitch** — rewritten: **bare by default** (label + track, no box); `primary`/`outline` shell variants at exact button geometry; new `size` prop (sm/md/lg) scales shell and track; on-state = inverted ink (matches `.kol-btn-pressed`); focus ring added; the auto-uppercase label removed (no-auto-casing rule). Aliases: `plain`→bare, `default`→outline.

### Patch Changes

- 8b4c850: Button `selected` now renders. It emitted `.kol-btn-selected`, a class no CSS ever defined, so the prop was a visual no-op — every call site (tool-palette active tool, current tab, select-mode toggle) got no feedback. `selected` is now a legacy alias of `pressed`: both resolve to one toggle-on flag that drops `kol-btn-quiet` and renders through the existing `.kol-btn-pressed` fill (solid inverted ink). Dead `.kol-btn-selected` emission removed; `aria-pressed` output unchanged.
- 8b4c850: Slider collapsed to one bare row — the `minimal` look is now the only slider. The component mapped `variant="minimal"` (the dominant real usage) to `.control-slider-minimal`, a class no CSS defined, so those call sites rendered with no container layout and leaned on their parent to compensate. The `variant` prop is gone; every Slider now resolves to the bare `.control-slider` inline row (label · track · editable readout) and finally gets its intended layout. Bordered `default` and chip `subtle` variants removed. Passing a `variant` is a harmless no-op for back-compat.
- Updated dependencies [8b4c850]
  - @kolkrabbi/kol-icons@0.5.0

## 0.5.0

### Minor Changes

- d194686: `SegmentedToggle` sizes now mirror `Button` exactly. Each size shares the matching `.kol-btn-{sm,md,lg}` cell padding and mono type, so a segmented strip lines up with a Button of the same size:

  - `sm` — 26px, mono-12 (was 16px with no type — the old icon-only variant)
  - `md` — 32px, mono-14 (was 26px, mono-12 — the wrong-looking text)
  - `lg` — 40px, mono-16 (new)

  The fixed-height model is replaced by padding-driven height in kol-theme (`.kol-seg` hugs content; `.kol-seg--sm/--lg` set cell padding). Existing `sm`/`md` consumers will see the taller, correctly-typed sizes.

## 0.4.1

### Patch Changes

- 8448e47: Renamed the icon package `@kolkrabbi/kol-loader` → `@kolkrabbi/kol-icons`. The name now describes the domain (icons) rather than the load mechanism, matching the `theme`/`component`/`framework` convention. The public API is unchanged (`Icon`, `ICONS`, `ICON_ENTRIES`, `SOLID_ICON_ENTRIES`, `ICON_INDEX`, `ALL_ICONS`, `hasIcon`, `getCategory`).

  Consumers must update the import specifier and the Tailwind `@source` glob to `@kolkrabbi/kol-icons`. `component` and `framework` retarget their internal dependency to the new name (patch).

- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
  - @kolkrabbi/kol-icons@0.4.0

## 0.4.0

### Minor Changes

- 1394844: Merge QuantityStepper into QuantityInput (taxonomy audit, Phase 4). The two were near-identical (same responsive sizing, same `(value) => onChange` contract) and differed only in button layout. QuantityInput gains a `controls` prop:

  - `controls="chevron"` (default) — the existing look; value + a stacked up/down chevron pair. Existing QuantityInput call-sites are unaffected.
  - `controls="split"` — the former QuantityStepper: a `− value +` pill.

  **Breaking (0.x):** the `QuantityStepper` export is removed — replace `<QuantityStepper … />` with `<QuantityInput controls="split" … />`. There were no non-demo consumers.

### Patch Changes

- 1394844: MenuPopover cleanup — remove dead duplicate code. `MenuPopover.jsx` had shadowed a second `MenuItem` (a row) and a `MenuDivider` that were never barrel-exported (dead: no consumer could import them, and the barrel's `MenuItem` comes from `MenuItem.jsx`). Deleted both. `MenuPopover` remains a deprecated alias of `MenuItem` — compose its rows with the exported `MenuDropdownItem` / `MenuDropdownDivider` / `MenuDropdownNest`. No public API change; the alias is removed at the next major.

## 0.3.0

### Minor Changes

- d3b4398: Monorepo-batch P0 — shared primitives: `EmptyState`, `OverlayGlassPanel`, `Figure` atoms; `MediaViewer` organism (the one fullscreen paged viewer, composed on FullscreenOverlay); hooks `usePrefersReducedMotion` (DS-wide motion gate) and `useTilt` (the one tilt hook); `resolveCssVar`/`resolveCssColor`/`isLight` color utils. New peer deps on kol-component: `framer-motion`, `gsap`, `hls.js`. Theme: Figure caption chrome (`kol-prose-figure`, `kol-caption-*`).
- d3b4398: Monorepo-batch P1 — clean singles: atoms `AssetGrid`, `CurveOverlay`, `DocsToc`, `HlsVideo`, `PriceDisplay` (fixes the source's ignored-currency bug), `ProsePreview`, `RotaryDial`, `TypeSample`, `TypeSpecCard`; molecules `ShapeDropdown`, `SpecList`, `TabsRow`; organisms `ErrorBoundary`, `FeatureSplit`. Button gains additive `iconComponent` (icon-registry seam) and `pressed` (aria-pressed toggle) props. Theme: `.kol-btn-pressed`, type-kit sample/spec chrome, `.kol-feature-split-*`.
- d3b4398: Monorepo-batch P2 — shell set + framework reconciles: new `SearchInput` atom, `ShellDrawer` + `ShellSearchOverlay` molecules, `ShellHeader` framework chrome. Additive merges into existing framework components: `PortalFooter` (brand/columns/socials/note slots), `AppShell` (header/footer slots + `ShellTocContext`/`ShellTocCollapsedContext` + xl TOC rail), `SideNav` (onNavigate/controlled-collapse/collapsibleSections/isActive seams). `PageSection` verified already-equivalent — no change.
- d3b4398: Monorepo-batch P3 — layout/marketing organisms: `FullBleedHero` (hero-family base; StudioHero folded in as the video capability), `FramedMediaBand`, `CardFeatureItem` + `FeaturesCardSection`, `CtaGlobal`, `NewsletterBand`, `BentoCard` (useTilt + media sniffer), `FeaturedCarousel`.
- d3b4398: Monorepo-batch P4 — effects (all prefers-reduced-motion gated): `TiltCard`, `AnimatedTitle` (gsap ScrollTrigger), `TextPressure` (variable-font), `AsciiCursor`, `ColorLoader` + `LoaderOverlay`.
- d3b4398: Monorepo-batch P5 — color kit: `SpectrumControls` (HSV picker family — HueStrip/SBSquare/WheelTriangle + composed, useId'd SVG ids), `SwatchControls` (+ EyeDropper), `ColorInputRow` (merges ColorField + SwatchRow), `ColorRamp` (merges Ramp), `SpectrumGrid`. All color-doc widgets share the `resolveCssVar`/`isLight` utils.
- d3b4398: Monorepo-batch P6–P10 — five full-apparatus SETS + their member components (each set is a live page under `/sets/*` in the showcase):

  - **P6 stack (blog/CMS):** `ArticleCard` (default/hero/mini, 6 dupes → 1), `ArticleHeader`, `ImageBlock` + `VideoBlock` (on the Figure atom), `PortableTextRenderer`, `StackHero` (on FullBleedHero).
  - **P7 work (portfolio):** `WorkCard` (on TiltCard), `WorkListItem`, `WorkViewToggle`, `GalleryCarousel` (Carousel + MediaViewer), `ParallaxShelf`.
  - **P8 prints (store):** `ProductDetailLayout` (slot skeleton), `DiagonalMarqueeRiver`, `ScrollDriftGallery` (gsap, reduced-motion gated).
  - **P9 foundry (type specimen):** isolated under the new `@kolkrabbi/kol-component/foundry` subpath — `SpecimenSectionHeader`, `GlyphMetricsGrid` (opentype.js metrics), `VariableFontSection`, `TypefaceHero`, `TypefaceStyleSection`, `FontPreviewSection`, `FoundryCharacterSets` + `useAxisAnimation` hook. `opentype.js` added as an optional peer dep.
  - **P10 editor:** `Canvas` (1080-virtual coordinate contract), `SelectionOverlay`, `EditorShell`, `AlignmentGrid`.

## 0.2.0

### Minor Changes

- fa8ce05: New `CopyButton` atom — the copy-to-clipboard chip (clipboard icon + Copy/Copied swap, 1.8s reset, silent on blocked clipboard) extracted from CodeBlock's inline button so it's a logged atom before being lifted into composites. `CodeBlock` now nests it. Chip look lives in kol-theme (`.kol-copy-btn`); kol-framework's `.kol-codeblock-copy` slims to positioning only. Props: `text` (string or thunk), `label` (false = icon-only).
- c750436: Graphic: move the ~4.8 MB of raw illustration SVGs (several wrap embedded base64 rasters) behind a single dynamic `import()` (`graphicData.js`) — the same entry-chunk fix as kol-icons's Icon. The consumer's entry chunk no longer carries the graphic payload; it streams as its own async chunk. `GRAPHICS` (inventory) is now built from a keys-only glob and stays synchronous. Removes the dead `GRAPHIC_RAW` export (zero consumers; it forced the eager inline). On a cold first paint a graphic may render as a same-sized empty box for a frame.
- c750436: New molecules `MediaCard` + `MediaRow` — the grid tile and list row for one media object (recreated from kol-media-admin's lobby specs, same slot contract: thumb / name / actions + select mode with shift-range `onSelect`). Both share a passive `SelectIndicator` (deliberately not ToggleCheckbox — the card/row is the click target; a nested real checkbox double-fires). MediaRow column widths exposed as `dateWidth` / `sizeWidth` props.
- fa8ce05: Add `defaultOpen` to the open-state components — `Dropdown`, `DropdownTagFilter`, `MenuItem`, `MenuPopover`. Non-breaking; seeds the internal open state so panels can render expanded (docs previews, restored UI state).
- fa8ce05: Menu-family unification, step 1: `MenuPopover` is now a deprecated alias of `MenuItem` — the two triggers had identical APIs and duplicate implementations (hand-rolled fixed positioning vs floating-ui). One implementation remains (floating-ui: portal, auto-flip, scroll-tracking, focus management). Existing `MenuPopover` call-sites keep working; note the trigger now renders MenuItem's chrome (chevron) and the panel is portal-rendered. Migrate imports to `MenuItem`; the alias goes away in the next major.
- fa8ce05: `SegmentedToggle` renders its real chrome again in every consumer. The container/cell look moved out of Tailwind utility classes (which never generate from package sources — consumers saw jammed labels with no border) into `.kol-seg` / `.kol-seg-cell` in kol-theme's molecule CSS, including padded cells. A11y upgrade rides along: `radiogroup`/`radio` semantics with a roving tabindex, ←→/↑↓ arrow-key selection, and a `:focus-visible` outline; new optional `ariaLabel` prop names the group. `aria-pressed` is replaced by `aria-checked`.
- c750436: ViewToggle: new `iconVariant` prop ('stroke' default) — picks the icon cut for `variant="icon"`; solid glyphs read better at the toggle's 14px size.

### Patch Changes

- fa8ce05: `Input` is now controlled only when a `value` prop is passed. Previously every Input rendered controlled with `value ?? ''` — a prop-less usage (e.g. a search stub) froze on typing and fired React's value-without-onChange warning. Prop-less Inputs are now uncontrolled; controlled Inputs without an `onChange` render `readOnly` (deliberate display-only). Also fixes `Button` icon alignment: `iconLeft`/`iconRight` glyphs now render directly as flex items — the old wrapper spans (with -2px optical margins) sat glyphs on the span baseline instead of centering them against the label (fix ported from kol-client).
- fa8ce05: Internal taxonomy restructure — public exports unchanged. The `primitives` folder is dissolved (it was never part of the atomic system) and every component now sits in the tier the placement rules give it (docs/taxonomy/01-component-placement.md): Badge/Pill/Tag/Section/SectionLabel/SegmentedToggle/ToggleBracket/ViewToggle/LabeledControl/DropdownTagFilter/QuantityInput/QuantityStepper/Popover/AssetPlaceholder/ExitPreview/FullscreenOverlay → atoms; Slider/ColorSwatch/CodeBlock/Image/Accordion → molecules; Carousel/ContentFilters → organisms. Deep imports of source paths would break, but the package only supports root imports. `scripts/validate-taxonomy.mjs` now enforces the closed folder set, downward-only imports, and the molecule test.
- fa8ce05: Type-conformance sweep: freestyle Tailwind text sizing replaced with kol type classes throughout component source (rule: helper scale for single-line chrome, line-height-bearing sets for anything that wraps — see docs/typography/01-type-classes.md). Avatar initials now ride the helper scale (`xl` drops 30→20px, the largest helper stop); ToggleCheckbox/ToggleSwitch hints → `kol-helper-10`; Accordion chevron → `kol-helper-16`; SideNav collapse glyph → `kol-helper-14`; AssetPlaceholder note → `kol-helper-12`, its wrappable label → `kol-mono-12`.
- Updated dependencies [c750436]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
  - @kolkrabbi/kol-icons@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [de4c33f]
  - @kolkrabbi/kol-icons@0.2.0

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
- Updated dependencies [fcfa14c]
  - @kolkrabbi/kol-icons@0.1.1
