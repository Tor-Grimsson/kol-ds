import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

// ── Firework ────────────────────────────────────────────────────────

// Type A — cross burst (original)
const framesA = [
  [
    '    *    ',
    '   /|\\   ',
    '  * ─ *  ',
    '   \\|/   ',
    '    *    ',
  ],
  [
    '  · * ·  ',
    " '  |  ' ",
    '· ─ * ─ ·',
    " '  |  ' ",
    '  · * ·  ',
  ],
  [
    ' ·     · ',
    "   ' '   ",
    '·   *   ·',
    "   ' '   ",
    ' ·     · ',
  ],
  [
    '  ·   ·  ',
    '    ·    ',
    ' ·     · ',
    '    ·    ',
    '  ·   ·  ',
  ],
  [
    '         ',
    '    ·    ',
    '  ·   ·  ',
    '    ·    ',
    '         ',
  ],
]

// Type B — ring burst
const framesB = [
  [
    '  ░░░░░  ',
    ' ░     ░ ',
    '░   ▒   ░',
    ' ░     ░ ',
    '  ░░░░░  ',
  ],
  [
    ' ▒ ░ ░ ▒ ',
    '░       ░',
    '    ·    ',
    '░       ░',
    ' ▒ ░ ░ ▒ ',
  ],
  [
    '·       ·',
    '  ░   ░  ',
    '    ·    ',
    '  ░   ░  ',
    '·       ·',
  ],
  [
    '         ',
    '  ·   ·  ',
    '         ',
    '  ·   ·  ',
    '         ',
  ],
  [
    '         ',
    '    ·    ',
    '         ',
    '    ·    ',
    '         ',
  ],
]

// Type C — diamond scatter
const framesC = [
  [
    '    ◆    ',
    '  ◆ ◆ ◆  ',
    '◆ ◆ ◆ ◆ ◆',
    '  ◆ ◆ ◆  ',
    '    ◆    ',
  ],
  [
    '   · ◇ ·   ',
    ' ◇       ◇ ',
    '·    ◆    ·',
    ' ◇       ◇ ',
    '   · ◇ ·   ',
  ],
  [
    ' ·       · ',
    '    ◇ ◇    ',
    '  ◇   ◇  ',
    '    ◇ ◇    ',
    ' ·       · ',
  ],
  [
    '           ',
    '   ·   ·   ',
    '     ·     ',
    '   ·   ·   ',
    '           ',
  ],
  [
    '           ',
    '     ·     ',
    '   ·   ·   ',
    '     ·     ',
    '           ',
  ],
]

const allFrameSets = [framesA, framesB, framesC]

const Firework = ({ x, y, type, onDone }) => {
  const [frame, setFrame] = useState(0)
  const frames = allFrameSets[type]

  // Advance frames on a clock; report completion from an effect. `onDone` used
  // to be called inside the setFrame updater — React runs updaters during the
  // child's render, so the parent's setFireworks fired mid-render ("Cannot
  // update a component (AsciiCursor) while rendering Firework") on every
  // burst. The updater also restarted the interval on each parent re-render
  // (onDone is a fresh closure per render), stalling the burst while the
  // cursor moved. (mobile audit 2026-08-25)
  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => Math.min(f + 1, frames.length - 1)), 130)
    return () => clearInterval(interval)
  }, [frames])
  const doneRef = useRef(false)
  useEffect(() => {
    if (doneRef.current || frame < frames.length - 1) return
    doneRef.current = true
    onDone()
  }, [frame, frames, onDone])

  return (
    <div
      className="fixed font-mono text-[14px] leading-none pointer-events-none select-none"
      style={{
        left: x,
        top: y,
        color: 'var(--kol-surface-on-primary)',
        opacity: Math.max(0.15, 1 - frame * 0.2),
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'pre',
        textAlign: 'center',
      }}
    >
      {frames[frame]?.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  )
}

// ── Space Invader ───────────────────────────────────────────────────

