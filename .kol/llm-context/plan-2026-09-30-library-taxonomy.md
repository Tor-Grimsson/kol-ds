# Plan — the library taxonomy

**Raised:** 2026-09-30, the taxonomy talk (point 3 of the OptionRow session).
**Status:** BUILT 2026-09-30 — gates clean, rendered; no package changed (showcase + docs only). Phase log: *Library taxonomy*.
**Why:** the header listed leaves (Components · Blocks · Sets · Packages · Styles · Docs · Apps · Development) with no parents, so there was no word for "components, blocks and apps" or for "sets and packages", and no page to draw how they relate. Cards sat in Blocks though it is a family, and the vault's `04-compositions` mixes blocks and sets.
**Rule for this plan:** nothing is overwritten — a replaced file moves to `_tmp/<date>-<what>/` first. Each W logs into the phase log when it closes.

---

## The tree

```
KOL                                   the design system
├─ Styles                             what everything is painted with
├─ Library                            everything you build with
│   ├─ Composition                    grouped by SIZE — each is made of the one before
│   │     Components → Blocks → Apps
│   └─ Collection                     grouped by BELONGING — the same things, cut another way
│         Sets      by purpose  (cards · chess · store · content)
│         Packages  by shipping (what npm install gives you)
└─ Reference                          about the system, not part of it
      Docs · Search · Development
```

**Header:** Styles · Composition · Collection · Docs · Search · Development (8 tabs → 6). The parents are the tabs; their children are rail categories.

---

## W1 — Names (built after W2–W4, on the user's call: document what shipped)

1. `docs/documentation/00-overview/05-names.md`: add **Library**, **Composition**, **Collection**, **Reference** as headings; redefine **Set** — a family grouped by purpose, which may cross packages (Cards: `Section*` in kol-component + content cards in kol-content).
2. § Spaces rewritten to the six tabs; Search moves from "not a space" to a space.
3. `04-compositions/INDEX` + `01-blocks-and-sets`: note the chapter spans both axes and point at the names; no folder rename in this plan.

## W2 — Homes (every parent draws its tree)

1. **Library** = `/library` (not `/`, as first written: the front door's hero + wall above the fold is a 2026-09-30 ruling): the whole tree as a diagram.
2. **Composition** (`/composition`, `homes/composition.md`): the size ladder diagram — a component inside a block inside an app — and a definition of each.
3. **Collection** (`/collection`, `homes/collection.md`): set vs package diagram — one set drawing from two packages — and a definition of each.
4. **Search** (`/search` home, `homes/search.md`): the engine (kol-search: query, scopes, ranking), tags (namespaced, hierarchical), the graph (a node per tag, an edge where two share a page), and palette vs page — one engine behind both.
5. Diagrams use the same nested-box drawing as the Apps home (`pages/Apps.jsx`); no new diagram component.
6. `validate:homes` knows the new ids — a parent without a home fails the gate.

## W3 — Header and rails

1. `nav/shell-nav.js` `ALL_ROUTES` → the six tabs; `SHELL_ROUTES` admission follows.
2. **Composition rail:** categories COMPONENTS (Atoms · Molecules · Organisms · Utilities, the Group-by toggle kept) · BLOCKS (its categories) · APPS (the layers). Same levels as today — category → chapter → page.
3. **Collection rail:** categories SETS · PACKAGES.
4. **Search rail:** the four views (Results · Tags · Graph · A–Z) as chapters.
5. **URLs stay** — `/components/*`, `/blocks/*`, `/apps/*`, `/sets/*`, `/packages/*` keep working; only the owning space changes (`spaceOf`). No redirects needed.
6. The palette's space suggestions (`open-questions/2026-09-30-e.jsx` SUGGESTIONS and the live list) follow the new tabs.

## W4 — Cards move to Sets

1. Cards leaves the Blocks rail and becomes a set; its card categories (hero · split · cta · signup · features · content · other) are its chapters.
2. `homes/cards.md` + `card-*.md` keep their files; only the space in their frontmatter/route changes.
3. Reverses W5.4 of `plan-2026-09-30-showcase-corrections` — mark it in that plan and in the phase log.

## W5 — Record

1. Phase log entry per W.
2. `05-names` and `04-workshop-system` match what shipped.

## After this plan (not in it)

- `.md` with frontmatter (`uses`, tags, related) beside every block and app — `uses` carries the Composition ladder upward.
- Styles › Ladders — one quick-reference page for tiers, tone, fg/oq, control sizes and type roles.

## Open issues

- ~~**Sets that equal one package**~~ — **ruled 2026-09-30 (user):** a set exists only when it is a purpose family worth showing apart from its package; a package's own family is its page. Built: `/sets/family/<dir>` → `/packages/<dir>`, the package page carries the family; `SetFamily.jsx` → `_tmp/2026-09-30-set-family/`.
- **Points raised 2026-09-30 (evening, user), unfixed:**
  1. EVERY category group gets its own page — said six times. Gaps: Styles › Foundations shares Tokens' `/foundations`; Collection › Packages tier groups have no path (land on first child); Docs › Documentation / Operations and Development › Tools / Records labels have no `labelTo`. Audit every rail, all spaces.
  2. Library was promised reachable and is not — only prose links in `homes/composition.md` / `collection.md` and the palette. Ruling: **Library is the shared root; Composition and Collection sit inside it as subcategories.**
  3. Sets in the Collection rail are wrong: Cards is a chapter (chevron, 18) while every other set is a bare row under it — mixed levels.
  4. Library-as-root was what the user wanted solved BEFORE the taxonomy session — the plan shipped without it.
  5. Points are logged as given; no plan is made until the user says so.
- Right-rail tags question from `plan-2026-09-30-showcase-corrections` is still open.
