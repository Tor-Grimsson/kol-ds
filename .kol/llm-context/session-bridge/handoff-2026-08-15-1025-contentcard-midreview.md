# Handoff — ContentCard system, mid-review

**Written:** 2026-08-15 10:25 · **Machine:** iMac
**Retrospective log:** `session-log/2026-08-15-content-card-system-scoped.md`

## Where the work stopped

Mid **live visual review** of `docs/visual-reference/content-card-unification.html`
with the user. He is reading the page section by section and issuing per-line
rulings; the agent applies one edit and he checks the render. **Nothing is built,
nothing is published.**

The review reached `article`. `default` · `catalog` · `print` · `article` have had
rulings; `work` and `typeface` have not been reviewed at all.

## In-flight state the log does not carry

**Open on screen, unresolved:**
- `typeface` uses `helper-*` on text that wraps — breaks the rule set this session
  (helper is `line-height: 1`, valid only where truncated or width-restricted).
  Flagged to the user, not ruled, not touched.
- `article` kicker is `helper-12` with no truncate — same rule, borderline because
  the string is short.
- The page's **ink section and standards table still say the ink spelling is
  open**. It is not: `01-tokens.md` + `03-typography.md` rule that text uses roles
  (`subtle`/`meta`/`body`/`lede`/`strong`/`shout`/`scream`/`emphasis`) and raw
  `fg-*` stops only where no role has business meaning. The page contradicts the
  docs; the user said "sit down" before it was fixed.

**Rulings made this session, per variant — these are the user's, do not re-derive:**
- `default` — all lines `helper-12` (title is truncated, date/size fixed-width, so
  helper is legal). Card line 2 is a GROUP of two fields, 16px apart. Card gap 12px.
- `catalog` — MONO not helper, because both lines wrap. Title steps by form:
  card `mono-14`, row `mono-12`. Detail `mono-10` both. Card gap 8px.
- `print` — built rather than listed as missing; derived from catalog's treatment.
  Card `mono-14`, row `mono-10`, detail `mono-10`. Card title ink `body`.
- `article` — kicker `helper-12`; **line 3 (body) unified to `mono-14 · body` in
  both forms**; meta is `default` card's group verbatim. Title deliberately still
  steps: `sans-heading-03` card / `sans-heading-05` row.
- Content: ONE string set across all six variants. Ink: three roles only —
  `emphasis` / `body` / `meta`.

## The working method he demands

Learned the hard way this session; ignoring it is what made the review painful.

1. **Change only what is named.** A ruling on one variant is not a sweep. A ruling
   on line 3 does not touch line 2.
2. **"Use X from Y" means copy Y's whole div** — type, ink, layout, spacing — not
   the one attribute used to name it.
3. **Never re-layout.** "Give me values not paragraphs" means swap the text for
   values, not rebuild the section.
4. **Confirm the reading before editing** when a request is ambiguous — but do not
   ask when it is not, and never ask twice.
5. **Run the page headless after every edit.** A syntax check passes on code that
   still throws (`STRUCT is not defined` shipped that way). Extract the `<script>`
   and eval it with a stubbed DOM; check for `[object Object]` and `undefined`.

## Do not

- Do not publish `@kolkrabbi/kol-component`. It sits **bumped to 0.45.1** with a
  changelog entry, unpublished, from an unasked publish-path start.
- Do not touch **kol-mirror** — parked by the user; monitor is the focus. (It still
  breaks on the next kol-shell bump: pinned to `0.1.0`, imports `ContentFilters`,
  removed in `0.3.0`.)
- Do not run Playwright. The user asked for it to stop; verify headless instead.
- Do not start building the system. It is a design ruling in progress.

## Next action

Resume the review at `work` and `typeface` — neither has been looked at. Then close
the two open rulings in `docs/documentation/03-components/06-content-card-system.md`
(the A4-vs-`/export-specs` ratio question, and the `ListingCard` rename that
reverses a day-old kol-website ruling).
