---
component: PhoneNavTopAndFold
source: kol-fxr proposal frame E — https://claude.ai/artifact/KRTF3jBpfpHUsEpyroDqRD (ProtoE.dc.html); built on kol-shell/src/PhoneNav.jsx + kol-component/src/molecules/TabsRow.jsx (StackedTabs, pill)
staged: 2026-10-27
status: draft
deps: [PhoneNav, TabsRow, MoreRows, Icon]
---

# PhoneNavTopAndFold

## Purpose
fxr's phone Labs layout (user-approved frame E, 2026-10-27) puts PhoneNav at the TOP of the screen as the panel picker (Home, Catalog, Params, Transport, More) with the open panel at the bottom. PhoneNav today only floats at the bottom, carries a hairline, and More collapses the pill to a ×.

## Anatomy
- pill (TabsRow stacked, `shape="pill"`)
  - five 56px slots, 28px icons, the active slot a 44×44 `--kol-oq-08` circle (1:1, not a stretched pill)
- edge tab (folded state): 28×72, `--kol-surface-secondary`, radius 0 16 16 0, chevron-right 18px, flush to the left edge
- More sheet: `kol-phone-nav-more kol-more-sheet`, opening DOWN from a top pill

## Variants
- `placement`: `bottom` (today) or `top` (new). Top sits 16px from the top edge (safe-area inset added), sheets open below it.
- `border`: the pill's 1px `--kol-oq-08` hairline becomes optional; frame E has none.
- `fold`: a sideways swipe (>40px) folds the pill into the edge tab; a tap on the tab restores it.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| placement | `'bottom' \| 'top'` | `'bottom'` | which edge the pill floats on |
| border | boolean | `true` | the pill hairline |
| foldable | boolean | `false` | swipe-to-edge-tab |
| folded / onFoldChange | boolean / fn | uncontrolled | the folded state, so the app can persist it |
| moreKeepsOpen | boolean | `false` | More opens its sheet without collapsing the pill to the × |

## Styling
- Pill: `rounded-full p-1.5 overflow-hidden flex items-stretch`, height `TABBAR_H` (56), `background: var(--kol-surface-secondary)`, no shadow on the nav (user 2026-10-27).
- Slot: `flex items-center justify-center rounded-full`, width 56, rest `color: var(--kol-oq-64)`, active `var(--kol-oq-96)` with the 44×44 circle.
- Edge tab: as Anatomy, `color: var(--kol-oq-64)`, no border.

## States & interactions
- Tap a lit slot again: closes its panel (toggle), the app owns what a slot opens.
- More: sheet opens, the pill stays as it is, whatever panel is open stays open.
- Swipe sideways on the pill: fold to the edge tab; tap the tab: restore.

## Dependencies
PhoneNav (kol-shell), TabsRow StackedTabs + `TABBAR_H` / `TABBAR_PILL_INSET` (kol-component), MoreRows, Icon (`chevron-right`).

## Recreation notes
Molecule change in TabsRow (placement, border, active circle) plus PhoneNav (fold, More behaviour). The frame's markup is the reference look; the prototype's swipe is a plain pointerdown/up dx > 40.
