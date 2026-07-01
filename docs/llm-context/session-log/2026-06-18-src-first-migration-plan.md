# Session: src-first restructure migration plan

**Date:** 2026-06-18
**Agent:** Grim (Opus 4.8)
**Summary:** Authored the concrete migration plan for the user's src-first direction (design system in `src/`, npm packages generated as a build artifact) and recorded it as Path B of the open showcase decision. Continuation of the same 2026-06-18 session as the host-page log.

## Changes Made

### Files Added
- `docs/migration/2026-06-18-src-first-restructure.md` — the migration plan (`plan` archetype, conforms to `docs/_framework`). Target: collapse the pnpm workspace into a single regular Vite app with the DS in `src/kol/<layer>`, consumed via `@kolkrabbi/*` path aliases; `packages/` becomes a **generated** build artifact (committed `package.json`/README, gitignored source). Spine of it: cross-layer imports already use `@kolkrabbi/*` (§3), so the alias resolves them locally and publish is a near-pure copy — no import rewriting. 6 phases (restructure → aliases + drop workspace/`@source` → generate script → boundary lint → publish pipeline → cutover) with testable acceptance criteria.

### Files Modified
- `docs/llm-context/AGENT-CONTEXT.md` — reframed the open-decision section into **two explicit paths**: Path A (consolidate onto the brand app, publish-only repo) and Path B (src-first restructure, keeps the showcase). Linked the plan doc.

## Current State

### Working
- The migration plan is complete and framework-conformant. Nothing executed in code — this is the plan, not the build.

### Known Issues
- **The showcase-vs-consolidate decision is still unresolved and gates execution.** Path B (this plan) assumes the showcase stays in this repo; if we consolidate onto the brand app instead, the plan is moot. Settle this first.
- **Clarified the "lost package wall" is not a real cost** — separate packages still enforce boundaries, just at lint/publish time (eslint `no-restricted-paths` + a validate step in the generator) instead of resolver time. This shifted me behind Path B over the prior "kill the showcase" lean: the restructure removes the drift root cause, so keeping the showcase becomes viable.
- **Likely snag flagged in the plan:** CSS `@import` of a bare package specifier under an alias must resolve to the entry file, not a folder — validate early in Phase 2.
- The earlier host-page rewrites (`Components`/`ComponentDoc`/`ComponentPreview` → KOL classes + `PageSection`) may be moot under either path.

## Next Steps
1. **Make the architectural call: Path A (consolidate) or Path B (src-first restructure).** Everything else waits on this.
2. If Path B: execute Phase 1 — restructure `packages/*/src` → `src/kol/<layer>`, move `showcase/` → `src/app/`.
3. Downstream of the call (only if showcase survives): swap the filter `<input>` for `ContentFilters` over the registry; put `Home.jsx` on a page primitive.
