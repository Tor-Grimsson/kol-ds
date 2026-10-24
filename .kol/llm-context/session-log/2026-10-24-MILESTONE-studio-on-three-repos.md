# 🏁 Milestone: the Studio on three repos — Home, Library, one card, one detail page

**Date:** 2026-10-24
**Agent:** Claude (Grim)
**Arc:** the Studio shipped from the DS and taken into kol-fxr, kol-mirror and kol-monitor by step messages from this session — the adoption (plan-2026-10-24-hubs-against-the-template) and his review of it (plan-2026-10-24-home-library-detail-one-card), two days to one shape.
**Delivered:** kol-theme 0.185.0 · kol-icons 0.45.0 · kol-component 0.297.0 · kol-shell 0.78.1 · kol-styleguide 0.7.0 live; three apps on `AppStudio` with the preset's rail, Home as the user's saves, Library as what ships, every card the same (title · date · size · cover with download · cog · trash, Insert on Create), `StudioDetail` behind `/library/module/<id>` · `/library/patch/<id>`, the file rail with Date · Size and Upload image, covers that are the patch's output; the reference-diff pass green — mirror 92/92, monitor 92/92, fxr 71/71 then 70/71 pending its covers; dev servers that run each app's D1 worker locally on a fixed port (8787 · 8788 · 8789); the Dev row on every rail.

## What closed
- The Studio adoption (nine steps × three repos) → done; `06-studio-adoption.md` is the playbook, corrected where the first run was wrong (Library is what ships, the Dev row stays).
- HubHomeContract · StyleguideSrcExports → closed on the registry versions; receipts re-synced by their sessions.
- Home vs Library conflated in the first pass → resolved: Home = saves, Library = shipped content, in the twins, the playbook, the docs and the three repos.
- "Every card the same fields and icons" → done: no part card anywhere; Create's parts carry the plate and Insert (kol-component 0.297.0 · kol-shell 0.78.1).
- The detail page and the slug scheme → done: `StudioDetail` in kol-shell; mirror and monitor on it; fxr at `/library/<chrome>/<id>`.
- Covers are the output → done on mirror (the composited frame, the camera patch over the canonical still) and monitor (the Output/Monitor canvas, modules powered; 70s and smx3 stay dark); fxr → parked at plan 1.4: on-demand quantised frames, one per preset, reused — running in kol-fxr's session, its final pass from here on its report.
- fxr's Library subtitle "Everything saved on this device." → parked at plan 1.5: copy is his.
- `nav-studio` → resolved: the DS already ships `rack-h` · `rack-v`; the addition reverted.
- Local D1 workers in dev → done: fxr's `scripts/dev.mjs` on all three, ports fixed; `07-app-dev-with-local-worker.md`.
- Overstepping (kol-branding, the pre-emptive fxr/mirror notes) → recorded as memory; the scope is the repos he names.

## The arc (brief)
- `2026-10-24-hubs-against-the-template.md` — the twins matched studio-hub page for page, the pass that diffs the reference.
- `2026-10-24-studio-wave-published-adoption-orchestrated.md` — the wave published, the three repos adopted by step message, the Dev row law, the local workers; amended with his review's plan: the DS wave (rail, `StudioDetail`, Insert on the card), the twins, the pass, the repos' three phases.
- The lesson that framed it: studio-hub is the shape, the twins are each repo's answer to it, and the orchestrator's message is his go — one step at a time, with the twin file, the change and what to report.
- Phase log: `docs/operations/09-phase-log/2026-10-24-home-library-one-card.md`; the plan copied to `_files/`.
