import { useEffect, useRef, useState } from 'react'
import { pushLayer, popLayer, isTopLayer } from '../utilities/layerStack.js'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import CloseButton from '../atoms/CloseButton.jsx'
import Divider from '../atoms/Divider.jsx'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import useMediaQuery from '../hooks/useMediaQuery.js'
import useGrabEdge from '../hooks/useGrabEdge.js'

/* taxonomy-ok: nests kol-icons's Icon (a package import the relative-import
 * check can't see). */

/* ONE SCROLL LOCK FOR EVERY OPEN RAIL (RailRoles, 2026-10-25): rails stack — the patch rail, the page rail, the settings
 * rail over both — and each restoring the overflow it saw on open left the body locked when they closed out of order
 * (A opens on '', B opens on 'hidden'; close A → '', close B → 'hidden', forever). A count: the first lock saves, the
 * last unlock restores. */
let locks = 0
let savedOverflow = ''
const lockScroll = () => { if (locks++ === 0) { savedOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden' } }
const unlockScroll = () => { if (--locks === 0) document.body.style.overflow = savedOverflow }

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Rail — A surface docked to an edge. A surface docked to an edge (RailOverlay, kol-monitor 2026-10-17 — user ruling: *"rail and overlay"*).
 * Anything docked to an edge — left, right, top or bottom — that collapses and expands is a rail; anything
 * floating over the page that closes is an overlay. Drawer, shelf, panel and sheet are retired as names
 * (`ShellDrawer` is this component's old name, an alias).
 *
 *   mode="over" (default) — the rail slides over the page on a scrim, with focus trap, Escape and scroll lock:
 *                           what ShellDrawer always was.
 *   mode="push"           — the rail sits in the layout and pushes it: inline, no scrim, no trap; `open`
 *                           expands it, closed it collapses to nothing. Its parent owns the flex row/column.
 *   resizable             — a grab line on the inner edge (the edge facing the page) drags the rail's size
 *                           between `minSize` and `maxSize`; on a bottom rail that is its TOP edge.
 *
 * Formerly — the edge drawer: a portalled panel that slides in from the
 * left, right or BOTTOM viewport edge over a dimming backdrop. Distinct from Modal
 * (centered prompt/confirm) and FullscreenOverlay (fills the whole viewport,
 * not an edge sheet). Escape, backdrop click and the built-in close button
 * all call `onClose`; body scroll locks while open; focus moves into the
 * panel on open, is trapped there, and returns to the opener on close.
 *
 * The slide transition is gated on prefers-reduced-motion: reduced users get
 * an instant mount/unmount with no transform animation.
 *
 * Presentational shell — the parent owns the open state and supplies the
 * header slot and body; no navigation or routing logic lives here.
 *
 * @param {'patch'|'page'|'settings'|'bottom'} role  THE JOB (RailRoles, 2026-10-25): the side, tier, scrim and key of one of
 *                                  the four rails every tool has (`RAIL_ROLES` above), and the phone rule under 768 — the patch
 *                                  rail turns bottom, a settings-shaped rail fills the screen. Explicit props win; `useRailKey`
 *                                  binds the key. Unset = the rail as before
 * @param {Object}        style     on the panel, last
 * @param {ReactNode}     nav       A RAIL INSIDE THE RAIL (review 2, 2026-10-25 — *"like a siderail in the bottom rail"*): `RailNav`, the
 *                                  collapsed nav rail's 48 icon column, stood at the panel's edge with the header, body and foot
 *                                  padded beside it — so a bottom rail over the nav rail carries its views as glyphs under it
 * @param {'app'|'site'}  variant   THE TIER (RailKit, kol-monitor 2026-10-24): its width when `width` / `height` is not given
 *                                  (`--kol-rail-w-app` 320 · `--kol-rail-w-site` 380) and its padding (`--kol-pad-rail-app` ·
 *                                  `--kol-pad-rail-site`), kol-theme's tokens — so the settings rail and a page rail of one
 *                                  app are one size. Unset = the rail as before (`--kol-pad-overlay`, the width yours)
 * @param {ReactNode}     footer    a FOOT pinned below the scrolling body (fxr's transport dock; `RailFoot` is its shape) —
 *                                  the body scrolls, the foot does not; the Rail draws it as a band with a full-width rule
 *                                  (2026-10-25), so nothing inside it draws a rule
 * @param {boolean}       open      drawer visible (drives slide in/out)
 * @param {Function}      onClose   close request (Esc / backdrop / close button)
 * @param {string}        side      'left' | 'right' | 'bottom' — edge the panel slides from.
 *                                  `bottom` (ShellDrawerBottomSide, kol-mirror 2026-09-01) is the
 *                                  phone's sheet: full viewport width, slides up from +100% on Y,
 *                                  takes `height` where the sides take `width`, and pads its foot by
 *                                  `env(safe-area-inset-bottom)` so the last row clears the home bar.
 *                                  ONE DETENT — open or closed. A collapsed bar that grows on tap is
 *                                  a second height the consumer owns (mirror's 56px → 68dvh); this
 *                                  sheet does not carry it, and says so rather than half-build it.
 * @param {number|string} width     panel width (px number or CSS length); omit for full-width sheet — sides only
 * @param {number|string} height    panel height (px number or CSS length); omit for a content-sized sheet — `bottom` only
 * @param {ReactNode}     header    header-row content beside the close button (replaces the source's baked-in wordmark)
 * @param {boolean}       backdrop  render the dimming scrim (default true); false = panel alone, no darken/blur, close via × / Esc
 * @param {'xs'|'sm'|'md'|'lg'} closeSize  the close control's rung (default 'sm' — match the controls in the panel)
 * @param {boolean}       closeHover  the close's hover wash (default true); `false` keeps its box, drops the wash (CloseButton `hover`)
 * @param {ReactNode}     children  scrollable panel body
 * @param {string}        className extra classes on the panel
 */
/* THE ROLES (RailRoles, user 2026-10-25: *"they keep making variations old and new and I want to standardize rails"*).
 * Four jobs every tool's rails do, each one shell and one key, so an app names the job and stops choosing a side, a
 * width, a scrim and a key of its own. Monitor's page rails each repeated `side="right" variant="app" backdrop={false}
 * edge={false} shadow={false} closeHover={false}`; mirror's patch table stood at 440 with its own header. An explicit
 * prop still wins over the role's.
 *
 *   patch     P  the patch / cable table — right, the app tier, over the page with no scrim (the rack stays live)
 *   page      H  the page's own settings (monitor's Stage, Rack) — THE SETTINGS RAIL'S SHELL (his review 2026-10-25:
 *                *"why is H same as labs siderail and not the same as settings?"*) without the scrim (*"H does not
 *                include dark overlay, that is only settings"*): the width, the header, typed rows; only the rows and
 *                the key are the page's
 *   settings  ,  the app's settings (SettingsPanel) — right, the app tier, THE ONE RAIL WITH THE SCRIM
 *   bottom    E  the edit rail under the page (monitor's stage and rack) — resizable, no scrim, the full width OVER the
 *                nav rail (*"it should OVERLAY the navrail … because then we can use same icon system as collapsed
 *                siderail"*): `RailNav`, the collapsed nav rail's 48 icon column, stands inside it under the nav rail
 *
 * No role draws an edge (*"why do some have border and some do not?"*, round 19 answered): a rail reads by its scrim or
 * by its content against the live page; `edge` stays the opt-in for a consumer that wants the line.
 *
 * THE STANDARD HEADER (*"title + close!! then divider!!! thats a fucking standard header!!!"*): every rail with a header
 * draws the title line with the × and the hairline under it, here — a rail never draws its own.
 *
 * THE PHONE RULE (below 768): a side rail becomes a bottom rail (70dvh, the thumb's reach), a settings-shaped rail
 * (settings, page) fills the screen, the bottom rail stands at half the height. One rule, so labs and randomiser get it
 * by naming the role. */
export const RAIL_ROLES = {
  patch: { key: 'p', side: 'right', variant: 'app', backdrop: false, edge: false, shadow: false, closeHover: false, phone: { side: 'bottom', height: '70dvh' } },
  page: { key: 'h', side: 'right', variant: 'app', backdrop: false, edge: false, shadow: false, closeHover: false, phone: { width: '100%' } },
  settings: { key: ',', side: 'right', variant: 'app', backdrop: true, edge: false, shadow: false, closeHover: false, phone: { width: '100%' } },
  bottom: { key: 'e', side: 'bottom', variant: 'app', resizable: true, height: '30dvh', minSize: 80, maxSize: 600, backdrop: false, edge: false, shadow: false, closeHover: false, phone: { height: '50dvh', resizable: false } },
}
const CODES = { ',': 'Comma' }
const typingIn = (t) => t instanceof HTMLElement && (t.isContentEditable || !!t.closest('input, textarea, select'))

/**
 * useRailKey — a role's key toggles its rail: `useRailKey('patch', () => setOpen((v) => !v))`. One bare key (P · H · ,
 * · E), never with ⌘ / Ctrl / Alt, never while typing, never on a held repeat. `enabled` false unbinds it (a route
 * without that rail). Apps that bind the key themselves (AppHub's `,`) keep doing so — this is the same rule, shipped.
 */
export function useRailKey(role, onToggle, enabled = true) {
  const ref = useRef(onToggle)
  ref.current = onToggle
  useEffect(() => {
    const key = RAIL_ROLES[role]?.key
    if (!enabled || !key) return undefined
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || typingIn(e.target)) return
      if (e.key.toLowerCase() !== key && e.code !== CODES[key]) return
      e.preventDefault()
      ref.current?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [role, enabled])
}

/* the role's shell, the phone rule over it, then whatever the call site passed (an `undefined` prop is not a pass) */
export default function Rail({ role, ...props }) {
  const phone = useMediaQuery('(max-width: 767px)')
  const r = role ? RAIL_ROLES[role] : null
  if (role && !r && import.meta.env?.DEV) console.warn(`Rail: no role "${role}" — patch · page · settings · bottom`)
  if (!r) return <RailShell {...props} />
  const { key: _k, phone: phoneRule, ...shell } = r
  const passed = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined))
  const merged = { ...shell, ...passed }
  /* on a phone the rule outranks the call site's side and width — a 380 right rail is not usable at 390 */
  if (phone) Object.assign(merged, phoneRule, phoneRule.side === 'bottom' ? { width: undefined, resizable: false } : {})
  return <RailShell {...merged} data-rail-role={role} />
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const px = (v) => (v == null ? undefined : typeof v === 'number' ? `${v}px` : v)

function RailShell({
  'data-rail-role': roleAttr,
  style,
  nav,
  open,
  onClose,
  variant,
  footer,
  side = 'left',
  mode = 'over',
  resizable = false,
  minSize = 120,
  maxSize = 960,
  onResize,
  width,
  height,
  header,
  closeSide = 'end',
  backdrop = true,
  /* THE CLOSE SITS ON THE ROW'S RUNG (user 2026-09-03, on the settings drawer:
   * *"does this button follow the size ladder?"*). It was pinned `md` (32) while
   * every control in the panel below it — the switches, the dropdowns, the reset
   * frame — is `sm` (26), so the one control that is not a setting was the
   * largest thing on the surface. A size is a height and a row is one height;
   * `sm` is the default because a drawer header sits over its own controls.
   * Named `closeSize`, not `size` — `size` is already the panel's own box. */
  closeSize = 'sm',
  closeHover = true,
  children,
  className = '',
  /* SettingsPanelApproved (2026-08-27): the settings drawer has neither */
  edge = true,
  shadow = true,
}) {
  const reduced = usePrefersReducedMotion()
  const panelRef = useRef(null)
  const vertical = side === 'top' || side === 'bottom'
  /* the rail's own size once dragged; null = the `width` / `height` given */
  const [dragged, setDragged] = useState(null)
  const [resizing, setResizing] = useState(false)
  /* THE SAME GRAB AS EVERY RAIL (his review 2026-10-25: *"why does bottom rail not have the same grab system as other
   * rails?"*): the proximity-wake pill of the nav rails (`useGrabEdge`, `.kol-rail-grab`), on the edge that faces the
   * page — a side rail's pill travels on y, a bottom or top rail's on x. It drew its own strip with a full-width wash
   * from 2026-10-17 until then. */
  const grabRef = useRef(null)
  useGrabEdge(grabRef, { axis: vertical ? 'x' : 'y' })
  const startResize = (e) => {
    if (!resizable) return
    e.preventDefault()
    const box = panelRef.current?.getBoundingClientRect()
    const start = { x: e.clientX, y: e.clientY, size: vertical ? box?.height ?? 0 : box?.width ?? 0 }
    /* the inner edge faces the page: dragging toward the page grows a left/top rail, away grows right/bottom */
    const sign = side === 'left' || side === 'top' ? 1 : -1
    const move = (ev) => {
      const d = vertical ? ev.clientY - start.y : ev.clientX - start.x
      const next = clamp(start.size + d * sign, minSize, maxSize)
      setDragged(next)
      onResize?.(next)
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); document.body.style.cursor = ''; document.body.style.userSelect = ''; setResizing(false) }
    document.body.style.cursor = vertical ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
    setResizing(true)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  /* the handle: `.kol-rail-grab` is the drawing (kol-animation.css), `--top` · `--bottom` · `--right` place it on the
   * edge facing the page; `is-dragging` keeps the pill lit through the drag */
  const grab = resizable && (
    <span
      ref={grabRef}
      role="separator"
      aria-orientation={vertical ? 'horizontal' : 'vertical'}
      aria-label="Resize"
      onPointerDown={startResize}
      className={`kol-rail-grab z-10 touch-none ${side === 'bottom' ? 'kol-rail-grab--top' : side === 'top' ? 'kol-rail-grab--bottom' : side === 'right' ? 'kol-rail-grab--right' : ''} ${resizing ? 'is-dragging' : ''}`.replace(/\s+/g, ' ').trim()}
    />
  )
  const push = mode === 'push'

  /* Mount/slide state machine: `present` keeps the portal mounted through
   * the exit slide; `shown` drives the transform/opacity classes. Reduced
   * motion collapses both onto `open` — instant show/hide, no transform. */
  const [present, setPresent] = useState(open)
  const [shown, setShown] = useState(open)

  useEffect(() => {
    if (reduced) {
      setPresent(open)
      setShown(open)
      return undefined
    }
    if (open) {
      setPresent(true)
      // double rAF: let the off-screen position paint before sliding in
      let raf2
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true))
      })
      return () => {
        cancelAnimationFrame(raf1)
        if (raf2) cancelAnimationFrame(raf2)
      }
    }
    setShown(false)
    const t = setTimeout(() => setPresent(false), 200) // matches duration-200
    return () => clearTimeout(t)
  }, [open, reduced])

  // Escape closes; Tab is trapped inside the panel while open — while this is the TOP layer
  // (`layerStack`: a sheet opened over the drawer owns the keyboard until it closes)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    if (!open || push) return undefined
    const layer = pushLayer()
    const onKey = (e) => {
      if (!isTopLayer(layer)) return
      if (e.key === 'Escape') {
        onCloseRef.current?.()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const nodes = panel.querySelectorAll(FOCUSABLE)
      if (!nodes.length) {
        e.preventDefault()
        panel.focus()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (!panel.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { popLayer(layer); document.removeEventListener('keydown', onKey) }
  }, [open])

  /* Body scroll-lock + focus in/out. Gated on `present` too so the panel
   * exists before we focus it (it mounts one commit after `open` flips). */
  useEffect(() => {
    if (!(open && present) || push) return undefined
    lockScroll()
    const prevFocus = document.activeElement
    panelRef.current?.focus()
    return () => {
      unlockScroll()
      if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
  }, [open, present, push])

  /* the tier's width stands in for an absent `width` on a side rail; a bottom or top rail keeps its own height */
  const tierWidth = variant && !vertical && width == null ? `var(--kol-rail-w-${variant})` : undefined
  const extent = dragged ?? (vertical ? height : width ?? tierWidth)
  /* the tier's padding, else the overlay inset — one variable the classes below read */
  const pad = { '--kol-pad-rail': variant ? `var(--kol-pad-rail-${variant})` : 'var(--kol-pad-overlay)' }
  /* the edge that faces the page carries the border, on every side */
  const edgeCls = edge ? ({ left: 'border-r', right: 'border-l', top: 'border-b', bottom: 'border-t' })[side] : ''

  if (push) {
    /* in the layout: the rail's size animates between 0 and its extent; its parent owns the row/column */
    const sizeStyle = vertical ? { height: open ? px(extent) ?? 'auto' : 0 } : { width: open ? px(extent) ?? 'auto' : 0 }
    return (
      <div
        ref={panelRef}
        data-rail-role={roleAttr}
        aria-hidden={!open || undefined}
        className={`relative shrink-0 overflow-hidden bg-surface-primary border-oq-08 ${open ? edgeCls : ''} ${reduced ? '' : 'transition-[width,height] duration-200 ease-out'} ${className}`}
        style={{ ...sizeStyle, ...pad, ...style }}
      >
        {grab}
        <div className="flex h-full flex-col p-[var(--kol-pad-rail)]">
          {header != null && <div className="mb-3 min-w-0">{header}</div>}
          {header != null && <Divider className="mb-6" />}
          <div className="flex-1 overflow-auto" style={{ overflowAnchor: 'none' }}>{children}</div>
          {footer != null && <div className="kol-rail-foot shrink-0 -mx-[var(--kol-pad-rail)] border-t border-oq-08 px-[var(--kol-pad-rail)] pt-4">{footer}</div>}
        </div>
      </div>
    )
  }

  if (!present || typeof document === 'undefined') return null

  const slideOut = { bottom: 'translate-y-full', top: '-translate-y-full', right: 'translate-x-full', left: '-translate-x-full' }[side] ?? '-translate-x-full'
  const motionPanel = reduced
    ? ''
    : `transition-transform duration-200 ease-out ${shown ? (vertical ? 'translate-y-0' : 'translate-x-0') : slideOut}`
  const place = vertical
    /* no `w-full`: left and right 0 give the width, so a consumer's `left` offset (monitor's bottom rail beside its
       sidebar) narrows the rail instead of pushing it past the viewport */
    ? `inset-x-0 ${side === 'bottom' ? 'bottom-0' : 'top-0'} max-h-full ${edgeCls}`
    : `inset-y-0 max-w-full ${side === 'right' ? 'right-0' : 'left-0'} ${edgeCls} ${extent == null ? 'w-full' : ''}`
  /* padding per side (RailOverlay): a bottom rail clears the home bar at its foot; a top rail its notch */
  const safe = vertical
    ? (side === 'bottom' ? { paddingBottom: 'calc(var(--kol-pad-rail) + env(safe-area-inset-bottom, 0px))' } : { paddingTop: 'calc(var(--kol-pad-rail) + env(safe-area-inset-top, 0px))' })
    : undefined
  /* with a `nav` the safe-area padding belongs to the padded stack, not the panel — else the nav column stops short of
   * the rail's bottom edge (his review 2026-10-25: *"bottom rail sidebar border stop at padding? should go all the way down"*) */
  const size = vertical
    ? { ...(extent != null ? { height: px(extent) } : {}), ...(nav != null ? {} : safe) }
    : extent != null ? { width: px(extent) } : undefined
  const motionBackdrop = reduced
    ? ''
    : `transition-opacity duration-200 ease-out ${shown ? 'opacity-100' : 'opacity-0'}`

  return createPortal(
    <>
      {backdrop && (
        /* A BUTTON, not a div (OverlayScrimTapDismiss, 2026-09-01): iOS Safari
         * does not bubble tap-clicks from non-interactive elements, so a div
         * scrim's onClick never fires on a phone — the same line that broke
         * the search overlay's dismiss. */
        <button
          type="button"
          aria-label="Close"
          className={`fixed inset-0 z-[100] kol-overlay-scrim ${motionBackdrop}`}
          onClick={onClose}
        />
      )}
      <div
        ref={panelRef}
        data-rail-role={roleAttr}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        /* `edge` / `shadow` (SettingsPanelApproved, 2026-08-27): the approved settings
         * drawer has neither — the sheet meets the page flat */
        className={`fixed z-[200] flex ${nav != null ? 'flex-row' : 'flex-col p-[var(--kol-pad-rail)]'} bg-surface-primary outline-none ${backdrop && shadow ? 'shadow-2xl' : ''} ${place} border-oq-08 ${motionPanel} ${className}`}
        style={{ ...size, ...pad, ...style }}
      >
        {grab}
        {nav}
        <div className={nav != null ? 'flex min-h-0 min-w-0 flex-1 flex-col p-[var(--kol-pad-rail)]' : 'contents'} style={nav != null ? safe : undefined}>
        {/* closeSide="start": the reference sets the × glyph ~9px deeper than
          * the label column's edge, with extra top air (both reference frames
          * 2026-08-09 measure the same inset) */}
        {/* 12 from the title line to the hairline (his rulings 2026-10-25: 24 → *"I would drop it to 16"* → *"thats too big. make 8px or 12px"*) */}
        <div className={`mb-3 flex items-center gap-4${closeSide === 'start' ? ' pt-3 pl-2' : ''}`}>
          {/* closeSide="start" — the record-surface anatomy (reference frame,
            * 2026-08-09): × leads, the header's actions sit at the far end. */}
          {closeSide === 'start' && (
            /* bare glyph, no container (user 2026-08-09: "the X close icon
             * does not need a container") — body ink at rest, emphasis on hover */
            <CloseButton onClick={onClose} size={closeSize} hover={closeHover} className="shrink-0" />
          )}
          {header != null && <div className="min-w-0 flex-1">{header}</div>}
          {/* A NORMAL ICON BUTTON (user 2026-09-02: *"it should just be like a
            * normal button with a close icon, its not new?"*). It carried
            * `iconSize={14}` — kept in 2026-08-01 to preserve the glyph size the
            * hand-rolled button before it happened to have — so the box sat at
            * the md rung's 32px around a glyph six under it, and it read as an
            * oversized empty square. No override: the rung sets both. */}
          {closeSide !== 'start' && (
            <CloseButton onClick={onClose} size={closeSize} hover={closeHover} className="ml-auto shrink-0" />
          )}
        </div>
        {/* THE STANDARD HEADER's hairline (review 2, 2026-10-25): under the title line on every rail — the settings rail
          * drew its own until now and the page rails had none. 24 under it, the same air a section divider gets
          * (*"THEY SHOULD BOTH BE the same!"*) */}
        {header != null && <Divider className="mb-6" />}
        <div className="flex-1 overflow-y-auto pr-1" style={{ overflowAnchor: 'none' }}>
          {children}
        </div>
        {/* THE FOOT IS A BAND (his review 2026-10-25, the nav rail's Settings foot as the model: *"why dont we do this for
          * below on right rail … that would also solve the fixed footer and scrolling would clip there"*): the hairline
          * runs the rail's full width, outside the scroller, so the content clips at the rule and the foot never moves —
          * the Rail draws it, as it draws the header's; `SettingsFooter` and `RailFoot` draw no rule of their own */}
        {footer != null && <div className="kol-rail-foot shrink-0 -mx-[var(--kol-pad-rail)] border-t border-oq-08 px-[var(--kol-pad-rail)] pt-4">{footer}</div>}
        </div>
      </div>
    </>,
    document.body,
  )
}
