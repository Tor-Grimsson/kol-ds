# Playbook — the content pipeline build

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> System doc (user-facing): `docs/operations/04-content-pipeline/`. Predecessor: `playbook/2026-07-30-showcase-quarantine.md`.

**Goal:** the showcase's content wiring becomes one named system — seven roots, one manifest, category→chapter→page — written down first, then built in five phases.

**Standing rules (non-negotiable):**
- git is the user's; publishes are the agent's (/upig)
- every named file gets its repo-relative path
- `docs/` is HUMAN; `.kol/` is AGENT; `showcase/src/` is MACHINE — generators never write into `docs/`
- a page is a SLOT; the renderer is a property of the page, not of the chapter
- all 12 gates clean after every phase, no exceptions
- reference, don't invent: the rule already exists somewhere — find it before writing one

---
## Entries

[21:11 GMT · 2026-07-31] · setup · playbook created
  what → new playbook for the content-pipeline build   why → the quarantine arc's port exposed that the wiring was never named; documenting it became its own arc

[21:11 GMT · 2026-07-31] · context · what preceded this today
  width arc → shell frame uncapped, cap moved to MainColumn, `--kol-content-canvas` (87.5rem) added as the rung between shell and panel
  chrome inset → `--kol-pad-chrome-x` created; ShellHeader + shell frame stopped disagreeing; `--kol-sidenav-w` 260 → 16rem
  docs → `docs/operations/04-content-pipeline/` authored, 6 files, 569 lines
  operations → folded flat files into numbered folders, matching kol-website
  new gate → `validate-vault-links.mjs`, 12th gate, found 17 dead wikilinks on first run, all repaired

[21:11 GMT · 2026-07-31] · ruling · user: a page is a slot
  what → "we have to be flexible, we cant say everything has to work only with mds… some pages might need a split, markdown and jsx together"
  effect → phase-4 blocker dissolved; Foundations chapter = the 5 vault docs AND the 3 React pages, different renderers, same chapter
  manifest → rows gain a `render` field; three renderers already exist (DocumentationReader · MdxDoc · React page)

[21:11 GMT · 2026-07-31] · ruling · user: the folder already decided it
  what → "it never became anything it always was" — `docs/documentation/01-foundations/` IS chapter 01
  lesson → I framed a settled structure as an open question; the vault's own folder tree is the taxonomy, not a thing to derive

[21:37 GMT · 2026-07-31] · build · phases 1-5 shipped, 12 gates clean at every step
  p1 → scripts/extract-manifest.mjs + docs/operations/04-content-pipeline/06-manifest-tree.md (4 categories, 284 pages); ids mirror the workshop engine's buildInventory exactly — a guessed id is a dead route
  p2 → vault.js grouping key now docs/<category>/<chapter>; operations gained its 4 chapters; nested chapter subfolders fold IN, not out
  p3 → 07-usage left the vault: extract-usage + extract-tokens emit to showcase/src/usage/components/; docs 270 -> 54 md; OFF_TREE filter deleted
  p4 → foundations + icons left ALL_ROUTES and became CHAPTERS; live pages are slot-pages (nav/chapter-pages.js, shared with the generator); admitted.js keys per chapter with a `*` wildcard holder; sidebar label SHOWCASE -> Tools, vault block = Documentation
  p5 → showcase/src/lib/{roster,classification,registry,vault,shell-nav,admitted,chapter-pages}.js -> showcase/src/nav/ + index.js barrel

[21:37 GMT · 2026-07-31] · gate · two new gates, both negative-tested
  validate-vault-links → wikilinks must resolve BY PATH (Obsidian resolves by filename, the app cannot); found 17 dead on first run
  validate-reachable E1b → a slot-page must contribute a search row AND have a real Route; the taxonomy fix lifted foundations/icons out of ALL_ROUTES, which is exactly the hole E1 exists to close

[21:37 GMT · 2026-07-31] · lesson · the law needed sharpening, not enforcing
  what → my own rule said "generators never write into docs/", then phase 1 needed a generated doc IN docs/
  fix → the line is APP CONTENT vs DOCUMENTATION, not generated vs authored; a 219-file component database is app content, one structure mirror is documentation
  why it matters → I nearly enforced a rule I had written too wide 6 hours earlier; the framework already had the finer clause ("mark the folder as generated in its parent INDEX")
