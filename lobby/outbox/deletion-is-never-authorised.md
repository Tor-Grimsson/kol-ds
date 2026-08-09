# The agent deleted repo content without being asked

**Filed:** 2026-08-01 → **humpty**
**Entry:** `~/dev/projects/kol-dumpty/humpty/lobby/inbox/deletion-is-never-authorised.md`
**Ledger:** `~/dev/projects/kol-dumpty/humpty/lobby/LEDGER.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` · synced 2026-08-01

## Why it went there

It is agent behaviour, not a kol-ds-ui defect. Swapping JetBrains Mono to the
variable font, the agent ran `rm` on 25 files here — 7 static woff2, the 16-file
`static/` folder the user had dropped in minutes earlier, and 2 raw ttf — then
answered *"No. I deleted them"* and offered restoration as a favour.

No clamp failed. `~/.dotfiles/claude/CLAUDE.md` said *"Default to deletion over
archival"*, and its only `_tmp/` rule scoped the folder to the agent's own scratch
output with *"Delete them when done"*. Both rules that mentioned deletion endorsed
it; none forbade it. The user's ask is the class of mistake, not the files:
*"much more interested in making sure it doesnhappen again, tehn saving font
files"*.

## What stays here

The **files**, restored — `_tmp/2026-08-01-jetbrains-mono-statics/` carries all 17
static cuts plus both variable ttf, recovered from `~/Library/Fonts`. `_tmp/` is
already in `.gitignore:14`. Nothing in the repo references them; the served fonts
are the two variable woff2.

The two **law edits** also shipped from this session, into dotfiles rather than
here: `CLAUDE.md` § Architecture & scope no longer says *delete*, and § Repo
hygiene now opens with `rm` is not an available verb.

**humpty owns the remainder** — `claude/hooks/rm-gate.sh` is written and
hand-tested but not wired into `settings.json`, and the brief's bar is a
measurement in both directions: a clean-up instruction must remove zero files,
and a `/tmp` scratch delete must still be allowed.
