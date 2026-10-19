# ActionButton's tooltip anchors to its wrapper, not the button: anchor it to the button

**Staged:** 2026-10-19 · from a kol-atlas session
**Change:** one file, `ActionButton.jsx` line 194

---

## The problem, in one case

kol-atlas renders KOL `CodeBlock`. Hovering its copy button shows "Copy to clipboard" about 950px left of and 300px below the button, near the block's bottom-left corner. Measured at 1280 wide: button at top 429, left 1069; tooltip at top 744, left 118. The theme toggle's tooltip, on the same page, sits 7px under its button.

Cause: `ActionButton` returns `<Tooltip label={aria}>{control}</Tooltip>` without `asChild`, so `Tooltip` wraps the button in an inline-flex span and anchors to the span. `CodeBlock` gives the button `kol-frame-control` (`position: absolute; top/right: spacing-3`), which moves the button to the corner while the empty span stays in normal flow at the bottom-left. Every `ActionButton` carrying `kol-frame-control` or any absolute positioning has the same fault.

![[ActionButtonTooltipAnchor_20261019.png]]

## The fix

`ActionButton.jsx:194`: `<Tooltip label={aria} asChild>{control}</Tooltip>`, so the tooltip's reference is the button itself.

## Rejected alternative

Positioning the wrapper span instead of the button: the class is passed through `className` to the control, and moving it to a wrapper changes every `ActionButton` call site.

## Definition of done

- [ ] Hovering CodeBlock's copy button shows the tooltip next to the button
- [ ] A non-positioned `ActionButton` still shows its tooltip where it did

## Resolution — 2026-10-19 · 🟢 closed · kol-component@0.280.0

`ActionButton` returns `<Tooltip label={aria} asChild>`, so the tooltip's reference is the `<button>`/`<a>` itself, not a wrapper span. Verified in `apps/markdown` (Structure tab, CodeBlock copy button): button bottom 505, tooltip top 511 — 6px under it, and the button's parent is `.kol-codeblock` (no span).
