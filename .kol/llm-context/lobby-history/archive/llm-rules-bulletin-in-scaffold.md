# Give the scaffolded LLM_RULES.md a BULLETIN section — and symlink kol-ds-ui onto it

**Filed:** 2026-08-01 → **dotfiles**
**Entry:** `~/.dotfiles/lobby/inbox/llm-rules-bulletin-in-scaffold.md`
**Ledger:** `~/.dotfiles/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 `closed` · synced 2026-08-15 — BULLETIN section shipped in the scaffold template

## Why it went there

The file is dotfiles'. Both halves live there and neither is fixable from here:
the template at `claude/packages/scaffold/03-scaffold-llm-context/LLM_RULES.md`,
and `scaffold-llm-context`, the skill that writes and repairs it.

The trigger was ours — `@kolkrabbi/kol-theme@0.24.0` deletes `.text-body` and
`--kol-fg-body` with no fallback, which is precisely what a BULLETIN entry is
for. This repo's own `LLM_RULES.md` already carries three, including the
same-shaped `kol-theme@0.12.0` colorless-links notice. But that file is local:
kol-website is the only repo symlinked to the shared template, and the template
has no BULLETIN section at all, so the one consumer wired to inherit an
announcement is the one that structurally cannot receive one.

## What stays here

One thing, this repo's own:

- **The announcement itself.** Whatever channel dotfiles lands, the 0.24.0 entry
  is ours to write — the rename, its 78 call sites, and that no fallback was left.
- ~~The dead `packages/theme/CHANGELOG.md`~~ — **closed 2026-08-14** via the
  `PublishWaveChangelog` ticket: every changelog resumed with a dated gap note,
  and the entry-per-publish discipline is in the release playbook. The npm-facing
  channel is alive again; the bulletin no longer carries the whole load.

The second ask — **moving this repo onto the symlink** — is dotfiles' to design
and ours to receive. It is not a `ln -s`: this repo's copy names
`.kol/llm-context/` in its startup protocol and holds three bulletin entries
about itself, and a symlink as-is deletes both.

## ✅ RETURNED — 2026-08-15

Closed in dotfiles: `## 📢 BULLETIN` now exists in the scaffold template
(`claude/packages/scaffold/03-scaffold-llm-context/LLM_RULES.md`), under the startup
protocol, empty, with the convention line above it. The symlink does the distribution —
one entry there reaches every repo's agent at init.

**Remainder here: none.** The method is the deliverable; entries get written when there is
something to announce. The ticket's second ask (move this repo onto the symlink) did not
ship — this repo still holds a regular file with its own BULLETIN. Not tracked as a lobby
item; it is a setup choice, not outstanding work.
