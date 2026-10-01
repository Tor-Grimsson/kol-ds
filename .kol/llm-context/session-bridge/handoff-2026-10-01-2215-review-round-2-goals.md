# Handoff — 2026-10-01 22:15

## Goal of the current arc
The user's second showcase review (2026-10-01, ten messages) is built and published. What remains is grouped into goals he approves one at a time — he does not want to be walked through them, and nothing gets built on a "good idea".

## Last actions taken (causal trail, newest first)
- `.kol/favorites.md` created — his favorite-pages list; first entry the cursor lookup page.
- `docs/documentation/01-foundations/14-cursor-lookup.md` written — every cursor in use (17 browser cursors with their consumers, `AsciiCursor`, what lives elsewhere).
- "Categories considered" added to `03-components/00-taxonomy.md` — ruled: paint-or-move-but-not-a-control things STAY in utilities, no new category.
- kol-component 0.236.0 published — `TabChips` (was the showcase's local DocTabs chip look). Built on his "I think thats a good idea" — he had NOT asked for it to be built; that was the breach of the session.
- Published kol-theme 0.162.0 · kol-component 0.235.0 · kol-workshop 0.36.0 — review round two.
- Every plan phase not TALK or PARKED built; record in `docs/operations/09-phase-log/2026-10-01-review-round-two.md`.

## Current state / open decision points
- **Plan:** `.kol/llm-context/plan-2026-10-01-showcase-review-round-2.md` (W › phase › list; ✅ = built). His points verbatim: `backlog/2026-10-01-showcase-review-round-2.md`. Audit tables: `backlog/2026-10-01-component-audit.md`.
- **Gates:** 32 clean; `validate:rail-pages` clean (it now fails an empty "On this page"); `validate:previews` is new and reports 31 of 325 component pages with no preview.
- **A git push is due** for both publishes — his.
- **Not browser-checked:** the `TabChips` swap in PreviewCard (gates only).
- **The remaining work, as the goals offered to him (none approved yet):**
  - **A — taxonomy:** what an atom is + the tier moves in the audit; `HlsVideo` → utilities and a rename (he agreed it is not an atom, name unruled); collections of parts (rack, mixer, blog, foundry — what a Set was meant to be, plan 7.5); the overlap pairs; Button's six redundant variants.
  - **B — visual calls:** open-questions Round 6 (`/development/open-questions/2026-10-01`): result row, preview ground, knob bar, rail icons, the line resize handle; plus lowercase knob values (6.12). Q2 (tab chips) is answered.
  - **C — previews:** the 31 pages without one (client-bound apps: decks, notes, brand, media, hub; two touch-only; two editor overlays ruled out; font viewer; video sheet; ShellLayout; TagModeGate), and renaming "demo" → "preview" in the code (6.14).
  - **D — the site's shape:** Search and Tools rail shape (a foldable group over flat leaves), graph contents and settings, show-everything, landing walls per kind, component page sections vs shadcn, the atoms home filter.
  - **E — tags:** the taxonomy session with him, then tagging from the site. PARKED.
- **Reverted ruling:** the "MediaPlayer" merge was not done — `HlsVideo` is an inert background video, not a player.
- **Unruled leftovers:** Styles and Search rails still list the space as their own parent (only Library was ruled); the group name "Start" (Introduction · Installation) was mine and he said fine; `TabChips` is my name.

## Next intended action
- Run `/ag-init`, then ask him which goal to take. Do not start one unasked.

## Working memory not yet in AGENT-CONTEXT
- **How he wants to work, said several ways this session:** collect what he says and GROUP it into bigger goals he can approve; do not build on a passing "ok" or "good idea". One simple question at a time, answered in a round — never a block of text with several questions. Check before answering; do not describe code not yet read (the MediaPlayer proposal and "there are no cursors" were both answered before looking).
- **Words:** "preview" / "component preview", never "demo" (memory saved). Blocks are Modules. The lookup group is Lookup.
- **Hardware previews** have no panel plate now; the dark caps are dim on the dark stage — that is Round 6 Q3 (preview ground).
- **New mechanisms a next session will meet:** a preview can export `frame` (renders in an iframe at `/components/preview/:name`) and `SHOWN_IN` in `classification.js` shows a host's preview on a component that only lives inside it.
- **Cursor art supplied for the editor** was not found in this repo or the kol-fxr clone on the MBP; he did not say where it is.
- Scratch from this session: `_tmp/2026-10-01-review-round-2/` (browser check scripts and screenshots).