const invaderSprite = [
  '    ████████    ',
  '  ████████████  ',
  '████████████████',
  '████  ████  ████',
  '████████████████',
  '████████████████',
  '  ████    ████  ',
  '  ██        ██  ',
  '████        ████',
]

const Bullet = ({ startX, startY, delay }) => {
  const y = useMotionValue(startY)

  useEffect(() => {
    const timeout = setTimeout(() => {
      animate(y, startY + 300, { duration: 0.5, ease: 'linear' })
    }, delay)
    return () => clearTimeout(timeout)
  }, [y, startY, delay])

  return (
    <motion.div
      style={{ x: startX, y }}
      className="absolute font-mono text-[4px] pointer-events-none select-none"
    >
      <div style={{ color: 'var(--kol-surface-on-primary)' }}>│</div>
    </motion.div>
  )
}

const Invader = ({ x, y, onDone }) => {
  const [bullets, setBullets] = useState([])
  const posX = useMotionValue(x)
  const posY = useMotionValue(y - 60)

  useEffect(() => {
    // Drop in
    animate(posY, y, { duration: 0.3, ease: 'easeOut' })

    // Shoot 3 bullets
    const shot1 = setTimeout(() => setBullets(prev => [...prev, { id: 1, x: x }]), 250)
    const shot2 = setTimeout(() => setBullets(prev => [...prev, { id: 2, x: x }]), 450)
    const shot3 = setTimeout(() => setBullets(prev => [...prev, { id: 3, x: x }]), 650)

    // Exit right
    const exit = setTimeout(() => {
      animate(posX, x + window.innerWidth * 0.6, { duration: 0.7, ease: 'easeIn' })
    }, 800)

    // Cleanup
    const done = setTimeout(onDone, 1800)

    return () => {
      clearTimeout(shot1)
      clearTimeout(shot2)
      clearTimeout(shot3)
      clearTimeout(exit)
      clearTimeout(done)
    }
  }, [x, y, posX, posY, onDone])

  return (
    <>
      <motion.div
        style={{ x: posX, y: posY }}
        className="absolute font-mono text-[3px] leading-none pointer-events-none select-none whitespace-pre"
      >
        <pre style={{ color: 'var(--kol-surface-on-primary)', opacity: 0.6, transform: 'translate(-50%, -50%)' }}>
          {invaderSprite.join('\n')}
        </pre>
      </motion.div>
      {bullets.map(bullet => (
        <Bullet key={bullet.id} startX={bullet.x} startY={posY.get() + 15} delay={0} />
      ))}
    </>
  )
}

// ── Cursor Stars ────────────────────────────────────────────────────

const starChars = ['·', '+', '*', '+', '·', '-', '·']

