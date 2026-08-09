# Two gaps in the lobby spec — ⚪ means two things, and `staged:` exists nowhere

**Filed:** 2026-08-01 → **dotfiles**
**Entry:** `~/.dotfiles/lobby/done/lobby-spec-two-gaps.md`
**Ledger:** `~/.dotfiles/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 `closed` · synced 2026-08-01

## Why it went there

Both are defects in the shared lobby protocol, which dotfiles owns
(`docs/operations/systems/lobby/`). Neither is fixable from inside a consumer
lobby: one is a state the ladder defines differently than humpty uses it, the
other is a field the writer skills emit under a different name than the
staleness rule reads.

They were only visible because all four ledgers were audited in the same pass —
from inside any single lobby, both look like local convention.

## What stays here

`none` for the spec half. The **data** half was already executed in this repo the
same session, ahead of any ruling, because it is transcription rather than
judgement:

- all **116** entries in `done/` · `archive/` · `inbox/` now carry `staged:`,
  derived from each entry's own `date:` field
- **7** pre-frontmatter files were given frontmatter; two of those had no date
  anywhere in the body and were dated from file mtime, noted in the entries
- `status:` was squared to match the folder — `closed` in `done/`, `parked` in
  `archive/`, `filed` in `inbox/` — replacing **106** stale `status: draft` lines

No ledger row's state was touched and nothing was reclassified: open · closed ·
stale · parked is the user's call (law 3).

---

## ✅ RETURNED — 2026-08-01

🟢 `closed` in **dotfiles** — both gaps fixed in the spec they belong to, on the
user's instruction (*"close stale rule, do #1 … then close lobby items"*), which is
that repo's stated bar.

**Gap 1** — ⚫ `retired` is now the ladder's **sixth state**, not a per-repo note. A
per-repo row would have documented the collision and left ⚪ meaning two things,
which is the defect. `02-lifecycle.md` carries the split (⚪ *revisitable* / ⚫
*terminal*) plus the consequence this repo cared about: **a retired entry can never
be a stale candidate.** humpty's 5 rows migrated ⚪ → ⚫ — glyph only, no state
reclassified. The general rule landed in `01-registry.md`: a dialect word with no
rung to map onto is a gap in the standard, not local flavour.

**Gap 2** — `staged:` is the field at both ends; `date:` is accepted when **reading**
and never emitted. Settled exactly where this ticket said it should be,
`04-conventions.md` § entry shape. The cause was inside one file: `/lobby-ds` step 3
promised a `**Staged:**` line while its own template three lines down emitted
`date:` — and the template is what gets copied, which is why this bit **only** the
DS lobby while the other three writers were correct all along. Both that skill and
`/lobby-hygiene` are fixed; the audit now reads either field and says which.

**Remainder here:** `none`. The data half was already done before filing, and the
States table here carries ⚫.

*(Corrected 2026-08-01. This field first read `two` and listed a `status:` naming
mismatch plus a question about whether `archive/`'s parked entries are really
retired. Neither was work this repo owed — they were observations the agent
promoted into a remainder, which put invented tasks into a queue the user had
emptied. `none` is the fact.)*
