import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { Icon } from '@kolkrabbi/kol-icons'
import { glyphSize } from '../hooks/glyphLadders.js'

/**
 * ActionButton — an icon control that CONFIRMS what it did (2026-08-15 user
 * ruling: *"where is the 'code copied' or whatever message"*).
 *
 * The confirm-flip existed exactly once, welded to the clipboard inside
 * CopyButton: fire, swap `copy`→`check` for 2s, flip the accessible label.
 * Nothing else could reuse it, so every other in-frame control — download,
 * select, anything a card puts over its media — had no way to acknowledge a
 * click at all. This is that behaviour with the clipboard taken out of it;
 * CopyButton is now a six-line wrapper around it and keeps its own API.
 *
 * The swap is ANIMATED, which the original was not — it hard-cut between two
 * glyphs. framer-motion is already a declared peer of this package (TiltCard),
 * so nothing new is installed. The curve is the house curve — the numeric twin
 * of `--kol-ease-house`, since gsap takes an array and cannot read a CSS var.
 * If the token moves, `HOUSE_EASE` below moves with it by hand; that is the one
 * place in the DS where the curve is duplicated rather than referenced.
 *
 * Chrome is IconFrame's — `kol-icon-frame kol-icon-frame-{variant} -{size}`,
 * emitted the way Dropdown emits `kol-btn` classes. 05-control-chrome.md:109:
 * *"Any icon-only control in chrome is IconFrame variant="nav" size="…" —
 * nothing hand-writes the square (user ruling 2026-08-01)."* This component
 * hand-wrote one for a day; it does not any more.
 *
 * A DIMMED REST IS A VARIANT SWAP, NOT A STATE (same doc). `nav` rests at
 * oq-64, `ghost` at oq-48, both static — so there is no hover ladder here and
 * none should be added.
 *
 * `plate` is the doc's ONE named exception: an affordance over a PHOTO needs an
 * opaque plate plus a backdrop blur to stay legible over arbitrary pixels, and
 * no Button variant covers it. The plate is the discriminator, not a list.
 *
 * Positioning stays the parent's job: pass `.kol-frame-control` to sit it in a
 * card's corner, or nothing to leave it in flow.
 *
 * @param {string}   icon         glyph at rest
 * @param {string}   confirmIcon  glyph while confirming (default 'check')
 * @param {string}   label        accessible label at rest
 * @param {string}   confirmLabel accessible label while confirming
 * @param {Function} onAction     (event) => void | Promise — awaited; the
 *                                confirm only fires once it resolves
 * @param {string}   href         renders an <a> instead of a <button>
 * @param {number}   hold         ms to hold the confirm state (default 2000)
 * @param {string}   size         sm | md | lg — the pinned square (28/32/36)
 *                                and its SOLO glyph (16/20/24) move together,
 *                                resolved from hooks/glyphLadders.js. This was
 *                                a raw px number and defaulted to 16 in a 32px
 *                                box: the sm glyph in the md square, which is
 *                                the exact hand-transcription the ladders file
 *                                exists to stop.
 * @param {number}   iconSize     px override for the glyph only — the square
 *                                never moves with it (2026-07-28 law)
 * @param {boolean}  toggle       STICKY instead of timed — the on-state holds
 *                                until clicked again, and `confirmIcon` is the
 *                                on-glyph (star → star-solid), not a receipt.
 *                                A confirm says "that happened"; a toggle says
 *                                "this IS", and the two must not share a timer.
 * @param {string}   chrome       WHICH control this is. Three separate styles,
 *                                no shared base — they had one, and every edit
 *                                to a shared rule moved all of them:
 *                                  'copy'   .kol-copy-btn      CodeBlock's, untouched
 *                                  'media'  .kol-media-control boxed, over a photo
 *                                  'inline' .kol-inline-control bare, inside text
 */
const HOUSE_EASE = [0.4, 0, 0.2, 1]

/* long enough that the press is unmistakably a state, short enough that it is
 * not a mode. The release then plays the full bounce out. */
const PRESS_HOLD = 1600

const SWAP_MS = 500

