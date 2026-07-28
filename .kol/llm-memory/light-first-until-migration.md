---
name: light-first-until-migration
description: "Standing user design law — light mode first until the DS migration is complete; auto-dark/OS-follow must not decide; the agent-made \"KEEP auto-dark\" ruling was overruled"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 683cd3aa-2e67-4fdd-bc22-2028b20768bc
---

Until the point of migration completion, everything is treated **light mode first**. The user has restated this repeatedly. The `@media (prefers-color-scheme: dark)` auto-dark block in kol-theme's `kol-color.css` must not decide the theme for fresh visitors during the migration.

**Why:** On 2026-07-15 a DS-side session "ruled KEEP the auto-dark block" citing a "recorded light-first + follow-system policy" — but that ledger item (2.4/1.0 #4) had been explicitly *held for user* earlier the same day. The closure was agent-made, not his; he overruled it angrily. This is exactly the [[ask-before-acting-both-ways]] failure: a ruling held for the user was closed without him.

**How to apply:** Treat "light first until migration completion" as the standing ruling on ledger 2.4. Never re-close it (or any held-for-user item) agent-side. The DS-side fix to `kol-color.css` (drop/neutralize the auto-dark block and its policy comment) happens only on his explicit go, with a theme version bump.
