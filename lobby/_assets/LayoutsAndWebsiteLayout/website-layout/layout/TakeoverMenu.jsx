import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Icon } from '@kolkrabbi/kol-icons'
import { Divider } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import kolLogomarkSvg from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?raw'

gsap.registerPlugin(useGSAP)

/**
 * TakeoverMenu — the site's ONE navigation surface, extracted from Navbar so
 * other chromes (workshop) can mount the same menu without carrying the top
 * bar. Full-bleed opaque takeover (ref. roscoproduction.com): big logomark
 * top-left, studio block + instagram + theme toggle bottom-left, the seven
 * nav links bottom-right.
 *
 * Controlled: `open` drives the GSAP in/out (the panel stays mounted so the
 * close tween can play; autoAlpha keeps it click-dead when closed), `onClose`
 * fires on Escape and on any link click. The trigger button stays with the
 * caller — Navbar's hamburger, workshop's floating +.
 */

/* Six links, flat. Workshop is a link like the others — its own sidebar owns
 * its tree once you're inside it, so the menu doesn't mirror it. */
export const NAV_ITEMS = [
  { to: '/studio', label: 'Studio' },
  { to: '/work', label: 'Work' },
  { to: '/foundry', label: 'Foundry' },
  { to: '/stack', label: 'Stack' },
  { to: '/prints', label: 'Prints' },
  { to: '/workshop', label: 'Workshop' }
]

export default function TakeoverMenu({ open, onClose }) {
  const menuRef = useRef(null)

  /* Takeover housekeeping: Escape closes, and the page behind doesn't scroll —
   * it's an opaque mode, not a scrim over live content. Lock the html element
   * too — the page scrolls on documentElement, so body-only overflow still
   * leaves the real scrollbar live. */
  useGSAP(() => {
    /* The old choreography summed to ~0.9s before the last link landed
     * (0.35 fade → 0.08 delay → 8 × 0.05 stagger → 0.5 rise) and read as lag.
     * The panel snaps, the items follow at once; `overwrite` stops a fast
     * open/close from stacking tweens on the same targets. */
    if (open) {
      gsap.to(menuRef.current, { autoAlpha: 1, duration: 0.18, ease: 'power2.out', overwrite: 'auto' })
      gsap.fromTo(
        '[data-menu-item]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.025, overwrite: 'auto' }
      )
    } else {
      gsap.to(menuRef.current, { autoAlpha: 0, duration: 0.18, ease: 'power2.in', overwrite: 'auto' })
    }
  }, { dependencies: [open], scope: menuRef })

  /* useEffect, NOT useGSAP: useGSAP with `dependencies` reverts its context only
   * on unmount, so the unlock below never ran on close — html stayed
   * overflow:hidden after every menu use until a reload (2026-08-26). */
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
    }
  }, [open])

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-40 bg-surface-secondary shadow-[0_0_0_120px_var(--kol-surface-secondary)] flex flex-col justify-between gap-8 overflow-y-auto px-4 md:px-6 lg:px-8 pt-8 pb-8 md:pb-12"
      style={{ visibility: 'hidden', opacity: 0 }}
      aria-hidden={!open}
    >
      {/* pt-8 = the header's py-4 plus the 16px the user pushed the logo down.
        * THE STRIP (2026-09-01 → 09-02): with Safari's toolbar collapsed to the
        * pill, a real iPhone showed the page's footer in a ~46px band under the
        * menu. `inset-0`, then `h-dvh`, then `h-[100lvh]` all left it — because
        * iOS paints the document under the collapsed pill but that band is
        * OUTSIDE the layout viewport, so no `bottom:0` and no viewport unit
        * reaches it. The spread shadow is a 120px halo of the panel's own
        * surface past every edge (three are off-screen); it is not clipped by
        * the panel's overflow and fades with autoAlpha. `inset-0` alone tracks
        * the layout viewport exactly at every moment, so the height is back
        * off. Only a real iPhone can prove this; desktop makes the units equal. */}
      <Link to="/" onClick={onClose} className="inline-flex w-fit" aria-label="Kolkrabbi home">
        <span className="inline-flex h-24 md:h-56 lg:h-72 [&>svg]:h-full [&>svg]:w-auto" role="img" aria-label="Kolkrabbi" dangerouslySetInnerHTML={{ __html: kolLogomarkSvg }} />
      </Link>

      {/* One row at every width, both columns bottom-aligned — the nav links
        * reach the bottom edge and the socials/theme pair sits beside them,
        * not under them (user 2026-09-01). The tagline copy above them is
        * desktop furniture and hides below md. */}
      <div className="flex flex-row items-end justify-between gap-8">
        <div className="flex flex-col items-start gap-6" data-menu-item>
          <p className="hidden md:block kol-sans-heading-02 font-medium max-w-[520px]">
            <span className="block">Kolkrabbi Vinnustofa</span>
            <span className="block">Design studio &amp; Atelier based in Reykjavík</span>
            <span className="block">Typefaces &amp; Design Systems</span>
          </p>
          <p className="hidden md:block kol-mono-16 max-w-[520px]">
            A design studio focused on typography, digital products, and creative technology.
          </p>
          <Divider className="hidden md:block w-full max-w-[520px]" />
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            {/* underline on the handle only — the icon stays clean; 1px keeps
              * the relative weight of the 4px-on-heading-01 links, pb gives the
              * trailing underscore air so glyph and line don't merge. */}
            <a
              href="https://www.instagram.com/kolkrabbi_/"
              target="_blank"
              rel="noopener noreferrer"
              className="kol-mono-14 inline-flex items-center gap-3"
            >
              <Icon name="social-instagram" size={16} />
              <span className="kol-link-underline [--kol-link-underline-size:1px] pb-0.5">@kolkrabbi_</span>
            </a>
            {/* flush · label (docs/visual-reference pick) — labeled,
              * so it titles itself; no Tooltip wrapper. */}
            <ThemeToggle variant="flush" />
          </div>
        </div>

        <nav aria-label="Primary" className="flex flex-col items-end gap-3 md:gap-4 text-right shrink-0">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="kol-sans-heading-01 kol-link-underline [--kol-link-underline-size:4px]"
              data-menu-item
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
