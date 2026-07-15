# 🏁 Milestone: Showcase truth rebuild

**Date:** 2026-07-15
**Agent:** Grim (Fable 5)
**Arc:** Deep audit of the showcase (3 parallel sweeps) → 4 gated execution phases, same day.
**Delivered:** A showcase that cannot silently lie: the roster derives from the package barrels at build time (113 → 185 browsable components, `misc` = 0), three CI gates (`validate:roster` / `validate:imports` / `validate:foundations`) + a build-time prose extractor hold every truth property mechanically, the vendored package fork is deleted and banned, search works (⌘K over the roster), sets/blocks carry provenance badges, and maintainer tooling no longer ships to production.

## What closed
- Audit P0-1 dead miner roots → **done**: `ROOT_DEFS` = `kol-apps` + `kol-website`, missing root hard-fails; re-mined live (158 components with real usage).
- Audit P0-2 invisible packages → **done**: barrel-derived roster + completeness gate; classification via 4-agent sweep (tier by the mechanical nesting test).
- Audit P0-3 vendored fork → **done**: 36 files deleted, 21 imports repointed to `@kolkrabbi/kol-dashboards`, one workshop route (package-consuming), `validate:imports` keeps it dead.
- Audit P0-4 wrong install commands → **done**: `pkg` attribution from the barrels.
- Audit P0-5 zero CI → **done**: three gates + descriptions extractor wired into `pnpm build` and release.yml.
- Audit P1-1 dead search → **done**: SearchInput trigger + `ShellSearchOverlay` + ⌘K, navigates to doc pages.
- Audit P1-2 product-costumed sets → **done**: ProvenanceBadge (`N KOL · M local · external`) on every card + stage header.
- Audit P1-3 tooling on the public site → **done**: `/lobby` + `/demo` + Lobby nav link dev-only; `/workshop-preview` deleted.
- Audit P1-4 hand-copied token cells → **done**: `resolveTokenThemed` CSSOM walk (both-theme columns) + `measureClass` probes; literals deleted and gate-banned.
- Audit P1-5 rotting one-liners → **done**: JSDoc first-sentence extraction (136/185), regenerated every build; DESCRIPTIONS demoted to fallback.
- Audit P2-1/2-3/2-5 → **done** (dead lib file · composition walks every package · fixtures re-homed). P2-2 → **resolved harmless** (fallback keys can't rot the page). P2-4 + everything non-arc → **parked at `backlog/2026-07-15-parked-threads.md`**.
- Same-day interludes, also closed: 6-package raid batch published + verified 15/15; ThemeToggle icon pair + **DS dark-imposition bug** (stamped `data-theme=dark` on mount since framework 0.1.0) fixed → framework **0.4.0 on npm (CI-verified)**; TopBar `sm:block` search-stacking fix; `/work` backport seams (`titleClassName` / `previewClassName` / `plugins`) → content **0.2.0 on npm (CI-verified)**; AsciiClouds rejected from the DS.

## The arc (brief)
- Morning: repo unblocked (`pnpm install`), raid batch published, ThemeToggle + dark-default forensics (npm-tarball bisection, no git) — `session-log/2026-07-15-batch-publish-themetoggle-theme-default-fix.md`.
- Midday: SourcesReferences shipped on demand; the "why is anything unlisted" question became the deep audit — 3 Explore agents (IA / pipelines / presentation), findings + target architecture at `backlog/2026-07-15-showcase-deep-audit.md`.
- Afternoon: phases 1–4 executed with per-phase user gates; execution journal at `playbook/2026-07-15-showcase-truth-rebuild.md`.
- The durable property: every showcase claim is either derived from package source at build time or CI-gated — adding a component to any barrel appears in the docs or breaks the build.