const CHROME = {
  copy: 'kol-copy-btn',
  media: 'kol-media-control',
  inline: 'kol-inline-control',
}

export default function ActionButton({
  icon,
  confirmIcon,
  label,
  confirmLabel,
  onAction,
  href,
  hold = 2000,
  size = 'md',
  iconSize,
  chrome = 'copy',
  toggle = false,
  className = '',
  ...rest
}) {
  const [done, setDone] = useState(false)
  /* CSS :active lasts exactly as long as the mouse button is down — about 50ms
   * on a real click — so no duration or curve can make the press read. The
   * pressed state is HELD here instead, then released to animate out. */
  const [pressed, setPressed] = useState(false)
  const timer = useRef(null)
  const pressTimer = useRef(null)

  /* the timer outlives the click — clear it if the control unmounts mid-hold,
   * or React warns and the callback fires into a dead component */
  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(pressTimer.current) }, [])

  const handle = async (event) => {
    clearTimeout(pressTimer.current)
    setPressed(true)
    pressTimer.current = setTimeout(() => setPressed(false), PRESS_HOLD)
    if (onAction) await onAction(event)
    clearTimeout(timer.current)
    if (toggle) {
      setDone((on) => !on)
      return
    }
    setDone(true)
    timer.current = setTimeout(() => setDone(false), hold)
  }

  const aria = (done && confirmLabel) || label
  const base = CHROME[chrome] ?? CHROME.copy
  const cls = `${base}${toggle && done ? ` ${base}--on` : ''}${pressed ? ` ${base}--pressed` : ''} ${className}`.trim()
  const glyphPx = iconSize ?? glyphSize(size, true)

  /* THE SWAP IS A MORPH where the glyphs allow it (user ruling 2026-08-15).
   * Both glyphs are mounted in one cell; when each side is a single <path>,
   * MorphSVG tweens the path data so one shape BECOMES the other. Multi-path
   * glyphs (download is 3, trash is 5) cannot morph 1:1, so they cross over on
   * the same clock instead — the timing stays identical either way. */
  const restRef = useRef(null)
  const onRef = useRef(null)
  const first = useRef(true)

  /* A CROSSFADE between two real glyphs, not a morph. MorphSVG rewrote the
   * path `d` in the DOM to tween between shapes — which mutates the icon the
   * set shipped. If a state needs a different shape, that shape is an icon in
   * the set (`star` / `star-solid`), not something computed at runtime. */
  useLayoutEffect(() => {
    const rest = restRef.current
    const on = onRef.current
    /* no confirmIcon = ONE glyph, and the state is carried by the class alone
     * (a fill, a colour). Nothing to crossfade. */
    if (!rest || !on) return undefined

    if (first.current) {
      first.current = false
      gsap.set(rest, { autoAlpha: 1 })
      gsap.set(on, { autoAlpha: 0 })
      return undefined
    }

    const from = done ? rest : on
    const to = done ? on : rest
    const ctx = gsap.context(() => {
      gsap.to(from, { autoAlpha: 0, duration: SWAP_MS / 1000, ease: 'power1.inOut' })
      gsap.to(to, { autoAlpha: 1, duration: SWAP_MS / 1000, ease: 'power1.inOut' })
    })
    return () => ctx.revert()
  }, [done])

  const glyph = (
    <span className="kol-action-glyph relative inline-grid place-items-center" style={{ width: glyphPx, height: glyphPx }}>
      <span ref={restRef} className="inline-flex" style={{ gridArea: '1 / 1' }}>
        <Icon name={icon} size={glyphPx} />
      </span>
      {confirmIcon && (
        <span ref={onRef} className="inline-flex" style={{ gridArea: '1 / 1', opacity: 0 }}>
          <Icon name={confirmIcon} size={glyphPx} />
        </span>
      )}
    </span>
  )

  /* The element follows the affordance — IconFrame's contract, same reasoning:
   * a link must be a real <a> for middle-click, focus order and screen readers. */
  if (href) {
    return (
      <a className={cls} href={href} onClick={handle} aria-label={aria} title={aria} {...rest}>
        {glyph}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={handle} aria-label={aria} title={aria} {...rest}>
      {glyph}
    </button>
  )
}
