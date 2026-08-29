import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Button } from '@kolkrabbi/kol-component'
import { GRAB } from '@kolkrabbi/kol-component/utilities/motion'
import { Icon } from '@kolkrabbi/kol-icons'
import Logomark from './Logomark.jsx'

/**
 * NavRail — the flat rail. ONE fixed column, every child a direct child of it
 * (RailFlatGrabOpen, kol-mirror 2026-08-28 — user, on the monitor rail he
 * measured it against: "the div structure is super simple ok … it's 1 div
 * parent and everything is just in that container", and on the SideNav-backed
 * rail that had replaced it: it was "impossible" to get this shape out of it).
 *
 * This REVERSES RailSideNavPixelParity (0.13.0), which made the rail a collapsed
 * kol-framework `SideNav`. That ticket's pixel argument is settled the other way:
 * the rail does not share pixels with the brand sidebar because it never becomes
 * one. `RailLogomarkAtTop` stands — the mark is at the top in both states.
 *
 * THE GRAB OPENS IT (user: "when you grab it should not move the icons one
 * pixel, only reveal the title, and a chevron to see sub categories" · "when it
 * opens it should push the main content inside"). Closed, every row is the rail
 * minus its gutter — the 32px rung alone shows and the label and chevron exist
 * but are clipped by the row's own width. Open, the clip reveals them. Nothing
 * in the icon column moves between the two states, and the content column
 * follows because AppShell offsets by the same live variable.
 *
 * ONE WIDTH VARIABLE: `--kol-shell-rail-width` on `:root` — this rail is that
 * wide and AppShell's content is offset by it, written per pointermove during a
 * drag and tweened on release, so the page is pushed live through both. A drag
 * writes the DOM, not React state: a pointermove per frame is not a render.
 *
 * The pill is kol-r2b2's, verbatim (user: "make it like it is in kol-r2b2, it
 * has animation and gsap") — `.kol-rail-grab` in kol-theme's kol-animation.css,
 * its pointer numbers in kol-component's `utilities/motion` (`GRAB`).
 *
 * TWO LEVELS (RailTwoLevelSections, kol-fxr 2026-08-28 — user: "the NAV has 20px
 * icons in 32px containers, maybe level below has 12px icons in 20px container
 * aligned to right? … you expand you see that they have main 56 items each, which
 * you won't be aware of until you actually open labs, which should not happen
 * automatically"). An item with `sub` is a SECTION: the same L1 row, plus a caret.
 * Its rows are L2 — a 12px glyph in a 20px box, indented so its glyph column sits
 * to the RIGHT of L1's (glyph x 14 → 30), resting a rung quieter at `oq-64` and
 * going `oq-96` when it is the route. fxr's labs chrome is ~44 rows across four
 * method sections; on one level they flatten into an icon column built for five
 * destinations and the section names have nowhere to render at all.
 *
 * L2 is NOT a `Button`: the icon-button ladder is sm 28 / md 32 / lg 36 and this
 * rung is 20 — there is nothing below sm, and adding one is a change to that
 * ladder's law, which is the user's call and not this ticket's. The row is
 * written directly and keys `aria-current`, so kol-theme's
 * `.kol-shell-rail .kol-btn-nav` active rules still reach it. A sub row with no
 * `icon` renders label-only, as it did before this level existed.
 *
 * NOTHING AUTO-EXPANDS. An L2 row is behind BOTH the rail's clipped width and its
 * section's own disclosure, and `open` starts `false` with no prop to get it
 * wrong — arriving on a route reveals nothing, by construction rather than by a
 * flag a consumer has to remember.
 *
 * @param {Array}  items        `{ icon, path, label, sub?: [{ icon?, path, label }] }`
 * @param {Array}  bottomItems  pinned below the rule (Settings)
 * @param {Object} logomark     `{ svgUrl, title }` — the mark, and the app name beside it when open
 * @param {string} currentPath  active match: '/' exact, else prefix → aria-current="page"
 * @param {Function} onNavigate `(path) => void` — every click, the mark included
 */
const RAIL_W = '--kol-shell-rail-width'
const CLOSED = 48

/* the OPEN width is the sidenav's ladder (kol-framework: 264, 320 from 1536),
 * read at drag time so the rail lands on whichever rung the window is on */
const openWidth = () => {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--kol-sidenav-w').trim()
  const px = parseFloat(v)
  return Number.isFinite(px) ? (v.endsWith('rem') ? px * 16 : px) : 264
}

