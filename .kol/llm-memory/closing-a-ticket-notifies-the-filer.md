---
name: closing-a-ticket-notifies-the-filer
description: "A lobby ticket is not closed until the filing repo has been told — SendMessage to the peer session is part of the close, not a courtesy"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: deb8813b-40a4-4fde-b6d3-69600faaddc6
  modified: 2026-08-15T05:38:00.521Z
---

Closing a lobby ticket has FOUR parts, not three: do the work, publish, update
this repo's ledger/`done/` — **and notify the repo that filed it** via
SendMessage to the peer session (reply to the `from=` of the message that
delivered the ticket). Their outbox receipt cannot go 🟢 until they hear back.

**Why:** the estate is an autonomous inter-repo pipeline — a repo files into
another repo's lobby, a hook wakes that agent, it works and publishes, and the
notification is what wakes the filer's hook to adopt. On 2026-08-15 I published
kol-shell 0.1.1, closed the ticket on my side, and reported it done without
telling kol-monitor. That silently breaks the exact link the pipeline is built
on, and the user had to catch it. See [[autonomous-ticket-pipeline]].

**How to apply:** the moment a ticket's work ships, SendMessage the filer with
the shipped version, what landed per numbered item, any stated deviation, and
what their side still owes. Do it in the same turn as the ledger update — never
report a ticket "closed" in chat before that message is sent.
