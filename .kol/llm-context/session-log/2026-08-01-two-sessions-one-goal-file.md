# Session: two sessions, one goal file

**Date:** 2026-08-01
**Agent:** Grim (Opus 5) — the rail-arc session
**Summary:** The tail of the rail/search session: a concurrent second agent in the same repo trapped this one in its goal loop, which surfaced a real defect in `goal-loop` — it is repo-scoped, not session-scoped — filed to humpty rather than patched here.

## Changes Made

### Files Modified

- `.kol/llm-context/.active-goal.md` — `status: active` → `blocked`, with a `blocked:` reason. **The other session's goal TEXT was preserved byte-for-byte**; only the status field moved. Flip it back to `active` to resume.
- `~/dev/projects/kol-dumpty/humpty/lobby/inbox/goal-loop-is-repo-scoped.md` — NEW brief.
- `~/dev/projects/kol-dumpty/humpty/lobby/LEDGER.md` — 🔵 `filed` row + dated History line, same pass.

Nothing in `packages/` or `showcase/` was touched in this tail — the rail/chip/search work was already logged at `session-log/2026-08-01-rail-ladder-chip-and-one-search.md`.

### Features Added/Removed

- None. This tail is a finding and a filing.

## Current State

### Working

- The rail arc's own scope is closed and logged: 9/9 items, 14 gates, build green.
- `humpty/lobby` carries the brief at `filed`, with a measurement named in its definition-of-done (a fixture running the hook twice against one goal file under two `session_id` payloads).

### Known Issues

**`goal-loop` is repo-scoped, not session-scoped.** The hook resolves its goal file from `cwd`:

```python
gf = os.path.join(cwd, ".kol", "llm-context", ".active-goal.md")
```

so two sessions in one repo share one goal. This session had already marked its own goal `done`; it was then blocked **5×** by a goal a second agent authored two minutes earlier (`Empty the lobby queue`, written 11:49; that agent's `lobby/INDEX.md` write landed 11:51).

Every documented escape — `done`, `blocked`, delete the file, iteration cap — is repo-global. `KOL_HEADLESS=1` exits first but is a wrapper flag for `claude -p`, not a per-instance bypass. **There is no per-instance bypass**, by design.

The exit this session took writes into another session's live bookkeeping. That is the least-bad option available, not a good one.

### The collision, for the record

Two agents were one keystroke from building `MediaLibrary` over each other. What kept them apart was doctrine, not machinery: *"never drift outside the named scope"* and *"open/closed/stale is the USER's call."* Doctrine is not a lock.

`git worktree` separates agents by **branch** — it gives each its own `.kol/`, which also splits session-log, playbook and AGENT-CONTEXT into two trees to reconcile. It does not address two agents on one branch working adjacent concerns, which is what happened here.

## Next Steps

1. The fix belongs in dotfiles, not here: `/kol-goal` writes a `session:` field; `goal-loop.sh` exits 0 on a mismatch; a file with no `session:` keeps today's behaviour.
2. Decide whether concurrent agents in this repo should use worktrees at all, given the `.kol/` split it forces.
3. Unchanged from the rail log: publish the bumped packages, and the single held ruling — gruvbox ↔ kolkrabbi colour matching.
