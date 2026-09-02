# @kolkrabbi/kol-theme


## 0.129.0 — 2026-09-02

- **An icon-only button is a fixed square — `.kol-btn-icon { flex: none }`**
  (IconButtonNoFlexShrink, kol-monitor 2026-09-02; user: *"the buttons are a
  mess, not the same size"*). In a shrink-to-fit flex row WebKit measured the
  icon-only button's contribution as its glyph (22px), not the 32px rule, so
  the row came out short and squeezed the square to 22×32 beside a 32px
  Dropdown. `flex: none` fixes the measurement and the shrink together;
  `flex-shrink: 0` alone fixed only the shrink. Chrome never showed it; the
  phone did.

## 0.128.0 — 2026-09-02

- **The rail's touch opener is the line, thicker** (RailGrabTapIsALine,
  kol-monitor 2026-09-02; pairs with kol-shell 0.39.0). `.kol-rail-grab-tap`
  and its disc are gone. Under `(pointer: coarse)` the strip widens to a 24px
  hit and its pill sits at rest at `0.25rem` — twice the fine-pointer pill,
  no proximity fade — the same affordance a fine pointer drags. Off a coarse
  pointer nothing changes.

## 0.127.0 — 2026-09-01

- **`xs` on every family that steps the ladder** (user ruling 2026-09-01:
  *"what kind of half ass DS ships partial sizes haphazardly throughout its
  system? obviously we apply xs as an option"*). 0.126.0 gave xs to the control
  and button shells only; the rest of the ladder now has the rung at the same
  density (8px mono, line 12): `.kol-icon-frame-xs` 20px square ·
  `.kol-tag--xs` 1×8 pad, 8px · `.kol-seg--xs` 22px, cells 4×8 ·
  `.kol-badge-xs` 16px, 0×4 pad, 8px · `.toggle-switch--xs` 4×8 pad with a
  12×8 track and a 4px thumb. Opt-in by prop everywhere; no default moves.

## 0.126.0 — 2026-09-01

- **The `xs` rung on the shell ladder** (ControlsXsRung, kol-monitor 2026-09-01;
  user: *"DS should ship xs size — I actually often find situations where xs
  would be helpful"*). `.kol-control-xs` and `.kol-btn-xs`: `kol-mono-8` (line
  12) + 4px vertical + the 1px ring = a 22px shell, 8px sides, `--kol-radius-xs`;
  the icon-only square is 20. The rung an instrument panel runs at, and the one reason the
  rack's field / select / stepper could not collapse onto the app atoms.
  Opt-in by prop only — the 2026-07-28 "dropdowns are sm at every viewport" law
  is untouched, nothing ramps to xs by viewport.

## 0.125.0 — 2026-09-01

- **The prose display steps ride the display ladder** (ProseTitleFixedSize,
  kol-website 2026-09-01). `.kol-prose-title` was a fixed 56px at every
  viewport — a real article title set to four lines at 390 and spent the fold
  before the first word of body — and its two siblings, `.kol-prose-display`
  (80) and `.kol-prose-display-md` (64), were fixed the same way: the only
  display steps in the theme with no rung. Each now reads the display token
  whose desktop value it already was — display-01, display-tight-01,
  display-02 — capped at that value with `min()`: below 768 they take the
  ladder's mobile step (56 · 48 · 44), from 768 up they are pixel-identical to
  before (the ladder's 1280 rung — 96 · 72 · 64 — is deliberately not taken; a
  prose title at 64 was never the design). Line-heights became ratios (1 ·
  1.0625 · 1.07) so the leading follows. `.kol-prose-lede` (24/28) is unchanged — it is
  not a display step and 24 is a phone lede; say the word if it should rung.

## 0.124.0 — 2026-09-01

- **`kol-components-controls.css` — the token layer for `@kolkrabbi/kol-controls`**
  (KolControlsPackage, kol-monitor 2026-09-01). In the umbrella after the shell
  pack; a `core` consumer imports it as a domain pack. kol-monitor's
  `monitor-overrides.css` values renamed `--monitor-*` → `--kol-ctl-*`, values as
  ruled: theme-invariant hardware caps derived from `--kol-color-ab-black` /
  `-white` (the `oq-ab` tiers flip and cannot carry them), the set's own LED
  emitters (deliberately not `--kol-palette-*`), the two jack roles as HEX
  (`JackSocket` appends a hex alpha). Nothing else in the theme moves.

## 0.123.0 — 2026-09-01

- **`.kol-rail-grab-tap` — the rail's tap opener on a coarse pointer**
  (ShellRailCollapsedWithTapOpen, kol-mirror 2026-09-01; pairs with kol-shell
  0.38.0). Under `(pointer: coarse)` the grab strip widens to 24px and shows a
  24px disc on the line (`surface-secondary`, `fg-16` ring, `oq-96` glyph); the
  proximity pill is hidden there, since nothing hovers. Off a coarse pointer
  the rule is `display: none` and the ruled grab is untouched. Also resets the
  strip's button chrome (it is a `<button>` from 0.38.0). Geometry here, the
  pill's motion stays in `kol-animation.css`.

## 0.122.0 — 2026-09-01

- **The fader works inside a scrolling sheet, and is a 44px target on a phone**
  (SliderCoarsePointerHeight, kol-mirror 2026-09-01). `.slider-black` gets
  `touch-action: pan-y` — `auto` let a scrolling container claim any drag a
  few degrees off horizontal, so the thumb never moved and the sheet scrolled;
  `pan-y` not `none`, so the vertical gesture still reaches the scroller. And
  under `(pointer: coarse)` the input AND its row lift 24 → 44 by the 24px
  rule's own argument: the 2px track is a pseudo the UA centres in the box, the
  thumb stays pinned to it, the drawing does not change. The row lifts with
  the input because `.control-slider` is a fixed 24px and a 44px input inside
  it would overflow; a consumer's `rowHeight` inline style still wins. Desk
  untouched. Not touched: `RotaryDial`, the dual-thumb rail (their own
  hit-testing stories — say the word).

## 0.121.0 — 2026-09-01

- **The rail drawer opens from the LEFT again** — off-canvas is `-100%`,
  reverting 0.120.0's `+100%`. The trigger stays fixed top-right in both states:
  the panel's side was never the complaint, the trigger travelling to mid-screen
  was, and a far-corner trigger has nothing to collide with on either side.
  (ShellDrawerSideCorrection, kol-chess; pairs with kol-shell 0.35.0)

## 0.120.1 — 2026-09-01

- **Fixes 0.120.0: the wrapping card lede is `.dash-lede`, not `.dash-subtitle`.**
  0.120.0 minted its new class over a name that already existed — the 16 → 22
  medium sub-heading — and the later duplicate downgraded three live call
  sites (stacked-bar values, alert titles) to 10px. The original
  `.dash-subtitle` is untouched again; the new voice is `.dash-lede`, same
  values as intended (dash-detail's 10 → 12 ramp, weight 400, line-height
  1.5). 0.120.0 is deprecated. Caught by kol-chess verifying the receipt
  against the shipped CSS. (DashDetailWrapsWithoutLeading follow-up)

## 0.120.0 — 2026-09-01

- **`.dash-subtitle` — the dashboards' WRAPPING secondary line.** `.dash-detail`
  is line-height 1, single-line chrome by the type protocol's fault line, and
  CardHeader was handing it full sentences that wrapped to three leading-less
  lines at 390. Same ramp and container step, `line-height: 1.5`; footers and
  labels keep `.dash-detail`. (DashDetailWrapsWithoutLeading, kol-chess;
  pairs with kol-dashboards 0.4.0)
- **`.kol-overlay-close` sits on the sheet's content edge** (`right: 0`) — the
  sheet hugs the consumer's panel, so the old spacing-3 inset floated the X
  12px inside the column's right edge, aligned with nothing the fields below
  establish. (FullscreenOverlayCloseIdiom, kol-chess)
- **The rail drawer opens from the RIGHT** — off-canvas +100%, trigger fixed
  top-right in both states, and the 2026-08-31 travel rule is gone: it was the
  cure for the left side, where the open X landed 65% of the way across the
  screen. (ShellDrawerOnRight, kol-chess; pairs with kol-shell 0.34.0)

## 0.119.0 — 2026-09-01

- **The chess pack stops referencing `--kol-font-family-heading`** — all 10
  heading rules speak `--kol-font-family-sans-narrow` by name. `heading` is a
  framework-tier brand seam (`kol-brand-color.css`) the theme never ships, so
  an app-shell consumer resolved it to nothing and every hero metric,
  board-playback title, analysis result and chart heading fell to the
  inherited body font. sans-narrow is the face the brand seam bound it to —
  same face where it worked, fixed where it did not. The framework seam itself
  is untouched. (ChessHeadingFontVarUndefined, kol-chess)


## 0.118.0 — 2026-09-01

- **`--kol-shell-page-pad` is responsive: `clamp(20px, 5vw, 48px)`.** Fixed 48
  put 96px of gutter on a 390 phone — 24.6% of the viewport — and set the
  Settings h1 ~35pt from the edge while every `.kol-page` sibling sat ~15pt.
  The floor is 20, the estate's `px-5` mobile floor; desktop does not move (5vw
  reaches 48 at 960). PageBleed's negative margin reads the same token, so the
  pair cannot drift. (ShellPagePadFixedOnMobile, kol-chess)


