# @kolkrabbi/kol-framework

## 0.61.0 — 2026-10-28

ArticleRendererHomeHeroSelection (kol-website):
- **`SiteHero`** — a site's landing, kol-website apps/brand's `Landing` class for class: `image` (`src` · `srcSet` · `sizes` · `position`) or `media`, `mark` (a node, or an SVG url inlined by `VectorLoader`, sized clamp(140px, 16vw, 220px)), `title`, `tagline`, `actions`, `overlay` (the inverse wash, 32 % light · 80 % dark; a number, `{ light, dark }` or `false`), `align` (`center` · `start`), `minHeight` (`100dvh`). `.kol-site-hero-overlay` is the one wash rule for brand's `.landing-hero-overlay` and web's `.stack-hero-overlay`. Needs kol-component ≥0.308.0.
- **BREAKING (default flip): `::selection` is neutral** — user ruling, accents are opt-in: the page's ink pair inverted (white on near-black in dark mode, its inverse in light) instead of `--kol-accent-primary`. A site that wants the accent puts `.kol-select-accent` on `html` (or any subtree).

## 0.60.0 — 2026-10-28

- The site rail's split row and clip fade (kol-component 0.308.0): `.kol-sidenav-hop-split` · `.kol-sidenav-hop--split` · `.kol-sidenav-hop-caret--row` · `.kol-sidenav-hop-chevron` — the caret fills the category row under the title, which alone takes the pointer, and the row brightens as one; `.kol-sidenav-scroll--fade` — the tree's 3rem mask at its foot.

## 0.59.0 — 2026-10-28

- **`documentFiles(glob)`** (DocumentIndexFilesAndIcons049, kol-website 2026-10-28 — a point of the MarkdownPage ticket 0.58.0 missed: *"a folder may also hold PDFs and images; the contents index lists them beside the md pages and opens them in the DS QuickLook"*): the files beside a folder's markdown as rows `{ id, title, group, file, ext, kind }` from a `?url` glob, the kind the DS's (`kindOf`). `DocumentIndex` (kol-styleguide 0.13.0) draws them as cards and opens them in Quick Look. `documentTabs` is unchanged, the markdown half.

## 0.58.0 — 2026-10-28

- **The document page** (plan-2026-10-28-document W5.2; kol-website's MarkdownPage ticket — *"a folder of .md files rendered as pages inside SiteLayout, with a contents page"*). Born in `apps/document` and proved against kol-atlas's own engine (its Project, SEO + GEO, Brief and Naming system render block for block the same), home here beside `CategoryPage`: `MarkdownPage` — a markdown file as `.kol-sheet` through kol-markdown's `parseDocsMarkdown` (`source`, `numbered`, `notes` as `linkNotes`, `toc` frame · rail · false, `fit` cover · contain, `ratio`, `resolveLink`, `assetUrl`); `LinkPreview` — kol-atlas's hover card for the sheet's links on DS parts (`cardFor(anchor)` is the app's, from its corpus); `documentTabs(glob)` — a folder of files as page rows (id, title, group, file, source). `@kolkrabbi/kol-markdown >=0.2.0` is a new peer. The contents cards (`DocumentIndex`) are kol-styleguide's, which peers on this package.

## 0.57.0 — 2026-10-27

- **The site rail's chevron sits 16 from the edge** (Round 21, user 2026-10-27 — *"a bit padding right missing"*). `.kol-sidenav-hop-caret` is `right: 1rem` (was 0.75rem, 12), where the app rail's chevron glyph ends. Nothing else on the rail moves.

## 0.56.0 — 2026-10-25

- **The site rail has its own 20px gutter** (user 2026-10-25 — *"why is the rail collapsed 18px padded while open 24px?"*). `--kol-sidenav-pad-x` (1.25rem) on every rail row, header, group, section, footer and the phone drawer, open and collapsed; `--kol-sidenav-w-collapsed` is derived from it (`pad × 2 + 1.25rem` = 60, was a flat 56), so the 20px glyph sits 20 in both ways and never moves on collapse. The rail no longer reads the chrome inset (24 on a desk read too padded against the glyph).

## 0.55.0 — 2026-10-24

