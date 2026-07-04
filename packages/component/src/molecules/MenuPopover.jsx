import { MenuItem as MenuTrigger } from './MenuItem.jsx'

/**
 * MenuPopover — DEPRECATED alias of MenuItem (2026-07-02 menu-family
 * unification).
 *
 * The two triggers had an identical API (label, children incl. ({ close })
 * render-prop, align, panelClassName, panelStyle, buttonClassName,
 * defaultOpen) and did the same job — MenuPopover with hand-rolled
 * fixed positioning, MenuItem on floating-ui (portal, auto-flip, focus
 * management). One implementation now: MenuItem. This alias keeps existing
 * call-sites working; migrate imports to MenuItem. Removal in the next major.
 *
 * Compose the rows with the exported `MenuDropdownItem` / `MenuDropdownDivider`
 * / `MenuDropdownNest` from MenuItem.jsx — this file no longer ships its own
 * duplicate row/divider components (they were dead: never barrel-exported).
 */
export function MenuPopover(props) {
  return <MenuTrigger {...props} />
}
