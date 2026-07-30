# 🏁 Milestone: the shell-adoption night — one chrome, one pipeline

**Date:** 2026-07-30
**Agent:** Grim (Fable 5)
**Arc:** the showcase stops hand-maintaining its own chrome and its own docs format — it wears the packaged workshop shell and its pages become documents.
**Delivered:** theme 0.12.1 · component 0.13.1 · framework 0.6.4 · icons 0.8.10 · workshop 0.3.0, all published; the showcase converted to a single layout route with an MDX page pipeline; the kol-website fork folded back into the package.

## What closed

- **Theme system-follow** → DONE. `--kol-link` ships `currentColor` (per-repo hook, user law); ThemeToggle is tri-state light → dark → **system**; the showcase boots un-stamped so a fresh visitor follows the OS. The "why do I keep deleting storage" question is answered and fixed.
- **Icons stroke batch** → DONE. Five fill→stroke conversions (`rows` re-authored mirror-exact, `pause`/`more`/`frequency`/`foundation`), `scribble-02` culled as a byte-duplicate. Set is 165/26.
- **kol-website fork divergence** → CLOSED. The website aliased `@kolkrabbi/kol-workshop` to a 2,749-line local copy; its real improvements (tooltips, aria landmarks, `id="main"`, brand link split) are folded in, its 158-line `WorkshopHeader` fork retired into framework's `ShellHeader`. Five defects both copies carried are fixed — dead mobile drawer, dead ⌘K, rail desync, a doc tree that listed only INDEX files, and a reader that crashed outside a shell.
- **`lobby/DocTableAndChipAudit.md` (9 tasks)** → DONE, all nine. Cell roles split on the mono fault line (`-token` / `-copy`), Pill/Tag defaults conformed to the chip laws, duplicate class homes deleted, `.kol-fs-tile` ruled dead.
- **Rogue type + cascade drift** → CLOSED. Shell tabs render 14/18 because the rule says so; the layer requirement (`layer(components)`) is now law in ARCHITECTURE §5, both READMEs and the topology doc — order was documented, layering never was.
- **Ghost-divs regression** → FIXED (`Home.jsx` flank width tracked a hardcoded 1600 after the shell re-cap to 1800).
- **Preview breakpoint buttons** → measured healthy; one real 8px scale-math drift fixed.
- **`?embed=1`** → SHIPPED, then re-homed onto the new layout route.
- **The 14-page chrome duplication** → GONE. `ShellChrome.jsx` mounts once; `DocLayout` · `TopBar` · `NavDrawer` · `SidebarNav` deleted.
- **Hand-written TOC arrays** → GONE. Derived from rendered headings.
- **`component-docs.js` drift** → mechanism closed. MDX is wired and `ComponentPage` prefers `docs/components/<Name>.mdx`; the file now retires entry by entry. The remaining 71 entries are per-component prose, parked at [[../backlog/2026-07-30-mdx-content-migration|the MDX content-migration backlog]].
- **Doc-id scheme** → RULED (agent-side, user-endorsed shape): stable numeric `id` in frontmatter, readable `slug` in the URL, `aliases` for old paths. Implemented in the `.mdx` meta contract.
- **Device/mobile testing** → parked at [[../backlog/2026-07-29-device-testing-audit|the device-testing backlog]] with the rig documented (Chrome device mode forces `pointer: coarse`; Xcode Simulator for real iOS WebKit).
- **Sidenav epic** (`backlog/2026-07-15-sidenav-epic.md`) → SUPERSEDED. The sidenav is now the packaged `ShellSidebar`; the epic's premise no longer exists.

## The arc (brief)

Started as "clean up the showcase and check the theme", and the theme thread ran to ground fast: the stale-theme complaint was our own boot script vetoing the OS forever, not a dev-server artifact. From there the night followed one repeated shape — **a thing existed in two places and the copies had quietly diverged**: two workshop shells, two homes for prose CSS, two spectrum-grid implementations, a type utility racing a component rule, fourteen copies of the page chrome, and a docs format (`component-docs.js`) that existed only because there was no document format. Each fix was the same move: one home, one truth, stated where it belongs.

The user's standing correction throughout — *reference, don't invent* — is what turned the last piece: rather than designing a docs architecture, the answer was the one every docs site converged on (layout route + derived TOC + MDX with embedded live previews), and the repo already had the registry and extraction scripts half-built for it.

Spans: `playbook/2026-07-29-showcase-cleanup.md` (7 entries, the running journal for this arc).

Ported out of repo: the session's process critique → `kol-dumpty/humpty/lobby/hook-deafness.md`.
