---
component: TransportPill
source: kol-fxr proposal frame E — https://claude.ai/artifact/KRTF3jBpfpHUsEpyroDqRD (ProtoE.dc.html); today's bar is kol-fxr/src/editor/params/TransportBar.jsx
staged: 2026-10-27
status: draft
deps: [TabsRow, MoreRows, Icon]
---

# TransportPill

## Purpose
On a phone, fxr's transport becomes a floating pill in PhoneNav's shape (user-approved frame E, 2026-10-27): the same slots and icon size as the nav, floating over the open panel, foldable to a right edge tab. It needs the pill shell to hold ACTION buttons rather than navigation, and one slot that opens a sheet anchored above it.

## Anatomy
- pill: 294 wide (five 56px slots + 14), height 56, bottom 16px, centred
  - Play, Pause (radio pair: the current one gets the 44×44 circle)
  - Loop length: stopwatch icon; opens a sheet of lengths
  - Stop, Rewind (actions)
- sheet: `kol-phone-nav-more kol-more-sheet` above the loop slot, rows `kol-btn kol-btn-nav kol-btn-lg kol-mono-16 h-11`, a 22px check on the current length (2, 4, 8, 12, 16 s)
- edge tab (folded): 28×72 on the RIGHT edge, radius 16 0 0 16, chevron-left

## Variants
None beyond folded / unfolded.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| items | `[{ id, icon, label, onPress, selected? }]` | — | the action slots |
| sheetFor | `{ [id]: rows }` | — | a slot that opens a sheet instead of firing |
| foldable / folded / onFoldChange | boolean / fn | `false` | swipe to the edge tab |
| placement | `'bottom' \| 'top'` | `'bottom'` | edge |

## Styling
- Shell = PhoneNav pill: `rounded-full p-1.5`, `--kol-surface-secondary`, no border, `box-shadow: 0 8px 40px rgba(0,0,0,0.45)` (it floats over content, the nav does not).
- Slots = PhoneNav slots: 56 wide, 28px icons, rest `--kol-oq-64`, current `--kol-oq-96` + 44×44 `--kol-oq-08` circle.
- DROP: the old bar's `border-t`, full width, the × slot, the `Loop / 4s` number input (it opened the iPhone number pad).

## States & interactions
- Play / Pause: radio, the circle follows. Stop, Rewind: momentary.
- Loop slot: opens its sheet (slot lit while open); a row sets the length and closes it.
- Swipe sideways: fold to the right edge tab; tap restores.

## Dependencies
TabsRow pill internals (shared with PhoneNav), MoreRows, Icon. The loop slot uses `playback/stopwatch-solid`, placed in kol-icon-set 2026-10-27 (the outline `misc/stopwatch` stays for its own uses).

## Recreation notes
Best as one pill primitive that both PhoneNav and this compose (nav items vs action items), so the two stay identical in size and look.
