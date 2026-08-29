---
component: ContentFiltersFirstGroupHugs
source: kol-website /prints (the reference render) · kol-component/src/organisms/ContentFilters.jsx renderFilterGroup · kol-fxr/src/pages/LibraryPage.jsx
staged: 2026-08-27
status: draft
deps: [ContentFilters, Tag]
---

# ContentFiltersFirstGroupHugs — THE LAW, and a revert of 0.104.1

## ⚠️ Revert first

`ContentFiltersEqualColumns` (kol-fxr, today) was filed WRONG and shipped as
**kol-component 0.104.1: "group columns are equal width by default"**. That is
the opposite of the user's ruling. Revert the default. The kol-fxr agent
misread "only the first column is narrow" as a defect; it is the design.

## The law (user ruling 2026-08-27, said "for the 10th time")

**The FIRST filter group HUGS its chips — it is narrow. Every group after it
FLOWS across the rest of the row.** The reference is kol-website `/prints`:
`CATEGORY` (one chip, `PRINTS`) hugs at the left; `YEAR` flows `2025 … 2011`
in one line beside it. Not equal columns. Not a grid. Not "short groups stack,
long groups flow" either — the shape is by POSITION: first hugs, rest flow,
regardless of chip counts.

**And the category label (`CATEGORY`, `YEAR`, `TYPE` …) is the eyebrow role**
— `kol-eyebrow`, not `kol-helper-12` + inline uppercase. Every section label
in the app tier is an eyebrow now; this was the last holdout.

## Props

| prop | type | default | controls |
|------|------|---------|----------|
| `group.stack` | boolean | **first group `true`, every other `false`** | hug vs flow; the seam stays for an explicit override |
| `labelClassName` | string | **`kol-eyebrow text-fg-96`** | category label; the role carries the uppercase — drop the inline `text-transform` |

## Styling

First group: `flex flex-col gap-3 shrink-0`, chips `flex flex-col items-start
gap-2` (as `/prints` renders `CATEGORY`). Following groups: `min-w-0 flex-1`,
chips `flex flex-wrap gap-2 pr-12`. Nothing else moves.

## Cement it

This has flipped twice today (0.101 "short groups stack" from one page's
ruling; 0.104.1 "equal columns" from a misread). Write the law into the
`renderFilterGroup` docstring AND the ContentFilters section of the
components doc, quoting the user, so the next per-page ask cannot overturn it
without hitting the sentence. kol-fxr pins `stack: i === 0` and keeps it after
ship.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.104.3

The law is in: the FIRST group hugs (stack default = index === 0), every group after flows — by position, never by chip count; stack stays the explicit override. 0.104.1's equal columns and 0.101's ≤ 6 rule are both gone. The category label defaults to kol-eyebrow text-fg-96 (0.104.2). The law is written into renderFilterGroup's docstring, the ContentFilters mdx and the content-card-system doc, quoting you. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-fxr bump kol-component 0.104.3; keep stack: i === 0 if you like — it now matches the default.

