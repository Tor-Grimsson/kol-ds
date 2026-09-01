# AppShell: no touch policy folds the rail into a drawer

**Filed:** 2026-08-31 · from **kol-chess** · kol-shell 0.30.0

## The ask

`AppShell` needs a `touch` policy — call it **`drawer`** — that below a width
breakpoint takes the rail off-canvas, hands its width back to the content, and
exposes a visible trigger to bring it in over a scrim.

Everything except the trigger and the breakpoint already exists in the package.

## Why the three existing options do not cover it

| `touch` | what it does | why it is not this |
|---|---|---|
| `shell` (default) | the rail regardless | the 48px is the complaint |
| `bare` | no chrome at all on a coarse pointer | throws navigation away entirely — there is then no way to reach another page |
| `overlay` | keeps the shell, mounts `TouchDeviceOverlay` | a this-is-a-desktop-app notice; the app works fine on a phone |

And the rail's own hide, `railToggleKey`, is a **keyboard** key. A phone has no
keyboard, so on the device where the rail costs the most it cannot be dismissed
at all.

## The user's words

On a 390px iPhone, looking at `/play`: *"on mobile sidnav should fold into a
hamburger menu, this takes too much real-estate."* At 390 the rail is 12.3% of
the viewport, and it is 12.3% spent on chrome in the one place there is none to
spare — the board went from 302px to 350px the moment it folded.

## Two things block a clean consumer-side build

Both are the reason this is a DS ticket and not just our CSS.

1. **The width token is written INLINE on `:root`.** `NavRail` does
   `gsap.set(root, {'--kol-shell-rail-width': …})` and `root.style.setProperty`
   per pointermove, so a consumer stylesheet cannot reach it without
   `!important` — twice, because the rail's own `width` is an inline
   `var(--kol-shell-rail-width)` too. Two `!important`s to move a token the
   package owns is the smell that says this belongs upstream.

2. **`AppShell` force-SHOWS the rail on every navigation.**
   `useEffect(() => { setNavHidden(false) }, [currentPath])` is right for
   `railToggleKey` (ShellHomeSystem, 2026-08-27) and exactly backwards for a
   drawer, where tapping a destination must CLOSE it. It also makes `navHidden`
   unusable as the consumer seam: child effects run before parent effects, so a
   consumer hiding the rail on a path change is overwritten in the same commit.

## What we did meanwhile (consumer-side only — no DS source touched)

Per the 2026-08-31 bulletin, a consumer does not edit DS source, so nothing in
kol-shell was changed. The fold is entirely ours and reversible in one delete:

- `src/MobileNav.jsx` — the trigger, the scrim, and when to close (navigation,
  Escape, scrim tap). Uses `Button iconOnly="hamburger" / "x"`, both DS icons.
- `src/index.css` — one `@media (max-width: 767px)` block: token to `0px`
  `!important`, `.kol-shell-rail` to `240px !important` and
  `translateX(-100%)`, back to `0` on `body[data-rail-open='true']`.

**The DS rail is still the only navigation** — same component, same state,
gestures and shortcuts. Nothing is forked and no nav chrome was rebuilt; only
the trigger and the fold are local.

Verified at 390: 8/8 routes carry the trigger at 32×32 (above the 24px touch
floor), no route overflows, the drawer opens to 240px with labels revealed by
NavRail's own clip, tapping a destination navigates and closes, and at 1440 the
rail is an untouched 48px with no trigger rendered. Screenshots in `_assets/`.

## Suggested shape

`touch="drawer"`, with the breakpoint a prop (`drawerBelow`, default 768) since
"coarse pointer" is the wrong test — an iPad is coarse and has room, a narrow
desktop window is fine-pointered and does not. Ship the trigger inside
`AppShell` so it lands in one place rather than every consumer's page header,
and make the close-on-navigate conditional on being in drawer mode rather than
the unconditional `setNavHidden(false)` that stands today.

## Remainder here

**Remainder here:** delete `src/MobileNav.jsx`, the `index.css` media block, and
the paragraph in `src/Shell.jsx` that explains them; set `touch="drawer"`.

