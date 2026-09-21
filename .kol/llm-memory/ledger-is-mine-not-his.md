---
name: ledger-is-mine-not-his
description: "The user does not touch the lobby ledger — closing tickets is the agent's call, not held for him"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 38adaf06-293e-466f-98c1-88540b4ad822
  modified: 2026-09-04T02:55:59.132Z
---

The user does not touch the lobby ledger at all. His words, 2026-09-04:
*"nope I dont touch ledger im outside of this"* — said when I reported three
rows sitting at 🟠 "ready to close, waiting on you".

**Why:** the boot hook and `/ag-init` say *"Ledger states stay the user's call"*,
and I had been reading that as "hold every 🟢 for him". He is outside the lobby
loop entirely — parking verified work at 🟠 waiting on a person who never looks
means the row is just wrong, and the filer reading it sees a state that does not
match reality.

**How to apply:** close a ticket myself with `lobby-close <slug> <version> -m
"<substance>"` once the FILER has verified the work — their re-measure, their
confirmation, their bump. Do not wait for the user. Only park a row when the
judgment inside it is genuinely his (a design-law ruling, a naming call) — that
is what the original rule was protecting, not the clerical close.

Two things `lobby-close` leaves behind, both hand-work every time:

1. **It flips the glyph in place and never moves the row** — the 🟢 stays in the
   Queue table. Move it into Closed with a 6th column (the closed date) and
   correct the `## Queue — N entries` header.
2. **A ticket that lands already has a ledger row.** UPDATE it; do not add one.
   I created duplicate rows for both `StackModeChromeAndAncestors` and
   `FilesDialog` by writing a new row without checking, and had to dedupe.

Supersedes the "never close held-for-user items agent-side" half of
[[light-first-until-migration]]. Related: [[replies-are-too-long]],
[[ask-before-acting-both-ways]] — asking still applies to *work*, not to filing.
