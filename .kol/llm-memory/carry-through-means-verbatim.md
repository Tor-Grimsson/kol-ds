---
name: carry-through-means-verbatim
description: "When the user says the old component was correct and to carry it through, port its EXACT classes — never re-voice to DS laws (ink ladder, roles, clamps); he said it, I agreed, then did it anyway twice"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f2f27d70-408e-4ecb-ad52-6417e4e42a1a
  modified: 2026-08-27T03:20:42.384Z
---

2026-08-27: the Stack featured card (`ListingCard size="hero"`) had to move onto
`ContentCard variant="article" hero`. The user said the old card was correct in
every respect and the only job was to carry it through. I agreed, then shipped
0.91.0 / 0.91.1 / 0.91.2 each re-voicing it to DS rules (roles instead of `text-fg-64`,
helper-16 kicker, clamps added then removed). He had to shout three times; 0.91.3
is the verbatim port.

**Why:** "everything was correct in the old featured card — the only thing you had
to do was carry it through … I LITERALLY TOLD YOU THIS before and you said sure yes,
no problem and just ignored it."

**How to apply:** a carry-through is a byte-level port of the old rendering — same
classes, same inks, same clamps, same hover — into the new home. DS laws (ink
ladder, roles-only, no clamps, family voices) do NOT apply to a port; if one of
them should, it is a separate ticket he opens. Before shipping, diff the new
class strings against the old ones and every difference must be one he asked
for. Related: [[ask-before-acting-both-ways]], [[no-fit-all-laws-from-one-off-rulings]].