---

## Resolution — 2026-08-31 · 🟠 addressed — not screen-verified

**Shipped: `@kolkrabbi/kol-shell` 0.31.0 + `@kolkrabbi/kol-theme` 0.112.0**, in
the shape you suggested. Marked 🟠 rather than 🟢 for one reason, stated plainly
at the bottom.

`touch="drawer"` + `drawerBelow` (default 768). Below the breakpoint the rail goes
off-canvas, the content takes the width back, and a trigger brings it in over a
scrim; Escape and a scrim tap close it, and so does navigating.

**Both blockers are fixed upstream, not worked around.**

1. **The inline width token.** `NavRail` takes a `drawer` prop: in drawer mode the
   grab strip is not rendered, `useRailDrag` returns before it ever runs, and the
   rail sizes from `--kol-shell-drawer-width` (240px) instead of the live rail
   token. So nothing writes `--kol-shell-rail-width` on `:root` per pointermove,
   and **no `!important` exists anywhere in the fold** — the CSS is not fighting an
   inline style because there is no longer an inline style to fight.
2. **The forced show on navigate.** The effect is mode-aware now: drawer closes,
   `railToggleKey` still restores. That also unblocks `navHidden` as a consumer
   seam — your read on child-before-parent effect order was correct.

**JS owns the breakpoint, CSS only paints.** The fold state is stamped as
`data-rail-drawer="open|closed"` on the shell root; the theme keys the transform
off that attribute rather than a media query, because the width is a prop and a
query would be a second source of truth for it.

**The trigger ships inside `AppShell`** — 32px, `hamburger` / `x`, `aria-expanded`
— so it lands once rather than in every consumer's page header.

### ⚠️ Not screen-verified, and you are the one who can
25 gates clean and the source is verified, but **this repo has no `AppShell`
surface in the showcase**, so the drawer has not been rendered in a browser here
and I did not add a page to make one. Your consumer-side fold is the reference
implementation for the behaviour; please confirm on device before deleting it.

### Remainder for you, when you have
Delete `src/MobileNav.jsx`, the `index.css` media block and the paragraph in
`src/Shell.jsx`; set `touch="drawer"`. Bump kol-shell ≥0.31.0 and kol-theme
≥0.112.0.

### Definition of done
- [x] A `drawer` touch policy exists, with the breakpoint as a prop
- [x] The rail goes off-canvas and the content reclaims the width
- [x] A visible trigger, shipped in AppShell, over a scrim
- [x] Close-on-navigate is conditional on drawer mode
- [ ] ⚠️ Confirmed on a real phone — yours to do

## ✅ RESOLUTION — 2026-08-31 · kol-shell@0.31.0

touch=drawer + drawerBelow (default 768), in the shape you suggested. Both blockers are fixed upstream rather than worked around. The inline width token: NavRail takes a drawer prop, so in drawer mode the grab strip is not rendered, useRailDrag returns before it runs, and the rail sizes from --kol-shell-drawer-width instead of the live token — nothing writes --kol-shell-rail-width on :root per pointermove, and the fold carries NO !important anywhere because there is no longer an inline style to fight. The forced show on navigate: the effect is mode-aware now, drawer closes and railToggleKey still restores, which also unblocks navHidden as a consumer seam — your read on child-before-parent effect order was right. JS owns the breakpoint and stamps data-rail-drawer on the shell root; the theme keys off that attribute rather than a media query, because the width is a prop and a query would be a second source of truth for it. The trigger ships inside AppShell (32px, hamburger/x, aria-expanded) so it lands once rather than in every consumer's page header. WARNING BEFORE YOU DELETE ANYTHING: this repo has no AppShell surface in its showcase, so the drawer has never been rendered in a browser here — 25 gates and the source are verified, the screen is not. Your consumer-side fold is the reference implementation. Confirm on device FIRST, then delete.

**Remainder here:** none — kol-chess bump kol-shell >=0.31.0 and kol-theme >=0.112.0; set touch=drawer and CONFIRM ON DEVICE before deleting src/MobileNav.jsx, the index.css media block and the Shell.jsx paragraph.

