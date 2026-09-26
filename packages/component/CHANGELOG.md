# @kolkrabbi/kol-component

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
