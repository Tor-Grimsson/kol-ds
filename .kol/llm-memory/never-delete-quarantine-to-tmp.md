---
name: never-delete-quarantine-to-tmp
description: "Removing anything means moving it to _tmp/, never rm — the user has ruled this repeatedly and it is not scoped to code"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 42d20819-c5c7-4659-bf6d-bfd5fe71b666
  modified: 2026-08-01T21:21:08.243Z
---

**Nothing is ever deleted. It moves to `_tmp/`.** Files, folders, assets, dead
code, superseded fonts — all of it. `rm` is not an available verb, and
"recoverable from somewhere else" is not a defence.

**Why:** the user owns the repo and owns what leaves it. A deletion is a
decision he did not authorise, and it is the one kind of mistake he cannot
inspect after the fact — he can read a diff, he cannot read a file that is
gone. Restoring "from `~/Library/Fonts`" or "from the registry" is me deciding
his recovery path for him.

**How to apply:** removing anything → `mkdir -p _tmp/<date>-<what>/` and move it
there, then say where it went. Add `_tmp/` to `.gitignore` in the same breath if
it is missing. This is separate from the *repo-hygiene* rule about scratch
output — that one says don't drop artifacts at the repo root; this one says
don't destroy anything, ever.

**Breach 2026-08-01:** swapping JetBrains Mono to variable, I ran `rm` on 7
static woff2, a 16-file `static/` folder and 2 raw ttf. Restored to
`_tmp/2026-08-01-jetbrains-mono-statics/` only after he asked *"did you
quarantine unused to _tmp?"* — the question should never have needed asking.

Related: [[ask-before-acting-both-ways]]
