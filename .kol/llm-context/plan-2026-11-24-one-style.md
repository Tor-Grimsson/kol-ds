# Plan: one style (2026-11-24)

Status: TALK. Nothing built until his go.

## His direction (verbatim points, 2026-11-24)
- "my problem is that I have no overview of what is what."
- The editor (kolbox) is the look he wants for fxr, mirror and monitor; "I eventually want them to be the same app."
- "minimal and default are the same style."
- "float is out, we dont use it anywhere."
- "folio should take kolbox theme."

## Folio review points (2026-11-24)
1. Folio has the editor look only partly (library page).
2. The top bar's Search button shows ⌘K as plain text, not key caps.
3. The search modal is treated differently from the editor's everywhere.
4. Document page: content is unaligned (headings, code boxes, image and player sit on different left edges).
5. The code box is a new style when a code box style already exists.
6. "THERE IS TOO MUCH MISALIGNMENT."
7. New document dialog (/new): "missing everything". Folio's own markup with kolbox colours only: no kolbox dialog parts, no icons on the three cards, ⇧⌘T as text not key caps, cards stretch with empty space, no footer action.

## W1 — Overview (first deliverable)
A one-page map: every look, every component branch it has (float 238, kolbox 204, folio 81 checks today), every app and which look it uses, and the target after the merge. Built as an artifact board, nothing changed in code.

## W2 — Merge (after his go on W1)
- default + minimal → one style.
- float → retired (only apps/float, apps/overlays, apps/style use it).
- folio → the kolbox look; folio-only parts that kolbox already has (code box, search modal, kbd) use kolbox's.
- fxr, mirror, monitor → the kolbox look through the Hub (`HubHome variant="kolbox"`).

## W3 — Folio alignment
One left edge for the document column; the code box is the shipped one; Search button and modal are kolbox's.
