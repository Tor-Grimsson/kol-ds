# Session: the ContentFilters fork retirement — eight publishes, one component

**Date:** 2026-08-15
**Agent:** Grim (Haiku 4.5)
**Summary:** A lobby-return hook and a `lobby-close` script were built to make closing a ticket one command; then a kol-shell ContentFilters ticket ping-ponged through eight publishes before the root cause surfaced — the component was a duplicate of one kol-component had shipped since 2026-08-01.

## Changes Made

### Files Modified — dotfiles (outside this repo)

- `claude/hooks/lobby-return.sh` — **new.** `PostToolUse(Bash)`, fires on `pnpm publish` inside a repo with a registered lobby holding live tickets, injects the closer's five steps with real paths. Publish is the anchor because it is the event that makes a close real and it always happens; hooking the receipt write would only fire once the agent had already remembered the thing it forgets.
- `claude/settings.json` — registered the above under `PostToolUse` / `Bash`.
- `claude/hooks/lobby-inbox.sh` — 🗄️ collections are skipped (head-read for the marker, not a ledger parse). Closes a three-session defect: the hook counted files, so `ListGridCards` — titled **DO NOT WORK** — was announced as queued work at every boot, and since 08-15 also stamped the publish window.
- `bin/lobby-close` — **new.** `lobby-close <slug> <version> -m <substance>`: appends the resolution, moves `inbox/`→`done/`, repoints the ledger link, flips the row glyph, appends the History line, writes the same paragraph into the filer's outbox receipt, prints who to message. Deliberately NOT a `bin/lobby` subcommand — that tool is read-only by law. Registry comes from `lobby --paths`, reused rather than re-parsed.
- `docs/operations/systems/lobby/03-tooling.md` — closer's **step 5** (tell the filing repo) written down for the first time, plus the `lobby-return.sh` and 🗄️-skip sections.

### Files Modified — this repo

- `packages/component/src/organisms/ContentFilters.jsx` — the surviving implementation. Filter value is a `Tag` again (`variant="secondary"`, the atom's own `active` prop, `onClick` on the Tag itself); one row below the divider with groups as left columns and the layout strip right and always visible; `iconComponent` seam; RECENT/SAVED rendered as the same strip as LIST/GRID with `ViewToggle` removed entirely; group label uppercased in the component; icons back to `size={16}`.
- `packages/shell/src/ContentFilters.jsx` — **retired** to `_tmp/2026-08-15-kol-shell-contentfilters-fork/` with a `WHY.md`. Export dropped from `packages/shell/src/index.js`.
- `packages/shell/src/TabStrip.jsx` — the `Set` multi-select form added and removed the same day; single-select only, kept because `SettingsScaffold` uses it for real tabs.
- Changelogs + versions for both packages.

### Published

**kol-shell** 0.1.2 · 0.1.3 · 0.2.0 · 0.3.0 (BREAKING — `ContentFilters` removed) ·
**kol-component** 0.44.0 · 0.44.1 · 0.44.2 · 0.45.0. All registry-verified, 20 gates clean each time.

## Current State

### Working

- `ContentFilters` exists once, in kol-component, using the real `Tag` atom.
- Three defects fixed at the atom rather than around it: `variant="default"` was never declared, so `VARIANTS[v] ?? primary` silently rendered the FILLED chip; the active state was hand-rolled with `border-fg-*` beside Tag's own `active` prop; the click handler sat on a wrapper `<div>`, so Tag rendered a `<span>` and the interactive chip was not interactive.
- Lobby close loop is one command plus one message, and the ledger/receipt/History are no longer hand-typed.

### Known Issues

- ⚠️ **Nothing was seen rendering.** Eight publishes, all reasoned from source. The label ink was shipped wrong twice (`fg-48`, then `fg-32`) and the value ink once, every time for the same reason: **reading a component's defaults instead of the consumer's call sites**, which overrode them. kol-monitor's `labelClassName="kol-helper-12 text-fg-96"` was the truth and was never opened.
- ⚠️ A reference file existed on disk the whole time — `kol-monitor/_tmp/2026-08-15-shell-adoption/` — and was not diffed until the third QA round. Three of the regressions were differences from it.
- ⚠️ **Removing `ViewToggle` changes four surfaces nobody has looked at**: `MediaLibrary`, both kol-foundry typeface grids, kol-website's `TypefaceLibraryGridWithVariables`. It also overrides a documented 2026-07-28 user ruling (active = filled chip) on this control. Ruled by the user as "the fork's look, everywhere" — but unreviewed.
- ⚠️ The no-`text-transform` law is **not** updated in `docs/documentation/01-foundations/03-typography.md`. The code uppercases the group label; the law still does not say so. `docs/documentation/INDEX.md:32` still reads "no `text-transform` — ever".
- ⚠️ Unresolved: whether `renderFilterValue` / `labelClassName` seams come back. Removed with the fork; never ruled.
- kol-monitor has not bumped — its four call sites still import from kol-shell, which no longer exports the component.

## Next Steps

1. **Look at it rendering** before anything else ships. Seven of eight publishes had no visual check.
2. Widen the no-casing law in `01-foundations/03-typography.md` for the group label, and fix the INDEX line that says "ever".
3. Review the four `ViewToggle` surfaces; if kol-website objects, the conflict is between two of the user's own rulings.
4. Rule the seams question.
5. The 46 listed-not-built demos are still untouched.
