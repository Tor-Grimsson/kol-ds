/**
 * admitted.js — THE admission gate (quarantine plan, phase 1).
 *
 * The sidebar is DERIVED (roster.js from the package barrels, shell-nav.js from
 * the surface list), so quarantine cannot be a hand-edit of a nav array — it has
 * to be a gate on the derivation. This is that gate, and it is the only
 * hand-authored part of it: same seam and same spirit as classification.js.
 *
 * The rule the plan set: no surface is shown before its rule is written. A
 * category appears in the shell when — and only when — its key is in ADMITTED,
 * and it gets there after HE looks at it and says yes. Readmitting is one line;
 * so is sending something back.
 *
 * Quarantine gates the SIDEBAR, never existence. Every held route still
 * resolves, still renders, and still answers ⌘K by name (2026-07-30
 * reachability rule) — it is held out of the tree, not deleted from the app.
 * The holding page at /quarantine links each one.
 */

/* ── THE SET ───────────────────────────────────────────────────────────────
 * Foundations first, because everything downstream cites it (plan phase 2,
 * row 1) and its gate is the only one already closed: R3's wrappers landed on
 * the swatch grid and both tables, and `pnpm validate:width` is green over
 * them. Row 0 (the shell frame) is not a category — it landed as the
 * ShellLayout cap and cannot be quarantined; it IS the frame. */
export const ADMITTED = new Set([
  'foundations',
  /* DOCUMENTATION admitted 2026-08-01 on the user's instruction — *"import the
   * remaining documentation chapters"*. Its `chapters: ['*']` wildcard opens
   * every vault chapter not claimed by another key: 00-overview, 03-components,
   * 04-compositions, 05-brand, 06-research, 08-breakpoints. Icons keeps its own
   * gate and stays held; Operations keeps its own key and stays held. */
  'documentation',
  /* OPERATIONS admitted 2026-08-01 on the user's instruction. Its own key, its
   * own eyebrow, its five enumerated chapters. */
  'operations',
  /* THE 2026-08-09 READMISSION — the user's instruction ("go do whats left"),
   * each category read against its rule the same day; verdicts in each entry's
   * `why` below and in 02-placement.md § The pass. */
  'icons',
  'atoms',
  'molecules-organisms',
  'packages',
  'blocks-sets',
  'docs',
  'search',
  'references',
])

/* ── THE CATEGORIES ────────────────────────────────────────────────────────
 * The readmission order is the plan's, not a new one. `surfaces` are tab ids
 * in shell-nav.js; `categories` are registry category keys (which are roster
 * tiers, plus the fw-* split). `rule` is the document the category waits on —
 * a path, resolved to its vault link at render time so a moved doc degrades to
 * text instead of a dead route. */
