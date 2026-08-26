---
component: ArticleHeaderReconcile
source: kol-website — components/prose/layouts/ArticleHeader.jsx (167L) vs kol-content ArticleHeader (87L)
staged: 2026-08-15
status: draft
deps: [kol-content]
---

# ArticleHeaderReconcile — the diverged twins, one survivor

## The ask

kol-website renders Stack article pages with a LOCAL ArticleHeader (167L) while
kol-content ships an ArticleHeader (87L). They diverged rather than forked —
the local one is nearly double, carrying tag rows, meta arrangement, and layout
the package copy lacks (220-line diff). The audit rule "diff before swap" said
no blind adoption; this brief is the reconciliation: **read both, ship the
superset in kol-content, kol-website adopts and retires its copy.**

Reference: `apps/web/src/components/prose/layouts/ArticleHeader.jsx`, consumer
`routes/StackArticle.jsx` (both article layouts). Note the local index-as-key
on its tag rows (audit finding) — fix in the package version.

## What stays with kol-website

On ship: StackArticle adopts, local file retires. Sibling context: the
`ArticleCard` brief (filed 2026-08-15) covers the LISTING cards; this one is
the article PAGE header — different anatomy, same family.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-content@0.5.0`** + **`@kolkrabbi/kol-component@0.40.0`**
(both registry-verified).

**The verdict: this package was already canon, and the 220-line diff was not a
feature gap.** Read side by side, almost the whole difference is app coupling
kol-content removed on purpose when the component was de-Sanitized — four Sanity
image-URL builders (55 lines), the `reveal` entrance utility with its inline
`--reveal-delay` on five elements, `kol-helper-14 uppercase` on the meta line
(against the no-`text-transform` rule) and `kol-display-lg` where the prose role
class belongs. The brief's "ship the superset" reads as *the local one is bigger,
so take it*; taking it would have re-imported everything this package was
extracted to shed. None of it came back.

**Three capabilities were genuinely missing, and only those crossed:**

- **`authorImage`** — an author photo. Root-caused rather than copied: the twin
  hand-rolled `<img className="w-12 h-12 rounded-full object-cover">` beside a
  grey-circle fallback **because `Avatar` did initials only**. So `Avatar` gained
  `src`/`alt` (kol-component 0.40.0, falling back to the initial on a broken
  URL), `AuthorLine` gained `image`, and ArticleHeader threads it through. Every
  byline, card and work credit gains photos — not just this masthead.
- **`heroImageSrcSet` / `heroImageSizes`** — passed straight through to DS
  `Image`, which already spread unknown props. The consumer builds the candidate
  string; this package still resolves no URLs.
- **`tagSize`** (default `md`) — the smaller Pill below `lg`. The twin got there
  by rendering the **entire tag row twice** behind `lg:hidden` / `hidden lg:flex`;
  one row and a size prop replace both copies.

**The audit finding is fixed** — and it was ours too, not only the twin's:
`tags.map((tag, i) => <Pill key={i}>)` keyed by index, which re-uses a Pill's
state across a list that reorders. Keyed by label.

19 gates clean before each publish.

**Remainder here:** none.
