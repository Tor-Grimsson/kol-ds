# Session: the kol-ds-fxr lobby wave, and the record panel driven to the reference

**Date:** 2026-08-09
**Agent:** Grim (Fable 5)
**Summary:** Closed both kol-ds-fxr lobby tickets (transport icons + dropdown viewport clamp, published), then a long hostile live-review push on the RecordManager panel — content rebuilt to the Framer reference field-for-field, the drawer stripped of scrim/shadow, the `--ui-*` ladder gained its dark tier, and two hard reprimands landed: **no publishing mid-review**, and **package chrome never rides arbitrary Tailwind utilities** (second offense, rows stacked).

## Changes Made

### Lobby wave (published, registry-verified, before the no-publish reprimand)
- **icons 0.13.0** — `stop` + `rewind` minted into `playback/` from `_tmp/legacy-icons` (user's call), keyline-conformed; NOT aliases (the ticket's described rewind was literally `skip-start`). Inventory doc regenerated **171 · 26** (header had sat stale at 165 since 0.8.10).
- **component 0.32.3 + theme 0.32.4** — Dropdown viewport clamp: Popover `size` `apply` sets `maxHeight` from `availableHeight` (padding 8) beside the exact fused width; `.kol-dd-panel` flex column, `.kol-dd-list` scrolls; opens scrolled to the checked row. No height prop — automatic. Flip-above declined (fused-edge law).
- Receipts returned into **kol-ds-fxr/lobby/outbox/ (created — its first)**; ledger queue back to zero; 📌 both remainders are the editor's (adopt the bumps).
- **component/theme 0.32.5** — chip sizing + `--primary` chip + row centering; published mid-review → **user ruling: NEVER publish mid-review; fixes ride HMR via workspace:\*. Publish only on sign-off.** Everything after stayed local.

### Tokens (kol-base-tokens.css) — UNPUBLISHED
- **`--ui-*` dark tier minted** — the ladder had NO dark values (dark rendered the light-surface `#15803D`). Both dark blocks (explicit + system mirror): error `#F87171` · warning `#FACC15` · info `#60A5FA` · success `#3DD68C` (sampled off the user's reference mint). Cascade trap defused: kol-color.css loads later, so the ui block wears `:root`-qualified selectors.

### StatusChip (FieldRow.jsx + theme) — UNPUBLISHED
- Final box: `px-2 py-0.5 gap-2`, mono-12, rounded-full; chevron (it's a chevron, not a caret — user correction) at `size 10`; `.kol-status-chip svg path { stroke-width: 3px }` (hairline → ~1.5px rendered).
- `variant="primary"` (`.kol-status-chip--primary`, dd-primary fill) minted for cover-focus, then **benched same session** — cover-focus chips ruled "grey like Archived" (neutral base). Machinery remains, currently consumer-less.

### RecordManager / FieldRow / ShellDrawer — UNPUBLISHED
- **Table**: cover thumb 24×48 (chip-height, 2:1, measured off the frame); select columns render StatusChip (neutral); rows `align-middle` (scoped, Table base stays v-top); title-cell open affordance = **IconFrame** `variant="outline"` with glyph filling the content box and **padding as the only size knob** (3px inline probe — bake to a class when the value settles). The bespoke `ToggleOverlayButton` atom lived ~10 minutes → `_tmp/2026-08-09-toggle-overlay-button/`.
- **Panel content = the reference, field for field**: full 19-field list (Title → Image 5 Focus, labels verbatim); record 1 content is `'title'` placeholders (Dolce & Gabbana strings swapped out on user order); full-width selects + file rows (`Choose File...`), always-visible × disc on media tiles (`.kol-overlay-scrim` ink per the chrome gate), filled borderless empty tiles, white labels, real photos (`/kol-images/tt-0*.jpg` — the SVG mock read as a grey blob), globe glyph MISSING from the set (hint renders without it).
- **Row anatomy**: `.kol-field-row` grid (label 12rem left, control right) lives in **kol-theme** — the arbitrary `grid-cols-[…]` utility missed generation in the consumer build and rows STACKED; the SegmentedToggle lesson re-learned, and an inline-style middle step was called out as a shitfix. `py-3` rhythm, hairline every seam incl. `border-t` above row 1, tiles 136×72, **radius 4px** (an 8px `rounded-lg` leak purged — the repo ships 4px or full, nothing between).
- **ShellDrawer**: `backdrop` prop (false = no scrim, no blur, AND no `shadow-2xl`); start-side × is a **bare glyph** (no Button container); start-mode header inset `pt-3 pl-2`. RecordManager passes `backdrop={false}`; panel width = **60% of the table pane** measured at open (not viewport).
- **Overlay-modal detour**: panel rebuilt as a full-cover opaque overlay on a misread, then reverted same hour — the drawer opening was "the one thing that was correct".

### Docs
- `02-icons/01-inventory.md` regenerated (171 · 26, playback 8); `02-shipped-packages.md` synced twice (was a full storm stale, now 0.32.5/0.32.5/0.13.0 per package.json truth).

## Current State

### Working
- All 19 gates clean. Registry: theme **0.32.5** · component **0.32.5** · icons **0.13.0** · framework 0.17.0 · workshop 0.20.1. fxr tickets closed with receipts.

### Known Issues
- **Large UNPUBLISHED delta on component + theme** (everything after 0.32.5) — publish + bump only on the user's sign-off, per the mid-review ruling.
- The toggle-overlay affordance's 3px padding is an inline probe at the call site.
- `StatusChip variant="primary"` + `.kol-status-chip--primary` are consumer-less; retire or keep is the user's call.
- No globe glyph in the set — the slug hint renders without the reference's icon.
- The review was NOT signed off — the user left furious; expect the next session to open mid-review.

## Next Steps
1. On sign-off: bump + publish the component/theme delta in one wave; sync fxr receipts if the clamp behavior changed further.
2. Bake the settled toggle-overlay padding into a proper class.
3. Standing: tier re-sort review; fxr adoption remainders; dotfiles/humpty receipts 🔵.
