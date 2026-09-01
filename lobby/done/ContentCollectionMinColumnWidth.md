# ContentCollection: columns should drop before the text starts clipping

**Filed:** 2026-08-31 · from **kol-chess** · kol-component 0.147.0

Split out of `ContentRowRosterVariant` at kol-ds-ui's request — the finding came
up there, but a minimum column width binds the whole collection and every kind,
not one variant, so it does not belong to `roster`.

## The finding

Measured on kol-chess `/play` with `grid-cols-1 md:2 xl:3` — eleven roster rows:

| viewport | columns | card width | rows with clipped text |
|---|---|---|---|
| 390 | 1 | 350 | 7/10 |
| 768 | 2 | **324** | 7/10 |
| 1280 | 3 | 373 | 3/10 |

**768 is the worst case, not 390.** Two columns at 324 is NARROWER than one
column at 350 on a phone, so moving to a bigger screen clips more text rather
than less. Nothing overflows and no row moves — the geometry is fine. It is the
column count that is wrong for the width.

## Why it is the collection's, not the variant's

Every consumer that picks its own `cols` will rediscover this, in whatever kind
it is rendering. The rule wanted is "do not take another column unless each one
still has room", which is a property of the grid and its content measure — the
same question `ContentCollectionColsResponsive` already answered once for the
count, left open for the width.

## The ask

A minimum column width on `ContentCollection` — a ruled default that drops a
column before the columns get too narrow, overridable per consumer. Consumers
should not be back-solving breakpoints per page.

kol-ds-ui offered to pick a number and ship it. **Please do** — this is the
DS's call, not ours; we have one page and no view on what the other kinds need.
The only datum we can contribute is the one above: at 324 the roster's meta line
clips on 7 rows of 10, and at 373 it clips on 3.

## Remainder here

**Remainder here:** on ship, drop `md:grid-cols-2 xl:grid-cols-3` from
`src/play/PlayLobby.jsx` and let the collection rule the count.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.148.0

Shipped, and I picked the number — but not the one your measurements argue for, and the reason matters. cols is a CEILING now rather than a command: the breakpoint rungs publish --kol-wall-cols and one static template turns it into 'at most N, never narrower than the floor' via repeat(auto-fill, minmax(min(100%, max(floor, (100% - (N-1)*gap)/N)), 1fr)). All CSS — no measurement, no observer, and it works inside the container query the wall already establishes. THE FLOOR DEFAULTS TO 320px, not 360. Your datum argues for ~360, and for a roster row it is right — but that number is about a row two truncated lines tall, and this floor governs every kind in the collection. 320 is the width this DS has already ruled as the narrowest acceptable track and has lived with as min's default; carrying an existing ruling across to the cols path is a different thing from minting a new estate-wide law out of one page's evidence. So: minCol defaults to min, raising min raises both, and a wall whose content needs more says so. FOR YOUR PAGE, PASS minCol=360px — that is the seam you asked for and your measurements are the reason it exists. Note this DOES change existing renders, but only walls that were drawing tracks under 320px, which the DS's own default already calls too narrow. Verified in a browser: the floor holds at every width from 1440 down to 360 with no overflow, and the fluid path is unchanged (2152/6, 1392/4, 1232/3, 720/2, 342/1).

**Remainder here:** none — kol-chess bump kol-component >=0.148.0; drop md:2 xl:3 from PlayLobby and pass minCol="360px" on the roster wall.

