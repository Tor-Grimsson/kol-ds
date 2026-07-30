# Handoff — 2026-07-30 17:14

**Checkpoint for a context clear + reload.** Nothing is mid-edit. Every change is landed,
gated, built and published. This exists so the next session can pick the arc up cold.

## Goal of the current arc

Finish the 2026-07-30 showcase review — the half that no gate covered — using the approved
**quarantine plan** (`~/.claude/plans/gleaming-floating-dewdrop.md`): set a standard, admit
**one** category against it, let that category's standard domino into the next. The user's
words: *"starting with just 1, setting standards that domino each other."*

**Phase 0 is COMPLETE.** Phases 1–3 are not started.

## Last actions taken (causal trail, newest first)

- Published **component 0.15.1 · framework 0.10.1 · workshop 0.6.0**; `workspace:*` rewrite
  verified on the registry. A 403 mid-run was my own redundant retry over an
  already-published version, not a failure.
- **R4 · membership rule** written into `03-components/02-placement.md`. `ExitPreview` fails
  two of three tests → **flagged for removal, kept pending the owner's call.** Its demo now
  establishes a containing block so `position: fixed` stops escaping into the viewport;
  `text-transform: uppercase` removed from `.kol-exit-preview` (casing law).
- **R2 · reachability rule** + `scripts/validate-reachable.mjs`. Every route is a ⌘K row;
  tags folded into the palette via an `action` closure; `TagModeGate` lifted to wrap every
  shell route; graph toggle ungated; `?` shortcut sheet; `Alt+B` dropped; nav icon
  `link` → `library` (the former does not exist in the set).
- **R1 · rail rule**. Grid track `224px` → `auto`, width moved onto the rail's content as
  `w-56 empty:hidden`, so an empty rail collapses. Two TOC leaks fixed via `data-toc-skip`.
- **R3 · drift rule** + `scripts/validate-drift.mjs`. `mergeApi` precedence flipped so
  generated wins on `type`/`def`; five drifted values cleared.

## Current state / open decision points

**11 gates, all clean.** `roster · imports · taxonomy · groups · foundations · width · rails ·
frontmatter · references · drift · reachable`. Production build green (~5s).

| Waiting on the user | |
|---|---|
| **Phase 1 quarantine** | the plan's next step; it empties the sidebar, so it must not start unannounced |
| **`ExitPreview` removal** | flagged by R4; deleting a published export is his call |
| **`IconFrame` variant trim** | 8 shipped, only `secondary` has a consumer; secondary/nav/outline is a one-line patch |

| Known, not done | |
|---|---|
| Rail **content** per route | R1 guarantees no empty gutter; filling rails is per-category Phase 2 work |
| 219 `07-usage/` docs | frontmatter from their generators, **out of the sidebar tree** (his decision) — Phase 2 category 3 |
| 12 MDX missing `description` | all 12 exist in `registry.js`, which `sync-mdx-frontmatter.mjs` never reads |
| Origins **76/208** | 21 of 97 keys are prose titles the `^component:` regex swallowed |
| Spaced sidebar labels | `Labeled Control`, not `LabeledControl` — his decision, Phase 2 category 4 |
| `≤1024px` rail overflow | labelled toggle + footer wordmark, from the ThemeToggle brief |
| `validate-all` not in `pnpm build` | Phase 3; the build still runs only four scripts |

**Frozen, untouched:** the colour-picker arc —
`handoff-2026-07-30-1528-FROZEN-color-picker.md`. Nothing pending inside it.

## Next intended action

**Phase 1 — quarantine.** Per the plan:

1. `showcase/src/lib/admitted.js` — new hand-authored set, empty (same seam as `classification.js`).
2. `roster.js` marks each row `admitted`; `shell-nav.js` builds `SHELL_ROUTES` from admitted rows only.
3. `showcase/src/pages/Quarantine.jsx` + route `/quarantine` — everything held, with its reason and the rule it awaits.
4. `vault.js` — filter `07-usage/**` out of `VAULT_TREE` only (it stays in `VAULT`, `VAULT_SEARCH_ITEMS`, `TAG_INVENTORY`).

Then **stop for his check** before Phase 2 readmits Foundations first.

## Working memory not yet in AGENT-CONTEXT

- **The gates prove rules, the build proves syntax.** JSX comments in expression position
  passed every gate twice today while breaking the build. Run both, every time.
- **Drive the UI, don't read it.** Today's two worst bugs were invisible to reading: the
  `action` closure dropped by a row projection (rendered, matched, clicked, did nothing), and
  the `position: fixed` demo escaping its card. Both surfaced only in a browser.
- **A synthetic click loop is not a test.** React batches, so reading the DOM in the same tick
  showed a frozen label and looked like a component bug. Put real frames between actions.
- **Author-wins is right for prose and wrong for machine facts.** That one distinction
  explains R3 entirely, and the same trap sits in `sync-mdx-frontmatter.mjs` for any field a
  generator owns.
- The repo changed under me mid-session — `/references`, `extract-tokens`, `validate-references`
  and the `reuses` frontmatter field arrived from elsewhere. **Re-read state before planning;
  do not assume the map from earlier in the session still holds.**
- Ports used for verification today: 4122, 4133, 4144, 4155, 4166, 4177, 4188, 4199 — all
  confirmed closed.
