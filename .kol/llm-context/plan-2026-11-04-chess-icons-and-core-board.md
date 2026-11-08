# Plan — Chess glyphs into kol-icons · the core icons board on linked instances

**Raised:** 2026-11-04, the user. Points verbatim: *"I want these in to icons. so they need to be /kol-icon /lobby-icon"* (library--kol-ds-ui 437:5529) · *"Then I want kol-icons instance set up like this"* (library--kol-ds-ui 437:4847, frame `icons`).
**Status:** DRAFT — 2026-11-04. Nothing built.
**Shape:** W › phase › list.
**Laws carried:** the kol-icon spec (24 grid, keyline fit, centring, collision check) before anything enters the set; masters only on ↳ Icon masters, every other glyph a linked instance (kol-figma skill); Figma work on kol-figma-agent in the background; version bump + CHANGELOG + inventory in the same edit; publish mine, git his; icons on oq; never name the outside icon library; never delete (→ `_tmp/`).
**How a phase closes:** measurable acceptance line first, gates green, then one look against his board.

Source file: ❖ library--kol-ds-ui `n48kE2bJtrFjl7wxst30xH`.

## W1 — The twelve chess glyphs in kol-icons

Source: frame `Frame 1000009188` (437:5529) — black and white × pawn, rook (drawn as `hrook`), bishop, knight, king, queen.

### 1.1 — Carve (/kol-icon)
- Pull the 12 SVGs, clean them (currentColor, export junk out), names `chess-<piece>` and `chess-<piece>-solid` (black = the solid twin, white = the outline, the set's `-solid` rule), `hrook` → `rook`; check against the spec and against kol-chess's own pieces.
- Acceptance: 12 SVGs pass the spec checks (24 viewBox, centred ±0.5, keyline 18–20); 0 name collisions with the set.

### 1.2 — Into the set (/lobby-icon) + Figma + publish
- A `chess` group in kol-icon-set-interface; inventory, CHANGELOG, kol-icons minor bump, published; the 12 masters on ↳ Icon masters with Code Connect (outline/solid as the `variant` pair like the other 72 pairs).
- Acceptance: `<Icon name="chess-knight" variant="solid" />` renders; the 12 masters are linked components with Code Connect live; kol-icons live on npm.

## W2 — The core icons board on linked kol-icons instances

Source: frame `icons` (437:4847) — "Core Icons Needed (100-200 Essential)": 16 category blocks in four columns (Navigation 22 · Actions & Controls 27 · Files & Documents 16 · Communication 9 · User & Authentication 16 · Status & Feedback 9 · Media 21 · Time & Calendar 9 · Layout & UI 21 · Editing & Content 18 · System & Tools 15 · Theme & Display 5 · E-commerce & Shopping 8 · Stats & Data Visualization 15 · Shapes & Geometric 6 · Miscellaneous 9), each a column of 24 glyphs beside its name list.

### 2.1 — Map every board name to a kol-icons master
- A table board name → kol-icons name (exact, alias, or none) for all ~226 slots, from the set's index; the board's own "(generated)" marks noted.
- Acceptance: every slot mapped or listed as missing; the table lives in `_tmp/2026-11-04-core-board/map.json`.

### 2.2 — The board rebuilt from instances
- The same layout (title, four columns, 16 blocks, heading with count, glyph column, name list) on ↳ Icons, every glyph a linked instance of its Icon master, the name list from the master names; the loose copies retire to _trash `_`-prefixed.
- Acceptance: 0 loose glyphs, 0 detached; block counts equal the board's; layout boxes ±0 of 437:4847.

### 2.3 — The missing ones — TALK
- Slots with no kol-icons master go to him as a list on the board's side (name, his drawing beside it); carving them is his call per glyph (the W1 path), never assumed.

## Open — TALK

- 2.3.
