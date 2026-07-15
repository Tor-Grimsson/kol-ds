import { useEffect, useRef, useState } from 'react'

export const stage = 'full'

/* ChessAnalysisLayout is a 100dvh apparatus — the board budgets its own size
 * off the viewport height, so any div-framed inline render either squeezes or
 * clips it. The demo therefore IFRAMES the standalone set preview (the same
 * `<ChessAnalysisLayout chessData={chessData} />` inside the consumer's exact
 * shell wrapper — see sets/chess-apparatus.jsx) at a TRUE desktop width
 * (1280), scaled to fit the docs column — media queries fire at 1280, so the
 * preview is always the desktop apparatus at real proportions. */
export default function ChessAnalysisLayoutDemo() {
  const ref = useRef(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  const s = w ? Math.min(1, w / 1280) : 1
  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12"
      style={{ height: Math.round(800 * s) }}
    >
      <iframe
        src="/sets/preview/chess-apparatus"
        title="ChessAnalysisLayout"
        className="block border-0"
        style={{ width: 1280, height: 800, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left' }}
      />
    </div>
  )
}
