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
 */
export function MenuPopover(props) {
  return <MenuTrigger {...props} />
}

/**
 * MenuItem — action row inside a MenuPopover. Renders as a button so it
 * picks up disabled state, focus, and keyboard activation. The popover
 * closes automatically when an item is clicked (via the wrapper's
 * delegate click — the data-menu-item attr marks rows for that match).
 */
export function MenuItem({ onClick, disabled, shortcut, iconLeft, children }) {
  return (
    <button
      type="button"
      data-menu-item
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
      className="w-full kol-helper-12 px-3 h-8 inline-flex items-center gap-2 text-meta hover:text-emphasis hover:bg-fg-08 disabled:opacity-40 disabled:cursor-not-allowed text-left"
    >
      {iconLeft && <span className="shrink-0 w-4 inline-flex items-center justify-center text-meta">{iconLeft}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && <span className="kol-helper-10 text-subtle shrink-0">{shortcut}</span>}
    </button>
  )
}

export function MenuDivider() {
  return <div className="border-t border-fg-08 my-1" />
}
