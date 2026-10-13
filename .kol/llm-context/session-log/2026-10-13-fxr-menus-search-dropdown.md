# Session: fxr's menu bar asks — flyout, block rows, keep-open rows, Dropdown name

**Date:** 2026-10-13
**Agent:** Claude (Grim)
**Summary:** kol-fxr's four 2026-10-13 tickets closed as kol-component 0.252.0. All four are additive, and every default renders as before.

## Changes Made
- `molecules/MenuItem.jsx`: `MenuDropdownNest flyout` (+ `scroll`, `disabled`, → / ← keys). It is fxr's `MenuFlyout` behaviour, with the panel a DOM child of the row. The accordion stays the default. `MenuDropdownItem` and the nest rows changed from `inline-flex` to `flex`.
- `molecules/Dropdown.jsx`: `ariaLabel`. The trigger's name is "label, value", so the value is still announced.
- `organisms/ShellSearchOverlay.jsx`: `action` and new `keepOpen` rows call `onSelect` without `onClose`. The overlay never runs `action` itself, because workshop already runs it in `onSelect`. The highlight resets when the row ids change.
- Showcase: MenuDropdownNest gets accordion/flyout variants, ShellSearchOverlay gets a drill-in variant, and the Dropdown preview takes `ariaLabel`. API rows were added to the three mdx files, and descriptions were re-extracted.
- CHANGELOG, shipped-packages, lobby (4 → done/, ledger + history), receipts in kol-fxr's outbox.

## Current State
- Verified on the showcase: three-deep flyout, the 60vh scroll, the leaf click closing the whole menu, the flip at 900 wide, block rows hugging their widest label (103px), Dropdown `aria-label="Sort, Newest first"`, the drill-in staying open with the highlight on row 0, and a plain row closing. 0 console errors. Shot: `_tmp/2026-10-13-fxr-menus/flyout.png`.
- Gates: syntax · props · dd-trigger · variants · preview-files · icon-ink · native-title · control-type · imports · frontmatter all clean. `validate:previews` fails only on `tag-mode-gate`, which this change doesn't touch.
- Inbox originals moved to `_tmp/2026-10-13-lobby-inbox-moved/` (the done/ copies carry them in full).

## Next Steps
1. Push
2. fxr bumps ^0.252.0: `MenuFlyout` → `MenuDropdownNest flyout`, StepPicker drill rows → `keepOpen`, `ariaLabel="Color view"`
