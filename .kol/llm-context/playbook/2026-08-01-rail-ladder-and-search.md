# Playbook — the rail ladder, the chip, and one search

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> System docs (user-facing): `docs/documentation/04-compositions/02-shells.md` · `docs/documentation/03-components/05-control-chrome.md`. Predecessor: `playbook/2026-07-31-content-pipeline.md`.

**Goal:** every rail rung, every chip and every search surface becomes ONE owned thing — a component that emits the string, a class that owns the look, a gate that asserts it.

**Standing rules (non-negotiable):**
- git is the user's; publishes are the agent's (/upig)
- every named file gets its repo-relative path
- a class is VOCABULARY, a component is GRAMMAR, a gate is ENFORCEMENT — naming a class never fixed a drift here
- if no token fits, say so out loud and add it to the token file FIRST; never improvise at a call site
- read-verbs report only; the user rules on his own text and on design law
- all gates clean after every step, no exceptions

---

[11:26 GMT · 2026-08-01] · arc · what shipped before this entry
  rails → RailSection (L1/L2) + RailRow (L3) own every rail rung; `.shell-nav-item` owns the look, `.shell-nav-items` the gap
  measured → both rails render ONE class string (`shell-nav-item kol-mono-14`), one row height, both with an active row
  chip → Tag rebuilt on Pill's model: 3 variants, one scheme `kol-tag--*`, every variant with hover; `color`/`solid`/`naked` deleted
  type → Tag + Pill adopted the `kol-helper-*` ramp (line-height 1); the chip box lost a third of its height
  search → TagModeOverlay demoted to ShellSearchOverlay's EXPANDED BODY; TagModeGate and the second mount deleted; one query `{text, tags[]}`
  overlay → `.kol-overlay-panel` / `.kol-overlay-scrim`; radius moved onto `--kol-radius-sm`; shadow removed entirely
  gates → 12 → 14 (headings, chrome); rails R3 + R4 added; all negative-tested

[11:26 GMT · 2026-08-01] · lesson · the same failure at four altitudes
  what → eyebrow BOX, then the COUNT's rung, then the row's utility stack, then the overlay's chrome — one disease, four heights
  shape → a shared class NAME with no owner; every call site hand-writes the rest and the two rails drift
  fix that worked → the component owns the markup, the class owns the look, the gate counts owners rather than measuring values
  proof → L3 was the one rung a component already owned (DocsToc) and the one rung that never drifted

[11:26 GMT · 2026-08-01] · regression · MINE, caught by the user
  what → Quick actions · Related · Tags · Graph vanished from the right rail during the RailRow/overlay folding
  severity → user-visible, four sections, not a design change
  rule → a refactor that removes a surface is a defect until proved otherwise; measure the rail's section COUNT before and after

[11:26 GMT · 2026-08-01] · findings · read-only answers to the open questions
  text-body → `.text-body { color: var(--kol-fg-body) }` — a COLOUR utility; Chapter and Page differ by colour only, never weight
  SearchInput → ONE component (`packages/component/src/atoms/SearchInput.jsx`), two consumers: ShellSearchOverlay + WorkViewToggle; the border is its own
  result rows → NOT a component: ShellSearchOverlay hand-rolls `role="listbox"` while `molecules/Dropdown.jsx` already does that job
  tag-list-item → NO CSS rule exists at all; that is why it centres and carries no type
  row fields → label · hint · group, from `buildShellSearchItems`; documented nowhere
  search modes → tag-filter vs keyword; nothing on screen says which is active

[11:26 GMT · 2026-08-01] · ruling-needed · the one thing not to guess
  item → a real search RESULTS PAGE (route, not modal) with per-hit previews for components / colour / type
  why → modal-plus-page is a routing decision with conditional preview surfaces; inventing that shape is how the last four drifts started

[11:37 GMT · 2026-08-01] · correction · my "regression" claim was wrong
  what → the four right-rail sections were never deleted; DocReaderSidebar has them on VAULT routes
  real gap → AutoToc (every OTHER page) only ever had Contents — two right rails with different section sets
  fix → AutoToc gained Quick actions + Graph view; measured on /foundations
  lesson → I reported a regression from a screenshot instead of checking both route families first

[11:37 GMT · 2026-08-01] · build · items 0,1,2,3,6,8 of the user's list
  rail width → --kol-shell-toc-w 14rem -> 16rem; grid measured 256/1144/256
  naming → CATEGORY (eyebrow) · CHAPTER (.shell-nav-group-header) · PAGE (.shell-nav-item) · SECTION (right-rail rows), written into the CSS
  weight → CHAPTER 500 vs PAGE 400; they were identical because the only difference was `.text-body`, a COLOUR utility
  header icons → one size, `HEADER_ICON` exported from ShellHeader; the row mixed 18 with the ThemeToggle's 24
  panel → border removed as well as the shadow; the scrim (60% + blur) is the separation
  tag body → `.docs-article` (the PROSE wrapper) was centring every row; replaced with plain chrome
  tag rows → `.tag-list-item` / `.tag-list-count` had NO CSS RULE ANYWHERE; rows are RailRow now — left, JetBrains, `shell-nav-item kol-mono-14`
  node button → removed from the body; the rail's Quick actions owns that entry
  clear filters → outline quiet -> primary

[11:37 GMT · 2026-08-01] · open · still on the goal
  4 → result rows hand-roll role="listbox" while molecules/Dropdown.jsx exists; row contract (label/hint/group) documented nowhere
  5 → no on-screen indicator of tag-filter vs keyword mode
  7 → nested `bla/bla` renders as a shape, should read as a namespace
  held → the search RESULTS PAGE (routing + per-hit previews) and gruvbox colour matching

[11:50 GMT · 2026-08-01] · build · items 4, 5, 7 — the list is complete
  4 → the palette is NOT molecules/Dropdown and cannot be: Dropdown is a SELECT (trigger, value, onChange, option rows); this is a COMBOBOX (query, group, hint, action). Stated in the file, not just decided.
  4 → the row contract is written down for the first time: label · group · hint · href · action, built by buildShellSearchItems
  5 → the mode is readable: the chip row is labelled FILTERING BY and the placeholder becomes "Narrow these results…" — the only prior signal was whether chips happened to exist
  7 → a tag is a PATH: namespace dims (`text-fg-32`), leaf carries the row; verified on `domain/components/atoms`

[11:50 GMT · 2026-08-01] · blocked-not-mine · two gates red from a mid-session arrival
  what → packages/component/src/molecules/InteractiveImage.jsx + hooks/useCoarsePointer.js appeared at 11:46, outside my edits
  gates → roster 2 (no FUNCTION for either), taxonomy 1 (molecule-test: nests no KOL component)
  why untouched → `lobby/inbox/InteractiveImage.md` is a PARKED entry; classifying it is doing parked work without a ruling. Statuses are the user's call.
  my scope → every gate my own work touches is clean; the three violations are entirely from the arrival

