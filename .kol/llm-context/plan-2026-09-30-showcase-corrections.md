# Plan — showcase corrections

**Raised:** 2026-09-30, the user's review of the showcase build (screenshots this session).
**Status:** FOR REVIEW — nothing below is built.
**Why:** the build plan (`plan-2026-09-29-phase-log-and-showcase-review`) was marked done while its own asks were half-built: homes added "sometimes", the label/chevron rule written (audit § Homes) and not wired, childless chapters ruled out and still drawn.
**Rule for this plan:** nothing is overwritten — a replaced file moves to `_tmp/<date>-<what>/` first. Each W logs into the phase log when it closes.

---

## W1 — Rail bugs

1. **Right rail L1 has no chevron.** `RailSection` draws it only when the caller passes `icon`; `RightRail` doesn't. → `RailSection` imports `Icon` itself, the prop goes.
2. **"This page" empty on every markdown home** (verified live on `/development`: the page has Tools + Records, the rail shows nothing). `DocumentationReader` takes over the rail with the markdown's own headings. → `HomeDoc` renders without taking the rail; the rail always reads the page's rendered headings.
3. **Group-by switch expands every chapter.** The fold state only knows the ids it was born with; a new id reads as open. → unknown = folded.
4. **Label also expands.** L2 label click navigates *and* toggles. → label opens the page only, chevron folds only (audit § Homes, already ruled).
5. **Rail follows you — only into a child.** Landing on a page inside a chapter opens that chapter; landing on the chapter's own home does not. Default: all folded except that one.
6. **`C` folds both rails**, not only the left.
7. **Childless chapters.** An entry with no children renders as a row, never an L2 header (Development › Tools, Sets › Framework · Workshop · Hardware · Deck · Notes). Sets drops families with no sets.

## W2 — Search

1. **Palette** — done this session: inset field, suggestions, group headings, rows on the field's size, grey tone, `Kbd` atom, `corner-down-left` + `command` glyphs. Review on Open questions Round 5.
2. **Shortcut sheet** — one row "Search everything  ⌘ K , /".
3. **Results page** — `ResultRow` restored this session (underline default). Verify by eye.

## W3 — Homes (every level is a markdown home with frontmatter)

Verified today — has an `.md` home: components · atoms · molecules · organisms · utilities · blocks · cards · sets · styles · docs · apps · the six layers · development · packages · both icon sets.

1. **Missing — build as `.md` homes:** Foundations (hand-built header) · Icons (hand-built; broken per user) · Guides (chapter points at its first guide, no home) · each Function group · each Block category · each Card category · Tools · Records · Open questions · Lobby · Documentation · Operations.
2. **Wired wrong:** `/components/atoms` renders the Components home, not `atoms.md` — check every chapter label opens its own home.
3. **One mechanism:** a chapter's home is found by its id in `showcase/src/homes/`; a chapter with no home file fails a gate (`validate:homes`), so "sometimes" can't happen again.
4. **Icons page** — find and fix what is broken, then give it its home.

## W4 — Components grouping

1. **A group label filters, it never leaves Components.** Package `workshop` → `/components?package=workshop`, not the set page.
2. **The Group-by page** (asked, skipped): the Components index carries Group by (Atomic · Function) + filter chips (tier · function · package), all in the URL like search. The rail toggle stays as the quick switch.
3. **Package leaves Group by** and becomes a filter.

## W5 — Where things live

1. **Packages → its own space** (header tab): the index + a page per package with its changelog. Out of Development.
2. **Tags · Tag graph · Index → views of the Search page** (Results · Tags · Graph · A–Z).
3. **Development keeps** References · Quarantine · Records (Phase log, Open questions) · Lobby — the temporary / lookup space.
4. **Cards → a Blocks category**, not a space (reverses the overnight agent decision). *Reversed 2026-09-30 by `plan-2026-09-30-library-taxonomy` W4: Cards is a set, under Collection.*

## Open issues

- **Right-rail tags.** The names-audit change (own tags only, grouped by namespace: `Domain` / `# components`) is not loved. Proposal: a Settings toggle between that and the old rail (own tags, then the space's top tags, full path). Undecided.

## W6 — Record

1. Phase log entry per W; the build entry's Decisions table marks the reversed agent rows.
2. `05-names` and `04-workshop-system` updated to the new spaces.
