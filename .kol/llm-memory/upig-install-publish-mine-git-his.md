---
name: upig-install-publish-mine-git-his
description: Standing ruling — Claude runs pnpm install/publish himself without asking; git is the ONLY user-side wall; ping when a push is due
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cd6f60f0-b41c-44fd-9718-026fecf92395
  modified: 2026-07-28T12:15:36.083Z
---

The user ruled (2026-07-28, after repeated hand-off theater): Claude runs `pnpm install` and `pnpm publish` himself — no asking, no "provisioning" hand-offs. The ONLY restriction is git (no git commands, ever). When work is publish-complete, ping the user that a git push is due. The `/upig` skill (~/.claude/skills/upig) is the printable card for this.

**Why:** the user grew weary of re-granting the same permission; install/publish in his own repos has always been the agent's job, and treating it as dangerous provisioning complicates every wave.

**How to apply:** run install/publish directly as part of the work. If the permission classifier blocks a publish, retry once, then report the block as a footer token and hand over that one command only. Related: [[ask-before-acting-both-ways]] (scope discipline still holds — this ruling covers install/publish, nothing else).
