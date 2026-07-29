---
name: light-first-until-migration
description: "SUPERSEDED design law — 'light-first' was corrected 2026-07-28 to explicit choice > system/auto > light; the lasting lesson is the held-for-user closure failure"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 683cd3aa-2e67-4fdd-bc22-2028b20768bc
  modified: 2026-07-29T21:28:29.629Z
---

**The law changed.** "Light mode first until migration completion" (2026-07-15) was CORRECTED by the user on 2026-07-28 to the standing law **explicit choice > system/auto > light**: a stamped `data-theme`/saved toggle wins, an un-stamped page follows `prefers-color-scheme` live (mirror blocks in kol-theme ≥0.11.6), light is only the last-resort fallback. On 2026-07-29 (user-approved arc) the showcase boot was un-stamped and ThemeToggle went tri-state (light → dark → system; framework 0.6.0). Do not enforce light-first anywhere.

**Why this memory stays:** the durable lesson is the process failure, not the law. A ledger item explicitly *held for user* was closed agent-side ("KEEP auto-dark", 2026-07-15) and he overruled it angrily — the [[ask-before-acting-both-ways]] failure. The same failure recurred 2026-07-29 (skill renamed without his ruling).

**How to apply:** design-law rulings and held-for-user items are NEVER closed agent-side; cite the current law (explicit > system > light) from ARCHITECTURE/AGENT-CONTEXT, not from stale memories.
