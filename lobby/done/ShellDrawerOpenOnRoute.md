# ShellDrawerOpenOnRoute — a consumer cannot open the drawer on the route where nav IS the page

**Staged:** 2026-09-01 · from **kol-mirror**
**Nature:** one seam on `AppShell`. `drawerOpen` is internal state with no way in.
**Version seen:** kol-shell **0.36.0**

## What

`AppShell.jsx:128` — `const [drawerOpen, setDrawerOpen] = useState(false)`. It is
set by exactly two things: the package's own trigger, and the route-change
effect at `:197` that closes it. There is no prop, no context value and no
imperative handle, so **a consumer cannot decide that the drawer starts open**.

`useNavHidden` is not the seam — it exposes `navHidden`, which zeroes the rail
width. That is the opposite operation.

## Why it matters (user ruling, kol-mirror 2026-09-01)

> *"the rail should load open on home, not everywhere"*

The home route **is** navigation — it is a catalog whose job is to send you
somewhere. On a phone, arriving there with the nav folded behind a hamburger
hides the one thing the page is for. Every other route is content, where the
folded rail is right and the 48px it hands back is the whole reason
`touch="drawer"` exists (`ShellRailNoDrawerOnMobile`, kol-chess).

So the policy is genuinely per-route, and per-route is exactly what the shell
cannot express today.

## Asked shape

Whichever of these you prefer — the first is the smaller surface:

```jsx
<AppShell drawerOpenOn={['/']} … />        // paths whose entry opens the drawer
<AppShell drawerDefaultOpen={isHome} … />  // consumer decides, shell obeys on change
```

The route-change close at `:197` stays as it is for every other path; this only
changes what happens on **entering** a listed one. Above `drawerBelow` it is
inert — there is no drawer to open.

If you would rather not own a path list, the honest minimum is to make
`drawerOpen` / `setDrawerOpen` available on `NavHiddenContext` (rename it or
add a sibling context) and let the consumer run its own effect. That is a
smaller decision but a bigger surface, so we would take the prop.

## Not asks

- Remembering the drawer's last state across navigations. The close-on-navigate
  behaviour is right and we are not asking you to touch it.
- Anything about the desktop rail's expanded/collapsed width. Different control,
  different ticket (`RailFlatGrabOpen` already settled the grab).

## What kol-mirror does meanwhile

**Nothing** — the drawer stays closed everywhere. A local build would mean
reaching into shell chrome from outside, which the estate forbids and which
`ShellRailNoDrawerOnMobile` already established goes here instead.

Related open item on our side: `.kol/llm-plan/04-open-items-2026-08-28.md` §4.2
— whether mirror's studio sidebar and the DS rail coexist or merge — is **the
user's call and is NOT part of this**. This ticket is only about the drawer's
initial open state on a named route.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.37.0

Your first shape, the list: <AppShell drawerOpenOn={['/']} />. Paths matched like the rail's active row — '/' exact, anything else by prefix — and the existing route-change effect now opens on ENTRY to a listed path instead of closing; every other path keeps close-on-navigate exactly as it was. It is one effect with drawer as a dep, so it fires on mount, on the fold and on navigation alike: a phone arriving on home gets the rail without a second hook. Above drawerBelow the list is inert. Default [] — nothing moves for a consumer that does not pass it. Took the list over the boolean because the policy is per-route and the shell already owns the route; the context route was the bigger surface you said it was. Verified in a real 390 render on the app-shell set (which now passes it): mount at / → open; row to /library → closed; row back to / → open; trigger still toggles either way. Not touched, as asked: remembering state across navigations, the desktop rail width.

**Remainder here:** none — kol-mirror bump kol-shell@0.37.0 and pass drawerOpenOn={['/']} on the AppShell — then check home at 390: arrive with the rail out, tap a destination and it folds.

