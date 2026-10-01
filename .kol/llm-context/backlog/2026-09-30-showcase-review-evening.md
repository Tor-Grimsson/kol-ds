# Showcase review — 2026-09-30 evening (user)

The user's review, sorted. Nothing here is planned yet — the user says when. Earlier points of the same evening: `plan-2026-09-30-library-taxonomy.md` § Open issues.

## Solved (checked in source)

- Search is a header tab again.
- Search home names the engine and three filters (`in:`, `is:`, `#tag`) — partial: the full syntax (aliases, negation, phrases, dates) is not listed.
- "Quick search in this space only" is no longer a rail helper — it is a one-line switch in Settings.

## Open — understood

**The law, again:** every category and subcategory gets its own page. Open gaps: Packages (tier groups), every package category, Styles › Foundations, icon set groups.

Search
- Results page: oversized input; tag chips below are not Tag buttons and differ in size; Enter should land at the results, not a long scroll away; category filters are ghost-tone buttons.
- Fold kind · category · tags into tabs (check what shadcn does).
- Result rows too low opacity.
- Search page has no frontmatter; its left-rail spaces are wrong.
- Search home should document the engine: what it accepts, how it ranks.

Tags
- Tags are wrong across the site: ~8 in total, always `audience/consumer` etc., never about the content (search, query, index). Cause: the closed taxonomy in `.kol/docs-framework/03-tag-taxonomy.md`.
- Atoms home is not tagged atom/atoms.
- Right rail: Tags sits inside Links — Tags should be its own section (with the tag graph).
- Tags have no color; nothing in the UI uses status color (active · error · warning).

Descriptions
- A description is a few-word summary ("Search engine, custom built for wide use-cases"), never a feature list. Every package and page description to rewrite.

Packages
- No home. Tier groups and every package category need pages.
- Package pages read as changelogs: they must say what the thing IS in plain English, list the components and apps that use it, and carry a copyable install line (npm / pnpm). kol-search says nothing about the engine.

Right rail
- "On this page" empty on homes (icons home named as the example).
- Pinned block: favorites · conventions · syntax.

Sets vs blocks
- Sets render in the blocks' responsive stage (`DemoStage`); a set needs its own view that shows a SET — a group of things.

Icons
- `kol-icon-set-v1` is a bad name.
- Page layout clashes with ContentFilters and a page-wide style setup that lives outside the md — rethink; should it be a Catalog?
- v1 and Signal are each a category with sub-groups as pages.
- Icons home says almost nothing — tell the reader what the set is.

Guides
- Why are Guides (shell-and-layout · menus · loaders · type-roles) in Styles? They are not styles.
- **Broken tables in every `.mdx` guide** (type-roles shown): the showcase MDX pipeline has no `remark-gfm` (`showcase/vite.config.js:16`), so GFM tables print as text.

Components
- Atoms are a mess: missing previews, overlapping demos, and non-atoms filed as atoms (Dash* are built from nested elements).
- Component page knobs regressed: Button had variant · tone · size, now only variant. Several kol-control components have size only, no variant/tone.
- Controls Button/Dropdown overlap kol-hardware? (ARCHITECTURE §3 says they coexist by design — flag.)

Shell
- One shortcut to hide both rails (today only `[` and `]`).
- Shortcuts overlay too wordy; every helper line too wordy.
- Landing page stops showing components — needs load more.

Apps
- Open on one table of every app, links right away (diagram and layers stay below, or on a shortcut).
- apps/panels is broken.

## Not understood — needs the user

1. "Have we stopped using the hierarchy scale — mute …?" Which scale: Foundations › Tones, or the fg-* opacity ladder?
2. "Search enter vs command enter for index page?"
3. "Where is the conventions page?" Which one: `05-names.md`, the docs-framework conventions, or a new page?
4. apps/panels — what is broken (screenshot).
5. Icons "is this catalog? or outdated inline same?"
6. Next session "3d editor and chess ui site … buts and custom things" — which editor, which site URL; "buts" = bugs?

## Not this repo

- fxr preset morpher (P1/P2/P3 blend over xyz, loop pattern) — kol-fxr work.

## Next session (user)

- Review the 3D editor and the chess UI site (live DB, how-to, queries with examples).
- Node graph needs better GSAP + physics — "asap".