- **The app's default theme stands in for the OS** (AppHubDefaultTheme, kol-mirror 2026-10-24 — *"make this repo dark mode default"*). `applyTheme('system')` — the toggle's alt-click and the Hub's reset — lands on `data-theme-default` when the root carries one (`AppHub defaultTheme` stamps it), instead of prefers-color-scheme: stamped, never persisted, so a dark-first app stays dark through a reset on a light-mode Mac. No attribute = as before.

## 0.54.0 — 2026-10-24

- **`SiteLayout`** (user 2026-10-24: *"why not SiteLayout instead? to at least name it with variant 'site'"*) — the site frame, named for the rail variant it frames; `PageLayout` and `AppShell` stay as aliases on the retirements ledger. A site is `SiteLayout` plus a nav tree and routes — `apps/site-hub` is the reference; `docs/documentation/04-compositions/18-site-frame.md` the page.
- **The phone mode is the app rail's drawer** (user: *"I think we should use that hamburger siderail"*): below 768 the rail goes off-canvas and slides on the shell's 220ms curve, a 32px nav Button pinned top-right swaps hamburger for × (`.kol-shell-drawer-trigger`), a scrim button closes on tap (`.kol-shell-drawer-scrim`), Escape and a destination close. The round top-left hamburger and the opacity backdrop are gone. The open drawer's rows are the wide row, on the chrome inset (20 on a phone).
- **The collapse is one motion** (user: *"some shifting and not very smooth animation between collapsed and expanded rail"*): the narrow row is the wide row with its gutter eased to the column's centre and its label faded on the grid's 180ms clock; the caret fades; reduced motion turns it off. Needs kol-theme ≥0.186.0 (the row's transition list) and kol-component ≥0.298.0 (the stable tree).
- **The theme toggle is a tree row** — `ThemeToggle variant="row"`: the roll at 16 in the icon column, the target's words in the rows' voice, the rail's hop box, so it collapses as a row does; `SideNav` passes it to the rail's theme slot in both states with the rail's tooltip. No `icon` fallback.
- **`CategoryPage`** — new: the foldernote's overview from the nav tree — `PageHero` (the category's label, lede) over a `ContentCollection` of its pages as the article card, each page's `card` on its tree row.
- **The rail's gutters on `--kol-pad-chrome-x`** — rows, header, group label, section label, footer; the collapsed gutter is `(w-collapsed − 20) / 2`.

## 0.53.0 — 2026-10-22

- **`hideLoaderApp({ minMs = 600 })`** (LoaderAppMinimumTime, kol-monitor): the loader holds at least `minMs` from navigation start, so a fast load no longer flashes the mark; a slow load waits nothing extra. Reduced motion drops the fade, not the minimum. Each app sets its own `minMs`; `0` is the old behaviour.

## 0.52.0 — 2026-10-22

- **`SideNav` is `NavRail variant="site"`** from kol-component under its old name — deprecated, on the retirement ledger, same props. It keeps the react-router read (`useLocation`, `useNavigate`, the basename on hrefs) and renders `ThemeToggle` in the rail's slot. Rendering is unchanged; the active category icon is ink (kol-theme 0.179.0). Needs kol-component ≥0.283.0.

## 0.51.0 — 2026-10-18

- **`devFavicon` is one letter** (user: *"dev favicon should only use letter like M for monitor"*) — a longer `label` is cut to its first letter; default `K`.

## 0.50.0 — 2026-10-17

- **New: `@kolkrabbi/kol-framework/vite`** — Vite plugins, Node-side, for an app's `vite.config`:
  - **`devFavicon({ label, ground, ink })`** — the dev tab is tellable at a glance (user: *"I need to be able to tell which tabs are localhost dev and which are production"*). On the dev server the favicon becomes a solid tile with the app's 1–3 letters; a build never sees it. It REPLACES the icon link (fxr appended a second, which Firefox ignores; mirror swapped it at runtime). Each app's label and ground: 16-app-anatomy.md § Dev favicon.
  - **`loaderApp({ graphic, size })`** (AppLoader, kol-monitor — user: *"shouldnt that loader just be owned in DS … with custom graphic input as prop?"*). Writes the app loader into `index.html` — the mark centred on the theme's ground, pulsing while the bundle downloads — static HTML, as it has to be. `graphic` is SVG markup or a path to an .svg.