export const CATEGORIES = [
  {
    key: 'foundations',
    label: 'Foundations',
    surfaces: [],
    /* CHAPTER, not a category (2026-07-31). It is `docs/documentation/
     * 01-foundations/` — chapter 01 of Documentation — and admitting it opens
     * that chapter inside the Documentation tree, live React pages included
     * ("a page is a slot"). It used to be a top-level surface beside
     * Documentation: one body of content, two doors, no parent. */
    chapters: ['01-foundations'],
    categories: [],
    rule: 'docs/documentation/01-foundations/05-layout-systems.md',
    awaits: 'R3 · width — content kind → wrapper, enforced by `pnpm validate:width`',
    why: 'Everything downstream cites it, so it is admitted first.',
  },
  {
    key: 'icons',
    label: 'Icons',
    surfaces: [],
    chapters: ['02-icons'],
    categories: ['icons'],
    rule: 'docs/documentation/04-compositions/02-shells.md',
    awaits: 'R2 · rail — satisfied; ramp, keyline overlay and BG toggle verified live 2026-08-09',
    why: 'The MODE toggle is RULED DEAD (2026-08-09): the v1 set is single-voice by design — the variant prop was culled at kol-icons 0.8.0 and the page already renders honestly without it.',
  },
  {
    key: 'documentation',
    label: 'Documentation',
    surfaces: ['documentation'],
    /* Every chapter NOT claimed above. `*` means "the rest of the vault", so a
     * new chapter folder is visible the moment Documentation is admitted
     * rather than silently held by an enumeration nobody remembered to edit. */
    chapters: ['*'],
    categories: [],
    rule: 'docs/documentation/INDEX.md',
    awaits: 'R4 · metadata — one dialect, enforced by `pnpm validate:frontmatter`',
    why: 'The generated usage catalog left the vault 2026-07-31; the panel, the tag colours and the graph entry are landed but unchecked.',
  },
  {
    key: 'atoms',
    label: 'Atoms',
    surfaces: [],
    categories: ['atoms'],
    rule: 'docs/documentation/03-components/02-placement.md',
    awaits: 'R1 · membership — the 2026-08-09 pass over all 239 exports; ledger in 02-placement.md § The pass',
    why: 'ExitPreview stays flagged and its page now says so (MEMBERSHIP_FLAGS); the other 40 atoms keep.',
  },
  {
    key: 'molecules-organisms',
    label: 'Molecules + organisms',
    surfaces: [],
    categories: ['molecules', 'organisms'],
    rule: 'docs/documentation/03-components/02-placement.md',
    awaits: 'R1 · membership — same 2026-08-09 pass',
    why: 'All kept; demo gaps (PopoverPanel, the five color-tool molecules) recorded as gaps, not failures.',
  },
  {
    key: 'packages',
    label: 'Framework, workshop, flat packages',
    surfaces: [],
    categories: [
      'fw-chrome', 'fw-structure', 'fw-behavior',
      'workshop', 'dashboards', 'chess', 'foundry', 'styleguide',
      'content', 'store', 'brand', 'brand-template', 'misc',
    ],
    rule: 'docs/documentation/03-components/02-placement.md',
    awaits: 'R1 · membership — same 2026-08-09 pass, per package',
    why: 'Package-tier membership is ARCHITECTURE §3\'s recorded decision; TagModeGate (orphaned mount) and AlternativeControlsMock (demo harness) flagged, their pages say so.',
  },
  {
    key: 'blocks-sets',
    label: 'Blocks + Sets',
    surfaces: ['blocks', 'sets'],
    categories: [],
    rule: 'docs/documentation/04-compositions/01-blocks-and-sets.md',
    awaits: 'R4 · metadata — verified 2026-08-09: all 31 modules (22 blocks + 9 sets) carry the full contract',
    why: 'One chrome owner confirmed: both surfaces render CollectionPage → BlockViewer → PreviewCard at one width.',
  },
  {
    key: 'docs',
    label: 'Docs',
    surfaces: ['docs'],
    categories: [],
    rule: 'docs/operations/03-showcase/04-surface-rules.md',
    awaits: 'rule written 2026-08-09 — living standards pages; absorption into the vault rejected (their bodies mount React)',
    why: 'Shell & Layout, Menus, Loaders, Type roles — a surface of their own in the Tools group, frontmatter on the R4 contract.',
  },
  {
    key: 'search',
    label: 'Search',
    surfaces: ['search'],
    categories: [],
    rule: 'docs/operations/03-showcase/04-surface-rules.md',
    awaits: 'rule written 2026-08-09 — the page form of the ⌘K overlay: one item source, one matcher',
    why: 'Placed in the Tools group; it reads buildShellSearchItems(), so it cannot drift from the modal.',
  },
  {
    key: 'references',
    label: 'References',
    surfaces: ['references'],
    categories: [],
    rule: 'docs/operations/03-showcase/04-surface-rules.md',
    awaits: 'rule written 2026-08-09 — generated measurement, no hand-authored rows',
    why: 'Placed in the Tools group beside Search; built from usage-index + token-index, so it cannot rot.',
  },
  {
    /* OPERATIONS is its own category (2026-07-31). Its four chapters used to
     * fall through the `*` wildcard onto Documentation's gate, so admitting
     * Documentation would have silently opened Operations too — one admission,
     * two categories, which is the whole thing this gate exists to prevent.
     * A category with content gets a key of its own. */
    key: 'operations',
    label: 'Operations',
    surfaces: [],
    /* 05-reference-graph WAS MISSING from this list (found 2026-08-01). Every
     * chapter not claimed by a key falls through the `*` wildcard onto
     * Documentation's gate — which is precisely the leak the comment above
     * warns about, live in the file that warns about it. Admitting Documentation
     * would have opened the reference-graph chapter under it. Enumerated now,
     * and the same check is the thing to run whenever a chapter folder is added. */
    chapters: ['01-release', '02-workbench', '03-showcase', '04-content-pipeline', '05-reference-graph'],
    categories: [],
    rule: 'docs/operations/04-content-pipeline/INDEX.md',
    awaits: 'nothing structural — repo machinery, and the content pipeline that documents this gate lives in it',
    why: 'Held only because no category is admitted before he has looked at it. Its own chapters, its own key.',
  },
]

