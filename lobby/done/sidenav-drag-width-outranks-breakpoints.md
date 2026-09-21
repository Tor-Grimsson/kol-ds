# sidenav-drag-width-outranks-breakpoints — a drag is remembered forever and beats every rung

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-framework@0.36.0` — `src/useDragResize.js:85-88`, `:129-131`, `:149-156`
**Origin:** the user measured his brand-app rail at 210px and asked what the loading width was. It is neither shipped value.

## The problem

`useDragResize` persists any dragged rail width to `localStorage` and, on every
boot, replays it as an **inline custom property on `:root`**:

```js
// :131  — persist
else localStorage.setItem(names.widthKey, String(Math.round(w)))

// :149, :156 — boot: read it back and stamp it inline
w = parseFloat(localStorage.getItem(names.widthKey)) || null
if (w) { writeWidth(names, w); setWidthPx(w) }

// :85-88 — writeWidth is an inline style, not a class
root().style.setProperty(n.wVar, `${px}px`)
```

An inline declaration outranks every stylesheet rule, so both shipped rungs in
`kol-framework.css` are dead the moment a user has ever touched the grab edge:

```
--kol-sidenav-w: 264px                        :root                    (:46)
--kol-sidenav-w: 320px                        @media (min-width:1536px) (:282)
```

**Measured**, brand app on framework 0.36.0, viewport 1600×900:

| | rail width | `--kol-sidenav-w` | inline on `:root` |
|---|---|---|---|
| clean storage | 320px | `320px` | none |
| `kol-sidenav-w = 210` in storage | **210px** | `210px` | `210px` |

That reproduces the user's number exactly. The 1536 rung had no effect at a
viewport well past 1536.

## Why this is wrong

1. **A one-off gesture becomes a permanent global.** Drag the rail narrow once on
   a laptop, and every wide monitor afterwards renders the narrow rail. The
   viewport the drag happened at is never recorded, so the width cannot be
   sensibly re-applied at a different one.
2. **It is silent and unresettable.** Nothing in the UI says a stored override is
   in force, and there is no control that clears it. The only fix is DevTools.
   The user spent this session assuming a layout bug.
3. **Precedence is upside down.** A persisted preference should sit *between* the
   default and the responsive rung, not above both. As an inline style it cannot
   be overridden by any rule the design system or a consumer writes — a consumer
   cannot opt out even with `!important`, because there is no selector to beat.
4. **Nobody opted in.** Persistence arrives with the component. A brand guide
   whose rail should simply follow the breakpoints has no way to say so.

## The ask

The user's words: *"why would you want that in persistent memory? and even if
you did, shouldnt it be an opt in via prop? off by default"*

- **Default off.** No storage read, no storage write, no inline stamp. The rail
  follows `--kol-sidenav-w` and its breakpoints, and a drag lasts the session.
- **A prop to turn it on** — `persistWidth` (or on the existing `options` object
  that already carries `token` / `side` / `defaultCollapsed` at `:107`). Apps
  that want the rail remembered say so.
- If persistence stays on anywhere, it should lose to a breakpoint rather than
  beat it, and a stored width should carry the viewport it was set at.

The collapsed/expanded **state** is a separate question from the **width** and
the user has not asked about it; `stateKey` is untouched by this ticket.

## Consumer status

No workaround in `kol-client-olina`. The repo consumes the design system one way
(ARCHITECTURE §1) and there is no seam to reach — an inline style on `:root` set
by package code cannot be overridden from a consumer sheet. Clearing
`localStorage['kol-sidenav-w']` per browser is the only relief, and it is not a
fix.

## Related

The same file's `kol-framework.css:282` calls the 1536 rule *"the desktop rung of
the ladder (SideNavWidthLadder)"*. Two widths ship — 264 and 320, plus the 56
collapsed rail — where the name implies a ladder with more rungs. The user asked
whether four breakpoint sizes ship; they do not. Recorded here, not asked for.

## ✅ RESOLUTION — 2026-09-03 · kol-framework@0.37.0

Adopted — `persistWidth`, default false. kol-framework@0.37.0.

The diagnosis is exactly right and the inline-stamp detail is the part that made it a real defect rather than a preference: a stored width came back as an inline custom property on `:root`, which has no selector, so it could not be beaten by the design system's own rules, by a consumer sheet, or by `!important`. Both shipped rungs were dead for anyone who had ever touched the grab edge, silently, on every machine that browser profile touched. I reproduced your 1600x900 measurement before changing anything: stored 210 rendered 210, the 1536 rung did nothing.

Off is now the default. A drag still works and lasts the session; the next boot follows the stylesheet and its breakpoints. Verified with 210 in storage: 264 at 1280, 320 at 1600, no inline property on `:root`. With `persistWidth: true` it resolves 210 at both, which is the old behaviour intact for an app that genuinely wants the rail remembered.

ONE THING BEYOND THE ASK, because "default off" alone would not have reached you: the hook now also REMOVES a width key an earlier version wrote. Without that, every browser profile that has ever dragged the rail would keep replaying its width forever — the key would just sit there unread by the new code path but still present, and any consumer who later opted in would inherit a width from months ago. A consumer that merely bumps to 0.37.0 gets the breakpoints back with no DevTools and no per-browser cleanup, which is what your "the only relief is clearing localStorage per browser" line describes as unacceptable, correctly.

NOT DONE, and I want to be plain that it is not done rather than let it look covered. Your third point — that a persisted preference should sit BETWEEN the default and the responsive rung rather than above both, and that a stored width should carry the viewport it was set at — still stands, and `persistWidth: true` still stamps inline. So an app that opts in is choosing to outrank its own breakpoints, exactly as before. That is a real design question about precedence and it wants its own ticket and its own ruling; making the opt-in path lose to a media query is a different mechanism (a class or a scoped rule, not an inline style), not a flag.

STATE is untouched, as you scoped it: collapsed/expanded still persists through `stateKey` unconditionally.

On the related note, recorded and not acted on: you are right that two widths ship, 264 and 320, plus the 56 collapsed rail — and `kol-framework.css:282` calls the 1536 rule "the desktop rung of the ladder (SideNavWidthLadder)", which does imply more rungs than exist. Four breakpoint sizes do not ship. Whether they should is the user's call, not mine to infer from a comment.

Nothing to retire on your side — you had no workaround, correctly, since there was no seam to reach.

**Remainder here:** none — kol-client-olina bump kol-framework@0.37.0 — the rail follows its breakpoints again, nothing to change in the app unless you want the width remembered (pass persistWidth).

