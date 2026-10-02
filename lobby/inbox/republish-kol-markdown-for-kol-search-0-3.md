# Republish kol-markdown so its kol-search range reaches 0.3

**Staged:** 2026-10-02 · from a kol-website session
**Change:** one dependency range in `kol-markdown`, one publish (0.1.3). Low priority.

---

## The problem, in one case

kol-website bumped to `kol-component@0.237.0` on 2026-10-02 and
`pnpm why @kolkrabbi/kol-search` in `apps/web` now reads **Found 2 versions**:

- `kol-search@0.2.0` ← `kol-markdown@0.1.2` (declares `@kolkrabbi/kol-search: ^0.2.0`)
- `kol-search@0.3.0` ← `kol-component@0.237.0` and `kol-workshop@0.37.0` (`^0.3.0`)

`kol-search` went to 0.3.0 on 2026-10-02 and `kol-markdown` was not republished;
a caret on 0.x does not reach the next minor, so every consumer of
`kol-component` installs both.

Harmless today — confirmed by the kol-ds-ui session (`kol-ds-ui-a7`) the same
day: `kol-search` is pure functions with no module-level state, and
`kol-markdown` uses one export from it (`tagGraph`, inside the deprecated
`buildTagCooccurrence` adapter), unchanged between 0.2.0 and 0.3.0. The cost is
a few KB of duplicate source. It is filed because it is the same class as
`NestedDsDependencies` / `FrameworkComponentPeer`, and it stops being harmless
the day `kol-search` grows state.

## The fix

Republish `kol-markdown` (0.1.3) with its `kol-search` range resolving to
`^0.3.0` — or as a peer, the shape the app packages already use for the DS tier.

## Rejected alternative

A `pnpm-workspace.yaml` override in the consumer. It hides the split in one
repo and leaves it in every other; kol-website carried exactly that stopgap for
`FrameworkComponentPeer` and deleted it when the package was fixed.

## Definition of done

- [ ] `kol-markdown` published with a `kol-search` range that admits 0.3.x
- [ ] in a consumer on that version, `pnpm why @kolkrabbi/kol-search` → Found 1 version
