# 🏁 Milestone: wave 4 + the toggle spec — the vault speaks doc, the toggle earns its variants

**Date:** 2026-07-30
**Agent:** Grim (Opus)
**Arc:** the handoff's wave-4 queue run to ground, then the ThemeToggle review spiral resolved into an approved 2-variant spec and shipped.
**Delivered:** icons 0.8.11 · workshop 0.3.4→0.3.6 · theme 0.13.3 · framework 0.9.0, all published; the vault reader retyped to the doc voice; vault parity (tag colors, content search, related rail, node graph); per-component import provenance; 66/66 MDX docs carrying authored prose; the ThemeToggle rebuilt on the user-approved spec.

## What closed

- **Vault-reader retype** → DONE (workshop 0.3.4). `.kol-prose` banned from docs surfaces; every reader element speaks the mdx-components `kol-doc-*` dialect; the two drifted block-switches folded into one renderBlock; markdown tables ride THE kol-component Table.
- **Vault parity** → DONE 5/5 (theme 0.13.3 + workshop 0.3.5). Tag color rules authored (the classes had shipped for weeks with no CSS — the dangling-rules trap); search matches doc CONTENT (engine extracts fence-aware headings); Related rail from frontmatter wikilinks; TagModeGate mounted → node graph live (provider wraps the shell — a route-scoped provider left the portalled rail on the noop fallback). "View components" quick action → RULED fine as-is (helpers, not requirements).
- **INDEX hubs render as junk** → BUG, fixed (workshop 0.3.6): table cells now split on unescaped pipes only (`\|` wikilinks exploded across cells) + resolveDocLink resolves index/collision-prefixed ids via the parent folder. documentation-INDEX: 0 → 34 live links.
- **Imported-from history** → DONE. `scripts/extract-origins.mjs` mines lobby/done frontmatter → component-origins.json (96 components, 7 origin repos); every component page prints `Imported from <source> · <date>`.
- **MDX prose** → DONE 66/66, authored from each component's own source-header canon, siblings cross-linked; backlog stamped CONTENT AUTHORED (deepening stays open-ended by design).
- **The toggle review spiral** → RESOLVED as a spec, then shipped (framework 0.9.0). Rounds: desktop glyph rejected → dashed-circle candidate → **no third glyph ever** (system wears the split circle, told by label); guides chip inverse + left; the variant question resolved by the user's own decomposition into the approved 2-variant model — **variants are container geometry only** (`button` / `flush`), everything else props (`fill` subtle|none · `label` · `iconRight` · `fullWidth` · `size`). Deprecated aliases render 0.6.x chrome verbatim; ShellHeader migrated; docs + api extraction synced. Spec table logged in the playbook, user-approved.
- **The brother's npm mess** → CLEANED. framework 0.8.0 (raw `workspace:*` — published with npm not pnpm from the website side) deprecated on the registry; 0.8.1 verified good; the ride-along roll rework legitimized by the spec arc above.
- **feature-split-pull em italic** → RULED KEEP (big italics fine, small ones not). Website lobby note filed (`kol-website/lobby/ShowSansItalicDisplay.md`) to display it for the user — no class needed, the RG italic cuts + `font-style: italic`.
- **kol-loader@0.3.0 orphan** → DONE (post-capstone, same day): deprecated on the registry by the agent on the user's go ("Superseded by @kolkrabbi/kol-icons"), verified; no source dir existed to retire — the orphan lived only on npm.
- **_tmp proposal artifacts** → NON-ISSUE by ruling: `_tmp` is the untracked dumpster; nothing to clean.
- **Lobby hygiene** → REPAIRED (post-capstone, same day): the agent had closed two entries' work without their lobby bookkeeping, then audited raw files instead of the INDEX ledger (mislabeling parked InteractiveImage as open — statuses are the USER's call, never the agent's). Per the lobby's own law: ThemeToggleButtonVariant + resolution → `done/` (+ Processed row) · NOTE-framework-0.8.x + resolution → `archive/` · INDEX queue 3 → **1** (InteractiveImage, parked, untouched).

## The arc (brief)

Started as the handoff's wave-4 queue and stayed it until the toggle review
opened a second front: three proposal rounds where the real blocker was
**communication shape** — jargon-renamed variants, an overloaded "Covers"
column, tables that weren't tables — resolved the moment the spec was
re-rendered in the user's own tree shape ("log that table, that is a nice
table"). The standing lesson repeated all day: reference beats invention
(tag rules existed in a spec, prose existed in source headers, the variant
grammar existed in Button), and a proposal is only as good as its coverage —
full matrix, real chrome, both directions.

Spans: `playbook/2026-07-30-mdx-content-migration.md` (waves 4.0–4.4 + the
toggle rounds — the full ruling trail).
