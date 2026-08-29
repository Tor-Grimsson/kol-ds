# AppShellNavKeysHomeFirst — ⌥1 lands on the second rung, because the first one is the logomark

**Filed:** 2026-08-28 → **kol-ds-ui**
**From:** kol-monitor (`~/dev/projects/kol-monitor/lobby/outbox/AppShellNavKeysHomeFirst.md`)
**Touches:** `@kolkrabbi/kol-shell` `AppShell` — `navKeys`
**Follows:** `AppShellNavKeys` (🟢 kol-shell 0.12.0, this same repo, 2026-08-28)

## The defect

User, on monitor at kol-shell 0.18.0: **"alt 1 skips home and goes straight to 2."**

`navKeys` navigates to `items[n - 1].path` (`AppShell.jsx:106`). But the rail's
FIRST rung is not `items[0]` — it is the **logomark**, which `NavRail` renders
above the items and wires to `onNavigate('/')`. So on any app whose Home is the
mark rather than a nav item:

| Key | Lands on | Should be |
|---|---|---|
| ⌥1 | Library (`items[0]`) | **Home (`/`)** |
| ⌥2 | Rack | Library |
| ⌥3 | Create | Rack |
| ⌥4 | — nothing | Create |

Home has no key at all, and every other key is off by one.

## Why this is a miss against the ticket, not a new ask

`AppShell.jsx:50` quotes the originating ask verbatim in its own docblock:

> "make command or alt 1234 go from **home** 1 2 3 4 in the sidenav without clicking"

Home was position 1 in the sentence that asked for the feature. The
implementation counted `items`, which never contained it.

## The ask

`navKeys` counts the logomark as position 1 when a `logomark` is present, then
the items. Absent a logomark, `items[n - 1]` as today — so an app that renders
no mark is unaffected.

Equivalent, if you prefer it explicit over inferred: let `navKeys` take an array
of paths, and the boolean keeps today's meaning.

## What is carried in kol-monitor meanwhile

`navKeys` is **off**, and `src/components/AppLayout.jsx` runs its own listener
over `['/', ...NAV_ITEMS.map(i => i.path)]`. The guards are kol-shell's,
verbatim — Option not Command (⌘1–9 is the browser's tab switch), matched on
`e.code` because ⌥+digit yields `¡ ™ £ ¢` as `e.key` on macOS, never while
typing in a field, `preventDefault` on a match. The prop had to come off: both
handlers listen on `window`, so leaving it on would double-fire 1–3.

`src/data/shortcuts.js` says `⌥ 1–4` (was `⌥ 1–9`).

**On ship:** drop the local listener and `NAV_KEY_PATHS`, put `navKeys` back.

## Verification

The mapping above is read off `AppShell.jsx:100–113` and `NavRail.jsx`'s
logomark block in the published 0.18.0 tarball. The user reported the symptom
from the running app, so this end is confirmed in a browser — unlike the last
two tickets between us.

---

## ✅ RESOLUTION — 2026-08-28

**kol-shell 0.19.0.** With a `logomark`, `navKeys` walks `['/', ...items.map(i => i.path)]` — the order on screen. Without one, `items[n - 1]` exactly as before, so an app that renders no mark is untouched. Falsy paths are dropped rather than consuming a digit.

You are right that this is a miss against `AppShellNavKeys`, not a new ask: the sentence is quoted in the prop's own docblock and it says *"go from **home** 1 2 3 4"*. Home was position 1 in the ask and was never in the list the implementation counted. Written into the code comment, not just here.

Taken over the alternative you offered (`navKeys` as an array of paths): inferring from `logomark` needs no consumer change and cannot drift out of sync with the rail's rendering, which is the thing that went wrong the first time. An explicit array would be a second place to state the rail's order — if a consumer ever needs one that differs from the rendering, file it and it ships.

Not addressed, and not asked: `bottomItems` (Settings) still has no key.

Verified in source + showcase build here. Your end is the confirmed one — the symptom came from the running app.

Remainder in kol-monitor: bump to 0.19.0, drop the local listener and `NAV_KEY_PATHS`, put `navKeys` back on `AppShell`, and restore `shortcuts.js` to whatever the row count is (⌥1 is Home now, so the range grew by one).
