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

## 📢 BULLETIN (dated — newest first; prune entries older than a month)

- **2026-07-29 · Links ship COLORLESS since `kol-theme@0.12.0`.** `--kol-link`/
  `--kol-link-hover` now default to `currentColor` (the old raw-Tailwind blues
  are gone, including the dark-mode overrides). `.kol-link` and `.kol-table a`
  are inert hooks until a repo binds the token at its root — e.g.
  `:root { --kol-link: var(--kol-color-yellow-300) }`. Link color is a
  per-repo, per-occasion decision (user law); a repo that wants the old blue
  sets it itself. Table links keep their underline either way.
- **2026-07-28 · Icons are v1-only since `kol-icons@0.8.x`.** The legacy trees
  (stroke/solid/svg/svg-web, ~1,900 SVGs) are GONE from the package. A dead
  name renders nothing. Hotfix path: grab the SVG from the local shelf
  `_tmp/legacy-icons/` → the consumer registers it via `registerIcons()` —
  or promote it into `kol-icon-set-v1` here. Downstream repos break-and-fix
  on their next bump (user ruling, no compat layer).
- **2026-07-28 · Type roles + width law shipped.** `kol-doc-*`/`kol-card-*`
  role sets (theme, `kol-type-roles.css`) — no hand-stacked eyebrow/heading
  recipes; ONE page frame (`--kol-content-shell`) + framework padding ramp —
  no page invents widths or padding. Law: `docs/documentation/01-foundations/04-layout-breakpoints.md`,
  live reference: showcase `/docs/type-roles`.

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
