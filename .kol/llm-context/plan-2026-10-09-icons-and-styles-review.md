# Plan — the icons + Styles review

**Raised:** 2026-10-09, the user's pass over ui.kolkrabbi.io › Styles › Icons (22 screenshots).
**Status:** ✅ CLOSED 2026-10-09 — all published: kol-theme 0.171.0 · kol-icons 0.35.0 · kol-component 0.247.0. Round 10 approved (after two follow-ups: cable gaps split, shackle raised, bubbles wired with a stroke, rack → rack-v, KDS + logomark on the keyline square). Glyphs on open-questions Round 10 (`2026-10-09-b.jsx`), before/after; old SVGs in `_tmp/2026-10-09-icons-before/`. Old names `customize` / `user-interface` resolve via `RENAMED_ICONS`. W1.6 sweep: ContentRow · ContentCard · ContentText · BadgeWithIcon moved onto `variants`.
**Shape:** W › phase › list. Glyph redraws land as before/after on an open-questions round, decided on his directions, for review. Replaced SVGs move to `_tmp/2026-10-09-icons-before/`.

---

## W0 — kol-fxr first

### 0.1 — SegmentedSunkenNoBorder — ✅ closed, kol-theme 0.171.0
- `kol-components-molecules.css:2296`: sunken/inverse strip `border-width: 0` (was `border-color: transparent`). Cells fill the pinned height; dividers unchanged. Receipt returned to fxr.

## W1 — Showcase: the Styles space and the icons page

### 1.1 — Icons in ⌘K
- `buildShellSearchItems` (`nav/shell-nav.js`) lists no icon sets, groups or icons. Add sets + groups as pages, each icon as an item (`kind: 'icon'`) linking to its group.

### 1.2 — Tones under Color
- Tones is a lone leaf in Foundations. Fold it in as a Color child (`DOCS_SPECIMENS` + the rail); keep `/foundations/tones` as the URL.

### 1.3 — Filter row tone + ground default
- `IconsGallery.jsx`: `ContentFilters`, `Dropdown`, `ViewToggle` from `tone="sunken"` → `primary`.
- Ground defaults to light (`groundOverride` seeded `'light'`), not the app theme.

### 1.4 — List view carries the glyph
- `ContentRow variant="catalog"` gets a thumb by default (today `thumb: 0`); `media={false}` still hides it. The icons LIST passes the glyph on the current ground.

### 1.6 — Previews show the default, variants in the picker
- The rule (2026-08-01): a preview exports `variants` and the toolbar's Variant dropdown switches them. ContentRow's preview never adopted it — it stacks all five. Move it onto `variants`, and sweep every preview that still stacks variants the same way.

### 1.5 — Specimen fills the tile
- The glyph + guide render at the size picker's px inside a larger plate, so margins are unreadable. Default the specimen to fit the tile (guide box = plate inset), size picker still overrides.

## W2 — Glyph fixes

Signal set (`kol-icon-set-signal/`):
- **cable-lock / cable-unlock** — identical today; unlock gets an open shackle. **cable-trans** — wider gaps between dashes.
- **clr-anl** — the three dots sit on the ring's centreline.
- **curve-exp / curve-log** — mirror each other exactly (log = exp reflected about the diagonal).
- **dith-cross** — grid lines either meet the frame or keep a clear gap; pick gap to match line-grid.
- **dith-diamond, dith-flower** — scale to the keyline box. **clr-mono** — r 6.5 → the circle keyline (line-circle's size).
- **logic-and / nand / nor / not / or** — no stroke overlaps (inputs stop at the body, bubble sits clear); xor is the model.
- **grad-lin, gen-wave** — the diagonal / curve either meets the frame cleanly or keeps a gap; no half-overlap.

Interface set (`kol-icon-set-interface/`):
- **tr-inf** (transport) — round lemniscate, no hard corners (his refs: open-gap or continuous).
- **rotate-left / rotate-right** — one arc radius for both, arrowhead rotated onto the curve's tangent with equal arms; skip-back-15 is the closer model.
- **customize vs nav-settings** — one glyph, nav-settings (punched hole). customize becomes an alias on the 30-day ledger.
- **rack** — rails meet the frame top and bottom; add **rack-h** (horizontal rails).
- **globe** — widen the inner meridian ellipse so the three bands read equal.

## W3 — Identity group (user, 2026-10-09: *"favicon icon group seperate … favicon logo identity or smth like that"*)
- Group **identity** (ruled). The `kolkrabbi/` group (`kol-ds`, `kolkrabbi`) renames to it; `user-interface` moves in from Layout and is renamed **`metrics`** (its favicon use) — `user-interface` stays as an alias on the 30-day ledger.
- New favicons land there as they arrive.

W2 ships as one kol-icons minor + one open-questions round (before/after, 16 and 24).