## 0.117.0 — 2026-09-01

- **The overlay scrim drops its 1px backdrop blur** — user ruling, and the class's
  own comment already argued the 60% tint is the separation; the blur bought a
  compositing layer on every overlay open, on a phone, for almost nothing on
  screen. All three scrim call sites wear the one class, so all three lose it
  together. (OverlayScrimBlur, kol-website)
- **The coarse-pointer 16px floor covers the chrome-less field.** `.kol-control--bare`
  is a MARKER class, no chrome of its own: SearchInput's `bare` body plan — the
  overlay palette's field — sat in a plain label outside both shells, computed
  14px on a phone, and iOS Safari zoomed the page on focus and never zoomed back;
  the first tap of a mobile review poisoned every width read after it. The floor
  now keys on every body plan the DS ships. (OverlaySearchFieldZoomsIOS, kol-website)
- **`.kol-row--fixed-sm` — a rung that is FIXED below the md container and the
  floor above it.** The showcase row's height is a function of the image (user
  ruling): thumb + padding, content fits inside. `overflow: hidden` here is the
  design, not silent loss — text truncates by ramp and the tags line goes
  single-row below md so the cut lands on the chips.
  (ContentRowShowcaseImageDrivenHeight, kol-website; pairs with kol-component 0.150.0)