const CursorStars = () => {
  const [stars, setStars] = useState([])
  const mouseRef = useRef({ x: -100, y: -100 })
  const nextStarId = useRef(0)

  useEffect(() => {
    const handleMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // Spawn a star at a random offset from cursor every 800–2000ms
  useEffect(() => {
    const spawn = () => {
      const angle = Math.random() * Math.PI * 2
      const dist = 30 + Math.random() * 50
      const id = ++nextStarId.current
      setStars(prev => [...prev, {
        id,
        x: mouseRef.current.x + Math.cos(angle) * dist,
        y: mouseRef.current.y + Math.sin(angle) * dist,
        char: starChars[Math.floor(Math.random() * starChars.length)],
      }])
      // Self-remove after fade completes
      setTimeout(() => setStars(prev => prev.filter(s => s.id !== id)), 1200)
      // Schedule next spawn
      timeout = setTimeout(spawn, 400 + Math.random() * 800)
    }
    let timeout = setTimeout(spawn, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="fixed font-mono pointer-events-none select-none"
          style={{
            left: star.x,
            top: star.y,
            color: 'var(--kol-surface-on-primary)',
            fontSize: '16px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {star.char}
        </motion.div>
      ))}
    </>
  )
}

// ── ASCII Crosshair ─────────────────────────────────────────────────

// Default crosshair — heavy ticks
const defaultCrosshair = [
  '  ╻  ',
  '╺ · ╸',
  '  ╹  ',
]

// Hover crosshair — diamond
const hoverCrosshair = [
  '  ◇  ',
  '◇ · ◇',
  '  ◇  ',
]

const AsciiCrosshair = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      // Temporarily hide overlay so elementFromPoint sees through it
      const overlay = document.getElementById('ascii-cursor-overlay')
      if (overlay) overlay.style.pointerEvents = 'none'
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (overlay) overlay.style.pointerEvents = ''
      setHovering(!!el?.closest('a, button, [role="button"], input, textarea, select, label[for]'))
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const crosshair = hovering ? hoverCrosshair : defaultCrosshair

  return (
    <div
      className="fixed font-mono text-[10px] leading-[1.1] pointer-events-none select-none"
      style={{
        left: mousePos.x,
        top: mousePos.y,
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'pre',
        textAlign: 'center',
      }}
    >
      {/* Dark backing layer — offset by 1px in each direction */}
      {[-1, 1].map(dx =>
        [-1, 1].map(dy => (
          <div
            key={`${dx}${dy}`}
            className="absolute inset-0"
            style={{
              color: 'var(--kol-surface-primary)',
              opacity: 0.8,
              transform: `translate(${dx}px, ${dy}px)`,
            }}
          >
            {crosshair.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        ))
      )}
      {/* Foreground layer — opacity is theme-scoped in index.css (.ascii-cursor-fg): boosted in light mode */}
      <div className="ascii-cursor-fg" style={{ color: 'var(--kol-surface-on-primary)', position: 'relative' }}>
        {crosshair.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  )
}

// ── Main overlay ────────────────────────────────────────────────────

let nextId = 0

const AsciiCursor = () => {
  const [fireworks, setFireworks] = useState([])
  const [invaders, setInvaders] = useState([])
  const containerRef = useRef(null)
  const lastInvaderTime = useRef(0)

  const removeFirework = useCallback((id) => {
    setFireworks(prev => prev.filter(f => f.id !== id))
  }, [])

  const removeInvader = useCallback((id) => {
    setInvaders(prev => prev.filter(inv => inv.id !== id))
  }, [])

  // Hide native cursor — restore on mouseleave or window blur (dev tools)
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'ascii-cursor-hide'

    const hide = () => {
      style.textContent = '*, *::before, *::after { cursor: none !important; }'
      if (!style.parentNode) document.head.appendChild(style)
    }
    const show = () => {
      style.textContent = ''
    }

    document.addEventListener('mouseenter', hide)
    document.addEventListener('mouseleave', show)
    window.addEventListener('blur', show)
    window.addEventListener('focus', hide)
    hide()

    return () => {
      document.removeEventListener('mouseenter', hide)
      document.removeEventListener('mouseleave', show)
      window.removeEventListener('blur', show)
      window.removeEventListener('focus', hide)
      style.remove()
    }
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      const id = ++nextId
      const roll = Math.random()
      const type = roll < 0.6 ? 0 : roll < 0.8 ? 1 : 2
      setFireworks(prev => [...prev, { id, x: e.clientX, y: e.clientY, type }])
    }

    /* No preventDefault: the invader is an easter egg, the context menu is the
     * browser's. Swallowing it took away copy/open-in-new-tab/inspect on every
     * page of the site to spawn a sprite. */
    const handleContextMenu = (e) => {
      const now = Date.now()
      if (now - lastInvaderTime.current < 2500) return
      lastInvaderTime.current = now
      const id = ++nextId
      setInvaders(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      id="ascii-cursor-overlay"
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ cursor: 'none' }}
    >
      <AsciiCrosshair />
      <CursorStars />
      {fireworks.map(fw => (
        <Firework key={fw.id} x={fw.x} y={fw.y} type={fw.type} onDone={() => removeFirework(fw.id)} />
      ))}
      {invaders.map(inv => (
        <Invader key={inv.id} x={inv.x} y={inv.y} onDone={() => removeInvader(inv.id)} />
      ))}
    </div>
  )
}

export default AsciiCursor
