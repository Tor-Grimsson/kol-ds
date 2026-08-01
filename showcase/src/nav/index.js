/**
 * nav/ — THE MANIFEST.
 *
 * These seven files are one system: they turn the repo's seven content roots
 * into the sidebar, the search palette and the routes. They lived in `lib/` as
 * seven unrelated-looking helpers with no name and no index, which is exactly
 * how a *chapter* came to be rendered as a *category* on 2026-07-30 — nothing
 * told the next reader that they were parts of one thing.
 *
 * Full system: docs/operations/04-content-pipeline/
 *
 *   roster         every component, derived from the package barrels
 *   classification tier assignment for the flat packages
 *   registry       roster + mined usage + docs, joined per component
 *   vault          docs/**\/*.md → CATEGORY → chapter → page
 *   chapter-pages  slot-pages: live routes that belong to a vault chapter
 *   shell-nav      routes, surfaces, search rows, tree builders
 *   admitted       the quarantine gate — what the shell may show
 *
 * THE RULES (docs/operations/04-content-pipeline/03-manifest.md):
 *   - it holds POINTERS, never content — a description belongs to its doc
 *   - it may not fork a source: if this and a barrel disagree, the barrel wins
 *     and `pnpm validate:roster` fails the build
 *   - it may not silently hide: a held category is out of the TREE, still
 *     routable, still findable by name — `pnpm validate:reachable`
 */
export * from './roster.js'
export * from './classification.js'
export * from './registry.js'
export * from './vault.js'
export * from './chapter-pages.js'
export * from './shell-nav.js'
export * from './admitted.js'
