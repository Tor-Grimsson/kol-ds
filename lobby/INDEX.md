# Component lobby

Staging bay for components flung in from consumer apps via the `/lobby-ds` skill.
Each entry is a spec the DS **recreates from** — not source. To promote: build the
component under `packages/component/src/{atoms,molecules,organisms}/` (or a new
`packages/*` for non-component work) to spec, then move its entry to `done/`
(recreated) or `archive/` (rejected, with a reason) and log the job below.

This is a work queue, not published docs — it intentionally sits outside `docs/`
and does not follow the `.kol/docs-framework` conventions.

**Live entries live in `inbox/`** (moved there 2026-07-31 with the estate-wide
lobby standard). Spec: `~/.dotfiles/docs/operations/systems/lobby/`.

> The 119 records processed before 2026-08-01 graduated to
> `.kol/llm-context/lobby-history/` (`done/` 108 · `archive/` 11);
> this ledger is the queue, not their filing cabinet.

## States

| | state | means | lives in |
|---|---|---|---|
| 🔵 | `filed` | captured, unread | `inbox/` |
| 🟡 | `read` | understood — the row restates it | `inbox/` |
| 🟠 | `addressed` | a change shipped that is *meant* to close it | `inbox/` |
| 🟢 | `closed` | shipped + cited; resolution appended | `done/` |
| ⚪ | `parked` | deliberately not-**now**, reason recorded — revisitable | `archive/` |
| ⚫ | `retired` | closed without a fix, not-**ever** — terminal, and never ages | `archive/` |
| 🔴 | `needs-ruling` | **flag, not a state** — blocked on the user's call | wherever it is |

**Bar for 🟢 closed in this repo:** a shipped version / changeset cited in the
resolution. `read` and `addressed` are never `closed`.

## Queue

**0 live entries.** The queue holds LIVE TASKS ONLY (user ruling 2026-07-30).

| | Entry | Source | Staged | Status |
|---|-------|--------|--------|--------|

## Filed elsewhere

Tickets this repo filed into another lobby land here as receipts while they are
outstanding. The three earlier ones returned 🟢 with `Remainder here: none` and
graduated to `.kol/llm-context/lobby-history/archive/`.

| | Receipt | Destination | Last known | Remainder here |
|---|---|---|---|---|
| 🔵 | [llm-rules-bulletin-in-scaffold](outbox/llm-rules-bulletin-in-scaffold.md) | **dotfiles** — `~/.dotfiles/lobby/INDEX.md` | 🔵 `filed` · synced 2026-08-01 | The 0.24.0 announcement itself is ours to write once dotfiles lands a channel. Separately: `packages/theme/CHANGELOG.md` stops at **0.6.0** against a shipping **0.24.0** — the npm-facing channel is dead, which is why the bulletin carries the whole load |
| 🔵 | [deletion-is-never-authorised](outbox/deletion-is-never-authorised.md) | **humpty** — `~/dev/projects/kol-dumpty/humpty/lobby/LEDGER.md` | 🔵 `filed` · synced 2026-08-01 | The 25 deleted files are restored to `_tmp/2026-08-01-jetbrains-mono-statics/`, and the two `CLAUDE.md` law edits shipped to dotfiles. **Nothing further is ours** — the deny gate and its two-direction measurement are humpty's |

## History

| Date | Event |
|---|---|
| 2026-07-31 | restructured to the estate-wide standard: live entries moved to `inbox/`, this INDEX became the ledger, emoji states adopted |
| 2026-08-01 | the queue reached **zero** — the last entries closed with resolutions and receipts returned to the repos that filed them. Detail: `.kol/llm-context/session-log/2026-08-01-MILESTONE-lobby-return-half-and-adoption.md` |
| 2026-08-01 | **`lobby-spec-two-gaps` came back 🟢.** ⚫ `retired` became the shared ladder's sixth state (humpty had run it absorbed onto ⚪, so one glyph meant both *revisitable* and *terminal*), and `staged:` was settled as the entry field with `date:` a read-only alias. Both fixes live in `~/.dotfiles/docs/operations/systems/lobby/` |
| 2026-08-01 | **the agent invented a remainder, and it was called.** Closing that ticket, it promoted two idle observations into a 📌 `Remainder here: two` — a `status:` naming mismatch and a question about whether parked entries were really retired. Neither was work this repo owed. It put tasks into a queue the user had emptied, which is the opposite of what the ledger is for. Field corrected to `none` before the record graduated |
| 2026-08-01 | **`llm-rules-bulletin-in-scaffold` filed to dotfiles.** theme **0.24.0** deleted `.text-body` / `--kol-fg-body` with no fallback — a consumer loses its text colour silently — and that is what `LLM_RULES.md` § BULLETIN exists to announce. This repo's copy has one and has used it before (`kol-theme@0.12.0` colorless links), but it is a **local file**: kol-website is the only repo on the shared symlink, and that template has no BULLETIN section at all. Second ask in the same ticket: put this repo on the symlink too — 3 of 4 hold a regular file, and the per-repo content needs a home first |
| 2026-08-01 | **LOBBY EMPTIED.** 119 records graduated to `.kol/llm-context/lobby-history/`; `inbox/` · `done/` · `archive/` · `outbox/` all hold nothing but `.gitkeep`. The ledger keeps the states, the bar and this history — the records themselves are agent history and now live where history lives |
| 2026-08-06 | **Two briefs filed from kol-website.** `RecordManager` — the Framer-CMS-shaped record table + FieldRow detail panel (three reference screenshots in `_assets/`, light/dark parity part of the ask); `SideNavGrabResize` — grab-edge resize/snap-collapse for SideNav, prior art cited from kol-mirror, two `--kol-sidenav-*` tokens to mint |
| 2026-08-09 | **The table shadow, killed at the source.** The loose clip at the lobby root (now `_assets/2026-08-06-table-shadow-brand-graphics.png`) showed a shadow band inside the brand app's Graphics table. Root cause was ours: `.kol-table-wrapper` still carried two `--kol-surface-primary` "cover" gradients orphaned by the 2026-07-28 fade ruling — invisible on primary surfaces, a shadow band on every other. Deleted; shipped as **theme 0.30.2** |
| 2026-08-09 | **Queue emptied — both 2026-08-06 briefs closed with receipts returned.** `RecordManager` → **component 0.25.0** (organism + `FieldRow` molecule + `StatusChip`; `Table` gained `rowClassName`; no kol-theme half needed — all chrome reused). `SideNavGrabResize` → **framework 0.14.0** (grab edge + snap-collapse; the `data-sidenav="collapsed"` renderer rebuilt deliberately after its 2026-07-29 deletion; three `--kol-sidenav-*` tokens minted, in kol-framework.css where that family actually lives — the brief said kol-theme). kol-website's outbox stubs synced 🟢; its adoption remainders (slide-deck manager + Library onto RecordManager, retire the brand SideNav toggle) stay with kol-website |