/* THE GRAB EDGE — proximity, not contact: the pill wakes within `GRAB.near` of
 * the line and sleeps only past `GRAB.sleep` (hovering the line itself flapped
 * the class every frame and restarted the fade). Along the line it DWELLS (user
 * ruling 2026-08-28: "make it come to the cursor but have some sticky time where
 * it lands, so it's not constantly jerking"): it targets the pointer's own
 * position and re-targets only once the pointer is `GRAB.stick` px away, so it
 * lands on you, holds while you move inside the radius, then travels to where you
 * are now — inside `GRAB.range`, the middle band of the edge, so it never rides
 * up beside the logomark. One window listener, rAF-throttled. */
function useGrabEdge(ref) {
  useEffect(() => {
    let raf = 0
    const onMove = ({ clientX, clientY }) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = ref.current
        if (!h) return
        const r = h.getBoundingClientRect()
        const dist = Math.abs(clientX - (r.left + r.width / 2))
        const near = dist <= GRAB.near || (h.classList.contains('is-near') && dist <= GRAB.sleep)
        h.classList.toggle('is-near', near)
        if (!near) return
        /* the travel band: bipolar from the middle, GRAB.range of the height */
        const edge = (r.height * (1 - GRAB.range)) / 2
        const along = Math.min(Math.max(clientY - r.top, edge), r.height - edge)
        if (h.dataset.grabSeeded && Math.abs(along - Number(h.dataset.grabTarget)) < GRAB.stick) return
        h.dataset.grabTarget = String(along)
        const vars = { '--kol-rail-grab-y': `${along}px` }
        /* the CSS fallback is 50%, a percentage — nothing to tween from, so the
         * first sighting sets and every move after tweens */
        if (h.dataset.grabSeeded) gsap.to(h, { ...vars, ...GRAB.travel, overwrite: 'auto' })
        else { gsap.set(h, vars); h.dataset.grabSeeded = '1' }
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [ref])
}

/* THE DRAG — hold the pill and the width follows the pointer between closed and
 * open; release snaps to the nearer state, a click (no travel past GRAB.slop)
 * toggles. `onSnap` reports the resting state once — the sub rows render only
 * while open, because closed they would still take their height and push the
 * rungs below them. */
function useRailDrag(railRef, grabRef, onSnap) {
  useEffect(() => {
    const strip = grabRef.current, rail = railRef.current, root = document.documentElement
    if (!strip || !rail) return undefined
    gsap.set(root, { [RAIL_W]: `${CLOSED}px` })
    let drag = null
    const snapTo = (w) => {
      gsap.to(root, { [RAIL_W]: `${w}px`, ...GRAB.snap, overwrite: 'auto' })
      onSnap(w !== CLOSED)
    }
    const onDown = (e) => {
      strip.setPointerCapture(e.pointerId)
      gsap.killTweensOf(root)
      drag = { x: e.clientX, w: rail.offsetWidth, open: openWidth(), moved: false }
      strip.classList.add('is-dragging')
    }
    const onMove = (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (Math.abs(dx) > GRAB.slop) drag.moved = true
      root.style.setProperty(RAIL_W, `${Math.min(Math.max(drag.w + dx, CLOSED), drag.open)}px`)
    }
    const onUp = () => {
      if (!drag) return
      const w = rail.offsetWidth
      const open = drag.open
      snapTo(drag.moved ? (w > (CLOSED + open) / 2 ? open : CLOSED) : (drag.w > CLOSED ? CLOSED : open))
      drag = null
      strip.classList.remove('is-dragging')
    }
    strip.addEventListener('pointerdown', onDown)
    strip.addEventListener('pointermove', onMove)
    strip.addEventListener('pointerup', onUp)
    strip.addEventListener('pointercancel', onUp)
    return () => {
      strip.removeEventListener('pointerdown', onDown)
      strip.removeEventListener('pointermove', onMove)
      strip.removeEventListener('pointerup', onUp)
      strip.removeEventListener('pointercancel', onUp)
    }
  }, [railRef, grabRef, onSnap])
}

/* one row: the rung exactly where the closed rail had it, then the label and
 * (with `sub`) the chevron — the row clips to the rail's width */
/* the L2 glyph goes through the same injection seam Button gives L1 */
function IconAt({ name, size, component }) {
  const Cmp = component || Icon
  return <Cmp name={name} size={size} />
}

function RailItem({ icon, path, label, sub, currentPath, onNavigate, iconComponent, railOpen }) {
  const [open, setOpen] = useState(false)
  const active = path === '/' ? currentPath === '/' : currentPath.startsWith(path)
  return (
    <>
      <div className="flex items-center gap-3 w-full overflow-hidden shrink-0">
        <Button
          iconOnly={icon}
          iconSize={20}
          iconComponent={iconComponent}
          variant="nav"
          size="md"
          className="shrink-0"
          /* nav ACTIVE keys off aria-current="page" (kol-components-atoms.css) —
           * a brighter glyph, never the pressed fill */
          aria-current={active ? 'page' : undefined}
          /* oq-96 on every rung: the nav variant's oq-64 rest is site-nav quiet
           * and too dim on an icon rail (user: "make the color .96 on every icon
           * in the rail") */
          style={{ color: 'var(--kol-oq-96)' }}
          onClick={() => onNavigate?.(path)}
          title={label}
          aria-label={label}
        />
        <span
          className="kol-helper-12 uppercase text-oq-96 flex-1 min-w-0 truncate cursor-pointer"
          onClick={() => onNavigate?.(path)}
        >
          {label}
        </span>
        {sub?.length > 0 && (
          <Button
            iconOnly={open ? 'chevron-down' : 'chevron-right'}
            iconSize={16}
            iconComponent={iconComponent}
            variant="nav"
            size="sm"
            className="shrink-0"
            style={{ color: 'var(--kol-oq-96)' }}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            title={label}
            aria-label={`${label} sub categories`}
          />
        )}
      </div>
      {railOpen && open && sub.map((s) => {
        const on = s.path === '/' ? currentPath === '/' : currentPath.startsWith(s.path)
        return (
          <div
            key={s.path}
            /* 18px of gutter puts the 20px box at x 26, so its 12px glyph starts
             * at 30 — one step right of L1's 20-in-32 at 14 (measured in fxr) */
            className="flex items-center gap-3 w-full overflow-hidden shrink-0 cursor-pointer"
            style={{ paddingLeft: 18 }}
            onClick={() => onNavigate?.(s.path)}
            aria-current={on ? 'page' : undefined}
            title={s.label}
          >
            {s.icon && (
              <span
                className="w-5 h-5 shrink-0 inline-flex items-center justify-center"
                style={{ color: on ? 'var(--kol-oq-96)' : 'var(--kol-oq-64)' }}
                aria-hidden="true"
              >
                <IconAt name={s.icon} size={12} component={iconComponent} />
              </span>
            )}
            <span
              className="kol-helper-12 uppercase flex-1 min-w-0 truncate"
              style={{ color: on ? 'var(--kol-oq-96)' : 'var(--kol-oq-64)' }}
            >
              {s.label}
            </span>
          </div>
        )
      })}
    </>
  )
}

export default function NavRail({
  items = [],
  bottomItems = [],
  logomark,
  currentPath = '',
  onNavigate,
  iconComponent,
  hidden = false,
}) {
  const railRef = useRef(null)
  const grabRef = useRef(null)
  const [railOpen, setRailOpen] = useState(false)
  useGrabEdge(grabRef)
  useRailDrag(railRef, grabRef, setRailOpen)
  if (hidden) return null
  const row = (item) => (
    <RailItem key={item.path} {...item} currentPath={currentPath} onNavigate={onNavigate} iconComponent={iconComponent} railOpen={railOpen} />
  )
  return (
    <div
      ref={railRef}
      className="kol-shell-rail bg-surface-primary border-r border-fg-08 fixed inset-y-0 left-0 flex flex-col items-start pt-4 pb-4 px-2 gap-2"
      style={{ width: `var(${RAIL_W})` }}
    >
      <div ref={grabRef} className="kol-rail-grab" />
      {logomark && (
        /* the mark, and the app name beside it when open — uppercase like the
         * rows (user 2026-08-28: "uppercase CONSISTENCY"). The `w-8` centring box
         * puts the 20px mark on the same x as the 20px glyphs below it. */
        <div
          onClick={() => onNavigate?.('/')}
          className="text-oq-96 cursor-pointer flex items-center gap-3 w-full overflow-hidden shrink-0 pt-1 mb-4"
          title={logomark.title}
        >
          <span className="w-8 flex justify-center shrink-0"><Logomark svgUrl={logomark.svgUrl} size={20} /></span>
          <span className="kol-helper-12 uppercase flex-1 min-w-0 truncate">{logomark.title}</span>
        </div>
      )}
      {items.map(row)}
      {/* the spacer IS the layout */}
      <div className="flex-1" />
      {/* the rule runs the full rail width, out past the px-2 */}
      {bottomItems.length > 0 && <div className="self-stretch -mx-2 border-t border-fg-08" />}
      {bottomItems.map(row)}
    </div>
  )
}