- **New: `hideLoaderApp()`** — call after the first commit: two frames later the loader fades (240 ms, none under reduced motion) and leaves the DOM.

## 0.49.0 — 2026-10-02

- **BREAKING (a default flips): the chrome inset is 20 on a phone.** `--kol-pad-chrome-x` was `24` at every width; below 768 it is the page ladder's `20` now, so the shell's header, its frame and a page stand on one edge (user ruling 2026-10-02 — a phone page sat 4px off the ladder). `24` from 768, as before. A consumer measuring against 24 at phone width moves by 4px.

## 0.48.0 — 2026-09-30

**The workshop rails' grab tokens** (the reuse pass — UI built fresh last night swapped for what the DS already ships).

- `--kol-shell-nav-*` / `--kol-shell-toc-*` `-snap` · `-step` · `-snap-default` · `-w-collapsed` — the four tokens `useDragResize` reads, the same set SideNav's rail carries.

## 0.47.0 — 2026-09-30

**`ShellHeader` `menuBelowLg`** (the names audit built — plan-2026-09-29-phase-log-and-showcase-review, second goal).

- New prop, default `false` — the hamburger shows only below `lg`. On a desktop the tab row's own rail toggles do its job, so it read as a duplicate. No consumer changes unless it opts in (kol-workshop's `ShellLayout` does).

## 0.46.0 — 2026-09-30

**The names audit** (plan-2026-09-29-phase-log-and-showcase-review — the names audit + W3–W6).

- **Tooltips are one word** — the header's Menu · Navigation · Contents, and `ThemeToggle`'s tooltip is `Theme`; its alt-click hint moved into its `aria-label`.
- Comments: one spelling, `color`.

## 0.45.0 — 2026-09-28

- **The workshop shell's rails are their own pair** — `--kol-shell-nav-w: 256px` (new) and
  `--kol-shell-toc-w: 256px` (was `16rem`). The shell read `--kol-sidenav-w`, the draggable app
  sidenav's 264/320 ladder, so the docs shell rendered 320 | main | 256. `--kol-sidenav-w` is
  unchanged for NavRail, the labs rail and the deck editor.
- **`ThemeToggle` carries ONE tooltip, the DS one** — it set a native `title` (spread from a props
  object, which the native-title gate could not see) while `ShellHeader` wrapped it in a KOL
  `Tooltip`, so hovering showed both. The toggle wraps itself now with the richer text
  ("Switch to light mode · following your system"); `tooltip={false}` leaves it bare.
  `ShellHeader` no longer wraps it.
- `PageLayout`'s phone-only hamburger is marked `tip-ok` (a hover tip never shows on touch).

## 0.42.0 — 2026-09-03

- `ThemeToggle tone` takes `inverted` (theme 0.138.0, component 0.177.0).

## 0.41.0 — 2026-09-03

- **`PageLayout` owns the wash** (two-page-scaffolds-one-job, kol-client-olina).
  The plane paints `pageWash` and hands `--kol-shell-page-wash: transparent`
  down — the variable means what is LEFT to paint — so a `PageShell` (or any
  page root reading it) inside the frame no longer paints the wash a second
  time. BrandLayout's line had set the variable on the plane AND painted it:
  `fg-02` rendered as two 0.02 layers, measured on olina's /slide-deck. Outside
  a `PageLayout`, and under kol-shell's `AppShell`, PageShell paints exactly as
  before. Olina's `style={{ background: 'transparent' }}` stopgap retires.

## 0.40.1 — 2026-09-03

- `PageLayout` no longer destructures the inert `getActivePage` (props gate P2:
  a prop that is destructured and never read). Passing it still breaks nothing —
  an unknown prop is ignored.

## 0.40.0 — 2026-09-03

- **`ThemeToggle tone` takes the six tones** (tone-is-the-ground-axis; theme
  0.134.0, component 0.176.0) — `primary` · `secondary` · `outline` · `ghost`
  · `grey` · `sunken` (`inverse` aliased); unset inherits the wrapper's. The
  geometry variants (`none` · `subtle` · `flush`) read the tone and fall back
  to what they painted. Peers: theme ≥0.134.0, component ≥0.176.0.

