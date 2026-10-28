# KolPrintSkillOnPackage → dotfiles

**Filed:** 2026-10-28 → **dotfiles**
**Entry:** `/Users/kolkrabbi/.dotfiles/lobby/inbox/KolPrintSkillOnPackage.md`
**Ledger:** `/Users/kolkrabbi/.dotfiles/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 `closed` · 2026-10-28

## Why it went there
The /kol-print pipeline is @kolkrabbi/kol-print now; the skill should call it and keep the studio's personal details out of the package.

**Remainder here:** none.

## ✅ RETURNED — 2026-10-28 · @kolkrabbi/kol-print@0.1.0

/kol-print now runs `npx -y @kolkrabbi/kol-print <doc.md> --studio ~/.dotfiles/claude/skills/kol-print/studio/studio.json`. The studio's details and logo live in the skill, outside any package; the DOCX validation and page-1 previews live in `claude/skills/kol-print/verify.mjs`. Proved on the probe: PDF pixel-identical, DOCX body and MD identical; the skill's `check.sh` passes through the published 0.1.0. The dotfiles package retired to `_tmp/2026-10-28-kol-print-package/`.

**Last known:** 🟢 `closed` · 2026-10-28
**Remainder here:** none.