## 0.116.0 — 2026-09-01

- The feature card's zoom fires on `[data-attention]` as well as `:hover` — one
  rule, not two parallel sets. On a phone the card is an anchor, so hover was
  never reachable and the zoom simply never fired. Reduced-motion opts out of
  both. (CardSetInViewAttention, kol-website)

## 0.115.0 — 2026-08-31

- **The drawer trigger rides the drawer's trailing edge when open.** Fixed at
  12/12 it sat INSIDE the drawer it opens — the drawer spans 0–240 from the same
  edge, so the close × was drawn on top of the rail's own logomark, both in the
  same 32px. Found on a physical iPhone by kol-chess (user: "menu is on the wrong
  side it overlaps close button when open"); it stayed clickable and the scrim and
  Escape both closed, so it read as "the close button is gone" rather than as a
  trap. One transform, no new markup, and the control stays where the thumb last
  touched it. (ShellRailNoDrawerOnMobile follow-up, kol-chess)

## 0.114.0 — 2026-08-31

- **The feature card's hover zoom reads `--kol-card-feature-zoom`**, falling back
  to the shipped `1.03`. It was hardcoded in `kol-animation.css` with no prop and
  no token, which made it unreachable for artwork that needs more.
  (CardFeatureZoomScale, kol-website)

## 0.113.0 — 2026-08-31

- **`.kol-row--fixed`** — `height` AND `min-height` from `--kol-row-h`, for
  `ContentRow variant="roster"`. Both properties on purpose: `height` alone loses
  to `.kol-row`'s `min-height` whenever the content is taller, which is exactly
  the case a fixed rung exists to stop. (ContentRowRosterVariant, kol-chess)

## 0.112.0 — 2026-08-31

- **Coarse pointers get a 16px text floor.** iOS Safari zooms the page whenever
  a focused text field computes under 16px and does not zoom back out on blur;
  the DS's `sm` (12) and `md` (14) rungs both trip it and `md` is the default,
  so every consumer with an input had it on every iPhone. `.kol-control input` /
  `textarea` and `.kol-expand input` take 16px under `(pointer: coarse)` only —
  pointer devices do not move. NOT a re-litigation of MobileTouchFloor: that
  ruling is about legibility, this is a platform behaviour keyed on the computed
  size of the focused field. (InputTypeScaleZoomsIOS, kol-website)
- **`AppShell touch="drawer"` chrome** — the off-canvas transform, the trigger
  and the scrim, keyed on `data-rail-drawer` rather than a media query: the fold
  width is a prop, so a query here would be a second source of truth for it.
  (ShellRailNoDrawerOnMobile, kol-chess)

## 0.52.1 — 2026-08-26

- `.kol-sidenav-group { padding: 4px 0 }` **retired** from kol-components-atoms.css
  (sidenav-nested-groups). The elder's group wrapper, dead since the 2026-08-09
  SideNav port stopped rendering groups; kol-framework 0.24.0 renders them
  again and owns the box in its own rule beside `.kol-sidenav-hop` /
  `.kol-sidenav-list`. Two rules on one name in two packages is the §5 failure —
  the showcase nests the framework import under the theme's `components` layer,
  so this rule outranked the framework's and the group sat at 0 indent there.

## 0.52.0 — 2026-08-26

**`data-theme` works on a subtree** (nested-theme-scope, from kol-studio). Every
token derived from a themed surface token is now declared on the theme
selectors — `:root, :is([data-theme="light"], .light), :is([data-theme="dark"], .dark)` —
not `:root` alone. A custom property resolves its `var()` where it is declared
and descendants inherit the frozen result, so a `<div data-theme="light">` in a
dark app flipped nothing at all (the light surfaces were `:root`-only) and a
dark pane in a light app flipped the surface but kept the root's ink — every
`--kol-fg-*` rung, every text role, the `oq` scale and `--kol-border-default`
stayed at the root's colour. No token value changes; four files, selector lists
only:

- `kol-base-tokens.css` — the light surface block: `:root, :is([data-theme="light"], .light)`
- `kol-opacity.css` — the fg ramp (all three tiers) and the eight roles
- `kol-opaque.css` — the oq ramp (both tiers)
- `kol-color.css` — `--kol-border-default`, `--kol-border-focus`,
  `--kol-focus-ring-quiet` moved out of the `:root` block into a themed one.
  **The accent family stays `:root`-only on purpose**: kol-brand-color.css
  rebinds it at `:root`, and a themed re-declaration would hand a branded app's
  nested pane the neutral ink accent instead of the brand.

Measured headless against the raw theme: dark root → light pane renders
`.text-emphasis` `#121215` on `#fafafa` (was `#fafafa` on `#121215`); light
root → dark pane the reverse; `.light` as a class flips the same way. Root-level
theming and the `prefers-color-scheme` mirror are untouched (`:root` still
matches). Known and unchanged: `.bg-surface-inverse` re-declares fg-01…96 but
not fg-72 or the roles, so `.text-body` inside an inverse panel is still root
ink.

## 0.51.0 — 2026-08-26

**The touch floor** (MobileTouchFloor, user ruling 2026-08-26): every pressable
control clears a **24px hit box** (WCAG 2.5.8 AA) and the drawn size never
moves; there is **no type floor** — `kol-helper-10` / `kol-mono-10` stay the
chrome voice at every width. Two controls sat under 24 and are lifted here,
nothing else changes:

- `ToggleSwitch` bare — a `::before` extent 24px tall, centred on the button
  (the box itself is a 12px track in a 1px border, 14px). Shells were already
  26/32/40.
- `Slider` — the range input is 24px tall instead of 2px; the 2px track
  centres inside it (UA `align-self: center` on the runnable track), the thumb
  stays pinned to the track, and the row was already 24px.

Law recorded in `03-components/05-control-chrome.md` § Touch floor.

## 0.50.2 — 2026-08-26

- **CodeBlock: the copy control gets a lane on chipless blocks**
  (CodeBlockMobileOverflow, kol-website's mobile audit). A block with no
  filename/language chip starts its code on the row the corner control
  occupies, and under ~600px the first line ran underneath the button. The
  first line now reserves the control's column
  (`.kol-codeblock:not(:has(.kol-codeblock-filename)) .kol-codeblock-line:first-child`);
  chipped blocks and every other line are untouched. Pairs with
  kol-component 0.68.1, which stamps `.kol-codeblock-line` and restores the
  wrap the code surface law already promised.

## 0.50.1 — 2026-08-15

- The segmented cell's hover moves ONE rung (`oq-48` → `oq-64`) instead of
  jumping to full ink. A 48 → 100 step read as the cell selecting itself under
  the cursor.

## 0.50.0 — 2026-08-15

**The segmented strip's two states are SWAPPED** (user ruling 2026-08-15 —
"same exactly like before, just swapping stages"). Both treatments are
unchanged; which state wears which is inverted.

| | background | ink |
|---|---|---|
| rest | `surface-secondary` — the raised tile | `oq-48` |
| selected | `transparent` — the bare ground | `fg-emphasis` |

The selected cell is the bare ground because it is already where you are; the
rest cells are the tiles you can press. This reverses the 2026-08-12 reading
("selected = dark tile") on every strip in the estate.

## 0.49.0 — 2026-08-15

- **The segmented strip's SELECTED cell is the inverse tile** — `fg-96` fill
  with `surface-primary` ink, the same pair `/work`'s sliding pill uses. It was
  `surface-secondary`: in dark theme a tile only a shade off the strip it sits
  in, so the selected cell was the QUIETEST thing in the control and the
  unselected cells read as the raised ones.
- **`.kol-row` thumbs fill the row's height**, width following the ratio.
  `--kol-row-thumb` is a MIN-HEIGHT now, not a fixed width — a thumb sized off
  its own width floated at the top-left of a tall row with the row empty beside
  it, which is what `work` at 160 looked like.

## 0.48.0 — 2026-08-15

**The display rungs are 500 with 0.04em tracking** (user ruling 2026-08-15).
`kol-sans-display-01/02/03` were all weight **600** — a full step above the
`kol-sans-heading-*` family they open — and carried no tracking at all.

- **600 → 500.** Right Grotesk Narrow at 600 is PP's *Dark* cut; at display
  size its counters are the first thing to close and the line reads as a slab.
  500 (*Medium*) is what every heading rung already uses, so the two families
  now read as one voice at two volumes.
- **`letter-spacing: 0.04em`.** A narrow face set large has almost no
  sidebearing left and the letters run together into a texture. The tracking is
  what lets a display line be read as words.

**This changes every display-scale heading in the estate** — the work card's
title, PageHeader's `md`/`lg` sizes, and any consumer on `kol-sans-display-*`.

## 0.47.0 — 2026-08-15

- **`--kol-gap-wall-grid` (24px) / `--kol-gap-wall-list` (8px)** — the wall
  gaps get the same treatment `--kol-pad-card-*` got, for the same reason: the
  two numbers were re-typed as a ternary at NINE call sites (kol-monitor
  HomePage ×2 and LibraryPage ×2, MediaLibrary, kol-website Work, both foundry
  grids, StackLatest), and a value repeated nine times has already drifted
  somewhere.

  Two rungs because a wall of CARDS and a stack of ROWS want different air:
  cards are objects with their own edges and need separating; rows are lines in
  a table and 24px between them reads as a broken list. PX, not rem — a gap is
  a layout measure, not type.

## 0.46.1 — 2026-08-15

- **`.kol-row` / `.kol-card-plate` step on a CONTAINER query, not the viewport.**
  Same reasoning the card-wall law already gives: the shell rails eat width that
  viewport breakpoints cannot see, so a row inside a 700px panel on a 1600px
  screen was taking the desktop step and overflowing. `768` is still the ruled
  `md` rung — only what it measures changed. `.kol-collection-item` is the query
  container.

## 0.46.0 — 2026-08-15

- **`.kol-media-zoom`** — the hover zoom, a state the house serves on
  image-led cards: the artwork creeps to 1.06 inside its own frame over 600ms
  while the frame holds still. Keyed off the CARD's hover, not the media's,
  because the whole tile is the affordance. Transform only — the one property
  that scales without relayout, so a wall of these cannot thrash the grid.
  Reduced motion switches it off entirely.
- **`.kol-row--divided`** and a `transparent` fallback on `--kol-row-border`.
  A variant with no frame published no border variable, and
  `border-color: var(--undefined)` is invalid at computed-value time: it
  resolves to `unset`, which INHERITS, which is currentColor. That is how the
  `default` row's hairline divider rendered as a solid white rule.

## 0.45.0 — 2026-08-15

- **`.kol-expand` / `.kol-expand-content`** — the house expand, as chrome. A
  collapsed control opening to its field (the search glyph widening into an
  input) was hand-written inline in TWO components with the same three
  declarations, which is how the curve came to be hardcoded in seven places.
  The staggered durations ARE the character of the move: the box travels
  longest (600ms), its fill settles sooner (400ms), the content inside arrives
  last and quickest (300ms) so it does not smear across the widening box. The
  width VALUE stays inline — that is per-instance data, not chrome.

## 0.44.0 — 2026-08-15

**The house curve is no longer expo.** `--kol-ease-house` was
`cubic-bezier(0.16, 1, 0.3, 1)` — easeOutExpo, which spends ~90% of its
distance in the first fifth of the duration, so every motion in the system read
as instant regardless of the duration it carried. It is now
`cubic-bezier(0.4, 0, 0.2, 1)`, balanced. **This changes the feel of every
animation reading the token.**

- **`.kol-inline-control`** — ONE rest tone for every inline control
  (`oq-64`). They part on HOVER: a neutral control lifts to `oq-96`, and yellow
  belongs to the accent alone (`--accent`), on hover and on its on-state.
  Spending the accent on every hover left the on-state nothing of its own.
- **The star's two states are TWO GLYPHS**, not one glyph and a fill. `star`
  stays stroke-only and `star-solid` is its filled twin; a control with an
  on-state names both. Filling the shared `star.svg` and unfilling it in CSS was
  tried and reverted — a glyph that ships filled renders filled in every
  consumer that never asked for a state, and the DS cannot see those.
- **`.kol-content-hover` / `.kol-content-hover-frame`** — the content family's
  hover step, driven by per-variant custom properties. Border is its own class,
  not a fallback off the background one: an undefined var in a `border-color`
  declaration resolves to `unset`, which inherits and quietly repaints a border
  nobody asked to move.
- **`.kol-card-drawer`** — the work card's caption plate.
- **`.kol-row` / `.kol-card-plate`** — box values as custom properties with one
  `md` media query, so a per-variant responsive step exists at all (Tailwind
  cannot generate an `md:` variant from package source).

> **Gap:** 0.6.0 → 0.40.0 shipped without entries (that history lives in the repo's
> session logs). Resumed 2026-08-14 — from here every publish adds an entry, and
> breaking or global-surface changes (token renames, default flips, new bare-element
> rules) are flagged **BREAKING**.

## 0.43.1 — 2026-08-15

### Patch Changes

- **`.kol-section--divided` pads in px, not rem.** It shipped reading
  `var(--kol-spacing-5)`, and that scale is defined in rem. Spacing in the
  component sheets is px — `.kol-tag--sm`, `.kol-sidenav-group` and every
  `.kol-control-*` size set it directly — so the token was the outlier here.
  Now `padding-top: 20px`. Same rendering at the default root size; no rem
  scaling under a user font-size change.

## 0.43.0 — 2026-08-15

### Minor Changes

- **Card padding tokens** — `--kol-pad-card-{sm,md,lg}` (12/16/24), flat,
  stepped by the card's `size` prop, never by breakpoint (content-card ruling).
- **The house curve is a token** — `--kol-ease-house:
  cubic-bezier(0.16, 1, 0.3, 1)`; it was hardcoded in 5 files and is the curve
  the cards actually use. Curve only, pairs with any duration.
- **`.kol-sans-display-03` ships** — the deferred class found its consumer:
  ContentText's `work` row title (the ruled size-only step from display-02).
- **`.kol-collection-item`** + `kol-collection-in` keyframes — the enter
  stagger owned by `ContentCollection` (organisms sheet).

**Also in this version — the kol-fxr ticket batch** (separate work riding the
same unpublished bump):

- **`--kol-focus-ring-quiet`** — the focus system had a token that only half
  the rules read. `.kol-btn` / `.toggle-switch` / `.focus-visible:ring-focus`
  read `--kol-focus-ring`; the nav rails and the segmented cell hardcoded their
  colours. So a consumer setting `--kol-focus-ring: transparent` lost button
  rings and kept rail rings — a half-working off switch, which is why kol-fxr
  wrote local CSS (`FocusRingsInConsumers`).

  Now the pair is the switch: `--kol-focus-ring` is the loud 2px ring,
  `--kol-focus-ring-quiet` the 1px inset one for dense rows. Set both to
  transparent and the system is genuinely off, with no `outline: none` in
  consumer CSS. **Every focus rule in the theme now reads one of the two — no
  hardcoded focus colours remain.**

  Defaults reproduce today's values exactly, so **nothing moves visually**.
  Both rings are white: `--kol-accent-primary` resolves to
  `--kol-surface-on-primary`, so the two differ in weight, not hue.

- **`.kol-sidenav-link:focus-visible`** — the rail leaf had no focus treatment
  at all, only `.is-active` and its dot, so it fell through to the browser's
  default ring (reported as "a weird highlight bug"). Now 1px inset, matching
  its sibling `.shell-nav-item` rather than `.kol-btn`'s offset ring, which
  blooms outside a dense nav row.

- **`.kol-section--divided`** — the between-siblings hairline for stacked
  inspector sections; pairs with `Section`'s new `divided` prop. `+` cannot be
  expressed as a utility class, which is precisely why every consumer had to
  invent a hook class and retype the rule.

- **`.kol-placeholder`** — the suppression half of the placeholder gate, in
  utilities rather than a component sheet because a consumer puts it on its own
  prose. Written as `:root:not([data-kol-placeholders])` so the element keeps
  whatever display it had instead of being forced back to `block` on reveal.

## 0.42.2 — 2026-08-15

### Patch Changes

- **`kol-sources.css` works under pnpm.** Every `@source` path in the manifest —
  not just the missing kol-shell line 0.42.1 added — resolved to nothing under
  pnpm, silently: Tailwind resolves the file to its `.pnpm` store realpath, where
  only kol-theme's own dependencies are siblings, and kol-theme depends on none
  of the packages it sources. The docstring's "sibling package paths work from
  inside node_modules" claim was true only for npm/yarn's flat tree. Found by
  kol-mirror's kol-shell adoption (ShortcutsOverlay labels glued to keys —
  `contents` never emitted).

  Every package now carries **two** lines: the flat-tree path (npm/yarn) and a
  five-up store walk to the consumer's `node_modules/@kolkrabbi/*` (pnpm,
  verified against a live store). A path that doesn't exist matches nothing, so
  one of each pair is inert on any layout and npm/yarn consumers are unregressed.
  kol-mirror can delete its local `@source` workaround on bump; other pnpm
  consumers get the other eleven packages' utilities back without knowing they
  were gone.

