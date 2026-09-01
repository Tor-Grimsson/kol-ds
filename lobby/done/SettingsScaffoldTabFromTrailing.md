# SettingsScaffoldTabFromTrailing — `trailingActions` can't reach the tab it belongs to

**Staged:** 2026-08-30 · from **kol-fxr**
**Nature:** the one seam 0.23.0's adoption cost. Small, and the fix is yours to
name — the component is right, it is missing one way out.

## What broke, and why it is your call not a defect

`SettingsScaffoldTabRows` returned as kol-shell 0.23.0 and fxr adopted it whole:
`filtersProps` override deleted, `row: 'layout'` on ABOUT / REPO, the local
`view` state and the `HEADERS` map both gone, `renderContent`'s `tab` argument
true again. **That is all correct and we are not asking for any of it back.**

One behaviour came off with it. fxr's `trailingActions` is an OPTIONS /
SHORTCUTS icon pair, and the user ruled on 2026-08-28 that it stays visible on
About and Repo — *"the row is the page's furniture, and hiding it there made the
header jump by a line every time you left Settings"* — and that **picking either
one returns you to Settings**.

That second half was:

```jsx
onViewChange={(v) => { setSettingsView(v); setView('settings') }}
```

`setView` is gone, because the scaffold owns `tab` now and exposes no setter. So
today the pair changes which settings view is selected while you sit on About,
and you have to click SETTINGS yourself to see it.

## The ask

Give `trailingActions` a way to move the tab. Either shape works and the naming
is yours:

```jsx
trailingActions={(tab, setTab) => <ViewToggle … onViewChange={(v) => { setV(v); setTab('settings') }} />}
```

or an optional controlled pair — `tab` / `onTabChange` — that leaves the
uncontrolled default exactly as it is. A render-prop is probably the smaller
change and keeps the state where the last ticket put it; a controlled pair is
the more familiar escape hatch. Your call.

What we are NOT asking for: `filtersProps` back as the answer. That is the thing
0.23.0 correctly removed, and reaching for it again would undo the ticket.

## What stays here

The behaviour is dropped in `src/pages/SettingsPage.jsx` and flagged in the
comment above `LAYOUTS`. On the return: bump, restore the jump-back through
whichever seam ships.

## Prior

`SettingsScaffoldFromFxrPage` → kol-shell 0.21.0 + 0.22.0.
`SettingsScaffoldTabRows` → kol-shell 0.23.0. fxr is the component's only
renderer and screen-checked both: masthead 65.203125 on all three views, one
destination lit at a time across the two rows, 0 console errors on five routes.

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-shell 0.24.0**. `trailingActions` now takes a **function** as
well as a node:

```jsx
trailingActions={(tab, setTab) => (
  <ViewToggle … onViewChange={(v) => { setSettingsView(v); setTab('settings') }} />
)}
```

A plain node still works exactly as before — nothing that exists moves.

### Why the render prop and not `tab` / `onTabChange`

Both shapes were offered and the controlled pair was the wrong one: it hands
page state back to the consumer, which is precisely what 0.23.0 removed one
ticket ago. Reaching for it would have undone `SettingsScaffoldTabRows` the same
way `filtersProps` would have — the ticket was right to rule that out, and the
controlled pair is the same move wearing a better name.

The render prop hands out a setter and leaves the state where the last ticket
put it.

### On the regression

This was mine. 0.23.0 took `setView` away from the page without giving the row
anything in its place, and the review missed that `trailingActions` is a NODE —
it cannot reach state the component owns. A component that takes ownership of a
value has to hand out a way to set it, or every control beside it goes read-only.

**Remainder here:** none.