## 0.39.0 — 2026-09-03

- **The page kit is one set — `PageHero` · `PageSection` · `PageLayout`**
  (page-family-is-not-a-set, kol-client-olina; user, on the brand book: *"why
  do 3 of 4 prefix PAGE if they are a set?"*). Four components under three
  prefixes, none composing a text primitive, and a layout that shipped fifteen
  `.kol-brand-layout` rules and no component.
  - **`PageHero`** = `BrandHero` + `SubPageHero`. Same core, one optional slot
    each (`mark` · `backTo`/`backLabel`); both now on one component, both old
    names aliased (retirements ledger). Voices are `BrandHero`'s verbatim —
    `.kol-prose-label` · `.kol-prose-display` · `.kol-prose-lede`; `SubPageHero`
    had no package consumer, so its private voices go, its back link stays
    class-for-class. With a `mark`, the label now sits in the text column
    beside it rather than above the row — no package consumer passes `mark`.
  - **`PageSection` and `PageHero` compose `SectionText`**, the page tier's
    base, the way `PageHeader` does (component 0.175.0) — the `kol-prose-*`
    classes passed as the base's seams, `gap` 0 because each class carries its
    own margin. Internals only; the 81 consumer files are untouched. One
    inherited delta: the base stamps `text-wrap: balance` on the headline.
  - **`PageLayout`** = `AppShell`, renamed. The ticket asked for a layout to
    ship beside the CSS; it already did — every consumer `BrandLayout.jsx` in
    the estate is a copy of this file's markup — under a name that did not say
    so and collided with kol-shell's `AppShell`. `AppShell` aliased. Folded in
    from the forks: **`pageWash`** (the plane's wash over the primary back, the
    same prop and `--kol-shell-page-wash` variable as kol-shell's) and
    **`bare`** (plane + outlet only, the `?embed=1` branch).
  - ⚠️ **The back is `surface-primary` now, not `surface-tertiary`** — one
    component, one model, and the brand rulings (2026-08-24 → 08-27) are the
    later ones. kol-studio, the one `AppShell` importer, goes from a tertiary
    page to primary until it passes `pageWash`.
  - **The ruling underneath (ticket ask 1):** `ContentText` and `SectionText`
    stay two primitives by tier — a listing item's text with its data slots and
    variant × form ramp, and a region's head — and neither absorbs the other.
    Written into the section-system and content-card docs as a membership test.

## 0.38.0 — 2026-09-03

- **`Layout` has a skip link and an `id="main"`** (layout-skip-link,
  kol-client-olina). Without them a keyboard user tabs the entire sidenav on
  every page before reaching content. It was the one `kol-framework` fork a
  consumer could not retire in its full-consumption pass, because retiring it
  would have dropped an a11y basic. The link sits in `Layout` and not a nested
  layout because it must PRECEDE the landmark it targets.
  Every class on it emits, which was not a given: the consumer's copy shipped
  `bg-accent-primary text-surface-primary` for a month and neither is a utility
  that exists, so the link rendered with no fill at all. `bg-surface-inverse`
  carries its own ink, and `focus:z-modal` is a real class only as of
  **kol-theme 0.133.0**, which registered the z ladder with Tailwind the same
  day — before that it emitted nothing either.
  **Requires `@kolkrabbi/kol-theme@>=0.133.0`.**

## 0.37.0 — 2026-09-03

- **A dragged rail width is no longer remembered by default**
  (sidenav-drag-width-outranks-breakpoints, kol-client-olina; user: *"why would
  you want that in persistent memory? and even if you did, shouldnt it be an opt
  in via prop? off by default"*). `useDragResize` persisted any drag to
  `localStorage` and replayed it on boot as an **inline** custom property on
  `:root` — which outranks every stylesheet rule, so one drag on a laptop killed
  both shipped rungs (`--kol-sidenav-w: 264px` and the 320px `min-width:1536px`
  rule) permanently, on every machine, with nothing in the UI saying so and no
  selector a consumer could beat. Measured at 1600×900: a stored 210 rendered
  210 and the 1536 rung did nothing.
  **`persistWidth` (default `false`)** on the options object turns it back on for
  an app that wants it. Off, a drag still works and lasts the session, and the
  hook also REMOVES a width key an earlier version wrote — so a consumer that
  merely bumps stops replaying a width it never opted into. Verified: with 210
  stored, off resolves 264 at 1280 and **320 at 1600** with no inline property;
  on resolves 210. Collapsed/expanded state is untouched and still persists.

> **Gap:** 0.8.0 → 0.19.0 shipped without entries (that history lives in the repo's
> session logs). Resumed 2026-08-14 — from here every publish adds an entry, and
> breaking or global-surface changes (token renames, default flips, new bare-element
> rules) are flagged **BREAKING**.

## 0.24.0 — 2026-08-26

**`SideNav` renders nested route groups** (sidenav-nested-groups, from
kol-studio). A `{ label, children }` node inside a category renders as a
non-routing group header (`.kol-sidenav-group kol-helper-10 text-subtle`,
`text-emphasis` when a leaf beneath it is the current route) with its rows
indented one `--kol-spacing-3` step under it, recursively; the active dot
keeps its 0.875rem lead at every depth. **The tree shape is the opt-in — there
is no prop.** A tree with no group nodes renders byte-for-byte as 0.23.0
(asserted: the showcase demo's flat tree, outerHTML identical before and
after). `#anchor` leaves (`id` only) stay dropped — the scroll-spied section
layer is not reopened.

The header's 2026-08-01 "TWO LEVELS ONLY" line is re-scoped: it was the brand
app's ruling about its anchors, inscribed in the package as a law for every
consumer — kol-studio lost two groups and six routes from its rail on adopting
0.23.0 and had to flatten them into `PDF · A4`-style leaves. The user's
sentence is quoted in the header so the scoping has a source. The retired
fork's `uppercase` on the group label does not return (type law).

## 0.23.0 — 2026-08-26

### Minor Changes

- **SideNav's box lives in `.kol-sidenav`, not in utilities**
  (SideNavMobilePosition, kol-website's mobile audit). The aside's className
  carried `sticky top-0 self-start h-dvh flex flex-col z-20`, and a utility
  outranks every rule in this layered sheet — so the 767px drawer block's
  `position: fixed` never won, the aside stayed in flow, the one-column grid
  handed it an 852px row and **every consumer page opened one viewport down
  on phones**. Same law as 0.15.2's hop fix, one element up: the box is in
  the rule, the JSX keeps only colour utilities. Consumers carrying a
  `position: fixed` stopgap for `.kol-sidenav` below 768px can delete it.
- **ShellHeader scrolls the active tab into view** (WorkshopShellMobile).
  The tab strip already scrolled, but on a phone the current section's tab
  sat past the strip's edge (measured "Dashboard" at x=347–445 in a 345px
  strip). When the active tab is out of view it is scrolled to the strip's
  start edge, before paint; a wide viewport never moves. The strip snaps to
  tab starts on a flick (`scroll-snap-type: x proximity`). No edge fade — the
  2026-07-28 ruling against scroll-edge paint stands.

## 0.22.0 — 2026-08-15

### Minor Changes

- **`:root { scrollbar-gutter: stable }` ships here.** Promoted from kol-fxr's
  `src/index.css`, where it was the only rule in a file that should hold
  nothing but imports. It stops a full-bleed surface inducing a horizontal
  scroll when a vertical scrollbar appears — chrome every app on this
  framework wants, not one consumer's business.

  **Global surface change:** it lands on `:root` inside the `components`
  layer, so any consumer already reserving the gutter is unaffected and any
  consumer wanting it off can override from the utilities layer. Inert on
  overlay-scrollbar platforms.

## 0.21.1 — 2026-08-15

### Patch Changes

- **The `--kol-rail-*` family is px.** It shipped mirroring the sidenav's
  `16rem` / `12rem` / `var(--kol-spacing-4)`, which copied a rem convention
  into a new token family instead of using the px this system actually sizes
  chrome in. Now `--kol-rail-w: 256px`, `--kol-rail-snap: 192px`,
  `--kol-rail-step: 16px` — the same resolved values, no rem.

  `--kol-sidenav-*` is deliberately left alone: it is shipped, consumers
  override it, and rewriting it is a separate call.

## 0.21.0 — 2026-08-15

### Minor Changes

- **`useDragResize` is side-agnostic.** New second argument
  `useDragResize(ref, { token, side })`. Every name the gesture touches — the
  CSS custom properties, the `data-*` attributes and both `localStorage` keys —
  is now derived from one `token` string instead of being hardcoded, and
  `side: 'right'` inverts both the pointer sign and the arrow keys so a
  right-hand rail's handle drags the way it faces.

  **Nothing changes for existing callers.** The defaults (`'kol-sidenav'`,
  `'left'`) reproduce the 0.17.0 names byte-for-byte — `SideNav` still calls it
  with one argument. `scripts/check-dragresize-names.mjs` asserts exactly that
  against a hand-transcribed copy of the old contract, because a drift there
  would be silent: the rail would read variables nobody writes and persist
  under keys nobody reads, with no error anywhere.

  Filed as `ThreeColumnEditorShell` from kol-fxr, whose right-hand inspector
  had no drag handle at all — the hook was sidenav-shaped by construction, so
  pointing a second rail at it resized both off one `:root` variable.

- **Inspector-rail grid track.** `--kol-rail-{w,w-collapsed,snap,step,snap-default}`
  and `.kol-brand-layout[data-rail="true"]` — nav · content · inspector, with
  each rail's track behind a private variable so the two collapse independently
  off one rule each rather than a 2×2 of combined states. `--kol-toc-w` (160px,
  a docs table-of-contents) was previously the only third column the shipped
  grid knew, which is why every editor-shaped app restated the whole template
  locally.

  Deliberately **not** behind the TOC's `min-width: 1280px` gate: an editor's
  inspector is the surface, not an enhancement that may drop away.

## 0.20.1 — 2026-08-15

### Patch Changes

- **`.kol-embla-btn` centres its glyph.** The carousel nav buttons carried the
  literal text characters `‹` and `›` and centred on line-height alone; they draw
  real chevron icons now (kol-component 0.41.0 `EmblaNav`), so the rule gains
  `inline-flex` + centring. Text-glyph callers are unaffected.
- **`.kol-embla-controls.is-inline`** — the prev/next pair in a header row rather
  than under the viewport: no top gap, start-aligned. kol-website's
  FeaturedCarousel fork put its nav in the header, and that was the one thing
  the position needed a name for.

## 0.20.0 — 2026-08-14

- Subpath exports: `./src/*` added to the exports map (same treatment kol-component got
  in 0.35.0). `import ThemeToggle from '@kolkrabbi/kol-framework/src/ThemeToggle.jsx'`
  is now legal without the pnpm patch kol-monitor and kol-mirror carry to reach past the
  barrel — the patch dies on this bump.

## 0.8.0

### Minor Changes

- `.kol-full-bleed`: the cancelled inset is now a parameter, not a hardwire.

  v1 (0.7.0) hardcoded `margin-inline: calc(-1 * var(--kol-pad-section-x))`, which
  assumed every consumer pads its pages with the DS ladder (20/32/48px). That
  assumption fails in practice: kol-website's `apps/web` pads with
  `.breakpoint-padding` (1 / 1.25 / 1.5rem) and uses zero `.kol-page` classes, so
  adopting the rule over-pulled by 4–24px and every full-bleed hero overhung the
  viewport. A cancellation utility has to cancel the inset that is actually there,
  and the package cannot know that from the inside.

  Now:

  ```css
  .kol-full-bleed {
    margin-inline: calc(
      -1 * var(--kol-full-bleed-inset, var(--kol-pad-section-x))
    );
  }
  ```

  **Non-breaking** — the fallback is the previous value, so consumers laying out on
  `.kol-page` see no change. Consumers running their own inset set the variable on
  the padded wrapper, or on `:root` for a whole app:

  ```css
  :root {
    --kol-full-bleed-inset: 1rem;
  }
  @media (min-width: 768px) {
    :root {
      --kol-full-bleed-inset: 1.25rem;
    }
  }
  @media (min-width: 1024px) {
    :root {
      --kol-full-bleed-inset: 1.5rem;
    }
  }
  ```

  Closes the last open item from `lobby/done/WidthSystemContradictions.md` — its
  "what kol-website does on the bump" step 2 was unexecutable without first
  migrating the public site's gutters, which was never the point of the fix.

## 0.3.2

### Patch Changes

- Updated dependencies [8b4c850]
- Updated dependencies [8b4c850]
- Updated dependencies [8b4c850]
- Updated dependencies [8b4c850]
  - @kolkrabbi/kol-component@0.6.0
  - @kolkrabbi/kol-icons@0.5.0

## 0.3.1

### Patch Changes

- Updated dependencies [d194686]
  - @kolkrabbi/kol-component@0.5.0

## 0.3.0

### Minor Changes

- 8448e47: All KOL-shipped rule CSS now lives in the `components` cascade layer (theme barrel imports via `layer(components)`, `kol-framework.css` wrapped in `@layer components`). Under Tailwind v4's layer order (`theme, base, components, utilities`) consumer utility classes can now always override KOL chrome — previously every kol-\* rule silently beat every utility because unlayered CSS wins over all layered CSS. Tokens-only files (`kol-brand-color.css`) and `@theme` blocks are unaffected. No import-order changes required in consumers.

### Patch Changes

- 8448e47: Renamed the icon package `@kolkrabbi/kol-loader` → `@kolkrabbi/kol-icons`. The name now describes the domain (icons) rather than the load mechanism, matching the `theme`/`component`/`framework` convention. The public API is unchanged (`Icon`, `ICONS`, `ICON_ENTRIES`, `SOLID_ICON_ENTRIES`, `ICON_INDEX`, `ALL_ICONS`, `hasIcon`, `getCategory`).

  Consumers must update the import specifier and the Tailwind `@source` glob to `@kolkrabbi/kol-icons`. `component` and `framework` retarget their internal dependency to the new name (patch).

- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
  - @kolkrabbi/kol-icons@0.4.0
  - @kolkrabbi/kol-component@0.4.1

## 0.2.1

### Patch Changes

- Updated dependencies [1394844]
- Updated dependencies [1394844]
  - @kolkrabbi/kol-component@0.4.0

## 0.2.0

### Minor Changes

- d3b4398: Monorepo-batch P2 — shell set + framework reconciles: new `SearchInput` atom, `ShellDrawer` + `ShellSearchOverlay` molecules, `ShellHeader` framework chrome. Additive merges into existing framework components: `PortalFooter` (brand/columns/socials/note slots), `AppShell` (header/footer slots + `ShellTocContext`/`ShellTocCollapsedContext` + xl TOC rail), `SideNav` (onNavigate/controlled-collapse/collapsibleSections/isActive seams). `PageSection` verified already-equivalent — no change.

### Patch Changes

- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
  - @kolkrabbi/kol-component@0.3.0

## 0.1.3

### Patch Changes

- fa8ce05: New `CopyButton` atom — the copy-to-clipboard chip (clipboard icon + Copy/Copied swap, 1.8s reset, silent on blocked clipboard) extracted from CodeBlock's inline button so it's a logged atom before being lifted into composites. `CodeBlock` now nests it. Chip look lives in kol-theme (`.kol-copy-btn`); kol-framework's `.kol-codeblock-copy` slims to positioning only. Props: `text` (string or thunk), `label` (false = icon-only).
- fa8ce05: Type-conformance sweep: freestyle Tailwind text sizing replaced with kol type classes throughout component source (rule: helper scale for single-line chrome, line-height-bearing sets for anything that wraps — see docs/typography/01-type-classes.md). Avatar initials now ride the helper scale (`xl` drops 30→20px, the largest helper stop); ToggleCheckbox/ToggleSwitch hints → `kol-helper-10`; Accordion chevron → `kol-helper-16`; SideNav collapse glyph → `kol-helper-14`; AssetPlaceholder note → `kol-helper-12`, its wrappable label → `kol-mono-12`.
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
- Updated dependencies [c750436]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
  - @kolkrabbi/kol-component@0.2.0
  - @kolkrabbi/kol-icons@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [de4c33f]
  - @kolkrabbi/kol-icons@0.2.0
  - @kolkrabbi/kol-component@0.1.2

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
- Updated dependencies [fcfa14c]
  - @kolkrabbi/kol-icons@0.1.1
  - @kolkrabbi/kol-component@0.1.1
