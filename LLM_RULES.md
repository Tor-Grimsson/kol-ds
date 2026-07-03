# LLM Rules for kol-design-system

---

## ⚠️ CRITICAL STARTUP PROTOCOL — READ THIS FIRST ⚠️

**WHEN THE USER SAYS "read `LLM_RULES.md`" (or `/init-docs`) YOU MUST:**

1. **READ** `.kol/llm-context/ARCHITECTURE.md` — load-bearing decisions and constraints
2. **READ** `.kol/llm-context/AGENT-CONTEXT.md` — current project state
3. **READ** the latest session log from `.kol/llm-context/session-log/` (sort by date, most recent first)
4. **STOP** and say "Context loaded. What would you like me to work on?"
5. **WAIT** for the user to specify their task

**DO NOT:**
- Skip reading the context files
- Start working before the user specifies a task
- Propose anything that contradicts `ARCHITECTURE.md` without flagging the contradiction first

---

# LLM Agent Onboarding

**kol-design-system** — the maintenance home, npm host, and showcase of the KOL (Kolkrabbi) design system.

## Where things live

| Path | What |
|---|---|
| `.kol/llm-context/` | Agent state — architecture, current state, plan, backlog, migration, session logs |
| `.kol/docs-framework/` | The kol-docs spec every doc conforms to (frontmatter, archetypes, tags) |
| `docs/documentation/` | **The design system, documented** — numbered sections (overview, foundations, components, compositions, brand, operations, research, usage) |
| `packages/` | The published `@kolkrabbi/kol-*` packages (8) |
| `showcase/` | The live docs site (Vite app consuming the packages) |
| `workbench/` | Ladle app — every component × every state |
| `lobby/` | Inbound component specs from other repos — **read-only from this side** |
| `scripts/` | Build tooling (usage miner, taxonomy validator, docs extractors) |

## House rules

- Session logs / AGENT-CONTEXT updates **only when asked** (`/log-work`).
- The user owns all git — never commit or push.
- Junk/verification artifacts → `_tmp/` (gitignored), never the repo root.
- The "Version Packages" PR is the publish button — never merge it unprompted.
