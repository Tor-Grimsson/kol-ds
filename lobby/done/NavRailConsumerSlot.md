# NavRailConsumerSlot — the opened rail carries a consumer slot for content that is not a row list

**Staged:** 2026-10-15 · from a kol-monitor session
**Change:** a slot in `NavRail`'s opened width + one context or prop to publish its node

---

## The problem, in one case

Monitor's opened rail carries the rack's module catalog: rows that INSERT a module into the rack or
RETURN a held one. These are actions, not paths, so `sub: [{ path, label }]` can't express them. To get
there, monitor forked `NavRail` through the `railComponent` seam on 2026-08-28 (`kol-monitor/src/rack/RackRail.jsx`):
the fork adds one thing, an always-mounted div in the opened width whose DOM node is published via a
context (`useRailSlot`), and the rack portals `RackRailPanel` into it.

The fork was copied from kol-shell 0.17.0 and re-synced to 0.38–0.40. It's now 225 lines against
NavRail 0.63.0's 379, and nearly every line differs. Monitor's next bump (0.40 → 0.63) means
re-forking from scratch, and it'll drift again on every NavRail change after that.

## The fix

NavRail renders a slot below its rows when open, and exposes the node. Either shape works for us:

- a `slot` render prop on AppShell → NavRail (`slot={(open) => <Panel/>}`), or
- a `RailSlotProvider` / `useRailSlot()` pair exported from kol-shell (monitor's shape, `src/hooks/useRailSlot.jsx`,
  30 lines: `{ slot, setSlot, railOpen, setRailOpen }`). The rail sits outside the page's providers, so a
  portal target lets the page render with its own state.

The slot is always mounted, empty when nothing is portalled in (the panel keeps its state across open/close),
and it's the opened width's flex-1 spacer when empty.

## Rejected alternative

Action sub-rows (`sub: [{ onSelect, label, meta }]`). This was the first idea in the fork's header, but it's
a bigger API and it still couldn't carry the category filter and the workbench section. The slot covers all of it.

## Definition of done

- [ ] NavRail's opened width has a consumer slot; no slot passed → today's render, byte for byte
- [ ] the slot survives open/close without remounting its content
- [ ] monitor can drop `railComponent={RackRail}` and retire the fork to `_tmp/`

## ✅ RESOLUTION — 2026-10-15 · kol-shell@0.64.0

kol-shell exports RailSlotProvider / useRailSlot (monitor's shape: { slot, setSlot, railOpen, setRailOpen }). Under the provider NavRail's opened width carries a slot below the rows, always mounted — zero tall closed, flex-1 open with the rows shrunk to content — and publishes its node; the page portals in with its own state. No provider → no slot, the rail unchanged. Verified: a portalled panel kept its click count across open → close, slot 0px closed / 700px open, railOpen mirrored true, no slot without the provider, 0 console errors.

**Remainder here:** none — kol-monitor bump kol-shell@0.64.0; drop railComponent={RackRail}, use the exported RailSlotProvider/useRailSlot, retire both forks to _tmp/.

