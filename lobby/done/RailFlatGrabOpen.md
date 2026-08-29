---
component: NavRail (kol-shell) · AppShell
source: kol-mirror/src/components/NavRail.jsx#L1-L220 · kol-mirror/src/styles/components.css#L198-L233 · kol-mirror/src/App.jsx (Shell)
staged: 2026-08-28
status: draft
deps: [AppShell, NavHiddenContext, Button, Icon, Logomark, gsap]
---

# RailFlatGrabOpen

## Purpose

**The app rail is the flat 48px column again — one fixed div, every child a direct child — not a collapsed `SideNav`.** User ruling 2026-08-28, built and verified in kol-mirror; it **reverses `RailSideNavPixelParity`** (done, kol-shell 0.13.0). His words, on the monitor rail he measured for it: *"the div structure is super simple ok … it's 1 div parent and everything is just in that container"* — and on the SideNav-backed shell rail that replaced it: it was *"impossible"* to get this shape out of it.

The grab opens it: *"when you grab it should not move the icons one pixel, only reveal the title, and a chevron to see sub categories"* — and *"when it opens it should push the main content inside."* The pill is kol-r2b2's, verbatim (*"make it like it is in kol-r2b2, it has animation and gsap"*).

Ships to all three shell consumers — mirror, monitor, fxr (*"it doesn't matter where we develop, it goes to all 3"*).

## Anatomy

```
div  rail        fixed inset-y-0 left-0 · width var(--kol-shell-rail-width) · z 70
│                bg-surface-primary border-r border-fg-08
│                flex flex-col items-start pt-4 pb-4 px-2 gap-2
├─ div .rail-grab            absolute inset-y-0 right:-3.5px w:8px  (the pill is its ::before)
├─ div  logo row             flex items-center gap-3 w-full overflow-hidden shrink-0 pt-1 mb-4 · cursor-pointer text-oq-96 · → '/'
│   ├─ span                  w-8 flex justify-center shrink-0  →  Logomark 20
│   └─ span                  kol-helper-12 uppercase flex-1 min-w-0 truncate  →  app name
├─ RailItem ×N               (items)
├─ div                       flex-1                                  ← the spacer IS the layout
├─ div  rule                 self-stretch -mx-2 border-t border-fg-08  (full rail width, out past the px-2)
└─ RailItem ×N               (bottomItems — Settings)

RailItem
├─ div  row                  flex items-center gap-3 w-full overflow-hidden shrink-0
│   ├─ Button                iconOnly · iconSize 20 · variant nav · size md · shrink-0 · 32×32
│   ├─ span  label           kol-helper-12 uppercase text-oq-96 flex-1 min-w-0 truncate · cursor-pointer
│   └─ Button  chevron       only with `sub` · iconOnly chevron-right|chevron-down · 16 · nav · sm · shrink-0
└─ div  sub row ×N           only while rail open AND chevron open · flex items-center w-full overflow-hidden shrink-0 pl-11
    └─ span                  kol-helper-12 uppercase text-oq-64 hover:text-oq-96 truncate
```

Closed, every row is 32px wide (48 − px-2) — the rung alone shows; the label and chevron exist but are clipped by the row. Open, the row is 248 wide and the clip reveals them. **Nothing in the icon column moves between the two states.** The logo's `w-8 flex justify-center` box is there so the 20px mark sits on the same x as the 20px glyphs below it.

## Variants