const BY_SURFACE = new Map()
const BY_CATEGORY = new Map()
const BY_CHAPTER = new Map()
for (const c of CATEGORIES) {
  for (const s of c.surfaces) BY_SURFACE.set(s, c.key)
  for (const k of c.categories) BY_CATEGORY.set(k, c.key)
  for (const ch of c.chapters ?? []) BY_CHAPTER.set(ch, c.key)
}
/* The gate key that owns a vault chapter. An explicit claim wins; otherwise
 * the `*` holder (Documentation) takes it, so a NEW chapter folder appears the
 * day Documentation is admitted instead of being held by an enumeration that
 * nobody remembered to update — silent holding is the failure this gate exists
 * to prevent, pointed the other way. */
const WILDCARD = CATEGORIES.find((c) => (c.chapters ?? []).includes('*'))?.key ?? null
export const gateOfChapter = (folder) => BY_CHAPTER.get(folder) ?? WILDCARD

/* A LOOSE FILE IS GATED BY ITS CATEGORY, NOT THE WILDCARD (2026-08-01).
 * `docs/operations/SHIPPED-PACKAGES.md` has no chapter, so `gateOfChapter(null)`
 * fell straight through to the wildcard — Documentation's key — and rendered an
 * OPERATIONS eyebrow holding one file while all five of its chapters stayed
 * held. One category's admission was opening another category's content: the
 * exact leak this gate exists to stop, one rung below where it was last found.
 *
 * A category key IS its folder name, so the lookup needs no second map. */
export const gateOfCategory = (category) =>
  CATEGORIES.find((c) => c.key === category)?.key ?? WILDCARD

export const isCategoryAdmitted = (category) => ADMITTED.has(gateOfCategory(category))

/* A surface tab or a component category with no category key is HELD, never
 * silently shown — a new tab has to be classified to appear, which is the
 * whole point of an admission gate. */
export const categoryOfSurface = (id) => BY_SURFACE.get(id) ?? null
export const categoryOfComponent = (key) => BY_CATEGORY.get(key) ?? 'packages'

export const isSurfaceAdmitted = (id) => ADMITTED.has(categoryOfSurface(id))
export const isComponentAdmitted = (key) => ADMITTED.has(categoryOfComponent(key))
export const isChapterAdmitted = (folder) => ADMITTED.has(gateOfChapter(folder))

/* The Documentation tree opens when ANY chapter inside it is admitted — a
 * chapter is not reachable without its category showing. */
export const anyChaptersAdmitted = () =>
  CATEGORIES.some((c) => (c.chapters ?? []).length && ADMITTED.has(c.key))

/* The components tab is not a category — it is the door to three of them, and
 * it opens when any one of them is admitted. */
export const anyComponentsAdmitted = () =>
  CATEGORIES.some((c) => c.categories.length && ADMITTED.has(c.key))

export const HELD = CATEGORIES.filter((c) => !ADMITTED.has(c.key))
