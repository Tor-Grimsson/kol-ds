# Plan — the showcase review

**Raised:** 2026-09-30 evening, the user's review (points: `plan-2026-09-30-library-taxonomy.md` § Open issues · `backlog/2026-09-30-showcase-review-evening.md`).
**Status:** DRAFT — not started; the user says go.
**Law for every W:** every category and subcategory, in every rail, gets its own page.
**How a W closes (user, 2026-09-30):** the W's acceptance check is written before it is built; new gates `validate:rails` (every group has its own path + home, never a child's path), `validate:descriptions` (few words, no feature lists), `validate:tags` (a content tag on every page); the user's points sit verbatim at the top, each mapped to a W. The agent closes each W itself — acting as the user's review: gates green, then the page opened in Playwright and checked against the acceptance line and the user's own words. The user does not babysit.
**Rule for this plan:** nothing is overwritten — a replaced file moves to `_tmp/<date>-<what>/` first. Each W logs into the phase log when it closes.

---

## Phase 1 — The tree

**W1 — The rail nests to any depth.** `ShellSidebar` (kol-workshop) takes routes of any depth; every group at every depth has its own page and its own fold.

**W2 — Library is the root.** Header: Styles · Library · Docs · Search · Development. The Library rail holds Composition (Components · Blocks · Apps) and Collection (Sets · Packages).

**W3 — Every group gets a page.** Audit every rail in every space; fill each gap:
1. Styles › Foundations gets its own page; Tokens moves to `/foundations/tokens`.
2. Packages gets a home; each tier group and each package category gets a page.
3. Icons: v1 and Signal are categories, their groups are pages.
4. Docs › Documentation · Operations and Development › Tools · Records labels open pages.

**W4 — Sets on one level.** Every set is a row at the same level; only Cards (the one set with members) folds.

## Phase 2 — What the pages say

**W5 — Descriptions.** Every page and package description is a few-word summary, never a feature list.

**W6 — Tags.** Open the taxonomy to content tags (search · query · index …) so a page's tags say what it is about; atoms tagged `atoms`. Retag the site.

**W7 — Package pages.** Each says what the package is in plain English, lists the components and apps that use it, and carries a copyable install line (npm · pnpm). kol-search explains the engine.

**W8 — Icons.** Rename `kol-icon-set-v1`; the Icons home tells what the sets are; the page layout stops clashing with ContentFilters and moves its page-wide setup into the page's own structure.

**W9 — A set view.** Sets stop borrowing the blocks' `DemoStage`; a set page shows the set — its members as a group.

**W10 — Guide tables.** Add `remark-gfm` to the showcase MDX pipeline (`showcase/vite.config.js:16`); every guide table renders.

## Phase 3 — Search

**W11 — Results page.** Normal-size input; tag chips are `Tag`, one size; Enter lands on the results; kind · category · tags fold into tabs (checked against shadcn); category filters lose the ghost buttons; result rows at readable opacity.

**W12 — Search page frame.** Frontmatter on the page; correct spaces in the left rail.

**W13 — Search home.** Documents the whole engine: every syntax it accepts (filters, aliases, negation, phrases, dates), how it ranks.

**W14 — Tag graph.** Better GSAP and physics. *(User: asap.)*

## Phase 4 — Rails, shell, color

**W15 — Right rail.** Tags is its own section beside the tag graph, not inside Links; "On this page" fills on homes.

**W16 — Shell.** One shortcut hides both rails; the shortcuts overlay and every helper line cut to the fewest words.

**W17 — Color.** Tags carry color; active · error · warning states use the status colors.

## Phase 5 — Components and apps

**W18 — Atoms.** Every atom has a working preview, nothing overlaps, and non-atoms (Dash*, built from nested elements) move to their true tier.

**W19 — Knobs.** Component pages expose variant · tone · size wherever the component has them (Button regressed to variant only; several controls show size only).

**W20 — Landing.** The component wall gets load more.

**W21 — Apps.** The Apps page opens on one table of every app with links; diagram and layers follow.

## Phase 6 — Record

**W22** — Phase log entry per W; `05-names.md`, `02-shells.md` and the homes match what shipped.
