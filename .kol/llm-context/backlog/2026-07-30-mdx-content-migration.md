# DONE — MDX content migration (the remaining pages)

**Executed:** 2026-07-30 (same day, user reopened the arc). All 72 DOC_DATA
entries resolved — 65 codemodded to `docs/components/*.mdx` + Button already
converted + 3 dead entries deleted (Icon/Graphic/MenuPopover — registry never
reads them) + 3 folded into `docs/shell-and-layout.mdx`. The 3 DocKit pages
converted to `docs/{menus,loaders,shell-and-layout}.mdx`. `component-docs.js`
DELETED. Journal: `playbook/2026-07-30-mdx-content-migration.md`.

**Parked:** 2026-07-30, at the close of the shell-adoption arc.
**Why parked, not open:** the mechanism is done and shipped. What remains is
writing documentation prose per component — authoring, not a transform. It runs
whenever the user wants, in any order, with no dependency between entries.

**CONTENT AUTHORED — 2026-07-30, wave 4.** All 66 `.mdx` docs carry a prose
section (Variants / Behavior / When to use) distilled from each component's
own source-header canon — the laws, family taxonomy and composition contracts,
cross-linked between siblings (chip family, value-control contract, popover
family, hero pair). The 9 headerless components were written from their read
source. Verified: 188 component routes, 0 errors. Awaiting the user's read —
per-component deepening (recipes, more examples) stays open-ended.

## The seam (already live)

`showcase/src/pages/ComponentPage.jsx` globs `../docs/components/*.mdx`. A
component with a matching file renders that document; everything else renders
the generated page from `component-docs.js`. So each conversion is additive and
independently reviewable — nothing breaks if the rest never convert.

## What's left

| Target | Count | Note |
|---|---|---|
| `component-docs.js` DOC_DATA entries | 71 | `Button` already converted as the proof |
| Hand-authored docs pages | 3 | `DocsMenus` · `DocsLoaders` · `DocsShellLayout` — these already use DocKit and render fine; converting is tidiness, not a fix |

`component-docs.js` deletes itself when the last entry moves.

## The format

`showcase/src/docs/components/<Name>.mdx` — see `Button.mdx`:

```mdx
export const meta = { id, slug, eyebrow, title, lede }

<Preview name="Button" />     // live demo from the demos registry
<Api name="Button" />         // props from the react-docgen extraction
```

`id` is the stable handle (numeric, never reused, never renumbered); `slug` is
the URL and may change with the title; `aliases` catch old paths. Headings get
anchors automatically — the shell derives the TOC from what rendered.
