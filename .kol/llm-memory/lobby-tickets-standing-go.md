---
name: lobby-tickets-standing-go
description: "Lobby tickets carry a standing go — work them on arrival, never hold the queue to ask"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4afca3b0-ada9-4c8a-af9e-db71f6d218cf
  modified: 2026-09-01T18:17:28.431Z
---

Lobby tickets landing in kol-ds-ui's inbox carry a STANDING GO: read, fix, ship, close via `lobby-close`, message the filer — on arrival, without asking. Holding arrivals to ask "take these too?" got the ruling (2026-09-01, verbatim): "dude do the tickets when they come YOU ARE BEING A FUCKING BLOCKER".

**Why:** The lobby IS the approval — a filed ticket is work already requested by a consumer repo on the user's behalf. Asking per batch made the DS the estate's bottleneck.

**How to apply:** New ticket lands (monitor event or inbox check) → work it immediately, full loop through publish + receipt. This scopes [[ask-before-acting-both-ways]] : the explicit-go law still governs everything OUTSIDE a ticket's ask (scope drift within a fix is still the defect it always was), and user-held tickets stay held only when he says he's taking one himself.
