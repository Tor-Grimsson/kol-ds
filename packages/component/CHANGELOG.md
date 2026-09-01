# @kolkrabbi/kol-component

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
