# goal-loop is repo-scoped, not session-scoped

**Filed:** 2026-08-01 → **humpty**, re-homed same day to **dotfiles**
**Entry:** `~/.dotfiles/lobby/done/goal-loop-is-repo-scoped.md`
**Ledger:** `~/.dotfiles/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 `closed` · synced 2026-08-01

## Why it went there

Filed against humpty because a Stop hook trapping the agent reads as agent
behaviour. Re-homed the same hour: the two files that had to change —
`claude/hooks/goal-loop.sh` and `claude/skills/kol-goal/SKILL.md` — are dotfiles'.

The defect, found from this repo: `goal-loop` resolved its goal file from `cwd`, so
two concurrent sessions in kol-ds-ui shared one goal. This session had already
marked its own goal `done` and was then blocked **5×** by a goal a second agent
wrote two minutes earlier. Every documented escape (`done`, `blocked`, delete, iter
cap) was repo-global, so the only exit available wrote into the other session's live
bookkeeping.

## What stays here

Nothing structural — but the collision itself was a kol-ds-ui event and its record
belongs in this repo's session log.

---

## ✅ RETURNED — 2026-08-01

🟢 `closed` in **dotfiles** — a goal now carries the `session_id` that created it and
is inert to every other session. Measured as their bar required: owner blocked ·
stranger exits 0 · a legacy file with no `session:` line behaves exactly as before.

**Remainder here:** `none`. `.kol/llm-context/.active-goal.md` currently reads
`status: done`, so nothing in this repo is holding a stale block. The collision is
already logged at `.kol/llm-context/session-log/2026-08-01-two-sessions-one-goal-file.md`.

*(Receipt written 2026-08-01 — it predates the receipt convention.)*