## 0.42.1 — 2026-08-15

### Patch Changes

- **`kol-sources.css` gains `@source "../kol-shell/src"`.** kol-shell 0.1.0
  shipped (2026-08-14) without its manifest line — the exact silent footgun the
  manifest exists to prevent, and its header even says new raw-JSX packages get
  their line added DS-side. Every kol-shell adopter hit unstyled chrome (Tailwind
  silently skips the package's utilities); kol-monitor found it as a
  shortcuts-overlay with labels glued to keys and worked around it with a local
  `@source` line. Delete that consumer line on bump — the manifest carries it now.

## 0.42.0 — 2026-08-15

### Minor Changes

- **`.kol-feature-split-visual.is-hoverable`** — the media zoom for FeatureSplit's
  visual column, opt-in via the component's new `mediaHover` prop. Same 1.03 /
  300ms / `prefers-reduced-motion` treatment as the CardFeatureItem zoom
  (CardFeatureHoverZoom, 2026-08-12), so the estate has ONE motion vocabulary
  rather than a per-section re-decision — which is how kol-website's HomeFoundry
  hover stayed silently broken for months. Motion chrome is DS CSS, never a JSX
  utility (the ComponentTailwindSourceTrap law).

## 0.41.0 — 2026-08-14

- **BREAKING:** `@font-face` URLs moved `/fonts/Right-Grotesk/` → `/fonts/right-grotesk/`
  (all 98 static srcs in `kol-typography.css`). Consumers must rename their
  `public/fonts/Right-Grotesk/` folder to `right-grotesk/` on this bump — one
  coordinated wave, no fallback at the old path.
- Dropped the two `"Right Grotesk Text"` `@font-face` declarations — no token, no rule,
  nothing ever set the family, so browsers never downloaded the files. Re-add the day
  something renders with it.
- New `kol-components-shell.css` — chrome for `@kolkrabbi/kol-shell` (the app-shell set):
  `--kol-shell-rail-width` / `--kol-shell-page-pad` tokens, `.kol-shell-rail` geometry
  at the sticky z-tier, and the rail-scoped active-state ruling (2026-08-12): ink
  `--kol-oq-96` every state, `aria-current="page"` = the `--kol-oq-04` hover wash held
  on. Scoped to `.kol-shell-rail` — the global `.kol-btn-nav[aria-current]`
  brightness-only rule (site navs, 0.11.7 ruling) is untouched. Plus
  `.kol-shell-card-preview--{natural|compact|cover}` fits from monitor's local CSS.

## 0.6.0

### Minor Changes

- 8b4c850: Chrome law: every control references the Button — two variants (primary; outline = always secondary), button size scale (26/32/40). Old variant names are aliased, nothing breaks.

  - **Dropdown** — trigger now emits `kol-btn kol-btn-{primary|outline} kol-btn-{size}` (fills/hover/active/focus come from the button rules; inline-style chrome removed per the theme-CSS rule). Open state is fused: primary panel continues the trigger fill (no border, no gap, hairline divider inside), outline panel carries the trigger's border. Big per-size radii (14/22/24) replaced by `--kol-radius-sm`; type pairing corrected to mono 12/14/16; chevron sizes aligned to button icon sizes. Variant aliases: `default`→primary, `subtle`→primary, `minimal`→outline.
  - **Input** — `ghost` folds into `outline` (alias kept): one secondary treatment. `.kol-control--ghost` CSS retained but deprecated.
  - **Textarea** — resize is real now: the `resize-grip` icon (kol-icon-set-v1) is the actual drag handle (JS corner drag, both axes, min 120×40). Native `resize` stays off — Firefox's built-in grip can't be hidden any other way, so this is the only route to one identical grip in every browser. Previously a decorative icon sat over `resize: none` — an affordance that didn't exist.
  - **Input/control** — `.kol-control--outline` border moves `fg-16` → `oq-16` (opaque), matching the button outline.
  - **ToggleSwitch** — rewritten: **bare by default** (label + track, no box); `primary`/`outline` shell variants at exact button geometry; new `size` prop (sm/md/lg) scales shell and track; on-state = inverted ink (matches `.kol-btn-pressed`); focus ring added; the auto-uppercase label removed (no-auto-casing rule). Aliases: `plain`→bare, `default`→outline.

### Patch Changes

- 8b4c850: Button states rebuilt on the opaque (`oq`) tier — interactive fills never go see-through over content again. The reported bug: every filled `.kol-btn` variant swapped its solid fill for a translucent `fg-*` wash on hover (primary 92% transparent, secondary 80% + an ink swap, accent 20% via the `--kol-accent-primary-strong` token), so buttons over images vanished on plain desktop hover.

  - Hover fills swapped to married opaque stops: primary `oq-08`, outline `oq-02` (border `oq-16`), ghost `oq-04` (label `oq-48`); secondary hovers on the inverse tier (`oq-inverse-40`, label stays light — no ink swap); `--kol-accent-primary-strong` is now an accent-based opaque mix.
  - New `:focus-visible` ring (2px `--kol-focus-ring`, offset 2) — previously no focus style existed.
  - New `:active` press states — one stop past hover per variant (primary `oq-16`, secondary `oq-inverse-48`, accent 70% mix, outline/ghost `oq-08`).
  - `.kol-btn-pressed` (toggle-on) is now solid inverted ink instead of a faint translucent wash.
  - Same opaque treatment for sibling chrome that shared the translucent-fill idiom: `.tag-control` hover/active (`oq-12`), `.toggle-switch-indicator` track (`oq-16`), `.kol-control--ghost` resting fill (4% black baked onto the surface).
  - The `@media (hover: hover)` touch guards from the earlier cut of this changeset remain.

- 8b4c850: Slider collapsed to one bare row — the `minimal` look is now the only slider. The component mapped `variant="minimal"` (the dominant real usage) to `.control-slider-minimal`, a class no CSS defined, so those call sites rendered with no container layout and leaned on their parent to compensate. The `variant` prop is gone; every Slider now resolves to the bare `.control-slider` inline row (label · track · editable readout) and finally gets its intended layout. Bordered `default` and chip `subtle` variants removed. Passing a `variant` is a harmless no-op for back-compat.

## 0.5.0

### Minor Changes

- d194686: `SegmentedToggle` sizes now mirror `Button` exactly. Each size shares the matching `.kol-btn-{sm,md,lg}` cell padding and mono type, so a segmented strip lines up with a Button of the same size:

  - `sm` — 26px, mono-12 (was 16px with no type — the old icon-only variant)
  - `md` — 32px, mono-14 (was 26px, mono-12 — the wrong-looking text)
  - `lg` — 40px, mono-16 (new)

  The fixed-height model is replaced by padding-driven height in kol-theme (`.kol-seg` hugs content; `.kol-seg--sm/--lg` set cell padding). Existing `sm`/`md` consumers will see the taller, correctly-typed sizes.

## 0.4.0

### Minor Changes

- 8448e47: All KOL-shipped rule CSS now lives in the `components` cascade layer (theme barrel imports via `layer(components)`, `kol-framework.css` wrapped in `@layer components`). Under Tailwind v4's layer order (`theme, base, components, utilities`) consumer utility classes can now always override KOL chrome — previously every kol-\* rule silently beat every utility because unlayered CSS wins over all layered CSS. Tokens-only files (`kol-brand-color.css`) and `@theme` blocks are unaffected. No import-order changes required in consumers.

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
- fa8ce05: `SegmentedToggle` renders its real chrome again in every consumer. The container/cell look moved out of Tailwind utility classes (which never generate from package sources — consumers saw jammed labels with no border) into `.kol-seg` / `.kol-seg-cell` in kol-theme's molecule CSS, including padded cells. A11y upgrade rides along: `radiogroup`/`radio` semantics with a roving tabindex, ←→/↑↓ arrow-key selection, and a `:focus-visible` outline; new optional `ariaLabel` prop names the group. `aria-pressed` is replaced by `aria-checked`.

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
