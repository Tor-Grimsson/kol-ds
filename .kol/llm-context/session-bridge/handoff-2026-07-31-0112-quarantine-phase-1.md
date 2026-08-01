# Handoff — 2026-07-31 01:12

**Phase 1 of the quarantine plan is BUILT and sitting at its check.** Nothing is mid-edit;
gates and build are green. What it needs is his eyes on an empty shell, not more code.

## Goal of the current arc

Finish the 2026-07-30 showcase review — the half no gate covers — via the approved
quarantine plan (`plan-2026-07-30-quarantine-reimport.md`): set a standard, admit **one**
category against it, let that category's standard domino into the next. His words:
*"starting with just 1, setting standards that domino each other."*

**Phase 0 complete. Phase 1 built, unchecked. Phases 2–3 not started.**

## Last actions taken (causal trail, newest first)

- `docs/documentation/04-compositions/02-shells.md` — new **THE ADMISSION GATE** section
  (the four-layer table, the tree-not-existence rule, the list-not-groups filter, the
  `07-usage/` out-of-tree decision). Doc-sync hook fired on `ShellChrome.jsx`.
- `scripts/validate-reachable.mjs` **E1 strengthened**: search must flatMap `ALL_ROUTES`,
  not the admitted `SHELL_ROUTES`. Without this the reversible gate silently reintroduces
  the exact defect R2 exists to stop — every held surface unfindable by name.
- `vault.js` — `07-usage/**` filtered out of `VAULT_TREE` **only**; still in `VAULT`,
  `VAULT_SEARCH_ITEMS`, `TAG_INVENTORY`, and its routes still resolve.
- `showcase/src/pages/Quarantine.jsx` + route `/quarantine` — every held category with what
  it holds, the rule it awaits (suffix-matched into the vault, so a moved doc degrades to
  plain text rather than a dead route) and why.
- `ShellChrome.jsx` — component tree + grouping toggle hidden unless a component category is
  admitted; vault tree hidden unless `documentation` is.
- `shell-nav.js` — `ALL_ROUTES` (complete, what search reads) split from `SHELL_ROUTES`
  (admitted + Quarantine); `componentTreeRoutes` filters the LIST via `ADMITTED_COMPONENTS`.
- `roster.js` rows carry `admitted`; `showcase/src/lib/admitted.js` is the new hand-authored
  gate — one `ADMITTED` set plus the 9-category table.
- **Foundations chosen as the one admitted category** — the plan fixed the order (phase 2
  row 1, "everything downstream cites it") and it is the only category whose gate is already
  closed: R3's wrappers landed on the swatch grid + both tables, `validate:width` green.

## Current state / open decision points

**11 gates clean · production build green (3.69s) · driven in a browser, not read.**
Sidebar is Foundations (3 children) + Quarantine. 8 of 9 categories held — 189 components,
6 surfaces. ⌘K verified: typing `references` still returns *References · Surfaces* while held.

| Waiting on the user | |
|---|---|
| **The phase-1 look** | empty shell + holding page read correctly, before anything is readmitted. The plan stops here by design. |
| **`ExitPreview` removal** | R4 flagged it (fails 2 of 3 membership tests); deleting a published export is his call |
| **`IconFrame` variant trim** | 8 shipped, only `secondary` has a consumer; secondary/nav/outline is a one-line patch |
| **Sidebar label form** | `Labeled Control` vs `LabeledControl` — undecided, blocks phase 2 row 4 |
| **`docs` + `references` categories** | held with **no rule written** — neither is claimed by any phase. Own category, or absorbed into Documentation? |

| Known, not done | |
|---|---|
| `hasToc` treats an always-truthy element as content — the fix is an API change, not a patch |
| 12 MDX missing `description` (all 12 exist in `registry.js`, which `sync-mdx-frontmatter.mjs` never reads) |
| Origins 76/208 — 21 of 97 keys are prose titles the `^component:` regex swallowed |
| Rail overflow below the `lg` breakpoint — labelled toggle + footer wordmark |
| `validate-all` still not in `pnpm build` — that is phase 3 |
| Nothing published since component 0.15.1 · framework 0.10.1 · workshop 0.6.0 |

**Frozen, untouched:** the colour-picker arc — `handoff-2026-07-30-1528-FROZEN-color-picker.md`.

## Next intended action

**Stop. He looks at the empty shell.** Then phase 2 row 2 — **Icons** — which per the plan
needs R2's header-navigates fix plus a live check of the ramp, keyline overlay and BG toggle.
Readmission is one line in `admitted.js`. Carry the open note with it: the icon *mode* toggle
is **not restorable** (the variant prop went at kol-icons 0.8.0) and needs its own decision.

## Working memory not yet in AGENT-CONTEXT

- **The gate had to reach the derived trees, not just the tabs.** A grouping toggle over an
  empty tree, or a Documentation tree under a held Documentation tab, is the same drift the
  gate exists to stop. Three surfaces, one decision.
- **Filter the list, never the groups.** In `function` grouping mode the buckets are
  functions rather than tiers, so a group-level filter lets a held organism back in through
  the Structure bucket. Cost nothing to see here; it would have been invisible later.
- **A reversible gate can break a standing rule silently.** Quarantine filtering `SHELL_ROUTES`
  looks harmless and un-finds every held page. The gate is now the thing that stops it —
  the rule survives because a script asserts it, exactly the arc's own lesson.
- The rule-doc links resolve by **suffix match against the inventory**, not hardcoded ids:
  buildInventory generates the ids, and a guessed one is a dead route the day a doc moves.
- Verification port: **4211** — opened, used, killed, confirmed clear.
- The `pnpm dev` parent kill does **not** take the vite child with it; the listener survived
  under a second PID. Check the port after killing, always.
