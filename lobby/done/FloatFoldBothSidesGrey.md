---
component: TabsRow fold (stacked pill) · AppFloatNav · AppShell touch="floats"
source: kol-fxr — Labs on a phone; kol-component TabsRow.jsx (StackedTabs fold), kol-shell AppFloatNav.jsx#L260 + #L342
staged: 2026-11-03
status: draft
deps: [TabsRow, AppFloatNav, AppShell]
---

# FloatFoldBothSidesGrey

## Purpose
The user, 2026-11-03, on Labs' floats: *"when you slide the floating navs to the sides … you can only slide to one side, they should be open to both left and right. and … its the wrong color … the reference was grey"*. The reference is the iOS edge handle (kol-fxr plan 41 § 4.1).

Today a foldable pill folds to one fixed edge (`foldSide`, hard-coded `left` for AppFloatNav's nav and `right` for its transport). The swipe's direction is never read. The edge tab wears `--kol-surface-secondary`, the pill's own ground, not the grey handle.

Both changes are **opt-in**. Unset, every app keeps today's behaviour.

## Props
| prop | where | type | default | does |
|------|-------|------|---------|------|
| `foldSide` | TabsRow | `'left' \| 'right' \| 'swipe'` | `'left'` | `'swipe'`: the tab goes to the edge the swipe went toward |
| `foldTone` | TabsRow | `'ground' \| 'handle'` | `'ground'` | `'handle'`: the edge tab is the grey handle (the iOS edge handle's grey, from KOL's tokens), chevron pointing back in |
| `foldSide` · `foldTone` | AppFloatNav (both FloatNav and Transport) | as above | the variant's current side · `'ground'` | forwarded to TabsRow, overriding the hard-coded side |
| `floats.fold` | AppShell `touch="floats"` | `{ side, tone }` | unset | applied to the top float and the transport. The app cannot reach the top float otherwise, because AppHub owns `phoneNav` |

## Acceptance
- At 390×844 with `floats.fold = { side: 'swipe', tone: 'handle' }`: swiping the top float left folds it to a left tab and swiping right folds it to a right tab. The transport does the same. A tap on the tab restores the float.
- The tab is the grey handle in both themes.
- Unset: identical to today on studio-hub's Phone nav › Floats.

## ✅ RESOLUTION — 2026-11-03

Shipped in **@kolkrabbi/kol-component 0.333.0** and **@kolkrabbi/kol-shell 0.100.0**. TabsRow (StackedTabs): `foldSide="swipe"` folds to the edge the swipe went toward (it reads the swipe's direction); `foldTone="handle"` makes the edge tab the grey handle, `--kol-oq-24` with an `--kol-oq-96` chevron, on any `surface`. AppFloatNav forwards `foldSide` · `foldTone` on the nav (default left) and the transport (default right). AppShell `floats.fold = { side, tone }` sets both floats. Unset, nothing changes. kol-shell peers on kol-component ≥0.333.0. Checked on studio-hub (Phone nav › Floats, /chrome/labs) at 390×844, light and dark: unset folds the nav left and the transport right on the pill's ground (242 light, 25 dark), whichever way the swipe goes; with `{ side: 'swipe', tone: 'handle' }` a left swipe puts the tab at x=0 and a right swipe at x=362, for both floats, on the grey (≈194 light, ≈74 dark); a tap restores the float.
