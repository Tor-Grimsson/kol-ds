# Give the scaffolded LLM_RULES.md a BULLETIN section — and symlink kol-ds-ui onto it

**Filed:** 2026-08-01 → **dotfiles**
**Entry:** `~/.dotfiles/lobby/inbox/llm-rules-bulletin-in-scaffold.md`
**Ledger:** `~/.dotfiles/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` · synced 2026-08-01

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

Two things, both this repo's own:

- **The announcement itself.** Whatever channel dotfiles lands, the 0.24.0 entry
  is ours to write — the rename, its 78 call sites, and that no fallback was left.
- **`packages/theme/CHANGELOG.md` tops out at 0.6.0** while the package ships
  **0.24.0**. Eighteen minors unrecorded, so the npm-facing channel is dead too
  and the bulletin is currently carrying the whole load. Noted in the entry as
  out of scope for dotfiles.

The second ask — **moving this repo onto the symlink** — is dotfiles' to design
and ours to receive. It is not a `ln -s`: this repo's copy names
`.kol/llm-context/` in its startup protocol and holds three bulletin entries
about itself, and a symlink as-is deletes both.
