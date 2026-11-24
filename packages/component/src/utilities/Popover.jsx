import { cloneElement, createContext, forwardRef, isValidElement, useContext, useEffect, useLayoutEffect, useRef, useState, version as reactVersion } from 'react'
import { createPortal } from 'react-dom'
import { toneClass, TONE_VARS } from './tone.js'
import { floatMotion } from './motion.js'
import useFloatPresence from '../hooks/useFloatPresence.js'
import Button from '../atoms/Button.jsx'
import {
  useFloating,
  autoUpdate,
  offset as offsetMw,
  flip as flipMw,
  shift as shiftMw,
  size as sizeMw,
  hide as hideMw,
  FloatingPortal,
  FloatingFocusManager,
  useClick,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react'

/**
 * Popover — anchored floating-element primitive built on @floating-ui/react.
 * Two surfaces:
 *
 *   1. `usePopover({ open, onOpenChange, ... })` — full hook. Returns refs +
 *      `getReferenceProps` / `getFloatingProps` so the consumer wires the
 *      anchor and the floater explicitly. Use when the trigger is non-trivial
 *      (custom component, span wrapper, anchor on something other than a
 *      button).
 *
 *      const popover = usePopover({ open, onOpenChange })
 *      <button ref={popover.refs.setReference} {...popover.getReferenceProps()} />
 *      <PopoverPanel popover={popover}>...</PopoverPanel>
 *
 *   2. `<PopoverPanel popover={...}>` — renders the floater into a
 *      `FloatingPortal` (escapes overflow:hidden ancestors), wraps in
 *      `FloatingFocusManager` (focus trap + return-focus), applies the
 *      `.kol-popover` panel chrome.
 *
 * Position middleware: `offset` (gap), `flip` (auto-flip on overflow),
 * `shift` (slide along the cross-axis to stay in viewport), optional
 * `size` (clamp to available width/height). `autoUpdate` keeps everything
 * synced on scroll / resize / layout shift.
 *
 * Interaction defaults: click toggles, outside-click + Esc dismiss, role
 * defaults to `dialog` (use `role: 'menu' | 'listbox' | 'tooltip'` for
 * other shapes — also drives the right ARIA attrs on the reference).
 */
export function usePopover({
  open,
  onOpenChange,
  placement = 'bottom-start',
  offset = 6,
  flip = true,
  flipPadding = 8,
  shiftPadding = 8,
  matchReferenceWidth = false,
  click = true,
  hover = false,
  hoverDelay = { open: 400, close: 100 },
  focus = false,
  dismiss = true,
  role = 'dialog',
  referenceElement = null,
} = {}) {
  const middleware = [offsetMw(offset)]
  if (flip) middleware.push(flipMw({ padding: flipPadding }))
  middleware.push(shiftMw({ padding: shiftPadding }))
  if (matchReferenceWidth) {
    middleware.push(
      sizeMw({
        padding: 8,
        apply({ rects, elements, availableHeight }) {
          /* FLOOR again, not exact (2026-08-09 evening, user: "if you have
           * to truncate 'centered' then its too narrow" — overrides the
           * morning's exact-width reading of the one-piece ruling for the
           * narrow case). The panel is never NARROWER than the trigger, and
           * grows when its rows carry chrome the trigger doesn't (the
           * selected row's check). Sole consumer is Dropdown. */
          /* EXACT width — the one-piece fusion restored (2026-08-09 night).
           * The truncation that briefly justified a floor is solved at the
           * TRIGGER instead: the ghost stack reserves the panel row's check
           * column (.kol-dd-ghost slack), so the one shared width fits every
           * row. Letting the panel size itself was the broken middle: an
           * abs-positioned float with auto width sizes against available
           * space, not content. Sole consumer is Dropdown. */
          /* VIEWPORT CLAMP (2026-08-09, kol-ds-fxr lobby ticket): flip is
           * off on Dropdown (fused edge), so a long list (the labs 30-item
           * "Add FX…" picker) otherwise renders past the viewport bottom.
           * Cap the panel to the space below the trigger; .kol-dd-list
           * scrolls inside (panel is a flex column in kol-theme). */
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.max(0, Math.floor(availableHeight))}px`,
          })
        },
      })
    )
  }

  /* `elements.reference` lets the consumer anchor the popover to an
   * external DOM node (e.g. a parent container ref) instead of wiring
   * `setReference` onto the trigger. Used by TypeBlockToolbar to anchor
   * to its TypeFrame parent. */
  middleware.push(hideMw({ strategy: 'referenceHidden' })) // last — it reads the final position
  const data = useFloating({
    open,
    onOpenChange,
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
    elements: referenceElement ? { reference: referenceElement } : undefined,
  })

  /* A PANEL FOLLOWS ITS TRIGGER OUT OF SIGHT (2026-09-30 — docs/menus: an open menu painted over
   * the sticky header when its trigger scrolled under it, and floated at the page's foot when it
   * scrolled away). The panel is portalled to <body>, so no scroll container can clip it; `hide`
   * reports when the trigger is clipped, and the panel hides with it. */
  const hidden = data.middlewareData.hide?.referenceHidden
  const floatingStyles = hidden ? { ...data.floatingStyles, visibility: 'hidden' } : data.floatingStyles

  const interactions = useInteractions([
    useClick(data.context, { enabled: click }),
    /* `mouseOnly` — a hover is a mouse's (2026-10-05, found on labs' phone sheet). Touch has none:
     * a tap read as a hover that never ends, so a tooltip opened on the tap and stayed over the
     * next control. Only Tooltip opens on hover, and the keyboard still reaches it through `focus`. */
    useHover(data.context, { enabled: hover, delay: hoverDelay, move: false, mouseOnly: true }),
    useFocus(data.context, { enabled: focus }),
    /* `dismiss` may be an object of floating-ui's own options — `{ outsidePress: false }` keeps Esc
     * and drops the outside click (Dropdown `stayOpen`) */
    useDismiss(data.context, typeof dismiss === 'object' && dismiss ? { enabled: true, ...dismiss } : { enabled: dismiss }),
    useRole(data.context, { role }),
  ])

  return { ...data, floatingStyles, ...interactions, open }
}


/* ── the kolbox variant's layer (plan-2026-11-18-kolbox-system W31.2 batch 4, 2026-11-18) ──
 * kolbox's OverlayLayer carried line for line: the layer `Menu`, `PopoverPanel` and `ModalDialog` draw their kolbox look
 * in. Not floating-ui: its placements (`over`, a Dropdown's list lying over its field, 28.5; `beside`, a child menu
 * beside its parent panel) and its press-outside (on the window in the capture phase, 28.4) are kolbox's behavior and
 * belong to its variant only; KOL's default and float keep usePopover.
 *
 * A portal to document.body (never inside a rail), fixed at its anchor (an element, a ref, or anything with
 * getBoundingClientRect), closing on a press outside it and its anchor, and on Escape. placement: bottom-start (a menu
 * dropped from its trigger), left-start / right-start (a panel beside the rail), beside, over, or center (a Modal: the
 * layer is the dim, and a click on the dim closes it, on click so focus can go back to the trigger after the press;
 * `blocking={false}`: no dim, the layer lets every press and wheel through to what is under it, and only the window
 * itself takes them).
 * Unplaced, the layer is transparent, not hidden, so a Menu can take focus on its first frame. Nested layers: a layer
 * opened later (a Dropdown's Menu inside a Popover or Modal) sits after it in the body, so a press inside it is not
 * outside this one, and Escape closes only the last layer. Exported for a kolbox part that draws its own panel in it (the
 * search window, until it moves). */
const anchorEl = (anchor) => (anchor && 'current' in anchor ? anchor.current : anchor)
const later = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
/* spend a press: stop it here, and swallow the mouse events and the click it raises until the press ends. Several
   layers may close on one press; the first spends it, the rest find it stopped and do nothing more. */
function spend(e) {
  if (e.cancelBubble) return
  e.stopPropagation(); e.preventDefault()
  const stop = (ev) => { ev.stopPropagation(); ev.preventDefault() }
  const kinds = ['mousedown', 'mousemove', 'mouseup', 'click', 'pointermove', 'pointerup']
  kinds.forEach((k) => window.addEventListener(k, stop, true))
  const end = () => setTimeout(() => kinds.forEach((k) => window.removeEventListener(k, stop, true)))
  window.addEventListener('pointerup', end, { capture: true, once: true })
  window.addEventListener('pointercancel', end, { capture: true, once: true })
}
export function PopoverLayer({ anchor, open, onClose, placement = 'bottom-start', kind, blocking = true, children }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    if (!open) return setPos(null)
    if (placement === 'center') return setPos({})
    const place = () => {
      const a = anchorEl(anchor), box = ref.current
      if (!a || !box) return
      const r = a.getBoundingClientRect(), w = box.offsetWidth
      /* a panel beside its anchor keeps its top on the anchor: one too tall for the room under it shrinks, and its body
         scrolls, rather than moving up (160 at least, then it moves up as far as it must) */
      const panel = (placement === 'left-start' || placement === 'right-start') ? box.firstElementChild : null
      if (panel) panel.style.maxHeight = ''
      let h = box.offsetHeight
      const vw = window.innerWidth, vh = window.innerHeight
      if (panel && r.top + h > vh - 8) {
        const top = Math.max(8, Math.min(r.top, vh - 8 - 160))
        h = Math.min(h, vh - 8 - top)
        panel.style.maxHeight = `${h}px`
      }
      let x, y
      if (placement === 'bottom-start') { x = r.left; y = r.bottom + 4; if (y + h > vh - 8) y = r.top - h - 4 }
      else if (placement === 'left-start') { x = r.left - w - 8; y = r.top; if (x < 8) x = r.right + 8 }
      /* a child menu: the anchor is the parent PANEL; the child stands 4 off its right edge (its left when the window
         ends), its top level with the parent's top, moved up only as far as it must to fit */
      else if (placement === 'beside') { x = r.right + 4; y = r.top; if (x + w > vw - 8) x = r.left - w - 4 }
      /* over (28.5): the list opens OVER its field, its left edge on the field's, the chosen row (`data-chosen`) lying on
         the field. A list that fits the window moves only as far as it must at an edge. A list taller than the window
         starts where its rows would start, runs to the window's foot (160 at least) and scrolls its rows so the chosen
         one still lies on the field */
      else if (placement === 'over') {
        const row = box.querySelector('[data-chosen]'), list = box.querySelector('[data-kolbox-menu]')
        x = r.left; y = r.top
        /* past the right edge the menu flips to the field's right edge; the window margin is 4 */
        if (x + w > vw - 4) x = r.right - w
        if (row && list) {
          list.style.maxHeight = ''; list.scrollTop = 0
          const rr = row.getBoundingClientRect(), lt = list.getBoundingClientRect().top
          y = r.top + r.height / 2 - (rr.top - lt + rr.height / 2)
          if (list.scrollHeight > vh - 8) {
            const top = Math.max(4, Math.min(y, vh - 4 - 160))
            h = vh - 4 - top
            list.style.maxHeight = `${h}px`
            list.scrollTop = top - y
            y = top
          }
        }
      }
      else { x = r.right + 8; y = r.top; if (x + w > vw - 8) x = r.left - w - 8 }
      const m = placement === 'over' ? 4 : 8
      setPos({ x: Math.max(m, Math.min(x, vw - w - m)), y: Math.max(m, Math.min(y, vh - h - m)) })
    }
    place()
    /* a scroll inside the overlay (a long list) never moves it */
    const scrolled = (e) => { if (!ref.current?.contains(e.target)) place() }
    window.addEventListener('resize', place)
    window.addEventListener('scroll', scrolled, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', scrolled, true) }
  }, [open, anchor, placement])

  /* A press outside closes (28.4). On the window in the capture phase: an editor's canvas may stop its own presses, so
     a listener on the document never hears them. A press on the canvas (`[data-canvas]`) that closes an overlay is
     spent on closing: it goes no further and the mouse events and click it would raise are swallowed, so the canvas
     neither deselects nor starts a drag. */
  useEffect(() => {
    if (!open) return
    const down = (e) => {
      const me = ref.current, hit = e.target.closest?.('[data-kolbox-overlay]')
      if (!me || placement === 'center' || (hit && hit !== me && later(me, hit))) return
      if (me.contains(e.target) || anchorEl(anchor)?.contains?.(e.target)) return
      /* a window beside the rail (kind "popover") holds through a press on the canvas; it closes by its close, Escape or
         its caller's toggle. A press on a layer goes on to the canvas (it selects, and a window on the old selection
         goes with it); a press on the empty canvas is spent, so it does not drop the selection the window edits */
      if (kind === 'popover' && e.target.closest?.('[data-canvas]')) {
        if (!e.target.closest('[data-layer-id]')) spend(e)
        return
      }
      onClose?.()
      if (e.target.closest?.('[data-canvas]')) spend(e)
    }
    const key = (e) => {
      const all = document.querySelectorAll('[data-kolbox-overlay]')
      if (e.key === 'Escape' && all[all.length - 1] === ref.current) onClose?.()
    }
    window.addEventListener('pointerdown', down, true)
    document.addEventListener('keydown', key)
    return () => { window.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key) }
  }, [open, anchor, onClose, placement, kind])

  if (!open) return null
  return createPortal(
    <div
      ref={ref}
      data-kolbox-overlay={kind}
      className={placement !== 'center' ? 'fixed z-50' : blocking ? 'kol-popover-layer--kolbox-dim fixed inset-0 z-50 flex items-center justify-center' : 'pointer-events-none fixed inset-0 z-50 flex items-center justify-center [&>*]:pointer-events-auto'}
      onClick={placement === 'center' && blocking ? (e) => e.target === e.currentTarget && onClose?.() : undefined}
      style={placement === 'center' ? undefined : { left: pos?.x ?? 0, top: pos?.y ?? 0, opacity: pos ? 1 : 0 }}
    >
      {children}
    </div>,
    document.body,
  )
}

/* Tooltip `variant="kolbox"` (W31.2 batch 4): kolbox's Tooltip carried line for line, CSS-placed, no floating-ui. It
 * wraps its trigger; the tip shows above it on hover or keyboard focus, on the one floating surface. Centred on the
 * trigger, then shifted back inside the window (8 from its edge) when a trigger near the edge would push it past; below
 * the trigger when there is no room above it. Inside a rail (`[data-rail]`) the tip stands level with its trigger, at
 * its left, so it never sits over a section's divider line above the trigger's row; a tip too long to stand there
 * wraps to the rail's width. Takes `label`, `children` and `asChild` (no wrapper: the tip hangs on the one child element);
 * renders its wrapper even with no label, as kolbox's did. */
/* ON THE LAYER ABOVE (plan-2026-11-18-kolbox-system W23.2, 2026-11-18): the tip was placed in CSS inside its trigger's
 * wrapper, so any ancestor with overflow hidden (every kolbox window and popover shell) cut it; "a popup … clipped by
 * modal container". It is now portalled to <body>, fixed, and placed from the trigger's box, as the kolbox menus and
 * dropdowns are (PopoverLayer); same plate, same places. Shown on hover or keyboard focus; no label, no plate. */
const TIP_EDGE = 8
const TIP_GAP = 4
/* true inside a kolbox tooltip's trigger: an icon-only kolbox Button there leaves the tip to it (Button.jsx) */
export const InTooltipKolbox = (globalThis[Symbol.for('@kolkrabbi/kol-component/InTooltipKolbox')] ??= createContext(false))
function TooltipKolbox({ label, asChild = false, children }) {
  const wrap = useRef(null)
  const tip = useRef(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const show = label != null && label !== '' && open

  useLayoutEffect(() => {
    if (!show) return setPos(null)
    const t = tip.current, w0 = wrap.current
    if (!t || !w0) return
    const r = w0.getBoundingClientRect()
    const railEl = w0.closest('[data-rail]')
    const rail = railEl?.getBoundingClientRect()
    const vw = window.innerWidth, vh = window.innerHeight
    t.style.maxWidth = ''; t.style.whiteSpace = ''; t.style.height = ''
    let w = t.offsetWidth, h = t.offsetHeight
    let x, y, wrapped = null
    /* inside a rail the tip stands level with its trigger, at its left, so it never sits over a section's divider */
    if (rail && r.left - TIP_GAP - w >= rail.left + TIP_EDGE) { x = r.left - TIP_GAP - w; y = r.top + r.height / 2 - h / 2 }
    else {
      /* a tip too long for the rail wraps to the rail's width */
      if (rail && w > rail.width - 2 * TIP_EDGE) {
        wrapped = rail.width - 2 * TIP_EDGE
        Object.assign(t.style, { maxWidth: `${wrapped}px`, whiteSpace: 'normal', height: 'auto' })
        w = t.offsetWidth; h = t.offsetHeight
      }
      const lo = (rail ? rail.left : 0) + TIP_EDGE, hi = (rail ? rail.right : vw) - TIP_EDGE - w
      x = Math.max(lo, Math.min(r.left + r.width / 2 - w / 2, hi))
      y = r.top - TIP_GAP - h
      /* no room above: below the trigger */
      if (y < TIP_EDGE) y = r.bottom + TIP_GAP
    }
    x = Math.max(TIP_EDGE, Math.min(x, vw - TIP_EDGE - w))
    y = Math.max(TIP_EDGE, Math.min(y, vh - TIP_EDGE - h))
    setPos({ x, y, wrapped })
  }, [show, label])

  const tipNode = show && typeof document !== 'undefined' && createPortal(
    <span
      ref={tip}
      role="tooltip"
      className="kol-tooltip--kolbox kol-kolbox-surface pointer-events-none fixed z-[60] flex h-7 items-center px-2 whitespace-nowrap transition-opacity"
      style={{ left: pos?.x ?? 0, top: pos?.y ?? 0, opacity: pos ? 1 : 0, ...(pos?.wrapped ? { maxWidth: pos.wrapped, whiteSpace: 'normal', height: 'auto', paddingTop: 'var(--kol-spacing-1)', paddingBottom: 'var(--kol-spacing-1)' } : null) }}
    >
      {label}
    </span>,
    document.body,
  )
  const on = {
    onPointerEnter: (e) => e.pointerType !== 'touch' && setOpen(true),
    onPointerLeave: () => setOpen(false),
    onFocus: (e) => e.target.matches?.(':focus-visible') && setOpen(true),
    onBlur: () => setOpen(false),
  }
  /* `asChild`: the tip hangs on its one child element itself, no wrapper in the layout (an icon-only kolbox Button,
     whose parent's rules address it as a direct child); the child's own handlers run first */
  if (asChild && isValidElement(children)) {
    const own = children.props
    const chain = (k) => (e) => { own[k]?.(e); on[k](e) }
    /* the child's own ref is kept beside the tip's */
    const theirs = childRefOf(children)
    const ref = (node) => { wrap.current = node; if (typeof theirs === 'function') theirs(node); else if (theirs) theirs.current = node }
    return (
      <>
        {cloneElement(children, { ref, onPointerEnter: chain('onPointerEnter'), onPointerLeave: chain('onPointerLeave'), onFocus: chain('onFocus'), onBlur: chain('onBlur') })}
        {tipNode}
      </>
    )
  }
  return (
    /* a trigger that fills its row (w-full) makes the wrapper fill it too, so wrapping a control never narrows it */
    <span ref={wrap} data-kol-tooltip="" className="relative inline-flex has-[>.w-full]:flex has-[>.w-full]:w-full" {...on}>
      <InTooltipKolbox.Provider value>{children}</InTooltipKolbox.Provider>
      {tipNode}
    </span>
  )
}

/* Tooltip `variant="folio"` (Folio migration batch A, 2026-11-22): Folio's Tooltip carried class for class (apps/folio
 * EditorChrome.jsx): a hairline box at radius 4 padded 4 by 8, 6 over its trigger, the text 11 / 15; shown on hover or
 * focus inside its wrapper, placed in CSS, no portal (so it keeps the frame's `data-folio-*`; an overflow-hidden parent
 * clips it, as Folio's did). Chrome in kol-theme `.kol-tooltip--folio`. */
function TooltipFolio({ label, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span role="tooltip" className="kol-tooltip--folio pointer-events-none invisible absolute bottom-[calc(100%+6px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[4px] border px-[8px] py-[4px] group-focus-within:visible group-hover:visible">{label}</span>
    </span>
  )
}

/**
 * Tooltip — hover-triggered popover with text content. Wraps any trigger
 * element. Built on `usePopover` with `hover: true`, `click: false`,
 * `role: 'tooltip'`. Includes keyboard focus trigger so tab-focused
 * controls also reveal the tooltip.
 *
 *   <Tooltip label="Pattern" shortcut="P" placement="bottom">
 *     <Button iconOnly="ptrn-checker" ... />
 *   </Tooltip>
 */
/* A tooltip inside a tooltip's trigger (a disabled switch's reason inside its
 * row's hint) hides the outer one while it is open, and hands it back on leave
 * — the innermost wins, as the native `title` it replaced behaved. */
const TooltipNest = (globalThis[Symbol.for('@kolkrabbi/kol-component/TooltipNest')] ??= createContext(null))

/* `asChild` (the native-title sweep, 2026-09-26): the tooltip attaches to its one child element
 * instead of wrapping it in a span — for a trigger whose box IS the layout (a grid cell, a rail row,
 * an absolutely placed handle), where an inline-flex wrapper would move it. The child must be an
 * element that takes a ref: an intrinsic tag always does; a component only if it forwards one
 * (React 18 needs forwardRef), so Button / IconFrame keep the wrapper. Its own ref and handlers are
 * kept — the reference props merge over the child's. */
/* `disabled` (HardwareNativeTitle, kol-monitor 2026-10-15): the tooltip stays mounted but never
 * opens — a jack mid-patch. Dropping the label instead would swap the tree and remount the trigger
 * under the pointer. */
const childRefOf = (el) => ('ref' in (el.props ?? {}) ? el.props.ref : reactVersion.startsWith('18') ? el.ref : undefined)

export function Tooltip(props) {
  if (props.variant === 'kolbox') return <TooltipKolbox label={props.label} asChild={props.asChild}>{props.children}</TooltipKolbox>
  if (props.variant === 'folio') return <TooltipFolio label={props.label}>{props.children}</TooltipFolio>
  /* no label → no tooltip: several call sites pass an optional hint, and an empty panel is worse
   * than none. A separate component so the hooks below never run conditionally. */
  if (props.label == null || props.label === '') return props.children
  return <TooltipOn {...props} />
}

function TooltipOn({
  label,
  shortcut,
  placement = 'bottom',
  offset = 6,
  children,
  triggerClassName = 'inline-flex',
  asChild = false,
  disabled = false,
  /* `float` (W16, round 3 — 2026-10-31): the floating style's tooltip, an inverted pill 24 (28 on touch) tall, 11 (12) type */
  variant,
}) {
  const [open, setOpen] = useState(false)
  const [covered, setCovered] = useState(false)
  const parent = useContext(TooltipNest)
  const popover = usePopover({
    open: open && !covered && !disabled,
    onOpenChange: (v) => { setOpen(v); parent?.(v) },
    placement,
    offset,
    role: 'tooltip',
    click: false,
    hover: true,
    focus: true,
  })

  /* THE TONE OF WHERE IT IS (user, 2026-09-26: "tooltip should probably use same tone as dropdowns
   * and buttons"). The panel is portalled to body, outside the `kol-tone-*` wrapper that tones the
   * controls around the trigger — Dropdown's problem, solved the same way: on open, copy the
   * trigger's RESOLVED `--kol-tone-*` onto the panel. No tone in effect = nothing copied, and the
   * tooltip keeps its own surface. */
  const [ambient, setAmbient] = useState(null)
  const shown = open && !covered && !disabled
  useLayoutEffect(() => {
    const ref = popover.refs.reference.current
    /* the SURROUNDINGS' tone, not the trigger's own: an `asChild` trigger can be a variant button
     * (`kol-btn-ghost` carries its own `--kol-tone-*`), so read its parent; the wrapper span has no
     * variant and inherits the ambient values as it is */
    const el = asChild ? ref?.parentElement : ref
    if (!shown || !(el instanceof Element)) return
    const cs = getComputedStyle(el)
    const vars = {}
    for (const v of TONE_VARS) { const val = cs.getPropertyValue(v).trim(); if (val) vars[v] = val }
    setAmbient(vars)
  }, [shown]) // eslint-disable-line react-hooks/exhaustive-deps

  const child = asChild && isValidElement(children) ? children : null
  const childRef = child ? childRefOf(child) : undefined
  const setRef = (node) => {
    popover.refs.setReference(node)
    if (typeof childRef === 'function') childRef(node)
    else if (childRef) childRef.current = node
  }
  return (
    <>
      {child ? (
        <TooltipNest.Provider value={setCovered}>
          {cloneElement(child, { ...popover.getReferenceProps(child.props), ref: setRef })}
        </TooltipNest.Provider>
      ) : (
        <span
          ref={popover.refs.setReference}
          {...popover.getReferenceProps()}
          className={triggerClassName}
        >
          <TooltipNest.Provider value={setCovered}>{children}</TooltipNest.Provider>
        </span>
      )}
      <PopoverPanel
        popover={popover}
        focus={false}
        panel={false}
        className={variant === 'float' ? 'kol-tooltip kol-tooltip-float' : 'kol-tooltip'}
        style={ambient ?? undefined}
      >
        <span>{label}</span>
        {shortcut && <span className="kol-tooltip-key">{shortcut}</span>}
      </PopoverPanel>
    </>
  )
}

/**
 * PopoverPanel — A floating panel in a portal. renders the floater into a portal with default panel chrome.
 *
 * Props:
 *   popover         — the value returned from `usePopover`
 *   panel           — apply default `.kol-popover` chrome (default: true)
 *   modal           — focus modality (default: false — non-modal popover)
 *   focus           — wrap in FloatingFocusManager (default: true)
 *   className       — extra classes on the panel
 *   style           — extra inline styles merged with floatingStyles
 *   motion          — the float card's enter and leave (FloatActionStatesAndMotion, 2026-11-04): unset, the panel
 *                     mounts and unmounts as it always has; `true` · `{ duration, ease }` fades it in and out from its
 *                     trigger's side (`.kol-float-motion`, `--kol-float-*`), held in the tree while it leaves; `false`
 *                     the same card with no motion
 */
/* how many floats this one is opened from inside — context crosses portals, the DOM order does not */
const FloatDepth = (globalThis[Symbol.for('@kolkrabbi/kol-component/FloatDepth')] ??= createContext(0))


/* The kolbox panel shell (W31.2 batch 4): kolbox's PopoverShell carried line for line, the panel every kolbox popover
 * and window draws: radius 16, the secondary surface on the one floating surface (`.kol-kolbox-surface`), 240 wide
 * (`--kol-kolbox-popover-w`) unless `width` says otherwise. Header: a `leading` slot (tabs, or an icon and name), the
 * `title`, the `actions`, close (only with `onClose`: a dialog with none cannot be dismissed). The body is the
 * children; `footer`, when given, is a row of buttons under it. Drawn by `PopoverPanel variant="kolbox"` beside its
 * anchor, by `ModalDialog variant="kolbox"` centred, and on its own as `ModalShell variant="kolbox"`. Other props
 * (aria-modal, data-*) and the ref go on the dialog. Not exported from the package. */
export const KolboxShell = forwardRef(function KolboxShell({ onClose, title, leading, actions, footer, width, className = '', children, ...rest }, ref) {
  return (
    <section
      ref={ref}
      role="dialog"
      aria-label={typeof title === 'string' ? title : undefined}
      data-kolbox-popover=""
      className={`kol-modal--kolbox kol-kolbox-surface flex flex-col overflow-hidden ${className}`}
      style={width ? { width } : undefined}
      {...rest}
    >
      <header className="flex shrink-0 items-center gap-1 py-2 pr-2 pl-4">
        {leading}
        {title && <h2 className="kol-modal-title--kolbox min-w-0 flex-1 truncate">{title}</h2>}
        {!title && <span className="flex-1" />}
        {actions}
        {onClose && <Button variant="kolbox" iconOnly="x" aria-label="Close" onClick={onClose} />}
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      {footer && <footer className="flex shrink-0 items-center justify-end gap-2 px-4 pb-4">{footer}</footer>}
    </section>
  )
})

/* `variant="kolbox"` (W31.2 batch 4): kolbox's Popover carried line for line, `ModalShell variant="kolbox"` (its shell)
 * in `PopoverLayer`, beside its anchor: `anchor`, `open`, `onClose`, `placement` (left-start by default, beside the right
 * rail), and the shell's `title`, `leading`, `actions`, `footer`, `width`, `aria-label`, `className`, `children`. */
function PopoverKolbox({ anchor, open, onClose, placement = 'left-start', variant, ...shell }) {
  return (
    <PopoverLayer anchor={anchor} open={open} onClose={onClose} placement={placement} kind="popover">
      <KolboxShell onClose={onClose} {...shell} />
    </PopoverLayer>
  )
}

export function PopoverPanel(props) {
  if (props.variant === 'kolbox') return <PopoverKolbox {...props} />
  return <PopoverPanelOn {...props} />
}

function PopoverPanelOn({
  popover,
  children,
  panel = true,
  modal = false,
  focus = true,
  /* THE FLOATING SURFACE'S GROUND (editor-chrome-review, kol-fxr 2026-09-03 —
   * the user on the Editor / Labs / Randomiser list: *"can we change it border
   * oq-04 and background as tone prop?"*). The panel painted
   * `surface-secondary` unconditionally, which in dark is LIGHTER than the bar
   * it drops from, so the layering read inverted. Unset it still does exactly
   * that, so nothing existing moves; a tone paints that tone's ground instead,
   * through the same `toneClass` every other control uses. */
  tone,
  motion,
  className = '',
  style: extraStyle,
}) {
  const depth = useContext(FloatDepth)
  const fm = motion == null ? null : floatMotion(motion)
  const presence = useFloatPresence(popover.open, fm?.ms ?? 0)
  if (!(fm ? presence.mounted : popover.open)) return null

  const { refs, floatingStyles, context, getFloatingProps } = popover
  /* kol-popover-float rides every floating node (panel chrome or not): it
   * carries the stacking guarantee — floats must top overlay chrome
   * (.kol-overlay z-100), or a dropdown inside a FullscreenOverlay renders
   * under the sheet and its options can't be clicked. */
  const cls = ['kol-popover-float', panel && 'kol-popover', tone && toneClass(tone), fm && 'kol-float-motion', className].filter(Boolean).join(' ')

  /* `data-editor-keep-selection` mirrors the marker on the EditorShell
   * root. Popovers render via FloatingPortal (mounted on <body>, outside
   * the shell), so the editor's document-level click-away handler would
   * otherwise treat clicks on popover content as "outside the editor"
   * and deselect. Tagging the panel here keeps that handler happy for
   * every popover — color picker, dropdowns, menus, tooltips. Harmless
   * for non-editor consumers since they ignore the attr. */
  const node = (
    <div
      ref={refs.setFloating}
      style={{ ...floatingStyles, ...(depth ? { '--kol-float-depth': depth } : null), ...fm?.style, ...extraStyle }}
      className={cls}
      data-editor-keep-selection
      data-side={fm ? popover.placement?.split('-')[0] : undefined}
      data-exit={fm && presence.exiting ? '' : undefined}
      {...getFloatingProps()}
    >
      <FloatDepth.Provider value={depth + 1}>{children}</FloatDepth.Provider>
    </div>
  )

  return (
    <FloatingPortal>
      {focus
        ? <FloatingFocusManager context={context} modal={modal}>{node}</FloatingFocusManager>
        : node}
    </FloatingPortal>
  )
}

export default PopoverPanel
