# @kolkrabbi/kol-framework

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