None (single form) — two **states**, closed 48 / open 264, on one component. No theme toggle in either (the toggle is on Settings → Display; `RailSettingsDisclosure`'s panel is not this).

## Props

| prop | type | default | controls |
|------|------|---------|----------|
| `items` | `{ icon, path, label, sub?: [{ path, label }] }[]` | `[]` | the rungs; `sub` renders the chevron and the indented sub rows |
| `bottomItems` | same | `[]` | pinned below the rule (Settings) |
| `logomark` | `{ svgUrl, title }` | — | the mark + the app name (uppercase) beside it when open |
| `currentPath` | string | `''` | active match — `'/'` exact, else prefix → `aria-current="page"` |
| `onNavigate` | `(path) => void` | — | every click, including the mark → `'/'` |

## Styling

**Geometry (measured off kol-monitor, user 2026-08-28):** rail 48 · `pt-4 pb-4 px-2 gap-2` · logo row `pt-1 mb-4` · rung 32×32 with a 20px glyph · rule 1px `fg-08` full width · `border-r border-fg-08` · `bg-surface-primary`.

**Ink:** every rung carries `style={{ color: 'var(--kol-oq-96)' }}` inline — `variant="nav"`'s oq-64 is too dim here (user: *"make the color .96 on every icon in the rail"*). Active is the nav variant's own `aria-current="page"` look.

**Type:** labels and the app name are `kol-helper-12 uppercase` (user: *"uppercase CONSISTENCY"*). Sub rows `text-oq-64 hover:text-oq-96`.

**Width:** ONE variable, `--kol-shell-rail-width` on `:root` — the rail is `width: var(--kol-shell-rail-width)` and AppShell's content wrapper is `marginLeft: var(--kol-shell-rail-width)` (`0` when nav is hidden). Set to `48px` on mount, written per pointermove during a drag, gsap-tweened on release. fxr's `RailFrame` already reads this token and needs no change.

**The pill — `.rail-grab` (components.css#L198-L233):**

```css
.rail-grab { position:absolute; top:0; bottom:0; right:-3.5px; width:8px; cursor:col-resize; touch-action:none; }
.rail-grab::before {
  content:''; position:absolute; left:50%;
  top: clamp(2.25rem, var(--rail-grab-y, 50%), calc(100% - 2.25rem));
  translate:-50% -50%; width:0.125rem; height:4.5rem;
  border-radius:var(--kol-radius-full); background:var(--kol-fg-64); opacity:0;
  transition: opacity 1800ms cubic-bezier(0.45, 0, 0.55, 1) 400ms, background-color 500ms ease;
}
.rail-grab.is-near::before, .rail-grab.is-dragging::before { opacity:1; transition-delay:40ms; }
.rail-grab:hover::before,   .rail-grab.is-dragging::before { background:var(--kol-fg-96); }
```

`right:-3.5px` puts the 8px strip's centre on 47.5 — the centre of the 1px border in a 48px border-box — so the pill sits ON the line. The clamp is half the pill's length: it slides the edge and stops flush. The curve is a symmetric in-out on purpose: r2b2's ease-out popped the first 20% and crawled the rest, which the user read as a jerk.

**App-specific bits to DROP:** `zIndex: 70` (the old mirror rail's number — the DS picks its layer); `RAIL_W` / `CLOSED` / `OPEN` constants — `OPEN` is `--kol-sidenav-w` (264, 320 ≥1536) and should read the token; the inline oq-96 colour becomes the nav variant's ink at this size or a prop.

## States & interactions

**Proximity (`useGrabEdge`, one `window` pointermove, rAF-throttled):**
- `is-near` within **20px** of the line; sleeps only past **40px** (hysteresis — sitting on the line flapped the class every frame and restarted the fade).
- The pill sits on the nearest of **MARKS 20 / 40 / 60 / 80 %** of the rail height (user: *"snap to something? like 20 40 60 80 mark of the rail"*) and is **sticky**: once seeded it leaves its mark only when the pointer is within 30 % of the pitch (`0.2 × 0.3`) of another (user: *"following the mouse a little too much"*). The middle of each gap is dead.
- Travel is `gsap.to(strip, { '--rail-grab-y': px, duration: 2.8, ease: 'power3.out', overwrite: 'auto' })`; the first sighting is `gsap.set` (the CSS fallback is `50%`, nothing to tween from).

**Drag (`useRailDrag`, pointer capture on the strip):**
- `pointerdown`: capture, `gsap.killTweensOf(root)`, remember `x` and the rail's `offsetWidth`, add `is-dragging`.
- `pointermove`: `--kol-shell-rail-width = clamp(startW + dx, 48, 264)px` on `:root` — DOM, not state.
- `pointerup` / `cancel`: travelled > 3px → snap to the nearer state (midpoint 156); no travel → **toggle**. Snap is `gsap.to(root, { '--kol-shell-rail-width': `${w}px`, duration: 0.5, ease: 'power3.out' })`; `onSnap(open)` is the one React state (sub rows render only while open — closed, they would still take height and push the rungs).

**Rows:** hover/active are the nav Button's. Chevron `aria-expanded`. Sub rows are label-only.

**Settings rung is a toggle** (user: *"click settings opens settings, click again closes"*): consumer wiring in AppShell's `onNavigate` — `/settings` while on `/settings` navigates to the last non-settings path. Rail-side it is just a `bottomItems` rung.

## Dependencies

DS: `Button` (`@kolkrabbi/kol-component/atoms/Button`, `iconComponent={Icon}` from kol-icons — glyphs `nav-*`, `chevron-right`, `chevron-down`), `Logomark` (kol-shell), `NavHiddenContext` (kol-shell — the studio/rack seam, unchanged). **gsap** — new to kol-shell unless kol-framework already carries it for `useDragResize`; if the DS won't take it, the width snap can be a CSS transition on the variable and the pill's travel a `transition: top`, but the r2b2 feel is the tween.

Consumer-only, keep in AppShell not the rail: `railToggleKey` `\`, `navKeys` ⌥1–9, the rail-returns-on-route-change reset (mirror does it as a render-time adjust, not an effect — `react-hooks/set-state-in-effect`), `pageWash`, the Settings toggle above.

## Recreation notes

- **Tier:** kol-shell `NavRail` — replace the `SideNav` mapping (0.13.0) with this component; `AppShell` keeps the root `.kol-app-shell` + content wrapper, drops `.kol-brand-layout` and the grid, sets `marginLeft: var(--kol-shell-rail-width)` on the content. **kol-framework.css is then not required by the shell** — mirror imports it today only for `.kol-brand-layout`.
- **The variable is the DS's:** kol-theme defines `--kol-shell-rail-width` at `:root` (`kol-components-shell.css`) from the sidenav tokens; here it is the rail's LIVE width, written by the rail. Own that in one place — the `:root[data-sidenav]` rules stop applying to an app rail.
- **CSS home:** `.rail-grab` → `.kol-shell-rail-grab`. Its **transitions belong in the theme's `animation.css`** (being created by the DS agent, 2026-08-28) — the opacity curve and the colour ease are motion, not geometry; the box (strip, pill size, the clamp, `--rail-grab-y`) stays with the shell's other rail rules. The pill itself may unify with `SideNavGrabResize` — but on r2b2's numbers, not the DS's 3 × 32.
- **Peers:** `RailLogomarkAtTop` stands (mark at the top, both states). `RailSettingsDisclosure` does not apply — settings is a route toggle, the theme toggle is on the page. `RailSideNavPixelParity`'s pixel argument is settled the other way: the rail doesn't share pixels with SideNav because it never becomes a SideNav.
- **Casing at the call site:** `uppercase` is on the label span here — the DS rule is no auto text-transform, so either the class stays as the rail's own type decision (the user's ruling) or the consumer passes uppercase strings.
- Mirror carries `src/components/NavRail.jsx` + the CSS block until the release; monitor and fxr wait on the bump.

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-shell 0.16.0** + **kol-theme 0.88.0**. mirror's `NavRail.jsx` promoted, with the app-specific bits dropped as the entry asked:

- **The anatomy, as filed** — one fixed div, `pt-4 pb-4 px-2 gap-2`, logo row (`w-8` centring box so the 20px mark sits on the glyphs' x), rungs, `flex-1` spacer, full-width rule, pinned rungs. `RailItem` is `[32px rung][label][chevron]` clipped by the row; `sub` rows render only while open.
- **The grab** — `useGrabEdge` + `useRailDrag`, verbatim in behaviour. `zIndex: 70` dropped for `.kol-shell-rail`'s `--kol-z-sticky` (a rail above modals is the bug in the other direction). `CLOSED` is 48; `OPEN` reads `--kol-sidenav-w` at drag time, so it lands on the ladder's rung (264, 320 ≥1536) instead of a constant. `--rail-grab-y` → `--kol-rail-grab-y`.
- **The pill is the DS's** — `.kol-rail-grab` shipped in kol-theme's new `kol-animation.css` (theme 0.84.0, the motion sheet), and its pointer numbers — near/sleep hysteresis, the 20/40/60/80 marks and their stickiness, travel, snap, click slop — are `GRAB` in kol-component's `utilities/motion`. Neither is hand-typed in the rail.
- **`--kol-shell-rail-width` is the rail's again** (theme 0.88.0): back to `48px`, the sidenav-derived overrides gone. `AppShell` offsets the content by it and zeroes it while the rail is hidden.
- **Dropped with the SideNav rail**: the `kol-framework` peer, and the `settings` / `themeToggle` props. `gsap` is a new peer of kol-shell.

Not carried, deliberately: the inline oq-96 per rung stayed inline (the entry offered "the nav variant's ink at this size or a prop" — the rail also carries the `.kol-shell-rail .kol-btn-nav` rule, so the inline is belt-and-braces until a consumer proves it redundant); the Settings-rung toggle is consumer wiring, as the entry says.

Verified in source + showcase build only — **no browser**. Remainder in kol-mirror: bump both, delete `src/components/NavRail.jsx` and the `.rail-grab` block, mount the DS rail (or AppShell), and re-verify the drag on screen. Monitor and fxr: same component, their own tickets.
