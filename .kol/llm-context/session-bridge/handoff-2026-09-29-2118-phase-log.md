# Handoff — 2026-09-29 21:18

## Goal of the current arc
Close the §6c loop (publish, the user pushes), then build the **phase log**: a table on the showcase's Development space — date · phase · what shipped · plan (link) · docs touched (links) · packages bumped · state (built / published) — so a big approved run can be found on the site, not only in a chat report.

## Last actions taken (causal trail, newest first)
- User stopped the phase-log build mid-research to restart and publish; I had started checking npm to state publish-state truthfully per backfilled row.
- User ruling: **plans stay in `.kol/llm-context/`** — do not move them ("I would maintain it where it lives in .kol and just copy over? or symlink?"). My read: neither copy nor symlink — glob them in place.
- Removed a real note I had slipped into VOYAGER's fake `OPEN_QUESTIONS` (the deck-template row). User on open items after a goal: none may be left owed — decide and do.
- §6c built and logged (`session-log/2026-09-29-apps-review-6c-built.md`).

## Current state / open decision points
- **Published 2026-09-29** (all 11, see AGENT-CONTEXT). Push is the user's.
- Phase-log design (mine, the user said "lets just see how you find your logical way") — not built:
  - **Source:** `.kol/llm-context/PHASE-LOG.md`, one markdown table, newest first. Plans untouched in `.kol/`.
  - **Page:** `showcase/src/pages/Plans.jsx` at `/development/plans` — globs `../../../.kol/llm-context/{PHASE-LOG,plan-*}.md` in place (the Lobby page already globs `lobby/*.md` outside `docs/` the same way) and renders through kol-workshop's `DocumentationReader`; index = the log, `:docId` = a plan. Verify Vite's glob reaches a dot-dir.
  - **Links:** plan → `/development/plans/plan-<date>-<slug>`; docs → `/documentation/<file-stem>` (vault ids are file stems, `vaultDocHref`).
  - **Rail:** a `DEV_TOOLS` row `{ id: 'dev-plans', label: 'Phase log', path: '/development/plans' }` + route `/development/plans/*` in App.jsx (validate-reachable E1b requires the Route).
  - **Backfill:** a row per plan (9 files, 2026-07-30 → 09-29), state from npm; tonight's §6c row first.
  - **Rule going forward:** closing any /kol-goal run adds its row in the same pass — write it into the kol-goal done step or the 07-apps-tier / operations doc.

## Next intended action
- Build the phase log as above.

## Working memory not yet in AGENT-CONTEXT
- Don't report app-internal `_tmp` moves as "retired" — memory `retired-means-the-ledger`.
- Deferred on the plan's own "Not in this plan": panels' bool = switch inline vs Off/On strip label-above → editor review.
- Probe scripts live in `_tmp/probe/` (shots.mjs, editor-routes.mjs, rand-fx*.mjs); no servers left running.
